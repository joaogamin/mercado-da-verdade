# Sinais e "o que está em ordem": Erechim

Implementação: `municipios/analise/sinais.ts`. A página `/municipios/sinais/` é montada a partir do mesmo
código, então o texto público não diverge da regra.

Princípio herdado do Mercado ("honestidade nos dois sentidos"): todo sinal fica ao lado do que está em
ordem, no mesmo nível visual. Um sinal é um convite a verificar, nunca uma conclusão.

## Fora de todos os sinais de contratação

Pessoal e encargos (natureza 3.1) e a folha não passam por licitação. Entrariam como "sem licitação" e
distorceriam qualquer comparação.

## Sinais

| Sinal | Regra | Base | O que não prova |
|---|---|---|---|
| Concentração por órgão | Em cada órgão, o credor com maior empenhado e a fatia dele no total do órgão. Ranking, sem alarme. | Empenhos publicados | Fornecedor único ou contrato grande e regular pode ser natural |
| Contratação direta | Empenhado por dispensa ou inexigibilidade em cada órgão | Modalidade do detalhe do empenho; Lei 14.133, arts. 72 a 75 | Contratação direta é legal nos casos previstos |
| Possível fracionamento | Dois ou mais empenhos de "dispensa de pequeno valor" para o mesmo credor e o mesmo elemento que, somados no ano, passam do limite | Lei 14.133, art. 75, I e II, e §1º. Limites: Decreto 12.343/2024 (2025: R$ 125.451,15 e R$ 62.725,59) e Decreto 12.807/2025 (2026: R$ 130.984,20 e R$ 65.492,11), conferidos no Planalto em 22/10/2026 | O agrupamento por elemento aproxima "mesma natureza"; a lei agrupa por objeto e unidade, e há limites próprios (§7º) |
| Espera entre liquidação e pagamento | Dias entre a data da liquidação e a do pagamento correspondente (mesmo nº de liquidação) | Datas do detalhe; Lei 14.133, art. 141 (ordem cronológica) | Não reconstrói a fila por fonte de recurso que o art. 141 exige |

O limite de obras e serviços de engenharia só é usado para o elemento 4.4.90.51 (obras e instalações).
Os demais usam o de compras e outros serviços. É uma regra conservadora, que tende a sinalizar a mais e não a menos.

## O que está em ordem

| Item | ✓ quando | Estado neutro (?) |
|---|---|---|
| A soma confere com o balancete | diferença ≤ 0,5% | sem balancete coletado |
| Parcela contratada com disputa | ≥ 50% do contratado fora da folha teve disputa feita pela prefeitura: pregão, concorrência, tomada de preços, convite, leilão ou concurso. Adesão a ata de outro órgão, credenciamento e chamada pública **não contam**: contá-las inflaria este item (em março de 2025, de 52,1% para 72,8%) | sem detalhes |
| Prazo típico de pagamento | mediana ≤ 30 dias | sem pagamentos detalhados |
| Mínimos constitucionais (saúde 15%, educação 25%) | ainda não implementado: depende da receita de impostos (RREO) | sempre "?" por enquanto |

## Próximos sinais (depois do MVP)

- Empresa aberta pouco antes do primeiro empenho (Receita/CNPJ, fonte complementar).
- CNAE incompatível com o objeto.
- Aditivos acima de 25% do contrato (Lei 14.133, art. 125).
- Quebra da ordem cronológica por fonte de recurso.
