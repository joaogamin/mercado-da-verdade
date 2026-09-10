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
      { href: "#auditoria", rotulo: "Preços" },
      { href: "#desemprego", rotulo: "Desemprego" },
      { href: "#comparativo", rotulo: "Comparativo" },
      { href: "#seis-por-um", rotulo: "Escala 6x1" },
      { href: "#ibge", rotulo: "IBGE" },
      { href: "#verdade", rotulo: "O que confere" },
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
  comparativo: {
    eyebrow: "Linha a linha",
    titulo: "O comparativo deles, auditado.",
    lead:
      'Pegamos a tabela "o comparativo que resume tudo" e conferimos cada linha. Três das seis se sustentam sem ressalva — e a gente diz isso com todas as letras. As outras três dependem de um contexto que foi deixado de fora.',
    colunaA: 'Coluna "Bolsonaro":',
    colunaB: 'Coluna "Lula":',
    selos: { enganoso: "Enganoso", parcial: "Correto, sem contexto", correto: "Correto" },
    linhas: [
      {
        ind: "Comida no mercado", a: "+54,24%", b: "+13,66%",
        txt: "Os dois números batem com o IPCA. O que a tabela não diz é que a primeira janela contém a pandemia, o colapso logístico e a guerra na Ucrânia, e termina no recorde histórico do índice global de alimentos. Além disso, o preço de hoje é o resultado das duas janelas somadas: a comida acumula alta nas duas.",
      },
      {
        ind: "Desemprego", a: "14%+", b: "5,4%",
        txt: "Compara o pico da série (14,9% no 1ºT/2021, auge dos lockdowns) com o valor atual. O governo anterior recebeu 12,7% e entregou 7,9%; o atual recebeu 7,9% e chegou a 5,4%. O 5,4% é real e é o menor da série — o pico de 14,9% é que não é o saldo de ninguém.",
      },
      {
        ind: "Renda média", a: "−R$ 33", b: "+R$ 476",
        txt: "A renda real de fato caiu até 2021 e se recuperou depois — hoje está no maior nível da série (R$ 3.652 no trimestre até jan/2026). Mas a queda coincide com a destruição de postos na pandemia e a alta parte de uma base deprimida. Uma parcela da recuperação é retomada do terreno perdido, não terreno novo.",
      },
      {
        ind: "Imposto de renda", a: "4 anos de tabela congelada", b: "Isenção até R$ 5 mil",
        txt: "Confere. A tabela do IRPF não foi corrigida entre 2019 e 2022, e a Lei 15.270/2025 ampliou a isenção para quem ganha até R$ 5 mil, em vigor desde janeiro de 2026, com cerca de 15 milhões de beneficiados. Ressalva honesta de contexto: o congelamento da tabela começou em 2015, antes do governo anterior.",
      },
      {
        ind: "Salário mínimo", a: "R$ 1.212 (2022)", b: "R$ 1.621 (2026)",
        txt: "Os valores estão corretos. A comparação é nominal, mas neste caso o ganho real também existe: a Lei 14.663/2023 restabeleceu a política de valorização (INPC + PIB de dois anos antes), e o reajuste de 2026 trouxe ganho acima da inflação.",
      },
      {
        ind: "Poder de compra do mínimo", a: "+R$ 214", b: "+R$ 409",
        txt: "É a mesma política de valorização medida em ganho real acumulado. Diferença de método, não de contexto externo: aqui a comparação mede uma escolha de política pública, que é exatamente o que uma comparação entre governos deveria medir.",
      },
    ],
    veredito:
      "A peça não fabrica números — ela seleciona a régua. Onde a comparação mede uma escolha de política pública (imposto de renda, salário mínimo), ela é legítima e nós a confirmamos. Onde ela mede um ciclo global (comida, desemprego, renda), atribuir o resultado à gestão é o erro.",
    fontes:
      "Fontes: IBGE (IPCA Tabela 7060, PNAD Contínua); Lei 15.270/2025 (isenção do IRPF até R$ 5 mil, vigência jan/2026); Lei 14.663/2023 (política de valorização do salário mínimo); Senado Federal e Ministério da Fazenda.",
  },
  escala: {
    eyebrow: "Bloco 3 · A escala 6x1",
    titulo: "Uma proposta em votação não é uma entrega.",
    lead:
      'Aqui é preciso ser justo: o card do site original diz, com todas as letras, "proposta em debate no Congresso". O problema não está no texto do card — está em **onde ele foi colocado**: dentro da seção intitulada *"O que o Lula fez"*, ao lado de medidas que de fato já estão em vigor.',
    narrativaTitulo: '"Fim da escala 6x1" na lista do que já foi feito.',
    narrativaP:
      "O card aparece entre a isenção do imposto de renda (lei em vigor), o Desenrola e a queda da pobreza. A leitura rápida — que é como quase todo mundo lê um site — registra tudo como entregue.",
    contextoTitulo: "Falta a etapa mais difícil: dois turnos no Plenário do Senado.",
    contextoP1:
      "A PEC 221/2019 (com a PEC 8/2025 apensada) avançou de verdade em 2026 e está mais perto do que nunca. Mas precisa de **49 votos em dois turnos no Senado**, e a votação em Plenário **ainda não tem data**, com a oposição obstruindo.",
    contextoP2:
      "Até que isso aconteça, a escala 6x1 segue legal e valendo para quem trabalha sob ela hoje.",
    etapas: [
      { t: "Admissibilidade na CCJ da Câmara", d: "22 de abril de 2026" },
      { t: "Aprovada na Câmara em 2 turnos", d: "27 de maio de 2026" },
      { t: "Chega ao Senado", d: "28 de maio de 2026" },
      { t: "Aprovada na CCJ do Senado", d: "2 de setembro de 2026" },
      { t: "Plenário do Senado — 1º turno (49 votos)", d: "sem data marcada" },
      { t: "Plenário do Senado — 2º turno (49 votos)", d: "não ocorreu" },
      { t: "Promulgação — vira regra constitucional", d: "não ocorreu" },
    ],
    veredito:
      "Promessa em andamento apresentada no lugar de entrega. O avanço é real e recente — e vender futuro como presente é justamente o que corrói a confiança quando a votação emperra.",
    fontes:
      "Fontes: Senado Federal — PEC 221/2019 (aprovação na CCJ em 02/09/2026 e envio ao Plenário); Câmara dos Deputados — aprovação em dois turnos em 27/05/2026; Agência Brasil, setembro de 2026. Situação verificada em {data}.",
  },
  ibge: {
    eyebrow: "Bloco 4 · A credibilidade do IBGE",
    titulo: "O erro não está na planilha. E o problema do IBGE também é real.",
    lead:
      "Circula nas redes que o IBGE estaria fraudando os números. Circula na propaganda que questionar o IBGE é golpismo. As duas coisas são simplificações — e as duas atrapalham quem quer entender o que está acontecendo.",
    tagNao: "O que NÃO se sustenta",
    naoTitulo: '"Os números são inventados."',
    naoP1:
      "Não há qualquer evidência de manipulação do IPCA ou da PNAD. São pesquisas com metodologia pública, microdados abertos, amostra auditável e execução por servidores de carreira. Qualquer pesquisador pode recalcular os índices a partir dos microdados — e isso é feito rotineiramente por universidades, bancos e institutos independentes, que chegam aos mesmos resultados.",
    naoP2:
      "A **reponderação da PNAD Contínua em 2025**, feita para incorporar o Censo 2022, é um procedimento técnico padrão, anunciado com antecedência e aplicado **retroativamente a toda a série** — inclusive aos anos do governo anterior. Ela não cria melhora artificial: recalibra o passado e o presente com a mesma régua.",
    naoP3:
      "E os pesos do IPCA seguem os da POF anterior: a atualização com a nova pesquisa de orçamentos familiares só deve valer a partir de 2027. Ou seja, o índice usado nessa comparação **não foi alterado** por este governo.",
    tagSim: "O que É preocupante",
    simTitulo: "A blindagem institucional se desgastou — e isso é documentado.",
    simP1:
      "Em **19 de janeiro de 2026**, Rebeca Palis, coordenadora responsável pelo cálculo do PIB, foi exonerada. Pelo menos três integrantes da equipe deixaram cargos de confiança em solidariedade.",
    simP2:
      "Em **fevereiro e março de 2026**, o Ministério Público junto ao TCU pediu o afastamento do presidente do IBGE, Márcio Pochmann, alegando risco de uso político dos dados do PIB em ano eleitoral e preocupação com mudanças em metodologias de coleta e tratamento.",
    simP3:
      "Nada disso demonstra que um número tenha sido falsificado. Demonstra que as salvaguardas que tornam a falsificação difícil ficaram mais frágeis — e isso é motivo legítimo de vigilância, não de pânico.",
    veredito:
      "Acusar o IBGE de fraude é injusto com quem produz os dados e desvia a atenção do problema de verdade. O dado é confiável; a régua aplicada sobre ele na propaganda é que é escolhida. Ao mesmo tempo, a crise de governança do instituto é real e merece acompanhamento — inclusive porque a melhor defesa dos números é a autonomia de quem os calcula.",
    fontes:
      "Fontes: IBGE — nota técnica sobre a reponderação da PNAD Contínua em 2025 e Projeções da População pós-Censo 2022; IBGE/POF sobre a atualização dos pesos do IPCA; Correio Braziliense e Gazeta do Povo (março de 2026) sobre a representação do MP junto ao TCU e as exonerações na diretoria de contas nacionais.",
  },
  verdade: {
    eyebrow: "Honestidade nos dois sentidos",
    titulo: "O que a propaganda acerta — e o que ninguém está te contando.",
    lead:
      "Um site de checagem que só encontra erros do outro lado não é checagem, é propaganda com outro nome. Então vamos ser explícitos sobre o que se confirma.",
    colunaAcertos: "✓ O que se confirma",
    colunaOmissoes: "! O que fica de fora dos dois lados",
    acertos: [
      { t: "5,4% é o menor desemprego da série", d: "O recorde da PNAD Contínua, iniciada em 2012, é real. Não há truque no número em si." },
      { t: "A informalidade está caindo", d: "37,5% no trimestre até jan/2026, o menor patamar desde julho de 2020. O contra-argumento de que 'os empregos são todos informais' não se sustenta nos dados." },
      { t: "A renda média está no maior nível da série", d: "R$ 3.652 de rendimento real habitual, +5,4% em um ano. É recorde de fato." },
      { t: "A isenção do IR até R$ 5 mil está em vigor", d: "Lei 15.270/2025, valendo na folha desde 1º de janeiro de 2026, com cerca de 15 milhões de beneficiados." },
      { t: "O salário mínimo teve ganho real", d: "A política de valorização foi restabelecida pela Lei 14.663/2023 e o mínimo de 2026 (R$ 1.621) subiu acima da inflação." },
      { t: "A subutilização caiu muito", d: "13,8% no trimestre até abril de 2026, contra mais de 30% no auge da pandemia. A melhora do mercado de trabalho é ampla, não um artefato de definição." },
    ],
    omissoes: [
      { t: "O preço não voltou, só parou de correr", d: "109 dos 112 produtos da tabela deles seguem mais caros que em janeiro de 2019. Inflação baixa significa que o preço subiu devagar — não que ele desceu." },
      { t: "O café acumula +156% desde 2019", d: "E subiu 48,7% na janela atual, pelos números do próprio site. Alguns itens do dia a dia continuam pesando muito mais no orçamento." },
      { t: "A maré global virou de novo", d: "O índice de alimentos da FAO chegou a 133,3 pontos em agosto de 2026, o maior desde o fim de 2022. O vento de popa de 2023-2024 não é permanente." },
      { t: "O ciclo global explica os dois lados", d: "A mesma lógica que isenta este governo da alta de 2021-2022 isenta o anterior. Quem usa o argumento do contexto precisa aplicá-lo nas duas direções." },
    ],
    ponto:
      "A melhora do mercado de trabalho é real e a desaceleração dos preços é real. O que não é real é a relação de causa que a peça constrói entre uma coisa e a outra, nem a ideia de que o preço da comida voltou ao que era. Dá para reconhecer o resultado sem comprar a explicação.",
    fontes:
      "Fontes: IBGE/PNAD Contínua (desocupação, informalidade, subutilização e rendimento real, divulgações de 2026); Lei 15.270/2025; Lei 14.663/2023; FAO — Índice de Preços de Alimentos, agosto de 2026; e a própria base de produtos publicada em mercadodamentira.com.br.",
  },
  metodologia: {
    eyebrow: "Metodologia",
    titulo: "Como a gente chegou nesses números.",
    itens: [
      { t: "Usamos os números deles", d: "A tabela foi extraída da própria seção “Produto por produto” do site original, em setembro de 2026. Nenhuma variação foi alterada. Removemos apenas 4 rótulos repetidos (o mesmo item do IPCA aparecia com nome curto e nome completo), ficando 112 produtos. A única coluna nova é o acumulado." },
      { t: "Arquivamos a peça original", d: "Uma cópia do site checado foi salva no Internet Archive em 9 de setembro de 2026. Se eles editarem ou tirarem a página do ar, a versão que auditamos continua pública e conferível — o link está nas fontes abaixo." },
      { t: "Encadeamos, não somamos", d: "Para saber onde o preço está hoje em relação a jan/2019, os dois períodos consecutivos se multiplicam: (1+a)×(1+b)−1. Somar as duas variações daria um número errado." },
      { t: "Comparamos começo com começo", d: "Para desemprego e renda, usamos o valor do trimestre em que cada governo assumiu e do trimestre em que entregou — em vez do pior e do melhor ponto da série." },
      { t: "Testamos contra uma série global", d: "O índice de alimentos da FAO funciona como controle: se o mesmo movimento aparece no mundo inteiro, ele não pode ser creditado nem debitado a um governo brasileiro." },
      { t: "Dizemos quando eles estão certos", d: "Três das seis linhas do comparativo original se sustentam. Estão marcadas como corretas, com a fonte legal de cada uma." },
      { t: "Datamos tudo", d: "Indicadores conjunturais mudam. Cada bloco traz a data de verificação, e a página informa a última atualização geral." },
    ],
    tituloFontes: "Fontes primárias",
    fontes: [
      { t: "IBGE · IPCA (Tabela 7060)", u: "https://sidra.ibge.gov.br/tabela/7060" },
      { t: "IBGE · PNAD Contínua", u: "https://www.ibge.gov.br/estatisticas/sociais/trabalho/17270-pnad-continua.html" },
      { t: "FAO · Índice de Preços de Alimentos", u: "https://www.fao.org/worldfoodsituation/foodpricesindex/en/" },
      { t: "Senado · PEC 221/2019", u: "https://www25.senado.leg.br/web/atividade/materias/-/materia/174386" },
      { t: "Planalto · Lei 15.270/2025 (IRPF)", u: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm" },
      { t: "Planalto · Lei 14.663/2023 (salário mínimo)", u: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14663.htm" },
      { t: "Arquivo do site original (09/09/2026)", u: "https://web.archive.org/web/20260909203458/https://mercadodamentira.com.br/" },
    ],
  },
  compartilhe: {
    eyebrow: "Compartilhe",
    titulo: "Essa conta precisa circular.",
    lead:
      "A régua torta viaja rápido porque é simples. O contexto viaja devagar porque exige explicação. Se esta checagem te ajudou a entender o número, ela ajuda outra pessoa também.",
    textoCompartilhado:
      "109 dos 112 produtos que a campanha usa como prova seguem mais caros que em janeiro de 2019. E a conta é feita com os números deles.",
    whatsapp: "WhatsApp",
    postarNoX: "Postar no X",
    copiarLink: "Copiar link",
    linkCopiado: "Link copiado",
    nota: "O texto já vai pronto com o dado principal. Se preferir, escreva o seu — o link é o mesmo.",
  },
  autor: {
    eyebrow: "Quem fez esta checagem",
    nome: "João Pedro Gamin",
    bio1:
      "Fiz este site por conta própria, sem vínculo com partido, campanha, veículo ou órgão público. A motivação foi simples: os números da peça original eram verdadeiros, e mesmo assim a conclusão não se sustentava. Isso é um problema de método, e método dá para demonstrar.",
    bio2:
      "Todo o código e a base de dados estão abertos. Se você achar um erro meu, abra uma issue no repositório — a correção é publicada com a mesma clareza da afirmação original.",
    tituloNumeros: "ESTE PROJETO EM NÚMEROS",
    numeros: [
      { n: "112", k: "produtos auditados" },
      { n: "9", k: "fontes primárias" },
      { n: "5", k: "afirmações checadas" },
      { n: "100%", k: "do código aberto" },
    ],
  },
  footer: {
    marca: "MERCADO DA",
    marcaDestaque: "VERDADE",
    disclaimer:
      "Projeto independente e de autoria identificada, feito por conta própria. **Não é ligado a nenhum partido, campanha, coligação, candidato ou órgão público**, e não é propaganda eleitoral. Não temos qualquer vínculo com os responsáveis pelo site mercadodamentira.com.br, cujo conteúdo é citado aqui apenas para fins de análise crítica e checagem.",
    correcoes:
      "Todos os dados vêm de fontes públicas e oficiais, listadas em cada bloco, e o código-fonte e a base de produtos são abertos: qualquer pessoa pode refazer as contas. Encontrou um erro nosso? Abra uma issue no repositório. A correção é publicada com a mesma clareza da afirmação original — é essa a diferença entre checagem e propaganda.",
    ultimaVerificacao: "Última verificação dos indicadores: {data}.",
    github: "Código e dados no GitHub",
  },
  auditoria: {
    eyebrow: "Produto a produto",
    titulo: '"Mais barato" não quer dizer barato.',
    lead:
      "Pegamos os **{total} produtos** da tabela do site original, com os números deles, sem mudar uma vírgula. E fizemos a única conta que faltava: encadear as duas janelas para saber onde o preço está **hoje** em relação a janeiro de 2019.",
    stats: [
      { n: "{acima} de {total}", k: "produtos continuam mais caros que em janeiro de 2019" },
      { n: "{caiu}", k: "produtos caíram durante a janela 2023-2026" },
      { n: "{aindaCaro} desses {caiu}", k: "caíram, mas seguem acima do preço de 2019" },
      { n: "{abaixo}", k: "produtos estão de fato abaixo do nível de 2019" },
    ],
    buscar: "Buscar produto…",
    filtros: { enganosos: "Caiu, mas ainda caro", acima: "Acima de 2019", todos: "Todos" },
    colunas: { produto: "Produto", janelaA: "Janela 2019-2022", janelaB: "Janela 2023-2026", acumulado: "Preço hoje vs. jan/2019" },
    destaqueTitulo: "Os que mais pesam no bolso hoje",
    verLista: "Ver a lista completa de produtos →",
    modalTitulo: "O seu mercado, item por item",
    modalLead:
      "As duas primeiras linhas de cada card são os números do site original, sem alteração. A terceira é o resultado das duas somadas — e é ela que diz onde o preço está hoje. **Amarelo**: ainda mais caro que em janeiro de 2019. **Verde**: de fato abaixo do preço de 2019.",
    fechar: "Fechar",
    linhaHoje: "Hoje vs. 2019",
    badgeCaro: "Ainda {p} mais caro que em 2019",
    badgeBarato: "Abaixo do preço de 2019",
    vazio: "Nenhum produto encontrado.",
    veredito:
      'O óleo de soja aparece como "mais barato com Lula" (−14,2%). Verdade — e ainda assim ele custa **135% a mais** que em 2019. O arroz caiu 1,9% e segue 47,6% acima. Uma queda depois de uma disparada não devolve o preço: devolve uma fração dele. É por isso que o gráfico melhora e a sensação no caixa do mercado não acompanha.',
    calculo:
      'Cálculo: nível de preço acumulado = ((1 + variação da 1ª janela) × (1 + variação da 2ª janela) − 1). Variações extraídas da seção "Produto por produto" de mercadodamentira.com.br (set/2026), que cita IPCA/IBGE. Ao encadear períodos consecutivos, os índices se multiplicam — não se somam.',
  },
  schema: {
    descricao: "Checagem estatística da propaganda eleitoral sobre custo de vida no Brasil, com dados do IBGE e da FAO.",
    checagens: [
      { claim: "O desemprego caiu de mais de 14% para 5,4% por causa da gestão atual.", rating: "Enganoso: compara o pico da pandemia com o dado atual" },
      { claim: "A comida subiu 4x mais no governo anterior do que no atual.", rating: "Correto no dado, enganoso na causa: omite o ciclo global de alimentos" },
      { claim: "Dezenas de produtos ficaram mais baratos no governo atual.", rating: "Sem contexto: 109 dos 112 produtos seguem acima do preço de jan/2019" },
      { claim: "O fim da escala 6x1 está entre as entregas do governo atual.", rating: "Enganoso: a PEC ainda não foi votada no Plenário do Senado" },
      { claim: "O IBGE estaria fraudando os dados de emprego e inflação.", rating: "Falso: não há evidência de manipulação do IPCA ou da PNAD" },
    ],
  },
  meta: {
    title: "Mercado da Verdade — o dado é real, o contexto foi cortado",
    desc: "Checagem número a número do site mercadodamentira.com.br. Os dados do IBGE são reais — a régua é que foi escolhida: 109 dos 112 produtos seguem acima de 2019.",
    keywords: [
      "mercado da verdade", "checagem de dados", "fact-checking", "IPCA", "IBGE",
      "inflação de alimentos", "desemprego PNAD", "cherry picking estatístico",
      "custo de vida Brasil", "eleições 2026", "escala 6x1", "literacia estatística",
    ],
  },
  // <<SECOES>>
};

export type Dicionario = typeof ptBR;
