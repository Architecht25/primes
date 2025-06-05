import { getCategorieId } from './calcul-categories.js';
import { calculerTotalToutesCartes } from './total-primes.js';

let primes = [];

export function initialiserPrimes() {
  fetch('data/primes.json')
    .then(response => response.json())
    .then(data => {
      primes = data;
      afficherCartes(primes);
    })
    .catch(error => console.error("Erreur de chargement des primes :", error));
}

function afficherCartes(primes) {
  const container = document.getElementById("prime-cards-container");
  const template = document.getElementById("prime-card-template");
  container.innerHTML = ""; // Réinitialiser le conteneur

  const categorie = getCategorieId();

  let cartesAffichees = 0;

  primes.forEach(prime => {
    // 🔒 Masquer les primes non éligibles à la catégorie
    if (prime.eligible_categories && !prime.eligible_categories.includes(categorie)) return;

    const clone = template.content.cloneNode(true);
    const card = clone.querySelector(".prime-card");

    // Contenus statiques
    clone.querySelector(".card-img-top").src = prime.image;
    clone.querySelector(".prime-title").textContent = prime.titre;
    clone.querySelector(".prime-condition").textContent = `💡 ${prime.condition}`;
    clone.querySelector(".prime-advice").textContent = `🛠 ${prime.conseil}`;
    clone.querySelector(".prime-document").textContent = `📎 ${prime.document}`;

    const inputGroup = clone.querySelector(".input-group");
    inputGroup.innerHTML = ''; // vider l'input initial

    const regle = prime.valeursParCategorie?.[categorie];
    if (!regle) return;

    let inputElement;

    // 🔄 Champ dynamique selon le type (déterminé par la règle active pour la catégorie)
    if (regle?.type === "pourcentage_et_plafond" ||
        regle?.type === "montant_m2_et_limite" ||
        regle?.type === "montant_variable_m2_et_limite") {
      inputElement = document.createElement("input");
      inputElement.type = "number";
      inputElement.className = "form-control prime-input";
      // 🧪 Debug optionnel : console.log(`🧪 Placeholder pour ${prime.slug} : ${prime.placeholder}`);
    } else if (regle?.forfaits && typeof regle.forfaits === "object") {
        inputElement = document.createElement("select");
        inputElement.className = "form-select prime-input";

        // 🪄 Option par défaut agissant comme un placeholder
        const defaultOption = document.createElement("option");
        defaultOption.disabled = true;
        defaultOption.selected = true;

        const categorie = getCategorieId();
        defaultOption.textContent = prime.placeholder?.[categorie] || "Sélectionnez un type";
        inputElement.appendChild(defaultOption);

        // 🧩 Ajouter les vraies options
        Object.keys(regle.forfaits).forEach(type => {
          const option = document.createElement("option");
          option.value = type;
          option.textContent = type.replace(/_/g, ' ');
          inputElement.appendChild(option);
        });
      }

    const span = document.createElement("span");
    span.className = "input-group-text bg-success text-white prime-result";
    span.dataset.slug = prime.slug;
    span.textContent = "0 €";

    if (inputElement) {
      inputElement.setAttribute("data-slug", prime.slug);
      inputElement.setAttribute("name", prime.slug);

      // ✅ Ajout du placeholder défini dans le JSON (ou valeur par défaut)
      const placeholder = prime.placeholder?.[categorie] ?? "Montant à encoder";
      console.log(`📌 Placeholder injecté pour ${prime.slug} : ${placeholder}`);
      inputElement.setAttribute("placeholder", placeholder);
      console.log(inputElement.outerHTML);


      inputGroup.innerHTML = "";
      inputGroup.appendChild(inputElement);
      inputGroup.appendChild(span);
    }

    container.appendChild(clone);
    cartesAffichees++;
  });

  if (cartesAffichees === 0) {
    container.innerHTML = `<div class="alert alert-warning text-center">Aucune prime n'est disponible pour votre catégorie.</div>`;
  }

  activerEcouteCalcul();
}

function activerEcouteCalcul() {
  const inputs = document.querySelectorAll(".prime-input");
  inputs.forEach(input => {
    input.addEventListener("input", () => {
      calculerMontantPourCarte(input);
      calculerTotalToutesCartes();
    });
  });
}

function calculerMontantPourCarte(input) {
  const slug = input.dataset.slug;
  const prime = primes.find(p => p.slug === slug);
  const categorie = getCategorieId();
  const regle = prime?.valeursParCategorie?.[categorie];
  if (!prime || !regle) return;

  let valeur = input.tagName === "SELECT" ? input.value : parseFloat(input.value || 0);
  let montant = 0;

  switch (regle.type) {
    case "pourcentage_et_plafond":
      montant = valeur * (regle.pourcentage / 100);
      montant = Math.min(montant, regle.plafond);
      break;

    case "montant_m2_et_limite":
      montant = valeur * regle.montant_m2;
      montant = Math.min(montant, regle.surface_max * regle.montant_m2);
      montant = Math.min(montant, valeur * regle.montant_m2);
      break;

    case "montant_variable_m2_et_limite":
      if (regle.montants_m2[valeur]) {
        montant = regle.montants_m2[valeur] * regle.surface_max;
        montant = Math.min(montant, regle.surface_max * regle.montants_m2[valeur]);
      }
      break;

    case "forfait_et_plafond_facture":
      if (typeof regle.forfaits === "object") {
        montant = regle.forfaits[valeur] || 0;
      } else {
        montant = regle.forfait || 0;
      }
      if (regle.plafond_pourcentage && !isNaN(parseFloat(input.value))) {
        montant = Math.min(montant, parseFloat(input.value) * (regle.plafond_pourcentage / 100));
      }
      break;

    case "prime_conditionnelle":
      montant = 0;
      break;
  }

  const span = input.closest(".input-group")?.querySelector(".prime-result");
  if (span) span.textContent = `${montant.toFixed(2)} €`;
}
