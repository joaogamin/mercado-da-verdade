// Leitura de dados/municipios/ no build (server components). Tudo e lido do
// disco versionado — o build nunca consulta a prefeitura — e guardado em cache
// por processo, porque varias paginas leem o mesmo exercicio.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { CIDADES } from "@pipeline/cidades/index.ts";
import type { ConfigCidade } from "@pipeline/cidades/tipos.ts";
import type { Exercicio } from "@pipeline/analise/agregar.ts";
import type { Conferencia } from "@pipeline/analise/conferencia.ts";
import type { Manifesto } from "@pipeline/arquivo/manifesto.ts";
import type { Empenho, Evento } from "@pipeline/nucleo/esquema.ts";
import type { Estado } from "@pipeline/processo/estado.ts";

const RAIZ = join(process.cwd(), "dados", "municipios");
const cache = new Map<string, unknown>();

function lembrar<T>(chave: string, ler: () => T): T {
  if (!cache.has(chave)) cache.set(chave, ler());
  return cache.get(chave) as T;
}

const json = <T,>(caminho: string, padrao: T): T => (existsSync(caminho) ? (JSON.parse(readFileSync(caminho, "utf8")) as T) : padrao);
const ndjson = <T,>(caminho: string): T[] =>
  existsSync(caminho) ? readFileSync(caminho, "utf8").split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l) as T) : [];

export function cidade(slug: string): ConfigCidade | undefined {
  return CIDADES.find((c) => c.slug === slug);
}

/** Cidades com analise ja gerada (as outras nao tem pagina). */
export function cidadesComDados(): ConfigCidade[] {
  return CIDADES.filter((c) => existsSync(join(RAIZ, c.slug, "analise")));
}

/** Exercicios da entidade padrao da cidade, do mais recente ao mais antigo. */
export function anos(slug: string): number[] {
  return lembrar(`anos:${slug}`, () => {
    const c = cidade(slug);
    const dir = join(RAIZ, slug, "analise");
    if (!c || !existsSync(dir)) return [];
    const ent = c.entidades[0].id;
    return readdirSync(dir)
      .map((a) => new RegExp(`^${ent}-(\\d{4})\\.json$`).exec(a)?.[1])
      .filter((x): x is string => !!x).map(Number).sort((a, b) => b - a);
  });
}

export function exercicio(slug: string, ano: number): Exercicio | null {
  return lembrar(`ex:${slug}:${ano}`, () => {
    const c = cidade(slug);
    if (!c) return null;
    return json<Exercicio | null>(join(RAIZ, slug, "analise", `${c.entidades[0].id}-${ano}.json`), null);
  });
}

export function conferencia(slug: string): Conferencia | null {
  return lembrar(`conf:${slug}`, () => json<Conferencia | null>(join(RAIZ, slug, "conferencia.json"), null));
}

export function eventos(slug: string): Evento[] {
  return lembrar(`ev:${slug}`, () => ndjson<Evento>(join(RAIZ, slug, "eventos.ndjson")));
}

export type ResumoColeta = { id: string; estado: Estado | null; manifesto: Manifesto | null; carimbada: boolean };

export function coletas(slug: string): ResumoColeta[] {
  return lembrar(`coletas:${slug}`, () => {
    const dir = join(RAIZ, slug, "coletas");
    if (!existsSync(dir)) return [];
    return readdirSync(dir).sort().reverse().map((id) => ({
      id,
      estado: json<Estado | null>(join(dir, id, "estado.json"), null),
      manifesto: json<Manifesto | null>(join(dir, id, "manifesto.json"), null),
      carimbada: existsSync(join(dir, id, "manifesto.json.ots")),
    }));
  });
}

// Parametros das rotas, de baixo para cima: cada rota filha enumera todos os
// segmentos, sem depender do generateStaticParams do pai.
export function paramsAnos() {
  return cidadesComDados().flatMap((c) => anos(c.slug).map((a) => ({ municipio: c.slug, ano: String(a) })));
}

export function paramsOrgaos() {
  return paramsAnos().flatMap((p) => (exercicio(p.municipio, Number(p.ano))?.orgaos ?? []).map((o) => ({ ...p, orgao: o.codigo })));
}

export function paramsCredores() {
  return paramsAnos().flatMap((p) => (exercicio(p.municipio, Number(p.ano))?.credores ?? []).map((c) => ({ ...p, credor: c.slug })));
}

/** Empenhos normalizados de um exercicio (lidos uma vez por processo). */
export function empenhos(slug: string, ano: number): Empenho[] {
  return lembrar(`emp:${slug}:${ano}`, () => {
    const dir = join(RAIZ, slug, "normalizado", String(ano));
    if (!existsSync(dir)) return [];
    return readdirSync(dir).filter((a) => /^empenhos-\d{2}\.ndjson$/.test(a)).sort().flatMap((a) => ndjson<Empenho>(join(dir, a)));
  });
}
