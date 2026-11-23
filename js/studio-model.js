window.StudioModel = {
  mount(container) {
    const frame = container?.querySelector("iframe");
    if (!frame) return;
    frame.addEventListener("studio-tour-inspection", (event) => {
      container.classList.toggle("is-expanded", event.detail === true);
    });
  },
};
