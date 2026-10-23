# Diário: Erechim

Registro datado do que foi feito e encontrado. Cada entrada traz o que se sabe e o que ainda é hipótese.
Só se acrescenta: uma correção é uma entrada nova, nunca uma edição de entrada antiga.

---

## 22/10/2026: reconhecimento do portal

**Feito.**
- Mapeados os três mecanismos de coleta (API, exportação, detalhe). Ver `docs/municipios/fontes/system-sys523.md`.
- Capturadas as fixtures em `municipios/fontes/system-sys523/fixtures/`.

**Volume.**
- Empenhos de 2025 (Prefeitura): **19.798**.
- Março de 2025: 1.503 empenhos, R$ 41.899.833,37 empenhados.
- 10 a 14/03/2025: 192 empenhos, R$ 11.489.122,58 empenhados.

**Complementar (IBGE).**
- Código do município: 4307005.
- População estimada: 109.609 em 2025 e 109.610 em 2026. Censo 2022: 105.705.

**Achado de privacidade: a API expõe CPF completo.**
- `consultar-empenhos` devolve `cpfCnpj` com os 11 dígitos de pessoas físicas. As telas mostram o mesmo CPF
  mascarado (`***.346.140-**`).
- Decisão: nunca republicar o CPF completo. O bruto da API fica só em armazenamento privado.
- Pendente: avisar a prefeitura (ouvidoria ou e-SIC) antes de publicar o achado.

**Achado a verificar: a dotação atualizada é igual à inicial.**
- No balancete por órgão de 2025 (Prefeitura), a "Dotação Atualizada" é idêntica à "Dotação Inicial"
  em todos os órgãos: total de R$ 535.000.000,00 nas duas.
- O empenhado soma R$ 580.159.750,75, e 12 dos 15 órgãos com dotação aparecem acima dela. O maior caso é Gestão e
  Governança: R$ 32.478.593,21 empenhados para R$ 9.886.000,00 de dotação.
- Hipótese mais provável: a coluna não incorpora os créditos adicionais (suplementares e especiais) abertos
  durante o ano, ou seja, um problema de exibição, e não um gasto sem autorização.
- Próximo passo: conferir com o "Orçado" de `despRealizadas.xhtml`, com o RREO do 6º bimestre de 2025 e com os
  decretos de crédito.
- Até lá, isto é um sinal de **qualidade de dados**, e não de gasto irregular.

**Correção de percurso.**
- A primeira exportação do balancete foi feita sem o "Pesquisar" antes e devolveu o padrão da sessão (2026),
  não 2025.
- Os números de 2026 chegaram a ir para o plano como se fossem de 2025. Os números corretos estão acima.
- Isso virou regra no adaptador: toda exportação é precedida da pesquisa, e o arquivo é validado contra o
  filtro pedido (o ano e o período das linhas precisam bater).

**Ainda em aberto.**
- O conteúdo de "Documentos Digitais": a primeira amostra veio vazia.
- Rodar a coleta no GitHub Actions para saber se há bloqueio de IP fora do Brasil.
- No CSV de 10/03/2025, o total liquidado (R$ 463.556,21) é maior que o empenhado (R$ 432.999,55) do dia.
  Provável causa: anulações ou reforços contabilizados em outra data. Entender antes da conferência.

---

## 22/10/2026: primeira coleta, pipeline e páginas

**Feito.**
- Pipeline completo das 8 etapas, com testes contra as fixtures reais (`npm run test:municipios`).
- Primeira coleta de verdade (escopo `periodo`, 10 a 14/03/2025, 5 detalhes): 192 empenhos e R$ 11.489.122,58,
  idênticos ao total do portal.
- Validação por ferramentas independentes:
  - `warcio check` (Webrecorder) aprova todos os digests do WARC;
  - a biblioteca de referência do OpenTimestamps lê o `.ots`, com o digest igual ao sha256 do manifesto
    e três calendários pendentes.
- Páginas ocultas em `/municipios/`: auditoria de 14 rotas × 9 larguras (320 a 1600 px) sem nenhum vazamento,
  texto ≥ 12 px e alvos ≥ 44 px no celular, um `h1` por página, `noindex` nas 146 páginas geradas.

**Achado: o CPF também vaza pelo nome do MEI.**
- O nome empresarial de MEI é, por regra da Receita, "NOME DO TITULAR + CPF". O portal publica esse nome
  inteiro (ex.: credor do empenho 2025/3515, CNPJ 24.604.401/0001-19).
- Decisão: no site e nos dados, o CPF dentro do nome é mascarado no mesmo padrão do portal
  (`***.928.160-**`), o CNPJ fica intacto e o nome é marcado como mascarado por nós.
- **Pendente (decisão do mantenedor):** publicar ou não os WARC das telas no pacote público. Eles são cópia
  fiel das páginas públicas, como o Internet Archive faria, mas contêm esses nomes.
  Variável `MUNICIPIOS_PUBLICAR_BRUTOS`.

**Achado: o rodapé do portal não é a soma das linhas.**
- Na lista de 10/03/2025, o "Total Geral" de liquidado e pago (R$ 463.556,21) é maior que a soma das linhas
  (R$ 402.442,89). A tela mostra o mesmo rodapé.
- Hipótese: o rodapé soma o que foi liquidado ou pago **no período**, inclusive de empenhos de outras datas,
  enquanto cada linha mostra o acumulado do próprio empenho.
- Registrado como divergência do portal, sem corrigir. Não bloqueia a publicação.

**Limites de dispensa conferidos no texto oficial do Planalto.**
- 2025 (Decreto 12.343/2024): R$ 125.451,15 e R$ 62.725,59.
- 2026 (Decreto 12.807/2025): R$ 130.984,20 e R$ 65.492,11.
- Um site de consultoria citava R$ 62.021,48 como valor anterior; não confere.

**Ritmo e limite do Actions.** Cerca de 2,3 s por detalhe, ou ~13 h por ano completo. Um job do GitHub Actions
dura até 6 h, então a coleta ganhou `--prazo`: ela para de pedir detalhes, publica o que tem, e o resto entra na
incremental seguinte.

---

## 23/10/2026: lista completa de 2025 e 2026 e a primeira conferência de verdade

**Feito.**
- Coletados março de 2025 com detalhe completo (1.503 empenhos) e a lista inteira de 2025 e 2026: 36.410 empenhos,
  balancetes e API.
- A carga de detalhes dos demais 34.907 empenhos fica para as próximas incrementais (`--prazo`).

**A conferência fecha ao centavo, e isso revelou o que cada tela mede.**
- O "valor pago" de cada empenho na lista é o **total pago em qualquer ano**: inclui os restos pagos depois.
  O balancete conta só o pago dentro do exercício.
- Descontado o "pago em restos", em 2025 a soma da lista dá **R$ 536.447.146,90**, idêntica ao balancete.
  Em 2026 (em curso), a diferença é de 0,03%, e o liquidado bate ao centavo (R$ 454.275.228,63).
- O empenhado não bate (+5,14% em 2025 e +4,3% em 2026). A lista e a API mostram o mesmo valor, o original
  de cada empenho. Hipótese: o balancete desconta as anulações. **A confirmar** com um empenho anulado.
- Decisão: o portão de conferência usa o **pago dentro do exercício**. Liquidado e empenhado aparecem como
  informativos, cada um com a explicação.

**"Pago em Restos" em branco.** Nos meses de 2026, a coluna vem vazia, e não `R$ 0,00`, em empenhos do ano corrente.
O rodapé do portal diz R$ 0,00. Só essa coluna aceita branco, lido como zero e registrado; qualquer outro campo vazio
continua parando a coleta.

**O que os dados reais pegaram no nosso código (antes de publicar).**
- Portão de privacidade com dois falsos positivos:
  - hashes sha256 com 11 dígitos seguidos;
  - valores em centavos acima de R$ 100 mi (11 dígitos).

  Agora a fronteira exclui letras, e nos JSON só os textos são examinados.
- "Parcela contratada com disputa" estava inflada (72,8%): contava adesão a ata de outro órgão, credenciamento e
  chamada pública. O valor honesto é **52,1%**.
- O explorador dizia "pago + restos", mas o pago já inclui os restos. Corrigido para "dos quais … em anos seguintes".
- **Alterações fantasmas:** a comparação usava `JSON.stringify`. Com as chaves em ordem diferente entre a base em
  disco e o parser, um valor idêntico aparecia como "alterado", o que bloquearia toda incremental. Agora a comparação
  é feita na forma canônica, com teste.
- Renormalizar uma coleta antiga por cima de coletas posteriores gerava eventos falsos. O CLI agora recusa e manda
  usar `--escopo reprocessar`.
- Os derivados das três primeiras coletas (eventos, normalização, revisão) foram regenerados pelo reprocessamento
  `2026-10-23T012753Z`. Os brutos, os manifestos e os carimbos não mudaram.

**Determinismo verificado.** Duas execuções de `reprocessar` produzem os mesmos sha256 nos 34 arquivos derivados.

---

## 23/10/2026: portal fora do ar

Às 22h57 (horário de Brasília) de 22/10, a aplicação de transparência inteira (`/sys523/`, portas 443 e 8181:
telas e API) passou a responder 404 do servidor Payara, enquanto o site da prefeitura seguia no ar. A coleta
parou na primeira requisição, sem publicar nada.
- A coleta agora verifica a saúde do portal antes de começar e diz a causa ("o portal está fora do ar") em vez de
  um 404 genérico.
- A carga de detalhes foi reagendada para quando o portal voltar.

## 23/10/2026: anulações confirmadas na amostra

- Em março de 2025, em 93 dos 1.503 empenhos detalhados, o "Valor" do detalhe é **menor** que o "Valor Empenhado" da
  lista. Nunca é maior.
- Em 90 desses 93, o valor do detalhe é exatamente a soma das liquidações, o padrão de quem anula o saldo não usado.
- Exemplo: 2025/3385 reservou R$ 299.980,00 e foi anulado por inteiro (valor atual R$ 0,00, nada liquidado). Na lista,
  ele continua aparecendo com R$ 299.980,00.
- Conclusão: a lista e a API mostram o **valor original**; o detalhe e o balancete, o **valor atual**. A confirmação
  final é a medida "empenhado após anulações" da conferência, que deve bater com o balancete quando o detalhe de 2025
  estiver completo.
- Consequência no site:
  - o destaque da visão geral passa a ser o empenhado oficial do balancete (R$ 580,2 mi em 2025), com a linha "somando a
    lista dá R$ 610,0 mi";
  - os agregados usam o valor atual de cada empenho;
  - o explorador mostra original, anulado e atual.

## 23/10/2026: detalhe em lote (2,4× mais rápido, 5× menos carga no portal)

- Sem o número do empenho, a página do detalhe lista o exercício inteiro, e a expansão aceita o índice global da linha.
  Uma sessão aberta (25 s para o servidor) serve milhares de empenhos, a uma requisição cada.
- Tempos medidos:
  - um a um: GET de 1,4 s + expansão de 0,33 s;
  - em lote: só a expansão, 0,33 s.

  Com a mesma regra de 1 req/s, o ritmo vai de ~2,4 s para ~1 s por empenho.
- Equivalência: 25 empenhos de março detalhados nos dois métodos, idênticos campo a campo.
- A carga em andamento foi interrompida e retomada no método novo, sem repetir as listas nem os 554 detalhes já feitos.
  O gravador agora corta um registro incompleto no fim do WARC ao reabrir (teste incluído).
