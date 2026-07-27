/* =========================================================================
   SFX — интерфейсные звуки в духе старых операционных систем.
   Синтезируются через WebAudio, поэтому не тянут за собой ни одного файла
   и не грузят страницу. Только мягкие синусы с плавной огибающей,
   только на нажатие: наведение и набор текста не озвучиваются.
   ========================================================================= */
(function (global) {
  'use strict';

  var ctx = null;
  var master = null;
  /* Звук включён всегда и выключателя не имеет — так задумано.
     Заодно подчищаем ключи прежних версий: там звук можно было
     выключить, и это состояние осталось бы в браузере навсегда. */
  try {
    localStorage.removeItem('to.sound');
    localStorage.removeItem('to.sound.v2');
  } catch (e) {}
  var enabled = true;

  /* Контекст создаётся только после первого жеста пользователя —
     иначе браузер его всё равно заблокирует. */
  function ensure() {
    if (ctx) return ctx;
    var AC = global.AudioContext || global.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 1.0;

    /* Мягкий срез: без верхних частот звук слышен, но не режет ухо. */
    var bus = ctx.createBiquadFilter();
    bus.type = 'lowpass';
    bus.frequency.value = 3400;
    bus.Q.value = 0.3;

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

    /* Плавно вводим и так же плавно уводим: атака в треть длительности,
       затухание по кривой — щелчков на старте и обрыве не остаётся. */
    var attack = Math.max(0.035, dur * 0.34);
    var g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
    g.gain.setTargetAtTime(0.0001, t0 + attack, dur * 0.32);

    osc.connect(g);
    g.connect(ensure.bus);
    osc.start(t0);
    osc.stop(t0 + dur + attack + 0.4);
  }

  /* ------------------------------ библиотека ------------------------------ */
  /* Всё на синусах с плавной огибающей: шумовые «щелчки» убраны — именно
     они делали интерфейс дробным и резким. */
  var SFX = {
    /* обычное нажатие — короткий мягкий отклик */
    click: function () {
      tone({ freq: 480, to: 400, dur: 0.18, gain: 0.22, type: 'sine' });
    },

    /* переход между разделами — «перелистывание» */
    nav: function () {
      tone({ freq: 420, to: 560, dur: 0.24, gain: 0.21, type: 'sine' });
      tone({ freq: 700, dur: 0.20, gain: 0.06, type: 'sine', delay: 0.07 });
    },

    /* открытие окна */
    open: function () {
      tone({ freq: 520, dur: 0.26, gain: 0.20, type: 'sine' });
      tone({ freq: 780, dur: 0.26, gain: 0.08, type: 'sine', delay: 0.08 });
    },

    /* закрытие */
    close: function () {
      tone({ freq: 700, to: 470, dur: 0.28, gain: 0.19, type: 'sine' });
    },

    /* успех — тихий мажорный аккорд */
    ok: function () {
      tone({ freq: 523.25, dur: 0.30, gain: 0.18, type: 'sine' });               // C5
      tone({ freq: 659.25, dur: 0.32, gain: 0.09, type: 'sine', delay: 0.09 });  // E5
      tone({ freq: 783.99, dur: 0.42, gain: 0.08, type: 'sine', delay: 0.18 });  // G5
    },

    /* ошибка — вежливая, без резкости */
    error: function () {
      tone({ freq: 300, dur: 0.28, gain: 0.21, type: 'sine' });
      tone({ freq: 225, dur: 0.34, gain: 0.11, type: 'sine', delay: 0.14 });
    },

    /* переключатель */
    toggle: function () {
      tone({ freq: 400, to: 620, dur: 0.22, gain: 0.19, type: 'sine' });
    },

    /* вход в личный кабинет */
    login: function () {
      var seq = [392.00, 523.25, 659.25, 783.99];
      seq.forEach(function (f, i) {
        tone({ freq: f, dur: 0.34, gain: 0.14, type: 'sine', delay: i * 0.10 });
      });
    },

    /* бронирование подтверждено — мягкая «печать» */
    stamp: function () {
      tone({ freq: 190, to: 130, dur: 0.32, gain: 0.26, type: 'sine' });
      tone({ freq: 570, dur: 0.30, gain: 0.07, type: 'sine', delay: 0.10 });
    }
  };

  SFX.play = function (name) { if (SFX[name]) SFX[name](); };

  /* --------------------------- озвучка нажатий ---------------------------- */
  /* Звук только на нажатие. Наведение, набор текста, смена значения в
     списках и фокус не озвучиваются: от них интерфейс трещал без остановки. */
  var CLICKABLE = 'a, button, .slot, .tab, .dot, .polaroid, [role="button"], summary';

  document.addEventListener('pointerdown', function (e) {
    var tagged = e.target.closest('[data-sfx]');
    if (tagged) { SFX.play(tagged.getAttribute('data-sfx')); return; }
    if (e.target.closest(CLICKABLE)) SFX.click();
  }, { passive: true });

  global.SFX = SFX;
})(window);
