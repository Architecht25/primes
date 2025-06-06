// 🔁 Import des catégories de revenu (1 à 4) définies dans le fichier JSON
import { categories } from '../../data/categories.js';

// 🔹 Fonction principale appelée pour déterminer la catégorie du ménage
export function choixCategorie({
  revenuAnnuel,
  statut,                             // ex : "seul", "seul_avec_charge_ou_couple_sans_charge"
  personnesACharge = 0,
  autreBienEnPleinePropriete = false,
  loueViaWoonmaatschappij = false
}) {
  console.log("🧠 Nouvelle version de determinerCategorie appelée");
  console.log("🔎 Données reçues :", {
    revenuAnnuel,
    statut,
    personnesACharge,
    autreBienEnPleinePropriete,
    loueViaWoonmaatschappij
  });

  // 🔁 Parcourt toutes les catégories définies dans le fichier JSON
  for (const categorie of categories) {
    const cond = categorie.conditions;

    // 🔒 Si la catégorie interdit la détention d’un autre bien, on passe à la suivante
    if (cond.autre_bien_interdit && autreBienEnPleinePropriete) continue;

    const expression = cond[statut]; // ex: "≤ 42.340"
    const montantParPersonne = 4320; // Montant ajouté par personne à charge
    const plafondSup = extrairePlafondMax(expression); // Extrait le plafond brut
    const plafondMajore = plafondSup ? plafondSup + personnesACharge * montantParPersonne : null;

    console.log("➡️ Test catégorie :", categorie.id, "Expression :", expression);
    console.log("🔢 Plafond majore :", plafondMajore);

    // ✅ Si le revenu est dans la plage autorisée pour cette catégorie
    if (verifieRevenu(expression, revenuAnnuel, plafondMajore)) {
      console.log("✅ Match trouvé :", categorie.id);

      // ⚠ Catégorie 4 : ne s’applique que si location via Woonmaatschappij
      if (categorie.id === "categorie_4" && loueViaWoonmaatschappij) return categorie;

      // Sinon, on vérifie si la location sociale est autorisée pour cette catégorie
      if (!loueViaWoonmaatschappij || categorie.location_sociale_autorisee) return categorie;
    }
  }

  // ❌ Si aucune correspondance trouvée, retour par défaut
  return {
    id: "hors_categorie",
    description: "Catégorie non éligible",
    eligible_pour_verbouwlening: false
  };
}

// 🔧 Extrait le plafond maximum depuis une chaîne de type "≤ 42340"
function extrairePlafondMax(expression) {
  if (expression.includes("≤")) {
    const matches = expression.match(/≤\s?([\d.]+)/);
    return matches ? parseFloat(matches[1]) : null;
  }
  return null;
}

// 🔧 Vérifie si un revenu donné respecte l’expression fournie
function verifieRevenu(expression, revenu, plafondMajore = null) {
  const nombres = expression.match(/[\d.]+/g).map(Number);

  // Cas simple : "≤ 42.340"
  if (expression.includes("≤") && !expression.includes(">")) {
    return revenu <= plafondMajore;
  }

  // Cas entre deux bornes : "> 24.230 et ≤ 42.340"
  if (expression.includes(">") && expression.includes("≤")) {
    const [min, max] = nombres;
    return revenu > min && revenu <= (plafondMajore ?? max);
  }

  // Cas simple : "> 42.340"
  if (expression.includes(">")) {
    return revenu > nombres[0];
  }

  return false;
}
