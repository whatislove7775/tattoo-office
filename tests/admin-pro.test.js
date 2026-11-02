import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { database } from "../server/db.js";
import { createApp } from "../server/index.js";
import { hashToken, priceAdjust, resourceOpen, promoDiscount } from "../server/domain.js";
import { automationTick } from "../server/worker.js";

const day = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

test("pricing helpers: night/weekend percent, place hours, promo discounts", () => {
  assert.equal(priceAdjust(200000, "2026-10-24", 23, { nightPercent: 20, weekendPercent: 10 }).rate, 260000);
  assert.equal(priceAdjust(200000, "2026-10-26", 12, { nightPercent: 20, weekendPercent: 10 }).rate, 200000);
  assert.equal(resourceOpen({ schedule: { days: [1, 2, 3, 4, 5], openHour: 10, closeHour: 22 } }, "2026-10-24", 12, 3), false);
  assert.equal(resourceOpen({ schedule: { days: [1, 2, 3, 4, 5], openHour: 10, closeHour: 22 } }, "2026-10-26", 12, 3), true);
  assert.equal(resourceOpen({ schedule: { openHour: 10, closeHour: 22 } }, "2026-10-26", 20, 3), false);
  assert.equal(promoDiscount({ kind: "percent", value: 15 }, 200000), 30000);
  assert.equal(promoDiscount({ kind: "amount", value: 300000 }, 200000), 200000);
});

test("admin automation: overview, move, no-show, waitlist, promo, balance, roles, feedback", async () => {
  process.env.DATA_DIR = "memory://";
  const db = await database(), app = await createApp(db), server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.on("listening", r));
  const origin = "http://127.0.0.1:" + server.address().port;
  try {
    const login = async (name, role, extra = {}) => {
      const id = randomUUID(), token = "t-" + id;
      await db.query("INSERT INTO users(id,email,password,name,role,account_type,profile) VALUES($1,$2,'unused',$3,$4,$5,$6)", [id, `${name.toLowerCase()}@test.invalid`, name, role, role === "admin" ? "admin" : "master", JSON.stringify(extra)]);
      await db.query("INSERT INTO sessions VALUES($1,$2,now()+interval '1 day')", [hashToken(token), id]);
      return { id, call: async (path, method = "GET", data) => { const r = await fetch(origin + "/api" + path, { method, headers: { Cookie: "office_session=" + token, ...(data ? { "Content-Type": "application/json" } : {}) }, body: data ? JSON.stringify(data) : undefined }); return { status: r.status, data: await r.json().catch(() => ({})), cookie: r.headers.get("set-cookie") }; } };
    };
    const owner = await login("Owner", "admin"), shift = await login("Shift", "admin", { staffLevel: "shift" });
    const master = await login("Master", "guest"), other = await login("Other", "guest");
    const places = (await (await fetch(origin + "/api/public")).json()).resources;

    // Overview for owner has money and stats, for a shift admin money is hidden.
    const ov = await owner.call("/admin/overview");
    assert.equal(ov.status, 200);
    assert.ok(Array.isArray(ov.data.today.bookings) && ov.data.stats.week && typeof ov.data.today.received === "number");
    const ovShift = await shift.call("/admin/overview");
    assert.equal(ovShift.data.today.received, null);
    assert.equal(ovShift.data.stats, null);

    // Shift admin cannot touch settings, users, money; owner can.
    assert.equal((await shift.call("/admin/settings", "PATCH", { deposit: 1 })).status, 403);
    assert.equal((await shift.call("/admin/users/" + master.id + "/balance", "POST", { amount: 1000, reason: "x" })).status, 403);
    assert.deepEqual((await shift.call("/admin")).data.payments, []);
    assert.equal((await owner.call("/admin/settings", "PATCH", { priceRules: { nightPercent: 25, nightFrom: 22, nightTo: 8, weekendPercent: 0 }, autoInvoice: true, residentRule: { sessions: 1, days: 60, inactiveDays: 90 } })).status, 200);
    const log = (await owner.call("/admin")).data.settingsLog;
    assert.ok(log[0].details.changed.includes("priceRules"));

    // Night surcharge applies to the rent.
    const night = await master.call("/bookings", "POST", { resourceId: places[0].id, date: day(3), hour: 23, duration: 3, extras: [] });
    assert.equal(night.status, 201, JSON.stringify(night.data));
    const nightBooking = (await db.query("SELECT rate,policy FROM bookings WHERE id=$1", [night.data.bookingId])).rows[0];
    assert.equal(nightBooking.rate, 250000);
    assert.equal(nightBooking.policy.pricePercent, 25);

    // Promo code: discount on rent, use counted, released when the reservation expires.
    assert.equal((await owner.call("/admin/promos", "POST", { code: "office10", kind: "percent", value: 10, maxUses: 1 })).status, 200);
    assert.equal((await master.call("/promo/check", "POST", { code: "OFFICE10" })).data.value, 10);
    const promoBooking = await master.call("/bookings", "POST", { resourceId: places[1].id, date: day(4), hour: 12, duration: 3, extras: [], promo: "office10" });
    assert.equal(promoBooking.status, 201, JSON.stringify(promoBooking.data));
    assert.equal((await db.query("SELECT rate FROM bookings WHERE id=$1", [promoBooking.data.bookingId])).rows[0].rate, 180000);
    assert.equal((await other.call("/bookings", "POST", { resourceId: places[2].id, date: day(4), hour: 12, duration: 3, extras: [], promo: "OFFICE10" })).status, 409);
    await db.query("UPDATE bookings SET expires_at=now()-interval '1 minute' WHERE id=$1", [promoBooking.data.bookingId]);
    await fetch(origin + "/api/availability?date=" + day(4) + "&duration=3");
    assert.equal((await db.query("SELECT used FROM promo_codes WHERE code='OFFICE10'")).rows[0].used, 0);

    // Confirm the night booking through the test payment, then move it.
    assert.equal((await master.call("/payments/" + night.data.paymentId + "/test", "POST", {})).status, 200);
    const moved = await shift.call("/admin/bookings/" + night.data.bookingId + "/move", "POST", { resourceId: places[1].id, date: day(5), hour: 10 });
    assert.equal(moved.status, 200, JSON.stringify(moved.data));
    const after = (await db.query("SELECT resource_id,starts_at FROM bookings WHERE id=$1", [night.data.bookingId])).rows[0];
    assert.equal(after.resource_id, places[1].id);
    // Moving onto an occupied slot is refused.
    const blocker = await other.call("/bookings", "POST", { resourceId: places[2].id, date: day(6), hour: 10, duration: 3, extras: [] });
    assert.equal(blocker.status, 201);
    assert.equal((await owner.call("/admin/bookings/" + night.data.bookingId + "/move", "POST", { resourceId: places[2].id, date: day(6), hour: 11 })).status, 409);

    // Place hours: a weekdays-only place refuses weekend bookings.
    assert.equal((await owner.call("/admin/resources/" + places[3].id + "/schedule", "PATCH", { schedule: { days: [1, 2, 3, 4, 5], openHour: 10, closeHour: 22 } })).status, 200);
    let weekend = 1; while (![0, 6].includes(new Date(day(weekend) + "T12:00:00+03:00").getUTCDay())) weekend++;
    assert.equal((await master.call("/bookings", "POST", { resourceId: places[3].id, date: day(weekend), hour: 12, duration: 3, extras: [] })).status, 409);

    // No-show on a started confirmed booking; two no-shows flag the master as risky.
    for (const offset of [2, 3]) {
      const id = randomUUID();
      await db.query("INSERT INTO bookings(id,user_id,resource_id,starts_at,ends_at,tariff,rate,total,status,deposit) VALUES($1,$2,$3,now()-$4*interval '1 day',now()-$4*interval '1 day'+interval '3 hours',3,200000,200000,'confirmed',50000)", [id, other.id, places[0].id, offset]);
      assert.equal((await shift.call("/admin/bookings/" + id + "/no-show", "POST", {})).status, 200);
    }
    assert.ok((await owner.call("/admin/overview")).data.attention.risky.some((u) => u.id === other.id));

    // Full prepay for risky masters: the deposit equals the full price.
    assert.equal((await owner.call("/admin/users/" + other.id + "/extra", "PATCH", { fullPrepay: true, notes: "Две неявки" })).status, 200);
    const full = await other.call("/bookings", "POST", { resourceId: places[0].id, date: day(8), hour: 12, duration: 3, extras: [] });
    const fullRow = (await db.query("SELECT deposit,total FROM bookings WHERE id=$1", [full.data.bookingId])).rows[0];
    assert.equal(fullRow.deposit, fullRow.total);
    const card = await owner.call("/admin/users/" + other.id);
    assert.equal(card.data.user.notes, "Две неявки");
    assert.ok(card.data.bookings.length >= 3);

    // Automatic final invoice after a finished session.
    const finished = randomUUID();
    await db.query("INSERT INTO bookings(id,user_id,resource_id,starts_at,ends_at,tariff,rate,total,status,deposit,policy) VALUES($1,$2,$3,now()-interval '5 hours',now()-interval '2 hours',3,200000,200000,'confirmed',50000,'{}')", [finished, master.id, places[0].id]);
    await db.transaction(async (q) => automationTick(q, (await q.query("SELECT data FROM settings WHERE id=1")).rows[0].data));
    const invoiced = (await db.query("SELECT status FROM bookings WHERE id=$1", [finished])).rows[0];
    assert.equal(invoiced.status, "invoiced");
    assert.equal((await db.query("SELECT amount FROM payments WHERE booking_id=$1 AND kind='final'", [finished])).rows[0].amount, 150000);

    // Waitlist: the master is told when a slot frees up.
    const taken = await other.call("/bookings", "POST", { resourceId: places[0].id, date: day(9), hour: 12, duration: 3, extras: [] });
    for (const p of places.slice(1)) await db.query("INSERT INTO blocks VALUES($1,$2,$3::timestamptz,$3::timestamptz+interval '3 hours','Ремонт')", [randomUUID(), p.id, `${day(9)}T12:00:00+03:00`]);
    assert.equal((await master.call("/waitlist", "POST", { city: "spb", date: day(9), hour: 12, duration: 3 })).status, 201);
    await db.transaction(async (q) => automationTick(q, (await q.query("SELECT data FROM settings WHERE id=1")).rows[0].data));
    assert.equal((await master.call("/waitlist")).data.items[0].notified_at, null);
    await db.query("UPDATE bookings SET status='cancelled' WHERE id=$1", [taken.data.bookingId]);
    await db.transaction(async (q) => automationTick(q, (await q.query("SELECT data FROM settings WHERE id=1")).rows[0].data));
    assert.ok((await master.call("/waitlist")).data.items[0].notified_at);
    assert.ok((await db.query("SELECT 1 FROM notifications WHERE user_id=$1 AND message LIKE 'Освободилось место%'", [master.id])).rows.length);

    // Balance adjustment with a reason; cannot go below zero.
    assert.equal((await owner.call("/admin/users/" + master.id + "/balance", "POST", { amount: 100000, reason: "Компенсация" })).status, 200);
    assert.equal((await owner.call("/admin/users/" + master.id + "/balance", "POST", { amount: -10000000, reason: "Ошибка" })).status, 409);

    // Broadcast reaches the chosen segment.
    const sent = await owner.call("/admin/broadcast", "POST", { segment: "masters", message: "Новые часы работы" });
    assert.equal(sent.data.count, 2);

    // Stock receipt and history.
    const product = (await db.query("SELECT id,stock FROM catalog WHERE kind='product' LIMIT 1")).rows[0];
    assert.equal((await shift.call("/admin/catalog/" + product.id + "/stock", "POST", { delta: 10, reason: "Закупка" })).status, 200);
    assert.equal((await db.query("SELECT stock FROM catalog WHERE id=$1", [product.id])).rows[0].stock, product.stock + 10);
    assert.equal((await shift.call("/admin/catalog/" + product.id + "/stock", "POST", { delta: -100000 })).status, 409);

    // Feedback with a contact, admin reply is queued as an email.
    assert.equal((await fetch(origin + "/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: "Нужно больше розеток", contact: "guest@test.invalid" }) })).status, 201);
    const fb = (await db.query("SELECT id FROM feedback ORDER BY created_at DESC LIMIT 1")).rows[0];
    const reply = await shift.call("/admin/feedback/" + fb.id + "/reply", "POST", { text: "Спасибо, добавим" });
    assert.equal(reply.data.sent, true);
    assert.equal((await db.query("SELECT status,reply FROM feedback WHERE id=$1", [fb.id])).rows[0].status, "done");

    // Owner sets a password and can sign in as a master; never as an admin.
    assert.equal((await owner.call("/admin/users/" + master.id + "/extra", "PATCH", { password: "short" })).status, 400);
    assert.equal((await owner.call("/admin/users/" + master.id + "/extra", "PATCH", { password: "New-master-password-1" })).status, 200);
    const as = await owner.call("/admin/users/" + master.id + "/impersonate", "POST", {});
    assert.equal(as.status, 200);
    assert.match(as.cookie, /office_session=/);
    assert.equal((await owner.call("/admin/users/" + shift.id + "/impersonate", "POST", {})).status, 403);
    assert.equal((await shift.call("/admin/users/" + master.id + "/impersonate", "POST", {})).status, 403);
    // The last owner cannot be demoted.
    assert.equal((await owner.call("/admin/users/" + owner.id + "/extra", "PATCH", { staffLevel: "shift" })).status, 400);
    // A master shares the public catalog URL when the account is linked to a legacy card.
    const publicMaster = await login("PublicMaster", "guest");
    assert.equal((await publicMaster.call("/me")).data.user.publicProfileId, publicMaster.id);
    await db.query("INSERT INTO master_links(master_id,user_id) VALUES('zinaida',$1)", [publicMaster.id]);
    assert.equal((await publicMaster.call("/me")).data.user.publicProfileId, "zinaida");
  } finally {
    await new Promise((r) => server.close(r));
    await db.close();
  }
});
