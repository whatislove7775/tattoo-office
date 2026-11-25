import { randomUUID } from "node:crypto";
import { fail } from "./domain.js";
import { jpegPayload } from "./master-media.js";
import { catalogContentId } from "./master-directory.js";

const uuid = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
const imageCounts = { text: 0, photo: 1, split: 1, gallery: 4, link: 0 };
const rows = async (q, sql, args) => (await q.query(sql, args)).rows;
const first = async (q, sql, args) => (await rows(q, sql, args))[0];

function text(value, limit, label) {
  if (typeof value !== "string" || value.length > limit)
    fail(`Проверьте поле «${label}»`);
  return value.trim();
}

function href(value) {
  const raw = text(value, 2048, "Ссылка");
  let url;
  try {
    url = new URL(raw);
  } catch {
    fail("Укажите ссылку с https://");
  }
  if (url.protocol !== "https:" || url.username || url.password)
    fail("Укажите ссылку с https://");
  return url.href;
}

function normalize(body) {
  const { blocks, revision } = body || {};
  if (
    !Number.isSafeInteger(revision) ||
    revision < 0 ||
    !Array.isArray(blocks) ||
    blocks.length > 12
  )
    fail("Можно сохранить до 12 блоков");
  const uploads = new Map(),
    ids = [];
  const result = blocks.map((block) => {
    if (
      !block ||
      !Object.hasOwn(imageCounts, block.type) ||
      !Array.isArray(block.photos) ||
      block.photos.length > imageCounts[block.type] ||
      (imageCounts[block.type] > 0 && !block.photos.length)
    )
      fail("Проверьте тип блока и добавьте фотографии");
    const title = text(block.title, 100, "Заголовок");
    const content = text(block.text, 3000, "Текст");
    const tone = block.tone || "plain";
    if (!["plain", "soft", "dark"].includes(tone))
      fail("Проверьте оформление блока");
    if (block.type === "text" && !title && !content)
      fail("Добавьте заголовок или текст");
    const photos = block.photos.map((photo) => {
      if (!photo || typeof photo !== "object") fail("Проверьте фотографию");
      let { id } = photo;
      if (photo.image !== undefined) {
        jpegPayload(photo.image, 125000);
        jpegPayload(photo.thumbnail, 20000);
        id = randomUUID();
        uploads.set(id, { image: photo.image, thumbnail: photo.thumbnail });
      } else if (typeof id !== "string" || !uuid.test(id)) {
        fail("Проверьте фотографию");
      }
      ids.push(id);
      return {
        id,
        caption: text(photo.caption, 160, "Подпись"),
        alt: text(photo.alt, 150, "Описание фото"),
      };
    });
    const common = { type: block.type, title, text: content, tone, photos };
    if (block.type === "link") {
      const label = text(block.label, 80, "Текст кнопки");
      if (!label) fail("Добавьте текст кнопки");
      return { ...common, label, href: href(block.href) };
    }
    if (block.type === "split")
      return { ...common, side: block.side === "right" ? "right" : "left" };
    return common;
  });
  if (ids.length > 12 || new Set(ids).size !== ids.length)
    fail("Можно сохранить до 12 фотографий");
  return { blocks: result, revision, ids, uploads };
}

async function readAbout(q, id) {
  return (
    (await first(
      q,
      "SELECT revision,blocks FROM master_about WHERE user_id=$1",
      [id],
    )) ?? { revision: 0, blocks: [] }
  );
}

export function masterAboutRoutes(
  app,
  { db, auth, ownerOnly, findMaster, audit },
) {
  const edit = async (q, id, lock = false) => {
    if (!uuid.test(id)) fail("Мастер не найден", 404);
    const user = await first(
      q,
      `SELECT id FROM users WHERE id=$1 AND deleted_at IS NULL
      AND account_type='master' AND role IN ('resident','guest') ${lock ? "FOR UPDATE" : ""}`,
      [id],
    );
    if (!user) fail("Мастер не найден", 404);
    return user.id;
  };
  const save = async (id, req, res) => {
    const next = normalize(req.body);
    const result = await db.transaction(async (q) => {
      const owner = await edit(q, id, true);
      const current = await readAbout(q, owner);
      if (current.revision !== next.revision)
        fail("Раздел изменён в другой вкладке. Откройте его заново", 409);
      const existing = new Set(
        (
          await rows(q, "SELECT id FROM master_about_photos WHERE user_id=$1", [
            owner,
          ])
        ).map((row) => row.id),
      );
      if (next.ids.some((img) => !existing.has(img) && !next.uploads.has(img)))
        fail("Фотография недоступна", 409);
      for (const [img, photo] of next.uploads)
        await q.query(
          "INSERT INTO master_about_photos(id,user_id,image,thumbnail) VALUES($1,$2,$3,$4)",
          [img, owner, photo.image, photo.thumbnail],
        );
      await q.query(
        "DELETE FROM master_about_photos WHERE user_id=$1 AND NOT(id=ANY($2::uuid[]))",
        [owner, next.ids],
      );
      const revision = current.revision + 1;
      await q.query(
        `INSERT INTO master_about(user_id,revision,blocks) VALUES($1,$2,$3)
        ON CONFLICT(user_id) DO UPDATE SET revision=excluded.revision,blocks=excluded.blocks`,
        [owner, revision, JSON.stringify(next.blocks)],
      );
      if (req.user.id !== owner)
        await audit(q, req.user.id, "master.about.update", {
          userId: owner,
          revision,
        });
      return { revision, blocks: next.blocks };
    });
    res.json(result);
  };
  app.get("/api/me/about", auth, async (req, res) =>
    res.json(await readAbout(db, await edit(db, req.user.id))),
  );
  app.put("/api/me/about", auth, (req, res) => save(req.user.id, req, res));
  app.get("/api/admin/users/:id/about", ownerOnly, async (req, res) =>
    res.json(await readAbout(db, await edit(db, req.params.id))),
  );
  app.put("/api/admin/users/:id/about", ownerOnly, (req, res) =>
    save(req.params.id, req, res),
  );

  app.get("/api/masters/:id/about", async (req, res) => {
    res.set("Cache-Control", "no-store");
    const master = await findMaster(db, req.params.id);
    if (!master) fail("Мастер не найден", 404);
    if (!master.registered) return res.json({ blocks: [] });
    const u = uuid.test(master.id)
      ? { user_id: master.id }
      : await first(db, "SELECT user_id FROM master_links WHERE master_id=$1", [
          master.id,
        ]);
    const data = u ? await readAbout(db, u.user_id) : { blocks: [] };
    res.json({ blocks: data.blocks });
  });
  const sendPhoto = (res, photo, cache) =>
    res
      .set("Cache-Control", cache)
      .type("image/jpeg")
      .send(Buffer.from(photo.value.split(",")[1], "base64"));
  const column = (req) =>
    req.query.size === "thumb" ? "p.thumbnail" : "p.image";
  const editablePhoto = async (owner, req, res) => {
    if (!uuid.test(req.params.photoId)) fail("Фотография не найдена", 404);
    const photo = await first(
      db,
      `SELECT ${column(req)} AS value FROM master_about_photos p WHERE id=$1 AND user_id=$2`,
      [req.params.photoId, owner],
    );
    if (!photo) fail("Фотография не найдена", 404);
    sendPhoto(res, photo, "private, max-age=60");
  };
  app.get("/api/me/about/photos/:photoId", auth, async (req, res) =>
    editablePhoto(await edit(db, req.user.id), req, res),
  );
  app.get(
    "/api/admin/users/:id/about/photos/:photoId",
    ownerOnly,
    async (req, res) => editablePhoto(await edit(db, req.params.id), req, res),
  );
  app.get("/api/about-photo/:id", async (req, res) => {
    if (!uuid.test(req.params.id)) fail("Фотография не найдена", 404);
    const photo = await first(
      db,
      `SELECT ${column(req)} AS value, l.master_id
      FROM master_about_photos p JOIN users u ON u.id=p.user_id
      LEFT JOIN master_links l ON l.user_id=u.id
      WHERE p.id=$1 AND u.active AND u.deleted_at IS NULL AND u.account_type='master'
      AND u.role IN ('guest','resident') AND u.profile->'archived' IS DISTINCT FROM 'true'::jsonb`,
      [req.params.id],
    );
    if (
      !photo ||
      (photo.master_id &&
        (
          await first(
            db,
            "SELECT data->'archived' AS archived FROM content WHERE id=$1",
            [catalogContentId(photo.master_id)],
          )
        )?.archived === true)
    )
      fail("Фотография не найдена", 404);
    sendPhoto(res, photo, "public, max-age=60");
  });
}
