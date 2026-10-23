import type { Metadata } from "next";
import { anos, cidadesComDados, exercicio } from "@/municipios/dados";
import { metadados } from "@/municipios/metadados";
import Texto from "@/municipios/paginas/Texto";
import { SINAIS_INTRO } from "@/municipios/textos";

export const metadata: Metadata = metadados(`${SINAIS_INTRO.titulo} · Municípios`, SINAIS_INTRO.lead, "/municipios/sinais/");

// Montada a partir dos sinais calculados: a explicacao nunca diverge do codigo.
export default function PaginaSinais() {
  const c = cidadesComDados()[0];
  const ex = c ? exercicio(c.slug, anos(c.slug)[0]) : null;
  return (
    <Texto pagina={SINAIS_INTRO} atual="sinais">
      {(ex?.sinais ?? []).map((s) => (
        <div key={s.id} id={s.id}>
          <h2>{s.titulo}</h2>
          <p>{s.resumo}</p>
          <p><strong>Base:</strong> {s.base}</p>
          <p><strong>O que não prova:</strong> {s.limites}</p>
        </div>
      ))}
      <h2 id="em-ordem">O que está em ordem</h2>
      <p>Ao lado dos sinais, sempre no mesmo nível, mostramos o que confere. Cada item tem três estados, sempre com ícone e rótulo: ✓ em ordem, ! atenção e ? ainda não verificado.</p>
      <ul>
        {(ex?.emOrdem ?? []).map((o) => <li key={o.id}><strong>{o.titulo}.</strong> {o.detalhe}</li>)}
      </ul>
    </Texto>
  );
}
