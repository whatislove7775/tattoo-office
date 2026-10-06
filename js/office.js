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
const today = () =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Moscow" }).format(
    new Date(),
  );
const addDate = (d, n) =>
  new Date(new Date(d + "T12:00:00Z").getTime() + n * 86400000)
    .toISOString()
    .slice(0, 10);
const roleName = {
  resident: "Резидент",
  guest: "Гостевой мастер",
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
};
let me = null,
  pub = null,
  routeVersion = 0,
  adminTab = "schedule",
  cabTab = "bookings";
let draft = {
  step: 0,
  date: addDate(today(), 1),
  duration: 3,
  hour: null,
  resourceId: null,
  extras: [],
};
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
async function api(path, method = "GET", body) {
  const r = await fetch("/api" + path, {
    method,
    credentials: "same-origin",
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json();
  if (!r.ok) throw Error(data.error || "Ошибка сервера");
  return data;
}
function go(path) {
  if (location.hash === "#/" + path) {
    if ($("#office-view")) render();
    else window.TO?.go(location.hash);
  } else location.hash = "#/" + path;
}
function head(title, back = "") {
  return `<div class="window-head"><img src="assets/pin-active.png" alt=""><h1>${esc(title)}</h1>${back ? `<a class="back" href="#/${back}">← назад</a>` : ""}</div>`;
}
function win(title, body, back = "") {
  return `<section class="window">${head(title, back)}${body}</section>`;
}
function testNote() {
  return pub?.settings.mode === "test"
    ? '<div class="test-note">Тестовый офис · тарифы и сведения предварительные · реальные деньги не списываются</div>'
    : "";
}
function field(name, label, value = "", type = "text", extra = "") {
  return `<label class="field"><span>${label}</span><input name="${name}" type="${type}" value="${esc(value)}" ${extra}></label>`;
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
  [pub, { user: me }] = await Promise.all([api("/public"), api("/me")]);
  syncMasters();
  paintShell();
}
function paintShell() {
  const el = document.getElementById("loginPanel");
  if (!el) return;
  const en = window.I18N?.get() === "en";
  el.classList.toggle("login--user", !!me);
  el.innerHTML = me
    ? `<div class="who"><span class="office-initial">${esc(me.name.slice(0, 1))}</span><span class="who__text"><a class="who__name" title="${esc(me.name)}" href="#/cabinet">${esc(me.name)}</a><small>${me.role === "admin" ? '<a href="#/admin">' + (en ? "Site management" : "Управление сайтом") + "</a>" : roleName[me.role]}</small></span></div>`
    : `<div class="login__row"><span class="login__label">Log in:</span><span class="login__links"><a href="#/login/customer">as customer</a><a href="#/login/master">as tattoo master</a></span></div>`;
}
const masters = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: window.I18N.pick(window.DATA.masters[i].name),
  filename: `tattooartist_${String(i + 1).padStart(2, "0")}.png`,
  photo: `assets/masters/master-${i + 1}.png`,
}));
function syncMasters() {
  for (const m of masters) {
    const c = pub?.content.find((c) => c.id === "master-" + m.id)?.data;
    m.name = c?.title || window.I18N.pick(window.DATA.masters[m.id - 1].name);
    const original = window.DATA.masters[m.id - 1];
    if (c?.title) original.name = { ru: c.title, en: c.title };
    if (c?.body) original.bio = { ru: c.body, en: c.body };
    if (c?.portfolio?.length)
      original.portfolio = c.portfolio.map((f) => ({
        src: `assets/works/${f}.png`,
        cap: { ru: f, en: f },
      }));
    if (c?.drafts?.length)
      original.drafts = c.drafts.map((f) => ({
        src: `assets/works/${f}.png`,
        cap: { ru: f, en: f },
      }));
    m.bio = c?.body || "";
    m.specialty = c?.specialty || "";
    m.portfolio = c?.portfolio || [];
    m.drafts = c?.drafts || [];
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
        innerWidth <= 760 ||
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
    `${testNote()}<div class="profile-grid"><div><img class="profile-photo" src="${m.photo}" alt="${m.name}"><h2>${m.name}</h2><span class="tag">The Tattoo Office Private Club</span>${m.specialty ? `<p>${esc(m.specialty)}</p>` : ""}<p class="small muted">${m.bio ? esc(m.bio) : "Портрет из архива студии. Имя, стиль и авторство работ предстоит подтвердить."}</p><button class="chrome" id="save-master">${storage.get("favorites", []).includes(m.id) ? "★ в избранном" : "☆ запомнить мастера"}</button><div class="note-paper">Хорошие совпадения начинаются со знакомства.<br><br><a href="#/feedback">Написать в студию ↗</a></div></div><div><div class="tabs"><button aria-selected="true" data-gallery="tattoo">📎 portfolio</button><button aria-selected="false" data-gallery="draft">◉ drafts</button></div><p class="small muted">Общий архив работ студии — распределение по авторам ещё не заполнено.</p><div class="gallery" id="gallery"></div></div></div>`,
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
    $$("[data-photo]").forEach(
      (b) =>
        (b.onclick = () =>
          modal(
            `<img src="${b.dataset.photo}" alt="Работа из архива студии">`,
          )),
    );
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
function interiorPage() {
  return win(
    "Interior",
    `<div class="interior-grid"><div><img id="interior-photo" class="interior-main" src="assets/interior/1.jpg" alt="Интерьер Tattoo Office"><div class="thumbnails">${[1, 2, 3, 4].map((i) => `<button data-interior="${i}" aria-label="Фотография интерьера ${i}"><img src="assets/interior/${i}.jpg" alt=""></button>`).join("")}</div></div><div><span class="eyebrow">WORK / MEET / REPEAT</span><h2 style="margin-top:15px">Ваше место.<br>Наш общий офис.</h2><p>Пространство для мастеров, их идей и людей, которые им доверяют.</p><p class="muted small">Выберите время, рабочее место и нужные расходники. Всё остальное остаётся за дверью.</p><div class="note-paper">${pub.resources.filter((r) => r.active).length} рабочих места<br>Ежедневно ${pub.settings.openHour}:00—${pub.settings.closeHour}:00<br>Время студии: Москва</div><a class="chrome" href="#/booking">Забронировать место ↗</a></div></div>`,
  );
}
function authPage(signup) {
  return win(
    signup ? "Новое личное дело" : "Войти в офис",
    `${testNote()}<form id="auth-form" class="auth-form">${!signup ? '<img class="auth-image" src="assets/auth/master.png" alt="Кажется, я обрёл дом">' : ""}<h2>${signup ? "Будем знакомы." : "Вы на месте."}</h2><p class="muted small">${signup ? "Самостоятельная регистрация — для резидентов. Гостевого мастера приглашает администратор." : "Почта, пароль — и вы снова в офисе."}</p>${signup ? field("name", "Как вас зовут", "", "text", 'required autocomplete="name" maxlength="100"') : ""}${field("email", "Почта для входа и чеков", "", "email", 'required autocomplete="email"')}${field("password", "Пароль", "", "password", `required minlength="12" maxlength="128" autocomplete="${signup ? "new-password" : "current-password"}"`)}${signup ? '<p class="small muted">Не менее 12 символов.</p><label class="check"><input name="rules" type="checkbox" required><span>Я прочитал(а) и принимаю <a href="#/safety" target="_blank">правила студии</a></span></label><label class="check"><input name="consent" type="checkbox" required><span>Я даю <a href="#/legal/data" target="_blank">согласие на обработку персональных данных</a></span></label>' : ""}<button type="submit" class="chrome">${signup ? "Создать личное дело" : "Войти"} →</button><div class="auth-switch"><a href="#/${signup ? "login" : "signup"}">${signup ? "Уже есть аккаунт? Войти" : "Первый раз? Стать резидентом"}</a></div>${pub.telegramEnabled ? '<p class="auth-switch"><a href="/api/auth/telegram">Войти через Telegram ↗</a></p>' : '<p class="small muted" style="margin-top:24px">Вход через Telegram появится после подключения бота студии.</p>'}</form>`,
  );
}
function mountAuth(signup) {
  onForm("#auth-form", async (d) => {
    await api("/auth/" + (signup ? "register" : "login"), "POST", {
      ...d,
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
function receipt() {
  const s = pub.settings,
    rate = s.rates[me?.role === "guest" ? "guest" : "resident"][draft.duration],
    extras = draft.extras.reduce(
      (a, x) =>
        a + (pub.catalog.find((c) => c.id === x.id)?.price || 0) * x.qty,
      0,
    ),
    r = pub.resources.find((x) => x.id === draft.resourceId);
  return `<aside class="receipt"><span class="eyebrow">TATTOO OFFICE / БЛАНК 01</span><h3 style="margin-top:18px">Ваша запись</h3><div class="line"><span>Дата</span><span>${dateLabel(draft.date + "T12:00:00+03:00")}</span></div><div class="line"><span>Время</span><span>${draft.hour === null ? "не выбрано" : draft.hour + ":00"} / ${draft.duration} ч</span></div><div class="line"><span>Место</span><span>${esc(r?.name || "не выбрано")}</span></div><div class="line"><span>Тариф</span><span>${money(rate)}</span></div><div class="line"><span>Дополнительно</span><span>${money(extras)}</span></div><div class="total">${money(rate + extras)}</div><p class="small muted">предварительная стоимость</p><div class="line"><span>Предоплата сейчас</span><b>${money(s.deposit)}</b></div><p class="small muted" style="margin-top:15px">Из неё с баланса: ${money(Math.min(me?.balance || 0, s.deposit))}. Остаток — после сеанса.</p></aside>`;
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
function bookingPage() {
  const s = pub.settings,
    steps = ["Дата и тариф", "Время и место", "Всё для сеанса", "Проверка"];
  let body = "";
  if (draft.step === 0)
    body = `<h2>Когда встретимся?</h2><p class="small muted">Выберите день и продолжительность. Время — московское.</p>${calendarHTML()}<div class="choices">${[3, 6, 12].map((h, i) => `<button data-duration="${h}" class="choice ${draft.duration === h ? "selected" : ""}"><span><b>${["Короткий", "Средний", "Большой"][i]}</b><small>до ${h} часов</small></span><em>${money(s.rates[me?.role === "guest" ? "guest" : "resident"][h])}</em></button>`).join("")}</div>`;
  if (draft.step === 1) {
    const selected = availability?.slots.find((x) => x.hour === draft.hour);
    body = `<h2>У окна или в тишине?</h2><p class="small muted">${dateLabel(draft.date + "T12:00:00+03:00")} · ${draft.duration} ч · работают ${availability?.workingMasters ?? 0} мастеров</p><div class="times">${availability?.slots.length ? availability.slots.map((x) => `<button class="time ${draft.hour === x.hour ? "selected" : ""}" data-hour="${x.hour}" ${x.free.length ? "" : "disabled"}>${x.hour}:00 <span class="muted">· ${x.free.length}</span></button>`).join("") : "<p>На этот день нет доступного времени. Выберите другую дату или более короткий тариф.</p>"}</div><div class="choices">${pub.resources
      .filter((x) => x.active)
      .map(
        (r) =>
          `<button class="choice ${draft.resourceId === r.id ? "selected" : ""}" data-resource="${r.id}" ${selected?.free.includes(r.id) ? "" : "disabled"}><span><b>${esc(r.name)}</b><small>${!selected ? "Сначала выберите время" : selected.free.includes(r.id) ? "Свободно на весь сеанс" : "Занято"}</small></span><span>↗</span></button>`,
      )
      .join("")}</div>`;
  }
  if (draft.step === 2)
    body = `<h2>Всё под рукой.</h2><p class="small muted">Добавьте подготовку места и расходники. Оплата — в итоговом счёте.</p>${pub.catalog.map((x) => `<label class="extra"><span>${esc(x.name)}<br><small class="muted">${money(x.price)} ${x.kind === "product" ? `· на складе ${x.stock} шт.` : ""}</small></span>${x.kind === "service" ? `<input type="checkbox" data-extra="${x.id}" ${draft.extras.some((e) => e.id === x.id) ? "checked" : ""}>` : `<input aria-label="Количество: ${esc(x.name)}" type="number" min="0" max="${Math.min(100, x.stock)}" value="${draft.extras.find((e) => e.id === x.id)?.qty || 0}" data-extra="${x.id}">`}</label>`).join("")}`;
  if (draft.step === 3) {
    const rate =
        s.rates[me?.role === "guest" ? "guest" : "resident"][draft.duration],
      extra = draft.extras.reduce(
        (a, x) => a + pub.catalog.find((c) => c.id === x.id).price * x.qty,
        0,
      );
    body = `<h2>Всё верно?</h2><div class="note-paper"><h3>${dateLabel(draft.date + "T12:00:00+03:00")} · ${draft.hour}:00—${draft.hour + draft.duration}:00</h3><p>${esc(pub.resources.find((r) => r.id === draft.resourceId)?.name)}</p><p>До ${draft.duration} часов · ${money(rate + extra)}</p>${draft.extras.map((x) => `<p class="small">${esc(pub.catalog.find((c) => c.id === x.id).name)} × ${x.qty}</p>`).join("")}<hr><p>Сейчас: ${money(s.deposit)}<br><small>С баланса ${money(Math.min(me?.balance || 0, s.deposit))}, картой ${money(Math.max(0, s.deposit - (me?.balance || 0)))}</small></p></div><p class="small muted">При отмене не менее чем за ${s.cancelHours} ч предоплата возвращается на внутренний баланс. Поздняя отмена: ${s.lateCancellation === "review" ? "решение администратора" : "удержание согласно регламенту"}.</p>${!me ? '<p><a href="#/login" id="booking-login">Войдите, чтобы продолжить →</a></p>' : '<label class="check"><input id="booking-agree" type="checkbox"><span>Принимаю <a href="#/safety" target="_blank">правила бронирования</a> и условия отмены</span></label>'}`;
  }
  return win(
    "Rent a workspace",
    `${testNote()}<ol class="steps">${steps.map((x, i) => `<li class="${i === draft.step ? "active" : ""}"><b>${i + 1}</b>${x}</li>`).join("")}</ol><div class="booking-grid"><div>${body}<div class="form-actions"><button class="back-btn" id="booking-back">${draft.step ? "← назад" : "← в офис"}</button><button class="chrome" id="booking-next" ${draft.step === 3 && !me ? "disabled" : ""}>${draft.step === 3 ? "Подтвердить запись" : "Далее"} →</button></div><p id="booking-error" class="form-error" role="alert"></p></div>${receipt()}</div>`,
  );
}
async function mountBooking() {
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
  }
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
      render();
    } else go("masters");
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
        bookingResult = await api("/bookings", "POST", draft);
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
  const { payment: p, mode } = await api("/payments/" + id);
  return win(
    "Касса / предоплата",
    `<div class="auth-form"><span class="eyebrow">ПЛАТЁЖ № ${p.id.slice(0, 8)}</span><h2 style="margin-top:20px">${money(p.amount)}</h2><p>${p.kind === "deposit" ? "Предоплата рабочего места" : "Итоговый счёт за сеанс"}</p><p class="small muted">Статус: ${statusName[p.status] || p.status}</p>${p.status === "pending" ? `${mode === "test" ? '<div class="note-paper">Тестовая касса.<br>Банковская карта не нужна. Денежного списания и фискального чека не будет.</div><button class="chrome" id="test-pay">Проверить успешную оплату →</button>' : '<button class="chrome" id="card-pay">Оплатить картой →</button>'}` : '<a class="chrome" href="#/cabinet">В личный кабинет →</a>'}${
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
    }<p class="small muted" style="margin-top:25px">${p.kind === "deposit" ? "Место удерживается 15 минут с момента создания записи." : ""}</p></div>`,
    "cabinet",
  );
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
  let body = "";
  if (cabTab === "bookings")
    body = active.length
      ? active.map((b) => bookingItem(b, data.payments)).join("")
      : '<div class="empty">В вашем календаре пока тихо.<br><br><a href="#/booking">Забронировать первое место →</a></div>';
  if (cabTab === "history")
    body =
      data.bookings
        .filter((b) => !active.includes(b))
        .map((b) => bookingItem(b, []))
        .join("") || '<div class="empty">Здесь будет история сеансов.</div>';
  if (cabTab === "balance")
    body = `<p class="small muted">Баланс используется автоматически для предоплаты. Это учёт внесённых средств, а не банковский счёт.</p><div class="table-wrap"><table><thead><tr><th>Дата</th><th>Операция</th><th>Сумма</th></tr></thead><tbody>${data.ledger.map((x) => `<tr><td>${dateLabel(x.created_at)}</td><td>${esc(x.description)}</td><td>${x.amount > 0 ? "+" : ""}${money(x.amount)}</td></tr>`).join("")}</tbody></table></div>${!data.ledger.length ? '<div class="empty">Операций пока нет.</div>' : ""}`;
  if (cabTab === "notifications")
    body = inbox.notifications.length
      ? inbox.notifications
          .map(
            (n) =>
              `<article class="note-paper"><span class="eyebrow">${dateLabel(n.created_at)}</span><div class="prose">${esc(n.message)}</div></article>`,
          )
          .join("")
      : '<div class="empty">Входящих пока нет.</div>';
  if (cabTab === "profile")
    body = `<form id="profile-form"><div class="form-grid">${field("name", "Имя", me.name, "text", 'required maxlength="100"')}${field("specialty", "Ваш стиль", me.profile.specialty || "")}${field("status", "Статус на сегодня", me.profile.status || "")}${select(
      "accent",
      "Обложка личного дела",
      [
        ["paper", "Белая бумага"],
        ["beige", "Архивный бежевый"],
        ["graphite", "Графит"],
      ],
      me.profile.accent || "paper",
    )}<div class="wide">${textarea("bio", "О себе", me.profile.bio || "")}</div></div><button class="chrome" type="submit">Сохранить личное дело</button></form><div class="note-paper">${me.telegramLinked ? "Telegram подключён" : pub.telegramEnabled ? '<a href="/api/auth/telegram">Привязать Telegram →</a>' : "Telegram пока не подключён студией"}</div><h3 style="margin-top:35px">Сменить пароль</h3><form id="password-form" class="form-grid">${field("current", "Текущий пароль", "", "password", "required")}${field("password", "Новый пароль", "", "password", 'required minlength="12" maxlength="128"')}<button class="chrome" type="submit">Изменить пароль</button></form>`;
  const accent =
    me.profile.accent === "graphite"
      ? "background:#deddd8"
      : me.profile.accent === "beige"
        ? "background:#f0e7d5"
        : "";
  return win(
    "My profile",
    `${testNote()}<div class="row between"><div><span class="eyebrow">ЛИЧНОЕ ДЕЛО / ${me.id.slice(0, 8)}</span><h2 style="margin-top:10px">${esc(me.name)}</h2><p class="small muted">${roleName[me.role]} · ${esc(me.profile.status || "Снова в офисе.")}</p></div><button id="logout" class="small"><u>выйти ↗</u></button></div><div class="summary-cards"><div class="stat"><span class="eyebrow">НА БАЛАНСЕ</span><strong>${money(me.balance)}</strong><span class="small muted">для следующей записи</span></div><div class="stat"><span class="eyebrow">В КАЛЕНДАРЕ</span><strong>${active.length}</strong><a class="small" href="#/booking">ещё одно место ↗</a></div><div class="stat"><span class="eyebrow">ЗАВЕРШЕНО</span><strong>${done}</strong><span class="small muted">сеансов в этом офисе</span></div></div><div class="stamp-card" style="${accent}"><div class="row between"><span>Книжка посещений</span><span class="small muted">${me.sequence ? ((me.sequence - 1) % 20) + 1 : 0} / 20 · цикл ${Math.floor(Math.max(0, me.sequence - 1) / 20) + 1}</span></div><div class="stamps">${Array.from({ length: 20 }, (_, i) => `<span class="stamp ${i < (me.sequence ? ((me.sequence - 1) % 20) + 1 : 0) ? "used" : ""}">${String(i + 1).padStart(2, "0")}</span>`).join("")}</div></div><div class="tabs">${[
      ["bookings", "Мои записи"],
      ["history", "Архив"],
      ["balance", "Баланс"],
      ["notifications", "Входящие"],
      ["profile", "Личное дело"],
    ]
      .map(
        ([v, l]) =>
          `<button data-cabtab="${v}" aria-selected="${v === cabTab}">${l}</button>`,
      )
      .join("")}</div>${body}`,
  );
}
function bookingItem(b, payments) {
  const payment = payments.find(
    (p) => p.booking_id === b.id && p.status === "pending",
  );
  return `<article class="booking-item"><div><h3>${dateLabel(b.starts_at)} · ${timeLabel(b.starts_at)}—${timeLabel(b.ends_at)}</h3><p>${esc(b.resource_name)} · до ${b.tariff} ч ${b.session_no ? "· сеанс " + b.session_no + "/20" : ""}</p><p class="muted">${money(b.total)} · предоплата ${money(b.deposit)}</p><span class="badge ${b.status === "confirmed" ? "good" : ""}">${statusName[b.status]}</span></div><div class="row">${payment ? `<a href="#/payment/${payment.id}" class="chrome">Оплатить ${money(payment.amount)}</a>` : ""}${["pending", "confirmed"].includes(b.status) && new Date(b.starts_at) > new Date() ? `<button class="small" data-cancel="${b.id}"><u>отменить</u></button>` : ""}</div></article>`;
}
function mountCabinet() {
  if (!me) {
    mountAuth(false);
    return;
  }
  $$("[data-cabtab]").forEach(
    (b) =>
      (b.onclick = () => {
        cabTab = b.dataset.cabtab;
        render();
      }),
  );
  $("#logout").onclick = async () => {
    await api("/auth/logout", "POST");
    await refresh();
    go("masters");
  };
  $$("[data-cancel]").forEach(
    (b) =>
      (b.onclick = () => {
        modal(
          `<h2>Отменить запись?</h2><p>При отмене не менее чем за ${pub.settings.cancelHours} часов предоплата вернётся на баланс. Позднюю отмену обработаем по правилам студии.</p><button class="chrome" id="confirm-cancel">Да, отменить</button>`,
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
  onForm("#profile-form", async (d) => {
    await api("/me", "PATCH", { name: d.name, profile: d });
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
let adminData,
  adminDate = today();
const table = (heads, rows) =>
  `<div class="table-wrap"><table><thead><tr>${heads.map((x) => `<th>${x}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table></div>${!rows.length ? '<div class="empty">Пока пусто.</div>' : ""}`;
async function adminPage() {
  if (!me) return authPage(false);
  if (me.role !== "admin")
    return win("Служебный вход", "У вас нет доступа к этому разделу.");
  adminData = await api("/admin");
  const a = adminData,
    s = pub.settings,
    tabs = [
      ["schedule", "Расписание"], ["bookings", "Записи"],
      ["users", "Люди"], ["catalog", "Склад и услуги"],
      ["finance", "Финансы"], ["feedback", "Обращения"],
      ["masters", "Мастера"], ["content", "Публикации"],
      ["settings", "Настройки"], ["audit", "Журнал"],
    ];
  if (!tabs.some((x) => x[0] === adminTab)) adminTab = tabs[0][0];
  let body = "";
  if (adminTab === "schedule") {
    const resources = a.resources.filter((r) => r.active),
      bookings = a.bookings.filter(
        (b) =>
          new Intl.DateTimeFormat("sv-SE", {
            timeZone: "Europe/Moscow",
          }).format(new Date(b.starts_at)) === adminDate &&
          !["cancelled", "expired"].includes(b.status),
      );
    body = `<div class="admin-tools"><input id="admin-date" type="date" value="${adminDate}" aria-label="Дата расписания"><button class="chrome" id="manual-booking">+ Ручная запись</button><button class="chrome" id="add-block">Закрыть время</button>${me.role === "admin" ? '<button class="chrome" id="add-resource">+ Рабочее место</button>' : ""}</div><p class="small muted">Москва · занято ${bookings.length} записей · ${resources.length} мест</p><div class="schedule" style="grid-template-columns:65px repeat(${resources.length},minmax(90px,1fr))"><div>Время</div>${resources.map((r) => `<div>${esc(r.name)}${me.role === "admin" ? `<br><button class="small" data-edit-resource="${r.id}"><u>изменить</u></button>` : ""}</div>`).join("")}${Array.from(
      { length: s.closeHour - s.openHour },
      (_, i) => {
        const h = s.openHour + i,
          time = new Date(
            `${adminDate}T${String(h).padStart(2, "0")}:00:00+03:00`,
          );
        return (
          `<div>${h}:00</div>` +
          resources
            .map((r) => {
              const b = bookings.find(
                  (b) =>
                    b.resource_id === r.id &&
                    new Date(b.starts_at) <= time &&
                    new Date(b.ends_at) > time,
                ),
                block = a.blocks.find(
                  (b) =>
                    (!b.resource_id || b.resource_id === r.id) &&
                    new Date(b.starts_at) <= time &&
                    new Date(b.ends_at) > time,
                );
              return `<div class="${b ? "busy" : block ? "closed" : ""}">${b ? `${esc(b.user_name)}<br><small>${statusName[b.status]}</small>` : block ? "закрыто" : "·"}</div>`;
            })
            .join("")
        );
      },
    ).join("")}</div><h3 style="margin-top:30px">Закрытые интервалы</h3>${table(
      ["Период", "Причина", ""],
      a.blocks.map(
        (b) =>
          `<tr><td>${dateLabel(b.starts_at)} ${timeLabel(b.starts_at)} — ${dateLabel(b.ends_at)} ${timeLabel(b.ends_at)}</td><td>${esc(b.reason)}</td><td><button data-delete-block="${b.id}">Открыть</button></td></tr>`,
      ),
    )}`;
  }
  if (adminTab === "bookings")
    body = table(
      ["Сеанс", "Мастер / место", "Сумма", "Статус", "Действие"],
      a.bookings.map(
        (b) =>
          `<tr><td>${dateLabel(b.starts_at)}<br>${timeLabel(b.starts_at)}—${timeLabel(b.ends_at)}<br>№ ${b.session_no || "—"}</td><td>${esc(b.user_name)}<br><span class="muted">${esc(b.resource_name)}</span></td><td>${money(b.total)}<br><small>аванс ${money(b.deposit)}</small></td><td><span class="badge">${statusName[b.status]}</span></td><td>${b.status === "confirmed" ? `<button data-invoice="${b.id}">Выставить счёт</button>` : b.status === "cancel_requested" ? `<button data-resolve="${b.id}">Решить отмену</button>` : "—"}</td></tr>`,
      ),
    );
  if (adminTab === "users")
    body = `<div class="admin-tools"><button class="chrome" id="add-user">+ Пользователь</button></div>${table(
      ["Имя", "Почта", "Роль", "Баланс", "Доступ"],
      a.users.map(
        (u) =>
          `<tr><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${roleName[u.role]}</td><td>${money(u.balance)}</td><td>${u.active ? "Активен" : "Закрыт"}${me.role === "admin" ? `<br><button data-edit-user="${u.id}">Изменить</button>` : ""}</td></tr>`,
      ),
    )}`;
  if (adminTab === "catalog")
    body = `<div class="admin-tools"><button class="chrome" id="add-catalog">+ Товар или услуга</button></div>${table(
      ["Позиция", "Тип", "Цена", "Остаток", ""],
      a.catalog.map(
        (x) =>
          `<tr><td>${esc(x.name)} ${x.active ? "" : "(скрыто)"}</td><td>${x.kind === "product" ? "Расходник" : "Услуга"}</td><td>${money(x.price)}</td><td>${x.kind === "product" ? x.stock : "—"}</td><td><button data-edit-catalog="${x.id}">Изменить</button></td></tr>`,
      ),
    )}`;
  if (adminTab === "finance")
    body = `<div class="note-paper">${s.mode === "test" ? "Тестовый реестр. Это не реальные поступления." : "Реестр платежей"}</div>${table(
      ["Дата", "Платёж", "Назначение", "Сумма", "Статус"],
      a.payments.map(
        (p) =>
          `<tr><td>${dateLabel(p.created_at)}</td><td>${p.id.slice(0, 8)}</td><td>${p.kind === "deposit" ? "Предоплата" : "Итоговый счёт"}</td><td>${money(p.amount)}</td><td>${statusName[p.status] || esc(p.status)}</td></tr>`,
      ),
    )}`;
  if (adminTab === "feedback")
    body = table(
      ["Дата", "Обращение", "Статус", ""],
      a.feedback.map(
        (f) =>
          `<tr><td>${dateLabel(f.created_at)}</td><td style="white-space:pre-wrap;max-width:400px">${esc(f.message)}</td><td>${statusName[f.status]}</td><td><button data-feedback="${f.id}" data-status="${f.status === "new" ? "done" : "new"}">${f.status === "new" ? "Обработано" : "Вернуть"}</button></td></tr>`,
      ),
    );
  if (adminTab === "masters")
    body = `<p class="small muted">Укажите реальные имена и распределите загруженные работы по авторам.</p>${table(
      ["Фото", "Мастер", "Стиль", ""],
      masters.map(
        (m) =>
          `<tr><td><img src="${m.photo}" alt="" style="width:44px;height:55px;object-fit:cover"></td><td>${esc(m.name)}</td><td>${esc(m.specialty || "не задан")}</td><td><button data-edit-master="${m.id}">Личное дело</button></td></tr>`,
      ),
    )}`;
  if (adminTab === "content")
    body = `<p class="small muted">Публикации отображаются в Event Archive. Текст публикуется без HTML.</p><form id="content-form"><div class="form-grid">${field("id", "Код публикации (латиница)", "", "text", 'required pattern="[a-zA-Z0-9_-]{1,50}"')}${field("title", "Заголовок", "", "text", 'required maxlength="150"')}<div class="wide">${textarea("body", "Текст")}</div></div><label class="check"><input name="published" type="checkbox"><span>Опубликовать</span></label><button type="submit" class="chrome">Сохранить публикацию</button></form><h3 style="margin-top:30px">Материалы</h3>${table(
      ["Заголовок", "Статус", ""],
      a.content
        .filter((c) => !/^master-/.test(c.id))
        .map(
          (c) =>
            `<tr><td>${esc(c.data.title)}</td><td>${c.data.published ? "Опубликован" : "Черновик"}</td><td><button data-edit-content="${c.id}">Редактировать</button></td></tr>`,
        ),
    )}`;
  if (adminTab === "settings")
    body = `<form id="settings-form"><h3>Студия и контакты</h3><div class="form-grid">${field("studioName", "Название", s.studioName)}${field("address", "Адрес", s.address)}${field("phone", "Телефон", s.phone)}${field("email", "Email студии", s.email, "email")}${field("openHour", "Открытие (час, МСК)", s.openHour, "number", 'min="0" max="23"')}${field("closeHour", "Закрытие (час, МСК)", s.closeHour, "number", 'min="1" max="24"')}</div><h3>Тарифы, ₽</h3><p class="small muted">Новые цены применяются к новым записям. Тариф существующей брони сохраняется.</p><div class="form-grid">${["resident", "guest"].map((r) => [3, 6, 12].map((h) => field(`${r}_${h}`, `${roleName[r]} · до ${h} ч`, s.rates[r][h] / 100, "number", 'required min="0" step="1"')).join("")).join("")}${field("deposit", "Предоплата, ₽", s.deposit / 100, "number", 'min="0"')}${field("cancelHours", "Бесплатная отмена за, ч", s.cancelHours, "number", 'min="1" max="168"')}${field("reminderHours", "Напомнить за, ч", s.reminderHours, "number", 'min="1" max="168"')}${select(
      "lateCancellation",
      "Поздняя отмена",
      [
        ["review", "На рассмотрение администратора"],
        ["retain", "Удержать предоплату по регламенту"],
      ],
      s.lateCancellation,
    )}</div><h3>Реквизиты и документы</h3><div class="form-grid">${field("legalName", "Наименование ИП / ООО", s.legalName)}${field("inn", "ИНН", s.inn)}${field("legalAddress", "Юридический адрес", s.legalAddress)}${field("rulesVersion", "Версия правил", s.rulesVersion)}<div class="wide">${textarea("rules", "Правила студии", s.rules)}${textarea("privacy", "Политика обработки данных", s.privacy)}${textarea("consent", "Отдельное согласие на обработку данных", s.consent)}${textarea("offer", "Оферта", s.offer)}</div></div><label class="check"><input name="legalApproved" type="checkbox" ${s.legalApproved ? "checked" : ""}><span>Документы проверены владельцем студии</span></label><button type="submit" class="chrome">Сохранить настройки</button></form><h3 style="margin-top:35px">Подключения</h3>${table(
      ["Сервис", "Ключи"],
      Object.entries(a.integrations || {}).map(
        ([k, v]) =>
          `<tr><td>${esc(k)}</td><td>${v ? "заданы на сервере" : "не подключён"}</td></tr>`,
      ),
    )}<div class="note-paper">Режим: тестовый. Боевые платежи заблокированы до проверки кассы, документов и инфраструктуры в РФ. Секретные ключи задаются на сервере, в браузере не хранятся.</div>`;
  if (adminTab === "audit")
    body = `<h3>Действия сотрудников</h3>${table(
      ["Дата", "Действие", "Данные"],
      a.audit.map(
        (x) =>
          `<tr><td>${dateLabel(x.created_at)} ${timeLabel(x.created_at)}</td><td>${esc(x.action)}</td><td><code>${esc(JSON.stringify(x.details))}</code></td></tr>`,
      ),
    )}<h3 style="margin-top:30px">Очередь интеграций</h3>${table(
      ["Событие", "Статус", "Попытки"],
      a.outbox.map(
        (x) =>
          `<tr><td>${esc(x.kind)}</td><td>${esc(x.status)}${x.last_error ? `<br><small>${esc(x.last_error)}</small>` : ""}</td><td>${x.attempts}</td></tr>`,
      ),
    )}`;
  return win(
    "Office management",
    `${testNote()}<div class="row between"><div><span class="eyebrow">СЛУЖЕБНЫЙ РАЗДЕЛ</span><h2 style="margin-top:9px">Всё на своих местах.</h2></div><span class="tag">${roleName[me.role]}</span></div><div class="tabs">${tabs.map(([v, l]) => `<button data-admintab="${v}" aria-selected="${v === adminTab}">${l}</button>`).join("")}</div>${body}`,
  );
}
function dialogForm(title, html, submit) {
  modal(
    `<h2>${title}</h2><form id="dialog-form">${html}<button type="submit" class="chrome">Сохранить</button></form>`,
  );
  onForm("#dialog-form", async (d) => {
    await submit(d);
    $("#dialog").close();
    await refresh();
    await render();
    notify("Сохранено");
  });
}
function mountAdmin() {
  if (!me) {
    mountAuth(false);
    return;
  }
  if (!adminData) return;
  const a = adminData;
  $$("[data-admintab]").forEach(
    (b) =>
      (b.onclick = () => {
        adminTab = b.dataset.admintab;
        render();
      }),
  );
  if ($("#admin-date"))
    $("#admin-date").onchange = (e) => {
      adminDate = e.target.value || today();
      render();
    };
  const userForm = (u) =>
    dialogForm(
      u ? "Права и почта" : "Новое личное дело",
      `${!u ? field("name", "Имя", "", "text", "required") : ""}${field("email", "Email", u?.email || "", "email", "required")}${!u ? field("password", "Временный пароль", "", "password", 'required minlength="12" maxlength="128"') : ""}${select(
        "role",
        "Роль",
        Object.entries(roleName).filter(
          ([r]) => me.role === "admin" || r === "guest",
        ),
        u?.role || "guest",
      )}${u ? `<label class="check"><input name="active" type="checkbox" ${u.active ? "checked" : ""}> Доступ активен</label>` : ""}`,
      (d) =>
        api("/admin/users" + (u ? "/" + u.id : ""), u ? "PATCH" : "POST", {
          ...d,
          ...(u ? { active: d.active === "on" } : {}),
        }),
    );
  if ($("#add-user")) $("#add-user").onclick = () => userForm();
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
      )}${field("price", "Цена, ₽", (x?.price || 0) / 100, "number", 'required min="0" step="1"')}${field("stock", "Остаток", x?.stock || 0, "number", 'required min="0" step="1"')}<label class="check"><input name="active" type="checkbox" ${x?.active !== false ? "checked" : ""}> Показывать при записи</label>`,
      (d) =>
        api("/admin/catalog", "POST", {
          ...d,
          id: x?.id,
          price: Math.round(Number(d.price) * 100),
          stock: Number(d.stock),
          active: d.active === "on",
        }),
    );
  if ($("#add-catalog")) $("#add-catalog").onclick = () => catalogForm();
  $$("[data-edit-catalog]").forEach(
    (b) =>
      (b.onclick = () =>
        catalogForm(a.catalog.find((x) => x.id === b.dataset.editCatalog))),
  );
  const resourceForm = (r) =>
    dialogForm(
      r ? "Рабочее место" : "Новое рабочее место",
      `${field("name", "Название", r?.name || "", "text", "required")}${field("calendarId", "Google Calendar ID", r?.calendar_id || "")}<label class="check"><input name="active" type="checkbox" ${r?.active !== false ? "checked" : ""}> Принимать записи</label>`,
      (d) =>
        api("/admin/resources", "POST", {
          ...d,
          id: r?.id,
          active: d.active === "on",
        }),
    );
  if ($("#add-resource")) $("#add-resource").onclick = () => resourceForm();
  $$("[data-edit-resource]").forEach(
    (b) =>
      (b.onclick = () =>
        resourceForm(a.resources.find((x) => x.id === b.dataset.editResource))),
  );
  if ($("#add-block"))
    $("#add-block").onclick = () =>
      dialogForm(
        "Закрыть время",
        `${select("resourceId", "Рабочее место", [["", "Все места"], ...a.resources.map((r) => [r.id, r.name])], "")}${field("startsAt", "Начало (время Москвы)", adminDate + "T10:00", "datetime-local", "required")}${field("endsAt", "Конец (время Москвы)", adminDate + "T22:00", "datetime-local", "required")}${field("reason", "Причина", "", "text", "required")}`,
        (d) =>
          api("/admin/blocks", "POST", {
            ...d,
            startsAt: d.startsAt + ":00+03:00",
            endsAt: d.endsAt + ":00+03:00",
          }),
      );
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
  if ($("#manual-booking"))
    $("#manual-booking").onclick = () =>
      dialogForm(
        "Запись без предоплаты",
        `${select(
          "userId",
          "Мастер",
          a.users
            .filter((u) => u.active && ["resident", "guest"].includes(u.role))
            .map((u) => [u.id, u.name]),
          "",
        )}${field("date", "Дата", adminDate, "date", "required")}${field("hour", "Начало (час, МСК)", 10, "number", 'required min="0" max="23"')}${select(
          "duration",
          "Тариф",
          [
            [3, "До 3 часов"],
            [6, "До 6 часов"],
            [12, "До 12 часов"],
          ],
          3,
        )}${select(
          "resourceId",
          "Место",
          a.resources.filter((r) => r.active).map((r) => [r.id, r.name]),
          "",
        )}<p class="small muted">Сервер проверит доступность. Предоплата не требуется.</p>`,
        (d) =>
          api("/bookings", "POST", {
            ...d,
            hour: Number(d.hour),
            duration: Number(d.duration),
            extras: [],
            manual: true,
          }),
      );
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
  $$("[data-edit-master]").forEach(
    (b) =>
      (b.onclick = () => {
        const m = masters.find((x) => x.id === +b.dataset.editMaster);
        dialogForm(
          "Личное дело мастера",
          `${field("title", "Имя", m.name, "text", "required")}${field("specialty", "Стиль", m.specialty)}${textarea("body", "О мастере", m.bio)}${field("portfolio", "Работы: tattoo-1, tattoo-2…", m.portfolio.join(", "))}${field("drafts", "Эскизы: draft-1, draft-2…", m.drafts.join(", "))}<p class="small muted">Доступны tattoo-1…8 и draft-1…7 из загруженного архива.</p>`,
          (d) =>
            api("/admin/content/master-" + m.id, "PUT", {
              ...d,
              published: true,
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
  onForm("#content-form", async (d) => {
    await api("/admin/content/" + d.id, "PUT", {
      ...d,
      published: d.published === "on",
    });
    await refresh();
    render();
    notify("Публикация сохранена");
  });
  $$("[data-edit-content]").forEach(
    (b) =>
      (b.onclick = () => {
        const c = a.content.find((c) => c.id === b.dataset.editContent),
          f = $("#content-form");
        f.elements.id.value = c.id;
        f.elements.title.value = c.data.title;
        f.elements.body.value = c.data.body;
        f.elements.published.checked = c.data.published;
        f.scrollIntoView({ block: "center" });
      }),
  );
  onForm("#settings-form", async (d) => {
    const rates = { resident: {}, guest: {} };
    for (const r of ["resident", "guest"])
      for (const h of [3, 6, 12])
        rates[r][h] = Math.round(Number(d[r + "_" + h]) * 100);
    await api("/admin/settings", "PATCH", {
      ...d,
      rates,
      openHour: Number(d.openHour),
      closeHour: Number(d.closeHour),
      deposit: Math.round(Number(d.deposit) * 100),
      cancelHours: Number(d.cancelHours),
      reminderHours: Number(d.reminderHours),
      legalApproved: d.legalApproved === "on",
    });
    await refresh();
    notify("Настройки студии сохранены");
    render();
  });
}
function legalPage(key) {
  const s = pub.settings,
    titles = {
      privacy: "Политика обработки данных",
      offer: "Оферта",
      data: "Согласие на обработку данных",
      info: "Реквизиты студии",
    };
  let text =
    key === "info"
      ? `${s.legalName || "Владелец пока не указан"}\nИНН: ${s.inn || "не заполнен"}\n${s.legalAddress || "Юридический адрес не заполнен"}\n${s.email || ""}`
      : s[key === "data" ? "consent" : key];
  return win(
    titles[key] || "Документы",
    `${testNote()}${!text ? '<div class="note-paper">Документ готовится к публикации. Владелец студии заполнит его в настройках перед запуском.</div>' : `<div class="prose">${esc(text)}</div>`}`,
  );
}
async function render() {
  if (!$("#office-view")) return;
  const version = ++routeVersion;
  const path = (location.hash || "#/masters").replace(/^#\//, "").split("/");
  paintShell();
  try {
    let html,
      mount = () => {};
    switch (path[0]) {
      case "masters":
      case "":
        html = mastersPage();
        mount = mountMasters;
        break;
      case "master":
        html = masterPage(path[1]);
        mount = () => mountMaster(path[1]);
        break;
      case "interior":
        html = interiorPage();
        mount = () =>
          $$("[data-interior]").forEach(
            (b) =>
              (b.onclick = () =>
                ($("#interior-photo").src =
                  `assets/interior/${b.dataset.interior}.jpg`)),
          );
        break;
      case "booking":
        if (draft.step === 1)
          availability = await api(
            `/availability?date=${draft.date}&duration=${draft.duration}`,
          );
        html = bookingPage();
        mount = mountBooking;
        break;
      case "login":
      case "signup":
        html = authPage(path[0] === "signup");
        mount = () => mountAuth(path[0] === "signup");
        break;
      case "cabinet":
        html = await cabinetPage();
        mount = mountCabinet;
        break;
      case "admin":
        html = await adminPage();
        mount = mountAdmin;
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
                const config = await api("/payments/" + path[1] + "/checkout");
                if (!window.cp)
                  await new Promise((resolve, reject) => {
                    const s = document.createElement("script");
                    s.src =
                      "https://widget.cloudpayments.ru/bundles/cloudpayments.js";
                    s.onload = resolve;
                    s.onerror = reject;
                    document.head.append(s);
                  });
                new window.cp.CloudPayments().pay("charge", config, {
                  onSuccess: () => {
                    notify(
                      "Проверяем подтверждение банка. Статус обновится в личном кабинете.",
                    );
                    go("cabinet");
                  },
                  onFail: () =>
                    notify("Оплата не завершена. Можно попробовать ещё раз."),
                });
              } catch (e) {
                notify(e.message || "Не удалось открыть кассу");
              }
            };
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
        html = win(
          "How to find",
          `<h2>Увидимся в офисе.</h2><div class="note-paper">${esc(pub.settings.address || "Адрес студии скоро появится здесь.")}</div><p>Часы работы: ${pub.settings.openHour}:00—${pub.settings.closeHour}:00, Москва.</p>${pub.settings.phone ? `<p>${esc(pub.settings.phone)}</p>` : ""}${pub.settings.email ? `<p><a href="mailto:${esc(pub.settings.email)}">${esc(pub.settings.email)}</a></p>` : ""}<a href="#/feedback" class="chrome">Связаться со студией →</a>`,
        );
        break;
      case "safety":
        html = win(
          "Safety / правила студии",
          `${testNote()}<h2>Забота — часть работы.</h2><div class="prose">${esc(pub.settings.rules)}</div><div class="note-paper">Предоплата ${money(pub.settings.deposit)}. При отмене за ${pub.settings.cancelHours} ч и раньше — возврат на внутренний баланс.<br>Поздняя отмена: ${pub.settings.lateCancellation === "review" ? "рассматривается администратором" : "удержание по регламенту студии"}.</div><span class="small muted">Версия: ${esc(pub.settings.rulesVersion)}</span>`,
        );
        break;
      case "archive": {
        const posts = pub.content.filter(
          (c) => c.data.published && !/^master-/.test(c.id),
        );
        html = win(
          "Event Archive",
          posts.length
            ? posts
                .map(
                  (c) =>
                    `<article class="note-paper"><h2>${esc(c.data.title)}</h2><div class="prose">${esc(c.data.body)}</div></article>`,
                )
                .join("")
            : '<div class="empty">Здесь будет история офиса.<br>Анонсы, встречи и то, что хочется сохранить.</div>',
        );
        break;
      }
      case "book":
      case "feedback":
        html = win(
          "Feedback",
          `<form id="feedback-form" class="auth-form"><h2>Записка в офис.</h2><p class="small muted">Вопрос, идея или что-то пошло не так? Сообщение увидит команда студии.${!me ? " Можно написать без аккаунта." : ""}</p>${textarea("message", "Ваше сообщение")}<p class="small muted">Если нужен ответ, оставьте удобный способ связи. Не указывайте медицинские или платёжные данные.</p><button class="chrome" type="submit">Отправить записку →</button></form>`,
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
            notify("Записка передана команде студии");
          });
        };
        break;
      case "about":
        html = win("Tattoo Office", '<p>Тату-студия и коворкинг для мастеров.</p><a href="#/feedback">Связаться со студией</a>');
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
    $("#office-view").innerHTML = html;
    await mount();
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
