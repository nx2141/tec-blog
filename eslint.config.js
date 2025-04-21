// eslint.config.js
import eslintPluginAstro from "eslint-plugin-astro";
import typescript from "typescript-eslint";
import react from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "public/**",
      ".astro/**",
      ".git/**",
      "src/.env.d.ts",
    ],
  },

  // .astro用ルールの明示適用（ここが最重要）
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: eslintPluginAstro.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      astro: eslintPluginAstro,
    },
    rules: {
      ...eslintPluginAstro.configs.recommended[0].rules,
      "astro/no-set-html-directive": "error",
      "astro/no-unused-vars": "warn",
    },
  },

  // TypeScript
  ...typescript.configs.recommended,

  // React
  {
    files: ["**/*.{jsx,tsx}"],
    languageOptions: {
      ecmaFeatures: { jsx: true },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    ...react.configs.flat.recommended,
  },
]);
