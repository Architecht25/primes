import { chargerPrimesCommunales, filtrerPrimesParCommune, calculerMontantTotal } from './logic/communes.js';
import { afficherCarteCommune } from './ui/commune.js';

/**
 * Initialisation spécifique pour la carte Prime Communale
 */
document.addEventListener("DOMContentLoaded", async () => {
  console.log("📦 Initialisation carte communale...");

  // Étape 1 : Charger les données
  const toutesLesPrimes = await chargerPrimesCommunales();

  // Étape 2 : Filtrer pour une commune donnée (ex. "Bruxelles")
  const communeChoisie = "Overijse"; // À rendre dynamique plus tard
  const primesDeLaCommune = filtrerPrimesParCommune(toutesLesPrimes, communeChoisie);

  // Étape 3 : Quantités simulées pour les primes à l’unité (€/m²)
  const quantites = {};

  // Étape 4 : Calcul du total
  const montantTotal = calculerMontantTotal(primesDeLaCommune, quantites);

  // Étape 5 : Affichage dynamique dans le DOM
  afficherCarteCommune(communeChoisie, primesDeLaCommune, montantTotal);
});
