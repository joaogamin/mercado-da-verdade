// Nomes dos elementos de despesa (o "em que" do gasto), da classificacao
// nacional: Portaria Interministerial STN/SOF 163/2001, Anexo II. A prefeitura
// publica o codigo e o nome do desdobramento; o nome do elemento vem daqui.
export const FONTE_ELEMENTOS = "Portaria Interministerial STN/SOF nº 163/2001, Anexo II";

const NOMES: Record<string, string> = {
  "01": "Aposentadorias e reformas",
  "03": "Pensões",
  "04": "Contratação por tempo determinado",
  "05": "Outros benefícios previdenciários",
  "07": "Contribuição a entidades fechadas de previdência",
  "08": "Outros benefícios assistenciais",
  "11": "Vencimentos e vantagens fixas (pessoal civil)",
  "13": "Obrigações patronais",
  "14": "Diárias (civil)",
  "16": "Outras despesas variáveis (pessoal civil)",
  "18": "Auxílio financeiro a estudantes",
  "21": "Juros da dívida por contrato",
  "22": "Outros encargos da dívida por contrato",
  "30": "Material de consumo",
  "31": "Premiações culturais, artísticas, científicas e desportivas",
  "32": "Material, bem ou serviço para distribuição gratuita",
  "33": "Passagens e despesas com locomoção",
  "34": "Outras despesas de pessoal de contratos de terceirização",
  "35": "Serviços de consultoria",
  "36": "Outros serviços de terceiros (pessoa física)",
  "37": "Locação de mão de obra",
  "39": "Outros serviços de terceiros (pessoa jurídica)",
  "40": "Serviços de tecnologia da informação e comunicação (PJ)",
  "41": "Contribuições",
  "42": "Auxílios",
  "43": "Subvenções sociais",
  "45": "Subvenções econômicas",
  "46": "Auxílio-alimentação",
  "47": "Obrigações tributárias e contributivas",
  "48": "Outros auxílios financeiros a pessoas físicas",
  "49": "Auxílio-transporte",
  "51": "Obras e instalações",
  "52": "Equipamentos e material permanente",
  "61": "Aquisição de imóveis",
  "70": "Rateio pela participação em consórcio público",
  "71": "Principal da dívida contratual resgatado",
  "81": "Distribuição constitucional ou legal de receitas",
  "91": "Sentenças judiciais",
  "92": "Despesas de exercícios anteriores",
  "93": "Indenizações e restituições",
  "94": "Indenizações e restituições trabalhistas",
  "96": "Ressarcimento de despesas de pessoal requisitado",
  "97": "Aporte para cobertura do déficit atuarial do RPPS",
};

/** "3.3.90.40" -> "Serviços de tecnologia da informação e comunicação (PJ)" */
export function nomeDoElemento(elemento: string): string {
  return NOMES[elemento.split(".")[3] ?? ""] ?? `Elemento ${elemento}`;
}
