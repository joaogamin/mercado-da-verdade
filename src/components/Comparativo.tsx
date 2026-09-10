import type { Dicionario } from "@/i18n";

type Veredito = "enganoso" | "parcial" | "correto";

const CORES: Record<Veredito, string> = {
  enganoso: "#c0161c",
  parcial: "#c9942a",
  correto: "#0e8a2f",
};

// O veredito de cada linha e fixo: nao depende do idioma, so o rotulo depende.
const VEREDITOS: Veredito[] = ["parcial", "enganoso", "parcial", "correto", "correto", "correto"];

export default function Comparativo({ t }: { t: Dicionario }) {
  const c = t.comparativo;

  return (
    <section id="comparativo" className="sec sec--white">
      <div className="wrap">
        <div className="eyebrow">{c.eyebrow}</div>
        <h2 className="sec-title">{c.titulo}</h2>
        <p className="sec-lead">{c.lead}</p>

        <div style={{ display: "grid", gap: 2, marginTop: 34 }}>
          {c.linhas.map((l, i) => {
            const v = VEREDITOS[i];
            return (
              <article key={l.ind} style={{ background: "var(--gray)", borderLeft: `8px solid ${CORES[v]}`, padding: "22px 24px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "baseline", justifyContent: "space-between" }}>
                  <h3 style={{ fontSize: 26 }}>{l.ind}</h3>
                  <span className="mono" style={{
                    background: CORES[v], color: "#fff", fontSize: 11, fontWeight: 700,
                    letterSpacing: ".12em", textTransform: "uppercase", padding: "5px 10px",
                  }}>
                    {c.selos[v]}
                  </span>
                </div>

                <div className="mono" style={{ display: "flex", gap: 26, flexWrap: "wrap", margin: "14px 0 12px", fontSize: 15 }}>
                  <span style={{ color: "var(--muted)" }}>
                    {c.colunaA} <strong style={{ color: "var(--ink)" }}>{l.a}</strong>
                  </span>
                  <span style={{ color: "var(--muted)" }}>
                    {c.colunaB} <strong style={{ color: "var(--brand)" }}>{l.b}</strong>
                  </span>
                </div>

                <p style={{ margin: 0, fontSize: 16, maxWidth: "88ch" }}>{l.txt}</p>
              </article>
            );
          })}
        </div>

        <div className="verdict">
          <span className="verdict-label">{t.comum.veredito}</span>
          <p>{c.veredito}</p>
        </div>

        <p className="src">{c.fontes}</p>
      </div>
    </section>
  );
}
