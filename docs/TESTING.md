# Testing and coverage

The testing rules for the whole repository, and why each exists. The short form
is in the root `CLAUDE.md`. `app/CLAUDE.md` and `server/CLAUDE.md` say where
tests go in each unit. This file is the full statement; when they disagree, the
disagreement is a bug.

## The rules

1. **New logic ships with tests, and the work is not done until every test
   passes.** "Every test" means `pnpm test`, not just the suite you touched. Each
   new behaviour gets its normal case **and its edge cases**:
   - empty, missing or malformed input;
   - boundaries (zero, the limit, one past it);
   - unknown or hostile values;
   - the failure path (storage throws, the server is down, the port is taken).

   A test suite that only proves the happy path misses the bugs users actually
   hit.
2. **Before you refactor or restructure existing code, tests must already cover
   all its use cases, including edge cases.** If they don't, write them first,
   against the current code, and see them pass. Then change the code and run
   the **same** tests again. Passing before and after is what shows the
   behaviour did not change. A refactor without them is a rewrite nobody can
   check.
   - If the task really changes the logic, update the affected tests in the same
     change and say so in the commit or PR. The tests then document the new
     behaviour.
3. **Go API: every package reaches at least 90% statement coverage.** That
   covers the whole package, old code included.
4. **Go API: every line added or changed since commit `03275d6` runs under test
   (100%).** That counts lines with statements in them, including uncommitted
   and new files. Comments, blank lines and declarations don't count.
5. **Web logic modules reach at least 90% of lines, branches and functions,
   with as many use cases covered as possible.** Logic modules are the pure files
   with no React: `app/*-model.ts`, `app/connected-labs.ts`, `app/api-client.ts`
   once it exists, and `scripts/lib/coverage.mjs`. A logic module that no test
   loads fails the check.
6. **Web components are tested, covering as many use cases as possible.** There
   is no percentage. A component test covers:
   - what the user sees in each state (loading, ready, error, empty);
   - what each control does;
   - what is saved or sent;
   - English and Thai.
7. **Database tests are gated on `TEST_DATABASE_URL`.** A Go test that needs
   Postgres calls `testDatabaseURL(t)`, which skips the test when the variable
   is unset. CI always sets it, so the tests always run there.
8. **Code that cannot run under test is listed in `coverage-exclusions.json`,
   with a reason.** Nothing is excluded silently, and nothing is excluded just
   because it is hard to test. If a reviewer can't verify the reason, the
   exclusion is wrong.

## Commands

From the repository root:

| Command | Runs |
| --- | --- |
| `pnpm test` | Every suite: `test:node`, `test:components`, `test:go`, `test:news-scout` |
| `pnpm test:node` | Every `scripts/test-*.mjs` with `node --test` (logic modules, inventory, coverage helpers) |
| `pnpm test:components` | Vitest + React Testing Library + jsdom, over `app/**/*.test.tsx` |
| `pnpm test:go` | `go test -race ./...` in `server/`; database tests skip unless `TEST_DATABASE_URL` is set |
| `pnpm test:news-scout` | The Python crawler tests |
| `pnpm test:coverage` | The node and Go suites with coverage, then `scripts/check-coverage.mjs` for rules 3–5 |

`pnpm test:coverage` needs Postgres, or rules 3 and 4 fail on the
database code. Start a throwaway database first:

```bash
docker run --rm -d --name horizon-test-db -p 127.0.0.1:55432:5432 -e POSTGRES_PASSWORD=test -e POSTGRES_DB=horizon_test postgres:17-alpine
```

```bash
TEST_DATABASE_URL='postgres://postgres:test@localhost:55432/horizon_test?sslmode=disable' pnpm test:coverage
```

```bash
docker stop horizon-test-db
```

Don't point `TEST_DATABASE_URL` at a database you care about. The tests run
migrations against it.

CI (`.github/workflows/test.yml`) runs `pnpm test` and then
`pnpm test:coverage` on every pull request and every push to `The-Gang` or
`main`, with a Postgres service.

## Where tests go

| Testing… | File | Runner |
| --- | --- | --- |
| A web logic module `app/<feature>-model.ts` | `scripts/test-<feature>.mjs`, importing the `.ts` file directly | `node --test` |
| A React component `app/<feature>.tsx` | `app/<feature>.test.tsx` | Vitest (`vitest.config.ts`) |
| A script helper `scripts/lib/<name>.mjs` | `scripts/test-<name>.mjs` | `node --test` |
| A Go handler | `server/internal/http/<resource>_test.go`, with `app.Test` and a fake | `go test` |
| A Go store or migration | Its package's `_test.go`, gated with `testDatabaseURL(t)` | `go test` with `TEST_DATABASE_URL` |
| Startup and shutdown of the API | `server/cmd/api/main_test.go` | `go test` with `TEST_DATABASE_URL` |

Examples to copy:
- logic: `scripts/test-watch-labs.mjs`;
- component: `app/watch-labs.test.tsx`;
- gated Go: `server/internal/db/db_test.go`.

Only files named `scripts/test-*.mjs` are `node:test` suites. The Playwright
smoke test for the inventory Worker is `scripts/smoke-inventory-cloudflare.mjs`,
so the glob does not pick it up. It needs a running Worker, which only
`.github/workflows/question-inventory.yml` provides.

## How the coverage check works

`scripts/check-coverage.mjs` reads the Go profile (`server/coverage.out`) and
the node lcov report (`coverage/logic.lcov`). Both are gitignored. The parsing
is in `scripts/lib/coverage.mjs` and tested by `scripts/test-coverage.mjs`. The
base commit and both floors are constants at the top of the script.

- **Changed lines** come from `git diff -U0 03275d6 -- server`, plus untracked
  files under `server/`. A changed line fails rule 4 if it is inside a coverage
  block that no test executed. That is why CI checks out the full history.
- **Logic modules** are web logic files that Node loads directly as TypeScript,
  types stripped (Node ≥ 22.18), so coverage is measured on the real source.
  They must stay free of TypeScript that cannot be stripped (enums,
  namespaces, parameter properties) and of runtime imports.

## Exclusions

Each entry in `coverage-exclusions.json` has:
- `file`;
- `anchor`, a line matched on its trimmed text, exactly once;
- an optional `after`, for an anchor like `if err != nil {` that repeats: it
  picks the first anchor line after that unique line;
- `reason`.

The exclusion covers the `{ … }` region the anchor opens. It follows the code
when lines move. If the anchor disappears or matches twice, the check fails,
so a stale exclusion can't quietly hide new code.

Add an exclusion only when the code cannot run in a test process. Good
reasons: it calls `os.Exit`, it handles an error its fixed arguments can't
produce, or the failure needs a race. If the code is merely awkward to reach,
write the test.

## Known failures

Nine tests in the frozen inventory suites are marked `todo`. They run and report
on every `pnpm test` but don't fail it. All share one cause, recorded in
`scripts/lib/known-failures.mjs`:

> Commit `41338d6` ("Align live inventory with routed assessment pool") rebuilt
> `exports/review-inventory/live-questions.json` from the app's question pool.
> It dropped the reviewed English wording, the October feedback and the rewrite
> metadata of all 634 original live items.

The tests are right; the data is missing. Restoring the reviewed drafts from
`19329c9`, while keeping the 255 items added since, makes them pass. Then delete
`liveExportReviewLoss` and every `todo` that uses it. The question bank is
frozen this phase, so the repair waits. Never add a new `todo` to make a
failing test pass: a new failure is a bug to fix.

The suites:

| Suite | Known-failure tests |
| --- | --- |
| `scripts/test-feedback-october.mjs` | 4 |
| `scripts/test-thai-inventory.mjs` | 2 (the `live-questions.json` checks) |
| `scripts/test-wording-refinements.mjs` | 3 |
