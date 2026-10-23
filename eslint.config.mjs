import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Paginas de municipios navegam com <a> puro, como o resto do site: o
    // site e estatico e sem componentes de cliente, entao <Link> so traria
    // JS de roteamento. A regra so dispara aqui porque os href sao literais.
    files: ["src/municipios/**", "src/app/(br)/municipios/**"],
    rules: { "@next/next/no-html-link-for-pages": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
