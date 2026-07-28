/* =========================================================================
   APP — маршрутизация, общая обвязка окна и мелкая механика интерфейса.
   ========================================================================= */
(function (global) {
  'use strict';

  var t = global.t;
  var esc = function (s) { return global.Pages.esc(s); };

  var view = document.getElementById('view');
  var stageInner = view;
  var currentCleanup = null;

  /* ------------------------------ маршруты -------------------------------- */
  var ROUTES = [
    { rx: /^#?\/?$/,                    page: 'masters',    nav: 'masters' },
    { rx: /^#\/masters$/,               page: 'masters',    nav: 'masters' },
    { rx: /^#\/master\/([\w-]+)$/,      page: 'master',     nav: 'masters', keys: ['id'] },
    { rx: /^#\/book\/([\w-]+)$/,        page: 'bookMaster', nav: 'masters', keys: ['id'] },
    { rx: /^#\/interior$/,              page: 'interior',   nav: 'interior' },
    { rx: /^#\/find$/,                  page: 'find',       nav: 'find' },
    { rx: /^#\/safety$/,                page: 'safety',     nav: 'safety' },
    { rx: /^#\/archive$/,               page: 'archive',    nav: 'archive' },
    { rx: /^#\/feedback$/,              page: 'feedback',   nav: 'feedback' },
    { rx: /^#\/(login|signup)\/(master|customer)$/, page: 'auth', keys: ['mode', 'role'] },
    { rx: /^#\/cabinet$/,               page: 'cabinet',    auth: true },
    { rx: /^#\/legal\/(\w+)$/,          page: 'doc',        keys: ['doc'] },
    { rx: /^#\/about$/,                 page: 'doc',        fixed: { doc: 'about' } }
  ];

  var MENU = [
    ['masters',  'nav.masters',  '#/masters'],
    ['interior', 'nav.interior', '#/interior'],
    ['find',     'nav.find',     '#/find'],
    ['safety',   'nav.safety',   '#/safety'],
    ['archive',  'nav.archive',  '#/archive'],
    ['feedback', 'nav.feedback', '#/feedback']
  ];

  function resolve(hash) {
    for (var i = 0; i < ROUTES.length; i++) {
      var m = hash.match(ROUTES[i].rx);
      if (!m) continue;
      var r = ROUTES[i];
      var params = {};
      (r.keys || []).forEach(function (k, idx) { params[k] = m[idx + 1]; });
      Object.keys(r.fixed || {}).forEach(function (k) { params[k] = r.fixed[k]; });
      return { route: r, params: params };
    }
    return null;
  }

  function render() {
    var hash = location.hash || '#/masters';
    var found = resolve(hash);

    /* закрытая зона */
    if (found && found.route.auth && !global.Store.current()) {
      location.hash = '#/login/customer';
      return;
    }

    if (currentCleanup) { currentCleanup(); currentCleanup = null; }

    var page = found ? global.Pages[found.route.page] : global.Pages.notFound;
    var params = found ? found.params : {};

    view.innerHTML = '<div class="view-enter">' + page.html(params) + '</div>';
    var root = view.firstElementChild;
    if (page.mount) page.mount(root, params);
    if (root.__cleanup) currentCleanup = root.__cleanup;

    /* каталог мастеров показывается без корпуса стола */
    document.getElementById('stage')
      .classList.toggle('stage--bare', !!found && found.route.page === 'masters');

    stageInner.scrollTop = 0;
    paintMenu(found ? found.route.nav : null);
    paintMenuShape();
    updateThumb();
  }

  /* ------------------------------- меню ----------------------------------- */
  function paintMenu(active) {
    var list = document.getElementById('menuList');
    list.innerHTML = MENU.map(function (row) {
      var isActive = row[0] === active;
      return '<li class="menu__item"' + (isActive ? ' aria-current="true"' : '') + '>' +
               (isActive ? '<span class="bullet"></span>' : '<span class="pin"></span>') +
               '<a class="menu__link" href="' + row[2] + '" data-sfx="nav">' + esc(t(row[1])) + '</a>' +
             '</li>';
    }).join('');
    document.querySelector('.menu__title').textContent = t('menu.title');
  }

  /* --------------------------- панель входа ------------------------------- */
  function paintLogin() {
    var el = document.getElementById('loginPanel');
    var user = global.Store.current();

    if (user) {
      /* вошёл — вместо «Log in:» карточка аккаунта с аватаром */
      el.classList.add('login--user');
      el.innerHTML =
        '<a class="who" href="#/cabinet" data-sfx="nav">' +
          global.Pages.img(global.Pages.avatarSrc(user), 'ava-' + user.login, user.name, 'who__ava') +
          '<span class="who__text">' +
            '<span class="who__name">' + esc(user.name) + '</span>' +
            '<span class="who__role">' + esc(t('login.role.' + user.role)) + '</span>' +
          '</span>' +
        '</a>' +
        '<a class="who__out" href="#/masters" id="logoutLink" data-sfx="close">' +
          esc(t('cab.escape')) + '</a>';

      el.querySelector('#logoutLink').addEventListener('click', function () {
        global.Store.logout();
        paintLogin();
        if (location.hash === '#/cabinet') location.hash = '#/masters';
      });

    } else {
      el.classList.remove('login--user');
      el.innerHTML =
        '<div class="login__row">' +
          '<span class="login__label">' + esc(t('login.title')) + '</span>' +
          '<span class="login__links">' +
            '<a href="#/login/customer" data-sfx="nav">' + esc(t('login.customer')) + '</a>' +
            '<a href="#/login/master" data-sfx="nav">' + esc(t('login.master')) + '</a>' +
          '</span>' +
        '</div>';
    }
  }

  /* ------------------------------- подвал --------------------------------- */
  function paintFooter() {
    document.getElementById('footLinks').innerHTML =
      '<a href="#/legal/privacy">' + esc(t('foot.privacy')) + '</a> / ' +
      '<a href="#/legal/offer">' + esc(t('foot.offer')) + '</a> / ' +
      '<a href="#/legal/info">' + esc(t('foot.info')) + '</a> / ' +
      '<a href="#/legal/data">' + esc(t('foot.data')) + '</a>';
  }

  /* ---------------------------- бегущая строка ---------------------------- */
  /* Своя анимация вместо <marquee>: скорость не зависит от длины текста,
     а склейка получается бесшовной. */
  function startMarquee() {
    var track = document.getElementById('marqueeTrack');
    var offset = 0;
    var half = 0;
    var last = performance.now();
    var SPEED = 42; /* px в секунду */

    function fill() {
      var text = t('marquee');
      track.innerHTML = '<span>' + esc(text) + '</span><span>' + esc(text) + '</span>';
      half = track.firstElementChild.offsetWidth;
      offset = 0;
    }

    function tick(now) {
      var dt = (now - last) / 1000;
      last = now;
      if (!document.hidden && half > 0) {
        offset -= SPEED * Math.min(dt, 0.1);
        if (offset <= -half) offset += half;
        track.style.transform = 'translate3d(' + offset.toFixed(2) + 'px,0,0)';
      }
      requestAnimationFrame(tick);
    }

    fill();
    requestAnimationFrame(tick);
    global.addEventListener('resize', fill);
    return fill;
  }

  /* ------------------------------- тема ----------------------------------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('to.theme', theme);
    document.getElementById('themeState').textContent = t(theme === 'dark' ? 'theme.off' : 'theme.on');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#17171a' : '#e8e8e6');
  }

  /* ---------------------------- форма шапки -------------------------------- */
  /* Единый корпус ABOUT + лого рисуется как одна SVG-фигура (не два div'а):
     слева невысокая полоса, справа блок логотипа повыше, переход — ступенька
     из двух дуг радиуса 26 с прямым участком между ними, как в присланном
     макете. Координаты считаются в реальных пикселях при каждом ресайзе —
     так углы остаются окружностями, а не растянутыми эллипсами. */
  function paintHeaderShape() {
    var header = document.getElementById('siteHeader');
    var fringe = header.querySelector('.fringe');
    var brand = header.querySelector('.brand');
    var path = document.getElementById('headerShapePath');
    if (getComputedStyle(fringe).position === 'static') { path.removeAttribute('d'); return; }

    var w = header.clientWidth;
    var h = brand.offsetHeight;
    var a = fringe.offsetHeight;
    var l = brand.offsetWidth;
    var r = 26;
    var notch = w - l;

    var d = 'M0,0' +
      'H' + w +
      'V' + (h - r) +
      'A' + r + ',' + r + ' 0 0 1 ' + (w - r) + ',' + h +
      'H' + (notch + r) +
      'A' + r + ',' + r + ' 0 0 1 ' + notch + ',' + (h - r) +
      'V' + (a + r) +
      'A' + r + ',' + r + ' 0 0 0 ' + (notch - r) + ',' + a +
      'H' + r +
      'A' + r + ',' + r + ' 0 0 1 0,' + (a - r) +
      'V0Z';
    path.setAttribute('d', d);
  }

  /* ---------------------------- форма меню --------------------------------- */
  /* Тот же приём, что и для шапки: форма — один SVG-путь по присланному
     menu.svg («Menu:» в собственной «пятке» сверху-слева, дуги радиуса 26),
     координаты пересчитываются в реальных пикселях при загрузке, ресайзе
     и смене языка (высота блока зависит от того, сколько строк займёт текст). */
  function paintMenuShape() {
    var menu = document.getElementById('menu');
    var path = document.getElementById('menuShapePath');
    if (getComputedStyle(menu).position === 'static') { path.removeAttribute('d'); return; }
    var w = menu.offsetWidth;
    var h = menu.offsetHeight;
    if (!w || !h) return;
    var r = 26;
    var tabH = Math.round(h * 0.211);
    var notchX = Math.round(w * 0.32);

    var d = 'M0,' + r +
      'A' + r + ',' + r + ' 0 0 1 ' + r + ',0' +
      'H' + (w - r) +
      'A' + r + ',' + r + ' 0 0 1 ' + w + ',' + r +
      'V' + (h - r) +
      'A' + r + ',' + r + ' 0 0 1 ' + (w - r) + ',' + h +
      'H' + notchX +
      'A' + r + ',' + r + ' 0 0 1 ' + (notchX - r) + ',' + (h - r) +
      'V' + (tabH + r) +
      'A' + r + ',' + r + ' 0 0 0 ' + (notchX - r) + ',' + tabH +
      'H' + r +
      'A' + r + ',' + r + ' 0 0 1 0,' + (tabH - r) +
      'V' + r + 'Z';
    path.setAttribute('d', d);
  }

  /* ------------------------- декоративный скролл -------------------------- */
  function updateThumb() {
    var thumb = document.getElementById('decoThumb');
    var track = thumb.parentElement;
    var max = stageInner.scrollHeight - stageInner.clientHeight;
    var ratio = max > 0 ? stageInner.scrollTop / max : 0;
    var room = track.clientHeight - thumb.offsetHeight - 4;
    thumb.style.top = (2 + ratio * Math.max(room, 0)) + 'px';
  }

  /* ------------------------------ окно/модалка ---------------------------- */
  var modal = document.getElementById('modal');

  function openModal(title, html, onMount) {
    document.getElementById('modalTitle').textContent = title || '';
    document.getElementById('modalBody').innerHTML = html;
    modal.hidden = false;
    global.SFX.open();
    if (onMount) onMount(modal.querySelector('.modal__window'));
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    global.SFX.close();
  }

  modal.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-close')) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ------------------------------- тосты ---------------------------------- */
  var toastEl = document.getElementById('toast');
  var toastTimer = null;

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 2600);
  }

  /* ------------------------- заглушки для картинок ------------------------ */
  function imgFail(el) {
    el.onerror = null;   /* чтобы не зациклиться, если и заглушка не встанет */
    el.src = global.DATA.placeholder(el.dataset.seed || el.alt || 'to',
                                    el.dataset.label || el.alt, el.dataset.kind);
    el.classList.add('is-placeholder');
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
    refreshChrome: function () { paintLogin(); }
  };
  global.TO = TO;

  /* -------------------------------- запуск -------------------------------- */
  function boot() {
    applyTheme(localStorage.getItem('to.theme') || 'light');
    var refillMarquee = startMarquee();
    paintLogin();
    paintFooter();
    render();
    paintHeaderShape();
    paintMenuShape();

    /* переключение языка */
    document.querySelectorAll('.lang__btn').forEach(function (btn) {
      btn.setAttribute('aria-current', String(btn.dataset.lang === global.I18N.get()));
      btn.addEventListener('click', function () {
        if (!global.I18N.set(btn.dataset.lang)) return;   /* звук уже дал data-sfx */
        document.querySelectorAll('.lang__btn').forEach(function (b) {
          b.setAttribute('aria-current', String(b.dataset.lang === global.I18N.get()));
        });
        refillMarquee();
        applyTheme(document.documentElement.getAttribute('data-theme'));
        paintLogin();
        paintFooter();
        render();
      });
    });

    /* тема */
    var themeBtn = document.getElementById('themeToggle');
    themeBtn.title = t('theme.title');
    themeBtn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);   /* звук уже дал data-sfx */
    });

    stageInner.addEventListener('scroll', updateThumb, { passive: true });
    global.addEventListener('resize', updateThumb);
    global.addEventListener('resize', paintHeaderShape);
    global.addEventListener('resize', paintMenuShape);
    global.addEventListener('hashchange', render);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
