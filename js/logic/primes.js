import { getCategorieId } from './calcul-categories.js'; // récupère la catégorie du ménage
import { calculerTotalToutesCartes } from './total-primes.js'; // calcul du total

let primes = []; // variable globale locale au module

export function initialiserPrimes() {
  fetch('data/primes.json') // ⚠️ fichier JSON, pas JS !
    .then(response => response.json())
    .then(data => {
      primes = data;
      activerEcouteCalcul(); // une fois les cartes générées
    })
    .catch(error => console.error("Erreur de chargement des primes :", error));
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
  const valeur = parseFloat(input.value || 0);
  const prime = primes.find(p => p.slug === slug);
  const categorie = getCategorieId(); // "1", "2", "3", etc.

  if (!prime || !prime.valeursParCategorie || !prime.valeursParCategorie[categorie]) return;

  const taux = prime.valeursParCategorie[categorie];
  const montant = valeur * taux;

  const output = document.getElementById(`result-${slug}`);
  if (output) output.textContent = `${montant.toFixed(2)} €`;
}
