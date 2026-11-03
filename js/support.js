(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const menu = $("supportDrawer");
  const backdrop = $("supportDrawerBackdrop");
  const openMenu = $("supportMenuButton");
  const closeMenu = $("supportDrawerClose");
  const form = $("supportStartForm");
  const subject = $("supportSubject");
  const otherField = $("supportOtherField");
  const otherInput = $("supportOther");
  const feedback = $("supportFeedback");
  const setMenu = (open) => {
    menu.classList.toggle("is-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    menu.inert = !open;
    backdrop.hidden = !open;
    openMenu.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  setMenu(false);
  openMenu.addEventListener("click", () => setMenu(true));
  closeMenu.addEventListener("click", () => setMenu(false));
  backdrop.addEventListener("click", () => setMenu(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) setMenu(false);
  });

  const syncOther = () => {
    const show = subject.value === "otro";
    otherField.hidden = !show;
    otherInput.required = show;
    if (!show) otherInput.value = "";
    feedback.hidden = true;
    // Never focus a field automatically; opening the keyboard requires explicit intent.
  };
  subject.addEventListener("change", syncOther);
  syncOther();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    feedback.textContent = "Esta página todavía funciona en modo demostración. No se enviaron tus datos ni se creó un caso. El envío estará disponible cuando se active el boundary autorizado de Protocol Data.";
    feedback.hidden = false;
    // No network request, persistence, analytics or logging of user-entered data.
  });
})();