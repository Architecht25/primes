// Cette fonction initialise les cartes de primes en chargeant les données depuis un fichier JSON
// et en les affichant dans le conteneur prévu. Elle gère également les événements
// pour le calcul dynamique des montants en fonction de la surface saisie par l'utilisateur.


export function initialiserCartes() {
  // Liste des primes – chargées depuis un fichier JSON local
  fetch('data/primes.json')
    .then(response => response.json())
    .then(primes => {
      afficherCartes(primes);
    })
    .catch(error => console.error("Erreur de chargement JSON :", error));

  function afficherCartes(primes) {
    const container = document.getElementById("prime-cards-container");
    const template = document.getElementById("prime-card-template");

    primes.forEach((prime) => {
      const clone = template.content.cloneNode(true);
      const slug = prime.slug;

      // Remplir les contenus de la carte
      clone.querySelector(".card-img-top").src = prime.image;
      clone.querySelector(".prime-title").textContent = prime.titre;
      clone.querySelector(".prime-condition").innerHTML = `<strong>Conditions :</strong> ${prime.condition}`;
      clone.querySelector(".prime-advice").innerHTML = `<strong>Conseils :</strong> ${prime.conseil}`;
      clone.querySelector(".prime-document").innerHTML = `<strong>Note :</strong> ${prime.document}`;

      // Identifier les champs input/result
      const input = clone.querySelector(".prime-input");
      const resultSpan = clone.querySelector(".prime-result");

      // ✅ Ajout des attributs nécessaires
      input.id = `input-${slug}`;
      input.name = slug; // ← nécessaire pour initialiserPrimes()
      input.dataset.slug = slug;
      input.dataset.montant = prime.montant_m2;
      input.placeholder = prime.placeholder || "Surface en m²";

      resultSpan.id = `result-${slug}`; // ← nécessaire pour initialiserPrimes()

      container.appendChild(clone);
    });

    // Calcul dynamique local (facultatif si calcul centralisé ailleurs - cette partie sera insérée dans initialiserPrimes)
    document.querySelectorAll(".prime-input").forEach(input => {
      input.addEventListener("input", (e) => {
        const slug = e.target.dataset.slug;
        const montant = parseFloat(e.target.dataset.montant);
        const surface = parseFloat(e.target.value) || 0;
        const result = surface * montant;

        document.getElementById(`result-${slug}`).textContent = `${result.toLocaleString()} €`;
      });
    });
  }
}
