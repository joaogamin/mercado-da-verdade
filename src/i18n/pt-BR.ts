// Dicionario fonte da verdade. O tipo Dicionario deriva DESTE arquivo, entao
// qualquer chave que falte em en.ts ou es.ts reprova o build.
//
// Convencao de marcacao dentro das strings (ver src/i18n/rich.tsx):
//   **negrito**   *italico*   [rotulo](https://url)

export const ptBR = {
  nav: {
    tagline: "Checagem estatística",
    marca: "Mercado da",
    marcaDestaque: "Verdade",
    abrirMenu: "Abrir menu",
    idioma: "Idioma",
    links: [
      { href: "#regua", rotulo: "A régua" },
      { href: "#alimentos", rotulo: "Alimentos" },
      { href: "#auditoria", rotulo: "Produto a produto" },
      { href: "#desemprego", rotulo: "Desemprego" },
      { href: "#comparativo", rotulo: "O comparativo" },
      { href: "#seis-por-um", rotulo: "Escala 6x1" },
      { href: "#ibge", rotulo: "O IBGE" },
      { href: "#verdade", rotulo: "O que é verdade" },
    ],
  },
  hero: {
    selo: "✓ Checagem de método, não de partido",
    titulo1: "O dado é real.",
    titulo2: "O contexto foi cortado.",
    lead1:
      "Este site confere, número por número, a peça de propaganda eleitoral sobre custo de vida publicada em [mercadodamentira.com.br ↗](https://mercadodamentira.com.br/).",
    lead2:
      "A conclusão, depois de checar cada seção: **eles não inventaram dados**. Fizeram algo mais difícil de perceber — escolheram uma régua que começa e termina nos pontos certos para produzir a conclusão desejada. Aqui a gente recoloca o que foi cortado, **com a mesma fonte oficial**.",
    boxTitulo: "Aqui não tem meia-verdade.",
    boxP1:
      "Das seis comparações da tabela deles, **três se sustentam sem ressalva** — e estão marcadas como corretas neste site, com a lei e a fonte de cada uma. O desemprego de 5,4% é real e é o menor da série. A informalidade está caindo.",
    boxP2:
      "Um site de checagem que só encontra erro de um lado é propaganda com outro nome. Todo número aqui tem fonte primária, e o código e a base são abertos.",
    stats: [
      { n: "109", k: "dos 112 produtos do site deles ainda estão mais caros que em jan/2019" },
      { n: "14,9%", k: "o pico do desemprego foi no 1º tri de 2021, no auge da pandemia" },
      { n: "159,7", k: "o índice global de alimentos da FAO bateu recorde em mar/2022" },
      { n: "3 de 6", k: "comparações da tabela deles se sustentam — e nós confirmamos" },
    ],
  },
  comum: {
    narrativa: "A narrativa",
    contextoExato: "O contexto exato",
    veredito: "Veredito",
    oPonto: "O ponto",
  },
  regua: {
    eyebrow: "O flagra da régua",
    titulo: "Os dois períodos não são comparáveis.",
    lead:
      "O site original compara **jan/2019 a jul/2022** com **jan/2023 a jul/2026**. Parece simétrico: três anos e meio de cada lado. Mas veja o que caiu dentro de cada janela — usando um índice **global**, que nenhum presidente brasileiro comanda.",
    figCaption: "ÍNDICE DE PREÇOS DE ALIMENTOS DA FAO/ONU · média anual · base 2014-2016 = 100",
    figAlt:
      "Índice global de alimentos da FAO: sobe de 95 em 2019 para o recorde de 2022, cai em 2023-2024 e volta a subir até 133 em 2026.",
    janelaA: 'JANELA "BOLSONARO" DO SITE',
    janelaB: 'JANELA "LULA" DO SITE',
    covid: "COVID-19",
    guerra1: "GUERRA NA",
    guerra2: "UCRÂNIA",
    nota:
      "* 2026: valor de agosto (133,3), o mais alto desde o fim de 2022. Pico mensal absoluto da série: 159,7 pontos em março de 2022.",
    narrativaTitulo: '"Três anos e meio de cada governo, lado a lado."',
    narrativaP:
      "A simetria do calendário é apresentada como se fosse simetria de condições. Mesmo número de meses, mesma fonte, mesmo índice — logo, o que sobra seria mérito ou culpa de gestão.",
    contextoTitulo: "Uma janela pega a subida global inteira. A outra pega a descida.",
    contextoP1:
      'A janela "Bolsonaro" começa em 95 pontos e **termina exatamente no pico histórico** do índice global de alimentos: a pandemia, o colapso logístico e a guerra na Ucrânia estão todos dentro dela.',
    contextoP2:
      'A janela "Lula" começa **logo depois desse pico** e apanha a normalização das cadeias globais. Boa parte da diferença já estava dada antes de qualquer decisão tomada em Brasília.',
    veredito:
      "Os números estão certos. A atribuição de causa é que não se sustenta: o mesmo padrão de alta e queda aparece no mundo inteiro, inclusive em países cujos governos não mudaram.",
    fontes:
      "Fontes: FAO — Índice de Preços de Alimentos (séries mensais e anuais, base 2014-2016=100); FAO, comunicado de março de 2022 sobre o recorde de 159,7 pontos; FAO, comunicado de setembro de 2026.",
  },
  alimentos: {
    eyebrow: "Bloco 1 · Inflação de alimentos",
    titulo: "A comida subiu no mundo inteiro — e depois cedeu no mundo inteiro.",
    lead:
      'O site abre com o número mais forte da peça: **13,2% de inflação de alimentos ao ano** na janela anterior contra **3,0% ao ano** na atual. "Quatro vezes mais cara." O dado do IPCA está correto. A pergunta que ele não responde é: *quatro vezes mais cara por causa de quem?*',
    narrativaTitulo: '"A comida subiu 4x mais no governo Bolsonaro."',
    narrativaP:
      "Alimentação no domicílio, IPCA/IBGE Tabela 7060, três anos e meio de cada governo. 54,24% contra 13,66% no acumulado.",
    contextoTitulo: "Três choques externos couberam inteiros na primeira janela.",
    contextoP1:
      "**1. Pandemia e colapso logístico (2020-2021).** Frete marítimo multiplicado, quebra de cadeias de suprimento e demanda represada empurraram alimentos no mundo todo.",
    contextoP2:
      "**2. Guerra na Ucrânia (fev/2022).** Rússia e Ucrânia respondiam por cerca de 27% das exportações mundiais de trigo e mais da metade do óleo de girassol. O índice global da FAO bateu o recorde de toda a série em março de 2022.",
    contextoP3:
      "**3. Fertilizantes.** O Brasil importa a maior parte do que usa, e Rússia e Belarus são fornecedores centrais. As sanções encareceram o insumo — e o insumo entra no preço da safra seguinte.",
    stats: [
      { n: "+51%", k: "o índice global de alimentos da FAO subiu de 95,1 (2019) a 143,7 (2022) — sem nenhum governo brasileiro no comando" },
      { n: "−15%", k: "e recuou de 143,7 (2022) para 122,0 (2024), a maré que a segunda janela pegou a favor" },
      { n: "133,3", k: "e voltou a subir: agosto de 2026, o nível mais alto desde o fim de 2022" },
    ],
    veredito:
      "Enganoso por omissão de causa. A diferença entre as duas janelas é em grande parte a diferença entre estar na subida e estar na descida de um ciclo global de commodities. E, como o índice da FAO voltou a subir em 2026, a mesma métrica que hoje é usada como prova de competência pode virar prova de incompetência daqui a alguns meses — sem que nada tenha mudado em Brasília.",
    fontes:
      "Fontes: IBGE/IPCA (Tabela 7060, alimentação no domicílio); FAO — Índice de Preços de Alimentos; FAO/ONU, comunicados de março de 2022 e de setembro de 2026.",
  },
  desemprego: {
    eyebrow: "Bloco 2 · A métrica do desemprego",
    titulo: "O pico de 14,9% não é o ponto de partida de ninguém.",
    lead:
      'O comparativo do site coloca **"14%+"** na coluna do governo anterior e **5,4%** na atual. Mas 14,9% não foi como o governo anterior começou nem como terminou: foi o auge da pandemia, no 1º trimestre de 2021.',
    figCaption: "TAXA DE DESOCUPAÇÃO · PNAD CONTÍNUA TRIMESTRAL / IBGE · em % da força de trabalho",
    figAlt:
      "Desemprego: 12,7% no início de 2019, pico de 14,9% no primeiro trimestre de 2021 durante a pandemia, 7,9% no fim de 2022 e 5,4% em junho de 2026.",
    trocaGoverno: "TROCA DE GOVERNO",
    pandemia: "PANDEMIA / LOCKDOWNS",
    pico: "PICO DA SÉRIE",
    rotulos: ["1ºT/19", "4ºT/19", "1ºT/21", "4ºT/22", "4ºT/23", "4ºT/24", "jun/26"],
    narrativaTitulo: '"Desemprego recorde de 14%+ contra 5,4%, o menor da história."',
    narrativaP:
      "A tabela do site coloca o pior número já registrado de um lado e o melhor do outro, como se fossem os saldos de cada gestão.",
    contextoTitulo: "Compare começo com começo e fim com fim.",
    contextoP1:
      "O governo anterior **recebeu 12,7%** (1ºT/2019) e **entregou 7,9%** (4ºT/2022): queda de 4,8 pontos, atravessando a pandemia no meio.",
    contextoP2:
      "O governo atual **recebeu 7,9%** e chegou a **5,4%** (jun/2026): queda de 2,5 pontos — um resultado real e o melhor da série, mas obtido a partir de uma herança já em queda.",
    contextoP3:
      "O 14,9% pertence ao 1º trimestre de 2021 — um trimestre de lockdown, não um balanço de gestão.",
    veredito:
      'O 5,4% é verdadeiro e é o menor da série histórica. O que é falso é o contraste: usar o pico da pandemia como "o número do adversário" transfere para a gestão o custo de um choque sanitário global.',
    fontes:
      "Fontes: IBGE/PNAD Contínua trimestral — 1ºT/2019 (12,7%), 4ºT/2019 (11,0%), 1ºT/2021 (14,9%, máximo da série iniciada em 2012), 4ºT/2022 (7,9%), 4ºT/2023 (7,4%), 4ºT/2024 (6,2%) e trimestre encerrado em junho/2026 (5,4%).",
  },
  // <<SECOES>>
};

export type Dicionario = typeof ptBR;
