// Limites de dispensa por valor (Lei 14.133/2021, art. 75, I e II), conferidos
// no texto oficial do Planalto em 22/10/2026. Sao a regua do sinal de
// "possivel fracionamento".

export type LimiteDispensa = {
  ano: number;
  /** Obras e servicos de engenharia. */
  obras: number;
  /** Compras e outros servicos. */
  outros: number;
  norma: string;
  url: string;
};

export const LIMITES_DISPENSA: LimiteDispensa[] = [
  {
    ano: 2025, obras: 125_451_15, outros: 62_725_59,
    norma: "Decreto 12.343/2024", url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/decreto/d12343.htm",
  },
  {
    ano: 2026, obras: 130_984_20, outros: 65_492_11,
    norma: "Decreto 12.807/2025", url: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/d12807.htm",
  },
];

/** Obras e instalacoes: o unico elemento em que usamos o limite de engenharia. */
export const ELEMENTO_OBRAS = "4.4.90.51";
