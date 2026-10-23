# Fixtures do SIOPE e do SIOPS (Erechim, IBGE 430700)

Respostas reais capturadas em 23/10/2026, byte a byte, usadas pelos testes do leitor. Não há dado pessoal.

| Arquivo | Origem |
|---|---|
| `siope-430700-2025-6.json` | SIOPE `Indicadores_Siope(Ano_Consulta=2025,Num_Peri=6,Sig_UF='RS')?$filter=COD_MUNI eq 430700` |
| `siope-430700-2026-5-vazio.json` | O mesmo para 2026, 5º bimestre, ainda não declarado (`value` vazio) |
| `siops-430700-2025-6.json` | SIOPS `indicador/municipal/430700/2025/2` (ano inteiro) |
| `siops-430700-2026-4.json` | SIOPS `indicador/municipal/430700/2026/18` (4º bimestre) |
| `siops-430700-2026-5-nao-homologado.json` | SIOPS `indicador/municipal/430700/2026/20`: 404 "Dados não homologado(s)" |
