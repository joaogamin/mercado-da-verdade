// Series usadas tanto nas paginas de checagem quanto nos resumos da home.
// Ficam aqui, e nao dentro dos componentes, para que o grafico grande e a
// miniatura nunca mostrem numeros diferentes.

/** Indice de Precos de Alimentos da FAO (media anual, base 2014-2016 = 100). */
export const FAO: [string, number][] = [
  ["2019", 95.1], ["2020", 98.1], ["2021", 125.7], ["2022", 143.7],
  ["2023", 124.0], ["2024", 122.0], ["2025", 127.2], ["2026*", 133.3],
];

/** PNAD Continua trimestral (IBGE). t = trimestres decorridos desde o 1o tri/2019. */
export const PNAD: { t: number; v: number; mark?: "ini" | "pico" | "troca" | "hoje" }[] = [
  { t: 0, v: 12.7, mark: "ini" },
  { t: 3, v: 11.0 },
  { t: 8, v: 14.9, mark: "pico" },
  { t: 15, v: 7.9, mark: "troca" },
  { t: 19, v: 7.4 },
  { t: 23, v: 6.2 },
  { t: 29, v: 5.4, mark: "hoje" },
];

/** Veredito de cada linha da tabela comparativa, na ordem de t.comparativo.linhas. */
export type Veredito = "enganoso" | "parcial" | "correto";
export const VEREDITOS_COMPARATIVO: Veredito[] = ["parcial", "enganoso", "parcial", "correto", "correto", "correto"];

/** Etapas ja concluidas da PEC 221/2019, na ordem de t.escala.etapas. */
export const ETAPAS_CONCLUIDAS = [true, true, true, true, false, false, false];
