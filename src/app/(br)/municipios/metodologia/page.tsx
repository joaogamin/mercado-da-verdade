import type { Metadata } from "next";
import { metadados } from "@/municipios/metadados";
import Texto from "@/municipios/paginas/Texto";
import { METODOLOGIA } from "@/municipios/textos";

export const metadata: Metadata = metadados(`${METODOLOGIA.titulo} · Municípios`, METODOLOGIA.lead, "/municipios/metodologia/");

export default function Pagina() {
  return <Texto pagina={METODOLOGIA} atual="metodologia" />;
}
