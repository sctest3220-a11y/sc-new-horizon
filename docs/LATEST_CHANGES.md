# Latest Changes

## Main-page hydration repair

- Removed first-render reads of URL parameters, `localStorage`, browser-generated ids, and saved telemetry from the main page's React state initializers.
- The server and browser now begin with the same deterministic render; browser-only routing and saved state are restored on the next animation frame.
- This fixes the hydration error where the server rendered the main header while the browser initially rendered the optional profile pulse or another saved view.

## Pilot Operations admin workspace

- Added `/admin/pilot-operations` and linked it from the main Admin dashboard.
- Admins can configure a pilot's owner, dates, cohort, access code, language, question limits, adaptive continuation, answer reveal, quick feedback, and report survey.
- Added participation KPIs, pseudonymous tester monitoring, explicit content/translation/artifact/scoring/telemetry/support readiness gates, and a human-controlled quality issue queue.
- Required gates block the `Ready` and `Running` status options. Pilot configuration, gate decisions, and issue status auto-save in the current browser and can be exported to CSV.
- The workspace labels its MVP boundary: shared persistence, real invitations, role-based authorization, consent records, audited publishing, and server analytics remain go-live requirements.

## Jev deferred pre-production evaluation

- Documented Jev as an optional fast typed-decision layer for bounded routing, triage, agent gates and review prioritization, not as an orchestrator, generator, scoring authority or publisher.
- Jev is not an MVP dependency. Revisit it during pre-production through a 1,000-5,000-case shadow-mode comparison against deterministic rules and a low-cost structured-output model.
- Adoption is per use case and requires labelled accuracy, calibration, high-risk false-negative, Thai/English, latency, cost, privacy, vendor, fallback, audit and kill-switch gates.

## Translation provider strategy

- Added a source-backed strategy for assessment-bank and AI Watch translation using Google Cloud Translation, Qwen-MT, and ThaiLLM.
- Assessment translations remain versioned drafts until human approval; dynamic newsfeed translation defaults to cached, source-grounded summaries rather than translating full publisher content.
- The recommended pilot compares Qwen-MT Plus and Google Translation LLM for assessment content, uses Qwen-MT Flash as the likely routine newsfeed route, and evaluates ThaiLLM as a Thai naturalness and cultural-context QA model.
- Documented current price assumptions, measured inventory size, cost ranges, cache keys, QA checks, admin controls, telemetry, PDPA/vendor gates, and provider-fallback policy.
- Added a translation and routing go-live checklist. The MVP uses an auditable deterministic policy router; learned or agentic model selection is deferred until production evidence shows a measurable advantage.

## Cleaner question inventory controls

- Removed the redundant Question Inventory side navigation so the review workspace can use the full page width.
- Draft readiness guidance and artifact coverage details are now collapsed by default and remain available on demand.
- Added a visible Reset action beside Apply filters; it clears the inventory and reviewer filters while preserving the selected review language.
- Tidied each question's reviewer-feedback panel for the narrower desktop column: headings and timestamps stack cleanly, rating guidance sits below the stars, review controls use a stable two-column grid, and fields no longer overflow their panel.

## Institutional Navy question inventory layout

- Question Inventory now uses the Option B application layout with navy header chrome, a persistent review-workspace sidebar, compact overview hierarchy, and blue-gray operational surfaces.
- Each question now places the question content and reviewer feedback side by side on desktop, then stacks them on smaller screens.
- Existing filters, translations, review history, artifact notes, and scoring-review content are preserved.

## Mixed-media AI Watch

- AI Watch now supports a mixed feed of articles, videos, and short videos with media-type filtering and original-publisher attribution.
- Approved YouTube items play inside the feed through YouTube's privacy-enhanced embed player, while an explicit link still opens the original publisher page.
- Article cards prefer the original publisher preview image declared in the article's Open Graph metadata, with visible publisher credit and a link to the source. Items without approved, stable image metadata remain text-only rather than receiving a redundant generated substitute.
- The Newsfeed Agent specification now includes YouTube and publisher-hosted video discovery, format balancing, source metadata, human review, expiry, correction, and takedown handling.
- Rights controls prohibit copying full articles, transcripts, captions, video, or audio; downloading or rehosting publisher media; altering official players; and publishing unreviewed summaries. Article images must come from publisher-declared preview metadata or another explicitly approved embedding mechanism and remain attributed to the source.
- The editorial mix now prioritizes relatable stories about personal agents, jailbreaks, scams, autonomous cars, home/service robots, and physical-AI competitions alongside model and governance updates.

## Question inventory feedback refresh

- Saving question-level feedback now clears every field in the review form immediately, ready for a new review.
- Only submitted feedback history is synchronized to the repository. Unfinished browser drafts are no longer shared or restored for another reviewer.
- Saved history and review counts still refresh immediately after submission.

## Purposeful Partial-Credit Standard

Question Rewrite Rules 2.1 clarifies that mutually exclusive answers apply to single-best-answer items, while complex questions may use multi-select, ranking, multi-part, written-response, or intentionally progressive options. Partial credit remains encouraged for proficient and advanced evidence when it measures explicit reasoning components, completeness, prioritization, diagnosis, or action quality. Every rubric must define the purpose, criteria, weights, contradiction handling, blank handling, and user-facing explanation; arbitrary points assigned to merely plausible distractors remain prohibited.

## AI Necessity and Evidence-Consistency Rules

Question Rewrite Rules 2.0 now requires an AI necessity test, observable AI-system behavior or controls, mutually exclusive single-best-answer choices, rubric-based rather than improvised partial credit, independent numerical verification, operationally feasible actions, and a clear distinction between bounded testing and wider scaling. Artifact Standard 1.1 applies the same controls to evidence design, including decision-relevant denominators and derived metrics.

## Bilingual Marketing Question and Artifact Candidate

Added comparison candidate `2026-09-23.2` for live question `FUNC-MKT-D3-001` without replacing the scored item. The candidate now tests whether a user can identify and repair an incomplete AI decision rule rather than merely exercising marketing judgment. Its English and Thai dashboards show conversion rate, cost per conversion, sample size, tracking anomalies, the AI rule, and missing controlled-test evidence. They use Thai baht, remain readable when fitted to the window, and remove the old answer-revealing “Suspicious point” and “Better question” panels.

## D2 Prompt Design Thai Translation Repair

Repaired the shared Thai translation patterns used by all eight core/general applied Prompt design drafts. Scenarios, question prompts, every answer choice, and explanations now translate completely while retaining only intentional technical terms such as `AI` and `Prompt`. The translation standard now explicitly rejects partially translated or corrupted Thai items as incomplete rather than treating individual translated fragments as sufficient.

The full inventory QA scan still identifies incomplete machine-assisted Thai text in specialized draft families. Those drafts remain review-only and are not production-ready Thai content until they pass whole-item localization QA and human review.

## Question Inventory Review Filters

Question Inventory now provides independent filters for number of saved reviews, latest 1–5 star question rating, and latest decision status. Reviewers can combine filters, such as `3 or more reviews` + `1–2 stars` + `Revise`, and the visible count updates immediately when feedback is saved. The MVP applies these filters to questions loaded on the current page because review history is stored in the local browser; production should move review summaries to the database for inventory-wide server filtering.

The review filters sit directly below the main inventory filters in a clearly labeled section, before pagination and feedback-sync status, so reviewers can find both filter groups in one place.

## Canonical Artifact Standard and Rewrite Rules 1.8

Added `docs/ARTIFACT_DESIGN_AND_QA_STANDARD.md` as the canonical standard for artifact necessity, embedded placement, evidence alignment, realism, neutrality, readability, localization, accessibility, telemetry review, versioning, and human approval. Question rewrite rules now reference this standard instead of duplicating partial requirements.

Question rewrite rules are now version 1.8. IT/developer items should use a brief operational scenario, scannable embedded evidence such as logs or traces, and one direct decision. Detailed technical facts belong in the artifact, multi-select prompts must state the exact selection count, and answer sets should avoid the obvious pattern where every option except one is correct.

## Question-Level Language Switch and Assessment Type Scale

Each assessment question now has its own EN/TH switch beside progress, independent of the page-level language setting. The local choice applies only to the current question and the next question returns to the page preference. Thai is disabled when an approved or pilot-enabled translation is unavailable. Scenario, prompt, artifact metadata, answer choices, and rubrics remain tied to the same language-independent question and scoring ids.

Assessment typography now uses a more balanced hierarchy: scenario context is readable supporting copy, the question prompt is prominent without using hero-scale type, and answer choices and written responses use consistent body sizing. The Thai copy for live item `FUNC-OPS-D6-001` was also synchronized with its latest English scenario, 3–5 sentence prompt, artifact, rubric criteria, and exemplar answer.

## Embedded Evidence Inside Questions

Helpful artifacts now appear inside the scenario reading flow: scenario context, embedded evidence, then the question prompt. They no longer render as a separate artifact section above the task brief. Full-size reading, zoom controls, accessibility text, and artifact-use telemetry remain available. Questions that do not need visual evidence continue to render without an artifact.

## Live Support Item and New Inline Artifact

Live Operations item `FUNC-OPS-D6-001` now uses a question-specific duplicate-charge support-console image rather than the previous shared ticket artifact. The rewritten response task asks users to identify what must be verified, choose the appropriate refund action, and explain the customer communication. The artifact appears inline and opens in the existing fit-to-window reader with additional zoom and open-file controls.

## Interactive Agent Workflow Map

Admin Agent Ops now provides an n8n-style node workflow canvas driven by the existing agent run report. Admins can inspect branching agent handoffs, animated status paths, blocked steps, QA routing, and the human approval gate. Clicking an agent opens its schedule, guardrail, latest stages, and recorded output. The Admin view is also directly accessible with `/?view=admin` for testing and operations.

## Release-Stage Definitions Expanded

The living feature catalog now defines `MVP - Built`, `MVP - Go-live`, `Production`, `Scale`, and `Future` in operational terms and includes exit criteria for moving between stages. This prevents a visible prototype from being mistaken for a real-user-ready or commercially hardened capability.

## Agent Platform Tooling Decision

Added `docs/AGENT_PLATFORM_TOOLING_STRATEGY.md`. The MVP remains lightweight: Supabase/PostgreSQL is the system of record, PostHog or equivalent handles consent-aware product analytics, and a managed job runner is added only where asynchronous work is necessary. Temporal, bounded LangGraph workers, LiteLLM, Langfuse, ClickHouse, Kubernetes/KEDA, and optional Hermes experimentation are phased production or scale capabilities with explicit adoption triggers. The architecture rejects one-agent-per-event processing in favor of deterministic aggregation, batching, budgets, approval gates, versioned promotion, and human-controlled release.

## 2026-09-22: README and Documentation Status Reconciled

The README now uses the living feature catalog as its status source and distinguishes the local prototype from MVP go-live, Production, and Future capabilities. The Supabase/data-model section, AI-provider guidance, MVP limitations, and readiness checklist now reflect the latest B2C/B2B tenancy, Admin Settings, Premium Report Copilot, LLM usage/cost, agent orchestration, psychometric, question-quality, accessibility, billing, operational, and PDPA/Terms specifications.

The updated limitations make clear that documented features are not automatically implemented. Browser-local analytics and Agent Ops, preview authentication/Admin access, generated question variants, machine-assisted Thai fields, and seeded psychometrics remain prototype or pilot assets until their respective go-live gates are met.

## 2026-09-22: PDPA, Terms, and Legal Controls Documented

Added an authoritative drafting and engineering specification for Thailand PDPA readiness, Privacy Notices, Terms of Use, Acceptable Use, cookie controls, Assessment/AI disclaimers, B2B controller/processor role mapping and DPA, consent, data-subject rights, retention/deletion, children, security, breach response, subprocessors, international transfers, Report Copilot, leaderboards, and legal release gates.

The specification is not legal advice. Final Thai and English documents, lawful bases, age policy, data-sharing roles, retention periods, transfer safeguards, liability terms, and consumer/payment terms require qualified Thai legal review before public launch. The feature catalog now marks the corresponding legal and privacy controls by release stage.

## 2026-09-22: Living Feature Catalog Added

Added an itemized feature catalog for public visitors, B2C users, Premium users, B2B members and managers, Assessment/Learning Managers, Organization Admins and Owners, Billing Managers, Organization Auditors, specialist platform administrators, and Super Admins.

Every feature is marked as `MVP - Built`, `MVP - Go-live`, `Production`, or `Future`. The distinction prevents browser-local previews from being mistaken for secure multi-user production capabilities. The document includes a mandatory maintenance workflow so future feature work updates the catalog, detailed specification, latest-change log, README where relevant, and matching Obsidian notes.

## 2026-09-22: B2C, B2B, and User Administration Documented

New Horizon now has an authoritative account and administration design covering personal workspaces, multi-organization membership, platform and organization roles, granular permissions, invitations, teams, seats, entitlements, assessment campaigns, result-sharing consent, cohort privacy, organization analytics, support access, SSO/SCIM roadmap, audit events, and row-level tenant isolation.

The design keeps a user's personal assessment history private unless it is explicitly shared under a disclosed result policy. The first MVP delivery focuses on personal/organization contexts, invitations, core roles, campaigns, consent, privacy-safe aggregate dashboards, tenant-level LLM usage, audit history, and cross-tenant authorization tests.

## 2026-09-22: Premium Report Copilot Documented

The requirements and Admin Settings specification now include a bounded Premium Report Copilot. It is designed to explain scoring, question evidence, confidence, competency coverage, learning paths, recommendation rationale, and follow-up assessment plans from versioned structured assessment data.

Basic score transparency remains available to every user. Admin controls cover plan access, message limits, model and prompt routing, context limits, retention, privacy-safe telemetry, budgets, fallback behavior, and emergency disable. Usage analytics include average cost per copilot user, conversation, message, report, and resolved question. The copilot may recommend actions but cannot change scores, rubrics, answer keys, or historical results.

## 2026-09-15: Agent Architecture Recommendations Adopted

Agent/orchestration docs and the MVP requirements spec now adopt the full go-live agent architecture: Orchestrator, Assessment Blueprint, AI Concepts Scout, AI Newsfeed, Training/Course Scout, Assessment Item Generator, Stimulus Builder, Feedback Analysis, Psychometric Monitor, Data Quality Monitor, Localization QA, Report UX, Framework Alignment, and Reviewer/QA.

Psychometric Monitor and Stimulus Builder are no longer treated as future-only concepts. The docs now position them as active MVP quality workflows because item calibration and artifact realism are core pilot risks. Data Quality Monitor, Localization QA, Report UX, Assessment Blueprint, and Framework Alignment are also documented as explicit quality agents.

The docs now define content-producing agents versus governance/quality agents and require proposal promotion states: `draft -> reviewed -> pilot-ready -> pilot-tested -> approved -> published -> monitored`. Human approval remains required before scored content, rubrics, scoring, artifacts, profile fields, surveys, learning recommendations, or framework mappings change.

## 2026-09-15: Profile Calibration And Feedback State Fixes

The landing page `Explore more` control now uses an explicit React toggle instead of relying on native `details`, fixing cases where the panel did not expand in the app browser.

Per-question feedback notes are now keyed by assessment session, question id, and placement, so optional notes from a previous run/user cannot appear as stale text on the next assessment. New assessments also continue to clear submitted/draft feedback state.

The optional profile survey now asks users to self-rate AI experience and confidence. Those signals calibrate the starting item difficulty before the adaptive engine switches to observed answer evidence.

## 2026-09-15: Assessment Quality Analytics Suite

Admin now includes a 10-point assessment-quality suite: item discrimination, distractor analysis, artifact dependency, question clarity index, difficulty calibration, competency coverage heatmap, reliability estimate, written-response rubric audit, route/persona fit, and learning/report engagement. Each panel uses existing local MVP telemetry and labels insufficient data plainly when pilot volume is too low.

The suite is intended to answer whether each item measures the intended competency, whether answer choices separate stronger from weaker users, whether artifacts help or distract, whether difficulty labels match observed behavior, whether each persona receives the right domain mix, and whether report recommendations attract learner interest.

## 2026-09-15: MVP Analytics Refinement

Admin now includes an analytics readiness checklist that separates local pilot evidence from production-ready analytics. It shows whether behavior events, question evidence, survey feedback, cohort scoring, server analytics, and agent review trails are ready, insufficient, or still local-only.

Pilot-review export is now available from Admin as a CSV containing run context, profile group, question id, question/rubric/artifact version tags, domain, competencies, difficulty, interaction type, readiness score, answer label, expected answer ids, timing, revisions, hesitation, quality status, quality action, and question-level feedback counts/comments.

Question signal snapshots now include MVP question, rubric, and artifact version tags so pilot exports are easier to audit before production database versioning is implemented. The item calibration dashboard also shows short reviewer action labels such as `Rewrite now`, `Replace artifact`, `Recalibrate difficulty`, `Watch`, and `Keep`.

## 2026-09-14: Report Explainability And Evidence Gaps

Question-level score calculation now includes the question prompt, user answer, expected evidence, feedback reason, raw score, difficulty-adjusted readiness score, and measured competencies. This makes the calculation useful for learners and item reviewers instead of only showing math fragments.

Unsampled domains now display as `Not assessed` in the report scorecard and are left unplotted on the user's radar shape. They remain visible as coverage gaps so the platform can recommend targeted continuation, but the UI no longer presents missing evidence as if it were a measured domain score.

The framework crosswalk now includes Gartner AI maturity, McKinsey AI value measurement, and BCG Responsible AI maturity as supporting maturity/value references alongside formal or public frameworks such as UNESCO, OECD/EC, NIST, EU AI Act, DigComp, ISO/IEC 42001, and AI Verify. Artifact and lab quality standards were also documented: artifacts should be relevant, necessary, realistic, legible, and tied to the answer key; pilot labs should be marked as samples until instructions, artifacts, scoring, outputs, and debriefs are complete.

## 2026-09-14: Item Calibration Dashboard

Admin quality review now shows an item calibration dashboard instead of a simple quality gate. Each row exposes status, domain, difficulty, interaction type, attempt count, average score, average time, confusion rate, artifact action rate, feedback count, unclear flags, difficulty mismatch, artifact presence, negative signals, and recommended human-review action.

The dashboard flags candidates for review when telemetry suggests advanced items are too easy, awareness items are too hard, users show high confusion, or artifact interactions combine with negative artifact comments. These signals de-prioritize items in routing, but scored content still requires human approval before rewrite, artifact replacement, recalibration, or retirement.

## 2026-09-14: Profile-Weighted Routing And Learning Cues

Implemented profile domain targets for adaptive question selection. Free routes now use audience-specific allocations, for example General emphasizes D1 Foundations, D2 Practical Tooling, D3 Critical Judgment, and D6 Human-AI Collaboration while minimizing D5 Strategy. Premium routes blend function, industry, and professional baseline targets, then route toward domains below the selected profile's expected allocation.

Answer review now includes a short practice cue so every question teaches a next action after scoring. The analysis tab also shows the intended profile domain target counts so testers can check whether the adaptive route matches the user's profile.

## 2026-09-12: Profile-Weighted Radar Targets

Radar target profiles now use more differentiated domain expectations instead of near-even D1-D6 shapes. General users emphasize D1 Foundations, D2 Practical Tooling, and D3 Critical Judgment, with lighter D4/D6 and minimal D5. Professional, team, function, industry, and leadership contexts now show visibly different target shapes based on the researched profile focus model.

Premium target blending now weights function context first, industry context second, and professional baseline third. This keeps radar targets tied to the selected profile instead of averaging every profile back toward the same shape.

The research basis is documented in `docs/GLOBAL_AI_FRAMEWORK_CROSSWALK.md`. It references UNESCO AI competency dimensions and understand/apply/create progression; OECD/European Commission AI literacy knowledge, skills, and attitudes; EU AI Act Article 4 context-of-use and user-experience requirements; NIST AI RMF Govern/Map/Measure/Manage; DigComp 2.2; ISO/IEC 42001; and Singapore AI Verify/MGF GenAI. The documented conclusion is that domain targets and question routing should be profile-weighted, not evenly distributed across D1-D6.

## 2026-09-14: Thai Batch 1 Approved — Every Question in the Bank Now Approved in Thai

The reissued round-2 spot check for batch 1 (20 items, none from round 1, read on the glossary-aligned text) came back 20 Approve with no ambiguous keys. Batch 1's 163 items — 137 table entries and the 26 inline Horizon items — move from `reviewed` to `approved`. That closes the Thai review programme started on 2026-09-10: all 660 questions (163 + 89 + 408) have Thai that passed a native review and an independent second-reviewer spot check. Nothing changes on screen (`reviewed` and `approved` render alike); the status gate for a default Thai experience is now satisfied. Detail and the remaining follow-ups (escalation term, Thai artifacts, two English-bank notes, Thai pilot) in `docs/THAI_BATCH1_SPOTCHECK_ROUND2_RESPONSE.md`.

Verified: lint clean, production build passes, 18 pre-existing TypeScript errors unchanged; only status fields changed; all 660 items localise and every Thai exemplar scores fully.

## 2026-09-14: Thai Batch 3 Approved (408 Items); Batches 1–2 Aligned to Glossary Decisions; Batch 1 Round-2 Sample Reissued

The batch-3 second-reviewer spot check (20 rendered questions covering all 17 scenario frames) returned 20 Approve with no ambiguous keys, so both template builders now emit `translationStatus: 'approved'`: the 408 `ADV-*` / `TREND-*` items join batch 2's 89 as `approved` (497 total). Batch 1's 163 items stay `reviewed` — the file received as its round-2 review was the round-1 review again (byte-identical to the one applied on 2026-09-12), so the round-2 sample is still open.

While it was open, batches 1–2 were aligned to the renderings three reviewers converged on during batches 2–3: ผู้ให้บริการ for AI/IT vendors (ผู้ขาย kept for sellers, suppliers and invoices), Human-in-the-loop alongside การตรวจทานโดยคน on first mention, การแก้ไขทับผล AI, the hallucination gloss, กติกา → ข้อกำหนด/แนวปฏิบัติ/เกณฑ์ by context, ความเป็นปัจจุบันของข้อมูล, and "…รัดกุมและเหมาะสมที่สุด / มีน้ำหนักมากที่สุด" in place of "…หนักแน่นที่สุด" prompts — 45 items, terminology only, meaning unchanged, batch 2 stays `approved`. One batch-1 exemplar (CAL-D3-MEDIA-018) lost a first-person ผม and now scores fully. The round-2 batch-1 sample was regenerated on the aligned text with the same 20 ids (`exports/New_Horizon_Thai_Batch1_SpotCheck_Round2.xlsx`, marked REISSUED). Detail in `docs/THAI_BATCH3_SPOTCHECK_RESPONSE.md`. Still open for the team: the escalation rendering.

Verified: lint clean, production build passes, 18 pre-existing TypeScript errors unchanged; all 660 questions localise, English is the identity, every Thai exemplar scores fully.

## 2026-09-14: Thai Batch 3 — Template-Generated Items (408) and Competency Vocabulary (Draft → Reviewed)

The 408 questions still English-only are all generated from templates: 240 `ADV-*` advanced items (10 scenario frames × 24 competencies) and 168 `TREND-*` market-trend items (7 frames × 24 competencies). Instead of translating 408 questions, batch 3 translates the templates and the vocabulary they interpolate: 10 advanced frames, the 4 shared advanced options with feedback, 7 market-trend frames (scenario, prompt, 4 options), the framing sentence, difficulty verbs and names, 4 feedback templates, plus 24 competency names and 95 skill names (`competencyLabelsTh`, `skillLabelsTh` in `app/page.tsx`). The two builders now emit `contextTh` / `promptTh` / option `labelTh` / `feedbackTh` with `translationStatus: 'draft'`, so every generated question carries Thai — about 150 strings cover all 408 items, and a fix to a template fixes every question built from it.

Two things changed in the app to make this safe. `localizeQuestion` now shows `draft` Thai only when the caller opts in; `Home` reads a pilot flag (`localStorage['new-horizon-thai-drafts-v1'] = '1'`) so the 408 unreviewed items stay English for ordinary Thai users while pilot testers can see them. And `translateUiText` consults the competency vocabulary, so competency and skill names in the score report switch language with the toggle (they were English-only before). Native review workbook: `exports/New_Horizon_Thai_Review_Batch3_Templates.xlsx` (seven sheets, including 12 fully rendered example questions so the reviewer can judge how the pieces read together); machine-readable drafts in `exports/thai-drafts-batch3-templates.json`.

The native review came back the same day: meaning preserved and keys unambiguous on every row, 51 of about 290 strings corrected (formal register for skill names, ผู้ให้บริการ instead of ผู้ขาย for service vendors, "รัดกุมและเหมาะสมที่สุด" prompt phrasing, English glosses for ROI / triangulation / phishing), all 12 rendered examples approved as a whole. Corrections were merged into the template spec and `app/page.tsx` regenerated; both builders now emit `translationStatus: 'reviewed'`, so the 408 items show Thai to every TH user. The reviewer's vendor preference settles the open glossary question (`exports/glossary_th.json`). Detail in `docs/THAI_BATCH3_REVIEW_RESPONSE.md`; second-reviewer sample in `exports/New_Horizon_Thai_Batch3_SpotCheck.xlsx` (20 rendered questions covering all 17 frames).

Verified: lint clean, production build passes, 18 pre-existing TypeScript errors unchanged; all 408 generated items localise fully in the TH view and are the identity in English; competency names round-trip EN→TH→EN.

## 2026-09-14: Thai Batch 2 Approved (89 Items) — Spot Check Round 2 Passed 20/20

The second-reviewer round-2 sample for Thai batch 2 (20 fresh items, including all seven touched only by the round-1 sweep) came back 20 Approve / 0 Fix / 0 Rewrite with the key unambiguous on every item. Under the decision rule (≥18 Approve, no ambiguous key) the 89 batch-2 entries in `app/questionTranslations.th.ts` move from `reviewed` to `approved` — the first batch to reach that status. Across both rounds the second reviewer read 40 of the 89 items. Rendering is unchanged for now (`reviewed` and `approved` both localise); `approved` is the release gate for the default Thai experience described in `docs/LOCALISATION.md`, to be switched on when the toggle leaves pilot. Detail in `docs/THAI_BATCH2_SPOTCHECK_ROUND2_RESPONSE.md`. Batch 1 (163 items) remains `reviewed` pending its own round-2 sample.

Verified: lint clean, production build passes, 18 pre-existing TypeScript errors unchanged; only the 89 status fields changed.

## 2026-09-14: Thai Batch 2 Applied (89 Items Reviewed); Spot Check Round 1 Applied, Round 2 Issued

The native review of Thai batch 2 (89 Thai-priority-Medium items) came back with 49 Approve / 40 Fix in cell / 0 Rewrite, meaning preserved and the key unambiguous on every item and every one of the 323 answer-choice rows. Applied to `app/questionTranslations.th.ts` as `reviewed`: the table now holds 226 entries (252 questions with Thai including the 26 inline Horizon items). 22 scenarios, 36 prompts and 3 key options were reworded in cell; all 83 free-text rubric keyword lists were expanded with the stems Thai users actually type. Three glossary renderings changed (hallucination gloss, Human-in-the-loop alongside the Thai, การแก้ไขทับผล AI) and were swept across batch 2; batch 1 keeps the old wording until its round-2 spot check closes. Two tooling decisions are documented in `docs/THAI_BATCH2_REVIEW_RESPONSE.md`: the reviewer's leading จง was dropped from 21 prompts to match batch 1's register, and five over-broad keyword stems (คน, รอ, PR) were lengthened so free-text scoring cannot match on noise. The reviewer also re-confirmed all 41 artifact language tags and wrote a Thai "Inspect for" cue per artifact (kept in `exports/artifact-language-tags.json`).

The second-reviewer spot check (`exports/New_Horizon_Thai_Batch2_SpotCheck_Round1_Reviewed.xlsx`) returned 13 Approve / 7 Fix / 0 Rewrite with no ambiguous keys — below the 18-Approve threshold, so batch 2 stays `reviewed`. The seven Fix items were corrected in the reviewer's wording and the flagged patterns (กติกา, literal ความสดใหม่ / การกระทำที่เกี่ยวกับเงิน / สิทธิ์รอบ ๆ โมเดล, ข้ออ้าง, ผู้ใช้ฝ่ายขาย, vendor term drift) were swept across all 89 items: 19 items changed. Detail and two English-bank notes (DEPTH-EXP-D3-MEDIA-073's key mixes an action into a red-flag question; DEPTH-D3-MEDIA-042's scenario omits the image its prompt refers to) in `docs/THAI_BATCH2_SPOTCHECK_ROUND1_RESPONSE.md`. A fresh, non-overlapping round-2 sample that includes every sweep-touched item is in `exports/New_Horizon_Thai_Batch2_SpotCheck_Round2.xlsx`.

Verified: lint clean, production build passes, 18 pre-existing TypeScript errors unchanged; all 89 items localise end to end and every Thai exemplar answer scores fully through `scoreTextAnswer`.

## 2026-09-12: Batch 1 Register Sweep Completed; Thai Batch 2 Drafted

Extended the batch-1 sweep beyond the second reviewer's list: five prompts still ending in a literal "…คืออะไร" were rephrased to exam form ("ข้อใดคือ…"), one ๆ spacing and one literal phrase fixed (7 edits). The round-2 spot-check sample was regenerated so it shows the final text. All 163 items remain `reviewed` pending the round-2 result.

Batch 2 (89 Thai-priority-Medium items, Free/Premium starters first, no executive-only items) is drafted into `exports/New_Horizon_Thai_Review_Batch2.xlsx` for native review: 323 answer-choice rows, 83 rubric-criterion rows (18 free-text items), glossary, and a new reviewer column checking that Thai artifact captions read as the "Inspect for" cue the app now derives from them. Drafts were produced under the updated translation brief (formal exam register, whole-word glossary matching) and QA-scanned before issue: zero hits on every pattern from the round-1 review. Machine-readable drafts in `exports/thai-drafts-batch2.json`. Nothing from batch 2 is in the app yet.

Verified: lint clean, production build passes, 18 pre-existing TypeScript errors unchanged.

## 2026-09-12: Thai Spot Check Round 1 Applied; Round 2 Sample Issued

The second-reviewer spot check of Thai batch 1 returned 13 Approve / 7 Fix with no ambiguous keys, so batch 1 stays `reviewed`. The reviewer found a systematic find-and-replace defect ("copilot" rendered as "coโครงการนำร่อง (Pilot)") and several register issues (pronoun มัน opening formal options, เรียกร้อง in executive prompts, literal ลูป, สัญญาณอันตราย). All were fixed across the full 163-item batch, not only the sampled items — 22 items changed, zero remaining hits on every pattern. Per-item detail in `docs/THAI_SPOTCHECK_ROUND1_RESPONSE.md`. A fresh, non-overlapping 20-item round-2 sample is in `exports/New_Horizon_Thai_Batch1_SpotCheck_Round2.xlsx`.

Verified: lint clean, production build passes, 18 pre-existing TypeScript errors unchanged, 163 items reviewed.

## 2026-09-11: Thai Versions of Message-Type Artifacts

Nine artifacts that a Thai user must read as messages to judge realistically now have Thai versions: delivery-scam SMS thread, forwarded flood chat, station flood social post, executive impersonation post, fraudulent supplier invoice, phishing re-authentication page, client scheduling email, fake marketplace listing, and vendor data-rights memo. SVGs had their text nodes replaced (Noto Sans Thai embedded as a data URI so rendering does not depend on device fonts); PNG screenshots had only their text regions repainted, leaving photos, layout and every fraud or verification cue unchanged (mismatched domain, changed bank account, missing PO, countdown pressure, unverified source, missing agenda and timezone). Amounts are in baht.

`thaiStimulusSources` maps each English image to its `-th` version and `localizeQuestion` swaps it for questions that carry a translation status. Fourteen translated questions now show Thai artifacts; nine untranslated `DEPTH-*` items keep the English image until they are translated, so a question never mixes languages. English mode is unchanged. The EN→TH text for each image is recorded in `exports/artifact-thai-text-spec.json` for native review; `exports/artifact-language-tags.json` tracks production status.

Also added `exports/New_Horizon_Thai_Batch1_SpotCheck.xlsx`: a stratified 20-item second-reviewer sample of batch 1 with a built-in promotion rule (18 of 20 Approve and no ambiguous key → promote batch 1 to `approved`).

Verified: lint clean, production build passes, 18 pre-existing TypeScript errors unchanged, VM check that Thai image swap applies only to translated questions and never in English mode.

## 2026-09-11: Merge Repair After Main Sync

The merge of `main` into `kj-dee-branch` (`82d0da4`) left `page.tsx` unbuildable: `currentDisplayStimulus` was declared twice (the localisation branch's `getDisplayStimulus(shownQuestion)` beside main's `getDisplayStimulus(current)`), so `pnpm build` failed with a parse error. Fixed by keeping one declaration and driving main's new visual-card gate from the localised question (`getDisplayVisualStimulus(shownQuestion)`), so hidden-artifact rules and Thai visual cards work together. Also removed six duplicate keys in `thaiUiCopy` introduced by the merge (`Assessment`, `Improve next`, `Score interpretation`, `Open detailed analysis`, the survey-unlock sentence, `Maps to`); JavaScript kept the last value anyway, so behaviour is unchanged.

Verified: lint clean, production build passes, TypeScript back to the 18 pre-existing errors, Thai localisation checks pass (163 items reviewed, Thai free-text scoring, matching), Thai toggle smoke test clean.

Added with the repair, so a broken merge cannot recur unnoticed:

- `.github/workflows/ci.yml` — lint, a TypeScript error budget (fails only if the count grows above the known 18), production build, and a question-bank integrity check (unique ids; every translation table entry points at a real question) on push and pull request to `kj-dee-branch` and `main`.
- README `Language Support` now states the two Thai mechanisms and their boundary: `thaiUiCopy` for interface chrome, per-question `*Th` fields plus `app/questionTranslations.th.ts` for question content.
- `exports/glossary_th.json` aligned with the README style guide (Domain, Competency, Assessment, Platform, telemetry, Workflow stay in English).
- `exports/artifact-language-tags.json` — artifact language tags re-checked against the expanded relevance gate: 26 artifacts still display and need Thai versions, 15 stay English, none should be produced for gated uses.

## 2026-09-11: Thai Localisation Batch 1 Applied (163 Items Reviewed)

Native review of `exports/New_Horizon_Thai_Review_Batch1.xlsx` came back with all 163 Thai-priority-High items approved after in-cell edits (39 scenarios and 32 prompts reworded; meaning, naturalness, terminology, UI fit and cultural fit all confirmed; every answer key judged still unambiguous in Thai). Applied as `translationStatus: 'reviewed'`.

- New generated module `app/questionTranslations.th.ts` (137 items) holds Thai for scenario, prompt, options and feedback, rank steps and rationale, matching pairs, multi-part items, rubric labels and Thai keywords, exemplar answers, and artifact/visual-card text. `localizeQuestion()` merges it over any inline `*Th` fields; the table wins.
- The 26 Horizon items keep their inline Thai, now with the reviewer's corrected scenario and prompt.
- Localisation now covers matching (scored against the pairs as shown; selections reset on language switch), multi-part items, rank rationale, and free-text items: `scoreTextAnswer` matches English and Thai keywords, so Thai written answers score.
- Glossary (`exports/glossary_th.json`, 65 terms) and artifact language tags (16 Thai needed / 9 Both / 16 Keep English) confirmed as proposed.

Verified: lint clean, production build passes, VM tests for every interaction type (ids/scores identical across languages; Thai free-text answer scores 98; matching key present in translated choices), headless walkthrough in Thai renders a translated item in Thai and an untranslated item in English with no runtime errors. 18 pre-existing TypeScript errors unchanged.

## 2026-09-10: Per-Question Thai Localisation Model

The question bank can now carry Thai text on each item instead of relying on the interface-string dictionary. New optional fields: `contextTh`, `promptTh`, `translationStatus` on `Question`; `labelTh`, `feedbackTh` on `Option`; Thai variants for artifact alt/label/caption, visual-card title/eyebrow/caption/points, and rank-item labels. `localizeQuestion()` overlays them at render time with English fallback and only for items that have a `translationStatus`, so partially translated content never mixes languages within one question. Ids, scores, keys, and telemetry are unchanged; the feedback panel re-localises the stored answer when the language toggle changes.

Seeded the 26 Horizon reliance items (`REL-H-*`) as `draft`: scenario and best-answer rationale from the deck's Thai, plus drafted Thai for shared reliance option labels, partial-credit feedback, and visual-card points. See `docs/LOCALISATION.md` for the model, status workflow, style rules, and batch process.

Verified: lint clean, production build passes, VM test of `localizeQuestion` (ids/scores identical across languages, untranslated items returned untouched), browser smoke test with the Thai toggle shows no runtime errors. 18 pre-existing TypeScript errors unchanged.

## 2026-09-10: Question Bank Audit Round 1 Applied

Reviewers completed `exports/New_Horizon_Question_Bank_Audit_Completed.xlsx` (660 questions, 2,552 choices, 41 artifacts). Outcome: 619 Keep / 41 Revise / 0 Remove; every answer key confirmed; 30 items rated "too hard" for their band because of scenario length. Changes applied from the verdicts:

- Legacy reliance items (`REL-G-*`, `REL-E-*`, 11 items flagged "predictable bias towards Together"): each scenario now carries an explicit stakes edge and the keys vary. Scheduling reply and explaining a term are now AI-led; the breaking-news repost, sensitive face-to-face feedback, the data incident whose root cause is the AI workflow itself, the role-redesign announcement, and the unvalidated investor forecast are now human-owned; portfolio prioritisation, board explanation, and agent tool access stay shared but with a stronger human-owned option. Across the 12 legacy items the keys are now 6 Me / 4 Together / 2 AI.
- Horizon awareness items (`REL-H-D6-005`, `REL-H-D2-007/010/014/021/023`): scenario text shortened to one or two sentences as requested.
- Market-trend awareness items (24 `TREND-*-AWARENESS-01`): the appended "Focus competency … the user should show they …" sentence is removed at awareness level so the item reads as a scenario, not a rubric. Subject-verb grammar fixed for the other bands ("they use", not "they uses").
- Drag-order items (23, flagged "enrich feedback"): new optional `rankRationale` field on `Question`, authored for every drag-order item. After submitting, the feedback now states how many steps were in the right position, the best order, and why that order.
- Artifacts: the six hidden-by-gate artifacts reviewers marked "Improve" stay gated; they need visual redesign before ungating and are left on the artifact backlog.

Verified: lint clean, production build passes, 660 unique ids, 18 pre-existing TypeScript errors unchanged. Detailed verdict-to-change mapping in `docs/AUDIT_ROUND_1_RESPONSE.md`. New helper `scripts/dump-question-bank.mjs` exports the bank to JSON for regenerating the audit workbook.

## 2026-09-10: Horizon "AI or Me?" Reliance Deck Imported

Added `horizonRelianceQuestions` (26 `reliance-decision` items, ids `REL-H-*`) to the general question bank, imported from the Horizon Field Lab "Appropriate reliance" swipe deck (`horizon-field-lab.pages.dev/reliance`). The full inventory, including Thai text, wildcard cards, and the deck's own scoring rules, is documented in the project workspace (`Horizon_Reliance_Deck_Question_Inventory`).

Differences from the legacy reliance items:

- The best answer varies by scenario (9 AI-led, 9 human-owned, 8 shared) instead of always being "Shared with AI", so the format now discriminates over-reliance from under-reliance.
- Each option carries its own score and feedback; the best option (98) reuses the deck's evidence-based rationale, and partial-credit options explain the trade-off.
- Items are tagged with `competencyIds` across D2 tool selection and output refinement, D3 source verification, D4 fairness, privacy, regulatory and governance controls, D5 strategy, and D6 role clarity.
- Horizon's `scheduling-reply` card was not imported because `REL-G-D2-001` already covers that scenario with an artifact.

The adaptive router still shows at most one `reliance-decision` item per sitting, so this widens the pool rather than lengthening the assessment. Verified: lint clean, production build passes, 252 unique question ids; the 16 pre-existing TypeScript errors on the branch are unchanged.
## 2026-09-11: Report Simplification

The assessment report Summary tab is reorganized around the user’s immediate questions: score meaning, whether to continue, personalized summary, strengths, priority gaps, domain/competency results, learning path, courses, bootcamps, and feedback. Secondary material such as Did you know, leaderboard, score calculation, telemetry, evidence-mode split, badges, profile signals, and improvement math now sits in Question review/analysis to reduce clutter.

## 2026-09-11: Score Calibration And Learning Path Visibility

Overall scoring now applies an answer-quality evidence factor after the D1-D6 domain average. This prevents a mostly incorrect run from looking stronger than the answer evidence supports while still preserving partial credit for genuinely partial answers. The report score calculation now shows the domain average, raw answer-quality average, applied factor, and final score.

Bootcamp and workshop recommendations now appear directly inside the recommended learning path card, with the detailed bootcamp section still kept underneath recommended courses.

## 2026-09-11: UX Priority Cleanup

The public product structure is now simplified to `Free Assessment` and `Premium Diagnostic`. Executive context remains available inside Premium through role selection and recommendation logic, instead of appearing as a separate public assessment tier.

Leaderboards now use anonymous display labels by default. The product should show real names or aliases only after explicit user opt-in, because peer comparison should motivate users without exposing identity or email-derived names.

Question-level feedback is reset when a new assessment starts, including useful/unclear selections and comment drafts. The feedback comment input is keyed by session, question, and placement with browser autocomplete disabled to prevent old user notes from appearing like stale app data.

The report order now keeps recommended bootcamps and workshops underneath recommended courses. Courses remain the lighter next step; bootcamps are positioned as deeper guided practice when the assessment shows role, team, or confidence gaps.

The landing page now prioritizes the starting choices, peer challenge, and guide cards. Heavier sections such as practice labs, platform method, scoring details, framework crosswalk, domains, results preview, and premium details are grouped under an expandable `Explore more` panel to reduce first-page clutter.

Artifact cards now include an `Inspect for` cue derived from the artifact caption. The design rule is that artifacts should be shown only when they clarify the task or provide evidence the user needs; otherwise the question should stand alone without an artifact.

## 2026-09-11: Bootcamp Recommendations In Learning Path

Added a structured New Horizon bootcamp and workshop catalog covering AI Fundamentals, Practical AI for Work, Advanced AI Operator, Executive AI Strategy, AI Governance and Risk, AI Agent and Workflow Lab, Role-Based AI Bootcamps, and AI Train-the-Trainer.

The assessment report now recommends bootcamps when the user's score, weak domains, weak competencies, assessment mode, function track, executive role, or profile signals indicate that guided practice is useful. Each recommendation is expandable so users can see who it is for, why to take it, expected learning outputs, workshop labs, best-fit roles, and framework alignment.

Added `docs/AI_BOOTCAMP_WORKSHOP_CATALOG.md` as the source-of-truth training catalog. Future training, scoring, role-mapping, and learning-path changes should keep this document, the report UI, README, latest-change log, and admin/agent recommendation prompts aligned.

## 2026-09-11: Artifact Relevance Cleanup

Expanded the artifact display gate so more low-value concept cards, generic product maps, simple workflow diagrams, and explanatory visual cards are hidden when the question can be answered from the scenario, prompt, options, or rubric without inspecting an artifact.

The same helpful-artifact gate now drives artifact-backed counts, adaptive routing visual bonuses, telemetry analysis, and admin artifact replacement briefs. This prevents hidden/decorative artifacts from inflating coverage or distracting users during assessment.

Question authors should show an artifact only when it contains necessary evidence, clarifies ambiguous scenario context, or simulates realistic document inspection. If the artifact is merely decorative, redundant, too generic, or not referenced by the answer key, hide it or replace it before scored use.

## 2026-09-11: Global Framework and Scoring Home Tabs

The home page now includes discoverable menu tabs for `Scoring model`, `Global frameworks`, and `Adaptive testing`.

The `Scoring model` section explains how the platform derives results from raw answer evidence, difficulty-adjusted readiness evidence, competency roll-ups, domain roll-ups, the D1-D6 overall score, confidence, and continuation recommendations. It also shows the current seeded readiness bands for Awareness, Applied, Proficient, and Advanced items.

The `Global frameworks` section maps New Horizon D1-D6 to reputable international frameworks and research, including UNESCO AI competency frameworks, the OECD/European Commission AI Literacy Framework, NIST AI RMF, EU AI Act Article 4, DigComp 2.2, ISO/IEC 42001, Singapore AI Verify / MGF GenAI, and AI literacy research.

Added `docs/GLOBAL_AI_FRAMEWORK_CROSSWALK.md` as the source-of-truth documentation for the framework mapping. Future changes to domains, competencies, scoring, adaptive routing, telemetry, or admin agent prompts should keep the home-page tabs, report explanations, README, latest-change log, and crosswalk document aligned.

## 2026-09-11: Thai Context and Saved Label Fixes

Adjusted Thai leaderboard copy from the overly literal "วันนี้คุณจะอยู่ตรงไหน?" to "วันนี้คะแนนของคุณจะอยู่ตรงไหน?" so the meaning is clear in context.

Saved score and ranking labels now normalize older `General public`, `Professional`, and `Team member` wording at display time, so existing local results show the cleaner labels `General`, `Work`, and `Team` without clearing past assessment data.

## 2026-09-11: Navigation and Thai Copy Cleanup

The top navigation is simplified to `Home`, `Assessment`, `Practice`, `AI Watch`, `Dashboard`, and `Admin`. Secondary pages such as Agent Ops, demo reports, platform explanation, and detailed results now sit inside their relevant flows instead of crowding the main navigation.

Audience wording is simplified: `General public` is now `General`, `Professional` is now `Work`, and `Team member` is now `Team`. Thai translation coverage was expanded across onboarding, assessment controls, report tabs, feedback survey, score explanations, telemetry labels, and report sections. Thai copy remains simple and keeps technical terms such as AI, Workflow, Agent, Domain, Competency, Assessment, telemetry, and Platform recognizable.

## 2026-09-10: Artifact Relevance Gate

Assessment artifacts are now gated before display. Several low-value or decorative concept/rollout artifacts are hidden when the question can be answered from the scenario and options without inspecting the image.

The adaptive engine now counts only helpful displayed visuals when rewarding visual evidence coverage. Artifacts should be shown only when they contain evidence the user needs, clarify the scenario, or support realistic document inspection. Decorative artifacts, answer-giving artifacts, and generic diagrams should be removed or rewritten before scored use.

## 2026-09-10: Thai and English Language Toggle

The app now includes an `EN` / `TH` language switch in the top navigation. The preference is saved locally and reapplies as users move between landing, assessment, report, and admin views.

Thai translation should use simple Thailand Thai phrasing while keeping technical terms such as AI, Workflow, Prompt, Model, Agent, API, RAG, LLM, ROI, KPI, Domain, Competency, telemetry, and Platform recognizable in English.

## 2026-09-09: Item Quality Gate

Admin now shows an item quality gate for question-level feedback and behavior signals. Each question is classified as `keep`, `watch`, or `review` using unclear flags, issue comments, likes, timing, and confusion signals.

Questions marked `review` are penalized in adaptive routing so the assessment stops favoring items with repeated negative feedback. They can still appear only when coverage pressure leaves no better alternative. Admin review should rewrite, replace the artifact, or retire these items before heavy scored use.

## 2026-09-09: Per-Question Feedback During Assessment

Each assessment item now includes a lightweight quick-feedback strip at the bottom of the question card and again in answer review. Users can mark the current question as useful, flag the question or instruction as unclear, or leave an optional note such as artifact relevance, obvious answer options, ambiguous wording, or missing evidence.

The feedback is stored as item-level telemetry with question id, domain, competency ids, difficulty, interaction type, current progress, feedback kind, and optional comment. Admin quality review can use this alongside timing, hesitation, artifact zoom/open behavior, and end-of-assessment survey results to prioritize specific question rewrites and artifact replacements.

Useful/unclear selections are now editable before saving: users can click once to select, click again to unselect, then explicitly Save or Clear the item feedback.

## 2026-09-09: Question Quality and Survey Reset Fix

The assessment feedback form now resets at the start of each new assessment and after feedback submission. This prevents a previous user's free-text suggestion from remaining visible in the survey for the next run on the same browser/device.

Scoring floors were tightened so guessing is no longer rewarded as partial evidence:

- Written answers with no rubric hits now score `0` instead of receiving a default floor.
- Blank written answers are disabled in the UI and still score `0` if submitted through another path.
- Ranking and matching items no longer give minimum floor points for wrong or unsupported attempts.
- Multi-select wrong-selection penalties can reduce the score to `0`.

Question and artifact review should treat the following as publish blockers: obvious answer patterns, weak distractors, ambiguous written prompts, artifacts that are not needed to answer the item, artifacts that do not contain the evidence referenced by the answer key, and artifacts that look like decorative mockups rather than plausible work documents.

## 2026-09-09: Assessment Report Cleanup

The assessment report now separates the learner-facing report from diagnostic details. The default Report tab prioritizes score interpretation, personalized summary, strengths, priority gaps, domain and competency scores, learning paths, tools/labs, courses, improvement actions, badges, and the persona leaderboard.

The Test analysis tab now holds the deeper machinery: score calculation, telemetry, question-level evidence, coverage plan, profile signals, saved analytics, and source/evidence notes. Repeated generated-report sections were collapsed so users do not see the same learning path, courses, competency focus, and analysis repeated in multiple places.

Continuation prompts now show the pilot confidence percentage as the prominent value. Recommended follow-up question counts are described in the body text and action labels so users do not confuse “8 questions” with “8% confidence.”

The user feedback survey now appears near the top of the main Report tab instead of the Test analysis tab. A dismissible pop-up frames the survey as a clear value exchange: four quick feedback answers unlock question-by-question evidence, expected answers, timing, difficulty, and local comparison data.

## 2026-09-09: Score Explanation and No-Response Scoring

Blank written responses, empty multi-select submissions, blank matching submissions, and unanswered mini-parts now receive `0` raw score and `0` readiness evidence instead of a small floor score. The answer review now includes a score explanation panel showing raw score, difficulty-adjusted readiness evidence, and the maximum readiness evidence allowed by the item difficulty band.

The final report now includes a score calculation card that shows question-level raw-to-readiness conversion, competency roll-up, domain roll-up, the D1-D6 overall formula, and a clear note that timing, hesitation, artifact use, item `a/b/c`, information, and SEM are telemetry/calibration signals rather than direct score modifiers in the MVP.

## 2026-09-08: In-Assessment Telemetry Help

The assessment now shows lightweight help bubbles beside live measurement labels so users can understand what telemetry and psychometric signals mean during the test. Help topics cover progress, domain, difficulty, item type, interaction format, time on question, answer interactions, artifact use, scored evidence, theta, item difficulty `b`, discrimination `a`, guessing `c`, information, SEM, routing reason, and coverage confidence.

Admin Agent Ops now includes an explicit Feedback Analysis Agent. It analyzes survey ratings, free-text suggestions, abandonment, continuation choices, hesitation, long answer times, and artifact zoom/open behavior before producing recommendations. Its draft proposals remain suggestions for human review, not automatic platform edits.

Added separate repo documents for stakeholder review:

- `docs/AGENT_WORKFLOWS_ORCHESTRATION.md`
- `docs/TELEMETRY_TRACKING_PURPOSE.md`

## 2026-09-08: Telemetry and Agent Orchestration Documentation

Added `docs/TELEMETRY_AND_AGENT_ORCHESTRATION.md` as the canonical repo reference for what telemetry is collected, why it is collected, how confidence and continuation use the evidence, how artifact readability signals are reviewed, and how supervised Agent Ops proposals move through human approval.

The companion Obsidian architecture note was also updated to keep the strategy view aligned with the repo implementation. Both documents emphasize that agents analyze telemetry, survey feedback, trends, coverage, and artifact signals before suggesting changes; humans still approve scored questions, rubrics, scoring parameters, profile ontology, surveys, learning recommendations, AI Watch items, and production artifact replacements.

## 2026-09-08: Artifact Reader, Evidence Completion, and Telemetry Review

The assessment now includes a full-size artifact reader for every image/SVG/PNG stimulus. Users can open dense artifacts in a modal, zoom to 1x, 1.5x, or 2x, and open the source file in a new tab. Artifact-reader actions are logged with question id, domain, competency, difficulty, artifact path, action type, and zoom level, so admins can identify which diagrams or text-heavy screenshots are hard to read.

The fixed 12-question and 20-question routes now act as milestones, not hard endpoints. After the normal route is complete, users can continue into an evidence-completion route that targets relevant competencies until planned/profile-priority areas have high-confidence evidence or the safety cap is reached.

The result report now explains what telemetry is collected and how it is used:

- Answered-question records with selected answer, expected answer/rubric, domain, competency, difficulty, and adjusted score.
- Per-question time, interactions, revisions, and hesitation classification.
- Artifact open, zoom, and external-file actions.
- Abandonment, mandatory completion, optional continuation, and report-interest clicks.
- Feedback survey results for clarity, difficulty, artifact quality, length, and suggestions.

Admin now has a human review gate for agent improvements. Agents should analyze survey feedback, behavior trends, artifact legibility patterns, competency coverage, and cohort signals before suggesting edits. A human reviewer still approves, rejects, or rewrites proposals before scored items, artifacts, profile fields, or surveys change.

New realistic artifacts were also added for:

- Scheduling email and calendar review.
- Customer support ticket with duplicate-charge evidence and weak AI draft.
- Refund-agent workflow builder with missing approval gate, partial audit log, and missing rollback owner.

## 2026-09-08: Flood and Media Artifact Upgrade

The flood/disaster misinformation items no longer rely on one repeated image. The assessment now uses three distinct artifact contexts:

- A realistic social post showing flooding near a transit station.
- A forwarded chat screenshot with vague same-day flood claims.
- A claim-review dashboard comparing a viral post against weather, traffic-camera, alert, and source-history evidence.

Several mismatched placeholder references were corrected as well. CEO or celebrity endorsement questions now use endorsement/listing artifacts instead of unrelated flood imagery.

This improves artifact variety, realism, and relevance while preserving the intended skill: users must check provenance, date, location, source chain, and official evidence before sharing or acting.

## 2026-09-08: Supervised Agent Jobs and Personalized Knowledge Prompts

The Admin Agent Ops area now has a persisted supervised job loop instead of only a static simulation. Admins can run local agent jobs that read telemetry, assessment feedback, profile snapshots, item counts, and artifact counts, then create draft proposals for:

- Question rewrites or new competency-depth items.
- Realistic artifact replacement briefs.
- Profile ontology updates.
- Survey timing and wording improvements.
- Learning recommendation refreshes.
- AI Watch brief candidates.

Each draft has a pending, approved, or rejected state. Admin decisions are stored locally with the run history. No scored assessment content is published automatically; approved proposals are still review decisions, not silent mutations of the live bank.

The landing page, user dashboard, and report now include a personalized "Did you know?" prompt. The selected prompt uses profile tags, function/role context, weak domains, and assessment progress to teach a timely AI concept and invite the user into a deeper route, practice lab, profile update, or AI Watch.

This keeps the continuous-improvement loop visible: telemetry and feedback can nominate improvements, but scoring content remains supervised, versionable, and reviewable.

## 2026-09-07: Assessment Continuation Recommendation

Commit: `175e1b3 Improve assessment continuation recommendation`

The platform now makes the prompt to continue the test more conspicuous in two places:

- At the end of the final mandatory question, before the user enters the report.
- Near the top of the test report, immediately after score interpretation.

The recommendation tells the user whether continuing is recommended or optional. It explains the reason using assessment evidence:

- Pilot confidence is still low or medium.
- Some sampled competencies remain low-confidence.
- Some profile-priority competencies were not sampled.
- Planned baseline coverage still has gaps.
- The user's profile indicates a deeper route is needed.

The continuation route is profile-aware. For example, users who look like content creators, marketers, or media-heavy users are routed toward deeper evidence for:

- Image and video AI use.
- Media provenance.
- Claim verification.
- Prompt refinement.
- IP, fairness, and ethics.
- Campaign measurement.

Technical, finance, and people/HR profiles receive similar targeted routes based on their competency priorities.

The report now gives users a clearer choice:

- Continue with the recommended targeted route.
- View the report snapshot immediately.
- Choose a selected-domain deep dive.

This change is designed to improve score differentiation between beginner, intermediate, and advanced users by collecting harder and more role-relevant evidence before treating the profile as stable.

## 2026-09-07: Landing Peer Leaderboard

The landing page now includes a daily/weekly top-10 peer challenge board. It is designed to make visitors curious about where they would rank before they start the assessment.

The board shows:

- Top 10 scores for today or this week.
- Persona or peer-group labels.
- Each visible run's strongest domain.
- A score-to-chase insight.
- Hot-skill and active-peer-group trend cards.
- A call to take the free test or choose a peer group in the premium flow.

The MVP reads local saved score logs when available and uses demo pilot rows when there are not enough local runs yet. In production, this should move to consented, privacy-safe server-side leaderboard views with day/week aggregation by persona, group, organization, country, and cohort.

## 2026-09-07: Market-Trend Question Expansion

The question bank now includes generated market-trend items for every granular competency and all four difficulty levels. These questions are practical scenarios based on current AI-market shifts:

- Agentic AI and tool-taking workflows.
- Multimodal image/video/content generation.
- RAG, context engineering, and source quality.
- Domain-specific models and benchmark caveats.
- Responsible AI governance and incident handling.
- Data residency, local language, and vendor-dependence concerns.
- Workforce skill shifts and operating-model change.

The trend items are mapped to granular competencies, skills, difficulty, and evidence mode so adaptive routing can use them like the rest of the scored bank.

## 2026-09-07: Transparent Profile Pulse

The landing page now includes a small optional profile pulse that asks users which AI trend their assessment should pay closer attention to. Choices become local profile tags and competency targets for later adaptive routing.

The product should keep this visible and consent-aware: implicit behavior signals can improve tailoring, but the platform should disclose how routing and recommendations use profile evidence.

## Verification

- `pnpm lint` passed.
- `pnpm build` passed.
- GitHub push was verified after credential setup and reported `Everything up-to-date`.
