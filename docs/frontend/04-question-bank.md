# 4. The question bank and results report

**The question bank is frozen for the Event Demo phase** (see [`../SCOPE.md`](../SCOPE.md)). This document explains it so feature work reads from it correctly, not so it can be changed.


Where the quiz questions come from, how they are stored and imported, where the reference data comes from, and what the user sees at the end. Search `app/page.tsx` for the names below.

## Storage and lookup

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

## Question bank

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

## Draft review inventory

The 3,328 draft items are generated, not written: 768 core, 1,296 function, 320 industry and 944 executive variants that share 96 competency/difficulty families and 384 base evidence patterns. They are coverage variants, not calibrated independent items.

- **Generator**: `inventory/build-bank.mjs` (`generateInventory`, `validateInventory`; `inventoryVersion` `2026-09-30.1`). It combines four evidence cases per competency and difficulty from the blueprint files (`foundations.mjs` D1, `application.mjs` D2, `evaluation.mjs` D3, `governance.mjs` D4, `strategy.mjs` D5, `collaboration.mjs` D6) with role contexts (`contexts.mjs`), role overlays (`overlays.mjs`) and distractors (`distractors.mjs`). `{{deliverable}}` and `{{source}}` placeholders are filled from the context.
- **Platform model**: the generator reads competencies, domains, track labels and the live bank straight out of `app/page.tsx` through `scripts/lib/read-platform-model.mjs`. It evaluates the data section above `const learningCatalog:` in a VM, so moving that line breaks the generator.
- **Run**: `node scripts/generate-review-inventory.mjs` writes `questions.json`, `coverage.json` and `samples.md` to `exports/review-inventory/`. Later scripts add English rewrites, Thai and artifact needs (`pnpm inventory:refine`).
- **Record fields**: `id`, `version`, `layer`, `scope`, `domain`, `competencyIds`, `skillIds`, `difficulty` (with `difficultyStatus: provisional`), `type`, `interaction`, `evidenceMode`, `recommendedFormat`, `context`, `prompt`, `options[{id,label,score,feedback}]`, `correctOptionIds`, `rationale`, `userFacingDraft` (the rewritten English, with Thai `thLabel` / `thFeedback` on options and `th` for context and prompt), `th`, `familyId`, `casePatternId`, `variant`, `review`, `qualityFlags`, `artifactNeed`, `provenance`, `contentHash`.
- **Live-bank export**: `scripts/export-live-question-inventory.mjs` writes `exports/review-inventory/live-questions.json` so reviewers see live items beside drafts. It holds 660 base items plus the 229 release items, more than the 634 the manifest records.
- **Reviewer assets**: `scripts/build-review-inventory-assets.mjs` (runs before every `pnpm dev` and `pnpm build`) splits both files into `public/review-inventory/summary.json`, `index.json` and `detail/<id>.json`, which `/admin/question-inventory` fetches.
- **Snapshots**: `exports/review-inventory/versions.json` registers dated, frozen snapshots (`YYYY.MM.DD V.N`, latest `2026.10.06 V.0`) in `versions/`, each with a SHA-256 the asset builder checks. See `docs/QUESTION_INVENTORY_VERSIONS.md`.

## Imports and file formats

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

## Where the reference data comes from

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

## Release build script

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

## Results screen

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
