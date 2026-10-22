import { join, resolve } from "node:path";

/**
 * Raiz do repositorio (municipios/ fica um nivel abaixo). Dentro do bundle do
 * Next nao ha import.meta.dirname; la o build sempre roda na raiz.
 */
export const RAIZ = import.meta.dirname ? resolve(import.meta.dirname, "..", "..") : process.cwd();

export function caminhos(cidade: string) {
  const dados = join(RAIZ, "dados", "municipios", cidade);
  return {
    dados,
    /** GITIGNORED: WARC local. */
    brutos: join(dados, "brutos"),
    brutosDaColeta: (id: string) => join(dados, "brutos", id),
    coletas: join(dados, "coletas"),
    coleta: (id: string) => join(dados, "coletas", id),
    normalizado: join(dados, "normalizado"),
    eventos: join(dados, "eventos.ndjson"),
    conferencia: join(dados, "conferencia.json"),
    analise: join(dados, "analise"),
    trava: join(dados, ".trava"),
    /** Gerado no prebuild a partir de dados/ (sem rede). */
    publico: join(RAIZ, "public", "dados", "municipios", cidade),
  };
}
