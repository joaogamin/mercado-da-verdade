// Gera public/dados/produtos.csv e .json a partir de src/data/produtos.ts.
// Roda no prebuild para que a base publicada nunca divirja da que o site usa.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const fonte = readFileSync("src/data/produtos.ts", "utf8");
const re = /\{ n: "([^"]*)", e: "([^"]*)", en: "([^"]*)", es: "([^"]*)", b: (-?[\d.]+), l: (-?[\d.]+), a: (-?[\d.]+) \}/g;

const linhas = [...fonte.matchAll(re)].map((m) => ({
  produto_pt: m[1],
  produto_en: m[3],
  produto_es: m[4],
  var_2019_2022_pct: Number(m[5]),
  var_2023_2026_pct: Number(m[6]),
  acumulado_vs_jan2019_pct: Number(m[7]),
}));

if (linhas.length === 0) throw new Error("Nenhum produto encontrado — o formato de produtos.ts mudou?");

mkdirSync("public/dados", { recursive: true });

const cols = Object.keys(linhas[0]);
const esc = (v) => (typeof v === "string" && /[",;\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : String(v));
// BOM para o Excel abrir com acentuacao correta
const csv = "\uFEFF" + [cols.join(","), ...linhas.map((l) => cols.map((c) => esc(l[c])).join(","))].join("\r\n");
writeFileSync("public/dados/produtos.csv", csv, "utf8");

writeFileSync(
  "public/dados/produtos.json",
  JSON.stringify(
    {
      fonte: "IPCA/IBGE, via a tabela publicada em mercadodamentira.com.br (set/2026)",
      arquivo: "https://web.archive.org/web/20260909203458/https://mercadodamentira.com.br/",
      nota: "acumulado_vs_jan2019_pct = ((1 + var_2019_2022/100) * (1 + var_2023_2026/100) - 1) * 100",
      gerado_em: new Date().toISOString().slice(0, 10),
      produtos: linhas,
    },
    null,
    2,
  ),
  "utf8",
);

console.log(`dados: ${linhas.length} produtos -> public/dados/produtos.{csv,json}`);
