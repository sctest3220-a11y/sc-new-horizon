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

## Challenge checklist to test and refine

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
