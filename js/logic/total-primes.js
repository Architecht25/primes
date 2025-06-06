// 🔹 Fonction qui additionne tous les montants affichés dans les cartes de primes
export function calculerTotalToutesCartes() {
  let total = 0; // Initialise le total à 0

  // 🔍 Récupère tous les éléments HTML contenant un montant estimé de prime
  const resultats = document.querySelectorAll(".prime-result");

  // 🔁 Parcourt chaque élément pour extraire et additionner la valeur numérique
  resultats.forEach(span => {
    // 🔧 Nettoie le texte : retire le symbole € et les espaces
    const texte = span.textContent.replace("€", "").trim();

    // 💶 Convertit en nombre (0 par défaut si invalide ou vide)
    const montant = parseFloat(texte) || 0;

    // ➕ Ajoute le montant au total
    total += montant;
  });

  // 🎯 Sélectionne l’élément dans lequel afficher le total global
  const totalElt = document.getElementById("total-primes-affiche");

  // 🖊️ Si l'élément existe, on affiche le total formaté à deux décimales
  if (totalElt) {
    totalElt.textContent = `${total.toFixed(2)} €`;
  }
}
