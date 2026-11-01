import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { database } from '../server/db.js';
import { createApp } from '../server/index.js';
import { hashPassword } from '../server/domain.js';

test('owner edits a master profile and gallery without accessing another account', async () => {
  process.env.DATA_DIR = 'memory://';
  const db = await database(), app = await createApp(db), server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.on('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api`;
  const password = 'Admin-master-profile-2026';
  const ownerId = randomUUID(), masterId = randomUUID(), otherId = randomUUID();
  const request = async (path, method = 'GET', data, cookie) => {
    const response = await fetch(base + path, { method, headers: { ...(data ? {'Content-Type':'application/json'} : {}), ...(cookie ? {Cookie:cookie} : {}) }, body: data ? JSON.stringify(data) : undefined });
    return { status: response.status, data: await response.json(), cookie: response.headers.get('set-cookie')?.split(';')[0] };
  };
  try {
    await db.query("INSERT INTO users(id,email,password,name,role,account_type) VALUES($1,$2,$3,'Owner','admin','admin')", [ownerId,'owner-master@test.invalid',hashPassword(password)]);
    for (const [id,email] of [[masterId,'master-profile@test.invalid'],[otherId,'other-profile@test.invalid']])
      await db.query("INSERT INTO users(id,email,password,name,role,account_type) VALUES($1,$2,$3,'Master','guest','master')", [id,email,hashPassword(password)]);
    const owner = (await request('/auth/login','POST',{email:'owner-master@test.invalid',password,accountType:'admin'})).cookie;
    const master = (await request('/auth/login','POST',{email:'master-profile@test.invalid',password,accountType:'master'})).cookie;
    const route = `/admin/users/${masterId}`;
    assert.equal((await request(route+'/profile','PATCH',{name:'Недопустимо',profile:{}},master)).status,403);
    const saved = await request(route+'/profile','PATCH',{name:'Новое имя',profile:{city:'СПБ',bio:'Новый текст о мастере',status:'Сегодня работаю',rankingVisible:false,bookingLink:'https://t.me/tattoo_office'}},owner);
    assert.equal(saved.status,200);
    const profile = (await request(route+'/profile','GET',undefined,owner)).data;
    assert.equal(profile.name,'Новое имя'); assert.equal(profile.profile.bio,'Новый текст о мастере');
    assert.equal(profile.profile.rankingVisible,false); assert.equal(profile.profile.adminBookingLink,'https://t.me/tattoo_office');
    assert.equal((await request('/auth/login','POST',{email:'other-profile@test.invalid',password,accountType:'master'})).status,200);
    const jpeg = 'data:image/jpeg;base64,/9j/2Q==';
    const added = await request(route+'/gallery','POST',{kind:'portfolio',caption:'Первая работа',image:jpeg,thumbnail:jpeg},owner);
    assert.equal(added.status,201);
    assert.equal((await request(`/admin/users/${otherId}/gallery`,'GET',undefined,owner)).data.items.length,0);
    assert.equal((await request(route+'/gallery','PATCH',{items:[{id:added.data.id,kind:'drafts',caption:'Новый эскиз'}]},owner)).status,200);
    assert.equal((await request(route+'/gallery','GET',undefined,owner)).data.items[0].kind,'drafts');
    assert.equal((await request(route+'/gallery/'+added.data.id,'DELETE',undefined,owner)).status,200);
    assert.equal((await request(route+'/gallery','GET',undefined,owner)).data.items.length,0);
    assert.equal((await db.query("SELECT action FROM audit WHERE action LIKE 'master.%' ORDER BY created_at")).rows.length,4);
  } finally { await new Promise(resolve => server.close(resolve)); await db.close(); }
});
