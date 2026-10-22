// Pacote mensal: tudo o que alguem precisa para conferir o mes sem depender
// de nos. Vai para o GitHub Release (o Zenodo arquiva sozinho, com DOI) e para
// o Internet Archive.
//
//   node municipios/arquivo/pacote.ts <cidade> <aaaa-mm> <pasta-de-saida> [--com-brutos]
//
// Os WARC das telas so entram com --com-brutos (decisao do mantenedor: o nome
// de MEI publicado pelo portal traz o CPF do titular). O WARC da API nunca entra.
import { ehPrincipal } from "../nucleo/principal.ts";
import { existsSync } from "node:fs";
import { cp, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { sha256 } from "../nucleo/hash.ts";
import { caminhos } from "../processo/caminhos.ts";

async function arquivos(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const c = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await arquivos(c)));
    else out.push(c);
  }
  return out;
}

export async function montarPacote(cidade: string, mes: string, saida: string, comBrutos: boolean): Promise<string[]> {
  const p = caminhos(cidade);
  const coletas = existsSync(p.coletas) ? (await readdir(p.coletas)).filter((id) => id.startsWith(mes)).sort() : [];
  if (!coletas.length) throw new Error(`nenhuma coleta de ${cidade} em ${mes}`);
  await mkdir(saida, { recursive: true });

  for (const id of coletas) {
    await cp(p.coleta(id), join(saida, "coletas", id), { recursive: true });
    if (comBrutos) {
      const telas = join(p.brutosDaColeta(id), "telas.warc.gz");
      if (existsSync(telas)) await cp(telas, join(saida, "brutos", id, "telas.warc.gz"));
    }
  }
  for (const k of ["normalizado", "analise"] as const) if (existsSync(p[k])) await cp(p[k], join(saida, k), { recursive: true });
  for (const f of [p.eventos, p.conferencia]) if (existsSync(f)) await cp(f, join(saida, relative(p.dados, f)));

  await writeFile(join(saida, "LEIAME.md"), [
    `# Pacote ${cidade} · ${mes}`,
    "",
    "Dados públicos coletados do Portal da Transparência da prefeitura, com prova de data.",
    "",
    "- `coletas/<id>/manifesto.json`: cada arquivo bruto da coleta, com tamanho e sha256.",
    "- `coletas/<id>/manifesto.json.ots`: carimbo de tempo OpenTimestamps do manifesto (confira em https://opentimestamps.org).",
    "- `coletas/<id>/revisao.md`: o relatório de revisão daquela coleta.",
    comBrutos ? "- `brutos/<id>/telas.warc.gz`: as respostas das telas do portal, byte a byte (abra em https://replayweb.page)." : "- Os arquivos brutos (WARC) ficam em guarda privada; o sha256 de cada um está no manifesto.",
    "- `normalizado/`, `analise/`, `eventos.ndjson`, `conferencia.json`: os dados como o site os usa.",
    "- `SHA256SUMS`: sha256 de cada arquivo deste pacote.",
    "",
    "A resposta da API da prefeitura contém CPF completo de pessoas físicas e por isso nunca entra em pacote público.",
    "",
  ].join("\n"), "utf8");

  const todos = (await arquivos(saida)).filter((f) => !f.endsWith("SHA256SUMS")).sort();
  const somas = await Promise.all(todos.map(async (f) => `${sha256(await readFile(f))}  ${relative(saida, f).replace(/\\/g, "/")}`));
  await writeFile(join(saida, "SHA256SUMS"), somas.join("\n") + "\n", "utf8");
  return todos;
}

if (ehPrincipal(import.meta.url)) {
  const [cidade, mes, saida] = process.argv.slice(2);
  if (!cidade || !/^\d{4}-\d{2}$/.test(mes ?? "") || !saida) {
    console.error("uso: node municipios/arquivo/pacote.ts <cidade> <aaaa-mm> <pasta-de-saida> [--com-brutos]");
    process.exit(1);
  }
  const lista = await montarPacote(cidade, mes, saida, process.argv.includes("--com-brutos"));
  console.log(`pacote ${cidade} ${mes}: ${lista.length} arquivos em ${saida}`);
}
