/* =========================================================================
   DRIFT — «летающие» карточки мастеров внутри белого окна.
   Отскок от границ как у заставки DVD, плюс:
   — карточки сталкиваются друг с другом и не наезжают одна на другую;
   — траектории сбиваются случайными толчками, поэтому движение хаотичное;
   — карточка под курсором и в фокусе замирает, иначе в неё не попасть.
   ========================================================================= */
(function (global) {
  'use strict';

  var reduce = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var SPEED_MIN = 34;    /* px/сек */
  var SPEED_MAX = 58;
  var GAP = 8;           /* зазор между карточками при расталкивании */
  var PAD = 6;           /* отступ от краёв: покачивание чуть расширяет габарит */

  function Drift(container) {
    this.el = container;
    this.items = [];
    this.raf = null;
    this.last = 0;
    this.paused = false;
    this.fits = true;     /* хватает ли места разложить карточки без нахлёста */
    this.w = 0;
    this.h = 0;

    this._tick = this._tick.bind(this);
    this._measure = this._measure.bind(this);

    this.el.addEventListener('pointerover', this._hover.bind(this, true));
    this.el.addEventListener('pointerout', this._hover.bind(this, false));
    this.el.addEventListener('focusin', this._hover.bind(this, true));
    this.el.addEventListener('focusout', this._hover.bind(this, false));

    this.ro = global.ResizeObserver ? new ResizeObserver(this._measure) : null;
    if (this.ro) this.ro.observe(this.el);
    else global.addEventListener('resize', this._measure);

    document.addEventListener('visibilitychange', this._visibility.bind(this));
  }

  Drift.prototype.add = function (node) {
    var item = {
      node: node,
      x: 0, y: 0, vx: 0, vy: 0, w: 0, h: 0,
      phase: Math.random() * Math.PI * 2,
      wobble: 0.4 + Math.random() * 0.6,
      speed: rand(SPEED_MIN, SPEED_MAX),
      nudgeIn: rand(0.8, 3.2),   /* через сколько секунд следующий толчок */
      hover: false,
      ease: 0
    };
    this.items.push(item);
    node.__drift = item;
    return item;
  };

  /* Стартовая раскладка по ячейкам сетки: гарантирует, что в начале
     ни одна карточка не перекрывает другую. */
  Drift.prototype.layout = function () {
    this._measure();
    var self = this;
    var n = this.items.length;
    if (!n) return;

    var cw = this.items[0].node.offsetWidth;
    var ch = this.items[0].node.offsetHeight;

    /* подбираем сетку с пропорциями поля */
    var cols = Math.max(1, Math.round(Math.sqrt(n * (this.w / Math.max(this.h, 1)))));
    var rows = Math.ceil(n / cols);
    while (cols > 1 && this.w / cols < cw + GAP) { cols--; rows = Math.ceil(n / cols); }
    while (rows * (ch + GAP) > this.h && cols < n) { cols++; rows = Math.ceil(n / cols); }

    var cellW = this.w / cols;
    var cellH = this.h / rows;

    /* если карточки физически не помещаются — отдаём обычную сетку */
    this.fits = cellW >= cw && cellH >= ch;
    if (!this.fits) { this.el.classList.add('drift--static'); return; }

    this.items.forEach(function (it, i) {
      it.w = it.node.offsetWidth;
      it.h = it.node.offsetHeight;

      var col = i % cols;
      var row = Math.floor(i / cols);
      var slackX = (cellW - it.w) / 2;
      var slackY = (cellH - it.h) / 2;

      it.x = col * cellW + slackX + rand(-slackX, slackX) * 0.7;
      it.y = row * cellH + slackY + rand(-slackY, slackY) * 0.7;
      it.x = clamp(it.x, 0, Math.max(self.w - it.w, 0));
      it.y = clamp(it.y, 0, Math.max(self.h - it.h, 0));

      self._aim(it);
      self._draw(it);
    });
  };

  /* задаёт случайное направление при текущей скорости */
  Drift.prototype._aim = function (it) {
    var a = Math.random() * Math.PI * 2;
    it.vx = Math.cos(a) * it.speed;
    it.vy = Math.sin(a) * it.speed;
  };

  Drift.prototype.start = function () {
    if (reduce || !this.fits) { this.el.classList.add('drift--static'); return; }
    if (this.raf) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this._tick);
  };

  Drift.prototype.stop = function () {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
    if (this.ro) this.ro.disconnect();
    else global.removeEventListener('resize', this._measure);
  };

  Drift.prototype._measure = function () {
    this.w = this.el.clientWidth;
    this.h = this.el.clientHeight;
    var self = this;
    this.items.forEach(function (it) {
      it.w = it.node.offsetWidth || it.w;
      it.h = it.node.offsetHeight || it.h;
      self._contain(it);
      self._draw(it);
    });
  };

  Drift.prototype._hover = function (state, e) {
    var node = e.target.closest('.polaroid');
    if (node && node.__drift) node.__drift.hover = state;
  };

  Drift.prototype._visibility = function () {
    this.paused = document.hidden;
    if (!document.hidden && this.raf) this.last = performance.now();
  };

  Drift.prototype._tick = function (now) {
    this.raf = requestAnimationFrame(this._tick);

    var dt = (now - this.last) / 1000;
    this.last = now;
    if (this.paused || dt <= 0) return;
    if (dt > 0.1) dt = 0.1;

    var i, j, it;

    /* 1. движение, толчки и отскок от стен */
    for (i = 0; i < this.items.length; i++) {
      it = this.items[i];
      if (it.hover) { if (it.ease > 0) it.ease = Math.max(0, it.ease - dt * 2.4); continue; }

      it.phase += dt * 0.9;

      /* случайный толчок: слегка доворачиваем курс и меняем целевую скорость */
      it.nudgeIn -= dt;
      if (it.nudgeIn <= 0) {
        it.nudgeIn = rand(0.8, 3.2);
        it.speed = rand(SPEED_MIN, SPEED_MAX);
        var a = Math.atan2(it.vy, it.vx) + rand(-0.6, 0.6);
        it.vx = Math.cos(a) * it.speed;
        it.vy = Math.sin(a) * it.speed;
      }

      it.x += it.vx * dt;
      it.y += it.vy * dt;

      var maxX = Math.max(this.w - it.w - PAD, PAD);
      var maxY = Math.max(this.h - it.h - PAD, PAD);

      if (it.x <= PAD)  { it.x = PAD;  it.vx = Math.abs(it.vx); it.vy += rand(-4, 4); it.ease = 1; }
      if (it.x >= maxX) { it.x = maxX; it.vx = -Math.abs(it.vx); it.vy += rand(-4, 4); it.ease = 1; }
      if (it.y <= PAD)  { it.y = PAD;  it.vy = Math.abs(it.vy); it.vx += rand(-4, 4); it.ease = 1; }
      if (it.y >= maxY) { it.y = maxY; it.vy = -Math.abs(it.vy); it.vx += rand(-4, 4); it.ease = 1; }

      /* держим скорость в коридоре: иначе карточки либо встают, либо разгоняются */
      var sp = Math.hypot(it.vx, it.vy);
      if (sp > 0.01) {
        var k = (it.speed / sp - 1) * Math.min(dt * 2, 1) + 1;
        it.vx *= k; it.vy *= k;
      } else {
        this._aim(it);
      }

      if (it.ease > 0) it.ease = Math.max(0, it.ease - dt * 2.4);
    }

    /* 2. столкновения карточек — расталкиваем, чтобы не было нахлёста */
    for (i = 0; i < this.items.length; i++) {
      for (j = i + 1; j < this.items.length; j++) {
        this._collide(this.items[i], this.items[j]);
      }
    }

    for (i = 0; i < this.items.length; i++) this._draw(this.items[i]);
  };

  /* Прямоугольники: расходятся по оси наименьшего перекрытия
     и обмениваются скоростью вдоль неё — как два бильярдных шара. */
  Drift.prototype._collide = function (a, b) {
    var ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) + GAP;
    if (ox <= 0) return;
    var oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) + GAP;
    if (oy <= 0) return;

    var aFixed = a.hover, bFixed = b.hover;
    if (aFixed && bFixed) return;

    /* доли расталкивания: пойманная курсором карточка не двигается */
    var sa = aFixed ? 0 : (bFixed ? 1 : 0.5);
    var sb = bFixed ? 0 : (aFixed ? 1 : 0.5);

    if (ox < oy) {
      var dirX = (a.x + a.w / 2) < (b.x + b.w / 2) ? -1 : 1;
      a.x += dirX * ox * sa;
      b.x -= dirX * ox * sb;
      if (!aFixed && !bFixed) { var tx = a.vx; a.vx = b.vx * 0.98; b.vx = tx * 0.98; }
      else if (aFixed) b.vx = -b.vx;
      else a.vx = -a.vx;
    } else {
      var dirY = (a.y + a.h / 2) < (b.y + b.h / 2) ? -1 : 1;
      a.y += dirY * oy * sa;
      b.y -= dirY * oy * sb;
      if (!aFixed && !bFixed) { var ty = a.vy; a.vy = b.vy * 0.98; b.vy = ty * 0.98; }
      else if (aFixed) b.vy = -b.vy;
      else a.vy = -a.vy;
    }

    a.ease = 1; b.ease = 1;
    this._contain(a);
    this._contain(b);
  };

  Drift.prototype._contain = function (it) {
    it.x = clamp(it.x, PAD, Math.max(this.w - it.w - PAD, PAD));
    it.y = clamp(it.y, PAD, Math.max(this.h - it.h - PAD, PAD));
  };

  Drift.prototype._draw = function (it) {
    var tilt = Math.sin(it.phase) * it.wobble;
    var pop = 1 + it.ease * 0.014;
    it.node.style.transform =
      'translate3d(' + it.x.toFixed(2) + 'px,' + it.y.toFixed(2) + 'px,0)' +
      ' rotate(' + tilt.toFixed(2) + 'deg) scale(' + pop.toFixed(3) + ')';
  };

  function clamp(v, min, max) { return v < min ? min : (v > max ? max : v); }
  function rand(a, b) { return a + Math.random() * (b - a); }

  Drift.reduced = reduce;
  global.Drift = Drift;
})(window);
