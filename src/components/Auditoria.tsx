// Server component. O filtro roda em ~25 linhas de JS puro sobre as linhas ja
// renderizadas, em vez de hidratar o React so para buscar e esconder <tr>.
import { PRODUTOS, TOTAL, ACIMA_DE_2019, CAIU_NO_LULA, CAIU_MAS_AINDA_CARO } from "@/data/produtos";
import { Rico } from "@/i18n/rich";
import type { Dicionario } from "@/i18n";
import { formatarPercentual } from "@/i18n/numeros";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

const CONTAGENS: Record<string, string> = {
  "{total}": String(TOTAL),
  "{acima}": String(ACIMA_DE_2019),
  "{caiu}": String(CAIU_NO_LULA),
  "{aindaCaro}": String(CAIU_MAS_AINDA_CARO),
  "{abaixo}": String(TOTAL - ACIMA_DE_2019),
};

function comContagens(texto: string): string {
  return Object.entries(CONTAGENS).reduce((s, [k, v]) => s.split(k).join(v), texto);
}

/**
 * Fora do portugues, mostra o nome traduzido com o original entre parenteses:
 * a tabela cita o IPCA, entao o rotulo brasileiro e o que permite conferir
 * cada linha contra a fonte.
 */
function nomeProduto(p: { n: string; en: string; es: string }, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return p.n[0].toUpperCase() + p.n.slice(1);
  const traduzido = locale === "en" ? p.en : p.es;
  return `${traduzido} (${p.n})`;
}

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

export default function Auditoria({ t, locale }: { t: Dicionario; locale: Locale }) {
  const a = t.auditoria;
  const lista = [...PRODUTOS].sort((x, y) => y.a - x.a);
  const filtros: [keyof typeof a.filtros, string][] = [
    ["enganosos", a.filtros.enganosos],
    ["acima", a.filtros.acima],
    ["todos", a.filtros.todos],
  ];

  return (
    <section id="auditoria" className="sec sec--deep">
      <div className="wrap">
        <div className="eyebrow">{a.eyebrow}</div>
        <h2 className="sec-title">{a.titulo}</h2>
        <p className="sec-lead"><Rico t={comContagens(a.lead)} /></p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 2, margin: "34px 0 30px" }}>
          {a.stats.map((s) => (
            <div key={s.k} style={{ background: "var(--brand-dd)", padding: "22px 18px", borderTop: "4px solid var(--accent)" }}>
              <div className="disp" style={{ fontSize: "clamp(26px,3.4vw,38px)", color: "var(--accent)", lineHeight: 1 }}>
                {comContagens(s.n)}
              </div>
              <div className="stat-k">{s.k}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 18 }}>
          <input
            id="aud-busca"
            placeholder={a.buscar}
            aria-label={a.buscar}
            className="mono"
            style={{
              flex: "1 1 220px", background: "var(--brand-dd)", border: "2px solid rgba(255,255,255,.28)",
              color: "#fff", padding: "11px 14px", fontSize: 14,
            }}
          />
          {filtros.map(([chave, rotulo]) => (
            <button key={chave} className="fbtn mono" data-f={chave} aria-pressed={chave === "enganosos"} type="button">
              {rotulo}
            </button>
          ))}
        </div>

        <div style={{ overflowX: "auto", border: "2px solid rgba(255,255,255,.2)" }}>
          <table id="aud-tabela" className="mono" style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 620 }}>
            <thead>
              <tr style={{ background: "var(--brand)", color: "#fff", textAlign: "left" }}>
                <th style={{ padding: "12px 14px", fontWeight: 700 }}>{a.colunas.produto}</th>
                <th style={{ padding: "12px 14px", textAlign: "right" }}>{a.colunas.janelaA}</th>
                <th style={{ padding: "12px 14px", textAlign: "right" }}>{a.colunas.janelaB}</th>
                <th style={{ padding: "12px 14px", textAlign: "right", background: "var(--accent)", color: "var(--ink)" }}>
                  {a.colunas.acumulado}
                </th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p, i) => (
                <tr
                  key={p.n}
                  data-n={nomeProduto(p, locale).toLowerCase()}
                  data-caiu={p.l < 0 ? "1" : "0"}
                  data-caro={p.a > 0 ? "1" : "0"}
                  style={{ background: i % 2 ? "rgba(255,255,255,.04)" : "transparent" }}
                >
                  <td style={{ padding: "10px 14px" }}>{nomeProduto(p, locale)}</td>
                  <td style={{ padding: "10px 14px", textAlign: "right", color: "rgba(255,255,255,.7)" }}>
                    {formatarPercentual(p.b, locale)}
                  </td>
                  {/* Coluna neutra de proposito: e a variacao que a peca original destaca,
                      e pinta-la de verde reforcaria justamente a leitura que o site contesta. */}
                  <td style={{ padding: "10px 14px", textAlign: "right", color: "rgba(255,255,255,.7)" }}>
                    {formatarPercentual(p.l, locale)}
                  </td>
                  <td
                    style={{
                      padding: "10px 14px", textAlign: "right", fontWeight: 700,
                      // verde fica reservado ao caso raro de preco de fato abaixo de 2019
                      color: p.a > 0 ? "#ffffff" : "var(--accent)",
                    }}
                  >
                    {formatarPercentual(p.a, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p id="aud-vazio" hidden style={{ padding: 22, textAlign: "center", color: "rgba(255,255,255,.6)", margin: 0 }}>
            {a.vazio}
          </p>
        </div>

        <div className="verdict" style={{ background: "var(--brand-dd)", borderLeftColor: "var(--accent)" }}>
          <span className="verdict-label" style={{ color: "var(--accent)" }}>{t.comum.veredito}</span>
          <p style={{ color: "#fff" }}><Rico t={a.veredito} /></p>
        </div>

        <p className="src">{a.calculo}</p>
      </div>

      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
    </section>
  );
}
