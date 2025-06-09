import 'bootstrap';

// ⚙️ Initialise le calcul de la catégorie (via formulaire revenus + statut)
import { initialiserCalculCategorie } from './logic/calcul-categories.js';

// 🧮 Recalcule le total général de toutes les cartes affichées
import { calculerTotalToutesCartes } from './logic/total-primes.js';

// 🧱 Charge toutes les cartes de primes (standards + cas spéciaux)
import { initialiserCartes } from './ui/cartes.js';

document.addEventListener("DOMContentLoaded", () => {
  console.log("main.js chargé");
  console.log("📦 DOM chargé → initialiserCartes()");

  // 1. Calcule la catégorie de revenus à partir du formulaire (et stocke la valeur)
  initialiserCalculCategorie();

  // 2. Charge les cartes (standard et spéciales) dynamiquement
  initialiserCartes();

  // 3. Calcule le total estimé (après chargement des cartes)
  calculerTotalToutesCartes();
});
