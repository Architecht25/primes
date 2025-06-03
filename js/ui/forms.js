import Swal from 'sweetalert2';

export function initialiserFormulaires() {
 // 🔹 Sélection du type de demandeur
  const select = document.getElementById("applicant-type");
  const sections = {
    prive: document.getElementById("form-prive"),
    entreprise: document.getElementById("form-entreprise"),
    copropriete: document.getElementById("form-copropriete"),
    asbl: document.getElementById("form-asbl"),
    cooperative: document.getElementById("form-cooperative")
  };

  Object.values(sections)
  .filter(section => section !== null)
  .forEach(section => section.style.display = "none");

  select.addEventListener("change", (e) => {
    const selectedType = e.target.value;

    if (selectedType === "entreprise") {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        html: '<b>Les entreprises</b> ne sont plus éligibles aux demandes depuis le 1er juillet 2025.',
        footer: '<a href="https://www.primes-services.be" target="_blank" rel="noopener">Contactez-nous pour plus d\'infos</a>'
      });
      return;
    }

    Object.values(sections).forEach(section => section.style.display = "none");
    if (sections[selectedType]) {
      sections[selectedType].style.display = "block";
    }
  });
 };
