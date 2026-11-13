# The game launcher

The game client's launcher (its source and plan: `docs/LAUNCHER.md` of the client) reads everything from this site. Its addresses and JSON are a contract with launchers already installed on players' machines: add fields, never rename or remove one (types in `lib/types/launcher.ts`).

## Endpoints

| Address                                      | Handler                                           | What                                                                                        |
| -------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `GET /api/launcher/status`                   | `app/api/launcher/status/route.ts`                | `{ online, max, servers: [{ name, online, players }] }` from `getServerInfo`                |
| `GET /api/launcher/news`                     | `app/api/launcher/news/route.ts`                  | `{ news: [{ date, title, author, url }] }` from `constants/news.ts`; `url` is `/#news-<id>` |
| `GET /patches/manifest.json`, `manifest.sig` | `app/patches/[...path]/route.ts`                  | the latest release, never cached                                                            |
| `GET /patches/chunks/<sha256>`               | same                                              | a zstd chunk, cached for good (a name never changes content)                                |
| `GET /downloads/launcher/<system>/<file>`    | `app/downloads/launcher/[system]/[file]/route.ts` | `windows/launcher.exe`, `macos/MU.zip`: the `/downloads` buttons                            |

The launcher opens only links on its own site address (`SITE_URL` in the client's `update/UpdateServer.h`): the news `url`s must be this site's.

## Settings

All four are environment variables of the site (Coolify: the app → Environment Variables; locally `.env`, see `.env.template`). The `LAUNCHER_*` ones are read at run time only (Coolify: runtime, not build time); `SITE_URL` is needed at both.

- `SITE_URL`: the site's public origin, e.g. `https://example.com`. The news `url`s are built from it, so it must be the same origin as `SITE_URL` in the client's `update/UpdateServer.h` (there with a trailing slash, `https://example.com/`); unset, they point at `http://localhost:3000` and the launcher will not open them.
- `LAUNCHER_FILES_DIR`: the release folder below, e.g. `/data/launcher`. Unset: no updates and no launcher to download.
- `LAUNCHER_UPLOAD_TOKEN`: the upload's secret, e.g. made with `openssl rand -hex 32`; the same text as the publisher's `upload-token.txt`. Unset: the upload answers 404.
- `LAUNCHER_PUBLIC_KEY`: the publisher's public key, 64 hex characters, the content of `publisher-public.key`.

## The release folder (`LAUNCHER_FILES_DIR`)

```
patches/manifest.json, manifest.sig    the release and its Ed25519 signature (hex)
patches/chunks/<sha256>                the chunks, up to 8 MB unpacked, named by their unpacked SHA-256
launcher/windows/launcher.exe          the downloads page's launchers
launcher/macos/MU.zip
```

- In production it is a **Docker volume**, not part of the image: every deploy builds the image again, and `public/` is fixed at build time. In Coolify: the app → Storages → Add → Volume Mount, a name (e.g. `prime-mu-launcher`) and the destination path `/data/launcher`; then `LAUNCHER_FILES_DIR=/data/launcher`. The volume stays through redeploys and restarts; back it up with the server.
- Only the paths in `lib/launcher/release-paths.ts` are ever served or written (no user-given path reaches `fs`).
- Old chunks are never deleted by the site: a release only adds the chunks it lacks.

## The release upload (`publish.cmd --upload` of the client)

`Authorization: Bearer <LAUNCHER_UPLOAD_TOKEN>`; without the token set, these answer 404. In this order:

1. `POST /api/launcher/releases/chunks` `{ chunks: [...] }` → `{ missing: [...] }`.
2. `PUT /api/launcher/releases/chunks/<sha256>` with each missing chunk's packed bytes. Kept only when it unpacks (at most 8 MB) to bytes of that SHA-256.
3. `PUT /api/launcher/releases/manifest` `{ manifest: <base64 of the exact bytes>, signature: <manifest.sig text> }`. Taken only when `LAUNCHER_PUBLIC_KEY` signed it and every chunk it names is there; from then on every launcher updates to it.
4. `PUT /api/launcher/releases/launcher/<system>` with the launcher. Taken only when it is the published manifest's launcher of that system.

Where `LAUNCHER_UPLOAD_TOKEN` and `LAUNCHER_PUBLIC_KEY` come from (the publisher's `%USERPROFILE%\.mu-publish\` folder), what to back up and what can never be undone: the game server repository's root `CLAUDE.md`.

Each file is written under a temporary name and renamed into place, so a reader never sees half a file. The signature check is the real protection: a launcher refuses a manifest the publisher's key did not sign, whoever uploaded it.

Tests: `lib/launcher/*.test.ts`, `app/patches/[...path]/route.test.ts`, `app/api/launcher/**/route.test.ts` (node environment, a temporary release folder from `lib/test-utils/launcher-release.ts`).
