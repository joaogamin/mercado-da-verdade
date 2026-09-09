const STATS: [string, string][] = [
  ["109", "dos 112 produtos do site deles ainda estão mais caros que em jan/2019"],
  ["14,9%", "o pico do desemprego foi no 1º tri de 2021, no auge da pandemia"],
  ["159,7", "o índice global de alimentos da FAO bateu recorde em mar/2022"],
  ["3 de 6", "comparações da tabela deles se sustentam — e nós confirmamos"],
];

export default function Hero() {
  return (
    <section id="topo" style={{ background: "var(--blue)", color: "#fff", padding: "68px 0 0", overflow: "hidden" }}>
      <div className="wrap">
        <span className="mono"
          style={{ display: "inline-block", background: "var(--accent)", color: "var(--ink)", fontSize: 11.5,
            fontWeight: 700, letterSpacing: ".16em", padding: "7px 12px", textTransform: "uppercase" }}>
          ✓ Checagem de método, não de partido
        </span>

        <h1 style={{ fontSize: "clamp(40px,8.4vw,96px)", margin: "22px 0 0", maxWidth: "16ch" }}>
          O dado é real.<br />
          <span style={{ color: "var(--accent)" }}>O contexto foi cortado.</span>
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.15fr) minmax(0,1fr)", gap: 30, marginTop: 26 }}
          className="hero-grid">
          <div>
            <p style={{ fontSize: "clamp(17px,2.1vw,21px)", margin: 0, color: "rgba(255,255,255,.92)" }}>
              Este site confere, número por número, a peça de propaganda eleitoral sobre custo de vida publicada em{" "}
              <a
                href="https://mercadodamentira.com.br/"
                target="_blank"
                rel="noopener noreferrer nofollow"
                style={{ color: "var(--accent)", textDecoration: "underline", textUnderlineOffset: 4, whiteSpace: "nowrap" }}
              >
                mercadodamentira.com.br ↗
              </a>
              .
            </p>
            <p style={{ fontSize: "clamp(17px,2.1vw,21px)", marginTop: 16, color: "rgba(255,255,255,.92)" }}>
              A conclusão, depois de checar cada seção: <strong>eles não inventaram dados</strong>. Fizeram algo mais
              difícil de perceber — escolheram uma régua que começa e termina nos pontos certos para produzir a
              conclusão desejada. Aqui a gente recoloca o que foi cortado, <strong>com a mesma fonte oficial</strong>.
            </p>
          </div>

          <aside style={{ background: "var(--blue-dd)", borderLeft: "5px solid var(--accent)", padding: "22px 24px" }}>
            <h2 style={{ fontSize: 25, color: "var(--accent)", marginBottom: 12 }}>Aqui não tem meia-verdade.</h2>
            <p style={{ margin: 0, fontSize: 16, color: "rgba(255,255,255,.88)" }}>
              Das seis comparações da tabela deles, <strong>três se sustentam sem ressalva</strong> — e estão marcadas
              como corretas neste site, com a lei e a fonte de cada uma. O desemprego de 5,4% é real e é o menor da
              série. A informalidade está caindo.
            </p>
            <p style={{ margin: "12px 0 0", fontSize: 16, color: "rgba(255,255,255,.88)" }}>
              Um site de checagem que só encontra erro de um lado é propaganda com outro nome. Todo número aqui tem
              fonte primária, e o código e a base são abertos.
            </p>
          </aside>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 2, margin: "44px 0 0" }}>
          {STATS.map(([n, k]) => (
            <div key={k} style={{ background: "var(--blue-d)", padding: "24px 20px", borderTop: "4px solid var(--accent)" }}>
              <div className="stat-n" style={{ color: "var(--accent)" }}>{n}</div>
              <div className="stat-k" style={{ color: "rgba(255,255,255,.72)" }}>{k}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@media (max-width:860px){.hero-grid{grid-template-columns:1fr !important}}`}</style>
    </section>
  );
}
