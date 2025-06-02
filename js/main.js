import 'bootstrap'; // Active les composants JS de Bootstrap

import { initialiserFleches}  from './ui/toggles.js';
import { initialiserFormulaires } from './ui/forms.js';
import { initialiserCartes } from './ui/cartes.js';

import { initialiserCategories } from './logic/categories.js';
// import { initialiserPrimes } from './logic/primes.js';

document.addEventListener("DOMContentLoaded", () => {
  initialiserFleches();
  initialiserFormulaires();
  initialiserCategories();
  initialiserCartes();
  // initialiserPrimes();
});
