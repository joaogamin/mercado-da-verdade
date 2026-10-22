// Etapa 5: a nossa soma contra o balancete oficial do proprio portal. E o que
// permite dizer "da para confiar" com numero, e o que bloqueia a publicacao
// quando a coleta veio incompleta.
import type { Balancete, Centavos, Empenho, Origem } from "../nucleo/esquema.ts";
import type { Base } from "../processo/base.ts";
import { agruparPor } from "../nucleo/agrupar.ts";

type Totais = { empenhado: Centavos; liquidado: Centavos; pago: Centavos; pagoRestos: Centavos };

export type ConferenciaOrgao = {
  codigo: string;
  nome: string;
  oficial: Totais & { dotacaoInicial: Centavos; dotacaoAtualizada: Centavos };
  nosso: Totais & { empenhos: number };
  diferencaPct: number | null;
};

export type ConferenciaExercicio = {
  ano: number;
  entidade: string;
  oficial: (Totais & { dotacaoInicial: Centavos; dotacaoAtualizada: Centavos; origem: Origem }) | null;
  nosso: Totais & { empenhos: number; removidos: number };
  diferencaPct: { empenhado: number | null; liquidado: number | null; pago: number | null };
  cobertura: { comDetalhe: number; total: number; pct: number };
  /** So confiavel com cobertura de detalhe completa. */
  orgaos: ConferenciaOrgao[];
  qualidade: string[];
};

export type Conferencia = { exercicios: ConferenciaExercicio[]; divergenciasPortal: string[]; soNaApi: number };

const pct = (nosso: number, oficial: number) => (oficial === 0 ? (nosso === 0 ? 0 : null) : Math.round(((nosso - oficial) / oficial) * 1e6) / 1e4);
const soma = (xs: Empenho[]): Totais => ({
  empenhado: xs.reduce((s, e) => s + e.empenhado, 0),
  liquidado: xs.reduce((s, e) => s + e.liquidado, 0),
  pago: xs.reduce((s, e) => s + e.pago, 0),
  pagoRestos: xs.reduce((s, e) => s + e.pagoRestos, 0),
});

function qualidadeDoBalancete(b: Balancete): string[] {
  const q: string[] = [];
  const comDotacao = b.linhas.filter((l) => l.dotacaoInicial > 0);
  if (comDotacao.length && comDotacao.every((l) => l.dotacaoAtualizada === l.dotacaoInicial)) {
    q.push("A dotação atualizada é igual à dotação inicial em todos os órgãos: a coluna provavelmente não incorpora os créditos adicionais do ano.");
  }
  const acima = comDotacao.filter((l) => l.empenhado > l.dotacaoAtualizada);
  if (acima.length) {
    q.push(`${acima.length} de ${comDotacao.length} órgãos aparecem com empenhado acima da dotação atualizada publicada.`);
  }
  return q;
}

export function conferir(base: Base, extras: { divergenciasPortal: string[]; soNaApi: number }): Conferencia {
  const porExercicio = agruparPor(base.empenhos.values(), (e) => `${e.entidade}-${e.ano}`);
  const chaves = new Set([...porExercicio.keys(), ...base.balancetes.keys()]);

  const exercicios: ConferenciaExercicio[] = [...chaves].sort().map((k) => {
    const todos = porExercicio.get(k) ?? [];
    const ativos = todos.filter((e) => !e.removidoEm);
    const b = base.balancetes.get(k);
    const [entidade, ano] = [k.slice(0, k.lastIndexOf("-")), Number(k.slice(k.lastIndexOf("-") + 1))];
    const nosso = soma(ativos);
    const comDetalhe = ativos.filter((e) => e.detalhe).length;

    const orgaos: ConferenciaOrgao[] = (b?.linhas ?? []).map((l) => {
      const doOrgao = ativos.filter((e) => e.detalhe && Number(e.detalhe.classificacao.orgao.codigo) === Number(l.codigo));
      const n = soma(doOrgao);
      return {
        codigo: l.codigo, nome: l.orgao,
        oficial: { dotacaoInicial: l.dotacaoInicial, dotacaoAtualizada: l.dotacaoAtualizada, empenhado: l.empenhado, liquidado: l.liquidado, pago: l.pago, pagoRestos: l.pagoRestos },
        nosso: { ...n, empenhos: doOrgao.length },
        diferencaPct: pct(n.empenhado, l.empenhado),
      };
    });

    return {
      ano, entidade,
      oficial: b ? { ...b.total, origem: b.origem } : null,
      nosso: { ...nosso, empenhos: ativos.length, removidos: todos.length - ativos.length },
      diferencaPct: b
        ? { empenhado: pct(nosso.empenhado, b.total.empenhado), liquidado: pct(nosso.liquidado, b.total.liquidado), pago: pct(nosso.pago, b.total.pago) }
        : { empenhado: null, liquidado: null, pago: null },
      cobertura: { comDetalhe, total: ativos.length, pct: ativos.length ? Math.round((comDetalhe / ativos.length) * 1000) / 10 : 0 },
      orgaos,
      qualidade: b ? qualidadeDoBalancete(b) : [],
    };
  });

  return { exercicios, divergenciasPortal: [...new Set(extras.divergenciasPortal)].sort(), soNaApi: extras.soNaApi };
}
