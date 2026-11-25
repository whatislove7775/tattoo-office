import { cityOpen, fail, resourceOpen, slot } from "./domain.js";


export const bookingFee = 50000;
export const transferHours = 48;
export const paidBookingVersion = "paid-booking-v1";
export const paidBooking = (booking) => booking?.policy?.bookingPayment === "booking_fee";

export async function hasBookingOverlap(q, userId, start, end, except = null) {
  const result = await q.query(`SELECT id FROM bookings WHERE user_id=$1 AND id IS DISTINCT FROM $4::uuid
    AND starts_at<$3 AND ends_at>$2 AND status IN ('pending','confirmed','invoiced','completed','cancel_requested')
    AND NOT (status='cancel_requested' AND policy @> '{"bookingPayment":"booking_fee"}') LIMIT 1`, [userId,start,end,except]);
  return result.rows.length > 0;
}


export function bookingTransferRoutes(app, { db, auth, lock, one, settings, available, enqueue, audit, expire, refreshCalendarBusy }) {
  app.post("/api/bookings/:id/transfer", auth, async (req, res) => {
    const chooseSlot = Object.hasOwn(req.body, "resourceId");
    if (chooseSlot) await refreshCalendarBusy(db, 0);
    const result = await db.transaction(async (q) => {
      await lock(q);
      await expire(q);
      const b = await one(q, `SELECT b.*,r.calendar_id FROM bookings b JOIN resources r ON r.id=b.resource_id
        WHERE b.id=$1 AND b.user_id=$2 FOR UPDATE OF b`, [req.params.id, req.user.id]);
      if (!paidBooking(b)) fail("Бронь не найдена", 404);
      if (b.status === "awaiting_date" && !chooseSlot) return { status:b.status };
      const paid = await one(q, "SELECT id FROM payments WHERE booking_id=$1 AND kind='booking_fee' AND status='paid'", [b.id]);
      if (!paid || b.started_at) fail("Эта бронь недоступна для переноса", 409);

      if (!chooseSlot) {
        if (b.status !== "confirmed" || +new Date(b.starts_at) - Date.now() <= transferHours * 3600000)
          fail("Освободить время можно более чем за 48 часов до начала", 409);
        await q.query("UPDATE bookings SET status='awaiting_date' WHERE id=$1", [b.id]);
        await enqueue(q, "calendar.delete", { bookingId:b.id, calendarId:b.calendar_id, removedSlot:true });
        await audit(q, req.user.id, "booking.transfer.release", { id:b.id, start:b.starts_at, resource:b.resource_id });
        return { status:"awaiting_date" };
      }

      const s = await settings(q);
      const [start, end] = slot(req.body.date, Number(req.body.hour), b.tariff, s);
      if (b.status === "confirmed" && b.resource_id === req.body.resourceId && +new Date(b.starts_at) === +new Date(start))
        return { status:b.status };
      if (b.status !== "awaiting_date") fail("Сначала освободите старое время", 409);
      const r = await one(q, "SELECT * FROM resources WHERE id=$1 AND active AND NOT deleted AND city=$2", [req.body.resourceId,b.policy.city]);
      if (!r || !cityOpen(s, r.city) || !resourceOpen(r, req.body.date, Number(req.body.hour), b.tariff) ||
        !(await available(q, r.id, start, end, b.id))) fail("Место недоступно. Выберите другой интервал", 409);
      if (await hasBookingOverlap(q, b.user_id, start, end, b.id))
        fail("На это время у вас уже есть запись", 409);
      await q.query("UPDATE bookings SET status='confirmed',resource_id=$2,starts_at=$3,ends_at=$4 WHERE id=$1", [b.id,r.id,start,end]);
      await q.query("DELETE FROM reminders WHERE booking_id=$1", [b.id]);
      await q.query("DELETE FROM reminders_sent WHERE booking_id=$1", [b.id]);
      await enqueue(q, "calendar.upsert", { bookingId:b.id });
      await enqueue(q, "booking.moved", { bookingId:b.id });
      await audit(q, req.user.id, "booking.transfer.confirm", { id:b.id, start, resource:r.id });
      return { status:"confirmed" };
    });
    res.json(result);
  });
}
