import 'bootstrap'; // Active les composants JS de Bootstrap
import Swal from 'sweetalert2'; // Pour les alertes stylisées

import { initialiserFormulaires } from './ui/forms.js';
import { initialiserCategorie } from './logic/categorie.js';
import { initialiserCartes } from './ui/cartes.js';
import { initialiserPrimes } from './logic/primes.js';
import { initialiserFleches}  from './ui/toggles.js';

document.addEventListener("DOMContentLoaded", () => {
  initialiserFormulaires();
  initialiserCategorie();
  initialiserCartes();
  initialiserPrimes();
  initialiserFleches();
});
