import { categories } from '../../data/categories.js';

export function determinerCategorie({
  revenuAnnuel,
  statut,
  personnesACharge = 0,
  autreBienEnPleinePropriete = false,
  loueViaWoonmaatschappij = false
}) {
  for (const categorie of categories) {
    const cond = categorie.conditions;

    if (cond.autre_bien_interdit && autreBienEnPleinePropriete) continue;

    const plafond = extraireMontant(cond[statut]) + personnesACharge * 4320;

    if (verifieRevenu(cond[statut], revenuAnnuel, plafond)) {
      if (categorie.id === "categorie_4" && loueViaWoonmaatschappij) {
        return categorie;
      }
      if (!loueViaWoonmaatschappij || categorie.location_sociale_autorisee) {
        return categorie;
      }
    }
  }

  return {
    id: "hors_categorie",
    description: "Catégorie non éligible",
    eligible_pour_verbouwlening: false
  };
}

function extraireMontant(expression) {
  const match = expression.match(/[\d.]+$/);
  return match ? parseFloat(match[0]) : 0;
}

function verifieRevenu(expression, revenu, plafondCalculé) {
  if (expression.includes("≤")) {
    return revenu <= plafondCalculé;
  }
  if (expression.includes(">") && expression.includes("≤")) {
    const [bas, haut] = expression.match(/[\d.]+/g).map(Number);
    return revenu > bas && revenu <= plafondCalculé;
  }
  if (expression.includes(">")) {
    const min = parseFloat(expression.match(/[\d.]+/)[0]);
    return revenu > min;
  }
  return false;
}
