"use client";
import { useState } from "react";

const LINKS = [
  ["#regua", "A régua"],
  ["#alimentos", "Alimentos"],
  ["#auditoria", "Produto a produto"],
  ["#desemprego", "Desemprego"],
  ["#comparativo", "O comparativo"],
  ["#seis-por-um", "Escala 6x1"],
  ["#ibge", "O IBGE"],
  ["#verdade", "O que é verdade"],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 50, background: "var(--navy)",
        color: "#fff", borderBottom: "3px solid var(--blue)",
      }}
    >
      <div
        className="wrap"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 66, gap: 16 }}
      >
        <a href="#topo" style={{ color: "#fff", textDecoration: "none", lineHeight: 1 }}>
          <span className="mono" style={{ fontSize: 9.5, letterSpacing: ".22em", color: "var(--accent)", display: "block" }}>
            CHECAGEM ESTATÍSTICA
          </span>
          <span className="disp" style={{ fontSize: 22, letterSpacing: "-.01em" }}>
            MERCADO DA <span style={{ color: "var(--accent)" }}>VERDADE</span>
          </span>
        </a>

        <nav className="hide-sm" style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {LINKS.map(([h, t]) => (
            <a key={h} href={h} className="mono"
              style={{ color: "rgba(255,255,255,.82)", textDecoration: "none", fontSize: 11.5, letterSpacing: ".06em", textTransform: "uppercase" }}>
              {t}
            </a>
          ))}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Abrir menu"
          style={{
            display: "none", background: "none", border: "2px solid rgba(255,255,255,.4)",
            color: "#fff", fontSize: 20, width: 40, height: 40, cursor: "pointer",
          }}
          data-mobile-toggle
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="wrap" style={{ paddingBottom: 16, display: "grid", gap: 10 }}>
          {LINKS.map(([h, t]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="mono"
              style={{ color: "#fff", textDecoration: "none", fontSize: 13, textTransform: "uppercase" }}>
              {t}
            </a>
          ))}
        </div>
      )}

      <style>{`@media (max-width:700px){[data-mobile-toggle]{display:block !important}}`}</style>
    </header>
  );
}
