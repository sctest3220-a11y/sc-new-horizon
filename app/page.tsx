'use client';

import { useMemo, useState } from 'react';

type DomainId = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6';
type Audience = 'general' | 'student' | 'educator' | 'professional' | 'team';
type Difficulty = 'awareness' | 'applied' | 'proficient';
type AssessmentMode = 'free' | 'premium';
type FunctionTrack = 'general' | 'people' | 'finance' | 'marketing' | 'technical' | 'operations';
type IndustryTrack = 'general' | 'education' | 'financial' | 'healthcare' | 'retail' | 'public';

type Option = { id: string; label: string; score: number; feedback: string };
type Question = {
  id: string;
  domain: DomainId;
  difficulty: Difficulty;
  type: 'scenario' | 'media' | 'judgment';
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

const learningCatalog: Record<DomainId, { title: string; detail: string; format: string }> = {
  D1: { title: 'AI concepts in plain language', detail: 'Build a reliable mental model of LLMs, retrieval, hallucination, and model limits.', format: '45 min module' },
  D2: { title: 'Prompting and workflow lab', detail: 'Practice reusable prompt patterns, review checklists, and human-in-the-loop design.', format: '60 min lab' },
  D3: { title: 'Verification and synthetic media sprint', detail: 'Learn source triangulation, image-caption checks, citation review, and confidence calibration.', format: '75 min simulation' },
  D4: { title: 'Responsible AI guardrails', detail: 'Apply privacy, fairness, security, and governance controls to common workplace scenarios.', format: '50 min playbook' },
  D5: { title: 'AI value and use-case prioritization', detail: 'Turn AI ideas into measurable pilots with baseline metrics, risk review, and ROI evidence.', format: '40 min workshop' },
  D6: { title: 'Human-AI collaboration routines', detail: 'Design review rituals, escalation paths, role clarity, and team learning loops.', format: '55 min module' },
};

const difficultyValue: Record<Difficulty, number> = { awareness: 0, applied: 1, proficient: 2 };
const modeConfig: Record<AssessmentMode, { label: string; totalQuestions: number; confidenceBase: number; confidenceStep: number }> = {
  free: { label: 'Adaptive free assessment', totalQuestions: 12, confidenceBase: 38, confidenceStep: 4 },
  premium: { label: 'Premium diagnostic pilot', totalQuestions: 16, confidenceBase: 48, confidenceStep: 3 },
};

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

function selectNextQuestion(answers: Answer[]) {
  const answered = new Set(answers.map((answer) => answer.question.id));
  const scores = getDomainScores(answers);
  const counts = emptyDomainScores();
  answers.forEach(({ question }) => {
    counts[question.domain].count += 1;
  });
  const weakestDomain = (Object.keys(domains) as DomainId[]).sort(
    (a, b) => counts[a].count - counts[b].count || scores[a] - scores[b],
  )[0];
  const overall = answers.length ? answers.reduce((sum, answer) => sum + answer.option.score, 0) / answers.length : 62;
  const targetDifficulty: Difficulty = overall >= 78 ? 'proficient' : overall >= 55 ? 'applied' : 'awareness';
  const candidates = questionBank.filter((question) => !answered.has(question.id));
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
  const [step, setStep] = useState<'home' | 'onboarding' | 'premiumOnboarding' | 'assessment' | 'results'>('home');
  const [mode, setMode] = useState<AssessmentMode>('free');
  const [audience, setAudience] = useState<Audience>('general');
  const [functionTrack, setFunctionTrack] = useState<FunctionTrack>('general');
  const [industryTrack, setIndustryTrack] = useState<IndustryTrack>('general');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [current, setCurrent] = useState<Question>(() => selectNextQuestion([]));

  const activeConfig = modeConfig[mode];
  const progress = Math.min(answers.length + (step === 'assessment' ? 1 : 0), activeConfig.totalQuestions);
  const results = useMemo(() => {
    const domainScores = getDomainScores(answers);
    const overall = Math.round(Object.values(domainScores).reduce((sum, value) => sum + value, 0) / Object.values(domainScores).length);
    const sortedDomains = (Object.keys(domainScores) as DomainId[]).sort((a, b) => domainScores[a] - domainScores[b]);
    const confidence = Math.min(mode === 'premium' ? 94 : 88, activeConfig.confidenceBase + answers.length * activeConfig.confidenceStep);
    return { domainScores, overall, level: scoreToLevel(overall), weakest: sortedDomains.slice(0, 2), strongest: sortedDomains.slice(-2).reverse(), confidence };
  }, [activeConfig.confidenceBase, activeConfig.confidenceStep, answers, mode]);

  function startAssessment(nextMode: AssessmentMode) {
    setMode(nextMode);
    setAnswers([]);
    setCurrent(selectNextQuestion([]));
    setStep('assessment');
  }

  function chooseOption(option: Option) {
    const nextAnswers = [...answers, { question: current, option }];
    setAnswers(nextAnswers);
    if (nextAnswers.length >= activeConfig.totalQuestions) {
      setStep('results');
      return;
    }
    setCurrent(selectNextQuestion(nextAnswers));
  }

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
                evidence review, precision language, and a richer learning plan.
              </p>
            </div>
            <div className="premium-grid">
              {['Function context', 'Industry scenarios', 'Skill-level gap signals', 'Premium learning plan'].map((item) => (
                <article className="info-card" key={item}>
                  <h3>{item}</h3>
                  <p>Pilot-grade now, designed for calibrated psychometrics after response data is collected.</p>
                </article>
              ))}
            </div>
            <button className="primary" onClick={() => setStep('premiumOnboarding')}>Start Premium Pilot</button>
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
            <p className="context">{current.context}</p>
            <h2>{current.prompt}</h2>
            <div className="options">
              {current.options.map((option) => (
                <button key={option.id} onClick={() => chooseOption(option)}>
                  <span>{option.id.toUpperCase()}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </article>
        </section>
      )}

      {step === 'results' && (
        <section className="results-shell">
          <div className="results-hero">
            <div>
              <p className="eyebrow">{mode === 'premium' ? 'Premium diagnostic pilot' : 'Indicative MVP result'}</p>
              <h1>{results.overall}</h1>
              <p className="result-level">{results.level} AI readiness</p>
              <p>
                Based on {answers.length} adaptive responses for {audienceLabels[audience].toLowerCase()}.
                Confidence is pilot-grade: {results.confidence}%.
              </p>
              {mode === 'premium' && (
                <p className="context-line">
                  Context: {functionLabels[functionTrack]} in {industryLabels[industryTrack].toLowerCase()}.
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
              <h2>{mode === 'premium' ? 'Premium learning path' : 'Recommended learning path'}</h2>
              <div className="learning-list">
                {results.weakest.map((domain) => (
                  <div key={domain}>
                    <span>{learningCatalog[domain].format}</span>
                    <strong>{learningCatalog[domain].title}</strong>
                    <p>{learningCatalog[domain].detail}</p>
                  </div>
                ))}
              </div>
            </article>
            {mode === 'premium' && (
              <article className="result-card wide">
                <h2>Evidence summary</h2>
                <div className="evidence-grid">
                  <p><strong>Adaptive coverage</strong> D1-D6 sampled with extra attention to low-confidence domains.</p>
                  <p><strong>Scenario context</strong> Recommendations tuned for {functionLabels[functionTrack].toLowerCase()} and {industryLabels[industryTrack].toLowerCase()}.</p>
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
              <button className="primary" onClick={() => startAssessment(mode)}>Retake {mode === 'premium' ? 'Premium' : 'Free'} Assessment</button>
              {mode === 'free' && <button className="secondary dark" onClick={() => setStep('premiumOnboarding')}>Start Premium Pilot</button>}
              {mode === 'premium' && <button className="secondary dark" onClick={() => setStep('onboarding')}>Try Free Version</button>}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
