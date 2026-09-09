const FONTES = [
  ["IBGE · IPCA (Tabela 7060)", "https://sidra.ibge.gov.br/tabela/7060"],
  ["IBGE · PNAD Contínua", "https://www.ibge.gov.br/estatisticas/sociais/trabalho/17270-pnad-continua.html"],
  ["FAO · Índice de Preços de Alimentos", "https://www.fao.org/worldfoodsituation/foodpricesindex/en/"],
  ["Senado · PEC 221/2019", "https://www25.senado.leg.br/web/atividade/materias/-/materia/174386"],
  ["Planalto · Lei 15.270/2025 (IRPF)", "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm"],
  ["Planalto · Lei 14.663/2023 (salário mínimo)", "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14663.htm"],
];

export default function Metodologia() {
  return (
    <>
      <section id="metodologia" className="sec sec--white">
        <div className="wrap">
          <div className="eyebrow">Metodologia</div>
          <h2 className="sec-title">Como a gente chegou nesses números.</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 26, marginTop: 32 }}>
            {[
              ["Usamos os números deles", "A tabela foi extraída da própria seção “Produto por produto” do site original, em setembro de 2026. Nenhuma variação foi alterada. Removemos apenas 4 rótulos repetidos (o mesmo item do IPCA aparecia com nome curto e nome completo), ficando 112 produtos. A única coluna nova é o acumulado."],
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

      <footer className="sec--navy" style={{ padding: "48px 0 40px", borderTop: "4px solid var(--blue)" }}>
        <div className="wrap">
          <div className="disp" style={{ fontSize: 30, color: "#fff" }}>
            MERCADO DA <span style={{ color: "var(--yellow)" }}>VERDADE</span>
          </div>
          <p style={{ maxWidth: "70ch", marginTop: 14, color: "rgba(255,255,255,.78)", fontSize: 15.5 }}>
            Projeto independente e de autoria identificada, feito por conta própria.{" "}
            <strong>Não é ligado a nenhum partido, campanha, coligação, candidato ou órgão
            público</strong>, e não é propaganda eleitoral. Não temos qualquer
            vínculo com os responsáveis pelo site mercadodamentira.com.br, cujo conteúdo é citado aqui apenas
            para fins de análise crítica e checagem.
          </p>
          <p style={{ maxWidth: "70ch", marginTop: 12, color: "rgba(255,255,255,.6)", fontSize: 14 }}>
            Todos os dados vêm de fontes públicas e oficiais, listadas em cada bloco. Encontrou um erro nosso?
            A correção é publicada com a mesma clareza da afirmação original — é essa a diferença entre checagem
            e propaganda.
          </p>
          <div style={{
            marginTop: 26, paddingTop: 22, borderTop: "1px solid rgba(255,255,255,.16)",
            display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center",
            justifyContent: "space-between",
          }}>
            <p className="mono" style={{ margin: 0, color: "rgba(255,255,255,.45)", fontSize: 12 }}>
              Última verificação dos indicadores: 9 de setembro de 2026.
            </p>

            <a
              href="https://www.linkedin.com/in/jgamin/"
              target="_blank"
              rel="noopener noreferrer me author"
              className="mono"
              style={{
                display: "inline-flex", alignItems: "center", gap: 9,
                background: "var(--blue)", color: "#fff", textDecoration: "none",
                fontSize: 12, fontWeight: 700, letterSpacing: ".08em",
                textTransform: "uppercase", padding: "10px 14px",
                border: "2px solid var(--blue-soft)",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
              </svg>
              Autoria do projeto · LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
