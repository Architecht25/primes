[
{
  "id": "certificat_peb_apres_travaux",
  "slug": "certificat_peb_apres_travaux",
  "titre": "Certificat PEB après travaux",
  "unite": "label_final",
  "typeDeValeur": "conditionnel",
  "template": "peb",
  "eligible_categories": ["1", "2", "3", "4"],
  "valeursParCategorie": {
    "1": {
      "maison": {
        "A": { "sans_ventilation": 6000, "avec_ventilation": 7000 },
        "B": { "sans_ventilation": 4500, "avec_ventilation": 5250 },
        "C": { "sans_ventilation": 3000, "avec_ventilation": 3500 }
      },
      "appartement": {
        "A": { "sans_ventilation": 4500, "avec_ventilation": 5250 },
        "B": { "sans_ventilation": 3000, "avec_ventilation": 3500 }
      }
    },
    "2": {
      "maison": {
        "A": { "sans_ventilation": 5000, "avec_ventilation": 6000 },
        "B": { "sans_ventilation": 3750, "avec_ventilation": 4500 },
        "C": { "sans_ventilation": 2500, "avec_ventilation": 3000 }
      },
      "appartement": {
        "A": { "sans_ventilation": 3750, "avec_ventilation": 4500 },
        "B": { "sans_ventilation": 2500, "avec_ventilation": 3000 }
      }
    },
    "3": {
      "maison": {
        "A": { "sans_ventilation": 4000, "avec_ventilation": 5000 },
        "B": { "sans_ventilation": 3000, "avec_ventilation": 3750 },
        "C": { "sans_ventilation": 2000, "avec_ventilation": 2500 }
      },
      "appartement": {
        "A": { "sans_ventilation": 3000, "avec_ventilation": 3750 },
        "B": { "sans_ventilation": 2000, "avec_ventilation": 2500 }
      }
    },
    "4": {
      "maison": {
        "A": 0,
        "B": 0,
        "C": 0
      },
      "appartement": {
        "A": 0,
        "B": 0
      }
    }
  },
  "condition": "La rénovation doit faire passer le logement d’un label E/F (ou D pour appartement) à A, B ou C. Le montant dépend de la ventilation installée et du type de logement.",
  "conseil": "Faites réaliser un certificat PEB avant et après travaux. Vérifiez que l'amélioration correspond bien à un saut d'au moins deux lettres pour activer la prime maximale.",
  "document": "Certificat PEB initial et final + preuve du système de ventilation conforme",
  "placeholder": {
    "1": "Label final (ex : B)",
    "2": "Label final (ex : B)",
    "3": "Label final (ex : B)",
    "4": "Label final (ex : B)"
  },
  "image": "images/certificat.png"
}
]
