# Artifact Design and QA Standard

Status: Approved living standard
Current version: `1.2`
Last updated: 29 September 2026

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
7. When the item assesses AI competency, show the AI-specific evidence required by the decision, such as the model or workflow output, decision rule, omitted inputs, confidence, retrieval boundary, approval state, or tool action. A professional dashboard with an AI label is not sufficient by itself.
8. Include every metric needed to evaluate the claim, including denominators and decision-relevant derived measures. Do not emphasize a headline rate while silently omitting cost, volume, baseline, uncertainty, or comparison evidence needed to interpret it.

## Realism

Artifacts should resemble documents and interfaces the target user encounters at work. Suitable formats include emails, support tickets, audit logs, traces, configuration screens, code diffs, test results, dashboards, invoices, policy excerpts, project updates, message threads, workflow builders, and media provenance records.

Names, dates, amounts, reference numbers, statuses, events, permissions, and timestamps must agree. Avoid generic diagrams, decorative mockups, placeholder text, implausible layouts, excessive visual polish, and repeated templates that make unrelated questions feel identical.

For IT and developer questions, prefer concise operational context plus scannable logs, traces, permissions, configurations, code, or test evidence. Put detailed facts in the embedded artifact rather than a long narrative.

## Generation brief and evidence clarity

Before generation, specify the task objective, intended output, audience or channel when relevant, AI action, and evidence needed for each question. Keep this brief proportionate: do not add campaign fields to unrelated tasks or invent source facts to fill a template.

1. **Connect the objective, output, and evidence.** The reader should understand what the team wants to achieve, what the AI is helping produce, and why the displayed information matters to the decision. For a campaign, identify the message and deliverable, such as one public social-media post with a caption and image.
2. **Make the proposed image support the message.** Show the relevant action or use when it clarifies the objective. For a reusable-bag campaign, a shopper using the bag communicates the intended behavior more directly than an unrelated or decorative product image. Keep the caption, image, asset identifier, and use record consistent.
3. **Use labels that readers can interpret.** Avoid unexplained X/Y axes, coded text labels, or abstract plots when a short text comparison would communicate the evidence more clearly. If a plot is necessary, explain what its points and axes represent and the limits of interpretation; projected embedding coordinates are not ordinary business measures.
4. **Define scores and their limits.** State what is compared, the scale, and what higher or lower values mean. A meaning-match score does not establish factual accuracy, permission, model confidence, or expected campaign performance. Label authored values as illustrative; do not imply they are measured model outputs. Record how any derived values were checked. Arithmetic consistency alone does not validate semantic scores or calibrate a model.
5. **Show the AI process needed to distinguish the choices.** Similarity rankings alone do not establish how they were produced. When numerical representation is tested, a neutral processing record can show text converted to number lists and those lists compared. Reserve the tested mechanism's name and interpretation for feedback. Do not fabricate a processing record and present it as a real system observation.
6. **Show intended use beside permitted use when rights affect the decision.** Include the asset reference, applicable permission, and proposed channel or use. Present these as neutral record fields; do not highlight a mismatch or supply the corrective action. Credit and permission remain distinct.
7. **Include evidence only for claims the item actually tests.** A campaign with no measurable performance claim does not need invented sales, conversion, or reach results. If a performance claim is material, supply the relevant evidence and limitations. Do not silently remove an original decision-relevant requirement; record and review substantive omissions.
8. **Identify newly authored details.** Record fictional objectives, captions, images, scores, metadata, and process displays in the generation brief or review log. Distinguish source facts from proposed additions, and retain the user's decision on material clarifications. Agreement to a review candidate does not substitute for implementation and release QA.

The agreed marketing example and its limitations are recorded in [Rewrite Rule Review Log](QUESTION_REWRITE_RULE_REVIEW_LOG.md#marketing-campaign-artifact---agreed-revision).

## Neutrality and validity

1. Present evidence without marking the correct answer.
2. Do not add labels such as `wrong`, `risk`, `suspicious`, or `correct action` unless they are authentic system output required by the scenario.
3. Avoid arrows, highlights, warning colors, annotations, or captions that teach the answer.
4. Authentic alerts may appear when detecting or interpreting that alert is part of the competency.
5. Realistic noise may appear only when it does not make the item ambiguous or add unrelated cultural knowledge.
6. An artifact must not change the intended competency or make one language version easier.
7. Independently calculate all displayed totals, percentages, rates, ratios, costs, and differences. Record the calculation check during review.
8. Check that the artifact's evidence supports the scope of the proposed action. Evidence suitable for a bounded pilot may not justify automatic execution or full-scale deployment.

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
7. Run the AI necessity test with the artifact hidden and with references to AI removed. If the remaining task is only ordinary domain analysis, add meaningful AI-system evidence or remap the competency.
8. Ensure proposed actions are feasible given the displayed budget, time, traffic, permissions, and data. Clearly distinguish collecting more evidence through a capped test from scaling based on established performance.

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

For each generated revision, retain the exact generation prompt, source or reference asset, output version, fictional additions, numerical checks, visual inspection findings, and pending checks. Inspect the rendered output against the brief, including every decision-relevant label and value; a correct prompt does not guarantee a correct image. Report only checks actually performed. Keep review-candidate agreement separate from approval to replace an official scored asset.

Version 1.2 adds the agreed marketing review lessons: explicit task purpose and deliverable, message-aligned imagery, interpretable comparisons, score limitations, neutral process and permission evidence, and traceable generation QA. Version 1.1's AI-necessity, numerical, and operational-feasibility requirements remain in force.

## Pre-release checklist

- [ ] The artifact is necessary or clearly useful.
- [ ] The question requires or explicitly benefits from its evidence.
- [ ] Scenario, artifact, options, answer key, rubric, and explanation agree.
- [ ] The objective and intended output are clear, with audience or channel included when relevant.
- [ ] Images and captions directly support the task or campaign message.
- [ ] Labels, axes, comparisons, and score meanings are understandable without unexplained codes.
- [ ] Illustrative values are identified, and similarity is not presented as truth or predicted performance.
- [ ] Each question maps to specific evidence without answer-revealing annotations.
- [ ] Newly authored details and material omissions are recorded with the review decision.
- [ ] The saved prompt and rendered output agree on all decision-relevant text and values.
- [ ] The artifact exposes meaningful AI behavior or control evidence when the item claims to assess AI competency.
- [ ] All calculations and derived metrics have been independently recomputed.
- [ ] The evidence supports the scale and consequence of the keyed action.
- [ ] Test, pilot, and scale-up actions are clearly distinguished.
- [ ] The artifact resembles a credible real-world document or interface.
- [ ] No annotation or styling reveals the answer.
- [ ] Inline text is readable or expansion is immediately obvious.
- [ ] Fit-to-window, zoom, keyboard access, and alt text work.
- [ ] Mobile and desktop layouts have been checked.
- [ ] Thai and English evidence are equivalent when localization is required.
- [ ] Privacy and sensitive-data checks pass.
- [ ] A human reviewer has recorded the release decision.
