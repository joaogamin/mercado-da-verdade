"use client";
import { useMemo, useState } from "react";
import { PRODUTOS, TOTAL, ACIMA_DE_2019, CAIU_NO_LULA, CAIU_MAS_AINDA_CARO } from "@/data/produtos";

type Filtro = "todos" | "enganosos" | "acima";

const fmt = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1).replace(".", ",")}%`;

export default function Auditoria() {
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("enganosos");

  const lista = useMemo(() => {
    const termo = q.trim().toLowerCase();
    return PRODUTOS.filter((p) => {
      if (termo && !p.n.toLowerCase().includes(termo)) return false;
      if (filtro === "enganosos") return p.l < 0 && p.a > 0;
      if (filtro === "acima") return p.a > 0;
      return true;
    }).sort((a, b) => b.a - a.a);
  }, [q, filtro]);

  return (
    <section id="auditoria" className="sec sec--navy">
      <div className="wrap">
        <div className="eyebrow">Produto a produto</div>
        <h2 className="sec-title">&quot;Mais barato&quot; não quer dizer barato.</h2>
        <p className="sec-lead">
          Pegamos os <strong>{TOTAL} produtos</strong> da tabela do site original, com os números deles, sem mudar
          uma vírgula. E fizemos a única conta que faltava: encadear as duas janelas para saber onde o preço
          está <strong>hoje</strong> em relação a janeiro de 2019.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 2, margin: "34px 0 30px" }}>
          {[
            [`${ACIMA_DE_2019} de ${TOTAL}`, "produtos continuam mais caros que em janeiro de 2019"],
            [`${CAIU_NO_LULA}`, "produtos caíram durante a janela 2023-2026"],
            [`${CAIU_MAS_AINDA_CARO} desses ${CAIU_NO_LULA}`, "caíram, mas seguem acima do preço de 2019"],
            [`${TOTAL - ACIMA_DE_2019}`, "produtos estão de fato abaixo do nível de 2019"],
          ].map(([n, k]) => (
            <div key={k} style={{ background: "var(--blue-dd)", padding: "22px 18px", borderTop: "4px solid var(--accent)" }}>
              <div className="disp" style={{ fontSize: "clamp(26px,3.4vw,38px)", color: "var(--accent)", lineHeight: 1 }}>{n}</div>
              <div className="stat-k">{k}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 18 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar produto…"
            aria-label="Buscar produto"
            className="mono"
            style={{
              flex: "1 1 220px", background: "var(--blue-dd)", border: "2px solid rgba(255,255,255,.28)",
              color: "#fff", padding: "11px 14px", fontSize: 14,
            }}
          />
          {([
            ["enganosos", "Caiu, mas ainda caro"],
            ["acima", "Acima de 2019"],
            ["todos", "Todos"],
          ] as [Filtro, string][]).map(([k, t]) => (
            <button key={k} onClick={() => setFiltro(k)} className="mono"
              style={{
                background: filtro === k ? "var(--accent)" : "transparent",
                color: filtro === k ? "var(--ink)" : "rgba(255,255,255,.85)",
                border: "2px solid " + (filtro === k ? "var(--accent)" : "rgba(255,255,255,.28)"),
                padding: "11px 14px", fontSize: 12, fontWeight: 700, letterSpacing: ".06em",
                textTransform: "uppercase", cursor: "pointer",
              }}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ overflowX: "auto", border: "2px solid rgba(255,255,255,.2)" }}>
          <table className="mono" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 620 }}>
            <thead>
              <tr style={{ background: "var(--blue)", color: "#fff", textAlign: "left" }}>
                <th style={{ padding: "12px 14px", fontWeight: 700 }}>Produto</th>
                <th style={{ padding: "12px 14px", textAlign: "right" }}>Janela 2019-2022</th>
                <th style={{ padding: "12px 14px", textAlign: "right" }}>Janela 2023-2026</th>
                <th style={{ padding: "12px 14px", textAlign: "right", background: "var(--accent)", color: "var(--ink)" }}>
                  Preço hoje vs. jan/2019
                </th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p, i) => (
                <tr key={p.n} style={{ background: i % 2 ? "rgba(255,255,255,.04)" : "transparent" }}>
                  <td style={{ padding: "10px 14px" }}>{p.n[0].toUpperCase() + p.n.slice(1)}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", color: "rgba(255,255,255,.7)" }}>{fmt(p.b)}</td>
                  {/* Coluna neutra de proposito: e a variacao que a peca original destaca,
                      e pinta-la de verde reforcaria justamente a leitura que o site contesta. */}
                  <td style={{ padding: "10px 14px", textAlign: "right", color: "rgba(255,255,255,.7)" }}>
                    {fmt(p.l)}
                  </td>
                  <td style={{
                    padding: "10px 14px", textAlign: "right", fontWeight: 700,
                    // verde fica reservado ao caso raro de preco de fato abaixo de 2019
                    color: p.a > 0 ? "#ffffff" : "var(--accent)",
                  }}>
                    {fmt(p.a)}
                  </td>
                </tr>
              ))}
              {lista.length === 0 && (
                <tr><td colSpan={4} style={{ padding: 22, textAlign: "center", color: "rgba(255,255,255,.6)" }}>
                  Nenhum produto encontrado.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="verdict" style={{ background: "var(--blue-dd)", borderLeftColor: "var(--accent)" }}>
          <span className="verdict-label" style={{ color: "var(--accent)" }}>Veredito</span>
          <p style={{ color: "#fff" }}>
            O óleo de soja aparece como &quot;mais barato com Lula&quot; (−14,2%). Verdade — e ainda assim ele custa{" "}
            <strong>135% a mais</strong> que em 2019. O arroz caiu 1,9% e segue 47,6% acima. Uma queda depois de
            uma disparada não devolve o preço: devolve uma fração dele. É por isso que o gráfico melhora e a
            sensação no caixa do mercado não acompanha.
          </p>
        </div>

        <p className="src">
          Cálculo: nível de preço acumulado = ((1 + variação da 1ª janela) × (1 + variação da 2ª janela) − 1).
          Variações extraídas da seção &quot;Produto por produto&quot; de mercadodamentira.com.br (set/2026), que cita
          IPCA/IBGE. Ao encadear períodos consecutivos, os índices se multiplicam — não se somam.
        </p>
      </div>
    </section>
  );
}
