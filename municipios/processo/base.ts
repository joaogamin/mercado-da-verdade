// A base normalizada versionada: empenhos particionados por ano e mes (so os
// meses que mudam aparecem no diff) e um balancete por exercicio.
import { existsSync } from "node:fs";
import { readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import type { Balancete, Empenho } from "../nucleo/esquema.ts";
import { gravarJson, gravarNdjson, lerJson, lerNdjson } from "../nucleo/ndjson.ts";
import { caminhos } from "./caminhos.ts";
import { agruparPor } from "../nucleo/agrupar.ts";

export type Base = {
  empenhos: Map<string, Empenho>;
  balancetes: Map<string, Balancete>;
};

export const chaveBalancete = (entidade: string, ano: number) => `${entidade}-${ano}`;

export function baseVazia(): Base {
  return { empenhos: new Map(), balancetes: new Map() };
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
      }
    }
  }
  return base;
}

export function clonarBase(b: Base): Base {
  return { empenhos: new Map(structuredClone([...b.empenhos])), balancetes: new Map(structuredClone([...b.balancetes])) };
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
  return gravados;
}
