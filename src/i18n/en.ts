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
      { href: "#alimentos", rotulo: "Food" },
      { href: "#auditoria", rotulo: "Item by item" },
      { href: "#desemprego", rotulo: "Unemployment" },
      { href: "#comparativo", rotulo: "Comparison" },
      { href: "#seis-por-um", rotulo: "6x1 shift" },
      { href: "#ibge", rotulo: "IBGE" },
      { href: "#verdade", rotulo: "What holds up" },
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
  comparativo: {
    eyebrow: "Line by line",
    titulo: "Their comparison table, audited.",
    lead:
      'We took the table they call "the comparison that says it all" and checked every row. Three of the six hold up without reservation — and we say so plainly. The other three depend on context that was left out.',
    colunaA: '"Bolsonaro" column:',
    colunaB: '"Lula" column:',
    selos: { enganoso: "Misleading", parcial: "Correct, no context", correto: "Correct" },
    linhas: [
      {
        ind: "Food at the supermarket", a: "+54.24%", b: "+13.66%",
        txt: "Both figures match the IPCA. What the table does not say is that the first window contains the pandemic, the logistics collapse and the war in Ukraine, and ends at the all-time record of the global food index. Beyond that, today's price is the result of both windows combined: food rose in each of them.",
      },
      {
        ind: "Unemployment", a: "14%+", b: "5.4%",
        txt: "It compares the series peak (14.9% in Q1 2021, the height of lockdowns) with the current value. The previous government inherited 12.7% and handed over 7.9%; the current one inherited 7.9% and reached 5.4%. The 5.4% is real and is the lowest on record — it is the 14.9% peak that is nobody's bottom line.",
      },
      {
        ind: "Average income", a: "−R$ 33", b: "+R$ 476",
        txt: "Real income did fall until 2021 and recovered afterwards — it is now at its highest on record (R$ 3,652 in the quarter to Jan 2026). But the fall coincides with the destruction of jobs during the pandemic, and the rise starts from a depressed base. Part of the recovery is ground regained, not new ground.",
      },
      {
        ind: "Income tax", a: "4 years of frozen brackets", b: "Exemption up to R$ 5,000",
        txt: "This checks out. The income tax brackets were not adjusted between 2019 and 2022, and Law 15,270/2025 raised the exemption to those earning up to R$ 5,000, in force since January 2026, benefiting roughly 15 million people. An honest caveat: the bracket freeze began in 2015, before the previous government.",
      },
      {
        ind: "Minimum wage", a: "R$ 1,212 (2022)", b: "R$ 1,621 (2026)",
        txt: "The figures are correct. The comparison is nominal, but in this case the real gain exists too: Law 14,663/2023 restored the valorisation policy (inflation plus GDP growth from two years earlier), and the 2026 adjustment delivered a gain above inflation.",
      },
      {
        ind: "Minimum wage purchasing power", a: "+R$ 214", b: "+R$ 409",
        txt: "This is the same valorisation policy measured as cumulative real gain. A difference of method, not of external context: here the comparison measures a policy choice, which is exactly what a comparison between governments ought to measure.",
      },
    ],
    veredito:
      "The campaign material does not fabricate numbers — it selects the yardstick. Where the comparison measures a policy choice (income tax, minimum wage), it is legitimate and we confirm it. Where it measures a global cycle (food, unemployment, income), attributing the result to the government is the error.",
    fontes:
      "Sources: IBGE (IPCA Table 7060, PNAD Contínua); Law 15,270/2025 (income tax exemption up to R$ 5,000, in force Jan 2026); Law 14,663/2023 (minimum wage valorisation policy); Federal Senate and Ministry of Finance.",
  },
  escala: {
    eyebrow: "Block 3 · The 6x1 shift",
    titulo: "A bill still being voted on is not a delivered policy.",
    lead:
      'Fairness first: the card on the original site says, in plain words, "proposal under debate in Congress". The problem is not the card\u0027s text — it is **where it was placed**: inside a section titled *"What Lula has done"*, next to measures that really are already in force.',
    narrativaTitulo: '"End of the 6x1 shift" listed among things already done.',
    narrativaP:
      "The card sits between the income tax exemption (law in force), the debt renegotiation programme and the fall in poverty. A quick read — which is how almost everyone reads a website — registers all of it as delivered.",
    contextoTitulo: "The hardest stage is still ahead: two rounds on the Senate floor.",
    contextoP1:
      "Constitutional amendment 221/2019 (with 8/2025 attached) genuinely advanced in 2026 and is closer than ever. But it needs **49 votes in two rounds in the Senate**, and the floor vote **still has no date**, with the opposition filibustering.",
    contextoP2:
      "Until that happens, the 6x1 shift remains legal and in force for everyone working under it today.",
    etapas: [
      { t: "Admissibility in the Chamber's constitutional committee", d: "22 April 2026" },
      { t: "Approved by the Chamber in two rounds", d: "27 May 2026" },
      { t: "Arrives at the Senate", d: "28 May 2026" },
      { t: "Approved by the Senate's constitutional committee", d: "2 September 2026" },
      { t: "Senate floor — first round (49 votes)", d: "no date set" },
      { t: "Senate floor — second round (49 votes)", d: "has not happened" },
      { t: "Promulgation — becomes constitutional law", d: "has not happened" },
    ],
    veredito:
      "A promise in progress presented in place of a delivery. The advance is real and recent — and selling the future as the present is exactly what erodes trust when the vote stalls.",
    fontes:
      "Sources: Federal Senate — amendment 221/2019 (committee approval on 2 Sep 2026 and referral to the floor); Chamber of Deputies — approval in two rounds on 27 May 2026; Agência Brasil, September 2026. Status verified on {data}.",
  },
  ibge: {
    eyebrow: "Block 4 · The credibility of the statistics office",
    titulo: "The error is not in the spreadsheet. And the IBGE's problem is real too.",
    lead:
      "One story circulating online says IBGE — Brazil's national statistics office — is falsifying the numbers. Another, from the campaign, says questioning IBGE is an attack on democracy. Both are simplifications, and both get in the way of understanding what is actually happening.",
    tagNao: "What does NOT hold up",
    naoTitulo: '"The numbers are made up."',
    naoP1:
      "There is no evidence whatsoever of manipulation of the IPCA (consumer price index) or the PNAD (labour force survey). Both are surveys with public methodology, open microdata, an auditable sample and career civil servants running them. Any researcher can recompute the indices from the microdata — and universities, banks and independent institutes do exactly that routinely, arriving at the same results.",
    naoP2:
      "The **2025 re-weighting of the PNAD**, done to incorporate the 2022 Census, is a standard technical procedure, announced in advance and applied **retroactively across the whole series** — including the previous government's years. It creates no artificial improvement: it recalibrates past and present with the same ruler.",
    naoP3:
      "And the IPCA weights still come from the previous household budget survey: the update only takes effect from 2027. In other words, the index used in this comparison **was not altered** by this government.",
    tagSim: "What IS worrying",
    simTitulo: "The institutional safeguards have eroded — and that is documented.",
    simP1:
      "On **19 January 2026**, Rebeca Palis, the coordinator responsible for calculating GDP, was dismissed. At least three members of her team gave up their positions in solidarity.",
    simP2:
      "In **February and March 2026**, the public prosecutor attached to the federal audit court requested the removal of IBGE's president, Márcio Pochmann, citing the risk of political use of GDP data in an election year and concern over changes to collection and processing methodologies.",
    simP3:
      "None of this shows that any figure was falsified. It shows that the safeguards which make falsification difficult have become more fragile — and that is a legitimate reason for vigilance, not for panic.",
    veredito:
      "Accusing IBGE of fraud is unfair to the people who produce the data and distracts from the real problem. The data is reliable; it is the yardstick applied to it in the campaign material that is chosen. At the same time, the institute's governance crisis is real and deserves scrutiny — not least because the best defence of the numbers is the independence of those who calculate them.",
    fontes:
      "Sources: IBGE — technical note on the 2025 PNAD re-weighting and post-2022-Census population projections; IBGE/POF on the update of IPCA weights; Correio Braziliense and Gazeta do Povo (March 2026) on the prosecutor's filing at the audit court and the dismissals in the national accounts directorate.",
  },
  verdade: {
    eyebrow: "Honest in both directions",
    titulo: "What the campaign gets right — and what nobody is telling you.",
    lead:
      "A fact-checking site that only ever finds fault on the other side is not fact-checking, it is propaganda by another name. So let us be explicit about what checks out.",
    colunaAcertos: "✓ What checks out",
    colunaOmissoes: "! What both sides leave out",
    acertos: [
      { t: "5.4% is the lowest unemployment on record", d: "The record in the PNAD series, which began in 2012, is real. There is no trick in the number itself." },
      { t: "Informal work is falling", d: "37.5% in the quarter to Jan 2026, the lowest since July 2020. The counter-argument that 'the jobs are all informal' does not hold up in the data." },
      { t: "Average income is at its highest on record", d: "R$ 3,652 in usual real earnings, up 5.4% in a year. It is genuinely a record." },
      { t: "The R$ 5,000 income tax exemption is in force", d: "Law 15,270/2025, applied to payroll since 1 January 2026, benefiting roughly 15 million people." },
      { t: "The minimum wage gained in real terms", d: "The valorisation policy was restored by Law 14,663/2023 and the 2026 minimum (R$ 1,621) rose above inflation." },
      { t: "Labour underutilisation fell sharply", d: "13.8% in the quarter to April 2026, against more than 30% at the height of the pandemic. The labour market improvement is broad, not an artefact of definition." },
    ],
    omissoes: [
      { t: "Prices did not come back, they just stopped running", d: "109 of the 112 items in their own table are still pricier than in January 2019. Low inflation means prices rose slowly — not that they came down." },
      { t: "Coffee is up 156% since 2019", d: "And it rose 48.7% in the current window, by the site's own figures. Some everyday items still weigh far more on the household budget." },
      { t: "The global tide has turned again", d: "The FAO food index reached 133.3 points in August 2026, the highest since late 2022. The tailwind of 2023-2024 is not permanent." },
      { t: "The global cycle explains both sides", d: "The same logic that absolves this government of the 2021-2022 surge absolves the previous one. Anyone using the context argument has to apply it in both directions." },
    ],
    ponto:
      "The improvement in the labour market is real and the slowdown in prices is real. What is not real is the causal link the campaign builds between the two, nor the idea that food prices went back to what they were. You can acknowledge the result without buying the explanation.",
    fontes:
      "Sources: IBGE/PNAD Contínua (unemployment, informality, underutilisation and real earnings, 2026 releases); Law 15,270/2025; Law 14,663/2023; FAO — Food Price Index, August 2026; and the product table published on mercadodamentira.com.br itself.",
  },
  metodologia: {
    eyebrow: "Methodology",
    titulo: "How we arrived at these numbers.",
    itens: [
      { t: "We used their own figures", d: "The table was extracted from the original site's own “Item by item” section in September 2026. No variation was altered. We only removed 4 duplicate labels (the same IPCA item appeared under a short and a full name), leaving 112 products. The only new column is the cumulative one." },
      { t: "We archived the original", d: "A copy of the site under review was saved to the Internet Archive on 9 September 2026. If they edit it or take the page down, the version we audited stays public and verifiable — the link is in the sources below." },
      { t: "We chained, we did not add", d: "To find where a price stands today relative to Jan 2019, two consecutive periods multiply: (1+a)×(1+b)−1. Adding the two variations would give a wrong number." },
      { t: "We compared start with start", d: "For unemployment and income we used the value of the quarter each government took office and the quarter it handed over — rather than the worst and best points of the series." },
      { t: "We tested against a global series", d: "The FAO food index works as a control: if the same movement appears worldwide, it cannot be credited to or charged against a Brazilian government." },
      { t: "We say when they are right", d: "Three of the six rows in the original comparison hold up. They are marked as correct, each with its legal source." },
      { t: "We date everything", d: "Cyclical indicators change. Every block carries its verification date, and the page states the overall last update." },
    ],
    tituloFontes: "Primary sources",
    fontes: [
      { t: "IBGE · IPCA (Table 7060)", u: "https://sidra.ibge.gov.br/tabela/7060" },
      { t: "IBGE · PNAD Contínua", u: "https://www.ibge.gov.br/estatisticas/sociais/trabalho/17270-pnad-continua.html" },
      { t: "FAO · Food Price Index", u: "https://www.fao.org/worldfoodsituation/foodpricesindex/en/" },
      { t: "Senate · Amendment 221/2019", u: "https://www25.senado.leg.br/web/atividade/materias/-/materia/174386" },
      { t: "Law 15,270/2025 (income tax)", u: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15270.htm" },
      { t: "Law 14,663/2023 (minimum wage)", u: "https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14663.htm" },
      { t: "Archived copy of the original site (9 Sep 2026)", u: "https://web.archive.org/web/20260909203458/https://mercadodamentira.com.br/" },
    ],
  },
  compartilhe: {
    eyebrow: "Share",
    titulo: "This calculation needs to travel.",
    lead:
      "A bent yardstick travels fast because it is simple. Context travels slowly because it needs explaining. If this check helped you understand the number, it will help someone else too.",
    textoCompartilhado:
      "109 of the 112 items the campaign uses as proof are still pricier than in January 2019. And the calculation uses their own figures.",
    whatsapp: "WhatsApp",
    postarNoX: "Post on X",
    copiarLink: "Copy link",
    linkCopiado: "Link copied",
    nota: "The text comes pre-filled with the key figure. Write your own if you prefer — the link is the same.",
  },
  autor: {
    eyebrow: "Who made this check",
    nome: "João Pedro Gamin",
    bio1:
      "I built this site on my own, with no ties to any party, campaign, news outlet or public body. The motivation was simple: the numbers in the original material were true, and yet the conclusion did not hold. That is a problem of method, and method can be demonstrated.",
    bio2:
      "All the code and the dataset are open. If you find a mistake of mine, open an issue in the repository — the correction is published as plainly as the original claim.",
    tituloNumeros: "THIS PROJECT IN NUMBERS",
    numeros: [
      { n: "112", k: "products audited" },
      { n: "9", k: "primary sources" },
      { n: "5", k: "claims checked" },
      { n: "100%", k: "of the code open" },
    ],
  },
  footer: {
    marca: "MERCADO DA",
    marcaDestaque: "VERDADE",
    disclaimer:
      "An independent project with named authorship, built on my own time. **Not connected to any party, campaign, coalition, candidate or public body**, and not electoral advertising. We have no relationship with those responsible for mercadodamentira.com.br, whose content is cited here solely for critical analysis and fact-checking.",
    correcoes:
      "All data comes from public, official sources listed in each block, and the source code and product dataset are open: anyone can redo the calculations. Found a mistake of ours? Open an issue in the repository. The correction is published as plainly as the original claim — that is the difference between fact-checking and propaganda.",
    ultimaVerificacao: "Indicators last verified: {data}.",
    github: "Code and data on GitHub",
  },
  auditoria: {
    eyebrow: "Item by item",
    titulo: '"Cheaper" does not mean cheap.',
    lead:
      "We took the **{total} items** from the original site's own table, with their figures, without changing a comma. And we did the one calculation that was missing: chaining the two windows to find where the price stands **today** relative to January 2019.",
    stats: [
      { n: "{acima} of {total}", k: "items are still pricier than in January 2019" },
      { n: "{caiu}", k: "items did fall during the 2023-2026 window" },
      { n: "{aindaCaro} of those {caiu}", k: "fell, yet remain above their 2019 price" },
      { n: "{abaixo}", k: "items are genuinely below their 2019 level" },
    ],
    buscar: "Search for an item…",
    filtros: { enganosos: "Fell, but still costly", acima: "Above 2019", todos: "All" },
    colunas: { produto: "Item", janelaA: "2019-2022 window", janelaB: "2023-2026 window", acumulado: "Price today vs. Jan 2019" },
    vazio: "No item found.",
    veredito:
      'Soybean oil appears as "cheaper under Lula" (−14.2%). True — and it still costs **135% more** than in 2019. Rice fell 1.9% and remains 47.6% above. A fall after a surge does not give the price back: it gives back a fraction of it. That is why the chart improves while the feeling at the checkout does not follow.',
    calculo:
      'Calculation: cumulative price level = ((1 + first-window change) × (1 + second-window change) − 1). Variations taken from the "Item by item" section of mercadodamentira.com.br (Sep 2026), which cites IPCA/IBGE. When chaining consecutive periods, indices multiply — they do not add.',
  },
  schema: {
    descricao: "Statistical fact-check of Brazilian campaign material on the cost of living, using IBGE and FAO data.",
    checagens: [
      { claim: "Unemployment fell from over 14% to 5.4% because of the current government.", rating: "Misleading: compares the pandemic peak with the current figure" },
      { claim: "Food prices rose 4x more under the previous government than the current one.", rating: "Correct data, misleading cause: omits the global food cycle" },
      { claim: "Dozens of products became cheaper under the current government.", rating: "Lacks context: 109 of 112 items remain above their Jan 2019 price" },
      { claim: "Ending the 6x1 work shift is among the current government's delivered policies.", rating: "Misleading: the amendment has not yet been voted on the Senate floor" },
      { claim: "IBGE is falsifying employment and inflation data.", rating: "False: there is no evidence of manipulation of the IPCA or the PNAD" },
    ],
  },
  meta: {
    title: "Mercado da Verdade — the data is real, the context was cut out",
    desc: "A number-by-number check of mercadodamentira.com.br. Brazil's official data is real — the yardstick is what was chosen: 109 of 112 items are still above their 2019 price.",
    keywords: [
      "fact-checking", "Brazil", "statistical literacy", "cherry picking", "IPCA", "IBGE",
      "food inflation", "unemployment", "cost of living Brazil", "Brazilian election 2026",
      "data journalism", "misleading statistics",
    ],
  },
  // <<SECOES>>
};
