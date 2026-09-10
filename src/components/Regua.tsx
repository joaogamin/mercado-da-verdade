import { Rico } from "@/i18n/rich";
import type { Dicionario } from "@/i18n";
import { formatarNumero } from "@/i18n/numeros";
import type { Locale } from "@/i18n/config";

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

export default function Regua({ t, locale }: { t: Dicionario; locale: Locale }) {
  const r = t.regua;
  const line = FAO.map(([, v], i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  return (
    <section id="regua" className="sec sec--white">
      <div className="wrap">
        <div className="eyebrow">{r.eyebrow}</div>
        <h2 className="sec-title">{r.titulo}</h2>
        <p className="sec-lead"><Rico t={r.lead} /></p>

        <figure style={{ margin: "36px 0 0", border: "3px solid var(--ink)", background: "#fff", padding: "18px 10px 10px" }}>
          <figcaption className="mono" style={{ fontSize: 12, padding: "0 12px 12px", color: "var(--muted)" }}>
            {r.figCaption}
          </figcaption>
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={r.figAlt}>
            {/* janela A — periodo Bolsonaro do site */}
            <rect x={x(0)} y={PT} width={x(3.55) - x(0)} height={H - PT - PB} fill="#eef0ee" />
            <text x={(x(0) + x(3.55)) / 2} y={PT + 16} textAnchor="middle" className="mono"
              fontSize="11.5" fill="#5b636a" letterSpacing="1.4">{r.janelaA}</text>

            {/* janela B — periodo Lula do site */}
            <rect x={x(4)} y={PT} width={x(FAO.length - 1) - x(4)} height={H - PT - PB} fill="#dff0e4" />
            <text x={(x(4) + x(FAO.length - 1)) / 2} y={PT + 16} textAnchor="middle" className="mono"
              fontSize="11.5" fill="var(--brand-dd)" letterSpacing="1.4">{r.janelaB}</text>

            {/* grade */}
            {[90, 110, 130, 150].map((v) => (
              <g key={v}>
                <line x1={PL} x2={W - PR} y1={y(v)} y2={y(v)} stroke="#d7dee6" strokeWidth="1" />
                <text x={PL - 8} y={y(v) + 4} textAnchor="end" className="mono" fontSize="11" fill="#8a94a0">{v}</text>
              </g>
            ))}

            <path d={line} fill="none" stroke="var(--brand)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />

            {FAO.map(([lab, v], i) => (
              <g key={lab}>
                <circle cx={x(i)} cy={y(v)} r="6" fill="#fff" stroke="var(--brand)" strokeWidth="3.5" />
                <text x={x(i)} y={y(v) - 15} textAnchor="middle" className="mono" fontSize="12.5" fontWeight="700" fill="var(--brand-dd)">
                  {formatarNumero(v, locale, 1)}
                </text>
                <text x={x(i)} y={H - PB + 20} textAnchor="middle" className="mono" fontSize="12" fill="#5b636a">{lab}</text>
              </g>
            ))}

            {/* marcadores de choque */}
            <line x1={x(1.2)} x2={x(1.2)} y1={PT + 26} y2={H - PB} stroke="#c0161c" strokeWidth="2" strokeDasharray="5 4" />
            <text x={x(1.2) + 7} y={PT + 42} className="mono" fontSize="11.5" fill="#c0161c" fontWeight="700">{r.covid}</text>
            <line x1={x(3.1)} x2={x(3.1)} y1={PT + 26} y2={H - PB} stroke="#c0161c" strokeWidth="2" strokeDasharray="5 4" />
            <text x={x(3.1) + 7} y={PT + 186} className="mono" fontSize="11.5" fill="#c0161c" fontWeight="700">{r.guerra1}</text>
            <text x={x(3.1) + 7} y={PT + 200} className="mono" fontSize="11.5" fill="#c0161c" fontWeight="700">{r.guerra2}</text>
          </svg>
          <p className="mono" style={{ fontSize: 11.5, color: "var(--muted)", padding: "4px 12px 0" }}>{r.nota}</p>
        </figure>

        <div className="duo">
          <div className="card card--claim">
            <span className="card-tag tag--claim">{t.comum.narrativa}</span>
            <h3>{r.narrativaTitulo}</h3>
            <p>{r.narrativaP}</p>
          </div>
          <div className="card card--fact">
            <span className="card-tag tag--fact">{t.comum.contextoExato}</span>
            <h3>{r.contextoTitulo}</h3>
            <p><Rico t={r.contextoP1} /></p>
            <p><Rico t={r.contextoP2} /></p>
          </div>
        </div>

        <div className="verdict">
          <span className="verdict-label">{t.comum.veredito}</span>
          <p>{r.veredito}</p>
        </div>

        <p className="src">{r.fontes}</p>
      </div>
    </section>
  );
}
