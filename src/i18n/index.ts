import { ptBR, type Dicionario } from "./pt-BR";
import { en } from "./en";
import { es } from "./es";
import type { Locale } from "./config";

const DICIONARIOS: Record<Locale, Dicionario> = { "pt-BR": ptBR, en, es };

export function getDicionario(locale: Locale): Dicionario {
  return DICIONARIOS[locale];
}

export type { Dicionario };
