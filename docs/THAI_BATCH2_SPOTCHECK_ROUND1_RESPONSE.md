# Thai Batch 2 Spot Check (Round 1) — Response

**Source:** `exports/New_Horizon_Thai_Batch2_SpotCheck_Round1_Reviewed.xlsx` (second reviewer: Thai Proofreading Specialist, 2026-09-14)
**Result:** 13 Approve / 7 Fix / 0 Rewrite; "Understood on first read" Yes 13 / Mostly 7; **Key still unambiguous = Yes on all 20.** Below the 18-Approve threshold, so batch 2 stays `reviewed`; the flagged patterns were fixed across all 89 items and a fresh sample drawn — the same path batch 1 took.

## What the second reader found

No meaning errors and no ambiguous keys. The seven Fix verdicts are all register and literal-translation issues: phrases carried over in English word order (สิทธิ์รอบ ๆ โมเดล, ความสดใหม่ของข้อมูล, ที่คุณเป็นเจ้าของเอง, การกระทำที่เกี่ยวกับเงิน), words with the wrong connotation for business Thai (ข้ออ้าง, กติกา, ผู้ใช้ฝ่ายขาย), a vendor term that changed mid-item (ผู้ให้บริการ in the scenario, ผู้ขาย in the parts), and two places where the Thai scenario lost a cue the prompt relies on (the image in DEPTH-D3-MEDIA-042; "actions to take" in DEPTH-EXP-D3-MEDIA-073).

## Applied

**Seven Fix items** — corrected in the reviewer's own wording (18 targeted edits): DEPTH-D1-SYSTEMS-028 key option; FUNC-SALES-D3-001 prompt, key option and caption; DEPTH-EXP-D3-MEDIA-073 prompt; DEPTH-D2-PROMPT-032 match key and choices; DEPTH-D3-MEDIA-042 scenario; FUNC-SALES-D2-002 rank steps #1 and #4; DEPTH-EXP-D4-D1-078 part prompt, three options, alt and label (ผู้ให้บริการ throughout; opt-out rendered as เงื่อนไขการปฏิเสธไม่ยินยอมให้ใช้ข้อมูล (opt-out)).

**Three Approve-with-suggestion items** — taken: FUNC-FIN-D3-001 prompt (ข้อท้วงติงที่มีน้ำหนักมากที่สุด, matching batch 1's CAL-D3-VERIFY-017), FUNC-CS-D5-003 (ส่งต่อเคสให้หัวหน้างาน (escalation)), DEPTH-EXP-D5-VALUE-079 (ยอดขายในไตรมาสนี้จะเติบโตขึ้น).

**Pattern sweep across all 89 items** (the reviewer's findings applied batch-wide, not only to the sampled rows):

| Pattern | Replaced with | Occurrences |
|---|---|---|
| การกระทำที่เกี่ยวกับเงิน (literal "monetary actions") | การดำเนินการทางการเงิน | 3 |
| ความสดใหม่ของข้อมูล (literal "freshness") | ความเป็นปัจจุบันของข้อมูล | 1 + 1 rank step + 1 caption |
| กติกา… (reads like game rules) | ข้อกำหนด / เงื่อนไข / เกณฑ์ / หลักการ / แนวปฏิบัติ, by context | 8 + 2 match choices |
| คำวิจารณ์ที่หนักแน่นที่สุด | ข้อท้วงติงที่มีน้ำหนักมากที่สุด | 1 (prompt) |
| สิทธิ์รอบ ๆ โมเดล (literal "around the model") | การกำหนดสิทธิ์เพื่อควบคุมการใช้งานโมเดล | 1 (option) |

19 items changed in total: DEPTH-D1-SYSTEMS-028, DEPTH-D2-PROMPT-032, DEPTH-D2-PROMPT-033, DEPTH-D3-MEDIA-042, DEPTH-EXP-D1-D2-067, DEPTH-EXP-D2-D6-071, DEPTH-EXP-D3-D6-089, DEPTH-EXP-D3-MEDIA-073, DEPTH-EXP-D4-D1-078, DEPTH-EXP-D5-VALUE-079, FUNC-CS-D5-003, FUNC-EXP-GEN-D5-001, FUNC-EXP-PEOPLE-D3-001, FUNC-EXP-TECH-D4-001, FUNC-FIN-D3-001, FUNC-MKT-SALES-D6-003, FUNC-SALES-D2-002, FUNC-SALES-D3-001, FUNC-SALES-D5-003. Every pattern scan from batch 1's two rounds still returns zero hits (มัน openers, เรียกร้อง, ลูป, copilot defect, literal คืออะไร prompts, leading จง, glued parentheses).

## Two notes for the English bank (not changed here)

- **DEPTH-EXP-D3-MEDIA-073** — the English prompt asks for "red flags", but the key includes "Verify through the carrier's app or official site", which is an action, not a flag. The Thai prompt now says "สัญญาณเตือน… และข้อควรปฏิบัติ" so the Thai reader is not misled; the English prompt should get the same widening in the next audit round ("Which red flags and safe actions…").
- **DEPTH-D3-MEDIA-042** — the English scenario says "a forwarded chat message" while the prompt says "acts on the image". The stimulus is the forwarded flood chat with a photo, so the Thai scenario now mentions the image; the English scenario could say "a forwarded chat message with a photo".

## Not swept (needs a team decision)

- **vendor → ผู้ขาย** is the glossary rendering and appears in 23 batch-2 and about 50 batch-1 items. The reviewer wanted ผู้ให้บริการ in DEPTH-EXP-D4-D1-078 because that item is a service contract; it was made consistent within that item only. If the team prefers ผู้ให้บริการ for SaaS/AI vendors generally, that is a glossary change to apply to both batches at once.
- **escalation → ส่งต่อให้ผู้มีอำนาจ** appears 3 more times in batch 2 and 7 in batch 1. Changed only in the customer-service item the reviewer named; a glossary entry (e.g. ส่งต่อให้ผู้รับผิดชอบระดับสูงขึ้น (escalation)) would settle it.
- **Batch 1** still carries the earlier renderings for the three batch-2 glossary changes (hallucination gloss, Human-in-the-loop, การแก้ไขทับผล AI) plus 19 กติกา, 1 ความสดใหม่ and 7 ส่งต่อให้ผู้มีอำนาจ. Align in the commit that closes batch 1's round-2 spot check.

## Round-1 sample, item by item

| Question | Verdict | First read | Term flagged | Reviewer comment |
|---|---|---|---|---|
| DEPTH-D4-GOV-046 | Approve | Yes | ไม่มี (สำนวนดี) | แปลได้กระชับ ชัดเจน วงเล็บศัพท์เทคนิค Human-in-the-loop ช่วยสร้างความคุ้นเคย ตัวเลือกเฉลยถูกต้องและเป็นไปตามหลัก AI Governance ไม่มีความกำกวม เหมาะสมกับผู้สอบทุกระดับ |
| DEPTH-D4-RISK-043 | Approve | Yes | ไม่มี | การปรับใช้คำว่า 'แชตบอต AI ทั่วไป' (จาก public chatbot) ช่วยลดความสับสนกับบริการภาครัฐได้ดีมาก ตัวเลือกเฉลยถูกต้องและเป็นภาษาไทยที่อ่านเข้าใจได้ทันทีในการอ่านรอบแรก |
| DEPTH-D1-SYSTEMS-028 | Fix | Mostly | สิทธิ์รอบ ๆ โมเดลได้ (แปลตรงตัวจาก permissions around the model) | วลี 'สิทธิ์รอบ ๆ โมเดลได้' ฟังดูแปลตรงตัวและไม่เป็นธรรมชาติในภาษาไทย เสนอปรับปรุงตัวเลือกเฉลยเป็น: 'แอปพลิเคชันสามารถเสริมเครื่องมือ หน่วยความจำ นโยบาย และการกำหนดสิทธิ์เพื่อควบคุมการใช้งานโมเดลได้' เพื่อให้นักศึกษา คนทำงาน และผู้บริหารเข้าใจสถาปัตยกรรมระบบได้ทันที |
| DEPTH-D2-PROMPT-031 | Approve | Yes | ไม่มี | คำถามและตัวเลือกกระชับ ชัดเจน ตรงเป้าหมายเรื่องการระบุกลุ่มเป้าหมาย (Audience) และผลลัพธ์ที่ต้องการ (Goal) ในการเขียน Prompt นักศึกษาและคนทำงานสามารถเข้าใจและตอบได้ทันที |
| FUNC-SALES-D3-001 | Fix | Mostly | ผู้ใช้ฝ่ายขาย (ควรใช้ พนักงานขาย), ข้ออ้าง (มีนัยเชิงลบ ควรใช้ การประเมิน/ข้อสรุป) | 1. ในคำถาม 'ผู้ใช้ฝ่ายขาย' ควรปรับเป็น 'พนักงานขาย' หรือ 'ทีมขาย' เพื่อความเป็นธรรมชาติ 2. ในตัวเลือกเฉลยคำว่า 'ข้ออ้างว่าดีลนี้จะปิดการขายได้' มีความหมายเชิงลบ เสนอปรับเป็น: 'การประเมินว่าดีลนี้จะปิดการขายได้มีความน่าเชื่อถือต่ำมาก เนื่องจากมีข้อพิพาททางกฎหมายค้างอยู่และขาดการติดต่อเกิน 31 วัน' จะเป็นภาษาธุรกิจที่มืออาชีพและเข้าใจง่ายขึ้น |
| FUNC-FIN-D3-001 | Approve | Yes | ไม่มีคำผิดร้ายแรง (คำวิจารณ์ที่หนักแน่น เป็นสำนวนแปล) | สื่อความหมายเชิงการเงินได้ถูกต้อง การระบุคำว่า ผลต่าง (variance) ในวงเล็บช่วยให้เข้าใจง่ายทั้งคนสายการเงินและทั่วไป (หากต้องการเพิ่มความสละสลวย อาจปรับคำถามจาก 'คำวิจารณ์ที่หนักแน่นที่สุด' เป็น 'ข้อท้วงติงที่มีน้ำหนักมากที่สุด') |
| DEPTH-D5-VALUE-049 | Approve | Yes | ไม่มี | ตรงประเด็นเรื่องการวัดมูลค่าทางธุรกิจ (Business Value) และเกณฑ์การประเมินผล (Baseline & Outcome Metric) ตัวเลือกมีความชัดเจน ไม่ทำให้สับสน เหมาะสมมาก |
| DEPTH-D2-WORKFLOW-034 | Approve | Yes | ไม่มี | ลำดับ Workflow ชัดเจน ตัวเลือกลวง 'AI กุตัวเลขขึ้นเอง' สื่อความหมาย Hallucination ได้เห็นภาพและเข้าใจง่าย เหมาะกับผู้สอบทุกระดับ |
| DEPTH-D6-COLLAB-056 | Approve | Yes | ไม่มี | คำว่า 'แก้ไขทับผล AI (override)' แปลและให้บริบทภาษาไทยได้ดีมาก ช่วยให้ผู้เข้าสอบเข้าใจการทำงานร่วมกันระหว่างมนุษย์และ AI (Human-AI Collaboration) ได้อย่างชัดเจน |
| DEPTH-EXP-D3-MEDIA-073 | Fix | Mostly | ตัวเลือกที่ 4 'ต้องตรวจสอบผ่านแอป...' ไม่ใช่สัญญาณเตือน (Red flag) แต่เป็นแนวทางปฏิบัติ | คำถามถามหา 'สัญญาณเตือนความผิดปกติ (Red flags)' แต่ตัวเลือกที่ 4 ระบุว่า 'ต้องตรวจสอบผ่านแอปของผู้ให้บริการขนส่งหรือเว็บไซต์ทางการ' ซึ่งเป็นขั้นตอนการตรวจสอบ/แนวทางปฏิบัติ ไม่ใช่สัญญาณเตือนภัย ทำให้ผู้สอบอาจลังเลไม่กล้าเลือก เสนอปรับคำถามเป็น: 'ข้อใดคือสัญญาณเตือนความผิดปกติ (Red flags) และข้อควรปฏิบัติที่ต้องระวังก่อนดำเนินการ' เพื่อให้สอดคล้องกับตัวเลือกเฉลย |
| FUNC-CS-D5-003 | Approve | Yes | ส่งต่อให้ผู้มีอำนาจ (ในบริบท CS มักใช้ ส่งต่อเคสระดับสูง/หัวหน้างาน) | ตัวชี้วัดงานบริการลูกค้าแปลได้ถูกต้อง ครอบคลุมทั้ง FCR, SLA breach, Dispute และ Reopened rate (ข้อเสนอแนะเพิ่มเติม: คำว่า 'ส่งต่อให้ผู้มีอำนาจ' ในงานบริการลูกค้าอาจปรับเป็น 'ส่งต่อเคสให้ทีมเชี่ยวชาญ/หัวหน้างาน' เพื่อให้ตรงกับเนื้องานจริง) |
| DEPTH-D2-PROMPT-032 | Fix | Mostly | กติกาเรื่องแหล่งข้อมูล (คำว่า กติกา ฟังดูเหมือนเกม) | คำว่า 'กติกาเรื่องแหล่งข้อมูล' (Source rule) ฟังดูไม่เป็นทางการในบริบทการทำงาน เสนอปรับเป็น 'ข้อกำหนดเรื่องแหล่งข้อมูล' หรือ 'กฎเกณฑ์การใช้แหล่งข้อมูล' เพื่อให้เหมาะสมกับกลุ่มคนทำงานและผู้บริหาร |
| FUNC-EXP-TECH-D4-001 | Approve | Yes | การกระทำที่เกี่ยวกับเงิน (ฟังดูแปลตรงตัว) | การจับคู่ปัญหาการทำงานของเอเจนต์ (Agent) กับมาตรการควบคุมทำได้ถูกต้อง เข้าใจง่าย วลี 'ไล่อ่านไฟล์ทั้งบริษัท' และ 'ให้สิทธิ์เท่าที่จำเป็น (least privilege)' สื่อสารได้ตรงจุด |
| DEPTH-D3-MEDIA-042 | Fix | Mostly | สถานการณ์ไม่ได้ระบุว่ามีรูปภาพ แต่คำถามอ้างถึง 'ภาพนี้' ทันที | ในสถานการณ์ภาษาไทยระบุเพียงว่า 'ข้อความที่ถูกส่งต่อในแชตกำลังแพร่กระจาย...' โดยไม่ได้เอ่ยถึงรูปภาพ แต่ในคำถามกลับระบุว่า '...ก่อนที่จะมีการแชร์ภาพนี้ต่อหรือดำเนินการใด ๆ ตามภาพ' ทำให้ผู้สอบเกิดความสับสน เสนอปรับสถานการณ์เป็น: 'มีข้อความและรูปภาพถูกส่งต่อในแชตกำลังแพร่กระจาย พร้อมข้อกล่าวอ้างเกี่ยวกับเหตุฉุกเฉินที่กำลังเกิดขึ้น' เพื่อให้เชื่อมโยงกับคำถามอย่างสมบูรณ์ |
| FUNC-OPS-D6-001 | Approve | Yes | ไม่มี | โจทย์ชัดเจน มีบริบทความขัดแย้งของข้อมูล (Log vs AI Draft) ชัดเจน รูบริกครอบคลุมคำสำคัญที่ผู้สอบจะตอบทั้งภาษาไทยและอังกฤษ |
| DEPTH-EXP-D5-VALUE-079 | Approve | Yes | ไตรมาสนี้จะโตขึ้น (ภาษาพูดเกินไป) | เนื้อหาและรูบริกประเมินคุณค่าโครงการนำร่อง AI ครบถ้วน (ข้อเสนอแนะเพิ่มเติม: วลี 'ไตรมาสนี้จะโตขึ้น' อาจปรับเป็น 'ยอดขายในไตรมาสนี้จะเติบโตขึ้น' เพื่อความเป็นภาษาธุรกิจที่เป็นทางการยิ่งขึ้น) |
| FUNC-SALES-D2-002 | Fix | Mostly | ความสดใหม่ของข้อมูล (CRM freshness), ส่งการติดตามผลที่คุณเป็นเจ้าของเอง (human-owned follow-up) | มีสำนวนแปลตรงตัวที่ทำให้เข้าใจยาก 2 จุด: 1. ข้อ #1 'ตรวจความสดใหม่ของข้อมูลใน CRM' ควรปรับเป็น 'ตรวจสอบความเป็นปัจจุบันของข้อมูลใน CRM' 2. ข้อ #4 'ส่งการติดตามผลที่คุณเป็นเจ้าของเอง' แปลตรงตัวจาก human-owned ควรปรับเป็น: 'ส่งข้อความติดตามผลด้วยตนเอง (โดยมีผู้รับผิดชอบชัดเจน) และบันทึกเหตุผลลงใน CRM' เพื่อให้สื่อสารได้ทันทีโดยไม่ต้องแปลไทยเป็นไทย |
| DEPTH-EXP-D2-D5-087 | Approve | Yes | ไม่มี | การเรียงลำดับขั้นตอนในระดับพอร์ตโฟลิโอองค์กรแปลได้ยอดเยี่ยม ใช้ภาษาที่ผู้บริหารและผู้จัดการเข้าใจได้ทันที มีการกำกับศัพท์เทคนิค (governance, triage, baseline) ไว้อย่างเหมาะสม |
| DEPTH-EXP-D4-D1-078 | Fix | Mostly | ผู้ขาย (ไม่สอดคล้องกับ ผู้ให้บริการ ในสถานการณ์), เงื่อนไขการขอไม่เข้าร่วม (opt-out terms) | 1. มีความไม่สอดคล้องกันของคำศัพท์: ในสถานการณ์ใช้ 'ผู้ให้บริการ' แต่ในคำถามย่อย part 1 และตัวเลือกยังใช้คำว่า 'ผู้ขาย' และ 'โลโก้ของผู้ขาย' ควรปรับเป็น 'ผู้ให้บริการ' ให้ตรงกันทั้งหมด 2. วลี 'เงื่อนไขการขอไม่เข้าร่วม' (opt-out terms) ในบริบทสัญญาข้อมูล ควรใช้ 'เงื่อนไขการปฏิเสธไม่ยินยอมให้ใช้ข้อมูล (opt-out)' เพื่อความถูกต้องตามหลักกฎหมายสัญญาและคุ้มครองข้อมูลส่วนบุคคล |
| DEPTH-EXP-D1-D2-067 | Approve | Yes | ไม่มีคำผิดร้ายแรง | คำถามย่อยทั้ง 3 ส่วนแยกประเด็นแนวคิด RAG, Prompt Constraints และ Context Window ได้อย่างเฉียบคม ภาษาไทยแปลได้ตรงและกระชับ เข้าใจง่าย |

## Verification

- `pnpm lint` clean; `pnpm build` passes; TypeScript error count unchanged at 18 (pre-existing).
- All 89 items localise end to end; match keys are one of the choices for every pair; all 18 Thai exemplar answers score 98 through `scoreTextAnswer`.
- Batch 1 table entries regenerated byte-identical.

## Next

Round-2 sample: `exports/New_Horizon_Thai_Batch2_SpotCheck_Round2.xlsx` — 20 fresh items, none from round 1, including all 7 items that only the sweep touched. Same rule: ≥18 Approve and no ambiguous key promotes batch 2 to `approved`.
