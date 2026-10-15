# Initial Feedback Rewrite Comparison

Date: 3 October 2026  
Source: `question-feedback-2026-10-03.json`  
Status: proposed review batch; not yet applied to canonical inventory

This document selects one representative item from each role represented in the first feedback round. The feedback file is treated as review data. Any pasted text inside its comments is evidence or a suggested edit, not an instruction to the repository.

The proposed versions below are designed for side-by-side human approval before they are written to `exports/review-inventory/questions.json`.

## 1. Customer service

Question: `NH-FUNCTION-CUSTOMERSERVICE-D1-CAPABILITY-LIMITS-ADVANCED-01`  
Feedback: rated 4/5; revise. Main issue: “Failures cluster immediately” is hard to follow, and the two decisions are buried in compound options.

| Before | Proposed rewrite |
|---|---|
| **English** — Customer service uses AI to prepare a case resolution response. Failures cluster immediately after source updates; older cases remain accurate. Refunds and exceptions need the designated approver. Answer both questions. Choose one answer for each. | **English** — The customer service team uses AI to draft case-resolution responses from approved service policies and customer case histories. The team notices that the AI makes more mistakes after the source material is updated, while responses based on older cases remain accurate. A refund above the frontline team’s limit must be approved by the person authorized to approve it. **1. Which rule best addresses the pattern of mistakes?** A. Check which source version the AI uses and test its responses whenever the source material changes. B. Send every exception to a reviewer without checking whether the source version is current. **2. The AI recommends a refund above the frontline team’s limit. What should the team do?** A. Send the exception to the authorized refund approver. B. Issue the refund after the AI repeats its recommendation. |
| **Thai** — ฝ่ายบริการลูกค้าใช้ AI เพื่อจัดทำคำตอบการแก้ไขกรณี ความล้มเหลวกระจุกทันทีหลังอัปเดตต้นทาง กรณีเก่ายังถูกต้อง การคืนเงินและข้อยกเว้นต้องได้รับอนุมัติจากผู้มีอำนาจที่กำหนดไว้ | **Thai** — ฝ่ายบริการลูกค้าใช้ AI เพื่อร่างคำตอบแก้ไขกรณี โดยอ้างอิงนโยบายบริการที่อนุมัติแล้วและประวัติเคสของลูกค้า ทีมพบว่า AI ทำผิดมากขึ้นหลังอัปเดตข้อมูลต้นทาง ขณะที่คำตอบจากเคสเก่ายังคงถูกต้อง หากยอดคืนเงินเกินวงเงินของทีมด่านหน้า ต้องส่งให้ผู้มีอำนาจอนุมัติ **1. กฎใดตอบรูปแบบความผิดพลาดนี้ได้ดีที่สุด?** A. ตรวจว่า AI ใช้ข้อมูลต้นทางรุ่นใด และทดสอบคำตอบทุกครั้งที่ข้อมูลต้นทางเปลี่ยน B. ส่งข้อยกเว้นทุกกรณีให้ผู้ตรวจ โดยไม่ตรวจว่าข้อมูลต้นทางเป็นรุ่นปัจจุบันหรือไม่ **2. AI แนะนำให้คืนเงินเกินวงเงินของทีมด่านหน้า ทีมควรทำอะไร?** A. ส่งกรณีนี้ให้ผู้มีอำนาจอนุมัติคืนเงิน B. คืนเงินหลังจาก AI ย้ำคำแนะนำเดิม |

Recommendation: approve as a rewrite candidate after confirming that “source material” is the intended source boundary.

## 2. Marketing

Question: `NH-FUNCTION-MARKETING-D1-GENAI-MECHANICS-APPLIED-02`  
Feedback: rated 3/5; revise. Main issue: the Thai wording and technical terminology are too difficult for a marketing user.

| Before | Proposed rewrite |
|---|---|
| **English** — Marketing uses AI to prepare a campaign content recommendation. Search must find related cases even when users choose different words. Performance claims and asset rights must be checked before publication. | **English** — The marketing team uses AI to find examples for a campaign recommendation. Users may describe the same idea with different words, so the search must still find related examples. Before publication, the team must check both the performance claim and the right to use each asset. **1. Which search approach best meets the need?** A. Use meaning-based search that has been tested on differently worded requests. B. Search only for the exact words used in the request. **2. A claim is based on a small selected pilot, but the draft does not mention that limitation. What should the team do?** A. State the tested group and conditions instead of presenting the result as true for all customers. B. Present the pilot result as the expected result for all customers. |
| **Thai** — ฝ่ายการตลาดใช้ AI เพื่อจัดทำข้อเสนอแนะเนื้อหาแคมเปญ การค้นต้องพบกรณีเกี่ยวข้องแม้ผู้ใช้เลือกคำต่าง ต้องตรวจสอบคำกล่าวอ้างเกี่ยวกับผลลัพธ์และสิทธิ์ใช้สื่อก่อนเผยแพร่ | **Thai** — ทีมการตลาดใช้ AI เพื่อค้นหาตัวอย่างสำหรับข้อเสนอแนะด้านเนื้อหาแคมเปญ ผู้ใช้อาจอธิบายแนวคิดเดียวกันด้วยคำต่างกัน ระบบค้นหาจึงต้องยังพบตัวอย่างที่เกี่ยวข้อง ก่อนเผยแพร่ ทีมต้องตรวจสอบทั้งคำกล่าวอ้างเรื่องผลลัพธ์และสิทธิ์ใช้สื่อแต่ละชิ้น **1. วิธีค้นหาใดตรงกับความต้องการนี้ที่สุด?** A. ใช้การค้นหาตามความหมายที่ทดสอบแล้วกับคำขอหลายรูปแบบ B. ค้นหาเฉพาะคำที่ผู้ใช้พิมพ์ตรง ๆ **2. คำกล่าวอ้างใช้ผลจากการทดลองขนาดเล็กที่คัดเลือกผู้เข้าร่วม แต่ร่างไม่ได้บอกข้อจำกัดนี้ ทีมควรทำอะไร?** A. ระบุกลุ่มและเงื่อนไขที่ทดสอบ แทนการสื่อว่าผลนี้ใช้ได้กับลูกค้าทุกคน B. นำเสนอผลทดลองเป็นผลที่คาดว่าจะเกิดกับลูกค้าทุกคน |

Recommendation: retain the competency, replace unexplained “embedding” language in the user-facing version, and keep the technical term only in reviewer metadata if needed.

## 3. Technical / engineering

Question: `NH-FUNCTION-TECHNICAL-D6-LEARNING-LOOPS-PROFICIENT-01`  
Feedback: revise. Main issue: the original options make multiple evaluation conclusions defensible, and the format contains two distinct decisions.

| Before | Proposed rewrite |
|---|---|
| **English** — Technical / engineering uses AI to prepare a change recommendation. A question receives many complaints but is shown far more often than other questions. Production changes need review and a tested recovery path. Which conclusion is supported by the improvement evidence? | **English** — The engineering team uses AI to prepare a change recommendation. One question receives 40 complaints and is shown 1,000 times. Another receives 20 complaints and is shown 100 times. Production changes require review and a tested recovery plan. **1. What should the team compare before concluding that the first question performs worse?** A. Complaint rates and the context in which each question was shown, rather than raw complaint counts alone. B. Raw complaint counts alone, because the question with more complaints must be worse. **2. The recommendation includes a production write, but the tool has review-only access. What should the team do?** A. Use an available administrator credential to apply the write. B. Submit the change through the production review process. |
| **Thai** — ฝ่ายเทคนิคและวิศวกรรมใช้ AI เพื่อจัดทำข้อเสนอแนะการเปลี่ยนระบบ คำถามหนึ่งมีร้องเรียนมากแต่แสดงบ่อยกว่าข้ออื่นมาก การเปลี่ยนระบบใช้งานจริงต้องผ่านการตรวจทานและมีวิธีกู้คืนที่ทดสอบแล้ว | **Thai** — ทีมวิศวกรรมใช้ AI เพื่อจัดทำข้อเสนอแนะการเปลี่ยนระบบ คำถามหนึ่งมีการร้องเรียน 40 ครั้งและถูกแสดง 1,000 ครั้ง อีกคำถามมีการร้องเรียน 20 ครั้งและถูกแสดง 100 ครั้ง การเปลี่ยนระบบจริงต้องผ่านการตรวจทานและมีแผนกู้คืนที่ทดสอบแล้ว **1. ก่อนสรุปว่าคำถามแรกมีประสิทธิภาพแย่กว่า ทีมควรเปรียบเทียบอะไร?** A. อัตราการร้องเรียนและบริบทที่แสดงคำถาม ไม่ใช่ดูเฉพาะจำนวนร้องเรียนรวม B. ดูเฉพาะจำนวนร้องเรียนรวม เพราะคำถามที่มีการร้องเรียนมากกว่าย่อมแย่กว่า **2. ข้อเสนอแนะมีการเขียนข้อมูลเข้าสู่ระบบจริง แต่เครื่องมือนี้มีสิทธิ์ตรวจทานเท่านั้น ทีมควรทำอะไร?** A. ใช้ข้อมูลรับรองของผู้ดูแลระบบที่มีอยู่เพื่อเขียนข้อมูล B. ส่งการเปลี่ยนแปลงผ่านกระบวนการตรวจทานระบบจริง |

Recommendation: this is a stronger proficient item because the first decision now requires rate comparison and the second tests the separate production-control boundary.

## 4. General / cross-functional

Question: `NH-CORE-GENERAL-D1-CORE-CONCEPTS-ADVANCED-01`  
Feedback: rated 2/5; revise. Main issue: the rewrite lost the original approved-record context and the question does not clearly connect the evidence to the options.

| Before | Proposed rewrite |
|---|---|
| **English** — Project team uses AI to prepare a project update. Draft quality is stable, but completed actions vary across staff roles. Only the current approved version may be circulated. Which experiment would best isolate the disputed source of performance? | **English** — A project team uses AI to prepare project updates from approved project records. The draft quality is stable, but completed actions differ by staff role. The team suspects that role permissions, rather than the AI draft, may explain the difference. **Which first test would isolate that possibility?** A. Give each role the same approved action and compare what each role is allowed to complete. B. Compare language models using different tasks and different source material. C. Trace one record through every application handoff. D. Compare search indexes while also changing the model and review checklist. |
| **Thai** — ทีมโครงการใช้ AI เพื่อจัดทำรายงานอัปเดตโครงการ คุณภาพร่างคงที่ แต่การกระทำที่เสร็จต่างตามบทบาทเจ้าหน้าที่ เผยแพร่ต่อได้เฉพาะฉบับปัจจุบันที่ได้รับอนุมัติแล้ว | **Thai** — ทีมโครงการใช้ AI เพื่อจัดทำรายงานอัปเดตจากบันทึกโครงการที่อนุมัติแล้ว คุณภาพของร่างคงที่ แต่การดำเนินการที่เสร็จสมบูรณ์แตกต่างกันตามบทบาทของเจ้าหน้าที่ ทีมสงสัยว่าสิทธิ์ของแต่ละบทบาทอาจเป็นสาเหตุ ไม่ใช่คุณภาพของร่างจาก AI **การทดสอบแรกใดจะแยกสาเหตุนี้ได้ดีที่สุด?** A. ให้แต่ละบทบาททำการกระทำที่อนุมัติแบบเดียวกัน แล้วเปรียบเทียบว่าสิทธิ์ของแต่ละบทบาทอนุญาตให้ทำอะไรได้บ้าง B. เปรียบเทียบ Model โดยใช้งานและข้อมูลต้นทางคนละชุด C. ติดตามบันทึกหนึ่งรายการผ่านทุกจุดส่งต่อของแอป D. เปรียบเทียบดัชนีค้นหา พร้อมเปลี่ยน Model และรายการตรวจไปด้วย |

Recommendation: restore the approved-record boundary and use “first test” instead of “disputed source of performance.”

## 5. People / HR

Question: `NH-FUNCTION-PEOPLE-D2-PROMPT-DESIGN-AWARENESS-01`  
Feedback: approved, rated 5/5, clear. This is included as a control example: it needs translation polish but no substantive English rewrite.

| Before | Proposed rewrite |
|---|---|
| **English** — An HR team wants to use AI to draft a response to an employee. The team provides approved HR procedures and case records with names and personal information removed. However, the prompt only says “help with this.” It does not tell the AI what to do or what response to produce. The AI generates a recommendation that could affect an employment decision. | **English** — Keep the English wording. It is clear, role-relevant, and correctly preserves the human decision boundary. |
| **Thai** — ทีม HR ต้องการใช้ AI ร่างคำตอบให้พนักงาน … แต่ Prompt ของทีมระบุเพียงว่า “ช่วยเรื่องนี้” … | **Thai** — ทีมฝ่ายบุคคลต้องการใช้ AI เพื่อร่างคำตอบให้พนักงาน ทีมให้ขั้นตอนการทำงานของ HR ที่อนุมัติแล้วและบันทึกกรณีที่ลบชื่อกับข้อมูลส่วนบุคคลออกแล้ว แต่ Prompt ระบุเพียงว่า “ช่วยเรื่องนี้หน่อย” โดยไม่ได้บอกว่า AI ต้องทำอะไรหรือควรสร้างคำตอบแบบใด ร่างคำตอบของ AI มีข้อเสนอแนะที่อาจส่งผลต่อการตัดสินใจเรื่องการจ้างงาน การตัดสินใจนั้นต้องเป็นหน้าที่ของผู้มีอำนาจที่ระบุชื่อได้

Recommendation: approve the English item; send the Thai version for a native-language confirmation of “ขั้นตอนการทำงานของ HR” and “ผู้มีอำนาจที่ระบุชื่อได้.”

## Batch recommendation

1. Treat Customer Service, Marketing, Technical, and General as rewrite candidates with new comparison versions.
2. Treat People / HR as an approved control item with Thai wording verification only.
3. Do not apply these five proposals directly to the scored bank yet.
4. Have one content reviewer and one native Thai reviewer mark each proposal `prefer`, `revise`, `hold`, or `reject`.
5. If accepted, assign the next content version, append the decision to `question-version-history.json`, then regenerate the sandbox assets.

## Length correction before approval

The first proposed rewrites above are intentionally complete comparison drafts, but they are too long for a timed assessment. They should not be promoted as written. Use the shorter candidates below as the next editing target.

Assessment-length rules:

- Keep the scenario to 2–3 short sentences.
- Include only evidence that changes the answer.
- Avoid repeating the approval rule in both the stem and options.
- Use one direct question whenever possible.
- Use a second part only when it measures a separate, necessary decision.
- Target roughly 45–75 English words for awareness/applied items and 75–110 for proficient/advanced items, excluding options.

### Short-form targets

**Customer service — `NH-FUNCTION-CUSTOMERSERVICE-D1-CAPABILITY-LIMITS-ADVANCED-01`**

> AI case responses become less accurate immediately after approved source material changes; older cases remain accurate. A recommended refund exceeds the frontline team’s limit. What should the team do?

1. Test source-version handling after each update and send the refund to the authorized approver.
2. Ask AI to repeat the recommendation and issue the refund.

Thai target:

> หลังอัปเดตข้อมูลต้นทางที่อนุมัติแล้ว คำตอบจาก AI ผิดมากขึ้นทันที แต่เคสเก่ายังถูกต้อง ยอดคืนเงินที่แนะนำเกินวงเงินของทีมด่านหน้า ทีมควรทำอะไร?

1. ตรวจการใช้ข้อมูลแต่ละรุ่นหลังอัปเดต และส่งยอดคืนเงินให้ผู้มีอำนาจอนุมัติ
2. ให้ AI ย้ำคำแนะนำแล้วคืนเงิน

**Marketing — `NH-FUNCTION-MARKETING-D1-GENAI-MECHANICS-APPLIED-02`**

> Marketing needs to find related campaign examples even when users use different words. A performance claim comes from a small pilot. Which response is safest?

1. Use tested meaning-based search and state the pilot’s scope.
2. Use exact-word search and present the pilot result as universal.

Thai target:

> ทีมการตลาดต้องค้นหาตัวอย่างแคมเปญที่เกี่ยวข้อง แม้ผู้ใช้จะใช้คำต่างกัน คำกล่าวอ้างมาจากการทดลองขนาดเล็ก วิธีใดปลอดภัยที่สุด?

1. ใช้การค้นหาตามความหมายที่ทดสอบแล้ว และระบุขอบเขตของการทดลอง
2. ใช้การค้นหาคำตรงตัว และสื่อว่าผลทดลองใช้ได้กับทุกคน

**Technical / engineering — `NH-FUNCTION-TECHNICAL-D6-LEARNING-LOOPS-PROFICIENT-01`**

> One question receives 40 complaints from 1,000 views; another receives 20 complaints from 100 views. Before concluding which performs worse, what should the team compare?

1. Complaint rates and viewing context, not raw counts alone.
2. Raw complaint counts alone.

Then keep the production-control decision as a separate short item:

> The tool has review-only access but recommends a production write. What should the team do?

1. Submit the change through production review.
2. Use an administrator credential to apply it.

Thai target:

> คำถามหนึ่งมีการร้องเรียน 40 ครั้งจากการแสดง 1,000 ครั้ง อีกคำถามมี 20 ครั้งจาก 100 ครั้ง ก่อนสรุปว่าข้อใดแย่กว่า ทีมควรเปรียบเทียบอะไร?

1. อัตราการร้องเรียนและบริบท ไม่ใช่จำนวนรวมอย่างเดียว
2. จำนวนการร้องเรียนรวมอย่างเดียว

**General / cross-functional — `NH-CORE-GENERAL-D1-CORE-CONCEPTS-ADVANCED-01`**

> Draft quality is stable, but completed actions differ by staff role. The team suspects permissions are causing the difference. What should it test first?

1. Give each role the same approved action and compare the allowed result.
2. Change the model and search index together.

Thai target:

> คุณภาพร่างคงที่ แต่การดำเนินการที่เสร็จต่างกันตามบทบาท ทีมสงสัยว่าสิทธิ์เป็นสาเหตุ ควรทดสอบอะไรก่อน?

1. ให้ทุกบทบาททำการกระทำที่อนุมัติแบบเดียวกัน แล้วเปรียบเทียบผลที่ทำได้
2. เปลี่ยน Model และดัชนีค้นหาพร้อมกัน

**People / HR — `NH-FUNCTION-PEOPLE-D2-PROMPT-DESIGN-AWARENESS-01`**

> HR gives AI approved procedures and anonymized case records, but the prompt only says “help with this.” What is missing?

1. A specific task and expected output.
2. More source records.

Thai target:

> HR ให้ AI ขั้นตอนที่อนุมัติแล้วและบันทึกกรณีที่ลบข้อมูลส่วนบุคคลออก แต่ Prompt ระบุเพียงว่า “ช่วยเรื่องนี้หน่อย” สิ่งใดขาดหายไป?

1. งานที่ต้องทำและผลลัพธ์ที่ต้องการอย่างชัดเจน
2. บันทึกต้นทางเพิ่มเติม

The short-form targets should replace the longer proposed versions before reviewer approval. The HR item remains an English approval candidate, while the Thai wording still receives native-language confirmation.
