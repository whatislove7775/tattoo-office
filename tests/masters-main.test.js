import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { database } from "../server/db.js";
import { createApp } from "../server/index.js";
import { hashToken, hashPassword } from "../server/domain.js";

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

test("master status switch: regular, resident, archive; itemized points history", async () => {
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
    const owner = await account("owner", "admin"), shift = await account("shift", "admin", { staffLevel: "shift" }), guest = await account("guest", "guest");
    const call = (who, path, method, data) => fetch(origin + "/api" + path, { method, headers: { "Content-Type": "application/json", Cookie: who.cookie }, body: data ? JSON.stringify(data) : undefined });
    const directory = async () => (await (await fetch(origin + "/api/directory")).json()).masters;

    // Обычный → резидент: меняется роль аккаунта.
    assert.equal((await call(owner, `/admin/masters/${guest.id}/status`, "PATCH", { status: "resident" })).status, 200);
    assert.equal((await db.query("SELECT role FROM users WHERE id=$1", [guest.id])).rows[0].role, "resident");
    // Архив: мастер пропадает с сайта, но виден в админке с пометкой.
    assert.equal((await call(owner, `/admin/masters/${guest.id}/status`, "PATCH", { status: "archive" })).status, 200);
    assert.equal((await directory()).some((m) => m.id === guest.id), false);
    const admin = await (await call(owner, "/admin", "GET")).json();
    assert.equal(admin.masterPoints.find((m) => m.id === guest.id).archived, true);
    // В архиве: войти нельзя (понятное сообщение), на главную нельзя, в рейтинге его нет — а баллы сохраняются.
    await db.query("UPDATE users SET password=$1 WHERE id=$2", [hashPassword("Guest-password-2026"), guest.id]);
    const blocked = await fetch(origin + "/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: "guest@test.invalid", password: "Guest-password-2026", accountType: "master" }) });
    assert.equal(blocked.status, 403);
    assert.match((await blocked.json()).error, /профиль находится в архиве/);
    assert.equal((await call(owner, `/admin/masters/${guest.id}/main`, "PATCH", { onMain: true })).status, 409);
    const ranking = await (await fetch(origin + "/api/ranking?period=all")).json();
    assert.equal((ranking.masters || []).some((m) => m.id === guest.id), false);
    // Из архива обратно в обычный профиль.
    assert.equal((await call(owner, `/admin/masters/${guest.id}/status`, "PATCH", { status: "guest" })).status, 200);
    const back = (await directory()).find((m) => m.id === guest.id);
    assert.equal(back.resident, false);
    // Карточка из архива студии: можно сделать обычным профилем и убрать в архив.
    const card = (await directory()).find((m) => !m.registered && m.resident);
    assert.equal((await call(owner, `/admin/masters/${card.id}/status`, "PATCH", { status: "guest" })).status, 200);
    assert.equal((await directory()).find((m) => m.id === card.id).resident, false);
    assert.equal((await call(owner, `/admin/masters/${card.id}/status`, "PATCH", { status: "archive" })).status, 200);
    assert.equal((await directory()).some((m) => m.id === card.id), false);
    // Права: только владелец; неверный статус отклоняется.
    assert.equal((await call(shift, `/admin/masters/${guest.id}/status`, "PATCH", { status: "resident" })).status, 403);
    assert.equal((await call(owner, `/admin/masters/${guest.id}/status`, "PATCH", { status: "vip" })).status, 400);

    // История баллов: ручное изменение — с датой, причиной, способом и разницей.
    assert.equal((await call(owner, `/admin/masters/${guest.id}/points`, "PATCH", { score: 40 })).status, 200);
    const history = await (await call(shift, `/admin/masters/${guest.id}/points-history`, "GET")).json();
    const manual = history.history.find((h) => h.action === "Ручное изменение");
    assert.ok(manual.at && manual.method.startsWith("Вручную") && manual.points === 40 && /стало 40/.test(manual.reason));
    assert.equal(history.score, 40);
    // Удалить тату-мастера можно только из архива.
    assert.equal((await call(owner, `/admin/users/${guest.id}`, "DELETE")).status, 409);
    assert.equal((await call(owner, `/admin/masters/${guest.id}/status`, "PATCH", { status: "archive" })).status, 200);
    assert.equal((await call(owner, `/admin/users/${guest.id}`, "DELETE")).status, 200);
  } finally {
    server.close();
  }
});
