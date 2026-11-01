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
  let hintDismissed = false;
  let hintObserver = null;

  function installStyles() {
    document.getElementById("productOfferOverlayV2Styles")?.remove();
    const style = document.createElement("style");
    style.id = "productOfferOverlayV2Styles";
    style.textContent = `
      #offerList {
        overflow: visible !important;
      }

      #offerList .product-combo-card {
        width: calc(100% + 36px) !important;
        max-width: none !important;
        margin-left: -18px !important;
        margin-right: -18px !important;
        overflow: visible !important;
      }

      #offerList .product-combo-card__hint {
        position: absolute !important;
        z-index: 90 !important;
        top: calc(100% + 8px) !important;
        right: 0 !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        min-height: 34px !important;
        padding: 7px 8px 7px 11px !important;
        margin: 0 !important;
        border: 0 !important;
        border-radius: 5px !important;
        background: #fff !important;
        color: #111 !important;
        box-shadow: 0 5px 16px rgba(0,0,0,.15), 0 1px 3px rgba(0,0,0,.08) !important;
        opacity: 0;
        transform: translateY(5px);
        transition: opacity 170ms ease, transform 170ms ease;
        pointer-events: none;
        white-space: nowrap;
      }

      #offerList .product-combo-card__hint::before {
        content: "";
        position: absolute;
        top: -7px;
        right: 28px;
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-bottom: 8px solid #fff;
      }

      #offerList .product-combo-card__hint.is-visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
        pointer-events: auto !important;
      }

      #offerList .product-combo-card__hint span {
        font-size: 10px;
        font-weight: 600;
        line-height: 1.2;
      }

      #offerList .product-combo-card__hint button {
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
        font: inherit;
        font-size: 14px;
        line-height: 1;
        cursor: pointer;
      }

      @media (min-width: 721px) {
        #offerList .product-combo-card {
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
      <article class="product-combo-card${selected ? " is-selected" : "}" data-combo-id="${combo.id}" role="button" tabindex="0" aria-pressed="${selected}">
        <span class="product-combo-card__best">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 13 11 22l-9-9V4h9l9 9Z"/><circle cx="7.5" cy="8.5" r="1.5"/></svg>
          Mejor oferta
        </span>

        <aside class="product-combo-card__hint" data-offer-hint aria-live="polite">
          <span>Mirá los detalles de la oferta</span>
          <button type="button" data-offer-hint-close aria-label="Cerrar sugerencia">×</button>
        </aside>

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
    `;
  }

  function revealHint() {
    if (hintDismissed) return;
    const hint = offerList.querySelector("[data-offer-hint]");
    if (hint) hint.classList.add("is-visible");
  }

  function mountHintTrigger() {
    hintObserver?.disconnect();
    hintObserver = null;
    if (hintDismissed) return;

    const card = offerList.querySelector("[data-combo-id]");
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) {
      window.setTimeout(revealHint, 120);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealHint();
      return;
    }

    hintObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      revealHint();
      observer.disconnect();
      hintObserver = null;
    }, { threshold: 0.08 });

    hintObserver.observe(card);
  }

  function render() {
    offerList.innerHTML = cardMarkup();
    mountHintTrigger();
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
    const closeHint = event.target.closest("[data-offer-hint-close]");
    if (closeHint) {
      event.preventDefault();
      event.stopPropagation();
      hintDismissed = true;
      hintObserver?.disconnect();
      hintObserver = null;
      closeHint.closest("[data-offer-hint]")?.remove();
      return;
    }

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
