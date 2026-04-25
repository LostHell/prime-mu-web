# Project structure (guideline)

This repo uses a **root-based** Next.js layout (no `src/`). This doc describes **durable placement patterns** for new code.

Internal imports may use the **`@/*`** alias (mapped to the repo root). See [`tsconfig.json`](../../tsconfig.json).

## Target shape

Add folders when they earn their keep. Avoid creating empty scaffolding “just because.”

### `app/` — URLs, layouts, route composition

- Owns routing, layouts, and page-level composition.
- Route-local code can be colocated under a route subtree:
  - `app/<route>/_components/*` for UI used only by that route
  - `app/<route>/_context/*` for route-local context/providers when needed
- Keep `app/` pages/layouts relatively thin by pushing logic into `lib/` and shared UI into `components/`.

### `components/` — shared UI

Reusable UI not owned by a single route:

- `components/ui/*`: low-level UI primitives (shadcn-style)
- `components/*`: composed shared components (header, footer, cards, tables, etc.)

Rule of thumb:

- If it’s used by **multiple routes**, it belongs in `components/`.
- If it’s only used by a single route subtree, keep it under `app/<route>/_components`.

### `lib/` — non-UI app logic

`lib/` is for **non-UI, reusable code** (server actions, queries, validation, and pure utilities):

- `lib/actions/*`: mutations / server actions
- `lib/queries/*`: read paths (data fetching)
- `lib/validation/*`: zod schemas + input validation
- `lib/game/*`: MU-specific parsing/decoding/data helpers
- `lib/types/*`: shared TypeScript types used across the app
- `lib/utils.ts`: small cross-cutting helpers

### `constants/` — app-wide constants

Static app-wide constants (brand, navigation, events, etc.). If something is route-only, colocate it with the route instead.

### `app/api/` — route handlers

HTTP endpoints owned by this app live under `app/api/*` as Route Handlers.

### `proxy.ts` — auth/route guard middleware replacement

This repo keeps middleware-like route guard logic in [`proxy.ts`](../../proxy.ts) (instead of `middleware.ts`).
If you change auth routing behavior, update `proxy.ts` and its `config.matcher` accordingly.

### Infrastructure (outside app code)

- `prisma/`: Prisma schema + generated output (`prisma/generated/*`)
- `docker-compose.yaml` + `db/`: local MySQL persistence for development
- `public/`: static assets

## Principles

1. **Keep `app/` focused** — routes and composition, not deep business logic.
2. **Colocate when it’s truly local** — use `app/<route>/_components` for one-route UI.
3. **Promote shared code intentionally** — if a pattern repeats across routes, move UI to `components/` and logic to `lib/`.
4. **Keep `lib/` non-UI** — React components should live in `components/` or under `app/<route>/_components`.
