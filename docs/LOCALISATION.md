# Question Bank Localisation (Thai)

## Model

English is the source of truth for every question. Thai is stored beside it on the same item, never in a separate dictionary, so an edit to the English text is visible next to the Thai that must follow it.

Optional fields (all in `app/page.tsx`):

| Where | Fields |
|---|---|
| `Question` | `contextTh`, `promptTh`, `translationStatus: 'draft' \| 'reviewed' \| 'approved'` |
| `Option` | `labelTh`, `feedbackTh` |
| `Question.stimulus` | `altTh`, `labelTh`, `captionTh` |
| `VisualStimulus` | `titleTh`, `eyebrowTh`, `captionTh`, `pointsTh` |
| `RankItem` | `labelTh` |

Rendering: `localizeQuestion(question, appLanguage)` returns the question as it should be shown. It only localises items that carry a `translationStatus`, so a half-translated bank never shows Thai buttons under an English scenario. Every field falls back to English when the Thai field is missing. Option ids, scores, keys, competencies, and telemetry are language-independent; the report re-localises stored answers with `localizeAnswerOption`, so switching language after answering updates the feedback shown.

Not yet localisable (follow-up): `matchPairs` (choices double as keys), `QuestionPart` prompts and options, rubric criteria and exemplar answers for text items, and the market-trend / advanced templates (translate the frames, not the generated items).

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

- 26 Horizon reliance items (`REL-H-*`): `draft`. Task, scenario, and best-answer rationale come from the Horizon deck's own Thai; option labels, partial-credit feedback, and visual-card points were drafted here and need native review.
- Shared reliance option labels (`relianceOptions.*.labelTh`) apply to any reliance item once it carries a `translationStatus`.
- Everything else: English only. Reviewers marked 163 items Thai priority High in the round-1 audit; that is the next batch.

## Workflow for a translation batch

1. Export the batch: `node scripts/dump-question-bank.mjs exports/bank.json`, filter by id list.
2. Draft Thai for `contextTh`, `promptTh`, option `labelTh`/`feedbackTh`, and artifact text into the bilingual review workbook.
3. Native review in the workbook (meaning, naturalness, key still unambiguous, terminology, UI length, cultural fit).
4. Apply to `app/page.tsx` with `translationStatus: 'reviewed'`; second check promotes to `approved`.
5. Pilot in Thai and compare per-item time and score distributions against English via existing telemetry.
