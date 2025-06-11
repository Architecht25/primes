import 'bootstrap';

// ⚙️ Initialise le calcul de la catégorie (via formulaire revenus + statut)
import { initialiserCalculCategorie } from './logic/calcul-categories.js';

// 🧮 Recalcule le total général de toutes les cartes affichées
import { calculerTotalToutesCartes } from './logic/total-primes.js';

// 🧱 Charge toutes les cartes de primes (standards + cas spéciaux)
import { initialiserCartes } from './ui/cartes.js';

// 👷‍♂️ Initialise l'ajout d'entrepreneurs (formulaire + stockage)
import { initialiserAjoutEntrepreneurs } from './ui/entrepreneurs.js';

document.addEventListener("DOMContentLoaded", () => {
  console.log("main.js chargé");
  console.log("📦 DOM chargé → initialiserCartes()");

  // 1. Calcule la catégorie de revenus à partir du formulaire (et stocke la valeur)
  initialiserCalculCategorie();

  // 2. Charge les cartes (standard et spéciales) dynamiquement
  // 💡 Utiliser sessionStorage ou catégorie par défaut "3"
  const categorieInitiale = sessionStorage.getItem("categorie") || "4"; // Catégorie par défaut si non définie
  initialiserCartes(categorieInitiale);

  // 3. Calcule le total estimé (après chargement des cartes)
  calculerTotalToutesCartes();

  // 4. Initialise l'ajout d'entrepreneurs
  initialiserAjoutEntrepreneurs();
});
