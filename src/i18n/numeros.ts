import { TAG_BCP47, type Locale } from "./config";

/** 133,3 em pt-BR e es; 133.3 em en. */
export function formatarNumero(v: number, locale: Locale, casas = 1): string {
  return new Intl.NumberFormat(TAG_BCP47[locale], {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  }).format(v);
}

/** Percentual com sinal explicito: +47,6% / -1,9%. */
export function formatarPercentual(v: number, locale: Locale, casas = 1): string {
  const sinal = v > 0 ? "+" : v < 0 ? "\u2212" : "";
  return `${sinal}${formatarNumero(Math.abs(v), locale, casas)}%`;
}

/** "9 de setembro de 2026" / "September 9, 2026" / "9 de septiembre de 2026" */
export function formatarData(iso: string, locale: Locale): string {
  const [a, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(TAG_BCP47[locale], {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(Date.UTC(a, m - 1, d)));
}
