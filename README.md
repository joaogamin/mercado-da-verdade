# Mercado da Verdade

Landing page de checagem estatística que responde ao site de propaganda eleitoral
`mercadodamentira.com.br`, replicando sua estrutura e linguagem visual com o eixo
cromático trocado de vermelho para azul.

A tese do site: **os números da peça original são verdadeiros; o que foi manipulado
é a régua** — as janelas de comparação (jan/2019–jul/2022 vs. jan/2023–jul/2026)
isolam a pandemia e o pico global de alimentos de um lado só.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 · fontes via `next/font`.
Todas as rotas são estáticas (SSG), sem dependência de runtime.

## Rodando

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção
```

## Deploy na Vercel

```bash
npx vercel login
npx vercel --prod
```

Depois de apontar o domínio, defina a variável de ambiente para que canonical,
sitemap, robots e Open Graph usem a URL correta:

```
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br
```

## SEO

- Metadata completa + Open Graph e Twitter Card (imagem gerada em `src/app/opengraph-image.tsx`)
- `sitemap.xml` e `robots.txt` gerados pelo Next
- JSON-LD com `WebSite` e cinco entradas `ClaimReview` (schema de fact-checking do Google)
- Conteúdo 100% renderizado no servidor, inclusive a tabela interativa

## Dados

`src/data/produtos.ts` traz os 112 produtos extraídos da tabela do site original.
As colunas `b` e `l` são as variações publicadas por eles; `a` é o **acumulado
encadeado** — `((1+b)×(1+l)−1)` — que mostra onde o preço está hoje em relação a
janeiro de 2019. Essa coluna não existe no site original e é o principal achado:
109 dos 112 produtos seguem acima do nível de 2019.

Cada bloco cita as fontes primárias (IBGE, FAO, Senado, Planalto). Indicadores
conjunturais verificados em 9 de setembro de 2026.
