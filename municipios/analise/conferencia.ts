// Etapa 5: a nossa soma contra o balancete oficial do proprio portal. E o que
// permite dizer "da para confiar" com numero, e o que bloqueia a publicacao
// quando a coleta veio incompleta.
//
// A lista e o balancete medem coisas diferentes, e comparar errado daria um
// alarme falso (descoberto na coleta de 22/10/2026):
// - o "pago" da lista e o total pago em qualquer ano (inclui restos pagos
//   depois); o balancete conta so o pago dentro do exercicio. Descontado o
//   "pago em restos", os dois batem ao centavo — essa e a metrica do portao;
// - o "liquidado" da lista tambem inclui liquidacoes de anos seguintes; so e
//   comparavel no exercicio em curso;
// - o "empenhado" da lista e o valor original do empenho; o balancete parece
//   descontar anulacoes. Mostramos, mas nao bloqueia.
import type { Balancete, Centavos, Empenho, Origem } from "../nucleo/esquema.ts";
import type { Base } from "../processo/base.ts";
import { agruparPor } from "../nucleo/agrupar.ts";

type Totais = { empenhado: Centavos; liquidado: Centavos; pago: Centavos; pagoRestos: Centavos; pagoNoExercicio: Centavos };

export type Comparacao = {
  id: "pago-exercicio" | "liquidado" | "empenhado";
  rotulo: string;
  nosso: Centavos;
  oficial: Centavos;
  diferencaPct: number | null;
  /** So as comparaveis entram no portao. */
  comparavel: boolean;
  explicacao: string;
};

export type ConferenciaOrgao = {
  codigo: string;
  nome: string;
  oficial: Omit<Totais, "pagoNoExercicio"> & { dotacaoInicial: Centavos; dotacaoAtualizada: Centavos };
  nosso: Totais & { empenhos: number };
  /** Pago dentro do exercicio, nosso × oficial. */
  diferencaPct: number | null;
};

export type ConferenciaExercicio = {
  ano: number;
  entidade: string;
  emCurso: boolean;
  oficial: (Omit<Totais, "pagoNoExercicio"> & { dotacaoInicial: Centavos; dotacaoAtualizada: Centavos; origem: Origem }) | null;
  nosso: Totais & { empenhos: number; removidos: number };
  comparacoes: Comparacao[];
  /** A metrica do portao: pago dentro do exercicio. */
  diferencaPct: number | null;
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
  pagoNoExercicio: xs.reduce((s, e) => s + e.pago - e.pagoRestos, 0),
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
    // em curso = o exercicio ainda nao tinha fechado quando o balancete foi coletado
    const emCurso = b ? ano >= Number(b.origem.coletadoEm.slice(0, 4)) : true;

    const comparacoes: Comparacao[] = b ? [
      {
        id: "pago-exercicio", rotulo: "Pago dentro do exercício",
        nosso: nosso.pagoNoExercicio, oficial: b.total.pago, diferencaPct: pct(nosso.pagoNoExercicio, b.total.pago), comparavel: true,
        explicacao: "Soma, empenho a empenho, do pago menos o pago em restos (o que saiu em anos seguintes). O balancete conta só o pago dentro do ano.",
      },
      {
        id: "liquidado", rotulo: "Liquidado",
        nosso: nosso.liquidado, oficial: b.total.liquidado, diferencaPct: pct(nosso.liquidado, b.total.liquidado), comparavel: emCurso,
        explicacao: emCurso
          ? "No exercício em curso, a lista e o balancete contam as mesmas liquidações."
          : "Em exercício fechado, a lista inclui liquidações feitas nos anos seguintes (restos não processados) e o balancete não; a diferença é esperada.",
      },
      {
        id: "empenhado", rotulo: "Empenhado",
        nosso: nosso.empenhado, oficial: b.total.empenhado, diferencaPct: pct(nosso.empenhado, b.total.empenhado), comparavel: false,
        explicacao: "A lista e a API mostram o valor original de cada empenho; o balancete parece descontar as anulações. Hipótese ainda a confirmar com um empenho anulado.",
      },
    ] : [];

    const orgaos: ConferenciaOrgao[] = (b?.linhas ?? []).map((l) => {
      const doOrgao = ativos.filter((e) => e.detalhe && Number(e.detalhe.classificacao.orgao.codigo) === Number(l.codigo));
      const n = soma(doOrgao);
      return {
        codigo: l.codigo, nome: l.orgao,
        oficial: { dotacaoInicial: l.dotacaoInicial, dotacaoAtualizada: l.dotacaoAtualizada, empenhado: l.empenhado, liquidado: l.liquidado, pago: l.pago, pagoRestos: l.pagoRestos },
        nosso: { ...n, empenhos: doOrgao.length },
        diferencaPct: pct(n.pagoNoExercicio, l.pago),
      };
    });

    return {
      ano, entidade, emCurso,
      oficial: b ? { ...b.total, origem: b.origem } : null,
      nosso: { ...nosso, empenhos: ativos.length, removidos: todos.length - ativos.length },
      comparacoes,
      diferencaPct: comparacoes.find((c) => c.id === "pago-exercicio")?.diferencaPct ?? null,
      cobertura: { comDetalhe, total: ativos.length, pct: ativos.length ? Math.round((comDetalhe / ativos.length) * 1000) / 10 : 0 },
      orgaos,
      qualidade: b ? qualidadeDoBalancete(b) : [],
    };
  });

  return { exercicios, divergenciasPortal: [...new Set(extras.divergenciasPortal)].sort(), soNaApi: extras.soNaApi };
}
