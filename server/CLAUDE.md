# CLAUDE.md — Go API (`server/`)

Conventions for the Go API and its Postgres schema. **Every command in this file
runs from this directory, except `docker compose`, which runs from the
repository root.**

The repo-root `CLAUDE.md` still applies and is not repeated here, in
particular:

- the web app and the API change together;
- schema changes are new migrations;
- no user-data endpoint is hosted without auth.

This file is the operational index: the rule, where the code goes, and what pins
it. The reasoning and the worked example are in [`docs/`](docs/README.md).
Read [`docs/README.md`](docs/README.md) first. Setup for humans is in
[`README.md`](README.md).

## Stack

Go 1.27 · **Fiber v3.6** on fasthttp · Postgres 17 through `pgx/v5` `pgxpool`
· goose v3 migrations, embedded and run at startup · `log/slog` JSON logs ·
`go test` with hand-written fakes · Docker (distroless, non-root).

These are Fiber **v3** APIs. `fiber.Ctx` is an interface, so handlers are
`func(c fiber.Ctx) error`, and middleware is under `fiber/v3/middleware/...`.
v2 examples (`*fiber.Ctx`) do not compile.

## Non-negotiables

Each names the test that pins it. A failure there is the invariant breaking, not
a flaky test.

1. **Configuration is read once, in `internal/config`, and validated before
   anything starts.** Handlers and packages receive values; they never call
   `os.Getenv`. A missing `DATABASE_URL` or a bad `PORT` then fails at boot with
   a clear message, not on the first request in front of an audience.
   (`internal/config/config_test.go`, `TestLoadRejectsInvalid`,
   `TestLoadDefaults`, `TestLoadOverrides`)
2. **CORS is an explicit allowlist; `*` is rejected.** A wildcard would let any
   website call the API with a visitor's browser.
   (`TestLoadRejectsInvalid` / `"wildcard origin"`;
   `internal/http/health_test.go`, `TestCORSAllowsConfiguredOriginOnly`)
3. **`/healthz` never touches the database; `/readyz` does.** A platform that
   restarts on a failed liveness check would otherwise restart a healthy process
   every time Postgres blips. (`TestHealthRoutes` / `"liveness ignores
   database"`, `"not ready when database is down"`)
4. **Schema changes are new files in `internal/db/migrations/`, numbered
   `000NN_<name>.sql`, with `-- +goose Up` and `-- +goose Down`.** An applied
   migration is never edited, because goose will not run it again on a database
   that has it. Migrations run at startup under a Postgres advisory lock, so two
   instances never migrate at once. (`internal/db/db_test.go`,
   `TestConnectAndMigrate`, which also proves a second run is a no-op; gated on
   `TEST_DATABASE_URL`)
5. **SQL uses `pgx` placeholders (`$1`, `$2`), never string formatting.**
   Formatting user input into SQL is injection. No test pins this yet.
6. **Every request reads its own context and every outbound call has a
   timeout.** Pass `c.Context()` to `pgx`, and wrap calls the way
   `readinessTimeout` does in `internal/http/health.go`. One hung query must not
   hold a connection and a goroutine forever. No test pins this beyond
   `/readyz`.
7. **An endpoint that reads or writes user data is not hosted until the API
   authenticates the user and scopes the query to them.** There is no auth yet
   (`docs/SCOPE.md`, open question 4). Building the endpoint locally is fine.
   The `WHERE user_id = $1` belongs in the SQL, not in a later filter. No test
   pins this yet.
8. **Request bodies are capped (1 MB, `BodyLimit` in `internal/http/router.go`)
   and parsed into typed structs, then validated, before use.** Raise the limit
   only for a specific route that needs more. No test pins this yet.
9. **Every package keeps at least 90% statement coverage, and every line added
   or changed since `03275d6` runs under test.** Tests that need Postgres call
   `testDatabaseURL(t)`, which skips them without `TEST_DATABASE_URL`. Code that
   truly cannot run in a test, such as `func main()` with its `os.Exit`, is
   listed with a reason in the repo-root `coverage-exclusions.json`. The full
   rules are in `docs/TESTING.md`. Untested code here is code that first runs in
   front of the demo audience. (`pnpm test:coverage`, run by
   `.github/workflows/test.yml`)

## The request path

`internal/http/router.go` builds the app with this middleware order:

1. `recover`: first, so a panic anywhere below becomes a 500 instead of killing
   the process.
2. `requestid`: so every log line for a request can be correlated.
3. `logger`.
4. `cors`: answers preflight `OPTIONS` itself and allows only `CORS_ORIGINS`.

Nothing authenticates requests. Every route below is public, so a new route is
public too until auth exists. That is why rule 7 exists.

| Method / Path | Handler / File | Guarded by |
| --- | --- | --- |
| `GET /healthz` | `registerHealthRoutes` in `internal/http/health.go` | Nothing (liveness probe, no data) |
| `GET /readyz` | `registerHealthRoutes` in `internal/http/health.go` | Nothing (readiness probe, returns only ok/unavailable) |

Startup in `cmd/api/main.go`:

1. Load and validate the config.
2. Connect the pool and ping it, with a 10 s timeout.
3. Run migrations if `MIGRATE_ON_START` is set.
4. Serve.

On SIGINT or SIGTERM, it stops accepting requests and drains for up to 10 s.

## Where does this code go?

| Adding… | Path |
| --- | --- |
| A route and its handler | `internal/http/<resource>.go` with a `register<Resource>Routes(app, deps)` function, called from `NewApp` in `internal/http/router.go` |
| A dependency a handler needs (store, clock) | A narrow interface next to the handler (like `Pinger` in `internal/http/health.go`), plus a field on `Dependencies` in `internal/http/router.go` |
| SQL queries for a resource | `internal/store/<resource>.go`, a type wrapping `*pgxpool.Pool`. Create the package with the first resource. |
| A schema change | `internal/db/migrations/000NN_<name>.sql` (next free number) |
| A configuration value | A field on `Config` in `internal/config/config.go`, parsed and validated in `load`, plus a line in the repo-root `.env.example` and in `docker-compose.yml` |
| Handler tests | `internal/http/<resource>_test.go`, using `app.Test` and a fake for the dependency |
| Store and migration tests | The package's `_test.go`, gated with a `testDatabaseURL(t)` helper like the one in `internal/db/db_test.go` |
| An exclusion from coverage | The repo-root `coverage-exclusions.json`: an anchor line and a reason. Only for code that cannot run in a test process. |
| Wiring at startup | `cmd/api/main.go`, and nothing else goes there |

Only `cmd/api` is `package main`. Everything else is under `internal/` so
nothing outside this module can import it.

## Definition of done

From this directory:

```bash
gofmt -l .
go vet ./...
go test -race ./...
docker build -t sc-new-horizon-api:dev .
```

`gofmt -l .` must print nothing. Then, from the repository root, run the
database tests and the coverage rules against a throwaway Postgres. The
commands are in `docs/TESTING.md`; the last one is:

```bash
TEST_DATABASE_URL='postgres://postgres:test@localhost:55432/horizon_test?sslmode=disable' pnpm test:coverage
```

Then run the real thing:

```bash
docker compose up --build -d
curl -s localhost:8080/readyz
docker compose logs api
```

The log must show `"database schema up to date"` with the new version.

What a green run can hide:

- **`go test` without `TEST_DATABASE_URL` skips every database test** and
  still reports `ok`. Look for `SKIP` in `go test -v`, or run
  `pnpm test:coverage`, which fails when the database code went untested.
- **`server.yml` runs only on `server/**`, `docker-compose.yml` and the
  workflow file.** `test.yml` runs on every change.

## Known sharp edges

| Symptom | Cause and fix |
| --- | --- |
| `go get` / `go mod download` fails with `x509: OSStatus -26276` | The sandbox blocks the macOS certificate check. Run that command outside the sandbox. |
| `docker compose up` says "Cannot connect to the Docker daemon" although Docker Desktop is open | The Docker engine is not running, only the Desktop UI is. Start the engine (or `docker desktop restart`) and wait for `docker version` to show a server. |
| `bind: address already in use` on 8080 | Another local process holds the port. Set `API_PORT` in `.env` (e.g. `18080`), or stop the other process. |
| The API exits at boot with `POSTGRES_PASSWORD` or `DATABASE_URL is required` | `.env` is missing or incomplete. Copy `.env.example` to `.env` and set the password. You cannot read `.env` yourself; check by booting. |
| A browser call from the app fails with a CORS error | The app's origin is not in `CORS_ORIGINS`. The app is pinned to `http://localhost:3000`; add the origin, never `*`. |
| A migration change has no effect locally | goose already recorded that version. Write a new migration. For a throwaway local database only, `docker compose down -v` drops the `pgdata` volume. |
| Fiber code from a tutorial does not compile | It is v2. Use `fiber.Ctx` (interface, no pointer) and the `fiber/v3/middleware/...` imports. |
