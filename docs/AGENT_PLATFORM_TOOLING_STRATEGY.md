# Agent Platform Tooling Strategy

## Decision

New Horizon should not use a single autonomous "swarm manager" as the platform control plane. The platform should separate durable workflow control, bounded agent reasoning, model routing, LLM evaluation, product telemetry, crawling, and infrastructure scaling.

The target production stack is:

| Responsibility | Preferred tool | Release stage |
| --- | --- | --- |
| System of record, tenancy, approvals, audit records | Supabase/PostgreSQL | MVP go-live |
| Lightweight scheduled and event jobs | Inngest or equivalent managed job runner | MVP go-live, only where needed |
| Durable long-running workflow control | Temporal Cloud | Production, when adoption triggers are met |
| Bounded multi-step agent reasoning | LangGraph inside workflow workers | Production, only for genuinely agentic tasks |
| Model gateway, routing, fallback, quotas, and cost attribution | LiteLLM Gateway | Late MVP or production, before multiple providers or material LLM spend |
| LLM traces, prompt versions, datasets, and evaluations | Langfuse | Late MVP or production, before agent-assisted decisions affect users |
| Product telemetry, funnels, surveys, feature flags, experiments | PostHog or an equivalent consent-aware analytics service | MVP go-live |
| High-volume analytical event store | ClickHouse | Production, after Postgres/analytics limits are demonstrated |
| Straightforward standards and market crawling | Firecrawl | MVP pilot or production, behind source allow-lists |
| Complex browser-based or large-scale crawling | Apify | Production, only when simpler crawling is insufficient |
| Worker autoscaling | Kubernetes and KEDA | Scale stage, after sustained queue volume justifies operations cost |
| Exploratory autonomous research workbench | Hermes, optional | Future experiment; never the system of record or control plane |
| Fast typed decision layer for bounded routing/classification | Jev or self-hosted Laya, optional | Pre-production evaluation in shadow mode; adopt only per validated use case |

## MVP Boundary

The MVP does **not** need Temporal, Kubernetes, KEDA, ClickHouse, Hermes, Jev, Laya, or a large multi-agent framework. It should implement the operating contracts that allow those tools to be introduced later without rewriting assessment logic:

- typed agent inputs and structured proposal outputs
- stable `run_id`, `workflow_id`, `agent_id`, `tenant_id`, `user_id`, `session_id`, and content-version identifiers
- server-side secrets and provider adapters
- idempotency keys for jobs and side effects
- persisted run, step, proposal, approval, cost, and audit records
- explicit retry, timeout, concurrency, and cancellation policies
- human approval before material assessment changes
- model, prompt, rubric, question, artifact, and scoring-version metadata
- token, latency, cost, and outcome attribution by agent, workflow, assessment, report, user, tenant, and period

For MVP go-live, use Supabase/PostgreSQL as the source of truth and a lightweight managed job runner only for work that must run asynchronously or on a schedule. Deterministic code should perform aggregation, validation, deduplication, thresholds, and routing before an LLM is invoked.

## Target Production Architecture

```text
User and system events
  -> consent-aware telemetry collection
  -> PostgreSQL operational records / analytics pipeline
  -> deterministic aggregation and anomaly detection
  -> durable workflow orchestrator
  -> bounded specialist workers
       -> model gateway
       -> crawler or approved tools
       -> LLM tracing and evaluation
  -> versioned proposal registry
  -> automated quality and safety gates
  -> human approval
  -> staged release and feature flag
  -> monitoring, comparison, and rollback
```

Temporal should ultimately own workflow state, retries, timers, schedules, cancellation, task routing, and human-approval waits. LangGraph may run inside a Temporal activity when a task needs iterative tool use, branching reasoning, or a reviewer loop. Agent frameworks must not own authoritative content state, publication state, tenant permissions, or audit history.

## Scale Without One Agent Per Event

Large question banks and user volumes do not imply one agent for every question, response, telemetry event, or crawled page. The platform should:

1. Persist raw events cheaply.
2. Aggregate events deterministically by item, competency, cohort, route, and time window.
3. Detect thresholds, changes, and anomalies with code or statistical jobs.
4. Deduplicate and batch related findings.
5. Invoke an agent only when interpretation or drafting is needed.
6. Sample routine traffic and prioritize high-impact findings.
7. Cache repeatable outputs and reuse approved source snapshots.
8. Enforce per-agent, per-tenant, and platform-wide concurrency and spend limits.

Example: 20,000 `question_viewed` events should produce an item-performance aggregate and perhaps one review workflow, not 20,000 agent runs.

## Worker and Queue Design

Keep specialist workloads isolated so permissions, models, budgets, concurrency, and scaling can differ:

- `telemetry-analysis`
- `question-quality`
- `translation-qa`
- `artifact-review`
- `psychometric-monitoring`
- `web-crawling`
- `report-generation`
- `assessment-calibration`
- `expensive-model-analysis`
- `human-approved-publishing`

Publishing workers must have stricter permissions than analysis workers. Content-producing agents cannot approve their own output.

## Hermes Position

Hermes may be evaluated as a sandboxed research worker for broad source discovery, experimental skill development, and internal research briefs. It must not directly change questions, scoring, rubrics, profile logic, surveys, reports, or production schedules. It must not hold authoritative cross-tenant memory or become the sole record of workflow state.

## Jev Position

Jev may be evaluated during pre-production as a fast typed decision layer for bounded choices, scores, and confidence-gated classifications. Candidate uses include feedback triage, agent completion gates, AI Watch sensitivity, translation escalation, and review prioritization. It does not generate content, replace orchestration or statistics, calculate scores, approve publication, or override deterministic permissions, legal, budget, regional, provider, or human-review controls.

The evaluation starts in shadow mode on labelled historical decisions and compares Jev with deterministic rules, Laya base/tuned checkpoints, and an inexpensive structured-output model. Adoption is approved one use case at a time after accuracy, calibration, high-risk false negatives, latency, cost, language performance, vendor terms, privacy, fallback, auditability, and kill-switch behavior pass. See [Jev Pre-production Evaluation](JEV_PREPRODUCTION_EVALUATION.md).

## Laya Position

Laya is the preferred open-weight candidate in the same shadow comparison. Its Apache-2.0 project supplies English, multilingual, and tuned typed-decision checkpoints that can be self-hosted. This may improve privacy, local/offline processing, customization, and cost at sustained volume, but transfers infrastructure, training, calibration, monitoring, and model-governance work to New Horizon.

Project-reported results show that its tuned checkpoint can be competitive, while its base English and multilingual checkpoints perform poorly on the project's typed-decisions benchmark. Evaluate both zero-shot and New-Horizon-tuned forms on an independent Thai/English holdout. Do not infer production confidence from vendor/project probability outputs. See [Laya Pre-production Evaluation](LAYA_PREPRODUCTION_EVALUATION.md).

## Adoption Triggers

Adopt tools because measured needs justify them, not merely because the product is labelled production.

### Move to Temporal when

- workflows regularly wait for human approval or external events
- jobs run for hours or days
- failures must resume from the last completed step
- multiple worker pools require reliable routing and throttling
- workflow versioning and complete execution history become operational requirements
- the existing job runner creates material retry, state, or audit complexity

### Add LiteLLM when

- more than one model/provider is active
- model failover or centralized routing is required
- spend limits must be enforced across users or tenants
- cost attribution is material to pricing or margin management

### Add Langfuse when

- agents or LLM-assisted scoring/reporting enter a pilot
- prompt/model comparisons need repeatable datasets
- release gates require regression evaluation
- admins need trace-level explanations of model cost, latency, tools, and outputs

### Add ClickHouse when

- telemetry volume or analytical concurrency makes PostgreSQL expensive or slow
- retention and cohort queries require a dedicated columnar event store
- aggregate tables no longer provide acceptable performance

### Add Kubernetes and KEDA when

- sustained queue backlogs require independent worker autoscaling
- managed/serverless workers cannot meet throughput, isolation, or cost requirements
- the team is ready to operate Kubernetes reliably

### Evaluate Jev and Laya when

- at least one high-volume decision has a closed, versioned option set
- deterministic rules are measurably insufficient but generative output is unnecessary
- 1,000-5,000 representative historical labels or equivalent reviewed fixtures are available
- the platform can run shadow decisions and capture confidence, outcome, latency, cost, language, fallback, and human-review evidence
- vendor security, privacy, regional, contractual, support and continuity requirements can be evaluated
- self-hosting cost, model operations, fine-tuning, calibration, and rollback can be measured for Laya

## Governance Rules

- Agents observe, analyze, test, and propose; humans approve material assessment changes.
- All agent outputs must include evidence, confidence, source/version references, cost, and recommended action.
- Production changes use versioned promotion states and staged rollout.
- Every run must be reproducible enough to investigate, including model, prompt, tool, source, and content versions.
- Sensitive identity and assessment evidence must follow tenant isolation, minimization, consent, retention, and deletion requirements.
- Autonomous optimization must have spending limits, iteration limits, stop conditions, and rollback paths.

## Related Documents

- [Agent Workflows and Orchestration](AGENT_WORKFLOWS_ORCHESTRATION.md)
- [Telemetry and Agent Orchestration](TELEMETRY_AND_AGENT_ORCHESTRATION.md)
- [Admin Settings and Configuration](ADMIN_SETTINGS_CONFIGURATION.md)
- [MVP Requirements Specification](MVP_REQUIREMENTS_SPECIFICATION.md)
- [Feature Catalog by User Type and Release Stage](FEATURE_CATALOG_BY_USER_AND_RELEASE.md)
- [Jev Pre-production Evaluation](JEV_PREPRODUCTION_EVALUATION.md)
- [Laya Pre-production Evaluation](LAYA_PREPRODUCTION_EVALUATION.md)
