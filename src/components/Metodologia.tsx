const FONTES = [
  ["IBGE · IPCA (Tabela 7060)", "https://sidra.ibge.gov.br/tabela/7060"],
  ["IBGE · PNAD Contínua", "https://www.ibge.gov.br/estatisticas/sociais/trabalho/17270-pnad-continua.html"],
  ["FAO · Índice de Preços de Alimentos", "https://www.fao.org/worldfoodsituation/foodpricesindex/en/"],
  ["Senado · PEC 221/2019", "https://www25.senado.leg.br/web/atividade/materias/-/materia/174386"],
  ["Planalto · Lei 15.270/2025 (IRPF)", "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm"],
  ["Planalto · Lei 14.663/2023 (salário mínimo)", "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14663.htm"],
  ["Arquivo do site original (09/09/2026)", "https://web.archive.org/web/20260909203458/https://mercadodamentira.com.br/"],
];

export default function Metodologia() {
  return (
    <section id="metodologia" className="sec sec--white">
        <div className="wrap">
          <div className="eyebrow">Metodologia</div>
          <h2 className="sec-title">Como a gente chegou nesses números.</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 26, marginTop: 32 }}>
            {[
              ["Usamos os números deles", "A tabela foi extraída da própria seção “Produto por produto” do site original, em setembro de 2026. Nenhuma variação foi alterada. Removemos apenas 4 rótulos repetidos (o mesmo item do IPCA aparecia com nome curto e nome completo), ficando 112 produtos. A única coluna nova é o acumulado."],
            ["Arquivamos a peça original", "Uma cópia do site checado foi salva no Internet Archive em 9 de setembro de 2026. Se eles editarem ou tirarem a página do ar, a versão que auditamos continua pública e conferível — o link está nas fontes abaixo."],
              ["Encadeamos, não somamos", "Para saber onde o preço está hoje em relação a jan/2019, os dois períodos consecutivos se multiplicam: (1+a)×(1+b)−1. Somar as duas variações daria um número errado."],
              ["Comparamos começo com começo", "Para desemprego e renda, usamos o valor do trimestre em que cada governo assumiu e do trimestre em que entregou — em vez do pior e do melhor ponto da série."],
              ["Testamos contra uma série global", "O índice de alimentos da FAO funciona como controle: se o mesmo movimento aparece no mundo inteiro, ele não pode ser creditado nem debitado a um governo brasileiro."],
              ["Dizemos quando eles estão certos", "Três das seis linhas do comparativo original se sustentam. Estão marcadas como corretas, com a fonte legal de cada uma."],
              ["Datamos tudo", "Indicadores conjunturais mudam. Cada bloco traz a data de verificação, e a página informa a última atualização geral."],
            ].map(([t, d]) => (
              <div key={t}>
                <h3 style={{ fontSize: 21, marginBottom: 9, color: "var(--blue)" }}>{t}</h3>
                <p style={{ margin: 0, fontSize: 15.5, color: "var(--muted)" }}>{d}</p>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: 21, margin: "40px 0 14px" }}>Fontes primárias</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {FONTES.map(([t, u]) => (
              <a key={t} href={u} target="_blank" rel="noopener noreferrer" className="mono"
                style={{
                  background: "var(--gray)", border: "2px solid var(--line)", padding: "10px 14px",
                  fontSize: 12.5, color: "var(--ink)", textDecoration: "none",
                }}>
                {t} ↗
              </a>
            ))}
          </div>
        </div>
      </section>
  );
}
