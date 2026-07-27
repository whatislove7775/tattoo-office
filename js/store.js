/* =========================================================================
   STORE — состояние сайта.

   ВАЖНО: это демо-хранилище на localStorage. Оно нужно, чтобы весь сайт
   работал целиком сразу после деплоя, без бэкенда. Пароли здесь лежат
   в браузере в открытом виде — перед реальным запуском замените
   реализацию методов на вызовы API (см. README, раздел «Бэкенд»).
   ========================================================================= */
(function (global) {
  'use strict';

  var KEY = 'to.db.v1';

  var DEFAULTS = {
    users: [
      { login: 'master',   pass: 'master',   name: 'Зинаида Петровна', role: 'master',   masterId: 'zinaida', createdAt: 0 },
      { login: 'customer', pass: 'customer', name: 'Гость офиса',      role: 'customer', createdAt: 0 }
    ],
    bookings: [],
    appointments: [],
    feedback: [],
    session: null
  };

  var db = load();

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return clone(DEFAULTS);
      var parsed = JSON.parse(raw);
      /* дозаполняем недостающие коллекции, если формат подрос */
      Object.keys(DEFAULTS).forEach(function (k) {
        if (parsed[k] === undefined) parsed[k] = clone(DEFAULTS[k]);
      });
      return parsed;
    } catch (e) {
      return clone(DEFAULTS);
    }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(db)); }
    catch (e) { /* приватный режим — просто работаем в памяти */ }
  }

  function clone(v) { return JSON.parse(JSON.stringify(v)); }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  /* ------------------------------ даты ------------------------------------ */
  function todayISO(offsetDays) {
    var d = new Date();
    d.setHours(12, 0, 0, 0);
    if (offsetDays) d.setDate(d.getDate() + offsetDays);
    return d.toISOString().slice(0, 10);
  }

  function isPast(iso) { return iso < todayISO(); }

  function fmtDate(iso, lang) {
    var parts = String(iso).split('-');
    if (parts.length !== 3) return iso;
    if (lang === 'en') {
      var M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return parts[2] + ' ' + M[+parts[1] - 1] + ' ' + parts[0];
    }
    var m = ['января','февраля','марта','апреля','мая','июня',
             'июля','августа','сентября','октября','ноября','декабря'];
    return (+parts[2]) + ' ' + m[+parts[1] - 1] + ' ' + parts[0];
  }

  /* ---------------------------- пользователи ------------------------------ */
  function findUser(login) {
    for (var i = 0; i < db.users.length; i++) {
      if (db.users[i].login.toLowerCase() === String(login).toLowerCase()) return db.users[i];
    }
    return null;
  }

  var Store = {

    /* ------------------------------ сессия -------------------------------- */
    current: function () {
      if (!db.session) return null;
      var u = findUser(db.session);
      return u ? { login: u.login, name: u.name, role: u.role, masterId: u.masterId } : null;
    },

    register: function (data) {
      var login = String(data.login || '').trim();
      var pass  = String(data.pass || '');
      if (login.length < 3 || pass.length < 4) return { ok: false, error: 'auth.short' };
      if (findUser(login)) return { ok: false, error: 'auth.exists' };

      var user = {
        login: login,
        pass: pass,
        name: String(data.name || '').trim() || login,
        role: data.role === 'master' ? 'master' : 'customer',
        createdAt: Date.now()
      };
      /* Новый мастер получает собственную карточку-заглушку в каталоге:
         профиль наполняется из кабинета. */
      if (user.role === 'master') user.masterId = null;

      db.users.push(user);
      db.session = user.login;
      save();
      return { ok: true, user: this.current() };
    },

    login: function (data) {
      var u = findUser(data.login);
      if (!u || u.pass !== String(data.pass)) return { ok: false, error: 'auth.badPair' };
      db.session = u.login;
      save();
      return { ok: true, user: this.current() };
    },

    logout: function () { db.session = null; save(); },

    updateProfile: function (patch) {
      var u = findUser(db.session);
      if (!u) return { ok: false };
      if (patch.name != null) u.name = String(patch.name).trim() || u.name;
      if (patch.pass) u.pass = String(patch.pass);
      save();
      return { ok: true };
    },

    /* ---------------------------- бронирование ---------------------------- */
    /* Все брони одного дня и места: hour -> booking */
    slotMap: function (workspaceId, date) {
      var map = {};
      db.bookings.forEach(function (b) {
        if (b.workspace !== workspaceId || b.date !== date) return;
        b.hours.forEach(function (h) { map[h] = b; });
      });
      return map;
    },

    /* Проверка пересечений выполняется прямо перед записью — так двойная
       бронь невозможна даже если сетку не обновляли. */
    book: function (data) {
      var user = this.current();
      if (!user) return { ok: false, error: 'auth.badPair' };
      if (isPast(data.date)) return { ok: false, error: 'book.past' };
      if (!data.hours || !data.hours.length) return { ok: false, error: 'book.none' };

      var taken = this.slotMap(data.workspace, data.date);
      for (var i = 0; i < data.hours.length; i++) {
        if (taken[data.hours[i]]) return { ok: false, error: 'book.taken' };
      }

      var booking = {
        id: uid(),
        workspace: data.workspace,
        date: data.date,
        hours: data.hours.slice().sort(function (a, b) { return a - b; }),
        user: user.login,
        userName: user.name,
        createdAt: Date.now()
      };
      db.bookings.push(booking);
      save();
      return { ok: true, booking: booking };
    },

    cancelBooking: function (id) {
      var user = this.current();
      var before = db.bookings.length;
      db.bookings = db.bookings.filter(function (b) {
        return !(b.id === id && user && b.user === user.login);
      });
      save();
      return { ok: db.bookings.length < before };
    },

    myBookings: function () {
      var user = this.current();
      if (!user) return [];
      return db.bookings
        .filter(function (b) { return b.user === user.login; })
        .sort(function (a, b) { return a.date.localeCompare(b.date) || a.hours[0] - b.hours[0]; });
    },

    /* Все брони по местам — для обзорной таблицы в кабинете. */
    bookingsOn: function (date) {
      return db.bookings.filter(function (b) { return b.date === date; });
    },

    stats: function () {
      var mine = this.myBookings();
      var hours = 0, active = 0, today = todayISO();
      mine.forEach(function (b) {
        hours += b.hours.length;
        if (b.date >= today) active++;
      });
      return { visits: mine.length, hours: hours, active: active };
    },

    /* ------------------------- записи к мастерам -------------------------- */
    createAppointment: function (data) {
      var user = this.current();
      var appt = {
        id: uid(),
        masterId: data.masterId,
        date: data.date,
        time: data.time,
        idea: String(data.idea || '').trim(),
        contact: String(data.contact || '').trim(),
        customer: user ? user.login : null,
        customerName: user ? user.name : (data.name || '—'),
        status: 'new',
        createdAt: Date.now()
      };
      db.appointments.push(appt);
      save();
      return { ok: true, appointment: appt };
    },

    myAppointments: function () {
      var user = this.current();
      if (!user) return [];
      return db.appointments
        .filter(function (a) { return a.customer === user.login; })
        .sort(function (a, b) { return b.createdAt - a.createdAt; });
    },

    /* Заявки, пришедшие мастеру. Если у аккаунта нет привязки к карточке
       каталога, показываем всё, что адресовано его masterId. */
    incomingAppointments: function () {
      var user = this.current();
      if (!user || user.role !== 'master') return [];
      return db.appointments
        .filter(function (a) { return a.masterId === user.masterId; })
        .sort(function (a, b) { return b.createdAt - a.createdAt; });
    },

    setAppointmentStatus: function (id, status) {
      db.appointments.forEach(function (a) { if (a.id === id) a.status = status; });
      save();
    },

    /* ---------------------------- обратная связь -------------------------- */
    /* Анонимно: не сохраняем ни автора, ни точное время. */
    sendFeedback: function (data) {
      db.feedback.push({
        id: uid(),
        type: data.type,
        text: String(data.text || '').trim(),
        contact: String(data.contact || '').trim(),
        day: todayISO()
      });
      save();
      return { ok: true };
    },

    /* ----------------------------- служебное ------------------------------ */
    todayISO: todayISO,
    isPast: isPast,
    fmtDate: fmtDate,
    reset: function () { db = clone(DEFAULTS); save(); }
  };

  global.Store = Store;
})(window);
