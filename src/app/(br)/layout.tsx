import type { Metadata } from "next";
import LayoutRaiz from "@/components/LayoutRaiz";
import { criarMetadata } from "@/i18n/metadata";

export { viewport } from "@/components/LayoutRaiz";

export const metadata: Metadata = criarMetadata("pt-BR", {
  title: "Mercado da Verdade — o dado é real, o contexto foi cortado",
  desc: "Checagem número a número do site mercadodamentira.com.br. Os dados do IBGE são reais — a régua é que foi escolhida: 109 dos 112 produtos seguem acima de 2019.",
  keywords: [
    "mercado da verdade", "checagem de dados", "fact-checking", "IPCA", "IBGE",
    "inflação de alimentos", "desemprego PNAD", "cherry picking estatístico",
    "custo de vida Brasil", "eleições 2026", "escala 6x1", "literacia estatística",
  ],
});

export default function LayoutBR({ children }: { children: React.ReactNode }) {
  return <LayoutRaiz locale="pt-BR">{children}</LayoutRaiz>;
}
