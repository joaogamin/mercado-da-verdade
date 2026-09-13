import type { Locale } from "./config";

/**
 * Fonte unica das checagens. Consolida o que estava espalhado entre
 * `schema.checagens` (texto, nos dicionarios) e `AVALIACOES` (nota e ancora,
 * em Pagina.tsx), e acrescenta o que as paginas proprias precisam: slug por
 * idioma e data de verificacao individual.
 *
 * A ORDEM importa: e ela que liga cada checagem ao item correspondente de
 * `t.schema.checagens`. Mexer aqui exige mexer nos tres dicionarios.
 */
export type Checagem = {
  id: string;
  /**
   * Indice em t.schema.checagens. Ausente nas analises que nao sao a checagem
   * de uma afirmacao especifica (o comparativo auditado, o que confere) — elas
   * tem pagina propria mas nao geram ClaimReview.
   */
  i?: number;
  /** 1 a 5, usado no reviewRating. Ausente junto com `i`. */
  nota?: number;
  /** Id da seccao na home antiga — mantido nos cards do indice para nao
   *  quebrar links ja compartilhados como /#desemprego */
  ancora: string;
  verificadoEm: string;
  slug: Record<Locale, string>;
};

export const CHECAGENS: Checagem[] = [
  {
    id: "desemprego", i: 0, nota: 2, ancora: "desemprego", verificadoEm: "2026-09-09",
    slug: { "pt-BR": "desemprego", en: "unemployment", es: "desempleo" },
  },
  {
    id: "alimentos", i: 1, nota: 3, ancora: "alimentos", verificadoEm: "2026-09-09",
    slug: { "pt-BR": "alimentos", en: "food-prices", es: "alimentos" },
  },
  {
    id: "precos", i: 2, nota: 3, ancora: "auditoria", verificadoEm: "2026-09-09",
    slug: { "pt-BR": "precos", en: "prices", es: "precios" },
  },
  {
    id: "escala-6x1", i: 3, nota: 2, ancora: "seis-por-um", verificadoEm: "2026-09-09",
    slug: { "pt-BR": "escala-6x1", en: "6x1-shift", es: "jornada-6x1" },
  },
  {
    id: "ibge", i: 4, nota: 1, ancora: "ibge", verificadoEm: "2026-09-09",
    slug: { "pt-BR": "ibge", en: "ibge", es: "ibge" },
  },
  {
    id: "comparativo", ancora: "comparativo", verificadoEm: "2026-09-09",
    slug: { "pt-BR": "comparativo", en: "comparison", es: "comparacion" },
  },
  {
    id: "o-que-confere", ancora: "verdade", verificadoEm: "2026-09-09",
    slug: { "pt-BR": "o-que-confere", en: "what-holds-up", es: "lo-que-es-cierto" },
  },
];

/** Só as que geram ClaimReview — usado onde a nota é obrigatória. */
export const AFIRMACOES = CHECAGENS.filter((c) => c.i !== undefined);

export function checagemPorSlug(locale: Locale, slug: string): Checagem | undefined {
  return CHECAGENS.find((c) => c.slug[locale] === slug);
}

/** Caminho completo da checagem, ja com o segmento do idioma. */
export function caminhoDaChecagem(locale: Locale, c: Checagem, segmento: string): string {
  const base = locale === "pt-BR" ? "" : `/${locale}`;
  return `${base}/${segmento}/${c.slug[locale]}/`;
}

/** hreflang de uma checagem: o equivalente dela em cada idioma. */
export function idiomasDaChecagem(
  siteUrl: string,
  c: Checagem,
  segmentos: Record<Locale, string>,
  locales: readonly Locale[],
  padrao: Locale,
): Record<string, string> {
  const mapa: Record<string, string> = {};
  for (const l of locales) mapa[l] = siteUrl + caminhoDaChecagem(l, c, segmentos[l]);
  mapa["x-default"] = siteUrl + caminhoDaChecagem(padrao, c, segmentos[padrao]);
  return mapa;
}
