// Etapa 4: compara a base publicada com a nova e gera os eventos. O historico
// so cresce: o que some do portal fica na base com removidoEm, nunca e apagado.
import type { Empenho, Evento } from "./esquema.ts";
import { jsonEstavel } from "./ndjson.ts";

type Cobertura = { ano: number; entidade: string; de: string; ate: string; numeros: number[] };

// Nome do campo sensivel (config da cidade) -> caminho dentro do Empenho.
const CAMINHOS: Record<string, string[]> = {
  data: ["data"],
  "credor.nome": ["credor", "nome"],
  "credor.documento": ["credor", "documento"],
  empenhado: ["empenhado"],
  especificacao: ["detalhe", "especificacao"],
  "classificacao.conta": ["detalhe", "classificacao", "conta"],
  licitacao: ["detalhe", "licitacao"],
  contrato: ["detalhe", "contrato"],
};

function pegar(e: Empenho, caminho: string[]): unknown {
  let v: unknown = e;
  for (const p of caminho) v = v && typeof v === "object" ? (v as Record<string, unknown>)[p] : undefined;
  return v;
}

// Forma canonica: a base em disco tem as chaves ordenadas e o parser nao, e
// JSON.stringify direto marcaria como "alterado" um valor identico.
const igual = (a: unknown, b: unknown) => jsonEstavel(a) === jsonEstavel(b);

export function comparar(
  antes: Map<string, Empenho>,
  depois: Map<string, Empenho>,
  o: { coberturas: Cobertura[]; ausentes: { id: string }[]; campos: string[]; coleta: string; em: string },
): Evento[] {
  const eventos: Evento[] = [];
  const ev = (e: Omit<Evento, "coleta" | "em">) => eventos.push({ ...e, coleta: o.coleta, em: o.em });
  // Empenho novo e rotina, nao alteracao do portal: so vira contagem no resumo
  // da coleta (uma carga inicial geraria dezenas de milhares de eventos).

  for (const [id, e] of depois) {
    const a = antes.get(id);
    if (!a) continue;
    for (const campo of o.campos) {
      const c = CAMINHOS[campo];
      if (!c) throw new Error(`campo sensivel desconhecido: ${campo}`);
      // so e alteracao se o dado existia antes (detalhe coletado pela 1a vez nao conta)
      if (c[0] === "detalhe" && !a.detalhe) continue;
      const va = pegar(a, c), vd = pegar(e, c);
      if (!igual(va, vd)) ev({ tipo: "alterado", id, campo, antes: va, depois: vd });
    }
  }

  const dataDo = (e: Empenho) => e.data;
  for (const c of o.coberturas) {
    const presentes = new Set(c.numeros);
    for (const e of depois.values()) {
      if (e.ano !== c.ano || e.entidade !== c.entidade || dataDo(e) < c.de || dataDo(e) > c.ate) continue;
      const presente = presentes.has(e.numero);
      if (!presente && !e.removidoEm) {
        e.removidoEm = o.em.slice(0, 10);
        ev({ tipo: "removido", id: e.id, campo: "lista" });
      } else if (presente && e.removidoEm) {
        ev({ tipo: "reaparecido", id: e.id, antes: e.removidoEm });
        delete e.removidoEm;
      }
    }
  }

  for (const { id } of o.ausentes) {
    const e = depois.get(id);
    if (e && !e.removidoEm) {
      e.removidoEm = o.em.slice(0, 10);
      ev({ tipo: "removido", id, campo: "detalhe" });
    }
  }
  return eventos;
}
