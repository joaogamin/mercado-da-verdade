import { Rico } from "@/i18n/rich";
import type { Dicionario } from "@/i18n";
import { formatarData } from "@/i18n/numeros";
import { VERIFICADO_EM } from "@/lib/site";
import type { Locale } from "@/i18n/config";

export default function Footer({ t, locale }: { t: Dicionario; locale: Locale }) {
  const f = t.footer;
  const verificacao = f.ultimaVerificacao.replace("{data}", formatarData(VERIFICADO_EM, locale));

  return (
    <footer className="sec--deep" style={{ padding: "48px 0 40px", borderTop: "4px solid var(--brand)" }}>
      <div className="wrap">
        <div className="disp" style={{ fontSize: 30, color: "#fff" }}>
          {f.marca} <span style={{ color: "var(--accent)" }}>{f.marcaDestaque}</span>
        </div>

        <p style={{ maxWidth: "70ch", marginTop: 14, color: "rgba(255,255,255,.78)", fontSize: 15.5 }}>
          <Rico t={f.disclaimer} />
        </p>

        <p style={{ maxWidth: "70ch", marginTop: 12, color: "rgba(255,255,255,.6)", fontSize: 14 }}>
          {f.correcoes}
        </p>

        <div style={{
          marginTop: 26, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,.16)",
          display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between",
        }}>
          <p className="mono" style={{ margin: 0, color: "rgba(255,255,255,.45)", fontSize: 12 }}>
            {verificacao}
          </p>

          <a
            href="https://github.com/joaogamin/mercado-da-verdade"
            target="_blank"
            rel="noopener noreferrer"
            className="mono"
            style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              background: "transparent", color: "#fff", textDecoration: "none",
              fontSize: 12, fontWeight: 700, letterSpacing: ".08em",
              textTransform: "uppercase", padding: "10px 14px",
              border: "2px solid rgba(255,255,255,.3)",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .3a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .3z" />
            </svg>
            {f.github}
          </a>
        </div>
      </div>
    </footer>
  );
}
