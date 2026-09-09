// PNAD Continua trimestral (IBGE). t = trimestres decorridos desde o 1o tri/2019.
const P: { t: number; v: number; lab: string; mark?: "ini" | "pico" | "troca" | "hoje" }[] = [
  { t: 0, v: 12.7, lab: "1ºT/19", mark: "ini" },
  { t: 3, v: 11.0, lab: "4ºT/19" },
  { t: 8, v: 14.9, lab: "1ºT/21", mark: "pico" },
  { t: 15, v: 7.9, lab: "4ºT/22", mark: "troca" },
  { t: 19, v: 7.4, lab: "4ºT/23" },
  { t: 23, v: 6.2, lab: "4ºT/24" },
  { t: 29, v: 5.4, lab: "jun/26", mark: "hoje" },
];

const W = 940, H = 340, PL = 44, PR = 22, PT = 34, PB = 48;
const TMAX = 29, VMAX = 16, VMIN = 4;
const x = (t: number) => PL + (t * (W - PL - PR)) / TMAX;
const y = (v: number) => PT + ((VMAX - v) * (H - PT - PB)) / (VMAX - VMIN);

export default function Desemprego() {
  const line = P.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");

  return (
    <section id="desemprego" className="sec sec--white">
      <div className="wrap">
        <div className="eyebrow">Bloco 2 · A métrica do desemprego</div>
        <h2 className="sec-title">O pico de 14,9% não é o ponto de partida de ninguém.</h2>
        <p className="sec-lead">
          O comparativo do site coloca <strong>&quot;14%+&quot;</strong> na coluna do governo anterior e{" "}
          <strong>5,4%</strong> na atual. Mas 14,9% não foi como o governo anterior começou nem como terminou:
          foi o auge da pandemia, no 1º trimestre de 2021.
        </p>

        <figure style={{ margin: "36px 0 0", border: "3px solid var(--ink)", background: "#fff", padding: "18px 10px 10px" }}>
          <figcaption className="mono" style={{ fontSize: 12, padding: "0 12px 12px", color: "var(--muted)" }}>
            TAXA DE DESOCUPAÇÃO · PNAD CONTÍNUA TRIMESTRAL / IBGE · em % da força de trabalho
          </figcaption>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
            aria-label="Desemprego: 12,7% no início de 2019, pico de 14,9% no primeiro trimestre de 2021 durante a pandemia, 7,9% no fim de 2022 e 5,4% em junho de 2026.">
            <rect x={x(0)} y={PT} width={x(15) - x(0)} height={H - PT - PB} fill="#f0f2f6" />
            <rect x={x(15)} y={PT} width={x(TMAX) - x(15)} height={H - PT - PB} fill="#e2ecf9" />

            {[6, 8, 10, 12, 14].map((v) => (
              <g key={v}>
                <line x1={PL} x2={W - PR} y1={y(v)} y2={y(v)} stroke="#d7dee6" />
                <text x={PL - 8} y={y(v) + 4} textAnchor="end" className="mono" fontSize="11" fill="#8a94a0">{v}%</text>
              </g>
            ))}

            <line x1={x(15)} x2={x(15)} y1={PT} y2={H - PB} stroke="var(--ink)" strokeWidth="2.5" />
            <text x={x(15) - 8} y={PT + 15} textAnchor="end" className="mono" fontSize="11" fontWeight="700" fill="var(--ink)">
              TROCA DE GOVERNO
            </text>

            {/* faixa da pandemia */}
            <rect x={x(4.5)} y={PT} width={x(10) - x(4.5)} height={H - PT - PB} fill="#c0161c" opacity="0.09" />
            <text x={(x(4.5) + x(10)) / 2} y={H - PB - 10} textAnchor="middle" className="mono"
              fontSize="11.5" fontWeight="700" fill="#c0161c">PANDEMIA / LOCKDOWNS</text>

            <path d={line} fill="none" stroke="var(--blue)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />

            {P.map((p) => (
              <g key={p.lab}>
                <circle cx={x(p.t)} cy={y(p.v)} r={p.mark ? 8 : 5.5}
                  fill={p.mark === "pico" ? "#c0161c" : "#fff"} stroke={p.mark === "pico" ? "#c0161c" : "var(--blue)"} strokeWidth="3.5" />
                <text x={x(p.t) + (p.t === 0 ? 6 : 0)} y={y(p.v) - 17} textAnchor={p.t === 0 ? "start" : "middle"} className="mono"
                  fontSize="13" fontWeight="700" fill={p.mark === "pico" ? "#c0161c" : "var(--blue-dd)"}>
                  {p.v.toFixed(1).replace(".", ",")}%
                </text>
                <text x={x(p.t)} y={H - PB + 22} textAnchor="middle" className="mono" fontSize="11.5" fill="#5b636a">{p.lab}</text>
              </g>
            ))}

            <text x={x(8)} y={y(14.9) - 36} textAnchor="middle" className="mono" fontSize="11.5" fontWeight="700" fill="#c0161c">
              PICO DA SÉRIE
            </text>
          </svg>
        </figure>

        <div className="duo">
          <div className="card card--claim">
            <span className="card-tag tag--claim">A narrativa</span>
            <h3>&quot;Desemprego recorde de 14%+ contra 5,4%, o menor da história.&quot;</h3>
            <p>
              A tabela do site coloca o pior número já registrado de um lado e o melhor do outro, como se fossem
              os saldos de cada gestão.
            </p>
          </div>
          <div className="card card--fact">
            <span className="card-tag tag--fact">O contexto exato</span>
            <h3>Compare começo com começo e fim com fim.</h3>
            <p>
              O governo anterior <strong>recebeu 12,7%</strong> (1ºT/2019) e <strong>entregou 7,9%</strong>{" "}
              (4ºT/2022): queda de 4,8 pontos, atravessando a pandemia no meio.
            </p>
            <p>
              O governo atual <strong>recebeu 7,9%</strong> e chegou a <strong>5,4%</strong> (jun/2026): queda de
              2,5 pontos — um resultado real e o melhor da série, mas obtido a partir de uma herança já em queda.
            </p>
            <p>
              O 14,9% pertence ao 1º trimestre de 2021 — um trimestre de lockdown, não um balanço de gestão.
            </p>
          </div>
        </div>

        <div className="verdict">
          <span className="verdict-label">Veredito</span>
          <p>
            O 5,4% é verdadeiro e é o menor da série histórica. O que é falso é o contraste: usar o pico da
            pandemia como &quot;o número do adversário&quot; transfere para a gestão o custo de um choque sanitário global.
          </p>
        </div>

        <p className="src">
          Fontes: IBGE/PNAD Contínua trimestral — 1ºT/2019 (12,7%), 4ºT/2019 (11,0%), 1ºT/2021 (14,9%, máximo da
          série iniciada em 2012), 4ºT/2022 (7,9%), 4ºT/2023 (7,4%), 4ºT/2024 (6,2%) e trimestre encerrado em
          junho/2026 (5,4%).
        </p>
      </div>
    </section>
  );
}
