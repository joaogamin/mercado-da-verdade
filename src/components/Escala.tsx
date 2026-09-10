import { Rico } from "@/i18n/rich";
import type { Dicionario } from "@/i18n";
import { formatarData } from "@/i18n/numeros";
import { VERIFICADO_EM } from "@/lib/site";
import type { Locale } from "@/i18n/config";

// Quais etapas ja aconteceram nao depende do idioma: e a mesma tramitacao.
const CONCLUIDA = [true, true, true, true, false, false, false];

export default function Escala({ t, locale }: { t: Dicionario; locale: Locale }) {
  const e = t.escala;
  const fontes = e.fontes.replace("{data}", formatarData(VERIFICADO_EM, locale));

  return (
    <section id="seis-por-um" className="sec" style={{ background: "var(--gray)" }}>
      <div className="wrap">
        <div className="eyebrow">{e.eyebrow}</div>
        <h2 className="sec-title">{e.titulo}</h2>
        <p className="sec-lead"><Rico t={e.lead} /></p>

        <div className="duo">
          <div className="card card--claim">
            <span className="card-tag tag--claim">{t.comum.narrativa}</span>
            <h3>{e.narrativaTitulo}</h3>
            <p>{e.narrativaP}</p>
          </div>
          <div className="card card--fact">
            <span className="card-tag tag--fact">{t.comum.contextoExato}</span>
            <h3>{e.contextoTitulo}</h3>
            <p><Rico t={e.contextoP1} /></p>
            <p>{e.contextoP2}</p>
          </div>
        </div>

        <ol style={{ listStyle: "none", padding: 0, margin: "30px 0 0", display: "grid", gap: 2 }}>
          {e.etapas.map((etapa, i) => {
            const ok = CONCLUIDA[i];
            return (
              <li key={etapa.t} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
                background: ok ? "#fff" : "#e6e6e6",
                borderLeft: `8px solid ${ok ? "var(--green)" : "var(--muted-l)"}`,
                opacity: ok ? 1 : 0.85,
              }}>
                <span className="mono" style={{ fontSize: 17, color: ok ? "var(--green)" : "var(--muted)", fontWeight: 700 }}>
                  {ok ? "✓" : "○"}
                </span>
                <span style={{ flex: 1, fontWeight: ok ? 600 : 400 }}>{etapa.t}</span>
                <span className="mono" style={{ fontSize: 12.5, color: "var(--muted)", textAlign: "right" }}>{etapa.d}</span>
              </li>
            );
          })}
        </ol>

        <div className="verdict">
          <span className="verdict-label">{t.comum.veredito}</span>
          <p>{e.veredito}</p>
        </div>

        <p className="src">{fontes}</p>
      </div>
    </section>
  );
}
