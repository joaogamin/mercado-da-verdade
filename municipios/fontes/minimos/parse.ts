// Leitura das respostas do SIOPE e do SIOPS. Nada e recalculado: o percentual
// e o que o sistema federal publica. A conta numerador/denominador so serve para
// avisar se o formato mudou.
import type { Minimo } from "../../nucleo/esquema.ts";

export type LidoMinimo = { minimo: Omit<Minimo, "origem"> | null; avisos: string[] };
type Pedido = { ano: number; bimestre: number; municipio: string };

/** O SIOPE publica VAL_INDI como texto ("27.89"); o SIOPS, como numero. */
const numero = (v: unknown) => {
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
};
const centavos = (v: unknown) => { const n = numero(v); return n === null ? null : Math.round(n * 100); };
const fmt = (x: number) => x.toLocaleString("pt-BR", { maximumFractionDigits: 2 });

/** O Olinda (FNDE) embrulha respostas de erro num comentario JS: "/*{...}*\/". */
function json(corpo: Uint8Array): unknown {
  return JSON.parse(new TextDecoder().decode(corpo).trim().replace(/^\/\*/, "").replace(/\*\/$/, ""));
}

type LinhaSiope = { COD_MUNI: number; NUM_ANO: number; NUM_PERI: number; COD_EXIB: string; NOM_INDI: string; VAL_INDI: string | number };

/** Indicadores_Siope: 1.1 = % em MDE (minimo 25%), 8.1 = valor exigido, 8.2 = valor aplicado. */
export function lerSiope(corpo: Uint8Array, q: Pedido): LidoMinimo {
  const j = json(corpo) as { value?: LinhaSiope[] };
  if (!Array.isArray(j.value)) throw new Error(`SIOPE ${q.ano}/${q.bimestre}: resposta sem "value" (${JSON.stringify(j).slice(0, 160)})`);
  const avisos: string[] = [];
  const linhas = j.value.filter((l) => String(l.COD_MUNI) === q.municipio);
  if (linhas.length !== j.value.length) avisos.push(`SIOPE ${q.ano}/${q.bimestre}: a resposta trouxe linhas de outro município`);
  // lista vazia: o bimestre ainda nao foi declarado
  if (!linhas.length) return { minimo: null, avisos };
  if (linhas.some((l) => l.NUM_ANO !== q.ano || l.NUM_PERI !== q.bimestre)) avisos.push(`SIOPE ${q.ano}/${q.bimestre}: a resposta trouxe outro período`);

  const ind = (c: string) => linhas.find((l) => l.COD_EXIB === c);
  const p = ind("1.1");
  const percentual = numero(p?.VAL_INDI);
  if (!p || !/MDE/.test(p.NOM_INDI) || percentual === null) throw new Error(`SIOPE ${q.ano}/${q.bimestre}: indicador 1.1 (percentual em MDE) ausente ou com outro nome`);
  const exigido = centavos(ind("8.1")?.VAL_INDI), aplicado = centavos(ind("8.2")?.VAL_INDI);
  if (exigido && aplicado !== null && Math.abs((aplicado / exigido) * 25 - percentual) > 0.05) {
    avisos.push(`SIOPE ${q.ano}/${q.bimestre}: aplicado ÷ exigido × 25 dá ${fmt((aplicado / exigido) * 25)}%, e o indicador 1.1 diz ${fmt(percentual)}%`);
  }
  return {
    minimo: {
      area: "educacao", ano: q.ano, bimestre: q.bimestre, percentual, piso: 25,
      aplicado, exigido, receitaBase: null, indicador: `${p.COD_EXIB} ${p.NOM_INDI.trim()}`,
    },
    avisos,
  };
}

type LinhaSiops = { numero_indicador: string; ds_indicador: string; numerador: number | string; denominador: number | string; indicador_calculado: string };

/** indicador/municipal: 3.2 = % da receita propria aplicada em ASPS (LC 141/2012, minimo 15%). */
export function lerSiops(corpo: Uint8Array, status: number, q: Pedido): LidoMinimo {
  const j = json(corpo);
  if (status === 404) {
    if (Array.isArray(j) && j.some((e) => (e as { error?: string })?.error === "msg03")) return { minimo: null, avisos: [] };
    throw new Error(`SIOPS ${q.ano}/${q.bimestre}: 404 sem a mensagem de "não homologado" (${JSON.stringify(j).slice(0, 160)})`);
  }
  if (!Array.isArray(j)) throw new Error(`SIOPS ${q.ano}/${q.bimestre}: resposta não é uma lista`);
  const i = (j as LinhaSiops[]).find((l) => l.numero_indicador === "3.2");
  if (!i || !/ASPS/.test(i.ds_indicador)) throw new Error(`SIOPS ${q.ano}/${q.bimestre}: indicador 3.2 (percentual em ASPS) ausente ou com outro nome`);
  // publicado como texto: "22,46 %"
  const percentual = Number(i.indicador_calculado.replace(/[^\d,]/g, "").replace(",", "."));
  if (!Number.isFinite(percentual) || !/\d/.test(i.indicador_calculado)) throw new Error(`SIOPS ${q.ano}/${q.bimestre}: percentual ilegível (${i.indicador_calculado})`);
  const avisos: string[] = [];
  const num = numero(i.numerador), den = numero(i.denominador);
  if (num !== null && den && Math.abs((num / den) * 100 - percentual) > 0.01) {
    avisos.push(`SIOPS ${q.ano}/${q.bimestre}: numerador ÷ denominador dá ${fmt((num / den) * 100)}%, e o indicador diz ${i.indicador_calculado}`);
  }
  return {
    minimo: {
      area: "saude", ano: q.ano, bimestre: q.bimestre, percentual, piso: 15,
      aplicado: centavos(i.numerador), exigido: null, receitaBase: centavos(i.denominador),
      indicador: `${i.numero_indicador} ${i.ds_indicador.trim()}`,
    },
    avisos,
  };
}
