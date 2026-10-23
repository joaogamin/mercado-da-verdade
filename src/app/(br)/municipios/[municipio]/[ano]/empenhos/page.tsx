// Explorador de empenhos. Mesmo padrao do Auditoria.tsx do Mercado: a pagina
// vem pronta do servidor e um script em JS puro (sem hidratar React) busca o
// indice do exercicio, filtra e abre o detalhe de um empenho. O DOM e montado
// com textContent — nenhum dado vira HTML.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cidade as cidadeDe, exercicio, paramsAnos } from "@/municipios/dados";
import { metadados } from "@/municipios/metadados";
import { Cabecalho, Trilha } from "@/municipios/componentes/Estrutura";
import { Fonte } from "@/municipios/componentes/Fonte";
import { inteiro } from "@/municipios/formato";
import { navCidade } from "@/municipios/navegacao";
import { COLUNAS_INDICE } from "@pipeline/publicar/indice.ts";

export const dynamicParams = false;

export function generateStaticParams() {
  return paramsAnos();
}

type Props = { params: Promise<{ municipio: string; ano: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { municipio, ano } = await params;
  const c = cidadeDe(municipio);
  return metadados(`Empenhos de ${c?.nome} em ${ano}`, `Busque e abra cada empenho da Prefeitura de ${c?.nome} em ${ano}.`, `/municipios/${municipio}/${ano}/empenhos/`);
}

const SCRIPT = `(function(){
  var raiz=document.getElementById('exp'); if(!raiz) return;
  var base=raiz.dataset.base, cidade=raiz.dataset.cidade, ano=raiz.dataset.ano;
  var COL=JSON.parse(raiz.dataset.colunas); var I={}; COL.forEach(function(c,i){I[c]=i;});
  var BRL=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});
  var $=function(id){return document.getElementById(id);};
  var q=$('exp-q'), org=$('exp-orgao'), mod=$('exp-mod'), mes=$('exp-mes'), ord=$('exp-ord');
  var corpo=$('exp-corpo'), cont=$('exp-cont'), mais=$('exp-mais'), det=$('exp-det');
  var linhas=[], orgaos={}, filtradas=[], mostrar=200, cache={};
  function el(tag,attrs,filhos){var e=document.createElement(tag);for(var k in attrs||{}){if(k==='texto')e.textContent=attrs[k];else e.setAttribute(k,attrs[k]);}(filhos||[]).forEach(function(f){if(f)e.appendChild(typeof f==='string'?document.createTextNode(f):f);});return e;}
  var reais=function(c){return BRL.format(c/100);};
  var dataBr=function(iso){return iso?iso.slice(0,10).split('-').reverse().join('/'):'';};
  function sem(s){return (s||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toLowerCase();}
  var params=new URLSearchParams(location.search);
  function aplica(){
    var t=sem(q.value.trim()), o=org.value, m=mod.value, ms=mes.value, cr=params.get('credor')||'';
    filtradas=linhas.filter(function(l){
      if(o&&l[I.orgao]!==o) return false;
      if(m&&l[I.modalidade]!==m) return false;
      if(ms&&l[I.data].slice(5,7)!==ms) return false;
      if(cr&&l[I.slugCredor]!==cr) return false;
      if(t&&sem(l[I.credor]+' '+l[I.numero]+' '+l[I.documento]).indexOf(t)<0) return false;
      return true;
    });
    var k=ord.value;
    filtradas.sort(function(a,b){return k==='data'?(b[I.data]<a[I.data]?-1:b[I.data]>a[I.data]?1:b[I.numero]-a[I.numero]):b[I.empenhado]-a[I.empenhado];});
    var soma=filtradas.reduce(function(s,l){return s+l[I.empenhado];},0);
    cont.textContent=filtradas.length.toLocaleString('pt-BR')+' empenhos · '+reais(soma)+(cr?' · só o credor escolhido ':'');
    render();
  }
  function render(){
    corpo.textContent='';
    filtradas.slice(0,mostrar).forEach(function(l){
      var a=el('a',{href:'?n='+l[I.numero],texto:ano+'/'+l[I.numero]});
      a.addEventListener('click',function(ev){ev.preventDefault();abrir(l[I.numero]);});
      var cel=[el('td',{},[a,l[I.removidoEm]?el('span',{class:'mun-removido',texto:'removido'}):null]),el('td',{texto:dataBr(l[I.data])}),
        el('td',{},[el('a',{href:'/municipios/'+cidade+'/'+ano+'/credor/'+l[I.slugCredor]+'/',texto:l[I.credor]})]),
        el('td',{texto:orgaos[l[I.orgao]]||'—'}),el('td',{class:'num',texto:reais(l[I.empenhado])}),el('td',{class:'num',texto:reais(l[I.pago])})];
      corpo.appendChild(el('tr',{},cel));
    });
    mais.hidden=filtradas.length<=mostrar;
  }
  function linhaDl(dl,rot,val){if(val===undefined||val===null||val==='')return;dl.appendChild(el('dt',{texto:rot}));dl.appendChild(el('dd',{},[val]));}
  function tabela(cab,rows){var t=el('table',{class:'mun-tabela'});t.appendChild(el('thead',{},[el('tr',{},cab.map(function(c,i){return el('th',{class:i>2?'num':'',texto:c});}))]));var b=el('tbody');rows.forEach(function(r){b.appendChild(el('tr',{},r.map(function(c,i){return el('td',{class:i>2?'num':'',texto:c});})));});t.appendChild(b);return el('div',{class:'mun-tabela-rolagem'},[t]);}
  function abrir(n){
    var l=linhas.find(function(x){return x[I.numero]===n;}); if(!l){det.hidden=false;det.textContent='Empenho '+ano+'/'+n+' não encontrado neste exercício.';return;}
    history.replaceState(null,'','?n='+n);
    var mm=l[I.data].slice(5,7);
    (cache[mm]?Promise.resolve(cache[mm]):fetch(base+'detalhe-'+mm+'.json').then(function(r){return r.json();}).then(function(j){cache[mm]=j;return j;})).then(function(j){
      var d=j[n]||{}; var c=d.classificacao; det.textContent=''; det.hidden=false;
      det.appendChild(el('h3',{class:'mun-h3',texto:'Empenho '+ano+'/'+n}));
      if(l[I.removidoEm]) det.appendChild(el('p',{},[el('span',{class:'mun-removido',texto:'removido do portal em '+dataBr(l[I.removidoEm])}),' — a cópia arquivada continua disponível.']));
      var dl=el('dl');
      linhaDl(dl,'Credor',l[I.credor]+(l[I.documento]?' · '+l[I.documento]:''));
      linhaDl(dl,'Data',dataBr(l[I.data]));
      // a lista traz o valor original; o detalhe, o valor atual (descontadas as anulacoes)
      if(typeof d.valor==='number'&&d.valor!==l[I.empenhado]){
        linhaDl(dl,'Empenhado',reais(l[I.empenhado])+' (valor original)');
        linhaDl(dl,'Anulado',reais(l[I.empenhado]-d.valor));
        linhaDl(dl,'Valor atual',reais(d.valor));
      } else linhaDl(dl,'Empenhado',reais(l[I.empenhado]));
      linhaDl(dl,'Liquidado',reais(l[I.liquidado]));
      linhaDl(dl,'Pago',reais(l[I.pago])+(l[I.pagoRestos]?', dos quais '+reais(l[I.pagoRestos])+' em anos seguintes (restos a pagar)':''));
      if(c){linhaDl(dl,'Órgão',c.orgao.nome);linhaDl(dl,'Unidade',c.unidade.nome);linhaDl(dl,'Função',c.funcao.nome+' › '+c.subfuncao.nome);
        linhaDl(dl,'Conta',c.conta+' — '+c.descricao);linhaDl(dl,'Recurso',c.recurso.codigo+' - '+c.recurso.nome);}
      if(d.licitacao) linhaDl(dl,'Licitação',d.licitacao.ano+'/'+d.licitacao.numero+' — '+d.licitacao.modalidade);
      if(d.contrato) linhaDl(dl,'Contrato',el('a',{href:d.contrato.url,target:'_blank',rel:'noopener noreferrer nofollow',texto:d.contrato.numero+'/'+d.contrato.ano+' ↗'}));
      linhaDl(dl,'Ordem de compra',d.ordemCompra);
      linhaDl(dl,'Especificação',d.especificacao||(d.api&&d.api.descricao));
      if(d.api) linhaDl(dl,'Fonte de recurso (API)',d.api.fonteRecurso);
      det.appendChild(dl);
      if(!c) det.appendChild(el('p',{class:'mun-aviso',texto:'O detalhe deste empenho ainda não foi coletado. A linha acima vem da lista oficial.'}));
      if(d.liquidacoes&&d.liquidacoes.length){det.appendChild(el('h4',{texto:'Liquidações'}));det.appendChild(tabela(['Data','Nº','Documento','Valor','Estornado'],d.liquidacoes.map(function(x){return [dataBr(x.data),x.numero,x.documento,reais(x.valor),reais(x.estornado)];})));}
      if(d.pagamentos&&d.pagamentos.length){det.appendChild(el('h4',{texto:'Pagamentos'}));det.appendChild(tabela(['Data','Liquidação','Documento','Valor','Estornado','Descontos'],d.pagamentos.map(function(x){return [dataBr(x.data),x.liquidacao,x.documento,reais(x.valor),reais(x.estornado),reais(x.descontos)];})));}
      var o=(d.origens&&(d.origens.detalhe||d.origens.lista));
      if(o){var f=el('p',{class:'mun-fonte mono'},[el('span',{class:'mun-fonte-rot',texto:'Fonte'}),' '+o.fonte+' · ',el('a',{href:o.url,target:'_blank',rel:'noopener noreferrer nofollow',texto:'ver no portal ↗'}),
        ' · coletado em '+new Date(o.coletadoEm).toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'})+' · ',el('a',{href:'/municipios/'+cidade+'/fontes/#coleta-'+o.coleta,texto:'cópia arquivada'}),' · sha256 ',el('code',{title:o.sha256,texto:o.sha256.slice(0,12)+'…'})]);det.appendChild(f);}
      det.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }
  [q,org,mod,mes,ord].forEach(function(e){e.addEventListener(e===q?'input':'change',function(){mostrar=200;aplica();});});
  mais.addEventListener('click',function(){mostrar+=200;render();});
  if(params.get('orgao')) org.value=params.get('orgao');
  if(params.get('q')) q.value=params.get('q');
  fetch(base+'indice.json').then(function(r){return r.json();}).then(function(j){
    linhas=j.linhas; orgaos=j.orgaos; aplica();
    var n=Number(params.get('n')); if(n) abrir(n);
  }).catch(function(){cont.textContent='Não foi possível carregar o índice. Baixe o CSV abaixo.';});
})();`;

export default async function PaginaEmpenhos({ params }: Props) {
  const { municipio, ano } = await params;
  const c = cidadeDe(municipio);
  const ex = exercicio(municipio, Number(ano));
  if (!c || !ex) notFound();
  const ent = c.entidades[0].id;
  const base = `/dados/municipios/${municipio}/${ent}-${ano}/`;
  const meses = ex.mensal.map((m) => m.mes.slice(5, 7));

  return (
    <>
      <Cabecalho cidade={c.nome} itens={navCidade(municipio, "empenhos", Number(ano))} />
      <main>
        <section className="mun-topo">
          <div className="wrap">
            <Trilha passos={[{ href: "/municipios/", rotulo: "Municípios" }, { href: `/municipios/${municipio}/`, rotulo: c.nome }, { href: `/municipios/${municipio}/${ano}/`, rotulo: ano }, { rotulo: "Empenhos" }]} />
            <div className="eyebrow" style={{ marginTop: 14 }}>Exercício {ano}</div>
            <h1 className="mun-h1">Todos os {inteiro(ex.totais.empenhos)} empenhos, um a um</h1>
            <p className="sec-lead">Filtre por órgão, modalidade ou mês, busque pelo credor e abra qualquer empenho para ver a classificação, a licitação, o contrato, as liquidações e os pagamentos.</p>

            <div id="exp" data-base={base} data-cidade={municipio} data-ano={ano} data-colunas={JSON.stringify(COLUNAS_INDICE)}>
              <div className="mun-filtros">
                <label>Credor, número ou documento<input id="exp-q" type="search" autoComplete="off" /></label>
                <label>Órgão
                  <select id="exp-orgao" defaultValue="">
                    <option value="">Todos</option>
                    {ex.orgaos.map((o) => <option key={o.codigo} value={o.codigo}>{o.nome}</option>)}
                  </select>
                </label>
                <label>Contratação
                  <select id="exp-mod" defaultValue="">
                    <option value="">Todas</option>
                    {ex.modalidades.map((m) => <option key={m.chave} value={m.chave}>{m.nome}</option>)}
                  </select>
                </label>
                <label>Mês
                  <select id="exp-mes" defaultValue="">
                    <option value="">Todos</option>
                    {meses.map((m) => <option key={m} value={m}>{m}/{ano}</option>)}
                  </select>
                </label>
                <label>Ordem
                  <select id="exp-ord" defaultValue="valor">
                    <option value="valor">Maior valor</option>
                    <option value="data">Mais recente</option>
                  </select>
                </label>
              </div>
              <p id="exp-cont" className="mun-contagem mono" aria-live="polite">Carregando…</p>
              <div id="exp-det" className="mun-detalhe" hidden />
              <div className="mun-tabela-rolagem">
                <table className="mun-tabela">
                  <thead><tr><th>Empenho</th><th>Data</th><th>Credor</th><th>Órgão</th><th className="num">Empenhado</th><th className="num">Pago</th></tr></thead>
                  <tbody id="exp-corpo" />
                </table>
              </div>
              <button id="exp-mais" type="button" className="mun-botao" hidden style={{ marginTop: 14 }}>Mostrar mais 200</button>
              <noscript><p className="mun-aviso">O explorador precisa de JavaScript. Os mesmos dados estão no CSV e no JSON abaixo.</p></noscript>
            </div>
            {ex.origem ? <Fonte origem={ex.origem} cidade={municipio} comoLer="empenho" /> : null}
            <div className="dados-bloco">
              <div className="dados-links">
                <a href={`${base}empenhos-${ent}-${ano}.csv`} download className="dados-link">CSV ↓</a>
                <a href={`${base}empenhos-${ent}-${ano}.json`} download className="dados-link">JSON ↓</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
    </>
  );
}
