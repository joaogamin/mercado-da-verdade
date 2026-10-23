// O processo linear: as mesmas etapas, sempre nesta ordem, agendado ou a mao.
//
//   1 coletar → 2 arquivar → 3 normalizar → 4 comparar → 5 conferir → 6 analisar → 7 revisar → 8 publicar
//
// `atualizar` roda de 1 a 7 e para: publicar e o merge do PR (feito pelo
// workflow, ou a mao). 3 e 4 trabalham em memoria e so 4 grava a base; por
// isso, retomar a partir de 4 refaz a 3 antes (sem rede, e idempotente).
import { existsSync } from "node:fs";
import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { comparar } from "../nucleo/diff.ts";
import type { Evento } from "../nucleo/esquema.ts";
import { acrescentarNdjson, gravarJson, gravarNdjson, lerJson, lerNdjson } from "../nucleo/ndjson.ts";
import type { ConfigCidade } from "../cidades/tipos.ts";
import { fonteSystem } from "../fontes/system-sys523/leitor.ts";
import { FONTES_MINIMOS } from "../fontes/minimos/leitor.ts";
import { conferir, type Conferencia } from "../analise/conferencia.ts";
import { analisar } from "../analise/agregar.ts";
import { arquivar } from "../arquivo/manifesto.ts";
import { baseVazia, carregarBase, clonarBase, gravarBase, type Base } from "./base.ts";
import { caminhos } from "./caminhos.ts";
import { coletar } from "./coletar.ts";
import { ETAPAS, gravarEstado, type Estado, type NomeEtapa } from "./estado.ts";
import { incorporar, type ResultadoNormalizacao } from "./normalizar.ts";
import { avaliarPortoes, varrerPrivacidade, type Portao } from "./portoes.ts";
import { gerarRevisao } from "./revisao.ts";

type PorColeta = { eventos: Evento[]; avisos: string[]; divergencias: string[]; soNaApi: number };
type Dobra = PorColeta & { antes: Base; depois: Base; porColeta: Map<string, PorColeta> };

export type Contexto = { cfg: ConfigCidade; estado: Estado; log: (s: string) => void; dobra?: Dobra };

/** "2026-10-22T213005Z" -> "2026-10-22T21:30:05Z" */
export const instanteDaColeta = (id: string) => id.replace(/T(\d{2})(\d{2})(\d{2})Z$/, "T$1:$2:$3Z");

const totaisPorExercicio = (b: Base) => {
  const m = new Map<string, number>();
  for (const e of b.empenhos.values()) if (!e.removidoEm) m.set(`${e.entidade}-${e.ano}`, (m.get(`${e.entidade}-${e.ano}`) ?? 0) + e.empenhado);
  return m;
};

async function todasAsColetas(cidade: string): Promise<string[]> {
  const dir = caminhos(cidade).brutos;
  return existsSync(dir) ? (await readdir(dir)).filter((d) => /^\d{4}-\d{2}-\d{2}T\d{6}Z$/.test(d)).sort() : [];
}

/**
 * Etapas 3+4 como uma dobra: comecando de uma base, incorpora cada coleta em
 * ordem e compara com o passo anterior. A coleta normal e um passo so; o
 * reprocessamento e a dobra inteira desde a base vazia — o mesmo codigo.
 */
async function dobrar(ctx: Contexto): Promise<Dobra> {
  const { cfg, estado } = ctx;
  const fontes = [fonteSystem(cfg.fonte.base), ...FONTES_MINIMOS];
  const reprocessar = estado.escopo === "reprocessar";
  const antes = await carregarBase(cfg.slug);
  const atual = reprocessar ? baseVazia() : clonarBase(antes);
  const coletas = reprocessar ? await todasAsColetas(cfg.slug) : [estado.id];
  const d: Dobra = { antes, depois: atual, eventos: [], avisos: [], divergencias: [], soNaApi: 0, porColeta: new Map() };

  for (const coleta of coletas) {
    const anterior = clonarBase(atual);
    const r: ResultadoNormalizacao = await incorporar(atual, [coleta], fontes, cfg);
    const eventos = comparar(anterior.empenhos, atual.empenhos, {
      coberturas: r.coberturas, ausentes: r.ausentes, campos: cfg.portoes.camposSensiveis, coleta, em: instanteDaColeta(coleta),
    });
    d.eventos.push(...eventos);
    d.porColeta.set(coleta, { eventos, avisos: r.avisos, divergencias: r.divergencias, soNaApi: r.soNaApi.length });
    if (coleta === coletas[coletas.length - 1]) {
      d.avisos = r.avisos; d.divergencias = r.divergencias; d.soNaApi = r.soNaApi.length;
    }
    ctx.log(`normalizado ${coleta}: ${r.leituras} leituras, ${r.avisos.length} avisos`);
  }
  d.depois = atual;
  return d;
}

const EXECUTORES: Record<Exclude<NomeEtapa, "publicar">, (ctx: Contexto) => Promise<Record<string, unknown>>> = {
  async coletar(ctx) {
    if (ctx.estado.escopo === "reprocessar") return { semRede: true };
    const base = await carregarBase(ctx.cfg.slug);
    return coletar(ctx.cfg, ctx.estado, base, () => gravarEstado(ctx.estado), ctx.log);
  },

  async arquivar(ctx) {
    if (ctx.estado.escopo === "reprocessar") return { semRede: true };
    return arquivar(ctx.estado);
  },

  async normalizar(ctx) {
    ctx.dobra = await dobrar(ctx);
    const d = ctx.dobra;
    await gravarJson(join(caminhos(ctx.cfg.slug).coleta(ctx.estado.id), "normalizacao.json"), {
      avisos: d.avisos, divergencias: d.divergencias, soNaApi: d.soNaApi,
    });
    return { empenhos: d.depois.empenhos.size, eventos: d.eventos.length, avisos: d.avisos.length };
  },

  async comparar(ctx) {
    if (!ctx.dobra) ctx.dobra = await dobrar(ctx);
    const p = caminhos(ctx.cfg.slug);
    const d = ctx.dobra;
    await gravarBase(ctx.cfg.slug, d.depois);
    // o reprocessamento reconstroi a historia inteira, inclusive os derivados de
    // cada coleta; a coleta normal so acrescenta
    if (ctx.estado.escopo === "reprocessar") {
      await gravarNdjson(p.eventos, d.eventos);
      for (const [id, c] of d.porColeta) {
        await gravarNdjson(join(p.coleta(id), "eventos.ndjson"), c.eventos);
        await gravarJson(join(p.coleta(id), "normalizacao.json"), { avisos: c.avisos, divergencias: c.divergencias, soNaApi: c.soNaApi });
      }
    } else await acrescentarNdjson(p.eventos, d.eventos);
    await gravarNdjson(join(p.coleta(ctx.estado.id), "eventos.ndjson"), d.eventos);
    const conta = (t: string) => d.eventos.filter((e) => e.tipo === t).length;
    const novos = [...d.depois.empenhos.keys()].filter((k) => !d.antes.empenhos.has(k)).length;
    return { novos, alterados: conta("alterado"), removidos: conta("removido"), reaparecidos: conta("reaparecido") };
  },

  async conferir(ctx) {
    const p = caminhos(ctx.cfg.slug);
    const base = await carregarBase(ctx.cfg.slug);
    const n = await lerJson<{ divergencias: string[]; soNaApi: number }>(join(p.coleta(ctx.estado.id), "normalizacao.json"), { divergencias: [], soNaApi: 0 });
    const c = conferir(base, { divergenciasPortal: n.divergencias, soNaApi: n.soNaApi });
    await gravarJson(p.conferencia, c);
    return Object.fromEntries(c.exercicios.map((x) => [x.ano, `${x.diferencaPct ?? "—"}% · detalhe ${x.cobertura.pct}%`]));
  },

  async analisar(ctx) {
    return analisar(ctx.cfg, await carregarBase(ctx.cfg.slug));
  },

  async revisar(ctx) {
    const p = caminhos(ctx.cfg.slug);
    const base = await carregarBase(ctx.cfg.slug);
    const eventos = await lerNdjson<Evento>(join(p.coleta(ctx.estado.id), "eventos.ndjson"));
    const n = await lerJson<{ avisos: string[]; divergencias: string[] }>(join(p.coleta(ctx.estado.id), "normalizacao.json"), { avisos: [], divergencias: [] });
    const conferencia = await lerJson<Conferencia>(p.conferencia, { exercicios: [], divergenciasPortal: [], soNaApi: 0 });
    // os totais "antes" vem da dobra quando ela esta em memoria; senao, nao ha como medir queda
    const antes = ctx.dobra ? totaisPorExercicio(ctx.dobra.antes) : new Map<string, number>();
    const portoes: Portao[] = avaliarPortoes({
      cfg: ctx.cfg,
      privacidade: await varrerPrivacidade([p.dados, p.publico]),
      conferencia, eventos, avisos: n.avisos,
      totaisAntes: antes, totaisDepois: totaisPorExercicio(base),
    });
    const md = gerarRevisao({
      cfg: ctx.cfg, estado: ctx.estado, base, eventos, conferencia, portoes,
      avisos: n.avisos, divergencias: n.divergencias,
    });
    await writeFile(join(p.coleta(ctx.estado.id), "revisao.md"), md, "utf8");
    return { portoes: Object.fromEntries(portoes.map((x) => [x.nome, x.ok])), liberado: portoes.every((x) => x.ok) };
  },
};

/** Roda as etapas pendentes ate `ate` (inclusive). Para na primeira falha. */
export async function executar(ctx: Contexto, ate: NomeEtapa = "revisar"): Promise<Estado> {
  const { estado } = ctx;
  for (const nome of ETAPAS) {
    if (nome === "publicar") break;
    const e = estado.etapas[nome];
    if (e.status === "ok") { if (nome === ate) break; continue; }
    ctx.log(`— etapa ${ETAPAS.indexOf(nome) + 1} ${nome}`);
    estado.etapas[nome] = { status: "pendente", inicio: new Date().toISOString() };
    await gravarEstado(estado);
    try {
      const resumo = await EXECUTORES[nome](ctx);
      estado.etapas[nome] = { ...estado.etapas[nome], status: "ok", fim: new Date().toISOString(), resumo };
      await gravarEstado(estado);
    } catch (err) {
      estado.etapas[nome] = { ...estado.etapas[nome], status: "falhou", fim: new Date().toISOString(), erro: (err as Error).stack ?? String(err) };
      await gravarEstado(estado);
      throw err;
    }
    if (nome === ate) break;
  }
  return estado;
}

/** Refaz uma etapa (e as seguintes ficam pendentes): usado depois de corrigir codigo. */
export function reabrirDesde(estado: Estado, nome: NomeEtapa): void {
  let marcar = false;
  for (const n of ETAPAS) {
    if (n === nome) marcar = true;
    if (marcar) estado.etapas[n] = { status: "pendente" };
  }
}
