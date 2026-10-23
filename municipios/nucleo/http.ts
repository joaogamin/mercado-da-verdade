// Cliente HTTP da coleta: sequencial, com intervalo minimo entre requisicoes,
// retry com espera crescente e TODA resposta gravada no WARC antes de ser lida.
import type { Etiqueta, GravadorWarc, Registro } from "./warc.ts";

export type OpcoesCliente = {
  userAgent: string;
  /** Intervalo minimo entre duas requisicoes deste cliente. */
  intervaloMs: number;
  gravador: GravadorWarc;
  timeoutMs?: number;
  /** Esperas entre tentativas; o tamanho define quantas tentativas extras ha. */
  esperasMs?: number[];
};

export type Pedido = {
  metodo: "GET" | "POST";
  url: string;
  headers?: Record<string, string>;
  form?: [string, string][];
  cookie?: string;
  /**
   * Etiqueta do registro no WARC. Pode ser calculada a partir da resposta: quando
   * o conteudo diz o que ele e (ex.: "Empenho: 2025/3600"), a etiqueta nunca
   * fica diferente do que foi gravado.
   */
  etiqueta?: Etiqueta | ((corpo: Uint8Array) => Etiqueta | undefined);
  /** Status de erro que sao resposta valida (ex.: 404 = "ainda nao publicado"), devolvidos sem excecao. */
  aceitar?: number[];
};

export type Resposta = {
  status: number;
  headers: Headers;
  corpo: Uint8Array;
  registro: Registro;
};

const dormir = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class Cliente {
  private readonly o: Required<OpcoesCliente>;
  private ultimo = 0;
  requisicoes = 0;

  constructor(o: OpcoesCliente) {
    this.o = { timeoutMs: 180_000, esperasMs: [5_000, 15_000, 45_000], ...o };
  }

  async requisitar(p: Pedido): Promise<Resposta> {
    const headers: Record<string, string> = {
      "User-Agent": this.o.userAgent,
      "Accept-Encoding": "identity",
      "Accept-Language": "pt-BR,pt;q=0.9",
      ...p.headers,
    };
    if (p.cookie) headers.Cookie = p.cookie;
    let corpo: Uint8Array<ArrayBuffer> | undefined;
    if (p.form) {
      headers["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
      corpo = new TextEncoder().encode(new URLSearchParams(p.form).toString());
    }

    for (let tentativa = 0; ; tentativa++) {
      const espera = this.ultimo + this.o.intervaloMs - Date.now();
      if (espera > 0) await dormir(espera);
      this.ultimo = Date.now();
      this.requisicoes++;

      try {
        const r = await fetch(p.url, {
          method: p.metodo,
          headers,
          body: corpo,
          redirect: "manual",
          signal: AbortSignal.timeout(this.o.timeoutMs),
        });
        const bytes = new Uint8Array(await r.arrayBuffer());
        const registro = await this.o.gravador.gravar({
          requisicao: { metodo: p.metodo, url: p.url, headers: Object.entries(headers), corpo },
          resposta: { status: r.status, statusText: r.statusText, headers: [...r.headers], corpo: bytes },
          data: new Date().toISOString(),
          etiqueta: typeof p.etiqueta === "function" ? p.etiqueta(bytes) : p.etiqueta,
        });
        if (r.status >= 500 && tentativa < this.o.esperasMs.length) {
          await dormir(this.o.esperasMs[tentativa]);
          continue;
        }
        if (r.status >= 400 && !p.aceitar?.includes(r.status)) throw new Error(`HTTP ${r.status} em ${p.metodo} ${p.url}`);
        return { status: r.status, headers: r.headers, corpo: bytes, registro };
      } catch (e) {
        const rede = e instanceof TypeError || (e instanceof DOMException && e.name === "TimeoutError");
        if (!rede || tentativa >= this.o.esperasMs.length) throw e;
        await dormir(this.o.esperasMs[tentativa]);
      }
    }
  }
}

/** Uma sessao de navegador: guarda o cookie entre as requisicoes. */
export class Sessao {
  private readonly cliente: Cliente;
  private cookies = new Map<string, string>();

  constructor(cliente: Cliente) {
    this.cliente = cliente;
  }

  get cookie(): string {
    return [...this.cookies].map(([k, v]) => `${k}=${v}`).join("; ");
  }

  async requisitar(p: Omit<Pedido, "cookie">): Promise<Resposta> {
    const r = await this.cliente.requisitar({ ...p, cookie: this.cookie || undefined });
    for (const c of r.headers.getSetCookie()) {
      const [par] = c.split(";");
      const i = par.indexOf("=");
      if (i > 0) this.cookies.set(par.slice(0, i).trim(), par.slice(i + 1).trim());
    }
    return r;
  }
}

export function texto(bytes: Uint8Array, charset = "utf-8"): string {
  return new TextDecoder(charset).decode(bytes);
}
