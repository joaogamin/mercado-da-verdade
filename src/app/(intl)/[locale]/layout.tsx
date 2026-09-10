import type { Metadata } from "next";
import LayoutRaiz from "@/components/LayoutRaiz";
import { criarMetadata } from "@/i18n/metadata";
import { getDicionario } from "@/i18n";
import { LOCALES_COM_PREFIXO, paraLocale } from "@/i18n/config";

export { viewport } from "@/components/LayoutRaiz";

export function generateStaticParams() {
  return LOCALES_COM_PREFIXO.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const l = paraLocale((await params).locale);
  return criarMetadata(l, getDicionario(l).meta);
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
