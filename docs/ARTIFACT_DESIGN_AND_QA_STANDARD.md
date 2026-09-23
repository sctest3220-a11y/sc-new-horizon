# Artifact Design and QA Standard

Status: Approved living standard
Current version: `1.0`
Last updated: 23 September 2026

## Purpose

Artifacts are assessment evidence, not decoration. An artifact should help the user understand a realistic situation, inspect evidence, and demonstrate the competency being measured. If it does not improve answerability or realism, it should not appear.

This is the canonical artifact standard. Question writing follows [Question Rewrite Rules and Versioning](QUESTION_REWRITE_RULES.md), Thai and English equivalence follows [Question Bank Localisation](LOCALISATION.md), and behavioral quality signals follow [Telemetry Tracking and Purpose](TELEMETRY_TRACKING_PURPOSE.md).

## When to use an artifact

Use an artifact only when at least one condition is true:

1. The user must inspect evidence to answer correctly.
2. The artifact resolves context that prose alone would leave ambiguous.
3. The task measures realistic document, interface, media, log, workflow, or data inspection.

Do not use an artifact merely to add variety, visual interest, or apparent difficulty. If the scenario and choices already contain all required evidence, remove the artifact. Do not repeat every artifact fact in the scenario; explain briefly why it should be inspected and let the artifact carry the detailed evidence.

## Placement and interaction

The default assessment sequence is:

1. Scenario context.
2. Embedded artifact evidence.
3. Question prompt.
4. Answer controls.

Do not render an artifact as a detached section above the task. Add a concise `Inspect for` cue that directs attention to the type of evidence without revealing the answer.

Every text-heavy artifact must support:

- an inline view that is readable at the normal question width;
- click or button access to a full-window reader;
- fit-to-window as the initial expanded state;
- optional additional zoom levels;
- keyboard-accessible controls;
- useful alternative text;
- an open-file action when appropriate.

## Relevance and evidence alignment

1. Every visible field must support the scenario, tested decision, realism, or a plausible distractor.
2. The answer key or rubric must cite evidence contained in the artifact.
3. The artifact must represent the exact question, not merely a similar topic.
4. Generate a question-specific artifact when no existing asset accurately represents the required evidence.
5. Do not make users inspect irrelevant detail or search for evidence that does not affect the answer.
6. Keep facts internally consistent across the scenario, artifact, options, feedback, rubric, and explanation.

## Realism

Artifacts should resemble documents and interfaces the target user encounters at work. Suitable formats include emails, support tickets, audit logs, traces, configuration screens, code diffs, test results, dashboards, invoices, policy excerpts, project updates, message threads, workflow builders, and media provenance records.

Names, dates, amounts, reference numbers, statuses, events, permissions, and timestamps must agree. Avoid generic diagrams, decorative mockups, placeholder text, implausible layouts, excessive visual polish, and repeated templates that make unrelated questions feel identical.

For IT and developer questions, prefer concise operational context plus scannable logs, traces, permissions, configurations, code, or test evidence. Put detailed facts in the embedded artifact rather than a long narrative.

## Neutrality and validity

1. Present evidence without marking the correct answer.
2. Do not add labels such as `wrong`, `risk`, `suspicious`, or `correct action` unless they are authentic system output required by the scenario.
3. Avoid arrows, highlights, warning colors, annotations, or captions that teach the answer.
4. Authentic alerts may appear when detecting or interpreting that alert is part of the competency.
5. Realistic noise may appear only when it does not make the item ambiguous or add unrelated cultural knowledge.
6. An artifact must not change the intended competency or make one language version easier.

## Readability

1. Use legible text, sufficient contrast, and a stable aspect ratio.
2. Check the artifact at the actual inline width, not only at source resolution.
3. Do not compress long documents into unreadable thumbnails.
4. Split genuinely long evidence into labeled pages, tabs, or steps.
5. Ensure critical evidence remains readable on desktop and mobile or is immediately accessible through the full-window reader.
6. Do not rely on color alone to communicate status.
7. Keep labels and controls from overlapping at supported breakpoints.

## Integration with question design

1. State what type of evidence to inspect without telling the user what conclusion to reach.
2. Ask one clear decision after the artifact unless the item is intentionally multi-part.
3. For multi-select items, state the exact number of choices required.
4. Keep answer choices plausible and grounded in the same evidence.
5. Explain the correct answer by referring to specific artifact evidence.
6. For written responses, identify the dimensions to address, such as evidence, action, and communication, without revealing the conclusion.

## Thai localization

Translate artifact text when the user must read it to answer. Translate relevant labels, document text, status messages, captions, and controls while keeping established technical terms in English where that reflects Thai workplace usage.

English and Thai artifacts must contain equivalent evidence. Localization may adapt names, dates, currency, units, and workplace context, but it must not add clues, remove risks, change difficulty, or alter the correct answer. Do not show a Thai question with an English-only artifact when understanding the artifact text is essential.

## Privacy, safety, and accessibility

1. Use fictional or properly anonymized personal and organizational data.
2. Do not reproduce real credentials, secrets, payment details, medical records, or identifiable customer information.
3. Include meaningful alt text that describes the evidence type without revealing the answer.
4. Ensure expansion and zoom controls work with keyboard navigation.
5. Preserve readable focus states and adequate contrast.
6. Avoid flashing, unnecessary animation, and motion that interferes with inspection.

## Release quality gate

Score each candidate from 1 to 5 on:

- necessity;
- relevance;
- realism;
- readability at inline size;
- readability when expanded;
- evidence-to-answer alignment;
- neutrality;
- internal consistency;
- accessibility;
- English/Thai equivalence, when applicable;
- desktop and mobile presentation.

An artifact is not publishable if any of necessity, relevance, readability, evidence alignment, or neutrality is below 4. A human reviewer must approve replacement of an official scored artifact path.

## Telemetry and review signals

Track artifact display, full-size opens, zoom level, external-file opens, time on question, answer revisions, abandonment, correctness, question-level feedback, and survey ratings. Analyze these signals together; a high zoom rate alone does not prove poor quality.

Nominate an artifact for human review when patterns show repeated unclear or negative comments, high expansion or 2x zoom combined with long response time, poor performance isolated to artifact-backed items, abandonment after artifact display, or inconsistent behavior between English and Thai cohorts.

Agents may analyze evidence and propose `keep`, `revise`, `replace`, or `remove`. They must not silently replace scored artifacts.

## Versioning

Store an artifact version with every answer record. A material visual or evidentiary change creates a new version. Preserve the previous asset, generation brief, question mapping, reviewer decision, and reason for change so historical scores remain explainable.

## Pre-release checklist

- [ ] The artifact is necessary or clearly useful.
- [ ] The question requires or explicitly benefits from its evidence.
- [ ] Scenario, artifact, options, answer key, rubric, and explanation agree.
- [ ] The artifact resembles a credible real-world document or interface.
- [ ] No annotation or styling reveals the answer.
- [ ] Inline text is readable or expansion is immediately obvious.
- [ ] Fit-to-window, zoom, keyboard access, and alt text work.
- [ ] Mobile and desktop layouts have been checked.
- [ ] Thai and English evidence are equivalent when localization is required.
- [ ] Privacy and sensitive-data checks pass.
- [ ] A human reviewer has recorded the release decision.

