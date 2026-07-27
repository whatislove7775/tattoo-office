/* =========================================================================
   i18n — весь текст интерфейса в двух языках.
   Правьте тексты прямо здесь: структура страниц их не содержит.
   ========================================================================= */
(function (global) {
  'use strict';

  var DICT = {

    /* =============================== РУССКИЙ ============================== */
    ru: {
      'menu.title': 'Menu:',
      'nav.masters': 'Masters',
      'nav.interior': 'Interior',
      'nav.find': 'How to find',
      'nav.safety': 'Safety',
      'nav.archive': 'Event Archive',
      'nav.feedback': 'Feedback',

      'marquee': 'мы бьём тату женщинам и детям только с разрешения их великолепных родителей · ' +
                 'резиденция открыта 24/7 для своих · стерильность как религия · ' +
                 'Tattoo Office — пространство, созданное Mr.A для Mr.A и его друзей · ' +
                 'аренда рабочего места по часам и на день · записывайтесь заранее',

      'theme.on': 'on',
      'theme.off': 'off',
      'theme.title': 'светлая / тёмная тема',
      'sound.on': 'звук вкл',
      'sound.off': 'звук выкл',

      'login.title': 'Log in:',
      'login.customer': 'as customer',
      'login.master': 'as tattoo master',
      'login.logged': 'Вы вошли:',
      'login.cabinet': 'личный кабинет',
      'login.out': 'выйти',
      'login.role.master': 'мастер',
      'login.role.customer': 'посетитель',

      'foot.privacy': 'политики конфиденциальности',
      'foot.offer': 'оферта',
      'foot.info': 'инфо',
      'foot.data': 'данные и всё остальное',

      /* --- мастера --- */
      'masters.title': 'Masters',
      'masters.hint': 'нажмите на карточку, чтобы открыть профиль мастера',
      'master.portfolio': 'portfolio',
      'master.drafts': 'drafts',
      'master.back': 'back',
      'master.book': 'записаться к мастеру',
      'master.age': 'год',
      'master.exp': 'стаж',
      'master.empty': 'здесь пока пусто',
      'master.notfound': 'мастер не найден',

      /* --- интерьер --- */
      'interior.title': 'Interior',
      'interior.lead': 'Tattoo Office — пространство, созданное Mr.A для Mr.A и его друзей.',
      'interior.body': 'Четыре рабочих кабинета, общая зона, стерилизационная и переговорная в ' +
                       'квартире с историей. Высокие потолки, паркет, свет с двух сторон. ' +
                       'Каждое место оборудовано под полный цикл работы: от эскиза до заживления.',
      'interior.scan': '3D-скан пространства',
      'interior.photos': 'фотографии',

      /* --- как найти --- */
      'find.title': 'How to find',
      'find.address': 'Адрес',
      'find.addressValue': 'Санкт-Петербург, ул. Примерная, 1, кв. 7 — 2 этаж, звонок в домофон 7',
      'find.hours': 'Часы работы',
      'find.hoursValue': 'ежедневно 11:00 — 23:00, по записи',
      'find.route': 'Как дойти',
      'find.routeSteps': [
        'от метро — 7 минут пешком в сторону канала',
        'войти во двор через арку с чёрными воротами',
        'вторая парадная слева, код домофона выдаётся перед сеансом',
        'второй этаж, дверь без вывески — вы на месте'
      ],
      'find.contact': 'Связь',
      'find.openMap': 'открыть в картах',

      /* --- безопасность --- */
      'safety.title': 'Safety',
      'safety.lead': 'Стерильность — единственное правило, которое здесь не обсуждается.',
      'safety.blocks': [
        {
          h: 'Стерилизация',
          items: [
            'одноразовые иглы и картриджи, вскрываются при клиенте',
            'автоклав класса B, контроль каждой загрузки индикатором',
            'многоразовый инструмент проходит полный цикл: дезинфекция → ПСО → автоклав',
            'журнал стерилизации хранится и доступен по запросу'
          ]
        },
        {
          h: 'Рабочее место',
          items: [
            'барьерная защита на машинке, клип-корде, лампе и кресле',
            'кушетка обрабатывается между сеансами',
            'перчатки меняются при каждом прерывании работы',
            'краски наливаются в одноразовые ёмкости и не возвращаются в тару'
          ]
        },
        {
          h: 'Противопоказания',
          items: [
            'мы не работаем с несовершеннолетними без родителей и документов',
            'не работаем в состоянии алкогольного или наркотического опьянения',
            'беременность, обострение хронических заболеваний, диабет, эпилепсия — обсуждается до сеанса',
            'об аллергиях и приёме лекарств нужно сообщить заранее'
          ]
        },
        {
          h: 'Заживление',
          items: [
            'мастер выдаёт памятку и остаётся на связи весь период заживления',
            'бесплатная коррекция в течение 2 месяцев при соблюдении рекомендаций',
            'при любых сомнениях — пишите мастеру, не ждите'
          ]
        }
      ],

      /* --- архив --- */
      'archive.title': 'Event Archive',
      'archive.lead': 'Гостевые сессии, поп-апы, флэши и всё, что происходило в офисе.',
      'archive.all': 'все',
      'archive.empty': 'по этому фильтру ничего нет',

      /* --- обратная связь --- */
      'feedback.title': 'Feedback',
      'feedback.lead': 'Анонимная форма. Жалобы, предложения, отзывы — всё попадает напрямую к Mr.A.',
      'feedback.type': 'Тип обращения',
      'feedback.type.complaint': 'жалоба',
      'feedback.type.idea': 'предложение',
      'feedback.type.review': 'отзыв',
      'feedback.text': 'Сообщение',
      'feedback.textPh': 'пишите как есть, без вежливости',
      'feedback.contact': 'Контакт для ответа (не обязательно)',
      'feedback.contactPh': 'telegram / почта — если хотите ответ',
      'feedback.anon': 'Отправляется анонимно: имя, IP и время не сохраняются.',
      'feedback.send': 'отправить',
      'feedback.sent': 'Спасибо. Обращение отправлено.',
      'feedback.needText': 'Напишите сообщение.',

      /* --- авторизация --- */
      'auth.loginTitle.master': 'Log in as tattoo master',
      'auth.loginTitle.customer': 'Log in as customer',
      'auth.regTitle.master': 'Sign in as tattoo master',
      'auth.regTitle.customer': 'Sign in as customer',
      'auth.asMaster': 'мастер',
      'auth.asCustomer': 'посетитель',
      'auth.fio': 'ФИО',
      'auth.fioPh': 'Артур Артурович',
      'auth.fioHint': 'отчество — если есть',
      'auth.mail': 'Почта',
      'auth.mailPh': 'devstvennik@mail.ru',
      'auth.pass': 'Введите пароль',
      'auth.passNew': 'Придумайте пароль',
      'auth.passPh': 'пароль-пароль***',
      'auth.passHint': 'от 4 до 32 символов',
      'auth.enter': 'войти',
      'auth.register': 'зарегаться',
      'auth.toReg': 'no account — sign up',
      'auth.toLogin': 'уже есть аккаунт — войти',
      'auth.badPair': 'Неверная почта или пароль.',
      'auth.exists': 'Такая почта уже зарегистрирована.',
      'auth.short': 'Введите почту и пароль от 4 символов.',
      'auth.badMail': 'Почта выглядит неправильно.',
      'auth.memeMaster': 'кажется я обрёл дом…\nда что там дом — семью',
      'auth.memeCustomer': 'эх грустно как то…\nпойду забьюсь',
      'auth.demo': 'Демо-режим: аккаунты и брони хранятся в этом браузере (localStorage). ' +
                   'Перед запуском подключите настоящий бэкенд — см. README.',
      'auth.tryDemo': 'войти в демо-аккаунт',

      /* --- кабинет --- */
      'cab.master': 'Кабинет мастера',
      'cab.customer': 'Кабинет посетителя',
      'cab.tab.book': 'бронирование',
      'cab.tab.my': 'мои брони',
      'cab.tab.req': 'заявки',
      'cab.tab.profile': 'My profile',
      'cab.changePass': 'Поменять пароль',
      'cab.logout': 'выйти',
      'cab.escape': 'escape →',
      'cab.tab.visits': 'мои записи',
      'cab.hello': 'Здравствуйте,',
      'cab.stats': 'Статистика',
      'cab.visits': 'посещений',
      'cab.hours': 'часов забронировано',
      'cab.active': 'активных броней',

      /* --- бронирование --- */
      'book.title': 'Бронирование рабочего места',
      'book.place': 'Рабочее место',
      'book.date': 'Дата',
      'book.fullday': 'весь день',
      'book.pickSlots': 'Выберите часы',
      'book.selected': 'Выбрано часов:',
      'book.confirm': 'забронировать',
      'book.cancel': 'отменить',
      'book.free': 'свободно',
      'book.mine': 'моя бронь',
      'book.busy': 'занято',
      'book.done': 'Бронь подтверждена.',
      'book.removed': 'Бронь отменена.',
      'book.none': 'Выберите хотя бы один час.',
      'book.taken': 'Этот слот уже заняли. Обновите сетку.',
      'book.past': 'Нельзя бронировать прошедшую дату.',
      'book.myEmpty': 'Броней пока нет.',
      'book.confirmCancel': 'Отменить эту бронь?',
      'book.yes': 'да, отменить',
      'book.no': 'оставить',

      /* --- запись к мастеру --- */
      'appt.title': 'Запись к мастеру',
      'appt.master': 'Мастер',
      'appt.date': 'Желаемая дата',
      'appt.time': 'Время',
      'appt.idea': 'Идея / описание',
      'appt.ideaPh': 'что хотим набить, размер, место на теле',
      'appt.contact': 'Как с вами связаться',
      'appt.contactPh': 'telegram / телефон',
      'appt.send': 'отправить заявку',
      'appt.sent': 'Заявка отправлена мастеру.',
      'appt.need': 'Заполните описание и контакт.',
      'appt.empty': 'Записей пока нет.',
      'appt.new': 'новая',
      'appt.accepted': 'принята',
      'appt.declined': 'отклонена',
      'appt.accept': 'принять',
      'appt.decline': 'отклонить',
      'appt.reqEmpty': 'Новых заявок нет.',

      /* --- служебное --- */
      'common.cancel': 'отмена',
      'common.save': 'сохранить',
      'common.saved': 'Сохранено.',
      'common.close': 'закрыть',
      'common.back': 'назад',
      'common.status': 'статус',
      'common.action': 'действие',
      'common.notfound': 'Страница не найдена.',
      'common.toMasters': 'к списку мастеров'
    },

    /* =============================== ENGLISH ============================== */
    en: {
      'menu.title': 'Menu:',
      'nav.masters': 'Masters',
      'nav.interior': 'Interior',
      'nav.find': 'How to find',
      'nav.safety': 'Safety',
      'nav.archive': 'Event Archive',
      'nav.feedback': 'Feedback',

      'marquee': 'we tattoo women and children only with permission of their magnificent parents · ' +
                 'the residence is open 24/7 for our own · sterility as a religion · ' +
                 'Tattoo Office — a space made by Mr.A for Mr.A and his friends · ' +
                 'workstations rented by the hour or by the day · book in advance',

      'theme.on': 'on',
      'theme.off': 'off',
      'theme.title': 'light / dark theme',
      'sound.on': 'sound on',
      'sound.off': 'sound off',

      'login.title': 'Log in:',
      'login.customer': 'as customer',
      'login.master': 'as tattoo master',
      'login.logged': 'Signed in:',
      'login.cabinet': 'my account',
      'login.out': 'log out',
      'login.role.master': 'master',
      'login.role.customer': 'customer',

      'foot.privacy': 'privacy policy',
      'foot.offer': 'terms',
      'foot.info': 'info',
      'foot.data': 'data and everything else',

      'masters.title': 'Masters',
      'masters.hint': 'click a card to open the master profile',
      'master.portfolio': 'portfolio',
      'master.drafts': 'drafts',
      'master.back': 'back',
      'master.book': 'book this master',
      'master.age': 'y.o.',
      'master.exp': 'experience',
      'master.empty': 'nothing here yet',
      'master.notfound': 'master not found',

      'interior.title': 'Interior',
      'interior.lead': 'Tattoo Office — a space made by Mr.A for Mr.A and his friends.',
      'interior.body': 'Four working rooms, a common area, a sterilisation room and a meeting room ' +
                       'in an apartment with a history. High ceilings, parquet, daylight from two sides. ' +
                       'Every station is equipped for the full cycle: from sketch to healing.',
      'interior.scan': '3D scan of the space',
      'interior.photos': 'photos',

      'find.title': 'How to find',
      'find.address': 'Address',
      'find.addressValue': 'St. Petersburg, Primernaya st. 1, apt. 7 — 2nd floor, intercom 7',
      'find.hours': 'Opening hours',
      'find.hoursValue': 'daily 11:00 — 23:00, by appointment',
      'find.route': 'Directions',
      'find.routeSteps': [
        'a 7 minute walk from the metro, towards the canal',
        'enter the yard through the arch with black gates',
        'second entrance on the left, the door code is sent before your session',
        'second floor, the door with no sign — you have arrived'
      ],
      'find.contact': 'Contact',
      'find.openMap': 'open in maps',

      'safety.title': 'Safety',
      'safety.lead': 'Sterility is the one rule that is not up for discussion here.',
      'safety.blocks': [
        {
          h: 'Sterilisation',
          items: [
            'single-use needles and cartridges, opened in front of the client',
            'class B autoclave, every load checked with an indicator',
            'reusable tools go through the full cycle: disinfection → cleaning → autoclave',
            'the sterilisation log is kept and available on request'
          ]
        },
        {
          h: 'Workstation',
          items: [
            'barrier film on the machine, clip cord, lamp and chair',
            'the couch is treated between sessions',
            'gloves are changed at every interruption of work',
            'inks are poured into single-use caps and never returned to the bottle'
          ]
        },
        {
          h: 'Contraindications',
          items: [
            'no work with minors without a parent and documents',
            'no work with anyone under the influence of alcohol or drugs',
            'pregnancy, chronic conditions, diabetes, epilepsy — discussed before the session',
            'allergies and medication must be reported in advance'
          ]
        },
        {
          h: 'Healing',
          items: [
            'the master gives you aftercare notes and stays in touch while it heals',
            'free touch-up within 2 months if the aftercare was followed',
            'if anything worries you — write to your master, do not wait'
          ]
        }
      ],

      'archive.title': 'Event Archive',
      'archive.lead': 'Guest sessions, pop-ups, flash days and everything that happened in the office.',
      'archive.all': 'all',
      'archive.empty': 'nothing matches this filter',

      'feedback.title': 'Feedback',
      'feedback.lead': 'Anonymous form. Complaints, ideas, reviews — all of it goes straight to Mr.A.',
      'feedback.type': 'Type',
      'feedback.type.complaint': 'complaint',
      'feedback.type.idea': 'idea',
      'feedback.type.review': 'review',
      'feedback.text': 'Message',
      'feedback.textPh': 'write it as it is, no politeness needed',
      'feedback.contact': 'Contact for a reply (optional)',
      'feedback.contactPh': 'telegram / email — if you want an answer',
      'feedback.anon': 'Sent anonymously: no name, no IP, no timestamp is stored.',
      'feedback.send': 'send',
      'feedback.sent': 'Thank you. Your message has been sent.',
      'feedback.needText': 'Please write a message.',

      'auth.loginTitle.master': 'Log in as tattoo master',
      'auth.loginTitle.customer': 'Log in as customer',
      'auth.regTitle.master': 'Sign in as tattoo master',
      'auth.regTitle.customer': 'Sign in as customer',
      'auth.asMaster': 'master',
      'auth.asCustomer': 'customer',
      'auth.fio': 'Full name',
      'auth.fioPh': 'Arthur A. Arthurson',
      'auth.fioHint': 'middle name — if any',
      'auth.mail': 'E-mail',
      'auth.mailPh': 'nobody@mail.ru',
      'auth.pass': 'Enter password',
      'auth.passNew': 'Make up a password',
      'auth.passPh': 'password-password***',
      'auth.passHint': 'from 4 to 32 characters',
      'auth.enter': 'log in',
      'auth.register': 'sign up',
      'auth.toReg': 'no account — sign up',
      'auth.toLogin': 'already have an account — log in',
      'auth.badPair': 'Wrong e-mail or password.',
      'auth.exists': 'This e-mail is already registered.',
      'auth.short': 'Enter an e-mail and a password of 4+ characters.',
      'auth.badMail': 'That e-mail looks wrong.',
      'auth.memeMaster': 'seems i have found a home…\nnot just a home — a family',
      'auth.memeCustomer': 'feeling kind of sad…\ngonna go get tattooed',
      'auth.demo': 'Demo mode: accounts and bookings live in this browser (localStorage). ' +
                   'Connect a real backend before launch — see README.',
      'auth.tryDemo': 'use the demo account',

      'cab.master': 'Master account',
      'cab.customer': 'Customer account',
      'cab.tab.book': 'booking',
      'cab.tab.my': 'my bookings',
      'cab.tab.req': 'requests',
      'cab.tab.profile': 'My profile',
      'cab.changePass': 'Change password',
      'cab.logout': 'log out',
      'cab.escape': 'escape →',
      'cab.tab.visits': 'my appointments',
      'cab.hello': 'Hello,',
      'cab.stats': 'Stats',
      'cab.visits': 'visits',
      'cab.hours': 'hours booked',
      'cab.active': 'active bookings',

      'book.title': 'Workstation booking',
      'book.place': 'Workstation',
      'book.date': 'Date',
      'book.fullday': 'full day',
      'book.pickSlots': 'Pick your hours',
      'book.selected': 'Hours selected:',
      'book.confirm': 'book it',
      'book.cancel': 'cancel',
      'book.free': 'free',
      'book.mine': 'my booking',
      'book.busy': 'taken',
      'book.done': 'Booking confirmed.',
      'book.removed': 'Booking cancelled.',
      'book.none': 'Pick at least one hour.',
      'book.taken': 'That slot was just taken. Refresh the grid.',
      'book.past': 'You cannot book a past date.',
      'book.myEmpty': 'No bookings yet.',
      'book.confirmCancel': 'Cancel this booking?',
      'book.yes': 'yes, cancel',
      'book.no': 'keep it',

      'appt.title': 'Book a master',
      'appt.master': 'Master',
      'appt.date': 'Preferred date',
      'appt.time': 'Time',
      'appt.idea': 'Idea / description',
      'appt.ideaPh': 'what you want, size, placement',
      'appt.contact': 'How to reach you',
      'appt.contactPh': 'telegram / phone',
      'appt.send': 'send request',
      'appt.sent': 'Request sent to the master.',
      'appt.need': 'Fill in the description and a contact.',
      'appt.empty': 'No appointments yet.',
      'appt.new': 'new',
      'appt.accepted': 'accepted',
      'appt.declined': 'declined',
      'appt.accept': 'accept',
      'appt.decline': 'decline',
      'appt.reqEmpty': 'No new requests.',

      'common.cancel': 'cancel',
      'common.save': 'save',
      'common.saved': 'Saved.',
      'common.close': 'close',
      'common.back': 'back',
      'common.status': 'status',
      'common.action': 'action',
      'common.notfound': 'Page not found.',
      'common.toMasters': 'back to masters'
    }
  };

  var lang = localStorage.getItem('to.lang') || 'ru';
  if (!DICT[lang]) lang = 'ru';

  var I18N = {
    get: function () { return lang; },
    set: function (next) {
      if (!DICT[next] || next === lang) return false;
      lang = next;
      localStorage.setItem('to.lang', lang);
      document.documentElement.lang = lang;
      return true;
    },
    /* t('key') — строка; отсутствующий ключ возвращается как есть,
       чтобы недостающий перевод сразу бросался в глаза. */
    t: function (key) {
      var v = DICT[lang][key];
      if (v === undefined) v = DICT.ru[key];
      return v === undefined ? key : v;
    },
    /* Выбор языковой версии из объекта вида {ru:'…', en:'…'} */
    pick: function (obj) {
      if (obj == null) return '';
      if (typeof obj === 'string') return obj;
      return obj[lang] != null ? obj[lang] : (obj.ru != null ? obj.ru : '');
    }
  };

  document.documentElement.lang = lang;
  global.I18N = I18N;
  global.t = I18N.t;
})(window);
