import { choixCategorie } from './choix-categorie.js';

export function initialiserCalculCategorie() {
  console.log("🟢 initialiserCalculCategorie() lancé");
  const btn = document.getElementById("btn-calcul-prime");

  btn.addEventListener("click", async () => {
    // Récupération des champs
    const situation = document.getElementById("situation").value;
    const revenu1 = parseFloat(document.getElementById("revenu-demandeur").value || 0);
    const revenu2 = parseFloat(document.getElementById("revenu-conjoint").value || 0);
    const enfants = parseInt(document.getElementById("enfants").value || 0);
    const revenuTotal = revenu1 + revenu2;

    let statut;
    if (situation === "isole") {
      statut = "seul";
    } else if (situation === "isole_avec_enfant" || situation === "couple") {
      statut = "seul_avec_charge_ou_couple_sans_charge";
    }

    const profil = {
      revenuAnnuel: revenuTotal,
      statut,
      personnesACharge: enfants,
      autreBienEnPleinePropriete: false,
      loueViaWoonmaatschappij: false
    };

    const cat = await choixCategorie(profil);

    const resultElt = document.getElementById("categorie-resultat");
    const texteElt = document.getElementById("categorie-prime");

    texteElt.textContent = `Catégorie ${cat.id.toUpperCase()} – ${cat.description}` +
      (cat.eligible_pour_verbouwlening ? " ✅ éligible à Mijn VerbouwLening." : " ❌ non éligible à Mijn VerbouwLening.");

    let couleur = "secondary";
    if (cat.id === "categorie_4") couleur = "success";
    else if (cat.id === "categorie_3") couleur = "info";
    else if (cat.id === "categorie_2") couleur = "warning";
    else if (cat.id === "categorie_1") couleur = "danger";
    else couleur = "dark";

    resultElt.className = `alert alert-${couleur} mt-4`;
  });
}

export function getCategorieId() {
  const span = document.getElementById("categorie-prime");
  if (!span) return "3"; // Catégorie par défaut si rien trouvé

  const texte = span.textContent.trim();
  const match = texte.match(/\d+/); // Extrait le chiffre
  return match ? match[0] : "3"; // Retourne "1", "2", "3", etc.
}
