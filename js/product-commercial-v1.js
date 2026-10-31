(() => {
  "use strict";

  const LOCATION_KEY = "indumentary.sessionLocation.v1";
  const offerSection = document.querySelector(".offer-section");
  const detailSection = document.querySelector(".detail-section");
  const productPrice = document.querySelector("#productPrice");
  const oldPrice = document.querySelector("#oldPrice");

  if (!offerSection || !detailSection || document.querySelector("#productCommercialBody")) return;

  const parseMoney = (text) => {
    const digits = String(text || "").replace(/[^0-9]/g, "");
    return Number(digits || 0);
  };

  const money = (value) => new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value || 0)));

  const readSessionLocation = () => {
    try {
      const raw = sessionStorage.getItem(LOCATION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const saveSessionLocation = ({ postalCode, address, visibleLabel }) => {
    const cleanPostalCode = String(postalCode || "").trim().toUpperCase();
    const cleanAddress = String(address || "").trim();
    const saved = {
      postalCode: cleanPostalCode,
      address: cleanAddress,
      visibleLabel: String(visibleLabel || cleanAddress || `CP ${cleanPostalCode}`).trim(),
      savedAt: new Date().toISOString(),
      source: "storefront-session",
    };

    try {
      sessionStorage.setItem(LOCATION_KEY, JSON.stringify(saved));
    } catch {}

    window.dispatchEvent(new CustomEvent("indumentary:location-change", { detail: saved }));
    return saved;
  };

  const toast = (message) => {
    const el = document.querySelector("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("is-visible");
    window.setTimeout(() => el.classList.remove("is-visible"), 2200);
  };

  const section = document.createElement("section");
  section.id = "productCommercialBody";
  section.className = "product-commercial-body";
  section.dataset.presentationSource = "mock-now__shopify-commerce-later";
  section.dataset.shippingAuthority = "mock-now__protocol-logistics-later";
  section.dataset.locationContext = "storefront-session";
  section.innerHTML = `
    <div class="product-commercial-body__price-block">
      <div class="product-commercial-body__heading-row">
        <h2>Mejor precio</h2>
      </div>
      <div class="product-commercial-body__old-price" id="commercialOldPrice">$ 149.500</div>
      <div class="product-commercial-body__price-row">
        <strong id="commercialPrice">$ 124.900</strong>
        <span id="commercialDiscount" class="product-commercial-body__discount">17% OFF</span>
      </div>
      <p id="commercialInstallments" class="product-commercial-body__installments">6 cuotas de $ 20.817</p>
      <p class="product-commercial-body__tax">Precio sin impuestos nacionales: <span id="commercialTaxFree">$ 103.223</span></p>
    </div>

    <button class="product-commercial-body__payment-link" type="button" aria-label="Ver medios de pago">
      <strong>Medios de pago</strong>
      <span class="product-commercial-body__payment-icons" aria-hidden="true">
        <i>MP</i><i>MC</i><i>VISA</i><i>AX</i><i>Nx</i><i>+5</i>
      </span>
    </button>

    <div class="product-commercial-body__shipping">
      <p><strong class="is-green">Llega gratis</strong> <span id="commercialDeliveryDay">el lunes</span></p>

      <div class="product-commercial-body__address-row">
        <span class="product-commercial-body__address-prefix">Envío a</span>
        <button id="commercialAddressButton" class="product-commercial-body__address-button" type="button" aria-label="Completar dirección de envío">
          <span class="product-commercial-body__address-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"/><circle cx="12" cy="10" r="2.2"/></svg>
          </span>
          <span id="commercialAddressLabel" class="product-commercial-body__address-label">Completar dirección</span>
          <svg class="product-commercial-body__address-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>

    <div class="product-commercial-body__pickup">
      <p><strong class="is-green">Retirá gratis</strong> a partir del martes en correos y otros puntos</p>
      <p class="product-commercial-body__muted">Tenés un punto de entrega a <strong>450 m</strong></p>
      <button id="commercialMapLink" type="button" class="product-commercial-body__link">Ver en el mapa</button>
    </div>
  `;

  offerSection.insertAdjacentElement("afterend", section);

  const deliveryBackdrop = document.createElement("div");
  deliveryBackdrop.id = "deliveryAreaBackdrop";
  deliveryBackdrop.className = "delivery-area-backdrop";
  deliveryBackdrop.hidden = true;
  deliveryBackdrop.dataset.addressProvider = "mock-now__google-places-later";
  deliveryBackdrop.dataset.logisticsAuthority = "mock-now__protocol-data-logistics-later";
  deliveryBackdrop.innerHTML = `
    <section class="delivery-area-sheet" role="dialog" aria-modal="true" aria-labelledby="deliveryAreaTitle">
      <div class="delivery-area-sheet__handle" aria-hidden="true"></div>
      <div class="delivery-area-sheet__top">
        <div>
          <h2 id="deliveryAreaTitle">Entrega en tu zona</h2>
          <p>Completá tu ubicación para agilizar la entrega. Esta superficie quedará conectada a Protocol Data Logistics cuando esté operativo.</p>
        </div>
        <button id="deliveryAreaClose" class="delivery-area-sheet__close" type="button" aria-label="Cerrar">×</button>
      </div>

      <div class="delivery-autocomplete" data-provider="mock-now__google-address-autocomplete-later">
        <label class="delivery-autocomplete__field" for="deliveryPostalCode">
          <span>Código postal</span>
          <div class="delivery-autocomplete__input-shell">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            <input id="deliveryPostalCode" type="text" inputmode="text" autocomplete="postal-code" maxlength="8" placeholder="Ej. 1414" />
            <button id="clearDeliveryPostal" type="button" aria-label="Limpiar código postal">×</button>
          </div>
        </label>
        <div id="deliveryPostalSuggestions" class="delivery-suggestions" hidden></div>

        <label class="delivery-autocomplete__field" for="deliveryStreetAddress">
          <span>Dirección</span>
          <div class="delivery-autocomplete__input-shell">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            <input id="deliveryStreetAddress" type="text" autocomplete="street-address" maxlength="120" placeholder="Calle y altura" />
            <button id="clearDeliveryAddress" type="button" aria-label="Limpiar dirección">×</button>
          </div>
        </label>
        <div id="deliveryAddressSuggestions" class="delivery-suggestions" hidden></div>
        <small class="delivery-autocomplete__note">Vista demo: el autocompletado será reemplazado por Google Places / Address Autocomplete en la integración real.</small>
      </div>

      <article class="delivery-logistics-card" id="deliveryLogisticsCard">
        <div class="delivery-logistics-card__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M3 7h11v10H3Z"/><path d="M14 10h4l3 3v4h-7Z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M1 10h3M1 13h3"/></svg>
        </div>
        <div class="delivery-logistics-card__copy">
          <strong id="deliveryLogisticsHeadline">Calculá la entrega para tu zona</strong>
          <span id="deliveryLogisticsCaption">Los tiempos y tarifas serán resueltos por Protocol Data Logistics.</span>
        </div>
      </article>

      <button id="deliveryChangeAddress" class="delivery-change-address" type="button">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"/><circle cx="12" cy="10" r="2.2"/></svg>
        <span>Cambiar dirección</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
      </button>

      <button id="deliveryMoreDetails" class="delivery-more-details" type="button">Más detalles y formas de entrega</button>
    </section>
  `;
  document.body.appendChild(deliveryBackdrop);

  const style = document.createElement("style");
  style.id = "productCommercialBodyStyles";
  style.textContent = `
    .product-sheet__handle { order: 0; }
    .thumbnail-rail { order: 1; }
    .product-intro { order: 2; }
    .offer-section { order: 3; }
    .product-commercial-body { order: 4; }
    .detail-section { order: 5; }
    .variant-section { order: 6; }
    .seller-section { order: 7; }
    .delivery-section { order: 8; }
    .tabs-section { order: 9; }
    .features-section { order: 10; }
    .description-section { order: 11; }

    .product-commercial-body {
      width: 100%;
      margin: 0 0 36px;
      padding: 0 2px;
      color: #111;
      font-family: "Manrope", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-weight: 400;
    }

    .product-commercial-body__price-block { padding-top: 2px; }

    .product-commercial-body__heading-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .product-commercial-body h2 {
      margin: 0 0 11px;
      font-size: clamp(19px, 4.5vw, 22px);
      font-weight: 500;
      line-height: 1.2;
      letter-spacing: -.022em;
    }

    .product-commercial-body__old-price {
      margin-bottom: 3px;
      color: #929292;
      font-size: 15px;
      font-weight: 400;
      line-height: 1.3;
      text-decoration: line-through;
    }

    .product-commercial-body__price-row {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 9px;
    }

    .product-commercial-body__price-row > strong {
      font-size: clamp(30px, 7vw, 38px);
      font-weight: 600;
      line-height: 1.03;
      letter-spacing: -.035em;
    }

    .product-commercial-body__discount {
      display: inline-flex;
      min-height: 25px;
      align-items: center;
      padding: 0 7px;
      border-radius: 4px;
      background: #169b62;
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      line-height: 1;
    }

    .product-commercial-body__installments {
      margin: 9px 0 0;
      font-size: 15px;
      font-weight: 400;
      line-height: 1.45;
    }

    .product-commercial-body__tax {
      margin: 4px 0 0;
      color: #858585;
      font-size: 12px;
      font-weight: 400;
      line-height: 1.5;
    }

    .product-commercial-body__payment-link {
      display: flex;
      width: 100%;
      align-items: center;
      flex-wrap: wrap;
      gap: 9px;
      margin: 18px 0 0;
      padding: 0;
      border: 0;
      background: transparent;
      text-align: left;
      cursor: pointer;
    }

    .product-commercial-body__payment-link > strong,
    .product-commercial-body__link {
      color: #2479ff;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.35;
    }

    .product-commercial-body__payment-icons {
      display: inline-flex;
      align-items: center;
    }

    .product-commercial-body__payment-icons i {
      display: grid;
      width: 28px;
      height: 28px;
      margin-left: -3px;
      place-items: center;
      border: 1px solid #ddd;
      border-radius: 50%;
      background: #fff;
      color: #444;
      box-shadow: 0 1px 3px rgba(0,0,0,.05);
      font-size: 7px;
      font-style: normal;
      font-weight: 700;
    }

    .product-commercial-body__payment-icons i:first-child { margin-left: 0; }
    .product-commercial-body__payment-icons i:last-child { background: #edf4ff; color: #2479ff; }

    .product-commercial-body__shipping,
    .product-commercial-body__pickup { margin-top: 22px; }

    .product-commercial-body__shipping p,
    .product-commercial-body__pickup p {
      margin: 0;
      font-size: 15px;
      font-weight: 400;
      line-height: 1.52;
    }

    .product-commercial-body__pickup p + p { margin-top: 7px; }
    .product-commercial-body .is-green { color: #169b62; font-weight: 600; }

    .product-commercial-body__address-row {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: center;
      gap: 10px;
      margin-top: 12px;
    }

    .product-commercial-body__address-prefix {
      color: #111;
      font-size: clamp(17px, 4.4vw, 20px);
      font-weight: 600;
      line-height: 1;
      white-space: nowrap;
    }

    .product-commercial-body__address-button {
      display: grid;
      width: 100%;
      min-width: 0;
      min-height: 44px;
      grid-template-columns: 22px minmax(0, 1fr) 18px;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border: 0;
      border-radius: 5px;
      background: #f1f1f1;
      color: #111;
      cursor: pointer;
      text-align: left;
    }

    .product-commercial-body__address-button:active { background: #e8e8e8; }

    .product-commercial-body__address-icon {
      display: grid;
      width: 22px;
      height: 22px;
      place-items: center;
      color: #111;
    }

    .product-commercial-body__address-icon svg,
    .product-commercial-body__address-chevron {
      width: 20px;
      height: 20px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2.1;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .product-commercial-body__address-label {
      min-width: 0;
      overflow: hidden;
      color: #111;
      font-size: 15px;
      font-weight: 500;
      line-height: 1.25;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .product-commercial-body__address-button.is-empty .product-commercial-body__address-label {
      color: #606060;
      font-weight: 400;
    }

    .product-commercial-body__address-chevron { color: #111; }
    .product-commercial-body__muted { color: #777; }
    .product-commercial-body__muted strong { color: #222; font-weight: 500; }

    .product-commercial-body__link {
      display: inline-block;
      margin-top: 6px;
      padding: 0;
      border: 0;
      background: transparent;
      cursor: pointer;
      text-align: left;
    }

    .delivery-area-backdrop {
      position: fixed;
      z-index: 240;
      inset: 0;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      background: rgba(18,18,18,.36);
      opacity: 0;
      transition: opacity 180ms ease;
    }

    .delivery-area-backdrop[hidden] { display: none !important; }
    .delivery-area-backdrop.is-open { opacity: 1; }

    .delivery-area-sheet {
      width: min(100%, 720px);
      max-height: min(92vh, 820px);
      overflow-y: auto;
      padding: 10px 22px calc(24px + env(safe-area-inset-bottom));
      border-radius: 30px 30px 0 0;
      background: #fff;
      color: #111;
      font-family: "Manrope", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      transform: translateY(28px);
      transition: transform 180ms ease;
      box-shadow: 0 -12px 42px rgba(0,0,0,.08);
    }

    .delivery-area-backdrop.is-open .delivery-area-sheet { transform: translateY(0); }

    .delivery-area-sheet__handle {
      width: 46px;
      height: 5px;
      margin: 0 auto 20px;
      border-radius: 999px;
      background: #d4d1cd;
    }

    .delivery-area-sheet__top {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 38px;
      gap: 14px;
      align-items: start;
    }

    .delivery-area-sheet__top h2 {
      margin: 0;
      font-size: clamp(27px, 7vw, 34px);
      font-weight: 600;
      line-height: 1.08;
      letter-spacing: -.035em;
    }

    .delivery-area-sheet__top p {
      margin: 9px 0 0;
      color: #666;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.45;
    }

    .delivery-area-sheet__close {
      display: grid;
      width: 38px;
      height: 38px;
      place-items: center;
      border: 0;
      border-radius: 50%;
      background: #f1eee9;
      color: #444;
      cursor: pointer;
      font-size: 23px;
      line-height: 1;
    }

    .delivery-autocomplete {
      display: grid;
      gap: 10px;
      margin-top: 24px;
    }

    .delivery-autocomplete__field {
      display: grid;
      gap: 6px;
    }

    .delivery-autocomplete__field > span {
      color: #555;
      font-size: 13px;
      font-weight: 500;
    }

    .delivery-autocomplete__input-shell {
      display: grid;
      grid-template-columns: 22px minmax(0, 1fr) 30px;
      align-items: center;
      gap: 9px;
      min-height: 54px;
      padding: 0 11px;
      border: 1px solid #d9d4cf;
      border-radius: 12px;
      background: #fff;
    }

    .delivery-autocomplete__input-shell svg {
      width: 21px;
      height: 21px;
      color: #8b8884;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.9;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .delivery-autocomplete__input-shell input {
      width: 100%;
      min-width: 0;
      border: 0;
      outline: 0;
      background: transparent;
      color: #111;
      font: inherit;
      font-size: 16px;
      font-weight: 400;
    }

    .delivery-autocomplete__input-shell button {
      display: grid;
      width: 28px;
      height: 28px;
      place-items: center;
      border: 0;
      border-radius: 50%;
      background: #ece9e5;
      color: #666;
      cursor: pointer;
      font-size: 17px;
    }

    .delivery-suggestions {
      overflow: hidden;
      margin-top: -4px;
      border: 1px solid #e2ddd7;
      border-radius: 10px;
      background: #fff;
    }

    .delivery-suggestion {
      display: grid;
      width: 100%;
      grid-template-columns: 20px minmax(0, 1fr);
      align-items: center;
      gap: 9px;
      padding: 10px 12px;
      border: 0;
      border-top: 1px solid #eeeae6;
      background: #fff;
      color: #333;
      cursor: pointer;
      text-align: left;
      font-size: 14px;
      font-weight: 400;
    }

    .delivery-suggestion:first-child {
      border-top: 0;
      background: #f3e9df;
    }

    .delivery-suggestion svg {
      width: 18px;
      height: 18px;
      color: #666;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.9;
    }

    .delivery-suggestion strong { font-weight: 600; color: #111; }

    .delivery-autocomplete__note {
      color: #999;
      font-size: 10px;
      font-weight: 400;
      line-height: 1.4;
    }

    .delivery-logistics-card {
      display: grid;
      grid-template-columns: 58px minmax(0, 1fr);
      align-items: center;
      gap: 14px;
      margin-top: 22px;
      padding: 16px;
      border-radius: 16px;
      background: linear-gradient(135deg, #f2f5e9 0%, #f7f0e8 100%);
    }

    .delivery-logistics-card__icon {
      display: grid;
      width: 58px;
      height: 48px;
      place-items: center;
      border-right: 1px solid rgba(0,0,0,.12);
    }

    .delivery-logistics-card__icon svg {
      width: 34px;
      height: 34px;
      fill: none;
      stroke: #111;
      stroke-width: 1.7;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .delivery-logistics-card__copy { min-width: 0; }

    .delivery-logistics-card__copy strong,
    .delivery-logistics-card__copy span { display: block; }

    .delivery-logistics-card__copy strong {
      overflow: hidden;
      color: #111;
      font-size: 15px;
      font-weight: 600;
      line-height: 1.3;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .delivery-logistics-card__copy span {
      margin-top: 4px;
      color: #666;
      font-size: 12px;
      font-weight: 400;
      line-height: 1.4;
    }

    .delivery-change-address {
      display: grid;
      width: 100%;
      min-height: 54px;
      grid-template-columns: 24px minmax(0, 1fr) 20px;
      align-items: center;
      gap: 10px;
      margin-top: 18px;
      padding: 0 14px;
      border: 0;
      border-radius: 12px;
      background: #f3ece5;
      color: #111;
      cursor: pointer;
      text-align: left;
    }

    .delivery-change-address span { font-size: 15px; font-weight: 600; }

    .delivery-change-address svg {
      width: 21px;
      height: 21px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.9;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .delivery-more-details {
      display: block;
      margin: 18px auto 0;
      padding: 0;
      border: 0;
      background: transparent;
      color: #222;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    @media (min-width: 721px) {
      .product-commercial-body { max-width: 690px; margin-right: auto; margin-left: auto; }
      .delivery-area-sheet { margin-bottom: 24px; border-radius: 30px; }
    }
  `;
  document.head.appendChild(style);

  const commercialPrice = section.querySelector("#commercialPrice");
  const commercialOldPrice = section.querySelector("#commercialOldPrice");
  const commercialDiscount = section.querySelector("#commercialDiscount");
  const commercialInstallments = section.querySelector("#commercialInstallments");
  const commercialTaxFree = section.querySelector("#commercialTaxFree");
  const addressButton = section.querySelector("#commercialAddressButton");
  const addressLabel = section.querySelector("#commercialAddressLabel");

  const closeSheetButton = deliveryBackdrop.querySelector("#deliveryAreaClose");
  const postalInput = deliveryBackdrop.querySelector("#deliveryPostalCode");
  const addressInput = deliveryBackdrop.querySelector("#deliveryStreetAddress");
  const postalSuggestions = deliveryBackdrop.querySelector("#deliveryPostalSuggestions");
  const addressSuggestions = deliveryBackdrop.querySelector("#deliveryAddressSuggestions");
  const clearPostal = deliveryBackdrop.querySelector("#clearDeliveryPostal");
  const clearAddress = deliveryBackdrop.querySelector("#clearDeliveryAddress");
  const deliveryHeadline = deliveryBackdrop.querySelector("#deliveryLogisticsHeadline");
  const deliveryCaption = deliveryBackdrop.querySelector("#deliveryLogisticsCaption");
  const changeAddressButton = deliveryBackdrop.querySelector("#deliveryChangeAddress");
  const moreDetailsButton = deliveryBackdrop.querySelector("#deliveryMoreDetails");

  const syncCommercialPricing = () => {
    const current = parseMoney(productPrice?.textContent);
    const compare = parseMoney(oldPrice?.textContent);
    if (!current) return;

    commercialPrice.textContent = money(current);
    commercialOldPrice.textContent = compare > current ? money(compare) : money(Math.round(current * 1.18));

    const comparison = compare > current ? compare : Math.round(current * 1.18);
    const discount = Math.max(0, Math.round((1 - current / comparison) * 100));
    commercialDiscount.textContent = `${discount}% OFF`;
    commercialInstallments.textContent = `6 cuotas de ${money(current / 6)}`;
    commercialTaxFree.textContent = money(current / 1.21);
  };

  const syncAddress = () => {
    const location = readSessionLocation();
    const label = location?.visibleLabel || "Completar dirección";
    addressLabel.textContent = label;
    addressButton.classList.toggle("is-empty", !location);
    addressButton.setAttribute(
      "aria-label",
      location ? `Cambiar dirección de envío. Actual: ${label}` : "Completar dirección de envío"
    );

    if (location) {
      deliveryHeadline.textContent = `Llega gratis / mañana a ${label}`;
      deliveryCaption.textContent = "Estimación visual. Protocol Data Logistics resolverá tiempos y tarifas según zona.";
    } else {
      deliveryHeadline.textContent = "Calculá la entrega para tu zona";
      deliveryCaption.textContent = "Los tiempos y tarifas serán resueltos por Protocol Data Logistics.";
    }
  };

  const prefillSheet = () => {
    const current = readSessionLocation();
    postalInput.value = current?.postalCode || "";
    addressInput.value = current?.address || "";
    postalSuggestions.hidden = true;
    addressSuggestions.hidden = true;
    syncAddress();
  };

  const openDeliverySheet = () => {
    prefillSheet();
    deliveryBackdrop.hidden = false;
    requestAnimationFrame(() => deliveryBackdrop.classList.add("is-open"));
    document.body.classList.add("no-scroll");
  };

  const closeDeliverySheet = () => {
    deliveryBackdrop.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    window.setTimeout(() => {
      if (!deliveryBackdrop.classList.contains("is-open")) deliveryBackdrop.hidden = true;
    }, 190);
  };

  const pinIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z"/><circle cx="12" cy="10" r="2.2"/></svg>`;

  const renderPostalSuggestions = () => {
    const value = postalInput.value.trim().toUpperCase();
    if (!value) {
      postalSuggestions.hidden = true;
      postalSuggestions.innerHTML = "";
      return;
    }

    const base = [
      { postalCode: "1414", label: "1414 – Palermo, Ciudad Autónoma de Buenos Aires" },
      { postalCode: "1609", label: "1609 – Boulogne, Buenos Aires" },
      { postalCode: "1609", label: "1609 – Villa Adelina, Buenos Aires" },
      { postalCode: "1425", label: "1425 – Palermo, Ciudad Autónoma de Buenos Aires" },
    ];

    const matches = base.filter((item) => item.postalCode.includes(value) || item.label.toUpperCase().includes(value)).slice(0, 3);
    const options = matches.length ? matches : (/^(?:\d{4}|[A-Z]\d{4}[A-Z]{3})$/.test(value) ? [{ postalCode: value, label: `${value} – usar este código postal` }] : []);

    postalSuggestions.innerHTML = options.map((item) => `
      <button class="delivery-suggestion" type="button" data-postal-code="${item.postalCode}">
        ${pinIcon}<span><strong>${item.postalCode}</strong>${item.label.replace(item.postalCode, "")}</span>
      </button>
    `).join("");
    postalSuggestions.hidden = options.length === 0;
  };

  const renderAddressSuggestions = () => {
    const value = addressInput.value.trim();
    if (value.length < 2) {
      addressSuggestions.hidden = true;
      addressSuggestions.innerHTML = "";
      return;
    }

    const city = postalInput.value.trim() === "1609" ? "Boulogne, Buenos Aires" : "Ciudad Autónoma de Buenos Aires";
    const alternatives = [
      `${value}, ${city}`,
      `${value}, Ciudad Autónoma de Buenos Aires`,
    ];

    const unique = [...new Set(alternatives)].slice(0, 3);
    addressSuggestions.innerHTML = unique.map((label, index) => `
      <button class="delivery-suggestion" type="button" data-address-value="${label.replace(/"/g, "&quot;")}">
        ${pinIcon}<span>${index === 0 ? `<strong>${value}</strong>${label.slice(value.length)}` : label}</span>
      </button>
    `).join("");
    addressSuggestions.hidden = unique.length === 0;
  };

  const commitLocation = (addressValue = addressInput.value.trim()) => {
    const postalCode = postalInput.value.trim().toUpperCase();
    const cleanAddress = String(addressValue || "").trim();
    if (!/^(?:\d{4}|[A-Z]\d{4}[A-Z]{3})$/.test(postalCode)) {
      toast("Ingresá un código postal válido.");
      return null;
    }
    if (!cleanAddress) {
      toast("Ingresá una dirección.");
      return null;
    }

    const saved = saveSessionLocation({
      postalCode,
      address: cleanAddress,
      visibleLabel: cleanAddress,
    });
    addressInput.value = saved.address;
    postalSuggestions.hidden = true;
    addressSuggestions.hidden = true;
    syncAddress();
    return saved;
  };

  syncCommercialPricing();
  syncAddress();

  if (productPrice) {
    new MutationObserver(syncCommercialPricing).observe(productPrice, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }
  if (oldPrice) {
    new MutationObserver(syncCommercialPricing).observe(oldPrice, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  addressButton?.addEventListener("click", openDeliverySheet);
  window.addEventListener("indumentary:location-change", syncAddress);

  postalInput.addEventListener("input", renderPostalSuggestions);
  addressInput.addEventListener("input", renderAddressSuggestions);

  postalSuggestions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-postal-code]");
    if (!button) return;
    postalInput.value = button.dataset.postalCode;
    postalSuggestions.hidden = true;
    if (addressInput.value.trim()) renderAddressSuggestions();
  });

  addressSuggestions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-address-value]");
    if (!button) return;
    const address = button.dataset.addressValue;
    addressInput.value = address;
    commitLocation(address);
  });

  addressInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    commitLocation();
  });

  clearPostal.addEventListener("click", () => {
    postalInput.value = "";
    postalSuggestions.hidden = true;
  });

  clearAddress.addEventListener("click", () => {
    addressInput.value = "";
    addressSuggestions.hidden = true;
  });

  changeAddressButton.addEventListener("click", () => {
    deliveryBackdrop.querySelector(".delivery-autocomplete")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  moreDetailsButton.addEventListener("click", () => {
    toast("Superficie reservada para tarjetas logísticas de Protocol Data Logistics.");
  });

  closeSheetButton.addEventListener("click", closeDeliverySheet);
  deliveryBackdrop.addEventListener("click", (event) => {
    if (event.target === deliveryBackdrop) closeDeliverySheet();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !deliveryBackdrop.hidden) closeDeliverySheet();
  });

  section.querySelector("#commercialMapLink")?.addEventListener("click", () => {
    toast("Mapa de puntos de entrega reservado para la integración logística.");
  });
})();