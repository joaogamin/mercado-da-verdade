// Bruto byte a byte em WARC (ISO 28500), o formato padrao de arquivamento web.
// Cada resposta vira um par request/response, mais uma etiqueta propria
// (WARC-Municipios-*) dizendo o que ela e — e isso que permite reprocessar tudo
// a partir do arquivo, sem voltar a prefeitura.
import { createReadStream, existsSync } from "node:fs";
import { mkdir, open, stat, truncate, type FileHandle } from "node:fs/promises";
import { dirname } from "node:path";
import { WARCParser, WARCRecord, WARCSerializer } from "warcio";
import { sha256 } from "./hash.ts";

export type Etiqueta = {
  /** Ex.: "lista-empenhos", "detalhe-empenho", "api-empenhos", "balancete-orgaos". */
  tipo: string;
  params: Record<string, string | number>;
  /** Pagina oficial que o cidadao abre para conferir este dado. */
  urlOficial: string;
};

export type Troca = {
  requisicao: { metodo: string; url: string; headers: [string, string][]; corpo?: Uint8Array };
  resposta: { status: number; statusText: string; headers: [string, string][]; corpo: Uint8Array };
  /** Instante da resposta, ISO. */
  data: string;
  etiqueta?: Etiqueta;
};

export type Registro = {
  arquivo: string;
  offset: number;
  tamanho: number;
  url: string;
  metodo: string;
  status: number;
  data: string;
  sha256: string;
  etiqueta?: Etiqueta;
};

const SERIALIZACAO = { gzip: true, digest: { algo: "sha-256" as const, prefix: "sha256:", base32: false } };

// O corpo gravado ja esta sem chunking e sem compressao (pedimos identity e o
// fetch entrega o corpo final); manter esses cabecalhos faria um leitor de WARC
// tentar decodificar de novo e corromper o conteudo.
const DESCARTAR = new Set(["transfer-encoding", "content-encoding", "content-length"]);

function cabecalhosHttp(headers: [string, string][], corpo: Uint8Array): [string, string][] {
  const ok = headers.filter(([k]) => !DESCARTAR.has(k.toLowerCase()));
  ok.push(["Content-Length", String(corpo.byteLength)]);
  return ok;
}

/**
 * Corta um resto incompleto no fim do WARC (processo interrompido no meio de
 * uma gravacao), preservando todos os registros completos. Devolve quantos
 * bytes foram cortados.
 */
export async function repararWarc(caminho: string): Promise<number> {
  const tamanho = (await stat(caminho)).size;
  const parser = new WARCParser(createReadStream(caminho));
  let fimBom = 0;
  try {
    for await (const rec of parser) {
      await rec.readFully();
      fimBom = parser.offset + parser.recordLength;
    }
  } catch {
    // registro truncado: fica so ate o ultimo completo
  }
  if (fimBom < tamanho) await truncate(caminho, fimBom);
  return tamanho - fimBom;
}

export class GravadorWarc {
  readonly caminho: string;
  private fh: FileHandle | null = null;
  private offset = 0;
  /** Bytes de um registro incompleto cortados na abertura (0 = arquivo integro). */
  cortados = 0;

  constructor(caminho: string) {
    this.caminho = caminho;
  }

  async abrir(info: Record<string, string>): Promise<void> {
    await mkdir(dirname(this.caminho), { recursive: true });
    // retomada depois de uma interrupcao: nunca continuar depois de um registro pela metade
    if (existsSync(this.caminho) && (await stat(this.caminho)).size > 0) this.cortados = await repararWarc(this.caminho);
    this.fh = await open(this.caminho, "a");
    this.offset = (await stat(this.caminho)).size;
    if (this.offset === 0) {
      const nome = this.caminho.split(/[\\/]/).pop() ?? "coleta.warc.gz";
      const rec = WARCRecord.createWARCInfo({ filename: nome, warcVersion: "WARC/1.1" }, info);
      await this.escrever(await WARCSerializer.serialize(rec, SERIALIZACAO));
    }
  }

  private async escrever(bytes: Uint8Array): Promise<{ offset: number; tamanho: number }> {
    if (!this.fh) throw new Error("WARC nao aberto");
    const offset = this.offset;
    await this.fh.write(bytes);
    this.offset += bytes.byteLength;
    return { offset, tamanho: bytes.byteLength };
  }

  async gravar(t: Troca): Promise<Registro> {
    const u = new URL(t.requisicao.url);
    const extras: Record<string, string> = {};
    const hash = sha256(t.resposta.corpo);
    extras["WARC-Municipios-Sha256"] = hash;
    if (t.etiqueta) {
      extras["WARC-Municipios-Tipo"] = t.etiqueta.tipo;
      extras["WARC-Municipios-Params"] = JSON.stringify(t.etiqueta.params);
      extras["WARC-Municipios-Url-Oficial"] = t.etiqueta.urlOficial;
    }

    const resposta = WARCRecord.create(
      {
        url: t.requisicao.url,
        date: t.data,
        type: "response",
        warcVersion: "WARC/1.1",
        statusline: `HTTP/1.1 ${t.resposta.status} ${t.resposta.statusText}`.trim(),
        httpHeaders: cabecalhosHttp(t.resposta.headers, t.resposta.corpo),
        warcHeaders: extras,
      },
      [t.resposta.corpo],
    );
    const idResposta = resposta.warcHeader("WARC-Record-ID") ?? "";

    const corpoReq = t.requisicao.corpo ?? new Uint8Array();
    const requisicao = WARCRecord.create(
      {
        url: t.requisicao.url,
        date: t.data,
        type: "request",
        warcVersion: "WARC/1.1",
        statusline: `${t.requisicao.metodo} ${u.pathname}${u.search} HTTP/1.1`,
        httpHeaders: corpoReq.byteLength
          ? [...t.requisicao.headers, ["Content-Length", String(corpoReq.byteLength)]]
          : t.requisicao.headers,
        warcHeaders: { "WARC-Concurrent-To": idResposta },
      },
      [corpoReq],
    );

    const pos = await this.escrever(await WARCSerializer.serialize(resposta, SERIALIZACAO));
    await this.escrever(await WARCSerializer.serialize(requisicao, SERIALIZACAO));

    return {
      arquivo: this.caminho.split(/[\\/]/).pop() ?? "",
      offset: pos.offset,
      tamanho: pos.tamanho,
      url: t.requisicao.url,
      metodo: t.requisicao.metodo,
      status: t.resposta.status,
      data: t.data,
      sha256: hash,
      etiqueta: t.etiqueta,
    };
  }

  async fechar(): Promise<void> {
    await this.fh?.close();
    this.fh = null;
  }
}

export type Lido = {
  etiqueta: Etiqueta;
  url: string;
  data: string;
  status: number;
  contentType: string;
  corpo: Uint8Array;
  sha256: string;
};

/** Le as respostas etiquetadas de um WARC, na ordem em que foram gravadas. */
export async function* lerWarc(caminho: string): AsyncGenerator<Lido> {
  for await (const rec of WARCParser.iterRecords(createReadStream(caminho))) {
    if (rec.warcType !== "response") { await rec.skipFully(); continue; }
    const tipo = rec.warcHeader("WARC-Municipios-Tipo");
    if (!tipo) { await rec.skipFully(); continue; }
    const corpo = await rec.readFully(true);
    const info = rec.getResponseInfo();
    const hash = sha256(corpo);
    const declarado = rec.warcHeader("WARC-Municipios-Sha256");
    if (declarado && declarado !== hash) throw new Error(`sha256 nao confere em ${caminho} (${rec.warcTargetURI})`);
    yield {
      etiqueta: {
        tipo,
        params: JSON.parse(rec.warcHeader("WARC-Municipios-Params") ?? "{}"),
        urlOficial: rec.warcHeader("WARC-Municipios-Url-Oficial") ?? "",
      },
      url: rec.warcTargetURI ?? "",
      data: rec.warcDate ?? "",
      status: Number(info?.status ?? 0),
      contentType: info?.headers.get("content-type") ?? "",
      corpo,
      sha256: hash,
    };
  }
}
