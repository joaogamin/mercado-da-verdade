// URL publica do site. Fica fora do layout porque o layout deixou de ser unico:
// existe um root layout por idioma (ver src/app/(br) e src/app/(intl)).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mercadodaverdade.com.br";

// Data da ultima conferencia dos indicadores conjunturais, em ISO.
// Guardada aqui, e nao escrita por extenso nos componentes, para que cada
// idioma a formate com Intl.DateTimeFormat.
export const VERIFICADO_EM = "2026-09-09";
