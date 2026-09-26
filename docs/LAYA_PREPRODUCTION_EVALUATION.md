# Laya Pre-production Evaluation

Status: Candidate in the bounded-decision comparison; not an MVP dependency
Decision date: 26 September 2026
Revisit stage: Pre-production readiness review

## Decision

New Horizon should evaluate Laya alongside Jev, deterministic rules, and an inexpensive structured-output model during the existing bounded-decision shadow pilot. Laya is a credible open-weight candidate, but it should not replace Jev or enter the MVP critical path without a use-case-specific evaluation.

Laya is a non-autoregressive typed-decision model. It accepts state such as text or structured data and returns `choice`, ordinal `score`, or yes/no probability (`noul`) outputs without generating prose. The project provides English, multilingual, and typed-decision-tuned checkpoints plus a router and self-hosted HTTP service.

Official project references: [Laya GitHub repository](https://github.com/NandhaKishorM/laya), [project documentation](https://nandhakishorm.github.io/laya/), and [Hugging Face model](https://huggingface.co/convaiinnovations/laya). The project is Apache 2.0 according to its repository. All benchmark and latency figures below are project-reported and require independent reproduction.

## Why it may fit New Horizon

- Open weights and Apache 2.0 allow self-hosting and controlled adaptation.
- Data can remain inside New Horizon infrastructure.
- The 322M multilingual checkpoint is small enough to investigate for CPU/GPU deployment.
- Typed outputs fit closed-set feedback triage, queue routing, quality-alert classification, and agent-stage gates.
- The router claims support for more than 100 languages, making Thai/English evaluation possible.
- A self-hosted Jev-compatible endpoint may reduce application integration differences during comparison.
- Fine-tuning on New Horizon's labelled decisions could improve accuracy for platform-specific labels.

## Important limitations

- Free weights do not mean free operation. New Horizon would own compute, model downloads, container security, scaling, monitoring, patching, backups, and incident response.
- Laya is newly released and has limited independent production evidence.
- Its own typed-decisions table reports weak results for the untuned base checkpoints: `0.362` English and `0.352` multilingual accuracy, below the reported `0.461` majority-class baseline. The tuned checkpoint reports `0.766`.
- The same table reports Jev with better soft accuracy (`0.580` versus `0.471`) and better uncalibrated ECE (`0.144` versus `0.213`) than the tuned Laya checkpoint. Confidence must not be treated as reliable without New Horizon calibration evidence.
- Project documentation says strong results come from domain fine-tuning. Training data design and maintenance therefore become part of the product burden.
- The English checkpoint has a 512-token context; the multilingual checkpoint defaults to 1,024 and can extend to 8,192, with the project reporting more variable performance beyond roughly 4,000 tokens.
- Option labels share an option-token budget. Large or verbose option sets may be trimmed or rejected; narrow candidate sets before inference.
- Cloudflare Workers is suitable for the web reviewer but not the natural place to host a PyTorch checkpoint. Laya would normally run as a separate private container/service or an offline batch process.

## Candidate uses

Evaluate Laya only where outputs are closed and versioned:

- classify question feedback into clarity, translation, artifact, rubric, scoring, format, or other
- prioritize a review queue on a fixed urgency/impact scale
- classify an agent result as complete, incomplete, retryable, blocked, or ready for human review
- route AI Watch candidates by domain, audience, sensitivity, or review requirement
- route translation disagreements to normal QA, second review, or human escalation
- triage deterministic telemetry aggregates into approved quality-alert categories
- detect likely duplicate or related feedback themes before human analysis

## Excluded uses

Laya must not:

- write, rewrite, translate, score, or approve questions
- create answer keys, rubrics, artifacts, reports, recommendations, or news summaries
- calculate assessment score, confidence, difficulty, discrimination, or psychometric parameters
- publish content or trigger consequential external actions without authoritative policy and human approval
- override access, tenant, privacy, PDPA, legal, budget, regional, provider, or security rules
- act as workflow orchestrator, system of record, audit store, or credential store

## Cost interpretation

The model license and weights are free. Expected costs are infrastructure and operations:

- local/offline experiment: existing developer hardware, with staff time and electricity as the main incremental costs
- free training experiment: the project provides a Kaggle 2x T4 notebook, but availability and quotas are not guaranteed
- persistent service: CPU/GPU container, storage, monitoring, deployment, and support costs
- specialization: labelled-data preparation, training, calibration, regression tests, and model-version governance

For New Horizon's early volume, Jev's hosted token price may be cheaper than operating a permanent model service. Laya becomes more attractive when privacy, offline operation, customization, or sustained volume justifies self-hosting.

## Revised shadow comparison

Use the same 1,000-5,000 frozen labelled decisions for:

1. deterministic rules
2. Jev
3. Laya base English or multilingual checkpoint, as applicable
4. a New-Horizon-tuned Laya checkpoint when enough training data exists
5. one inexpensive structured-output model

Split training, calibration, and final holdout sets by question family, feedback thread, and time so variants or repeated reviewer comments do not leak across sets. Do not tune against the final holdout.

Measure:

- accuracy, macro F1, per-class precision/recall, and confusion matrix
- Thai and English performance separately
- high-risk false negatives
- Brier score, expected calibration error, and reliability curves
- abstention/human-escalation coverage and selective accuracy
- latency, throughput, memory, compute utilization, and availability
- human-review reduction without loss of safety or quality
- Jev API cost versus Laya total cost of ownership
- robustness to missing context, mixed Thai/English, adversarial instructions, long inputs, too many options, and distribution shift

## Adoption recommendation

Preferred order:

1. Keep deterministic rules for hard policy and obvious routing.
2. Collect labelled feedback and operations decisions during MVP testing.
3. Run Laya locally/offline first for feedback-theme and review-priority experiments.
4. Compare tuned and untuned Laya against Jev on the same frozen holdout.
5. Adopt the lowest-complexity option that meets the use-case thresholds.

Laya is the preferred open-weight candidate when privacy, customization, or local processing matters and a small closed option set is available. Jev remains the lower-operations candidate for broad zero-shot evaluation. Neither receives production authority by default.

## Adoption gates

- closed, versioned labels and an explicit abstain/human path
- representative Thai/English labelled data
- independent holdout results meeting use-case thresholds
- calibrated confidence or policy based on validated selective risk
- acceptable high-risk false-negative rate
- documented model, tokenizer, training data, calibration, and code versions
- measured infrastructure and staff cost
- secured private endpoint, authentication, rate limits, observability, fallback, and kill switch
- no automatic scored-content or publication authority
- named human owner and rollback procedure

## Related Documents

- [Jev Pre-production Evaluation](JEV_PREPRODUCTION_EVALUATION.md)
- [Agent Platform Tooling Strategy](AGENT_PLATFORM_TOOLING_STRATEGY.md)
- [Agent Workflows and Orchestration](AGENT_WORKFLOWS_ORCHESTRATION.md)
- [Telemetry and Agent Orchestration](TELEMETRY_AND_AGENT_ORCHESTRATION.md)
- [Translation Provider Strategy](TRANSLATION_PROVIDER_STRATEGY.md)
