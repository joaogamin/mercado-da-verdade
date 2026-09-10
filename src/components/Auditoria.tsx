// Server component. Busca, filtros e modal rodam em JS puro sobre os cards ja
// renderizados, em vez de hidratar o React so para esconder <article>.
import { PRODUTOS, TOTAL, ACIMA_DE_2019, CAIU_NO_LULA, CAIU_MAS_AINDA_CARO, type Produto } from "@/data/produtos";
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
function nomeProduto(p: Produto, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return p.n[0].toUpperCase() + p.n.slice(1);
  return `${locale === "en" ? p.en : p.es} (${p.n})`;
}

function Linha({ rotulo, valor, locale, forte }: { rotulo: string; valor: number; locale: Locale; forte?: boolean }) {
  return (
    <div className={forte ? "pcard-linha pcard-linha--forte" : "pcard-linha"}>
      <span className="pcard-rot">{rotulo}</span>
      <span className={valor > 0 ? "pcard-val pcard-val--sobe" : "pcard-val pcard-val--cai"}>
        <span aria-hidden="true">{valor > 0 ? "▲" : "▼"}</span>
        {formatarPercentual(valor, locale)}
      </span>
    </div>
  );
}

function Card({ p, t, locale }: { p: Produto; t: Dicionario; locale: Locale }) {
  const a = t.auditoria;
  const caro = p.a > 0;
  const badge = caro
    ? a.badgeCaro.replace("{p}", `${Math.round(p.a)}%`)
    : a.badgeBarato;

  return (
    <article
      className="pcard"
      data-n={nomeProduto(p, locale).toLowerCase()}
      data-caiu={p.l < 0 ? "1" : "0"}
      data-caro={caro ? "1" : "0"}
    >
      <div className="pcard-topo">
        <span className="pcard-emoji" aria-hidden="true">{p.e}</span>
        <h4 className="pcard-nome">{nomeProduto(p, locale)}</h4>
      </div>

      <div className="pcard-corpo">
        <Linha rotulo={a.colunas.janelaA} valor={p.b} locale={locale} />
        <Linha rotulo={a.colunas.janelaB} valor={p.l} locale={locale} />
        <Linha rotulo={a.linhaHoje} valor={p.a} locale={locale} forte />
      </div>

      <div className={caro ? "pcard-badge pcard-badge--caro" : "pcard-badge pcard-badge--barato"}>
        {badge}
      </div>
    </article>
  );
}

const SCRIPT = `(function(){
  var dlg=document.getElementById('aud-modal');
  var abrir=document.getElementById('aud-abrir');
  var fechar=document.getElementById('aud-fechar');
  if(dlg&&abrir){
    abrir.addEventListener('click',function(){ dlg.showModal(); });
    fechar.addEventListener('click',function(){ dlg.close(); });
    dlg.addEventListener('click',function(e){ if(e.target===dlg) dlg.close(); });
  }
  var grade=document.getElementById('aud-grade'); if(!grade) return;
  var q=document.getElementById('aud-busca');
  var cards=[].slice.call(grade.children);
  var vazio=document.getElementById('aud-vazio');
  var modo='todos';
  function aplica(){
    var termo=(q.value||'').trim().toLowerCase(), n=0;
    cards.forEach(function(c){
      var ok=true;
      if(termo && c.dataset.n.indexOf(termo)<0) ok=false;
      else if(modo==='enganosos') ok=c.dataset.caiu==='1'&&c.dataset.caro==='1';
      else if(modo==='acima') ok=c.dataset.caro==='1';
      c.hidden=!ok; if(ok)n++;
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
  const destaque = lista.slice(0, 8);
  const filtros: [keyof typeof a.filtros, string][] = [
    ["todos", a.filtros.todos],
    ["enganosos", a.filtros.enganosos],
    ["acima", a.filtros.acima],
  ];

  return (
    <section id="auditoria" className="sec sec--deep">
      <div className="wrap">
        <div className="eyebrow">{a.eyebrow}</div>
        <h2 className="sec-title">{a.titulo}</h2>
        <p className="sec-lead"><Rico t={comContagens(a.lead)} /></p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 2, margin: "34px 0 34px" }}>
          {a.stats.map((s) => (
            <div key={s.k} style={{ background: "var(--brand-dd)", padding: "22px 18px", borderTop: "4px solid var(--accent)" }}>
              <div className="disp" style={{ fontSize: "clamp(26px,3.4vw,38px)", color: "var(--accent)", lineHeight: 1 }}>
                {comContagens(s.n)}
              </div>
              <div className="stat-k">{s.k}</div>
            </div>
          ))}
        </div>

        <h3 className="aud-destaque-titulo">{a.destaqueTitulo}</h3>
        <div className="pgrade pgrade--destaque">
          {destaque.map((p) => <Card key={p.n} p={p} t={t} locale={locale} />)}
        </div>

        <button id="aud-abrir" type="button" className="aud-abrir mono">{a.verLista}</button>

        <div className="verdict" style={{ background: "var(--brand-dd)", borderLeftColor: "var(--accent)" }}>
          <span className="verdict-label" style={{ color: "var(--accent)" }}>{t.comum.veredito}</span>
          <p style={{ color: "#fff" }}><Rico t={a.veredito} /></p>
        </div>

        <p className="src">{a.calculo}</p>
      </div>

      <dialog id="aud-modal" className="aud-modal" aria-label={a.modalTitulo}>
        <div className="aud-modal-caixa">
          <button id="aud-fechar" type="button" className="aud-fechar" aria-label={a.fechar}>✕</button>

          <h3 className="aud-modal-titulo">{a.modalTitulo}</h3>
          <p className="aud-modal-lead"><Rico t={a.modalLead} /></p>

          <input
            id="aud-busca"
            type="search"
            placeholder={`🔍  ${a.buscar}`}
            aria-label={a.buscar}
            className="aud-busca mono"
          />

          <div className="aud-filtros">
            {filtros.map(([chave, rotulo]) => (
              <button key={chave} className="fbtn mono" data-f={chave} aria-pressed={chave === "todos"} type="button">
                {rotulo}
              </button>
            ))}
          </div>

          <div id="aud-grade" className="pgrade">
            {lista.map((p) => <Card key={p.n} p={p} t={t} locale={locale} />)}
          </div>

          <p id="aud-vazio" hidden className="aud-vazio">{a.vazio}</p>
        </div>
      </dialog>

      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
    </section>
  );
}
