import { cartesDocuments } from "../data/cartes-documents.js";
import { afficherCarteDocument } from "../ui/cartes.js";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("zone-cartes-documents");

  cartesDocuments.forEach(carte => {
    const wrapper = document.createElement("div");
    wrapper.className = "doc-wrapper";
    container.appendChild(wrapper);
    afficherCarteDocument(carte, wrapper);
  });
});
