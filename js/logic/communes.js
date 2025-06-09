// export async function chargerPrimesCommunales() {
//   const url = "https://opendata.fluvius.be/api/v2/catalog/datasets/premies-per-gemeente/exports/json";
//   const data = await fetch(url).then(r => r.json());
//   // Transforme en format interne si besoin
//   return data.map(c => ({
//     commune: c.gemeente,
//     primes: c.premies.map(p => ({
//       titre: p.titel,
//       montant: p.bedrag ? `${p.bedrag} €` : null,
//       condition: p.voorwaarden,
//       type: p.type,
//       code: p.premie_code || null
//     }))
//   }));
// }

