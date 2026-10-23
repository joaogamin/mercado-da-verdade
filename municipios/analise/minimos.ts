// Minimos constitucionais: o que a prefeitura declarou ao SIOPE (educacao) e ao
// SIOPS (saude), lado a lado com o piso da lei. Nada e recalculado: o
// percentual e o publicado pelo sistema federal. O minimo vale para o ano
// inteiro, entao so o 6º bimestre da veredito; antes dele, e acompanhamento.
import type { Minimo } from "../nucleo/esquema.ts";
import type { EmOrdem } from "./sinais.ts";

export type MinimosDoAno = {
  /** Serie por bimestre, do 1º ao ultimo declarado (percentuais acumulados no ano). */
  educacao: Minimo[];
  saude: Minimo[];
};

export const AREAS = ["educacao", "saude"] as const;
export const NOME_AREA: Record<Minimo["area"], string> = { educacao: "Educação", saude: "Saúde" };

export function minimosDoAno(todos: Iterable<Minimo>, ano: number): MinimosDoAno {
  const doAno = [...todos].filter((m) => m.ano === ano).sort((a, b) => a.bimestre - b.bimestre);
  return { educacao: doAno.filter((m) => m.area === "educacao"), saude: doAno.filter((m) => m.area === "saude") };
}

export const percentual = (x: number) => `${x.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
export const periodo = (m: Minimo) => (m.bimestre === 6 ? `no ano de ${m.ano}` : `até o ${m.bimestre}º bimestre`);

export function itemMinimos(m: MinimosDoAno): EmOrdem {
  const base = { id: "minimos", titulo: "Mínimos constitucionais de saúde e educação", fonte: "SIOPE (FNDE) e SIOPS (Ministério da Saúde)" };
  const ultimos = AREAS.map((a) => m[a].at(-1)).filter((x): x is Minimo => !!x);
  if (!ultimos.length) {
    return { ...base, detalhe: "Ainda não coletado. Os números vêm do SIOPE e do SIOPS, os sistemas federais em que a prefeitura declara esses gastos.", ok: null };
  }
  const partes = ultimos.map((x) => `${NOME_AREA[x.area]}: ${percentual(x.percentual)} ${periodo(x)} (mínimo ${x.piso}%)`);
  const faltam = AREAS.filter((a) => !m[a].length).map((a) => `${NOME_AREA[a].toLowerCase()} ainda não declarada`);
  const fechado = ultimos.length === AREAS.length && ultimos.every((x) => x.bimestre === 6);
  const declarado = "como a própria prefeitura declarou ao SIOPE (educação) e ao SIOPS (saúde)";
  if (fechado) {
    return { ...base, detalhe: `${partes.join(". ")}. Exercício fechado, ${declarado}.`, ok: ultimos.every((x) => x.percentual >= x.piso) };
  }
  return {
    ...base,
    detalhe: `${[...partes, ...faltam].join(". ")}. O mínimo vale para o ano inteiro: antes do fechamento, o percentual é acompanhamento, não veredito. Dados ${declarado}.`,
    ok: null,
  };
}
