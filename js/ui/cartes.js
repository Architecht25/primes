
export function initialiserCartes() {
// Liste des primes – chargées depuis un fichier JSON local
fetch('data/primes.json')
  .then(response => response.json())
  .then(primes => {
    afficherCartes(primes); // on utilise les données chargées
  })
  .catch(error => console.error("Erreur de chargement JSON :", error));

// Fonction d'affichage des cartes
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
    input.id = `input-${slug}`;
    resultSpan.id = `result-${slug}`;

    // Ajouter les données nécessaires
    input.dataset.slug = slug;
    input.dataset.montant = prime.montant_m2;
    input.placeholder = prime.placeholder || "Surface en m²";

    container.appendChild(clone);
  });

  // Calcul dynamique de la prime
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
};
