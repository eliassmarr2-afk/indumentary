(() => {
  "use strict";

  const ACTIVE_CHAT_KEY = "indumentaryActiveProductChat";
  const SESSION_PREFIX = "indumentaryProductChat:";
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id") || "prod-002";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const els = {
    supportButton: $("#productSupportButton"),
    backdrop: $("#productSupportBackdrop"),
    sheet: $("#productSupportSheet"),
    close: $("#closeProductSupport"),
    formView: $("#productSupportFormView"),
    chatView: $("#productSupportChatView"),
    form: $("#productSupportForm"),
    name: $("#productSupportName"),
    email: $("#productSupportEmail"),
    nameError: $("#productSupportNameError"),
    emailError: $("#productSupportEmailError"),
    productImage: $("#supportProductImage"),
    productTitle: $("#supportProductTitle"),
    productPrice: $("#supportProductPrice"),
    messages: $("#productSupportMessages"),
    quickQuestions: $("#productSupportQuickQuestions"),
    messageForm: $("#productSupportMessageForm"),
    messageInput: $("#productSupportMessageInput")
  };

  if (!els.supportButton || !els.backdrop || !els.form || !els.messageForm) return;

  function currentProduct() {
    return {
      id: productId,
      title: $("#productTitle")?.textContent?.trim() || "Producto",
      category: $("#productCategory")?.textContent?.trim() || "Indumentaria",
      priceLabel: $("#productPrice")?.textContent?.trim() || "",
      image: $("#productImage")?.currentSrc || $("#productImage")?.src || "",
      supportQuestions: [
        "¿Qué talle me recomendás?",
        "¿Qué incluye exactamente esta oferta?",
        "¿Cuánto tarda el envío?"
      ]
    };
  }

  function sessionKey(id = productId) {
    return `${SESSION_PREFIX}${id}`;
  }

  function saveSession(session) {
    try {
      sessionStorage.setItem(sessionKey(session.product.id), JSON.stringify(session));
      sessionStorage.setItem(ACTIVE_CHAT_KEY, JSON.stringify({
        productId: session.product.id,
        productTitle: session.product.title,
        sessionKey: sessionKey(session.product.id)
      }));
    } catch {
      // Front-only demo persistence is best effort.
    }
  }

  function loadSession(id = productId) {
    try {
      const raw = sessionStorage.getItem(sessionKey(id));
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (!session || session.product?.id !== id || session.status !== "open") return null;
      return session;
    } catch {
      return null;
    }
  }

  function getActiveConversation() {
    try {
      const pointerRaw = sessionStorage.getItem(ACTIVE_CHAT_KEY);
      if (pointerRaw) {
        const pointer = JSON.parse(pointerRaw);
        if (pointer?.productId) {
          const session = loadSession(pointer.productId);
          if (session) return session;
        }
      }

      const candidates = [];
      for (let index = 0; index < sessionStorage.length; index += 1) {
        const key = sessionStorage.key(index);
        if (!key || !key.startsWith(SESSION_PREFIX)) continue;
        try {
          const session = JSON.parse(sessionStorage.getItem(key) || "null");
          if (session?.status === "open" && session.product?.id) candidates.push(session);
        } catch {
          // Ignore malformed demo state.
        }
      }

      candidates.sort((a, b) => new Date(b.startedAt || 0).getTime() - new Date(a.startedAt || 0).getTime());
      const session = candidates[0] || null;
      if (session) {
        sessionStorage.setItem(ACTIVE_CHAT_KEY, JSON.stringify({
          productId: session.product.id,
          productTitle: session.product.title,
          sessionKey: sessionKey(session.product.id)
        }));
        return session;
      }

      sessionStorage.removeItem(ACTIVE_CHAT_KEY);
      return null;
    } catch {
      return null;
    }
  }

  function setError(input, errorEl, message) {
    const hasError = Boolean(message);
    input?.setAttribute("aria-invalid", hasError ? "true" : "false");
    if (!errorEl) return;
    errorEl.hidden = !hasError;
    errorEl.textContent = message || "";
  }

  function resetSheet() {
    els.form.reset();
    setError(els.name, els.nameError, "");
    setError(els.email, els.emailError, "");
    els.formView.hidden = false;
    els.chatView.hidden = true;
    els.messages.innerHTML = "";
    els.quickQuestions.innerHTML = "";
  }

  function renderMessages(session) {
    els.messages.innerHTML = session.messages.map((message) => {
      const customer = message.role === "customer";
      const sender = customer ? session.customer.name : "Operador";
      return `
        <div class="product-support-message ${customer ? "product-support-message--customer" : "product-support-message--operator"}">
          <span class="product-support-message__sender">${sender}</span>
          <div class="product-support-message__bubble"></div>
        </div>
      `;
    }).join("");

    const bubbles = $$(".product-support-message__bubble", els.messages);
    session.messages.forEach((message, index) => {
      if (bubbles[index]) bubbles[index].textContent = message.text;
    });

    els.messages.scrollTop = els.messages.scrollHeight;
  }

  function renderQuickQuestions(session) {
    const questions = Array.isArray(session.product.supportQuestions)
      ? session.product.supportQuestions.filter((question) => String(question || "").trim())
      : [];

    els.quickQuestions.replaceChildren();
    els.quickQuestions.hidden = !questions.length;

    questions.forEach((question) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "product-support-quick-question";
      button.textContent = question;
      button.addEventListener("click", () => sendMessage(question, "preset_question"));
      els.quickQuestions.appendChild(button);
    });
  }

  function showChat(session) {
    els.formView.hidden = true;
    els.chatView.hidden = false;
    renderMessages(session);
    renderQuickQuestions(session);
    requestAnimationFrame(() => els.messageInput?.focus());
  }

  function openSupport() {
    resetSheet();

    const product = currentProduct();
    if (els.productImage) {
      els.productImage.src = product.image;
      els.productImage.alt = product.title;
    }
    if (els.productTitle) els.productTitle.textContent = product.title;
    if (els.productPrice) els.productPrice.textContent = product.priceLabel;

    const storedSession = loadSession();
    if (storedSession) showChat(storedSession);

    els.backdrop.hidden = false;
    requestAnimationFrame(() => els.backdrop.classList.add("is-open"));
    document.body.classList.add("no-scroll");
  }

  function closeSupport() {
    els.backdrop.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    window.setTimeout(() => {
      if (!els.backdrop.classList.contains("is-open")) els.backdrop.hidden = true;
    }, 190);
  }

  function validate() {
    const name = els.name.value.trim();
    const email = els.email.value.trim();
    let valid = true;

    if (name.length < 3) {
      setError(els.name, els.nameError, "Ingresá tu nombre y apellido.");
      valid = false;
    } else {
      setError(els.name, els.nameError, "");
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(els.email, els.emailError, "Ingresá un correo válido.");
      valid = false;
    } else {
      setError(els.email, els.emailError, "");
    }

    return valid;
  }

  function buildIntent() {
    const product = currentProduct();
    return {
      type: "product_inquiry",
      entrySurface: "product_detail",
      customer: {
        name: els.name.value.trim(),
        email: els.email.value.trim()
      },
      product: {
        id: product.id,
        title: product.title,
        category: product.category,
        priceLabel: product.priceLabel,
        image: product.image,
        supportQuestions: product.supportQuestions.slice()
      },
      source: {
        url: window.location.href
      }
    };
  }

  function createSession() {
    const intent = buildIntent();
    const firstName = intent.customer.name.split(/\s+/)[0] || intent.customer.name;
    const session = {
      version: 1,
      type: "product_inquiry",
      status: "open",
      startedAt: new Date().toISOString(),
      customer: intent.customer,
      product: intent.product,
      source: intent.source,
      entrySurface: intent.entrySurface,
      operatorUnreadCount: 0,
      messages: [
        {
          role: "operator",
          text: `Hola ${firstName}, ¿qué te gustaría saber de ${intent.product.title}?`,
          createdAt: new Date().toISOString()
        }
      ]
    };

    saveSession(session);
    window.dispatchEvent(new CustomEvent("indumentary:product-support-started", {
      detail: JSON.parse(JSON.stringify(session))
    }));
    return session;
  }

  function sendMessage(text, source = "composer") {
    const normalized = String(text || "").trim();
    if (!normalized) return;

    const session = loadSession();
    if (!session) return;

    const message = {
      role: "customer",
      text: normalized,
      source,
      createdAt: new Date().toISOString()
    };

    session.messages.push(message);
    saveSession(session);
    renderMessages(session);

    window.dispatchEvent(new CustomEvent("indumentary:product-support-message", {
      detail: {
        context: {
          type: session.type,
          customer: session.customer,
          product: session.product,
          source: session.source,
          entrySurface: session.entrySurface
        },
        message: JSON.parse(JSON.stringify(message))
      }
    }));
  }

  function handleStart(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!validate()) return;
    showChat(createSession());
  }

  function handleMessage(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const text = els.messageInput.value.trim();
    if (!text) {
      els.messageInput.focus();
      return;
    }
    sendMessage(text, "composer");
    els.messageInput.value = "";
    els.messageInput.focus();
  }

  function removeWidget() {
    $("#activeConversationWidget")?.remove();
  }

  function openConversation(session) {
    const currentId = new URLSearchParams(window.location.search).get("id") || "prod-002";
    if (currentId === session.product.id) {
      openSupport();
      return;
    }

    const url = new URL("product.html", window.location.href);
    url.searchParams.set("id", session.product.id);
    url.searchParams.set("supportChat", "1");
    url.searchParams.set("build", "20261030-1812");
    window.location.href = url.href;
  }

  function mountWidget() {
    removeWidget();
    const session = getActiveConversation();
    if (!session) return;

    const target = $(".product-intro") || $("main");
    if (!target) return;

    const wrapper = document.createElement("div");
    wrapper.id = "activeConversationWidget";
    wrapper.className = "conversation-resume-widget";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "conversation-resume-widget__button";
    button.setAttribute("aria-label", `Seguí tu conversación sobre ${session.product.title}`);
    button.innerHTML = `
      <span class="conversation-resume-widget__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/><path d="M8 10h8M8 14h5"/></svg>
      </span>
      <span class="conversation-resume-widget__copy">
        <span class="conversation-resume-widget__label">Seguí tu conversación sobre</span>
        <strong>${session.product.title}</strong>
      </span>
      <span class="conversation-resume-widget__status" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
      </span>
    `;
    button.addEventListener("click", () => openConversation(session));
    wrapper.appendChild(button);
    target.insertAdjacentElement("afterend", wrapper);
  }

  window.IndumentarySupportHook = {
    getCurrentContext() {
      const session = loadSession();
      if (!session) return null;
      return JSON.parse(JSON.stringify({
        type: session.type,
        status: session.status,
        customer: session.customer,
        product: session.product,
        source: session.source,
        entrySurface: session.entrySurface
      }));
    },
    openCurrentConversation() {
      const session = loadSession();
      if (!session) return false;
      openSupport();
      return true;
    }
  };

  // Replace the current chat button so the previous minimal runtime listener cannot compete.
  const cleanButton = els.supportButton.cloneNode(true);
  els.supportButton.replaceWith(cleanButton);
  cleanButton.addEventListener("click", openSupport);

  els.close?.addEventListener("click", closeSupport);
  els.backdrop.addEventListener("click", (event) => {
    if (event.target === els.backdrop) closeSupport();
  });
  els.form.addEventListener("submit", handleStart, true);
  els.messageForm.addEventListener("submit", handleMessage, true);
  els.name?.addEventListener("input", () => {
    if (els.name.value.trim()) setError(els.name, els.nameError, "");
  });
  els.email?.addEventListener("input", () => {
    if (els.email.value.trim()) setError(els.email, els.emailError, "");
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.backdrop.hidden) closeSupport();
  });
  window.addEventListener("indumentary:product-support-started", mountWidget);
  window.addEventListener("indumentary:product-support-message", mountWidget);
  window.addEventListener("indumentary:product-support-operator-update", mountWidget);

  mountWidget();

  if (params.get("supportChat") === "1" && loadSession()) {
    openSupport();
  }
})();
