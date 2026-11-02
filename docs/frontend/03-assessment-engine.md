# 3. The assessment engine

How the quiz scores, adapts and records. The rules that constrain changes here are in [`../../app/CLAUDE.md`](../../app/CLAUDE.md). All of it is in `app/page.tsx`; search for the function names below (line numbers drift).


## Admin settings

The only admin screen is `/admin/pilot-operations` (`app/admin/pilot-operations/page.tsx`), and it saves to browser `localStorage`. Only part of it reaches the quiz:

| Setting group | Reaches the quiz? |
|---|---|
| Optional question diagnostics (question metadata, telemetry strip, task focus, scored evidence, psychometric panel, answer reveal) | Yes, through `new-horizon-assessment-display-v1`, same browser only. Display only; scoring is unchanged. |
| Report access by plan (free / paid toggles) | No. The admin page saves them inside `new-horizon-pilot-operations-v1`, but the quiz reads `new-horizon-report-access-v1`, so it uses its defaults. |
| Question policy (mandatory / maximum questions, adaptive continuation, answer reveal, question feedback, report survey) | No. The quiz uses `modeConfig` instead: free 12 questions, premium 20, executive 20, practice 1. |

The diagnostics toggles also change the flow: when all six are off, the feedback screen after each answer is skipped (`skipHiddenFeedback`). The default has "Task focus" on, so that screen shows by default.

The admin console inside `app/page.tsx` (behind the preview button) only shows analytics and simulated agent jobs: quality analysis, cohort, function and role averages, priority gaps, item difficulty behaviour, interaction mix and latest runs. It has no quiz settings.

`docs/ADMIN_SETTINGS_CONFIGURATION.md` describes a larger admin console that is not built.

## Scoring

1. **Raw score (0–100)** per answer: preset option score for single choice (best answers are usually 95–98); `scoreMultiSelect` (98 if exact, else correct share × 82 − 18 per wrong pick); `scoreOrder` (share of steps in the exact position × 98; a different-length order scores 0) and `scoreMatches` (share of correct pairs × 98); `scoreParts` (average of parts); `scoreTextAnswer` (sum of points for rubric criteria whose keywords appear, English or Thai, max 98). Blank is 0.
2. **Readiness evidence**: `getReadinessScore` maps the raw score through `difficultyReadinessBands`. Raw 0–55 scales to the band's middle value, raw 55–100 from the middle value to its maximum: awareness 40/68, applied 58/82, proficient 72/92, advanced 82/100. Easy items alone cannot produce a high score.
3. **Domain score (D1–D6)**: `getDomainScores` averages readiness evidence; secondary domains count at 0.35 weight. Multi-part items score each part in that part's own domain at full weight, with no secondary domains. Unsampled domains score 0.
4. **Overall score**: average of **all six** domain scores × `getAnswerQualityAdjustment` factor = clamp(0.45 + 0.45 × average raw / 100 + 0.10 × share of answers ≥ 82, 0.45, 1). Unsampled domains count as 0 in that average, so they pull the overall down. The free route targets 0 D5 questions for every audience, so a free run often has D5 = 0.
5. **Level**: `scoreToLevel`. Advanced needs ≥ 85 and one advanced item answered ≥ 82; Proficient ≥ 70 and one proficient item ≥ 82; Applied ≥ 55; Developing ≥ 40; else Limited.

Competency scores (`getCompetencyScores`) average readiness evidence per competency. A multi-part item's parts map to each part domain's default competency.

Evidence-mode scores (`getEvidenceModeSummary`) average readiness evidence for knowing, doing and hybrid items. A mode with no evidence shows 50, unlike domains, which show 0.

## Confidence

- **Overall result confidence** counts answers only, not answer quality: `confidenceBase + answers × confidenceStep`, capped. Free 38 + 4 (cap 88), premium 48 + 3 (cap 94), executive 54 + 3 (cap 96). Below 78 is "Low", 78–85 "Medium", 86 or more "Pilot confidence".
- **Per competency**: 3 or more evidence signals is high, 2 medium, 0–1 low.
- **Per domain**: 4 or more questions is "stronger estimate", 2–3 "early estimate", 1 "sampled once".
- Theta, item a/b/c, information and SEM (`getAdaptiveReadout`) are shown on the psychometric panel only. They do not feed confidence or scoring, although the on-screen copy says they do.

## Continuation (extra round)

`getContinuationRecommendation` recommends continuing when overall confidence is below 86, a sampled competency is not high confidence or scores below 70, or a profile-priority competency was never asked. Otherwise it still offers continuing as optional. It picks one route, in this order:

- **priority** (8 questions): profile-relevant competencies are weak or a profile-priority competency is unsampled
- **confidence** (6 questions): some sampled competencies are low confidence
- **domain** (6 questions): otherwise, a deep dive on the selected domain

Up to 8 target competencies are kept.

`getEvidenceCompletionReadout` offers a separate route once the base count is reached (not in practice mode). It targets planned or priority competencies with fewer than 3 signals or less than high confidence, adds 4–10 questions, and caps the total at 60.

`continueAssessment` uses the **same question bank** and the same `selectNextQuestion`. Nothing is written specially for the extra round. It only raises the target count and replaces the target competencies (and, for a domain route, sets a target domain); that focus stays for the whole extra round. The "Continue with N targeted questions" button has no total cap.

## Adaptive difficulty and question selection

`getDifficultyFromLastAnswer` sets the target difficulty from the **last answer only**: ≥ 92 on a proficient item → advanced; ≥ 82 → proficient (advanced stays advanced); 55–81 → same level; < 55 → awareness. The first item's difficulty comes from the profile survey (`getProfileStartingDifficulty`).

`selectNextQuestion`:

- **Filters**: removes answered items; allows only one `reliance-decision` item per session.
- **First question**: a random item from the newest release (IDs ending `@2026-10-07.1`) if any, else a fixed starter list per mode or function track, matched to the starting difficulty.
- **Same-domain shortcut**: stays in the last domain when fewer than 2 questions in a row came from it, coverage is not at risk (unsampled domains < questions left), and the difficulty furthest behind its quota equals the target difficulty.
- **Ranking** (free and premium; executive weights in brackets):

| Input | Points |
|---|---|
| Seeded random tie-breaker | 0 to +1 |
| In target domain (always set in executive mode) | +44 [+56] |
| Measures a target competency | +52 |
| Domain below its profile target | +14 [+10] per missing question |
| In weakest domain (free/premium only) | +42 |
| Premium: matches function track / industry track | +26 / +16 |
| Distance from target difficulty | +30 − 10 × levels [+34 − 12 × levels] |
| Format (multi, rank, match, text) below its minimum | +24 |
| Has a visual while fewer than 4 [5] visuals asked | +22 [+18] |
| Is a `reliance-decision` item | −28 |
| Flagged for review | −72 |
| Last answer < 55 and item is awareness | +30 [+34] |
| Last answer ≥ 82 and item is proficient | +30 [+34] |
| Difficulty furthest behind its 20/30/30/20% quota | +46 |

Where the ranking inputs come from:

- **Target competencies**: in the main quiz, `getProfileTargetCompetencyIds` derives them from the function track, executive role and profile tags; a continuation replaces them with its route's targets.
- **Target domain**: set only by a domain-route continuation or, in executive mode, by `selectExecutiveDomain` (D5, D4, D6, D3 first, then the biggest gap against `executiveDomainTargets`).
- **Profile domain targets** (`getProfileDomainTargets`): free uses `freeAudienceDomainTargets` for the audience; premium blends function 55%, industry 25% and professional 20%, scaled to the total question count; executive uses `executiveDomainTargets`.
- **Weakest domain**: the biggest gap between profile target and questions asked, then the lowest score.
- **Format minimums**: free and premium need multi 2, rank 1, match 1, text 1; executive needs multi 3, rank 2, match 2.
- **Difficulty quota**: `getDifficultyCoverageNeed` picks the level furthest behind its share of the total; ties go to the harder level.
- **Seed**: a random number per session (`createAssessmentSeed`), reused for the extra round, so the same answers in one session lead to the same picks.

"Flagged" comes from the local behaviour log (`getQuestionQualityRows`): 2 or more negative feedback signals, ≥ 50% confusion, artifact risk, or a difficulty mismatch.

The pick is random (by seed) among up to 5 items within 8 points of the best (`chooseFromAdaptiveTier`). The quota bonus (+46) outweighs the difficulty bonuses (+30), so the next item does not always follow the last answer.

**End of questions**: when answers reach the target count, `submitAnswer` ends the session and shows feedback, then results. If the bank itself runs out, `selectNextQuestion` returns an already-answered item picked by seed, so the user sees and is scored on a repeat. It does not show an "out of questions" message.

## What is recorded

All data is saved in browser `localStorage`. When the user is signed in, it is also copied to Supabase (`user_profiles`, `assessment_sessions`, `assessment_behavior_events`, `assessment_feedback`).

- **Behaviour events** (`AssessmentBehaviorEvent`, key `new-horizon-behavior-log-v1`). Every event has an ID, created time, profile ID, session ID, type, mode, audience, function track, industry track and executive role. Other fields depend on the event type:

| Event | Extra fields |
|---|---|
| `assessment_started` | answer count (0), target count, `label` with the starting difficulty |
| `question_shown` | question ID, domain, competencies, difficulty, format, answer count, target count |
| `question_answered` | the `question_shown` fields plus duration, interaction count, revision count, hesitation, readiness score, selected option ID, selected answer (the full text of a written answer), correct option IDs |
| `question_feedback` | question ID, feedback kind (like / unclear / clear / comment), comment text |
| `artifact_opened` / `artifact_zoomed` / `artifact_external_opened` | question ID, artifact source path, action (reader / zoom / external), zoom level |
| `assessment_abandoned` | answer count, target count |
| `mandatory_completed` | answer count, required count, target count |
| `continuation_accepted` / `continuation_declined` | route kind, `label`, answer count, required count, target count |
| `results_viewed` | answer count, target count, overall score |
| `report_interest` | report area (radar, domain, competency, course, tool, coverage, continuation), `label`, domain. The profile pulse is logged here too, with the chosen options in `label`. |
| `assessment_feedback_submitted` | answer count, overall score |

  Hesitation is `confusing` (≥ 5 revisions, or ≥ 45 s with readiness < 58), `slow` (≥ 45 s or ≥ 5 interactions), `fast-clear` (≤ 12 s with readiness ≥ 72), else `clear`.
- **Score log** (`ScoreLogEntry`, `new-horizon-score-log-v1`), one per completed run: ID, created time, scoring model version, question bank version, user ID and email (when signed in), comparison group key and label, mode, audience, function, industry, executive role, domain scores, competency scores (score and evidence count), evidence-mode scores, overall.
- **Profile signal log** (`ProfileSignalLogEntry`, `new-horizon-profile-signal-log-v1`), one per completed run: the score log's identity, group and score fields plus profile ID, survey context, profile tags, raw survey answers, and one `QuestionSignalSnapshot` per answer:
  - question ID, question version, rubric version, artifact version
  - domain, secondary domains, competencies, skills, difficulty, type, format, evidence mode
  - score, option ID and label, correct option IDs, rubric hit IDs, part scores
  - written-answer length (not the text)
  - duration, interaction count, revision count, hesitation
- **End-of-quiz survey** (`AssessmentFeedbackSurvey`, `new-horizon-assessment-feedback-v1`): ID, session ID, profile ID, created time, group key, clarity, difficulty fit, artifact quality, length fit, suggestions.
- **User profile survey** (`UserProfileSurvey`, `new-horizon-user-profile-v1`): updated time, context, answers per question (the profile pulse answers are merged in), tags (max 18).
- **Sign-in profile** (`AuthProfile`, `new-horizon-auth-profile-v1`): Supabase user ID, email, name, avatar URL, provider, provider ID, and the **access token** in plain `localStorage`.
- **Simulated agent runs** (`SupervisedAgentRun`, `new-horizon-supervised-agent-runs-v1`): status, headline, summary, activity log, drafts, safety events.
- **Small flags and settings**: local profile ID, language, Thai-draft opt-in, whether the pulse was dismissed, display settings, report-access settings.

Supabase receives the user profile (survey answers and tags, provider ID, local profile ID), each completed session (score log fields plus profile tags and question signals, with the user's email), every behaviour event in full as `payload`, and each end-of-quiz survey.

Time and hesitation do not change scores or difficulty yet. `/api/results` stores question-inventory reviewer feedback, not quiz telemetry.
