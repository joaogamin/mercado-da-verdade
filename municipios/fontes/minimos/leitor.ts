import type { Lido } from "../../nucleo/warc.ts";
import type { Fonte, Leitor, Leitura } from "../tipos.ts";
import { lerSiope, lerSiops } from "./parse.ts";

const num = (v: unknown) => Number(v);
const str = (v: unknown) => String(v ?? "");

export class LeitorMinimos implements Leitor {
  ler(r: Lido): { leitura: Leitura | null; avisos: string[] } {
    const p = r.etiqueta.params;
    const q = { ano: num(p.ano), bimestre: num(p.bimestre), municipio: str(p.municipio) };
    if (r.etiqueta.tipo === "siope-indicadores") {
      const { minimo, avisos } = lerSiope(r.corpo, q);
      return { leitura: { tipo: "minimo", area: "educacao", ano: q.ano, bimestre: q.bimestre, minimo }, avisos };
    }
    if (r.etiqueta.tipo === "siops-indicadores") {
      const { minimo, avisos } = lerSiops(r.corpo, r.status, q);
      return { leitura: { tipo: "minimo", area: "saude", ano: q.ano, bimestre: q.bimestre, minimo }, avisos };
    }
    return { leitura: null, avisos: [] };
  }
}

const leitor = new LeitorMinimos();

export const fonteSiope: Fonte = {
  id: "siope",
  nome: "SIOPE · FNDE, Ministério da Educação",
  papel: "complementar",
  capacidades: new Set(["minimo"]),
  etiquetas: new Set(["siope-indicadores"]),
  leitor,
};

export const fonteSiops: Fonte = {
  id: "siops",
  nome: "SIOPS · Ministério da Saúde",
  papel: "complementar",
  capacidades: new Set(["minimo"]),
  etiquetas: new Set(["siops-indicadores"]),
  leitor,
};

export const FONTES_MINIMOS = [fonteSiope, fonteSiops];
