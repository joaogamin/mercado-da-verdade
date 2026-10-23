// Esquema canonico: independe da fonte. Todo adaptador entrega estes tipos e
// o app le estes tipos — se divergirem, o build quebra.
//
// Valores sempre em centavos inteiros (nada de float), datas em ISO (aaaa-mm-dd).

export type Centavos = number;

/** De onde veio um dado. Obrigatorio em tudo que o site exibe. */
export type Origem = {
  /** Nome da fonte como aparece para o cidadao. */
  fonte: string;
  /** Pagina oficial que qualquer pessoa abre para conferir. */
  url: string;
  /** Instante da coleta, ISO com fuso (UTC). */
  coletadoEm: string;
  /** sha256 (hex) do corpo da resposta exatamente como o servidor entregou. */
  sha256: string;
  /** Id da coleta (pasta em dados/<cidade>/coletas/). */
  coleta: string;
};

export type TipoCredor = "PJ" | "PF" | "folha" | "sem-documento";

export type Credor = {
  nome: string;
  /** Como publicado pela prefeitura (PF ja vem mascarado nas telas). */
  documento: string;
  tipo: TipoCredor;
  /** true quando mascaramos um CPF que vinha dentro do nome (MEI: "NOME 12345678909"). */
  nomeMascarado?: true;
};

export type Codigo = { codigo: string; nome: string };

export type Classificacao = {
  /** Conta orcamentaria completa como publicada, sem a descricao. */
  conta: string;
  /** Descricao que acompanha a conta (nivel mais detalhado, o subelemento). */
  descricao: string;
  orgao: Codigo;
  unidade: Codigo;
  funcao: Codigo;
  subfuncao: Codigo;
  programa: string;
  acao: string;
  /** Grupo de natureza (ex.: 3.3 OUTRAS DESPESAS CORRENTES). */
  natureza: Codigo;
  /** Elemento de despesa, ex.: 3.3.90.40 */
  elemento: string;
  /** Desdobramento publicado, ex.: 3.3.90.40.06 */
  subelemento: string;
  recurso: { codigo: string; nome: string; complemento: string };
};

export type Licitacao = { ano: number; numero: number; modalidade: string };
export type Contrato = { ano: number; numero: number; tipo: string; url: string };

export type Liquidacao = {
  data: string;
  numero: string;
  documento: string;
  valor: Centavos;
  estornado: Centavos;
};

export type Pagamento = {
  data: string;
  liquidacao: string;
  documento: string;
  valor: Centavos;
  estornado: Centavos;
  descontos: Centavos;
};

/** Linha da lista de empenhos (exportacao CSV da tela). */
export type EmpenhoLista = {
  ano: number;
  numero: number;
  data: string;
  credor: Credor;
  empenhado: Centavos;
  liquidado: Centavos;
  pago: Centavos;
  pagoRestos: Centavos;
};

/** Expansao do detalhe do empenho. */
export type EmpenhoDetalhe = {
  ano: number;
  numero: number;
  data: string;
  valor: Centavos;
  classificacao: Classificacao;
  credor: Credor;
  licitacao?: Licitacao;
  contrato?: Contrato;
  ordemCompra?: string;
  especificacao: string;
  liquidacoes: Liquidacao[];
  pagamentos: Pagamento[];
};

/** Item da API JSON (CPF ja mascarado no parse). */
export type EmpenhoApi = {
  ano: number;
  numero: number;
  valor: Centavos;
  documento: string;
  fonteRecurso: string;
  descricao: string;
};

/** O empenho como o site o conhece: a fusao das tres fontes. */
export type Empenho = {
  id: string;
  entidade: string;
  ano: number;
  numero: number;
  data: string;
  credor: Credor;
  empenhado: Centavos;
  liquidado: Centavos;
  pago: Centavos;
  pagoRestos: Centavos;
  detalhe?: Omit<EmpenhoDetalhe, "ano" | "numero" | "data" | "credor">;
  api?: Pick<EmpenhoApi, "fonteRecurso" | "descricao" | "valor">;
  origens: { lista?: Origem; detalhe?: Origem; api?: Origem };
  /** Presente quando o empenho deixou de aparecer no portal. */
  removidoEm?: string;
};

export type LinhaBalancete = {
  codigo: string;
  orgao: string;
  dotacaoInicial: Centavos;
  dotacaoAtualizada: Centavos;
  empenhado: Centavos;
  liquidado: Centavos;
  pago: Centavos;
  pagoRestos: Centavos;
};

export type Balancete = {
  ano: number;
  entidade: string;
  linhas: LinhaBalancete[];
  /** A linha "Total Geral" do proprio portal, usada na conferencia. */
  total: Omit<LinhaBalancete, "codigo" | "orgao">;
  origem: Origem;
};

/**
 * Aplicacao minima da Constituicao, como a propria prefeitura declarou ao
 * sistema federal: educacao no SIOPE (FNDE), saude no SIOPS (Ministerio da
 * Saude). Fonte complementar: nunca se mistura aos numeros do portal.
 */
export type Minimo = {
  area: "educacao" | "saude";
  ano: number;
  /** Bimestre do RREO (1 a 6). O 6º fecha o exercicio; antes dele, o percentual e parcial. */
  bimestre: number;
  /** Percentual aplicado, exatamente como o sistema federal publica (ex.: 27.89). */
  percentual: number;
  /** Piso constitucional em %: 25 (CF art. 212) ou 15 (LC 141/2012, art. 7º). */
  piso: number;
  /** Valor aplicado, como publicado. */
  aplicado: Centavos | null;
  /** Valor minimo exigido, quando o sistema o publica (SIOPE). */
  exigido: Centavos | null;
  /** Receita que serve de base ao percentual, quando o sistema a publica (SIOPS). */
  receitaBase: Centavos | null;
  /** Codigo e nome do indicador usado, como publicados. */
  indicador: string;
  origem: Origem;
};

export type TipoEvento = "novo" | "alterado" | "removido" | "reaparecido";

export type Evento = {
  tipo: TipoEvento;
  id: string;
  campo?: string;
  antes?: unknown;
  depois?: unknown;
  coleta: string;
  em: string;
};
