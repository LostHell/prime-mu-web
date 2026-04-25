# Local development

## Prerequisites

- Use the Node version in [`.nvmrc`](../../.nvmrc) at the repo root (see team docs for nvm setup if needed).

## Install and run

```sh
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts worth distinguishing

| Script | Purpose |
| ------ | ------- |
| `npm run dev` | Next dev server (`next dev`). |
| `npm run build` | Production build (`next build`). |
| `npm start` | Run production build |

## Environment

- Local env vars may live in [`.env`](../../.env). Do not commit secrets; follow team standards for required keys.
