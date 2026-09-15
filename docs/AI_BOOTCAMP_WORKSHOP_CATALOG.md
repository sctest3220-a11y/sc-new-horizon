# AI Bootcamp And Workshop Catalog

New Horizon uses assessment results to recommend training that fits the user's level, role, weak domains, confidence, and profile signals. Bootcamps are recommended when a user needs guided practice, team alignment, role-specific workflow design, or executive decision support.

Keep this document aligned with the report learning path, score bands, domain framework crosswalk, and course recommendations.

## Core Offerings

| Program | Duration | Level | Best for | Primary domains |
| --- | --- | --- | --- | --- |
| AI Fundamentals 1-Day Bootcamp | 1 day or 2 half-days | Fundamental | General users, students, educators, staff new to AI | D1, D2, D3, D4 |
| Practical AI for Work 2-Day Bootcamp | 2 days | Intermediate | Professionals and teams already using AI casually | D2, D3, D4, D5, D6 |
| Advanced AI Operator 3-Day Bootcamp | 3 days | Advanced | Power users, analysts, creators, product, ops, technical leads | D1-D6 |
| Executive AI Strategy 1-Day Bootcamp | 1 day | Executive | CEO, board, CxO, transformation sponsors | D1, D3, D4, D5, D6 |
| AI Governance and Risk 2-Day Bootcamp | 2 days | Governance | Risk, legal, compliance, audit, data, security, public sector | D3, D4, D5, D6 |
| AI Agent and Workflow Lab | 2-3 days | Advanced | Technical, product, automation, and operations teams | D1-D6 |
| Role-Based AI Bootcamp Series | 1-3 days | Role-based | Marketing, sales, service, HR, finance, ops, education, technical users | D2-D6 |
| AI Train-the-Trainer Workshop | 2 days | Role-based | HR, L&D, educators, trainers, transformation teams | D1, D2, D3, D4, D6 |

## Recommendation Logic

The MVP recommends bootcamps from:

- Weakest D1-D6 domains.
- Overall score band.
- Assessment mode: free, premium, executive, or practice.
- Function track such as marketing, sales, customer service, finance, HR, operations, or technical.
- Executive role such as CEO, board, CFO, CHRO, CIO/CDO/CTO, or transformation sponsor.
- Weak competency IDs from the current assessment.
- Profile tags from optional profile surveys and landing-page profile pulse.

Typical routing:

- Scores below 60 prioritize AI Fundamentals.
- Scores from 55-79 prioritize Practical AI for Work.
- Scores from 75 and above prioritize Advanced AI Operator or AI Agent and Workflow Lab.
- Executive mode prioritizes Executive AI Strategy.
- D4 governance gaps prioritize AI Governance and Risk.
- Strong role/profile signals prioritize Role-Based AI Bootcamp Series.

## User-Facing Detail

Each bootcamp recommendation should show:

- Duration and level.
- Mapped D1-D6 domains.
- For who.
- Why take it.
- Expected learning outputs.
- Workshop labs.
- Framework alignment.
- Best-fit roles.

This keeps the report concise while allowing interested users to click for more detail.

## Framework Alignment

Bootcamps should stay aligned with:

- UNESCO AI competency frameworks.
- OECD/European Commission AI Literacy Framework.
- NIST AI RMF.
- EU AI Act Article 4 AI literacy.
- DigComp 2.2.
- ISO/IEC 42001.
- Singapore AI Verify / Model Governance Framework for GenAI.
- AI literacy research such as Long & Magerko.

## Maintenance Rule

When bootcamp names, score-band routing, domains, labs, or framework mappings change, update:

- `app/page.tsx` bootcamp catalog and recommendation logic.
- Report learning-path bootcamp section.
- `README.md`.
- `docs/LATEST_CHANGES.md`.
- This document.
- Any admin content or agent prompts that recommend training paths.
