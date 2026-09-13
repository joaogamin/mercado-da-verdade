import type { Dicionario } from "@/i18n";
import type { Checagem } from "./checagens";

/** Seccao do dicionario que corresponde a cada checagem. */
export const SECAO_DO_ID = {
  desemprego: "desemprego",
  alimentos: "alimentos",
  precos: "auditoria",
  "escala-6x1": "escala",
  ibge: "ibge",
  comparativo: "comparativo",
  "o-que-confere": "verdade",
} as const;

export const COR_DA_NOTA: Record<number, string> = { 1: "#c0161c", 2: "#c0161c", 3: "#c9942a" };
/** Cor neutra das analises que nao julgam uma afirmacao. */
export const COR_ANALISE = "#3f4a55";

/**
 * Titulo e resumo de uma checagem, venha ela de uma afirmacao checada
 * (schema.checagens) ou de uma analise sem ClaimReview, que usa o proprio
 * titulo da seccao. Centralizado para que indice, pagina e JSON-LD nao
 * divirjam.
 */
export function textoDaChecagem(t: Dicionario, c: Checagem) {
  const secao = t[SECAO_DO_ID[c.id as keyof typeof SECAO_DO_ID]];

  if (c.i === undefined) {
    return {
      titulo: secao.titulo,
      resumo: t.checagem.analise,
      selo: t.checagem.analise,
      cor: COR_ANALISE,
      ehAfirmacao: false as const,
      lead: secao.lead,
    };
  }

  const d = t.schema.checagens[c.i];
  return {
    titulo: d.claim,
    resumo: d.rating,
    selo: t.checagem.selos[String(c.nota) as "1" | "2" | "3"],
    cor: COR_DA_NOTA[c.nota ?? 2],
    ehAfirmacao: true as const,
    lead: secao.lead,
  };
}
