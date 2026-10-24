// Тестовый режим для превью Vercel: настоящий сервер студии с базой в памяти.
// Боевой сайт (production) этим путём не пользуется — его API по-прежнему на Beget.
process.env.DEMO_MODE = "1";
process.env.DATA_DIR = "memory://";

let ready = null, lastTick = 0;
async function boot() {
  const [{ database }, { createApp }, { seedDemo, demoSession }, { workerTick }] = await Promise.all([
    import("../server/db.js"), import("../server/index.js"), import("../server/demo-seed.js"), import("../server/worker.js"),
  ]);
  const db = await database(), app = await createApp(db);
  await seedDemo(db);
  return { db, app, demoSession, workerTick };
}

export default async function handler(req, res) {
  if (process.env.VERCEL_ENV === "production") { res.statusCode = 404; return res.end('{"error":"Not found"}'); }
  ready ||= boot().catch((e) => { ready = null; throw e; });
  const { db, app, demoSession, workerTick } = await ready;
  const url = new URL(req.url, "http://demo");
  const path = url.searchParams.get("__p") ?? url.pathname.replace(/^\/api\/demo\/?/, "");
  url.searchParams.delete("__p");
  req.url = "/api/" + path.replace(/^\/+/, "") + (url.searchParams.size ? "?" + url.searchParams : "");
  // Вход в тестовый аккаунт одной кнопкой.
  if (req.url.startsWith("/api/__demo/login")) {
    const token = await demoSession(db, new URL(req.url, "http://demo").searchParams.get("as"));
    res.setHeader("Content-Type", "application/json");
    if (!token) { res.statusCode = 404; return res.end('{"error":"Нет такого тестового аккаунта"}'); }
    res.setHeader("Set-Cookie", `office_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`);
    return res.end('{"ok":true}');
  }
  // Фоновые задачи (напоминания, лист ожидания, автосчёт) — не чаще раза в минуту.
  if (Date.now() - lastTick > 60000) { lastTick = Date.now(); workerTick(db).catch(() => {}); }
  return app(req, res);
}
