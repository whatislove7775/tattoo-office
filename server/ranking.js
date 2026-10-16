// Confirmed rentals count once; completed work adds the main contribution.
export const RANKING_RULES = Object.freeze({ bookingPoints: 0.25, completedPoints: 1, residentBonus: 0.05 });

export async function masterRanking(db) {
  const { rows } = await db.query(`
    SELECT u.id,u.name,u.role,u.profile->>'city' AS city,u.profile->>'avatar' AS avatar,
      COUNT(b.id) FILTER (WHERE b.status IN ('confirmed','invoiced','completed'))::int AS bookings,
      COUNT(b.id) FILTER (WHERE b.status='completed')::int AS completed
    FROM users u LEFT JOIN bookings b ON b.user_id=u.id
    WHERE u.active=true AND u.account_type='master' AND u.role IN ('guest','resident')
      AND COALESCE(u.profile->>'rankingVisible','true') != 'false'
    GROUP BY u.id,u.name,u.role,u.profile
  `);
  const masters = rows.map(row => {
    const resident = row.role === 'resident';
    const score = Math.round((row.bookings * 0.25 + row.completed) * (resident ? 1.05 : 1) * 100) / 100;
    return { id: row.id, name: row.name, resident, city: ["Москва","СПБ"].includes(row.city) ? row.city : "", avatar: row.avatar && row.avatar.length <= 90000 && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(row.avatar) ? row.avatar : "", bookings: row.bookings, completed: row.completed, score };
  }).sort((a,b) => b.score-a.score || b.completed-a.completed || a.name.localeCompare(b.name,'ru') || a.id.localeCompare(b.id));
  return { rules: RANKING_RULES, masters: masters.map((master,index) => ({ ...master, rank: index+1 })) };
}
