import { randomUUID as uuid } from "node:crypto";
import { fail, priceAdjust, resourceOpen, slot } from "./domain.js";
import { hasBookingOverlap, paidBooking } from "./paid-booking.js";
import { yookassaEnabled, yookassaTest } from "./yookassa.js";

export const sessionGraceMinutes = 15;
export const liveCheckoutEnabled = (settings) => settings.mode === "live" && process.env.DEMO_MODE !== "1" &&
  settings.legalApproved === true && Boolean(settings.legalName && settings.inn && settings.legalAddress && settings.email) &&
  process.env.YOOKASSA_LIVE_PAYMENTS === "true";
export const checkoutEnabled = (settings) => yookassaEnabled() &&
  (yookassaTest() ? settings.mode === "test" : liveCheckoutEnabled(settings));
export const holdEnabled = (settings) => process.env.YOOKASSA_BOOKING_HOLD === "true" && checkoutEnabled(settings);

export const paidBookingEnabled = (settings) => process.env.YOOKASSA_PAID_BOOKING === "true" && settings.vat === 0 && checkoutEnabled(settings);
export const sessionBooking = (b) => holdBooking(b) || paidBooking(b);
export const holdBooking = (b) => b.policy?.bookingPayment === "hold";

export async function releaseBookingHold(q, bookingId) {
  await q.query(`UPDATE payments SET status=CASE WHEN checkout_id IS NULL THEN 'released' ELSE 'release_pending' END
    WHERE booking_id=$1 AND kind='hold' AND status IN ('pending','authorized','expired')`, [bookingId]);
}

export function sessionRoutes(app, { db, auth, lock, one, settings, available, enqueue, audit, createInvoice, addBookingExpenses, refreshCalendarBusy }) {
  const own = (q, req) => one(q, "SELECT * FROM bookings WHERE id=$1 AND user_id=$2 FOR UPDATE", [req.params.id, req.user.id]);
  const active = (b) => {
    if (!b || !sessionBooking(b) || b.status !== "confirmed" || !b.started_at || b.finished_at)
      fail("Действие доступно во время сеанса", 409);
  };

  app.post("/api/bookings/:id/start", auth, async (req, res) => {
    await db.transaction(async q => {
      await lock(q);
      const b = await own(q, req);
      if (!b || !sessionBooking(b) || b.status !== "confirmed") fail("Бронь недоступна", 409);
      if (b.started_at) return;
      if (+new Date(b.starts_at) > Date.now() || +new Date(b.ends_at) <= Date.now())
        fail("Начать сеанс можно в забронированное время", 409);
      if (holdBooking(b)) {
        const held = await one(q, "SELECT id FROM payments WHERE booking_id=$1 AND kind='hold' AND status='authorized' AND hold_expires_at>now()", [b.id]);
        if (!held) fail("Блокировка истекла. Свяжитесь с администратором", 409);
        await releaseBookingHold(q, b.id);
      } else if (!(await one(q, "SELECT id FROM payments WHERE booking_id=$1 AND kind='booking_fee' AND status='paid'", [b.id]))) {
        fail("Бронирование не оплачено", 409);
      }
      await q.query("UPDATE bookings SET started_at=now() WHERE id=$1", [b.id]);
      await audit(q, req.user.id, "booking.session.start", { id: b.id });
    });
    res.json({ ok: true });
  });

  const options = async (q, b, duration) => {
    active(b);
    const s = await settings(q);
    const start = new Date(b.ends_at);
    if (+start + sessionGraceMinutes * 60000 <= Date.now()) fail("Время для продления истекло", 409);
    const day = new Date(+start + 3 * 3600000).toISOString();
    const date = day.slice(0, 10), hour = Number(day.slice(11, 13));
    const [, end] = slot(date, hour, duration, s, +start - 1);
    const baseRate = b.policy.rates?.[duration];
    if (baseRate == null) fail("Тариф недоступен", 409);
    const rate = priceAdjust(baseRate, date, hour, b.policy.extensionPriceRules || []).rate;
    if (await hasBookingOverlap(q, b.user_id, start, end, b.id))
      fail("На это время у вас уже есть другая запись", 409);
    const resources = (await q.query("SELECT id,name,schedule FROM resources WHERE active AND NOT deleted AND city=$1 ORDER BY name", [b.policy.city])).rows;
    const free = [];
    for (const r of resources)
      if (resourceOpen(r, date, hour, duration) && await available(q, r.id, start, end)) free.push({ id:r.id, name:r.name });
    return { start, end, rate, total: b.total + rate, resources: free };
  };

  app.get("/api/bookings/:id/extension", auth, async (req, res) => {
    await refreshCalendarBusy(db);
    res.json(await db.transaction(async q => {
      await lock(q);
      return options(q, await own(q, req), Number(req.query.duration));
    }));
  });

  app.post("/api/bookings/:id/extension", auth, async (req, res) => {
    await refreshCalendarBusy(db, 0);
    const result = await db.transaction(async q => {
      await lock(q);
      const b = await own(q, req);
      active(b);
      const duration = Number(req.body.duration);
      const old = await one(q, "SELECT resource_id,ends_at,rate FROM booking_segments WHERE booking_id=$1 AND starts_at=$2", [b.id, req.body.start]);
      if (old && old.resource_id === req.body.resourceId &&
        +new Date(old.ends_at) - +new Date(req.body.start) === duration * 3600000 &&
        old.rate === req.body.rate) return { ok: true, total:b.total };
      if (new Date(b.ends_at).toISOString() !== req.body.start) fail("Сеанс уже изменился. Проверьте свободные места заново", 409);
      const quote = await options(q, b, duration);
      const resource = quote.resources.find(r => r.id === req.body.resourceId);
      if (!resource) fail("Это место уже занято или недоступно", 409);
      if (req.body.rate !== quote.rate) fail("Цена изменилась. Проверьте расчёт заново", 409);
      if (quote.total > 2147483647) fail("Достигнут предел стоимости записи", 409);
      const id = uuid();
      await q.query("INSERT INTO booking_segments VALUES($1,$2,$3,$4,$5,$6)", [id, b.id, resource.id, quote.start, quote.end, quote.rate]);
      await q.query("UPDATE bookings SET first_ends_at=COALESCE(first_ends_at,ends_at),ends_at=$2,tariff=tariff+$3,rate=rate+$4,total=total+$4 WHERE id=$1", [b.id, quote.end, duration, quote.rate]);
      await enqueue(q, "calendar.upsert", { bookingId:b.id, segmentId:id });
      await audit(q, req.user.id, "booking.session.extend", { id:b.id, segmentId:id, duration, amount:quote.rate });
      return { ok:true, total:quote.total };
    });
    res.json(result);
  });

  app.post("/api/bookings/:id/session-expenses", auth, async (req, res) => {
    const result = await db.transaction(async q => {
      await lock(q);
      const b = await own(q, req);
      const shopOnly = req.body.shop === true;
      if (shopOnly && b && !sessionBooking(b)) {
        const now = Date.now();
        if (b.status !== "confirmed" || b.policy?.masterConfirm === "awaiting" ||
          Date.parse(b.starts_at) > now || Date.parse(b.ends_at) <= now)
          fail("Товары можно добавить во время сеанса", 409);
      } else {
        active(b);
      }
      return addBookingExpenses(q, b.id, req.user.id, req.body, { shopOnly });
    });
    res.status(201).json(result);
  });

  app.post("/api/bookings/:id/finish", auth, async (req, res) => {
    const result = await db.transaction(async q => {
      await lock(q);
      const b = await own(q, req);
      if (b && sessionBooking(b) && b.finished_at) {
        const p = await one(q, "SELECT id FROM payments WHERE booking_id=$1 AND kind='final'", [b.id]);
        return { paymentId:p?.id ?? null };
      }
      active(b);
      if (req.body.expectedTotal !== b.total) fail("Сумма изменилась. Проверьте актуальный счёт в кабинете", 409);
      return createInvoice(q, b, { duration: b.tariff, settings:await settings(q), actor:req.user.id });
    });
    res.json(result);
  });
}
