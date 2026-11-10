const menuToggle = document.querySelector(".site-menu-toggle");
const mobileMenu = document.querySelector(".site-mobile-menu");

if (menuToggle && mobileMenu) {
  const menuBackdrop = mobileMenu.querySelector(".site-menu-backdrop");
  const menuLinks = mobileMenu.querySelectorAll(".site-mobile-menu-panel a");

  function setMenuOpen(isOpen) {
    mobileMenu.classList.toggle("is-open", isOpen);
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    mobileMenu.inert = !isOpen;
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    document.body.classList.toggle("site-menu-open", isOpen);
  }

  menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  menuBackdrop?.addEventListener("click", () => setMenuOpen(false));
  menuLinks.forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
}
