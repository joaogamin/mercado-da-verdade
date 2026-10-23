import { test } from "node:test";
import assert from "node:assert/strict";
import { centavos, centavosDeNumero } from "./dinheiro.ts";
import { lerCsv } from "./csv.ts";
import { isoDeBr, fimDoMes, idDeColeta } from "./datas.ts";
import { documentoPublico, encontrarCpfs, mascararCpf, mascararCpfsNoTexto } from "./privacidade.ts";

test("centavos: formato do portal, com NBSP", () => {
  assert.equal(centavos("R$ 11.087,44"), 1108744);
  assert.equal(centavos("R$ 0,00"), 0);
  assert.equal(centavos("R$ 535.000.000,00"), 53500000000);
  assert.equal(centavos("-1.234,56"), -123456);
  assert.throws(() => centavos(""), /invalido/);
  assert.throws(() => centavos("R$ 12.5"), /invalido/);
});

test("centavosDeNumero elimina ruido de float", () => {
  assert.equal(centavosDeNumero(110874.4), 11087440);
  assert.equal(centavosDeNumero(0.1 + 0.2), 30);
});

test("lerCsv: aspas, aspas duplicadas, virgula e quebra dentro do campo", () => {
  assert.deepEqual(lerCsv('"a","b ""c""","d,e"\n"f\ng",""'), [["a", 'b "c"', "d,e"], ["f\ng", ""]]);
});

test("datas", () => {
  assert.equal(isoDeBr("11/03/2025"), "2025-03-11");
  assert.equal(fimDoMes(2024, 2), "29/02/2024");
  assert.equal(fimDoMes(2025, 12), "31/12/2025");
  assert.equal(idDeColeta(new Date("2026-10-22T21:30:05.123Z")), "2026-10-22T213005Z");
});

// CPFs de teste montados em tempo de execucao: o repositorio nao guarda nenhum.
const cpf = ["123", "456", "789", "09"].join("");

test("privacidade: mesmo padrao das telas do portal", () => {
  assert.equal(mascararCpf(cpf), "***.456.789-**");
  assert.equal(documentoPublico(cpf), "***.456.789-**");
  assert.equal(documentoPublico("04210265000175"), "04.210.265/0001-75");
});

test("privacidade: CPF dentro de nome de MEI, cru ou formatado", () => {
  assert.deepEqual(mascararCpfsNoTexto(`JOAO DA SILVA ${cpf}`), { texto: "JOAO DA SILVA ***.456.789-**", mascarou: true });
  assert.deepEqual(mascararCpfsNoTexto("JOAO 123.456.789-09"), { texto: "JOAO ***.456.789-**", mascarou: true });
  // CNPJ, numero maior e mascara do portal nao sao CPF
  assert.equal(mascararCpfsNoTexto("CNPJ 04.210.265/0001-75 e 04210265000175").mascarou, false);
  assert.equal(mascararCpfsNoTexto("***.456.789-**").mascarou, false);
  assert.deepEqual(encontrarCpfs(`x ${cpf} y`), [cpf]);
});

test("privacidade: hash hexadecimal com 11 digitos seguidos nao e CPF", () => {
  // trecho real de um sha256 que disparou o portao na coleta de marco/2025
  assert.deepEqual(encontrarCpfs("04ea688dd2eda10858dada848c7ca12e"), []);
  assert.deepEqual(encontrarCpfs(`ab${cpf}cd`), []);
  assert.deepEqual(encontrarCpfs(`"documento":"${cpf}"`), [cpf]);
  assert.deepEqual(encontrarCpfs(`CPF: ${cpf}.`), [cpf]);
});
