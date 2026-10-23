# Coleta Erechim · 2026-10-23T022332Z

Escopo **incremental** · exercícios 2025, 2026

**Algum portão falhou: esta coleta precisa de revisão humana antes do merge.**

## Portões

| | Portão | Situação |
|---|---|---|
| ❌ | Privacidade | CPF completo encontrado: dados\municipios\erechim\normalizado\2025\empenhos-09.ndjson: 2 ocorrência(s); dados\municipios\erechim\normalizado\2025\empenhos-10.ndjson: 2 ocorrência(s); dados\municipios\erechim\normalizado\2026\empenhos-01.ndjson: 22 ocorrência(s); dados\municipios\erechim\normalizado\2026\empenhos-06.ndjson: 6 ocorrência(s); dados\municipios\erechim\normalizado\2026\empenhos-08.ndjson: 2 ocorrência(s); dados\municipios\erechim\normalizado\2026\empenhos-09.ndjson: 1 ocorrência(s) |
| ✅ | Conferência | pago dentro do exercício confere com o balancete oficial, dentro de ±0.5% (2025: 0%, 2026: 0.0297%) |
| ✅ | Remoção ou alteração | 0 removido(s), 0 alteração(ões) em campos sensíveis |
| ✅ | Queda | nenhum exercício perdeu valor empenhado |
| ✅ | Leitura | todas as respostas no formato esperado |

## O que mudou

- Empenhos na base: **36.410**
- Novos: 0 · alterados: 0 · removidos do portal: 0 · reapareceram: 0
- Detalhes coletados nesta execução: 34.389
- Ficaram para a próxima coleta (prazo da execução): 518

## Conferência com o balancete oficial

| Exercício | Medida | Nossa soma | Balancete do portal | Diferença | Entra no portão? |
|---|---|---|---|---|---|
| 2025 | Pago dentro do exercício | R$ 536.447.146,90 | R$ 536.447.146,90 | 0% | sim |
| 2025 | Liquidado | R$ 574.132.858,01 | R$ 548.715.651,41 | 4,63% | não: Em exercício fechado, a lista inclui liquidações feitas nos anos seguintes (restos não processados) e o balancete não |
| 2025 | Empenhado (valor original) | R$ 609.973.630,85 | R$ 580.159.750,75 | 5,14% | não: A lista e a API mostram o valor original de cada empenho |
| 2025 | Empenhado após anulações | R$ 580.159.750,75 | R$ 580.159.750,75 | 0% | informativo |
| 2026 | Pago dentro do exercício | R$ 451.624.719,89 | R$ 451.490.686,68 | 0,03% | sim |
| 2026 | Liquidado | R$ 454.275.228,63 | R$ 454.275.228,63 | 0% | informativo |
| 2026 | Empenhado (valor original) | R$ 561.665.688,24 | R$ 538.495.913,26 | 4,3% | não: A lista e a API mostram o valor original de cada empenho |
| 2026 | Empenhado após anulações | R$ 538.500.297,79 | R$ 538.495.913,26 | 0% | não: Soma do valor atual do detalhe onde ele já foi coletado (16094 de 16612) e do valor original nos demais |

- 2025: detalhe coletado para 19.798 de 19.798 empenhos (100%)
- 2026: detalhe coletado para 16.094 de 16.612 empenhos (96,9%)

Qualidade dos dados do portal:
- 2025: A dotação atualizada é igual à dotação inicial em todos os órgãos: a coluna provavelmente não incorpora os créditos adicionais do ano.
- 2025: 11 de 14 órgãos aparecem com empenhado acima da dotação atualizada publicada.
- 2026: A dotação atualizada é igual à dotação inicial em todos os órgãos: a coluna provavelmente não incorpora os créditos adicionais do ano.
- 2026: 5 de 14 órgãos aparecem com empenhado acima da dotação atualizada publicada.

## Maiores empenhos detalhados nesta coleta

| Empenho | Data | Credor | Empenhado | Órgão |
|---|---|---|---|---|
| 2026/8915 | 2026-06-01 | FUNDAÇAO HOSPITALAR SANTA TEREZINHA DE ERECHIM | R$ 9.442.936,00 | SECRETARIA MUNICIPAL DE SAUDE |
| 2025/6907 | 2025-05-21 | FUNDAÇAO HOSPITALAR SANTA TEREZINHA DE ERECHIM | R$ 8.796.821,61 | SECRETARIA MUNICIPAL DE SAUDE |
| 2025/1743 | 2025-01-30 | FUNDAÇAO HOSPITALAR SANTA TEREZINHA DE ERECHIM | R$ 7.362.400,92 | SECRETARIA MUNICIPAL DE SAUDE |
| 2026/8605 | 2026-05-28 | RIO GRANDE DO SUL PODER JUDICIARIO * | R$ 6.646.368,77 | ENCARGOS GERAIS DO MUNICÍPIO |
| 2026/989 | 2026-01-21 | FUNDAÇAO HOSPITALAR SANTA TEREZINHA DE ERECHIM | R$ 6.633.750,00 | SECRETARIA MUNICIPAL DE SAUDE |
| 2026/828 | 2026-01-19 | GRECA DISTRIBUIDORA DE ASFALTOS LTDA | R$ 5.634.185,54 | SECRETARIA MUNICIPAL DE OBRAS PUBLICAS E HABITAÇÃO |
| 2025/453 | 2025-01-13 | RGE SUL DISTRIBUIDORA DE ENERGIA S.A. | R$ 5.390.000,00 | SECRETARIA MUNICIPAL DE OBRAS PUBLICAS, HABITAÇÃO, SEGURANÇA E PROTEÇÃO SOCIAL |
| 2026/62 | 2026-01-06 | RGE SUL DISTRIBUIDORA DE ENERGIA S.A. | R$ 5.390.000,00 | SECRETARIA MUNICIPAL DE OBRAS PUBLICAS E HABITAÇÃO |
| 2025/726 | 2025-01-16 | GRECA DISTRIBUIDORA DE ASFALTOS LTDA | R$ 5.168.240,00 | SECRETARIA MUNICIPAL DE OBRAS PUBLICAS, HABITAÇÃO, SEGURANÇA E PROTEÇÃO SOCIAL |
| 2026/275 | 2026-01-08 | CONEXAO B ASSESSORIA E PUBLICIDADE LTDA | R$ 5.000.000,00 | SECRETARIA MUNICIPAL DE GESTÃO E GOVERNANÇA |

## Divergências do próprio portal

- lista 2025-01-01 a 2025-01-31: liquidado: soma das linhas R$ 116.757.420,95 × Total Geral do portal R$ 116.849.083,17
- lista 2025-01-01 a 2025-01-31: pago: soma das linhas R$ 116.737.603,95 × Total Geral do portal R$ 116.828.606,17
- lista 2025-02-01 a 2025-02-28: liquidado: soma das linhas R$ 39.918.825,94 × Total Geral do portal R$ 39.989.959,06
- lista 2025-02-01 a 2025-02-28: pago: soma das linhas R$ 39.914.387,55 × Total Geral do portal R$ 39.983.120,67
- lista 2025-03-01 a 2025-03-31: liquidado: soma das linhas R$ 40.550.801,83 × Total Geral do portal R$ 40.705.842,67
- lista 2025-03-01 a 2025-03-31: pago: soma das linhas R$ 40.550.801,83 × Total Geral do portal R$ 40.684.573,79
- lista 2025-04-01 a 2025-04-30: liquidado: soma das linhas R$ 32.248.562,74 × Total Geral do portal R$ 32.327.324,62
- lista 2025-04-01 a 2025-04-30: pago: soma das linhas R$ 32.238.885,42 × Total Geral do portal R$ 32.315.447,30
- lista 2025-05-01 a 2025-05-31: liquidado: soma das linhas R$ 45.118.798,19 × Total Geral do portal R$ 45.192.903,29
- lista 2025-05-01 a 2025-05-31: pago: soma das linhas R$ 45.115.443,58 × Total Geral do portal R$ 45.181.765,50
- … e mais 37

## Confira à mão (5 sorteados)

Abra o link oficial e compare com os números ao lado.

| Empenho | Credor | Empenhado | Liquidado | Pago | Portal |
|---|---|---|---|---|---|
| 2025/12198 | PAGAMENTOS PROVENTOS FOLHA | R$ 267,32 | R$ 267,32 | R$ 267,32 | [abrir](https://www.erechim.rs.gov.br/sys523/publico/listaempenhos.xhtml?tipoFil=EMPENHO&anoBal=2025&empresa=1&numEmpenho=12198) |
| 2025/8617 | PAGAMENTOS PROVENTOS FOLHA | R$ 1.635,09 | R$ 1.635,09 | R$ 1.635,09 | [abrir](https://www.erechim.rs.gov.br/sys523/publico/listaempenhos.xhtml?tipoFil=EMPENHO&anoBal=2025&empresa=1&numEmpenho=8617) |
| 2025/8416 | PAGAMENTOS PROVENTOS FOLHA | R$ 1.125,94 | R$ 1.125,94 | R$ 1.125,94 | [abrir](https://www.erechim.rs.gov.br/sys523/publico/listaempenhos.xhtml?tipoFil=EMPENHO&anoBal=2025&empresa=1&numEmpenho=8416) |
| 2026/14189 | PAGAMENTOS PROVENTOS FOLHA | R$ 38.901,81 | R$ 38.901,81 | R$ 38.901,81 | [abrir](https://www.erechim.rs.gov.br/sys523/publico/listaempenhos.xhtml?tipoFil=EMPENHO&anoBal=2026&empresa=1&numEmpenho=14189) |
| 2025/10959 | PAGAMENTOS PROVENTOS FOLHA | R$ 228,45 | R$ 228,45 | R$ 228,45 | [abrir](https://www.erechim.rs.gov.br/sys523/publico/listaempenhos.xhtml?tipoFil=EMPENHO&anoBal=2025&empresa=1&numEmpenho=10959) |

## Antes do merge

- [ ] Li este relatório
- [ ] Abri 2 dos 5 links acima e os números conferem
- [ ] Olhei a prévia do site
