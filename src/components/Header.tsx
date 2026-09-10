import Bandeira from "@/components/Bandeira";
import Selo from "@/components/Selo";
import { LOCALES, SIGLA_DO_LOCALE, NOME_DO_LOCALE, caminhoDoLocale, type Locale } from "@/i18n/config";
import type { Dicionario } from "@/i18n";

// Server component: menu e seletor de idioma usam <details>, que e nativo do
// HTML. Isso evita marcar o header como client component so para abrir menus.

const linkStyle: React.CSSProperties = {
  color: "rgba(255,255,255,.82)", textDecoration: "none", fontSize: 11.5,
  letterSpacing: ".06em", textTransform: "uppercase", whiteSpace: "nowrap",
};

/**
 * Dropdown do idioma. Mostra sempre o idioma atual no gatilho e abre a lista
 * completa — ocupa cerca de um terco da largura dos tres botoes lado a lado,
 * que empurravam a navegacao para uma segunda linha em telas intermediarias.
 */
function DropdownIdioma({ locale, rotulo }: { locale: Locale; rotulo: string }) {
  return (
    <details className="idioma-drop">
      <summary aria-label={`${rotulo}: ${NOME_DO_LOCALE[locale]}`}>
        <Bandeira locale={locale} />
        <span>{SIGLA_DO_LOCALE[locale]}</span>
        <span className="idioma-chev" aria-hidden="true">▾</span>
      </summary>
      <div>
        {LOCALES.map((l) => (
          <a
            key={l}
            href={caminhoDoLocale(l)}
            hrefLang={l}
            lang={l}
            aria-current={l === locale ? "true" : undefined}
            className={l === locale ? "idioma-item idioma-item--atual" : "idioma-item"}
          >
            <Bandeira locale={l} />
            <span>{NOME_DO_LOCALE[l]}</span>
          </a>
        ))}
      </div>
    </details>
  );
}

export default function Header({ t, locale }: { t: Dicionario; locale: Locale }) {
  const n = t.nav;

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50, background: "var(--deep)",
      color: "#fff", borderBottom: "3px solid var(--brand)",
    }}>
      <div className="wrap header-barra">
        <a href="#topo" className="marca-header">
          <Selo />
          <span className="marca-txt">
            <span className="mono marca-tag">{n.tagline}</span>
            <span className="disp marca-nome">
              {n.marca} <span style={{ color: "var(--accent)" }}>{n.marcaDestaque}</span>
            </span>
          </span>
        </a>

        <nav className="nav-desk">
          {n.links.map((l) => (
            <a key={l.href} href={l.href} className="mono" style={linkStyle}>{l.rotulo}</a>
          ))}
        </nav>

        <div className="header-acoes">
          <DropdownIdioma locale={locale} rotulo={n.idioma} />

          <details className="nav-mob">
            <summary aria-label={n.abrirMenu} className="mono">☰</summary>
            <div>
              {n.links.map((l) => (
                <a key={l.href} href={l.href} className="mono">{l.rotulo}</a>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
