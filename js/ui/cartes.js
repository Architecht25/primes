export function initialiserCartes() {

  // Charger les cartes standard
 fetch('data/peb.json')
    .then(response => response.json())
    .then(pebPrimes => {
      const container = document.getElementById("prime-cards-container");
      const template = document.getElementById("prime-peb-template");

      pebPrimes.forEach(prime => {
        const carte = genererCartePEB(prime, template);
        container.appendChild(carte);
      });
    })
    .catch(error => console.error("Erreur de chargement peb.json :", error));

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

  // 🔹 Remplissage des contenus statiques
  clone.querySelector(".card-img-top").src = prime.image;
  clone.querySelector(".prime-title").textContent = prime.titre;
  clone.querySelector(".prime-condition").textContent = prime.condition;
  clone.querySelector(".prime-advice").textContent = prime.conseil;
  clone.querySelector(".prime-document").textContent = prime.document;

  // 🔹 Récupération du conteneur de champs
  const champsContainer = clone.querySelector(".prime-fields");
  const resultSpan = clone.querySelector(".prime-result");

  if (!champsContainer) {
    console.error("❌ Échec : .prime-fields non trouvé dans le template PEB");
    return clone;
  }

  // 🔹 Ajout des écouteurs sur chaque select
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

      resultSpan.textContent = `${montant} €`;
      resultSpan.dataset.montant = montant;
      sessionStorage.setItem(`prime_${slug}`, montant);

      if (typeof calculerTotalToutesCartes === "function") {
        calculerTotalToutesCartes();
      }
    });
  });

  return clone;
}
}
