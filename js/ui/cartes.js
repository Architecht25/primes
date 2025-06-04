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
      input.name = slug;
      input.dataset.slug = slug;
      input.dataset.valeurs = JSON.stringify(prime.valeursParCategorie);
      input.placeholder = prime.placeholder || "Surface en m²";

      resultSpan.id = `result-${slug}`;

      container.appendChild(clone);
    });

    // 🔄 Calcul dynamique selon la catégorie
    document.querySelectorAll(".prime-input").forEach(input => {
      input.addEventListener("input", (e) => {
        const slug = e.target.dataset.slug;
        const valeurs = JSON.parse(e.target.dataset.valeurs);
        const surface = parseFloat(e.target.value) || 0;

        // 🔹 Récupérer la catégorie sélectionnée ailleurs dans le formulaire
        const categorieInput = document.getElementById("categorie-select");
        const categorie = categorieInput ? categorieInput.value : "3"; // défaut à 3 si non trouvé
        const montant = parseFloat(valeurs[categorie]) || 0;

        const result = surface * montant;
        document.getElementById(`result-${slug}`).textContent = `${result.toLocaleString()} €`;
      });
    });
  }
}
