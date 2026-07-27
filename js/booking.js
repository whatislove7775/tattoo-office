/* =========================================================================
   CABINET — личные кабинеты мастера и посетителя + сетка бронирования.
   ========================================================================= */
(function (global) {
  'use strict';

  var t = global.t;
  var esc = function (s) { return global.Pages.esc(s); };
  var pick = function (o) { return global.I18N.pick(o); };

  /* ------------------------- сетка бронирования --------------------------- */
  function bookingHtml() {
    var ws = global.DATA.workspaces.map(function (w) {
      return '<option value="' + esc(w.id) + '">' + esc(pick(w.name)) + ' · ' + w.price + ' ₽/ч</option>';
    }).join('');

    return '<div class="book-grid">' +
             '<div class="book-head">' +
               '<div class="field" style="flex:1 1 240px;margin:0">' +
                 '<label for="bkWs">' + esc(t('book.place')) + '</label>' +
                 '<select class="select" id="bkWs">' + ws + '</select>' +
               '</div>' +
               '<div class="field" style="flex:0 1 180px;margin:0">' +
                 '<label for="bkDate">' + esc(t('book.date')) + '</label>' +
                 '<input class="input" id="bkDate" type="date" min="' + global.Store.todayISO() +
                 '" value="' + global.Store.todayISO() + '">' +
               '</div>' +
               '<button class="btn btn--sm" id="bkFull" data-sfx="click">' + esc(t('book.fullday')) + '</button>' +
             '</div>' +

             '<p class="hint" style="margin:14px 0 0">' + esc(t('book.pickSlots')) + '</p>' +
             '<div class="slots" id="bkSlots"></div>' +

             '<div class="legend">' +
               '<span><i class="is-free"></i>' + esc(t('book.free')) + '</span>' +
               '<span><i class="is-mine"></i>' + esc(t('book.mine')) + '</span>' +
               '<span><i class="is-busy"></i>' + esc(t('book.busy')) + '</span>' +
             '</div>' +

             '<div class="error" id="bkErr"></div>' +
             '<div class="row" style="margin-top:10px;align-items:center">' +
               '<button class="btn btn--primary" id="bkGo" data-sfx="stamp">' + esc(t('book.confirm')) + '</button>' +
               '<span class="hint" id="bkCount"></span>' +
             '</div>' +
           '</div>';
  }

  function mountBooking(root, onChange) {
    var selected = {};
    var wsEl = root.querySelector('#bkWs');
    var dateEl = root.querySelector('#bkDate');
    var slotsEl = root.querySelector('#bkSlots');
    var countEl = root.querySelector('#bkCount');
    var errEl = root.querySelector('#bkErr');
    var me = global.Store.current();

    function count() {
      return Object.keys(selected).filter(function (k) { return selected[k]; }).length;
    }

    function refreshCount() {
      var n = count();
      countEl.textContent = n ? t('book.selected') + ' ' + n : '';
      root.querySelector('#bkGo').disabled = n === 0;
    }

    function render() {
      selected = {};
      errEl.textContent = '';
      var taken = global.Store.slotMap(wsEl.value, dateEl.value);

      slotsEl.innerHTML = global.DATA.hours.map(function (h) {
        var b = taken[h];
        var mine = b && me && b.user === me.login;
        var label = h + ':00';
        var by = b ? '<span class="slot__by">' + esc(mine ? t('book.mine') : b.userName) + '</span>' : '';
        return '<button class="slot" data-h="' + h + '"' +
               (b ? ' disabled' : '') +
               ' aria-pressed="false"' +
               (mine ? ' style="opacity:.85;background:var(--ink);color:var(--bg)"' : '') +
               '>' + label + by + '</button>';
      }).join('');

      refreshCount();
    }

    slotsEl.addEventListener('click', function (e) {
      var s = e.target.closest('.slot');
      if (!s || s.disabled) return;
      var h = s.dataset.h;
      selected[h] = !selected[h];
      s.setAttribute('aria-pressed', String(!!selected[h]));
      global.SFX.click();
      refreshCount();
    });

    root.querySelector('#bkFull').addEventListener('click', function () {
      var free = slotsEl.querySelectorAll('.slot:not([disabled])');
      var allOn = count() === free.length && free.length > 0;
      free.forEach(function (s) {
        selected[s.dataset.h] = !allOn;
        s.setAttribute('aria-pressed', String(!allOn));
      });
      refreshCount();
    });

    root.querySelector('#bkGo').addEventListener('click', function () {
      var hours = Object.keys(selected)
        .filter(function (k) { return selected[k]; })
        .map(Number);

      var res = global.Store.book({ workspace: wsEl.value, date: dateEl.value, hours: hours });
      if (!res.ok) {
        errEl.textContent = t(res.error);
        global.SFX.error();
        render();
        return;
      }
      global.SFX.stamp();
      global.TO.toast(t('book.done'));
      render();
      if (onChange) onChange();
    });

    wsEl.addEventListener('change', render);
    dateEl.addEventListener('change', render);
    render();

    return { refresh: render };
  }

  /* ----------------------------- мои брони -------------------------------- */
  function myBookingsHtml() {
    var lang = global.I18N.get();
    var rows = global.Store.myBookings();
    if (!rows.length) return '<p class="hint">' + esc(t('book.myEmpty')) + '</p>';

    return '<table class="table"><thead><tr>' +
             '<th>' + esc(t('book.date')) + '</th>' +
             '<th>' + esc(t('book.place')) + '</th>' +
             '<th>' + esc(t('cab.hours')) + '</th>' +
             '<th>' + esc(t('common.action')) + '</th>' +
           '</tr></thead><tbody>' +
      rows.map(function (b) {
        var ws = global.DATA.workspaces.filter(function (w) { return w.id === b.workspace; })[0];
        var span = b.hours[0] + ':00 — ' + (b.hours[b.hours.length - 1] + 1) + ':00';
        var past = global.Store.isPast(b.date);
        return '<tr' + (past ? ' style="opacity:.5"' : '') + '>' +
                 '<td>' + esc(global.Store.fmtDate(b.date, lang)) + '</td>' +
                 '<td>' + esc(ws ? pick(ws.name) : b.workspace) + '</td>' +
                 '<td>' + esc(span) + ' <span class="hint">(' + b.hours.length + ')</span></td>' +
                 '<td>' + (past ? '—' :
                   '<button class="btn btn--sm btn--ghost" data-cancel="' + esc(b.id) + '" data-sfx="click">' +
                   esc(t('book.cancel')) + '</button>') + '</td>' +
               '</tr>';
      }).join('') + '</tbody></table>';
  }

  /* --------------------------- заявки клиентов ---------------------------- */
  function statusStamp(status) {
    var cls = status === 'accepted' ? 'stamp--ok' : (status === 'declined' ? 'stamp--bad' : 'stamp--warn');
    return '<span class="stamp ' + cls + '" style="transform:none;font-size:10px">' +
           esc(t('appt.' + status)) + '</span>';
  }

  function requestsHtml() {
    var lang = global.I18N.get();
    var rows = global.Store.incomingAppointments();
    if (!rows.length) return '<p class="hint">' + esc(t('appt.reqEmpty')) + '</p>';

    return rows.map(function (a) {
      return '<div class="card">' +
               '<div class="card__meta">' + esc(global.Store.fmtDate(a.date, lang)) + ' · ' + esc(a.time) +
                 ' · ' + statusStamp(a.status) + '</div>' +
               '<div class="card__title" style="margin-top:6px">' + esc(a.customerName) + '</div>' +
               '<div class="prose" style="margin:4px 0">' + esc(a.idea) + '</div>' +
               '<div class="card__meta">' + esc(a.contact) + '</div>' +
               (a.status === 'new' ?
                 '<div class="row" style="margin-top:10px">' +
                   '<button class="btn btn--sm" data-accept="' + esc(a.id) + '" data-sfx="ok">' +
                     esc(t('appt.accept')) + '</button>' +
                   '<button class="btn btn--sm btn--ghost" data-decline="' + esc(a.id) + '" data-sfx="click">' +
                     esc(t('appt.decline')) + '</button>' +
                 '</div>' : '') +
             '</div>';
    }).join('');
  }

  /* ------------------------- записи посетителя ---------------------------- */
  function visitsHtml() {
    var lang = global.I18N.get();
    var rows = global.Store.myAppointments();
    if (!rows.length) {
      return '<p class="hint">' + esc(t('appt.empty')) + '</p>' +
             '<p style="margin-top:12px"><a class="btn btn--sm" href="#/masters" data-sfx="nav">' +
             esc(t('common.toMasters')) + '</a></p>';
    }

    return rows.map(function (a) {
      var m = global.DATA.masterById(a.masterId);
      return '<div class="card">' +
               '<div class="card__meta">' + esc(global.Store.fmtDate(a.date, lang)) + ' · ' + esc(a.time) +
                 ' · ' + statusStamp(a.status) + '</div>' +
               '<div class="card__title" style="margin-top:6px">' +
                 esc(m ? pick(m.name) : a.masterId) + '</div>' +
               '<div class="prose" style="margin-top:4px">' + esc(a.idea) + '</div>' +
             '</div>';
    }).join('');
  }

  /* -------------------------------- профиль ------------------------------- */
  /* Профиль по макету: круглый аватар, поля в столбик, «выйти» внизу. */
  function profileHtml(user) {
    var s = global.Store.stats();
    return '<div class="profile">' +
             '<div class="profile__side">' +
               global.Pages.img(avatarSrc(user), 'ava-' + user.login, user.name, 'profile__ava') +
             '</div>' +

             '<div class="profile__form">' +
               '<div class="field"><label for="pfName">' + esc(t('auth.fio')) + '</label>' +
                 '<input class="input input--plain" id="pfName" value="' + esc(user.name) + '"></div>' +
               '<div class="field"><label for="pfMail">' + esc(t('auth.mail')) + '</label>' +
                 '<input class="input input--plain" id="pfMail" value="' + esc(user.login) + '" disabled></div>' +
               '<div class="field"><label for="pfPass">' + esc(t('cab.changePass')) + '</label>' +
                 '<input class="input input--plain" id="pfPass" type="password" ' +
                 'placeholder="' + esc(t('auth.passPh')) + '"></div>' +

               '<div class="card" style="margin-top:22px;max-width:340px">' +
                 '<div class="card__title">' + esc(t('cab.stats')) + '</div>' +
                 '<table class="table" style="margin-top:8px"><tbody>' +
                   '<tr><td>' + esc(t('cab.visits')) + '</td><td>' + s.visits + '</td></tr>' +
                   '<tr><td>' + esc(t('cab.hours')) + '</td><td>' + s.hours + '</td></tr>' +
                   '<tr><td>' + esc(t('cab.active')) + '</td><td>' + s.active + '</td></tr>' +
                 '</tbody></table>' +
               '</div>' +
             '</div>' +

             '<div class="profile__actions">' +
               '<button class="btn btn--sm" id="pfSave" data-sfx="click">' + esc(t('common.save')) + '</button>' +
               '<button class="btn btn--big" id="pfOut" data-sfx="close">' + esc(t('cab.logout')) + '</button>' +
             '</div>' +
           '</div>';
  }

  /* Аватар: у мастера — портрет из каталога, у гостя — свой файл. */
  function avatarSrc(user) {
    var m = user.masterId && global.DATA.masterById(user.masterId);
    return m ? m.photo : 'assets/users/' + encodeURIComponent(user.login) + '.jpg';
  }

  /* ------------------------------- кабинет -------------------------------- */
  var Cabinet = {
    html: function () {
      var user = global.Store.current();
      if (!user) return '';   /* маршрутизатор перебросит на вход */

      var isMaster = user.role === 'master';
      var tabs = isMaster
        ? [['book', 'cab.tab.book'], ['my', 'cab.tab.my'], ['req', 'cab.tab.req'], ['profile', 'cab.tab.profile']]
        : [['visits', 'cab.tab.visits'], ['profile', 'cab.tab.profile']];

      var tabsHtml = tabs.map(function (pair, i) {
        return '<button class="tab" data-ctab="' + pair[0] + '" aria-selected="' + (i === 0) + '" data-sfx="click">' +
                 '<span class="pin"></span><span class="tab__label">' + esc(t(pair[1])) + '</span>' +
               '</button>';
      }).join('');

      return '<div class="section-head">' +
               '<span class="bullet"></span>' +
               '<h1>' + esc(t(isMaster ? 'cab.master' : 'cab.customer')) + '</h1>' +
               '<span class="spacer"></span>' +
               '<span class="hint">' + esc(t('cab.hello')) + ' ' + esc(user.name) + '</span>' +
             '</div>' +
             '<div class="tabs" style="margin-bottom:6px">' + tabsHtml + '</div>' +
             '<div id="cabPane" style="margin-top:18px"></div>';
    },

    mount: function (root) {
      var user = global.Store.current();
      if (!user) return;
      var pane = root.querySelector('#cabPane');

      function render(tab) {
        if (tab === 'book') {
          pane.innerHTML = '<h2>' + esc(t('book.title')) + '</h2>' + bookingHtml();
          mountBooking(pane);

        } else if (tab === 'my') {
          pane.innerHTML = myBookingsHtml();

        } else if (tab === 'req') {
          pane.innerHTML = requestsHtml();

        } else if (tab === 'visits') {
          pane.innerHTML = visitsHtml();

        } else {
          pane.innerHTML = profileHtml(user);
          pane.querySelector('#pfSave').addEventListener('click', function () {
            global.Store.updateProfile({
              name: pane.querySelector('#pfName').value,
              pass: pane.querySelector('#pfPass').value
            });
            global.SFX.ok();
            global.TO.toast(t('common.saved'));
            global.TO.refreshChrome();
          });
          pane.querySelector('#pfOut').addEventListener('click', function () {
            global.Store.logout();
            global.TO.refreshChrome();
            global.TO.go('#/masters');
          });
        }
      }

      /* отмена брони — с подтверждением в окне */
      pane.addEventListener('click', function (e) {
        var cancel = e.target.closest('[data-cancel]');
        if (cancel) {
          var id = cancel.dataset.cancel;
          global.TO.modal(t('book.confirmCancel'),
            '<div class="row">' +
              '<button class="btn btn--primary" id="mdYes" data-sfx="click">' + esc(t('book.yes')) + '</button>' +
              '<button class="btn btn--ghost" id="mdNo" data-sfx="close">' + esc(t('book.no')) + '</button>' +
            '</div>',
            function (win) {
              win.querySelector('#mdYes').addEventListener('click', function () {
                global.Store.cancelBooking(id);
                global.TO.closeModal();
                global.TO.toast(t('book.removed'));
                render('my');
              });
              win.querySelector('#mdNo').addEventListener('click', global.TO.closeModal);
            });
          return;
        }

        var acc = e.target.closest('[data-accept]');
        var dec = e.target.closest('[data-decline]');
        if (acc || dec) {
          global.Store.setAppointmentStatus((acc || dec).dataset[acc ? 'accept' : 'decline'],
                                            acc ? 'accepted' : 'declined');
          render('req');
        }
      });

      root.querySelectorAll('[data-ctab]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          root.querySelectorAll('[data-ctab]').forEach(function (b) {
            b.setAttribute('aria-selected', String(b === btn));
          });
          render(btn.dataset.ctab);
        });
      });

      render(user.role === 'master' ? 'book' : 'visits');
    }
  };

  global.Pages.cabinet = Cabinet;
  global.Pages.avatarSrc = avatarSrc;   /* нужен ещё и плашке вошедшего в правой колонке */
})(window);
