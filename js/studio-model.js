window.StudioModel = {
  mount(container) {
    if (!container) return;
    const launch = container.querySelector(".studio-tour__launch");
    launch.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const frame = document.createElement("iframe");
      frame.title = "Интерактивная 3D-карта Tattoo Office в Санкт-Петербурге";
      frame.src = launch.href;
      frame.allowFullscreen = true;
      launch.replaceWith(frame);
      container.querySelector(".studio-tour__expand").hidden = false;
      frame.focus();
    });
  },
};
