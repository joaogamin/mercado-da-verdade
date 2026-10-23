import { notFound } from "next/navigation";
import { anos, cidade as cidadeDe, exercicio } from "../dados";
import { AvisoCobertura, Cabecalho, Secao, SinaisEmOrdem, Trilha } from "../componentes/Estrutura";
import { Calculado, Fonte, FonteComplementar } from "../componentes/Fonte";
import { Barras, Indicadores, Mensal } from "../componentes/Graficos";
import { dataCurta, inteiro, mesCurto, pct, reais, reaisCurto } from "../formato";
import { hrefCredor, hrefOrgao, navCidade } from "../navegacao";
import { FONTE_ELEMENTOS } from "@pipeline/analise/elementos.ts";
import { AREAS, NOME_AREA, percentual, periodo } from "@pipeline/analise/minimos.ts";

export default function VisaoGeral({ slug, ano }: { slug: string; ano: number }) {
  const c = cidadeDe(slug);
  const ex = exercicio(slug, ano);
  if (!c || !ex) notFound();
  const t = ex.totais;
  const ent = c.entidades[0];
  // O destaque e o numero oficial do balancete (ja descontadas as anulacoes);
  // a soma da lista e maior porque ela mostra o valor original de cada empenho.
  const of = ex.oficial;
  const empenhadoOficial = of ? of.empenhado : t.empenhado;
  const anulacoes = of ? ex.somaListaOriginal - of.empenhado : 0;
  const porHab = ex.populacao ? Math.round(empenhadoOficial / ex.populacao.valor) : null;
  const outros = anos(slug).filter((a) => a !== ano);

  // A regua: mesmo periodo do ano anterior (meses ja decorridos no ano exibido)
  const anterior = exercicio(slug, ano - 1);
  const mesesAte = ex.mensal.at(-1)?.mes.slice(5, 7);
  const mesmoPeriodoAnterior = anterior && mesesAte
    ? anterior.mensal.filter((m) => m.mes.slice(5, 7) <= mesesAte).reduce((s, m) => s + m.empenhado, 0)
    : null;
  // A fatia de um orgao so e verdadeira com o detalhe de todos os empenhos;
  // antes disso ela pareceria pequena so porque falta coletar.
  const orgaoMaior = t.comDetalhe === t.empenhos ? ex.orgaos[0] : undefined;
  const origem = ex.origem;
  const fonte = origem ? <Fonte origem={origem} cidade={slug} comoLer="empenho" /> : null;
  const credorPorChave = new Map(ex.credores.map((x) => [x.chave, x.slug]));
  // Minimos constitucionais (fonte complementar): o ultimo bimestre declarado de cada area
  const minimos = ex.minimos ?? { educacao: [], saude: [] };
  const ultimosMinimos = AREAS.map((a) => minimos[a].at(-1)).filter((m) => m !== undefined);
  const bimestres = [...new Set(AREAS.flatMap((a) => minimos[a].map((m) => m.bimestre)))].sort((a, b) => a - b);

  return (
    <>
      <Cabecalho cidade={c.nome} itens={navCidade(slug, "visao", ano)} />
      <main>
        <section className="mun-topo">
          <div className="wrap">
            <Trilha passos={[{ href: "/municipios/", rotulo: "Municípios" }, { href: `/municipios/${slug}/`, rotulo: c.nome }, { rotulo: String(ano) }]} />
            <div className="eyebrow" style={{ marginTop: 14 }}>{ent.nome} · exercício {ano}</div>
            <h1 className="mun-h1">Para onde foi o dinheiro da Prefeitura de {c.nome} em {ano}</h1>
            {outros.length ? (
              <p className="mono" style={{ fontSize: 13, margin: "12px 0 0" }}>
                Outros anos: {outros.map((a, i) => <span key={a}>{i ? " · " : ""}<a href={`/municipios/${slug}/${a}/`} style={{ color: "var(--ink)", display: "inline-block", padding: "12px 0" }}>{a}</a></span>)}
              </p>
            ) : null}

            <p className="mun-heroi">{reaisCurto(empenhadoOficial)}</p>
            <p className="mun-heroi-rot">
              {of
                ? <>empenhados (comprometidos) em {ano}, já descontadas as anulações, segundo o balancete do portal da prefeitura. Valor exato: {reais(of.empenhado)}. São {inteiro(t.empenhos)} empenhos para {inteiro(t.credores)} credores.</>
                : <>empenhados (comprometidos) em {inteiro(t.empenhos)} empenhos para {inteiro(t.credores)} credores{ex.coletadoEm ? `, segundo o portal da prefeitura em ${dataCurta(ex.coletadoEm)}` : ""}. Valor exato: {reais(t.empenhado)}.</>}
            </p>
            {anulacoes > 0 ? (
              <p className="mun-heroi-rot" style={{ marginTop: 8 }}>
                Somando a lista de empenhos, dá {reaisCurto(ex.somaListaOriginal)}: a lista mostra o valor original de cada empenho, antes
                de {reaisCurto(anulacoes)} em anulações. <a href="/municipios/como-ler/#anulacao" style={{ color: "var(--ink)" }}>Como ler</a>
              </p>
            ) : null}

            <Indicadores itens={of ? [
              { rotulo: "Liquidado", valor: reaisCurto(of.liquidado), detalhe: `${pct(of.empenhado ? of.liquidado / of.empenhado : 0)} do empenhado: serviço entregue e conferido` },
              { rotulo: "Pago no ano", valor: reaisCurto(of.pago), detalhe: `${pct(of.empenhado ? of.pago / of.empenhado : 0)} do empenhado saiu do caixa dentro de ${ano}` },
              ...(porHab !== null ? [{ rotulo: "Por habitante", valor: reais(porHab), detalhe: `empenhado ÷ ${inteiro(ex.populacao!.valor)} habitantes` }] : []),
              { rotulo: "Restos pagos no ano", valor: reaisCurto(of.pagoRestos), detalhe: `pago em ${ano} de empenhos de anos anteriores` },
            ] : [
              { rotulo: "Liquidado", valor: reaisCurto(t.liquidado), detalhe: `${pct(t.empenhado ? t.liquidado / t.empenhado : 0)} do empenhado: serviço entregue e conferido` },
              { rotulo: "Pago", valor: reaisCurto(t.pago), detalhe: `${pct(t.empenhado ? t.pago / t.empenhado : 0)} do empenhado já saiu do caixa` },
              ...(porHab !== null ? [{ rotulo: "Por habitante", valor: reais(porHab), detalhe: `empenhado ÷ ${inteiro(ex.populacao!.valor)} habitantes` }] : []),
            ]} />
            {porHab !== null ? <p style={{ margin: "10px 0 0" }}><Calculado formula="empenhado ÷ população estimada" /></p> : null}
            <AvisoCobertura comDetalhe={t.comDetalhe} total={t.empenhos} />
            {of ? <Fonte origem={of.origem} cidade={slug} comoLer="dotacao" /> : null}
            {fonte}
            {ex.populacao ? <FonteComplementar fonte={ex.populacao.fonte} url={ex.populacao.url} nota={`população ${ex.populacao.ano}: ${inteiro(ex.populacao.valor)}`} /> : null}
          </div>
        </section>

        <Secao eyebrow="A régua" titulo="Como ler esse número sem ser enganado"
          lead="O mesmo valor parece grande ou pequeno dependendo da régua. Aqui estão três réguas justas, todas calculadas a partir dos números da prefeitura.">
          <Indicadores itens={[
            ...(porHab !== null ? [{ rotulo: "Por habitante", valor: reais(porHab), detalhe: "divide o total pela população: permite comparar com outras cidades" }] : []),
            ...(orgaoMaior ? [{ rotulo: "Maior fatia", valor: pct(orgaoMaior.participacao), detalhe: `${orgaoMaior.nome}` }] : []),
            ...(mesmoPeriodoAnterior !== null && mesesAte ? [{
              rotulo: `Mesmo período de ${ano - 1}`, valor: reaisCurto(mesmoPeriodoAnterior),
              detalhe: `jan–${mesCurto(`${ano}-${mesesAte}`)} de ${ano - 1}: compare começo com começo, nunca ano parcial com ano cheio`,
            }] : []),
          ]} />
          <p style={{ margin: "12px 0 0" }}><Calculado formula="réguas calculadas sobre os empenhos publicados" /></p>
        </Secao>

        <Secao eyebrow="Honestidade nos dois sentidos" titulo="O que merece atenção — e o que está em ordem" fundo="gray">
          <SinaisEmOrdem sinais={ex.sinais} emOrdem={ex.emOrdem} hrefCredor={(k) => { const s = credorPorChave.get(k); return s ? hrefCredor(slug, ano, s) : undefined; }} />
          {fonte}
        </Secao>

        {ultimosMinimos.length ? (
          <Secao id="minimos" eyebrow="Mínimos da Constituição" titulo="Saúde e educação: o piso foi cumprido?" fundo="white"
            lead="O município tem de aplicar pelo menos **25%** da receita de impostos em educação (Constituição, art. 212) e **15%** em saúde (art. 198 e Lei Complementar 141/2012). Os números são os que a própria prefeitura declarou aos sistemas federais.">
            <Indicadores itens={ultimosMinimos.map((m) => ({
              rotulo: NOME_AREA[m.area], valor: percentual(m.percentual),
              detalhe: `${periodo(m)} · mínimo ${m.piso}%${m.aplicado !== null ? ` · ${reaisCurto(m.aplicado)} aplicados` : ""}`,
            }))} />
            {ultimosMinimos.some((m) => m.bimestre < 6) ? (
              <p className="mun-muted" style={{ margin: "12px 0 0" }}>O mínimo vale para o ano inteiro. Antes do fechamento (6º bimestre), o percentual acumulado é acompanhamento, não veredito.</p>
            ) : null}
            <details className="mun-tabela-det">
              <summary className="mono">bimestre a bimestre (acumulado no ano)</summary>
              <table className="mun-tabela" style={{ maxWidth: 560 }}>
                <thead><tr><th>Até o</th>{AREAS.map((a) => <th key={a} className="num">{NOME_AREA[a]}</th>)}</tr></thead>
                <tbody>
                  {bimestres.map((b) => (
                    <tr key={b}>
                      <td>{b}º bimestre</td>
                      {AREAS.map((a) => { const m = minimos[a].find((x) => x.bimestre === b); return <td key={a} className="num">{m ? percentual(m.percentual) : "—"}</td>; })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
            {ultimosMinimos.map((m) => (
              <FonteComplementar key={m.area} fonte={m.origem.fonte} url={m.origem.url} arquivada={{ origem: m.origem, cidade: slug }}
                nota={`declarado pela prefeitura · indicador ${m.indicador.split(" ")[0]}`} />
            ))}
          </Secao>
        ) : null}

        <Secao id="orgaos" eyebrow="Quem gasta" titulo="Por secretaria e órgão"
          lead="Clique em um órgão para ver em que ele gastou, com quem e como contratou.">
          <Barras rotuloLista="Empenhado por órgão" itens={ex.orgaos} limite={30} href={(i) => hrefOrgao(slug, ano, i.chave)} />
          {fonte}
        </Secao>

        <Secao id="credores" eyebrow="Quem recebe" titulo="Os maiores credores" fundo="white"
          lead={`Empresas, pessoas e a própria folha, exatamente como o portal publica. [Ver todos os ${inteiro(t.credores)} credores](/municipios/${slug}/${ano}/credores/).`}>
          <Barras rotuloLista="Empenhado por credor" itens={ex.credores} limite={15} href={(i) => (i.slug ? hrefCredor(slug, ano, i.slug) : undefined)} />
          {fonte}
        </Secao>

        <Secao eyebrow="Para quê" titulo="Por função de governo">
          <Barras rotuloLista="Empenhado por função" itens={ex.funcoes} limite={12} />
          {fonte}
        </Secao>

        <Secao eyebrow="Em quê" titulo="Por elemento de despesa" fundo="white"
          lead="O tipo do gasto: material, serviço, obra, folha. Os nomes dos elementos seguem a classificação nacional.">
          <Barras rotuloLista="Empenhado por elemento" itens={ex.elementos.map((e) => ({ ...e, nome: `${e.nome} (${e.chave})` }))} limite={12} />
          {fonte}
          <FonteComplementar fonte={`Nomes dos elementos: ${FONTE_ELEMENTOS}`} url="https://www.tesourotransparente.gov.br/publicacoes/manual-de-contabilidade-aplicada-ao-setor-publico-mcasp" />
        </Secao>

        <Secao eyebrow="Como foi contratado" titulo="Por modalidade de contratação"
          lead="Com disputa (pregão, concorrência) ou direto (dispensa, inexigibilidade). Folha e encargos não passam por licitação e aparecem como “sem licitação vinculada”.">
          <Barras rotuloLista="Empenhado por modalidade" itens={ex.modalidades} limite={12} />
          {fonte}
        </Secao>

        <Secao eyebrow="Ao longo do ano" titulo="Mês a mês" fundo="white">
          <Mensal serie={ex.mensal} rotulo={`Empenhado por mês em ${ano}`} />
          {fonte}
        </Secao>

        <section className="sec sec--tight">
          <div className="wrap">
            <div className="dados-bloco">
              <h3 style={{ fontSize: 21, marginBottom: 4 }}>Dados abertos</h3>
              <p className="dados-lead">Todos os {inteiro(t.empenhos)} empenhos de {ano}, com a página oficial, o instante da coleta e o sha256 de cada um.</p>
              <div className="dados-links">
                <a href={`/dados/municipios/${slug}/${ent.id}-${ano}/empenhos-${ent.id}-${ano}.csv`} download className="dados-link">CSV ↓</a>
                <a href={`/dados/municipios/${slug}/${ent.id}-${ano}/empenhos-${ent.id}-${ano}.json`} download className="dados-link">JSON ↓</a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
