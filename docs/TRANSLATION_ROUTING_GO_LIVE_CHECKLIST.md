# Translation and Routing Go-live Checklist

Status: Required release gate
Last updated: 25 September 2026

This checklist operationalizes [Translation Provider Strategy](TRANSLATION_PROVIDER_STRATEGY.md). It applies to assessment content, AI Watch, artifacts, reports, interface copy, and any future user-generated translation workload.

## Provider and commercial readiness

- [ ] Approve the production provider list and exact model versions for each workload.
- [ ] Complete vendor security, PDPA, subprocessor, cross-border-transfer, retention, deletion, data-use, support, SLA, quota, and continuity review.
- [ ] Record current rate cards, billing units, free-credit assumptions, taxes, storage/network charges, and effective dates.
- [ ] Confirm that provider terms permit the intended assessment and newsfeed processing.
- [ ] Keep a tested independent fallback for every required production workload.
- [ ] Do not treat a free research or preview API as a production dependency without documented quotas, support and continuity terms.

## Quality evidence

- [ ] Complete a blind, stratified 100-question comparison for assessment translation.
- [ ] Complete a separate 100-story AI Watch comparison.
- [ ] Record fidelity, natural Thai, completeness, terminology, cultural fit, evidence preservation, answer/rubric equivalence, and UI readability.
- [ ] Confirm that translation does not change answer ids, keys, rubric meaning, difficulty, numbers, dates, names, links, variables, or artifact evidence.
- [ ] Approve and version the New Horizon terminology list, do-not-translate list, domain prompts, and translation memory.
- [ ] Define automatic QA thresholds and human-review escalation rules.
- [ ] Require human approval for every scored assessment translation and sensitive or disputed news item.

## Deterministic router

- [ ] Implement a server-side, configuration-driven translation router; do not route from browser code.
- [ ] Version every policy and store `provider`, `model`, `fallback_order`, `cache_key`, `qa_profile`, `requires_human_review`, and `reason_codes` with each decision.
- [ ] Test workload, language, sensitivity, provider health, quota, region, data-policy, budget, confidence, and tenant restriction inputs.
- [ ] Prove that assessment translation never silently falls back to a model that could change approved meaning.
- [ ] Prove that no route can bypass legal, regional, budget, approval, or publication gates.
- [ ] Add an admin preview showing the route and reason before activation.
- [ ] Add scheduled activation, rollback, emergency provider disable, and fail-closed behavior.
- [ ] Test provider outage, timeout, malformed output, quota exhaustion, budget exhaustion, low confidence, and provider disagreement.
- [ ] Defer learned/agentic routing until production evidence shows a measurable benefit over deterministic policy.

## Data, cache and versioning

- [ ] Build a cache key from source hash, languages, provider/model, glossary, translation memory, prompt/template, and summary version.
- [ ] Demonstrate that unchanged content is not translated or billed twice.
- [ ] Demonstrate that one tenant, language, model, or glossary version cannot receive another route's cached result.
- [ ] Preserve approved, rejected and superseded translations with source and decision history.
- [ ] Store credentials only in an approved server-side secret manager.
- [ ] Define retention and deletion for source text, provider payloads, translations, logs and reviewer comments.

## Cost and operations

- [ ] Capture provider-reported characters/tokens, latency, retries, cache hits, failures and cost for every request.
- [ ] Reconcile estimated costs against provider invoices.
- [ ] Configure daily/monthly budgets and alerts by provider, model, workload, tenant and environment.
- [ ] Verify the AI Watch volume model with real pilot token counts rather than planning estimates.
- [ ] Monitor approval rate, human edit distance, fallback rate, corrections and quality drift by provider/model.
- [ ] Add dashboards and alerts for provider failure, unusual spend, cache misses, QA failure and review backlog.

## Content and rights

- [ ] AI Watch translates only permitted metadata and New Horizon-authored summaries, not full publisher articles or transcripts.
- [ ] Preserve publisher attribution, source URL, media embed rules and takedown/correction workflow.
- [ ] Validate that summaries remain source-grounded before and after translation.
- [ ] Keep sensitive-news publication behind editorial approval.

## Release approval

- [ ] Security owner approves provider and secret handling.
- [ ] Privacy/legal owner approves PDPA, vendor and transfer controls.
- [ ] Content/localization owner approves the quality pilot and terminology versions.
- [ ] Product/operations owner approves routing, budgets, fallbacks and monitoring.
- [ ] Release record identifies policy, provider/model, glossary, translation-memory and QA versions.
