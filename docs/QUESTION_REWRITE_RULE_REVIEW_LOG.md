# Rewrite Rule Review Log

Status: Living working draft; publication authorized 29 September 2026
Started: 24 September 2026
Last updated: 29 September 2026
Approved comparison baseline: Question Rewrite Rules v1.8
Working refinements: 1.9-draft
Target GitHub branch: `kj-dee-branch`

## Review agreement

Continue reviewing questions with the user without a fixed question-count requirement. On 29 September 2026, the user authorized publishing the current rewrite rules and challenge log to `kj-dee-branch`, superseding the earlier count target and publication delay. Six unique questions have been discussed so far; this is a historical count, not final item approval or a completion threshold. Check the IDs below and conversation history for duplicates before rewriting; repeated IDs do not increase the count. Continue reviewing the questions the user selects rather than automatically generating further items.

For each item, read both the original audit wording and the user-facing rewrite draft, from localhost when requested and available. Preserve the selected user-facing template, question count, choices, and answer order. Show the complete proposed item with the answer key, explanation, and remaining concerns. Include scoring only if defined for that format; do not carry combined-choice scoring into a two-part template. Preserve original meaning and distinguish wording cleanup from substantive changes. Reuse agreed wording; identify proposed changes explicitly. Update local rule notes as feedback emerges. Do not update question-bank data or localhost question content unless separately requested.

## Evidence from reviewed questions

| Question ID | Feedback and rule lesson | Remaining challenge |
| --- | --- | --- |
| NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-APPLIED-01 | A broader goal need not come first. The version-comparison task and refund approval boundary directly support the choices. Avoid treating possible duplicate compensation or denied support as an established recurring problem. Original scoring: A = 100; B/C/D = 0. | Missing-information distractors do not address the observed summarization failure. Improving them substantively needs a separate revision. |
| NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-APPLIED-02 | Place the duplicate-refund consequence beside the uncertain payment status. Preserve both audience-aware prompt repair and payment verification. Original scoring: B = 100; A/C/D = 0. | Version-comparison distractors are weak. Audit single-choice scoring, a suggested multi-select format, and the two-part user-facing draft are not interchangeable without a scoring decision. |
| NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-APPLIED-03 | Use "case history" consistently. User prefers "The draft response includes made-up details where information was left blank"; clarify the location as "in the case history." Use "assumed" and direct status/action wording consistently across shared answer components. Original scoring: C = 100; A/B/D = 0. | "Validate every required field" may imply factual validation, making the distractor ambiguous. Reporting completion "to reassure" is easy to reject. Prompt instructions reduce fabrication risk but cannot guarantee compliance. |

| NH-FUNCTION-CUSTOMERSERVICE-D3-SOURCE-VERIFICATION-APPLIED-01 | Preserve the two-part user-facing format. Use "policy exception," "over" for the refund limit, and "the person authorized to approve" without inventing a manager role. User-facing keys: 1B, 2B. Repeated requests for this ID count once. | Choice 1A has undefined interpretations and overlaps source checking. Earlier combined-choice rewrites were a format mistake, not the current template. |
| NH-FUNCTION-CUSTOMERSERVICE-D3-SOURCE-VERIFICATION-APPLIED-02 | Connect refund details to the AI task. User agreed: "The AI is drafting a response about a delayed refund. An earlier refund attempt timed out, but the refund may already be complete." Retain "conflicting information" and the reviewed questions/choices. User-facing keys: 1B, 2A. | Choice 1A assumes a missing exception not established in the scenario. "Still processing" would change the original completed-payment uncertainty. |
| NH-FUNCTION-PEOPLE-D3-SOURCE-VERIFICATION-APPLIED-01 | Simplify anonymized records as "names and personal information removed." Connect the omitted exception to its consequence in the same sentence where clear. Preserve the requirement for a named authorized human. User-facing keys: 1B, 2B. | Choice 1A again has undefined interpretations and overlaps the intended source check. Avoid "whole meaning" without evidence. Latest HR wording is an assistant refinement of user feedback, not separately confirmed final wording. |

## Fourth item - source verification review history

Question: `NH-FUNCTION-CUSTOMERSERVICE-D3-SOURCE-VERIFICATION-APPLIED-01`

Applied v1.9-draft to both audit wording and user-facing draft. Retain the omitted policy exception, refund approval limit, and approval authority. The early combined-choice candidate retained audit scoring (C = 100; A/B/D = 0), but the user subsequently clarified that the original two-part user-facing format must be kept. Current template: one scenario, two questions, two choices each; keys 1B and 2B. Do not transfer audit scoring to that template. Distinguish an exception written in a policy from approval for a refund above the team's limit; do not imply that they are the same exception.

Challenge: the audit's A and D refer to "both interpretations," but neither source version defines two interpretations. In the selected two-part template, this issue is in question 1A. Checking the original source could also reveal the omitted exception and overlap the intended check. A wording-only rewrite cannot establish a uniquely defensible answer without changing or clarifying that distractor. The original keys are not newly validated benchmark keys. Do not invent two interpretations merely to make the inherited choices work.

The candidate omits generic duplicate-compensation/denied-support risks and uses the directly supported consequence that omitting the exception changes the policy's meaning. The existing text supports choosing a verification action, not demonstrating source inspection: an actual policy excerpt and AI quote would require newly authored, reviewed evidence. The draft should remain on hold for benchmark use until the distractor ambiguity is resolved.

Challenge-check refinement now recorded in provisional v1.9-draft: confirm that every reference in every choice (for example, "both interpretations") has an explicit basis in the scenario or evidence, and that broad verification actions do not overlap the keyed action. No final rule version is approved yet.

The user challenged an unnecessary repeat rewrite. Retain the earlier reviewed wording: "leaves out the policy exception in the next sentence," "This changes the meaning of the policy," and "put the missing exception back into the response." Do not introduce stylistic variations without explaining the proposed change.

## Fifth item - agreed wording checkpoint

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

## Sixth item - HR language feedback

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

## Challenge checklist to test and refine

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
- Does the question or explanation overstate what a prompt instruction can guarantee?
- Is scoring defined for the selected format, rather than borrowed from the audit's combined-choice key? Keep format changes outside a wording-only rewrite unless separately requested.
- What counterexample would make a proposed rule unhelpful or misleading?

## Ongoing publication and finalization

Publish the authorized current rule documents to `kj-dee-branch` without a question-count gate. Continue consolidating supported refinements, retaining the original baseline through version history and recording rationale and challenge findings. Resolve or explicitly document unresolved issues; do not claim that a set of examples proves perfection or calibration. Record the user's final review decision when the draft is promoted to an approved rules version; publication of the draft does not itself grant that approval or promote scored items. If GitHub authentication is unavailable, report the actual push failure instead of implying publication.
