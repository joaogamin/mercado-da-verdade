import type { Metadata } from "next";
import LayoutRaiz from "@/components/LayoutRaiz";
import { criarMetadata } from "@/i18n/metadata";
import { LOCALES_COM_PREFIXO, paraLocale } from "@/i18n/config";

export { viewport } from "@/components/LayoutRaiz";

export function generateStaticParams() {
  return LOCALES_COM_PREFIXO.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return criarMetadata(paraLocale(locale), {
    title: "Mercado da Verdade — o dado é real, o contexto foi cortado",
    desc: "Checagem número a número do site mercadodamentira.com.br.",
    keywords: ["fact-checking", "Brazil", "IPCA", "IBGE", "inflation", "statistics"],
  });
}

export default async function LayoutIntl({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LayoutRaiz locale={paraLocale(locale)}>{children}</LayoutRaiz>;
}
