# Project structure

This repo uses a **root-based** Next.js layout (no `src/`). This doc describes **durable placement patterns** for new code.

Internal imports use the **`@/*`** alias (mapped to the repo root). See [`tsconfig.json`](../../tsconfig.json).

## Target shape

Add folders when they earn their keep. Avoid creating empty scaffolding “just because.”

### `app/` — URLs, layouts, route composition

- Owns routing, layouts, and page-level composition.
- Pages and layouts: check auth, call `lib/queries/*`, and pass the results to components as props. No Prisma, no business rules.
- Route-local code is colocated in the **deepest route folder that uses it**:
  - `app/<route>/_components/*`: UI used only by that route subtree
  - `app/<route>/_hooks/*`: client hooks used only by that route subtree
  - `app/<route>/_context/*`: route-local context/providers
- Code used by two sibling routes moves up to their closest shared parent's `_components/`, not to `components/`.
- Non-UI helpers for one route (formatting a label, building a URL) may sit next to the component that uses them, with a test (see `app/server-info/_components/event-schedule-label.ts`). Move them to `lib/` when a second route needs them.

### `components/` — shared UI

Reusable UI not owned by a single route:

- `components/ui/*`: low-level UI primitives (shadcn-style). Changing them requires a [design-system.md](./design-system.md) update.
- `components/*`: composed shared components (header, footer, item cards, pagination, etc.). A component with several files gets a folder (`components/header/`).

Rules:

- Used by **two or more routes** → `components/`. Used by one route subtree → `app/<route>/_components`.
- Shared components get data through props. They don't call `lib/queries/*` or `auth()` themselves.

### `hooks/` — shared client hooks

Client hooks used by more than one route (`use-media-query.ts`). Files start with `use-` and must export a hook. Route-only hooks go in `app/<route>/_hooks`.

### `lib/` — non-UI app logic

`lib/` is for **non-UI** code. No React components and no JSX here.

- `lib/actions/*`: server actions (mutations). See [server-patterns.md](./server-patterns.md).
- `lib/queries/*`: server-side reads.
- `lib/validation/*`: Zod schemas, one file per action.
- `lib/auth/*`: password encoding that matches the game server's JoinServer.
- `lib/errors/*`: error types shared by actions (`ActionError`).
- `lib/game/*`: MU-specific rules and binary formats, pure functions. Subfolders by topic (`characters/`, `warehouse/`, `item-decoder/`, `item-database/`, `item-icon/`).
  - `lib/game/constants/*`: fixed game facts (class ids, warehouse size) and values derived from `serverConfig`.
  - `lib/game/data/*`: synced server data. Don't hand-edit (see [database.md](./database.md)).
- `lib/types/*`: TypeScript types shared by several layers (for example query results used by both a query and client components).
- `lib/utils/*`: small helpers grouped by topic (`numbers.ts`, `dates.ts`, `pagination.ts`). A helper that needs the Next.js server runtime uses the `.server.ts` suffix (`cookies.server.ts`). `action-toast.ts` is a client helper (`"use client"`, no JSX) that toasts a server action's result.
- `lib/utils.ts`: only `cn()`. It stays at this path because shadcn's `components.json` points to it. Put new helpers in `lib/utils/*`.
- `lib/test-utils/*`: test-only helpers. Never imported by app code.

### `constants/` — app-wide constants

Static values for the website itself: brand, navigation, page sizes, cookie names, download sizes. Route-only constants stay next to the route.

Game rules and anything derived from `serverConfig` belong in `lib/game/constants/*`, not here.

### `app/api/` — route handlers

HTTP endpoints owned by this app live under `app/api/*` as Route Handlers. Today only Auth.js uses this (`app/api/auth/[...nextauth]`). Forms use server actions, not new API routes.

### `proxy.ts` — auth/route guard middleware replacement

This repo keeps middleware-like route guard logic in [`proxy.ts`](../../proxy.ts) (instead of `middleware.ts`). See [nextjs-patterns.md](./nextjs-patterns.md).

### Infrastructure (outside app code)

- `prisma/`: schema, the client singleton (`prisma.ts`), generated output (`prisma/generated/*`), TypedSQL files (`prisma/sql/*`), and the database scripts (`create-db.sql`, `seed-db.sql`)
- `docker-compose.yaml` + `db/`: local MySQL persistence for development
- `public/`: static assets (item icons in `public/images/items/<group>_<Name>/`)

## Import direction

Each layer may import from its own layer and the layers below it, never from a layer above:

1. `app/`
2. `components/` (which uses `components/ui/`), `hooks/`
3. `lib/actions/`, `lib/queries/`
4. `lib/validation/`, `lib/game/`, `lib/auth/`, `lib/errors/`
5. `lib/utils/`, `lib/types/`, `constants/`

- `lib/**`, `constants/**` and `hooks/**` never import from `@/app/*` or `@/components/*`.
- `components/**` never imports from `@/app/*` or `@/prisma/*`.
- Client components (`'use client'`) may import from `lib/queries/*` only with `import type`. Values from `lib/actions/*` are fine (server actions are designed to be imported by the client).
- `constants/*`, `lib/types/*` and `lib/utils/*` import only types from other `lib/` folders.
- Relative imports only for the same folder (`./utils`) and, inside `app/`, the parent route's private folders (`../_components/x`). Everything else uses `@/…`.

## Naming and exports

- Files and folders: kebab-case (`reset-form.tsx`, `get-rankings.ts`). Tests sit next to the file as `<name>.test.ts(x)`.
- Components: PascalCase names, one main component per file, file named after it.
- **Named exports** everywhere. `export default` only where Next.js requires it: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `template.tsx`. (`route.ts` exports named `GET`/`POST`.)
- No barrel files (`index.ts` re-exports), except a folder's public entry point (`lib/game/item-decoder/index.ts`, `components/header/index.tsx`).

## Principles

1. **Keep `app/` focused** — routes and composition, not deep business logic.
2. **Colocate when it’s truly local** — use `app/<route>/_components` for one-route UI.
3. **Promote shared code intentionally** — if a pattern repeats across routes, move UI to `components/` and logic to `lib/`.
4. **Keep `lib/` non-UI** — React components should live in `components/` or under `app/<route>/_components`.

## Existing exceptions (don't copy)

- One-route components still in `components/`: `warehouse-grid.tsx` (only market sell) and `logo.tsx` (only the header).
- Many components still use `export default`. New files use named exports; convert old ones when you touch them.
- Game rules in `constants/`: `character-rules.ts`, `resets.ts`, `events.ts` and most of `server.ts` read `serverConfig` or describe game rules, and `lib/game/characters/*` imports them back.
- `components/divider.tsx` is not used anywhere.
