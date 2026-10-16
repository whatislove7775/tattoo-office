import {masterDirectory} from './master-directory.js';
export const RANKING_RULES=Object.freeze({bookingPoints:.25,completedPoints:1,residentBonus:.05});
export async function masterRanking(db,{period='all'}={}) {
  const masters=(await masterDirectory(db,{period})).filter(m=>m.rankingVisible && (m.registered||m.featured))
    .sort((a,b)=>b.score-a.score||b.completed-a.completed||a.name.localeCompare(b.name,'ru')||a.id.localeCompare(b.id));
  return {rules:RANKING_RULES,period,masters:masters.map(({rankingVisible,portfolio,drafts,bio,...m},i)=>({...m,rank:i+1}))};
}
export async function registeredMasterProfile(db,id) {
  if(!/^[\w-]{1,50}$/.test(id))return null;
  const masters=await masterDirectory(db);
  const direct=masters.find(m=>m.id===id);
  if(direct)return direct;
  if(!/^[0-9a-f-]{36}$/i.test(id))return null;
  const {rows}=await db.query('SELECT master_id FROM master_links WHERE user_id=$1',[id]);
  return masters.find(m=>m.id===rows[0]?.master_id)||null;
}
