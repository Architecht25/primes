import { primes } from '../data/primes.js'; // ton fichier JSON/JS de primes
import { getCategorieId } from './categorie-utils.js'; // récupère la catégorie du ménage

export function initialiserPrimes() {
  const inputs = document.querySelectorAll(".prime-input");

  inputs.forEach(input => {
    input.addEventListener("input", () => {
      calculerMontantPourCarte(input);
      calculerTotalToutesCartes(); // facultatif
    });
  });
}

function calculerMontantPourCarte(input) {
  const slug = input.dataset.slug;
  const valeur = parseFloat(input.value || 0);
  const prime = primes.find(p => p.slug === slug);
  const categorie = getCategorieId(); // ex: "1", "2", "3"

  if (!prime || !prime.valeursParCategorie || !prime.valeursParCategorie[categorie]) return;

  const taux = prime.valeursParCategorie[categorie];
  const montant = valeur * taux;

  const output = document.getElementById(`result-${slug}`);
  if (output) output.textContent = `${montant.toFixed(2)} €`;
}
