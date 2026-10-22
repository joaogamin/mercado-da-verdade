import type { Centavos } from "./esquema.ts";

/**
 * "R$ 11.087,44" -> 1108744. Aceita o NBSP que o portal usa depois do R$,
 * sinal negativo e valor sem simbolo. Rejeita o que nao for dinheiro em vez de
 * devolver 0 — um zero silencioso esconderia um portal que mudou de formato.
 */
export function centavos(texto: string): Centavos {
  const limpo = texto.replace(/[\s ]/g, "").replace(/^R\$/, "");
  const m = /^(-?)(\d{1,3}(?:\.\d{3})*|\d+),(\d{2})$/.exec(limpo);
  if (!m) throw new Error(`valor monetario invalido: ${JSON.stringify(texto)}`);
  const inteiro = Number(m[2].replace(/\./g, ""));
  const v = inteiro * 100 + Number(m[3]);
  return m[1] ? -v : v;
}

/** Numero da API (110874.4) -> 11087440. Arredonda para eliminar ruido de float. */
export function centavosDeNumero(v: number): Centavos {
  if (!Number.isFinite(v)) throw new Error(`valor monetario invalido: ${v}`);
  return Math.round(v * 100);
}
