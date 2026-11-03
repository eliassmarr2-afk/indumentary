# INDUMENTARY — CURRENT WAYPOINT

**Date:** 2026-10-30  
**Track:** FIRST NICHE SITE / PRODUCT PAGE BUILD 02 RECOMPOSED  
**Implementation:** HOME ACCEPTED / PRODUCT PAGE CAMPING-DERIVED UI IMPLEMENTED / COMBO DETAIL NEXT

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

CURRENT COMMERCE ENGINE
=
MOCK / DEVELOPMENT ONLY

SHOPIFY STATUS
=
SHOPIFY COMPATIBLE
```

---

# 4. HOME BUILD 01

```text
HOME BUILD 01
=
ACCEPTED
```

Visual base:

```text
FONT = MANROPE
PAGE = #EEE4D7
SURFACES = #FFFFFF
PRIMARY = BLACK / NEAR-BLACK
```

---

# 5. PRODUCT PAGE BUILD 02

```text
PRODUCT PAGE UI
=
IMPLEMENTED WITH MOCK DEVELOPMENT DATA
```

The visual composition was reset to use the approved Product Landing pattern from:

```text
SOURCE REFERENCE
=
eliassmarr2-afk/ecommerce-v2/producto.html
```

Only the design/composition pattern is reused. Indumentary keeps its own commerce/domain adapters.

Implemented in:

```text
product.html
css/product.css
js/product.js
js/commerce/product-detail.js
js/commerce/cart.js
js/shared/rich-html.js
```

---

# 6. CURRENT PRODUCT PAGE COMPOSITION

```text
PRODUCT HERO IMAGE
  back
  share
  favorite
  gallery access

OVERLAPPING WHITE PRODUCT SHEET
  thumbnail media rail
  category
  product title
  subtitle
  rating
  delivery summary
  social / buyers context
  short product overview
  standard options
  commercial offer cards
  seller / product support entry
  delivery / shared location
  configurable tabs
  features
  Shopify description HTML LAST

FIXED PURCHASE BAR
  current selected price
  compare-at price
  buy action

PRODUCT SUPPORT SHEET
  identity form
  session chat
  quick questions
  composer
```

---

# 7. TEMPORARY DEVELOPMENT CONTENT

The Product Page must remain visually testable before Shopify integration.

Therefore development data currently supplies:

```text
MEDIA
PRICE
COMPARE-AT PRICE
RATING
BUYER COUNT
DELIVERY COPY
SHORT DESCRIPTION
OPTIONS
OFFERS
FEATURES
TABS
FULL DESCRIPTION
SUPPORT QUESTIONS
```

Product media reuses the same remote image sources already used by the Home catalog.

A built-in visual fallback prevents a broken-image icon if a temporary remote image fails.

Target ownership remains:

```text
REAL PRODUCT MEDIA = SHOPIFY
REAL PRODUCT DESCRIPTION = SHOPIFY
REAL PROVIDER VARIANTS = SHOPIFY / COMMERCE ADAPTER
REAL COMMERCIAL IDENTITY / PRODUCT SET COMPOSITION = PROTOCOL DATA
```

---

# 8. OPTIONS VS OFFERS

```text
COLOR / SIZE / PROVIDER OPTION
!=
COMMERCIAL OFFER
```

Offer Cards preserve development identifiers for:

```text
offerId
protocolOfferId
providerVariantId
selectedOptions
```

Target:

```text
PROVIDER VARIANT
→ EXPLICIT PROVIDER BINDING
→ COMMERCIAL OFFER
→ PRODUCT SET
→ COMPONENTS
```

No fuzzy title matching is authorized.

---

# 9. LOCATION / LOGISTICS

Home and Product Page share session delivery context.

```text
SESSION LOCATION
→ future LOGISTICS ADAPTER
→ PROTOCOL DATA LOGISTICS
```

Current Logistics status remains NOT INTEGRATED.

---

# 10. TABS + SHOPIFY DESCRIPTION

Tabs are rendered from a normalized development JSON model.

Exact Shopify runtime metafield names are not frozen yet.

The full Shopify description surface remains the final content block.

---

# 11. PRODUCT SUPPORT

The Camping-style contextual product support sheet is present as a front-only development surface.

It uses session-only persistence and does not claim Protocol Data Support integration.

Target future ownership remains Protocol Data Support / Conversations through the authorized adapter boundary.

---

# 12. PUBLIC PREVIEW

Home:

```text
https://eliassmarr2-afk.github.io/indumentary/
```

Product Page example:

```text
https://eliassmarr2-afk.github.io/indumentary/product.html?id=prod-002
```

---

# 13. NEXT MOVEMENT

```text
PRODUCT PAGE BUILD 02
=
VISUAL / FUNCTIONAL REVIEW
```

then:

```text
COMBO / OFFER DETAIL
=
DISCUSSION / STRUCTURE AGREEMENT NEXT
```

Do not claim Shopify or Protocol Data integration from the current mocks.

---

# 2026-11-03 — TRACKING + SUPPORT SURFACES ADDENDUM

This addendum supersedes the older `PRODUCT PAGE ... NEXT` continuation in this waypoint; previous sections remain historical.

**Current development state**:

```text
TRACKING SURFACE UI = IMPLEMENTED / DEMO LOOKUP
TRACKING LIVE BACKEND = NOT ACTIVE
SUPPORT START UI = IMPLEMENTED / DEMO-ONLY / VISUAL APPROVED
SUPPORT LIVE BACKEND = NOT ACTIVE
SHOPIFY LIVE INTEGRATION = NOT ACTIVE
```

**Canonical site-level docs**:

- `TRACKING_SURFACE_CONTRACT.md`: states, authorized composition, Tracking lookup boundary, independent timestamps, action intents, Home navigation and future reusable candidate.
- `SUPPORT_SURFACE_CONTRACT.md`: Support Start UI, approved illustration, fields, current non-submitting behavior, capability separation and future integration contract.
- `SUPPORT_SURFACE_CANDIDATE.md`: historical design brief, now approved and implemented V0; refer to the above contract for current implementation.

**Navigation**:

```text
HOME > SABER DE MI ENVÍO  → tracking.html
HOME > SOPORTE            → soporte.html
TRACKING > SOPORTE        → soporte.html
SUPPORT > TRACKING        → tracking.html
```

**Current implementation files**:

```text
soporte.html
css/support.css
js/support.js
assets/support-illustration-approved.webp
```

**Next contract work**: complete Support Start request/response and subjects with current Protocol Data Support contracts, secure email capability handoff, conversation continuation, error semantics, authorization, auditability and no-browser-secret guarantee; then certify live integration. Do not confuse visual completion with production authorization.

**Bank-wide promotion**: Both Tracking and Support contracts are reusable site-level candidates only. Promote to `Ecosistema-para-negocios` central documentation after implementation validation and explicit acceptance; do not silently modify frozen central standards.
