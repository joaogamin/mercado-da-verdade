// Captura por terceiro: pede ao Internet Archive (Save Page Now 2) que arquive
// as paginas oficiais. O carimbo de data passa a ser do Archive, nao nosso.
// So paginas GET: as telas principais e o detalhe dos empenhos citados nos
// sinais (a parte expandida do detalhe vem por AJAX e fica so no nosso WARC).
//
//   IA_ACCESS_KEY=... IA_SECRET_KEY=... node municipios/arquivo/wayback.ts <cidade> [limite]
import { ehPrincipal } from "../nucleo/principal.ts";
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { cidade as configDe } from "../cidades/index.ts";
import type { Exercicio } from "../analise/agregar.ts";
import { urlDetalhe } from "../fontes/system-sys523/coletor.ts";
import { gravarJson, lerJson } from "../nucleo/ndjson.ts";
import { caminhos } from "../processo/caminhos.ts";

type Captura = { url: string; pedidoEm: string; situacao: string; job?: string };

export async function urlsParaCapturar(slug: string, limite: number): Promise<string[]> {
  const cfg = configDe(slug);
  const p = caminhos(slug);
  const b = `${cfg.fonte.base}${cfg.fonte.contexto}/publico`;
  const urls = [`${b}/despesasPorEmpenho.xhtml`, `${b}/balDespOrgao.xhtml`, `${b}/dadosPublicos.xhtml`];
  if (existsSync(p.analise)) {
    for (const a of (await readdir(p.analise)).sort().reverse()) {
      const ex = await lerJson<Exercicio | null>(join(p.analise, a), null);
      if (!ex) continue;
      const ent = cfg.entidades.find((e) => e.id === ex.entidade);
      for (const s of ex.sinais) for (const i of s.itens) for (const n of i.empenhos ?? []) {
        if (ent) urls.push(urlDetalhe(cfg.fonte, ex.ano, n, ent.codigos.detalhe));
      }
    }
  }
  return [...new Set(urls)].slice(0, limite);
}

async function capturar(url: string, chave: string): Promise<Captura> {
  const pedidoEm = new Date().toISOString();
  try {
    const r = await fetch("https://web.archive.org/save", {
      method: "POST",
      headers: { Accept: "application/json", Authorization: `LOW ${chave}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ url, capture_all: "1" }),
      signal: AbortSignal.timeout(60_000),
    });
    const j = (await r.json().catch(() => ({}))) as { job_id?: string; message?: string };
    return { url, pedidoEm, situacao: r.ok && j.job_id ? "pedido" : `erro: ${j.message ?? r.status}`, ...(j.job_id ? { job: j.job_id } : {}) };
  } catch (e) {
    return { url, pedidoEm, situacao: `erro: ${(e as Error).message}` };
  }
}

if (ehPrincipal(import.meta.url)) {
  const [slug, limite = "60"] = process.argv.slice(2);
  const ak = process.env.IA_ACCESS_KEY, sk = process.env.IA_SECRET_KEY;
  if (!slug || !ak || !sk) {
    console.error("uso: IA_ACCESS_KEY=... IA_SECRET_KEY=... node municipios/arquivo/wayback.ts <cidade> [limite]");
    process.exit(1);
  }
  const p = caminhos(slug);
  const registro = await lerJson<{ capturas: Captura[] }>(join(p.dados, "arquivo.json"), { capturas: [] });
  for (const url of await urlsParaCapturar(slug, Number(limite))) {
    const c = await capturar(url, `${ak}:${sk}`);
    registro.capturas.push(c);
    console.log(`${c.situacao.padEnd(10)} ${url}`);
    await new Promise((r) => setTimeout(r, 15_000)); // o SPN limita pedidos por minuto
  }
  await gravarJson(join(p.dados, "arquivo.json"), registro);
}
