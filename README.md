# SC Horizon / New Horizon

Adaptive AI readiness assessment MVP for practical AI literacy, role/function diagnostics, executive assessment, learning paths, and AI trend awareness.

## What It Includes

- Public landing page for the New Horizon assessment platform
- Free, premium, executive, and function-aware assessment flows
- Adaptive question routing with visible difficulty and psychometric/IRT-style indicators
- Multimodal and artifact-based question bank with realistic screenshots, invoices, dashboards, logs, source excerpts, workflows, and fraud/media-review tasks
- Full-size artifact reader with zoom controls for text-heavy screenshots, workflows, dashboards, and documents
- Market-trend question bank covering agents, multimodal/video AI, RAG/context engineering, domain models, responsible AI benchmarking, governance, and workforce change
- Domain and competency scoring across D1-D6
- Radar graph with user, group average, and target profile comparison
- Domain drilldown into competency scores
- Continue-assessment option after mandatory 12/20-question routes when confidence or coverage is weak
- User profile builder and signal logging
- Optional landing-page profile pulse that asks for current AI interests and routes later questions accordingly
- Per-question behavior telemetry for timing, revisions, hesitation, selected versus expected answers, abandonment, mandatory completion, optional continuation, and report engagement
- End-of-assessment feedback exchange that unlocks question-level response and local benchmark analysis
- Top-10 score leaderboard scoped to the user's assessment persona/group
- Landing-page daily/weekly top-10 teaser and peer-insight cards to motivate users to see where they rank
- Registered user dashboard with profile, progress, recommendations, learning paths, and personalized AI Watch
- Admin dashboard preview for cohort, function, role, domain, competency, difficulty, item-format, and trend analysis
- Supervised quality-improvement queue driven by telemetry and survey feedback, plus realistic artifact replacement briefs
- Admin Agent Ops with persisted supervised runs, telemetry-driven draft proposals, approval/rejection states, activity reports, and safety-cut handling for repeated loops
- Personalized "Did you know?" prompts that use profile signals and weak domains to teach timely AI concepts and invite deeper learning
- Learn by Doing labs for prompt repair, proof check, media check, workflow lab, trust room, task ownership, and next action
- Supabase schema draft for user profiles and assessment sessions

## Latest Change Report

Detailed telemetry and agent documentation: [`docs/TELEMETRY_AND_AGENT_ORCHESTRATION.md`](docs/TELEMETRY_AND_AGENT_ORCHESTRATION.md).

Latest artifact update: the assessment now includes a full-size artifact reader with 1x, 1.5x, and 2x zoom, plus an open-file action for users who need to inspect small text or dense workflow details. Flood and disaster-misinformation questions use multiple realistic artifact types instead of repeating one generic image. The bank includes a station social post, a forwarded chat screenshot, and a claim-review dashboard with source, weather, traffic-camera, and alert evidence. Mismatched placeholder artifacts were also corrected so CEO/celebrity endorsement questions no longer reuse flood imagery.

Latest realistic artifact expansion: scheduling-email, support-ticket, and refund-agent workflow questions now use generated realistic PNG screenshots with larger readable text and work-like UI evidence. These replace several older schematic SVG references where the question depends on reading email, payment, SLA, approval, audit, or workflow details. The artifact reader logs full-size opens, zoom changes, and external file opens so dense artifacts can be improved from actual user behavior.

Latest evidence-completion update: after the standard 12-question or 20-question milestone, users can continue in targeted batches until planned and profile-priority competencies have high-confidence evidence or the safety cap is reached. This makes the full assessment more adaptive than a fixed-length quiz while still keeping a clear stopping rule.

Latest telemetry/agent-review update: reports now show what telemetry is collected, why it matters, and what should improve next. Admin Agent Ops now emphasizes survey and trend analysis before edits; agents produce evidence-backed suggestions, and a human reviewer remains responsible for approving changes to scored questions, artifacts, profile fields, surveys, or learning recommendations.

Latest synced update: `175e1b3 Improve assessment continuation recommendation`.

The assessment now makes the optional continuation route much more visible. At the end of the last mandatory question, users see a large recommendation block before they move to the report. The same recommendation also appears near the top of the test report, immediately after score interpretation, so users understand that the first result is a snapshot and can choose whether to collect stronger evidence.

The recommendation explains why the user should continue. It considers pilot confidence, low-confidence sampled competencies, unsampled profile-priority competencies, planned coverage gaps, and profile signals. For content creators or marketing/media users, the follow-up route emphasizes deeper evidence around image/video AI, media provenance, prompt refinement, claim verification, IP/ethics, and campaign measurement. Technical, finance, and people/HR profiles receive their own targeted competency routes.

Users now get a primary action to continue with the recommended targeted route, plus secondary options to view the report snapshot or choose a selected-domain deep dive. This is intended to improve score differentiation between casual/beginner users and advanced users whose abilities need harder, more profile-relevant evidence.

Latest landing-page update: the home page now includes a daily/weekly peer challenge board with top-10 scores, visible peer groups, strongest domains, score-to-chase, hot-skill trends, and a call to take the test. The MVP uses local saved runs when available and fills with demo pilot rows until enough local data exists. Production should replace this with consented, privacy-safe server-side leaderboard views scoped by persona, organization, geography, or cohort.

Latest Agent Ops update: admins can now run supervised local agent jobs from the Admin page. A run reads telemetry, assessment feedback, profile snapshots, item counts, and artifact counts, then creates reviewable draft proposals for question rewrites, artifact replacements, profile ontology updates, survey tuning, learning recommendations, and AI Watch briefs. Drafts can be approved or rejected locally; nothing is published into the scored assessment automatically.

Latest personalization update: the landing page, user dashboard, and report include a profile-aware "Did you know?" prompt. The prompt is selected from user profile tags, weak domains, function/role context, and assessment signals. Clicks are logged as interest signals so later versions can learn which topics motivate users to explore deeper routes, labs, or AI Watch.

## Tech Stack

- Vinext / Next-style React app
- React 19
- TypeScript
- CSS modules through `app/globals.css`
- Supabase Auth/Postgres planned for persistence
- Vercel-compatible deployment path

## Local Development

```bash
pnpm install
pnpm dev
```

Production-style local run:

```bash
pnpm build
pnpm start
```

Open:

```text
http://localhost:3000/
```

## Google and Email Auth

The MVP includes a browser-side Supabase auth bridge for Google OAuth and email magic links. Add these environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

In Supabase:

- Enable Google provider under Authentication providers
- Add Google OAuth client id/secret
- Add local and deployed URLs to Supabase redirect allow-list
- Run `supabase-schema.sql` in the Supabase SQL editor

Google login seeds basic identity only: Supabase user id, email, display name, avatar URL, provider, and provider id. New Horizon still collects role, function, tools, AI usage, learning interests, and assessment behavior through its own profile builder.

## Vercel Deployment

Recommended Vercel environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The MVP report flow now includes a generated detailed report panel, but it is still produced locally from assessment scores, competency evidence, learning catalogs, and profile signals. It does not require an API key and does not call an external AI provider from browser code.

The MVP Agent Ops flow is local and deterministic. It includes persisted supervised runs in browser storage, plus a legacy simulation view. The active supervised run reads local telemetry, feedback, profile snapshots, and artifact counts, then produces draft proposals owned by the orchestrator, AI concepts scout, AI newsfeed agent, training and course scout, assessment item generator, and reviewer/QA agent. Each proposal stays in pending review until an admin approves or rejects it. It does not publish content, rewrite scored items, or call an external AI provider from browser code.

Production AI-generated reports should run in server-side routes only. At that stage, prompt each app user or tenant to connect or enter their chosen AI provider key, and store secrets only in approved server-side infrastructure. Do not expose LLM API keys in browser code.

## Supabase Tables

See:

- `supabase-schema.sql`
- `docs/TELEMETRY_AND_AGENT_ORCHESTRATION.md`

Draft tables:

- `user_profiles`
- `assessment_sessions`

Production should add:

- item responses
- behavior events and per-question elapsed time
- assessment feedback surveys
- supervised agent runs and draft proposal review states
- privacy-safe persona leaderboard views
- theta estimates
- profile signals
- learning path events
- admin role claims
- tenant/organization tables
- anonymized analytics views

## Scripts

```bash
pnpm lint
pnpm build
pnpm start
pnpm crawl:training
```

`pnpm crawl:training` runs the local Playwright Training and Course Scout against an allow-list of public AI learning sources and writes JSON/Markdown review reports to `.agent-drafts/`. It is intended for admin review testing only; nothing is published automatically.

## Current MVP Limitations

- Psychometric/IRT scoring is seeded and demonstrative, not yet calibrated from a large pilot sample
- Admin auth is a preview surface until Supabase role claims and RLS policies are finalized
- Local browser storage is still used as the primary MVP demo store when Supabase is not configured
- AI Watch is a curated/static MVP feed until the scheduled trend-refresh agent is backed by persistent content storage
- MVP generated reports are local score/profile summaries; production AI-generated reports should move to server routes and ask users or tenants for their provider API key
- MVP Agent Ops persists supervised local runs, but production agents still need durable cloud jobs, source connectors, server-side AI provider adapters, retry limits, audit logs, proposal diffing, content versioning, source freshness checks, robots/terms review, and human approval gates
- Telemetry, feedback, benchmarks, and leaderboards are device-local until production event tables and aggregate Supabase views are deployed
- The quality engine prioritizes revision candidates automatically but does not silently publish machine-rewritten scored items; calibration and item changes require review

## Scoring Model

The assessment separates answer quality from readiness evidence.

- Answer feedback shows the raw rubric or option score for the item.
- Domain, competency, overall, analytics, and saved signal scores use difficulty-adjusted readiness evidence.
- Easier items are capped below advanced readiness even when answered perfectly.
- Harder items can award stronger readiness evidence, including meaningful credit for partially correct proficient or advanced work.
- The final readiness label is evidence-gated: Advanced requires strong advanced-item evidence, and Proficient requires strong proficient-item evidence.

Current seeded readiness bands:

| Difficulty | Partial evidence anchor | Maximum readiness evidence |
| --- | ---: | ---: |
| Awareness | 40 | 68 |
| Applied | 58 | 82 |
| Proficient | 72 | 92 |
| Advanced | 82 | 100 |

This is still an MVP calibration model. Production scoring should tune item difficulty, discrimination, guessing, and partial-credit thresholds from pilot response data.

The live bank now includes 240 generated advanced competency items: 10 advanced items for each of the 24 granular competencies. These items are explicitly mapped to one competency each and are available to the regular/premium bank and as advanced extension items for the executive route.

The live bank also includes generated market-trend items across every granular competency and all four difficulty levels. These items test practical understanding of current AI-market shifts: agentic AI, multimodal image/video workflows, context engineering and RAG quality, domain-specific models, benchmark caveats, responsible AI governance, sovereign/local data constraints, and workforce skill change.

## Profile Ontology

The profile model combines explicit profile survey answers, optional micro-survey pulses, selected assessment routes, answer behavior, report clicks, and competency outcomes. In the MVP, these signals are stored locally and used to route questions and recommendations. Production should keep this transparent to users, separate sensitive personal data from assessment evidence, and use consented server-side profile graphs with retention controls.

The new landing profile pulse asks a single low-friction question about AI trend interests such as agents, image/video AI, RAG/context, governance, or new models. Selected interests become profile tags and competency targets, so the adaptive engine can prioritize more relevant questions without forcing a long onboarding survey.

## Continuation Recommendation

At the end of the mandatory route, the platform now shows a conspicuous continuation recommendation in both the final answer review and the test report. The recommendation is based on pilot confidence, sampled low-confidence competencies, unsampled profile-priority competencies, planned coverage gaps, and the user's profile signals.

For example, content creators, marketers, or users whose profile mentions image, video, media, campaigns, creative variants, Canva, Adobe, Firefly, Midjourney, or synthetic media are routed toward deeper evidence for prompt refinement, media provenance, claim verification, IP/ethics, and campaign measurement. Technical, finance, and people/HR profiles receive similarly tuned follow-up targets. The primary action launches the recommended targeted route; users can still view the report snapshot or choose a domain deep dive.

## Assessment Quality Loop

Each assessment session records question exposure, selected and expected answer identifiers, readiness score, domain, competencies, difficulty, interaction format, elapsed time, interaction count, revision count, and a derived hesitation signal. Session events also distinguish abandonment, completion of the mandatory route, acceptance or decline of optional questions, result views, and report-area engagement.

After seeing the basic score, a short clarity, difficulty, artifact, and length survey unlocks the user's question-by-question evidence report. The report shows the response, expected evidence, time spent, behavioral signal, measured competencies, and local comparison data where enough attempts exist.

The admin quality engine aggregates these signals into a supervised improvement queue. High confusion, long response time, weak discrimination, abandonment, poor artifact ratings, and route-level difficulty feedback can nominate questions, formats, profile fields, surveys, or artifacts for revision. This is a continuous-improvement system, not a claim of general intelligence: scored content remains versioned and reviewable so historical scores do not change silently.

Legacy `reliance-decision` items now render as complete control-pattern scenarios instead of the simplified Human / AI / Both card format. The admin artifact backlog lists a realistic replacement brief and stable asset path for each unique document image so generated replacements remain relevant to their questions.
