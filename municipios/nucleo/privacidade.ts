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
// digito colado dos dois lados (para nao pegar pedaco de CNPJ ou de numero maior).
const CPF_EM_TEXTO = /(?<![\d.\/-])(\d{3})\.?(\d{3})\.?(\d{3})-?(\d{2})(?![\d\/-])/g;

/** Mascara qualquer CPF que apareca dentro de um texto (ex.: nome de MEI). */
export function mascararCpfsNoTexto(texto: string): { texto: string; mascarou: boolean } {
  let mascarou = false;
  const novo = texto.replace(CPF_EM_TEXTO, (_m, a: string, b: string, c: string, d: string) => {
    mascarou = true;
    return mascararCpf(a + b + c + d);
  });
  return { texto: novo, mascarou };
}

/** Usado pelo portao de privacidade: ha algo com cara de CPF completo? */
export function encontrarCpfs(texto: string): string[] {
  return [...texto.matchAll(CPF_EM_TEXTO)].map((m) => m[0]);
}
