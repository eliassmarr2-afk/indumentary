(() => {
  "use strict";

  const PRODUCTS = [
    {
      id: "prod-001",
      category: "Camisetas",
      title: "Camiseta Motion",
      subtitle: "Dry fit · corte regular · negro",
      price: 38990,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=86"
    },
    {
      id: "prod-002",
      category: "Camperas",
      title: "Campera Core",
      subtitle: "Liviana · urbana · entrenamiento",
      price: 74990,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=86"
    },
    {
      id: "prod-003",
      category: "Pantalones",
      title: "Jogger Active",
      subtitle: "Tapered fit · algodón técnico",
      price: 56990,
      image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1200&q=86"
    },
    {
      id: "prod-004",
      category: "Botines",
      title: "Botín Vector",
      subtitle: "Cancha · ajuste firme · tracción",
      price: 92990,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=86"
    },
    {
      id: "prod-005",
      category: "Gorras y Pilusos",
      title: "Gorra Pace",
      subtitle: "Liviana · visera curva · negra",
      price: 24990,
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=86"
    },
    {
      id: "prod-006",
      category: "Medias",
      title: "Medias Crew Pro",
      subtitle: "Pack x3 · soporte medio",
      price: 19990,
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=86"
    }
  ];

  const qs = (s, root = document) => root.querySelector(s);
  const qsa = (s, root = document) => Array.from(root.querySelectorAll(s));
  const params = new URLSearchParams(location.search);
  const requestedId = params.get("id") || "prod-002";
  const product = PRODUCTS.find((item) => item.id === requestedId) || PRODUCTS[1];
  const supportKey = `indumentary.productSupport.${product.id}`;
  const cartKey = "indumentary.cart.v3";
  const locationKey = "indumentary.sessionLocation.v1";

  const money = (value) => new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

  const fallbackSvg = (label) => {
    const safe = String(label || "IND.").replace(/[<&>]/g, "").slice(0, 28);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900"><rect width="1200" height="900" fill="#e8ded1"/><path d="M410 210 520 140h160l110 70 160 125-100 145-95-62v330H445V418l-95 62-100-145 160-125Z" fill="#f7f7f4" stroke="#b8c8d6" stroke-width="28"/><text x="600" y="790" text-anchor="middle" font-family="Arial,sans-serif" font-size="46" font-weight="700" fill="#111">${safe}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  const setImage = (img, src, alt) => {
    if (!img) return;
    img.alt = alt || product.title;
    img.onerror = () => {
      img.onerror = null;
      img.src = fallbackSvg(product.title);
    };
    img.src = src || fallbackSvg(product.title);
  };

  const media = [
    product.image,
    `${product.image}&sat=-10`,
    `${product.image}&con=8`,
    `${product.image}&bri=6`
  ].map((src, i) => ({ id: `media-${i + 1}`, src, alt: `${product.title} · vista ${i + 1}` }));

  const offers = [
    { id: "single", label: "1 unidad", subtitle: "Compra individual", price: product.price, compareAt: null, badge: "" },
    { id: "x2", label: "Pack x2", subtitle: "Dos unidades · ahorro temporal", price: Math.round(product.price * 1.8), compareAt: product.price * 2, badge: "AHORRÁ 10%" },
    { id: "look", label: "Look completo", subtitle: "Oferta preparada para Product Set", price: Math.round(product.price * 2.35), compareAt: Math.round(product.price * 2.65), badge: "MEJOR OFERTA" }
  ];

  const state = {
    mediaId: media[0].id,
    offerId: offers[0].id,
    color: "opcion-1",
    talle: "M",
    tab: "caracteristicas",
  };

  const els = {
    image: qs("#productImage"),
    thumbnailRail: qs("#thumbnailRail"),
    category: qs("#productCategory"),
    title: qs("#productTitle"),
    subtitle: qs("#productSubtitle"),
    rating: qs("#productRating"),
    deliveryShort: qs("#deliveryShort"),
    buyers: qs("#productBuyers"),
    price: qs("#productPrice"),
    oldPrice: qs("#oldPrice"),
    shortDescription: qs("#productShortDescription"),
    options: qs("#productOptions"),
    offers: qs("#offerList"),
    sellerName: qs("#sellerName"),
    sellerSubtitle: qs("#sellerSubtitle"),
    delivery: qs("#deliveryLabel"),
    tabsRail: qs("#tabsRail"),
    tabPanel: qs("#tabPanel"),
    features: qs("#featureGrid"),
    description: qs("#productDescription"),
    supportButton: qs("#productSupportButton"),
    supportBackdrop: qs("#productSupportBackdrop"),
    closeSupport: qs("#closeProductSupport"),
    supportFormView: qs("#productSupportFormView"),
    supportChatView: qs("#productSupportChatView"),
    supportForm: qs("#productSupportForm"),
    supportName: qs("#productSupportName"),
    supportEmail: qs("#productSupportEmail"),
    supportNameError: qs("#productSupportNameError"),
    supportEmailError: qs("#productSupportEmailError"),
    supportProductImage: qs("#supportProductImage"),
    supportProductTitle: qs("#supportProductTitle"),
    supportProductPrice: qs("#supportProductPrice"),
    supportMessages: qs("#productSupportMessages"),
    supportQuickQuestions: qs("#productSupportQuickQuestions"),
    supportMessageForm: qs("#productSupportMessageForm"),
    supportMessageInput: qs("#productSupportMessageInput"),
    addToCart: qs("#addToCart"),
    share: qs("#shareButton"),
    favorite: qs("#favoriteButton"),
    gallery: qs("#galleryButton"),
    readMore: qs("#readMoreButton"),
    detailSection: qs("#detailSection"),
    reviews: qs("#reviewsButton"),
    phoneSupport: qs("#phoneSupportButton"),
    locationTrigger: qs("#locationTrigger"),
    locationBackdrop: qs("#locationBackdrop"),
    locationClose: qs("#locationClose"),
    locationForm: qs("#locationForm"),
    postalCode: qs("#postalCode"),
    streetAddress: qs("#streetAddress"),
    toast: qs("#toast"),
  };

  let toastTimer = null;
  const toast = (message) => {
    if (!els.toast) return;
    clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    toastTimer = setTimeout(() => els.toast.classList.remove("is-visible"), 2200);
  };

  const selectedOffer = () => offers.find((offer) => offer.id === state.offerId) || offers[0];
  const selectedMedia = () => media.find((item) => item.id === state.mediaId) || media[0];

  function renderIdentity() {
    document.title = `${product.title} · Indumentary`;
    if (els.category) els.category.textContent = product.category;
    if (els.title) els.title.textContent = product.title;
    if (els.subtitle) els.subtitle.textContent = product.subtitle;
    if (els.rating) els.rating.textContent = "4.8 · 128 reseñas";
    if (els.deliveryShort) els.deliveryShort.textContent = "Entrega en 2 días";
    if (els.buyers) els.buyers.textContent = "420+";
    if (els.shortDescription) els.shortDescription.textContent = `${product.subtitle}. Esta descripción es temporal para visualizar la landing antes de conectar Shopify.`;
    if (els.sellerName) els.sellerName.textContent = "IND.";
    if (els.sellerSubtitle) els.sellerSubtitle.textContent = "Tienda oficial";
  }

  function renderGallery() {
    const active = selectedMedia();
    setImage(els.image, active.src, active.alt);
    if (!els.thumbnailRail) return;
    els.thumbnailRail.innerHTML = media.map((item) => `
      <button class="thumbnail-button${item.id === active.id ? " is-active" : "}" type="button" data-media-id="${item.id}">
        <img src="${item.src}" alt="${item.alt}" loading="lazy" />
      </button>
    `).join("");
    qsa("img", els.thumbnailRail).forEach((img) => {
      img.onerror = () => { img.onerror = null; img.src = fallbackSvg(product.title); };
    });
  }

  function renderOptions() {
    if (!els.options) return;
    const colorButtons = media.map((item, index) => `
      <button class="color-image-button${state.color === `opcion-${index + 1}` ? " is-selected" : "}" type="button" data-color="opcion-${index + 1}" data-media-id="${item.id}" aria-label="Opción ${index + 1}">
        <img src="${item.src}" alt="Opción ${index + 1}" />
      </button>
    `).join("");
    const sizes = ["XS","S","M","L","XL","XXL"].map((size) => `
      <button class="option-button${state.talle === size ? " is-selected" : "}" type="button" data-size="${size}">${size}</button>
    `).join("");
    els.options.innerHTML = `
      <div class="option-group"><div class="option-heading"><strong>Color</strong><span>${state.color.replace("opcion-", "Opción ")}</span></div><div class="option-values">${colorButtons}</div></div>
      <div class="option-group"><div class="option-heading"><strong>Talle</strong><span>${state.talle}</span></div><div class="option-values">${sizes}</div></div>
    `;
    qsa("img", els.options).forEach((img) => {
      img.onerror = () => { img.onerror = null; img.src = fallbackSvg(product.title); };
    });
  }

  function renderOffers() {
    if (!els.offers) return;
    els.offers.innerHTML = offers.map((offer) => `
      <button class="offer-card${offer.id === state.offerId ? " is-selected" : "}" type="button" data-offer-id="${offer.id}">
        ${offer.badge ? `<span class="offer-badge">${offer.badge}</span>` : ""}
        <span class="offer-card__copy"><strong>${offer.label}</strong><span>${offer.subtitle}</span></span>
        <span class="offer-card__price"><strong>${money(offer.price)}</strong>${offer.compareAt ? `<span>${money(offer.compareAt)}</span>` : ""}</span>
      </button>
    `).join("");
  }

  function renderPrice() {
    const offer = selectedOffer();
    if (els.price) els.price.textContent = money(offer.price);
    if (els.oldPrice) {
      els.oldPrice.textContent = offer.compareAt ? money(offer.compareAt) : money(Math.round(product.price * 1.2));
      els.oldPrice.hidden = false;
    }
  }

  const tabs = {
    caracteristicas: `<h3>Características</h3><ul><li>Diseño deportivo de uso diario.</li><li>Calce cómodo y terminaciones limpias.</li><li>Contenido temporal preparado para Shopify.</li></ul>`,
    talles: `<h3>Guía de talles</h3><table><thead><tr><th>Talle</th><th>Pecho</th></tr></thead><tbody><tr><td>S</td><td>96–100 cm</td></tr><tr><td>M</td><td>100–104 cm</td></tr><tr><td>L</td><td>104–110 cm</td></tr></tbody></table>`,
    cuidados: `<h3>Cuidados</h3><p>Lavar con colores similares y respetar la etiqueta de la prenda.</p>`
  };

  function renderTabs() {
    if (!els.tabsRail || !els.tabPanel) return;
    const labels = { caracteristicas: "Características", talles: "Guía de talles", cuidados: "Cuidados" };
    els.tabsRail.innerHTML = Object.keys(tabs).map((id) => `<button class="tab-button" type="button" data-tab-id="${id}" aria-selected="${id === state.tab}">${labels[id]}</button>`).join("");
    els.tabPanel.innerHTML = tabs[state.tab];
  }

  function renderFeatures() {
    if (!els.features) return;
    els.features.innerHTML = [
      "Calce deportivo y cómodo",
      "Diseño pensado para uso diario",
      "Variantes preparadas para Shopify",
      "Ofertas preparadas para Protocol Data Product Sets"
    ].map((item) => `<div class="feature-item"><span class="feature-item__check">✓</span><span>${item}</span></div>`).join("");
  }

  function renderDescription() {
    if (!els.description) return;
    els.description.innerHTML = `<h2>${product.title}</h2><p>${product.subtitle}. Esta es una descripción temporal para evaluar visualmente la Product Page completa.</p><p>Cuando el sitio se migre a Shopify, esta superficie renderizará la descripción enriquecida del editor del producto y sus contenidos asociados.</p><ul><li>Shopify será la fuente del contenido descriptivo.</li><li>Los metafields podrán alimentar presentación y tabs.</li><li>Protocol Data conservará la identidad de Offer y Product Set.</li></ul>`;
  }

  function updateDelivery() {
    if (!els.delivery) return;
    try {
      const saved = JSON.parse(sessionStorage.getItem(locationKey) || "null");
      els.delivery.textContent = saved ? `Enviar a ${saved.visibleLabel} · CP ${saved.postalCode}` : "Llega entre mañana y el sábado";
    } catch {
      els.delivery.textContent = "Llega entre mañana y el sábado";
    }
  }

  function readSupport() {
    try { return JSON.parse(sessionStorage.getItem(supportKey) || "null"); } catch { return null; }
  }
  function writeSupport(data) {
    try { sessionStorage.setItem(supportKey, JSON.stringify(data)); } catch {}
  }

  function renderSupportMessages(session) {
    if (!els.supportMessages) return;
    els.supportMessages.innerHTML = session.messages.map((message) => `
      <div class="product-support-message ${message.role === "customer" ? "product-support-message--customer" : "product-support-message--operator"}">
        <span class="product-support-message__sender">${message.role === "customer" ? session.customer.name : "Operador"}</span>
        <div class="product-support-message__bubble"></div>
      </div>
    `).join("");
    qsa(".product-support-message__bubble", els.supportMessages).forEach((bubble, index) => {
      bubble.textContent = session.messages[index].text;
    });
    els.supportMessages.scrollTop = els.supportMessages.scrollHeight;
  }

  function sendSupportMessage(text) {
    const clean = String(text || "").trim();
    if (!clean) return;
    const session = readSupport();
    if (!session) return;
    session.messages.push({ role: "customer", text: clean, createdAt: new Date().toISOString() });
    writeSupport(session);
    renderSupportMessages(session);
  }

  function renderQuickQuestions() {
    if (!els.supportQuickQuestions) return;
    const questions = ["¿Qué talle me recomendás?", "¿Qué incluye exactamente esta oferta?", "¿Cuánto tarda el envío?"];
    els.supportQuickQuestions.innerHTML = "";
    questions.forEach((question) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "product-support-quick-question";
      button.textContent = question;
      button.addEventListener("click", () => sendSupportMessage(question));
      els.supportQuickQuestions.appendChild(button);
    });
  }

  function showSupportChat(session) {
    if (els.supportFormView) els.supportFormView.hidden = true;
    if (els.supportChatView) els.supportChatView.hidden = false;
    renderSupportMessages(session);
    renderQuickQuestions();
  }

  function openSupport() {
    if (!els.supportBackdrop) return;
    setImage(els.supportProductImage, selectedMedia().src, product.title);
    if (els.supportProductTitle) els.supportProductTitle.textContent = product.title;
    if (els.supportProductPrice) els.supportProductPrice.textContent = money(selectedOffer().price);
    const session = readSupport();
    if (session) showSupportChat(session);
    else {
      if (els.supportFormView) els.supportFormView.hidden = false;
      if (els.supportChatView) els.supportChatView.hidden = true;
    }
    els.supportBackdrop.hidden = false;
    requestAnimationFrame(() => els.supportBackdrop.classList.add("is-open"));
    document.body.classList.add("no-scroll");
  }

  function closeSupport() {
    if (!els.supportBackdrop) return;
    els.supportBackdrop.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    setTimeout(() => { els.supportBackdrop.hidden = true; }, 190);
  }

  function startSupport(event) {
    event.preventDefault();
    const name = (els.supportName?.value || "").trim();
    const email = (els.supportEmail?.value || "").trim();
    let valid = true;
    if (name.length < 3) { if (els.supportNameError) { els.supportNameError.hidden = false; els.supportNameError.textContent = "Ingresá tu nombre y apellido."; } valid = false; }
    else if (els.supportNameError) els.supportNameError.hidden = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { if (els.supportEmailError) { els.supportEmailError.hidden = false; els.supportEmailError.textContent = "Ingresá un correo válido."; } valid = false; }
    else if (els.supportEmailError) els.supportEmailError.hidden = true;
    if (!valid) return;
    const firstName = name.split(/\s+/)[0];
    const session = {
      customer: { name, email },
      product: { id: product.id, title: product.title },
      messages: [{ role: "operator", text: `Hola ${firstName}, ¿qué te gustaría saber de ${product.title}?`, createdAt: new Date().toISOString() }]
    };
    writeSupport(session);
    showSupportChat(session);
  }

  function openLocation() {
    if (!els.locationBackdrop) return;
    els.locationBackdrop.hidden = false;
    requestAnimationFrame(() => els.locationBackdrop.classList.add("is-open"));
    document.body.classList.add("no-scroll");
  }
  function closeLocation() {
    if (!els.locationBackdrop) return;
    els.locationBackdrop.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    setTimeout(() => { els.locationBackdrop.hidden = true; }, 190);
  }

  function addToCart() {
    const line = { productId: product.id, title: product.title, offerId: state.offerId, color: state.color, talle: state.talle, price: selectedOffer().price, quantity: 1 };
    try {
      const current = JSON.parse(sessionStorage.getItem(cartKey) || "[]");
      current.push(line);
      sessionStorage.setItem(cartKey, JSON.stringify(current));
    } catch {}
    toast(`${product.title} agregado al carrito.`);
  }

  function bind() {
    els.thumbnailRail?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-media-id]");
      if (!button) return;
      state.mediaId = button.dataset.mediaId;
      renderGallery();
    });
    els.options?.addEventListener("click", (event) => {
      const color = event.target.closest("[data-color]");
      const size = event.target.closest("[data-size]");
      if (color) { state.color = color.dataset.color; state.mediaId = color.dataset.mediaId; renderOptions(); renderGallery(); }
      if (size) { state.talle = size.dataset.size; renderOptions(); }
    });
    els.offers?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-offer-id]");
      if (!button) return;
      state.offerId = button.dataset.offerId;
      renderOffers(); renderPrice();
    });
    els.tabsRail?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-tab-id]");
      if (!button) return;
      state.tab = button.dataset.tabId;
      renderTabs();
    });
    els.supportButton?.addEventListener("click", openSupport);
    els.closeSupport?.addEventListener("click", closeSupport);
    els.supportBackdrop?.addEventListener("click", (event) => { if (event.target === els.supportBackdrop) closeSupport(); });
    els.supportForm?.addEventListener("submit", startSupport);
    els.supportMessageForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = els.supportMessageInput?.value || "";
      sendSupportMessage(text);
      if (els.supportMessageInput) els.supportMessageInput.value = "";
    });
    els.locationTrigger?.addEventListener("click", openLocation);
    els.locationClose?.addEventListener("click", closeLocation);
    els.locationBackdrop?.addEventListener("click", (event) => { if (event.target === els.locationBackdrop) closeLocation(); });
    els.locationForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const postalCode = (els.postalCode?.value || "").trim().toUpperCase();
      const address = (els.streetAddress?.value || "").trim();
      if (!/^(?:\d{4}|[A-Z]\d{4}[A-Z]{3})$/.test(postalCode)) { toast("Ingresá un CP válido."); return; }
      const saved = { postalCode, address, visibleLabel: address || `CP ${postalCode}`, savedAt: new Date().toISOString() };
      try { sessionStorage.setItem(locationKey, JSON.stringify(saved)); } catch {}
      updateDelivery(); closeLocation(); toast(`Ubicación guardada: ${saved.visibleLabel}.`);
    });
    els.addToCart?.addEventListener("click", addToCart);
    els.gallery?.addEventListener("click", () => els.thumbnailRail?.scrollIntoView({ behavior: "smooth", block: "center" }));
    els.readMore?.addEventListener("click", () => {
      const expanded = els.detailSection?.classList.toggle("is-expanded");
      if (els.readMore) els.readMore.textContent = expanded ? "Ver menos" : "Leer más";
    });
    els.reviews?.addEventListener("click", () => toast("4.8 ★ · 128 reseñas temporales."));
    els.phoneSupport?.addEventListener("click", () => toast("Canal telefónico reservado."));
    els.favorite?.addEventListener("click", () => { els.favorite.classList.toggle("is-favorite"); });
    els.share?.addEventListener("click", async () => {
      try {
        if (navigator.share) await navigator.share({ title: product.title, text: product.subtitle, url: location.href });
        else { await navigator.clipboard.writeText(location.href); toast("Enlace copiado."); }
      } catch {}
    });
  }

  function init() {
    renderIdentity();
    renderGallery();
    renderOptions();
    renderOffers();
    renderPrice();
    renderTabs();
    renderFeatures();
    renderDescription();
    updateDelivery();
    bind();
    document.documentElement.dataset.productRuntime = "v4";
  }

  init();
})();
