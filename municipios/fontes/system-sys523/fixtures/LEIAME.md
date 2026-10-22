# Fixtures do portal System (Erechim)

Respostas reais capturadas em 22/10/2026, usadas pelos testes dos parsers.

- O texto é exatamente o que o servidor devolveu, com uma exceção: nos `.html`, as imagens embutidas
  (`base64,…` com mais de 200 caracteres) foram trocadas por `base64,CORTADO` para não inflar o repositório.
- Nenhuma fixture contém CPF completo. A da API é de um credor pessoa jurídica.
- Segunda exceção: em `empenhos-2025-03-10.csv` e `empenhos.pesquisa.xml`, o CPF que o portal publica
  dentro do nome de um MEI ("JOÃO EDUARDO VINCK" + 11 dígitos) foi trocado pela máscara `***.928.160-**`.

| Arquivo | Origem |
|---|---|
| `empenhos.get.html` | GET `despesasPorEmpenho.xhtml` |
| `empenhos.pesquisa.xml` | POST AJAX "Pesquisar", 10/03/2025 a 10/03/2025, Prefeitura |
| `empenhos-2025-03-10.csv` | Exportação CSV logo após a pesquisa acima (ISO-8859-1) |
| `bal-orgao.get.html` | GET `balDespOrgao.xhtml` |
| `bal-orgao-2025.csv` | Exportação CSV do balancete por órgão de 2025, Prefeitura, após a pesquisa |
| `detalhe-2025-3600.get.html` | GET `listaempenhos.xhtml?tipoFil=EMPENHO&anoBal=2025&empresa=1&numEmpenho=3600` (porta 443) |
| `detalhe-2025-3600.rowtoggle.xml` | Expansão da linha (`rowToggle`): classificação, liquidações e pagamentos |
| `detalhe-2026-10-pf.get.html` / `.rowtoggle.xml` | O mesmo para um credor pessoa física (CPF mascarado pelo portal) |
| `api-empenhos-2025-3600.json` | `consultar-empenhos?entidade=1&ano=2025&numero=3600` |
