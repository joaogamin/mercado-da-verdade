// Contrato entre o processo e uma fonte de dados. Uma fonte e um par:
// o coletor (rede -> WARC etiquetado) e o leitor (WARC etiquetado -> esquema).
// O leitor nunca faz rede, por isso o reprocessamento roda offline.
import type { Balancete, EmpenhoApi, EmpenhoDetalhe, EmpenhoLista } from "../nucleo/esquema.ts";
import type { Lido } from "../nucleo/warc.ts";
import type { TotaisLista } from "./system-sys523/parse.ts";

export type Capacidade = "lista-empenhos" | "detalhe-empenho" | "api-empenhos" | "balancete-orgaos";

export type Entidade = {
  id: string;
  nome: string;
  /** Codigo da entidade em cada parte do portal (mudam entre telas, API e detalhe). */
  codigos: Record<string, string>;
};

/** Resultado do detalhe: null quando o portal diz que o empenho nao existe. */
export type ResultadoDetalhe = { encontrado: boolean };

export interface Coletor {
  listaEmpenhos(q: { ano: number; entidade: Entidade; de: string; ate: string; mes?: number }): Promise<void>;
  detalharEmpenho(q: { ano: number; numero: number; entidade: Entidade }): Promise<ResultadoDetalhe>;
  apiEmpenhos(q: { ano: number; entidade: Entidade }): Promise<void>;
  balanceteOrgaos(q: { ano: number; entidade: Entidade }): Promise<void>;
}

export type Leitura =
  | { tipo: "lista-empenhos"; ano: number; entidade: string; de: string; ate: string; itens: EmpenhoLista[]; total: TotaisLista; divergencias: string[] }
  | { tipo: "detalhe-empenho"; ano: number; numero: number; entidade: string; detalhe: EmpenhoDetalhe | null }
  | { tipo: "api-empenhos"; ano: number; entidade: string; itens: EmpenhoApi[] }
  | { tipo: "balancete-orgaos"; ano: number; entidade: string; balancete: Omit<Balancete, "ano" | "entidade" | "origem"> };

export interface Leitor {
  /** Transforma uma resposta etiquetada em dados. Avisos = formato inesperado. */
  ler(r: Lido): { leitura: Leitura | null; avisos: string[] };
}

export interface Fonte {
  id: string;
  /** Nome que aparece para o cidadao na linha de fonte. */
  nome: string;
  capacidades: ReadonlySet<Capacidade>;
  leitor: Leitor;
}
