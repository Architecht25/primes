// 🔁 Importe la fonction de logique métier pour déterminer la catégorie
import { choixCategorie } from './choix-categorie.js';
import { initialiserCartes } from '../ui/cartes.js';

// 🔹 Initialise le calcul de catégorie lorsque l’utilisateur clique sur le bouton
export function initialiserCalculCategorie() {
  console.log("🟢 initialiserCalculCategorie() lancé");

  const btn = document.getElementById("btn-calcul-prime");
  if (!btn) {
    console.warn("⚠️ Bouton #btn-calcul-prime introuvable dans le DOM.");
    return;
  }

  btn.addEventListener("click", async () => {
    const situation = document.getElementById("situation")?.value || "";
    const revenu1 = parseFloat(document.getElementById("revenu-demandeur")?.value || 0);
    const revenu2 = parseFloat(document.getElementById("revenu-conjoint")?.value || 0);
    const enfants = parseInt(document.getElementById("enfants")?.value || 0);
    const revenuTotal = revenu1 + revenu2;

    let statut = "";
    if (situation === "isole") {
      statut = "seul";
    } else if (["isole_avec_enfant", "couple"].includes(situation)) {
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
    const catNum = cat.id.slice(-1); // ex: "categorie_2" → "2"
    sessionStorage.setItem("categorie", catNum); // ✅ Stockage pour usage global

    const resultElt = document.getElementById("categorie-resultat");
    const texteElt = document.getElementById("categorie-prime");

    if (texteElt && resultElt) {
      texteElt.textContent = `Catégorie ${cat.id.toUpperCase()} – ${cat.description}` +
        (cat.eligible_pour_verbouwlening ? " ✅ éligible à Mijn VerbouwLening." : " ❌ non éligible à Mijn VerbouwLening.");

      let couleur = "secondary";
      if (cat.id === "categorie_4") couleur = "success";
      else if (cat.id === "categorie_3") couleur = "primary";
      else if (cat.id === "categorie_2") couleur = "info";
      else if (cat.id === "categorie_1") couleur = "warning";

      resultElt.className = `alert alert-${couleur} mt-4`;
    }

    // ✅ Recharge les cartes avec la bonne catégorie
    import('../ui/cartes.js').then(module => {
      module.initialiserCartes(catNum); // 💡 Passe la catégorie
    });

    import('../logic/primes.js').then(primesModule => {
      primesModule.initialiserPrimes?.(catNum); // si cette fonction l’accepte
    });
  });
}


// 🔎 Fonction utilitaire : retourne "1", "2", "3", "4"
export function getCategorieId() {
  const stored = sessionStorage.getItem("categorie");
  if (stored) {
    console.log("🔄 Catégorie depuis sessionStorage :", stored);
    return stored;
  }

  const span = document.getElementById("categorie-prime");
  const texte = span?.textContent.trim() ?? "";
  const match = texte.match(/\d+/);

  const fallback = match ? match[0] : "4";
  console.log("🔎 Catégorie détectée depuis texte ou défaut :", fallback);
  return fallback;
}
