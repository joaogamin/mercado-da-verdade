export default function Alimentos() {
  return (
    <section id="alimentos" className="sec" style={{ background: "var(--gray)" }}>
      <div className="wrap">
        <div className="eyebrow">Bloco 1 · Inflação de alimentos</div>
        <h2 className="sec-title">A comida subiu no mundo inteiro — e depois cedeu no mundo inteiro.</h2>
        <p className="sec-lead">
          O site abre com o número mais forte da peça: <strong>13,2% de inflação de alimentos ao ano</strong> na
          janela anterior contra <strong>3,0% ao ano</strong> na atual. &quot;Quatro vezes mais cara.&quot; O dado do IPCA
          está correto. A pergunta que ele não responde é: <em>quatro vezes mais cara por causa de quem?</em>
        </p>

        <div className="duo">
          <div className="card card--claim">
            <span className="card-tag tag--claim">A narrativa</span>
            <h3>&quot;A comida subiu 4x mais no governo Bolsonaro.&quot;</h3>
            <p>
              Alimentação no domicílio, IPCA/IBGE Tabela 7060, três anos e meio de cada governo. 54,24% contra
              13,66% no acumulado.
            </p>
          </div>
          <div className="card card--fact">
            <span className="card-tag tag--fact">O contexto exato</span>
            <h3>Três choques externos couberam inteiros na primeira janela.</h3>
            <p>
              <strong>1. Pandemia e colapso logístico (2020-2021).</strong> Frete marítimo multiplicado, quebra de
              cadeias de suprimento e demanda represada empurraram alimentos no mundo todo.
            </p>
            <p>
              <strong>2. Guerra na Ucrânia (fev/2022).</strong> Rússia e Ucrânia respondiam por cerca de 27% das
              exportações mundiais de trigo e mais da metade do óleo de girassol. O índice global da FAO bateu o
              recorde de toda a série em março de 2022.
            </p>
            <p>
              <strong>3. Fertilizantes.</strong> O Brasil importa a maior parte do que usa, e Rússia e Belarus são
              fornecedores centrais. As sanções encareceram o insumo — e o insumo entra no preço da safra seguinte.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 2, marginTop: 30 }}>
          {[
            ["+51%", "o índice global de alimentos da FAO subiu de 95,1 (2019) a 143,7 (2022) — sem nenhum governo brasileiro no comando"],
            ["−15%", "e recuou de 143,7 (2022) para 122,0 (2024), a maré que a segunda janela pegou a favor"],
            ["133,3", "e voltou a subir: agosto de 2026, o nível mais alto desde o fim de 2022"],
          ].map(([n, k]) => (
            <div key={k} style={{ background: "#fff", border: "2px solid var(--ink)", padding: "22px 18px" }}>
              <div className="disp" style={{ fontSize: 42, color: "var(--blue)", lineHeight: 1 }}>{n}</div>
              <div className="stat-k">{k}</div>
            </div>
          ))}
        </div>

        <div className="verdict">
          <span className="verdict-label">Veredito</span>
          <p>
            Enganoso por omissão de causa. A diferença entre as duas janelas é em grande parte a diferença entre
            estar na subida e estar na descida de um ciclo global de commodities. E, como o índice da FAO voltou a
            subir em 2026, a mesma métrica que hoje é usada como prova de competência pode virar prova de
            incompetência daqui a alguns meses — sem que nada tenha mudado em Brasília.
          </p>
        </div>

        <p className="src">
          Fontes: IBGE/IPCA (Tabela 7060, alimentação no domicílio); FAO — Índice de Preços de Alimentos;
          FAO/ONU, comunicados de março de 2022 e de setembro de 2026.
        </p>
      </div>
    </section>
  );
}
