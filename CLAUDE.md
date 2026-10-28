# CLAUDE.md

## Project overview

SC Horizon / New Horizon is an adaptive AI-readiness assessment MVP. See [README.md](README.md) for the product scope and [docs/](docs/) for specs.

### Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript 5.9, Tailwind CSS 4. Most of the app is one client component: `app/page.tsx` (~17k lines). |
| Build / runtime | **Vinext** (Vite 8 build of Next.js) with `@cloudflare/vite-plugin`, configured in `vite.config.ts`. It does not use `next build`. |
| Backend | One API route, `app/api/results/route.ts`, running on Cloudflare Workers. It stores reviewer feedback; its assessment-results table has no caller (see [Cloudflare Worker scope](#cloudflare-worker-scope)). |
| Database | Cloudflare D1 (SQLite) for `/api/results`, schema in `app/api/results/schema.sql`. Supabase Postgres schema is a draft in `supabase-schema.sql`. Most app data (scores, telemetry, profiles, agent runs) is in browser `localStorage`. |
| CI/CD | GitHub Actions. `.github/workflows/question-inventory.yml` tests, builds and smoke-tests the inventory Worker with Playwright, then runs `wrangler deploy` to Cloudflare on pushes to `main`. `.github/workflows/ai-watch-discovery.yml` runs a daily Python crawler and only uploads an artifact. |
| Tooling | pnpm, ESLint, Playwright, Node test scripts and Python crawlers in `scripts/`. `.openai/hosting.json` and `@openai/sites-vite-plugin` are hosting tooling only. Older docs mention Vercel. |

### AI integration

The running app does not call any LLM or AI provider. Reports, "Agent Ops", "AI Watch" and the Thai translation scripts (`scripts/lib/translate-thai-inventory.mjs`) are local, rule-based or simulated. OpenAI, Anthropic and Gemini mentions in `app/page.tsx` are question content and news links. A server-side LLM "Premium Report Copilot" is planned (`docs/ADMIN_SETTINGS_CONFIGURATION.md`, `docs/TRANSLATION_PROVIDER_STRATEGY.md`) but not built. Provider keys must stay server-side, never in browser code.

### Run locally

Requires Node >= 22.13 and pnpm.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build && pnpm start   # production-style run
```

The question reviewer is at `/admin/question-inventory`. The app runs without env vars. Login needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local` (see `docs/DEPLOYMENT.md`). For a reviewer-only setup, see `docs/QUESTION_INVENTORY_LOCAL_REVIEW.md`.

### Authentication

Optional and browser-side only. `app/page.tsx` (around the `isSupabaseConfigured` helpers) uses Supabase Auth for Google OAuth and email magic links. It keeps the access token in `localStorage` and syncs profiles and sessions to Supabase over REST. Known gaps:

- The admin console in `app/page.tsx` is a preview gate: a button sets `adminAuthenticated` to `true` with no check.
- `/api/results` and the `/admin/*` routes have no auth check, so anyone can read or post feedback on the deployed Worker.

### Roles and permissions

None implemented. The only access control is Supabase row-level security limiting each user to their own rows (`supabase-schema.sql`). Platform, organization and tenant roles, teams and tenant RLS are specified in `docs/B2C_B2B_USER_ADMINISTRATION.md` but not built.

## Assessment engine

How the quiz scores, adapts and records. All of it is in `app/page.tsx`; search for the function names below (line numbers drift).

### Admin settings

The only admin screen is `/admin/pilot-operations` (`app/admin/pilot-operations/page.tsx`), and it saves to browser `localStorage`. Only part of it reaches the quiz:

| Setting group | Reaches the quiz? |
|---|---|
| Optional question diagnostics (question metadata, telemetry strip, task focus, scored evidence, psychometric panel, answer reveal) | Yes, through `new-horizon-assessment-display-v1`, same browser only. Display only; scoring is unchanged. |
| Report access by plan (free / paid toggles) | No. The admin page saves them inside `new-horizon-pilot-operations-v1`, but the quiz reads `new-horizon-report-access-v1`, so it uses its defaults. |
| Question policy (mandatory / maximum questions, adaptive continuation, answer reveal, question feedback, report survey) | No. The quiz uses `modeConfig` instead: free 12 questions, premium 20, executive 20, practice 1. |

The diagnostics toggles also change the flow: when all six are off, the feedback screen after each answer is skipped (`skipHiddenFeedback`). The default has "Task focus" on, so that screen shows by default.

The admin console inside `app/page.tsx` (behind the preview button) only shows analytics and simulated agent jobs: quality analysis, cohort, function and role averages, priority gaps, item difficulty behaviour, interaction mix and latest runs. It has no quiz settings.

`docs/ADMIN_SETTINGS_CONFIGURATION.md` describes a larger admin console that is not built.

### Scoring

1. **Raw score (0–100)** per answer: preset option score for single choice (best answers are usually 95–98); `scoreMultiSelect` (98 if exact, else correct share × 82 − 18 per wrong pick); `scoreOrder` (share of steps in the exact position × 98; a different-length order scores 0) and `scoreMatches` (share of correct pairs × 98); `scoreParts` (average of parts); `scoreTextAnswer` (sum of points for rubric criteria whose keywords appear, English or Thai, max 98). Blank is 0.
2. **Readiness evidence**: `getReadinessScore` maps the raw score through `difficultyReadinessBands`. Raw 0–55 scales to the band's middle value, raw 55–100 from the middle value to its maximum: awareness 40/68, applied 58/82, proficient 72/92, advanced 82/100. Easy items alone cannot produce a high score.
3. **Domain score (D1–D6)**: `getDomainScores` averages readiness evidence; secondary domains count at 0.35 weight. Multi-part items score each part in that part's own domain at full weight, with no secondary domains. Unsampled domains score 0.
4. **Overall score**: average of **all six** domain scores × `getAnswerQualityAdjustment` factor = clamp(0.45 + 0.45 × average raw / 100 + 0.10 × share of answers ≥ 82, 0.45, 1). Unsampled domains count as 0 in that average, so they pull the overall down. The free route targets 0 D5 questions for every audience, so a free run often has D5 = 0.
5. **Level**: `scoreToLevel`. Advanced needs ≥ 85 and one advanced item answered ≥ 82; Proficient ≥ 70 and one proficient item ≥ 82; Applied ≥ 55; Developing ≥ 40; else Limited.

Competency scores (`getCompetencyScores`) average readiness evidence per competency. A multi-part item's parts map to each part domain's default competency.

Evidence-mode scores (`getEvidenceModeSummary`) average readiness evidence for knowing, doing and hybrid items. A mode with no evidence shows 50, unlike domains, which show 0.

### Confidence

- **Overall result confidence** counts answers only, not answer quality: `confidenceBase + answers × confidenceStep`, capped. Free 38 + 4 (cap 88), premium 48 + 3 (cap 94), executive 54 + 3 (cap 96). Below 78 is "Low", 78–85 "Medium", 86 or more "Pilot confidence".
- **Per competency**: 3 or more evidence signals is high, 2 medium, 0–1 low.
- **Per domain**: 4 or more questions is "stronger estimate", 2–3 "early estimate", 1 "sampled once".
- Theta, item a/b/c, information and SEM (`getAdaptiveReadout`) are shown on the psychometric panel only. They do not feed confidence or scoring, although the on-screen copy says they do.

### Continuation (extra round)

`getContinuationRecommendation` recommends continuing when overall confidence is below 86, a sampled competency is not high confidence or scores below 70, or a profile-priority competency was never asked. Otherwise it still offers continuing as optional. It picks one route, in this order:

- **priority** (8 questions): profile-relevant competencies are weak or a profile-priority competency is unsampled
- **confidence** (6 questions): some sampled competencies are low confidence
- **domain** (6 questions): otherwise, a deep dive on the selected domain

Up to 8 target competencies are kept.

`getEvidenceCompletionReadout` offers a separate route once the base count is reached (not in practice mode). It targets planned or priority competencies with fewer than 3 signals or less than high confidence, adds 4–10 questions, and caps the total at 60.

`continueAssessment` uses the **same question bank** and the same `selectNextQuestion`. Nothing is written specially for the extra round. It only raises the target count and replaces the target competencies (and, for a domain route, sets a target domain); that focus stays for the whole extra round. The "Continue with N targeted questions" button has no total cap.

### Adaptive difficulty and question selection

`getDifficultyFromLastAnswer` sets the target difficulty from the **last answer only**: ≥ 92 on a proficient item → advanced; ≥ 82 → proficient (advanced stays advanced); 55–81 → same level; < 55 → awareness. The first item's difficulty comes from the profile survey (`getProfileStartingDifficulty`).

`selectNextQuestion`:

- **Filters**: removes answered items; allows only one `reliance-decision` item per session.
- **First question**: a random item from the newest release (IDs ending `@2026-10-07.1`) if any, else a fixed starter list per mode or function track, matched to the starting difficulty.
- **Same-domain shortcut**: stays in the last domain when fewer than 2 questions in a row came from it, coverage is not at risk (unsampled domains < questions left), and the difficulty furthest behind its quota equals the target difficulty.
- **Ranking** (free and premium; executive weights in brackets):

| Input | Points |
|---|---|
| Seeded random tie-breaker | 0 to +1 |
| In target domain (always set in executive mode) | +44 [+56] |
| Measures a target competency | +52 |
| Domain below its profile target | +14 [+10] per missing question |
| In weakest domain (free/premium only) | +42 |
| Premium: matches function track / industry track | +26 / +16 |
| Distance from target difficulty | +30 − 10 × levels [+34 − 12 × levels] |
| Format (multi, rank, match, text) below its minimum | +24 |
| Has a visual while fewer than 4 [5] visuals asked | +22 [+18] |
| Is a `reliance-decision` item | −28 |
| Flagged for review | −72 |
| Last answer < 55 and item is awareness | +30 [+34] |
| Last answer ≥ 82 and item is proficient | +30 [+34] |
| Difficulty furthest behind its 20/30/30/20% quota | +46 |

Where the ranking inputs come from:

- **Target competencies**: in the main quiz, `getProfileTargetCompetencyIds` derives them from the function track, executive role and profile tags; a continuation replaces them with its route's targets.
- **Target domain**: set only by a domain-route continuation or, in executive mode, by `selectExecutiveDomain` (D5, D4, D6, D3 first, then the biggest gap against `executiveDomainTargets`).
- **Profile domain targets** (`getProfileDomainTargets`): free uses `freeAudienceDomainTargets` for the audience; premium blends function 55%, industry 25% and professional 20%, scaled to the total question count; executive uses `executiveDomainTargets`.
- **Weakest domain**: the biggest gap between profile target and questions asked, then the lowest score.
- **Format minimums**: free and premium need multi 2, rank 1, match 1, text 1; executive needs multi 3, rank 2, match 2.
- **Difficulty quota**: `getDifficultyCoverageNeed` picks the level furthest behind its share of the total; ties go to the harder level.
- **Seed**: a random number per session (`createAssessmentSeed`), reused for the extra round, so the same answers in one session lead to the same picks.

"Flagged" comes from the local behaviour log (`getQuestionQualityRows`): 2 or more negative feedback signals, ≥ 50% confusion, artifact risk, or a difficulty mismatch.

The pick is random (by seed) among up to 5 items within 8 points of the best (`chooseFromAdaptiveTier`). The quota bonus (+46) outweighs the difficulty bonuses (+30), so the next item does not always follow the last answer.

**End of questions**: when answers reach the target count, `submitAnswer` ends the session and shows feedback, then results. If the bank itself runs out, `selectNextQuestion` returns an already-answered item picked by seed, so the user sees and is scored on a repeat. It does not show an "out of questions" message.

### What is recorded

All data is saved in browser `localStorage`. When the user is signed in, it is also copied to Supabase (`user_profiles`, `assessment_sessions`, `assessment_behavior_events`, `assessment_feedback`).

- **Behaviour events** (`AssessmentBehaviorEvent`, key `new-horizon-behavior-log-v1`). Every event has an ID, created time, profile ID, session ID, type, mode, audience, function track, industry track and executive role. Other fields depend on the event type:

| Event | Extra fields |
|---|---|
| `assessment_started` | answer count (0), target count, `label` with the starting difficulty |
| `question_shown` | question ID, domain, competencies, difficulty, format, answer count, target count |
| `question_answered` | the `question_shown` fields plus duration, interaction count, revision count, hesitation, readiness score, selected option ID, selected answer (the full text of a written answer), correct option IDs |
| `question_feedback` | question ID, feedback kind (like / unclear / clear / comment), comment text |
| `artifact_opened` / `artifact_zoomed` / `artifact_external_opened` | question ID, artifact source path, action (reader / zoom / external), zoom level |
| `assessment_abandoned` | answer count, target count |
| `mandatory_completed` | answer count, required count, target count |
| `continuation_accepted` / `continuation_declined` | route kind, `label`, answer count, required count, target count |
| `results_viewed` | answer count, target count, overall score |
| `report_interest` | report area (radar, domain, competency, course, tool, coverage, continuation), `label`, domain. The profile pulse is logged here too, with the chosen options in `label`. |
| `assessment_feedback_submitted` | answer count, overall score |

  Hesitation is `confusing` (≥ 5 revisions, or ≥ 45 s with readiness < 58), `slow` (≥ 45 s or ≥ 5 interactions), `fast-clear` (≤ 12 s with readiness ≥ 72), else `clear`.
- **Score log** (`ScoreLogEntry`, `new-horizon-score-log-v1`), one per completed run: ID, created time, scoring model version, question bank version, user ID and email (when signed in), comparison group key and label, mode, audience, function, industry, executive role, domain scores, competency scores (score and evidence count), evidence-mode scores, overall.
- **Profile signal log** (`ProfileSignalLogEntry`, `new-horizon-profile-signal-log-v1`), one per completed run: the score log's identity, group and score fields plus profile ID, survey context, profile tags, raw survey answers, and one `QuestionSignalSnapshot` per answer:
  - question ID, question version, rubric version, artifact version
  - domain, secondary domains, competencies, skills, difficulty, type, format, evidence mode
  - score, option ID and label, correct option IDs, rubric hit IDs, part scores
  - written-answer length (not the text)
  - duration, interaction count, revision count, hesitation
- **End-of-quiz survey** (`AssessmentFeedbackSurvey`, `new-horizon-assessment-feedback-v1`): ID, session ID, profile ID, created time, group key, clarity, difficulty fit, artifact quality, length fit, suggestions.
- **User profile survey** (`UserProfileSurvey`, `new-horizon-user-profile-v1`): updated time, context, answers per question (the profile pulse answers are merged in), tags (max 18).
- **Sign-in profile** (`AuthProfile`, `new-horizon-auth-profile-v1`): Supabase user ID, email, name, avatar URL, provider, provider ID, and the **access token** in plain `localStorage`.
- **Simulated agent runs** (`SupervisedAgentRun`, `new-horizon-supervised-agent-runs-v1`): status, headline, summary, activity log, drafts, safety events.
- **Small flags and settings**: local profile ID, language, Thai-draft opt-in, whether the pulse was dismissed, display settings, report-access settings.

Supabase receives the user profile (survey answers and tags, provider ID, local profile ID), each completed session (score log fields plus profile tags and question signals, with the user's email), every behaviour event in full as `payload`, and each end-of-quiz survey.

Time and hesitation do not change scores or difficulty yet. `/api/results` stores question-inventory reviewer feedback, not quiz telemetry.

## Question bank and results report

Where the quiz questions come from, how they are stored and imported, where the reference data comes from, and what the user sees at the end. Search `app/page.tsx` for the names below.

### Storage and lookup

There is no question database. Every question is a TypeScript or JSON object in the repo, bundled into the app at build time. Supabase and D1 store users, sessions and reviewer feedback, never questions.

| Set | Where it lives | Used by |
|---|---|---|
| Live bank (634 + 229 release = 863) | `Question[]` arrays in `app/page.tsx` plus `app/productionQuestionRelease.ts` | The quiz |
| Thai text for the live bank | `app/questionTranslations.th.ts`, keyed by question ID, plus optional `*Th` fields on each item | `localizeQuestion` |
| Draft review inventory (3,328) | `exports/review-inventory/questions.json`, generated | `/admin/question-inventory` only, never the quiz |

There is no index. Questions are found by ID with a plain array search (`allAssessmentItems.find((item) => item.id === questionId)`), and routing filters each item's `domain`, `competencyIds`, `difficulty`, `type`/`interaction`, `functionTracks` and `industryTracks` on every pick (see [Adaptive difficulty and question selection](#adaptive-difficulty-and-question-selection)). The only `Map` lookups are built per call for analytics.

ID schemes:

- Hand-written live items: `<PREFIX>-<DOMAIN or track>-<NNN>`, for example `REL-G-D2-001`. Common prefixes: `EXEC-`, `DEPTH-`, `REL-H-` / `REL-G-` / `REL-E-`, `COMP-`, `CAL-`, `FUNC-`, `GEN-`. Template items use `ADV-*` and `TREND-*`.
- Draft inventory: `NH-{LAYER}-{SCOPE}-{COMPETENCY}-{DIFFICULTY}-{NN}` (`inventory/build-bank.mjs`), for example `NH-CORE-GENERAL-D1-CORE-CONCEPTS-AWARENESS-01`.
- Release items: the source ID plus `@<releaseId>`, for example `…-PROFICIENT-02@2026-10-07.1`.
- The score log records each answer's `questionVersion` as `<id>@<questionBankVersion>`, and `rubricVersion` as `rubric-2026-09-15-mvp`.

### Question bank

The 634 original ("live") questions are written in `app/page.tsx`, mostly by hand. The `ADV-*` and `TREND-*` items are built from templates per competency. The count comes from the release manifest (`baseLiveBankQuestions`) and the README.

| List | Contents |
|---|---|
| `generalRelianceQuestions`, `horizonRelianceQuestions` | Reliance-decision items |
| `functionalQuestionBank` | Function-track items |
| `competencyDepthQuestionBank` | Competency deep-dive items |
| `questionBank` | The free and premium bank: the lists above plus items written directly inside it |
| `executiveRelianceQuestions`, `executiveQuestionBank` | Executive items |
| `advancedCompetencyQuestionBank`, `marketTrendQuestionBank` | Template-generated `ADV-*` and `TREND-*` items |
| `executiveAssessmentQuestionBank` | `executiveQuestionBank` + `advancedCompetencyQuestionBank`, used in executive mode |
| `allAssessmentItems` | `questionBank` + `executiveQuestionBank`, used by admin analytics, artifact briefs and preview |

`getAssessmentBank` returns `executiveAssessmentQuestionBank` for executive mode and `questionBank` otherwise.

**Production release 2026-10-07.1** adds 229 bilingual questions, making 863:

- `app/productionQuestionRelease.ts` (generated, do not hand-edit) is spread at the **front** of `questionBank` as `productionQuestionRelease as unknown as Question[]`. There is no merge step, and the cast turns off type checking, so missing fields do not fail the build.
- Every ID gets the suffix `@2026-10-07.1`, and `sourceQuestionId` keeps the original ID, so a release item can never overwrite a live one. The release is append-only (`replaceLive: 0`).
- 125 items are new, taken from the draft review inventory (`source: "draft-inventory"`). 104 are rewrites of live questions (`source: "live-bank"`). The old versions are not removed, and nothing reads `sourceQuestionId`, so both versions can be served. Only 17 of the 104 old IDs appear literally in `page.tsx`; the rest are template IDs such as `TREND-*`.
- Release items are in `questionBank` only, so **executive mode never serves them**. They do appear in `allAssessmentItems`.
- `questionBankVersion` (saved in the score log) is still `question-bank-2026-09-15-mvp` and was not bumped for the release.
- The release package is in `exports/production/releases/2026-10-07.1/`: `release-questions.json` (229 records), `question-ids.json` and `manifest.json`. The manifest records status `production-import-ready`, source branch `new-horizon/kj-dee-branch` at `5794850`, feedback file `exports/review-inventory/feedback-application-2026-10-06.json`, 48 remaining collaborator issues, previous release `2026-09-30.1` and rollback snapshot `exports/review-inventory/versions/2026-10-07.1/questions-previous.json`. It is not connected to an external importer.

### Draft review inventory

The 3,328 draft items are generated, not written: 768 core, 1,296 function, 320 industry and 944 executive variants that share 96 competency/difficulty families and 384 base evidence patterns. They are coverage variants, not calibrated independent items.

- **Generator**: `inventory/build-bank.mjs` (`generateInventory`, `validateInventory`; `inventoryVersion` `2026-09-30.1`). It combines four evidence cases per competency and difficulty from the blueprint files (`foundations.mjs` D1, `application.mjs` D2, `evaluation.mjs` D3, `governance.mjs` D4, `strategy.mjs` D5, `collaboration.mjs` D6) with role contexts (`contexts.mjs`), role overlays (`overlays.mjs`) and distractors (`distractors.mjs`). `{{deliverable}}` and `{{source}}` placeholders are filled from the context.
- **Platform model**: the generator reads competencies, domains, track labels and the live bank straight out of `app/page.tsx` through `scripts/lib/read-platform-model.mjs`. It evaluates the data section above `const learningCatalog:` in a VM, so moving that line breaks the generator.
- **Run**: `node scripts/generate-review-inventory.mjs` writes `questions.json`, `coverage.json` and `samples.md` to `exports/review-inventory/`. Later scripts add English rewrites, Thai and artifact needs (`pnpm inventory:refine`).
- **Record fields**: `id`, `version`, `layer`, `scope`, `domain`, `competencyIds`, `skillIds`, `difficulty` (with `difficultyStatus: provisional`), `type`, `interaction`, `evidenceMode`, `recommendedFormat`, `context`, `prompt`, `options[{id,label,score,feedback}]`, `correctOptionIds`, `rationale`, `userFacingDraft` (the rewritten English, with Thai `thLabel` / `thFeedback` on options and `th` for context and prompt), `th`, `familyId`, `casePatternId`, `variant`, `review`, `qualityFlags`, `artifactNeed`, `provenance`, `contentHash`.
- **Live-bank export**: `scripts/export-live-question-inventory.mjs` writes `exports/review-inventory/live-questions.json` so reviewers see live items beside drafts. It holds 660 base items plus the 229 release items, more than the 634 the manifest records.
- **Reviewer assets**: `scripts/build-review-inventory-assets.mjs` (runs before every `pnpm dev` and `pnpm build`) splits both files into `public/review-inventory/summary.json`, `index.json` and `detail/<id>.json`, which `/admin/question-inventory` fetches.
- **Snapshots**: `exports/review-inventory/versions.json` registers dated, frozen snapshots (`YYYY.MM.DD V.N`, latest `2026.10.06 V.0`) in `versions/`, each with a SHA-256 the asset builder checks. See `docs/QUESTION_INVENTORY_VERSIONS.md`.

### Imports and file formats

Nothing imports questions at runtime. Each "import" is a script that writes a file into the repo, which then ships with the next build.

| What | Input | Script | Output |
|---|---|---|---|
| Promote reviewed items to live | Draft and live exports plus a collaborator feedback file | `scripts/prepare-production-release.mjs` (release ID and source branch hard-coded) | `exports/production/releases/<id>/` |
| Release package to app | `release-questions.json` | `scripts/build-assessment-release-module.mjs` | `app/productionQuestionRelease.ts` (see [Release build script](#release-build-script)) |
| Thai for live questions | Reviewed workbooks `exports/New_Horizon_Thai_Review_Batch*.xlsx` | Localisation batch tooling (see `docs/LOCALISATION.md`) | `app/questionTranslations.th.ts` (generated, do not hand-edit) |
| Thai for the draft inventory | Sentence dictionary and terms in `inventory/th/` (`sentences.json`, `context-terms.json`, `reviewed-rewrites.json`); rule-based, no AI | `scripts/apply-thai-review-translations.mjs` | `th` fields in `questions.json`, plus `thai-translation-qa.json` and `thai-translation-missing.json` |
| Reviewer feedback | JSON downloaded from the reviewer page | `node scripts/import-inventory-feedback.mjs <download.json> <reviewer-alias>` | `exports/review-feedback/cloudflare/<alias>.json` |

**Release package** (`exports/production/releases/<id>/`):

- `release-questions.json`: array of `{ id, promotionAction, source, question, feedbackStatus, thaiStatus }`. `source` is `draft-inventory` or `live-bank`; `question` is a full draft-inventory record with `version`, `promotionAction: "add-to-live"` and `productionReleaseId` set.
- `question-ids.json`: the IDs, checked for duplicates.
- `manifest.json`: `releaseId`, `status`, `source`, `authorization`, `inventory` counts (`addToLive`, `replaceLive`, `baseLiveBankQuestions`), `validation`, `rollback` and `files`.
- The script fails if an ID is missing or duplicated, or if any item lacks Thai context, prompt or option labels.

**Reviewer feedback export** (`schemaVersion: 2`, built by `review-sync.tsx` in `app/admin/question-inventory/` and `deploy/inventory-preview/`):

```json
{ "schemaVersion": 2, "reviewer": "alias", "exportedAt": "…",
  "batches": [{ "release": { "contentVersion": "<sha256>", … }, "contentVersion": "<sha256>",
    "questions": { "<questionId>": { "entries": [
      { "id": "…", "savedAt": "<ISO date>", "decision": "", "rating": "", "clarity": "",
        "artifact": "", "format": "", "comment": "", "suggestedChange": "" } ] } } }] }
```

`mergeFeedback` (`scripts/lib/inventory-feedback.mjs`) checks the alias and IDs (`[A-Za-z0-9._-]`, max 200), the 64-hex content version, at most 1,000 batches, string fields up to 100,000 characters and a 50 MB file limit. It only adds entries: an entry whose ID already exists with different content stops the import. Older exports without `batches` are stored as `legacy-unversioned`. The import never changes question files.

### Where the reference data comes from

All hard-coded in `app/page.tsx`. Nothing is loaded from an API or a database.

| Data | Name | Source |
|---|---|---|
| Domains D1–D6 | `domains`, `domainBadges` | Hand-written |
| Framework mapping | `globalFrameworkCrosswalk`, `frameworkSourceLinks` | UNESCO, OECD/EC, NIST AI RMF, EU AI Act Article 4, DigComp 2.2, ISO/IEC 42001, AI Verify, Gartner, McKinsey, BCG; explained in `docs/GLOBAL_AI_FRAMEWORK_CROSSWALK.md` |
| 24 competencies (4 per domain) and their skills | `competencyDefinitions` | Hand-written; the draft generator reads them too |
| Difficulty levels and readiness bands | `difficultyLabels`, `difficultyDescriptions`, `difficultyReadinessBands` | Seeded values, not calibrated |
| Result levels | `scoreToLevel`, `getScoreBandDescription` | Seeded thresholds (see [Scoring](#scoring)) |
| Benchmarks and targets | `audienceBenchmarks`, `functionBenchmarks`, `industryBenchmarks`, `executiveBenchmarks` | Seeded values, not measured |
| Course links (27) | `learningRecommendations` | Curated by hand with URL, provider, level, price and fit: CHULA MOOC, Chula + MHESI + AIS, Department of Skill Development + Microsoft, Thailand Digital Government Academy, ARIT, BDI LEAD, AITSPIN, AIAT, BOTNOI, Skooldio, SkillLane, Coursera (DeepLearning.AI, IBM, Vanderbilt), DeepLearning.AI, AIEAT |
| Learning path per domain | `learningCatalog`, `executiveLearningCatalog` | Hand-written, no links |
| Bootcamps (8) | `bootcampCatalog` | The company's own programs; described in `docs/AI_BOOTCAMP_WORKSHOP_CATALOG.md` |

`pnpm crawl:training` (`scripts/crawl-ai-training.mjs`) finds candidate courses on Microsoft Learn, DeepLearning.AI, Google Cloud, AWS and Coursera and writes a review report to `.agent-drafts/`. Adding a course still means editing `learningRecommendations` by hand.

### Release build script

`scripts/build-assessment-release-module.mjs` reads `release-questions.json` and writes `app/productionQuestionRelease.ts`. It has no `package.json` script and the release path is hard-coded, so run it by hand (`node scripts/build-assessment-release-module.mjs`). It prints the question count and how many have both Thai context and prompt.

Each record has `id`, `promotionAction`, `source`, `question`, `feedbackStatus` and `thaiStatus`. The script reads only `record.question` (`q`) and its reviewed rewrite `q.userFacingDraft` (`draft`):

1. **Rewrite first, original second** (`??`): `context`, `prompt` and `interaction` from `draft`, else `q`; `rationale` from `draft.explanation`, else `q.rationale`; `correctOptionIds` from `draft`, else `q`; `options` from `draft.options` only if non-empty, else `q.options`; `contextTh` and `promptTh` from `draft.th`, else `q.th`, else `q.contextTh` / `q.promptTh`.
2. **Two-part items** (`draft.interaction === 'parts'`, unless `q.parts` exists, which no record has): the script builds two parts itself. It splits each option label at `;`, uses the first half for part 1 and the second for part 2, removes duplicates, and scores the half from the correct option 100 and every other half 0 (feedback `Correct.` or a fixed English line). Part IDs are `part-1` and `part-2`, option IDs `answer-0`, `answer-1`, …, and the prompts are always "Which finding best explains the situation?" and "Which action best fits the situation?". Each part's `promptTh` is set to the whole question's Thai prompt.
3. **Renames**: option `thLabel` → `labelTh`, `thFeedback` → `feedbackTh`.
4. **Fixed values**: `id` = `${q.id}@2026-10-07.1`, `sourceQuestionId` = `q.id`, `translationStatus` = `'reviewed'`, `typeVersion` = `'2026-10-07.1'`.
5. **Defaults**: `type` not in the allowed set (`scenario`, `media`, `judgment`, `multi-select`, `drag-order`, `matching`, `report-review`, `narrative`, `fraud-detection`, `reliance-decision`, `concept-cluster`) → `'scenario'`; `interaction` → `'single'`; `evidenceMode` → `'hybrid'`; missing arrays → `[]`; missing text → `''`.

Kept: `domain`, `difficulty`, `competencyIds`, `skillIds`, `functionTracks`, `industryTracks`, plus the fields above.

**Dropped fields that change behaviour (known defects):**

| Dropped or changed | Effect |
|---|---|
| `draft.parts` (120 items; their top-level `draft.options` are empty) | The authored parts, with their own prompts, Thai prompts and answer keys, are ignored and replaced by the split-label parts from step 2. |
| Answer keys for `rank` (4), `match` (4) and `text` (3) items: `idealOrder`, `rankItems`, `matchPairs`, `rubricCriteria` | Not in the JSON and not built by the script. `scoreOrder`, `scoreMatches` and `scoreTextAnswer` return 0 without them, so these 11 items always score 0. |
| Options with no `score` (5 items: `NH-CORE-GENERAL-D1-CORE-CONCEPTS-AWARENESS-01` to `-04` (single) and `NH-CORE-GENERAL-D1-CORE-CONCEPTS-ADVANCED-01` (rank)) | None of their options has a score. `submitAnswer` passes `option.score` (undefined) to `getReadinessScore`, giving `NaN`, which spreads into the domain and overall scores. |
| `q.executiveRoles` (101 items) | Executive-role targeting is lost. |
| `draft.th.explanation` / `q.th.rationale` | No `rationaleTh`; the explanation shows in English only. |
| `thaiStatus: "synchronized-needs-native-review"` (all 229) | Overwritten with `translationStatus: 'reviewed'`, so Thai still awaiting native review is shown to everyone, not only to Thai-draft pilot testers. |
| `q.contentHash` | No content version to tie results or feedback to. |

Dropped review and tracking metadata (no runtime effect): `version`, `locale`, `layer`, `scope`, `scopeLabel`, `competencyLabel`, `difficultyStatus`, `cognitiveTask`, `recommendedFormat`, `familyId`, `casePatternId`, `variant`, `scoring`, `review`, `qualityFlags`, `readability`, `sourceScenario`, `provenance`, `artifactNeed`, `sourceInventory`, `promotionAction`, `productionReleaseId`, `sourceBank`, `functionLabels`, `industryLabels`, `executiveLabels`; and from `draft`: `status`, `format`, `rewriteNotes`, `rewriteVersion`, `rewriteRulesVersion`, `rewriteReviewStatus`, `ruleApplication`, `englishWordingReview`, `reviewedFormat`, `feedbackReview`, `reviewedWordingSource`, `wordingReviewSource`; and the record-level `feedbackStatus` and `thaiStatus`.

### Results screen

Rendered in the `step === 'results'` block. Everything is computed in the browser from the answers (see [Scoring](#scoring)); no uploaded results file or AI service is involved.

**Header (all users)**: mode label (Indicative MVP result, Premium diagnostic pilot, Premium leadership diagnostic, or Practice activity result); overall score; level (Limited, Developing, Applied, Proficient, Advanced); answer count and audience; confidence %; band description (`getScoreBandDescription`); function and industry (premium) or executive role (executive) context; `RadarChart` of D1–D6 comparing the user, the group average and the target profile, with a clickable domain.

The six domains (`domains`): D1 AI Foundations & Concepts, D2 Practical Application & Tooling, D3 Critical Evaluation & Judgment, D4 Risk, Ethics & Governance, D5 Strategy & Value Realization, D6 Human-AI Collaboration.

**Tabs**: Summary for everyone. Question review only when `paidReport` and `reportAccessSettings.paid.questionAnalysis` are on; free users get an "Unlock the detailed assessment report" card instead. The "How this result was derived" score-calculation card belongs to the analysis view.

**Summary cards**: score interpretation (your score, group average, target profile); personalised Did you know; continuation offer, including "Continue beyond 20 until confidence is high"; Top 10 leaderboard for the user's group (anonymous); what the assessment tracks and why; feedback survey that unlocks detailed evidence; generated report (headline, summary, what this means); domain scorecard; assessment coverage plan; user profile signals; domain evidence quality; competency drill-down for the selected domain; saved score analytics; strengths; priority gaps; knowledge vs practical skill; readiness badges; competency and skill scores; learning path (recommended, premium or executive); Thailand course recommendations; recommended bootcamps and workshops; where to improve next; evidence summary; "Ready for a deeper profile?".

**Where the content comes from**:

- The report text is a template in `getGeneratedReport`, filled with the scores, benchmarks, coverage, evidence modes, improvement brief, tools and courses. Its `productionNote` says MVP mode calls no AI API.
- Targets and benchmarks are hard-coded: `audienceBenchmarks`, `functionBenchmarks`, `industryBenchmarks`, `executiveBenchmarks`, blended by `getBenchmarkProfiles`.
- Courses and bootcamps are hard-coded lists (`learningRecommendations` and others) ranked by `getLearningRecommendations` and `getBootcampRecommendations`.
- Group averages and the leaderboard come from the local score log (`averageScoreLog`, `getPersonaLeaderboard`); the landing-page leaderboard falls back to `demoLandingLeaderboard`.
- After display, the run is saved to the score log and profile signal log, and to Supabase when signed in (see [What is recorded](#what-is-recorded)). Nothing posts quiz results to `/api/results`.

`HORIZON45_ASSESSMENT_REPORT_PAGE_TH.md` is a Thai spec for a redesigned results page (4 domains, 5 Horizon levels in 20-point bands, a 30-60-90 day plan). It is not built; the code still uses D1–D6 and the five levels above.

## AI Watch and AI Labs

AI news and practice exercises, separate from the scored assessment. Both are a local release (`watch-labs-local-v1`, 28 September 2026): they run with `pnpm dev`, but no workflow deploys them. The plan is in `docs/AI_WATCH_LABS_ENGAGEMENT_ROADMAP.md`, the built slice in `docs/AI_WATCH_LABS_LOCAL_RELEASE.md`, story rules in `docs/AI_WATCH_AWARENESS_CURATION.md`, and planned LLM costs in `docs/AI_WATCH_API_COSTS.md`.

### Intended product

The journey is **discover → understand → practise → save a useful result → return**. Watch is the entrance, Labs the practice, and the assessment an optional baseline; neither needs an assessment first.

- **Watch**: a small personalised edition of AI stories across agent capabilities, collective risks, new models and everyday impact. Each story gives what happened, why it matters, the evidence type and its limits (reported case, observed incident, demonstration, simulation, preprint or vendor claim), and one practice action. Planned pipeline: discovery agent → duplicate and source-date checks → evidence classification → media provenance checks → summary and "Did you know" hook → human editorial review → versioned publication → correction, expiry and broken-media monitoring. Later formats: original visuals and an audio brief.
- **Labs**: 3–15 minute exercises linked to stories, in the order brief → inspect → attempt → feedback → revise → takeaway, with resume, skill series and opt-in reminders. Free-text answers would be checked by a bounded LLM evaluator with a versioned rubric. Lab progress never counts as assessment readiness.

### What is built

| | Built | Not built |
|---|---|---|
| Watch (`app/watch-labs.tsx`, `app/watch-model.ts`, `app/watch-labs.css`) | For you / Explore / Saved tabs. Optional setup: up to 3 interests, time budget, goal. A deterministic ranker (no AI) picks a 3-story edition with one exploratory pick and media variety, and shows the reason. Topic mutes are hard filters. Saved items ignore filters; unknown saved IDs show as unavailable with a remove button. Click-to-load YouTube players, no autoplay, publisher link kept (`app/watch-media.tsx`). Stories link to a related Lab and back, keeping filters. | Automatic discovery feeding the app, editorial queue, publish/withdraw, freshness expiry, Thai story summaries (marked English with a Thai notice), digest or notification delivery (the misleading cadence control was removed). |
| Did you know (`app/watch-awareness.tsx`, imported as `AwarenessFlash`) | Home-page cards drawn from the same `trendFeed` stories that have a bilingual `awareness` hook, ranked by the Watch interests, excluding muted topics. "Another story" button, no timer or animation. | Shared publication with Watch through a real pipeline. |
| Labs (`app/connected-labs.ts`) | Two bilingual EN/TH fictional Labs, `agent-boundaries` and `evidence-check` (4 minutes each). Each has two multiple-choice decisions, per-answer feedback, revision, optional notes and a saved takeaway; rules grade the decisions, never the notes. The 7 older Labs (`labConfigs`, kinds `ownership`, `proof`, `next`, `prompt`, `media`, `workflow`, `trust`; graded by `evaluateLab`, opened by `startLabActivity`) still exist. | LLM grading of written answers. The old `prompt` Lab only matches English keywords, so the UI calls them "checklist cues" and the model answer "an example". Human pilot review before hosting. |

Navigation: primary nav buttons or `/?view=watch` and `/?view=labs` (internally `step` `'news'` and `'learningLabs'` in `app/page.tsx`). The dashboard also shows `dashboardNews`, filtered by weak domains and profile tags, falling back to the first 4 `trendFeed` items.

### Where the data comes from

- **Stories**: about 34 entries hand-written into `trendFeed` in `app/page.tsx` (search `const trendFeed`). Each has `id`, `contentVersion`, `topic`, optional `relatedLab` and `awareness` hook, title, summary (`signal`), source, date, URL, domain, media type and references. Publishers include Anthropic, Google DeepMind, OpenAI, Epoch AI, Axios, Stanford HAI, METR, NHTSA, Waymo, RoboCup, Microsoft WorkLab, an arXiv preprint, CNN, South China Morning Post and Google Korea (YouTube). Dates run from May to 25 September 2026; a few say only "2026", and the Pip story says its publication date is unverified. Source checks were manual, on 29 September. The stories are real but a frozen snapshot: changing them means editing code and going through review.
- **Media**: images and videos are hotlinked from publishers, never downloaded. Pip's avatar was removed because reuse permission was not established. Never generate news images.
- **Labs**: hand-written in `app/connected-labs.ts` and `labConfigs`, separate from the question bank.
- **User state**: browser `localStorage` key `new-horizon-watch-labs-v1:<ownerId>` (signed-in profile ID or local profile ID): preferences, saved story IDs, current feed and filter, active Lab and origin story, Lab drafts and takeaways. Parsing limits lengths and recovers from corrupt or unknown-version data. The component remounts when the identity changes. No account sync, server analytics or AI calls.
- **Discovery crawler (does not feed the app)**: `scripts/crawl-ai-watch.py` (`pnpm crawl:news`) reads `config/ai-watch-discovery.json`. Sources: Hugging Face blog RSS, arXiv cs.AI RSS, two iLands pages, and the TypeSafe Jev announcement page. It sorts candidates into four lanes (agent-capabilities, collective-risks, models-and-technologies, everyday-impact) by keyword, with robots checks, URL dedupe and metadata fingerprints. It keeps metadata only, no article text or summary, and uses no LLM. Output: `.agent-drafts/ai-watch/latest.json`. `.github/workflows/ai-watch-discovery.yml` runs it daily at 02:23 UTC and uploads the JSON as an artifact kept 30 days, reporting "Published: 0". arXiv article fetches returned HTTP 406 on the first live runs. An editor must still write a summary and add it to `trendFeed` by hand.
- **Planned LLM**: DeepSeek Flash for classification, summaries and first-pass translation, Qwen for Thai if better; estimated $7–30 a month for about 12,000 articles (200 per scan, 2 scans a day). Not set up. Keys must stay server-side.
- `scripts/crawl-ai-training.mjs` (`pnpm crawl:training`) is a separate Playwright crawler of AI course pages (Microsoft Learn, DeepLearning.AI, Google Cloud, AWS), unrelated to Watch.

Tests: `pnpm test:watch-labs` (12 tests: storage recovery, stable IDs, filters, ranking, Lab evaluation, bilingual completeness, video URL rules) and `python3 scripts/test-crawl-ai-watch.py` (5 offline crawler tests).

### Cloudflare Worker scope

The Worker serves none of Watch, Labs or the main app. `scripts/build-inventory-cloudflare.mjs` builds a separate app, `new-horizon-question-inventory-test`, containing only `/admin/question-inventory` (home redirects there, labelled "Cloudflare test preview · Draft content · Inventory only"), `public/review-inventory`, `public/stimuli`, and `/api/results` on D1 database `new-horizon-inventory-results`. Of its two tables, only `question_feedback` is used (reviewer comments per content version, read by the reviewer and its results page). `result_events` is written by any non-feedback POST, but nothing calls it. `.github/workflows/question-inventory.yml` builds, smoke-tests and deploys it on pushes to `main` that touch the inventory. The endpoint has no auth (see Authentication).
