# System Specification: Current State

**Status:** First draft · **As of:** 28 October 2026 · **Branch read:** `The-Gang` (`b564a6a` plus uncommitted `app/page.tsx` edits)

This document describes what the code does today, not what the product plans say. Where a planning doc describes something larger, this spec says so and links it.

**In one paragraph:** New Horizon is a browser-only MVP. One large client component (`app/page.tsx`) runs the assessment, scoring, results, dashboard, AI Watch, AI Labs and an admin analytics preview. Almost all data lives in the user's browser `localStorage`, with an optional copy to Supabase when the user signs in. There are no plans, payments, roles or organizations on the server: "Premium" is a longer quiz anyone can start, and "Admin" is a button with no check. The only deployed piece is a separate Cloudflare Worker that hosts the Question Inventory reviewer. Security is not ready for real users: the answer key ships to every browser, admin pages and the only API are open to anyone, user data can be lost or forged, and dependencies carry 5 critical and 35 high known vulnerabilities (see [§4](#4-security-and-vulnerabilities)).

**Status legend** used below:

| Label | Meaning |
|---|---|
| **Built** | Works end to end in the running app |
| **Partial** | Some of it works, or it works only in one browser or only locally |
| **Not built** | Specified in `docs/` but no code exists |

---

## 1. Current Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 16.2 (App Router), React 19.2, TypeScript 5.9, Tailwind CSS 4 | Nearly the whole app is one client component, `app/page.tsx` (~17,400 lines). Watch and Labs are split out into `app/watch-*.tsx`, `app/watch-model.ts`, `app/connected-labs.ts`. |
| Build / runtime | Vinext 1.0 beta (Vite 8 build of Next.js) with `@cloudflare/vite-plugin` | Configured in `vite.config.ts`. `next build` is not used. `pnpm dev` and `pnpm build` first run `scripts/build-review-inventory-assets.mjs`. |
| Backend | One API route: `app/api/results/route.ts` on Cloudflare Workers | Stores Question Inventory reviewer feedback. No other server logic. |
| Database (server) | Cloudflare D1 (SQLite), database `new-horizon-inventory-results` | Schema in `app/api/results/schema.sql`. Only the `question_feedback` table is used. |
| Database (user data) | Browser `localStorage`; optional Supabase Postgres | Supabase schema `supabase-schema.sql` (4 tables, row-level security per user). Called directly from the browser over REST. |
| Authentication | Supabase Auth (Google OAuth, email magic link) | Optional. Browser-side only. See [§2.1](#21-authentication). |
| AI / LLM | None | No LLM calls anywhere. Reports, Agent Ops, AI Watch ranking and Thai translation scripts are rule-based or simulated. |
| CI/CD | GitHub Actions | `question-inventory.yml`: test, build, Playwright smoke test, `wrangler deploy` of the inventory Worker on pushes to `main`. `ai-watch-discovery.yml`: daily crawler, uploads an artifact only. |
| Tooling | pnpm, Node ≥ 22.13, ESLint, Playwright, Node test runner, Python 3 crawlers in `scripts/` | |
| Hosting | Cloudflare Workers (inventory reviewer only) | The main app, Watch and Labs are not deployed by any workflow. Older docs mention Vercel; `.openai/hosting.json` is unused hosting tooling. |

<details>
<summary>Key files</summary>

| Area | File |
|---|---|
| Main app (all screens below unless noted) | `app/page.tsx` |
| Question bank release 2026-10-07.1 (229 appended items) | `app/productionQuestionRelease.ts` |
| Thai question translations (generated) | `app/questionTranslations.th.ts` |
| AI Watch | `app/watch-labs.tsx`, `app/watch-model.ts`, `app/watch-media.tsx`, `app/watch-awareness.tsx` |
| AI Labs (new) | `app/connected-labs.ts` |
| Pilot Operations | `app/admin/pilot-operations/page.tsx` |
| Question Inventory | `app/admin/question-inventory/` |
| API | `app/api/results/route.ts`, `app/api/results/schema.sql` |
| Supabase schema draft | `supabase-schema.sql` |

</details>

---

## 2. Current State of Each Feature

### 2.1 Authentication

**Summary:** Sign-in is optional and only affects whether data is also copied to Supabase. No feature is locked behind sign-in, a plan, or a role.

How sign-in works today:

- The user signs in from the dashboard (or the admin login screen) with **Continue with Google** or an **email magic link**, using Supabase Auth.
- The access token and profile are stored in plain `localStorage` (`new-horizon-auth-profile-v1`).
- When signed in, the profile survey, each completed session, every behaviour event, and the end-of-quiz survey are also written to Supabase (`user_profiles`, `assessment_sessions`, `assessment_behavior_events`, `assessment_feedback`).
- Login only works when `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set. Without them the app runs as guest-only.

| User type | Status | Current state |
|---|---|---|
| **Free user** | **Built** | Anyone, signed in or guest ("Continue as guest"). Can take the free assessment and see the basic report. |
| **Premium user** | **Not built (as an account type)** | There is no plan, payment or entitlement. Anyone can click "Start Premium Diagnostic" and take the premium route. "Paid" report features follow the quiz mode, not the user (`paidReport = mode !== 'free'`). |
| **Organization user** | **Not built** | No organizations, tenants, teams, invitations or org roles. Specified in `docs/B2C_B2B_USER_ADMINISTRATION.md`. The only data isolation is Supabase row-level security (each user sees their own rows). |
| **Admin** | **Partial (preview only)** | The in-app admin console opens with a button, **Open admin dashboard preview**, which sets `adminAuthenticated = true` with no check. `/admin/pilot-operations` and `/admin/question-inventory` have no auth at all. `/api/results` accepts reads and writes from anyone. |

Known gaps:

- No server-side session or role check anywhere.
- The Supabase access token is kept in `localStorage`, readable by any script on the page.

### 2.2 Assessments

**Summary:** One adaptive engine serves every assessment mode. Modes differ in question count, profile inputs, domain targets and ranking weights. The question pool is 863 items (634 live + 229 from release `2026-10-07.1`).

Common flow for every mode:

1. The user picks a route (home page, nav or dashboard).
2. A short **profile survey** builds profile tags (max 18). It can be skipped.
3. The first question is chosen from the starting difficulty set by the profile.
4. Each answer is scored, the next difficulty is set from the last answer, and `selectNextQuestion` ranks the remaining items.
5. A feedback screen follows each answer unless all display diagnostics are off.
6. When the target count is reached, the user sees results and may continue with an extra targeted round.

Scoring and selection rules are described in [CLAUDE.md, Assessment engine](../CLAUDE.md#assessment-engine).

| Mode | Questions | Profile inputs | Entry point |
|---|---|---|---|
| Free (`free`) | 12 | Audience (general, student, educator, professional, team) | "Build Profile and Begin 12-Question Assessment" |
| Premium (`premium`) | 20 | Function (8), industry (6), role context (6) | "Start Premium Diagnostic" |
| Executive (`executive`) | 20 | Executive role | **No UI entry point** (see below) |
| Practice (`practice`) | 1 | — | **No UI entry point found**; the mode still exists in code and is excluded from leaderboards |

#### Free Assessments — **Built**

- 12 adaptive questions across D1–D6, using `freeAudienceDomainTargets` per audience. The free route targets **0 D5 questions** for every audience, so D5 often scores 0 and pulls the overall score down.
- Format minimums: at least 2 multi-select, 1 ranking, 1 matching, 1 written answer.
- Confidence: 38 + 4 per answer, capped at 88. A full 12-question run reaches 86 ("Pilot confidence").

#### Premium Assessments — **Partial**

- 20 adaptive questions. Domain targets blend function (55%), industry (25%) and professional (20%) profiles. Items matching the user's function and industry tracks get ranking bonuses.
- Confidence: 48 + 3 per answer, capped at 94.
- Free to start for anyone. No payment, login, or plan check.
- **Executive / leadership diagnostic:** The premium onboarding screen lets the user pick a "Role context" (CEO, board, people, finance, technology, transformation), but the run still starts in `premium` mode. The `executive` mode (D5/D4/D6-weighted domain targets, executive ranking weights, higher confidence base) is fully coded but no button starts it.

#### Organization Assessments — **Not built**

- No organization-assigned assessments, cohorts, invitations, deadlines or manager views exist in the app.
- The free route has a `team` audience option; it only changes domain targets.
- `/admin/pilot-operations` has a cohort name and access code field, but they are stored locally and do nothing (see [§2.7.1](#271-pilot-operations)).

### 2.3 Assessment Results

#### Scoring — **Built**

Per answer → readiness evidence → domain score (D1–D6) → overall score → level. Full rules, bands and weights: [CLAUDE.md, Scoring](../CLAUDE.md#scoring).

- Levels: Advanced, Proficient, Applied, Developing, Limited.
- Also computed: competency scores, evidence-mode scores (knowing / doing / hybrid), confidence per run, per competency and per domain.
- IRT-style readouts (theta, item parameters, SEM) are display-only and do not affect scores, although on-screen copy says they do.
- Time and hesitation are recorded but do not change scores.

#### Results — **Built**

The results page (`step === 'results'`) shows to every user:

- Overall score, level and confidence, labelled "Indicative MVP result" for free runs.
- Score interpretation against a research-informed target profile ("not a validated norm yet").
- "How this result was derived" score explanation.
- Personalised "Did you know?" card.
- **Continuation offer**: priority (8 questions), confidence (6) or domain (6) route, plus an "evidence completion" route (4–10 questions, total capped at 60).
- **Persona leaderboard**: top 10 for the user's group, built only from runs saved in **this browser**.
- 30-second end-of-quiz feedback survey.
- Retake, switch to free / premium buttons.

A free run also shows an "Unlock the detailed assessment report" card. It tells the user that paid features "can be enabled for paid users by the administrator"; there is no unlock action.

#### Detailed Results — **Partial**

Shown only when the run's mode is not `free` (premium, executive, practice):

- **Analysis tab** (question-level analysis). It is locked until the user submits the end-of-quiz feedback survey for that session.
- Personalised AI report (rule-based text from `getGeneratedReport`, not an LLM).
- Domain scorecard, radar chart (user vs group average vs target), domain drilldown into competencies.
- Assessment coverage plan, domain evidence quality, user profile signals.
- Strengths, priority gaps, knowledge vs practical skill, readiness badges, competency and skill scores.
- Saved score analytics (from this browser's score log).
- Evidence summary and tuned recommendations for premium / executive.

Report access settings: the app reads `new-horizon-report-access-v1`, but only one toggle (`paid.questionAnalysis`) affects the page. The other toggles (summary, history, benchmarks, exports, telemetry, psychometrics and so on) are not read. The admin page saves them under a different key, so they never apply (see [§2.7.1](#271-pilot-operations)).

#### Courses Recommendations — **Built (static catalog)**

Two hand-written catalogs in `app/page.tsx`, ranked by rules, with no external data feed:

| | Thailand course recommendations | Recommended bootcamps and workshops |
|---|---|---|
| Source | `learningRecommendations`: 28 courses (CHULA MOOC, Microsoft Learn, Google, AWS, paid Thai providers and others) with provider, URL, domains, skills, format, level, price text and fit note | `bootcampCatalog`: 8 New Horizon bootcamps/workshops with level, duration, audience, outputs, labs and framework alignment |
| Ranking | `getLearningRecommendations`: domain fit ×4, weak-competency fit ×2, profile-tag fit ×3, plus small bonuses for executive / starter level | `getBootcampRecommendations`: domain fit ×4, weak-competency fit ×2, role fit ×3, plus level bonuses by overall score (fundamental < 60, intermediate 55–79, advanced ≥ 75) and executive / governance fit |
| Filter by mode | Free: Starter and Applied only. Premium: no Executive level. Executive: all | None |
| Count shown | Free 3, premium/executive 5 | Free 3, premium/executive 4 (falls back to a level match if nothing ranks) |

Also shown: a mode-specific learning path, "Where to improve next", and a personalised tool / concept / practice plan per function track. The dashboard shows the top 3 courses. Prices and availability were captured manually and are not refreshed. `scripts/crawl-ai-training.mjs` crawls course pages but does not feed the app.

### 2.4 AI Labs — **Partial (local release)**

Practice exercises, separate from scored assessment. Released locally as `watch-labs-local-v1` (28 September 2026); not deployed.

- **Built:** two bilingual (EN/TH) Labs, `agent-boundaries` and `evidence-check`, about 4 minutes each. Each has two multiple-choice decisions, per-answer feedback, revision, optional notes and a saved takeaway. Rules grade the decisions; notes are never graded. Labs link to and from related AI Watch stories.
- **Also present:** 7 older Labs (`ownership`, `proof`, `next`, `prompt`, `media`, `workflow`, `trust`) graded by `evaluateLab`. The `prompt` Lab matches English keywords only.
- **Storage:** `localStorage` key `new-horizon-watch-labs-v1:<ownerId>`. Drafts and takeaways recover from corrupt data. No account sync, no server analytics.
- **Not built:** LLM grading of written answers, skill series, reminders, human pilot review before hosting.
- Lab progress never counts toward assessment readiness.
- Navigation: AI Labs nav button or `/?view=labs`.

Details: `docs/AI_WATCH_LABS_LOCAL_RELEASE.md`, `docs/AI_WATCH_LABS_ENGAGEMENT_ROADMAP.md`.

### 2.5 AI Watch — **Partial (local release, curated by hand)**

A personalised AI news edition. Same local release as Labs; not deployed.

- **Built:** For you / Explore / Saved tabs; optional setup (up to 3 interests, time budget, goal); a deterministic ranker picks a 3-story edition with one exploratory pick and shows why; topic mutes; saved stories; click-to-load YouTube with no autoplay; publisher links and credits kept.
- **"Did you know?"** cards on the home page and results page come from the same stories' bilingual awareness hooks.
- **Content:** about 34 hand-written stories in `trendFeed` (`app/page.tsx`), dated May to 25 September 2026, source-checked manually on 29 September. Media is hotlinked from publishers, never rehosted or generated.
- **Discovery crawler** (`pnpm crawl:news`, daily GitHub Action): collects candidate metadata from 5 sources into `.agent-drafts/ai-watch/latest.json`. It **does not feed the app**; an editor must write each story into `trendFeed` by hand.
- **Not built:** automatic discovery into the app, editorial queue, publish/withdraw, expiry, Thai story summaries, digests or notifications, LLM summarisation (planned: DeepSeek Flash / Qwen, see `docs/AI_WATCH_API_COSTS.md`).
- Navigation: AI Watch nav button or `/?view=watch`. The dashboard also shows news filtered by weak domains.

Details: `docs/AI_WATCH_AWARENESS_CURATION.md`.

### 2.6 Admin Dashboard — **Partial (local preview)**

The in-app admin console (`step === 'admin'` in `app/page.tsx`), opened by the unchecked preview button.

**Data source:** only the score log and profile signal log saved in **the admin's own browser**. It does not read Supabase, so it shows nothing about other users unless they used the same browser.

Sections:

- **Analytics:** readiness checklist, lowest average domains, cohort / function / role averages, priority gaps, item difficulty behaviour, question interaction mix, latest runs. CSV export of pilot review data.
- **10-point quality analysis suite:** item discrimination, distractor analysis, artifact dependency, clarity, difficulty calibration, competency heatmap, reliability, rubric audit, route/persona fit, report engagement.
- **Supervised quality engine:** improvement queue, question candidates, item calibration, real-document replacement briefs, human review gate.
- **Agent Ops:** "Run supervised jobs" and "Run simulation only" produce **simulated** agent runs (activity log, outputs, safety cut). No AI is called. Runs are saved in `new-horizon-supervised-agent-runs-v1`.
- It has **no quiz settings**. Quiz settings live in Pilot Operations.

Not built: the larger console in `docs/ADMIN_SETTINGS_CONFIGURATION.md` (role-based access, cross-user analytics, model and cost configuration, audited publishing).

Also present but unreachable: a "Generated report preview" screen (`step === 'developerReport'`, a sample full-stack developer report). No button navigates to it.

### 2.7 System Admin Workspace

Two standalone admin pages under `/admin/*`. Neither has authentication.

#### 2.7.1 Pilot Operations — **Partial**

`/admin/pilot-operations` (`app/admin/pilot-operations/page.tsx`). Tabs: Overview, Setup, Testers, Readiness, Issues. Everything saves to `localStorage` (`new-horizon-pilot-operations-v1`) and CSV export.

| Setting group | Reaches the quiz? |
|---|---|
| Pilot details (name, owner, status, dates, access code, cohort, default language) | **No.** Stored only. The access code is not checked anywhere. |
| Question policy (mandatory / maximum questions, adaptive continuation, answer reveal, quick feedback, report survey) | **No.** The quiz uses fixed `modeConfig` counts (free 12, premium 20). |
| Optional question diagnostics (6 toggles: question metadata, telemetry strip, task focus, scored evidence, psychometric panel, answer reveal) | **Yes**, same browser only, via `new-horizon-assessment-display-v1`. Display only. When all six are off, the per-answer feedback screen is skipped. |
| Report access by plan (free / paid toggles) | **No.** Saved under the wrong key; the quiz reads `new-horizon-report-access-v1`. |
| Testers, readiness gates, issue queue | **Sample data.** Testers (`P-001`…) and issues (`ISS-0xx`) are hard-coded examples; gate and issue status can be changed locally. |

The page states its own boundary: go-live needs role-based access, a shared database, invitation delivery, audited version publishing, consent records and server analytics.

#### 2.7.2 Question Inventory — **Built (reviewer tool, deployed)**

`/admin/question-inventory` (`app/admin/question-inventory/`). The only feature deployed to a server.

- **Content:** a 3,328-item draft review inventory (768 core, 1,296 function, 320 industry, 944 executive variants) plus the 634 live questions for side-by-side review. Built into `public/review-inventory` (index plus per-question detail JSON) by `scripts/build-review-inventory-assets.mjs`.
- **Browse:** filters by version, source, domain, difficulty, layer, format, rewrite version and status, translation, role, industry, executive role and free-text search; 20 questions per page; English/Thai at page and question level; light/dark theme.
- **Review:** per question, a reviewer records decision, rating, clarity, artifact, format, comment and suggested change. Saved to `/api/results` (D1 `question_feedback`, keyed by question ID and content version), with `localStorage` as backup.
- **Local sync (dev only):** `review-sync.tsx` keeps browser feedback in step with `exports/review-feedback/<reviewer>.json` through a dev-server endpoint (`/__review-feedback`), so reviews can be committed to the repo.
- **Results page:** `/admin/question-inventory/results`, an anonymous testing dashboard with feedback analysis and results by question version.
- **Deployment:** a separate Worker app, `new-horizon-question-inventory-test` ("Cloudflare test preview · Draft content · Inventory only"), built by `scripts/build-inventory-cloudflare.mjs` and deployed by `.github/workflows/question-inventory.yml` on pushes to `main`.
- **Gaps:** no reviewer identity or auth; anyone can read or post feedback. The `result_events` table accepts writes but nothing calls it. Draft inventory items are not yet connected to the live assessment except through the frozen `2026-10-07.1` release.

Details: `docs/QUESTION_INVENTORY_MILESTONE.md`, `docs/QUESTION_INVENTORY_CLOUDFLARE_TEST.md`, `docs/QUESTION_INVENTORY_REVIEW_TO_HOSTING_PROCESS.md`.

---

## 3. Summary of Gaps

The gaps fall into two groups:

- **[3.1](#31-gaps-from-the-current-scope-for-the-event-demo) Event Demo gaps** must close before the demo.
- **[3.2](#32-gaps-from-the-intended-final-form-of-the-system) Final-form gaps** can wait until after it.

### 3.1 Gaps from the current scope for the Event Demo

**Summary:** None of the ten demo requirements is met today. Two are close: AI Watch and AI Labs already run, and Free and Premium can already be started by anyone. The rest need new foundations: a Go backend with its own LINE / Google sign-in and roles replacing Supabase, Postgres for all data, server-side persistence of in-progress and finished tests, a UI face lift, and unit tests.

| # | Demo requirement | Current state | Gap to close |
|---|---|---|---|
| D1 | **Authentication with separate Admin and User roles** | **Not met.** Supabase sign-in is optional and browser-only. Admin is an unchecked button (`setAdminAuthenticated(true)`). `/admin/*` and `/api/results` are open. No role exists anywhere. | Sign-in for every user through an OTP sent by LINE Official Account messaging, or Google SSO; remove the guest route. Sessions issued and checked by the Go backend. A role on each user (`admin` / `user`), default `user`; Admin assigned by a backend console command. Admins use the same sign-in. Guard the admin console and `/admin/pilot-operations` by role. Remove Supabase Auth and the access token in `localStorage`. The Question Inventory workspace is out of scope and not exposed in the demo. |
| D2 | **Postgres for all data** | **Not met.** Most data is in `localStorage`. Supabase Postgres gets a copy only when the user is signed in, and only for 4 tables. Reviewer feedback is in Cloudflare D1. Pilot Operations, AI Watch / Labs state, agent runs and display settings are browser-only. | New Go backend with its own Postgres database in Docker (Supabase not used). One schema for users and roles, profiles, sessions, answers, results, behaviour events, surveys, Watch / Labs state and Pilot Operations settings. All necessary `localStorage` data moves to Postgres. Reviewer feedback stays on the Worker (out of scope). The app writes through the Go API instead of browser REST calls. Postgres is the source of truth, with `localStorage` as cache at most. Admin analytics read from Postgres. |
| D3 | **Free, Premium and Executive routes open to all users** | **Partly met.** Free and Premium can be started by anyone. Executive mode is coded but **has no UI entry point**: picking a "Role context" on the Premium screen still runs Premium. | Add an Executive entry point (button and onboarding with executive role). Show all three routes to every signed-in user. Free runs keep the basic report; Premium and Executive show the detailed report. |
| D4 | **AI Labs and AI Watch open to all users** | **Partly met.** Both run locally for everyone (`/?view=watch`, `/?view=labs`) with no gating. They are not deployed by any workflow, and their state is browser-only. | Deploy the main app (including Watch and Labs) to the demo host. Store Watch preferences, saved stories and Lab progress per user in Postgres (covered by D2). Refresh `trendFeed` stories before the event; the newest is dated 25 September 2026. |
| D5 | **Short or long version of the quiz** | **Not met.** Question count is fixed per mode (`modeConfig`: free 12, premium / executive 20). Written-answer questions cannot be excluded. Free and Premium *require* at least one written answer (format minimum `text: 1`). The unused Pilot Operations "question policy" does not reach the quiz. | Add a length choice before the test starts, on every route (Free, Premium, Executive). **Short:** 8 questions, at least one from each of D1–D6, plus a 2-question extra round; no written-answer (`interaction: 'text'`) items, and the `text` format minimum dropped. **Long:** current behaviour. The free route's D5 target (currently 0) must become at least 1 in the short version. Recheck difficulty quotas and confidence for 8 questions. Wire the Pilot Operations question policy to these counts. Record the chosen length on the session. |
| D6 | **User can view their own result after the test** | **Partly met.** The results page shows right after the test, but only in memory. After a reload or on another device it is gone. The score log keeps scores but not the answers, and there is no "past results" list. The dashboard shows the run count and average only. | Save each finished result (scores, level, answers, recommendations inputs) to Postgres. Add a "My results" list and a result detail page that rebuilds the report from saved data. Only the owner (and Admin) can read it. |
| D7 | **Resume an ongoing test at any point** | **Not met.** The in-progress session (answers, current question, seed, target count, continuation focus) lives only in React state. A reload starts a new session. | Save session state after each answer: session ID, mode, length, seed, target count, targets, answers, current question. On return, offer "Resume" or "Start over". The seeded selection makes picks reproducible from the saved answers. Mark sessions abandoned after a timeout. |
| D8 | **Remove Supabase; own LINE and Google SSO integration** | **Not met.** `app/page.tsx` calls Supabase directly from the browser for sign-in (Google OAuth, email magic link) and for profile, session, event and feedback sync. Login needs `NEXT_PUBLIC_SUPABASE_*` env vars. | Remove all Supabase code, env vars and `supabase-schema.sql` from the demo build, including the email magic link. Implement LINE (OTP through LINE Official Account messaging) and Google SSO in the Go backend directly. Keep provider secrets server-side only. |
| D9 | **Major UI face lift** | **Not met.** The UI is one ~17,400-line component with an ~8,000-line `globals.css` and only 7 media queries. The team reports problems with data presentation, overflowing content, colour and responsiveness. | Redesign the main screens: home, onboarding, assessment, per-answer feedback, results and detailed report, dashboard, AI Watch, AI Labs, admin console and Pilot Operations. Fix overflow and layout at phone, tablet and desktop widths. Define one colour and typography system. Rework charts and tables so scores read clearly. Splitting `app/page.tsx` into screen components will likely be needed to do this safely. |
| D10 | **Unit tests for the demo** | **Not met for the demo scope.** Only AI Watch / Labs (`pnpm test:watch-labs`, 14 tests) and the Question Inventory scripts have tests. Scoring, adaptive selection, continuation, confidence and recommendations in `app/page.tsx` have **no tests**. There is no Go backend yet. The `ci.yml` workflow named in the README does not exist. | Unit tests for scoring (`getReadinessScore`, `getDomainScores`, `scoreToLevel`, answer scorers), question selection (including the short version's 8 + 2 and all-domains rule), continuation, report-access gating and recommendations. Go unit tests for auth, roles, sessions, resume and results APIs. Run them in CI on every pull request. |

<details>
<summary>Engineering notes for the demo gaps</summary>

- The demo uses a new Go backend and Postgres in Docker, so the browser-side Supabase calls in `app/page.tsx` (`syncUserProfileToSupabase` and the REST calls around it) and the Supabase Auth helpers are replaced by calls to the Go API. The Worker's `/api/results` (Cloudflare D1) is left as is; the Question Inventory is out of the demo scope.
- Admin role assignment is a backend console command (for example a Go CLI subcommand that sets `role = 'admin'` for a user by LINE ID or email). It should log who ran it and when.
- Google SSO and LINE OTP must link to one user record when the same person uses both, or the demo must accept two separate accounts. This needs a decision during design.
- `supabase-schema.sql` is a useful starting point for the Postgres schema (`user_profiles`, `assessment_sessions`, `assessment_behavior_events`, `assessment_feedback`). It lacks users and roles, in-progress session state, per-answer rows for rebuilding a report, Watch / Labs state and admin settings. Its row-level security relies on Supabase Auth, so the Go backend must enforce "own rows only" itself.
- Wiring Pilot Operations means fixing the report-access key mismatch (`new-horizon-pilot-operations-v1` vs `new-horizon-report-access-v1`), reading every toggle in the results page (today only `paid.questionAnalysis` is read), and replacing fixed `modeConfig` counts with the saved question policy.
- `app/page.tsx` keeps all session state in component state (`answers`, `current`, `assessmentSeed`, `assessmentTargetTotal`, `continuationFocus`). The startup effect always creates a fresh session ID, so resume needs a load step there.
- The short version touches `modeConfig`, `minimumGeneralInteractions`, `getProfileDomainTargets` and the confidence formula (`confidenceBase + answers × confidenceStep`), which assumes the current counts.

</details>

### 3.2 Gaps from the intended final form of the system

**Summary:** The final product is a B2C and B2B platform with paid plans, organizations, a full admin console, an editorial AI Watch pipeline and LLM features. The current code is a single-browser MVP. These gaps are outside the Event Demo scope unless noted.

| Area | Intended final form | Current state | Spec |
|---|---|---|---|
| Plans and payment | Free and Premium plans with entitlement checks and payment | No plan, payment or entitlement. "Paid" report follows quiz mode, not the user | `docs/FEATURE_CATALOG_BY_USER_AND_RELEASE.md` |
| Organizations (B2B) | Organizations, tenants, teams, invitations, org roles, manager views, org-assigned assessments, tenant RLS, billing | Not built | `docs/B2C_B2B_USER_ADMINISTRATION.md` |
| Roles | Platform, organization and tenant roles, including super admin | None (demo adds Admin / User only) | `docs/B2C_B2B_USER_ADMINISTRATION.md` |
| Admin console | Role-based console with cross-user analytics, quiz configuration, audited content publishing, model and cost settings, support tools | Local-only preview; reads one browser's data; only 6 display toggles reach the quiz | `docs/ADMIN_SETTINGS_CONFIGURATION.md` |
| Pilot Operations | Real pilots: access codes, invitations, tester tracking, consent, release gates | Settings stored locally; testers and issues are sample data | `app/admin/pilot-operations/page.tsx` (boundary panel) |
| Report access by plan | Admin-controlled report features per plan | Admin saves under the wrong key; only `paid.questionAnalysis` is read | — |
| Question bank pipeline | Reviewed 3,328-item inventory promoted to the live bank through frozen, audited releases | One frozen release (`2026-10-07.1`, 229 items) appended by hand; no importer | `docs/QUESTION_INVENTORY_REVIEW_TO_HOSTING_PROCESS.md` |
| Reviewer tool | Authenticated reviewers with identity and central storage | Anonymous; anyone can read or post; `result_events` unused | `docs/QUESTION_INVENTORY_CLOUDFLARE_TEST.md` |
| Psychometrics | Calibrated item parameters feeding confidence and scoring; time and hesitation used | IRT readouts are display-only; norms "not validated"; time not used | `docs/MVP_REQUIREMENTS_SPECIFICATION.md` |
| AI Watch | Discovery → checks → classification → summary → human editorial review → versioned publish → corrections and expiry; Thai summaries; digests | Hand-written `trendFeed`; crawler output not connected; no editorial queue, expiry, Thai summaries or notifications | `docs/AI_WATCH_LABS_ENGAGEMENT_ROADMAP.md` |
| AI Labs | Skill series, reminders, LLM evaluation of written answers with versioned rubrics | 2 new + 7 older rule-graded Labs | `docs/AI_WATCH_LABS_ENGAGEMENT_ROADMAP.md` |
| LLM features | Server-side Premium Report Copilot, translation routing, Watch summarisation | No LLM calls; reports are rule-based; Agent Ops is simulated | `docs/TRANSLATION_PROVIDER_STRATEGY.md`, `docs/AI_WATCH_API_COSTS.md` |
| Course recommendations | Admin-approved catalog with freshness, price and role-fit checks | Static hand-written lists; prices not refreshed; course crawler not connected | — |
| Privacy and compliance | PDPA consent records, retention, user data controls | Not built; full written answers kept in the local behaviour log | `docs/LEGAL_PRIVACY_PDPA_TERMS.md` |
| Hosting | Production hosting for the full app | Only the inventory reviewer is deployed | `docs/DEPLOYMENT.md` |
| Testing | Unit tests across the final system (frontend engine, Go backend, B2B, admin, LLM features), run in CI | Only Watch / Labs and inventory scripts are tested; demo tests (D10) are the first step | — |

## 4. Security and Vulnerabilities

**Summary:** The current code is not safe to run with real users. Anyone can read the full answer key, open every admin page, read or write the only server API, and impersonate or lose user data, because nothing is checked on a server and almost nothing is stored in a real database. Most findings are closed by the Event Demo work (Go backend, own auth with roles, Postgres). Six need explicit attention because the demo plan does not close them by itself: S1, S7, S8, S10, S11 and S13.

Severity: **Critical** = exploitable now by anyone with the URL; **High** = serious exposure or loss under normal use; **Medium** = needs a specific condition; **Low** = hygiene.

| # | Finding | Severity | Evidence | Closed by demo plan? |
|---|---|---|---|---|
| S1 | **Question bank and answer key are in the source code and shipped to every browser.** All 863 assessment items, including option scores (`score: 98`), `correctOptionIds`, rubric keywords and `exemplarAnswer`, are hard-coded in `app/page.tsx` and `app/productionQuestionRelease.ts`, which is a client component. Anyone can read the answers in the browser's developer tools and score near 100. The deployed inventory Worker also serves 4,217 question files with scores and correct answers at public URLs (`/review-inventory/detail/*.json`). | **Critical** | `app/page.tsx` (`'use client'`), `app/productionQuestionRelease.ts`, `public/review-inventory/` | **No.** Move the bank into Postgres. Serve each question to the client without scores, correct answers or rubric. Score answers on the Go backend. Take the inventory preview offline or put it behind auth. |
| S2 | **No authentication, roles or permissions.** Sign-in is optional and browser-only. No server ever checks who the user is. | **Critical** | §2.1 | Yes (D1) |
| S3 | **Admin access is an unchecked button.** "Open admin dashboard preview" sets `adminAuthenticated = true`. `/admin/pilot-operations` and `/admin/question-inventory` have no check at all. | **Critical** | `app/page.tsx` (`setAdminAuthenticated(true)`), `app/admin/*` | Yes (D1), if every admin route and API is guarded on the server, not just hidden in the UI |
| S4 | **Open, unauthenticated API on the public Worker.** `/api/results` lets anyone read all reviewer feedback (`?feedback=all`) and write unlimited rows. There is no rate limit. Any POST that is not feedback inserts into `result_events` with no validation of `releaseId`, `language` or the size of `domainScores`. Malformed JSON causes an unhandled error. | **Critical** | `app/api/results/route.ts` | Not in demo scope (decision 10). Take the Worker offline or add auth and rate limits. |
| S5 | **Risk of data loss: no proper database.** Scores, answers, profiles, telemetry, admin settings, Watch / Labs progress and in-progress tests live only in `localStorage`. Clearing the browser, private mode, a new device or a storage quota error loses them for good. An in-progress test is lost on reload. Supabase copies some of it only when the user is signed in, and those writes are fire-and-forget with no retry. | **High** | §2.3, CLAUDE.md "What is recorded" | Yes (D2, D6, D7), but only for data moved to Postgres. Data left in `localStorage` under the 20-day plan stays at risk. |
| S6 | **Client-side data can be forged.** Scores, leaderboards and admin analytics are computed from `localStorage`, which the user can edit. When signed in, the browser itself sends the finished session and score to Supabase, so a user can post any score. | **High** | `syncUserProfileToSupabase` and session sync in `app/page.tsx` | Yes, if scoring and result saving happen on the Go backend (see S1) |
| S7 | **Access token stored in `localStorage`.** The Supabase access token sits in plain `localStorage` (`new-horizon-auth-profile-v1`), readable by any script on the page. With no Content-Security-Policy (S12), one XSS bug leaks it. | **High** | `app/page.tsx` (`authProfileStorageKey`) | Only if the Go backend uses `HttpOnly`, `Secure`, `SameSite` cookies instead of tokens in storage |
| S8 | **Unsafe OAuth flow (implicit grant, no `state`).** Google sign-in uses Supabase's implicit flow: the access token returns in the URL fragment, and the app accepts any `#access_token=` without a `state` or nonce check. An attacker can send a link that signs the victim into the attacker's account (login CSRF). Tokens never refresh or expire in the app. | **High** | `startGoogleSignIn`, hash handler around `window.location.hash` in `app/page.tsx` | Only if the Go backend uses authorization code flow with PKCE and `state` for Google and LINE, and validates the OTP with expiry, attempt limits and rate limits |
| S9 | **Personal data sent and stored without consent controls.** Behaviour events store the full text of written answers. When signed in, every event is sent to Supabase as `payload` with the user's email. Profile surveys, roles and industries are also stored. There is no consent record, retention rule or delete function (PDPA). | **High** | CLAUDE.md "What is recorded", `docs/LEGAL_PRIVACY_PDPA_TERMS.md` | Partly. The Go backend must add consent, retention, export and delete for the data it stores. |
| S10 | **Reviewer names and feedback committed to the repository.** `exports/review-feedback/<reviewer>.json` files are committed and named after reviewers, and the dev plugin writes them automatically. If the repository is or becomes public, reviewer identities and comments are exposed. | **Medium** | `exports/review-feedback/`, `scripts/lib/review-feedback-sync-plugin.mjs` | No. Confirm the repository's visibility; move feedback out of git or anonymise file names. |
| S11 | **Vulnerable, unpinned and pre-release dependencies.** `pnpm audit` (28 October 2026) reports **86 known vulnerabilities: 5 critical, 35 high, 36 moderate, 10 low** (summary below the table). `@openai/sites-vite-plugin` uses a range (`^0.1.0 \|\| ^0.2.0`) and `playwright` uses `^1.62.1`, so new versions install without review. The build runs on `vinext` `1.0.0-beta.3`, a beta. | **High** | `package.json`, `pnpm audit` | No. Upgrade `next` first, then the rest (below). Pin exact versions, remove unused hosting tooling, run `pnpm audit` in CI, and add Go `govulncheck` for the new backend. |
| S12 | **No security headers.** `next.config.ts` is empty and the Worker sets no Content-Security-Policy, `X-Frame-Options` / `frame-ancestors`, `Referrer-Policy` or HSTS. `app/layout.tsx` injects an inline script, which a strict CSP would need to allow. | **Medium** | `next.config.ts`, `app/layout.tsx` | Only if headers are added on the new host |
| S13 | **No logging, monitoring or audit trail.** No server logs, error tracking or audit of admin actions. Abuse or data loss would go unnoticed. | **Medium** | — | No. Log auth events and admin actions, including the admin role console command (decision 7). |
| S14 | **Third-party requests reveal users' visits.** AI Watch images are hotlinked from publishers, so each publisher sees the reader's IP address and the referring page. YouTube is click-to-load, which limits this for video. | **Low** | `app/watch-media.tsx`, `trendFeed` | No. Set `Referrer-Policy` (S12), or proxy or self-host images where licences allow. |
| S15 | **Missing input limits on the client.** Written answers, comments and survey text have no length limit before storage, so a very long answer can fill the `localStorage` quota and break saving for the whole app. | **Low** | `app/page.tsx` text answer and feedback handlers | Yes, if the Go API enforces length limits |

**S11 dependency audit summary** (`pnpm audit`, 28 October 2026):

| Package | Critical | High | Mod. / Low | Fixed in | Where it runs |
|---|---|---|---|---|---|
| `next` 16.2.6 (direct) | **5** | 6 | 9 | ≥ 16.4.1 | App runtime. Critical issues are remote code execution in Image Optimization (AVIF, SVG), `next/og` `ImageResponse`, `use cache` functions and Windows-hosted servers. High issues include SSRF in Image Optimization, Server Actions and rewrites, and a middleware bypass. |
| `undici` (via `wrangler`, `miniflare`) | 0 | 10 | 19 | ≥ 7.30.1 | Dev and deploy tooling: TLS validation bypass, cache poisoning, denial of service |
| `vite`, `esbuild`, `postcss`, `source-map-js` (via `vinext`) | 0 | 4 | 9 | vite ≥ 8.1.6, postcss ≥ 8.5.23 | Dev server and build: file read and source-map path traversal |
| `sharp`, `image-size` | 0 | 5 | 0 | sharp ≥ 0.35.5, image-size ≥ 2.0.3 | Image processing: libvips, libheif and librsvg flaws, parser infinite loops |
| `react-server-dom-webpack` 19.2.6 (direct) | 0 | 1 | 0 | ≥ 19.2.8 | Server Functions denial of service |
| `brace-expansion`, `fast-uri`, `ws`, `js-yaml`, `zod`, `satori` | 0 | 9 | 9 | latest patch of each | Mostly build tooling: denial of service, URI parsing confusion |

- **Fix first:** upgrade `next` to 16.4.1 or later and `react-server-dom-webpack` to 19.2.8 or later. These are runtime dependencies, and `next` holds all 5 critical findings. Vinext reimplements parts of the Next.js server, so which of these code paths actually run in this app is unconfirmed; treat them as exploitable until checked.
- **Then:** upgrade `vinext`, `vite`, `wrangler` and `@cloudflare/vite-plugin` to pull patched `undici`, `vite`, `postcss` and `esbuild`. Most of these affect developer machines and CI rather than users, but the build pipeline deploys the Worker.
- For the Event Demo, whether the frontend stays on Next.js / Vinext or moves elsewhere decides how much of this upgrade work is worth doing now.

What is already done well:

- `/api/results` uses parameterised SQL (no SQL injection) and validates question IDs, content versions and feedback field lengths.
- The only `dangerouslySetInnerHTML` is a fixed string in `app/layout.tsx`; no user content is rendered as HTML.
- No LLM or provider keys exist in the code, and `.env*` and `*.pem` are git-ignored.
- AI Watch / Labs parsing bounds lengths and recovers from corrupt stored data.
- The review-feedback file sync runs only on the dev server (`apply: 'serve'`).

<details>
<summary>Security requirements for the Event Demo backend</summary>

These follow from the findings and should go into the backend's spec:

1. Questions are stored in Postgres and served without `score`, `correctOptionIds`, rubric keywords or `exemplarAnswer`. The Go backend scores every answer (S1, S6).
2. Sessions use `HttpOnly`, `Secure`, `SameSite=Lax` cookies. No tokens in `localStorage` (S7).
3. Google SSO and LINE use authorization code flow with PKCE and `state`. OTPs are single-use, expire within minutes, are rate-limited and lock after a few failed attempts (S8).
4. Every admin route and API checks the `admin` role on the server. The role console command is logged (S3, S13).
5. Every user-data API checks that the record belongs to the signed-in user (replaces Supabase row-level security).
6. Request size and field length limits, plus rate limits on sign-in, OTP and answer submission (S4, S15).
7. Security headers on every response (S12).
8. Consent capture, retention period, and user data export and delete (S9).
9. Pinned dependencies, `pnpm audit` and `govulncheck` in CI (S11).
10. No known critical or high vulnerabilities in runtime dependencies at demo time (S11).
11. Database backups for the Docker Postgres. Without them, D2 swaps browser data loss for server data loss (S5).

</details>

## Event Demo decisions

Reviewer answers to the open questions, 28 October 2026. The demo gaps in [3.1](#31-gaps-from-the-current-scope-for-the-event-demo) follow these decisions.

| # | Question | Decision |
|---|---|---|
| 1 | Can guests take a test, or must every user sign in? | **Every user signs in.** Sign-in is through a LINE Official Account with a one-time password (OTP), with Google SSO as a second method (see 6). No guest route. |
| 2 | Short version: how many questions, and all six domains? | **8 questions in total, plus 2 in the extra round.** All six domains (D1–D6) must be covered. No written-answer questions. |
| 3 | Do free runs show the detailed report? | **No.** Free runs keep the basic report. The detailed report stays for Premium and Executive. |
| 4 | Supabase, or a separate Postgres and auth? | **Own backend:** a new Go backend with its own Postgres database in Docker. Supabase is not used for the demo. |
| 5 | Wire up or hide the unused Pilot Operations settings? | **Wire up.** Question policy and report access settings must change the quiz and report. |

Follow-up decisions, 28 October 2026:

| # | Follow-up | Decision |
|---|---|---|
| 6 | Which service sends the OTP? | **LINE Official Account messaging** sends the OTP. **Google SSO** is added as a second sign-in method. |
| 7 | How do Admins sign in, and who assigns the role? | Admins sign in **the same way as users** (LINE OTP or Google SSO). The Admin role is **assigned manually with a console command** on the backend; there is no in-app role management. |
| 8 | Does the 8 + 2 short version apply to every route? | **Yes:** Free, Premium and Executive. |
| 9 | Where do Pilot Operations settings live? | **In Postgres.** All necessary data moves from `localStorage` to the database, including Pilot Operations settings, so they apply to every user. |
| 10 | Does the Question Inventory move to the Go backend? | **No. The Question Inventory workspace is out of the demo scope.** The demo uses the existing verified question bank (634 live items plus release `2026-10-07.1`). `/api/results` and the Cloudflare Worker stay as they are and are not part of the demo. |
| 11 | Is Supabase kept in the demo? | **No. Remove the Supabase implementation.** The team integrates LINE and Google SSO directly in the Go backend, with no third-party auth service in between. |
| 12 | Does the UI change for the demo? | **Yes, a major UI face lift:** data presentation, overflowing content, colour, responsiveness and general polish. |
| 13 | Is testing required? | **Yes, unit tests for both the demo and the final version.** |
