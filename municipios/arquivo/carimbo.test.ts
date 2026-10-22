import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { compromisso, montarOts } from "./carimbo.ts";

const hex = (b: Uint8Array) => Buffer.from(b).toString("hex");

test("ots: cabecalho, versao, op sha256, digest e um ramo por calendario", () => {
  const digest = new Uint8Array(createHash("sha256").update("manifesto").digest());
  const nonceA = new Uint8Array(16).fill(1);
  const nonceB = new Uint8Array(16).fill(2);
  const resposta = Uint8Array.from([0x00, 0x83, 0xdf, 0xe3, 0x0d, 0x2e, 0xf9, 0x0c, 0x8e, 0x01, 0x00]);
  const ots = montarOts(digest, [{ nonce: nonceB, resposta }, { nonce: nonceA, resposta }]);

  const s = hex(ots);
  // "\0OpenTimestamps\0\0Proof\0" + magic
  assert.ok(s.startsWith("004f70656e54696d657374616d7073000050726f6f6600bf89e2e884e89294"));
  let i = 62;
  assert.equal(s.slice(i, i + 4), "0108"); i += 4; // versao 1, op sha256
  assert.equal(s.slice(i, i + 64), hex(digest)); i += 64;
  // primeiro ramo (nonce menor) vem com 0xff de bifurcacao
  assert.equal(s.slice(i, i + 6), "fff010"); i += 6;
  assert.equal(s.slice(i, i + 32), hex(nonceA)); i += 32;
  assert.equal(s.slice(i, i + 2), "08"); i += 2;
  assert.equal(s.slice(i, i + resposta.length * 2), hex(resposta)); i += resposta.length * 2;
  // ultimo ramo sem 0xff
  assert.equal(s.slice(i, i + 4), "f010");
  assert.equal(ots.length, 31 + 2 + 32 + (1 + 1 + 1 + 16 + 1 + resposta.length) + (1 + 1 + 16 + 1 + resposta.length));
});

test("compromisso = sha256(digest || nonce)", () => {
  const d = new Uint8Array(32).fill(7);
  const n = new Uint8Array(16).fill(9);
  const esperado = createHash("sha256").update(Buffer.concat([Buffer.from(d), Buffer.from(n)])).digest("hex");
  assert.equal(hex(compromisso(d, n)), esperado);
});
