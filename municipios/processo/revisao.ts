// Etapa 7: o relatorio que vira o corpo do Pull Request. Feito para ser lido
// em dois minutos: portoes, numeros, o que mudou e cinco empenhos para conferir
// a mao no portal oficial.
import type { Empenho, Evento } from "../nucleo/esquema.ts";
import type { Conferencia } from "../analise/conferencia.ts";
import type { ConfigCidade } from "../cidades/tipos.ts";
import type { Base } from "./base.ts";
import type { Estado } from "./estado.ts";
import type { Portao } from "./portoes.ts";
import { urlDetalhe } from "../fontes/system-sys523/coletor.ts";

const reais = (c: number) => (c / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pct = (v: number | null) => (v === null ? "—" : `${v.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`);

/** Sorteio deterministico (mesma coleta, mesmos 5 empenhos). */
function sortear<T>(xs: T[], n: number, semente: string): T[] {
  let h = 2166136261;
  for (const c of semente) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const rnd = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 2 ** 32; };
  const copia = [...xs];
  for (let i = copia.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [copia[i], copia[j]] = [copia[j], copia[i]]; }
  return copia.slice(0, n);
}

export function gerarRevisao(o: {
  cfg: ConfigCidade; estado: Estado; base: Base; eventos: Evento[]; conferencia: Conferencia;
  portoes: Portao[]; avisos: string[]; divergencias: string[];
}): string {
  const { cfg, estado } = o;
  const ok = o.portoes.every((p) => p.ok);
  const linhas: string[] = [];
  const add = (...l: string[]) => linhas.push(...l);

  add(`# Coleta ${cfg.nome} · ${estado.id}`, "");
  add(`Escopo **${estado.escopo}**${estado.anos.length ? ` · exercícios ${estado.anos.join(", ")}` : ""}${estado.de ? ` · ${estado.de} a ${estado.ate}` : ""}`, "");
  add(ok ? "**Todos os portões passaram: o merge pode ser automático.**" : "**Algum portão falhou: esta coleta precisa de revisão humana antes do merge.**", "");

  add("## Portões", "", "| | Portão | Situação |", "|---|---|---|");
  for (const p of o.portoes) add(`| ${p.ok ? "✅" : "❌"} | ${p.nome} | ${p.detalhe} |`);
  add("");

  const conta = (t: string) => o.eventos.filter((e) => e.tipo === t).length;
  add("## O que mudou", "",
    `- Empenhos na base: **${o.base.empenhos.size.toLocaleString("pt-BR")}**`,
    `- Novos: ${Number(estado.etapas.comparar.resumo?.novos ?? 0).toLocaleString("pt-BR")} · alterados: ${conta("alterado")} · removidos do portal: ${conta("removido")} · reapareceram: ${conta("reaparecido")}`,
    `- Detalhes coletados nesta execução: ${Number(estado.etapas.coletar.resumo?.detalhes ?? 0).toLocaleString("pt-BR")}`,
    ...(Number(estado.etapas.coletar.resumo?.adiados ?? 0) > 0
      ? [`- Ficaram para a próxima coleta (prazo da execução): ${Number(estado.etapas.coletar.resumo?.adiados).toLocaleString("pt-BR")}`]
      : []),
    "");

  add("## Conferência com o balancete oficial", "", "| Exercício | Medida | Nossa soma | Balancete do portal | Diferença | Entra no portão? |", "|---|---|---|---|---|---|");
  for (const x of o.conferencia.exercicios) {
    if (!x.comparacoes.length) add(`| ${x.ano} | — | ${reais(x.nosso.pagoNoExercicio)} (pago no exercício) | sem balancete | — | — |`);
    for (const c of x.comparacoes) {
      add(`| ${x.ano} | ${c.rotulo} | ${reais(c.nosso)} | ${reais(c.oficial)} | ${pct(c.diferencaPct)} | ${c.comparavel ? (c.id === "pago-exercicio" ? "sim" : "informativo") : "não: " + c.explicacao.split(";")[0]} |`);
    }
  }
  add("", ...o.conferencia.exercicios.map((x) => `- ${x.ano}: detalhe coletado para ${x.cobertura.comDetalhe.toLocaleString("pt-BR")} de ${x.cobertura.total.toLocaleString("pt-BR")} empenhos (${pct(x.cobertura.pct)})`));
  const qualidade = o.conferencia.exercicios.flatMap((x) => x.qualidade.map((q) => `${x.ano}: ${q}`));
  if (qualidade.length) add("", "Qualidade dos dados do portal:", ...qualidade.map((q) => `- ${q}`));
  add("");

  const sensiveis = o.eventos.filter((e) => e.tipo === "removido" || e.tipo === "alterado").slice(0, 50);
  if (sensiveis.length) {
    add("## Remoções e alterações", "", "| Empenho | Evento | Campo | Antes | Depois |", "|---|---|---|---|---|");
    for (const e of sensiveis) add(`| ${e.id} | ${e.tipo} | ${e.campo ?? ""} | ${JSON.stringify(e.antes ?? "").slice(0, 60)} | ${JSON.stringify(e.depois ?? "").slice(0, 60)} |`);
    add("");
  }

  const maiores = [...o.base.empenhos.values()]
    .filter((e) => e.origens.detalhe?.coleta === estado.id)
    .sort((a, b) => b.empenhado - a.empenhado).slice(0, 10);
  if (maiores.length) {
    add("## Maiores empenhos detalhados nesta coleta", "", "| Empenho | Data | Credor | Empenhado | Órgão |", "|---|---|---|---|---|");
    for (const e of maiores) add(`| ${e.ano}/${e.numero} | ${e.data} | ${e.credor.nome} | ${reais(e.empenhado)} | ${e.detalhe?.classificacao.orgao.nome ?? "—"} |`);
    add("");
  }

  if (o.avisos.length) add("## Avisos de leitura", "", ...o.avisos.slice(0, 20).map((a) => `- ${a}`), o.avisos.length > 20 ? `- … e mais ${o.avisos.length - 20}` : "", "");
  if (o.divergencias.length) add("## Divergências do próprio portal", "", ...o.divergencias.slice(0, 10).map((d) => `- ${d}`), o.divergencias.length > 10 ? `- … e mais ${o.divergencias.length - 10}` : "", "");

  const candidatos: Empenho[] = [...o.base.empenhos.values()].filter((e) => e.detalhe && !e.removidoEm);
  const amostra = sortear(candidatos.sort((a, b) => a.id.localeCompare(b.id)), 5, estado.id);
  if (amostra.length) {
    add("## Confira à mão (5 sorteados)", "", "Abra o link oficial e compare com os números ao lado.", "", "| Empenho | Credor | Empenhado | Liquidado | Pago | Portal |", "|---|---|---|---|---|---|");
    for (const e of amostra) {
      const ent = cfg.entidades.find((x) => x.id === e.entidade)!;
      add(`| ${e.ano}/${e.numero} | ${e.credor.nome} | ${reais(e.empenhado)} | ${reais(e.liquidado)} | ${reais(e.pago)} | [abrir](${urlDetalhe(cfg.fonte, e.ano, e.numero, ent.codigos.detalhe)}) |`);
    }
    add("");
  }

  add("## Antes do merge", "", "- [ ] Li este relatório", "- [ ] Abri 2 dos 5 links acima e os números conferem", "- [ ] Olhei a prévia do site", "");
  return linhas.join("\n");
}
