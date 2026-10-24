import { randomUUID as uuid, randomBytes } from "node:crypto";
import { hashPassword, hashToken } from "./domain.js";

// Тестовый режим на превью Vercel: своя база в памяти с примерами данных,
// чтобы все функции админки и кабинета можно было проверить без боевого сервера.
// Пароли — только для тестовой базы превью, к боевому сайту отношения не имеют.
export const DEMO_ACCOUNTS = {
  owner: { password: "Test-owner-2026", name: "Владелец (тест)", email: "owner@demo.tattoo-office", role: "admin", account_type: "admin", profile: {} },
  shift: { password: "Test-shift-2026", name: "Админ смены (тест)", email: "shift@demo.tattoo-office", role: "admin", account_type: "admin", profile: { staffLevel: "shift" } },
  master: { password: "Test-master-2026", name: "Катя Иванова", email: "katya@demo.tattoo-office", role: "guest", account_type: "master", profile: { city: "СПБ", bio: "Тонкие линии, графика и ботаника. Работаю в студии с весны.", experience: "4 года" } },
  resident: { password: "Test-resident-2026", name: "Артур Резидент", email: "artur@demo.tattoo-office", role: "resident", account_type: "master", profile: { city: "СПБ", bio: "Резидент Private Club. Крупные проекты, чёрно-серый реализм.", experience: "9 лет" } },
  risky: { password: "Test-misha-2026", name: "Миша Пропускайкин", email: "misha@demo.tattoo-office", role: "guest", account_type: "master", profile: {} },
  newbie: { password: "Test-new-2026", name: "Новый Мастер", email: "new@demo.tattoo-office", role: "guest", account_type: "master", profile: {} },
  customer: { password: "Test-client-2026", name: "Клиент Анна", email: "anna@demo.tattoo-office", role: "guest", account_type: "customer", profile: {} },
};

const MSK = (days, hour) => {
  const d = new Date(Date.now() + days * 86400000);
  const day = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Moscow" }).format(d);
  return new Date(`${day}T${String(hour).padStart(2, "0")}:00:00+03:00`);
};

// Одинаковые id во всех копиях тестового сервера: Vercel может запустить несколько копий,
// и бронь, место или пользователь должны находиться в любой из них.
let counter = 0;
const did = (group) => `00000000-0000-4000-${group}-${String(++counter).padStart(12, "0")}`;
export async function seedDemo(db) {
  if ((await db.query("SELECT 1 FROM users WHERE email=$1", [DEMO_ACCOUNTS.owner.email])).rows.length) return;
  counter = 0;
  for (const [table, group] of [["resources", "8001"], ["catalog", "8002"]]) {
    const rows = (await db.query(`SELECT id FROM ${table} ORDER BY name`)).rows;
    for (const [i, r] of rows.entries()) await db.query(`UPDATE ${table} SET id=$1 WHERE id=$2`, [`00000000-0000-4000-${group}-${String(i + 1).padStart(12, "0")}`, r.id]);
  }
  const ids = {};
  for (const [key, u] of Object.entries(DEMO_ACCOUNTS)) {
    ids[key] = did("8003");
    const created = key === "newbie" ? "now()-interval '3 days'" : "now()-interval '200 days'";
    await db.query(`INSERT INTO users(id,email,password,name,role,account_type,profile,balance,created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,${created})`, [ids[key], u.email, hashPassword(u.password), u.name, u.role, u.account_type, JSON.stringify(u.profile), key === "master" ? 50000 : 0]);
  }
  await db.query("UPDATE settings SET data=data||$1::jsonb WHERE id=1", [JSON.stringify({ mode: "test", priceRules: { nightPercent: 20, nightFrom: 22, nightTo: 8, weekendPercent: 10 }, autoInvoice: false })]);
  const places = (await db.query("SELECT id FROM resources WHERE NOT deleted ORDER BY name")).rows.map((r) => r.id);
  const booking = async (user, place, start, hours, status, extra = {}) => {
    const id = did("8004"), total = extra.total ?? 320000, deposit = extra.deposit ?? 50000;
    await db.query("INSERT INTO bookings(id,user_id,resource_id,starts_at,ends_at,tariff,rate,total,status,deposit,policy,created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$7,$8,$9,$10,$11)", [id, ids[user], places[place % places.length], start, new Date(+start + hours * 3600000), hours, total, status, deposit, JSON.stringify(extra.policy || {}), new Date(+start - 5 * 86400000)]);
    if (["confirmed", "invoiced", "completed", "no_show", "cancel_requested"].includes(status) && deposit)
      await db.query("INSERT INTO payments(id,booking_id,kind,amount,status,provider_id,created_at,is_test) VALUES($1,$2,'deposit',$3,'paid',$4,$5,true)", [did("8005"), id, deposit, "demo-" + id + "-d", new Date(+start - 4 * 86400000)]);
    if (status === "completed" && total > deposit)
      await db.query("INSERT INTO payments(id,booking_id,kind,amount,status,provider_id,created_at,is_test) VALUES($1,$2,'final',$3,'paid',$4,$5,true)", [did("8005"), id, total - deposit, "demo-" + id + "-f", new Date(+start + hours * 3600000)]);
    if (status === "invoiced")
      await db.query("INSERT INTO payments(id,booking_id,kind,amount,status,created_at) VALUES($1,$2,'final',$3,'pending',$4)", [did("8005"), id, total - deposit, new Date(+start + hours * 3600000)]);
    return id;
  };
  // Катя — 9 завершённых сеансов за 2 месяца: кандидат в резиденты.
  for (let i = 0; i < 9; i++) await booking("master", i, MSK(-3 - i * 6, 12), 3, "completed");
  // Сегодня и ближайшие дни.
  await booking("master", 0, MSK(0, 14), 3, "confirmed");
  await booking("resident", 1, MSK(0, 11), 6, "confirmed", { total: 450000, deposit: 0, policy: { paymentMethod: "cash" } });
  await booking("resident", 2, MSK(2, 12), 6, "confirmed", { total: 450000 });
  await booking("master", 3, MSK(3, 18), 3, "pending");
  await booking("master", 1, MSK(5, 12), 3, "cancel_requested");
  // Вчерашний сеанс без счёта (можно выставить счёт или отметить неявку) и неоплаченный счёт.
  await booking("resident", 0, MSK(-1, 12), 3, "confirmed");
  await booking("resident", 3, MSK(-2, 15), 6, "invoiced", { total: 450000 });
  // Миша — две неявки.
  await booking("risky", 2, MSK(-10, 12), 3, "no_show");
  await booking("risky", 1, MSK(-20, 12), 3, "no_show");
  // Прошлый месяц для сравнения.
  for (let i = 0; i < 6; i++) await booking("resident", i, MSK(-33 - i * 4, 12), 6, "completed", { total: 450000 });
  await db.query("UPDATE catalog SET stock=2 WHERE id=(SELECT id FROM catalog WHERE kind='product' ORDER BY name LIMIT 1)");
  await db.query("INSERT INTO feedback(id,message,status,contact,created_at) VALUES($1,'Было бы здорово поставить ещё одну лампу у второго места.','new','guest@example.com',now()-interval '1 day'),($2,'Спасибо за кофе и музыку!','done','',now()-interval '8 days')", [did("8006"), did("8006")]);
  await db.query("INSERT INTO promo_codes(code,kind,value,max_uses,note) VALUES('OFFICE10','percent',10,100,'Пример промокода')");
  const day = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Moscow" }).format(new Date(Date.now() + 2 * 86400000));
  await db.query("INSERT INTO waitlist(id,user_id,city,date,hour,duration) VALUES($1,$2,'spb',$3,12,3)", [did("8007"), ids.master, day]);
}

// Вход в тестовый аккаунт одной кнопкой (только в тестовом режиме).
export async function demoSession(db, key) {
  const account = DEMO_ACCOUNTS[key];
  if (!account) return null;
  const u = (await db.query("SELECT id FROM users WHERE email=$1 AND deleted_at IS NULL", [account.email])).rows[0];
  if (!u) return null;
  const token = randomBytes(32).toString("hex");
  await db.query("INSERT INTO sessions VALUES($1,$2,now()+interval '7 days')", [hashToken(token), u.id]);
  return { token, userId: u.id };
}
