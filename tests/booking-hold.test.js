import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID as uuid } from "node:crypto";
import { database } from "../server/db.js";
import { createApp } from "../server/index.js";
import { hashToken } from "../server/domain.js";
import { bookingTermsVersion } from "../server/booking-terms.js";

test("ЮKassa: холд, переезд на шесть часов, расходы, оплата и отмена", async () => {
  process.env.DATA_DIR = "memory://";
  process.env.YOOKASSA_SHOP_ID = "test-shop";
  process.env.YOOKASSA_SECRET_KEY = "test_mock";
  process.env.YOOKASSA_BOOKING_HOLD = "true";
  const fetchReal = globalThis.fetch;
  const provider = new Map();
  const authorizations = new Map();
  globalThis.fetch = async (url, opts) => {
    const prefix = "https://api.yookassa.ru/v3/payments";
    if (!String(url).startsWith(prefix)) return fetchReal(url, opts);
    const [, id, command] = String(url).slice(prefix.length).split("/");
    if (!id) {
      const request = JSON.parse(opts.body);
      const previous = authorizations.get(opts.headers["Idempotence-Key"]);
      if (previous) return Response.json(previous);
      const payment = { ...request, id:uuid(), test:true, status:"pending", paid:false,
        confirmation:{confirmation_url:"https://yoomoney.ru/test-checkout"} };
      authorizations.set(opts.headers["Idempotence-Key"],payment);
      provider.set(payment.id,payment);
      return Response.json(payment);
    }
    const payment = provider.get(id);
    if (command === "cancel") {
      assert.equal(payment.status,"waiting_for_capture");
      payment.status="canceled";
    } else assert.equal(opts.method,"GET");
    return Response.json(payment);
  };
  const db = await database();
  const app = await createApp(db);
  const server = app.listen(0,"127.0.0.1");
  await new Promise(resolve=>server.on("listening",resolve));
  const base = "http://127.0.0.1:" + server.address().port + "/api";
  const user = uuid(), token = uuid(), admin = uuid(), adminToken = uuid();
  const item = uuid();
  async function request(path, body, expected = 200, cookie = token) {
    const response = await fetchReal(base + path, {method:body ? "POST" : "GET",
      headers:{Cookie:"office_session="+cookie,"Content-Type":"application/json"},
      body:body && JSON.stringify(body)});
    const json=await response.json();
    assert.equal(response.status,expected,JSON.stringify(json));
    return json;
  }
  const payPath = p => "/payments/" + p;
  const bookPath = b => "/bookings/" + b;
  const date = new Date(Date.now()+4*86400000).toISOString().slice(0,10);
  const notifyProvider = remote => request("/webhooks/yookassa",{object:{id:remote.id}});
  const checkout = async (id) => {
    await request(payPath(id)+"/checkout",{});
    const data = (await request(payPath(id))).payment;
    return provider.get(data.checkout_id);
  };
  try {
    await db.query("INSERT INTO users(id,email,password,name,role) VALUES($1,'hold@test.invalid','unused','Master','guest'),($2,'admin@test.invalid','unused','Admin','admin')",[user,admin]);
    await db.query("INSERT INTO sessions VALUES($1,$2,now()+interval '1 day'),($3,$4,now()+interval '1 day')",[hashToken(token),user,hashToken(adminToken),admin]);
    await db.query("INSERT INTO catalog(id,name,kind,price,stock) VALUES($1,'Картридж','product',25000,8)",[item]);
    const pub = await request("/public");
    assert.equal(pub.bookingHold.version,bookingTermsVersion);
    const [first, second] = pub.resources;
    const body = {resourceId:first.id,date,hour:10,duration:3,extras:[],bookingTermsVersion};
    await request("/bookings",{...body,bookingTermsVersion:"obsolete"},409);
    const booked = await request("/bookings",body,201);
    const held = await checkout(booked.paymentId);
    assert.equal(held.capture,false);
    assert.equal(held.payment_method_data.type,"bank_card");
    assert.equal(held.amount.value,"500.00");
    await notifyProvider(held);
    assert.equal((await request("/bookings")).bookings[0].status,"pending");

    held.status="waiting_for_capture";
    held.expires_at=new Date(Date.now()+7*86400000).toISOString();
    await notifyProvider(held);
    await notifyProvider(held);
    assert.equal((await request(payPath(booked.paymentId))).payment.status,"authorized");
    assert.equal((await request("/bookings")).bookings[0].status,"confirmed");
    await request(bookPath(booked.bookingId)+"/start",{},409);
    const end = new Date(Math.ceil(Date.now()/3600000)*3600000);
    await db.query("UPDATE bookings SET starts_at=$2::timestamptz-interval '3 hours', ends_at=$2 WHERE id=$1",[booked.bookingId,end.toISOString()]);
    await request(bookPath(booked.bookingId)+"/start",{});
    await app.locals.reconcilePayments();
    assert.equal(held.status,"canceled");
    const quote = await request(bookPath(booked.bookingId)+"/extension?duration=6");
    assert.ok(quote.resources.some(r=>r.id===second.id));
    const extension = {duration:6,start:quote.start,rate:quote.rate,resourceId:second.id};
    await request(bookPath(booked.bookingId)+"/extension",extension);
    await request(bookPath(booked.bookingId)+"/extension",extension);
    const sameTime = new Date(+end + 3*3600000).toISOString();
    await request("/admin/blocks",{resourceId:second.id,startsAt:end,endsAt:new Date(+end+3600000)},409,adminToken);
    const availability = await request("/availability?duration=3&date="+sameTime.slice(0,10));
    const startSlot = availability.slots.find(s=>s.hour===Number(sameTime.slice(11,13)));
    assert.ok(startSlot?.free.includes(first.id));
    assert.ok(!startSlot.free.includes(second.id));
    const expense = {requestId:uuid(),items:[{id:item,qty:2}]};
    await request(bookPath(booked.bookingId)+"/session-expenses",expense,201);
    await request(bookPath(booked.bookingId)+"/session-expenses",expense,201);
    const session = (await request("/bookings")).bookings[0];
    assert.equal(session.tariff,9);
    assert.equal(session.segments.length,1);
    assert.equal(session.deposit,0);
    assert.equal(session.total,quote.total+50000);
    await request(bookPath(booked.bookingId)+"/finish",{expectedTotal:quote.total},409);
    const invoice = await request(bookPath(booked.bookingId)+"/finish",{expectedTotal:session.total});
    assert.equal((await request(bookPath(booked.bookingId)+"/finish",{})).paymentId,invoice.paymentId);
    const canceledFinal = await checkout(invoice.paymentId);
    assert.equal(canceledFinal.capture,true);
    assert.equal(canceledFinal.amount.value,(session.total/100).toFixed(2));
    assert.equal(canceledFinal.receipt.items[1].payment_subject,"commodity");
    canceledFinal.status="canceled";
    await notifyProvider(canceledFinal);
    const final = await checkout(invoice.paymentId);
    assert.notEqual(final.id,canceledFinal.id);
    assert.equal(final.amount.value,canceledFinal.amount.value);
    final.status="succeeded";final.paid=true;
    await notifyProvider(final);
    assert.equal((await request("/bookings")).bookings[0].status,"completed");
    assert.equal((await db.query("SELECT stock FROM catalog WHERE id=$1",[item])).rows[0].stock,6);

    for (const late of [false,true]) {
      const future = await request("/bookings",{...body,hour:late?13:16},201);
      const remote = await checkout(future.paymentId);
      remote.status="waiting_for_capture";remote.expires_at=held.expires_at;
      await notifyProvider(remote);
      if (late) await db.query("UPDATE bookings SET starts_at=now()+interval '1 hour',ends_at=now()+interval '4 hours' WHERE id=$1",[future.bookingId]);
      await request(bookPath(future.bookingId)+"/cancel",{});
      if (late) {
        assert.equal((await request("/bookings")).bookings.find(b=>b.id===future.bookingId).status,"cancel_requested");
        await request("/admin/bookings/"+future.bookingId+"/resolve-cancel",{},200,adminToken);
      }
      await app.locals.reconcilePayments();
      assert.equal(remote.status,"canceled");
    }
    assert.equal((await db.query("SELECT count(*)::int AS n FROM ledger")).rows[0].n,0);
  } finally {
    globalThis.fetch=fetchReal;
    delete process.env.YOOKASSA_BOOKING_HOLD;
    delete process.env.YOOKASSA_SECRET_KEY;
    delete process.env.YOOKASSA_SHOP_ID;
    await new Promise(resolve=>server.close(resolve));
    await db.close();
  }
});
