import type { Origem } from "@pipeline/nucleo/esquema.ts";
import { dataHora } from "../formato";

/**
 * Linha de fonte obrigatoria de todo bloco de dados. `origem` e exigida pelo
 * tipo: um bloco sem fonte nao compila. Fica sempre visivel — nunca dentro de
 * <details> — porque frisar a fonte e o ponto do projeto.
 */
export function Fonte({ origem, cidade, comoLer }: { origem: Origem; cidade: string; comoLer?: string }) {
  return (
    <p className="mun-fonte mono">
      <span className="mun-fonte-rot">Fonte</span>{" "}
      {origem.fonte}
      {" · "}
      <a href={origem.url} target="_blank" rel="noopener noreferrer nofollow">ver no portal ↗</a>
      {" · "}
      coletado em {dataHora(origem.coletadoEm)}
      {" · "}
      <a href={`/municipios/${cidade}/fontes/#coleta-${origem.coleta}`}>cópia arquivada</a>
      {" · "}
      sha256 <code title={origem.sha256}>{origem.sha256.slice(0, 12)}…</code>
      {comoLer ? <>{" · "}<a href={`/municipios/como-ler/#${comoLer}`}>como ler</a></> : null}
    </p>
  );
}

/** Fonte complementar (fora da prefeitura): sempre com selo proprio. */
export function FonteComplementar({ fonte, url, nota }: { fonte: string; url: string; nota?: string }) {
  return (
    <p className="mun-fonte mun-fonte--comp mono">
      <span className="mun-fonte-rot mun-fonte-rot--comp">Complementar</span>{" "}
      {fonte}
      {" · "}
      <a href={url} target="_blank" rel="noopener noreferrer nofollow">ver fonte ↗</a>
      {nota ? <>{" · "}{nota}</> : null}
    </p>
  );
}

/** Rotulo de numero calculado por nos (nunca alteramos o dado oficial). */
export function Calculado({ formula }: { formula: string }) {
  return <span className="mun-calc mono" title={formula}>calculado por nós · {formula}</span>;
}
