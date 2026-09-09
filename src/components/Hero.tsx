export default function Hero() {
  return (
    <section id="topo" style={{ background: "var(--blue)", color: "#fff", padding: "72px 0 0", overflow: "hidden" }}>
      <div className="wrap">
        <span className="mono"
          style={{ display: "inline-block", background: "var(--yellow)", color: "var(--ink)", fontSize: 11.5,
            fontWeight: 700, letterSpacing: ".16em", padding: "7px 12px", textTransform: "uppercase" }}>
          ✓ Checagem de método, não de partido
        </span>

        <h1 style={{ fontSize: "clamp(42px,9vw,104px)", margin: "22px 0 0", maxWidth: "16ch" }}>
          O dado é real.<br />
          <span style={{ color: "var(--yellow)" }}>O contexto foi cortado.</span>
        </h1>

        <p style={{ fontSize: "clamp(17px,2.2vw,22px)", maxWidth: "58ch", marginTop: 22, color: "rgba(255,255,255,.9)" }}>
          A propaganda eleitoral sobre o custo de vida <strong>não inventou números</strong>. Ela fez algo mais
          difícil de perceber: escolheu uma régua que começa e termina nos pontos certos para produzir a
          conclusão desejada. Aqui a gente recoloca o que foi cortado — <strong>com a mesma fonte oficial</strong>.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 2, margin: "48px 0 0" }}>
          {[
            ["109", "dos 112 produtos do site deles ainda estão mais caros que em jan/2019"],
            ["14,9%", "o pico do desemprego foi no 1º tri de 2021, no auge da pandemia"],
            ["159,7", "o índice global de alimentos da FAO bateu recorde em mar/2022"],
            ["0", "provas de fraude nos números — o problema está na régua, não na planilha"],
          ].map(([n, k]) => (
            <div key={k} style={{ background: "var(--blue-d)", padding: "24px 20px", borderTop: "4px solid var(--yellow)" }}>
              <div className="stat-n" style={{ color: "var(--yellow)" }}>{n}</div>
              <div className="stat-k" style={{ color: "rgba(255,255,255,.72)" }}>{k}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
