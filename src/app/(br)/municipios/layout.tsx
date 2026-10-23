import type { Metadata } from "next";
import "@/app/municipios.css";
import { Rodape } from "@/municipios/componentes/Estrutura";
import { NAO_INDEXAR } from "@/municipios/metadados";

// Layout aninhado no root (br): reaproveita html/body, fontes e o CSS do
// Mercado. Nao entra no menu, no sitemap nem na home do Mercado.
export const metadata: Metadata = {
  robots: NAO_INDEXAR,
  alternates: { canonical: null },
};

export default function LayoutMunicipios({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Rodape />
    </>
  );
}
