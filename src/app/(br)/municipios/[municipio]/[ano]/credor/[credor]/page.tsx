import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cidade as cidadeDe, empenhos, exercicio, paramsCredores } from "@/municipios/dados";
import { metadados } from "@/municipios/metadados";
import { AvisoCobertura, Cabecalho, Trilha } from "@/municipios/componentes/Estrutura";
import { Fonte } from "@/municipios/componentes/Fonte";
import { Barras, Indicadores } from "@/municipios/componentes/Graficos";
import { dataCurta, inteiro, pct, reais, reaisCurto } from "@/municipios/formato";
import { hrefEmpenho, hrefOrgao, navCidade } from "@/municipios/navegacao";
import { chaveCredor } from "@pipeline/analise/chaves.ts";
import { modalidade } from "@pipeline/analise/chaves.ts";

export const dynamicParams = false;

export function generateStaticParams() {
  return paramsCredores();
}

type Props = { params: Promise<{ municipio: string; ano: string; credor: string }> };

const LIMITE = 300;

const linkPortal = (o?: { url: string }) => (o ? <a href={o.url} target="_blank" rel="noopener noreferrer nofollow">ver ↗</a> : "—");

function dados(municipio: string, ano: string, slugCredor: string) {
  const c = cidadeDe(municipio);
  const ex = exercicio(municipio, Number(ano));
  const cr = ex?.credores.find((x) => x.slug === slugCredor);
  return c && ex && cr ? { c, ex, cr } : null;
}

const TIPO: Record<string, string> = { PJ: "Pessoa jurídica", PF: "Pessoa física (CPF mascarado pelo portal)", folha: "Folha de pagamento", "sem-documento": "Sem documento publicado" };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { municipio, ano, credor } = await params;
  const d = dados(municipio, ano, credor);
  return metadados(`${d?.cr.nome} · ${d?.c.nome} ${ano}`, `O que ${d?.cr.nome} recebeu da Prefeitura de ${d?.c.nome} em ${ano}.`, `/municipios/${municipio}/${ano}/credor/${credor}/`);
}

export default async function PaginaCredor({ params }: Props) {
  const { municipio, ano, credor } = await params;
  const d = dados(municipio, ano, credor);
  if (!d) notFound();
  const { c, ex, cr } = d;
  const lista = empenhos(municipio, Number(ano))
    .filter((e) => chaveCredor(e) === cr.chave)
    .sort((a, b) => b.data.localeCompare(a.data) || b.numero - a.numero);
  const ativos = lista.filter((e) => !e.removidoEm);
  const origem = lista.map((e) => e.origens.lista).find((o) => !!o) ?? ex.origem;
  const orgaos = ex.orgaos.filter((o) => cr.orgaos.includes(o.codigo));
  const doCredorPorOrgao = orgaos.map((o) => {
    const v = ativos.filter((e) => e.detalhe && String(Number(e.detalhe.classificacao.orgao.codigo)) === o.codigo).reduce((s, e) => s + e.empenhado, 0);
    return { chave: o.codigo, nome: o.nome, empenhado: v, participacao: cr.empenhado ? v / cr.empenhado : 0 };
  }).sort((a, b) => b.empenhado - a.empenhado);
  const comDetalhe = ativos.filter((e) => e.detalhe).length;

  return (
    <>
      <Cabecalho cidade={c.nome} itens={navCidade(municipio, "credores", Number(ano))} />
      <main>
        <section className="mun-topo">
          <div className="wrap">
            <Trilha passos={[
              { href: "/municipios/", rotulo: "Municípios" }, { href: `/municipios/${municipio}/`, rotulo: c.nome },
              { href: `/municipios/${municipio}/${ano}/credores/`, rotulo: `Credores ${ano}` }, { rotulo: cr.nome },
            ]} />
            <div className="eyebrow" style={{ marginTop: 14 }}>{TIPO[cr.tipo] ?? cr.tipo}{cr.documento ? ` · ${cr.documento}` : ""}</div>
            <h1 className="mun-h1">{cr.nome}</h1>
            <p className="mun-heroi">{reaisCurto(cr.empenhado)}</p>
            <p className="mun-heroi-rot">
              empenhados em {inteiro(cr.empenhos)} empenhos de {dataCurta(cr.primeiro)} a {dataCurta(cr.ultimo)}: {pct(cr.participacao, 2)} de tudo
              o que a prefeitura empenhou em {ano}. Valor exato: {reais(cr.empenhado)}.
            </p>
            <Indicadores itens={[
              { rotulo: "Liquidado", valor: reaisCurto(cr.liquidado), detalhe: `${pct(cr.empenhado ? cr.liquidado / cr.empenhado : 0)} do empenhado` },
              { rotulo: "Pago", valor: reaisCurto(cr.pago), detalhe: `${pct(cr.empenhado ? cr.pago / cr.empenhado : 0)} do empenhado` },
              { rotulo: "Órgãos", valor: inteiro(cr.orgaos.length), detalhe: "que contrataram este credor" },
            ]} />
            <AvisoCobertura comDetalhe={comDetalhe} total={ativos.length} />
            {origem ? <Fonte origem={origem} cidade={municipio} comoLer="empenho" /> : null}
          </div>
        </section>

        {doCredorPorOrgao.length ? (
          <section className="sec sec--tight">
            <div className="wrap">
              <div className="eyebrow">Quem contratou</div>
              <h2 className="mun-h2">Por órgão</h2>
              <Barras rotuloLista="Empenhado para este credor, por órgão" itens={doCredorPorOrgao} href={(i) => hrefOrgao(municipio, Number(ano), i.chave)} />
            </div>
          </section>
        ) : null}

        <section className="sec sec--tight sec--white">
          <div className="wrap">
            <div className="eyebrow">Um a um</div>
            <h2 className="mun-h2">Os empenhos</h2>
            <p className="sec-lead">
              Cada linha abre o detalhe (classificação, licitação, contrato, liquidações e pagamentos) e tem o link para a página oficial.
              {lista.length > LIMITE ? ` Aqui aparecem os ${LIMITE} mais recentes de ${inteiro(lista.length)}; todos estão no explorador e no CSV.` : ""}
            </p>
            <div className="mun-tabela-rolagem">
              <table className="mun-tabela">
                <thead>
                  <tr><th>Empenho</th><th>Data</th><th>Órgão</th><th>O quê</th><th>Contratação</th><th className="num">Empenhado</th><th className="num">Pago</th><th>Portal</th></tr>
                </thead>
                <tbody>
                  {lista.slice(0, LIMITE).map((e) => (
                    <tr key={e.id}>
                      <td><a href={hrefEmpenho(municipio, e.ano, e.numero)}>{e.ano}/{e.numero}</a>{e.removidoEm ? <><br /><span className="mun-removido">removido do portal em {dataCurta(e.removidoEm)}</span></> : null}</td>
                      <td>{dataCurta(e.data)}</td>
                      <td>{e.detalhe?.classificacao.orgao.nome ?? "—"}</td>
                      <td>{(e.detalhe?.especificacao ?? e.api?.descricao ?? "—").slice(0, 140)}{(e.detalhe?.especificacao ?? "").length > 140 ? "…" : ""}</td>
                      <td>{modalidade(e).nome}</td>
                      <td className="num">{reais(e.empenhado)}</td>
                      <td className="num">{reais(e.pago)}</td>
                      <td>{linkPortal(e.origens.detalhe ?? e.origens.lista)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ margin: "16px 0 0" }}>
              <a className="mono" href={`/municipios/${municipio}/${ano}/empenhos/?credor=${cr.slug}`} style={{ color: "var(--ink)", display: "inline-block", padding: "12px 0" }}>
                Abrir no explorador →
              </a>
            </p>
            {origem ? <Fonte origem={origem} cidade={municipio} comoLer="empenho" /> : null}
          </div>
        </section>
      </main>
    </>
  );
}
