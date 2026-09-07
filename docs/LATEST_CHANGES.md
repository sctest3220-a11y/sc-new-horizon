# Latest Changes

## 2026-09-07: Assessment Continuation Recommendation

Commit: `175e1b3 Improve assessment continuation recommendation`

The platform now makes the prompt to continue the test more conspicuous in two places:

- At the end of the final mandatory question, before the user enters the report.
- Near the top of the test report, immediately after score interpretation.

The recommendation tells the user whether continuing is recommended or optional. It explains the reason using assessment evidence:

- Pilot confidence is still low or medium.
- Some sampled competencies remain low-confidence.
- Some profile-priority competencies were not sampled.
- Planned baseline coverage still has gaps.
- The user's profile indicates a deeper route is needed.

The continuation route is profile-aware. For example, users who look like content creators, marketers, or media-heavy users are routed toward deeper evidence for:

- Image and video AI use.
- Media provenance.
- Claim verification.
- Prompt refinement.
- IP, fairness, and ethics.
- Campaign measurement.

Technical, finance, and people/HR profiles receive similar targeted routes based on their competency priorities.

The report now gives users a clearer choice:

- Continue with the recommended targeted route.
- View the report snapshot immediately.
- Choose a selected-domain deep dive.

This change is designed to improve score differentiation between beginner, intermediate, and advanced users by collecting harder and more role-relevant evidence before treating the profile as stable.

## 2026-09-07: Landing Peer Leaderboard

The landing page now includes a daily/weekly top-10 peer challenge board. It is designed to make visitors curious about where they would rank before they start the assessment.

The board shows:

- Top 10 scores for today or this week.
- Persona or peer-group labels.
- Each visible run's strongest domain.
- A score-to-chase insight.
- Hot-skill and active-peer-group trend cards.
- A call to take the free test or choose a peer group in the premium flow.

The MVP reads local saved score logs when available and uses demo pilot rows when there are not enough local runs yet. In production, this should move to consented, privacy-safe server-side leaderboard views with day/week aggregation by persona, group, organization, country, and cohort.

## Verification

- `pnpm lint` passed.
- `pnpm build` passed.
- GitHub push was verified after credential setup and reported `Everything up-to-date`.
