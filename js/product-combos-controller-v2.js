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

  /*
    Legacy CSS kept only the second static offer visible because the original
    mock contained three cards. The V2 controller owns exactly ONE card.
    The hidden sentinel preserves compatibility with that historical selector,
    while the explicit inline !important below guarantees visibility even if
    that CSS remains cached in the browser.
  */
  offerList.innerHTML = `
    <span hidden aria-hidden="true" data-offer-legacy-sentinel></span>
    <article class="product-combo-card" data-combo-id="${combo.id}" role="button" tabindex="0" aria-pressed="false">
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
  `;

  const card = offerList.querySelector(".product-combo-card");
  const detailsButton = offerList.querySelector("[data-combo-details]");

  /* Runtime guard against the legacy nth-child visibility rule. */
  card?.style.setProperty("display", "grid", "important");

  const updatePurchaseState = () => {
    card?.classList.toggle("is-selected", selected);
    card?.setAttribute("aria-pressed", String(selected));

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
  };

  const setSelected = (value) => {
    selected = Boolean(value);
    updatePurchaseState();
  };

  const toggleSelected = () => setSelected(!selected);

  const openDetails = () => {
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
  };

  const closeDetails = () => {
    if (!detailBackdrop) return;
    detailBackdrop.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    window.setTimeout(() => {
      if (!detailBackdrop.classList.contains("is-open")) detailBackdrop.hidden = true;
    }, 190);
  };

  const storeComboInCart = () => {
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
  };

  card?.addEventListener("click", (event) => {
    if (event.target.closest("[data-combo-details]")) return;
    toggleSelected();
  });

  card?.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key)) return;
    if (event.target.closest("[data-combo-details]")) return;
    event.preventDefault();
    toggleSelected();
  });

  detailsButton?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openDetails();
  });

  detailSelect?.addEventListener("click", () => {
    setSelected(true);
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

  updatePurchaseState();
})();
