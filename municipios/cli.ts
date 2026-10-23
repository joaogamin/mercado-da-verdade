// Porta de entrada unica do processo. O agendamento (GitHub Actions) e a
// execucao a mao chamam exatamente estes comandos.
//
//   node municipios/cli.ts <cidade> atualizar --escopo incremental|abertos|completo|periodo|reprocessar
//                                   [--ano 2025] [--de 01/03/2025 --ate 31/03/2025] [--limite 50] [--prazo 300]
//                                   [--ate-etapa revisar]
//   --prazo N: depois de N minutos para de pedir detalhes e segue o processo; o resto fica para a proxima coleta.
//   node municipios/cli.ts <cidade> retomar <id> [--desde normalizar]
//   node municipios/cli.ts <cidade> verificar [<id>]
//   node municipios/cli.ts <cidade> guardar --destino E:municipios   (copia e confere a prova numa guarda externa)
//   node municipios/cli.ts exportar
//
// Saida: 0 = portoes verdes (merge pode ser automatico) · 2 = precisa de revisao humana · 1 = erro.
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { cidade as configDe, CIDADES } from "./cidades/index.ts";
import { idDeColeta } from "./nucleo/datas.ts";
import { sha256 } from "./nucleo/hash.ts";
import { caminhos } from "./processo/caminhos.ts";
import { ETAPAS, lerEstado, novoEstado, travar, type Escopo, type NomeEtapa } from "./processo/estado.ts";
import { executar, reabrirDesde, type Contexto } from "./processo/etapas.ts";
import { exportar } from "./publicar/exportar.ts";
import { guardar, verificarGuarda } from "./arquivo/guardar.ts";
import type { Manifesto } from "./arquivo/manifesto.ts";

const ESCOPOS: Escopo[] = ["incremental", "abertos", "completo", "periodo", "reprocessar"];

function opcoes(args: string[]): { pos: string[]; op: Record<string, string> } {
  const pos: string[] = [];
  const op: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) op[args[i].slice(2)] = args[i + 1]?.startsWith("--") || args[i + 1] === undefined ? "true" : args[++i];
    else pos.push(args[i]);
  }
  return { pos, op };
}

const log = (s: string) => console.log(`[${new Date().toISOString().slice(11, 19)}] ${s}`);

function anosDoEscopo(escopo: Escopo, op: Record<string, string>, anoInicial: number): number[] {
  const atual = new Date().getUTCFullYear();
  if (escopo === "reprocessar") return [];
  if (escopo === "periodo") {
    if (!op.de || !op.ate) throw new Error("--escopo periodo exige --de e --ate (dd/mm/aaaa)");
    const a = Number(op.de.slice(-4)), b = Number(op.ate.slice(-4));
    return Array.from({ length: b - a + 1 }, (_, i) => a + i);
  }
  if (escopo === "completo") return [Number(op.ano ?? atual)];
  return [atual - 1, atual].filter((a) => a >= anoInicial);
}

async function rodar(ctx: Contexto, ate: NomeEtapa): Promise<number> {
  const destravar = await travar(ctx.cfg.slug, ctx.estado.id);
  try {
    const e = await executar(ctx, ate);
    const r = e.etapas.revisar;
    const dir = caminhos(ctx.cfg.slug).coleta(e.id);
    log(`coleta ${e.id} pronta para revisao: ${join(dir, "revisao.md")}`);
    if (r.status !== "ok") return 0;
    const liberado = Boolean(r.resumo?.liberado);
    log(liberado ? "portoes: todos verdes" : "portoes: algum falhou — precisa de revisao humana");
    return liberado ? 0 : 2;
  } finally {
    await destravar();
  }
}

async function verificar(slug: string, id?: string): Promise<number> {
  const p = caminhos(slug);
  const ids = id ? [id] : existsSync(p.coletas) ? (await readdir(p.coletas)).sort() : [];
  let falhas = 0;
  for (const c of ids) {
    const mPath = join(p.coleta(c), "manifesto.json");
    if (!existsSync(mPath)) continue;
    const bytes = await readFile(mPath);
    const m = JSON.parse(bytes.toString("utf8")) as Manifesto;
    const otsPath = mPath + ".ots";
    const ots = existsSync(otsPath) ? await readFile(otsPath) : null;
    const carimbo = !ots ? "sem carimbo" : ots.subarray(33, 65).toString("hex") === sha256(bytes) ? "carimbo confere" : "CARIMBO NAO CONFERE";
    if (carimbo === "CARIMBO NAO CONFERE") falhas++;
    for (const a of m.arquivos) {
      const local = join(p.brutosDaColeta(c), a.nome);
      const situacao = !existsSync(local) ? "bruto ausente nesta maquina" : sha256(await readFile(local)) === a.sha256 ? "ok" : "SHA256 NAO CONFERE";
      if (situacao === "SHA256 NAO CONFERE") falhas++;
      console.log(`${c}  ${a.nome.padEnd(14)} ${situacao}`);
    }
    console.log(`${c}  manifesto      ${carimbo}`);
  }
  return falhas ? 1 : 0;
}

async function main(): Promise<number> {
  const { pos, op } = opcoes(process.argv.slice(2));
  if (pos[0] === "exportar") {
    for (const c of CIDADES) log(`exportar ${c.slug}: ${JSON.stringify(await exportar(c))}`);
    return 0;
  }
  const [slug, comando, arg] = pos;
  const cfg = configDe(slug ?? "");

  if (comando === "atualizar") {
    const escopo = (op.escopo ?? "incremental") as Escopo;
    if (!ESCOPOS.includes(escopo)) throw new Error(`escopo invalido: ${escopo} (use ${ESCOPOS.join(", ")})`);
    const agora = new Date();
    const estado = novoEstado({
      id: idDeColeta(agora), cidade: cfg.slug, escopo, anos: anosDoEscopo(escopo, op, cfg.anoInicial),
      ...(op.de ? { de: op.de, ate: op.ate } : {}),
      ...(op.limite ? { limite: Number(op.limite) } : {}),
      ...(op.prazo ? { prazoAte: new Date(agora.getTime() + Number(op.prazo) * 60_000).toISOString() } : {}),
      iniciadoEm: agora.toISOString(),
    });
    log(`coleta ${estado.id} · ${escopo} · ${estado.anos.join(", ") || "todas as coletas"}`);
    return rodar({ cfg, estado, log }, (op["ate-etapa"] as NomeEtapa) ?? "revisar");
  }

  if (comando === "retomar") {
    if (!arg) throw new Error("informe o id da coleta");
    const estado = await lerEstado(cfg.slug, arg);
    if (op.desde) {
      if (!ETAPAS.includes(op.desde as NomeEtapa)) throw new Error(`etapa invalida: ${op.desde}`);
      // Renormalizar uma coleta antiga por cima de coletas posteriores reaplicaria
      // observacoes velhas sobre as novas. Para refazer a historia, a dobra inteira.
      const posteriores = (await readdir(caminhos(cfg.slug).coletas)).filter((c) => c > estado.id);
      if (["coletar", "arquivar", "normalizar", "comparar"].includes(op.desde) && posteriores.length) {
        throw new Error(`a coleta ${estado.id} tem ${posteriores.length} coleta(s) posterior(es): use "atualizar --escopo reprocessar" para refazer a normalizacao`);
      }
      reabrirDesde(estado, op.desde as NomeEtapa);
    }
    log(`retomando ${estado.id}`);
    return rodar({ cfg, estado, log }, "revisar");
  }

  if (comando === "verificar" && op.guarda) {
    const r = await verificarGuarda(cfg.slug, op.guarda);
    log(`guarda ${op.guarda}: ${r.conferidos} brutos conferem com os manifestos`);
    for (const f of r.falhas) console.error(`FALHA: ${f}`);
    return r.falhas.length ? 1 : 0;
  }
  if (comando === "verificar") return verificar(cfg.slug, arg);

  if (comando === "guardar") {
    if (!op.destino || op.destino === "true") throw new Error("informe --destino (ex.: --destino E:\\municipios)");
    const r = await guardar(cfg.slug, op.destino, log);
    log(`guarda: ${r.coletas} coletas · ${r.copiados} copiados · ${r.jaPresentes} já presentes · ${r.verificados} brutos conferidos no destino`);
    for (const i of r.ignoradas) log(`ignorada: ${i}`);
    for (const f of r.falhas) console.error(`FALHA: ${f}`);
    return r.falhas.length ? 1 : 0;
  }

  throw new Error("uso: node municipios/cli.ts <cidade> atualizar|retomar|verificar … | exportar");
}

main().then((codigo) => process.exit(codigo), (e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
