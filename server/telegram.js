import { randomBytes, createHash } from "node:crypto";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { fail, hashToken } from "./domain.js";
const keys = createRemoteJWKSet(
  new URL("https://oauth.telegram.org/.well-known/jwks.json"),
);
export function telegramRoutes(app, { db, session, auth }) {
  const configured = () =>
    process.env.TELEGRAM_CLIENT_ID &&
    process.env.TELEGRAM_CLIENT_SECRET &&
    process.env.APP_ORIGIN;
  const cookie = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600000,
  };
  const cookieValue = (req, k) =>
    req.headers.cookie
      ?.split("; ")
      .find((s) => s.startsWith(k + "="))
      ?.slice(k.length + 1);
  app.get("/api/auth/telegram", async (req, res) => {
    if (!configured()) fail("Telegram пока не подключён", 503);
    const state = randomBytes(32).toString("base64url"),
      verifier = randomBytes(32).toString("base64url");
    await db.query(
      "INSERT INTO oauth_flows VALUES($1,$2,$3,now()+interval '10 minutes')",
      [hashToken(state), verifier, req.user?.id || null],
    );
    res.cookie("office_oauth", state, cookie);
    const params = new URLSearchParams({
      client_id: process.env.TELEGRAM_CLIENT_ID,
      redirect_uri: process.env.APP_ORIGIN + "/api/auth/telegram/callback",
      response_type: "code",
      scope: "openid profile telegram:bot_access",
      state,
      code_challenge: createHash("sha256").update(verifier).digest("base64url"),
      code_challenge_method: "S256",
    });
    res.redirect("https://oauth.telegram.org/auth?" + params);
  });
  app.get("/api/auth/telegram/callback", async (req, res) => {
    if (
      !configured() ||
      typeof req.query.state !== "string" ||
      req.query.state !== cookieValue(req, "office_oauth") ||
      typeof req.query.code !== "string"
    )
      fail("Сессия Telegram истекла. Попробуйте войти заново.", 401);
    const flow = (
      await db.query(
        "DELETE FROM oauth_flows WHERE state=$1 AND expires_at>now() RETURNING *",
        [hashToken(req.query.state)],
      )
    ).rows[0];
    res.clearCookie("office_oauth", { path: "/" });
    if (!flow) fail("Вход уже обработан или истёк", 401);
    const r = await fetch("https://oauth.telegram.org/token", {
      method: "POST",
      signal: AbortSignal.timeout(15000),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.TELEGRAM_CLIENT_ID +
              ":" +
              process.env.TELEGRAM_CLIENT_SECRET,
          ).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: req.query.code,
        redirect_uri: process.env.APP_ORIGIN + "/api/auth/telegram/callback",
        client_id: process.env.TELEGRAM_CLIENT_ID,
        code_verifier: flow.verifier,
      }),
    });
    if (!r.ok) fail("Не удалось подтвердить Telegram", 401);
    const tokens = await r.json(),
      { payload } = await jwtVerify(tokens.id_token, keys, {
        issuer: "https://oauth.telegram.org",
        audience: process.env.TELEGRAM_CLIENT_ID,
        algorithms: ["RS256"],
        maxTokenAge: "10m",
      });
    if (!payload.sub) fail("Telegram не передал идентификатор", 401);
    const existing = (
      await db.query("SELECT * FROM users WHERE telegram_id=$1", [payload.sub])
    ).rows[0];
    if (flow.user_id) {
      if (!req.user || req.user.id !== flow.user_id)
        fail("Войдите в свой аккаунт перед привязкой", 401);
      if (existing && existing.id !== flow.user_id)
        fail("Telegram уже связан с другим аккаунтом", 409);
      await db.query(
        "UPDATE users SET telegram_id=$1,telegram_chat_id=$2 WHERE id=$3",
        [payload.sub, payload.id ? String(payload.id) : null, flow.user_id],
      );
      res.redirect("/#/cabinet");
      return;
    }
    if (existing) {
      if (!existing.active) fail("Доступ закрыт администратором", 403);
      await session(res, existing);
      res.redirect("/#/cabinet");
      return;
    }
    const token = randomBytes(32).toString("base64url");
    await db.query(
      "INSERT INTO telegram_tickets VALUES($1,$2,$3,now()+interval '10 minutes')",
      [hashToken(token), payload.sub, payload.id ? String(payload.id) : null],
    );
    res.cookie("office_telegram", token, cookie);
    res.redirect("/#/signup");
  });
  app.delete("/api/me/telegram", auth, async (req, res) => {
    await db.query(
      "UPDATE users SET telegram_id=NULL,telegram_chat_id=NULL WHERE id=$1",
      [req.user.id],
    );
    res.json({ ok: true });
  });
}
