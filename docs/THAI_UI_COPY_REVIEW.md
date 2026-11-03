# Thai interface and content copy: review worklist

**Status: draft, not approved.** Generated on 3 November 2026 when the learner
app moved to the language system in `i18n/`. Most of the Thai below was
drafted by Claude for this change and has not been read by a native
reviewer. Nothing in this file is an approval. Question text is not covered
here: it keeps its own reviewed translations and workflow
([`LOCALISATION.md`](LOCALISATION.md)).

## What needs review

The full list is [`exports/thai-ui-copy-review.csv`](../exports/thai-ui-copy-review.csv)
(file, key, English, Thai, status), sorted with the drafts first.

| Where it lives | Status | Strings |
| --- | --- | --- |
| Interface messages, `i18n/messages/th.json` | Draft, 3 November 2026 | 620 |
| Interface messages | Existing app copy (the old `thaiUiCopy` table) | 356 |
| Interface messages | Same in both languages (brand, codes, punctuation patterns) | 23 |
| Content, `i18n/content/th.json` | Draft, 3 November 2026 | 1,416 |
| Content | Reviewed 14 September 2026 (competency and skill names) | 119 |
| Content | Existing app copy | 19 |

Drafts follow the house style (product terms such as Profile, Assessment,
Competency and Workflow stay in English inside Thai sentences) and
[`exports/glossary_th.json`](../exports/glossary_th.json).

## How to change a string

- **Interface copy**: edit the value in `i18n/messages/th.json`. Keep every
  `{argument}`, `<tag>` and plural/select branch; Thai uses only the `other`
  plural branch (plus any `=0`). `scripts/test-i18n-coverage.mjs` fails if an
  argument goes missing.
- **Content**: edit the value in `i18n/content/th.json`. The key is the exact
  English source text; never edit the key.
- Run `pnpm test:node` and `pnpm test:components`.

## Judgement calls to check first

These came up while drafting; a reviewer should decide them before the rest.

**Terminology to settle once**

- Domain short names are now Thai (Foundations → พื้นฐาน, Tooling →
  เครื่องมือ, Judgment → วิจารณญาณ, Governance → การกำกับดูแล, Strategy →
  กลยุทธ์, Collaboration → การทำงานร่วมกัน), matching the full domain names.
  A few longer content sentences still mention "Collaboration" in English.
- Readiness levels: Awareness, Developing, Applied, Proficient and Advanced
  stay English, as the existing copy does; "Limited" became จำกัด and
  "Fragile" ยังไม่มั่นคง.
- Badge and persona names (Evidence Checker, Governance Guard, Human-AI Lead,
  Value Strategist, Workflow Builder) are mixed: some translated, some kept as
  English names. Pick one rule.
- Knowing vs doing evidence: ความรู้ / การลงมือทำ.
- "Pilot" as a noun: โครงการนำร่อง in some strings, Pilot in others.
- Self-paced online courses: เรียนออนไลน์ด้วยตนเอง (made consistent).
- "Human-owned" uses the glossary's fixed reliance label คุณทำเอง, which reads
  awkwardly where it means an owner in a matching task (คนเป็นเจ้าของ).

**Meaning was unclear from the English**

- `dashboard.emailLink`, `admin.emailLink` ("Email link"): drafted as a
  button (ส่งลิงก์ทางอีเมล).
- `results.n30SecondExchange` ("30-second exchange"): drafted as "takes only
  30 seconds".
- `admin.safetyCut` ("Safety Cut"), `run.coveragePressure`,
  `results.rawReadiness`: literal renderings that may read awkwardly.
- "An AI agent asked a philosopher for work—and reportedly got paid." and two
  other English source sentences are ungrammatical; the Thai follows the most
  likely reading.
- "retention" (data retention assumed), "memory" (assistant memory feature
  assumed), "citation support", "chart forensics", "triangulation".

## Known gaps (not in this worklist)

- Figure text inside some assessment questions (labels such as "Health risk",
  "Sources") has no Thai in the question translations, so it shows in English
  in Thai mode. It belongs to the question translation workflow, not here.
- The admin console's analytics sentences, the agent simulation text and the
  sample developer report keep English content; their headings and labels
  are translated.
- AI Watch headlines, publisher names and reference titles stay in the
  source's language by design; summaries are translated.
