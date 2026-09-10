import { Rico } from "@/i18n/rich";
import type { Dicionario } from "@/i18n";

export default function Alimentos({ t }: { t: Dicionario }) {
  const a = t.alimentos;

  return (
    <section id="alimentos" className="sec" style={{ background: "var(--gray)" }}>
      <div className="wrap">
        <div className="eyebrow">{a.eyebrow}</div>
        <h2 className="sec-title">{a.titulo}</h2>
        <p className="sec-lead"><Rico t={a.lead} /></p>

        <div className="duo">
          <div className="card card--claim">
            <span className="card-tag tag--claim">{t.comum.narrativa}</span>
            <h3>{a.narrativaTitulo}</h3>
            <p>{a.narrativaP}</p>
          </div>
          <div className="card card--fact">
            <span className="card-tag tag--fact">{t.comum.contextoExato}</span>
            <h3>{a.contextoTitulo}</h3>
            <p><Rico t={a.contextoP1} /></p>
            <p><Rico t={a.contextoP2} /></p>
            <p><Rico t={a.contextoP3} /></p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 2, marginTop: 30 }}>
          {a.stats.map((s) => (
            <div key={s.k} style={{ background: "#fff", border: "2px solid var(--ink)", padding: "22px 18px" }}>
              <div className="disp" style={{ fontSize: 42, color: "var(--brand)", lineHeight: 1 }}>{s.n}</div>
              <div className="stat-k">{s.k}</div>
            </div>
          ))}
        </div>

        <div className="verdict">
          <span className="verdict-label">{t.comum.veredito}</span>
          <p>{a.veredito}</p>
        </div>

        <p className="src">{a.fontes}</p>
      </div>
    </section>
  );
}
