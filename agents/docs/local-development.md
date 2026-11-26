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
- `DATA_SERVER_HOST` / `DATA_SERVER_PORT` (port default `55960`) are the DataServer that `lib/game/data-server.ts` sends the market's in-game announcements to. The DataServer accepts only the addresses in its `AllowableIpList.txt`. Unset, every announcement fails and its credits are given back.
- `SITE_URL` is the public origin (`https://example.com`). Canonical URLs, `robots.txt`, the sitemap, and Open Graph images are built from it. Set it before `npm run build` and when serving the site: `npm run build` fails without it. In `npm run dev` an unset `SITE_URL` falls back to `http://localhost:3000`.
- `RESEND_API_KEY` / `MAIL_FROM` send the password reset emails through Resend (`lib/mail/send-mail.ts`; set up in [deployment.md](./deployment.md)). Unset, `/forgot-password` answers as usual and sends nothing: the error is in the server log. Locally, a Resend test key sends only to the Resend account's own address.
- `INDEXNOW_KEY` turns on the IndexNow submission of the sitemap on every production start (see [deployment.md](./deployment.md)). Leave it empty locally.
- `LAUNCHER_FILES_DIR` is the game launcher's release folder (see [launcher.md](./launcher.md)). Locally, point it at the game client's `build\publish\out` (or an empty folder and upload into it). When it is unset or has no launcher, the `/downloads` buttons stay disabled.
- `LAUNCHER_UPLOAD_TOKEN` and `LAUNCHER_PUBLIC_KEY` turn on the release upload from the client's `publish.cmd --upload`.
- Testing from another device on your network: add its IP to `allowedDevOrigins` in [`next.config.ts`](../../next.config.ts).
