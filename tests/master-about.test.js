import assert from "node:assert/strict";
import { randomUUID as uuid } from "node:crypto";
import { test } from "node:test";
import { database } from "../server/db.js";
import { hashToken } from "../server/domain.js";
import { createApp } from "../server/index.js";

test("About blocks publish atomically, only owners edit, and removed photos disappear", async () => {
  process.env.DATA_DIR = "memory://";
  const db = await database();
  const app = await createApp(db);
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = "http://127.0.0.1:" + server.address().port + "/api";
  const users = Object.fromEntries(
    ["master", "other", "admin"].map((role) => [
      role,
      { id: uuid(), token: uuid() },
    ]),
  );
  const request = (path, user, body) =>
    fetch(base + path, {
      method: body ? "PUT" : "GET",
      headers: {
        "Content-Type": "application/json",
        ...(user ? { Cookie: "office_session=" + users[user].token } : {}),
      },
      body: body && JSON.stringify(body),
    });
  try {
    for (const [name, user] of Object.entries(users)) {
      await db.query(
        "INSERT INTO users(id,name,email,password,role,username) VALUES($1,$2,$3,'unused',$4,$5)",
        [
          user.id,
          name,
          name + "@test.invalid",
          name === "admin" ? "admin" : "guest",
          "test_" + name,
        ],
      );
      await db.query(
        "INSERT INTO sessions VALUES($1,$2,now()+interval '1 day')",
        [hashToken(user.token), user.id],
      );
    }
    assert.deepEqual(
      await (await request("/masters/test_master/about")).json(),
      { blocks: [] },
    );
    assert.equal((await request("/me/about")).status, 401);
    const image = "data:image/jpeg;base64,/9j/2Q==";
    const body = {
      revision: 0,
      blocks: [
        {
          type: "photo",
          tone: "soft",
          title: "Студия",
          text: "",
          photos: [
            {
              image,
              thumbnail: image,
              caption: "Рабочее место",
              alt: "Фото студии",
            },
          ],
        },
      ],
    };
    const response = await request("/me/about", "master", body);
    assert.equal(response.status, 200);
    const published = await response.json();
    assert.equal(published.revision, 1);
    const photoId = published.blocks[0].photos[0].id;
    assert.deepEqual(
      await (await request("/masters/test_master/about")).json(),
      { blocks: published.blocks },
    );
    assert.equal(
      (await request("/about-photo/" + photoId)).headers.get("content-type"),
      "image/jpeg",
    );
    const adminPath = "/admin/users/" + users.master.id + "/about";
    assert.equal((await request(adminPath, "other")).status, 403);
    assert.equal(
      (await request("/me/about/photos/" + photoId, "other")).status,
      404,
    );
    assert.equal(
      (
        await request("/me/about", "other", {
          revision: 0,
          blocks: published.blocks,
        })
      ).status,
      409,
    );
    assert.equal((await request("/me/about", "master", body)).status, 409);
    const unsafe = {
      type: "link",
      tone: "plain",
      title: "Сайт",
      text: "",
      photos: [],
      label: "Открыть",
      href: "javascript:alert(1)",
    };
    assert.equal(
      (await request("/me/about", "master", { revision: 1, blocks: [unsafe] }))
        .status,
      400,
    );
    await db.query("UPDATE users SET active=false WHERE id=$1", [
      users.master.id,
    ]);
    assert.equal((await request("/about-photo/" + photoId)).status, 404);
    assert.equal(
      (await request(adminPath + "/photos/" + photoId, "admin")).status,
      200,
    );
    assert.equal(
      (await request(adminPath, "admin", { revision: 1, blocks: [] })).status,
      200,
    );
    assert.equal(
      (await request(adminPath + "/photos/" + photoId, "admin")).status,
      404,
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await db.close();
  }
});
