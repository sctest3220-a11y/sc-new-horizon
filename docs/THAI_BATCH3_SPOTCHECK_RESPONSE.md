# Thai Batch 3 Spot Check — Response, and Glossary Alignment of Batches 1–2

## Batch 3 spot check

**Source:** `exports/New_Horizon_Thai_Batch3_SpotCheck_Reviewed.xlsx` (second reviewer: Thai Proofreading Specialist, 2026-09-14). Sample verified against `spotcheck_b3_ids.json`: the 20 rendered questions, all 17 scenario frames represented.
**Result:** 20 Approve / 0 Fix / 0 Rewrite; understood on first read and key unambiguous on all 20; "no unnatural term" on every row.
**Decision:** passes the rule → both template builders now emit **`translationStatus: 'approved'`**, so all 408 `ADV-*` / `TREND-*` items are `approved`. With batch 2 (89) that makes 497 approved items; batch 1's 163 remain `reviewed` pending its round-2 sample.

| Question | Verdict | Reviewer comment |
|---|---|---|
| ADV-D1-CORE-CONCEPTS-01 | Approve | สำนวนภาษาไทยมีความลื่นไหล อ่านเข้าใจได้ทันทีในการอ่านรอบแรก มีการระบุคำทับศัพท์ (pilot) และ (governance) ในวงเล็บช่วยสร้างความคุ้นเคย ตัวเลือกเฉลยชี้ชัดถึงการควบคุมก่อนขยายผล เหมาะสมกับผู้สอบทุกระดับ |
| ADV-D5-TRANSFORMATION-STRATEGY-02 | Approve | สถานการณ์อธิบายความเสี่ยงและปัญหาได้กระชับชัดเจน คำถามตรงประเด็น ตัวเลือกเฉลยเชื่อมโยงการแก้ไขปัญหาด้วยการกำหนดเกณฑ์และผู้รับผิดชอบอย่างชัดเจน ผู้บริหารและคนทำงานเข้าใจได้ทันที |
| ADV-D2-PROMPT-DESIGN-03 | Approve | การใช้คำว่า 'ผู้ให้บริการ' แทน 'ผู้ขาย' และปรับคำถามเป็น 'รัดกุมและเหมาะสมที่สุด' ทำให้อ่านเป็นธรรมชาติมาก ไม่มีการแปลตรงตัว ตัวเลือกเฉลยถูกต้องและไม่กำกวม |
| ADV-D1-CAPABILITY-LIMITS-04 | Approve | บริบทของผู้บริหารชัดเจน การแปลคำว่า hallucination โดยมีคำอธิบาย (การกุข้อมูล) ช่วยให้ทั้งนักศึกษาและผู้บริหารเข้าใจตรงกันทันที ตัวเลือกเฉลยถูกต้องตรงหลักการ |
| ADV-D5-ROI-METRICS-05 | Approve | คำถามได้รับการเกลาเป็น 'ทางเลือกในการออกแบบกระบวนการใหม่ข้อใดรัดกุมและเหมาะสมที่สุด' สละสลวยมาก ทักษะที่เกี่ยวข้องมีการระบุคำศัพท์คู่ขนาน (baseline, KPI, ROI) ได้อย่างมืออาชีพ |
| ADV-D2-AGENTIC-WORKFLOWS-06 | Approve | สถานการณ์ชี้ประเด็นการประเมินผล 5 มิติ (ความเร็ว คุณภาพ ความเชื่อมั่น ต้นทุน ความเสี่ยง) ได้อย่างแม่นยำ คำถามสั้นกระชับ เฉลยไม่กำกวม |
| ADV-D6-CHANGE-ENABLEMENT-07 | Approve | การปรับแก้ Prompt เป็น 'แนวทางปฏิบัติที่แสดงถึงการตัดสินใจระดับสูงในข้อใดเหมาะสมที่สุด' ช่วยลดความกำกวมของคำว่า 'advanced response' ได้อย่างดีเยี่ยม อ่านเข้าใจได้ทันที |
| ADV-D5-PORTFOLIO-PRIORITIZATION-08 | Approve | การใช้ 'ผู้ให้บริการภายนอก' และ 'ชุดมาตรการควบคุม' มีความเป็นทางการและสอดคล้องกับมาตรฐานการบริหารจัดการข้อมูลองค์กร ตัวเลือกเฉลยตอบโจทย์ได้ครบถ้วน |
| ADV-D3-SOURCE-VERIFICATION-09 | Approve | การแปล 'Which challenge is most appropriate?' เป็น 'ข้อท้วงติงข้อใดเหมาะสมที่สุด' สละสลวย ตรงกับบริบทการทำงานจริง ไม่ออกมาเป็นการแปลตรงตัวที่แข็งทื่อ |
| ADV-D4-FAIRNESS-ETHICS-10 | Approve | ภาษาไทยกระชับ อ่านง่าย ประเด็นเรื่อง 'วิธีเลี่ยงระบบ (workarounds)' และ 'กรณีพิเศษ (edge cases)' แปลสื่อความหมายได้ชัดเจน ตัวเลือกเฉลยหนักแน่น |
| TREND-D3-MEDIA-PROVENANCE-AWARENESS-01 | Approve | สถานการณ์และคำถามสะท้อนกระแส Agentic AI ในปัจจุบันได้อย่างยอดเยี่ยม ตัวเลือกเฉลยเน้น Human-in-the-loop และ Governance ได้ตรงจุด ชัดเจน ไม่สับสน |
| TREND-D4-SECURITY-GOVERNANCE-APPLIED-01 | Approve | การปรับแก้ Prompt เป็น 'การจัดกระบวนการทดสอบในทางปฏิบัติข้อใดเหมาะสมที่สุด โดยไม่เชื่อถือผลลัพธ์มากเกินไป' และแม่แบบ 'โดยมีแนวทางปฏิบัติที่ชัดเจน' ทำให้อ่านลื่นไหล สละสลวย และผู้เข้าสอบเข้าใจบริบทการตรวจสอบ Multimodal ทันที |
| TREND-D3-DATA-CHART-JUDGMENT-APPLIED-02 | Approve | การใช้คำว่า 'ยึดโยงกับแหล่งข้อมูล' และ 'การตรวจสอบความผิดปกติของกราฟ' มีความถูกต้องทางวิชาการและเป็นธรรมชาติ ตัวเลือกเฉลยชัดเจนและเป็นคำตอบที่ถูกต้องเพียงข้อเดียว |
| TREND-D6-ROLE-CLARITY-PROFICIENT-01 | Approve | ตัวเลือกเฉลยที่ปรับเป็น 'ขยายขอบเขตสิทธิ์การทำงานเมื่อมีหลักฐานความพร้อมที่ชัดเจนขึ้นเท่านั้น' มีความเป็นมืออาชีพสูงมาก แสดงถึงหลักการ Least privilege และ Progressive trust ได้อย่างแจ่มแจ้ง |
| TREND-D4-REGULATORY-POLICY-PROFICIENT-02 | Approve | คำถาม 'การประเมินในระดับผู้เชี่ยวชาญข้อใดรัดกุมและมีน้ำหนักมากที่สุด' มีความลื่นไหลและทรงพลัง ตัวเลือกเฉลยสะท้อนแนวทางการทำ Model Evaluation ในชีวิตจริงได้สมบูรณ์แบบ |
| TREND-D2-OUTPUT-REFINEMENT-ADVANCED-01 | Approve | โจทย์วัดระดับ Advanced สำหรับผู้บริหารและผู้นำองค์กร ภาษาไทยที่ใช้มีความสละสลวย คำศัพท์เชิงยุทธศาสตร์ (Operating model, Intake, Value gates) แปลและเรียบเรียงได้น่าประทับใจ |
| TREND-D5-USECASE-FIT-ADVANCED-02 | Approve | การปรับแก้ 'แผนการเปลี่ยนผ่านออกจากผู้ให้บริการ (vendor exit path)' และ 'โมเดลระดับโลกที่มีประสิทธิภาพสูงสุด' ทำให้ข้อสอบข้อนี้มีมาตรฐานภาษาสูงมาก ชัดเจนตรงประเด็น Data Sovereignty |
| TREND-D4-SECURITY-GOVERNANCE-ADVANCED-01 | Approve | สถานการณ์และสมรรถนะมาตรการความปลอดภัยประกอบกันได้อย่างกลมกลืน ตัวเลือกเฉลยชัดเจนและทรงคุณค่าในการวัดระดับทักษะบริหารจัดการความเสี่ยง |
| TREND-D4-SECURITY-GOVERNANCE-ADVANCED-02 | Approve | การประกอบกันระหว่างเฟรม Sovereign Data กับสมรรถนะ Security & Governance ทำให้ได้ข้อสอบที่สมบูรณ์แบบ ทั้งคำศัพท์ สถานการณ์ และตัวเลือกคำตอบ |
| TREND-D6-ROLE-CLARITY-APPLIED-01 | Approve | อ่านแล้วเข้าใจได้ทันทีในการอ่านรอบแรก (Understood on first read: Yes) ไม่มีคำศัพท์กำกวมหรือแปลตรงตัว ตัวเลือกเฉลยถูกต้องและตอบโจทย์กระบวนการทดสอบอย่างรัดกุม |

## About the second file received with it

`New_Horizon_Thai_Batch1_SpotCheck_Reviewed.xlsx` turned out to be the **round-1** batch-1 review again — byte-identical to the file applied on 2026-09-12 (same 20 round-1 ids, same 13/7/0 verdicts, same findings, all already fixed). The round-2 sample (`exports/New_Horizon_Thai_Batch1_SpotCheck_Round2.xlsx`, different ids) has not been returned yet. It has now been **reissued** on the aligned text below, with the same 20 ids.

## Glossary alignment of batches 1–2

Three reviewers across batches 2–3 converged on renderings that batch 1 (and parts of batch 2) predated. Since batch 1's round-2 sample was still unreturned, this was the moment to align everything and reissue that sample. 46 items changed:

| Pattern | Rule applied | Items |
|---|---|---|
| vendor | ผู้ให้บริการ for AI / IT / SaaS vendors (16 items, incl. the inline Horizon item REL-H-D3-022); ผู้ขาย kept for goods sellers, suppliers, invoices and marketplace listings (12 items) | 16 |
| กติกา | ข้อกำหนด (rules), แนวปฏิบัติ (norms), เกณฑ์ (criteria), เงื่อนไข (conditions) by context; rubric keyword stems untouched, ข้อกำหนดของวิชา added as a stem | 11 |
| human review | การตรวจทานโดยคน (Human-in-the-loop) on first mention per item | 13 |
| "…หนักแน่นที่สุด" prompts | มีน้ำหนักมากที่สุด / รัดกุมและเหมาะสมที่สุด (adjective uses in feedback and captions left as they were) | 5 |
| override | การแก้ไขทับผล AI (override) | 4 |
| hallucination | hallucination (การกุข้อมูล / สร้างข้อมูลเท็จ) | 2 |
| freshness | ความเป็นปัจจุบันของข้อมูล | 2 |
| exemplar register | CAL-D3-MEDIA-018: first-person ผม removed from the exemplar; it now also hits the "evidence" criterion (was the only exemplar below full marks) | 1 |

Not aligned, still a team decision: **escalation** (ส่งต่อให้ผู้มีอำนาจ, 10 occurrences across both batches; batch-2 reviewer suggested ส่งต่อเคสให้หัวหน้างาน in a customer-service context).

Per item:

| Question | Changes |
|---|---|
| CAL-D2-WORKFLOW-016 | override |
| CAL-D3-MEDIA-018 | exemplar: first-person ผม removed; now hits evidence criterion |
| CAL-D6-COLLAB-023 | override, กติกา |
| COMP-D1-CONCEPTS-001 | hallucination gloss |
| COMP-D2-PROMPT-003 | กติกา |
| COMP-D3-VERIFY-005 | vendor |
| COMP-D6-CHANGE-012 | override |
| COMP-D6-COLLAB-011 | HITL, กติกา |
| D1-H-003 | hallucination gloss |
| D2-T-006 | vendor |
| D3-A-007 | feedback superlative, prompt superlative |
| D3-M-002 | prompt superlative |
| D3-N-006 | prompt superlative |
| D4-M-002 | HITL, vendor |
| D4-N-005 | HITL |
| D5-M-002 | vendor |
| D5-TREND-007 | vendor |
| D6-A-001 | HITL, กติกา |
| D6-P-003 | กติกา |
| DEPTH-D3-VERIFY-038 | vendor |
| DEPTH-D4-RISK-045 | vendor |
| DEPTH-EXP-D1-D3-069 | vendor |
| EXEC-D2-A2A-019 | HITL |
| EXEC-D3-002 | vendor |
| EXEC-D3-004 | freshness |
| EXEC-D4-014 | HITL |
| EXEC-D4-016 | prompt superlative, vendor |
| EXEC-D4-PEOPLE-023 | HITL |
| EXEC-D5-002 | HITL |
| EXEC-D5-003 | vendor |
| EXEC-D5-009 | HITL |
| EXEC-D5-016 | vendor |
| EXEC-D5-TREND-021 | vendor |
| EXEC-D6-012 | HITL |
| EXEC-D6-OPS-024 | HITL |
| EXEC-EXP-D2-CAL-002 | กติกา |
| EXEC-EXP-D4-VEND-005 | vendor |
| EXEC-EXP-D5-VALUE-007 | override |
| EXEC-EXP-D6-LOOP-008 | กติกา |
| FUNC-EXP-PEOPLE-D3-001 | freshness |
| GEN-EXP-D2-001 | HITL, prompt superlative, กติกา |
| GEN-EXP-D5-001 | HITL, กติกา |
| MATCH-AI-BENCHMARKS-065 | vendor |
| PRACTICAL-GEN-D6-014 | กติกา |
| REL-E-D2-006 | กติกา |
| REL-H-D3-022 | vendor |

## Verification

- `pnpm lint` clean; `pnpm build` passes; TypeScript error count unchanged at 18 (pre-existing).
- All 660 questions localise (163 `reviewed`, 497 `approved`); English view is the identity for all 660; every match key is one of its choices; ids and scores unchanged.
- Every Thai exemplar answer scores 98 through `scoreTextAnswer`.

## Next

- Batch 1 round-2 spot check on the reissued `exports/New_Horizon_Thai_Batch1_SpotCheck_Round2.xlsx` — ≥18 Approve and no ambiguous key promotes the last 163 items to `approved`.
- Team decision on the escalation rendering.
- English-bank notes carried from batch 2: DEPTH-EXP-D3-MEDIA-073, DEPTH-D3-MEDIA-042.
