import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { database } from "../server/db.js";
import { createApp } from "../server/index.js";
import { hashToken, hashPassword } from "../server/domain.js";

test("shift admin: password-only login, unique passwords set by the owner", async () => {
  process.env.DATA_DIR = "memory://";
  const db = await database(), app = await createApp(db), server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.on("listening", r));
  const origin = "http://127.0.0.1:" + server.address().port;
  const post = (path, data, cookie) => fetch(origin + "/api" + path, { method: "POST", headers: { "Content-Type": "application/json", ...(cookie ? { Cookie: cookie } : {}) }, body: JSON.stringify(data) });
  try {
    const addAdmin = async (name, level, password) => {
      const id = randomUUID();
      await db.query("INSERT INTO users(id,email,password,name,role,account_type,profile) VALUES($1,$2,$3,$4,'admin','admin',$5)", [id, `${name}@test.invalid`, hashPassword(password), name, JSON.stringify(level ? { staffLevel: level } : {})]);
      return id;
    };
    const ownerId = await addAdmin("owner", null, "Owner-password-2026");
    const annaId = await addAdmin("anna", "shift", "Anna-shift-pass-2026");
    const borisId = await addAdmin("boris", "shift", "Boris-shift-pass-2026");
    const ownerToken = "t-" + ownerId;
    await db.query("INSERT INTO sessions VALUES($1,$2,now()+interval '1 day')", [hashToken(ownerToken), ownerId]);
    const ownerCall = (path, data) => fetch(origin + "/api" + path, { method: "PATCH", headers: { "Content-Type": "application/json", Cookie: "office_session=" + ownerToken }, body: JSON.stringify(data) });

    // Вход только по паролю — попадает именно тот админ смены, чей пароль.
    const ok = await post("/auth/shift-login", { password: "Boris-shift-pass-2026" });
    assert.equal(ok.status, 200);
    assert.equal((await ok.json()).user.id, borisId);
    const cookie = ok.headers.getSetCookie().map((x) => x.split(";")[0]).join("; ");
    assert.equal((await (await fetch(origin + "/api/me", { headers: { Cookie: cookie } })).json()).user.staffLevel, "shift");

    // Неверный пароль и пароль владельца на этой странице не подходят.
    assert.equal((await post("/auth/shift-login", { password: "Wrong-password-2026" })).status, 401);
    assert.equal((await post("/auth/shift-login", { password: "Owner-password-2026" })).status, 401);
    assert.equal((await post("/auth/shift-login", { password: "short" })).status, 401);

    // Владелец не может выдать двум админам смены одинаковый пароль.
    assert.equal((await ownerCall("/admin/users/" + annaId + "/extra", { password: "Boris-shift-pass-2026" })).status, 409);
    assert.equal((await ownerCall("/admin/users/" + annaId + "/extra", { password: "Anna-new-pass-2026" })).status, 200);
    assert.equal((await post("/auth/shift-login", { password: "Anna-new-pass-2026" })).status, 200);

    // Если пароль всё же совпал у двоих (например, после перевода в смену), вход не угадывает, кто это.
    await db.query("UPDATE users SET password=$1 WHERE id=$2", [hashPassword("Boris-shift-pass-2026"), annaId]);
    assert.equal((await post("/auth/shift-login", { password: "Boris-shift-pass-2026" })).status, 409);

    // Сам админ смены пароль не меняет — его задаёт владелец.
    assert.equal((await post("/me/password", { current: "Boris-shift-pass-2026", password: "Boris-self-pass-2026" }, cookie)).status, 403);

    // Владелец создаёт админа смены только с именем и паролем — без почты.
    const created = await fetch(origin + "/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json", Cookie: "office_session=" + ownerToken }, body: JSON.stringify({ name: "Вера", role: "shift", password: "Vera-shift-pass-2026" }) });
    assert.equal(created.status, 201, await created.clone().text());
    const veraId = (await created.json()).id;
    const vera = (await db.query("SELECT role,profile FROM users WHERE id=$1", [veraId])).rows[0];
    assert.equal(vera.role, "admin");
    assert.equal(vera.profile.staffLevel, "shift");
    const veraLogin = await post("/auth/shift-login", { password: "Vera-shift-pass-2026" });
    assert.equal(veraLogin.status, 200);
    assert.equal((await veraLogin.json()).user.email, "", "служебный адрес не показывается");
    const list = await (await fetch(origin + "/api/admin", { headers: { Cookie: "office_session=" + ownerToken } })).json();
    assert.equal(list.users.find((u) => u.id === veraId).email, "");
    const dup = await fetch(origin + "/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json", Cookie: "office_session=" + ownerToken }, body: JSON.stringify({ name: "Дубль", role: "shift", password: "Vera-shift-pass-2026" }) });
    assert.equal(dup.status, 409);

    // Отключённый админ смены не входит.
    await db.query("UPDATE users SET password=$1 WHERE id=$2", [hashPassword("Anna-new-pass-2026"), annaId]);
    await db.query("UPDATE users SET active=false WHERE id=$1", [annaId]);
    assert.equal((await post("/auth/shift-login", { password: "Anna-new-pass-2026" })).status, 401);
  } finally {
    server.close();
  }
});
