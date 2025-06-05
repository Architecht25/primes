export const categories = [
  {
    "id": "categorie_4",
    "description": "Revenus très faibles",
    "conditions": {
      "seul": "≤ 24230",
      "seul_avec_charge_ou_couple_sans_charge": "≤ 36340",
      "par_personne_en_plus": "+ 4320",
      "autre_bien_interdit": true
    },
    "location_sociale_autorisee": true,
    "eligible_pour_verbouwlening": true
  },
  {
    "id": "categorie_3",
    "description": "Revenus faibles",
    "conditions": {
      "seul": "> 24230 et ≤ 42340",
      "seul_avec_charge_ou_couple_sans_charge": "> 36340 et ≤ 59270",
      "par_personne_en_plus": "+ 4320",
      "autre_bien_interdit": true
    },
    "location_sociale_autorisee": false,
    "eligible_pour_verbouwlening": true
  },
  {
    "id": "categorie_2",
    "description": "Revenus moyens",
    "conditions": {
      "seul": "> 42340 et ≤ 53880",
      "seul_avec_charge_ou_couple_sans_charge": "> 59270 et ≤ 76980",
      "par_personne_en_plus": "+ 4320",
      "autre_bien_interdit": true
    },
    "location_sociale_autorisee": false,
    "eligible_pour_verbouwlening": true
  },
  {
    "id": "categorie_1",
    "description": "Revenus élevés",
    "conditions": {
      "seul": "> 53880",
      "seul_avec_charge_ou_couple_sans_charge": "> 76980",
      "par_personne_en_plus": "+ 4320",
      "autre_bien_interdit": false
    },
    "location_sociale_autorisee": false,
    "eligible_pour_verbouwlening": false
  }
];
