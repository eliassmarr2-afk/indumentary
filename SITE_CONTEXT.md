# INDUMENTARY — SITE CONTEXT

**Fecha:** 2026-10-30  
**Vertical:** INDUMENTARIA  
**Primera expresión comercial:** INDUMENTARIA DEPORTIVA  
**Estado:** INITIALIZED / CONSTRUCTION NOT YET STARTED

---

## 1. PROPÓSITO DEL REPO

`indumentary` es el modelo reutilizable del vertical **Indumentaria** dentro de SITIOS WEB DE NICHO.

La primera construcción tendrá estética y catálogo de indumentaria deportiva, pero el repositorio debe poder adaptarse posteriormente a otros comercios de ropa sin rehacer su arquitectura.

No representa a un cliente final concreto.

---

## 2. MERCADO INICIAL

La primera versión se diseña con una experiencia comercial compatible con Argentina:

- moneda/display de precios en pesos como mock inicial;
- Mercado Pago como referencia visible de compra segura;
- consulta de envío por código postal;
- domicilio opcional dentro del contexto de ubicación del usuario.

Una implementación para un cliente puede reemplazar mercado, moneda, medios de pago, políticas y contenido mediante configuración/adapters.

---

## 3. MARCA

```text
FINAL BRAND
=
NOT YET DEFINED

LOGO
=
UTILITY / PLACEHOLDER DURING MODEL CONSTRUCTION
```

El sitio no debe acoplar su arquitectura al nombre o logo de una marca temporal.

---

## 4. DIRECCIÓN COMERCIAL

Tienda ecommerce de indumentaria deportiva con navegación limpia, producto-first y fotografía protagonista.

La navegación y superficies serán deliberadamente neutras para permitir adaptación rápida a diferentes marcas del vertical.

---

## 5. CATEGORÍAS INICIALES

La Home reservará las siguientes categorías visuales:

1. Camisetas
2. Pantalones
3. Camperas
4. Gorras y Pilusos
5. Medias
6. Botines
7. Pelotas

La intención visual futura es utilizar representaciones/imágenes circulares 3D para cada categoría.

---

## 6. NAVEGACIÓN PRINCIPAL

Header:

```text
LEFT
= hamburger menu

CENTER / BRAND AREA
= utility logo for now

RIGHT
= cart icon
```

Menú hamburguesa acordado:

```text
INICIO

COLECCIONES
  CAMISETAS
  CAMPERAS
  PANTALONES
  MEDIAS
  BOTINES
  GORRAS Y PILUSOS

CUPONES
NOVEDADES

---

SABER DE MI ENVÍO
SOPORTE

---

POLÍTICAS
  ENVÍO
  DEVOLUCIÓN O CAMBIOS
  NAVEGACIÓN / MEDICIÓN
  PRIVACIDAD / DATOS
  TÉRMINOS COMERCIALES
  TÉRMINOS DE USO
```

Los ítems principales/subítems deberán contar con iconografía coherente cuando se implemente la UI.

---

## 7. UBICACIÓN / SHIPPING CONTEXT

Justo debajo del header existirá una superficie con fondo gris pastel e icono de ubicación:

```text
¿A dónde lo enviamos?
```

Al activarla se abrirá un popup de ubicación.

El popup deberá contemplar:

- código postal;
- autocompletado futuro;
- dirección opcional;
- confirmación de ubicación.

La ubicación confirmada formará un **Session Location Context** compartido por todo el storefront.

Comportamiento requerido:

```text
HOME LOCATION
↔
PRODUCT PAGE LOCATION
↔
OTHER SHIPPING-AWARE SURFACES
```

Si el usuario define su ubicación en Home, Product Page debe reutilizarla.

Si la define en Product Page, Home debe reutilizarla durante la misma sesión.

La UI podrá decir, por ejemplo:

```text
Enviar a {ubicación visible}
```

El mecanismo técnico exacto de persistencia no queda congelado todavía.

Este contexto del browser no es autoridad logística. Cuando Logistics se active:

```text
SESSION LOCATION CONTEXT
→ LOGISTICS ADAPTER
→ PROTOCOL DATA LOGISTICS SHIPPING RESOLVER
→ CANONICAL SHIPPING RESULT
→ STOREFRONT
```

---

## 8. BÚSQUEDA

Antes del banner principal existirá un buscador independiente de productos.

Primera fase:

```text
MOCK / LOCAL PRODUCT DATA
```

Objetivo:

```text
SEARCH UI
→ COMMERCE SEARCH ADAPTER
→ SHOPIFY / CURRENT COMMERCE PROVIDER
```

La búsqueda no debe depender de títulos hardcodeados en la UI como arquitectura definitiva.

---

## 9. HOME — COMPOSICIÓN MÍNIMA

Orden inicial:

```text
HEADER
LOCATION SURFACE
SEARCH
HERO BANNER
CATEGORY CIRCLES
COMBO SECTION
PRODUCT GRID
POLICIES / FOOTER ACCESS
```

### Hero

Imagen principal aproximadamente 16:9, visualmente ancha, con campaña/fotografía deportiva como protagonista.

### Combos

Título:

> **Llevá tu combo | Vestite increíble en una sola compra**

Tres tarjetas horizontales scrollables.

Cada tarjeta:

```text
LEFT 1/3
= image full-bleed

RIGHT 2/3
= title
  subtitle
  5 black stars
  current value
  crossed previous value
  “Ver oferta →”
```

### Productos

Seis tarjetas en total, dos por fila/sección horizontal en la primera composición.

Contenido:

```text
IMAGE AREA
TITLE
SUBTITLE
5 BLACK STARS
GREEN BADGE: “Llega a tu dirección”
DIVIDER
MERCADO PAGO BADGE / PURCHASE TRUST
PRICE
```

---

## 10. FUTURAS PRODUCT PAGES

Las fichas deberán estar preparadas para:

- imágenes;
- nombre/subtítulo;
- precio;
- color;
- talle;
- guía de talles;
- Shipping Surface reutilizando Session Location Context;
- carrito;
- Product/Offer/Variant mapping.

Talles de referencia iniciales podrán incluir XS/S/M/L/XL/XXL según producto.

---

## 11. REGLA COMERCIAL DEL MODELO

Este repo es un **vertical master/demo asset**.

Cuando exista un cliente real, la implementación comercial del cliente deberá derivarse/adaptarse sin convertir el modelo maestro en el sitio particular de una sola empresa.
