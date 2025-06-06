export function initialiserCartes() {
  // 🔄 Chargement des données de primes spécifiques au certificat PEB (depuis peb.json)
  fetch('data/peb.json')
    .then(response => response.json())
    .then(pebPrimes => {
      const container = document.getElementById("prime-cards-container"); // Zone d’affichage des cartes
      const template = document.getElementById("prime-peb-template"); // Template HTML pour carte PEB

      // Création et affichage de chaque carte PEB
      pebPrimes.forEach(prime => {
        const carte = genererCartePEB(prime, template);
        container.appendChild(carte);
      });
    })
    .catch(error => console.error("Erreur de chargement peb.json :", error));

  // 🔁 Fonction générique pour afficher des cartes (standard ou PEB)
  function afficherCartes(primes, templateType) {
    const container = document.getElementById("prime-cards-container");
    const template = document.getElementById("prime-card-template");      // Template standard
    const templatePEB = document.getElementById("prime-peb-template");    // Template PEB

    primes.forEach(prime => {
      let clone;

      // Sélection du bon générateur de carte en fonction du type
      switch (templateType) {
        case "peb":
          clone = genererCartePEB(prime, templatePEB);
          break;
        case "standard":
        default:
          clone = genererCarteStandard(prime, template);
          break;
      }

      container.appendChild(clone); // Ajout de la carte au DOM
    });
  }

  // 🔹 Générateur de carte standard
  function genererCarteStandard(prime, template) {
    const clone = template.content.cloneNode(true); // Duplique le template
    const slug = prime.slug;

    // Remplit les champs statiques de la carte
    clone.querySelector(".card-img-top").src = prime.image;
    clone.querySelector(".prime-title").textContent = prime.titre;
    clone.querySelector(".prime-condition").textContent = prime.condition;
    clone.querySelector(".prime-advice").textContent = prime.conseil;
    clone.querySelector(".prime-document").textContent = prime.document;

    const input = clone.querySelector(".prime-input");         // Champ utilisateur
    const resultSpan = clone.querySelector(".prime-result");   // Zone d’affichage du montant

    // Configuration du champ de saisie
    if (input) {
      input.placeholder = prime.placeholder;
      input.name = slug;
      input.setAttribute("data-slug", slug);
    }

    // Configuration du résultat
    if (resultSpan) {
      resultSpan.id = `result-${slug}`;
      resultSpan.textContent = "0 €";
    }

    return clone;
  }

  // 🔹 Générateur de carte spécifique au certificat PEB
  function genererCartePEB(prime, templatePEB) {
    const clone = templatePEB.content.cloneNode(true);
    const slug = prime.slug;

    // Remplit les champs statiques
    clone.querySelector(".card-img-top").src = prime.image;
    clone.querySelector(".prime-title").textContent = prime.titre;
    clone.querySelector(".prime-condition").textContent = prime.condition;
    clone.querySelector(".prime-advice").textContent = prime.conseil;
    clone.querySelector(".prime-document").textContent = prime.document;

    // Récupération des champs dynamiques
    const champsContainer = clone.querySelector(".prime-fields");
    const resultSpan = clone.querySelector(".prime-result");

    // Sécurité : éviter l’erreur si le template est mal structuré
    if (!champsContainer) {
      console.error("❌ Échec : .prime-fields non trouvé dans le template PEB");
      return clone;
    }

    // Ajout des écouteurs sur tous les <select> à l’intérieur du template
    champsContainer.querySelectorAll("select").forEach(select => {
      select.addEventListener("change", () => {
        const type = champsContainer.querySelector('[name="type-logement"]').value;
        const ventilation = champsContainer.querySelector('[name="ventilation"]').value;
        const labelFinal = champsContainer.querySelector('[name="label-final"]').value;
        const labelInitial = champsContainer.querySelector('#certificat-peb')?.value?.toUpperCase() || "";

        const labels = ["A", "B", "C", "D", "E", "F"];
        const saut = labels.indexOf(labelInitial) - labels.indexOf(labelFinal);
        const categorie = sessionStorage.getItem("categorie") || "3";

        let montant = 0;

        // Calcul de la prime uniquement si toutes les conditions sont remplies
        if (
          type &&
          ventilation &&
          labelFinal &&
          labels.includes(labelInitial) &&
          labels.includes(labelFinal) &&
          saut >= 1
        ) {
          montant = prime.valeursParCategorie?.[categorie]?.[type]?.[labelFinal]?.[ventilation] || 0;
        }

        // Mise à jour du montant affiché
        resultSpan.textContent = `${montant} €`;
        resultSpan.dataset.montant = montant;

        // Stocke le montant dans sessionStorage
        sessionStorage.setItem(`prime_${slug}`, montant);

        // Recalcule le total global si la fonction est disponible
        if (typeof calculerTotalToutesCartes === "function") {
          calculerTotalToutesCartes();
        }
      });
    });

    return clone;
  }
}
