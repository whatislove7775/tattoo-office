import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createApp} from '../server/index.js';
import {database} from '../server/db.js';
import {hashToken} from '../server/domain.js';
import {openRankingSeason} from '../server/ranking-seasons.js';
import {rankingYear} from '../server/ranking-points.js';

test('annual prizes isolate real dated points, accept owner edits and preserve the final podium',async()=>{
  process.env.DATA_DIR='memory://';
  const db=await database(),app=await createApp(db),server=app.listen(0,'127.0.0.1');
  await new Promise(r=>server.on('listening',r));
  const origin='http://127.0.0.1:'+server.address().port;
  const get=async()=> (await fetch(origin+'/api/ranking?period=year')).json();
  const year=rankingYear(), member=randomUUID(),owner=randomUUID();
  try{
    for(const [id,role,account] of [[member,'guest','master'],[owner,'admin','admin']]){
      await db.query('INSERT INTO users(id,email,name,password,role,account_type,profile) VALUES($1,$2,$3,$4,$5,$6,$7)',[id,id+'@example.invalid','Мастер','unused',role,account,JSON.stringify({avatar:'data:image/jpeg;base64,/9j/2Q==',city:'СПБ',bio:'я'.repeat(81),specialty:'Графика',experience:'5 лет',adminPointsAdjustment:999})]);
      await db.query("INSERT INTO sessions VALUES($1,$2,now()+interval '1 day')",[hashToken(id),id]);
    }
    const resource=(await db.query('SELECT id FROM resources LIMIT 1')).rows[0].id;
    for(const [start,demo] of [[year+'-01-01T00:00:00+03:00',false],[(year-1)+'-12-31T23:59:59+03:00',false],[year+'-05-01T12:00:00+03:00',true]]){
      const id=randomUUID();
      await db.query("INSERT INTO bookings(id,user_id,resource_id,starts_at,ends_at,tariff,rate,total,status) VALUES($1,$2,$3,$4,$4::timestamptz+interval '3 hours',3,320000,320000,'completed')",[id,member,resource,start]);
      await db.query("INSERT INTO payments(id,booking_id,kind,amount,status,provider_id,is_test) VALUES($1,$2,'final',320000,'paid',$3,false)",[randomUUID(),id,(demo?'cash:demo-':'cash:')+id]);
    }
    for(const [kind,image,y] of [['portfolio','old',year-1],['portfolio','old',year],['portfolio','new',year],['drafts','draft',year]]){
      await db.query("INSERT INTO master_media(id,user_id,kind,image,thumbnail,created_at) VALUES($1,$2,$3,$4,'thumb',$5)",[randomUUID(),member,kind,image,y+'-02-01T12:00:00+03:00']);
    }
    for(const [id,previous,score] of [[randomUUID(),0,4],['00000000-0000-4000-8008-000000000123',0,900]]){
      await db.query("INSERT INTO audit VALUES($1,$2,'master.points.update',$3,$4)",[id,owner,JSON.stringify({id:member,previous,score}),year+'-03-01T12:00:00+03:00']);
    }
    const initial=await get();
    assert.equal(initial.prizeFund.examples,true);
    assert.equal(initial.prizeFund.prizes.length,3);
    const match=initial.masters.find(m=>m.id===member);
    assert.equal(match.score,82);assert.equal(match.rank,1);
    const fund={year,prizes:['Смена','Сертификат','Набор'],examples:false};
    const save=(user,data)=>fetch(origin+'/api/admin/settings',{method:'PATCH',headers:{'Content-Type':'application/json',Cookie:'office_session='+user},body:JSON.stringify({prizeFund:data})});
    assert.equal((await save(member,fund)).status,403);
    assert.equal((await save(owner,{...fund,year:year-1})).status,409);
    assert.equal((await save(owner,{...fund,prizes:['два','приза']})).status,400);
    assert.equal((await save(owner,fund)).status,200);
    assert.deepEqual((await get()).prizeFund,fund);
    await db.transaction(q=>openRankingSeason(q,year+1));
    const final=(await db.query('SELECT winners,prizes FROM ranking_seasons WHERE year=$1',[year])).rows[0];
    assert.deepEqual(final.prizes,fund.prizes);assert.deepEqual(final.winners,[{id:member,name:'Мастер',rank:1,score:82}]);
    await db.query('DELETE FROM master_media WHERE user_id=$1',[member]);
    await db.transaction(q=>openRankingSeason(q,year+1));
    assert.deepEqual((await db.query('SELECT winners FROM ranking_seasons WHERE year=$1',[year])).rows[0].winners,final.winners);
  }finally{await new Promise(r=>server.close(r));await db.close();}
});
