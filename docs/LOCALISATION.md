# Question Bank Localisation (Thai)

Last status review: **30 September 2026**, using the local `kj-dee-branch` checkout. The remote branch was fetched before publishing the English inventory wording update.

Artifact translation, equivalence, readability, and release requirements are defined in the canonical [Artifact Design and QA Standard](ARTIFACT_DESIGN_AND_QA_STANDARD.md). Question wording and cultural-context rules are defined in [Question Rewrite Rules and Versioning](QUESTION_REWRITE_RULES.md).

## Latest Thai translation status

The English user-facing drafts now record wording pass `2026-09-30.1`, applying approved rules v2.1 plus provisional v2.2-draft. Operational evidence appears beside its action question instead of a generic “extra detail” reference. Multipart instructions specify one answer per question; existing multi-select drafts state their current selection count without inventing another correct answer. Six complete text checkpoints from the review log are applied, with matching Thai. The original audit wording, answer keys, formats and scoring remain preserved.

This is a draft wording update for the localisation audit, not certification that all content problems are resolved. [English QA](../exports/review-inventory/english-rewrite-qa.json) lists ambiguous choices and missing scoring definitions. The two agreed marketing image candidates still require bilingual artifact integration; their existing inventory evidence is retained. [English rewrite history](../exports/review-inventory/english-rewrite-history.json) preserves every previous bilingual draft and leaves preferred versions unselected.

To reapply this version to the existing translated inventory and rebuild localhost assets:

```sh
node scripts/rewrite-english-review-inventory.mjs
node scripts/apply-thai-review-translations.mjs
node scripts/build-review-inventory-assets.mjs
node --test scripts/test-english-inventory.mjs scripts/test-thai-inventory.mjs scripts/test-review-inventory.mjs
```

The wording updater is idempotent. Do not regenerate the base inventory as a shortcut: generation replaces review data. New English text requires a complete Thai translation; unknown text still fails the translation command.

| Scope | Count | Translation status and evidence |
|---|---:|---|
| Draft review inventory | 3,328 | Thai text regenerated on 30 September 2026 in [questions.json](../exports/review-inventory/questions.json): 83,268 translated text fields. Status remains `machine-assisted-needs-review`. |
| Live-bank review export | 634 | Thai populated on 30 September 2026 in [live-questions.json](../exports/review-inventory/live-questions.json), reusing reviewed source translations where the English matches and translating older export wording separately. New export translations still need human review. |
| Historical translation batches 1–3 | 660 | Approval recorded on 14 September 2026; details below. This historical total must not be presented as the current live-bank count or approval of the draft inventory. |

The draft inventory contains 768 Core, 1,296 Function, 320 Industry and 944 Executive items. Its Thai fields support the reviewer workflow; they do not authorize use in scored assessments. The new [Thai QA report](../exports/review-inventory/thai-translation-qa.json) records **0 unexpected English-fragment or placeholder findings** across the inventoried draft text fields, replacing the historical 22,468 flagged-field report. The scanner now covers audit wording, option feedback, user-facing drafts, multipart questions, and artifact briefs/prompts. Zero findings is a completeness check, not proof of semantic quality or human approval. A separate 2,003-item content queue flags source artifact instructions that request highlighted evidence or marked failure points; these require review against the neutral-evidence standard.

ID-level reconciliation on 30 September found 660 items in the application and 634 in the review export. The application has 26 additional `REL-H-*` Horizon items absent from that export. This translation preserves the existing export membership and English versions; it does not replace historical export wording with newer application wording or certify renewed approval.

### สรุปสถานะภาษาไทย

แปลข้อความคลังร่างครบ 3,328 ข้อ รวม 83,268 ช่องข้อความ และเติมภาษาไทยให้คลังใช้งานจริงฉบับส่งออก 634 ข้อแล้ว โดยคงต้นฉบับอังกฤษ รหัส เฉลย คะแนน และลำดับตัวเลือก ผลตรวจอัตโนมัติของคลังร่างไม่พบข้อความอังกฤษนอกศัพท์ที่อนุญาตหรือ placeholder ตกค้าง แต่ยังต้องให้ผู้ตรวจภาษาไทยตรวจความหมายและความเป็นธรรมชาติ ภาพประกอบจริงยังไม่ได้เปลี่ยนจากงานแปลข้อความครั้งนี้ แอปมีคำถาม Horizon อีก 26 ข้อที่ไม่อยู่ในฉบับส่งออก จึงมีจำนวนรวม 660 ข้อ

### Remaining review and release work

1. Perform human linguistic and semantic review of the completed text, preserving approved technical terms. Check the scenario, prompt, every option, explanations, feedback and artifact text together; passing the scanner is not release approval.
2. Apply the latest [Thai wording refinements](QUESTION_REWRITE_RULES.md#thai-wording-refinements---local-review-update): identify the actor, action, claimed outcome and evidence to check. Preserve meaning, uncertainty, numbers, answer order, selected format and answer key. Distinguish approved v2.1 rules from provisional v2.2-draft refinements.
3. Record reviewer decisions for revised items rather than inheriting approval solely from an older batch count. Decide separately whether to refresh the historical live export to include the 26 additional application items and newer English wording.
4. Resolve the remaining glossary decision for `escalation`; verify the historical artifact backlog and obtain Thai image sign-off. The last recorded backlog below is not a fresh artifact audit.
5. Complete the required second review or spot check before release, then compare Thai and English pilot timing and score distributions.

Review both banks at `/admin/question-inventory?lang=th`; see the [local review guide](QUESTION_INVENTORY_LOCAL_REVIEW.md). Draft inventory translations live in the inventory export's `th` fields, including user-facing rewrite content, separately from the live-bank storage described below. Saving reviewer feedback or approving a workbook row does not itself publish a translated question.

### Rebuild the translated review inventory

Draft translations are maintained as complete sentence templates in `inventory/th/sentences.json` and explicit context terms in `inventory/th/context-terms.json`. The translator rejects unknown sentences instead of falling back to fragment replacement. Add a complete translation when English changes; never use partial-word substitution to fill gaps. Live-export differences use `inventory/th/live-review-overrides.json` and the existing application localisation data. The generated `app/questionTranslations.th.ts` remains managed through its reviewed-workbook workflow.

```text
node scripts/apply-thai-review-translations.mjs
node scripts/localize-live-review-inventory.mjs
node --test scripts/test-thai-inventory.mjs scripts/test-review-inventory.mjs
node scripts/build-review-inventory-assets.mjs
```

The text translation preserves source content issues for separate review rather than silently changing the English construct, key or format. Accepted question-specific wording in the review log remains the reference for its agreed candidate; it is not transplanted onto a different older English scenario. Existing XLSX workbooks and image files are not regenerated by these commands; the JSON exports and Admin reviewer are the updated deliverables.
Translation-provider selection, Google/Qwen/ThaiLLM responsibilities, newsfeed routing, cost assumptions, caching, telemetry, and production gates are defined in [Translation Provider Strategy](TRANSLATION_PROVIDER_STRATEGY.md).

## Model

English is the source of truth for every question. In the live assessment, Thai lives in two places, both keyed by the question's id (never by matching the English string):

1. Optional `*Th` fields written beside the English on the item in `app/page.tsx` (used for the 26 Horizon items).
2. `app/questionTranslations.th.ts` — a generated, id-keyed table produced from the reviewed workbook. This is the main store; it wins over inline fields when both exist. Do not hand-edit it; regenerate it from the review workbook.

Optional fields (all in `app/page.tsx`):

| Where | Fields |
|---|---|
| `Question` | `contextTh`, `promptTh`, `translationStatus: 'draft' \| 'reviewed' \| 'approved'` |
| `Option` | `labelTh`, `feedbackTh` |
| `Question.stimulus` | `altTh`, `labelTh`, `captionTh` |
| `VisualStimulus` | `titleTh`, `eyebrowTh`, `captionTh`, `pointsTh` |
| `RankItem` | `labelTh` |
| `MatchPair` | `leftTh`, `correctTh`, `choicesTh` (a pair switches to Thai only when all choices and the key are translated) |
| `QuestionPart` | `promptTh`; part options use `labelTh`/`feedbackTh` |
| `RubricCriterion` | `labelTh`, `keywordsTh` — free-text scoring matches English **and** Thai keywords |
| `Question` | `rankRationaleTh`, `exemplarAnswerTh` |

Rendering: `localizeQuestion(question, appLanguage)` returns the question as it should be shown. It only localises items that carry a `translationStatus`, so a half-translated bank never shows Thai buttons under an English scenario. Every field falls back to English when the Thai field is missing. Option ids, scores, keys, competencies, and telemetry are language-independent; the report re-localises stored answers with `localizeAnswerOption`, so switching language after answering updates the feedback shown.

Matching: selections store the choice string that was shown, so matches are scored against the localised pairs and selections reset if the language is switched mid-question. Market-trend / advanced items use translated frames and generator templates; see the template-generated items section below.

The older `thaiUiCopy` dictionary remains for interface chrome only. Do not add question text to it.

## Status workflow

- `draft` — machine or non-native draft; shown only to pilot users who set `localStorage['new-horizon-thai-drafts-v1'] = '1'` (`localizeQuestion(question, language, includeDrafts)`).
- `reviewed` — a native Thai reviewer with domain knowledge has checked meaning, naturalness, terminology, and that the correct answer is still unambiguous in Thai.
- `approved` — second reviewer or back-translation spot check passed (≥18 of a 20-item stratified sample Approve, no ambiguous key; otherwise sweep the flagged pattern batch-wide and resample without overlap). Only `approved` items should ship in the default Thai experience once the toggle is public. The 14 September approval record applies to the historical batches below, not the newer review inventory. The documented renderer treats `reviewed` and `approved` identically; rendering behavior must not be treated as release approval.

## Style rules

For question rewrites, also apply the locally updated [Thai wording refinements](QUESTION_REWRITE_RULES.md#thai-wording-refinements---local-review-update): name the actor, action and measured outcome; distinguish the draft's claim from evidence of actual results; and state which evidence the team must check. Preserve the agreed meaning, uncertainty, format and answer key while using natural Thai sentence structure. The accepted marketing wording is recorded in the [review log](QUESTION_REWRITE_RULE_REVIEW_LOG.md#thai-marketing-wording---user-passed-candidate).

### Latest Thai rewrite checklist — verified 30 September 2026

Checked against the six Thai refinements and the accepted marketing candidate in the local review log. The canonical rules remain in `QUESTION_REWRITE_RULES.md`; this checklist summarizes them for translation work. The approved baseline remains v2.1, with these wording refinements tracked under v2.2-draft.

1. **ระบุผู้กระทำ การกระทำ และผลลัพธ์ให้ชัด:** บอกว่าใครใช้เครื่องมือใด ทำงานอะไร และวัดผลอะไรตามต้นฉบับ ไม่ใช้คำกว้างจนความสัมพันธ์หายไป
2. **แยกคำกล่าวอ้างจากหลักฐาน:** ร่างข้อความเป็นสิ่งที่ต้องตรวจสอบ ไม่ใช่ข้อพิสูจน์ว่าผลลัพธ์เกิดขึ้นจริง คำว่า “หลังใช้” ไม่ได้ยืนยันเหตุและผล
3. **ระบุสิ่งที่ต้องตรวจและแหล่งข้อมูล:** บอกว่าทีมต้องตรวจอะไรจากภาพ เอกสาร ตาราง หรือบันทึกใด โดยเรียกหลักฐานตามชนิดจริง
4. **ใช้ภาษาไทยที่เป็นธรรมชาติ:** เชื่อมสถานการณ์ให้ต่อเนื่อง ใช้คำเรียกสิ่งเดียวกันให้สม่ำเสมอ แยกประโยคยาวโดยคงเงื่อนไขสำคัญ และไม่บังคับโครงสร้างเดียวกับทุกข้อ
5. **รักษาขอบเขตของผลทดลอง:** คงกลุ่มผู้ใช้ งานที่วัด ค่าเฉลี่ย และเงื่อนไขเดิม ไม่ขยายผลเป็นลูกค้าทุกคนหรือเพิ่มความแน่นอนจากต้นฉบับ
6. **ตรวจทั้งข้อและรักษาฉบับที่ยอมรับแล้ว:** ตรวจสถานการณ์ คำถาม ทุกตัวเลือก ข้อความในภาพ เฉลย และคำอธิบายร่วมกัน คงรูปแบบ จำนวนข้อ ลำดับตัวเลือก ตัวเลข และเฉลย พร้อมนำถ้อยคำที่ผู้ใช้ระบุว่า “pass” กลับมาใช้

Accepted wording to preserve:

> ก่อนเผยแพร่ ทีมต้องตรวจสอบจากข้อมูลในภาพประกอบว่า หลังใช้แอป ผู้ใช้ประหยัดเวลาเตรียมรายการซื้อของได้ตามที่ร่างโพสต์กล่าวอ้างหรือไม่ และภาพได้รับอนุญาตให้ใช้ในแคมเปญหรือไม่

Apply this example only when the scenario supports its facts; do not insert the app, outcome or image-permission requirement into unrelated items. Wording acceptance does not by itself approve question-bank implementation or release.

### General translation conventions

- Formal but conversational: address the user as คุณ; avoid bureaucratic register.
- Keep established technical terms in English: AI, prompt, RAG, agent, PDPA, API, CRM, OCR, model. Thai transliteration only where the term is already common in Thai workplaces (เอเจนต์ is acceptable alongside agent).
- Currency in Thai scenarios is baht; keep numbers as digits.
- Thai runs 20–30% longer than English. Keep the shortened Awareness-level scenario lengths.
- Feedback for the best option starts with "ดีที่สุด"; partial options explain the trade-off, not only that they are wrong.
- Prompts use exam phrasing ("ข้อใด…ที่สุด", "ข้อใดคือ…") and the bare imperative for tasks ("เขียน 2-4 ประโยค…", "จัดลำดับ…") — no leading จง, no literal "…คืออะไร". Keep this consistent across batches; a reviewer's register change is applied to every batch or not at all.
- Free-text rubric keywords are substring-matched: no stems shorter than three Thai characters or two Latin letters (คน, รอ, PR match noise). Every Thai exemplar answer must score fully through `scoreTextAnswer` before a batch is applied.

## Historical coverage — 14 September 2026

The following records preserve the original batch approvals and artifact backlog. They are historical evidence, not a fresh verification of every current item or artifact.

- Batch 1 (2026-09-11; **`approved`** 2026-09-14 after spot check round 2 passed 20/20, `docs/THAI_BATCH1_SPOTCHECK_ROUND2_RESPONSE.md`): 163 items — the Thai-priority-High set from audit round 1. 137 in `questionTranslations.th.ts`, 26 Horizon items inline. Reviewer edited 39 scenarios and 32 prompts; choices, rubric keywords, glossary and artifact tags were confirmed as drafted. Source workbook: `exports/New_Horizon_Thai_Review_Batch1_Completed.xlsx`; glossary: `exports/glossary_th.json`.
- Shared reliance option labels (`relianceOptions.*.labelTh`) apply to any reliance item that has a translation status.
- Batch 2 (2026-09-14): 89 items **`approved`** (spot check round 2 passed 20/20; `docs/THAI_BATCH2_SPOTCHECK_ROUND2_RESPONSE.md`). Native review: — the Thai-priority-Medium set. 49 Approve / 40 Fix in cell / 0 Rewrite; 22 scenarios, 36 prompts, 3 key options reworded; all 83 rubric keyword lists expanded. Source workbook: `exports/New_Horizon_Thai_Review_Batch2_Completed.xlsx`; response: `docs/THAI_BATCH2_REVIEW_RESPONSE.md`. Spot check round 1: 13/7/0, no ambiguous keys → 19 items swept (`docs/THAI_BATCH2_SPOTCHECK_ROUND1_RESPONSE.md`); round 2: 20/0/0 → approved.
- Glossary decision (batch 3 review, 2026-09-14): vendor → ผู้ให้บริการ for AI/IT/SaaS vendors, ผู้ให้บริการภายนอก for third parties, ผู้ขาย only for sellers of goods. **Applied to batches 1–2 on 2026-09-14** together with the batch-2 glossary changes (`docs/THAI_BATCH3_SPOTCHECK_RESPONSE.md`). Still open: escalation (ส่งต่อให้ผู้มีอำนาจ vs ส่งต่อให้ผู้รับผิดชอบระดับสูงขึ้น / ส่งต่อเคสให้หัวหน้างาน).
- Glossary (batch 2 review): hallucination → "hallucination (การกุข้อมูล / สร้างข้อมูลเท็จ)", human review → "การตรวจทานโดยคน (Human-in-the-loop)" on first mention, override → "การแก้ไขทับผล AI (override)". Applied to batch 1 on 2026-09-14.
- Batch 3 (2026-09-14, **`approved`** — spot check 20/20, `docs/THAI_BATCH3_SPOTCHECK_RESPONSE.md`): the 408 template-generated items (240 `ADV-*`, 168 `TREND-*`) carry Thai from translated frames and templates plus the competency vocabulary (`competencyLabelsTh`, `skillLabelsTh`). Native review of the templates applied (51 strings; `docs/THAI_BATCH3_REVIEW_RESPONSE.md`); spot check: `exports/New_Horizon_Thai_Batch3_SpotCheck_Reviewed.xlsx`. Competency and skill names also switch language in reports via `translateUiText`.
- **660 questions recorded as `approved` across batches 1–3** (2026-09-14). Remaining work recorded at that time: escalation term decision, Thai artifacts (9 draft images + 17 outstanding), Thai pilot telemetry comparison.
- Artifacts: language tags re-checked against the expanded relevance gate (22 hidden question ids) in `exports/artifact-language-tags.json`. 26 artifacts still display and need a Thai version (16 "Thai needed", 10 "Both"); 15 stay English. Produce message-type artifacts first (scam SMS, forwarded chat, social posts, invoice, login alert, scheduling email, vendor memo, product listing) because a Thai user cannot judge them realistically in English. Do not produce Thai images for artifacts hidden by the gate.
- Thai artifact images: the nine message-type artifacts have `-th` versions (`public/stimuli/*-th.svg|png`), produced 2026-09-11 by repainting only the text (SVG text nodes replaced with Noto Sans Thai embedded; PNG text regions repainted over the original screenshots). `thaiStimulusSources` in `page.tsx` maps English src → Thai src and `localizeQuestion` swaps it for questions that have a translation status, so an untranslated question never shows a Thai image under English text. The EN→TH text for every artifact is in `exports/artifact-thai-text-spec.json` for reviewer sign-off; treat the images as `draft` until a native reviewer confirms them.
- Glossary aligned with the README style guide: Domain, Competency, Assessment, Platform, telemetry and Workflow stay in English in Thai copy.

## Review-inventory wording refinements - 1 October 2026

The English/Thai review inventory is separate from the scored production bank. The user's inventory-wide request authorizes local updates to `exports/review-inventory/questions.json`, `live-questions.json`, their translation mappings, artifact plans and generated admin assets. These drafts are not promoted to production or marked as human-approved.

Run `npm run inventory:refine` after generating or changing the review inventory. It applies the source-aware bilingual refinements in `inventory/wording-refinements.mjs`, refreshes strict Thai translations and artifact reports, and rebuilds the localhost assets. Run this after the older English rewrite pass; that pass must not overwrite a newer revision. Shared translations selected in the current checkpoints take precedence over older copies of the same sentence.

The accepted Customer Service English wording is maintained in `inventory/english-wording-checkpoints.mjs`. These English-only checkpoints retain their previous Thai drafts and carry `previous-revision-pending-sync`; the pipeline must not register old Thai text as a translation of the new English. The user authorized publishing these accumulated updates on 1 October 2026, without approving new Thai wording or production assessment use.

Original English audit wording and all selected question formats, choice order, keys and scores are checked against saved baselines. Earlier drafts and artifact metadata are retained in `wording-refinement-history.json`. The current per-item report is `wording-refinement-qa.json`; `english-rewrite-qa.json` remains the historical report for the previous English pass. `thai-translation-qa.json` checks translation coverage and text corruption, not human approval. The audit-source workbook remains an original-source export; current user-facing drafts are in the bilingual JSON and localhost inventory.

Validation: `node --test scripts/test-english-inventory.mjs scripts/test-review-inventory.mjs scripts/test-thai-inventory.mjs scripts/test-wording-refinements.mjs`. Missing evidence, ambiguous choices, incomplete scoring and artifact necessity require individual review rather than invented facts or silent template changes.

## Template-generated items

`ADV-*` and `TREND-*` questions are built at module load from `advancedQuestionFrames` / `marketTrendFrames` and `competencyDefinitions`. Their Thai lives on the frames (`contextTh`, `promptTh`, `bestTh`…), in the builders' option templates, and in `competencyLabelsTh` / `skillLabelsTh`. Translate and review those, never the generated ids. Placeholders `{label}`, `{lead}`, `{skills}`, `{difficulty}` in the review workbook map to template literals in the builders; keep a space on both sides of an inserted name so a gloss in parentheses never touches Thai text.

## Workflow for a translation batch

1. Export the batch: `node scripts/dump-question-bank.mjs exports/bank.json`, filter by id list.
2. Draft Thai for `contextTh`, `promptTh`, option `labelTh`/`feedbackTh`, and artifact text into the bilingual review workbook.
3. Native review in the workbook (meaning, naturalness, key still unambiguous, terminology, UI length, cultural fit).
4. Apply to `app/questionTranslations.th.ts` (generated) with status `reviewed`; second check promotes to `approved`.
5. Pilot in Thai and compare per-item time and score distributions against English via existing telemetry.
