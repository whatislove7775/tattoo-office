import {bindFileUpload} from "./file-upload.js";
import {mountGallery} from "./profile-media.js";
import * as AP from "./admin-pro.js";
import * as UX from "./admin-ux.js";
const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const managerLink = (label = "Написать в поддержку") => `<a href="https://t.me/artasimnsupport" target="_blank" rel="noopener noreferrer">${label}</a>`;
const money = (n) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format((n || 0) / 100);
const dateLabel = (d) =>
  new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Moscow",
  }).format(new Date(d));
const timeLabel = (d) =>
  new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Moscow",
  }).format(new Date(d));
const bookingTimeRange = (hour, duration) =>
  `${String(hour).padStart(2, "0")}:00—${String((hour + duration) % 24).padStart(2, "0")}:00${hour + duration >= 24 ? " (следующий день)" : ""}`;
const today = () =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Moscow" }).format(
    new Date(),
  );
const addDate = (d, n) =>
  new Date(new Date(d + "T12:00:00Z").getTime() + n * 86400000)
    .toISOString()
    .slice(0, 10);
const roleName = {
  resident: "Резидент Private Club",
  guest: "Мастер",
  admin: "Управление сайтом",
};
const statusName = {
  pending: "Ожидает предоплаты",
  confirmed: "Подтверждено",
  invoiced: "Выставлен счёт",
  completed: "Завершено",
  cancelled: "Отменено",
  expired: "Резерв истёк",
  cancel_requested: "Отмена на рассмотрении",
  paid: "Оплачено",
  new: "Новое",
  done: "Обработано",
  in_progress: "В работе",
  no_show: "Неявка",
};
let me = null,
  pub = null,
  routeVersion = 0,
  adminTab = "home",
  cabTab = "bookings";
let draft = {
  city: null,
  step: 0,
  date: addDate(today(), 1),
  duration: 3,
  hour: null,
  resourceId: null,
  extras: [],
};
// Студии по городам: названия, статус «открыта для записи», тарифы.
const CITY_IDS = ["spb", "msk"],
  CITY_LABELS = { spb: "Санкт-Петербург", msk: "Москва" };
const cityInfo = (id) => pub.settings.cities?.[id] || { open: id === "spb", address: id === "spb" ? pub.settings.address : "" };
const cityRatesOf = (id, s = pub.settings) => (id && id !== "spb" && s.cities?.[id]?.rates) || s.rates;
const roleRates = () => cityRatesOf(draft.city)[me?.role === "resident" ? "resident" : "guest"];
const resourceCity = (r) => r?.city || "spb";
let adminCity = "spb";
let month = draft.date.slice(0, 7),
  availability = null,
  bookingResult = null;
const storage = {
  get: (k, f) => {
    try {
      return JSON.parse(localStorage.getItem("office." + k)) ?? f;
    } catch {
      return f;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem("office." + k, JSON.stringify(v));
    } catch {}
  },
};
let noticeTimer;
function notify(s) {
  $("#notice").textContent = s;
  $("#notice").hidden = false;
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => ($("#notice").hidden = true), 6000);
}
const API_BASE = window.OFFICE_API_BASE || "/api", DEMO = API_BASE !== "/api";
// Тестовый режим: журнал своих изменений хранится в браузере, чтобы любая копия
// тестового сервера (новая или перезапущенная) повторила их и ничего не потерялось.
const demoJournal = {
  read() { try { return JSON.parse(localStorage.getItem("to.demoJournal") || "[]"); } catch { return []; } },
  write(list) { try { localStorage.setItem("to.demoJournal", JSON.stringify(list.slice(-300))); } catch {} },
  replaying: null,
};
const demoHeaders = () => { const list = demoJournal.read(); return list.length ? { "X-Demo-Count": String(list.length), "X-Demo-Last": list[list.length - 1].id } : {}; };
async function demoReplay() {
  demoJournal.replaying ||= fetch(API_BASE + "/__demo/replay", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ journal: demoJournal.read() }) }).finally(() => { demoJournal.replaying = null; });
  await demoJournal.replaying;
}
async function api(path, method = "GET", body, retried) {
  const journaled = DEMO && method !== "GET" && !/^\/(auth|__demo)\//.test(path) && JSON.stringify(body || {}).length < 200000;
  const entry = journaled ? (crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2, 10)) : null;
  const r = await fetch(API_BASE + path, {
    method,
    credentials: "same-origin",
    headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(DEMO ? demoHeaders() : {}), ...(entry ? { "X-Demo-Entry": entry } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (DEMO && r.status === 428 && retried !== "journal") { await demoReplay(); return api(path, method, body, "journal"); }
  // Тестовый режим: если запрос попал в только что запущенную копию сервера, повторяем его один раз.
  if (DEMO && !retried && method === "GET" && [401, 403].includes(r.status)) { await new Promise((ok) => setTimeout(ok, 300)); return api(path, method, body, true); }
  const data = await r.json();
  if (!r.ok) throw Error(data.error || "Ошибка сервера");
  if (entry && r.headers.get("X-Demo-Actor")) { const list = demoJournal.read(); list.push({ id: entry, m: method, p: path, b: body, a: r.headers.get("X-Demo-Actor") }); demoJournal.write(list); }
  return data;
}
function go(path) {
  if (location.hash === "#/" + path) {
    if ($("#office-view")) render();
    else window.TO?.go(location.hash);
  } else location.hash = "#/" + path;
}
// Keep one return destination while switching between legal documents.
let legalReturnRoute = "#/masters";
try {
  const saved = sessionStorage.getItem("to.legalReturnRoute");
  if (saved?.startsWith("#/") && !saved.startsWith("#/legal/")) legalReturnRoute = saved;
} catch {}
let previousSiteRoute = location.hash || "#/masters";
window.addEventListener("hashchange", () => {
  const next = location.hash || "#/masters";
  if (next.startsWith("#/legal/") && !previousSiteRoute.startsWith("#/legal/")) {
    legalReturnRoute = previousSiteRoute;
    try { sessionStorage.setItem("to.legalReturnRoute", legalReturnRoute); } catch {}
  }
  previousSiteRoute = next;
});
function head(title, back = "") {
  const heading = title === "Tattoo Office Private Club" ? '<span class="club-heading-label">Tattoo Office Private Club</span><span class="club-heading-help"></span>' : esc(title);
  return `<div class="window-head"><img src="assets/pin-active.png" alt=""><h1>${heading}</h1>${back ? `<a class="back" href="#/${esc(back)}">← Назад</a>` : ""}</div>`;
}
function icon(name) {
  const paths = {gift:'M20 12v8H4v-8M2 7h20v5H2zM12 7v13M12 7H7.5A2.5 2.5 0 1 1 10 4.5L12 7zm0 0h4.5A2.5 2.5 0 1 0 14 4.5L12 7z',receipt:'M5 3v18l3-2 4 2 4-2 3 2V3l-3 2-4-2-4 2-3-2zM9 9h6M9 13h6'};
  return `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || ''}"/></svg>`;
}
function catalogHelp(item) {
  const descriptions = {
    "Защитная плёнка": "Защитная плёнка для сеанса. Добавьте нужное количество в штуках.",
    "Набор расходников": "Комплект расходных материалов для сеанса. Состав набора уточните у администратора.",
    "Сборка места": "Помощь с подготовкой рабочего места перед сеансом.",
    "Разборка места": "Помощь с разборкой рабочего места после сеанса.",
  };
  const text = descriptions[item.name] || (item.kind === "service" ? "Дополнительная услуга к аренде рабочего места. Детали уточните у администратора." : "Дополнительный расходный материал для сеанса. Количество указывается в штуках.");
  return `<span data-help data-help-inline data-help-label="${esc(item.name)}">${esc(text)}</span>`;
}
function win(title, body, back = "") {
  return `<section class="window">${head(title, back)}${body}</section>`;
}
function testNote() {
  return "";
}
function field(name, label, value = "", type = "text", extra = "") {
  const monetary = type === "number" && /^(price|deposit|amount|balance|resident_\d+|guest_\d+)$/.test(name);
  return `<label class="field${monetary ? ' field--money' : ''}"><span>${label}</span><input name="${name}" type="${type}" value="${esc(value)}" ${monetary ? 'data-plain-number inputmode="decimal"' : ''} ${extra}>${monetary ? '<span class="field__currency" aria-hidden="true">₽</span>' : ''}</label>`;
}
function textarea(name, label, value = "") {
  return `<label class="field"><span>${label}</span><textarea name="${name}">${esc(value)}</textarea></label>`;
}
function select(name, label, options, value) {
  return `<label class="field"><span>${label}</span><select name="${name}">${options.map(([v, l]) => `<option value="${esc(v)}" ${String(v) === String(value) ? "selected" : ""}>${esc(l)}</option>`).join("")}</select></label>`;
}
function formError(f, e) {
  let el = $(".form-error", f);
  if (!el) {
    el = document.createElement("p");
    el.className = "form-error";
    el.setAttribute("role", "alert");
    f.append(el);
  }
  el.textContent = e.message;
  el.scrollIntoView({ block: "nearest" });
}
function onForm(id, fn) {
  const f = $(id);
  if (!f) return;
  f.onsubmit = async (e) => {
    e.preventDefault();
    const b = $("[type=submit]", f);
    if (b) b.disabled = true;
    try {
      await fn(Object.fromEntries(new FormData(f)), f);
    } catch (error) {
      formError(f, error);
    } finally {
      if (b) b.disabled = false;
    }
  };
}
function modal(html) {
  $("#dialog-content").innerHTML = `<div class="office-feature">${html}</div>`;
  $("#dialog").showModal();
}
$("#dialog").addEventListener("click", (e) => {
  if (e.target === $("#dialog")) $("#dialog").close();
});
async function refresh() {
  if (window.OFFICE_PUBLIC_ONLY) {
    const response = await fetch("public-data.json");
    if (!response.ok) throw new Error("Не удалось загрузить данные сайта");
    pub = await response.json(); me = null; paintShell(); return;
  }
  const [publicData,account,directory]=await Promise.all([api("/public"),api("/me"),api("/directory")]);
  pub=publicData;me=account.user;
  syncMasters();
  window.DATA.masters.splice(0,window.DATA.masters.length,...directory.masters.map(m=>({...m,
    name:{ru:m.name,en:m.name},city:{ru:m.city,en:m.city},exp:{ru:m.exp,en:m.exp},bio:{ru:m.bio,en:m.bio},photo:m.avatar,
    portfolio:m.portfolio.map(w=>({...w,cap:{ru:w.cap||'',en:w.cap||''}})),drafts:m.drafts.map(w=>({...w,cap:{ru:w.cap||'',en:w.cap||''}}))})));
  paintShell();
}
function paintShell() {
  const el = document.getElementById("loginPanel");
  if (!el) return;
  const en = window.I18N?.get() === "en";
  el.classList.toggle("login--user", !!me);
  el.classList.toggle("login--guest", !me);
  el.classList.toggle("login--admin", me?.role === "admin");
  const logoutButton = document.getElementById("menuLogout");
  logoutButton.hidden = !me;
  logoutButton.onclick = async () => {
    logoutButton.disabled = true;
    try { await api("/auth/logout", "POST"); await refresh(); document.body.classList.remove("mobile-menu-open"); document.getElementById("mobileMenuToggle").setAttribute("aria-expanded","false"); go("masters"); }
    catch (error) { notify(error.message); }
    finally { logoutButton.disabled = false; }
  };
  document.body.classList.toggle("admin-session", me?.role === "admin" && location.hash === "#/admin");
  document.getElementById("accountLogoutDock").append(logoutButton);
  el.innerHTML = me
    ? `<div class="who"><span class="office-initial">${esc(me.name.slice(0, 1))}</span><span class="who__text"><span class="who__name" title="${esc(me.name)}"><a class="who__label" href="#/${me.role === "admin" ? "admin" : "cabinet"}">${esc(me.name)}</a>${me.role === "resident" ? '<button type="button" class="resident-info-trigger" aria-label="Резидент Tattoo Office Private Club" aria-haspopup="dialog" aria-controls="resident-info-popover" aria-expanded="false"><img class="resident-mark" src="assets/resident-mark.svg?v=clean-2" width="16" height="16" alt=""></button>' : ""}</span><small title="${esc(me.email)}">${esc(me.email)}</small></span></div>`
    : `<a class="login__master" href="#/login/master">Login as <u>tattoo master</u></a>`;
  if (me) el.querySelector(".who").append(logoutButton);
  if (me?.role === "admin") {
    // Аватар и имя администратора открывают раздел «Профиль»; выход — только иконкой.
    const who = el.querySelector(".who");
    who.classList.add("who--link");
    who.onclick = (e) => {
      if (e.target.closest("#menuLogout")) return;
      e.preventDefault();
      adminTab = "profile";
      document.body.classList.remove("mobile-menu-open");
      if (location.hash === "#/admin") render(); else go("admin");
    };
  }
}
const legacyMasters=window.DATA.masters.slice();
const masters = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: window.I18N.pick(window.DATA.masters[i].name),
  filename: `tattooartist_${String(i + 1).padStart(2, "0")}.png`,
  photo: `assets/masters/master-${i + 1}.png`,
}));
function syncMasters(content = pub?.content || []) {
  const assetNames = works => (works || []).map(work => (typeof work === "string" ? work : work.src || "").split("/").pop().replace(/\.[^.]+$/, ""));
  for (const m of masters) {
    const c = content.find(entry => entry.id === "master-" + m.id)?.data;
    const original = legacyMasters[m.id - 1];
    m.name = c?.title || window.I18N.pick(original.name);
    m.featured = c?.featured !== false;
    m.bookingLink = c?.bookingLink ?? original.bookingLink ?? "";
    m.bio = c?.body || window.I18N.pick(original.bio);
    m.specialty = c?.specialty ?? original.specialty ?? "";
    m.portfolio = c?.portfolio?.length ? c.portfolio.slice() : assetNames(original.portfolio);
    m.drafts = c?.drafts?.length ? c.drafts.slice() : assetNames(original.drafts);
  }
}
const positions = [
  [18, 7],
  [36, 36],
  [2, 90],
  [59, 32],
  [77, 14],
  [100, 0],
  [98, 55],
  [23, 100],
  [49, 84],
  [82, 100],
];
function mastersPage() {
  const saved = storage.get("favorites", []),
    layout = storage.get("layout", "desk");
  return `<section class="desktop"><div class="desktop-toolbar"><span>Наши люди / <span id="master-count">10</span></span><span class="spacer"></span><input id="search" aria-label="Найти мастера" placeholder="найти в офисе…"><button id="favorites">☆ избранное (${saved.length})</button><button id="layout">${layout === "list" ? "рабочий стол" : "списком"}</button><button id="reset-layout" title="Вернуть расположение фотографий">↺</button></div><div class="desktop-board ${layout === "list" ? "list" : ""}" id="board">${masters.map((m, i) => `<button class="portrait" data-id="${m.id}" style="--x:${positions[i][0]}%;--y:${positions[i][1]}%;z-index:${i + 1}" aria-label="Открыть: ${m.name}"><img src="${m.photo}" alt="Портрет мастера ${m.id}" draggable="false"><span class="portrait-meta">открыть личное дело ↗</span><span class="filename">${m.filename}${saved.includes(m.id) ? " ☆" : ""}</span></button>`).join("")}</div><div class="desktop-bottom"><span>10 личных дел. У каждого — свой почерк.</span><span>фотографии можно переставлять ↔</span></div></section>`;
}
function mountMasters() {
  let favOnly = false;
  const board = $("#board");
  const filter = () => {
    const q = $("#search").value.toLowerCase(),
      saved = storage.get("favorites", []);
    $$(".portrait").forEach(
      (el, i) =>
        (el.hidden =
          !(
            masters[i].filename.includes(q) ||
            masters[i].name.toLowerCase().includes(q)
          ) ||
          (favOnly && !saved.includes(i + 1))),
    );
    $("#master-count").textContent = $$(".portrait").filter(
      (x) => !x.hidden,
    ).length;
  };
  $("#search").oninput = filter;
  $("#favorites").onclick = () => {
    favOnly = !favOnly;
    $("#favorites").textContent = (favOnly ? "★" : "☆") + " избранное";
    filter();
  };
  $("#layout").onclick = () => {
    storage.set("layout", board.classList.contains("list") ? "desk" : "list");
    render();
  };
  $("#reset-layout").onclick = () => {
    storage.set("positions", {});
    render();
  };
  const saved = storage.get("positions", {});
  let z = 20;
  $$(".portrait").forEach((el, i) => {
    let moved = false,
      start = null;
    if (innerWidth > 760 && !board.classList.contains("list")) {
      el.style.left =
        (positions[i][0] / 100) * (board.clientWidth - el.clientWidth) + "px";
      el.style.top =
        (positions[i][1] / 100) * (board.clientHeight - el.clientHeight) + "px";
    }
    if (saved[el.dataset.id]) {
      el.style.left = saved[el.dataset.id].x + "%";
      el.style.top = saved[el.dataset.id].y + "%";
    }
    el.onclick = () => {
      if (!moved) go("master/" + el.dataset.id);
    };
    el.onpointerdown = (e) => {
      moved = false;
      if (
        window.isMobileLayout() ||
        e.pointerType !== "mouse" ||
        board.classList.contains("list") ||
        e.button !== 0
      )
        return;
      start = {
        x: e.clientX,
        y: e.clientY,
        left: el.offsetLeft,
        top: el.offsetTop,
      };
      el.setPointerCapture(e.pointerId);
      el.style.zIndex = ++z;
    };
    el.onpointermove = (e) => {
      if (!start) return;
      const dx = e.clientX - start.x,
        dy = e.clientY - start.y;
      if (Math.hypot(dx, dy) > 6) moved = true;
      if (moved) {
        el.style.left =
          Math.max(
            0,
            Math.min(board.clientWidth - el.offsetWidth, start.left + dx),
          ) + "px";
        el.style.top =
          Math.max(
            0,
            Math.min(board.clientHeight - el.offsetHeight, start.top + dy),
          ) + "px";
      }
    };
    el.onpointerup = () => {
      if (start && moved) {
        saved[el.dataset.id] = {
          x: (el.offsetLeft / board.clientWidth) * 100,
          y: (el.offsetTop / board.clientHeight) * 100,
        };
        storage.set("positions", saved);
      }
      start = null;
    };
    el.onpointercancel = () => (start = null);
  });
}
function masterPage(id) {
  const m = masters.find((x) => x.id === Number(id));
  if (!m) return win("Личное дело", "Мастер не найден", "masters");
  return win(
    "Masters / " + m.name,
    `${testNote()}<div class="profile-grid"><div><img class="profile-photo" src="${m.photo}" alt="${m.name}"><h2>${m.name}</h2>${m.specialty ? `<p>${esc(m.specialty)}</p>` : ""}<p class="small muted">${m.bio ? esc(m.bio) : "Портрет из архива студии. Имя, стиль и авторство работ предстоит подтвердить."}</p><button class="chrome" id="save-master">${storage.get("favorites", []).includes(m.id) ? "★ в избранном" : "☆ запомнить мастера"}</button><div class="note-paper">Хорошие совпадения начинаются со знакомства.<br><br>${managerLink()}</div></div><div><div class="tabs"><button aria-selected="true" data-gallery="tattoo">📎 portfolio</button><button aria-selected="false" data-gallery="draft">◉ drafts</button></div><p data-help class="small muted">Общий архив работ студии — распределение по авторам ещё не заполнено.</p><div class="gallery" id="gallery"></div></div></div>`,
    "masters",
  );
}
function mountMaster(id) {
  const m = masters.find((x) => x.id === Number(id));
  if (!m) return;
  $("#save-master").onclick = () => {
    let a = storage.get("favorites", []);
    a = a.includes(m.id) ? a.filter((x) => x !== m.id) : [...a, m.id];
    storage.set("favorites", a);
    $("#save-master").textContent = a.includes(m.id)
      ? "★ в избранном"
      : "☆ запомнить мастера";
  };
  function gallery(kind) {
    const own = m[kind === "tattoo" ? "portfolio" : "drafts"];
    $("#gallery").innerHTML = (
      own.length
        ? own
        : Array.from(
            { length: kind === "tattoo" ? 8 : 7 },
            (_, i) => kind + "-" + (i + 1),
          )
    )
      .map(
        (file, i) =>
          `<button data-photo="assets/works/${file}.png"><img src="assets/works/${file}.png" alt="${kind === "tattoo" ? "Работа" : "Эскиз"} ${i + 1}" loading="lazy"><span>${file}.png</span></button>`,
      )
      .join("");
    const photos = $$("[data-photo]").map((b) => ({
      src: b.dataset.photo,
      caption: b.querySelector("span")?.textContent || "Работа",
    }));
    $$("[data-photo]").forEach((b, i) => {
      b.onclick = () => window.PhotoViewer.open(photos, i);
    });
  }
  $$("[data-gallery]").forEach(
    (b) =>
      (b.onclick = () => {
        $$("[data-gallery]").forEach((x) =>
          x.setAttribute("aria-selected", x === b),
        );
        gallery(b.dataset.gallery);
      }),
  );
  gallery("tattoo");
}
// Выбор офиса: Санкт-Петербург работает, Москва пока строится (*soon).
function officePicker() {
  return `<label class="space-picker"><span class="space-picker__label">ОФИС</span><select id="space-picker" aria-label="Выбрать офис"><option value="spb">Санкт-Петербург</option><option value="msk" disabled data-note="*soon">Москва</option></select></label>`;
}
function interiorPage() {
  const configured = pub.content.find((c) => c.id === "interior")?.data;
  const description = configured?.body || "Тихие рабочие места, общая зона для разговоров и пространство для подготовки. Здесь можно провести весь сеанс — от первого эскиза до последней фотографии работы.";
  return win(
    "Interior",
    `<div class="showcase-head"><div><h2>Пространство Tattoo Office</h2><p>${esc(description)}</p></div>${officePicker()}</div>
    <div class="interior-showcase"><section class="model-viewer" aria-label="Интерактивная 3D-модель студии"><canvas id="studio-model" role="img" aria-label="Объёмная модель студии. Горизонтальный жест — поворот. Кнопки плюс и минус — масштаб."></canvas><div class="model-controls"><div><button type="button" data-model-control="left" aria-label="Повернуть влево">‹</button><button type="button" data-model-control="right" aria-label="Повернуть вправо">›</button><button type="button" data-model-control="out" aria-label="Уменьшить">−</button><button type="button" data-model-control="in" aria-label="Увеличить">+</button><button type="button" data-model-control="reset" aria-label="Исходный вид">⟲</button></div></div></section>
    <aside class="interior-dossier"><h3>Свет, воздух и место для работы.</h3><p>Высокие потолки, паркет и дневной свет. Перед сеансом можно спокойно обсудить эскиз; всё необходимое для работы находится рядом.</p><a class="chrome" href="#/booking">Забронировать место →</a></aside></div>
    <div class="photo-ledger"><div class="photo-ledger__head"><h3>Фотографии пространства</h3></div><div class="photo-ledger__grid">${[1,2,3,4].map((i) => `<button type="button" data-interior="${i-1}" aria-label="Открыть фотографию интерьера ${i}"><img src="assets/interior/${i}.jpg" alt="Интерьер студии, вид ${i}" loading="lazy"><span>${["Общая зона","Рабочий кабинет","Студия в работе","Рабочие места"][i-1]}</span></button>`).join("")}</div></div>`,
  );
}
const demoArchive = [
  {id:"demo-flash",data:{title:"Flash day",body:"Один день, готовые эскизы и свободный разговор о том, как идея становится татуировкой. В архиве остаются заметки мастеров и несколько кадров из офиса.",published:true,photo:3,date:"08.2026"}},
  {id:"demo-guest",data:{title:"Гость за рабочим столом",body:"Приглашённый мастер показывает эскизы, рассказывает о своей практике и проводит сеансы в кабинете Tattoo Office.",published:true,photo:2,date:"07.2026"}},
  {id:"demo-open",data:{title:"Открытый вечер в офисе",body:"Встреча без записи: знакомство с пространством, портфолио резидентов и короткие разговоры о будущих проектах.",published:true,photo:1,date:"06.2026"}},
];
function findPage() {
  const s=pub.settings, hasAddress=true, address=s.address||"Санкт-Петербург, ул. Кирочная, 24";
  const hours=s.openHour===0&&s.closeHour===24?"круглосуточно":`${String(s.openHour).padStart(2,"0")}:00—${String(s.closeHour).padStart(2,"0")}:00`;
  const intro=pub.content.find(c=>c.id==="find")?.data?.body||"Маршрут, часы и связь — всё в одной папке. Перед визитом договоритесь о встрече с мастером.";
  return win("How to find",`<div class="find-lead"><div><h2>Увидимся в офисе.</h2><p>${esc(intro)}</p></div>${officePicker()}</div><div class="find-grid"><figure class="location-map"><button class="location-map__open" type="button" id="location-map-open" aria-label="Увеличить карту маршрута"><img src="assets/location-map-v6.svg" alt="Tattoo Office на Кирочной, 24. Пеший маршрут от метро Чернышевская через переход на проспекте Чернышевского. Ориентиры: ВкусВилл, Хлебник и Пятёрочка."></button><figcaption><span class="location-map__legend"><i></i> 1–2 минуты пешком от метро<span data-help data-help-inline data-help-trigger="click" data-help-label="Маршрут от метро">1. Из метро «Чернышевская» выйдите на проспект Чернышевского и идите в сторону Кирочной улицы.

2. У Кирочной перейдите проспект по пешеходному переходу к стороне с «Хлебником».

3. Идите по Кирочной к дому 24. «Пятёрочка» на этой же стороне улицы поможет сориентироваться.

Маршрут показан до дома. Вход и детали встречи уточните у менеджера перед визитом.</span></span><a href="https://yandex.ru/maps/?text=${encodeURIComponent(address)}" target="_blank" rel="noopener noreferrer">Открыть в картах</a></figcaption></figure><div class="find-cards"><article class="find-card"><span class="find-card__number">АДРЕС</span><h3>${esc(address)}</h3><p>${hasAddress?"Проверьте детали входа перед визитом.":"Точный адрес и детали входа скоро появятся здесь."}</p></article><article class="find-card"><span class="find-card__number">ВРЕМЯ</span><h3>${esc(hours)}</h3><p>По предварительной записи. Время московское.</p></article><article class="find-card"><span class="find-card__number">СВЯЗЬ</span><h3>${managerLink()}</h3><p>Вопросы о студии и бронировании.</p></article><div class="find-bottom"><a class="chrome" href="#/interior">Посмотреть пространство ↗</a></div></div></div>`);
}
function archivePage() {
  const actual=pub.content.filter(c=>c.data?.published&&!/^master-/.test(c.id)&&!["interior","find","about"].includes(c.id));
  const posts=actual.length?actual:demoArchive;
  return win("Event Archive",`<div class="archive-intro"><div><h2>События остаются в деле.</h2><p>Встречи, гостевые смены и дни, которые хочется сохранить.</p></div>${actual.length?"":''}</div><div class="archive-grid">${posts.map((c,i)=>`<article class="archive-card"><div class="archive-card__photo"><img src="assets/interior/${c.data.photo||((i%4)+1)}.jpg" alt="Пространство Tattoo Office" loading="lazy"><span>${esc(c.data.date||"OFFICE NOTE")}</span></div><div class="archive-card__body"><h3>${esc(c.data.title)}</h3><p>${esc(c.data.body)}</p></div></article>`).join("")}</div><div class="archive-footer"><span>Архив пополняет команда студии.</span><a href="#/masters">Познакомиться с мастерами →</a></div>`);
}
function safetyPage() {
  const s = pub.settings;
  const icon = (name) => '<svg class="ui-icon" aria-hidden="true"><use href="#ui-' + name + '"></use></svg>';
  return win("Правила студии", `<section class="studio-rules">
    <div class="rules-intro"><h2>Работаем спокойно.<br>Оставляем чисто.</h2><p>Всё, что нужно знать перед сеансом в Tattoo Office.</p></div>
    <div class="rules-layout"><div class="rules-list">
      <article class="rules-row"><span class="rules-symbol">${icon("sun")}</span><div><h3>До сеанса</h3><p>Подготовьте и обработайте рабочее место. Одноразовые расходники открывайте при клиенте.</p></div></article>
      <article class="rules-row"><span class="rules-symbol">${icon("user")}</span><div><h3>Во время работы</h3><p>Уважайте личные границы клиента и работу соседних мастеров. Если планы меняются, предупредите команду заранее.</p></div></article>
      <article class="rules-row"><span class="rules-symbol">${icon("reset")}</span><div><h3>После сеанса</h3><p>Уберите и обработайте место, утилизируйте расходники по правилам студии. Сообщите администратору о завершении работы.</p></div></article>
    </div><aside class="rules-booking"><span class="rules-symbol">${icon("calendar")}</span><h3>Запись и отмена</h3><dl><div><dt>Предоплата</dt><dd>${money(s.deposit)}</dd></div><div><dt>Отмена без потери предоплаты</dt><dd>За ${s.cancelHours} ч</dd></div></dl><p>При своевременной отмене предоплата возвращается на внутренний баланс.</p><p>При отмене менее чем за ${s.cancelHours} ч предоплата ${s.lateCancellation === "review" ? "возвращается только по решению администратора" : "не возвращается на баланс"}.</p><a class="chrome" href="#/booking">Выбрать время →</a></aside></div>
    <p class="manager-contact">Вопросы о студии и бронировании — ${managerLink()}.</p><details class="rules-full"><summary>Полные правила студии<svg class="rules-toggle-icon" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 2v12M2 8h12"/></svg></summary><div class="rules-full__text legal-document">${documentSections(s.rules, [], "h3")}</div></details>
  </section>`);
}

function aboutPage() {
  const body=pub.content.find(c=>c.id==="about")?.data?.body||"Tattoo Office — тату-студия и рабочее пространство для мастеров. У каждого здесь своё дело, а у пространства — общий ритм, порядок и место для новых идей.";
  return win("Tattoo Office",`<div class="brand-story"><div class="brand-story__copy"><h2>Tattoo Office</h2><p>${esc(body)}</p><div class="brand-story__actions">${managerLink()}<a class="chrome" href="#/masters">Познакомиться с мастерами →</a><a class="chrome" href="#/interior">Посмотреть пространство →</a></div></div><img src="assets/interior/3.jpg" alt="Рабочее пространство Tattoo Office"></div><a class="club-teaser" href="#/club"><span><b>The Tattoo Office Private Club</b><small>Клуб постоянных мастеров с особыми условиями аренды.</small></span><span aria-hidden="true">›</span></a>`);
}
function clubPage() {
  const rates = pub.settings.rates;
  const priceRows = [3, 6, 12].map((hours) => `<div class="club-prices__row"><span>${hours === 12 ? "От 6 до 12 часов" : `До ${hours} часов`}</span><s class="club-prices__old">${money(rates.guest[hours])}</s><b>${money(rates.resident[hours])}</b></div>`).join("");
  return win("Tattoo Office Private Club",`<p data-help data-help-for=".club-heading-help" data-help-label="Private Club">Private Club — мастера, которых мы регулярно видим в Tattoo Office. Они выбирают и поддерживают студию, а мы отвечаем взаимностью: специальными ценами, бонусами и привилегиями.

Статус участника присваивает команда студии; если надолго пропасть, его можно потерять.</p><div class="club-offer"><div class="club-offer__prices"><h2>Специальные цены для участников клуба!</h2><div class="club-prices"><div class="club-prices__row club-prices__row--head"><span>Время сеанса</span><b>Обычный тариф</b><b>Private Club</b></div>${priceRows}</div><div class="club-join"><h3>Как попасть?</h3><p>Работать в Tattoo Office.</p><a class="chrome" href="#/signup/master">Начать работать в офисе →</a></div></div><figure class="club-offer__frame"><img class="club-offer__photo" src="assets/club/private-club.jpg" alt="Мастер Tattoo Office Private Club"><figcaption>Tattoo Office Private Club</figcaption></figure></div>`);
}
function authPage(signup) {
  const role = location.hash.split('/')[2] === 'customer' ? 'customer' : 'master';
  if (!signup) {
    const caption = role === 'customer' ? 'Эх грустно как то...<br>Пойду забьюсь' : 'Кажется я обрёл дом...<br>Да что там дом - семью';
    return win(role === 'customer' ? 'Вход / Customer' : 'Вход / Tattoo master', '<form id="auth-form" class="auth-form auth-form--role"><div class="auth-illustration"><div class="auth-photo"><img class="auth-image" src="assets/auth/' + role + '.png" alt="' + (role === 'customer' ? 'Портрет клиента' : 'Собака') + '"></div><p class="auth-caption">' + caption + '</p></div>' + field('email','Почта','','email','required autocomplete="email" placeholder="девственник@mail.ru"') + field('password','Введите пароль','','password','required autocomplete="current-password" placeholder="пароль-пароль***"') + '<div class="auth-switch">' + (role === 'customer' ? '' : '<a href="#/signup/' + role + '">No account — Sign up</a>') + '<a href="#/forgot/' + role + '">Забыли пароль?</a></div><div class="auth-role-actions"><button type="submit" class="chrome">Войти</button>' + (pub.telegramEnabled ? '<a href="/api/auth/telegram">Войти через Telegram</a>' : '') + '</div></form>');
  }
  return win(
    signup ? "Новое личное дело" : "Войти в офис",
    `${testNote()}<form id="auth-form" class="auth-form">${!signup ? '<div class="auth-photo"><img class="auth-image" src="assets/auth/master.png" alt="Кажется, я обрёл дом"></div>' : ""}<h2>${signup ? "Будем знакомы." : "Вы на месте."}</h2><p data-help class="muted small">${role === "customer" ? "Создайте аккаунт клиента, чтобы сохранять свои записи." : "Создайте аккаунт мастера. Условия Private Club команда студии подключит после знакомства."}</p>${signup ? field("name", "Как вас зовут", "", "text", 'required autocomplete="name" maxlength="100"') : ""}${field("email", "Почта для входа и чеков", "", "email", 'required autocomplete="email"')}${field("password", "Пароль", "", "password", `required minlength="12" maxlength="128" autocomplete="${signup ? "new-password" : "current-password"}"`)}${signup ? '<p data-help class="small muted">Не менее 12 символов.</p><label class="check"><input name="rules" type="checkbox" required><span>Я прочитал(а) и принимаю <a href="#/safety" target="_blank">правила студии</a></span></label><label class="check"><input name="consent" type="checkbox" required><span>Я даю <a href="#/legal/data" target="_blank">согласие на обработку персональных данных</a></span></label>' : ""}<button type="submit" class="chrome">${signup ? "Создать личное дело" : "Войти"} →</button><div class="auth-switch"><a href="#/${signup ? "login" : "signup"}/${role}">${signup ? "Уже есть аккаунт? Войти" : "Первый раз? Создать аккаунт"}</a></div>${pub.telegramEnabled ? '<p class="auth-switch"><a href="/api/auth/telegram">Войти через Telegram ↗</a></p>' : '<span class="has-help">Telegram<span data-help data-help-inline>Вход через Telegram появится после подключения бота студии.</span></span>'}</form>`,
  );
}
function recoveryPage(reset) {
  const type = (location.hash.split('/')[2] || 'master').split('?')[0];
  return win(reset ? 'Новый пароль' : 'Восстановление доступа', `<form id="recovery-form" class="auth-form"><h2>${reset ? 'Задайте новый пароль.' : 'Забыли пароль?'}</h2><p data-help class="small muted">${reset ? 'Не менее 12 символов. После смены войдите заново.' : 'Отправим ссылку на почту вашего профиля.'}</p>${reset ? field('password','Новый пароль','','password','required minlength="12" maxlength="128" autocomplete="new-password"') : field('email','Почта','','email','required autocomplete="email"')}<button type="submit" class="chrome">${reset ? 'Сохранить пароль' : 'Получить ссылку'}</button><div class="auth-switch"><a href="#/${type === 'admin' ? 'admin/login' : 'login/' + type}">Назад ко входу</a></div></form>`);
}
function mountRecovery(reset) {
  onForm('#recovery-form', async d => {
    const accountType = (location.hash.split('/')[2] || 'master').split('?')[0];
    await api('/auth/' + (reset ? 'reset-password' : 'forgot-password'), 'POST', {...d, accountType, token: new URLSearchParams(location.hash.split('?')[1]).get('token')});
    if (reset) { await refresh(); go(accountType === 'admin' ? 'admin/login' : 'login/' + accountType); notify('Пароль изменён. Войдите заново.'); }
    else { document.querySelector('#recovery-form').innerHTML='<h2>Проверьте почту.</h2><p>Если такой профиль существует, письмо со ссылкой будет отправлено. Ссылка действует 30 минут.</p>'; }
  });
}
function adminAuthPage() {
  if (me?.role === 'admin') return win('Вход администратора','<div class="auth-form"><h2>Управление студией.</h2><p class="small muted">Вы вошли как администратор.</p><a class="chrome" href="#/admin">Открыть админ-панель →</a></div>');
  return win('Вход администратора', '<form id="admin-auth-form" class="auth-form"><h2>Управление студией.</h2><p data-help class="small muted">Служебный вход для команды Tattoo Office.</p>' + (DEMO ? field('email','Почта (тестовый режим)','owner@demo.tattoo-office','email','required autocomplete="username"') : '') + field('password','Пароль','','password','required autocomplete="current-password"') + '<button type="submit" class="chrome">Войти в админ-панель →</button><div class="auth-switch"><a href="#/forgot/admin">Забыли пароль?</a></div></form>');
}
function mountAdminAuth() {
  onForm('#admin-auth-form', async d=>{
    try { await api('/auth/login','POST',{...d,email:DEMO ? d.email : '89615020777@mail.ru',accountType:'admin'}); }
    catch(error) { if(error.message === 'Email или пароль не совпадают') throw new Error('Пароль не совпадает. Проверьте раскладку и регистр.'); throw error; }
    await refresh();
    if (me?.role !== 'admin') {
      await api('/auth/logout','POST');
      await refresh();
      throw new Error('У этого аккаунта нет доступа администратора.');
    }
    go('admin');
  });
}
function mountAuth(signup) {
  onForm("#auth-form", async (d) => {
    await api("/auth/" + (signup ? "register" : "login"), "POST", {
      ...d,
      accountType: location.hash.split("/")[2] === "customer" ? "customer" : "master",
      rules: d.rules === "on",
      consent: d.consent === "on",
    });
    await refresh();
    notify(
      signup
        ? "Личное дело открыто. Добро пожаловать."
        : "С возвращением в офис.",
    );
    go(storage.get("returnTo", "cabinet"));
    storage.set("returnTo", "cabinet");
  });
}
const bookingDeposit = (total) => me?.loyalty?.freeNext ? 0 : me?.role === "resident" && me.depositWaived ? 0 : me?.profile?.fullPrepay && total ? total : pub.settings.deposit;
// Наценка за ночь или выходные из правил цен (сервер считает так же) и скидка промокода.
let promoInfo = null;
const slotPercent = () => availability?.slots.find((x) => x.hour === draft.hour)?.pricePercent || 0;
const adjustedRate = () => {
  if (me?.loyalty?.freeNext) return 0;
  const base = roleRates()[draft.duration], pct = draft.hour === null ? 0 : slotPercent();
  return Math.max(0, Math.round((base * (100 + pct)) / 100 / 100) * 100);
};
const promoDiscountOf = (rate) => !promoInfo ? 0 : promoInfo.kind === "percent" ? Math.round((rate * Math.min(100, promoInfo.value)) / 100) : Math.min(rate, promoInfo.value);
function receipt() {
  const s = pub.settings,
    rate = adjustedRate() - promoDiscountOf(adjustedRate()),
    extras = draft.extras.reduce(
      (a, x) =>
        a + (pub.catalog.find((c) => c.id === x.id)?.price || 0) * x.qty,
      0,
    ),
    r = pub.resources.find((x) => x.id === draft.resourceId);
  return `<aside class="receipt"><h3>Ваша запись</h3><div class="line"><span>Город</span><span>${esc(CITY_LABELS[draft.city] || "не выбран")}</span></div><div class="line"><span>Дата</span><span>${dateLabel(draft.date + "T12:00:00+03:00")}</span></div><div class="line"><span>Время</span><span>${draft.hour === null ? "не выбрано" : draft.hour + ":00"} / ${draft.duration} ч</span></div><div class="line"><span>Место</span><span>${esc(r?.name || "не выбрано")}</span></div><div class="line"><span>${me?.loyalty?.freeNext ? "20-е посещение · аренда" : "Тариф"}</span><span>${money(rate)}</span></div><div class="line"><span>Дополнительно</span><span>${money(extras)}</span></div><div class="total">${money(rate + extras)}</div><p class="small muted">предварительная стоимость</p><div class="line"><span>Предоплата сейчас</span><b>${money(bookingDeposit(rate + extras))}</b></div><p class="small muted" style="margin-top:15px">${me?.depositWaived ? "Предоплата отключена. Расчёт наличными в студии." : `Из неё с баланса: ${money(Math.min(me?.balance || 0, bookingDeposit(rate + extras)))}. Остаток — после сеанса.`}</p></aside>`;
}
function calendarHTML() {
  const [y, m] = month.split("-").map(Number),
    first = new Date(y, m - 1, 1),
    count = new Date(y, m, 0).getDate(),
    offset = (first.getDay() + 6) % 7;
  return `<div class="calendar-head"><button id="prev-month" aria-label="Предыдущий месяц">‹</button><strong>${new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" }).format(first)}</strong><button id="next-month" aria-label="Следующий месяц">›</button></div><div class="calendar">${["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"].map((x) => `<span class="weekday">${x}</span>`).join("")}${"<span></span>".repeat(offset)}${Array.from(
    { length: count },
    (_, i) => {
      const d = `${month}-${String(i + 1).padStart(2, "0")}`;
      return `<button data-day="${d}" class="${d === draft.date ? "selected" : ""}" ${d < today() || d > addDate(today(), 180) ? "disabled" : ""}>${i + 1}</button>`;
    },
  ).join("")}</div>`;
}
function cityChoicePage() {
  return win(
    "Rent a workspace",
    `<div class="city-choice"><h2>В каком городе Вы хотите арендовать рабочее место?</h2><div class="city-choice__list">${CITY_IDS.map((id) => {
      const open = cityInfo(id).open;
      return `<div class="city-choice__row"><button type="button" class="city-choice__btn" data-city="${id}" ${open ? "" : 'disabled aria-describedby="city-soon-' + id + '"'}>${CITY_LABELS[id]}</button>${open ? "" : `<span class="city-choice__soon" id="city-soon-${id}"><b>*soon</b><small>We are building a new office</small></span>`}</div>`;
    }).join("")}</div></div>`,
  );
}
function bookingPage() {
  if (!draft.city) return cityChoicePage();
  const s = pub.settings,
    steps = ["Дата и тариф", "Время и место", "Всё для сеанса", "Проверка"];
  let body = "";
  if (draft.step === 0)
    body = `<h2>Когда встретимся?</h2><p data-help class="small muted">Выберите день и продолжительность. Время — московское.</p>${calendarHTML()}<div class="choices">${[3, 6, 12].map((h, i) => `<button data-duration="${h}" class="choice ${draft.duration === h ? "selected" : ""}"><span><b>${["Короткий", "Средний", "Большой"][i]}</b><small>до ${h} часов</small></span><em>${money(roleRates()[h])}</em></button>`).join("")}</div>`;
  if (draft.step === 1) {
    const selected = availability?.slots.find((x) => x.hour === draft.hour);
    body = `<h2>У окна или в тишине?</h2><p class="small muted">${dateLabel(draft.date + "T12:00:00+03:00")} · ${draft.duration} ч · работают ${availability?.workingMasters ?? 0} мастеров</p><div class="times">${availability?.slots.length ? availability.slots.map((x) => `<button class="time ${draft.hour === x.hour ? "selected" : ""}" data-hour="${x.hour}" ${x.free.length ? "" : "disabled"}>${x.hour}:00 <span class="muted">· ${x.free.length}</span>${x.pricePercent ? ` <em class="pro-surcharge">${x.pricePercent > 0 ? "+" : "−"}${Math.abs(x.pricePercent)}%</em>` : ""}</button>`).join("") : "<p>На этот день нет доступного времени. Выберите другую дату или более короткий тариф.</p>"}</div>${me && ["resident", "guest"].includes(me.role) && availability?.slots.some((x) => !x.free.length) ? '<p class="pro-waitlist"><button type="button" class="chrome" id="waitlist-join">Нужное время занято? Встать в лист ожидания</button></p>' : ""}<div class="choices">${pub.resources
      .filter((x) => x.active && resourceCity(x) === draft.city)
      .map(
        (r) =>
          `<button class="choice resource-choice ${draft.resourceId === r.id ? "selected" : ""}" data-resource="${r.id}" ${selected?.free.includes(r.id) ? "" : "disabled"}><img class="resource-choice__photo" src="${esc(resourcePhoto(r))}" alt="" loading="lazy"><span><b>${esc(r.name)}</b><small>${!selected ? "Сначала выберите время" : selected.free.includes(r.id) ? "Свободно на весь сеанс" : "Занято"}</small></span><span class="resource-choice__state" aria-hidden="true">${draft.resourceId === r.id ? '<svg class="ui-icon" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6"/></svg>' : ""}</span></button>`,
      )
      .join("")}</div>`;
  }
  if (draft.step === 2)
    body = `<h2>Всё под рукой.</h2><p data-help class="small muted">Добавьте подготовку места и расходники. Оплата — в итоговом счёте.</p>${pub.catalog.map((x) => `<label class="extra"><span><span class="extra__name">${esc(x.name)}${catalogHelp(x)}</span><br><small class="muted">${money(x.price)} ${x.kind === "product" ? `· на складе ${x.stock} шт.` : ""}</small></span>${x.kind === "service" ? `<input type="checkbox" data-extra="${x.id}" ${draft.extras.some((e) => e.id === x.id) ? "checked" : ""}>` : `<input aria-label="Количество: ${esc(x.name)}" type="number" min="0" max="${Math.min(100, x.stock)}" value="${draft.extras.find((e) => e.id === x.id)?.qty || 0}" data-extra="${x.id}">`}</label>`).join("")}`;
  if (draft.step === 3) {
    const base = adjustedRate(), discount = promoDiscountOf(base), rate = base - discount,
      extra = draft.extras.reduce(
        (a, x) => a + pub.catalog.find((c) => c.id === x.id).price * x.qty,
        0,
      );
    body = `<h2>Всё верно?</h2><div class="note-paper booking-review"><h3>${dateLabel(draft.date + "T12:00:00+03:00")} · ${bookingTimeRange(draft.hour, draft.duration)}</h3><p>${esc(CITY_LABELS[draft.city])} · ${esc(pub.resources.find((r) => r.id === draft.resourceId)?.name)}</p><p>До ${draft.duration} часов · ${money(base)}${slotPercent() ? ` <small class="muted">(${slotPercent() > 0 ? "наценка" : "скидка"} ${Math.abs(slotPercent())}% за ночь/выходной)</small>` : ""}</p>${discount ? `<p>Промокод ${esc(promoInfo.code)} · −${money(discount)}</p>` : ""}${draft.extras.map((x) => `<p class="small">${esc(pub.catalog.find((c) => c.id === x.id).name)} × ${x.qty}</p>`).join("")}<div class="booking-review__total"><span>Полная стоимость</span><strong>${money(rate + extra)}</strong></div><div class="booking-review__payment"><span>${me?.profile?.fullPrepay ? "Полная предоплата" : "Предоплата"}</span><strong>${money(bookingDeposit(rate + extra))}</strong></div><p class="booking-review__split"><small>${me?.depositWaived ? "Предоплата отключена. Расчёт наличными в студии." : `С баланса ${money(Math.min(me?.balance || 0, bookingDeposit(rate + extra)))}, картой ${money(Math.max(0, bookingDeposit(rate + extra) - (me?.balance || 0)))}`}</small></p></div>${me && !me.loyalty?.freeNext ? `<form class="pro-promo" id="promo-form"><label class="field"><span>Промокод или сертификат</span><input name="code" value="${esc(promoInfo?.code || "")}" maxlength="32" autocomplete="off"></label><button type="submit" class="chrome">${promoInfo ? "Обновить" : "Применить"}</button>${promoInfo ? '<button type="button" class="chrome" id="promo-clear">Убрать</button>' : ""}</form>` : ""}<p class="small muted">${me?.depositWaived ? `Отмените запись заранее, не менее чем за ${s.cancelHours} ч.` : `При отмене не менее чем за ${s.cancelHours} ч предоплата возвращается на внутренний баланс. При отмене менее чем за ${s.cancelHours} ч предоплата ${s.lateCancellation === "review" ? "возвращается только по решению администратора" : "не возвращается на баланс"}.`}</p>${!me ? '<p class="booking-login-action"><a class="chrome" href="#/login" id="booking-login">Войти, чтобы продолжить →</a></p>' : '<label class="check"><input id="booking-agree" type="checkbox"><span>Принимаю <a href="#/safety" target="_blank">правила бронирования</a> и условия отмены</span></label>'}`;
  }
  return win(
    "Rent a workspace",
    `${testNote()}<ol class="steps">${steps.map((x, i) => `<li class="${i === draft.step ? "active" : ""}"><b>${i + 1}</b>${x}</li>`).join("")}</ol><div class="booking-grid${draft.step === 3 ? " booking-grid--review" : ""}"><div>${body}<div class="form-actions"><button class="back-btn" id="booking-back">${draft.step ? "← Назад" : "← Город"}</button><button class="chrome" id="booking-next" ${draft.step === 3 && !me ? "disabled" : ""}>${draft.step === 3 ? "Подтвердить" : "Далее"} →</button></div><p id="booking-error" class="form-error" role="alert"></p></div>${draft.step === 3 ? "" : receipt()}</div>`,
  );
}
async function mountBooking() {
  if (!draft.city) {
    $$("[data-city]").forEach(
      (b) =>
        (b.onclick = () => {
          draft.city = b.dataset.city;
          draft.step = 0;
          draft.hour = null;
          draft.resourceId = null;
          render();
        }),
    );
    return;
  }
  if (draft.step === 0) {
    $("#prev-month").onclick = () => {
      const d = new Date(month + "-15");
      d.setMonth(d.getMonth() - 1);
      month = d.toISOString().slice(0, 7);
      render();
    };
    $("#next-month").onclick = () => {
      const d = new Date(month + "-15");
      d.setMonth(d.getMonth() + 1);
      month = d.toISOString().slice(0, 7);
      render();
    };
    $$("[data-day]").forEach(
      (b) =>
        (b.onclick = () => {
          draft.date = b.dataset.day;
          draft.hour = null;
          draft.resourceId = null;
          render();
        }),
    );
    $$("[data-duration]").forEach(
      (b) =>
        (b.onclick = () => {
          draft.duration = +b.dataset.duration;
          draft.hour = null;
          draft.resourceId = null;
          render();
        }),
    );
  }
  if (draft.step === 1) {
    $$("[data-hour]").forEach(
      (b) =>
        (b.onclick = () => {
          draft.hour = +b.dataset.hour;
          draft.resourceId = null;
          render();
        }),
    );
    $$("[data-resource]").forEach(
      (b) =>
        (b.onclick = () => {
          draft.resourceId = b.dataset.resource;
          render();
        }),
    );
    if ($("#waitlist-join")) $("#waitlist-join").onclick = async () => {
      const busy = availability.slots.filter((x) => !x.free.length), mine = (await api("/waitlist")).items;
      dialogForm("Лист ожидания", `<p>${dateLabel(draft.date + "T12:00:00+03:00")} · ${draft.duration} ч · ${esc(CITY_LABELS[draft.city])}</p>${select("hour", "Желаемое время", busy.map((x) => [x.hour, bookingTimeRange(x.hour, draft.duration)]), busy[0].hour)}<p data-help class="small muted">Как только место освободится, придёт уведомление в кабинет, на почту и в Telegram. Забронировать нужно будет самостоятельно — кто первый, тот и занял.</p>${mine.length ? `<h3>Ваши заявки</h3><ul class="pro-waitlist-list">${mine.map((w) => `<li>${dateLabel(w.date + "T12:00:00+03:00")} · ${w.hour}:00 · ${w.duration} ч${w.notified_at ? " · место освобождалось" : ""} <button type="button" class="small" data-waitlist-remove="${w.id}"><u>убрать</u></button></li>`).join("")}</ul>` : ""}`, (d) => api("/waitlist", "POST", { city: draft.city, date: draft.date, duration: draft.duration, hour: Number(d.hour) }));
      $$("[data-waitlist-remove]").forEach((b) => (b.onclick = async () => { await api("/waitlist/" + b.dataset.waitlistRemove, "DELETE"); b.closest("li").remove(); notify("Заявка убрана"); }));
    };
  }
  onForm("#promo-form", async (d) => {
    promoInfo = d.code.trim() ? await api("/promo/check", "POST", { code: d.code }) : null;
    notify(promoInfo ? "Промокод применён" : "Промокод убран");
    render();
  });
  if ($("#promo-clear")) $("#promo-clear").onclick = () => { promoInfo = null; render(); };
  if (draft.step === 2)
    $$("[data-extra]").forEach(
      (el) =>
        (el.onchange = () => {
          const qty =
            el.type === "checkbox"
              ? el.checked
                ? 1
                : 0
              : Math.max(0, Number(el.value));
          draft.extras = draft.extras.filter((x) => x.id !== el.dataset.extra);
          if (qty) draft.extras.push({ id: el.dataset.extra, qty });
          const old = $(".receipt");
          if (old) old.outerHTML = receipt();
        }),
    );
  if ($("#booking-login"))
    $("#booking-login").onclick = () => storage.set("returnTo", "booking");
  $("#booking-back").onclick = () => {
    if (draft.step) {
      draft.step--;
    } else {
      draft.city = null;
      draft.hour = null;
      draft.resourceId = null;
    }
    render();
  };
  $("#booking-next").onclick = async (e) => {
    const b = e.currentTarget;
    b.disabled = true;
    try {
      if (draft.step === 1 && (!draft.resourceId || draft.hour === null))
        throw Error("Выберите свободное время и место");
      if (draft.step === 3) {
        if (!$("#booking-agree")?.checked)
          throw Error("Подтвердите условия бронирования");
        bookingResult = await api("/bookings", "POST", { ...draft, promo: promoInfo?.code || undefined });
        promoInfo = null;
        draft.step = 0;
        draft.resourceId = null;
        draft.hour = null;
        draft.extras = [];
        await refresh();
        if (bookingResult.paymentId) go("payment/" + bookingResult.paymentId);
        else {
          notify("Место забронировано. Запись в личном кабинете.");
          go("cabinet");
        }
      } else {
        draft.step++;
        await render();
      }
    } catch (err) {
      $("#booking-error").textContent = err.message;
    } finally {
      b.disabled = false;
    }
  };
}
async function paymentPage(id) {
  const { payment: p, mode, provider, test } = await api("/payments/" + id);
  return win(
    "Оплата",
    `<div class="payment-sheet"><div class="payment-sheet__header"><span class="eyebrow">Платёж № ${p.id.slice(0, 8)}</span><span class="payment-status">${statusName[p.status] || p.status}</span></div><div class="payment-sheet__summary"><h2>${money(p.amount)}</h2><p>${p.kind === "deposit" ? "Предоплата рабочего места" : "Итоговый счёт за сеанс"}</p></div><dl class="payment-booking"><div><dt>Студия</dt><dd>${esc(CITY_LABELS[p.city]||p.city)} · ${esc(p.resource_name)}</dd></div><div><dt>Сеанс</dt><dd>${dateLabel(p.starts_at)} · ${timeLabel(p.starts_at)}—${timeLabel(p.ends_at)} (МСК)</dd></div></dl><div class="payment-sheet__actions">${p.status === "pending" ? `${provider === "cash" ? '<p class="note-paper">Расчёт наличными в студии. Администратор отметит оплату после получения денег.</p>' : provider === "yookassa" ? `${test ? '<p class="small muted">Тестовая оплата ЮKassa. Деньги не списываются.</p>' : ""}<button class="chrome payment-primary" id="card-pay">Оплатить через ЮKassa →</button><button class="chrome payment-refresh" id="payment-refresh">Проверить статус оплаты</button>` : mode === "test" ? '<div class="note-paper">Тестовая касса.<br>Банковская карта не нужна. Денежного списания и фискального чека не будет.</div><button class="chrome" id="test-pay">Проверить успешную оплату →</button>' : '<button class="chrome payment-primary" id="card-pay">Оплатить картой →</button>'}` : '<a class="chrome" href="#/cabinet">В личный кабинет →</a>'}${
      p.kind === "final" && p.status === "pending"
        ? `<div style="margin-top:25px">${select(
            "upgrade",
            "Если сеанс занял больше времени",
            [3, 6, 12]
              .filter((h) => h >= p.tariff)
              .map((h) => [h, "До " + h + " часов"]),
            p.tariff,
          )}<button class="chrome" id="upgrade-invoice" data-booking="${p.booking_id}">Пересчитать счёт</button></div>`
        : ""
    }</div>${p.kind === "deposit" && p.status === "pending" ? `<p class="payment-sheet__note small muted">${p.expires_at ? "Резерв до "+timeLabel(p.expires_at)+" (МСК)." : "Место удерживается 15 минут с момента создания записи."}</p>` : ""}</div>`,
    "cabinet",
  );
}

const pointsWord = n => n%100>=11&&n%100<=14?"баллов":n%10===1?"балл":n%10>=2&&n%10<=4?"балла":"баллов";
const scoreLabels={bookings:"Брони",services:"Услуги",products:"Товары",profile:"Профиль",works:"Работы",drafts:"Эскизы",adjustment:"Корректировка администратора"};
let residentInfoCleanup=()=>{},residentInfoTriggers=[];
addEventListener("hashchange",()=>residentInfoCleanup());
function mountResidentInfo(){
  residentInfoCleanup();
  const triggers=$$('.ranking-resident,.resident-info-trigger');
  residentInfoTriggers=triggers;
  if(!triggers.length)return;
  const controller=new AbortController(),options={signal:controller.signal};
  const panel=document.createElement('div');
  panel.id='resident-info-popover';panel.className='resident-info-popover';panel.setAttribute('popover','manual');panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Резидент Tattoo Office Private Club');
  panel.innerHTML=`<p>Этот мастер является резидентом Tattoo Office Private Club.</p>${managerLink('Хотите вступить?')}`;
  document.body.append(panel);
  let active=null,timer,returningFocus=false;
  const cancel=()=>clearTimeout(timer);
  const hide=()=>{cancel();if(panel.matches(':popover-open'))panel.hidePopover();active?.setAttribute('aria-expanded','false');};
  const position=()=>{
    if(!active||!panel.matches(':popover-open'))return;
    const r=active.getBoundingClientRect(),p=panel.getBoundingClientRect(),gap=10;
    panel.style.left=Math.max(12,Math.min(r.left,innerWidth-p.width-12))+'px';
    panel.style.top=Math.max(12,Math.min(r.bottom+gap+p.height>innerHeight-12?r.top-p.height-gap:r.bottom+gap,innerHeight-p.height-12))+'px';
  };
  const show=button=>{cancel();if(active!==button)active?.setAttribute('aria-expanded','false');active=button;active.setAttribute('aria-expanded','true');if(!panel.matches(':popover-open'))panel.showPopover();position();};
  const delayHide=()=>{cancel();timer=setTimeout(()=>{if(!panel.matches(':hover')&&!panel.contains(document.activeElement)&&!active?.matches(':focus-visible'))hide();},180);};
  for(const button of triggers){
    button.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')show(button);},options);
    button.addEventListener('pointerleave',delayHide,options);
    button.addEventListener('focus',()=>{if(!returningFocus)show(button);},options);
    button.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();show(button);},options);
    button.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();hide();}else if((e.key==='Tab'&&!e.shiftKey)||e.key==='ArrowDown'){e.preventDefault();show(button);panel.querySelector('a').focus();}},options);
    button.addEventListener('blur',e=>{if(!panel.contains(e.relatedTarget))delayHide();},options);
  }
  panel.addEventListener('pointerenter',cancel,options);
  panel.addEventListener('pointerleave',delayHide,options);
  panel.addEventListener('focusout',e=>{if(!panel.contains(e.relatedTarget)&&e.relatedTarget!==active)hide();},options);
  panel.addEventListener('keydown',e=>{if(e.key==='Escape'||(e.key==='Tab'&&e.shiftKey)){e.preventDefault();e.stopPropagation();const button=active;hide();returningFocus=true;button?.focus();returningFocus=false;}},options);
  panel.addEventListener('toggle',()=>{if(!panel.matches(':popover-open'))active?.setAttribute('aria-expanded','false');},options);
  document.addEventListener('pointerdown',e=>{if(!panel.contains(e.target)&&!e.target.closest('.ranking-resident,.resident-info-trigger'))hide();},options);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.matches(':popover-open')){e.preventDefault();const restore=panel.contains(document.activeElement),button=active;hide();if(restore){returningFocus=true;button?.focus();returningFocus=false;}}},options);
  addEventListener('resize',position,options);
  addEventListener('scroll',position,{...options,capture:true});
  residentInfoCleanup=()=>{hide();controller.abort();panel.remove();residentInfoTriggers=[];residentInfoCleanup=()=>{};};
}

// Account cards and public profiles are also rendered by the main site router.
new MutationObserver(()=>{
  const next=$$('.ranking-resident,.resident-info-trigger');
  if(next.length!==residentInfoTriggers.length||next.some((el,i)=>el!==residentInfoTriggers[i]))mountResidentInfo();
}).observe(document.body,{childList:true,subtree:true});

async function rankingPage() {
  const data = await api("/ranking?period=all");
  data.masters=data.masters.map(m=>({...m,profileUrl:"#/master/"+encodeURIComponent(m.id)}));
  const podiumCrown = rank => {
    if (![1,2,3].includes(rank)) return "";
    const fill={1:"#e6b422",2:"#aeb8c4",3:"#c9854b"}[rank];
    return `<svg class="ranking-crown" viewBox="0 0 24 24" role="img" aria-label="${rank}-е место"><path fill="${fill}" d="M11.2 3.6Q12 2.1 12.8 3.6l3.3 5.3q.55.85 1.3.3l3.2-2.4q1.5-1.1 1.15.85l-1.9 9.3q-.2 1-1.2 1H5.6q-1 0-1.2-1L2.25 7.45q-.35-1.95 1.15-.85l3.2 2.4q.75.55 1.3-.3ZM6 19h12a1.2 1.2 0 0 1 0 2.4H6a1.2 1.2 0 0 1 0-2.4Z"/></svg>`;
  };
  return win("Топ мастеров", `<div class="ranking-tools"><label class="field"><span>Поиск мастера</span><input id="ranking-search" type="search" placeholder="никнейм" autocomplete="off"></label></div>${data.masters.length ? `<ol class="ranking-list ranking-list--compact">${data.masters.map(m => `<li data-ranking-place="${m.rank}" class="${m.rank <= 3 ? "ranking-podium" : ""}" data-ranking-name="${esc(m.name.toLocaleLowerCase('ru'))}" data-ranking-city="${esc(m.city)}"><div class="ranking-row" data-profile-url="${esc(m.profileUrl)}"><span class="ranking-position" aria-label="Место ${m.rank}">${m.rank}.</span><a class="ranking-avatar" href="${esc(m.profileUrl)}">${m.avatar ? `<img src="${esc(window.PhotoSources?.[m.avatar]?.small || m.avatar)}" alt="${esc(m.name)}" width="46" height="46" loading="lazy" decoding="async">` : `<span aria-label="Аватар ${esc(m.name)}">${esc(m.name.trim().split(/\s+/).slice(0,2).map(n=>n[0]).join(''))}</span>`}</a><div class="ranking-person"><div class="ranking-name"><a class="ranking-name-text" href="${esc(m.profileUrl)}">${esc(m.name)}</a>${podiumCrown(m.rank)}</div><div class="ranking-meta"><span>${esc(m.city || 'Город не указан')}</span>${m.resident ? '<button type="button" class="ranking-resident is-resident" aria-haspopup="dialog" aria-controls="resident-info-popover" aria-expanded="false"><img class="resident-mark" src="assets/resident-mark.svg?v=clean-2" width="16" height="16" alt="">резидент</button>' : ""}</div></div><strong class="ranking-sessions" title="${esc(Object.entries(m.pointsBreakdown||{}).map(([k,v])=>`${scoreLabels[k]||k}: ${v}`).join(" · "))}">${Number(m.score||0).toLocaleString("ru-RU")}<small>${pointsWord(m.score||0)}</small></strong></div></li>`).join("")}</ol><div class="empty" id="ranking-empty" hidden>Мастеры не найдены.</div>` : '<div class="empty">В рейтинге пока нет мастеров.</div>'}`, "masters");
}
async function cabinetPage() {
  if (!me) return authPage(false);
  const data = await api("/bookings"),
    inbox = await api("/notifications"),
    active = data.bookings.filter((b) =>
      ["pending", "confirmed", "invoiced", "cancel_requested"].includes(
        b.status,
      ),
    ),
    done = data.bookings.filter((b) => b.status === "completed").length;
  const personalPoints=cabTab==="profile"&&me.accountType==="master"?await api("/me/ranking"):null;
  const next=active.filter(b=>new Date(b.ends_at)>new Date()).sort((a,b)=>new Date(a.starts_at)-new Date(b.starts_at))[0];
  let body = "";
  if (cabTab === "bookings")
    body = active.length
      ? active.map((b) => bookingItem(b, data.payments)).join("")
      : '<div class="empty">В вашем календаре пока тихо.<br><br><a href="#/booking">Забронировать первое место →</a></div>';
  if (cabTab === "history")
    body =
      data.bookings
        .filter((b) => !active.includes(b))
        .map((b) => bookingItem(b, data.payments))
        .join("") || '<div class="empty">Здесь будет история сеансов.</div>';
  if (cabTab === "balance")
    body = `<h3>Баланс</h3><p data-help class="small muted">Баланс используется автоматически для предоплаты. Это учёт внесённых средств, а не банковский счёт.</p><div class="table-wrap"><table><thead><tr><th>Дата</th><th>Операция</th><th>Сумма</th></tr></thead><tbody>${data.ledger.map((x) => `<tr><td>${dateLabel(x.created_at)}</td><td>${esc(x.description)}</td><td>${x.amount > 0 ? "+" : ""}${money(x.amount)}</td></tr>`).join("")}</tbody></table></div>${!data.ledger.length ? '<div class="empty">Операций пока нет.</div>' : ""}`;
  if (cabTab === "notifications")
    body = inbox.notifications.length
      ? inbox.notifications
          .map((n) => notificationItem(n, data))
          .join("")
      : '<div class="empty">Входящих пока нет.</div>';
  if (cabTab === "profile")
    body = `<form id="profile-form"><div class="profile-avatar-picker file-upload-zone"><span class="profile-avatar-preview">${me.profile.avatar ? `<img src="${esc(me.profile.avatar)}" alt="Ваш аватар">` : `<span>${esc(me.name.slice(0,1))}</span>`}</span><span class="file-upload-copy"><b>Фотография профиля</b><small>Нажмите кнопку или перетащите фото · JPG, PNG, WebP до 5 МБ</small><span id="avatar-upload-status" class="file-upload-status" role="status" aria-live="polite">${me.profile.avatar?'Фото загружено':''}</span></span><button class="chrome" type="button" id="avatar-choose">${me.profile.avatar?'Заменить фото':'Выбрать фото'}</button><input type="file" id="profile-avatar-file" accept="image/jpeg,image/png,image/webp" hidden><input type="hidden" name="avatar" value="${esc(me.profile.avatar || "")}"></div><div class="form-grid">${field("name", "Имя", me.name, "text", 'required maxlength="100"')}${select("city", "Город", [["Москва", "Москва"], ["СПБ", "СПБ"]], me.profile.city || "Москва")}${field("birthDate", "Дата рождения", me.profile.birthDate||"", "date", 'data-styled="true" autocomplete="bday" max="'+today()+'"')}${field("experience", "Стаж", me.profile.experience||"", "text", 'maxlength="80" placeholder="Например, 5 лет"')}${field("specialty", "Ваш стиль", me.profile.specialty || "")}${field("status", "Статус на сегодня", me.profile.status || "")}<div class="wide">${textarea("bio", "О себе", me.profile.bio || "")}</div></div><label class="check ranking-visibility"><input type="checkbox" name="rankingVisible" ${me.profile.rankingVisible !== false ? "checked" : ""}><span>Показывать меня в рейтинге мастеров</span></label><button class="chrome" type="submit">Сохранить личное дело</button></form><div class="note-paper">${me.telegramLinked ? "Telegram подключён" : pub.telegramEnabled ? '<a href="/api/auth/telegram">Привязать Telegram →</a>' : "Telegram пока не подключён студией"}</div><h3 style="margin-top:35px">Сменить пароль</h3><form id="password-form" class="form-grid">${field("current", "Текущий пароль", "", "password", "required")}${field("password", "Новый пароль", "", "password", 'required minlength="12" maxlength="128"')}<button class="chrome" type="submit">Изменить пароль</button></form>`;
  if(personalPoints){
    const names={name:"имя",avatar:"фото",city:"город",bio:"описание от 80 символов",specialty:"стиль",experience:"стаж",portfolio:"хотя бы одну работу"};
    body=`<section class="personal-ranking"><h3>Ваш рейтинг: ${personalPoints.score.toLocaleString("ru-RU")} ${pointsWord(personalPoints.score)}</h3><dl>${Object.entries(personalPoints.breakdown).map(([key,value])=>`<div><dt>${scoreLabels[key]}</dt><dd>${value}</dd></div>`).join("")}</dl><p>Профиль заполнен: ${personalPoints.profileProgress.filled} из ${personalPoints.profileProgress.total}.${personalPoints.profileProgress.missing.length?` Добавьте: ${personalPoints.profileProgress.missing.map(k=>names[k]).join(", ")}.`:" Все поля для бонуса заполнены."}</p></section>`+body;
  }
  if(cabTab==='portfolio' && me.accountType==='master')body='<section id="profile-gallery" class="profile-gallery profile-gallery--tab"><h3>Работы и эскизы</h3><p class="small muted" role="status">Загрузка портфолио…</p></section>';
  const accent = '';
  return win(
    "My profile",
    `${testNote()}<div class="cabinet"><div class="row between cabinet-heading"><div><h2>${esc(me.name)}</h2><p class="small muted cabinet-email"><code>${esc(me.email)}</code></p></div><button id="logout" class="small cabinet-action">Выйти</button></div><div class="summary-cards"><div class="stat"><span class="eyebrow">НА БАЛАНСЕ</span><strong>${money(me.balance)}</strong><span class="small muted">для следующей записи</span></div><div class="stat"><span class="eyebrow">В КАЛЕНДАРЕ</span><strong>${active.length}</strong><a class="small" href="#/booking">Забронировать место</a></div><div class="stat"><span class="eyebrow">ЗАВЕРШЕНО</span><strong>${done}</strong><span class="small muted">сеансов в этом офисе</span></div></div>${next?`<section class="cabinet-next"><span class="eyebrow">Ближайшая запись</span>${bookingItem(next,data.payments)}</section>`:""}${loyaltyCard(data.loyalty, accent)}<div class="tabs">${[
      ["bookings", "Мои записи"],
      ["history", "Архив"],
      ["balance", "Баланс"],
      ["notifications", "Входящие"],
      ...(me.accountType==='master' ? [["portfolio", "Работы / эскизы"]] : []),
      ["profile", "Личное дело"],
    ]
      .map(
        ([v, l]) =>
          `<button data-cabtab="${v}" aria-selected="${v === cabTab}">${l}</button>`,
      )
      .join("")}</div><div class="cabinet-content">${body}</div></div>`,
  );
}
function loyaltyCard(loyalty, accent) {
  const progress = loyalty?.progress || 0, cycle = loyalty?.cycle || 1;
  const stamps = Array.from({length:19},(_,i)=>`<span class="stamp ${i<progress?"used":""}" aria-label="Посещение ${i+1}${i<progress?" завершено":""}">${i<progress?"✓":String(i+1).padStart(2,"0")}</span>`).join("");
  return `<section class="stamp-card" style="${accent}"><div class="loyalty-heading"><div><h3>Каждое 20-е посещение — бесплатно</h3><p>${loyalty?.reserved ? "Бесплатное место уже забронировано" : progress === 19 ? "Следующая аренда места — в подарок" : `${19-progress} посещений до бесплатного места`}</p></div><span class="loyalty-counter">${progress}<small>/ 19</small></span></div><div class="stamps" aria-label="${progress} завершённых посещений в цикле ${cycle}">${stamps}<button class="stamp stamp--gift" type="button" id="loyalty-gift" aria-label="20-е посещение: условия бесплатной аренды" aria-haspopup="dialog">${icon("gift")}</button></div><div class="loyalty-foot"><span class="small muted">Цикл ${cycle}</span></div></section>`;
}
// Фото рабочего места: выбранное в Workspaces, иначе стандартное по порядку.
function resourcePhoto(r) {
  if (r?.photo) return r.photo;
  const index = pub.resources.findIndex((x) => x.id === r?.id);
  return `assets/interior/${[1,4,4,2][Math.max(0,index)%4]}.jpg`;
}
function placePhoto(booking) {
  return resourcePhoto(pub.resources.find((r) => r.id === booking.resource_id) || { id: booking.resource_id });
}
function notificationItem(n, data) {
  const lines = String(n.message || "").split("\n").map((line) => line.trim()).filter(Boolean);
  const text = lines.filter((line) => !/^https?:\/\/\S+\/#\/cabinet\/?$/.test(line));
  const code = text.join(" ").match(/Запись ([a-f0-9]{8})\b/i)?.[1];
  const matches = code ? data.bookings.filter(b=>b.id.startsWith(code)) : [];
  const booking = matches.length === 1 ? matches[0] : null;
  const payments = booking ? data.payments.filter(p=>p.booking_id===booking.id&&p.status==='paid') : [];
  return `<article class="note-paper cabinet-notification ${booking?"cabinet-notification--booking":""}">${booking?`<img class="notification-photo" src="${placePhoto(booking)}" alt="${esc(booking.resource_name)}" loading="lazy">`:""}<div class="notification-summary"><span class="eyebrow">${dateLabel(n.created_at)}</span><h3>${esc(text[0] || "Уведомление")}</h3>${booking?`<p class="notification-place">${esc(booking.resource_name)}</p></div><div class="notification-details"><p>${dateLabel(booking.starts_at)} · ${timeLabel(booking.starts_at)}—${timeLabel(booking.ends_at)} (МСК)</p><p>До ${booking.tariff} ч · ${money(booking.total)}${booking.policy?.loyaltyFree?" · бесплатная аренда":""}</p>${payments.map(p=>`<button type="button" class="receipt-link" data-payment-document="${p.id}">${icon("receipt")} ${p.kind==='deposit'?"Предоплата":"Оплата места"} ${money(p.amount)} · ${pub.settings.mode==='test'?'Чек (тест)':'Чек'}</button>`).join("")}`:text.slice(1).map((line)=>`<p>${esc(line)}</p>`).join("")}</div></article>`;
}
function bookingItem(b, payments) {
  const payment = payments.find(
    (p) => p.booking_id === b.id && p.status === "pending",
  );
  return `<article class="booking-item"><div><h3>${dateLabel(b.starts_at)} · ${timeLabel(b.starts_at)}—${timeLabel(b.ends_at)}</h3><p>${esc(CITY_LABELS[b.policy?.city || resourceCity(pub.resources.find((r) => r.id === b.resource_id))])} · ${esc(b.resource_name)} · до ${b.tariff} ч ${b.session_no ? "· сеанс " + b.session_no + "/20" : ""}</p><p class="muted">${money(b.total)} · предоплата ${money(b.deposit)}</p><span class="badge ${b.status === "confirmed" ? "good" : ""}">${statusName[b.status]}</span></div><div class="row">${payment ? `<a href="#/payment/${payment.id}" class="chrome">Оплатить ${money(payment.amount)}</a>` : ""}${["pending", "confirmed"].includes(b.status) && new Date(b.starts_at) > new Date() ? `<button class="small cabinet-action" data-cancel="${b.id}" data-cancel-hours="${Number(b.policy?.cancelHours ?? pub.settings.cancelHours)}" data-late-cancellation="${esc(b.policy?.lateCancellation ?? pub.settings.lateCancellation)}"><u>отменить</u></button>` : ""}</div></article>`;
}
function mountCabinet() {
  if (!me) {
    mountAuth(false);
    return;
  }
  if ($("#loyalty-gift")) $("#loyalty-gift").onclick = () => modal(`<h2>20-е посещение — бесплатно</h2><p>После 19 завершённых посещений следующая аренда места бесплатна по выбранному тарифу.</p><p>Расходники и дополнительные услуги оплачиваются отдельно. Отменённые брони не считаются.</p>`);
  $$("[data-cabtab]").forEach(
    (b) =>
      (b.onclick = () => {
        cabTab = b.dataset.cabtab;
        render();
      }),
  );
  $$("[data-payment-document]").forEach(button=>button.onclick=async()=>{
    const {payment:p, test:remoteTest, mode, provider} = await api("/payments/"+button.dataset.paymentDocument);
    const test = remoteTest || mode === "test";
    modal(`<h2>${test?"Тестовая оплата":"Подтверждение оплаты"}</h2><p>${provider==='yookassa'?"ЮKassa":"Tattoo Office"} · ${money(p.amount)}</p><p>${p.kind==='deposit'?"Предоплата рабочего места":"Оплата рабочего места"}</p><p class="small muted">№ ${esc(p.checkout_id||p.id)}</p><p>${test?"Тестовая операция: деньги не списывались. Фискальный чек не сформирован.":"Фискальный чек пока недоступен на сайте. После регистрации касса отправит его на электронную почту плательщика."}</p>`);
  });
  $("#logout").onclick = async () => {
    await api("/auth/logout", "POST");
    await refresh();
    go("masters");
  };
  $$("[data-cancel]").forEach(
    (b) =>
      (b.onclick = () => {
        const hours = Number(b.dataset.cancelHours);
        const late = b.dataset.lateCancellation === "review"
          ? "Позднюю отмену рассмотрит администратор."
          : `При отмене менее чем за ${hours} часов предоплата не возвращается на баланс.`;
        modal(
          `<h2>Отменить запись?</h2><p>При отмене не менее чем за ${hours} часов предоплата вернётся на баланс. ${late}</p><button class="chrome" id="confirm-cancel">Да, отменить</button>`,
        );
        $("#confirm-cancel").onclick = async (e) => {
          e.currentTarget.disabled = true;
          try {
            await api("/bookings/" + b.dataset.cancel + "/cancel", "POST");
            $("#dialog").close();
            await refresh();
            await render();
            notify("Статус записи обновлён");
          } catch (error) {
            notify(error.message);
            e.currentTarget.disabled = false;
          }
        };
      }),
  );
  if($('#profile-gallery'))mountGallery($('#profile-gallery'),api,notify,refresh).catch(e=>notify(e.message));
  const avatarFile = $("#profile-avatar-file");
  if(avatarFile)bindFileUpload($('.profile-avatar-picker'),avatarFile,$('#avatar-choose'),async files=>{
    const file=files[0];if(!file)return;
    const zone=$('.profile-avatar-picker'),status=$('#avatar-upload-status'),button=$('#avatar-choose'),submit=$('#profile-form button[type="submit"]');
    const show=(message,error=false)=>{status.textContent=message;zone.classList.toggle('has-error',error);};
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024){show('Выберите JPG, PNG или WebP до 5 МБ',true);return;}
    zone.classList.add('is-loading');button.disabled=true;submit.disabled=true;show('Подготавливаем фотографию…');
    try{
      const bitmap=await createImageBitmap(file),canvas=document.createElement('canvas');canvas.width=192;canvas.height=192;
      try{const ctx=canvas.getContext('2d'),side=Math.min(bitmap.width,bitmap.height);ctx.fillStyle='#fff';ctx.fillRect(0,0,192,192);ctx.drawImage(bitmap,(bitmap.width-side)/2,(bitmap.height-side)/2,side,side,0,0,192,192);}finally{bitmap.close();}
      const value=canvas.toDataURL('image/jpeg',.78);if(value.length>90000)throw Error('Выберите фотографию меньшего размера');
      $('#profile-form [name="avatar"]').value=value;$('.profile-avatar-preview').innerHTML=`<img src="${value}" alt="Предпросмотр фотографии">`;
      button.textContent='Заменить фото';show('Фото выбрано. Нажмите «Сохранить личное дело».');
    }catch(error){show(error.message||'Не удалось прочитать фотографию',true);}finally{zone.classList.remove('is-loading');button.disabled=false;submit.disabled=false;}
  });
  onForm("#profile-form", async (d) => {
    await api("/me", "PATCH", { name: d.name, profile: { ...d, rankingVisible: d.rankingVisible === "on" } });
    await refresh();
    notify("Личное дело сохранено");
    render();
  });
  onForm("#password-form", async (d) => {
    await api("/me/password", "POST", d);
    await refresh();
    go("login");
    notify("Пароль изменён. Войдите заново.");
  });
}
let adminCache = false, adminData,
  adminDate = today(),
  usersFilter = "all",
  usersTag = "",
  scheduleView = "day",
  listStatus = "all",
  adminScrollTo = "";
// Обращения доступны отдельно от основного меню; точка отмечает новые.
function paintFeedbackDock(hasNew) {
  let dock = document.getElementById("adminFeedbackDock");
  if (!dock) {
    dock = document.createElement("button");
    dock.type = "button";
    dock.id = "adminFeedbackDock";
    dock.className = "admin-feedback-dock";
    dock.dataset.keepCase = "";
    dock.dataset.sfx = "open";
    dock.onclick = () => {
      adminTab = "feedback";
      document.body.classList.remove("mobile-menu-open");
      if (location.hash === "#/admin") render(); else go("admin");
    };
    // На компьютере — в правой колонке сразу под панелью аккаунта (не наезжает на неё),
    // на телефоне — над подвалом.
    const place = () => {
      if (window.isMobileLayout?.()) {
        const bottom = document.querySelector(".site-bottom");
        bottom.insertBefore(dock, bottom.querySelector(".foot"));
      } else document.getElementById("loginPanel").after(dock);
    };
    place();
    matchMedia("(max-width:700px)").addEventListener("change", place);
  }
  dock.classList.toggle("has-new", hasNew);
  dock.setAttribute("aria-current", adminTab === "feedback" ? "page" : "false");
  dock.setAttribute("aria-label", hasNew ? "Обращения — есть новые обращения" : "Обращения");
  dock.innerHTML = `<span class="admin-feedback-dock__icon" aria-hidden="true"><svg viewBox="0 0 24 20"><rect x="2" y="3" width="20" height="14" rx="2.5"/><path d="m3 5 9 7 9-7"/></svg>${hasNew ? '<i class="admin-feedback-dock__dot"></i>' : ""}</span><u>Обращения</u>`;
}
const cityTabs = () =>
  `<div class="tabs admin-city-tabs" role="tablist" aria-label="Студия">${CITY_IDS.map((id) => `<button type="button" role="tab" data-admin-city="${id}" aria-selected="${id === adminCity}">${CITY_LABELS[id]}${cityInfo(id).open ? "" : " · скоро"}</button>`).join("")}</div>`;
const table = (heads, rows) =>
  `<div class="table-wrap"><table><thead><tr>${heads.map((x) => `<th>${x}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table></div>${!rows.length ? '<div class="empty">Пока пусто.</div>' : ""}`;
async function adminPage() {
  if (!me) return adminAuthPage();
  if (me.role !== "admin")
    return win("Служебный вход", "У вас нет доступа к этому разделу.");
  try { if (!(adminCache && adminData)) adminData = await api("/admin"); adminCache = false; }
  catch (error) {
    // Сессия закончилась (или тестовый сервер перезапустился) — показываем вход, а не ошибку.
    await refresh();
    if (me?.role !== "admin") return adminAuthPage();
    adminData = await api("/admin");
  }
  syncMasters(adminData.content);
  const a = adminData,
    copyButton = (value,label) => `<button type="button" class="admin-copy" data-copy-value="${esc(value)}" data-copy-label="${label}" aria-label="Скопировать ${label}" title="Скопировать ${label}"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/></svg></button>`,
    pointsButton = id => {
      const master = a.masterPoints?.find(m => m.id === id || m.userId === id);
      return master ? `<button type="button" class="admin-points-button" data-edit-points="${esc(master.id)}" aria-label="Изменить баллы: ${esc(master.name)}" title="Изменить баллы"><span>${master.score.toLocaleString("ru-RU")}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15z"/></svg></button>` : "—";
    },
    s = pub.settings,
    tabs = [
      ["home", "Main"],
      ["users", "Пользователи"],
      ["schedule", "Расписание"],
      ["workspaces", "Рабочие места"],
      ["catalog", "Склад и услуги"],
      ["finance", "Платежи"],
      ["pricing", "Цены и промокоды"],
      ["settings", "Настройки"],
      ["feedback", "Обращения"], ["profile", "Профиль"],
    ];
  if (AP.isShift()) for (const hidden of ["finance", "pricing", "settings"]) tabs.splice(tabs.findIndex((t) => t[0] === hidden), 1);
  if (adminTab === "masters") { adminTab = "users"; usersFilter = "master"; }
  // Сохраняем переходы со старых кнопок к истории записей.
  if (adminTab === "bookings") { adminTab = "schedule"; scheduleView = "list"; }
  if (!tabs.some((x) => x[0] === adminTab)) adminTab = tabs[0][0];
  const menu = $("#menuList");
  // Обращения доступны отдельной кнопкой под меню.
  paintFeedbackDock(a.feedback.some((f) => f.status === "new"));
  // Профиль администратора открывается через аватар и имя.
  const groups = [
    {label:"Main", target:"home", tabs:["home"], icon:"home"},
    {label:"Расписание", target:"schedule", tabs:["schedule"], icon:"schedule"},
    {label:"Пользователи", target:"users", tabs:["users"], icon:"users"},
    {label:"Деньги", target:"finance", tabs:["finance","pricing"], icon:"finance"},
    {label:"Студия", target:"workspaces", tabs:["workspaces","catalog","settings"], icon:"workspaces"},
  ];
  for (const g of groups) g.tabs = g.tabs.filter((t) => tabs.some((x) => x[0] === t));
  for (let i = groups.length - 1; i >= 0; i--) if (!groups[i].tabs.length) groups.splice(i, 1); else if (!groups[i].tabs.includes(groups[i].target)) groups[i].target = groups[i].tabs[0];
  UX.bottomNav(groups, adminTab);
  const group = groups.find(g => g.tabs.includes(adminTab));
  const navigation = groups.map(g => [g.tabs.includes(adminTab) ? adminTab : g.target, g.label]);
  menu.innerHTML = navigation.map(([value, label]) => `<li class="menu__item" ${value === adminTab ? 'aria-current="true"' : ""}><span class="${value === adminTab ? "bullet" : "pin"}"></span><button class="menu__link" data-admintab="${value}" ${value === adminTab ? 'aria-current="page"' : ""}>${label}</button></li>`).join("");
  requestAnimationFrame(() => window.TO?.refreshLayout());
  let body = "", homeHead = "";
  if (adminTab === "home") {
    const icon = (name) => `<svg class="ui-icon" aria-hidden="true"><use href="#ui-${name}"></use></svg>`;
    const pencil = '<svg class="admin-shortcut__pencil" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 17.6V20h2.4l9.1-9.1-2.4-2.4L5 17.6zm13.7-8.9a.9.9 0 0 0 0-1.3l-1.1-1.1a.9.9 0 0 0-1.3 0l-1 1 2.4 2.4 1-1z"/><rect x="3" y="21.2" width="18" height="1.6" rx=".8"/></svg>';
    const calendar = '<svg class="admin-shortcut__calendar" viewBox="0 0 28 28" aria-hidden="true"><defs><linearGradient id="calBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdfdfd"/><stop offset="1" stop-color="#dcdcdc"/></linearGradient><linearGradient id="calTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bdbdbd"/><stop offset="1" stop-color="#8f8f8f"/></linearGradient></defs><rect x="3" y="5" width="22" height="21" rx="3" fill="url(#calBody)" stroke="#9a9a9a"/><path d="M3 8a3 3 0 0 1 3-3h16a3 3 0 0 1 3 3v2H3z" fill="url(#calTop)"/><g fill="#6f6f6f">' + [7, 11, 15, 19].map((x) => `<rect x="${x}" y="2" width="1.6" height="6" rx=".8"/>`).join("") + '</g><g stroke="#d0d0d0" stroke-width=".7">' + [15, 19, 23].map((y) => `<path d="M4 ${y}h20"/>`).join("") + '</g></svg>';
    homeHead = `<div class="admin-home admin-home--head"><h2 class="admin-main-title"><svg class="admin-main-title__icon" viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="mainPerson" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9c9c9"/><stop offset="1" stop-color="#8e8e8e"/></linearGradient></defs><circle cx="16" cy="10" r="6.5" fill="url(#mainPerson)"/><path d="M3.5 29c0-6.6 5.6-11 12.5-11s12.5 4.4 12.5 11z" fill="url(#mainPerson)"/></svg><u>Admin panel</u></h2><div class="admin-shortcuts" data-keep-case><button class="admin-shortcut" id="manual-booking"><span class="admin-shortcut__plus" aria-hidden="true">+</span><u>new booking</u></button><button class="admin-shortcut" id="add-user"><span class="admin-shortcut__plus" aria-hidden="true">+</span><u>new user</u></button><button class="admin-shortcut" data-admintab="${AP.isShift() ? "settings" : "pricing"}">${pencil}<u>edit plans</u></button><button class="admin-shortcut" data-admintab="schedule">${calendar}<u>Calendar</u></button><button class="admin-shortcut" data-admintab="bookings">${icon("history")}<u>Booking history</u></button></div></div>`;
    body = `<div class="admin-home">${await api("/admin/overview").then(AP.overviewHTML, () => "")}</div>`;
  }
  if (adminTab === "profile") body = `<div class="admin-profile"><p class="small muted">Администратор · ${esc(me.email)}</p><form id="admin-profile-form"><h3>Личные данные</h3>${field("name","Имя",me.name,"text",'required maxlength="100"')}<button type="submit" class="chrome">Сохранить профиль</button></form><form id="admin-password-form"><h3>Безопасность</h3>${field("current","Текущий пароль","","password",'required autocomplete="current-password"')}${field("password","Новый пароль","","password",'required minlength="12" maxlength="128" autocomplete="new-password"')}<button type="submit" class="chrome">Изменить пароль</button></form></div>`;
  if (adminTab === "schedule") {
    const cityResources = a.resources.filter((r) => resourceCity(r) === adminCity),
      cityIds = new Set(cityResources.map((r) => r.id)),
      inactive = cityResources.filter((r) => !r.active),
      dayCount = a.bookings.filter((b) => cityIds.has(b.resource_id) && new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Moscow" }).format(new Date(b.starts_at)) === adminDate && !["cancelled", "expired"].includes(b.status)).length,
      listed = a.bookings.filter((b) => cityIds.has(b.resource_id) && (listStatus === "all" || (listStatus === "active" ? ["pending", "confirmed", "invoiced", "cancel_requested"].includes(b.status) : b.status === listStatus)));
    const dayLine = `<div class="pro-dayline">${scheduleView === "list" ? '<button type="button" class="date-open" data-schedule-view="day" aria-label="Календарь: расписание дня" title="Расписание дня"><svg class="ui-icon" aria-hidden="true"><use href="#ui-calendar"></use></svg></button>' : `<input id="admin-date" type="date" value="${adminDate}" aria-label="Дата расписания">`}<button type="button" class="date-open pro-listbtn" data-schedule-view="${scheduleView === "list" ? "day" : "list"}" aria-pressed="${scheduleView === "list"}" aria-label="${scheduleView === "list" ? "Вернуться к расписанию дня" : "Все бронирования"}" title="${scheduleView === "list" ? "Расписание дня" : "Все бронирования"}"><svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/></svg></button>${scheduleView === "list" ? `<strong class="pro-daynav__label">Все бронирования</strong><div class="pro-dayline__filters">${select("listStatus", "Статус", [["all", "Все"], ["active", "Активные"], ["confirmed", "Подтверждено"], ["pending", "Ожидает предоплаты"], ["invoiced", "Выставлен счёт"], ["cancel_requested", "Отмена на рассмотрении"], ["completed", "Завершено"], ["no_show", "Неявка"], ["cancelled", "Отменено"]], listStatus)}<input type="search" class="pro-list-search" id="list-search" placeholder="Поиск: имя, дата, место" aria-label="Поиск в списке" autocomplete="off"></div>` : `<span class="pro-dayswitch"><button type="button" class="pro-dayarrow" data-day-shift="-1" aria-label="Предыдущий день"><svg class="ui-icon" aria-hidden="true"><use href="#ui-chevron-left"></use></svg></button><strong class="pro-daynav__label">${UX.fullDate(adminDate + "T12:00:00+03:00")}</strong><button type="button" class="pro-dayarrow" data-day-shift="1" aria-label="Следующий день"><svg class="ui-icon" aria-hidden="true"><use href="#ui-chevron-right"></use></svg></button></span>`}${scheduleView === "day" ? UX.nightToggle(s) : ""}</div>`;
    body = `${cityTabs()}${dayLine}${scheduleView === "day" ? `${inactive.length ? `<p class="small muted pro-meta">Не принимают записи: ${inactive.map((r) => `${esc(r.name)} <button class="small" data-edit-resource="${r.id}"><u>изменить</u></button>`).join(", ")}</p>` : ""}${UX.scheduleTimeline(a, s, adminDate, adminCity)}` : `<div class="pro-scroll"><div data-own-search id="admin-bookings">${table(
      ["Сеанс", "Мастер / место", "Сумма", "Статус", ""],
      listed.map(
        (b) =>
          `<tr><td><button type="button" class="pro-link" data-booking-open="${b.id}">${UX.fullDate(b.starts_at)}</button><br>${timeLabel(b.starts_at)}—${timeLabel(b.ends_at)} · № ${b.session_no || "—"}</td><td><button type="button" class="pro-link" data-user-card="${b.user_id}">${esc(b.user_name)}</button><br><span class="muted">${esc(CITY_LABELS[resourceCity(a.resources.find((r) => r.id === b.resource_id))])} · ${esc(b.resource_name)}</span></td><td>${money(b.total)}<br><small class="muted">аванс ${money(b.deposit)}</small></td><td>${UX.badge(b.status)}</td><td><button type="button" data-booking-open="${b.id}">Открыть</button></td></tr>`,
      ),
    )}</div><h3 style="margin-top:30px">Закрытые интервалы</h3><div data-own-search>${table(
      ["Период", "Причина", ""],
      a.blocks.filter((b) => !b.resource_id || cityIds.has(b.resource_id)).map(
        (b) =>
          `<tr><td>${UX.fullDate(b.starts_at)} ${timeLabel(b.starts_at)} — ${UX.fullDate(b.ends_at)} ${timeLabel(b.ends_at)}</td><td>${esc(b.reason)}</td><td>${b.external ? '<span class="muted">Изменить в Google Calendar</span>' : `<button data-delete-block="${b.id}">Открыть время</button>`}</td></tr>`,
      ),
    )}</div></div>`}`;
  }
  if (adminTab === "pricing") body = UX.pricingHTML(a, s, adminCity);
  if (adminTab === "workspaces") {
    // Рабочие места студии в выбранном городе — так их видят мастера при аренде.
    const list = a.resources.filter((r) => resourceCity(r) === adminCity);
    body = `${cityTabs()}<div class="admin-tools workspace-tools"><button class="chrome" id="add-resource">+ Рабочее место</button></div><p data-help class="small muted">Места показываются мастерам при аренде в выбранном городе — с этой фотографией и названием. Место можно временно выключить («Принимать записи») или удалить. Место с прошлыми записями при удалении скрывается, история записей сохраняется.</p>${list.length ? `<div class="workspace-list">${list.map((r) => `<article class="workspace-card${r.active ? "" : " is-off"}"><img class="workspace-card__photo" src="${esc(resourcePhoto(r))}" alt="" loading="lazy"><div class="workspace-card__copy"><h3>${esc(r.name)}</h3><small>${r.active ? "Принимает записи" : "Не принимает записи"}</small>${AP.placeInfo(r, a)}</div><div class="workspace-card__actions"><button type="button" data-edit-resource="${r.id}">Изменить</button>${AP.isShift() ? "" : `<button type="button" data-place-hours="${r.id}">Часы работы</button>`}<button type="button" class="workspace-delete" data-delete-resource="${r.id}">Удалить</button></div></article>`).join("")}</div>` : `<div class="empty">В городе ${esc(CITY_LABELS[adminCity])} пока нет рабочих мест. Добавьте первое кнопкой «+ Рабочее место».</div>`}`;
  }
  if (adminTab === "users") {
    // «Пользователи»: все аккаунты (мастера, админы, клиенты) и карточки мастеров на сайте.
    const isAdmin = (u) => u.role === "admin" || u.account_type === "admin",
      isMaster = (u) => !isAdmin(u) && u.account_type === "master",
      shown = a.users.filter((u) => (usersFilter === "master" ? isMaster(u) : usersFilter === "admin" ? isAdmin(u) : true) && (!usersTag || AP.userTags(u).some(([k]) => k === usersTag))),
      roleLabel = (u) => (u.account_type === "customer" ? "Клиент" : ({resident:"Резидент",guest:"Мастер",admin:"Администратор"}[u.role])) + (u.role === "resident" && u.deposit_waived ? '<br><small>Без предоплаты · наличные</small>' : "");
    body = `<div class="users-toolbar"><button type="button" class="users-count" data-users-filter="all" aria-pressed="${usersFilter === "all"}">Все:<b>${a.users.length}</b></button><div class="users-segment" role="group" aria-label="Фильтр пользователей">${[["master", "Мастера"], ["admin", "Админы"]].map(([value, label]) => `<button type="button" data-users-filter="${value}" aria-pressed="${usersFilter === value}">${label}</button>`).join("")}</div><button class="chrome" id="add-user">+ Пользователь</button></div><div class="pro-tag-filter" role="group" aria-label="Метки">${AP.TAG_FILTERS.map(([value, label]) => `<button type="button" data-users-tag="${value}" aria-pressed="${usersTag === value}">${label} <b>${a.users.filter((u) => AP.userTags(u).some(([k]) => k === value)).length}</b></button>`).join("")}${AP.isShift() ? "" : '<button type="button" class="pro-tag-filter__action" id="broadcast">Рассылка ✉</button>'}</div><p data-help class="small muted">Нажмите на имя, чтобы открыть карточку: брони, оплаты, заметки, пароль, баланс и вход от имени пользователя.</p><div class="admin-users-list">${table(
      ["Пользователь", "Роль и доступ", "Баллы", "Баланс", "Действия"],
      shown.map(
        (u) =>
          `<tr><td><div class="admin-user-identity"><span class="admin-user-name"><button type="button" class="pro-link" data-user-card="${u.id}">${esc(u.name)}</button>${copyButton(u.name,"имя")}</span><span class="admin-user-email"><span>${esc(u.email)}</span>${copyButton(u.email,"email")}</span><span class="pro-tags">${AP.tagChips(u)}</span></div></td><td><div class="admin-user-role">${roleLabel(u)}</div><span class="admin-user-status${u.active ? " is-active" : ""}">${u.active ? "Активен" : "Доступ закрыт"}</span></td><td>${pointsButton(u.id)}</td><td><span class="admin-user-balance">${u.balance === null ? "—" : money(u.balance)}</span></td><td><div class="admin-user-actions"><button type="button" data-edit-user="${u.id}">Изменить</button>${u.id!==me.id ? `<button type="button" class="admin-user-remove" data-delete-user="${u.id}" aria-label="Удалить пользователя ${esc(u.name)}" title="Удалить пользователя"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M9 6V4h6v2M5 6l1 14h12l1-14M10 10v6m4-6v6"/></svg></button>` : ""}</div></td></tr>`,
      ),
    )}</div>${usersFilter === "master" ? `<h3 class="users-cards-title">Карточки мастеров на сайте</h3><p data-help class="small muted">Архивные карточки с главной. Укажите реальные имена, распределите работы и привяжите карточку к аккаунту мастера — тогда имя, резидентство и статистика будут браться из аккаунта. Личные страницы сохраняются, даже если карточка скрыта с главной.</p>${table(
      ["Фото", "Мастер", "Баллы", "На главной", ""],
      masters.map(
        (m) =>
          `<tr><td><img src="${m.photo}" alt="" style="width:44px;height:55px;object-fit:cover"></td><td>${esc(m.name)}</td><td>${pointsButton(legacyMasters[m.id-1].id)}</td><td><label class="check"><input type="checkbox" data-featured-master="${m.id}" aria-label="Показывать ${esc(m.name)} на главной" ${m.featured ? "checked" : ""}><span>${m.featured ? "Показывается" : "Скрыт"}</span></label></td><td><button data-edit-master="${m.id}">Личное дело</button> <button data-link-master="${m.id}">Привязать аккаунт</button></td></tr>`,
      ),
    )}` : ""}`;
  }
  if (adminTab === "catalog")
    body = `<div class="admin-tools">${AP.isShift() ? "" : '<button class="chrome" id="add-catalog">+ Товар или услуга</button>'}</div>${table(
      ["Позиция", "Тип", "Цена", "Остаток", ""],
      a.catalog.map(
        (x) =>
          `<tr><td><span class="extra__name">${esc(x.name)}${catalogHelp(x)}</span> ${x.active ? "" : "(скрыто)"}</td><td>${x.kind === "product" ? "Расходник" : "Услуга"}</td><td>${money(x.price)}</td><td>${x.kind === "product" ? `<span class="${x.stock <= (x.min_stock ?? 5) ? "pro-low" : ""}">${x.stock}</span> <small class="muted">мин. ${x.min_stock ?? 5}</small>` : "—"}</td><td>${x.kind === "product" ? `<button data-stock="${x.id}">Приход / списание</button> ` : ""}${AP.isShift() ? "" : `<button data-edit-catalog="${x.id}">Изменить</button>`}</td></tr>`,
      ),
    )}${AP.catalogExtrasHTML(a)}`;
  if (adminTab === "finance") body = AP.financeHTML(a, s);
  if (adminTab === "feedback") body = AP.feedbackHTML(a);
  if (adminTab === "settings")
    body = `<form id="settings-form"><fieldset class="admin-group"><legend>Студия и контакты</legend><div class="form-grid">${field("studioName", "Название", s.studioName)}${field("website", "Сайт в документах", s.website || "https://tattoo-office.com", "url")}${field("phone", "Телефон", s.phone)}${field("email", "Email студии", s.email, "email")}${select("openHour", "Открытие · МСК", Array.from({length:24},(_,h)=>[h,String(h).padStart(2,"0")+":00"]),s.openHour)}${select("closeHour", "Закрытие · МСК", Array.from({length:24},(_,i)=>[i+1,i===23?"00:00 следующего дня":String(i+1).padStart(2,"0")+":00"]),s.closeHour)}<p class="small muted wide" id="studio-hours-summary" aria-live="polite"></p></div></fieldset><fieldset class="admin-group"><legend>Студия по городам</legend><p data-help class="small muted">У каждой студии свой адрес и свои рабочие места. Часы работы общие для всех городов.</p>${cityTabs()}<div class="form-grid">${field("cityAddress", "Адрес студии", cityInfo(adminCity).address || "")}<label class="check wide"><input name="cityOpen" type="checkbox" ${cityInfo(adminCity).open ? "checked" : ""}><span>Запись в этом городе открыта${adminCity === "spb" ? "" : " (если выключено — на сайте «*soon»)"}</span></label></div><p class="small muted">Тарифы, предоплата и наценки — в разделе «Деньги → Цены и промокоды».</p></fieldset><fieldset class="admin-group"><legend>Бронирование</legend><div class="form-grid">${field("cancelHours", "Бесплатная отмена за, ч", s.cancelHours, "number", 'min="1" max="168"')}${field("reminderHours", "Напомнить за, ч", s.reminderHours, "number", 'min="1" max="168"')}${select(
      "lateCancellation",
      "Поздняя отмена",
      [
        ["review", "На рассмотрение администратора"],
        ["retain", "Удержать предоплату по регламенту"],
      ],
      s.lateCancellation,
    )}</div></fieldset>${AP.settingsFieldset(s)}<fieldset class="admin-group"><legend>Рейтинговые баллы</legend><p class="small muted">Финансовые баллы — после полного расчёта. Изменение весов пересчитывает весь рейтинг. Баллы не являются деньгами или скидкой.</p><div class="form-grid">${field("points_bookingPoints", "Баллы за базовую стоимость аренды", s.rankingRules?.bookingPoints ?? 70, "number", 'required min="0" max="100000" step="1" data-plain-number="true"')}${field("points_bookingRubles", "Базовая стоимость аренды, ₽", s.rankingRules?.bookingRubles ?? 3200, "number", 'required min="1" max="100000" step="1" data-plain-number="true"')}${field("points_servicePoints", "Баллы за одну оплаченную услугу", s.rankingRules?.servicePoints ?? 20, "number", 'required min="0" max="100000" step="1" data-plain-number="true"')}${field("points_productPointsPer1000", "Баллы за 1 000 ₽ товаров", s.rankingRules?.productPointsPer1000 ?? 5, "number", 'required min="0" max="100000" step="1" data-plain-number="true"')}${field("points_profilePoints", "Полный профиль", s.rankingRules?.profilePoints ?? 5, "number", 'required min="0" max="100000" step="1" data-plain-number="true"')}${field("points_workPoints", "Одна уникальная работа", s.rankingRules?.workPoints ?? 2, "number", 'required min="0" max="100000" step="1" data-plain-number="true"')}${field("points_draftPoints", "Один уникальный эскиз", s.rankingRules?.draftPoints ?? 1, "number", 'required min="0" max="100000" step="1" data-plain-number="true"')}${field("points_workLimit", "Лимит работ с баллами", s.rankingRules?.workLimit ?? 100, "number", 'required min="0" max="100000" step="1" data-plain-number="true"')}${field("points_draftLimit", "Лимит эскизов с баллами", s.rankingRules?.draftLimit ?? 20, "number", 'required min="0" max="100000" step="1" data-plain-number="true"')}</div></fieldset><fieldset class="admin-group"><legend>Реквизиты и документы</legend><div class="form-grid">${field("legalName", "Наименование ИП / ООО", s.legalName)}${field("inn", "ИНН", s.inn)}${field("ogrnip", "ОГРНИП", s.ogrnip || "")}${field("bankName", "Банк", s.bankName || "")}${field("bankBik", "БИК", s.bankBik || "")}${field("bankCorrespondent", "Корреспондентский счёт", s.bankCorrespondent || "")}${field("bankAccount", "Расчётный счёт", s.bankAccount || "")}${field("legalAddress", "Юридический адрес", s.legalAddress)}${field("rulesVersion", "Версия правил", s.rulesVersion)}<div class="wide">${textarea("rules", "Правила студии", s.rules)}${textarea("privacy", "Политика обработки данных", s.privacy)}${textarea("consent", "Отдельное согласие на обработку данных", s.consent)}${textarea("offer", "Оферта", s.offer)}</div></div><label class="check"><input name="legalApproved" type="checkbox" ${s.legalApproved ? "checked" : ""}><span>Документы проверены владельцем студии</span></label></fieldset><button type="submit" class="chrome">Сохранить настройки</button></form><h3 style="margin-top:35px">Подключения</h3>${table(
      ["Сервис", "Ключи"],
      Object.entries(a.integrations || {}).map(
        ([k, v]) =>
          `<tr><td>${esc(k)}</td><td>${v ? "заданы на сервере" : "не подключён"}</td></tr>`,
      ),
    )}<div class="note-paper">Режим: тестовый. Боевые платежи заблокированы до проверки кассы, документов и инфраструктуры в РФ. Секретные ключи задаются на сервере, в браузере не хранятся.</div>${AP.settingsLogHTML(a)}`;
  const strip = `<a class="admin-strip" href="#/admin" data-admintab="home"><svg class="admin-strip__icon" viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="adminPerson" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9c9c9"/><stop offset="1" stop-color="#8e8e8e"/></linearGradient></defs><circle cx="16" cy="10" r="6.5" fill="url(#adminPerson)"/><path d="M3.5 29c0-6.6 5.6-11 12.5-11s12.5 4.4 12.5 11z" fill="url(#adminPerson)"/></svg><u>Admin panel</u></a>`;
  void strip;
  // Главный экран: «Admin panel» и кнопки стоят на месте, прокручивается только сводка под ними.
  if (adminTab === "home") return `<section class="window admin-window--main">${homeHead}<div class="admin-content" data-admin-section="home">${body}</div></section>`;
  return win(
    group?.label || tabs.find(([value]) => value === adminTab)?.[1] || "Управление студией",
    `${group?.tabs.length > 1 ? `<nav class="admin-subnav" aria-label="${group.label}">${group.tabs.map(value=>`<button type="button" data-admintab="${value}" ${value === adminTab ? 'aria-current="page"' : ""}>${tabs.find(t=>t[0]===value)[1]}</button>`).join("")}</nav>` : ""}<div class="admin-content" data-admin-section="${adminTab}">${body}</div>`,
  );
}
// Сжимает фото в браузере до JPEG нужного размера перед загрузкой на сервер.
async function compressImage(file, max, longest) {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, longest / Math.max(bitmap.width, bitmap.height)), canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.85, 0.75, 0.62, 0.5]) {
      const value = canvas.toDataURL("image/jpeg", quality);
      if (value.length <= max) return value;
    }
    throw Error("Фотография слишком большая. Попробуйте другую.");
  } finally { bitmap.close(); }
}
function dialogForm(title, html, submit) {
  modal(
    `<h2>${title}</h2><form id="dialog-form">${html}<button type="submit" class="chrome">Сохранить</button></form>`,
  );
  UX.enhanceSelects($("#dialog-form"));
  onForm("#dialog-form", async (d) => {
    const result = await submit(d);
    $("#dialog").close();
    // В админке после действия обновляем только данные админки (быстро, без мигания);
    // если изменение уже применено на месте — перерисовываем без запроса к серверу.
    if (location.hash.startsWith("#/admin")) { adminCache = !!result?.__cached; await render(); refresh().catch(() => {}); }
    else { await refresh(); await render(); }
    notify("Сохранено");
  });
}
function mountAdmin() {
  if (adminScrollTo) {
    const target = document.getElementById(adminScrollTo);
    adminScrollTo = "";
    if (target) requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }));
  }
  if (!me) {
    mountAdminAuth();
    return;
  }
  if (!adminData) return;
  const a = adminData;
  const head = $(".window-head");
  if (head && !$("#admin-search")) head.insertAdjacentHTML("beforeend", `<div class="admin-head-actions">${adminTab !== "home" ? '<button class="chrome admin-back" data-admintab="home"><svg class="ui-icon" aria-hidden="true"><use href="#ui-chevron-left"></use></svg>Назад</button>' : ""}<button type="button" class="admin-search" id="admin-search" aria-label="Поиск по админке (Ctrl+K)"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><span>Поиск</span></button></div>`);
  $$("[data-copy-value]").forEach(button => button.onclick = async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copyValue);
      notify(button.dataset.copyLabel === "имя" ? "Имя скопировано" : "Email скопирован");
    } catch { notify("Не удалось скопировать. Выделите текст и скопируйте вручную."); }
  });
  $$("[data-delete-user]").forEach(button => button.onclick = () => {
    const user=a.users.find(u=>u.id===button.dataset.deleteUser);
    modal(`<h2>Удалить пользователя?</h2><p>${esc(user.name)} · ${esc(user.email)}</p><p>Пользователь исчезнет из списка и потеряет доступ к аккаунту. История броней и платежей сохранится.</p><div class="admin-delete-actions"><button type="button" class="chrome" id="confirm-delete-user">Удалить пользователя</button><button type="button" class="chrome" id="cancel-delete-user">Отмена</button></div>`);
    $("#cancel-delete-user").onclick=()=>$("#dialog").close();
    $("#confirm-delete-user").onclick=async event=>{
      event.currentTarget.disabled=true;
      try {
        await api("/admin/users/"+encodeURIComponent(user.id),"DELETE");
        $("#dialog").close();await refresh();await render();notify("Пользователь удалён");
      } catch(error) {notify(error.message);if($("#confirm-delete-user"))$("#confirm-delete-user").disabled=false;}
    };
  });
  $$("[data-edit-points]").forEach(button => button.onclick = () => {
    const master = a.masterPoints.find(m => m.id === button.dataset.editPoints);
    dialogForm("Баллы мастера", `<p>${esc(master.name)}</p>${field("score","Количество баллов",master.score,"number",'required min="0" max="10000000" step="1" data-plain-number="true"')}<p class="small muted">Укажите новый итог. За следующие оплаченные брони и действия баллы продолжат начисляться автоматически.</p>`, d => api("/admin/masters/"+encodeURIComponent(master.id)+"/points","PATCH",{score:Number(d.score)}));
  });
  const content = $(".admin-content");
  if (content) {
    const settings = content.querySelector("#settings-form");
    if (settings) {
      const fields = [...settings.querySelectorAll(":scope > fieldset")];
      const sections = [
        ["Студия и бронирование", fields.slice(0,3)],
        ["Автоматизация", fields.slice(3,4)],
        ["Рейтинг мастеров", fields.slice(4,5)],
        ["Документы и подключения", fields.slice(5)],
      ];
      sections.forEach(([title, nodes], index) => {
        const section = document.createElement("details");
        section.className = "admin-settings-section";
        section.open = index === 0;
        const summary = document.createElement("summary");
        summary.textContent = title;
        section.append(summary);
        nodes[0].before(section);
        section.append(...nodes);
        if (index === 3) while (settings.nextSibling) section.append(settings.nextSibling);
      });
      settings.addEventListener("invalid", event => {
        const section = event.target.closest("details");
        if (section) section.open = true;
      }, true);
    }
    $$(".table-wrap", content).forEach((wrap, tableIndex) => {
      const headers = $$("th", wrap).map(cell => cell.textContent.trim());
      const rows = $$("tbody tr", wrap);
      rows.forEach(row => $$("td", row).forEach((cell, index) => {
        cell.dataset.label = headers[index] || "Действия";
        const value = document.createElement("div");
        value.className = "admin-cell-value";
        value.append(...cell.childNodes);
        cell.append(value);
      }));
      if (rows.length > 1 && !wrap.closest("[data-own-search]")) {
        const toolbar = document.createElement("div");
        toolbar.className = "admin-list-tools";
        const label = document.createElement("label");
        label.className = "field";
        label.innerHTML = `<span>Поиск в списке</span><input type="search" placeholder="Имя, дата, статус…" aria-label="Поиск в списке ${tableIndex + 1}">`;
        const count = document.createElement("span");
        count.className = "small muted";
        const update = () => {
          const query = label.querySelector("input").value.trim().toLocaleLowerCase("ru");
          let visible = 0;
          rows.forEach(row => {
            row.hidden = !row.textContent.toLocaleLowerCase("ru").includes(query);
            if (!row.hidden) visible++;
          });
          count.textContent = `${visible} из ${rows.length}`;
        };
        label.querySelector("input").addEventListener("input", update);
        toolbar.append(label, count);
        wrap.before(toolbar);
        update();
      }
    });
    const summaries = {
      catalog: [["Расходники", a.catalog.filter(x => x.kind === "product" && x.active).length], ["Услуги", a.catalog.filter(x => x.kind !== "product" && x.active).length]],
      feedback: [["Новые обращения", a.feedback.filter(f => f.status === "new").length], ["В работе", a.feedback.filter(f => f.status === "in_progress").length], ["Обработано", a.feedback.filter(f => f.status === "done").length]]
    };
    function safemodeLabel() { return pub.settings.mode === "test" ? "Тестовые оплаты" : "Успешные оплаты"; }
    if (summaries[adminTab]) {
      const summary = document.createElement("div");
      summary.className = "admin-summary";
      summary.innerHTML = summaries[adminTab].map(([label, value]) => `<div><span>${esc(label)}</span><strong>${esc(String(value))}</strong></div>`).join("");
      content.prepend(summary);
    }
  }
  onForm("#admin-profile-form", async d => { await api("/me", "PATCH", {name:d.name}); await refresh(); notify("Профиль сохранён"); render(); });
  onForm("#admin-password-form", async d => { await api("/me/password", "POST", d); await refresh(); go("admin/login"); notify("Пароль изменён. Войдите заново."); });
  $$("[data-admin-city]").forEach(
    (b) =>
      (b.onclick = () => {
        adminCity = b.dataset.adminCity;
        render();
      }),
  );
  $$("[data-admintab]").forEach(
    (b) =>
      (b.onclick = () => {
        if (!UX.confirmLeave()) return;
        adminTab = b.dataset.admintab;
        document.body.classList.remove("mobile-menu-open");
        $("#mobileMenuToggle").setAttribute("aria-expanded", "false");
        render();
      }),
  );
  if ($("#admin-date"))
    $("#admin-date").onchange = (e) => {
      adminDate = e.target.value || today();
      render();
    };
  const userForm = (u, defaultRole = "guest") =>
    dialogForm(
      u ? "Права и почта" : "Новое личное дело",
      `${!u ? field("name", "Имя", "", "text", "required") : ""}${field("email", "Email", u?.email || "", "email", "required")}${!u ? field("password", "Временный пароль", "", "password", 'required minlength="12" maxlength="128"') : ""}${select(
        "role",
        "Роль",
        Object.entries(roleName).filter(
          ([r]) => me.role === "admin" || r === "guest",
        ),
        u?.role || defaultRole,
      )}${(!u || u.account_type === "master") ? field("bookingLink","Ссылка на чат в Telegram",u?.booking_link||"","url",'maxlength="2048" placeholder="https://t.me/имя"') : ""}${u ? `<label class="check"><input name="depositWaived" type="checkbox" ${u.deposit_waived ? "checked" : ""}> Без предоплаты · расчёт наличными</label><p data-help class="small muted">Только для резидентов. Применяется к новым записям.</p><label class="check"><input name="active" type="checkbox" ${u.active ? "checked" : ""}> Доступ активен</label>` : ""}`,
      (d) =>
        api("/admin/users" + (u ? "/" + u.id : ""), u ? "PATCH" : "POST", {
          ...d,
          ...(u ? { active: d.active === "on", depositWaived: d.role === "resident" && d.depositWaived === "on" } : {}),
        }),
    );
  if ($("#add-user")) $("#add-user").onclick = () => userForm(null, adminTab === "users" && usersFilter === "admin" ? "admin" : "guest");
  $$("[data-users-filter]").forEach(
    (b) =>
      (b.onclick = () => {
        usersFilter = b.dataset.usersFilter;
        render();
      }),
  );
  $$("[data-users-tag]").forEach((b) => (b.onclick = () => { usersTag = usersTag === b.dataset.usersTag ? "" : b.dataset.usersTag; render(); }));
  AP.mount(adminTab);
  $$("[data-edit-user]").forEach(
    (b) =>
      (b.onclick = () =>
        userForm(a.users.find((u) => u.id === b.dataset.editUser))),
  );
  const catalogForm = (x) =>
    dialogForm(
      x ? "Карточка позиции" : "Новая позиция",
      `${field("name", "Название", x?.name || "", "text", "required")}${select(
        "kind",
        "Тип",
        [
          ["product", "Расходник"],
          ["service", "Услуга"],
        ],
        x?.kind || "product",
      )}${field("price", "Цена, ₽", (x?.price || 0) / 100, "number", 'required min="0" step="1"')}${field("stock", "Остаток", x?.stock || 0, "number", 'required min="0" step="1"')}${field("minStock", "Минимальный остаток (предупреждение)", x?.min_stock ?? 5, "number", 'required min="0" step="1" data-plain-number="true"')}<label class="check"><input name="active" type="checkbox" ${x?.active !== false ? "checked" : ""}> Показывать при записи</label>`,
      (d) =>
        api("/admin/catalog", "POST", {
          ...d,
          id: x?.id,
          price: Math.round(Number(d.price) * 100),
          stock: Number(d.stock),
          minStock: Number(d.minStock),
          active: d.active === "on",
        }),
    );
  if ($("#add-catalog")) $("#add-catalog").onclick = () => catalogForm();
  $$("[data-edit-catalog]").forEach(
    (b) =>
      (b.onclick = () =>
        catalogForm(a.catalog.find((x) => x.id === b.dataset.editCatalog))),
  );
  const resourceForm = (r) => {
    const presets = [1, 2, 3, 4].map((n) => `assets/interior/${n}.jpg`),
      current = r ? resourcePhoto(r) : presets[0],
      choices = presets.includes(current) ? presets : [current, ...presets],
      option = (src) => `<label class="photo-choice"><input type="radio" name="photoChoice" value="${esc(src)}" ${src === current ? "checked" : ""}><img src="${esc(src)}" alt="" loading="lazy"></label>`;
    dialogForm(
      r ? "Рабочее место" : "Новое рабочее место",
      `${field("name", "Название", r?.name || "", "text", 'required maxlength="100"')}<fieldset class="photo-picker"><legend>Фотография</legend><div class="photo-picker__grid" id="photo-choices">${choices.map(option).join("")}</div><input type="hidden" name="photo" value="${esc(current)}"><input type="file" id="workspace-photo-file" accept="image/jpeg,image/png,image/webp" hidden><button type="button" class="chrome" id="workspace-photo-upload">Загрузить своё фото</button><p class="small muted" id="workspace-photo-status" role="status" aria-live="polite">JPG, PNG или WebP до 12 МБ.</p></fieldset>${select("city", "Город", CITY_IDS.map((id) => [id, CITY_LABELS[id]]), r ? resourceCity(r) : adminCity)}${field("calendarId", "Google Calendar ID", r?.calendar_id || "")}<label class="check"><input name="active" type="checkbox" ${r?.active !== false ? "checked" : ""}> Принимать записи</label>`,
      (d) => {
        const { photoChoice, ...data } = d;
        return api("/admin/resources", "POST", { ...data, id: r?.id, active: d.active === "on" });
      },
    );
    const form = $("#dialog-form"), status = $("#workspace-photo-status"), file = $("#workspace-photo-file"), upload = $("#workspace-photo-upload");
    const choose = () => (form.elements.photo.value = form.querySelector('[name="photoChoice"]:checked')?.value || "");
    form.addEventListener("change", (e) => { if (e.target.name === "photoChoice") choose(); });
    upload.onclick = () => file.click();
    file.onchange = async () => {
      const picked = file.files[0];
      file.value = "";
      if (!picked) return;
      if (!["image/jpeg", "image/png", "image/webp"].includes(picked.type) || picked.size > 12 * 1024 * 1024) { status.textContent = "Выберите JPG, PNG или WebP до 12 МБ"; return; }
      upload.disabled = true; status.textContent = "Загружаем фотографию…";
      try {
        const image = await compressImage(picked, 900000, 1600), thumbnail = await compressImage(picked, 60000, 400);
        const { src } = await api("/admin/media", "POST", { image, thumbnail });
        $("#photo-choices").insertAdjacentHTML("afterbegin", option(src));
        form.querySelector(`[name="photoChoice"][value="${src}"]`).checked = true;
        choose();
        status.textContent = "Фото загружено. Нажмите «Сохранить».";
      } catch (error) { status.textContent = error.message; }
      finally { upload.disabled = false; }
    };
  };
  if ($("#add-resource")) $("#add-resource").onclick = () => resourceForm();
  $$("[data-delete-resource]").forEach(
    (b) =>
      (b.onclick = async () => {
        const r = a.resources.find((x) => x.id === b.dataset.deleteResource);
        if (!r || !confirm(`Удалить рабочее место «${r.name}»?`)) return;
        b.disabled = true;
        try {
          const result = await api("/admin/resources/" + r.id, "DELETE");
          await refresh();
          await render();
          notify(result.archived ? "Место удалено. История записей сохранена." : "Место удалено");
        } catch (error) {
          b.disabled = false;
          notify(error.message);
        }
      }),
  );
  $$("[data-edit-resource]").forEach(
    (b) =>
      (b.onclick = () =>
        resourceForm(a.resources.find((x) => x.id === b.dataset.editResource))),
  );
  const openBlock = (preset = {}) => {
    const hh = (h) => String(h % 24).padStart(2, "0") + ":00", from = preset.hour ?? 10, to = preset.hours ? from + preset.hours : 22;
    const endDate = to >= 24 ? addDate(adminDate, 1) : adminDate;
      dialogForm(
        "Закрыть время",
        `${select("resourceId", "Рабочее место", [["", "Все места во всех городах"], ...a.resources.map((r) => [r.id, CITY_LABELS[resourceCity(r)] + " · " + r.name])], preset.resourceId || "")}${field("startsAt", "Начало (время Москвы)", adminDate + "T" + hh(from), "datetime-local", "required")}${field("endsAt", "Конец (время Москвы)", endDate + "T" + hh(to), "datetime-local", "required")}${field("reason", "Причина (необязательно)", "", "text", 'maxlength="200"')}`,
        (d) =>
          api("/admin/blocks", "POST", {
            ...d,
            startsAt: d.startsAt + ":00+03:00",
            endsAt: d.endsAt + ":00+03:00",
          }).then((r) => {
            // Сразу показываем закрытое время, не дожидаясь повторной загрузки.
            if (!r?.id) return r;
            adminData.blocks.unshift({ id: r.id, resource_id: d.resourceId || null, starts_at: new Date(d.startsAt + ":00+03:00").toISOString(), ends_at: new Date(d.endsAt + ":00+03:00").toISOString(), reason: d.reason || "Закрыто", external: false });
            return { __cached: true };
          }),
      );
  };
  if ($("#add-block")) $("#add-block").onclick = () => openBlock();
  $$("[data-delete-block]").forEach(
    (b) =>
      (b.onclick = async () => {
        try {
          await api("/admin/blocks/" + b.dataset.deleteBlock, "DELETE");
          render();
        } catch (e) {
          notify(e.message);
        }
      }),
  );
  const openManual = (preset = {}) =>
      dialogForm(
        "Новая запись без предоплаты",
        `${select(
          "userId",
          "Мастер",
          a.users
            .filter((u) => u.active && ["resident", "guest"].includes(u.role))
            .map((u) => [u.id, u.name]),
          "",
        )}${field("date", "Дата", adminDate, "date", "required")}${select("hour", "Начало, МСК", Array.from({ length: 24 }, (_, h) => [h, String(h).padStart(2, "0") + ":00"]), preset.hour ?? 10)}${select(
          "duration",
          "Тариф",
          [
            [3, "До 3 часов"],
            [6, "До 6 часов"],
            [12, "До 12 часов"],
          ],
          preset.hours > 6 ? 12 : preset.hours > 3 ? 6 : 3,
        )}${select(
          "resourceId",
          "Место",
          a.resources.filter((r) => r.active).map((r) => [r.id, CITY_LABELS[resourceCity(r)] + " · " + r.name]),
          preset.resourceId || a.resources.find((r) => r.active && resourceCity(r) === adminCity)?.id || "",
        )}${select("repeat", "Повторять", [[1, "Не повторять"], [4, "Каждую неделю · 4 раза"], [8, "Каждую неделю · 8 раз"], [12, "Каждую неделю · 12 раз"]], 1)}<p data-help class="small muted">Сервер проверит доступность. Предоплата не требуется. При повторе занятые даты пропускаются.</p>`,
        (d) => AP.manualRepeat(d),
      );
  if ($("#manual-booking")) $("#manual-booking").onclick = () => openManual();
  adminContext.openManual = () => openManual();
  adminContext.shiftDay = (n) => { adminDate = addDate(adminDate, n); render(); };
  UX.mountTimeline({ onBook: (p) => openManual(p), onClose: (p) => openBlock(p) });
  UX.mountDrag({ onMove: async (id, t) => {
    await api(`/admin/bookings/${id}/move`, "POST", { resourceId: t.rid, hour: t.hour, date: adminDate });
    // Перенос уже виден на экране: обновляем данные на месте, без перезагрузки и мигания.
    const b = adminData.bookings.find((x) => x.id === id);
    if (b) { const dur = new Date(b.ends_at) - new Date(b.starts_at), start = new Date(`${adminDate}T${String(t.hour).padStart(2, "0")}:00:00+03:00`); b.resource_id = t.rid; b.resource_name = adminData.resources.find((r) => r.id === t.rid)?.name || b.resource_name; b.starts_at = start.toISOString(); b.ends_at = new Date(start.getTime() + dur).toISOString(); }
    notify("Запись перенесена");
    adminCache = true; await render();
  } });
  $$("[data-new-slot]").forEach((b) => (b.onclick = () => { const [resourceId, hour] = b.dataset.newSlot.split("|"); openManual({ resourceId, hour: Number(hour) }); }));
  $$("[data-day-shift]").forEach((b) => (b.onclick = () => { adminDate = b.dataset.dayShift === "0" ? today() : addDate(adminDate, Number(b.dataset.dayShift)); render(); }));
  $$("[data-schedule-view]").forEach((b) => (b.onclick = () => { scheduleView = b.dataset.scheduleView; render(); }));
  const statusFilter = $('.admin-content [name="listStatus"]');
  if (statusFilter) statusFilter.onchange = () => { listStatus = statusFilter.value; render(); };
  const listSearch = $("#list-search");
  if (listSearch) listSearch.oninput = () => { const q = listSearch.value.trim().toLocaleLowerCase("ru"); $$("[data-own-search] tbody tr").forEach((row) => { row.hidden = !!q && !row.textContent.toLocaleLowerCase("ru").includes(q); }); };
  if ($("#tl-night")) $("#tl-night").onclick = () => { UX.toggleNight(); render(); };
  if ($("#admin-search")) $("#admin-search").onclick = UX.openSearch;
  UX.mountPricing(adminCity);
  UX.guardForms();
  UX.bindKeys();
  $$("[data-cash-payment]").forEach(button => button.onclick = () => dialogForm("Подтвердить наличный расчёт", '<p>Отметьте оплату только после получения наличных. Запись будет закрыта как оплаченная.</p>', () => api("/admin/payments/" + button.dataset.cashPayment + "/cash", "POST", {})));
  $$("[data-invoice]").forEach(
    (btn) =>
      (btn.onclick = () => {
        const b = a.bookings.find((x) => x.id === btn.dataset.invoice);
        dialogForm(
          "Итоговый счёт",
          `${select(
            "duration",
            "Тариф после сеанса",
            [3, 6, 12]
              .filter((h) => h >= b.tariff)
              .map((h) => [h, `До ${h} часов`]),
            b.tariff,
          )}<p class="small muted">Предоплата ${money(b.deposit)} будет вычтена. Счёт появится в кабинете мастера.</p>`,
          (d) =>
            api("/admin/bookings/" + b.id + "/invoice", "POST", {
              duration: Number(d.duration),
            }),
        );
      }),
  );
  $$("[data-resolve]").forEach(
    (btn) =>
      (btn.onclick = () =>
        dialogForm(
          "Решение по отмене",
          select(
            "credit",
            "Предоплата",
            [
              ["yes", "Вернуть на внутренний баланс"],
              ["no", "Удержать по регламенту"],
            ],
            "yes",
          ),
          (d) =>
            api(
              "/admin/bookings/" + btn.dataset.resolve + "/resolve-cancel",
              "POST",
              { credit: d.credit === "yes" },
            ),
        )),
  );
  $$("[data-feedback]").forEach(
    (b) =>
      (b.onclick = async () => {
        try {
          await api("/admin/feedback/" + b.dataset.feedback, "PATCH", {
            status: b.dataset.status,
          });
          render();
        } catch (e) {
          notify(e.message);
        }
      }),
  );
  $$("[data-featured-master]").forEach((input) => {
    input.onchange = async () => {
      const m = masters.find((x) => x.id === +input.dataset.featuredMaster);
      input.disabled = true;
      try {
        await api("/admin/content/master-" + m.id, "PUT", {
          title: m.name, body: m.bio, specialty: m.specialty,
          bookingLink: m.bookingLink,
          portfolio: m.portfolio, drafts: m.drafts,
          published: true, featured: input.checked,
        });
        await refresh();
        await render();
        notify("Главная страница обновлена");
      } catch (error) {
        input.checked = !input.checked;
        input.disabled = false;
        notify(error.message);
      }
    };
  });
  $$('[data-link-master]').forEach(button=>button.onclick=async()=>{
    const master=legacyMasters[Number(button.dataset.linkMaster)-1];
    const {userId}=await api('/admin/masters/'+master.id+'/account');
    dialogForm('Привязать аккаунт',`<p>Карточка: ${esc(window.I18N.pick(master.name))}</p>${select('userId','Аккаунт мастера',[['','Отвязать аккаунт'],...adminData.users.filter(u=>u.account_type==='master'&&u.role!=='admin'&&u.active).map(u=>[u.id,u.name+' · '+u.email])],userId||'')}<p class="small muted">После привязки имя, резидентство, портфолио и статистика будут браться из этого аккаунта.</p>`,d=>api('/admin/masters/'+master.id+'/account','PUT',{userId:d.userId}));
  });
  $$("[data-edit-master]").forEach(
    (b) =>
      (b.onclick = () => {
        const m = masters.find((x) => x.id === +b.dataset.editMaster);
        dialogForm(
          "Личное дело мастера",
          `${field("title", "Имя", m.name, "text", "required")}${field("specialty", "Стиль", m.specialty)}${field("bookingLink", "Ссылка на чат менеджера для записи", m.bookingLink, "url")}<p data-help class="small muted">Можно указать t.me/имя или готовую ссылку Telegram Business t.me/m/код. Для каждого мастера сохраните ссылку с его текстом на одного менеджера. В Business-ссылках сообщение задаётся в Telegram; такие ссылки открываются без изменений.</p>${textarea("body", "О мастере", m.bio)}${field("portfolio", "Работы: tattoo-1, tattoo-2…", m.portfolio.join(", "))}${field("drafts", "Эскизы: draft-1, draft-2…", m.drafts.join(", "))}<label class="check"><input name="featured" type="checkbox" ${m.featured ? "checked" : ""}><span>Показывать на главной</span></label><p data-help data-help-for="[name=drafts]" class="small muted">Доступны tattoo-1…8 и draft-1…7 из загруженного архива.</p>`,
          (d) =>
            api("/admin/content/master-" + m.id, "PUT", {
              ...d,
              published: true,
              featured: d.featured === "on",
              portfolio: d.portfolio
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean),
              drafts: d.drafts
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean),
            }),
        );
      }),
  );
  const settingsForm = $("#settings-form");
  if (settingsForm) {
    const opening = settingsForm.elements.openHour, closing = settingsForm.elements.closeHour;
    const syncHours = () => {
      for (const option of closing.options) option.disabled = Number(option.value) <= Number(opening.value);
      if (Number(closing.value) <= Number(opening.value)) {
        closing.value = String(Number(opening.value) + 1);
        closing.dispatchEvent(new Event("change", {bubbles:true}));
      }
      $("#studio-hours-summary").textContent = Number(opening.value) === 0 && Number(closing.value) === 24
        ? "Студия работает круглосуточно. Время по Москве."
        : `Рабочий день — ${Number(closing.value) - Number(opening.value)} ч. Время по Москве.`;
    };
    opening.addEventListener("change", syncHours); closing.addEventListener("change", syncHours); syncHours();
  }
  onForm("#settings-form", async (d) => {
    const automation = AP.settingsPayload(d);
    const { cityAddress, cityOpen, ...rest } = d,
      city = { open: cityOpen === "on", address: cityAddress || "" };
    await api("/admin/settings", "PATCH", {
      ...rest,
      cities: { [adminCity]: city },
      openHour: Number(d.openHour),
      closeHour: Number(d.closeHour),
      cancelHours: Number(d.cancelHours),
      reminderHours: Number(d.reminderHours),
      rankingRules:Object.fromEntries(["bookingPoints","bookingRubles","servicePoints","productPointsPer1000","profilePoints","workPoints","draftPoints","workLimit","draftLimit"].map(k=>[k,Number(d["points_"+k])])),
      legalApproved: d.legalApproved === "on",
      ...automation,
    });
    await refresh();
    notify("Настройки студии сохранены");
    render();
  });
}
function documentSections(text, titles = [], tag = "h2") {
  return String(text || "").trim().split(/\n\s*\n/).filter(Boolean).map((block, i) => {
    const lines = block.trim().split("\n");
    const explicit = /^(?:\d+[.)]\s|#{1,3}\s)/.test(lines[0]);
    const heading = explicit ? lines.shift().replace(/^#{1,3}\s/, "") : titles[i];
    return `<section class="document-section">${heading ? `<${tag}>${esc(heading)}</${tag}>` : ""}${lines.filter(Boolean).map(line => `<p>${esc(line)}</p>`).join("")}</section>`;
  }).join("");
}
function legalPage(key) {
  const s = pub.settings;
  const titles = {privacy:"Политика обработки данных",offer:"Оферта",data:"Согласие на обработку данных",info:"Реквизиты студии"};
  const headings = {
    privacy:["Какие данные мы обрабатываем","Для чего нужны данные и кто имеет доступ","Ваши права и срок хранения"],
    offer:["Рабочее место и стоимость","Подтверждение и перенос записи","Работа в студии и дополнительные услуги","Отмена и возврат"],
    data:["На что вы даёте согласие","Обработка данных и отзыв согласия"],
  };
  const details = (title, rows) => `<section class="document-details"><h2>${title}</h2><dl>${rows.filter(([,value])=>value).map(([label,value,href])=>`<div><dt>${label}</dt><dd>${href ? `<a href="${esc(href)}">${esc(value)}</a>` : esc(value)}</dd></div>`).join("")}</dl></section>`;
  const website = s.website || "https://tattoo-office.com";
  const contacts = details("Реквизиты и контакты",[
    ["Исполнитель / оператор",s.legalName],
    ["ОГРНИП",s.ogrnip],["ИНН",s.inn],
    ["Юридический адрес",s.legalAddress],
    ["Сайт",website.replace(/^https?:\/\//,""),/^https?:\/\//.test(website)?website:null],
    ["Электронная почта",s.email,s.email?"mailto:"+s.email:null],
    ["Телефон поддержки",s.phone,s.phone?"tel:"+s.phone.replace(/[^+\d]/g,""):null],
  ]);
  const bank = details("Банковские реквизиты",[
    ["Банк",s.bankName],["БИК",s.bankBik],["Корреспондентский счёт",s.bankCorrespondent],["Расчётный счёт",s.bankAccount],
  ]);
  const intro = key === "info"
    ? '<div class="document-intro"><p>Tattoo Office — тату-студия и рабочее пространство для мастеров.</p><p>The Tattoo Office Private Club — клуб постоянных мастеров Tattoo Office с особыми условиями аренды.</p></div>'
    : documentSections(s[key === "data" ? "consent" : key],headings[key]);
  return win(titles[key] || "Документы", `<article class="prose legal-document">${intro}${contacts}${["info","offer"].includes(key)?bank:""}</article>`, legalReturnRoute.slice(2));
}
let lastRenderKey = "";
// Админка после перезагрузки открывается на том же разделе, дне и месте прокрутки.
const savedAdmin = (() => { try { return JSON.parse(sessionStorage.getItem("to.admin")) || {}; } catch { return {}; } })();
if (savedAdmin.tab) adminTab = savedAdmin.tab;
if (savedAdmin.date) adminDate = savedAdmin.date;
if (savedAdmin.view) scheduleView = savedAdmin.view;
if (savedAdmin.city) adminCity = savedAdmin.city;
const saveAdmin = (extra = {}) => { try { sessionStorage.setItem("to.admin", JSON.stringify({ ...JSON.parse(sessionStorage.getItem("to.admin") || "{}"), tab: adminTab, date: adminDate, view: scheduleView, city: adminCity, ...extra })); } catch {} };
let scrollSaveBound = false;
async function render() {
  if (!$("#office-view")) return;
  residentInfoCleanup();
  const version = ++routeVersion;
  const path = (location.hash || "#/masters").replace(/^#\//, "").split("/");
  paintShell();
  try {
    let html,
      mount = () => {};
    if (window.OFFICE_PUBLIC_ONLY && ["login", "signup", "cabinet", "admin", "booking", "payment", "feedback", "book"].includes(path[0])) {
      $("#office-view").innerHTML = win("Личный кабинет", '<div class="service-pending"><h2>Запись и личный кабинет скоро откроются.</h2><p>Команда подключает защищённое хранение аккаунтов и расписание. Пока можно познакомиться с мастерами и пространством.</p><div><a class="chrome" href="#/masters">Мастера →</a><a class="chrome" href="#/interior">Пространство →</a></div></div>');
      return;
    }
    switch (path[0]) {
      case "ranking":
        html = await rankingPage();
        mount=()=>{
          const filter=()=>{let count=0;const query=$('#ranking-search').value.trim().toLocaleLowerCase('ru');
            $$('[data-ranking-name]').forEach(row=>{row.hidden=!row.dataset.rankingName.includes(query);if(!row.hidden)count++;});
            if($('#ranking-empty'))$('#ranking-empty').hidden=count>0;
          };
          $('#ranking-search').oninput=()=>{residentInfoCleanup();filter();mountResidentInfo();};
          $$('.ranking-row[data-profile-url]').forEach(row=>row.onclick=e=>{if(!e.target.closest('a,button'))location.hash=row.dataset.profileUrl;});
          mountResidentInfo();
        };
        break;
      case "masters":
      case "":
        html = mastersPage();
        mount = mountMasters;
        break;
      case "master":
        // Мастер, добавленный только что в админке, может ещё не быть в загруженном каталоге.
        if (!window.DATA.masters.some((m) => String(m.id) === path[1]) && !window.OFFICE_PUBLIC_ONLY) await refresh();
        html = masterPage(path[1]);
        mount = () => mountMaster(path[1]);
        break;
      case "interior":
        html = interiorPage();
        mount = () => {
          window.StudioModel?.mount($("#studio-model"));
          $$("[data-interior]").forEach((b) => b.onclick = () => window.PhotoViewer.open([1,2,3,4].map((i) => ({ src: `assets/interior/${i}.jpg`, caption: ["Общая зона","Рабочий кабинет","Студия в работе","Ещё один ракурс"][i-1] })), Number(b.dataset.interior)));
        };
        break;
      case "booking":
        if (me) me.loyalty = (await api("/bookings")).loyalty;
        if (draft.city && draft.step === 1)
          availability = await api(
            `/availability?date=${draft.date}&duration=${draft.duration}&city=${draft.city}`,
          );
        html = bookingPage();
        mount = mountBooking;
        break;
      case "forgot":
      case "reset":
        html = recoveryPage(path[0] === "reset");
        mount = () => mountRecovery(path[0] === "reset");
        break;
      case "login":
      case "signup":
        // Профиль создают только тату-мастера.
        if (path[0] === "signup" && path[1] === "customer") { location.hash = "#/signup/master"; return; }
        html = authPage(path[0] === "signup");
        mount = () => mountAuth(path[0] === "signup");
        break;
      case "cabinet":
        if (me?.role === "admin") { adminTab = "profile"; go("admin"); return; }
        html = await cabinetPage();
        mount = mountCabinet;
        break;
      case "admin":
        html = path[1] === 'login' ? adminAuthPage() : await adminPage();
        mount = path[1] === 'login' ? mountAdminAuth : mountAdmin;
        break;
      case "payment":
        html = await paymentPage(path[1]);
        mount = () => {
          if ($("#upgrade-invoice"))
            $("#upgrade-invoice").onclick = async () => {
              try {
                await api(
                  "/bookings/" +
                    $("#upgrade-invoice").dataset.booking +
                    "/upgrade",
                  "POST",
                  { duration: Number($("[name=upgrade]").value) },
                );
                render();
              } catch (e) {
                notify(e.message);
              }
            };
          if ($("#card-pay"))
            $("#card-pay").onclick = async () => {
              try {
                $("#card-pay").disabled = true;
                const config = await api("/payments/" + path[1] + "/checkout", "POST");
                window.location.assign(config.confirmationUrl);
              } catch (e) {
                notify(e.message || "Не удалось открыть кассу");
                $("#card-pay").disabled = false;
              }
            };
          if ($("#payment-refresh")) $("#payment-refresh").onclick = () => render();
          if ($("#test-pay"))
            $("#test-pay").onclick = async (e) => {
              e.currentTarget.disabled = true;
              try {
                await api("/payments/" + path[1] + "/test", "POST");
                await refresh();
                notify("Тестовая оплата подтверждена");
                go("cabinet");
              } catch (error) {
                notify(error.message);
                e.currentTarget.disabled = false;
              }
            };
        };
        break;
      case "find":
        html = findPage();
        mount = () => { $("#location-map-open").onclick = () => window.PhotoViewer.open([{src:"assets/location-map-v6.svg",caption:"Tattoo Office · Кирочная, 24"}],0); };
        break;
      case "safety":
        html = safetyPage();
        mount = () => {
          const rules = $(".rules-full");
          rules.addEventListener("toggle", () => {
            if (!rules.open) return;
            requestAnimationFrame(() => {
              if (rules.isConnected && rules.open) $(".rules-full__text", rules).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',block:'start'});
            });
          });
        };
        break;
      case "archive": {
        html = archivePage();
        break;
      }
      case "book":
      case "feedback":
        html = win(
          "Feedback",
          `<form id="feedback-form" class="auth-form"><h2>Как Tattoo Office стать лучше?</h2><p data-help class="small muted">Пожалуйста, оставьте свой искренний честный комментарий, который поможет нам стать лучше. Ваше анонимное сообщение увидит команда студии. Мы изучим вашу идею/предложение/замечание.\n\nЕсли нужен ответ, оставьте способ связи.\n\nС любовью и заботой, ваш T.Office ❤️</p>${textarea("message", "Ваше мнение формирует наш путь. Поделитесь им.")}${field("contact", "Email или Telegram для ответа (необязательно)", "", "text", 'maxlength="200" autocomplete="email"')}<button class="chrome" type="submit">Отправить →</button><p class="manager-contact">Связь и все вопросы — ${managerLink()}.</p></form>`,
        );
        mount = () => {
          if (path[0] === "book") {
            const master = window.DATA.masterById(path[1]);
            const name = master?.name?.ru || master?.name || "мастеру";
            $('#feedback-form [name="message"]').value = `Хочу записаться к ${name}.\nМоя идея: \nСвязаться со мной: `;
          }
          onForm("#feedback-form", async (d, f) => {
            await api("/feedback", "POST", d);
            f.reset();
            notify("Сообщение передано команде студии");
          });
        };
        break;
      case "about":
        html = aboutPage();
        break;
      case "club":
        html = clubPage();
        break;
      case "legal":
        html = legalPage(path[1]);
        break;
      default:
        html = win(
          "Страница не найдена",
          '<p>В этой папке пусто.</p><a href="#/masters">Вернуться в офис →</a>',
        );
    }
    if (version !== routeVersion || !$("#office-view")) return;
    // Обновление того же экрана (после сохранения, фильтра и т. п.) не сбрасывает прокрутку.
    // В админке на компьютере прокручивается только содержимое окна раздела, на телефоне — страница.
    const pickScroller = () => (location.hash.startsWith("#/admin") && matchMedia("(min-width:701px)").matches && ($("#office-view .tl-scroll") || $("#office-view .pro-scroll") || $("#office-view .admin-content"))) || $("#view");
    const key = location.hash + "|" + adminTab + "|" + scheduleView, top = pickScroller()?.scrollTop || 0, same = key === lastRenderKey;
    $("#office-view").innerHTML = html;
    await mount();
    const first = !lastRenderKey, scroller = pickScroller();
    lastRenderKey = key;
    if (same && scroller) scroller.scrollTop = top;
    if (location.hash.startsWith("#/admin")) {
      if (first && scroller && savedAdmin.key === key) scroller.scrollTop = savedAdmin.scroll || 0;
      saveAdmin({ key });
      if (scroller && (scroller.id !== "view" || !scrollSaveBound)) { if (scroller.id === "view") scrollSaveBound = true; let t; scroller.addEventListener("scroll", () => { clearTimeout(t); t = setTimeout(() => location.hash.startsWith("#/admin") && saveAdmin({ scroll: scroller.scrollTop, key: lastRenderKey }), 150); }, { passive: true }); }
    }
    document.title =
      (path[0] === "masters"
        ? "Tattoo Office — наши люди"
        : $("#main h1")?.textContent || "Tattoo Office") + " / Tattoo Office";
  } catch (e) {
    if (version !== routeVersion || !$("#office-view")) return;
    $("#office-view").innerHTML = win(
      "Не удалось открыть страницу",
      `<p class="form-error">${esc(e.message)}</p><button class="chrome" id="retry">Попробовать снова</button>`,
    );
    $("#retry").onclick = render;
  }
}
const adminContext = {
  api, esc, money, dateLabel, timeLabel, statusName, field, select, textarea, table, modal, dialogForm, onForm, notify, render, refresh, go, today, addDate, CITY_LABELS, resourceCity,
  state: () => ({ me, pub, adminData, adminDate, adminCity }),
  cityRatesOf, roleName, cityTabs, cityInfo,
  promosHTML: (a) => AP.promosHTML(a),
  openUserCard: (id) => AP.userCard(id).catch((e) => notify(e.message)),
  openBooking: (id) => UX.bookingPanel(id),
  goTab: (tab) => { adminTab = tab; render(); },
  renderCached: () => { adminCache = true; return render(); },
};
AP.init(adminContext);
UX.init(adminContext);
// Тестовый режим (превью Vercel): своя база, вход в тестовые аккаунты одной кнопкой.
function demoBar() {
  const bar = document.createElement("aside");
  bar.className = "demo-bar";
  bar.setAttribute("aria-label", "Тестовый режим");
  const accounts = [["owner", "Владелец", "admin"], ["shift", "Админ смены", "admin"], ["master", "Мастер", "cabinet"], ["resident", "Резидент", "cabinet"]];
  bar.innerHTML = `<b>Тестовый режим</b><span>данные не настоящие · войти как:</span>${accounts.map(([key, label]) => `<button type="button" data-demo-as="${key}" data-demo-go="${key === "customer" ? "masters" : accounts.find((a) => a[0] === key)[2]}">${label}</button>`).join("")}<button type="button" class="demo-bar__toggle" aria-label="Свернуть">–</button>`;
  document.body.append(bar);
  bar.addEventListener("click", async (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.classList.contains("demo-bar__toggle")) { bar.classList.toggle("is-collapsed"); b.textContent = bar.classList.contains("is-collapsed") ? "+" : "–"; return; }
    b.disabled = true;
    try {
      await api("/__demo/login?as=" + b.dataset.demoAs, "POST", {});
      await refresh();
      if (location.hash === "#/" + b.dataset.demoGo) render(); else go(b.dataset.demoGo);
      notify("Вы вошли как: " + me.name);
    } catch (error) { notify(error.message); }
    finally { b.disabled = false; }
  });
  // Загруженные в тесте фото тоже берутся из тестовой базы.
  const fix = (el) => { const src = el.getAttribute("src"); if (src?.startsWith("/api/") && !src.startsWith("/api/demo/")) el.setAttribute("src", "/api/demo/" + src.slice(5)); };
  new MutationObserver((list) => list.forEach((m) => { if (m.type === "attributes") fix(m.target); else m.addedNodes.forEach((n) => n.nodeType === 1 && [n, ...n.querySelectorAll("img")].forEach((el) => el.tagName === "IMG" && fix(el))); }))
    .observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["src"] });
}
if (DEMO) demoBar();
// Профиль мастера, которого только что добавили в админке: подгружаем свежий каталог и открываем страницу.
window.addEventListener("hashchange", async () => {
  const m = location.hash.match(/^#\/master\/([^/?#]+)/);
  if (!m || window.OFFICE_PUBLIC_ONLY || window.DATA.masters.some((x) => String(x.id) === m[1])) return;
  await refresh();
  if (location.hash.startsWith("#/master/" + m[1])) window.TO?.go(location.hash);
});
// В админке вместо бегущей строки — «Admin panel»: ведёт на главный экран админки.
document.getElementById("fringeAdmin")?.addEventListener("click", (e) => {
  e.preventDefault();
  if (!UX.confirmLeave()) return;
  adminTab = "home";
  go("admin");
});
window.Office = { render, paintAccount: paintShell, current: () => me };
window.Store = {
  current: () => me,
  logout: async () => {
    await api("/auth/logout", "POST");
    await refresh();
  },
};
try {
  await refresh();
} catch (e) {
  notify("API недоступен: " + e.message);
}
window.dispatchEvent(new Event("office-ready"));
