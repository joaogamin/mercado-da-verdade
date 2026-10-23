// "Como esta a coleta?" — so le o estado salvo; pode rodar a qualquer momento,
// inclusive durante uma coleta, sem a trava.
import { existsSync } from "node:fs";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { caminhos } from "./caminhos.ts";
import { ETAPAS, lerEstado, lerProgresso } from "./estado.ts";

const hora = (d: Date) => d.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
const duracao = (ms: number) => { const m = Math.round(ms / 60000); return m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`; };

export async function status(cidade: string): Promise<string[]> {
  const p = caminhos(cidade);
  const ids = existsSync(p.coletas) ? (await readdir(p.coletas)).sort() : [];
  if (!ids.length) return ["nenhuma coleta ainda"];
  const id = ids[ids.length - 1];
  const e = await lerEstado(cidade, id);
  const pr = await lerProgresso(cidade, id);
  const linhas: string[] = [];
  const emExecucao = existsSync(p.trava);

  linhas.push(`coleta ${id} · ${e.escopo}${e.anos.length ? ` · ${e.anos.join(", ")}` : ""} · iniciada ${hora(new Date(e.iniciadoEm))}${emExecucao ? " · EM EXECUÇÃO" : ""}`);
  linhas.push(`etapas: ${ETAPAS.filter((n) => n !== "publicar").map((n, i) => `${i + 1} ${n} ${({ ok: "✓", falhou: "✗", pendente: "·" })[e.etapas[n].status]}`).join("  ")}`);

  const falha = ETAPAS.find((n) => e.etapas[n].status === "falhou");
  if (falha) linhas.push(`falhou em "${falha}": ${(e.etapas[falha].erro ?? "").split("\n")[0]}`);

  const alvos = pr.alvosDetalhe?.length ?? 0;
  const feitos = pr.feitos.filter((f) => f.startsWith("detalhe:")).length;
  if (alvos) {
    // o progresso e salvo a cada 20 tarefas: o ritmo usa o horario do arquivo
    const arquivo = join(p.brutosDaColeta(id), "progresso.json");
    const ate = existsSync(arquivo) ? (await stat(arquivo)).mtime : new Date();
    // ritmo recente: compara com a leitura anterior do proprio status (guardada
    // ao lado dos brutos); sem ela, a media desde o inicio da coleta
    const amostraArq = join(p.brutosDaColeta(id), "status.json");
    const anterior = existsSync(amostraArq) ? JSON.parse(await readFile(amostraArq, "utf8")) as { em: number; feitos: number } : null;
    await writeFile(amostraArq, JSON.stringify({ em: ate.getTime(), feitos }));
    const recente = anterior && feitos > anterior.feitos && ate.getTime() - anterior.em > 30_000 && ate.getTime() - anterior.em < 2 * 3600_000;
    const inicioDetalhes = Date.parse(e.iniciadoEm);
    const ritmo = recente ? (ate.getTime() - anterior!.em) / (feitos - anterior!.feitos) : feitos > 20 ? (ate.getTime() - inicioDetalhes) / feitos : 0;
    linhas.push(`detalhes: ${feitos.toLocaleString("pt-BR")} de ${alvos.toLocaleString("pt-BR")} (${((feitos / alvos) * 100).toFixed(1)}%)${ritmo ? ` · ~${(ritmo / 1000).toFixed(1)} s por empenho (${recente ? "desde a última consulta" : "média da coleta; rode de novo em 1 min para o ritmo recente"})` : ""}`);
    if (ritmo && feitos < alvos) {
      const restante = (alvos - feitos) * ritmo;
      const prazo = e.prazoAte ? Date.parse(e.prazoAte) : Infinity;
      const fimEstimado = Date.now() + restante;
      linhas.push(fimEstimado > prazo
        ? `para no prazo às ${hora(new Date(prazo))} com ~${Math.min(alvos, Math.round(feitos + (prazo - Date.now()) / ritmo)).toLocaleString("pt-BR")} detalhes; o resto (~${Math.max(0, Math.round(alvos - feitos - (prazo - Date.now()) / ritmo)).toLocaleString("pt-BR")}) fica para a próxima`
        : `termina em ~${duracao(restante)} (por volta de ${hora(new Date(fimEstimado))})`);
    }
  }
  const warc = join(p.brutosDaColeta(id), "telas.warc.gz");
  if (existsSync(warc)) linhas.push(`bruto gravado até agora: ${((await stat(warc)).size / 1e6).toFixed(0)} MB`);
  if (e.etapas.revisar.status === "ok") linhas.push(`pronta para revisão: ${join(p.coleta(id), "revisao.md")} · portões ${e.etapas.revisar.resumo?.liberado ? "verdes" : "pedem revisão humana"}`);
  return linhas;
}
