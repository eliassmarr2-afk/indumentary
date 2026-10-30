import { products } from "./catalog.js";

const DEFAULT_TABS_JSON = JSON.stringify([
  {
    id: "caracteristicas",
    label: "Características",
    contentHtml: "<h3>Características</h3><ul><li>Diseño deportivo de uso diario.</li><li>Calce cómodo y terminaciones limpias.</li><li>Contenido temporal preparado para ser reemplazado desde Shopify.</li></ul>"
  },
  {
    id: "talles",
    label: "Guía de talles",
    contentHtml: "<h3>Guía de talles</h3><p>Esta tabla es temporal y representa el contenido que luego podrá provenir de la configuración de Shopify.</p><table><thead><tr><th>Talle</th><th>Pecho</th><th>Largo</th></tr></thead><tbody><tr><td>S</td><td>96-100 cm</td><td>68 cm</td></tr><tr><td>M</td><td>100-104 cm</td><td>70 cm</td></tr><tr><td>L</td><td>104-110 cm</td><td>72 cm</td></tr></tbody></table>"
  },
  {
    id: "cuidados",
    label: "Cuidados",
    contentHtml: "<h3>Cuidados</h3><p>Lavar con colores similares, evitar blanqueadores y respetar las indicaciones de la etiqueta.</p>"
  }
]);

function imageVariant(src, suffix = "") {
  if (!src || !suffix) return src;
  const joiner = src.includes("?") ? "&" : "?";
  return `${src}${joiner}${suffix}`;
}

function mediaFor(product) {
  const base = product.image;
  return [
    base,
    imageVariant(base, "sat=-12&con=6"),
    imageVariant(base, "bri=5&con=10"),
    imageVariant(base, "sat=-30&bri=8")
  ].filter(Boolean).map((src, index) => ({
    id: `${product.id}-media-${index + 1}`,
    src,
    alt: `${product.title} · imagen temporal ${index + 1}`
  }));
}

function makeOffers(product) {
  return [
    {
      id: `${product.id}-single`,
      protocolOfferId: `demo-offer-${product.id}-single`,
      providerVariantId: `mock-provider-${product.id}-single`,
      label: "1 unidad",
      subtitle: "Compra individual",
      badge: "",
      price: product.price,
      compareAt: null
    },
    {
      id: `${product.id}-x2`,
      protocolOfferId: `demo-offer-${product.id}-x2`,
      providerVariantId: `mock-provider-${product.id}-x2`,
      label: "Pack x2",
      subtitle: "Dos unidades · ahorro temporal",
      badge: "AHORRÁ 10%",
      price: Math.round(product.price * 1.8),
      compareAt: product.price * 2
    },
    {
      id: `${product.id}-look`,
      protocolOfferId: `demo-offer-${product.id}-look`,
      providerVariantId: `mock-provider-${product.id}-look`,
      label: "Look completo",
      subtitle: "Oferta preparada para vincular a Product Set",
      badge: "MEJOR OFERTA",
      price: Math.round(product.price * 2.35),
      compareAt: Math.round(product.price * 2.65)
    }
  ];
}

function buildDetail(product) {
  const media = mediaFor(product);

  return {
    ...product,
    shortDescription: `${product.subtitle}. Esta información es temporal y existe para visualizar la Product Page antes de conectar Shopify.`,
    rating: 4.8,
    reviewCount: 128,
    buyers: 420,
    deliveryDays: 2,
    deliveryLabel: "Llega entre mañana y el sábado",
    seller: {
      name: "IND.",
      subtitle: "Tienda oficial"
    },
    media,
    options: [
      {
        id: "color",
        label: "Color",
        type: "image",
        values: [
          { id: "opcion-1", label: "Opción 1", value: "opcion-1", image: media[0]?.src },
          { id: "opcion-2", label: "Opción 2", value: "opcion-2", image: media[1]?.src || media[0]?.src },
          { id: "opcion-3", label: "Opción 3", value: "opcion-3", image: media[2]?.src || media[0]?.src },
          { id: "opcion-4", label: "Opción 4", value: "opcion-4", image: media[3]?.src || media[0]?.src }
        ]
      },
      {
        id: "talle",
        label: "Talle",
        type: "button",
        values: ["XS", "S", "M", "L", "XL", "XXL"].map((value) => ({
          id: value.toLowerCase(),
          label: value,
          value
        }))
      }
    ],
    offers: makeOffers(product),
    features: [
      "Calce deportivo y cómodo",
      "Diseño pensado para uso diario",
      "Variantes preparadas para Shopify",
      "Ofertas preparadas para Protocol Data Product Sets"
    ],
    supportQuestions: [
      "¿Qué talle me recomendás?",
      "¿Qué incluye exactamente esta oferta?",
      "¿Cuánto tarda el envío?"
    ],
    tabsJson: DEFAULT_TABS_JSON,
    descriptionHtml: `<h2>${product.title}</h2><p>${product.subtitle}. Esta es una descripción temporal para poder evaluar visualmente la landing completa. Cuando el sitio se migre a Shopify, esta superficie renderizará el contenido enriquecido definido en el editor del producto.</p><p>Puede contener párrafos, títulos, listas, enlaces, tablas e imágenes permitidas sin convertir ese HTML en autoridad sobre la composición comercial.</p><ul><li>Shopify será la fuente del contenido descriptivo.</li><li>Los metafields podrán alimentar presentación y tabs.</li><li>Protocol Data conservará la identidad de Offer y Product Set.</li></ul>`
  };
}

export function getProductDetail(productId) {
  const product = products.find((item) => item.id === productId) || products[1] || products[0];
  return product ? buildDetail(product) : null;
}

export function parseTabsJson(rawJson) {
  try {
    const parsed = typeof rawJson === "string" ? JSON.parse(rawJson) : rawJson;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((tab) => tab && typeof tab.id === "string" && typeof tab.label === "string");
  } catch {
    return [];
  }
}
