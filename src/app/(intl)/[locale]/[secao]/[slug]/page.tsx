import type { Metadata } from "next";
import PaginaChecagem, { metaDaChecagem } from "@/components/PaginaChecagem";
import { criarMetadata } from "@/i18n/metadata";
import { CHECAGENS, checagemPorSlug, idiomasDaChecagem } from "@/i18n/checagens";
import {
  DEFAULT_LOCALE, LOCALES, LOCALES_COM_PREFIXO, SEGMENTO_CHECAGEM, paraLocale,
} from "@/i18n/config";
import { SITE_URL } from "@/lib/site";

// O segmento e parte dos params porque o nome muda por idioma
// (check / verificacion). Com output: "export" todas as combinacoes sao
// enumeradas aqui no build.
export function generateStaticParams() {
  return LOCALES_COM_PREFIXO.flatMap((locale) =>
    CHECAGENS.map((c) => ({ locale, secao: SEGMENTO_CHECAGEM[locale], slug: c.slug[locale] })),
  );
}

type P = { params: Promise<{ locale: string; secao: string; slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params;
  const l = paraLocale(locale);
  const c = checagemPorSlug(l, slug);
  if (!c) return {};
  const m = metaDaChecagem(l, c);
  return criarMetadata(
    l,
    { title: m.title, desc: m.desc },
    m.caminho,
    idiomasDaChecagem(SITE_URL, c, SEGMENTO_CHECAGEM, LOCALES, DEFAULT_LOCALE),
    `/og/${l}/${c.slug[l]}.png`,
  );
}

export default async function Page({ params }: P) {
  const { locale, slug } = await params;
  const l = paraLocale(locale);
  const c = checagemPorSlug(l, slug);
  if (!c) throw new Error(`Checagem desconhecida: ${locale}/${slug}`);
  return <PaginaChecagem locale={l} checagem={c} />;
}
