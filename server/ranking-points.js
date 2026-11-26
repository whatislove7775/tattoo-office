// Scores are derived from authoritative paid orders and the current profile.
// Re-reading a ranking, retrying a payment or re-saving a profile cannot mint points.
export const POINT_RULES = Object.freeze({bookingPoints:70,bookingRubles:3200,servicePoints:20,productPointsPer1000:5,profilePoints:5,workPoints:2,draftPoints:1,workLimit:100,draftLimit:20});
export function pointRules(settings={}) {
  return Object.fromEntries(Object.entries(POINT_RULES).map(([key,fallback])=>[key,Number.isInteger(settings.rankingRules?.[key])&&settings.rankingRules[key]>=0&&settings.rankingRules[key]<=100000&&(key!=='bookingRubles'||settings.rankingRules[key]>0)?settings.rankingRules[key]:fallback]));
}
// Сеанс приносит баллы, только если завершён и полностью оплачен (не тестовым платежом).
export const bookingEarns=b=>!(b.status!=='completed'||b.test_payment||Number(b.total)<=0||Number(b.paid)+Number(b.balance_used)<Number(b.total)||Number(b.unsettled)>0);
export function scoreMaster(master,facts,rules=POINT_RULES) {
  const breakdown={bookings:0,services:0,products:0,profile:0,works:0,drafts:0};
  const awardItems = (items) => {
    for (const item of items || []) {
      if (!(item.price > 0 && item.qty > 0)) continue;
      if (item.kind === 'service') breakdown.services += item.qty * rules.servicePoints;
      if (item.kind === 'product') breakdown.products += Math.round(item.price * item.qty * rules.productPointsPer1000 / 100000);
    }
  };
  for(const b of facts.bookings||[]) {
    if(!bookingEarns(b))continue;
    breakdown.bookings+=Math.round(Math.max(0,Number(b.rate))*rules.bookingPoints/(rules.bookingRubles*100));
    awardItems(b.extras);
  }
  for (const p of facts.expenses || []) awardItems(p.items);
  // Count unique image contents, not upload IDs. A draft reused as a finished
  // work earns only the higher work award; removing an image removes its points.
  const works=new Set((facts.media||[]).filter(m=>m.kind==='portfolio').map(m=>m.fingerprint));
  const drafts=new Set((facts.media||[]).filter(m=>m.kind==='drafts'&&!works.has(m.fingerprint)).map(m=>m.fingerprint));
  breakdown.works=Math.min(works.size,rules.workLimit)*rules.workPoints;
  breakdown.drafts=Math.min(drafts.size,rules.draftLimit)*rules.draftPoints;
  const fields={name:!!master.name?.trim(),avatar:!!master.avatar,city:!!master.city,bio:master.bio?.trim().length>=80,specialty:!!master.specialty?.trim(),experience:!!master.exp?.trim(),portfolio:facts.hasPortfolio ?? (works.size>0)};
  if(Object.values(fields).every(Boolean))breakdown.profile=rules.profilePoints;
  return {score:Object.values(breakdown).reduce((a,b)=>a+b,0),pointsBreakdown:breakdown,profileProgress:{filled:Object.values(fields).filter(Boolean).length,total:Object.keys(fields).length,missing:Object.keys(fields).filter(k=>!fields[k])}};
}
export function rankingYear(date=new Date()) {
  return Number(new Intl.DateTimeFormat('en',{timeZone:'Europe/Moscow',year:'numeric'}).format(date));
}
export function rankingRange(period,year=rankingYear(),now=new Date()) {
  if(period==='all')return [null,null];
  const month=period==='month'?Number(new Intl.DateTimeFormat('en',{timeZone:'Europe/Moscow',month:'numeric'}).format(now))-1:0;
  return [month,month+(period==='month'?1:12)].map(m=>new Date(Date.UTC(year,m,1,-3)));
}
export async function rankingFacts(db,{period="all",year}={}) {
  const range=rankingRange(period,year);
  const [settings,bookings,media,expenses]=await Promise.all([
    db.query('SELECT data FROM settings WHERE id=1'),
    db.query(`SELECT b.id,b.user_id,b.status,b.rate,b.total,b.balance_used,b.extras,b.starts_at,
      COALESCE(SUM(p.amount) FILTER(WHERE p.status='paid'),0)::bigint AS paid,
      COALESCE(BOOL_OR(COALESCE(p.is_test,p.provider_id NOT LIKE 'cash:%',true) OR ($3 AND p.provider_id LIKE 'cash:demo-%')) FILTER(WHERE p.status='paid'),false) AS test_payment,
      COUNT(p.id) FILTER(WHERE p.status='pending')::int AS unsettled
      FROM bookings b LEFT JOIN payments p ON p.booking_id=b.id AND p.kind<>'expense' WHERE b.status='completed'
      AND ($1::timestamptz IS NULL OR (b.starts_at >= $1 AND b.starts_at < $2))
      GROUP BY b.id`,[...range,period==='year']),
    db.query(`SELECT user_id,kind,md5(image) AS fingerprint,MIN(created_at) AS first_seen FROM master_media
      WHERE ($1::timestamptz IS NULL OR created_at < $1) GROUP BY user_id,kind,md5(image)`,[period==='year'?range[1]:null]),
    db.query(`SELECT b.user_id,p.items FROM payments p JOIN bookings b ON b.id=p.booking_id
      WHERE p.kind='expense' AND p.status='paid' AND NOT COALESCE(p.is_test,p.provider_id NOT LIKE 'cash:%',true)
      AND (NOT $3 OR COALESCE(p.provider_id,'') NOT LIKE 'cash:demo-%')
      AND ($1::timestamptz IS NULL OR (p.created_at >= $1 AND p.created_at < $2))`, [...range,period==='year'])
  ]);
  const byUser=new Map();
  for(const [kind,rows] of [['bookings',bookings.rows],['media',media.rows],['expenses',expenses.rows]]) for(const row of rows){if(!byUser.has(row.user_id))byUser.set(row.user_id,{bookings:[],media:[],expenses:[]});byUser.get(row.user_id)[kind].push(row);}
  if(period==='year') for(const facts of byUser.values()){
    facts.hasPortfolio=facts.media.some(m=>m.kind==='portfolio');
    const works=new Set(facts.media.filter(m=>m.kind==='portfolio').map(m=>m.fingerprint));
    facts.media=facts.media.filter(m=>new Date(m.first_seen)>=range[0] && (m.kind==='portfolio'||!works.has(m.fingerprint)));
  }
  return {rules:pointRules(settings.rows[0]?.data),byUser};
}

// An admin correction is an offset, so future activity still adds points.
export function applyPointsAdjustment(master, adjustment=0) {
  const amount=Number.isSafeInteger(adjustment)?adjustment:0;
  if(!amount)return master;
  return {...master,score:Math.max(0,master.score+amount),pointsBreakdown:{...master.pointsBreakdown,adjustment:amount}};
}
