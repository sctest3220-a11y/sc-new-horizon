# Thai Batch 3 Review (Templates + Competency Vocabulary) — Response

**Source:** `exports/New_Horizon_Thai_Review_Batch3_Templates_Reviewed.xlsx` (reviewer: Thai Proofreading Specialist, 2026-09-14)
**Scope:** the templates behind the 408 generated questions (240 `ADV-*`, 168 `TREND-*`) and the competency vocabulary: 24 competency names, 95 skill names, 10 advanced frames, 4 shared advanced options, 7 market-trend frames (42 strings), 13 trend templates, plus 12 fully rendered example questions.
**Result:** Meaning = Same on every row; Natural Thai 5/5 on every row; key unambiguous on every row; all 12 rendered examples "read well as a whole". Verdicts: competency names 22 Approve / 2 Fix; skills 64 / 31; advanced frames 6 / 4; advanced options 5 / 0; trend frames 33 / 9; trend templates 9 / 4. **51 strings corrected**, no rewrites.
**Applied:** corrections merged into the template spec, `app/page.tsx` regenerated from it, and both builders moved from `translationStatus: 'draft'` to **`'reviewed'`** — the 408 items now show Thai to every TH user (the pilot flag is no longer needed for them). Competency and skill names in reports use the corrected vocabulary.

## What the reviewer changed

Three patterns account for most of the 51 edits:

1. **Register of short labels** — skill names tightened toward formal report language: การตรวจ → การตรวจสอบ (6 skills), ของคน → ของบุคลากร, กิจวัตร → รอบ…ประจำ, การโค้ช → การโค้ชชิ่ง, and English glosses added where students may not know the acronym (หลักฐานผลตอบแทน (ROI), การสอบทานหลายแหล่งข้อมูล (triangulation), การตรวจจับฟิชชิง (Phishing)).
2. **Vendor term** — ผู้ขาย → ผู้ให้บริการ / ผู้ให้บริการภายนอก in every frame and skill where it appears (vendor-approval, data-boundary, benchmark-caveat, sovereign-data, "vendor controls"). This is the third reviewer to prefer ผู้ให้บริการ for AI/IT vendors, so the glossary entry is now **vendor → ผู้ให้บริการ (ผู้ให้บริการภายนอก for third parties; ผู้ขาย only for goods sellers / marketplace listings)**. Batches 1–2 still use ผู้ขาย in about 70 places for service vendors; align them in the batch-1 approval commit.
3. **Prompt phrasing** — "…ข้อใดหนักแน่นที่สุด" / "การตอบสนอง…ข้อใดดีที่สุด" replaced with "…ข้อใดรัดกุมและเหมาะสมที่สุด" / "แนวทางปฏิบัติ…ข้อใดเหมาะสมที่สุด" (5 prompts). Applied to every template prompt that had the pattern, so no หนักแน่นที่สุด remains in batch 3.

Also: the applied-level verb became ประยุกต์ใช้งาน, the proficient verb gained a (trade-offs) gloss, the framing sentence now says "โดยมีแนวทางปฏิบัติที่ชัดเจน เช่น …" instead of the literal "สัญญาณเชิงปฏิบัติ", and the trend-chasing feedback says ผู้ใช้ AI ที่มีศักยภาพสูง rather than ที่เก่ง. One consistency edit of mine: the benchmark-caveat "weak" option still said ผู้ขาย after the reviewer changed its scenario to ผู้ให้บริการ; aligned within the frame.

## Every change

| Where | Key | Draft | Corrected |
|---|---|---|---|
| label | D3-fraud-detection | การตรวจจับการฉ้อโกงและการชักจูง | การตรวจจับการฉ้อโกงและการล่อลวง |
| label | D5-usecase-fit | การประเมินกรณีใช้งาน | การประเมินกรณีการใช้งาน |
| skill | models vs apps | ความต่างระหว่างโมเดลกับแอป | ความแตกต่างระหว่างโมเดลกับแอป |
| skill | RAG and grounding | RAG และการยึดกับแหล่งข้อมูล | RAG และการยึดโยงกับแหล่งข้อมูล |
| skill | prompt repair | การแก้ prompt | การปรับแก้ prompt |
| skill | quality checks | การตรวจคุณภาพ | การตรวจสอบคุณภาพ |
| skill | source checking | การตรวจแหล่งข้อมูล | การตรวจสอบแหล่งข้อมูล |
| skill | claim review | การตรวจข้อกล่าวอ้าง | การตรวจสอบข้อกล่าวอ้าง |
| skill | triangulation | การเทียบหลายแหล่ง | การสอบทานหลายแหล่งข้อมูล (triangulation) |
| skill | chart forensics | การตรวจพิรุธในกราฟ | การตรวจสอบความผิดปกติของกราฟ |
| skill | baseline checks | การตรวจค่าฐาน (baseline) | การตรวจสอบค่าฐาน (baseline) |
| skill | synthetic media signals | สัญญาณสื่อสังเคราะห์ | สัญญาณของสื่อสังเคราะห์ |
| skill | caption checks | การตรวจคำบรรยายภาพ | การตรวจสอบคำบรรยายภาพ |
| skill | phishing checks | การตรวจฟิชชิง | การตรวจจับฟิชชิง (Phishing) |
| skill | retention | ระยะเวลาเก็บข้อมูล | ระยะเวลาการจัดเก็บข้อมูล |
| skill | impact review | การทบทวนผลกระทบ | การประเมินผลกระทบ |
| skill | human impact | ผลกระทบต่อคน | ผลกระทบต่อบุคลากรและผู้ใช้ |
| skill | vendor controls | มาตรการควบคุมผู้ขาย | มาตรการควบคุมผู้ให้บริการภายนอก |
| skill | problem fit | ความตรงกับปัญหา | ความสอดคล้องกับปัญหา |
| skill | user value | คุณค่าต่อผู้ใช้ | คุณค่าต่อผู้ใช้งาน |
| skill | ROI evidence | หลักฐาน ROI | หลักฐานผลตอบแทน (ROI) |
| skill | risk-adjusted value | คุณค่าที่ปรับตามความเสี่ยง | มูลค่าที่ปรับตามความเสี่ยง |
| skill | business-case design | การออกแบบ business case | การจัดทำข้อเสนอทางธุรกิจ (business case) |
| skill | role boundaries | ขอบเขตบทบาท | ขอบเขตบทบาทหน้าที่ |
| skill | review routines | กิจวัตรการตรวจทาน | รอบการตรวจทานประจำ |
| skill | human accountability | ความรับผิดชอบของคน | ความรับผิดชอบของบุคลากร |
| skill | psychological safety | ความปลอดภัยทางจิตใจในทีม | ความปลอดภัยทางจิตวิทยาในทีม |
| skill | manager modeling | หัวหน้างานทำเป็นแบบอย่าง | การเป็นแบบอย่างของหัวหน้างาน |
| skill | adoption support | การสนับสนุนการนำไปใช้ | การสนับสนุนการนำไปใช้งานจริง |
| skill | coaching loops | วงรอบการโค้ช | วงรอบการโค้ชชิ่ง |
| skill | learning ownership | ความเป็นเจ้าของการเรียนรู้ | ความมีส่วนร่วมเป็นเจ้าของการเรียนรู้ |
| skill | feedback loops | วงรอบผลสะท้อนกลับ | วงรอบข้อมูลสะท้อนกลับ |
| skill | reassessment | การประเมินซ้ำ | การประเมินผลซ้ำ |
| adv vendor-approval | contextTh | ผู้ขายอ้างว่าความสามารถด้าน AI ของตนพร้อมใช้ระดับองค์กร แต่ชุดหลักฐานยังไม่ครบ ขณะที่ผู้สนับสนุนฝ่ายธุรกิจอยากเดินหน้าทันที | ผู้ให้บริการอ้างว่าความสามารถด้าน AI ของตนพร้อมใช้ระดับองค์กร แต่ชุดหลักฐานยังไม่ครบ ขณะที่ผู้สนับสนุนฝ่ายธุรกิจอยากเดินหน้าทันที |
| adv vendor-approval | promptTh | เงื่อนไขการอนุมัติข้อใดหนักแน่นที่สุด | เงื่อนไขการอนุมัติข้อใดรัดกุมและเหมาะสมที่สุด |
| adv workflow-redesign | promptTh | ทางเลือกในการออกแบบใหม่ข้อใดหนักแน่นที่สุด | ทางเลือกในการออกแบบกระบวนการใหม่ข้อใดรัดกุมและเหมาะสมที่สุด |
| adv policy-conflict | promptTh | การตอบสนองระดับสูงข้อใดดีที่สุด | แนวทางปฏิบัติที่แสดงถึงการตัดสินใจระดับสูงในข้อใดเหมาะสมที่สุด |
| adv data-boundary | contextTh | ขั้นตอนงานที่เสนอจะรวมข้อมูลลูกค้า พนักงาน ผู้ขาย และข้อมูลปฏิบัติการจากหลายเครื่องมือเข้าด้วยกัน | ขั้นตอนงานที่เสนอจะรวมข้อมูลลูกค้า พนักงาน ผู้ให้บริการภายนอก และข้อมูลปฏิบัติการจากหลายเครื่องมือเข้าด้วยกัน |
| trend multimodal-workflow | promptTh | การจัดวางแบบใดเหมาะที่สุดสำหรับทดสอบความสามารถนี้ในทางปฏิบัติ โดยไม่เชื่อผลลัพธ์มากเกินไป | การจัดกระบวนการทดสอบในทางปฏิบัติข้อใดเหมาะสมที่สุด โดยไม่เชื่อถือผลลัพธ์มากเกินไป |
| trend rag-context | partialTh | ขยาย context window แล้วถือว่าคำตอบจะยึดกับแหล่งข้อมูลเอง | ขยาย context window แล้วถือว่าคำตอบจะยึดโยงกับแหล่งข้อมูลเอง |
| trend governed-agent | bestTh | เริ่มจากสิทธิ์อ่านอย่างเดียว บันทึกทุกการกระทำที่เอเจนต์เสนอ กำหนดให้ต้องอนุมัติก่อนเขียนข้อมูลที่กระทบลูกค้า ติดตามความล้มเหลว และขยายอำนาจเมื่อหลักฐานดีขึ้นเท่านั้น | เริ่มจากสิทธิ์อ่านอย่างเดียว บันทึกทุกการกระทำที่เอเจนต์เสนอ กำหนดให้ต้องอนุมัติก่อนเขียนข้อมูลที่กระทบลูกค้า ติดตามความล้มเหลว และขยายขอบเขตสิทธิ์การทำงานเมื่อมีหลักฐานความพร้อมที่ชัดเจนขึ้นเท่านั้น |
| trend benchmark-caveat | contextTh | ผู้ขายแสดงคะแนน benchmark (ผลทดสอบเทียบ) ที่สูงของโมเดลเฉพาะทาง และอ้างว่าจะทำงานได้ดีกว่าโมเดลทั่วไปในขั้นตอนงานของคุณ | ผู้ให้บริการแสดงคะแนน benchmark (ผลทดสอบเทียบ) ที่สูงของโมเดลเฉพาะทาง และอ้างว่าจะทำงานได้ดีกว่าโมเดลทั่วไปในขั้นตอนงานของคุณ |
| trend benchmark-caveat | promptTh | การประเมินระดับชำนาญข้อใดหนักแน่นที่สุด | การประเมินในระดับผู้เชี่ยวชาญข้อใดรัดกุมและมีน้ำหนักมากที่สุด |
| trend sovereign-data | contextTh | ธุรกิจระดับภูมิภาคต้องการระบบ AI ที่รองรับภาษาท้องถิ่น กฎเฉพาะภาคธุรกิจ ข้อกำหนดถิ่นที่เก็บข้อมูล (data residency) และความกังวลเรื่องการพึ่งพาผู้ขาย | ธุรกิจระดับภูมิภาคต้องการระบบ AI ที่รองรับภาษาท้องถิ่น กฎเฉพาะภาคธุรกิจ ข้อกำหนดถิ่นที่เก็บข้อมูล (data residency) และความกังวลเรื่องการพึ่งพาผู้ให้บริการภายนอก |
| trend sovereign-data | promptTh | การตอบสนองระดับสูงข้อใดหนักแน่นที่สุด | แนวทางปฏิบัติระดับสูงข้อใดรัดกุมและเหมาะสมที่สุด |
| trend sovereign-data | bestTh | เปรียบเทียบความสามารถของโมเดลกับถิ่นที่เก็บข้อมูล ประสิทธิภาพด้านภาษา ความสามารถในการตรวจสอบ ทางออกจากผู้ขาย และภาระผูกพันตามกฎระเบียบท้องถิ่น ก่อนออกแบบการนำไปใช้ | เปรียบเทียบความสามารถของโมเดลกับถิ่นที่เก็บข้อมูล ประสิทธิภาพด้านภาษา ความสามารถในการตรวจสอบ แผนการเปลี่ยนผ่านออกจากผู้ให้บริการ (vendor exit path) และภาระผูกพันตามกฎระเบียบท้องถิ่น ก่อนออกแบบการนำไปใช้ |
| trend sovereign-data | partialTh | เลือกโมเดลระดับโลกที่แข็งที่สุด แล้วแปลผลลัพธ์เป็นภาษาท้องถิ่น | เลือกโมเดลระดับโลกที่มีประสิทธิภาพสูงสุด แล้วแปลผลลัพธ์เป็นภาษาท้องถิ่น |
| trend suffix | contextSuffix | สมรรถนะที่วัด: {label} ผู้ใช้ควรแสดงให้เห็นว่า{lead} {label} โดยใช้สัญญาณเชิงปฏิบัติ เช่น {skills} | สมรรถนะที่วัด: {label} ผู้ใช้ควรแสดงให้เห็นว่า{lead} {label} โดยมีแนวทางปฏิบัติที่ชัดเจน เช่น {skills} |
| lead | applied | ใช้งาน | ประยุกต์ใช้งาน |
| lead | proficient | จัดการข้อแลกเปลี่ยนใน | สามารถจัดการข้อแลกเปลี่ยน (trade-offs) ใน |
| feedback | trend-chasing | การวิ่งตามกระแสไม่ใช่ความพร้อม ผู้ใช้ AI ที่เก่งจะเชื่อมความสามารถใหม่เข้ากับหลักฐาน การออกแบบขั้นตอนงาน และการใช้งานที่มีผู้รับผิดชอบ | การวิ่งตามกระแสไม่ใช่ความพร้อม ผู้ใช้ AI ที่มีศักยภาพสูงจะเชื่อมโยงความสามารถใหม่เข้ากับหลักฐาน การออกแบบขั้นตอนงาน และการใช้งานที่มีผู้รับผิดชอบ |

## Verification

- `pnpm lint` clean; `pnpm build` passes; TypeScript error count unchanged at 18 (pre-existing).
- All 408 generated items localise fully in the TH view with ids and scores unchanged; English view is the identity; no glued parentheses or double spaces after interpolation.
- All 24 competency names round-trip EN → TH → EN through `translateUiText` (no collisions with `thaiUiCopy` or skill names).

## Next

Second-reviewer spot check: `exports/New_Horizon_Thai_Batch3_SpotCheck.xlsx` — 20 fully rendered questions, every one of the 17 scenario frames once with a different competency each, plus 3 more. Same rule as batches 1–2 (≥18 Approve, no ambiguous key) promotes all 408 items to `approved` in one step, since they share the templates.
