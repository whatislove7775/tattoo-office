(() => {
  const track = document.getElementById("rentSlider");
  const thumb = document.getElementById("rentSliderThumb");
  if (!track || !thumb) return;
  const mobileLayout = () => window.isMobileLayout ? window.isMobileLayout() : innerWidth <= 700;
  let progress = 0;
  let pointer = null;
  let touch = null;
  let origin = 0;
  let originY = 0;
  let horizontal = false;
  let starting = 0;
  let complete = false;
  let suppressClickUntil = 0;
  const travel = () => Math.max(1, track.clientWidth - thumb.offsetWidth - 8);
  function setProgress(value) {
    progress = Math.max(0, Math.min(1, value));
    track.style.setProperty("--slide-progress", progress.toFixed(3));
    thumb.style.setProperty("--slide-x", (travel() * progress).toFixed(2) + "px");
    thumb.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    thumb.setAttribute("aria-valuetext", progress >= .85 ? "Отпустите для бронирования" : "Перетащите вправо");
  }
  function reset() {
    pointer = null;
    touch = null;
    horizontal = false;
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
  // Touch Events let us accept diagonal drags before native scrolling claims the gesture.
  track.addEventListener("touchstart", event => {
    if (complete) return;
    if (event.touches.length !== 1) { touch = null; reset(); return; }
    const point = event.touches[0];
    touch = { id: point.identifier, x: point.clientX, y: point.clientY, axis: "pending", starting: progress };
  }, { passive: true });
  track.addEventListener("touchmove", event => {
    if (!touch) return;
    if (event.touches.length !== 1) { touch = null; reset(); return; }
    const point = [...event.touches].find(point => point.identifier === touch.id);
    if (!point) return;
    const dx = point.clientX - touch.x, dy = point.clientY - touch.y;
    if (touch.axis === "pending") {
      if (dx >= 4 && Math.abs(dy) <= dx * 3) touch.axis = "slide";
      else if (Math.abs(dy) >= 8 && Math.abs(dy) > Math.max(dx, 0) * 3) { touch = null; reset(); return; }
      else return;
    }
    if (!event.cancelable) { touch = null; reset(); return; }
    event.preventDefault();
    track.classList.add("is-dragging");
    setProgress(touch.starting + dx / (travel() * .7));
  }, { passive: false });
  track.addEventListener("touchend", event => {
    if (!touch) return;
    const point = [...event.changedTouches].find(point => point.identifier === touch.id);
    if (!point) return;
    const gesture = touch;
    touch = null;
    if (gesture.axis !== "slide" || event.touches.length) { reset(); return; }
    if (event.cancelable) event.preventDefault();
    setProgress(gesture.starting + (point.clientX - gesture.x) / (travel() * .7));
    suppressClickUntil = Date.now() + 500;
    finish();
  }, { passive: false });
  track.addEventListener("touchcancel", () => { touch = null; reset(); }, { passive: true });
  track.addEventListener("pointerdown", event => {
    if (event.pointerType === "touch" || event.button !== 0 || complete) return;
    pointer = event.pointerId;
    origin = event.clientX;
    originY = event.clientY;
    starting = progress;
    horizontal = event.pointerType === "mouse";
    if (horizontal) {
      track.classList.add("is-dragging");
      track.setPointerCapture(pointer);
      event.preventDefault();
    }
  });
  track.addEventListener("pointermove", event => {
    if (pointer !== event.pointerId) return;
    if (!horizontal) {
      const dx = event.clientX - origin, dy = event.clientY - originY;
      if (Math.abs(dy) > 8 && Math.abs(dy) >= Math.abs(dx)) { pointer = null; reset(); return; }
      if (Math.abs(dx) < 8) return;
      horizontal = true;
      track.classList.add("is-dragging");
      track.setPointerCapture(pointer);
    }
    setProgress(starting + (event.clientX - origin) / travel());
    if (event.pointerType === "mouse" && progress >= .85) {
      const captured = pointer;
      pointer = null;
      suppressClickUntil = Date.now() + 500;
      if (track.hasPointerCapture(captured)) track.releasePointerCapture(captured);
      finish();
    }
  });
  track.addEventListener("pointerup", event => {
    if (pointer !== event.pointerId) return;
    if (!horizontal) { pointer = null; reset(); return; }
    setProgress(starting + (event.clientX - origin) / travel());
    pointer = null;
    if (progress > .05) suppressClickUntil = Date.now() + 500;
    finish();
  });
  track.addEventListener("pointercancel", event => { if (event.pointerType === "touch") return; pointer = null; reset(); });
  track.addEventListener("lostpointercapture", event => {
    // Touch starts with implicit capture on the thumb; transferring it is not cancellation.
    if (event.target === track && event.pointerId === pointer && pointer !== null) { pointer = null; reset(); }
  });
  track.addEventListener("dragstart", event => event.preventDefault());
  thumb.addEventListener("click", event => event.preventDefault());
  // A mouse click is an equivalent desktop action; dragging remains available.
  track.addEventListener("click", () => {
    if (!mobileLayout() && Date.now() > suppressClickUntil && !complete) window.location.hash = "#/booking";
  });
  thumb.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setProgress(1); finish(); }
    else if (event.key === "ArrowRight") { event.preventDefault(); setProgress(progress + .2); if (progress >= 1) finish(); }
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
    if (!mobileLayout() || document.body.dataset.page !== 'masters' || !footer) {
      track.style.removeProperty('--rent-lift');
      return;
    }
    const bottom = parseFloat(getComputedStyle(track).bottom) || 0;
    const lift = Math.max(0, innerHeight - bottom - footer.getBoundingClientRect().top + 18);
    track.style.setProperty('--rent-lift', lift + 'px');
  }
  function scheduleDock() { if (!dockFrame) dockFrame = requestAnimationFrame(dock); }
  window.addEventListener('scroll', scheduleDock, {passive:true});
  document.getElementById('pageScroller')?.addEventListener('scroll', scheduleDock, {passive:true});
  window.addEventListener('resize', scheduleDock);
  window.addEventListener('hashchange', scheduleDock);
  new ResizeObserver(scheduleDock).observe(document.body);
  if (footer) new ResizeObserver(scheduleDock).observe(footer);
  scheduleDock();
})();
