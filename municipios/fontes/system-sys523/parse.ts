// Parsers puros: bytes exatamente como o portal entregou -> esquema canonico.
// Nao fazem rede nem leem disco, entao rodam igual na coleta e no reprocessamento.
// Formato inesperado vira aviso (que bloqueia o auto-merge pelo portao de
// leitura), nao zero silencioso.
import * as cheerio from "cheerio";
import { lerCsv } from "../../nucleo/csv.ts";
import { centavos, centavosDeNumero } from "../../nucleo/dinheiro.ts";
import { isoDeBr } from "../../nucleo/datas.ts";
import { documentoPublico, mascararCpfsNoTexto } from "../../nucleo/privacidade.ts";
import type {
  Balancete, Classificacao, Contrato, Credor, EmpenhoApi, EmpenhoDetalhe, EmpenhoLista,
  Licitacao, Liquidacao, LinhaBalancete, Pagamento,
} from "../../nucleo/esquema.ts";
import { atualizacao } from "./jsf.ts";

/**
 * avisos: o formato nao era o esperado (bloqueia o auto-merge).
 * divergencias: o portal se contradiz (vai para a conferencia, nao bloqueia).
 */
export type ComAvisos<T> = { valor: T; avisos: string[]; divergencias?: string[] };

const latin1 = (b: Uint8Array) => new TextDecoder("latin1").decode(b);
const reais = (c: number) => (c / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const utf8 = (b: Uint8Array) => new TextDecoder("utf-8").decode(b);
const limpar = (s: string) => s.replace(/ /g, " ").replace(/\s+/g, " ").trim();

function exigirCabecalho(recebido: string[], esperado: string[], onde: string) {
  if (recebido.join("|") !== esperado.join("|")) {
    throw new Error(`${onde}: cabecalho mudou.\n esperado: ${esperado.join(" | ")}\n recebido: ${recebido.join(" | ")}`);
  }
}

export function credor(nomePublicado: string, documento: string): Credor {
  const { texto: nome, mascarou } = mascararCpfsNoTexto(limpar(nomePublicado));
  const doc = limpar(documento);
  const tipo: Credor["tipo"] =
    doc === "" && /PROVENTOS FOLHA/i.test(nome) ? "folha"
      : /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(doc) ? "PJ"
        : /^\*{3}\.\d{3}\.\d{3}-\*{2}$/.test(doc) ? "PF"
          : "sem-documento";
  return mascarou ? { nome, documento: doc, tipo, nomeMascarado: true } : { nome, documento: doc, tipo };
}

// ---------------------------------------------------------------- lista (CSV)

const CAB_LISTA = ["Empenho", "Data", "Credor", "CNPJ/CPF", "Valor Empenhado", "Valor Liquidado", "Valor Pago", "Valor Pago em Restos"];

export type TotaisLista = { empenhado: number; liquidado: number; pago: number; pagoRestos: number };

export function lerListaEmpenhos(bytes: Uint8Array): ComAvisos<{ itens: EmpenhoLista[]; total: TotaisLista }> {
  const linhas = lerCsv(latin1(bytes)).filter((l) => l.some((c) => c !== ""));
  if (linhas.length === 0) throw new Error("lista de empenhos vazia (a exportacao falhou?)");
  exigirCabecalho(linhas[0], CAB_LISTA, "lista de empenhos");

  const avisos: string[] = [];
  const itens: EmpenhoLista[] = [];
  let total: TotaisLista | undefined;
  // "Pago em Restos" vem em branco para empenhos do exercicio corrente (restos
  // so existem depois do fechamento) e o proprio rodape do portal diz R$ 0,00.
  // So essa coluna aceita branco; qualquer outro campo vazio continua sendo erro.
  let restosEmBranco = 0;
  const restos = (v: string) => (v === "" ? (restosEmBranco++, 0) : centavos(v));
  for (const l of linhas.slice(1)) {
    if (l[3] === "Total Geral:") {
      total = { empenhado: centavos(l[4]), liquidado: centavos(l[5]), pago: centavos(l[6]), pagoRestos: centavos(l[7]) };
      continue;
    }
    const m = /^(\d{4}) \/ (\d+)$/.exec(l[0]);
    if (!m || l.length !== CAB_LISTA.length) { avisos.push(`linha de empenho fora do formato: ${l.join(" | ")}`); continue; }
    itens.push({
      ano: Number(m[1]),
      numero: Number(m[2]),
      data: isoDeBr(l[1]),
      credor: credor(l[2], l[3]),
      empenhado: centavos(l[4]),
      liquidado: centavos(l[5]),
      pago: centavos(l[6]),
      pagoRestos: restos(l[7]),
    });
  }
  if (!total) throw new Error("lista de empenhos sem a linha Total Geral (arquivo truncado?)");
  if (restosEmBranco && total.pagoRestos !== 0) {
    avisos.push(`${restosEmBranco} linhas com "Pago em Restos" em branco, mas o rodapé não é zero`);
  }

  // O rodape do portal nem sempre e a soma das linhas (em 10/03/2025 o liquidado
  // do rodape inclui algo que as linhas nao mostram). Registramos, nao corrigimos.
  const divergencias: string[] = [];
  const soma = (k: keyof TotaisLista) => itens.reduce((s, i) => s + i[k], 0);
  for (const k of ["empenhado", "liquidado", "pago", "pagoRestos"] as const) {
    if (soma(k) !== total[k]) divergencias.push(`${k}: soma das linhas ${reais(soma(k))} × Total Geral do portal ${reais(total[k])}`);
  }
  if (restosEmBranco) divergencias.push(`${restosEmBranco} linhas com "Pago em Restos" em branco no portal, lidas como R$ 0,00 (o rodapé do portal é R$ 0,00)`);
  return { valor: { itens, total }, avisos, divergencias };
}

// ------------------------------------------------------- balancete por orgao

const CAB_BAL = ["Código", "Órgão", "Dotação Inicial", "Dotação Atualizada", "Empenhado", "Liquidado", "Pago", "Pago em Restos"];

export function lerBalanceteOrgaos(bytes: Uint8Array): Omit<Balancete, "ano" | "entidade" | "origem"> {
  const linhas = lerCsv(latin1(bytes)).filter((l) => l.some((c) => c !== ""));
  exigirCabecalho(linhas[0] ?? [], CAB_BAL, "balancete por orgao");
  const valores = (l: string[]) => ({
    dotacaoInicial: centavos(l[2]), dotacaoAtualizada: centavos(l[3]),
    empenhado: centavos(l[4]), liquidado: centavos(l[5]), pago: centavos(l[6]), pagoRestos: centavos(l[7]),
  });
  const linha = (l: string[]): LinhaBalancete => ({ codigo: l[0], orgao: limpar(l[1]), ...valores(l) });
  const corpo = linhas.slice(1);
  const ult = corpo.find((l) => l[1] === "Total Geral:");
  if (!ult) throw new Error("balancete sem a linha Total Geral");
  return { linhas: corpo.filter((l) => l !== ult).map(linha), total: valores(ult) };
}

// ------------------------------------------------------------------- API

type ItemApi = { entidade: number; ano: number; numeroEmpenho: number; valor: number; cpfCnpj: string; fonteRecurso: string; descricao: string };

/** O CPF completo morre aqui: so a versao mascarada sai desta funcao. */
export function lerApiEmpenhos(bytes: Uint8Array): EmpenhoApi[] {
  const dados = JSON.parse(utf8(bytes)) as ItemApi[];
  if (!Array.isArray(dados)) throw new Error("API de empenhos nao devolveu uma lista");
  return dados.map((d) => ({
    ano: d.ano,
    numero: d.numeroEmpenho,
    valor: centavosDeNumero(d.valor),
    documento: documentoPublico(String(d.cpfCnpj ?? "")),
    fonteRecurso: limpar(d.fonteRecurso ?? ""),
    descricao: mascararCpfsNoTexto(limpar(d.descricao ?? "")).texto,
  }));
}

// ------------------------------------------------------- detalhe do empenho

/** "05.01.04.129.0005.2017.3.3.90.40.06.00.00" -> partes da classificacao. */
export function decodificarConta(conta: string) {
  const p = conta.split(".");
  if (p.length < 11 || p.some((x) => !/^\d+$/.test(x))) throw new Error(`conta orcamentaria fora do formato: ${conta}`);
  return {
    orgao: p[0], unidade: `${p[0]}.${p[1]}`, funcao: p[2], subfuncao: p[3], programa: p[4], acao: p[5],
    natureza: `${p[6]}.${p[7]}`,
    elemento: `${p[6]}.${p[7]}.${p[8]}.${p[9]}`,
    subelemento: `${p[6]}.${p[7]}.${p[8]}.${p[9]}.${p[10]}`,
  };
}

function rotulos($: cheerio.CheerioAPI, bloco: ReturnType<cheerio.CheerioAPI>): Map<string, { texto: string; href?: string }> {
  const mapa = new Map<string, { texto: string; href?: string }>();
  let atual: string | null = null;
  let texto = "";
  let href: string | undefined;
  const fecha = () => { if (atual) mapa.set(atual, { texto: limpar(texto), href }); atual = null; texto = ""; href = undefined; };
  bloco.contents().each((_, n) => {
    if (n.type === "tag" && n.tagName === "b") { fecha(); atual = limpar($(n).text()).replace(/:$/, ""); return; }
    if (n.type === "tag" && (n.tagName === "br" || n.tagName === "div")) { fecha(); return; }
    if (!atual) return;
    if (n.type === "tag" && n.tagName === "a") href = $(n).attr("href");
    texto += $(n).text();
  });
  fecha();
  return mapa;
}

function linhasDaTabela($: cheerio.CheerioAPI, id: string): string[][] {
  return $(`tbody[id$="${id}_data"] > tr[data-ri]`).toArray().map((tr) =>
    $(tr).children("td").toArray().map((td) => limpar($(td).text())));
}

export function lerDetalhe(xml: string, base: string): ComAvisos<EmpenhoDetalhe> {
  const html = atualizacao(xml, "listEmpenhos");
  if (!html) throw new Error("resposta do detalhe sem o update listEmpenhos (sessao expirou?)");
  const $ = cheerio.load(`<table>${html}</table>`);
  const avisos: string[] = [];

  const cab = /Empenho:\s*(\d{4})\/(\d+)/.exec($("h3").first().text());
  if (!cab) throw new Error("detalhe sem o titulo 'Empenho: aaaa/n'");
  const r = rotulos($, $('div[align="left"]').first());
  const v = (k: string) => r.get(k)?.texto ?? "";
  const exige = (k: string) => { const t = v(k); if (!t) throw new Error(`detalhe sem o campo "${k}"`); return t; };

  const contaTxt = exige("Conta Orçamentária");
  const [conta, ...descr] = contaTxt.split(" - ");
  const cod = decodificarConta(conta.trim());
  const [recursoTxt, complemento = ""] = v("Recurso / Complemento").split(" / ");
  const [recCod, ...recNome] = recursoTxt.split(" - ");

  const classificacao: Classificacao = {
    conta: conta.trim(),
    descricao: descr.join(" - ").trim(),
    orgao: { codigo: cod.orgao, nome: exige("Órgão") },
    unidade: { codigo: cod.unidade, nome: v("Órgão/Unidade") },
    funcao: { codigo: cod.funcao, nome: v("Função") },
    subfuncao: { codigo: cod.subfuncao, nome: v("Subfunção") },
    programa: cod.programa,
    acao: cod.acao,
    natureza: { codigo: cod.natureza, nome: v("Natureza") },
    elemento: cod.elemento,
    subelemento: cod.subelemento,
    recurso: { codigo: recCod.trim(), nome: recNome.join(" - ").trim(), complemento: complemento.trim() },
  };

  let licitacao: Licitacao | undefined;
  const lic = v("Licitação");
  if (lic) {
    const m = /^(\d{4})\/(\d+)\s*-\s*(.+)$/.exec(lic);
    if (m) licitacao = { ano: Number(m[1]), numero: Number(m[2]), modalidade: m[3].trim() };
    else avisos.push(`licitacao fora do formato: ${lic}`);
  }

  let contrato: Contrato | undefined;
  const ct = r.get("Contrato");
  if (ct?.texto) {
    const m = /^(\d+)\/(\d{4})$/.exec(ct.texto);
    const tipo = ct.href ? new URL(ct.href, base).searchParams.get("tipoContrato") ?? "" : "";
    if (m) contrato = { numero: Number(m[1]), ano: Number(m[2]), tipo, url: ct.href ? new URL(ct.href, base).toString() : "" };
    else avisos.push(`contrato fora do formato: ${ct.texto}`);
  }

  const liquidacoes: Liquidacao[] = linhasDaTabela($, "tabelaliq").map((c) => ({
    data: isoDeBr(c[0]), numero: c[1], documento: c[2], valor: centavos(c[3]), estornado: centavos(c[4]),
  }));
  const pagamentos: Pagamento[] = linhasDaTabela($, "tabelapag").map((c) => ({
    data: isoDeBr(c[0]), liquidacao: c[1], documento: c[2], valor: centavos(c[3]), estornado: centavos(c[4]), descontos: centavos(c[5]),
  }));

  const ordem = v("Ordem de Compra");
  return {
    valor: {
      ano: Number(cab[1]),
      numero: Number(cab[2]),
      data: isoDeBr(exige("Data")),
      valor: centavos(exige("Valor")),
      classificacao,
      credor: credor(v("Favorecido"), v("CPF/CNPJ do Favorecido")),
      ...(licitacao ? { licitacao } : {}),
      ...(contrato ? { contrato } : {}),
      ...(ordem ? { ordemCompra: ordem } : {}),
      especificacao: mascararCpfsNoTexto(limpar($("textarea").first().text())).texto,
      liquidacoes,
      pagamentos,
    },
    avisos,
  };
}
