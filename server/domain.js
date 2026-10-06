import {
  scryptSync,
  randomBytes,
  timingSafeEqual,
  createHash,
  createHmac,
} from "node:crypto";
export const hashPassword = (p) => {
  const s = randomBytes(16).toString("hex");
  return s + ":" + scryptSync(p, s, 64).toString("hex");
};
export function verifyPassword(p, h) {
  const [s, v] = h.split(":");
  if (!s || !v) return false;
  const b = Buffer.from(v, "hex");
  return b.length === 64 && timingSafeEqual(scryptSync(p, s, 64), b);
}
export const hashToken = (t) => createHash("sha256").update(t).digest("hex");
export function fail(message, status = 400) {
  throw Object.assign(Error(message), { status });
}
export function integer(x, min, max, label = "Значение") {
  if (!Number.isInteger(x) || x < min || x > max)
    fail(`${label}: допустимо от ${min} до ${max}`);
  return x;
}
export function validEmail(s) {
  s = String(s || "")
    .trim()
    .toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) || s.length > 254)
    fail("Проверьте email");
  return s;
}
export function validPassword(p) {
  if (typeof p !== "string" || p.length < 12 || p.length > 128)
    fail("Пароль: от 12 до 128 символов");
  return p;
}
export function slot(date, hour, duration, settings, now = Date.now()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail("Проверьте дату");
  integer(hour, 0, 23);
  if (![3, 6, 12].includes(duration)) fail("Неизвестный тариф");
  const start = new Date(
      `${date}T${String(hour).padStart(2, "0")}:00:00+03:00`,
    ),
    end = new Date(+start + duration * 3600000);
  if (Number.isNaN(+start) || start.toISOString().slice(0, 10) !== date)
    fail("Проверьте дату");
  if (+start <= now) fail("Нельзя записаться в прошлое");
  if (+start > now + 180 * 86400000) fail("Запись открыта на 180 дней");
  if (hour < settings.openHour || hour + duration > settings.closeHour)
    fail("Вне рабочего времени студии");
  return [start.toISOString(), end.toISOString()];
}
export function verifyHmac(raw, signature, secret) {
  if (!secret || !signature) return false;
  const actual = Buffer.from(signature, "base64"),
    expected = createHmac("sha256", secret).update(raw).digest();
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export const defaults = {
  mode: "test",
  studioName: "Tattoo Office",
  address: "",
  phone: "",
  email: "",
  legalName: "",
  inn: "",
  legalAddress: "",
  openHour: 10,
  closeHour: 22,
  reminderHours: 24,
  cancelHours: 24,
  lateCancellation: "review",
  deposit: 50000,
  rates: {
    resident: { 3: 150000, 6: 250000, 12: 400000 },
    guest: { 3: 200000, 6: 320000, 12: 500000 },
  },
  rules:
    "Работайте одноразовыми расходниками. Подготовьте и обработайте рабочее место до и после сеанса. Соблюдайте согласованное время и уважайте соседей. Полный регламент студия опубликует перед запуском.",
  rulesVersion: "draft-1",
  privacy: "",
  offer: "",
  consent: "",
  taxationSystem: null,
  vat: null,
  legalApproved: false,
};
