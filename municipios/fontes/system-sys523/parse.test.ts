import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { lerApiEmpenhos, lerBalanceteOrgaos, lerDetalhe, lerListaEmpenhos, decodificarConta } from "./parse.ts";
import { lerTela, campo, totalDeRegistros } from "./jsf.ts";
import { encontrarCpfs } from "../../nucleo/privacidade.ts";

const fx = (nome: string) => new Uint8Array(readFileSync(join(import.meta.dirname, "fixtures", nome)));
const fxTexto = (nome: string) => readFileSync(join(import.meta.dirname, "fixtures", nome), "utf8");
const BASE = "https://www.erechim.rs.gov.br";

test("tela de empenhos: descobre campos, botao e exportacao sem depender de j_idt", () => {
  const t = lerTela(fxTexto("empenhos.get.html"));
  assert.ok(t.viewState.length > 10);
  assert.match(campo(t, "Ano"), /_input$/);
  assert.equal(campo(t, "Entidade"), "form1:empresa_input");
  assert.match(campo(t, "Período", 1), /cal_input$/);
  assert.match(campo(t, "Período", 2), /cal_input$/);
  assert.equal(t.botaoPesquisar.id, "form1:btnpesquisar:btnPesquisar");
  assert.match(t.botaoPesquisar.execute, /form1:parametros/);
  assert.ok(t.exportar.get("CSV"));
  assert.ok(t.atualizadoEm);
});

test("tela do balancete por orgao", () => {
  const t = lerTela(fxTexto("bal-orgao.get.html"));
  assert.match(campo(t, "Ano"), /sysSapiAno_input$/);
  assert.match(campo(t, "Mês"), /_input$/);
  assert.ok(t.exportar.get("CSV"));
});

test("pesquisa devolve o total de registros", () => {
  assert.equal(totalDeRegistros(fxTexto("empenhos.pesquisa.xml")), 29);
});

test("lista de empenhos: 29 linhas, empenhado confere e a divergencia do rodape fica registrada", () => {
  const { valor, avisos, divergencias } = lerListaEmpenhos(fx("empenhos-2025-03-10.csv"));
  assert.equal(valor.itens.length, 29);
  assert.deepEqual(avisos, []);
  assert.equal(valor.total.empenhado, 43299955);
  // O rodape do proprio portal nao e a soma das linhas no liquidado e no pago:
  // fica registrado como divergencia (ver diario de 22/10/2026).
  assert.equal(divergencias!.length, 2);
  assert.match(divergencias![0], /^liquidado: soma das linhas R\$\s402\.442,89 × Total Geral do portal R\$\s463\.556,21$/);
  assert.match(divergencias![1], /^pago: soma das linhas R\$\s402\.442,89 × Total Geral do portal R\$\s463\.556,21$/);
  const folha = valor.itens.find((i) => i.numero === 3509)!;
  assert.equal(folha.credor.tipo, "folha");
  assert.equal(folha.data, "2025-03-10");
  const mei = valor.itens.find((i) => i.numero === 3515)!;
  assert.equal(mei.credor.tipo, "PJ");
  assert.equal(mei.credor.nome, "JOÃO EDUARDO VINCK ***.928.160-**");
  assert.ok(valor.itens.some((i) => i.credor.tipo === "PF"));
});

test("lista: 'Pago em Restos' em branco no exercicio corrente vira zero e fica registrado; outro campo vazio e erro", () => {
  const cab = '"Empenho","Data","Credor","CNPJ/CPF","Valor Empenhado","Valor Liquidado","Valor Pago","Valor Pago em Restos"';
  const nb = String.fromCharCode(0xa0); // NBSP, como o portal usa depois do R$
  // o portal entrega ISO-8859-1
  const csv = (restos: string, pago = `R$${nb}80,00`) => new Uint8Array(Buffer.from([
    cab,
    `"2026 / 13823","27/08/2026","STARK COMÉRCIO DE FERRAMENTAS LTDA","23.621.473/0001-01","R$${nb}80,00","R$${nb}80,00","${pago}","${restos}"`,
    `"","","","Total Geral:","R$${nb}80,00","R$${nb}80,00","R$${nb}80,00","R$${nb}0,00"`,
  ].join("\n"), "latin1"));
  const { valor, avisos, divergencias } = lerListaEmpenhos(csv(""));
  assert.equal(valor.itens[0].pagoRestos, 0);
  assert.deepEqual(avisos, []);
  assert.match(divergencias!.join(), /1 linhas com "Pago em Restos" em branco/);
  assert.throws(() => lerListaEmpenhos(csv(`R$${nb}0,00`, "")), /valor monetario invalido/);
});

test("balancete por orgao de 2025: dotacao atualizada igual a inicial", () => {
  const b = lerBalanceteOrgaos(fx("bal-orgao-2025.csv"));
  assert.equal(b.linhas.length, 15);
  assert.equal(b.total.dotacaoInicial, 53500000000);
  assert.equal(b.total.dotacaoAtualizada, b.total.dotacaoInicial);
  assert.equal(b.total.empenhado, 58015975075);
  assert.equal(b.linhas.reduce((s, l) => s + l.empenhado, 0), b.total.empenhado);
});

test("API: valor em centavos e CPF nunca sai completo", () => {
  const [e] = lerApiEmpenhos(fx("api-empenhos-2025-3600.json"));
  assert.equal(e.valor, 11087440);
  assert.equal(e.documento, "04.210.265/0001-75");
  const cpfFalso = ["987", "654", "321", "00"].join("");
  const sintetico = new TextEncoder().encode(JSON.stringify([{ entidade: 1, ano: 2026, numeroEmpenho: 1, valor: 1, cpfCnpj: cpfFalso, fonteRecurso: "x", descricao: "y" }]));
  const [pf] = lerApiEmpenhos(sintetico);
  assert.equal(pf.documento, "***.654.321-**");
  assert.deepEqual(encontrarCpfs(JSON.stringify(pf)), []);
});

test("conta orcamentaria decodificada", () => {
  assert.deepEqual(decodificarConta("05.01.04.129.0005.2017.3.3.90.40.06.00.00"), {
    orgao: "05", unidade: "05.01", funcao: "04", subfuncao: "129", programa: "0005", acao: "2017",
    natureza: "3.3", elemento: "3.3.90.40", subelemento: "3.3.90.40.06",
  });
  assert.throws(() => decodificarConta("05.01"), /fora do formato/);
});

test("detalhe 2025/3600: classificacao, licitacao, contrato, liquidacoes e pagamentos", () => {
  const { valor: d, avisos } = lerDetalhe(fxTexto("detalhe-2025-3600.rowtoggle.xml"), BASE);
  assert.deepEqual(avisos, []);
  assert.equal(d.ano, 2025);
  assert.equal(d.numero, 3600);
  assert.equal(d.data, "2025-03-11");
  assert.equal(d.valor, 11087440);
  assert.equal(d.classificacao.orgao.nome, "SECRETARIA MUNICIPAL DA FAZENDA");
  assert.equal(d.classificacao.orgao.codigo, "05");
  assert.equal(d.classificacao.funcao.nome, "ADMINISTRAÇÃO");
  assert.equal(d.classificacao.elemento, "3.3.90.40");
  assert.equal(d.classificacao.descricao, "Locação de Software");
  assert.equal(d.classificacao.recurso.codigo, "1500");
  assert.equal(d.classificacao.recurso.complemento, "0 - Não se Aplica");
  assert.deepEqual(d.licitacao, { ano: 2021, numero: 837, modalidade: "Pregão Presencial (Lei 10.520)" });
  assert.equal(d.contrato?.numero, 82);
  assert.equal(d.contrato?.ano, 2022);
  assert.equal(d.contrato?.tipo, "C");
  assert.equal(d.ordemCompra, "2025/938");
  assert.equal(d.credor.documento, "04.210.265/0001-75");
  assert.match(d.especificacao, /^Empenho referente Contratação de empresa especializada/);
  assert.ok(d.liquidacoes.length >= 8);
  assert.deepEqual(d.liquidacoes[0], { data: "2025-04-04", numero: "8034", documento: "9764", valor: 1108744, estornado: 0 });
  assert.equal(d.pagamentos[0].data, "2025-04-08");
  assert.equal(d.pagamentos[0].descontos, 53220);
});

test("detalhe de pessoa fisica: CPF mascarado como o portal mostra", () => {
  const { valor: d } = lerDetalhe(fxTexto("detalhe-2026-10-pf.rowtoggle.xml"), BASE);
  assert.equal(d.credor.tipo, "PF");
  assert.equal(d.credor.documento, "***.346.140-**");
  assert.equal(d.licitacao, undefined);
});
