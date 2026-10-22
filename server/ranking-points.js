// Scores are derived from authoritative paid orders and the current profile.
// Re-reading a ranking, retrying a payment or re-saving a profile cannot mint points.
export const POINT_RULES = Object.freeze({bookingPoints:70,bookingRubles:3200,servicePoints:20,productPointsPer1000:5,profilePoints:5,workPoints:2,draftPoints:1,workLimit:100,draftLimit:20});
export function pointRules(settings={}) {
  return Object.fromEntries(Object.entries(POINT_RULES).map(([key,fallback])=>[key,Number.isInteger(settings.rankingRules?.[key])&&settings.rankingRules[key]>=0&&settings.rankingRules[key]<=100000&&(key!=='bookingRubles'||settings.rankingRules[key]>0)?settings.rankingRules[key]:fallback]));
}
export function scoreMaster(master,facts,rules=POINT_RULES) {
  const breakdown={bookings:0,services:0,products:0,profile:0,works:0,drafts:0};
  for(const b of facts.bookings||[]) {
    if(b.status!=='completed'||b.test_payment||Number(b.total)<=0||Number(b.paid)+Number(b.balance_used)<Number(b.total)||Number(b.unsettled)>0)continue;
    breakdown.bookings+=Math.round(Math.max(0,Number(b.rate))*rules.bookingPoints/(rules.bookingRubles*100));
    for(const item of b.extras||[]) {
      if(!(item.price>0&&item.qty>0))continue;
      if(item.kind==='service')breakdown.services+=item.qty*rules.servicePoints;
      if(item.kind==='product')breakdown.products+=Math.round(item.price*item.qty*rules.productPointsPer1000/100000);
    }
  }
  // Count unique image contents, not upload IDs. A draft reused as a finished
  // work earns only the higher work award; removing an image removes its points.
  const works=new Set((facts.media||[]).filter(m=>m.kind==='portfolio').map(m=>m.fingerprint));
  const drafts=new Set((facts.media||[]).filter(m=>m.kind==='drafts'&&!works.has(m.fingerprint)).map(m=>m.fingerprint));
  breakdown.works=Math.min(works.size,rules.workLimit)*rules.workPoints;
  breakdown.drafts=Math.min(drafts.size,rules.draftLimit)*rules.draftPoints;
  const fields={name:!!master.name?.trim(),avatar:!!master.avatar,city:!!master.city,bio:master.bio?.trim().length>=80,specialty:!!master.specialty?.trim(),experience:!!master.exp?.trim(),portfolio:works.size>0};
  if(Object.values(fields).every(Boolean))breakdown.profile=rules.profilePoints;
  return {score:Object.values(breakdown).reduce((a,b)=>a+b,0),pointsBreakdown:breakdown,profileProgress:{filled:Object.values(fields).filter(Boolean).length,total:Object.keys(fields).length,missing:Object.keys(fields).filter(k=>!fields[k])}};
}
export async function rankingFacts(db,{period="all"}={}) {
  const [settings,bookings,media]=await Promise.all([
    db.query('SELECT data FROM settings WHERE id=1'),
    db.query(`SELECT b.id,b.user_id,b.status,b.rate,b.total,b.balance_used,b.extras,
      COALESCE(SUM(p.amount) FILTER(WHERE p.status='paid'),0)::bigint AS paid,
      COALESCE(BOOL_OR(COALESCE(p.is_test,p.provider_id NOT LIKE 'cash:%',true)) FILTER(WHERE p.status='paid'),false) AS test_payment,
      COUNT(p.id) FILTER(WHERE p.status='pending')::int AS unsettled
      FROM bookings b LEFT JOIN payments p ON p.booking_id=b.id WHERE b.status='completed' AND ($1='all' OR (b.starts_at >= (date_trunc('month',now() AT TIME ZONE 'Europe/Moscow') AT TIME ZONE 'Europe/Moscow') AND b.starts_at < ((date_trunc('month',now() AT TIME ZONE 'Europe/Moscow') + interval '1 month') AT TIME ZONE 'Europe/Moscow'))) GROUP BY b.id`,[period]),
    db.query("SELECT user_id,kind,md5(image) AS fingerprint FROM master_media")
  ]);
  const byUser=new Map();
  for(const [kind,rows] of [['bookings',bookings.rows],['media',media.rows]]) for(const row of rows){if(!byUser.has(row.user_id))byUser.set(row.user_id,{bookings:[],media:[]});byUser.get(row.user_id)[kind].push(row);}
  return {rules:pointRules(settings.rows[0]?.data),byUser};
}
