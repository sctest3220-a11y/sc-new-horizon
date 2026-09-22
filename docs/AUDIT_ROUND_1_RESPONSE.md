# Question Bank Audit — Round 1 Response (2026-09-10)

Source: `exports/New_Horizon_Question_Bank_Audit_Completed.xlsx`. This file records what was done with each reviewer verdict so the next audit round can check the changes.

## Summary of verdicts

| Sheet | Rows | Keep | Revise / Improve | Notes |
|---|---|---|---|---|
| Questions | 660 | 619 | 41 | Answer key confirmed on all 660; difficulty "Too hard" on 30 (all length-related) |
| Answer Choices | 2,552 | 2,440 | 112 | 101 = drag-order items lacking feedback; 11 = legacy reliance "Together" keys |
| Artifacts | 41 | 35 | 6 | All six are already hidden by the low-value gate |

Thai priority as marked by reviewers: High 163, Medium 89, Low 408. No question content has Thai yet (see localisation plan).

## Questions marked Revise

| Question ID(s) | Reviewer comment | Change applied |
|---|---|---|
| REL-G-D2-001 | Predictable "Together" bias | Scenario adds synced calendar, no commitment; key → **AI** (95). Together 70, Me 45. Visual caption made neutral. |
| REL-G-D3-002 | Predictable "Together" bias | Image appeared in the last hour, company account would share it; key → **Me** (95). Together 65, AI 10. |
| REL-G-D1-004 | Predictable "Together" bias | Term named (RAG), no decision depends on it; key → **AI** (95). Together 68, Me 45. |
| REL-G-D5-005 | Predictable "Together" bias | Director holds you accountable; key stays Together (98) but Me raised to 75 as a defensible alternative. |
| REL-G-D6-006 | Predictable "Together" bias | Face-to-face tomorrow, coworker confided a personal difficulty; key → **Me** (95). Together 60, AI 5. |
| REL-E-D5-001 | Predictable "Together" bias | CEO defends ranking to the board; key stays Together, Me raised to 70. |
| REL-E-D4-002 | Predictable "Together" bias | Root cause unknown, the AI workflow is the compromised system, 72-hour clock; key → **Me** (95, "with AI tooling paused"). Together 65, AI 0. |
| REL-E-D6-003 | Predictable "Together" bias | Union asks the message come personally from the executive; key → **Me** (95). Together 60, AI 0. |
| REL-E-D3-004 | Predictable "Together" bias | Regulated disclosure signed by CFO, no back-test, call tomorrow; key → **Me** (95). Together 70, AI 0. |
| REL-E-D1-005 | Predictable "Together" bias | Board will probe live; key stays Together, Me raised to 72. |
| REL-E-D2-006 | Predictable "Together" bias | Approver owns consequences; key stays Together, Me raised to 76. |
| REL-H-D6-005, REL-H-D2-007, -010, -014, -021, -023 | Scenario too long for Awareness | Context shortened to 1–2 sentences (109–140 characters). Horizon source wording no longer verbatim for these six. |
| TREND-*-AWARENESS-01 (24 items) | Scenario too long for Awareness | Template change in `buildMarketTrendQuestion`: awareness items use the trend scenario only; the competency-framing sentence is dropped. Grammar fixed for all bands. |

## Answer choices marked Revise

- 101 rows, all drag-order items (23 questions): "enrich feedback text". Added `rankRationale` to each question; `submitRankOrder` feedback now includes correct-position count, the best order, and the rationale.
- 11 rows, legacy reliance "Together" options: addressed by the key rebalancing above.

## Artifacts marked Improve

`/stimuli/ai-concept-workbench.svg`, `/stimuli/ai-pilot-workflow.svg`, `/stimuli/executive-market-report.svg`, `/stimuli/raw-agent-workflow-plan.svg`, `/stimuli/raw-technical-access-log.svg`, `/stimuli/realistic-support-ticket-ai-draft.png` — reviewers rated match "Partly", realism 3, readability 3, and asked for visual refinement before ungating. No code change; they remain in `hiddenArtifactQuestionIds`. Backlog: redesign each with the specific evidence its questions require, then remove the gate.

## Not changed, for the record

- 30 "Too hard" ratings were all on the length-flagged items above; difficulty bands were kept.
- No question was removed or replaced.
- Reviewer notes on Keep items were templated ("Rigorous competency item…") and contain no actionable detail; the next round should ask reviewers for at least one specific observation per flagged item.

## Next round

1. Re-run `node scripts/dump-question-bank.mjs` and regenerate the audit workbook so reviewers see the revised text.
2. Localisation: 163 items marked Thai priority High are the first translation batch once bilingual fields exist on `Question`.
3. Pilot the revised legacy reliance items and compare selected-vs-expected telemetry with the Horizon items.
