export function afficherCarteDocument(carte, container) {
  const pourcentage = Math.round((carte.montantTotal / carte.devisInitial) * 100);

  const html = `
    <div class="doc-card card-${carte.type} shadow-sm p-4 border border-light rounded position-relative">
      <span class="status-indicator badge position-absolute top-0 end-0 m-2">
        ${afficherStatutBadge(carte.statut)}
      </span>

      ${carte.illustration ? `<img src="${carte.illustration}" alt="${carte.titre}" class="mb-2 rounded">` : ""}

      <h5 class="mb-3">${carte.icone} ${carte.titre}</h5>
      <ul class="list-unstyled small mb-3">
        <li><strong>Devis initial :</strong> ${carte.devisInitial.toLocaleString()} €</li>
        <li><strong>Factures jointes :</strong> ${carte.facturesJointes.length}</li>
        <li><strong>Total factures :</strong> ${carte.montantTotal.toLocaleString()} €</li>
        <li><strong>% réalisé :</strong> ${pourcentage}%</li>
      </ul>

      <div class="alert alert-warning ${pourcentage >= 80 ? "d-none" : ""}">
        ⚠️ Le montant des factures est insuffisant pour débloquer le remboursement.
      </div>

      <div class="d-flex flex-column flex-sm-row gap-2 mt-auto">
        <button class="btn btn-outline-secondary btn-sm">📂 Voir les factures</button>
        <button class="btn btn-primary btn-sm">📤 Joindre une facture</button>
        <button class="btn btn-outline-success btn-sm simulateur-btn">💶 Voir remboursement estimé</button>
      </div>
    </div>
  `;

  container.innerHTML = html;

  container.querySelector(".simulateur-btn").addEventListener("click", () => {
    alert(`💶 Estimation de remboursement : ${carte.montantRemboursable.toLocaleString()} €`);
  });
}

function afficherStatutBadge(statut) {
  switch (statut) {
    case "complet": return "🟢 Complet";
    case "partiel": return "🟠 Partiel";
    case "incomplet":
    default: return "🔴 Incomplet";
  }
}
