import type { Metadata } from "next";
import LayoutRaiz from "@/components/LayoutRaiz";
import { criarMetadata } from "@/i18n/metadata";
import { getDicionario } from "@/i18n";

export { viewport } from "@/components/LayoutRaiz";

export const metadata: Metadata = criarMetadata("pt-BR", getDicionario("pt-BR").meta);

export default function LayoutBR({ children }: { children: React.ReactNode }) {
  return <LayoutRaiz locale="pt-BR">{children}</LayoutRaiz>;
}
