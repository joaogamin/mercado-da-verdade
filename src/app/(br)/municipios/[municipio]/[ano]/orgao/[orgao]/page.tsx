import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cidade as cidadeDe, exercicio, paramsOrgaos } from "@/municipios/dados";
import { metadados } from "@/municipios/metadados";
import { AvisoCobertura, Cabecalho, Secao, Trilha } from "@/municipios/componentes/Estrutura";
import { Fonte } from "@/municipios/componentes/Fonte";
import { Barras, Indicadores, Mensal } from "@/municipios/componentes/Graficos";
import { inteiro, pct, reais, reaisCurto } from "@/municipios/formato";
import { hrefCredor, navCidade } from "@/municipios/navegacao";

export const dynamicParams = false;

export function generateStaticParams() {
  return paramsOrgaos();
}

type Props = { params: Promise<{ municipio: string; ano: string; orgao: string }> };

function dados(municipio: string, ano: string, orgao: string) {
  const c = cidadeDe(municipio);
  const ex = exercicio(municipio, Number(ano));
  const o = ex?.orgaos.find((x) => x.codigo === orgao);
  return c && ex && o ? { c, ex, o } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { municipio, ano, orgao } = await params;
  const d = dados(municipio, ano, orgao);
  return metadados(`${d?.o.nome} · ${d?.c.nome} ${ano}`, `Em que a ${d?.o.nome} gastou em ${ano}, com quem e como contratou.`, `/municipios/${municipio}/${ano}/orgao/${orgao}/`);
}

export default async function PaginaOrgao({ params }: Props) {
  const { municipio, ano, orgao } = await params;
  const d = dados(municipio, ano, orgao);
  if (!d) notFound();
  const { c, ex, o } = d;
  const origem = ex.origem;
  const fonte = origem ? <Fonte origem={origem} cidade={municipio} comoLer="empenho" /> : null;

  return (
    <>
      <Cabecalho cidade={c.nome} itens={navCidade(municipio, "visao", Number(ano))} />
      <main>
        <section className="mun-topo">
          <div className="wrap">
            <Trilha passos={[
              { href: "/municipios/", rotulo: "Municípios" }, { href: `/municipios/${municipio}/`, rotulo: c.nome },
              { href: `/municipios/${municipio}/${ano}/#orgaos`, rotulo: ano }, { rotulo: o.nome },
            ]} />
            <div className="eyebrow" style={{ marginTop: 14 }}>Órgão {o.codigo} · exercício {ano}</div>
            <h1 className="mun-h1">{o.nome}</h1>
            <p className="mun-heroi">{reaisCurto(o.empenhado)}</p>
            <p className="mun-heroi-rot">
              empenhados em {inteiro(o.empenhos)} empenhos: {pct(o.participacao)} de tudo o que a prefeitura empenhou em {ano}. Valor exato: {reais(o.empenhado)}.
            </p>
            <Indicadores itens={[
              { rotulo: "Liquidado", valor: reaisCurto(o.liquidado), detalhe: `${pct(o.empenhado ? o.liquidado / o.empenhado : 0)} do empenhado` },
              { rotulo: "Pago", valor: reaisCurto(o.pago), detalhe: `${pct(o.empenhado ? o.pago / o.empenhado : 0)} do empenhado` },
              { rotulo: "Credores", valor: inteiro(o.credores.length >= 50 ? ex.credores.filter((x) => x.orgaos.includes(o.codigo)).length : o.credores.length), detalhe: "que receberam deste órgão" },
            ]} />
            <AvisoCobertura comDetalhe={ex.totais.comDetalhe} total={ex.totais.empenhos} />
            <p style={{ margin: "18px 0 0" }}>
              <a className="mono" href={`/municipios/${municipio}/${ano}/empenhos/?orgao=${o.codigo}`} style={{ color: "var(--ink)", display: "inline-block", padding: "12px 0" }}>
                Ver todos os empenhos deste órgão →
              </a>
            </p>
            {fonte}
          </div>
        </section>

        <Secao eyebrow="Em quê" titulo="O que foi comprado ou contratado"
          lead="Pela descrição que a própria prefeitura dá a cada conta de despesa.">
          <Barras rotuloLista="Empenhado por tipo de despesa" itens={o.subelementos.map((s) => ({ ...s, nome: `${s.nome} (${s.chave})` }))} limite={15} />
          {fonte}
        </Secao>

        <Secao eyebrow="Quem recebe" titulo="Credores deste órgão" fundo="white">
          <Barras rotuloLista="Empenhado por credor" itens={o.credores} limite={20} href={(i) => (i.slug ? hrefCredor(municipio, Number(ano), i.slug) : undefined)} />
          {fonte}
        </Secao>

        <Secao eyebrow="Como foi contratado" titulo="Por modalidade">
          <Barras rotuloLista="Empenhado por modalidade" itens={o.modalidades} limite={12} />
          {fonte}
        </Secao>

        <Secao eyebrow="Para quê" titulo="Por função" fundo="white">
          <Barras rotuloLista="Empenhado por função" itens={o.funcoes} limite={12} />
          {fonte}
        </Secao>

        <Secao eyebrow="Ao longo do ano" titulo="Mês a mês">
          <Mensal serie={o.mensal} rotulo={`Empenhado por mês por ${o.nome}`} />
          {fonte}
        </Secao>
      </main>
    </>
  );
}
