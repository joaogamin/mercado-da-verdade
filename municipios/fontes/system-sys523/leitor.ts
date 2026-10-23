import type { Lido } from "../../nucleo/warc.ts";
import type { Fonte, Leitor, Leitura } from "../tipos.ts";
import { situacaoDaPagina } from "./coletor.ts";
import { lerApiEmpenhos, lerBalanceteOrgaos, lerDetalhe, lerListaEmpenhos } from "./parse.ts";
import { centavos } from "../../nucleo/dinheiro.ts";

const num = (v: unknown) => Number(v);
const str = (v: unknown) => String(v ?? "");

/** O que o rodape da pesquisa mostrou tem que ser o que veio no arquivo. */
function conferirRodape(rodape: string, totalArquivo: number[], onde: string): string[] {
  if (!rodape) return [];
  const naTela = rodape.split(" | ").map((v) => centavos(v));
  const diferentes = naTela.some((v, i) => totalArquivo[i] !== undefined && v !== totalArquivo[i]);
  return diferentes ? [`${onde}: o arquivo exportado nao corresponde a pesquisa feita (tela: ${rodape})`] : [];
}

export class LeitorSystem implements Leitor {
  private readonly base: string;
  constructor(base: string) {
    this.base = base;
  }

  ler(r: Lido): { leitura: Leitura | null; avisos: string[] } {
    const p = r.etiqueta.params;
    const corpo = r.corpo;
    switch (r.etiqueta.tipo) {
      case "lista-empenhos": {
        const { valor, avisos, divergencias = [] } = lerListaEmpenhos(corpo);
        const onde = `lista ${str(p.de)} a ${str(p.ate)}`;
        const t = valor.total;
        avisos.push(...conferirRodape(str(p.rodapeNaTela), [t.empenhado, t.liquidado, t.pago, t.pagoRestos], onde));
        if (p.registrosNaTela !== undefined && num(p.registrosNaTela) !== valor.itens.length) {
          avisos.push(`${onde}: a tela tinha ${str(p.registrosNaTela)} registros e o arquivo ${valor.itens.length}`);
        }
        const [di, mi, ai] = str(p.de).split("/");
        const [df, mf, af] = str(p.ate).split("/");
        const de = `${ai}-${mi}-${di}`, ate = `${af}-${mf}-${df}`;
        for (const i of valor.itens) {
          if (i.ano !== num(p.ano) || i.data < de || i.data > ate) {
            avisos.push(`${onde}: empenho ${i.ano}/${i.numero} de ${i.data} fora do filtro pedido`);
            break;
          }
        }
        return {
          leitura: { tipo: "lista-empenhos", ano: num(p.ano), entidade: str(p.entidade), de, ate, itens: valor.itens, total: valor.total, divergencias },
          avisos,
        };
      }
      case "pagina-empenho": {
        const s = situacaoDaPagina(new TextDecoder().decode(corpo));
        if (s === "ausente") {
          return { leitura: { tipo: "detalhe-empenho", ano: num(p.ano), numero: num(p.numero), entidade: str(p.entidade), detalhe: null }, avisos: [] };
        }
        return { leitura: null, avisos: s === "desconhecida" ? [`pagina do empenho ${str(p.ano)}/${str(p.numero)} em formato desconhecido`] : [] };
      }
      case "detalhe-empenho": {
        const { valor, avisos } = lerDetalhe(new TextDecoder().decode(corpo), this.base);
        if (valor.ano !== num(p.ano) || valor.numero !== num(p.numero)) {
          avisos.push(`detalhe pedido ${str(p.ano)}/${str(p.numero)} mas veio ${valor.ano}/${valor.numero}`);
        }
        return { leitura: { tipo: "detalhe-empenho", ano: num(p.ano), numero: num(p.numero), entidade: str(p.entidade), detalhe: valor }, avisos };
      }
      case "api-empenhos":
        return { leitura: { tipo: "api-empenhos", ano: num(p.ano), entidade: str(p.entidade), itens: lerApiEmpenhos(corpo) }, avisos: [] };
      case "balancete-orgaos": {
        const b = lerBalanceteOrgaos(corpo);
        const t = b.total;
        const avisos = conferirRodape(str(p.rodapeNaTela),
          [t.dotacaoInicial, t.dotacaoAtualizada, t.empenhado, t.liquidado, t.pago, t.pagoRestos], `balancete ${str(p.ano)}`);
        return { leitura: { tipo: "balancete-orgaos", ano: num(p.ano), entidade: str(p.entidade), balancete: b }, avisos };
      }
      default:
        // pesquisa-* e demais respostas ficam no WARC como prova, sem leitura propria
        return { leitura: null, avisos: [] };
    }
  }
}

export function fonteSystem(base: string): Fonte {
  return {
    id: "system-sys523",
    nome: "Portal da Transparência da Prefeitura",
    papel: "prefeitura",
    capacidades: new Set(["lista-empenhos", "detalhe-empenho", "api-empenhos", "balancete-orgaos"]),
    // pesquisa-* ficam no WARC como prova, sem leitura propria (o leitor devolve null)
    etiquetas: new Set(["lista-empenhos", "pesquisa-lista-empenhos", "pagina-empenho", "detalhe-empenho", "api-empenhos", "balancete-orgaos", "pesquisa-balancete-orgaos"]),
    leitor: new LeitorSystem(base),
  };
}
