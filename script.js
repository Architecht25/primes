import 'bootstrap'; // Active les composants JS de Bootstrap (modal, dropdown, etc.)
import Swal from 'sweetalert2'; // Pour les alertes stylisées

document.addEventListener("DOMContentLoaded", () => {
  // 🔹 Sélecteurs des blocs de formulaire selon le profil
  const select = document.getElementById("applicant-type");
  const sections = {
    prive: document.getElementById("form-prive"),
    entreprise: document.getElementById("form-entreprise"),
    copropriete: document.getElementById("form-copropriete")
  };

  // 🔹 Masquer tous les formulaires au départ
  Object.values(sections).forEach(section => section.style.display = "none");

  // 🔹 Afficher la section sélectionnée
  select.addEventListener("change", (e) => {
    Object.values(sections).forEach(section => section.style.display = "none");
    if (sections[e.target.value]) {
      sections[e.target.value].style.display = "block";
    }
  });

  // 🔹 Dépliage du bloc "bien à rénover"
  const arrowBien = document.getElementById("arrow-bien");
  const formBien = document.getElementById("form-building");

  arrowBien?.addEventListener("click", () => {
    const isOpen = formBien.style.display === "block";
    formBien.style.display = isOpen ? "none" : "block";
    arrowBien.classList.toggle("bi-chevron-down", isOpen);
    arrowBien.classList.toggle("bi-chevron-up", !isOpen);
  });

  // 🔹 Dépliage du bloc "tableau des primes"
  const arrowPrimes = document.getElementById("arrow-primes");
  const blocPrimes = document.getElementById("bloc-primes");

  arrowPrimes?.addEventListener("click", () => {
    const isVisible = blocPrimes.style.display !== "none";
    blocPrimes.style.display = isVisible ? "none" : "block";
    arrowPrimes.classList.toggle("bi-chevron-down", isVisible);
    arrowPrimes.classList.toggle("bi-chevron-up", !isVisible);
  });

  // 🔹 Calcul des primes
  const taux = {
    isolation_toiture: 30,
    isolation_murs_ext: 30,
    demolition_toiture: 20,
    isolation_murs_int: 15,
  };

  function calculerEtAfficherPrimes() {
    let total = 0;

    const champs = [
      { name: "isolation_toiture", taux: taux.isolation_toiture, id: "result-isolation-toiture" },
      { name: "isolation_murs_ext", taux: taux.isolation_murs_ext, id: "result-isolation-murs-ext" },
      { name: "isolation_murs_int", taux: taux.isolation_murs_int, id: "result-isolation-murs-int" },
      { name: "demolition_toiture", taux: taux.demolition_toiture, id: "result-demolition-toiture" },
    ];

    champs.forEach(({ name, taux, id }) => {
      const val = parseFloat(document.querySelector(`input[name="${name}"]`)?.value) || 0;
      const montant = val * taux;
      document.getElementById(id).textContent = montant.toFixed(2) + " €";
      total += montant;
    });

    document.getElementById("total-primes-affiche").textContent = total.toFixed(2) + " €";
    document.getElementById("prime-total-result").style.display = "block";
  }

  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener("input", calculerEtAfficherPrimes);
  });

  calculerEtAfficherPrimes(); // Initialisation automatique
});

// 🔹 Affichage catégorie prime
function afficherCategoriePrime(categorie) {
  document.getElementById("categorie-prime").textContent = categorie;
  document.getElementById("prime-result").style.display = "block";
}

// Exemple pour test
afficherCategoriePrime("Catégorie B");

// Dépliage du bloc "chantier"
  const toggleChantier = document.getElementById("toggle-chantier");
  const contenuChantier = document.getElementById("contenu-chantier");
  const arrowChantier = document.getElementById("arrow-chantier");

  toggleChantier.addEventListener("click", () => {
    const isVisible = contenuChantier.style.display === "block";
    contenuChantier.style.display = isVisible ? "none" : "block";
    arrowChantier.classList.toggle("rotated", !isVisible);
  });

//   Swal.fire({
//   title: 'Test réussi 🎉',
//   text: 'SweetAlert2 fonctionne correctement avec importmap.',
//   icon: 'success',
// });

// carte produits
const taux = {
  isolation_toiture: 30
};

function calculerEtAfficherPrimes() {
  const val = parseFloat(document.querySelector('input[name="isolation_toiture"]')?.value) || 0;
  const montant = val * taux.isolation_toiture;
  document.getElementById("result-isolation-toiture").textContent = montant.toFixed(2) + " €";
}

document.querySelector('input[name="isolation_toiture"]').addEventListener("input", calculerEtAfficherPrimes);
