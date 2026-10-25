// Тестовый режим для превью Vercel: настоящий сервер студии с тестовой базой.
// Боевой сайт (production) этим путём не пользуется — его API по-прежнему на Beget.
// Если в проекте Vercel задана DATABASE_URL (например, бесплатная база Neon), все копии
// тестового сервера работают с одной общей базой; иначе у каждой копии своя база в памяти.
import crypto, { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import { syncBuiltinESMExports } from "node:module";
import http from "node:http";
process.env.DEMO_MODE = "1";
process.env.DATA_DIR ||= "memory://";

// Тестовые изменения не теряются: браузер хранит журнал своих действий (добавил запись,
// закрыл время, перенёс…), а копия сервера, которая их не видела (новая или перезапущенная),
// повторяет журнал по порядку. Чтобы при повторе получились те же номера записей,
// номера (uuid) внутри действия из журнала вычисляются из номера этого действия.
const als = new AsyncLocalStorage();
const realUUID = crypto.randomUUID.bind(crypto);
crypto.randomUUID = (...args) => {
  const seed = als.getStore();
  if (!seed) return realUUID(...args);
  const h = createHash("sha256").update(seed.id + ":" + seed.n++).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-${(8 + (parseInt(h[16], 16) & 3)).toString(16)}${h.slice(17, 20)}-${h.slice(20, 32)}`;
};
syncBuiltinESMExports();
const applied = new Set();
const ENTRY = /^[a-z0-9-]{8,64}$/;
const withEntry = (id, fn) => (id && ENTRY.test(id) ? als.run({ id, n: 0 }, fn) : fn());

let ready = null, lastTick = 0;
export const demoReady = () => ready;
async function boot() {
  const [{ database }, { createApp }, { seedDemo, demoSession }, { workerTick }, { hashToken }] = await Promise.all([
    import("../server/db.js"), import("../server/index.js"), import("../server/demo-seed.js"), import("../server/worker.js"), import("../server/domain.js"),
  ]);
  const db = await database(), app = await createApp(db);
  await seedDemo(db);
  // Внутренний адрес для повтора журнала через тот же сервер.
  const local = http.createServer((req, res) => withEntry(req.headers["x-demo-entry"], () => app(req, res)));
  await new Promise((ok) => local.listen(0, "127.0.0.1", ok));
  local.unref();
  return { db, app, demoSession, workerTick, hashToken, port: local.address().port };
}

// Вход должен работать в любой копии сервера: вместе с сессией выдаём подписанную метку
// «кто вошёл», и копия, которая этой сессии не знает, восстанавливает её.
const SECRET = process.env.DEMO_SECRET || process.env.VERCEL_GIT_COMMIT_SHA || "tattoo-office-demo";
const sign = (uid, token) => createHmac("sha256", SECRET).update(uid + "." + token).digest("hex").slice(0, 32);
const cookies = (req) => Object.fromEntries(String(req.headers.cookie || "").split(";").map((x) => x.trim().split("=")).filter(([k, v]) => k && v).map(([k, v]) => [k, decodeURIComponent(v)]));
const whoCookie = (uid, token) => `demo_who=${uid}.${sign(uid, token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`;
async function restoreSession(db, hashToken, req, res) {
  const c = cookies(req), token = c.office_session, who = c.demo_who;
  if (!token) return;
  if (!who) {
    // Старый вход без метки: выдаём метку, если эта копия знает сессию.
    const known = (await db.query("SELECT user_id FROM sessions WHERE token=$1 AND expires_at>now()", [hashToken(token)])).rows[0];
    if (known) res.setHeader("Set-Cookie", whoCookie(known.user_id, token));
    return known?.user_id;
  }
  const [uid, sig] = who.split(".");
  if (!uid || !sig || sig.length !== 32 || !timingSafeEqual(Buffer.from(sig), Buffer.from(sign(uid, token)))) return;
  if ((await db.query("SELECT 1 FROM sessions WHERE token=$1", [hashToken(token)])).rows.length) return uid;
  if (!(await db.query("SELECT 1 FROM users WHERE id=$1 AND active AND deleted_at IS NULL", [uid])).rows.length) return;
  await db.query("INSERT INTO sessions VALUES($1,$2,now()+interval '7 days') ON CONFLICT DO NOTHING", [hashToken(token), uid]);
  return uid;
}
const actorOk = (actor) => { const [uid, sig] = String(actor || "").split("."); return uid && sig && sig.length === 32 && timingSafeEqual(Buffer.from(sig), Buffer.from(sign(uid, "actor"))) ? uid : null; };
const readBody = (req) => new Promise((ok, bad) => { let d = ""; req.on("data", (c) => { d += c; if (d.length > 5e6) req.destroy(); }); req.on("end", () => ok(d)); req.on("error", bad); });
let replayChain = Promise.resolve();
async function replay(ctx, journal) {
  const { db, hashToken, port } = ctx;
  for (const e of journal.slice(-300)) {
    if (!e || !ENTRY.test(e.id) || applied.has(e.id)) continue;
    applied.add(e.id);
    const uid = actorOk(e.a);
    if (!uid || !/^[A-Z]+$/.test(e.m) || typeof e.p !== "string" || !e.p.startsWith("/")) continue;
    const token = randomBytes(32).toString("hex");
    await db.query("INSERT INTO sessions VALUES($1,$2,now()+interval '1 hour')", [hashToken(token), uid]).catch(() => {});
    await fetch(`http://127.0.0.1:${port}/api${e.p}`, { method: e.m, headers: { cookie: `office_session=${token}`, "x-demo-entry": e.id, ...(e.b === undefined ? {} : { "content-type": "application/json" }) }, body: e.b === undefined ? undefined : JSON.stringify(e.b) }).catch(() => {});
    await db.query("DELETE FROM sessions WHERE token=$1", [hashToken(token)]).catch(() => {});
  }
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
  // Повтор журнала тестовых действий браузера.
  if (req.url.startsWith("/api/__demo/replay")) {
    const ctx = await ready;
    let journal = [];
    try { journal = JSON.parse((await readBody(req)) || "{}").journal || []; } catch {}
    replayChain = replayChain.then(() => replay(ctx, Array.isArray(journal) ? journal : [])).catch(() => {});
    await replayChain;
    res.setHeader("Content-Type", "application/json");
    return res.end('{"ok":true}');
  }
  const uid = await restoreSession(db, hashToken, req, res);
  tagLogin(res);
  // Эта копия ещё не видела последних действий браузера — просим прислать журнал.
  const count = Number(req.headers["x-demo-count"] || 0), last = String(req.headers["x-demo-last"] || "");
  if (count > 0 && ENTRY.test(last) && !applied.has(last)) {
    await replayChain;
    if (!applied.has(last)) { res.statusCode = 428; res.setHeader("Content-Type", "application/json"); return res.end('{"needJournal":true}'); }
  }
  const entry = String(req.headers["x-demo-entry"] || "");
  if (uid) res.setHeader("X-Demo-Actor", `${uid}.${sign(uid, "actor")}`);
  if (ENTRY.test(entry)) {
    res.on("finish", () => { if (res.statusCode < 400) applied.add(entry); });
    if (Date.now() - lastTick > 60000) { lastTick = Date.now(); workerTick(db).catch(() => {}); }
    return withEntry(entry, () => app(req, res));
  }
  // Фоновые задачи (напоминания, лист ожидания, автосчёт) — не чаще раза в минуту.
  if (Date.now() - lastTick > 60000) { lastTick = Date.now(); workerTick(db).catch(() => {}); }
  return app(req, res);
}
