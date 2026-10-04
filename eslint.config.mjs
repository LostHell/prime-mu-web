import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";

// Design-system guardrail (see agents/docs/design-system.md).
// App code must use theme tokens: no hex colors and no arbitrary color or
// radius values in className / style / cn() / cva(). Primitives in
// components/ui/* are exempt because they define the token-based styling.
const RAW_STYLE =
  "/#[0-9a-fA-F]{3,8}\\b|-\\[(#|rgba?\\(|hsla?\\(|oklch\\(|color-mix\\()|rounded(-[a-z]+)?-\\[/";
const RAW_STYLE_MESSAGE =
  "Use design-system tokens (bg-card, text-gold, rounded-md, …) instead of hex colors or arbitrary color/radius values. Add a token in app/globals.css if one is missing.";
const RAW_STYLE_SCOPE =
  ":matches(JSXAttribute[name.name=/^(className|style)$/], CallExpression[callee.name=/^(cn|cva|clsx)$/])";
const rawStyleSelectors = ["Literal[value", "TemplateElement[value.raw"].map(
  (node) => ({
    selector: `${RAW_STYLE_SCOPE} ${node}=${RAW_STYLE}]`,
    message: RAW_STYLE_MESSAGE,
  }),
);

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    ignores: ["components/ui/**", "**/*.test.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": ["error", ...rawStyleSelectors],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "prisma/generated/**",
    "coverage/**",
  ]),
]);

export default eslintConfig;
