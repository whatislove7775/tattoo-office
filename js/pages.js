/* =========================================================================
   PAGES — разметка разделов.
   Каждая страница возвращает { html, mount } — mount вызывается после
   вставки в DOM и навешивает поведение.
   ========================================================================= */
(function (global) {
  'use strict';

  var t = global.t, pick = function (o) { return global.I18N.pick(o); };

  /* ------------------------------ хелперы --------------------------------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* Картинка с автоматической заглушкой, если файла ещё нет в assets. */
  function img(src, seed, label, cls, extra) {
    return '<img class="' + (cls || '') + '" src="' + esc(src) + '" alt="' + esc(label || '') + '"' +
           ' loading="lazy" data-seed="' + esc(seed) + '" data-label="' + esc(label || '') + '"' +
           ' onerror="TO.imgFail(this)"' + (extra || '') + '>';
  }

  function head(titleKey, extraHtml) {
    return '<div class="section-head">' +
             '<span class="bullet"></span>' +
             '<h1>' + esc(t(titleKey)) + '</h1>' +
             (extraHtml || '') +
           '</div>';
  }

  /* =========================== 1. КАТАЛОГ МАСТЕРОВ ======================== */
  var Masters = {
    html: function () {
      var cards = global.DATA.masters.map(function (m) {
        var name = pick(m.name);
        return '<button class="polaroid" data-id="' + esc(m.id) + '" data-sfx="click" ' +
               'aria-label="' + esc(name) + '">' +
                 img(m.photo, m.id, name, 'polaroid__img') +
                 '<div class="polaroid__cap">' + esc(name) + '.png</div>' +
               '</button>';
      }).join('');

      return head('masters.title',
                  '<span class="spacer"></span><span class="hint">' + esc(t('masters.hint')) + '</span>') +
             '<div class="drift" id="driftBox">' + cards + '</div>';
    },

    mount: function (root) {
      var box = root.querySelector('#driftBox');
      var narrow = global.matchMedia('(max-width: 900px)').matches;

      /* На узких экранах и в «бережном» режиме — обычная сетка. */
      if (narrow || global.Drift.reduced) {
        box.classList.add('drift--static');
      } else {
        var drift = new global.Drift(box);
        Array.prototype.forEach.call(box.querySelectorAll('.polaroid'), function (node) {
          drift.add(node);
        });
        /* ждём картинки: до загрузки высота карточек ещё «плавает» */
        requestAnimationFrame(function () {
          drift.layout();
          drift.start();
        });
        root.__cleanup = function () { drift.stop(); };
      }

      box.addEventListener('click', function (e) {
        var card = e.target.closest('.polaroid');
        if (card) global.TO.go('#/master/' + card.dataset.id);
      });
    }
  };

  /* ============================ 2. ПРОФИЛЬ МАСТЕРА ======================== */
  var Master = {
    html: function (params) {
      var m = global.DATA.masterById(params.id);
      if (!m) {
        return head('masters.title') + '<p class="prose">' + esc(t('master.notfound')) + '</p>' +
               '<p><a href="#/masters">' + esc(t('common.toMasters')) + '</a></p>';
      }

      var name = pick(m.name);
      var tabs =
        '<div class="tabs">' +
          '<button class="tab" data-tab="portfolio" aria-selected="true" data-sfx="click">' +
            '<span class="pin"></span><span class="tab__label">' + esc(t('master.portfolio')) + '</span>' +
          '</button>' +
          '<button class="tab" data-tab="drafts" aria-selected="false" data-sfx="click">' +
            '<span class="pin"></span><span class="tab__label">' + esc(t('master.drafts')) + '</span>' +
          '</button>' +
        '</div>';

      return '<div class="section-head">' +
               '<span class="crumbs"><a href="#/masters">' + esc(t('masters.title')) + '</a> / ' + esc(name) + '</span>' +
               tabs +
               '<span class="spacer"></span>' +
               '<a href="#/masters" data-sfx="nav">←' + esc(t('master.back')) + '</a>' +
             '</div>' +

             '<div class="master">' +
               '<div>' +
                 img(m.photo, m.id, name, 'master__photo') +
                 '<div class="master__name">' + esc(name) + '</div>' +
                 '<div class="master__meta">' +
                   '<span>' + m.age + ' ' + esc(t('master.age')) + '</span>' +
                   '<span>' + esc(t('master.exp')) + ' ' + esc(pick(m.exp)) + '</span>' +
                 '</div>' +
                 '<div class="master__bio">' + esc(pick(m.bio)) + '</div>' +
                 '<p style="margin-top:26px"><a class="btn" href="#/book/' + esc(m.id) + '" data-sfx="open">' +
                   esc(t('master.book')) + '</a></p>' +
               '</div>' +
               '<div id="worksPane"></div>' +
             '</div>';
    },

    mount: function (root, params) {
      var m = global.DATA.masterById(params.id);
      if (!m) return;
      var pane = root.querySelector('#worksPane');

      function render(tab) {
        var list = tab === 'drafts' ? m.drafts : m.portfolio;
        if (!list.length) {
          pane.innerHTML = '<p class="hint">' + esc(t('master.empty')) + '</p>';
          return;
        }
        pane.innerHTML = '<div class="works">' + list.map(function (w, i) {
          var cap = pick(w.cap);
          return '<figure class="work" data-src="' + esc(w.src) + '" data-cap="' + esc(cap) + '" ' +
                 'data-seed="' + esc(m.id + i) + '" data-sfx="open">' +
                   img(w.src, m.id + '-' + tab + i, cap, 'work__img') +
                   '<figcaption class="work__cap">' + esc(cap) + '</figcaption>' +
                 '</figure>';
        }).join('') + '</div>';
      }

      render('portfolio');

      root.querySelectorAll('.tab').forEach(function (btn) {
        btn.addEventListener('click', function () {
          root.querySelectorAll('.tab').forEach(function (b) {
            b.setAttribute('aria-selected', String(b === btn));
          });
          render(btn.dataset.tab);
        });
      });

      /* просмотр работы в окне */
      pane.addEventListener('click', function (e) {
        var fig = e.target.closest('.work');
        if (!fig) return;
        var im = fig.querySelector('img');
        global.TO.modal(fig.dataset.cap, '<img src="' + esc(im.currentSrc || im.src) + '" alt="">');
      });
    }
  };

  /* =============================== 3. ИНТЕРЬЕР =========================== */
  var Interior = {
    html: function () {
      var d = global.DATA.interior;
      var thumbs = d.photos.map(function (p, i) {
        return img(p.src, 'int' + i, pick(p.cap), '', ' data-i="' + i + '" data-sfx="click"');
      }).join('');
      var dots = d.photos.map(function (_, i) {
        return '<span class="dot" data-i="' + i + '"' + (i === 0 ? ' aria-current="true"' : '') + '></span>';
      }).join('');

      return head('interior.title') +
             '<div class="interior">' +
               '<div>' +
                 '<div class="interior__stagebox" id="intStage">' +
                   img(d.scan, 'scan', t('interior.scan'), '') +
                 '</div>' +
                 '<div class="dots" id="intDots">' + dots + '</div>' +
               '</div>' +
               '<div>' +
                 '<p class="prose" style="font-size:17px">' + esc(t('interior.lead')) + '</p>' +
                 '<p class="prose">' + esc(t('interior.body')) + '</p>' +
                 '<div class="thumbs" id="intThumbs">' + thumbs + '</div>' +
               '</div>' +
             '</div>';
    },

    mount: function (root) {
      var d = global.DATA.interior;
      var stage = root.querySelector('#intStage');
      var dots = root.querySelector('#intDots');

      function show(i) {
        var p = d.photos[i];
        stage.innerHTML = img(p.src, 'int' + i, pick(p.cap), '');
        dots.querySelectorAll('.dot').forEach(function (el) {
          el.setAttribute('aria-current', String(+el.dataset.i === i));
        });
      }

      root.querySelector('#intThumbs').addEventListener('click', function (e) {
        if (e.target.tagName === 'IMG') show(+e.target.dataset.i);
      });
      dots.addEventListener('click', function (e) {
        if (e.target.classList.contains('dot')) show(+e.target.dataset.i);
      });
    }
  };

  /* ============================== 4. КАК НАЙТИ =========================== */
  var Find = {
    html: function () {
      var c = global.DATA.contacts;
      var steps = t('find.routeSteps').map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');

      /* Схематическая карта нарисована вручную: не тянет внешние скрипты
         и не требует ключа API. Ссылка ведёт в настоящие карты. */
      var map =
        '<svg class="map" viewBox="0 0 640 360" role="img" aria-label="' + esc(t('find.title')) + '">' +
          '<rect width="640" height="360" fill="var(--panel-2)"/>' +
          '<g stroke="var(--line)" stroke-width="1">' +
            '<path d="M0 90h640M0 250h640M170 0v360M430 0v360"/>' +
          '</g>' +
          '<g fill="var(--ink-3)" opacity=".22">' +
            '<rect x="30" y="120" width="110" height="100" rx="4"/>' +
            '<rect x="200" y="120" width="90" height="100" rx="4"/>' +
            '<rect x="320" y="120" width="80" height="100" rx="4"/>' +
            '<rect x="460" y="120" width="140" height="100" rx="4"/>' +
            '<rect x="200" y="20" width="200" height="50" rx="4"/>' +
          '</g>' +
          '<path d="M60 300 L60 250 L240 250 L240 220" fill="none" stroke="var(--ink)" ' +
            'stroke-width="3" stroke-dasharray="7 6"/>' +
          '<circle cx="60" cy="300" r="7" fill="var(--ink)"/>' +
          '<text x="76" y="305" font-size="14" fill="var(--ink-2)">M</text>' +
          '<g transform="translate(240 208)">' +
            '<path d="M0 12c-9-12-14-19-14-26a14 14 0 0 1 28 0c0 7-5 14-14 26z" fill="var(--ink)"/>' +
            '<circle cx="0" cy="-14" r="5" fill="var(--panel)"/>' +
          '</g>' +
          '<text x="258" y="196" font-size="14" font-weight="700" fill="var(--ink)">Tattoo Office</text>' +
        '</svg>';

      return head('find.title') +
             '<div class="grid-2">' +
               '<div>' + map +
                 '<p style="margin-top:14px"><a class="btn btn--sm" href="' + esc(c.mapUrl) + '" ' +
                   'target="_blank" rel="noopener" data-sfx="click">' + esc(t('find.openMap')) + '</a></p>' +
               '</div>' +
               '<div class="prose">' +
                 '<h2>' + esc(t('find.address')) + '</h2><p>' + esc(t('find.addressValue')) + '</p>' +
                 '<h2>' + esc(t('find.hours')) + '</h2><p>' + esc(t('find.hoursValue')) + '</p>' +
                 '<h2>' + esc(t('find.route')) + '</h2><ol>' + steps + '</ol>' +
                 '<h2>' + esc(t('find.contact')) + '</h2>' +
                 '<p>' + esc(c.tg) + '<br>' + esc(c.mail) + '<br>' + esc(c.phone) + '</p>' +
               '</div>' +
             '</div>';
    }
  };

  /* ============================ 5. БЕЗОПАСНОСТЬ ========================== */
  var Safety = {
    html: function () {
      var blocks = t('safety.blocks').map(function (b) {
        return '<div class="card">' +
                 '<div class="card__title">' + esc(b.h) + '</div>' +
                 '<ul class="prose" style="margin:8px 0 0;padding-left:18px">' +
                   b.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') +
                 '</ul>' +
               '</div>';
      }).join('');

      return head('safety.title') +
             '<p class="prose" style="font-size:17px">' + esc(t('safety.lead')) + '</p>' +
             '<p style="margin:18px 0 22px"><span class="stamp stamp--ok">sterile · проверено</span></p>' +
             '<div class="grid-2">' + blocks + '</div>';
    }
  };

  /* =============================== 6. АРХИВ ============================== */
  var Archive = {
    html: function () {
      var kinds = Object.keys(global.DATA.archiveKinds);
      var chips = ['<button class="btn btn--sm" data-kind="" aria-pressed="true" data-sfx="click">' +
                    esc(t('archive.all')) + '</button>']
        .concat(kinds.map(function (k) {
          return '<button class="btn btn--sm" data-kind="' + k + '" aria-pressed="false" data-sfx="click">' +
                 esc(pick(global.DATA.archiveKinds[k])) + '</button>';
        })).join('');

      return head('archive.title') +
             '<p class="prose">' + esc(t('archive.lead')) + '</p>' +
             '<div class="row" style="margin:16px 0 20px">' + chips + '</div>' +
             '<div id="archList"></div>';
    },

    mount: function (root) {
      var list = root.querySelector('#archList');
      var lang = global.I18N.get();

      function render(kind) {
        var rows = global.DATA.archive.filter(function (e) { return !kind || e.kind === kind; });
        if (!rows.length) { list.innerHTML = '<p class="hint">' + esc(t('archive.empty')) + '</p>'; return; }

        list.innerHTML = rows.map(function (e) {
          return '<div class="card">' +
                   '<div class="card__meta">' + esc(global.Store.fmtDate(e.date, lang)) + ' · ' +
                     esc(pick(global.DATA.archiveKinds[e.kind])) + '</div>' +
                   '<div class="card__title" style="margin-top:4px">' + esc(pick(e.title)) + '</div>' +
                   '<div class="prose" style="margin-top:4px">' + esc(pick(e.text)) + '</div>' +
                 '</div>';
        }).join('');
      }

      render('');
      root.querySelectorAll('[data-kind]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          root.querySelectorAll('[data-kind]').forEach(function (b) {
            b.setAttribute('aria-pressed', String(b === btn));
          });
          render(btn.dataset.kind);
        });
      });
    }
  };

  /* =========================== 7. ОБРАТНАЯ СВЯЗЬ ========================= */
  var Feedback = {
    html: function () {
      var types = ['complaint', 'idea', 'review'].map(function (k, i) {
        return '<button class="btn btn--sm" data-type="' + k + '" aria-pressed="' + (i === 0) + '" ' +
               'data-sfx="click">' + esc(t('feedback.type.' + k)) + '</button>';
      }).join('');

      return head('feedback.title') +
             '<p class="prose">' + esc(t('feedback.lead')) + '</p>' +
             '<div style="max-width:520px;margin-top:20px">' +
               '<div class="field"><label>' + esc(t('feedback.type')) + '</label>' +
                 '<div class="row" id="fbTypes">' + types + '</div></div>' +
               '<div class="field"><label for="fbText">' + esc(t('feedback.text')) + '</label>' +
                 '<textarea class="textarea" id="fbText" placeholder="' + esc(t('feedback.textPh')) + '"></textarea></div>' +
               '<div class="field"><label for="fbContact">' + esc(t('feedback.contact')) + '</label>' +
                 '<input class="input" id="fbContact" placeholder="' + esc(t('feedback.contactPh')) + '"></div>' +
               '<p class="hint">' + esc(t('feedback.anon')) + '</p>' +
               '<div class="error" id="fbErr"></div>' +
               '<button class="btn btn--primary" id="fbSend" data-sfx="stamp">' + esc(t('feedback.send')) + '</button>' +
             '</div>';
    },

    mount: function (root) {
      var type = 'complaint';
      root.querySelector('#fbTypes').addEventListener('click', function (e) {
        var b = e.target.closest('[data-type]');
        if (!b) return;
        type = b.dataset.type;
        root.querySelectorAll('[data-type]').forEach(function (x) {
          x.setAttribute('aria-pressed', String(x === b));
        });
      });

      root.querySelector('#fbSend').addEventListener('click', function () {
        var text = root.querySelector('#fbText').value.trim();
        var err = root.querySelector('#fbErr');
        if (!text) {
          err.textContent = t('feedback.needText');
          global.SFX.error();
          return;
        }
        err.textContent = '';
        global.Store.sendFeedback({ type: type, text: text, contact: root.querySelector('#fbContact').value });
        global.SFX.ok();
        global.TO.toast(t('feedback.sent'));
        root.querySelector('#fbText').value = '';
        root.querySelector('#fbContact').value = '';
      });
    }
  };

  /* ============================= 8. АВТОРИЗАЦИЯ ========================== */
  var Auth = {
    html: function (params) {
      var mode = params.mode === 'signup' ? 'signup' : 'login';
      var role = params.role === 'master' ? 'master' : 'customer';
      var isReg = mode === 'signup';

      /* поле с подсказкой справа — как в макете */
      function field(id, label, ph, hint, type) {
        return '<div class="auth__row">' +
                 '<div class="auth__field">' +
                   '<label for="' + id + '">' + esc(label) + '</label>' +
                   '<input class="input input--pill" id="' + id + '" placeholder="' + esc(ph) + '"' +
                     (type ? ' type="' + type + '"' : '') + '>' +
                 '</div>' +
                 (hint ? '<span class="auth__hint">' + esc(hint) + '</span>' : '') +
               '</div>';
      }

      /* картинка-настроение: свой файл кладётся в assets/auth/ */
      var meme = isReg ? '' :
        '<div class="auth__meme">' +
          img('assets/auth/' + role + '.jpg', 'meme-' + role, '', 'auth__memeImg') +
          '<span class="auth__memeCap">' + esc(t('auth.meme' + (role === 'master' ? 'Master' : 'Customer'))) + '</span>' +
        '</div>';

      return '<div class="section-head"><span class="bullet"></span>' +
               '<h1>' + esc(t('auth.' + (isReg ? 'regTitle.' : 'loginTitle.') + role)) + '</h1></div>' +

             '<div class="auth">' + meme +

               (isReg ? field('auName', t('auth.fio'), t('auth.fioPh'), t('auth.fioHint')) : '') +
               field('auLogin', t('auth.mail'), t('auth.mailPh'), '', 'email') +
               field('auPass', t(isReg ? 'auth.passNew' : 'auth.pass'), t('auth.passPh'),
                     isReg ? t('auth.passHint') : '', 'password') +

               '<p class="auth__switch"><a href="#/' + (isReg ? 'login' : 'signup') + '/' + role + '" ' +
                 'data-sfx="nav">' + esc(t(isReg ? 'auth.toLogin' : 'auth.toReg')) + '</a></p>' +

               '<div class="error" id="auErr"></div>' +

               '<div class="auth__go">' +
                 '<button class="btn btn--big" id="auGo" data-sfx="click">' +
                   esc(t(isReg ? 'auth.register' : 'auth.enter')) + '</button>' +
               '</div>' +

               (isReg ? '' :
                 '<p class="auth__demo"><button class="btn btn--sm btn--ghost" id="auDemo" data-sfx="click">' +
                 esc(t('auth.tryDemo')) + '</button></p>') +

               '<p class="hint auth__note">' + esc(t('auth.demo')) + '</p>' +
             '</div>';
    },

    mount: function (root, params) {
      var mode = params.mode === 'signup' ? 'signup' : 'login';
      var role = params.role === 'master' ? 'master' : 'customer';
      var err = root.querySelector('#auErr');

      function submit() {
        var mail = root.querySelector('#auLogin').value.trim();
        var payload = {
          login: mail,
          pass: root.querySelector('#auPass').value,
          role: role
        };
        var nameEl = root.querySelector('#auName');
        if (nameEl) payload.name = nameEl.value;

        /* при регистрации почта должна быть похожа на почту */
        if (mode === 'signup' && !/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(mail)) {
          err.textContent = t('auth.badMail');
          global.SFX.error();
          return;
        }

        var res = mode === 'signup' ? global.Store.register(payload) : global.Store.login(payload);
        if (!res.ok) {
          err.textContent = t(res.error);
          global.SFX.error();
          return;
        }
        global.SFX.login();
        global.TO.refreshChrome();
        global.TO.go('#/cabinet');
      }

      root.querySelector('#auGo').addEventListener('click', submit);
      root.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') submit();
      });

      var demo = root.querySelector('#auDemo');
      if (demo) demo.addEventListener('click', function () {
        var acc = role === 'master' ? 'master@tattoo.office' : 'customer@tattoo.office';
        root.querySelector('#auLogin').value = acc;
        root.querySelector('#auPass').value = role === 'master' ? 'master' : 'customer';
        submit();
      });
    }
  };

  /* ========================== 9. ЗАПИСЬ К МАСТЕРУ ========================= */
  var BookMaster = {
    html: function (params) {
      var m = global.DATA.masterById(params.id);
      if (!m) return '<p class="prose">' + esc(t('master.notfound')) + '</p>';

      var hours = global.DATA.hours.map(function (h) {
        return '<option value="' + h + ':00">' + h + ':00</option>';
      }).join('');

      return '<div class="section-head"><span class="bullet"></span>' +
               '<h1>' + esc(t('appt.title')) + '</h1><span class="spacer"></span>' +
               '<a href="#/master/' + esc(m.id) + '" data-sfx="nav">←' + esc(t('common.back')) + '</a></div>' +

             '<div style="max-width:460px">' +
               '<div class="field"><label>' + esc(t('appt.master')) + '</label>' +
                 '<input class="input" value="' + esc(pick(m.name)) + '" disabled></div>' +
               '<div class="row">' +
                 '<div class="field" style="flex:1 1 180px"><label for="apDate">' + esc(t('appt.date')) + '</label>' +
                   '<input class="input" id="apDate" type="date" min="' + global.Store.todayISO() +
                   '" value="' + global.Store.todayISO(1) + '"></div>' +
                 '<div class="field" style="flex:0 1 140px"><label for="apTime">' + esc(t('appt.time')) + '</label>' +
                   '<select class="select" id="apTime">' + hours + '</select></div>' +
               '</div>' +
               '<div class="field"><label for="apIdea">' + esc(t('appt.idea')) + '</label>' +
                 '<textarea class="textarea" id="apIdea" placeholder="' + esc(t('appt.ideaPh')) + '"></textarea></div>' +
               '<div class="field"><label for="apContact">' + esc(t('appt.contact')) + '</label>' +
                 '<input class="input" id="apContact" placeholder="' + esc(t('appt.contactPh')) + '"></div>' +
               '<div class="error" id="apErr"></div>' +
               '<button class="btn btn--primary" id="apSend" data-sfx="stamp">' + esc(t('appt.send')) + '</button>' +
             '</div>';
    },

    mount: function (root, params) {
      var send = root.querySelector('#apSend');
      if (!send) return;

      send.addEventListener('click', function () {
        var idea = root.querySelector('#apIdea').value.trim();
        var contact = root.querySelector('#apContact').value.trim();
        var err = root.querySelector('#apErr');

        if (!idea || !contact) {
          err.textContent = t('appt.need');
          global.SFX.error();
          return;
        }
        err.textContent = '';
        global.Store.createAppointment({
          masterId: params.id,
          date: root.querySelector('#apDate').value,
          time: root.querySelector('#apTime').value,
          idea: idea,
          contact: contact
        });
        global.SFX.ok();
        global.TO.toast(t('appt.sent'));
        global.TO.go(global.Store.current() ? '#/cabinet' : '#/master/' + params.id);
      });
    }
  };

  /* ============================ 10. ДОКУМЕНТЫ ============================ */
  var DOCS = {
    privacy: {
      ru: {
        h: 'Политика конфиденциальности',
        p: ['Мы собираем минимум: имя, контакт и историю записей — только чтобы вы попали к мастеру, ' +
            'а мастер попал на рабочее место.',
            'Данные не передаются третьим лицам и не используются для рекламы вне Tattoo Office.',
            'Форма обратной связи анонимна: автор, IP и точное время не сохраняются.',
            'Удалить свои данные можно по запросу на почту из раздела «How to find».']
      },
      en: {
        h: 'Privacy policy',
        p: ['We collect the minimum: name, contact and booking history — only so that you reach your master ' +
            'and the master reaches a workstation.',
            'Data is not shared with third parties and is not used for advertising outside Tattoo Office.',
            'The feedback form is anonymous: no author, no IP, no exact timestamp is stored.',
            'You can request deletion of your data by writing to the address in “How to find”.']
      }
    },
    offer: {
      ru: {
        h: 'Оферта',
        p: ['Бронирование рабочего места в Tattoo Office означает согласие с правилами резиденции.',
            'Место закрепляется за мастером на выбранные часы. Отмена — не позднее чем за 12 часов.',
            'Мастер отвечает за стерильность своего рабочего места и за собственные расходники.',
            'Офис вправе отказать в аренде без объяснения причин.']
      },
      en: {
        h: 'Terms',
        p: ['Booking a workstation at Tattoo Office means accepting the residence rules.',
            'The station is reserved for the chosen hours. Cancellation no later than 12 hours before.',
            'The master is responsible for the sterility of their station and for their own supplies.',
            'The office may refuse a rental without explanation.']
      }
    },
    info: {
      ru: {
        h: 'Инфо',
        p: ['Tattoo Office — тату-студия и коворкинг для мастеров.',
            'Резидентам: почасовая и дневная аренда, хранение оборудования, стерилизационная, ' +
            'кухня, переговорная для консультаций.',
            'Гостям: запись к любому резиденту через каталог мастеров.',
            'Вход в клуб — по рекомендации резидента.']
      },
      en: {
        h: 'Info',
        p: ['Tattoo Office is a tattoo studio and a coworking space for masters.',
            'For residents: hourly and daily rental, equipment storage, sterilisation room, ' +
            'kitchen, meeting room for consultations.',
            'For guests: booking with any resident through the masters catalogue.',
            'Club membership is by referral from a resident.']
      }
    },
    data: {
      ru: {
        h: 'Данные и всё остальное',
        p: ['Сайт хранит вашу сессию и брони в вашем же браузере в демо-режиме.',
            'Аналитика не подключена. Внешних скриптов и трекеров нет.',
            'Cookies не используются: настройки языка, темы и звука лежат в localStorage.',
            'Шрифты и иконки — локальные, без обращений к сторонним CDN.']
      },
      en: {
        h: 'Data and everything else',
        p: ['In demo mode the site keeps your session and bookings inside your own browser.',
            'No analytics is connected. No external scripts or trackers.',
            'No cookies: language, theme and sound settings live in localStorage.',
            'Fonts and icons are local, with no calls to third-party CDNs.']
      }
    },
    about: {
      ru: {
        h: 'Tattoo Office',
        p: ['Пространство, созданное Mr.A для Mr.A и его друзей.',
            'Четыре кабинета, восемь резидентов, один автоклав класса B и очень строгий вахтёр.',
            'The Tattoo Office Private Club, 2026 ©']
      },
      en: {
        h: 'Tattoo Office',
        p: ['A space made by Mr.A for Mr.A and his friends.',
            'Four rooms, eight residents, one class B autoclave and a very strict doorman.',
            'The Tattoo Office Private Club, 2026 ©']
      }
    }
  };

  var Doc = {
    html: function (params) {
      var doc = DOCS[params.doc];
      if (!doc) return '<p class="prose">' + esc(t('common.notfound')) + '</p>';
      var d = doc[global.I18N.get()] || doc.ru;
      return '<div class="section-head"><span class="bullet"></span><h1>' + esc(d.h) + '</h1></div>' +
             '<div class="prose">' + d.p.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>';
    }
  };

  var NotFound = {
    html: function () {
      return '<div class="section-head"><span class="bullet"></span><h1>404</h1></div>' +
             '<p class="prose">' + esc(t('common.notfound')) + '</p>' +
             '<p><a class="btn btn--sm" href="#/masters" data-sfx="nav">' + esc(t('common.toMasters')) + '</a></p>';
    }
  };

  global.Pages = {
    esc: esc,
    img: img,
    head: head,
    masters: Masters,
    master: Master,
    interior: Interior,
    find: Find,
    safety: Safety,
    archive: Archive,
    feedback: Feedback,
    auth: Auth,
    bookMaster: BookMaster,
    doc: Doc,
    notFound: NotFound
  };
})(window);
