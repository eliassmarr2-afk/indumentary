# INDUMENTARY — PROJECT DECISIONS

**Estado:** ACTIVE SITE DECISION LOG

Este archivo registra decisiones específicas de `indumentary`. No sustituye la documentación central de SITIOS WEB DE NICHO.

---

## I-001 — El repo representa el vertical Indumentaria

`indumentary` es el modelo maestro del vertical **Indumentaria**.

La primera expresión comercial será indumentaria deportiva, pero el repo no queda limitado arquitectónicamente a una sola marca o cliente.

---

## I-002 — El nombre técnico del repo es `indumentary`

GitHub no permitió utilizar `indumentaria`.

La identidad conceptual sigue siendo:

```text
VERTICAL = INDUMENTARIA
REPO = indumentary
```

---

## I-003 — Stack inicial simple y migrable

Primera construcción:

```text
HTML + CSS + JavaScript
```

No se adopta framework por anticipado.

---

## I-004 — Shopify no es el motor inicial

```text
CURRENT COMMERCE ENGINE
=
MOCK / DEVELOPMENT ONLY

SHOPIFY STATUS
=
SHOPIFY COMPATIBLE
```

La migración/integración real se realizará después de validar el modelo comercial y los mappings.

---

## I-005 — Protocol Data permanece externo

El repo no copia Protocol Data V2.

Cada dominio se conectará mediante su boundary/adapter cuando corresponda.

---

## I-006 — La ubicación es contexto de sesión compartido

La ubicación ingresada en Home o Product Page deberá reutilizarse en las demás superficies de envío durante la misma sesión.

```text
HOME LOCATION
↔ PRODUCT PAGE LOCATION
```

La ubicación de sesión no es autoridad de tarifa/promesa logística.

---

## I-007 — Logistics será autoridad de shipping

Cuando se active la integración:

```text
SESSION LOCATION CONTEXT
→ SHIPPING ADAPTER
→ PROTOCOL DATA LOGISTICS
```

No habrá segundo Shipping Resolver dentro del storefront.

---

## I-008 — Search queda desacoplado del provider

```text
SEARCH UI
→ COMMERCE SEARCH ADAPTER
→ CURRENT PRODUCT SOURCE
```

Primera fase local/mock; futura fuente Shopify/provider.

---

## I-009 — Dirección visual monocromática y producto-first

Base:

```text
PAGE = #F0E9DF
SURFACE = #FFFFFF
PRIMARY STRUCTURE = BLACK
```

El canvas utiliza beige suave para diferenciar claramente las cards blancas sin competir con la fotografía.

Cards principales sin sombra ni borde decorativo.

Default card radius = 8px.

---

## I-010 — Tipografía Manrope

La familia tipográfica base será **Manrope**, replicando el ecommerce de referencia/camping.

No se reemplaza silenciosamente por otra familia.

---

## I-011 — Home mínima acordada

La primera Home contiene:

```text
Header
Hamburger menu
Cart
Location surface
Search
Hero
Categories
Combo carousel
6 product cards
Policy/footer access
```

---

## I-012 — Categorías iniciales

```text
Camisetas
Pantalones
Camperas
Gorras y Pilusos
Medias
Botines
Pelotas
```

---

## I-013 — Combos son objetos comerciales, no HTML authority

Las tres combo cards son presentación.

Su futura composición deberá poder mapearse a Product Set / Commercial Offer sin usar el DOM como fuente de verdad.

---

## I-014 — Mobile y desktop se construyen juntos

No se cerrará desktop para adaptar mobile después.

Ambos son parte del mismo build.

---

## I-015 — El repo maestro no se convierte en un cliente

Los clientes reales deberán derivar/adaptar el vertical sin reemplazar `indumentary` por la implementación particular de una única marca.

---

## I-016 — La estructura de código separa responsabilidades desde Build 01

Se adopta desde el primer build:

```text
index.html
css/
  base.css
  home.css
js/
  app.js
  commerce/
  protocol/
  config/
  shared/
```

La UI no concentra catálogo, carrito, estado de sesión, Protocol Data y configuración en un único archivo.

Esta separación existe para facilitar escala, mantenimiento, reutilización y futura migración a Shopify / Protocol Data.

---

## I-017 — Los assets del Build 01 son provisionales

Las imágenes iniciales son material visual de referencia para revisar layout, proporciones y densidad.

No constituyen los creativos finales del vertical.

Se podrán reemplazar sin modificar la arquitectura de Home.

---

## I-018 — El badge de entrega es demo hasta Logistics live

La tarjeta puede representar visualmente el badge `Llega a tu dirección`, pero mientras Logistics no esté integrado debe marcarse como demo/pending resolution.

El storefront no transforma el mock en promesa logística canónica.

---

## I-019 — Home Build 01 queda materializado para revisión visual

Build 01 incluye:

```text
header + menu
session location popup
provider-decoupled search
hero
7 categories
3 combo cards
6 product cards
policy/footer access
responsive desktop/mobile
local Event Layer seam
```

El siguiente movimiento es revisión visual y publicación del preview, no incorporación automática de nuevas superficies.

---

## I-020 — Los rails horizontales mobile usan el viewport como límite físico

Los scrollers horizontales de categorías, combos y futuras superficies equivalentes no deben desaparecer dentro del padding lateral del contenido.

En mobile:

```text
FIRST ITEM ALIGNMENT
= PAGE CONTENT

SCROLL CLIPPING EDGE
= PHYSICAL VIEWPORT EDGE
```

Esto maximiza el ancho útil sin romper la alineación inicial del layout.

---

## I-021 — El fondo general pasa a beige suave

Se reemplaza el gris `#EDEDED` por:

```text
PAGE BACKGROUND
=
#F0E9DF
```

Las superficies comerciales permanecen en `#FFFFFF` para conservar contraste limpio y lectura inmediata.
