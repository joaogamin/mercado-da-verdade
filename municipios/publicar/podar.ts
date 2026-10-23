// Roda no postbuild. A exportacao estatica do Next grava, ao lado de cada
// index.html, os payloads RSC usados pela navegacao client-side (<Link>) e pelo
// prefetch de segmentos: index.txt e __next.*. As paginas de municipios navegam
// com <a> puro (pagina inteira), entao esses arquivos nunca sao pedidos — e,
// com milhares de paginas de credor, eram 2/3 do tamanho do deploy.
// So mexe em out/municipios/; as paginas do Mercado ficam como estao.
import { existsSync } from "node:fs";
import { readdir, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { RAIZ } from "../processo/caminhos.ts";

async function podar(dir: string): Promise<{ arquivos: number; bytes: number }> {
  let arquivos = 0, bytes = 0;
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const c = join(dir, e.name);
    if (e.name === "index.txt" || e.name.startsWith("__next.")) {
      bytes += e.isDirectory() ? 0 : (await stat(c)).size;
      await rm(c, { recursive: true });
      arquivos++;
    } else if (e.isDirectory()) {
      const r = await podar(c);
      arquivos += r.arquivos;
      bytes += r.bytes;
    }
  }
  return { arquivos, bytes };
}

const alvo = join(RAIZ, "out", "municipios");
if (existsSync(alvo)) {
  const r = await podar(alvo);
  console.log(`podar: ${r.arquivos} payloads de navegação removidos de out/municipios (${(r.bytes / 1e6).toFixed(0)} MB)`);
}
