import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** O modulo foi executado direto (node arquivo.ts), e nao importado? */
export function ehPrincipal(url: string): boolean {
  return !!process.argv[1] && resolve(process.argv[1]) === fileURLToPath(url);
}
