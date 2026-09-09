const ETAPAS = [
  { t: "Admissibilidade na CCJ da Câmara", d: "22 de abril de 2026", ok: true },
  { t: "Aprovada na Câmara em 2 turnos", d: "27 de maio de 2026", ok: true },
  { t: "Chega ao Senado", d: "28 de maio de 2026", ok: true },
  { t: "Aprovada na CCJ do Senado", d: "2 de setembro de 2026", ok: true },
  { t: "Plenário do Senado — 1º turno (49 votos)", d: "sem data marcada", ok: false },
  { t: "Plenário do Senado — 2º turno (49 votos)", d: "não ocorreu", ok: false },
  { t: "Promulgação — vira regra constitucional", d: "não ocorreu", ok: false },
];

export default function Escala() {
  return (
    <section id="seis-por-um" className="sec" style={{ background: "var(--gray)" }}>
      <div className="wrap">
        <div className="eyebrow">Bloco 3 · A escala 6x1</div>
        <h2 className="sec-title">Uma proposta em votação não é uma entrega.</h2>
        <p className="sec-lead">
          Aqui é preciso ser justo: o card do site original diz, com todas as letras, &quot;proposta em debate no
          Congresso&quot;. O problema não está no texto do card — está em <strong>onde ele foi colocado</strong>: dentro da
          seção intitulada <em>&quot;O que o Lula fez&quot;</em>, ao lado de medidas que de fato já estão em vigor.
        </p>

        <div className="duo">
          <div className="card card--claim">
            <span className="card-tag tag--claim">A narrativa</span>
            <h3>&quot;Fim da escala 6x1&quot; na lista do que já foi feito.</h3>
            <p>
              O card aparece entre a isenção do imposto de renda (lei em vigor), o Desenrola e a queda da pobreza.
              A leitura rápida — que é como quase todo mundo lê um site — registra tudo como entregue.
            </p>
          </div>
          <div className="card card--fact">
            <span className="card-tag tag--fact">O contexto exato</span>
            <h3>Falta a etapa mais difícil: dois turnos no Plenário do Senado.</h3>
            <p>
              A PEC 221/2019 (com a PEC 8/2025 apensada) avançou de verdade em 2026 e está mais perto do que
              nunca. Mas precisa de <strong>49 votos em dois turnos no Senado</strong>, e a votação em Plenário{" "}
              <strong>ainda não tem data</strong>, com a oposição obstruindo.
            </p>
            <p>
              Até que isso aconteça, a escala 6x1 segue legal e valendo para quem trabalha sob ela hoje.
            </p>
          </div>
        </div>

        <ol style={{ listStyle: "none", padding: 0, margin: "30px 0 0", display: "grid", gap: 2 }}>
          {ETAPAS.map((e) => (
            <li key={e.t} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
              background: e.ok ? "#fff" : "#e6e6e6",
              borderLeft: `8px solid ${e.ok ? "var(--green)" : "var(--muted-l)"}`,
              opacity: e.ok ? 1 : 0.85,
            }}>
              <span className="mono" style={{ fontSize: 17, color: e.ok ? "var(--green)" : "var(--muted)", fontWeight: 700 }}>
                {e.ok ? "✓" : "○"}
              </span>
              <span style={{ flex: 1, fontWeight: e.ok ? 600 : 400 }}>{e.t}</span>
              <span className="mono" style={{ fontSize: 12.5, color: "var(--muted)", textAlign: "right" }}>{e.d}</span>
            </li>
          ))}
        </ol>

        <div className="verdict">
          <span className="verdict-label">Veredito</span>
          <p>
            Promessa em andamento apresentada no lugar de entrega. O avanço é real e recente — e vender futuro
            como presente é justamente o que corrói a confiança quando a votação emperra.
          </p>
        </div>

        <p className="src">
          Fontes: Senado Federal — PEC 221/2019 (aprovação na CCJ em 02/09/2026 e envio ao Plenário);
          Câmara dos Deputados — aprovação em dois turnos em 27/05/2026; Agência Brasil, setembro de 2026.
          Situação verificada em 9 de setembro de 2026.
        </p>
      </div>
    </section>
  );
}
