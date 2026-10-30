const MAP_SRC = "assets/location-map-v6.svg";
let dialog;

export function openLocationMap(address) {
  if (!dialog) {
    dialog = document.createElement("dialog");
    dialog.className = "location-map-dialog";
    dialog.setAttribute("aria-label", "Интерактивная карта маршрута до Tattoo Office");
    dialog.innerHTML = `<div class="location-map-dialog__bar"><strong>Как дойти до Tattoo Office</strong><button type="button" data-map-close aria-label="Закрыть карту"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M5 5 19 19M19 5 5 19"/></svg></button></div>
      <div class="location-map-dialog__stage" aria-label="Карта. Масштабируйте кнопками или жестом, перемещайте пальцем или мышью."><img src="${MAP_SRC}" alt="Маршрут от метро Чернышевская до Tattoo Office на Кирочной, 24" draggable="false"></div>
      <div class="location-map-dialog__foot"><div class="location-map-dialog__zoom"><button type="button" data-map-zoom="out" aria-label="Уменьшить карту">−</button><button type="button" data-map-zoom="reset" aria-label="Сбросить масштаб">1:1</button><button type="button" data-map-zoom="in" aria-label="Увеличить карту">+</button></div><a target="_blank" rel="noopener noreferrer">Открыть в картах ↗</a></div>`;
    document.body.append(dialog);
    const stage = dialog.querySelector(".location-map-dialog__stage");
    const image = stage.querySelector("img");
    const pointers = new Map();
    let scale = 1, x = 0, y = 0, pinchDistance = 0;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const distance = () => {
      const [a, b] = [...pointers.values()];
      return Math.hypot(a.x - b.x, a.y - b.y);
    };
    const paint = () => {
      x = clamp(x, -(scale - 1) * stage.clientWidth / 2, (scale - 1) * stage.clientWidth / 2);
      y = clamp(y, -(scale - 1) * stage.clientHeight / 2, (scale - 1) * stage.clientHeight / 2);
      image.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      dialog.querySelector('[data-map-zoom="reset"]').textContent = `${Math.round(scale * 100)}%`;
    };
    const zoom = factor => { scale = clamp(scale * factor, 1, 4); paint(); };
    const reset = () => { scale = 1; x = 0; y = 0; pointers.clear(); pinchDistance = 0; paint(); };
    dialog.querySelector('[data-map-close]').onclick = () => dialog.close();
    dialog.querySelector('[data-map-zoom="in"]').onclick = () => zoom(1.35);
    dialog.querySelector('[data-map-zoom="out"]').onclick = () => zoom(1 / 1.35);
    dialog.querySelector('[data-map-zoom="reset"]').onclick = reset;
    dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener("close", reset);
    window.addEventListener("hashchange", () => { if (dialog.open) dialog.close(); });
    stage.addEventListener("pointerdown", event => {
      stage.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
      pinchDistance = pointers.size === 2 ? distance() : 0;
      stage.classList.add("is-dragging");
    });
    stage.addEventListener("pointermove", event => {
      const previous = pointers.get(event.pointerId);
      if (!previous) return;
      pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
      if (pointers.size === 2) {
        const next = distance();
        if (pinchDistance) scale = clamp(scale * next / pinchDistance, 1, 4);
        pinchDistance = next;
      } else if (scale > 1) {
        x += event.clientX - previous.x;
        y += event.clientY - previous.y;
      }
      paint();
    });
    const release = event => {
      pointers.delete(event.pointerId);
      pinchDistance = 0;
      if (!pointers.size) stage.classList.remove("is-dragging");
    };
    stage.addEventListener("pointerup", release);
    stage.addEventListener("pointercancel", release);
    stage.addEventListener("wheel", event => { event.preventDefault(); zoom(event.deltaY < 0 ? 1.15 : 1 / 1.15); }, {passive: false});
    dialog.addEventListener("keydown", event => {
      if (event.key === "+" || event.key === "=") { event.preventDefault(); zoom(1.35); }
      if (event.key === "-") { event.preventDefault(); zoom(1 / 1.35); }
      if (event.key === "0") { event.preventDefault(); reset(); }
    });
  }
  dialog.querySelector(".location-map-dialog__foot a").href = `https://yandex.ru/maps/?text=${encodeURIComponent(address)}`;
  dialog.showModal();
}
