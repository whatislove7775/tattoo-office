import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {database} from '../server/db.js';
import {createApp} from '../server/index.js';
import {hashToken} from '../server/domain.js';

test('ranking uses fully paid completed rentals, equal rules for residents and private opt-out',async()=>{
  process.env.DATA_DIR='memory://';
  const db=await database(), app=await createApp(db), server=app.listen(0,'127.0.0.1');
  await new Promise(r=>server.on('listening',r));
  const origin='http://127.0.0.1:'+server.address().port;
  try {
    const ids={};
    for(const [name,role,type,active,profile] of [
      ['Regular','guest','master',true,{}],['Resident','resident','master',true,{}],
      ['Busy','guest','master',true,{}],['New','guest','master',true,{}],
      ['Hidden','guest','master',true,{rankingVisible:false}],['Inactive','resident','master',false,{}],
      ['Customer','guest','customer',true,{}],['Admin','admin','admin',true,{}]
    ]) {
      ids[name]=randomUUID();
      await db.query('INSERT INTO users(id,email,password,name,role,account_type,active,profile) VALUES($1,$2,$3,$4,$5,$6,$7,$8)',[ids[name],name.toLowerCase()+'@test.invalid','unused-test-hash',name,role,type,active,JSON.stringify(profile)]);
    }
    const resource=(await db.query('SELECT id FROM resources LIMIT 1')).rows[0].id;
    for(const [name,statuses] of [['Regular',['completed','completed','cancelled','pending','expired']],['Resident',['completed','completed']],['Busy',['completed','completed','completed']],['Hidden',['completed']],['Customer',['completed']]]) {
      for(const status of statuses) { const bookingId=randomUUID();await db.query("INSERT INTO bookings(id,user_id,resource_id,starts_at,ends_at,tariff,rate,total,status) VALUES($1,$2,$3,'2026-01-01T10:00Z','2026-01-01T13:00Z',3,320000,320000,$4)",[bookingId,ids[name],resource,status]);if(status==='completed')await db.query("INSERT INTO payments(id,booking_id,kind,amount,status,provider_id,is_test) VALUES($1,$2,'final',320000,'paid',$3,false)",[randomUUID(),bookingId,'cash:'+bookingId]);}
    }
    const ranking=async()=>{const r=await fetch(origin+'/api/ranking');assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'no-store');const data=await r.json();data.masters=data.masters.filter(m=>Object.values(ids).includes(m.id));return data;};
    let result=await ranking();
    assert.deepEqual(result.masters.map(m=>m.name),['Busy','Regular','Resident','New']);
    assert.equal(result.masters[0].score,210);assert.equal(result.masters[1].score,140);assert.equal(result.masters[2].score,140);
    assert.equal(result.masters[2].bookings,2);assert.equal(result.masters[2].completed,2);
    assert.equal(result.masters[2].resident,true);assert.equal(result.masters[3].score,0);
    assert.ok(result.masters.every(m=>!('email' in m)&&!('profile' in m)&&!('password' in m)));
    const profile=await fetch(origin+'/api/masters/'+ids.Resident);
    assert.equal(profile.status,200);
    const publicData=(await profile.json()).master;
    assert.equal(publicData.name,'Resident');assert.equal(publicData.completed,2);
    assert.ok(!('email' in publicData)&&!('profile' in publicData)&&!('password' in publicData));
    for(const id of [ids.Inactive,ids.Customer,ids.Admin,'not-a-uuid'])assert.equal((await fetch(origin+'/api/masters/'+id)).status,404);
    const token='ranking-test-token';await db.query("INSERT INTO sessions VALUES($1,$2,now()+interval '1 day')",[hashToken(token),ids.Resident]);
    const update=async profile=>fetch(origin+'/api/me',{method:'PATCH',headers:{'Content-Type':'application/json',Cookie:'office_session='+token},body:JSON.stringify({name:'Resident',profile})});
    const avatar='data:image/jpeg;base64,/9j/2Q==';
    assert.equal((await update({city:'СПБ',avatar})).status,200);
    const updated=(await ranking()).masters.find(m=>m.id===ids.Resident);
    assert.equal(updated.city,'СПБ');assert.equal(updated.avatar,avatar);
    assert.equal((await update({city:'Other'})).status,400);
    assert.equal((await update({avatar:'data:image/svg+xml;base64,PHN2Zz4='})).status,400);
    assert.equal((await update({avatar:'https://untrusted.example/photo.jpg'})).status,400);
    assert.equal((await update({rankingVisible:false})).status,200);
    assert.ok(!(await ranking()).masters.some(m=>m.id===ids.Resident));
    assert.equal((await update({bio:'Updated biography'})).status,200);
    assert.ok(!(await ranking()).masters.some(m=>m.id===ids.Resident));
    assert.equal((await update({rankingVisible:'true'})).status,400);
    assert.equal((await update({rankingVisible:true})).status,200);
    assert.ok((await ranking()).masters.some(m=>m.id===ids.Resident));
    // A newly confirmed rental does not earn points before full settlement.
    await db.query("INSERT INTO bookings(id,user_id,resource_id,starts_at,ends_at,tariff,rate,total,status) VALUES($1,$2,$3,'2026-01-02T10:00Z','2026-01-02T13:00Z',3,100,100,'confirmed')",[randomUUID(),ids.New,resource]);
    const newcomer=(await ranking()).masters.find(m=>m.id===ids.New);
    assert.equal(newcomer.score,0);assert.equal(newcomer.completed,0);
    // Unknown legacy online payments and test payments are not proof of revenue.
    for(const [provider,isTest] of [[null,null],['yookassa:old-test',null],['test-old',true],['cash:legacy',null],['yookassa:verified-live',false]]){
      const id=randomUUID();await db.query("INSERT INTO bookings(id,user_id,resource_id,starts_at,ends_at,tariff,rate,total,status) VALUES($1,$2,$3,'2026-01-03T10:00Z','2026-01-03T13:00Z',3,320000,320000,'completed')",[id,ids.New,resource]);
      await db.query("INSERT INTO payments(id,booking_id,kind,amount,status,provider_id,is_test) VALUES($1,$2,'final',320000,'paid',$3,$4)",[randomUUID(),id,provider,isTest]);
    }
    assert.equal((await ranking()).masters.find(m=>m.id===ids.New).score,140);
    assert.equal((await fetch(origin+'/api/me/ranking')).status,401);
    const own=await fetch(origin+'/api/me/ranking',{headers:{Cookie:'office_session='+token}});
    assert.equal(own.status,200);assert.equal((await own.json()).score,140);
    const config=async rules=>fetch(origin+'/api/admin/settings',{method:'PATCH',headers:{'Content-Type':'application/json',Cookie:'office_session='+token},body:JSON.stringify({rankingRules:rules})});
    assert.equal((await config({bookingPoints:900})).status,403);
    assert.equal((await update({score:999999,rankingPoints:999999})).status,200);
    assert.equal((await (await fetch(origin+'/api/me/ranking',{headers:{Cookie:'office_session='+token}})).json()).score,140);
    await db.query("UPDATE users SET role='admin' WHERE id=$1",[ids.Resident]);
    assert.equal((await config({bookingRubles:0})).status,400);
    assert.equal((await config({bookingPoints:1.5})).status,400);
    assert.equal((await config({unknown:1})).status,400);
    assert.equal((await config({bookingPoints:140})).status,200);
    assert.equal((await ranking()).masters.find(m=>m.id===ids.Regular).score,280);
  } finally {await new Promise(r=>server.close(r));await db.close();}
});
