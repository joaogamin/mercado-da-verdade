# Fonte: portal System Sistemas (`/sys523/publico/`)

Mapa do Portal da Transparência de Erechim, feito por inspeção direta em 22/10/2026.
É o que o adaptador `municipios/fontes/system-sys523/` implementa. Se o portal mudar,
este arquivo é o primeiro a ser atualizado.

- Software: System Software de Gestão, versão 4.4-N (rodapé de toda página)
- Pilha: JSF + PrimeFaces 8 + PrimeFaces Extensions 8.0.5, em Payara Server 5.2021.10
- Base: `https://www.erechim.rs.gov.br/sys523/publico/` (porta 443). A API e alguns
  redirecionamentos usam a porta **8181**, e o detalhe do empenho responde nas duas
- Não há `robots.txt`: `/robots.txt` devolve um 404 do Payara

## Três mecanismos de coleta

### 1. API JSON (`/sys523/webresources/api/`)

Documentada pela própria prefeitura em `dadosPublicos.xhtml`.

| Endpoint | Parâmetros | Observações |
|---|---|---|
| `consultar-empenhos` | `entidade`, `ano`, `numero`, `cpfCnpj` | `entidade` precisa de mais um filtro. Com `entidade=1&ano=2025`, devolve **o ano inteiro numa chamada**: 6,1 MB em cerca de 62 s |
| `consultar-licitacoes` | `entidade`, `ano`, `numeroLicitacao`, `modalidade`, `numeroModalidade`, `situacao`, `protocolo`, `objetivo`, `descricaoProduto` | Ainda não usado no MVP |

- **Limite declarado: no máximo 1 chamada a cada 60 segundos.**
- Campos de `consultar-empenhos`: `entidade`, `ano`, `numeroEmpenho`, `valor` (número
  com 2 casas), `cpfCnpj` (só dígitos), `fonteRecurso` e `descricao`.
- ⚠️ **`cpfCnpj` vem completo também para pessoa física**, enquanto todas as telas mostram
  `***.346.140-**`. A resposta bruta da API **nunca** vai para o git, um artefato de CI ou um
  pacote público. Ver `municipios/nucleo/privacidade.ts`.
- Códigos de entidade da API: 1 Prefeitura, 2 Câmara, 3 AGER, 5 IEP.

### 2. Exportação das telas (CSV, XML, XLS, PDF, TXT, ODT)

Toda tela de consulta tem um menu "Exportar". O fluxo que funciona é este:

1. **GET** da tela. Guardar o cookie `JSESSIONID` e o `javax.faces.ViewState` do `form1`.
2. **POST AJAX "Pesquisar"** com os filtros. Cabeçalho `Faces-Request: partial/ajax` e os campos:
   `javax.faces.partial.ajax=true`, `javax.faces.source=<botão>`,
   `javax.faces.partial.execute=<botão> <painel de filtros>`,
   `javax.faces.partial.render=<tabela> …`, `<botão>=<botão>`, os campos do formulário e o ViewState.
3. **POST normal** (sem AJAX) com os mesmos campos mais o parâmetro do item de menu
   (ex.: `form1:j_idt137:j_idt141=form1:j_idt137:j_idt141`). A resposta é o arquivo:
   `Content-disposition: attachment;filename="empenhos.csv"`.

Armadilhas:

- **A exportação ignora os filtros do passo 3 e usa o estado guardado na sessão.** Sem o passo 2,
  ela devolve o padrão da tela (o ano corrente). Esse erro já aconteceu uma vez nesta
  investigação. Ver o diário de 22/10/2026.
- **Os ids `j_idtNN` são gerados pelo servidor** e podem mudar a cada versão. O adaptador
  descobre os ids a cada sessão:
  - o botão de busca pelo `title="Clique para pesquisar"`, junto com os `p:`/`u:` do seu `PrimeFaces.ab(...)`;
  - os itens de exportação pelo `title="Exporta CSV"` (ou XML…) e o parâmetro dentro de `addSubmitParam`;
  - os campos pelos `<label>` ligados a eles.
- **Limite de tamanho:** a exportação de um semestre (9.599 empenhos, 1,2 MB, 22 s) funciona.
  A do ano inteiro (19.798 empenhos) volta vazia depois de cerca de 42 s. **A coleta é mês a mês.**
- Codificação: `text/csv;charset=ISO-8859-1`, separador `,`, todos os campos entre aspas,
  quebra de linha LF e nenhuma no final do arquivo.
- Valores: `"R$ 11.087,44"`, em que o espaço é um **NBSP** (byte `A0`). A última linha é
  `"","","","Total Geral:",…`, que serve de conferência e não é dado.
- Pessoa física aparece mascarada: `***.731.140-**`. Folha aparece como credor
  `PAGAMENTOS PROVENTOS FOLHA` sem documento.

Telas usadas:

| Tela | Filtros | Colunas |
|---|---|---|
| `despesasPorEmpenho.xhtml` | Ano, Entidade (0 = Prefeitura), Período (`PERSONALIZADO` + duas datas `dd/mm/aaaa`), favorecido, CPF/CNPJ, nº do empenho, contrato, licitação | Empenho (`2025 / 3509`), Data, Credor, CNPJ/CPF, Valor Empenhado, Liquidado, Pago, Pago em Restos |
| `balDespOrgao.xhtml` | Entidade, Ano, Mês, Órgão | Código, Órgão, Dotação Inicial, Dotação Atualizada, Empenhado, Liquidado, Pago, Pago em Restos |
| `balCredor.xhtml` | Ano, Mês, Entidade, favorecido | Favorecido, CPF/CNPJ, Empenhado, Liquidado, Pago, Pago em Restos |
| `despRealizadas.xhtml` | Ano, Bimestre, Entidade, Órgão, Classificação | Classificação, Descrição, Orçado, Empenhado, Liquidado e Pago (no bimestre e até ele) |

Códigos de entidade nas telas: 0 Prefeitura, 1 Câmara, 2 AGER, 3 IEP (diferentes da API).

### 3. Detalhe do empenho

O botão "Detalhar" da lista leva, por `window.location.href`, a uma URL **GET direta**:

```
/sys523/publico/listaempenhos.xhtml?tipoFil=EMPENHO&anoBal=2025&empresa=1&numEmpenho=3600
```

Qualquer cidadão abre essa URL, e é ela que o site mostra como "ver no portal".
A página traz uma linha-resumo. O conteúdo completo vem pela **expansão da linha** (PrimeFaces `rowToggle`):

```
POST /sys523/publico/listaempenhos.xhtml   (mesma sessão do GET, Faces-Request: partial/ajax)
javax.faces.partial.ajax=true
javax.faces.source=listEmpenhos
javax.faces.partial.execute=listEmpenhos
javax.faces.partial.render=listEmpenhos
javax.faces.behavior.event=rowToggle
javax.faces.partial.event=rowToggle
listEmpenhos_rowExpansion=true
listEmpenhos_expandedRowIndex=0
listEmpenhos_encodeFeature=true
listEmpenhos_skipChildren=true
form1=form1
javax.faces.ViewState=<do GET>
```

A resposta (`<partial-response>`, `update id="listEmpenhos"`) traz pares `<b>Rótulo:</b> valor`:

- Empenho, Data, Valor
- **Conta Orçamentária**, por exemplo `05.01.04.129.0005.2017.3.3.90.40.06.00.00 - Locação de Software`.
  Ela é decodificada como órgão.unidade.função.subfunção.programa.ação.natureza da despesa,
  e o elemento é o trecho `3.3.90.40`.
- Órgão, Órgão/Unidade, Função, Subfunção, Natureza, Recurso / Complemento
- Ordem de Compra, **Licitação** (`2021/837 - Pregão Presencial (Lei 10.520)`), Favorecido, CPF/CNPJ do Favorecido
- **Contrato**, com link para `contratoseConvenios.xhtml?entidade=1&anoContrato=2022&numeroContrato=82&tipoContrato=C`
- Abas:
  - **Especificação**: `<textarea>` com o histórico do empenho.
  - **Liquidações**: tabela `tabelaliq` com Data, Liquidação, Documento, Valor Liquidado,
    Valor Estornado e Documentos Digitais (botão).
  - **Pagamentos**: tabela `tabelapag` com Data, Liquidação, Documento, Valor Pago, Estornado e Descontos.

"Documentos Digitais" abre o diálogo `frmDocumentosDigitais` por AJAX. Ele veio vazio na
liquidação testada (2025/3600). Fica a investigar em mais amostras.

**Em lote (o método usado na coleta).** Sem `numEmpenho`, a mesma URL (`listaempenhos.xhtml?tipoFil=EMPENHO&anoBal=2025&empresa=1`)
lista **o exercício inteiro** em ordem de número (os parâmetros `tipoFil=CREDOR` e `ORGAO` são ignorados). A expansão aceita o **índice
global** da linha (`listEmpenhos_expandedRowIndex`), e não só os da página visível. O índice 0 é o empenho 1 e o 19.797 é o 19.798.

| Medido em 23/10/2026 | Tempo do servidor | Por empenho, a 1 req/s |
|---|---|---|
| Um a um (GET da página + expansão) | 1,4 s + 0,33 s | ~2,4 s, 2 requisições, ~125 KB |
| Em lote (uma sessão + expansão por índice) | 0,33 s por expansão; 25 s para abrir a sessão | ~1 s, 1 requisição, ~25 KB |

- A sessão é reaproveitada por até 3 mil expansões, porque abrir custa ~25 s ao servidor.
- O índice vem da posição do número no universo do exercício (as listas mensais do dia).
- **A etiqueta do WARC é tirada do conteúdo** ("Empenho: aaaa/n"), nunca do índice. Se o índice trouxer outro empenho,
  aquele número volta para o método um a um. Depois de 3 desalinhamentos, o resto do lote segue um a um.
- Equivalência: 25 empenhos de março de 2025 detalhados nos dois métodos deram resultado idêntico, campo a campo.
- No escopo `periodo` (sem o universo do exercício), a coleta usa o método um a um.

Ano completo (~20 mil empenhos): ~5,5 h em lote, contra ~13 h um a um, com ~5× menos trabalho para o servidor da prefeitura.

## Coleta educada

- Sequencial, no máximo 1 requisição por segundo nas telas, 60 s entre chamadas à API.
- Retry com espera crescente em 5xx e timeout. Quatro falhas seguidas abortam a coleta.
- User-Agent identificável.
- Toda resposta é gravada em WARC antes de ser lida (ver `docs/municipios/README.md`, "Persistência").
