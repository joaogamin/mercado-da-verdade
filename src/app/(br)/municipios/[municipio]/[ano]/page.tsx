import type { Metadata } from "next";
import { cidade, paramsAnos } from "@/municipios/dados";
import { metadados } from "@/municipios/metadados";
import VisaoGeral from "@/municipios/paginas/VisaoGeral";

export const dynamicParams = false;

export function generateStaticParams() {
  return paramsAnos();
}

type Props = { params: Promise<{ municipio: string; ano: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { municipio, ano } = await params;
  const c = cidade(municipio);
  return metadados(`Para onde foi o dinheiro de ${c?.nome} em ${ano}`, `Gastos da Prefeitura de ${c?.nome} em ${ano}, com a fonte oficial de cada número.`, `/municipios/${municipio}/${ano}/`);
}

export default async function PaginaAno({ params }: Props) {
  const { municipio, ano } = await params;
  return <VisaoGeral slug={municipio} ano={Number(ano)} />;
}
