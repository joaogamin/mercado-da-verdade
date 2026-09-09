# Mercado da Verdade

**https://mercadodaverdade.com.br** · [github.com/joaogamin/mercado-da-verdade](https://github.com/joaogamin/mercado-da-verdade)

Landing page de checagem estatística que responde ao site de propaganda eleitoral
`mercadodamentira.com.br`, replicando sua estrutura e linguagem visual com o eixo
cromático trocado de vermelho para azul.

A tese do site: **os números da peça original são verdadeiros; o que foi escolhido
é a régua.** As janelas de comparação (jan/2019–jul/2022 vs. jan/2023–jul/2026)
isolam a pandemia e o pico global de alimentos de um lado só.

## O achado principal

`src/data/produtos.ts` traz os 112 produtos extraídos da tabela do site original.
As colunas `b` e `l` são as variações publicadas por eles, sem alteração; `a` é o
**acumulado encadeado** — `((1+b)×(1+l)−1)` — que mostra onde o preço está hoje em
relação a janeiro de 2019.

Essa coluna não existe no site original e é o ponto central: **109 dos 112 produtos
seguem acima do nível de 2019**. O óleo de soja, vendido como "mais barato", acumula
+135%. Uma queda depois de uma disparada não devolve o preço.

Como o cálculo usa os números deles, o argumento é reproduzível por qualquer pessoa.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 · fontes via `next/font`.

`output: "export"` — o site é HTML estático puro, sem funções serverless. Roda em
qualquer hospedagem estática (Vercel, GitHub Pages, S3, Netlify).

## Rodando

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # gera out/ com o site estático
```

## Deploy

O projeto está conectado à Vercel. Todo push em `main` publica automaticamente.

Para deploy manual:

```bash
npm run build
npx vercel deploy --prod ./out
```

### Variável de ambiente

Copie `.env.example` para `.env.local` (ou configure na Vercel):

```
NEXT_PUBLIC_SITE_URL=https://mercadodaverdade.com.br
```

Ela alimenta canonical, `sitemap.xml`, `robots.txt` e as tags Open Graph.

## SEO

- Metadata completa + Open Graph e Twitter Card (`public/og.png`)
- `sitemap.xml` e `robots.txt` gerados pelo Next
- JSON-LD com `WebSite` e cinco entradas `ClaimReview`, o schema de fact-checking
  do Google, cada uma com o veredito e a âncora da seção correspondente
- Conteúdo 100% renderizado no build, inclusive a tabela interativa

## Fontes

Cada bloco cita as fontes primárias no rodapé da seção: IBGE (IPCA Tabela 7060 e
PNAD Contínua), FAO (Índice de Preços de Alimentos), Senado Federal (PEC 221/2019)
e Planalto (Lei 15.270/2025 e Lei 14.663/2023).

Indicadores conjunturais verificados em **9 de setembro de 2026**. São dados que
mudam: ao atualizar qualquer número, atualize também a data no rodapé.

## Correções

Encontrou um erro? Abra uma issue. Correção em projeto de checagem não é
constrangimento — é o produto. Erros confirmados são corrigidos no site com a mesma
clareza da afirmação original.

## Licença

Código sob licença MIT. O conteúdo editorial e a análise estão sob
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.pt-br): use à vontade,
com atribuição.
