// Server component. O filtro roda em ~25 linhas de JS puro sobre as linhas ja
// renderizadas, em vez de hidratar o React so para buscar e esconder <tr>.
import { PRODUTOS, TOTAL, ACIMA_DE_2019, CAIU_NO_LULA, CAIU_MAS_AINDA_CARO } from "@/data/produtos";

const fmt = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1).replace(".", ",")}%`;
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

const FILTROS: [string, string][] = [
  ["enganosos", "Caiu, mas ainda caro"],
  ["acima", "Acima de 2019"],
  ["todos", "Todos"],
];

const SCRIPT = `(function(){
  var t=document.getElementById('aud-tabela'); if(!t) return;
  var q=document.getElementById('aud-busca');
  var linhas=[].slice.call(t.tBodies[0].rows);
  var vazio=document.getElementById('aud-vazio');
  var modo='enganosos';
  function aplica(){
    var termo=(q.value||'').trim().toLowerCase(), n=0;
    linhas.forEach(function(tr){
      var ok=true;
      if(termo && tr.dataset.n.indexOf(termo)<0) ok=false;
      else if(modo==='enganosos') ok=tr.dataset.caiu==='1'&&tr.dataset.caro==='1';
      else if(modo==='acima') ok=tr.dataset.caro==='1';
      tr.hidden=!ok; if(ok)n++;
    });
    vazio.hidden=n>0;
  }
  q.addEventListener('input',aplica);
  [].slice.call(document.querySelectorAll('.fbtn')).forEach(function(b){
    b.addEventListener('click',function(){
      modo=b.dataset.f;
      document.querySelectorAll('.fbtn').forEach(function(o){o.setAttribute('aria-pressed',String(o===b));});
      aplica();
    });
  });
  aplica();
})();`;

export default function Auditoria() {
  const lista = [...PRODUTOS].sort((a, b) => b.a - a.a);

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
            id="aud-busca"
            placeholder="Buscar produto…"
            aria-label="Buscar produto"
            className="mono"
            style={{
              flex: "1 1 220px", background: "var(--blue-dd)", border: "2px solid rgba(255,255,255,.28)",
              color: "#fff", padding: "11px 14px", fontSize: 14,
            }}
          />
          {FILTROS.map(([k, t]) => (
            <button key={k} className="fbtn mono" data-f={k} aria-pressed={k === "enganosos"} type="button">
              {t}
            </button>
          ))}
        </div>

        <div style={{ overflowX: "auto", border: "2px solid rgba(255,255,255,.2)" }}>
          <table id="aud-tabela" className="mono" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 620 }}>
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
                <tr
                  key={p.n}
                  data-n={p.n.toLowerCase()}
                  data-caiu={p.l < 0 ? "1" : "0"}
                  data-caro={p.a > 0 ? "1" : "0"}
                  style={{ background: i % 2 ? "rgba(255,255,255,.04)" : "transparent" }}
                >
                  <td style={{ padding: "10px 14px" }}>{cap(p.n)}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", color: "rgba(255,255,255,.7)" }}>{fmt(p.b)}</td>
                  {/* Coluna neutra de proposito: e a variacao que a peca original destaca,
                      e pinta-la de verde reforcaria justamente a leitura que o site contesta. */}
                  <td style={{ padding: "10px 14px", textAlign: "right", color: "rgba(255,255,255,.7)" }}>{fmt(p.l)}</td>
                  <td
                    style={{
                      padding: "10px 14px", textAlign: "right", fontWeight: 700,
                      // verde fica reservado ao caso raro de preco de fato abaixo de 2019
                      color: p.a > 0 ? "#ffffff" : "var(--accent)",
                    }}
                  >
                    {fmt(p.a)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p id="aud-vazio" hidden style={{ padding: 22, textAlign: "center", color: "rgba(255,255,255,.6)", margin: 0 }}>
            Nenhum produto encontrado.
          </p>
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

      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
    </section>
  );
}
