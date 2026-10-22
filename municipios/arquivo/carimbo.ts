// Carimbo de tempo OpenTimestamps (ancorado no Bitcoin, gratuito), sem
// dependencia: o pacote JS oficial esta parado desde 2022. Para um arquivo so,
// o .ots e simples:
//
//   cabecalho | versao | op sha256 | digest do arquivo | arvore
//   arvore = para cada calendario: append(nonce) -> sha256 -> resposta do calendario
//
// A resposta do calendario ja e uma arvore serializada (com a atestacao
// "pendente"); depois que o bloco e minerado, qualquer pessoa faz o upgrade
// com `ots upgrade` e confere em https://opentimestamps.org.
import { randomBytes } from "node:crypto";
import { createHash } from "node:crypto";

export const CALENDARIOS = [
  "https://a.pool.opentimestamps.org",
  "https://b.pool.opentimestamps.org",
  "https://a.pool.eternitywall.com",
];

const CABECALHO = Uint8Array.from([
  0x00, ...new TextEncoder().encode("OpenTimestamps"), 0x00, 0x00, ...new TextEncoder().encode("Proof"),
  0x00, 0xbf, 0x89, 0xe2, 0xe8, 0x84, 0xe8, 0x92, 0x94,
]);
const VERSAO = 0x01;
const OP_SHA256 = 0x08;
const OP_APPEND = 0xf0;
const BIFURCA = 0xff;

const sha256 = (b: Uint8Array): Uint8Array<ArrayBuffer> => new Uint8Array(createHash("sha256").update(b).digest());

function varuint(n: number): number[] {
  const out: number[] = [];
  do {
    let b = n & 0x7f;
    n >>>= 7;
    if (n) b |= 0x80;
    out.push(b);
  } while (n);
  return out;
}

const concat = (...partes: (Uint8Array | number[])[]): Uint8Array<ArrayBuffer> => Uint8Array.from(partes.flatMap((p) => [...p]));

/** Compromisso enviado ao calendario: sha256(digest || nonce). */
export function compromisso(digest: Uint8Array, nonce: Uint8Array): Uint8Array<ArrayBuffer> {
  return sha256(concat(digest, nonce));
}

/** Monta o .ots a partir das respostas ja obtidas de cada calendario. */
export function montarOts(digest: Uint8Array, ramos: { nonce: Uint8Array; resposta: Uint8Array }[]): Uint8Array {
  if (digest.length !== 32) throw new Error("digest sha256 deve ter 32 bytes");
  if (!ramos.length) throw new Error("nenhum calendario respondeu");
  const ordenados = [...ramos].sort((a, b) => Buffer.compare(Buffer.from(a.nonce), Buffer.from(b.nonce)));
  const arvore = ordenados.flatMap((r, i) => [
    ...(i < ordenados.length - 1 ? [BIFURCA] : []),
    OP_APPEND, ...varuint(r.nonce.length), ...r.nonce,
    OP_SHA256, ...r.resposta,
  ]);
  return concat(CABECALHO, [VERSAO, OP_SHA256], digest, arvore);
}

/** Carimba um arquivo (conteudo) nos calendarios; exige pelo menos uma resposta. */
export async function carimbar(conteudo: Uint8Array, calendarios = CALENDARIOS): Promise<{ ots: Uint8Array; calendarios: string[]; falhas: string[] }> {
  const digest = sha256(conteudo);
  const ramos: { nonce: Uint8Array; resposta: Uint8Array }[] = [];
  const ok: string[] = [];
  const falhas: string[] = [];
  for (const cal of calendarios) {
    const nonce = new Uint8Array(randomBytes(16));
    try {
      const r = await fetch(`${cal}/digest`, {
        method: "POST",
        headers: { Accept: "application/vnd.opentimestamps.v1", "User-Agent": "municipios-carimbo/0.1" },
        body: compromisso(digest, nonce),
        signal: AbortSignal.timeout(30_000),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      ramos.push({ nonce, resposta: new Uint8Array(await r.arrayBuffer()) });
      ok.push(cal);
    } catch (e) {
      falhas.push(`${cal}: ${(e as Error).message}`);
    }
  }
  return { ots: montarOts(digest, ramos), calendarios: ok, falhas };
}
