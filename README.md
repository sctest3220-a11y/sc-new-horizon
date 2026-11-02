# SC Horizon / New Horizon

Adaptive AI-readiness assessment: a quiz that adapts to the user's role and
answers and scores practical AI literacy across six domains. It ends in a report
with learning paths. The repository also contains AI Watch (curated AI news),
AI Labs (short practice exercises), a question-inventory review tool, and a Go
API with Postgres that is becoming the system of record.

**Agents start at [`CLAUDE.md`](CLAUDE.md) and [`docs/SCOPE.md`](docs/SCOPE.md).**
The product itself is described in
[`docs/PRODUCT_OVERVIEW.md`](docs/PRODUCT_OVERVIEW.md), and the change history is in
[`docs/LATEST_CHANGES.md`](docs/LATEST_CHANGES.md).

## Project scope

The current phase prepares the existing app for a **hosted Event Demo**:

- stabilize existing features;
- overhaul how data is presented;
- make every page work on phones from 375px wide;
- serve the demo features' data from the Go API instead of browser storage.

The question bank is frozen. B2B tenancy, live LLM calls and payments are out
of scope. The reasons and the open questions are in
[`docs/SCOPE.md`](docs/SCOPE.md).

## Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | ≥ 22.18 | `engines` in `package.json`; tests load `.ts` files with Node's built-in type stripping |
| pnpm | 12.x | Installs exact pins from `pnpm-lock.yaml` |
| Go | 1.27 | Only for running or testing `server/` outside Docker |
| Docker Desktop | with Compose v2 | Runs Postgres and the Go API |

Install the web app's dependencies from the repository root:

```bash
pnpm install
```

If that fails building `sharp` with "Please add node-addon-api", see
Troubleshooting.

## Configuration

The web app runs **without any environment variables**. Two optional groups
exist:

- **Go API and Postgres.** Copy the template and set a password:

  ```bash
  cp .env.example .env
  ```

  Then edit `POSTGRES_PASSWORD` in `.env`. The other keys have working
  defaults:
  - `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PORT` (5432);
  - `API_PORT` (8080);
  - `CORS_ORIGINS` (`http://localhost:3000`);
  - `DATABASE_URL`, used only when running Go outside Docker.

  `.env` is gitignored; never commit it.
- **Optional sign-in (Supabase).** Put `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`. The Supabase project setup
  (Google provider, redirect URLs, `supabase-schema.sql`) is in
  [`docs/PRODUCT_OVERVIEW.md`](docs/PRODUCT_OVERVIEW.md#google-and-email-auth) and
  [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md). Supabase is being replaced by the
  Go API this phase.

## Running

The web app and the Go API run separately. From the repository root:

```bash
docker compose up --build -d
```

That starts Postgres and the Go API on http://localhost:8080. Check that it can
reach the database:

```bash
curl localhost:8080/readyz
```

Then, in another terminal, start the web app on http://localhost:3000:

```bash
pnpm dev
```

Useful pages:

| URL | What it is |
| --- | --- |
| http://localhost:3000/ | The assessment and home page |
| http://localhost:3000/?view=watch, `?view=labs` | AI Watch and AI Labs |
| http://localhost:3000/admin/question-inventory | Question-inventory reviewer |
| http://localhost:3000/admin/pilot-operations | Pilot settings |

To run only the reviewer, without Supabase or Docker, follow
[`docs/QUESTION_INVENTORY_LOCAL_REVIEW.md`](docs/QUESTION_INVENTORY_LOCAL_REVIEW.md).

To run the Go API outside Docker (for faster edit-run cycles), from the
repository root:

```bash
docker compose up -d db
```

```bash
set -a && source .env && set +a && cd server && go run ./cmd/api
```

## Commands

From the repository root unless noted.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Builds the review-inventory assets, then starts the dev server on port 3000 (fails if the port is taken) |
| `pnpm build` | Builds the assets and a Cloudflare Worker bundle with Vinext. It cannot be served by `pnpm start` under Node. |
| `pnpm lint` | ESLint over the repository |
| `pnpm exec tsc --noEmit -p .` | Type check. 18 errors in `app/page.tsx` already exist; compare counts. |
| `pnpm test` | Every test suite: node, components, Go, Python |
| `pnpm test:coverage` | Node and Go suites with coverage, then the coverage rules (needs `TEST_DATABASE_URL`) |
| `pnpm test:node` / `test:components` / `test:go` / `test:news-scout` | One group of suites |
| `pnpm test:watch-labs` | Watch/Labs model tests only |
| `pnpm crawl:news` | Runs the AI Watch discovery crawler; writes `.agent-drafts/ai-watch/latest.json`, publishes nothing |
| `pnpm crawl:training` | Runs the Playwright course scout; writes review reports to `.agent-drafts/` |
| `pnpm inventory:assets` | Rebuilds `public/review-inventory/` from `exports/review-inventory/` |
| `pnpm inventory:refine` | Regenerates the inventory exports (the question bank is frozen; don't run without agreement) |
| `docker compose up --build -d` / `docker compose down` | Start / stop Postgres and the Go API (`down -v` also deletes the database volume) |
| `docker compose logs -f api` | Follow the Go API log |

## Testing

Run every suite from the repository root:

```bash
pnpm test
```

The rules (tests for new logic, tests before refactoring, coverage floors) and
how to run the coverage check against a throwaway Postgres are in
[`docs/TESTING.md`](docs/TESTING.md). CI (`.github/workflows/test.yml`) runs
`pnpm test` and `pnpm test:coverage` on every pull request.

| Suite | Command | Needs |
| --- | --- | --- |
| Logic modules, inventory and script helpers | `pnpm test:node` (every `scripts/test-*.mjs`) | Nothing |
| React components | `pnpm test:components` (`app/**/*.test.tsx`) | Nothing |
| Go API | `pnpm test:go` | Go; database tests also need `TEST_DATABASE_URL`, and skip without it |
| AI Watch crawler | `pnpm test:news-scout` | Python 3 |
| Inventory Worker smoke test | Run by `question-inventory.yml` against `wrangler dev` | A Worker build and Playwright's Chromium |

Nine inventory tests report as `todo`: known failures with a recorded cause
(see "Known failures" in `docs/TESTING.md`). CI does not lint or type-check the
main app, so run `pnpm lint` and the type check yourself.

## Troubleshooting

### `pnpm install` fails building sharp: "Please add node-addon-api"

A Homebrew `vips` makes sharp try to compile from source. Use its prebuilt
binary instead:

```bash
echo 'export SHARP_IGNORE_GLOBAL_LIBVIPS=1' >> ~/.zshrc
```

Open a new terminal and run `pnpm install` again.

### `pnpm dev`: "Port 3000 is already in use" or "Another vinext dev server is already running"

The port is pinned on purpose, because the Go API's CORS default expects
`http://localhost:3000`. Stop the other process on 3000, or the other
`pnpm dev` in the same checkout.

### `docker compose up`: "Cannot connect to the Docker daemon"

Docker Desktop's window can be open while its engine is stopped. Start the
engine (bottom-left of the Docker Desktop window, or `docker desktop restart`)
and wait until `docker version` shows a server.

### `docker compose up`: "bind: address already in use" on 8080

Another program holds 8080. Set `API_PORT=18080` in `.env` (or stop the other
program), then `docker compose up -d`.

### `pnpm start`: `ERR_UNSUPPORTED_ESM_URL_SCHEME ... 'cloudflare:'`

`pnpm build` produces a Cloudflare Worker, which Node cannot serve. Use
`pnpm dev` locally.

## Deployment

- **Question-inventory Worker (Cloudflare).**
  `.github/workflows/question-inventory.yml` tests, builds, smoke-tests and
  deploys an inventory-only app with `/api/results` on D1, on pushes to `main`
  that touch the inventory. See
  [`docs/QUESTION_INVENTORY_CLOUDFLARE_TEST.md`](docs/QUESTION_INVENTORY_CLOUDFLARE_TEST.md).
- **The main app and the Go API are not deployed yet.** Hosting for the Event
  Demo is an open decision in [`docs/SCOPE.md`](docs/SCOPE.md).
  `.github/workflows/server.yml` only tests and builds the Go image.
