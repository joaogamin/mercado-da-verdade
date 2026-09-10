import { Rico } from "@/i18n/rich";
import type { Dicionario } from "@/i18n";
import { formatarNumero } from "@/i18n/numeros";
import type { Locale } from "@/i18n/config";

// PNAD Continua trimestral (IBGE). t = trimestres decorridos desde o 1o tri/2019.
const P: { t: number; v: number; mark?: "ini" | "pico" | "troca" | "hoje" }[] = [
  { t: 0, v: 12.7, mark: "ini" },
  { t: 3, v: 11.0 },
  { t: 8, v: 14.9, mark: "pico" },
  { t: 15, v: 7.9, mark: "troca" },
  { t: 19, v: 7.4 },
  { t: 23, v: 6.2 },
  { t: 29, v: 5.4, mark: "hoje" },
];

const W = 940, H = 340, PL = 44, PR = 22, PT = 34, PB = 48;
const TMAX = 29, VMAX = 16, VMIN = 4;
const x = (t: number) => PL + (t * (W - PL - PR)) / TMAX;
const y = (v: number) => PT + ((VMAX - v) * (H - PT - PB)) / (VMAX - VMIN);

export default function Desemprego({ t: dic, locale }: { t: Dicionario; locale: Locale }) {
  const d = dic.desemprego;
  const line = P.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");

  return (
    <section id="desemprego" className="sec sec--white">
      <div className="wrap">
        <div className="eyebrow">{d.eyebrow}</div>
        <h2 className="sec-title">{d.titulo}</h2>
        <p className="sec-lead"><Rico t={d.lead} /></p>

        <figure style={{ margin: "36px 0 0", border: "3px solid var(--ink)", background: "#fff", padding: "18px 10px 10px" }}>
          <figcaption className="mono" style={{ fontSize: 12, padding: "0 12px 12px", color: "var(--muted)" }}>{d.figCaption}</figcaption>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
            aria-label={d.figAlt}>
            <rect x={x(0)} y={PT} width={x(15) - x(0)} height={H - PT - PB} fill="#f0f2f6" />
            <rect x={x(15)} y={PT} width={x(TMAX) - x(15)} height={H - PT - PB} fill="#e2ecf9" />

            {[6, 8, 10, 12, 14].map((v) => (
              <g key={v}>
                <line x1={PL} x2={W - PR} y1={y(v)} y2={y(v)} stroke="#d7dee6" />
                <text x={PL - 8} y={y(v) + 4} textAnchor="end" className="mono" fontSize="11" fill="#8a94a0">{v}%</text>
              </g>
            ))}

            <line x1={x(15)} x2={x(15)} y1={PT} y2={H - PB} stroke="var(--ink)" strokeWidth="2.5" />
            <text x={x(15) - 8} y={PT + 15} textAnchor="end" className="mono" fontSize="11" fontWeight="700" fill="var(--ink)">{d.trocaGoverno}</text>

            {/* faixa da pandemia */}
            <rect x={x(4.5)} y={PT} width={x(10) - x(4.5)} height={H - PT - PB} fill="#c0161c" opacity="0.09" />
            <text x={(x(4.5) + x(10)) / 2} y={H - PB - 10} textAnchor="middle" className="mono"
              fontSize="11.5" fontWeight="700" fill="#c0161c">{d.pandemia}</text>

            <path d={line} fill="none" stroke="var(--brand)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />

            {P.map((p, i) => (
              <g key={p.t}>
                <circle cx={x(p.t)} cy={y(p.v)} r={p.mark ? 8 : 5.5}
                  fill={p.mark === "pico" ? "#c0161c" : "#fff"} stroke={p.mark === "pico" ? "#c0161c" : "var(--brand)"} strokeWidth="3.5" />
                <text x={x(p.t) + (p.t === 0 ? 6 : 0)} y={y(p.v) - 17} textAnchor={p.t === 0 ? "start" : "middle"} className="mono"
                  fontSize="13" fontWeight="700" fill={p.mark === "pico" ? "#c0161c" : "var(--brand-dd)"}>
                  {formatarNumero(p.v, locale, 1)}%
                </text>
                <text x={x(p.t)} y={H - PB + 22} textAnchor="middle" className="mono" fontSize="11.5" fill="#5b636a">{d.rotulos[i]}</text>
              </g>
            ))}

            <text x={x(8)} y={y(14.9) - 36} textAnchor="middle" className="mono" fontSize="11.5" fontWeight="700" fill="#c0161c">{d.pico}</text>
          </svg>
        </figure>

        <div className="duo">
          <div className="card card--claim">
            <span className="card-tag tag--claim">{dic.comum.narrativa}</span>
            <h3>{d.narrativaTitulo}</h3>
            <p>{d.narrativaP}</p>
          </div>
          <div className="card card--fact">
            <span className="card-tag tag--fact">{dic.comum.contextoExato}</span>
            <h3>{d.contextoTitulo}</h3>
            <p><Rico t={d.contextoP1} /></p>
            <p><Rico t={d.contextoP2} /></p>
            <p>{d.contextoP3}</p>
          </div>
        </div>

        <div className="verdict">
          <span className="verdict-label">{dic.comum.veredito}</span>
          <p>{d.veredito}</p>
        </div>

        <p className="src">{d.fontes}</p>
      </div>
    </section>
  );
}
