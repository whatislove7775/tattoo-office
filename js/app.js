/* =========================================================================
   APP — маршрутизация, общая обвязка окна и мелкая механика интерфейса.
   ========================================================================= */
(function (global) {
  "use strict";

  var t = global.t;
  var esc = function (s) {
    return global.Pages.esc(s);
  };

  var view = document.getElementById("view");
  var stageInner = view;
  var currentCleanup = null;

  /* ------------------------------ маршруты -------------------------------- */
  var ROUTES = [
    { rx: /^#\/(booking|admin|payment)(?:\/[^/]+)?$/, page: "office" },
    { rx: /^#\/(login|signup)$/, page: "office" },
    { rx: /^#?\/?$/, page: "masters", nav: "masters" },
    { rx: /^#\/masters$/, page: "masters", nav: "masters" },
    {
      rx: /^#\/master\/([\w-]+)$/,
      page: "master",
      nav: "masters",
      keys: ["id"],
    },
    { rx: /^#\/book\/([\w-]+)$/, page: "office", nav: "masters", keys: ["id"] },
    { rx: /^#\/interior$/, page: "office", nav: "interior" },
    { rx: /^#\/find$/, page: "office", nav: "find" },
    { rx: /^#\/safety$/, page: "office", nav: "safety" },
    { rx: /^#\/archive$/, page: "office", nav: "archive" },
    { rx: /^#\/feedback$/, page: "office", nav: "feedback" },
    {
      rx: /^#\/(login|signup)\/(master|customer)$/,
      page: "office",
      keys: ["mode", "role"],
    },
    { rx: /^#\/cabinet$/, page: "office" },
    { rx: /^#\/legal\/(\w+)$/, page: "office", keys: ["doc"] },
    { rx: /^#\/about$/, page: "office", fixed: { doc: "about" } },
    { rx: /^#\/club$/, page: "office" },
  ];

  var MENU = [
    ["masters", "nav.masters", "#/masters"],
    ["interior", "nav.interior", "#/interior"],
    ["find", "nav.find", "#/find"],
    ["safety", "nav.safety", "#/safety"],
    ["archive", "nav.archive", "#/archive"],
    ["feedback", "nav.feedback", "#/feedback"],
  ];

  function resolve(hash) {
    for (var i = 0; i < ROUTES.length; i++) {
      var m = hash.match(ROUTES[i].rx);
      if (!m) continue;
      var r = ROUTES[i];
      var params = {};
      (r.keys || []).forEach(function (k, idx) {
        params[k] = m[idx + 1];
      });
      Object.keys(r.fixed || {}).forEach(function (k) {
        params[k] = r.fixed[k];
      });
      return { route: r, params: params };
    }
    return null;
  }

  function render() {
    document.body.classList.remove("mobile-menu-open");
    var toggle = document.getElementById("mobileMenuToggle");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Открыть меню");
    var hash = location.hash || "#/masters";
    var found = resolve(hash);
    document.body.dataset.page = hash.split("/")[1] || "masters";

    /* закрытая зона */
    if (found && found.route.auth && !global.Store.current()) {
      location.hash = "#/login/customer";
      return;
    }

    if (currentCleanup) {
      currentCleanup();
      currentCleanup = null;
    }

    var page = found ? global.Pages[found.route.page] : global.Pages.notFound;
    var params = found ? found.params : {};

    view.innerHTML = '<div class="view-enter">' + page.html(params) + "</div>";
    var root = view.firstElementChild;
    if (page.mount) page.mount(root, params);
    if (root.__cleanup) currentCleanup = root.__cleanup;

    /* каталог мастеров показывается без корпуса стола */
    document
      .getElementById("stage")
      .classList.toggle(
        "stage--bare",
        !!found && found.route.page === "masters",
      );

    stageInner.scrollTop = 0;
    global.scrollTo(0, 0);
    paintMenu(found ? found.route.nav : null);
    paintMenuShape();
    updateThumb();
  }

  /* ------------------------------- меню ----------------------------------- */
  function paintMenu(active) {
    var list = document.getElementById("menuList");
    list.innerHTML = MENU.map(function (row) {
      var isActive = row[0] === active;
      return (
        '<li class="menu__item"' +
        (isActive ? ' aria-current="true"' : "") +
        ">" +
        (isActive
          ? '<span class="bullet"></span>'
          : '<span class="pin"></span>') +
        '<a class="menu__link" href="' +
        row[2] +
        '" data-sfx="nav">' +
        esc(t(row[1])) +
        "</a>" +
        "</li>"
      );
    }).join("");
    document.querySelector(".menu__title").textContent = t("menu.title");
  }

  /* --------------------------- панель входа ------------------------------- */
  function paintLogin() {
    if (global.Office) global.Office.paintAccount();
  }

  /* ------------------------------- подвал --------------------------------- */
  function paintFooter() {
    document.getElementById("footLinks").innerHTML = [
      ["privacy", "Конфиденциальность"], ["offer", "Оферта"],
      ["info", "Информация"], ["data", "Персональные данные"]
    ].map(function (item) { return '<a href="#/legal/' + item[0] + '">' + item[1] + '</a>'; }).join("");
  }

  /* ---------------------------- бегущая строка ---------------------------- */
  /* Своя анимация вместо <marquee>: скорость не зависит от длины текста,
     а склейка получается бесшовной. */
  function startMarquee() {
    var track = document.getElementById("marqueeTrack");
    var offset = 0;
    var half = 0;
    var last = performance.now();
    var SPEED = 42; /* px в секунду */

    function fill() {
      var text = t("marquee");
      track.innerHTML =
        "<span>" + esc(text) + "</span><span>" + esc(text) + "</span>";
      half = track.firstElementChild.offsetWidth;
      offset = 0;
    }

    function tick(now) {
      var dt = (now - last) / 1000;
      last = now;
      if (!document.hidden && half > 0) {
        offset -= SPEED * Math.min(dt, 0.1);
        if (offset <= -half) offset += half;
        track.style.transform = "translate3d(" + offset.toFixed(2) + "px,0,0)";
      }
      requestAnimationFrame(tick);
    }

    fill();
    requestAnimationFrame(tick);
    global.addEventListener("resize", fill);
    return fill;
  }

  /* ------------------------------- тема ----------------------------------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("to.theme", theme);
    var toggle = document.getElementById("themeToggle");
    toggle.setAttribute("aria-pressed", String(theme === "dark"));
    toggle.setAttribute("aria-label", theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta)
      meta.setAttribute("content", theme === "dark" ? "#171717" : "#ffffff");
  }

  /* ---------------------------- форма шапки -------------------------------- */
  /* Единый корпус ABOUT + лого рисуется как одна SVG-фигура (не два div'а):
     слева невысокая полоса, справа блок логотипа повыше, переход — ступенька
     из двух дуг радиуса 26 с прямым участком между ними, как в присланном
     макете. Координаты считаются в реальных пикселях при каждом ресайзе —
     так углы остаются окружностями, а не растянутыми эллипсами. */
  function paintHeaderShape() {
    var header = document.getElementById("siteHeader");
    var fringe = header.querySelector(".fringe");
    var brand = header.querySelector(".brand");
    var path = document.getElementById("headerShapePath");
    if (getComputedStyle(fringe).position === "static") {
      path.removeAttribute("d");
      return;
    }

    if (global.innerWidth <= 900) {
      var width = header.clientWidth, split = width * .49, bottom = width * .225, top = 44, rad = 17;
      path.setAttribute("d", `M0,0 H${width} V${bottom-rad} Q${width},${bottom} ${width-rad},${bottom} H${split+rad} Q${split},${bottom} ${split},${bottom-rad} V${top+rad} Q${split},${top} ${split-rad},${top} H${rad} Q0,${top} 0,${top-rad} Z`);
      return;
    }
    var w = header.clientWidth;
    var h = brand.offsetHeight;
    var a = fringe.offsetHeight;
    var l = brand.offsetWidth;
    var r = 26;
    var notch = w - l;

    var d =
      "M0,0" +
      "H" +
      w +
      "V" +
      (h - r) +
      "A" +
      r +
      "," +
      r +
      " 0 0 1 " +
      (w - r) +
      "," +
      h +
      "H" +
      (notch + r) +
      "A" +
      r +
      "," +
      r +
      " 0 0 1 " +
      notch +
      "," +
      (h - r) +
      "V" +
      (a + r) +
      "A" +
      r +
      "," +
      r +
      " 0 0 0 " +
      (notch - r) +
      "," +
      a +
      "H" +
      r +
      "A" +
      r +
      "," +
      r +
      " 0 0 1 0," +
      (a - r) +
      "V0Z";
    path.setAttribute("d", d);
  }

  /* ---------------------------- форма меню --------------------------------- */
  /* Тот же приём, что и для шапки: форма — один SVG-путь по присланному
     menu.svg («Menu:» в собственной «пятке» сверху-слева, дуги радиуса 26),
     координаты пересчитываются в реальных пикселях при загрузке, ресайзе
     и смене языка (высота блока зависит от того, сколько строк займёт текст). */
  function paintMenuShape() {
    var menu = document.getElementById("menu");
    var path = document.getElementById("menuShapePath");
    if (global.innerWidth <= 900) {
      if (!menu.offsetWidth || !menu.offsetHeight) return;
      var joined = document.body.dataset.page !== "admin";
      path.setAttribute("d", mobilePanelPath(menu, joined, false));
      document.getElementById("loginPanel").style.top = (menu.getBoundingClientRect().bottom - 1) + "px";
      return;
    }
    document.getElementById("loginPanel").style.removeProperty("top");
    if (getComputedStyle(menu).position === "static") {
      path.removeAttribute("d");
      return;
    }
    var w = menu.offsetWidth;
    var h = menu.offsetHeight;
    if (!w || !h) return;
    var r = 26;
    var tabH = 66;
    var notchX = Math.round(w * 0.32);
    var bodyX = notchX;
    menu.style.setProperty("--menu-tab-width", notchX + "px");
    path.setAttribute(
      "d",
      "M" +
        r +
        ",0 H" +
        (w - r) +
        " Q" +
        w +
        ",0 " +
        w +
        "," +
        r +
        " V" +
        (h - r) +
        " Q" +
        w +
        "," +
        h +
        " " +
        (w - r) +
        "," +
        h +
        " H" +
        (bodyX + r) +
        " Q" +
        bodyX +
        "," +
        h +
        " " +
        bodyX +
        "," +
        (h - r) +
        " V" +
        (tabH + r) +
        " Q" +
        bodyX +
        "," +
        tabH +
        " " +
        (bodyX - r) +
        "," +
        tabH +
        " H" +
        r +
        " Q0," +
        tabH +
        " 0," +
        (tabH - r) +
        " V" +
        r +
        " Q0,0 " +
        r +
        ",0 Z",
    );
  }

  function mobilePanelPath(element, joined, inDocument) {
    var rect = element.getBoundingClientRect();
    var w = element.offsetWidth, h = element.offsetHeight, r = 17;
    var top = rect.top + (inDocument ? global.scrollY : 0);
    var notch = Math.min(w - r * 2, global.innerWidth * .49 - rect.left - 12);
    var depth = Math.max(r * 2, document.getElementById("siteHeader").clientHeight + 12 - top);
    var bottom = joined ? `V${h} H0 V${r}` : `V${h-r} Q${w},${h} ${w-r},${h} H${r} Q0,${h} 0,${h-r} V${r}`;
    return `M${r},0 H${notch-r} Q${notch},0 ${notch},${r} V${depth-r} Q${notch},${depth} ${notch+r},${depth} H${w-r} Q${w},${depth} ${w},${depth+r} ${bottom} Q0,0 ${r},0 Z`;
  }

  function paintStageShape() {
    var stage = document.getElementById("stage");
    var path = document.getElementById("stageShapePath");
    if (global.innerWidth > 900 || stage.classList.contains("stage--bare")) { path.removeAttribute("d"); return; }
    path.setAttribute("d", mobilePanelPath(stage, false, true));
  }

  /* ------------------------- декоративный скролл -------------------------- */
  function updateThumb() {
    var thumb = document.getElementById("decoThumb");
    var track = thumb.parentElement;
    var max = stageInner.scrollHeight - stageInner.clientHeight;
    track.hidden = max <= 1;
    if (track.hidden) return;
    var ratio = stageInner.scrollTop / max;
    var room = track.clientHeight - thumb.offsetHeight - 4;
    thumb.style.top = 2 + ratio * Math.max(room, 0) + "px";
  }

  /* ------------------------------ окно/модалка ---------------------------- */
  var modal = document.getElementById("modal");

  function openModal(title, html, onMount) {
    document.getElementById("modalTitle").textContent = title || "";
    document.getElementById("modalBody").innerHTML = html;
    modal.hidden = false;
    global.SFX.open();
    if (onMount) onMount(modal.querySelector(".modal__window"));
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    global.SFX.close();
  }

  modal.addEventListener("click", function (e) {
    if (e.target.hasAttribute("data-close")) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  /* ------------------------------- тосты ---------------------------------- */
  var toastEl = document.getElementById("toast");
  var toastTimer = null;

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.hidden = true;
    }, 2600);
  }

  /* ------------------------- заглушки для картинок ------------------------ */
  function imgFail(el) {
    el.onerror = null; /* чтобы не зациклиться, если и заглушка не встанет */
    el.src = global.DATA.placeholder(
      el.dataset.seed || el.alt || "to",
      el.dataset.label || el.alt,
      el.dataset.kind,
    );
    el.classList.add("is-placeholder");
  }

  /* ------------------------------ публичное ------------------------------- */
  var TO = {
    go: function (hash) {
      if (location.hash === hash) render();
      else location.hash = hash;
    },
    modal: openModal,
    closeModal: closeModal,
    toast: toast,
    imgFail: imgFail,
    refreshChrome: function () {
      paintLogin();
    },
    refreshLayout: function () { paintMenuShape(); },
  };
  global.TO = TO;

  /* -------------------------------- запуск -------------------------------- */
  function boot() {
    var mobileToggle = document.getElementById("mobileMenuToggle");
    function closeMobile() { document.body.classList.remove("mobile-menu-open"); mobileToggle.setAttribute("aria-expanded", "false"); }
    mobileToggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("mobile-menu-open");
      paintMenuShape();
      mobileToggle.setAttribute("aria-expanded", String(open));
      mobileToggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    });
    document.addEventListener("keydown", function(e) { if(e.key === "Escape") {closeMobile();mobileToggle.focus();} });
    document.addEventListener("click", function(e) { if(!e.target.closest(".menu, #loginPanel, #mobileMenuToggle")) closeMobile(); });
    applyTheme(localStorage.getItem("to.theme") || "light");
    global.I18N.set("ru");
    var refillMarquee = startMarquee();
    paintLogin();
    paintFooter();
    render();
    paintHeaderShape();
    paintMenuShape();

    /* тема */
    var themeBtn = document.getElementById("themeToggle");
    themeBtn.title = t("theme.title");
    themeBtn.addEventListener("click", function () {
      var next =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "light"
          : "dark";
      applyTheme(next); /* звук уже дал data-sfx */
    });

    stageInner.addEventListener("scroll", updateThumb, { passive: true });
    global.addEventListener("resize", updateThumb);
    var scrollObserver = new ResizeObserver(updateThumb);
    scrollObserver.observe(stageInner);
    scrollObserver.observe(view);
    new MutationObserver(updateThumb).observe(view, { childList: true, subtree: true, characterData: true });
    view.addEventListener("load", updateThumb, true);
    global.addEventListener("resize", paintHeaderShape);
    global.addEventListener("resize", paintMenuShape);
    global.addEventListener("resize", paintStageShape);
    var panelObserver = new ResizeObserver(function () { paintStageShape(); paintMenuShape(); });
    panelObserver.observe(document.getElementById("stage"));
    panelObserver.observe(document.getElementById("menu"));
    global.addEventListener("hashchange", render);
  }

  global.Pages.office = {
    html: function () {
      return '<div class="office-feature" id="office-view"></div>';
    },
    mount: function () {
      global.Office.render();
    },
  };
  global.addEventListener("office-ready", boot, { once: true });
})(window);
