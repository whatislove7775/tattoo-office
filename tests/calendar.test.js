import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID, generateKeyPairSync } from 'node:crypto';
import { database } from '../server/db.js';
import { createApp } from '../server/index.js';
import { workerTick } from '../server/worker.js';

test('calendar queue syncs closed intervals in payment test mode only when enabled, without duplicates', async () => {
  process.env.DATA_DIR = 'memory://';
  process.env.GOOGLE_CALENDAR_SYNC_ENABLED = 'false';
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  process.env.GOOGLE_SERVICE_ACCOUNT = JSON.stringify({ client_email: 'calendar@test.invalid', private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }) });
  const db = await database();
  await createApp(db);
  const originalFetch = globalThis.fetch, calls = [], events = new Map();
  globalThis.fetch = async (url, options = {}) => {
    if (url === 'https://oauth2.googleapis.com/token') return Response.json({ access_token: 'test-only-token' });
    assert.ok(url.startsWith('https://www.googleapis.com/calendar/v3/calendars/'));
    if (!options.method) return Response.json({items:[]});
    calls.push({ url, ...options });
    if (options.method === 'POST') {
      const event = JSON.parse(options.body);
      assert.equal(event.visibility, 'default');
      assert.ok(!events.has(event.id));
      events.set(event.id, event);
      return Response.json(event);
    }
    const id = url.split('/').at(-1);
    if (options.method === 'DELETE') { events.delete(id); return new Response(null, { status: 204 }); }
    if (!events.has(id)) return Response.json({}, { status: 404 });
    events.set(id, JSON.parse(options.body));
    return Response.json(events.get(id));
  };
  try {
    const resource = (await db.query('SELECT id FROM resources LIMIT 1')).rows[0];
    await db.query('UPDATE resources SET calendar_id=$1 WHERE id=$2', ['workspace@test.invalid', resource.id]);
    const block = { id: randomUUID(), resource_id: resource.id, starts_at: '2030-01-01T09:00:00Z', ends_at: '2030-01-01T10:00:00Z', reason: 'Test' };
    await db.query('INSERT INTO blocks VALUES($1,$2,$3,$4,$5)', Object.values(block));
    const queue = async (kind, payload, status = 'done') => { const id = randomUUID(); await db.query('INSERT INTO outbox(id,kind,payload) VALUES($1,$2,$3)', [id, kind, JSON.stringify(payload)]); await workerTick(db); assert.equal((await db.query('SELECT status FROM outbox WHERE id=$1', [id])).rows[0].status, status); };
    await queue('calendar.block', { blockId: block.id }, 'simulated');
    assert.equal(calls.length, 0);
    process.env.GOOGLE_CALENDAR_SYNC_ENABLED = 'true';
    assert.equal((await db.query('SELECT data FROM settings')).rows[0].data.mode, 'test');
    await queue('calendar.block', { blockId: block.id });
    await queue('calendar.block', { blockId: block.id });
    assert.equal(events.size, 1);
    assert.equal(calls.filter(c => c.method === 'POST').length, 1);
    await queue('calendar.unblock', { block });
    assert.equal(events.size, 0);
    assert.equal(calls.at(-1).method, 'DELETE');
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.GOOGLE_CALENDAR_SYNC_ENABLED;
    delete process.env.GOOGLE_SERVICE_ACCOUNT;
    await db.close();
  }
});

test('Google busy events block only their workspace; moves, deletions, all-day events and API failures are handled', async () => {
  const { refreshCalendarBusy } = await import('../server/calendar-sync.js');
  process.env.DATA_DIR='memory://';
  const {privateKey}=generateKeyPairSync('rsa',{modulusLength:2048});
  process.env.GOOGLE_SERVICE_ACCOUNT=JSON.stringify({client_email:'calendar@test.invalid',private_key:privateKey.export({type:'pkcs8',format:'pem'})});
  const db=await database(),app=await createApp(db),server=app.listen(0,'127.0.0.1');
  await new Promise(r=>server.on('listening',r));
  const base='http://127.0.0.1:'+server.address().port, originalFetch=globalThis.fetch;
  const resources=(await db.query('SELECT id FROM resources ORDER BY name')).rows;
  await db.query('UPDATE resources SET calendar_id=$1 WHERE id=$2',['one@test.invalid',resources[0].id]);
  await db.query('UPDATE resources SET calendar_id=$1 WHERE id=$2',['two@test.invalid',resources[1].id]);
  const date=new Date(Date.now()+2*86400000).toISOString().slice(0,10),allDay=new Date(Date.now()+3*86400000).toISOString().slice(0,10),allDayEnd=new Date(Date.now()+4*86400000).toISOString().slice(0,10);
  const event=(id,hour)=>({id,start:{dateTime:`${date}T${hour}:00:00+03:00`},end:{dateTime:`${date}T${String(Number(hour)+3).padStart(2,'0')}:00:00+03:00`}});
  let phase='initial',pages=0;
  globalThis.fetch=async(url,options={})=>{
    if(String(url).startsWith(base)) return originalFetch(url,options);
    if(url==='https://oauth2.googleapis.com/token')return Response.json({access_token:'test-only-token'});
    assert.ok(String(url).startsWith('https://www.googleapis.com/calendar/v3/calendars/'));
    if(phase==='failure')return Response.json({},{status:503});
    if(String(url).includes('two%40'))return Response.json({items:[]});
    if(phase==='deleted')return Response.json({items:[]});
    const params=new URL(String(url)).searchParams;
    assert.equal(params.get('singleEvents'),'true');
    pages++;
    if(params.has('pageToken'))return Response.json({items:[{id:'all-day',start:{date:allDay},end:{date:allDayEnd}}]});
    return Response.json({nextPageToken:'next',items:[event('recurring-instance',phase==='moved'?'14':'10'),{...event('free','10'),transparency:'transparent'},{...event('cancelled','10'),status:'cancelled'},{...event('site','10'),extendedProperties:{private:{tattooOffice:'workspace'}}}]});
  };
  const request=async(path,data,cookie)=>{const r=await fetch(base+'/api'+path,{method:data?'POST':'GET',headers:{...(data?{'Content-Type':'application/json'}:{}),...(cookie?{Cookie:cookie}:{})},body:data?JSON.stringify(data):undefined});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};};
  try {
    const user=await request('/auth/register',{name:'Calendar test',email:'calendar-booking@test.invalid',password:'Office-calendar-test-2026',rules:true,consent:true});
    process.env.GOOGLE_CALENDAR_SYNC_ENABLED='true';
    await refreshCalendarBusy(db,0);
    assert.equal(pages,2);
    assert.equal((await db.query('SELECT count(*)::int n FROM calendar_busy')).rows[0].n,2);
    const availability=await request(`/availability?date=${date}&duration=3`);
    assert.ok(!availability.data.slots.find(s=>s.hour===10).free.includes(resources[0].id));
    assert.ok(availability.data.slots.find(s=>s.hour===10).free.includes(resources[1].id));
    const booking={date,hour:10,duration:3,resourceId:resources[0].id,extras:[]};
    assert.equal((await request('/bookings',booking,user.cookie)).status,409);
    const day=await request(`/availability?date=${allDay}&duration=3`);
    assert.ok(day.data.slots.every(s=>!s.free.includes(resources[0].id)));
    phase='moved';await refreshCalendarBusy(db,0);
    const moved=await request(`/availability?date=${date}&duration=3`);
    assert.ok(moved.data.slots.find(s=>s.hour===10).free.includes(resources[0].id));
    assert.ok(!moved.data.slots.find(s=>s.hour===14).free.includes(resources[0].id));
    phase='failure';await assert.rejects(refreshCalendarBusy(db,0));
    assert.equal((await db.query('SELECT count(*)::int n FROM calendar_busy')).rows[0].n,2);
    assert.equal((await request('/bookings',booking,user.cookie)).status,503);
    phase='deleted';await refreshCalendarBusy(db,0);
    assert.equal((await db.query('SELECT count(*)::int n FROM calendar_busy')).rows[0].n,0);
    assert.ok((await request(`/availability?date=${date}&duration=3`)).data.slots.find(s=>s.hour===14).free.includes(resources[0].id));
  } finally {globalThis.fetch=originalFetch;delete process.env.GOOGLE_CALENDAR_SYNC_ENABLED;delete process.env.GOOGLE_SERVICE_ACCOUNT;await new Promise(r=>server.close(r));await db.close();}
});
