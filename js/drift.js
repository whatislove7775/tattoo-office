/* =========================================================================
   DRIFT — «летающие» карточки мастеров внутри белого окна.
   Логика как у заставки DVD (отскок от границ), но плавнее:
   малые скорости, лёгкое покачивание, мягкая отдача при ударе о край.
   ========================================================================= */
(function (global) {
  'use strict';

  var reduce = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function Drift(container) {
    this.el = container;
    this.items = [];
    this.raf = null;
    this.last = 0;
    this.paused = false;
    this.w = 0;
    this.h = 0;

    this._tick = this._tick.bind(this);
    this._measure = this._measure.bind(this);

    /* карточку можно «поймать»: под курсором и в фокусе она замирает,
       иначе в неё невозможно попасть ни мышью, ни с клавиатуры */
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
      x: 0, y: 0,
      vx: 0, vy: 0,
      w: 0, h: 0,
      phase: Math.random() * Math.PI * 2,   /* фаза покачивания */
      wobble: 0.35 + Math.random() * 0.5,   /* амплитуда, градусы */
      speed: 15 + Math.random() * 13,       /* px/сек — намеренно медленно */
      hover: false,
      ease: 0                               /* отдача после удара о край */
    };
    this.items.push(item);
    node.__drift = item;
    return item;
  };

  /* Раскладываем карточки так, чтобы они стартовали не в одной точке. */
  Drift.prototype.layout = function () {
    this._measure();
    var self = this;
    var cols = Math.max(2, Math.round(Math.sqrt(this.items.length * (this.w / Math.max(this.h, 1)))));

    this.items.forEach(function (it, i) {
      it.w = it.node.offsetWidth;
      it.h = it.node.offsetHeight;

      var col = i % cols;
      var row = Math.floor(i / cols);
      var cellW = (self.w - it.w) / Math.max(cols - 1, 1);
      var cellH = (self.h - it.h) / Math.max(Math.ceil(self.items.length / cols) - 1, 1);

      it.x = clamp(col * cellW + (Math.random() - 0.5) * 26, 0, Math.max(self.w - it.w, 0));
      it.y = clamp(row * cellH + (Math.random() - 0.5) * 26, 0, Math.max(self.h - it.h, 0));

      /* угол разлёта — подальше от осей, чтобы не ползли строго по прямой */
      var a = (Math.random() * 0.6 + 0.2) * Math.PI * (Math.random() < 0.5 ? 1 : -1);
      it.vx = Math.cos(a) * it.speed * (Math.random() < 0.5 ? -1 : 1);
      it.vy = Math.sin(a) * it.speed;

      self._draw(it);
    });
  };

  Drift.prototype.start = function () {
    if (reduce) { this.el.classList.add('drift--static'); return; }
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
    /* после смены размеров возвращаем всех внутрь поля */
    this.items.forEach(function (it) {
      it.w = it.node.offsetWidth || it.w;
      it.h = it.node.offsetHeight || it.h;
      it.x = clamp(it.x, 0, Math.max(self.w - it.w, 0));
      it.y = clamp(it.y, 0, Math.max(self.h - it.h, 0));
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
    if (dt > 0.1) dt = 0.1;           /* после сворачивания вкладки не телепортируемся */

    var maxX, maxY, it, i;
    for (i = 0; i < this.items.length; i++) {
      it = this.items[i];

      if (!it.hover) {
        it.phase += dt * 0.7;   /* пойманная карточка замирает полностью */
        maxX = Math.max(this.w - it.w, 0);
        maxY = Math.max(this.h - it.h, 0);

        it.x += it.vx * dt;
        it.y += it.vy * dt;

        /* мягкий отскок: гасим скорость на 4% и слегка меняем угол,
           чтобы траектории со временем расходились */
        if (it.x <= 0)    { it.x = 0;    it.vx = Math.abs(it.vx) * 0.96 + rnd(1.5); it.ease = 1; }
        if (it.x >= maxX) { it.x = maxX; it.vx = -Math.abs(it.vx) * 0.96 - rnd(1.5); it.ease = 1; }
        if (it.y <= 0)    { it.y = 0;    it.vy = Math.abs(it.vy) * 0.96 + rnd(1.5); it.ease = 1; }
        if (it.y >= maxY) { it.y = maxY; it.vy = -Math.abs(it.vy) * 0.96 - rnd(1.5); it.ease = 1; }

        /* держим скорость в коридоре, иначе карточки либо встают, либо разгоняются */
        var sp = Math.hypot(it.vx, it.vy);
        var target = it.speed;
        if (sp > 0.01 && Math.abs(sp - target) > 0.6) {
          var k = (target / sp - 1) * Math.min(dt * 1.6, 1) + 1;
          it.vx *= k; it.vy *= k;
        }
      }

      if (it.ease > 0) it.ease = Math.max(0, it.ease - dt * 2.4);
      this._draw(it);
    }
  };

  Drift.prototype._draw = function (it) {
    /* покачивание + микро-масштаб на отскоке — от этого движение
       читается как «плывёт», а не «едет» */
    var tilt = Math.sin(it.phase) * it.wobble;
    var pop = 1 + it.ease * 0.012;
    it.node.style.transform =
      'translate3d(' + it.x.toFixed(2) + 'px,' + it.y.toFixed(2) + 'px,0)' +
      ' rotate(' + tilt.toFixed(2) + 'deg) scale(' + pop.toFixed(3) + ')';
  };

  function clamp(v, min, max) { return v < min ? min : (v > max ? max : v); }
  function rnd(n) { return (Math.random() - 0.5) * n; }

  Drift.reduced = reduce;
  global.Drift = Drift;
})(window);
