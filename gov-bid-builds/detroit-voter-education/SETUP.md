# Local Development Setup

## Prerequisites

- Node.js 20+
- Docker (for Postgres)
- Colaberry GitHub access (the cloned repo is private)

## First-time setup

```bash
# 1. Install deps
npm install

# 2. Boot local Postgres
docker compose up -d

# 3. Copy and fill the env file
cp .env.example .env

# 4. Apply the schema
npm run db:migrate

# 5. Seed fake data
npm run seed

# 6. Boot the dev server
npm run dev
```

The app should be live at http://localhost:3000.

## Running tests without Docker

`npm test` runs the CoordinatorAgent unit test hermetically — it uses an in-memory repository/notifier double, not a live Postgres connection, so it passes with zero external services and zero installed dependencies (`node:test`, built into Node 20+). This is what CI/local verification should run before every commit; `db:migrate` and a real Postgres are only required to run the actual HTTP server.

## Env vars

See `.env.example`. Critical ones:

- `DATABASE_URL` — Postgres connection string
- `PORT` — HTTP port for the Express server (default 3000)
- `ADMIN_NOTIFICATION_SLA_MINUTES` — the REQ-003 acceptance threshold (15), used by the CoordinatorAgent to compute whether a notification was sent in time

## Common scripts

| Command | What it does |
|---|---|
| `npm run dev` | Boot the dev server |
| `npm test` | Run the hermetic CoordinatorAgent test (no DB required) |
| `npm run seed` | Wipe + reseed fake data |
| `npm run db:migrate` | Apply `app/db/schema.sql` to `DATABASE_URL` |
| `npm run lint` | Run linting (not yet configured) |

## If something breaks

Open a Slack thread in `#gov-contracts`. Tag `@CB System` and describe what you tried.
