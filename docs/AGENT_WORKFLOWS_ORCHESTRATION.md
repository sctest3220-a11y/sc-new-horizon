# Agent Workflows and Orchestration

## Admin workflow visualization

The MVP Admin Agent Ops view includes an interactive node-based workflow map. It visualizes the Orchestrator, concept/news/course scouts, Feedback Analysis Agent, Assessment Item Generator, Reviewer and QA Agent, and the final human approval gate. Connector and node states use the existing run record statuses: `idle`, `running`, `review`, `blocked`, and `complete`.

Selecting an agent shows its purpose, cadence, guardrail, latest activity stages, and outputs. Animated connector movement indicates active or review-stage routing; blocked paths remain visible rather than disappearing. The interface respects the operating system's reduced-motion preference. In the MVP, the map represents local deterministic or supervised run records and must not be presented as a live cloud-worker trace. Production should feed the same view from durable orchestration events, retries, costs, approvals, and failure records.

New Horizon uses a supervised agent model for assessment quality, AI Watch freshness, learning-resource review, artifact improvement, and profile/ontology refinement. Agents may analyze, draft, dedupe, and recommend. They do not silently publish scored content or change production scoring.

## Operating Principle

Agent work should remain reviewable. The platform can use telemetry and survey feedback to identify improvement opportunities, but a human reviewer approves changes to scored questions, answer keys, rubrics, scoring parameters, competency mappings, profile fields, survey questions, learning recommendations, AI Watch items, and official artifact paths.

## Current MVP Flow

The current MVP flow is local and deterministic. It demonstrates the operating model without external crawlers or server-side AI calls.

```text
Admin clicks Run supervised jobs
  -> Orchestrator reads local telemetry, feedback, profile snapshots, item counts, and artifact counts
  -> Specialist agents create draft proposals
  -> Reviewer/QA checks novelty, evidence, relevance, accessibility, and safety
  -> Drafts enter the pending review queue
  -> Admin approves or rejects each draft
  -> Approved drafts remain review decisions; scored content is not automatically changed
```

Stored state:

- `new-horizon-supervised-agent-runs-v1`: local run history, draft proposals, reviewer notes, and approval/rejection states.

## MVP Go-Live Agent Roles

### Orchestrator Agent

Coordinates runs, source limits, budgets, retries, dedupe, workflow status, and admin review queues. Owns workflow state, not content truth.

### Assessment Blueprint Agent

Owns coverage design before item generation. It reviews the 22 competencies, D1-D6 domain targets, four difficulty levels, role/function/industry mappings, profile-weighted routing rules, and evidence minimums. Its output is a gap map showing which competencies, personas, industries, and difficulty levels need more or better items.

### AI Concepts Scout

Identifies durable AI concepts, model-capability shifts, evaluation changes, governance updates, and ontology implications. Promotes durable concepts into reviewable drafts.

### AI Newsfeed Agent

Drafts short-lived AI Watch candidates from model releases, governance changes, safety incidents, security issues, business adoption, education trends, and workplace AI shifts. News expires unless promoted into durable concepts.

### Training and Course Scout

Finds courses, tutorials, certificates, tools, and practice resources. Drafts need review for recency, cost, bias, accessibility, commercial interest, and fit to observed user gaps.

### Assessment Item Generator

Drafts questions, answer keys, rubrics, partial-credit rules, difficulty estimates, competency mappings, and stimulus requirements from the Assessment Blueprint. It should prioritize practical formats such as artifact review, matching, multi-select, ranking, written response, and multi-part concept clusters.

### Stimulus Builder Agent

Creates or refreshes realistic artifacts after telemetry, feedback, or blueprint evidence identifies a need. It produces artifact briefs, candidate asset requirements, realism checks, legibility checks, accessibility notes, and answer-key evidence mapping under the [Artifact Design and QA Standard](ARTIFACT_DESIGN_AND_QA_STANDARD.md). Human review confirms relevance, legibility, accessibility, and answerability before publishing or replacing official artifact paths.

### Feedback Analysis Agent

Analyzes assessment surveys, free-text suggestions, abandonment, continuation choices, hesitation signals, long answer times, artifact zoom/open behavior, and confusing-item patterns before recommending any platform edit.

Outputs:

- feedback theme summary
- affected user/persona groups
- affected domains, competencies, difficulties, and item formats
- evidence strength and sample size
- suggested action: monitor, rewrite, replace artifact, recalibrate difficulty, adjust profile question, or revise survey wording
- human-review note explaining why the action should or should not proceed

This agent should produce suggestions, not changes. It should help admins decide what to improve first and prevent single anecdotal comments from becoming premature platform edits.

### Reviewer and QA Agent

Checks source support, duplicates, answerability, distractor quality, artifact realism, artifact readability, accessibility, privacy/risk issues, item-format balance, and readiness for human review.

### Psychometric Monitor

Reviews difficulty drift, discrimination, guessing, partial-credit thresholds, response time, fairness, cohort validity, and score stability. During MVP, it labels low-volume findings as `insufficient data` and uses pilot signals to recommend monitoring, recalibration, or human item review.

### Data Quality Monitor

Checks whether telemetry is complete enough for analysis. It flags missing events, duplicate sessions, local-only data, missing question/rubric/artifact versions, incomplete score logs, stale feedback state, broken exports, and analytics views with insufficient sample size.

### Localization QA Agent

Reviews English and Thai surfaces for untranslated strings, awkward literal translation, context mismatch, preserved technical terms, layout overflow, and wording that may confuse Thai users. It should test landing, onboarding, assessment, report, feedback, Admin, telemetry, and scoring surfaces.

### Report UX Agent

Analyzes report-interest clicks, continuation behavior, survey feedback, and learning-resource engagement. It recommends changes to report ordering, wording, score explanations, course/bootcamp placement, and `Did you know?` prompts so users see the most useful next action first.

### Framework Alignment Agent

Checks whether domains, competencies, question types, scoring explanations, telemetry usage, and learning recommendations remain aligned with New Horizon's external framework crosswalk. It should reference UNESCO, OECD/EC, NIST AI RMF, EU AI Act Article 4, DigComp, ISO/IEC 42001, AI Verify, Gartner, McKinsey, and BCG where applicable, without claiming certification equivalence.

## Content and Governance Separation

Content-producing agents:

- Assessment Item Generator
- Stimulus Builder Agent
- Training and Course Scout
- AI Newsfeed Agent
- AI Concepts Scout

Governance and quality agents:

- Reviewer and QA Agent
- Psychometric Monitor
- Data Quality Monitor
- Framework Alignment Agent
- Localization QA Agent
- Report UX Agent
- Feedback Analysis Agent

The Orchestrator coordinates both groups and prevents a content-producing agent from approving its own work.

## Proposal Promotion Gates

Agent proposals must move through explicit states:

```text
draft -> reviewed -> pilot-ready -> pilot-tested -> approved -> published -> monitored
```

State rules:

- `draft`: generated recommendation; not used in scored assessment.
- `reviewed`: human or Reviewer/QA agent has checked basic answerability, safety, and relevance.
- `pilot-ready`: approved for limited pilot exposure with version tags.
- `pilot-tested`: enough telemetry exists to review performance.
- `approved`: human reviewer accepts the item/artifact/rubric/scoring/profile/survey/learning change.
- `published`: versioned content is live.
- `monitored`: post-release telemetry is watched for regressions.

## Human Review Gates

Human approval is required before:

- changing scored questions
- changing answer keys or rubrics
- changing scoring parameters
- changing domain, competency, skill, or profile ontology
- publishing AI Watch content
- adding or removing learning recommendations
- replacing official artifact paths
- changing survey questions or unlock conditions
- enabling new external sources or integrations
- changing production schedules above approved cost or frequency limits

## Production Direction

Production orchestration should move from local browser storage to durable server-side jobs and tables:

- `agent_runs`
- `agent_steps`
- `agent_draft_proposals`
- `agent_review_decisions`
- `feedback_theme_summaries`
- `content_versions`
- `source_records`
- `audit_events`

Recommended runtime pieces:

- Supabase Auth with admin role claims.
- RLS-protected admin and analytics views.
- MVP go-live: a lightweight managed job runner such as Inngest where asynchronous or scheduled work is required.
- Target production control plane: Temporal Cloud for durable, long-running, approval-gated workflows once the documented adoption triggers are met.
- Bounded LangGraph workers only for tasks that need iterative tools, branching reasoning, or reviewer loops; deterministic jobs remain ordinary code.
- LiteLLM for model routing, fallback, quotas, and cost attribution when multiple providers or material LLM spend are introduced.
- Langfuse for LLM traces, prompt/model versions, datasets, and release evaluations before agent-assisted decisions affect users.
- PostHog for consent-aware product telemetry, funnels, surveys, feature flags, and experiments.
- ClickHouse and Kubernetes/KEDA are scale-stage components, not MVP requirements.
- Hermes remains an optional sandboxed research workbench, not the production orchestrator or system of record.
- Server-side AI provider adapters; no secret keys in browser code.
- Source allow-lists, freshness windows, retry limits, cost budgets, robots/terms review, and audit logs.
- Versioned content publishing so historical scores remain explainable.

See [Agent Platform Tooling Strategy](AGENT_PLATFORM_TOOLING_STRATEGY.md) for the phased decision, component boundaries, and adoption triggers.
