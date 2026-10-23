import type { Metadata } from "next";
import { metadados } from "@/municipios/metadados";
import Texto from "@/municipios/paginas/Texto";
import { SOBRE } from "@/municipios/textos";

export const metadata: Metadata = metadados(`${SOBRE.titulo} · Municípios`, SOBRE.lead, "/municipios/sobre/");

export default function Pagina() {
  return <Texto pagina={SOBRE} atual="sobre" />;
}
