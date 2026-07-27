/* =========================================================================
   DATA — контент сайта.
   Всё редактируемое собрано здесь: мастера, работы, интерьер, архив, места.
   Картинок в репозитории нет: пока файла нет по указанному пути,
   подставляется сгенерированная заглушка (см. PLACEHOLDER ниже).
   ========================================================================= */
(function (global) {
  'use strict';

  /* Заглушки рисует js/placeholder.js — там же живут все варианты. */
  function placeholder(seed, label, kind) {
    return global.Placeholder.make(seed, label, kind);
  }

  /* --------------------------------- мастера ------------------------------ */
  /* photo / works — пути к файлам. Положите фото в assets/… с этими именами,
     и заглушки исчезнут сами. */
  function works(id, prefix, n, capRu, capEn) {
    var out = [];
    for (var i = 1; i <= n; i++) {
      out.push({
        src: 'assets/works/' + id + '-' + prefix + i + '.jpg',
        cap: { ru: capRu + ' ' + i + '.png', en: capEn + ' ' + i + '.png' }
      });
    }
    return out;
  }

  var MASTERS = [
    {
      id: 'zinaida',
      name: { ru: 'Зинаида Петровна', en: 'Zinaida Petrovna' },
      age: 21,
      exp: { ru: '2 года', en: '2 years' },
      bio: {
        ru: 'работает в стиле барокко. качественно, долго и с характером.',
        en: 'works in baroque. properly, slowly and with character.'
      },
      photo: 'assets/masters/zinaida.jpg',
      portfolio: works('zinaida', 'p', 10, 'эскиз', 'sketch'),
      drafts: works('zinaida', 'd', 6, 'черновик', 'draft')
    },
    {
      id: 'mr-a',
      name: { ru: 'Mr.A', en: 'Mr.A' },
      age: 33,
      exp: { ru: '12 лет', en: '12 years' },
      bio: {
        ru: 'основатель офиса. орнаменты, блэкворк, всё, что режет глаз.',
        en: 'founder of the office. ornamental, blackwork, everything that cuts the eye.'
      },
      photo: 'assets/masters/mr-a.jpg',
      portfolio: works('mr-a', 'p', 8, 'эскиз', 'sketch'),
      drafts: works('mr-a', 'd', 4, 'черновик', 'draft')
    },
    {
      id: 'sexova',
      name: { ru: 'Зинаида Сексова', en: 'Zinaida Sexova' },
      age: 24,
      exp: { ru: '4 года', en: '4 years' },
      bio: {
        ru: 'тонкие линии, шрифты, всё маленькое и злое.',
        en: 'fine line, lettering, everything small and mean.'
      },
      photo: 'assets/masters/sexova.jpg',
      portfolio: works('sexova', 'p', 9, 'эскиз', 'sketch'),
      drafts: works('sexova', 'd', 5, 'черновик', 'draft')
    },
    {
      id: 'kostya',
      name: { ru: 'Костя Офисный', en: 'Kostya Office' },
      age: 29,
      exp: { ru: '7 лет', en: '7 years' },
      bio: {
        ru: 'олдскул, традишнл, флэши по средам.',
        en: 'old school, traditional, flash days on wednesdays.'
      },
      photo: 'assets/masters/kostya.jpg',
      portfolio: works('kostya', 'p', 7, 'эскиз', 'sketch'),
      drafts: works('kostya', 'd', 4, 'черновик', 'draft')
    },
    {
      id: 'vera',
      name: { ru: 'Вера Никитична', en: 'Vera Nikitichna' },
      age: 26,
      exp: { ru: '5 лет', en: '5 years' },
      bio: {
        ru: 'реализм в сером, портреты животных и людей, которых уже нет.',
        en: 'black and grey realism, portraits of animals and people who are gone.'
      },
      photo: 'assets/masters/vera.jpg',
      portfolio: works('vera', 'p', 8, 'эскиз', 'sketch'),
      drafts: works('vera', 'd', 3, 'черновик', 'draft')
    },
    {
      id: 'gleb',
      name: { ru: 'Глеб Факсов', en: 'Gleb Faxov' },
      age: 31,
      exp: { ru: '9 лет', en: '9 years' },
      bio: {
        ru: 'киберсигилизм, техно-орнамент, любит большие проекты.',
        en: 'cybersigilism, techno ornament, loves big projects.'
      },
      photo: 'assets/masters/gleb.jpg',
      portfolio: works('gleb', 'p', 9, 'эскиз', 'sketch'),
      drafts: works('gleb', 'd', 5, 'черновик', 'draft')
    },
    {
      id: 'nastya',
      name: { ru: 'Настя Скрепкина', en: 'Nastya Skrepkina' },
      age: 23,
      exp: { ru: '3 года', en: '3 years' },
      bio: {
        ru: 'акварель, ботаника, цвет. записывается на месяц вперёд.',
        en: 'watercolour, botanics, colour. booked a month ahead.'
      },
      photo: 'assets/masters/nastya.jpg',
      portfolio: works('nastya', 'p', 8, 'эскиз', 'sketch'),
      drafts: works('nastya', 'd', 4, 'черновик', 'draft')
    },
    {
      id: 'petr',
      name: { ru: 'Пётр Архивный', en: 'Petr Archive' },
      age: 38,
      exp: { ru: '15 лет', en: '15 years' },
      bio: {
        ru: 'японская традиция, рукава и спины. работает только по записи.',
        en: 'japanese traditional, sleeves and backpieces. by appointment only.'
      },
      photo: 'assets/masters/petr.jpg',
      portfolio: works('petr', 'p', 10, 'эскиз', 'sketch'),
      drafts: works('petr', 'd', 4, 'черновик', 'draft')
    }
  ];

  /* -------------------------------- интерьер ------------------------------ */
  var INTERIOR = {
    scan: 'assets/interior/scan.jpg',
    photos: [
      { src: 'assets/interior/1.jpg', cap: { ru: 'общая зона', en: 'common area' } },
      { src: 'assets/interior/2.jpg', cap: { ru: 'кабинет №1', en: 'room no.1' } },
      { src: 'assets/interior/3.jpg', cap: { ru: 'кабинет №2', en: 'room no.2' } },
      { src: 'assets/interior/4.jpg', cap: { ru: 'переговорная', en: 'meeting room' } },
      { src: 'assets/interior/5.jpg', cap: { ru: 'стерилизационная', en: 'sterilisation' } },
      { src: 'assets/interior/6.jpg', cap: { ru: 'коридор', en: 'hallway' } }
    ]
  };

  /* --------------------------------- архив -------------------------------- */
  var ARCHIVE = [
    {
      date: '2026-05-17', kind: 'guest',
      title: { ru: 'Гостевая: Петр Архивный', en: 'Guest spot: Petr Archive' },
      text: { ru: 'Три дня японской традиции, восемь рукавов, ноль перерывов.',
              en: 'Three days of japanese traditional, eight sleeves, zero breaks.' }
    },
    {
      date: '2026-03-08', kind: 'flash',
      title: { ru: 'Флэш-день «Канцелярия»', en: 'Flash day “Stationery”' },
      text: { ru: 'Скрепки, печати, штампы и факсы на коже. 40 работ за сутки.',
              en: 'Paper clips, seals, stamps and faxes on skin. 40 pieces in a day.' }
    },
    {
      date: '2025-11-22', kind: 'popup',
      title: { ru: 'Поп-ап в книжном на Литейном', en: 'Pop-up at the bookshop on Liteyny' },
      text: { ru: 'Мини-тату по эскизам из старых советских инструкций.',
              en: 'Mini tattoos based on sketches from old soviet manuals.' }
    },
    {
      date: '2025-09-14', kind: 'party',
      title: { ru: 'Открытие второго этажа', en: 'Second floor opening' },
      text: { ru: 'Четыре новых рабочих места, один диджей, ноль жалоб соседей.',
              en: 'Four new workstations, one dj, zero complaints from neighbours.' }
    },
    {
      date: '2025-06-01', kind: 'guest',
      title: { ru: 'Гостевая: Berlin / KREUZ', en: 'Guest spot: Berlin / KREUZ' },
      text: { ru: 'Обмен резидентами с берлинской студией. Две недели, два языка.',
              en: 'Resident exchange with a Berlin studio. Two weeks, two languages.' }
    },
    {
      date: '2025-02-14', kind: 'flash',
      title: { ru: 'Антивалентинки', en: 'Anti-valentines' },
      text: { ru: 'Только чёрные сердца и служебные записки.',
              en: 'Black hearts and internal memos only.' }
    }
  ];

  var ARCHIVE_KINDS = {
    guest: { ru: 'гостевая', en: 'guest spot' },
    flash: { ru: 'флэш',     en: 'flash day' },
    popup: { ru: 'поп-ап',   en: 'pop-up' },
    party: { ru: 'событие',  en: 'event' }
  };

  /* ---------------------------- рабочие места ----------------------------- */
  var WORKSPACES = [
    { id: 'ws1', name: { ru: 'Кабинет 1 — у окна',   en: 'Room 1 — by the window' }, price: 900 },
    { id: 'ws2', name: { ru: 'Кабинет 2 — тихий',    en: 'Room 2 — quiet' },         price: 900 },
    { id: 'ws3', name: { ru: 'Кабинет 3 — большой',  en: 'Room 3 — large' },         price: 1100 },
    { id: 'ws4', name: { ru: 'Кабинет 4 — угловой',  en: 'Room 4 — corner' },        price: 800 }
  ];

  /* Рабочий день офиса, по часам. */
  var HOURS = [];
  for (var h = 11; h <= 22; h++) HOURS.push(h);

  var CONTACTS = {
    tg: '@tattoooffice',
    mail: 'hello@tattoo.office',
    phone: '+7 (000) 000-00-00',
    mapUrl: 'https://yandex.ru/maps/'
  };

  global.DATA = {
    masters: MASTERS,
    interior: INTERIOR,
    archive: ARCHIVE,
    archiveKinds: ARCHIVE_KINDS,
    workspaces: WORKSPACES,
    hours: HOURS,
    contacts: CONTACTS,
    placeholder: placeholder,
    masterById: function (id) {
      for (var i = 0; i < MASTERS.length; i++) if (MASTERS[i].id === id) return MASTERS[i];
      return null;
    }
  };
})(window);
