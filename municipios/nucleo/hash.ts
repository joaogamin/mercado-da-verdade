import { createHash } from "node:crypto";

export function sha256(dados: Uint8Array | string): string {
  return createHash("sha256").update(dados).digest("hex");
}
