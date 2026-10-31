(() => {
  "use strict";

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

  const section = document.createElement("section");
  section.id = "productCommercialBody";
  section.className = "product-commercial-body";
  section.dataset.presentationSource = "mock-now__shopify-commerce-later";
  section.dataset.shippingAuthority = "mock-now__protocol-logistics-later";
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
      <button id="commercialDeliveryDetails" type="button" class="product-commercial-body__link">Más detalles y formas de entrega</button>
    </div>

    <div class="product-commercial-body__pickup">
      <p><strong class="is-green">Retirá gratis</strong> a partir del martes en correos y otros puntos</p>
      <p class="product-commercial-body__muted">Tenés un punto de entrega a <strong>450 m</strong></p>
      <button id="commercialMapLink" type="button" class="product-commercial-body__link">Ver en el mapa</button>
    </div>
  `;

  offerSection.insertAdjacentElement("afterend", section);

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

    .product-commercial-body__price-block {
      padding-top: 2px;
    }

    .product-commercial-body__heading-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    /* Internal commercial label: intentionally below page-section hierarchy. */
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
      letter-spacing: 0;
    }

    .product-commercial-body__payment-icons i:first-child { margin-left: 0; }
    .product-commercial-body__payment-icons i:last-child {
      background: #edf4ff;
      color: #2479ff;
    }

    .product-commercial-body__shipping,
    .product-commercial-body__pickup {
      margin-top: 22px;
    }

    .product-commercial-body__shipping p,
    .product-commercial-body__pickup p {
      margin: 0;
      font-size: 15px;
      font-weight: 400;
      line-height: 1.52;
    }

    .product-commercial-body__pickup p + p {
      margin-top: 7px;
    }

    .product-commercial-body .is-green {
      color: #169b62;
      font-weight: 600;
    }

    .product-commercial-body__muted {
      color: #777;
    }

    .product-commercial-body__muted strong {
      color: #222;
      font-weight: 500;
    }

    .product-commercial-body__link {
      display: inline-block;
      margin-top: 3px;
      padding: 0;
      border: 0;
      background: transparent;
      cursor: pointer;
      text-align: left;
    }

    @media (min-width: 721px) {
      .product-commercial-body {
        max-width: 690px;
        margin-right: auto;
        margin-left: auto;
      }
    }
  `;
  document.head.appendChild(style);

  const commercialPrice = section.querySelector("#commercialPrice");
  const commercialOldPrice = section.querySelector("#commercialOldPrice");
  const commercialDiscount = section.querySelector("#commercialDiscount");
  const commercialInstallments = section.querySelector("#commercialInstallments");
  const commercialTaxFree = section.querySelector("#commercialTaxFree");

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

  syncCommercialPricing();

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

  section.querySelector("#commercialDeliveryDetails")?.addEventListener("click", () => {
    document.querySelector("#locationTrigger")?.click();
  });

  section.querySelector("#commercialMapLink")?.addEventListener("click", () => {
    const toast = document.querySelector("#toast");
    if (!toast) return;
    toast.textContent = "Mapa de puntos de entrega reservado para la integración logística.";
    toast.classList.add("is-visible");
    window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  });
})();
