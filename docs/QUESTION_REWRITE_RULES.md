# Question Rewrite Rules and Versioning

Status: Approved v2.1 baseline with provisional wording refinements under review
Current rules version: `2.1`
Last updated: 29 September 2026
Baseline human approval recorded: 23 September 2026
Provisional revision: `2.2-draft`; previously local `1.9-draft`, not yet the final approved standard

## Purpose

This standard guides human and agent-assisted rewrites of assessment questions. It also prevents useful variants from being lost. Rewrites remain proposals until a human reviewer selects and approves a version.

## Provisional local refinements - updated 29 September 2026

The refinements below are a living draft for ongoing question review, with no required number of questions before updating or publishing the rules. On 29 September 2026, the user authorized pushing the current rules and review log to `kj-dee-branch`. The current approved v2.1 core rules below are retained intact. The review began against v1.8; its local refinements were previously labeled v1.9-draft and are now labeled v2.2-draft to avoid colliding with the published v1.9 release. These refinements guide review proposals; publishing the rules does not approve changes to scored items or question-bank files. Track evidence and unresolved challenges in [Rewrite Rule Review Log](QUESTION_REWRITE_RULE_REVIEW_LOG.md).

1. **Check for duplicates first:** Compare the requested ID with the review log and conversation history. Flag a repeated ID before rewriting it. Reuse the reviewed baseline; repeat a rewrite only when requested.
2. **Preserve the selected format:** Read both the original audit wording and user-facing rewrite draft. Preserve the user-selected template, number of questions, number of choices, answer order, and interaction. In this exercise, retain the user-facing draft's one-scenario, two-question, two-choice structure when present; do not collapse it into the audit's four combined choices or adopt an automated format recommendation. Do not force this structure onto items with a different selected template.
3. **Preserve meaning:** Preserve the tested competency, decision-relevant facts, uncertainty, authority boundaries, and answer key during a wording-only rewrite. Do not turn a possible risk into a past or recurring incident. "The refund may already be complete" must not become "the refund is still processing." Identify substantive changes separately rather than hiding them in simpler wording.
4. **Use familiar, correct language:** Prefer plain words and explicit actions when they preserve meaning: "assumed," "over the approval limit," and "names and personal information removed." Use "policy exception," not "policy exceptional," and "personal information," not "personal informations." These are contextual examples, not mandatory substitutions when a technical distinction matters. In particular, do not substitute "assumed" for "inferred" when inference is itself the tested concept.
5. **Use consistent terms:** Use one term for the same source or concept unless a real distinction matters. For example, use "case history" consistently instead of alternating between "supplied records," "case record," and "case history." Do not merge distinct policy, case-history, and payment sources into one label merely for consistency.
6. **Keep the scenario connected:** Make every paragraph clearly relate to the AI's task. Introduce customer or operational details through that task rather than abruptly switching subjects. Example: "The AI is drafting a response about a delayed refund." Do not invent what the AI concluded just to connect the paragraphs.
7. **Make sentences understandable in one reading:** Prefer concrete wording, short sentences, and explicit references. Example: "The draft response includes made-up details where information was left blank in the case history." Avoid unnecessary technical terms, vague pronouns, and unexplained phrases such as "both interpretations." "Contain conflicting information" is clearer here than "give different accounts."
8. **Connect consequences naturally:** Put a consequence beside the behavior or requirement it explains. Where the connection is clear, join them naturally: "...leaves out the rule's exception stated right after it, which changes the meaning of the procedure." Avoid intensifiers such as "the whole meaning" unless supported. Ensure that "it" or "which" has an unambiguous referent; shorter connected sentences are also valid.
9. **Use flexible information order (proposed replacement for core rule 2):** Start with the context needed to understand the task. Present the relevant AI behavior or evidence, connect requirements and consequences to the decisions they affect, then ask the question. Introduce a broader problem or goal first only when it improves understanding. Do not mandate a problem-first structure or emphasize risks the choices do not address.
10. **Simplify authority wording without inventing roles:** Prefer "the person authorized to approve the refund" to "the designated approver" for this audience. Do not substitute "the manager" or assume a higher job rank unless the source establishes it. Preserve the required authority, approval limit, and named-human requirement when present.
11. **Review the whole item together:** Show the scenario, every question and choice, answer key, explanation, and any remaining challenge together. Retain evidence and constraints needed for the tested decisions; record material omissions. Keep repeated answer components identical and improve them wherever they occur. Do not polish only the correct answer or create clues through length, grammar, or specificity.
12. **Separate language fixes from content fixes:** Flag undefined references, overlapping choices, and irrelevant or implausible distractors. Check that every reference in a choice has a basis in the scenario or evidence, and that a broad alternative does not also satisfy the keyed action. Do not invent evidence or silently narrow an option's meaning to protect the key. Distinguish clearer prose from readiness for exam or benchmark use.
13. **Preserve reviewed wording:** Reuse the latest wording the user agreed to. Do not treat an already-reviewed item as a fresh draft. Identify any further proposed change with the exact wording and reason. Distinguish user-agreed wording from assistant suggestions and unresolved original content problems.
14. **Avoid guarantees and unsupported scoring changes:** A prompt instruction can reduce unsupported output; it does not guarantee compliance. Preserve the scoring defined for the selected format. Do not transfer the audit's single-choice 100/0 scoring to two-part questions or invent partial credit when no scoring rule is supplied. Report the known answer key and flag missing scoring definitions. Separately identify and version any substantive change to a choice, format, key, or scoring.

15. **Name what is being estimated or claimed:** Do not leave a key term such as "estimate" without its object. If the source does not specify whether it means an amount, time, or another result, flag the gap and propose a clarification separately. Record the user's agreement before treating added specificity as part of the candidate. The user agreed to interpret the undefined estimate in Capability limits AWARENESS-01 as the refund amount; this was a content clarification, not a fact explicitly present in the original audit.
16. **Introduce references and preserve source scope:** Introduce "a record" before referring to "that record." Name the relevant sources instead of broadening them to "the system." Distinguish naming a record from claiming to use information from it. Identify and agree a change between those meanings rather than presenting it as an equivalent wording substitution. Use natural grammar such as "claims to use information from a record," not "mentions from a record."
17. **Express uncertainty naturally:** Prefer "the team is unsure which amount to use" to "neither estimate is certain." Preserve the difference between a record that cannot be found, a record the AI cannot access, and a record proven not to exist. "May be made up" is not "is made up," and confidence does not establish source support. Inconsistent outputs do not alone prove which output is incorrect or that outdated information caused the problem.

18. **Describe the AI's action directly:** When describing generated output, use a concrete subject and verb, such as "The AI generates a recommendation in its draft." Use "generates" with the singular subject "AI." Do not simply remove the main verb from a sentence, and do not replace every AI action with "generates": preserve distinctions such as searching, quoting, retrieving, and recommending when they matter. Generating a recommendation does not grant the AI authority to make the final decision.

19. **Show the evidence without naming the answer:** When a question asks the reader to identify a mechanism, describe its observed effect in the scenario instead of explicitly naming that mechanism. In the finance context-window item, retain "When the conversation gets too long, the AI no longer sees some earlier instructions." Do not add "hits its context limit" before asking what causes the behavior. Explain "context window" in the feedback. This does not justify removing evidence needed to answer or banning technical terms when they are not the answer being tested.
20. **Simplify technical effects without inventing intent:** Prefer natural, direct wording over phrases such as "are left out of the information available to the AI." In the finance example, "no longer sees" means earlier instructions are absent from the current input; it does not mean the AI deliberately deletes them or that they disappear from the stored chat. "Can no longer see" is also correct English. If the user prefers to remove "can," adjust the verb to "sees" while preserving meaning. Keep this statement specific to the described case; do not claim that every long conversation always loses instructions.
21. **Respect clarified terminology and keep it aligned:** Explain a material ambiguity once, then retain the wording and meaning the user agrees to. In the HR qualifications item, the user defines "employee qualifications" as the criteria or conditions an employee must meet, and prefers "The prompt clearly states what kind of answer the AI should generate, but it does not specify the crucial conditions regarding employee qualifications." Keep that meaning consistent in the scenario, choices, and explanation. Record the shift from the original single eligibility rule to this agreed phrasing; do not treat the terms as universally interchangeable or invent a benefit, role, or specific criterion. Use the clear contrast between what the prompt specifies and omits when the evidence supports it.

22. **Make the task purpose and output concrete when needed:** If an artifact or scenario is hard to understand without the goal, state what the team wants to achieve and what the AI is helping produce. In the agreed marketing example, encourage reusable-bag use through a public social-media post with a caption and image. Include audience or channel only when it affects interpretation or a choice. This refines flexible information order; it does not impose a goal-first opening on every question.
23. **Connect each question to its evidence:** Use the sequence scenario, artifact, then questions, preserving the selected template and answer order. Make the supporting evidence clear, whether it is an AI action described in the scenario or a record the reader must inspect in the artifact. Keep detailed evidence in the artifact rather than duplicating it all in prose. Unexplained X/Y labels or similarity scores alone do not show the numerical-representation process; include the necessary observable process without naming the mechanism being tested. Do not require an artifact panel for every part when the scenario already supplies that part's evidence.
24. **Keep evidence meanings distinct:** Explain what a comparison or score represents in plain language. Meaning similarity is not factual verification, permission, confidence, or a forecast of campaign results. In feedback, distinguish the representation step from retrieval even though retrieval can use numerical representations. Avoid claiming that related processes are mutually exclusive merely because they are competing choices.
25. **Record artifact additions and omissions as content decisions:** A clearer artifact may require fictional examples, metadata, or a concrete objective absent from the audit. Identify these separately and retain the user's agreement before treating them as the reviewed baseline. Keep relevant permission boundaries and AI evidence. Do not invent performance claims to justify generic source wording, and record why an unused requirement was omitted. Agreement to the candidate does not itself authorize question-bank implementation or establish release readiness. Follow the canonical artifact standard for generation and QA.
26. **Name the specific claim or outcome:** Use "the draft's time-saving claim" instead of "the app's performance" when the evidence measures time spent completing a task. Name the task so the reader can connect the source result to the claim. Do not confuse user outcomes with technical app speed, and do not invent a metric absent from the source without identifying it as a proposed clarification.
27. **Avoid repeating the same AI process in prose and the artifact:** Keep a short process description in the scenario when that is sufficient, and let the artifact show the source evidence and generated output for comparison. Remove a repeated panel only if it adds no necessary evidence. Update prompts and feedback to match the resulting item: for the agreed marketing example, use "Which process does the AI use to prepare the draft?" rather than referring to the removed activity record. Preserve the selected format, choice order and key.
28. **Separate a correct calculation from a supported claim:** A draft can repeat a numerically correct pilot result while omitting who was tested and under what conditions. Explain that distinction directly. A change in average task time for selected users does not establish the same outcome for all customers, a benefit for every participant, or causation. Preserve the original evidence-scope decision without turning the question into a calculation exercise or inventing statistical certainty.

During review, show the revised question, all choices, correct answer, explanation, and any remaining challenge together. Include scoring only when it is defined for that format. Keep question rewrites in the conversation unless the user separately requests implementation; review-log checkpoints are not question-bank updates. Reviewing an item does not itself approve it. Save accumulated rule refinements locally and do not report review totals or progress counts. Publish them to `kj-dee-branch` only when the user explicitly says "push" or otherwise directly requests publication. A push request authorizes the current accumulated updates, not automatic publication of future refinements. There is no fixed review-count gate. Final rule approval remains distinct from publishing this draft.

These wording-only refinements do not override the v2.1 AI-necessity, answer-key, translation, numerical, or partial-credit standards. If those standards identify a need to change the selected format, key, or construct, flag it as a substantive revision for separate review rather than silently changing the wording-only candidate.

## Thai wording refinements - local review update

Consistency checked: 30 September 2026 against the accepted Thai marketing wording in the review log. The [localisation guide checklist](LOCALISATION.md#latest-thai-rewrite-checklist--verified-30-september-2026) now summarizes all six refinements below. This documentation check does not change the approved v2.1 baseline or promote v2.2-draft to approved status.

These refinements apply alongside the provisional rules above and [Question Bank Localisation](LOCALISATION.md). They reflect the user's accepted Thai wording for `NH-FUNCTION-MARKETING-D1-GENAI-MECHANICS-AWARENESS-02`. After the local update, the user explicitly authorized publication to `kj-dee-branch` on 29 September 2026. Future refinements still require a new push request. The approved English meaning remains the reference, while Thai sentence structure should be natural rather than literal.

1. **ระบุให้ชัดว่าใครทำอะไรและเกิดผลกับสิ่งใด:** เมื่อกล่าวถึงผลลัพธ์ ให้ระบุผู้ใช้ การใช้เครื่องมือ และงานที่วัดตามข้อมูลต้นฉบับ เช่น "หลังใช้แอป ผู้ใช้ประหยัดเวลาเตรียมรายการซื้อของได้ตามที่ร่างโพสต์กล่าวอ้างหรือไม่" ไม่ย่อจนเหลือ "การประหยัดเวลาในร่างโพสต์" ซึ่งทำให้ความสัมพันธ์ระหว่างการใช้แอปกับผลลัพธ์ไม่ชัดเจน
2. **แยกคำกล่าวอ้างออกจากผลที่เกิดขึ้นจริง:** ร่างโพสต์เป็นสิ่งที่ต้องตรวจสอบ ไม่ใช่หลักฐานยืนยันผลลัพธ์ ใช้ "ตามที่ร่างโพสต์กล่าวอ้างหรือไม่" เมื่อต้องตรวจว่าข้อมูลรองรับคำกล่าวนั้นหรือไม่ อย่าเขียนเป็นข้อสรุปว่าแอปทำให้ประหยัดเวลาได้แน่นอน และอย่าตีความคำว่า "หลังใช้" ว่าเป็นหลักฐานยืนยันเหตุและผล
3. **บอกว่าต้องตรวจอะไรและตรวจจากข้อมูลใด:** เชื่อมการกระทำของทีมกับหลักฐานโดยตรง เช่น "ทีมต้องตรวจสอบจากข้อมูลในภาพประกอบว่า..." เมื่อหลักฐานอยู่ใน artifact ใช้ "ภาพประกอบ" ในข้อความสำหรับผู้ทำแบบประเมินเมื่อเหมาะกับชนิดหลักฐาน หากเป็นเอกสาร ตาราง หรือบันทึก ให้เรียกตามชนิดจริง ไม่เปลี่ยนทุกแหล่งข้อมูลให้เป็นภาพ
4. **แปลความหมายเป็นภาษาไทยที่อ่านเข้าใจได้ในครั้งเดียว:** จัดลำดับผู้กระทำ การกระทำ ผลลัพธ์ และสิ่งที่ต้องตรวจตามบริบท เชื่อมย่อหน้าให้ต่อเนื่อง และใช้คำเรียกงาน แอป ผลลัพธ์ และหลักฐานให้สม่ำเสมอ หากประโยคยาวให้แยกโดยไม่ตัดเงื่อนไขสำคัญ ไม่บังคับใช้โครงสร้างประโยคเดียวกับทุกคำถาม
5. **คงขอบเขตและเงื่อนไขของผลการทดลอง:** ระบุว่าเป็นค่าเฉลี่ยของผู้ใช้ที่คัดเลือกมาและเป็นงานใดเมื่อข้อมูลนี้มีผลต่อคำตอบ อย่าแปลผลเฉลี่ยเป็นผลของทุกคน เปลี่ยนกลุ่มทดลองเป็นลูกค้าทั้งหมด หรือเพิ่มความแน่นอนที่ต้นฉบับไม่ได้ระบุ
6. **ตรวจภาษาไทยทั้งชุดและเก็บฉบับที่ผู้ใช้ยอมรับ:** ตรวจสถานการณ์ คำถาม ตัวเลือก ข้อความในภาพ เฉลย และคำอธิบายให้หมายถึงสิ่งเดียวกัน คงรูปแบบ จำนวนข้อ ลำดับตัวเลือก เฉลย และตัวเลขเดิม เมื่อแก้ประโยคเกี่ยวกับผลลัพธ์ ให้ตรวจคำถามที่อ้างถึงผลนั้นด้วย บันทึกฉบับที่ผู้ใช้ระบุว่า "pass" และนำกลับมาใช้ ไม่เปลี่ยนถ้อยคำที่ตกลงแล้วโดยไม่มีเหตุผล

Accepted example:

> ก่อนเผยแพร่ ทีมต้องตรวจสอบจากข้อมูลในภาพประกอบว่า หลังใช้แอป ผู้ใช้ประหยัดเวลาเตรียมรายการซื้อของได้ตามที่ร่างโพสต์กล่าวอ้างหรือไม่ และภาพได้รับอนุญาตให้ใช้ในแคมเปญหรือไม่

This example clarifies the object of verification; it does not add evidence, prove causation, or change the answer key. User acceptance of the wording is recorded separately from application implementation and release validation.

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
34. Require mutually exclusive choices only when the item is intentionally **single-best-answer**. Define one decision and one evidence boundary, and keep choices at the same level of action. If several actions can reasonably coexist, use multi-select, ranking, multi-part, or written response instead of forcing artificial exclusivity.
35. Partial credit is appropriate when it serves a measurement purpose, especially in proficient and advanced items. Use it to distinguish incomplete from complete evidence, reward correct reasoning steps, measure prioritization, or separate a sound diagnosis from a sound action. Do not use partial credit merely because a distractor sounds plausible.
36. Independently recompute every derived value, ratio, percentage, total, rate, and comparison used by the scenario, artifact, options, key, or explanation. A numerically correct artifact can still be invalid if the selected metric does not support the stated decision.
37. Check operational feasibility. A proposed action must account for the time, traffic, budget, permission, data, and workflow needed to perform it. Do not recommend gathering a larger sample while also prohibiting the resources required to gather it.
38. Distinguish **limited testing** from **wider deployment or scaling**. When more evidence is needed, define a bounded test, cap, duration, stopping rule, or approval gate rather than describing uncertainty resolution as consequence-free.
39. Stress-test the key by writing the strongest reasonable argument for every option. Revise the item when a distractor can satisfy the prompt without contradicting explicit evidence or constraints.

## Partial-credit standard

Use partial credit when the item contains observable components that can be scored independently:

- **Multi-select:** assign credit to each required correct selection and apply a defined penalty or cap for unsafe or contradictory selections.
- **Multi-part:** assign declared weights to diagnosis, evidence, action, explanation, or communication components.
- **Ranking:** award credit for correctly placing critical first/last actions or for valid pairwise ordering, not for vague closeness.
- **Written response:** use an analytic rubric with named criteria, evidence requirements, point ranges, and examples of full, partial, and absent evidence.
- **Progressive options:** options may represent ordered proficiency levels only when each level is intentionally authored, the rubric explains the qualitative difference, and pilot evidence supports the ordering.

Every partial-credit rubric must state:

1. The competency evidence each point component represents.
2. Why partial performance deserves credit.
3. The maximum points for each component and a total of 100 raw item points.
4. How contradictions, unsafe actions, irrelevant additions, and blank responses are handled.
5. What feedback the user receives about earned and missing evidence.

Do not assign values such as `45` or `20` to ordinary wrong choices after the question has been written. If option-level partial credit is intended, author the options as explicit proficiency levels before pilot use and validate their ordering with reviewers and response data.

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

### Provisional 2.2-draft local finance and HR refinements - 29 September 2026

- Saved the agreed finance sentence "When the conversation gets too long, the AI no longer sees some earlier instructions."
- Added safeguards against naming the tested mechanism in the scenario, implying deliberate deletion, or treating a case-specific effect as universal AI behavior.
- Recorded natural grammar choices without claiming that "can no longer see" is incorrect.
- Saved the HR qualifications terminology clarification and both item checkpoints. The user authorized publishing this follow-up; future refinements remain local until another explicit push request.

### Provisional 2.2-draft action wording and publication workflow - 29 September 2026

- Added direct AI-action wording from the HR Prompt design review: "The AI generates a recommendation in its draft."
- Recorded the agreed scenario and unchanged user-facing template, choices, and keys in the review log; retained the original distractor concern.
- Clarified that future refinements stay local until the user explicitly requests a push. Omit review-count reporting and preserve question-specific evidence.

### Provisional 2.2-draft follow-up - 29 September 2026

- Recorded further lessons from Capability limits reviews without using a review-count target or progress tally.
- Added explicit objects for estimates, introduced references, precise source scope, and natural uncertainty wording.
- Recorded user-agreed clarifications separately from original audit facts: refund-amount estimation and a claim to use information from a record.
- The user authorized publishing this follow-up, removing review-count wording while retaining question-specific evidence. Question-bank content is unchanged.

### Provisional 2.2-draft integration - 29 September 2026

- Preserved all approved v2.1 rules and the partial-credit standard while adding the local wording refinements and challenge log.
- Renamed the local v1.9-draft refinements to v2.2-draft to avoid collision with the published v1.9 release; historical local entries below retain their original labels.
- Removed the fixed review-count gate and authorized publishing the living draft without promoting scored questions.

### Provisional 1.9-draft update - 29 September 2026

- Consolidated lessons from question reviews, including preservation of the user-facing template, duplicate checks, and retention of agreed wording.
- Added connected scenario paragraphs, familiar grammar and terminology, natural consequences, and authority wording that does not invent a job role.
- Preserved uncertainty such as a potentially completed refund; distinguished it from a refund still processing.
- Added explicit checks for undefined references and overlapping choices, and prohibited assumed scoring transfers between formats.
- Updated the review log with question IDs, wording checkpoints, user feedback, and unresolved challenges.
- Removed the fixed question-review target and publication delay at the user's request. Publishing the living draft is authorized; final rule approval and scored-item promotion remain separate decisions.

### Provisional 1.9-draft - 24 September 2026

- Recorded local refinements from reviews of customer service Prompt design APPLIED-01, APPLIED-02, and APPLIED-03.
- Added task/context ordering, whole-item relevance checks, consistent terminology, plain action wording, shared-choice consistency, meaning preservation, and non-guaranteed AI behavior guidance.
- Started a challenge log for an initially bounded review exercise. Its count requirement and deferred-publication condition were superseded by the user's 29 September instruction to publish the living draft without a fixed review count.
- Kept the approved v1.8 core rules intact for comparison; no question-bank promotion is implied.


### Version 2.1 - 23 September 2026

- Clarified that mutually exclusive choices are required for single-best-answer items, not every assessment format.
- Preserved partial credit for difficult questions when it measures explicit competency evidence, reasoning stages, prioritization, or completeness.
- Added format-specific partial-credit guidance for multi-select, multi-part, ranking, written-response, and intentionally progressive options.
- Required transparent criteria, weights, contradiction handling, and user feedback for every partial-credit rubric.

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
