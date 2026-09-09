import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Mercado da Verdade — o dado é real, o contexto foi cortado";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "space-between", background: "#0034d2", color: "#fff", padding: 66,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "#ffd400", fontWeight: 700 }}>
          CHECAGEM ESTATÍSTICA · MERCADO DA VERDADE
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>
            O dado é real.
          </div>
          <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2, color: "#ffd400" }}>
            O contexto foi cortado.
          </div>
        </div>

        <div style={{ display: "flex", gap: 44, fontSize: 25, color: "rgba(255,255,255,.9)" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 52, fontWeight: 800, color: "#ffd400" }}>109/112</span>
            <span>produtos ainda acima de 2019</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 52, fontWeight: 800, color: "#ffd400" }}>14,9%</span>
            <span>o pico foi na pandemia</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 52, fontWeight: 800, color: "#ffd400" }}>159,7</span>
            <span>recorde global da FAO em 2022</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
