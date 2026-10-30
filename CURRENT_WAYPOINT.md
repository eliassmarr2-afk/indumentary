# INDUMENTARY — CURRENT WAYPOINT

**Date:** 2026-10-30  
**Track:** FIRST NICHE SITE / HOME BUILD 01  
**Implementation:** HOME BUILD 01 MATERIALIZED / VISUAL REVIEW NEXT

---

# 1. REPOSITORY

```text
repo
=
eliassmarr2-afk/indumentary

visibility
=
public

branch
=
main
```

---

# 2. SITE INITIALIZATION

```text
SITE INITIALIZATION
=
PASS
```

Authority:

`SITE_INITIALIZATION.md`

Construction is authorized. Production readiness is not implied.

---

# 3. CURRENT BUSINESS MODEL

```text
VERTICAL
=
INDUMENTARIA

FIRST EXPRESSION
=
INDUMENTARIA DEPORTIVA

FINAL BRAND
=
NOT YET DEFINED

CURRENT COMMERCE ENGINE
=
MOCK / DEVELOPMENT ONLY

SHOPIFY STATUS
=
SHOPIFY COMPATIBLE
```

---

# 4. HOME BUILD 01 — MATERIALIZED

Implemented on `main`:

```text
HEADER
  hamburger
  utility logo
  cart entry

LOCATION SURFACE
  “¿A dónde lo enviamos?”
  CP
  optional address
  shared session state

SEARCH
  local/mock catalog now
  provider-decoupled seam

HERO
  provisional editorial image
  wide desktop composition
  mobile-specific proportion

CATEGORIES
  Camisetas
  Pantalones
  Camperas
  Gorras y Pilusos
  Medias
  Botines
  Pelotas

COMBOS
  3 horizontal cards
  image 1/3
  content 2/3

PRODUCTS
  6 cards
  2-column layout
  stars
  delivery demo badge
  Mercado Pago trust label
  price section divided by full-width line

FOOTER / POLICY ACCESS
```

---

# 5. CODE STRUCTURE

```text
index.html

css/
  base.css
  home.css

js/
  app.js
  config/
    site.js
  commerce/
    catalog.js
    cart.js
  shared/
    location-state.js
    events.js
  protocol/
    logistics.js

.nojekyll
```

Only responsibilities that exist in Build 01 were materialized. Tracking/Support/Experience files are not created empty; their boundaries remain documented and will appear when implemented.

---

# 6. VISUAL BASE

```text
FONT
=
MANROPE

PAGE
=
#EDEDED

SURFACES
=
#FFFFFF

PRIMARY STRUCTURAL COLOR
=
BLACK / NEAR-BLACK

DEFAULT CARD RADIUS
=
8px

DECORATIVE CARD BORDERS
=
NO

DECORATIVE CARD SHADOWS
=
NO
```

Images are provisional assets for layout review.

---

# 7. LOCATION / LOGISTICS

The Home location popup persists in `sessionStorage` and is intentionally separated from Logistics authority.

```text
LOCATION INPUT
→ SESSION LOCATION CONTEXT
→ future Logistics Adapter
→ Protocol Data Logistics
```

Current Logistics adapter returns `not_integrated` and never invents tariff/promise data.

The green delivery badge is explicitly demo-only until real Logistics resolution exists.

---

# 8. COMMERCE / SHOPIFY

Catalog and search currently use mock data through `js/commerce/catalog.js`.

The UI does not depend directly on Shopify.

Target migration path remains:

```text
SEARCH / PRODUCT UI
→ COMMERCE BOUNDARY
→ SHOPIFY / AUTHORIZED PROVIDER
```

---

# 9. MEASUREMENT

A local Site Event Layer seam is present in:

`js/shared/events.js`

It expresses storefront events without binding the UI to GTM or another transport.

No live measurement transport is active.

---

# 10. PUBLIC PREVIEW

The repo contains a static root entrypoint and `.nojekyll` suitable for GitHub Pages.

GitHub Pages is not yet confirmed active for the repository.

---

# 11. NEXT MOVEMENT

```text
HOME BUILD 01
=
VISUAL REVIEW
```

Then:

```text
ENABLE / VERIFY PUBLIC PREVIEW
↓
REVIEW DESKTOP + MOBILE
↓
CORRECT HOME
↓
HOME BUILD 01 = ACCEPTED
```

Do not begin Product Page, live Shopify, or live Protocol Data integration until the Home review is complete unless explicitly authorized.
