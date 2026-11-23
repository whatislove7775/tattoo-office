window.StudioModel = {
  mount(container) {
    const frame = container?.querySelector("iframe");
    const section = container?.closest(".window");
    const stage = section?.closest(".stage__inner");
    if (!frame || !section || !stage) return;

    let previousScroll;
    frame.addEventListener("studio-tour-inspection", (event) => {
      if (event.detail === true) {
        if (previousScroll) return;
        previousScroll = { page: window.scrollY, stage: stage.scrollTop };
        section.classList.add("is-studio-inspection");
        stage.scrollTop = 0;
        section.scrollIntoView({ block: "start", behavior: "instant" });
      } else if (previousScroll) {
        section.classList.remove("is-studio-inspection");
        stage.scrollTop = previousScroll.stage;
        window.scrollTo({ top: previousScroll.page, behavior: "instant" });
        previousScroll = null;
      }
    });
  },
};
