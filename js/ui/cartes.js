import { getCategorieId } from '../logic/calcul-categories.js';
import { calculerPrimePEB } from '../logic/primes.js';
import { calculerTotalToutesCartes } from '../logic/total-primes.js';


export function initialiserCartes() {
  const container = document.getElementById("prime-cards-container");
  const template = document.getElementById("prime-card-template");
  const categorie = String(getCategorieId());

  if (!container || !template) {
    console.error("❌ Template ou conteneur introuvable.");
    return;
  }

  // 1️⃣ Chargement des cartes standards depuis primes.json
  fetch('data/primes.json')
    .then(response => response.json())
    .then(primes => {
      primes.forEach(prime => {
        console.log("🎯 Carte testée :", prime.slug, "→ Catégorie:", categorie, "→ Autorisées:", prime.categorieLimite);
        if (prime.slug === "certificat_peb_apres_travaux") return; // ⛔️ NE PAS AJOUTER LA CARTE PEB

        if (prime.categorieLimite && !prime.categorieLimite.includes(categorie)) return;

        const clone = genererCarteStandard(prime, template);
        container.appendChild(clone);
        console.log("🧩 Carte générée :", prime.slug, ", catégorie", categorie);
      });
    })
    .catch(error => console.error("Erreur de chargement primes.json :", error));

  // 2️⃣ Chargement séparé de la carte PEB depuis peb.json
  fetch('data/peb.json')
  .then(response => response.json())
  .then(pebPrimes => {
    console.log("🟢 Contenu peb.json :", pebPrimes); // <--- Doit s'afficher

    pebPrimes.forEach(prime => {
      console.log("🎯 Carte testée (PEB) :", prime.slug, "→ Catégorie:", categorie, "→ Autorisées:", prime.eligible_categories);
      if (!prime.eligible_categories.includes(categorie)) return;

      const clone = genererCarteStandard(prime, template);
      // container.appendChild(clone);

      if (prime.slug === "certificat_peb_apres_travaux") {
        initialiserCartePEB(prime, categorie);
        console.log("✅ Carte PEB initialisée.");
      }
    });
  })
  .catch(error => console.error("Erreur de chargement peb.json :", error));
}

function genererCarteStandard(prime, template) {
  const clone = template.content.cloneNode(true);
  const slug = prime.slug;

  // Données génériques
  clone.querySelector(".card-img-top").src = prime.image;
  clone.querySelector(".prime-title").textContent = prime.titre;
  clone.querySelector(".prime-condition").textContent = prime.condition;
  clone.querySelector(".prime-advice").textContent = prime.conseil;
  clone.querySelector(".prime-document").textContent = prime.document;

  const inputGroup = clone.querySelector(".input-group");
  const cat = getCategorieId();

  // Nettoyage de l'inputGroup pour tout remplacer dynamiquement
  inputGroup.innerHTML = "";

  // Traitement spécial pour "surface_et_type"
  if (prime.typeDeValeur === "surface_et_type") {
    // 🔽 Sélecteur de type de mur
    const select = document.createElement("select");
    select.className = "form-select prime-input me-1";
    select.setAttribute("data-slug", slug);
    select.name = `${slug}_type`;

    const defaultOption = document.createElement("option");
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = "Choisissez le type de mur";
    select.appendChild(defaultOption);

    const types = prime.valeursParCategorie?.[cat]?.montants_m2;
    if (types) {
      Object.keys(types).forEach(key => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key.replace(/_/g, " ");
        select.appendChild(option);
      });
    }

    // 🔢 Input surface
    const inputSurface = document.createElement("input");
    inputSurface.type = "number";
    inputSurface.className = "form-control prime-input";
    inputSurface.name = `${slug}_surface`;
    inputSurface.setAttribute("data-slug", slug);
    inputSurface.placeholder = prime.placeholder?.[cat] || "Surface en m²";

    // 💶 Résultat
    const resultSpan = document.createElement("span");
    resultSpan.className = "input-group-text bg-success text-white prime-result";
    resultSpan.id = `result-${slug}`;
    resultSpan.textContent = "0 €";

    // ➕ Ajout des éléments
    inputGroup.appendChild(select);
    inputGroup.appendChild(inputSurface);
    inputGroup.appendChild(resultSpan);

  } else {
    // 🧱 Traitement standard
    const input = document.createElement("input");
    input.type = "number";
    input.className = "form-control prime-input";
    input.name = slug;
    input.setAttribute("data-slug", slug);
    input.placeholder = typeof prime.placeholder === "object"
      ? prime.placeholder?.[cat] || "Votre valeur"
      : prime.placeholder || "Votre valeur";

    const resultSpan = document.createElement("span");
    resultSpan.className = "input-group-text bg-success text-white prime-result";
    resultSpan.id = `result-${slug}`;
    resultSpan.textContent = "0 €";

    inputGroup.appendChild(input);
    inputGroup.appendChild(resultSpan);
  }

  console.log(`🧩 Carte générée : ${slug}, catégorie ${cat}`);
  return clone;
}

export function initialiserCartePEB(prime, categorie) {
  const container = document.querySelector('.prime-card-peb');

  const selectLabelInitial = container.querySelector('#certificat-peb');
  const selectLogement = container.querySelector('select[name="type-logement"]');
  const selectVentilation = container.querySelector('select[name="ventilation"]');
  const selectLabelFinal = container.querySelector('select[name="label-final"]');
  const resultatPrime = container.querySelector('.prime-result');

  // Fonction appelée à chaque changement des champs
  function calculerEtAfficherPrimePEB() {
    const labelInitial = selectLabelInitial.value;
    const logement = selectLogement.value;
    const ventilation = selectVentilation.value;
    const labelFinal = selectLabelFinal.value;

    const montant = calculerPrimePEB(prime, categorie, labelInitial, logement, labelFinal, ventilation);

    if (!labelInitial || !labelFinal || !logement || !ventilation) {
      resultatPrime.textContent = "Complétez les champs pour estimer la prime";
    } else {
      resultatPrime.textContent = montant > 0 ? `${montant} €` : "Pas de prime dans ce cas";
      calculerTotalToutesCartes();
    }
  }

  // 🔑 ATTENTION : Initialisation initiale
  calculerEtAfficherPrimePEB();

  // 🔑 ATTENTION : Écoute en temps réel
  [selectLabelInitial, selectLogement, selectVentilation, selectLabelFinal].forEach(input => {
    input.addEventListener('change', calculerEtAfficherPrimePEB);
  });
}
