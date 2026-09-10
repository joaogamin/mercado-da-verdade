import Bandeira from "@/components/Bandeira";
import { LOCALES, SIGLA_DO_LOCALE, NOME_DO_LOCALE, caminhoDoLocale, type Locale } from "@/i18n/config";
import type { Dicionario } from "@/i18n";

// Server component: o menu mobile usa <details>, que e nativo do HTML.
// Isso evita marcar o header como client component so para abrir um menu.

const linkStyle: React.CSSProperties = {
  color: "rgba(255,255,255,.82)", textDecoration: "none", fontSize: 11.5,
  letterSpacing: ".06em", textTransform: "uppercase",
};

function SeletorIdioma({ locale, rotulo }: { locale: Locale; rotulo: string }) {
  return (
    <div className="idiomas" role="group" aria-label={rotulo}>
      {LOCALES.map((l) => {
        const atual = l === locale;
        return (
          <a
            key={l}
            href={caminhoDoLocale(l)}
            hrefLang={l}
            lang={l}
            aria-current={atual ? "true" : undefined}
            title={NOME_DO_LOCALE[l]}
            className={atual ? "idioma idioma--atual" : "idioma"}
          >
            <Bandeira locale={l} />
            <span>{SIGLA_DO_LOCALE[l]}</span>
          </a>
        );
      })}
    </div>
  );
}

export default function Header({ t, locale }: { t: Dicionario; locale: Locale }) {
  const n = t.nav;

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50, background: "var(--deep)",
      color: "#fff", borderBottom: "3px solid var(--brand)",
    }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 66, gap: 16 }}>
        <a href="#topo" className="marca-header" style={{ color: "#fff", textDecoration: "none", lineHeight: 1 }}>
          <span className="mono" style={{ fontSize: 9.5, letterSpacing: ".22em", color: "var(--accent)", display: "block", textTransform: "uppercase" }}>
            {n.tagline}
          </span>
          <span className="disp" style={{ fontSize: 22, letterSpacing: "-.01em" }}>
            {n.marca} <span style={{ color: "var(--accent)" }}>{n.marcaDestaque}</span>
          </span>
        </a>

        <nav className="nav-desk" style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center" }}>
          {n.links.map((l) => (
            <a key={l.href} href={l.href} className="mono" style={linkStyle}>{l.rotulo}</a>
          ))}
          <SeletorIdioma locale={locale} rotulo={n.idioma} />
        </nav>

        <details className="nav-mob">
          <summary aria-label={n.abrirMenu} className="mono">☰</summary>
          <div>
            <SeletorIdioma locale={locale} rotulo={n.idioma} />
            {n.links.map((l) => (
              <a key={l.href} href={l.href} className="mono">{l.rotulo}</a>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
