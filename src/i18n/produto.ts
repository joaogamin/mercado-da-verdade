import type { Produto } from "@/data/produtos";
import { DEFAULT_LOCALE, type Locale } from "./config";

/**
 * Fora do portugues, nome traduzido com o original entre parenteses: a tabela
 * cita o IPCA, e o rotulo brasileiro e o que permite conferir contra a fonte.
 */
export function nomeProduto(p: Produto, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return p.n[0].toUpperCase() + p.n.slice(1);
  return `${locale === "en" ? p.en : p.es} (${p.n})`;
}
