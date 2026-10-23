// Textos das paginas de transparencia. Marcacao do Rico (src/i18n/rich.tsx):
// **negrito**, *italico* e [rotulo](url). Nada de HTML cru.
// Regra: cada pagina cabe em uma tela; o aprofundamento vai em `mais`.

export type Bloco = { id?: string; titulo: string; texto: string; mais?: string };
export type PaginaTexto = { titulo: string; lead: string; blocos: Bloco[] };

export const SOBRE: PaginaTexto = {
  titulo: "Por que isso existe",
  lead: "A lei obriga a prefeitura a publicar como gasta o dinheiro. Publicar não é o mesmo que mostrar: no portal, cada empenho é uma página, 15 por vez, sem como somar nem cruzar. Aqui, os mesmos dados viram algo que dá para ler.",
  blocos: [
    {
      titulo: "Os números são da prefeitura",
      texto: "Não estimamos, não corrigimos e não removemos nada. Cada valor vem do Portal da Transparência da prefeitura e traz o link para a página oficial, a data da coleta e a cópia arquivada. O que calculamos (por habitante, participação, prazos) aparece rotulado como **calculado por nós**, com a fórmula.",
    },
    {
      titulo: "O critério é o método, não o lado",
      texto: "Mostramos os sinais de atenção e, no mesmo nível, o que está em ordem. Um sinal é um convite a verificar, nunca uma acusação, e cada um explica a regra e o que ela **não** prova.",
    },
    {
      titulo: "A base legal",
      texto: "Republicar dados públicos é exercício do direito à informação e da liberdade de expressão (Constituição, art. 5º, IV, IX e XIV) e decorre da publicidade da administração (art. 37). A [Lei de Acesso à Informação](https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm) (art. 8º) e a [Lei Complementar 131/2009](https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp131.htm) obrigam a publicação em tempo real. Documentos públicos não podem ser destruídos ([Lei 8.159/1991](https://www.planalto.gov.br/ccivil_03/leis/l8159.htm), art. 25).",
    },
    {
      titulo: "Errou? Corrigimos com a mesma clareza",
      texto: "Correção em projeto de checagem não é constrangimento, é o produto. Toda correção vai para a página de [erratas](/municipios/erratas/), com data e o que mudou. Quem for citado tem direito de resposta.",
    },
    {
      titulo: "Quem faz",
      texto: "Um projeto lateral do [Mercado da Verdade](/), com código aberto no [GitHub](https://github.com/joaogamin/mercado-da-verdade). Código sob MIT, análise sob CC BY 4.0.",
    },
  ],
};

export const COMO_LER: PaginaTexto = {
  titulo: "Como ler cada número",
  lead: "Todo gasto público passa por três etapas. Entender a diferença entre elas é o que impede a leitura errada.",
  blocos: [
    {
      id: "empenho", titulo: "1. Empenho: o dinheiro é reservado",
      texto: "A prefeitura separa o valor no orçamento para um credor e um objeto. **Empenhado ainda não é gasto**: é um compromisso. Pode ser anulado depois, total ou parcialmente.",
      mais: "Há empenhos por estimativa (ex.: conta de água do ano inteiro), que reservam um valor e são consumidos aos poucos. Por isso o empenhado de janeiro costuma ser alto.",
    },
    {
      id: "anulacao", titulo: "Anulação: o que foi reservado e não usado",
      texto: "Quando um empenho não vai ser usado por inteiro, a prefeitura anula o saldo. A lista de empenhos do portal continua mostrando o **valor original**; o detalhe mostra o **valor atual**, já descontada a anulação, e o balancete também. No explorador, empenhos anulados aparecem com as três linhas: original, anulado e atual.",
      mais: "Exemplo real: o empenho 2025/3385 reservou R$ 299.980,00 e foi anulado por inteiro (valor atual R$ 0,00, nada liquidado). Somar a lista sem descontar as anulações superestima o gasto em cerca de 5% ao ano.",
    },
    {
      id: "liquidacao", titulo: "2. Liquidação: a entrega é conferida",
      texto: "Alguém da prefeitura atesta que o material chegou ou o serviço foi feito, com base no documento fiscal. Só o que foi liquidado pode ser pago.",
    },
    {
      id: "pagamento", titulo: "3. Pagamento: o dinheiro sai do caixa",
      texto: "O valor é transferido ao credor. A diferença entre liquidado e pago é o que a prefeitura deve e ainda não pagou.",
    },
    {
      id: "restos", titulo: "Restos a pagar",
      texto: "O que foi empenhado num ano e só é pago nos anos seguintes. Aparece como **pago em restos**, e já está dentro do pago de cada empenho.",
      mais: "Por isso o pago da lista de empenhos é maior que o pago do balancete de um ano já fechado: a lista soma tudo o que cada empenho recebeu, em qualquer ano, e o balancete só o que saiu dentro do ano. Descontado o pago em restos, os dois batem ao centavo. É assim que conferimos os dados.",
    },
    {
      id: "dotacao", titulo: "Dotação",
      texto: "Quanto o orçamento autorizou gastar. A **dotação inicial** é a da lei orçamentária; a **atualizada** deveria somar os créditos abertos durante o ano.",
      mais: "No portal de Erechim, a dotação atualizada aparece igual à inicial em todos os órgãos, enquanto o empenhado passa dela. Tratamos isso como problema de exibição do portal, não como gasto sem autorização, até conferir com os relatórios fiscais. Ver a página de conferência.",
    },
    {
      id: "conta", titulo: "A conta orçamentária, decodificada",
      texto: "Cada empenho tem uma conta como 05.01.04.129.0005.2017.3.3.90.40.06. Lida em partes: órgão **05** (Fazenda) · unidade **01** · função **04** (administração) · subfunção **129** (receitas) · programa **0005** · ação **2017** · natureza **3.3.90.40** (serviços de TI) · desdobramento **06** (locação de software). É o empenho 2025/3600.",
    },
    {
      id: "modalidade", titulo: "Como foi contratado",
      texto: "**Com disputa**: pregão, concorrência e similares. **Direto**: dispensa (valor baixo, emergência e outros casos da lei) e inexigibilidade (quando não há como competir). Folha e encargos não passam por licitação.",
    },
    {
      id: "credor", titulo: "Credor",
      texto: "Quem recebe: empresa (CNPJ), pessoa (CPF, que o portal mostra mascarado) ou a própria folha de pagamento, que o portal agrega como um credor só.",
    },
  ],
};

export const METODOLOGIA: PaginaTexto = {
  titulo: "Como chegamos nos números",
  lead: "Quatro passos, sempre na mesma ordem, sempre com o código aberto.",
  blocos: [
    {
      titulo: "1. Coletamos e arquivamos",
      texto: "Lemos o portal como um cidadão leria, devagar (uma requisição por segundo), e gravamos cada resposta byte a byte no formato padrão de arquivamento web (WARC). O manifesto da coleta recebe um carimbo de tempo no Bitcoin (OpenTimestamps), e as cópias vão para instituições independentes.",
      mais: "A prova é guardada antes de qualquer análise. Se o portal mudar ou apagar algo, a versão coletada continua conferível. Ver [fontes](/municipios/erechim/fontes/).",
    },
    {
      titulo: "2. Organizamos sem alterar",
      texto: "Os arquivos viram uma tabela por empenho com os mesmos valores do portal. Juntamos três páginas oficiais (a lista, o detalhe e a API) pelo número do empenho.",
      mais: "Toda transformação é registrada. Valores ficam em centavos inteiros para não haver erro de arredondamento.",
    },
    {
      titulo: "3. Conferimos",
      texto: "Somamos os empenhos e comparamos com o balancete que a própria prefeitura publica. Se a diferença passa de 0,5%, nada é publicado sem revisão humana.",
    },
    {
      titulo: "4. Analisamos com réguas justas",
      texto: "Valor por habitante, participação no total, mesmo período contra mesmo período. Os sinais de atenção têm regra pública, e ao lado deles fica o que está em ordem.",
    },
    {
      titulo: "O que não fazemos",
      texto: "Não inventamos, não estimamos, não removemos nada. Não buscamos dados de pessoas físicas em outras fontes. O CPF aparece mascarado como nas telas da prefeitura; quando o nome de um MEI traz o CPF do titular, mascaramos no mesmo padrão e avisamos.",
    },
    {
      titulo: "Como reproduzir",
      texto: "Tudo roda com um comando (npm run municipio -- erechim atualizar). O mesmo comando, agendado ou à mão, passa por oito etapas fixas: coletar, arquivar, normalizar, comparar, conferir, analisar, revisar e publicar. O código está no [GitHub](https://github.com/joaogamin/mercado-da-verdade).",
    },
  ],
};

export const SINAIS_INTRO: PaginaTexto = {
  titulo: "Como cada sinal é calculado",
  lead: "Um sinal aponta onde olhar. Não diz que há irregularidade. Cada um traz a regra, a base e o que ele não prova.",
  blocos: [],
};

export const ERRATAS: PaginaTexto = {
  titulo: "Erratas",
  lead: "Toda correção fica registrada aqui, com data, o que estava errado e o que mudou.",
  blocos: [
    {
      titulo: "22/10/2026 · Balancete de 2025 trocado pelo de 2026 (antes da publicação)",
      texto: "Na investigação inicial, a primeira exportação do balancete por órgão devolveu o exercício de 2026 em vez de 2025, porque a tela do portal exporta o estado da sessão, e não o filtro enviado. Os números de 2026 chegaram a ser usados num rascunho como se fossem de 2025. A coleta passou a conferir se o arquivo exportado corresponde à pesquisa feita e recusa o que não bate.",
    },
  ],
};
