// Etapa 2: o manifesto lista cada arquivo bruto da coleta com tamanho e sha256,
// e e ele que recebe o carimbo de tempo. Carimbar o manifesto prova a data de
// todos os arquivos de uma vez.
import { existsSync } from "node:fs";
import { readFile, stat, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import { sha256 } from "../nucleo/hash.ts";
import { gravarJson, jsonEstavel } from "../nucleo/ndjson.ts";
import { lerWarc } from "../nucleo/warc.ts";
import { caminhos } from "../processo/caminhos.ts";
import { warcsDaColeta } from "../processo/normalizar.ts";
import type { Estado } from "../processo/estado.ts";
import { carimbar } from "./carimbo.ts";

export type Manifesto = {
  coleta: string;
  cidade: string;
  escopo: string;
  anos: number[];
  iniciadoEm: string;
  arquivos: { nome: string; bytes: number; sha256: string; publico: boolean; motivo?: string }[];
  registros: Record<string, number>;
  /** "Atualizado em" mostrado pelo proprio portal nas telas exportadas. */
  portalAtualizadoEm: string[];
};

export async function gerarManifesto(estado: Estado): Promise<Manifesto> {
  const arquivos: Manifesto["arquivos"] = [];
  const registros: Record<string, number> = {};
  const atualizado = new Set<string>();
  for (const caminho of warcsDaColeta(estado.cidade, estado.id)) {
    const nome = basename(caminho);
    const bytes = await readFile(caminho);
    const api = nome.startsWith("api");
    arquivos.push({
      nome,
      bytes: (await stat(caminho)).size,
      sha256: sha256(bytes),
      publico: !api,
      ...(api ? { motivo: "A API devolve o CPF completo de pessoas físicas; o original fica em guarda privada e só o hash é público." } : {}),
    });
    for await (const r of lerWarc(caminho)) {
      registros[r.etiqueta.tipo] = (registros[r.etiqueta.tipo] ?? 0) + 1;
      const p = r.etiqueta.params.portalAtualizadoEm;
      if (p) atualizado.add(String(p));
    }
  }
  return {
    coleta: estado.id, cidade: estado.cidade, escopo: estado.escopo, anos: estado.anos, iniciadoEm: estado.iniciadoEm,
    arquivos, registros, portalAtualizadoEm: [...atualizado].sort(),
  };
}

export async function arquivar(estado: Estado): Promise<Record<string, unknown>> {
  const dir = caminhos(estado.cidade).coleta(estado.id);
  const m = await gerarManifesto(estado);
  const caminho = join(dir, "manifesto.json");
  await gravarJson(caminho, m);

  const conteudo = new TextEncoder().encode(jsonEstavel(m, 2) + "\n");
  const ots = join(dir, "manifesto.json.ots");
  let carimbo: Record<string, unknown> = { situacao: "existente" };
  if (!existsSync(ots)) {
    try {
      const r = await carimbar(conteudo);
      await writeFile(ots, r.ots);
      carimbo = { situacao: "pendente-no-bitcoin", calendarios: r.calendarios, falhas: r.falhas };
    } catch (e) {
      // sem carimbo nao e fatal (a prova ainda existe), mas a revisao mostra
      carimbo = { situacao: "falhou", erro: (e as Error).message };
    }
  }
  return { manifesto: m.arquivos.map((a) => `${a.nome} ${a.sha256.slice(0, 12)}…`), registros: m.registros, carimbo };
}
