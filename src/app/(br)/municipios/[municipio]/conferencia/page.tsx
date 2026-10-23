import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cidade as cidadeDe, cidadesComDados, conferencia } from "@/municipios/dados";
import { metadados } from "@/municipios/metadados";
import { Cabecalho, Trilha } from "@/municipios/componentes/Estrutura";
import { Fonte } from "@/municipios/componentes/Fonte";
import { inteiro, pct, reais } from "@/municipios/formato";
import { navCidade } from "@/municipios/navegacao";

export const dynamicParams = false;

export function generateStaticParams() {
  return cidadesComDados().map((c) => ({ municipio: c.slug }));
}

type Props = { params: Promise<{ municipio: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { municipio } = await params;
  const c = cidadeDe(municipio);
  return metadados(`Dá para confiar nos números de ${c?.nome}?`, `Nossa soma contra o balancete oficial da prefeitura, órgão por órgão.`, `/municipios/${municipio}/conferencia/`);
}

const dif = (v: number | null) => (v === null ? "—" : `${v > 0 ? "+" : ""}${v.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`);

export default async function PaginaConferencia({ params }: Props) {
  const { municipio } = await params;
  const c = cidadeDe(municipio);
  const conf = conferencia(municipio);
  if (!c) notFound();

  return (
    <>
      <Cabecalho cidade={c.nome} itens={navCidade(municipio, "conferencia")} />
      <main>
        <section className="mun-topo">
          <div className="wrap">
            <Trilha passos={[{ href: "/municipios/", rotulo: "Municípios" }, { href: `/municipios/${municipio}/`, rotulo: c.nome }, { rotulo: "Conferência" }]} />
            <h1 className="mun-h1" style={{ marginTop: 14 }}>Dá para confiar?</h1>
            <p className="sec-lead">
              Somamos, um a um, os empenhos que coletamos e comparamos com o balancete que a própria prefeitura publica.
              Se a soma não bate, a coleta não é publicada sem revisão humana. As contradições do próprio portal ficam registradas aqui.
            </p>
          </div>
        </section>

        {(conf?.exercicios ?? []).map((x) => (
          <section key={`${x.entidade}-${x.ano}`} className="sec sec--tight">
            <div className="wrap">
              <div className="eyebrow">Exercício {x.ano}</div>
              <h2 className="mun-h2">
                {x.diferencaPct === null
                  ? "Ainda sem balancete para comparar"
                  : Math.abs(x.diferencaPct) < 0.005 ? "O pago confere ao centavo com o balancete" : `O pago difere ${dif(x.diferencaPct)} do balancete`}
              </h2>
              <p className="sec-lead">
                A lista de empenhos e o balancete são duas telas do mesmo portal, e medem coisas um pouco diferentes. Cada linha abaixo diz
                o que é comparável e por quê.{x.emCurso ? " Exercício em curso: os números mudam a cada dia." : ""}
              </p>
              <div className="mun-tabela-rolagem">
                <table className="mun-tabela">
                  <thead><tr><th>Medida</th><th className="num">Nossa soma</th><th className="num">Balancete do portal</th><th className="num">Diferença</th><th>Por quê</th></tr></thead>
                  <tbody>
                    {x.comparacoes.map((c) => (
                      <tr key={c.id}>
                        <td><strong>{c.rotulo}</strong>{c.comparavel ? null : <><br /><span className="mun-muted">informativo</span></>}</td>
                        <td className="num">{reais(c.nosso)}</td>
                        <td className="num">{reais(c.oficial)}</td>
                        <td className="num">{dif(c.diferencaPct)}</td>
                        <td style={{ minWidth: 240 }}>{c.explicacao}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mun-muted" style={{ fontSize: 14.5 }}>
                {inteiro(x.nosso.empenhos)} empenhos na base{x.nosso.removidos ? `, mais ${inteiro(x.nosso.removidos)} removidos do portal (fora da soma)` : ""}.
                Detalhe coletado para {inteiro(x.cobertura.comDetalhe)} ({pct(x.cobertura.pct / 100)}).
              </p>

              {x.qualidade.length ? (
                <div className="mun-aviso">
                  <strong>Inconsistências do próprio portal</strong>
                  <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>{x.qualidade.map((q) => <li key={q}>{q}</li>)}</ul>
                </div>
              ) : null}

              {x.orgaos.length ? (
                <details className="mun-tabela-det" open={x.cobertura.pct >= 100}>
                  <summary className="mono">órgão por órgão{x.cobertura.pct < 100 ? " (parcial: o detalhe ainda não cobre todos os empenhos)" : ""}</summary>
                  <div className="mun-tabela-rolagem">
                    <table className="mun-tabela">
                      <thead><tr><th>Órgão</th><th className="num">Dotação atualizada</th><th className="num">Pago no exercício (portal)</th><th className="num">Nossa soma</th><th className="num">Diferença</th></tr></thead>
                      <tbody>
                        {x.orgaos.map((o) => (
                          <tr key={o.codigo}>
                            <td>{o.nome}</td>
                            <td className="num">{reais(o.oficial.dotacaoAtualizada)}</td>
                            <td className="num">{reais(o.oficial.pago)}</td>
                            <td className="num">{reais(o.nosso.pagoNoExercicio)}</td>
                            <td className="num">{dif(o.diferencaPct)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              ) : null}
              {x.oficial ? <Fonte origem={x.oficial.origem} cidade={municipio} comoLer="dotacao" /> : null}
            </div>
          </section>
        ))}

        {conf?.divergenciasPortal.length ? (
          <section className="sec sec--tight sec--white">
            <div className="wrap mun-texto">
              <h2 style={{ marginTop: 0 }}>Quando o portal contradiz o próprio portal</h2>
              <p>Em algumas listas, o “Total Geral” que o portal mostra no rodapé não é a soma das linhas que ele mesmo exibe. Registramos sem corrigir:</p>
              <ul>{conf.divergenciasPortal.slice(0, 30).map((d) => <li key={d} className="mono" style={{ fontSize: 13 }}>{d}</li>)}</ul>
              {conf.divergenciasPortal.length > 30 ? <p>… e mais {inteiro(conf.divergenciasPortal.length - 30)}.</p> : null}
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}
