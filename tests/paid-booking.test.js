import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID as uuid } from "node:crypto";
import { database } from "../server/db.js";
import { createApp } from "../server/index.js";
import { hashToken } from "../server/domain.js";

test("paid booking keeps one payment across transfer, then bills time and products separately", async (t) => {
  Object.assign(process.env, { DATA_DIR:"memory://", YOOKASSA_SHOP_ID:"test-shop", YOOKASSA_SECRET_KEY:"test_mock", YOOKASSA_PAID_BOOKING:"true" });
  const realFetch = globalThis.fetch, provider = new Map(), refunds = new Map();
  t.mock.method(globalThis, "fetch", async (url, options) => {
    const root = "https://api.yookassa.ru/v3/";
    if (!String(url).startsWith(root)) return realFetch(url, options);
    const [type, id] = String(url).slice(root.length).split("/");
    if (type === "refunds") {
      if (id) return Response.json([...refunds.values()].find(r => r.id === id));
      const key = options.headers["Idempotence-Key"];
      if (!refunds.has(key)) refunds.set(key, { ...JSON.parse(options.body), id:uuid(), status:"succeeded" });
      return Response.json(refunds.get(key));
    }
    if (id) return Response.json(provider.get(id));
    const payment = { ...JSON.parse(options.body), id:uuid(), test:true, status:"pending", paid:false,
      confirmation:{confirmation_url:"https://yoomoney.ru/test-checkout"} };
    provider.set(payment.id,payment);
    return Response.json(payment);
  });
  const db = await database();
  const app = await createApp(db), server = app.listen(0,"127.0.0.1");
  await new Promise(resolve => server.on("listening",resolve));
  t.after(async () => {
    await new Promise(resolve => server.close(resolve));
    await db.close();
  });
  const user = uuid(), cookie = uuid(), admin = uuid(), adminCookie = uuid(), item = uuid();
  const base = "http://127.0.0.1:" + server.address().port + "/api";
  async function api(path, body, expected = 200, token = cookie) {
    const response = await realFetch(base + path, {method:body ? "POST" : "GET",
      headers:{Cookie:"office_session="+token,"Content-Type":"application/json"},
      body:body && JSON.stringify(body)});
    const json = await response.json();
    assert.equal(response.status,expected,JSON.stringify(json));
    return json;
  }
  const bookings = async id => (await api("/bookings")).bookings.find(b => b.id === id);
  const payment = async id => (await api("/payments/" + id)).payment;
  async function checkout(id) {
    await api("/payments/" + id + "/checkout", {});
    return provider.get((await payment(id)).checkout_id);
  }
  async function successful(remote) {
    remote.status = "succeeded";
    remote.paid = true;
    await api("/webhooks/yookassa", {object:{id:remote.id}});
  }
  await db.query("INSERT INTO users(id,email,password,name,role,balance) VALUES($1,'booking@test.invalid','unused','Master','guest',60000),($2,'admin@test.invalid','unused','Admin','admin',0)", [user,admin]);
  await db.query("INSERT INTO sessions VALUES($1,$2,now()+interval '1 day'),($3,$4,now()+interval '1 day')",[hashToken(cookie),user,hashToken(adminCookie),admin]);
  await db.query("INSERT INTO catalog(id,name,kind,price,stock) VALUES($1,'Картридж','product',25000,8)",[item]);

  const pub = await api("/public");
  assert.equal(pub.paidBooking.amount,50000);
  const [first,second] = pub.resources.filter(r => r.city === "spb");
  const date = new Date(Date.now()+4*86400000).toISOString().slice(0,10);
  const payload = {resourceId:first.id,date,hour:10,duration:3,extras:[]};
  await api("/bookings",payload,409);
  const create = (hour = 10) => api("/bookings",{...payload,hour,bookingTermsVersion:pub.paidBooking.version},201);
  const booked = await create(), path = "/bookings/" + booked.bookingId;
  const fee = await checkout(booked.paymentId);
  assert.equal(fee.capture,true);
  assert.equal(fee.amount.value,"500.00");
  assert.deepEqual(fee.receipt.items.map(i => [i.description,i.payment_subject,i.payment_mode]),
    [["Бронирование рабочего места","service","full_payment"]]);
  await api(path+"/transfer",{},409);
  await successful(fee);
  await successful(fee);
  const original = await bookings(booked.bookingId);
  assert.equal(original.status,"confirmed");
  assert.equal(original.deposit,0);
  assert.equal(original.balance_used,0);
  await api(path+"/transfer",{},404,adminCookie);
  assert.equal((await api(path+"/transfer",{})).status,"awaiting_date");
  assert.ok((await api("/availability?duration=3&date="+date)).slots.find(s => s.hour === 10).free.includes(first.id));
  const target = {date, hour:13, resourceId:second.id};
  assert.equal((await api(path+"/transfer",target)).status,"confirmed");
  assert.equal((await api(path+"/transfer",target)).status,"confirmed");
  assert.equal((await bookings(booked.bookingId)).total,original.total);
  assert.equal((await api("/bookings")).payments.length,1);
  assert.equal(provider.size,1);

  const end = new Date(Math.ceil(Date.now()/3600000)*3600000);
  await db.query("UPDATE bookings SET starts_at=$2::timestamptz-interval '3 hours',ends_at=$2 WHERE id=$1",[booked.bookingId,end]);
  await api(path+"/transfer",{},409);
  await api(path+"/start",{});
  const quote = await api(path+"/extension?duration=6");
  const extension = {duration:6,start:quote.start,rate:quote.rate,resourceId:first.id};
  await api(path+"/extension",extension);
  await api(path+"/extension",extension);
  const extras = {requestId:uuid(),items:[{id:item,qty:2}]};
  await api(path+"/session-expenses",extras,201);
  await api(path+"/session-expenses",extras,201);
  const session = await bookings(booked.bookingId);
  assert.equal(session.tariff,9);
  assert.equal(session.total,original.total+quote.rate+50000);
  const invoice = await api(path+"/finish",{expectedTotal:session.total});
  assert.equal((await api(path+"/finish",{})).paymentId,invoice.paymentId);
  const final = await checkout(invoice.paymentId);
  assert.equal(final.amount.value,(session.total/100).toFixed(2));
  assert.deepEqual(final.receipt.items.map(i => [i.description,i.payment_subject,i.payment_mode]),
    [["Доступ к рабочему месту, 9 ч","service","full_payment"],["Картридж","commodity","full_payment"]]);
  await successful(final);
  assert.equal((await bookings(booked.bookingId)).status,"completed");

  const cancelled = await create(16), cancellationPayment = await checkout(cancelled.paymentId);
  await successful(cancellationPayment);
  await api("/bookings/"+cancelled.bookingId+"/transfer",{});
  await api("/bookings/"+cancelled.bookingId+"/cancel",{});
  await api("/admin/bookings/"+cancelled.bookingId+"/resolve-cancel",{decision:"refund",reason:"Отмена по обращению мастера"},200,adminCookie);
  await app.locals.reconcilePayments();
  assert.equal((await payment(cancelled.paymentId)).status,"refunded");
  const late = await create(19), latePayment = await checkout(late.paymentId);
  await db.query("UPDATE bookings SET expires_at=now()-interval '1 second' WHERE id=$1",[late.bookingId]);
  await successful(latePayment);
  await app.locals.reconcilePayments();
  assert.equal((await payment(late.paymentId)).status,"refunded");
  assert.equal((await bookings(late.bookingId)).status,"expired");
  assert.equal(refunds.size,2);
  assert.equal((await api("/bookings")).ledger.length,0);
});
