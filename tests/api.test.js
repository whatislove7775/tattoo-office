import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { database } from "../server/db.js";
import { createApp } from "../server/index.js";
import { hashPassword, slot, defaults, verifyHmac } from "../server/domain.js";
let db, server, url, admin, resident, other, pub;
const password = "Office-test-password-2026";
async function request(path, method = "GET", data, cookie) {
  const r = await fetch(url + "/api" + path, {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  return {
    status: r.status,
    data: await r.json(),
    cookie: r.headers.get("set-cookie")?.split(";")[0],
  };
}
async function register(email) {
  const r = await request("/auth/register", "POST", {
    name: "Test Master",
    email,
    password,
    rules: true,
    consent: true,
  });
  assert.equal(r.status, 201, JSON.stringify(r.data));
  return r.cookie;
}
function tomorrow(n = 3) {
  return new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
}
const booking = (resourceId, date = tomorrow(), hour = 10) => ({
  resourceId,
  date,
  hour,
  duration: 3,
  extras: [],
});
before(async () => {
  process.env.DATA_DIR = "memory://";
  db = await database();
  const app = await createApp(db);
  server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.on("listening", r));
  url = "http://127.0.0.1:" + server.address().port;
  await db.query(
    "INSERT INTO users(id,email,password,name,role) VALUES($1,$2,$3,'Admin','admin')",
    [randomUUID(), "admin@test.invalid", hashPassword(password)],
  );
  admin = (
    await request("/auth/login", "POST", {
      email: "admin@test.invalid",
      password,
    })
  ).cookie;
  resident = await register("resident@test.invalid");
  other = await register("other@test.invalid");
  pub = (await request("/public")).data;
});
after(async () => {
  await new Promise((r) => server.close(r));
  await db.close();
});
test("auth: hashes passwords, requires consent, prevents role escalation and cross-origin mutation", async () => {
  const u = (
    await db.query("SELECT * FROM users WHERE email='resident@test.invalid'")
  ).rows[0];
  assert.notEqual(u.password, password);
  assert.equal(u.role, "resident");
  assert.equal((await request("/admin", "GET", null, resident)).status, 403);
  assert.equal(
    (
      await request("/auth/register", "POST", {
        email: "x@test.invalid",
        password,
        name: "X",
        rules: true,
      })
    ).status,
    400,
  );
  const r = await fetch(url + "/api/auth/logout", {
    method: "POST",
    headers: { Origin: "https://evil.invalid", Cookie: resident },
  });
  assert.equal(r.status, 403);
});
test("concurrent bookings: exactly one reserves the same resource", async () => {
  const b = booking(pub.resources[0].id);
  const r = await Promise.all([
    request("/bookings", "POST", b, resident),
    request("/bookings", "POST", b, other),
  ]);
  assert.deepEqual(r.map((x) => x.status).sort(), [201, 409]);
});
test("payment is idempotent, credits cancellation once and uses balance first", async () => {
  const b = await request(
    "/bookings",
    "POST",
    booking(pub.resources[1].id),
    resident,
  );
  assert.equal(b.status, 201);
  const id = b.data.bookingId,
    pid = b.data.paymentId;
  assert.equal(
    (await request("/payments/" + pid + "/test", "POST", {}, other)).status,
    404,
  );
  for (let i = 0; i < 2; i++)
    assert.equal(
      (await request("/payments/" + pid + "/test", "POST", {}, resident))
        .status,
      200,
    );
  const u = (await request("/me", "GET", null, resident)).data.user;
  assert.equal(u.sequence, 1);
  assert.equal(
    (await request("/bookings/" + id + "/cancel", "POST", {}, resident)).status,
    200,
  );
  assert.equal(
    (await request("/bookings/" + id + "/cancel", "POST", {}, resident)).status,
    400,
  );
  assert.equal(
    (await request("/me", "GET", null, resident)).data.user.balance,
    50000,
  );
  const next = await request(
    "/bookings",
    "POST",
    booking(pub.resources[1].id, tomorrow(4)),
    resident,
  );
  assert.equal(next.data.paymentId, null);
  assert.equal(
    (await request("/me", "GET", null, resident)).data.user.balance,
    0,
  );
});
test("expired unpaid bookings release stock and balance", async () => {
  const item = pub.catalog.find((x) => x.kind === "product");
  const b = await request(
    "/bookings",
    "POST",
    { ...booking(pub.resources[2].id), extras: [{ id: item.id, qty: 2 }] },
    other,
  );
  assert.equal(b.status, 201);
  await db.query(
    "UPDATE bookings SET expires_at=now()-interval '1 minute' WHERE id=$1",
    [b.data.bookingId],
  );
  await request("/availability?date=" + tomorrow() + "&duration=3");
  assert.equal(
    (await db.query("SELECT stock FROM catalog WHERE id=$1", [item.id])).rows[0]
      .stock,
    item.stock,
  );
  assert.equal(
    (
      await request(
        "/payments/" + b.data.paymentId + "/test",
        "POST",
        {},
        other,
      )
    ).status,
    409,
  );
});
test("inventory rejects overselling and negative quantities", async () => {
  const item = pub.catalog.find((x) => x.kind === "product");
  for (const qty of [item.stock + 1, -1])
    assert.ok(
      [400, 409].includes(
        (
          await request(
            "/bookings",
            "POST",
            { ...booking(pub.resources[2].id), extras: [{ id: item.id, qty }] },
            resident,
          )
        ).status,
      ),
    );
});
test("closed times and past slots are unavailable", async () => {
  assert.throws(() => slot("2020-01-01", 10, 3, defaults));
  const d = tomorrow(5),
    id = pub.resources[3].id;
  assert.equal(
    (
      await request(
        "/admin/blocks",
        "POST",
        {
          resourceId: id,
          startsAt: d + "T10:00:00+03:00",
          endsAt: d + "T22:00:00+03:00",
          reason: "Cleaning",
        },
        admin,
      )
    ).status,
    200,
  );
  assert.equal(
    (await request("/bookings", "POST", booking(id, d), resident)).status,
    409,
  );
});
test("manual bookings have no deposit; final invoice cannot be issued before start", async () => {
  const user = (await request("/me", "GET", null, other)).data.user;
  const b = await request(
    "/bookings",
    "POST",
    {
      ...booking(pub.resources[2].id, tomorrow(6)),
      manual: true,
      userId: user.id,
    },
    admin,
  );
  assert.equal(b.status, 201);
  assert.equal(b.data.paymentId, null);
  assert.equal(
    (
      await db.query("SELECT deposit FROM bookings WHERE id=$1", [
        b.data.bookingId,
      ])
    ).rows[0].deposit,
    0,
  );
  assert.equal(
    (
      await request(
        "/admin/bookings/" + b.data.bookingId + "/invoice",
        "POST",
        { duration: 3 },
        admin,
      )
    ).status,
    400,
  );
  await db.query(
    "UPDATE bookings SET starts_at=now()-interval '4 hours',ends_at=now()-interval '1 hour' WHERE id=$1",
    [b.data.bookingId],
  );
  const inv = await request(
    "/admin/bookings/" + b.data.bookingId + "/invoice",
    "POST",
    { duration: 6 },
    admin,
  );
  assert.equal(inv.status, 200);
  assert.equal(
    (
      await request(
        "/payments/" + inv.data.paymentId + "/test",
        "POST",
        {},
        other,
      )
    ).status,
    200,
  );
  assert.equal(
    (
      await db.query("SELECT status FROM bookings WHERE id=$1", [
        b.data.bookingId,
      ])
    ).rows[0].status,
    "completed",
  );
});
test("late cancellation remains reserved until manager decision", async () => {
  const b = await request(
    "/bookings",
    "POST",
    booking(pub.resources[3].id, tomorrow(7)),
    resident,
  );
  await request(
    "/payments/" + b.data.paymentId + "/test",
    "POST",
    {},
    resident,
  );
  await db.query(
    "UPDATE bookings SET starts_at=now()+interval '2 hours',ends_at=now()+interval '5 hours' WHERE id=$1",
    [b.data.bookingId],
  );
  await request(
    "/bookings/" + b.data.bookingId + "/cancel",
    "POST",
    {},
    resident,
  );
  assert.equal(
    (
      await db.query("SELECT status FROM bookings WHERE id=$1", [
        b.data.bookingId,
      ])
    ).rows[0].status,
    "cancel_requested",
  );
  assert.equal(
    (
      await request(
        "/admin/bookings/" + b.data.bookingId + "/resolve-cancel",
        "POST",
        { credit: true },
        admin,
      )
    ).status,
    200,
  );
});
test("settings store prices; live mode locked; public never exposes unpublished content", async () => {
  assert.equal(
    (
      await request(
        "/admin/settings",
        "PATCH",
        { address: "Тестовый адрес", openHour: 9 },
        admin,
      )
    ).status,
    200,
  );
  assert.equal(
    (await request("/public")).data.settings.address,
    "Тестовый адрес",
  );
  assert.equal(
    (await request("/admin/settings", "PATCH", { mode: "live" }, admin)).status,
    409,
  );
  await request(
    "/admin/content/draft",
    "PUT",
    { title: "Draft", body: "Private", published: false },
    admin,
  );
  assert.equal((await request("/public")).data.content.length, 0);
  assert.equal(verifyHmac(Buffer.from("fake"), "fake", "secret"), false);
  assert.equal(
    (await request("/webhooks/cloudpayments/pay", "POST", {})).status,
    403,
  );
});
test("worker prepares test receipts and in-app notifications without contacting providers", async () => {
  const { workerTick } = await import("../server/worker.js");
  await workerTick(db);
  const receipts = (await db.query("SELECT * FROM receipts")).rows;
  assert.ok(receipts.length > 0);
  for (const r of receipts) {
    assert.equal(r.status, "simulated");
    const c = r.payload.CustomerReceipt,
      total = c.Items.reduce((a, x) => a + x.Amount, 0);
    assert.equal(
      Math.round(total * 100),
      Math.round((c.Amounts.Electronic + c.Amounts.AdvancePayment) * 100),
    );
  }
  assert.ok((await db.query("SELECT * FROM notifications")).rows.length > 0);
});
test("one site operator has full access and legacy staff roles cannot be created", async () => {
  const created = await request(
    "/admin/users",
    "POST",
    {
      name: "Site operator",
      email: "operator@test.invalid",
      password,
      role: "admin",
    },
    admin,
  );
  assert.equal(created.status, 201);
  const cookie = (
    await request("/auth/login", "POST", {
      email: "operator@test.invalid",
      password,
    })
  ).cookie;
  const data = (await request("/admin", "GET", null, cookie)).data;
  assert.ok(Array.isArray(data.users));
  assert.ok(Array.isArray(data.payments));
  assert.ok(Array.isArray(data.audit));
  assert.ok(data.integrations);
  assert.equal(
    (
      await request(
        "/admin/settings",
        "PATCH",
        { studioName: "Tattoo Office" },
        cookie,
      )
    ).status,
    200,
  );
  for (const role of ["manager", "moderator"])
    assert.equal(
      (
        await request(
          "/admin/users",
          "POST",
          { name: "Old role", email: role + "@test.invalid", password, role },
          admin,
        )
      ).status,
      403,
    );
  const reg = await request("/auth/register", "POST", {
    name: "Attempt",
    email: "role@test.invalid",
    password,
    role: "admin",
    rules: true,
    consent: true,
  });
  assert.equal(reg.data.user.role, "resident");
});
test("invoice upgrade uses captured tariff and is restricted to booking owner", async () => {
  const user = (await request("/me", "GET", null, other)).data.user;
  const created = await request(
    "/bookings",
    "POST",
    {
      ...booking(pub.resources[0].id, tomorrow(20)),
      manual: true,
      userId: user.id,
    },
    admin,
  );
  assert.equal(created.status, 201);
  const id = created.data.bookingId;
  await db.query(
    "UPDATE bookings SET starts_at=now()-interval '4 hours',ends_at=now()-interval '1 hour' WHERE id=$1",
    [id],
  );
  await request(
    "/admin/bookings/" + id + "/invoice",
    "POST",
    { duration: 3 },
    admin,
  );
  assert.equal(
    (
      await request(
        "/bookings/" + id + "/upgrade",
        "POST",
        { duration: 6 },
        resident,
      )
    ).status,
    409,
  );
  assert.equal(
    (
      await request(
        "/bookings/" + id + "/upgrade",
        "POST",
        { duration: 6 },
        other,
      )
    ).status,
    200,
  );
  const b = (await db.query("SELECT * FROM bookings WHERE id=$1", [id]))
    .rows[0];
  assert.equal(b.rate, defaults.rates.resident[6]);
  assert.equal(
    (
      await request(
        "/bookings/" + id + "/upgrade",
        "POST",
        { duration: 3 },
        other,
      )
    ).status,
    400,
  );
});
