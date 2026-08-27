'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

type DomainId = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6';
type Audience = 'general' | 'student' | 'educator' | 'professional' | 'team';
type Difficulty = 'awareness' | 'applied' | 'proficient';
type AssessmentMode = 'free' | 'premium' | 'executive';
type FunctionTrack = 'general' | 'people' | 'finance' | 'marketing' | 'technical' | 'operations';
type IndustryTrack = 'general' | 'education' | 'financial' | 'healthcare' | 'retail' | 'public';
type ExecutiveRole = 'ceo' | 'board' | 'people' | 'finance' | 'technology' | 'transformation';

type Option = { id: string; label: string; score: number; feedback: string };
type VisualStimulus = {
  kind: 'dashboard' | 'report' | 'post' | 'portfolio' | 'risk' | 'memo';
  title: string;
  eyebrow: string;
  caption: string;
  points: string[];
  callout?: string;
};
type RankItem = { id: string; label: string };
type MatchPair = { id: string; left: string; correct: string; choices: string[] };
type Question = {
  id: string;
  domain: DomainId;
  difficulty: Difficulty;
  type: 'scenario' | 'media' | 'judgment' | 'multi-select' | 'drag-order' | 'matching' | 'report-review' | 'narrative';
  interaction?: 'single' | 'multi' | 'rank' | 'match';
  stimulus?: {
    src: string;
    alt: string;
    label: string;
    caption: string;
  };
  visualStimulus?: VisualStimulus;
  correctOptionIds?: string[];
  rankItems?: RankItem[];
  idealOrder?: string[];
  matchPairs?: MatchPair[];
  prompt: string;
  context: string;
  options: Option[];
};
type Answer = { question: Question; option: Option };

const domains: Record<DomainId, { name: string; short: string; color: string }> = {
  D1: { name: 'AI Foundations & Concepts', short: 'Foundations', color: '#226c6f' },
  D2: { name: 'Practical Application & Tooling', short: 'Tooling', color: '#3f7d57' },
  D3: { name: 'Critical Evaluation & Judgment', short: 'Judgment', color: '#b45f3a' },
  D4: { name: 'Risk, Ethics & Governance', short: 'Governance', color: '#7b5ea7' },
  D5: { name: 'Strategy & Value Realization', short: 'Strategy', color: '#a27a23' },
  D6: { name: 'Human-AI Collaboration', short: 'Collaboration', color: '#3b6ea8' },
};

const audienceLabels: Record<Audience, string> = {
  general: 'General public',
  student: 'Student',
  educator: 'Educator',
  professional: 'Professional',
  team: 'Team member',
};

const functionLabels: Record<FunctionTrack, string> = {
  general: 'General work',
  people: 'HR & People',
  finance: 'Finance',
  marketing: 'Marketing & Sales',
  technical: 'Engineering & Data',
  operations: 'Operations & Support',
};

const industryLabels: Record<IndustryTrack, string> = {
  general: 'General',
  education: 'Education',
  financial: 'Financial services',
  healthcare: 'Healthcare',
  retail: 'Retail & ecommerce',
  public: 'Public sector',
};

const executiveLabels: Record<ExecutiveRole, string> = {
  ceo: 'CEO / Managing Director',
  board: 'Board / Investor',
  people: 'CHRO / People leader',
  finance: 'CFO / Risk leader',
  technology: 'CIO / CDO / CTO',
  transformation: 'Transformation sponsor',
};

const questionBank: Question[] = [
  {
    id: 'D1-A-001',
    domain: 'D1',
    difficulty: 'awareness',
    type: 'scenario',
    context: 'A colleague says a chatbot must be correct because it sounds confident and gives detailed citations.',
    prompt: 'What is the best response?',
    options: [
      { id: 'a', label: 'Accept the answer if the writing is fluent.', score: 15, feedback: 'Fluency is not evidence of accuracy.' },
      { id: 'b', label: 'Check whether the sources support the claim before using it.', score: 95, feedback: 'Strong. AI outputs need source and claim verification.' },
      { id: 'c', label: 'Reject all chatbot answers because they are never reliable.', score: 35, feedback: 'Too broad. The right move is calibrated verification.' },
      { id: 'd', label: 'Ask the chatbot to be more confident.', score: 10, feedback: 'Confidence wording does not improve truthfulness.' },
    ],
  },
  {
    id: 'D1-M-002',
    domain: 'D1',
    difficulty: 'applied',
    type: 'judgment',
    context: 'A team wants the model to answer questions using the latest internal HR policy.',
    prompt: 'Which approach is most appropriate?',
    options: [
      { id: 'a', label: 'Use retrieval from the approved policy repository.', score: 95, feedback: 'Correct. Retrieval grounds the answer in current approved material.' },
      { id: 'b', label: 'Rely on the model training data.', score: 25, feedback: 'Training data may be stale and may not contain private policy.' },
      { id: 'c', label: 'Fine-tune immediately without evaluating retrieval first.', score: 45, feedback: 'Fine-tuning may help style, but retrieval is the first fit for current facts.' },
      { id: 'd', label: 'Ask users to paste policy text each time.', score: 50, feedback: 'This may work manually but creates privacy and consistency risk.' },
    ],
  },
  {
    id: 'D1-H-003',
    domain: 'D1',
    difficulty: 'proficient',
    type: 'judgment',
    context: 'A user asks why an AI assistant invented a policy that was not in the source documents.',
    prompt: 'Which explanation is most accurate?',
    options: [
      { id: 'a', label: 'The model generated a plausible answer not grounded in retrieved evidence.', score: 95, feedback: 'Correct. This describes hallucination in a grounded workflow.' },
      { id: 'b', label: 'The model became malicious.', score: 20, feedback: 'Possible in some contexts, but not the best explanation here.' },
      { id: 'c', label: 'The user typed too slowly.', score: 5, feedback: 'Input speed is irrelevant.' },
      { id: 'd', label: 'The answer must be hidden in the documents.', score: 25, feedback: 'That assumes the conclusion instead of checking evidence.' },
    ],
  },
  {
    id: 'D2-A-001',
    domain: 'D2',
    difficulty: 'awareness',
    type: 'scenario',
    context: 'You need an AI assistant to draft a customer email from rough notes.',
    prompt: 'Which prompt gives the assistant the best chance of producing useful work?',
    options: [
      { id: 'a', label: 'Write something good.', score: 20, feedback: 'Too vague to guide format, audience, or constraints.' },
      { id: 'b', label: 'Draft a warm 150-word reply using these notes, avoid promises, and end with one next step.', score: 95, feedback: 'Strong. It gives role, output, constraints, and success criteria.' },
      { id: 'c', label: 'Make it perfect and professional.', score: 35, feedback: 'Better tone guidance, but still underspecified.' },
      { id: 'd', label: 'Rewrite the notes exactly.', score: 40, feedback: 'This may preserve meaning but misses the communication goal.' },
    ],
  },
  {
    id: 'D2-M-002',
    domain: 'D2',
    difficulty: 'applied',
    type: 'scenario',
    context: 'An AI workflow summarizes calls and pushes follow-up tasks to a CRM.',
    prompt: 'Where should a human approval step be placed first?',
    options: [
      { id: 'a', label: 'Before any customer-facing message or CRM commitment is created.', score: 95, feedback: 'Correct. Higher-impact outputs need review before action.' },
      { id: 'b', label: 'Only after the customer complains.', score: 10, feedback: 'Too late. Controls should prevent avoidable mistakes.' },
      { id: 'c', label: 'Never, because automation saves time.', score: 15, feedback: 'Efficiency cannot replace accountability.' },
      { id: 'd', label: 'Only when the AI says it is uncertain.', score: 55, feedback: 'Useful signal, but uncertainty is not the only risk trigger.' },
    ],
  },
  {
    id: 'D2-H-003',
    domain: 'D2',
    difficulty: 'proficient',
    type: 'scenario',
    context: 'You need repeatable AI outputs for a monthly board summary from messy project updates.',
    prompt: 'Which design is strongest?',
    options: [
      { id: 'a', label: 'A reusable template with inputs, constraints, examples, review checks, and source links.', score: 98, feedback: 'Correct. Repeatability needs structured prompting and review.' },
      { id: 'b', label: 'A fresh free-form prompt every month.', score: 35, feedback: 'This creates inconsistent outputs.' },
      { id: 'c', label: 'Ask for the most impressive summary possible.', score: 20, feedback: 'Impressive is not a measurable output constraint.' },
      { id: 'd', label: 'Skip source links to make it shorter.', score: 25, feedback: 'Board summaries need traceability.' },
    ],
  },
  {
    id: 'D3-A-001',
    domain: 'D3',
    difficulty: 'awareness',
    type: 'media',
    context: 'A social post shows a dramatic image of a flooded city and claims it happened this morning.',
    stimulus: {
      src: '/stimuli/flooded-street-authenticity.png',
      alt: 'A realistic flooded city street with storefronts, cars, reflections, and subtle visual inconsistencies.',
      label: 'Image authenticity task',
      caption: 'Inspect the scene before deciding whether the post is safe to share.',
    },
    prompt: 'What should you do before sharing it?',
    options: [
      { id: 'a', label: 'Share quickly because urgent posts need speed.', score: 10, feedback: 'Urgency increases the need for verification.' },
      { id: 'b', label: 'Check original source, date, location, and signs of manipulation.', score: 95, feedback: 'Strong. Authenticity requires provenance and visual/context checks.' },
      { id: 'c', label: 'Trust it if many people reposted it.', score: 20, feedback: 'Virality is not validation.' },
      { id: 'd', label: 'Ignore all images online.', score: 35, feedback: 'Too broad. The skill is verification, not blanket rejection.' },
    ],
  },
  {
    id: 'D3-M-002',
    domain: 'D3',
    difficulty: 'applied',
    type: 'media',
    context: 'An image looks realistic, but the caption claims a specific company CEO endorsed a policy yesterday.',
    stimulus: {
      src: '/stimuli/flooded-street-authenticity.png',
      alt: 'A realistic street image used as a visual provenance and caption-verification stimulus.',
      label: 'Image-caption verification',
      caption: 'The visual may be real-looking, but the claim attached to it still needs provenance.',
    },
    prompt: 'Which evidence would be strongest before accepting the caption?',
    options: [
      { id: 'a', label: 'A repost from an anonymous account.', score: 10, feedback: 'Anonymous reposts are weak provenance.' },
      { id: 'b', label: 'Original company channel, dated statement, or reliable news source confirming it.', score: 98, feedback: 'Correct. Verify the claim through authoritative provenance.' },
      { id: 'c', label: 'The image has high resolution.', score: 25, feedback: 'Image quality does not validate the caption.' },
      { id: 'd', label: 'The post has emotional wording.', score: 10, feedback: 'Emotion is often a manipulation signal, not evidence.' },
    ],
  },
  {
    id: 'D3-H-003',
    domain: 'D3',
    difficulty: 'proficient',
    type: 'judgment',
    context: 'An AI report cites two studies for a productivity claim, but neither study includes the cited percentage.',
    prompt: 'What is the strongest finding?',
    options: [
      { id: 'a', label: 'The report has a citation-support mismatch and should not use the claim as written.', score: 98, feedback: 'Correct. This identifies the evidence failure precisely.' },
      { id: 'b', label: 'The report is acceptable because citations exist.', score: 20, feedback: 'Citations must support the exact claim.' },
      { id: 'c', label: 'The productivity claim is automatically false.', score: 55, feedback: 'Not necessarily false, but unsupported by the cited evidence.' },
      { id: 'd', label: 'Only formatting needs correction.', score: 15, feedback: 'The issue is evidence quality, not formatting.' },
    ],
  },
  {
    id: 'D4-A-001',
    domain: 'D4',
    difficulty: 'awareness',
    type: 'scenario',
    context: 'A recruiter pastes candidate CVs with phone numbers and salary history into a public chatbot.',
    prompt: 'What is the main risk?',
    options: [
      { id: 'a', label: 'The chatbot may write too formally.', score: 10, feedback: 'Tone is secondary here.' },
      { id: 'b', label: 'Personal and confidential data may be exposed outside approved systems.', score: 95, feedback: 'Correct. This is a data protection and governance issue.' },
      { id: 'c', label: 'The recruiter may save time.', score: 20, feedback: 'Efficiency does not remove privacy obligations.' },
      { id: 'd', label: 'There is no risk if the output is useful.', score: 10, feedback: 'Usefulness does not make unsafe handling acceptable.' },
    ],
  },
  {
    id: 'D4-M-002',
    domain: 'D4',
    difficulty: 'applied',
    type: 'judgment',
    context: 'A department wants to use AI to rank job applicants.',
    prompt: 'Which control is most important before launch?',
    options: [
      { id: 'a', label: 'Bias, privacy, explainability, and human review checks.', score: 98, feedback: 'Strong. Hiring is high-impact and needs layered governance.' },
      { id: 'b', label: 'A more colorful dashboard.', score: 10, feedback: 'Presentation does not address high-impact risk.' },
      { id: 'c', label: 'Let the vendor decide all policies.', score: 20, feedback: 'The organization still owns governance accountability.' },
      { id: 'd', label: 'Launch first and audit next year.', score: 15, feedback: 'Controls are needed before deployment.' },
    ],
  },
  {
    id: 'D4-H-003',
    domain: 'D4',
    difficulty: 'proficient',
    type: 'judgment',
    context: 'An internal AI agent can read files, send emails, and update customer records.',
    prompt: 'Which risk control should be mandatory?',
    options: [
      { id: 'a', label: 'Tool permissions, audit logs, approval gates, and least-privilege access.', score: 98, feedback: 'Correct. Agentic systems need clear authority boundaries.' },
      { id: 'b', label: 'A friendly name for the agent.', score: 10, feedback: 'Naming does not control action risk.' },
      { id: 'c', label: 'Unlimited access so it can be helpful.', score: 10, feedback: 'Unlimited permissions create serious risk.' },
      { id: 'd', label: 'Only a launch announcement.', score: 15, feedback: 'Communication is not a sufficient control.' },
    ],
  },
  {
    id: 'D5-A-001',
    domain: 'D5',
    difficulty: 'awareness',
    type: 'scenario',
    context: 'A manager says, "We need AI because competitors are using it."',
    prompt: 'What is the best next question?',
    options: [
      { id: 'a', label: 'Which business problem, user workflow, and measurable outcome are we targeting?', score: 98, feedback: 'Correct. AI value starts from a concrete problem and metric.' },
      { id: 'b', label: 'Which model has the most hype?', score: 15, feedback: 'Hype is not a strategy.' },
      { id: 'c', label: 'Can we replace the whole team?', score: 10, feedback: 'This jumps to an unsafe and unsupported conclusion.' },
      { id: 'd', label: 'How quickly can we announce it?', score: 20, feedback: 'Communication follows a credible plan.' },
    ],
  },
  {
    id: 'D5-M-002',
    domain: 'D5',
    difficulty: 'applied',
    type: 'judgment',
    context: 'A vendor promises 40% productivity gain from an AI tool but offers no baseline, pilot design, or adoption plan.',
    stimulus: {
      src: '/stimuli/productivity-chart-forensics.png',
      alt: 'A dashboard showing AI Pilot productivity charts with a prominent plus forty-two percent claim and potentially misleading visual scaling.',
      label: 'Chart forensics task',
      caption: 'Review the chart presentation and the +42% claim before deciding how to treat the vendor evidence.',
    },
    prompt: 'How should the claim be handled?',
    options: [
      { id: 'a', label: 'Accept it because vendor benchmarks are enough.', score: 20, feedback: 'Benchmarks need local validation.' },
      { id: 'b', label: 'Run a scoped pilot with baseline metrics, risk controls, and success criteria.', score: 98, feedback: 'Correct. This turns a claim into testable evidence.' },
      { id: 'c', label: 'Reject every productivity tool.', score: 35, feedback: 'Too broad. The issue is evidence and fit.' },
      { id: 'd', label: 'Buy first to avoid missing the trend.', score: 15, feedback: 'Speed without validation creates waste and risk.' },
    ],
  },
  {
    id: 'D6-A-001',
    domain: 'D6',
    difficulty: 'awareness',
    type: 'scenario',
    context: 'A team worries that AI will silently change their jobs and make mistakes they will be blamed for.',
    prompt: 'What is the best leadership response?',
    options: [
      { id: 'a', label: 'Tell them not to worry and continue rollout.', score: 15, feedback: 'Reassurance without process does not build trust.' },
      { id: 'b', label: 'Define human review points, escalation paths, training, and accountability.', score: 98, feedback: 'Correct. Trust comes from clear workflow and support.' },
      { id: 'c', label: 'Ban questions about AI.', score: 5, feedback: 'That damages adoption and safety.' },
      { id: 'd', label: 'Use AI only in secret pilots.', score: 20, feedback: 'Hidden use weakens trust and governance.' },
    ],
  },
  {
    id: 'D6-H-002',
    domain: 'D6',
    difficulty: 'proficient',
    type: 'judgment',
    context: 'A support team uses AI to draft replies. Error rates fall, but agents stop learning edge cases.',
    prompt: 'What is the best redesign?',
    options: [
      { id: 'a', label: 'Keep automation, add review rituals, edge-case coaching, and learning loops.', score: 98, feedback: 'Correct. This preserves value while strengthening human capability.' },
      { id: 'b', label: 'Remove all AI permanently.', score: 35, feedback: 'That may lose benefits without solving learning design.' },
      { id: 'c', label: 'Let AI send every answer automatically.', score: 20, feedback: 'This worsens skill decay and risk.' },
      { id: 'd', label: 'Ignore the learning issue if metrics improved.', score: 25, feedback: 'Short-term metrics can hide long-term capability loss.' },
    ],
  },
];

const executiveQuestionBank: Question[] = [
  {
    id: 'EXEC-D5-003',
    domain: 'D5',
    difficulty: 'applied',
    type: 'media',
    interaction: 'single',
    context: 'A vendor presents a board slide claiming a 42% productivity lift from an AI pilot, but the slide does not show baseline, sample size, adoption rate, or measurement period.',
    visualStimulus: {
      kind: 'dashboard',
      eyebrow: 'Board dashboard extract',
      title: 'AI Service Pilot: Productivity Claim',
      callout: '+42%',
      caption: 'The visual looks decisive, but the measurement design is incomplete.',
      points: ['Pilot group: not disclosed', 'Baseline: not shown', 'Adoption rate: 38%', 'Error review: pending'],
    },
    prompt: 'What should an executive ask for before approving scale-up?',
    options: [
      { id: 'a', label: 'Approve scale-up because the chart shows a large gain.', score: 20, feedback: 'The chart alone is not enough evidence for an investment decision.' },
      { id: 'b', label: 'Request baseline metrics, cohort design, adoption data, risk controls, and a decision gate.', score: 98, feedback: 'Correct. This turns a vendor claim into decision-grade evidence.' },
      { id: 'c', label: 'Ask for a more polished board deck.', score: 25, feedback: 'Presentation quality does not solve weak evidence.' },
      { id: 'd', label: 'Reject AI productivity pilots entirely.', score: 35, feedback: 'Too broad. The right move is disciplined validation.' },
    ],
  },
  {
    id: 'EXEC-D5-002',
    domain: 'D5',
    difficulty: 'applied',
    type: 'multi-select',
    interaction: 'multi',
    context: 'The executive committee must choose which AI opportunities enter the next-quarter portfolio.',
    visualStimulus: {
      kind: 'portfolio',
      eyebrow: 'Use-case portfolio',
      title: 'Candidate AI Investments',
      caption: 'Four ideas compete for executive sponsorship. Some are attractive but weak on readiness or risk.',
      points: ['Customer response drafting: medium value, high readiness', 'Automated credit exceptions: high value, high risk', 'Meeting summaries: low value, high readiness', 'Pricing optimization: high value, data gaps'],
    },
    prompt: 'Select all criteria that should be used before prioritizing the portfolio.',
    correctOptionIds: ['a', 'b', 'c', 'd'],
    options: [
      { id: 'a', label: 'Measurable business value and decision owner.', score: 25, feedback: 'Value and ownership are required.' },
      { id: 'b', label: 'Data readiness and integration feasibility.', score: 25, feedback: 'Readiness determines whether value is achievable.' },
      { id: 'c', label: 'Risk, compliance, and human-review needs.', score: 25, feedback: 'Risk-adjusted value matters at executive level.' },
      { id: 'd', label: 'Pilot learning value and scale path.', score: 25, feedback: 'Learning and scale evidence prevent isolated experiments.' },
      { id: 'e', label: 'Whether the idea sounds most innovative in a press release.', score: 0, feedback: 'Novelty is not a decision criterion.' },
    ],
  },
  {
    id: 'EXEC-D6-004',
    domain: 'D6',
    difficulty: 'proficient',
    type: 'matching',
    interaction: 'match',
    context: 'An AI agent can draft supplier emails, update CRM records, and trigger finance approvals across departments.',
    visualStimulus: {
      kind: 'risk',
      eyebrow: 'Agent authority map',
      title: 'Cross-Department AI Agent',
      caption: 'The agent touches communication, records, approvals, and exceptions.',
      points: ['Supplier email draft', 'CRM update', 'Finance approval trigger', 'Customer exception escalation'],
    },
    prompt: 'Match each agent capability to the right executive control.',
    matchPairs: [
      { id: 'email', left: 'Draft supplier emails', correct: 'Human approval before external send', choices: ['Human approval before external send', 'Autonomous execution', 'No log required'] },
      { id: 'crm', left: 'Update CRM records', correct: 'Audit log and rollback path', choices: ['Audit log and rollback path', 'Public announcement', 'Ignore until quarter end'] },
      { id: 'finance', left: 'Trigger finance approval', correct: 'Named owner and threshold gate', choices: ['Named owner and threshold gate', 'Unlimited tool access', 'Vendor decides'] },
    ],
    options: [
      { id: 'match', label: 'Match controls to agent capabilities.', score: 98, feedback: 'Strong executive oversight maps authority to control, owner, and evidence.' },
    ],
  },
  {
    id: 'EXEC-D4-005',
    domain: 'D4',
    difficulty: 'applied',
    type: 'report-review',
    interaction: 'multi',
    context: 'A strategic AI vendor refuses to explain audit access, model monitoring, data retention, or subcontractor use.',
    visualStimulus: {
      kind: 'report',
      eyebrow: 'Vendor diligence excerpt',
      title: 'AI Platform Proposal',
      caption: 'The proposal promises rapid deployment but leaves several assurance fields blank.',
      points: ['Audit rights: not provided', 'Retention period: vendor standard', 'Subprocessors: available after signature', 'Monitoring: roadmap item'],
    },
    prompt: 'Which concerns should block procurement until resolved?',
    correctOptionIds: ['a', 'b', 'c', 'd'],
    options: [
      { id: 'a', label: 'No auditability or monitoring commitments.', score: 25, feedback: 'Auditability is a procurement gate.' },
      { id: 'b', label: 'Unclear data retention and vendor data use.', score: 25, feedback: 'Data terms must be explicit.' },
      { id: 'c', label: 'Unknown subprocessors and cross-border exposure.', score: 25, feedback: 'Third-party chain of custody matters.' },
      { id: 'd', label: 'No exit rights or portability language.', score: 25, feedback: 'Executives should avoid hidden lock-in.' },
      { id: 'e', label: 'The deck uses plain typography.', score: 0, feedback: 'Visual polish is not a risk control.' },
    ],
  },
  {
    id: 'EXEC-D3-003',
    domain: 'D3',
    difficulty: 'applied',
    type: 'media',
    interaction: 'single',
    context: 'A realistic social post claims a CEO announced layoffs after seeing an AI-generated forecast. The post is spreading quickly before market open.',
    visualStimulus: {
      kind: 'post',
      eyebrow: 'Social media post',
      title: 'Breaking: CEO confirms AI-driven layoffs',
      caption: 'The post uses a realistic executive image, urgent wording, and no original source link.',
      points: ['Source: anonymous repost', 'Timestamp: 06:12 before market open', 'Original video: not linked', 'Company channel: no matching statement'],
    },
    stimulus: {
      src: '/stimuli/executive-synthetic-post.svg',
      alt: 'A social media style post claiming a CEO confirmed AI-driven layoffs, labeled with missing provenance clues.',
      label: 'Synthetic media image',
      caption: 'The image is the item stimulus: inspect the post, source, timing, and missing original link.',
    },
    prompt: 'What should leadership do before responding publicly?',
    options: [
      { id: 'a', label: 'Respond immediately to match the speed of the post.', score: 25, feedback: 'Speed matters, but an unverified response can amplify misinformation.' },
      { id: 'b', label: 'Verify provenance through original channels, trusted reporting, metadata where available, and internal confirmation.', score: 98, feedback: 'Correct. Executive response should be fast and evidence-led.' },
      { id: 'c', label: 'Ignore it until it disappears.', score: 35, feedback: 'Silence may be risky when market or employee trust is affected.' },
      { id: 'd', label: 'Assume realistic visuals are authentic.', score: 10, feedback: 'Realistic visuals are not proof of authenticity.' },
    ],
  },
  {
    id: 'EXEC-D5-024',
    domain: 'D5',
    difficulty: 'proficient',
    type: 'drag-order',
    interaction: 'rank',
    context: 'The annual AI budget has ten proposed initiatives across automation, customer experience, analytics, and internal productivity.',
    prompt: 'Drag or reorder the executive stage gates into the strongest order for responsible AI investment.',
    rankItems: [
      { id: 'value', label: 'Define value hypothesis and owner' },
      { id: 'readiness', label: 'Assess data, workflow, and risk readiness' },
      { id: 'pilot', label: 'Run controlled pilot with success metrics' },
      { id: 'scale', label: 'Scale only after evidence and controls pass' },
    ],
    idealOrder: ['value', 'readiness', 'pilot', 'scale'],
    options: [
      { id: 'rank', label: 'Order portfolio gates from hypothesis to scale.', score: 98, feedback: 'Strong. The sequence protects investment discipline.' },
    ],
  },
  {
    id: 'EXEC-D4-004',
    domain: 'D4',
    difficulty: 'proficient',
    type: 'matching',
    interaction: 'match',
    context: 'A regulated workflow will use AI to recommend eligibility decisions, with human reviewers expected to approve exceptions.',
    prompt: 'Match each regulated-workflow risk to the appropriate governance evidence.',
    matchPairs: [
      { id: 'fairness', left: 'Uneven outcomes across protected groups', correct: 'Bias test and remediation record', choices: ['Bias test and remediation record', 'Marketing launch plan', 'Seat-license count'] },
      { id: 'appeal', left: 'User challenges AI-assisted decision', correct: 'Appeal path and human rationale', choices: ['Appeal path and human rationale', 'Vendor logo page', 'Internal hype metric'] },
      { id: 'drift', left: 'Performance changes after launch', correct: 'Monitoring dashboard and review cadence', choices: ['Monitoring dashboard and review cadence', 'One-time demo', 'No evidence needed'] },
    ],
    options: [
      { id: 'match', label: 'Match governance evidence to workflow risk.', score: 98, feedback: 'Correct matching shows governance fluency.' },
    ],
  },
  {
    id: 'EXEC-D6-012',
    domain: 'D6',
    difficulty: 'proficient',
    type: 'narrative',
    interaction: 'single',
    context: 'An AI assistant sent incorrect customer guidance that affected a small but visible customer segment.',
    visualStimulus: {
      kind: 'memo',
      eyebrow: 'Incident narrative',
      title: 'Customer Guidance Error',
      caption: 'A response draft passed human review, reached 184 customers, and triggered conflicting advice across support channels.',
      points: ['Impact: limited but visible', 'Root cause: weak exception review', 'Control: no rollback checklist', 'Employee concern: blame culture'],
    },
    prompt: 'Which executive response builds the most trust?',
    options: [
      { id: 'a', label: 'Blame the frontline team for accepting the AI output.', score: 10, feedback: 'Blame discourages learning and hides systemic control failures.' },
      { id: 'b', label: 'Contain harm, notify affected stakeholders, explain remediation, fix controls, and share learning.', score: 98, feedback: 'Correct. Trust comes from accountability and visible improvement.' },
      { id: 'c', label: 'Quietly patch the system without communicating.', score: 35, feedback: 'Hidden fixes may fail trust and disclosure obligations.' },
      { id: 'd', label: 'Stop all customer-facing AI forever.', score: 40, feedback: 'A pause may be needed, but permanent retreat is not necessarily proportional.' },
    ],
  },
  {
    id: 'EXEC-D5-016',
    domain: 'D5',
    difficulty: 'applied',
    type: 'multi-select',
    interaction: 'multi',
    context: 'A vendor proposes a proprietary AI workflow that would embed core customer data, prompts, and operating logic inside its platform.',
    prompt: 'Select the strategic risks executives should review before signing.',
    correctOptionIds: ['a', 'b', 'c'],
    options: [
      { id: 'a', label: 'Data ownership, retention, and reuse rights.', score: 33, feedback: 'Data rights determine long-term control.' },
      { id: 'b', label: 'Portability, exit rights, and migration cost.', score: 33, feedback: 'Exit paths protect strategic flexibility.' },
      { id: 'c', label: 'Dependency on vendor prompts, workflows, and model roadmap.', score: 33, feedback: 'Capability dependency can become lock-in.' },
      { id: 'd', label: 'The charisma of the vendor presenter.', score: 0, feedback: 'A strong pitch is not diligence evidence.' },
    ],
  },
  {
    id: 'EXEC-D1-003',
    domain: 'D1',
    difficulty: 'applied',
    type: 'matching',
    interaction: 'match',
    context: 'A leadership team assumes an AI agent can safely chain tools autonomously because the underlying model passed a benchmark.',
    prompt: 'Match the executive misconception to the correct AI oversight concept.',
    matchPairs: [
      { id: 'benchmark', left: 'High benchmark score', correct: 'Capability signal, not safe authority', choices: ['Capability signal, not safe authority', 'Permission to automate everything', 'Legal approval'] },
      { id: 'retrieval', left: 'Current policy answer', correct: 'Requires grounding in approved sources', choices: ['Requires grounding in approved sources', 'Model memory is enough', 'Ignore citations'] },
      { id: 'agent', left: 'Tool-chaining agent', correct: 'Needs permissions, logs, and supervision', choices: ['Needs permissions, logs, and supervision', 'No human role remains', 'Only branding matters'] },
    ],
    options: [
      { id: 'match', label: 'Match concepts to misconceptions.', score: 98, feedback: 'Correct. Executive fluency means knowing what capability evidence does and does not prove.' },
    ],
  },
  {
    id: 'EXEC-D2-002',
    domain: 'D2',
    difficulty: 'applied',
    type: 'drag-order',
    interaction: 'rank',
    context: 'A business unit adds an AI copilot to an existing approval workflow and reports that employees like it.',
    prompt: 'Drag or reorder the workflow integration steps before broad rollout.',
    rankItems: [
      { id: 'map', label: 'Map where AI enters the workflow' },
      { id: 'review', label: 'Set human review and exception points' },
      { id: 'measure', label: 'Measure quality, speed, adoption, and risk' },
      { id: 'train', label: 'Train role owners and scale the pattern' },
    ],
    idealOrder: ['map', 'review', 'measure', 'train'],
    options: [
      { id: 'rank', label: 'Order workflow steps from mapping to scale.', score: 98, feedback: 'Strong workflow governance starts with context, then controls, measures, and enablement.' },
    ],
  },
  {
    id: 'EXEC-D3-002',
    domain: 'D3',
    difficulty: 'applied',
    type: 'report-review',
    interaction: 'single',
    context: 'An AI-generated market report cites three sources, but the cited materials do not support the exact growth forecast used in the board recommendation.',
    visualStimulus: {
      kind: 'report',
      eyebrow: 'AI report excerpt',
      title: 'Market Expansion Recommendation',
      caption: 'The report lists sources, but the cited materials do not contain the stated 31% growth forecast.',
      points: ['Claim: market will grow 31%', 'Source A: adoption barriers', 'Source B: 2023 survey, no forecast', 'Source C: vendor blog, no sample'],
    },
    stimulus: {
      src: '/stimuli/executive-market-report.svg',
      alt: 'A board report excerpt showing an unsupported thirty-one percent market growth forecast and weak citations.',
      label: 'Report evidence image',
      caption: 'The image is the item stimulus: compare the claim against the cited source notes.',
    },
    prompt: 'What is the strongest executive conclusion?',
    options: [
      { id: 'a', label: 'The forecast is decision-ready because sources are listed.', score: 20, feedback: 'Sources must support the exact claim.' },
      { id: 'b', label: 'The recommendation has a citation-support gap and needs correction before board use.', score: 98, feedback: 'Correct. This identifies the evidence failure without overclaiming.' },
      { id: 'c', label: 'The entire market report must be false.', score: 45, feedback: 'The specific claim is unsupported; other content may still be valid.' },
      { id: 'd', label: 'Only the citation formatting needs editing.', score: 15, feedback: 'This is a substance issue, not formatting.' },
    ],
  },
  {
    id: 'EXEC-D6-018',
    domain: 'D6',
    difficulty: 'proficient',
    type: 'multi-select',
    interaction: 'multi',
    context: 'The board asks how leadership will stay competent enough to oversee AI as tools and risks change quickly.',
    prompt: 'Select the routines that belong in an executive AI oversight cadence.',
    correctOptionIds: ['a', 'b', 'c', 'd'],
    options: [
      { id: 'a', label: 'Quarterly AI portfolio and risk review.', score: 25, feedback: 'Portfolio review keeps investment and risk connected.' },
      { id: 'b', label: 'Incident and near-miss learning review.', score: 25, feedback: 'Incidents are a leadership learning loop.' },
      { id: 'c', label: 'Executive scenario drills for emerging AI risks.', score: 25, feedback: 'Scenario practice improves judgment under ambiguity.' },
      { id: 'd', label: 'Named accountability for business, risk, technology, and people outcomes.', score: 25, feedback: 'Accountability must be shared but explicit.' },
      { id: 'e', label: 'One annual inspirational keynote with no operating follow-up.', score: 0, feedback: 'Inspiration without cadence does not create oversight capability.' },
    ],
  },
  {
    id: 'EXEC-D4-010',
    domain: 'D4',
    difficulty: 'proficient',
    type: 'drag-order',
    interaction: 'rank',
    context: 'An AI workflow exposed a confidential customer segment report to employees who did not need access.',
    visualStimulus: {
      kind: 'risk',
      eyebrow: 'Incident log',
      title: 'Confidential Report Exposure',
      caption: 'The initial log shows broad permissions, unclear notification status, and no prevention owner.',
      points: ['Access scope: 214 employees', 'Containment: partial', 'Customer impact: under review', 'Owner: not assigned'],
    },
    prompt: 'Drag or reorder the incident response actions into the best executive sequence.',
    rankItems: [
      { id: 'contain', label: 'Contain access and preserve audit evidence' },
      { id: 'assess', label: 'Assess impact, legal obligations, and notification needs' },
      { id: 'communicate', label: 'Communicate clearly to affected stakeholders' },
      { id: 'prevent', label: 'Fix permissions, monitoring, and ownership' },
    ],
    idealOrder: ['contain', 'assess', 'communicate', 'prevent'],
    options: [
      { id: 'rank', label: 'Order incident actions from containment to prevention.', score: 98, feedback: 'Correct. Incident leadership starts with containment and evidence.' },
    ],
  },
  {
    id: 'EXEC-D5-021',
    domain: 'D5',
    difficulty: 'applied',
    type: 'narrative',
    interaction: 'single',
    context: 'Employees hear that AI is a cost-cutting program, while the board hears it is a growth and quality program.',
    prompt: 'Which executive narrative best supports adoption and trust?',
    options: [
      { id: 'a', label: 'AI will replace routine work, and details will come later.', score: 20, feedback: 'This increases fear and ambiguity.' },
      { id: 'b', label: 'AI will target measurable customer, quality, and productivity outcomes while protecting accountability and learning.', score: 98, feedback: 'Correct. It connects value, trust, and human capability.' },
      { id: 'c', label: 'AI is mainly an IT modernization project.', score: 35, feedback: 'That undersells business ownership and change leadership.' },
      { id: 'd', label: 'AI messaging should wait until every answer is known.', score: 40, feedback: 'Leaders can communicate principles before every detail is final.' },
    ],
  },
  {
    id: 'EXEC-D6-016',
    domain: 'D6',
    difficulty: 'applied',
    type: 'matching',
    interaction: 'match',
    context: 'Legal, IT, HR, and Operations disagree on whether a customer-support AI assistant should scale.',
    prompt: 'Match each function to the concern it should own in the decision forum.',
    matchPairs: [
      { id: 'legal', left: 'Legal', correct: 'Disclosure, liability, and regulatory obligations', choices: ['Disclosure, liability, and regulatory obligations', 'System uptime only', 'Training attendance'] },
      { id: 'it', left: 'IT / Data', correct: 'Security, integration, access, and monitoring', choices: ['Security, integration, access, and monitoring', 'Press release timing', 'Compensation policy'] },
      { id: 'hr', left: 'HR / People', correct: 'Role impact, enablement, and adoption trust', choices: ['Role impact, enablement, and adoption trust', 'Vendor revenue', 'Database schema only'] },
    ],
    options: [
      { id: 'match', label: 'Match functions to decision concerns.', score: 98, feedback: 'Strong executives create shared criteria without blurring ownership.' },
    ],
  },
  {
    id: 'EXEC-D3-005',
    domain: 'D3',
    difficulty: 'proficient',
    type: 'media',
    interaction: 'single',
    context: 'A trend dashboard shows customer churn dropping after an AI assistant launch, but the y-axis is truncated and a pricing change happened at the same time.',
    visualStimulus: {
      kind: 'dashboard',
      eyebrow: 'Churn dashboard',
      title: 'AI Assistant Impact',
      callout: 'Churn -18%',
      caption: 'The visual implies causality, but the axis and concurrent pricing change complicate interpretation.',
      points: ['Y-axis starts at 7%', 'AI launch: May', 'Pricing discount: May', 'No control group shown'],
    },
    prompt: 'What is the best executive interpretation?',
    options: [
      { id: 'a', label: 'AI definitely caused the full churn reduction.', score: 20, feedback: 'The visual overstates causality.' },
      { id: 'b', label: 'The result is promising but needs causal analysis, controls, and baseline transparency.', score: 98, feedback: 'Correct. This is calibrated evidence judgment.' },
      { id: 'c', label: 'The dashboard proves AI had no value.', score: 35, feedback: 'The evidence is weak, not necessarily negative.' },
      { id: 'd', label: 'Hide the chart because it is imperfect.', score: 30, feedback: 'Improve the evidence rather than hiding uncertainty.' },
    ],
  },
];

const learningCatalog: Record<DomainId, { title: string; detail: string; format: string }> = {
  D1: { title: 'AI concepts in plain language', detail: 'Build a reliable mental model of LLMs, retrieval, hallucination, and model limits.', format: '45 min module' },
  D2: { title: 'Prompting and workflow lab', detail: 'Practice reusable prompt patterns, review checklists, and human-in-the-loop design.', format: '60 min lab' },
  D3: { title: 'Verification and synthetic media sprint', detail: 'Learn source triangulation, image-caption checks, citation review, and confidence calibration.', format: '75 min simulation' },
  D4: { title: 'Responsible AI guardrails', detail: 'Apply privacy, fairness, security, and governance controls to common workplace scenarios.', format: '50 min playbook' },
  D5: { title: 'AI value and use-case prioritization', detail: 'Turn AI ideas into measurable pilots with baseline metrics, risk review, and ROI evidence.', format: '40 min workshop' },
  D6: { title: 'Human-AI collaboration routines', detail: 'Design review rituals, escalation paths, role clarity, and team learning loops.', format: '55 min module' },
};

const executiveLearningCatalog: Record<DomainId, { title: string; detail: string; format: string }> = {
  D1: { title: 'Executive AI fluency briefing', detail: 'Clarify model limits, retrieval, agentic workflows, and where leadership judgment is still required.', format: '45 min briefing' },
  D2: { title: 'AI operating workflow review', detail: 'Map review points, quality metrics, exception paths, and adoption measures for high-value workflows.', format: '60 min workshop' },
  D3: { title: 'Board-grade evidence review', detail: 'Practice chart forensics, citation-support checks, synthetic media response, and confidence calibration.', format: '75 min simulation' },
  D4: { title: 'AI governance and risk cadence', detail: 'Define risk appetite, committee mandate, vendor controls, audit evidence, and incident routines.', format: '90 min governance lab' },
  D5: { title: 'AI portfolio value realization', detail: 'Prioritize use cases by value, feasibility, risk, data readiness, and stage-gate evidence.', format: '90 min executive workshop' },
  D6: { title: 'Human-AI change leadership', detail: 'Build role clarity, trust loops, leadership messaging, capability plans, and accountability rituals.', format: '75 min leadership lab' },
};

const difficultyValue: Record<Difficulty, number> = { awareness: 0, applied: 1, proficient: 2 };
const modeConfig: Record<AssessmentMode, { label: string; totalQuestions: number; confidenceBase: number; confidenceStep: number }> = {
  free: { label: 'Adaptive free assessment', totalQuestions: 12, confidenceBase: 38, confidenceStep: 4 },
  premium: { label: 'Premium diagnostic pilot', totalQuestions: 16, confidenceBase: 48, confidenceStep: 3 },
  executive: { label: 'Executive assessment pilot', totalQuestions: 16, confidenceBase: 54, confidenceStep: 3 },
};
const executiveDomainSequence: DomainId[] = ['D5', 'D6', 'D4', 'D5', 'D4', 'D6', 'D5', 'D3', 'D4', 'D6', 'D1', 'D2', 'D4', 'D5', 'D6', 'D3'];

function scoreToLevel(score: number) {
  if (score >= 82) return 'Proficient';
  if (score >= 64) return 'Applied';
  if (score >= 44) return 'Developing';
  return 'Awareness';
}

function emptyDomainScores() {
  return Object.keys(domains).reduce(
    (acc, domain) => ({ ...acc, [domain]: { points: 0, count: 0 } }),
    {} as Record<DomainId, { points: number; count: number }>,
  );
}

function getDomainScores(answers: Answer[]) {
  const raw = emptyDomainScores();
  answers.forEach(({ question, option }) => {
    raw[question.domain].points += option.score;
    raw[question.domain].count += 1;
  });
  return Object.fromEntries(
    Object.entries(raw).map(([domain, value]) => [domain, value.count ? Math.round(value.points / value.count) : 50]),
  ) as Record<DomainId, number>;
}

function scoreMultiSelect(question: Question, selected: string[]) {
  const correct = question.correctOptionIds ?? [];
  const selectedSet = new Set(selected);
  const correctSelected = correct.filter((id) => selectedSet.has(id)).length;
  const wrongSelected = selected.filter((id) => !correct.includes(id)).length;
  if (!selected.length) return 15;
  if (correctSelected === correct.length && wrongSelected === 0) return 98;
  const partial = Math.round((correctSelected / Math.max(correct.length, 1)) * 82);
  return Math.max(20, partial - wrongSelected * 18);
}

function scoreOrder(question: Question, order: string[]) {
  const ideal = question.idealOrder ?? [];
  if (!ideal.length) return 60;
  const exactPositions = ideal.filter((id, index) => order[index] === id).length;
  return Math.max(25, Math.round((exactPositions / ideal.length) * 98));
}

function scoreMatches(question: Question, selections: Record<string, string>) {
  const pairs = question.matchPairs ?? [];
  if (!pairs.length) return 60;
  const correct = pairs.filter((pair) => selections[pair.id] === pair.correct).length;
  return Math.max(20, Math.round((correct / pairs.length) * 98));
}

function selectNextQuestion(answers: Answer[], assessmentMode: AssessmentMode = 'free') {
  const bank = assessmentMode === 'executive' ? executiveQuestionBank : questionBank;
  const answered = new Set(answers.map((answer) => answer.question.id));
  const scores = getDomainScores(answers);
  const counts = emptyDomainScores();
  answers.forEach(({ question }) => {
    counts[question.domain].count += 1;
  });
  const targetDomain =
    assessmentMode === 'executive'
      ? executiveDomainSequence[answers.length % executiveDomainSequence.length]
      : undefined;
  const weakestDomain = (Object.keys(domains) as DomainId[]).sort(
    (a, b) => counts[a].count - counts[b].count || scores[a] - scores[b],
  )[0];
  const overall = answers.length ? answers.reduce((sum, answer) => sum + answer.option.score, 0) / answers.length : 62;
  const targetDifficulty: Difficulty = overall >= 78 ? 'proficient' : overall >= 55 ? 'applied' : 'awareness';
  const candidates = bank.filter((question) => !answered.has(question.id));
  if (targetDomain) {
    const executiveMatch =
      candidates.find((question) => question.domain === targetDomain && question.difficulty === targetDifficulty) ||
      candidates.find((question) => question.domain === targetDomain);
    if (executiveMatch) return executiveMatch;
  }
  return (
    candidates.find((question) => question.domain === weakestDomain && question.difficulty === targetDifficulty) ||
    candidates.find((question) => question.domain === weakestDomain) ||
    candidates.sort(
      (a, b) =>
        Math.abs(difficultyValue[a.difficulty] - difficultyValue[targetDifficulty]) -
        Math.abs(difficultyValue[b.difficulty] - difficultyValue[targetDifficulty]),
    )[0]
  );
}

function VisualStimulusCard({ stimulus }: { stimulus: VisualStimulus }) {
  return (
    <figure className={`visual-stimulus ${stimulus.kind}`}>
      <div className="visual-header">
        <span>{stimulus.eyebrow}</span>
        <strong>{stimulus.title}</strong>
      </div>
      <div className="visual-body">
        {stimulus.callout && <div className="visual-callout">{stimulus.callout}</div>}
        <div className="visual-lines">
          {stimulus.points.map((point) => (
            <p key={point}>{point}</p>
          ))}
        </div>
      </div>
      <figcaption>{stimulus.caption}</figcaption>
    </figure>
  );
}

function RadarChart({ scores }: { scores: Record<DomainId, number> }) {
  const axis = Object.keys(domains) as DomainId[];
  const center = 118;
  const radius = 86;
  const points = axis.map((domain, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / axis.length;
    const value = scores[domain] / 100;
    return {
      domain,
      labelX: center + Math.cos(angle) * (radius + 28),
      labelY: center + Math.sin(angle) * (radius + 24),
      axisX: center + Math.cos(angle) * radius,
      axisY: center + Math.sin(angle) * radius,
      pointX: center + Math.cos(angle) * radius * value,
      pointY: center + Math.sin(angle) * radius * value,
    };
  });
  const polygon = points.map((point) => `${point.pointX},${point.pointY}`).join(' ');

  return (
    <svg viewBox="0 0 236 236" role="img" aria-label="Six-domain AI readiness radar graph" className="radar">
      {[0.25, 0.5, 0.75, 1].map((ring) => (
        <polygon
          key={ring}
          points={points
            .map((point) => {
              const angle = Math.atan2(point.axisY - center, point.axisX - center);
              return `${center + Math.cos(angle) * radius * ring},${center + Math.sin(angle) * radius * ring}`;
            })
            .join(' ')}
          className="radar-ring"
        />
      ))}
      {points.map((point) => (
        <line key={point.domain} x1={center} y1={center} x2={point.axisX} y2={point.axisY} className="radar-axis" />
      ))}
      <polygon points={polygon} className="radar-score" />
      {points.map((point) => (
        <circle key={point.domain} cx={point.pointX} cy={point.pointY} r="4" fill={domains[point.domain].color} />
      ))}
      {points.map((point) => (
        <text key={point.domain} x={point.labelX} y={point.labelY} textAnchor="middle" dominantBaseline="middle" className="radar-label">
          {point.domain}
        </text>
      ))}
    </svg>
  );
}

export default function Home() {
  const [step, setStep] = useState<'home' | 'onboarding' | 'premiumOnboarding' | 'executiveOnboarding' | 'assessment' | 'results'>('home');
  const [mode, setMode] = useState<AssessmentMode>('free');
  const [audience, setAudience] = useState<Audience>('general');
  const [functionTrack, setFunctionTrack] = useState<FunctionTrack>('general');
  const [industryTrack, setIndustryTrack] = useState<IndustryTrack>('general');
  const [executiveRole, setExecutiveRole] = useState<ExecutiveRole>('ceo');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [current, setCurrent] = useState<Question>(() => selectNextQuestion([], 'free'));
  const [multiSelected, setMultiSelected] = useState<string[]>([]);
  const [rankOrder, setRankOrder] = useState<string[]>([]);
  const [matchSelections, setMatchSelections] = useState<Record<string, string>>({});
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const activeConfig = modeConfig[mode];
  const progress = Math.min(answers.length + (step === 'assessment' ? 1 : 0), activeConfig.totalQuestions);
  const results = useMemo(() => {
    const domainScores = getDomainScores(answers);
    const overall = Math.round(Object.values(domainScores).reduce((sum, value) => sum + value, 0) / Object.values(domainScores).length);
    const sortedDomains = (Object.keys(domainScores) as DomainId[]).sort((a, b) => domainScores[a] - domainScores[b]);
    const confidence = Math.min(mode === 'executive' ? 96 : mode === 'premium' ? 94 : 88, activeConfig.confidenceBase + answers.length * activeConfig.confidenceStep);
    return { domainScores, overall, level: scoreToLevel(overall), weakest: sortedDomains.slice(0, 2), strongest: sortedDomains.slice(-2).reverse(), confidence };
  }, [activeConfig.confidenceBase, activeConfig.confidenceStep, answers, mode]);

  function startAssessment(nextMode: AssessmentMode) {
    const firstQuestion = selectNextQuestion([], nextMode);
    setMode(nextMode);
    setAnswers([]);
    setCurrent(firstQuestion);
    resetInteractionState(firstQuestion);
    setStep('assessment');
  }

  function resetInteractionState(question: Question) {
    setMultiSelected([]);
    setRankOrder(question.rankItems?.map((item) => item.id) ?? []);
    setMatchSelections({});
    setDraggedIndex(null);
  }

  function submitAnswer(option: Option) {
    const nextAnswers = [...answers, { question: current, option }];
    setAnswers(nextAnswers);
    if (nextAnswers.length >= activeConfig.totalQuestions) {
      setStep('results');
      return;
    }
    const nextQuestion = selectNextQuestion(nextAnswers, mode);
    setCurrent(nextQuestion);
    resetInteractionState(nextQuestion);
  }

  function chooseOption(option: Option) {
    submitAnswer(option);
  }

  function toggleMultiOption(id: string) {
    setMultiSelected((selected) => (selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id]));
  }

  function submitMultiSelect() {
    const score = scoreMultiSelect(current, multiSelected);
    submitAnswer({
      id: multiSelected.join(',') || 'none',
      label: multiSelected.length ? `Selected ${multiSelected.length} options` : 'No options selected',
      score,
      feedback: score >= 90 ? 'Strong multi-select judgment.' : 'Partial signal. Review which criteria are decision-grade and which are distractors.',
    });
  }

  function moveRankItem(from: number, to: number) {
    if (to < 0 || to >= rankOrder.length) return;
    setRankOrder((order) => {
      const nextOrder = [...order];
      const [item] = nextOrder.splice(from, 1);
      nextOrder.splice(to, 0, item);
      return nextOrder;
    });
  }

  function submitRankOrder() {
    const score = scoreOrder(current, rankOrder);
    submitAnswer({
      id: rankOrder.join('>'),
      label: 'Submitted ordered sequence',
      score,
      feedback: score >= 90 ? 'Strong sequencing judgment.' : 'Partial signal. Executive workflows need the right order, not only the right ingredients.',
    });
  }

  function submitMatches() {
    const score = scoreMatches(current, matchSelections);
    submitAnswer({
      id: Object.values(matchSelections).join('|') || 'unmatched',
      label: 'Submitted matching response',
      score,
      feedback: score >= 90 ? 'Strong matching of risk to control.' : 'Partial signal. Revisit which owner, control, or evidence belongs with each risk.',
    });
  }

  const activeLearningCatalog = mode === 'executive' ? executiveLearningCatalog : learningCatalog;

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="New Horizon home">
          <span className="brand-mark">NH</span>
          <span>New Horizon</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#platform">Platform</a>
          <a href="#domains">Domains</a>
          <a href="#results">Results</a>
        </nav>
        <button className="small-button" onClick={() => setStep('onboarding')}>Start</button>
      </header>

      {step === 'home' && (
        <>
          <section id="top" className="hero">
            <div className="hero-copy">
              <p className="eyebrow">AI-powered readiness assessment</p>
              <h1>Discover your AI readiness level.</h1>
              <p className="lede">
                A scenario-based free assessment for general users, students, educators, professionals, and teams.
                Measure how you use, judge, and collaborate with AI.
              </p>
              <div className="hero-actions">
                <button className="primary" onClick={() => setStep('onboarding')}>Start Free Assessment</button>
                <button className="secondary" onClick={() => setStep('premiumOnboarding')}>Start Premium Pilot</button>
                <button className="secondary" onClick={() => setStep('executiveOnboarding')}>Executive Assessment</button>
                <a className="secondary" href="#process">See How It Works</a>
              </div>
            </div>
            <div className="hero-panel" aria-label="Assessment preview">
              <div className="preview-card">
                <span className="status-dot" />
                <p>Live adaptive profile</p>
                <strong>6 domains</strong>
              </div>
              <div className="mini-radar">
                {Object.entries(domains).map(([id, domain], index) => (
                  <span key={id} style={{ '--bar': `${55 + index * 7}%`, '--color': domain.color } as React.CSSProperties}>{id}</span>
                ))}
              </div>
              <div className="preview-question">
                <p>Next best question</p>
                <strong>Can you verify the AI output before acting?</strong>
              </div>
            </div>
          </section>

          <section className="stats" aria-label="MVP scope highlights">
            <div><strong>12</strong><span>free adaptive questions</span></div>
            <div><strong>16</strong><span>premium pilot questions</span></div>
            <div><strong>16</strong><span>executive pilot questions</span></div>
            <div><strong>6</strong><span>AILF domains</span></div>
            <div><strong>360+</strong><span>seeded pilot items</span></div>
          </section>

          <section id="platform" className="section two-column">
            <div>
              <p className="eyebrow">The platform</p>
              <h2>Not a technical exam. Not a personality test.</h2>
              <p>
                New Horizon measures practical AI judgment: how people prompt, verify, protect data, spot risk,
                choose useful work, and collaborate with AI in real situations.
              </p>
            </div>
            <div className="card-grid">
              {[
                ['Scenario first', 'Questions are practical situations, not trivia.'],
                ['Adaptive by evidence', 'The engine changes difficulty and domain focus as answers arrive.'],
                ['Actionable results', 'Scores turn into strengths, gaps, and a learning path.'],
              ].map(([title, body]) => (
                <article className="info-card" key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="process" className="section band">
            <p className="eyebrow">Simple process</p>
            <h2>One clear flow from assessment to action.</h2>
            <div className="steps">
              {[
                ['01', 'Choose your starting point', 'Pick a broad audience type. No deep setup required.'],
                ['02', 'Answer adaptive scenarios', 'The next question responds to your evidence profile.'],
                ['03', 'Get your readiness score', 'Review overall score and six-domain radar profile.'],
                ['04', 'Follow a learning path', 'See practical modules and labs matched to your gaps.'],
              ].map(([num, title, body]) => (
                <article className="step-card" key={num}>
                  <span>{num}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="domains" className="section">
            <p className="eyebrow">AILF framework pack</p>
            <h2>Six domains of AI readiness.</h2>
            <div className="domain-grid">
              {(Object.keys(domains) as DomainId[]).map((id) => (
                <article className="domain-card" key={id} style={{ borderTopColor: domains[id].color }}>
                  <span>{id}</span>
                  <h3>{domains[id].name}</h3>
                </article>
              ))}
            </div>
          </section>

          <section id="results" className="section results-preview">
            <div>
              <p className="eyebrow">Your results</p>
              <h2>Radar profile, gaps, and next steps.</h2>
              <p>
                MVP results are indicative, not certification-grade. They show readiness patterns and recommend
                practical learning actions while collecting evidence for future calibration.
              </p>
              <div className="hero-actions">
                <button className="primary light" onClick={() => setStep('onboarding')}>Try Free Flow</button>
                <button className="secondary invert" onClick={() => setStep('premiumOnboarding')}>Try Premium Pilot</button>
                <button className="secondary invert" onClick={() => setStep('executiveOnboarding')}>Try Executive Pilot</button>
              </div>
            </div>
            <div className="mock-result">
              <RadarChart scores={{ D1: 72, D2: 68, D3: 46, D4: 58, D5: 64, D6: 76 }} />
            </div>
          </section>

          <section className="section premium-section">
            <div>
              <p className="eyebrow">Premium assessment</p>
              <h2>Deeper diagnosis for people who want more than a score.</h2>
              <p>
                The MVP premium pilot adds function and industry context, a longer adaptive run,
                evidence review, precision language, executive pathways, and a richer learning plan.
              </p>
            </div>
            <div className="premium-grid">
              {['Function context', 'Industry scenarios', 'Executive assessment', 'Premium learning plan'].map((item) => (
                <article className="info-card" key={item}>
                  <h3>{item}</h3>
                  <p>Pilot-grade now, designed for calibrated psychometrics after response data is collected.</p>
                </article>
              ))}
            </div>
            <div className="hero-actions">
              <button className="primary" onClick={() => setStep('premiumOnboarding')}>Start Premium Pilot</button>
              <button className="secondary dark" onClick={() => setStep('executiveOnboarding')}>Start Executive Pilot</button>
            </div>
          </section>
        </>
      )}

      {step === 'onboarding' && (
        <section className="workspace">
          <div className="workspace-header">
            <p className="eyebrow">Free assessment</p>
            <h1>Start with a broad profile.</h1>
            <p>No enterprise setup. Choose the option that best describes you today.</p>
          </div>
          <div className="audience-grid" role="radiogroup" aria-label="Audience type">
            {(Object.keys(audienceLabels) as Audience[]).map((id) => (
              <button
                key={id}
                className={audience === id ? 'audience-card selected' : 'audience-card'}
                onClick={() => setAudience(id)}
                role="radio"
                aria-checked={audience === id}
              >
                <strong>{audienceLabels[id]}</strong>
                <span>{id === 'team' ? 'Benchmark readiness with a group lens.' : 'Discover your individual AI readiness.'}</span>
              </button>
            ))}
          </div>
          <div className="workspace-actions">
            <button className="secondary dark" onClick={() => setStep('home')}>Back</button>
            <button className="primary" onClick={() => startAssessment('free')}>Begin 12-Question Assessment</button>
          </div>
        </section>
      )}

      {step === 'premiumOnboarding' && (
        <section className="workspace">
          <div className="workspace-header">
            <p className="eyebrow">Premium assessment pilot</p>
            <h1>Add context for a deeper profile.</h1>
            <p>Premium uses the same AILF spine, then adapts interpretation by function and industry.</p>
          </div>
          <div className="setup-columns">
            <div>
              <h2>Function</h2>
              <div className="choice-grid" role="radiogroup" aria-label="Function track">
                {(Object.keys(functionLabels) as FunctionTrack[]).map((id) => (
                  <button
                    key={id}
                    className={functionTrack === id ? 'choice-card selected' : 'choice-card'}
                    onClick={() => setFunctionTrack(id)}
                    role="radio"
                    aria-checked={functionTrack === id}
                  >
                    {functionLabels[id]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2>Industry</h2>
              <div className="choice-grid" role="radiogroup" aria-label="Industry track">
                {(Object.keys(industryLabels) as IndustryTrack[]).map((id) => (
                  <button
                    key={id}
                    className={industryTrack === id ? 'choice-card selected' : 'choice-card'}
                    onClick={() => setIndustryTrack(id)}
                    role="radio"
                    aria-checked={industryTrack === id}
                  >
                    {industryLabels[id]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="premium-summary">
            <strong>Premium pilot includes</strong>
            <span>16 adaptive questions, function/industry context, evidence summary, domain radar, skill-gap signals, and a premium learning path.</span>
          </div>
          <div className="workspace-actions">
            <button className="secondary dark" onClick={() => setStep('home')}>Back</button>
            <button className="primary" onClick={() => startAssessment('premium')}>Begin Premium Diagnostic</button>
          </div>
        </section>
      )}

      {step === 'executiveOnboarding' && (
        <section className="workspace">
          <div className="workspace-header">
            <p className="eyebrow">Executive assessment pilot</p>
            <h1>Board-level AI readiness.</h1>
            <p>Executive mode draws from the multimodal question bank and weights strategy, governance, and change leadership.</p>
          </div>
          <div className="setup-columns single">
            <div>
              <h2>Executive role</h2>
              <div className="choice-grid executive-grid" role="radiogroup" aria-label="Executive role">
                {(Object.keys(executiveLabels) as ExecutiveRole[]).map((id) => (
                  <button
                    key={id}
                    className={executiveRole === id ? 'choice-card selected' : 'choice-card'}
                    onClick={() => setExecutiveRole(id)}
                    role="radio"
                    aria-checked={executiveRole === id}
                  >
                    {executiveLabels[id]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="premium-summary">
            <strong>Executive pilot includes</strong>
            <span>16 adaptive questions from the executive multimodal bank, chart/report visuals, multi-select, drag-order, matching, narrative judgment, radar graph, and personalized executive learning path.</span>
          </div>
          <div className="workspace-actions">
            <button className="secondary dark" onClick={() => setStep('home')}>Back</button>
            <button className="primary" onClick={() => startAssessment('executive')}>Begin Executive Assessment</button>
          </div>
        </section>
      )}

      {step === 'assessment' && current && (
        <section className="assessment-shell">
          <div className="assessment-top">
            <div>
              <p className="eyebrow">{activeConfig.label}</p>
              <h1>{domains[current.domain].short}</h1>
            </div>
            <div className="progress-block">
              <span>Question {progress} of {activeConfig.totalQuestions}</span>
              <div className="progress-track"><span style={{ width: `${(progress / activeConfig.totalQuestions) * 100}%` }} /></div>
            </div>
          </div>
          <article className="question-card">
            <div className="question-meta">
              <span>{current.domain}</span>
              <span>{current.difficulty}</span>
              <span>{current.type}</span>
            </div>
            {current.stimulus && (
              <figure className="stimulus-card">
                <div className="stimulus-label">{current.stimulus.label}</div>
                <Image src={current.stimulus.src} alt={current.stimulus.alt} width={1680} height={945} />
                <figcaption>{current.stimulus.caption}</figcaption>
              </figure>
            )}
            {current.visualStimulus && <VisualStimulusCard stimulus={current.visualStimulus} />}
            <p className="context">{current.context}</p>
            <h2>{current.prompt}</h2>
            {(current.interaction ?? 'single') === 'single' && (
              <div className="options">
                {current.options.map((option) => (
                  <button key={option.id} onClick={() => chooseOption(option)}>
                    <span>{option.id.toUpperCase()}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            )}
            {current.interaction === 'multi' && (
              <div className="interaction-panel">
                <div className="options multi-options">
                  {current.options.map((option) => (
                    <button
                      key={option.id}
                      className={multiSelected.includes(option.id) ? 'selected' : ''}
                      onClick={() => toggleMultiOption(option.id)}
                      aria-pressed={multiSelected.includes(option.id)}
                    >
                      <span>{option.id.toUpperCase()}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
                <button className="primary submit-answer" onClick={submitMultiSelect}>Submit Selected Answers</button>
              </div>
            )}
            {current.interaction === 'rank' && (
              <div className="interaction-panel">
                <div className="rank-list" aria-label="Drag-order response">
                  {rankOrder.map((itemId, index) => {
                    const item = current.rankItems?.find((rankItem) => rankItem.id === itemId);
                    return (
                      <div
                        className="rank-item"
                        draggable
                        key={itemId}
                        onDragStart={() => setDraggedIndex(index)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => {
                          if (draggedIndex !== null) moveRankItem(draggedIndex, index);
                        }}
                      >
                        <span>{index + 1}</span>
                        <strong>{item?.label}</strong>
                        <div>
                          <button onClick={() => moveRankItem(index, index - 1)} aria-label={`Move ${item?.label} up`}>Up</button>
                          <button onClick={() => moveRankItem(index, index + 1)} aria-label={`Move ${item?.label} down`}>Down</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button className="primary submit-answer" onClick={submitRankOrder}>Submit Order</button>
              </div>
            )}
            {current.interaction === 'match' && (
              <div className="interaction-panel">
                <div className="match-list">
                  {current.matchPairs?.map((pair) => (
                    <label className="match-row" key={pair.id}>
                      <span>{pair.left}</span>
                      <select
                        value={matchSelections[pair.id] ?? ''}
                        onChange={(event) => setMatchSelections((selections) => ({ ...selections, [pair.id]: event.target.value }))}
                      >
                        <option value="">Choose match</option>
                        {pair.choices.map((choice) => (
                          <option key={choice} value={choice}>{choice}</option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
                <button className="primary submit-answer" onClick={submitMatches}>Submit Matches</button>
              </div>
            )}
          </article>
        </section>
      )}

      {step === 'results' && (
        <section className="results-shell">
          <div className="results-hero">
            <div>
              <p className="eyebrow">{mode === 'executive' ? 'Executive assessment pilot' : mode === 'premium' ? 'Premium diagnostic pilot' : 'Indicative MVP result'}</p>
              <h1>{results.overall}</h1>
              <p className="result-level">{results.level} AI readiness</p>
              <p>
                Based on {answers.length} adaptive responses for {mode === 'executive' ? executiveLabels[executiveRole].toLowerCase() : audienceLabels[audience].toLowerCase()}.
                Confidence is pilot-grade: {results.confidence}%.
              </p>
              {mode === 'premium' && (
                <p className="context-line">
                  Context: {functionLabels[functionTrack]} in {industryLabels[industryTrack].toLowerCase()}.
                </p>
              )}
              {mode === 'executive' && (
                <p className="context-line">
                  Context: {executiveLabels[executiveRole]} profile, weighted toward D5 strategy, D4 governance, and D6 change leadership.
                </p>
              )}
            </div>
            <RadarChart scores={results.domainScores} />
          </div>
          <div className="result-grid">
            <article className="result-card">
              <h2>Strengths</h2>
              {results.strongest.map((domain) => (
                <p key={domain}><strong>{domains[domain].short}</strong> {results.domainScores[domain]}/100</p>
              ))}
            </article>
            <article className="result-card">
              <h2>Priority gaps</h2>
              {results.weakest.map((domain) => (
                <p key={domain}><strong>{domains[domain].short}</strong> {results.domainScores[domain]}/100</p>
              ))}
            </article>
            <article className="result-card wide">
              <h2>{mode === 'executive' ? 'Executive learning path' : mode === 'premium' ? 'Premium learning path' : 'Recommended learning path'}</h2>
              <div className="learning-list">
                {results.weakest.map((domain) => (
                  <div key={domain}>
                    <span>{activeLearningCatalog[domain].format}</span>
                    <strong>{activeLearningCatalog[domain].title}</strong>
                    <p>{activeLearningCatalog[domain].detail}</p>
                  </div>
                ))}
              </div>
            </article>
            {(mode === 'premium' || mode === 'executive') && (
              <article className="result-card wide">
                <h2>Evidence summary</h2>
                <div className="evidence-grid">
                  <p><strong>Adaptive coverage</strong> {mode === 'executive' ? 'Executive-weighted D5/D4/D6 coverage plus D1-D3 calibration checks.' : 'D1-D6 sampled with extra attention to low-confidence domains.'}</p>
                  <p><strong>Scenario context</strong> {mode === 'executive' ? `Recommendations tuned for ${executiveLabels[executiveRole].toLowerCase()} oversight decisions.` : `Recommendations tuned for ${functionLabels[functionTrack].toLowerCase()} and ${industryLabels[industryTrack].toLowerCase()}.`}</p>
                  <p><strong>Validation status</strong> Pilot-grade estimate. Full IRT calibration requires response data.</p>
                </div>
              </article>
            )}
          </div>
          <div className="upgrade-panel">
            <div>
              <h2>Ready for a deeper profile?</h2>
              <p>Unlock skill-level analysis, role context, multimodal review, and premium diagnostic continuation.</p>
            </div>
            <div className="hero-actions">
              <button className="primary" onClick={() => startAssessment(mode)}>Retake {mode === 'executive' ? 'Executive' : mode === 'premium' ? 'Premium' : 'Free'} Assessment</button>
              {mode === 'free' && <button className="secondary dark" onClick={() => setStep('premiumOnboarding')}>Start Premium Pilot</button>}
              {mode === 'premium' && <button className="secondary dark" onClick={() => setStep('onboarding')}>Try Free Version</button>}
              {mode !== 'executive' && <button className="secondary dark" onClick={() => setStep('executiveOnboarding')}>Try Executive Pilot</button>}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
