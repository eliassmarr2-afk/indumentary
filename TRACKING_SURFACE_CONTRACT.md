# TRACKING SURFACE CONTRACT — INDUMENTARY

## Status

```text
SITE-SPECIFIC IMPLEMENTED CANDIDATE
=
YES

CENTRAL STANDARD
=
NO

ACTIVATION
=
NOT ACTIVE

CURRENT DATA SOURCE
=
MOCK DEVELOPMENT ONLY

TARGET AUTHORITIES
=
PROTOCOL DATA V2 · LOGISTICS / PUBLIC TRACKING
AUTHORIZED POSTPURCHASE ORDER PROJECTION
AUTHORIZED COMMERCE ORDER SNAPSHOT
AUTHORIZED ACTION ELIGIBILITY / COMMAND BOUNDARY
```

This document defines the Tracking Surface implemented first in `indumentary` and intended as a reusable candidate for future niche storefronts.

It does **not** modify or supersede the frozen central architecture of SITIOS WEB DE NICHO. Promotion to a central reusable standard requires explicit review and acceptance after this implementation is visually and functionally validated.

---

## 1. Purpose

The Tracking Surface lets an authorized customer consult post-purchase information without making the storefront the canonical owner of logistics, customer, commercial, financial, or support state.

Canonical direction:

```text
STOREFRONT TRACKING UI
        ↓
TRACKING LOOKUP ADAPTER
        ↓
AUTHORIZED STOREFRONT BOUNDARY
        ↓
PROTOCOL DATA / COMMERCE AUTHORITIES
        ↓
NORMALIZED PUBLIC-AUTHORIZED PROJECTION
        ↓
TRACKING UI
```

The storefront renders data. It does not own or fabricate operational truth.

---

## 2. Security invariant

```text
IDENTIFIER LOCATES
CAPABILITY AUTHORIZES
```

A visible tracking ID, order ID, logistics UUID, provider tracking number, or other locator is **not** sufficient authorization to expose protected data.

Production access must require an authorized capability / recovery-verification flow appropriate to the contract in force.

The current Protocol Data public tracking contract uses a high-entropy access capability and a public installation identity. The storefront must not replace that capability with the customer-visible tracking ID.

Capability separation remains mandatory:

```text
TRACKING CAPABILITY
≠
SUPPORT / CONVERSATION CAPABILITY
≠
EXPERIENCE / REVIEW CAPABILITY
```

No universal customer token is assumed.

---

## 3. Surface states

The UI consumes normalized states instead of backend-specific responses:

```text
EMPTY
NOT_FOUND
FOUND
UNAUTHORIZED
ERROR
```

### EMPTY
No query has been performed or the field is empty.

### NOT_FOUND
No authorized lookup result can be resolved for the entered locator.

The UI must not disclose whether a private order exists behind an unauthorized or ambiguous lookup when the backend contract intentionally collapses those causes.

### FOUND
An authorized projection is available and can be rendered.

### UNAUTHORIZED
Reserved for a future contract only when Protocol Data explicitly allows the storefront to distinguish this state publicly.

### ERROR
Technical failure. The storefront must fail safely and must not invent a successful order state.

---

## 4. Identifier input contract

Customer-visible IDs may contain punctuation such as:

```text
C-1111
ARG-2026-00125
PD/LOG-8841
ENV.000123-A
```

The storefront must not impose an alphanumeric-only normalization that destroys meaningful characters.

Current normalization:

```text
trim leading/trailing whitespace
preserve internal punctuation
```

Production format validation belongs to the active lookup contract / adapter.

---

## 5. Canonical logistics lifecycle

The current Protocol Data V2 postpurchase contract defines exactly these lifecycle statuses:

```text
received
↓
dispatched
↓
in_transit
↓
delivered
```

The storefront must not add canonical logistics states without a corresponding Protocol Data contract change.

Display labels and explanatory subtext are presentation data unless Protocol Data exposes canonical public copy.

Current demo mapping:

```text
received     → Recibido
dispatched   → Despachado
in_transit   → En tránsito
delivered    → Entregado
```

If Protocol Data later supplies authorized public display text for a state or observation, the adapter should pass that text through and the UI should render it rather than maintaining a competing operational explanation.

---

## 6. Result composition

The FOUND panel is a composition of separately authorized projections. It must **not** be treated as one undifferentiated public logistics payload.

```text
FOUND RESULT
├─ LOGISTICS PROJECTION
├─ CUSTOMER / ORDER PROJECTION
├─ COMMERCE ORDER SNAPSHOT
└─ ACTION ELIGIBILITY / INTENTS
```

Each projection may have an independent source, authority and `updatedAt` timestamp.

---

## 7. Card 1 — Estado de tu pedido

### Canonical target authority

```text
Protocol Data V2
→ Logistics
→ Public Tracking / authorized postpurchase projection
```

The current public tracking projection includes, among other public-safe logistics fields:

```text
lifecycle_status
carrier_label
tracking_number
tracking_url
shipping_promise_label
delivery_min_operational_days
delivery_max_operational_days
delivery_time_band
status_changed_at
delivered_at
public observations
```

### Presentation

- White wide card.
- Title: `Estado de tu pedido`.
- Independent update timestamp at top-right.
- Thin divider edge-to-edge immediately below header.
- Vertical green lifecycle rail.
- Completed steps: static / frozen green filled nodes.
- Current step: green filled node with pulsing outer halo.
- Pending steps: outlined nodes and muted rail.
- Reduced-motion environments disable the pulse.

### Update timestamp

The timestamp shown on this card belongs to the logistics projection, not to the entire tracking page.

A change performed by an authorized collaborator or future authorized automation/agent in Protocol Data Logistics may update this timestamp independently from the other cards.

---

## 8. Card 2 — Datos del cliente

### Target authority

The current public-tracking projection does **not** expose the complete customer/address record.

This card therefore requires an authorized customer/order projection from the postpurchase boundary or a future dedicated public-safe projection.

Target fields:

```text
full_name
shipping_address
user_note / checkout note when contractually allowed
updated_at
```

### UI

```text
Datos del cliente
──────────────────────────── edge to edge
Nombre y apellido
Domicilio
Observación de usuario
```

Its `updatedAt` is independent from logistics status changes.

A customer-data edit must not falsely update the logistics status timestamp, and a logistics status change must not falsely imply that customer data changed.

---

## 9. Card 3 — Productos comprados

### Target authority

Use an authorized commercial order snapshot / postpurchase order-line projection.

Relevant authorized order-line concepts include:

```text
product_title
variant_title
quantity
unit_price_amount
discount_amount
tax_amount
total_amount
```

Relevant order totals include:

```text
currency
subtotal_amount
discount_amount
shipping_amount
tax_amount
total_amount
```

### Important finance boundary

```text
CUSTOMER ORDER TOTALS
≠
INTERNAL FINANCE SETTLEMENT
```

The customer-facing Tracking Surface must never expose internal settlement, margin, fees, acquisition cost, retained amounts, cost evidence or other private Finance data merely because Protocol Data Finance can calculate them.

If a future Finance domain contributes a customer-safe value, it must do so through an explicit public/authorized projection contract.

### UI

```text
Productos comprados
──────────────────────────── edge to edge
Producto                  Valor
...
Envío                     Gratis / $...
──────────────────────────── edge to edge
TOTAL                      $...
```

---

## 10. Card 4 — Ayuda

Rows:

```text
Cambiar mi dirección de entrega
Cambiar/Agregar productos
Reportar error
Cancelar compra
Hablar con Soporte
```

These rows are **action intents**, not direct mutations.

Canonical direction:

```text
USER ACTION
   ↓
TRACKING UI ACTION INTENT
   ↓
AUTHORIZED ACTION ADAPTER
   ↓
ELIGIBILITY / POLICY CHECK
   ↓
AUTHORIZED COMMAND OR SAFE DENIAL
```

The storefront must not directly mutate logistics, orders, products or support data.

Eligibility may depend on current order state, logistics state, policy, payment state, fulfillment state, actor authorization or another domain contract.

`Hablar con Soporte` must eventually transition into the Support / Conversations capability contract. It must not reuse the Tracking capability as a universal support credential.

---

## 11. Public/private allowlist principle

The Tracking Surface must render only fields explicitly authorized for that surface.

Internal fields are deny-by-default.

Examples that must not leak accidentally:

```text
internal notes
internal interventions not marked public
cost history
margin
settlement details
payment-provider secrets
staff identity / membership metadata
private customer email or phone unless explicitly authorized
internal automation metadata
security capabilities / hashes
```

The UI must never infer a private field from a neighboring public field.

---

## 12. Independent timestamps

Every card owns its own provenance timestamp.

```text
STATE CARD.updatedAt
→ logistics source

CUSTOMER CARD.updatedAt
→ customer/order source

PRODUCTS CARD.updatedAt
→ commerce/order snapshot source

HELP CARD.updatedAt
→ action eligibility / relevant authority source
```

A page-wide timestamp must not replace these independent timestamps when the underlying domains can change separately.

---

## 13. Visual reusable contract

The reusable result pattern is:

```text
BEIGE / OFF-WHITE CANVAS
        ↓
WIDE WHITE CARDS
        ↓
BOLD PRIMARY LABELS
MUTED GRAY SUPPORT COPY
SUBTLE CARD SHADOW
EDGE-TO-EDGE INTERNAL DIVIDERS
        ↓
GREEN LOGISTICS ACCENT
```

Lifecycle timeline:

```text
COMPLETED
● filled muted green
│ dashed/static green

CURRENT
● filled stronger green + pulse halo
│

PENDING
○ outlined muted green/gray
┊ dashed muted rail
```

This visual language is reusable across niche sites; branding may alter neutral palette or typography only if semantic state clarity remains intact.

---

## 14. Current development fixtures

```text
A1111
→ NOT_FOUND

B1111
→ NOT_FOUND

C-1111
→ FOUND
```

`C-1111` intentionally contains a hyphen to exercise punctuation-preserving identifiers.

All fixture customer, product, price, timestamps and explanatory copy are demo-only.

They are not canonical Protocol Data records.

---

## 15. Runtime adapter contract

Current storefront injection seam:

```text
window.IND_TRACKING_LOOKUP_ADAPTER
```

Expected minimal interface:

```text
lookup(trackingId)
→ Promise<NormalizedTrackingResult>
```

The UI does not need to know whether data came from:

```text
MOCK DEVELOPMENT ONLY
Protocol Data Edge Function
server-side storefront boundary
another future authorized transport
```

Production integration replaces the adapter, not the UI contract.

---

## 16. Protocol Data integration target

The current Protocol Data V2 architecture already contains a dedicated public-tracking function and an authorized postpurchase query surface.

Target composition:

```text
TRACKING ID / ACCESS CONTEXT
        ↓
AUTHORIZED STOREFRONT BOUNDARY
        ├─ Logistics Public Tracking
        ├─ Authorized Postpurchase Order Projection
        ├─ Authorized Commerce Snapshot
        └─ Action Eligibility / Commands
        ↓
NORMALIZED RESULT
        ↓
TRACKING RESULT CARDS
```

The storefront should not call privileged internal projections directly from an untrusted browser context.

---

## 17. Future chat / conversations seam

Tracking does not own the customer conversation lifecycle.

Future direction:

```text
TRACKING SURFACE
      ↓
"Hablar con Soporte"
      ↓
SUPPORT START / CONTINUATION CONTRACT
      ↓
SUPPORT CAPABILITY
      ↓
CUSTOMER CONVERSATION SURFACE
```

Support start and support continuation remain governed by their own Protocol Data contracts and capabilities.

---

## 18. Reuse and promotion rule

This implementation is a **reusable candidate**, not yet a bank-wide frozen standard.

After `indumentary` validates:

- visual hierarchy,
- mobile behavior,
- normalized states,
- security boundaries,
- Protocol Data composition,
- action-intent behavior,

it can be proposed for promotion to the central SITIOS WEB DE NICHO documentation.

Promotion requires explicit discussion and acceptance before modifying the frozen central architectural baseline.
