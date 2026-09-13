import Bandeira from "@/components/Bandeira";
import Selo from "@/components/Selo";
import {
  LOCALES, SIGLA_DO_LOCALE, NOME_DO_LOCALE, SEGMENTO_CHECAGEM, caminhoDoLocale, type Locale,
} from "@/i18n/config";
import { CHECAGENS, caminhoDaChecagem, type Checagem } from "@/i18n/checagens";
import type { Dicionario } from "@/i18n";

// Server component: menu e seletor de idioma usam <details>, que e nativo do
// HTML. Isso evita marcar o header como client component so para abrir menus.

/**
 * Para onde cada item do menu leva agora que o site tem paginas proprias.
 * As chaves sao os hrefs antigos do dicionario — os rotulos continuam os
 * mesmos, so o destino mudou. "A regua" e a unica que segue sendo seccao da
 * home; as demais abrem a pagina da checagem.
 */
const DESTINO: Record<string, { tipo: "ancora"; id: string } | { tipo: "checagem"; id: string }> = {
  "#regua": { tipo: "ancora", id: "regua" },
  "#alimentos": { tipo: "checagem", id: "alimentos" },
  "#auditoria": { tipo: "checagem", id: "precos" },
  "#desemprego": { tipo: "checagem", id: "desemprego" },
  "#comparativo": { tipo: "checagem", id: "comparativo" },
  "#seis-por-um": { tipo: "checagem", id: "escala-6x1" },
  "#ibge": { tipo: "checagem", id: "ibge" },
  "#verdade": { tipo: "checagem", id: "o-que-confere" },
};

type Item = { chave: string; rotulo: string; href: string; atual: boolean };

function montarItens(t: Dicionario, locale: Locale, atual?: Checagem): Item[] {
  const home = caminhoDoLocale(locale);
  const itens: Item[] = [{ chave: "inicio", rotulo: t.nav.inicio, href: home, atual: !atual }];

  for (const l of t.nav.links) {
    const d = DESTINO[l.href];
    if (!d) continue;
    if (d.tipo === "ancora") {
      itens.push({ chave: d.id, rotulo: l.rotulo, href: atual ? `${home}#${d.id}` : `#${d.id}`, atual: false });
      continue;
    }
    const c = CHECAGENS.find((x) => x.id === d.id);
    if (!c) continue;
    itens.push({
      chave: c.id,
      rotulo: l.rotulo,
      href: caminhoDaChecagem(locale, c, SEGMENTO_CHECAGEM[locale]),
      atual: atual?.id === c.id,
    });
  }
  return itens;
}

/** Mesma pagina em outro idioma: a checagem equivalente, ou a home. */
function mesmaPaginaEm(l: Locale, atual?: Checagem): string {
  return atual ? caminhoDaChecagem(l, atual, SEGMENTO_CHECAGEM[l]) : caminhoDoLocale(l);
}

/**
 * Dropdown do idioma. Mostra sempre o idioma atual no gatilho e, ao trocar,
 * leva para a mesma pagina no outro idioma — antes levava sempre para a home,
 * e quem lia uma checagem perdia o lugar.
 */
function DropdownIdioma({ locale, rotulo, atual }: { locale: Locale; rotulo: string; atual?: Checagem }) {
  return (
    <details className="idioma-drop">
      <summary aria-label={`${rotulo}: ${NOME_DO_LOCALE[locale]}`}>
        <Bandeira locale={locale} />
        <span>{SIGLA_DO_LOCALE[locale]}</span>
        <span className="idioma-chev" aria-hidden="true">▾</span>
      </summary>
      <div>
        {LOCALES.map((l) => (
          <a
            key={l}
            href={mesmaPaginaEm(l, atual)}
            hrefLang={l}
            lang={l}
            aria-current={l === locale ? "true" : undefined}
            className={l === locale ? "idioma-item idioma-item--atual" : "idioma-item"}
          >
            <Bandeira locale={l} />
            <span>{NOME_DO_LOCALE[l]}</span>
          </a>
        ))}
      </div>
    </details>
  );
}

export default function Header({
  t,
  locale,
  atual,
}: {
  t: Dicionario;
  locale: Locale;
  /** Checagem aberta no momento. Ausente = home. */
  atual?: Checagem;
}) {
  const n = t.nav;
  const itens = montarItens(t, locale, atual);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50, background: "var(--deep)",
      color: "#fff", borderBottom: "3px solid var(--brand)",
    }}>
      <div className="wrap header-barra">
        <a href={caminhoDoLocale(locale)} className="marca-header" aria-label={`${n.marca} ${n.marcaDestaque} — ${n.inicio}`}>
          <Selo />
          <span className="marca-txt">
            <span className="mono marca-tag">{n.tagline}</span>
            <span className="disp marca-nome">
              {n.marca} <span style={{ color: "var(--accent)" }}>{n.marcaDestaque}</span>
            </span>
          </span>
        </a>

        <nav className="nav-desk" aria-label="Menu">
          {itens.map((i) => (
            <a
              key={i.chave}
              href={i.href}
              aria-current={i.atual ? "page" : undefined}
              className={i.atual ? "mono nav-item nav-item--atual" : "mono nav-item"}
            >
              {i.rotulo}
            </a>
          ))}
        </nav>

        <div className="header-acoes">
          <DropdownIdioma locale={locale} rotulo={n.idioma} atual={atual} />

          <details className="nav-mob">
            <summary aria-label={n.abrirMenu} className="mono">☰</summary>
            <div>
              {itens.map((i) => (
                <a
                  key={i.chave}
                  href={i.href}
                  aria-current={i.atual ? "page" : undefined}
                  className={i.atual ? "mono nav-mob-item nav-mob-item--atual" : "mono nav-mob-item"}
                >
                  {i.rotulo}
                </a>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
