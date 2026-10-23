// Etapa 1: so rede -> WARC. Cada tarefa tem uma chave; a retomada pula as que
// ja estao em estado.feitos, entao uma queda no meio nao repete requisicoes.
import { join } from "node:path";
import { Cliente } from "../nucleo/http.ts";
import { GravadorWarc, lerWarc } from "../nucleo/warc.ts";
import { fimDoMes } from "../nucleo/datas.ts";
import { agruparPor } from "../nucleo/agrupar.ts";
import type { EmpenhoLista } from "../nucleo/esquema.ts";
import type { ConfigCidade } from "../cidades/tipos.ts";
import { ColetorSystem } from "../fontes/system-sys523/coletor.ts";
import { fonteSystem } from "../fontes/system-sys523/leitor.ts";
import type { Base } from "./base.ts";
import { caminhos } from "./caminhos.ts";
import { gravarProgresso, lerProgresso, type Estado } from "./estado.ts";

export const USER_AGENT = "Municipios/0.1 (coleta de dados publicos; +https://github.com/joaogamin/mercado-da-verdade)";

const dd = (n: number) => String(n).padStart(2, "0");

/** Janelas mensais (dd/mm/aaaa) do exercicio, recortadas pelo periodo e por hoje. */
export function janelas(ano: number, hoje: Date, de?: string, ate?: string): { mes: number; de: string; ate: string }[] {
  const iso = (br: string) => br.split("/").reverse().join("-");
  const fim = ano === hoje.getUTCFullYear() ? hoje.getUTCMonth() + 1 : 12;
  const out: { mes: number; de: string; ate: string }[] = [];
  for (let m = 1; m <= fim; m++) {
    let ini = `01/${dd(m)}/${ano}`, fimMes = fimDoMes(ano, m);
    if (de && iso(fimMes) < iso(de)) continue;
    if (ate && iso(ini) > iso(ate)) continue;
    if (de && iso(ini) < iso(de)) ini = de;
    if (ate && iso(fimMes) > iso(ate)) fimMes = ate;
    out.push({ mes: m, de: ini, ate: fimMes });
  }
  return out;
}

/** Quais empenhos precisam de detalhe nesta coleta, de forma deterministica. */
export function alvosDeDetalhe(estado: Estado, itens: (EmpenhoLista & { entidade: string })[], base: Base): string[] {
  const iso = (br?: string) => br?.split("/").reverse().join("-");
  const de = iso(estado.de), ate = iso(estado.ate);
  const escolhidos = itens.filter((i) => {
    if (estado.escopo === "completo") return true;
    if (estado.escopo === "periodo") return (!de || i.data >= de) && (!ate || i.data <= ate);
    const a = base.empenhos.get(`${i.entidade}-${i.ano}-${i.numero}`);
    const mudou = !a || !a.detalhe || a.empenhado !== i.empenhado || a.liquidado !== i.liquidado
      || a.pago !== i.pago || a.pagoRestos !== i.pagoRestos || a.credor.nome !== i.credor.nome;
    const aberto = i.empenhado - i.pago - i.pagoRestos > 0;
    return mudou || (estado.escopo === "abertos" && aberto);
  });
  const chaves = escolhidos.map((i) => `${i.entidade}:${i.ano}:${i.numero}`);
  return [...new Set(chaves)].sort((a, b) => {
    const [ea, aa, na] = a.split(":"), [eb, ab, nb] = b.split(":");
    return ea.localeCompare(eb) || Number(aa) - Number(ab) || Number(na) - Number(nb);
  });
}

/**
 * O portal sai do ar inteiro as vezes (a aplicacao /sys523/ responde 404 do
 * servidor enquanto o site da prefeitura funciona; visto em 22/10/2026, 23h).
 * Melhor falhar com a causa certa, antes de abrir arquivos, do que com um 404
 * no meio da coleta.
 */
export async function portalNoAr(cfg: ConfigCidade): Promise<{ ok: boolean; status: number }> {
  try {
    const r = await fetch(`${cfg.fonte.base}${cfg.fonte.contexto}/publico/index.xhtml`, {
      headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(60_000),
    });
    await r.arrayBuffer();
    return { ok: r.status === 200, status: r.status };
  } catch {
    return { ok: false, status: 0 };
  }
}

export async function coletar(cfg: ConfigCidade, estado: Estado, base: Base, salvar: () => Promise<void>, log: (s: string) => void) {
  const saude = await portalNoAr(cfg);
  if (!saude.ok) {
    throw new Error(`o portal da prefeitura está fora do ar (HTTP ${saude.status || "sem resposta"} em ${cfg.fonte.contexto}/publico/); nada foi coletado. Tente de novo mais tarde ou use "retomar".`);
  }
  const dir = caminhos(cfg.slug).brutosDaColeta(estado.id);
  const info = { software: "municipios (Mercado da Verdade)", cidade: cfg.nome, coleta: estado.id, escopo: estado.escopo };
  const gTelas = new GravadorWarc(join(dir, "telas.warc.gz"));
  const gApi = new GravadorWarc(join(dir, "api.warc.gz"));
  await gTelas.abrir(info);
  await gApi.abrir(info);
  const telas = new Cliente({ userAgent: USER_AGENT, intervaloMs: cfg.coleta.intervaloTelasMs, gravador: gTelas });
  const api = new Cliente({ userAgent: USER_AGENT, intervaloMs: cfg.coleta.intervaloApiMs, gravador: gApi, timeoutMs: 300_000 });
  const coletor = new ColetorSystem(cfg.fonte, telas, api);
  const leitor = fonteSystem(cfg.fonte.base).leitor;

  const progresso = await lerProgresso(cfg.slug, estado.id);
  const salvarTudo = async () => { await gravarProgresso(cfg.slug, estado.id, progresso); await salvar(); };
  const feitos = new Set(progresso.feitos);
  const tarefa = async (chave: string, fn: () => Promise<unknown>) => {
    if (feitos.has(chave)) return;
    await fn();
    feitos.add(chave);
    progresso.feitos.push(chave);
    if (progresso.feitos.length % 20 === 0) await salvarTudo();
  };

  try {
    const hoje = new Date();
    for (const ent of cfg.entidades) {
      for (const ano of estado.anos) {
        if (estado.escopo !== "periodo") await tarefa(`balancete:${ent.id}:${ano}`, () => coletor.balanceteOrgaos({ ano, entidade: ent }));
        for (const j of janelas(ano, hoje, estado.de, estado.ate)) {
          log(`lista ${ent.id} ${j.de} a ${j.ate}`);
          await tarefa(`lista:${ent.id}:${ano}:${j.de}:${j.ate}`, () => coletor.listaEmpenhos({ ano, entidade: ent, de: j.de, ate: j.ate, mes: j.mes }));
        }
        if (estado.escopo !== "periodo") {
          log(`API ${ent.id} ${ano} (a API aceita 1 chamada por minuto)`);
          await tarefa(`api:${ent.id}:${ano}`, () => coletor.apiEmpenhos({ ano, entidade: ent }));
        }
      }
    }
    await salvarTudo();

    // As listas do exercicio (ja no WARC) dizem o universo de cada exercicio;
    // relidas sempre, o que e rapido e permite retomar no meio.
    const itens: (EmpenhoLista & { entidade: string })[] = [];
    for await (const r of lerWarc(gTelas.caminho)) {
      if (r.etiqueta.tipo !== "lista-empenhos") continue;
      const { leitura } = leitor.ler(r);
      if (leitura?.tipo === "lista-empenhos") itens.push(...leitura.itens.map((i) => ({ ...i, entidade: leitura.entidade })));
    }
    if (!progresso.alvosDetalhe) {
      let alvos = alvosDeDetalhe(estado, itens, base);
      if (estado.limite !== undefined) alvos = alvos.slice(0, estado.limite);
      progresso.alvosDetalhe = alvos;
      await salvarTudo();
    }

    const total = progresso.alvosDetalhe.length;
    let n = 0, ausentes = 0, adiados = 0, viaLote = 0, viaIndividual = 0;
    const prazo = estado.prazoAte ? Date.parse(estado.prazoAte) : Infinity;
    const pendentes = progresso.alvosDetalhe.filter((a) => !feitos.has(`detalhe:${a}`));
    n = total - pendentes.length;
    const registrar = async (alvo: string, encontrado: boolean) => {
      n++;
      if (!encontrado) ausentes++;
      feitos.add(`detalhe:${alvo}`);
      progresso.feitos.push(`detalhe:${alvo}`);
      if (progresso.feitos.length % 20 === 0) await salvarTudo();
      if (n % 100 === 0 || n === total) log(`detalhe ${n}/${total}`);
    };

    // Em lote (uma sessao com a lista do exercicio inteiro) quando a coleta tem o
    // universo completo do exercicio; no escopo "periodo", um a um.
    const porGrupo = agruparPor(pendentes, (a) => a.split(":").slice(0, 2).join(":"));
    for (const [grupo, alvos] of porGrupo) {
      if (Date.now() > prazo) break;
      const [entId, anoTxt] = grupo.split(":");
      const ano = Number(anoTxt);
      const ent = cfg.entidades.find((e) => e.id === entId)!;
      const numeros = alvos.map((a) => Number(a.split(":")[2]));
      if (estado.escopo !== "periodo") {
        const universo = itens.filter((i) => i.entidade === entId && i.ano === ano).map((i) => i.numero);
        const c = await coletor.detalharEmLote({
          ano, entidade: ent, numeros, universo, log,
          deveParar: () => Date.now() > prazo,
          aoConcluir: async (numero, r) => registrar(`${grupo}:${numero}`, r.encontrado),
        });
        viaLote += c.lote; viaIndividual += c.individual;
      } else {
        for (const numero of numeros) {
          if (Date.now() > prazo) break;
          const r = await coletor.detalharEmpenho({ ano, numero, entidade: ent });
          viaIndividual++;
          await registrar(`${grupo}:${numero}`, r.encontrado);
        }
      }
    }
    adiados = total - n;
    if (adiados > 0) log(`prazo atingido: ${adiados} detalhes ficam para a proxima coleta incremental`);
    await salvarTudo();
    return { requisicoes: telas.requisicoes + api.requisicoes, detalhes: total - adiados, adiados, viaLote, viaIndividual, ausentesNoDetalhe: ausentes };
  } finally {
    await gTelas.fechar();
    await gApi.fechar();
  }
}
