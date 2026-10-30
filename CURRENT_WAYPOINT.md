# INDUMENTARY — CURRENT WAYPOINT

**Date:** 2026-10-30  
**Track:** FIRST NICHE SITE / INITIALIZATION COMPLETE  
**Implementation:** CONSTRUCTION AUTHORIZED / NOT YET STARTED

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

This PASS authorizes construction on the agreed architecture. It is not a production-readiness certification.

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

# 4. VISUAL BASE

```text
FONT
=
MANROPE

PAGE BACKGROUND
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

---

# 5. HOME — AGREED FIRST BUILD

```text
HEADER
  hamburger
  utility logo
  cart

LOCATION SURFACE
  “¿A dónde lo enviamos?”
  CP
  optional address
  shared session context

SEARCH
  independent product search
  provider-decoupled

HERO
  wide ~16:9 campaign image

CATEGORIES
  Camisetas
  Pantalones
  Camperas
  Gorras y Pilusos
  Medias
  Botines
  Pelotas

COMBOS
  3 horizontal scrollable cards

PRODUCTS
  6 cards
  2 per desktop row

POLICY / FOOTER ACCESS
```

---

# 6. SESSION LOCATION DECISION

```text
HOME LOCATION
↔
PRODUCT PAGE LOCATION
```

The same session location context is reused across shipping-aware surfaces.

It does not own tariffs/promises.

Future authority:

```text
SESSION LOCATION CONTEXT
→ SHIPPING ADAPTER
→ PROTOCOL DATA LOGISTICS
```

---

# 7. PROTOCOL DATA

No live Protocol Data integration is active yet.

All relevant capabilities are documented in `PROTOCOL_DATA_READINESS.md` with separate Readiness and Activation dimensions.

Do not implement a live domain contract from memory. Revalidate current Protocol Data documentation before integration.

---

# 8. SHOPIFY

```text
SHOPIFY
=
COMPATIBLE / NOT INTEGRATED
```

The first build uses mocks while preserving Product / SKU / Set / Offer / Provider Variant separation.

---

# 9. CURRENT HOLD

No HTML/CSS/JS has been written yet.

This is intentional: site architecture and composition were agreed before code construction.

---

# 10. NEXT MOVEMENT

```text
HOME FOUNDATION / BUILD 01
```

Target:

1. establish initial folder/file structure;
2. implement base visual tokens + Manrope;
3. implement responsive header + menu;
4. implement shared location surface/popup with local session mock state;
5. implement provider-decoupled search UI;
6. implement hero placeholder;
7. implement category section;
8. implement combo cards;
9. implement six product cards;
10. publish a public preview for visual iteration.

Before writing code, the exact Build 01 file structure should be agreed and then constructed as complete blocks.
