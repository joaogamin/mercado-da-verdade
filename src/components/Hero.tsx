import { Rico } from "@/i18n/rich";
import type { Dicionario } from "@/i18n";

export default function Hero({ t }: { t: Dicionario }) {
  const h = t.hero;

  return (
    <section id="topo" className="hero-sec" style={{ background: "var(--brand)", color: "#fff", padding: "68px 0 0", overflow: "hidden" }}>
      <div className="wrap">
        <span className="mono"
          style={{ display: "inline-block", background: "var(--accent)", color: "var(--ink)", fontSize: 11.5,
            fontWeight: 700, letterSpacing: ".16em", padding: "7px 12px", textTransform: "uppercase" }}>
          {h.selo}
        </span>

        <h1 style={{ fontSize: "clamp(40px,8.4vw,96px)", margin: "22px 0 0", maxWidth: "16ch" }}>
          {h.titulo1}<br />
          <span style={{ color: "var(--accent)" }}>{h.titulo2}</span>
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.15fr) minmax(0,1fr)", gap: 30, marginTop: 26 }}
          className="hero-grid">
          <div>
            <p style={{ fontSize: "clamp(17px,2.1vw,21px)", margin: 0, color: "rgba(255,255,255,.92)" }}>
              <Rico t={h.lead1} />
            </p>
            <p style={{ fontSize: "clamp(17px,2.1vw,21px)", marginTop: 16, color: "rgba(255,255,255,.92)" }}>
              <Rico t={h.lead2} />
            </p>
          </div>

          <aside style={{ background: "var(--brand-dd)", borderLeft: "5px solid var(--accent)", padding: "22px 24px" }}>
            <h2 style={{ fontSize: 25, color: "var(--accent)", marginBottom: 12 }}>{h.boxTitulo}</h2>
            <p style={{ margin: 0, fontSize: 16, color: "rgba(255,255,255,.88)" }}>
              <Rico t={h.boxP1} />
            </p>
            <p style={{ margin: "12px 0 0", fontSize: 16, color: "rgba(255,255,255,.88)" }}>
              <Rico t={h.boxP2} />
            </p>
          </aside>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 2, margin: "44px 0 0" }}>
          {h.stats.map((s) => (
            <div key={s.k} style={{ background: "var(--brand-d)", padding: "24px 20px", borderTop: "4px solid var(--accent)" }}>
              <div className="stat-n" style={{ color: "var(--accent)" }}>{s.n}</div>
              <div className="stat-k" style={{ color: "rgba(255,255,255,.72)" }}>{s.k}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@media (max-width:860px){.hero-grid{grid-template-columns:1fr !important}}`}</style>
    </section>
  );
}
