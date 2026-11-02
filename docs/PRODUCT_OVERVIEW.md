# Product overview

What New Horizon is and does, as a product. Moved from the root `README.md` on
2026-10-28 so the README can hold setup and commands. Nothing was removed.
Statements here describe the product and its roadmap. For what is being built
**now**, read [`SCOPE.md`](SCOPE.md); for how the code works, read
[`frontend/`](frontend/README.md).

## Draft Question Inventory

A separate **3,328-item draft review inventory** is now tracked on `main`: 768 core, 1,296 function, 320 industry, and 944 executive variants. The draft bank includes English content plus machine-assisted Thai review fields for the question inventory workflow. It also includes recommended live formats, artifact-need analysis, user-facing rewrite drafts, review metadata, and translation QA output. The items share 96 decision families and 384 base evidence patterns; they are coverage variants, not calibrated independent items.

The existing **634 live questions remain separate** and are exported for side-by-side admin review. Use the admin inventory page at `/admin/question-inventory` to review draft and live questions, switch English/Thai at page and question level, filter by domain/competency/difficulty/profile, and capture reviewer ratings/comments locally. See [the milestone guide](docs/QUESTION_INVENTORY_MILESTONE.md), [rewrite rules and versioning standard](docs/QUESTION_REWRITE_RULES.md), [artifact design and QA standard](docs/ARTIFACT_DESIGN_AND_QA_STANDARD.md), [question version history](exports/review-inventory/question-version-history.json), [review workbook](exports/review-inventory/new-horizon-3328-review.xlsx), [question JSON](exports/review-inventory/questions.json), [live-bank export](exports/review-inventory/live-questions.json), [artifact needs](exports/review-inventory/artifact-needs.md), and [Thai translation QA](exports/review-inventory/thai-translation-qa.json).

### Assessment release 2026-10-07.1

The assessment now appends 229 bilingual rewrite/retranslation records to the existing 634 live questions, for a combined assessment pool of 863 items. Existing live records are preserved; the new records use versioned runtime IDs so matching source IDs cannot overwrite live questions. The release package and append-only manifest are in [exports/production/releases/2026-10-07.1](exports/production/releases/2026-10-07.1). Local access is `pnpm build && pnpm start`, then [http://localhost:3000](http://localhost:3000). The release is not yet connected to an external production importer.

Collaborators can run only the question-review surface locally without configuring Supabase or an AI API. Follow [Review the question inventory locally](docs/QUESTION_INVENTORY_LOCAL_REVIEW.md) for the recommended full clone, an inventory-only sparse checkout, a data-only checkout, local URLs, update commands, and the current browser-local feedback limitation.

The formal external-review sequence is documented in [Question Inventory: Internal Review to Hosted Feedback Pilot](docs/QUESTION_INVENTORY_REVIEW_TO_HOSTING_PROCESS.md). English rewriting, rubric/artifact QA, Thai equivalence review, inventory regeneration, a frozen release manifest, and central feedback storage remain requirements for that pilot. A separate public Cloudflare technical preview is already available for testing draft content; it currently uses browser-local feedback, as described below.

## What It Includes

- Public landing page for the New Horizon assessment platform
- Simplified public tiers: Free Assessment and Premium Diagnostic, with executive/leadership context handled inside Premium
- Home-page tabs for global AI framework mapping and transparent scoring/adaptive-testing logic
- Free, premium, executive, and function-aware assessment flows
- Adaptive question routing with visible difficulty and psychometric/IRT-style indicators
- Multimodal and artifact-based question bank with realistic screenshots, invoices, dashboards, logs, source excerpts, workflows, and fraud/media-review tasks
- Full-size artifact reader with zoom controls for text-heavy screenshots, workflows, dashboards, and documents
- Artifact relevance gate that hides decorative, redundant, generic, or non-evidence artifacts during scored assessment
- Market-trend question bank covering agents, multimodal/video AI, RAG/context engineering, domain models, responsible AI benchmarking, governance, and workforce change
- Rights-aware AI Watch curation for articles and relevant short/long video, with canonical source links, media filters, human review, and no third-party media rehosting
- Domain and competency scoring across D1-D6
- Radar graph with user, group average, and target profile comparison
- Domain drilldown into competency scores
- Continue-assessment option after mandatory 12/20-question routes when confidence or coverage is weak
- Assessment-mapped AI bootcamp/workshop recommendations with expandable details for audience, learning outputs, rationale, labs, and framework alignment
- User profile builder and signal logging
- Optional landing-page profile pulse that asks for current AI interests and routes later questions accordingly
- Per-question behavior telemetry for timing, revisions, hesitation, selected versus expected answers, abandonment, mandatory completion, optional continuation, and report engagement
- End-of-assessment feedback exchange that unlocks question-level response and local benchmark analysis
- Top-10 score leaderboard scoped to the user's assessment persona/group
- Anonymous leaderboard display by default, with real names or aliases reserved for future explicit opt-in
- Landing-page daily/weekly top-10 teaser and peer-insight cards to motivate users to see where they rank
- Registered user dashboard with profile, progress, recommendations, learning paths, and personalized AI Watch
- Admin dashboard preview for cohort, function, role, domain, competency, difficulty, item-format, and trend analysis
- Supervised quality-improvement queue driven by telemetry and survey feedback, plus realistic artifact replacement briefs
- Admin Agent Ops with persisted supervised runs, telemetry-driven draft proposals, promotion gates, approval/rejection states, activity reports, and safety-cut handling for repeated loops
- Personalized "Did you know?" prompts that use profile signals and weak domains to teach timely AI concepts and invite deeper learning
- Global framework crosswalk mapping D1-D6 to UNESCO, OECD/EC, NIST AI RMF, EU AI Act, DigComp, ISO/IEC 42001, AI Verify, and AI literacy research
- Learn by Doing labs for prompt repair, proof check, media check, workflow lab, trust room, task ownership, and next action
- Supabase schema draft for user profiles and assessment sessions

## Language Support

The app supports English and Thai through the `EN` / `TH` toggle in the top navigation. The selected language is stored in local browser storage with `new-horizon-language-v1`.

Thai copy should be simple, natural Thailand Thai. Do not translate core technical terms that users need to recognize in the market or tools, including AI, Workflow, Prompt, Model, Agent, API, RAG, LLM, ROI, KPI, Domain, Competency, telemetry, Platform, and Assessment.

Thai lives in two deliberately separate places:

- **Legacy interface chrome** (navigation, buttons, report labels, survey text) is translated by the `thaiUiCopy` dictionary in `app/page.tsx`, which maps exact English strings to Thai at render time. Add legacy UI strings there. The connected Watch/Labs surface owns its bilingual React copy in `app/watch-labs.tsx`, `app/watch-model.ts`, and `app/connected-labs.ts`; `data-no-translate` keeps the legacy DOM pass from rewriting that surface.
- **Question content** (scenarios, prompts, answer choices, feedback, rank steps, matching pairs, rubric keywords, artifact captions) is translated per question id: optional `*Th` fields beside the English on the item, plus the generated table `app/questionTranslations.th.ts` produced from the reviewed translation workbook. `localizeQuestion()` merges them with English fallback and only for items that carry a `translationStatus`. Never add question text to `thaiUiCopy`, and never hand-edit the generated table; see `docs/LOCALISATION.md` for the review workflow and status rules (`draft` → `reviewed` → `approved`).
- **Template-generated questions** (`ADV-*`, `TREND-*`) take their Thai from the translated frames and from the competency vocabulary (`competencyLabelsTh`, `skillLabelsTh`), which also lets competency and skill names in reports follow the language toggle. Any item still at `draft` is shown only to pilot testers who set `localStorage['new-horizon-thai-drafts-v1'] = '1'` (none at the moment).

Continuous integration (`.github/workflows/ci.yml`) runs lint, a TypeScript error budget, the production build, and a question-bank integrity check (unique ids, translations point at real questions) on every push and pull request to `kj-dee-branch` and `main`, so a merge that breaks the build cannot sit unnoticed on the branch.

> **Correction (2026-10-28):** the paragraph above describes `.github/workflows/ci.yml`, which no longer exists. No workflow runs lint or `tsc` on the main app today; see "Deployment and caching" in the root `CLAUDE.md` for what CI runs.

## Google and Email Auth

The MVP includes a browser-side Supabase auth bridge for Google OAuth and email magic links. Add these environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

In Supabase:

- Enable Google provider under Authentication providers
- Add Google OAuth client id/secret
- Add local and deployed URLs to Supabase redirect allow-list
- Run `supabase-schema.sql` in the Supabase SQL editor

Google login seeds basic identity only: Supabase user id, email, display name, avatar URL, provider, and provider id. New Horizon still collects role, function, tools, AI usage, learning interests, and assessment behavior through its own profile builder.

## Vercel Deployment

Recommended Vercel environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The MVP report flow includes a detailed report panel, but it is produced locally from assessment scores, competency evidence, learning catalogs, and profile signals. It does not require an API key and does not call an external AI provider from browser code. The documented Premium Report Copilot is an MVP go-live requirement and is not implemented in the current prototype.

The MVP Agent Ops flow is local and deterministic. It includes persisted supervised runs in browser storage, plus a legacy simulation view. The active supervised run reads local telemetry, feedback, profile snapshots, and artifact counts, then produces draft proposals owned by the orchestrator, assessment blueprint agent, AI concepts scout, AI newsfeed agent, training/course scout, assessment item generator, stimulus builder, feedback analysis agent, psychometric monitor, data quality monitor, localization QA agent, report UX agent, framework alignment agent, and reviewer/QA agent. Each proposal must move through review and promotion gates before publishing. It does not publish content, rewrite scored items, or call an external AI provider from browser code.

Production AI-generated reports and the Premium Report Copilot must run through server-side routes. Platform or tenant administrators select approved provider/model routes from versioned Admin Settings. Provider credentials, including optional tenant-managed credentials, must be stored as encrypted server-side secret references. Never ask users to paste a raw LLM key into browser storage or expose provider keys to browser code.

## Supabase Tables

See:

- `docs/FEATURE_CATALOG_BY_USER_AND_RELEASE.md`
- `docs/B2C_B2B_USER_ADMINISTRATION.md`
- `docs/ADMIN_SETTINGS_CONFIGURATION.md`
- `docs/LEGAL_PRIVACY_PDPA_TERMS.md`
- `supabase-schema.sql`
- `docs/AGENT_WORKFLOWS_ORCHESTRATION.md`
- `docs/TELEMETRY_TRACKING_PURPOSE.md`
- `docs/TELEMETRY_AND_AGENT_ORCHESTRATION.md`
- `docs/GLOBAL_AI_FRAMEWORK_CROSSWALK.md`
- `docs/AI_BOOTCAMP_WORKSHOP_CATALOG.md`

Current schema draft:

- `user_profiles`
- `assessment_sessions`

MVP go-live and production persistence must expand beyond the current two-table draft. Required entities or equivalent include:

- users and personal workspaces
- organizations, verified domains, memberships, invitations, teams, and roles/permissions
- subscriptions, seats, plans, and entitlements
- assessment templates, versions, campaigns, assignments, sessions, item responses, and score evidence
- question, rubric, artifact, profile, survey, prompt, model, and configuration versions
- behavior events, profile signals, question feedback, assessment surveys, report engagement, and learning events
- result-sharing policies, consent/acceptance records, rights requests, retention/deletion jobs, and support-access grants
- agent definitions, schedules, runs, steps, proposals, review decisions, and promotion states
- AI providers, encrypted secret references, model routes, evaluations, usage events, effective-dated rates, budgets, and alerts
- privacy-safe leaderboard/cohort views and anonymized analytics views
- append-only admin, access, export, security, and legal-policy audit events
## Current MVP Limitations

- **Prototype persistence:** assessment behavior, feedback, profile signals, score logs, review comments, Agent Ops, benchmarks, and leaderboards primarily use browser-local storage. The current Supabase draft contains only `user_profiles` and `assessment_sessions`.
- **Authentication and tenancy:** Google/email authentication and Admin access are preview flows. Personal workspaces, organizations, memberships, invitations, teams, campaigns, seats, granular permissions, support grants, and tenant RLS are specified but not implemented.
- **B2B operations:** organization dashboards, campaign assignment, result-sharing consent, cohort suppression, subscription/seat enforcement, SSO, and SCIM are roadmap capabilities rather than current product behavior.
- **Admin configuration:** assessment counts, profile availability, report entitlements, tracker switches, agent schedules, provider/model routing, budgets, configuration versions, approvals, and rollback are documented but do not yet have a persistent Admin Settings service or complete UI.
- **AI and costs:** the current report and Agent Ops are local/deterministic. Premium Report Copilot, server-side generated reports, encrypted provider credentials, model evaluation/routing, usage ledger, billing reconciliation, and average-cost dashboards are not implemented.
- **Agents:** supervised local proposals can be run and reviewed, but durable schedules, queues, retries, source connectors, server-side model adapters, proposal diffs, content versions, monitoring, and production audit trails remain to be built.
- **Psychometrics:** difficulty/IRT-style values, confidence, score bands, and partial-credit behavior are seeded and demonstrative. They are not calibrated from a sufficiently large representative pilot and must not be treated as certification-grade or used alone for high-impact decisions.
- **Question bank:** the 3,328 generated variants are a coverage/review inventory, not 3,328 calibrated independent live items. Many require human rewriting, format conversion, artifact review, answer-key QA, translation QA, and pilot evidence before promotion.
- **Artifacts and localization:** artifact quality has improved but remains uneven. Thai question fields are machine-assisted review drafts; complete contextual human review and layout/accessibility testing are still required.
- **AI Watch and learning catalog:** content is curated/static or locally crawled. Production freshness, source rights/terms review, versioning, approval, and broken-link monitoring are not yet operational.
- **Privacy and legal:** PDPA, Privacy Notice, Terms, Cookie Notice, Acceptable Use, Assessment/AI Disclaimer, DPA, rights, retention, breach, transfer, subprocessor, and child-user requirements are documented but not implemented or approved as final legal text. Qualified Thai legal review is required before public launch.
- **Payments and commercial operation:** production billing, subscriptions, invoices, refunds, taxes, plan enforcement, and gross-margin reconciliation are not implemented.
- **Accessibility and operations:** complete keyboard/screen-reader verification, cross-device resume, production monitoring, backups, recovery testing, incident response, support procedures, and service-level objectives remain go-live work.

## MVP Go-Live and Production Readiness Checklist

Before calling the platform a governed multi-user MVP or production-ready:

### Identity, B2C, and B2B

- Implement server-side authentication, personal workspaces, organizations, memberships, invitations, teams, campaigns, seats, entitlements, and granular permissions.
- Enforce personal/organization isolation and cross-tenant denial through tested RLS policies.
- Implement explicit campaign/result-sharing policies, consent records, minimum-cohort suppression, support-access grants, and append-only audit events.

### Assessment and Content

- Persist versioned sessions, responses, score evidence, reports, continuation, surveys, and question feedback across devices.
- Version questions, rubrics, artifacts, scoring parameters, profile ontology, surveys, prompts, models, recommendations, and configuration so historical results remain explainable.
- Complete human review, artifact relevance/legibility checks, Thai localization QA, accessibility testing, and pilot promotion for selected live items.
- Calibrate difficulty, discrimination, guessing, partial-credit thresholds, confidence, and score bands before any certification or high-impact use.

### Admin, Agents, and AI

- Build the persistent Admin Settings service for assessment/profile/report/tracker controls, provider/model routes, schedules, budgets, approval, versioning, preview, and rollback.
- Store provider credentials only in approved server-side secret infrastructure.
- Implement durable agent jobs, queues, retries, dedupe, source policies, monitoring, proposal diffs, and human approval gates.
- Implement the LLM usage ledger, effective-dated pricing, cost allocation, average-cost metrics, alerts, and emergency shutdown controls.
- Implement Premium Report Copilot as a bounded, evidence-grounded server service with entitlement, privacy, retention, safety, and cost controls.

### Analytics and Operations

- Persist telemetry and create privacy-safe views for item quality, artifacts, competency coverage, routing, score distribution, cohorts, abandonment, continuation, report engagement, and learning outcomes.
- Add monitoring, error reporting, backups, restore tests, incident response, support operations, rate limits, abuse controls, and service ownership.
- Keep identifiable identity/profile data separated from assessment evidence and restrict named-user drill-downs.

### PDPA, Terms, and Commercial Launch

- Obtain qualified Thai legal approval for final Thai/English Privacy Notices, Terms, cookies, Acceptable Use, Assessment/AI Disclaimer, lawful-basis map, age policy, B2B DPA/controller roles, retention, transfers, subprocessors, payment/refund, liability, and dispute terms.
- Implement versioned policy acceptance, consent/withdrawal, cookie blocking/preferences, rights requests, deletion/retention jobs, breach workflow, subprocessor register, transfer controls, and legal-document history.
- Implement production billing, subscriptions, invoices, taxes, cancellation/refunds, and server-side entitlement enforcement before charging users.

## Scoring Model

The assessment separates answer quality from readiness evidence.

- Answer feedback shows the raw rubric or option score for the item.
- Domain, competency, overall, analytics, and saved signal scores use difficulty-adjusted readiness evidence.
- Easier items are capped below advanced readiness even when answered perfectly.
- Harder items can award stronger readiness evidence, including meaningful credit for partially correct proficient or advanced work.
- The final readiness label is evidence-gated: Advanced requires strong advanced-item evidence, and Proficient requires strong proficient-item evidence.
- Blank or unattempted responses receive `0` raw score and `0` readiness evidence.
- Correct answers are not automatically `100`; most expert-seeded top answers are `95` or `98` to leave room for calibration and more complete advanced evidence.

Current seeded readiness bands:

| Difficulty | Partial evidence anchor | Maximum readiness evidence |
| --- | ---: | ---: |
| Awareness | 40 | 68 |
| Applied | 58 | 82 |
| Proficient | 72 | 92 |
| Advanced | 82 | 100 |

This is still an MVP calibration model. Production scoring should tune item difficulty, discrimination, guessing, and partial-credit thresholds from pilot response data.

No-response handling:

- Blank written response: `0`
- Multi-select submitted with no choices: `0`
- Matching submitted with no selected pairs: `0`
- Unanswered mini-parts: `0` for each missing part
- Partial credit begins only when the user submits actual scored evidence

During test review, the platform shows a score explanation panel after each answer. It explains the raw answer score, the difficulty-adjusted readiness evidence, and the maximum evidence allowed by the item difficulty band.

Score derivation:

1. Question raw score: selected option score, multi-select credit minus distractor penalty, matching accuracy, ranking exact-position accuracy, written rubric hits, or average mini-part score.
2. Question readiness evidence: raw score is converted through the difficulty band. Awareness, Applied, Proficient, and Advanced items have different partial anchors and maximum contribution caps.
3. Competency score: average readiness evidence from all question signals mapped to that competency.
4. Domain score: average readiness evidence for the domain. Secondary-domain evidence contributes at `0.35` weight.
5. Overall score: average of D1-D6 domain scores. Unsampled domains score `0` in the MVP.
6. Readiness label: evidence-gated. Advanced requires `85+` overall plus strong advanced-item evidence; Proficient requires `70+` overall plus strong proficient-item evidence.

Response time, hesitation, artifact zoom/open behavior, item discrimination `a`, difficulty `b`, guessing `c`, information, and SEM are currently telemetry/calibration signals. They affect routing, reporting, and future review, but they do not directly add or subtract score yet.

Pilot confidence is a separate evidence-stability estimate, not a correctness score. In the current MVP it starts from the assessment-mode base (`38` free, `48` premium, `54` executive), adds the mode step for each answered item (`4`, `3`, and `3` respectively), and is capped at `88`, `94`, or `96`. Competency-level confidence is more granular: it reflects repeated evidence for that competency (`sampled once`, `early estimate`, or `stronger estimate`). The large number shown in a continuation card is the recommended follow-up question count, not confidence; the report now labels it explicitly as “questions” and shows the actual confidence percentage beside the recommendation.

The live bank now includes 240 generated advanced competency items: 10 advanced items for each of the 24 granular competencies. These items are explicitly mapped to one competency each and are available to the regular/premium bank and as advanced extension items for the executive route.

The live bank also includes generated market-trend items across every granular competency and all four difficulty levels. These items test practical understanding of current AI-market shifts: agentic AI, multimodal image/video workflows, context engineering and RAG quality, domain-specific models, benchmark caveats, responsible AI governance, sovereign/local data constraints, and workforce skill change.

## Profile Ontology

The profile model combines explicit profile survey answers, optional micro-survey pulses, selected assessment routes, answer behavior, report clicks, and competency outcomes. In the MVP, these signals are stored locally and used to route questions and recommendations. Production should keep this transparent to users, separate sensitive personal data from assessment evidence, and use consented server-side profile graphs with retention controls.

The new landing profile pulse asks a single low-friction question about AI trend interests such as agents, image/video AI, RAG/context, governance, or new models. Selected interests become profile tags and competency targets, so the adaptive engine can prioritize more relevant questions without forcing a long onboarding survey.

## Continuation Recommendation

At the end of the mandatory route, the platform now shows a conspicuous continuation recommendation in both the final answer review and the test report. The recommendation is based on pilot confidence, sampled low-confidence competencies, unsampled profile-priority competencies, planned coverage gaps, and the user's profile signals.

For example, content creators, marketers, or users whose profile mentions image, video, media, campaigns, creative variants, Canva, Adobe, Firefly, Midjourney, or synthetic media are routed toward deeper evidence for prompt refinement, media provenance, claim verification, IP/ethics, and campaign measurement. Technical, finance, and people/HR profiles receive similarly tuned follow-up targets. The primary action launches the recommended targeted route; users can still view the report snapshot or choose a domain deep dive.

## Assessment Quality Loop

Each assessment session records question exposure, selected and expected answer identifiers, readiness score, domain, competencies, difficulty, interaction format, elapsed time, interaction count, revision count, and a derived hesitation signal. Session events also distinguish abandonment, completion of the mandatory route, acceptance or decline of optional questions, result views, and report-area engagement.

After seeing the basic score, a short clarity, difficulty, artifact, and length survey unlocks the user's question-by-question evidence report. The report shows the response, expected evidence, time spent, behavioral signal, measured competencies, and local comparison data where enough attempts exist.

The admin quality engine aggregates these signals into a supervised improvement queue. High confusion, long response time, weak discrimination, abandonment, poor artifact ratings, and route-level difficulty feedback can nominate questions, formats, profile fields, surveys, or artifacts for revision. This is a continuous-improvement system, not a claim of general intelligence: scored content remains versioned and reviewable so historical scores do not change silently.

Legacy `reliance-decision` items now render as complete control-pattern scenarios instead of the simplified Human / AI / Both card format. The general bank also includes 26 Horizon "AI or Me?" reliance scenarios (`REL-H-*`) whose best answer varies between AI-led, human-owned, and shared ownership, so the format can detect both over-reliance and under-reliance. The admin artifact backlog lists a realistic replacement brief and stable asset path for each unique document image so generated replacements remain relevant to their questions.

