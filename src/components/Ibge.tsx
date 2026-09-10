import { Rico } from "@/i18n/rich";
import type { Dicionario } from "@/i18n";

export default function Ibge({ t }: { t: Dicionario }) {
  const i = t.ibge;

  return (
    <section id="ibge" className="sec sec--deep">
      <div className="wrap">
        <div className="eyebrow">{i.eyebrow}</div>
        <h2 className="sec-title">{i.titulo}</h2>
        <p className="sec-lead">{i.lead}</p>

        <div className="duo">
          <div className="card" style={{ background: "var(--brand-dd)", borderColor: "rgba(255,255,255,.25)", color: "#fff" }}>
            <span className="card-tag" style={{ background: "rgba(255,255,255,.16)", color: "#fff" }}>
              {i.tagNao}
            </span>
            <h3 style={{ color: "#fff" }}>{i.naoTitulo}</h3>
            <p style={{ color: "rgba(255,255,255,.85)" }}>{i.naoP1}</p>
            <p style={{ color: "rgba(255,255,255,.85)" }}><Rico t={i.naoP2} /></p>
            <p style={{ color: "rgba(255,255,255,.85)" }}><Rico t={i.naoP3} /></p>
          </div>

          <div className="card card--fact">
            <span className="card-tag tag--fact">{i.tagSim}</span>
            <h3>{i.simTitulo}</h3>
            <p><Rico t={i.simP1} /></p>
            <p><Rico t={i.simP2} /></p>
            <p>{i.simP3}</p>
          </div>
        </div>

        <div className="verdict" style={{ background: "var(--brand-dd)", borderLeftColor: "var(--accent)" }}>
          <span className="verdict-label" style={{ color: "var(--accent)" }}>{t.comum.veredito}</span>
          <p style={{ color: "#fff" }}>{i.veredito}</p>
        </div>

        <p className="src">{i.fontes}</p>
      </div>
    </section>
  );
}
