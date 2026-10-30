# INDUMENTARY — PRODUCT PAGE CONTRACT

**Fecha:** 2026-10-30  
**Estado:** IMPLEMENTATION BASE / SITE-SPECIFIC

---

## 1. PROPÓSITO

La Product Page de `indumentary` es una superficie comercial preparada para integrar Shopify y Protocol Data sin colapsar identidades ni ownership.

Visualmente toma como referencia una ficha mobile producto-first con media protagonista, controles compactos y CTA fuerte.

---

## 2. ORDEN DE LA PÁGINA

```text
GLOBAL HEADER
PRODUCT MEDIA
THUMBNAIL MEDIA RAIL
PRODUCT TITLE / CATEGORY / RATING / PRICE
STANDARD OPTIONS
COMMERCIAL OFFER CARDS
SHIPPING / SESSION LOCATION
TRUST / PAYMENT CONTEXT
ADD TO CART
STICKY TABS
TAB CONTENT
SHOPIFY PRODUCT DESCRIPTION HTML
```

`DESCRIPTION` permanece como último bloque de contenido comercial de la Product Page.

---

## 3. MEDIA OWNERSHIP

Objetivo integrado:

```text
PRODUCT MEDIA SOURCE
=
SHOPIFY
```

Las imágenes reales de producto no deben almacenarse por defecto en GitHub.

El storefront renderiza:

```text
MAIN IMAGE
+
THUMBNAIL RAIL
```

Seleccionar una thumbnail cambia la media principal.

Los assets actuales son mocks remotos de development.

---

## 4. DESCRIPTION OWNERSHIP

Objetivo integrado:

```text
SHOPIFY PRODUCT DESCRIPTION
=
CONTENT SOURCE

STOREFRONT
=
RENDERER
```

El contenido enriquecido debe poder preservar estructura HTML razonable del editor Shopify.

La implementación local incluye sanitización allowlist para contenido enriquecido.

La descripción no posee Product Set composition ni Offer identity.

---

## 5. TABS

Los tabs son presentation content configurable.

Modelo conceptual:

```text
SHOPIFY METAFIELD / JSON CONFIG
→ COMMERCE ADAPTER
→ NORMALIZED TAB MODEL
→ STOREFRONT TAB RENDERER
```

La UI soporta cantidad variable de tabs, labels variables, contenido HTML enriquecido, scroll horizontal y sticky behavior.

El schema mock actual utiliza:

```json
[
  {
    "id": "caracteristicas",
    "label": "Características",
    "contentHtml": "<p>...</p>"
  }
]
```

Este schema es de development y no congela nombres Shopify runtime. Antes de integración se revalida el contrato/metafield definitivo.

---

## 6. STANDARD OPTIONS VS COMMERCIAL OFFER

No se colapsan:

```text
COLOR / SIZE / NICHE OPTION
!=
COMMERCIAL OFFER
```

La UI puede presentar ambos dentro de la misma Product Page.

---

## 7. OFFER CARDS

Las Offer Cards son presentación comercial variable.

Cada selección mock preserva explícitamente:

```text
offerId
protocolOfferId
providerVariantId
selectedOptions
```

En integración real:

```text
SHOPIFY VARIANT
=
PROVIDER SELLING REPRESENTATION
```

vinculable mediante Provider Binding a:

```text
PROTOCOL COMMERCIAL OFFER
→ PRODUCT SET
→ COMPONENTS
```

La composición Product Set nunca se reconstruye desde DOM, título, descripción o metafields de presentación.

---

## 8. CART SEMANTICS

El carrito de development conserva la selección comercial completa para no fusionar líneas diferentes.

No es todavía Shopify Cart.

Objetivo:

```text
STOREFRONT SELECTION
→ COMMERCE ADAPTER
→ EXACT PROVIDER MERCHANDISE
→ SHOPIFY CART
```

No se implementará fuzzy matching por textos.

---

## 9. SHIPPING

La Product Page reutiliza el mismo Session Location Context de Home.

```text
HOME
   ↘
SESSION LOCATION CONTEXT
   ↗
PRODUCT PAGE
```

La ubicación no es una tarifa.

Cuando Logistics se active:

```text
SESSION LOCATION
→ LOGISTICS ADAPTER
→ PROTOCOL DATA LOGISTICS
→ PUBLIC RESULT
→ PRODUCT PAGE
```

---

## 10. MEASUREMENT

La UI puede emitir semántica como:

```text
product_page_viewed
product_media_selected
product_option_selected
commercial_offer_selected
product_tab_selected
cart_item_added
shipping_location_opened
shipping_location_saved
```

La Event Layer observa interacción; no adquiere autoridad de Products, Orders o Logistics.

---

## 11. CURRENT IMPLEMENTATION STATUS

```text
PRODUCT PAGE UI
=
IMPLEMENTED WITH MOCK DEVELOPMENT DATA

SHOPIFY MEDIA
=
NOT INTEGRATED

SHOPIFY DESCRIPTION
=
NOT INTEGRATED

SHOPIFY TAB METAFIELD
=
NOT INTEGRATED

SHOPIFY CART
=
NOT INTEGRATED

PROTOCOL DATA PRODUCTS BINDINGS
=
RESERVED / NOT ACTIVE

PROTOCOL DATA LOGISTICS
=
RESERVED / NOT ACTIVE
```

La implementación visual y los adapters mock no deben documentarse como integraciones live.
