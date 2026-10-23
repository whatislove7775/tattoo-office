/* Сегментированные переключатели (.tabs): белая подложка-«бегунок» плавно
   следует за курсором и останавливается на опции после клика. Без курсора
   подложка стоит под выбранной опцией. Работает и после перерисовки страницы:
   последняя позиция запоминается, и подложка доезжает до новой опции. */
(() => {
  const SELECTED = '[aria-selected="true"],[aria-pressed="true"],.active';
  const memory = new Map();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const options = (tabs) => [...tabs.querySelectorAll(":scope > button, :scope > a")];
  const keyOf = (tabs) => tabs.getAttribute("aria-label") || options(tabs).map((b) => b.textContent.trim()).join("|");
  const selectedOf = (tabs) => options(tabs).find((b) => b.matches(SELECTED));

  function enhance(tabs) {
    if (tabs.dataset.glider || tabs.closest(".section-head")) return;
    const first = selectedOf(tabs);
    if (!first || options(tabs).length < 2) return;
    tabs.dataset.glider = "true";
    tabs.classList.add("tabs--glider");
    const glider = document.createElement("span");
    glider.className = "tabs__glider";
    glider.setAttribute("aria-hidden", "true");
    tabs.prepend(glider);
    const key = keyOf(tabs);
    let pinned = null;

    const set = (box, instant) => {
      if (instant || reduced.matches) glider.style.transition = "none";
      glider.style.width = box.w + "px";
      glider.style.height = box.h + "px";
      glider.style.transform = `translate(${box.x}px, ${box.y}px)`;
      if (instant || reduced.matches) { void glider.offsetWidth; glider.style.transition = ""; }
      memory.set(key, box);
    };
    const boxOf = (b) => ({ x: b.offsetLeft, y: b.offsetTop, w: b.offsetWidth, h: b.offsetHeight });
    const rest = (instant) => { const b = pinned?.isConnected ? pinned : selectedOf(tabs); if (b) set(boxOf(b), instant); };

    // Старт: с прошлой позиции (после перерисовки) — плавно, иначе сразу на месте.
    const previous = memory.get(key);
    if (previous) { set(previous, true); requestAnimationFrame(() => rest(false)); }
    else rest(true);

    // Следует за курсором: ширина — как у опции под курсором, центр — у курсора,
    // но не выходит за края переключателя и строку этой опции.
    tabs.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const b = e.target.closest("button, a");
      if (!b || b.parentElement !== tabs || b.disabled) return;
      const box = boxOf(b), area = tabs.getBoundingClientRect(), pad = options(tabs)[0].offsetLeft;
      const cursor = e.clientX - area.left - tabs.clientLeft;
      const x = Math.max(pad, Math.min(cursor - box.w / 2, tabs.clientWidth - box.w - pad));
      set({ ...box, x });
    });
    tabs.addEventListener("pointerleave", () => rest(false));
    tabs.addEventListener("click", (e) => {
      const b = e.target.closest("button, a");
      if (!b || b.parentElement !== tabs || b.disabled) return;
      pinned = b;
      set(boxOf(b));
      setTimeout(() => { pinned = null; }, 400);
    });
    tabs.addEventListener("focusin", (e) => {
      const b = e.target.closest("button, a");
      if (b?.parentElement === tabs && b.matches(":focus-visible")) set(boxOf(b));
    });
    tabs.addEventListener("focusout", () => { if (!tabs.matches(":hover")) rest(false); });
    new ResizeObserver(() => rest(true)).observe(tabs);
    // Выбор, сменившийся без перерисовки (например, Portfolio / Drafts), тоже двигает подложку.
    new MutationObserver(() => { if (!tabs.matches(":hover")) rest(false); })
      .observe(tabs, { subtree: true, attributes: true, attributeFilter: ["aria-selected", "aria-pressed", "class"] });
  }

  const scan = (root = document) => root.querySelectorAll(".office-feature .tabs, .tabs.admin-city-tabs").forEach(enhance);
  new MutationObserver(() => scan()).observe(document.body, { childList: true, subtree: true });
  scan();
})();
