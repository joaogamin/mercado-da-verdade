# Arquitetura

```
municipios/            o pipeline (TypeScript executado direto pelo Node 24)
  cli.ts               porta de entrada única
  processo/            as 8 etapas, o estado, os portões e o relatório de revisão
  nucleo/              esquema, dinheiro, datas, CSV, HTTP, WARC, privacidade, diff
  fontes/              um adaptador por software de portal (hoje: system-sys523) e as fontes
                       complementares nacionais (minimos/: SIOPE e SIOPS, servem a qualquer município)
  analise/             conferência, agregados, sinais, limites legais, nomes de elementos
  arquivo/             manifesto + carimbo, pacote mensal, Wayback
  publicar/            exportar: dados/ → public/dados/ (no prebuild, sem rede)
  cidades/             uma configuração por cidade
dados/municipios/<cidade>/
  coletas/<id>/        estado.json, manifesto.json(.ots), normalizacao.json, eventos.ndjson, revisao.md
  normalizado/<ano>/   empenhos-MM.ndjson, balancete-orgaos-<entidade>.json e minimos.json (complementar)
  eventos.ndjson       histórico só de acréscimo: novo, alterado, removido, reaparecido
  conferencia.json     nossa soma × balancete oficial
  analise/             um JSON por exercício: a fonte única das páginas
  brutos/<id>/         WARC (fora do git): telas, API e complementares em arquivos separados
src/municipios/        leitura de dados/, componentes, textos, páginas compartilhadas
src/app/(br)/municipios/   as rotas (layout aninhado no root (br), noindex)
```

## O processo

```
1 coletar → 2 arquivar → 3 normalizar → 4 comparar → 5 conferir → 6 analisar → 7 revisar → 8 publicar
```

| Etapa | Faz | Rede? | Grava |
|---|---|---|---|
| 1 coletar | Lista do mês, balancete, API e detalhes, conforme o escopo. Toda resposta vai para o WARC antes de ser lida. | sim | `brutos/<id>/*.warc.gz`, `estado.json` |
| 2 arquivar | Manifesto com o sha256 de cada WARC e carimbo OpenTimestamps. | só o carimbo | `manifesto.json`, `manifesto.json.ots` |
| 3 normalizar | Lê o WARC com o leitor da fonte e incorpora à base. A última observação vence. | não | memória, `normalizacao.json` |
| 4 comparar | Diff contra a base publicada: eventos e marcação de removidos. Grava a base. | não | `normalizado/`, `eventos.ndjson` |
| 5 conferir | Nossa soma × balancete oficial, por exercício e por órgão. | não | `conferencia.json` |
| 6 analisar | Agregados da árvore do dinheiro, réguas, sinais e o que está em ordem. | não | `analise/*.json` |
| 7 revisar | Portões automáticos e o relatório que vira o corpo do PR. | não | `revisao.md` |
| 8 publicar | O merge do PR. O prebuild roda `exportar` e a Vercel publica; no mês seguinte, o pacote vai para os arquivos externos. | não | `public/dados/` (gerado) |

- **Retomada.** Se uma etapa falha, o `estado.json` guarda onde parou e o que a coleta já fez. `retomar <id>` continua dali sem repetir requisições.
- **Reprocessar.** `--escopo reprocessar` refaz as etapas 3 a 8 dobrando todas as coletas em ordem, a partir da base vazia. É o mesmo código da coleta normal, que é um passo só dessa dobra.
- **Prazo.** `--prazo N` para de pedir detalhes depois de N minutos e segue o processo. O que faltou entra na próxima coleta incremental.

## Contrato da fonte (`municipios/fontes/tipos.ts`)

Uma fonte é um par:

- **coletor**: rede → WARC etiquetado. Cada resposta leva `WARC-Municipios-Tipo`, `-Params` e `-Url-Oficial`.
- **leitor**: resposta etiquetada → esquema canônico. Não faz rede, por isso o reprocessamento roda offline.

Cada fonte declara as etiquetas que lê (`etiquetas`) e o seu `papel`: `prefeitura` (a fonte primária) ou
`complementar` (selo próprio na linha de fonte, nunca misturada aos números do portal). A normalização entrega
cada resposta à fonte que declara a etiqueta dela.

O esquema (`nucleo/esquema.ts`) não depende da fonte e é importado também pelo site: se divergir, o build quebra. Valores em centavos inteiros, datas em ISO.

## Como acrescentar uma cidade

1. **Mesmo software (System, `/sysNNN/`).** Crie `municipios/cidades/<slug>.ts` com URLs, entidades (os códigos mudam entre telas, API e detalhe: confira cada um), população do IBGE e portões. Registre em `cidades/index.ts`. Rode `npm run municipio -- <slug> atualizar --escopo periodo --de … --ate … --limite 5` e confira o `revisao.md`.
2. **Outro software (IPM, Betha, …).** Escreva `municipios/fontes/<software>/` com coletor, leitor e fixtures reais. Documente em `docs/municipios/fontes/<software>.md`. O resto do processo não muda.
3. **Qualquer cidade do RS, sem adaptador.** Um leitor para os CSVs de empenhos do TCE-RS (`dados.tce.rs.gov.br`) cobre todos os municípios, com atualização bimestral. Ainda não feito.

## Privacidade

- A API devolve o CPF completo; `parse.ts/lerApiEmpenhos` mascara no padrão das telas antes de qualquer dado sair da função.
- Nome de MEI traz o CPF do titular; `mascararCpfsNoTexto` mascara no mesmo padrão e marca `nomeMascarado`.
- O WARC da API nunca vai para git, artefato de CI ou pacote público, só para o B2 privado.
- O portão de privacidade varre tudo o que é versionado ou publicado e bloqueia qualquer sequência com cara de CPF completo.
