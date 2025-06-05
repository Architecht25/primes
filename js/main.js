import 'bootstrap';

import { initialiserFormulaires } from './ui/forms.js';
import { initialiserCartes } from './ui/cartes.js';

import { initialiserCalculCategorie } from './logic/calcul-categories.js';
import { initialiserPrimes } from './logic/primes.js';
import { calculerTotalToutesCartes } from './logic/total-primes.js';

document.addEventListener("DOMContentLoaded", () => {
  console.log("main.js chargé");
  initialiserFormulaires();
  initialiserCalculCategorie(); // ✅ lance le calcul avec le bouton
  initialiserCartes();
  initialiserPrimes();
  calculerTotalToutesCartes()
});
