import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { DEFAULT_LOCALE, LOCALES, SEGMENTO_CHECAGEM, urlDoLocale } from "@/i18n/config";
import { CHECAGENS, caminhoDaChecagem } from "@/i18n/checagens";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();

  // Homes: alternates apontam para as homes dos outros idiomas.
  const homes = LOCALES.map((locale) => ({
    url: urlDoLocale(SITE_URL, locale),
    lastModified: agora,
    changeFrequency: "weekly" as const,
    priority: locale === DEFAULT_LOCALE ? 1 : 0.8,
    alternates: {
      languages: Object.fromEntries(LOCALES.map((l) => [l, urlDoLocale(SITE_URL, l)])),
    },
  }));

  // Checagens: alternates apontam para a MESMA checagem nos outros idiomas.
  const checagens = LOCALES.flatMap((locale) =>
    CHECAGENS.map((c) => ({
      url: SITE_URL + caminhoDaChecagem(locale, c, SEGMENTO_CHECAGEM[locale]),
      lastModified: new Date(c.verificadoEm),
      changeFrequency: "monthly" as const,
      priority: locale === DEFAULT_LOCALE ? 0.9 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l, SITE_URL + caminhoDaChecagem(l, c, SEGMENTO_CHECAGEM[l])]),
        ),
      },
    })),
  );

  return [...homes, ...checagens];
}
