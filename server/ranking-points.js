export const POINT_RULES = Object.freeze({bookingPoints:70,bookingRubles:3200});
export function pointRules(settings={}) {
  return Object.fromEntries(Object.entries(POINT_RULES).map(([key,fallback])=>[key,Number.isInteger(settings.rankingRules?.[key])&&settings.rankingRules[key]>=0&&settings.rankingRules[key]<=100000&&(key!=='bookingRubles'||settings.rankingRules[key]>0)?settings.rankingRules[key]:fallback]));
}
// Сеанс приносит баллы, только если завершён и полностью оплачен (не тестовым платежом).
export function bookingEarns(booking) {
  return booking.status === 'completed' && !booking.test_payment && Number(booking.total) > 0
    && Number(booking.paid) + Number(booking.balance_used) >= Number(booking.total)
    && Number(booking.unsettled) === 0;
}
export function sessionPoints(booking,rules) {
  return Math.round(Math.max(0, Number(booking.rate)) * rules.bookingPoints / (rules.bookingRubles * 100));
}
export function scoreMaster(bookings = [], rules = POINT_RULES) {
  const score = bookings.reduce((sum, booking) => sum + (bookingEarns(booking) ? sessionPoints(booking,rules) : 0), 0);
  return {score, pointsBreakdown:{bookings:score}};
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
  const [settings,bookings]=await Promise.all([
    db.query('SELECT data FROM settings WHERE id=1'),
    db.query(`SELECT b.id,b.user_id,b.status,b.rate,b.total,b.balance_used,b.starts_at,
      COALESCE(SUM(p.amount) FILTER(WHERE p.status='paid'),0)::bigint AS paid,
      COALESCE(BOOL_OR(COALESCE(p.is_test,p.provider_id NOT LIKE 'cash:%',true) OR COALESCE(p.provider_id LIKE 'cash:demo-%',false)) FILTER(WHERE p.status='paid'),false) AS test_payment,
      COUNT(p.id) FILTER(WHERE p.status='pending')::int AS unsettled
      FROM bookings b LEFT JOIN payments p ON p.booking_id=b.id AND p.kind NOT IN ('expense','booking_fee','hold') WHERE b.status='completed'
      AND ($1::timestamptz IS NULL OR (b.starts_at >= $1 AND b.starts_at < $2))
      GROUP BY b.id`,range)
  ]);
  const byUser = new Map();
  for (const booking of bookings.rows) {
    if (!byUser.has(booking.user_id)) byUser.set(booking.user_id, []);
    byUser.get(booking.user_id).push(booking);
  }
  return {rules:pointRules(settings.rows[0]?.data),byUser};
}
