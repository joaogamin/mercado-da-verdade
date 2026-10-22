// Leitura das telas JSF/PrimeFaces do portal System. Os ids (j_idtNN) sao
// gerados pelo servidor e mudam entre versoes, entao tudo aqui e descoberto
// pelo que e estavel: rotulos visiveis, titles dos botoes e ids nomeados.
import * as cheerio from "cheerio";

export type Tela = {
  viewState: string;
  /** Campos do form1 agrupados pelo rotulo visivel que os precede. */
  campos: Map<string, string[]>;
  botaoPesquisar: { id: string; execute: string; render: string };
  exportar: Map<string, string>;
  /** "Atualizado em" que o proprio portal mostra, se houver. */
  atualizadoEm?: string;
};

function normalizar(s: string): string {
  // "Ano*" (campo obrigatorio) e "Atualizado em:" viram "Ano" e "Atualizado em"
  return s.replace(/ /g, " ").replace(/\s+/g, " ").trim().replace(/[:*]+$/, "").trim();
}

export function lerViewState($: cheerio.CheerioAPI, form = "form1"): string {
  const v = $(`form#${form} input[name="javax.faces.ViewState"]`).first().attr("value");
  if (!v) throw new Error(`ViewState nao encontrado no ${form}`);
  return v;
}

export function lerTela(html: string): Tela {
  const $ = cheerio.load(html);
  const form = $("form#form1");
  if (!form.length) throw new Error("form1 nao encontrado na tela");

  const campos = new Map<string, string[]>();
  let rotulo = "";
  form.find("label, select, input").each((_, el) => {
    const $el = $(el);
    if (el.tagName === "label") {
      const t = normalizar($el.text());
      if (t) rotulo = t;
      return;
    }
    const nome = $el.attr("name");
    const tipo = ($el.attr("type") ?? "").toLowerCase();
    if (!nome || tipo === "hidden" || nome.endsWith("_focus") || !rotulo) return;
    campos.set(rotulo, [...(campos.get(rotulo) ?? []), nome]);
  });

  const btn = form.find('[title="Clique para pesquisar"]').first();
  const onclick = btn.attr("onclick") ?? "";
  const id = btn.attr("id");
  const execute = /p:"([^"]+)"/.exec(onclick)?.[1];
  const render = /u:"([^"]+)"/.exec(onclick)?.[1];
  if (!id || !execute || !render) throw new Error("botao Pesquisar nao encontrado ou em formato desconhecido");

  const exportar = new Map<string, string>();
  $('a[title^="Exporta "]').each((_, el) => {
    const formato = ($(el).attr("title") ?? "").replace("Exporta ", "").trim().toUpperCase();
    const param = /addSubmitParam\('form1',\{'([^']+)':'\1'/.exec($(el).attr("onclick") ?? "")?.[1];
    if (param) exportar.set(formato === "EXCEL" ? "XLS" : formato, param);
  });

  const atualizado = $('span[id$=":dtHr"]').first().text().trim() || undefined;

  return { viewState: lerViewState($), campos, botaoPesquisar: { id, execute, render }, exportar, atualizadoEm: atualizado };
}

export function campo(tela: Tela, rotulo: string, indice = 0): string {
  const nomes = tela.campos.get(rotulo);
  const nome = nomes?.[indice];
  if (!nome) throw new Error(`campo "${rotulo}"[${indice}] nao encontrado na tela`);
  return nome;
}

/** Conteudo (CDATA) de um <update id="..."> de uma partial-response. */
export function atualizacao(xml: string, id: string): string | undefined {
  const re = new RegExp(`<update id="${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></update>`);
  return re.exec(xml)?.[1];
}

/** Texto "Registros: 1 - 15 / 192" da tabela atualizada -> 192. */
export function totalDeRegistros(xml: string): number | undefined {
  const m = /Registros: \d+ - \d+ \/ (\d+)/.exec(xml);
  return m ? Number(m[1]) : undefined;
}

/** Mensagens de erro/aviso que o PrimeFaces devolve no update "mensagem". */
export function mensagens(xml: string): string[] {
  const $ = cheerio.load(xml, { xml: true });
  const out: string[] = [];
  $("update").each((_, u) => {
    const h = cheerio.load($(u).text());
    h(".ui-messages-error-summary, .ui-messages-warn-summary, .ui-message-error-detail").each((_, m) => {
      out.push(h(m).text().trim());
    });
  });
  return out.filter(Boolean);
}
