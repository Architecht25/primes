import 'bootstrap';

import { initialiserFormulaires } from './ui/forms.js';
import { initialiserCalculCategorie } from './logic/calcul-categories.js';
import { initialiserPrimes } from './logic/primes.js';
import { calculerTotalToutesCartes } from './logic/total-primes.js';

document.addEventListener("DOMContentLoaded", () => {
  console.log("main.js chargé");
  console.log("📦 DOM chargé → initialiserPrimes()");
  initialiserFormulaires();
  initialiserCalculCategorie();
  initialiserPrimes(); // cette fonction chargera les cartes elle-même
  calculerTotalToutesCartes();
});
