import Swal from 'sweetalert2';

export function initialiserFormulaires() {
  console.log("🟢 initialiserFormulaires() lancé");

  const select = document.getElementById("applicant-type");
  if (!select) {
    console.error("❌ Le select #applicant-type est introuvable.");
    return;
  }

  const sections = {
    prive: document.getElementById("form-prive"),
    entreprise: document.getElementById("form-entreprise"),
    copropriete: document.getElementById("form-copropriete")
  };

  // Diagnostic immédiat
  Object.entries(sections).forEach(([key, section]) => {
    if (!section) {
      console.warn(`⚠️ form-${key} introuvable dans le DOM`);
    }
  });

  // Masquer toutes les sections dès le départ
  Object.values(sections).forEach(section => {
    if (section) section.style.display = "none";
  });

  // Quand l'utilisateur change de type
  select.addEventListener("change", (e) => {
    const selectedType = e.target.value;
    console.log("🧠 Type sélectionné :", selectedType);

    // Cas spécial entreprise
    if (selectedType === "entreprise") {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        html: '<b>Les entreprises</b> ne sont plus éligibles aux demandes depuis le 1er juillet 2025.',
        footer: '<a href="https://www.primes-services.be" target="_blank" rel="noopener">Contactez-nous</a>'
      });
    }

    // Tout masquer
    Object.values(sections).forEach(section => {
      if (section) section.style.display = "none";
    });

    // Afficher le bon formulaire
    const targetSection = sections[selectedType];
    if (targetSection) {
      targetSection.style.display = "block";
      console.log(`✅ Section affichée : ${selectedType}`);
    } else {
      console.warn(`❌ Aucune section correspondante à : ${selectedType}`);
    }
  });
}
