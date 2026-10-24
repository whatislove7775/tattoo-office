import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";

test("preview test mode: seeded database, one-click login, admin overview through the Vercel function", async () => {
  delete process.env.VERCEL_ENV;
  const { default: handler } = await import("../api/demo.js");
  const server = http.createServer((req, res) => handler(req, res).catch((e) => { res.statusCode = 500; res.end(String(e)); }));
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const base = "http://127.0.0.1:" + server.address().port;
  try {
    const login = await fetch(base + "/api/demo/__demo/login?as=owner", { method: "POST" });
    assert.equal(login.status, 200);
    const cookie = login.headers.get("set-cookie").split(";")[0];
    const me = await (await fetch(base + "/api/demo/me", { headers: { Cookie: cookie } })).json();
    assert.equal(me.user.role, "admin");
    // Rewrite form used on Vercel: /api/demo?__p=admin/overview
    const ov = await (await fetch(base + "/api/demo?__p=admin/overview", { headers: { Cookie: cookie } })).json();
    assert.ok(ov.today.bookings.length >= 1);
    assert.ok(ov.attention.residentCandidates.length >= 1);
    assert.ok(ov.attention.risky.length >= 1);
    assert.ok(ov.attention.invoices.length >= 1);
    assert.ok(ov.stats.month.revenue > 0);
    assert.equal((await fetch(base + "/api/demo/__demo/login?as=nobody", { method: "POST" })).status, 404);
    const master = (await fetch(base + "/api/demo/__demo/login?as=master", { method: "POST" })).headers.get("set-cookie").split(";")[0];
    const bookings = await (await fetch(base + "/api/demo/bookings", { headers: { Cookie: master } })).json();
    assert.ok(bookings.bookings.length >= 5);
  } finally {
    await new Promise((r) => server.close(r));
  }
});
