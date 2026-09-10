export const LOCALES = ["pt-BR", "en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt-BR";

// Idiomas que ganham um segmento de caminho proprio. O portugues fica na raiz
// para preservar a URL que ja esta indexada.
export const LOCALES_COM_PREFIXO = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

/** "/" para pt-BR, "/en/" e "/es/" para os demais. */
export function caminhoDoLocale(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "/" : `/${locale}/`;
}

export function urlDoLocale(siteUrl: string, locale: Locale): string {
  return locale === DEFAULT_LOCALE ? `${siteUrl}/` : `${siteUrl}/${locale}/`;
}

export const NOME_DO_LOCALE: Record<Locale, string> = {
  "pt-BR": "Português",
  en: "English",
  es: "Español",
};

export const SIGLA_DO_LOCALE: Record<Locale, string> = {
  "pt-BR": "PT",
  en: "EN",
  es: "ES",
};

/** Usado em Intl.NumberFormat e Intl.DateTimeFormat. */
export const TAG_BCP47: Record<Locale, string> = {
  "pt-BR": "pt-BR",
  en: "en-US",
  es: "es-ES",
};

/**
 * O Next tipa os params de rota como string. Esta guarda estreita para Locale
 * e falha alto se um caminho invalido chegar aqui, em vez de renderizar uma
 * pagina meio quebrada.
 */
export function paraLocale(valor: string): Locale {
  if ((LOCALES as readonly string[]).includes(valor)) return valor as Locale;
  throw new Error(`Locale desconhecido: ${valor}`);
}
