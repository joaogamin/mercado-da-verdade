import type { Metadata } from "next";
import PaginaChecagem, { metaDaChecagem } from "@/components/PaginaChecagem";
import { criarMetadata } from "@/i18n/metadata";
import { CHECAGENS, checagemPorSlug, idiomasDaChecagem } from "@/i18n/checagens";
import { DEFAULT_LOCALE, LOCALES, SEGMENTO_CHECAGEM } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return CHECAGENS.map((c) => ({ slug: c.slug["pt-BR"] }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = checagemPorSlug("pt-BR", slug);
  if (!c) return {};
  const m = metaDaChecagem("pt-BR", c);
  return criarMetadata(
    "pt-BR",
    { title: m.title, desc: m.desc },
    m.caminho,
    idiomasDaChecagem(SITE_URL, c, SEGMENTO_CHECAGEM, LOCALES, DEFAULT_LOCALE),
  );
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = checagemPorSlug("pt-BR", slug);
  if (!c) throw new Error(`Checagem desconhecida: ${slug}`);
  return <PaginaChecagem locale="pt-BR" checagem={c} />;
}
