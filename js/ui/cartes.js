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

    if (!template) {
      console.error("❌ Template HTML manquant : #prime-card-template");
      return;
    }

    primes.forEach((prime) => {
      const clone = template.content.cloneNode(true);
      const slug = prime.slug;

      // Injection des données de la prime
      clone.querySelector(".card-img-top").src = prime.image;
      clone.querySelector(".prime-title").textContent = prime.titre;
      clone.querySelector(".prime-condition").textContent = prime.condition;
      clone.querySelector(".prime-advice").textContent = prime.conseil;
      clone.querySelector(".prime-document").textContent = prime.document;

      // Liaison de l'input
      const input = clone.querySelector(".prime-input");
      input.placeholder = prime.placeholder;
      input.name = slug;
      input.setAttribute("data-slug", slug);

      // Liaison du span résultat
      const resultSpan = clone.querySelector(".prime-result");
      resultSpan.id = `result-${slug}`;
      resultSpan.textContent = "0 €";

      // Ajout au DOM
      container.appendChild(clone);
    });
  }
}
