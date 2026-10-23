// A base normalizada versionada: empenhos particionados por ano e mes (so os
// meses que mudam aparecem no diff), um balancete por exercicio e os minimos
// constitucionais declarados aos sistemas federais (fonte complementar).
import { existsSync } from "node:fs";
import { readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import type { Balancete, Empenho, Minimo } from "../nucleo/esquema.ts";
import { gravarJson, gravarNdjson, lerJson, lerNdjson } from "../nucleo/ndjson.ts";
import { caminhos } from "./caminhos.ts";
import { agruparPor } from "../nucleo/agrupar.ts";

export type Base = {
  empenhos: Map<string, Empenho>;
  balancetes: Map<string, Balancete>;
  minimos: Map<string, Minimo>;
};

export const chaveBalancete = (entidade: string, ano: number) => `${entidade}-${ano}`;
export const chaveMinimo = (m: Pick<Minimo, "area" | "ano" | "bimestre">) => `${m.area}-${m.ano}-${m.bimestre}`;

export function baseVazia(): Base {
  return { empenhos: new Map(), balancetes: new Map(), minimos: new Map() };
}

export async function carregarBase(cidade: string): Promise<Base> {
  const { normalizado } = caminhos(cidade);
  const base = baseVazia();
  if (!existsSync(normalizado)) return base;
  for (const ano of (await readdir(normalizado)).sort()) {
    const dir = join(normalizado, ano);
    for (const arq of (await readdir(dir)).sort()) {
      if (/^empenhos-\d{2}\.ndjson$/.test(arq)) {
        for (const e of await lerNdjson<Empenho>(join(dir, arq))) base.empenhos.set(e.id, e);
      } else if (/^balancete-orgaos-.+\.json$/.test(arq)) {
        const b = await lerJson<Balancete | null>(join(dir, arq), null);
        if (b) base.balancetes.set(chaveBalancete(b.entidade, b.ano), b);
      } else if (arq === "minimos.json") {
        for (const m of await lerJson<Minimo[]>(join(dir, arq), [])) base.minimos.set(chaveMinimo(m), m);
      }
    }
  }
  return base;
}

export function clonarBase(b: Base): Base {
  return {
    empenhos: new Map(structuredClone([...b.empenhos])),
    balancetes: new Map(structuredClone([...b.balancetes])),
    minimos: new Map(structuredClone([...b.minimos])),
  };
}

/** Regrava a base inteira de forma deterministica. Devolve os arquivos gravados. */
export async function gravarBase(cidade: string, base: Base): Promise<string[]> {
  const { normalizado } = caminhos(cidade);
  const particoes = agruparPor(base.empenhos.values(), (e) => join(String(e.ano), `empenhos-${e.data.slice(5, 7)}.ndjson`));
  if (existsSync(normalizado)) await rm(normalizado, { recursive: true });
  const gravados: string[] = [];
  for (const [k, lista] of [...particoes].sort(([a], [b]) => a.localeCompare(b))) {
    lista.sort((a, b) => a.entidade.localeCompare(b.entidade) || a.numero - b.numero);
    await gravarNdjson(join(normalizado, k), lista);
    gravados.push(k);
  }
  for (const b of base.balancetes.values()) {
    const k = join(String(b.ano), `balancete-orgaos-${b.entidade}.json`);
    await gravarJson(join(normalizado, k), b);
    gravados.push(k);
  }
  for (const [ano, lista] of [...agruparPor(base.minimos.values(), (m) => String(m.ano))].sort(([a], [b]) => a.localeCompare(b))) {
    lista.sort((a, b) => a.area.localeCompare(b.area) || a.bimestre - b.bimestre);
    const k = join(ano, "minimos.json");
    await gravarJson(join(normalizado, k), lista);
    gravados.push(k);
  }
  return gravados;
}
