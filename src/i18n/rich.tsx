import { Fragment, type ReactNode } from "react";

// Os textos ficam nos dicionarios como string pura, para que a traducao seja
// legivel e revisavel. A enfase e os links inline usam uma convencao minima:
//
//   **negrito**            -> <strong>
//   *italico*              -> <em>
//   [rotulo](https://...)  -> <a> externo
//
// Sem dependencia e sem dangerouslySetInnerHTML: o texto do dicionario nunca
// e interpretado como HTML, so estes tres padroes sao reconhecidos.

const PADRAO = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)]+\))/g;
const LINK = /^\[([^\]]+)\]\(([^)]+)\)$/;

export function rico(texto: string): ReactNode {
  const partes = texto.split(PADRAO).filter((p) => p !== "");

  return partes.map((parte, i) => {
    const link = parte.match(LINK);
    if (link) {
      const [, rotulo, href] = link;
      return (
        <a
          key={i}
          href={href}
          className="rico-link"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          {rotulo}
        </a>
      );
    }
    if (parte.startsWith("**") && parte.endsWith("**")) {
      return <strong key={i}>{parte.slice(2, -2)}</strong>;
    }
    if (parte.startsWith("*") && parte.endsWith("*")) {
      return <em key={i}>{parte.slice(1, -1)}</em>;
    }
    return <Fragment key={i}>{parte}</Fragment>;
  });
}

/** Versao componente, para uso direto em JSX: <Rico t={t.hero.lead} /> */
export function Rico({ t }: { t: string }) {
  return <>{rico(t)}</>;
}
