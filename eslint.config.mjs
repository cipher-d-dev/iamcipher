import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __dirname = dirname(fileURLToPath(import.meta.url));

// eslint-config-next 15 ships legacy (eslintrc) configs; FlatCompat adapts
// them for ESLint 9's flat config.
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  { ignores: ["node_modules/**", ".next/**", "out/**", "next-env.d.ts"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
