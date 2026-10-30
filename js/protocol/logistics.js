export async function resolveShippingForLocation(location) {
  return {
    status: "not_integrated",
    authority: "none-currently",
    targetAuthority: "Protocol Data Logistics",
    location,
    publicMessage: "La integración logística todavía no está activa.",
  };
}
