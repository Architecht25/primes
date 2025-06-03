export function initialiserCategories() {
// 🔹 Lien bouton "Calculer catégorie de prime"
  const bouton = document.getElementById("btn-calcul-prime");
  const bloc = document.getElementById("categorie-resultat");
  const texte = document.getElementById("categorie-prime");

  bouton.addEventListener("click", () => {
    const situation = document.getElementById("situation").value;
    const revenu1 = parseFloat(document.getElementById("revenu-demandeur").value) || 0;
    const revenu2 = parseFloat(document.getElementById("revenu-conjoint").value) || 0;
    const total = revenu1 + revenu2;

    bloc.style.display = "block"; // on montre le bloc à chaque calcul

    // Gestion des erreurs
    if (!situation) {
      texte.textContent = "Veuillez sélectionner une situation.";
      bloc.className = "alert alert-warning mt-4";
      return;
    }

    if (total === 0) {
      texte.textContent = "Veuillez entrer au moins un revenu.";
      bloc.className = "alert alert-warning mt-4";
      return;
    }

    // Seuils selon situation
    let seuil1, seuil2;
    if (situation === "isole") {
      seuil1 = 42340;
      seuil2 = 53880;
    } else {
      seuil1 = 59270;
      seuil2 = 76980;
    }

    // Calcul et affichage de la catégorie
    let categorieTexte = "—";
    let couleur = "alert-secondary";

    if (total < seuil1) {
      categorieTexte = "Catégorie C (revenus faibles)";
      couleur = "alert-success";
    } else if (total < seuil2) {
      categorieTexte = "Catégorie B (revenus moyens)";
      couleur = "alert-warning";
    } else {
      categorieTexte = "Catégorie A (revenus élevés)";
      couleur = "alert-primary";
    }

    texte.textContent = categorieTexte;
    bloc.className = `alert ${couleur} mt-4`;
  });
};
