import { products } from "./catalog.js";

const ARGENTINA_JACKET_FRONT = "https://pl.futbolemotion.com/imagesarticulos/311593/750/chaqueta-adidas-argentina-afa-pre-match-home-mundial-2026-white-white-5.webp";
const ARGENTINA_JACKET_MODEL = "https://www.innovasport.com/medias/1200Wx1200H-NEW-media-gallery-000000000000403197-01-20260429115430.jpg?context=bWFzdGVyfGltYWdlc3w4MjkwNHxpbWFnZS9qcGVnfGFEaG1MMmhpWkM4eU56WXlNREV6TWpRNE56RTVPQzh4TWpBd1YzZ3hNakF3U0Y5T1JWZGZiV1ZrYVdGZloyRnNiR1Z5ZVY4d01EQXdNREF3TURBd01EQTBNRE14T1RkZk1ERmZNakF5TmpBME1qa3hNVFUwTXpBdWFuQm58NmM5ZmU0OGIxZDBkY2Y2MjFmZDZkZTNkZmQ4NWY0ZTNhOWNhNzU1Njc2MmQzZDhmY2QzMTE4ZDk0MWQyMTgwMA";

const PRODUCT_MEDIA = {
  "prod-001": [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=86",
    "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=1400&q=86",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1400&q=86"
  ],
  "prod-002": [
    ARGENTINA_JACKET_FRONT,
    ARGENTINA_JACKET_MODEL,
    ARGENTINA_JACKET_FRONT,
    ARGENTINA_JACKET_MODEL
  ],
  "prod-003": [
    "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1400&q=86",
    "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1400&q=86",
    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1400&q=86"
  ],
  "prod-004": [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=86",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1400&q=86",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1400&q=86"
  ],
  "prod-005": [
    "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1400&q=86",
    "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1400&q=86",
    "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=1400&q=86"
  ],
  "prod-006": [
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1400&q=86",
    "https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&w=1400&q=86",
    "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=1400&q=86"
  ]
};

const DEFAULT_TABS_JSON = JSON.stringify([
  {
    id: "caracteristicas",
    label: "Características",
    contentHtml: "<h3>Diseño pensado para uso diario</h3><ul><li>Calce cómodo y deportivo.</li><li>Materiales seleccionados para uso frecuente.</li><li>Terminaciones limpias y fáciles de combinar.</li></ul>"
  },
  {
    id: "talles",
    label: "Guía de talles",
    contentHtml: "<h3>Elegí tu talle habitual</h3><p>Esta demo representa el contenido configurable que luego podrá provenir de un metafield de Shopify. La tabla definitiva dependerá de cada producto.</p><table><thead><tr><th>Talle</th><th>Pecho</th><th>Largo</th></tr></thead><tbody><tr><td>S</td><td>96-100 cm</td><td>68 cm</td></tr><tr><td>M</td><td>100-104 cm</td><td>70 cm</td></tr><tr><td>L</td><td>104-110 cm</td><td>72 cm</td></tr></tbody></table>"
  },
  {
    id: "cuidados",
    label: "Cuidados",
    contentHtml: "<h3>Cómo cuidarlo</h3><p>Lavar con colores similares y seguir siempre las indicaciones de la etiqueta de la prenda.</p>"
  }
]);

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
      subtitle: "Dos unidades · ahorro demo",
      badge: "AHORRÁ 10%",
      price: Math.round(product.price * 1.8),
      compareAt: product.price * 2
    },
    {
      id: `${product.id}-look`,
      protocolOfferId: `demo-offer-${product.id}-look`,
      providerVariantId: `mock-provider-${product.id}-look`,
      label: "Look completo",
      subtitle: "Oferta comercial vinculable a Product Set",
      badge: "MEJOR OFERTA",
      price: Math.round(product.price * 2.35),
      compareAt: Math.round(product.price * 2.65)
    }
  ];
}

function buildDetail(product) {
  const argentinaDemo = product.id === "prod-002";
  const media = PRODUCT_MEDIA[product.id] || [product.image];

  return {
    ...product,
    title: argentinaDemo ? "Campera Selección Argentina" : product.title,
    subtitle: argentinaDemo ? "Argentina 2026 · fútbol · hombre" : product.subtitle,
    rating: 5,
    reviewCount: 128,
    media: media.map((src, index) => ({
      id: `${product.id}-media-${index + 1}`,
      src,
      alt: `${argentinaDemo ? "Campera Selección Argentina" : product.title} · vista ${index + 1}`
    })),
    options: [
      {
        id: "color",
        label: "Color",
        type: "image",
        values: argentinaDemo ? [
          { id: "blanco-celeste", label: "Blanco / Celeste", value: "blanco-celeste", image: ARGENTINA_JACKET_FRONT },
          { id: "vista-modelo", label: "Argentina", value: "argentina", image: ARGENTINA_JACKET_MODEL },
          { id: "blanco", label: "Blanco", value: "blanco", image: ARGENTINA_JACKET_FRONT },
          { id: "alternativa", label: "Alternativa", value: "alternativa", image: ARGENTINA_JACKET_MODEL }
        ] : media.slice(0, 4).map((src, index) => ({
          id: `color-${index + 1}`,
          label: `Opción ${index + 1}`,
          value: `opcion-${index + 1}`,
          image: src
        }))
      },
      {
        id: "talle",
        label: "Talle",
        type: "button",
        values: ["XS", "S", "M", "L", "XL", "XXL"].map((value) => ({ id: value.toLowerCase(), label: value, value }))
      }
    ],
    offers: makeOffers(product),
    tabsJson: DEFAULT_TABS_JSON,
    descriptionHtml: `<h2>${argentinaDemo ? "Campera Selección Argentina" : product.title}</h2><p>${argentinaDemo ? "Campera deportiva en referencia albiceleste utilizada como contenido demo de la Product Page." : product.subtitle}. Esta descripción ocupa el mismo lugar donde, al integrar Shopify, se renderizará el contenido enriquecido del editor de producto.</p><p>La Product Page no conserva esta descripción como verdad propia: Shopify será la fuente de contenido y el storefront actuará como renderer.</p><ul><li>Contenido enriquecido compatible con encabezados, listas y enlaces.</li><li>La composición de ofertas no se deduce de este HTML.</li><li>Las imágenes reales serán servidas desde Shopify.</li></ul>`
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
