# New Horizon MVP Requirements Specification

Version: 2026-09-15  
Audience: product, engineering, data, assessment design, and implementation partners  
Status: developer handoff draft for proper MVP go-live

## 1. Product Goal

New Horizon is an adaptive AI readiness assessment platform. The MVP must measure practical AI capability, not only self-reported confidence or simple AI vocabulary. Users should answer realistic scenarios, inspect artifacts when useful, receive a clear readiness report, and get recommended learning paths. Admins should be able to review assessment quality from telemetry and feedback before improving questions, artifacts, scoring, profile fields, or learning recommendations.

The living feature inventory and release-stage status are maintained in [Feature Catalog by User Type and Release Stage](FEATURE_CATALOG_BY_USER_AND_RELEASE.md). A capability must not be treated as production-ready solely because it appears in the local prototype.

The MVP is not a certification-grade psychometric product yet. It must be built so pilot data can later calibrate item difficulty, discrimination, guessing, score bands, confidence, and competency coverage.

## 2. Target Users

- General users who want to understand their practical AI readiness.
- Students and educators using AI for learning, verification, and productivity.
- Professionals using AI in daily work.
- Teams and organizations assessing AI literacy, workflow readiness, and risk awareness.
- Premium users who need function, industry, or leadership-specific diagnosis.
- Admin reviewers who manage content quality, telemetry analysis, and supervised improvement proposals.

## 3. MVP Scope

### In Scope

- Public landing page with Free Assessment and Premium Diagnostic entry points.
- English and Thai language toggle.
- Optional profile survey and profile pulse.
- Adaptive assessment flow with multiple question formats.
- D1-D6 domain and competency scoring.
- Difficulty-adjusted readiness scoring.
- Continue-assessment flow after 12/20 question milestones when confidence or coverage is weak.
- Artifact display, relevance gating, and full-size artifact reader.
- Per-question feedback.
- End-of-assessment survey.
- Final report with score, domain/competency results, strengths, gaps, learning path, courses, bootcamps, and analysis tab.
- Persona-scoped leaderboard and daily/weekly teaser board.
- Admin dashboard with telemetry, quality analysis, calibration views, artifact briefs, and pilot CSV export.
- Supervised Agent Ops draft workflow with human approval gate.
- Documentation for scoring, telemetry, framework mapping, agents, deployment, and production readiness.

### Out of Scope for MVP

- Certification claims.
- High-stakes hiring, promotion, regulatory, or academic placement decisions.
- Fully automated question/rubric/artifact publishing by agents.
- Browser-side use of secret AI provider API keys.
- Production-grade psychometric calibration from large samples.
- Multi-tenant enterprise analytics unless backend, RLS, and admin-role policies are completed.

## 4. Core Domains and Competencies

The assessment must use six domains:

| Domain | Name | Purpose |
| --- | --- | --- |
| D1 | AI Foundations & Concepts | Understand AI vocabulary, model behavior, GenAI mechanics, capabilities, and limits. |
| D2 | Practical Application & Tooling | Use AI tools, prompts, workflows, and outputs effectively. |
| D3 | Critical Evaluation & Judgment | Check sources, media, charts, claims, hallucinations, and evidence quality. |
| D4 | Risk, Ethics & Governance | Identify privacy, fairness, security, regulatory, oversight, and audit risks. |
| D5 | Strategy & Value Realization | Connect AI use to business value, ROI, portfolio priorities, and scale gates. |
| D6 | Human-AI Collaboration | Define human/AI roles, accountability, trust, adoption, and learning loops. |

The question bank must map each question to:

- primary domain
- optional secondary domains
- competency ids
- skill ids
- difficulty
- interaction type
- evidence mode: knowing, doing, or hybrid
- optional role/function/industry relevance
- artifact requirement, when applicable
- answer key/rubric
- version metadata

## 5. Question Types

The MVP must support:

- single choice
- multi-select with no positive floor for empty/wrong selections
- rank/order
- matching
- written response with rubric criteria
- multi-part concept cluster
- artifact-backed review questions
- practical decision scenarios

Question rules:

- Advanced items must require synthesis, tradeoff judgment, verification, governance, implementation reasoning, or realistic artifact review.
- Avoid obvious distractors and giveaway answer patterns.
- Avoid overusing simplistic Human / AI / Both questions.
- Written prompts must name the task, context, expected evidence, and scoring lens.
- If an artifact is not needed to answer the item, hide it or rewrite the item.

## 6. Artifact Requirements

Artifacts must be shown only when they improve the question. Design, localization, telemetry, versioning, accessibility, and release review must follow the canonical [Artifact Design and QA Standard](ARTIFACT_DESIGN_AND_QA_STANDARD.md).

Release-ready artifacts must be:

- relevant to the question prompt
- necessary or clearly useful for the answer key
- realistic for the role, workflow, or industry context
- legible inline or in expanded view
- internally consistent
- free of decorative mockup styling that distracts from evidence review
- mapped to the specific evidence referenced by correct answers, distractors, explanations, or rubrics

The platform must include:

- artifact relevance gate
- full-size artifact reader
- fit-to-window expanded view
- zoom controls
- open raw artifact action
- telemetry for artifact open, zoom, and external open
- admin artifact replacement briefs

## 7. Adaptive Assessment Flow

The assessment must support:

- Free Assessment: 12-question milestone.
- Premium Diagnostic: 20-question milestone.
- Executive/leadership context inside Premium.
- Optional continuation beyond 12/20 questions.
- Evidence-completion route until relevant competencies reach stronger confidence or a safety cap is reached.

Routing inputs:

- audience
- function
- industry
- executive role
- profile survey tags
- AI experience level
- AI confidence level
- previous answers
- score evidence
- domain coverage
- competency coverage
- difficulty movement
- flagged item quality

Starting difficulty:

- Ask users to self-rate AI experience and confidence.
- Use those answers to choose the initial item difficulty.
- After the first item, adapt based on answer evidence, coverage gaps, and profile priorities.

## 8. Scoring Requirements

The MVP scoring model must separate raw correctness from readiness evidence.

Question score:

1. Calculate raw answer score from selected option, multi-select, rank, match, text rubric, or parts.
2. Convert raw score into difficulty-adjusted readiness evidence.
3. Apply seeded difficulty caps:

| Difficulty | Partial Anchor | Max Readiness |
| --- | ---: | ---: |
| Awareness | 40 | 68 |
| Applied | 58 | 82 |
| Proficient | 72 | 92 |
| Advanced | 82 | 100 |

No-response handling:

- blank written response: 0
- empty multi-select: 0
- empty matching: 0
- unanswered mini-parts: 0
- unsupported written response with no rubric hits: 0

Rollups:

- Competency score = average readiness evidence for mapped signals.
- Domain score = readiness points divided by weighted evidence count.
- Secondary domains count at 0.35 weight.
- Overall score = domain average adjusted by answer-quality evidence factor.
- Unsampled domains must display as `Not assessed`, not as a measured score.
- Report must show the calculation plainly.

Confidence:

- Pilot confidence is an evidence-stability estimate, not score correctness.
- Competency confidence depends on repeated evidence.
- Low or medium confidence should recommend continuation.

## 9. Report Requirements

The final report must prioritize:

- overall score and belt/readiness level
- confidence and whether to continue
- domain scorecard
- competency results
- strengths
- priority gaps
- recommended learning path
- recommended courses
- recommended bootcamps/workshops
- practical labs/tools
- user feedback survey

The analysis tab must include:

- question-by-question score evidence
- question prompt
- user answer
- expected answer/evidence
- raw score
- readiness score
- measured competency
- behavior signals
- local benchmark, when enough data exists
- domain rollup
- competency rollup
- telemetry explanation
- coverage plan
- profile signals
- score analytics

The report must clearly label:

- `Not assessed`
- `Insufficient data`
- `Local/demo data`
- `Pilot confidence`
- `Not certification-grade`

### 9.1 Premium Report Copilot

Premium reports should include a bounded `Ask about your results` copilot grounded in structured assessment evidence. It should explain scoring, answer evidence, confidence, coverage, strengths, gaps, learning paths, course/lab/bootcamp recommendations, and reasons to continue testing. It may create a personalized learning or reassessment plan and should link users to the relevant report section or action.

Basic score meaning and score calculation must remain available to all users without the chatbot. Freemium may receive a limited message allowance; Premium receives the complete personalized experience within admin-configured usage and budget limits.

The copilot must:

- use versioned scores, questions, responses, rubrics, competency evidence, profile context, recommendation reasons, and approved learning resources
- distinguish measured results, system interpretation, and suggested next steps
- state when evidence is insufficient or a competency was not assessed
- respect report entitlements and privacy-safe peer aggregates
- cite or link to the supporting assessment evidence
- record model, prompt, assessment, scoring, and configuration versions

The copilot must not:

- invent scores, evidence, learning resources, or peer comparisons
- characterize an unassessed competency as weak
- change a score, rubric, answer key, or historical result
- reveal another user's information
- provide hidden chain-of-thought
- make employment or other high-impact decisions from assessment results

Admin must control copilot availability, plans, models, prompts, message limits, context limits, retention, telemetry, cost budgets, fallback behavior, and emergency disable. Usage analytics must include average cost per copilot user, conversation, message, report, and resolved question. See [Admin Settings and Configuration Specification](ADMIN_SETTINGS_CONFIGURATION.md).

## 10. Learning and Bootcamp Requirements

The platform must recommend:

- domain-specific learning paths
- courses
- bootcamps/workshops
- practice labs
- tools to explore
- concepts to strengthen

Bootcamp recommendations must include:

- who it is for
- expected learning outcomes
- why take it
- duration
- level
- workshop labs
- best-fit roles
- mapped domains/frameworks

Recommended bootcamps should appear below recommended courses in the report.

## 11. Telemetry Requirements

The MVP must track:

- assessment start
- question shown
- question answered
- question id
- question version
- rubric version
- artifact version
- selected answer
- expected/correct answer
- raw score
- readiness score
- domain
- competency
- difficulty
- interaction type
- evidence mode
- elapsed time
- interaction count
- revision count
- hesitation classification
- artifact open/zoom/external open
- per-question feedback
- abandonment
- mandatory completion
- continuation accepted/declined
- results viewed
- report-interest clicks
- end-of-assessment survey
- score logs
- profile signals
- supervised agent draft/review state

Telemetry must be transparent to users and used for:

- score explanation
- confidence explanation
- item quality review
- artifact quality review
- profile personalization
- route improvement
- leaderboard cohorts
- learning recommendation improvement
- admin analytics
- supervised agent proposals

## 12. Assessment Quality Analytics

Admin must include these 10 quality-analysis views:

1. Item discrimination.
2. Distractor analysis.
3. Artifact dependency.
4. Question clarity index.
5. Difficulty calibration.
6. Competency coverage heatmap.
7. Score reliability estimate.
8. Written-response rubric audit.
9. Route/persona fit.
10. Learning/report engagement.

Each view must show `Insufficient data` when pilot volume is too low.

Admin item quality rows must include:

- status: keep, watch, review
- action: Rewrite now, Replace artifact, Recalibrate difficulty, Rewrite or retire, Watch, Keep
- attempts
- average score
- average time
- confusion rate
- artifact action rate
- feedback count
- unclear count
- negative signals
- recommended human-review action

## 13. Feedback Requirements

Per-question feedback must appear:

- at the bottom of each question
- again after answer reveal

Users must be able to:

- mark useful
- mark unclear
- unselect useful/unclear
- leave optional note
- save or clear feedback

Feedback notes must be scoped by:

- session id
- question id
- placement

No stale feedback from previous users or previous assessments may appear.

End-of-assessment survey must ask:

- clarity
- difficulty fit
- artifact quality
- length fit
- optional suggestions

Survey feedback should unlock detailed analysis as a value exchange.

## 14. Profile and Personalization Requirements

Profile collection must be lightweight and optional.

The platform should collect:

- audience
- role/function
- industry
- executive role, if relevant
- AI experience
- AI confidence
- tools used
- workflows
- learning interests
- peer-tool awareness
- risk concerns
- report interests
- continuation behavior

These signals must personalize:

- starting difficulty
- question routing
- domain targets
- radar targets
- Did you know prompts
- learning path
- labs
- bootcamps
- leaderboard peer group

The platform must avoid hidden sensitive inference and keep personalization explainable.

## 15. Leaderboard Requirements

The landing page must show:

- daily top 10
- weekly top 10
- peer/persona scoped grouping
- anonymized display names by default
- strongest domain
- score-to-chase
- interesting trends/insights

Production must require opt-in before showing real names or aliases.

Leaderboard data must be labeled as:

- demo
- local
- pilot
- verified cohort

## 16. Admin and Agent Ops Requirements

The detailed, authoritative configuration design is maintained in [Admin Settings and Configuration Specification](ADMIN_SETTINGS_CONFIGURATION.md). It covers assessment and profile controls, report entitlements, tracker policies, agent schedules, provider/model routing, secure API credentials, usage ledgers, budgets, average-cost metrics, unit economics, configuration versioning, approvals, and rollback.

Admin must support:

- local MVP analytics
- quality review dashboard
- pilot-review CSV export
- artifact replacement briefs
- supervised agent runs
- draft proposals
- approve/reject workflow
- analytics readiness checklist
- production readiness checklist

Agent roles:

- Orchestrator Agent
- Assessment Blueprint Agent
- AI Concepts Scout
- AI Newsfeed Agent
- Training and Course Scout
- Assessment Item Generator
- Stimulus Builder Agent
- Reviewer/QA Agent
- Feedback Analysis Agent
- Psychometric Monitor
- Data Quality Monitor
- Localization QA Agent
- Report UX Agent
- Framework Alignment Agent

Agents may:

- analyze telemetry
- summarize feedback
- identify trends
- draft proposals
- recommend question rewrites
- recommend artifact replacement
- recommend profile/survey changes
- recommend learning updates

Specific ownership:

- Orchestrator Agent owns workflow state, run coordination, budgets, retries, dedupe, and review queues.
- Assessment Blueprint Agent owns competency, domain, difficulty, role, industry, persona, and item-format coverage planning.
- Assessment Item Generator owns draft questions, answer keys, rubrics, partial-credit logic, difficulty estimates, and competency mapping.
- Stimulus Builder Agent owns artifact briefs, candidate artifact requirements, realism checks, legibility checks, accessibility notes, and answer-key evidence mapping.
- Feedback Analysis Agent owns survey/item-feedback theme analysis and action recommendations.
- Psychometric Monitor owns difficulty drift, discrimination, guessing, partial-credit behavior, response time, fairness, cohort validity, and score-stability review.
- Data Quality Monitor owns missing events, duplicate sessions, local-only data, version-tag gaps, incomplete score logs, stale feedback state, broken exports, and insufficient-sample warnings.
- Localization QA Agent owns English/Thai context fit, untranslated strings, preserved technical terms, and translation-caused layout issues.
- Report UX Agent owns report-interest analysis, continuation behavior, recommendation engagement, report ordering, and score-explanation clarity.
- Framework Alignment Agent owns alignment to UNESCO, OECD/EC, NIST AI RMF, EU AI Act Article 4, DigComp, ISO/IEC 42001, AI Verify, Gartner, McKinsey, and BCG references.
- Reviewer/QA Agent owns final quality challenge before human review: source support, duplicates, answerability, distractors, artifact realism, accessibility, privacy, and publish readiness.

Content-producing agents:

- Assessment Item Generator
- Stimulus Builder Agent
- Training and Course Scout
- AI Newsfeed Agent
- AI Concepts Scout

Governance and quality agents:

- Reviewer/QA Agent
- Psychometric Monitor
- Data Quality Monitor
- Framework Alignment Agent
- Localization QA Agent
- Report UX Agent
- Feedback Analysis Agent

The Orchestrator must prevent any content-producing agent from approving its own work.

Proposal promotion states:

```text
draft -> reviewed -> pilot-ready -> pilot-tested -> approved -> published -> monitored
```

Promotion requirements:

- `draft`: generated recommendation; not live.
- `reviewed`: basic answerability, safety, and relevance checked.
- `pilot-ready`: approved for limited pilot use with version tags.
- `pilot-tested`: enough telemetry exists to evaluate quality.
- `approved`: human reviewer accepts the change.
- `published`: versioned content is live.
- `monitored`: post-release telemetry is watched for regressions.

Agents must not:

- silently publish scored questions
- change rubrics without review
- change scoring parameters without review
- overwrite production artifacts without review
- change surveys/profile ontology without review
- expose secret API keys in browser code

## 17. Localization Requirements

The platform must support English and Thai.

Thai translation must:

- use simple Thailand Thai
- fit the UI context
- preserve common technical terms in English where users need market familiarity
- avoid awkward literal translations
- cover landing, onboarding, assessment, report, feedback, admin, scoring, and telemetry surfaces

Terms to preserve where appropriate:

- AI
- Workflow
- Prompt
- Model
- Agent
- API
- RAG
- LLM
- ROI
- KPI
- Domain
- Competency
- telemetry
- Platform
- Assessment

## 18. Authentication and Persistence

The authoritative B2C/B2B identity, workspace, organization, role, campaign, consent, seat, and user-lifecycle requirements are maintained in [B2C, B2B, and User Administration Specification](B2C_B2B_USER_ADMINISTRATION.md).

MVP:

- localStorage can support demo/pilot behavior.
- Supabase Auth/Postgres may be configured for user profiles and assessment sessions.

Production:

- server-side event tables are required.
- localStorage must not be the primary analytics store.
- Supabase RLS and admin role claims are required.
- identity data must be separated from response evidence.
- deletion/export/retention rules must be implemented.

Required production tables or equivalent:

- users/profiles
- personal workspaces
- organizations and memberships
- roles and permissions
- teams and invitations
- subscriptions, seats, and entitlements
- assessment campaigns and assignments
- result-sharing policies and consents
- assessment sessions
- question responses
- behavior events
- item feedback
- assessment feedback
- score logs
- profile signals
- artifact events
- leaderboard aggregates
- agent runs
- agent proposals
- review decisions
- content versions
- audit logs

The MVP must keep personal and organization workspaces distinct, enforce tenant boundaries with row-level security, and prevent organization access to personal assessment history without an explicit result-sharing policy and consent record.

## 19. Privacy, Consent, and Governance

The authoritative legal and product-control requirements are maintained in [Legal, Privacy, PDPA, and Terms Requirements](LEGAL_PRIVACY_PDPA_TERMS.md). The document covers Thailand PDPA, Privacy Notices, Terms of Use, cookies, acceptable use, assessment/AI disclaimers, B2B controller/processor roles, DPA requirements, rights, consent, retention, children, subprocessors, international transfers, and breach response. It is not a substitute for qualified Thai legal review.

The platform must:

- explain what telemetry is collected and why
- avoid hidden sensitive inference
- use anonymous leaderboard labels by default
- separate identity from assessment evidence
- support retention/deletion/export rules before production
- restrict admin analytics through role claims
- audit report access and exports
- keep content changes versioned and reviewable
- version and record acceptance of Terms, Privacy Notices, campaign notices, consent, and material policy changes
- maintain purpose/lawful-basis, cookie/technology, retention, subprocessor/transfer, and breach registers
- provide rights-request intake, identity verification, fulfillment, decision, and audit workflows
- technically block nonessential tracking before consent where consent is required
- show just-in-time notices for profile collection, telemetry, B2B campaigns, result sharing, leaderboards, Report Copilot, uploads, and free text

## 20. Framework and Credibility Requirements

The platform must maintain a framework crosswalk to reputable sources, including:

- UNESCO AI competency frameworks
- OECD/EC AI Literacy Framework
- NIST AI Risk Management Framework
- EU AI Act Article 4 AI literacy
- DigComp 2.2
- ISO/IEC 42001
- Singapore AI Verify / Model Governance Framework for GenAI
- AI literacy research
- Gartner AI maturity references
- McKinsey AI value-measurement references
- BCG Responsible AI maturity references

The platform must not claim certification equivalence unless a formal certification process exists.

## 21. Non-Functional Requirements

Performance:

- Landing page and assessment must feel fast on laptop and mobile browsers.
- Artifact expansion must not block answering.
- Admin analytics should remain usable with local pilot logs.

Accessibility:

- Buttons must have clear labels.
- Feedback controls must support keyboard and screen-reader states.
- Artifacts must have alt text.
- Expanded artifacts must fit the app window.
- Text must not overlap or overflow on mobile.

Security:

- No secret provider keys in browser code.
- Auth state must be handled safely.
- Admin production routes require server-side authorization.

Maintainability:

- Content, scoring, telemetry, and docs must stay aligned.
- Major changes must update README, latest changes, scoring docs, telemetry docs, and framework docs.
- Question/rubric/artifact/scoring versions must be stored with answer evidence.

## 22. Acceptance Criteria

The MVP is ready for proper pilot go-live when:

- Free and Premium flows complete without UI blockers.
- Explore More, onboarding, assessment, artifact reader, feedback, report, and Admin dashboard work in the target browser.
- Question feedback does not show stale notes between sessions.
- Profile survey influences starting difficulty.
- Assessment report explains question-level score calculation.
- Unsampled domains show `Not assessed`.
- Artifacts shown in scored items are relevant and legible.
- Admin dashboard shows the 10 assessment-quality analytics views.
- Pilot-review CSV export works.
- Leaderboards are anonymous and clearly labeled local/demo/pilot.
- Thai/English toggle works across major surfaces.
- Lint and build pass.
- GitHub repo documentation is current.
- Deployment notes include production analytics, auth, privacy, and agent-governance requirements.

## 23. Recommended Build Phases

### Phase 1: MVP Stabilization

- Fix remaining UI bugs.
- Audit all artifacts for relevance and legibility.
- Audit all questions for ambiguity and guessable options.
- Expand pre-test and lab samples enough to support report recommendations.
- Ensure telemetry is consistently logged.

### Phase 2: Pilot Data Collection

- Run controlled pilots across user profiles.
- Export pilot review CSV.
- Review item discrimination, distractors, artifact dependency, clarity, difficulty, reliability, and route fit.
- Rewrite or retire weak questions.
- Replace weak artifacts.

### Phase 3: Backend Productionization

- Move telemetry to server-side tables.
- Add Supabase RLS/admin role claims.
- Add aggregate analytics views.
- Add content versioning.
- Add audit logs and privacy workflows.

### Phase 4: Calibration and Scale

- Calibrate item parameters from pilot data.
- Tune score bands and confidence.
- Validate persona/domain routing.
- Add organization/cohort reporting.
- Expand learning content and bootcamp catalog.
- Move Agent Ops to durable server-side jobs with human approval.
