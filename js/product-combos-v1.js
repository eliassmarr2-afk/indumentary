(() => {
  "use strict";

  const offerList = document.getElementById("offerList");
  const purchasePrice = document.getElementById("productPrice");
  const oldPrice = document.getElementById("oldPrice");
  const addToCart = document.getElementById("addToCart");
  const supportPrice = document.getElementById("supportProductPrice");
  const detailBackdrop = document.getElementById("comboDetailBackdrop");
  const detailTitle = document.getElementById("comboDetailTitle");
  const detailImage = document.getElementById("comboDetailImage");
  const detailCopy = document.getElementById("comboDetailCopy");
  const detailItems = document.getElementById("comboDetailItems");
  const detailPrice = document.getElementById("comboDetailPrice");
  const detailCompare = document.getElementById("comboDetailCompare");
  const detailSelect = document.getElementById("comboDetailSelect");
  const detailClose = document.getElementById("comboDetailClose");

  if (!offerList) return;

  const HINT_KEY = "indumentary.offerDetailsHintDismissed.v5";
  const combo = {
    id: "combo-street",
    title: "Combo Street",
    subtitle: "Campera liviana + jogger para usar dentro y fuera del entrenamiento.",
    price: 124900,
    compareAt: 149500,
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=82",
    items: ["Campera Core", "Jogger Active", "Gorra Pace"],
  };

  const money = (value) => new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

  const productBasePrice = purchasePrice?.textContent || "$ 74.990";
  const productBaseCompare = oldPrice?.textContent || "$ 89.990";
  let selected = false;
  let hint = null;

  function hintDismissed() {
    try { return sessionStorage.getItem(HINT_KEY) === "1"; }
    catch { return false; }
  }

  function dismissHint() {
    try { sessionStorage.setItem(HINT_KEY, "1"); } catch {}
    if (hint) hint.remove();
    hint = null;
  }

  function installStyles() {
    document.getElementById("productOfferHardfixV5")?.remove();
    const style = document.createElement("style");
    style.id = "productOfferHardfixV5";
    style.textContent = `
      #offerList {
        position: relative !important;
        overflow: visible !important;
      }

      #offerList .product-combo-card-wrap {
        position: relative !important;
        width: calc(100% + 40px) !important;
        max-width: none !important;
        margin-left: -20px !important;
        margin-right: -20px !important;
        overflow: visible !important;
      }

      #offerList .product-combo-card {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
      }

      .offer-details-callout-v5 {
        position: absolute !important;
        z-index: 10000 !important;
        display: flex !important;
        min-height: 36px !important;
        align-items: center !important;
        gap: 8px !important;
        padding: 8px 9px 8px 12px !important;
        border: 1px solid rgba(0,0,0,.06) !important;
        border-radius: 5px !important;
        background: #fff !important;
        color: #111 !important;
        box-shadow: 0 7px 18px rgba(0,0,0,.16), 0 2px 5px rgba(0,0,0,.08) !important;
        font-family: "Manrope", system-ui, sans-serif !important;
        white-space: nowrap !important;
      }

      .offer-details-callout-v5::before {
        content: "";
        position: absolute;
        top: -7px;
        right: 32px;
        width: 13px;
        height: 13px;
        border-top: 1px solid rgba(0,0,0,.06);
        border-left: 1px solid rgba(0,0,0,.06);
        background: #fff;
        transform: rotate(45deg);
      }

      .offer-details-callout-v5 span {
        position: relative;
        z-index: 1;
        font-size: 10px;
        font-weight: 600;
        line-height: 1.2;
      }

      .offer-details-callout-v5 button {
        position: relative;
        z-index: 1;
        display: grid;
        width: 20px;
        height: 20px;
        flex: 0 0 20px;
        place-items: center;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: #f1efec;
        color: #666;
        cursor: pointer;
        font-family: inherit;
        font-size: 14px;
        line-height: 1;
      }

      @media (min-width: 721px) {
        #offerList .product-combo-card-wrap {
          width: 100% !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function cardMarkup() {
    return `
      <div class="product-combo-card-wrap">
        <article class="product-combo-card${selected ? " is-selected" : "}" data-combo-id="${combo.id}" role="button" tabindex="0" aria-pressed="${selected}">
          <span class="product-combo-card__best">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 13 11 22l-9-9V4h9l9 9Z"/><circle cx="7.5" cy="8.5" r="1.5"/></svg>
            Mejor oferta
          </span>
          <div class="product-combo-card__media">
            <img src="${combo.image}" alt="${combo.title}" loading="lazy" />
          </div>
          <div class="product-combo-card__content">
            <h3>${combo.title}</h3>
            <p>${combo.subtitle}</p>
            <div class="stars" aria-label="5 de 5 estrellas">★★★★★</div>
            <div class="product-combo-card__price-row">
              <strong class="product-combo-card__price">${money(combo.price)}</strong>
              <span class="product-combo-card__compare">${money(combo.compareAt)}</span>
            </div>
            <button class="product-combo-card__details" type="button" data-combo-details>
              Ver detalles
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </article>
      </div>
    `;
  }

  function positionHint() {
    if (!hint || hintDismissed()) return;
    const card = offerList.querySelector(".product-combo-card");
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = hint.offsetWidth || 190;
    const viewportLeft = Math.max(8, rect.right - width);

    hint.style.left = `${Math.round(window.scrollX + viewportLeft)}px`;
    hint.style.top = `${Math.round(window.scrollY + rect.bottom + 9)}px`;
  }

  function mountHint() {
    document.querySelectorAll(".product-offer-hint-portal, .offer-details-callout-v5").forEach((node) => node.remove());
    hint = null;
    if (hintDismissed()) return;

    hint = document.createElement("aside");
    hint.className = "offer-details-callout-v5";
    hint.innerHTML = `
      <span>Mirá los detalles de la oferta</span>
      <button type="button" aria-label="Cerrar sugerencia">×</button>
    `;
    hint.querySelector("button")?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      dismissHint();
    });
    document.body.appendChild(hint);

    requestAnimationFrame(() => {
      positionHint();
      requestAnimationFrame(positionHint);
    });
  }

  function render() {
    offerList.innerHTML = cardMarkup();
    mountHint();
  }

  function updatePurchaseState() {
    if (selected) {
      if (purchasePrice) purchasePrice.textContent = money(combo.price);
      if (oldPrice) {
        oldPrice.textContent = money(combo.compareAt);
        oldPrice.hidden = false;
      }
      if (supportPrice) supportPrice.textContent = money(combo.price);
      if (addToCart) addToCart.textContent = "Agregar combo";
    } else {
      if (purchasePrice) purchasePrice.textContent = productBasePrice;
      if (oldPrice) {
        oldPrice.textContent = productBaseCompare;
        oldPrice.hidden = false;
      }
      if (supportPrice) supportPrice.textContent = productBasePrice;
      if (addToCart) addToCart.textContent = "Comprar ahora";
    }
  }

  function toggleSelection(forceSelected = null) {
    selected = forceSelected === null ? !selected : Boolean(forceSelected);
    render();
    updatePurchaseState();
  }

  function openDetails() {
    if (!detailBackdrop) return;
    if (detailTitle) detailTitle.textContent = combo.title;
    if (detailImage) {
      detailImage.src = combo.image;
      detailImage.alt = combo.title;
    }
    if (detailCopy) detailCopy.textContent = combo.subtitle;
    if (detailItems) detailItems.innerHTML = combo.items.map((item) => `<li>${item}</li>`).join("");
    if (detailPrice) detailPrice.textContent = money(combo.price);
    if (detailCompare) detailCompare.textContent = money(combo.compareAt);
    if (detailSelect) {
      detailSelect.textContent = selected ? "Oferta seleccionada" : "Seleccionar oferta";
      detailSelect.classList.toggle("is-selected", selected);
    }
    detailBackdrop.hidden = false;
    requestAnimationFrame(() => detailBackdrop.classList.add("is-open"));
    document.body.classList.add("no-scroll");
  }

  function closeDetails() {
    if (!detailBackdrop) return;
    detailBackdrop.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    setTimeout(() => {
      if (!detailBackdrop.classList.contains("is-open")) detailBackdrop.hidden = true;
    }, 190);
  }

  function storeComboInCart() {
    try {
      const cartKey = "indumentary.cart.v3";
      const current = JSON.parse(sessionStorage.getItem(cartKey) || "[]");
      current.push({
        type: "commercial_offer_mock",
        offerId: combo.id,
        productSetId: `mock-product-set:${combo.id}`,
        title: combo.title,
        price: combo.price,
        quantity: 1,
        source: "product_combo_card",
      });
      sessionStorage.setItem(cartKey, JSON.stringify(current));
      window.dispatchEvent(new CustomEvent("indumentary:cart-change"));
    } catch {}
  }

  offerList.addEventListener("click", (event) => {
    if (event.target.closest("[data-combo-details]")) {
      event.preventDefault();
      event.stopPropagation();
      openDetails();
      return;
    }

    if (event.target.closest("[data-combo-id]")) {
      event.preventDefault();
      event.stopPropagation();
      toggleSelection();
    }
  }, true);

  offerList.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key)) return;
    if (!event.target.closest("[data-combo-id]")) return;
    event.preventDefault();
    toggleSelection();
  });

  detailSelect?.addEventListener("click", () => {
    toggleSelection(true);
    detailSelect.textContent = "Oferta seleccionada";
    detailSelect.classList.add("is-selected");
  });
  detailClose?.addEventListener("click", closeDetails);
  detailBackdrop?.addEventListener("click", (event) => {
    if (event.target === detailBackdrop) closeDetails();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && detailBackdrop && !detailBackdrop.hidden) closeDetails();
  });
  window.addEventListener("resize", () => requestAnimationFrame(positionHint));

  addToCart?.addEventListener("click", (event) => {
    if (!selected) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    storeComboInCart();
  }, true);

  installStyles();
  render();
  updatePurchaseState();
})();
