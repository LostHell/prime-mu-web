# Local development

## Prerequisites

- Use the Node version in [`.nvmrc`](../../.nvmrc) at the repo root (see team docs for nvm setup if needed).
- A local database: see [database.md](./database.md) for Docker Compose and the SQL scripts.

## Install and run

```sh
npm install
cp .env.template .env   # then fill in AUTH_SECRET
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts worth distinguishing

| Script          | Purpose                          |
| --------------- | -------------------------------- |
| `npm run dev`   | Next dev server (`next dev`).    |
| `npm run build` | Production build (`next build`). |
| `npm start`     | Run production build             |

## Environment

- Local env vars live in [`.env`](../../.env), which is git-ignored. Every variable the code reads must be listed in [`.env.template`](../../.env.template) with a safe example value. Add it there in the same change that starts reading it.
- Only `NEXT_PUBLIC_*` variables reach the browser. Never put a secret in one.
- `GAME_SERVER_HOST` / `GAME_SERVER_PORT` (default `127.0.0.1:55901`) are where `lib/queries/get-server-status.ts` checks if the game server is online. Without a local game server the site shows it as offline.
- `SITE_URL` is the public origin (`https://example.com`). Canonical URLs, `robots.txt`, the sitemap, and Open Graph images are built from it. Set it before `npm run build` and when serving the site. When it is unset, those URLs use `http://localhost:3000`.
- `LAUNCHER_FILES_DIR` is the game launcher's release folder (see [launcher.md](./launcher.md)). Locally, point it at the game client's `build\publish\out` (or an empty folder and upload into it). When it is unset or has no launcher, the `/downloads` buttons stay disabled.
- `LAUNCHER_UPLOAD_TOKEN` and `LAUNCHER_PUBLIC_KEY` turn on the release upload from the client's `publish.cmd --upload`.
- Testing from another device on your network: add its IP to `allowedDevOrigins` in [`next.config.ts`](../../next.config.ts).
