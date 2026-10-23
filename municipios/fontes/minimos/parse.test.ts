import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { lerSiope, lerSiops } from "./parse.ts";
import { bimestresEncerrados, ibge6, PERIODO_SIOPS, urlSiope, urlSiops } from "./coletor.ts";
import { itemMinimos, minimosDoAno } from "../../analise/minimos.ts";
import type { Minimo } from "../../nucleo/esquema.ts";

const fx = (nome: string) => new Uint8Array(readFileSync(join(import.meta.dirname, "fixtures", nome)));
const q = (ano: number, bimestre: number) => ({ ano, bimestre, municipio: "430700" });

test("SIOPE 2025, 6º bimestre: percentual em MDE, exigido e aplicado como publicados", () => {
  const { minimo, avisos } = lerSiope(fx("siope-430700-2025-6.json"), q(2025, 6));
  assert.deepEqual(avisos, []);
  assert.equal(minimo?.area, "educacao");
  assert.equal(minimo?.percentual, 27.89);
  assert.equal(minimo?.piso, 25);
  assert.equal(minimo?.exigido, 11076506983);
  assert.equal(minimo?.aplicado, 12357261094);
  assert.equal(minimo?.receitaBase, null);
  assert.match(minimo!.indicador, /^1\.1 Percentual de aplicação .*MDE/);
});

test("SIOPE: bimestre ainda não declarado devolve lista vazia", () => {
  assert.deepEqual(lerSiope(fx("siope-430700-2026-5-vazio.json"), q(2026, 5)), { minimo: null, avisos: [] });
});

test("SIOPE: erro do Olinda embrulhado em comentário vira falha de leitura, não dado", () => {
  const erro = new TextEncoder().encode('/*{"error":{"code":"400","message":"Filter expressions must be boolean"}}*/');
  assert.throws(() => lerSiope(erro, q(2025, 6)), /sem "value"/);
});

test("SIOPS 2025, ano inteiro: percentual em ASPS, aplicado e receita base", () => {
  const { minimo, avisos } = lerSiops(fx("siops-430700-2025-6.json"), 200, q(2025, 6));
  assert.deepEqual(avisos, []);
  assert.equal(minimo?.area, "saude");
  assert.equal(minimo?.percentual, 22.46);
  assert.equal(minimo?.piso, 15);
  assert.equal(minimo?.aplicado, 9706249831);
  assert.equal(minimo?.receitaBase, 43203003459);
  assert.match(minimo!.indicador, /^3\.2 .*ASPS/);
});

test("SIOPS: 404 'não homologado' é bimestre ainda não declarado; outro 404 é falha", () => {
  assert.deepEqual(lerSiops(fx("siops-430700-2026-5-nao-homologado.json"), 404, q(2026, 5)), { minimo: null, avisos: [] });
  assert.throws(() => lerSiops(new TextEncoder().encode('{"status":404,"error":"Not Found"}'), 404, q(2026, 5)), /não homologado/);
});

test("códigos e URLs: IBGE de 6 dígitos, períodos do SIOPS, só bimestres encerrados", () => {
  assert.equal(ibge6("4307005"), "430700");
  assert.deepEqual(Object.values(PERIODO_SIOPS), [12, 14, 1, 18, 20, 2]);
  assert.equal(urlSiops("430700", 2025, 6), "https://siops-consulta-publica-api.saude.gov.br/v1/indicador/municipal/430700/2025/2");
  assert.match(urlSiope("430700", "RS", 2025, 6), /Indicadores_Siope\(Ano_Consulta=2025,Num_Peri=6,Sig_UF='RS'\)\?%24filter=COD_MUNI%20eq%20430700/);
  const outubro = new Date("2026-10-23T03:00:00Z");
  assert.deepEqual(bimestresEncerrados(2026, outubro), [1, 2, 3, 4]);
  assert.deepEqual(bimestresEncerrados(2025, outubro), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(bimestresEncerrados(2027, outubro), []);
});

const origem = { fonte: "teste", url: "", coletadoEm: "", sha256: "", coleta: "" };
const m = (area: Minimo["area"], bimestre: number, percentual: number): Minimo => ({
  area, ano: 2025, bimestre, percentual, piso: area === "educacao" ? 25 : 15,
  aplicado: null, exigido: null, receitaBase: null, indicador: "", origem,
});

test("o que está em ordem: veredito só com o ano fechado nas duas áreas", () => {
  assert.equal(itemMinimos(minimosDoAno([], 2025)).ok, null);
  const fechado = itemMinimos(minimosDoAno([m("educacao", 6, 27.89), m("saude", 6, 22.46), m("saude", 4, 20.45)], 2025));
  assert.equal(fechado.ok, true);
  assert.match(fechado.detalhe, /Educação: 27,89% no ano de 2025 \(mínimo 25%\)\. Saúde: 22,46% no ano de 2025/);
  assert.equal(itemMinimos(minimosDoAno([m("educacao", 6, 24.1), m("saude", 6, 22.46)], 2025)).ok, false);
  const parcial = itemMinimos(minimosDoAno([m("educacao", 4, 26.79), m("saude", 4, 19.11)], 2025));
  assert.equal(parcial.ok, null);
  assert.match(parcial.detalhe, /até o 4º bimestre.*acompanhamento, não veredito/);
  assert.match(itemMinimos(minimosDoAno([m("educacao", 6, 27.89)], 2025)).detalhe, /saúde ainda não declarada/);
});
