// A prefeitura mascara o CPF nas telas (***.346.140-**), mas a API devolve os
// 11 digitos, e o nome empresarial de MEI carrega o CPF do titular por regra da
// Receita ("JOAO DA SILVA 12345678909"). Aqui tudo fica no padrao das telas:
// preservamos os mesmos 6 digitos centrais que o proprio portal mostra.

const SO_DIGITOS = /^\d{11}$/;

/** "02934614069" -> "***.346.140-**" (mesmo padrao do portal). */
export function mascararCpf(digitos: string): string {
  if (!SO_DIGITOS.test(digitos)) throw new Error("mascararCpf espera 11 digitos");
  return `***.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-**`;
}

/** Documento vindo da API: CPF vira mascara, CNPJ vira formatado, o resto passa. */
export function documentoPublico(doc: string): string {
  const d = doc.replace(/\D/g, "");
  if (d.length === 11) return mascararCpf(d);
  if (d.length === 14) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  return doc.trim();
}

// CPF solto em texto: 11 digitos seguidos ou no formato 000.000.000-00, sem
// letra ou digito colado dos dois lados — para nao pegar pedaco de CNPJ, de
// numero maior ou de um hash hexadecimal (sha256 com 11 digitos seguidos).
const CPF_EM_TEXTO = /(?<![\w.\/-])(\d{3})\.?(\d{3})\.?(\d{3})-?(\d{2})(?![\w\/-])/g;

/** Mascara qualquer CPF que apareca dentro de um texto (ex.: nome de MEI). */
export function mascararCpfsNoTexto(texto: string): { texto: string; mascarou: boolean } {
  let mascarou = false;
  const novo = texto.replace(CPF_EM_TEXTO, (_m, a: string, b: string, c: string, d: string) => {
    mascarou = true;
    return mascararCpf(a + b + c + d);
  });
  return { texto: novo, mascarou };
}

/** Digitos verificadores do CPF. Todo CPF real passa; um numero qualquer de 11 digitos, so 1 em 100. */
export function cpfValido(digitos: string): boolean {
  if (!SO_DIGITOS.test(digitos) || /^(\d)\1{10}$/.test(digitos)) return false;
  const n = [...digitos].map(Number);
  const dv = (k: number) => {
    let s = 0;
    for (let i = 0; i < k; i++) s += n[i] * (k + 1 - i);
    const r = (s * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return dv(9) === n[9] && dv(10) === n[10];
}

/**
 * Numero de documento fiscal (liquidacao, pagamento) publicado no detalhe. Nota
 * e fatura tem de 1 a 14 digitos; quando o numero tem a forma de um CPF valido,
 * mascaramos no padrao das telas, como no nome de MEI: na duvida, privacidade.
 */
export function documentoFiscal(publicado: string): { documento: string; mascarado: boolean } {
  const d = publicado.trim();
  const so = d.replace(/[.-]/g, "");
  const formaDeCpf = /^\d{11}$/.test(d) || /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(d);
  // fora disso, o numero fica exatamente como publicado
  return formaDeCpf && cpfValido(so) ? { documento: mascararCpf(so), mascarado: true } : { documento: publicado, mascarado: false };
}

/**
 * Usado pelo portao de privacidade: ha algum CPF completo? So conta o que passa
 * nos digitos verificadores (todo CPF real passa), para nao travar em numero de
 * fatura de 11 digitos.
 */
export function encontrarCpfs(texto: string): string[] {
  return [...texto.matchAll(CPF_EM_TEXTO)].filter((m) => cpfValido(m[1] + m[2] + m[3] + m[4])).map((m) => m[0]);
}
