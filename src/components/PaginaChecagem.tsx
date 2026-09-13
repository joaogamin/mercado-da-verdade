import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Compartilhe from "@/components/Compartilhe";
import Alimentos from "@/components/Alimentos";
import Auditoria from "@/components/Auditoria";
import Desemprego from "@/components/Desemprego";
import Escala from "@/components/Escala";
import Ibge from "@/components/Ibge";
import Comparativo from "@/components/Comparativo";
import Verdade from "@/components/Verdade";
import { getDicionario } from "@/i18n";
import { formatarData } from "@/i18n/numeros";
import { SITE_URL } from "@/lib/site";
import { SEGMENTO_CHECAGEM, urlDoLocale, type Locale } from "@/i18n/config";
import { CHECAGENS, caminhoDaChecagem, type Checagem } from "@/i18n/checagens";
import { textoDaChecagem } from "@/i18n/checagemTexto";

type Props = { t: ReturnType<typeof getDicionario>; locale: Locale };

// Cada pagina reaproveita integralmente a seccao que ja existia na home.
const SECOES: Record<string, React.ComponentType<Props>> = {
  desemprego: Desemprego,
  alimentos: ({ t }) => <Alimentos t={t} />,
  precos: Auditoria,
  "escala-6x1": Escala,
  ibge: ({ t }) => <Ibge t={t} />,
  comparativo: ({ t }) => <Comparativo t={t} />,
  "o-que-confere": ({ t }) => <Verdade t={t} />,
};

export default function PaginaChecagem({ locale, checagem }: { locale: Locale; checagem: Checagem }) {
  const t = getDicionario(locale);
  const c = t.checagem;
  const info = textoDaChecagem(t, checagem);
  const Secao = SECOES[checagem.id];
  const segmento = SEGMENTO_CHECAGEM[locale];
  const inicio = locale === "pt-BR" ? "/" : `/${locale}/`;
  const outras = CHECAGENS.filter((o) => o.id !== checagem.id);

  // So as checagens de uma afirmacao especifica geram ClaimReview.
  const jsonLd =
    checagem.i === undefined
      ? null
      : {
          "@context": "https://schema.org",
          "@type": "ClaimReview",
          datePublished: checagem.verificadoEm,
          inLanguage: locale,
          url: SITE_URL + caminhoDaChecagem(locale, checagem, segmento),
          author: {
            "@type": "Organization",
            name: "Mercado da Verdade",
            url: SITE_URL,
            sameAs: ["https://www.linkedin.com/in/jgamin/"],
          },
          claimReviewed: info.titulo,
          itemReviewed: {
            "@type": "Claim",
            author: {
              "@type": "Organization",
              name: "mercadodamentira.com.br",
              url: "https://mercadodamentira.com.br/",
            },
            datePublished: "2026-09-01",
            appearance: { "@type": "CreativeWork", url: "https://mercadodamentira.com.br/" },
          },
          reviewRating: {
            "@type": "Rating",
            ratingValue: checagem.nota,
            bestRating: 5,
            worstRating: 1,
            alternateName: info.resumo,
          },
        };

  return (
    <>
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <Header t={t} locale={locale} base={inicio} />

      <main>
        <section className="sec sec--tight" style={{ background: "var(--brand)", color: "#fff" }}>
          <div className="wrap">
            <a href={`${inicio}#checagens`} className="mono voltar">← {c.voltar}</a>

            <div className="chk-selo-linha">
              <span className="chk-selo" style={{ background: info.cor }}>{info.selo}</span>
              <span className="mono chk-data">
                {c.verificadoEm.replace("{data}", formatarData(checagem.verificadoEm, locale))}
              </span>
            </div>

            {info.ehAfirmacao && <div className="mono chk-rotulo">{c.afirmacao}</div>}
            <h1 className="chk-titulo">
              {info.ehAfirmacao ? `\u201C${info.titulo}\u201D` : info.titulo}
            </h1>
            {info.ehAfirmacao && <p className="chk-rating">{info.resumo}</p>}
          </div>
        </section>

        <Secao t={t} locale={locale} />

        <section className="sec sec--tight sec--white">
          <div className="wrap">
            <h2 className="chk-outras-titulo">{c.outras}</h2>
            <div className="chk-outras">
              {outras.map((o) => {
                const oi = textoDaChecagem(t, o);
                return (
                  <a key={o.id} href={caminhoDaChecagem(locale, o, segmento)} className="chk-outra">
                    <span className="chk-selo chk-selo--mini" style={{ background: oi.cor }}>{oi.selo}</span>
                    <span className="chk-outra-txt">{oi.titulo}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <Compartilhe t={t} locale={locale} />
      </main>

      <Footer t={t} locale={locale} />
    </>
  );
}

/** Remove a marcacao do dicionario e corta em limite de palavra. */
function resumir(texto: string, max: number): string {
  const limpo = texto.replace(/\*\*/g, "").replace(/\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  if (limpo.length <= max) return limpo;
  return limpo.slice(0, limpo.lastIndexOf(" ", max)) + "\u2026";
}

/**
 * Titulo e resumo do metadata. A afirmacao inteira daria um <title> de ~100
 * caracteres, e o Google corta em torno de 60 — por isso usa o titulo da
 * seccao, que ja e curto e direto.
 */
export function metaDaChecagem(locale: Locale, checagem: Checagem) {
  const t = getDicionario(locale);
  const info = textoDaChecagem(t, checagem);
  const secaoTitulo = info.ehAfirmacao
    ? t[
        ({
          desemprego: "desemprego", alimentos: "alimentos", precos: "auditoria",
          "escala-6x1": "escala", ibge: "ibge",
        } as const)[checagem.id as "desemprego" | "alimentos" | "precos" | "escala-6x1" | "ibge"]
      ].titulo
    : info.titulo;

  return {
    title: secaoTitulo,
    desc: resumir(info.ehAfirmacao ? `${info.resumo}. ${info.lead}` : info.lead, 158),
    caminho: caminhoDaChecagem(locale, checagem, SEGMENTO_CHECAGEM[locale]),
    home: urlDoLocale(SITE_URL, locale),
  };
}
