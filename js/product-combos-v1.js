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

  const OFFER_HINT_DISMISSED_KEY = "indumentary.offerDetailsHintDismissed.v4";

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
  let hintRevealTimer = null;
  let hintFrame = null;

  const isHintDismissed = () => {
    try {
      return sessionStorage.getItem(OFFER_HINT_DISMISSED_KEY) === "1";
    } catch {
      return false;
    }
  };

  const dismissHintForSession = () => {
    try {
      sessionStorage.setItem(OFFER_HINT_DISMISSED_KEY, "1");
    } catch {}
  };

  function installStyles() {
    document.getElementById("productOfferOverlayV4Styles")?.remove();
    const style = document.createElement("style");
    style.id = "productOfferOverlayV4Styles";
    style.textContent = `
      #offerList {
        overflow: visible !important;
      }

      #offerList .product-combo-card-wrap {
        position: relative !important;
        width: calc(100% + 36px) !important;
        margin-left: -18px !important;
        margin-right: -18px !important;
        overflow: visible !important;
      }

      #offerList .product-combo-card {
        display: grid !important;
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        overflow: visible !important;
      }

      .product-offer-hint-portal {
        position: fixed !important;
        z-index: 9999 !important;
        display: flex;
        min-height: 36px;
        align-items: center;
        gap: 8px;
        padding: 7px 8px 7px 11px;
        margin: 0;
        border: 1px solid rgba(17,17,17,.05);
        border-radius: 5px;
        background: #fff;
        color: #111;
        box-shadow: 0 6px 18px rgba(0,0,0,.16), 0 1px 3px rgba(0,0,0,.08);
        opacity: 0;
        transform: translateY(5px);
        transition: opacity 170ms ease, transform 170ms ease;
        pointer-events: none;
        white-space: nowrap;
      }

      .product-offer-hint-portal[hidden] {
        display: none !important;
      }

      .product-offer-hint-portal::before {
        content: "";
        position: absolute;
        top: -8px;
        right: 30px;
        width: 14px;
        height: 14px;
        border-top: 1px solid rgba(17,17,17,.05);
        border-left: 1px solid rgba(17,17,17,.05);
        background: #fff;
        transform: rotate(45deg);
      }

      .product-offer-hint-portal.is-visible {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      .product-offer-hint-portal > span {
        position: relative;
        z-index: 1;
        font-size: 10px;
        font-weight: 600;
        line-height: 1.2;
      }

      .product-offer-hint-portal button {
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
        font-weight: 500;
        line-height: 1;
      }

      @media (min-width: 721px) {
        #offerList .product-combo-card-wrap {
          width: 100% !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }

        .product-offer-hint-portal > span {
          font-size: 11px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function cardMarkup() {
    return `
      <div class="product-combo-card-wrap" data-offer-wrap>
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

  function ensureHintPortal() {
    if (hint?.isConnected) return hint;
    hint = document.createElement("aside");
    hint.className = "product-offer-hint-portal";
    hint.hidden = true;
    hint.setAttribute("aria-live", "polite");
    hint.innerHTML = `
      <span>Mirá los detalles de la oferta</span>
      <button type="button" aria-label="Cerrar sugerencia">×</button>
    `;
    hint.querySelector("button")?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      dismissHintForSession();
      hideHint();
    });
    document.body.appendChild(hint);
    return hint;
  }

  function hideHint() {
    if (hintRevealTimer) {
      window.clearTimeout(hintRevealTimer);
      hintRevealTimer = null;
    }
    if (!hint) return;
    hint.classList.remove("is-visible");
    hint.hidden = true;
  }

  function positionHint() {
    hintFrame = null;
    if (isHintDismissed()) {
      hideHint();
      return;
    }

    const card = offerList.querySelector("[data-combo-id]");
    if (!card) {
      hideHint();
      return;
    }

    const rect = card.getBoundingClientRect();
    const cardVisible = rect.bottom > 0 && rect.top < window.innerHeight;
    if (!cardVisible) {
      hideHint();
      return;
    }

    const portal = ensureHintPortal();
    portal.hidden = false;
    portal.style.visibility = "hidden";
    portal.classList.add("is-visible");

    const hintWidth = portal.offsetWidth;
    const left = Math.min(
      window.innerWidth - hintWidth - 10,
      Math.max(10, rect.right - hintWidth - 2)
    );
    const top = rect.bottom + 8;

    portal.style.left = `${Math.round(left)}px`;
    portal.style.top = `${Math.round(top)}px`;
    portal.style.visibility = "visible";
  }

  function scheduleHintPosition() {
    if (hintFrame) return;
    hintFrame = window.requestAnimationFrame(positionHint);
  }

  function armHint() {
    if (isHintDismissed()) return;
    if (hintRevealTimer) window.clearTimeout(hintRevealTimer);
    hintRevealTimer = window.setTimeout(() => {
      hintRevealTimer = null;
      scheduleHintPosition();
    }, 120);
  }

  function render() {
    offerList.innerHTML = cardMarkup();
    armHint();
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
    scheduleHintPosition();
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
    hideHint();
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
      armHint();
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

  window.addEventListener("scroll", scheduleHintPosition, { passive: true });
  window.addEventListener("resize", scheduleHintPosition);

  addToCart?.addEventListener("click", (event) => {
    if (!selected) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    storeComboInCart();
  }, true);

  installStyles();
  ensureHintPortal();
  render();
  updatePurchaseState();
})();