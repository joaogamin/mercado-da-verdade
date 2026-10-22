import type { ConfigCidade } from "./tipos.ts";

// Codigos de entidade conferidos em 22/10/2026: o select das telas, a API e o
// detalhe do empenho usam numeracoes diferentes para a mesma entidade.
export const ERECHIM: ConfigCidade = {
  slug: "erechim",
  nome: "Erechim",
  uf: "RS",
  ibge: "4307005",
  fonte: {
    tipo: "system-sys523",
    base: "https://www.erechim.rs.gov.br",
    baseApi: "https://www.erechim.rs.gov.br:8181",
    contexto: "/sys523",
  },
  entidades: [
    { id: "prefeitura", nome: "Prefeitura Municipal de Erechim", codigos: { tela: "0", api: "1", detalhe: "1" } },
  ],
  anoInicial: 2025,
  // Consultado em 22/10/2026 na API de agregados do IBGE.
  populacao: [
    { ano: 2025, valor: 109609, fonte: "IBGE · estimativa da população (tabela 6579)", url: "https://sidra.ibge.gov.br/tabela/6579" },
    { ano: 2026, valor: 109610, fonte: "IBGE · estimativa da população (tabela 6579)", url: "https://sidra.ibge.gov.br/tabela/6579" },
  ],
  coleta: { intervaloTelasMs: 1000, intervaloApiMs: 61_000 },
  portoes: {
    divergenciaMaximaPct: 0.5,
    camposSensiveis: ["data", "credor.nome", "credor.documento", "empenhado", "especificacao", "classificacao.conta", "licitacao", "contrato"],
    avisosMaximos: 0,
    quedaMaximaPct: 0.5,
  },
};
