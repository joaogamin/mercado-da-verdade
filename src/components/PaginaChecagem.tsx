import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Compartilhe from "@/components/Compartilhe";
import Alimentos from "@/components/Alimentos";
import Auditoria from "@/components/Auditoria";
import Desemprego from "@/components/Desemprego";
import Escala from "@/components/Escala";
import Ibge from "@/components/Ibge";
import { Rico } from "@/i18n/rich";
import { getDicionario } from "@/i18n";
import { formatarData } from "@/i18n/numeros";
import { SITE_URL } from "@/lib/site";
import { SEGMENTO_CHECAGEM, urlDoLocale, type Locale } from "@/i18n/config";
import { CHECAGENS, caminhoDaChecagem, type Checagem } from "@/i18n/checagens";

// Cada checagem reaproveita integralmente a seccao que ja existia na home.
const SECOES: Record<string, React.ComponentType<{ t: ReturnType<typeof getDicionario>; locale: Locale }>> = {
  desemprego: Desemprego,
  alimentos: ({ t }) => <Alimentos t={t} />,
  precos: Auditoria,
  "escala-6x1": Escala,
  ibge: ({ t }) => <Ibge t={t} />,
};

const COR_DA_NOTA: Record<number, string> = { 1: "#c0161c", 2: "#c0161c", 3: "#c9942a" };

export default function PaginaChecagem({ locale, checagem }: { locale: Locale; checagem: Checagem }) {
  const t = getDicionario(locale);
  const c = t.checagem;
  const dados = t.schema.checagens[checagem.i];
  const Secao = SECOES[checagem.id];
  const segmento = SEGMENTO_CHECAGEM[locale];
  const inicio = locale === "pt-BR" ? "/" : `/${locale}/`;
  const outras = CHECAGENS.filter((o) => o.id !== checagem.id);
  const selo = c.selos[String(checagem.nota) as "1" | "2" | "3"];

  const jsonLd = {
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
    claimReviewed: dados.claim,
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
      alternateName: dados.rating,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header t={t} locale={locale} base={inicio} />

      <main>
        <section className="sec sec--tight" style={{ background: "var(--brand)", color: "#fff" }}>
          <div className="wrap">
            <a href={`${inicio}#checagens`} className="mono voltar">← {c.voltar}</a>

            <div className="chk-selo-linha">
              <span className="chk-selo" style={{ background: COR_DA_NOTA[checagem.nota] }}>{selo}</span>
              <span className="mono chk-data">
                {c.verificadoEm.replace("{data}", formatarData(checagem.verificadoEm, locale))}
              </span>
            </div>

            <div className="mono chk-rotulo">{c.afirmacao}</div>
            <h1 className="chk-titulo">&ldquo;{dados.claim}&rdquo;</h1>
            <p className="chk-rating">{dados.rating}</p>
          </div>
        </section>

        <Secao t={t} locale={locale} />

        <section className="sec sec--tight sec--white">
          <div className="wrap">
            <h2 className="chk-outras-titulo">{c.outras}</h2>
            <div className="chk-outras">
              {outras.map((o) => (
                <a key={o.id} href={caminhoDaChecagem(locale, o, segmento)} className="chk-outra">
                  <span className="chk-selo chk-selo--mini" style={{ background: COR_DA_NOTA[o.nota] }}>
                    {c.selos[String(o.nota) as "1" | "2" | "3"]}
                  </span>
                  <span className="chk-outra-txt">{t.schema.checagens[o.i].claim}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <Compartilhe t={t} locale={locale} />
      </main>

      <Footer t={t} locale={locale} />
    </>
  );
}

/**
 * Titulo e resumo da secao ja existem no dicionario — reaproveitados aqui em
 * vez de duplicar conteudo. A afirmacao inteira daria um <title> de ~100
 * caracteres, e o Google corta em torno de 60.
 */
const SECAO_DO_ID: Record<string, "desemprego" | "alimentos" | "auditoria" | "escala" | "ibge"> = {
  desemprego: "desemprego",
  alimentos: "alimentos",
  precos: "auditoria",
  "escala-6x1": "escala",
  ibge: "ibge",
};

/** Remove a marcacao do dicionario e corta em limite de palavra. */
function resumir(texto: string, max: number): string {
  const limpo = texto.replace(/\*\*/g, "").replace(/\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  if (limpo.length <= max) return limpo;
  return limpo.slice(0, limpo.lastIndexOf(" ", max)) + "…";
}

/** Usado pelo metadata das rotas de checagem. */
export function metaDaChecagem(locale: Locale, checagem: Checagem) {
  const t = getDicionario(locale);
  const d = t.schema.checagens[checagem.i];
  const secao = t[SECAO_DO_ID[checagem.id]];
  return {
    title: secao.titulo,
    desc: resumir(`${d.rating}. ${secao.lead}`, 158),
    caminho: caminhoDaChecagem(locale, checagem, SEGMENTO_CHECAGEM[locale]),
    home: urlDoLocale(SITE_URL, locale),
  };
}
