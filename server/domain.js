import {studioRules,studioRulesVersion} from "./studio-rules.js";
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
  const [year, month, day] = date.split("-").map(Number);
  if (new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10) !== date)
    fail("Проверьте дату");
  const start = new Date(
      `${date}T${String(hour).padStart(2, "0")}:00:00+03:00`,
    ),
    end = new Date(+start + duration * 3600000);
  if (+start <= now) fail("Нельзя записаться в прошлое");
  if (+start > now + 180 * 86400000) fail("Запись открыта на 180 дней");
  if (!(settings.openHour === 0 && settings.closeHour === 24) &&
      (hour < settings.openHour || hour + duration > settings.closeHour))
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
  privacy: `1. Оператор и сфера действия
Оператор персональных данных — лицо, указанное в реквизитах ниже. Политика действует для сайта tattoo-office.com, личного кабинета и обращений в студию.

2. Какие данные обрабатываются
При регистрации и работе с сайтом: имя, адрес электронной почты, номер телефона, сведения профиля мастера, изображения, текст и ссылки, которые пользователь загружает сам, история бронирований, платежей и обращений. Для безопасности и работы кабинета обрабатываются технические данные о сеансе, IP-адрес и записи действий. Пароли хранятся в виде хеша. Платёжные реквизиты карты обрабатывает платёжный провайдер; сайт не должен получать номер карты или CVV.

3. Цели и основания
Данные используются для регистрации и входа, исполнения бронирования и расчётов, показа добровольно заполненного публичного профиля, ответа на обращения, отправки сообщений по записи, защиты сайта и исполнения обязанностей по закону. Основания обработки — исполнение договора, требования закона и согласие в тех случаях, когда оно требуется. Рекламные рассылки требуют отдельного основания и возможности отказа.

4. Публикация профиля и получатели
В публичном профиле могут быть видны имя мастера, фотография, описание, работы, эскизы и предоставленные им контакты. Перед размещением персональных данных для неограниченного круга лиц требуется отдельное согласие на их распространение. Для оказания услуг данные могут передаваться платёжному сервису и оператору фискальных данных, провайдерам хостинга, электронной почты и уведомлений в необходимом объёме. Доступ сотрудников ограничивается их задачами.

5. Сроки и защита
Данные хранятся, пока нужны для указанных целей, а документы по расчётам — в установленные законом сроки. После достижения цели данные удаляются или обезличиваются, если закон не требует дальнейшего хранения. Используются разграничение доступа, защищённое соединение и технические меры защиты. Технические cookie-файлы нужны для входа; настройки интерфейса могут сохраняться в браузере.

6. Права пользователя
Пользователь может запросить сведения об обработке, исправить данные, отозвать согласие или потребовать прекращения обработки и удаления данных, если нет иного законного основания для их хранения. Обращение направляется на email оператора, указанный ниже. Политика обновляется при изменении способов обработки; актуальная редакция публикуется на этой странице.`,
  offer: `1. Исполнитель и предмет
Исполнитель, указанный в реквизитах ниже, предоставляет мастеру рабочее место в студии Tattoo Office на выбранные при бронировании дату и время. Студия работает 24/7; доступность конкретного места показывается при записи. Дополнительные услуги и товары включаются в заказ только после выбора и отображаются отдельно.

2. Стоимость и заключение договора
Состав заказа, длительность, полная стоимость, скидки и сумма предоплаты показываются до подтверждения бронирования. Подтверждая заказ и принимая условия, пользователь соглашается с офертой. Бронь приобретает статус подтверждённой после предусмотренного для неё расчёта или подтверждения администратором. Предоплата, если она предусмотрена заказом, засчитывается в полную стоимость аренды места; это не отдельная платная услуга. Остаток оплачивается после сеанса по выставленному счёту. Для отдельных мастеров может быть доступен расчёт наличными в студии.

3. Пользование местом
Мастер использует место в согласованный период, соблюдает опубликованные правила студии, требования безопасности и санитарные правила, бережно относится к имуществу. Порядок переноса записи и доступность другого времени согласуются с администратором. Изменение состава заказа или времени после подтверждения требует согласования.

4. Отмена и возврат
При отмене не менее чем за 48 часов до начала сеанса внесённая предоплата автоматически зачисляется на внутренний баланс для будущего бронирования. При более поздней отмене автоматического зачисления на баланс нет. Это не исключает права обратиться за возвратом денег; требование рассматривается с учётом применимого законодательства, фактически понесённых и подтверждённых расходов исполнителя и обстоятельств отмены. Если услуга не предоставлена по вине исполнителя, пользователь вправе требовать возврата оплаченной суммы. Для возврата на исходный способ оплаты или уточнения расчёта обратитесь по контактам ниже.

5. Чеки и обращения
При применении ККТ электронный кассовый чек направляется на адрес электронной почты, указанный при оплате. Внутренний баланс отражает учёт ранее внесённых средств и не заменяет кассовый чек или денежный возврат. Вопросы по заказу, качеству услуги и возврату принимаются по email и телефону исполнителя, указанным ниже.`,
  consent: `1. Оператор, данные и цели
Я даю оператору, указанному в реквизитах ниже, согласие на обработку предоставленных мной имени, email, телефона, сведений профиля и обращений для создания личного кабинета, организации бронирований, связи по ним и ответа на обращения. Сведения о платежах обрабатываются для расчётов и исполнения требований закона.

2. Действия и срок
Согласие распространяется на сбор, запись, систематизацию, накопление, хранение, уточнение, извлечение, использование, передачу привлечённым для этих целей обработчикам, обезличивание, блокирование и удаление данных с применением средств автоматизации или без них. Оно действует до достижения целей обработки или моего отзыва, если более длительное хранение не требуется по закону.

3. Отзыв
Я могу отозвать согласие письмом на email оператора, указанный ниже. Оператор прекратит обработку, основанную на согласии, в установленный законом срок; отзыв не отменяет обработку, необходимую для исполнения договора или требований закона. Публикация данных моего профиля для неограниченного круга лиц требует отдельного согласия.`,
};
export const defaults = {
  mode: "test",
  studioName: "Tattoo Office",
  address: "Санкт-Петербург, ул. Кирочная, 24",
  phone: "",
  email: "",
  legalName: "",
  inn: "",
  legalAddress: "",
  openHour: 0,
  closeHour: 24,
  reminderHours: 24,
  cancelHours: 48,
  lateCancellation: "retain",
  deposit: 50000,
  rates: {
    resident: { 3: 160000, 6: 300000, 12: 420000 },
    guest: { 3: 200000, 6: 350000, 12: 500000 },
  },
  // Студии по городам. Тарифы Санкт-Петербурга — в rates (как раньше),
  // у остальных городов свои rates внутри cities.<id>.
  cities: {
    spb: { open: true, address: "Санкт-Петербург, ул. Кирочная, 24" },
    msk: {
      open: false,
      address: "",
      rates: {
        resident: { 3: 160000, 6: 300000, 12: 420000 },
        guest: { 3: 200000, 6: 350000, 12: 500000 },
      },
    },
  },
  rules: studioRules,
  rulesVersion: studioRulesVersion,
  privacy: legalSamples.privacy,
  offer: legalSamples.offer,
  consent: legalSamples.consent,
  taxationRegime: "ausn",
  taxationSystem: null,
  vat: 0,
  legalApproved: false,
};

export const CITY_IDS = ["spb", "msk"];
export const CITY_NAMES = { spb: "Санкт-Петербург", msk: "Москва" };
export function validCity(id) {
  if (!CITY_IDS.includes(id)) fail("Неизвестный город");
  return id;
}
// Настройки, сохранённые до появления городов, дополняются значениями по умолчанию.
export function withCities(s) {
  const cities = {};
  for (const id of CITY_IDS)
    cities[id] = { ...defaults.cities[id], ...(s.cities?.[id] || {}) };
  if (!s.cities?.spb?.address && s.address) cities.spb.address = s.address;
  return { ...s, cities };
}
export function cityRates(s, city) {
  return city === "spb" ? s.rates : s.cities?.[city]?.rates || s.rates;
}
export function cityOpen(s, city) {
  return !!withCities(s).cities[city]?.open;
}

// Сайт и превью Vercel обращаются к одному API. Изменяющие запросы принимаются
// только с основного адреса (APP_ORIGIN) и с превью-адресов этого проекта Vercel.
// Шаблон превью можно переопределить в PREVIEW_ORIGIN_PATTERN (пустая строка — выключить).
export const DEFAULT_PREVIEW_ORIGIN_PATTERN = "^https://tattoo-office-[a-z0-9-]+-whatislove7775s-projects\\.vercel\\.app$";
export function allowedOrigin(origin, { appOrigin, host, previewPattern = DEFAULT_PREVIEW_ORIGIN_PATTERN } = {}) {
  if (!origin) return true;
  const main = appOrigin ? appOrigin.split(",").map((x) => x.trim()).filter(Boolean) : [`http://${host}`];
  if (main.includes(origin)) return true;
  if (!previewPattern) return false;
  try { return new RegExp(previewPattern).test(origin); } catch { return false; }
}

// --- Цены по времени, расписание мест, промокоды (общие для сервера и тестов) ---
// День недели даты в календаре Москвы: 1 — понедельник … 7 — воскресенье.
export function weekday(date) {
  const day = new Date(`${date}T12:00:00+03:00`).getUTCDay();
  return day === 0 ? 7 : day;
}
export const defaultPriceRules = { nightPercent: 0, nightFrom: 22, nightTo: 8, weekendPercent: 0 };
// Надбавка (или скидка) к аренде: ночные часы и выходные. Округление до рубля.
export function priceAdjust(base, date, hour, rules = {}) {
  const r = { ...defaultPriceRules, ...(rules || {}) };
  const night = r.nightPercent && (r.nightFrom > r.nightTo ? hour >= r.nightFrom || hour < r.nightTo : hour >= r.nightFrom && hour < r.nightTo);
  const weekend = r.weekendPercent && weekday(date) >= 6;
  const percent = (night ? r.nightPercent : 0) + (weekend ? r.weekendPercent : 0);
  const rate = Math.max(0, Math.round((base * (100 + percent)) / 100 / 100) * 100);
  return { rate, percent, night: !!night, weekend: !!weekend };
}
// Работает ли конкретное место в выбранные день и часы (своё расписание места).
export function resourceOpen(resource, date, hour, duration) {
  const s = resource?.schedule || {};
  if (Array.isArray(s.days) && s.days.length && !s.days.includes(weekday(date))) return false;
  if (Number.isInteger(s.openHour) && Number.isInteger(s.closeHour) && !(s.openHour === 0 && s.closeHour === 24))
    if (hour < s.openHour || hour + duration > s.closeHour) return false;
  return true;
}
export function validSchedule(value) {
  if (!value || typeof value !== "object") return {};
  const days = Array.isArray(value.days) ? [...new Set(value.days.map(Number))].filter((d) => Number.isInteger(d) && d >= 1 && d <= 7).sort() : [];
  const out = {};
  if (days.length && days.length < 7) out.days = days;
  if (value.openHour !== undefined && value.closeHour !== undefined && !(Number(value.openHour) === 0 && Number(value.closeHour) === 24)) {
    out.openHour = integer(Number(value.openHour), 0, 23, "Открытие места");
    out.closeHour = integer(Number(value.closeHour), 1, 24, "Закрытие места");
    if (out.closeHour <= out.openHour) fail("Закрытие места должно быть позже открытия");
  }
  return out;
}
export function promoDiscount(promo, rate) {
  if (!promo) return 0;
  return promo.kind === "percent" ? Math.round((rate * Math.min(100, promo.value)) / 100) : Math.min(rate, promo.value);
}
export function normalizePromoCode(code) {
  const value = String(code || "").trim().toUpperCase();
  if (!/^[A-Z0-9А-ЯЁ_-]{3,32}$/u.test(value)) fail("Промокод: от 3 до 32 букв, цифр, дефисов");
  return value;
}
