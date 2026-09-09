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
import { SITE_URL } from "./layout";

const CHECAGENS: { claim: string; rating: string; valor: number; url: string }[] = [
  {
    claim: "O desemprego caiu de mais de 14% para 5,4% por causa da gestão atual.",
    rating: "Enganoso: compara o pico da pandemia com o dado atual",
    valor: 2,
    url: "#desemprego",
  },
  {
    claim: "A comida subiu 4x mais no governo anterior do que no atual.",
    rating: "Correto no dado, enganoso na causa: omite o ciclo global de alimentos",
    valor: 3,
    url: "#alimentos",
  },
  {
    claim: "Dezenas de produtos ficaram mais baratos no governo atual.",
    rating: "Sem contexto: 109 dos 112 produtos seguem acima do preço de jan/2019",
    valor: 3,
    url: "#auditoria",
  },
  {
    claim: "O fim da escala 6x1 está entre as entregas do governo atual.",
    rating: "Enganoso: a PEC ainda não foi votada no Plenário do Senado",
    valor: 2,
    url: "#seis-por-um",
  },
  {
    claim: "O IBGE estaria fraudando os dados de emprego e inflação.",
    rating: "Falso: não há evidência de manipulação do IPCA ou da PNAD",
    valor: 1,
    url: "#ibge",
  },
];

const VERIFICADO_EM = "2026-09-09";

function jsonLd() {
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
      url: SITE_URL,
      inLanguage: "pt-BR",
      sameAs: ["https://www.linkedin.com/in/jgamin/"],
      publisher: autor,
      dateModified: VERIFICADO_EM,
      description:
        "Checagem estatística da propaganda eleitoral sobre custo de vida no Brasil, com dados do IBGE e da FAO.",
    },
    ...CHECAGENS.map((c) => ({
      "@context": "https://schema.org",
      "@type": "ClaimReview",
      datePublished: VERIFICADO_EM,
      url: `${SITE_URL}/${c.url}`,
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
        ratingValue: c.valor,
        bestRating: 5,
        worstRating: 1,
        alternateName: c.rating,
      },
    })),
  ];
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
      <Header />
      <main>
        <Hero />
        <Regua />
        <Alimentos />
        <Auditoria />
        <Desemprego />
        <Comparativo />
        <Escala />
        <Ibge />
        <Verdade />
        <Metodologia />
        <Compartilhe />
        <Autor />
      </main>
      <Footer />
    </>
  );
}
