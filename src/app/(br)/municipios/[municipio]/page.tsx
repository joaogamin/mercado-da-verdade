import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { anos, cidade, cidadesComDados } from "@/municipios/dados";
import { metadados } from "@/municipios/metadados";
import VisaoGeral from "@/municipios/paginas/VisaoGeral";

export const dynamicParams = false;

export function generateStaticParams() {
  return cidadesComDados().map((c) => ({ municipio: c.slug }));
}

type Props = { params: Promise<{ municipio: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { municipio } = await params;
  const c = cidade(municipio);
  const ano = anos(municipio)[0];
  // a pagina da cidade mostra o ano mais recente; o canonical e o do ano
  return metadados(`Para onde foi o dinheiro de ${c?.nome} em ${ano}`, `Gastos da Prefeitura de ${c?.nome}, com a fonte oficial de cada número.`, `/municipios/${municipio}/${ano}/`);
}

export default async function PaginaCidade({ params }: Props) {
  const { municipio } = await params;
  const ano = anos(municipio)[0];
  if (!ano) notFound();
  return <VisaoGeral slug={municipio} ano={ano} />;
}
