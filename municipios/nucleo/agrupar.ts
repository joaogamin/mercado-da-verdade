/** Agrupa em listas por chave, sem copiar a lista a cada item. */
export function agruparPor<T>(itens: Iterable<T>, chave: (x: T) => string): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const x of itens) {
    const k = chave(x);
    const l = m.get(k);
    if (l) l.push(x);
    else m.set(k, [x]);
  }
  return m;
}
