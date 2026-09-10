import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { DEFAULT_LOCALE, LOCALES, urlDoLocale, type Locale } from "./config";

const OG_LOCALE: Record<Locale, string> = {
  "pt-BR": "pt_BR",
  en: "en_US",
  es: "es_ES",
};

/** Imagem de compartilhamento por idioma: a arte contem texto. */
export function ogDoLocale(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "/og.png" : `/og-${locale}.png`;
}

/** hreflang de todos os idiomas + x-default apontando para o portugues. */
function alternativas(): Record<string, string> {
  const mapa: Record<string, string> = {};
  for (const l of LOCALES) mapa[l] = urlDoLocale(SITE_URL, l);
  mapa["x-default"] = urlDoLocale(SITE_URL, DEFAULT_LOCALE);
  return mapa;
}

export function criarMetadata(
  locale: Locale,
  m: { title: string; desc: string; keywords: string[] },
): Metadata {
  const url = urlDoLocale(SITE_URL, locale);
  const og = ogDoLocale(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: m.title, template: "%s · Mercado da Verdade" },
    description: m.desc,
    applicationName: "Mercado da Verdade",
    keywords: m.keywords,
    authors: [{ name: "João Pedro Gamin" }],
    alternates: { canonical: url, languages: alternativas() },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url,
      siteName: "Mercado da Verdade",
      title: m.title,
      description: m.desc,
      images: [{ url: og, width: 1200, height: 630, alt: m.title }],
    },
    twitter: { card: "summary_large_image", title: m.title, description: m.desc, images: [og] },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    category: "news",
  };
}
