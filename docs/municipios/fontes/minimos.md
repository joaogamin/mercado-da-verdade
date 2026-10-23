# Fontes complementares: SIOPE e SIOPS (mínimos constitucionais)

Mapa das duas APIs federais de onde vêm os percentuais aplicados em educação e saúde, feito por
inspeção direta em 23/10/2026. É o que o adaptador `municipios/fontes/minimos/` implementa.

Os dois sistemas recebem o que **a própria prefeitura declara** a cada bimestre (o SIOPS também
homologa). O site os mostra com o selo "complementar", nunca misturados aos números do portal.
Servem a qualquer município do país: só o código IBGE muda.

## Por que não o RREO do Tesouro

A API do SICONFI (`apidatalake.tesouro.gov.br/ords/siconfi/tt/rreo`) tem o RREO de Erechim, mas **sem os
anexos 8 (educação) e 12 (saúde)**. Para municípios, esses dois anexos são gerados pelo SIOPE e pelo SIOPS.
Por isso a coleta vai direto a eles.

## SIOPE (FNDE, Ministério da Educação)

API OData da plataforma Olinda do FNDE, sem autenticação:

```
https://www.fnde.gov.br/olinda-ide/servico/DADOS_ABERTOS_SIOPE/versao/v1/odata/
  Indicadores_Siope(Ano_Consulta=2025,Num_Peri=6,Sig_UF='RS')?$filter=COD_MUNI eq 430700&$format=json
```

- `Num_Peri` é o bimestre, de 1 a 6.
- `COD_MUNI` é o código IBGE de **6 dígitos**, sem o verificador (430700, não 4307005). Com 7 dígitos a resposta vem vazia.
- O filtro precisa de `%20` nos espaços. Com `+`, o Olinda responde 400 ("Filter expressions must be boolean").
- Respostas de erro vêm embrulhadas num comentário JS (`/*{...}*/`). As de sucesso começam em `{"@odata.context"`.
- Bimestre ainda não declarado: `200` com `"value": []`.
- Campos: `NUM_ANO`, `NUM_PERI`, `COD_MUNI`, `NOM_MUNI`, `COD_EXIB`, `NOM_INDI`, `VAL_INDI`. **`VAL_INDI` às vezes vem como texto** (`"27.89"`).
- Tempo de resposta: 1 a 2 s.

| `COD_EXIB` | Indicador | Uso |
|---|---|---|
| 1.1 | Percentual de aplicação das receitas de impostos e transferências vinculadas à educação em MDE (mínimo de 25%) | o percentual mostrado |
| 8.1 | Valor exigido de aplicação de impostos em MDE (mínimo de 25%) | valor exigido |
| 8.2 | Valor aplicado em MDE da receita de impostos | valor aplicado |

O leitor confere se aplicado ÷ exigido × 25 bate com o 1.1 (tolerância de 0,05 ponto) e avisa se não bater.

Página para humanos: `https://www.fnde.gov.br/olinda-ide/servico/DADOS_ABERTOS_SIOPE/versao/v1/aplicacao`.

## SIOPS (Ministério da Saúde)

API REST da consulta pública, sem autenticação (é a que o OpenDataSUS cita como base do conjunto SIOPS):

```
https://siops-consulta-publica-api.saude.gov.br/v1/indicador/municipal/430700/2025/2
                                                                      ^ IBGE 6 ^ano ^período
```

- Também usa o código IBGE de 6 dígitos.
- **O período não é o bimestre.** Conferido pela receita acumulada de cada um:

  | Bimestre | 1º | 2º | 3º | 4º | 5º | 6º (ano) |
  |---|---|---|---|---|---|---|
  | código no SIOPS | 12 | 14 | 1 | 18 | 20 | 2 |

  Os demais códigos (3 a 11, 13, 15 a 17, 19, 21+) respondem 404.
- Bimestre ainda não homologado: `404` com `[{"error":"msg03","message":"Dados não homologado(s)."}]`.
  Um 404 sem essa mensagem é tratado como falha de leitura, nunca como "não declarado".
- Outros caminhos testados (`/v1/ente/municipal/43` lista os municípios da UF) existem, mas não são usados.
- Campos de cada indicador: `numero_indicador`, `ds_indicador`, `numerador`, `denominador`, `indicador_calculado` (texto: `"22,46 %"`).

| `numero_indicador` | Indicador | Uso |
|---|---|---|
| 3.2 | % da receita própria aplicada em ASPS conforme a LC 141 | o percentual mostrado; `numerador` = aplicado, `denominador` = receita base |

O leitor confere se numerador ÷ denominador bate com o texto publicado (tolerância de 0,01 ponto).

Página para humanos: `https://www.gov.br/saude/pt-br/acesso-a-informacao/siops/indicadores`.

## Como entra no processo

- **Etapa 1 (coletar):** para cada exercício da coleta, os bimestres já encerrados (outubro de 2026 → 1º ao 4º),
  as duas áreas, a 1 requisição por segundo. Entra antes dos detalhes, então o `--prazo` nunca a corta. São ~20
  requisições, em ~25 s. Fica fora do escopo `periodo`.
- **Arquivo próprio:** `brutos/<id>/complementares.warc.gz`. Não tem dado pessoal, por isso é público no manifesto e
  vai sempre no pacote mensal, independente de `MUNICIPIOS_PUBLICAR_BRUTOS`.
- **Falha não derruba a coleta.** Se um dos sistemas estiver fora do ar, a área é pulada, a falha aparece no
  `revisao.md` e o último valor visto continua na base. Um "ainda não declarado" também não apaga o que já foi visto.
- **Etapa 3 (normalizar):** cada resposta é lida pela fonte que declara a sua etiqueta (`siope-indicadores`,
  `siops-indicadores`). O resultado vai para `normalizado/<ano>/minimos.json`.
- **Etapa 6 (analisar):** `analise/minimos.ts` preenche o item "Mínimos constitucionais" do "o que está em ordem".
  Só o 6º bimestre dá veredito; antes dele o item fica "?" com os percentuais parciais.

## Limites

- O percentual é o declarado pela prefeitura. Não é auditoria: o Tribunal de Contas pode apurar outro número.
- Uma retificação muda o valor na base sem gerar evento de alteração. A versão anterior continua no WARC da coleta em que foi vista.
- A base de cálculo (receita de impostos e transferências) não sai do portal da prefeitura. Por isso não dá para
  conferir esses percentuais pela soma dos empenhos.
