import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cidade as cidadeDe, cidadesComDados, coletas, eventos } from "@/municipios/dados";
import { metadados } from "@/municipios/metadados";
import { Cabecalho, Trilha } from "@/municipios/componentes/Estrutura";
import { dataCurta, dataHora, inteiro } from "@/municipios/formato";
import { hrefEmpenho, navCidade } from "@/municipios/navegacao";

export const dynamicParams = false;

export function generateStaticParams() {
  return cidadesComDados().map((c) => ({ municipio: c.slug }));
}

type Props = { params: Promise<{ municipio: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { municipio } = await params;
  const c = cidadeDe(municipio);
  return metadados(`O que mudou no portal de ${c?.nome}`, `Empenhos removidos, alterados ou que reapareceram no portal da prefeitura.`, `/municipios/${municipio}/alteracoes/`);
}

const TIPO = { removido: "Removido do portal", alterado: "Alterado", reaparecido: "Reapareceu", novo: "Novo" } as const;
const mostrar = (v: unknown) => (v === undefined ? "—" : typeof v === "string" ? v : JSON.stringify(v));

export default async function PaginaAlteracoes({ params }: Props) {
  const { municipio } = await params;
  const c = cidadeDe(municipio);
  if (!c) notFound();
  const ev = eventos(municipio).filter((e) => e.tipo !== "novo").reverse();
  const novos = coletas(municipio).reduce((n, c) => n + Number(c.estado?.etapas.comparar.resumo?.novos ?? 0), 0);
  const primeira = coletas(municipio).at(-1);

  return (
    <>
      <Cabecalho cidade={c.nome} itens={navCidade(municipio, "alteracoes")} />
      <main>
        <section className="mun-topo">
          <div className="wrap">
            <Trilha passos={[{ href: "/municipios/", rotulo: "Municípios" }, { href: `/municipios/${municipio}/`, rotulo: c.nome }, { rotulo: "Alterações" }]} />
            <h1 className="mun-h1" style={{ marginTop: 14 }}>A prefeitura mudou algo?</h1>
            <p className="sec-lead">
              A cada coleta, comparamos o portal com o que já tínhamos. Nada é apagado daqui: um empenho que some do portal continua
              no site com a data da remoção, e a cópia arquivada continua disponível.
            </p>
          </div>
        </section>
        <section className="sec sec--tight">
          <div className="wrap">
            {ev.length === 0 ? (
              <p className="mun-texto">
                Nenhuma remoção ou alteração detectada{primeira?.estado ? ` desde a primeira coleta, em ${dataHora(primeira.estado.iniciadoEm)}` : ""}.
                {novos ? ` Desde então, ${inteiro(novos)} empenhos novos apareceram.` : ""}
              </p>
            ) : (
              <div className="mun-tabela-rolagem">
                <table className="mun-tabela">
                  <thead><tr><th>Quando</th><th>Empenho</th><th>O que aconteceu</th><th>Campo</th><th>Antes</th><th>Depois</th></tr></thead>
                  <tbody>
                    {ev.map((e, i) => {
                      const [, , ano, numero] = /^(.*)-(\d{4})-(\d+)$/.exec(e.id) ?? [];
                      return (
                        <tr key={i}>
                          <td>{dataCurta(e.em)}</td>
                          <td><a href={hrefEmpenho(municipio, Number(ano), Number(numero))}>{ano}/{numero}</a></td>
                          <td>{TIPO[e.tipo]}</td>
                          <td>{e.campo ?? "—"}</td>
                          <td>{mostrar(e.antes).slice(0, 120)}</td>
                          <td>{mostrar(e.depois).slice(0, 120)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <p className="mun-fonte mono">
              <span className="mun-fonte-rot">Fonte</span> comparação entre coletas do Portal da Transparência da Prefeitura de {c.nome} ·{" "}
              <a href={`/municipios/${municipio}/fontes/`}>registro de coletas e cópias</a>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
