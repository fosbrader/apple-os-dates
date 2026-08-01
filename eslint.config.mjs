import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    // This file is a frozen research-audit artifact. Keep its recorded query
    // byte-for-byte stable so the packet's published integrity hashes remain valid.
    files: [
      "research-handoffs/beta-chronology-gap/macos-point-15-26-followup/query-production.ts",
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "tmp/**",
    "next-env.d.ts",
  ]),
]);
