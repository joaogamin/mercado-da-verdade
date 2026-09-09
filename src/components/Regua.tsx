// Indice de Precos de Alimentos da FAO (media anual, base 2014-2016 = 100).
// Serie GLOBAL: nenhum governo brasileiro a controla. E o teste de placebo da comparacao.
const FAO: [string, number][] = [
  ["2019", 95.1], ["2020", 98.1], ["2021", 125.7], ["2022", 143.7],
  ["2023", 124.0], ["2024", 122.0], ["2025", 127.2], ["2026*", 133.3],
];

const W = 940, H = 320, PL = 46, PR = 20, PT = 28, PB = 46;
const max = 165, min = 80;
const x = (i: number) => PL + (i * (W - PL - PR)) / (FAO.length - 1);
const y = (v: number) => PT + ((max - v) * (H - PT - PB)) / (max - min);

export default function Regua() {
  const line = FAO.map(([, v], i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  return (
    <section id="regua" className="sec sec--white">
      <div className="wrap">
        <div className="eyebrow">O flagra da régua</div>
        <h2 className="sec-title">Os dois períodos não são comparáveis.</h2>
        <p className="sec-lead">
          O site original compara <strong>jan/2019 a jul/2022</strong> com <strong>jan/2023 a jul/2026</strong>. Parece
          simétrico: três anos e meio de cada lado. Mas veja o que caiu dentro de cada janela — usando um índice{" "}
          <strong>global</strong>, que nenhum presidente brasileiro comanda.
        </p>

        <figure style={{ margin: "36px 0 0", border: "3px solid var(--ink)", background: "#fff", padding: "18px 10px 10px" }}>
          <figcaption className="mono" style={{ fontSize: 12, padding: "0 12px 12px", color: "var(--muted)" }}>
            ÍNDICE DE PREÇOS DE ALIMENTOS DA FAO/ONU · média anual · base 2014-2016 = 100
          </figcaption>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
            aria-label="Índice global de alimentos da FAO: sobe de 95 em 2019 para o recorde de 2022, cai em 2023-2024 e volta a subir até 133 em 2026.">
            {/* janela A — periodo Bolsonaro do site */}
            <rect x={x(0)} y={PT} width={x(3.55) - x(0)} height={H - PT - PB} fill="#e9edf5" />
            <text x={(x(0) + x(3.55)) / 2} y={PT + 16} textAnchor="middle" className="mono"
              fontSize="11.5" fill="#5b636a" letterSpacing="1.4">JANELA &quot;BOLSONARO&quot; DO SITE</text>

            {/* janela B — periodo Lula do site */}
            <rect x={x(4)} y={PT} width={x(FAO.length - 1) - x(4)} height={H - PT - PB} fill="#dfeaf7" />
            <text x={(x(4) + x(FAO.length - 1)) / 2} y={PT + 16} textAnchor="middle" className="mono"
              fontSize="11.5" fill="#00239a" letterSpacing="1.4">JANELA &quot;LULA&quot; DO SITE</text>

            {/* grade */}
            {[90, 110, 130, 150].map((v) => (
              <g key={v}>
                <line x1={PL} x2={W - PR} y1={y(v)} y2={y(v)} stroke="#d7dee6" strokeWidth="1" />
                <text x={PL - 8} y={y(v) + 4} textAnchor="end" className="mono" fontSize="11" fill="#8a94a0">{v}</text>
              </g>
            ))}

            <path d={line} fill="none" stroke="var(--blue)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />

            {FAO.map(([lab, v], i) => (
              <g key={lab}>
                <circle cx={x(i)} cy={y(v)} r="6" fill="#fff" stroke="var(--blue)" strokeWidth="3.5" />
                <text x={x(i)} y={y(v) - 15} textAnchor="middle" className="mono" fontSize="12.5" fontWeight="700" fill="var(--blue-dd)">
                  {v.toFixed(1)}
                </text>
                <text x={x(i)} y={H - PB + 20} textAnchor="middle" className="mono" fontSize="12" fill="#5b636a">{lab}</text>
              </g>
            ))}

            {/* marcadores de choque */}
            <line x1={x(1.2)} x2={x(1.2)} y1={PT + 26} y2={H - PB} stroke="#c0161c" strokeWidth="2" strokeDasharray="5 4" />
            <text x={x(1.2) + 7} y={PT + 42} className="mono" fontSize="11.5" fill="#c0161c" fontWeight="700">COVID-19</text>
            <line x1={x(3.1)} x2={x(3.1)} y1={PT + 26} y2={H - PB} stroke="#c0161c" strokeWidth="2" strokeDasharray="5 4" />
            <text x={x(3.1) + 7} y={PT + 186} className="mono" fontSize="11.5" fill="#c0161c" fontWeight="700">GUERRA NA</text>
            <text x={x(3.1) + 7} y={PT + 200} className="mono" fontSize="11.5" fill="#c0161c" fontWeight="700">UCRÂNIA</text>
          </svg>
          <p className="mono" style={{ fontSize: 11.5, color: "var(--muted)", padding: "4px 12px 0" }}>
            * 2026: valor de agosto (133,3), o mais alto desde o fim de 2022. Pico mensal absoluto da série:
            159,7 pontos em março de 2022.
          </p>
        </figure>

        <div className="duo">
          <div className="card card--claim">
            <span className="card-tag tag--claim">A narrativa</span>
            <h3>&quot;Três anos e meio de cada governo, lado a lado.&quot;</h3>
            <p>
              A simetria do calendário é apresentada como se fosse simetria de condições. Mesmo número de meses,
              mesma fonte, mesmo índice — logo, o que sobra seria mérito ou culpa de gestão.
            </p>
          </div>
          <div className="card card--fact">
            <span className="card-tag tag--fact">O contexto exato</span>
            <h3>Uma janela pega a subida global inteira. A outra pega a descida.</h3>
            <p>
              A janela &quot;Bolsonaro&quot; começa em 95 pontos e <strong>termina exatamente no pico histórico</strong> do
              índice global de alimentos: a pandemia, o colapso logístico e a guerra na Ucrânia estão todos dentro dela.
            </p>
            <p>
              A janela &quot;Lula&quot; começa <strong>logo depois desse pico</strong> e apanha a normalização das cadeias
              globais. Boa parte da diferença já estava dada antes de qualquer decisão tomada em Brasília.
            </p>
          </div>
        </div>

        <div className="verdict">
          <span className="verdict-label">Veredito</span>
          <p>
            Os números estão certos. A atribuição de causa é que não se sustenta: o mesmo padrão de alta e queda
            aparece no mundo inteiro, inclusive em países cujos governos não mudaram.
          </p>
        </div>

        <p className="src">
          Fontes: FAO — Índice de Preços de Alimentos (séries mensais e anuais, base 2014-2016=100); FAO,
          comunicado de março de 2022 sobre o recorde de 159,7 pontos; FAO, comunicado de setembro de 2026.
        </p>
      </div>
    </section>
  );
}
