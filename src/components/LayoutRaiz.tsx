import { Anton, Archivo, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import type { Locale } from "@/i18n/config";
import "@/app/globals.css";

// Ha um root layout por idioma (src/app/(br) e src/app/(intl)), porque o
// atributo lang do <html> precisa mudar por rota e o site e exportado
// estaticamente — nao ha servidor para decidir isso em tempo de requisicao.
// Este componente concentra o que os dois tem em comum.

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const viewport = { themeColor: "#00822f", width: "device-width", initialScale: 1 };

export default function LayoutRaiz({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <html lang={locale} className={`${anton.variable} ${archivo.variable} ${mono.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
