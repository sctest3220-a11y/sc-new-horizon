# Agent Workflows and Orchestration

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

## Agent Roles

### Orchestrator Agent

Coordinates runs, source limits, budgets, retries, dedupe, workflow status, and admin review queues. Owns workflow state, not content truth.

### AI Concepts Scout

Identifies durable AI concepts, model-capability shifts, evaluation changes, governance updates, and ontology implications. Promotes durable concepts into reviewable drafts.

### AI Newsfeed Agent

Drafts short-lived AI Watch candidates from model releases, governance changes, safety incidents, security issues, business adoption, education trends, and workplace AI shifts. News expires unless promoted into durable concepts.

### Training and Course Scout

Finds courses, tutorials, certificates, tools, and practice resources. Drafts need review for recency, cost, bias, accessibility, commercial interest, and fit to observed user gaps.

### Assessment Item Generator

Drafts questions, answer keys, rubrics, partial-credit rules, difficulty estimates, competency mappings, and stimulus recommendations. It should prioritize practical formats such as artifact review, matching, multi-select, ranking, written response, and multi-part concept clusters.

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

### Future Psychometric Monitor

Once enough pilot data exists, reviews difficulty drift, discrimination, guessing, partial-credit thresholds, response time, fairness, cohort validity, and score stability.

### Future Stimulus Builder

Creates or refreshes realistic artifacts only after telemetry or survey evidence identifies a need. Human review confirms relevance, legibility, accessibility, and answerability before publishing.

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
- Durable job runner such as Trigger.dev, Inngest, Temporal, Cloudflare Queues/Cron, or Supabase scheduled jobs.
- Server-side AI provider adapters; no secret keys in browser code.
- Source allow-lists, freshness windows, retry limits, cost budgets, robots/terms review, and audit logs.
- Versioned content publishing so historical scores remain explainable.
