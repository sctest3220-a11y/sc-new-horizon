# Question Bank Localisation (Thai)

## Model

English is the source of truth for every question. Thai lives in two places, both keyed by the question's id (never by matching the English string):

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

Matching: selections store the choice string that was shown, so matches are scored against the localised pairs and selections reset if the language is switched mid-question. Not yet localisable: the market-trend / advanced templates (translate the frames in `marketTrendFrames` / the advanced generator, not the 300+ generated items).

The older `thaiUiCopy` dictionary remains for interface chrome only. Do not add question text to it.

## Status workflow

- `draft` — machine or non-native draft; may be shown to users only in pilots.
- `reviewed` — a native Thai reviewer with domain knowledge has checked meaning, naturalness, terminology, and that the correct answer is still unambiguous in Thai.
- `approved` — second reviewer or back-translation spot check passed (≥18 of a 20-item stratified sample Approve, no ambiguous key; otherwise sweep the flagged pattern batch-wide and resample without overlap). Only `approved` items should ship in the default Thai experience once the toggle is public — that gate is not yet implemented; today `reviewed` and `approved` render identically.

## Style rules

- Formal but conversational: address the user as คุณ; avoid bureaucratic register.
- Keep established technical terms in English: AI, prompt, RAG, agent, PDPA, API, CRM, OCR, model. Thai transliteration only where the term is already common in Thai workplaces (เอเจนต์ is acceptable alongside agent).
- Currency in Thai scenarios is baht; keep numbers as digits.
- Thai runs 20–30% longer than English. Keep the shortened Awareness-level scenario lengths.
- Feedback for the best option starts with "ดีที่สุด"; partial options explain the trade-off, not only that they are wrong.
- Prompts use exam phrasing ("ข้อใด…ที่สุด", "ข้อใดคือ…") and the bare imperative for tasks ("เขียน 2-4 ประโยค…", "จัดลำดับ…") — no leading จง, no literal "…คืออะไร". Keep this consistent across batches; a reviewer's register change is applied to every batch or not at all.
- Free-text rubric keywords are substring-matched: no stems shorter than three Thai characters or two Latin letters (คน, รอ, PR match noise). Every Thai exemplar answer must score fully through `scoreTextAnswer` before a batch is applied.

## Current coverage

- Batch 1 (2026-09-11): 163 items `reviewed` — the Thai-priority-High set from audit round 1. 137 in `questionTranslations.th.ts`, 26 Horizon items inline. Reviewer edited 39 scenarios and 32 prompts; choices, rubric keywords, glossary and artifact tags were confirmed as drafted. Source workbook: `exports/New_Horizon_Thai_Review_Batch1_Completed.xlsx`; glossary: `exports/glossary_th.json`.
- Shared reliance option labels (`relianceOptions.*.labelTh`) apply to any reliance item that has a translation status.
- Batch 2 (2026-09-14): 89 items **`approved`** (spot check round 2 passed 20/20; `docs/THAI_BATCH2_SPOTCHECK_ROUND2_RESPONSE.md`). Native review: — the Thai-priority-Medium set. 49 Approve / 40 Fix in cell / 0 Rewrite; 22 scenarios, 36 prompts, 3 key options reworded; all 83 rubric keyword lists expanded. Source workbook: `exports/New_Horizon_Thai_Review_Batch2_Completed.xlsx`; response: `docs/THAI_BATCH2_REVIEW_RESPONSE.md`. Spot check round 1: 13/7/0, no ambiguous keys → 19 items swept (`docs/THAI_BATCH2_SPOTCHECK_ROUND1_RESPONSE.md`); round 2: 20/0/0 → approved.
- Open glossary questions from the batch-2 spot check: vendor (ผู้ขาย vs ผู้ให้บริการ for service contracts) and escalation (ส่งต่อให้ผู้มีอำนาจ vs ส่งต่อให้ผู้รับผิดชอบระดับสูงขึ้น). Decide once, apply to both batches.
- Glossary (batch 2 review): hallucination → "hallucination (การกุข้อมูล / สร้างข้อมูลเท็จ)", human review → "การตรวจทานโดยคน (Human-in-the-loop)" on first mention, override → "การแก้ไขทับผล AI (override)". Batch 1 text still carries the earlier renderings; align it when its round-2 spot check closes.
- Remaining: 408 items English only (mostly generated market-trend and advanced template items).
- Artifacts: language tags re-checked against the expanded relevance gate (22 hidden question ids) in `exports/artifact-language-tags.json`. 26 artifacts still display and need a Thai version (16 "Thai needed", 10 "Both"); 15 stay English. Produce message-type artifacts first (scam SMS, forwarded chat, social posts, invoice, login alert, scheduling email, vendor memo, product listing) because a Thai user cannot judge them realistically in English. Do not produce Thai images for artifacts hidden by the gate.
- Thai artifact images: the nine message-type artifacts have `-th` versions (`public/stimuli/*-th.svg|png`), produced 2026-09-11 by repainting only the text (SVG text nodes replaced with Noto Sans Thai embedded; PNG text regions repainted over the original screenshots). `thaiStimulusSources` in `page.tsx` maps English src → Thai src and `localizeQuestion` swaps it for questions that have a translation status, so an untranslated question never shows a Thai image under English text. The EN→TH text for every artifact is in `exports/artifact-thai-text-spec.json` for reviewer sign-off; treat the images as `draft` until a native reviewer confirms them.
- Glossary aligned with the README style guide: Domain, Competency, Assessment, Platform, telemetry and Workflow stay in English in Thai copy.

## Workflow for a translation batch

1. Export the batch: `node scripts/dump-question-bank.mjs exports/bank.json`, filter by id list.
2. Draft Thai for `contextTh`, `promptTh`, option `labelTh`/`feedbackTh`, and artifact text into the bilingual review workbook.
3. Native review in the workbook (meaning, naturalness, key still unambiguous, terminology, UI length, cultural fit).
4. Apply to `app/questionTranslations.th.ts` (generated) with status `reviewed`; second check promotes to `approved`.
5. Pilot in Thai and compare per-item time and score distributions against English via existing telemetry.
