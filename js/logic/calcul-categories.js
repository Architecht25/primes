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
    // 1. 📥 Lecture des valeurs saisies dans le formulaire
    const situation = document.getElementById("situation")?.value || "";
    const revenu1 = parseFloat(document.getElementById("revenu-demandeur")?.value || 0);
    const revenu2 = parseFloat(document.getElementById("revenu-conjoint")?.value || 0);
    const enfants = parseInt(document.getElementById("enfants")?.value || 0);
    const revenuTotal = revenu1 + revenu2;

    // 2. 🧠 Traduction du statut pour correspondre aux règles JSON
    let statut = "";
    if (situation === "isole") {
      statut = "seul";
    } else if (["isole_avec_enfant", "couple"].includes(situation)) {
      statut = "seul_avec_charge_ou_couple_sans_charge";
    }

    // 3. 📦 Construction du profil pour la logique métier
    const profil = {
      revenuAnnuel: revenuTotal,
      statut,
      personnesACharge: enfants,
      autreBienEnPleinePropriete: false,
      loueViaWoonmaatschappij: false
    };

    // 4. 📊 Calcul de la catégorie
    const cat = await choixCategorie(profil);
    const catNum = cat.id.slice(-1); // ex: "categorie_2" → "2"
    sessionStorage.setItem("categorie", catNum);

    // 5. 🖍️ Affichage du résultat à l’écran
    const resultElt = document.getElementById("categorie-resultat");
    const texteElt = document.getElementById("categorie-prime");

    if (texteElt && resultElt) {
      texteElt.textContent = `Catégorie ${cat.id.toUpperCase()} – ${cat.description}` +
        (cat.eligible_pour_verbouwlening ? " ✅ éligible à Mijn VerbouwLening." : " ❌ non éligible à Mijn VerbouwLening.");

      let couleur = "secondary";
      if (cat.id === "categorie_4") couleur = "success";
      else if (cat.id === "categorie_3") couleur = "info";
      else if (cat.id === "categorie_2") couleur = "warning";
      else if (cat.id === "categorie_1") couleur = "danger";

      resultElt.className = `alert alert-${couleur} mt-4`;
    }

    // 6. 🔁 Recharge les cartes selon la nouvelle catégorie
    import('../ui/cartes.js').then(module => {
      module.initialiserCartes();
      // Optionnel : recharge aussi les cartes dynamiques
      import('../logic/primes.js').then(primesModule => {
        primesModule.initialiserPrimes?.();
      });
    });
    initialiserCartes();
  });
}

// 🔎 Fonction utilitaire : retourne "1", "2", "3", "4"
export function getCategorieId() {
  const stored = sessionStorage.getItem("categorie");
  if (stored) return stored;

  const span = document.getElementById("categorie-prime");
  const texte = span?.textContent.trim() ?? "";
  const match = texte.match(/\d+/);
  return match ? match[0] : "3"; // défaut : catégorie moyenne
}
