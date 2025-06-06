// 🔁 Importe la fonction qui détermine la catégorie en fonction du profil
import { choixCategorie } from './choix-categorie.js';

// 🔁 Importe la fonction pour afficher les cartes spécifiques à cette catégorie (si besoin)
import { initialiserCartes } from '../ui/cartes.js';

// 🔹 Fonction qui initialise le calcul de catégorie lorsque l’utilisateur clique sur le bouton
export function initialiserCalculCategorie() {
  console.log("🟢 initialiserCalculCategorie() lancé");

  const btn = document.getElementById("btn-calcul-prime"); // Bouton déclencheur

  btn.addEventListener("click", async () => {
    // 🔍 Récupération des champs du formulaire
    const situation = document.getElementById("situation").value;
    const revenu1 = parseFloat(document.getElementById("revenu-demandeur").value || 0);
    const revenu2 = parseFloat(document.getElementById("revenu-conjoint").value || 0);
    const enfants = parseInt(document.getElementById("enfants").value || 0);
    const revenuTotal = revenu1 + revenu2;

    // 🧠 Détermination du statut (clé de correspondance dans les conditions de catégorie)
    let statut;
    if (situation === "isole") {
      statut = "seul";
    } else if (situation === "isole_avec_enfant" || situation === "couple") {
      statut = "seul_avec_charge_ou_couple_sans_charge";
    }

    // 📦 Création du profil complet à envoyer pour calcul de catégorie
    const profil = {
      revenuAnnuel: revenuTotal,
      statut,
      personnesACharge: enfants,
      autreBienEnPleinePropriete: false, // Peut évoluer plus tard
      loueViaWoonmaatschappij: false     // Peut évoluer plus tard
    };

    // 🧮 Calcul de la catégorie via la logique métier
    const cat = await choixCategorie(profil);

    // 🎯 Mise à jour de l'affichage de la catégorie
    const resultElt = document.getElementById("categorie-resultat");
    const texteElt = document.getElementById("categorie-prime");

    texteElt.textContent = `Catégorie ${cat.id.toUpperCase()} – ${cat.description}` +
      (cat.eligible_pour_verbouwlening ? " ✅ éligible à Mijn VerbouwLening." : " ❌ non éligible à Mijn VerbouwLening.");

    // 🎨 Changement dynamique de la couleur du bloc selon la catégorie
    let couleur = "secondary";
    if (cat.id === "categorie_4") couleur = "success";
    else if (cat.id === "categorie_3") couleur = "info";
    else if (cat.id === "categorie_2") couleur = "warning";
    else if (cat.id === "categorie_1") couleur = "danger";
    else couleur = "dark";

    resultElt.className = `alert alert-${couleur} mt-4`;

    // 🔁 Recharge des cartes après calcul de la catégorie, pour n’afficher que celles pertinentes
    import('../logic/primes.js').then(module => {
      module.initialiserPrimes();
    });
  });
}

// 🔧 Fonction utilitaire qui extrait l’identifiant numérique de la catégorie affichée
export function getCategorieId() {
  const span = document.getElementById("categorie-prime");
  if (!span) return "3"; // Valeur par défaut

  const texte = span.textContent.trim();
  const match = texte.match(/\d+/); // Cherche un nombre dans le texte
  return match ? match[0] : "3"; // Retourne "1", "2", "3", etc. ou "3" si rien trouvé
}
