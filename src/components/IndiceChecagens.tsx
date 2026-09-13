import { Rico } from "@/i18n/rich";
import type { Dicionario } from "@/i18n";
import { formatarData } from "@/i18n/numeros";
import { SEGMENTO_CHECAGEM, type Locale } from "@/i18n/config";
import { CHECAGENS, caminhoDaChecagem } from "@/i18n/checagens";
import { textoDaChecagem } from "@/i18n/checagemTexto";

export default function IndiceChecagens({ t, locale }: { t: Dicionario; locale: Locale }) {
  const c = t.checagem;
  const segmento = SEGMENTO_CHECAGEM[locale];

  return (
    <section id="checagens" className="sec sec--deep">
      <div className="wrap">
        <div className="eyebrow">{c.indiceEyebrow}</div>
        <h2 className="sec-title">{c.indiceTitulo}</h2>
        <p className="sec-lead"><Rico t={c.indiceLead} /></p>

        <div className="idx-grade">
          {CHECAGENS.map((ch) => {
            const info = textoDaChecagem(t, ch);
            return (
              // O id repete o da seccao que vivia na home, para que links ja
              // compartilhados (/#desemprego) continuem caindo em algo coerente.
              <a
                key={ch.id}
                id={ch.ancora}
                href={caminhoDaChecagem(locale, ch, segmento)}
                className="idx-card"
              >
                <div className="idx-topo">
                  <span className="idx-selo" style={{ background: info.cor }}>{info.selo}</span>
                  <span className="mono idx-data">
                    {formatarData(ch.verificadoEm, locale)}
                  </span>
                </div>

                <h3 className="idx-claim">{info.ehAfirmacao ? `“${info.titulo}”` : info.titulo}</h3>
                <p className="idx-destaque">{c.destaques[ch.id as keyof typeof c.destaques]}</p>
                <span className="mono idx-link">{c.verDetalhe}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
