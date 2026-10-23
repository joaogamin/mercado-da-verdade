import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

// Projeto oculto: nada aqui e indexado, e cada pagina tem o proprio canonical.
// O merge de metadata do Next e raso, entao robots e alternates definidos aqui
// substituem por inteiro os do root (br), que apontariam para a home do Mercado.
export const NAO_INDEXAR: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

export function metadados(titulo: string, descricao: string, caminho: string): Metadata {
  const url = SITE_URL + caminho;
  return {
    title: { absolute: titulo },
    description: descricao,
    robots: NAO_INDEXAR,
    alternates: { canonical: url },
    openGraph: { type: "website", locale: "pt_BR", url, siteName: "Mercado da Verdade · Municípios", title: titulo, description: descricao },
    twitter: { card: "summary", title: titulo, description: descricao },
  };
}
