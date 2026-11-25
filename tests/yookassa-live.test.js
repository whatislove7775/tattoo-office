import { randomUUID } from "node:crypto";
import { test } from "node:test";
import assert from "node:assert/strict";
import { database } from "../server/db.js";
import { createApp } from "../server/index.js";
import { hashToken } from "../server/domain.js";

test("live checkout requires an active store with YooKassa receipts", async t => {
  Object.assign(process.env, {
    DATA_DIR: "memory://",
    YOOKASSA_SHOP_ID: "shop-live",
    YOOKASSA_SECRET_KEY: "live_mock",
    YOOKASSA_PAID_BOOKING: "true",
    YOOKASSA_LIVE_PAYMENTS: "true",
  });
  const fetchLocal = fetch;
  let store, requestCount = 0;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    if (!String(url).startsWith("https://api.yookassa.ru/")) return fetchLocal(url, options);
    assert.equal(url, "https://api.yookassa.ru/v3/me");
    assert.equal(options.method, "GET");
    requestCount++;
    return Response.json(store);
  });
  const db = await database();
  const app = await createApp(db);
  const server = app.listen(0, "127.0.0.1");
  await new Promise(resolve => server.on("listening", resolve));
  t.after(async () => {
    await new Promise(resolve => server.close(resolve));
    await db.close();
  });

  const admin = randomUUID(), token = randomUUID();
  await db.query("INSERT INTO users(id,email,password,name,role) VALUES($1,'owner@test.invalid','unused','Owner','admin')", [admin]);
  await db.query("INSERT INTO sessions VALUES($1,$2,now()+interval '1 day')", [hashToken(token),admin]);

  const base = "http://127.0.0.1:" + server.address().port + "/api";
  async function configure(body, expected) {
    const response = await fetchLocal(base + "/admin/settings", {
      method:"PATCH", headers:{ Cookie:"office_session="+token, "Content-Type":"application/json" },
      body:JSON.stringify(body),
    });
    const result = await response.json();
    assert.equal(response.status, expected, JSON.stringify(result));
    return result;
  }
  const publicSettings = async () => (await fetchLocal(base + "/public")).json();
  const launch = { mode:"live", legalApproved:true };
  const pub = await publicSettings();
  assert.equal(pub.paymentEnabled,false);
  await configure({mode:"live"},409);
  assert.equal(requestCount,0);

  store = { account_id:"shop-live", status:"enabled", test:false, payment_methods:["bank_card"], itn:pub.settings.inn };
  assert.match((await configure(launch,409)).error,/выключены чеки/);
  assert.equal((await publicSettings()).settings.mode,"test");

  store.fiscalization = { enabled:true, provider:"evotor" };
  assert.match((await configure(launch,409)).error,/подключите «Чеки от ЮKassa»/);
  store.fiscalization.provider = "yoo_receipt";
  store.itn = "000000000000";
  assert.match((await configure(launch,409)).error,/ИНН/);
  store.itn = pub.settings.inn;

  process.env.DEMO_MODE = "1";
  await configure(launch,409);
  delete process.env.DEMO_MODE;
  await configure(launch,200);

  const live = await publicSettings();
  assert.equal(live.settings.mode,"live");
  assert.equal(live.paymentEnabled,true);
  assert.equal(live.paidBooking.amount,50000);

  const requestsBeforePause = requestCount;
  await configure({ mode:"test" },200);
  assert.equal(requestCount,requestsBeforePause);
  assert.equal((await publicSettings()).paymentEnabled,false);
});
