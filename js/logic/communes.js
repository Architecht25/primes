export async function chargerPrimesCommunales() {
  const url = "https://opendata.fluvius.be/api/v2/catalog/datasets/premies-per-gemeente/exports/json";

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur de chargement des primes communales :", error);
    return [];
  }
}

export function filtrerPrimesParCommune(data, commune) {
  return data.filter(item => item.naam_van_de_gemeente.toLowerCase() === commune.toLowerCase());
}

export function extraireMontant(bedrag) {
  if (!bedrag) return 0;
  const match = bedrag.match(/(\d+([.,]\d+)?)/);
  return match ? parseFloat(match[0].replace(",", ".")) : 0;
}

export function estMontantParUnite(bedrag) {
  return bedrag.includes("/m²") || bedrag.includes("/m³") || bedrag.includes("/kWh");
}

export function calculerMontantTotal(primes, quantites = {}) {
  let total = 0;

  primes.forEach((prime, index) => {
    const montant = extraireMontant(prime.bedrag);
    const isParUnite = estMontantParUnite(prime.bedrag);

    if (isParUnite && quantites[index] != null) {
      total += montant * parseFloat(quantites[index] || 0);
    } else if (!isParUnite) {
      total += montant;
    }
  });

  return total;
}
