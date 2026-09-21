# Admin Settings and Configuration Specification

## Purpose

New Horizon should use a versioned configuration system rather than hardcoded switches spread across the application. Authorized admins must be able to control assessment availability, profiles, question counts, report entitlements, telemetry, agent schedules, LLM routing, budgets, and cost analytics without changing source code.

This document is the authoritative product and implementation specification for Admin Settings. Scoring-critical, privacy-sensitive, and published-content changes remain subject to validation, audit, and human approval.

## Configuration Principles

- Separate subscription plans, assessment templates, and user profiles.
- Store secrets only on the server in an encrypted secret store.
- Version every configuration used to deliver or score an assessment.
- Preserve the configuration, question, rubric, prompt, model, and pricing versions with historical results.
- Require preview and validation before publication.
- Support scheduled activation and rollback.
- Warn when disabling a setting will reduce analytics, personalization, or assessment quality.
- Prevent content-producing agents from approving their own work.
- Do not silently change a scoring model or grading LLM in a way that breaks score comparability.

## Core Concepts

### Plans and Entitlements

Plans define what a user may access. Initial configurable plans are Free, Freemium, and Premium. Plans must not be hardcoded into individual report components.

### Assessment Templates

Assessment templates define how a test operates. Examples include general baseline, role diagnostic, executive diagnostic, industry diagnostic, practice, and reassessment.

### Profiles

Profiles define routing and target expectations. Examples include general, student, educator, content creator, marketing, finance, HR, technical, executive, role, and industry profiles.

Plans, assessment templates, and profiles must be independently configurable and connected through explicit entitlement and routing rules.

## Admin Information Architecture

Admin Settings should contain these areas:

1. Overview
2. Assessment Settings
3. Profiles and Routing
4. Reports and Dashboards
5. Telemetry and Trackers
6. Agent Control Center
7. AI Providers and Models
8. API Usage and Cost Analytics
9. Feature Flags and Experiments
10. Configuration Versions and Audit Log

## Overview

The overview should show:

- active configuration version
- unpublished changes
- scheduled configuration changes
- enabled and paused assessments
- agent and tracker health
- current API spend and budget status
- failed jobs and provider outages
- recent admin actions
- production warnings
- emergency controls

Emergency controls should include pause all scheduled agents, disable optional external AI calls, pause an assessment template, and roll back the latest configuration.

## Assessment Settings

Admins must be able to enable, pause, schedule, archive, and configure each assessment template.

Configurable properties:

- display name and localized description
- eligible plans and profiles
- mandatory question count
- optional continuation batch size
- minimum and maximum question count
- maximum duration
- starting difficulty
- eligible difficulty levels
- eligible domains and competencies
- profile-specific domain and competency weights
- minimum evidence per competency
- confidence and adaptive stopping thresholds
- safety cap
- answer reveal behavior
- adaptive-information visibility during testing
- pause/resume behavior
- survey and feedback prompts
- leaderboard eligibility

Recommended initial defaults:

| Assessment template | Mandatory | Continue batch | Maximum | Stop rule |
| --- | ---: | ---: | ---: | --- |
| General baseline | 12 | 4 | 32 | Priority competencies sufficiently covered |
| Role diagnostic | 20 | 5 | 45 | Role targets reach the required evidence confidence |
| Executive diagnostic | 16 | 4 | 36 | Governance and strategy evidence complete |
| Reassessment | 8 | 4 | 20 | Previously weak competencies retested |

Validation must reject impossible combinations, such as a mandatory count above the maximum, an enabled assessment with no eligible questions, or a stopping threshold that cannot be reached with the configured cap.

## Profiles and Routing

Admins must be able to:

- create, edit, duplicate, enable, pause, retire, or schedule a profile
- control plan and assessment eligibility
- configure onboarding questions and optional profile pulses
- map profiles to roles, functions, industries, domains, competencies, and learning content
- set initial difficulty from self-reported experience
- set profile-specific domain weights and radar targets
- configure required and optional evidence targets
- preview the route for a synthetic user
- archive a profile without changing historical results

Profile lifecycle states should be `draft`, `pilot`, `active`, `paused`, and `retired`.

## Reports and Dashboard Builder

Report configuration must use components and entitlements rather than separate hardcoded pages. Each component must support:

- `hidden`, `summary`, or `detailed` visibility
- display order
- localized title and explanation
- Free, Freemium, and Premium eligibility
- assessment/profile eligibility
- minimum evidence required before display
- available-during-test, answer-reveal, final-report, or dashboard placement
- locked or upgrade-preview presentation

Initial configurable components:

| Component | Free | Freemium | Premium | During test |
| --- | --- | --- | --- | --- |
| Overall score | On | On | On | Off |
| Domain scores | Summary | Full | Full | Optional |
| Competency scores | Off | Strengths/gaps | Full | Off |
| Answer review | Sample | Full | Full with evidence | Configurable |
| Score explanation | Basic | Detailed | Detailed | After reveal |
| Evidence confidence | Summary | Full | Full | Optional |
| Peer benchmark | Limited | Cohort | Role/industry cohort | Off |
| Learning path | Basic | Personalized | Detailed | Off |
| User-facing telemetry | Off | Summary | Detailed | Off |
| Adaptive-test explanation | Simple | Detailed | Detailed | Optional |

Raw telemetry must not be exposed as unexplained event data. User-facing reports should translate it into understandable observations and state why the information matters.

## Premium Report Copilot

New Horizon should offer a bounded, report-aware chatbot for Premium users. Its purpose is to explain assessment evidence, confidence, learning paths, analysis, and recommendations. It is not a general-purpose chatbot and must not alter scores, rubrics, answer keys, or assessment records.

Basic score transparency remains available to every user through the static report. Premium access adds conversational interpretation, deeper evidence review, personalized planning, and follow-up support.

Recommended entitlement model:

| Capability | Free | Freemium | Premium |
| --- | --- | --- | --- |
| Static score explanation | Full basic explanation | Detailed | Detailed |
| Suggested report questions | Limited | On | On |
| General assessment FAQ | Limited | On | On |
| Personalized report chat | Off | Limited messages | Full within configured limits |
| Answer-by-answer explanation | Sample | Limited | Full |
| Personalized learning plan | Off | Basic | Detailed |
| Follow-up assessment plan | Off | Basic | Detailed |
| Downloadable action plan | Off | Optional | On |

The report should expose an `Ask about your results` action and suggested questions such as:

- Why did I receive this score?
- Which answers most affected my result?
- What does my evidence confidence mean?
- Why is a domain marked `Not assessed`?
- Why should I continue the assessment?
- What are my strongest and weakest competencies?
- Why was this course, lab, or bootcamp recommended?
- What should I practise first for my role?
- How can I progress to the next readiness belt?
- Build a four-week learning plan from my priority gaps.

Responses should cite and link to relevant report evidence, question review, competency, learning resource, or continuation route. Every answer should distinguish:

- measured result
- system interpretation
- suggested next step

### Copilot Grounding

The copilot must use structured, versioned assessment data:

- assessment and scoring version
- questions presented
- user responses and awarded evidence
- expected answers, rubrics, and partial-credit reasons
- difficulty-adjusted readiness evidence
- domain and competency results
- coverage and confidence status
- profile and assessment context
- recommendation reasons
- approved learning catalog
- privacy-safe peer aggregates the user is entitled to view

It must not invent scores, evidence, courses, peer comparisons, or assessed competencies. It must not describe an unassessed competency as weak, expose another user's data, provide hidden chain-of-thought, overstate confidence, or make employment or other high-impact decisions from the result.

### Copilot Admin Controls

Admins should configure:

- enabled plans, assessment templates, profiles, and languages
- message allowance per user, report, day, and month
- suggested-question library
- model route and fallback
- prompt and policy version
- context and response limits
- enabled explanation and planning capabilities
- report sections the copilot may reference
- conversation retention and deletion period
- diagnostic-content capture policy
- per-message, conversation, user, and assessment budget
- rate limits, outage behavior, and emergency disable

Prompt caching and precomputed answers should be used for common score and confidence explanations. A grading model must not be invoked merely to explain an already-scored response unless the workflow explicitly requires and records a new reviewed interpretation.

### Copilot Telemetry and Cost

Track:

- conversation and message identifiers
- report, assessment session, and pseudonymous user identifiers
- suggested question selected or user-authored question category
- response viewed and follow-up asked
- linked report section opened
- learning recommendation, course, lab, bootcamp, or continuation action selected
- helpful/unhelpful feedback
- provider, model, prompt version, tokens, latency, retries, errors, fallback, and cost
- whether the interaction led to a learning or reassessment action

Admin cost analytics must include total and average cost per copilot user, conversation, message, report, resolved question, and resulting learning action. Private conversation content must not be used to change scored questions or scoring automatically. Feedback Analysis may summarize privacy-safe themes, but a human must approve platform changes.

## Telemetry and Tracker Settings

Trackers should be grouped by purpose:

- essential assessment records
- question-quality analytics
- adaptive-routing signals
- artifact interactions
- profile and personalization signals
- report engagement
- feedback and survey events
- leaderboard eligibility
- product analytics
- experiments

Each tracker definition must include:

- enabled/disabled state
- purpose and data collected
- applicable plans, profiles, and assessment templates
- consent requirement
- retention period
- sampling percentage
- identifiable, pseudonymous, or aggregate classification
- user-facing disclosure
- dependent reports, analytics, and agents

The UI must show dependency warnings before a tracker is disabled. Essential consent, assessment-completion, score-version, security, and audit records must not be casually disabled.

## Agent Control Center

Admins must be able to turn each agent on or off, run it manually, or assign a schedule. Every agent configuration should include:

- status and owner
- manual-run control
- schedule, timezone, and effective dates
- trigger conditions
- data sources and allowed scope
- assessment/profile/tenant filters
- lookback period and minimum sample size
- provider and model route
- cost and token budget
- maximum runtime and retry limit
- deduplication window
- output type and destination queue
- reviewer assignment
- approval and publication permissions
- last run, next run, health, and run history

Schedule presets should include hourly, daily, weekly, and monthly. Advanced cron syntax may be available behind an advanced control.

Agent permission levels:

1. Analyze only
2. Create recommendations
3. Create drafts
4. Submit for approval
5. Publish

Scored questions, answer keys, rubrics, scoring parameters, artifacts, profiles, surveys, framework mappings, and learning recommendations require human approval before publication.

## AI Providers and LLM Settings

Admins must be able to change providers and models without editing application code.

Provider configuration should support:

- OpenAI, Anthropic, Google, Azure OpenAI, AWS Bedrock, local models, and custom OpenAI-compatible endpoints
- enabled/disabled state
- API base URL and organization/project identifiers
- server-side secret reference
- connection status and last successful test
- synchronized or manually registered models
- model capabilities such as text, vision, tools, structured output, embeddings, and image generation
- data-residency and retention notes
- requests-per-minute and provider spending limits

API keys must be encrypted server-side and never returned to the browser, written to logs, stored in localStorage, or committed to Git. Admin screens may show only masked secret identifiers.

### Model Routing

Each workload must have an independently configurable primary model and optional approved fallback:

- adaptive assessment support
- written-answer grading
- answer explanation
- assessment report generation
- learning recommendations
- feedback analysis
- question drafting
- translation and localization QA
- AI Watch
- artifact/image generation
- agent workloads

Each routing rule should include provider, model, prompt/template version, temperature, reasoning level, token limits, timeout, retries, fallback, data-sensitivity allowance, plan/profile scope, rollout percentage, effective dates, and human-review requirement.

Grading-model fallback must never occur silently when it could change score comparability.

### Model Evaluation and Activation

Before activation, Admin should support:

- connection and sample-request tests
- structured-output validation
- English and Thai quality checks
- latency and cost estimates
- fixed benchmark evaluation
- comparison against the active model
- approval, scheduled activation, and rollback

A successful API connection alone is not sufficient for production activation.

## API Usage Ledger

Every external AI request must create an append-only usage event containing:

- request ID and timestamp
- pseudonymous user/profile ID
- organization/tenant ID
- assessment session and assessment template ID
- question, report, or agent-run ID when applicable
- plan, profile, role, and industry tags
- workload
- provider, model, and configuration version
- prompt/template and rubric versions
- input, cached-input, reasoning, and output tokens
- image, audio, or other billable units
- latency and retry count
- success, error, and fallback state
- estimated cost and currency
- reconciled provider-billing cost when available

Full prompts and responses should not be stored by default. Prefer hashes, classifications, token counts, and explicit opt-in diagnostic capture where operationally justified.

## Cost Attribution and Average Costs

All related calls must be grouped under their business object. A generated report may include summarization, recommendations, and translation; those calls share one `report_id`. An assessment should include adaptive support, grading, explanations, profile processing, report generation, recommendations, retries, and fallbacks associated with its session.

Required average-cost metrics:

- average LLM cost per active user
- average LLM cost per registered user
- average cost per assessment started
- average cost per assessment completed
- average cost per assessment question
- average cost per report generated
- average cost per report viewed
- average cost per written-answer evaluation
- average cost per recommendation generated or clicked
- average cost per translation
- average cost per agent run
- average cost per accepted agent proposal
- average artifact/image-generation cost
- average cost by plan, assessment, profile, role, industry, organization, provider, model, and period

The denominator must always be visible. Examples:

```text
Average cost per completed assessment
= assessment-related LLM cost / completed assessments

Average cost per generated report
= report-related LLM cost / successfully generated reports

Average cost per active user
= total LLM cost / distinct users who triggered at least one LLM request
```

Abandoned assessments, failed requests, retries, and fallback calls still consume money and must remain in total cost analysis. Starts and completions must be shown separately.

## Cost Dashboard

### Executive Summary

- total estimated and reconciled cost
- average cost per active user
- average cost per completed assessment
- average cost per report
- monthly forecast
- budget consumed and remaining

### Workload Breakdown

- assessment delivery
- grading
- reports
- recommendations
- agents
- translation
- artifact generation
- AI Watch

### Model Comparison

- cost and cost per successful output
- latency
- quality/evaluation score
- failure, retry, and fallback rates
- cache savings

### User and Cohort Analysis

- plan
- assessment template
- profile, role, and industry
- organization/tenant
- pseudonymous user distribution
- high-cost outliers

Named-user drill-down must be permission-restricted and used only for legitimate support, audit, or abuse investigation.

## Unit Economics

Admin should calculate:

- AI cost as a percentage of subscription revenue
- gross margin by plan
- cost per completed assessment
- cost per confidently assessed competency
- cost per report viewed
- cost per recommendation engaged with
- cost of abandoned sessions
- cost of errors and retries
- cache and routing savings
- forecasted monthly cost

The dashboard must distinguish estimated cost, reconciled provider cost, successful-output cost, user-facing product cost, and operational agent/content cost.

Provider prices change over time. Cost calculations must use effective-dated rate records rather than a hardcoded current price.

## Budgets and Guardrails

Budgets should be configurable by platform, organization, provider, model, agent, workload, assessment type, user, day, and month.

Recommended threshold behavior:

- 70 percent: notify
- 90 percent: restrict approved optional workloads
- 100 percent: use an approved lower-cost fallback or stop nonessential requests

Additional controls:

- maximum cost per assessment
- maximum cost per generated report
- maximum requests per user per day
- duplicate-request protection and idempotency keys
- prompt caching
- runaway-agent circuit breaker
- unexpected-cost and usage-spike alerts
- provider-outage routing
- manual external-AI shutdown

Admins should be able to create alerts such as: notify when the seven-day average report cost increases by more than 20 percent or completed-assessment cost exceeds a configured limit.

## Feature Flags and Experiments

Admin should support percentage rollout, plan/profile targeting, date ranges, A/B variants, success metrics, guardrail metrics, exclusions, preview accounts, and automatic rollback thresholds.

Experiments may be used for report layout, answer reveal, artifact presentation, profile surveys, or explanation formats. Scoring changes require stronger governance and must not mix incomparable results without explicit version labels.

## Configuration Lifecycle and Safety

All configuration changes should follow:

```text
draft -> validate -> preview -> approve -> schedule/publish -> monitor -> roll back or supersede
```

The system must provide:

- immutable configuration versions
- before/after diffs
- change reason and ticket/reference
- author and approver
- synthetic-user preview
- impact and dependency warnings
- scheduled activation
- rollback
- two-person approval for scoring, privacy, secrets, and production agent permissions
- audit history and export

## Recommended Data Model

Use normalized entities rather than one large settings JSON object:

- `plans`
- `assessment_templates`
- `assessment_template_versions`
- `profile_definitions`
- `profile_routing_rules`
- `report_components`
- `report_entitlements`
- `tracker_definitions`
- `tracker_policies`
- `agent_definitions`
- `agent_schedules`
- `agent_runs`
- `ai_providers`
- `ai_provider_secrets`
- `ai_models`
- `model_routing_rules`
- `model_configuration_versions`
- `llm_usage_events`
- `llm_cost_rates`
- `llm_budgets`
- `llm_budget_alerts`
- `model_evaluation_runs`
- `feature_flags`
- `experiments`
- `configuration_versions`
- `admin_audit_events`

## Roles and Permissions

Recommended admin roles:

- Super Admin: provider, secret, global budget, and emergency controls
- Assessment Admin: templates, profiles, routing, and question counts
- Content Reviewer: questions, artifacts, translations, and learning content
- Analytics Admin: reports, telemetry, cohort analytics, and exports
- Agent Operator: schedules, runs, budgets, and proposal queues
- Billing Viewer: cost and usage analytics without content or user-response access
- Auditor: read-only configurations, approvals, and audit history

## Delivery Phases

### Phase 1

- assessment counts and availability
- enabled profiles and routing weights
- report component visibility by plan
- tracker switches with dependency warnings
- configuration preview

### Phase 2

- provider and model registry
- workload-level model routing
- encrypted secret references
- agent schedules
- configuration versions and audit history
- usage ledger and estimated cost dashboard

### Phase 3

- provider billing reconciliation
- experiments and percentage rollout
- tenant-level overrides
- two-person approval workflows
- unit economics and revenue/margin views
- production job orchestration and automatic guardrails

## Current MVP Limitation

The present MVP stores many controls, telemetry records, and supervised-agent runs in browser-local state. True scheduled execution, centrally enforced configuration, secure provider credentials, cross-user usage analytics, and billing reconciliation require a server-side database, admin role claims, row-level security, a secret manager, durable job runner, and centralized audit logging.
