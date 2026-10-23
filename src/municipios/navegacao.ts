import type { ItemNav } from "./componentes/Estrutura";

export type PaginaCidade = "visao" | "empenhos" | "credores" | "alteracoes" | "conferencia" | "fontes";

export function navCidade(slug: string, atual: PaginaCidade, ano?: number): ItemNav[] {
  const b = `/municipios/${slug}`;
  const a = ano ? `${b}/${ano}` : b;
  const itens: [PaginaCidade, string, string][] = [
    ["visao", ano ? `${a}/` : `${b}/`, "Visão geral"],
    ["empenhos", ano ? `${a}/empenhos/` : `${b}/`, "Empenhos"],
    ["credores", ano ? `${a}/credores/` : `${b}/`, "Quem recebe"],
    ["alteracoes", `${b}/alteracoes/`, "Alterações"],
    ["conferencia", `${b}/conferencia/`, "Conferência"],
    ["fontes", `${b}/fontes/`, "Fontes"],
  ];
  return [
    ...itens.map(([k, href, rotulo]) => ({ href, rotulo, atual: k === atual })),
    { href: "/municipios/como-ler/", rotulo: "Como ler" },
  ];
}

export type PaginaProjeto = "sobre" | "como-ler" | "metodologia" | "sinais" | "erratas";

export function navProjeto(atual?: PaginaProjeto): ItemNav[] {
  const itens: [PaginaProjeto, string][] = [["sobre", "Sobre"], ["como-ler", "Como ler"], ["metodologia", "Metodologia"], ["sinais", "Sinais"], ["erratas", "Erratas"]];
  return [{ href: "/municipios/erechim/", rotulo: "Erechim" }, ...itens.map(([k, r]) => ({ href: `/municipios/${k}/`, rotulo: r, atual: k === atual }))];
}

export const hrefOrgao = (slug: string, ano: number, codigo: string) => `/municipios/${slug}/${ano}/orgao/${codigo}/`;
export const hrefCredor = (slug: string, ano: number, credorSlug: string) => `/municipios/${slug}/${ano}/credor/${credorSlug}/`;
export const hrefEmpenho = (slug: string, ano: number, numero: number) => `/municipios/${slug}/${ano}/empenhos/?n=${numero}`;
