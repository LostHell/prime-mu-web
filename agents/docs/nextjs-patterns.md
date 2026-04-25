# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## App and runtime

- Next.js App Router lives under `app/`.
- Runtime entrypoints are the standard Next scripts:
  - `npm run dev` → `next dev`
  - `npm run build` → `next build`
  - `npm start` → `next start`
- Next config is in [`next.config.ts`](../../next.config.ts).

## Middleware/Proxy

- We use middleware-style logic in [`proxy.ts`](../../proxy.ts).

`proxy.ts` implements route guards using `next-auth` JWT:

- Redirect unauthenticated users from `/user-panel/*` → `/login`
- Redirect authenticated users away from `/login` and `/register` → `/user-panel`
- Uses an explicit `config.matcher` for: `/user-panel/:path*`, `/login`, `/register`

When changing this logic or the matcher, make sure you don’t accidentally intercept Next internals (like `/_next/*`), and test auth flows end-to-end (login, register, user-panel navigation).
