import type { Metadata } from "next";
import { metadados } from "@/municipios/metadados";
import Texto from "@/municipios/paginas/Texto";
import { ERRATAS } from "@/municipios/textos";

export const metadata: Metadata = metadados(`${ERRATAS.titulo} · Municípios`, ERRATAS.lead, "/municipios/erratas/");

export default function Pagina() {
  return <Texto pagina={ERRATAS} atual="erratas" />;
}
