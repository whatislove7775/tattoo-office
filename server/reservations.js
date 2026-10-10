import { randomUUID } from "node:crypto";
// Caller holds the settings row lock, serializing allocation, cancellation and expiry.
export async function expireReservations(q) {
  const { rows } = await q.query(
    "SELECT * FROM bookings WHERE status='pending' AND expires_at<now() FOR UPDATE",
  );
  for (const b of rows) {
    if (b.balance_used) {
      await q.query("UPDATE users SET balance=balance+$1 WHERE id=$2", [
        b.balance_used,
        b.user_id,
      ]);
      await q.query("INSERT INTO ledger VALUES($1,$2,$3,$4,$5,now())", [
        randomUUID(),
        b.user_id,
        b.id,
        b.balance_used,
        "Резерв истёк: возврат баланса",
      ]);
    }
    for (const x of b.extras)
      if (x.kind === "product")
        await q.query("UPDATE catalog SET stock=stock+$1 WHERE id=$2", [
          x.qty,
          x.id,
        ]);
    await q.query(
      "UPDATE bookings SET status='expired',balance_used=0 WHERE id=$1",
      [b.id],
    );
    await q.query(
      "UPDATE payments SET status='expired' WHERE booking_id=$1 AND status='pending'",
      [b.id],
    );
  }
}
