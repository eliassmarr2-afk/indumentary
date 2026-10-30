# INDUMENTARY — DESIGN BRIEF

**Fecha:** 2026-10-30  
**Estado:** APPROVED FOR FIRST BUILD

---

## 1. DIRECCIÓN VISUAL

Concepto:

> **Deportivo contemporáneo, monocromático, producto-first, fotografía editorial, navegación silenciosa y acciones comerciales claras.**

La referencia visual inicial se utiliza como inspiración de jerarquía, cards, producto, variantes y mobile; no como copia literal de la Home.

---

## 2. PALETA BASE

```text
PAGE BACKGROUND
= #EDEDED

CARD / SURFACE
= #FFFFFF

PRIMARY STRUCTURAL COLOR
= #000000 / near-black

TEXT
= black / dark neutral

ACCENT
= restrained / to be defined by final brand
```

El sitio no será “todo oscuro”.

El negro funcionará como autoridad visual sobre una base clara.

---

## 3. SUPERFICIES

Contrato inicial:

```text
cards
= white

borders
= none unless functionally necessary

shadows
= none

border-radius
= 8px default for main cards
```

Las tarjetas de combo no tendrán borde ni sombra.

---

## 4. TIPOGRAFÍA

```text
FONT FAMILY
=
Manrope
```

Se replica la tipografía base utilizada en el ecommerce de referencia/camping (`ecommerce-v2/css/base.css`).

Fallback previsto:

```text
"Manrope", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

No se sustituirá por Arial/Inter u otra familia por conveniencia sin una nueva decisión.

---

## 5. HEADER

Composición:

```text
LEFT
= hamburger

CENTER / BRAND
= utility logo placeholder

RIGHT
= cart icon
```

El header será limpio y de baja distracción.

---

## 6. HAMBURGER MENU

Cada entrada principal deberá admitir icono.

Contenido:

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

---

## 7. LOCATION SURFACE

Debajo del header:

- icono de ubicación;
- contenedor gris pastel;
- texto inicial: `¿A dónde lo enviamos?`.

Al seleccionarlo abre popup.

Popup:

- código postal;
- futuro autocompletado;
- dirección opcional;
- CTA de confirmación.

Cuando exista contexto:

```text
Enviar a {ubicación}
```

La misma ubicación será reutilizable en Product Page durante la sesión.

---

## 8. SEARCH

Buscador independiente antes del hero.

Visualmente simple, prominente y sin competir con el banner.

Arquitectónicamente desacoplado para Shopify/current provider.

---

## 9. HERO

Imagen principal:

```text
APPROXIMATE ASPECT
= 16:9 / visually wide
```

Debe tener más presencia que el banner pequeño de la referencia inicial.

Prioridad:

- fotografía de campaña;
- indumentaria protagonista;
- copy breve;
- CTA claro cuando corresponda.

Desktop y mobile utilizarán composiciones adaptadas; mobile no será simplemente el desktop comprimido.

---

## 10. CATEGORY SECTION

Orden inicial:

```text
Camisetas
Pantalones
Camperas
Gorras y Pilusos
Medias
Botines
Pelotas
```

Objetivo visual posterior:

- imagen circular;
- representación 3D del elemento;
- label de categoría;
- navegación clara.

---

## 11. COMBO SECTION

Título exacto de trabajo:

> **Llevá tu combo | Vestite increíble en una sola compra**

Cantidad inicial:

```text
3 CARDS
```

Comportamiento:

- horizontal scroll;
- card ancha y poco alta;
- relación visual aproximada 16:9.

Composición:

```text
LEFT 1/3
= image

RIGHT 2/3
= commercial content
```

Imagen:

- ocupa todo su tercio;
- sin padding visual;
- respeta radius solo en esquinas izquierdas;
- radius derecho de imagen = 0.

Contenido:

- título;
- subtítulo;
- 5 estrellas negras en negrita visual;
- precio actual;
- precio anterior tachado;
- CTA `Ver oferta →`.

Card:

```text
background: #FFFFFF
border: none
shadow: none
radius: 8px
```

---

## 12. PRODUCT CARDS

Cantidad inicial:

```text
6 PRODUCT CARDS
```

Distribución desktop inicial:

```text
2 PER ROW
```

Con separación visual suficiente.

Estructura:

```text
TOP HALF
= product image

BOTTOM CONTENT
= title
  subtitle
  5 black stars
  green delivery badge

DIVIDER

PRICE / TRUST AREA
= Mercado Pago badge
  price
```

Badge de envío:

```text
background = green
color = white
border-radius = 0
text = “Llega a tu dirección”
```

El badge deberá poder evolucionar a contenido real de Logistics; durante mock no debe presentarse como una promesa canónica si no existe resolución real.

La línea divisoria deberá ir de lado a lado dentro del contenido de la tarjeta.

---

## 13. PRODUCT PAGE DIRECTION

Referencia visual a preservar conceptualmente:

```text
media
name
subtitle/category
price
color
size
size guide
shipping
cart CTA
```

En indumentaria:

- color puede usar swatches;
- talle puede usar XS/S/M/L/XL/XXL u otras escalas según producto.

---

## 14. MOBILE

Mobile es first-class.

Se diseñará desde el mismo build para:

- header;
- menu;
- location popup;
- search;
- hero;
- category scroll/grid;
- combo scroll;
- product cards;
- product page;
- future public surfaces.

---

## 15. DESIGN GUARD

No agregar decoración, sombras, gradientes, colores de acento o radios extra solo para “hacerlo más moderno”.

La indumentaria y la fotografía deben generar personalidad; la interfaz debe permanecer silenciosa.
