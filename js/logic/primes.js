// 🔁 Importe la fonction qui renvoie la catégorie de revenus (1 à 4)
import { getCategorieId } from './calcul-categories.js';

// 🔁 Importe la fonction qui recalcule le total global des primes
import { calculerTotalToutesCartes } from './total-primes.js';

// 🔸 Liste des primes chargée depuis le fichier JSON
let primes = [];

// 🔹 Fonction principale appelée dans main.js pour initialiser les cartes dynamiques
export function initialiserPrimes() {
  fetch('data/primes.json') // Charge le fichier JSON
    .then(response => response.json())
    .then(data => {
      primes = data;
      afficherCartes(primes); // Lance l’affichage des cartes
    })
    .catch(error => console.error("Erreur de chargement des primes :", error));
}

// 🔹 Affiche les cartes dynamiques dans le DOM
function afficherCartes(primes) {
  const container = document.getElementById("prime-cards-container"); // Zone d’affichage
  const template = document.getElementById("prime-card-template");     // Template HTML
  container.innerHTML = ""; // Nettoie le conteneur au préalable

  const categorie = getCategorieId(); // Catégorie sélectionnée
  let cartesAffichees = 0;

  primes.forEach(prime => {
    // 🔒 Ignore les primes non éligibles à la catégorie
    if (prime.eligible_categories && !prime.eligible_categories.includes(categorie)) return;

    const clone = template.content.cloneNode(true);
    const card = clone.querySelector(".prime-card");

    // 🎨 Remplit les contenus statiques
    clone.querySelector(".card-img-top").src = prime.image;
    clone.querySelector(".prime-title").textContent = prime.titre;
    clone.querySelector(".prime-condition").textContent = `💡 ${prime.condition}`;
    clone.querySelector(".prime-advice").textContent = `🛠 ${prime.conseil}`;
    clone.querySelector(".prime-document").textContent = `📎 ${prime.document}`;

    const inputGroup = clone.querySelector(".input-group");
    inputGroup.innerHTML = ''; // 🔄 Nettoie tout contenu antérieur

    const regle = prime.valeursParCategorie?.[categorie]; // Règle spécifique à la catégorie
    if (!regle) return;

    let inputElement;

    // 🧠 Crée dynamiquement le champ de saisie selon le type de règle
    if (
      regle?.type === "pourcentage_et_plafond" ||
      regle?.type === "montant_m2_et_limite" ||
      regle?.type === "montant_variable_m2_et_limite" ||
      regle?.type === "forfait_et_plafond_facture" && !regle.forfaits
    ) {
      inputElement = document.createElement("input");
      inputElement.type = "number";
      inputElement.className = "form-control prime-input";

    } else if (regle?.forfaits && typeof regle.forfaits === "object") {
      inputElement = document.createElement("select");
      inputElement.className = "form-select prime-input";

      // 🪄 Option initiale vide (placeholder)
      const defaultOption = document.createElement("option");
      defaultOption.disabled = true;
      defaultOption.selected = true;

      const categorie = getCategorieId(); // Redemande la catégorie
      defaultOption.textContent = prime.placeholder?.[categorie] || "Sélectionnez un type";
      inputElement.appendChild(defaultOption);

      // 🔁 Ajoute chaque option dans le select
      Object.keys(regle.forfaits).forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type.replace(/_/g, ' ');
        inputElement.appendChild(option);
      });
    }

    // 💶 Élément de sortie du montant estimé
    const span = document.createElement("span");
    span.className = "input-group-text bg-success text-white prime-result";
    span.dataset.slug = prime.slug;
    span.textContent = "0 €";

    if (inputElement) {
      inputElement.setAttribute("data-slug", prime.slug);
      inputElement.setAttribute("name", prime.slug);

      // 🪄 Placeholder dynamique (issu du JSON)
      const placeholder = prime.placeholder?.[categorie] ?? "Montant à encoder";
      console.log(`📌 Placeholder injecté pour ${prime.slug} : ${placeholder}`);
      inputElement.setAttribute("placeholder", placeholder);
      console.log(inputElement.outerHTML); // Debug visuel

      // Ajoute les éléments dans le DOM
      inputGroup.innerHTML = "";
      inputGroup.appendChild(inputElement);
      inputGroup.appendChild(span);
    }

    container.appendChild(clone); // ✅ Ajoute la carte au conteneur
    cartesAffichees++;
  });

  // ⚠ Affiche un message si aucune carte affichée
  if (cartesAffichees === 0) {
    container.innerHTML = `<div class="alert alert-warning text-center">Aucune prime n'est disponible pour votre catégorie.</div>`;
  }

  activerEcouteCalcul(); // 🔁 Active les écouteurs sur les champs
}

// 🔁 Attache les événements aux champs utilisateur (input ou select)
function activerEcouteCalcul() {
  const inputs = document.querySelectorAll(".prime-input");

  inputs.forEach(input => {
    input.addEventListener("input", () => {
      calculerMontantPourCarte(input);     // Recalcul de la carte individuelle
      calculerTotalToutesCartes();         // Recalcul du total général
    });
  });
}

// 🔄 Calcule le montant pour une carte spécifique selon le champ modifié
function calculerMontantPourCarte(input) {
  const slug = input.dataset.slug;
  const prime = primes.find(p => p.slug === slug);
  const categorie = getCategorieId();
  const regle = prime?.valeursParCategorie?.[categorie];
  if (!prime || !regle) return;

  // Valeur extraite du champ (select ou input)
  let valeur = input.tagName === "SELECT" ? input.value : parseFloat(input.value || 0);
  let montant = 0;

  // 🔢 Calcul selon le type de règle
  switch (regle.type) {
    case "pourcentage_et_plafond":
      montant = valeur * (regle.pourcentage / 100);
      montant = Math.min(montant, regle.plafond);
      break;

    case "montant_m2_et_limite":
      montant = valeur * regle.montant_m2;
      montant = Math.min(montant, regle.surface_max * regle.montant_m2);
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
      montant = 0; // Peut évoluer si condition remplie ailleurs
      break;
  }

  // 💬 Met à jour le résultat visible dans la carte
  const span = input.closest(".input-group")?.querySelector(".prime-result");
  if (span) span.textContent = `${montant.toFixed(2)} €`;
}
