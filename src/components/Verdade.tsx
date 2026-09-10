import type { Dicionario } from "@/i18n";

type Item = { t: string; d: string };

function Col({ titulo, cor, itens }: { titulo: string; cor: string; itens: readonly Item[] }) {
  return (
    <div>
      <h3 style={{ fontSize: 27, marginBottom: 16, color: cor }}>{titulo}</h3>
      <div style={{ display: "grid", gap: 2 }}>
        {itens.map((i) => (
          <div key={i.t} style={{ background: "#fff", borderLeft: `8px solid ${cor}`, padding: "18px 20px" }}>
            <strong style={{ display: "block", fontSize: 16.5, marginBottom: 6 }}>{i.t}</strong>
            <span style={{ fontSize: 15.5, color: "var(--muted)" }}>{i.d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Verdade({ t }: { t: Dicionario }) {
  const v = t.verdade;

  return (
    <section id="verdade" className="sec" style={{ background: "var(--gray)" }}>
      <div className="wrap">
        <div className="eyebrow">{v.eyebrow}</div>
        <h2 className="sec-title">{v.titulo}</h2>
        <p className="sec-lead">{v.lead}</p>

        <div className="duo" style={{ marginTop: 34 }}>
          <Col titulo={v.colunaAcertos} cor="var(--green)" itens={v.acertos} />
          <Col titulo={v.colunaOmissoes} cor="var(--brand)" itens={v.omissoes} />
        </div>

        <div className="verdict">
          <span className="verdict-label">{t.comum.oPonto}</span>
          <p>{v.ponto}</p>
        </div>

        <p className="src">{v.fontes}</p>
      </div>
    </section>
  );
}
