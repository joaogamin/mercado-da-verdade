import Pagina from "@/components/Pagina";
import { LOCALES_COM_PREFIXO, paraLocale } from "@/i18n/config";

export function generateStaticParams() {
  return LOCALES_COM_PREFIXO.map((locale) => ({ locale }));
}

export default async function PaginaLocalizada({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <Pagina locale={paraLocale(locale)} />;
}
