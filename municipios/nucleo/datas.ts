/** "11/03/2025" -> "2025-03-11". */
export function isoDeBr(texto: string): string {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto.trim());
  if (!m) throw new Error(`data invalida: ${JSON.stringify(texto)}`);
  return `${m[3]}-${m[2]}-${m[1]}`;
}

/** "2025-03-11" -> "11/03/2025". */
export function brDeIso(iso: string): string {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

/** Ultimo dia do mes, em dd/mm/aaaa. */
export function fimDoMes(ano: number, mes: number): string {
  const d = new Date(Date.UTC(ano, mes, 0)).getUTCDate();
  return `${String(d).padStart(2, "0")}/${String(mes).padStart(2, "0")}/${ano}`;
}

/** Id de coleta legivel e valido como nome de pasta no Windows: 2026-10-22T213005Z */
export function idDeColeta(agora: Date): string {
  return agora.toISOString().replace(/[:]/g, "").replace(/\.\d{3}Z$/, "Z");
}
