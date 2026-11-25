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
  await db.query("UPDATE users SET role='resident' WHERE email='resident@test.invalid'");
  other = await register("other@test.invalid");
  await db.query("INSERT INTO catalog(id,name,kind,price,stock) VALUES($1,'Картридж для тестов','product',12500,8)", [randomUUID()]);
  pub = (await request("/public")).data;
});
after(async () => {
  await new Promise((r) => server.close(r));
  await db.close();
});
test("Tattoo Office Pass reserves a case-insensitive username while keeping original profile links", async () => {
  const save = (username, cookie = resident) => request("/me/username", "PATCH", { username }, cookie);
  const { id } = (await request("/me", "GET", null, resident)).data.user;
  assert.equal((await save("bad-name")).status, 400);
  assert.equal((await save("ZINAIDA")).status, 409);
  assert.equal((await save("OfficeInk", admin)).status, 403);
  assert.equal((await save("@OfficeInk")).data.username, "OfficeInk");
  assert.equal((await request("/me", "GET", null, resident)).data.user.username, "OfficeInk");
  assert.equal((await request("/me/username?username=officeink", "GET", null, other)).data.available, false);
  assert.equal((await save("ofFiCeInK", other)).status, 409);
  assert.equal((await request("/masters/officeink")).data.master.id, id);
  assert.equal((await request("/masters/" + id)).data.master.username, "OfficeInk");
  assert.equal((await save("NewOfficeInk")).status, 200);
  assert.equal((await request("/masters/OfficeInk")).status, 404);
  assert.equal((await request("/masters/NEWOFFICEINK")).data.master.id, id);
  assert.equal((await save("")).data.username, null);
  assert.equal((await request("/masters/" + id)).status, 200);
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
  const item = pub.catalog.find((x) => x.kind === "product" && !x.unlimited);
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
  const item = pub.catalog.find((x) => x.kind === "product" && !x.unlimited);
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
test("round-the-clock booking includes midnight and sessions crossing into the next day", async () => {
  const date = tomorrow(20), resourceId = pub.resources[0].id;
  const [start, end] = slot(date, 23, 3, defaults);
  assert.equal(start, new Date(`${date}T23:00:00+03:00`).toISOString());
  assert.equal(+new Date(end) - +new Date(start), 3 * 3600000);
  assert.throws(() => slot("2026-02-30", 0, 3, defaults));
  const available = await request(`/availability?date=${date}&duration=3`);
  assert.equal(available.status, 200);
  assert.ok(available.data.slots.some((entry) => entry.hour === 0));
  assert.ok(available.data.slots.some((entry) => entry.hour === 23));
  const bookingAtNight = await request("/bookings", "POST", booking(resourceId, date, 23), other);
  assert.equal(bookingAtNight.status, 201, JSON.stringify(bookingAtNight.data));
});
test("cancellation inside 48 hours retains the deposit; earlier cancellation credits it", async () => {
  const before = (await request("/me", "GET", null, other)).data.user.balance;
  for (const [hours, credit] of [[47, 0], [49, 50000]]) {
    const booked = await request("/bookings", "POST", booking(pub.resources[1].id, tomorrow(30 + hours)), other);
    assert.equal(booked.status, 201, JSON.stringify(booked.data));
    assert.equal((await request(`/payments/${booked.data.paymentId}/test`, "POST", {}, other)).status, 200);
    await db.query("UPDATE bookings SET starts_at=now()+($2::int * interval '1 hour'),ends_at=now()+($3::int * interval '1 hour') WHERE id=$1", [booked.data.bookingId, hours, hours + 3]);
    assert.equal((await request(`/bookings/${booked.data.bookingId}/cancel`, "POST", {}, other)).status, 200);
    assert.equal((await request("/me", "GET", null, other)).data.user.balance, before + credit);
  }
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
test("an earlier booking's review policy remains valid until manager decision", async () => {
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
    "UPDATE bookings SET starts_at=now()+interval '2 hours',ends_at=now()+interval '5 hours',policy=jsonb_set(policy,'{lateCancellation}','\"review\"') WHERE id=$1",
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
  assert.equal((await request("/admin/content/event-1", "PUT", {
    title: "Встреча", body: "Описание", date: "10.2026", photo: 3, published: true,
  }, admin)).status, 200);
  const event = (await request("/public")).data.content.find((x) => x.id === "event-1");
  assert.equal(event.data.date, "10.2026");
  assert.equal(event.data.photo, 3);
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
  assert.equal(reg.data.user.role, "guest");
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
  assert.equal(b.rate, defaults.rates.guest[6]);
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

test("admin chooses which existing masters appear on the public home", async () => {
  const initial = await request("/public");
  assert.equal(initial.data.content.some((x) => x.id === "master-1"), false);
  const payload = { title: "Зинаида Петровна", body: "", published: true, featured: false };
  assert.equal((await request("/admin/content/master-1", "PUT", payload, resident)).status, 403);
  assert.equal((await request("/admin/content/master-1", "PUT", payload, admin)).status, 200);
  const hidden = (await request("/public")).data.content.find((x) => x.id === "master-1");
  assert.equal(hidden.data.featured, false);
  assert.equal((await request("/admin/content/master-1", "PUT", { ...payload, featured: true }, admin)).status, 200);
  const visible = (await request("/public")).data.content.find((x) => x.id === "master-1");
  const bookingLink = "https://t.me/studio_master?text=" + encodeURIComponent("Хочу записаться к мастеру");
  assert.equal((await request("/admin/content/master-1", "PUT", {...payload,featured:true,bookingLink},admin)).status,200);
  assert.equal((await request("/public")).data.content.find(x=>x.id==="master-1").data.bookingLink,bookingLink);
  const businessLink = "https://t.me/m/OL1NHb70MGY6";
  assert.equal((await request("/admin/content/master-2", "PUT", {...payload,bookingLink:businessLink},admin)).status,200);
  const links = (await request("/public")).data.content;
  assert.equal(links.find(x=>x.id==="master-2").data.bookingLink,businessLink);
  assert.equal(links.find(x=>x.id==="master-1").data.bookingLink,bookingLink);
  assert.equal((await request("/admin/content/master-2", "PUT", {...payload,bookingLink:"https://t.me/m/"},admin)).status,400);
  assert.equal((await request("/admin/content/master-1", "PUT", {...payload,bookingLink:"https://example.com/fake"},admin)).status,400);
  assert.equal((await request("/admin/content/master-1", "PUT", {...payload,bookingLink:"javascript:alert(1)"},admin)).status,400);
  assert.equal(visible.data.featured, true);
});

test('resident cash exception is administrator-controlled, confirms without balance/deposit and cash settlement is idempotent', async () => {
  const u=(await db.query("SELECT * FROM users WHERE email='other@test.invalid'")).rows[0];
  assert.equal((await request('/admin/users/'+u.id,'PATCH',{depositWaived:true},resident)).status,403);
  assert.equal((await request('/admin/users/'+u.id,'PATCH',{role:'resident',depositWaived:true},admin)).status,200);
  other=(await request('/auth/login','POST',{email:u.email,password})).cookie;
  assert.equal((await request('/me','GET',null,other)).data.user.depositWaived,true);
  await db.query('UPDATE users SET balance=10000 WHERE id=$1',[u.id]);
  const result=await request('/bookings','POST',booking(pub.resources[3].id,tomorrow(90)),other);
  assert.equal(result.status,201);
  assert.equal(result.data.paymentId,null);
  const b=(await db.query('SELECT * FROM bookings WHERE id=$1',[result.data.bookingId])).rows[0];
  assert.equal(b.status,'confirmed');assert.equal(b.deposit,0);assert.equal(b.balance_used,0);
  assert.equal(b.policy.paymentMethod,'cash');
  assert.equal((await request('/me','GET',null,other)).data.user.balance,10000);
  await db.query("UPDATE bookings SET starts_at=now()-interval '4 hours',ends_at=now()-interval '1 hour' WHERE id=$1",[b.id]);
  const invoice=await request('/admin/bookings/'+b.id+'/invoice','POST',{duration:3},admin);
  assert.equal(invoice.status,200);
  const pid=invoice.data.paymentId;
  assert.equal((await request('/payments/'+pid,'GET',null,other)).data.provider,'cash');
  assert.equal((await request('/admin/payments/'+pid+'/cash','POST',{},other)).status,403);
  for(let i=0;i<2;i++) assert.equal((await request('/admin/payments/'+pid+'/cash','POST',{},admin)).status,200);
  assert.equal((await db.query('SELECT status FROM bookings WHERE id=$1',[b.id])).rows[0].status,'completed');
  assert.equal((await db.query('SELECT amount,provider_id FROM payments WHERE id=$1',[pid])).rows[0].amount,b.total);
  assert.equal((await request('/admin/users/'+u.id,'PATCH',{role:'guest'},admin)).status,200);
  assert.equal((await db.query('SELECT deposit_waived FROM users WHERE id=$1',[u.id])).rows[0].deposit_waived,false);
});

test('20th completed visit: one free rental, extras payable, cancellation restores bonus and next cycle resets', async()=>{
  const cookie=await register('loyalty@test.invalid');
  const u=(await db.query("SELECT id FROM users WHERE email='loyalty@test.invalid'")).rows[0];
  for(let i=0;i<19;i++) await db.query("INSERT INTO bookings(id,user_id,resource_id,starts_at,ends_at,tariff,rate,total,status) VALUES($1,$2,$3,now()-interval '30 days',now()-interval '29 days',3,200000,200000,'completed')",[randomUUID(),u.id,pub.resources[0].id]);
  assert.equal((await request('/bookings','GET',null,cookie)).data.loyalty.freeNext,true);
  const a=await request('/bookings','POST',booking(pub.resources[0].id,tomorrow(100)),cookie);
  assert.equal(a.status,201);assert.equal(a.data.paymentId,null);
  const first=(await db.query('SELECT * FROM bookings WHERE id=$1',[a.data.bookingId])).rows[0];
  assert.equal(first.total,0);assert.equal(first.deposit,0);assert.equal(first.policy.loyaltyFree,true);
  const second=await request('/bookings','POST',booking(pub.resources[1].id,tomorrow(101)),cookie);
  assert.equal(second.status,201);
  assert.equal((await db.query('SELECT rate FROM bookings WHERE id=$1',[second.data.bookingId])).rows[0].rate,200000);
  assert.equal((await request('/bookings/'+first.id+'/cancel','POST',{},cookie)).status,200);
  assert.equal((await request('/bookings','GET',null,cookie)).data.loyalty.freeNext,true);
  const service=pub.catalog.find(x=>x.kind==='service');
  const bonus=await request('/bookings','POST',{...booking(pub.resources[2].id,tomorrow(102)),extras:[{id:service.id,qty:1}]},cookie);
  assert.equal(bonus.status,201);assert.equal(bonus.data.paymentId,null);
  let b=(await db.query('SELECT * FROM bookings WHERE id=$1',[bonus.data.bookingId])).rows[0];
  assert.equal(b.total,service.price);assert.equal(b.rate,0);
  await db.query("UPDATE bookings SET starts_at=now()-interval '4 hours',ends_at=now()-interval '1 hour' WHERE id=$1",[b.id]);
  const invoice=await request('/admin/bookings/'+b.id+'/invoice','POST',{duration:6},admin);
  assert.equal(invoice.status,200);
  b=(await db.query('SELECT * FROM bookings WHERE id=$1',[b.id])).rows[0];
  assert.equal(b.rate,0);assert.equal(b.total,service.price);
  assert.equal((await db.query('SELECT amount FROM payments WHERE id=$1',[invoice.data.paymentId])).rows[0].amount,service.price);
  await db.query("UPDATE bookings SET status='completed' WHERE id=$1",[b.id]);
  const state=(await request('/bookings','GET',null,cookie)).data.loyalty;
  assert.equal(state.progress,0);assert.equal(state.cycle,2);assert.equal(state.freeNext,false);
});

test('admin can assign a Telegram booking link when creating a master', async()=>{
  const body={name:'Telegram Master',email:'telegram-create@test.invalid',password,role:'resident',bookingLink:'https://t.me/m/test_booking'};
  assert.equal((await request('/admin/users','POST',body,resident)).status,403);
  const bad=await request('/admin/users','POST',{...body,bookingLink:'https://example.com/chat'},admin);assert.equal(bad.status,400);
  assert.equal((await db.query('SELECT id FROM users WHERE email=$1',[body.email])).rows.length,0);
  const created=await request('/admin/users','POST',body,admin);assert.equal(created.status,201);
  const profile=await request('/masters/'+created.data.id);assert.equal(profile.data.master.bookingLink,body.bookingLink);
  const stored=(await db.query('SELECT profile FROM users WHERE id=$1',[created.data.id])).rows[0].profile;assert.equal(stored.adminBookingLink,body.bookingLink);
  assert.equal((await request('/me','PATCH',{name:'Resident',profile:{bookingLink:body.bookingLink}},resident)).status,403);
});

test("staff expenses update an open invoice, preserve a settled invoice and deduct stock once", async () => {
  const cookie = await register("expenses@test.invalid");
  const { id: masterId } = (await db.query("SELECT id FROM users WHERE email='expenses@test.invalid'")).rows[0];
  const { id: shiftId } = (await db.query("SELECT id FROM users WHERE email='admin@test.invalid'")).rows[0];
  const id = randomUUID(), productId = randomUUID(), serviceId = randomUUID();
  await db.query("INSERT INTO catalog(id,name,kind,price,stock) VALUES($1,'Кола','product',15000,5),($2,'Подготовка','service',50000,0)", [productId, serviceId]);
  await db.query(`INSERT INTO bookings(id,user_id,resource_id,starts_at,ends_at,tariff,rate,total,status,policy)
    VALUES($1,$2,$3,now()-interval '2 days',now()-interval '2 days'+interval '3 hours',3,320000,320000,'confirmed','{"paymentMethod":"cash"}')`,
    [id, masterId, pub.resources[0].id]);
  const expenses = "/admin/bookings/" + id + "/expenses";
  const order = (catalogId, qty) => ({ requestId: randomUUID(), items: [{ id: catalogId, qty }] });
  const cola = order(productId, 2);
  assert.equal((await request(expenses, "POST", cola, cookie)).status, 403);
  assert.equal((await request(expenses, "POST", order(productId, 6), admin)).status, 409);
  const original = await request(expenses, "POST", cola, admin);
  assert.equal(original.status, 201);
  assert.deepEqual(original.data, { paymentId: null, separate: false, amount: 30000 });
  assert.equal((await request("/admin/bookings/" + id + "/no-show", "POST", {}, admin)).status, 409);
  assert.deepEqual((await request(expenses, "POST", cola, admin)).data, original.data);
  assert.equal((await request(expenses, "POST", { ...cola, items: [{ id: productId, qty: 1 }] }, admin)).status, 409);
  assert.equal((await db.query("SELECT stock FROM catalog WHERE id=$1", [productId])).rows[0].stock, 3);

  const final = await request("/admin/bookings/" + id + "/invoice", "POST", { duration: 3 }, admin);
  assert.equal(final.status, 200);
  const finalId = final.data.paymentId;
  assert.equal((await request(expenses, "POST", order(serviceId, 1), admin)).data.paymentId, finalId);
  const finalPayment = await request("/payments/" + finalId, "GET", null, cookie);
  assert.equal(finalPayment.data.payment.amount, 400000);
  assert.equal(finalPayment.data.payment.booking_extras.length, 2);
  assert.equal((await request("/admin/payments/" + finalId + "/cash", "POST", {}, admin)).status, 200);

  // A shift administrator can post an expense, while editing the catalogue stays owner-only.
  await db.query("UPDATE users SET profile=profile||'{\"staffLevel\":\"shift\"}'::jsonb WHERE id=$1", [shiftId]);
  let separate;
  try {
    assert.equal((await request("/admin/catalog", "POST", {}, admin)).status, 403);
    const added = await request(expenses, "POST", order(productId, 1), admin);
    assert.equal(added.status, 201);
    separate = added.data.paymentId;
    assert.equal(added.data.separate, true);
    assert.equal((await request(expenses, "POST", order(serviceId, 1), admin)).data.paymentId, separate);
    const overview = await request("/admin/overview", "GET", null, admin);
    assert.ok(overview.data.attention.expenseInvoices.some((p) => p.payment_id === separate));
  } finally {
    await db.query("UPDATE users SET profile=profile-'staffLevel' WHERE id=$1", [shiftId]);
  }
  const invoice = await request("/payments/" + separate, "GET", null, cookie);
  assert.equal(invoice.data.payment.amount, 65000);
  assert.deepEqual(invoice.data.payment.items.map((x) => x.name).sort(), ["Кола", "Подготовка"]);
  assert.equal((await request("/payments/" + separate, "GET", null, resident)).status, 404);
  const before = (await request("/me/ranking", "GET", null, cookie)).data;
  assert.equal(before.breakdown.bookings, 70);
  assert.equal((await request("/admin/payments/" + separate + "/cash", "POST", {}, admin)).status, 200);
  const after = (await request("/me/ranking", "GET", null, cookie)).data;
  assert.equal(after.breakdown.bookings, before.breakdown.bookings);
  assert.equal(after.breakdown.services, before.breakdown.services + 20);
  const history = (await request("/bookings", "GET", null, cookie)).data;
  assert.equal(history.payments.find((p) => p.id === finalId).amount, 400000);
  assert.equal(history.payments.find((p) => p.id === separate).status, "paid");
  assert.equal(history.bookings.find((b) => b.id === id).status, "completed");
  const checkout = (await request(expenses, "POST", order(productId, 1), admin)).data.paymentId;
  await db.query("UPDATE payments SET checkout_id='test-checkout-locked' WHERE id=$1", [checkout]);
  const fresh = (await request(expenses, "POST", order(serviceId, 1), admin)).data.paymentId;
  assert.notEqual(fresh, checkout);
  assert.equal((await db.query("SELECT amount FROM payments WHERE id=$1", [checkout])).rows[0].amount, 15000);
  const notes = (await request("/notifications", "GET", null, cookie)).data.notifications;
  assert.ok(notes.some((n) => n.message.includes("Кола × 1")));
});

test("catalogue supports unlimited supplies and adds a shop item to the owner's session", async () => {
  const buyer = await register("shop-buyer@test.invalid");
  const item = pub.catalog.find(x => x.name === "Защитная плёнка");
  const kit = pub.catalog.find(x => x.name === "Набор расходников");
  assert.ok([item,kit].every(x => x.unlimited && x.price === 0 && x.onlineReceipt));
  const created = await request("/admin/catalog", "POST", {
    name:"Тестовый товар Shop", kind:"product", price:32500, stock:4, shop:true, receiptUnmarked:true,
  }, admin);
  assert.equal(created.status,200);
  const catalogue = (await request("/public")).data.catalog;
  assert.ok(catalogue.find(x => x.id === created.data.id)?.shop);
  const book = await request("/bookings","POST",{
    ...booking(pub.resources[0].id,tomorrow(23)), extras:[{id:item.id,qty:25},{id:kit.id,qty:5}],
  },buyer);
  assert.equal(book.status,201);
  const b = (await db.query("SELECT total,rate,extras FROM bookings WHERE id=$1",[book.data.bookingId])).rows[0];
  assert.equal(b.total,b.rate);
  assert.equal(b.extras[0].qty,25);
  assert.equal((await db.query("SELECT stock FROM catalog WHERE id=$1",[item.id])).rows[0].stock,0);
  const path = "/bookings/" + book.data.bookingId + "/session-expenses";
  const extra = { requestId:randomUUID(), shop:true, items:[{id:created.data.id,qty:2}] };
  assert.equal((await request(path,"POST",extra,buyer)).status,409);
  await db.query("UPDATE bookings SET status='confirmed',starts_at=now()-interval '1 hour',ends_at=now()+interval '2 hours' WHERE id=$1",[book.data.bookingId]);
  assert.equal((await request(path,"POST",extra,resident)).status,409);
  assert.equal((await request(path,"POST",extra,buyer)).status,201);
  assert.equal((await request(path,"POST",extra,buyer)).status,201);
  assert.equal((await db.query("SELECT total FROM bookings WHERE id=$1",[book.data.bookingId])).rows[0].total,b.rate+65000);
  assert.equal((await db.query("SELECT stock FROM catalog WHERE id=$1",[created.data.id])).rows[0].stock,2);
});
test("a dated one-use promo is reserved once and becomes final after confirmation", async () => {
  const code = "SINGLE-DATE";
  const buyers = await Promise.all([register("promo-a@test.invalid"),register("promo-b@test.invalid")]);
  assert.equal((await request("/admin/promos","POST",{code,kind:"percent",value:5,singleUse:true,expiresAt:tomorrow(30)},admin)).status,200);
  const data = await Promise.all([
    request("/bookings","POST",{...booking(pub.resources[1].id,tomorrow(25)),promo:code},buyers[0]),
    request("/bookings","POST",{...booking(pub.resources[2].id,tomorrow(25)),promo:code},buyers[1]),
  ]);
  assert.deepEqual(data.map(x=>x.status).sort(),[201,409]);
  const owner = data[0].status === 201 ? buyers[0] : buyers[1];
  const pending = data.find(x=>x.status === 201).data;
  await db.query("UPDATE bookings SET expires_at=now()-interval '1 second' WHERE id=$1",[pending.bookingId]);
  const next = await request("/bookings","POST",{...booking(pub.resources[1].id,tomorrow(25)),promo:code},owner);
  assert.equal(next.status,201);
  assert.equal((await request("/payments/"+next.data.paymentId+"/test","POST",{},owner)).status,200);
  assert.equal((await request("/bookings/"+next.data.bookingId+"/cancel","POST",{},owner)).status,200);
  assert.equal((await request("/promo/check","POST",{code},owner)).status,404);
});
