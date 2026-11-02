(() => {
  "use strict";

  const drawer = document.getElementById("trackingDrawer");
  const backdrop = document.getElementById("trackingDrawerBackdrop");
  const openButton = document.getElementById("trackingMenuButton");
  const closeButton = document.getElementById("trackingDrawerClose");
  const form = document.getElementById("trackingSearchForm");
  const input = document.getElementById("trackingId");
  const emptyState = document.querySelector(".tracking-empty");
  const illustration = emptyState?.querySelector("img");

  const INITIAL_ILLUSTRATION = "./assets/tracking-empty-state-final.png?v=20261102-1305";
  const NOT_FOUND_ILLUSTRATION = "./assets/tracking-no-encontrado.png?v=20261102-1415";

  const MOCK_RESULTS = Object.freeze({
    A1111: Object.freeze({ status: "NOT_FOUND" }),
    B1111: Object.freeze({ status: "NOT_FOUND" })
  });

  const normalizeTrackingId = (value) => String(value ?? "").trim();

  // Stable lookup boundary for the Tracking Surface.
  // A future Protocol Data Logistics adapter only needs to expose:
  //   lookup(trackingId) -> Promise<{ status, trackingId, data? }>
  // The UI does not need to know whether the result came from a mock,
  // Protocol Data, or another authorized transport layer.
  const mockTrackingLookupAdapter = Object.freeze({
    async lookup(rawTrackingId) {
      const trackingId = normalizeTrackingId(rawTrackingId);

      if (!trackingId) {
        return { status: "EMPTY", trackingId: "" };
      }

      // Mock comparisons are case-insensitive but intentionally preserve
      // punctuation such as hyphens, dots and slashes in the real ID value.
      const fixtureKey = trackingId.toUpperCase();
      const fixture = MOCK_RESULTS[fixtureKey];

      if (fixture) {
        return { ...fixture, trackingId, source: "MOCK_DEVELOPMENT_ONLY" };
      }

      // There is intentionally no FOUND fixture yet. Any ID that is not in the
      // temporary mock dataset behaves like a database miss for this phase.
      return {
        status: "NOT_FOUND",
        trackingId,
        source: "MOCK_DEVELOPMENT_ONLY"
      };
    }
  });

  const injectedAdapter = window.IND_TRACKING_LOOKUP_ADAPTER;
  const trackingLookupAdapter =
    injectedAdapter && typeof injectedAdapter.lookup === "function"
      ? injectedAdapter
      : mockTrackingLookupAdapter;

  const setDrawer = (open) => {
    drawer?.classList.toggle("is-open", open);
    backdrop?.classList.toggle("is-open", open);
    drawer?.setAttribute("aria-hidden", String(!open));
    openButton?.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };

  const renderTrackingState = (result) => {
    const status = result?.status || "ERROR";
    emptyState?.setAttribute("data-tracking-state", status.toLowerCase());

    if (!illustration) return;

    if (status === "NOT_FOUND") {
      illustration.src = NOT_FOUND_ILLUSTRATION;
      illustration.alt = "Ilustración que indica que no se encontró el ID de seguimiento buscado";
      return;
    }

    if (status === "EMPTY") {
      illustration.src = INITIAL_ILLUSTRATION;
      illustration.alt = "Ilustración de una persona buscando información de seguimiento con binoculares";
    }
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

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const trackingId = normalizeTrackingId(input?.value);
    if (!trackingId) {
      input?.setAttribute("aria-invalid", "true");
      renderTrackingState({ status: "EMPTY", trackingId: "" });
      return;
    }

    input?.removeAttribute("aria-invalid");

    try {
      const result = await trackingLookupAdapter.lookup(trackingId);
      renderTrackingState(result);
    } catch (error) {
      console.error("[IND Tracking] lookup failed", error);
      emptyState?.setAttribute("data-tracking-state", "error");
    }
  });
})();
