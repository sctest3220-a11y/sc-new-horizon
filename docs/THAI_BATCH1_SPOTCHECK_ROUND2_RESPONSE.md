# Thai Batch 1 Spot Check (Round 2) — Response: Batch 1 Approved, Bank Complete

**Source:** `exports/New_Horizon_Thai_Batch1_SpotCheck_Round2_Reviewed.xlsx` (second reviewer: Thai Proofreading Specialist, 2026-09-14). Verified: the 20 ids are the round-2 sample (`spotcheck_ids.json`), none overlap round 1, and the Thai in the file is the reissued, glossary-aligned text.
**Result:** 20 Approve / 0 Fix / 0 Rewrite; understood on first read and key unambiguous on all 20.
**Decision:** passes the rule → batch 1 (163 items: 137 table entries + 26 inline Horizon items) promoted from `reviewed` to **`approved`**.

## The Thai question bank is now fully approved

| Batch | Items | Native review | Spot check round 1 | Spot check round 2 | Status |
|---|---|---|---|---|---|
| 1 — Thai priority High | 163 | 163 Fix in cell (39 scenarios, 32 prompts reworded) | 13 / 7 / 0 → copilot defect + register sweep (22 items) | 20 / 0 / 0 (after glossary alignment) | approved |
| 2 — Thai priority Medium | 89 | 49 / 40 / 0 | 13 / 7 / 0 → pattern sweep (19 items) | 20 / 0 / 0 | approved |
| 3 — template-generated | 408 (17 frames × 24 competencies) | 51 of ~290 template strings corrected | 20 / 0 / 0 (rendered items, all frames) | — | approved |
| **Total** | **660** | | | | **660 approved** |

Second-reviewer coverage: 40 of 163 batch-1 items, 40 of 89 batch-2 items, and all 17 batch-3 frames were read by an independent native reviewer.

## What "approved" means in the app

`localizeQuestion` shows Thai for any item with a translation status, so nothing changes visually today. The status was designed as the release gate for the default Thai experience; with every item approved, the gate is satisfied and the Thai toggle can leave pilot status without further code. The pilot flag `new-horizon-thai-drafts-v1` remains available for any future `draft` items (there are none).

## Round-2 sample, item by item

| Question | Verdict | Reviewer comment |
|---|---|---|
| REL-E-D1-005 | Approve | สถานการณ์และตัวเลือกแปลได้กระชับ ชัดเจน เข้าใจง่ายในรอบแรก การตัดสินใจระดับผู้บริหาร (Reliance decision) ชี้ชัดว่าคนต้องเป็นผู้รับผิดชอบการอธิบายต่อบอร์ด เหมาะสมกับผู้บริหารและคนทำงาน |
| REL-G-D2-001 | Approve | ปรับคำว่า 'ซิงก์ข้อมูล' ได้เป็นธรรมชาติของคนทำงานยุคดิจิทัล สถานการณ์ระบุชัดเจนว่าเป็นงานเล็ก แก้ไขย้อนหลังได้ (trivial, reversible) ทำให้ตัวเลือกเฉลย 'ให้ AI ทำ' มีความเด็ดขาดและไม่กำกวม |
| EXEC-D3-006 | Approve | สำนวนภาษาไทยสะท้อนธรรมาภิบาลระดับผู้บริหาร (Decision-quality governance) ได้อย่างยอดเยี่ยม ชี้ให้เห็นถึงกระบวนการ Escalation, Evidence comparison, และ Human ownership อย่างครบถ้วน |
| CAL-D6-CHANGE-024 | Approve | ภาษาไทยกระชับ ตรงประเด็นเรื่อง Change Enablement ตัวเลือกเฉลยสะท้อนการสนับสนุนที่เป็นรูปธรรม (ตัวอย่าง workflow, แนวทางตรวจทาน, ช่องทางรับฟีดแบ็ก) ตัวเลือกลวงชัดเจน |
| REL-E-D4-002 | Approve | สำนวนตื่นตัวและสื่อถึงความเร่งด่วนของสถานการณ์ Incident ได้ดีมาก ชี้ชัดว่าตราบใดที่ยังไม่ทราบสาเหตุ AI คือส่วนหนึ่งของปัญหา ไม่ใช่เครื่องมือแก้ปัญหา ตัวเลือกเฉลยชัดเจนและถูกต้องตามกฎหมายคุ้มครองข้อมูล |
| D5-PRO-009 | Approve | วงเล็บ (Pilot) กำกับโครงการนำร่องช่วยให้อ่านเข้าใจง่าย ตัวเลือกเฉลยสอนหลักการที่ถูกต้องว่าไม่ควรดูแต่ความเร็ว ต้องดูคุณภาพและความเสี่ยงด้วย ไม่มีความกำกวม |
| REL-H-D2-014 | Approve | ภาษาเป็นธรรมชาติ เข้าถึงง่ายสำหรับนักศึกษาและคนทำงาน อธิบายสถานการณ์ได้เห็นภาพชัดเจน ตัวเลือกเฉลยสมเหตุสมผลว่า AI ช่วยขึ้นโครงสร้างได้ แต่น้ำเสียงและเรื่องเล่าต้องเป็นของตนเอง |
| EXEC-D3-002 | Approve | แปลคำว่า 'citation-support gap' เป็น 'ช่องว่างระหว่างการอ้างอิงกับข้อมูลที่รองรับ' ได้อย่างยอดเยี่ยม เข้าใจง่ายในรอบแรก และชี้ให้เห็นว่าเป็นปัญหาเชิงเนื้อหาไม่ใช่รูปแบบ |
| D3-M-002 | Approve | สั้น กระชับ ตรงประเด็นเรื่อง Media Provenance ตัวเลือกเฉลยชี้ชัดถึงแหล่งข้อมูลที่มีความน่าเชื่อถืออย่างเป็นทางการ ตัวเลือกลวงสะท้อนพฤติกรรมหลงเชื่อสื่อปลอมได้ดีมาก |
| D3-P-004 | Approve | สถานการณ์ใกล้ตัวนักเรียนและคนทำงาน คำแปลภาษาไทยมีความลื่นไหล ชี้ประเด็นเรื่องการสรุปเกินจริง (overstating the rule) ได้อย่างแม่นยำ |
| CAL-D4-RISK-019 | Approve | ครอบคลุมหลักการ Data Minimization, Masking, Tool Approval, และ Audit Trail สำหรับข้อมูลทางการเงินอย่างสมบูรณ์แบบ ภาษาเข้าใจง่ายและปฏิบัติได้จริง |
| EXEC-D5-002 | Approve | การใส่ (Human-in-the-loop) ควบคู่กับคำแปลไทย และเกณฑ์วัดผลทางธุรกิจ 4 ด้าน มีความเป็นสากลและเหมาะสมกับผู้บริหารระดับสูงอย่างยิ่ง |
| EXEC-D6-007 | Approve | ข้อสอบแบบจับคู่มีความชัดเจนทั้งตัวโจทย์และตัวเลือกจับคู่ การแก้ปัญหา Shadow AI ด้วย 'สร้างช่องทางแจ้งที่ปลอดภัยและทำให้นโยบายชัดเจน' สื่อความหมายได้ลึกซึ้ง |
| GEN-EXP-D1-001 | Approve | การจับคู่แนวคิด AI พื้นฐาน (Loss of source meaning, Fluent output is not proof, Grounding) ถ่ายทอดเป็นภาษาไทยได้กระชับ เห็นภาพชัดเจน ไม่ซับซ้อน |
| GEN-EXP-D3-001 | Approve | โจทย์ข้อเขียนและเกณฑ์การให้คะแนน (Rubric) มีความสมบูรณ์แบบ ทั้งการระบุคำสำคัญและตัวอย่างคำตอบภาษาไทยที่สละสลวย ผู้ตรวจข้อสอบและผู้เข้าสอบเข้าใจเกณฑ์ได้ทันที |
| COMP-D2-PROMPT-003 | Approve | สถานการณ์งานบริการลูกค้าที่สมจริง เกณฑ์การประเมิน prompt 6 องค์ประกอบ แปลและอธิบายภาษาไทยได้ละเอียด ครอบคลุม และตรงตามหลักการ Prompt Engineering ที่ดี |
| EXEC-D4-010 | Approve | ลำดับขั้นตอนการจัดการ Incident Response ในมุมผู้บริหารมีความเป็นสากลและถูกต้องตามหลัก Incident Handling คำอธิบายใน Rubric ให้เหตุผลประกอบที่หนักแน่นและชัดเจน |
| GEN-EXP-D2-001 | Approve | โจทย์สะท้อนการใช้งาน AI ในชีวิตประจำวันได้อย่างดีเยี่ยม ลำดับขั้นตอนสอนเรื่อง Data privacy, Prompting, และ Human verification ก่อนนำไปใช้อย่างเป็นระบบ |
| MULTI-CONCEPT-EXEC-001 | Approve | ข้อสอบชุด Multi-part ระดับผู้บริหารที่ทรงคุณค่ามากที่สุด แปลศัพท์สถาปัตยกรรม AI และความเสี่ยงได้อย่างแม่นยำ ทุกข้อย่อยมีตัวเลือกเฉลยและ Feedback ที่สมบูรณ์แบบ ไม่มีความกำกวม |
| MULTI-CONCEPT-GEN-002 | Approve | ข้อสอบชุด 3 ข้อย่อยครอบคลุม Prompt, Context, และ Memory ได้อย่างกลมกลืน ภาษาไทยอ่านลื่นไหล เข้าใจง่ายสำหรับทุกระดับ ไม่พบจุดติดขัดหรือคำแปลตรงตัว |

## Verification

- `pnpm lint` clean; `pnpm build` passes; TypeScript error count unchanged at 18 (pre-existing).
- Only status fields changed: 137 table entries and 26 inline `translationStatus` values (`reviewed` → `approved`).
- All 660 questions localise; English view is the identity; every match key is one of its choices; ids and scores unchanged; every Thai exemplar answer scores 98.

## What remains for the Thai programme

- **Escalation** rendering (ส่งต่อให้ผู้มีอำนาจ, 10 occurrences) — the one glossary decision still open for the team; apply as a documented terminology sweep when decided.
- **Thai artifacts** — 9 message-type images exist as `draft` (`exports/artifact-thai-text-spec.json` awaits native sign-off); 17 artifacts tagged "Thai needed" / "Both" still display English.
- **English-bank notes** from batch 2 — DEPTH-EXP-D3-MEDIA-073 (red-flag prompt vs action key) and DEPTH-D3-MEDIA-042 (scenario omits the image) — for the next English audit round.
- **Thai pilot** (8-step plan, step 8) — compare per-item timing and score distributions EN vs TH through existing telemetry once Thai users run the assessment.
