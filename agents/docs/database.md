# Database

## Who owns the schema

The database is the **game server's** `MuOnline97` database (MySQL). The game server reads and writes the same tables while the site runs. The site does not own the schema:

- There are **no Prisma migrations**. `prisma/schema.prisma` is introspected from the database with `npm run prisma:pull`.
- **Never** run `prisma migrate`, `prisma db push`, or DDL (`ALTER`, `DROP`, `CREATE TABLE`) against the game database.
- A schema change starts in the server repo (LostHell/mu-online-server). Then here: update [`prisma/create-db.sql`](../../prisma/create-db.sql) to match, run `npm run prisma:pull`, then `npm run prisma:generate`, and commit the result.
- Tables the site adds for its own features (`MarketplaceListing`, `AccountDeposit`) are still created by `create-db.sql`, never by Prisma.

## Generated and synced files (do not hand-edit)

| Path                               | Comes from                                                          |
| ---------------------------------- | ------------------------------------------------------------------- |
| `prisma/generated/**`              | `npm run prisma:generate` (committed).                              |
| `lib/game/data/server-config.json` | The server repo's "Sync server data to web" workflow opens a PR.    |
| `lib/game/data/Item.txt`           | Copied from the server's `Item.txt`. Document changes in `Item.md`. |

## Typed SQL

Raw queries live in `prisma/sql/*.sql` and run through `prisma.$queryRawTyped(...)` (see `lib/queries/get-rankings.ts`). After adding or changing a `.sql` file, run `npm run prisma:generate` (it passes `--sql`). Never build SQL with string concatenation; use TypedSQL or Prisma's tagged `$queryRaw`.

## Stored procedures

`create-db.sql` defines the server's procedures (`WZ_*`, `Process*`). `WZ_GetItemSerial` commits internally: call it only through `lib/queries/get-next-item-serial.ts`, never on a transaction client.

## Local MySQL via Docker Compose

The repo includes a local MySQL + phpMyAdmin setup in [`docker-compose.yaml`](../../docker-compose.yaml):

- **MySQL**: `mysql:8.0`
  - **Port**: `3306` (host) → `3306` (container)
  - **DB name**: `MuOnline97`
  - **Root password**: `password`
  - **Data volume**: `./db` (persisted on your machine, git-ignored)
- **phpMyAdmin**: `phpmyadmin`
  - **Port**: `8081` (host) → `80` (container)

Start/stop:

- `docker compose up -d`
- `docker compose down`

Load `prisma/create-db.sql`, then `prisma/seed-db.sql`, into a fresh database (for example through phpMyAdmin). Seed account passwords are stored with the server's password encryption (see `lib/auth/password`).

## App environment variables

See [`.env.template`](../../.env.template) for the expected DB settings.

For local Docker Compose, the defaults line up with:

- `DATABASE_HOST=127.0.0.1`
- `DATABASE_PORT=3306`
- `DATABASE_USER=root`
- `DATABASE_PASSWORD=password`
- `DATABASE_NAME=MuOnline97`

`DATABASE_URL` is used by the Prisma CLI; set it to the same database (example in `.env.template`). The app itself connects through the `DATABASE_*` variables in [`prisma/prisma.ts`](../../prisma/prisma.ts).

## Prisma

- Import the client (`prisma` from `@/prisma/prisma`) only in `lib/actions/*`, `lib/queries/*` and `auth.ts`. Pages and components get data by calling a query, never Prisma directly. Import Prisma types from `@/prisma/generated/prisma/client`.
- `npm run prisma:pull`: re-introspect the schema from the database.
- `npm run prisma:generate`: regenerate the client and TypedSQL functions.
