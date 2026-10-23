import { Rico } from "@/i18n/rich";
import { Cabecalho, Trilha } from "../componentes/Estrutura";
import { navProjeto, type PaginaProjeto } from "../navegacao";
import type { PaginaTexto } from "../textos";

/** Pagina de transparencia: cabe em uma tela, aprofundamento em <details>. */
export default function Texto({ pagina, atual, children }: { pagina: PaginaTexto; atual: PaginaProjeto; children?: React.ReactNode }) {
  return (
    <>
      <Cabecalho itens={navProjeto(atual)} />
      <main>
        <section className="mun-topo">
          <div className="wrap">
            <Trilha passos={[{ href: "/municipios/", rotulo: "Municípios" }, { rotulo: pagina.titulo }]} />
            <h1 className="mun-h1" style={{ marginTop: 14 }}>{pagina.titulo}</h1>
            <p className="sec-lead"><Rico t={pagina.lead} /></p>
          </div>
        </section>
        <section className="sec sec--tight">
          <div className="wrap mun-texto">
            {pagina.blocos.map((b) => (
              <div key={b.titulo} id={b.id}>
                <h2>{b.titulo}</h2>
                <p><Rico t={b.texto} /></p>
                {b.mais ? <details><summary>Saiba mais</summary><p><Rico t={b.mais} /></p></details> : null}
              </div>
            ))}
            {children}
          </div>
        </section>
      </main>
    </>
  );
}
