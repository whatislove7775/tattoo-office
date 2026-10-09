/* Give every dossier a real, contextual back control like a classic iOS stack. */
(() => {
  const labels = {
    admin: ["cabinet", "Личный кабинет"],
    cabinet: ["masters", "Мастера"],
    master: ["masters", "Мастера"],
    interior: ["masters", "Мастера"],
    find: ["masters", "Мастера"],
    safety: ["masters", "Мастера"],
    archive: ["masters", "Мастера"],
    feedback: ["masters", "Мастера"],
    booking: ["interior", "Интерьер"],
    login: ["masters", "Мастера"],
    signup: ["masters", "Мастера"]
  };
  let pending = false;
  function enhance() {
    pending = false;
    const route = (location.hash || "#/masters").split("/")[1] || "masters";
    const entry = labels[route];
    if (!entry) return;
    document.querySelectorAll(".office-feature .window-head").forEach(head => {
      if (head.querySelector(".back,.ios-back")) return;
      const link = document.createElement("a");
      link.className = "ios-back";
      link.href = "#/" + entry[0];
      link.setAttribute("aria-label", "Назад: " + entry[1]);
      link.innerHTML = '<svg class="ui-icon" aria-hidden="true"><use href="#ui-chevron-left"></use></svg><span>' + entry[1] + '</span>';
      head.prepend(link);
    });
  }
  const observer = new MutationObserver(() => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(enhance);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener("hashchange", enhance);
  enhance();
})();
