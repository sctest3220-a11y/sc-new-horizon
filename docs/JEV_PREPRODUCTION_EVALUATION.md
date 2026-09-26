# Jev Pre-production Evaluation

Status: Deferred evaluation; not an MVP dependency
Decision date: 25 September 2026
Revisit stage: Pre-production readiness review

## Decision

New Horizon may evaluate TypeSafe AI's Jev as a fast, low-cost decision layer for bounded classifications and agent-control choices. Do not add Jev to the MVP critical path. Revisit adoption during pre-production after the platform has labelled historical decisions, production-like traces, provider contracts, and measurable latency/cost baselines.

Jev is not a workflow orchestrator, generative LLM, statistical engine, system of record, scoring authority, or publication authority. Durable state remains in PostgreSQL; the workflow engine owns retries and schedules; deterministic code owns hard rules and calculations; generative models write or reason; humans approve material assessment and publication changes.

Official references: [TypeSafe AI](https://typesafe.ai/), [Introducing System One Models and Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev), [Jev API](https://api.typesafe.ai/docs), and [TypeSafe workflow evaluations](https://evals.typesafe.ai/). A small independent benchmark is available at [Jagent](https://jev-agent.com/benchmarks); it is useful directional evidence, not sufficient production validation.

## Candidate uses

Jev may be tested where the legal outputs are known in advance:

- route an event to an approved agent, queue, handler, or human-review path
- classify question feedback as clarity, ambiguity, artifact, translation, scoring, or other concern
- prioritize review backlog using a fixed urgency/impact scale
- decide whether an agent result is complete, incomplete, retryable, blocked, or ready for human review
- classify AI Watch domain, audience, relevance, sensitivity, and editorial-review requirement
- classify translation content or provider disagreement for standard QA, second-provider comparison, or human review
- triage telemetry anomalies and quality alerts after deterministic aggregation
- select the next bounded workflow stage from currently available options
- score an output against an explicit ordinal review scale

## Excluded uses

Jev must not:

- write or translate questions, artifacts, news summaries, reports, explanations, learning paths, or recommendations
- calculate or alter assessment scores, confidence, psychometric parameters, answer keys, or rubrics
- replace statistical analysis, deterministic validation, or calibrated psychometric jobs
- approve or publish scored content, sensitive news, legal text, profile changes, or platform improvements
- override tenant permissions, consent, PDPA, provider eligibility, regional, budget, security, or human-review rules
- own workflow state, retries, schedules, authoritative memory, audit history, or provider credentials

## Architectural placement

```text
Events and persisted state
  -> deterministic aggregation, validation, permissions and hard gates
  -> optional Jev bounded decision
       -> typed choice / score / probability / confidence
       -> confidence threshold and policy evaluation
  -> approved worker, queue or human-review path
  -> outcome verification
  -> durable audit and evaluation record
```

Jev may help the translation router classify fuzzy attributes such as sensitivity or material disagreement, but the deterministic router remains authoritative. Jev cannot bypass the routing policy or choose a provider that is unavailable, unapproved, over budget, regionally prohibited, or outside its allowed workload.

## Current commercial assumptions

At the decision date, TypeSafe lists Jev at $0.042 per million input tokens with no output-token charge and describes typical service latency of approximately 70-500 ms. These are vendor claims and may change. Illustrative costs at 2,000 input tokens per decision are about $0.84 for 10,000 decisions, $8.40 for 100,000, and $84 for one million decisions.

Jev is a closed managed API and was newly released in early access. Pre-production review must confirm current pricing, credits, quotas, region, retention, data use, security controls, SLA, support, continuity, incident response, and contract terms. No estimate is a production commitment until reconciled against pilot usage and a provider agreement.

## Shadow-mode pilot

1. Select 1,000-5,000 historically labelled decisions across feedback triage, agent completion gates, AI Watch sensitivity, translation escalation, and quality-alert prioritization.
2. Freeze explicit option sets, definitions, expected labels, confidence thresholds, and evaluation metrics before testing.
3. Compare Jev with deterministic rules, Laya base/tuned checkpoints, and at least one inexpensive structured-output model using the same inputs. See [Laya Pre-production Evaluation](LAYA_PREPRODUCTION_EVALUATION.md).
4. Run Jev in shadow mode: record recommendations but permit no live routing, user-visible decision, score change, publication, or external side effect.
5. Measure accuracy, per-class recall, calibration, abstention/escalation quality, consistency, latency, token use, cost, provider errors, and human-review reduction.
6. Evaluate subgroup and language performance, especially Thai versus English content and rare high-risk classes.
7. Test stale state, missing evidence, adversarial text, prompt injection, unavailable options, long traces, ambiguous labels, and provider outage.
8. Review false negatives separately for safety, legal, privacy, assessment integrity, and sensitive-news routing.
9. Publish an internal evaluation report and obtain human approval before any limited rollout.

## Adoption gates

Adopt Jev for an individual use case only when:

- the decision has a closed, versioned output set and an explicit abstain/human-review path
- deterministic rules alone are materially insufficient
- the labelled test set represents production languages, risks, profiles, and edge cases
- accuracy, calibration, latency, cost, and availability meet use-case-specific thresholds
- high-risk false-negative rates are acceptable to the named risk owner
- confidence thresholds are validated rather than copied from a vendor example
- every decision, probability, confidence, input/version, policy, fallback, and outcome is auditable
- deterministic hard gates and human approvals remain enforceable outside Jev
- security, privacy, legal, procurement, vendor and continuity reviews pass
- a tested fallback and kill switch exist

Adoption is per use case, not platform-wide. Failure on one use case does not establish that Jev is unsuitable for all bounded decisions; success on one does not authorize broader use.

## Pre-production checklist

- [ ] Confirm Jev product availability, model version, price, quota, SLA and support.
- [ ] Complete security, PDPA, subprocessor, cross-border-transfer, retention and data-use review.
- [ ] Select bounded candidate decisions and named owners.
- [ ] Build labelled, versioned evaluation datasets.
- [ ] Define thresholds, abstention, human escalation, fallback and kill switch.
- [ ] Complete the shadow-mode comparison and independent review.
- [ ] Document accepted and rejected use cases with evidence.
- [ ] Add approved routes to Admin configuration, cost telemetry, tracing and audit controls.
- [ ] Run a limited rollout with monitoring and rollback before production expansion.
