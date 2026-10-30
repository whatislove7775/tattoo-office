(() => {
  const notice = document.getElementById("cookieNotice");
  const accept = document.getElementById("cookieAccept");
  const slider = document.getElementById("rentSlider");
  if (!notice || !accept) return;
  const key = "to.cookieConsent";
  const accepted = value => {
    try { return JSON.parse(value)?.accepted === true; } catch { return false; }
  };
  try { if (accepted(localStorage.getItem(key))) return; } catch {}

  let frame = 0;
  function position() {
    frame = 0;
    if (notice.hidden) return;
    let bottom = 0;
    if (matchMedia("(max-width:700px)").matches && slider) {
      const rect = slider.getBoundingClientRect();
      if (rect.width && rect.height && rect.top > notice.offsetHeight + 16 && rect.top < innerHeight && rect.bottom > 0) {
        bottom = innerHeight - rect.top + 14;
      }
    }
    notice.style.setProperty("--cookie-bottom", bottom ? `${bottom}px` : "max(16px, env(safe-area-inset-bottom))");
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(position);
  }
  function dismiss() {
    notice.hidden = true;
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", schedule);
    window.removeEventListener("scroll", schedule, true);
    window.removeEventListener("hashchange", schedule);
    window.removeEventListener("storage", sync);
    observer.disconnect();
  }
  function sync(event) {
    if (event.key === key && accepted(event.newValue)) dismiss();
  }
  const observer = new MutationObserver(schedule);
  observer.observe(document.body, {attributes:true, attributeFilter:["data-page"]});
  if (slider) observer.observe(slider, {attributes:true, attributeFilter:["style", "class"]});
  window.addEventListener("resize", schedule);
  window.addEventListener("scroll", schedule, {capture:true, passive:true});
  window.addEventListener("hashchange", schedule);
  window.addEventListener("storage", sync);
  accept.addEventListener("click", () => {
    try { localStorage.setItem(key, JSON.stringify({accepted:true, acceptedAt:new Date().toISOString()})); } catch {}
    dismiss();
  });
  notice.hidden = false;
  position();
})();
