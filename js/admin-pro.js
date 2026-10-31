/* Автоматизация админ-панели: пульт дня, перенос и неявки, CRM-карточка мастера,
   рассылки, часы мест, склад, промокоды, правила цен, ответы на обращения.
   Модуль получает помощники из office.js через init(). */
let c = null;
export function init(context) { c = context; }

const plural = (n, one, few, many) => {
  const m = Math.abs(n) % 100, d = m % 10;
  return `${n} ${m > 10 && m < 20 ? many : d === 1 ? one : d >= 2 && d <= 4 ? few : many}`;
};
const DEFAULT_TEMPLATES = ["Спасибо за обращение! Мы уже разбираемся.", "Спасибо за идею — передали команде студии.", "Извините за неудобство. Свяжемся с вами в ближайшее время."];
const DAY_NAMES = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const SEGMENTS = [["masters", "Все мастера"], ["residents", "Резиденты"], ["guests", "Мастера без резидентства"], ["inactive", "Не были 60+ дней"]];
export const isShift = () => c.state().me?.staffLevel === "shift";
const mskDay = (d) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Moscow" }).format(new Date(d));

// ---------- Обзор ----------
function delta(now, before, money, inverse) {
  if (!before && !now) return '<small class="pro-delta">—</small>';
  const diff = Math.round((now - before) * 10) / 10, pct = before ? Math.round((diff / before) * 100) : 100;
  const good = inverse ? diff < 0 : diff > 0, bad = inverse ? diff > 0 : diff < 0;
  const sign = diff > 0 ? "+" : diff < 0 ? "−" : "";
  return `<small class="pro-delta ${good ? "is-up" : bad ? "is-down" : ""}">${sign}${money ? c.money(Math.abs(diff)) : Math.abs(diff)}${before ? ` · ${sign}${Math.abs(pct)}%` : ""}</small>`;
}
function statsTable(now, before, title) {
  const rows = [["Брони", "bookings"], ["Выручка", "revenue", true], ["Загрузка мест, %", "utilization"], ["Новые мастера", "newMasters"], ["Отмены", "cancellations", false, true], ["Неявки", "noShows", false, true]];
  return `<div class="pro-stats"><h4>${title}</h4>${rows.map(([label, key, money, inverse]) => `<div class="pro-stat"><span>${label}</span><strong>${money ? c.money(now[key]) : now[key]}</strong>${delta(now[key], before[key], money, inverse)}</div>`).join("")}</div>`;
}
export function overviewHTML(ov) {
  const { esc, money, timeLabel, dateLabel, statusName, CITY_LABELS } = c;
  const a = ov.attention, places = c.state().adminData.resources.filter((r) => r.active).length;
  const tile = (label, value, hint = "") => `<div class="pro-tile"><span>${label}</span><strong>${value}</strong>${hint ? `<small>${hint}</small>` : ""}</div>`;
  const item = (count, label, action, list = "") => count ? `<li class="pro-attention__item"><b>${count}</b><span>${label}${list}</span>${action}</li>` : "";
  const names = (rows, key = "name") => `<small class="muted">${rows.slice(0, 4).map((r) => esc(r[key])).join(", ")}${rows.length > 4 ? ` и ещё ${rows.length - 4}` : ""}</small>`;
  const go = (tab, label = "Открыть") => `<button type="button" class="small" data-admintab="${tab}"><u>${label}</u></button>`;
  const attention = [
    item(a.invoices.length, "Неоплаченные итоговые счета", a.invoices.slice(0, 4).map((b) => `<button type="button" class="small" data-booking-open="${b.id}"><u>${esc(b.user_name)}</u></button>`).join(" "), `<small class="muted">на ${money(a.invoices.reduce((s, x) => s + Number(x.amount || 0), 0))}</small>`),
    item(a.cancelRequests.length, "Запросы на отмену ждут решения", a.cancelRequests.slice(0, 4).map((b) => `<button type="button" class="small" data-booking-open="${b.id}"><u>${esc(b.user_name)}: решить</u></button>`).join(" ")),
    item(a.newFeedback, "Новые обращения", go("feedback", "Прочитать")),
    item(a.lowStock.length, "Расходники заканчиваются", go("catalog", "Склад"), names(a.lowStock)),
    item(a.residentCandidates.length, `Кандидаты в резиденты (${ov.residentRule.sessions}+ сеансов за ${ov.residentRule.days} дн.)`, a.residentCandidates.slice(0, 3).map((u) => `<button type="button" class="small" data-make-resident="${u.id}"><u>${esc(u.name)}: сделать резидентом</u></button>`).join(" "), names(a.residentCandidates)),
    item(a.inactiveResidents.length, `Резиденты не бронировали ${ov.residentRule.inactiveDays}+ дней`, go("users", "Список"), names(a.inactiveResidents)),
    item(a.risky.length, "Мастера с 2+ неявками за 90 дней", a.risky.slice(0, 3).map((u) => `<button type="button" class="small" data-full-prepay="${u.id}"><u>${esc(u.name)}: полная предоплата</u></button>`).join(" ")),
    item(a.incompleteProfiles.length, "Профили мастеров без фото, города или описания", "", names(a.incompleteProfiles)),
    item(a.waitlist.length, "В листе ожидания", "", `<small class="muted">${a.waitlist.slice(0, 4).map((w) => `${esc(w.user_name)} · ${dateLabel(w.date + "T12:00:00+03:00")} ${w.hour}:00`).join(", ")}</small>`),
    item(a.failedJobs, "Письма или уведомления не отправились", "", '<small class="muted">Проверьте подключения в настройках</small>'),
  ].join("");
  return `<section class="pro-overview">
    <div class="pro-tiles">${tile("Записей сегодня", ov.today.bookings.length)}${tile("Свободно сейчас", `${ov.today.freeNow.length} / ${places}`, "мест без сеанса")}${ov.today.expected !== null ? tile("Ожидается сегодня", money(ov.today.expected)) + tile("Получено сегодня", money(ov.today.received)) : ""}</div>
    <h3>Сегодня</h3>${ov.today.bookings.length ? `<ul class="pro-today">${ov.today.bookings.map((b) => `<li><button type="button" class="pro-link pro-today__time" data-booking-open="${b.id}">${timeLabel(b.starts_at)}—${timeLabel(b.ends_at)}</button><span><button type="button" class="pro-link" data-user-card="${b.user_id}">${esc(b.user_name)}</button><small class="muted">${esc(CITY_LABELS[b.city] || b.city)} · ${esc(b.resource_name)}</small></span><span class="badge">${statusName[b.status] || esc(b.status)}</span></li>`).join("")}</ul>` : '<p class="small muted">Сегодня записей нет.</p>'}
    <h3>Требует внимания</h3>${attention ? `<ul class="pro-attention">${attention}</ul>` : '<p class="small muted">Всё в порядке — срочных дел нет.</p>'}
    ${ov.stats ? `<details class="pro-more"><summary>Динамика и загрузка мест</summary><div class="pro-stats-grid">${statsTable(ov.stats.week, ov.stats.prevWeek, "7 дней · к прошлой неделе")}${statsTable(ov.stats.month, ov.stats.prevMonth, "30 дней · к прошлому месяцу")}</div>` : ""}
    <h4 class="pro-sub">Загрузка мест за 30 дней</h4><div class="pro-bars">${ov.places.map((p) => `<div class="pro-bar"><span>${esc(CITY_LABELS[p.city] || p.city)} · ${esc(p.name)}</span><i style="--value:${Math.min(100, p.utilization)}%"></i><b>${p.utilization}%</b></div>`).join("")}</div>${ov.stats ? "</details>" : ""}
  </section>`;
}

// ---------- Пользователи: метки и фильтры ----------
const DAY = 86400000;
export function userTags(u) {
  const tags = [];
  if (u.role === "admin") { if (u.staff_level === "shift") tags.push(["shift", "Смена"]); return tags; }
  if (Date.now() - new Date(u.created_at) < 30 * DAY) tags.push(["new", "Новый"]);
  if (u.completed >= 5) tags.push(["regular", "Постоянный"]);
  if (u.account_type === "master" && (!u.last_booking || Date.now() - new Date(u.last_booking) > 60 * DAY) && Date.now() - new Date(u.created_at) > 30 * DAY) tags.push(["inactive", "Неактивен"]);
  if (u.unpaid) tags.push(["debtor", "Долг"]);
  if (u.no_shows >= 2) tags.push(["risky", "Неявки"]);
  if (u.full_prepay) tags.push(["prepay", "100% предоплата"]);
  return tags;
}
export const TAG_FILTERS = [["new", "Новые"], ["regular", "Постоянные"], ["inactive", "Неактивные"], ["debtor", "Должники"], ["risky", "Неявки"]];
export const tagChips = (u) => userTags(u).map(([k, l]) => `<span class="pro-tag pro-tag--${k}">${l}</span>`).join("");

// ---------- Платежи: период, способ, выгрузка ----------
let financeFilter = { from: "", to: "", method: "all", kind: "all" };
const paymentMethod = (p, a) => {
  const b = a.bookings.find((x) => x.id === p.booking_id);
  return b?.policy?.paymentMethod === "cash" ? "cash" : "online";
};
const METHOD = { online: "Онлайн", cash: "Наличные" };
function filteredPayments(a) {
  const f = financeFilter;
  return a.payments.filter((p) => {
    const d = mskDay(p.created_at);
    return (!f.from || d >= f.from) && (!f.to || d <= f.to) && (f.method === "all" || paymentMethod(p, a) === f.method) && (f.kind === "all" || p.kind === f.kind);
  });
}
export function financeHTML(a, s) {
  const { esc, money, dateLabel, statusName, select } = c, rows = filteredPayments(a);
  const sum = (list) => list.reduce((t, p) => t + Number(p.amount), 0);
  const paid = rows.filter((p) => p.status === "paid"), pending = rows.filter((p) => p.status === "pending");
  const byMethod = Object.keys(METHOD).map((m) => [m, sum(paid.filter((p) => paymentMethod(p, a) === m))]);
  const userOf = (p) => a.bookings.find((b) => b.id === p.booking_id);
  return `<div class="note-paper">${s.mode === "test" ? "Тестовый реестр. Это не реальные поступления." : "Реестр платежей"}</div>
  <form class="pro-filter" id="finance-filter"><label class="field"><span>С</span><input type="date" name="from" value="${financeFilter.from}"></label><label class="field"><span>По</span><input type="date" name="to" value="${financeFilter.to}"></label>${select("method", "Способ", [["all", "Все"], ...Object.entries(METHOD)], financeFilter.method)}${select("kind", "Назначение", [["all", "Все"], ["deposit", "Предоплата"], ["final", "Итоговый счёт"]], financeFilter.kind)}<div class="pro-filter__actions"><button type="button" class="chrome" data-finance-range="month">Этот месяц</button><button type="button" class="chrome" data-finance-range="all">Весь период</button><button type="button" class="chrome" id="finance-csv">Скачать для Excel</button></div></form>
  <div class="pro-tiles"><div class="pro-tile"><span>Получено</span><strong>${money(sum(paid))}</strong><small>${plural(paid.length, "платёж", "платежа", "платежей")}</small></div><div class="pro-tile"><span>Ожидает оплаты</span><strong>${money(sum(pending))}</strong><small>${plural(pending.length, "платёж", "платежа", "платежей")}</small></div>${byMethod.map(([m, v]) => `<div class="pro-tile"><span>${METHOD[m]}</span><strong>${money(v)}</strong></div>`).join("")}</div>
  ${c.table(["Дата", "Мастер", "Назначение", "Способ", "Сумма", "Статус"], rows.map((p) => `<tr><td>${dateLabel(p.created_at)}<br><small class="muted">№ ${p.id.slice(0, 8)}</small></td><td>${userOf(p) ? `<button type="button" class="pro-link" data-user-card="${userOf(p).user_id}">${esc(userOf(p).user_name)}</button>` : "—"}</td><td>${p.kind === "deposit" ? "Предоплата" : "Итоговый счёт"}</td><td>${METHOD[paymentMethod(p, a)]}</td><td>${money(p.amount)}</td><td>${statusName[p.status] || esc(p.status)}</td></tr>`))}`;
}
function downloadCSV(name, header, rows) {
  const cell = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const text = "﻿" + [header, ...rows].map((r) => r.map(cell).join(";")).join("\r\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  link.download = name;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

// ---------- Склад и промокоды ----------
export function catalogExtrasHTML(a) {
  const { esc, money, dateLabel } = c;
  const low = a.catalog.filter((x) => x.kind === "product" && x.active && x.stock <= (x.min_stock ?? 5));
  const purchase = low.map((x) => `${x.name} — ${Math.max(1, (x.min_stock ?? 5) * 2 - x.stock)} шт.`).join("\n");
  return `<h3 class="pro-section-title">Список закупки</h3>${low.length ? `<div class="pro-purchase"><pre>${esc(purchase)}</pre><button type="button" class="chrome" id="copy-purchase" data-text="${esc(purchase)}">Скопировать список</button></div>` : '<p class="small muted">Все расходники выше минимального остатка.</p>'}
  <h3 class="pro-section-title">Движение склада</h3>${(a.stockMoves || []).length ? c.table(["Дата", "Позиция", "Количество", "Причина"], a.stockMoves.map((m) => `<tr><td>${dateLabel(m.created_at)}</td><td>${esc(m.item_name)}</td><td>${m.delta > 0 ? "+" : ""}${m.delta}</td><td>${esc(m.reason)}</td></tr>`)) : '<p class="small muted">Приходов и списаний пока не было.</p>'}`;
}
export function promosHTML(a) {
  const { esc, money, dateLabel } = c;
  const promoRows = (a.promos || []).map((p) => `<tr><td><b>${esc(p.code)}</b>${p.note ? `<br><small class="muted">${esc(p.note)}</small>` : ""}</td><td>${p.kind === "percent" ? `−${p.value}%` : `−${money(p.value)}`}</td><td>${p.used}${p.max_uses ? ` из ${p.max_uses}` : ""}</td><td>${p.expires_at ? "до " + dateLabel(p.expires_at + "T12:00:00+03:00") : "без срока"}</td><td>${p.active ? "Активен" : "Выключен"}</td><td><button type="button" data-edit-promo="${esc(p.code)}">Изменить</button> <button type="button" data-delete-promo="${esc(p.code)}">Удалить</button></td></tr>`);
  return `<h3 class="pro-section-title">Промокоды и подарочные сертификаты</h3><p data-help class="small muted">Скидка применяется к аренде места (без расходников). Сертификат — это промокод на сумму с лимитом 1 использование.</p><div class="admin-tools"><button type="button" class="chrome" id="add-promo">+ Промокод</button><button type="button" class="chrome" id="add-gift">+ Подарочный сертификат</button></div>${promoRows.length ? c.table(["Код", "Скидка", "Использован", "Срок", "Статус", ""], promoRows) : '<p class="small muted">Промокодов пока нет.</p>'}`;
}

// ---------- Настройки: автоматизация и цены ----------
export function settingsFieldset(s) {
  const { field, textarea } = c, rr = s.residentRule || {};
  const hours = (name, label, value) => c.select(name, label, Array.from({ length: 24 }, (_, h) => [h, String(h).padStart(2, "0") + ":00"]), value);
  return `<fieldset class="admin-group"><legend>Автоматизация</legend>
  <label class="check"><input name="pro_autoInvoice" type="checkbox" ${s.autoInvoice === true ? "checked" : ""}><span>Выставлять итоговый счёт автоматически через 15 минут после окончания сеанса (по забронированному тарифу)</span></label>
  <p data-help class="small muted">Напоминания уходят сами: за ${s.reminderHours || 24} ч и за 2 ч до сеанса, а также через сутки после сеанса, если счёт не оплачен. Мастер из листа ожидания получает сообщение, когда место освобождается.</p>
  <div class="form-grid">${field("pro_resSessions", "Кандидат в резиденты: сеансов", rr.sessions ?? 8, "number", 'min="1" max="100" step="1" data-plain-number="true"')}${field("pro_resDays", "…за дней", rr.days ?? 60, "number", 'min="7" max="365" step="1" data-plain-number="true"')}${field("pro_resInactive", "Резидент неактивен после, дней", rr.inactiveDays ?? 90, "number", 'min="14" max="365" step="1" data-plain-number="true"')}</div>
  <div class="wide">${textarea("pro_replyTemplates", "Шаблоны ответов на обращения (каждый с новой строки)", (s.replyTemplates || DEFAULT_TEMPLATES).join("\n"))}</div></fieldset>`;
}
export function settingsPayload(d) {
  const out = {
    autoInvoice: d.pro_autoInvoice === "on",
    residentRule: { sessions: Number(d.pro_resSessions), days: Number(d.pro_resDays), inactiveDays: Number(d.pro_resInactive) },
    replyTemplates: String(d.pro_replyTemplates || "").split("\n").map((x) => x.trim()).filter(Boolean).slice(0, 20),
  };
  for (const k of Object.keys(d)) if (k.startsWith("pro_")) delete d[k];
  return out;
}
const SETTING_LABELS = { rates: "Тарифы", cities: "Города", deposit: "Предоплата", cancelHours: "Срок отмены", reminderHours: "Напоминание", openHour: "Открытие", closeHour: "Закрытие", rankingRules: "Баллы", priceRules: "Наценки", residentRule: "Правило резидентов", autoInvoice: "Автосчёт", replyTemplates: "Шаблоны ответов", rules: "Правила", privacy: "Политика", consent: "Согласие", offer: "Оферта", legalApproved: "Проверка документов" };
export function settingsLogHTML(a) {
  const { esc, dateLabel, timeLabel } = c;
  const rows = (a.settingsLog || []).map((x) => `<tr><td>${dateLabel(x.created_at)} ${timeLabel(x.created_at)}</td><td>${esc(x.actor_name || "—")}</td><td>${(x.details?.changed || []).map((k) => esc(SETTING_LABELS[k] || k)).join(", ") || "—"}</td></tr>`);
  return `<h3 style="margin-top:35px">Журнал изменений настроек</h3>${rows.length ? c.table(["Когда", "Кто", "Что изменено"], rows) : '<p class="small muted">Изменений пока не было.</p>'}`;
}

// ---------- Обращения ----------
const FEEDBACK_STATUS = { new: "Новое", in_progress: "В работе", done: "Обработано" };
export function feedbackHTML(a) {
  const { esc, dateLabel } = c;
  return c.table(["Дата", "Обращение", "Контакт", "Статус", ""], a.feedback.map((f) => `<tr><td>${dateLabel(f.created_at)}</td><td style="white-space:pre-wrap;max-width:400px">${esc(f.message)}${f.reply ? `<div class="pro-reply"><small>Ответ ${f.replied_at ? dateLabel(f.replied_at) : ""}:</small> ${esc(f.reply)}</div>` : ""}</td><td>${f.contact ? esc(f.contact) : '<span class="muted">анонимно</span>'}</td><td><select data-feedback-status="${f.id}" aria-label="Статус обращения">${Object.entries(FEEDBACK_STATUS).map(([v, l]) => `<option value="${v}" ${f.status === v ? "selected" : ""}>${l}</option>`).join("")}</select></td><td><button type="button" data-feedback-reply="${f.id}">Ответить</button></td></tr>`));
}

// ---------- Рабочие места: загрузка и часы ----------
export function placeInfo(r, a) {
  const since = Date.now() - 30 * DAY;
  const hours = a.bookings.filter((b) => b.resource_id === r.id && ["confirmed", "invoiced", "completed"].includes(b.status) && new Date(b.starts_at) > since && new Date(b.starts_at) <= Date.now()).reduce((t, b) => t + (new Date(b.ends_at) - new Date(b.starts_at)) / 3600000, 0);
  const sc = r.schedule || {};
  const days = sc.days?.length && sc.days.length < 7 ? sc.days.map((d) => DAY_NAMES[d - 1]).join(", ") : "ежедневно";
  const time = sc.openHour !== undefined ? `${String(sc.openHour).padStart(2, "0")}:00—${String(sc.closeHour % 24).padStart(2, "0")}:00` : "часы студии";
  return `<small class="pro-place-info">Загрузка 30 дн.: <b>${Math.round((hours / (24 * 30)) * 1000) / 10}%</b> · ${Math.round(hours)} ч<br>${days} · ${time}</small>`;
}

// ---------- Карточка пользователя ----------
export async function userCard(id) {
  const { api, esc, money, dateLabel, timeLabel, statusName, field, select, modal, notify, CITY_LABELS } = c;
  const owner = !isShift(), data = await api("/admin/users/" + encodeURIComponent(id)), u = data.user;
  const row = c.state().adminData.users.find((x) => x.id === id) || {};
  const stats = { done: data.bookings.filter((b) => b.status === "completed").length, upcoming: data.bookings.filter((b) => ["pending", "confirmed"].includes(b.status) && new Date(b.starts_at) > Date.now()).length, noShows: data.bookings.filter((b) => b.status === "no_show").length, spent: data.payments.filter((p) => p.status === "paid").reduce((t, p) => t + Number(p.amount), 0) };
  const isAdmin = u.role === "admin";
  modal(`<div class="pro-card"><h2>${esc(u.name)}</h2><p class="small muted" data-keep-case>${esc(u.email)} · ${isAdmin ? "Администратор" : u.accountType === "customer" ? "Клиент" : u.role === "resident" ? "Резидент" : "Мастер"}${u.city ? " · " + esc(u.city) : ""} · с ${dateLabel(u.createdAt)}${u.telegramLinked ? " · Telegram подключён" : ""}</p><div class="pro-tags">${tagChips(row)}</div>
  ${isAdmin ? "" : `<div class="pro-tiles"><div class="pro-tile"><span>Сеансов</span><strong>${stats.done}</strong></div><div class="pro-tile"><span>Впереди</span><strong>${stats.upcoming}</strong></div><div class="pro-tile"><span>Неявки</span><strong>${stats.noShows}</strong></div>${owner ? `<div class="pro-tile"><span>Оплачено</span><strong>${money(stats.spent)}</strong></div><div class="pro-tile"><span>Баланс</span><strong>${money(u.balance)}</strong></div>` : ""}</div>`}
  ${owner ? `<form id="card-extra" class="pro-card__form"><h3>Заметки администратора</h3><label class="field"><span>Видны только администраторам</span><textarea name="notes" maxlength="4000">${esc(u.notes)}</textarea></label>${isAdmin ? select("staffLevel", "Уровень доступа", [["owner", "Владелец — всё, включая деньги и настройки"], ["shift", "Администратор смены — расписание и брони"]], u.staffLevel) : `<label class="check"><input type="checkbox" name="fullPrepay" ${u.fullPrepay ? "checked" : ""}><span>Полная предоплата для новых броней (защита от неявок)</span></label>`}<button type="submit" class="chrome">Сохранить</button></form>
  ${isAdmin ? "" : `<form id="card-balance" class="pro-card__form"><h3>Баланс</h3><div class="form-grid">${field("amount", "Сумма, ₽ (минус — списание)", "", "number", 'required step="1" data-plain-number="true"')}${field("reason", "Причина", "", "text", 'required maxlength="200" placeholder="Компенсация, возврат…"')}</div><button type="submit" class="chrome">Изменить баланс</button></form>`}
  <form id="card-password" class="pro-card__form"><h3>Пароль</h3>${field("password", "Новый пароль (от 12 символов)", "", "text", 'required minlength="12" maxlength="128" autocomplete="off"')}<p class="small muted">Все сеансы пользователя будут завершены. Передайте пароль лично.${u.role === "admin" && u.staffLevel === "shift" ? " Админ смены входит только по этому паролю на странице «Вход для админа смены», поэтому у каждого админа смены пароль должен быть свой." : ""}</p><button type="submit" class="chrome">Задать пароль</button></form>
  ${isAdmin || !u.active ? "" : `<div class="pro-card__form"><h3>Вход от имени пользователя</h3><p class="small muted">Вы выйдете из админ-панели и увидите кабинет так, как его видит пользователь. Действие записывается в журнал.</p><button type="button" class="chrome" id="card-impersonate">Войти от имени ${esc(u.name)}</button></div>`}` : u.notes ? `<p class="note-paper">${esc(u.notes)}</p>` : ""}
  ${isAdmin ? "" : `<h3>Брони</h3>${data.bookings.length ? c.table(["Сеанс", "Место", "Сумма", "Статус"], data.bookings.map((b) => `<tr><td>${dateLabel(b.starts_at)} ${timeLabel(b.starts_at)}</td><td>${esc(CITY_LABELS[b.city] || b.city)} · ${esc(b.resource_name)}</td><td>${money(b.total)}</td><td>${statusName[b.status] || esc(b.status)}</td></tr>`)) : '<p class="small muted">Броней пока нет.</p>'}
  ${owner && data.ledger.length ? `<h3>Движение баланса</h3>${c.table(["Дата", "Операция", "Сумма"], data.ledger.map((l) => `<tr><td>${dateLabel(l.created_at)}</td><td>${esc(l.description)}</td><td>${l.amount > 0 ? "+" : ""}${money(l.amount)}</td></tr>`))}` : ""}`}</div>`);
  const after = async (text) => { $("#dialog").close(); await c.refresh(); await c.render(); notify(text); };
  c.onForm("#card-extra", async (d) => { await api(`/admin/users/${id}/extra`, "PATCH", isAdmin ? { notes: d.notes, staffLevel: d.staffLevel } : { notes: d.notes, fullPrepay: d.fullPrepay === "on" }); await after("Карточка сохранена"); });
  c.onForm("#card-balance", async (d) => { await api(`/admin/users/${id}/balance`, "POST", { amount: Math.round(Number(d.amount) * 100), reason: d.reason }); await after("Баланс изменён"); });
  c.onForm("#card-password", async (d) => { await api(`/admin/users/${id}/extra`, "PATCH", { password: d.password }); await after("Пароль задан. Сеансы пользователя завершены."); });
  const imp = $("#card-impersonate");
  if (imp) imp.onclick = async () => { imp.disabled = true; try { await api(`/admin/users/${id}/impersonate`, "POST", {}); $("#dialog").close(); await c.refresh(); c.go("cabinet"); notify("Вы вошли как " + u.name + ". Чтобы вернуться, выйдите и войдите как администратор."); } catch (e) { imp.disabled = false; notify(e.message); } };
}
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ---------- Диалоги брони ----------
function moveDialog(b) {
  const { a, select, field, dialogForm, CITY_LABELS, resourceCity, mskHour } = { a: c.state().adminData, ...c, mskHour: (d) => Number(new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", hourCycle: "h23", timeZone: "Europe/Moscow" }).format(new Date(d))) };
  dialogForm("Перенести запись", `<p>${c.esc(b.user_name)} · до ${b.tariff} ч</p>${field("date", "Новая дата", mskDay(b.starts_at), "date", "required")}${field("hour", "Начало (час, МСК)", mskHour(b.starts_at), "number", 'required min="0" max="23"')}${select("resourceId", "Место", a.resources.filter((r) => r.active).map((r) => [r.id, CITY_LABELS[resourceCity(r)] + " · " + r.name]), b.resource_id)}<p data-help class="small muted">Мастер получит уведомление о переносе. Тариф и оплата сохраняются.</p>`, (d) => c.api(`/admin/bookings/${b.id}/move`, "POST", { ...d, hour: Number(d.hour) }));
}
export async function manualRepeat(d) {
  // Повторяющаяся запись резидента: каждую неделю N раз. Занятые даты пропускаются.
  const weeks = Number(d.repeat || 1), done = [], skipped = [];
  for (let i = 0; i < weeks; i++) {
    const date = c.addDate(d.date, i * 7);
    try { await c.api("/bookings", "POST", { userId: d.userId, resourceId: d.resourceId, date, hour: Number(d.hour), duration: Number(d.duration), extras: [], manual: true }); done.push(date); }
    catch (e) { if (i === 0 && weeks === 1) throw e; skipped.push(date); }
  }
  if (weeks > 1) c.notify(`Создано записей: ${done.length}${skipped.length ? `. Пропущены занятые даты: ${skipped.map((x) => c.dateLabel(x + "T12:00:00+03:00")).join(", ")}` : ""}`);
}

// ---------- Привязка обработчиков ----------
export function mount(tab) {
  const { api, notify, render, refresh, dialogForm, select, field, textarea } = c, a = c.state().adminData;
  if (!a) return;
  const reload = async (text) => { await render(); if (text) notify(text); };
  $$("[data-user-card]").forEach((b) => (b.onclick = () => userCard(b.dataset.userCard).catch((e) => notify(e.message))));
  $$("[data-booking-open]").forEach((b) => {
    b.onclick = () => c.openBooking(b.dataset.bookingOpen);
    b.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); c.openBooking(b.dataset.bookingOpen); } };
  });
  $$("[data-make-resident]").forEach((b) => (b.onclick = () => {
    const u = a.users.find((x) => x.id === b.dataset.makeResident);
    if (!u) return;
    dialogForm("Сделать резидентом", `<p>${c.esc(u.name)} получит тариф резидента для новых броней.</p>`, () => api("/admin/users/" + u.id, "PATCH", { role: "resident" }));
  }));
  $$("[data-full-prepay]").forEach((b) => (b.onclick = async () => { try { await api(`/admin/users/${b.dataset.fullPrepay}/extra`, "PATCH", { fullPrepay: true }); await reload("Для мастера включена полная предоплата"); } catch (e) { notify(e.message); } }));
  $$("[data-move-booking]").forEach((b) => {
    const booking = a.bookings.find((x) => x.id === b.dataset.moveBooking);
    if (b.tagName === "BUTTON") b.onclick = () => moveDialog(booking);
    else b.addEventListener("dragstart", (e) => { e.dataTransfer.setData("text/booking", booking.id); e.dataTransfer.effectAllowed = "move"; document.body.classList.add("pro-dragging"); });
    b.addEventListener("dragend", () => document.body.classList.remove("pro-dragging"));
  });
  $$("[data-drop]").forEach((cell) => {
    cell.addEventListener("dragover", (e) => { if (e.dataTransfer.types.includes("text/booking")) { e.preventDefault(); cell.classList.add("is-drop"); } });
    cell.addEventListener("dragleave", () => cell.classList.remove("is-drop"));
    cell.addEventListener("drop", async (e) => {
      e.preventDefault(); cell.classList.remove("is-drop");
      const id = e.dataTransfer.getData("text/booking"), [resourceId, hour] = cell.dataset.drop.split("|");
      try { await api(`/admin/bookings/${id}/move`, "POST", { resourceId, hour: Number(hour), date: c.state().adminDate }); await reload("Запись перенесена"); } catch (err) { notify(err.message); }
    });
  });
  $$("[data-no-show]").forEach((b) => (b.onclick = () => dialogForm("Отметить неявку", "<p>Мастер не пришёл на сеанс. Предоплата остаётся у студии, запись закроется. После двух неявок за 90 дней система предложит включить мастеру полную предоплату.</p>", () => api(`/admin/bookings/${b.dataset.noShow}/no-show`, "POST", {}))));
  // Платежи
  const ff = $("#finance-filter");
  if (ff) {
    ff.onchange = () => { Object.assign(financeFilter, Object.fromEntries(new FormData(ff))); render(); };
    $$("[data-finance-range]").forEach((b) => (b.onclick = () => { const t = c.today(); financeFilter = { ...financeFilter, from: b.dataset.financeRange === "month" ? t.slice(0, 8) + "01" : "", to: b.dataset.financeRange === "month" ? t : "" }; render(); }));
    $("#finance-csv").onclick = () => {
      const rows = filteredPayments(a).map((p) => { const b = a.bookings.find((x) => x.id === p.booking_id); return [mskDay(p.created_at), p.id, b?.user_name || "", p.kind === "deposit" ? "Предоплата" : "Итоговый счёт", METHOD[paymentMethod(p, a)], (p.amount / 100).toFixed(2).replace(".", ","), c.statusName[p.status] || p.status]; });
      downloadCSV(`tattoo-office-payments-${c.today()}.csv`, ["Дата", "Платёж", "Мастер", "Назначение", "Способ", "Сумма, ₽", "Статус"], rows);
    };
  }
  // Пользователи: рассылка
  if ($("#broadcast")) $("#broadcast").onclick = () => dialogForm("Рассылка", `${select("segment", "Кому", SEGMENTS, "masters")}${select("city", "Город мастера", [["", "Все города"], ["СПБ", "Санкт-Петербург"], ["Москва", "Москва"]], "")}${textarea("message", "Сообщение")}<label class="check"><input type="checkbox" name="email"><span>Также отправить на email</span></label><p data-help class="small muted">Сообщение появится в уведомлениях кабинета и придёт в Telegram тем, кто его подключил.</p>`, async (d) => { const r = await api("/admin/broadcast", "POST", { ...d, email: d.email === "on" }); notify(`Отправлено: ${r.count}`); });
  // Рабочие места: часы работы
  $$("[data-place-hours]").forEach((b) => (b.onclick = () => {
    const r = a.resources.find((x) => x.id === b.dataset.placeHours), sc = r.schedule || {}, days = sc.days?.length ? sc.days : [1, 2, 3, 4, 5, 6, 7];
    const hours = (name, label, value, close) => select(name, label, [["", "Как у студии"], ...Array.from({ length: 24 }, (_, h) => [close ? h + 1 : h, String((close ? h + 1 : h) % 24).padStart(2, "0") + ":00"])], value ?? "");
    dialogForm("Часы работы места", `<p>${c.esc(r.name)}</p><fieldset class="pro-days"><legend>Дни приёма записей</legend>${DAY_NAMES.map((n, i) => `<label class="check"><input type="checkbox" name="day${i + 1}" ${days.includes(i + 1) ? "checked" : ""}><span>${n}</span></label>`).join("")}</fieldset><div class="form-grid">${hours("openHour", "Открытие", sc.openHour)}${hours("closeHour", "Закрытие", sc.closeHour, true)}</div><p data-help class="small muted">Пусто — место работает в часы студии. В остальные дни и часы место не показывается мастерам при аренде.</p>`, (d) => {
      const picked = DAY_NAMES.map((_, i) => i + 1).filter((n) => d["day" + n] === "on");
      if (!picked.length) throw Error("Выберите хотя бы один день");
      const schedule = { ...(picked.length < 7 ? { days: picked } : {}), ...(d.openHour !== "" && d.closeHour !== "" ? { openHour: Number(d.openHour), closeHour: Number(d.closeHour) } : {}) };
      return api(`/admin/resources/${r.id}/schedule`, "PATCH", { schedule });
    });
  }));
  // Склад
  $$("[data-stock]").forEach((b) => (b.onclick = () => {
    const x = a.catalog.find((i) => i.id === b.dataset.stock);
    dialogForm("Приход или списание", `<p>${c.esc(x.name)} · сейчас ${x.stock} шт.</p>${field("delta", "Количество (минус — списание)", "", "number", 'required step="1" data-plain-number="true"')}${field("reason", "Причина", "Закупка", "text", 'maxlength="200"')}`, (d) => api(`/admin/catalog/${x.id}/stock`, "POST", { delta: Number(d.delta), reason: d.reason }));
  }));
  if ($("#copy-purchase")) $("#copy-purchase").onclick = async (e) => { try { await navigator.clipboard.writeText(e.currentTarget.dataset.text); notify("Список скопирован"); } catch { notify("Не удалось скопировать"); } };
  // Промокоды
  const promoForm = (p, gift) => dialogForm(p ? "Промокод" : gift ? "Подарочный сертификат" : "Новый промокод", `${field("code", "Код", p?.code || (gift ? "GIFT-" + Math.random().toString(36).slice(2, 8).toUpperCase() : ""), "text", `required pattern="[A-Za-zА-Яа-яЁё0-9_-]{3,32}" ${p ? "readonly" : ""}`)}${select("kind", "Тип", [["percent", "Процент от аренды"], ["amount", "Сумма, ₽"]], p?.kind || (gift ? "amount" : "percent"))}${field("value", "Размер скидки (% или ₽)", p ? (p.kind === "amount" ? p.value / 100 : p.value) : gift ? 3000 : 10, "number", 'required min="1" step="1" data-plain-number="true"')}${field("maxUses", "Лимит использований (пусто — без лимита)", p ? p.max_uses ?? "" : gift ? 1 : "", "number", 'min="1" step="1" data-plain-number="true"')}${field("expiresAt", "Действует до", p?.expires_at || "", "date")}${field("note", "Заметка", p?.note || (gift ? "Подарочный сертификат" : ""), "text", 'maxlength="200"')}<label class="check"><input type="checkbox" name="active" ${p?.active === false ? "" : "checked"}><span>Активен</span></label>`, (d) => api("/admin/promos", "POST", { ...d, value: d.kind === "amount" ? Math.round(Number(d.value) * 100) : Number(d.value), maxUses: d.maxUses === "" ? null : Number(d.maxUses), active: d.active === "on" }));
  if ($("#add-promo")) $("#add-promo").onclick = () => promoForm(null, false);
  if ($("#add-gift")) $("#add-gift").onclick = () => promoForm(null, true);
  $$("[data-edit-promo]").forEach((b) => (b.onclick = () => promoForm(a.promos.find((p) => p.code === b.dataset.editPromo))));
  $$("[data-delete-promo]").forEach((b) => (b.onclick = async () => { try { await api("/admin/promos/" + encodeURIComponent(b.dataset.deletePromo), "DELETE"); await reload("Промокод удалён"); } catch (e) { notify(e.message); } }));
  // Обращения
  $$("[data-feedback-status]").forEach((s) => (s.onchange = async () => { try { await api("/admin/feedback/" + s.dataset.feedbackStatus, "PATCH", { status: s.value }); await reload(); } catch (e) { notify(e.message); } }));
  $$("[data-feedback-reply]").forEach((b) => (b.onclick = () => {
    const f = a.feedback.find((x) => x.id === b.dataset.feedbackReply), templates = c.state().pub.settings.replyTemplates || DEFAULT_TEMPLATES;
    dialogForm("Ответ на обращение", `<p class="note-paper" style="white-space:pre-wrap">${c.esc(f.message)}</p>${templates.length ? `<div class="pro-templates">${templates.map((t, i) => `<button type="button" class="small" data-template="${i}"><u>${c.esc(t.slice(0, 40))}${t.length > 40 ? "…" : ""}</u></button>`).join(" ")}</div>` : ""}${textarea("text", "Ответ", f.reply || "")}<p data-help class="small muted">${/@/.test(f.contact || "") ? `Ответ уйдёт на ${c.esc(f.contact)}.` : f.user_id ? "Ответ появится в уведомлениях кабинета автора." : "Автор не оставил email — ответ сохранится только здесь. Свяжитесь по контакту вручную."}</p>`, async (d) => { const r = await api(`/admin/feedback/${f.id}/reply`, "POST", d); notify(r.sent ? "Ответ отправлен на email" : "Ответ сохранён"); });
    $$("[data-template]").forEach((t) => (t.onclick = () => { $('#dialog-form [name="text"]').value = templates[t.dataset.template]; }));
  }));
}
