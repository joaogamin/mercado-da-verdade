import { ERECHIM } from "./erechim.ts";
import type { ConfigCidade } from "./tipos.ts";

export const CIDADES: ConfigCidade[] = [ERECHIM];

export function cidade(slug: string): ConfigCidade {
  const c = CIDADES.find((x) => x.slug === slug);
  if (!c) throw new Error(`cidade desconhecida: ${slug} (conhecidas: ${CIDADES.map((x) => x.slug).join(", ")})`);
  return c;
}
