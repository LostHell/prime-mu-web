# Agent instructions

Black MU is the website for a MU Online 0.97K private server. It reads and writes the **game server's own MySQL database**, which the running game server uses at the same time.

- Node: version in [`.nvmrc`](.nvmrc) (v24). Package manager: **npm**.
- Next.js 16 (App Router), React 19, Prisma 7, Auth.js v5, Zod 4, Tailwind 4. These versions differ from most training data: read `node_modules/next/dist/docs/` before using a Next.js API you are not sure about.
- Before handing work over, run: `npm run lint`, `npm run format:check`, `npx tsc --noEmit`, `npm test`. There is no CI, so nothing else runs them.

## Hard boundaries

- **Never** run `prisma migrate`, `prisma db push`, or any DDL against the game database. The game server owns the schema. See [database.md](agents/docs/database.md).
- **Never** hand-edit generated or synced files: `prisma/generated/**`, `lib/game/data/server-config.json`, `lib/game/data/Item.txt`.
- **Never** write to the game database from a server action without the checks in [server-patterns.md](agents/docs/server-patterns.md) (auth, validation, offline check, conditional write).
- **Never** disable a lint rule (`eslint-disable`) to get a change through. Fix the code, or the token, instead.

For **how to extend or refactor** these agent docs, read [agents/docs/docs-maintenance.md](agents/docs/docs-maintenance.md).

## More documentation

| Document                                                 | Purpose                                                                                            | When to read                                                                       |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [docs-maintenance.md](agents/docs/docs-maintenance.md)   | Rules for splitting and maintaining `AGENTS.md` and agent docs.                                    | Editing or adding agent-facing documentation.                                      |
| [local-development.md](agents/docs/local-development.md) | Install, dev vs server scripts, env files.                                                         | Running or debugging the app locally.                                              |
| [testing-patterns.md](agents/docs/testing-patterns.md)   | Jest & React Testing Library, mocking, interaction helpers, where tests live.                      | Writing or running tests.                                                          |
| [code-quality.md](agents/docs/code-quality.md)           | ESLint, Prettier, TypeScript, lint/format commands.                                                | Linting and formatting.                                                            |
| [nextjs-patterns.md](agents/docs/nextjs-patterns.md)     | NextJS, App Router, auth guard layers and proxy.ts.                                                | NextJS related docs, proxy (middleware), protecting routes.                        |
| [project-structure.md](agents/docs/project-structure.md) | Placement rules, import direction between folders, naming and export conventions.                  | New features, new folders, or refactors that affect where code lives.              |
| [server-patterns.md](agents/docs/server-patterns.md)     | Server actions, queries, validation, errors and concurrency rules for the shared game database.    | Any change in `lib/actions`, `lib/queries`, `lib/validation`, or DB access.        |
| [design-system.md](agents/docs/design-system.md)         | Tokens, components, lint guardrail, keep-in-sync rule.                                             | Any UI work; **required** when changing `app/globals.css` or `components/ui/*`.    |
| [react-patterns.md](agents/docs/react-patterns.md)       | RSC vs `'use client'`, SSR-safe rendering, number formatting, cautious `useEffect`, keys, imports. | Building or refactoring React UI, hooks, browser-only code, lists, or root layout. |
| [database.md](agents/docs/database.md)                   | Who owns the schema, local MySQL via Docker Compose, Prisma scripts, synced server data.           | Running the DB locally, debugging DB issues, or using Prisma.                      |

**Load only the doc(s) relevant to your task.**
