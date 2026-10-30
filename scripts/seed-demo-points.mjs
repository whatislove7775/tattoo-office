// Run with --apply once, after the owner has confirmed the demo-card scope.
import {readFile} from 'node:fs/promises';
import {randomInt,randomUUID} from 'node:crypto';
import {database} from '../server/db.js';
const catalog=JSON.parse(await readFile(new URL('../server/master-catalog.json',import.meta.url),'utf8'));
const db=await database();
try {
  const apply=process.argv.includes('--apply');
  const result=await db.transaction(async q=>{
    await q.query('SELECT id FROM settings WHERE id=1 FOR UPDATE');
    const links=new Set((await q.query('SELECT master_id FROM master_links')).rows.map(r=>r.master_id));
    const content=new Map((await q.query("SELECT id,data FROM content WHERE id LIKE 'master-%'")).rows.map(r=>[r.id,r.data]));
    const used=new Set(),changes=[];
    for(const master of catalog) {
      if(links.has(master.id)||content.get(master.contentId)?.pointsAdjustment!==undefined)continue;
      let score;do {score=randomInt(120,1501);}while(used.has(score));used.add(score);
      changes.push({id:master.id,score});
      if(apply)await q.query("INSERT INTO content(id,data) VALUES($1,$2) ON CONFLICT(id) DO UPDATE SET data=content.data || $2::jsonb",[master.contentId,JSON.stringify({pointsAdjustment:score})]);
    }
    if(apply&&changes.length)await q.query('INSERT INTO audit VALUES($1,NULL,$2,$3,now())',[randomUUID(),'demo.points.seed',JSON.stringify({changes,scope:'unlinked-original-catalog-cards'})]);
    return changes;
  });
  console.log(JSON.stringify({applied:apply,count:result.length,changes:result}));
}finally{await db.close();}
