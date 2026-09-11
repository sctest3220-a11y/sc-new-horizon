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
- `approved` — second reviewer or back-translation spot check passed. Only `approved` items should ship in the default Thai experience once the toggle is public.

## Style rules

- Formal but conversational: address the user as คุณ; avoid bureaucratic register.
- Keep established technical terms in English: AI, prompt, RAG, agent, PDPA, API, CRM, OCR, model. Thai transliteration only where the term is already common in Thai workplaces (เอเจนต์ is acceptable alongside agent).
- Currency in Thai scenarios is baht; keep numbers as digits.
- Thai runs 20–30% longer than English. Keep the shortened Awareness-level scenario lengths.
- Feedback for the best option starts with "ดีที่สุด"; partial options explain the trade-off, not only that they are wrong.

## Current coverage

- Batch 1 (2026-09-11): 163 items `reviewed` — the Thai-priority-High set from audit round 1. 137 in `questionTranslations.th.ts`, 26 Horizon items inline. Reviewer edited 39 scenarios and 32 prompts; choices, rubric keywords, glossary and artifact tags were confirmed as drafted. Source workbook: `exports/New_Horizon_Thai_Review_Batch1_Completed.xlsx`; glossary: `exports/glossary_th.json`.
- Shared reliance option labels (`relianceOptions.*.labelTh`) apply to any reliance item that has a translation status.
- Remaining: 497 items English only (89 marked Thai priority Medium are batch 2).
- Artifacts: language tags re-checked against the expanded relevance gate (22 hidden question ids) in `exports/artifact-language-tags.json`. 26 artifacts still display and need a Thai version (16 "Thai needed", 10 "Both"); 15 stay English. Produce message-type artifacts first (scam SMS, forwarded chat, social posts, invoice, login alert, scheduling email, vendor memo, product listing) because a Thai user cannot judge them realistically in English. Do not produce Thai images for artifacts hidden by the gate.
- Glossary aligned with the README style guide: Domain, Competency, Assessment, Platform, telemetry and Workflow stay in English in Thai copy.

## Workflow for a translation batch

1. Export the batch: `node scripts/dump-question-bank.mjs exports/bank.json`, filter by id list.
2. Draft Thai for `contextTh`, `promptTh`, option `labelTh`/`feedbackTh`, and artifact text into the bilingual review workbook.
3. Native review in the workbook (meaning, naturalness, key still unambiguous, terminology, UI length, cultural fit).
4. Apply to `app/page.tsx` with `translationStatus: 'reviewed'`; second check promotes to `approved`.
5. Pilot in Thai and compare per-item time and score distributions against English via existing telemetry.
