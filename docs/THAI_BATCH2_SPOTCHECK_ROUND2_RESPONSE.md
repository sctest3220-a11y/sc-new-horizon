# Thai Batch 2 Spot Check (Round 2) — Response

**Source:** `exports/New_Horizon_Thai_Batch2_SpotCheck_Round2_Reviewed.xlsx` (second reviewer: Thai Proofreading Specialist, 2026-09-14)
**Result:** 20 Approve / 0 Fix / 0 Rewrite; understood on first read on all 20; **key still unambiguous on all 20.**
**Decision:** passes the rule (≥18 Approve, no ambiguous key) — **batch 2 (89 items) promoted from `reviewed` to `approved`** in `app/questionTranslations.th.ts`. First batch to reach `approved`.

## What this round checked

The sample was drawn from the 69 items not seen in round 1 and deliberately included all seven items that only the round-1 pattern sweep had touched (marked * below), so the sweep itself was read by a native reviewer rather than assumed correct. The reviewer explicitly confirmed three of the swept renderings — การดำเนินการทางการเงิน (FUNC-EXP-GEN-D5-001), ความเป็นปัจจุบันของข้อมูล (FUNC-SALES-D5-003), and the จุดบกพร่อง prompt phrasing (FUNC-EXP-PEOPLE-D3-001, FUNC-CS-D3-001) — and the Human-in-the-loop / guardrail / benchmark glossary treatment in MATCH-MODEL-CARD-063.

## Batch 2 history

| Stage | Result | Items changed |
|---|---|---|
| Native review (89 items) | 49 Approve / 40 Fix in cell / 0 Rewrite, 0 ambiguous keys | 22 scenarios, 36 prompts, 3 key options, 83 rubric keyword lists, 3 glossary terms |
| Spot check round 1 (20) | 13 / 7 / 0, 0 ambiguous | 7 fixes + pattern sweep → 19 items |
| Spot check round 2 (20, non-overlapping) | 20 / 0 / 0, 0 ambiguous | none |

Across both rounds 40 of the 89 items (45%) were read by the second reviewer.

## What `approved` means in the app today

`localizeQuestion` shows Thai for any item with a translation status, so `reviewed` and `approved` render identically right now. The status is the release gate described in `docs/LOCALISATION.md`: when the Thai toggle leaves pilot-only, the default Thai experience should show only `approved` items. That gate is not yet implemented — a one-line check in `getTranslationStatus` when the team decides to turn it on.

## Still open

- **Batch 1 (163 items)** — awaiting its own round-2 spot check (`exports/New_Horizon_Thai_Batch1_SpotCheck_Round2.xlsx`). When it closes, align batch 1 to the batch-2 glossary and sweep decisions in the same commit: hallucination gloss (3), Human-in-the-loop alongside (13), การแก้ไขทับผล AI (4), กติกา (19), ความสดใหม่ (1), ส่งต่อให้ผู้มีอำนาจ (7).
- **Glossary decisions for the team** — vendor (ผู้ขาย vs ผู้ให้บริการ for service contracts) and escalation (ส่งต่อให้ผู้มีอำนาจ vs ส่งต่อให้ผู้รับผิดชอบระดับสูงขึ้น).
- **English-bank notes** from round 1 — DEPTH-EXP-D3-MEDIA-073 (red-flag prompt vs action key) and DEPTH-D3-MEDIA-042 (scenario omits the image) — for the next English audit round.
- **Thai artifacts** — 17 artifacts still need Thai versions; the 9 produced remain `draft` until a native reviewer signs off `exports/artifact-thai-text-spec.json`.

## Round-2 sample, item by item

| Question | Verdict | Reviewer comment |
|---|---|---|
| DEPTH-D2-PROMPT-033 * | Approve | คำสั่งและขั้นตอนของ Prompt loop ชัดเจนมาก มีการวงเล็บศัพท์เทคนิคช่วยให้เข้าใจทันที เกณฑ์รูบริกและตัวอย่างคำตอบครอบคลุมและเป็นธรรมชาติ |
| DEPTH-EXP-D2-D6-071 * | Approve | การเรียงลำดับขั้นตอนการทำงานบริการลูกค้าร่วมกับ AI ชัดเจนมาก การใช้คำว่า 'ผู้ตรวจทานที่เป็นคน' และ 'แก้ไขทับผล AI (override)' สื่อความหมายทางเทคนิคได้อย่างสละสลวย |
| DEPTH-EXP-D3-D6-089 * | Approve | สถานการณ์ระบุเรื่องภาพและหลักฐานที่ขัดแย้งกันได้ครบถ้วน ชัดเจน คำถามและตัวอย่างคำตอบสะท้อนการสร้างวัฒนธรรมความปลอดภัยข้อมูลในทีมได้ดีเยี่ยม |
| FUNC-EXP-GEN-D5-001 * | Approve | การปรับแก้มาใช้คำว่า 'การดำเนินการทางการเงิน' (แทนคำแปลตรงตัวเดิม) ทำให้อ่านลื่นไหลและเป็นภาษาธุรกิจระดับผู้บริหารอย่างแท้จริง เกณฑ์การคัดเลือก Pilot ชัดเจนมาก |
| FUNC-EXP-PEOPLE-D3-001 * | Approve | การปรับคำถามเป็น 'จุดบกพร่องที่สำคัญที่สุด' ช่วยให้เป็นภาษาไทยธรรมชาติ เข้าใจง่าย บริบทงาน HR เรื่องการยกยอดวันลาพักร้อนและการอ้างอิงนโยบายฉบับอนุมัติถูกต้อง ชัดเจน |
| FUNC-MKT-SALES-D6-003 * | Approve | การจับคู่ความเสี่ยงกับแนวทางแก้ไขระหว่างฝ่ายขายและการตลาดทำได้ดีมาก ภาษาไทยอ่านเข้าใจง่ายในรอบแรก ตรงตามบริบทการทำงานจริงในองค์กร |
| FUNC-SALES-D5-003 * | Approve | การปรับใช้ 'ความเป็นปัจจุบันของข้อมูล' แทนคำว่าความสดใหม่ทำให้อ่านลื่นไหลมาก การจำแนกประเภทรายได้และการอายัดข้อมูลตามกฎหมายแปลได้ถูกต้อง แม่นยำตามมาตรฐานธุรกิจ |
| DEPTH-D6-COLLAB-055 | Approve | คำถามสั้นกระชับ ตรงประเด็นเรื่องความรับผิดชอบ (Accountability) ในการสื่อสารกับลูกค้า ผู้เข้าสอบทุกระดับสามารถทำความเข้าใจได้ทันที |
| DEPTH-D6-CHANGE-058 | Approve | สะท้อนมิติด้าน Change Management และ Adoption ในองค์กรได้ดีมาก ภาษาไทยเป็นธรรมชาติ ไม่มีสำนวนแปลตรงตัว |
| FUNC-CS-D3-001 | Approve | การปรับเป็น 'จุดบกพร่องที่ร้ายแรงที่สุด' ทำให้คำถามคมชัดและเป็นธรรมชาติ การใช้คำว่า 'โต้แย้งรายการ' (dispute) ถูกต้องตามศัพท์มาตรฐานบริการลูกค้า |
| DEPTH-D3-VERIFY-037 | Approve | คำถามและตัวเลือกกระชับ เข้าใจง่าย สื่อสารหลักการตรวจสอบข้อเท็จจริง (Verification) เทียบกับเอกสารต้นทางได้อย่างชัดเจน |
| DEPTH-D1-CONCEPTS-025 | Approve | การตัดคำว่า 'มัน' ออก และอธิบายหลักการทำงานของ LLM เรื่องรูปแบบความน่าจะเป็นทางภาษา (Text patterns) ทำได้ดีเยี่ยม เข้าใจง่ายสำหรับทุกกลุ่มเป้าหมาย |
| DEPTH-D5-STRATEGY-052 | Approve | สำนวนภาษาตรงกับบริบทการตัดสินใจเชิงกลยุทธ์ของผู้บริหาร (Executive Decision Making) สื่อสารชัดเจนว่าเทคโนโลยีต้องตอบโจทย์ธุรกิจก่อน |
| DEPTH-D3-MEDIA-040 | Approve | คำถามและตัวเลือกกระชับ เข้าใจได้ทันที ปลูกฝังนิสัยการตรวจสอบข้อเท็จจริง (Fact-checking) ก่อนแชร์ข้อมูลในสื่อสังคมออนไลน์ |
| DEPTH-EXP-D1-CONCEPTS-090 | Approve | การคงคำทับศัพท์ temperature และ prompt ไว้ตามคู่มือคำศัพท์ทำให้ไม่งง การแบ่งวรรคตอนและการใช้ภาษาไทยเพื่อแก้ไขความเข้าใจผิดทำได้ชัดเจนมาก |
| DEPTH-D4-GOV-047 | Approve | ขั้นตอนการเก็บหลักฐานเพื่อจัดการเหตุการณ์ผิดปกติ (Incident Response) แปลได้ครอบคลุมและถูกต้องตามหลักความปลอดภัยทางไซเบอร์และธรรมาภิบาล |
| MATCH-MODEL-CARD-063 | Approve | การจับคู่ส่วนประกอบของ Model Card ทำได้สมบูรณ์แบบ วงเล็บศัพท์เทคนิคอย่าง guardrail, Human-in-the-loop, benchmark ช่วยให้เข้าใจบริบททางเทคนิคได้ทันที |
| DEPTH-D4-RISK-044 | Approve | การใช้คำว่า 'ระบบ workspace' ป้องกันความเข้าใจผิดเรื่องสถานที่ทำงานได้ดีมาก การจับคู่ความเสี่ยงด้านความปลอดภัยกับมาตรการควบคุมถูกต้อง ตรงประเด็น |
| DEPTH-D4-GOV-048 | Approve | การแปล Governance cadence เป็น 'รอบเวลาและแนวทางการกำกับดูแล' เหมาะสมกับบริบทองค์กรและผู้บริหารอย่างยิ่ง รูบริกครอบคลุมมิติด้านความเสี่ยงและการตัดสินใจครบถ้วน |
| DEPTH-D6-COLLAB-057 | Approve | การเรียงลำดับวงรอบการเรียนรู้และการปรับปรุง (Review loop) รายสัปดาห์ มีความต่อเนื่อง ชัดเจน สำนวนไทยอ่านง่ายและสะท้อนแนวปฏิบัติที่ดีในองค์กร |

\* item touched only by the round-1 pattern sweep

## Verification

- `pnpm lint` clean; `pnpm build` passes; TypeScript error count unchanged at 18 (pre-existing).
- Only the 89 `status` fields changed in `app/questionTranslations.th.ts` (89 insertions / 89 deletions); batch 1 entries untouched.
- All 89 items localise end to end; every Thai exemplar answer scores 98 through `scoreTextAnswer`.
