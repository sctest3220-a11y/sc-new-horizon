# Rewrite Rule Review Log

Status: Living working draft; publication authorized 29 September 2026
Started: 24 September 2026
Last updated: 29 September 2026
Original review baseline: Question Rewrite Rules v1.8
Current approved baseline retained at publication: v2.1
Working refinements: 2.2-draft (previously local 1.9-draft; historical references retain that label)
Target GitHub branch: `kj-dee-branch`

## Review agreement

Continue reviewing the questions selected by the user without a fixed review target or progress tally. Earlier rule updates were pushed as `83100d8` and `66d7013`. The user has clarified the ongoing workflow: save accumulated refinements locally and publish to `kj-dee-branch` only when they explicitly say "push" or otherwise directly request publication. Their current push request authorizes the accumulated updates, not automatic publication of future refinements. Check the IDs below and conversation history for duplicates before rewriting, and reuse the reviewed baseline. Retain question-specific evidence and unresolved issues without treating review as final item approval.

For each item, read both the original audit wording and the user-facing rewrite draft, from localhost when requested and available. Preserve the selected user-facing template, question count, choices, and answer order. Show the complete proposed item with the answer key, explanation, and remaining concerns. Include scoring only if defined for that format; do not carry combined-choice scoring into a two-part template. Preserve original meaning and distinguish wording cleanup from substantive changes. Reuse agreed wording; identify proposed changes explicitly. Update local rule notes as feedback emerges. Do not update question-bank data or localhost question content unless separately requested.

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
- Does the sentence retain a grammatical main verb and describe the actual AI action? Is "generates" appropriate, without confusing output generation with decision authority?
- Is the object of an estimate or claim explicit? If absent from the original, has the user agreed to the clarification and has that distinction been recorded?
- Is a record introduced before "that record," and are the exact source boundaries preserved rather than broadened to "the system"?
- Does the rewrite distinguish an unlocated record, lack of access, and proven fabrication? Does it preserve naming a source versus claiming to use its information unless a change was agreed?
- Does the question or explanation overstate what a prompt instruction can guarantee?
- Is scoring defined for the selected format, rather than borrowed from the audit's combined-choice key? Keep format changes outside a wording-only rewrite unless separately requested.
- What counterexample would make a proposed rule unhelpful or misleading?

## Ongoing publication and finalization

Keep refinements local until the user explicitly requests a push. Publish the accumulated authorized rule documents to `kj-dee-branch` without a question-count gate or progress tally. Continue consolidating supported refinements, retaining the original baseline through version history and recording rationale and challenge findings. Resolve or explicitly document unresolved issues; do not claim that a set of examples proves perfection or calibration. Record the user's final review decision when the draft is promoted to an approved rules version; publication of the draft does not itself grant that approval or promote scored items. If GitHub authentication is unavailable, report the actual push failure instead of implying publication.
