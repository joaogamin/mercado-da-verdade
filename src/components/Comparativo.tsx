type Veredito = "enganoso" | "parcial" | "correto";

const CORES: Record<Veredito, { bg: string; label: string }> = {
  enganoso: { bg: "#c0161c", label: "Enganoso" },
  parcial: { bg: "#c9942a", label: "Correto, sem contexto" },
  correto: { bg: "#0e8a2f", label: "Correto" },
};

const LINHAS: { ind: string; a: string; b: string; v: Veredito; txt: string }[] = [
  {
    ind: "Comida no mercado",
    a: "+54,24%", b: "+13,66%", v: "parcial",
    txt: "Os dois números batem com o IPCA. O que a tabela não diz é que a primeira janela contém a pandemia, o colapso logístico e a guerra na Ucrânia, e termina no recorde histórico do índice global de alimentos. Além disso, o preço de hoje é o resultado das duas janelas somadas: a comida acumula alta nas duas.",
  },
  {
    ind: "Desemprego",
    a: "14%+", b: "5,4%", v: "enganoso",
    txt: "Compara o pico da série (14,9% no 1ºT/2021, auge dos lockdowns) com o valor atual. O governo anterior recebeu 12,7% e entregou 7,9%; o atual recebeu 7,9% e chegou a 5,4%. O 5,4% é real e é o menor da série — o pico de 14,9% é que não é o saldo de ninguém.",
  },
  {
    ind: "Renda média",
    a: "−R$ 33", b: "+R$ 476", v: "parcial",
    txt: "A renda real de fato caiu até 2021 e se recuperou depois — hoje está no maior nível da série (R$ 3.652 no trimestre até jan/2026). Mas a queda coincide com a destruição de postos na pandemia e a alta parte de uma base deprimida. Uma parcela da recuperação é retomada do terreno perdido, não terreno novo.",
  },
  {
    ind: "Imposto de renda",
    a: "4 anos de tabela congelada", b: "Isenção até R$ 5 mil", v: "correto",
    txt: "Confere. A tabela do IRPF não foi corrigida entre 2019 e 2022, e a Lei 15.270/2025 ampliou a isenção para quem ganha até R$ 5 mil, em vigor desde janeiro de 2026, com cerca de 15 milhões de beneficiados. Ressalva honesta de contexto: o congelamento da tabela começou em 2015, antes do governo anterior.",
  },
  {
    ind: "Salário mínimo",
    a: "R$ 1.212 (2022)", b: "R$ 1.621 (2026)", v: "correto",
    txt: "Os valores estão corretos. A comparação é nominal, mas neste caso o ganho real também existe: a Lei 14.663/2023 restabeleceu a política de valorização (INPC + PIB de dois anos antes), e o reajuste de 2026 trouxe ganho acima da inflação.",
  },
  {
    ind: "Poder de compra do mínimo",
    a: "+R$ 214", b: "+R$ 409", v: "correto",
    txt: "É a mesma política de valorização medida em ganho real acumulado. Diferença de método, não de contexto externo: aqui a comparação mede uma escolha de política pública, que é exatamente o que uma comparação entre governos deveria medir.",
  },
];

export default function Comparativo() {
  return (
    <section id="comparativo" className="sec sec--white">
      <div className="wrap">
        <div className="eyebrow">Linha a linha</div>
        <h2 className="sec-title">O comparativo deles, auditado.</h2>
        <p className="sec-lead">
          Pegamos a tabela &quot;o comparativo que resume tudo&quot; e conferimos cada linha. Três das seis se sustentam
          sem ressalva — e a gente diz isso com todas as letras. As outras três dependem de um contexto que foi
          deixado de fora.
        </p>

        <div style={{ display: "grid", gap: 2, marginTop: 34 }}>
          {LINHAS.map((l) => (
            <article key={l.ind} style={{ background: "var(--gray)", borderLeft: `8px solid ${CORES[l.v].bg}`, padding: "22px 24px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "baseline", justifyContent: "space-between" }}>
                <h3 style={{ fontSize: 26 }}>{l.ind}</h3>
                <span className="mono" style={{
                  background: CORES[l.v].bg, color: "#fff", fontSize: 11, fontWeight: 700,
                  letterSpacing: ".12em", textTransform: "uppercase", padding: "5px 10px",
                }}>
                  {CORES[l.v].label}
                </span>
              </div>

              <div className="mono" style={{ display: "flex", gap: 26, flexWrap: "wrap", margin: "14px 0 12px", fontSize: 15 }}>
                <span style={{ color: "var(--muted)" }}>
                  Coluna &quot;Bolsonaro&quot;: <strong style={{ color: "var(--ink)" }}>{l.a}</strong>
                </span>
                <span style={{ color: "var(--muted)" }}>
                  Coluna &quot;Lula&quot;: <strong style={{ color: "var(--blue)" }}>{l.b}</strong>
                </span>
              </div>

              <p style={{ margin: 0, fontSize: 16, maxWidth: "88ch" }}>{l.txt}</p>
            </article>
          ))}
        </div>

        <div className="verdict">
          <span className="verdict-label">Veredito</span>
          <p>
            A peça não fabrica números — ela seleciona a régua. Onde a comparação mede uma escolha de política
            pública (imposto de renda, salário mínimo), ela é legítima e nós a confirmamos. Onde ela mede um ciclo
            global (comida, desemprego, renda), atribuir o resultado à gestão é o erro.
          </p>
        </div>

        <p className="src">
          Fontes: IBGE (IPCA Tabela 7060, PNAD Contínua); Lei 15.270/2025 (isenção do IRPF até R$ 5 mil, vigência
          jan/2026); Lei 14.663/2023 (política de valorização do salário mínimo); Senado Federal e Ministério da Fazenda.
        </p>
      </div>
    </section>
  );
}
