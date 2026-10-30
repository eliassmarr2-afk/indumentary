(() => {
  "use strict";

  const offerList = document.getElementById("offerList");
  const purchasePrice = document.getElementById("productPrice");
  const oldPrice = document.getElementById("oldPrice");
  const addToCart = document.getElementById("addToCart");
  const supportPrice = document.getElementById("supportProductPrice");

  if (!offerList) return;

  const money = (value) => new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

  const combos = [
    {
      id: "combo-training",
      title: "Combo Training",
      subtitle: "Camiseta técnica + pantalón + medias deportivas.",
      price: 89990,
      compareAt: 112000,
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=82",
      best: false,
      items: ["Camiseta Motion", "Jogger Active", "Medias Crew Pro"],
    },
    {
      id: "combo-street",
      title: "Combo Street",
      subtitle: "Campera liviana + jogger para usar dentro y fuera del entrenamiento.",
      price: 124900,
      compareAt: 149500,
      image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=82",
      best: true,
      items: ["Campera Core", "Jogger Active", "Gorra Pace"],
    },
    {
      id: "combo-match",
      title: "Combo Match Day",
      subtitle: "Camiseta + medias + botines para llegar listo a la cancha.",
      price: 159900,
      compareAt: 188000,
      image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=82",
      best: false,
      items: ["Camiseta Motion", "Medias Crew Pro", "Botín Vector"],
    },
  ];

  let selectedComboId = null;
  let activeDetailId = null;
  let backdrop = null;

  const getCombo = (id) => combos.find((combo) => combo.id === id) || null;

  function badgeMarkup() {
    return `
      <span class="product-combo-card__best">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 13 11 22l-9-9V4h9l9 9Z"/><circle cx="7.5" cy="8.5" r="1.5"/></svg>
        Mejor oferta
      </span>
    `;
  }

  function cardMarkup(combo) {
    return `
      <article class="product-combo-card${selectedComboId === combo.id ? " is-selected" : "}" data-combo-id="${combo.id}" role="button" tabindex="0" aria-pressed="${selectedComboId === combo.id}">
        ${combo.best ? badgeMarkup() : ""}
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
          <button class="product-combo-card__details" type="button" data-combo-details="${combo.id}">
            Ver detalles
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </article>
    `;
  }

  function renderCards() {
    offerList.innerHTML = combos.map(cardMarkup).join("");
  }

  function updatePurchaseBar() {
    const combo = getCombo(selectedComboId);
    if (!combo) return;
    if (purchasePrice) purchasePrice.textContent = money(combo.price);
    if (oldPrice) {
      oldPrice.textContent = money(combo.compareAt);
      oldPrice.hidden = false;
    }
    if (supportPrice) supportPrice.textContent = money(combo.price);
    if (addToCart) addToCart.textContent = "Agregar combo";
  }

  function restoreProductPurchaseBar() {
    const currentProductPrice = Number(String(purchasePrice?.dataset.productBase || "").trim());
    if (Number.isFinite(currentProductPrice) && currentProductPrice > 0) {
      purchasePrice.textContent = money(currentProductPrice);
    }
    if (addToCart) addToCart.textContent = "Comprar ahora";
  }

  function selectCombo(id) {
    selectedComboId = selectedComboId === id ? null : id;
    renderCards();
    if (selectedComboId) updatePurchaseBar();
    else restoreProductPurchaseBar();
  }

  function ensureDetailSheet() {
    if (backdrop) return backdrop;

    backdrop = document.createElement("div");
    backdrop.className = "combo-detail-backdrop";
    backdrop.hidden = true;
    backdrop.innerHTML = `
      <section class="combo-detail-sheet" role="dialog" aria-modal="true" aria-labelledby="comboDetailTitle">
        <div class="combo-detail-sheet__handle" aria-hidden="true"></div>
        <div class="combo-detail-sheet__top">
          <div><span>DETALLE DE LA OFERTA</span><h2 id="comboDetailTitle">Combo</h2></div>
          <button class="combo-detail-sheet__close" type="button" aria-label="Cerrar">×</button>
        </div>
        <div class="combo-detail-sheet__media"><img id="comboDetailImage" alt="" /></div>
        <p id="comboDetailCopy" class="combo-detail-sheet__copy"></p>
        <ul id="comboDetailItems" class="combo-detail-sheet__list"></ul>
        <div class="combo-detail-sheet__footer">
          <div class="combo-detail-sheet__prices"><strong id="comboDetailPrice"></strong><span id="comboDetailCompare"></span></div>
          <button id="comboDetailSelect" class="combo-detail-sheet__select" type="button">Seleccionar oferta</button>
        </div>
      </section>
    `;
    document.body.appendChild(backdrop);

    backdrop.querySelector(".combo-detail-sheet__close")?.addEventListener("click", closeDetails);
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) closeDetails();
    });
    backdrop.querySelector("#comboDetailSelect")?.addEventListener("click", () => {
      if (!activeDetailId) return;
      selectedComboId = activeDetailId;
      renderCards();
      updatePurchaseBar();
      refreshDetailButton();
    });

    return backdrop;
  }

  function refreshDetailButton() {
    if (!backdrop || !activeDetailId) return;
    const button = backdrop.querySelector("#comboDetailSelect");
    const selected = selectedComboId === activeDetailId;
    button.textContent = selected ? "Oferta seleccionada" : "Seleccionar oferta";
    button.classList.toggle("is-selected", selected);
  }

  function openDetails(id) {
    const combo = getCombo(id);
    if (!combo) return;
    activeDetailId = id;
    const sheet = ensureDetailSheet();
    sheet.querySelector("#comboDetailTitle").textContent = combo.title;
    const img = sheet.querySelector("#comboDetailImage");
    img.src = combo.image;
    img.alt = combo.title;
    sheet.querySelector("#comboDetailCopy").textContent = combo.subtitle;
    sheet.querySelector("#comboDetailItems").innerHTML = combo.items.map((item) => `<li>${item}</li>`).join("");
    sheet.querySelector("#comboDetailPrice").textContent = money(combo.price);
    sheet.querySelector("#comboDetailCompare").textContent = money(combo.compareAt);
    refreshDetailButton();
    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add("is-open"));
    document.body.classList.add("no-scroll");
  }

  function closeDetails() {
    if (!backdrop) return;
    backdrop.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    setTimeout(() => {
      if (!backdrop.classList.contains("is-open")) backdrop.hidden = true;
    }, 190);
  }

  function storeComboInCart(combo) {
    const cartKey = "indumentary.cart.v3";
    try {
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

  function bind() {
    offerList.addEventListener("click", (event) => {
      const details = event.target.closest("[data-combo-details]");
      if (details) {
        event.preventDefault();
        event.stopPropagation();
        openDetails(details.dataset.comboDetails);
        return;
      }

      const card = event.target.closest("[data-combo-id]");
      if (!card) return;
      event.preventDefault();
      event.stopPropagation();
      selectCombo(card.dataset.comboId);
    }, true);

    offerList.addEventListener("keydown", (event) => {
      if (!["Enter", " "].includes(event.key)) return;
      const card = event.target.closest("[data-combo-id]");
      if (!card) return;
      event.preventDefault();
      selectCombo(card.dataset.comboId);
    });

    addToCart?.addEventListener("click", (event) => {
      if (!selectedComboId) return;
      const combo = getCombo(selectedComboId);
      if (!combo) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      storeComboInCart(combo);
      const toast = document.getElementById("toast");
      if (toast) {
        toast.textContent = `${combo.title} agregado al carrito.`;
        toast.classList.add("is-visible");
        setTimeout(() => toast.classList.remove("is-visible"), 2200);
      }
    }, true);
  }

  function init() {
    if (purchasePrice) {
      const numeric = Number(String(purchasePrice.textContent || "").replace(/[^0-9]/g, ""));
      if (numeric) purchasePrice.dataset.productBase = String(numeric);
    }
    renderCards();
    bind();
  }

  init();
})();
