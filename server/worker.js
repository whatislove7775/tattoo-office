import { randomUUID as uuid } from "node:crypto";
import { expireReservations } from "./reservations.js";
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
};
export async function workerTick(db) {
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
        if (settings.mode !== "test") {
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
                    visibility: "private",
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
                        visibility: "private",
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
      } else if (labels[job.kind] && b) {
        const recipients = (
          await db.query(
            "SELECT id,email,telegram_chat_id FROM users WHERE active=true AND (id=$1 OR role IN ('admin','manager'))",
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
        [settings.mode === "test" ? "simulated" : "done", job.id],
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
