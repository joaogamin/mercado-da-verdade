import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Regua from "@/components/Regua";
import Alimentos from "@/components/Alimentos";
import Auditoria from "@/components/Auditoria";
import Desemprego from "@/components/Desemprego";
import Comparativo from "@/components/Comparativo";
import Escala from "@/components/Escala";
import Ibge from "@/components/Ibge";
import Verdade from "@/components/Verdade";
import Metodologia from "@/components/Metodologia";
import Compartilhe from "@/components/Compartilhe";
import Autor from "@/components/Autor";
import Footer from "@/components/Footer";
import { SITE_URL, VERIFICADO_EM } from "@/lib/site";
import { urlDoLocale, type Locale } from "@/i18n/config";
import { getDicionario, type Dicionario } from "@/i18n";

// Nota e ancora de cada checagem nao dependem do idioma: so o texto depende.
const AVALIACOES: { valor: number; ancora: string }[] = [
  { valor: 2, ancora: "#desemprego" },
  { valor: 3, ancora: "#alimentos" },
  { valor: 3, ancora: "#auditoria" },
  { valor: 2, ancora: "#seis-por-um" },
  { valor: 1, ancora: "#ibge" },
];

function jsonLd(t: Dicionario, locale: Locale) {
  const url = urlDoLocale(SITE_URL, locale);
  const autor = {
    "@type": "Organization",
    name: "Mercado da Verdade",
    url: SITE_URL,
    sameAs: ["https://www.linkedin.com/in/jgamin/"],
  };

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Mercado da Verdade",
      url,
      inLanguage: locale,
      sameAs: ["https://www.linkedin.com/in/jgamin/"],
      publisher: autor,
      dateModified: VERIFICADO_EM,
      description: t.schema.descricao,
    },
    ...t.schema.checagens.map((c, i) => ({
      "@context": "https://schema.org",
      "@type": "ClaimReview",
      datePublished: VERIFICADO_EM,
      inLanguage: locale,
      url: `${url}${AVALIACOES[i].ancora}`,
      author: autor,
      claimReviewed: c.claim,
      itemReviewed: {
        "@type": "Claim",
        // author = quem fez a afirmacao (a peca original), exigido pelo Google
        // para o ClaimReview ser elegivel; nao confundir com o autor da checagem.
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
        ratingValue: AVALIACOES[i].valor,
        bestRating: 5,
        worstRating: 1,
        alternateName: c.rating,
      },
    })),
  ];
}

export default function Pagina({ locale }: { locale: Locale }) {
  const t = getDicionario(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(t, locale)) }}
      />
      <Header t={t} locale={locale} />
      <main>
        <Hero t={t} />
        <Regua t={t} locale={locale} />
        <Alimentos t={t} />
        <Auditoria t={t} locale={locale} />
        <Desemprego t={t} locale={locale} />
        <Comparativo t={t} />
        <Escala t={t} locale={locale} />
        <Ibge t={t} />
        <Verdade t={t} />
        <Metodologia t={t} />
        <Compartilhe t={t} locale={locale} />
        <Autor t={t} />
      </main>
      <Footer t={t} locale={locale} />
    </>
  );
}
