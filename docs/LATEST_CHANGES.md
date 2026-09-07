# Latest Changes

## 2026-09-08: Flood and Media Artifact Upgrade

The flood/disaster misinformation items no longer rely on one repeated image. The assessment now uses three distinct artifact contexts:

- A realistic social post showing flooding near a transit station.
- A forwarded chat screenshot with vague same-day flood claims.
- A claim-review dashboard comparing a viral post against weather, traffic-camera, alert, and source-history evidence.

Several mismatched placeholder references were corrected as well. CEO or celebrity endorsement questions now use endorsement/listing artifacts instead of unrelated flood imagery.

This improves artifact variety, realism, and relevance while preserving the intended skill: users must check provenance, date, location, source chain, and official evidence before sharing or acting.

## 2026-09-08: Supervised Agent Jobs and Personalized Knowledge Prompts

The Admin Agent Ops area now has a persisted supervised job loop instead of only a static simulation. Admins can run local agent jobs that read telemetry, assessment feedback, profile snapshots, item counts, and artifact counts, then create draft proposals for:

- Question rewrites or new competency-depth items.
- Realistic artifact replacement briefs.
- Profile ontology updates.
- Survey timing and wording improvements.
- Learning recommendation refreshes.
- AI Watch brief candidates.

Each draft has a pending, approved, or rejected state. Admin decisions are stored locally with the run history. No scored assessment content is published automatically; approved proposals are still review decisions, not silent mutations of the live bank.

The landing page, user dashboard, and report now include a personalized "Did you know?" prompt. The selected prompt uses profile tags, function/role context, weak domains, and assessment progress to teach a timely AI concept and invite the user into a deeper route, practice lab, profile update, or AI Watch.

This keeps the continuous-improvement loop visible: telemetry and feedback can nominate improvements, but scoring content remains supervised, versionable, and reviewable.

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

## 2026-09-07: Market-Trend Question Expansion

The question bank now includes generated market-trend items for every granular competency and all four difficulty levels. These questions are practical scenarios based on current AI-market shifts:

- Agentic AI and tool-taking workflows.
- Multimodal image/video/content generation.
- RAG, context engineering, and source quality.
- Domain-specific models and benchmark caveats.
- Responsible AI governance and incident handling.
- Data residency, local language, and vendor-dependence concerns.
- Workforce skill shifts and operating-model change.

The trend items are mapped to granular competencies, skills, difficulty, and evidence mode so adaptive routing can use them like the rest of the scored bank.

## 2026-09-07: Transparent Profile Pulse

The landing page now includes a small optional profile pulse that asks users which AI trend their assessment should pay closer attention to. Choices become local profile tags and competency targets for later adaptive routing.

The product should keep this visible and consent-aware: implicit behavior signals can improve tailoring, but the platform should disclose how routing and recommendations use profile evidence.

## Verification

- `pnpm lint` passed.
- `pnpm build` passed.
- GitHub push was verified after credential setup and reported `Everything up-to-date`.
