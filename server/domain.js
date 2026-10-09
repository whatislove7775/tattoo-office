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
export const legalSamples = {
  privacy: "Tattoo Office обрабатывает имя, адрес электронной почты, сведения о записи и текст обращения, которые человек сам указывает на сайте. Пароль хранится в виде стойкого хеша.\n\nДанные нужны для создания личного кабинета мастера, организации сеанса и связи по связанным с ним вопросам. Доступ к ним получают уполномоченные сотрудники студии в объёме, необходимом для работы. Данные не продаются.\n\nПользователь может запросить доступ, исправление или удаление данных через контакт студии. Срок хранения зависит от цели обработки и требований законодательства.\n\nПеред открытием регистрации владелец студии дополнит этот текст своими реквизитами, контактами и сведениями о технических подрядчиках.",
  offer: "Tattoo Office предоставляет мастерам доступ к рабочему месту по предварительной записи. Доступные часы, длительность сеанса, состав услуг и стоимость показываются до подтверждения брони.\n\nБронирование подтверждается студией после согласования времени и, если это предусмотрено условиями выбранного тарифа, внесения предоплаты. Перенос возможен по договорённости с администратором при наличии свободного места.\n\nМастер соблюдает правила студии, бережно использует оборудование и оставляет рабочее место в порядке. Дополнительные услуги и расходники согласуются отдельно.\n\nУсловия отмены и возврата студия сообщает до оплаты. Этот текст описывает предполагаемый порядок работы. Перед включением оплаты владелец студии внесёт реквизиты, тарифы и окончательные условия возврата.",
  consent: "Я соглашаюсь на обработку имени, адреса электронной почты и сведений, которые укажу при регистрации или записи, для создания аккаунта мастера, организации сеансов и связи по связанным с ними вопросам.\n\nСогласие относится к сбору, хранению, уточнению, использованию и удалению данных, в том числе с применением средств автоматизации. Я могу отозвать его через контакт студии; отзыв не отменяет обработку, необходимую по другим законным основаниям.\n\nДо открытия регистрации владелец студии укажет полное наименование оператора, адрес, контакт и срок обработки данных.",
};
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
  privacy: legalSamples.privacy,
  offer: legalSamples.offer,
  consent: legalSamples.consent,
  taxationSystem: null,
  vat: null,
  legalApproved: false,
};
