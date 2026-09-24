# Translation Provider Strategy

Status: Architecture decision and pilot plan
Last updated: 25 September 2026
Pricing research date: 25 September 2026

This document defines how New Horizon should use machine translation for the relatively stable assessment bank and the continuously refreshed AI Watch newsfeed. It complements [Question Bank Localisation](LOCALISATION.md), [Admin Settings and Configuration](ADMIN_SETTINGS_CONFIGURATION.md), [Legal, Privacy, PDPA and Terms](LEGAL_PRIVACY_PDPA_TERMS.md), and [Agent Workflows and Orchestration](AGENT_WORKFLOWS_ORCHESTRATION.md).

## Decision

Machine output is always a translation **draft**, not the approved Thai source. New Horizon retains the existing translation until an authorized reviewer promotes a candidate through `draft -> reviewed -> approved`. Provider changes must not silently overwrite approved wording, answer mappings, rubrics, artifact text, or version history.

Recommended routing:

| Workload | Default | Escalation | Final control |
| --- | --- | --- | --- |
| Assessment question pilot | Compare Qwen-MT Plus and Google Translation LLM | ThaiLLM as naturalness/cultural QA | Human bilingual reviewer |
| Assessment question production updates | Winning provider from the blind pilot | Second provider for low-confidence or disputed text | Human approval before publication |
| AI Watch routine translation | Qwen-MT Flash | Qwen-MT Plus for difficult content | Automated factual QA and sampling |
| AI Watch sensitive or disputed content | Qwen-MT Plus plus independent Google comparison | ThaiLLM may flag unnatural Thai | Human editorial approval |
| Thai cultural-context review | ThaiLLM | Human reviewer | Human decision |

Chrome's built-in page translation is useful as an informal reviewer reference, but it is not an application integration. It does not provide structured fields, stable versioning, provider usage records, or a controlled publication workflow.

## Workload differences

### Assessment bank

The assessment bank is translated infrequently but has a high correctness requirement. A translation can change the construct, difficulty, answer key, partial-credit interpretation, or artifact evidence. Translate structured fields separately and retain language-independent ids and scoring data.

Required fields include scenario, prompt, choices, option feedback, explanation, written-response rubric, exemplar, artifact label/caption/alt text, and any learner-facing scoring explanation. Regenerate only when the English source hash, glossary version, or approved localization rule changes.

### AI Watch newsfeed

AI Watch is dynamic and cost-sensitive. Translate only content New Horizon is entitled to display: attributed publisher headlines or metadata, New Horizon-authored summaries, `Why this matters`, topic labels, accessible media descriptions, and personalized `Did you know?` text. Do not translate and republish full articles, transcripts, captions, video, or audio.

Cache each translation by source-content hash, source language, target language, provider/model version, glossary version, and summary version. Unchanged content must not be translated twice.

## Provider assessment

### Google Cloud Translation

Google Cloud Translation Advanced offers NMT and Translation LLM models, glossaries, batch translation, IAM controls, request labels for billing analysis, and regional endpoints. Google states that customer data and translations are not used to improve its translation models.

Strengths: mature translation service, glossary controls, enterprise IAM, billing labels, batch workflows, and a strong independent fallback. Limitations: materially higher unit cost than Qwen-MT for a frequently refreshed feed.

Official references: [API overview](https://docs.cloud.google.com/translate/docs/api-overview), [pricing](https://cloud.google.com/products/translate/pricing), and [glossaries](https://docs.cloud.google.com/translate/docs/advanced/glossary).

### Qwen-MT

Qwen-MT is a translation-specialized model family supporting Thai, term intervention, domain prompting, and translation memory. For New Horizon it offers a strong cost advantage and controls suited to technical terminology.

Strengths: very low unit cost, translation-specific models, terminology intervention, domain context, and translation memory. Limitations: token-based billing is less intuitive than character billing, Thai token counts must be measured from real calls, and Alibaba Cloud must pass vendor, privacy, data-location, support, and continuity review.

Official references: [Qwen-MT documentation](https://www.alibabacloud.com/help/en/model-studio/machine-translation) and [Model Studio pricing](https://www.alibabacloud.com/help/en/model-studio/model-pricing).

### ThaiLLM

ThaiLLM is an open-weight Thai foundation-model ecosystem rather than a dedicated commercial translation product. It is valuable for Thai naturalness, cultural-context review, local experimentation, and potential self-hosting. Its public project currently describes Playground and API access as free, but no production commercial pricing, SLA, durable quota, or long-term availability commitment was identified in the September 2026 review.

ThaiLLM should initially be a QA model, not the sole production translator. General LLM rewriting can paraphrase, omit, or introduce facts. This is especially risky for assessment answer equivalence and source-grounded news summaries.

The 8B and 30B weights can be served with vLLM through an OpenAI-compatible endpoint. Self-hosting avoids per-call API charges but introduces GPU, scaling, monitoring, security, patching, and availability costs. At New Horizon's expected MVP volume, an always-on GPU is likely much more expensive than Qwen-MT usage.

Official references: [ThaiLLM ecosystem](https://www.thaillm.or.th/), [ThaiLLM availability announcement](https://www.sciencepark.or.th/th/innovation-update/1667/thaillm-national-ai-infrastructure-nectec-nstda/), [8B model card](https://huggingface.co/ThaiLLM/ThaiLLM-8B/blob/main/README.md), and [30B model card](https://huggingface.co/ThaiLLM/ThaiLLM-30B/blob/main/README.md).

## Cost model

The measured September 2026 inventory contains approximately 2.58 million user-facing English characters: about 1.97 million in 3,328 review drafts and 608,000 in 634 live questions. Qwen estimates assume roughly 650,000-900,000 input tokens and 1.3-2.6 million Thai output tokens. Actual Qwen cost must be replaced with measured usage from the pilot.

### One complete assessment-bank pass

| Provider/model | Estimated cost (USD) | Basis |
| --- | ---: | --- |
| Qwen-MT Lite | $0.60-$1.10 | International token pricing; estimated Thai token range |
| Qwen-MT Flash | $0.80-$1.50 | International token pricing; estimated Thai token range |
| Qwen-MT Plus | $12-$22 | International token pricing; estimated Thai token range |
| Google NMT | About $42 | First 500,000 characters/month credited, then $20/million input characters |
| Google Translation LLM | About $50-$55 | $10/million input and $10/million output characters |
| Google Adaptive Translation | About $125-$135 | $25/million input and $25/million output characters |
| ThaiLLM public API | Currently described as free | Production pricing, SLA and durable quota not published |
| Self-hosted ThaiLLM | Workload-dependent infrastructure cost | GPU time, serving, storage, observability and operations |

Prices can change and exclude taxes, network/storage charges, retries, prompt overhead, failed QA, and repeat translations. Admin must store rate-card version and reconcile estimates with provider bills.

### Illustrative AI Watch monthly cost

Assume 1,500 translated characters per approved story, one target language, cached results, and no full-article translation.

| New stories | Characters/month | Google NMT estimate | Qwen-MT Flash planning range |
| --- | ---: | ---: | ---: |
| 10/day | 450,000 | Within the current monthly NMT credit | Below $1 |
| 50/day | 2.25 million | About $35 | About $0.50-$1.50 |
| 100/day | 4.5 million | About $80 | About $1-$3 |
| 500/day | 22.5 million | About $440 | About $5-$15 |

These Qwen figures are planning ranges, not invoices. Record real input/output tokens during the pilot and update this table.

## Translation pipeline

1. Select the approved English source and calculate its content hash.
2. Skip translation when an approved result exists for the same source, glossary, provider/model, and template versions.
3. Send structured content, never scoring ids or executable markup, through the configured provider route.
4. Apply the versioned New Horizon terminology list, including intentional preservation rules for `AI`, `LLM`, `Workflow`, `Prompt`, `Model`, `Agent`, `RAG`, `API`, and other approved workplace terms.
5. Validate field presence, option count/order, ids, numbers, dates, currencies, names, URLs, variables, and markup.
6. Detect unexplained English fragments and compare source/target meaning.
7. Escalate low-confidence, sensitive, or provider-disputed content according to the routing table.
8. Save source, candidate, provider/model, region, glossary version, prompt/template version, usage, cost, QA results, reviewer, timestamps, and decision.
9. Publish only the approved version. Preserve rejected and superseded candidates for audit and future comparison.

## Pilot and selection

Run a blind, stratified 100-item assessment test and a separate 100-story AI Watch test. Include simple and advanced language, all item formats, technical and nontechnical topics, long and short content, numbers, named entities, Thai-localized contexts, and sensitive-news examples.

Reviewers score each candidate from 1 to 5 on:

- Meaning and factual fidelity
- Natural, simple Thai
- Completeness with no untranslated fragments
- Technical terminology
- Cultural and contextual fit
- Answer-choice and rubric equivalence for assessment items
- Preservation of names, numbers, dates, links, and evidence
- UI length and readability

Provider selection is based on quality first, then cost, latency, reliability, controls, privacy, support, and operational fit. ThaiLLM may win the naturalness check without becoming the primary translator. A provider tie should favor the simpler and cheaper route while retaining an independent fallback.

## Admin and telemetry requirements

Admins need provider/model routing by workload, glossary and translation-memory versions, source/target languages, region, timeouts, retries, fallback, rollout percentage, human-review threshold, cache policy, emergency disable, daily/monthly budgets, and effective dates.

Track translation requests, characters, tokens, latency, retries, cache hits, provider failures, estimated and reconciled cost, automated QA findings, human edits, approval rate, time-to-approval, fallback rate, and post-publication corrections. Never use translation telemetry to bypass consent, retention, PDPA, vendor or cross-border-transfer controls.

## Production gates

- Complete security, PDPA, subprocessor, data-location, retention, and contractual review for every provider.
- Keep credentials server-side in a secret manager; never expose them to the browser.
- Establish provider quotas, budgets, outage fallback, and deletion/retention behavior.
- Require human approval for scored assessment content and sensitive news.
- Demonstrate source-target equivalence, stable ids, and deterministic cache/version behavior.
- Revalidate quality and rates whenever a provider changes its model alias, pricing, region, or terms.
