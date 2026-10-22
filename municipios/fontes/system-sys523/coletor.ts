// Coletor do portal System: so fala com a rede e grava tudo no WARC com
// etiqueta. Nao interpreta dados alem do necessario para conduzir a sessao e
// validar que o arquivo exportado e o que foi pedido.
import { Cliente, Sessao, texto, type Resposta } from "../../nucleo/http.ts";
import type { Etiqueta } from "../../nucleo/warc.ts";
import type { Coletor, Entidade, ResultadoDetalhe } from "../tipos.ts";
import { campo, lerTela, mensagens, totalDeRegistros, type Tela } from "./jsf.ts";

export type ConfigSystem = {
  /** https://www.erechim.rs.gov.br */
  base: string;
  /** https://www.erechim.rs.gov.br:8181 */
  baseApi: string;
  /** /sys523 */
  contexto: string;
};

const AJAX = { "Faces-Request": "partial/ajax", "X-Requested-With": "XMLHttpRequest" };

/** ViewState novo devolvido numa partial-response, se houver. */
function viewStateAtualizado(xml: string): string | undefined {
  return /ViewState:\d+"><!\[CDATA\[([^\]]+)\]\]>/.exec(xml)?.[1];
}

/** Valores em R$ logo depois de "Total Geral:" na tabela renderizada. */
export function rodapeTotal(xml: string): string[] {
  const i = xml.indexOf("Total Geral:");
  if (i < 0) return [];
  return [...xml.slice(i, i + 4000).matchAll(/R\$(?:\s|&nbsp;| )*-?[\d.]+,\d{2}/g)].map((m) => m[0].replace(/&nbsp;| /g, " "));
}

/**
 * A pagina do empenho tem duas tabelas (o empenho e os materiais), e a de
 * materiais costuma estar vazia; por isso o criterio e a primeira tabela.
 */
export function situacaoDaPagina(html: string): "presente" | "ausente" | "desconhecida" {
  if (/Registros: 1 - \d+ \/ [1-9]/.test(html)) return "presente";
  if (/Nenhum registro encontrado\./.test(html)) return "ausente";
  return "desconhecida";
}

export function urlDetalhe(cfg: ConfigSystem, ano: number, numero: number, empresa: string): string {
  return `${cfg.base}${cfg.contexto}/publico/listaempenhos.xhtml?tipoFil=EMPENHO&anoBal=${ano}&empresa=${empresa}&numEmpenho=${numero}`;
}

export class ColetorSystem implements Coletor {
  private readonly cfg: ConfigSystem;
  private readonly telas: Cliente;
  private readonly api: Cliente;

  constructor(cfg: ConfigSystem, telas: Cliente, api: Cliente) {
    this.cfg = cfg;
    this.telas = telas;
    this.api = api;
  }

  private url(tela: string): string {
    return `${this.cfg.base}${this.cfg.contexto}/publico/${tela}`;
  }

  /**
   * GET -> Pesquisar (AJAX) -> Exportar CSV, na mesma sessao. A exportacao
   * ignora os filtros do proprio POST e usa o estado da sessao, entao a pesquisa
   * antes e obrigatoria e o rodape da pesquisa precisa bater com o arquivo.
   */
  private async exportar(tela: string, filtros: (t: Tela) => [string, string][], etiqueta: Etiqueta): Promise<Resposta> {
    const url = this.url(tela);
    const s = new Sessao(this.telas);
    const get = await s.requisitar({ metodo: "GET", url });
    const t = lerTela(texto(get.corpo));
    const csv = t.exportar.get("CSV");
    if (!csv) throw new Error(`${tela}: menu de exportacao CSV nao encontrado`);

    const comuns = (vs: string): [string, string][] => [["form1", "form1"], ...filtros(t), ["javax.faces.ViewState", vs]];
    const b = t.botaoPesquisar;
    const pesquisa = await s.requisitar({
      metodo: "POST", url, headers: AJAX,
      etiqueta: { ...etiqueta, tipo: `pesquisa-${etiqueta.tipo}` },
      form: [
        ["javax.faces.partial.ajax", "true"], ["javax.faces.source", b.id],
        ["javax.faces.partial.execute", b.execute], ["javax.faces.partial.render", b.render],
        [b.id, b.id], ...comuns(t.viewState),
      ],
    });
    const xml = texto(pesquisa.corpo);
    const erros = mensagens(xml);
    if (erros.length) throw new Error(`${tela}: o portal recusou a pesquisa: ${erros.join("; ")}`);

    const registros = totalDeRegistros(xml);
    const rodape = rodapeTotal(xml);
    const exp = await s.requisitar({
      metodo: "POST", url,
      etiqueta: {
        ...etiqueta,
        params: {
          ...etiqueta.params,
          ...(registros !== undefined ? { registrosNaTela: registros } : {}),
          rodapeNaTela: rodape.join(" | "),
          ...(t.atualizadoEm ? { portalAtualizadoEm: t.atualizadoEm } : {}),
        },
      },
      form: [...comuns(viewStateAtualizado(xml) ?? t.viewState), [csv, csv]],
    });
    if (!/attachment/i.test(exp.headers.get("content-disposition") ?? "")) {
      throw new Error(`${tela}: a exportacao nao devolveu um arquivo (sessao expirou?)`);
    }
    return exp;
  }

  async listaEmpenhos(q: { ano: number; entidade: Entidade; de: string; ate: string; mes?: number }): Promise<void> {
    await this.exportar(
      "despesasPorEmpenho.xhtml",
      (t) => [
        [campo(t, "Ano"), String(q.ano)],
        [campo(t, "Entidade"), q.entidade.codigos.tela],
        [campo(t, "Período", 0), "PERSONALIZADO"],
        [campo(t, "Período", 1), q.de],
        [campo(t, "Período", 2), q.ate],
      ],
      {
        tipo: "lista-empenhos",
        params: { ano: q.ano, entidade: q.entidade.id, de: q.de, ate: q.ate, ...(q.mes ? { mes: q.mes } : {}) },
        urlOficial: this.url("despesasPorEmpenho.xhtml"),
      },
    );
  }

  async balanceteOrgaos(q: { ano: number; entidade: Entidade }): Promise<void> {
    await this.exportar(
      "balDespOrgao.xhtml",
      (t) => [
        [campo(t, "Entidade"), q.entidade.codigos.tela],
        [campo(t, "Ano"), String(q.ano)],
        [campo(t, "Mês"), ""],
      ],
      { tipo: "balancete-orgaos", params: { ano: q.ano, entidade: q.entidade.id }, urlOficial: this.url("balDespOrgao.xhtml") },
    );
  }

  async detalharEmpenho(q: { ano: number; numero: number; entidade: Entidade }): Promise<ResultadoDetalhe> {
    const oficial = urlDetalhe(this.cfg, q.ano, q.numero, q.entidade.codigos.detalhe);
    const s = new Sessao(this.telas);
    const get = await s.requisitar({
      metodo: "GET", url: oficial,
      etiqueta: { tipo: "pagina-empenho", params: { ano: q.ano, numero: q.numero, entidade: q.entidade.id }, urlOficial: oficial },
    });
    const html = texto(get.corpo);
    const situacao = situacaoDaPagina(html);
    if (situacao === "ausente") return { encontrado: false };
    if (situacao === "desconhecida") throw new Error(`detalhe ${q.ano}/${q.numero}: pagina em formato desconhecido`);
    const vs = /name="javax\.faces\.ViewState"[^>]*value="([^"]+)"/.exec(html.slice(html.indexOf('<form id="form1"')))?.[1];
    if (!vs) throw new Error(`detalhe ${q.ano}/${q.numero}: ViewState nao encontrado`);

    await s.requisitar({
      metodo: "POST", url: oficial.split("?")[0], headers: AJAX,
      etiqueta: { tipo: "detalhe-empenho", params: { ano: q.ano, numero: q.numero, entidade: q.entidade.id }, urlOficial: oficial },
      form: [
        ["javax.faces.partial.ajax", "true"], ["javax.faces.source", "listEmpenhos"],
        ["javax.faces.partial.execute", "listEmpenhos"], ["javax.faces.partial.render", "listEmpenhos"],
        ["javax.faces.behavior.event", "rowToggle"], ["javax.faces.partial.event", "rowToggle"],
        ["listEmpenhos_rowExpansion", "true"], ["listEmpenhos_expandedRowIndex", "0"],
        ["listEmpenhos_encodeFeature", "true"], ["listEmpenhos_skipChildren", "true"],
        ["form1", "form1"], ["javax.faces.ViewState", vs],
      ],
    });
    return { encontrado: true };
  }

  async apiEmpenhos(q: { ano: number; entidade: Entidade }): Promise<void> {
    const url = `${this.cfg.baseApi}${this.cfg.contexto}/webresources/api/consultar-empenhos?entidade=${q.entidade.codigos.api}&ano=${q.ano}`;
    await this.api.requisitar({
      metodo: "GET", url,
      etiqueta: { tipo: "api-empenhos", params: { ano: q.ano, entidade: q.entidade.id }, urlOficial: `${this.cfg.base}${this.cfg.contexto}/publico/dadosPublicos.xhtml` },
    });
  }
}
