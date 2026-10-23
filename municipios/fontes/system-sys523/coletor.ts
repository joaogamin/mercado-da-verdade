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

  /**
   * Detalhe em lote, numa sessao so. Sem o numero do empenho, a pagina do
   * detalhe lista o exercicio inteiro em ordem de numero, e a expansao de linha
   * aceita o indice global — uma requisicao por empenho, em vez de GET + expansao
   * (descoberto em 23/10/2026: ~2x mais rapido e ~5x menos dados).
   *
   * O indice vem da posicao do numero no universo do exercicio (a lista do dia).
   * A etiqueta e tirada do conteudo ("Empenho: aaaa/n"); se o indice apontar
   * para outro empenho, aquele numero volta para o metodo de um em um.
   */
  async detalharEmLote(q: {
    ano: number;
    entidade: Entidade;
    numeros: number[];
    /** Todos os numeros do exercicio no portal, para calcular o indice. */
    universo: number[];
    /** Chamado a cada empenho concluido (para progresso, retomada e prazo). */
    aoConcluir: (numero: number, r: ResultadoDetalhe & { via: "lote" | "individual" }) => Promise<void>;
    deveParar: () => boolean;
    log: (s: string) => void;
  }): Promise<{ lote: number; individual: number }> {
    const ordenado = [...new Set(q.universo)].sort((a, b) => a - b);
    const indice = new Map(ordenado.map((n, i) => [n, i]));
    const listaUrl = `${this.cfg.base}${this.cfg.contexto}/publico/listaempenhos.xhtml?tipoFil=EMPENHO&anoBal=${q.ano}&empresa=${q.entidade.codigos.detalhe}`;
    const contagem = { lote: 0, individual: 0 };
    type SessaoLista = { s: Sessao; vs: string; usos: number };
    const sessao: { atual: SessaoLista | null } = { atual: null };
    let desalinhados = 0;

    const abrir = async () => {
      const s = new Sessao(this.telas);
      const get = await s.requisitar({ metodo: "GET", url: listaUrl });
      const html = texto(get.corpo);
      const vs = /name="javax\.faces\.ViewState"[^>]*value="([^"]+)"/.exec(html.slice(html.indexOf('<form id="form1"')))?.[1];
      if (!vs) throw new Error(`lista de empenhos ${q.ano}: ViewState nao encontrado`);
      sessao.atual = { s, vs, usos: 0 };
      return sessao.atual;
    };

    for (const numero of q.numeros) {
      if (q.deveParar()) break;
      const i = indice.get(numero);
      // desalinhou mais de 3 vezes: a ordem do portal nao e a esperada; segue um a um
      if (i === undefined || desalinhados > 3) {
        const r = await this.detalharEmpenho({ ano: q.ano, numero, entidade: q.entidade });
        contagem.individual++;
        await q.aoConcluir(numero, { ...r, via: "individual" });
        continue;
      }
      // abrir a sessao com a lista inteira custa ~25 s ao servidor: reaproveitar ao maximo
      const ses: SessaoLista = sessao.atual && sessao.atual.usos < 3000 ? sessao.atual : await abrir();
      const oficial = urlDetalhe(this.cfg, q.ano, numero, q.entidade.codigos.detalhe);
      let veio: number | undefined;
      await ses.s.requisitar({
        metodo: "POST", url: listaUrl.split("?")[0], headers: AJAX,
        etiqueta: (corpo) => {
          const m = /Empenho:\s*(\d{4})\/(\d+)/.exec(new TextDecoder().decode(corpo));
          if (!m || Number(m[1]) !== q.ano) return undefined;
          veio = Number(m[2]);
          return {
            tipo: "detalhe-empenho",
            params: { ano: q.ano, numero: veio, entidade: q.entidade.id, via: "lote", indice: i },
            urlOficial: urlDetalhe(this.cfg, q.ano, veio, q.entidade.codigos.detalhe),
          };
        },
        form: [
          ["javax.faces.partial.ajax", "true"], ["javax.faces.source", "listEmpenhos"],
          ["javax.faces.partial.execute", "listEmpenhos"], ["javax.faces.partial.render", "listEmpenhos"],
          ["javax.faces.behavior.event", "rowToggle"], ["javax.faces.partial.event", "rowToggle"],
          ["listEmpenhos_rowExpansion", "true"], ["listEmpenhos_expandedRowIndex", String(i)],
          ["listEmpenhos_encodeFeature", "true"], ["listEmpenhos_skipChildren", "true"],
          ["form1", "form1"], ["javax.faces.ViewState", ses.vs],
        ],
      });
      ses.usos++;
      if (veio === numero) {
        contagem.lote++;
        await q.aoConcluir(numero, { encontrado: true, via: "lote" });
        continue;
      }
      // resposta sem o empenho (sessao expirou?) ou de outro empenho: refaz esse um a um
      if (veio === undefined) sessao.atual = null;
      else { desalinhados++; q.log(`lote ${q.ano}: indice ${i} trouxe ${veio}, nao ${numero}; segue um a um (${oficial})`); }
      const ind = await this.detalharEmpenho({ ano: q.ano, numero, entidade: q.entidade });
      contagem.individual++;
      await q.aoConcluir(numero, { ...ind, via: "individual" });
    }
    return contagem;
  }

  async apiEmpenhos(q: { ano: number; entidade: Entidade }): Promise<void> {
    const url = `${this.cfg.baseApi}${this.cfg.contexto}/webresources/api/consultar-empenhos?entidade=${q.entidade.codigos.api}&ano=${q.ano}`;
    await this.api.requisitar({
      metodo: "GET", url,
      etiqueta: { tipo: "api-empenhos", params: { ano: q.ano, entidade: q.entidade.id }, urlOficial: `${this.cfg.base}${this.cfg.contexto}/publico/dadosPublicos.xhtml` },
    });
  }
}
