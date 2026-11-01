import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { database } from "../server/db.js";
import { createApp } from "../server/index.js";
import { hashToken } from "../server/domain.js";

test("owner chooses which master profiles are cards on the main page", async () => {
  process.env.DATA_DIR = "memory://";
  const db = await database(), app = await createApp(db), server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.on("listening", r));
  const origin = "http://127.0.0.1:" + server.address().port;
  try {
    const account = async (name, role, profile = {}) => {
      const id = randomUUID(), token = "t-" + id;
      await db.query("INSERT INTO users(id,email,password,name,role,account_type,profile) VALUES($1,$2,'unused',$3,$4,$5,$6)", [id, `${name}@test.invalid`, name, role, role === "admin" ? "admin" : "master", JSON.stringify(profile)]);
      await db.query("INSERT INTO sessions VALUES($1,$2,now()+interval '1 day')", [hashToken(token), id]);
      return { id, cookie: "office_session=" + token };
    };
    const owner = await account("owner", "admin"), shift = await account("shift", "admin", { staffLevel: "shift" });
    const guest = await account("guest", "guest"), resident = await account("resident", "resident");
    const directory = async () => (await (await fetch(origin + "/api/directory")).json()).masters;
    const toggle = (who, id, onMain) => fetch(origin + "/api/admin/masters/" + id + "/main", { method: "PATCH", headers: { "Content-Type": "application/json", Cookie: who.cookie }, body: JSON.stringify({ onMain }) });

    // По умолчанию — как раньше: резиденты на главной, обычные профили нет.
    let list = await directory();
    assert.equal(list.find((m) => m.id === resident.id).onMain, true);
    assert.equal(list.find((m) => m.id === guest.id).onMain, false);
    const archive = list.find((m) => !m.registered && m.resident);
    assert.equal(archive.onMain, true);

    // Владелец добавляет обычный профиль и убирает резидента и карточку из архива.
    assert.equal((await toggle(owner, guest.id, true)).status, 200);
    assert.equal((await toggle(owner, resident.id, false)).status, 200);
    assert.equal((await toggle(owner, archive.id, false)).status, 200);
    list = await directory();
    assert.equal(list.find((m) => m.id === guest.id).onMain, true);
    assert.equal(list.find((m) => m.id === resident.id).onMain, false);
    assert.equal(list.find((m) => m.id === archive.id).onMain, false);
    // Карточка из архива не пропадает из рейтинга и с личной страницы — меняется только главная.
    assert.equal(list.find((m) => m.id === archive.id).featured, true);

    // Выбор сохраняется после сохранения «Личного дела» карточки.
    const contentId = (await db.query("SELECT id FROM content WHERE data ? 'mainCard' LIMIT 1")).rows[0].id;
    await fetch(origin + "/api/admin/content/" + contentId, { method: "PUT", headers: { "Content-Type": "application/json", Cookie: owner.cookie }, body: JSON.stringify({ title: "Имя", published: true }) });
    assert.equal((await directory()).find((m) => m.id === archive.id).onMain, false);

    // Список в админке показывает выбор; админ смены менять его не может.
    const admin = await (await fetch(origin + "/api/admin", { headers: { Cookie: owner.cookie } })).json();
    assert.equal(admin.masterPoints.find((m) => m.id === guest.id).onMain, true);
    assert.equal(admin.masterPoints.find((m) => m.id === archive.id).archive, true);
    assert.equal((await toggle(shift, guest.id, false)).status, 403);
    assert.equal((await toggle(owner, "nobody-here", true)).status, 404);
    assert.equal((await fetch(origin + "/api/admin/masters/" + guest.id + "/main", { method: "PATCH", headers: { "Content-Type": "application/json", Cookie: owner.cookie }, body: JSON.stringify({ onMain: "yes" }) })).status, 400);
  } finally {
    server.close();
  }
});
