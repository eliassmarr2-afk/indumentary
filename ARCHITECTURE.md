# INDUMENTARY — ARCHITECTURE

**Fecha:** 2026-10-30  
**Estado:** SITE INITIALIZATION / FROZEN BASE FOR FIRST BUILD

---

## 1. STACK INICIAL

```text
HTML
CSS
JavaScript
```

La primera versión se construirá sin framework obligatorio.

La elección busca:

- velocidad;
- control visual;
- facilidad de publicación;
- bajo acoplamiento;
- futura adaptación a Shopify.

---

## 2. MODELO DE RESPONSABILIDADES

```text
EXPERIENCE / NICHE UI
        ↓
APPLICATION
        ├─ COMMERCE BOUNDARY
        │      ↓
        │   MOCK DATA NOW / SHOPIFY LATER
        │
        ├─ PROTOCOL DATA BOUNDARIES
        │      ↓
        │   PROTOCOL DATA DOMAINS
        │
        ├─ SITE EVENT LAYER
        │      ↓
        │   MEASUREMENT ADAPTER
        │
        └─ CONTENT / POLICY BOUNDARY
```

La estructura física puede evolucionar. Estas responsabilidades no deben mezclarse de forma irreversible.

---

## 3. FRONTERAS PRINCIPALES

### Experience / UI

Posee:

- layout;
- branding;
- componentes visuales;
- presentación comercial;
- responsive;
- interacción.

No posee autoridad de Products, Orders, Logistics, Support o Experience domain.

### Commerce Boundary

Responsable de centralizar:

- catálogo visible;
- producto/oferta seleccionada;
- variantes;
- talles/colores;
- carrito;
- cantidades;
- búsqueda;
- checkout handoff;
- evidencia provider.

Primera fase: mocks/local data.

Objetivo posterior: Shopify mediante adapter/provider boundary.

### Protocol Data Boundaries

Se reservan separadamente:

```text
Logistics / Shipping
Tracking
Support
Customer Conversation
Experience / Review
Measurement ingest
Products mappings
Orders relation
```

Nunca se crea un adapter genérico que mezcle capabilities o ownership de dominios distintos.

### Policy Content Boundary

La UI de políticas debe consumir contenido desde una fuente identificable y reemplazable.

Primera fase: contenido local/configurado.

---

## 4. SESSION LOCATION CONTEXT

El sitio tendrá un contexto de ubicación de sesión compartido entre las superficies que requieren envío.

Conceptualmente:

```text
LOCATION INPUT
→ SESSION LOCATION CONTEXT
→ SHIPPING-AWARE COMPONENTS
```

Datos previstos:

```text
postal_code
address_optional
visible_location_label
resolved_location_context_when_available
```

Los nombres físicos pueden cambiar durante implementación.

### Reglas

1. Home y Product Page leen/escriben el mismo contexto de sesión.
2. El contexto no es una tarifa logística.
3. El contexto no autoriza a inventar promesas, precio o disponibilidad de envío.
4. Cuando Logistics se active, el adapter enviará únicamente los datos requeridos por el contrato vivo.
5. No se enviará domicilio completo a analytics ordinarios.

---

## 5. SHIPPING FLOW OBJETIVO

```text
USER
→ “¿A dónde lo enviamos?”
→ CP + optional address
→ SESSION LOCATION CONTEXT
→ LOGISTICS / SHIPPING ADAPTER
→ PROTOCOL DATA SHIPPING RESOLVER
→ RESULT
→ SITE PRESENTATION
```

Protocol Data Logistics será autoridad operacional cuando la integración esté activa.

---

## 6. SEARCH FLOW OBJETIVO

```text
SEARCH INPUT
→ COMMERCE SEARCH ADAPTER
→ CURRENT PRODUCT SOURCE
→ RESULTS
```

Fases:

```text
PHASE 1 = local/mock catalog
PHASE 2 = Shopify/current provider products
```

La UI no debe conocer detalles de Shopify para poder buscar.

---

## 7. PRODUCT / OFFER / VARIANT

Se preserva:

```text
SKU
!= PRODUCT SET
!= COMMERCIAL OFFER
!= PROVIDER VARIANT
```

En la primera fase los objetos serán mocks diseñados con esos conceptos en mente.

Los combos deberán poder representar Product Sets / Commercial Offers sin codificar su composición como verdad irreversible dentro del HTML.

---

## 8. HOME SURFACES

La primera Home deberá contener:

```text
Header
Hamburger navigation
Cart entry
Session location surface
Product search
Hero
Category navigation
Combo carousel
Product cards
Policy/footer access
```

La construcción será responsive desde origen.

---

## 9. FUTURE PUBLIC SURFACES

Se reservan:

```text
Shipping
Tracking
Support Start
Customer Conversation
Experience / Review
Policies
```

No todas estarán visibles o activas en el primer build.

---

## 10. EVENT LAYER

La UI deberá expresar interacciones mediante una frontera normalizada antes de conectar GTM u otro transporte.

Objetivo:

```text
SITE INTERACTION
→ SITE EVENT LAYER
→ MEASUREMENT ADAPTER
→ TRANSPORT
→ AUTHORIZED CONSUMER / PROTOCOL DATA
```

GTM no será lenguaje de negocio ni fuente de verdad.

---

## 11. PUBLIC VS SECRET CONFIG

La implementación separará:

```text
BROWSER-SAFE CONFIG
```

respecto de:

```text
SERVER-ONLY / SECRET CONFIG
```

No se versionarán secretos, service-role material ni capabilities privadas.

---

## 12. ENVIRONMENTS

Primera etapa:

```text
DEVELOPMENT
PUBLIC PREVIEW
```

Cuando exista integración real deberá distinguirse también producción/configuración live.

---

## 13. ASSETS

GitHub puede contener assets web optimizados razonables.

Originales pesados, video de alta resolución o archivos fuente de diseño no deben transformarse en una dependencia masiva del repo.

---

## 14. IMPLEMENTATION HOLD

La arquitectura queda acordada.

El próximo movimiento puede crear el código base de Home respetando esta separación.
