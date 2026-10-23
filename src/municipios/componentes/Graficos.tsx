// Graficos em HTML/CSS puro, sem JS: uma serie so (sem legenda), barra fina
// com ponta arredondada e base reta, trilho no tom claro da mesma cor, texto
// sempre na cor de texto (nunca na cor do dado). Valores impressos em todas as
// barras porque a lista e a forma principal de leitura — e tambem a tabela.
import { mesCurto, pct, reais, reaisCurto } from "../formato";

export type ItemBarra = { chave: string; nome: string; empenhado: number; participacao: number; empenhos?: number; nota?: string; slug?: string };

export function Barras({ itens, href, limite = 10, rotuloLista }: {
  itens: ItemBarra[];
  href?: (i: ItemBarra) => string | undefined;
  limite?: number;
  rotuloLista: string;
}) {
  const mostrados = itens.slice(0, limite);
  const max = Math.max(...mostrados.map((i) => i.empenhado), 1);
  const resto = itens.slice(limite);
  const somaResto = resto.reduce((s, i) => s + i.empenhado, 0);
  return (
    <>
      <ol className="mun-barras" aria-label={rotuloLista}>
        {mostrados.map((i) => {
          const link = href?.(i);
          const nome = <span className="mun-barra-nome">{i.nome}</span>;
          return (
            <li key={i.chave} className="mun-barra">
              {link ? <a href={link} className="mun-barra-link">{nome}</a> : <span className="mun-barra-link">{nome}</span>}
              <span className="mun-barra-linha">
                <span className="mun-barra-trilho" aria-hidden="true">
                  <span className="mun-barra-fill" style={{ width: `${Math.max((i.empenhado / max) * 100, 0.6)}%` }} />
                </span>
                <span className="mun-barra-num mono" title={reais(i.empenhado)}>
                  {reaisCurto(i.empenhado)} <span className="mun-muted">· {pct(i.participacao)}</span>
                </span>
              </span>
              {i.nota ? <span className="mun-barra-nota mono">{i.nota}</span> : null}
            </li>
          );
        })}
      </ol>
      {resto.length ? (
        <p className="mun-resto mono">
          + {resto.length} outros, que somam {reaisCurto(somaResto)}
        </p>
      ) : null}
    </>
  );
}

export type Indicador = { rotulo: string; valor: string; detalhe?: string };

export function Indicadores({ itens }: { itens: Indicador[] }) {
  return (
    <div className="mun-kpis">
      {itens.map((k) => (
        <div key={k.rotulo} className="mun-kpi">
          <div className="mun-kpi-rot mono">{k.rotulo}</div>
          <div className="mun-kpi-val">{k.valor}</div>
          {k.detalhe ? <div className="mun-kpi-det">{k.detalhe}</div> : null}
        </div>
      ))}
    </div>
  );
}

/** Colunas por mes do empenhado. O maior mes leva o rotulo; a tabela leva todos. */
export function Mensal({ serie, rotulo }: { serie: { mes: string; empenhado: number; pago: number }[]; rotulo: string }) {
  if (!serie.length) return null;
  const max = Math.max(...serie.map((s) => s.empenhado), 1);
  const pico = serie.reduce((a, b) => (b.empenhado > a.empenhado ? b : a));
  return (
    <figure className="mun-mensal">
      <div className="mun-mensal-colunas" role="img" aria-label={`${rotulo}. O maior mês foi ${mesCurto(pico.mes)}, com ${reaisCurto(pico.empenhado)}.`}>
        {serie.map((s) => (
          <div key={s.mes} className="mun-mensal-col" title={`${mesCurto(s.mes)}: ${reais(s.empenhado)} empenhado`}>
            <span className="mun-mensal-num mono">{s.mes === pico.mes ? reaisCurto(s.empenhado) : ""}</span>
            <span className="mun-mensal-barra" style={{ height: `${Math.max((s.empenhado / max) * 100, 1)}%` }} />
            <span className="mun-mensal-mes mono">{mesCurto(s.mes)}</span>
          </div>
        ))}
      </div>
      <details className="mun-tabela-det">
        <summary className="mono">ver em tabela</summary>
        <table className="mun-tabela">
          <thead><tr><th>Mês</th><th>Empenhado</th><th>Pago no mês</th></tr></thead>
          <tbody>
            {serie.map((s) => <tr key={s.mes}><td>{s.mes}</td><td>{reais(s.empenhado)}</td><td>{reais(s.pago)}</td></tr>)}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
