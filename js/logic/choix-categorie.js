import { categories } from '../../data/categories.js';

export function choixCategorie({
  revenuAnnuel,
  statut,
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

  for (const categorie of categories) {
    const cond = categorie.conditions;

    if (cond.autre_bien_interdit && autreBienEnPleinePropriete) continue;

    const expression = cond[statut];
    const montantParPersonne = 4320;
    const plafondSup = extrairePlafondMax(expression);
    const plafondMajore = plafondSup ? plafondSup + personnesACharge * montantParPersonne : null;

    console.log("➡️ Test catégorie :", categorie.id, "Expression :", expression);
    console.log("🔢 Plafond majore :", plafondMajore);

    if (verifieRevenu(expression, revenuAnnuel, plafondMajore)) {
      console.log("✅ Match trouvé :", categorie.id);
      if (categorie.id === "categorie_4" && loueViaWoonmaatschappij) return categorie;
      if (!loueViaWoonmaatschappij || categorie.location_sociale_autorisee) return categorie;
    }
  }

  return {
    id: "hors_categorie",
    description: "Catégorie non éligible",
    eligible_pour_verbouwlening: false
  };
}

// 🔧 Fonction utilitaire – extrait le plafond max depuis l'expression (ex. "≤ 42.340")
function extrairePlafondMax(expression) {
  if (expression.includes("≤")) {
    const matches = expression.match(/≤\s?([\d.]+)/);
    return matches ? parseFloat(matches[1]) : null;
  }
  return null;
}

// 🔧 Fonction utilitaire – vérifie si le revenu entre dans la plage
function verifieRevenu(expression, revenu, plafondMajore = null) {
  const nombres = expression.match(/[\d.]+/g).map(Number);

  if (expression.includes("≤") && !expression.includes(">")) {
    return revenu <= plafondMajore;
  }

  if (expression.includes(">") && expression.includes("≤")) {
    const [min, max] = nombres;
    return revenu > min && revenu <= (plafondMajore ?? max);
  }

  if (expression.includes(">")) {
    return revenu > nombres[0];
  }

  return false;
}
