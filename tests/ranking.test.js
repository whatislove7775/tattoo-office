import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {database} from '../server/db.js';
import {createApp} from '../server/index.js';
import {hashToken} from '../server/domain.js';

test('ranking uses registered masters, completed work, a 5% resident bonus and private opt-out',async()=>{
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
      for(const status of statuses) await db.query("INSERT INTO bookings(id,user_id,resource_id,starts_at,ends_at,tariff,rate,total,status) VALUES($1,$2,$3,'2026-01-01T10:00Z','2026-01-01T13:00Z',3,100,100,$4)",[randomUUID(),ids[name],resource,status]);
    }
    const ranking=async()=>{const r=await fetch(origin+'/api/ranking');assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'no-store');return r.json();};
    let result=await ranking();
    assert.deepEqual(result.masters.map(m=>m.name),['Busy','Resident','Regular','New']);
    assert.equal(result.masters[1].score,2.63);assert.equal(result.masters[2].score,2.5);
    assert.equal(result.masters[2].bookings,2);assert.equal(result.masters[2].completed,2);
    assert.equal(result.masters[1].resident,true);assert.equal(result.masters[3].score,0);
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
    // A newly confirmed rental contributes 0.25 without claiming completed work.
    await db.query("INSERT INTO bookings(id,user_id,resource_id,starts_at,ends_at,tariff,rate,total,status) VALUES($1,$2,$3,'2026-01-02T10:00Z','2026-01-02T13:00Z',3,100,100,'confirmed')",[randomUUID(),ids.New,resource]);
    const newcomer=(await ranking()).masters.find(m=>m.id===ids.New);
    assert.equal(newcomer.score,0.25);assert.equal(newcomer.completed,0);
  } finally {await new Promise(r=>server.close(r));await db.close();}
});
