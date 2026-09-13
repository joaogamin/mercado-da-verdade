import { Rico } from "@/i18n/rich";
import type { Dicionario } from "@/i18n";

const NOVA_ISSUE =
  "https://github.com/joaogamin/mercado-da-verdade/issues/new?template=checagem.yml";

export default function Entrada({ t }: { t: Dicionario }) {
  const e = t.entrada;

  return (
    <section id="sugerir" className="sec sec--tight" style={{ background: "var(--brand)", color: "#fff" }}>
      <div className="wrap">
        <div className="eyebrow">{e.eyebrow}</div>
        <h2 className="sec-title">{e.titulo}</h2>
        <p className="sec-lead" style={{ color: "rgba(255,255,255,.9)" }}><Rico t={e.lead} /></p>

        <a href={NOVA_ISSUE} target="_blank" rel="noopener noreferrer" className="entrada-botao mono">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .3a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .3z" />
          </svg>
          {e.botao}
        </a>

        <p className="mono entrada-nota">{e.nota}</p>
      </div>
    </section>
  );
}
