// Roda no prebuild, sem rede: transforma dados/ (versionado) nos arquivos
// publicos que o explorador e os downloads usam. O build nunca consulta a
// prefeitura, entao o site sempre mostra exatamente o que esta versionado.
//
// Mesmo padrao do scripts/gerar-dados.mjs do Mercado: CSV com BOM (o Excel abre
// com acentuacao) e JSON com fonte, nota e data no cabecalho.
import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { ConfigCidade } from "../cidades/tipos.ts";
import type { Empenho, Origem } from "../nucleo/esquema.ts";
import { escaparCsv } from "../nucleo/csv.ts";
import { agruparPor } from "../nucleo/agrupar.ts";
import { modalidade } from "../analise/agregar.ts";
import { chaveCredor, slugCredor } from "../analise/chaves.ts";
import { carregarBase } from "../processo/base.ts";
import { caminhos } from "../processo/caminhos.ts";
import { COLUNAS_INDICE } from "./indice.ts";

const copia = (cidade: string, o?: Origem) => (o ? `/municipios/${cidade}/fontes/#coleta-${o.coleta}` : "");

export async function exportar(cfg: ConfigCidade): Promise<Record<string, unknown>> {
  const p = caminhos(cfg.slug);
  if (!existsSync(p.normalizado)) return { situacao: "sem dados normalizados ainda" };
  const base = await carregarBase(cfg.slug);
  if (existsSync(p.publico)) await rm(p.publico, { recursive: true });

  const resumo: Record<string, unknown> = {};
  const grupos = agruparPor(base.empenhos.values(), (e) => `${e.entidade}-${e.ano}`);
  for (const [k, lista] of [...grupos].sort(([a], [b]) => a.localeCompare(b))) {
    const dir = join(p.publico, k);
    await mkdir(dir, { recursive: true });
    const es = [...lista].sort((a, b) => a.numero - b.numero);

    const orgaos: Record<string, string> = {};
    const linhas = es.map((e) => {
      const org = e.detalhe ? String(Number(e.detalhe.classificacao.orgao.codigo)) : "";
      if (org) orgaos[org] = e.detalhe!.classificacao.orgao.nome;
      const ch = chaveCredor(e);
      return [
        e.numero, e.data, e.credor.nome, e.credor.documento, e.credor.tipo, slugCredor(ch, e.credor.nome),
        e.empenhado, e.liquidado, e.pago, e.pagoRestos, org, e.detalhe?.classificacao.elemento ?? "",
        modalidade(e).chave, e.removidoEm ?? "", e.detalhe ? 1 : 0,
      ];
    });
    await writeFile(join(dir, "indice.json"), JSON.stringify({ colunas: COLUNAS_INDICE, orgaos, linhas }), "utf8");

    // Detalhe completo particionado por mes: o explorador so baixa o mes do empenho aberto.
    for (const [mes, doMes] of agruparPor(es, (e) => e.data.slice(5, 7))) {
      const detalhes = Object.fromEntries(doMes.map((e) => [e.numero, {
        ...e.detalhe,
        api: e.api,
        origens: e.origens,
        removidoEm: e.removidoEm,
      }]));
      await writeFile(join(dir, `detalhe-${mes}.json`), JSON.stringify(detalhes), "utf8");
    }

    await exportarDownloads(cfg, dir, k, es);
    resumo[k] = { empenhos: es.length };
  }

  // Manifesto + carimbo de cada coleta: e o que permite a qualquer pessoa
  // conferir sha256 e data sem depender de nos.
  if (existsSync(p.coletas)) {
    for (const id of await readdir(p.coletas)) {
      for (const arq of ["manifesto.json", "manifesto.json.ots"]) {
        const origem = join(p.coleta(id), arq);
        if (!existsSync(origem)) continue;
        await mkdir(join(p.publico, "coletas", id), { recursive: true });
        await copyFile(origem, join(p.publico, "coletas", id, arq));
      }
    }
  }
  return resumo;
}

async function exportarDownloads(cfg: ConfigCidade, dir: string, k: string, es: Empenho[]) {
  const linhas = es.map((e) => {
    const c = e.detalhe?.classificacao;
    const o = e.origens.detalhe ?? e.origens.lista;
    return {
      exercicio: e.ano, numero: e.numero, data: e.data,
      credor: e.credor.nome, documento_credor: e.credor.documento, tipo_credor: e.credor.tipo,
      empenhado: (e.empenhado / 100).toFixed(2), liquidado: (e.liquidado / 100).toFixed(2),
      pago: (e.pago / 100).toFixed(2), pago_restos: (e.pagoRestos / 100).toFixed(2),
      orgao: c?.orgao.nome ?? "", unidade: c?.unidade.nome ?? "", funcao: c?.funcao.nome ?? "", subfuncao: c?.subfuncao.nome ?? "",
      conta_orcamentaria: c?.conta ?? "", elemento: c?.elemento ?? "", descricao_conta: c?.descricao ?? "",
      recurso: c ? `${c.recurso.codigo} - ${c.recurso.nome}` : "",
      licitacao: e.detalhe?.licitacao ? `${e.detalhe.licitacao.ano}/${e.detalhe.licitacao.numero} - ${e.detalhe.licitacao.modalidade}` : "",
      contrato: e.detalhe?.contrato ? `${e.detalhe.contrato.numero}/${e.detalhe.contrato.ano}` : "",
      especificacao: e.detalhe?.especificacao ?? e.api?.descricao ?? "",
      removido_do_portal_em: e.removidoEm ?? "",
      fonte: o?.fonte ?? "", url_oficial: o?.url ?? "", coletado_em: o?.coletadoEm ?? "",
      sha256_bruto: o?.sha256 ?? "", copia_arquivada: copia(cfg.slug, o),
    };
  });
  if (!linhas.length) return;
  const cols = Object.keys(linhas[0]) as (keyof (typeof linhas)[number])[];
  const csv = "﻿" + [cols.join(","), ...linhas.map((l) => cols.map((c) => escaparCsv(l[c])).join(","))].join("\r\n");
  await writeFile(join(dir, `empenhos-${k}.csv`), csv, "utf8");
  await writeFile(join(dir, `empenhos-${k}.json`), JSON.stringify({
    fonte: `Portal da Transparência da Prefeitura de ${cfg.nome} (${cfg.fonte.base})`,
    nota: "Valores em reais exatamente como publicados pela prefeitura. CPF de pessoa física mascarado no mesmo padrão das telas do portal. Cada linha traz a página oficial, o instante da coleta e o sha256 da resposta original.",
    gerado_em: new Date().toISOString().slice(0, 10),
    empenhos: linhas,
  }), "utf8");
}
