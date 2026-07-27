/* =========================================================================
   SFX — интерфейсные звуки в духе старых операционных систем.
   Синтезируются через WebAudio, поэтому не тянут за собой ни одного файла
   и не грузят страницу. Всё мягкое: короткие огибающие, без резких атак.
   ========================================================================= */
(function (global) {
  'use strict';

  var ctx = null;
  var master = null;
  var enabled = localStorage.getItem('to.sound') !== 'off';

  /* Контекст создаётся только после первого жеста пользователя —
     иначе браузер его всё равно заблокирует. */
  function ensure() {
    if (ctx) return ctx;
    var AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.95;

    /* «Корпусной» фильтр: снимаем самый верх, но оставляем щелчкам щёлк.
       Слишком низкий срез делал звуки почти неслышными. */
    var bus = ctx.createBiquadFilter();
    bus.type = 'lowpass';
    bus.frequency.value = 9000;
    bus.Q.value = 0.4;

    bus.connect(master);
    master.connect(ctx.destination);
    ensure.bus = bus;
    return ctx;
  }

  /* Разблокировка на первом же жесте: браузеры (особенно iOS) поднимают
     контекст только внутри обработчика реального ввода. */
  function unlock() {
    var c = ensure();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    if (unlock.done) return;
    unlock.done = true;
    /* пустой буфер — обязательный ритуал для iOS */
    var s = c.createBufferSource();
    s.buffer = c.createBuffer(1, 1, c.sampleRate);
    s.connect(c.destination);
    s.start(0);
  }

  ['pointerdown', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) {
    document.addEventListener(ev, unlock, { capture: true, passive: true });
  });

  /* Планируем строго не в прошлом: иначе первый звук после запуска
     контекста проигрывается «в нулевой момент» и пропадает. */
  function now() { return Math.max(ctx.currentTime, 0) + 0.001; }

  /* Один тон с плавной ADSR-огибающей. */
  function tone(opts) {
    var c = ensure();
    if (!c || !enabled) return;
    if (c.state === 'suspended') c.resume();

    var t0   = now() + (opts.delay || 0);
    var dur  = opts.dur || 0.12;
    var peak = (opts.gain == null ? 0.22 : opts.gain);

    var osc = c.createOscillator();
    osc.type = opts.type || 'sine';
    osc.frequency.setValueAtTime(opts.freq, t0);
    if (opts.to) osc.frequency.exponentialRampToValueAtTime(opts.to, t0 + dur);

    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + Math.min(0.012, dur * 0.25));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(g);
    g.connect(ensure.bus);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
  }

  /* Короткий шумовой «щелчок» механической клавиши. */
  function noise(opts) {
    var c = ensure();
    if (!c || !enabled) return;
    if (c.state === 'suspended') c.resume();

    opts = opts || {};
    var dur = opts.dur || 0.05;
    var len = Math.max(1, Math.floor(c.sampleRate * dur));
    var buf = c.createBuffer(1, len, c.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }

    var src = c.createBufferSource();
    src.buffer = buf;

    var bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = opts.freq || 1800;
    bp.Q.value = opts.q || 1.1;

    var g = c.createGain();
    g.gain.value = opts.gain == null ? 0.12 : opts.gain;

    src.connect(bp); bp.connect(g); g.connect(ensure.bus);
    src.start(now());
  }

  /* ------------------------------ библиотека ------------------------------ */
  var SFX = {
    /* наведение — почти неслышный «выдох» */
    hover: function () { tone({ freq: 1320, to: 1560, dur: 0.055, gain: 0.09, type: 'sine' }); },

    /* обычный клик — мягкая клавиша офисного телефона */
    click: function () {
      noise({ freq: 2600, dur: 0.04, gain: 0.30 });
      tone({ freq: 660, to: 520, dur: 0.09, gain: 0.34, type: 'triangle' });
    },

    /* переход между разделами — «перелистывание» */
    nav: function () {
      tone({ freq: 520, to: 780, dur: 0.13, gain: 0.34, type: 'sine' });
      tone({ freq: 1040, dur: 0.11, gain: 0.16, type: 'sine', delay: 0.05 });
    },

    /* открытие окна / модалки */
    open: function () {
      tone({ freq: 620, dur: 0.12, gain: 0.30, type: 'sine' });
      tone({ freq: 930, dur: 0.16, gain: 0.26, type: 'sine', delay: 0.06 });
    },

    /* закрытие */
    close: function () {
      tone({ freq: 880, to: 560, dur: 0.15, gain: 0.28, type: 'sine' });
    },

    /* успех — маленький мажорный аккорд, как приветствие системы */
    ok: function () {
      tone({ freq: 587.33, dur: 0.18, gain: 0.30, type: 'sine' });               // D5
      tone({ freq: 739.99, dur: 0.20, gain: 0.28, type: 'sine', delay: 0.07 });  // F#5
      tone({ freq: 987.77, dur: 0.32, gain: 0.24, type: 'sine', delay: 0.14 });  // B5
    },

    /* ошибка — вежливая, не «системный крик» */
    error: function () {
      tone({ freq: 320, dur: 0.15, gain: 0.34, type: 'triangle' });
      tone({ freq: 240, dur: 0.22, gain: 0.30, type: 'triangle', delay: 0.11 });
    },

    /* тумблер темы */
    toggle: function () {
      noise({ freq: 900, dur: 0.045, gain: 0.26, q: 0.8 });
      tone({ freq: 440, to: 880, dur: 0.10, gain: 0.22, type: 'square' });
    },

    /* вход в личный кабинет — «загрузка системы» */
    login: function () {
      var seq = [392.00, 523.25, 659.25, 783.99];
      seq.forEach(function (f, i) {
        tone({ freq: f, dur: 0.28, gain: 0.26, type: 'sine', delay: i * 0.085 });
      });
    },

    /* бронирование подтверждено — «печать поставлена» */
    stamp: function () {
      noise({ freq: 420, dur: 0.10, gain: 0.52, q: 0.6 });
      tone({ freq: 180, to: 120, dur: 0.16, gain: 0.40, type: 'triangle' });
      tone({ freq: 880, dur: 0.24, gain: 0.20, type: 'sine', delay: 0.10 });
    }
  };

  SFX.isOn = function () { return enabled; };
  SFX.setEnabled = function (v) {
    enabled = !!v;
    localStorage.setItem('to.sound', enabled ? 'on' : 'off');
    if (enabled) SFX.toggle();
  };
  SFX.play = function (name) { if (SFX[name]) SFX[name](); };

  /* ------------------------- озвучка всего интерфейса --------------------- */
  /* Элемент с data-sfx звучит указанным звуком; любой другой интерактивный
     элемент получает клик по умолчанию — чтобы «немых» кнопок не осталось. */
  var CLICKABLE = 'a, button, .slot, .tab, .dot, .polaroid, [role="button"], summary';

  document.addEventListener('pointerdown', function (e) {
    var tagged = e.target.closest('[data-sfx]');
    if (tagged) { SFX.play(tagged.getAttribute('data-sfx')); return; }
    if (e.target.closest(CLICKABLE)) SFX.click();
  }, { passive: true });

  /* наведение — общий тихий отклик для всего кликабельного */
  document.addEventListener('pointerover', function (e) {
    var el = e.target.closest(CLICKABLE + ', [data-sfx-hover]');
    if (el && !el.__hovered) {
      el.__hovered = true;
      SFX.hover();
      setTimeout(function () { el.__hovered = false; }, 260);
    }
  }, { passive: true });

  /* поля ввода: мягкая клавиша печатной машинки */
  document.addEventListener('keydown', function (e) {
    var el = e.target;
    if (!el.matches || !el.matches('input, textarea')) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === 'Enter')          tone({ freq: 520, to: 420, dur: 0.10, gain: 0.26, type: 'triangle' });
    else if (e.key === 'Backspace') noise({ freq: 1200, dur: 0.035, gain: 0.18 });
    else if (e.key.length === 1)    noise({ freq: 2000 + Math.random() * 700, dur: 0.03, gain: 0.16 });
  }, { passive: true });

  /* выпадающие списки, даты, чекбоксы */
  document.addEventListener('change', function (e) {
    if (e.target.matches && e.target.matches('select, input[type="date"], input[type="checkbox"], input[type="radio"]')) {
      SFX.toggle();
    }
  }, { passive: true });

  /* фокус с клавиатуры — едва слышный ориентир */
  document.addEventListener('focusin', function (e) {
    if (e.target.matches && e.target.matches('input, textarea, select')) SFX.hover();
  }, { passive: true });

  global.SFX = SFX;
})(window);
