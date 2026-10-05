# Rewrite Rule Review Log

Status: Living working draft; accumulated October updates authorized for publication on 5 October 2026
Started: 24 September 2026
Last updated: 5 October 2026
Original review baseline: Question Rewrite Rules v1.8
Current approved baseline retained at publication: v2.1
Working refinements: 2.2-draft (previously local 1.9-draft; historical references retain that label)
Target GitHub branch: `kj-dee-branch`

Publication authorization — 5 October 2026: The user explicitly requested pushing the accumulated local changes to this branch, including dated inventory version **2026.10.05 V.0**, saved English reviews, rules, history, QA reports, snapshot tooling and inventory search fixes. This supersedes earlier local-only notes for these changes. Thai synchronization and content-review issues remain pending; future changes still need a new push request. Snapshot JSON uses LF line endings so integrity hashes survive checkout on Windows and Linux.

Latest publication decision: The user explicitly requested summarizing and pushing the accumulated rewrite-rule and English-inventory updates to this branch. This includes the accepted Customer Service wording, earlier inventory refinements, supporting generation files, history and QA reports. Earlier statements that a push was pending are historical. Pending Thai synchronization and unresolved content/scoring issues remain open; publication does not imply scored-release approval. Future changes require a new push request.

## Advanced prompt, output and source review acceptance - 5 October 2026

User instruction: "passed include previous review, update the rewrite rule locally." This records acceptance of the latest D3 Source verification ADVANCED-01 and the preceding D2 Prompt design ADVANCED-01 and -03 and Output refinement ADVANCED-01, -02 and -04 reviewed since the previous inventory update. It does not imply review of skipped IDs. GitHub was verified at `0baa4af100ec3a6b2451713db6ce0af48334a5ce`; the 5 October local refinements were also applied. Original audit and user-facing drafts were read from localhost for each item.

This is a local rules and review-log update. These newly accepted versions have not been written to the English inventory or pushed. Preserve their current draft/audit history until a separate implementation request. All retain one scenario, two questions and two choices per question. No per-part scores were invented. Wording acceptance does not resolve the content issues recorded below or establish scored-release readiness.

### Shared accepted wording

Each item starts with the applicable singular or plural sentence below, followed by its item-specific paragraph and the approval sentence:

- Singular: "The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history."
- Plural: "The customer service team uses AI to draft case resolution responses based on approved service policies and customer case histories."
- Approval: "Refunds and exceptions require approval from the person authorized to approve them."
- Instruction: "Answer both questions. Choose one answer for each."

Shared second questions and choice text, with order specified per checkpoint:

- Refund question: "The AI recommends a refund over the frontline team’s approval limit. What should the team do next?" Approval choice: "Send the exception to the person authorized to approve the refund." Repeat choice: "Issue the refund after the AI repeats its recommendation."
- Pending-case question: "The AI’s draft says the case is resolved, but the case history shows it is still pending. What should the team do next?" Pending choice: "State that the case is still pending and explain the actual next step." Resolved choice: "State that the case is resolved to reassure the customer."
- Timeout question: "The system timed out during an earlier refund attempt, but the refund may already be complete. What should the team do next?" Repeat choice: "Issue another refund because the customer still reports a delay." Check choice: "Check the payment record to confirm the earlier refund’s status before issuing another refund."
- Identity question: "The customer says the identity details in the case history are incorrect. What should the team do next?" Existing-data choice: "Use the existing identity details because they are already in the system." Verify choice: "Follow the established process for verifying and correcting identity details."

Shared explanations: Refunds require the necessary human authority; repeating AI advice does not confer it. Pending cases must not be described as resolved. A timeout does not prove refund failure; confirm payment status before another refund. Stored identity details may be wrong; use the established verification and correction process.

### NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-ADVANCED-01

Opening: plural.

> Teams edit the prompt directly in the live system, but they cannot trace failures to a specific prompt version.

1. Which approach to managing prompts best addresses this problem?
   - A. Test and confirm that the prompt works with the replacement AI model before switching to it.
   - B. Keep a version history of prompts and link each released version to the examples used in its evaluation.
2. Refund question: A approval choice; B repeat choice.

Keys: 1B, 2A.

Explanation: Keeping prompt versions and their evaluation examples supports investigating failures and returning to an earlier version when needed. Testing a prompt with a replacement model addresses a model change, which is not the problem described here. Retain the shared refund explanation.

No artifact needed: version-tracking failure is already stated. Do not invent release logs or claim that version storage alone proves causation.

### NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-ADVANCED-03

Opening: plural.

> The prompt works with one AI model, but the replacement model interprets its instructions for the required data structure differently.

1. Which approach to managing prompts best addresses this problem?
   - A. Make the exception a test case that must still pass after changes before a new version can be released.
   - B. Test and confirm that the prompt works with the replacement AI model before switching to it.
2. Pending-case question: A pending choice; B resolved choice.

Keys: 1B, 2A.

Explanation: A prompt that works with one model may behave differently with another. Test the prompt with the replacement model and confirm that the combination meets requirements before switching. Retain the shared pending-case explanation.

No artifact needed: the question asks about a control, not inspection of model outputs. Original issue retained: "the exception" is undefined, and its regression test could form part of B's broader evaluation. Schema means required data structure; no field names or format examples were invented.

### NH-FUNCTION-CUSTOMERSERVICE-D2-OUTPUT-REFINEMENT-ADVANCED-01

Opening: plural.

> The average ratings for the AI’s responses are improving, but responses with serious factual errors still pass the quality checks.

1. Which quality process should the team introduce first?
   - A. Score the same sample of responses again using both versions of the scoring criteria.
   - B. Set rules that block responses with serious errors from being released, regardless of the average ratings.
2. Refund question: A approval choice; B repeat choice.

Keys: 1B, 2A.

Explanation: Improving average ratings can hide serious errors. Separate rules should prevent responses with those errors from being released, even when the average ratings are high. Retain the shared refund explanation.

No artifact needed: selecting the quality control requires no actual scores. Original issue retained: two rubric versions are not established in the scenario. The scenario's factual errors and the original control's broader critical defects remain distinct.

### NH-FUNCTION-CUSTOMERSERVICE-D2-OUTPUT-REFINEMENT-ADVANCED-02

Opening: plural.

> Staff repeatedly rewrite the AI’s responses but do not categorize the problems that keep occurring.

1. Which quality process should the team introduce first?
   - A. Record problems by type and link each type to fixes in the prompt or source information.
   - B. Set rules that block responses with serious errors from being released, regardless of the average ratings.
2. Timeout question: A repeat choice; B check choice.

Keys: 1A, 2B.

Explanation: Recording recurring problems by type helps identify changes needed in prompts or source information and supports prevention instead of repeated manual rewriting. Blocking serious errors is useful but does not address the missing categorization and feedback process. Retain the shared timeout explanation.

No artifact needed: the workflow gap is explicit. Do not invent defect categories or guarantee that categorization alone prevents recurrence.

### NH-FUNCTION-CUSTOMERSERVICE-D2-OUTPUT-REFINEMENT-ADVANCED-04

Opening: singular.

> The response keeps going through revisions even after it meets all requirements.

1. Which quality process should the team introduce first?
   - A. Stop revising once clear acceptance criteria are met, and set a limit on revision effort.
   - B. Set rules that block responses with serious errors from being released, regardless of the average ratings.
2. Identity question: A existing-data choice; B verify choice.

Keys: 1A, 2B.

Explanation: Further revisions do not necessarily improve a response that already meets requirements. Clear acceptance criteria and a revision-effort limit prevent unnecessary rewriting. Blocking serious errors addresses a different quality problem. Retain the shared identity explanation.

No artifact needed: further source excerpts would not affect the decision. Keep the original revision budget general; do not invent a specific cap or treat meeting the cap as approval to release an unacceptable response. The source does not identify who initiates each rewrite, so the scenario does not invent autonomous AI or a human initiator.

### NH-FUNCTION-CUSTOMERSERVICE-D3-SOURCE-VERIFICATION-ADVANCED-01

Opening: singular.

> The AI combines information from sources with different effective dates in its response but does not record those dates.

1. Which rule for checking evidence would best prevent this problem from recurring?
   - A. Check whether the source passage supports each important statement.
   - B. Record source versions and resolve conflicts about when the information applies before combining it.
2. Refund question: A repeat choice; B approval choice.

Keys: 1B, 2B.

Explanation: Track source versions and establish which information applies to the relevant period before combining it. Checking passage support is useful but does not by itself resolve conflicting effective dates. Retain the shared refund explanation.

No artifact needed: the question asks which control addresses the stated problem, rather than requiring comparison of actual source dates. Preserve effective dates rather than replacing them with publication dates, and do not assume the newest source always applies.

### Consolidated challenges and next implementation boundary

These plain-language changes retain technical control scope, separate testing from enforcement, and keep human responsibility and approval explicit. They do not resolve undefined distractor referents or prove that alternatives are mutually exclusive. Preserve the original audit, shared option order, key and scoring on any later inventory update. Apply the user's hard meaning-preservation rule to every individual field, not merely the overall story. Artifact metadata is a recommendation; the canonical necessity test controls generation. No new inventory, Thai translation, production or GitHub changes were made by this rule update.

## English review implementation - 5 October 2026

The user requested local rule, English-inventory and related-document updates after passing Capability limits ADVANCED-03. This implements the latest pending conversation versions for D4 AWARENESS-04; D6 ROLE-CLARITY AWARENESS-01, -02 and -03; D1 CAPABILITY-LIMITS ADVANCED-01, -02 and -03; FUNC-GEN-D5-001; FUNC-CS-D5-003; FUNC-EXP-GEN-D5-001; and DEPTH-EXP-D5-VALUE-079. Earlier checkpoints remain intact. Source branch last verified at `0baa4af100ec3a6b2451713db6ce0af48334a5ce` on 5 October. No push is authorized.

Selection for local implementation is not a claim that each item received an individual full-item pass. Explicit acceptance includes the final fields/inputs distinction in ADVANCED-03 and the forecast-accuracy clarification in DEPTH-EXP-D5-VALUE-079. D6-01, D6-03, ADVANCED-01 and the cross-functional pilot retain the user's specific wording corrections. The repeated ADVANCED-02 request was flagged as a duplicate and reuses its baseline.

Full reproducible checkpoints are in `inventory/english-wording-review-october.mjs`, applied through `inventory/english-wording-checkpoints.mjs`. Before/after drafts and original artifact plans are retained in `exports/review-inventory/wording-refinement-history.json`. Original audit fields, template interactions, option order, keys and scores are preserved. Live-item edits affect the admin review copy, not the production assessment.

The critical lesson: retain the scenario's narrower required data fields and the option's broader critical inputs. Missing fields are not blank fields. The selected choice is: "Test whether the AI avoids answering when critical inputs are missing, and block decisions that depend on those inputs."

Recorded content decisions: D6-01 changes a released output causing an error to a sent response containing a mistake at the user's direction; the sales pilot adds that accuracy has not been checked after explicit discussion and a pass; the cross-functional pilot uses user-requested monthly-report summaries instead of general close commentary; Customer Service metrics use user-requested escalation/complaint counts instead of escalation/dispute rates. These are not universal synonym substitutions. Undefined premium was omitted from the reviewed cross-functional candidate.

Unresolved challenges remain attached to each item: unspecified exception types, complementary safeguards, weak distractors, pilot selection versus execution, initial funding versus expansion, AI-specific relevance, and incomplete per-part scoring. No artifact is needed for these wordings. Thai remains at its earlier revision pending synchronization, including missing explanations where the old live draft had none; it is not an approved translation of the new English.

Local verification: all 23 inventory tests passed. A before/after comparison confirmed that only the selected October checkpoints changed, original audit fields and prior Thai text remained identical, and all selected English contexts, prompts, choices, explanations and artifact decisions were served correctly by localhost. Generated admin assets were rebuilt. Production source and scoring were not edited. This verifies implementation, not resolution of the content challenges above or Thai semantic equivalence.

## Familiar professional vocabulary across roles - 2 October 2026

Source: the user's Customer Service terminology feedback on `FUNC-CS-D5-003` and subsequent request to apply this lesson to the rewrite rules for all assessed roles. The user authorized a local rule update. No inventory implementation or push was requested in this instruction.

Lesson: choose familiar words for the intended role and task, rather than using one generic vocabulary across the platform. Recognizable professional terms should support clear, connected sentences. Extend the principle to other roles and both languages, but do not assume that the Customer Service examples establish terminology for HR, Finance, Sales, Marketing, Operations or IT.

### English Customer Service terminology decisions

- **First-contact resolution rate:** user-preferred metric name. Keep reopened-ticket rate as a distinct companion measure.
- **Service Level Agreement (SLA) breach rate:** the user requested SLA terminology; the candidate names breach rate because the agreement itself is not a metric.
- **Number of escalated cases and number of customer complaints:** user-requested candidate wording. The original choice used escalation and dispute rates. Changing a rate to a count and disputes to broader complaints changes the measure's meaning. These differences were disclosed in the complete candidate; preserve them as content decisions rather than treating the terms as synonyms. Counts should be interpreted with total case volume when comparing performance.
- **Complete the evidence check:** user-preferred action phrase. The candidate retains "How often staff edit AI drafts and complete the evidence check" so the choice still describes measurement, not merely an instruction.
- **Evaluate:** user-preferred verb for judging whether AI-assisted replies improve the team's work. It is not interchangeable with access when discussing permissions or retrieving records.

The latest complete candidate retains the five-choice multi-select format and A/B/C/D answer key. This terminology rule update does not save that candidate to the English inventory, change its scoring, approve it for release, or resolve the existing guessing clue in option E. No artifact is needed for the candidate because the scenario and options supply the necessary information. Thai equivalents have not been selected in this terminology review.

### Challenge checks

- Would the intended role recognize the term without unnecessary jargon or paraphrasing?
- Is this a wording improvement, or does it change the metric, scope, units, authority or tested concept?
- Are role terms consistent across the scenario, all choices, explanation and artifact, without polishing only the correct answer?
- Are abbreviations understandable without revealing the tested answer?
- Does the other language preserve the meaning and difficulty using natural professional vocabulary?
- Is the term supported by a recorded user decision, glossary or relevant source, rather than an unsupported claim that all workplaces use it?

Saved in the provisional v2.2-draft rules. Remains local until the user requests a push.

## Data privacy readability and flow - 2 October 2026

The user requested an explicit readability and text-flow rule update and implementation of the reviewed English inventory wording. This local update covers the latest D4 Data Privacy AWARENESS-01, -02 and -03 versions. AWARENESS-01 uses the reviewed short deletion-date sentence; AWARENESS-02 was explicitly passed; AWARENESS-03 was agreed after the full revised item was shown. Each retains the existing two-part, two-choice template, option order and keys. No artifact is needed. Original audit wording and prior draft versions remain preserved. Thai remains at its previous revision pending synchronization. No new push was requested.

The key lesson is not merely to shorten text: improve readability and enhance its flow while retaining the evidence. State what was removed and what remains before explaining their combined effect. Keep "uncommon" and the exact event date; do not simplify away the identification evidence or join independent sentences with a comma. Keep the approved deletion date and temporary-copy scope. Read the whole item together so choices and explanation use the same terms.

### NH-FUNCTION-CUSTOMERSERVICE-D4-DATA-PRIVACY-AWARENESS-01

> The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.
>
> A temporary copy of these documents is still available after its approved deletion date.
>
> Refunds and exceptions require approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. What privacy issue does this situation show?
   - A. More personal information was provided than the task needed.
   - B. The temporary copy was kept longer than allowed.
2. The AI recommends a refund over the frontline team’s approval limit. What should the team do next?
   - A. Send the exception to the person authorized to approve the refund.
   - B. Issue the refund after the AI repeats its recommendation.

Keys: 1B, 2A.

Explanation: The temporary copy remains available after its approved deletion date. The issue is how long the information was kept, not whether too much information was provided. The refund requires approval from someone with the necessary authority; repeating an AI recommendation does not give the frontline team permission to issue it.

Artifact: not required.

Review note: The privacy decision is answerable without AI; AI-specific relevance remains a content-review issue.

### NH-FUNCTION-CUSTOMERSERVICE-D4-DATA-PRIVACY-AWARENESS-02

> The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.
>
> While preparing the response, the AI retrieves another team’s restricted records that the customer service team does not have permission to access.

Answer both questions. Choose one answer for each.

1. What privacy issue does this situation show?
   - A. A copy of the records was kept longer than allowed.
   - B. The AI retrieved records outside the team’s access permissions.
2. The system timed out during an earlier refund attempt, but the refund may already be complete. What should the team do next?
   - A. Issue another refund because the customer still reports a delay.
   - B. Check the payment record to confirm the earlier refund’s status before issuing another refund.

Keys: 1B, 2B.

Explanation: The AI’s ability to retrieve records does not mean the customer service team has permission to access them. The issue concerns access permissions, not how long records were kept. A timeout also does not prove that a refund failed, so the team should confirm the earlier refund’s status before issuing another.

Artifact: not required.

Review note: The explicit lack of customer-service access permission clarifies the original key and explanation; the original scenario only described another team’s restricted records.

### NH-FUNCTION-CUSTOMERSERVICE-D4-DATA-PRIVACY-AWARENESS-03

> The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.
>
> Names have been removed from the case history, but an uncommon job title and the exact event date remain. Together, these details can identify the person.

Answer both questions. Choose one answer for each.

1. What privacy issue does this situation show?
   - A. The remaining details can still identify the person.
   - B. More personal information was provided than the task needed.
2. The AI’s draft says the case is resolved, but the case history shows it is still pending. What should the team do next?
   - A. State that the case is still pending and explain the actual next step.
   - B. State that the case is resolved to reassure the customer.

Keys: 1A, 2A.

Explanation: Removing names does not necessarily prevent identification. An uncommon job title combined with an exact event date can still identify the person. The scenario does not establish whether more information was provided than the task needed. The customer response should also reflect the recorded case status and actual next step.

Artifact: not required.

Review note: The privacy decision is answerable without AI; AI-specific relevance remains a content-review issue.

The unrelated approval sentence and generic compensation risk remain omitted from AWARENESS-02 and -03. AWARENESS-01 retains the approval requirement because its second part tests it. AWARENESS-03 places the identifying details in the case history as the reviewed scenario connection; no actual job title, person or event date was invented. Per-part scoring remains undefined; wording acceptance does not establish assessment readiness.

## Review agreement

Continue reviewing the questions selected by the user without a fixed review target or progress tally. Earlier rule updates were pushed as `83100d8` and `66d7013`. The user has clarified the ongoing workflow: save accumulated refinements locally and publish to `kj-dee-branch` only when they explicitly say "push" or otherwise directly request publication. Their current push request authorizes the accumulated updates, not automatic publication of future refinements. Check the IDs below and conversation history for duplicates before rewriting, and reuse the reviewed baseline. Retain question-specific evidence and unresolved issues without treating review as final item approval.

For each item, read both the original audit wording and the user-facing rewrite draft, from localhost when requested and available. Preserve the selected user-facing template, question count, choices, and answer order. Show the complete proposed item with the answer key, explanation, and remaining concerns. Include scoring only if defined for that format; do not carry combined-choice scoring into a two-part template. Preserve original meaning and distinguish wording cleanup from substantive changes. Reuse agreed wording; identify proposed changes explicitly. Update local rule notes as feedback emerges. Do not update question-bank data or localhost question content unless separately requested.

## Inventory-wide local application - 1 October 2026

The user explicitly requested applying the rules across the entire English/Thai review inventory, replacing the initial assumption that only the recent Core Concepts items would be updated. This authorizes local inventory changes, not publication or promotion to the scored assessment bank.

The local pass applies the reviewed Core Concepts wording and conservative bilingual wording changes wherever the source supports them. It updates actor names, distinguishes fixed-rule automation from established AI, preserves conditional triggers and privacy scope, and keeps service-report terminology consistent. Existing selected wording is retained. The original audit records, selected interactions, option order, answer keys and scores remain the comparison baseline.

Artifact briefs now request neutral evidence instead of highlighted errors or invented risks. The self-contained Core Concepts awareness scenarios do not need separate artifacts. Other automatically assigned artifact types remain candidates requiring question-specific review; this pass does not claim to have generated or approved images.

`exports/review-inventory/wording-refinement-history.json` preserves the previous drafts and artifact plans. `wording-refinement-qa.json` records per-item changes and unresolved issues, including format-label conflicts, undefined choice references and incomplete scoring specifications. Existing live-bank review copies are assessed without replacing production wording or assets. Thai remains a draft pending linguistic review. Earlier checkpoint notes below describe their status at the time; the local inventory changes are now authorized by this later request. No GitHub push has been requested for this pass.

## Customer service Prompt Design AWARENESS-01 - accepted English

ID: `NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-AWARENESS-01`. The user accepted the complete revised item and then explicitly requested updating the local rewrite rule and English inventory. The selected two-part template, two choices per part, option order and B/B key remain unchanged. The general compensation risk is omitted; the tested refund-approval requirement is retained. No artifact is needed because the text supplies all necessary evidence. Per-part scoring remains undefined; wording acceptance does not approve a scoring model.

> The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.
>
> The prompt asks the AI to follow a specific record format, but it does not provide the field names or an example.
>
> Refunds and exceptions require approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. Which missing prompt element does this example show?
   - A. A clear description of the task and expected result.
   - B. A clear structure for the AI’s response.
2. The AI recommends a refund over the frontline team’s approval limit. What should the team do next?
   - A. Issue the refund after the AI repeats its recommendation.
   - B. Send the exception to the person authorized to approve the refund.

Explanation: Asking for a specific format does not tell the AI what that format looks like. The prompt should provide the field names or an example. The refund also requires approval from someone with the necessary authority; repeating an AI recommendation does not give the frontline team permission to issue it.

English wording is stored in `inventory/english-wording-checkpoints.mjs` for reproducible application. Original audit wording and prior revisions are preserved. Thai remains at its previous revision pending synchronization. These changes are local; no push was requested. Prompt Design AWARENESS-02 is the next chat proposal and is not approved for inventory replacement by this request.

Recent conversation evidence also supports the action-first, old-version wording for `NH-FUNCTION-CUSTOMERSERVICE-D1-CAPABILITY-LIMITS-AWARENESS-03`. The user accepted the full rewrite of `NH-FUNCTION-CUSTOMERSERVICE-D1-CAPABILITY-LIMITS-AWARENESS-04`, with its unspecified estimate distractor still an open content issue. These are prior individual reviews and must be flagged as duplicates if requested again.

## Customer service Prompt Design AWARENESS-02 - accepted conversation wording

ID: `NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-AWARENESS-02`. The user marked the complete revised item "pass." Retain the two-part, two-choice format and A/B key. The accepted second paragraph is:

> The prompt provides the task instructions and response format, but it does not include the background information needed to generate an answer.

The first paragraph states that the team uses AI to draft a case resolution response that must follow approved service policies and reflect the customer's case history. The first question contrasts the evidence and case details needed for the response (A) with the rule or limit applying to the decision (B). The second question states that the system timed out during an earlier refund attempt, but the refund may already be complete. Its choices are issuing another refund because the customer still reports a delay (A), or checking the payment record to confirm the earlier refund's status before another refund (B).

Accepted explanation: Task instructions and a response format do not replace the background information the AI needs to answer. A timeout does not prove that a refund failed. The team should confirm the earlier refund's status before issuing another, rather than treating the customer's reported delay as proof that no refund occurred. No artifact is needed. The generic refund-approval sentence is omitted because these parts test missing facts and payment-status verification. This is an accepted conversation checkpoint, not an implemented inventory update. The earlier note calling it the next proposal records its status before this acceptance.

## Customer service Prompt Design AWARENESS-03 - accepted conversation wording

ID: `NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-AWARENESS-03`. The user marked the complete proposed rewrite "pass" and requested updating the rewrite rule locally. Preserve this wording on future requests and flag the ID as previously reviewed. The selected template remains one scenario, two questions and two choices each, with the original B/B part keys.

> The customer service team wants to use AI to draft a case resolution response.
>
> The team provides approved service policies and the customer's case history, but the prompt only says, "Help with this." It does not specify what the AI should generate.

Answer both questions. Choose one answer for each.

1. Which missing prompt element is most directly shown here?
   - A. The rule or limit that applies to the decision.
   - B. A clear description of the task and expected result.
2. The AI's draft says the case is resolved, but the case history shows it is still pending. What should the team do next?
   - A. State that the case is resolved to reassure the customer.
   - B. State that the case is still pending and explain the actual next step.

Explanation: Providing policies and case history gives the AI source information, but "Help with this" does not explain what to do with it or what to generate. The team should specify the task and expected result. The customer response should also reflect the recorded case status and actual next step.

No artifact is needed because the prompt quote and case-status information provide the required evidence. The unrelated refund-approval sentence and general compensation risk are omitted. Choice 1A remains broad: the quoted prompt does not explicitly state constraints either. B is the intended best answer because the described gap concerns the task and expected output. Preserve this challenge despite acceptance; do not invent additional prompt instructions to make A impossible. Per-part scoring remains undefined.

This request updates the local rules and review log only. The accepted AWARENESS-02 and AWARENESS-03 text is not applied to the English or Thai inventory, localhost content, or production bank. No GitHub push is authorized by this request.

## Customer service review recap and local implementation - 1 October 2026

The user requested a recap grouped by the D1–D6 code, lessons from the feedback, and local updates to the rewrite rules and English inventory. This authorizes applying the latest reviewed Customer Service wording below, including the accepted Source Verification AWARENESS-03 revision. It supersedes earlier notes that these particular chat candidates were not yet applied. Publishing remains pending an explicit “push.” Original audit records, selected formats, option order, keys and scores are preserved. Thai drafts retain their previous revisions and are marked pending synchronization. No artifact is needed for these items; their text supplies the required evidence.

| Domain and competency | Reviewed Customer Service IDs (suffix after NH-FUNCTION-CUSTOMERSERVICE-) | Focus |
| --- | --- | --- |
| D1 — Capability limits | D1-CAPABILITY-LIMITS-AWARENESS-03; D1-CAPABILITY-LIMITS-AWARENESS-04 | Quoting an outdated procedure accurately; describing a file unavailable to the AI; truthful case status and identity verification. |
| D2 — Prompt design | D2-PROMPT-DESIGN-AWARENESS-01; D2-PROMPT-DESIGN-AWARENESS-02; D2-PROMPT-DESIGN-AWARENESS-03 | Missing response structure; missing background information; missing task and expected output. |
| D3 — Source verification | D3-SOURCE-VERIFICATION-AWARENESS-01; D3-SOURCE-VERIFICATION-AWARENESS-02; D3-SOURCE-VERIFICATION-AWARENESS-03 | Missing source/author; a working link whose text does not support the statement; articles repeating one original source. |
| D4 | No new individual review in this Customer Service sequence. | — |
| D5 | No new individual review in this Customer Service sequence. | — |
| D6 | No new individual review in this Customer Service sequence. | — |

Earlier same-day D1 Core Concepts AWARENESS-02, -03 and -04 wording refinements are recorded in their existing section below and were already applied by the earlier inventory update. Their individual approval distinctions remain as recorded there; this recap does not relabel every earlier proposal as a passed item.

Lessons: make the AI action explicit; use natural ordinary words; distinguish the team's goal from actual prompt instructions; show what the prompt provides and omits; use one term for the same statement; preserve uncertainty and evidence boundaries; align all choices after scenario edits without creating clues; retain reviewed phrasing and unresolved content issues. Do not report question-count milestones or interpret publication as assessment validation.

### NH-FUNCTION-CUSTOMERSERVICE-D1-CAPABILITY-LIMITS-AWARENESS-03

> The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.
>
> The AI uses an old version of the procedure to draft the customer response. It quotes that version correctly, even though a new version is already in effect.

Answer both questions. Choose one answer for each.

1. What limitation does the AI’s use of this procedure show?
   - A. The AI may use information that is out of date.
   - B. The AI cannot access the evidence it refers to.
2. The AI’s draft says the case is resolved, but the case history shows it is still pending. What should the team do next?
   - A. State that the case is still pending and explain the actual next step.
   - B. State that the case is resolved to reassure the customer.

Keys: 1A, 2A.

Explanation: The AI quotes the old procedure correctly, but that version is no longer current. This shows the risk of using outdated information, rather than an inability to access evidence. The customer response should state the recorded case status and explain the actual next step.

Artifact: not required.

### NH-FUNCTION-CUSTOMERSERVICE-D1-CAPABILITY-LIMITS-AWARENESS-04

> The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.
>
> In its draft, the AI describes the contents of a file that was never attached or made available to it.

Answer both questions. Choose one answer for each.

1. What limitation does the AI’s response show?
   - A. The AI cannot access the evidence it refers to.
   - B. The available information does not support a consistent estimate.
2. The customer says the identity details in the case history are incorrect. What should the team do next?
   - A. Use the existing identity details because they are already in the system.
   - B. Follow the established process for verifying and correcting identity details.

Keys: 1A, 2B.

Explanation: The AI cannot verify a file’s contents without access to it. Describing those contents does not establish that the AI has seen the file. The team should also follow the established verification and correction process when the customer disputes their identity details; information is not necessarily correct simply because it is stored in the system.

Artifact: not required.

Remaining review issues: Part 1B does not specify what is estimated, and the scenario contains no estimate. Preserve the accepted wording pending a separate distractor revision.

### NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-AWARENESS-01

> The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.
>
> The prompt asks the AI to follow a specific record format, but it does not provide the field names or an example.
>
> Refunds and exceptions require approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. Which missing prompt element does this example show?
   - A. A clear description of the task and expected result.
   - B. A clear structure for the AI’s response.
2. The AI recommends a refund over the frontline team’s approval limit. What should the team do next?
   - A. Issue the refund after the AI repeats its recommendation.
   - B. Send the exception to the person authorized to approve the refund.

Keys: 1B, 2B.

Explanation: Asking for a specific format does not tell the AI what that format looks like. The prompt should provide the field names or an example. The refund also requires approval from someone with the necessary authority; repeating an AI recommendation does not give the frontline team permission to issue it.

Artifact: not required.

### NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-AWARENESS-02

> The customer service team uses AI to draft a case resolution response. The response must follow approved service policies and reflect the customer’s case history.
>
> The prompt provides the task instructions and response format, but it does not include the background information needed to generate an answer.

Answer both questions. Choose one answer for each.

1. Which missing prompt element does this example show?
   - A. The evidence and case details needed for the response.
   - B. The rule or limit that applies to the decision.
2. The system timed out during an earlier refund attempt, but the refund may already be complete. What should the team do next?
   - A. Issue another refund because the customer still reports a delay.
   - B. Check the payment record to confirm the earlier refund’s status before issuing another refund.

Keys: 1A, 2B.

Explanation: Task instructions and a response format do not replace the background information the AI needs to answer. A timeout does not prove that a refund failed. The team should confirm the earlier refund’s status before issuing another, rather than treating the customer’s reported delay as proof that no refund occurred.

Artifact: not required.

### NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-AWARENESS-03

> The customer service team wants to use AI to draft a case resolution response.
>
> The team provides approved service policies and the customer’s case history, but the prompt only says, “Help with this.” It does not specify what the AI should generate.

Answer both questions. Choose one answer for each.

1. Which missing prompt element is most directly shown here?
   - A. The rule or limit that applies to the decision.
   - B. A clear description of the task and expected result.
2. The AI’s draft says the case is resolved, but the case history shows it is still pending. What should the team do next?
   - A. State that the case is resolved to reassure the customer.
   - B. State that the case is still pending and explain the actual next step.

Keys: 1B, 2B.

Explanation: Providing policies and case history gives the AI source information, but “Help with this” does not explain what to do with it or what to generate. The team should specify the task and expected result. The customer response should also reflect the recorded case status and actual next step.

Artifact: not required.

Remaining review issues: Part 1A is broad: the quoted prompt also does not explicitly state constraints. B is the intended most direct answer; wording acceptance does not resolve this overlap.

### NH-FUNCTION-CUSTOMERSERVICE-D3-SOURCE-VERIFICATION-AWARENESS-01

> The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.
>
> The AI’s draft response includes an important statement, but it does not specify the source or identify the author.
>
> Refunds and exceptions require approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. What evidence issue does the AI’s draft show?
   - A. The cited source does not support the statement.
   - B. The statement has no supporting evidence that can be traced to a source.
2. The AI recommends a refund over the frontline team’s approval limit. What should the team do next?
   - A. Send the exception to the person authorized to approve the refund.
   - B. Issue the refund after the AI repeats its recommendation.

Keys: 1B, 2A.

Explanation: The draft provides no source or author that the team can check. This differs from citing a source that does not support the statement, and it does not prove the statement is false. The refund requires approval from someone with the necessary authority; repeating an AI recommendation does not give the frontline team permission to issue it.

Artifact: not required.

### NH-FUNCTION-CUSTOMERSERVICE-D3-SOURCE-VERIFICATION-AWARENESS-02

> The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.
>
> The AI’s draft provides a source link for a statement. The link opens successfully, but the text on the linked page is about something else.

Answer both questions. Choose one answer for each.

1. What evidence issue does the AI’s draft show?
   - A. The source does not provide evidence that supports the statement.
   - B. The sources do not provide independent evidence that confirms the statement.
2. The system timed out during an earlier refund attempt, but the refund may already be complete. What should the team do next?
   - A. Check the payment record to confirm the earlier refund’s status before issuing another refund.
   - B. Issue another refund because the customer still reports a delay.

Keys: 1A, 2A.

Explanation: A working link only shows that the source can be opened. The team must also check whether its content supports the statement in the AI’s draft. A timeout does not prove that a refund failed, so the team should confirm the earlier refund’s status before issuing another.

Artifact: not required.

Remaining review issues: Part 1B refers to multiple sources, while the scenario describes one citation. Its original meaning is retained, but it remains a weak distractor.

### NH-FUNCTION-CUSTOMERSERVICE-D3-SOURCE-VERIFICATION-AWARENESS-03

> The customer service team uses AI to draft a case resolution response. The response must follow approved service policies and reflect the customer’s case history.
>
> The AI’s draft uses three articles that repeat information from the same press release, with no other supporting evidence.

Answer both questions. Choose one answer for each.

1. What evidence issue does the AI’s draft show?
   - A. The sources do not provide evidence that supports the statement.
   - B. The sources do not provide independent evidence that confirms the statement.
2. The AI’s draft says the case is resolved, but the case history shows it is still pending. What should the team do next?
   - A. State that the case is resolved to reassure the customer.
   - B. State that the case is still pending and explain the actual next step.

Keys: 1B, 2B.

Explanation: The three articles rely on one original source. Repeating the same press release does not provide separate confirmation of the statement. This does not necessarily mean the statement is false or unsupported by the cited material. The customer response should also reflect the recorded case status and actual next step.

Artifact: not required.

Remaining review issues: The accepted scenario does not specify the statement referenced by the choices. Preserve the accepted text; adding a concrete statement would need separate content review.

General approval requirements are retained where refund authority is tested and omitted from unrelated items. Generic compensation risks are omitted where they do not help distinguish the choices. Per-part scoring remains undefined in these drafts. Wording acceptance is not a claim of benchmark readiness.

## Evidence from reviewed questions

| Question ID | Feedback and rule lesson | Remaining challenge |
| --- | --- | --- |
| NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-APPLIED-01 | A broader goal need not come first. The version-comparison task and refund approval boundary directly support the choices. Avoid treating possible duplicate compensation or denied support as an established recurring problem. Original scoring: A = 100; B/C/D = 0. | Missing-information distractors do not address the observed summarization failure. Improving them substantively needs a separate revision. |
| NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-APPLIED-02 | Place the duplicate-refund consequence beside the uncertain payment status. Preserve both audience-aware prompt repair and payment verification. Original scoring: B = 100; A/C/D = 0. | Version-comparison distractors are weak. Audit single-choice scoring, a suggested multi-select format, and the two-part user-facing draft are not interchangeable without a scoring decision. |
| NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-APPLIED-03 | Use "case history" consistently. User prefers "The draft response includes made-up details where information was left blank"; clarify the location as "in the case history." Use "assumed" and direct status/action wording consistently across shared answer components. Original scoring: C = 100; A/B/D = 0. | "Validate every required field" may imply factual validation, making the distractor ambiguous. Reporting completion "to reassure" is easy to reject. Prompt instructions reduce fabrication risk but cannot guarantee compliance. |
| NH-FUNCTION-CUSTOMERSERVICE-D3-SOURCE-VERIFICATION-APPLIED-01 | Preserve the two-part user-facing format. Use "policy exception," "over" for the refund limit, and "the person authorized to approve" without inventing a manager role. User-facing keys: 1B, 2B. Repeated requests for this ID are flagged as duplicates. | Choice 1A has undefined interpretations and overlaps source checking. Earlier combined-choice rewrites were a format mistake, not the current template. |
| NH-FUNCTION-CUSTOMERSERVICE-D3-SOURCE-VERIFICATION-APPLIED-02 | Connect refund details to the AI task. User agreed: "The AI is drafting a response about a delayed refund. An earlier refund attempt timed out, but the refund may already be complete." Retain "conflicting information" and the reviewed questions/choices. User-facing keys: 1B, 2A. | Choice 1A assumes a missing exception not established in the scenario. "Still processing" would change the original completed-payment uncertainty. |
| NH-FUNCTION-PEOPLE-D3-SOURCE-VERIFICATION-APPLIED-01 | Simplify anonymized records as "names and personal information removed." Connect the omitted exception to its consequence in the same sentence where clear. Preserve the requirement for a named authorized human. User-facing keys: 1B, 2B. | Choice 1A again has undefined interpretations and overlaps the intended source check. Avoid "whole meaning" without evidence. Latest HR wording is an assistant refinement of user feedback, not separately confirmed final wording. |
| NH-FUNCTION-CUSTOMERSERVICE-D1-CAPABILITY-LIMITS-AWARENESS-01 | User agreed to specify "estimate the refund amount" and retained the complete candidate. Use "the team is unsure which amount to use." Keys: 1B, 2B. | The original did not specify the estimate's object. Record refund amount as a user-agreed clarification, not an original fact. Do not infer which suggested amount is correct or how many exceed the approval limit. |
| NH-FUNCTION-CUSTOMERSERVICE-D1-CAPABILITY-LIMITS-AWARENESS-02 | User agreed to "claims to use information from a record" and requested the full item again. Introduce the record before "that record" and retain named sources. Keys: 1B, 2A. | The source originally named a record; reliance on its information is an agreed clarification. A record not found is not proven fabricated, and an access problem is not established. |
| NH-FUNCTION-PEOPLE-D2-PROMPT-DESIGN-AWARENESS-01 | User agreed to "The AI generates a recommendation in its draft that could affect an employment decision." Preserve one scenario, two questions, two choices each; keys 1A and 2B. | "Help with this" leaves both the task and constraints unstated. The task/output instruction is the intended most direct answer, but the competing omission in 1B remains flagged. |

## Finance and HR follow-up - publication authorized

The user explicitly requested publication of the finance wording and HR qualifications refinement below after reviewing the local update. This follow-up builds on `cd992fc`. Future refinements still require another explicit push request, and no question-bank implementation is implied by these review checkpoints.

## HR qualifications - user-preferred wording checkpoint

Question: `NH-FUNCTION-PEOPLE-D2-PROMPT-DESIGN-AWARENESS-02`

The user clarified that "employee qualifications" means criteria or conditions an employee must meet and explicitly preferred that wording. The original audit referred to a single crucial eligibility rule. Preserve the agreed phrasing, but record it as a clarification rather than an exact lexical equivalent. The particular entitlement or qualification criteria remain unspecified; no benefit or role was invented.

> An HR team uses AI to draft a response to an employee using approved HR procedures and case records with names and personal information removed.
>
> The prompt clearly states what kind of answer the AI should generate, but it does not specify the crucial conditions regarding employee qualifications.
>
> To answer the employee's question, the AI needs the relevant part of the policy and only the necessary case details, rather than the employee's full history. Employment decisions must be made by a named person with the authority to make them.

Answer both questions. Choose one answer for each.

1. What important instruction is missing from the team's prompt?
   - A. What task the AI should complete and what it should produce.
   - B. What rule or limit the AI should follow when answering.
2. What information should the HR team provide to answer the employee's question?
   - A. Provide the employee's full history to give the AI more background.
   - B. Provide the relevant part of the policy and only the necessary case details.

Keys: 1B and 2B. Explanation: the task and expected response are already clear; the crucial conditions regarding employee qualifications are missing. Provide the relevant policy and necessary case details rather than the employee's full history. The user requested the complete item with this preferred sentence. No scoring or question-bank content was changed.

## Finance conversation limit - agreed complete wording

Question: `NH-FUNCTION-FINANCE-D1-AI-SYSTEMS-AWARENESS-01`

> A finance team uses AI to recommend accounting adjustments using approved ledger extracts and reconciled invoice records.
>
> When the conversation gets too long, the AI no longer sees some earlier instructions.
>
> The AI generates a recommendation that would create a journal entry. However, the AI is only authorized to give advice. It cannot release payments or post journal entries.

Answer both questions. Choose one answer for each.

1. What causes the earlier instruction to become unavailable to the AI?
   - A. Using an approved connection to access another system.
   - B. Reaching the limit on how much conversation the AI can use at one time.
2. What should the finance team do with the proposed journal entry?
   - A. Send the proposed entry to the person authorized to approve it.
   - B. Let the AI post the entry automatically once the totals balance.

Keys: 1B and 2A. Explanation: the AI can use only a limited amount of information at one time, called its context window. When a conversation exceeds that limit, earlier instructions may no longer be available. The proposed entry must go to the authorized finance approver; balanced totals do not grant AI permission to change the ledger.

The user agreed to the full candidate above. Preserve the selected two-part format and answer order. "No longer sees" describes unavailable current input, not deliberate deletion or loss of the stored conversation. Keep "context limit" out of the scenario because it would name the mechanism question 1 asks the reader to identify; explain it in the feedback instead. "Can no longer see" is grammatically valid, but the user prefers the more direct "no longer sees." No per-part scoring was assigned, and no localhost question was changed.

## HR prompt design - agreed action wording and full candidate shown

Question: `NH-FUNCTION-PEOPLE-D2-PROMPT-DESIGN-AWARENESS-01`

> An HR team wants to use AI to draft a response to an employee. The team provides approved HR procedures and case records with names and personal information removed.
>
> However, the team's prompt only says "help with this." It does not tell the AI what to do with the information or what response to produce.
>
> The AI generates a recommendation in its draft that could affect an employment decision. Such decisions must be made by a named person with the authority to make them.

Answer both questions. Choose one answer for each.

1. What is the main missing instruction in the team's prompt?
   - A. What task the AI should complete and what it should produce.
   - B. What rule or limit the AI should follow when making a decision.
2. What should the HR team do about the recommendation that could affect an employment decision?
   - A. Let the AI make the final decision after checking the wording.
   - B. Leave the final decision to the person authorized to make it for HR.

Original keys: 1A and 2B. Explanation: providing source information does not define the task or expected output. An employment decision must remain with the authorized person; checking wording does not authorize AI to make that decision. The user agreed to "AI generates" and requested the complete item with that wording. The original ambiguity in question 1 remains open: rules and limits are also absent from "help with this." No per-part scoring was invented, and the candidate has not been applied to the question bank.

## Refund estimates - agreed complete wording

Question: `NH-FUNCTION-CUSTOMERSERVICE-D1-CAPABILITY-LIMITS-AWARENESS-01`

> A customer service team uses AI to draft a response using approved service policies and the customer's case history.
>
> The team asks the AI twice to estimate the refund amount using the same incomplete information. The AI suggests a different amount each time, so the team is unsure which amount to use.
>
> The AI also recommends a refund amount over the frontline team's approval limit. Refunds and exceptions need approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. What limitation do the AI's two refund estimates show?
   - A. The information may be out of date.
   - B. There is not enough information to support a consistent refund estimate.
2. What should the team do about the refund amount being over its approval limit?
   - A. Issue the refund if the AI recommends it again.
   - B. Send the refund request to the person authorized to approve that amount.

Keys: 1B and 2B. Explanation: different estimates from incomplete information do not support confidently choosing an amount; the scenario does not establish outdated information. The refund requires the authorized person's approval, which a repeated AI recommendation cannot supply. The user agreed to this complete candidate. No per-part score was assigned and no localhost item was changed.

## Missing source record - agreed wording and full candidate shown

Question: `NH-FUNCTION-CUSTOMERSERVICE-D1-CAPABILITY-LIMITS-AWARENESS-02`

> A customer service team uses AI to draft a response using approved service policies and the customer's case history.
>
> The AI's draft sounds confident and claims to use information from a record, but the team cannot find that record in the approved service policies or the customer's case history.
>
> The AI is drafting a response about a delayed refund. An earlier refund attempt timed out, but the refund may already be complete. Refunds and exceptions need approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. What limitation does the AI's reference to the missing record show?
   - A. The AI cannot access the record it refers to.
   - B. The AI may give made-up information that sounds convincing.
2. What should the team do before issuing another refund?
   - A. Check the payment record to confirm whether the earlier refund is complete.
   - B. Issue another refund because the customer still reports a delay.

Keys: 1B and 2A. Explanation: confidence does not prove that a record exists; the reference may be made up and needs verification. An access problem is not established. A timeout or customer-reported delay does not prove that the earlier refund failed, so check the payment record before issuing another refund. The user explicitly agreed to the revised source sentence and requested this full candidate. No per-part score was assigned and no localhost item was changed.

## Customer service source exception - review history

Question: `NH-FUNCTION-CUSTOMERSERVICE-D3-SOURCE-VERIFICATION-APPLIED-01`

Applied v1.9-draft to both audit wording and user-facing draft. Retain the omitted policy exception, refund approval limit, and approval authority. The early combined-choice candidate retained audit scoring (C = 100; A/B/D = 0), but the user subsequently clarified that the original two-part user-facing format must be kept. Current template: one scenario, two questions, two choices each; keys 1B and 2B. Do not transfer audit scoring to that template. Distinguish an exception written in a policy from approval for a refund above the team's limit; do not imply that they are the same exception.

Challenge: the audit's A and D refer to "both interpretations," but neither source version defines two interpretations. In the selected two-part template, this issue is in question 1A. Checking the original source could also reveal the omitted exception and overlap the intended check. A wording-only rewrite cannot establish a uniquely defensible answer without changing or clarifying that distractor. The original keys are not newly validated benchmark keys. Do not invent two interpretations merely to make the inherited choices work.

The candidate omits generic duplicate-compensation/denied-support risks and uses the directly supported consequence that omitting the exception changes the policy's meaning. The existing text supports choosing a verification action, not demonstrating source inspection: an actual policy excerpt and AI quote would require newly authored, reviewed evidence. The draft should remain on hold for benchmark use until the distractor ambiguity is resolved.

Challenge-check refinement now recorded in provisional v1.9-draft: confirm that every reference in every choice (for example, "both interpretations") has an explicit basis in the scenario or evidence, and that broad verification actions do not overlap the keyed action. No final rule version is approved yet.

The user challenged an unnecessary repeat rewrite. Retain the earlier reviewed wording: "leaves out the policy exception in the next sentence," "This changes the meaning of the policy," and "put the missing exception back into the response." Do not introduce stylistic variations without explaining the proposed change.

## Conflicting summaries - agreed wording checkpoint

Question: `NH-FUNCTION-CUSTOMERSERVICE-D3-SOURCE-VERIFICATION-APPLIED-02`

Scenario wording retained from the review:

> A customer service team uses AI to draft a response using approved service policies and the customer's case history. Two summaries used for the response contain conflicting information, although both refer to the same original source.
>
> The AI is drafting a response about a delayed refund. An earlier refund attempt timed out, but the refund may already be complete. Refunds and exceptions need approval from the person authorized to approve them.

The user explicitly agreed to the simpler refund sentences and confirmed retaining the rewritten questions and choices:

1. What should the team check first to resolve the conflicting information in the summaries?
   - A. Read the text around the quoted passage and put the missing exception back into the response.
   - B. Compare both summaries with the original source to check what it supports.
2. What should the team do before issuing another refund?
   - A. Check the payment record to confirm whether the earlier refund is complete.
   - B. Issue another refund because the customer still reports a delay.

Keys: 1B and 2A. Choice 1A remains flagged because a missing exception is not established. The wording agreement does not remove that challenge or constitute approval to publish the item.

## HR source exception - language feedback

Question: `NH-FUNCTION-PEOPLE-D3-SOURCE-VERIFICATION-APPLIED-01`

The user requested simpler wording for anonymized records, the missing exception, and the connection to the consequence. The assistant's latest proposed scenario was:

> An HR team uses AI to draft a response to an employee using approved HR procedures and case records with names and personal information removed.
>
> The draft quotes a sentence from an HR procedure but leaves out the rule's exception stated right after it, which changes the meaning of the procedure.
>
> The draft also includes a recommendation that could affect an employment decision. Such decisions must be made by a named person with the authority to make them.

Use singular "information." Omit the user's suggested intensifier "whole" unless the source supports a change to the entire meaning. Preserve one scenario, two questions, two choices each, with keys 1B and 2B. Question 1A's source/interpretation ambiguity remains open. The scenario above is the latest proposal, not separately confirmed final wording.

## APPLIED-03 wording checkpoint

Latest question wording reviewed in conversation:

> A customer service team uses AI to draft a response using approved service policies and the customer's case history.
>
> The draft response includes made-up details where information was left blank in the case history. It also says the case is resolved, but the case history shows it is still pending.

User-preferred wording for choice C:

> Require missing information to be marked as "unknown" rather than assumed; state that the case is pending and outline the actual next step.

When presenting the next complete candidate, use the same missing-information component in B and the same pending-status component in D. Preserve A/B/C/D mappings. The question prompt's earlier word "prevents" should be reviewed for an implied guarantee; "Which option best addresses the made-up details and incorrect case status? Choose one." is a proposed alternative, not yet a selected final wording.

The audit's generic refund-approval and duplicate-compensation details were omitted from this candidate because it contains no refund decision. Keep this omission visible in comparative review. Do not infer that all policy details can be removed from other items.

## Marketing campaign artifact - agreed revision

Question: `NH-FUNCTION-MARKETING-D1-GENAI-MECHANICS-AWARENESS-01`

On 29 September 2026, the user agreed to the revised item and artifact, then requested local updates to both rule documents and a push to `kj-dee-branch`. This records candidate agreement and rule-publication authorization; it does not request replacing the localhost question or its official artifact.

The first artifact used unexplained X/Y coordinates and text codes, did not make the campaign objective or deliverable clear, and used an image that did not directly communicate the intended behavior. The agreed revision establishes a reusable-bag campaign, replaces the plot with readable text comparisons, and shows a shopper using a reusable bag at checkout. These lessons inform artifact standard v1.2 and the provisional rewrite refinements; they do not prove universal wording or benchmark calibration.

### Agreed complete candidate

> A marketing team uses AI to prepare a public social-media post encouraging customers to bring a reusable bag when shopping. The team needs a short caption and an image supporting that message.
>
> The AI compares wording from an approved content library and proposes a caption and image. Before publication, the team reviews the comparison and the image's permitted use.
>
> Review the campaign brief, AI caption comparison and image-use record below.

Place the agreed v2 artifact here, before the questions. Its review copy is stored locally at `outputs/artifact-drafts/NH-FUNCTION-MARKETING-D1-GENAI-MECHANICS-AWARENESS-01/campaign-review-v2.png`; this ignored output is not part of the rule-document push. Preserve v1 alongside it. The same folder contains `generation-prompt-v2.txt` and `review-notes-v2.md`.

Artifact evidence retained for the review record:

- Objective: encourage customers to bring a reusable bag when shopping. Audience: store customers. Deliverable: one public social-media post with a caption and image.
- Message to match: "Bring a reusable bag when you shop."
- Approved-library text and illustrative meaning-match scores: "Bring your reusable bag on your next shopping trip." (97); "Keep a reusable bag ready for your next shop." (88); "Check our store opening hours." (18).
- The displayed scale is 0-100; higher means closer in meaning. The artifact states that this is not a forecast of campaign results.
- Processing record: "Text converted to lists of numbers." and "Number lists compared."
- Proposed image: a shopper using a reusable bag at checkout. Proposed caption: "Bring your reusable bag on your next shopping trip."
- Image-use record: asset `IMG-025`, reusable bag at checkout; permitted use "Internal use only"; planned use "Public social-media post." No mismatch highlighting or corrective instruction.
- Footer identifies fictional assessment content, scores, and image-use information.

**Answer both parts.**

1. Which process explains the AI's text comparison shown in the processing record?
   - A. Retrieving relevant sources before generating an answer.
   - B. Representing text meaning using numbers to find related content.
2. What should the team do before using the proposed image in the campaign?
   - A. Replace the image or obtain permission to use it in the campaign.
   - B. Publish the image with credit to its creator instead of obtaining permission.

Keys: 1B and 2A. The processing record shows numerical representation and comparison of text meaning. This does not establish truth or predict campaign success. Retrieval can use embeddings, but the question asks about the representation process shown. The asset record allows internal use, while the planned post is public; creator credit does not expand that permission. Preserve the original one-scenario, two-question, two-choice structure and answer order. No per-part scoring was supplied or invented.

### Content decisions and QA limits

The objective, captions, shopper image, scores, asset metadata, and processing display are newly authored fictional evidence, not facts from the audit or observations of a deployed AI system. The user agreed to this concrete candidate. The generic requirement to check performance claims was omitted because this proposed post makes no measurable performance claim; the omission is explicit and does not authorize removing relevant requirements elsewhere. The internal-use restriction and numerical-representation construct remain.

Scores 97, 88, and 18 are authored illustrations, not measured embeddings or calibrated confidence. A synthetic reference vector q=(1,0,0) and unit candidate vectors v=(s,sqrt(1-s*s),0), with s=0.97, 0.88, and 0.18, reproduce the displayed values as round(100*cosine(q,v)). The arithmetic was recomputed during generation. This verifies numerical consistency only, not semantic validity, empirical measurement, or predictive performance.

The generated image was visually inspected against its prompt for text, scores, relevant imagery, and neutral permission fields. Application inline/expanded rendering, mobile layout, keyboard controls, and Thai equivalence remain untested because this is an English review draft outside the app. Candidate agreement does not complete those checks or approve official scored-asset replacement. Artifact and question-bank files are excluded from this publication.

## Marketing pilot claim - agreed complete revision

Question: `NH-FUNCTION-MARKETING-D1-GENAI-MECHANICS-AWARENESS-02`

On 29 September 2026, the user agreed to the complete candidate with artifact v3 and requested local rule updates followed by a push to `kj-dee-branch`. This is a different ID from the earlier marketing AWARENESS-01. Retain this agreed wording for future review instead of creating new stylistic variants. Publication covers rule documents and this checkpoint, not implementation in localhost or replacement of a scored artifact.

### Feedback and resulting rules

The user found "app performance" unclear because the artifact did not explicitly connect that phrase to the task being measured. The source panel now names "Shopping-list preparation time" and shows participants, task and before/during app-use averages in a table. The scenario names the "draft's time-saving claim."

The user also questioned the purpose of "AI activity record." It was first renamed "How the AI prepared this post," then removed because the scenario states the same process. The artifact retains the campaign brief, source evidence, image-use record and AI draft. The first question now refers to the process in the scenario; the second still requires comparing the pilot evidence with the draft. This is a contextual reduction of repetition, not a rule to remove all AI process records.

### Agreed complete candidate

> A marketing team uses AI to draft a public social-media post encouraging people to try a shopping-list app. The post needs a caption and an image showing the app in use.
>
> The AI searches approved campaign evidence and licensed image records. It adds matching passages to the request, then generates the draft post.
>
> Before publishing, the team must check whether the evidence supports the draft's time-saving claim and whether the image is permitted for campaign use.
>
> Review the pilot results, image-use record and AI draft below.

Embed artifact v3 here. The local review copy is `outputs/artifact-drafts/NH-FUNCTION-MARKETING-D1-GENAI-MECHANICS-AWARENESS-02/campaign-review-v3.png`. The same ignored folder retains v1/v2, the exact generation/edit prompts, source-item.json and review notes. These files are not included in the rule-document push.

Evidence in the agreed artifact:

- Campaign objective: encourage people to try a shopping-list app. Audience: people who plan household shopping. Deliverable: one public social-media post with a caption and image.
- Source passages added to the request: an approved pilot report and licensed asset record.
- Shopping-list preparation time: 20 selected users; task is preparing a weekly shopping list; average time before using the app is 20 minutes; average time using the app during the pilot is 15 minutes.
- Image record: IMG-026, planning a shopping list on a phone; permitted use is public social-media posts. The draft uses that image and permission matches the intended channel.
- AI draft caption: "Cut your weekly shopping-list planning time by 25%. Try the app for your next shop."
- Footer identifies the campaign, pilot results and image-use record as fictional assessment examples. No process panel or answer-revealing highlights remain.

**Answer both parts.**

1. Which process does the AI use to prepare the draft?
   - A. Representing text meaning using numbers to find related content.
   - B. Retrieving relevant sources before generating an answer.
2. How should the team revise the AI's claim before publishing the post?
   - A. Explain that the result came from a small pilot with selected users, without promising it for everyone.
   - B. Present the result from the small pilot as what all customers should expect when using the app.

Keys: 1B and 2A. The AI searches sources and adds matching passages to the request before generation. Numerical representations may support retrieval, but are not the step described. Average preparation time fell from 20 to 15 minutes, a 25% reduction, in a pilot with 20 selected users. The draft omits that scope. Explain who was tested and the task measured without promising the result for everyone. No per-part scoring was supplied or invented; retain the one-scenario, two-question, two-choice structure and answer order.

### Additions, checks and limits

The app, objective, public-post deliverable, photograph, metric, participant count, pilot averages, exact caption and image permission record are fictional additions now agreed for this review candidate. They are not facts originally specified in the audit or observations of a real deployed system. The original decisions about retrieval and an unqualified claim from a small selected pilot remain. Both performance-claim and image-permission checks are retained; no rights violation from AWARENESS-01 is imported.

Independently recomputed (20-15)/20*100 = 25%. This validates the comparison of averages, not a universal effect, individual benefit or causal claim. The sample count is not the percentage denominator. A correct number can still support a misleadingly broad caption.

The artifact was edited with built-in image generation and visually checked for the requested panel removal, correct labels, figures, caption, image ID, permission scope and fictional footer. Application inline/expanded/mobile rendering, keyboard access and Thai localization remain untested. User agreement to the candidate is recorded; official scored-asset integration and release checks have not been performed.

Part 1 tests the AI mechanism. Part 2 retains the original professional review of an AI-generated claim and is not independent evidence of generative-AI mechanism knowledge. Preserve that limitation rather than claiming benchmark calibration or changing the user's selected format.

## Thai marketing wording - user-passed candidate

Question: `NH-FUNCTION-MARKETING-D1-GENAI-MECHANICS-AWARENESS-02`

The user marked the complete revised Thai item "pass" and requested an update to the Thai rewrite rules. That initial request authorized a local rule update. The user subsequently said "push" on 29 September 2026, authorizing publication of the accumulated Thai rule updates and this checkpoint to `kj-dee-branch`. Preserve this wording as the agreed Thai review baseline. It does not change the application translation status or authorize question-bank implementation.

The initial wording referred to "การประหยัดเวลาในร่างโพสต์". The user clarified that the team must check whether users save time after using the shopping-list app, based on supporting artifact evidence. The correction makes the user outcome, draft claim and evidence source explicit. It does not turn the before/during pilot comparison into proof of causation or a result for all customers.

### Accepted complete Thai wording

> ทีมการตลาดใช้ AI ร่างโพสต์สาธารณะบนโซเชียลมีเดีย เพื่อชวนให้คนลองใช้แอปทำรายการซื้อของ โพสต์ต้องมีข้อความและภาพที่แสดงการใช้แอป
>
> AI ค้นข้อมูลแคมเปญที่ผ่านการอนุมัติและข้อมูลสิทธิ์ใช้ภาพ จากนั้นเพิ่มข้อความที่เกี่ยวข้องลงในคำขอ แล้วสร้างร่างโพสต์
>
> ก่อนเผยแพร่ ทีมต้องตรวจสอบจากข้อมูลในภาพประกอบว่า หลังใช้แอป ผู้ใช้ประหยัดเวลาเตรียมรายการซื้อของได้ตามที่ร่างโพสต์กล่าวอ้างหรือไม่ และภาพได้รับอนุญาตให้ใช้ในแคมเปญหรือไม่
>
> พิจารณาผลการทดลอง ข้อมูลสิทธิ์ใช้ภาพ และร่างโพสต์จาก AI ด้านล่าง

Artifact: local `outputs/artifact-drafts/NH-FUNCTION-MARKETING-D1-GENAI-MECHANICS-AWARENESS-02/campaign-review-th-v1.png`, the Thai equivalent of agreed English v3. It retains the 20 selected users, average preparation times of 20/15 minutes, the unqualified 25% draft caption, public-use permission for IMG-026 and fictional-data footer. The repeated process panel remains absent.

**ตอบทั้งสองข้อ**

**1. AI ใช้กระบวนการใดในการเตรียมร่างโพสต์นี้?**

A. แทนความหมายของข้อความด้วยตัวเลข เพื่อค้นหาเนื้อหาที่เกี่ยวข้อง

B. ดึงข้อมูลจากแหล่งที่เกี่ยวข้องมาใช้ก่อนสร้างคำตอบ

**2. ทีมควรปรับข้อความที่กล่าวอ้างว่าแอปช่วยประหยัดเวลาอย่างไรก่อนเผยแพร่โพสต์?**

A. ระบุว่าผลนี้มาจากการทดลองกับผู้ใช้กลุ่มเล็กที่คัดเลือกมา โดยไม่รับรองว่าทุกคนจะได้ผลเหมือนกัน

B. นำเสนอผลจากการทดลองกับผู้ใช้กลุ่มเล็กว่าเป็นผลที่ลูกค้าทุกคนคาดหวังได้เมื่อใช้แอป

**เฉลยและคำอธิบาย**

- **ข้อ 1: B** — AI ค้นข้อมูลจากแหล่งที่เกี่ยวข้อง แล้วเพิ่มข้อความที่พบลงในคำขอก่อนสร้างร่างโพสต์ จึงเป็นการดึงข้อมูลมาใช้ประกอบการสร้างคำตอบ
- **ข้อ 2: A** — ผลการทดลองกับผู้ใช้ที่คัดเลือกมา **20 คน** แสดงว่าเวลาเฉลี่ยในการเตรียมรายการซื้อของลดจาก **20 นาที ก่อนใช้แอป เป็น 15 นาที เมื่อใช้แอปในการทดลอง** คิดเป็นการลดลง **25%** แต่ข้อมูลนี้ยังไม่รองรับว่าลูกค้าทุกคนจะได้ผลเหมือนกัน ทีมจึงควรระบุกลุ่มผู้ใช้และงานที่ทดลองให้ชัดเจนในโพสต์

*ข้อมูลแคมเปญและผลการทดลองเป็นตัวอย่างสมมติสำหรับแบบประเมิน โดยคงรูปแบบ ตัวเลือก และเฉลยเดิม*

The user accepted this complete wording, including the revised second-question prompt. The original multipart template, choice order and keys 1B/2A are retained. No per-part scoring was invented. App integration, mobile/expanded presentation, keyboard accessibility and independent release validation remain unperformed. Do not reinterpret the user's wording approval as a completed application release check.

## Core concepts wording checkpoints - 1 October 2026

The latest source check used GitHub kj-dee-branch at a318bca and both original audit and userFacingDraft JSON from localhost. These checkpoints record the review conversation; they do not update question-bank data. The user requested a local summary of rule updates, not publication. Distinguish user-directed wording changes from assistant proposals that have not received a complete-item pass.

### AWARENESS-02 - explicit AI reference

Question: `NH-CORE-GENERAL-D1-CORE-CONCEPTS-AWARENESS-02`

Latest scenario after the user's request for a clearer subject:

> A community learning group uses an AI tool to prepare a workshop guide for people with no AI background.
>
> The AI tool returns passages copied word for word from reviewed learning materials. Each passage includes an ID identifying the source it came from.

Which description best matches what the tool is doing?

A. Coordinating a language model, search, access permissions and review tools.

B. Following a fixed rule to select approved text.

C. Generating an answer without retrieving supporting sources.

D. Retrieving exact passages from reviewed sources.

Key D. Existing passages with source IDs support retrieval as the observed behavior. The user proposed "The AI tool" or "The AI"; the assistant recommended "The AI tool" for consistency. No separate full-item pass was recorded. Do not apply the later LLM substitution in AWARENESS-04 retroactively without identifying it as a new change.

No artifact is needed because the prose supplies the evidence. The source's matching format label conflicts with its single A-D interaction; the latter was preserved. The evidence does not prove that rules or other components are absent, so this identifies observed behavior rather than a unique architecture. The generic risk of misleading learners was not repeated because it does not distinguish the choices.

### AWARENESS-03 - concise rule-based action

Question: `NH-CORE-GENERAL-D1-CORE-CONCEPTS-AWARENESS-03`

Latest combined scenario proposed after the user's comparison, not separately confirmed as a complete-item pass:

> A small business uses an automated tool to prepare a service report from approved service records. The report must leave out details that identify customers.
>
> When preset conditions are met, the tool automatically inserts pre-approved text into the report.

Retain the question about how the tool selects text for the report. Existing option meanings and order remain: A fixed-rule selection; B generation without retrieving supporting sources; C coordination of model/search/permissions/review; D exact-passage retrieval. Original key A. The preset condition is the decision-relevant evidence; copying or insertion alone would not distinguish A from D. No artifact needed.

The original audit describes a system following a fixed rule; the draft calls it AI. "Automated tool" avoids asserting AI involvement from rule-based behavior alone. This does not prove no AI exists elsewhere in the workflow. The privacy requirement is not established as a prompt instruction. Use report consistently, and do not broaden customer identifiers into all personal customer details. User suggested the shorter insertion wording; the assistant retained the trigger and proposed the combined scenario above. The audit's generic risk of creating a service commitment is omitted from the candidate, not converted into an established incident.

### AWARENESS-04 - requested LLM terminology

Question: `NH-CORE-GENERAL-D1-CORE-CONCEPTS-AWARENESS-04`

The user explicitly requested replacing "language model" with "large language model (LLM)" and keeping the rest unchanged. Latest complete version:

> An internal support team uses an AI tool to prepare support responses.
>
> The AI tool searches up-to-date support articles and uses a large language model (LLM) to draft a response. It also manages access permissions and provides a screen for staff to review the draft. Staff must approve the response before it is sent.

Which description best matches how the AI tool works as a whole?

A. Following a fixed rule to select approved text.

B. Coordinating a large language model (LLM), search, access permissions and review tools.

C. Generating an answer without retrieving supporting sources.

D. Retrieving exact passages from approved sources.

Key B. The full application combines search, drafting, access management and staff review; retrieval alone describes only part. Record LLM as user-directed terminology, not a fact about model size explicitly specified in the audit. Staff approval remains a requirement; no automatic enforcement or expanded authority is invented. The generic risk of repeated support work is not needed to distinguish the choices and was omitted from the candidate.

No artifact needed. The inventory's proposed risky support thread would add an unrelated ambiguity. Its "requires artifact" tag was reassessed against artifact standard v1.3, without editing inventory metadata. As with AWARENESS-02, preserve the actual single A-D choice despite the matching label. No scored-release approval or template change is implied by the terminology request.

## Challenge checklist to test and refine

- Does the actor label clarify established AI behavior without assuming that all automation is AI?
- Is an output requirement being incorrectly presented as an instruction already supplied in a prompt?
- Did a shorter sentence retain the condition or trigger needed to identify the mechanism?
- Are document names consistent without broadening the privacy restriction or changing the output's purpose?
- Is LLM terminology appropriate or explicitly requested, and was a narrow wording request kept narrow?
- Does the prompt ask about one observed step or the full application? Does the explanation allow mechanisms to coexist?
- Does an artifact or format label conflict with the actual evidence need or selected interaction? Has the discrepancy been flagged without a silent format change?

- In Thai, is the measured outcome attached to the user action rather than ambiguously to the draft text? Is the claim still something to verify, with its evidence source named?

- Does a broad term such as "performance" name the actual measured task outcome, with an explicit link to the draft claim?
- Does a process panel supply unique evidence, or merely repeat the scenario? If removed, are all necessary facts and question references still present?
- Is a correct calculation being confused with a claim that applies to everyone or proves causation?

- Is the objective and intended output clear enough to understand why the evidence matters, without forcing unnecessary goal-first prose?
- Does each artifact image directly support the task, and does each question point to concrete evidence?
- Are labels and score meanings explained? Is similarity kept distinct from truth, permission, confidence, and predicted results?
- Does the evidence establish the process being tested, while feedback explains related processes without falsely treating them as mutually exclusive?
- Are fictional additions and material omissions recorded separately from original facts, with the user's decision retained?

- Has this ID already been reviewed? If so, flag it and reuse the reviewed baseline rather than silently producing another version.
- Is the selected template, question count, choice count, interaction, and answer order unchanged?
- Are agreed phrases retained, with any further changes explicitly proposed and explained?
- Can a reader understand the task and decision in one reading without inventing a missing connection?
- Does each paragraph connect to the AI's task without inventing what the AI concluded?
- Does simpler wording preserve uncertainty and avoid unsupported intensifiers or invented authority roles?
- Does each source or concept have a consistent name? Are genuine distinctions still explicit?
- Does a problem-first opening improve this particular item, or distract from what the choices test?
- Do retained requirements and consequences support a tested decision or a plausible distractor?
- Did shortening remove a material fact, uncertainty, or authority boundary?
- Does the rewrite preserve the original key, scoring, and construct? Are substantive changes identified separately?
- Could a reasonable interpretation make a distractor correct? Does the explanation address that interpretation fairly?
- Are references such as "both interpretations" and "the missing exception" actually established by the scenario?
- Are shared choice components identical, with no answer revealed through polish, length, or specificity?
- Does simpler language preserve technical meaning in this context?
- Does the sentence retain a grammatical main verb and describe the actual AI action? Is "generates" appropriate, without confusing output generation with decision authority?
- Does the scenario reveal the mechanism the question asks the reader to identify? Can it describe the observed effect clearly while retaining necessary evidence?
- Does a simplified phrase such as "no longer sees" preserve the distinction between unavailable current input and deliberate deletion or stored-history loss?
- Is user-preferred terminology used with its clarified meaning, and is any shift from the audit wording recorded rather than treated as universal equivalence?
- Is the object of an estimate or claim explicit? If absent from the original, has the user agreed to the clarification and has that distinction been recorded?
- Is a record introduced before "that record," and are the exact source boundaries preserved rather than broadened to "the system"?
- Does the rewrite distinguish an unlocated record, lack of access, and proven fabrication? Does it preserve naming a source versus claiming to use its information unless a change was agreed?
- Does the question or explanation overstate what a prompt instruction can guarantee?
- Is scoring defined for the selected format, rather than borrowed from the audit's combined-choice key? Keep format changes outside a wording-only rewrite unless separately requested.
- What counterexample would make a proposed rule unhelpful or misleading?

## Ongoing publication and finalization

Keep refinements local until the user explicitly requests a push. Publish the accumulated authorized rule documents to `kj-dee-branch` without a question-count gate or progress tally. Continue consolidating supported refinements, retaining the original baseline through version history and recording rationale and challenge findings. Resolve or explicitly document unresolved issues; do not claim that a set of examples proves perfection or calibration. Record the user's final review decision when the draft is promoted to an approved rules version; publication of the draft does not itself grant that approval or promote scored items. If GitHub authentication is unavailable, report the actual push failure instead of implying publication.

## Controls review local implementation - 5 October 2026

The user requested a summary of the review lessons, local rewrite-rule, English-inventory and related-record updates, and a localhost restart, with no push until explicitly requested. This implements the latest conversation candidates since the previous inventory update, including the advanced prompt/output/source checkpoints previously saved only in this log. Selection for this local implementation does not imply that every item received a separate full-item pass or scored-release approval. Earlier entries retain their historical implementation status; this entry supersedes their pending-local-implementation boundary. GitHub rules were last verified at `0baa4af100ec3a6b2451713db6ce0af48334a5ce`.

Explicit recent acceptance includes Source verification ADVANCED-04, Fraud detection ADVANCED-02 and -04, both TREND-D3 Fraud detection items, Data privacy PROFICIENT-02 and the new removed wording in Security governance PROFICIENT-02. Earlier accepted advanced prompt/output/source items, valid purpose, the concise missing-log sentence and the explicit written-response instruction are retained. Other pending conversation candidates are selected for local review-inventory implementation by this update request; that is not a claim of an individual full-item pass.

The latest decision is to use "One team’s access permission has been removed, but the team can still read results saved in the system’s cache" and "Some ways of accessing the data still allow access after permission has been removed." The accepted explanation describes the incomplete permission change. This is not data deletion.

Lessons: familiar role-appropriate wording, natural connected sentences, exact evidence and technical scope, explicit human actors, independent verification, current-user authorization, propagation of permission changes to cached results, and preservation of uncertainty. Do not confuse valid and approved purposes, source access and factual support, repeated reporting and independent evidence, incomplete logs and incomplete access removal, or a timeout and refund failure. Written prompts should make the response task explicit. Remove authoring instructions while retaining relevant task scope; flag generic governance items labeled as fraud detection and obvious answer clues.

The canonical checkpoints are in `inventory/english-wording-review-october-controls.mjs`. The pipeline preserves original audit fields, every selected interaction, option ID/order, key and score. Previous English drafts and artifact plans are archived in wording-refinement history. Existing Thai remains unchanged and marked previous-revision-pending-sync. Original live-option feedback remains source wording; unresolved competency claims in TREND items are specifically flagged. Production questions, scored assets and Thai approval are not changed.

All candidates below need no new artifact: their decisions are answerable from the scenario. Original artifact plans remain in history. No logs, document facts, dashboard metrics, legal mandates or fraud incidents were invented. Explanations for earlier compact checkpoints expand only the reasoning already reviewed.

### NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-ADVANCED-01

The customer service team uses AI to draft case resolution responses based on approved service policies and customer case histories.

Teams edit the prompt directly in the live system, but they cannot trace failures to a specific prompt version.

Refunds and exceptions require approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. Which approach to managing prompts best addresses this problem?

A. Test and confirm that the prompt works with the replacement AI model before switching to it.

B. Keep a version history of prompts and link each released version to the examples used in its evaluation.

2. The AI recommends a refund over the frontline team’s approval limit. What should the team do next?

A. Send the exception to the person authorized to approve the refund.

B. Issue the refund after the AI repeats its recommendation.

Keys / order: b, a.

Explanation / exemplar: Keeping prompt versions and their evaluation examples supports investigating failures and returning to an earlier version when needed. Testing a prompt with a replacement model addresses a model change, which is not the problem described here. The refund requires approval from someone with the necessary authority. Repeating the AI’s recommendation does not give the frontline team permission to issue it.

Artifact: not required.

### NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-ADVANCED-03

The customer service team uses AI to draft case resolution responses based on approved service policies and customer case histories.

The prompt works with one AI model, but the replacement model interprets its instructions for the required data structure differently.

Refunds and exceptions require approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. Which approach to managing prompts best addresses this problem?

A. Make the exception a test case that must still pass after changes before a new version can be released.

B. Test and confirm that the prompt works with the replacement AI model before switching to it.

2. The AI’s draft says the case is resolved, but the case history shows it is still pending. What should the team do next?

A. State that the case is still pending and explain the actual next step.

B. State that the case is resolved to reassure the customer.

Keys / order: b, a.

Explanation / exemplar: A prompt that works with one model may behave differently with another. Test the prompt with the replacement model and confirm that the combination meets requirements before switching. The response should reflect the status in the case history. State that the case is still pending and explain the actual next step.

Artifact: not required.

Remaining challenges: The exception in choice A is undefined. A regression test could be part of the broader evaluation in B; wording acceptance does not resolve this overlap.

### NH-FUNCTION-CUSTOMERSERVICE-D2-OUTPUT-REFINEMENT-ADVANCED-01

The customer service team uses AI to draft case resolution responses based on approved service policies and customer case histories.

The average ratings for the AI’s responses are improving, but responses with serious factual errors still pass the quality checks.

Refunds and exceptions require approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. Which quality process should the team introduce first?

A. Score the same sample of responses again using both versions of the scoring criteria.

B. Set rules that block responses with serious errors from being released, regardless of the average ratings.

2. The AI recommends a refund over the frontline team’s approval limit. What should the team do next?

A. Send the exception to the person authorized to approve the refund.

B. Issue the refund after the AI repeats its recommendation.

Keys / order: b, a.

Explanation / exemplar: Improving average ratings can hide serious errors. Separate rules should prevent responses with those errors from being released, even when the average ratings are high. The refund requires approval from someone with the necessary authority. Repeating the AI’s recommendation does not give the frontline team permission to issue it.

Artifact: not required.

Remaining challenges: Two versions of the scoring criteria are not established in the scenario. Preserve factual errors in the scenario and broader serious errors in the control.

### NH-FUNCTION-CUSTOMERSERVICE-D2-OUTPUT-REFINEMENT-ADVANCED-02

The customer service team uses AI to draft case resolution responses based on approved service policies and customer case histories.

Staff repeatedly rewrite the AI’s responses but do not categorize the problems that keep occurring.

Refunds and exceptions require approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. Which quality process should the team introduce first?

A. Record problems by type and link each type to fixes in the prompt or source information.

B. Set rules that block responses with serious errors from being released, regardless of the average ratings.

2. The system timed out during an earlier refund attempt, but the refund may already be complete. What should the team do next?

A. Issue another refund because the customer still reports a delay.

B. Check the payment record to confirm the earlier refund’s status before issuing another refund.

Keys / order: a, b.

Explanation / exemplar: Recording recurring problems by type helps identify changes needed in prompts or source information and supports prevention instead of repeated manual rewriting. Blocking serious errors is useful but does not address the missing categorization and feedback process. A timeout or a customer reporting a delay does not prove that the refund failed. Checking the payment record helps prevent a duplicate refund.

Artifact: not required.

### NH-FUNCTION-CUSTOMERSERVICE-D2-OUTPUT-REFINEMENT-ADVANCED-04

The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.

The response keeps going through revisions even after it meets all requirements.

Refunds and exceptions require approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. Which quality process should the team introduce first?

A. Stop revising once clear acceptance criteria are met, and set a limit on revision effort.

B. Set rules that block responses with serious errors from being released, regardless of the average ratings.

2. The customer says the identity details in the case history are incorrect. What should the team do next?

A. Use the existing identity details because they are already in the system.

B. Follow the established process for verifying and correcting identity details.

Keys / order: a, b.

Explanation / exemplar: Further revisions do not necessarily improve a response that already meets requirements. Clear acceptance criteria and a revision-effort limit prevent unnecessary rewriting. Blocking serious errors addresses a different quality problem. Stored identity details can be incorrect. Follow the established verification and correction process rather than assume information is accurate because it is already in the system.

Artifact: not required.

Remaining challenges: The revision limit has no specified units. Reaching a limit does not authorize release of an unacceptable response.

### NH-FUNCTION-CUSTOMERSERVICE-D3-SOURCE-VERIFICATION-ADVANCED-01

The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.

The AI combines information from sources with different effective dates in its response but does not record those dates.

Refunds and exceptions require approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. Which rule for checking evidence would best prevent this problem from recurring?

A. Check whether the source passage supports each important statement.

B. Record source versions and resolve conflicts about when the information applies before combining it.

2. The AI recommends a refund over the frontline team’s approval limit. What should the team do next?

A. Issue the refund after the AI repeats its recommendation.

B. Send the exception to the person authorized to approve the refund.

Keys / order: b, b.

Explanation / exemplar: Track source versions and establish which information applies to the relevant period before combining it. Checking passage support is useful but does not by itself resolve conflicting effective dates. The refund requires approval from someone with the necessary authority. Repeating the AI’s recommendation does not give the frontline team permission to issue it.

Artifact: not required.

### NH-FUNCTION-CUSTOMERSERVICE-D4-DATA-PRIVACY-PROFICIENT-01

The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.

A record has been deleted from the main database, but the search index still returns that record.

Refunds and exceptions require approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. Which assessment best describes this situation?

A. Deletion is incomplete in data stores built from the original records.

B. The system must also enforce the access permissions of the user requesting the data.

2. The AI recommends a refund over the frontline team’s approval limit. What should the team do next?

A. Send the exception to the person authorized to approve the refund.

B. Issue the refund after the AI repeats its recommendation.

Keys / order: a, a.

Explanation / exemplar: Deleting a record from the main database does not complete deletion if the search index still returns it. The scenario does not establish a requesting-user access failure. The refund requires approval from someone with the necessary authority. Repeating the AI’s recommendation does not give the frontline team permission to issue it.

Artifact: not required.

### NH-FUNCTION-CUSTOMERSERVICE-D4-DATA-PRIVACY-PROFICIENT-03

The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.

The task has a valid purpose. A proposal would use the data for another purpose, but there is no approved basis for that use.

Refunds and exceptions require approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. Which assessment best describes this situation?

A. The way data is logged makes the controls for limiting input data ineffective.

B. The proposed new use of the data needs a separate review.

2. The AI’s draft says the case is resolved, but the case history shows it is still pending. What should the team do next?

A. State that the case is still pending and explain the actual next step.

B. State that the case is resolved to reassure the customer.

Keys / order: b, a.

Explanation / exemplar: A valid purpose for the current task does not establish an approved basis for using the data for another purpose. The proposed use needs a separate review. The scenario does not describe a logging problem. The response should reflect the status in the case history. State that the case is still pending and explain the actual next step.

Artifact: not required.

### NH-FUNCTION-CUSTOMERSERVICE-D4-SECURITY-GOVERNANCE-PROFICIENT-01

The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.

Logs are available, but they are missing the action payload and approval version.

Refunds and exceptions require approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. Which conclusion is supported by these log details?

A. The logs do not contain enough information to determine exactly what was approved.

B. Some ways of accessing the data still allow access after permission has been withdrawn.

2. The AI recommends a refund over the frontline team’s approval limit. What should the team do next?

A. Issue the refund after the AI repeats its recommendation.

B. Send the exception to the person authorized to approve the refund.

Keys / order: a, b.

Explanation / exemplar: Without the action payload and approval version, the logs do not show exactly what was approved. The scenario does not describe continued access after permission was withdrawn. The refund requires approval from someone with the necessary authority. Repeating the AI’s recommendation does not give the frontline team permission to issue it.

Artifact: not required.

Remaining challenges: Approval version is not defined in the original. Do not silently redefine it as a policy version. Earlier accepted withdrawn wording is retained for this item; the newer removed decision is applied to the reviewed PROFICIENT-02 candidate.

### DEPTH-D4-RISK-045

The procurement team asks whether an AI vendor can use company data to improve its service.

Write the key questions about risk you would ask before approving this use of company data.

Keys / order: Written response; original rubric preserved.

Explanation / exemplar: What company data would the vendor use, and for what purposes?
Would the data be used to train or improve the vendor’s AI models? Can the company opt out of model training?
How long would the vendor keep the data, and what are the terms for deleting it?
Which subcontractors would process the data on the vendor’s behalf?
How would access to the data be controlled, would it be encrypted, and what rights would the company have to audit the vendor?
How and when would the vendor notify the company of a data breach?

These questions should be addressed before any customer data is shared.

Artifact: not required.

Remaining challenges: Written response and original rubric retained; service improvement is not automatically model training. No jurisdiction-specific legal requirements added.

### DEPTH-EXP-D4-GOV-077

An AI customer support workflow has sent incorrect refund guidance to customers.

Arrange the response actions from first to last.

A. Restrict the affected workflow to prevent further harm.

B. Identify which customers, outputs and data are affected.

C. Notify the relevant people through the approved legal and communications process.

D. Fix the controls, prompts, evidence checks and process for reversing changes.

E. Review the incident, identify who is responsible for follow-up and set measures for preventing similar incidents.

Keys / order: contain, scope, notify, fix, learn.

Explanation / exemplar: First restrict the affected workflow to prevent further harm. Identify the scope of the incident, notify the relevant people through the approved process, fix the controls and then review the incident with responsibility and prevention measures defined.

Artifact: not required.

Remaining challenges: The source does not establish detailed dependencies between the middle response actions. Preserve the ranking key without claiming this is a universal strictly sequential incident-response process.

### TREND-D4-SECURITY-GOVERNANCE-PROFICIENT-01

An operations team wants an AI agent to assess and prioritize requests, update records and trigger follow-up emails. The team needs to decide what permissions and oversight the agent should have.

Which approach best balances useful automation with control over the agent’s access and actions? Choose one answer.

A. Start with read-only access and log every proposed action. Require approval for data changes that affect customers, monitor failures and expand permissions only as the evidence improves.

B. Let the agent handle low-value tasks and review a sample of its work each week.

C. Give the agent broad permissions so it can learn the workflow faster.

D. Measure success only by the number of tickets closed per hour.

Keys / order: best.

Explanation / exemplar: The first approach connects access limits, approval for changes affecting customers, logs, failure monitoring and evidence before expanding permissions. Low-value tasks are not necessarily low risk. Broad permissions do not establish readiness, and ticket volume alone does not show whether actions are safe or correct.

Artifact: not required.

Remaining challenges: Decision scope was clarified after user feedback without inventing an incident. Evidence improves remains undefined, and the keyed choice is much longer and more comprehensive.

### DEPTH-EXP-D5-D6-081

A Chief Operating Officer (COO) wants a dashboard to help decide whether to expand AI-assisted drafting from one department to others.

Which measures should the dashboard include to support this decision? Select four answers.

A. Workflow results compared with the baseline, such as time to complete work or the number of resolved tickets.

B. Quality problems, work that needs to be redone, exceptions and incidents affecting customers.

C. Continued AI use by role and which staff receive coaching from managers.

D. Reasons staff override AI outputs, user feedback and updates to prompts or workflows.

E. The total number of prompts sent as the only measure of success.

Keys / order: outcome, quality, adoption, learning.

Explanation / exemplar: The dashboard should show whether results improve, whether quality problems occur, whether staff continue using AI and receive coaching, and whether feedback leads to changes. Prompt volume alone shows activity, not whether expanding AI use is worthwhile.

Artifact: not required.

Remaining challenges: Four correct choices and a single distractor containing only make the answer easier to guess. The existing productivity chart is unnecessary for selecting measures.

### NH-FUNCTION-CUSTOMERSERVICE-D3-SOURCE-VERIFICATION-ADVANCED-02

The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.

Several sources repeat information from the same press release, and that information is counted more than once as supporting evidence.

Refunds and exceptions require approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. Which rule for checking evidence would best prevent this problem from recurring?

A. Record source versions and resolve conflicts about when the information applies before combining it.

B. Trace each source back to its origin and count independent sources of evidence.

2. A previous refund may already be complete, even though the system timed out. What should the team do next?

A. Check the payment record to confirm the refund status before issuing another refund.

B. Issue another refund because the customer still reports a delay.

Keys / order: b, a.

Explanation / exemplar: Several sources repeating the same press release do not provide independent confirmation. Tracing their origins prevents repeated information from increasing confidence without additional evidence. A timeout or a customer reporting a delay does not prove that the refund failed. Checking the payment record helps prevent a duplicate refund.

Artifact: not required.

### NH-FUNCTION-CUSTOMERSERVICE-D3-SOURCE-VERIFICATION-ADVANCED-04

The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.

Staff reviewing the AI’s draft accept its sources after checking that the links open, without reading whether the source text supports the statements.

Refunds and exceptions require approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. Which rule for checking evidence would best prevent this problem from recurring?

A. When a source changes, use the links between statements and their sources to identify which statements need another review.

B. Require reviewers to read the relevant source text and check whether it supports each important statement.

2. The customer says the identity details in the case history are incorrect. What should the team do next?

A. Rely on the current identity details because they are already in the system.

B. Follow the established process for verifying and correcting identity details.

Keys / order: b, b.

Explanation / exemplar: A link opening successfully does not establish that its content supports a statement. Reviewers must check the relevant text. Reviewing statements when sources change is useful, but it does not address the missing support check during the initial review. Stored identity details can be incorrect. Follow the established verification and correction process rather than assume information is accurate because it is already in the system.

Artifact: not required.

### NH-FUNCTION-CUSTOMERSERVICE-D3-FRAUD-DETECTION-ADVANCED-02

The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.

When staff receive suspicious requests, they verify them using the phone numbers provided in those same requests.

Refunds and exceptions require approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. Which change would best address the problem with how staff verify suspicious requests?

A. Verify requests using contact records maintained independently of those requests.

B. Keep changes to master data separate from transaction approval.

2. A previous refund may already be complete, even though the system timed out. What should the team do next?

A. Check the payment record to confirm the refund status before issuing another refund.

B. Issue another refund because the customer still reports a delay.

Keys / order: a, a.

Explanation / exemplar: Someone sending a fraudulent request could provide a phone number they control. Using independently maintained contact records avoids relying on the suspicious request to verify itself. Separating master-data changes from transaction approval does not directly address this verification problem. A timeout or a customer reporting a delay does not prove that the refund failed. Checking the payment record helps prevent a duplicate refund.

Artifact: not required.

Remaining challenges: The original tests general fraud-prevention controls within an AI-assisted workflow; it does not describe an AI-specific failure. Master data is not defined in the scenario.

### NH-FUNCTION-CUSTOMERSERVICE-D3-FRAUD-DETECTION-ADVANCED-04

The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.

Someone has gained unauthorized access to an account, but the account remains active even after several suspicious requests are reported.

Refunds and exceptions require approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. Which change would best address the account security problem?

A. Keep changes to master data separate from transaction approval.

B. Restrict the account’s access and investigate related actions through the incident response process.

2. The customer says the identity details in the case history are incorrect. What should the team do next?

A. Follow the established process for verifying and correcting identity details.

B. Rely on the current identity details because they are already in the system.

Keys / order: b, a.

Explanation / exemplar: The account remains active after unauthorized access, so further actions may still be possible. Restricting access helps prevent further harm, while investigating related actions establishes what may already have happened. Separating master-data changes from transaction approval does not directly address this ongoing access. Stored identity details can be incorrect. Follow the established verification and correction process rather than assume information is accurate because it is already in the system.

Artifact: not required.

Remaining challenges: The source does not establish that AI caused the unauthorized access or that the compromise caused the disputed identity details. Master data remains undefined.

### TREND-D3-FRAUD-DETECTION-ADVANCED-01

Leadership wants to expand generative AI, AI agents and workflows that use different types of content across departments. However, the organization has limited capacity to oversee their use.

The organization needs fraud and manipulation controls that can support this expansion, including checks for phishing, suspicious materials and invoice fraud.

Which approach best supports the move from AI experiments to routine operations across the organization? Choose one answer.

A. Establish a tiered approach to running AI: review proposed uses, apply controls based on risk, use evaluation results, review incidents, train staff for their roles and use measurable business value to decide whether to proceed.

B. Create one central committee to approve every AI request.

C. Let each team choose its own tools independently to move faster.

D. Delay all AI adoption until regulations are fully settled.

Keys / order: best.

Explanation / exemplar: A combines oversight, evaluation, incident review, staff training and measurable value. Applying controls according to risk helps the organization manage different uses of AI as adoption expands. A central committee alone does not provide this complete approach. Independent tool selection does not establish shared controls, while delaying all adoption does not provide a way to manage current opportunities and risks.

Artifact: not required.

Remaining challenges: The choices primarily assess general AI governance rather than fraud detection. Choice A is much longer and more comprehensive. Authoring guidance was reframed as task scope and year-based market framing removed in the accepted candidate; no current market claim was verified. Original per-option feedback still reflects the original competency mapping and awaits content revision.

### TREND-D3-FRAUD-DETECTION-ADVANCED-02

A regional business wants AI systems that work well in the local language and meet industry rules and requirements for where data is stored. It also wants to address the risks of depending on a vendor.

Which approach best addresses these requirements before the business introduces the AI systems? Choose one answer.

A. Assess model capabilities, local-language performance, data storage locations, auditability, options for leaving the vendor and local regulatory requirements before planning the rollout.

B. Choose the strongest global model and translate its outputs into the local language.

C. Use only local models, even if they cannot perform critical tasks.

D. Treat local control over AI systems and data as only a hosting decision, without considering operations and governance.

Keys / order: best.

Explanation / exemplar: A considers whether the AI can perform the required work alongside language, data location, audit, vendor dependence and regulatory needs. Translating outputs addresses only part of the requirements. Choosing local models does not establish that they can perform critical tasks, and hosting alone does not address how the systems are operated and governed.

Artifact: not required.

Remaining challenges: The original scenario and choices assess AI selection and governance more directly than fraud detection. Authoring instructions were removed without inventing a fraud incident. Choice A remains substantially more comprehensive. Original per-option feedback still reflects the original competency mapping and awaits content revision.

### NH-FUNCTION-CUSTOMERSERVICE-D4-DATA-PRIVACY-PROFICIENT-02

The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.

The system checks access permissions when it adds information to the search index. However, different users receive search results without restrictions based on their individual permissions.

Refunds and exceptions require approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. Which assessment best describes this situation?

A. The system must also enforce the access permissions of the user requesting the information.

B. The way data is logged makes the controls for limiting input data ineffective.

2. A previous refund may already be complete, even though the system timed out. What should the team do next?

A. Issue another refund because the customer still reports a delay.

B. Check the payment record to confirm the refund status before issuing another refund.

Keys / order: a, b.

Explanation / exemplar: Checking permissions when information enters the search index does not establish what each later user is allowed to access. The system must enforce the requesting user’s permissions when returning results. The scenario does not describe a logging problem. A timeout or a customer reporting a delay does not prove that the refund failed. Checking the payment record helps prevent a duplicate refund.

Artifact: not required.

### NH-FUNCTION-CUSTOMERSERVICE-D4-SECURITY-GOVERNANCE-PROFICIENT-02

The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.

One team’s access permission has been removed, but the team can still read results saved in the system’s cache.

Refunds and exceptions require approval from the person authorized to approve them.

Answer both questions. Choose one answer for each.

1. Which conclusion is supported by this situation?

A. The logs do not contain enough information to determine exactly what was approved.

B. Some ways of accessing the data still allow access after permission has been removed.

2. A previous refund may already be complete, even though the system timed out. What should the team do next?

A. Check the payment record to confirm the refund status before issuing another refund.

B. Issue another refund because the customer still reports a delay.

Keys / order: b, a.

Explanation / exemplar: The team can still read cached results after losing permission. This shows that the permission change has not taken effect across every way of accessing the data. The scenario does not establish that logs are incomplete. A timeout or a customer reporting a delay does not prove that the refund failed. Checking the payment record helps prevent a duplicate refund.

Artifact: not required.

Remaining challenges: User explicitly selected removed in place of withdrawn. This describes removing access permission, not deleting the data or the cache. The original prompt mentions test results without supplying a test report; the reviewed prompt refers to the described situation.

Local validation results are recorded after the inventory checks and localhost restart below. No GitHub push is authorized by this update.

Validation completed: all 23 inventory tests passed. A before/after comparison verified original audit fields, formats, option IDs/order, keys, scores and prior Thai text remained unchanged, and unrelated question records were unchanged. The admin assets were rebuilt. The restarted localhost served every new checkpoint with the expected scenario, prompt, choices, explanation and no-artifact decision; the English inventory page returned HTTP 200. Server startup required a short warm-up before accepting connections. This verifies local implementation, not Thai semantic equivalence, resolution of content issues or scored-release approval. No push was performed.
## Consolidated version 2026.10.05 V.0

At the user's request, the complete current draft and live review inventories were combined into a dated local snapshot named **2026.10.05 V.0**. The snapshot retains all saved reviewed wording and unrevised records with their existing review status. Original audit versions, text, formats, choices, keys, scores and Thai synchronization status remain unchanged. Chat-only candidates and artifacts absent from the inventory have not been silently promoted.

The Version selector now separates dated saved review versions from original audit source versions. Selecting the dated version reads its frozen index and question-detail files. This includes both draft and live-bank questions, including TREND-D4-SECURITY-GOVERNANCE-PROFICIENT-01. Other explicitly selected filters still apply. All versions continues to show the working inventory. Existing browser review activity remains keyed to question ID, not a version-specific sign-off.

The registry stores the snapshot hash, membership and pending Thai IDs. Duplicate version creation is rejected without changing the snapshot or registry. The builder verifies the frozen content hash. Date-based inventory naming does not rename the rewrite rules or certify release readiness. The detailed workflow is documented in QUESTION_INVENTORY_VERSIONS.md. No push was requested or performed.

Validation: snapshot membership, content hashes and overwrite protection passed. HTTP verification confirmed version-specific draft and live question wording and searches. Browser inspection confirmed the selected date label and one matching result for the TREND question. The preview initially required a longer refresh during asset rebuilding; the dated page subsequently rendered successfully.
