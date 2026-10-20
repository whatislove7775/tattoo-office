import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { database } from "../server/db.js";
import { createApp } from "../server/index.js";
import { hashToken } from "../server/domain.js";

test("workspaces: photo, city, upload and deletion that keeps booking history", async () => {
  process.env.DATA_DIR = "memory://";
  const db = await database(), app = await createApp(db), server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.on("listening", r));
  const origin = "http://127.0.0.1:" + server.address().port;
  try {
    const adminId = randomUUID(), token = "workspaces-admin-token";
    await db.query("INSERT INTO users(id,email,password,name,role,account_type) VALUES($1,'ws-admin@test.invalid','unused','Admin','admin','admin')", [adminId]);
    await db.query("INSERT INTO sessions VALUES($1,$2,now()+interval '1 day')", [hashToken(token), adminId]);
    const call = (path, method = "GET", data) => fetch(origin + "/api" + path, { method, headers: { Cookie: "office_session=" + token, ...(data ? { "Content-Type": "application/json" } : {}) }, body: data ? JSON.stringify(data) : undefined });
    const publicResources = async () => (await (await fetch(origin + "/api/public")).json()).resources;

    // Starter places come with photos.
    assert.ok((await publicResources()).every((r) => r.photo.startsWith("assets/interior/")));

    // Upload a photo and use it for a new Moscow place.
    const jpeg = "data:image/jpeg;base64," + Buffer.from([255, 216, 255, 217]).toString("base64");
    const upload = await call("/admin/media", "POST", { image: jpeg, thumbnail: jpeg });
    assert.equal(upload.status, 201);
    const { src } = await upload.json();
    assert.match(src, /^\/api\/site-media\/[0-9a-f-]{36}$/);
    const served = await fetch(origin + src + "?size=thumb");
    assert.equal(served.status, 200);
    assert.equal(served.headers.get("content-type"), "image/jpeg");
    assert.equal((await call("/admin/media", "POST", { image: "data:image/png;base64,AAAA", thumbnail: jpeg })).status, 400);

    const created = await call("/admin/resources", "POST", { name: "М1 — Патрики", city: "msk", photo: src, active: true });
    assert.equal(created.status, 200);
    const { id } = await created.json();
    const place = (await publicResources()).find((r) => r.id === id);
    assert.equal(place.city, "msk");
    assert.equal(place.photo, src);
    for (const photo of ["https://evil.example/a.jpg", "assets/../server/index.js", "javascript:alert(1)"])
      assert.equal((await call("/admin/resources", "POST", { id, name: "М1", city: "msk", photo })).status, 400, photo);

    // A place without history is removed completely.
    const removed = await call("/admin/resources/" + id, "DELETE");
    assert.equal(removed.status, 200);
    assert.equal((await removed.json()).archived, false);
    assert.equal((await db.query("SELECT id FROM resources WHERE id=$1", [id])).rows.length, 0);
    assert.equal((await call("/admin/resources/" + id, "DELETE")).status, 404);

    // A place with past bookings is hidden, its history stays.
    const used = (await publicResources())[0];
    const masterId = randomUUID();
    await db.query("INSERT INTO users(id,email,password,name,role) VALUES($1,'ws-master@test.invalid','unused','Master','guest')", [masterId]);
    await db.query("INSERT INTO bookings(id,user_id,resource_id,starts_at,ends_at,tariff,rate,total,status) VALUES($1,$2,$3,'2026-01-01T10:00Z','2026-01-01T13:00Z',3,100,100,'completed')", [randomUUID(), masterId, used.id]);
    const archived = await call("/admin/resources/" + used.id, "DELETE");
    assert.equal(archived.status, 200);
    assert.equal((await archived.json()).archived, true);
    assert.ok(!(await publicResources()).some((r) => r.id === used.id));
    assert.ok(!(await (await call("/admin")).json()).resources.some((r) => r.id === used.id));
    assert.equal((await db.query("SELECT count(*)::int AS n FROM bookings WHERE resource_id=$1", [used.id])).rows[0].n, 1);
    assert.equal((await call("/admin/resources", "POST", { id: used.id, name: "Back", city: "spb" })).status, 200);
    assert.equal((await db.query("SELECT deleted FROM resources WHERE id=$1", [used.id])).rows[0].deleted, true);

    // Upcoming bookings block deletion.
    const next = (await publicResources())[0];
    await db.query("INSERT INTO bookings(id,user_id,resource_id,starts_at,ends_at,tariff,rate,total,status) VALUES($1,$2,$3,now()+interval '2 days',now()+interval '2 days 3 hours',3,100,100,'confirmed')", [randomUUID(), masterId, next.id]);
    assert.equal((await call("/admin/resources/" + next.id, "DELETE")).status, 409);

    // Non-admins cannot manage places or upload.
    assert.equal((await fetch(origin + "/api/admin/resources/" + next.id, { method: "DELETE" })).status, 403);
    assert.equal((await fetch(origin + "/api/admin/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: jpeg, thumbnail: jpeg }) })).status, 403);
  } finally {
    await new Promise((r) => server.close(r));
    await db.close();
  }
});
