import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { database } from '../server/db.js';
import { createApp } from '../server/index.js';
import { hashPassword, hashToken } from '../server/domain.js';

test('ЮKassa: retries reuse checkout; forged success cannot pay; amount and test flag verified; settlement is idempotent', async () => {
  process.env.DATA_DIR='memory://';
  process.env.YOOKASSA_SHOP_ID='test-shop';
  process.env.YOOKASSA_SECRET_KEY='test_fake-key';
  const originalFetch=globalThis.fetch;
  let remote, creates=0;
  globalThis.fetch=async (url, options) => {
    if (!String(url).startsWith('https://api.yookassa.ru/')) return originalFetch(url,options);
    if(options.method==='POST') {
      creates++;
      const data=JSON.parse(options.body);
      assert.ok(options.headers['Idempotence-Key']);
      remote={...data,id:randomUUID(),test:true,paid:false,status:'pending',confirmation:{confirmation_url:'https://yoomoney.ru/test-checkout'}};
    }
    return Response.json(remote);
  };
  const db=await database();
  const server=(await createApp(db)).listen(0,'127.0.0.1');
  await new Promise(resolve=>server.on('listening',resolve));
  const base='http://127.0.0.1:'+server.address().port+'/api';
  const user=randomUUID(),token=randomUUID();
  await db.query("INSERT INTO users(id,email,password,name,role) VALUES($1,'payment@test.invalid',$2,'Payment test','guest')",[user,hashPassword('Test-password-2026')]);
  await db.query("INSERT INTO sessions VALUES($1,$2,now()+interval '1 day')",[hashToken(token),user]);
  async function request(path,body) {
    const response=await originalFetch(base+path,{method:body?'POST':'GET',headers:{Cookie:'office_session='+token,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});
    return {status:response.status,data:await response.json()};
  }
  try {
    const resource=(await request('/public')).data.resources[0].id;
    const booked=await request('/bookings',{resourceId:resource,date:new Date(Date.now()+4*86400000).toISOString().slice(0,10),hour:10,duration:3,extras:[]});
    assert.equal(booked.status,201);
    const path='/payments/'+booked.data.paymentId;
    assert.equal((await request(path+'/checkout',{})).status,200);
    assert.equal((await request(path+'/checkout',{})).status,200);
    assert.equal(creates,1);
    assert.equal((await request(path+'/test',{})).status,403);
    assert.equal((await request('/webhooks/yookassa',{event:'payment.succeeded',object:{id:remote.id,status:'succeeded',paid:true}})).status,200);
    assert.equal((await request(path)).data.payment.status,'pending');
    remote.status='succeeded';remote.paid=true;
    const amount=remote.amount;remote.amount={value:'1.00',currency:'RUB'};
    assert.equal((await request(path)).status,409);
    remote.amount=amount;remote.test=false;
    assert.equal((await request(path)).status,409);
    remote.test=true;
    assert.equal((await request(path)).data.payment.status,'paid');
    assert.equal((await request('/webhooks/yookassa',{object:{id:remote.id}})).status,200);
    assert.equal((await request('/me')).data.user.sequence,1);
    assert.equal((await db.query("SELECT * FROM outbox WHERE kind='receipt.create'")).rows.length,0);
    const late=await request('/bookings',{resourceId:resource,date:new Date(Date.now()+5*86400000).toISOString().slice(0,10),hour:10,duration:3,extras:[]});
    const latePath='/payments/'+late.data.paymentId;
    await request(latePath+'/checkout',{});
    await db.query("UPDATE bookings SET expires_at=now()-interval '1 minute' WHERE id=$1",[late.data.bookingId]);
    remote.status='succeeded';remote.paid=true;
    assert.equal((await request(latePath)).data.payment.status,'paid');
    assert.equal((await request('/me')).data.user.balance,50000);
    assert.equal((await db.query('SELECT status FROM bookings WHERE id=$1',[late.data.bookingId])).rows[0].status,'expired');
    await request(latePath);
    assert.equal((await request('/me')).data.user.balance,50000);
  } finally {
    globalThis.fetch=originalFetch;
    delete process.env.YOOKASSA_SHOP_ID;delete process.env.YOOKASSA_SECRET_KEY;
    await new Promise(resolve=>server.close(resolve));await db.close();
  }
});
