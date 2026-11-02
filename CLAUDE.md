# CLAUDE.md

Guidance for working in this repository. See `README.md` for setup and
day-to-day commands.

**Start with `docs/SCOPE.md`.** It is the anchor: what this project is for, what
is deliberately not being built, and why. The current phase prepares the
existing app for a hosted Event Demo:

- stabilize features;
- present data clearly;
- support phones from 375px wide;
- move the data of demo features from browser `localStorage` and Supabase to
  the Go API.

So most "add a new feature from the roadmap docs" instincts are wrong here. So
is "tidy up the question bank": the question bank is frozen.

## Layout

- `app/`: the web app. Next.js 16 App Router on React 19.3, **built and served
  by Vinext 1.3** (Vite 8 + `@cloudflare/vite-plugin`), not `next build`. Each
  learner screen is a route under `app/(learner)/`. Their state, logic and
  question bank are still one module, `app/learner-app.tsx` (~14k lines).
- `server/`: the Go API. Go 1.27, Fiber v3, pgx v5, goose migrations embedded
  in the binary. It is meant to become the system of record (see
  `docs/SCOPE.md`).
- `docker-compose.yml`: Postgres 17 and the Go API for local runs.
- `scripts/`: Node build, inventory and translation scripts, their `node:test`
  suites (`scripts/test-*.mjs`) and two Python crawlers.
- `exports/`, `public/review-inventory/`, `public/stimuli/`: question-bank and
  inventory data. Frozen this phase; mostly generated (see Conventions).
- `deploy/inventory-preview/`: files that replace their dev versions in the
  Cloudflare inventory Worker build.
- `docs/`: `SCOPE.md`, `frontend/` (numbered reasoning for the web app) and
  product specs. The specs describe the roadmap, not the current code.

`app/` has its own `CLAUDE.md`. It indexes the web app's non-negotiables,
routes, where code goes and the gate. Read it before editing anything under
`app/`, `scripts/` or `public/`.

`server/` has its own `CLAUDE.md`. It indexes the Go API's non-negotiables,
middleware order, where code goes and the gate. Read it before editing anything
under `server/` or `docker-compose.yml`.

## Conventions

**The Go API is the system of record for Event Demo data.** When a demo feature
reads or writes user data, the data goes through a Go endpoint backed by a
Postgres migration. New `localStorage` persistence needs a developer's explicit
OK, so ask; don't decide. Browser-only data cannot be shown on another device
or recovered, and it disappears when the presenter's browser is cleared.

**The web app and the Go API change together.** An endpoint's request and
response shape, its Go handler, and the frontend code that calls it land in the
same change. Nothing generates types across the boundary yet, so a shape that
changes on one side only fails at runtime in the browser, not in CI.

**Schema changes are new goose migrations, never edits to applied ones.** Goose
records each applied version. An edited file never runs again on any database
that already has it, so local and hosted schemas drift silently. See
`server/CLAUDE.md`.

**The question bank is frozen.** Don't edit questions, translations, artifacts,
answer keys or inventory exports. `docs/SCOPE.md` says why.
`docs/frontend/04-question-bank.md` explains the bank so feature code can read
it correctly.

**Generated files are regenerated, never hand-edited.** A hand edit is
overwritten by the next run of the script that owns the file. Worse, a hand
edit can pass review and then disagree with the source the script reads.

| Generated file | Produced by |
| --- | --- |
| `app/questionTranslations.th.ts` | Localisation batch tooling from the reviewed Thai workbooks (no script in this repo writes it) |
| `app/productionQuestionRelease.ts` | `scripts/build-assessment-release-module.mjs` |
| `public/review-inventory/` (gitignored) | `scripts/build-review-inventory-assets.mjs`, which `pnpm dev` and `pnpm build` run |
| `exports/review-inventory/*` | The `pnpm inventory:refine` chain and the `generate-`/`export-`/`apply-*` scripts in `scripts/` |
| `exports/production/releases/<id>/` | `scripts/prepare-production-release.mjs` |

**User-facing text is bilingual, English and Thai.** Every new string needs
both. How each surface handles Thai is in `app/CLAUDE.md`. Thai copy is simple
Thailand Thai. Market terms such as AI, Agent, Prompt, RAG and API stay in
English.

**Dependencies are pinned exactly.** `package.json` and `server/go.mod` use
exact versions, and deep-dependency security patches are `overrides` in
`pnpm-workspace.yaml`. Each override line names the package that pulls it in;
remove the line once that package ships the fix. A range like `^1.2.0` lets a
fresh install pick up an unreviewed release.

**Every page works from 375px wide.** A screen is not done until it has no
horizontal page scroll at 375px and still works on tablet and desktop. The demo
is shown on phones.

**Testing rules.** The full statement and the reasons are in
[`docs/TESTING.md`](docs/TESTING.md); `.github/workflows/test.yml` enforces them
in CI. In short:

- **New logic ships with tests, including edge cases.** Work is not done until
  `pnpm test`, every suite, passes.
- **Refactoring needs tests first.** Before you restructure existing code, tests
  must cover its use cases and edge cases, and they must pass before and after
  the change. Only adjust a test when the task really changes the logic, and
  say so in the commit.
- **Go API coverage:**
  - every package reaches at least 90%;
  - every line added or changed since `03275d6` runs under test (100%).
- **Web coverage:**
  - logic modules (`app/*-model.ts`, `app/connected-labs.ts`,
    `app/api-client.ts`) reach at least 90% of lines, branches and functions;
  - components get tests covering as many use cases as possible.
- **Database tests skip unless `TEST_DATABASE_URL` is set.** CI always sets it.
- **Code that cannot run under test goes in `coverage-exclusions.json`, with a
  reason.**

Without tests, a regression only shows up in front of the demo audience. With
them, "it still works" is a command you can run, not a guess.

## Deployment and caching

These are decisions, not defaults. Changing one has cost and ownership
implications outside this repository.

- **Only the question-inventory Worker deploys.** On pushes to `main` that
  touch the inventory, `.github/workflows/question-inventory.yml` runs these
  steps:
  1. Run `scripts/test-inventory-release.mjs`.
  2. Build a separate app with `scripts/build-inventory-cloudflare.mjs`. It
     contains only `/admin/question-inventory`, `/api/results`,
     `public/review-inventory` and `public/stimuli`, and its home page
     redirects to the reviewer.
  3. Smoke-test the build with Playwright under `wrangler dev`, using
     `scripts/smoke-inventory-cloudflare.mjs`.
  4. Apply `app/api/results/schema.sql` to the D1 database
     `new-horizon-inventory-results`.
  5. Run `wrangler deploy`.

  The deploy steps only run in `sctest3220-a11y/sc-new-horizon`.
- **The main app, Watch, Labs and the Go API are not deployed anywhere.** The
  Event Demo needs them hosted, and where is open question 3 in
  `docs/SCOPE.md`. Don't add a deploy workflow or hosting config without that
  decision.
- **`test.yml` runs every test suite and the coverage rules** on every pull
  request and on pushes to `The-Gang` (the primary branch; PRs target it by
  default, see `docs/SCOPE.md`) and `main`. It runs them against a Postgres
  service and needs the full git history (`fetch-depth: 0`).
- **`server.yml` builds; it does not deploy.** It runs `gofmt`, `go vet`,
  `go test -race` and `docker build` on changes to `server/**`,
  `docker-compose.yml` or the workflow itself.
- **`ai-watch-discovery.yml` only uploads an artifact.** It runs a crawler daily
  and publishes nothing.
- `.openai/hosting.json`, `@openai/sites-vite-plugin` and the Vercel notes in
  older docs are leftover tooling, not a hosting decision.

## Security invariants

These are not stylistic preferences. Changing any of them needs a deliberate
decision, and several have tests that will fail.

- **AI provider keys never reach browser code.** Every LLM call, when one
  exists, goes through the Go API, because a key in the bundle is readable by
  every visitor. Today the app makes no AI calls. Mentions of OpenAI, Anthropic
  and Gemini in `app/learner-app.tsx` are question content and news links. No test
  pins this yet.
- **Secrets live in `.env`, which is never committed; only `.env.example` is
  tracked.** `.gitignore` ignores `.env*` and re-includes `!.env.example`.
  `docker-compose.yml` refuses to start without `POSTGRES_PASSWORD`, so a
  default password never ships. No test pins this.
- **The Go API names its CORS origins exactly; `*` is rejected at startup.** A
  wildcard would let any site call the API from a signed-in user's browser.
  (`server/internal/config/config_test.go`, `TestLoadRejectsInvalid` /
  `"wildcard origin"`; `server/internal/http/health_test.go`,
  `TestCORSAllowsConfiguredOriginOnly`)
- **The Go API refuses to start with invalid configuration.** A missing
  `DATABASE_URL`, a bad `PORT` or a bad `MIGRATE_ON_START` fails at boot, not
  on the first request. (`TestLoadRejectsInvalid`)
- **Local Postgres and API ports bind to `127.0.0.1` only** in
  `docker-compose.yml`, so the database is not reachable from the network. No
  test pins this.
- **No user-data endpoint is deployed without authentication.** The Go API has
  no auth yet (open question 4), so adding an endpoint is fine locally, but
  hosting it is not. No test pins this yet.

These are known gaps. They are not rules to copy:

- The admin console at `/admin` is a preview gate: a button sets
  `adminAuthenticated` to `true`.
- `/api/results` and the `/admin/*` routes have no auth check, so anyone can
  read or post reviewer feedback on the deployed Worker.
- Supabase sign-in keeps the access token in plain `localStorage`.

The first and third go away when the Go API owns auth. The second stays: the
review flow and its D1 storage are outside the Event Demo (`docs/SCOPE.md`,
Decided). Don't build on any of them.

## Things that will trip you up

- **`pnpm dev` says "Another vinext dev server is already running".** vinext
  allows one dev server per checkout. Find the PID in the message. Ask the user
  before stopping a server you did not start.
- **`pnpm dev` fails with "Port 3000 is already in use".** `vite.config.ts`
  pins port 3000 with `strictPort`, because the Go API's default
  `CORS_ORIGINS` is `http://localhost:3000`. Free the port rather than moving
  the app. If you do move it, change `CORS_ORIGINS` too.
- **`pnpm install` fails building `sharp` with "Please add node-addon-api".** A
  Homebrew `vips` on the machine makes sharp try to compile from source. Set
  `SHARP_IGNORE_GLOBAL_LIBVIPS=1` (in `~/.zshrc`, or inline) and install again.
- **`pnpm start` fails with `ERR_UNSUPPORTED_ESM_URL_SCHEME ... 'cloudflare:'`.**
  `pnpm build` produces a Cloudflare Worker, which Node cannot serve. Check
  pages with `pnpm dev` instead.
- **`pnpm test` shows 9 `todo` tests in the inventory suites.** They are known
  failures with one recorded cause (reviewed drafts lost in `41338d6`; see
  "Known failures" in `docs/TESTING.md`). Don't add a `todo` to silence a new
  failure: a new failure is a bug.
- **CI is green but the main app has type errors.** No workflow runs `tsc` or
  `eslint` on the main app. `tsc --noEmit` reports 18 existing errors in
  `app/learner-app.tsx`. CI type-checks only the inventory subset, inside
  `scripts/build-inventory-cloudflare.mjs`. Compare error counts before and
  after your change: new errors are yours.
- **The inventory deploy fails with "Inventory asset loader changed" or
  "Feedback storage adapter changed".** `scripts/build-inventory-cloudflare.mjs`
  patches `app/admin/question-inventory/page.tsx` and `review-sync.tsx` by
  string match. Don't reword the matched lines without updating the script.
- **You cannot read `.env`.** It is outside what the agent may read, by design.
  Check configuration by booting what consumes it (`docker compose up`,
  `go run ./cmd/api`) and reading the startup error.
- **`go get` or `go mod download` fails with `x509: OSStatus -26276` inside the
  sandbox.** The sandbox blocks the macOS certificate check. Run that one
  command outside the sandbox.
- **A page opened in the hidden browser pane stays half-loaded: AI Watch is
  blank and `/?view=` links don't redirect.** Hidden panes delay
  `requestAnimationFrame`, which the app uses to restore state after load.
  Show the pane, or verify in a real or headless browser.
