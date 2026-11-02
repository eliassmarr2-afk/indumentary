(() => {
  "use strict";

  const returnsRow = document.getElementById("commercialReturnsRow");
  const securityRow = document.getElementById("commercialSecurityRow");
  if (!returnsRow || !securityRow) return;

  const policies = {
    returns: {
      id: "returns",
      eyebrow: "POLÍTICA DINÁMICA",
      title: "Devoluciones en 30 días",
      intro: "Podés solicitar una devolución dentro de los 30 días corridos desde la recepción del pedido, siempre que el producto conserve condiciones aptas para su revisión.",
      sections: [
        {
          title: "Condiciones generales",
          body: "La prenda debe conservar etiquetas, accesorios y no presentar señales de uso que excedan una prueba razonable de talle o calce."
        },
        {
          title: "Cómo iniciar una devolución",
          body: "Desde esta misma tienda vas a poder iniciar la solicitud y consultar las instrucciones aplicables a tu compra."
        },
        {
          title: "Reintegro",
          body: "Una vez revisado el producto, el reintegro se procesa al mismo medio de pago cuando corresponda. Los plazos finales pueden depender del proveedor de pagos."
        }
      ],
      note: "Contenido de demostración. En producción, esta política será provista por el dominio de Políticas de Protocol Data."
    },
    security: {
      id: "payments-privacy",
      eyebrow: "POLÍTICA DINÁMICA",
      title: "Pagos seguros · Protección de privacidad",
      intro: "La tienda debe presentar de forma clara cómo se procesan los pagos y cómo se protege la información del cliente durante la navegación y la compra.",
      sections: [
        {
          title: "Procesamiento de pagos",
          body: "Los pagos se procesan mediante proveedores habilitados. La tienda no debe exponer ni almacenar datos sensibles de tarjetas fuera de los mecanismos autorizados del proveedor."
        },
        {
          title: "Datos personales",
          body: "La información necesaria para operar pedidos, entregas y soporte se utiliza únicamente para las finalidades informadas al cliente y bajo las reglas vigentes del comercio."
        },
        {
          title: "Privacidad y seguridad",
          body: "Las superficies públicas deben evitar exponer identificadores sensibles, capacidades privadas o datos personales más allá de lo necesario para completar la operación."
        }
      ],
      note: "Contenido de demostración. En producción, esta política será provista por el dominio de Políticas de Protocol Data."
    }
  };

  const backdrop = document.createElement("div");
  backdrop.id = "productPolicyBackdrop";
  backdrop.className = "product-policy-backdrop";
  backdrop.hidden = true;
  backdrop.dataset.policyAuthority = "mock-now__protocol-data-policies-later";
  backdrop.innerHTML = `
    <section class="product-policy-sheet" role="dialog" aria-modal="true" aria-labelledby="productPolicyTitle">
      <div class="product-policy-sheet__handle" aria-hidden="true"></div>
      <div class="product-policy-sheet__top">
        <div>
          <span id="productPolicyEyebrow" class="product-policy-sheet__eyebrow"></span>
          <h2 id="productPolicyTitle"></h2>
        </div>
        <button id="productPolicyClose" class="product-policy-sheet__close" type="button" aria-label="Cerrar">×</button>
      </div>
      <p id="productPolicyIntro" class="product-policy-sheet__intro"></p>
      <div id="productPolicySections" class="product-policy-sheet__sections"></div>
      <div class="product-policy-sheet__source">
        <span>Fuente futura</span>
        <strong>Protocol Data · Políticas</strong>
      </div>
      <p id="productPolicyNote" class="product-policy-sheet__note"></p>
    </section>
  `;
  document.body.appendChild(backdrop);

  const eyebrow = backdrop.querySelector("#productPolicyEyebrow");
  const title = backdrop.querySelector("#productPolicyTitle");
  const intro = backdrop.querySelector("#productPolicyIntro");
  const sections = backdrop.querySelector("#productPolicySections");
  const note = backdrop.querySelector("#productPolicyNote");
  const closeButton = backdrop.querySelector("#productPolicyClose");

  const openPolicy = (policy) => {
    eyebrow.textContent = policy.eyebrow;
    title.textContent = policy.title;
    intro.textContent = policy.intro;
    sections.innerHTML = policy.sections.map((section) => `
      <article class="product-policy-card">
        <h3>${section.title}</h3>
        <p>${section.body}</p>
      </article>
    `).join("");
    note.textContent = policy.note;

    backdrop.dataset.policyId = policy.id;
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add("is-open"));
    document.body.classList.add("no-scroll");
  };

  const closePolicy = () => {
    backdrop.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    window.setTimeout(() => {
      if (!backdrop.classList.contains("is-open")) backdrop.hidden = true;
    }, 190);
  };

  returnsRow.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    openPolicy(policies.returns);
  }, true);

  securityRow.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    openPolicy(policies.security);
  }, true);

  closeButton?.addEventListener("click", closePolicy);
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) closePolicy();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !backdrop.hidden) closePolicy();
  });
})();
