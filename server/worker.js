import { randomUUID as uuid } from "node:crypto";
import { expireReservations } from "./reservations.js";
import { refreshCalendarBusy } from "./calendar-sync.js";
import { createInvoice } from "./invoicing.js";
import {
  syncCalendar,
  sendTelegram,
  sendEmail,
  receiptPayload,
  sendReceipt,
} from "./integrations.js";
const one = async (db, q, p = []) => (await db.query(q, p)).rows[0];
const labels = {
  "booking.confirmed": "Бронирование подтверждено",
  "booking.cancelled": "Бронирование отменено",
  "booking.cancel_requested": "Запрос на отмену записи",
  "invoice.created": "Выставлен итоговый счёт",
  "payment.paid": "Оплата подтверждена",
  "payment.failed": "Оплата не прошла. Попробуйте снова в личном кабинете",
  "booking.reminder": "Напоминание о сеансе",
  "booking.reminder_soon": "Сеанс начнётся через 2 часа",
  "booking.moved": "Запись перенесена",
  "booking.no_show": "Отмечена неявка на сеанс. Предоплата не возвращается",
  "invoice.reminder": "Напоминание: оплатите итоговый счёт в личном кабинете",
};
const BUSY = "('pending','confirmed','invoiced','completed','cancel_requested')";
// Свободно ли хотя бы одно место города в это время (для листа ожидания).
async function freePlace(q, city, start, end) {
  return one(q, `SELECT r.id FROM resources r WHERE r.active AND NOT r.deleted AND r.city=$1
    AND NOT EXISTS(SELECT 1 FROM bookings b WHERE b.resource_id=r.id AND b.status IN ${BUSY} AND b.starts_at<$3 AND b.ends_at>$2)
    AND NOT EXISTS(SELECT 1 FROM blocks k WHERE (k.resource_id=r.id OR k.resource_id IS NULL) AND k.starts_at<$3 AND k.ends_at>$2)
    AND NOT EXISTS(SELECT 1 FROM calendar_busy c WHERE c.resource_id=r.id AND c.starts_at<$3 AND c.ends_at>$2) LIMIT 1`, [city, start, end]);
}
async function notifyUser(q, user, text) {
  await q.query("INSERT INTO notifications(id,user_id,message) VALUES($1,$2,$3)", [uuid(), user.id, text]);
  await q.query("INSERT INTO outbox(id,kind,payload) VALUES($1,'email.send',$2)", [uuid(), JSON.stringify({ to: user.email, text })]);
  if (user.telegram_chat_id) await q.query("INSERT INTO outbox(id,kind,payload) VALUES($1,'telegram.send',$2)", [uuid(), JSON.stringify({ chatId: user.telegram_chat_id, text })]);
}
// Автоматизация студии: итоговый счёт после сеанса, напоминания, лист ожидания.
export async function automationTick(q, settings) {
  if (settings.autoInvoice === true) {
    const done = (await q.query("SELECT * FROM bookings WHERE status='confirmed' AND ends_at<now()-interval '15 minutes' ORDER BY ends_at LIMIT 20 FOR UPDATE SKIP LOCKED")).rows;
    for (const b of done) await createInvoice(q, b, { duration: b.tariff, settings, auto: true });
  }
  const remind = async (sql, kind, label) => {
    for (const b of (await q.query(sql)).rows) {
      const inserted = await q.query("INSERT INTO reminders_sent(booking_id,kind) VALUES($1,$2) ON CONFLICT DO NOTHING RETURNING booking_id", [b.id, kind]);
      if (inserted.rows.length) await q.query("INSERT INTO outbox(id,kind,payload) VALUES($1,$2,$3)", [uuid(), label, JSON.stringify({ bookingId: b.id })]);
    }
  };
  await remind("SELECT id FROM bookings WHERE status='confirmed' AND starts_at>now() AND starts_at<=now()+interval '2 hours' AND starts_at>now()+interval '15 minutes'", "soon", "booking.reminder_soon");
  await remind("SELECT id FROM bookings WHERE status='invoiced' AND ends_at<now()-interval '24 hours'", "pay", "invoice.reminder");
  const waiting = (await q.query("SELECT w.*,to_char(w.date,'YYYY-MM-DD') AS day,u.email,u.telegram_chat_id FROM waitlist w JOIN users u ON u.id=w.user_id WHERE w.notified_at IS NULL AND u.active AND w.date>=(now() AT TIME ZONE 'Europe/Moscow')::date ORDER BY w.created_at LIMIT 50")).rows;
  for (const w of waiting) {
    const start = new Date(`${w.day}T${String(w.hour).padStart(2, "0")}:00:00+03:00`), end = new Date(+start + w.duration * 3600000);
    if (+start <= Date.now()) { await q.query("UPDATE waitlist SET notified_at=now() WHERE id=$1", [w.id]); continue; }
    if (await freePlace(q, w.city, start.toISOString(), end.toISOString())) {
      await notifyUser(q, { id: w.user_id, email: w.email, telegram_chat_id: w.telegram_chat_id }, `Освободилось место: ${w.day}, ${String(w.hour).padStart(2, "0")}:00, до ${w.duration} ч. Забронируйте, пока его не заняли: ${process.env.APP_ORIGIN || "http://127.0.0.1:3000"}/#/booking`);
      await q.query("UPDATE waitlist SET notified_at=now() WHERE id=$1", [w.id]);
    }
  }
}
export async function workerTick(db) {
  try { await refreshCalendarBusy(db, 30000); }
  catch (e) { console.error("Calendar availability:", e.message); }
  await db.transaction(async (q) => {
    await q.query("SELECT id FROM settings WHERE id=1 FOR UPDATE");
    await expireReservations(q);
    const settings = (await one(q, "SELECT data FROM settings WHERE id=1"))
      .data;
    const due = (
      await q.query(
        "SELECT b.id FROM bookings b LEFT JOIN reminders r ON r.booking_id=b.id WHERE b.status='confirmed' AND b.starts_at>now() AND b.starts_at<=now()+$1*interval '1 hour' AND r.booking_id IS NULL",
        [settings.reminderHours],
      )
    ).rows;
    for (const b of due) {
      await q.query("INSERT INTO reminders VALUES($1) ON CONFLICT DO NOTHING", [
        b.id,
      ]);
      await q.query(
        "INSERT INTO outbox(id,kind,payload) VALUES($1,'booking.reminder',$2)",
        [uuid(), JSON.stringify({ bookingId: b.id })],
      );
    }
    await automationTick(q, settings);
    // A lease prevents work being lost if a process crashes. Receipt ambiguity needs human reconciliation.
    await q.query(
      "UPDATE outbox SET status='pending' WHERE status='working' AND next_at<now() AND kind NOT IN ('receipt.create','receipt.send')",
    );
    await q.query(
      "UPDATE outbox SET status='review',last_error='Проверьте чек у провайдера перед повтором' WHERE status='working' AND next_at<now() AND kind IN ('receipt.create','receipt.send')",
    );
  });
  for (let i = 0; i < 20; i++) {
    const job = await db.transaction(async (q) => {
      const j = await one(
        q,
        "SELECT * FROM outbox WHERE status='pending' AND next_at<=now() ORDER BY created_at LIMIT 1 FOR UPDATE SKIP LOCKED",
      );
      if (j)
        await q.query(
          "UPDATE outbox SET status='working',attempts=attempts+1,next_at=now()+interval '2 minutes' WHERE id=$1",
          [j.id],
        );
      return j;
    });
    if (!job) break;
    try {
      const settings = (await one(db, "SELECT data FROM settings WHERE id=1"))
        .data;
      const b = job.payload.bookingId
        ? await one(
            db,
            "SELECT b.*,r.calendar_id FROM bookings b JOIN resources r ON r.id=b.resource_id WHERE b.id=$1",
            [job.payload.bookingId],
          )
        : null;
      if (job.kind.startsWith("calendar.")) {
        if (process.env.GOOGLE_CALENDAR_SYNC_ENABLED === "true") {
          if (
            job.kind === "calendar.upsert" ||
            job.kind === "calendar.delete"
          ) {
            const cancelled = ["cancelled", "expired"].includes(b.status);
            await syncCalendar(
              b.calendar_id,
              b.id,
              job.kind === "calendar.delete" || cancelled
                ? null
                : {
                    summary: "Tattoo Office / запись " + b.id.slice(0, 8),
                    start: { dateTime: new Date(b.starts_at).toISOString() },
                    end: { dateTime: new Date(b.ends_at).toISOString() },
                    // The workspace calendar itself is private. Normal events
                    // allow the service account to edit without access to personal events.
                    visibility: "default",
                    extendedProperties: {private:{tattooOffice:"workspace"}},
                  },
            );
          } else {
            const block =
              job.payload.block ||
              (await one(db, "SELECT * FROM blocks WHERE id=$1", [
                job.payload.blockId,
              ]));
            if (block) {
              const resources = (
                await db.query(
                  "SELECT * FROM resources WHERE ($1::uuid IS NULL OR id=$1)",
                  [block.resource_id],
                )
              ).rows;
              for (const r of resources)
                await syncCalendar(
                  r.calendar_id,
                  block.id,
                  job.kind === "calendar.unblock"
                    ? null
                    : {
                        summary: "Tattoo Office / закрыто",
                        start: {
                          dateTime: new Date(block.starts_at).toISOString(),
                        },
                        end: {
                          dateTime: new Date(block.ends_at).toISOString(),
                        },
                        visibility: "default",
                        extendedProperties: {private:{tattooOffice:"workspace"}},
                      },
                );
            }
          }
        }
      } else if (job.kind === "receipt.create") {
        const payment = await one(db, "SELECT * FROM payments WHERE id=$1", [
            job.payload.paymentId,
          ]),
          user = await one(db, "SELECT * FROM users WHERE id=$1", [b.user_id]);
        const payload = receiptPayload(b, payment, user, settings);
        await db.query(
          "INSERT INTO receipts(id,payment_id,payload,status) VALUES($1,$2,$3,$4) ON CONFLICT(payment_id) DO NOTHING",
          [
            uuid(),
            payment.id,
            JSON.stringify(payload),
            settings.mode === "test" ? "simulated" : "prepared",
          ],
        );
        if (settings.mode !== "test") {
          const receipt = await one(
            db,
            "SELECT * FROM receipts WHERE payment_id=$1",
            [payment.id],
          );
          if (receipt.status === "prepared") {
            const provider = await sendReceipt(receipt.payload, receipt.id);
            await db.query(
              "UPDATE receipts SET status='submitted',provider_id=$1 WHERE id=$2",
              [provider, receipt.id],
            );
          }
        }
      } else if (job.kind === "email.auth") {
        await sendEmail(job.payload.to,job.payload.subject,job.payload.text,job.id);
        await db.query("UPDATE outbox SET payload='{}',status='done',last_error=NULL WHERE id=$1",[job.id]);
      } else if (job.kind === "email.send") {
        if (settings.mode !== "test")
          await sendEmail(
            job.payload.to,
            "Tattoo Office",
            job.payload.text,
            job.id,
          );
      } else if (job.kind === "telegram.send") {
        if (settings.mode !== "test")
          await sendTelegram(job.payload.chatId, job.payload.text);
      } else if (job.kind === "feedback.new") {
        const f = await one(db, "SELECT message FROM feedback WHERE id=$1", [job.payload.feedbackId]);
        const admins = (await db.query("SELECT id,email,telegram_chat_id FROM users WHERE active AND role='admin' AND deleted_at IS NULL")).rows;
        const text = `Новое обращение в Tattoo Office:\n${String(f?.message || "").slice(0, 500)}`;
        await db.transaction(async (q) => {
          for (const u of admins) {
            await q.query("INSERT INTO notifications(id,user_id,message) VALUES($1,$2,$3)", [uuid(), u.id, text]);
            if (u.telegram_chat_id) await q.query("INSERT INTO outbox(id,kind,payload) VALUES($1,'telegram.send',$2)", [uuid(), JSON.stringify({ chatId: u.telegram_chat_id, text })]);
          }
        });
      } else if (labels[job.kind] && b) {
        const recipients = (
          await db.query(
            "SELECT id,email,telegram_chat_id FROM users WHERE active=true AND (id=$1 OR role='admin')",
            [b.user_id],
          )
        ).rows;
        const time = new Intl.DateTimeFormat("ru-RU", {
          dateStyle: "medium",
          timeStyle: "short",
          timeZone: "Europe/Moscow",
        }).format(new Date(b.starts_at));
        const text = `${labels[job.kind]}\n${time} (МСК)\nЗапись ${b.id.slice(0, 8)}\n${process.env.APP_ORIGIN || "http://127.0.0.1:3000"}/#/cabinet`;
        await db.transaction(async (q) => {
          for (const u of recipients) {
            await q.query(
              "INSERT INTO notifications(id,user_id,message) VALUES($1,$2,$3)",
              [uuid(), u.id, text],
            );
            for (const [kind, payload] of [
              ["email.send", { to: u.email, text }],
              ...(u.telegram_chat_id
                ? [["telegram.send", { chatId: u.telegram_chat_id, text }]]
                : []),
            ])
              await q.query(
                "INSERT INTO outbox(id,kind,payload) VALUES($1,$2,$3)",
                [uuid(), kind, JSON.stringify(payload)],
              );
          }
          await q.query("UPDATE outbox SET status='done' WHERE id=$1", [
            job.id,
          ]);
        });
      }
      await db.query(
        "UPDATE outbox SET status=$1,last_error=NULL WHERE id=$2",
        [job.kind.startsWith("calendar.")
          ? process.env.GOOGLE_CALENDAR_SYNC_ENABLED === "true" ? "done" : "simulated"
          : job.kind === "email.auth" || settings.mode !== "test" ? "done" : "simulated", job.id],
      );
    } catch (e) {
      const receipt = job.kind.startsWith("receipt.");
      await db.query(
        "UPDATE outbox SET status=$1,last_error=$2,next_at=now()+$3*interval '1 second' WHERE id=$4",
        [
          receipt ? "review" : job.attempts >= 7 ? "failed" : "pending",
          String(e.message).slice(0, 300),
          Math.min(3600, 30 * 2 ** job.attempts),
          job.id,
        ],
      );
    }
  }
}
export function startWorker(db) {
  let running = false;
  const timer = setInterval(async () => {
    if (running) return;
    running = true;
    try {
      await workerTick(db);
    } catch (e) {
      console.error("Worker:", e.message);
    } finally {
      running = false;
    }
  }, 10000);
  timer.unref();
  return () => clearInterval(timer);
}
