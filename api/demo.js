// Тестовый режим для превью Vercel: настоящий сервер студии с тестовой базой.
// Боевой сайт (production) этим путём не пользуется — его API по-прежнему на Beget.
// Если в проекте Vercel задана DATABASE_URL (например, бесплатная база Neon), все копии
// тестового сервера работают с одной общей базой; иначе у каждой копии своя база в памяти.
import { createHmac, timingSafeEqual } from "node:crypto";
process.env.DEMO_MODE = "1";
process.env.DATA_DIR ||= "memory://";

let ready = null, lastTick = 0;
export const demoReady = () => ready;
async function boot() {
  const [{ database }, { createApp }, { seedDemo, demoSession }, { workerTick }, { hashToken }] = await Promise.all([
    import("../server/db.js"), import("../server/index.js"), import("../server/demo-seed.js"), import("../server/worker.js"), import("../server/domain.js"),
  ]);
  const db = await database(), app = await createApp(db);
  await seedDemo(db);
  return { db, app, demoSession, workerTick, hashToken };
}

// Вход должен работать в любой копии сервера: вместе с сессией выдаём подписанную метку
// «кто вошёл», и копия, которая этой сессии не знает, восстанавливает её.
const SECRET = process.env.DEMO_SECRET || process.env.VERCEL_GIT_COMMIT_SHA || "tattoo-office-demo";
const sign = (uid, token) => createHmac("sha256", SECRET).update(uid + "." + token).digest("hex").slice(0, 32);
const cookies = (req) => Object.fromEntries(String(req.headers.cookie || "").split(";").map((x) => x.trim().split("=")).filter(([k, v]) => k && v).map(([k, v]) => [k, decodeURIComponent(v)]));
const whoCookie = (uid, token) => `demo_who=${uid}.${sign(uid, token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`;
async function restoreSession(db, hashToken, req) {
  const c = cookies(req), token = c.office_session, who = c.demo_who;
  if (!token || !who) return;
  const [uid, sig] = who.split(".");
  if (!uid || !sig || sig.length !== 32 || !timingSafeEqual(Buffer.from(sig), Buffer.from(sign(uid, token)))) return;
  if ((await db.query("SELECT 1 FROM sessions WHERE token=$1", [hashToken(token)])).rows.length) return;
  if (!(await db.query("SELECT 1 FROM users WHERE id=$1 AND active AND deleted_at IS NULL", [uid])).rows.length) return;
  await db.query("INSERT INTO sessions VALUES($1,$2,now()+interval '7 days') ON CONFLICT DO NOTHING", [hashToken(token), uid]);
}
// После обычного входа по паролю добавляем метку к ответу (в нём есть id пользователя).
// Express подменяет прототип ответа при обработке, поэтому вызываем его json в момент ответа.
function tagLogin(res) {
  res.json = function (body) {
    const set = [].concat(this.getHeader("Set-Cookie") || []), token = set.map((x) => /^office_session=([^;]+)/.exec(x)?.[1]).find(Boolean);
    if (token && body?.user?.id) this.setHeader("Set-Cookie", [...set, whoCookie(body.user.id, token)]);
    return Object.getPrototypeOf(this).json.call(this, body);
  };
}

export default async function handler(req, res) {
  if (process.env.VERCEL_ENV === "production") { res.statusCode = 404; return res.end('{"error":"Not found"}'); }
  ready ||= boot().catch((e) => { ready = null; throw e; });
  const { db, app, demoSession, workerTick, hashToken } = await ready;
  const url = new URL(req.url, "http://demo");
  const path = url.searchParams.get("__p") ?? url.pathname.replace(/^\/api\/demo\/?/, "");
  url.searchParams.delete("__p");
  req.url = "/api/" + path.replace(/^\/+/, "") + (url.searchParams.size ? "?" + url.searchParams : "");
  // Вход в тестовый аккаунт одной кнопкой.
  if (req.url.startsWith("/api/__demo/login")) {
    const session = await demoSession(db, new URL(req.url, "http://demo").searchParams.get("as"));
    res.setHeader("Content-Type", "application/json");
    if (!session) { res.statusCode = 404; return res.end('{"error":"Нет такого тестового аккаунта"}'); }
    res.setHeader("Set-Cookie", [`office_session=${session.token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`, whoCookie(session.userId, session.token)]);
    return res.end('{"ok":true}');
  }
  await restoreSession(db, hashToken, req);
  tagLogin(res);
  // Фоновые задачи (напоминания, лист ожидания, автосчёт) — не чаще раза в минуту.
  if (Date.now() - lastTick > 60000) { lastTick = Date.now(); workerTick(db).catch(() => {}); }
  return app(req, res);
}
