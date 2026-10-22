# Municípios

Projeto lateral do Mercado da Verdade. Ele coleta os dados que a prefeitura já é obrigada a
publicar e os reorganiza para que qualquer cidadão consiga seguir o dinheiro: de onde sai, para quê,
para quem, como foi contratado e quando foi pago. A primeira cidade é Erechim (RS).

**Situação: em construção e oculto.** As páginas ficam em `/municipios/`, com `noindex`, fora do
menu, do sitemap e da home do Mercado. Nada é anunciado até a decisão de lançar.

## A tese

A tese é a mesma do Mercado, trocando a peça de propaganda pela prestação de contas:
**os números são da prefeitura; o que oferecemos é uma régua justa para lê-los.**
Isso significa valor por habitante, valor corrigido pela inflação, mesmo período contra mesmo período,
participação no total e o limite legal quando houver.

## Princípios

1. **Fonte primária = portal da prefeitura.** Fontes complementares (IBGE, TCE-RS, Receita, PNCP)
   entram com selo próprio e nunca se misturam em silêncio.
2. **Nada é filtrado nem inventado.** O que o portal publica nós publicamos, com o mesmo
   mascaramento das telas. Toda coluna calculada por nós é rotulada como tal, com a fórmula.
3. **Nenhum número sem fonte.** O componente que exibe valores exige `origem`, e o build quebra sem
   ela. Toda exibição traz a fonte nomeada, o link oficial, a data da coleta, a cópia arquivada e o sha256.
4. **O que coletamos não some.** Bruto byte a byte (WARC), carimbo de tempo e cópias em
   instituições independentes. O que a prefeitura tirar do portal continua no site, marcado como removido.
5. **Honestidade nos dois sentidos.** Ao lado dos "sinais de atenção" está sempre "o que está em
   ordem". Um sinal é um convite a verificar, não uma acusação.
6. **Conferência antes de publicar.** A nossa soma é comparada com o balancete oficial, e as
   divergências ficam públicas.
7. **Coleta educada.** Sequencial, 1 req/s, 60 s na API, de madrugada.

## Como funciona

Toda atualização segue o mesmo processo linear, agendada ou à mão:

```
1 coletar → 2 arquivar → 3 normalizar → 4 comparar → 5 conferir → 6 analisar → 7 revisar → 8 publicar
```

- A prova (etapa 2) é guardada antes de qualquer revisão.
- Cada coleta abre um Pull Request cujo corpo é o relatório de revisão, e a Vercel gera a prévia.
  Fazer o merge é publicar. Quando os portões automáticos passam (testes, privacidade, conferência,
  nenhuma remoção, nenhuma queda), o merge é automático.
- `reprocessar` refaz as etapas 3 a 8 a partir dos brutos arquivados, sem tocar na prefeitura.

Detalhes em [arquitetura.md](arquitetura.md).

## Comandos

```bash
npm run municipio -- erechim atualizar --escopo incremental       # o do dia a dia
npm run municipio -- erechim atualizar --escopo abertos           # semanal: todo empenho com saldo
npm run municipio -- erechim atualizar --escopo completo --ano 2025
npm run municipio -- erechim atualizar --escopo periodo --de 01/03/2025 --ate 31/03/2025
npm run municipio -- erechim atualizar --escopo reprocessar       # sem rede, a partir dos WARC
npm run municipio -- erechim retomar <id> [--desde normalizar]
npm run municipio -- erechim verificar [<id>]                     # sha256 dos WARC e o carimbo
npm run test:municipios
```

Opções: `--limite N` (só N detalhes, para testar) e `--prazo N` (para de pedir detalhes depois de N minutos).
Saída: `0` portões verdes, `2` precisa de revisão humana, `1` erro.

Ritmo medido em 22/10/2026: cerca de 2,3 s por empenho detalhado (duas requisições a 1 por segundo).
Um ano completo (cerca de 20 mil empenhos) leva perto de 13 h e ocupa ~0,8 GB de WARC comprimido (cerca de 42 KB por empenho: a página oficial e a expansão do detalhe). No B2 isso custa centavos de dólar por mês. Com `--prazo`, a carga se completa em
algumas execuções incrementais seguidas.

## Para ligar a automação (passos manuais, uma vez)

1. **Backblaze B2**: bucket com **Object Lock** e retenção padrão (ex.: 10 anos). Secrets do repositório:
   `B2_KEY_ID`, `B2_APPLICATION_KEY`, `B2_BUCKET`, `B2_ENDPOINT` (ex.: `https://s3.us-west-004.backblazeb2.com`).
   Sem eles, o workflow se recusa a coletar.
2. **Internet Archive**: conta e chaves S3 (https://archive.org/account/s3.php) em `IA_ACCESS_KEY` e `IA_SECRET_KEY`.
3. **Zenodo**: em https://zenodo.org/account/settings/github/, ligar o repositório. Cada Release mensal ganha um DOI.
4. **Espelho** (opcional): `ESPELHO_URL` com a URL autenticada de um repositório no Codeberg ou GitLab.
5. **Ligar as agendas**: variável do repositório `MUNICIPIOS_AGENDA=ativa`. Até lá, só o disparo manual roda.
6. **Brutos das telas no pacote público**: variável `MUNICIPIOS_PUBLICAR_BRUTOS=sim`. Decisão pendente, ver o diário.

## Documentos

| Arquivo | Conteúdo |
|---|---|
| [arquitetura.md](arquitetura.md) | Camadas, contrato da fonte, esquema canônico, como acrescentar uma cidade |
| [fontes/system-sys523.md](fontes/system-sys523.md) | Mapa técnico do portal System (Erechim): endpoints, parâmetros, armadilhas |
| [erechim/diario.md](erechim/diario.md) | Diário datado: coletas, conferências, achados e decisões |
| [erechim/sinais.md](erechim/sinais.md) | Catálogo de sinais e de "o que está em ordem": regra, base legal, limites |

## Base legal da republicação

CF art. 5º, IV, IX e XIV (liberdade de expressão e acesso à informação) e art. 37 (publicidade);
Lei 12.527/2011 (LAI), art. 8º; LC 131/2009 (transparência em tempo real). O dever de guardar
documentos públicos está na Lei 8.159/1991, art. 25.

## Licença

Código sob MIT, análise e textos sob CC BY 4.0, como no Mercado. Os dados são públicos por lei.
