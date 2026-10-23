import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cidade as cidadeDe, cidadesComDados, coletas } from "@/municipios/dados";
import { metadados } from "@/municipios/metadados";
import { Cabecalho, Trilha } from "@/municipios/componentes/Estrutura";
import { dataHora, inteiro } from "@/municipios/formato";
import { navCidade } from "@/municipios/navegacao";
import { FONTE_ELEMENTOS } from "@pipeline/analise/elementos.ts";

export const dynamicParams = false;

export function generateStaticParams() {
  return cidadesComDados().map((c) => ({ municipio: c.slug }));
}

type Props = { params: Promise<{ municipio: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { municipio } = await params;
  const c = cidadeDe(municipio);
  return metadados(`De onde vêm os dados de ${c?.nome}`, `Cada fonte, cada coleta e como conferir você mesmo.`, `/municipios/${municipio}/fontes/`);
}

const ROTULO_TIPO: Record<string, string> = {
  "lista-empenhos": "listas de empenhos (CSV)",
  "pesquisa-lista-empenhos": "pesquisas da lista",
  "detalhe-empenho": "detalhes de empenho",
  "pagina-empenho": "páginas de empenho",
  "api-empenhos": "respostas da API",
  "balancete-orgaos": "balancetes por órgão (CSV)",
  "pesquisa-balancete-orgaos": "pesquisas do balancete",
};

export default async function PaginaFontes({ params }: Props) {
  const { municipio } = await params;
  const c = cidadeDe(municipio);
  if (!c) notFound();
  const b = `${c.fonte.base}${c.fonte.contexto}/publico`;
  const lista = coletas(municipio);

  return (
    <>
      <Cabecalho cidade={c.nome} itens={navCidade(municipio, "fontes")} />
      <main>
        <section className="mun-topo">
          <div className="wrap">
            <Trilha passos={[{ href: "/municipios/", rotulo: "Municípios" }, { href: `/municipios/${municipio}/`, rotulo: c.nome }, { rotulo: "Fontes" }]} />
            <h1 className="mun-h1" style={{ marginTop: 14 }}>De onde veio, exatamente?</h1>
            <p className="sec-lead">Todo número deste site vem do Portal da Transparência da Prefeitura de {c.nome}. Abaixo estão as páginas oficiais, cada coleta que fizemos e como você confere sem precisar confiar em nós.</p>
          </div>
        </section>

        <section className="sec sec--tight">
          <div className="wrap mun-texto">
            <h2>Fontes da prefeitura</h2>
            <div className="mun-tabela-rolagem">
              <table className="mun-tabela">
                <thead><tr><th>Página oficial</th><th>O que entrega</th><th>Quando coletamos</th></tr></thead>
                <tbody>
                  <tr><td><a href={`${b}/despesasPorEmpenho.xhtml`} target="_blank" rel="noopener noreferrer nofollow">Despesas por empenho ↗</a></td><td>A lista de empenhos de cada mês: credor, data, empenhado, liquidado e pago (exportação CSV)</td><td>Todo dia, os dois últimos exercícios</td></tr>
                  <tr><td><a href={`${b}/listaempenhos.xhtml?tipoFil=EMPENHO&anoBal=2025&empresa=1&numEmpenho=3600`} target="_blank" rel="noopener noreferrer nofollow">Detalhe do empenho ↗</a></td><td>Secretaria, função, conta, licitação, contrato, especificação, liquidações e pagamentos</td><td>Novos ou alterados todo dia; abertos toda semana; todos uma vez por mês</td></tr>
                  <tr><td><a href={`${b}/balDespOrgao.xhtml`} target="_blank" rel="noopener noreferrer nofollow">Despesas por órgão ↗</a></td><td>O balancete oficial, que usamos para conferir a nossa soma</td><td>Todo dia</td></tr>
                  <tr><td><a href={`${b}/dadosPublicos.xhtml`} target="_blank" rel="noopener noreferrer nofollow">Dados públicos (API) ↗</a></td><td>Descrição e fonte de recurso de cada empenho. A API devolve o CPF completo de pessoas físicas, então guardamos esse arquivo só em cópia privada.</td><td>Todo dia (1 chamada por minuto, o limite da prefeitura)</td></tr>
                </tbody>
              </table>
            </div>

            <h2>Fontes complementares</h2>
            <p>Sempre com selo próprio, nunca misturadas aos números da prefeitura:</p>
            <ul>
              {c.populacao.map((p) => <li key={p.ano}><a href={p.url} target="_blank" rel="noopener noreferrer nofollow">{p.fonte} ↗</a>: população de {p.ano}, {inteiro(p.valor)} habitantes. Usada só no valor por habitante.</li>)}
              <li>{FONTE_ELEMENTOS}: nome dos elementos de despesa (a prefeitura publica o código).</li>
              <li>Decretos 12.343/2024 e 12.807/2025 (Planalto): limites de dispensa por valor, usados no sinal de fracionamento.</li>
            </ul>

            <h2>Como conferir em 3 passos</h2>
            <ol>
              <li>Baixe o <code>manifesto.json</code> de uma coleta abaixo. Ele lista cada arquivo bruto com o tamanho e o sha256.</li>
              <li>Envie o <code>manifesto.json</code> junto com o <code>manifesto.json.ots</code> em <a href="https://opentimestamps.org" target="_blank" rel="noopener noreferrer">opentimestamps.org</a>. O carimbo prova que o manifesto existia naquela data e não mudou desde então, ancorado no Bitcoin, sem depender de nós.</li>
              <li>Para um número específico, abra o link “ver no portal” ao lado dele e compare. Se a página tiver mudado ou sumido, a página de <a href={`/municipios/${municipio}/alteracoes/`}>alterações</a> registra.</li>
            </ol>
          </div>
        </section>

        <section className="sec sec--tight sec--white">
          <div className="wrap mun-texto">
            <h2 style={{ marginTop: 0 }}>Registro de coletas</h2>
            <p>Cada coleta grava tudo o que o portal respondeu, byte a byte, no formato padrão de arquivamento web (WARC). As cópias públicas vão para o GitHub, o Zenodo e o Internet Archive no pacote mensal; a resposta da API, que contém CPF completo, fica só em guarda privada imutável.</p>
            {lista.length === 0 ? <p>Nenhuma coleta registrada ainda.</p> : null}
            {lista.map((col) => (
              <details key={col.id} id={`coleta-${col.id}`} open={col === lista[0]}>
                <summary>{col.estado ? dataHora(col.estado.iniciadoEm) : col.id} · {col.estado?.escopo ?? "—"}{col.estado?.anos.length ? ` · ${col.estado.anos.join(", ")}` : ""}</summary>
                {col.manifesto ? (
                  <>
                    <p>
                      Registros: {Object.entries(col.manifesto.registros).filter(([t]) => ROTULO_TIPO[t]).map(([t, n]) => `${inteiro(n)} ${ROTULO_TIPO[t]}`).join(" · ")}
                      {col.manifesto.portalAtualizadoEm.length ? `. O portal se dizia atualizado em ${col.manifesto.portalAtualizadoEm.join(", ")}.` : "."}
                    </p>
                    <ul>
                      {col.manifesto.arquivos.map((a) => (
                        <li key={a.nome}>
                          <code>{a.nome}</code> · {inteiro(a.bytes)} bytes · sha256 <code>{a.sha256}</code> · {a.publico ? "cópia pública no pacote mensal" : `guarda privada: ${a.motivo ?? ""}`}
                        </li>
                      ))}
                    </ul>
                    <p>
                      <a href={`/dados/municipios/${municipio}/coletas/${col.id}/manifesto.json`} download>manifesto.json ↓</a>
                      {col.carimbada ? <>{" · "}<a href={`/dados/municipios/${municipio}/coletas/${col.id}/manifesto.json.ots`} download>manifesto.json.ots ↓</a> (carimbo de tempo)</> : " · carimbo pendente"}
                    </p>
                  </>
                ) : <p>Coleta sem manifesto (ainda em andamento ou interrompida).</p>}
              </details>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
