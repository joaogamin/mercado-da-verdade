import Selo from "@/components/Selo";
import { Rico } from "@/i18n/rich";
import type { EmOrdem, Sinal } from "@pipeline/analise/sinais.ts";
import { inteiro, pct, reaisCurto } from "../formato";

export type ItemNav = { href: string; rotulo: string; atual?: boolean };

/** Cabecalho do projeto: mesma marca e as mesmas classes do Mercado, menu proprio. */
export function Cabecalho({ itens, cidade }: { itens: ItemNav[]; cidade?: string }) {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--deep)", color: "#fff", borderBottom: "3px solid var(--brand)" }}>
      <div className="wrap header-barra">
        <a href={cidade ? `/municipios/${cidade}/` : "/municipios/"} className="marca-header" aria-label="Mercado da Verdade · Municípios — início">
          <Selo />
          <span className="marca-txt">
            <span className="mono marca-tag">Municípios{cidade ? ` · ${cidade}` : ""}</span>
            <span className="disp marca-nome">Mercado da <span style={{ color: "var(--accent)" }}>Verdade</span></span>
          </span>
        </a>
        <nav className="nav-desk" aria-label="Menu">
          {itens.map((i) => (
            <a key={i.href} href={i.href} aria-current={i.atual ? "page" : undefined}
              className={i.atual ? "mono nav-item nav-item--atual" : "mono nav-item"}>{i.rotulo}</a>
          ))}
        </nav>
        <div className="header-acoes">
          <details className="nav-mob">
            <summary aria-label="Abrir menu" className="mono">☰</summary>
            <div>
              {itens.map((i) => (
                <a key={i.href} href={i.href} aria-current={i.atual ? "page" : undefined}
                  className={i.atual ? "mono nav-mob-item nav-mob-item--atual" : "mono nav-mob-item"}>{i.rotulo}</a>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

export function Rodape() {
  return (
    <footer className="sec--deep" style={{ padding: "40px 0 36px", borderTop: "4px solid var(--brand)" }}>
      <div className="wrap">
        <p style={{ maxWidth: "70ch", margin: 0, color: "rgba(255,255,255,.82)", fontSize: 15.5 }}>
          Os números são da prefeitura. O que fazemos é organizar e oferecer réguas justas para lê-los. Cada valor traz o link
          oficial, a data da coleta e a cópia arquivada.
        </p>
        <nav className="mun-rodape-links mono" aria-label="Sobre o projeto">
          <a href="/municipios/sobre/">Sobre</a>
          <a href="/municipios/como-ler/">Como ler</a>
          <a href="/municipios/metodologia/">Metodologia</a>
          <a href="/municipios/sinais/">Sinais</a>
          <a href="/municipios/erratas/">Erratas</a>
          <a href="https://github.com/joaogamin/mercado-da-verdade" target="_blank" rel="noopener noreferrer">Código ↗</a>
        </nav>
        <p className="mono" style={{ margin: "18px 0 0", color: "rgba(255,255,255,.5)", fontSize: 12 }}>
          Código MIT · análise CC BY 4.0 · dados públicos por lei (LAI)
        </p>
      </div>
    </footer>
  );
}

export function Trilha({ passos }: { passos: { href?: string; rotulo: string }[] }) {
  return (
    <nav aria-label="Você está em" className="mun-trilha mono">
      <ol>
        {passos.map((p, i) => (
          <li key={i}>{p.href && i < passos.length - 1 ? <a href={p.href}>{p.rotulo}</a> : <span aria-current="page">{p.rotulo}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

export function Secao({ id, eyebrow, titulo, lead, fundo, children }: {
  id?: string; eyebrow: string; titulo: string; lead?: string; fundo?: "white" | "gray"; children: React.ReactNode;
}) {
  return (
    <section id={id} className={fundo === "white" ? "sec sec--tight sec--white" : "sec sec--tight"} style={fundo === "gray" ? { background: "var(--gray)" } : undefined}>
      <div className="wrap">
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="mun-h2">{titulo}</h2>
        {lead ? <p className="sec-lead"><Rico t={lead} /></p> : null}
        {children}
      </div>
    </section>
  );
}

/** Enquanto o detalhe nao cobre tudo, as quebras por orgao/funcao sao parciais — e dizemos. */
export function AvisoCobertura({ comDetalhe, total }: { comDetalhe: number; total: number }) {
  if (total === 0 || comDetalhe >= total) return null;
  return (
    <p className="mun-aviso">
      <strong>Coleta em andamento.</strong> O detalhe (secretaria, função, licitação, pagamentos) já foi coletado para{" "}
      {inteiro(comDetalhe)} de {inteiro(total)} empenhos ({pct(comDetalhe / total)}). Os totais do topo valem para todos; as quebras
      por órgão, função e modalidade refletem só os já detalhados.
    </p>
  );
}

const ICONE = { true: "✓", false: "!", null: "?" } as const;
const ROTULO = { true: "em ordem", false: "atenção", null: "ainda não verificado" } as const;

/** Honestidade nos dois sentidos: sinais e o que esta em ordem, no mesmo nivel. */
export function SinaisEmOrdem({ sinais, emOrdem, hrefCredor }: { sinais: Sinal[]; emOrdem: EmOrdem[]; hrefCredor: (chave: string) => string | undefined }) {
  return (
    <div className="duo mun-duo">
      <div>
        <h3 className="mun-h3" style={{ color: "var(--alert)" }}>! Sinais de atenção</h3>
        <p className="mun-muted" style={{ marginTop: 0 }}>Convites a verificar, não conclusões. Cada um explica a regra e o que não prova.</p>
        <div style={{ display: "grid", gap: 2 }}>
          {sinais.every((s) => !s.itens.length) ? (
            <p className="mun-sinal" style={{ borderLeftColor: "var(--line)" }}>
              Nenhum sinal com os dados coletados até agora. Os sinais dependem do detalhe de cada empenho, que ainda está sendo coletado.
            </p>
          ) : null}
          {sinais.filter((s) => s.itens.length).map((s) => (
            <article key={s.id} className="mun-sinal">
              <h4>{s.titulo}</h4>
              <p className="mun-muted">{s.resumo}</p>
              <ul>
                {s.itens.slice(0, 3).map((i, n) => {
                  const href = i.chaveCredor ? hrefCredor(i.chaveCredor) : undefined;
                  return (
                    <li key={n}>
                      {href ? <a href={href}>{i.titulo}</a> : i.titulo}
                      {i.valor !== null ? <span className="mono"> · {reaisCurto(i.valor)}</span> : null}
                      <br /><span className="mun-muted">{i.detalhe}</span>
                    </li>
                  );
                })}
              </ul>
              <a className="mono mun-mais" href={`/municipios/sinais/#${s.id}`}>como é calculado →</a>
            </article>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mun-h3" style={{ color: "var(--green-d)" }}>✓ O que está em ordem</h3>
        <p className="mun-muted" style={{ marginTop: 0 }}>Checagem que só acha erro é propaganda com outro nome.</p>
        <div style={{ display: "grid", gap: 2 }}>
          {emOrdem.map((o) => {
            const k = String(o.ok) as "true" | "false" | "null";
            return (
              <article key={o.id} className={`mun-ordem mun-ordem--${k}`}>
                <h4><span aria-hidden="true">{ICONE[k]}</span> {o.titulo} <span className="mun-ordem-rot mono">{ROTULO[k]}</span></h4>
                <p className="mun-muted">{o.detalhe}</p>
                {o.fonte ? <p className="mono mun-ordem-fonte"><span className="mun-fonte-rot mun-fonte-rot--comp">Complementar</span> {o.fonte}</p> : null}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
