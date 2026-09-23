# Question Rewrite Rules and Versioning

Status: Approved baseline for future rewrites; remains a living standard
Current rules version: `2.0`
Last updated: 23 September 2026
Human approval recorded: 23 September 2026

## Purpose

This standard guides human and agent-assisted rewrites of assessment questions. It also prevents useful variants from being lost. Rewrites remain proposals until a human reviewer selects and approves a version.

## Core rewrite rules

1. Start with a realistic situation the user can picture.
2. Present information in this order: background, relevant AI behavior or evidence, consequence, then the question.
3. Ask one clear decision at a time unless the item is intentionally multi-part.
4. Use familiar product language. For example, say that an LLM generates an answer or that a system searches an uploaded document library.
5. Describe observable behavior instead of hidden or abstract mechanisms such as "learned patterns."
6. Test one intended concept. Remove wording that accidentally suggests a different concept, such as hallucination when testing generation versus retrieval.
7. Include only details needed to understand the decision. Do not attach isolated policies, risks, or constraints.
8. When a policy, approved source, or constraint matters, show the complete causal chain:
   - Requirement: what must be used or followed?
   - Behavior or failure: what did the AI do or fail to do?
   - Consequence: what incorrect, misleading, unsafe, or costly result could follow?
9. Make every answer choice plausible and comparable in length, specificity, and grammatical structure.
10. Avoid clues created by one answer being more detailed, more cautious, or using exact words from the question.
11. Explain why the correct answer fits the evidence and, where useful, why the tempting alternatives do not.
12. Use an artifact only when the user must inspect it to answer. Follow the canonical [Artifact Design and QA Standard](ARTIFACT_DESIGN_AND_QA_STANDARD.md). Embed it inside the scenario after the relevant context and immediately before the question it supports; do not present it as a detached section above the task.
13. Translate meaning and context, not English sentence structure. Check the scenario, prompt, choices, feedback, and explanation for complete Thai coverage.
14. Prefer short sentences and ordinary words, but do not remove information needed to understand the situation or consequence.
15. Connect audience details to a concrete requirement or risk. Remove persona facts that do not affect the decision.
16. Describe the answer category clearly, but do not make the correct option a word-for-word copy of the evidence sentence.
17. In multi-part items, point each question to specific evidence. Do not ask users to interpret labels such as "extra detail" or "profile cue."
18. Use concrete examples, quantities, and consequences when they make the decision easier to understand without giving away the answer.
19. Use culturally neutral settings or contexts familiar to the intended Thai audience. Do not require knowledge of Western institutions, holidays, school systems, job titles, consumer habits, laws, currencies, or workplace customs unless that knowledge is part of the competency being assessed.
20. Localize the situation, not just the words. Thai versions may adapt names, organizations, services, examples, units, dates, and work practices when needed, while preserving the same evidence, decision, difficulty, and correct answer.
21. Do not force superficial Thai references or stereotypes into every question. Prefer ordinary, credible settings such as a local business, public service, hospital, school, university, bank, online seller, manufacturing team, community organization, or regional company when the setting matters.
22. Explain organization-specific titles and authority boundaries in ordinary language. Do not assume users understand terms such as account owner, district manager, school board, or benefits administrator when the role itself is not being tested.
23. Artifacts must present evidence neutrally. Remove labels, callouts, highlights, or instructions that reveal the suspicious point or teach the correct answer.
24. Localize currencies, units, dates, and market conventions when they are not part of the competency being tested.
25. When a technical term is useful, describe the decision in plain language first and explain the term in answer feedback rather than making vocabulary recognition the hidden task.
26. Generate a question-specific artifact when users must inspect evidence and an existing shared artifact cannot represent the scenario realistically. Do not reuse an artifact merely because its general topic is similar.
27. For written responses, state the dimensions the user must address, such as evidence to verify, action to take, and communication to provide. Do not reveal the expected conclusion.
28. For IT and developer roles, prefer a short operational scenario followed by scannable evidence such as logs, traces, permissions, configuration, code, or test results.
29. Put detailed technical facts in the embedded artifact instead of repeating them in prose. Preserve every decision-relevant fact while reducing narrative reading load.
30. For multi-select questions, state the exact number of choices required and avoid answer patterns where nearly every option is correct except one obviously unsafe choice.
31. Never publish or present a partially translated question as Thai. The scenario, prompt, every choice, explanation, feedback, and artifact text must pass a completeness scan together. Preserve only approved technical terms such as AI, LLM, RAG, CRM, JSON, API, Workflow, and Prompt; mixed fragments or corrupted substitutions fail the item and require review.
32. Apply the **AI necessity test**: remove AI from the scenario and ask whether substantially the same reasoning still solves the item. If it does, the question primarily tests the professional domain rather than AI competency and must be rewritten or remapped.
33. Make the AI-specific construct observable. State the relevant AI behavior, decision rule, evidence boundary, workflow control, confidence limitation, permission, or human-review requirement that the user must evaluate or improve.
34. For single-best-answer items, define one decision and one evidence boundary. Choices must be mutually exclusive recommendations at the same level of action. If two choices remain defensible under reasonable unstated circumstances, narrow the scenario or use a rubric-based multi-part format.
35. Do not invent partial-credit values for ordinary distractors. Award partial credit only for predefined evidence or reasoning components with an explicit rubric. Otherwise use single-best-answer scoring and analyze distractors diagnostically.
36. Independently recompute every derived value, ratio, percentage, total, rate, and comparison used by the scenario, artifact, options, key, or explanation. A numerically correct artifact can still be invalid if the selected metric does not support the stated decision.
37. Check operational feasibility. A proposed action must account for the time, traffic, budget, permission, data, and workflow needed to perform it. Do not recommend gathering a larger sample while also prohibiting the resources required to gather it.
38. Distinguish **limited testing** from **wider deployment or scaling**. When more evidence is needed, define a bounded test, cap, duration, stopping rule, or approval gate rather than describing uncertainty resolution as consequence-free.
39. Stress-test the key by writing the strongest reasonable argument for every option. Revise the item when a distractor can satisfy the prompt without contradicting explicit evidence or constraints.

## Thai cultural-context standard

Use one of these approaches for each item:

- **Culturally neutral:** The scenario works naturally in Thailand and other markets without requiring local background knowledge.
- **Thai-localized:** The Thai version adapts the setting or example to something a typical Thai user can readily understand.
- **International by design:** The scenario keeps an international context because cross-border knowledge is relevant to the tested role or competency. Explain any unfamiliar term needed to answer.

Localization must not change the construct being measured. The English and Thai versions should require the same reasoning and provide equivalent evidence. A cultural adaptation that changes the correct answer, adds a clue, removes a risk, or makes one language easier requires a new version and human review.

## Clarity check

Before a version is proposed for use, a reviewer should be able to answer:

- Who is doing what, and why?
- What did the AI or system actually do?
- What source, evidence, or rule was required?
- Did the system use it?
- Why does the difference matter?
- What single competency or concept is being tested?
- Can the question be answered without guessing what the writer meant?
- Are all choices plausible and written at the same level?
- Would an average Thai user understand the setting without needing unrelated knowledge of another country or culture?
- Does the Thai version feel locally natural while preserving the same evidence, difficulty, and answer?

## Versioning workflow

1. Never replace a materially different question without recording the previous version.
2. Store comparison-ready versions in `exports/review-inventory/question-version-history.json`.
3. Use the version format `YYYY-MM-DD.N`, incrementing `N` for each material revision on that date or revision series.
4. Record the scenario, prompt, choices, answer, explanation, reviewer concern, rules introduced, date, and source commit.
5. Minor spelling or punctuation fixes do not require a new content version unless they change meaning.
6. Keep `preferredVersion` empty until comparative human review is complete.
7. Compare versions using clarity, validity, realism, answerability, bias, translation quality, and reviewer/user feedback.
8. Selecting a preferred version does not delete rejected variants; mark the decision and retain its rationale.
9. Update this document when feedback reveals a reusable writing rule.
10. Agents may propose revisions and summarize evidence, but a human approves promotion to the scored assessment.

## Suggested comparison rubric

Rate each version from 1 to 5 on:

- Clarity and natural flow
- Realism of the situation
- Alignment to the intended competency
- Relevance of every detail
- Quality and balance of answer choices
- Explanation quality
- English and Thai equivalence
- Cultural familiarity and fairness for the intended audience
- Artifact usefulness, when applicable

Also record a final decision: `prefer`, `revise`, `hold`, or `reject`.

## Rules changelog

### Version 2.0 - 23 September 2026

- Added the AI necessity test so domain judgment with decorative AI framing is not misclassified as AI competency evidence.
- Required an observable AI behavior, rule, evidence boundary, or control in every AI-specific item.
- Added mutual-exclusivity and evidence-boundary requirements for single-best-answer questions.
- Prohibited subjective partial-credit values for ordinary distractors; partial credit now requires explicit reasoning components and a rubric.
- Added independent numerical verification, operational-feasibility checks, and a required distinction between bounded testing and wider scaling.
- Added an adversarial answer-key check: reviewers must make the strongest reasonable case for every option before approving the key.

### Version 1.9 - 23 September 2026

- Added a fail-closed Thai completeness rule after mixed English/Thai and corrupted substitutions were found in generated Prompt design items.
- Required completeness QA across the whole item rather than treating individually translated fields as sufficient.
- Repaired the shared Thai wording for all eight core/general D2 Prompt design applied drafts, including scenarios, prompts, choices, and explanations.

### Version 1.8 - 23 September 2026

- Added the concise IT/developer question pattern: brief operational context, scannable embedded evidence, then one direct decision.
- Required exact selection counts and more balanced multi-select answer sets.
- Moved detailed artifact requirements into the canonical Artifact Design and QA Standard.

### Version 1.7 - 23 September 2026

- Added a rule against reusing generic artifacts when a question requires scenario-specific evidence.
- Added explicit evidence-action-communication guidance for written-response prompts.
- Rewrote live Operations item `FUNC-OPS-D6-001` and generated a new realistic, expandable duplicate-charge support-console artifact.

### Version 1.6 - 22 September 2026

- Added neutral-evidence requirements so artifacts do not reveal answers.
- Added localization guidance for currency, units, dates, and market conventions.
- Added guidance for explaining technical terminology after the decision rather than hiding a vocabulary test inside an applied item.
- Added a Thai-localized candidate rewrite for live Marketing item `FUNC-MKT-D3-001` without replacing the live question.

### Version 1.5 - 22 September 2026

- Added guidance for explaining organization-specific titles and approval authority in ordinary language.
- Added an intermediate Sales comparison candidate using a culturally accessible quotation and discount-approval scenario.
- Confirmed that localization must preserve numerical evidence and authority boundaries across languages.

### Version 1.4 - 22 September 2026

- Added a cultural-context standard for Thai users.
- Required culturally neutral, Thai-localized, or intentionally international classification during review.
- Added checks for Western institutional assumptions and unrelated cultural knowledge.
- Clarified that localization may adapt settings and examples but must preserve the assessed construct, evidence, difficulty, and correct answer.

### Version 1.3 - 22 September 2026

- Added specific-evidence wording for multi-part questions.
- Added guidance for replacing abstract requirements with concrete examples and quantities.
- Added an intermediate Marketing comparison candidate that tests semantic retrieval and responsible use of limited pilot evidence.

### Version 1.2 - 22 September 2026

- Added guidance for connecting audience details to a meaningful requirement or risk.
- Added guidance against making the correct answer a verbatim copy of the scenario evidence.
- Added the second three-version comparison candidate for `NH-CORE-GENERAL-D1-CORE-CONCEPTS-AWARENESS-02`.

### Version 1.1 - 22 September 2026

- Added append-only question-version history and comparative selection guidance.
- Added the requirement-behavior-consequence causal-chain rule.
- Clarified that familiar descriptions such as LLM generation and document-library retrieval are preferable to abstract phrases such as learned patterns.
- Added safeguards against accidentally changing the concept being tested.

### Version 1.0 - 17 September 2026

- Established scenario-first wording, concrete answer choices, concise explanations, artifact relevance, format diversity, and human review before pilot use.
