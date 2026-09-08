# Telemetry and Agent Orchestration

New Horizon uses telemetry to make the assessment more accurate, more usable, and easier to improve. The product should remain transparent: telemetry can inform personalization and content quality, but scored content, rubrics, profile fields, survey wording, and published learning/news recommendations require human review before release.

Focused companion documents:

- `docs/AGENT_WORKFLOWS_ORCHESTRATION.md`
- `docs/TELEMETRY_TRACKING_PURPOSE.md`

## Current Telemetry

The MVP stores telemetry locally in browser storage and syncs to Supabase only when authentication and tables are configured.

### Assessment Session Events

Stored in `new-horizon-behavior-log-v1`.

Captured events:

- `assessment_started`: mode, audience, function, industry, executive role, target question count.
- `question_shown`: question id, domain, competency ids, difficulty, interaction type, answered count, target count.
- `question_answered`: selected answer, expected answer ids, readiness score, domain, competency ids, difficulty, interaction type, elapsed time, interaction count, revision count, hesitation classification.
- `assessment_abandoned`: active question, answered count, target count, profile context.
- `mandatory_completed`: completion of the required 12-question or 20-question milestone.
- `continuation_accepted`: chosen continuation route, route kind, target count, reason label.
- `continuation_declined`: user chose to view the report instead of continuing.
- `results_viewed`: final score and answered count when the report is opened.
- `report_interest`: report clicks for radar, domain, competency, course, tool, coverage, continuation, and "Did you know?" topics.
- `assessment_feedback_submitted`: feedback exchange completed.
- `artifact_opened`: full-size artifact reader opened for a question.
- `artifact_zoomed`: artifact reader zoom changed to 1x, 1.5x, or 2x.
- `artifact_external_opened`: user opened the raw artifact file in a new tab.

### Answer and Evidence Snapshots

Stored in `new-horizon-profile-signal-log-v1` after completed runs.

Captured per answered question:

- question id
- primary and secondary domains
- competency ids
- skill ids
- difficulty
- item type and interaction type
- evidence mode: knowing, doing, or hybrid
- selected option and answer label
- correct option ids or rubric hits
- partial part scores for multi-part items
- text response length
- elapsed time
- interaction count
- revision count
- hesitation classification

### Score Logs

Stored in `new-horizon-score-log-v1`.

Captured for leaderboards and cohort comparison:

- overall score
- D1-D6 domain scores
- competency scores and evidence counts
- evidence-mode scores
- persona/group key and label
- mode, audience, function, industry, and executive role
- user id/email when signed in

### Feedback Surveys

Stored in `new-horizon-assessment-feedback-v1`.

Captured:

- question clarity: clear, mixed, confusing
- difficulty fit: too easy, right, too hard
- artifact quality: realistic, mixed, poor
- assessment length: short, right, long
- free-text suggestions

### Profile Signals

Stored in `new-horizon-user-profile-v1` and enriched by completed runs.

Captured:

- explicit survey answers
- optional landing-page profile pulse selections
- role/function/industry/audience selections
- tags such as tools, workflows, AI interests, risk concerns, and learning goals
- behavior-derived signals from routes, answers, report clicks, continuation decisions, and artifact-reader use

## What Telemetry Is For

Telemetry supports five product loops.

### 1. Scoring and Confidence

The assessment separates raw correctness from readiness evidence. Easier items are capped below advanced readiness, while proficient and advanced items can produce stronger readiness evidence.

Telemetry helps estimate:

- whether a score is based on enough evidence
- which competencies have low, medium, or high confidence
- whether the user should continue beyond the required route
- whether the result is a snapshot or a stronger profile

### 2. Evidence Completion

The 12-question and 20-question routes are milestones, not hard endpoints. After a normal route is complete, the user can continue in targeted batches until planned and profile-priority competencies reach high-confidence evidence or a safety cap is reached.

Evidence completion uses:

- unsampled planned competencies
- unsampled profile-priority competencies
- sampled competencies below high confidence
- low-scoring competencies
- selected domain deep dives
- user profile tags and route context

### 3. Artifact Quality and Accessibility

Dense screenshots, workflow diagrams, dashboards, and documents can be hard to read. The artifact reader gives users full-size viewing, zoom controls, and raw-file access.

Artifact telemetry helps identify:

- artifacts users frequently open full-size
- artifacts users zoom to 2x
- artifacts associated with long answer times
- artifacts associated with incorrect answers despite easy or applied difficulty
- artifacts named in feedback as unrealistic or unclear

### 4. Personalization

Profile signals and behavior help tailor:

- next questions
- continuation routes
- competency priorities
- "Did you know?" prompts
- AI Watch topics
- practice labs
- course and tool recommendations
- peer leaderboard grouping

Personalization should be explainable to users. The product should avoid hidden sensitive inference and keep profile collection visible, useful, and consent-aware.

### 5. Assessment Quality Improvement

Telemetry can nominate improvement candidates:

- confusing question wording
- weak distractors
- overly easy advanced items
- unrealistic or illegible artifacts
- bad competency mapping
- missing profile fields
- intrusive or low-value survey questions
- low continuation conversion
- high abandonment points
- report sections nobody engages with

## Agent Orchestration

Agent Ops is supervised. Agents analyze telemetry, survey feedback, trend signals, source material, and item-bank coverage, then propose improvements. They do not silently publish changes.

## Current MVP Agent Loop

The MVP includes a local deterministic Agent Ops flow:

1. Admin clicks `Run supervised jobs`.
2. Orchestrator reads local telemetry, feedback, profile snapshots, item counts, and artifact counts.
3. Specialist agents create draft proposals.
4. Reviewer/QA checks novelty, evidence, relevance, and safety.
5. Drafts enter pending review.
6. Admin approves or rejects each draft.
7. Approved drafts remain review decisions; scored content is not automatically mutated.

Stored in `new-horizon-supervised-agent-runs-v1`.

Draft proposal types:

- `question`: rewrite, split, or add assessment items.
- `artifact`: replace or improve a stimulus.
- `profile`: update profile ontology or routing tags.
- `survey`: change survey wording, timing, or unlock value exchange.
- `feedback`: summarize survey and behavior themes before recommending platform edits.
- `learning`: refresh learning recommendations.
- `news`: draft AI Watch briefs.

## Agent Roles

### Orchestrator Agent

Coordinates runs, budgets, source limits, dedupe, state transitions, and admin review queues. Owns workflow state, not truth.

### AI Concepts Scout

Finds durable concepts, capability shifts, model-evaluation changes, policy changes, and ontology updates. Promotes durable items into reviewable concept drafts.

### AI Newsfeed Agent

Creates short-lived AI Watch candidates from current news, model releases, governance changes, security incidents, and workplace AI trends. News decays unless promoted into durable concepts.

### Training and Course Scout

Finds courses, tutorials, tools, certificates, and practice resources. Recommendations require review for recency, cost, bias, accessibility, and fit to observed gaps.

### Assessment Item Generator

Drafts new questions, answer keys, rubrics, partial-credit logic, difficulty estimates, competency mappings, and stimulus recommendations. It should prioritize artifact review, matching, multi-select, drag-order, written response, and concept clusters.

### Feedback Analysis Agent

Analyzes assessment survey ratings, free-text suggestions, abandonment, continuation choices, hesitation signals, long answer times, and artifact zoom/open behavior. It groups feedback into themes, estimates evidence strength, identifies affected users or personas, and recommends whether admins should monitor, rewrite, replace an artifact, recalibrate difficulty, adjust profile collection, or revise survey wording.

This agent should produce suggestions before edits. It should not change scored content, survey questions, artifacts, profile fields, or scoring by itself.

### Reviewer and QA Agent

Checks source support, duplicates, item answerability, distractor quality, artifact realism, accessibility, privacy/risk issues, format balance, and publish readiness.

### Future Psychometric Monitor

Should review item difficulty drift, discrimination, guessing, partial-credit thresholds, response time, fairness, and cohort validity once enough pilot data exists.

### Future Stimulus Builder

Should create or refresh realistic artifacts, but only after telemetry or survey evidence identifies a need. Human review should confirm relevance, readability, and answerability.

## Human Review Gates

Human approval is required before:

- changing scored questions
- changing answer keys or rubrics
- changing scoring parameters
- changing domain, competency, skill, or profile ontology
- publishing AI Watch items
- adding/removing learning recommendations
- replacing official artifact paths
- changing survey questions or unlock conditions
- enabling new sources or external integrations
- changing production schedules above approved cost/frequency limits

## Production Architecture

Local browser storage should move to durable server-side tables before production use.

Recommended production tables:

- `user_profiles`
- `assessment_sessions`
- `assessment_item_responses`
- `assessment_behavior_events`
- `assessment_feedback`
- `assessment_artifact_events`
- `score_leaderboard_entries`
- `profile_signal_snapshots`
- `agent_runs`
- `agent_steps`
- `agent_draft_proposals`
- `agent_review_decisions`
- `feedback_theme_summaries`
- `content_versions`
- `source_records`
- `audit_events`

Recommended production infrastructure:

- Supabase Auth with admin role claims.
- RLS-protected analytics tables and views.
- Durable job runner such as Trigger.dev, Inngest, Temporal, Cloudflare Queues/Cron, or Supabase scheduled jobs.
- Server-side AI provider adapters; never expose secret keys in browser code.
- Source allow-lists, robots/terms review, freshness windows, retry limits, and cost budgets.
- Versioned content publishing so historical scores remain explainable.

## Privacy and Product Principles

- Tell users why profile and behavior signals are collected.
- Use telemetry to improve the assessment and personalize learning, not to make hidden sensitive inferences.
- Separate identity data from assessment evidence where possible.
- Use aggregate, privacy-safe leaderboard display names.
- Let users unlock detailed question-level analysis through a clear feedback exchange.
- Keep agent suggestions explainable and reviewable.
- Preserve historical score meaning when items, rubrics, or scoring models change.
