import type { Metadata } from "next";
import { anos, cidadesComDados, exercicio } from "@/municipios/dados";
import { metadados } from "@/municipios/metadados";
import { Cabecalho } from "@/municipios/componentes/Estrutura";
import { navProjeto } from "@/municipios/navegacao";
import { inteiro, reaisCurto } from "@/municipios/formato";

export const metadata: Metadata = metadados("Municípios · Mercado da Verdade", "Os gastos das prefeituras, com a fonte oficial de cada número.", "/municipios/");

export default function PaginaMunicipios() {
  const cidades = cidadesComDados();
  return (
    <>
      <Cabecalho itens={navProjeto()} />
      <main>
        <section className="mun-topo">
          <div className="wrap">
            <div className="eyebrow">Municípios</div>
            <h1 className="mun-h1">Para onde vai o dinheiro da sua cidade</h1>
            <p className="sec-lead">
              Os números são da prefeitura. Nós organizamos, conferimos com o balancete oficial e mostramos com réguas justas.
              Cada valor traz o link oficial, a data da coleta e a cópia arquivada.
            </p>
          </div>
        </section>
        <section className="sec sec--tight">
          <div className="wrap">
            <ol className="mun-barras">
              {cidades.map((c) => {
                const ano = anos(c.slug)[0];
                const ex = exercicio(c.slug, ano);
                return (
                  <li key={c.slug} className="mun-barra">
                    <a className="mun-barra-link" href={`/municipios/${c.slug}/`}><span className="mun-barra-nome">{c.nome} ({c.uf})</span></a>
                    {ex ? <span className="mun-barra-nota mono">{ano}: {reaisCurto(ex.totais.empenhado)} em {inteiro(ex.totais.empenhos)} empenhos</span> : null}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </main>
    </>
  );
}
