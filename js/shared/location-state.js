const LOCATION_KEY = "indumentary.sessionLocation.v1";

export function getSessionLocation() {
  try {
    const raw = sessionStorage.getItem(LOCATION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSessionLocation({ postalCode, address }) {
  const cleanPostalCode = String(postalCode || "").trim().toUpperCase();
  const cleanAddress = String(address || "").trim();
  const location = {
    postalCode: cleanPostalCode,
    address: cleanAddress,
    visibleLabel: cleanAddress || `CP ${cleanPostalCode}`,
    savedAt: new Date().toISOString(),
  };

  sessionStorage.setItem(LOCATION_KEY, JSON.stringify(location));
  window.dispatchEvent(new CustomEvent("indumentary:location-change", { detail: location }));
  return location;
}

export function clearSessionLocation() {
  sessionStorage.removeItem(LOCATION_KEY);
  window.dispatchEvent(new CustomEvent("indumentary:location-change", { detail: null }));
}
