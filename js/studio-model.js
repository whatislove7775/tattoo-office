window.StudioModel = {
  mount(container) {
    const frame = container?.querySelector("iframe");
    const section = container?.closest(".window");
    const stage = section?.closest(".stage__inner");
    if (!frame || !section || !stage) return;

    const mobile = matchMedia("(max-width:700px)");
    const header = document.querySelector(".header");
    const logo = header?.querySelector(".brand");
    let previousScroll;
    let headerObserver;

    function alignBelowHeader() {
      if (!section.isConnected) {
        headerObserver?.disconnect();
        return;
      }
      if (!mobile.matches) return;
      const headerBottom = Math.max(
        header?.getBoundingClientRect().bottom ?? 0,
        logo?.getBoundingClientRect().bottom ?? 0,
      );
      const contentTop = stage.getBoundingClientRect().top;
      const top = Math.max(contentTop, Math.ceil(headerBottom) + 8);
      stage.style.setProperty("--inspection-mobile-top", `${top}px`);
      stage.style.setProperty("--inspection-mobile-gap", `${top - contentTop}px`);
    }
    frame.addEventListener("studio-tour-inspection", (event) => {
      if (event.detail === true) {
        if (previousScroll) return;
        previousScroll = { page: window.scrollY, stage: stage.scrollTop };
        section.classList.add("is-studio-inspection");
        stage.scrollTop = 0;
        if (mobile.matches) {
          window.scrollTo({ top: 0, behavior: "instant" });
          alignBelowHeader();
        } else {
          section.scrollIntoView({ block: "start", behavior: "instant" });
        }
        if (header) {
          headerObserver = new ResizeObserver(alignBelowHeader);
          headerObserver.observe(header);
          if (logo) headerObserver.observe(logo);
        }
      } else if (previousScroll) {
        headerObserver?.disconnect();
        stage.style.removeProperty("--inspection-mobile-top");
        stage.style.removeProperty("--inspection-mobile-gap");
        section.classList.remove("is-studio-inspection");
        stage.scrollTop = previousScroll.stage;
        window.scrollTo({ top: previousScroll.page, behavior: "instant" });
        previousScroll = null;
      }
    });
  },
};
