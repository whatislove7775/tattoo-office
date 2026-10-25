import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";

// Тестовый режим: изменения из журнала браузера повторяются в новой копии сервера с теми же номерами.
test("preview test mode keeps changes: a fresh server copy replays the browser journal with the same ids", async () => {
  delete process.env.VERCEL_ENV;
  const serve = async (spec) => {
    const { default: handler } = await import(spec);
    const server = http.createServer((req, res) => handler(req, res).catch((e) => { res.statusCode = 500; res.end(String(e)); }));
    await new Promise((r) => server.listen(0, "127.0.0.1", r));
    return { server, base: "http://127.0.0.1:" + server.address().port };
  };
  const a = await serve("../api/demo.js"), b = await serve("../api/demo.js?fresh-copy");
  try {
    const cookie = (await fetch(a.base + "/api/demo/__demo/login?as=owner", { method: "POST" })).headers.getSetCookie().map((x) => x.split(";")[0]).join("; ");
    const places = (await (await fetch(a.base + "/api/demo/public")).json()).resources;
    const day = new Date(Date.now() + 9 * 86400000).toISOString().slice(0, 10);
    const body = { resourceId: places[0].id, startsAt: `${day}T10:00:00+03:00`, endsAt: `${day}T13:00:00+03:00`, reason: "Ремонт" };
    const created = await fetch(a.base + "/api/demo/admin/blocks", { method: "POST", headers: { Cookie: cookie, "Content-Type": "application/json", "X-Demo-Entry": "entry-block-0001" }, body: JSON.stringify(body) });
    assert.equal(created.status, 200);
    const { id } = await created.json(), actor = created.headers.get("x-demo-actor");
    assert.ok(id && actor);
    const journal = [{ id: "entry-block-0001", m: "POST", p: "/admin/blocks", b: body, a: actor }];
    const headers = { Cookie: cookie, "X-Demo-Count": "1", "X-Demo-Last": "entry-block-0001" };
    // Копия A это уже видела.
    assert.equal((await fetch(a.base + "/api/demo/admin", { headers })).status, 200);
    // Копия B — нет: просит журнал, повторяет его, и закрытое время появляется с тем же номером.
    assert.equal((await fetch(b.base + "/api/demo/admin", { headers })).status, 428);
    assert.equal((await fetch(b.base + "/api/demo/__demo/replay", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ journal }) })).status, 200);
    const admin = await (await fetch(b.base + "/api/demo/admin", { headers })).json();
    assert.ok(admin.blocks.some((k) => k.id === id && k.reason === "Ремонт"), "replayed block keeps its id");
  } finally {
    await new Promise((r) => a.server.close(r));
    await new Promise((r) => b.server.close(r));
  }
});
