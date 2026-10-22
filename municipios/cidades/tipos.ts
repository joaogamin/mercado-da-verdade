import type { Entidade } from "../fontes/tipos.ts";

export type ConfigCidade = {
  slug: string;
  nome: string;
  uf: string;
  ibge: string;
  /** Adaptador da fonte primaria (ver municipios/fontes/). */
  fonte: { tipo: "system-sys523"; base: string; baseApi: string; contexto: string };
  /** A primeira e a entidade padrao das paginas. */
  entidades: Entidade[];
  /** Primeiro exercicio coletado. */
  anoInicial: number;
  /** Fonte complementar (IBGE), fixada aqui para a analise rodar sem rede. */
  populacao: { ano: number; valor: number; fonte: string; url: string }[];
  coleta: {
    /** Intervalo minimo entre requisicoes as telas. */
    intervaloTelasMs: number;
    /** A API declara no maximo 1 chamada por minuto. */
    intervaloApiMs: number;
  };
  portoes: {
    /** Divergencia maxima por orgao entre a nossa soma e o balancete oficial. */
    divergenciaMaximaPct: number;
    /** Campos cuja alteracao exige revisao humana. */
    camposSensiveis: string[];
    /** Maximo de avisos de leitura antes de bloquear. */
    avisosMaximos: number;
    /**
     * Queda maxima do total empenhado de um exercicio entre duas coletas.
     * Anulacoes de empenho reduzem o total legitimamente, por isso nao e zero.
     */
    quedaMaximaPct: number;
  };
};
