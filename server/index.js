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
  const one = async (q, s, p = []) => (await q.query(s, p)).rows[0];
  const settings = async (q = db) =>
    (await one(q, "SELECT data FROM settings WHERE id=1")).data;
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
    if (!(await one(db, "SELECT id FROM users WHERE email=$1", [email])))
      await db.query(
        "INSERT INTO users(id,email,password,name,role) VALUES($1,$2,$3,$4,$5)",
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
          balance: u.balance,
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
        await db.query("SELECT id,name,active FROM resources ORDER BY name")
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
      paymentEnabled: !!process.env.CLOUDPAYMENTS_PUBLIC_ID,
    });
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
    const s = await settings();
    const u = await db.transaction(async (q) => {
      const id = uuid();
      await q.query(
        "INSERT INTO users(id,email,password,name,role) VALUES($1,$2,$3,$4,'resident')",
        [id, email, hashPassword(password), name.trim()],
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
    const u = await one(db, "SELECT * FROM users WHERE email=$1", [
      validEmail(req.body.email),
    ]);
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
    const profile = {
      bio: String(p.bio || "").slice(0, 1000),
      specialty: String(p.specialty || "").slice(0, 100),
      accent: ["paper", "beige", "graphite"].includes(p.accent)
        ? p.accent
        : "paper",
      status: String(p.status || "").slice(0, 100),
    };
    await db.query("UPDATE users SET name=$1,profile=$2 WHERE id=$3", [
      name,
      JSON.stringify(profile),
      req.user.id,
    ]);
    res.json({ ok: true });
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
    });
    res.clearCookie("office_session", { path: "/" });
    res.json({ ok: true });
  });
  app.get("/api/availability", async (req, res) => {
    const s = await settings(),
      date = String(req.query.date || ""),
      duration = Number(req.query.duration || 3);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || ![3, 6, 12].includes(duration))
      fail("Проверьте дату и тариф");
    const slots = await db.transaction(async (q) => {
      await lock(q);
      await expire(q);
      const resources = (
          await q.query(
            "SELECT id,name FROM resources WHERE active=true ORDER BY name",
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
      const rate = s.rates[u.role][duration],
        total = rate + extras.reduce((a, x) => a + x.price * x.qty, 0),
        used = manual ? 0 : Math.min(u.balance, s.deposit),
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
          s.deposit,
        ],
      );
      if (used) await ledger(q, u.id, id, -used, "Предоплата с баланса");
      let payment = null;
      await q.query("UPDATE bookings SET policy=$1 WHERE id=$2", [
        JSON.stringify({
          cancelHours: s.cancelHours,
          lateCancellation: s.lateCancellation,
          rates: s.rates[u.role],
          rulesVersion: s.rulesVersion,
        }),
        id,
      ]);
      const b = await one(q, "SELECT * FROM bookings WHERE id=$1", [id]);
      if (manual) {
        await confirmed(q, b);
        await q.query("UPDATE bookings SET deposit=0 WHERE id=$1", [id]);
        await audit(q, req.user.id, "booking.manual", { id });
      } else if (used === s.deposit) await confirmed(q, b);
      else {
        payment = uuid();
        await q.query(
          "INSERT INTO payments(id,booking_id,kind,amount) VALUES($1,$2,'deposit',$3)",
          [payment, id, s.deposit - used],
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
            "SELECT id,email,name,role,active,balance,created_at FROM users ORDER BY created_at DESC",
          )
        ).rows,
        bookings: (
          await db.query(
            "SELECT b.*,u.name AS user_name,r.name AS resource_name FROM bookings b JOIN users u ON u.id=b.user_id JOIN resources r ON r.id=b.resource_id ORDER BY b.starts_at DESC LIMIT 500",
          )
        ).rows,
        blocks: (await db.query("SELECT * FROM blocks ORDER BY starts_at DESC"))
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
        cloudpayments: !!process.env.CLOUDPAYMENTS_API_SECRET,
        cloudkassir: !!process.env.CLOUDKASSIR_API_SECRET,
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
        "address",
        "phone",
        "email",
        "legalName",
        "inn",
        "legalAddress",
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
    const id = uuid();
    await db.transaction(async (q) => {
      await q.query(
        "INSERT INTO users(id,email,password,name,role) VALUES($1,$2,$3,$4,$5)",
        [
          id,
          validEmail(req.body.email),
          hashPassword(validPassword(req.body.password)),
          String(req.body.name || "Мастер").slice(0, 100),
          role,
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
      await q.query("UPDATE users SET email=$1,role=$2,active=$3 WHERE id=$4", [
        req.body.email ? validEmail(req.body.email) : u.email,
        role,
        active,
        u.id,
      ]);
      await q.query("DELETE FROM sessions WHERE user_id=$1", [u.id]);
      await audit(q, req.user.id, "user.update", { id: u.id, role, active });
    });
    res.json({ ok: true });
  });
  app.post("/api/admin/resources", roles("admin"), async (req, res) => {
    const id = req.body.id || uuid(),
      name = String(req.body.name || "").trim();
    if (!name || name.length > 100) fail("Название места");
    await db.transaction(async (q) => {
      await lock(q);
      await q.query(
        "INSERT INTO resources(id,name,active,calendar_id) VALUES($1,$2,$3,$4) ON CONFLICT(id) DO UPDATE SET name=$2,active=$3,calendar_id=$4",
        [
          id,
          name,
          req.body.active !== false,
          String(req.body.calendarId || ""),
        ],
      );
      await audit(q, req.user.id, "resource.save", { id });
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
          duration === b.tariff
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
    const data = {
      title: String(req.body.title || "").slice(0, 150),
      body: String(req.body.body || "").slice(0, 20000),
      published: req.body.published === true,
      specialty: String(req.body.specialty || "").slice(0, 150),
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
      const s = await settings(q),
        rates = b.policy.rates || s.rates[req.user.role],
        rate = rates?.[h];
      if (!rate) fail("Тариф недоступен");
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
  app.get("/api/payments/:id/checkout", auth, async (req, res) => {
    const s = await settings();
    if (s.mode !== "live" || !process.env.CLOUDPAYMENTS_PUBLIC_ID)
      fail("Реальная касса ещё не подключена", 409);
    const p = await one(
      db,
      "SELECT p.*,u.email FROM payments p JOIN bookings b ON b.id=p.booking_id JOIN users u ON u.id=b.user_id WHERE p.id=$1 AND b.user_id=$2 AND p.status='pending'",
      [req.params.id, req.user.id],
    );
    if (!p) fail("Счёт не найден", 404);
    res.json({
      publicId: process.env.CLOUDPAYMENTS_PUBLIC_ID,
      description:
        p.kind === "deposit"
          ? "Предоплата рабочего места"
          : "Итоговый расчёт Tattoo Office",
      amount: p.amount / 100,
      currency: "RUB",
      accountId: p.email,
      email: p.email,
      invoiceId: p.id,
      skin: "mini",
    });
  });
  app.get("/api/payments/:id", auth, async (req, res) => {
    const p = await one(
      db,
      "SELECT p.*,b.user_id,b.tariff FROM payments p JOIN bookings b ON b.id=p.booking_id WHERE p.id=$1",
      [req.params.id],
    );
    if (!p || p.user_id !== req.user.id) fail("Платёж не найден", 404);
    res.json({ payment: p, mode: (await settings()).mode });
  });
  app.post("/api/payments/:id/test", auth, async (req, res) => {
    if (
      (await settings()).mode !== "test" ||
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
  const server = app.listen(
    Number(process.env.PORT || 3000),
    process.env.HOST || "127.0.0.1",
    () =>
      console.log(
        "Tattoo Office: http://127.0.0.1:" + (process.env.PORT || 3000),
      ),
  );
  process.on("SIGTERM", () => {
    stopWorker();
    server.close(async () => {
      await db.close();
      process.exit(0);
    });
  });
}
