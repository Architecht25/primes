// cette fonction initialise les primes en fonction des champs de saisie
// et calcule les montants en fonction des taux définis.
// nous devons d'abord calculer ici les montants par carte prime, en fonction de la catégorie de prime (1, 2, 3 ou 4) et des données saisies.
// ensuite nous calculerons le total des primes affichées dans la section "total des primes".
// nous devons donc calculer 2 niveaux de primes puis afficher 2 niveaux de primes. 

export function initialiserPrimes() {
  // 🔹 Calcul dynamique des montants de primes
  const taux = {
    isolation_toiture: 30,
    isolation_murs_ext: 30,
    demolition_toiture: 20,
    isolation_murs_int: 15,
  };

  function calculerEtAfficherPrimes() {
    let total = 0;
    const champs = [
      { name: "isolation_toiture", taux: taux.isolation_toiture, id: "result-isolation-toiture" },
      { name: "isolation_murs_ext", taux: taux.isolation_murs_ext, id: "result-isolation-murs-ext" },
      { name: "isolation_murs_int", taux: taux.isolation_murs_int, id: "result-isolation-murs-int" },
      { name: "demolition_toiture", taux: taux.demolition_toiture, id: "result-demolition-toiture" },
    ];

    champs.forEach(({ name, taux, id }) => {
      const val = parseFloat(document.querySelector(`input[name="${name}"]`)?.value) || 0;
      const montant = val * taux;
      document.getElementById(id).textContent = montant.toFixed(2) + " €";
      total += montant;
    });

    document.getElementById("total-primes-affiche").textContent = total.toFixed(2) + " €";
    document.getElementById("prime-total-result").style.display = "block";
  }

  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener("input", calculerEtAfficherPrimes);
  });

  calculerEtAfficherPrimes(); // Initialisation automatique
};
