// Etapa 6: os agregados de cada nivel da arvore do dinheiro, por exercicio.
// Sao a fonte unica das paginas, dos resumos e dos downloads — nada e
// recalculado no componente, entao miniatura e pagina nao divergem.
import { join } from "node:path";
import type { Centavos, Empenho, Origem } from "../nucleo/esquema.ts";
import { gravarJson, lerJson } from "../nucleo/ndjson.ts";
import { nomeDoElemento } from "./elementos.ts";
import type { Conferencia } from "./conferencia.ts";
import { agruparPor } from "../nucleo/agrupar.ts";
import { chaveCredor, modalidade, slugCredor } from "./chaves.ts";

export { modalidade };
import { calcularSinais, type EmOrdem, type Sinal } from "./sinais.ts";
import type { ConfigCidade } from "../cidades/tipos.ts";
import type { Base } from "../processo/base.ts";
import { caminhos } from "../processo/caminhos.ts";

export type Totais = { empenhado: Centavos; liquidado: Centavos; pago: Centavos; pagoRestos: Centavos; empenhos: number };

export type Fatia = Totais & { chave: string; nome: string; participacao: number };

export type CredorAgregado = Fatia & {
  slug: string;
  documento: string;
  tipo: string;
  orgaos: string[];
  primeiro: string;
  ultimo: string;
};

export type OrgaoAgregado = Fatia & {
  codigo: string;
  funcoes: Fatia[];
  elementos: Fatia[];
  /** Desdobramentos com a descricao publicada pela propria prefeitura. */
  subelementos: Fatia[];
  credores: (Fatia & { slug: string })[];
  modalidades: Fatia[];
  mensal: { mes: string; empenhado: Centavos; pago: Centavos }[];
};

export type Exercicio = {
  cidade: string;
  entidade: string;
  ano: number;
  totais: Totais & { credores: number; removidos: number; comDetalhe: number };
  populacao: ConfigCidade["populacao"][number] | null;
  orgaos: OrgaoAgregado[];
  funcoes: Fatia[];
  elementos: Fatia[];
  modalidades: Fatia[];
  credores: CredorAgregado[];
  mensal: { mes: string; empenhado: Centavos; pago: Centavos }[];
  sinais: Sinal[];
  emOrdem: EmOrdem[];
  /** Lista oficial mais recente usada: e a "fonte" dos blocos agregados. */
  origem: Origem | null;
  /** Ultima coleta que tocou o exercicio. */
  coletadoEm: string;
};

const zerado = (): Totais => ({ empenhado: 0, liquidado: 0, pago: 0, pagoRestos: 0, empenhos: 0 });
const somar = (t: Totais, e: Empenho) => {
  t.empenhado += e.empenhado; t.liquidado += e.liquidado; t.pago += e.pago; t.pagoRestos += e.pagoRestos; t.empenhos++;
};

function fatias(grupos: Map<string, { nome: string; t: Totais }>, total: Centavos, limite?: number): Fatia[] {
  const out = [...grupos].map(([chave, g]) => ({ chave, nome: g.nome, ...g.t, participacao: total ? g.t.empenhado / total : 0 }))
    .sort((a, b) => b.empenhado - a.empenhado || a.chave.localeCompare(b.chave));
  return limite ? out.slice(0, limite) : out;
}

function agrupar(es: Empenho[], chave: (e: Empenho) => { chave: string; nome: string } | null) {
  const m = new Map<string, { nome: string; t: Totais }>();
  for (const e of es) {
    const k = chave(e);
    if (!k) continue;
    const g = m.get(k.chave) ?? { nome: k.nome, t: zerado() };
    somar(g.t, e);
    m.set(k.chave, g);
  }
  return m;
}

function mensal(es: Empenho[]) {
  const m = new Map<string, { empenhado: number; pago: number }>();
  const em = (mes: string) => { const v = m.get(mes) ?? { empenhado: 0, pago: 0 }; m.set(mes, v); return v; };
  for (const e of es) {
    em(e.data.slice(0, 7)).empenhado += e.empenhado;
    for (const p of e.detalhe?.pagamentos ?? []) em(p.data.slice(0, 7)).pago += p.valor - p.estornado;
  }
  return [...m].sort(([a], [b]) => a.localeCompare(b)).map(([mes, v]) => ({ mes, ...v }));
}

const orgaoDe = (e: Empenho) => e.detalhe ? { chave: String(Number(e.detalhe.classificacao.orgao.codigo)), nome: e.detalhe.classificacao.orgao.nome } : null;
const funcaoDe = (e: Empenho) => e.detalhe ? { chave: e.detalhe.classificacao.funcao.codigo, nome: e.detalhe.classificacao.funcao.nome } : null;
const elementoDe = (e: Empenho) => e.detalhe ? { chave: e.detalhe.classificacao.elemento, nome: nomeDoElemento(e.detalhe.classificacao.elemento) } : null;
const subelementoDe = (e: Empenho) => e.detalhe ? { chave: e.detalhe.classificacao.subelemento, nome: e.detalhe.classificacao.descricao || e.detalhe.classificacao.subelemento } : null;
const credorDe = (e: Empenho) => ({ chave: chaveCredor(e), nome: e.credor.nome });

export function agregarExercicio(cfg: ConfigCidade, entidade: string, ano: number, todos: Empenho[], conferenciaPct: number | null = null): Exercicio {
  const es = todos.filter((e) => !e.removidoEm);
  const t = zerado();
  for (const e of es) somar(t, e);

  const porOrgao = agrupar(es, orgaoDe);
  const orgaos: OrgaoAgregado[] = fatias(porOrgao, t.empenhado).map((f) => {
    const doOrgao = es.filter((e) => orgaoDe(e)?.chave === f.chave);
    return {
      ...f,
      codigo: f.chave,
      funcoes: fatias(agrupar(doOrgao, funcaoDe), f.empenhado),
      elementos: fatias(agrupar(doOrgao, elementoDe), f.empenhado),
      subelementos: fatias(agrupar(doOrgao, subelementoDe), f.empenhado),
      credores: fatias(agrupar(doOrgao, credorDe), f.empenhado, 50).map((c) => ({ ...c, slug: slugCredor(c.chave, c.nome) })),
      modalidades: fatias(agrupar(doOrgao, modalidade), f.empenhado),
      mensal: mensal(doOrgao),
    };
  });

  const porCredor = agruparPor(es, chaveCredor);
  const credores: CredorAgregado[] = [...porCredor].map(([chave, lista]) => {
    const ct = zerado();
    for (const e of lista) somar(ct, e);
    const datas = lista.map((e) => e.data).sort();
    // nome mais recente publicado (o portal as vezes varia a grafia)
    const recente = [...lista].sort((a, b) => b.data.localeCompare(a.data) || b.numero - a.numero)[0];
    return {
      chave, slug: slugCredor(chave, recente.credor.nome), nome: recente.credor.nome, documento: recente.credor.documento, tipo: recente.credor.tipo,
      ...ct, participacao: t.empenhado ? ct.empenhado / t.empenhado : 0,
      orgaos: [...new Set(lista.map((e) => orgaoDe(e)?.chave).filter((x): x is string => !!x))].sort(),
      primeiro: datas[0], ultimo: datas[datas.length - 1],
    };
  }).sort((a, b) => b.empenhado - a.empenhado || a.chave.localeCompare(b.chave));

  const coletas = es.flatMap((e) => [e.origens.lista?.coletadoEm, e.origens.detalhe?.coletadoEm]).filter((x): x is string => !!x).sort();
  const origem = es.map((e) => e.origens.lista).filter((o): o is Origem => !!o)
    .sort((a, b) => b.coletadoEm.localeCompare(a.coletadoEm))[0] ?? null;
  const { sinais, emOrdem } = calcularSinais(todos, ano, conferenciaPct);

  return {
    cidade: cfg.slug, entidade, ano,
    totais: { ...t, credores: credores.length, removidos: todos.length - es.length, comDetalhe: es.filter((e) => e.detalhe).length },
    populacao: cfg.populacao.find((p) => p.ano === ano) ?? null,
    orgaos,
    funcoes: fatias(agrupar(es, funcaoDe), t.empenhado),
    elementos: fatias(agrupar(es, elementoDe), t.empenhado),
    modalidades: fatias(agrupar(es, modalidade), t.empenhado),
    credores,
    mensal: mensal(es),
    sinais,
    emOrdem,
    origem,
    coletadoEm: coletas[coletas.length - 1] ?? "",
  };
}

export async function analisar(cfg: ConfigCidade, base: Base): Promise<Record<string, unknown>> {
  const p = caminhos(cfg.slug);
  const conf = await lerJson<Conferencia | null>(p.conferencia, null);
  const grupos = agruparPor(base.empenhos.values(), (e) => `${e.entidade}-${e.ano}`);
  const resumo: Record<string, unknown> = {};
  for (const [k, es] of [...grupos].sort(([a], [b]) => a.localeCompare(b))) {
    const [entidade, ano] = [k.slice(0, k.lastIndexOf("-")), Number(k.slice(k.lastIndexOf("-") + 1))];
    const pct = conf?.exercicios.find((x) => x.entidade === entidade && x.ano === ano)?.diferencaPct ?? null;
    const ex = agregarExercicio(cfg, entidade, ano, es, pct);
    await gravarJson(join(caminhos(cfg.slug).analise, `${k}.json`), ex);
    resumo[k] = { empenhos: ex.totais.empenhos, orgaos: ex.orgaos.length, credores: ex.credores.length };
  }
  return resumo;
}
