const ACERTOS = [
  ["5,4% é o menor desemprego da série", "O recorde da PNAD Contínua, iniciada em 2012, é real. Não há truque no número em si."],
  ["A informalidade está caindo", "37,5% no trimestre até jan/2026, o menor patamar desde julho de 2020. O contra-argumento de que 'os empregos são todos informais' não se sustenta nos dados."],
  ["A renda média está no maior nível da série", "R$ 3.652 de rendimento real habitual, +5,4% em um ano. É recorde de fato."],
  ["A isenção do IR até R$ 5 mil está em vigor", "Lei 15.270/2025, valendo na folha desde 1º de janeiro de 2026, com cerca de 15 milhões de beneficiados."],
  ["O salário mínimo teve ganho real", "A política de valorização foi restabelecida pela Lei 14.663/2023 e o mínimo de 2026 (R$ 1.621) subiu acima da inflação."],
  ["A subutilização caiu muito", "13,8% no trimestre até abril de 2026, contra mais de 30% no auge da pandemia. A melhora do mercado de trabalho é ampla, não um artefato de definição."],
];

const OMISSOES = [
  ["O preço não voltou, só parou de correr", "109 dos 112 produtos da tabela deles seguem mais caros que em janeiro de 2019. Inflação baixa significa que o preço subiu devagar — não que ele desceu."],
  ["O café acumula +156% desde 2019", "E subiu 48,7% na janela atual, pelos números do próprio site. Alguns itens do dia a dia continuam pesando muito mais no orçamento."],
  ["A maré global virou de novo", "O índice de alimentos da FAO chegou a 133,3 pontos em agosto de 2026, o maior desde o fim de 2022. O vento de popa de 2023-2024 não é permanente."],
  ["O ciclo global explica os dois lados", "A mesma lógica que isenta este governo da alta de 2021-2022 isenta o anterior. Quem usa o argumento do contexto precisa aplicá-lo nas duas direções."],
];

function Col({ titulo, cor, itens }: { titulo: string; cor: string; itens: string[][] }) {
  return (
    <div>
      <h3 style={{ fontSize: 27, marginBottom: 16, color: cor }}>{titulo}</h3>
      <div style={{ display: "grid", gap: 2 }}>
        {itens.map(([t, d]) => (
          <div key={t} style={{ background: "#fff", borderLeft: `8px solid ${cor}`, padding: "18px 20px" }}>
            <strong style={{ display: "block", fontSize: 16.5, marginBottom: 6 }}>{t}</strong>
            <span style={{ fontSize: 15.5, color: "var(--muted)" }}>{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Verdade() {
  return (
    <section id="verdade" className="sec" style={{ background: "var(--gray)" }}>
      <div className="wrap">
        <div className="eyebrow">Honestidade nos dois sentidos</div>
        <h2 className="sec-title">O que a propaganda acerta — e o que ninguém está te contando.</h2>
        <p className="sec-lead">
          Um site de checagem que só encontra erros do outro lado não é checagem, é propaganda com outro nome.
          Então vamos ser explícitos sobre o que se confirma.
        </p>

        <div className="duo" style={{ marginTop: 34 }}>
          <Col titulo="✓ O que se confirma" cor="var(--green)" itens={ACERTOS} />
          <Col titulo="! O que fica de fora dos dois lados" cor="var(--blue)" itens={OMISSOES} />
        </div>

        <div className="verdict">
          <span className="verdict-label">O ponto</span>
          <p>
            A melhora do mercado de trabalho é real e a desaceleração dos preços é real. O que não é real é a
            relação de causa que a peça constrói entre uma coisa e a outra, nem a ideia de que o preço da comida
            voltou ao que era. Dá para reconhecer o resultado sem comprar a explicação.
          </p>
        </div>

        <p className="src">
          Fontes: IBGE/PNAD Contínua (desocupação, informalidade, subutilização e rendimento real, divulgações de
          2026); Lei 15.270/2025; Lei 14.663/2023; FAO — Índice de Preços de Alimentos, agosto de 2026; e a própria
          base de produtos publicada em mercadodamentira.com.br.
        </p>
      </div>
    </section>
  );
}
