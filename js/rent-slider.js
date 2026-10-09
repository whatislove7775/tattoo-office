(() => {
  const track = document.getElementById("rentSlider");
  const thumb = document.getElementById("rentSliderThumb");
  if (!track || !thumb) return;
  let progress = 0;
  let pointer = null;
  let origin = 0;
  let starting = 0;
  let complete = false;
  const travel = () => Math.max(1, track.clientWidth - thumb.offsetWidth - 8);
  function setProgress(value) {
    progress = Math.max(0, Math.min(1, value));
    track.style.setProperty("--slide-progress", progress.toFixed(3));
    thumb.style.setProperty("--slide-x", Math.round(travel() * progress) + "px");
    thumb.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    thumb.setAttribute("aria-valuetext", progress >= .85 ? "Отпустите для бронирования" : "Перетащите вправо");
  }
  function reset() {
    complete = false;
    track.classList.remove("is-dragging");
    setProgress(0);
  }
  function finish() {
    if (progress >= .85 && !complete) {
      complete = true;
      setProgress(1);
      window.location.hash = "#/booking";
      window.setTimeout(reset, 400);
    } else reset();
  }
  thumb.addEventListener("pointerdown", event => {
    if (event.button !== 0 || complete) return;
    pointer = event.pointerId;
    origin = event.clientX;
    starting = progress;
    track.classList.add("is-dragging");
    thumb.setPointerCapture(pointer);
    event.preventDefault();
  });
  thumb.addEventListener("pointermove", event => {
    if (pointer !== event.pointerId) return;
    setProgress(starting + (event.clientX - origin) / travel());
  });
  thumb.addEventListener("pointerup", event => {
    if (pointer !== event.pointerId) return;
    pointer = null;
    finish();
  });
  thumb.addEventListener("pointercancel", () => { pointer = null; reset(); });
  thumb.addEventListener("lostpointercapture", () => {
    if (pointer !== null) { pointer = null; reset(); }
  });
  thumb.addEventListener("click", event => event.preventDefault());
  thumb.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") { event.preventDefault(); setProgress(progress + .2); if (progress >= 1) finish(); }
    else if (event.key === "ArrowLeft") { event.preventDefault(); setProgress(progress - .2); }
    else if (event.key === "Home") { event.preventDefault(); reset(); }
    else if (event.key === "End") { event.preventDefault(); setProgress(1); finish(); }
  });
  window.addEventListener("resize", () => setProgress(progress));
  window.addEventListener("hashchange", reset);
  reset();
  const footer = document.querySelector('.site-bottom .foot');
  let dockFrame = 0;
  function dock() {
    dockFrame = 0;
    if (footer) track.style.setProperty('--desktop-foot-height', footer.offsetHeight + 'px');
    if (innerWidth > 900 || document.body.dataset.page !== 'masters' || !footer) {
      track.style.removeProperty('--rent-lift');
      return;
    }
    const bottom = parseFloat(getComputedStyle(track).bottom) || 0;
    const lift = Math.max(0, innerHeight - bottom - footer.getBoundingClientRect().top + 18);
    track.style.setProperty('--rent-lift', lift + 'px');
  }
  function scheduleDock() { if (!dockFrame) dockFrame = requestAnimationFrame(dock); }
  window.addEventListener('scroll', scheduleDock, {passive:true});
  window.addEventListener('resize', scheduleDock);
  window.addEventListener('hashchange', scheduleDock);
  new ResizeObserver(scheduleDock).observe(document.body);
  if (footer) new ResizeObserver(scheduleDock).observe(footer);
  scheduleDock();
})();
