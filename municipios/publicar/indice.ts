/** Colunas do indice do explorador (arrays, nao objetos: o arquivo fica ~3x menor). */
export const COLUNAS_INDICE = [
  "numero", "data", "credor", "documento", "tipoCredor", "slugCredor", "empenhado", "liquidado", "pago", "pagoRestos",
  "orgao", "elemento", "modalidade", "removidoEm", "temDetalhe",
] as const;
