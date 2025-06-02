export function initialiserFleches() {
console.log("🔄 initialiserFleches lancé");

  // 🔹 Dépliage "bien à rénover"
  const arrowBien = document.getElementById("arrow-bien");
  const formBien = document.getElementById("form-building");
  arrowBien?.addEventListener("click", () => {
    const isOpen = formBien.style.display === "block";
    formBien.style.display = isOpen ? "none" : "block";
    arrowBien.classList.toggle("bi-chevron-down", isOpen);
    arrowBien.classList.toggle("bi-chevron-up", !isOpen);
  });

  // 🔹 Dépliage "chantier"
  const toggleChantier = document.getElementById("toggle-chantier");
  const contenuChantier = document.getElementById("contenu-chantier");
  const arrowChantier = document.getElementById("arrow-chantier");
  toggleChantier?.addEventListener("click", () => {
    const isVisible = contenuChantier.style.display === "block";
    contenuChantier.style.display = isVisible ? "none" : "block";
    arrowChantier.classList.toggle("rotated", !isVisible);
  });
};
