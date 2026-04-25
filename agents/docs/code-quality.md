# Code quality

## Commands

| Command | What it does |
| ------- | ------------- |
| `npm run lint` | Runs Next.js’ ESLint (`next lint`) using our flat config. |
| `npm run lint:fix` | ESLint autofix (`eslint --fix`). |
| `npm run format:check` | Checks formatting with Prettier (`prettier --check .`). |
| `npm run format:fix` | Formats with Prettier (`prettier --write .`). |

Run `npm run lint` and `npm run format:check` before pushing when you touched JS/TS/CSS that tooling covers.

## ESLint

- Flat config: [`eslint.config.mjs`](../../eslint.config.mjs).

## Prettier

- Config: [`prettier.config.mjs`](../../prettier.config.mjs), ignore: [`.prettierignore`](../../.prettierignore).
- Tailwind class ordering: handled by `prettier-plugin-tailwindcss` via `prettier.config.mjs`.
