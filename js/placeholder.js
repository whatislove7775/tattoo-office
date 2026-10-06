/* =========================================================================
   PLACEHOLDER — дефолтные заглушки вместо отсутствующих фотографий.

   Обычный серый прямоугольник с нейтральным значком: пока файла нет по
   нужному пути, вёрстка не разъезжается и ничего не отвлекает. Рисуется
   на месте, без единого запроса наружу.
   ========================================================================= */
(function (global) {
  'use strict';

  var BG_LIGHT = '#d9d9d7';
  var BG_DARK  = '#3a3a3e';
  var GLYPH_LIGHT = 'rgba(0,0,0,.20)';
  var GLYPH_DARK  = 'rgba(255,255,255,.22)';

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function uri(svg) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /* Значок «изображение»: рамка, солнце и горы — универсальная пиктограмма,
     понятная без подписи. */
  function glyph(cx, cy, size, color) {
    var w = size, h = size * 0.78;
    var x = cx - w / 2, y = cy - h / 2;
    return '<g fill="none" stroke="' + color + '" stroke-width="' + (size * 0.055).toFixed(1) + '" ' +
             'stroke-linejoin="round">' +
             '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (size * 0.08) + '"/>' +
             '<circle cx="' + (x + w * 0.28) + '" cy="' + (y + h * 0.3) + '" r="' + (size * 0.07) + '"/>' +
             '<path d="M' + x + ' ' + (y + h * 0.78) +
               ' L' + (x + w * 0.34) + ' ' + (y + h * 0.42) +
               ' L' + (x + w * 0.62) + ' ' + (y + h * 0.72) +
               ' L' + (x + w * 0.76) + ' ' + (y + h * 0.58) +
               ' L' + (x + w) + ' ' + (y + h * 0.84) + '"/>' +
           '</g>';
  }

  function box(w, h) {
    var bg = isDark() ? BG_DARK : BG_LIGHT;
    var fg = isDark() ? GLYPH_DARK : GLYPH_LIGHT;
    var size = Math.min(w, h) * 0.34;
    return uri(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '">' +
        '<rect width="' + w + '" height="' + h + '" fill="' + bg + '"/>' +
        glyph(w / 2, h / 2, size, fg) +
      '</svg>'
    );
  }

  /* Пропорции под место, куда картинка встаёт. */
  var SHAPES = {
    tattoo: [300, 350],
    room:   [300, 260],
    meme:   [400, 225],
    def:    [300, 340]
  };

  function make(seed, label, kind) {
    var s = SHAPES[kind] || SHAPES.def;
    return box(s[0], s[1]);
  }

  global.Placeholder = { make: make };
})(window);
