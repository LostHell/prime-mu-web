# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## App and runtime

- Next.js App Router lives under `app/`.
- Runtime entrypoints are the standard Next scripts:
  - `npm run dev` → `next dev`
  - `npm run build` → `next build`
  - `npm start` → `next start`
- Next config is in [`next.config.ts`](../../next.config.ts).
- `params` and `searchParams` are Promises: `await` them. Type `searchParams` with `SearchParams` from `@/lib/utils/pagination`.

## Protecting pages and data

Auth is checked in three places. Only the last two are security checks:

1. **`proxy.ts`** redirects early for a better experience. It only sees the request, so it is **not** a security boundary.
2. **Pages and layouts** under `/user-panel` call `auth()` and `redirect("/login")` when there is no session, before loading account data. Layouts don't re-run on every navigation, so a page that loads account data checks the session itself.
3. **Server actions** call `getAuthenticatedUser()` first. An action can be called without visiting the page, so it never relies on 1 or 2.

## Middleware/Proxy

- We use middleware-style logic in [`proxy.ts`](../../proxy.ts).

`proxy.ts` implements route guards using `next-auth` JWT:

- Redirect unauthenticated users from `/user-panel/*` → `/login`
- Redirect authenticated users away from `/login` and `/register` → `/user-panel`
- Uses an explicit `config.matcher` for: `/user-panel/:path*`, `/login`, `/register`

When changing this logic or the matcher, make sure you don’t accidentally intercept Next internals (like `/_next/*`), and test auth flows end-to-end (login, register, user-panel navigation).

## Caching and revalidation

- The repo sets no `dynamic`, `revalidate` or `"use cache"` options. A page renders per request only when it uses a request API (`auth()`, `cookies()`, `headers()`, `searchParams`). A page that reads the database without one of those can be prerendered once at build time and show stale data. When you add such a page, check the `next build` output (`ƒ` = per request, `○` = static) and call `await connection()` from `next/server` if it must be live.
- After a mutation, the action calls `revalidatePath` for each affected route (`"layout"` when the whole `/user-panel` tree shows the data).
- In-memory caches in a module (like `get-server-status.ts`) live per server process. Keep them short-lived and only for data that is fine to be slightly stale.
