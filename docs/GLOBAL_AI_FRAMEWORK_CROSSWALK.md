# Global AI Framework Crosswalk

New Horizon is an AI readiness and practical judgment assessment. It is mapped to reputable AI literacy, digital competence, governance, and responsible AI frameworks, but it is not claiming certification equivalence with any external standard.

Use this document as the source of truth when updating domains, competencies, scoring explanations, telemetry, question formats, or admin quality-review prompts.

## Reference Frameworks

- UNESCO AI competency frameworks for students and teachers: human-centred mindset, ethics, AI foundations, AI applications, AI pedagogy, and professional learning.
- OECD/European Commission AI Literacy Framework: understanding AI, evaluating outputs critically, using AI responsibly and creatively, and making informed decisions.
- NIST AI Risk Management Framework: Govern, Map, Measure, and Manage.
- EU AI Act Article 4 AI literacy: sufficient AI literacy for staff and others operating or using AI systems, considering context, technical knowledge, experience, training, and affected persons.
- DigComp 2.2: information/data literacy, communication, content creation, safety, problem solving, and keeping up with digital evolution.
- ISO/IEC 42001: AI management system, risk/opportunity management, responsible use, transparency, traceability, reliability, and continual improvement.
- Singapore AI Verify / Model Governance Framework for GenAI: transparency, explainability, robustness, safety, security, fairness, data governance, accountability, human agency, and societal well-being.
- Long & Magerko AI literacy research: AI recognition, capabilities and limitations, data literacy, critical interpretation, ethics, human role, and interaction with AI.
- Gartner AI maturity model/toolkit: AI maturity across strategy, value, organization, people/culture, governance, engineering, and data; useful as a management maturity reference, not a formal certification standard.
- McKinsey AI value measurement framework: model health/infrastructure, user engagement, strategic alignment, and financial impact; useful for D5 value-realization and portfolio-measurement design.
- BCG Responsible AI maturity: accountability, transparency/explainability, fairness/equity, safety/security/robustness, data/privacy governance, societal impact, and Human + AI; useful for D4/D6 maturity review.

## D1-D6 Domain Mapping

| New Horizon domain | Primary external alignment | What New Horizon tests | Gap to improve |
| --- | --- | --- | --- |
| D1 AI Foundations & Concepts | UNESCO AI foundations/applications, OECD/EC AI literacy, DigComp, Long & Magerko | AI vocabulary, LLM basics, GenAI mechanics, model limits, data concepts, context, memory, tools, and agent components | Add more AI system lifecycle questions: design, deploy, monitor, retire |
| D2 Practical Application & Tooling | OECD/EC responsible/creative use, DigComp problem solving and content creation, DEC readiness, IBM AI skills | Prompt design, tool fit, workflow integration, output refinement, agentic workflows, and practical use | Split nontechnical tool fluency from technical build/integration pathways |
| D3 Critical Evaluation & Judgment | DigComp information/data evaluation, OECD critical evaluation, UNESCO safe/ethical use, Long & Magerko critical interpretation | Source verification, media provenance, data/chart judgment, benchmark skepticism, fraud detection, and evidence review | Increase realistic artifacts where answer quality depends on inspecting provenance and source quality |
| D4 Risk, Ethics & Governance | NIST AI RMF, ISO/IEC 42001, EU AI Act Article 4, AI Verify/MGF GenAI, UNESCO ethics, BCG Responsible AI maturity | Privacy, fairness, rights, policy fluency, security controls, auditability, human oversight, and governance | Add explicit role-based AI Act literacy, affected-person impact, accessibility, and sustainability evidence |
| D5 Strategy & Value Realization | NIST Map/Measure/Manage, ISO/IEC 42001 risk/opportunity management, Gartner AI maturity, McKinsey AI value measurement, IBM contextual AI knowledge | Use-case fit, ROI/KPI design, portfolio prioritization, risk-adjusted value, scale gates, and operating model | Add more executive and industry cases that separate demo appeal from durable value |
| D6 Human-AI Collaboration | UNESCO human-centred mindset, OECD attitudes/agency, EU AI Act context-of-use literacy, AI Verify human agency/oversight, Gartner people/culture maturity, BCG Human + AI, DEC human-centricity | Human-AI role clarity, accountability, challenge culture, adoption support, coaching, and learning loops | Add more collaboration evidence for managers, creators, educators, and frontline teams |

## Competency-Level Interpretation

- D1 competencies should prove whether users understand what AI systems can and cannot do, not whether they can repeat definitions.
- D2 competencies should prove whether users can choose, prompt, integrate, and improve AI tools in practical workflows.
- D3 competencies should prove whether users can challenge outputs, inspect evidence, and avoid being misled by polished AI responses or weak artifacts.
- D4 competencies should prove whether users can identify risks, protect people/data, apply policy, and keep human accountability visible.
- D5 competencies should prove whether users can connect AI work to measurable value, adoption, feasibility, and operating decisions.
- D6 competencies should prove whether users can collaborate with AI without surrendering judgment, trust, role clarity, or learning ownership.

## Profile-Weighted Domain Focus

Research conclusion: New Horizon should not distribute questions or radar targets evenly across D1-D6 for every user profile. AI literacy and responsible-use frameworks consistently emphasize that assessment depth should reflect the user's context, technical knowledge, role, and intended use. The platform should therefore use profile-weighted domain targets first, then choose competencies and difficulty within those domains.

Framework basis:

- UNESCO's student AI competency framework defines four dimensions: human-centred mindset, ethics of AI, AI techniques/applications, and AI system design, across understand/apply/create progression. This supports heavier D1/D2/D3/D4 coverage for general, student, and educator users before advanced strategy or system-design depth.
- The OECD/European Commission AI Literacy Framework frames AI literacy as knowledge, skills, and attitudes for understanding AI, critically evaluating outputs, and using AI ethically and creatively. This supports D1 Foundations, D2 Practical Tooling, D3 Critical Judgment, and D6 Human-AI Collaboration as the core general-user route.
- EU AI Act Article 4 says AI literacy measures should consider technical knowledge, experience, education, training, context of use, and affected persons. This supports different assessment emphasis by audience, function, industry, and leadership context instead of a single universal distribution.
- NIST AI RMF emphasizes Govern, Map, Measure, and Manage across the AI lifecycle. This supports heavier D4 Governance, D5 Value/measurement, and D6 accountability/change coverage for organizational, technical, team, and leadership users.
- DigComp 2.2 emphasizes information/data literacy, content creation, safety, problem solving, and digital evolution. This supports D2/D3/D4 weighting for everyday digital users and work users.
- ISO/IEC 42001 and Singapore AI Verify/MGF GenAI emphasize management systems, risk controls, transparency, accountability, human agency, robustness, and continual improvement. This supports stronger D4/D5/D6 targets for premium, organizational, public-sector, regulated-industry, and leadership profiles.

Recommended short-route domain emphasis:

| Profile | Primary domains | Secondary domains | Lower initial emphasis |
| --- | --- | --- | --- |
| General | D1 Foundations, D2 Practical Tooling, D3 Critical Judgment | D4 Risk basics, D6 Human-AI role clarity | D5 Strategy |
| Student | D1 Foundations, D2 Practical Tooling, D3 Critical Judgment | D4 ethics/privacy | D5 Strategy |
| Educator | D1 Foundations, D3 Critical Judgment, D4 Risk/Ethics, D6 Collaboration | D2 Practical Tooling | D5 Strategy |
| Work/Professional | D2 Practical Tooling, D3 Critical Judgment, D4 Risk/Governance | D5 Value, D6 Collaboration | D1 basics beyond limits |
| Team | D2 Workflow, D4 Governance, D5 Value, D6 Collaboration | D3 Judgment | D1 basics |
| Technical | D1 Systems, D2 Tooling/Agents, D3 Evaluation, D4 Security/Governance | D6 Learning loops | D5 unless architect/lead |
| Marketing/Creator | D2 Creation workflows, D3 media/source judgment, D5 campaign value | D4 disclosure/IP/fairness | D1 theory |
| Sales/Customer Service | D2 workflow/tool use, D3 source/customer fact judgment, D4 privacy/security, D6 handoff/trust | D5 business outcomes | D1 theory |
| Finance | D3 data/chart/fraud judgment, D4 governance/security/regulation, D5 value/ROI | D2 workflow | D6 unless leadership |
| Operations | D2 workflow/automation, D5 value/process impact, D6 adoption routines | D4 controls | D1 theory |
| Leadership inside Premium | D4 governance/risk, D5 strategy/value, D6 change/accountability | D3 evidence review | D1/D2 technical depth unless needed |

Recommended free `General` 12-question allocation:

| Domain | Questions | Reason |
| --- | ---: | --- |
| D1 Foundations | 3 | Establish basic AI concepts, limits, hallucination, model capability, and context awareness. |
| D2 Practical Tooling | 3 | Test whether users can actually use prompts, tools, and workflows. |
| D3 Critical Judgment | 3 | Test source checking, misinformation resistance, and output verification. |
| D4 Risk/Ethics | 1 | Cover basic privacy, fairness, and safe-use awareness without overloading novices. |
| D5 Strategy/Value | 0 | Defer business value/portfolio judgment unless the profile signals work or team use. |
| D6 Human-AI Collaboration | 2 | Test when to rely on AI, when to review, and where human accountability remains necessary. |

Premium and role/function diagnostics should use a weighted target model:

1. Function context first.
2. Industry context second.
3. Professional baseline third.
4. Optional profile-survey signals as tie-breakers.
5. Weak/unsampled competency evidence as adaptive follow-up routing.

This is why the app's radar targets should show distinct shapes. A general user's target should peak around D1-D3, a technical user's target should peak around D1/D2/D4, a finance user's target should peak around D3/D4/D5, and a leadership user's target should peak around D4/D5/D6. If all targets look similar, the report implies the same standard applies to every user, which conflicts with EU AI Act context-of-use logic and role-based skilling practice.

## Implemented Assessment Improvement Rules

Question routing should now follow this order:

1. Profile domain targets: route toward the domains the selected audience/function/industry needs most.
2. Profile priority competencies: prefer competencies identified from audience, function, industry, role, and optional profile survey.
3. Difficulty adaptation: move easier after weak evidence and harder after strong evidence.
4. Weak or undersampled domains: fill evidence gaps before finalizing confidence.
5. Item quality gates: de-prioritize flagged questions with negative item feedback, stale/irrelevant artifacts, confusing behavior, or poor survey themes.

The first route should not try to prove every D1-D6 area equally. A short route is a profile-weighted diagnostic sample. Follow-up routes then collect missing evidence until planned and profile-priority competencies are covered with enough confidence.

Answer review should support learning, not only grading. Each reveal should include:

- Raw answer score and difficulty-adjusted readiness evidence.
- Correct/expected evidence.
- Competencies measured.
- A practice cue for what the user should do next.
- Per-question quick feedback so weak items can be improved later.

## Scoring And Adaptive Testing Alignment

The scoring model supports the crosswalk by making high scores depend on stronger evidence:

1. Raw answer score comes from the item rubric, option quality, matching accuracy, ranking order, multi-select evidence, written rubric hits, or mini-part score.
2. Raw score is converted into readiness evidence using the item difficulty band.
3. Easier questions are capped below advanced readiness even when answered correctly.
4. Proficient and advanced questions can award higher readiness evidence, including meaningful partial credit for difficult work.
5. Competency and domain scores roll up from mapped evidence signals.
6. Overall score averages D1-D6 domain scores; unsampled domains do not receive a midpoint floor and must be displayed as `Not assessed` rather than as a measured low score.
7. Confidence uses coverage, repeated evidence, item information, SEM, and profile-priority competency sampling.
8. Low or medium confidence should recommend targeted continuation rather than pretending the first score is final.

Question-level score calculation must remain explainable to a tester and a learner. The report should show the question prompt, user answer, expected answer or rubric evidence, raw score, difficulty-adjusted readiness score, measured competencies, and the feedback reason. A calculation row with only numbers is not sufficient for audit or learning.

Current seeded readiness bands:

| Difficulty | Partial evidence anchor | Maximum readiness evidence |
| --- | ---: | ---: |
| Awareness | 40 | 68 |
| Applied | 58 | 82 |
| Proficient | 72 | 92 |
| Advanced | 82 | 100 |

Timing, hesitation, artifact opens, zoom behavior, revisions, item `a/b/c`, information, and SEM are telemetry/calibration signals in the MVP. They explain quality and confidence, but they do not directly add or subtract score yet.

## Artifact And Lab Quality Standard

Artifacts should appear only when they help users answer the question. A release-ready artifact must be relevant to the prompt, necessary or clearly useful for the answer key, legible at default and expanded sizes, realistic for the user role/industry, internally consistent, and free of decorative mockup elements that distract from evidence review. The complete release gate is maintained in the canonical [Artifact Design and QA Standard](ARTIFACT_DESIGN_AND_QA_STANDARD.md).

If an item can be answered from the prompt and options alone, hide the artifact or rewrite the item so the artifact contains meaningful evidence. If an artifact contains text, workflows, tables, emails, screenshots, invoices, or dashboards, the expanded view must fit the app window and be readable without forcing users to decode tiny labels.

Labs and pre-test samples should be clearly marked as pilot samples unless they include complete instructions, realistic artifacts, scoring criteria, expected outputs, and a debrief. Incomplete labs should not be presented as full training products.

## Product Surfaces To Keep Updated

When this mapping changes, update all of these surfaces together:

- Home page `Global frameworks` section.
- Home page `Scoring model` section.
- Assessment answer-review score explanation.
- Final report score calculation and confidence explanation.
- Admin quality-review and agent-orchestration prompts.
- `README.md`.
- `docs/LATEST_CHANGES.md`.
- This document.

## Source Links

- UNESCO AI competency frameworks: https://www.unesco.org/en/articles/what-you-need-know-about-unescos-new-ai-competency-frameworks-students-and-teachers?hub=66813
- OECD/EC AI Literacy Framework: https://www.oecd.org/en/publications/empowering-learners-for-the-age-of-ai_65cd27d4-en.html
- NIST AI RMF: https://www.nist.gov/itl/ai-risk-management-framework
- EU AI Act Article 4: https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-4
- DigComp framework: https://joint-research-centre.ec.europa.eu/oldpage-digcomp/digcomp-framework_en
- ISO/IEC 42001: https://www.iso.org/standard/42001
- AI Verify Foundation: https://aiverifyfoundation.sg/what-is-ai-verify/
- Long & Magerko AI literacy research overview: https://academic.oup.com/iwc/article/37/5/444/7717778
- Gartner AI Maturity Model Toolkit: https://www.gartner.com/en/chief-information-officer/research/ai-maturity-model-toolkit
- McKinsey AI value measurement framework: https://www.mckinsey.com/capabilities/quantumblack/our-insights/from-promise-to-impact-how-companies-can-measure-and-realize-the-full-value-of-ai
- BCG Responsible AI maturity: https://www.bcg.com/publications/2021/the-four-stages-of-responsible-ai-maturity
