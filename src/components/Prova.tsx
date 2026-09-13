import type { Dicionario } from "@/i18n";
import { formatarData } from "@/i18n/numeros";
import type { Locale } from "@/i18n/config";

/** Snapshot publico da peca checada. O sufixo if_ devolve a pagina sem a barra do Archive. */
export const ARQUIVO_URL =
  "https://web.archive.org/web/20260909203458/https://mercadodamentira.com.br/";
const ARQUIVADO_EM = "2026-09-09";

/**
 * Imagem de prova por checagem. Ausencia e intencional: a afirmacao sobre o
 * IBGE circula nas redes, nao esta na peca original — nao ha o que mostrar.
 */
const IMAGENS: Record<string, string> = {
  desemprego: "/prova/comparativo.png",
  alimentos: "/prova/alimentos.png",
  precos: "/prova/precos.png",
  "escala-6x1": "/prova/escala-6x1.png",
  comparativo: "/prova/comparativo.png",
};

export default function Prova({ t, locale, id }: { t: Dicionario; locale: Locale; id: string }) {
  const img = IMAGENS[id];
  const texto = t.prova.textos[id as keyof typeof t.prova.textos];
  if (!img || !texto) return null;

  return (
    <section className="sec sec--tight" style={{ background: "var(--gray)" }}>
      <div className="wrap">
        <div className="eyebrow">{t.prova.titulo}</div>
        <p className="prova-texto">{texto}</p>

        <figure className="prova-fig">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt={texto} width={1180} loading="lazy" decoding="async" />
          <figcaption className="mono prova-legenda">
            {t.prova.legenda.replace("{data}", formatarData(ARQUIVADO_EM, locale))}
            {" "}
            <a href={ARQUIVO_URL} target="_blank" rel="noopener noreferrer nofollow">
              {t.prova.verArquivo}
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
