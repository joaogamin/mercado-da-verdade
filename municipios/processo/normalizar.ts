// Etapa 3: le os WARC de uma ou mais coletas, na ordem, e incorpora cada
// leitura a base. A ultima observacao de cada tipo vence. Nada aqui toca a rede.
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Empenho, Origem } from "../nucleo/esquema.ts";
import { lerWarc } from "../nucleo/warc.ts";
import type { Fonte } from "../fontes/tipos.ts";
import type { ConfigCidade } from "../cidades/tipos.ts";
import { chaveBalancete, type Base } from "./base.ts";
import { caminhos } from "./caminhos.ts";

export type Cobertura = { ano: number; entidade: string; de: string; ate: string; numeros: number[] };

export type ResultadoNormalizacao = {
  coberturas: Cobertura[];
  /** Empenhos que o detalhe do portal disse nao existir. */
  ausentes: { id: string; origem: Origem }[];
  avisos: string[];
  divergencias: string[];
  /** Na API mas nao na lista (nao entram na base: a API nao traz data nem credor). */
  soNaApi: string[];
  leituras: number;
};

/** Arquivos WARC de uma coleta, telas antes da API. */
export function warcsDaColeta(cidade: string, id: string): string[] {
  const dir = caminhos(cidade).brutosDaColeta(id);
  return ["telas.warc.gz", "api.warc.gz"].map((a) => join(dir, a)).filter((a) => existsSync(a));
}

const somaLiquida = (xs: { valor: number; estornado: number }[]) => xs.reduce((s, x) => s + x.valor - x.estornado, 0);

export async function incorporar(base: Base, coletas: string[], fonte: Fonte, cfg: ConfigCidade): Promise<ResultadoNormalizacao> {
  const r: ResultadoNormalizacao = { coberturas: [], ausentes: [], avisos: [], divergencias: [], soNaApi: [], leituras: 0 };
  const nomeFonte = `${fonte.nome} de ${cfg.nome}`;

  for (const coleta of [...coletas].sort()) {
    for (const arquivo of warcsDaColeta(cfg.slug, coleta)) {
      for await (const lido of lerWarc(arquivo)) {
        const origem: Origem = { fonte: nomeFonte, url: lido.etiqueta.urlOficial, coletadoEm: lido.data, sha256: lido.sha256, coleta };
        let saida;
        try {
          saida = fonte.leitor.ler(lido);
        } catch (e) {
          r.avisos.push(`falha ao ler ${lido.etiqueta.tipo} ${JSON.stringify(lido.etiqueta.params)}: ${(e as Error).message}`);
          continue;
        }
        r.avisos.push(...saida.avisos);
        const l = saida.leitura;
        if (!l) continue;
        r.leituras++;

        if (l.tipo === "lista-empenhos") {
          r.divergencias.push(...l.divergencias.map((d) => `lista ${l.de} a ${l.ate}: ${d}`));
          r.coberturas.push({ ano: l.ano, entidade: l.entidade, de: l.de, ate: l.ate, numeros: l.itens.map((i) => i.numero) });
          for (const i of l.itens) {
            const id = `${l.entidade}-${i.ano}-${i.numero}`;
            const atual = base.empenhos.get(id);
            const novo: Empenho = {
              ...atual,
              id, entidade: l.entidade, ano: i.ano, numero: i.numero, data: i.data, credor: i.credor,
              empenhado: i.empenhado, liquidado: i.liquidado, pago: i.pago, pagoRestos: i.pagoRestos,
              origens: { ...atual?.origens, lista: origem },
            };
            base.empenhos.set(id, novo);
          }
        } else if (l.tipo === "detalhe-empenho") {
          const id = `${l.entidade}-${l.ano}-${l.numero}`;
          if (!l.detalhe) { r.ausentes.push({ id, origem }); continue; }
          const { data, credor } = l.detalhe;
          const detalhe = {
            valor: l.detalhe.valor, classificacao: l.detalhe.classificacao,
            ...(l.detalhe.licitacao ? { licitacao: l.detalhe.licitacao } : {}),
            ...(l.detalhe.contrato ? { contrato: l.detalhe.contrato } : {}),
            ...(l.detalhe.ordemCompra ? { ordemCompra: l.detalhe.ordemCompra } : {}),
            especificacao: l.detalhe.especificacao, liquidacoes: l.detalhe.liquidacoes, pagamentos: l.detalhe.pagamentos,
          };
          const atual = base.empenhos.get(id);
          base.empenhos.set(id, {
            // sem a lista ainda, o detalhe basta para existir na base
            id, entidade: l.entidade, ano: l.ano, numero: l.numero, data, credor,
            empenhado: detalhe.valor,
            liquidado: somaLiquida(detalhe.liquidacoes),
            pago: somaLiquida(detalhe.pagamentos),
            pagoRestos: 0,
            ...atual,
            detalhe,
            origens: { ...atual?.origens, detalhe: origem },
          });
        } else if (l.tipo === "api-empenhos") {
          for (const i of l.itens) {
            const id = `${l.entidade}-${i.ano}-${i.numero}`;
            const atual = base.empenhos.get(id);
            if (!atual) { r.soNaApi.push(id); continue; }
            base.empenhos.set(id, { ...atual, api: { valor: i.valor, fonteRecurso: i.fonteRecurso, descricao: i.descricao }, origens: { ...atual.origens, api: origem } });
          }
        } else if (l.tipo === "balancete-orgaos") {
          base.balancetes.set(chaveBalancete(l.entidade, l.ano), { ano: l.ano, entidade: l.entidade, ...l.balancete, origem });
        }
      }
    }
  }
  return r;
}
