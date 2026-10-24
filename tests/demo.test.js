import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";

test("preview test mode: seeded database, one-click login, admin overview through the Vercel function", async () => {
  delete process.env.VERCEL_ENV;
  const { default: handler, demoReady } = await import("../api/demo.js");
  const server = http.createServer((req, res) => handler(req, res).catch((e) => { res.statusCode = 500; res.end(String(e)); }));
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const base = "http://127.0.0.1:" + server.address().port;
  try {
    const login = await fetch(base + "/api/demo/__demo/login?as=owner", { method: "POST" });
    assert.equal(login.status, 200);
    const cookie = login.headers.getSetCookie().map((x) => x.split(";")[0]).join("; ");
    const me = await (await fetch(base + "/api/demo/me", { headers: { Cookie: cookie } })).json();
    assert.equal(me.user.role, "admin");
    // Другая копия сервера не знает сессию — она восстанавливается по подписанной метке.
    const { db } = await demoReady();
    await db.query("DELETE FROM sessions");
    const forged = cookie.replace(/demo_who=([^.;]+)\.[^;]+/, "demo_who=$1.0000000000000000000000000000beef");
    assert.equal((await (await fetch(base + "/api/demo/me", { headers: { Cookie: forged } })).json()).user, null);
    assert.equal((await (await fetch(base + "/api/demo/me", { headers: { Cookie: cookie } })).json()).user.role, "admin");
    // Rewrite form used on Vercel: /api/demo?__p=admin/overview
    const ov = await (await fetch(base + "/api/demo?__p=admin/overview", { headers: { Cookie: cookie } })).json();
    assert.ok(ov.today.bookings.length >= 1);
    assert.ok(ov.attention.residentCandidates.length >= 1);
    assert.ok(ov.attention.risky.length >= 1);
    assert.ok(ov.attention.invoices.length >= 1);
    assert.ok(ov.stats.month.revenue > 0);
    const byPassword = await fetch(base + "/api/demo/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: "owner@demo.tattoo-office", password: "Test-owner-2026", accountType: "admin" }) });
    assert.equal(byPassword.status, 200);
    assert.equal((await byPassword.json()).user.role, "admin");
    assert.ok(byPassword.headers.getSetCookie().some((x) => x.startsWith("demo_who=")));
    const masterLogin = await fetch(base + "/api/demo/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: "katya@demo.tattoo-office", password: "Test-master-2026", accountType: "master" }) });
    assert.equal(masterLogin.status, 200);
    assert.equal((await fetch(base + "/api/demo/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: "katya@demo.tattoo-office", password: "wrong-password-123", accountType: "master" }) })).status, 401);
    assert.equal((await fetch(base + "/api/demo/__demo/login?as=nobody", { method: "POST" })).status, 404);
    const master = (await fetch(base + "/api/demo/__demo/login?as=master", { method: "POST" })).headers.getSetCookie().map((x) => x.split(";")[0]).join("; ");
    const bookings = await (await fetch(base + "/api/demo/bookings", { headers: { Cookie: master } })).json();
    assert.ok(bookings.bookings.length >= 5);
  } finally {
    await new Promise((r) => server.close(r));
  }
});
