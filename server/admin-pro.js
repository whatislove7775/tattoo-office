import { randomUUID as uuid } from "node:crypto";
import { fail, integer, slot, validEmail, validPassword, hashPassword, verifyPassword, normalizePromoCode, validCity, validSchedule } from "./domain.js";

// Владелец студии видит всё. Администратор смены (profile.staffLevel = "shift")
// работает с расписанием и бронями, но не с деньгами, настройками и правами.
export const isOwner = (user) => user?.role === "admin" && user.profile?.staffLevel !== "shift";
// У админа смены нет почты: в базе хранится служебный адрес, который никогда не показывается и не получает писем.
export const SHIFT_EMAIL_DOMAIN = "shift-admin.invalid";
export const shiftAdminEmail = (id) => `${id}@${SHIFT_EMAIL_DOMAIN}`;
export const hideShiftEmail = (email) => (String(email || "").endsWith("@" + SHIFT_EMAIL_DOMAIN) ? "" : email);
// Админ смены входит только по паролю, поэтому у каждого админа смены пароль свой.
const SHIFT_ADMINS = "SELECT id,password FROM users WHERE role='admin' AND active AND deleted_at IS NULL AND profile->>'staffLevel'='shift'";
export async function shiftAdminsByPassword(q, password) {
  const rows = (await q.query(SHIFT_ADMINS)).rows;
  return rows.filter((u) => verifyPassword(password, u.password)).map((u) => u.id);
}
export async function assertShiftPasswordFree(q, password, userId) {
  if ((await shiftAdminsByPassword(q, password)).some((id) => id !== userId)) fail("Такой пароль уже у другого админа смены. Придумайте другой — по нему админ смены входит без почты", 409);
}
export const ownerOnly = (req, res, next) =>
  isOwner(req.user) ? next() : res.status(403).json({ error: "Доступно только владельцу студии" });

const MSK_DAY = "(date_trunc('day', now() AT TIME ZONE 'Europe/Moscow') AT TIME ZONE 'Europe/Moscow')";
const BOOKED = "('confirmed','invoiced','completed')";

async function periodStats(q, days, offsetDays) {
  const from = `now() - interval '${days + offsetDays} days'`, to = `now() - interval '${offsetDays} days'`;
  const row = (await q.query(`SELECT
      (SELECT count(*) FROM bookings WHERE status IN ${BOOKED} AND starts_at>=${from} AND starts_at<${to})::int AS bookings,
      (SELECT count(*) FROM bookings WHERE status='cancelled' AND starts_at>=${from} AND starts_at<${to})::int AS cancellations,
      (SELECT count(*) FROM bookings WHERE status='no_show' AND starts_at>=${from} AND starts_at<${to})::int AS no_shows,
      (SELECT COALESCE(sum(p.amount),0) FROM payments p WHERE p.status='paid' AND p.created_at>=${from} AND p.created_at<${to})::bigint AS revenue,
      (SELECT COALESCE(sum(extract(epoch FROM ends_at-starts_at)/3600),0) FROM bookings WHERE status IN ${BOOKED} AND starts_at>=${from} AND starts_at<${to})::float AS hours,
      (SELECT count(*) FROM users WHERE account_type='master' AND deleted_at IS NULL AND created_at>=${from} AND created_at<${to})::int AS new_masters,
      (SELECT count(*) FROM resources WHERE active AND NOT deleted)::int AS places`)).rows[0];
  const capacity = row.places * 24 * days;
  return { bookings: row.bookings, cancellations: row.cancellations, noShows: row.no_shows, revenue: Number(row.revenue), newMasters: row.new_masters, utilization: capacity ? Math.round((row.hours / capacity) * 1000) / 10 : 0 };
}

export function adminProRoutes(app, { db, one, lock, audit, enqueue, ledger, settings, staff, session, available, expire }) {
  // ---------- Обзор: пульт дня ----------
  app.get("/api/admin/overview", staff, async (req, res) => {
    const s = await settings();
    const rule = { sessions: 8, days: 60, inactiveDays: 90, ...(s.residentRule || {}) };
    const [today, freeNow, money, invoices, cancels, feedback, lowStock, incomplete, candidates, inactive, risky, waitlist, failed, places] = await Promise.all([
      db.query(`SELECT b.id,b.starts_at,b.ends_at,b.status,b.total,b.deposit,u.name AS user_name,u.id AS user_id,r.name AS resource_name,r.city FROM bookings b JOIN users u ON u.id=b.user_id JOIN resources r ON r.id=b.resource_id WHERE b.starts_at>=${MSK_DAY} AND b.starts_at<${MSK_DAY}+interval '1 day' AND b.status NOT IN ('cancelled','expired') ORDER BY b.starts_at`),
      db.query(`SELECT r.id,r.name,r.city FROM resources r WHERE r.active AND NOT r.deleted AND NOT EXISTS(SELECT 1 FROM bookings b WHERE b.resource_id=r.id AND b.status IN ('pending','confirmed','invoiced','cancel_requested') AND b.starts_at<=now() AND b.ends_at>now()) AND NOT EXISTS(SELECT 1 FROM blocks k WHERE (k.resource_id=r.id OR k.resource_id IS NULL) AND k.starts_at<=now() AND k.ends_at>now()) ORDER BY r.city,r.name`),
      db.query(`SELECT (SELECT COALESCE(sum(total),0) FROM bookings WHERE starts_at>=${MSK_DAY} AND starts_at<${MSK_DAY}+interval '1 day' AND status IN ('pending','confirmed','invoiced','completed','cancel_requested'))::bigint AS expected,
        (SELECT COALESCE(sum(amount),0) FROM payments WHERE status='paid' AND created_at>=${MSK_DAY})::bigint AS received`),
      db.query(`SELECT b.id,b.starts_at,b.total,b.deposit,u.name AS user_name,p.id AS payment_id,p.amount FROM bookings b JOIN users u ON u.id=b.user_id LEFT JOIN payments p ON p.booking_id=b.id AND p.kind='final' AND p.status='pending' WHERE b.status='invoiced' ORDER BY b.starts_at`),
      db.query(`SELECT b.id,b.starts_at,u.name AS user_name FROM bookings b JOIN users u ON u.id=b.user_id WHERE b.status='cancel_requested' ORDER BY b.starts_at`),
      db.query("SELECT count(*)::int AS n FROM feedback WHERE status='new'"),
      db.query("SELECT id,name,stock,min_stock FROM catalog WHERE active AND kind='product' AND stock<=min_stock ORDER BY stock"),
      db.query("SELECT id,name FROM users WHERE deleted_at IS NULL AND active AND account_type='master' AND role IN ('guest','resident') AND (COALESCE(profile->>'avatar','')='' OR length(COALESCE(profile->>'bio',''))<80 OR COALESCE(profile->>'city','')='') ORDER BY created_at DESC LIMIT 30"),
      db.query(`SELECT u.id,u.name,count(b.id)::int AS sessions FROM users u JOIN bookings b ON b.user_id=u.id AND b.status='completed' AND b.starts_at>now()-$2*interval '1 day' WHERE u.deleted_at IS NULL AND u.active AND u.role='guest' AND u.account_type='master' GROUP BY u.id HAVING count(b.id)>=$1 ORDER BY sessions DESC`, [rule.sessions, rule.days]),
      db.query(`SELECT u.id,u.name,max(b.starts_at) AS last_booking FROM users u LEFT JOIN bookings b ON b.user_id=u.id AND b.status IN ${BOOKED} WHERE u.deleted_at IS NULL AND u.active AND u.role='resident' AND u.created_at<now()-$1*interval '1 day' GROUP BY u.id HAVING max(b.starts_at) IS NULL OR max(b.starts_at)<now()-$1*interval '1 day'`, [rule.inactiveDays]),
      db.query("SELECT u.id,u.name,count(b.id)::int AS no_shows FROM users u JOIN bookings b ON b.user_id=u.id AND b.status='no_show' AND b.starts_at>now()-interval '90 days' WHERE u.deleted_at IS NULL AND COALESCE(u.profile->>'fullPrepay','false')<>'true' GROUP BY u.id HAVING count(b.id)>=2"),
      db.query("SELECT w.id,w.date,w.hour,w.duration,w.city,u.name AS user_name FROM waitlist w JOIN users u ON u.id=w.user_id WHERE w.notified_at IS NULL AND w.date>=(now() AT TIME ZONE 'Europe/Moscow')::date ORDER BY w.date,w.hour"),
      db.query("SELECT count(*)::int AS n FROM outbox WHERE status IN ('failed','review')"),
      db.query(`SELECT r.id,r.name,r.city,COALESCE(sum(extract(epoch FROM b.ends_at-b.starts_at)/3600) FILTER (WHERE b.status IN ${BOOKED}),0)::float AS hours FROM resources r LEFT JOIN bookings b ON b.resource_id=r.id AND b.starts_at>now()-interval '30 days' AND b.starts_at<=now() WHERE NOT r.deleted GROUP BY r.id ORDER BY r.city,r.name`),
    ]);
    const owner = isOwner(req.user);
    res.json({
      today: { bookings: today.rows, freeNow: freeNow.rows, expected: owner ? Number(money.rows[0].expected) : null, received: owner ? Number(money.rows[0].received) : null },
      attention: { invoices: invoices.rows, cancelRequests: cancels.rows, newFeedback: feedback.rows[0].n, lowStock: lowStock.rows, incompleteProfiles: incomplete.rows, residentCandidates: candidates.rows, inactiveResidents: inactive.rows, risky: risky.rows, waitlist: waitlist.rows, failedJobs: failed.rows[0].n },
      stats: owner ? { week: await periodStats(db, 7, 0), prevWeek: await periodStats(db, 7, 7), month: await periodStats(db, 30, 0), prevMonth: await periodStats(db, 30, 30) } : null,
      places: places.rows.map((r) => ({ id: r.id, name: r.name, city: r.city, utilization: Math.round((r.hours / (24 * 30)) * 1000) / 10 })),
      residentRule: rule,
    });
  });

  // ---------- Брони: перенос и неявка ----------
  app.post("/api/admin/bookings/:id/move", staff, async (req, res) => {
    await db.transaction(async (q) => {
      await lock(q);
      await expire(q);
      const b = await one(q, "SELECT * FROM bookings WHERE id=$1 FOR UPDATE", [req.params.id]);
      if (!b || !["pending", "confirmed"].includes(b.status)) fail("Перенести можно только активную будущую запись", 409);
      if (new Date(b.starts_at) <= new Date()) fail("Сеанс уже начался", 409);
      const s = await settings(q), r = await one(q, "SELECT * FROM resources WHERE id=$1 AND active AND NOT deleted", [req.body.resourceId || b.resource_id]);
      if (!r) fail("Рабочее место не найдено", 404);
      const [start, end] = slot(String(req.body.date || ""), Number(req.body.hour), b.tariff, s);
      if (!(await available(q, r.id, start, end, b.id))) fail("Это время на выбранном месте занято", 409);
      await q.query("UPDATE bookings SET resource_id=$1,starts_at=$2,ends_at=$3,policy=policy||$4::jsonb WHERE id=$5", [r.id, start, end, JSON.stringify({ city: r.city }), b.id]);
      await q.query("DELETE FROM reminders WHERE booking_id=$1", [b.id]);
      await q.query("DELETE FROM reminders_sent WHERE booking_id=$1", [b.id]);
      await enqueue(q, "calendar.upsert", { bookingId: b.id });
      await enqueue(q, "booking.moved", { bookingId: b.id });
      await audit(q, req.user.id, "booking.move", { id: b.id, from: { resource: b.resource_id, start: b.starts_at }, to: { resource: r.id, start } });
    });
    res.json({ ok: true });
  });
  app.post("/api/admin/bookings/:id/no-show", staff, async (req, res) => {
    await db.transaction(async (q) => {
      await lock(q);
      const b = await one(q, "SELECT * FROM bookings WHERE id=$1 FOR UPDATE", [req.params.id]);
      if (!b || b.status !== "confirmed") fail("Неявку можно отметить у подтверждённой записи", 409);
      if (new Date(b.starts_at) > new Date()) fail("Сеанс ещё не начался", 409);
      await q.query("UPDATE bookings SET status='no_show' WHERE id=$1", [b.id]);
      await enqueue(q, "booking.no_show", { bookingId: b.id });
      await enqueue(q, "calendar.delete", { bookingId: b.id });
      await audit(q, req.user.id, "booking.no_show", { id: b.id, depositRetained: b.deposit });
    });
    res.json({ ok: true });
  });

  // ---------- Лист ожидания (мастер встаёт в очередь на занятое время) ----------
  app.get("/api/waitlist", async (req, res) => {
    if (!req.user) return res.json({ items: [] });
    res.json({ items: (await db.query("SELECT id,city,to_char(date,'YYYY-MM-DD') AS date,hour,duration,notified_at FROM waitlist WHERE user_id=$1 AND date>=(now() AT TIME ZONE 'Europe/Moscow')::date ORDER BY date,hour", [req.user.id])).rows });
  });
  app.post("/api/waitlist", async (req, res) => {
    if (!req.user) fail("Войдите в аккаунт", 401);
    if (!["resident", "guest"].includes(req.user.role)) fail("Лист ожидания доступен мастерам", 403);
    const s = await settings(), city = validCity(String(req.body.city || "spb")), duration = Number(req.body.duration), hour = Number(req.body.hour), date = String(req.body.date || "");
    slot(date, hour, duration, s);
    const count = await one(db, "SELECT count(*)::int AS n FROM waitlist WHERE user_id=$1 AND notified_at IS NULL", [req.user.id]);
    if (count.n >= 5) fail("В листе ожидания можно держать до 5 заявок");
    const id = uuid();
    await db.query("INSERT INTO waitlist(id,user_id,city,date,hour,duration) VALUES($1,$2,$3,$4,$5,$6)", [id, req.user.id, city, date, hour, duration]);
    res.status(201).json({ id });
  });
  app.delete("/api/waitlist/:id", async (req, res) => {
    if (!req.user) fail("Войдите в аккаунт", 401);
    if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) fail("Заявка не найдена", 404);
    await db.query("DELETE FROM waitlist WHERE id=$1 AND (user_id=$2 OR $3)", [req.params.id, req.user.id, req.user.role === "admin"]);
    res.json({ ok: true });
  });

  // ---------- Пользователи: карточка, пароль, вход от имени, баланс, рассылка ----------
  app.get("/api/admin/users/:id", staff, async (req, res) => {
    if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) fail("Пользователь не найден", 404);
    const u = await one(db, "SELECT id,email,name,role,account_type,active,balance,deposit_waived,created_at,profile,telegram_id FROM users WHERE id=$1 AND deleted_at IS NULL", [req.params.id]);
    if (!u) fail("Пользователь не найден", 404);
    u.email = hideShiftEmail(u.email);
    const owner = isOwner(req.user);
    const [bookings, ledgerRows, payments] = await Promise.all([
      db.query("SELECT b.id,b.starts_at,b.ends_at,b.status,b.total,b.deposit,b.tariff,r.name AS resource_name,r.city FROM bookings b JOIN resources r ON r.id=b.resource_id WHERE b.user_id=$1 ORDER BY b.starts_at DESC LIMIT 100", [u.id]),
      owner ? db.query("SELECT amount,description,created_at FROM ledger WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50", [u.id]) : { rows: [] },
      owner ? db.query("SELECT p.id,p.kind,p.amount,p.status,p.created_at,p.provider_id FROM payments p JOIN bookings b ON b.id=p.booking_id WHERE b.user_id=$1 ORDER BY p.created_at DESC LIMIT 50", [u.id]) : { rows: [] },
    ]);
    const p = u.profile || {};
    res.json({
      user: { id: u.id, email: u.email, name: u.name, role: u.role, accountType: u.account_type, active: u.active, balance: owner ? u.balance : null, depositWaived: u.deposit_waived, createdAt: u.created_at, city: p.city || "", avatar: p.avatar || "", notes: p.adminNotes || "", fullPrepay: p.fullPrepay === true, staffLevel: p.staffLevel || "owner", telegramLinked: !!u.telegram_id },
      bookings: bookings.rows, ledger: ledgerRows.rows, payments: payments.rows,
    });
  });
  app.patch("/api/admin/users/:id/extra", ownerOnly, async (req, res) => {
    await db.transaction(async (q) => {
      await lock(q);
      const u = await one(q, "SELECT * FROM users WHERE id=$1 AND deleted_at IS NULL FOR UPDATE", [req.params.id]);
      if (!u) fail("Пользователь не найден", 404);
      const changes = {};
      if (req.body.notes !== undefined) { changes.adminNotes = String(req.body.notes).slice(0, 4000); }
      if (req.body.fullPrepay !== undefined) {
        if (typeof req.body.fullPrepay !== "boolean") fail("Проверьте настройку предоплаты");
        changes.fullPrepay = req.body.fullPrepay;
      }
      if (req.body.staffLevel !== undefined) {
        if (!["owner", "shift"].includes(req.body.staffLevel)) fail("Проверьте уровень доступа");
        if (u.role !== "admin") fail("Уровень доступа назначается администраторам");
        if (req.body.staffLevel === "shift") {
          if (u.id === req.user.id) fail("Нельзя понизить собственный доступ");
          const owners = await one(q, "SELECT count(*)::int AS n FROM users WHERE role='admin' AND active AND deleted_at IS NULL AND COALESCE(profile->>'staffLevel','owner')<>'shift' AND id<>$1", [u.id]);
          if (!owners.n) fail("Должен остаться хотя бы один владелец", 409);
        }
        changes.staffLevel = req.body.staffLevel;
        await q.query("DELETE FROM sessions WHERE user_id=$1", [u.id]);
      }
      if (Object.keys(changes).length) await q.query("UPDATE users SET profile=profile||$1::jsonb WHERE id=$2", [JSON.stringify(changes), u.id]);
      if (req.body.password !== undefined) {
        const shift = u.role === "admin" && (req.body.staffLevel ?? u.profile?.staffLevel) === "shift";
        if (shift) await assertShiftPasswordFree(q, validPassword(req.body.password), u.id);
        await q.query("UPDATE users SET password=$1 WHERE id=$2", [hashPassword(validPassword(req.body.password)), u.id]);
        await q.query("DELETE FROM sessions WHERE user_id=$1", [u.id]);
        changes.password = "changed";
      }
      await audit(q, req.user.id, "user.extra", { id: u.id, fields: Object.keys(changes) });
    });
    res.json({ ok: true });
  });
  app.post("/api/admin/users/:id/impersonate", ownerOnly, async (req, res) => {
    if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) fail("Пользователь не найден", 404);
    const u = await one(db, "SELECT * FROM users WHERE id=$1 AND deleted_at IS NULL AND active", [req.params.id]);
    if (!u) fail("Пользователь не найден", 404);
    if (u.role === "admin") fail("Нельзя войти от имени администратора", 403);
    await db.transaction(async (q) => audit(q, req.user.id, "user.impersonate", { id: u.id }));
    await session(res, u);
    res.json({ ok: true });
  });
  app.post("/api/admin/users/:id/balance", ownerOnly, async (req, res) => {
    const amount = req.body.amount, reason = String(req.body.reason || "").trim().slice(0, 200);
    if (!Number.isSafeInteger(amount) || amount === 0 || Math.abs(amount) > 10000000) fail("Укажите сумму в копейках, не равную нулю");
    if (!reason) fail("Укажите причину");
    await db.transaction(async (q) => {
      await lock(q);
      const u = await one(q, "SELECT id,balance FROM users WHERE id=$1 AND deleted_at IS NULL FOR UPDATE", [req.params.id]);
      if (!u) fail("Пользователь не найден", 404);
      if (u.balance + amount < 0) fail("На балансе недостаточно средств для списания", 409);
      await ledger(q, u.id, null, amount, (amount > 0 ? "Начисление: " : "Списание: ") + reason);
      await audit(q, req.user.id, "balance.adjust", { id: u.id, amount, reason });
    });
    res.json({ ok: true });
  });
  app.post("/api/admin/broadcast", ownerOnly, async (req, res) => {
    const message = String(req.body.message || "").trim();
    if (message.length < 3 || message.length > 2000) fail("Сообщение: от 3 до 2000 символов");
    const segment = String(req.body.segment || "masters"), city = String(req.body.city || "");
    const where = { masters: "account_type='master' AND role IN ('guest','resident')", residents: "role='resident'", guests: "role='guest' AND account_type='master'", customers: "account_type='customer'", inactive: `account_type='master' AND role IN ('guest','resident') AND NOT EXISTS(SELECT 1 FROM bookings b WHERE b.user_id=users.id AND b.starts_at>now()-interval '60 days' AND b.status IN ${BOOKED})` }[segment];
    if (!where) fail("Выберите получателей");
    if (city && !["Москва", "СПБ"].includes(city)) fail("Выберите город");
    const recipients = (await db.query(`SELECT id,email,telegram_chat_id FROM users WHERE deleted_at IS NULL AND active AND ${where} ${city ? "AND profile->>'city'=$1" : ""}`, city ? [city] : [])).rows;
    const email = req.body.email === true;
    await db.transaction(async (q) => {
      for (const u of recipients) {
        await q.query("INSERT INTO notifications(id,user_id,message) VALUES($1,$2,$3)", [uuid(), u.id, message]);
        if (email) await enqueue(q, "email.send", { to: u.email, text: message });
        if (u.telegram_chat_id) await enqueue(q, "telegram.send", { chatId: u.telegram_chat_id, text: message });
      }
      await audit(q, req.user.id, "broadcast.send", { segment, city, count: recipients.length, email });
    });
    res.json({ ok: true, count: recipients.length });
  });

  // ---------- Студия: расписание места, склад, промокоды ----------
  app.patch("/api/admin/resources/:id/schedule", ownerOnly, async (req, res) => {
    const schedule = validSchedule(req.body.schedule);
    const r = await one(db, "UPDATE resources SET schedule=$1 WHERE id=$2 AND NOT deleted RETURNING id", [JSON.stringify(schedule), req.params.id]);
    if (!r) fail("Рабочее место не найдено", 404);
    await db.transaction(async (q) => audit(q, req.user.id, "resource.schedule", { id: r.id, schedule }));
    res.json({ ok: true, schedule });
  });
  app.post("/api/admin/catalog/:id/stock", staff, async (req, res) => {
    const delta = req.body.delta, reason = String(req.body.reason || "").trim().slice(0, 200);
    if (!Number.isSafeInteger(delta) || delta === 0 || Math.abs(delta) > 100000) fail("Укажите количество, не равное нулю");
    await db.transaction(async (q) => {
      await lock(q);
      const x = await one(q, "SELECT id,stock,kind FROM catalog WHERE id=$1 FOR UPDATE", [req.params.id]);
      if (!x || x.kind !== "product") fail("Товар не найден", 404);
      if (x.stock + delta < 0) fail("Остаток не может быть меньше нуля", 409);
      await q.query("UPDATE catalog SET stock=stock+$1 WHERE id=$2", [delta, x.id]);
      await q.query("INSERT INTO stock_moves(id,catalog_id,delta,reason,actor) VALUES($1,$2,$3,$4,$5)", [uuid(), x.id, delta, reason || (delta > 0 ? "Приход" : "Списание"), req.user.id]);
    });
    res.json({ ok: true });
  });
  app.post("/api/admin/promos", ownerOnly, async (req, res) => {
    const code = normalizePromoCode(req.body.code), kind = req.body.kind;
    if (!["percent", "amount"].includes(kind)) fail("Выберите тип скидки");
    const value = integer(req.body.value, 1, kind === "percent" ? 100 : 10000000, "Скидка");
    const maxUses = req.body.maxUses === null || req.body.maxUses === "" || req.body.maxUses === undefined ? null : integer(Number(req.body.maxUses), 1, 100000, "Лимит использований");
    const expires = req.body.expiresAt ? new Date(`${req.body.expiresAt}T23:59:59+03:00`) : null;
    if (expires && Number.isNaN(+expires)) fail("Проверьте дату окончания");
    await db.transaction(async (q) => {
      await q.query("INSERT INTO promo_codes(code,kind,value,max_uses,expires_at,active,note) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(code) DO UPDATE SET kind=$2,value=$3,max_uses=$4,expires_at=$5,active=$6,note=$7", [code, kind, value, maxUses, expires, req.body.active !== false, String(req.body.note || "").slice(0, 200)]);
      await audit(q, req.user.id, "promo.save", { code });
    });
    res.json({ ok: true, code });
  });
  app.delete("/api/admin/promos/:code", ownerOnly, async (req, res) => {
    const code = normalizePromoCode(req.params.code);
    await db.transaction(async (q) => {
      const p = await one(q, "SELECT used FROM promo_codes WHERE code=$1", [code]);
      if (!p) fail("Промокод не найден", 404);
      if (p.used) await q.query("UPDATE promo_codes SET active=false WHERE code=$1", [code]);
      else await q.query("DELETE FROM promo_codes WHERE code=$1", [code]);
      await audit(q, req.user.id, "promo.delete", { code, archived: p.used > 0 });
    });
    res.json({ ok: true });
  });
  app.post("/api/promo/check", async (req, res) => {
    if (!req.user) fail("Войдите в аккаунт", 401);
    const code = normalizePromoCode(req.body.code);
    const p = await one(db, "SELECT code,kind,value,max_uses,used,expires_at,active FROM promo_codes WHERE code=$1", [code]);
    if (!p || !p.active || (p.expires_at && new Date(p.expires_at) < new Date()) || (p.max_uses !== null && p.used >= p.max_uses)) fail("Промокод недействителен или уже использован", 404);
    res.json({ code: p.code, kind: p.kind, value: p.value });
  });

  // ---------- Обращения: статус, ответ ----------
  app.post("/api/admin/feedback/:id/reply", staff, async (req, res) => {
    const text = String(req.body.text || "").trim();
    if (text.length < 2 || text.length > 4000) fail("Ответ: от 2 до 4000 символов");
    let sent = false;
    await db.transaction(async (q) => {
      const f = await one(q, "SELECT * FROM feedback WHERE id=$1 FOR UPDATE", [req.params.id]);
      if (!f) fail("Обращение не найдено", 404);
      let email = "";
      try { email = f.contact ? validEmail(f.contact) : ""; } catch { email = ""; }
      if (email) { await enqueue(q, "email.send", { to: email, text: `Ответ Tattoo Office на ваше обращение:\n\n${text}` }); sent = true; }
      if (f.user_id) await q.query("INSERT INTO notifications(id,user_id,message) VALUES($1,$2,$3)", [uuid(), f.user_id, `Ответ на ваше обращение:\n${text}`]);
      await q.query("UPDATE feedback SET reply=$1,replied_at=now(),status='done' WHERE id=$2", [text, f.id]);
      await audit(q, req.user.id, "feedback.reply", { id: f.id, emailed: sent });
    });
    res.json({ ok: true, sent });
  });
}
