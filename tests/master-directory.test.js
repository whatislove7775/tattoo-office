import test from 'node:test';import assert from 'node:assert/strict';import {randomUUID} from 'node:crypto';
import {database} from '../server/db.js';import {createApp} from '../server/index.js';import {hashToken} from '../server/domain.js';
test('one directory preserves legacy cards, links accounts, isolates media and respects ranking opt-out and month boundaries',async()=>{
  process.env.DATA_DIR='memory://';const db=await database(),app=await createApp(db),server=app.listen(0,'127.0.0.1');await new Promise(r=>server.on('listening',r));const origin='http://127.0.0.1:'+server.address().port;
  const ids={},cookies={};
  const request=(path,method='GET',body,user='master')=>fetch(origin+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookies[user]?{Cookie:cookies[user]}:{})},body:body===undefined?undefined:JSON.stringify(body)});
  try{
    for(const [key,role,type] of [['master','resident','master'],['other','guest','master'],['admin','admin','admin']]){
      const id=randomUUID(),token=randomUUID();ids[key]=id;cookies[key]='office_session='+token;
      await db.query('INSERT INTO users(id,email,password,name,role,account_type) VALUES($1,$2,$3,$4,$5,$6)',[id,key+'@test.invalid','test-only',key,role,type]);await db.query("INSERT INTO sessions VALUES($1,$2,now()+interval '1 day')",[hashToken(token),id]);
    }
    let directory=(await (await request('/directory')).json()).masters;assert.equal(directory.length,12);assert.ok(directory.every(m=>!('email'in m)&&!('password'in m)));
    assert.equal((await request('/admin/masters/zinaida/account','PUT',{userId:ids.master})).status,403);
    assert.equal((await request('/admin/masters/zinaida/account','PUT',{userId:ids.master},'admin')).status,200);
    directory=(await (await request('/directory')).json()).masters;assert.equal(directory.length,11);assert.ok(!directory.some(m=>m.id===ids.master));
    assert.equal((await request('/me','PATCH',{name:'Общее имя',profile:{city:'СПБ',age:30,experience:'8 лет',bio:'Общее описание'}})).status,200);
    assert.equal((await request('/me','PATCH',{name:'Общее имя',profile:{bookingLink:'https://t.me/not_allowed'}})).status,403);
    assert.equal((await request('/me','PATCH',{name:'Общее имя',profile:{adminBookingLink:'https://t.me/not_allowed'}})).status,403);
    assert.equal((await request('/admin/users/'+ids.master,'PATCH',{bookingLink:'https://t.me/example_master'},'admin')).status,200);
    assert.equal((await request('/admin/users/'+ids.master,'PATCH',{bookingLink:'javascript:alert(1)'},'admin')).status,400);
    const card=(await (await request('/masters/zinaida')).json()).master;assert.equal(card.name,'Общее имя');assert.equal(card.resident,true);assert.equal(card.city,'СПБ');assert.equal(card.age,30);assert.equal(card.exp,'8 лет');assert.equal(card.bookingLink,'https://t.me/example_master');
    assert.equal((await (await request('/masters/'+ids.master)).json()).master.id,'zinaida');
    assert.equal((await request('/admin/users/'+ids.master,'PATCH',{bookingLink:''},'admin')).status,200);assert.equal((await (await request('/masters/zinaida')).json()).master.bookingLink,'');
    const resource=(await db.query('SELECT id FROM resources LIMIT 1')).rows[0].id;
    for(const offset of [-1,0,1])await db.query("INSERT INTO bookings(id,user_id,resource_id,starts_at,ends_at,tariff,rate,total,status) VALUES($1,$2,$3,(date_trunc('month',now() AT TIME ZONE 'Europe/Moscow')+($4::int * interval '1 month')+interval '1 day') AT TIME ZONE 'Europe/Moscow',(date_trunc('month',now() AT TIME ZONE 'Europe/Moscow')+($4::int * interval '1 month')+interval '1 day 3 hours') AT TIME ZONE 'Europe/Moscow',3,100,100,'completed')",[randomUUID(),ids.master,resource,offset]);
    const ranking=async period=>(await (await request('/ranking?period='+period)).json()).masters;
    assert.equal((await ranking('all')).find(m=>m.id==='zinaida').completed,3);assert.equal((await ranking('month')).find(m=>m.id==='zinaida').completed,1);
    await request('/me','PATCH',{name:'Общее имя',profile:{rankingVisible:false}});assert.ok(!(await ranking('all')).some(m=>m.id==='zinaida'));assert.equal((await request('/masters/zinaida')).status,200);
    const jpeg='data:image/jpeg;base64,/9j/2Q==';
    assert.equal((await request('/me/gallery','POST',{kind:'portfolio',image:'data:image/svg+xml;base64,PHN2Zz4=',thumbnail:jpeg})).status,400);
    const added=await request('/me/gallery','POST',{kind:'portfolio',caption:'Своя работа',image:jpeg,thumbnail:jpeg});assert.equal(added.status,201);const {id}=await added.json();
    const media=await request('/media/'+id+'?size=thumb');assert.equal(media.headers.get('content-type'),'image/jpeg');assert.equal((await media.arrayBuffer()).byteLength,4);
    assert.equal((await request('/me/gallery/'+id,'DELETE',undefined,'other')).status,404);
    assert.equal((await request('/me/gallery','PATCH',{items:[null]})).status,400);
    const gallery=(await (await request('/me/gallery')).json()).items;assert.equal(gallery.length,1);assert.ok(!('image'in gallery[0]));
    assert.equal((await (await request('/masters/zinaida')).json()).master.portfolio[0].cap,'Своя работа');
    await request('/me/gallery','PATCH',{items:[{id,kind:'drafts',caption:'Эскиз'}]});assert.equal((await (await request('/masters/zinaida')).json()).master.drafts.length,1);
    await request('/me/gallery/'+id,'DELETE');assert.equal((await (await request('/masters/zinaida')).json()).master.portfolio.length,0);assert.equal((await request('/media/'+id)).status,404);
    await db.query('UPDATE users SET active=false WHERE id=$1',[ids.master]);assert.equal((await request('/masters/zinaida')).status,404);
  }finally{await new Promise(r=>server.close(r));await db.close();}
});
