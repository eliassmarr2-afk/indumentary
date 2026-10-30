# INDUMENTARY — CURRENT WAYPOINT

**Date:** 2026-10-30  
**Track:** FIRST NICHE SITE / PRODUCT PAGE BUILD 02 MATERIALIZED  
**Implementation:** HOME ACCEPTED / PRODUCT PAGE IMPLEMENTED / COMBO DETAIL NEXT

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

Public Home includes header, shared session location, provider-decoupled search, hero, categories, combo cards, product cards and policy/footer access.

Final visual base:

```text
FONT
=
MANROPE

PAGE BACKGROUND
=
#EEE4D7

SURFACES
=
#FFFFFF

PRIMARY STRUCTURAL COLOR
=
BLACK / NEAR-BLACK

MOBILE HORIZONTAL RAIL CLIPPING
=
PHYSICAL VIEWPORT EDGE
```

Hero content is rendered directly over campaign media with a lower contrast gradient; no black content panel remains.

---

# 5. PRODUCT PAGE BUILD 02

```text
PRODUCT PAGE UI
=
IMPLEMENTED WITH MOCK DEVELOPMENT DATA
```

Implemented in:

```text
product.html
css/product.css
js/product.js
js/commerce/product-detail.js
js/shared/rich-html.js
PRODUCT_PAGE.md
```

Home product cards now navigate to:

```text
product.html?id={product_id}
```

---

# 6. PRODUCT PAGE STRUCTURE

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

Description remains the last content block.

---

# 7. SHOPIFY PREPARATION

Target integrated ownership remains:

```text
PRODUCT MEDIA
=
SHOPIFY

PRODUCT DESCRIPTION CONTENT
=
SHOPIFY

TAB CONFIGURATION
=
SHOPIFY METAFIELD / JSON → COMMERCE ADAPTER
```

The current media, tabs and rich description are mocks used to certify UI behavior.

Real product images are expected to be served by Shopify rather than stored in GitHub.

---

# 8. OPTIONS VS OFFERS

The Product Page keeps separate:

```text
COLOR / SIZE / NICHE OPTION
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

This does not make the storefront authoritative for Product Set composition.

Canonical target remains:

```text
PROVIDER VARIANT
→ EXPLICIT PROVIDER BINDING
→ COMMERCIAL OFFER
→ PRODUCT SET
→ COMPONENTS
```

No fuzzy title matching is authorized.

---

# 9. CART DEVELOPMENT MODEL

`js/commerce/cart.js` now preserves separate cart lines for distinct commercial selections.

Current cart remains development-only.

Target:

```text
STOREFRONT SELECTION
→ COMMERCE ADAPTER
→ EXACT PROVIDER MERCHANDISE
→ SHOPIFY CART
```

---

# 10. LOCATION / LOGISTICS

Home and Product Page share:

```text
SESSION LOCATION CONTEXT
```

The same postal code/address context is reused across both surfaces.

It is not a tariff.

Current Logistics adapter remains:

```text
NOT INTEGRATED
```

Future target:

```text
SESSION LOCATION
→ LOGISTICS ADAPTER
→ PROTOCOL DATA LOGISTICS
→ PUBLIC RESULT
```

---

# 11. TABS + DESCRIPTION

Tabs are rendered from a normalized JSON model and support variable labels/content plus sticky horizontal navigation.

The current JSON schema is explicitly development-only and does not freeze Shopify runtime field names.

Rich HTML is rendered through an allowlist sanitizer.

Description content is positioned last and is reserved for Shopify product description content at integration time.

---

# 12. MEASUREMENT

Product Page currently emits local Site Event Layer semantics including:

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

No live GTM / Protocol Data measurement transport is active.

---

# 13. PUBLIC PREVIEW

Home:

```text
https://eliassmarr2-afk.github.io/indumentary/
```

Product Page example:

```text
https://eliassmarr2-afk.github.io/indumentary/product.html?id=prod-002
```

---

# 14. NEXT MOVEMENT

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
