const CART_KEY = "indumentary.cart.v2";

function readCart() {
  try {
    const raw = sessionStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items) {
  sessionStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("indumentary:cart-change", { detail: items }));
}

export function getCartCount() {
  return readCart().reduce((total, item) => total + (Number(item.quantity) || 0), 0);
}

function sameCommercialSelection(item, productId, context) {
  return item.productId === productId
    && (item.offerId || null) === (context.offerId || null)
    && (item.providerVariantId || null) === (context.providerVariantId || null)
    && JSON.stringify(item.selectedOptions || {}) === JSON.stringify(context.selectedOptions || {});
}

export function addToCart(productId, quantity = 1, context = {}) {
  const items = readCart();
  const existing = items.find((item) => sameCommercialSelection(item, productId, context));

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({
      productId,
      quantity,
      offerId: context.offerId || null,
      protocolOfferId: context.protocolOfferId || null,
      providerVariantId: context.providerVariantId || null,
      selectedOptions: context.selectedOptions || {},
      unitPrice: context.unitPrice ?? null,
      source: context.source || "storefront_mock",
    });
  }

  writeCart(items);
  return items;
}

export function getCartItems() {
  return readCart();
}
