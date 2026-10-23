// Copia a prova para uma guarda externa (HD, pendrive, pasta de rede) e
// verifica a copia: o sha256 de cada WARC no destino precisa bater com o
// manifesto carimbado. Incremental: o que ja esta la e igual nao e copiado.
// So coletas com manifesto (etapa 2 concluida) entram; a em andamento fica.
//
//   npm run municipio -- erechim guardar --destino E:\municipios
import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { sha256 } from "../nucleo/hash.ts";
import { caminhos } from "../processo/caminhos.ts";
import type { Manifesto } from "./manifesto.ts";

export type ResultadoGuarda = { coletas: number; copiados: number; jaPresentes: number; verificados: number; falhas: string[]; ignoradas: string[] };

async function mesmoArquivo(a: string, b: string): Promise<boolean> {
  if (!existsSync(b)) return false;
  const [sa, sb] = await Promise.all([stat(a), stat(b)]);
  return sa.size === sb.size && sha256(await readFile(a)) === sha256(await readFile(b));
}

/** Confere a guarda sozinha (sem copiar): cada bruto contra o manifesto guardado junto. */
export async function verificarGuarda(cidade: string, destino: string): Promise<{ conferidos: number; falhas: string[] }> {
  const raiz = join(destino, cidade);
  const out = { conferidos: 0, falhas: [] as string[] };
  const dir = join(raiz, "coletas");
  if (!existsSync(dir)) return { ...out, falhas: [`nenhuma coleta em ${dir}`] };
  for (const id of (await readdir(dir)).sort()) {
    const m = JSON.parse(await readFile(join(dir, id, "manifesto.json"), "utf8")) as Manifesto;
    for (const a of m.arquivos) {
      const f = join(raiz, "brutos", id, a.nome);
      if (!existsSync(f)) out.falhas.push(`${id}/${a.nome}: ausente`);
      else if (sha256(await readFile(f)) !== a.sha256) out.falhas.push(`${id}/${a.nome}: SHA256 NÃO CONFERE`);
      else out.conferidos++;
    }
  }
  return out;
}

export async function guardar(cidade: string, destino: string, log: (s: string) => void): Promise<ResultadoGuarda> {
  const p = caminhos(cidade);
  const raiz = join(destino, cidade);
  const r: ResultadoGuarda = { coletas: 0, copiados: 0, jaPresentes: 0, verificados: 0, falhas: [], ignoradas: [] };
  const ids = existsSync(p.coletas) ? (await readdir(p.coletas)).sort() : [];

  for (const id of ids) {
    const mPath = join(p.coleta(id), "manifesto.json");
    if (!existsSync(mPath)) { r.ignoradas.push(`${id} (sem manifesto: em andamento ou sem rede)`); continue; }
    const m = JSON.parse(await readFile(mPath, "utf8")) as Manifesto;
    r.coletas++;

    const arquivos: [string, string][] = [
      ...m.arquivos.map((a) => [join(p.brutosDaColeta(id), a.nome), join(raiz, "brutos", id, a.nome)] as [string, string]),
      [join(p.brutosDaColeta(id), "progresso.json"), join(raiz, "brutos", id, "progresso.json")],
      ...["manifesto.json", "manifesto.json.ots", "estado.json", "revisao.md"]
        .map((f) => [join(p.coleta(id), f), join(raiz, "coletas", id, f)] as [string, string]),
    ];
    for (const [de, para] of arquivos) {
      if (!existsSync(de)) continue;
      if (await mesmoArquivo(de, para)) { r.jaPresentes++; continue; }
      await mkdir(join(para, ".."), { recursive: true });
      await copyFile(de, para);
      r.copiados++;
    }

    // a verificacao e feita no DESTINO, contra o manifesto carimbado
    for (const a of m.arquivos) {
      const naGuarda = join(raiz, "brutos", id, a.nome);
      if (!existsSync(naGuarda)) { r.falhas.push(`${id}/${a.nome}: ausente na guarda (o bruto não existe nesta máquina)`); continue; }
      if (sha256(await readFile(naGuarda)) !== a.sha256) r.falhas.push(`${id}/${a.nome}: SHA256 NÃO CONFERE na guarda`);
      else r.verificados++;
    }
    log(`${id}: ${m.arquivos.length} brutos verificados na guarda`);
  }

  await writeFile(join(raiz, "LEIAME.txt"), [
    `Guarda externa dos brutos de ${cidade} (projeto Municípios / Mercado da Verdade).`,
    "",
    "brutos/<coleta>/*.warc.gz   respostas do portal, byte a byte (abra em https://replayweb.page)",
    "coletas/<coleta>/manifesto.json(.ots)   sha256 de cada bruto + carimbo de tempo (confira em https://opentimestamps.org)",
    "",
    "ATENÇÃO: api.warc.gz contém CPF completo de pessoas físicas (como a API da prefeitura entrega).",
    "Mantenha este disco criptografado (BitLocker) e guardado.",
    "",
    `Última atualização: ${new Date().toISOString()}`,
    "",
  ].join("\r\n"), "utf8");
  return r;
}
