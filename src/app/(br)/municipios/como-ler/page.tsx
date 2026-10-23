import type { Metadata } from "next";
import { metadados } from "@/municipios/metadados";
import Texto from "@/municipios/paginas/Texto";
import { COMO_LER } from "@/municipios/textos";

export const metadata: Metadata = metadados(`${COMO_LER.titulo} · Municípios`, COMO_LER.lead, "/municipios/como-ler/");

export default function Pagina() {
  return <Texto pagina={COMO_LER} atual="como-ler" />;
}
