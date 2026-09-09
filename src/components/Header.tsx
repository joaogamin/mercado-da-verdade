// Server component: o menu mobile usa <details>, que e nativo do HTML.
// Isso evita marcar o header como client component so para abrir um menu.
const LINKS: [string, string][] = [
  ["#regua", "A régua"],
  ["#alimentos", "Alimentos"],
  ["#auditoria", "Produto a produto"],
  ["#desemprego", "Desemprego"],
  ["#comparativo", "O comparativo"],
  ["#seis-por-um", "Escala 6x1"],
  ["#ibge", "O IBGE"],
  ["#verdade", "O que é verdade"],
];

const linkStyle: React.CSSProperties = {
  color: "rgba(255,255,255,.82)", textDecoration: "none", fontSize: 11.5,
  letterSpacing: ".06em", textTransform: "uppercase",
};

export default function Header() {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50, background: "var(--navy)",
      color: "#fff", borderBottom: "3px solid var(--blue)",
    }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 66, gap: 16 }}>
        <a href="#topo" style={{ color: "#fff", textDecoration: "none", lineHeight: 1 }}>
          <span className="mono" style={{ fontSize: 9.5, letterSpacing: ".22em", color: "var(--accent)", display: "block" }}>
            CHECAGEM ESTATÍSTICA
          </span>
          <span className="disp" style={{ fontSize: 22, letterSpacing: "-.01em" }}>
            MERCADO DA <span style={{ color: "var(--accent)" }}>VERDADE</span>
          </span>
        </a>

        <nav className="nav-desk" style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {LINKS.map(([h, t]) => (
            <a key={h} href={h} className="mono" style={linkStyle}>{t}</a>
          ))}
        </nav>

        <details className="nav-mob">
          <summary aria-label="Abrir menu" className="mono">☰</summary>
          <div>
            {LINKS.map(([h, t]) => (
              <a key={h} href={h} className="mono">{t}</a>
            ))}
          </div>
        </details>
      </div>
    </header>
  );
}
