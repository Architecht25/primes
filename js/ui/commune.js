export function afficherCarteCommune(communeNom, primes, montantTotal) {
  const container = document.getElementById("prime-commune-container");
  container.innerHTML = ""; // Nettoie le contenu précédent

  // Création de la structure HTML
  const col = document.createElement("div");
  col.className = "col-12 col-md-6 col-lg-4";

  const card = document.createElement("div");
  card.className = "prime-card prime-card-commune p-3 shadow-sm border border-info h-100";

  // Image
  const img = document.createElement("img");
  img.src = "images/commune.png";
  img.className = "card-img-top";
  img.alt = "Prime communale";
  card.appendChild(img);

  // Titre
  const title = document.createElement("h5");
  title.className = "prime-title";
  title.textContent = "Prime communale";
  card.appendChild(title);

  // Commune
  const communeP = document.createElement("p");
  communeP.innerHTML = `<strong>Commune :</strong> ${communeNom}`;
  card.appendChild(communeP);

  // Status
  const statusP = document.createElement("p");
  statusP.className = "prime-status text-muted";
  statusP.innerHTML = `<strong>Status :</strong> ${primes.length > 0 ? "Primes disponibles" : "Aucune prime"}`;
  card.appendChild(statusP);

  // Liste des primes
  const ul = document.createElement("ul");
  ul.className = "prime-list small mt-2";

  primes.forEach(prime => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${prime.premie_soort} – ${prime.omschrijving} :</strong> ${prime.bedrag}`;
    ul.appendChild(li);
  });

  card.appendChild(ul);

  // Montant total
  const totalP = document.createElement("p");
  totalP.className = "prime-total mt-2 mb-0";
  totalP.innerHTML = `<strong>Montant estimé :</strong> <span class="commune-total">${montantTotal.toFixed(2)} €</span>`;
  card.appendChild(totalP);

  col.appendChild(card);
  container.appendChild(col);
}
