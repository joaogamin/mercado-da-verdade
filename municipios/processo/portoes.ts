// Portoes automaticos da revisao: se todos passam, o merge pode ser
// automatico; se algum falha, a coleta espera uma pessoa.
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { encontrarCpfs } from "../nucleo/privacidade.ts";
import type { Evento } from "../nucleo/esquema.ts";
import type { ConfigCidade } from "../cidades/tipos.ts";
import type { Conferencia } from "../analise/conferencia.ts";
import { RAIZ } from "./caminhos.ts";

export type Portao = { nome: string; ok: boolean; detalhe: string };

/** Todas as strings de um valor JSON (numeros ficam de fora). */
function textosDoJson(v: unknown, out: string[] = []): string[] {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) for (const x of v) textosDoJson(x, out);
  else if (v && typeof v === "object") for (const x of Object.values(v)) textosDoJson(x, out);
  return out;
}

/**
 * Procura CPF completo em todo arquivo versionado ou publicado. Nos JSON so
 * olha os textos: um valor em centavos acima de R$ 100 mi tem 11 digitos e
 * pareceria um CPF (ex.: 58015975075). O pipeline nunca guarda documento
 * como numero.
 */
export async function varrerPrivacidade(dirs: string[]): Promise<string[]> {
  const achados: string[] = [];
  const visitar = async (dir: string) => {
    if (!existsSync(dir)) return;
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const c = join(dir, e.name);
      if (e.isDirectory()) { if (e.name !== "brutos") await visitar(c); continue; }
      if (!/\.(json|ndjson|md|csv|html|txt)$/i.test(e.name)) continue;
      const conteudo = await readFile(c, "utf8");
      const textos = /\.json$/i.test(e.name) ? textosDoJson(JSON.parse(conteudo))
        : /\.ndjson$/i.test(e.name) ? conteudo.split("\n").filter((l) => l.trim()).flatMap((l) => textosDoJson(JSON.parse(l)))
          : [conteudo];
      const cpfs = textos.flatMap((t) => encontrarCpfs(t));
      if (cpfs.length) achados.push(`${relative(RAIZ, c)}: ${cpfs.length} ocorrência(s)`);
    }
  };
  for (const d of dirs) await visitar(d);
  return achados;
}

export function avaliarPortoes(o: {
  cfg: ConfigCidade;
  privacidade: string[];
  conferencia: Conferencia;
  eventos: Evento[];
  avisos: string[];
  totaisAntes: Map<string, number>;
  totaisDepois: Map<string, number>;
}): Portao[] {
  const p = o.cfg.portoes;
  const portoes: Portao[] = [];

  portoes.push({
    nome: "Privacidade",
    ok: o.privacidade.length === 0,
    detalhe: o.privacidade.length ? `CPF completo encontrado: ${o.privacidade.join("; ")}` : "nenhum CPF completo nos dados versionados ou publicados",
  });

  const conferidos = o.conferencia.exercicios.filter((x) => x.diferencaPct !== null);
  const fora = conferidos.filter((x) => Math.abs(x.diferencaPct!) > p.divergenciaMaximaPct);
  portoes.push({
    nome: "Conferência",
    ok: fora.length === 0,
    detalhe: fora.length
      ? fora.map((x) => `${x.ano}: o pago dentro do exercício difere ${x.diferencaPct}% do balancete`).join("; ")
      : conferidos.length
        ? `pago dentro do exercício confere com o balancete oficial, dentro de ±${p.divergenciaMaximaPct}% (${conferidos.map((x) => `${x.ano}: ${x.diferencaPct}%`).join(", ")})`
        : "sem balancete oficial na base ainda: nada a conferir (escopo sem balancete)",
  });

  const removidos = o.eventos.filter((e) => e.tipo === "removido");
  const alterados = o.eventos.filter((e) => e.tipo === "alterado");
  portoes.push({
    nome: "Remoção ou alteração",
    ok: removidos.length === 0 && alterados.length === 0,
    detalhe: `${removidos.length} removido(s), ${alterados.length} alteração(ões) em campos sensíveis`,
  });

  const quedas: string[] = [];
  for (const [k, antes] of o.totaisAntes) {
    const depois = o.totaisDepois.get(k) ?? 0;
    if (antes > 0 && (antes - depois) / antes * 100 > p.quedaMaximaPct) quedas.push(`${k}: ${antes} → ${depois}`);
  }
  portoes.push({
    nome: "Queda",
    ok: quedas.length === 0,
    detalhe: quedas.length ? `total empenhado caiu mais de ${p.quedaMaximaPct}%: ${quedas.join("; ")}` : "nenhum exercício perdeu valor empenhado",
  });

  portoes.push({
    nome: "Leitura",
    ok: o.avisos.length <= p.avisosMaximos,
    detalhe: o.avisos.length ? `${o.avisos.length} aviso(s) de leitura (o portal mudou de formato?)` : "todas as respostas no formato esperado",
  });
  return portoes;
}
