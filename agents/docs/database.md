# Database

## Local MySQL via Docker Compose

The repo includes a local MySQL + phpMyAdmin setup in [`docker-compose.yaml`](../../docker-compose.yaml):

- **MySQL**: `mysql:8.0`
  - **Port**: `3306` (host) → `3306` (container)
  - **DB name**: `MuOnline97`
  - **Root password**: `password`
  - **Data volume**: `./db` (persisted on your machine)
- **phpMyAdmin**: `phpmyadmin`
  - **Port**: `8081` (host) → `80` (container)

Start/stop:

- `docker compose up -d`
- `docker compose down`

## App environment variables

See [`.env.template`](../../.env.template) for the expected DB settings.

For local Docker Compose, the defaults line up with:

- `DATABASE_HOST=127.0.0.1`
- `DATABASE_PORT=3306`
- `DATABASE_USER=root`
- `DATABASE_PASSWORD=password`
- `DATABASE_NAME=MuOnline97`

`DATABASE_URL` is used by the Prisma CLI; set it to the same database (example in `.env.template`).

## Prisma

Use the npm scripts:

- `npm run prisma:pull`
- `npm run prisma:generate`
