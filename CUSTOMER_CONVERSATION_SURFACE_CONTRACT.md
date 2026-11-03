# CUSTOMER CONVERSATION SURFACE CONTRACT — INDUMENTARY

**Date:** 2026-11-03  
**Status:** SEMANTIC CONTRACT AGREED / SITE-LEVEL DESIGN CANDIDATE / NOT IMPLEMENTED  
**Future canonical owner:** Protocol Data V2 · Support / Conversations  
**Current UI data source:** NONE (future development mock only)  
**Production capability and API integration:** NOT ACTIVE  
**Scope:** Customer-facing conversation continuation, distinct from public Support Start.

## 1. Durable authority chain

This site-level document records the agreed customer chat model. It inherits:

- `eliassmarr2-afk/Ecosistema-para-negocios` — `docs/sitios-web-de-nicho/006_CONTRATO_SUPERFICIES_PUBLICAS_PROTOCOL_DATA_READY.md`, sections 24–29.
- `eliassmarr2-afk/protocol-data-v2` — `docs/domains/logistics/LOGISTICS_V2_SUPPORT_CONVERSATIONS_CONTRACT.md`.
- `docs/domains/logistics/LOGISTICS_V2_SUPPORT_PUBLIC_CUSTOMER_ACCESS_CORE_CONTRACT.md` and `LOGISTICS_V2_SUPPORT_PUBLIC_CUSTOMER_EDGE_RUNTIME_CONTRACT.md`.
- `docs/domains/logistics/LOGISTICS_V2_SUPPORT_CONVERSATIONS_ORDER_ASSOCIATION_COMMAND_CONTRACT.md` (SUPPORT 014, candidate contract; independently revalidate its current status before live integration).
- `SUPPORT_SURFACE_CONTRACT.md` in this site (public start UI, development-only).

A future niche site must audit the canonical central foundation and CURRENT live Protocol Data contracts first, then use this site as a visual/reference implementation if needed. This is not yet a central bank-wide PASS/FROZEN standard.

## 2. The two customer contexts (explicitly agreed)

The *same* authorized customer conversation UI supports **two contextual modes**, based on canonical Support Case ↔ Order association, not on browser guesses.

```text
A. SUPPORT CASE WITHOUT CANONICAL ORDER ASSOCIATION
   → GENERAL VISITOR / NON-ORDER-ASSOCIATED SUPPORT CONTEXT

B. SUPPORT CASE WITH AUTHORIZED CANONICAL ORDER ASSOCIATION
   → ORDER-ASSOCIATED BUYER SUPPORT CONTEXT
```

This distinction does not create two independent Support databases, customer authorization channels or separate chat engines. Both remain within Protocol Data Support / Conversations.

**Critically:** `order_id = NULL` means only `NO ORDER ASSOCIATED TO THIS CASE`; it does **not** prove the person has never bought. Avoid categorical `NOT A CUSTOMER` classification and avoid assuming an order is associated merely because an email matches a Shopify/Commerce customer.

The initial Public Start core creates a **new case with `order_id = NULL`**, even if the visitor describes an order. Canonical Order association, if appropriate, is performed by an authorized internal workflow against the exact tenant-scoped canonical Order.

## 3. Dynamic header / contextual composition

### Mode A — No verified Order association

Suggested customer-facing header presentation:

```text
Soporte · IND.
Consulta general
Caso <public-safe case reference>
<public-safe case status>
```

Do not expose the internal Support UUID as a marketing identity by default. Case reference/display title may require an explicit customer-safe projection.

### Mode B — Verified canonical Order association

Suggested header presentation only when **the authorized public/customer response includes the order context or a dedicated customer-safe projection authorizes its composition**:

```text
Soporte · IND.
Consulta sobre tu pedido
Pedido <authorized display reference>
Caso <public-safe case reference>
<public-safe case status>
```

Buyer mode may display a narrowly scoped public-safe Order summary when expressly authorized by the owning Orders domain. Never fetch an arbitrary Order from a browser-provided ID or disclose full customer/order details from a Support-only capability by assumption.

### Dynamic transition

An authorized operator may associate/disassociate an Order after case creation. The UI should update the customer-facing context on the next authorized refresh if/when the public projection supports it. This must **not** create a second case, reset conversation chronology, issue a new arbitrary credential or silently change message visibility.

When the association is unavailable/unknown from the customer-authorized projection, show a **neutral header** (`Soporte · IND.` + case context/status) and **do not guess**.

## 4. Current backend reality / explicit integration gap

Canonical Support owns the optional tenant-safe association via `protocol_support_cases.order_id`; Orders owns actual Order truth.

The current `support-customer` public customer query (Support 007 core) allows only customer-visible case fields:

```text
support_case_id
status
priority
customer_email
customer_name
last_message_at
last_activity_at
created_at
closed_at
```

and public messages:

```text
support_message_id
sender_role
visibility
body
created_at
```

**It does not currently expose `order_id` or a buyer/visitor classifier to the customer.** Therefore dynamic buyer-specific header behavior is **DESIGNED / NOT CONNECTABLE VIA THE CURRENT PUBLIC CASE PROJECTION** without an explicitly authorized projection or future contract. Do not patch this by reading internal operator endpoints or using heuristic browser matching.

`SUPPORT 014` governs trusted operator link/unlink where authorized. Its current file is marked `FROZEN CANDIDATE CONTRACT`; do not claim that association commands are already deployed or active without fresh verification.

## 5. Conversation semantic structure (agreed)

- Contextual header with case title/reference and public-safe case status.
- Chronological, public-only messages, differentiated by `customer`, `operator`, `system` when authorized.
- Per-message timestamps; respect canonical `last_message_at` vs `last_activity_at`.
- Composer/send action only when the case's state and authorization permit customer reply.
- Attachments: private, authorized, associated with the correct message; show upload and failure states.
- Closed/read-only mode when canonical case state is `cerrada`; safe error on denied reply.
- Expired/revoked/invalid access, loading, temporary error and safe retry states.
- No keyboard autofocus when opening the conversation or a reply drawer; only on intentional input selection.

Canonical case statuses:

```text
nueva
en_proceso
respondida
cerrada
```

Status displays may be localized, but local labels never replace canonical backend values.

## 6. Secure access boundary

```text
PUBLIC SUPPORT START
   → creates NEW case when authorized
   → secure customer capability issued via authorized workflow
   → customer receives approved access path (email delivery is a separate integration step)
   → CUSTOMER CONVERSATION
   → support-customer public read/reply
```

For the existing Support Customer Edge runtime, the possession capability is delivered as:

```text
Authorization: Bearer <opaque 43-character capability>
```

The capability must not be put into query string, ordinary analytics, logs or untrusted storage. Separate Tracking, Support and Experience capabilities are mandatory.

Public access must never expose internal notes, operators' internal identity, assignments, finance/internal data or unrelated case data.

## 7. Shopify/Protocol Data sequencing

For this project the delivery plan is:

```text
VISUAL + MOCK CUSTOMER CONVERSATION UI
→ SHOPIFY MIGRATION / COMMERCIAL ADAPTERS
→ AUTHORIZED PROTOCOL DATA SUPPORT INTEGRATION
→ LIVE SECURITY AND WORKFLOW CERTIFICATION
```

Migrating to Shopify is a chosen project sequence, not a technical proof of customer identity. Shopify customer/email/provider IDs must not become Support capability or canonical Order association by inference.

## 8. Implementation and document status

```text
SEMANTIC CHAT ARCHITECTURE = AGREED
DYNAMIC HEADER TWO MODES = AGREED
VISUAL REFERENCE = DISCUSSED / NEEDS SITE-LEVEL VISUAL REVIEW
MOCK CHAT PAGE = NOT IMPLEMENTED
LIVE PUBLIC BUYER CONTEXT PROJECTION = NOT EXPOSED TODAY
INTEGRATED SUPPORT CUSTOMER CHAT = NOT ACTIVE
BANK-WIDE CENTRAL PROMOTION = NOT YET FROZEN
```

Before implementing, approve the site-specific mock layout and expected customer-visible case reference format. No canonical backend payload, endpoint route or security mechanism may be invented solely to satisfy visual design.
