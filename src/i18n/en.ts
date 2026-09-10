import type { Dicionario } from "./pt-BR";

export const en: Dicionario = {
  nav: {
    tagline: "Statistical fact-check",
    marca: "Mercado da",
    marcaDestaque: "Verdade",
    abrirMenu: "Open menu",
    idioma: "Language",
    links: [
      { href: "#regua", rotulo: "The yardstick" },
      { href: "#alimentos", rotulo: "Food prices" },
      { href: "#auditoria", rotulo: "Item by item" },
      { href: "#desemprego", rotulo: "Unemployment" },
      { href: "#comparativo", rotulo: "The comparison" },
      { href: "#seis-por-um", rotulo: "6x1 shift" },
      { href: "#ibge", rotulo: "The statistics office" },
      { href: "#verdade", rotulo: "What checks out" },
    ],
  },
  hero: {
    selo: "✓ Checking the method, not the party",
    titulo1: "The data is real.",
    titulo2: "The context was cut out.",
    lead1:
      "This site checks, number by number, the campaign material on cost of living published at [mercadodamentira.com.br ↗](https://mercadodamentira.com.br/).",
    lead2:
      "The conclusion, after auditing every section: **they did not invent any data**. They did something harder to spot — they picked a yardstick that starts and ends at exactly the right points to produce the desired conclusion. Here we put back what was cut, **using the same official sources**.",
    boxTitulo: "No half-truths here.",
    boxP1:
      "Of the six comparisons in their table, **three hold up without reservation** — and they are marked as correct on this site, each with its statute and source. Unemployment at 5.4% is real and is the lowest on record. Informal work is falling.",
    boxP2:
      "A fact-checking site that only ever finds fault on one side is propaganda by another name. Every figure here has a primary source, and the code and dataset are open.",
    stats: [
      { n: "109", k: "of the 112 items on their own site are still pricier than in Jan 2019" },
      { n: "14.9%", k: "unemployment peaked in Q1 2021, at the height of the pandemic" },
      { n: "159.7", k: "the FAO global food price index hit its all-time record in Mar 2022" },
      { n: "3 of 6", k: "comparisons in their table hold up — and we confirm them" },
    ],
  },
  comum: {
    narrativa: "The claim",
    contextoExato: "The missing context",
    veredito: "Verdict",
    oPonto: "The point",
  },
  regua: {
    eyebrow: "Catching the yardstick",
    titulo: "The two periods are not comparable.",
    lead:
      "The original site compares **Jan 2019–Jul 2022** against **Jan 2023–Jul 2026**. It looks symmetrical: three and a half years on each side. But look at what falls inside each window — using a **global** index that no Brazilian president controls.",
    figCaption: "FAO/UN FOOD PRICE INDEX · annual average · 2014-2016 = 100",
    figAlt:
      "FAO global food price index: rises from 95 in 2019 to its 2022 record, falls in 2023-2024 and climbs again to 133 in 2026.",
    janelaA: 'THE SITE\u0027S "BOLSONARO" WINDOW',
    janelaB: 'THE SITE\u0027S "LULA" WINDOW',
    covid: "COVID-19",
    guerra1: "WAR IN",
    guerra2: "UKRAINE",
    nota:
      "* 2026: August value (133.3), the highest since late 2022. All-time monthly peak of the series: 159.7 points in March 2022.",
    narrativaTitulo: '"Three and a half years of each government, side by side."',
    narrativaP:
      "Calendar symmetry is presented as if it were symmetry of conditions. Same number of months, same source, same index — so whatever is left over must be the merit or the fault of the government.",
    contextoTitulo: "One window captures the entire global climb. The other captures the descent.",
    contextoP1:
      'The "Bolsonaro" window starts at 95 points and **ends exactly at the all-time peak** of the global food index: the pandemic, the logistics collapse and the war in Ukraine are all inside it.',
    contextoP2:
      'The "Lula" window starts **right after that peak** and rides the normalisation of global supply chains. Much of the difference was already settled before any decision taken in Brasília.',
    veredito:
      "The numbers are correct. What does not hold is the attribution of cause: the same rise-and-fall pattern shows up worldwide, including in countries whose governments never changed.",
    fontes:
      "Sources: FAO — Food Price Index (monthly and annual series, 2014-2016=100); FAO release of March 2022 on the 159.7-point record; FAO release of September 2026.",
  },
  alimentos: {
    eyebrow: "Block 1 · Food inflation",
    titulo: "Food got more expensive worldwide — and then eased worldwide.",
    lead:
      'The site opens with its strongest number: **13.2% annual food inflation** in the earlier window against **3.0% a year** in the current one. "Four times more expensive." The IPCA figure is correct. The question it does not answer is: *four times more expensive because of whom?*',
    narrativaTitulo: '"Food rose 4x more under Bolsonaro."',
    narrativaP:
      "Food consumed at home, IPCA/IBGE Table 7060, three and a half years of each government. 54.24% against 13.66% cumulative.",
    contextoTitulo: "Three external shocks fit entirely inside the first window.",
    contextoP1:
      "**1. Pandemic and logistics collapse (2020-2021).** Shipping costs multiplied, supply chains broke and pent-up demand pushed food prices up worldwide.",
    contextoP2:
      "**2. War in Ukraine (Feb 2022).** Russia and Ukraine accounted for about 27% of world wheat exports and more than half of sunflower oil. The FAO global index hit its all-time record in March 2022.",
    contextoP3:
      "**3. Fertilisers.** Brazil imports most of what it uses, and Russia and Belarus are central suppliers. Sanctions made the input more expensive — and the input feeds into the price of the following harvest.",
    stats: [
      { n: "+51%", k: "the FAO global food index rose from 95.1 (2019) to 143.7 (2022) — with no Brazilian government at the helm" },
      { n: "−15%", k: "and fell back from 143.7 (2022) to 122.0 (2024), the tide the second window rode" },
      { n: "133.3", k: "and climbed again: August 2026, the highest level since late 2022" },
    ],
    veredito:
      "Misleading by omission of cause. The gap between the two windows is largely the gap between standing on the climb and standing on the descent of a global commodity cycle. And since the FAO index started rising again in 2026, the very metric used today as proof of competence could become proof of incompetence within months — with nothing having changed in Brasília.",
    fontes:
      "Sources: IBGE/IPCA (Table 7060, food consumed at home); FAO — Food Price Index; FAO/UN releases of March 2022 and September 2026.",
  },
  desemprego: {
    eyebrow: "Block 2 · The unemployment metric",
    titulo: "The 14.9% peak is nobody's starting point.",
    lead:
      'The site\u0027s comparison table puts **"14%+"** in the previous government\u0027s column and **5.4%** in the current one. But 14.9% is neither how the previous government started nor how it ended: it was the height of the pandemic, in Q1 2021.',
    figCaption: "UNEMPLOYMENT RATE · PNAD CONTÍNUA QUARTERLY / IBGE · % of the labour force",
    figAlt:
      "Unemployment: 12.7% in early 2019, a 14.9% peak in the first quarter of 2021 during the pandemic, 7.9% at the end of 2022 and 5.4% in June 2026.",
    trocaGoverno: "CHANGE OF GOVERNMENT",
    pandemia: "PANDEMIC / LOCKDOWNS",
    pico: "SERIES PEAK",
    rotulos: ["Q1/19", "Q4/19", "Q1/21", "Q4/22", "Q4/23", "Q4/24", "Jun/26"],
    narrativaTitulo: '"Record unemployment of 14%+ against 5.4%, the lowest in history."',
    narrativaP:
      "The site\u0027s table puts the worst figure ever recorded on one side and the best on the other, as if they were each government\u0027s bottom line.",
    contextoTitulo: "Compare start with start, and end with end.",
    contextoP1:
      "The previous government **inherited 12.7%** (Q1 2019) and **handed over 7.9%** (Q4 2022): a 4.8-point fall, with the pandemic in the middle.",
    contextoP2:
      "The current government **inherited 7.9%** and reached **5.4%** (Jun 2026): a 2.5-point fall — a real result and the best on record, but achieved from an inheritance already falling.",
    contextoP3:
      "The 14.9% belongs to Q1 2021 — a lockdown quarter, not a government\u0027s balance sheet.",
    veredito:
      'The 5.4% is true and is the lowest in the series. What is false is the contrast: using the pandemic peak as "the opponent\u0027s number" charges a global health shock to a government\u0027s account.',
    fontes:
      "Sources: IBGE/PNAD Contínua quarterly — Q1 2019 (12.7%), Q4 2019 (11.0%), Q1 2021 (14.9%, the maximum of the series begun in 2012), Q4 2022 (7.9%), Q4 2023 (7.4%), Q4 2024 (6.2%) and the quarter ending June 2026 (5.4%).",
  },
  // <<SECOES>>
};
