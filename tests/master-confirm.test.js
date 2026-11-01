import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { database } from "../server/db.js";
import { createApp } from "../server/index.js";
import { hashToken } from "../server/domain.js";

const day = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);

test("admin booking without prepayment waits for the master's confirmation", async () => {
  process.env.DATA_DIR = "memory://";
  const db = await database(), app = await createApp(db), server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.on("listening", r));
  const origin = "http://127.0.0.1:" + server.address().port;
  try {
    const account = async (name, role, profile = {}) => {
      const id = randomUUID(), token = "t-" + id;
      await db.query("INSERT INTO users(id,email,password,name,role,account_type,profile) VALUES($1,$2,'unused',$3,$4,$5,$6)", [id, `${name}@test.invalid`, name, role, role === "admin" ? "admin" : "master", JSON.stringify(profile)]);
      await db.query("INSERT INTO sessions VALUES($1,$2,now()+interval '1 day')", [hashToken(token), id]);
      return { id, call: async (path, method = "GET", data) => { const r = await fetch(origin + "/api" + path, { method, headers: { Cookie: "office_session=" + token, ...(data ? { "Content-Type": "application/json" } : {}) }, body: data ? JSON.stringify(data) : undefined }); return { status: r.status, data: await r.json().catch(() => ({})) }; } };
    };
    const owner = await account("owner", "admin"), shift = await account("shift", "admin", { staffLevel: "shift" });
    const master = await account("master", "resident"), other = await account("other", "guest");
    const places = (await (await fetch(origin + "/api/public")).json()).resources;
    const outbox = async (kind, id) => (await db.query("SELECT count(*)::int AS n FROM outbox WHERE kind=$1 AND payload->>'bookingId'=$2", [kind, id])).rows[0].n;
    const policy = async (id) => (await db.query("SELECT policy,status FROM bookings WHERE id=$1", [id])).rows[0];

    const pulse0 = (await master.call("/pulse")).data.v;
    // 1. Запись от администратора ждёт подтверждения: мастеру уходит просьба, а не «подтверждено».
    const made = await owner.call("/bookings", "POST", { userId: master.id, resourceId: places[0].id, date: day(4), hour: 12, duration: 3, extras: [], manual: true });
    assert.equal(made.status, 201, JSON.stringify(made.data));
    const id = made.data.bookingId;
    let b = await policy(id);
    assert.equal(b.status, "confirmed");
    assert.equal(b.policy.masterConfirm, "awaiting");
    assert.equal(await outbox("booking.master_confirm", id), 1);
    assert.equal(await outbox("booking.confirmed", id), 0);
    assert.notEqual((await master.call("/pulse")).data.v, pulse0, "кабинет мастера узнаёт о новой записи");

    // 2. Чужой мастер подтвердить не может; свой — подтверждает, администраторы получают ответ.
    assert.equal((await other.call(`/bookings/${id}/master-confirm`, "POST", {})).status, 404);
    assert.equal((await master.call(`/bookings/${id}/master-confirm`, "POST", {})).status, 200);
    b = await policy(id);
    assert.equal(b.policy.masterConfirm, "confirmed");
    assert.equal(await outbox("booking.master_confirmed", id), 1);

    // 3. Перенос администратором снова просит подтверждение; «без подтверждения» — сразу подтверждено.
    assert.equal((await owner.call(`/admin/bookings/${id}/move`, "POST", { resourceId: places[0].id, date: day(4), hour: 15 })).status, 200);
    assert.equal((await policy(id)).policy.masterConfirm, "awaiting");
    assert.equal(await outbox("booking.master_moved", id), 1);
    assert.equal((await shift.call(`/admin/bookings/${id}/move`, "POST", { resourceId: places[0].id, date: day(4), hour: 16, skipConfirm: true })).status, 200);
    assert.equal((await policy(id)).policy.masterConfirm, "skipped");

    // 4. Запись без подтверждения мастера с самого начала + подтверждение за мастера.
    const quick = await owner.call("/bookings", "POST", { userId: master.id, resourceId: places[1].id, date: day(5), hour: 12, duration: 3, extras: [], manual: true, masterConfirm: false });
    assert.equal(quick.status, 201);
    assert.equal((await policy(quick.data.bookingId)).policy.masterConfirm, "skipped");
    assert.equal(await outbox("booking.confirmed", quick.data.bookingId), 1);
    const again = await owner.call("/bookings", "POST", { userId: master.id, resourceId: places[2].id, date: day(6), hour: 12, duration: 3, extras: [], manual: true });
    assert.equal((await shift.call(`/admin/bookings/${again.data.bookingId}/master-confirm`, "POST", {})).status, 200);
    assert.equal((await policy(again.data.bookingId)).policy.masterConfirm, "skipped");
    assert.equal((await master.call(`/admin/bookings/${again.data.bookingId}/master-confirm`, "POST", {})).status, 403);

    // 5. Обычная запись мастера не затрагивается.
    const own = await master.call("/bookings", "POST", { resourceId: places[3 % places.length].id, date: day(7), hour: 12, duration: 3, extras: [] });
    assert.equal(own.status, 201, JSON.stringify(own.data));
    assert.equal((await policy(own.data.bookingId)).policy.masterConfirm, undefined);
  } finally {
    server.close();
  }
});
