const ALLOWED_TAGS = new Set([
  "P", "H2", "H3", "H4", "UL", "OL", "LI", "STRONG", "EM", "B", "I", "BR", "A", "SPAN",
  "BLOCKQUOTE", "TABLE", "THEAD", "TBODY", "TR", "TH", "TD", "IMG"
]);

const ALLOWED_ATTRS = {
  A: new Set(["href", "target", "rel"]),
  IMG: new Set(["src", "alt", "loading"]),
  TH: new Set(["colspan", "rowspan"]),
  TD: new Set(["colspan", "rowspan"]),
  SPAN: new Set([])
};

function safeUrl(value, { image = false } = {}) {
  try {
    const url = new URL(value, window.location.origin);
    if (image) return url.protocol === "https:" ? url.href : "";
    return ["https:", "http:", "mailto:"].includes(url.protocol) ? url.href : "";
  } catch {
    return value?.startsWith("#") ? value : "";
  }
}

function sanitizeNode(node) {
  if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent || "");
  if (node.nodeType !== Node.ELEMENT_NODE) return document.createDocumentFragment();

  if (!ALLOWED_TAGS.has(node.tagName)) {
    const fragment = document.createDocumentFragment();
    [...node.childNodes].forEach((child) => fragment.appendChild(sanitizeNode(child)));
    return fragment;
  }

  const clean = document.createElement(node.tagName.toLowerCase());
  const allowedAttrs = ALLOWED_ATTRS[node.tagName] || new Set();

  [...node.attributes].forEach((attr) => {
    if (!allowedAttrs.has(attr.name)) return;

    if (node.tagName === "A" && attr.name === "href") {
      const href = safeUrl(attr.value);
      if (href) clean.setAttribute("href", href);
      return;
    }

    if (node.tagName === "IMG" && attr.name === "src") {
      const src = safeUrl(attr.value, { image: true });
      if (src) clean.setAttribute("src", src);
      return;
    }

    clean.setAttribute(attr.name, attr.value);
  });

  if (clean.tagName === "A" && clean.getAttribute("target") === "_blank") {
    clean.setAttribute("rel", "noopener noreferrer");
  }

  if (clean.tagName === "IMG" && !clean.hasAttribute("loading")) clean.setAttribute("loading", "lazy");

  [...node.childNodes].forEach((child) => clean.appendChild(sanitizeNode(child)));
  return clean;
}

export function setSanitizedRichHtml(container, html) {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(String(html || ""), "text/html");
  const fragment = document.createDocumentFragment();
  [...parsed.body.childNodes].forEach((node) => fragment.appendChild(sanitizeNode(node)));
  container.replaceChildren(fragment);
}
