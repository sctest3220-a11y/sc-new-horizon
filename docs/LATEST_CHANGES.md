# Latest Changes

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
