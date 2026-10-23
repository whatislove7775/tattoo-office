/* Сегментированные переключатели (.tabs): белая подложка-«бегунок» переезжает
   под опцию, на которую наведён курсор, и встаёт на неё после клика. Без курсора
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

    // Следует за курсором от опции к опции: подложка всегда целиком под одной
    // опцией (по центру её текста), между опциями не останавливается.
    let hovered = null;
    tabs.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const b = e.target.closest("button, a");
      if (!b || b.parentElement !== tabs || b.disabled || b === hovered) return;
      hovered = b;
      set(boxOf(b));
    });
    tabs.addEventListener("pointerleave", () => { hovered = null; rest(false); });
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
