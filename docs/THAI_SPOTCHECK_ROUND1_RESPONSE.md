# Thai Batch 1 — Second-Reviewer Spot Check, Round 1 Response (2026-09-12)

Source: `exports/New_Horizon_Thai_Batch1_SpotCheck_Round1_Reviewed.xlsx` (reviewer: Thai proofreading and editing specialist). 20 items: 13 Approve, 7 Fix, 0 Rewrite; every key still unambiguous in Thai; 13 understood on first read, 5 mostly, 2 no. Decision rule (18 Approve, no ambiguous key) not met, so batch 1 stays `reviewed` and a fresh sample was drawn.

## Systematic finding, fixed batch-wide

The glossary rule "pilot → โครงการนำร่อง (pilot)" had been applied inside the word *copilot*, producing "coโครงการนำร่อง (Pilot)". Three items were affected (EXEC-EXP-D1-CAL-001, D1-AGENT-008, EXEC-D2-002); all 163 items were scanned and fixed. The batch was also swept for the other patterns the reviewer raised — options opening with the pronoun มัน in formal items (10 fixed across MULTI-SOURCE-GEN-003, MULTI-CONCEPT-EXEC-001, EXEC-EXP-D2-AGENT-009, D5-TREND-007), เรียกร้อง in executive prompts and rubric labels (4), ลูป (6, now วงรอบ), สัญญาณอันตราย (2, now สัญญาณเตือนความผิดปกติ (Red flags)), and the stray space before "โครงการนำร่อง (Pilot)". All now return zero hits.

## Item fixes applied (reviewer wording used verbatim where given)

| Item | Change |
|---|---|
| COMP-D1-SYSTEMS-002 | Prompt → "ข้อใดแก้ไขความเข้าใจผิดนี้ได้ถูกต้องที่สุด"; key option reworded (เข้าจัดการข้อมูล) |
| D2-H-003 | Scenario → "รายงานสรุป…คุณภาพสม่ำเสมอทุกเดือน"; prompt → "แนวทางการออกแบบคำสั่ง (Prompt) ในข้อใดมีประสิทธิภาพที่สุด" |
| REL-H-D4-015 | Scenario restored the dropped dilemma: the proposal to automate approvals with no human review (reviewer's text) |
| D5-M-002 | Spacing fixed; "แผนการผลักดันการใช้งานจริง (Adoption plan)"; option a → "ยอมรับข้อเสนอนี้ทันที…" |
| EXEC-EXP-D1-CAL-001, D1-AGENT-008, EXEC-D2-002 | copilot restored (โคไพลอต (Copilot) / AI copilot) |
| D2-L-007 | Prompt → "…การพัฒนาระบบแบบวนรอบเพื่อปรับปรุงอย่างต่อเนื่อง (Loop Engineering)"; artifact text ลูป → วงรอบ |
| EXEC-EXP-D2-AGENT-009 | Part options begin with เอเจนต์ instead of มัน; value-gate prompt → "ผู้บริหารควรกำหนดให้มีหลักฐานใด…" |
| D2-P-005 | นักเรียน → นักศึกษา (D4-N-005 kept นักเรียน: school context with parents) |
| CAL-D3-VERIFY-017 | Prompt → "ข้อท้วงติงใดถูกต้องและเหมาะสมที่สุด" |
| D4-M-002 | Prompt → "สิ่งใดจำเป็นต้องดำเนินการก่อนเปิดใช้งานจริง" |
| D3-F-007, GEN-EXP-D3-001 | สัญญาณเตือนความผิดปกติ (Red flags) |
| MULTI-CONCEPT-GEN-001 | "ดึงข้อมูล/ค้นคืน (Retrieve)…"; "การกำหนดสิทธิ์ การเก็บบันทึกระบบ (Log) และจุดอนุมัติ…" |
| EXEC-D3-FIN-022, COMP-D5-STRATEGY-010, EXEC-EXP-D3-CAL-003, EXEC-EXP-D6-LOOP-008 | เรียกร้อง → ขอ / กำหนดให้; ลูป → วงรอบ |

22 items changed in total; 163 remain `reviewed`.

## Process changes

- Glossary rule for *pilot* now requires whole-word matching; the translation brief for batch 2 says so explicitly, and the QA scan (`[A-Za-z]โครงการนำร่อง`, options starting with มัน, เรียกร้อง, ลูป, ท่าน, ปัญญาประดิษฐ์) runs before any workbook is issued.
- Round 2 sample: `exports/New_Horizon_Thai_Batch1_SpotCheck_Round2.xlsx`, 20 fresh items with no overlap with round 1, same stratification and decision rule.
