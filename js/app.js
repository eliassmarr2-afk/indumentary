import { SITE_CONFIG } from "./config/site.js";
import { categories, combos, products, searchProducts } from "./commerce/catalog.js";
import { getCartCount } from "./commerce/cart.js";
import { getSessionLocation, saveSessionLocation } from "./shared/location-state.js";
import { emitSiteEvent } from "./shared/events.js";
import { resolveShippingForLocation } from "./protocol/logistics.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const elements = {
  menuToggle: $("#menuToggle"),
  menuClose: $("#menuClose"),
  menu: $("#siteMenu"),
  menuOverlay: $("#menuOverlay"),
  cartButton: $("#cartButton"),
  cartCount: $("#cartCount"),
  locationTrigger: $("#locationTrigger"),
  locationPrimary: $("#locationPrimary"),
  locationSecondary: $("#locationSecondary"),
  locationModal: $("#locationModal"),
  locationClose: $("#locationClose"),
  locationCancel: $("#locationCancel"),
  locationForm: $("#locationForm"),
  postalCode: $("#postalCode"),
  streetAddress: $("#streetAddress"),
  productSearch: $("#productSearch"),
  categoryList: $("#categoryList"),
  comboList: $("#comboList"),
  productGrid: $("#productGrid"),
  resultCount: $("#resultCount"),
  emptyState: $("#emptyState"),
  shippingMenuButton: $("#shippingMenuButton"),
  toast: $("#toast"),
};

let toastTimer;

function formatMoney(value) {
  return new Intl.NumberFormat(SITE_CONFIG.locale, {
    style: "currency",
    currency: SITE_CONFIG.currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastTimer = setTimeout(() => elements.toast.classList.remove("is-visible"), 2800);
}

function openMenu() {
  elements.menuOverlay.hidden = false;
  elements.menu.classList.add("is-open");
  elements.menu.setAttribute("aria-hidden", "false");
  elements.menuToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("no-scroll");
  emitSiteEvent("navigation_menu_opened");
}

function closeMenu() {
  elements.menu.classList.remove("is-open");
  elements.menu.setAttribute("aria-hidden", "true");
  elements.menuToggle.setAttribute("aria-expanded", "false");
  elements.menuOverlay.hidden = true;
  document.body.classList.remove("no-scroll");
}

function openLocationModal() {
  closeMenu();
  const current = getSessionLocation();
  elements.postalCode.value = current?.postalCode || "";
  elements.streetAddress.value = current?.address || "";
  elements.locationModal.hidden = false;
  document.body.classList.add("no-scroll");
  requestAnimationFrame(() => elements.postalCode.focus());
  emitSiteEvent("shipping_location_opened");
}

function closeLocationModal() {
  elements.locationModal.hidden = true;
  document.body.classList.remove("no-scroll");
}

function updateLocationUI(location = getSessionLocation()) {
  if (!location) {
    elements.locationPrimary.textContent = "¿A dónde lo enviamos?";
    elements.locationSecondary.textContent = "Ingresá tu código postal y dirección opcional";
    return;
  }

  elements.locationPrimary.textContent = `Enviar a ${location.visibleLabel}`;
  elements.locationSecondary.textContent = `CP ${location.postalCode} · guardado durante esta sesión`;
}

function renderCategories() {
  elements.categoryList.innerHTML = categories.map((category) => `
    <button class="category-card" type="button" data-category="${category.label}">
      <span class="category-card__image">
        <img src="${category.image}" alt="${category.label}" loading="lazy" />
      </span>
      <span>${category.label}</span>
    </button>
  `).join("");
}

function renderCombos() {
  elements.comboList.innerHTML = combos.map((combo) => `
    <article class="combo-card">
      <div class="combo-card__media">
        <img src="${combo.image}" alt="${combo.title}" loading="lazy" />
      </div>
      <div class="combo-card__content">
        <h3>${combo.title}</h3>
        <p>${combo.subtitle}</p>
        <div class="stars" aria-label="5 de 5 estrellas">★★★★★</div>
        <div class="price-row">
          <strong class="price-current">${formatMoney(combo.price)}</strong>
          <span class="price-old">${formatMoney(combo.compareAt)}</span>
        </div>
        <button class="offer-link" type="button" data-offer="${combo.id}">Ver oferta →</button>
      </div>
    </article>
  `).join("");
}

function renderProducts(list = products) {
  elements.resultCount.textContent = `${list.length} producto${list.length === 1 ? "" : "s"}`;
  elements.emptyState.hidden = list.length > 0;

  elements.productGrid.innerHTML = list.map((product) => `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-card__media">
        <img src="${product.image}" alt="${product.title}" loading="lazy" />
      </div>
      <div class="product-card__content">
        <h3>${product.title}</h3>
        <p class="product-card__subtitle">${product.subtitle}</p>
        <div class="stars" aria-label="5 de 5 estrellas">★★★★★</div>
        <span class="delivery-badge" title="Demo visual. Protocol Data Logistics todavía no está integrado.">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h11v10H3Z" /><path d="M14 9h4l3 3v4h-7Z" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>
          Llega a tu dirección
        </span>
        <small class="delivery-demo-note">Demo visual · pendiente de resolución logística</small>
        <div class="product-card__divider"></div>
      </div>
      <div class="product-card__commerce">
        <span class="trust-badge">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 6v5c0 5.2 3.4 8.5 8 10 4.6-1.5 8-4.8 8-10V6Z" /><path d="m9 12 2 2 4-4" /></svg>
          Compra segura con Mercado Pago
        </span>
        <strong class="product-card__price">${formatMoney(product.price)}</strong>
      </div>
    </article>
  `).join("");
}

function runSearch(query) {
  const result = searchProducts(query);
  renderProducts(result);
  emitSiteEvent("catalog_search_changed", { query: String(query || "").trim(), resultCount: result.length });
}

function selectCategory(category) {
  elements.productSearch.value = category;
  runSearch(category);
  $("#productos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  emitSiteEvent("category_selected", { category });
}

async function handleLocationSubmit(event) {
  event.preventDefault();

  const postalCode = elements.postalCode.value.trim().toUpperCase();
  const address = elements.streetAddress.value.trim();
  const isValid = /^(?:\d{4}|[A-Z]\d{4}[A-Z]{3})$/.test(postalCode);

  if (!isValid) {
    showToast("Ingresá un CP de 4 dígitos o un CPA completo.");
    elements.postalCode.focus();
    return;
  }

  const location = saveSessionLocation({ postalCode, address });
  updateLocationUI(location);
  closeLocationModal();

  const shipping = await resolveShippingForLocation(location);
  emitSiteEvent("shipping_location_saved", {
    postalCode: location.postalCode,
    hasAddress: Boolean(location.address),
    shippingStatus: shipping.status,
  });

  showToast(`Ubicación guardada: ${location.visibleLabel}.`);
}

function bindEvents() {
  elements.menuToggle.addEventListener("click", openMenu);
  elements.menuClose.addEventListener("click", closeMenu);
  elements.menuOverlay.addEventListener("click", closeMenu);

  elements.locationTrigger.addEventListener("click", openLocationModal);
  elements.locationClose.addEventListener("click", closeLocationModal);
  elements.locationCancel.addEventListener("click", closeLocationModal);
  elements.locationModal.addEventListener("click", (event) => {
    if (event.target === elements.locationModal) closeLocationModal();
  });
  elements.locationForm.addEventListener("submit", handleLocationSubmit);

  elements.shippingMenuButton.addEventListener("click", openLocationModal);
  elements.productSearch.addEventListener("input", (event) => runSearch(event.target.value));

  elements.categoryList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (button) selectCategory(button.dataset.category);
  });

  elements.comboList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-offer]");
    if (!button) return;
    emitSiteEvent("commercial_offer_opened", { offerId: button.dataset.offer, source: "home_combo" });
    showToast("Oferta demo. La Product Page se construirá en el próximo movimiento.");
  });

  elements.productGrid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-product-id]");
    if (!card) return;
    emitSiteEvent("product_card_opened", { productId: card.dataset.productId });
    showToast("Producto demo. La Product Page todavía está reservada.");
  });

  elements.cartButton.addEventListener("click", () => {
    emitSiteEvent("cart_open_requested", { count: getCartCount() });
    showToast("Carrito preparado arquitectónicamente; su vista se construirá después de la Home.");
  });

  $$('[data-category-link]').forEach((link) => link.addEventListener("click", () => {
    selectCategory(link.dataset.categoryLink);
  }));

  $$('[data-close-menu]').forEach((link) => link.addEventListener("click", closeMenu));

  $$('[data-reserved]').forEach((control) => control.addEventListener("click", () => {
    closeMenu();
    showToast(`${control.dataset.reserved}: superficie reservada para un próximo build.`);
  }));

  window.addEventListener("indumentary:cart-change", () => {
    elements.cartCount.textContent = String(getCartCount());
  });

  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!elements.locationModal.hidden) closeLocationModal();
    if (elements.menu.classList.contains("is-open")) closeMenu();
  });
}

function init() {
  renderCategories();
  renderCombos();
  renderProducts(products);
  updateLocationUI();
  elements.cartCount.textContent = String(getCartCount());
  bindEvents();
  emitSiteEvent("home_viewed", { environment: SITE_CONFIG.environment });
}

init();
