# Code quality

## Commands

| Command                | What it does                                             |
| ---------------------- | -------------------------------------------------------- |
| `npm run lint`         | ESLint over the repo (`eslint .`) using our flat config. |
| `npm run lint:fix`     | ESLint autofix (`eslint --fix`).                         |
| `npm run format:check` | Checks formatting with Prettier (`prettier --check .`).  |
| `npm run format:fix`   | Formats with Prettier (`prettier --write .`).            |
| `npx tsc --noEmit`     | Type-checks the whole repo (`strict` is on).             |

Before handing work over, run all four checks: `npm run lint`, `npm run format:check`, `npx tsc --noEmit`, `npm test`. There is no CI or pre-commit hook, so nothing runs them for you. A check that was already failing before your change still has to be reported, not ignored.

## ESLint

- Flat config: [`eslint.config.mjs`](../../eslint.config.mjs): `next/core-web-vitals`, `next/typescript`, Prettier, and the design-system rule (see [design-system.md](./design-system.md#lint-guardrail)).
- Don't add `eslint-disable` comments. If a rule is wrong for the repo, change the config in its own change and say why.
- `react-hooks` rules (from `eslint-config-next`) include the React Compiler checks, such as `react-hooks/immutability` (no writing to values returned by hooks or context).

## TypeScript

- No `any`, no `as unknown as X`. Use `unknown` and narrow it, or write the missing type.
- Use `import type` for type-only imports.
- Don't add `@ts-ignore` / `@ts-expect-error` to silence an error in app code.

## Prettier

- Config: [`prettier.config.mjs`](../../prettier.config.mjs) (Prettier defaults: double quotes, trailing commas), ignore: [`.prettierignore`](../../.prettierignore).
- Tailwind class ordering: handled by `prettier-plugin-tailwindcss` via `prettier.config.mjs`.
- Markdown is formatted too, including these agent docs.
