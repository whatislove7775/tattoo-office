/* Удобство админ-панели: лента расписания, панель брони, цены, поиск по всему,
   горячие клавиши, защита несохранённых настроек, нижняя навигация на телефоне.
   Помощники приходят из office.js через init(). */
let c = null;
export function init(context) { c = context; }
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const MSK = { timeZone: "Europe/Moscow" };
const mskDay = (d) => new Intl.DateTimeFormat("sv-SE", MSK).format(new Date(d));
const mskHour = (d) => Number(new Intl.DateTimeFormat("ru-RU", { ...MSK, hour: "2-digit", hourCycle: "h23" }).format(new Date(d)));
const mskMinute = (d) => Number(new Intl.DateTimeFormat("ru-RU", { ...MSK, minute: "2-digit" }).format(new Date(d)));
export const weekday = (d) => new Intl.DateTimeFormat("ru-RU", { ...MSK, weekday: "short" }).format(new Date(d));
export const fullDate = (d) => `${weekday(d)}, ${c.dateLabel(d)}`;
const range = (b) => `${c.timeLabel(b.starts_at)}—${c.timeLabel(b.ends_at)}`;
export const badge = (status) => `<span class="badge badge--${status}">${c.statusName[status] || c.esc(status)}</span>`;
const ACTIVE = ["pending", "confirmed", "invoiced", "completed", "cancel_requested", "no_show"];

// ---------- Расписание: лента дня ----------
let showNight = false;
export const toggleNight = () => { showNight = !showNight; };
export function scheduleTimeline(a, s, date, city) {
  const { esc, resourceCity } = c;
  const places = a.resources.filter((r) => resourceCity(r) === city && r.active);
  const dayStart = new Date(`${date}T00:00:00+03:00`), dayEnd = new Date(dayStart.getTime() + 86400000);
  const day = a.bookings.filter((b) => places.some((r) => r.id === b.resource_id) && ACTIVE.includes(b.status) && new Date(b.starts_at) < dayEnd && new Date(b.ends_at) > dayStart);
  // Видимые часы: рабочее время студии; если студия круглосуточная — ночь свёрнута, пока в ней нет записей.
  let from = s.openHour, to = s.closeHour;
  if (!showNight && from === 0 && to === 24) {
    from = 8;
    for (const b of day) if (mskDay(b.starts_at) === date) from = Math.min(from, mskHour(b.starts_at));
  }
  const hours = to - from, cols = places.length;
  if (!cols) return `<div class="empty">В этом городе пока нет рабочих мест. Добавьте их в «Студия → Рабочие места».</div>`;
  const row = (h) => h - from + 2;
  const startOf = (b) => (mskDay(b.starts_at) < date ? from : Math.max(from, mskHour(b.starts_at)));
  const endOf = (b) => (mskDay(b.ends_at) > date ? to : Math.min(to, mskHour(b.ends_at) + (mskMinute(b.ends_at) ? 1 : 0)));
  const busy = (rid, h) => day.some((b) => b.resource_id === rid && startOf(b) <= h && endOf(b) > h);
  const closed = (rid, h) => a.blocks.some((k) => (!k.resource_id || k.resource_id === rid) && new Date(k.starts_at) <= new Date(`${date}T${String(h).padStart(2, "0")}:00:00+03:00`) && new Date(k.ends_at) > new Date(`${date}T${String(h).padStart(2, "0")}:00:00+03:00`));
  const now = Date.now();
  let cells = "";
  for (let h = from; h < to; h++) {
    cells += `<div class="tl-hour" style="grid-row:${row(h)}">${String(h % 24).padStart(2, "0")}:00</div>`;
    places.forEach((r, i) => {
      const at = new Date(`${date}T${String(h).padStart(2, "0")}:00:00+03:00`).getTime();
      const isClosed = closed(r.id, h), past = at + 3600000 <= now;
      cells += isClosed ? `<div class="tl-cell is-closed" style="grid-row:${row(h)};grid-column:${i + 2}">закрыто</div>`
        : busy(r.id, h) || past ? `<div class="tl-cell${past ? " is-past" : ""}" style="grid-row:${row(h)};grid-column:${i + 2}"></div>`
        : `<div class="tl-cell tl-free" role="button" tabindex="0" style="grid-row:${row(h)};grid-column:${i + 2}" data-slot="${r.id}|${h}" data-col="${i + 2}" data-row="${row(h)}" data-drop="${r.id}|${h}" aria-label="Выбрать: ${esc(r.name)}, ${h}:00"></div>`;
    });
  }
  const blocks = day.map((b) => {
    const i = places.findIndex((r) => r.id === b.resource_id), st = startOf(b), en = Math.max(st + 1, endOf(b));
    if (en <= from || st >= to) return "";
    const movable = ["pending", "confirmed"].includes(b.status) && new Date(b.starts_at) > now;
    return `<div class="tl-booking tl-booking--${b.status}" role="button" tabindex="0" style="grid-row:${row(st)} / ${row(en)};grid-column:${i + 2}" data-booking-open="${b.id}" ${movable ? `draggable="true" data-move-booking="${b.id}"` : ""} title="${esc(b.user_name)} · ${range(b)}"><b>${esc(b.user_name)}</b><small>${range(b)} · ${b.tariff} ч</small>${badge(b.status)}</div>`;
  }).join("");
  let line = "";
  if (date === mskDay(now)) {
    const h = mskHour(now);
    if (h >= from && h < to) line = `<div class="tl-now" style="grid-row:${row(h)};--m:${mskMinute(now) / 60}" aria-hidden="true"></div>`;
  }
  return `<div class="tl-scroll"><div class="tl-grid" style="--cols:${cols};grid-template-rows:auto repeat(${hours},var(--tl-row))"><div class="tl-head tl-corner">МСК</div>${places.map((r, i) => `<div class="tl-head" style="grid-column:${i + 2}"><span>${esc(r.name)}</span><button type="button" class="tl-head__edit" data-edit-resource="${r.id}" aria-label="Изменить место ${esc(r.name)}">⋯</button></div>`).join("")}${cells}${blocks}${line}</div></div>`;
}

export const nightToggle = (s) => s.openHour === 0 && s.closeHour === 24 ? `<button type="button" class="pro-chip" id="tl-night" aria-pressed="${showNight}">${showNight ? "Скрыть ночь" : "Показать ночь 00–08"}</button>` : "";

// Выделение ячеек мышью (или касаниями) в одном месте → кнопки «+ Запись» и «Закрыть время».
let current = null, globalBound = false;
export function mountTimeline({ onBook, onClose }) {
  const grid = $(".tl-grid");
  if (!grid) return;
  let sel = null, dragging = false;
  const cells = (col) => $$(`.tl-free[data-col="${col}"]`, grid);
  const clear = () => { $$(".tl-free.is-selected", grid).forEach((x) => x.classList.remove("is-selected")); $(".tl-select", grid)?.remove(); sel = null; };
  const paint = () => {
    $$(".tl-free.is-selected", grid).forEach((x) => x.classList.remove("is-selected"));
    $(".tl-select", grid)?.remove();
    if (!sel) return;
    const [a, b] = [Math.min(sel.from, sel.to), Math.max(sel.from, sel.to)];
    const list = cells(sel.col).filter((x) => +x.dataset.row >= a && +x.dataset.row <= b);
    // Только непрерывный свободный промежуток: занятая ячейка обрывает выделение.
    const rows = list.map((x) => +x.dataset.row);
    let end = a; while (rows.includes(end + 1) && end + 1 <= b) end++;
    const ok = list.filter((x) => +x.dataset.row <= end);
    ok.forEach((x) => x.classList.add("is-selected"));
    sel.start = a; sel.end = end;
    const first = ok[0], last = ok[ok.length - 1];
    sel.resource = first.dataset.slot.split("|")[0];
    sel.hour = Number(first.dataset.slot.split("|")[1]);
    sel.hours = ok.length;
    const box = document.createElement("div");
    box.className = "tl-select";
    box.style.gridColumn = sel.col; box.style.gridRow = `${a} / ${end + 1}`;
    box.innerHTML = `<button type="button" class="chrome pro-primary" data-sel="book">+ Запись</button><button type="button" class="chrome pro-primary" data-sel="close">Закрыть время</button>`;
    grid.append(box);
    box.querySelector('[data-sel="book"]').onclick = () => { const x = { ...sel }; clear(); onBook({ resourceId: x.resource, hour: x.hour, hours: x.hours }); };
    box.querySelector('[data-sel="close"]').onclick = () => { const x = { ...sel }; clear(); onClose({ resourceId: x.resource, hour: x.hour, hours: x.hours }); };
    void last;
  };
  grid.addEventListener("pointerdown", (e) => {
    const cell = e.target.closest(".tl-free");
    if (!cell || e.button > 0) return;
    const col = cell.dataset.col, row = +cell.dataset.row;
    // Касание: второе нажатие в том же месте продлевает выделение.
    if (e.pointerType !== "mouse" && sel && sel.col === col) { sel.to = row; paint(); return; }
    e.preventDefault();
    sel = { col, from: row, to: row }; dragging = e.pointerType === "mouse"; paint();
  });
  grid.addEventListener("pointerover", (e) => {
    if (!dragging || !sel) return;
    const cell = e.target.closest(".tl-free");
    if (cell && cell.dataset.col === sel.col) { sel.to = +cell.dataset.row; paint(); }
  });
  current = { stop: () => { dragging = false; }, outside: (e) => { if (sel && !e.target.closest(".tl-grid")) clear(); } };
  grid.addEventListener("keydown", (e) => {
    const cell = e.target.closest(".tl-free");
    if (cell && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); sel = { col: cell.dataset.col, from: +cell.dataset.row, to: +cell.dataset.row }; paint(); $(".tl-select button", grid)?.focus(); }
    if (e.key === "Escape") clear();
  });
  if (!globalBound) { globalBound = true; addEventListener("pointerup", () => current?.stop()); document.addEventListener("pointerdown", (e) => current?.outside(e)); }
}

// ---------- Панель брони ----------
export function bookingPanel(id) {
  const { esc, money, api, modal, notify, dialogForm, select, field, CITY_LABELS, resourceCity } = c;
  const a = c.state().adminData, b = a.bookings.find((x) => x.id === id);
  if (!b) return notify("Бронь не найдена. Обновите страницу.");
  const r = a.resources.find((x) => x.id === b.resource_id), pays = a.payments.filter((p) => p.booking_id === b.id);
  const started = new Date(b.starts_at) <= Date.now(), future = !started;
  const finalPay = pays.find((p) => p.kind === "final" && p.status === "pending");
  const act = (key, label, primary) => `<button type="button" class="${primary ? "chrome pro-primary" : "chrome"}" data-panel-act="${key}">${label}</button>`;
  const actions = [
    b.status === "confirmed" && started && act("invoice", "Выставить итоговый счёт", true),
    b.status === "invoiced" && finalPay && b.policy?.paymentMethod === "cash" && act("cash", "Наличные получены", true),
    b.status === "cancel_requested" && act("resolve", "Решить отмену", true),
    ["pending", "confirmed"].includes(b.status) && future && act("move", "Перенести"),
    b.status === "confirmed" && started && act("noshow", "Неявка"),
    ["pending", "confirmed"].includes(b.status) && future && act("cancel", "Отменить бронь"),
  ].filter(Boolean).join("");
  modal(`<div class="pro-panel"><p class="pro-panel__eyebrow">Бронь № ${b.session_no || b.id.slice(0, 6)} · ${badge(b.status)}</p><h2>${fullDate(b.starts_at)}<br><span>${range(b)} · до ${b.tariff} ч</span></h2>
  <dl class="pro-panel__facts"><div><dt>Мастер</dt><dd><button type="button" class="pro-link" data-user-card="${b.user_id}">${esc(b.user_name)}</button></dd></div><div><dt>Место</dt><dd>${esc(CITY_LABELS[resourceCity(r)] || "")} · ${esc(b.resource_name)}</dd></div><div><dt>Стоимость</dt><dd>${money(b.total)}${b.policy?.pricePercent ? ` <small class="muted">(${b.policy.pricePercent > 0 ? "+" : ""}${b.policy.pricePercent}% за время)</small>` : ""}${b.policy?.promo ? ` <small class="muted">промокод ${esc(b.policy.promo.code)} −${money(b.policy.promo.discount)}</small>` : ""}</dd></div><div><dt>Предоплата</dt><dd>${b.deposit ? money(b.deposit) : "без предоплаты"}${b.policy?.paymentMethod === "cash" ? " · расчёт наличными" : ""}</dd></div>${b.extras?.length ? `<div><dt>Дополнительно</dt><dd>${b.extras.map((x) => `${esc(x.name || "")} × ${x.qty}`).join(", ")}</dd></div>` : ""}${pays.length ? `<div><dt>Платежи</dt><dd>${pays.map((p) => `${p.kind === "deposit" ? "предоплата" : "итоговый счёт"} ${money(p.amount)} — ${(c.statusName[p.status] || p.status).toLowerCase()}`).join("<br>")}</dd></div>` : ""}</dl>
  ${actions ? `<div class="pro-panel__actions">${actions}</div>` : '<p class="small muted">Действий с этой бронью нет.</p>'}</div>`);
  $("#dialog").classList.add("is-panel");
  $("#dialog").addEventListener("close", () => $("#dialog").classList.remove("is-panel"), { once: true });
  $$("[data-user-card]", $("#dialog")).forEach((x) => (x.onclick = () => { $("#dialog").close(); c.openUserCard(x.dataset.userCard); }));
  const run = {
    invoice: () => dialogForm("Итоговый счёт", `${select("duration", "Тариф после сеанса", [3, 6, 12].filter((h) => h >= b.tariff).map((h) => [h, `До ${h} часов`]), b.tariff)}<p class="small muted">Предоплата ${money(b.deposit)} будет вычтена. Счёт появится в кабинете мастера.</p>`, (d) => api(`/admin/bookings/${b.id}/invoice`, "POST", { duration: Number(d.duration) })),
    cash: () => dialogForm("Наличные получены", "<p>Отметьте оплату только после получения наличных. Запись закроется как оплаченная.</p>", () => api(`/admin/payments/${finalPay.id}/cash`, "POST", {})),
    resolve: () => dialogForm("Решение по отмене", select("credit", "Предоплата", [["yes", "Вернуть на внутренний баланс"], ["no", "Удержать по регламенту"]], "yes"), (d) => api(`/admin/bookings/${b.id}/resolve-cancel`, "POST", { credit: d.credit === "yes" })),
    move: () => dialogForm("Перенести запись", `${field("date", "Новая дата", mskDay(b.starts_at), "date", "required")}${select("hour", "Начало, МСК", Array.from({ length: 24 }, (_, h) => [h, String(h).padStart(2, "0") + ":00"]), mskHour(b.starts_at))}${select("resourceId", "Место", a.resources.filter((x) => x.active).map((x) => [x.id, CITY_LABELS[resourceCity(x)] + " · " + x.name]), b.resource_id)}<p class="small muted">Мастер получит уведомление. Тариф и оплата сохраняются.</p>`, (d) => api(`/admin/bookings/${b.id}/move`, "POST", { ...d, hour: Number(d.hour) })),
    noshow: () => dialogForm("Отметить неявку", "<p>Мастер не пришёл. Предоплата остаётся у студии, запись закроется.</p>", () => api(`/admin/bookings/${b.id}/no-show`, "POST", {})),
    cancel: () => dialogForm("Отменить бронь", "<p>Бронь будет отменена по правилам студии: при ранней отмене предоплата вернётся мастеру на баланс, при поздней — по регламенту.</p>", () => api(`/bookings/${b.id}/cancel`, "POST", {})),
  };
  $$("[data-panel-act]").forEach((x) => (x.onclick = () => { $("#dialog").classList.remove("is-panel"); run[x.dataset.panelAct](); }));
}

// ---------- Цены и промокоды ----------
export function pricingHTML(a, s, city) {
  const { field, select, cityRatesOf, roleName, cityTabs } = c, pr = s.priceRules || {}, rates = cityRatesOf(city, s);
  const hours = (name, label, value) => select(name, label, Array.from({ length: 24 }, (_, h) => [h, String(h).padStart(2, "0") + ":00"]), value);
  return `<form id="pricing-form" class="pro-form"><fieldset class="admin-group"><legend>Тарифы аренды</legend><p class="small muted">Новые цены действуют для новых броней. У каждого города свои тарифы.</p>${cityTabs()}<div class="form-grid">${["resident", "guest"].map((r) => [3, 6, 12].map((h) => field(`${r}_${h}`, `${roleName[r]} · до ${h} ч`, rates[r][h] / 100, "number", 'required min="0" step="1"')).join("")).join("")}</div></fieldset>
  <fieldset class="admin-group"><legend>Предоплата</legend><div class="form-grid">${field("deposit", "Предоплата, ₽", s.deposit / 100, "number", 'min="0"')}</div><p class="small muted">Общая для всех городов. Резидентам без предоплаты и мастерам с отметкой «полная предоплата» она считается отдельно.</p></fieldset>
  <fieldset class="admin-group"><legend>Наценки по времени</legend><div class="form-grid">${field("nightPercent", "Ночью, %", pr.nightPercent ?? 0, "number", 'min="-90" max="300" step="1" data-plain-number="true"')}${hours("nightFrom", "Ночь с", pr.nightFrom ?? 22)}${hours("nightTo", "Ночь до", pr.nightTo ?? 8)}${field("weekendPercent", "В выходные, %", pr.weekendPercent ?? 0, "number", 'min="-90" max="300" step="1" data-plain-number="true"')}</div><p class="small muted">Минус — скидка. Мастер видит наценку на кнопке времени при записи.</p></fieldset>
  <button type="submit" class="chrome pro-primary">Сохранить цены</button></form>${c.promosHTML(a)}`;
}
export function mountPricing(city) {
  c.onForm("#pricing-form", async (d) => {
    const rates = { resident: {}, guest: {} };
    for (const r of ["resident", "guest"]) for (const h of [3, 6, 12]) rates[r][h] = Math.round(Number(d[`${r}_${h}`]) * 100);
    await c.api("/admin/settings", "PATCH", {
      deposit: Math.round(Number(d.deposit) * 100),
      ...(city === "spb" ? { rates } : { cities: { [city]: { rates } } }),
      priceRules: { nightPercent: Number(d.nightPercent) || 0, nightFrom: Number(d.nightFrom), nightTo: Number(d.nightTo), weekendPercent: Number(d.weekendPercent) || 0 },
    });
    dirty = false;
    await c.refresh(); await c.render(); c.notify("Цены сохранены");
  });
}

// ---------- Несохранённые изменения ----------
let dirty = false;
export const isDirty = () => dirty;
export function guardForms() {
  dirty = false;
  const forms = $$("#settings-form, #pricing-form");
  if (!forms.length) return;
  const bar = document.createElement("div");
  bar.className = "pro-savebar"; bar.hidden = true;
  bar.innerHTML = `<span>Есть несохранённые изменения</span><button type="button" class="chrome" data-save-cancel>Отменить</button><button type="button" class="chrome pro-primary" data-save-now>Сохранить</button>`;
  $(".admin-content")?.append(bar);
  forms.forEach((f) => f.addEventListener("input", () => { dirty = true; bar.hidden = false; }));
  bar.querySelector("[data-save-cancel]").onclick = () => { dirty = false; c.render(); };
  bar.querySelector("[data-save-now]").onclick = () => forms[0].requestSubmit();
}
export const confirmLeave = () => !dirty || confirm("Есть несохранённые изменения. Уйти без сохранения?");
addEventListener("beforeunload", (e) => { if (dirty) e.preventDefault(); });

// ---------- Поиск по всему (Ctrl+K) и горячие клавиши ----------
export function openSearch() {
  const a = c.state().adminData;
  if (!a) return;
  const { esc, money, modal } = c;
  modal(`<div class="pro-search"><label class="field"><span>Поиск по админке</span><input type="search" id="pro-search-input" placeholder="Имя, почта, дата, номер платежа, промокод…" autocomplete="off"></label><ul class="pro-search__results" id="pro-search-results"></ul><p class="small muted">Ctrl+K — открыть поиск · N — новая запись · ← → — день в расписании</p></div>`);
  const input = $("#pro-search-input"), out = $("#pro-search-results");
  const items = [
    ...a.users.map((u) => ({ kind: "Пользователь", text: `${u.name} ${u.email}`, label: `${esc(u.name)} <small>${esc(u.email)}</small>`, open: () => c.openUserCard(u.id) })),
    ...a.bookings.map((b) => ({ kind: "Бронь", text: `${b.user_name} ${c.dateLabel(b.starts_at)} ${b.resource_name} ${b.session_no || ""}`, label: `${esc(b.user_name)} <small>${fullDate(b.starts_at)} · ${range(b)} · ${esc(b.resource_name)}</small>`, open: () => bookingPanel(b.id) })),
    ...a.payments.map((p) => ({ kind: "Платёж", text: `${p.id} ${money(p.amount)}`, label: `№ ${p.id.slice(0, 8)} <small>${money(p.amount)} · ${c.statusName[p.status] || p.status}</small>`, open: () => { const b = a.bookings.find((x) => x.id === p.booking_id); if (b) bookingPanel(b.id); } })),
    ...(a.promos || []).map((p) => ({ kind: "Промокод", text: p.code, label: esc(p.code), open: () => c.goTab("pricing") })),
  ];
  const draw = () => {
    const q = input.value.trim().toLocaleLowerCase("ru");
    const found = q ? items.filter((x) => x.text.toLocaleLowerCase("ru").includes(q)).slice(0, 12) : [];
    out.innerHTML = found.length ? found.map((x, i) => `<li><button type="button" data-hit="${i}"><span class="pro-search__kind">${x.kind}</span>${x.label}</button></li>`).join("") : q ? '<li class="muted small">Ничего не найдено</li>' : "";
    $$("[data-hit]", out).forEach((btn) => (btn.onclick = () => { $("#dialog").close(); setTimeout(() => found[btn.dataset.hit].open(), 0); }));
  };
  input.oninput = draw;
  input.onkeydown = (e) => { if (e.key === "Enter") $("[data-hit]", out)?.click(); if (e.key === "ArrowDown") { e.preventDefault(); $("[data-hit]", out)?.focus(); } };
  input.focus();
}
let keysBound = false;
export function bindKeys() {
  if (keysBound) return;
  keysBound = true;
  addEventListener("keydown", (e) => {
    if (location.hash !== "#/admin" || !c.state().adminData) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); return; }
    if ($("#dialog")?.open || e.target.closest("input,textarea,select,[contenteditable]") || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "/") { e.preventDefault(); openSearch(); }
    else if (e.key.toLowerCase() === "n" || e.key.toLowerCase() === "т") ($("#manual-booking") ? $("#manual-booking").click() : c.openManual?.());
    else if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && $(".tl-grid")) c.shiftDay?.(e.key === "ArrowLeft" ? -1 : 1);
  });
}

// ---------- Списки с поиском в выпадающих списках диалогов ----------
export function enhanceSelects(root = document) {
  $$("select", root).forEach((sel) => {
    if (sel.options.length < 8 || sel.dataset.searchable) return;
    sel.dataset.searchable = "1";
    const input = document.createElement("input");
    input.type = "search"; input.className = "pro-select-search"; input.placeholder = "Найти в списке…";
    input.setAttribute("aria-label", "Поиск в списке");
    sel.before(input);
    const all = [...sel.options].map((o) => [o.value, o.text]);
    input.oninput = () => {
      const q = input.value.trim().toLocaleLowerCase("ru"), keep = sel.value;
      sel.innerHTML = all.filter(([, t]) => !q || t.toLocaleLowerCase("ru").includes(q)).map(([v, t]) => `<option value="${c.esc(v)}">${c.esc(t)}</option>`).join("");
      if ([...sel.options].some((o) => o.value === keep)) sel.value = keep;
    };
  });
}

// ---------- Нижняя навигация на телефоне ----------
const ICONS = { home: "M3 11 12 4l9 7v9H3z", schedule: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4", users: "M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8 1a3 3 0 1 0 0-6M2 21c0-4 3-6 6-6s6 2 6 6m2-6c3 0 6 2 6 6", finance: "M3 6h18v12H3zM3 10h18M7 15h3", workspaces: "M4 20V8l8-4 8 4v12M9 20v-6h6v6" };
export function bottomNav(groups, current) {
  let nav = $("#adminBottomNav");
  if (!nav) { nav = document.createElement("nav"); nav.id = "adminBottomNav"; nav.className = "pro-bottomnav"; nav.setAttribute("aria-label", "Разделы админ-панели"); document.body.append(nav); }
  nav.innerHTML = groups.map((g) => `<button type="button" data-admintab="${g.target}" ${g.tabs.includes(current) ? 'aria-current="page"' : ""}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[g.icon] || ICONS.home}"/></svg><span>${g.label}</span></button>`).join("");
}
