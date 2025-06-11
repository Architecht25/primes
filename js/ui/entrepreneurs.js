export function initialiserAjoutEntrepreneurs() {
  const btn = document.getElementById('add-entrepreneur-btn');
  const container = document.getElementById('entrepreneurs-container');

  if (!btn || !container) return;

  btn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control mb-2';
    input.name = 'entrepreneur[]';
    input.placeholder = "Nom d'un autre entrepreneur";
    container.appendChild(input);
  });
}
