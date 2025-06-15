export const cartesDocuments = [
  {
    type: "factures",
    titre: "Factures",
    icone: "🧾",
    devisInitial: 18500,
    facturesJointes: [
      { id: 1, montant: 3000, date: "2025-05-01", prestataire: "Toitures SRL" },
      { id: 2, montant: 4000, date: "2025-05-15", prestataire: "Chauffage SPRL" },
      { id: 3, montant: 7650, date: "2025-06-01", prestataire: "Isolation SA" }
    ],
    montantTotal: 14650,
    statut: "complet", // ou "partiel", "incomplet"
    montantRemboursable: 7200,
    illustration: "images/factures.png"
  },
  // ... autres cartes à venir
];

export const cartePhotos = {
  type: "photos",
  titre: "Preuves photo",
  icone: "📸",
  nombre: 6,
  etapes: ["avant", "pendant", "après"],
  statut: "partiel",
  illustration: "images/photos-travaux.png"
};
