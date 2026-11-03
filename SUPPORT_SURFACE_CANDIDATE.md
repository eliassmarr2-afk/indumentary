# SUPPORT SURFACE — INDUMENTARY · INITIAL CANDIDATE

**Date:** 2026-11-03  
**Status:** DESIGN CANDIDATE / PENDING VISUAL APPROVAL / NOT IMPLEMENTED  
**Repository:** `eliassmarr2-afk/indumentary`  
**Future authority:** Protocol Data V2 · Support / Conversations  
**Current live integration:** NONE

## 1. Role and inheritance

This is the site-level candidate for the public **Support Start Surface**. It inherits the frozen central SITIOS WEB DE NICHO public-surfaces contract, especially the separation between initiating a new case and continuing an existing authorized conversation. It is not itself a new central standard and does not override the backend's live contracts.

```text
STOREFRONT SUPPORT START
  → authorized public boundary
  → Protocol Data Support / Conversations
  → new case, confirmed by backend
  → separate secure continuation capability
  → customer conversation surface
```

## 2. Visual brief agreed for the candidate

- Use the same site header language as INDUMENTARY.
- At top, a standalone illustrative vector-style hero asset, with **transparent background**, in the same visual family as the Tracking illustrations: pastel slate/bluish gray, gentle neutrals, restrained tones. No enclosing visual card/background painted behind it.
- Beneath it, explanatory copy as requested by operator: `Contacta con Soporte de manera segura desde el acceso en el correo electronico.` Copy may be refined during approval; it must not imply email alone is an authentication factor.
- The initial fields, in this order, are `Nombre`, `Correo`, `Asunto` (selectable with an `Otro` choice).
- Exact subject options, form validation, error/success copy and submission behavior are NOT YET AGREED; do not invent them as canonical.
- Do not auto-focus any text field when the page, a slide or the `Otro` field becomes visible. The virtual keyboard opens only when the visitor intentionally selects an editable field.
- Responsive and accessible controls, preserving the site's Manrope/neutral beige/black visual identity.

## 3. Authorization and privacy boundaries

```text
PUBLIC SUPPORT START
≠
AUTHORIZED CONVERSATION CONTINUATION
```

An entered email and name do not authenticate a customer and do not grant access to existing cases. An authorized Support boundary may create a NEW case; the backend-confirmed result controls claims of success, access issuance and subsequent continuation.

```text
TRACKING CAPABILITY
≠
SUPPORT CAPABILITY
≠
EXPERIENCE CAPABILITY
```

Never expose capabilities in analytics, arbitrary local storage, debug logs or URL telemetry. Do not place secret credentials in public GitHub Pages scripts. The form is not a direct database client. No mock UI action should claim to create a real case.

## 4. Pending before implementation

1. Approve illustrative asset.
2. Approve field composition and subject options, including the `Otro` interaction.
3. Agree the submit affordance, help/error/confirmation states and the exact public-safe backend boundaries.
4. Materialize support page and its adapter as development-only UI; independently certify before live integration.
5. Promote as a candidate for reuse only after validation. Central promotion follows DISCUSSION → AGREEMENT → CANDIDATE → EXPLICIT ACCEPTANCE → PASS / FROZEN → MATERIALIZATION.

## 5. Site navigation

Home currently has a reserved `SOPORTE` item. This candidate must not convert that item to a real navigation link until the Support Surface route exists and has been reviewed.
