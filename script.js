// Script pour déplier le formulaire en fonction du profile du demandeur
document.addEventListener("DOMContentLoaded", function () {
  const select = document.getElementById("applicant-type");
  const sections = {
    prive: document.getElementById("form-prive"),
    entreprise: document.getElementById("form-entreprise"),
    copropriete: document.getElementById("form-copropriete")
  };

  // ✅ Masquer tous les formulaires au chargement
  Object.values(sections).forEach(section => {
    section.style.display = "none";
  });

  // ✅ Affichage conditionnel après sélection
  select.addEventListener("change", function () {
    Object.values(sections).forEach(section => {
      section.style.display = "none";
    });

    const selected = this.value;
    if (sections[selected]) {
      sections[selected].style.display = "block";
    }
  });
});

// Script pour déplier le formulaire relatif aux données du bien
document.addEventListener("DOMContentLoaded", function () {
  const arrow = document.getElementById("arrow-bien");
  const content = document.getElementById("form-building");

  arrow.addEventListener("click", function () {
    const isOpen = content.style.display === "block";

    content.style.display = isOpen ? "none" : "block";

    // Change l'icône flèche haut/bas
    arrow.classList.remove(isOpen ? "bi-chevron-up" : "bi-chevron-down");
    arrow.classList.add(isOpen ? "bi-chevron-down" : "bi-chevron-up");
  });
});

// Script pour l'affichage du résultat de la catégorie de prime
function afficherCategoriePrime(categorie) {
  const resultBox = document.getElementById("prime-result");
  const label = document.getElementById("categorie-prime");

  label.textContent = categorie; // ex: "Catégorie B"
  resultBox.style.display = "block";
}

afficherCategoriePrime("Catégorie B");

// Script pour l'affichage du tableau de calcul des primes
document.addEventListener("DOMContentLoaded", function () {
  const arrowPrimes = document.getElementById("arrow-primes");
  const blocPrimes = document.getElementById("bloc-primes");

  arrowPrimes.addEventListener("click", function () {
    const isVisible = blocPrimes.style.display !== "none";
    blocPrimes.style.display = isVisible ? "none" : "block";

    arrowPrimes.classList.toggle("bi-chevron-down", isVisible);
    arrowPrimes.classList.toggle("bi-chevron-up", !isVisible);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const taux = {
    toiture: 30,
    murs_creux: 20,
    chassis: 80,
    pac: 400,
    vmc: 10
  };

  function calculerEtAfficherPrimes() {
    let total = 0;

    const m2Toiture = parseFloat(document.querySelector('input[name="toiture"]').value) || 0;
    const primeToiture = m2Toiture * taux.toiture;
    document.getElementById("result-toiture").value = primeToiture.toFixed(2) + " €";
    total += primeToiture;

    const m2Murs = parseFloat(document.querySelector('input[name="murs_creux"]').value) || 0;
    const primeMurs = m2Murs * taux.murs_creux;
    document.getElementById("result-murs").value = primeMurs.toFixed(2) + " €";
    total += primeMurs;

    const m2Chassis = parseFloat(document.querySelector('input[name="chassis"]').value) || 0;
    const primeChassis = m2Chassis * taux.chassis;
    document.getElementById("result-chassis").value = primeChassis.toFixed(2) + " €";
    total += primeChassis;

    const kwPAC = parseFloat(document.querySelector('input[name="pac"]').value) || 0;
    const primePAC = kwPAC * taux.pac;
    document.getElementById("result-pac").value = primePAC.toFixed(2) + " €";
    total += primePAC;

    const debitVMC = parseFloat(document.querySelector('input[name="vmc"]').value) || 0;
    const primeVMC = debitVMC * taux.vmc;
    document.getElementById("result-vmc").value = primeVMC.toFixed(2) + " €";
    total += primeVMC;

    const totalBox = document.getElementById("prime-total-result");
    const totalLabel = document.getElementById("total-primes-affiche");

    totalLabel.textContent = total.toFixed(2) + " €";
    totalBox.style.display = "block"; // toujours visible
  }

  // Réagit aux saisies
  const inputs = document.querySelectorAll('input[type="number"]');
  inputs.forEach(input => {
    input.addEventListener("input", calculerEtAfficherPrimes);
  });

  // 👉 Ajoute ceci pour forcer un affichage initial s’il y a déjà des valeurs
  calculerEtAfficherPrimes();
});
