# INDUMENTARY — PROTOCOL DATA READINESS

**Fecha:** 2026-10-30  
**Estado:** INITIALIZED / NO LIVE PROTOCOL DATA INTEGRATIONS YET

---

## 1. REGLA DE ESTADO

Se utilizan dos dimensiones separadas.

```text
READINESS
=
RESERVED / READY / CONFIGURED / INTEGRATED
```

```text
ACTIVATION
=
ACTIVE / NOT ACTIVE
```

`NOT ACTIVE` no sustituye readiness.

---

## 2. MATRIZ INICIAL

| Capacidad | Current source / authority | Target / canonical owner | Readiness | Activation |
|---|---|---|---|---|
| Products / mappings | local/mock catalog | Protocol Data Products + provider bindings | RESERVED | NOT ACTIVE |
| Orders relation | none | Orders/provider ingestion according to live contract | RESERVED | NOT ACTIVE |
| Logistics | none | Protocol Data Logistics | RESERVED | NOT ACTIVE |
| Shipping Surface | documented site seam | Protocol Data Logistics Shipping Resolver | RESERVED | NOT ACTIVE |
| Tracking Surface | none | Protocol Data Logistics Tracking | RESERVED | NOT ACTIVE |
| Support Start | none | Protocol Data Support | RESERVED | NOT ACTIVE |
| Customer Conversation | none | Protocol Data Support | RESERVED | NOT ACTIVE |
| Experience / Review | none | future Experiences V2 authority | RESERVED | NOT ACTIVE |
| Measurement Event Layer | none | Site Event Layer + authorized Protocol Data ingest | RESERVED | NOT ACTIVE |
| Policies | local content planned | configured Policy Content source | RESERVED | NOT ACTIVE |

---

## 3. SITE-OWNED SESSION LOCATION CONTEXT

Existe una responsabilidad propia del storefront que no debe confundirse con Logistics:

```text
SESSION LOCATION CONTEXT
```

Target owner:

```text
SITE APPLICATION / SESSION STATE
```

Su propósito es reutilizar durante la sesión los datos que el usuario ya ingresó para envío.

Puede contener el contexto mínimo necesario para volver a consultar Logistics.

No posee:

- tarifa;
- promesa;
- disponibilidad;
- geografía canónica;
- regla logística.

---

## 4. PUBLIC SITE / ORIGIN

El repositorio es público, pero todavía no existe deployment/site origin canónico.

```text
PUBLIC PREVIEW ORIGIN
=
PENDING

PROTOCOL DATA TRACKED INSTALLATION
=
NOT ACTIVE
```

Antes de integrar boundaries públicos se revalidará la relación vigente:

```text
PUBLIC SITE / ORIGIN
→ TRACKED INSTALLATION
→ STORE
→ WORKSPACE
```

El browser no elegirá arbitrariamente Workspace/Store como tenant authority.

---

## 5. SHIPPING

La UI inicial reservará:

```text
“¿A dónde lo enviamos?”
```

con CP + dirección opcional.

Mientras Logistics no esté integrado:

- no se mostrarán tarifas reales inventadas;
- no se mostrarán promesas canónicas inventadas;
- cualquier dato demo deberá identificarse como mock/development.

Cuando se integre:

```text
SESSION LOCATION CONTEXT
→ AUTHORIZED SHIPPING ADAPTER
→ PROTOCOL DATA LOGISTICS
→ RESULT
```

---

## 6. TRACKING

Menú reservado:

```text
SABER DE MI ENVÍO
```

No se implementará lookup inseguro por order/tracking naked ID como autoridad.

La futura superficie seguirá el contrato público de Tracking vigente.

---

## 7. SUPPORT / CONVERSATION

Menú reservado:

```text
SOPORTE
```

Se preservará:

```text
SUPPORT START
!=
CUSTOMER CONVERSATION
```

Support Start crea un caso nuevo.

Conversation continúa un caso exacto mediante acceso autorizado.

Tracking access, Support access y Experience access no se reutilizan entre dominios.

---

## 8. EXPERIENCE

```text
READINESS = RESERVED
ACTIVATION = NOT ACTIVE
```

No se inventará una API de Experiencias V2.

La futura UI deberá poder integrarse sin reconstruir el sitio cuando exista la autoridad V2 correspondiente.

---

## 9. MEASUREMENT

Primera construcción:

```text
EVENT LAYER
=
TO BE IMPLEMENTED WITH HOME FOUNDATION
```

GTM u otro transporte podrá conectarse después.

No deberán enviarse a analytics ordinarios:

- raw capabilities;
- domicilio completo;
- mensajes de soporte;
- signed/private URLs;
- review free text por defecto;
- secretos.

---

## 10. LIVE CONTRACT REVALIDATION

Antes de mover cualquier capacidad a `INTEGRATED` se releerá el contrato vigente de Protocol Data correspondiente.

Este documento registra readiness del sitio; no congela endpoints, payloads ni versiones runtime.
