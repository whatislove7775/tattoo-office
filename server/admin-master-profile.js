import { randomUUID } from 'node:crypto';
import { ageFromBirthDate } from './profile-age.js';
import { fail } from './domain.js';
import { jpegPayload, mediaView } from './master-media.js';
import { bookingContact } from './master-directory.js';

const uuidPattern = /^[0-9a-f-]{36}$/i;

export function adminMasterProfileRoutes(app, { db, one, ownerOnly, audit }) {
  const master = async (q, id, lock = false) => {
    if (!uuidPattern.test(id)) fail('Мастер не найден', 404);
    const user = await one(q, `SELECT id,name,profile FROM users WHERE id=$1 AND account_type='master' AND role IN ('guest','resident') AND deleted_at IS NULL ${lock ? 'FOR UPDATE' : ''}`, [id]);
    if (!user) fail('Мастер не найден', 404);
    return user;
  };
  const gallery = async (q, id) => (await q.query('SELECT id,kind,caption,position FROM master_media WHERE user_id=$1 ORDER BY position,created_at,id', [id])).rows.map(mediaView);

  app.get('/api/admin/users/:id/profile', ownerOnly, async (req, res) => {
    const u = await master(db, req.params.id);
    res.json({ name: u.name, profile: u.profile || {} });
  });
  app.patch('/api/admin/users/:id/profile', ownerOnly, async (req, res) => {
    const name = String(req.body.name || '').trim();
    const p = req.body.profile;
    if (!name || name.length > 100 || !p || typeof p !== 'object' || Array.isArray(p)) fail('Проверьте профиль');
    if (p.rankingVisible !== undefined && typeof p.rankingVisible !== 'boolean') fail('Проверьте настройку видимости в рейтинге');
    if (p.city !== undefined && !['Москва','СПБ'].includes(p.city)) fail('Выберите Москву или СПБ');
    if (p.avatar !== undefined && (typeof p.avatar !== 'string' || p.avatar.length > 90000 || (p.avatar && !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(p.avatar)))) fail('Проверьте фотографию профиля');
    if (p.birthDate !== undefined && p.birthDate !== '' && (ageFromBirthDate(p.birthDate) === null || ageFromBirthDate(p.birthDate) < 18 || ageFromBirthDate(p.birthDate) > 100)) fail('Укажите корректную дату рождения: возраст от 18 до 100 лет');
    if (p.bookingLink !== undefined && (typeof p.bookingLink !== 'string' || p.bookingLink.length > 2048 || (p.bookingLink && !bookingContact(p.bookingLink)))) fail('Укажите ссылку Telegram: https://t.me/имя');
    await db.transaction(async q => {
      const u = await master(q, req.params.id, true);
      const profile = {
        birthDate: p.birthDate ?? u.profile?.birthDate ?? '',
        experience: String(p.experience ?? u.profile?.experience ?? '').slice(0, 80),
        city: p.city ?? u.profile?.city ?? '',
        avatar: p.avatar ?? u.profile?.avatar ?? '',
        rankingVisible: p.rankingVisible ?? (u.profile?.rankingVisible !== false),
        bio: String(p.bio ?? u.profile?.bio ?? '').slice(0, 1000),
        specialty: String(p.specialty ?? u.profile?.specialty ?? '').slice(0, 100),
        status: String(p.status ?? u.profile?.status ?? '').slice(0, 100),
        ...(p.bookingLink !== undefined ? { adminBookingLink: bookingContact(p.bookingLink) || '' } : {}),
      };
      await q.query('UPDATE users SET name=$1,profile=profile||$2::jsonb WHERE id=$3', [name, JSON.stringify(profile), u.id]);
      await audit(q, req.user.id, 'master.profile.update', { id: u.id, fields: ['name', ...Object.keys(p)] });
    });
    res.json({ ok: true });
  });
  app.get('/api/admin/users/:id/gallery', ownerOnly, async (req, res) => {
    await master(db, req.params.id);
    res.json({ items: await gallery(db, req.params.id) });
  });
  app.post('/api/admin/users/:id/gallery', ownerOnly, async (req, res) => {
    const { kind, caption, thumbnail, image } = req.body;
    if (!['portfolio','drafts'].includes(kind)) fail('Выберите работы или эскизы');
    jpegPayload(thumbnail, 50000); jpegPayload(image, 300000);
    const id = randomUUID();
    await db.transaction(async q => {
      const u = await master(q, req.params.id, true);
      const count = await one(q, 'SELECT count(*)::int AS n FROM master_media WHERE user_id=$1', [u.id]);
      if (count.n >= 24) fail('Можно загрузить до 24 фотографий');
      await q.query('INSERT INTO master_media(id,user_id,kind,caption,position,thumbnail,image) VALUES($1,$2,$3,$4,$5,$6,$7)', [id,u.id,kind,String(caption||'').slice(0,150),count.n,thumbnail,image]);
      await q.query("UPDATE users SET profile=jsonb_set(profile,'{galleryManaged}','true') WHERE id=$1", [u.id]);
      await audit(q, req.user.id, 'master.gallery.add', { userId: u.id, mediaId: id, kind });
    });
    res.status(201).json({ id });
  });
  app.patch('/api/admin/users/:id/gallery', ownerOnly, async (req, res) => {
    const items = req.body.items;
    if (!Array.isArray(items) || items.length > 24 || items.some(i => !i || typeof i.id !== 'string' || !uuidPattern.test(i.id) || !['portfolio','drafts'].includes(i.kind)) || new Set(items.map(i => i.id)).size !== items.length) fail('Проверьте порядок фотографий');
    await db.transaction(async q => {
      const u = await master(q, req.params.id, true);
      const rows = (await q.query('SELECT id FROM master_media WHERE user_id=$1', [u.id])).rows;
      if (rows.length !== items.length || items.some(i => !rows.some(r => r.id === i.id))) fail('Список фотографий изменился. Обновите страницу', 409);
      for (const [position,item] of items.entries()) await q.query('UPDATE master_media SET kind=$1,caption=$2,position=$3 WHERE id=$4 AND user_id=$5', [item.kind,String(item.caption||'').slice(0,150),position,item.id,u.id]);
      await audit(q, req.user.id, 'master.gallery.update', { userId: u.id, count: items.length });
    });
    res.json({ ok: true });
  });
  app.delete('/api/admin/users/:id/gallery/:mediaId', ownerOnly, async (req, res) => {
    await db.transaction(async q => {
      const u = await master(q, req.params.id, true);
      const deleted = await one(q, 'DELETE FROM master_media WHERE id=$1 AND user_id=$2 RETURNING id', [req.params.mediaId,u.id]);
      if (!deleted) fail('Фотография не найдена', 404);
      await audit(q, req.user.id, 'master.gallery.delete', { userId: u.id, mediaId: deleted.id });
    });
    res.json({ ok: true });
  });
}
