// test.js
export function setupEligibilityTest() {
  const form = document.forms['eligibilityForm'];
  if (!form) {
    console.warn("⚠️ Formulaire 'eligibilityForm' non trouvé.");
    return;
  }

  function nextStep(currentStep) {
    const current = document.querySelector(`.step[data-step="${currentStep}"]`);
    const next = document.querySelector(`.step[data-step="${currentStep + 1}"]`);

    if (currentStep === 1 && form.demandeur.value === 'entreprise') {
      showResult("❌ Les entreprises ne sont plus éligibles aux primes depuis le 1er juillet 2025.");
      return;
    }
    if (currentStep === 5 && form.annee.value === 'apres') {
      showResult("❌ Les logements construits après le 1er janvier 2006 ne sont pas éligibles aux primes.");
      return;
    }
    if (currentStep === 10 && form.demolition.value === 'oui') {
      showResult("❌ Les bâtiments démolis avec TVA à 6% ne sont pas éligibles aux primes.");
      return;
    }

    if (currentStep === 6 && form.type.value !== 'appartement') {
      nextStep(currentStep + 1); // skip copropriété
      return;
    }

    if (next) {
      current.classList.remove('active');
      next.classList.add('active');
    } else {
      calculateResult();
    }
  }

  function calculateResult() {
    let message = "✅ Vous êtes potentiellement éligible aux primes.";

    if (form.demandeur.value === 'asbl') message += " (Catégorie 1 automatique pour ASBL/coopérative)";
    if (form.usage.value === 'non_habite') message += " (Usage non résidentiel : Catégorie 1)";
    if (form.proprietaire.value === 'non') message += " (Uniquement PAC ou boiler)";
    if (form.autre_bien.value === 'oui') message += " (Catégorie 1 car vous possédez un autre bien)";

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

    showResult(message);
  }

  function showResult(msg) {
    document.getElementById('eligibilityForm').style.display = 'none';
    const result = document.getElementById('result');
    result.innerHTML = `
      <p>${msg}</p>
      <div class="mt-4">
        <button class="btn btn-secondary me-2" onclick="location.reload()">🔁 Recommencer le test</button>
        <a href="analyse.html" class="btn btn-primary">➡️ Aller au simulateur</a>
      </div>
    `;
    result.style.display = 'block';
  }

  document.querySelectorAll('button[data-step]').forEach(button => {
    button.addEventListener('click', () => {
      const step = parseInt(button.dataset.step, 10);
      nextStep(step);
    });
  });
}
