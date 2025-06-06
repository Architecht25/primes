// Charge les composants JavaScript de Bootstrap (ex: modales, tooltips, dropdowns, etc.)
import 'bootstrap';

// Importe la fonction qui calcule la catégorie de revenus du demandeur (catégorie 1 à 4)
import { initialiserCalculCategorie } from './logic/calcul-categories.js';

// Importe la fonction qui charge et affiche dynamiquement les cartes de primes depuis le fichier JSON
import { initialiserPrimes } from './logic/primes.js';

// Importe la fonction qui calcule le total général de toutes les primes affichées sur la page
import { calculerTotalToutesCartes } from './logic/total-primes.js';


// Écouteur d'événement qui attend que le DOM soit complètement chargé avant d’exécuter les fonctions
document.addEventListener("DOMContentLoaded", () => {
  console.log("main.js chargé"); // Message de confirmation dans la console
  console.log("📦 DOM chargé → initialiserPrimes()"); // Indication du démarrage du processus de création des cartes

  // Calcule automatiquement la catégorie du demandeur en fonction des revenus et charges déclarés
  initialiserCalculCategorie();

  // Charge les données des primes depuis le JSON, crée les cartes correspondantes, et affiche les bons champs
  initialiserPrimes();

  // Calcule et affiche le total des primes estimées, en additionnant les résultats de chaque carte
  calculerTotalToutesCartes();
});
