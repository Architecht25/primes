import { getCategorieId } from './calcul-categories.js';
import { calculerTotalToutesCartes } from './total-primes.js';

let primes = [];

export function initialiserPrimes() {
  console.log("📦 initialiserPrimes() appelée");
  fetch('data/primes.json')
    .then(response => response.json())
    .then(data => {
      primes = data;
      afficherCartes(primes);
    })
    .catch(error => console.error("Erreur de chargement des primes :", error));
}

export function afficherCartes(primes) {
  console.log("🖼️ afficherCartes() appelée");
  const container = document.getElementById("prime-cards-container");
  const template = document.getElementById("prime-card-template");
  container.innerHTML = "";

  const categorie = getCategorieId();
  let cartesAffichees = 0;

  primes.forEach(prime => {
    if (!prime.eligible_categories?.includes(categorie)) return;

    const regle = prime.valeursParCategorie?.[categorie];
    if (!regle) return;

    const clone = template.content.cloneNode(true);
    clone.querySelector(".card-img-top").src = prime.image;
    clone.querySelector(".prime-title").textContent = prime.titre;
    clone.querySelector(".prime-condition").textContent = `💡 ${prime.condition}`;
    clone.querySelector(".prime-advice").textContent = `🛠 ${prime.conseil}`;
    clone.querySelector(".prime-document").textContent = `📎 ${prime.document}`;

    const inputGroup = clone.querySelector(".input-group");
    inputGroup.innerHTML = '';

    const inputElement = createInputElement(regle, prime.placeholder?.[String(categorie)], prime.slug, prime);
    const span = createResultSpan(prime.slug);

    if (inputElement) {
      inputGroup.appendChild(inputElement);
      inputGroup.appendChild(span);
    }

    container.appendChild(clone);
    cartesAffichees++;

    console.log(`🧾 Carte affichée : ${prime.slug} (catégorie ${categorie})`);
  });

  if (cartesAffichees === 0) {
    container.innerHTML = `<div class="alert alert-warning text-center">Aucune prime n'est disponible pour votre catégorie.</div>`;
  }

  activerEcouteCalcul();
}

function createInputElement(regle, placeholder, slug, prime) {
  let inputElement;

  if (prime.typeDeValeur === "surface_et_type") {
    const wrapper = document.createElement("div");
    wrapper.className = "d-flex gap-2";

    const select = document.createElement("select");
    select.className = "form-select prime-input";
    select.setAttribute("data-slug", slug);

    const defaultOption = document.createElement("option");
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = "Type de mur";
    select.appendChild(defaultOption);

    Object.keys(regle.montants_m2).forEach(type => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type.replace(/_/g, ' ');
      select.appendChild(option);
    });

    const input = document.createElement("input");
    input.type = "number";
    input.className = "form-control prime-input";
    input.setAttribute("placeholder", placeholder || "Surface en m²");
    input.setAttribute("data-slug", slug);

    wrapper.appendChild(select);
    wrapper.appendChild(input);

    return wrapper;
  }

  if (["pourcentage_et_plafond", "montant_m2_et_limite"].includes(regle.type)) {
    inputElement = document.createElement("input");
    inputElement.type = "number";
    inputElement.className = "form-control prime-input";
  } else if (regle?.forfaits && typeof regle.forfaits === "object") {
    inputElement = document.createElement("select");
    inputElement.className = "form-select prime-input";

    const defaultOption = document.createElement("option");
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = placeholder || "Sélectionnez un type";
    inputElement.appendChild(defaultOption);

    Object.keys(regle.forfaits).forEach(type => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type.replace(/_/g, ' ');
      inputElement.appendChild(option);
    });
  } else if (regle.type === "forfait_et_plafond_facture") {
    inputElement = document.createElement("input");
    inputElement.type = "number";
    inputElement.className = "form-control prime-input";
  }

  if (inputElement) {
    inputElement.setAttribute("data-slug", slug);
    inputElement.setAttribute("name", slug);
    if (placeholder && inputElement.tagName === "INPUT") {
      inputElement.setAttribute("placeholder", placeholder);
    }
  }

  return inputElement;
}

function createResultSpan(slug) {
  const span = document.createElement("span");
  span.className = "input-group-text bg-success text-white prime-result";
  span.dataset.slug = slug;
  span.textContent = "0 €";
  return span;
}

function activerEcouteCalcul() {
  const inputs = document.querySelectorAll(".prime-input");

  inputs.forEach(input => {
    input.addEventListener("input", () => {
      calculerMontantPourCarte(input);
      calculerTotalToutesCartes();
    });

    if (input.tagName === "SELECT") {
      input.addEventListener("change", () => {
        calculerMontantPourCarte(input);
        calculerTotalToutesCartes();
      });
    }
  });
}

function calculerMontantPourCarte(input) {
  const slug = input.dataset.slug;
  const prime = primes.find(p => p.slug === slug);
  const categorie = getCategorieId();
  const regle = prime?.valeursParCategorie?.[categorie];
  if (!prime || !regle) return;

  let montant = 0;

  if (prime.typeDeValeur === "surface_et_type") {
    const inputGroup = input.closest(".input-group");
    const select = inputGroup?.querySelector("select");
    const inputSurface = inputGroup?.querySelector("input");

    if (!select || !inputSurface) return;

    const typeChoisi = select.value;
    const surface = parseFloat(inputSurface.value || 0);

    if (typeChoisi && !isNaN(surface)) {
      const montant_m2 = regle.montants_m2?.[typeChoisi] || 0;
      const surface_max = regle.surface_max || 100;
      const plafondPourcent = regle.plafond_pourcentage || 100;

      montant = Math.min(surface * montant_m2, surface_max * montant_m2);
      montant = montant * (plafondPourcent / 100);
    }

    const span = inputGroup.querySelector(".prime-result");
    if (span) span.textContent = `${montant.toFixed(2)} €`;
    return;
  }

  let valeur = input.tagName === "SELECT" ? input.value : parseFloat(input.value || 0);

  switch (regle.type) {
    case "pourcentage_et_plafond":
      montant = Math.min(valeur * (regle.pourcentage / 100), regle.plafond);
      break;

    case "montant_m2_et_limite":
      montant = Math.min(valeur * regle.montant_m2, regle.surface_max * regle.montant_m2);
      break;

    case "montant_variable_m2_et_limite":
      if (regle.montants_m2[valeur]) {
        montant = regle.montants_m2[valeur] * regle.surface_max;
      }
      break;

    case "forfait_et_plafond_facture":
      montant = regle.forfaits?.[valeur] || regle.forfait || 0;
      if (regle.plafond_pourcentage && !isNaN(parseFloat(input.value))) {
        montant = Math.min(montant, parseFloat(input.value) * (regle.plafond_pourcentage / 100));
      }
      break;

    default:
      montant = 0;
  }

  const span = input.closest(".input-group")?.querySelector(".prime-result");
  if (span) span.textContent = `${montant.toFixed(2)} €`;
}
