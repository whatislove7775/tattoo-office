import { randomUUID as uuid } from "node:crypto";
import { sessionBooking } from "./booking-sessions.js";
import { fail } from "./domain.js";

const one = async (q, sql, params = []) => (await q.query(sql, params)).rows[0];

// Итоговый счёт по завершённому сеансу. Используется и кнопкой «Выставить счёт»,
// и автоматикой после окончания сеанса. Вызывающий держит блокировку настроек.
export async function createInvoice(q, booking, { duration, settings, actor = null, auto = false }) {
  const b = booking;
  if (!b || b.status !== "confirmed") fail("Счёт доступен для подтверждённой брони");
  if (new Date(b.starts_at) > new Date()) fail("Сеанс ещё не начался");
  const tracked = sessionBooking(b);
  if (tracked && !b.started_at) fail("Мастер ещё не начал сеанс", 409);
  const hours = Number(duration || b.tariff);
  if (tracked ? hours !== b.tariff : ![3, 6, 12].includes(hours) || hours < b.tariff)
    fail(tracked ? "Длительность меняется при продлении сеанса" : "Можно выбрать текущий тариф или выше");
  const u = await one(q, "SELECT * FROM users WHERE id=$1", [b.user_id]);
  const rates = b.policy?.rates || settings.rates[["resident", "guest"].includes(u?.role) ? u.role : "resident"];
  const rate = b.policy?.loyaltyFree ? 0 : hours === b.tariff ? b.rate : rates[hours];
  const total = rate + b.extras.reduce((sum, x) => sum + x.qty * x.price, 0);
  const amount = Math.max(0, total - b.deposit);
  await q.query("UPDATE bookings SET tariff=$1,rate=$2,total=$3,status=$4,finished_at=CASE WHEN $6 THEN now() ELSE finished_at END WHERE id=$5", [hours, rate, total, amount ? "invoiced" : "completed", b.id, tracked]);
  let paymentId = null;
  if (amount) {
    paymentId = uuid();
    await q.query("INSERT INTO payments(id,booking_id,kind,amount) VALUES($1,$2,'final',$3)", [paymentId, b.id, amount]);
  }
  await q.query("INSERT INTO outbox(id,kind,payload) VALUES($1,'invoice.created',$2)", [uuid(), JSON.stringify({ bookingId: b.id })]);
  await q.query("INSERT INTO audit VALUES($1,$2,$3,$4,now())", [uuid(), actor, auto ? "invoice.auto" : "invoice.create", JSON.stringify({ id: b.id, total })]);
  return { paymentId, total, amount };
}
