import { existsSync } from "node:fs";
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

/**
 * JSON com chaves em ordem alfabetica: a mesma entrada sempre gera os mesmos
 * bytes, entao reprocessar e comparavel por sha256 e o diff do git so mostra o
 * que mudou de fato.
 */
export function jsonEstavel(v: unknown, indent?: number): string {
  const ordenar = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(ordenar);
    if (x && typeof x === "object") {
      return Object.fromEntries(
        Object.keys(x as object).sort().filter((k) => (x as Record<string, unknown>)[k] !== undefined)
          .map((k) => [k, ordenar((x as Record<string, unknown>)[k])]),
      );
    }
    return x;
  };
  return JSON.stringify(ordenar(v), null, indent);
}

export async function lerNdjson<T>(caminho: string): Promise<T[]> {
  if (!existsSync(caminho)) return [];
  const txt = await readFile(caminho, "utf8");
  return txt.split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l) as T);
}

export async function gravarNdjson(caminho: string, itens: unknown[]): Promise<void> {
  await mkdir(dirname(caminho), { recursive: true });
  await writeFile(caminho, itens.map((i) => jsonEstavel(i)).join("\n") + (itens.length ? "\n" : ""), "utf8");
}

export async function acrescentarNdjson(caminho: string, itens: unknown[]): Promise<void> {
  if (!itens.length) return;
  await mkdir(dirname(caminho), { recursive: true });
  await appendFile(caminho, itens.map((i) => jsonEstavel(i)).join("\n") + "\n", "utf8");
}

export async function lerJson<T>(caminho: string, padrao: T): Promise<T> {
  if (!existsSync(caminho)) return padrao;
  return JSON.parse(await readFile(caminho, "utf8")) as T;
}

export async function gravarJson(caminho: string, v: unknown): Promise<void> {
  await mkdir(dirname(caminho), { recursive: true });
  await writeFile(caminho, jsonEstavel(v, 2) + "\n", "utf8");
}
