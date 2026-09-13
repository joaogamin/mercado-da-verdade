import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Regua from "@/components/Regua";
import IndiceChecagens from "@/components/IndiceChecagens";
import Metodologia from "@/components/Metodologia";
import Entrada from "@/components/Entrada";
import Compartilhe from "@/components/Compartilhe";
import Autor from "@/components/Autor";
import Footer from "@/components/Footer";
import { SITE_URL, VERIFICADO_EM } from "@/lib/site";
import { SEGMENTO_CHECAGEM, urlDoLocale, type Locale } from "@/i18n/config";
import { CHECAGENS, caminhoDaChecagem } from "@/i18n/checagens";
import { getDicionario, type Dicionario } from "@/i18n";
import { textoDaChecagem } from "@/i18n/checagemTexto";

/**
 * A home e o indice: cada checagem tem pagina propria e leva consigo o seu
 * ClaimReview. Aqui ficam WebSite e um ItemList apontando para elas — o
 * Google espera um ClaimReview por pagina, nao cinco empilhados.
 */
function jsonLd(t: Dicionario, locale: Locale) {
  const url = urlDoLocale(SITE_URL, locale);
  const segmento = SEGMENTO_CHECAGEM[locale];
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
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: t.checagem.indiceTitulo,
      itemListElement: CHECAGENS.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: textoDaChecagem(t, c).titulo,
        url: SITE_URL + caminhoDaChecagem(locale, c, segmento),
      })),
    },
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
        <IndiceChecagens t={t} locale={locale} />
        <Metodologia t={t} />
        <Entrada t={t} />
        <Compartilhe t={t} locale={locale} />
        <Autor t={t} />
      </main>
      <Footer t={t} locale={locale} />
    </>
  );
}
