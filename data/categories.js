// data/categories.js

export const categories = [
  {
    "id": "categorie_4",
    "description": "Revenus très faibles",
    "conditions": {
      "seul": "≤ 24.230",
      "seul_avec_charge_ou_couple_sans_charge": "≤ 36.340",
      "par_personne_en_plus": "+ 4.320",
      "autre_bien_interdit": true // il restera à intégrer cette donnée ci dans le calcul et donc le formulaire
    },
    "location_sociale_autorisee": true,
    "eligible_pour_verbouwlening": true
  },
  {
    "id": "categorie_3",
    "description": "Revenus faibles",
    "conditions": {
      "seul": "> 24.230 et ≤ 42.340",
      "seul_avec_charge_ou_couple_sans_charge": "> 36.340 et ≤ 59.270",
      "par_personne_en_plus": "+ 4.320",
      "autre_bien_interdit": true
    },
    "location_sociale_autorisee": false,
    "eligible_pour_verbouwlening": true
  },
  {
    "id": "categorie_2",
    "description": "Revenus moyens",
    "conditions": {
      "seul": "> 42.340 et ≤ 53.880",
      "seul_avec_charge_ou_couple_sans_charge": "> 59.270 et ≤ 76.980",
      "par_personne_en_plus": "+ 4.320",
      "autre_bien_interdit": true
    },
    "location_sociale_autorisee": false,
    "eligible_pour_verbouwlening": true
  },
  {
    "id": "categorie_1",
    "description": "Revenus élevés",
    "conditions": {
      "seul": "> 53.880",
      "seul_avec_charge_ou_couple_sans_charge": "> 76.980",
      "par_personne_en_plus": "+ 4.320",
      "autre_bien_interdit": false
    },
    "location_sociale_autorisee": false,
    "eligible_pour_verbouwlening": false
  }
];
