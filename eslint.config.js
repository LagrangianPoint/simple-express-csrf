import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["dist/**"],
  },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser }
  },
  tseslint.configs.recommended,
  {
    // 1. Target your test directory specifically
    files: ["test/**/*.ts", "test/**/*.js"],
    rules: {
      "@typescript-eslint/no-unused-expressions": "off"
    },
    languageOptions: {
      globals: {
        ...globals.mocha, // 2. Enable Mocha globals (describe, it, etc.)
      },
    },
  },
]);
