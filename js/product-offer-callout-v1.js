(() => {
  "use strict";

  const section = document.querySelector(".offer-section");
  const callout = document.getElementById("offerDetailsCallout");
  const close = document.getElementById("offerDetailsCalloutClose");

  if (!section || !callout) return;

  const DISMISSED_KEY = "indumentary.offerDetailsCalloutDismissed.v1";

  const isDismissed = () => {
    try { return sessionStorage.getItem(DISMISSED_KEY) === "1"; }
    catch { return false; }
  };

  const dismiss = () => {
    try { sessionStorage.setItem(DISMISSED_KEY, "1"); } catch {}
    callout.classList.remove("is-visible");
    callout.hidden = true;
  };

  if (isDismissed()) {
    callout.hidden = true;
    return;
  }

  callout.hidden = false;

  const observer = new IntersectionObserver((entries) => {
    if (isDismissed()) return;
    const visible = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.2);
    callout.classList.toggle("is-visible", visible);
  }, {
    threshold: [0, 0.2, 0.5],
  });

  observer.observe(section);

  close?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dismiss();
    observer.disconnect();
  });
})();
