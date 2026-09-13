import { Rico } from "@/i18n/rich";
import type { Dicionario } from "@/i18n";
import { formatarData, formatarNumero } from "@/i18n/numeros";
import { SEGMENTO_CHECAGEM, type Locale } from "@/i18n/config";
import { CHECAGENS, caminhoDaChecagem, type Checagem } from "@/i18n/checagens";
import { SECAO_DO_ID, textoDaChecagem } from "@/i18n/checagemTexto";
import { nomeProduto } from "@/i18n/produto";
import { PRODUTOS, TOTAL, ACIMA_DE_2019 } from "@/data/produtos";
import { FAO, PNAD, VEREDITOS_COMPARATIVO, ETAPAS_CONCLUIDAS } from "@/data/series";

/*
 * Resumos da home: cada checagem ganha um bloco com um visual proprio, o
 * numero que chama atencao e o convite para a pagina completa. Os numeros vem
 * das mesmas series que alimentam os graficos grandes (src/data/series.ts),
 * entao miniatura e pagina nunca divergem.
 */

type P = { t: Dicionario; locale: Locale };

const porId = (id: string) => CHECAGENS.find((c) => c.id === id) as Checagem;

/* ---------------------------------------------------------------- visuais */

function MiniDesemprego({ t, locale }: P) {
  const W = 420, H = 190, PL = 14, PR = 14, PT = 34, PB = 26;
  const tMax = 29, vMax = 16, vMin = 4;
  const x = (v: number) => PL + (v * (W - PL - PR)) / tMax;
  const y = (v: number) => PT + ((vMax - v) * (H - PT - PB)) / (vMax - vMin);
  const linha = PNAD.map((p, i) => `${i ? "L" : "M"}${x(p.t).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
  const pico = PNAD.find((p) => p.mark === "pico")!;
  const hoje = PNAD.find((p) => p.mark === "hoje")!;
  const troca = PNAD.find((p) => p.mark === "troca")!;

  return (
    <figure className="tz-fig">
      <figcaption className="mono tz-rotulo">{t.teaser.rotuloPnad}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={t.desemprego.figAlt}>
        <rect x={x(4.5)} y={PT - 10} width={x(10) - x(4.5)} height={H - PT - PB + 10} fill="#c0161c" opacity="0.18" />
        <line x1={x(troca.t)} x2={x(troca.t)} y1={PT - 10} y2={H - PB} stroke="rgba(255,255,255,.35)" strokeDasharray="4 4" />
        <path d={linha} fill="none" stroke="var(--accent)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(pico.t)} cy={y(pico.v)} r="8" fill="#ff4b4b" stroke="#fff" strokeWidth="2.5" />
        <text x={x(pico.t)} y={y(pico.v) - 15} textAnchor="middle" className="tz-svg-num" fill="#ff8a8a">
          {formatarNumero(pico.v, locale, 1)}%
        </text>
        <circle cx={x(hoje.t)} cy={y(hoje.v)} r="8" fill="var(--accent)" stroke="#fff" strokeWidth="2.5" />
        <text x={x(hoje.t) - 4} y={y(hoje.v) - 15} textAnchor="end" className="tz-svg-num" fill="var(--accent)">
          {formatarNumero(hoje.v, locale, 1)}%
        </text>
        <text x={(x(4.5) + x(10)) / 2} y={H - 8} textAnchor="middle" className="tz-svg-rot" fill="#ff9a9a">
          {t.desemprego.pandemia}
        </text>
      </svg>
    </figure>
  );
}

function MiniAlimentos({ t, locale }: P) {
  const W = 420, H = 190, PL = 14, PR = 14, PT = 34, PB = 26;
  const max = 160, min = 85;
  const x = (i: number) => PL + (i * (W - PL - PR)) / (FAO.length - 1);
  const y = (v: number) => PT + ((max - v) * (H - PT - PB)) / (max - min);
  const linha = FAO.map(([, v], i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const iPico = FAO.reduce((m, p, i, a) => (p[1] > a[m][1] ? i : m), 0);
  const ult = FAO.length - 1;

  return (
    <figure className="tz-fig">
      <figcaption className="mono tz-rotulo">{t.teaser.rotuloFao}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={t.regua.figAlt}>
        <rect x={x(0)} y={PT - 10} width={x(3.55) - x(0)} height={H - PT - PB + 10} fill="rgba(255,255,255,.07)" />
        <rect x={x(4)} y={PT - 10} width={x(ult) - x(4)} height={H - PT - PB + 10} fill="rgba(255,223,0,.1)" />
        <path d={linha} fill="none" stroke="var(--accent)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(iPico)} cy={y(FAO[iPico][1])} r="8" fill="#ff4b4b" stroke="#fff" strokeWidth="2.5" />
        <text x={x(iPico)} y={y(FAO[iPico][1]) - 15} textAnchor="middle" className="tz-svg-num" fill="#ff8a8a">
          {formatarNumero(FAO[iPico][1], locale, 1)}
        </text>
        <circle cx={x(ult)} cy={y(FAO[ult][1])} r="7" fill="var(--accent)" stroke="#fff" strokeWidth="2.5" />
        <text x={x(0)} y={H - 8} className="tz-svg-rot" fill="rgba(255,255,255,.6)">{FAO[0][0]}</text>
        <text x={x(ult)} y={H - 8} textAnchor="end" className="tz-svg-rot" fill="rgba(255,255,255,.6)">
          {FAO[ult][0].replace("*", "")}
        </text>
      </svg>
    </figure>
  );
}

// Itens do dia a dia, e nao os campeoes de alta: sao mais dificeis de
// desqualificar como recorte ("manga e sazonal").
const PRODUTOS_DESTAQUE = ["Café moído", "Leite longa vida", "Óleo de soja", "Arroz"];

function MiniPrecos({ t, locale }: P) {
  const itens = PRODUTOS_DESTAQUE.map((n) => PRODUTOS.find((p) => p.n === n)!).filter(Boolean);
  return (
    <div className="tz-fig">
      <div className="mono tz-rotulo">{t.teaser.rotuloProdutos}</div>
      <div className="tz-produtos">
        {itens.map((p) => (
          <div key={p.n} className="tz-produto">
            <span className="tz-produto-emoji" aria-hidden="true">{p.e}</span>
            <span className="tz-produto-nome">{nomeProduto(p, locale).replace(/ \(.*\)$/, "")}</span>
            <span className="tz-produto-num">+{formatarNumero(Math.round(p.a), locale, 0)}%</span>
          </div>
        ))}
      </div>
      <div className="tz-big">
        <span className="disp">{ACIMA_DE_2019}<small>/{TOTAL}</small></span>
      </div>
    </div>
  );
}

function MiniEscala({ t }: P) {
  const feitas = ETAPAS_CONCLUIDAS.filter(Boolean).length;
  const total = ETAPAS_CONCLUIDAS.length;
  const proxima = t.escala.etapas[ETAPAS_CONCLUIDAS.indexOf(false)];
  return (
    <div className="tz-fig">
      <div className="tz-etapas-num disp">
        {feitas}<small>/{total}</small>
      </div>
      <div className="mono tz-rotulo" style={{ marginBottom: 14 }}>
        {t.teaser.etapas.replace("{feitas}", String(feitas)).replace("{total}", String(total))}
      </div>
      <div className="tz-trilha" aria-hidden="true">
        {ETAPAS_CONCLUIDAS.map((ok, i) => (
          <span key={i} className={ok ? "tz-passo tz-passo--ok" : i === feitas ? "tz-passo tz-passo--prox" : "tz-passo"} />
        ))}
      </div>
      {proxima && (
        <div className="tz-proxima">
          <span aria-hidden="true">○</span> {proxima.t} · <em>{proxima.d}</em>
        </div>
      )}
    </div>
  );
}

function MiniIbge({ t }: P) {
  return (
    <div className="tz-fig tz-duas">
      <div className="tz-duas-item tz-duas-item--nao">
        <span className="mono tz-duas-tag">✕ {t.ibge.tagNao}</span>
        <span className="tz-duas-txt">{t.ibge.naoTitulo}</span>
      </div>
      <div className="tz-duas-item tz-duas-item--sim">
        <span className="mono tz-duas-tag">! {t.ibge.tagSim}</span>
        <span className="tz-duas-txt">{t.ibge.simTitulo}</span>
      </div>
    </div>
  );
}

const COR_VEREDITO = { correto: "var(--green)", parcial: "#c9942a", enganoso: "#c0161c" } as const;

function MiniComparativo({ t }: P) {
  const ordem = ["correto", "parcial", "enganoso"] as const;
  return (
    <div className="tz-fig">
      <div className="mono tz-rotulo">{t.teaser.placar}</div>
      <div className="tz-placar" aria-hidden="true">
        {VEREDITOS_COMPARATIVO.map((v, i) => (
          <span key={i} className="tz-placar-cel" style={{ background: COR_VEREDITO[v] }} />
        ))}
      </div>
      <ul className="tz-placar-leg">
        {ordem.map((v) => {
          const n = VEREDITOS_COMPARATIVO.filter((x) => x === v).length;
          return (
            <li key={v}>
              <span className="tz-placar-bola" style={{ background: COR_VEREDITO[v] }} />
              <strong>{n}</strong> {t.comparativo.selos[v]}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MiniConfere({ t }: P) {
  return (
    <ul className="tz-fig tz-checks">
      {t.verdade.acertos.slice(0, 3).map((a) => (
        <li key={a.t}>
          <span className="tz-check" aria-hidden="true">✓</span>
          {a.t}
        </li>
      ))}
    </ul>
  );
}

/* ----------------------------------------------------------------- blocos */

function Teaser({
  t, locale, id, visual, reverso, compacto,
}: P & { id: string; visual: React.ReactNode; reverso?: boolean; compacto?: boolean }) {
  const c = porId(id);
  const info = textoDaChecagem(t, c);
  const destaque = t.checagem.destaques[c.id as keyof typeof t.checagem.destaques];
  const classe = ["tz", reverso && "tz--rev", compacto && "tz--compacto"].filter(Boolean).join(" ");

  return (
    // O bloco inteiro e o link; o id repete o da seccao antiga para que
    // links ja compartilhados (/#desemprego) continuem caindo aqui.
    <a id={c.ancora} href={caminhoDaChecagem(locale, c, SEGMENTO_CHECAGEM[locale])} className={classe}>
      <div className="tz-visual">{visual}</div>

      <div className="tz-texto">
        <div className="tz-topo">
          <span className="tz-selo" style={{ background: info.cor }}>{info.selo}</span>
          <span className="mono tz-data">{formatarData(c.verificadoEm, locale)}</span>
        </div>

        <h3 className="tz-titulo">
          {t[SECAO_DO_ID[c.id as keyof typeof SECAO_DO_ID]].titulo}
        </h3>
        <p className="tz-destaque">{destaque}</p>
        {info.ehAfirmacao && <p className="tz-claim">&ldquo;{info.titulo}&rdquo;</p>}

        <span className="mono tz-cta">{t.checagem.verDetalhe}</span>
      </div>
    </a>
  );
}

export default function Teasers({ t, locale }: P) {
  const c = t.checagem;
  return (
    <section id="checagens" className="sec sec--deep tz-sec">
      <div className="wrap">
        <div className="eyebrow">{c.indiceEyebrow}</div>
        <h2 className="sec-title">{c.indiceTitulo}</h2>
        <p className="sec-lead"><Rico t={c.indiceLead} /></p>

        <div className="tz-lista">
          <Teaser t={t} locale={locale} id="precos" visual={<MiniPrecos t={t} locale={locale} />} />
          <Teaser t={t} locale={locale} id="desemprego" visual={<MiniDesemprego t={t} locale={locale} />} reverso />
          <Teaser t={t} locale={locale} id="alimentos" visual={<MiniAlimentos t={t} locale={locale} />} />
          <Teaser t={t} locale={locale} id="escala-6x1" visual={<MiniEscala t={t} locale={locale} />} reverso />
          <Teaser t={t} locale={locale} id="ibge" visual={<MiniIbge t={t} locale={locale} />} />
        </div>

        <div className="tz-dupla">
          <Teaser t={t} locale={locale} id="comparativo" visual={<MiniComparativo t={t} locale={locale} />} compacto />
          <Teaser t={t} locale={locale} id="o-que-confere" visual={<MiniConfere t={t} locale={locale} />} compacto />
        </div>
      </div>
    </section>
  );
}
