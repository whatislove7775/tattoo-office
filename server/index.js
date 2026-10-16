import {studioRules,studioRulesVersion} from "./studio-rules.js";
import {updateOperatorDetails} from "./operator-details.js";
import {ageFromBirthDate} from "./profile-age.js";
import {masterDirectory,catalogIds,bookingContact} from "./master-directory.js";
import {jpegPayload,mediaView} from "./master-media.js";
import { masterRanking, registeredMasterProfile } from "./ranking.js";
import { emailConfigured } from "./integrations.js";
import { refreshCalendarBusy } from "./calendar-sync.js";
import { yookassaEnabled, yookassaTest, yookassaRequest, verifyYookassaPayment } from "./yookassa.js";
import express from "express";
import { expireReservations } from "./reservations.js";
import { startWorker } from "./worker.js";
import { telegramRoutes } from "./telegram.js";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { randomUUID as uuid, randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { database } from "./db.js";
import {
  defaults,
  hashPassword,
  verifyPassword,
  hashToken,
  fail,
  integer,
  validEmail,
  validPassword,
  slot,
  verifyHmac,
  validCity,
  withCities,
  cityRates,
  cityOpen,
} from "./domain.js";
const root = fileURLToPath(new URL("../", import.meta.url));
export async function createApp(db) {
  for (const statement of (
    await readFile(new URL("./schema.sql", import.meta.url), "utf8")
  )
    .split(";")
    .filter((s) => s.trim()))
    await db.query(statement);
  await db.query(
    "INSERT INTO settings(id,data) VALUES(1,$1) ON CONFLICT DO NOTHING",
    [JSON.stringify(defaults)],
  );
  await db.transaction(async q => {
    const row = (await q.query("SELECT data FROM settings WHERE id=1 FOR UPDATE")).rows[0];
    let updated = updateOperatorDetails(row.data);
    if (!updated.website) updated = {...updated,website:"https://tattoo-office.com"};
    if (updated.rulesContentVersion !== studioRulesVersion) updated = {...updated, rules:studioRules, rulesVersion:studioRulesVersion, rulesContentVersion:studioRulesVersion};
    if (updated !== row.data) await q.query("UPDATE settings SET data=$1 WHERE id=1", [JSON.stringify(updated)]);
  });
  const one = async (q, s, p = []) => (await q.query(s, p)).rows[0];
  const settings = async (q = db) =>
    withCities((await one(q, "SELECT data FROM settings WHERE id=1")).data);
  const audit = (q, actor, action, details = {}) =>
    q.query("INSERT INTO audit VALUES($1,$2,$3,$4,now())", [
      uuid(),
      actor,
      action,
      JSON.stringify(details),
    ]);
  const enqueue = (q, kind, payload) =>
    q.query("INSERT INTO outbox(id,kind,payload) VALUES($1,$2,$3)", [
      uuid(),
      kind,
      JSON.stringify(payload),
    ]);
  const ledger = async (q, user, booking, amount, description) => {
    await q.query("UPDATE users SET balance=balance+$1 WHERE id=$2", [
      amount,
      user,
    ]);
    await q.query("INSERT INTO ledger VALUES($1,$2,$3,$4,$5,now())", [
      uuid(),
      user,
      booking,
      amount,
      description,
    ]);
  };
  if (!(await one(db, "SELECT id FROM resources LIMIT 1")))
    for (const name of [
      "01 — у окна",
      "02 — большой зал",
      "03 — тихая комната",
      "04 — у стены",
    ])
      await db.query("INSERT INTO resources(id,name) VALUES($1,$2)", [
        uuid(),
        name,
      ]);
  if (!(await one(db, "SELECT id FROM catalog LIMIT 1")))
    for (const [name, kind, price, stock] of [
      ["Сборка места", "service", 30000, 0],
      ["Разборка места", "service", 30000, 0],
      ["Защитная плёнка", "product", 15000, 30],
      ["Набор расходников", "product", 45000, 20],
    ])
      await db.query(
        "INSERT INTO catalog(id,name,kind,price,stock) VALUES($1,$2,$3,$4,$5)",
        [uuid(), name, kind, price, stock],
      );
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const email = validEmail(process.env.ADMIN_EMAIL);
    if (!(await one(db, "SELECT id FROM users WHERE email=$1 AND role='admin'", [email])))
      await db.query(
        "INSERT INTO users(id,email,password,name,role,account_type) VALUES($1,$2,$3,$4,$5,CASE WHEN $5='admin' THEN 'admin' ELSE 'master' END)",
        [
          uuid(),
          email,
          hashPassword(validPassword(process.env.ADMIN_PASSWORD)),
          "Администратор",
          "admin",
        ],
      );
  }
  const app = express();
  app.disable("x-powered-by");
  app.use((req,res,next)=>{
    req.requestId=uuid();res.set('X-Request-ID',req.requestId);
    const started=Date.now();res.on('finish',()=>{if(res.statusCode>=500)console.error(JSON.stringify({event:'request.failed',requestId:req.requestId,method:req.method,path:req.route?.path||'unmatched',status:res.statusCode,durationMs:Date.now()-started}));});next();
  });
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "script-src": ["'self'", "https://widget.cloudpayments.ru"],
          "frame-src": [
            "https://widget.cloudpayments.ru",
            "https://checkout.cloudpayments.ru",
          ],
          "connect-src": ["'self'", "https://*.cloudpayments.ru"],
          "img-src": ["'self'", "data:"],
          "style-src": ["'self'", "'unsafe-inline'"],
          "upgrade-insecure-requests":
            process.env.NODE_ENV === "production" ? [] : null,
        },
      },
    }),
  );
  app.use("/api/me/gallery",express.json({limit:"400kb"}));
  app.use(
    express.json({
      limit: "100kb",
      verify: (req, res, b) => (req.rawBody = b),
    }),
  );
  app.use(
    express.urlencoded({
      extended: false,
      limit: "100kb",
      verify: (req, res, b) => (req.rawBody = b),
    }),
  );
  app.use(
    "/api",
    rateLimit({
      windowMs: 60000,
      limit: 240,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    }),
  );
  app.use("/api", async (req, res, next) => {
    res.set("Cache-Control", "no-store");
    const token = req.headers.cookie
      ?.split("; ")
      .find((x) => x.startsWith("office_session="))
      ?.slice(15);
    if (token)
      req.user = await one(
        db,
        "SELECT u.* FROM users u JOIN sessions s ON u.id=s.user_id WHERE s.token=$1 AND s.expires_at>now() AND u.active=true",
        [hashToken(token)],
      );
    if (
      !["GET", "HEAD"].includes(req.method) &&
      !req.path.startsWith("/webhooks/")
    ) {
      const origin = req.get("origin");
      if (
        origin &&
        origin !== (process.env.APP_ORIGIN || `http://${req.get("host")}`)
      )
        return res
          .status(403)
          .json({ error: "Запрос с другого сайта отклонён" });
    }
    next();
  });
  const auth = (req, res, next) =>
    req.user ? next() : res.status(401).json({ error: "Войдите в аккаунт" });
  const roles =
    (...r) =>
    (req, res, next) =>
      req.user && r.includes(req.user.role)
        ? next()
        : res.status(403).json({ error: "Недостаточно прав" });
  const staff = roles("admin");
  const safe = (u) =>
    u
      ? {
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          accountType: u.role === "admin" ? "admin" : u.account_type,
          balance: u.balance,
          depositWaived: u.role === "resident" && u.deposit_waived,
          sequence: u.sequence,
          profile: u.profile,
          telegramLinked: !!u.telegram_id,
        }
      : null;
  const session = async (res, u) => {
    const token = randomBytes(32).toString("hex");
    await db.query(
      "INSERT INTO sessions VALUES($1,$2,now()+interval '7 days')",
      [hashToken(token), u.id],
    );
    res.cookie("office_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 604800000,
      path: "/",
    });
  };
  const lock = async (q) => {
    await q.query("SELECT id FROM settings WHERE id=1 FOR UPDATE");
  };
  const release = async (q, b, status) => {
    if (b.balance_used)
      await ledger(
        q,
        b.user_id,
        b.id,
        b.balance_used,
        "Возврат резерва баланса",
      );
    for (const x of b.extras)
      if (x.kind === "product")
        await q.query("UPDATE catalog SET stock=stock+$1 WHERE id=$2", [
          x.qty,
          x.id,
        ]);
    await q.query("UPDATE bookings SET status=$1,balance_used=0 WHERE id=$2", [
      status,
      b.id,
    ]);
    await q.query(
      "UPDATE payments SET status='expired' WHERE booking_id=$1 AND status='pending'",
      [b.id],
    );
  };
  const expire = expireReservations;
  const loyalty = async (q, userId) => {
    const row = await one(q, "SELECT count(*) FILTER (WHERE status='completed')::int AS completed, count(*) FILTER (WHERE status IN ('pending','confirmed','invoiced','cancel_requested') AND policy->>'loyaltyFree'='true')::int AS reserved FROM bookings WHERE user_id=$1", [userId]);
    return {completed:row.completed, progress:row.completed % 20, cycle:Math.floor(row.completed / 20)+1, freeNext:row.completed % 20 === 19 && row.reserved === 0, reserved:row.reserved > 0};
  };
  const confirmed = async (q, b) => {
    const u = await one(
      q,
      "UPDATE users SET sequence=sequence+1 WHERE id=$1 RETURNING sequence",
      [b.user_id],
    );
    await q.query(
      "UPDATE bookings SET status='confirmed',deposit=$1,session_no=$2,expires_at=NULL WHERE id=$3",
      [b.deposit, ((u.sequence - 1) % 20) + 1, b.id],
    );
    await enqueue(q, "booking.confirmed", { bookingId: b.id });
    await enqueue(q, "calendar.upsert", { bookingId: b.id });
  };
  const available = async (q, resource, start, end, except = null) => {
    if (
      await one(
        q,
        "SELECT id FROM bookings WHERE resource_id=$1 AND id IS DISTINCT FROM $4::uuid AND status IN ('pending','confirmed','invoiced','completed','cancel_requested') AND starts_at<$3 AND ends_at>$2 LIMIT 1",
        [resource, start, end, except],
      )
    )
      return false;
    if (await one(q,"SELECT id FROM calendar_busy WHERE resource_id=$1 AND starts_at<$3 AND ends_at>$2 LIMIT 1",[resource,start,end])) return false;
    return !(await one(
      q,
      "SELECT id FROM blocks WHERE (resource_id=$1 OR resource_id IS NULL) AND starts_at<$3 AND ends_at>$2 LIMIT 1",
      [resource, start, end],
    ));
  };
  telegramRoutes(app, { db, session, auth });
  app.get("/api/health", async (req, res) => {
    await db.query("SELECT 1");
    res.json({ ok: true });
  });
  app.get("/api/public", async (req, res) => {
    const s = await settings();
    res.json({
      settings: s,
      resources: (
        await db.query("SELECT id,name,active,city FROM resources ORDER BY name")
      ).rows,
      catalog: (
        await db.query(
          "SELECT * FROM catalog WHERE active=true ORDER BY kind,name",
        )
      ).rows,
      content: (
        await db.query("SELECT * FROM content WHERE data->>'published'='true'")
      ).rows,
      telegramEnabled:
        !!process.env.TELEGRAM_CLIENT_ID &&
        !!process.env.TELEGRAM_CLIENT_SECRET,
      paymentEnabled: yookassaEnabled(),
    });
  });
  app.get("/api/directory",async(req,res)=>res.json({masters:(await masterDirectory(db)).map(({rankingVisible,score,bookings,...m})=>m)}));
  app.get("/api/masters/:id", async (req,res) => {
    const master=await registeredMasterProfile(db,req.params.id);
    if(!master)fail("Мастер не найден",404);
    res.set("Cache-Control","no-store").json({master});
  });
  app.get("/api/ranking", async (req,res) => {
    res.set("Cache-Control", "no-store");
    if(req.query.period && !["all","month"].includes(req.query.period))fail("Выберите период рейтинга");
    res.json(await masterRanking(db,{period:req.query.period||"all"}));
  });
  app.get("/api/me", async (req, res) => res.json({ user: safe(req.user) }));
  const loginLimit = rateLimit({ windowMs: 900000, limit: 25 });
  app.post("/api/auth/register", loginLimit, async (req, res) => {
    const { name, password, rules, consent } = req.body,
      email = validEmail(req.body.email);
    validPassword(password);
    if (!name?.trim() || name.length > 100) fail("Укажите имя");
    if (rules !== true || consent !== true)
      fail("Нужно принять правила и дать отдельное согласие");
    const accountType = req.body.accountType === "customer" ? "customer" : "master";
    if (req.body.accountType === "admin") fail("Администратора добавляет команда студии",403);
    const existing = (await db.query("SELECT * FROM users WHERE email=$1", [email])).rows;
    if (existing.some(u => u.account_type === accountType)) fail("Этот профиль уже существует. Войдите или восстановите пароль",409);
    if (existing.length && req.user?.email !== email && !existing.some(u => verifyPassword(password,u.password))) fail("Для добавления профиля войдите в существующий аккаунт на эту почту",409);
    const s = await settings();
    const u = await db.transaction(async (q) => {
      const id = uuid();
      await q.query(
        "INSERT INTO users(id,email,password,name,role,account_type) VALUES($1,$2,$3,$4,'guest',$5)",
        [id, email, hashPassword(password), name.trim(), accountType],
      );
      for (const kind of ["rules", "personal_data"])
        await q.query(
          "INSERT INTO consents(id,user_id,kind,version) VALUES($1,$2,$3,$4)",
          [uuid(), id, kind, s.rulesVersion],
        );
      const ticket = req.headers.cookie
        ?.split("; ")
        .find((x) => x.startsWith("office_telegram="))
        ?.slice(16);
      if (ticket) {
        const t = await one(
          q,
          "DELETE FROM telegram_tickets WHERE token=$1 AND expires_at>now() RETURNING *",
          [hashToken(ticket)],
        );
        if (!t) fail("Вход Telegram истёк. Повторите авторизацию.");
        await q.query(
          "UPDATE users SET telegram_id=$1,telegram_chat_id=$2 WHERE id=$3",
          [t.telegram_id, t.chat_id, id],
        );
      }
      return one(q, "SELECT * FROM users WHERE id=$1", [id]);
    });
    await session(res, u);
    res.status(201).json({ user: safe(u) });
  });
  app.post("/api/auth/login", loginLimit, async (req, res) => {
    const type = req.body.accountType;
    if (type && !["customer","master","admin"].includes(type)) fail("Проверьте тип профиля");
    const u = await one(db, "SELECT * FROM users WHERE email=$1 AND ($2::text IS NULL OR account_type=$2 OR ($2='admin' AND role='admin')) ORDER BY created_at LIMIT 1", [validEmail(req.body.email), type || null]);
    if (
      typeof req.body.password !== "string" ||
      req.body.password.length > 128 ||
      !u ||
      !u.active ||
      !verifyPassword(req.body.password, u.password)
    )
      fail("Email или пароль не совпадают", 401);
    await session(res, u);
    res.json({ user: safe(u) });
  });
  app.post("/api/auth/forgot-password", loginLimit, async (req,res) => {
    const email=validEmail(req.body.email), type=req.body.accountType || "master";
    if (!["customer","master","admin"].includes(type)) fail("Проверьте тип профиля");
    if (!emailConfigured()) fail("Отправка писем ещё не подключена. Обратитесь к администратору",503);
    const user=await one(db,"SELECT * FROM users WHERE email=$1 AND account_type=$2 AND active=true",[email,type]);
    if (user) {
      const token=randomBytes(32).toString("hex"), digest=hashToken(token);
      await db.transaction(async q=>{
        await q.query("DELETE FROM password_resets WHERE user_id=$1 OR expires_at<now()",[user.id]);
        await q.query("INSERT INTO password_resets VALUES($1,$2,now()+interval '30 minutes')",[digest,user.id]);
      });
      const origin=process.env.APP_ORIGIN;
      if (!origin) fail("Адрес сайта для восстановления не настроен",503);
      await enqueue(db,"email.auth",{to:email,subject:"Восстановление пароля Tattoo Office",text:`Для смены пароля откройте ссылку: ${origin}/#/reset/${type}?token=${token}\nСсылка действует 30 минут. Если вы не запрашивали смену пароля, проигнорируйте письмо.`});
    }
    res.json({ok:true});
  });
  app.post("/api/auth/reset-password", loginLimit, async (req,res) => {
    const password=validPassword(req.body.password), token=String(req.body.token || "");
    if (!/^[a-f0-9]{64}$/.test(token)) fail("Ссылка недействительна или истекла",400);
    await db.transaction(async q=>{
      const reset=await one(q,"DELETE FROM password_resets WHERE token=$1 AND expires_at>now() RETURNING user_id",[hashToken(token)]);
      if (!reset) fail("Ссылка недействительна или истекла",400);
      await q.query("UPDATE users SET password=$1 WHERE id=$2",[hashPassword(password),reset.user_id]);
      await q.query("DELETE FROM sessions WHERE user_id=$1",[reset.user_id]);
      await q.query("DELETE FROM password_resets WHERE user_id=$1",[reset.user_id]);
    });
    res.json({ok:true});
  });
  app.post("/api/auth/logout", async (req, res) => {
    const token = req.headers.cookie
      ?.split("; ")
      .find((x) => x.startsWith("office_session="))
      ?.slice(15);
    if (token)
      await db.query("DELETE FROM sessions WHERE token=$1", [hashToken(token)]);
    res.clearCookie("office_session", { path: "/" });
    res.json({ ok: true });
  });
  app.patch("/api/me", auth, async (req, res) => {
    const name = String(req.body.name || "").trim(),
      p = req.body.profile || {};
    if (!name || name.length > 100) fail("Проверьте имя");
    if (p.rankingVisible !== undefined && typeof p.rankingVisible !== "boolean")
      fail("Проверьте настройку видимости в рейтинге");
    if (p.city !== undefined && !["Москва","СПБ"].includes(p.city)) fail("Выберите Москву или СПБ");
    if (p.avatar !== undefined && (typeof p.avatar !== "string" || p.avatar.length > 90000 || (p.avatar && !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(p.avatar)))) fail("Проверьте фотографию профиля");
    if(p.birthDate!==undefined && p.birthDate!=="" && (ageFromBirthDate(p.birthDate)===null || ageFromBirthDate(p.birthDate)<18 || ageFromBirthDate(p.birthDate)>100))fail("Укажите корректную дату рождения: возраст от 18 до 100 лет");
    if(p.bookingLink!==undefined || p.adminBookingLink!==undefined)fail("Ссылку для записи назначает администратор",403);
    const profile = {
      birthDate:p.birthDate===undefined?req.user.profile?.birthDate||"":p.birthDate,
      experience:String(p.experience ?? req.user.profile?.experience ?? "").slice(0,80),
      city: p.city ?? req.user.profile?.city ?? "",
      avatar: p.avatar ?? req.user.profile?.avatar ?? "",
      rankingVisible: p.rankingVisible ?? (req.user.profile?.rankingVisible !== false),
      bio: String(p.bio ?? req.user.profile?.bio ?? "").slice(0, 1000),
      specialty: String(p.specialty ?? req.user.profile?.specialty ?? "").slice(0, 100),
      status: String(p.status || "").slice(0, 100),
    };
    await db.query("UPDATE users SET name=$1,profile=profile || $2::jsonb WHERE id=$3", [
      name,
      JSON.stringify(profile),
      req.user.id,
    ]);
    res.json({ ok: true });
  });
  app.get("/api/me/gallery",auth,async(req,res)=>{
    const {rows}=await db.query("SELECT id,kind,caption,position FROM master_media WHERE user_id=$1 ORDER BY position,created_at,id",[req.user.id]);
    res.json({items:rows.map(mediaView)});
  });
  app.post("/api/me/gallery",auth,async(req,res)=>{
    if(req.user.account_type!=="master")fail("Портфолио доступно мастерам",403);
    const {kind,caption,thumbnail,image}=req.body;
    if(!["portfolio","drafts"].includes(kind))fail("Выберите работы или эскизы");
    jpegPayload(thumbnail,50000);jpegPayload(image,300000);
    const id=uuid();
    await db.transaction(async q=>{
      await q.query("SELECT id FROM users WHERE id=$1 FOR UPDATE",[req.user.id]);
      const count=await one(q,"SELECT count(*)::int AS n FROM master_media WHERE user_id=$1",[req.user.id]);
      if(count.n>=24)fail("Можно загрузить до 24 фотографий");
      await q.query("INSERT INTO master_media(id,user_id,kind,caption,position,thumbnail,image) VALUES($1,$2,$3,$4,$5,$6,$7)",[id,req.user.id,kind,String(caption||"").slice(0,150),count.n,thumbnail,image]);
      await q.query("UPDATE users SET profile=jsonb_set(profile,'{galleryManaged}','true') WHERE id=$1",[req.user.id]);
    });
    res.status(201).json({id});
  });
  app.patch("/api/me/gallery",auth,async(req,res)=>{
    const items=req.body.items;
    if(!Array.isArray(items)||items.length>24||items.some(i=>!i||typeof i.id!=="string"||!/^[0-9a-f-]{36}$/i.test(i.id)||!['portfolio','drafts'].includes(i.kind))||new Set(items.map(i=>i.id)).size!==items.length)fail("Проверьте порядок фотографий");
    await db.transaction(async q=>{
      await q.query("SELECT id FROM users WHERE id=$1 FOR UPDATE",[req.user.id]);
      const {rows}=await q.query("SELECT id FROM master_media WHERE user_id=$1",[req.user.id]);
      if(rows.length!==items.length||items.some(i=>!rows.some(r=>r.id===i.id)))fail("Список фотографий изменился. Обновите страницу",409);
      for(const [position,item] of items.entries())await q.query("UPDATE master_media SET kind=$1,caption=$2,position=$3 WHERE id=$4 AND user_id=$5",[item.kind,String(item.caption||'').slice(0,150),position,item.id,req.user.id]);
    });res.json({ok:true});
  });
  app.delete("/api/me/gallery/:id",auth,async(req,res)=>{
    const deleted=await one(db,"DELETE FROM master_media WHERE id=$1 AND user_id=$2 RETURNING id",[req.params.id,req.user.id]);
    if(!deleted)fail("Фотография не найдена",404);res.json({ok:true});
  });
  app.get("/api/media/:id",async(req,res)=>{
    const m=await one(db,"SELECT m.thumbnail,m.image FROM master_media m JOIN users u ON u.id=m.user_id WHERE m.id=$1 AND u.active=true AND u.account_type='master'",[req.params.id]);
    if(!m)fail("Фотография не найдена",404);
    const value=req.query.size==='thumb'?m.thumbnail:m.image;
    res.set('Cache-Control','public,max-age=300').type('image/jpeg').send(Buffer.from(value.split(',')[1],'base64'));
  });
  app.get("/api/admin/masters/:id/account",roles("admin"),async(req,res)=>{
    if(!catalogIds.has(req.params.id))fail("Карточка мастера не найдена",404);
    res.json({userId:(await one(db,"SELECT user_id FROM master_links WHERE master_id=$1",[req.params.id]))?.user_id||null});
  });
  app.put("/api/admin/masters/:id/account",roles("admin"),async(req,res)=>{
    if(!catalogIds.has(req.params.id))fail("Карточка мастера не найдена",404);
    await db.transaction(async q=>{
      if(!req.body.userId)await q.query("DELETE FROM master_links WHERE master_id=$1",[req.params.id]);
      else {
        const user=await one(q,"SELECT id FROM users WHERE id=$1 AND active=true AND account_type='master' AND role IN ('guest','resident')",[req.body.userId]);
        if(!user)fail("Аккаунт мастера не найден",404);
        await q.query("INSERT INTO master_links(master_id,user_id) VALUES($1,$2) ON CONFLICT(master_id) DO UPDATE SET user_id=$2",[req.params.id,user.id]);
      }
      await audit(q,req.user.id,"master.account.link",{id:req.params.id,userId:req.body.userId||null});
    });res.json({ok:true});
  });
  app.post("/api/me/password", auth, async (req, res) => {
    if (!verifyPassword(String(req.body.current || ""), req.user.password))
      fail("Текущий пароль не совпадает");
    await db.transaction(async (q) => {
      await q.query("UPDATE users SET password=$1 WHERE id=$2", [
        hashPassword(validPassword(req.body.password)),
        req.user.id,
      ]);
      await q.query("DELETE FROM sessions WHERE user_id=$1", [req.user.id]);
      await q.query("DELETE FROM password_resets WHERE user_id=$1", [req.user.id]);
    });
    res.clearCookie("office_session", { path: "/" });
    res.json({ ok: true });
  });
  app.get("/api/availability", async (req, res) => {
    const s = await settings(),
      date = String(req.query.date || ""),
      duration = Number(req.query.duration || 3),
      city = validCity(String(req.query.city || "spb"));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || ![3, 6, 12].includes(duration))
      fail("Проверьте дату и тариф");
    try { await refreshCalendarBusy(db); } catch { fail("Не удалось проверить календарь студии. Попробуйте немного позже",503); }
    const slots = await db.transaction(async (q) => {
      await lock(q);
      await expire(q);
      const resources = (
          await q.query(
            "SELECT id,name FROM resources WHERE active=true AND city=$1 ORDER BY name",
            [city],
          )
        ).rows,
        result = [];
      for (let hour = s.openHour; hour + duration <= s.closeHour; hour++) {
        let range;
        try {
          range = slot(date, hour, duration, s);
        } catch {
          continue;
        }
        const free = [];
        for (const r of resources)
          if (await available(q, r.id, ...range)) free.push(r.id);
        result.push({ hour, free });
      }
      const n = await one(
        q,
        "SELECT count(DISTINCT user_id)::int AS count FROM bookings WHERE starts_at>=$1::date AND starts_at<($1::date+interval '1 day') AND status IN ('confirmed','invoiced','completed')",
        [date],
      );
      return { slots: result, workingMasters: n.count };
    });
    res.json(slots);
  });
  app.post("/api/bookings", auth, async (req, res) => {
    try { await refreshCalendarBusy(db,0); } catch { fail("Не удалось проверить календарь студии. Попробуйте немного позже",503); }
    const result = await db.transaction(async (q) => {
      await lock(q);
      await expire(q);
      const s = await settings(q),
        manual = req.user.role === "admin" && req.body.manual === true,
        u = await one(
          q,
          "SELECT * FROM users WHERE id=$1 AND active=true FOR UPDATE",
          [manual ? req.body.userId : req.user.id],
        );
      if (!u || !["resident", "guest"].includes(u.role))
        fail("Выберите аккаунт мастера");
      const duration = Number(req.body.duration),
        [start, end] = slot(req.body.date, Number(req.body.hour), duration, s),
        r = await one(
          q,
          "SELECT * FROM resources WHERE id=$1 AND active=true",
          [req.body.resourceId],
        );
      if (!r || !(await available(q, r.id, start, end)))
        fail("Это место уже занято. Выберите другое время", 409);
      if (!manual && !cityOpen(s, r.city))
        fail("Студия в этом городе пока не открыта для записи", 409);
      const rates = cityRates(s, r.city)[u.role];
      const extras = [];
      if (!Array.isArray(req.body.extras) || req.body.extras.length > 30)
        fail("Проверьте доп. опции");
      const ids = new Set();
      for (const item of req.body.extras) {
        if (ids.has(item.id)) fail("Повтор товара");
        ids.add(item.id);
        const x = await one(
          q,
          "SELECT * FROM catalog WHERE id=$1 AND active=true FOR UPDATE",
          [item.id],
        );
        if (!x) fail("Позиция больше недоступна");
        const qty = integer(
          item.qty,
          1,
          x.kind === "service" ? 1 : 100,
          "Количество",
        );
        if (x.kind === "product") {
          if (x.stock < qty) fail(`Недостаточно на складе: ${x.name}`, 409);
          await q.query("UPDATE catalog SET stock=stock-$1 WHERE id=$2", [
            qty,
            x.id,
          ]);
        }
        extras.push({
          id: x.id,
          name: x.name,
          kind: x.kind,
          price: x.price,
          qty,
        });
      }
      const bonus = await loyalty(q, u.id);
      const rate = bonus.freeNext ? 0 : rates[duration],
        total = rate + extras.reduce((a, x) => a + x.price * x.qty, 0),
        cash = u.role === "resident" && u.deposit_waived,
        deposit = cash || bonus.freeNext ? 0 : Math.min(s.deposit, total),
        used = manual ? 0 : Math.min(u.balance, deposit),
        id = uuid();
      await q.query(
        "INSERT INTO bookings(id,user_id,resource_id,starts_at,ends_at,tariff,rate,extras,total,balance_used,status,expires_at,deposit) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'pending',now()+interval '15 minutes',$11)",
        [
          id,
          u.id,
          r.id,
          start,
          end,
          duration,
          rate,
          JSON.stringify(extras),
          total,
          used,
          deposit,
        ],
      );
      if (used) await ledger(q, u.id, id, -used, "Предоплата с баланса");
      let payment = null;
      await q.query("UPDATE bookings SET policy=$1 WHERE id=$2", [
        JSON.stringify({
          cancelHours: s.cancelHours,
          lateCancellation: s.lateCancellation,
          rates,
          city: r.city,
          rulesVersion: s.rulesVersion,
          paymentMethod: cash ? "cash" : "online",
          loyaltyFree: bonus.freeNext,
        }),
        id,
      ]);
      const b = await one(q, "SELECT * FROM bookings WHERE id=$1", [id]);
      if (manual) {
        await confirmed(q, b);
        await q.query("UPDATE bookings SET deposit=0 WHERE id=$1", [id]);
        await audit(q, req.user.id, "booking.manual", { id });
      } else if (used === deposit) await confirmed(q, b);
      else {
        payment = uuid();
        await q.query(
          "INSERT INTO payments(id,booking_id,kind,amount) VALUES($1,$2,'deposit',$3)",
          [payment, id, deposit - used],
        );
      }
      return { bookingId: id, paymentId: payment };
    });
    res.status(201).json(result);
  });
  app.get("/api/notifications", auth, async (req, res) =>
    res.json({
      notifications: (
        await db.query(
          "SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50",
          [req.user.id],
        )
      ).rows,
    }),
  );
  app.get("/api/bookings", auth, async (req, res) =>
    res.json({
      loyalty: await loyalty(db, req.user.id),
      bookings: (
        await db.query(
          "SELECT b.*,r.name AS resource_name FROM bookings b JOIN resources r ON r.id=b.resource_id WHERE b.user_id=$1 ORDER BY b.starts_at DESC",
          [req.user.id],
        )
      ).rows,
      ledger: (
        await db.query(
          "SELECT * FROM ledger WHERE user_id=$1 ORDER BY created_at DESC",
          [req.user.id],
        )
      ).rows,
      payments: (
        await db.query(
          "SELECT p.* FROM payments p JOIN bookings b ON p.booking_id=b.id WHERE b.user_id=$1 ORDER BY p.created_at DESC",
          [req.user.id],
        )
      ).rows,
    }),
  );
  app.post("/api/bookings/:id/cancel", auth, async (req, res) => {
    await db.transaction(async (q) => {
      await lock(q);
      const b = await one(q, "SELECT * FROM bookings WHERE id=$1 FOR UPDATE", [
        req.params.id,
      ]);
      if (!b || (b.user_id !== req.user.id && req.user.role !== "admin"))
        fail("Бронь не найдена", 404);
      if (
        !["pending", "confirmed"].includes(b.status) ||
        new Date(b.starts_at) <= new Date()
      )
        fail("Эту бронь нельзя отменить");
      if (b.status === "pending") {
        await release(q, b, "cancelled");
        return;
      }
      const current = await settings(q),
        s = { ...current, ...b.policy },
        early = new Date(b.starts_at) - Date.now() >= s.cancelHours * 3600000;
      if (!early && s.lateCancellation === "review") {
        await q.query(
          "UPDATE bookings SET status='cancel_requested' WHERE id=$1",
          [b.id],
        );
        await enqueue(q, "booking.cancel_requested", { bookingId: b.id });
        return;
      }
      if (early && b.deposit)
        await ledger(
          q,
          b.user_id,
          b.id,
          b.deposit,
          "Отмена: предоплата на баланс",
        );
      for (const x of b.extras)
        if (x.kind === "product")
          await q.query("UPDATE catalog SET stock=stock+$1 WHERE id=$2", [
            x.qty,
            x.id,
          ]);
      await q.query("UPDATE bookings SET status='cancelled' WHERE id=$1", [
        b.id,
      ]);
      await enqueue(q, "calendar.delete", { bookingId: b.id });
      await enqueue(q, "booking.cancelled", { bookingId: b.id });
      await audit(q, req.user.id, "booking.cancel", {
        id: b.id,
        credited: early ? b.deposit : 0,
      });
    });
    res.json({ ok: true });
  });
  app.post(
    "/api/feedback",
    rateLimit({ windowMs: 3600000, limit: 10 }),
    async (req, res) => {
      const message = String(req.body.message || "").trim();
      if (message.length < 5 || message.length > 4000)
        fail("Сообщение: от 5 до 4000 символов");
      await db.query(
        "INSERT INTO feedback(id,user_id,message) VALUES($1,$2,$3)",
        [uuid(), req.user?.id || null, message],
      );
      res.status(201).json({ ok: true });
    },
  );
  app.get("/api/admin", roles("admin"), async (req, res) => {
    const role = req.user.role,
      result = {
        content: (await db.query("SELECT * FROM content")).rows,
        feedback: (
          await db.query(
            "SELECT * FROM feedback ORDER BY created_at DESC LIMIT 200",
          )
        ).rows,
      };
    if (role === "admin") {
      Object.assign(result, {
        users: (
          await db.query(
            "SELECT id,email,name,role,account_type,active,balance,deposit_waived,created_at,profile->>'adminBookingLink' AS booking_link FROM users ORDER BY created_at DESC",
          )
        ).rows,
        bookings: (
          await db.query(
            "SELECT b.*,u.name AS user_name,r.name AS resource_name FROM bookings b JOIN users u ON u.id=b.user_id JOIN resources r ON r.id=b.resource_id ORDER BY b.starts_at DESC LIMIT 500",
          )
        ).rows,
        blocks: (await db.query("SELECT id,resource_id,starts_at,ends_at,reason,false AS external FROM blocks UNION ALL SELECT id,resource_id,starts_at,ends_at,'Google Calendar' AS reason,true AS external FROM calendar_busy ORDER BY starts_at DESC"))
          .rows,
        catalog: (await db.query("SELECT * FROM catalog ORDER BY name")).rows,
        payments: (
          await db.query(
            "SELECT * FROM payments ORDER BY created_at DESC LIMIT 500",
          )
        ).rows,
        resources: (await db.query("SELECT * FROM resources ORDER BY name"))
          .rows,
      });
    }
    if (role === "admin") {
      result.audit = (
        await db.query("SELECT * FROM audit ORDER BY created_at DESC LIMIT 100")
      ).rows;
      result.outbox = (
        await db.query(
          "SELECT id,kind,status,attempts,last_error,created_at FROM outbox ORDER BY created_at DESC LIMIT 100",
        )
      ).rows;
      result.integrations = {
        yookassa: yookassaEnabled(),
        yookassaTest: yookassaTest(),
        calendar: !!process.env.GOOGLE_SERVICE_ACCOUNT,
        telegram: !!process.env.TELEGRAM_BOT_TOKEN,
        email: !!process.env.EMAIL_API_URL,
      };
    }
    res.json(result);
  });
  app.patch("/api/admin/settings", roles("admin"), async (req, res) => {
    await db.transaction(async (q) => {
      await lock(q);
      const old = await settings(q),
        s = { ...old };
      for (const key of [
        "studioName",
        "website",
        "address",
        "phone",
        "email",
        "legalName",
        "inn",
        "legalAddress",
        "ogrnip",
        "bankName",
        "bankBik",
        "bankCorrespondent",
        "bankAccount",
        "rules",
        "rulesVersion",
        "privacy",
        "offer",
        "consent",
      ])
        if (req.body[key] !== undefined)
          s[key] = String(req.body[key]).slice(0, 20000);
      for (const [k, min, max] of [
        ["openHour", 0, 23],
        ["closeHour", 1, 24],
        ["reminderHours", 1, 168],
        ["cancelHours", 1, 168],
        ["deposit", 0, 10000000],
      ])
        if (req.body[k] !== undefined) s[k] = integer(req.body[k], min, max, k);
      if (s.closeHour <= s.openHour)
        fail("Время закрытия должно быть позже открытия");
      if (req.body.rates) {
        for (const r of ["resident", "guest"])
          for (const h of [3, 6, 12])
            integer(req.body.rates[r]?.[h], s.deposit, 100000000, "Тариф");
        s.rates = req.body.rates;
      }
      if (req.body.cities !== undefined) {
        if (typeof req.body.cities !== "object" || !req.body.cities)
          fail("Проверьте города");
        const cities = { ...s.cities };
        for (const [id, c] of Object.entries(req.body.cities)) {
          validCity(id);
          const next = { ...cities[id] };
          if (c.open !== undefined) {
            if (typeof c.open !== "boolean") fail("Проверьте статус студии");
            next.open = c.open;
          }
          if (c.address !== undefined)
            next.address = String(c.address).slice(0, 300);
          if (c.rates !== undefined) {
            if (id === "spb") fail("Тарифы Санкт-Петербурга передаются в rates");
            for (const r of ["resident", "guest"])
              for (const h of [3, 6, 12])
                integer(c.rates[r]?.[h], s.deposit, 100000000, "Тариф");
            next.rates = c.rates;
          }
          cities[id] = next;
        }
        s.cities = cities;
        if (cities.spb.address) s.address = cities.spb.address;
      }
      if (req.body.lateCancellation !== undefined) {
        if (!["review", "retain"].includes(req.body.lateCancellation))
          fail("Правило отмены");
        s.lateCancellation = req.body.lateCancellation;
      }
      if (req.body.legalApproved !== undefined)
        s.legalApproved = req.body.legalApproved === true;
      if (req.body.mode !== undefined) {
        if (!["test", "live"].includes(req.body.mode)) fail("Режим");
        s.mode = req.body.mode;
      }
      if (req.body.taxationSystem !== undefined)
        s.taxationSystem = integer(req.body.taxationSystem, 0, 5, "СНО");
      if (req.body.vat !== undefined) {
        if (![null, 0, 5, 7, 10, 20, 22].includes(req.body.vat))
          fail("Ставка НДС");
        s.vat = req.body.vat;
      }
      if (s.mode === "live")
        fail(
          "Боевой режим заблокирован до проверки кассовых сценариев и инфраструктуры РФ. См. docs/LAUNCH.md",
          409,
        );
      await q.query("UPDATE settings SET data=$1 WHERE id=1", [
        JSON.stringify(s),
      ]);
      await audit(q, req.user.id, "settings.update");
    });
    res.json({ ok: true });
  });
  app.post("/api/admin/users", staff, async (req, res) => {
    const role = req.body.role || "guest";
    if (!["guest", "resident", "admin"].includes(role))
      fail("Недопустимая роль", 403);
    const bookingLink = req.body.bookingLink;
    if (bookingLink !== undefined && (typeof bookingLink !== "string" || bookingLink.length > 2048 || (bookingLink && !bookingContact(bookingLink)))) fail("Укажите ссылку Telegram: https://t.me/имя или https://t.me/m/код");
    if (bookingLink && role === "admin") fail("Ссылка для записи доступна только мастерам");
    const profile = bookingLink ? {adminBookingLink:bookingContact(bookingLink)} : {};
    const id = uuid();
    await db.transaction(async (q) => {
      await q.query(
        "INSERT INTO users(id,email,password,name,role,account_type,profile) VALUES($1,$2,$3,$4,$5,CASE WHEN $5='admin' THEN 'admin' ELSE 'master' END,$6)",
        [
          id,
          validEmail(req.body.email),
          hashPassword(validPassword(req.body.password)),
          String(req.body.name || "Мастер").slice(0, 100),
          role,
          JSON.stringify(profile),
        ],
      );
      await audit(q, req.user.id, "user.create", { id, role });
    });
    res.status(201).json({ id });
  });
  app.patch("/api/admin/users/:id", roles("admin"), async (req, res) => {
    await db.transaction(async (q) => {
      await lock(q);
      const u = await one(q, "SELECT * FROM users WHERE id=$1", [
        req.params.id,
      ]);
      if (!u) fail("Пользователь не найден", 404);
      const role = req.body.role || u.role,
        active = req.body.active ?? u.active;
      if (
        !["guest", "resident", "admin"].includes(role) ||
        typeof active !== "boolean"
      )
        fail("Проверьте роль");
      if (u.id === req.user.id && (role !== "admin" || !active))
        fail("Нельзя отозвать собственный доступ администратора");
      await q.query("UPDATE users SET email=$1,role=$2,active=$3,account_type=CASE WHEN $2='admin' THEN 'admin' WHEN account_type='admin' THEN 'master' ELSE account_type END WHERE id=$4", [
        req.body.email ? validEmail(req.body.email) : u.email,
        role,
        active,
        u.id,
      ]);
      if(req.body.bookingLink!==undefined) {
        if(typeof req.body.bookingLink!=="string" || req.body.bookingLink.length>2048 || (req.body.bookingLink && !bookingContact(req.body.bookingLink)))fail("Укажите ссылку Telegram: https://t.me/имя");
        if(u.account_type!=="master")fail("Ссылка для записи доступна только мастерам");
        await q.query("UPDATE users SET profile=jsonb_set(profile,'{adminBookingLink}',$1::jsonb) WHERE id=$2",[JSON.stringify(bookingContact(req.body.bookingLink)),u.id]);
        await audit(q,req.user.id,"master.booking_link.update",{id:u.id});
      }
      if (req.body.depositWaived !== undefined && typeof req.body.depositWaived !== "boolean") fail("Проверьте настройку предоплаты");
      const waived = role === "resident" && (req.body.depositWaived ?? u.deposit_waived);
      await q.query("UPDATE users SET deposit_waived=$1 WHERE id=$2", [waived, u.id]);
      if (role !== u.role || active !== u.active || (req.body.email && req.body.email !== u.email))
        await q.query("DELETE FROM sessions WHERE user_id=$1", [u.id]);
      await audit(q, req.user.id, "user.update", { id: u.id, role, active, depositWaived: waived });
    });
    res.json({ ok: true });
  });
  app.post("/api/admin/resources", roles("admin"), async (req, res) => {
    const id = req.body.id || uuid(),
      name = String(req.body.name || "").trim(),
      city = validCity(String(req.body.city || "spb"));
    if (!name || name.length > 100) fail("Название места");
    await db.transaction(async (q) => {
      await lock(q);
      await q.query(
        "INSERT INTO resources(id,name,active,calendar_id,city) VALUES($1,$2,$3,$4,$5) ON CONFLICT(id) DO UPDATE SET name=$2,active=$3,calendar_id=$4,city=$5",
        [
          id,
          name,
          req.body.active !== false,
          String(req.body.calendarId || ""),
          city,
        ],
      );
      await audit(q, req.user.id, "resource.save", { id, city });
    });
    res.json({ id });
  });
  app.post("/api/admin/catalog", staff, async (req, res) => {
    const { name, kind, price, stock } = req.body,
      id = req.body.id || uuid();
    if (!name || name.length > 100 || !["service", "product"].includes(kind))
      fail("Проверьте позицию");
    integer(price, 0, 10000000);
    integer(stock, 0, 100000);
    await db.transaction(async (q) => {
      await lock(q);
      await q.query(
        "INSERT INTO catalog(id,name,kind,price,stock,active) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(id) DO UPDATE SET name=$2,price=$4,stock=$5,active=$6",
        [id, name, kind, price, stock, req.body.active !== false],
      );
      await audit(q, req.user.id, "catalog.save", { id });
    });
    res.json({ id });
  });
  app.post("/api/admin/blocks", staff, async (req, res) => {
    const a = new Date(req.body.startsAt),
      b = new Date(req.body.endsAt);
    if (!Number.isFinite(+a) || !Number.isFinite(+b) || a >= b)
      fail("Проверьте интервал");
    await db.transaction(async (q) => {
      await lock(q);
      if (
        await one(
          q,
          "SELECT id FROM bookings WHERE ($1::uuid IS NULL OR resource_id=$1) AND status IN ('pending','confirmed','invoiced','cancel_requested') AND starts_at<$3 AND ends_at>$2",
          [req.body.resourceId || null, a, b],
        )
      )
        fail("Сначала перенесите или отмените пересекающиеся брони", 409);
      const id = uuid();
      await q.query("INSERT INTO blocks VALUES($1,$2,$3,$4,$5)", [
        id,
        req.body.resourceId || null,
        a,
        b,
        String(req.body.reason || "Закрыто").slice(0, 200),
      ]);
      await enqueue(q, "calendar.block", { blockId: id });
      await audit(q, req.user.id, "block.create", { id });
    });
    res.json({ ok: true });
  });
  app.delete("/api/admin/blocks/:id", staff, async (req, res) => {
    await db.transaction(async (q) => {
      await lock(q);
      const b = await one(q, "DELETE FROM blocks WHERE id=$1 RETURNING *", [
        req.params.id,
      ]);
      if (b) await enqueue(q, "calendar.unblock", { block: b });
      await audit(q, req.user.id, "block.delete", { id: req.params.id });
    });
    res.json({ ok: true });
  });
  app.post("/api/admin/bookings/:id/invoice", staff, async (req, res) => {
    const result = await db.transaction(async (q) => {
      await lock(q);
      const b = await one(q, "SELECT * FROM bookings WHERE id=$1 FOR UPDATE", [
        req.params.id,
      ]);
      if (!b || b.status !== "confirmed")
        fail("Счёт доступен для подтверждённой брони");
      if (new Date(b.starts_at) > new Date()) fail("Сеанс ещё не начался");
      const duration = Number(req.body.duration || b.tariff);
      if (![3, 6, 12].includes(duration) || duration < b.tariff)
        fail("Можно выбрать текущий тариф или выше");
      const u = await one(q, "SELECT * FROM users WHERE id=$1", [b.user_id]),
        s = await settings(q),
        rate =
          b.policy.loyaltyFree ? 0 : duration === b.tariff
            ? b.rate
            : (b.policy.rates ||
                s.rates[
                  ["resident", "guest"].includes(u.role) ? u.role : "resident"
                ])[duration],
        total = rate + b.extras.reduce((a, x) => a + x.qty * x.price, 0),
        amount = Math.max(0, total - b.deposit);
      await q.query(
        "UPDATE bookings SET tariff=$1,rate=$2,total=$3,status=$4 WHERE id=$5",
        [duration, rate, total, amount ? "invoiced" : "completed", b.id],
      );
      let payment = null;
      if (amount) {
        payment = uuid();
        await q.query(
          "INSERT INTO payments(id,booking_id,kind,amount) VALUES($1,$2,'final',$3)",
          [payment, b.id, amount],
        );
      }
      await enqueue(q, "invoice.created", { bookingId: b.id });
      await audit(q, req.user.id, "invoice.create", { id: b.id, total });
      return { paymentId: payment };
    });
    res.json(result);
  });
  app.post(
    "/api/admin/bookings/:id/resolve-cancel",
    staff,
    async (req, res) => {
      await db.transaction(async (q) => {
        await lock(q);
        const b = await one(
          q,
          "SELECT * FROM bookings WHERE id=$1 AND status='cancel_requested' FOR UPDATE",
          [req.params.id],
        );
        if (!b) fail("Заявка не найдена");
        if (req.body.credit === true && b.deposit)
          await ledger(
            q,
            b.user_id,
            b.id,
            b.deposit,
            "Возврат по решению менеджера",
          );
        for (const x of b.extras)
          if (x.kind === "product")
            await q.query("UPDATE catalog SET stock=stock+$1 WHERE id=$2", [
              x.qty,
              x.id,
            ]);
        await q.query("UPDATE bookings SET status='cancelled' WHERE id=$1", [
          b.id,
        ]);
        await enqueue(q, "calendar.delete", { bookingId: b.id });
        await audit(q, req.user.id, "cancellation.resolve", {
          id: b.id,
          credit: req.body.credit === true,
        });
      });
      res.json({ ok: true });
    },
  );
  app.put("/api/admin/content/:id", roles("admin"), async (req, res) => {
    if (!/^[\w-]{1,50}$/.test(req.params.id)) fail("Недопустимый ключ");
    let bookingLink = String(req.body.bookingLink || "").trim();
    if (bookingLink) {
      let link;
      try { link = new URL(bookingLink); } catch { fail("Укажите ссылку Telegram: https://t.me/имя или https://t.me/m/код"); }
      const business = /^\/m\/[a-zA-Z0-9_-]{1,128}\/?$/.test(link.pathname);
      const username = /^\/[a-zA-Z0-9_]{3,64}\/?$/.test(link.pathname) && !["share","addstickers","joinchat","proxy"].includes(link.pathname.replaceAll("/",""));
      if (bookingLink.length > 2048 || link.protocol !== "https:" || !["t.me","telegram.me"].includes(link.hostname) || link.username || link.password || link.port || !(business || username)) fail("Укажите ссылку Telegram: https://t.me/имя или https://t.me/m/код");
      bookingLink = link.href;
    }
    const data = {
      title: String(req.body.title || "").slice(0, 150),
      body: String(req.body.body || "").slice(0, 20000),
      date: String(req.body.date || "").slice(0, 40),
      photo: [1, 2, 3, 4].includes(Number(req.body.photo)) ? Number(req.body.photo) : 1,
      published: req.body.published === true,
      featured: /^master-/.test(req.params.id) ? req.body.featured !== false : undefined,
      specialty: String(req.body.specialty || "").slice(0, 150),
      bookingLink: /^master-/.test(req.params.id) ? bookingLink : undefined,
      portfolio: Array.isArray(req.body.portfolio)
        ? req.body.portfolio.filter((x) => /^tattoo-[1-8]$/.test(x))
        : [],
      drafts: Array.isArray(req.body.drafts)
        ? req.body.drafts.filter((x) => /^draft-[1-7]$/.test(x))
        : [],
    };
    await db.transaction(async (q) => {
      await q.query(
        "INSERT INTO content VALUES($1,$2) ON CONFLICT(id) DO UPDATE SET data=$2",
        [req.params.id, JSON.stringify(data)],
      );
      await audit(q, req.user.id, "content.save", { id: req.params.id });
    });
    res.json({ ok: true });
  });
  app.patch("/api/admin/feedback/:id", roles("admin"), async (req, res) => {
    if (!["new", "done"].includes(req.body.status)) fail("Статус");
    await db.query("UPDATE feedback SET status=$1 WHERE id=$2", [
      req.body.status,
      req.params.id,
    ]);
    res.json({ ok: true });
  });
  const settle = async (q, id, provider) => {
    await lock(q);
    await expire(q);
    const p = await one(q, "SELECT * FROM payments WHERE id=$1 FOR UPDATE", [
      id,
    ]);
    if (!p) fail("Платёж не найден", 404);
    if (p.status === "paid") {
      if (p.provider_id !== provider)
        fail("Счёт уже оплачен другой транзакцией", 409);
      return;
    }
    if (p.status === "expired" && p.kind === "deposit" && provider.startsWith("yookassa:")) {
      const b = await one(q, "SELECT * FROM bookings WHERE id=$1 FOR UPDATE", [p.booking_id]);
      await q.query("UPDATE payments SET status='paid',provider_id=$1 WHERE id=$2", [provider, p.id]);
      await ledger(q, b.user_id, b.id, p.amount, "Возврат поздней оплаты на баланс: резерв истёк");
      await q.query("INSERT INTO notifications(id,user_id,message) VALUES($1,$2,$3)", [uuid(), b.user_id, "Оплата поступила после окончания резерва. Сумма возвращена на внутренний баланс; выберите новое время."]);
      await audit(q, null, "payment.late", { paymentId: p.id, amount: p.amount });
      return;
    }
    if (p.status !== "pending") fail("Резерв истёк, создайте новую бронь", 409);
    const b = await one(q, "SELECT * FROM bookings WHERE id=$1 FOR UPDATE", [
      p.booking_id,
    ]);
    if (
      (p.kind === "deposit" && b.status !== "pending") ||
      (p.kind === "final" && b.status !== "invoiced")
    )
      fail("Статус брони изменился", 409);
    await q.query(
      "UPDATE payments SET status='paid',provider_id=$1 WHERE id=$2",
      [provider, p.id],
    );
    if (p.kind === "deposit") await confirmed(q, b);
    else
      await q.query("UPDATE bookings SET status='completed' WHERE id=$1", [
        b.id,
      ]);
    await enqueue(q, "payment.paid", { bookingId: b.id, paymentId: p.id });
    if (!provider.startsWith("yookassa:") && !provider.startsWith("cash:"))
      await enqueue(q, "receipt.create", { bookingId: b.id, paymentId: p.id });
  };

  app.post("/api/bookings/:id/upgrade", auth, async (req, res) => {
    await db.transaction(async (q) => {
      await lock(q);
      const b = await one(
        q,
        "SELECT * FROM bookings WHERE id=$1 AND user_id=$2 FOR UPDATE",
        [req.params.id, req.user.id],
      );
      if (!b || b.status !== "invoiced")
        fail("Нет открытого итогового счёта", 409);
      const h = Number(req.body.duration);
      if (![3, 6, 12].includes(h) || h < b.tariff)
        fail("Можно выбрать только текущий тариф или выше");
      if (h === b.tariff) return;
      if (await one(q, "SELECT id FROM payments WHERE booking_id=$1 AND kind='final' AND status='pending' AND checkout_id IS NOT NULL", [b.id])) fail("Счёт уже передан в кассу. Обратитесь к администратору для изменения", 409);
      const s = await settings(q),
        rates = b.policy.rates || s.rates[req.user.role],
        rate = b.policy.loyaltyFree ? 0 : rates?.[h];
      if (rate === undefined) fail("Тариф недоступен");
      const total = rate + b.extras.reduce((a, x) => a + x.qty * x.price, 0);
      await q.query(
        "UPDATE bookings SET tariff=$1,rate=$2,total=$3 WHERE id=$4",
        [h, rate, total, b.id],
      );
      await q.query(
        "UPDATE payments SET amount=$1 WHERE booking_id=$2 AND kind='final' AND status='pending'",
        [total - b.deposit, b.id],
      );
      await audit(q, req.user.id, "invoice.upgrade", { id: b.id, duration: h });
    });
    res.json({ ok: true });
  });
  app.post("/api/admin/payments/:id/cash", roles("admin"), async (req, res) => {
    await db.transaction(async q => {
      await lock(q);
      const p = await one(q, "SELECT p.*,b.policy,b.starts_at FROM payments p JOIN bookings b ON b.id=p.booking_id WHERE p.id=$1 FOR UPDATE OF p", [req.params.id]);
      if (!p || p.kind !== "final" || p.policy.paymentMethod !== "cash" || new Date(p.starts_at) > new Date()) fail("Наличный расчёт недоступен", 409);
      if (p.status === "paid") return;
      await settle(q, p.id, "cash:" + p.id);
      await audit(q, req.user.id, "payment.cash", { paymentId: p.id, amount: p.amount });
    });
    res.json({ ok: true });
  });
  const syncYookassa = async (p) => {
    if (!p.checkout_id || !["pending", "expired"].includes(p.status)) return;
    const remote = await yookassaRequest("payments/" + encodeURIComponent(p.checkout_id));
    if (verifyYookassaPayment(remote, p))
      await db.transaction(q => settle(q, p.id, "yookassa:" + remote.id));
  };
  app.locals.reconcilePayments = async () => {
    if (!yookassaEnabled()) return;
    const payments = (await db.query("SELECT * FROM payments WHERE checkout_id IS NOT NULL AND status IN ('pending','expired') AND created_at>now()-interval '1 day' ORDER BY created_at DESC LIMIT 50")).rows;
    for (const payment of payments) {
      try { await syncYookassa(payment); }
      catch (error) { console.error("Payment reconciliation:", error.message); }
    }
  };
  app.post("/api/payments/:id/checkout", auth, async (req, res) => {
    if (!yookassaEnabled()) fail("ЮKassa пока не подключена", 409);
    if (!yookassaTest()) fail("Боевые платежи пока не включены", 409);
    const result = await db.transaction(async q => {
      await lock(q);
      await expire(q);
      const p = await one(q, "SELECT p.*,b.policy FROM payments p JOIN bookings b ON b.id=p.booking_id WHERE p.id=$1 AND b.user_id=$2 AND p.status='pending' FOR UPDATE OF p", [req.params.id, req.user.id]);
      if (!p) fail("Счёт недоступен или резерв истёк", 409);
      if (p.policy.paymentMethod === "cash") fail("Оплата наличными в студии", 409);
      const remote = p.checkout_id
        ? await yookassaRequest("payments/" + encodeURIComponent(p.checkout_id))
        : await yookassaRequest("payments", {
            amount: { value: (p.amount / 100).toFixed(2), currency: "RUB" },
            capture: true,
            confirmation: { type: "redirect", return_url: (process.env.APP_ORIGIN || "http://127.0.0.1:3000").split(",")[0] + "/#/payment/" + p.id },
            description: p.kind === "deposit" ? "Tattoo Office — предоплата рабочего места" : "Tattoo Office — итоговый счёт за сеанс",
            metadata: { payment_id: p.id, booking_id: p.booking_id },
          }, p.id + "-" + p.amount);
      verifyYookassaPayment(remote, { ...p, checkout_id: remote.id });
      if (remote.status !== "pending" || !remote.confirmation?.confirmation_url) fail("Платёж уже завершён. Обновите страницу", 409);
      await q.query("UPDATE payments SET checkout_id=$1 WHERE id=$2", [remote.id, p.id]);
      return { confirmationUrl: remote.confirmation.confirmation_url, test: remote.test };
    });
    res.json(result);
  });
  app.get("/api/payments/:id", auth, async (req, res) => {
    let p = await one(db, "SELECT p.*,b.user_id,b.tariff,b.policy,b.starts_at,b.ends_at,b.expires_at,b.status AS booking_status,r.name AS resource_name,r.city FROM payments p JOIN bookings b ON b.id=p.booking_id JOIN resources r ON r.id=b.resource_id WHERE p.id=$1", [req.params.id]);
    if (!p || p.user_id !== req.user.id) fail("Платёж не найден", 404);
    await syncYookassa(p);
    p = { ...p, ...(await one(db, "SELECT * FROM payments WHERE id=$1", [p.id])) };
    res.json({ payment: p, mode: (await settings()).mode, provider: p.policy.paymentMethod === "cash" ? "cash" : yookassaEnabled() ? "yookassa" : null, test: yookassaTest() });
  });
  app.post("/api/webhooks/yookassa", async (req, res) => {
    const id = req.body?.object?.id;
    if (typeof id !== "string" || id.length > 64) return res.sendStatus(400);
    const p = await one(db, "SELECT * FROM payments WHERE checkout_id=$1", [id]);
    // Verify notifications against the authenticated provider API, never their body.
    if (p) await syncYookassa(p);
    res.json({ ok: true });
  });
  app.post("/api/payments/:id/test", auth, async (req, res) => {
    if (
      (await settings()).mode !== "test" ||
      yookassaEnabled() ||
      process.env.NODE_ENV === "production"
    )
      fail("Тестовая оплата отключена", 403);
    await db.transaction(async (q) => {
      const p = await one(
        q,
        "SELECT p.id,b.user_id FROM payments p JOIN bookings b ON b.id=p.booking_id WHERE p.id=$1",
        [req.params.id],
      );
      if (p?.user_id !== req.user.id) fail("Платёж не найден", 404);
      await settle(q, p.id, "test-" + p.id);
    });
    res.json({ ok: true });
  });
  app.post("/api/webhooks/cloudpayments/:type", async (req, res) => {
    if (
      !verifyHmac(
        req.rawBody,
        req.get("content-hmac"),
        process.env.CLOUDPAYMENTS_API_SECRET,
      )
    )
      return res.status(403).json({ code: 13 });
    if ((await settings()).mode !== "live") return res.json({ code: 13 });
    const { InvoiceId, Amount, Currency, AccountId, TransactionId } = req.body;
    const p = await one(
      db,
      "SELECT p.*,u.email FROM payments p JOIN bookings b ON b.id=p.booking_id JOIN users u ON u.id=b.user_id WHERE p.id=$1",
      [InvoiceId],
    );
    if (
      !p ||
      p.amount !== Math.round(Number(Amount) * 100) ||
      Currency !== "RUB" ||
      AccountId !== p.email
    )
      return res.json({ code: 11 });
    if (req.params.type === "pay")
      await db.transaction((q) => settle(q, p.id, String(TransactionId)));
    else if (req.params.type === "fail") {
      await enqueue(db, "payment.failed", { bookingId: p.booking_id });
    } else if (req.params.type === "check") {
      const b = await one(db, "SELECT * FROM bookings WHERE id=$1", [
        p.booking_id,
      ]);
      if (
        p.status !== "pending" ||
        (b.status === "pending" && new Date(b.expires_at) < new Date())
      )
        return res.json({ code: 20 });
    } else return res.json({ code: 13 });
    res.json({ code: 0 });
  });
  app.use("/api", (req, res) =>
    res.status(404).json({ error: "Метод API не найден" }),
  );
  app.use("/assets", express.static(root + "assets", { maxAge: "1d" }));
  app.use("/css", express.static(root + "css"));
  app.use("/js", express.static(root + "js"));
  app.get("/", (req, res) => res.sendFile(root + "index.html"));
  app.use((e, req, res, next) => {
    if (e.code === "23505")
      return res.status(409).json({ error: "Такая запись уже существует" });
    if (e.code === "22P02")
      return res.status(400).json({ error: "Некорректный идентификатор" });
    if (!e.status) console.error(e.message);
    res.status(e.status || 500).json({
      requestId:req.requestId,
      error: e.status
        ? e.message
        : "Не удалось выполнить действие. Повторите позже.",
    });
  });
  return app;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const db = await database();
  const app = await createApp(db);
  const stopWorker = startWorker(db);
  let reconciling = false;
  const paymentTimer = setInterval(async () => {
    if (reconciling) return;
    reconciling = true;
    try { await app.locals.reconcilePayments(); }
    catch (error) { console.error("Payment reconciliation:", error.message); }
    finally { reconciling = false; }
  }, 30000);
  paymentTimer.unref();
  const server = app.listen(
    Number(process.env.PORT || 3000),
    process.env.HOST || "127.0.0.1",
    () =>
      console.log(
        "Tattoo Office: http://127.0.0.1:" + (process.env.PORT || 3000),
      ),
  );
  process.on("SIGTERM", () => {
    clearInterval(paymentTimer);
    stopWorker();
    server.close(async () => {
      await db.close();
      process.exit(0);
    });
  });
}
