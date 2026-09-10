# Telemetry Tracking and Purpose

New Horizon uses telemetry to understand assessment behavior, improve question quality, personalize routes, and explain score confidence. The product should stay transparent: telemetry supports personalization and quality review, but it should not silently change scored content.

## Current Storage

The MVP stores telemetry locally in browser storage and syncs to Supabase only when authentication and tables are configured.

Current local stores:

- `new-horizon-behavior-log-v1`
- `new-horizon-profile-signal-log-v1`
- `new-horizon-score-log-v1`
- `new-horizon-assessment-feedback-v1`
- `new-horizon-user-profile-v1`
- `new-horizon-supervised-agent-runs-v1`

## What Is Tracked

### Assessment Session Events

Session telemetry records:

- assessment started
- question shown
- question answered
- assessment abandoned
- mandatory route completed
- continuation accepted
- continuation declined
- results viewed
- report-interest clicks
- assessment feedback submitted
- artifact reader opened
- artifact zoom changed
- raw artifact file opened

Purpose:

- detect abandonment points
- see whether users continue after required milestones
- understand report engagement
- identify confusing questions and inaccessible artifacts
- support cohort-level funnel analysis

### Per-Question Answer Evidence

Each answered question stores:

- question id
- primary and secondary domains
- competency ids
- skill ids
- difficulty
- item type and interaction format
- evidence mode: knowing, doing, or hybrid
- selected answer and answer label
- correct answer ids or rubric hits
- partial part scores for multi-part items
- text response length
- elapsed time
- interaction count
- revision count
- hesitation classification

Purpose:

- explain each score
- compare correctness against difficulty
- distinguish easy correctness from advanced readiness evidence
- identify weak distractors or confusing wording
- calibrate partial credit over time
- recommend targeted continuation questions

Scoring rules to audit during testing:

- Correct answers are not automatically `100`; many top options are seeded as `95` or `98`.
- Blank written responses receive `0` raw score and `0` readiness evidence.
- Multi-select submissions with no choices receive `0`.
- Matching submissions with no selected pairs receive `0`.
- Unanswered mini-parts receive `0` for each missing part.
- Partial credit begins only when the user submits actual scored evidence.
- The answer review shows a score explanation panel with raw score, readiness evidence, and the difficulty-band cap.

Score derivation shown in the product:

1. Question raw score comes from selected option score, multi-select scoring, matching accuracy, ranking accuracy, written rubric hits, or mini-part averages.
2. Raw score is converted into difficulty-adjusted readiness evidence with the seeded difficulty band.
3. Competency score is the average readiness evidence from all mapped signals.
4. Domain score is readiness points divided by evidence count. Secondary domains count at `0.35` weight.
5. Overall score is the average of D1-D6 domain scores.
6. Readiness label is evidence-gated: Advanced requires strong advanced-item evidence; Proficient requires strong proficient-item evidence.

Response time, hesitation, artifact use, item `a/b/c`, information, and SEM are tracked for calibration and quality review. They do not directly change the score in the current MVP.

### Artifact Interaction Telemetry

Artifact events store:

- question id
- domain
- competency ids
- difficulty
- artifact path
- action type: reader, zoom, or external open
- zoom level, where Fit mode is stored as `0`

Purpose:

- identify artifacts users cannot read inline
- find artifacts that require frequent 2x zoom
- detect unrealistic or irrelevant stimuli
- connect long answer time or wrong answers to artifact quality
- prioritize replacement briefs for generated or externally produced assets

### Score and Leaderboard Logs

Score logs store:

- overall readiness score
- D1-D6 domain scores
- competency scores and evidence counts
- evidence-mode scores
- persona or peer-group key
- assessment mode
- audience, function, industry, and executive role
- user id or email when signed in

Purpose:

- support persona-scoped top-10 boards
- compare users to relevant peers
- show day/week leaderboard teasers
- track score differentiation between beginner, intermediate, and advanced users
- prepare future aggregate benchmark analysis

### Feedback Survey

The end-of-assessment survey stores:

- clarity rating
- difficulty-fit rating
- artifact-quality rating
- assessment-length rating
- optional suggestions

Purpose:

- exchange detailed question-level analysis for useful product feedback
- identify confusing questions
- identify unrealistic artifacts
- improve survey timing and wording
- provide evidence for supervised agent proposals
- feed the Feedback Analysis Agent, which summarizes themes and recommendations before humans approve platform edits

Confidence note: the report-level pilot confidence is currently a separate evidence-stability heuristic, calculated from the assessment-mode base plus answered-item increments and capped by mode (`38 + 4/item`, cap `88` free; `48 + 3/item`, cap `94` premium; `54 + 3/item`, cap `96` executive). It is not the user's score and is not derived from the large follow-up-question number shown in the continuation card. Competency confidence uses repeated evidence for each mapped competency.

### Profile Signals

Profile telemetry includes:

- explicit profile survey answers
- optional landing-page profile pulse selections
- role, function, industry, and audience selections
- tools, workflows, AI interests, risk concerns, and learning goals
- behavior-derived signals from routes, answers, report clicks, continuation choices, and artifact-reader use

Purpose:

- personalize question routing
- prioritize relevant competencies
- choose better "Did you know?" prompts
- tune AI Watch, labs, courses, and tool recommendations
- group leaderboards by persona

## In-Assessment Help Bubbles

The assessment UI now shows small help bubbles beside live measurement labels. These describe what is being measured and why.

Current help topics:

- progress and completion
- domain
- difficulty
- item type
- interaction format
- time on question
- answer interactions
- artifact use
- scored evidence mode
- current item difficulty
- ability estimate theta
- target level
- seeded item difficulty `b`
- seeded discrimination `a`
- guessing estimate `c`
- item information
- standard error of measurement
- routing reason
- coverage confidence

## Privacy and Product Rules

- Tell users why telemetry and profile signals are collected.
- Use telemetry to improve assessment quality and personalization.
- Avoid hidden sensitive inference.
- Separate identity data from assessment evidence where possible.
- Use aggregate, privacy-safe display names for leaderboards.
- Keep question-level analysis explainable.
- Preserve score meaning when items, rubrics, or scoring models change.
