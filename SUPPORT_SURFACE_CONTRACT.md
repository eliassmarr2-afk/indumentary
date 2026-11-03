# SUPPORT SURFACE CONTRACT — INDUMENTARY (SUPPORT START V0)

**Approved visual design:** 2026-11-03  
**State:** SITE-SPECIFIC IMPLEMENTED DEMO / REUSABLE CANDIDATE  
**Backend activation:** NOT ACTIVE  
**Source of current data:** NO BACKEND; USER INPUT IS NOT TRANSMITTED  
**Future owner:** Protocol Data V2 — Support / Conversations

This document is durable site-level authority for the initial public Support Start page. It inherits the frozen central `Ecosistema-para-negocios/docs/sitios-web-de-nicho/006_CONTRATO_SUPERFICIES_PUBLICAS_PROTOCOL_DATA_READY.md`. It does not supersede that contract or the current Protocol Data technical contract.

## 1. User entrypoints and files

```text
Home side-menu       SOPORTE → ./soporte.html
Tracking side-menu   SOPORTE → ./soporte.html

soporte.html
├─ css/support.css
├─ js/support.js
└─ assets/support-illustration-approved.webp
```

`SABER DE MI ENVÍO` and `SOPORTE` are separate navigation items. Do not reuse the session delivery-location modal as Tracking or Support navigation.

## 2. Approved visual composition

```text
BLACK IND. HEADER / HAMBURGER / CART
       ↓
TRANSPARENT PASTEL VECTOR-STYLE ILLUSTRATION
       ↓
Contactá con Soporte
Support access/continuation explanation
       ↓
WHITE SOFT-SHADOW FORM SURFACE
Name
Email
Subject [select]
    └─ Otro → additional subject text field
CTA: Contactar con Soporte
Development-only disclosure
```

- Font: Manrope (same source as Home/Tracking).
- Canvas: `#EEE4D7` neutral beige.
- Form: white, subtly rounded, subtle shadow; input borders neutral, radius 5px.
- CTA: blue `#2479FF` as approved in design. This is a local Support accent, not a redefinition of global branding.
- Illustration is an approved composition cropped to its artwork only, uploaded as real WebP with alpha, with **no containing image card, colored rectangle or separate background**.
- Mobile and desktop responsive. The illustration must not be baked together with copy or form: they remain semantic text and actual interactive controls.
- Never set autofocus on load, slide open, `Otro` selection or another automatic transition. Keyboard appears only when the user explicitly enters an input.

## 3. Fields V0

```text
name         = Nombre / texto
email        = Correo / email
subject      = Asunto / select
other_subject= only visible and required when subject == otro
```

Dropdown options currently are **illustrative UI values only**, not canonical Protocol Data support categories:

- Consulta sobre mi pedido
- Envío y seguimiento
- Cambios y devoluciones
- Productos y disponibilidad
- Otro

Subject mapping to backend reason IDs, message body requirements, challenge/abuse limits, PII policy, validation, attachments and complete submit contract must be agreed against live Protocol Data Support contracts **before production activation**.

## 4. DEMO / actual behavior

```text
UI rendering                  IMPLEMENTED
form controls                 IMPLEMENTED
select Otro reveal            IMPLEMENTED
native field validation       IMPLEMENTED
real Support Start API        NOT IMPLEMENTED
real case creation            NOT ACTIVE
secure continuation access    NOT IMPLEMENTED HERE
backend-authorized response   NOT ACTIVE
```

On submit with valid fields, the UI explicitly states **NO DATA WAS SENT; NO CASE WAS CREATED**. It must not display a success toast or send a request, save values in browser storage, emit PII analytics or transmit data to arbitrary endpoints.

## 5. Canonical authority and safe flow

```text
PUBLIC SUPPORT START UI
    ↓ input / business intent
AUTHORIZED STOREFRONT BOUNDARY (future)
    ↓ anti-abuse / validation / rate limits / public contract
PROTOCOL DATA V2 SUPPORT / CONVERSATIONS
    ↓ confirmed NEW case + secure handoff
CUSTOMER receives secure capability through authorized communication
    ↓
CUSTOMER CONVERSATION SURFACE
```

The browser does not hold backend/admin credentials or become the system of record. The UI cannot claim completion until the backend confirms it. The future connection must use the live contract, not infer paths, schemas or secrets from this prototype.

**CRITICAL separation:**

```text
SUPPORT START ≠ CONVERSATION CONTINUATION
EMAIL FIELD ≠ CUSTOMER AUTHENTICATION
TRACKING CAPABILITY ≠ SUPPORT CAPABILITY ≠ EXPERIENCE CAPABILITY
```

A contact email is a communication destination, not proof that the visitor owns a previous case. New public starts create a new case where allowed; continuing a case requires the correct separate capability.

## 6. Reusability and promotion

Another niche site should audit:

1. Central frozen Site Initialization and Public Surfaces contracts in `eliassmarr2-afk/Ecosistema-para-negocios`.
2. The live Support / Conversations contracts in `eliassmarr2-afk/protocol-data-v2`.
3. This site-level candidate as implementation reference, including the files above.

This is **not yet BANK-WIDE PASS/FROZEN**. Reusable central promotion requires visual + functional review, live contract alignment and explicit acceptance. Site branding may vary; data ownership and capability separation may not.

## 7. Acceptance scope / next steps

Approved: visual composition, transparent illustration, initial three fields and conditional `Otro`; construction of development-only page.

Pending: complete message/composer contract, production subject taxonomy, secure initial submit, email delivery, capability continuation flow, public-safe errors, anti-abuse, return states, integration certification and central promotion.
