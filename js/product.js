import { SITE_CONFIG } from "./config/site.js";
import { getProductDetail, parseTabsJson } from "./commerce/product-detail.js";
import { addToCart, getCartCount } from "./commerce/cart.js";
import { getSessionLocation, saveSessionLocation } from "./shared/location-state.js";
import { emitSiteEvent } from "./shared/events.js";
import { setSanitizedRichHtml } from "./shared/rich-html.js";
import { resolveShippingForLocation } from "./protocol/logistics.js";

const $ = (selector, root = document) => root.querySelector(selector);

const params = new URLSearchParams(window.location.search);
const requestedProductId = params.get("id") || "prod-002";
const product = getProductDetail(requestedProductId);

const state = {
  mediaId: product?.media?.[0]?.id || null,
  selectedOptions: {},
  selectedOfferId: product?.offers?.[0]?.id || null,
  selectedTabId: null,
};

const elements = {
  mainProductImage: $("#mainProductImage"),
  thumbnailRail: $("#thumbnailRail"),
  productCategory: $("#productCategory"),
  productTitle: $("#productTitle"),
  productSubtitle: $("#productSubtitle"),
  productStars: $("#productStars"),
  reviewCount: $("#reviewCount"),
  productPrice: $("#productPrice"),
  productCompare: $("#productCompare"),
  productOptions: $("#productOptions"),
  offerList: $("#offerList"),
  tabsRail: $("#tabsRail"),
  tabPanel: $("#tabPanel"),
  productDescription: $("#productDescription"),
  shareButton: $("#shareButton"),
  cartButton: $("#cartButton"),
  cartCount: $("#cartCount"),
  addToCartDesktop: $("#addToCartDesktop"),
  addToCartMobile: $("#addToCartMobile"),
  favoriteButton: $("#favoriteButton"),
  locationTrigger: $("#locationTrigger"),
  locationPrimary: $("#locationPrimary"),
  locationSecondary: $("#locationSecondary"),
  locationModal: $("#locationModal"),
  locationClose: $("#locationClose"),
  locationCancel: $("#locationCancel"),
  locationForm: $("#locationForm"),
  postalCode: $("#postalCode"),
  streetAddress: $("#streetAddress"),
  toast: $("#toast"),
};

let toastTimer;

function formatMoney(value) {
  if (value == null) return "";
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

function getSelectedOffer() {
  return product.offers.find((offer) => offer.id === state.selectedOfferId) || product.offers[0];
}

function renderHeading() {
  elements.productCategory.textContent = product.category.toUpperCase();
  elements.productTitle.textContent = product.title;
  elements.productSubtitle.textContent = product.subtitle;
  elements.productStars.textContent = "★".repeat(product.rating || 5);
  elements.reviewCount.textContent = `(${product.reviewCount || 0})`;
  document.title = `${product.title} — Indumentary`;
  updatePrice();
}

function renderGallery() {
  const active = product.media.find((media) => media.id === state.mediaId) || product.media[0];
  elements.mainProductImage.src = active.src;
  elements.mainProductImage.alt = active.alt;

  elements.thumbnailRail.innerHTML = product.media.map((media) => `
    <button class="thumbnail-button${media.id === active.id ? " is-active" : "}" type="button" data-media-id="${media.id}" aria-label="Ver ${media.alt}">
      <img src="${media.src}" alt="" loading="lazy" />
    </button>
  `).join("");
}

function selectMedia(mediaId) {
  if (!product.media.some((media) => media.id === mediaId)) return;
  state.mediaId = mediaId;
  renderGallery();
  emitSiteEvent("product_media_selected", { productId: product.id, mediaId });
}

function renderOptions() {
  product.options.forEach((option) => {
    if (!state.selectedOptions[option.id]) state.selectedOptions[option.id] = option.values[0]?.id || null;
  });

  elements.productOptions.innerHTML = product.options.map((option) => {
    const selectedId = state.selectedOptions[option.id];
    const selectedValue = option.values.find((value) => value.id === selectedId);

    const values = option.values.map((value) => {
      const selected = value.id === selectedId;
      if (option.type === "swatch") {
        return `
          <button class="swatch-button${selected ? " is-selected" : "}" type="button" data-option-id="${option.id}" data-value-id="${value.id}" aria-pressed="${selected}">
            <span class="swatch-dot" style="background:${value.value}"></span>
            <span>${value.label}</span>
          </button>`;
      }
      return `<button class="option-button${selected ? " is-selected" : "}" type="button" data-option-id="${option.id}" data-value-id="${value.id}" aria-pressed="${selected}">${value.label}</button>`;
    }).join("");

    return `
      <div class="option-group">
        <div class="option-heading">
          <strong>${option.label}</strong>
          <span>${selectedValue?.label || ""}</span>
        </div>
        <div class="option-values">${values}</div>
      </div>`;
  }).join("");
}

function selectOption(optionId, valueId) {
  const option = product.options.find((item) => item.id === optionId);
  if (!option?.values.some((value) => value.id === valueId)) return;
  state.selectedOptions[optionId] = valueId;
  renderOptions();
  emitSiteEvent("product_option_selected", {
    productId: product.id,
    optionId,
    valueId,
  });
}

function renderOffers() {
  elements.offerList.innerHTML = product.offers.map((offer) => {
    const selected = offer.id === state.selectedOfferId;
    return `
      <button class="offer-card${selected ? " is-selected" : "}" type="button" data-offer-id="${offer.id}" aria-pressed="${selected}">
        ${offer.badge ? `<span class="offer-badge">${offer.badge}</span>` : ""}
        <span class="offer-card__copy">
          <strong>${offer.label}</strong>
          <span>${offer.subtitle}</span>
        </span>
        <span class="offer-card__price">
          <strong>${formatMoney(offer.price)}</strong>
          ${offer.compareAt ? `<span>${formatMoney(offer.compareAt)}</span>` : ""}
        </span>
      </button>`;
  }).join("");
}

function updatePrice() {
  const offer = getSelectedOffer();
  elements.productPrice.textContent = formatMoney(offer?.price ?? product.price);
  elements.productCompare.textContent = offer?.compareAt ? formatMoney(offer.compareAt) : "";
  elements.productCompare.hidden = !offer?.compareAt;
}

function selectOffer(offerId) {
  if (!product.offers.some((offer) => offer.id === offerId)) return;
  state.selectedOfferId = offerId;
  renderOffers();
  updatePrice();
  const offer = getSelectedOffer();
  emitSiteEvent("commercial_offer_selected", {
    productId: product.id,
    offerId: offer.id,
    protocolOfferId: offer.protocolOfferId,
    providerVariantId: offer.providerVariantId,
  });
}

function renderTabs() {
  const tabs = parseTabsJson(product.tabsJson);
  if (!tabs.length) {
    elements.tabsRail.parentElement.hidden = true;
    elements.tabPanel.hidden = true;
    return;
  }

  if (!state.selectedTabId || !tabs.some((tab) => tab.id === state.selectedTabId)) state.selectedTabId = tabs[0].id;

  elements.tabsRail.innerHTML = tabs.map((tab) => `
    <button class="tab-button" type="button" role="tab" data-tab-id="${tab.id}" aria-selected="${tab.id === state.selectedTabId}">${tab.label}</button>
  `).join("");

  const active = tabs.find((tab) => tab.id === state.selectedTabId) || tabs[0];
  setSanitizedRichHtml(elements.tabPanel, active.contentHtml || "");
}

function selectTab(tabId) {
  const tabs = parseTabsJson(product.tabsJson);
  if (!tabs.some((tab) => tab.id === tabId)) return;
  state.selectedTabId = tabId;
  renderTabs();
  emitSiteEvent("product_tab_selected", { productId: product.id, tabId });
}

function renderDescription() {
  setSanitizedRichHtml(elements.productDescription, product.descriptionHtml);
}

function updateLocationUI(location = getSessionLocation()) {
  if (!location) {
    elements.locationPrimary.textContent = "¿A dónde lo enviamos?";
    elements.locationSecondary.textContent = "Usá la misma ubicación de tu sesión";
    return;
  }
  elements.locationPrimary.textContent = `Enviar a ${location.visibleLabel}`;
  elements.locationSecondary.textContent = `CP ${location.postalCode} · compartido con Home`;
}

function openLocationModal() {
  const current = getSessionLocation();
  elements.postalCode.value = current?.postalCode || "";
  elements.streetAddress.value = current?.address || "";
  elements.locationModal.hidden = false;
  document.body.classList.add("no-scroll");
  requestAnimationFrame(() => elements.postalCode.focus());
  emitSiteEvent("shipping_location_opened", { source: "product_page", productId: product.id });
}

function closeLocationModal() {
  elements.locationModal.hidden = true;
  document.body.classList.remove("no-scroll");
}

async function handleLocationSubmit(event) {
  event.preventDefault();
  const postalCode = elements.postalCode.value.trim().toUpperCase();
  const address = elements.streetAddress.value.trim();
  const valid = /^(?:\d{4}|[A-Z]\d{4}[A-Z]{3})$/.test(postalCode);

  if (!valid) {
    showToast("Ingresá un CP de 4 dígitos o un CPA completo.");
    elements.postalCode.focus();
    return;
  }

  const location = saveSessionLocation({ postalCode, address });
  updateLocationUI(location);
  closeLocationModal();
  const shipping = await resolveShippingForLocation(location);
  emitSiteEvent("shipping_location_saved", {
    source: "product_page",
    productId: product.id,
    postalCode: location.postalCode,
    hasAddress: Boolean(location.address),
    shippingStatus: shipping.status,
  });
  showToast(`Ubicación guardada: ${location.visibleLabel}.`);
}

function buildCartContext() {
  const offer = getSelectedOffer();
  const selectedOptions = Object.fromEntries(product.options.map((option) => {
    const selectedId = state.selectedOptions[option.id];
    const selected = option.values.find((value) => value.id === selectedId);
    return [option.id, selected?.value ?? selectedId];
  }));

  return {
    offerId: offer.id,
    protocolOfferId: offer.protocolOfferId,
    providerVariantId: offer.providerVariantId,
    selectedOptions,
    unitPrice: offer.price,
    source: "product_page_mock"
  };
}

function handleAddToCart() {
  const context = buildCartContext();
  addToCart(product.id, 1, context);
  elements.cartCount.textContent = String(getCartCount());
  emitSiteEvent("cart_item_added", {
    productId: product.id,
    offerId: context.offerId,
    protocolOfferId: context.protocolOfferId,
    providerVariantId: context.providerVariantId,
    selectedOptions: context.selectedOptions,
    quantity: 1,
  });
  showToast(`${product.title} agregado al carrito.`);
}

async function shareProduct() {
  const data = { title: product.title, text: product.subtitle, url: window.location.href };
  try {
    if (navigator.share) await navigator.share(data);
    else {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Enlace copiado.");
    }
    emitSiteEvent("product_shared", { productId: product.id });
  } catch (error) {
    if (error?.name !== "AbortError") showToast("No pudimos compartir el producto.");
  }
}

function bindEvents() {
  elements.thumbnailRail.addEventListener("click", (event) => {
    const button = event.target.closest("[data-media-id]");
    if (button) selectMedia(button.dataset.mediaId);
  });

  elements.productOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-option-id][data-value-id]");
    if (button) selectOption(button.dataset.optionId, button.dataset.valueId);
  });

  elements.offerList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-offer-id]");
    if (button) selectOffer(button.dataset.offerId);
  });

  elements.tabsRail.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tab-id]");
    if (button) selectTab(button.dataset.tabId);
  });

  elements.locationTrigger.addEventListener("click", openLocationModal);
  elements.locationClose.addEventListener("click", closeLocationModal);
  elements.locationCancel.addEventListener("click", closeLocationModal);
  elements.locationModal.addEventListener("click", (event) => {
    if (event.target === elements.locationModal) closeLocationModal();
  });
  elements.locationForm.addEventListener("submit", handleLocationSubmit);

  elements.addToCartDesktop.addEventListener("click", handleAddToCart);
  elements.addToCartMobile.addEventListener("click", handleAddToCart);
  elements.shareButton.addEventListener("click", shareProduct);

  elements.favoriteButton.addEventListener("click", () => {
    elements.favoriteButton.classList.toggle("is-active");
    emitSiteEvent("product_favorite_toggled", {
      productId: product.id,
      active: elements.favoriteButton.classList.contains("is-active"),
    });
  });

  elements.cartButton.addEventListener("click", () => showToast(`Carrito demo: ${getCartCount()} unidad(es).`));

  window.addEventListener("indumentary:cart-change", () => {
    elements.cartCount.textContent = String(getCartCount());
  });
  window.addEventListener("indumentary:location-change", (event) => updateLocationUI(event.detail));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !elements.locationModal.hidden) closeLocationModal();
  });
}

function init() {
  if (!product) {
    window.location.replace("./index.html");
    return;
  }

  renderHeading();
  renderGallery();
  renderOptions();
  renderOffers();
  renderTabs();
  renderDescription();
  updateLocationUI();
  elements.cartCount.textContent = String(getCartCount());
  bindEvents();

  emitSiteEvent("product_page_viewed", {
    productId: product.id,
    requestedProductId,
    currentSource: "mock_development",
  });
}

init();
