# Recursive self-improvement for platform agents

## Decision — September 29, 2026

Platform agents should use bounded recursive self-improvement (RSI). Improving a single answer is insufficient: the system must use measured outcomes to improve its prompts, tools, retrieval, routing and workflows, then evaluate whether its improvement procedure also improves. This is a platform requirement, not a claim that today's simulated agents already learn or rewrite themselves.

Research context: [Sakana RSI Lab](https://sakana.ai/rsi-lab/) and [Darwin Gödel Machine](https://sakana.ai/dgm/) demonstrate the direction. Agent-code evolution is distinct from updating foundation-model weights; reported research results do not establish New Horizon performance.

## Why AI Watch has been reactive

The September 29 review found a manually maintained visible feed, on-demand crawling, and deterministic Admin agent simulations. Discovery matched a predefined keyword taxonomy and sampled a small number of links per source. No operating service compared published coverage with important developments, retained missed topics as evaluation cases, or improved discovery strategy from measured outcomes. A user asking about a missing subject therefore triggered a one-off crawl rather than a systematic correction.

The requirement is broader than adding RSI keywords or an RSI story: platform agents must detect gaps before users report them and improve the process that produced the gap. A crawler schedule supplies a trigger; durable memory, evaluation and controlled adoption supply the learning loop. RSI applies across platform agents, with AI Watch as the first concrete application.

## Required operating loop

1. Observe proactively on scheduled runs and completion events: failed tasks, reviewer rejections, repeated corrections, coverage gaps, stale sources, cost and latency. User complaints become regression cases, not the main trigger.
2. Diagnose the reusable cause and create a versioned hypothesis with supporting traces. Deduplicate by failure signature and parent agent version.
3. Propose a bounded change to prompts, tools, retrieval rules or workflow code in an isolated candidate version. Preserve the parent, rationale, diff, resource budget and rollback target.
4. Compare candidate and baseline on the same frozen evaluation set, including independent held-out tasks, Thai/English cases and past failures. Measure task success, evidence quality, coverage, false positives, cost and latency. The candidate cannot edit its evaluator or holdout.
5. Reject regressions. Human reviewers approve promotion under existing platform rules. Canary approved versions; roll back when monitored outcomes regress.
6. Feed accepted and rejected experiment outcomes into the next proposal. Evaluate changes to the proposal/search strategy as separate candidates under the same independent gate. Keep failed experiments so the system does not repeatedly rediscover them.

Initial experiment cap: three candidates per failure signature per run, with a configured cost/time ceiling required before execution. Stop on exhausted budget, repeated failure, missing evaluation evidence or a regression. Improvements cannot change permissions, approval gates, scoring truth, evaluator fixtures or their own resource ceilings.

## AI Watch is the first application

The objective combines discovery recall, evidence quality, editorial usefulness, diversity and delay to review. Clicks and candidate count alone are not success criteria.

- Daily discovery across approved sources and every editorial lane, including RSI and self-improving agents.
- Reserve sampling capacity for unfamiliar headlines so a fixed taxonomy does not hide new concepts.
- Record per-source errors and current-run lane gaps. A missing match triggers investigation, not a claim that nothing happened.
- Weekly review compares the published feed and candidate queue against an independently curated sample of important developments. Turn misses into regression fixtures; propose additional sources, synonyms and better sampling.
- Evaluate each discovery change on both remembered misses and unseen examples. Promote only if recall improves without unacceptable noise or cost.
- Carry source-backed candidates through editorial review to visible stories and shared Did you know hooks. Discovery alone does not close the loop.

## Implemented now and remaining integration

Implemented locally: RSI story and bilingual awareness hook; an explicit discovery lane; Sakana source index; daily rotating sampling with unfamiliar-headline capacity; current-run coverage reports and investigation records; a GitHub Actions daily discovery definition with retained report artifacts.

The workflow becomes scheduled only after it reaches the repository's default branch and Actions is enabled. Each CI run is independent; artifacts are evidence, not a durable editorial queue or experiment memory. There is no automatic publication or agent mutation.

Still required for operating RSI: actual model-backed workers, durable version/experiment registry, independent evaluator, bounded sandbox, approved promotion/canary/rollback integration, persistent editorial queue and a separately scheduled watchdog for missed runs. The current Admin agent simulation is not connected to collector artifacts. Do not describe these services as live.

Acceptance for production: a seeded missed topic is detected without user prompting; a failed source creates an operational alert; an agent proposes and evaluates a discovery change; a reviewer can inspect the baseline comparison and promote or reject it; the next run uses the approved version; regression triggers rollback; a missed schedule alerts after 48 hours. Test this end to end before claiming proactive, self-improving platform agents.
