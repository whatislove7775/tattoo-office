/* =========================================================================
   DRIFT — «летающие» карточки мастеров внутри белого окна.
   Отскок от границ как у заставки DVD, плюс:
   — карточки свободно наезжают друг на друга и лежат внахлёст;
   — траектории сбиваются случайными толчками, поэтому движение хаотичное;
   — карточку можно схватить курсором и перетащить, при броске она
     улетает с той скоростью, с которой её вели;
   — карточка под курсором и в фокусе замирает, иначе в неё не попасть.
   ========================================================================= */
(function (global) {
  'use strict';

  var reduce = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var SPEED_MIN = 34;    /* px/сек */
  var SPEED_MAX = 58;
  var PAD = 6;           /* отступ от краёв: покачивание чуть расширяет габарит */
  var OVERLAP = 0.25;    /* насколько карточки наезжают друг на друга */
  var DRAG_SLOP = 5;     /* сдвиг в пикселях, после которого это уже не клик */

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

    this._down = this._down.bind(this);
    this._move = this._move.bind(this);
    this._up = this._up.bind(this);
    this.el.addEventListener('pointerdown', this._down);

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
      drag: false,
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

    /* Карточки раскладываются парами: внутри пары вторая заходит на первую
       на четверть корпуса, а сами пары разнесены по всему полю — иначе
       при сплошном шаге «минус четверть» всё сбивается в кучу в центре. */
    this.fits = this.w >= cw * 2 && this.h >= ch + PAD * 2;
    if (!this.fits) { this.el.classList.add('drift--static'); return; }

    var groups = Math.ceil(n / 2);
    var gcols = Math.max(1, Math.round(Math.sqrt(groups * (this.w / Math.max(this.h, 1)))));
    var pairW = cw * (2 - OVERLAP);
    while (gcols > 1 && this.w / gcols < pairW) gcols--;
    var grows = Math.ceil(groups / gcols);

    var cellW = this.w / gcols;
    var cellH = this.h / grows;

    this.items.forEach(function (it, i) {
      it.w = it.node.offsetWidth;
      it.h = it.node.offsetHeight;

      var g = Math.floor(i / 2);
      var second = i % 2 === 1;
      var gx = (g % gcols) * cellW;
      var gy = Math.floor(g / gcols) * cellH;

      it.x = gx + (cellW - pairW) / 2 + (second ? cw * (1 - OVERLAP) : 0) + rand(-10, 10);
      it.y = gy + (cellH - it.h) / 2 + (second ? it.h * 0.16 : -it.h * 0.06) + rand(-10, 10);
      self._contain(it);

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

    var i, it;

    /* 1. движение, толчки и отскок от стен */
    for (i = 0; i < this.items.length; i++) {
      it = this.items[i];
      if (it.hover || it.drag) { if (it.ease > 0) it.ease = Math.max(0, it.ease - dt * 2.4); continue; }

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

    /* Столкновений между карточками нет: они намеренно лежат внахлёст. */
    for (i = 0; i < this.items.length; i++) this._draw(this.items[i]);
  };

  /* ------------------------- перетаскивание мышью ------------------------- */
  Drift.prototype._down = function (e) {
    if (e.button != null && e.button !== 0) return;
    var node = e.target.closest('.polaroid');
    if (!node || !node.__drift) return;

    /* Без этого браузер запускает собственное перетаскивание картинки
       и отменяет наш захват указателя на первом же движении. */
    e.preventDefault();

    var it = node.__drift;
    it.drag = true;
    it.node.classList.add('is-dragging');
    it.node.style.zIndex = ++Drift.topZ;

    var rect = this.el.getBoundingClientRect();
    it.grabX = e.clientX - rect.left - it.x;   /* где именно взяли карточку */
    it.grabY = e.clientY - rect.top - it.y;
    it.lastX = e.clientX;
    it.lastY = e.clientY;
    it.startX = e.clientX;
    it.startY = e.clientY;
    it.throwX = 0;
    it.throwY = 0;
    it.moved = false;

    this.dragging = it;
    if (node.setPointerCapture) { try { node.setPointerCapture(e.pointerId); } catch (err) {} }
    global.addEventListener('pointermove', this._move);
    global.addEventListener('pointerup', this._up);
    global.addEventListener('pointercancel', this._up);
  };

  Drift.prototype._move = function (e) {
    var it = this.dragging;
    if (!it) return;

    var rect = this.el.getBoundingClientRect();
    it.x = e.clientX - rect.left - it.grabX;
    it.y = e.clientY - rect.top - it.grabY;
    this._contain(it);

    /* запоминаем скорость ведения — с ней карточка улетит после броска */
    it.throwX = e.clientX - it.lastX;
    it.throwY = e.clientY - it.lastY;
    it.lastX = e.clientX;
    it.lastY = e.clientY;

    if (Math.abs(e.clientX - it.startX) > DRAG_SLOP ||
        Math.abs(e.clientY - it.startY) > DRAG_SLOP) {
      it.moved = true;
    }
    this._draw(it);
  };

  Drift.prototype._up = function () {
    var it = this.dragging;
    if (!it) return;

    it.drag = false;
    it.node.classList.remove('is-dragging');

    /* бросок: переводим последний сдвиг за кадр в скорость */
    var vx = it.throwX * 40;
    var vy = it.throwY * 40;
    var sp = Math.hypot(vx, vy);
    if (sp > 4) {
      it.speed = clamp(sp, SPEED_MIN, 260);
      it.vx = vx / sp * it.speed;
      it.vy = vy / sp * it.speed;
    } else {
      it.speed = rand(SPEED_MIN, SPEED_MAX);
      this._aim(it);
    }

    /* Клик по карточке открывает профиль. Если её тащили — это был не клик,
       и переход надо погасить: флаг снимается сразу после всплытия click. */
    if (it.moved) {
      it.node.__dragged = true;
      setTimeout(function () { it.node.__dragged = false; }, 0);
    }

    this.dragging = null;
    global.removeEventListener('pointermove', this._move);
    global.removeEventListener('pointerup', this._up);
    global.removeEventListener('pointercancel', this._up);
  };

  Drift.topZ = 10;

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
