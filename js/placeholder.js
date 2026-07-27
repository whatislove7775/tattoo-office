/* =========================================================================
   PLACEHOLDER — рисованные заглушки вместо отсутствующих фотографий.

   Пока настоящего файла нет по нужному пути, на его месте появляется
   не серый прямоугольник, а дурацкая картинка в духе офисного клипарта
   нулевых: рожи, кривые тату-эскизы, штампы «изъято». Всё рисуется
   на месте, ни одного запроса наружу.

   Вариант выбирается по seed, поэтому у конкретной карточки он всегда
   один и тот же и не скачет при перерисовке.
   ========================================================================= */
(function (global) {
  'use strict';

  var PAPER = ['#f1ece2', '#eceae4', '#efe9dc', '#e9e9e6'];
  var INK = '#141414';

  function hash(str) {
    var h = 0;
    for (var i = 0; i < String(str).length; i++) h = (h * 31 + String(str).charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  function wrap(w, h, bg, body) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '">' +
             '<rect width="' + w + '" height="' + h + '" fill="' + bg + '"/>' + body +
           '</svg>';
  }

  function uri(svg) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function txt(x, y, size, s, opts) {
    opts = opts || {};
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (opts.anchor || 'middle') + '" ' +
           'font-family="Helvetica Neue, Helvetica, Arial" font-size="' + size + '" ' +
           'font-weight="' + (opts.bold ? 700 : 400) + '" fill="' + (opts.fill || INK) + '"' +
           (opts.opacity ? ' opacity="' + opts.opacity + '"' : '') +
           (opts.rotate ? ' transform="rotate(' + opts.rotate + ' ' + x + ' ' + y + ')"' : '') +
           '>' + s + '</text>';
  }

  /* круглая печать, как на архивном документе */
  function stamp(cx, cy, r, label, angle) {
    return '<g transform="rotate(' + angle + ' ' + cx + ' ' + cy + ')" opacity=".5">' +
             '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + INK + '" stroke-width="3"/>' +
             '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 7) + '" fill="none" stroke="' + INK + '" stroke-width="1"/>' +
             txt(cx, cy + 5, r * 0.32, label, { bold: true }) +
           '</g>';
  }

  /* ------------------------------- РОЖИ ---------------------------------- */
  /* Клипарт нулевых: кружок, глазки, рот. Чем кривее, тем лучше. */
  var FACES = [
    /* 0. в тёмных очках */
    function (c) {
      return '<circle cx="150" cy="150" r="88" fill="none" stroke="' + INK + '" stroke-width="6"/>' +
             '<rect x="92" y="126" width="116" height="30" rx="14" fill="' + INK + '"/>' +
             '<path d="M108 196q42 34 84 0" fill="none" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
             txt(150, 292, 17, c, { opacity: .55 });
    },
    /* 1. монобровь и недовольство */
    function (c) {
      return '<circle cx="150" cy="150" r="88" fill="none" stroke="' + INK + '" stroke-width="6"/>' +
             '<path d="M96 116q54 -22 108 0" fill="none" stroke="' + INK + '" stroke-width="9" stroke-linecap="round"/>' +
             '<circle cx="120" cy="150" r="9" fill="' + INK + '"/><circle cx="180" cy="150" r="9" fill="' + INK + '"/>' +
             '<path d="M112 206q38 -26 76 0" fill="none" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
             txt(150, 292, 17, c, { opacity: .55 });
    },
    /* 2. крестики вместо глаз */
    function (c) {
      return '<circle cx="150" cy="150" r="88" fill="none" stroke="' + INK + '" stroke-width="6"/>' +
             '<path d="M106 132l26 26M132 132l-26 26M168 132l26 26M194 132l-26 26" stroke="' + INK +
               '" stroke-width="7" stroke-linecap="round"/>' +
             '<path d="M116 200h68" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
             '<path d="M150 200v26" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
             txt(150, 292, 17, c, { opacity: .55 });
    },
    /* 3. фото на документы, силуэт и сетка */
    function (c) {
      return '<g opacity=".18" stroke="' + INK + '" stroke-width="1">' +
               '<path d="M0 75h300M0 150h300M0 225h300M75 0v340M150 0v340M225 0v340"/></g>' +
             '<circle cx="150" cy="128" r="52" fill="' + INK + '" opacity=".78"/>' +
             '<path d="M150 190c46 0 80 26 88 66H62c8-40 42-66 88-66z" fill="' + INK + '" opacity=".78"/>' +
             stamp(228, 258, 46, 'ФОТО', -14) +
             txt(150, 34, 17, 'ФОРМА 3×4', { bold: true, opacity: .5 });
    },
    /* 4. засекречено */
    function (c) {
      return '<circle cx="150" cy="150" r="88" fill="' + INK + '" opacity=".14"/>' +
             '<rect x="80" y="128" width="140" height="26" fill="' + INK + '"/>' +
             '<rect x="104" y="188" width="92" height="20" fill="' + INK + '"/>' +
             stamp(150, 262, 48, 'ИЗЪЯТО', 8) +
             txt(150, 40, 15, 'МАТЕРИАЛ ЗАКРЫТ', { bold: true, opacity: .55 });
    },
    /* 5. подмигивает с сигаретой */
    function (c) {
      return '<circle cx="150" cy="150" r="88" fill="none" stroke="' + INK + '" stroke-width="6"/>' +
             '<path d="M104 148q16 -18 32 0" fill="none" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
             '<circle cx="182" cy="146" r="10" fill="' + INK + '"/>' +
             '<path d="M116 198q34 20 62 2" fill="none" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>' +
             '<rect x="176" y="196" width="46" height="8" rx="3" fill="' + INK + '"/>' +
             '<path d="M226 190q8 -14 0 -26" fill="none" stroke="' + INK + '" stroke-width="3" opacity=".5"/>' +
             txt(150, 292, 17, c, { opacity: .55 });
    },
    /* 6. просто устал */
    function (c) {
      return '<circle cx="150" cy="150" r="88" fill="none" stroke="' + INK + '" stroke-width="6"/>' +
             '<path d="M108 142h34M158 142h34" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>' +
             '<ellipse cx="150" cy="206" rx="20" ry="26" fill="none" stroke="' + INK + '" stroke-width="6"/>' +
             txt(150, 292, 17, c, { opacity: .55 });
    }
  ];

  /* --------------------------- ТАТУ-ЭСКИЗЫ ------------------------------- */
  /* Нарочито кривые каракули: ровно то, что рисуют на полях блокнота. */
  var TATTOOS = [
    /* кинжал */
    function () {
      return '<g fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">' +
             '<path d="M150 40l22 150-22 92-22-92z"/><path d="M104 190h92"/><path d="M150 282v34"/>' +
             '<circle cx="150" cy="326" r="10"/></g>';
    },
    /* сердце с лентой */
    function () {
      return '<g fill="none" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round">' +
             '<path d="M150 262C60 196 62 118 106 104c26-8 44 12 44 12s18-20 44-12c44 14 46 92-44 158z"/>' +
             '<path d="M58 210q92 40 184 0l-14 40q-78 32-156 0z"/></g>' +
             txt(150, 244, 22, 'МАМА', { bold: true });
    },
    /* ласточка */
    function () {
      return '<g fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">' +
             '<path d="M40 190q60 -80 122 -40 44 28 98 -20-18 66-78 78"/>' +
             '<path d="M162 150q-30 46-86 56"/><path d="M240 130l30-6-16 28z"/></g>';
    },
    /* трайбл */
    function () {
      return '<g fill="' + INK + '"><path d="M60 260c40-120 100-150 180-190-30 60-18 92-46 128 30-6 44-22 62-46' +
             '-8 66-56 106-124 118 24 18 46 20 74 10-38 40-96 34-146-20z"/></g>';
    },
    /* череп */
    function () {
      return '<g fill="none" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round">' +
             '<path d="M76 158c0-52 34-84 74-84s74 32 74 84c0 30-12 44-12 66 0 16-24 22-62 22s-62-6-62-22c0-22-12-36-12-66z"/>' +
             '<circle cx="120" cy="160" r="18" fill="' + INK + '"/><circle cx="180" cy="160" r="18" fill="' + INK + '"/>' +
             '<path d="M150 190l-10 24h20z" fill="' + INK + '"/>' +
             '<path d="M118 246v20M150 248v20M182 246v20"/></g>';
    },
    /* роза */
    function () {
      return '<g fill="none" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round">' +
             '<circle cx="150" cy="130" r="20"/><circle cx="150" cy="130" r="44"/><circle cx="150" cy="130" r="68"/>' +
             '<path d="M150 198v110"/><path d="M150 240q-52 -14-58-58 46 4 58 44z"/>' +
             '<path d="M150 276q52 -14 58 -58-46 4-58 44z"/></g>';
    },
    /* колючая проволока */
    function () {
      return '<g fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round">' +
             '<path d="M20 170h260"/>' +
             '<path d="M70 146l16 48M62 194l24-48M150 146l16 48M142 194l24-48M230 146l16 48M222 194l24-48"/></g>';
    },
    /* якорь */
    function () {
      return '<g fill="none" stroke="' + INK + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">' +
             '<circle cx="150" cy="72" r="22"/><path d="M150 94v190"/><path d="M96 130h108"/>' +
             '<path d="M70 214c0 50 36 76 80 76s80-26 80-76"/><path d="M52 210h36M212 210h36"/></g>';
    }
  ];

  /* ------------------------------ КОМНАТЫ -------------------------------- */
  var ROOMS = [
    function () {
      return '<g fill="none" stroke="' + INK + '" stroke-width="4">' +
             '<rect x="30" y="40" width="240" height="150"/><rect x="56" y="66" width="70" height="50"/>' +
             '<path d="M160 190v-60h80v60"/><circle cx="200" cy="96" r="18"/><path d="M200 114v16"/></g>' +
             txt(150, 226, 16, 'КАБИНЕТ', { bold: true, opacity: .5 });
    },
    function () {
      return '<g fill="none" stroke="' + INK + '" stroke-width="4">' +
             '<path d="M40 200h220"/><rect x="70" y="120" width="120" height="80" rx="10"/>' +
             '<path d="M190 160h50M240 160v-70"/><circle cx="240" cy="80" r="16"/></g>' +
             txt(150, 232, 16, 'КУШЕТКА И ЛАМПА', { bold: true, opacity: .5 });
    },
    function () {
      return '<g fill="none" stroke="' + INK + '" stroke-width="4">' +
             '<rect x="60" y="40" width="180" height="160" rx="6"/><path d="M150 40v160M60 120h180"/>' +
             '<path d="M40 210h220"/></g>' +
             txt(150, 240, 16, 'ОКНО ВО ДВОР', { bold: true, opacity: .5 });
    }
  ];

  /* ------------------------------- МЕМЫ ---------------------------------- */
  /* Для страниц входа, пока не положены свои картинки. */
  var MEMES = [
    function () {
      return '<g fill="none" stroke="' + INK + '" stroke-width="6" stroke-linecap="round">' +
             '<circle cx="200" cy="105" r="62"/>' +
             '<path d="M172 92h18M210 92h18"/>' +
             '<path d="M176 138q24 -18 48 0"/>' +
             '<path d="M180 104q-6 26 0 34" opacity=".6"/></g>';
    },
    function () {
      return '<g fill="none" stroke="' + INK + '" stroke-width="6" stroke-linecap="round">' +
             '<ellipse cx="200" cy="108" rx="70" ry="56"/>' +
             '<path d="M150 66l-16-28M250 66l16-28"/>' +
             '<circle cx="178" cy="100" r="7" fill="' + INK + '"/><circle cx="222" cy="100" r="7" fill="' + INK + '"/>' +
             '<path d="M186 132q14 12 28 0"/></g>';
    }
  ];

  /* ------------------------------ сборка --------------------------------- */
  function make(seed, label, kind) {
    var h = hash(seed || 'to');
    var paper = PAPER[h % PAPER.length];
    var caption = String(label || '').split('.')[0].slice(0, 22);

    if (kind === 'tattoo') {
      return uri(wrap(300, 350, '#ffffff', TATTOOS[h % TATTOOS.length]() +
        txt(150, 338, 13, 'эскиз', { opacity: .35 })));
    }
    if (kind === 'room') {
      return uri(wrap(300, 260, paper, ROOMS[h % ROOMS.length]()));
    }
    if (kind === 'meme') {
      return uri(wrap(400, 225, paper, MEMES[h % MEMES.length]()));
    }
    /* по умолчанию — портрет */
    return uri(wrap(300, 340, paper, FACES[h % FACES.length](caption)));
  }

  global.Placeholder = { make: make };
})(window);
