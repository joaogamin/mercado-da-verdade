import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cidade as cidadeDe, exercicio, paramsAnos } from "@/municipios/dados";
import { metadados } from "@/municipios/metadados";
import { Cabecalho, Trilha } from "@/municipios/componentes/Estrutura";
import { Fonte } from "@/municipios/componentes/Fonte";
import { inteiro, pct, reais } from "@/municipios/formato";
import { hrefCredor, navCidade } from "@/municipios/navegacao";

export const dynamicParams = false;

export function generateStaticParams() {
  return paramsAnos();
}

type Props = { params: Promise<{ municipio: string; ano: string }> };

const TIPO: Record<string, string> = { PJ: "PJ", PF: "PF", folha: "Folha", "sem-documento": "—" };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { municipio, ano } = await params;
  const c = cidadeDe(municipio);
  return metadados(`Quem recebe da Prefeitura de ${c?.nome} em ${ano}`, `Todos os credores da Prefeitura de ${c?.nome} em ${ano}, do maior ao menor.`, `/municipios/${municipio}/${ano}/credores/`);
}

export default async function PaginaCredores({ params }: Props) {
  const { municipio, ano } = await params;
  const c = cidadeDe(municipio);
  const ex = exercicio(municipio, Number(ano));
  if (!c || !ex) notFound();

  return (
    <>
      <Cabecalho cidade={c.nome} itens={navCidade(municipio, "credores", Number(ano))} />
      <main>
        <section className="mun-topo">
          <div className="wrap">
            <Trilha passos={[{ href: "/municipios/", rotulo: "Municípios" }, { href: `/municipios/${municipio}/`, rotulo: c.nome }, { href: `/municipios/${municipio}/${ano}/`, rotulo: ano }, { rotulo: "Credores" }]} />
            <div className="eyebrow" style={{ marginTop: 14 }}>Exercício {ano}</div>
            <h1 className="mun-h1">Quem recebe: todos os {inteiro(ex.credores.length)} credores</h1>
            <p className="sec-lead">
              Do maior ao menor, sem corte. Pessoas físicas aparecem como o portal publica, com o CPF mascarado; quando o nome
              de um MEI traz o CPF do titular, mascaramos no mesmo padrão.
            </p>
            {ex.origem ? <Fonte origem={ex.origem} cidade={municipio} comoLer="credor" /> : null}
          </div>
        </section>
        <section className="sec sec--tight">
          <div className="wrap">
            <div className="mun-tabela-rolagem">
              <table className="mun-tabela">
                <thead>
                  <tr><th>#</th><th>Credor</th><th>Tipo</th><th>Documento</th><th className="num">Empenhos</th><th className="num">Empenhado</th><th className="num">Pago</th><th className="num">% do total</th></tr>
                </thead>
                <tbody>
                  {ex.credores.map((cr, i) => (
                    <tr key={cr.chave}>
                      <td className="num">{i + 1}</td>
                      <td><a href={hrefCredor(municipio, Number(ano), cr.slug)}>{cr.nome}</a></td>
                      <td>{TIPO[cr.tipo] ?? cr.tipo}</td>
                      <td className="mono" style={{ fontSize: 12 }}>{cr.documento || "—"}</td>
                      <td className="num">{inteiro(cr.empenhos)}</td>
                      <td className="num">{reais(cr.empenhado)}</td>
                      <td className="num">{reais(cr.pago)}</td>
                      <td className="num">{pct(cr.participacao, 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {ex.origem ? <Fonte origem={ex.origem} cidade={municipio} comoLer="credor" /> : null}
          </div>
        </section>
      </main>
    </>
  );
}
