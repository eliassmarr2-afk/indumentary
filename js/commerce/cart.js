const CART_KEY = "indumentary.cart.v1";

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

export function addToCart(productId, quantity = 1) {
  const items = readCart();
  const existing = items.find((item) => item.productId === productId);

  if (existing) existing.quantity += quantity;
  else items.push({ productId, quantity });

  writeCart(items);
  return items;
}

export function getCartItems() {
  return readCart();
}
