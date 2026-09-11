# 3,328-question review inventory

The 10 September 2026 milestone adds **3,328 English-language draft item variants** for review. It does not replace or extend the 634-item live assessment bank. All work belongs to `Lufy-branch`.

## Coverage

| Layer | Mappings | Difficulty levels | Variants per cell | Draft items |
| --- | ---: | ---: | ---: | ---: |
| Core | 24 | 4 | 8 | 768 |
| Function | 81 | 4 | 4 | 1,296 |
| Industry | 20 | 4 | 4 | 320 |
| Executive | 59 | 4 | 4 | 944 |
| **Total** | | | | **3,328** |

Every difficulty level contains 832 drafts. All 736 mapped competency/difficulty cells meet their quota. The function count includes the 11 mappings for the general professional track, plus 10 mappings for each of seven specialized functions. Industry `general` has no mappings and creates no overlay items.

## Files

- [Full review workbook](../exports/review-inventory/new-horizon-3328-review.xlsx): filterable questions, answer keys, explanations, editable review decisions/checks, a formula-driven summary, and coverage rows.
- [Question data](../exports/review-inventory/questions.json): complete item content, option-level feedback, proposed scoring, profile tags, provenance, review status, and content hashes.
- [Coverage audit](../exports/review-inventory/coverage.json): exact counts and mechanical review candidates.
- [48 samples](../exports/review-inventory/samples.md): one applied core and one advanced specialized example for each competency.

The earlier `exports/new-horizon-question-bank-review.xlsx` still describes the existing live bank.

## What was authored

The bank uses **96 competency/difficulty decision families**, containing **384 base evidence patterns**, and **76 profile-specific constraint cases**. Each core pattern has two contextual forms. Each specialized item combines a competency decision with a profile-specific action. A specialized distractor can identify the competency issue correctly while choosing an action that violates the supplied profile constraint.

These are related item variants, not 3,328 independently authored or empirically calibrated problems. Shared `familyId` and `casePatternId` values make this relationship explicit. Reviewers should compare sibling forms and flag superficial variation, overly obvious distractors, and repeated answer clues. Unique IDs and non-identical full text do not establish psychometric independence.

All drafts use a single-best-answer interaction with four options. Calculation examples have scenario-specific distractors for plausible arithmetic or interpretation errors. Each option has feedback. The proposed raw key is 100 for the best answer and 0 for the other choices; partial credit has not been inferred. These items measure scenario judgment and knowledge, not observed hands-on task performance. No new visual artifacts, live tool tasks, or Thai translations are included.

Difficulty describes intended cognitive demand:

- Awareness: recognize the issue or mechanism.
- Applied: select an action under explicit conditions.
- Proficient: interpret comparisons, diagnose failures, or resolve conflicting evidence.
- Advanced: choose an evaluation or control for interacting or recurring problems.

The labels remain provisional. A long stem, technical terminology, or an executive setting does not by itself establish advanced difficulty. All item reviews and pilot calibration remain pending.

## Review process

1. Filter the workbook by competency, difficulty, layer, and profile. Review a family together before inspecting all contextual variants.
2. Check that the evidence is sufficient, exactly one option is best, and each distractor is plausible for this scenario. Use the notes column for a proposed correction.
3. Check that the profile constraint creates a meaningful specialized decision. Reject variants that only change vocabulary or combine unrelated problems.
4. Review difficulty, reading load, language, answer-length clues, cultural assumptions, and similarity. The audit currently flags six items for an answer-length comparison; this is a heuristic, not an item-quality verdict.
5. Record a reviewer, check results, and a decision: Pending, Approve for pilot, Revise, or Reject. Approval in the workbook is a recorded decision only; it does not change the JSON or publish a question.
6. Reconcile approved revisions into versioned source before a separately authorized pilot. Track item and family exposure, response accuracy, distractor selection, timing, discrimination, subgroup performance, and uncertainty. Use fresh or held-out forms to distinguish transfer from answer recall.

Keep related evidence patterns out of the same scored session when possible. Later routing should match function, industry, and executive tags, respect reviewed status, and avoid treating repeated forms as independent evidence. None of those live-routing changes are part of this draft-only milestone.

## Regeneration and validation

Use Node.js 22.13 or later (Node 24 was used for validation):

```text
node scripts/generate-review-inventory.mjs
node --test scripts/test-review-inventory.mjs
```

Generation reads the existing platform model without rendering React. It fails if coverage no longer matches the agreed target. It writes only the review JSON, coverage audit, and samples. The eight automated tests cover mapping counts, coverage, key positions, deterministic generation, family definitions, specialized boundaries, live-bank isolation, arithmetic examples, and rejection of corrupted inventory data.

The workbook builder uses the bundled `@oai/artifact-tool` runtime rather than changing application dependencies. Link the available bundled Node package directory to the ignored `work/review-inventory/node_modules` path, then run:

```text
node scripts/export-review-inventory.mjs
```

The builder checks formulas, renders all sheets, and saves the same workbook into `outputs/new-horizon-review-inventory/` and the tracked export directory. Generated outputs are reproducible, but regeneration replaces generated files. Preserve reviewer-entered workbook decisions before regenerating. Source modules live in `inventory/`; the live application does not import them.

## Background reading

The scenarios and policies are fictional exercise evidence. They make no jurisdiction-specific legal or clinical claims. These references support general concepts and further review; they do not validate the authored items or their answer keys:

- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [Microsoft Learn: retrieval-augmented generation](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview)
- [OWASP: prompt injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [UK Government AI Playbook](https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government/artificial-intelligence-playbook-for-the-uk-government-html)
