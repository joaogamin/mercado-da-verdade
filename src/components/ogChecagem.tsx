import { ImageResponse } from "next/og";
import { getDicionario } from "@/i18n";
import { textoDaChecagem } from "@/i18n/checagemTexto";
import type { Checagem } from "@/i18n/checagens";
import type { Locale } from "@/i18n/config";

export const size = { width: 1200, height: 630 };

/** Arte compartilhada pelas rotas de OG das checagens (pt e intl). */
export function ogDaChecagem(locale: Locale, c: Checagem) {
  const t = getDicionario(locale);
  const info = textoDaChecagem(t, c);
  const titulo = info.titulo.length > 110 ? info.titulo.slice(0, 108) + "…" : info.titulo;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "space-between", background: "#00822f", color: "#fff",
          padding: 62, fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span
            style={{
              background: info.cor, color: "#fff", fontSize: 22, fontWeight: 700,
              letterSpacing: 3, padding: "10px 18px", textTransform: "uppercase",
            }}
          >
            {info.selo}
          </span>
          <span style={{ fontSize: 21, letterSpacing: 3, color: "#ffdf00", fontWeight: 700 }}>
            MERCADO DA VERDADE
          </span>
        </div>

        <div style={{ display: "flex", fontSize: titulo.length > 70 ? 52 : 64, fontWeight: 800, lineHeight: 1.1 }}>
          {info.ehAfirmacao ? `\u201C${titulo}\u201D` : titulo}
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#ffdf00", maxWidth: 1000 }}>
          {t.checagem.destaques[c.id as keyof typeof t.checagem.destaques]}
        </div>
      </div>
    ),
    size,
  );
}
