(() => {
  "use strict";

  const drawer = document.getElementById("trackingDrawer");
  const backdrop = document.getElementById("trackingDrawerBackdrop");
  const openButton = document.getElementById("trackingMenuButton");
  const closeButton = document.getElementById("trackingDrawerClose");
  const form = document.getElementById("trackingSearchForm");

  const setDrawer = (open) => {
    drawer?.classList.toggle("is-open", open);
    backdrop?.classList.toggle("is-open", open);
    drawer?.setAttribute("aria-hidden", String(!open));
    openButton?.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };

  openButton?.addEventListener("click", () => setDrawer(true));
  closeButton?.addEventListener("click", () => setDrawer(false));
  backdrop?.addEventListener("click", () => setDrawer(false));

  document.querySelectorAll("[data-tracking-submenu]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const target = document.getElementById(toggle.getAttribute("aria-controls"));
      const open = !target?.classList.contains("is-open");
      target?.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && drawer?.classList.contains("is-open")) setDrawer(false);
  });

  // Empty-state phase only. Search result / authorization flow is intentionally
  // deferred until the Tracking Surface result-state contract is agreed.
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
  });
})();
