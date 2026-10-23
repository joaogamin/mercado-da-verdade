// Sinais de atencao e "o que esta em ordem", lado a lado, como no Verdade.tsx
// do Mercado: checagem que so acha erro e propaganda com outro nome.
// Um sinal e um convite a verificar, nunca uma conclusao. Cada um carrega a
// regra, a base e o que ele NAO prova.
import type { Centavos, Empenho } from "../nucleo/esquema.ts";
import { agruparPor } from "../nucleo/agrupar.ts";
import { ELEMENTO_OBRAS, LIMITES_DISPENSA } from "./limites.ts";
import { chaveCredor } from "./chaves.ts";

export type ItemSinal = {
  titulo: string;
  valor: Centavos | null;
  /** Fatia (0 a 1) quando o sinal e uma participacao. */
  participacao?: number;
  detalhe: string;
  chaveCredor?: string;
  orgao?: string;
  empenhos?: number[];
};

export type Sinal = {
  id: "concentracao" | "contratacao-direta" | "fracionamento" | "prazo-pagamento";
  titulo: string;
  resumo: string;
  itens: ItemSinal[];
  base: string;
  limites: string;
};

export type EmOrdem = { id: string; titulo: string; detalhe: string; ok: boolean | null };

const ativos = (es: Empenho[]) => es.filter((e) => !e.removidoEm);
const reais = (c: number) => (c / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pct = (x: number) => `${(x * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
const dias = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);

/** Gasto de pessoal e encargos (3.1) nao passa por licitacao: fica fora dos sinais de contratacao. */
const contratavel = (e: Empenho) => e.detalhe && !e.detalhe.classificacao.natureza.codigo.startsWith("3.1") && e.credor.tipo !== "folha";

function concentracao(es: Empenho[]): Sinal {
  const porOrgao = agruparPor(es.filter(contratavel), (e) => e.detalhe!.classificacao.orgao.nome);
  const itens: ItemSinal[] = [];
  for (const [orgao, lista] of porOrgao) {
    const total = lista.reduce((s, e) => s + e.empenhado, 0);
    if (total <= 0) continue;
    const porCredor = agruparPor(lista, chaveCredor);
    const [chave, maior] = [...porCredor].map(([k, l]) => [k, l] as const)
      .sort((a, b) => b[1].reduce((s, e) => s + e.empenhado, 0) - a[1].reduce((s, e) => s + e.empenhado, 0))[0];
    const v = maior.reduce((s, e) => s + e.empenhado, 0);
    itens.push({ titulo: `${maior[0].credor.nome} em ${orgao}`, valor: v, participacao: v / total, detalhe: `${pct(v / total)} do que o órgão contratou fora da folha`, chaveCredor: chave, orgao });
  }
  itens.sort((a, b) => (b.participacao ?? 0) - (a.participacao ?? 0) || (b.valor ?? 0) - (a.valor ?? 0));
  return {
    id: "concentracao",
    titulo: "Concentração por órgão",
    resumo: "Em cada órgão, o fornecedor que mais recebeu e a fatia dele no que o órgão contratou (sem folha e encargos).",
    itens: itens.slice(0, 10),
    base: "Cálculo nosso sobre os empenhos publicados pela prefeitura.",
    limites: "Concentração alta pode ser natural (fornecedor único de um serviço, contrato grande e regular). O sinal aponta onde olhar, não diz que há problema.",
  };
}

function contratacaoDireta(es: Empenho[]): Sinal {
  const c = es.filter(contratavel);
  const direta = (e: Empenho) => /dispensa|inexig/i.test(e.detalhe!.licitacao?.modalidade ?? "");
  const porOrgao = agruparPor(c, (e) => e.detalhe!.classificacao.orgao.nome);
  const itens: ItemSinal[] = [...porOrgao].map(([orgao, l]) => {
    const total = l.reduce((s, e) => s + e.empenhado, 0);
    const d = l.filter(direta).reduce((s, e) => s + e.empenhado, 0);
    return { titulo: orgao, valor: d, detalhe: `${pct(total ? d / total : 0)} do contratado pelo órgão saiu por dispensa ou inexigibilidade`, orgao };
  }).filter((i) => (i.valor ?? 0) > 0).sort((a, b) => (b.valor ?? 0) - (a.valor ?? 0));
  return {
    id: "contratacao-direta",
    titulo: "Contratação direta",
    resumo: "Quanto cada órgão contratou sem disputa: dispensa ou inexigibilidade de licitação.",
    itens: itens.slice(0, 10),
    base: "Modalidade informada pela prefeitura no detalhe de cada empenho. Lei 14.133/2021, arts. 72 a 75.",
    limites: "Contratação direta é legal nos casos previstos em lei (valor baixo, emergência, fornecedor exclusivo). O sinal mostra o volume, não a legalidade de cada caso.",
  };
}

function fracionamento(es: Empenho[], ano: number): Sinal {
  const lim = LIMITES_DISPENSA.find((l) => l.ano === ano);
  const pequeno = es.filter((e) => contratavel(e) && /pequeno valor/i.test(e.detalhe!.licitacao?.modalidade ?? ""));
  const grupos = agruparPor(pequeno, (e) => `${chaveCredor(e)}|${e.detalhe!.classificacao.elemento}`);
  const itens: ItemSinal[] = [];
  if (lim) {
    for (const [, l] of grupos) {
      const elemento = l[0].detalhe!.classificacao.elemento;
      const teto = elemento === ELEMENTO_OBRAS ? lim.obras : lim.outros;
      const soma = l.reduce((s, e) => s + e.empenhado, 0);
      if (l.length < 2 || soma <= teto) continue;
      itens.push({
        titulo: `${l[0].credor.nome} · elemento ${elemento}`,
        valor: soma,
        detalhe: `${l.length} empenhos por "dispensa de pequeno valor" que somam ${reais(soma)}, acima do limite de ${reais(teto)} do ano`,
        chaveCredor: chaveCredor(l[0]),
        empenhos: l.map((e) => e.numero).sort((a, b) => a - b),
      });
    }
  }
  itens.sort((a, b) => (b.valor ?? 0) - (a.valor ?? 0));
  return {
    id: "fracionamento",
    titulo: "Possível fracionamento — verificar",
    resumo: "Dispensas de pequeno valor para o mesmo fornecedor e o mesmo tipo de despesa que, somadas no ano, passam do limite legal da dispensa.",
    itens: itens.slice(0, 15),
    base: lim
      ? `Lei 14.133/2021, art. 75, I e II, e §1º (o limite vale para a soma anual de objetos da mesma natureza). Limites de ${ano}: ${lim.norma} (${reais(lim.obras)} para obras e engenharia, ${reais(lim.outros)} para os demais).`
      : `Limite legal de ${ano} ainda não cadastrado.`,
    limites: "Agrupamos por fornecedor e elemento de despesa, uma aproximação de \"mesma natureza\". A lei agrupa por objeto e unidade, e há casos com limite próprio (manutenção de veículos, art. 75, §7º). Pode haver processos distintos e legítimos.",
  };
}

function prazos(es: Empenho[]): { sinal: Sinal; mediana: number | null } {
  const esperas: { dias: number; e: Empenho; valor: number }[] = [];
  for (const e of es) {
    if (!e.detalhe || e.credor.tipo === "folha") continue;
    const liq = new Map(e.detalhe.liquidacoes.map((l) => [l.numero, l]));
    for (const p of e.detalhe.pagamentos) {
      const l = liq.get(p.liquidacao);
      if (!l) continue;
      const d = dias(l.data, p.data);
      if (d >= 0) esperas.push({ dias: d, e, valor: p.valor });
    }
  }
  const ordenado = esperas.map((x) => x.dias).sort((a, b) => a - b);
  const mediana = ordenado.length ? ordenado[Math.floor(ordenado.length / 2)] : null;
  const longos = [...esperas].sort((a, b) => b.dias - a.dias || b.valor - a.valor).slice(0, 10);
  return {
    mediana,
    sinal: {
      id: "prazo-pagamento",
      titulo: "Espera entre liquidação e pagamento",
      resumo: mediana === null ? "Ainda sem pagamentos detalhados." : `Metade dos pagamentos sai em até ${mediana} ${mediana === 1 ? "dia" : "dias"} depois da liquidação. Abaixo, as esperas mais longas.`,
      itens: longos.map((x) => ({
        titulo: `${x.e.ano}/${x.e.numero} · ${x.e.credor.nome}`, valor: x.valor,
        detalhe: `${x.dias} dias entre a liquidação e o pagamento`, chaveCredor: chaveCredor(x.e), empenhos: [x.e.numero],
      })),
      base: "Datas de liquidação e de pagamento publicadas no detalhe de cada empenho. A ordem cronológica de pagamentos está na Lei 14.133/2021, art. 141.",
      limites: "Atraso pode ter motivo legítimo (falta de recurso vinculado, pendência do fornecedor). O cálculo não reconstrói a fila por fonte de recurso exigida pelo art. 141.",
    },
  };
}

export function calcularSinais(todos: Empenho[], ano: number, conferenciaPct: number | null): { sinais: Sinal[]; emOrdem: EmOrdem[] } {
  const es = ativos(todos);
  const p = prazos(es);
  const c = es.filter(contratavel);
  const total = c.reduce((s, e) => s + e.empenhado, 0);
  // Disputa e so a que a propria prefeitura fez entre concorrentes. Adesao a ata
  // de outro orgao, credenciamento e chamada publica nao entram: contar como
  // disputa inflaria justamente o item "em ordem".
  const DISPUTA = /preg[aã]o|concorr[eê]ncia|tomada de pre[cç]os|convite|leil[aã]o|concurso/i;
  const competitivo = c.filter((e) => DISPUTA.test(e.detalhe!.licitacao?.modalidade ?? "")).reduce((s, e) => s + e.empenhado, 0);

  const emOrdem: EmOrdem[] = [
    {
      id: "conferencia",
      titulo: "A soma confere com o balancete da prefeitura",
      detalhe: conferenciaPct === null ? "Ainda sem balancete coletado para comparar." : `Somando empenho a empenho o que foi pago dentro do ano, a diferença para o balancete do portal é de ${conferenciaPct.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%.`,
      ok: conferenciaPct === null ? null : Math.abs(conferenciaPct) <= 0.5,
    },
    {
      id: "licitado",
      titulo: "Parcela contratada com disputa",
      detalhe: total ? `${pct(competitivo / total)} do que foi contratado fora da folha teve disputa feita pela prefeitura (pregão, concorrência, tomada de preços, convite). Adesão a ata de outro órgão, credenciamento e chamada pública ficam de fora.` : "Ainda sem detalhes suficientes.",
      ok: total ? competitivo / total >= 0.5 : null,
    },
    {
      id: "prazo",
      titulo: "Prazo típico de pagamento",
      detalhe: p.mediana === null ? "Ainda sem pagamentos detalhados." : `Metade dos pagamentos sai em até ${p.mediana} ${p.mediana === 1 ? "dia" : "dias"} depois da liquidação.`,
      ok: p.mediana === null ? null : p.mediana <= 30,
    },
    {
      id: "minimos",
      titulo: "Mínimos constitucionais de saúde e educação",
      detalhe: "Ainda não verificado: depende da receita de impostos (RREO), que ainda não coletamos.",
      ok: null,
    },
  ];

  return { sinais: [concentracao(es), contratacaoDireta(es), fracionamento(es, ano), p.sinal], emOrdem };
}
