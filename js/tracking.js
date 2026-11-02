(() => {
  "use strict";

  const drawer = document.getElementById("trackingDrawer");
  const backdrop = document.getElementById("trackingDrawerBackdrop");
  const openButton = document.getElementById("trackingMenuButton");
  const closeButton = document.getElementById("trackingDrawerClose");
  const form = document.getElementById("trackingSearchForm");
  const input = document.getElementById("trackingId");
  const emptyState = document.querySelector(".tracking-empty");
  const helpRow = document.querySelector(".tracking-help-row");
  const illustration = emptyState?.querySelector("img");
  const resultsRoot = document.getElementById("trackingResults");

  const INITIAL_ILLUSTRATION = "./assets/tracking-empty-state-final.png?v=20261102-1305";
  const NOT_FOUND_ILLUSTRATION = "./assets/tracking-no-encontrado.png?v=20261102-1415";
  const LIFECYCLE_ORDER = ["received", "dispatched", "in_transit", "delivered"];

  const DEMO_STEPS = Object.freeze([
    Object.freeze({
      code: "received",
      label: "Recibido",
      subtitle: "Tu pedido ingresó a Logística y está listo para ser preparado."
    }),
    Object.freeze({
      code: "dispatched",
      label: "Despachado",
      subtitle: "El pedido fue despachado y entregado al circuito de distribución."
    }),
    Object.freeze({
      code: "in_transit",
      label: "En tránsito",
      subtitle: "El envío está viajando hacia la dirección de entrega."
    }),
    Object.freeze({
      code: "delivered",
      label: "Entregado",
      subtitle: "El pedido fue entregado en el destino informado."
    })
  ]);

  const FOUND_DEMO = Object.freeze({
    status: "FOUND",
    authorization: Object.freeze({
      mode: "MOCK_DEVELOPMENT_ONLY",
      authorized: true
    }),
    projection: Object.freeze({
      logistics: Object.freeze({
        source: "PROTOCOL_DATA_LOGISTICS_PUBLIC_TRACKING_TARGET",
        updatedAt: "2026-11-02T14:12:00-03:00",
        lifecycleStatus: "dispatched",
        steps: DEMO_STEPS,
        carrierLabel: "Transportista de prueba",
        trackingNumber: "C-1111"
      }),
      customer: Object.freeze({
        source: "AUTHORIZED_POSTPURCHASE_ORDER_PROJECTION_TARGET",
        updatedAt: "2026-11-02T12:48:00-03:00",
        fullName: "Martín González",
        address: "Tucumán 2896, Ciudad Autónoma de Buenos Aires",
        userNote: "Entregar en portería."
      }),
      commerce: Object.freeze({
        source: "AUTHORIZED_COMMERCE_ORDER_SNAPSHOT_TARGET",
        updatedAt: "2026-11-02T11:36:00-03:00",
        currency: "ARS",
        items: Object.freeze([
          Object.freeze({ title: "Campera Core", variant: "Gris · M", quantity: 1, totalAmount: 74990 })
        ]),
        shippingAmount: 0,
        totalAmount: 74990
      }),
      help: Object.freeze({
        source: "AUTHORIZED_ACTION_ELIGIBILITY_TARGET",
        updatedAt: "2026-11-02T14:12:00-03:00",
        actions: Object.freeze([
          Object.freeze({ id: "change_delivery_address", label: "Cambiar mi dirección de entrega" }),
          Object.freeze({ id: "change_products", label: "Cambiar/Agregar productos" }),
          Object.freeze({ id: "report_error", label: "Reportar error" }),
          Object.freeze({ id: "cancel_purchase", label: "Cancelar compra" }),
          Object.freeze({ id: "talk_to_support", label: "Hablar con Soporte" })
        ])
      })
    })
  });

  const MOCK_RESULTS = Object.freeze({
    A1111: Object.freeze({ status: "NOT_FOUND" }),
    B1111: Object.freeze({ status: "NOT_FOUND" }),
    "C-1111": FOUND_DEMO
  });

  const normalizeTrackingId = (value) => String(value ?? "").trim();

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const formatUpdatedAt = (value) => {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return "Actualización no disponible";
    return `Actualizado · ${new Intl.DateTimeFormat("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(date).replace(",", "")}`;
  };

  const formatMoney = (amount, currency = "ARS") => new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(Number(amount) || 0);

  // Stable boundary. Production replaces this adapter with an authorized
  // storefront boundary backed by Protocol Data. UI rendering remains unchanged.
  const mockTrackingLookupAdapter = Object.freeze({
    async lookup(rawTrackingId) {
      const trackingId = normalizeTrackingId(rawTrackingId);
      if (!trackingId) return { status: "EMPTY", trackingId: "" };

      // Comparison is case-insensitive only. Hyphens, slashes, dots and other
      // meaningful characters remain part of the identifier.
      const fixtureKey = trackingId.toUpperCase();
      const fixture = MOCK_RESULTS[fixtureKey];
      if (fixture) {
        return { ...fixture, trackingId, source: "MOCK_DEVELOPMENT_ONLY" };
      }
      return { status: "NOT_FOUND", trackingId, source: "MOCK_DEVELOPMENT_ONLY" };
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

  const cardHeader = (title, updatedAt) => `
    <header class="tracking-result-card__header">
      <h2 class="tracking-result-card__title">${escapeHtml(title)}</h2>
      <span class="tracking-result-card__updated">${escapeHtml(formatUpdatedAt(updatedAt))}</span>
    </header>`;

  const renderTimeline = (logistics) => {
    const currentIndex = LIFECYCLE_ORDER.indexOf(logistics.lifecycleStatus);
    const items = (logistics.steps || []).map((step) => {
      const stepIndex = LIFECYCLE_ORDER.indexOf(step.code);
      const state = stepIndex < currentIndex
        ? "is-complete"
        : stepIndex === currentIndex
          ? "is-current"
          : "is-pending";
      return `
        <li class="tracking-timeline__item ${state}" data-lifecycle-status="${escapeHtml(step.code)}">
          <span class="tracking-timeline__node" aria-hidden="true"></span>
          <p class="tracking-timeline__title">${escapeHtml(step.label)}</p>
          <p class="tracking-timeline__subtitle">${escapeHtml(step.subtitle)}</p>
        </li>`;
    }).join("");

    return `
      <article class="tracking-result-card" data-projection="logistics">
        ${cardHeader("Estado de tu pedido", logistics.updatedAt)}
        <div class="tracking-result-card__body">
          <ol class="tracking-timeline" aria-label="Estados logísticos del pedido">${items}</ol>
        </div>
      </article>`;
  };

  const renderCustomer = (customer) => `
    <article class="tracking-result-card" data-projection="customer">
      ${cardHeader("Datos del cliente", customer.updatedAt)}
      <div class="tracking-result-card__body">
        <dl class="tracking-data-list">
          <div class="tracking-data-item">
            <dt>Nombre y apellido</dt>
            <dd>${escapeHtml(customer.fullName)}</dd>
          </div>
          <div class="tracking-data-item">
            <dt>Domicilio</dt>
            <dd>${escapeHtml(customer.address)}</dd>
          </div>
          <div class="tracking-data-item">
            <dt>Observación de usuario</dt>
            <dd class="is-muted">${escapeHtml(customer.userNote || "Sin observaciones")}</dd>
          </div>
        </dl>
      </div>
    </article>`;

  const renderCommerce = (commerce) => {
    const rows = (commerce.items || []).map((item) => `
      <div class="tracking-order-row">
        <div class="tracking-order-row__label">
          <span>${escapeHtml(item.title)}</span>
          <span class="tracking-order-row__meta">${escapeHtml(item.variant || "")} · Cant. ${escapeHtml(item.quantity)}</span>
        </div>
        <strong class="tracking-order-row__value">${escapeHtml(formatMoney(item.totalAmount, commerce.currency))}</strong>
      </div>`).join("");

    const shipping = Number(commerce.shippingAmount) === 0
      ? "Gratis"
      : formatMoney(commerce.shippingAmount, commerce.currency);

    return `
      <article class="tracking-result-card" data-projection="commerce">
        ${cardHeader("Productos comprados", commerce.updatedAt)}
        <div class="tracking-result-card__body tracking-result-card__body--flush">
          ${rows}
          <div class="tracking-order-row">
            <div class="tracking-order-row__label"><span>Envío</span></div>
            <strong class="tracking-order-row__value">${escapeHtml(shipping)}</strong>
          </div>
          <div class="tracking-order-total">
            <strong>TOTAL</strong>
            <strong>${escapeHtml(formatMoney(commerce.totalAmount, commerce.currency))}</strong>
          </div>
        </div>
      </article>`;
  };

  const renderHelp = (help) => {
    const actions = (help.actions || []).map((action) => `
      <button class="tracking-action" type="button" data-tracking-action="${escapeHtml(action.id)}">
        <span>${escapeHtml(action.label)}</span>
        <span class="tracking-action__chevron" aria-hidden="true">›</span>
      </button>`).join("");

    return `
      <article class="tracking-result-card" data-projection="help">
        ${cardHeader("Ayuda", help.updatedAt)}
        <div class="tracking-result-card__body tracking-result-card__body--flush">
          <div class="tracking-actions">${actions}</div>
        </div>
      </article>`;
  };

  const renderFound = (result) => {
    if (!resultsRoot || !result?.projection) return;
    const { logistics, customer, commerce, help } = result.projection;
    resultsRoot.innerHTML = [
      renderTimeline(logistics),
      renderCustomer(customer),
      renderCommerce(commerce),
      renderHelp(help)
    ].join("");
    resultsRoot.hidden = false;
    resultsRoot.setAttribute("data-tracking-id", result.trackingId || "");
  };

  const renderTrackingState = (result) => {
    const status = result?.status || "ERROR";
    emptyState?.setAttribute("data-tracking-state", status.toLowerCase());

    if (status === "FOUND") {
      if (emptyState) emptyState.hidden = true;
      if (helpRow) helpRow.hidden = true;
      renderFound(result);
      return;
    }

    if (resultsRoot) {
      resultsRoot.hidden = true;
      resultsRoot.innerHTML = "";
    }
    if (emptyState) emptyState.hidden = false;
    if (helpRow) helpRow.hidden = false;
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

  resultsRoot?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tracking-action]");
    if (!button) return;
    const action = button.getAttribute("data-tracking-action");
    window.dispatchEvent(new CustomEvent("indumentary:tracking:action", {
      detail: {
        action,
        trackingId: resultsRoot.getAttribute("data-tracking-id") || "",
        authority: "ACTION_INTENT_ONLY"
      }
    }));
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
      if (resultsRoot) resultsRoot.hidden = true;
      emptyState?.setAttribute("data-tracking-state", "error");
    }
  });
})();
