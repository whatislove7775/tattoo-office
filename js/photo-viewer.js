(function (global) {
  "use strict";
  var photos = [], index = 0, startX = null, startY = 0;
  var dialog = document.createElement("dialog");
  dialog.className = "photo-viewer";
  dialog.setAttribute("aria-label", "Просмотр фотографий");
  dialog.innerHTML = '<div class="photo-viewer__bar"><span class="photo-viewer__caption"></span><button type="button" class="photo-viewer__close" aria-label="Закрыть"><svg class="ui-icon" aria-hidden="true"><use href="#ui-close"></use></svg></button></div><div class="photo-viewer__stage"><button type="button" class="photo-viewer__prev" aria-label="Предыдущая фотография"><svg class="ui-icon" aria-hidden="true"><use href="#ui-chevron-left"></use></svg></button><img alt=""><button type="button" class="photo-viewer__next" aria-label="Следующая фотография"><svg class="ui-icon" aria-hidden="true"><use href="#ui-chevron-right"></use></svg></button></div><div class="photo-viewer__foot"><span class="photo-viewer__count"></span><div class="photo-viewer__dots"></div></div>';
  document.body.append(dialog);
  var image = dialog.querySelector("img");
  var themeColor = document.querySelector('meta[name="theme-color"]');
  var previousThemeColor;
  dialog.addEventListener("close", function () {
    if (themeColor && previousThemeColor != null) themeColor.content = previousThemeColor;
    previousThemeColor = null;
  });
  function show(next) {
    index = (next + photos.length) % photos.length;
    var photo = photos[index];
    image.src = photo.src;
    image.alt = photo.caption || "Фотография";
    dialog.querySelector(".photo-viewer__prev").hidden = photos.length < 2;
    dialog.querySelector(".photo-viewer__next").hidden = photos.length < 2;
    dialog.querySelector(".photo-viewer__foot").hidden = photos.length < 2;
    dialog.querySelector(".photo-viewer__caption").textContent = photo.caption || "";
    dialog.querySelector(".photo-viewer__count").textContent = (index + 1) + " / " + photos.length;
    var dots = dialog.querySelector(".photo-viewer__dots");
    dots.replaceChildren();
    photos.forEach(function (_, i) {
      var button = document.createElement("button");
      button.type = "button";
      button.setAttribute("aria-label", "Фотография " + (i + 1));
      button.setAttribute("aria-current", String(i === index));
      button.onclick = function () { show(i); };
      dots.append(button);
    });
  }
  dialog.querySelector(".photo-viewer__close").onclick = function () { dialog.close(); };
  dialog.querySelector(".photo-viewer__prev").onclick = function () { show(index - 1); };
  dialog.querySelector(".photo-viewer__next").onclick = function () { show(index + 1); };
  dialog.addEventListener("click", function (event) { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") { event.preventDefault(); show(index - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); show(index + 1); }
  });
  var swipeSurface=dialog.querySelector(".photo-viewer__stage");
  swipeSurface.addEventListener("touchstart", function (event) { if(event.touches.length!==1){startX=null;return;}startX = event.touches[0].screenX;startY=event.touches[0].screenY; }, {passive:true});
  swipeSurface.addEventListener("touchend", function (event) {
    if(startX===null)return;
    var diff = event.changedTouches[0].screenX - startX;
    var vertical = event.changedTouches[0].screenY - startY;
    startX=null;
    if (!event.touches.length && Math.abs(diff) > 45 && Math.abs(diff) > Math.abs(vertical)*1.25) show(index + (diff < 0 ? 1 : -1));
  }, {passive:true});
  swipeSurface.addEventListener("touchcancel", function(){startX=null;}, {passive:true});
  global.PhotoViewer = {
    open: function (list, at) {
      photos = list.filter(function (photo) { return photo && photo.src; });
      if (!photos.length) return;
      show(at || 0);
      if (!dialog.open) {
        if (themeColor) { previousThemeColor = themeColor.content; themeColor.content = "#111111"; }
        dialog.showModal();
      }
    }
  };
})(window);
