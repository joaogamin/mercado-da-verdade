import type { Metadata } from "next";
import { Anton, Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mercadodaverdade.com.br";

const TITLE = "Mercado da Verdade — o dado é real, o contexto foi cortado";
const DESC =
  "Checagem estatística da propaganda eleitoral sobre custo de vida. Os números do IBGE são reais; a comparação entre 2019-2022 e 2023-2026 omite a pandemia e o pico global de alimentos. Veja o acumulado que a régua esconde.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s · Mercado da Verdade" },
  description: DESC,
  applicationName: "Mercado da Verdade",
  keywords: [
    "mercado da verdade", "checagem de dados", "fact-checking", "IPCA", "IBGE",
    "inflação de alimentos", "desemprego PNAD", "cherry picking estatístico",
    "custo de vida Brasil", "eleições 2026", "escala 6x1", "literacia estatística",
  ],
  authors: [{ name: "Mercado da Verdade" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Mercado da Verdade",
    title: TITLE,
    description: DESC,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "news",
};

export const viewport = { themeColor: "#0034d2", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${archivo.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
