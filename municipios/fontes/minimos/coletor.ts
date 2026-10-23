// Minimos constitucionais nos sistemas federais: educacao no SIOPE (FNDE),
// saude no SIOPS (Ministerio da Saude). Os dois recebem o que a propria
// prefeitura declara e homologa a cada bimestre, e servem a qualquer municipio
// do pais: so o codigo IBGE muda. Uma requisicao por area e bimestre encerrado;
// toda resposta vai para o WARC antes de ser lida.
import type { Cliente } from "../../nucleo/http.ts";
import type { Minimo } from "../../nucleo/esquema.ts";

export const SIOPE = "https://www.fnde.gov.br/olinda-ide/servico/DADOS_ABERTOS_SIOPE/versao/v1/odata";
export const SIOPS = "https://siops-consulta-publica-api.saude.gov.br/v1";

/**
 * O SIOPS nao numera os periodos de 1 a 6. Conferido em 23/10/2026 pela receita
 * acumulada de cada um: 12 e 14 sao os dois primeiros bimestres, 1 o primeiro
 * semestre, 18 e 20 o 4º e o 5º bimestres, 2 o ano inteiro.
 */
export const PERIODO_SIOPS: Record<number, number> = { 1: 12, 2: 14, 3: 1, 4: 18, 5: 20, 6: 2 };

/** Os dois sistemas usam o codigo IBGE de 6 digitos (sem o verificador): 4307005 -> 430700. */
export const ibge6 = (ibge: string) => ibge.slice(0, 6);

export const urlSiope = (municipio: string, uf: string, ano: number, bimestre: number) =>
  `${SIOPE}/Indicadores_Siope(Ano_Consulta=${ano},Num_Peri=${bimestre},Sig_UF='${uf}')?%24filter=COD_MUNI%20eq%20${municipio}&%24format=json`;

export const urlSiops = (municipio: string, ano: number, bimestre: number) =>
  `${SIOPS}/indicador/municipal/${municipio}/${ano}/${PERIODO_SIOPS[bimestre]}`;

/** Bimestres ja encerrados: antes do fim do bimestre nao ha o que declarar. */
export function bimestresEncerrados(ano: number, hoje: Date): number[] {
  const y = hoje.getUTCFullYear(), m = hoje.getUTCMonth() + 1;
  if (ano > y) return [];
  return [1, 2, 3, 4, 5, 6].filter((b) => ano < y || 2 * b < m);
}

export const TIPO_ETIQUETA: Record<Minimo["area"], string> = { educacao: "siope-indicadores", saude: "siops-indicadores" };

export async function coletarMinimo(cliente: Cliente, q: { area: Minimo["area"]; municipio: string; uf: string; ano: number; bimestre: number }): Promise<void> {
  const url = q.area === "educacao" ? urlSiope(q.municipio, q.uf, q.ano, q.bimestre) : urlSiops(q.municipio, q.ano, q.bimestre);
  await cliente.requisitar({
    metodo: "GET", url,
    headers: { Accept: "application/json" },
    // o SIOPS responde 404 "Dados não homologado(s)" para o bimestre ainda nao declarado
    aceitar: [404],
    etiqueta: { tipo: TIPO_ETIQUETA[q.area], params: { ano: q.ano, bimestre: q.bimestre, municipio: q.municipio }, urlOficial: url },
  });
}
