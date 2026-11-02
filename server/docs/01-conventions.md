# 1. Conventions

Go conventions this codebase already follows. The module is small, so each one
is set by one or two files. Copying them keeps the next ten files consistent.

The rules that must never be broken live in [`../CLAUDE.md`](../CLAUDE.md). This
document is the style underneath them.

## Packages

**One package per concern under `internal/`, named for what it holds:**
`config`, `db`, `http`. The `http` package shadows the standard library name,
so `cmd/api/main.go` imports it as `apihttp`. Keep that alias; don't rename the
package.

**Dependencies flow inward through `Dependencies`.** `NewApp` takes a struct of
what routes need. It never opens a pool or reads the environment itself. That
is what lets `internal/http/health_test.go` build the whole app with a fake.

## Naming

**Exported names are nouns for types and verbs for functions:** `Config`,
`Load`, `Connect`, `Migrate`, `NewApp`, `Pinger`. Unexported helpers say what
they do (`splitList`, `valueOr`). Durations are named constants with their
unit in the value: `connectTimeout = 10 * time.Second`, `readinessTimeout`,
`shutdownTimeout`.

**Routes are lowercase, plural nouns for resources** (`/assessments`,
`/profiles`), with probes at `/healthz` and `/readyz`. JSON fields are
`camelCase` to match what the web app already uses.

## Errors

**Wrap with context as `verb noun: %w`.** Examples are
`fmt.Errorf("ping database: %w", err)` and `"apply migrations: %w"`. The chain
then reads as a sentence in the log: `apply migrations: create migration lock:
…`.

**Errors go up; only `main` decides to exit.** `run` returns the error, and
`main` logs it once and calls `os.Exit(1)`. A package that logs and also returns
the error produces the same failure twice in the logs.

**Handlers turn expected failures into a status code and a small JSON body.**
`/readyz` returns `503` with `{"status":"unavailable","database":"unreachable"}`.
It never sends the underlying error text, which can contain hostnames or SQL.

> TODO(repo-agent-docs-setup): fix the API-wide error body (for example
> `{"error":"<code>","message":"…"}` set through `fiber.Config.ErrorHandler`)
> with the first real endpoint, then record it here and in `../CLAUDE.md`.

## Configuration

**`load(getenv func(string) string)` is the only reader of the environment.**
Tests pass a map instead of setting process variables
(`internal/config/config_test.go`), so they run in parallel and leave nothing
behind. Defaults are constants at the top of `config.go`.

## Logging

**`log/slog` with the JSON handler, structured key/value pairs:**
`logger.Info("api listening", "port", cfg.Port)`. Messages are short lowercase
phrases; values go in fields. Never log a request body, a token, a
`DATABASE_URL` or user content: the logs leave the machine once hosted.

## Tests

**Black-box through the public API, with hand-written fakes, not a mocking
library.** `fakePinger` in `internal/http/health_test.go` is three lines. A
fake per interface stays readable; a generated mock asserts call order, which
breaks on harmless refactors.

**Table-driven, with sentence names.** Examples: `"liveness ignores database"`
and `"not ready when database is down"`. A failure then reads as the broken
promise.

**HTTP tests go through `app.Test`**, so middleware (CORS, recover, body limit)
is exercised too.

**Database tests call a `testDatabaseURL(t)` helper that skips without
`TEST_DATABASE_URL`.** See `internal/db/db_test.go` and
`cmd/api/main_test.go`. `.github/workflows/test.yml` provides a Postgres
service and sets the variable, so CI always runs them. Locally, a plain
`go test` skips them and still says `ok`. That is why the coverage check, not
`go test`, is what proves the database code ran.

**Assert the cause, not just that something failed.** For example,
`TestRunReturnsListenErrorWhenPortIsTaken` checks for "address already in
use". Otherwise a database error would make it pass without testing the port.

**Coverage rules apply per package and per changed line.** See
`docs/TESTING.md`. A branch that cannot be produced in a test process gets an
entry in `coverage-exclusions.json` with its reason, not a contrived test and
not silence.

## Documentation

**Every package has a `// Package x …` comment, and every exported identifier a
doc comment that starts with its name.** Comments inside functions explain why,
for example the advisory-lock comment on `Migrate` and the body-limit comment in
`NewApp`. `go vet` does not enforce doc comments; this is convention.
