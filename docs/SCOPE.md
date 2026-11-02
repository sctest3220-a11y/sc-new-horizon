# Scope and objective

_The anchor document. Read this before planning or writing anything in this
repository. Product specs live in the other `docs/*.md` files; they describe
the eventual product, not what is being built now._

## Objective

Get **New Horizon ready for the hosted Event Demo**: the features that already
exist behave reliably, present their data clearly, work on a phone, and read and
write their data through the Go API instead of the browser.

That is not the same as building the product described in
`docs/MVP_REQUIREMENTS_SPECIFICATION.md` or
`docs/FEATURE_CATALOG_BY_USER_AND_RELEASE.md`. Those documents are the roadmap.
A feature being specified there is not a reason to build it now.

This repository owns all three layers:

- the web app (`app/`, Next.js 16 built by Vinext);
- the Go API (`server/`, Fiber v3);
- its Postgres schema (`server/internal/db/migrations/`).

Today most app data lives in browser `localStorage`, plus an optional Supabase
sync. **The Go API and its Postgres database become the system of record** for
the data behind every Event Demo feature. Data stays in `localStorage` only
when a developer has agreed it should.

> **Naming.** "SC Horizon", "New Horizon" and "Horizon" are the same product.
> "Inventory" means the question-review tool at `/admin/question-inventory` and
> its exports. It is not the live question bank the quiz uses. "D1" means two
> different things here: assessment domain 1 of D1–D6, and Cloudflare's D1
> database behind `/api/results`. Say which one you mean.

## What this repository is today

| Working | Detail |
| --- | --- |
| Adaptive assessment | `/assessment`, `/assessment/premium`, `/assessment/run`, `/results`: free, premium and executive modes, scoring, continuation and results report. Screens are in `app/(learner)/`, logic in `app/learner-app.tsx`. Data is in `localStorage`. See [`frontend/03-assessment-engine.md`](frontend/03-assessment-engine.md). |
| AI Watch and AI Labs | `/watch`, `/labs`, `/labs/<kind>`: a local release. Stories are hand-written in `trendFeed`. See [`frontend/05-watch-and-labs.md`](frontend/05-watch-and-labs.md). |
| Pilot operations admin | `/admin/pilot-operations`: saves to `localStorage`, and only some settings reach the quiz. |
| Question inventory reviewer | `/admin/question-inventory`: reviewer feedback goes to Cloudflare D1 through `/api/results`. Deployed as a separate Cloudflare Worker. |
| Optional sign-in | Supabase Google OAuth and magic links, run in the browser. Profiles and sessions are copied to Supabase. |
| Go API | `server/`: `/healthz` and `/readyz` only, plus Postgres through `docker-compose.yml`. It has no app tables and no auth yet, and the web app does not call it. |

The Go API exists to prove the plumbing: the connection pool, migrations,
Docker and CI. Its first real endpoints are this phase's work.

## In scope (Event Demo)

1. **Stabilize existing features.** Fix bugs in current behaviour. Don't
   change what a feature does unless the change fixes a confirmed bug.
2. **Overhaul the UI for data presentation.** Reports, dashboards and results
   screens should present their data clearly.
3. **Make every page responsive down to 375px wide**, with no horizontal page
   scroll, and keep tablet and desktop working.
4. **Serve the data of every Event Demo feature from the Go API and Postgres.**
   This means the Go endpoints, migrations, and the frontend changes that call
   them. To keep any of that data in `localStorage`, ask the developer first.
5. **Host the demo.** This covers the web app, the Go API and Postgres; where
   they are hosted is an open question below.

That is the whole of the Event Demo phase.

## Explicitly out of scope

Each of these has a reason. They are listed so the decision does not get
re-litigated every session.

| Not building | Why |
| --- | --- |
| Changes to the question bank | The bank is **frozen as is** for this phase. This covers adding, editing, re-translating or retiring questions, artifacts, rubrics, answer keys and inventory exports. The demo is about the features around the bank, and every bank change needs human review, versioning and translation QA. |
| Changes to scoring, routing or difficulty logic (unless fixing a confirmed bug) | Stabilization means current results stay reproducible. A "better" formula changes every score shown at the demo and cannot be calibrated without pilot data. |
| The question-review flow: `/admin/question-inventory`, its results page, `/api/results` and the inventory Worker | Outside the Event Demo. It works for reviewers as it is, its feedback stays on Cloudflare D1 (see Decided), and it is tied to the frozen question bank. |
| Importing existing browser data into Postgres | Decided against (see Decided): the demo starts with an empty database, and an import path is code that runs once and is then dead weight. |
| B2B tenancy: organizations, teams, seats, invitations, tenant RLS | Specified in `docs/B2C_B2B_USER_ADMINISTRATION.md` but not needed for the demo. It reshapes every table, so it waits for its own phase. |
| Live LLM or AI provider calls: Premium Report Copilot, AI translation, Watch summaries | They need a server-side provider boundary, cost controls and evaluation first. The app is local and rule-based today, and the demo must not depend on a paid external call. |
| Payments, billing, subscriptions, plan enforcement | No commercial operation is planned for the demo. Entitlement toggles stay as they are. |
| New product features from the roadmap docs | This phase polishes what exists. A spec in `docs/` is not a work order. |

## Branches and pull requests

**`The-Gang` is the primary working branch. Every pull request targets
`The-Gang` by default, not `main`.** Branch from `The-Gang`, and open the PR
with `--base The-Gang`. Target another branch only when a developer asks for
it. `main` is what the inventory Worker deploys from, so a PR opened against
it by default would take work towards deployment before it has been reviewed
on `The-Gang`.

What CI does for a PR into `The-Gang`:

- `.github/workflows/test.yml` runs all tests and the coverage rules on every
  pull request, whatever its target.
- `.github/workflows/server.yml` runs on every pull request that touches
  `server/**`.
- `.github/workflows/question-inventory.yml` runs only on pull requests into
  `main`. Inventory changes aren't smoke-tested on the way into `The-Gang`,
  and the inventory is frozen anyway.
- Pushes to `The-Gang` and to `main` also run `test.yml`. A merged pull request,
  or a direct push, is tested again on the branch itself.

## Open questions

1. **Which features are in the Event Demo?** This decides which data moves to
   the Go API (In scope 4). Until it is answered, confirm with a developer
   before migrating any feature's data.
2. **When is the demo?** No date is recorded.
3. **Where is the demo hosted, and who owns it?** Today only the inventory
   Worker deploys (Cloudflare). There is no target yet for the web app, the Go
   API or Postgres. `.openai/hosting.json`, `@openai/sites-vite-plugin` and the
   old Vercel notes are tooling, not decisions.
4. **How does the Go API authenticate users?** It replaces Supabase, which
   currently handles sign-in in the browser. Until this is decided, no endpoint
   that reads or writes user data may be deployed without auth.
5. **Should stabilization include the type and lint debt?** `tsc` reports 18
   errors in `app/learner-app.tsx`, and no CI job runs `tsc` or `eslint` on the main
   app.

## Decided

Questions that were open and are now settled. Each one is recorded so it is not
re-opened.

| Decision | Consequence |
| --- | --- |
| **Existing browser data is dropped, not imported** (2026-10-29). | When a feature moves to the Go API, its `localStorage` read and write are removed. Nothing copies old browser data into Postgres, so the demo starts from an empty database. Don't build an import or a "sync my old runs" path. |
| **Reviewer feedback stays on Cloudflare D1** (2026-10-29). | The question-review flow is outside the Event Demo. `/api/results`, its D1 database and the inventory Worker stay as they are, and nothing about them moves to the Go API. |

## Where to read next

- [`../CLAUDE.md`](../CLAUDE.md): the cross-cutting rules.
- [`../app/CLAUDE.md`](../app/CLAUDE.md): rules for the web app.
- [`../server/CLAUDE.md`](../server/CLAUDE.md): rules for the Go API.
- [`../README.md`](../README.md): setup and commands.
