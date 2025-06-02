import 'bootstrap'; // Active les composants JS de Bootstrap
import Swal from 'sweetalert2'; // Pour les alertes stylisées

document.addEventListener("DOMContentLoaded", () => {
  // 🔹 Sélection du type de demandeur
  const select = document.getElementById("applicant-type");
  const sections = {
    prive: document.getElementById("form-prive"),
    entreprise: document.getElementById("form-entreprise"),
    copropriete: document.getElementById("form-copropriete")
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

  // 🔹 Dépliage "tableau des primes"
  const arrowPrimes = document.getElementById("arrow-primes");
  const blocPrimes = document.getElementById("bloc-primes");
  arrowPrimes?.addEventListener("click", () => {
    const isVisible = blocPrimes.style.display !== "none";
    blocPrimes.style.display = isVisible ? "none" : "block";
    arrowPrimes.classList.toggle("bi-chevron-down", isVisible);
    arrowPrimes.classList.toggle("bi-chevron-up", !isVisible);
  });

  // 🔹 Calcul dynamique des montants de primes
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





  // 🔹 Lien bouton "Calculer catégorie de prime"
  const boutonCalcul = document.getElementById("btn-calcul-prime");
  if (boutonCalcul) {
    boutonCalcul.addEventListener("click", calculerCategorie);
  }

  function calculerCategorie() {
    const situation = document.getElementById('situation').value;
    const revenu1 = parseFloat(document.getElementById('revenu-demandeur').value) || 0;
    const revenu2 = parseFloat(document.getElementById('revenu-conjoint').value) || 0;
    const result = document.getElementById('categorie-resultat');
    const revenuTotal = revenu1 + revenu2;

    if (revenuTotal === 0) {
      result.textContent = "Veuillez entrer au moins un revenu valide.";
      return;
    }

    let seuil1, seuil2;
    switch (situation) {
      case 'couple':
      case 'isole_avec_enfant':
        seuil1 = 59270;
        seuil2 = 76980;
        break;
      case 'isole':
        seuil1 = 42340;
        seuil2 = 53880;
        break;
      default:
        result.textContent = "Situation inconnue.";
        return;
    }

    let categorie;
    if (revenuTotal < seuil1) {
      categorie = "Revenu Faible";
    } else if (revenuTotal < seuil2) {
      categorie = "Revenu Moyen";
    } else {
      categorie = "Revenu Élevé";
    }

    result.textContent = `Votre catégorie de revenu est : ${categorie}`;
    afficherCategoriePrime(categorie);
  }

  function afficherCategoriePrime(categorieRevenu) {
    const affichageBloc = document.getElementById("prime-result");
    const affichageTexte = document.getElementById("categorie-prime");

    let categoriePrime = "—";
    if (categorieRevenu === "Revenu Faible") categoriePrime = "Catégorie C";
    else if (categorieRevenu === "Revenu Moyen") categoriePrime = "Catégorie B";
    else if (categorieRevenu === "Revenu Élevé") categoriePrime = "Catégorie A";

    affichageTexte.textContent = categoriePrime;
    affichageBloc.style.display = "block";
  }
});
