export function initialiserCartes() {

  // Charger les cartes standard
  fetch('data/primes.json')
    .then(response => response.json())
    .then(primes => {
      afficherCartes(primes);
    })
    .catch(error => console.error("Erreur de chargement JSON :", error));

    // Charger la carte PEB
    fetch('data/peb.json')
      .then(response => response.json())
      .then(primes => afficherCartes(primes, 'peb'))
      .catch(error => console.error("Erreur de chargement des cartes PEB :", error));

  function afficherCartes(primes, templateType) {
  const container = document.getElementById("prime-cards-container");
  const template = document.getElementById("prime-card-template");
  const templatePEB = document.getElementById("prime-peb-template");

  primes.forEach(prime => {
    let clone;

    switch (templateType) {
      case "peb":
        clone = genererCartePEB(prime, templatePEB);
        break;
      case "standard":
      default:
        clone = genererCarteStandard(prime, template);
        break;
    }

    container.appendChild(clone);
  });
}


  // 🔹 Pour les cartes standards
  function genererCarteStandard(prime, template) {
    const clone = template.content.cloneNode(true);
    const slug = prime.slug;

    clone.querySelector(".card-img-top").src = prime.image;
    clone.querySelector(".prime-title").textContent = prime.titre;
    clone.querySelector(".prime-condition").textContent = prime.condition;
    clone.querySelector(".prime-advice").textContent = prime.conseil;
    clone.querySelector(".prime-document").textContent = prime.document;

    const input = clone.querySelector(".prime-input");
    const resultSpan = clone.querySelector(".prime-result");

    if (input) {
      input.placeholder = prime.placeholder;
      input.name = slug;
      input.setAttribute("data-slug", slug);
    }

    if (resultSpan) {
      resultSpan.id = `result-${slug}`;
      resultSpan.textContent = "0 €";
    }

    return clone;
  }

  // 🔹 Pour la carte spécifique au certificat PEB
  function genererCartePEB(prime, templatePEB) {
  const clone = templatePEB.content.cloneNode(true);
  const slug = prime.slug;

  // Remplissage des contenus statiques
  clone.querySelector(".card-img-top").src = prime.image;
  clone.querySelector(".prime-title").textContent = prime.titre;
  clone.querySelector(".prime-condition").textContent = prime.condition;
  clone.querySelector(".prime-advice").textContent = prime.conseil;
  clone.querySelector(".prime-document").textContent = prime.document;

  const inputGroup = clone.querySelector(".input-group");
  const resultSpan = clone.querySelector(".prime-result");
  const labelSpan = inputGroup.querySelector("#label-initial-global");

  // Ajout des écouteurs sur chaque select
  inputGroup.querySelectorAll("select").forEach(select => {
    select.addEventListener("change", () => {
      const type = inputGroup.querySelector('[name="type-logement"]').value;
      const ventilation = inputGroup.querySelector('[name="ventilation"]').value;
      const labelFinal = inputGroup.querySelector('[name="label-final"]').value;

      // Lire dynamiquement le label initial dans le clone
      const labelInitialInput = clone.querySelector('#certificat-peb');
      const labelInitial = labelInitialInput?.value?.toUpperCase() || "";

      const labels = ["A", "B", "C", "D", "E", "F"];
      const saut = labels.indexOf(labelInitial) - labels.indexOf(labelFinal);
      const categorie = sessionStorage.getItem("categorie") || "3";

      let montant = 0;

      // Vérifie que tous les champs sont valides et que le saut est suffisant
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

      // Mise à jour du texte affiché et du stockage
      resultSpan.textContent = `${montant} €`;
      resultSpan.dataset.montant = montant;
      sessionStorage.setItem(`prime_${slug}`, montant);

      // Affichage du label initial dans la carte
      if (labelSpan) labelSpan.textContent = labelInitial;

      // Mise à jour du total global
      if (typeof calculerTotalToutesCartes === "function") {
        calculerTotalToutesCartes();
      }
    });
  });

  return clone;
}
}
