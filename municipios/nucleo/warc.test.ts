import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, stat, truncate } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { GravadorWarc, lerWarc, repararWarc } from "./warc.ts";

const troca = (n: number) => ({
  requisicao: { metodo: "GET", url: `https://exemplo.gov.br/p${n}`, headers: [] as [string, string][] },
  resposta: { status: 200, statusText: "OK", headers: [["Content-Type", "text/plain"]] as [string, string][], corpo: new TextEncoder().encode(`corpo ${n} `.repeat(500)) },
  data: "2026-10-23T00:00:00.000Z",
  etiqueta: { tipo: "teste", params: { n }, urlOficial: `https://exemplo.gov.br/p${n}` },
});

test("WARC: gravar, ler e conferir o sha256 de cada resposta", async () => {
  const dir = await mkdtemp(join(tmpdir(), "warc-"));
  const g = new GravadorWarc(join(dir, "t.warc.gz"));
  await g.abrir({ teste: "1" });
  for (let n = 1; n <= 3; n++) await g.gravar(troca(n));
  await g.fechar();
  const lidos = [];
  for await (const r of lerWarc(g.caminho)) lidos.push(r.etiqueta.params.n);
  assert.deepEqual(lidos, [1, 2, 3]);
});

test("WARC interrompido no meio: a retomada corta o resto e continua integra", async () => {
  const dir = await mkdtemp(join(tmpdir(), "warc-"));
  const caminho = join(dir, "t.warc.gz");
  const g = new GravadorWarc(caminho);
  await g.abrir({ teste: "1" });
  for (let n = 1; n <= 3; n++) await g.gravar(troca(n));
  await g.fechar();
  const inteiro = (await stat(caminho)).size;
  await truncate(caminho, inteiro - 40); // o ultimo registro (a requisicao do 3) fica pela metade

  const g2 = new GravadorWarc(caminho);
  await g2.abrir({ teste: "1" });
  assert.ok(g2.cortados > 0, "deveria ter cortado o resto incompleto");
  await g2.gravar(troca(4));
  await g2.fechar();
  const lidos = [];
  for await (const r of lerWarc(caminho)) lidos.push(r.etiqueta.params.n);
  assert.deepEqual(lidos, [1, 2, 3, 4]);
  assert.equal(await repararWarc(caminho), 0);
  assert.ok((await readFile(caminho)).length > 0);
});
