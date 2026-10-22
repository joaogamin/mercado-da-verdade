/**
 * Parser de CSV com campos entre aspas (RFC 4180): aspas duplicadas dentro do
 * campo, separador e quebra de linha dentro de aspas. O portal usa "," e LF.
 */
export function lerCsv(texto: string, separador = ","): string[][] {
  const linhas: string[][] = [];
  let linha: string[] = [];
  let campo = "";
  let aspas = false;

  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (aspas) {
      if (c === '"') {
        if (texto[i + 1] === '"') { campo += '"'; i++; }
        else aspas = false;
      } else campo += c;
    } else if (c === '"') aspas = true;
    else if (c === separador) { linha.push(campo); campo = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && texto[i + 1] === "\n") i++;
      linha.push(campo); linhas.push(linha);
      linha = []; campo = "";
    } else campo += c;
  }
  if (campo !== "" || linha.length > 0) { linha.push(campo); linhas.push(linha); }
  return linhas;
}

/** Valor para CSV de saida: aspas so quando precisa. */
export function escaparCsv(v: unknown): string {
  const s = v === undefined || v === null ? "" : String(v);
  return /[",;\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
