import type { Empenho } from "../nucleo/esquema.ts";

/** Chave estavel do credor: o documento publicado ou, sem ele, o nome. */
export function chaveCredor(e: Empenho): string {
  return e.credor.documento ? e.credor.documento.replace(/[^\d*]/g, "") || e.credor.documento : `nome:${e.credor.nome}`;
}

/** Trecho de URL legivel e unico para o credor. */
export function slugCredor(chave: string, nome: string): string {
  const base = (chave.startsWith("nome:") ? "" : chave.replace(/\*/g, "x") + "-") + nome;
  return base.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9x]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

/** Categoria da contratacao a partir da modalidade publicada. */
export function modalidade(e: Empenho): { chave: string; nome: string } {
  if (!e.detalhe) return { chave: "sem-detalhe", nome: "Ainda sem detalhe coletado" };
  const m = e.detalhe.licitacao?.modalidade;
  if (!m) return { chave: "sem-licitacao", nome: "Sem licitação vinculada" };
  const regras: [RegExp, string, string][] = [
    [/dispensa/i, "dispensa", "Dispensa"],
    [/inexig/i, "inexigibilidade", "Inexigibilidade"],
    [/preg[aã]o/i, "pregao", "Pregão"],
    [/concorr/i, "concorrencia", "Concorrência"],
    [/tomada de pre/i, "tomada-de-precos", "Tomada de preços"],
    [/convite/i, "convite", "Convite"],
    [/credenciamento/i, "credenciamento", "Credenciamento"],
    [/leil[aã]o/i, "leilao", "Leilão"],
    [/concurso/i, "concurso", "Concurso"],
  ];
  for (const [re, chave, nome] of regras) if (re.test(m)) return { chave, nome };
  return { chave: m.toLowerCase().replace(/[^a-z0-9]+/g, "-"), nome: m };
}

/**
 * O valor do empenho que mais se aproxima do oficial: o detalhe traz o valor
 * atual (descontadas as anulacoes); sem detalhe, so ha o original da lista.
 * Com o detalhe completo, a soma bate com o balancete.
 */
export function valorAtual(e: Empenho): number {
  return e.detalhe ? e.detalhe.valor : e.empenhado;
}
