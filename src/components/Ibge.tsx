export default function Ibge() {
  return (
    <section id="ibge" className="sec sec--navy">
      <div className="wrap">
        <div className="eyebrow">Bloco 4 · A credibilidade do IBGE</div>
        <h2 className="sec-title">O erro não está na planilha. E o problema do IBGE também é real.</h2>
        <p className="sec-lead">
          Circula nas redes que o IBGE estaria fraudando os números. Circula na propaganda que questionar o IBGE
          é golpismo. As duas coisas são simplificações — e as duas atrapalham quem quer entender o que está
          acontecendo.
        </p>

        <div className="duo">
          <div className="card" style={{ background: "var(--blue-dd)", borderColor: "rgba(255,255,255,.25)", color: "#fff" }}>
            <span className="card-tag" style={{ background: "rgba(255,255,255,.16)", color: "#fff" }}>
              O que NÃO se sustenta
            </span>
            <h3 style={{ color: "#fff" }}>&quot;Os números são inventados.&quot;</h3>
            <p style={{ color: "rgba(255,255,255,.85)" }}>
              Não há qualquer evidência de manipulação do IPCA ou da PNAD. São pesquisas com metodologia pública,
              microdados abertos, amostra auditável e execução por servidores de carreira. Qualquer pesquisador
              pode recalcular os índices a partir dos microdados — e isso é feito rotineiramente por
              universidades, bancos e institutos independentes, que chegam aos mesmos resultados.
            </p>
            <p style={{ color: "rgba(255,255,255,.85)" }}>
              A <strong>reponderação da PNAD Contínua em 2025</strong>, feita para incorporar o Censo 2022, é um
              procedimento técnico padrão, anunciado com antecedência e aplicado <strong>retroativamente a toda a
              série</strong> — inclusive aos anos do governo anterior. Ela não cria melhora artificial: recalibra
              o passado e o presente com a mesma régua.
            </p>
            <p style={{ color: "rgba(255,255,255,.85)" }}>
              E os pesos do IPCA seguem os da POF anterior: a atualização com a nova pesquisa de orçamentos
              familiares só deve valer a partir de 2027. Ou seja, o índice usado nessa comparação{" "}
              <strong>não foi alterado</strong> por este governo.
            </p>
          </div>

          <div className="card card--fact">
            <span className="card-tag tag--fact">O que É preocupante</span>
            <h3>A blindagem institucional se desgastou — e isso é documentado.</h3>
            <p>
              Em <strong>19 de janeiro de 2026</strong>, Rebeca Palis, coordenadora responsável pelo cálculo do PIB,
              foi exonerada. Pelo menos três integrantes da equipe deixaram cargos de confiança em solidariedade.
            </p>
            <p>
              Em <strong>fevereiro e março de 2026</strong>, o Ministério Público junto ao TCU pediu o afastamento do
              presidente do IBGE, Márcio Pochmann, alegando risco de uso político dos dados do PIB em ano eleitoral
              e preocupação com mudanças em metodologias de coleta e tratamento.
            </p>
            <p>
              Nada disso demonstra que um número tenha sido falsificado. Demonstra que as salvaguardas que tornam a
              falsificação difícil ficaram mais frágeis — e isso é motivo legítimo de vigilância, não de pânico.
            </p>
          </div>
        </div>

        <div className="verdict" style={{ background: "var(--blue-dd)", borderLeftColor: "var(--yellow)" }}>
          <span className="verdict-label" style={{ color: "var(--yellow)" }}>Veredito</span>
          <p style={{ color: "#fff" }}>
            Acusar o IBGE de fraude é injusto com quem produz os dados e desvia a atenção do problema de verdade.
            O dado é confiável; a régua aplicada sobre ele na propaganda é que é escolhida. Ao mesmo tempo, a crise
            de governança do instituto é real e merece acompanhamento — inclusive porque a melhor defesa dos
            números é a autonomia de quem os calcula.
          </p>
        </div>

        <p className="src">
          Fontes: IBGE — nota técnica sobre a reponderação da PNAD Contínua em 2025 e Projeções da População pós-Censo
          2022; IBGE/POF sobre a atualização dos pesos do IPCA; Correio Braziliense e Gazeta do Povo (março de 2026)
          sobre a representação do MP junto ao TCU e as exonerações na diretoria de contas nacionais.
        </p>
      </div>
    </section>
  );
}
