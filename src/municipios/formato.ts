import { formatarData } from "@/i18n/numeros";

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 58015975075 -> "R$ 580.159.750,75" */
export const reais = (centavos: number) => BRL.format(centavos / 100);

/** 58015975075 -> "R$ 580,2 mi" · 1390000 -> "R$ 13,9 mil" */
export function reaisCurto(centavos: number): string {
  const v = centavos / 100;
  const abs = Math.abs(v);
  const f = (x: number, casas = 1) => x.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
  if (abs >= 1e9) return `R$ ${f(v / 1e9)} bi`;
  if (abs >= 1e6) return `R$ ${f(v / 1e6)} mi`;
  if (abs >= 1e4) return `R$ ${f(v / 1e3, 0)} mil`;
  return BRL.format(v);
}

/** 0.2263 -> "22,6%" */
export const pct = (fracao: number, casas = 1) =>
  `${(fracao * 100).toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas })}%`;

export const inteiro = (n: number) => n.toLocaleString("pt-BR");

/** "2025-03-11" -> "11 de março de 2025" */
export const data = (iso: string) => formatarData(iso.slice(0, 10), "pt-BR");

/** "2025-03-11" -> "11/03/2025" */
export const dataCurta = (iso: string) => iso.slice(0, 10).split("-").reverse().join("/");

/** ISO com hora -> "22/10/2026 às 21:42" (horario de Brasilia) */
export function dataHora(iso: string): string {
  const d = new Date(iso);
  const f = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
  return f.format(d).replace(",", " às");
}

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
/** "2025-03" -> "mar" */
export const mesCurto = (aaaamm: string) => MESES[Number(aaaamm.slice(5, 7)) - 1] ?? aaaamm;
