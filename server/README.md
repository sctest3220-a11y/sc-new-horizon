# Go API server

Fiber v3 HTTP API backed by Postgres. Scaffold only: health checks and a migration baseline, no app endpoints or tables yet.

## Run

With Docker, from the repo root:

```bash
cp .env.example .env   # then set POSTGRES_PASSWORD
docker compose up --build
curl localhost:8080/readyz
```

Without Docker for the API (Postgres still from compose):

```bash
docker compose up -d db
cd server && DATABASE_URL='postgres://horizon:<password>@localhost:5432/horizon?sslmode=disable' go run ./cmd/api
```

## Endpoints

| Route | Meaning |
|---|---|
| `GET /healthz` | Process is up (200). |
| `GET /readyz` | Database answers a ping (200), else 503. |

## Environment

| Variable | Default | |
|---|---|---|
| `DATABASE_URL` | required | Postgres connection string. |
| `PORT` | `8080` | |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated; `*` is rejected. |
| `MIGRATE_ON_START` | `true` | Apply pending migrations at startup (guarded by an advisory lock). |

## Migrations

[goose](https://github.com/pressly/goose) SQL files in `internal/db/migrations/`, embedded into the binary. Add the next one as `00002_<name>.sql` with `-- +goose Up` and `-- +goose Down` sections; it runs on the next start.

## Layout

- `cmd/api`: entry point, graceful shutdown on SIGINT/SIGTERM
- `internal/config`: env parsing and validation
- `internal/db`: connection pool and migrations
- `internal/http`: Fiber app, middleware (recover, request ID, logger, CORS) and routes
