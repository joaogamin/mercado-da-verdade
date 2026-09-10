import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { DEFAULT_LOCALE, LOCALES, urlDoLocale } from "@/i18n/config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(LOCALES.map((l) => [l, urlDoLocale(SITE_URL, l)]));

  return LOCALES.map((locale) => ({
    url: urlDoLocale(SITE_URL, locale),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    // Prioridade maior no portugues: e o publico principal e o dominio e .com.br
    priority: locale === DEFAULT_LOCALE ? 1 : 0.8,
    alternates: { languages },
  }));
}
