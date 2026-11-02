# 2. The reference implementation

`GET /readyz` is the only request that crosses every layer the API has today:

- configuration;
- startup wiring;
- the middleware;
- a handler with an injected dependency;
- the database, with a timeout;
- a test with a fake.

It is the shape to copy until a real resource exists.

## `/readyz`, layer by layer

| Step | File | What happens |
| --- | --- | --- |
| 1 | `internal/config/config.go` | `Load` reads `DATABASE_URL`, `PORT`, `CORS_ORIGINS` and `MIGRATE_ON_START`, and rejects bad values. |
| 2 | `internal/db/db.go` | `Connect` opens the `pgxpool` and pings it within `connectTimeout`. A dead database stops startup here. |
| 3 | `internal/db/migrate.go` | `Migrate` applies the embedded migrations under a Postgres advisory lock and logs the version. |
| 4 | `cmd/api/main.go` | `run` passes the pool into `apihttp.NewApp(apihttp.Dependencies{DB: pool, …})`. |
| 5 | `internal/http/router.go` | Middleware: recover → requestid → logger → cors. Then `registerHealthRoutes`. |
| 6 | `internal/http/health.go` | The handler derives a context from `c.Context()` with `readinessTimeout`, calls `DB.Ping`, and answers 200 or 503. |
| 7 | `internal/http/health_test.go` | `TestHealthRoutes` builds the real app with `fakePinger` and checks both outcomes through `app.Test`. |

Three details in that sequence are load-bearing.

**The handler depends on `Pinger`, not `*pgxpool.Pool`.** The interface has
the one method the handler calls. That is why the test needs no database, and
why the handler cannot reach for anything else on the pool.
(`TestHealthRoutes`)

**The timeout is derived from the request context.** If the client goes away,
the ping is cancelled. If Postgres hangs, the probe still answers in two
seconds instead of piling up goroutines. (`"not ready when database is down"`)

**The failure body says what is wrong, not why.** `"database":"unreachable"`
is enough for an operator. The driver's error text stays in the server, where
it cannot leak connection details.

## Adding an endpoint of your own

The first endpoints move an Event Demo feature's data from the browser to here.
Agree the JSON shape with the web-app change first: they land together.

1. **Migration.** Add `internal/db/migrations/000NN_<name>.sql` with
   `-- +goose Up` and `-- +goose Down` sections. Give every user-owned table a
   `user_id` column and an index on it now, even before auth exists.
2. **Store.** Add `internal/store/<resource>.go`: a type holding
   `*pgxpool.Pool`, with methods taking `ctx` and returning typed structs. Use
   `$1` placeholders only. Every query on user data filters by `user_id` in SQL.
3. **Interface and dependency.** In `internal/http/<resource>.go`, declare the
   narrow interface the handlers need and add it to `Dependencies` in
   `internal/http/router.go`.
4. **Handlers.** Add `register<Resource>Routes(app, deps)`. For each handler:
   - parse the body into a struct;
   - validate it (lengths, enums, ID formats);
   - call the store with `c.Context()`;
   - map "not found" to 404 and invalid input to 400;
   - map anything else to 500 without its text.
5. **Wire it.** Construct the store in `cmd/api/main.go` and pass it in
   `Dependencies`.
6. **Tests.** Cover each use case and its edge cases (`docs/TESTING.md`):
   - In `internal/http/<resource>_test.go`, use a fake store and `app.Test`:
     one case per status code, plus a case proving that invalid input never
     reaches the store.
   - In `internal/store/<resource>_test.go`, gated with `testDatabaseURL(t)`:
     run the real queries against Postgres. Include the case where one user
     cannot read another user's rows.
   - Run `pnpm test:coverage` from the repository root with
     `TEST_DATABASE_URL` set. Every new line must run.
7. **Run it for real.** `docker compose up --build -d` from the repository
   root, then `curl` the endpoint. Check that the log shows the new schema
   version.
8. **Web app.** Add the call to `app/api-client.ts`, as described in
   `docs/frontend/02-reference-implementation.md`.

The step that is not protected by default is **authentication**. No middleware
checks identity, so a new route is public. Until open question 4 in
`docs/SCOPE.md` is decided, user-data endpoints run locally only.
