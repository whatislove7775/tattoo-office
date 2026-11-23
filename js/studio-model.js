window.StudioModel = {
  mount(container) {
    const toggle = container?.querySelector(".studio-tour__expand");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      const expanded = container.classList.toggle("is-expanded");
      toggle.setAttribute("aria-pressed", String(expanded));
      toggle.textContent = expanded ? "↙ Свернуть" : "↗ Расширить";
    });
  },
};
