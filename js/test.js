// test.js
export function setupEligibilityTest() {
  const form = document.forms['eligibilityForm'];
  if (!form) {
    console.warn("⚠️ Formulaire 'eligibilityForm' non trouvé.");
    return;
  }

  function nextStep(currentStep) {
    const current = document.querySelector(`.form-card[data-step="${currentStep}"]`);
    const next = document.querySelector(`.form-card[data-step="${currentStep + 1}"]`);

    // ✅ Vérifie qu'une réponse est cochée
    const inputs = current.querySelectorAll('input[type="radio"]');
    const isChecked = Array.from(inputs).some(input => input.checked);

    if (!isChecked) {
      Swal.fire({
        icon: 'warning',
        title: 'Veuillez sélectionner une réponse',
        confirmButtonText: 'OK',
        confirmButtonColor: '#0077cc'
      });
      return;
    }

    // ❌ Cas d’inéligibilité
    if (currentStep === 1 && form.demandeur.value === 'entreprise') {
      showResult("❌ Les entreprises ne sont plus éligibles aux primes depuis le 1er juillet 2025.", false);
      return;
    }
    if (currentStep === 5 && form.annee.value === 'apres') {
      showResult("❌ Les logements construits après le 1er janvier 2006 ne sont pas éligibles aux primes.", false);
      return;
    }
    if (currentStep === 10 && form.demolition.value === 'oui') {
      showResult("❌ Les bâtiments démolis avec TVA à 6% ne sont pas éligibles aux primes.", false);
      return;
    }

    // ➕ Cas particulier : Maison → on saute la question sur la copropriété
    if (currentStep === 6 && form.type.value !== 'appartement') {
      current.classList.remove('active');
      const skipToStep = currentStep + 2;
      const target = document.querySelector(`.form-card[data-step="${skipToStep}"]`);
      if (target) {
        target.classList.add('active');
        updateProgress(skipToStep);
      }
      return;
    }

    // Sinon : on passe à l'étape suivante normalement
    if (next) {
      current.classList.remove('active');
      next.classList.add('active');
      updateProgress(currentStep + 1);
    } else {
      calculateResult();
    }
  }

  function calculateResult() {
    let message = "✅ Vous êtes potentiellement éligible aux primes.";
    let categorie = null;

    if (form.demandeur.value === 'asbl') {
      message += " (ASBL/coopérative → Catégorie 1)";
      categorie = 1;
    }
    if (form.usage.value === 'non_habite') {
      message += " (Usage non résidentiel → Catégorie 1)";
      categorie = 1;
    }
    if (form.proprietaire.value === 'non') {
      message += " (Pas propriétaire → uniquement PAC/boiler)";
      categorie = 1;
    }
    if (form.autre_bien.value === 'oui') {
      message += " (Propriétaire d’un autre bien → Catégorie 1)";
      categorie = 1;
    }

    // Si aucune des conditions ci-dessus ne s’applique
    if (!categorie) {
      categorie = 2; // Valeur par défaut (peut être affinée avec les revenus)
      message += " (Votre catégorie est estimée à 2, à confirmer selon vos revenus)";
    }

    // Traitement PEB
    if (form.peb.value === 'ef') {
      if (form.domicile.value === 'oui') {
        message += " (Accès à la carte PEB)";
      } else {
        message += " (Catégorie 1 + carte PEB)";
      }
    } else {
      message += " (Pas de carte PEB, mais éligibilité possible selon revenus)";
    }

    if (form.type.value === 'appartement' && form.copro.value === 'commune') {
      message += " (Parties communes = demande via syndic)";
    }

    // 👉 Enregistre catégorie dans le localStorage aussi
    const testData = {
      demandeur: form.demandeur.value,
      usage: form.usage.value,
      proprietaire: form.proprietaire.value,
      autre_bien: form.autre_bien.value,
      annee: form.annee.value,
      type: form.type.value,
      copro: form.copro?.value || null,
      peb: form.peb.value,
      domicile: form.domicile.value,
      demolition: form.demolition.value,
      categorie: categorie
    };
    localStorage.setItem("eligibiliteRenovate", JSON.stringify(testData));

    // 🔍 Résumé final
    message += `<br><br><strong>Catégorie estimée :</strong> ${categorie}`;

    showResult(message);
  }


  function showResult(msg, isEligible = true) {
    document.getElementById('eligibilityForm').style.display = 'none';
    const result = document.getElementById('result');

  result.innerHTML = `
    <p>${msg}</p>
    <div class="btn-group">
      <button type="button" class="btn-custom custom-secondary" onclick="location.reload()">Recommencer</button>
      ${isEligible ? `<a href="analyse.html" class="btn-custom custom-primary">Simulateur</a>` : ''}
    </div>
  `;

    result.style.display = 'block';
  }


  // Activation des boutons "Suivant"
  document.querySelectorAll('button[data-step]').forEach(button => {
    button.addEventListener('click', () => {
      const step = parseInt(button.dataset.step, 10);
      nextStep(step);
    });
  });

  // Barre de progression
  function updateProgress(stepNumber) {
    const progressBar = document.getElementById('progress-bar');
    const progressLabel = document.getElementById('progress-label');
    const totalSteps = 10;
    const percentage = Math.min((stepNumber / totalSteps) * 100, 100);
    if (progressBar) progressBar.style.width = percentage + '%';
    if (progressLabel) progressLabel.textContent = `Étape ${stepNumber} sur ${totalSteps}`;
  }
}
