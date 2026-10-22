// estado.json de cada coleta: em que etapa esta, o que ja foi feito e o que
// falhou. E o que torna o processo retomavel do ponto exato da falha.
import { existsSync } from "node:fs";
import { mkdir, open, readFile, rm, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { gravarJson, lerJson } from "../nucleo/ndjson.ts";
import { caminhos } from "./caminhos.ts";

export const ETAPAS = ["coletar", "arquivar", "normalizar", "comparar", "conferir", "analisar", "revisar", "publicar"] as const;
export type NomeEtapa = (typeof ETAPAS)[number];
export type Escopo = "incremental" | "abertos" | "completo" | "periodo" | "reprocessar";

export type EstadoEtapa = { status: "pendente" | "ok" | "falhou"; inicio?: string; fim?: string; erro?: string; resumo?: Record<string, unknown> };

export type Estado = {
  id: string;
  cidade: string;
  escopo: Escopo;
  anos: number[];
  de?: string;
  ate?: string;
  limite?: number;
  /**
   * Instante (ISO) a partir do qual a coleta para de pedir detalhes e segue o
   * processo com o que tem. O que faltou fica sem detalhe e entra na proxima
   * coleta incremental. Existe por causa do limite de 6 h de um job do Actions.
   */
  prazoAte?: string;
  iniciadoEm: string;
  etapas: Record<NomeEtapa, EstadoEtapa>;
};

/**
 * Progresso fino da coleta (cada tarefa feita, a lista de alvos de detalhe).
 * Pode ter dezenas de milhares de entradas, entao fica ao lado dos brutos,
 * fora do git; o estado.json versionado guarda so as contagens.
 */
export type Progresso = { feitos: string[]; alvosDetalhe?: string[] };

export function novoEstado(e: Omit<Estado, "etapas">): Estado {
  return { ...e, etapas: Object.fromEntries(ETAPAS.map((n) => [n, { status: "pendente" }])) as Estado["etapas"] };
}

const arquivoProgresso = (cidade: string, id: string) => join(caminhos(cidade).brutosDaColeta(id), "progresso.json");

export async function lerProgresso(cidade: string, id: string): Promise<Progresso> {
  return lerJson<Progresso>(arquivoProgresso(cidade, id), { feitos: [] });
}

export async function gravarProgresso(cidade: string, id: string, p: Progresso): Promise<void> {
  await gravarJson(arquivoProgresso(cidade, id), p);
}

const arquivo = (cidade: string, id: string) => join(caminhos(cidade).coleta(id), "estado.json");

export async function lerEstado(cidade: string, id: string): Promise<Estado> {
  const e = await lerJson<Estado | null>(arquivo(cidade, id), null);
  if (!e) throw new Error(`coleta ${id} nao encontrada em ${caminhos(cidade).coletas}`);
  return e;
}

export async function gravarEstado(e: Estado): Promise<void> {
  await gravarJson(arquivo(e.cidade, e.id), e);
}

/** Uma execucao por vez. Trava com mais de 24 h e considerada abandonada. */
export async function travar(cidade: string, id: string): Promise<() => Promise<void>> {
  const t = caminhos(cidade).trava;
  await mkdir(dirname(t), { recursive: true });
  if (existsSync(t) && Date.now() - (await stat(t)).mtimeMs > 24 * 3600_000) await rm(t);
  try {
    const fh = await open(t, "wx");
    await fh.write(`${id} ${process.pid} ${new Date().toISOString()}\n`);
    await fh.close();
  } catch {
    throw new Error(`ja ha uma execucao em andamento (${(await readFile(t, "utf8")).trim()}). Se nao houver, apague ${t}`);
  }
  return async () => { await rm(t, { force: true }); };
}
