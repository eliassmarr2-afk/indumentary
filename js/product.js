import { SITE_CONFIG } from "./config/site.js";
import { getProductDetail, parseTabsJson } from "./commerce/product-detail.js";
import { addToCart, getCartCount } from "./commerce/cart.js";
import { getSessionLocation, saveSessionLocation } from "./shared/location-state.js";
import { emitSiteEvent } from "./shared/events.js";
import { setSanitizedRichHtml } from "./shared/rich-html.js";
import { resolveShippingForLocation } from "./protocol/logistics.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const params = new URLSearchParams(window.location.search);
const requestedProductId = params.get("id") || "prod-002";
const product = getProductDetail(requestedProductId);
const SUPPORT_KEY = `indumentary.productSupport.${product?.id || "unknown"}`;

const state = {
  mediaId: product?.media?.[0]?.id || null,
  selectedOptions: {},
  selectedOfferId: product?.offers?.[0]?.id || null,
  selectedTabId: null,
};

const els = {
  image: $("#productImage"),
  thumbnailRail: $("#thumbnailRail"),
  category: $("#productCategory"),
  title: $("#productTitle"),
  subtitle: $("#productSubtitle"),
  rating: $("#productRating"),
  deliveryShort: $("#deliveryShort"),
  buyers: $("#productBuyers"),
  price: $("#productPrice"),
  oldPrice: $("#oldPrice"),
  shortDescription: $("#productShortDescription"),
  detailSection: $("#detailSection"),
  readMore: $("#readMoreButton"),
  reviews: $("#reviewsButton"),
  gallery: $("#galleryButton"),
  favorite: $("#favoriteButton"),
  share: $("#shareButton"),
  options: $("#productOptions"),
  offers: $("#offerList"),
  sellerName: $("#sellerName"),
  sellerSubtitle: $("#sellerSubtitle"),
  phoneSupport: $("#phoneSupportButton"),
  productSupport: $("#productSupportButton"),
  delivery: $("#deliveryLabel"),
  locationTrigger: $("#locationTrigger"),
  tabsRail: $("#tabsRail"),
  tabPanel: $("#tabPanel"),
  features: $("#featureGrid"),
  description: $("#productDescription"),
  addToCart: $("#addToCart"),
  toast: $("#toast"),
  supportBackdrop: $("#productSupportBackdrop"),
  supportSheet: $("#productSupportSheet"),
  closeSupport: $("#closeProductSupport"),
  supportFormView: $("#productSupportFormView"),
  supportChatView: $("#productSupportChatView"),
  supportForm: $("#productSupportForm"),
  supportName: $("#productSupportName"),
  supportEmail: $("#productSupportEmail"),
  supportNameError: $("#productSupportNameError"),
  supportEmailError: $("#productSupportEmailError"),
  supportProductImage: $("#supportProductImage"),
  supportProductTitle: $("#supportProductTitle"),
  supportProductPrice: $("#supportProductPrice"),
  supportMessages: $("#productSupportMessages"),
  supportQuickQuestions: $("#productSupportQuickQuestions"),
  supportMessageForm: $("#productSupportMessageForm"),
  supportMessageInput: $("#productSupportMessageInput"),
  locationBackdrop: $("#locationBackdrop"),
  locationClose: $("#locationClose"),
  locationForm: $("#locationForm"),
  postalCode: $("#postalCode"),
  streetAddress: $("#streetAddress"),
};

let toastTimer;

function money(value) {
  if (value == null) return "";
  return new Intl.NumberFormat(SITE_CONFIG.locale, {
    style: "currency",
    currency: SITE_CONFIG.currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function fallbackArtwork(label = "IND.") {
  const safe = String(label).replace(/[<&>]/g, "").slice(0, 32);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900"><rect width="900" height="900" fill="#e9e0d4"/><path d="M315 230 395 175h110l80 55 120 92-75 115-72-48v305H342V389l-72 48-75-115 120-92Z" fill="#f7f7f4" stroke="#87c8ee" stroke-width="26"/><path d="M395 175v519M505 175v519" stroke="#87c8ee" stroke-width="18" opacity=".8"/><text x="450" y="790" text-anchor="middle" font-family="Arial,sans-serif" font-size="38" font-weight="700" fill="#111">${safe}</text><text x="450" y="835" text-anchor="middle" font-family="Arial,sans-serif" font-size="22" fill="#666">IMAGEN TEMPORAL</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function applyImage(img, src, alt) {
  if (!img) return;
  img.alt = alt || product?.title || "Producto";
  img.onerror = () => {
    img.onerror = null;
    img.src = fallbackArtwork(product?.title || "IND.");
  };
  img.src = src || fallbackArtwork(product?.title || "IND.");
}

function showToast(message) {
  clearTimeout(toastTimer);
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  toastTimer = setTimeout(() => els.toast.classList.remove("is-visible"), 2200);
}

function selectedOffer() {
  return product.offers.find((offer) => offer.id === state.selectedOfferId) || product.offers[0];
}

function activeMedia() {
  return product.media.find((media) => media.id === state.mediaId) || product.media[0];
}

function renderGallery() {
  const active = activeMedia();
  applyImage(els.image, active?.src, active?.alt);

  els.thumbnailRail.innerHTML = product.media.map((media) => `
    <button class="thumbnail-button${media.id === active?.id ? " is-active" : "}" type="button" data-media-id="${media.id}" aria-label="Ver ${media.alt}">
      <img src="${media.src}" alt="" loading="lazy" />
    </button>
  `).join("");

  $$("img", els.thumbnailRail).forEach((img) => {
    img.onerror = () => {
      img.onerror = null;
      img.src = fallbackArtwork(product.title);
    };
  });
}

function renderIntro() {
  document.title = `${product.title} · Indumentary`;
  els.category.textContent = product.category;
  els.title.textContent = product.title;
  els.subtitle.textContent = product.subtitle;
  els.rating.textContent = `${product.rating} · ${product.reviewCount} reseñas`;
  els.buyers.textContent = `${Number(product.buyers || 0).toLocaleString("es-AR")}+`;
  els.deliveryShort.textContent = product.deliveryDays <= 1 ? "Despacho en el día" : `Entrega en ${product.deliveryDays} días`;
  els.delivery.textContent = product.deliveryLabel;
  els.shortDescription.textContent = product.shortDescription;
  els.sellerName.textContent = product.seller?.name || "IND.";
  els.sellerSubtitle.textContent = product.seller?.subtitle || "Tienda oficial";
}

function renderOptions() {
  product.options.forEach((option) => {
    if (!state.selectedOptions[option.id]) state.selectedOptions[option.id] = option.values[0]?.id || null;
  });

  els.options.innerHTML = product.options.map((option) => {
    const selectedId = state.selectedOptions[option.id];
    const selectedValue = option.values.find((value) => value.id === selectedId);
    const values = option.values.map((value) => {
      const selected = value.id === selectedId;
      if (option.type === "image") {
        return `<button class="color-image-button${selected ? " is-selected" : "}" type="button" data-option-id="${option.id}" data-value-id="${value.id}" aria-pressed="${selected}" aria-label="${value.label}"><img src="${value.image || ""}" alt="${value.label}" /></button>`;
      }
      return `<button class="option-button${selected ? " is-selected" : "}" type="button" data-option-id="${option.id}" data-value-id="${value.id}" aria-pressed="${selected}">${value.label}</button>`;
    }).join("");

    return `<div class="option-group"><div class="option-heading"><strong>${option.label}</strong><span>${selectedValue?.label || ""}</span></div><div class="option-values">${values}</div></div>`;
  }).join("");

  $$(".color-image-button img", els.options).forEach((img) => {
    img.onerror = () => {
      img.onerror = null;
      img.src = fallbackArtwork(product.title);
    };
  });
}

function renderOffers() {
  els.offers.innerHTML = product.offers.map((offer) => {
    const selected = offer.id === state.selectedOfferId;
    return `<button class="offer-card${selected ? " is-selected" : "}" type="button" data-offer-id="${offer.id}" aria-pressed="${selected}">${offer.badge ? `<span class="offer-badge">${offer.badge}</span>` : ""}<span class="offer-card__copy"><strong>${offer.label}</strong><span>${offer.subtitle}</span></span><span class="offer-card__price"><strong>${money(offer.price)}</strong>${offer.compareAt ? `<span>${money(offer.compareAt)}</span>` : ""}</span></button>`;
  }).join("");
}

function renderPrice() {
  const offer = selectedOffer();
  els.price.textContent = money(offer?.price ?? product.price);
  els.oldPrice.textContent = offer?.compareAt ? money(offer.compareAt) : "";
  els.oldPrice.hidden = !offer?.compareAt;
}

function renderFeatures() {
  els.features.innerHTML = product.features.map((feature) => `<div class="feature-item"><span class="feature-item__check"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg></span><span>${feature}</span></div>`).join("");
}

function renderTabs() {
  const tabs = parseTabsJson(product.tabsJson);
  if (!tabs.length) return;
  if (!state.selectedTabId || !tabs.some((tab) => tab.id === state.selectedTabId)) state.selectedTabId = tabs[0].id;
  els.tabsRail.innerHTML = tabs.map((tab) => `<button class="tab-button" type="button" role="tab" data-tab-id="${tab.id}" aria-selected="${tab.id === state.selectedTabId}">${tab.label}</button>`).join("");
  const active = tabs.find((tab) => tab.id === state.selectedTabId) || tabs[0];
  setSanitizedRichHtml(els.tabPanel, active.contentHtml || "");
}

function renderDescription() {
  setSanitizedRichHtml(els.description, product.descriptionHtml || "");
}

function selectMedia(mediaId) {
  if (!product.media.some((media) => media.id === mediaId)) return;
  state.mediaId = mediaId;
  renderGallery();
  emitSiteEvent("product_media_selected", { productId: product.id, mediaId });
}

function selectOption(optionId, valueId) {
  const option = product.options.find((item) => item.id === optionId);
  const value = option?.values.find((item) => item.id === valueId);
  if (!value) return;
  state.selectedOptions[optionId] = valueId;
  if (option.type === "image" && value.image) {
    const media = product.media.find((item) => item.src === value.image);
    if (media) state.mediaId = media.id;
  }
  renderOptions();
  renderGallery();
  emitSiteEvent("product_option_selected", { productId: product.id, optionId, valueId });
}

function selectOffer(offerId) {
  if (!product.offers.some((offer) => offer.id === offerId)) return;
  state.selectedOfferId = offerId;
  renderOffers();
  renderPrice();
  const offer = selectedOffer();
  emitSiteEvent("commercial_offer_selected", {
    productId: product.id,
    offerId: offer.id,
    protocolOfferId: offer.protocolOfferId,
    providerVariantId: offer.providerVariantId,
  });
}

function selectTab(tabId) {
  const tabs = parseTabsJson(product.tabsJson);
  if (!tabs.some((tab) => tab.id === tabId)) return;
  state.selectedTabId = tabId;
  renderTabs();
  emitSiteEvent("product_tab_selected", { productId: product.id, tabId });
}

function cartContext() {
  const offer = selectedOffer();
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
    source: "product_page_mock",
  };
}

function handleAddToCart() {
  const context = cartContext();
  addToCart(product.id, 1, context);
  emitSiteEvent("cart_item_added", { productId: product.id, ...context, quantity: 1 });
  showToast(`${product.title} agregado al carrito.`);
}

function updateLocationUI(location = getSessionLocation()) {
  if (!location) {
    els.delivery.textContent = product.deliveryLabel;
    return;
  }
  els.delivery.textContent = `Enviar a ${location.visibleLabel} · CP ${location.postalCode}`;
}

function openLocation() {
  const current = getSessionLocation();
  els.postalCode.value = current?.postalCode || "";
  els.streetAddress.value = current?.address || "";
  els.locationBackdrop.hidden = false;
  requestAnimationFrame(() => els.locationBackdrop.classList.add("is-open"));
  document.body.classList.add("no-scroll");
}

function closeLocation() {
  els.locationBackdrop.classList.remove("is-open");
  document.body.classList.remove("no-scroll");
  setTimeout(() => {
    if (!els.locationBackdrop.classList.contains("is-open")) els.locationBackdrop.hidden = true;
  }, 190);
}

async function saveLocation(event) {
  event.preventDefault();
  const postalCode = els.postalCode.value.trim().toUpperCase();
  const address = els.streetAddress.value.trim();
  if (!/^(?:\d{4}|[A-Z]\d{4}[A-Z]{3})$/.test(postalCode)) {
    showToast("Ingresá un CP de 4 dígitos o un CPA completo.");
    return;
  }
  const location = saveSessionLocation({ postalCode, address });
  const shipping = await resolveShippingForLocation(location);
  updateLocationUI(location);
  closeLocation();
  emitSiteEvent("shipping_location_saved", { productId: product.id, postalCode, shippingStatus: shipping.status });
  showToast(`Ubicación guardada: ${location.visibleLabel}.`);
}

function setSupportError(input, errorEl, message) {
  const hasError = Boolean(message);
  input.setAttribute("aria-invalid", hasError ? "true" : "false");
  errorEl.hidden = !hasError;
  errorEl.textContent = message || "";
}

function readSupportSession() {
  try {
    const raw = sessionStorage.getItem(SUPPORT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSupportSession(session) {
  try {
    sessionStorage.setItem(SUPPORT_KEY, JSON.stringify(session));
  } catch {
    // Front-only persistence is best effort.
  }
}

function renderSupportMessages(session) {
  els.supportMessages.innerHTML = session.messages.map((message) => `<div class="product-support-message ${message.role === "customer" ? "product-support-message--customer" : "product-support-message--operator"}"><span class="product-support-message__sender">${message.role === "customer" ? session.customer.name : "Operador"}</span><div class="product-support-message__bubble"></div></div>`).join("");
  const bubbles = $$(".product-support-message__bubble", els.supportMessages);
  session.messages.forEach((message, index) => {
    if (bubbles[index]) bubbles[index].textContent = message.text;
  });
  els.supportMessages.scrollTop = els.supportMessages.scrollHeight;
}

function renderQuickQuestions() {
  els.supportQuickQuestions.replaceChildren();
  product.supportQuestions.forEach((question) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "product-support-quick-question";
    button.textContent = question;
    button.addEventListener("click", () => sendSupportMessage(question));
    els.supportQuickQuestions.appendChild(button);
  });
}

function showSupportChat(session) {
  els.supportFormView.hidden = true;
  els.supportChatView.hidden = false;
  renderSupportMessages(session);
  renderQuickQuestions();
}

function openSupport() {
  const active = activeMedia();
  applyImage(els.supportProductImage, active?.src, product.title);
  els.supportProductTitle.textContent = product.title;
  els.supportProductPrice.textContent = money(selectedOffer().price);
  const session = readSupportSession();
  if (session) showSupportChat(session);
  else {
    els.supportFormView.hidden = false;
    els.supportChatView.hidden = true;
  }
  els.supportBackdrop.hidden = false;
  requestAnimationFrame(() => els.supportBackdrop.classList.add("is-open"));
  document.body.classList.add("no-scroll");
}

function closeSupport() {
  els.supportBackdrop.classList.remove("is-open");
  document.body.classList.remove("no-scroll");
  setTimeout(() => {
    if (!els.supportBackdrop.classList.contains("is-open")) els.supportBackdrop.hidden = true;
  }, 190);
}

function startSupport(event) {
  event.preventDefault();
  const name = els.supportName.value.trim();
  const email = els.supportEmail.value.trim();
  let valid = true;
  if (name.length < 3) {
    setSupportError(els.supportName, els.supportNameError, "Ingresá tu nombre y apellido.");
    valid = false;
  } else setSupportError(els.supportName, els.supportNameError, "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setSupportError(els.supportEmail, els.supportEmailError, "Ingresá un correo válido.");
    valid = false;
  } else setSupportError(els.supportEmail, els.supportEmailError, "");
  if (!valid) return;

  const firstName = name.split(/\s+/)[0];
  const session = {
    status: "open",
    customer: { name, email },
    product: { id: product.id, title: product.title },
    messages: [{ role: "operator", text: `Hola ${firstName}, ¿qué te gustaría saber de ${product.title}?`, createdAt: new Date().toISOString() }],
  };
  writeSupportSession(session);
  showSupportChat(session);
  emitSiteEvent("product_support_started", { productId: product.id });
}

function sendSupportMessage(text) {
  const normalized = String(text || "").trim();
  if (!normalized) return;
  const session = readSupportSession();
  if (!session) return;
  session.messages.push({ role: "customer", text: normalized, createdAt: new Date().toISOString() });
  writeSupportSession(session);
  renderSupportMessages(session);
  emitSiteEvent("product_support_message", { productId: product.id });
}

async function shareProduct() {
  const data = { title: product.title, text: product.subtitle, url: window.location.href };
  try {
    if (navigator.share) await navigator.share(data);
    else if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Enlace copiado.");
    }
  } catch (error) {
    if (error?.name !== "AbortError") showToast("No pudimos compartir el producto.");
  }
}

function bindEvents() {
  els.thumbnailRail.addEventListener("click", (event) => {
    const button = event.target.closest("[data-media-id]");
    if (button) selectMedia(button.dataset.mediaId);
  });
  els.options.addEventListener("click", (event) => {
    const button = event.target.closest("[data-option-id][data-value-id]");
    if (button) selectOption(button.dataset.optionId, button.dataset.valueId);
  });
  els.offers.addEventListener("click", (event) => {
    const button = event.target.closest("[data-offer-id]");
    if (button) selectOffer(button.dataset.offerId);
  });
  els.tabsRail.addEventListener("click", (event) => {
    const button = event.target.closest("[data-tab-id]");
    if (button) selectTab(button.dataset.tabId);
  });
  els.addToCart.addEventListener("click", handleAddToCart);
  els.favorite.addEventListener("click", () => {
    els.favorite.classList.toggle("is-favorite");
    showToast(els.favorite.classList.contains("is-favorite") ? "Guardado en favoritos." : "Quitado de favoritos.");
  });
  els.share.addEventListener("click", shareProduct);
  els.gallery.addEventListener("click", () => els.thumbnailRail.scrollIntoView({ behavior: "smooth", block: "center" }));
  els.readMore.addEventListener("click", () => {
    const expanded = els.detailSection.classList.toggle("is-expanded");
    els.readMore.textContent = expanded ? "Ver menos" : "Leer más";
  });
  els.reviews.addEventListener("click", () => showToast(`${product.rating} ★ · ${product.reviewCount} reseñas temporales.`));
  els.phoneSupport.addEventListener("click", () => showToast("Canal telefónico reservado para una integración posterior."));
  els.productSupport.addEventListener("click", openSupport);
  els.closeSupport.addEventListener("click", closeSupport);
  els.supportBackdrop.addEventListener("click", (event) => { if (event.target === els.supportBackdrop) closeSupport(); });
  els.supportForm.addEventListener("submit", startSupport);
  els.supportMessageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = els.supportMessageInput.value.trim();
    if (!text) return;
    sendSupportMessage(text);
    els.supportMessageInput.value = "";
  });
  els.locationTrigger.addEventListener("click", openLocation);
  els.locationClose.addEventListener("click", closeLocation);
  els.locationBackdrop.addEventListener("click", (event) => { if (event.target === els.locationBackdrop) closeLocation(); });
  els.locationForm.addEventListener("submit", saveLocation);
  window.addEventListener("indumentary:location-change", (event) => updateLocationUI(event.detail));
  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!els.supportBackdrop.hidden) closeSupport();
    if (!els.locationBackdrop.hidden) closeLocation();
  });
}

function init() {
  if (!product) {
    window.location.replace("./index.html");
    return;
  }
  renderGallery();
  renderIntro();
  renderOptions();
  renderOffers();
  renderPrice();
  renderTabs();
  renderFeatures();
  renderDescription();
  updateLocationUI();
  bindEvents();
  emitSiteEvent("product_page_viewed", { productId: product.id, requestedProductId, currentSource: "mock_development" });
}

init();
