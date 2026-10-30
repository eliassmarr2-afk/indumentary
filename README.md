# INDUMENTARY

Modelo ecommerce del vertical **Indumentaria** dentro del proyecto **SITIOS WEB DE NICHO**.

## Estado

```text
SITE INITIALIZATION
=
PASS

CONSTRUCTION
=
NOT YET STARTED
```

## Objetivo

Construir una tienda modelo de indumentaria deportiva, visualmente neutra y escalable, preparada desde origen para:

- adaptación comercial por cliente;
- futura migración/adaptación a Shopify;
- integración con Protocol Data;
- desktop + mobile;
- Shipping, Tracking, Support, Conversation, Experience y Policies;
- Event Layer y medición desacoplable.

## Stack inicial

```text
HTML + CSS + JavaScript
```

Se utilizarán datos mockeados durante la primera construcción visual. Los mocks no serán autoridad de negocio.

## Documentación

- `SITE_CONTEXT.md` — qué negocio/modelo estamos construyendo.
- `ARCHITECTURE.md` — cómo se separan las responsabilidades.
- `PROTOCOL_DATA_READINESS.md` — readiness y activation por capacidad.
- `SHOPIFY.md` — estrategia de compatibilidad/migración.
- `DESIGN_BRIEF.md` — dirección visual y composición acordada.
- `PROJECT_DECISIONS.md` — decisiones site-specific.
- `CURRENT_WAYPOINT.md` — estado y próximo movimiento.
- `SITE_INITIALIZATION.md` — checklist del Documento 008.

## Foundation heredada

Este repo consume la arquitectura congelada en `Ecosistema-para-negocios/docs/sitios-web-de-nicho/`, incluyendo Documentos 002–008.

Protocol Data V2 permanece como dependencia canónica externa. Antes de cualquier integración real se releerán sus contratos vigentes.

## Próximo movimiento

Construcción de la primera Home pública/responsive según `DESIGN_BRIEF.md`, sin integración live todavía.
