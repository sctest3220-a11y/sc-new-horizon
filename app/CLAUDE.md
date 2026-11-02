# CLAUDE.md — web app (`app/`)

Conventions for the Next.js app, its admin pages, its one API route and the Node
scripts that build its data.

**Commands in this file run from the repository root.** The web app's
`package.json` is there, not here.

The root `CLAUDE.md` still applies and is not repeated here, in particular:

- the Go API is the system of record for Event Demo data;
- the question bank is frozen;
- generated files are never hand-edited;
- every page works from 375px wide.

This file is the operational index: the rule, where the code goes, and what pins
it. The reasoning, the worked example and the deep reference (scoring, question
bank, Watch/Labs, state) are in [`docs/frontend/`](../docs/frontend/README.md).
Read [`docs/frontend/README.md`](../docs/frontend/README.md) first, then the
document for the area you are working in.

## Stack

Node ≥ 22.18 · TypeScript 5.9 (strict) · **Next.js 16.4 App Router built and
served by Vinext 1.3** on Vite 8 + `@cloudflare/vite-plugin` · React 19.3 ·
Tailwind 4 (mostly hand-written classes in `app/globals.css`) · tests:
- logic: `node:test` scripts in `scripts/`;
- components: Vitest 5 + React Testing Library + jsdom;
- the inventory Worker: one Playwright smoke script.

The testing rules and coverage floors are in the root `CLAUDE.md` and
[`docs/TESTING.md`](../docs/TESTING.md).

Vinext, not Next, runs the app. `next build`, `next.config.ts` and Next
middleware don't do anything here, and Next docs about the Node runtime don't
apply. `pnpm build` produces a Cloudflare Worker. Vinext transpiles without
type-checking, so a type error does not stop the build.

## Non-negotiables

Each names the test that pins it. A failure there is the invariant breaking, not
a flaky test.

1. **Nothing reads browser-only state during render or in a `useState`
   initializer.** That includes `localStorage`, `window.location`,
   `Math.random()`, `Date.now()` and the auth profile. Start from a
   deterministic default and restore in `useEffect` or `requestAnimationFrame`,
   behind a `ready` flag, as `app/watch-labs.tsx` and the `browserStateReady`
   effect in `app/learner-app.tsx` do. Otherwise the server HTML and the first
   client render differ, React discards the tree, and saved state flashes or is
   lost.
   This was fixed once already (commit `8666ead`). No test pins this yet.
2. **Persisted browser state has a versioned key and a parser that never
   throws.** The key follows `new-horizon-<thing>-v<N>`. The parser returns the
   default for missing, corrupt or unknown-version data, and it drops or caps
   untrusted fields. Storage is user-editable and survives deploys, so a parser
   that throws takes the page down for that user until they clear their
   browser. Bump `v<N>` when the shape changes incompatibly.
   (`scripts/test-watch-labs.mjs`, `"corrupt, missing, and unknown-version
   storage recovers without throwing"` and `"storage rejects invalid preference
   values and caps untrusted data"`; the `app/learner-app.tsx` parsers go
   through `app/page-storage-model.ts`, pinned by `scripts/test-page-storage.mjs`.)
3. **New persisted Event Demo data goes to the Go API, not `localStorage`,
   unless a developer has agreed otherwise.** See the root `CLAUDE.md`. Rule 2
   still applies to whatever stays in the browser. No test pins this.
4. **Released question IDs and saved inventory versions are append-only.**
   Production records use versioned runtime IDs (`<id>@2026-10-07.1`), so a
   rewrite cannot overwrite a live question. A saved inventory version is
   immutable. Feature code may read these IDs but never constructs or reuses
   one. (`scripts/test-inventory-release.mjs`, `"rewritten questions retain
   separate histories"`; `scripts/test-review-inventory-versions.mjs`,
   `"creating an existing version fails without changing its snapshot or
   registry"`; the production release throws are in
   `scripts/prepare-production-release.mjs`, which no test covers.)
5. **Every user-facing string ships in English and Thai, through the mechanism
   its surface owns.**
   - Interface text in the `app/(learner)/` screens: add the English→Thai
     pair to `thaiUiCopy` in `app/learner-app.tsx`.
   - Watch/Labs and any new component: render both languages from props
     (`Bilingual = { en, th }`) inside a `data-no-translate` subtree, so the
     legacy DOM pass does not rewrite it.
   - Question text: never in `thaiUiCopy`.

   (`scripts/test-watch-labs.mjs`, `"both Labs include complete bilingual
   evidence, choices, and feedback"`; nothing checks `thaiUiCopy` coverage.)
6. **Embedded video is `youtube-nocookie`, click-to-load and never autoplays.
   News media is hotlinked from the publisher, never downloaded or generated.**
   This is a privacy and rights decision recorded in
   `docs/AI_WATCH_AWARENESS_CURATION.md`. (`"video embeds accept only valid
   HTTPS YouTube IDs and never autoplay"`)
7. **Lab practice never counts as assessment readiness, and Lab grading never
   grades free-text reflection.** Rules grade the decisions and only the
   decisions. (`"Lab feedback requires all current criteria, and never grades
   reflection text"`)
8. **`/api/results` validates every field before writing to D1.** The
   `question_feedback` branch checks the ID and content-version formats and the
   field lengths. Any new branch does the same. The existing `result_events`
   branch writes whatever it is sent: treat that as a gap, not a pattern.
   (`scripts/smoke-inventory-cloudflare.mjs`, the CI smoke run; there is no unit
   test.)

## The request path

There is no middleware, so nothing is protected by default. In dev,
`scripts/lib/review-feedback-sync-plugin.mjs` adds a Vite middleware at
`/__review-feedback` (`apply: 'serve'`, so it never reaches a build).

| Method / Path | Handler / File | Guarded by |
| --- | --- | --- |
| `GET /` | `app/(learner)/page.tsx` → `home-screen.tsx`. Old `/?view=…` and `/?question=<id>` links redirect after mount (`legacyRedirect` in `app/learner-routes-model.ts`) | Nothing |
| `GET /dashboard`, `/watch`, `/labs`, `/labs/<kind>` | `app/(learner)/<route>/page.tsx` → its `screen.tsx` (Watch and Labs share `learning-screen.tsx`). An unknown `<kind>` is a 404 | Nothing |
| `GET /assessment`, `/assessment/premium` | Onboarding screens; starting the survey moves to `/assessment/run` | Nothing |
| `GET /assessment/run` (plus `?question=<id>` preview), `/results` | Question, answer feedback and results screens. Opened with no assessment in memory, they go back to `/assessment` | Nothing |
| `GET /admin`, `/admin/developer-report` | Admin console preview and the sample developer report, under `app/(learner)/admin/` | Nothing; the console is a button gate |
| `GET /admin/pilot-operations` | `app/admin/pilot-operations/page.tsx` | Nothing |
| `GET /admin/question-inventory` | `app/admin/question-inventory/page.tsx` (server component) | Nothing |
| `GET /admin/question-inventory/results` | `app/admin/question-inventory/results/page.tsx` | Nothing |
| `GET`, `POST /api/results` | `app/api/results/route.ts` (D1 binding `RESULTS_DB`) | Nothing; input validation only (rule 8) |

All of these are open on purpose for a local prototype. The assessment and
pilot pages close once the Go API owns auth (`docs/SCOPE.md`, open question 4).
The question-inventory pages and `/api/results` stay as they are: the review
flow and its D1 storage are outside the Event Demo (`docs/SCOPE.md`, Decided). Calls to the Go API go to
`http://localhost:8080` in dev, and `CORS_ORIGINS` must list the app's origin.

## Where does this code go?

| Adding… | Path |
| --- | --- |
| A new learner screen | A route: `app/(learner)/<route>/page.tsx` (server component: `metadata` title, renders the screen) and `screen.tsx` (`'use client'`, reads state through `useApp()`). Add its URL to `app/learner-routes-model.ts` and a case to `app/screens.test.tsx`. |
| A feature component inside a screen | Its own file, `app/<feature>.tsx`, taking props (like `app/watch-labs.tsx`). Not another block inside a `screen.tsx`. |
| State shared by several learner screens | `useAppController()` in `app/learner-app.tsx`, returned to the screens through `app/learner-app-context.tsx`. State only one screen uses stays in that screen. |
| Pure logic: parsing, ranking, scoring of a feature | `app/<feature>-model.ts`, with no runtime imports and only strippable TypeScript (no enums or namespaces), like `app/watch-model.ts`, so Node can load it directly in tests |
| Tests for that logic (≥ 90% lines, branches, functions) | `scripts/test-<feature>.mjs` (`node:test`), importing the `.ts` file directly, modelled on `scripts/test-watch-labs.mjs` |
| Tests for a component | `app/<feature>.test.tsx` (Vitest + React Testing Library), modelled on `app/watch-labs.test.tsx` |
| Styles for a feature | `app/<feature>.css`, imported by the component (like `app/watch-labs.css`); shared tokens and legacy classes stay in `app/globals.css` |
| Calls to the Go API | One module, `app/api-client.ts`. Create it with the first endpoint; it does not exist yet. Components never call `fetch` on the Go API directly. |
| A new admin page | `app/admin/<name>/page.tsx` |
| Build or data scripts and their helpers | `scripts/<verb>-<thing>.mjs`, shared helpers in `scripts/lib/` |
| Question, translation, artifact or inventory content | Nowhere this phase. The bank is frozen. |

`app/learner-app.tsx` is where existing behaviour lives, not where new code
goes. It still holds the question bank, the scoring logic and one controller
hook for every screen. Move logic out into `app/<feature>-model.ts` as you
touch it. Don't start a wholesale split without a dedicated task.

Two scripts-facing rules keep that file readable by `scripts/`:

- **Don't add `export` to a declaration in `app/learner-app.tsx`.** Add the
  name to the `export { … }` list at the end of the file. Several scripts
  evaluate the data section of the file as plain script text, and an `export`
  keyword there breaks them.
- **Keep `useAppController()` after all the data.**
  `scripts/dump-question-bank.mjs` and `scripts/export-question-bank.mjs` stop
  reading at that line.

## Definition of done

From the repository root:

```bash
pnpm lint
pnpm exec tsc --noEmit -p .
pnpm test
pnpm test:coverage
pnpm build
```

`pnpm test:coverage` needs `TEST_DATABASE_URL` for the Go side; see
`docs/TESTING.md`. Then open each screen you touched in `pnpm dev`
(http://localhost:3000) at 375px and at desktop width, in English and Thai.

What a green run can hide:

- **`tsc` already reports 18 errors in `app/learner-app.tsx`.** Compare the count
  before and after. Only an increase is yours.
- **No CI job runs `lint` or `tsc` for the main app.** `test.yml` runs the tests
  and coverage, but a type or lint error still passes CI.
- **Component coverage has no floor.** A green `pnpm test:components` proves
  only the cases someone wrote. Check that every state and control of the
  component you touched has a test.
- **`pnpm build` succeeding says nothing about runtime.** Vinext skips type
  checks, and the build is a Worker you cannot `pnpm start` under Node.
- **Inventory changes** (frozen, but if one is authorized) also need
  `node --test scripts/test-inventory-release.mjs` and
  `node scripts/build-inventory-cloudflare.mjs`. CI runs both.

## Known sharp edges

| Symptom | Cause and fix |
| --- | --- |
| Saved state flashes back to defaults, or React logs a hydration mismatch | Something read browser state during render (rule 1). Move it into the post-mount restore. |
| Changing a setting in `/admin/pilot-operations` does nothing in the quiz | Only the diagnostics toggles reach the quiz. Report access is saved under a different key than the quiz reads, and the question counts come from `modeConfig`. See `docs/frontend/03-assessment-engine.md`. |
| `/admin/question-inventory/results` shows fewer reviews than D1 has | The results page builds its feedback breakdown from this browser's `localStorage` only. It never reads `question_feedback`. |
| Reviewer feedback re-posted by dev sync lands as `legacy-unversioned` | `review-sync.tsx` re-posts any `new-horizon-review*` key without its `contentVersion`. Known; the inventory is frozen. |
| Thai text in a new component turns into a different Thai string, or into English | The legacy `applyUiLanguage` pass rewrote it. Wrap the component in `data-no-translate` and render both languages yourself. |
| `/?view=watch` stays on the home page, or AI Watch is blank, in an automated check | The redirect and the saved-state restore both run after the first animation frame, and a hidden browser pane never fires one. Wait for it, and show the pane or use a headless browser. |
| The question and the answer feedback show at the same time on `/assessment/run` | Both phases share one URL, so `screen.tsx` must keep its `step === 'assessment'` / `step === 'feedback'` checks. Pinned by `"answering shows feedback in place of the question, then the next question"` in `app/screens.test.tsx`. |
| A logic test fails with `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX` or module-not-found | `scripts/test-*.mjs` loads `app/*-model.ts` directly with Node's type stripping. Keep enums, namespaces, parameter properties and runtime imports out of logic modules. |
| `pnpm test:coverage` fails on a logic module with "no test loads this logic module" | Every `app/*-model.ts` needs a `scripts/test-*.mjs` that imports it. Add one; don't rename the file to dodge the check. |
| `wrangler dev` on the inventory build hits "too many open files" | The build carries thousands of per-question detail files. Do what `.github/workflows/question-inventory.yml` does: `ulimit -n 65536` and `CHOKIDAR_USEPOLLING=1`. |
