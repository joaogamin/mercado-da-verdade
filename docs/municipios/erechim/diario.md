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
