import { test } from "node:test";
import assert from "node:assert/strict";
import { comparar } from "./diff.ts";
import type { Empenho } from "./esquema.ts";

const emp = (numero: number, extra: Partial<Empenho> = {}): Empenho => ({
  id: `prefeitura-2025-${numero}`, entidade: "prefeitura", ano: 2025, numero, data: "2025-03-10",
  credor: { nome: "EMPRESA X LTDA", documento: "04.210.265/0001-75", tipo: "PJ" },
  empenhado: 100_00, liquidado: 0, pago: 0, pagoRestos: 0, origens: {}, ...extra,
});
const mapa = (...es: Empenho[]) => new Map(es.map((e) => [e.id, structuredClone(e)]));
const cobertura = (numeros: number[]) => [{ ano: 2025, entidade: "prefeitura", de: "2025-03-01", ate: "2025-03-31", numeros }];
const base = { campos: ["credor.nome", "empenhado", "especificacao"], coleta: "c2", em: "2026-11-01T03:00:00Z" };

test("empenho novo nao vira evento (so contagem no resumo)", () => {
  const ev = comparar(new Map(), mapa(emp(1), emp(2)), { ...base, coberturas: cobertura([1, 2]), ausentes: [] });
  assert.deepEqual(ev, []);
});

test("empenho que some da lista do mes vira removido, mas continua na base", () => {
  const antes = mapa(emp(1), emp(2));
  const depois = mapa(emp(1), emp(2));
  const ev = comparar(antes, depois, { ...base, coberturas: cobertura([1]), ausentes: [] });
  assert.deepEqual(ev.map((e) => [e.tipo, e.id, e.campo]), [["removido", "prefeitura-2025-2", "lista"]]);
  assert.equal(depois.get("prefeitura-2025-2")?.removidoEm, "2026-11-01");
});

test("fora da janela coberta nada e considerado removido", () => {
  const ev = comparar(mapa(emp(1), emp(2, { data: "2025-04-02" })), mapa(emp(1), emp(2, { data: "2025-04-02" })),
    { ...base, coberturas: cobertura([1]), ausentes: [] });
  assert.deepEqual(ev, []);
});

test("removido que volta vira reaparecido", () => {
  const ev = comparar(mapa(emp(1, { removidoEm: "2026-10-30" })), mapa(emp(1, { removidoEm: "2026-10-30" })),
    { ...base, coberturas: cobertura([1]), ausentes: [] });
  assert.deepEqual(ev.map((e) => e.tipo), ["reaparecido"]);
});

test("alteracao em campo sensivel registra antes e depois", () => {
  const ev = comparar(mapa(emp(1)), mapa(emp(1, { empenhado: 90_00, credor: { nome: "OUTRA LTDA", documento: "04.210.265/0001-75", tipo: "PJ" } })),
    { ...base, coberturas: cobertura([1]), ausentes: [] });
  assert.deepEqual(ev.map((e) => [e.campo, e.antes, e.depois]), [["credor.nome", "EMPRESA X LTDA", "OUTRA LTDA"], ["empenhado", 10000, 9000]]);
});

test("mesmo valor com chaves em outra ordem nao e alteracao (base em disco × parser)", () => {
  const doDisco = emp(1, { detalhe: { licitacao: { ano: 2025, modalidade: "Inexigibilidade", numero: 126 } } as Empenho["detalhe"] });
  const doParser = emp(1, { detalhe: { licitacao: { ano: 2025, numero: 126, modalidade: "Inexigibilidade" } } as Empenho["detalhe"] });
  const ev = comparar(mapa(doDisco), mapa(doParser), { ...base, campos: ["licitacao"], coberturas: [], ausentes: [] });
  assert.deepEqual(ev, []);
});

test("detalhe coletado pela primeira vez nao e alteracao; o portal dizer que nao existe e remocao", () => {
  const comDetalhe = emp(1, { detalhe: { especificacao: "x" } as Empenho["detalhe"] });
  assert.deepEqual(comparar(mapa(emp(1)), mapa(comDetalhe), { ...base, coberturas: [], ausentes: [] }), []);
  const ev = comparar(mapa(emp(1)), mapa(emp(1)), { ...base, coberturas: [], ausentes: [{ id: "prefeitura-2025-1" }] });
  assert.deepEqual(ev.map((e) => [e.tipo, e.campo]), [["removido", "detalhe"]]);
});
