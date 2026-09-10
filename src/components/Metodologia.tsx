import type { Dicionario } from "@/i18n";

export default function Metodologia({ t }: { t: Dicionario }) {
  const m = t.metodologia;

  return (
    <section id="metodologia" className="sec sec--white">
      <div className="wrap">
        <div className="eyebrow">{m.eyebrow}</div>
        <h2 className="sec-title">{m.titulo}</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 26, marginTop: 32 }}>
          {m.itens.map((i) => (
            <div key={i.t}>
              <h3 style={{ fontSize: 21, marginBottom: 9, color: "var(--brand)" }}>{i.t}</h3>
              <p style={{ margin: 0, fontSize: 15.5, color: "var(--muted)" }}>{i.d}</p>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: 21, margin: "40px 0 14px" }}>{m.tituloFontes}</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {m.fontes.map((f) => (
            <a key={f.t} href={f.u} target="_blank" rel="noopener noreferrer" className="mono"
              style={{
                background: "var(--gray)", border: "2px solid var(--line)", padding: "10px 14px",
                fontSize: 12.5, color: "var(--ink)", textDecoration: "none",
              }}>
              {f.t} ↗
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
