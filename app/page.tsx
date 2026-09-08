'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type DomainId = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6';
type Audience = 'general' | 'student' | 'educator' | 'professional' | 'team';
type Difficulty = 'awareness' | 'applied' | 'proficient' | 'advanced';
type AssessmentMode = 'free' | 'premium' | 'executive' | 'practice';
type FunctionTrack = 'general' | 'people' | 'finance' | 'marketing' | 'sales' | 'customerService' | 'technical' | 'operations';
type IndustryTrack = 'general' | 'education' | 'financial' | 'healthcare' | 'retail' | 'public';
type ExecutiveRole = 'ceo' | 'board' | 'people' | 'finance' | 'technology' | 'transformation';
type EvidenceMode = 'knowing' | 'doing' | 'hybrid';
type NewsFrequency = 'daily' | 'weekly' | 'monthly';
type LandingLeaderboardPeriod = 'day' | 'week';
type MicroProfilePulse = {
  id: string;
  title: string;
  prompt: string;
  options: Array<{ id: string; label: string; tag: string; competencyIds: string[] }>;
};
type DidYouKnowInsight = {
  id: string;
  domain: DomainId;
  topic: string;
  fact: string;
  whyItMatters: string;
  learnAction: 'news' | 'labs' | 'premium' | 'free';
  competencyIds: string[];
};
type ContinuationFocus = {
  kind: 'confidence' | 'priority' | 'domain';
  label: string;
  targetDomain?: DomainId;
  targetCompetencyIds?: string[];
};
type ContinuationRecommendation = {
  kicker: string;
  headline: string;
  summary: string;
  reasons: string[];
  route: ContinuationFocus;
  questionCount: number;
  targetLabels: string[];
  confidenceLabel: string;
  urgency: 'recommended' | 'optional';
};
type SurveyQuestion = {
  id: string;
  label: string;
  options: string[];
  multi?: boolean;
};
type UserProfileSurvey = {
  updatedAt: string;
  context: string;
  answers: Record<string, string[]>;
  tags: string[];
};
type AuthProfile = {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  provider?: string;
  providerId?: string;
  accessToken?: string;
};
type QuestionSignalSnapshot = {
  questionId: string;
  domain: DomainId;
  secondaryDomains?: DomainId[];
  competencyIds: string[];
  skillIds: string[];
  difficulty: Difficulty;
  type: Question['type'];
  interaction: Question['interaction'];
  evidenceMode: EvidenceMode;
  score: number;
  optionId: string;
  optionLabel?: string;
  correctOptionIds?: string[];
  rubricHitIds?: string[];
  partScores?: Array<{ partId: string; domain: DomainId; score: number }>;
  textResponseLength?: number;
  durationMs?: number;
  interactionCount?: number;
  revisionCount?: number;
  hesitation?: QuestionBehaviorSnapshot['hesitation'];
};
type AssessmentFeedbackSurvey = {
  id: string;
  sessionId: string;
  profileId: string;
  createdAt: string;
  groupKey: string;
  clarity: 'clear' | 'mixed' | 'confusing';
  difficultyFit: 'too-easy' | 'right' | 'too-hard';
  artifactQuality: 'realistic' | 'mixed' | 'poor';
  lengthFit: 'short' | 'right' | 'long';
  suggestions: string;
};
type ProfileSignalLogEntry = {
  id: string;
  profileId: string;
  userId?: string;
  userEmail?: string;
  createdAt: string;
  groupKey: string;
  groupLabel: string;
  mode: AssessmentMode;
  audience: Audience;
  functionTrack?: FunctionTrack;
  industryTrack?: IndustryTrack;
  executiveRole?: ExecutiveRole;
  surveyContext?: string;
  profileTags: string[];
  surveyAnswers?: Record<string, string[]>;
  questionSignals: QuestionSignalSnapshot[];
  domainScores: Record<DomainId, number>;
  competencyScores: Record<string, { score: number; evidenceCount: number }>;
  evidenceModeScores: Record<EvidenceMode, { score: number; count: number }>;
  overall: number;
};
type PracticeActivity = {
  title: string;
  domain: DomainId;
  format: string;
  detail: string;
  questionId: string;
  labKind: LabKind;
};
type LabKind = 'ownership' | 'proof' | 'next' | 'prompt' | 'media' | 'workflow' | 'trust';
type LabArtifact = {
  title: string;
  rows: string[];
  note?: string;
};
type LabConfig = {
  kind: LabKind;
  title: string;
  domain: DomainId;
  format: string;
  brief: string;
  artifact: LabArtifact;
  prompt?: string;
  choices?: Array<{ id: string; label: string; correct?: boolean }>;
  items?: Array<{ id: string; label: string; correct: string }>;
  matchChoices?: string[];
  idealOrder?: string[];
  checklist?: string[];
};

type Option = { id: string; label: string; score: number; feedback: string };
type RubricCriterion = { id: string; label: string; keywords: string[]; points: number };
type VisualStimulus = {
  kind: 'dashboard' | 'report' | 'post' | 'portfolio' | 'risk' | 'memo';
  title: string;
  eyebrow: string;
  caption: string;
  points: string[];
  callout?: string;
  flags?: string[];
  chartBars?: Array<{ label: string; value: number; note?: string }>;
  metrics?: Array<{ label: string; value: string; status?: 'good' | 'warn' | 'bad' }>;
};
type RankItem = { id: string; label: string };
type MatchPair = { id: string; left: string; correct: string; choices: string[] };
type QuestionPart = {
  id: string;
  domain: DomainId;
  prompt: string;
  correctOptionId: string;
  options: Option[];
};
type BenchmarkProfile = {
  label: string;
  detail: string;
  tone: 'group' | 'target' | 'peer' | 'role' | 'industry';
  scores: Record<DomainId, number>;
};
type Question = {
  id: string;
  domain: DomainId;
  secondaryDomains?: DomainId[];
  difficulty: Difficulty;
  type: 'scenario' | 'media' | 'judgment' | 'multi-select' | 'drag-order' | 'matching' | 'report-review' | 'narrative' | 'fraud-detection' | 'reliance-decision' | 'concept-cluster';
  interaction?: 'single' | 'multi' | 'rank' | 'match' | 'text' | 'parts';
  competencyIds?: string[];
  skillIds?: string[];
  evidenceMode?: EvidenceMode;
  functionTracks?: FunctionTrack[];
  industryTracks?: IndustryTrack[];
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
  parts?: QuestionPart[];
  rubricCriteria?: RubricCriterion[];
  exemplarAnswer?: string;
  prompt: string;
  context: string;
  options: Option[];
};
type Answer = {
  question: Question;
  option: Option;
  textResponse?: string;
  rubricHits?: RubricCriterion[];
  partSelections?: Record<string, string>;
  partScores?: Array<{ partId: string; domain: DomainId; score: number }>;
  behavior?: QuestionBehaviorSnapshot;
};
type QuestionBehaviorSnapshot = {
  startedAt: string;
  answeredAt: string;
  durationMs: number;
  interactionCount: number;
  revisionCount: number;
  hesitation: 'fast-clear' | 'clear' | 'slow' | 'confusing';
};
type AssessmentBehaviorEvent = {
  id: string;
  createdAt: string;
  profileId: string;
  sessionId: string;
  type: 'assessment_started' | 'question_shown' | 'question_answered' | 'assessment_abandoned' | 'mandatory_completed' | 'continuation_accepted' | 'continuation_declined' | 'results_viewed' | 'report_interest' | 'assessment_feedback_submitted' | 'artifact_opened' | 'artifact_zoomed' | 'artifact_external_opened';
  mode: AssessmentMode;
  audience?: Audience;
  functionTrack?: FunctionTrack;
  industryTrack?: IndustryTrack;
  executiveRole?: ExecutiveRole;
  questionId?: string;
  domain?: DomainId;
  competencyIds?: string[];
  difficulty?: Difficulty;
  interaction?: Question['interaction'];
  durationMs?: number;
  interactionCount?: number;
  revisionCount?: number;
  hesitation?: QuestionBehaviorSnapshot['hesitation'];
  answeredCount?: number;
  requiredCount?: number;
  targetCount?: number;
  continuationKind?: ContinuationFocus['kind'] | 'declined';
  reportArea?: 'radar' | 'domain' | 'competency' | 'course' | 'tool' | 'coverage' | 'continuation';
  label?: string;
  score?: number;
  selectedOptionId?: string;
  selectedAnswer?: string;
  correctOptionIds?: string[];
  artifactSrc?: string;
  artifactAction?: 'reader' | 'zoom' | 'external';
  zoomLevel?: number;
};
type ScoreLogEntry = {
  id: string;
  createdAt: string;
  userId?: string;
  userEmail?: string;
  groupKey: string;
  groupLabel: string;
  mode: AssessmentMode;
  audience?: Audience;
  functionTrack?: FunctionTrack;
  industryTrack?: IndustryTrack;
  executiveRole?: ExecutiveRole;
  scores: Record<DomainId, number>;
  competencyScores?: Record<string, { score: number; evidenceCount: number }>;
  evidenceModeScores?: Record<EvidenceMode, { score: number; count: number }>;
  overall: number;
};
type LandingLeaderboardRow = {
  id: string;
  rank: number;
  displayName: string;
  groupLabel: string;
  overall: number;
  strongestDomain: DomainId;
  createdAt: string;
  source: 'local' | 'demo';
};
type CompetencyDefinition = { id: string; domain: DomainId; label: string; skills: string[] };
type EvidenceSignal = { domain: DomainId; competencyId: string; score: number; mode: EvidenceMode };
type CompetencyScore = CompetencyDefinition & { score: number; evidenceCount: number; confidence: string };
type CompetencyCoverage = CompetencyScore & {
  planned: boolean;
  priority: boolean;
  status: 'sampled' | 'priority-gap' | 'planned-gap' | 'optional-gap';
  statusLabel: string;
  rationale: string;
};
type LearningRecommendation = {
  id: string;
  title: string;
  provider: string;
  url: string;
  domains: DomainId[];
  skills: string[];
  format: string;
  level: 'Starter' | 'Applied' | 'Advanced' | 'Executive';
  price: string;
  fit: string;
};
type PersonalizedExplorationPlan = {
  tools: string[];
  concepts: string[];
  practice: string[];
};
type GeneratedReport = {
  headline: string;
  summary: string;
  analysis: string[];
  priorityDomains: Array<{ domain: DomainId; title: string; score: number; target: number; action: string }>;
  competencyFocus: Array<{ id: string; label: string; score: number; evidenceCount: number; skills: string[] }>;
  learningPath: string[];
  tools: string[];
  courses: LearningRecommendation[];
  productionNote: string;
};
type AgentStatus = 'idle' | 'running' | 'review' | 'blocked' | 'complete';
type AgentDefinition = {
  id: string;
  name: string;
  role: string;
  cadence: string;
  guardrail: string;
};
type AgentActivity = {
  step: number;
  agent: string;
  status: AgentStatus;
  activity: string;
  output: string;
};
type AgentDraftStatus = 'pending' | 'approved' | 'rejected';
type AgentDraftKind = 'question' | 'artifact' | 'profile' | 'survey' | 'feedback' | 'learning' | 'news';
type AgentDraftProposal = {
  id: string;
  kind: AgentDraftKind;
  title: string;
  summary: string;
  rationale: string;
  status: AgentDraftStatus;
  sourceSignals: string[];
  ownerAgent: string;
};
type SupervisedAgentRun = {
  id: string;
  createdAt: string;
  status: 'review' | 'complete';
  headline: string;
  summary: string;
  activityLog: AgentActivity[];
  drafts: AgentDraftProposal[];
  safetyEvents: string[];
};
type AgentWorkflowReport = {
  generatedAt: string;
  runId: string;
  headline: string;
  summary: string;
  agents: Array<AgentDefinition & { status: AgentStatus; outputCount: number }>;
  activityLog: AgentActivity[];
  safetyEvents: string[];
  outputs: string[];
  recommendations: string[];
  productionNote: string;
};
type DeveloperReportDemo = {
  profile: string;
  generatedAt: string;
  overall: number;
  level: string;
  confidence: number;
  scores: Record<DomainId, number>;
  benchmarks: BenchmarkProfile[];
  interpretation: string[];
  strengths: string[];
  gaps: string[];
  learningPath: Array<{ phase: string; title: string; actions: string[] }>;
  courses: Array<{ title: string; provider: string; url: string; fit: string; domains: DomainId[] }>;
  tools: Array<{ category: string; items: string[] }>;
  projects: string[];
};

let fallbackAssessmentSeed = 1000;

function createAssessmentSeed() {
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0];
  }
  fallbackAssessmentSeed += 1;
  return fallbackAssessmentSeed;
}

function createLocalProfileId() {
  return `profile-${createAssessmentSeed().toString(36)}`;
}

function parseUserProfileSurvey(value: string | null): UserProfileSurvey | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as UserProfileSurvey;
  } catch {
    return null;
  }
}

function parseProfileSignalLog(raw: string | null): ProfileSignalLogEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is ProfileSignalLogEntry => Boolean(entry?.id && entry?.profileId && entry?.questionSignals));
  } catch {
    return [];
  }
}

function readLocalStorage(key: string) {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocalStorage(key: string, value: string) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage may be unavailable in embedded or privacy-restricted browser contexts.
  }
}

function getOrCreateLocalProfileId() {
  const existing = readLocalStorage(profileIdStorageKey);
  if (existing) return existing;
  const nextProfileId = createLocalProfileId();
  writeLocalStorage(profileIdStorageKey, nextProfileId);
  return nextProfileId;
}

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
  marketing: 'Marketing',
  sales: 'Sales',
  customerService: 'Customer Service',
  technical: 'Engineering & Data',
  operations: 'Operations',
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

const userProfileStorageKey = 'new-horizon-user-profile-v1';

const broadSurveyQuestions: SurveyQuestion[] = [
  {
    id: 'llm-tools',
    label: 'Which AI tools do you use most often?',
    options: ['ChatGPT', 'Claude', 'Gemini', 'Copilot', 'Perplexity', 'Canva AI', 'I rarely use AI tools'],
    multi: true,
  },
  {
    id: 'usage-frequency',
    label: 'How often do you use AI in a typical week?',
    options: ['Daily', 'Several times a week', 'A few times a month', 'Rarely', 'Not yet'],
  },
  {
    id: 'work-type',
    label: 'What do you most want AI to help with?',
    options: ['Writing and summarizing', 'Research and fact checking', 'Data or reports', 'Images and media', 'Workflows and automation', 'Learning and study'],
    multi: true,
  },
  {
    id: 'peer-tool-awareness',
    label: 'People with similar goals often use these tools. Which ones do you know or want to learn?',
    options: ['Perplexity for sourced research', 'NotebookLM for documents', 'Canva AI for visuals', 'ChatGPT projects/GPTs', 'Automation tools like Zapier', 'I want recommendations'],
    multi: true,
  },
  {
    id: 'learning-interest',
    label: 'What would you be interested to learn next?',
    options: ['Better prompting', 'Checking AI answers', 'Using AI with files', 'Spotting fake media', 'Building simple workflows', 'Choosing the right AI tool'],
    multi: true,
  },
];

const functionSurveyQuestions: Record<FunctionTrack, SurveyQuestion[]> = {
  general: broadSurveyQuestions,
  technical: [
    {
      id: 'developer-environment',
      label: 'Which development environments do you use?',
      options: ['VS Code', 'Cursor', 'JetBrains IDE', 'Xcode', 'Terminal / CLI', 'GitHub Codespaces', 'Notebook environment'],
      multi: true,
    },
    {
      id: 'developer-ai-tools',
      label: 'Which AI coding tools or model surfaces do you use?',
      options: ['GitHub Copilot', 'ChatGPT', 'Claude Code', 'Cursor Agent', 'OpenAI API', 'Hugging Face', 'Local models'],
      multi: true,
    },
    {
      id: 'developer-repo-work',
      label: 'What kind of AI-related repo work do you do?',
      options: ['Prompt/app integration', 'RAG/search', 'Agents/workflows', 'Model evaluation', 'Data pipelines', 'Security review', 'I do not work with AI repos yet'],
      multi: true,
    },
    {
      id: 'developer-peer-tools',
      label: 'Developers in similar profiles often use these. Which do you know or want to try?',
      options: ['Cursor or Windsurf agents', 'GitHub Copilot Workspace', 'LangChain or LlamaIndex', 'OpenAI Agents SDK', 'Hugging Face Spaces', 'MCP connectors', 'I want a tool map'],
      multi: true,
    },
    {
      id: 'developer-learning-interest',
      label: 'Which technical AI capability are you interested to build next?',
      options: ['RAG app', 'Agent workflow', 'Eval harness', 'Model deployment', 'Prompt library', 'AI security review'],
      multi: true,
    },
  ],
  marketing: [
    {
      id: 'marketing-tools',
      label: 'Which marketing AI tools do you use?',
      options: ['ChatGPT', 'Canva AI', 'Adobe Firefly', 'HubSpot AI', 'Meta/Google ad tools', 'Analytics dashboards', 'None yet'],
      multi: true,
    },
    {
      id: 'marketing-workflows',
      label: 'Where do you use AI most?',
      options: ['Campaign ideas', 'Copy drafts', 'Creative variants', 'Audience research', 'SEO/content', 'Performance analysis'],
      multi: true,
    },
    {
      id: 'marketing-risk',
      label: 'What is your biggest AI concern?',
      options: ['Brand voice', 'Incorrect claims', 'Copyright/IP', 'Synthetic media trust', 'Bias in targeting', 'Measurement quality'],
    },
    {
      id: 'marketing-peer-tools',
      label: 'Marketing teams like yours often use these. Which do you know or want to learn?',
      options: ['Jasper or Copy.ai', 'Adobe Firefly', 'Midjourney', 'HubSpot AI', 'Canva brand kits', 'Perplexity for market scans', 'I want practical examples'],
      multi: true,
    },
  ],
  sales: [
    {
      id: 'sales-tools',
      label: 'Which sales systems do you use with AI?',
      options: ['CRM', 'Email assistant', 'Call summary tool', 'LinkedIn/social selling', 'Proposal generator', 'Forecasting dashboard', 'None yet'],
      multi: true,
    },
    {
      id: 'sales-workflows',
      label: 'Where should AI help your sales work?',
      options: ['Lead research', 'Account planning', 'Email drafting', 'Objection handling', 'Proposal/RFP support', 'Pipeline forecasting'],
      multi: true,
    },
    {
      id: 'sales-risk',
      label: 'What must AI avoid in sales work?',
      options: ['Inventing customer facts', 'Overpromising', 'Using confidential data', 'Wrong pricing', 'Poor personalization', 'Weak handoff to humans'],
    },
    {
      id: 'sales-peer-tools',
      label: 'Sales teams with similar needs often use these. Which do you know or want to learn?',
      options: ['HubSpot AI', 'Salesforce Einstein', 'Gong or call intelligence', 'LinkedIn Sales Navigator AI', 'Clay or enrichment tools', 'Proposal automation', 'I want recommendations'],
      multi: true,
    },
  ],
  customerService: [
    {
      id: 'service-tools',
      label: 'Which support tools do you use?',
      options: ['Zendesk/Freshdesk', 'Intercom', 'CRM case notes', 'Chatbot', 'Knowledge base', 'Call transcript tools', 'None yet'],
      multi: true,
    },
    {
      id: 'service-workflows',
      label: 'Where should AI help customer service?',
      options: ['Ticket triage', 'Suggested replies', 'Policy lookup', 'Complaint escalation', 'Call summaries', 'Quality assurance'],
      multi: true,
    },
    {
      id: 'service-risk',
      label: 'Which service risk worries you most?',
      options: ['Wrong policy answer', 'Insensitive tone', 'Privacy leakage', 'Missing escalation', 'Refund/credit mistakes', 'Hallucinated case history'],
    },
    {
      id: 'service-peer-tools',
      label: 'Support teams with similar work often use these. Which do you know or want to learn?',
      options: ['Zendesk AI', 'Intercom Fin', 'Freshdesk Freddy AI', 'Botnoi chatbot', 'Knowledge-base search/RAG', 'QA scorecards', 'I want workflow examples'],
      multi: true,
    },
  ],
  people: [
    {
      id: 'people-tools',
      label: 'Which HR/people workflows use AI?',
      options: ['Job descriptions', 'Candidate screening', 'Interview notes', 'Learning paths', 'Policy Q&A', 'Engagement analysis', 'None yet'],
      multi: true,
    },
    {
      id: 'people-risk',
      label: 'What is your biggest people-risk concern?',
      options: ['Bias/fairness', 'Privacy', 'Legal compliance', 'Manager overreliance', 'Poor transparency', 'Employee trust'],
    },
    {
      id: 'people-data',
      label: 'What data should AI handle carefully?',
      options: ['Candidate data', 'Performance notes', 'Health/leave data', 'Compensation', 'Employee complaints', 'Learning records'],
      multi: true,
    },
    {
      id: 'people-peer-tools',
      label: 'HR teams with similar work often explore these. Which do you know or want to learn?',
      options: ['AI interview-note summaries', 'Learning path tools', 'Policy Q&A assistants', 'Engagement analysis', 'Bias audit checklists', 'Skills graph tools', 'I want safe-use guidance'],
      multi: true,
    },
  ],
  finance: [
    {
      id: 'finance-tools',
      label: 'Which finance workflows use AI?',
      options: ['Invoice checks', 'Variance analysis', 'Forecasting', 'Management reports', 'Audit prep', 'Fraud detection', 'None yet'],
      multi: true,
    },
    {
      id: 'finance-risk',
      label: 'What is your biggest finance AI concern?',
      options: ['Bad source data', 'Incorrect calculations', 'Fraud missed', 'Weak audit trail', 'Unauthorized data access', 'Misleading forecast'],
    },
    {
      id: 'finance-artifacts',
      label: 'Which artifacts should the assessment test?',
      options: ['Invoices', 'Spreadsheets', 'Dashboards', 'Budget memos', 'Audit logs', 'Vendor documents'],
      multi: true,
    },
    {
      id: 'finance-peer-tools',
      label: 'Finance users with similar jobs often explore these. Which do you know or want to learn?',
      options: ['Excel Copilot', 'Power BI Copilot', 'invoice anomaly tools', 'forecast explainers', 'audit trail review', 'RPA plus AI workflows', 'I want use cases'],
      multi: true,
    },
  ],
  operations: [
    {
      id: 'ops-tools',
      label: 'Which operations workflows use AI?',
      options: ['Scheduling', 'Inventory', 'SOP drafting', 'Process mining', 'Quality checks', 'Incident review', 'None yet'],
      multi: true,
    },
    {
      id: 'ops-risk',
      label: 'What operations risk matters most?',
      options: ['Unsafe automation', 'Bad handoffs', 'Poor data quality', 'No escalation path', 'Customer impact', 'Process drift'],
    },
    {
      id: 'ops-artifacts',
      label: 'Which artifacts should the assessment test?',
      options: ['Workflow maps', 'SOPs', 'Incident logs', 'Dashboards', 'Vendor tickets', 'Approval trails'],
      multi: true,
    },
    {
      id: 'ops-peer-tools',
      label: 'Operations teams with similar work often use these. Which do you know or want to learn?',
      options: ['process mining tools', 'AI scheduling assistants', 'SOP copilots', 'quality inspection AI', 'incident-review summarizers', 'workflow automation', 'I want a playbook'],
      multi: true,
    },
  ],
};

const microProfilePulse: MicroProfilePulse = {
  id: 'ai-trend-interest-2026-09',
  title: 'Tune your AI challenge',
  prompt: 'Which AI trend should your test pay closer attention to?',
  options: [
    { id: 'agents', label: 'Agents and automation', tag: 'Pulse interest: agents and automation', competencyIds: ['D2-agentic-workflows', 'D2-tool-selection', 'D4-security-governance', 'D6-role-clarity'] },
    { id: 'media', label: 'Image/video AI', tag: 'Pulse interest: image video and synthetic media', competencyIds: ['D2-prompt-design', 'D3-media-provenance', 'D4-fairness-ethics', 'D5-roi-metrics'] },
    { id: 'rag', label: 'RAG and context', tag: 'Pulse interest: RAG context engineering and source quality', competencyIds: ['D1-ai-systems', 'D2-tool-selection', 'D3-source-verification', 'D3-data-chart-judgment'] },
    { id: 'governance', label: 'Governance and risk', tag: 'Pulse interest: responsible AI governance risk and compliance', competencyIds: ['D4-regulatory-policy', 'D4-security-governance', 'D5-portfolio-prioritization', 'D6-role-clarity'] },
    { id: 'models', label: 'New models and benchmarks', tag: 'Pulse interest: new models benchmarks and evals', competencyIds: ['D1-genai-mechanics', 'D1-capability-limits', 'D3-source-verification', 'D5-usecase-fit'] },
  ],
};

const didYouKnowInsights: DidYouKnowInsight[] = [
  {
    id: 'dyk-agent-guardrails',
    domain: 'D2',
    topic: 'Agentic AI',
    fact: 'AI agents are shifting from answering questions to taking actions across tools, which makes permission scope and approval gates part of basic AI literacy.',
    whyItMatters: 'If your profile mentions agents, workflows, tools, or automation, the assessment should test whether you can design a bounded workflow rather than simply use a powerful model.',
    learnAction: 'premium',
    competencyIds: ['D2-tool-selection', 'D2-agentic-workflows', 'D4-security-governance', 'D6-role-clarity'],
  },
  {
    id: 'dyk-media-provenance',
    domain: 'D3',
    topic: 'Image and video AI',
    fact: 'Modern image and video generation can look polished while still carrying wrong claims, unclear rights, or missing provenance.',
    whyItMatters: 'Creators and marketers need deeper checks for source, consent, IP, caption accuracy, and performance claims before publishing AI-assisted media.',
    learnAction: 'labs',
    competencyIds: ['D2-prompt-design', 'D3-media-provenance', 'D3-source-verification', 'D4-fairness-ethics'],
  },
  {
    id: 'dyk-rag-context',
    domain: 'D3',
    topic: 'RAG and context engineering',
    fact: 'A long context window is not the same as grounded knowledge; retrieval quality still depends on source freshness, relevance, citation support, and missing-document detection.',
    whyItMatters: 'People using AI with files or internal knowledge bases should be tested on source quality, not just prompt wording.',
    learnAction: 'premium',
    competencyIds: ['D1-ai-systems', 'D2-tool-selection', 'D3-source-verification', 'D3-data-chart-judgment'],
  },
  {
    id: 'dyk-benchmark-literacy',
    domain: 'D1',
    topic: 'Model benchmarks',
    fact: 'A model leaderboard can hide important differences in task fit, contamination risk, safety behavior, latency, cost, and domain performance.',
    whyItMatters: 'Strong users should know how to challenge “newer model is better” claims before choosing a tool for real work.',
    learnAction: 'news',
    competencyIds: ['D1-genai-mechanics', 'D1-capability-limits', 'D3-source-verification', 'D5-usecase-fit'],
  },
  {
    id: 'dyk-governance-gap',
    domain: 'D4',
    topic: 'Responsible AI governance',
    fact: 'Enterprise AI adoption is moving faster than governance in many organizations, especially where autonomous agents can act in operational systems.',
    whyItMatters: 'If your work touches customer data, approvals, policy, money, or employee impact, the assessment should test controls, auditability, escalation, and accountability.',
    learnAction: 'premium',
    competencyIds: ['D4-data-privacy', 'D4-regulatory-policy', 'D4-security-governance', 'D6-role-clarity'],
  },
  {
    id: 'dyk-roi-reimagination',
    domain: 'D5',
    topic: 'AI ROI',
    fact: 'Many teams see productivity gains before they can prove business value, quality improvement, risk reduction, or workflow redesign.',
    whyItMatters: 'A high readiness score should reflect whether users can separate demo appeal from measurable value and durable operating change.',
    learnAction: 'premium',
    competencyIds: ['D5-usecase-fit', 'D5-roi-metrics', 'D5-portfolio-prioritization', 'D5-transformation-strategy'],
  },
  {
    id: 'dyk-human-agency',
    domain: 'D6',
    topic: 'Human-AI collaboration',
    fact: 'AI fluency is increasingly about deciding who owns judgment, how teams challenge outputs, and how mistakes become learning loops.',
    whyItMatters: 'If your score has collaboration or change gaps, learning more here can improve both practical use and trust.',
    learnAction: 'labs',
    competencyIds: ['D6-role-clarity', 'D6-trust-culture', 'D6-change-enablement', 'D6-learning-loops'],
  },
];

const executiveSurveyQuestions: Record<ExecutiveRole, SurveyQuestion[]> = {
  ceo: [
    { id: 'exec-ai-priority', label: 'Where is AI most important this year?', options: ['Growth', 'Cost/productivity', 'Customer experience', 'Risk reduction', 'New products', 'Operating model'], multi: true },
    { id: 'exec-ai-maturity', label: 'How mature is your AI operating model?', options: ['Exploring', 'Pilots running', 'Scaling selected use cases', 'Enterprise governance in place', 'Measuring ROI across portfolio'] },
    { id: 'exec-risk', label: 'What executive risk needs most attention?', options: ['Unclear ROI', 'Data/privacy', 'Security', 'Regulatory exposure', 'Talent readiness', 'Reputation'] },
    { id: 'exec-peer-interest', label: 'Executives with similar priorities often ask about these. Which would you like to explore?', options: ['AI operating model', 'agentic workflows', 'AI portfolio scorecards', 'board reporting', 'workforce reskilling', 'vendor/model risk'], multi: true },
  ],
  board: [
    { id: 'board-oversight', label: 'Which AI oversight topics are on the board agenda?', options: ['Strategy', 'Cyber/security', 'Regulation', 'Model/vendor risk', 'Workforce impact', 'Capital allocation'], multi: true },
    { id: 'board-reporting', label: 'What reporting do you receive today?', options: ['None yet', 'Use-case list', 'Risk register', 'ROI dashboard', 'Incident reporting', 'Assurance/audit report'], multi: true },
    { id: 'board-gap', label: 'What is the biggest governance gap?', options: ['Ownership', 'Metrics', 'Policy', 'Auditability', 'Skills', 'Vendor transparency'] },
    { id: 'board-peer-interest', label: 'Boards in similar contexts often review these. Which should New Horizon personalize for you?', options: ['AI risk appetite', 'model/vendor assurance', 'incident reporting', 'AI investment thesis', 'workforce impact', 'regulatory readiness'], multi: true },
  ],
  people: functionSurveyQuestions.people,
  finance: functionSurveyQuestions.finance,
  technology: functionSurveyQuestions.technical,
  transformation: [
    { id: 'transformation-scope', label: 'What kind of AI transformation are you leading?', options: ['Workflow redesign', 'Customer journey', 'Data platform', 'Agentic automation', 'Capability building', 'Governance rollout'], multi: true },
    { id: 'transformation-blocker', label: 'What blocks scaling most?', options: ['Use-case quality', 'Data readiness', 'Change adoption', 'Risk approval', 'Skills', 'Measurement'] },
    { id: 'transformation-method', label: 'How do teams currently test AI value?', options: ['Ad hoc trials', 'Pilot scorecards', 'A/B tests', 'ROI baselines', 'Risk gates', 'Not measured yet'], multi: true },
    { id: 'transformation-peer-interest', label: 'Transformation teams often learn from these patterns. Which should we track for your profile?', options: ['agent operating model', 'AI champion network', 'workflow labs', 'measurement dashboards', 'risk gates', 'skills heatmap'], multi: true },
  ],
};

const learnByDoingActivities: PracticeActivity[] = [
  {
    title: 'Task ownership',
    domain: 'D6',
    format: 'Decision card',
    detail: 'Decide what to delegate, what to verify, and what must stay human-owned.',
    questionId: 'REL-G-D6-006',
    labKind: 'ownership',
  },
  {
    title: 'Proof check',
    domain: 'D3',
    format: 'Artifact review',
    detail: 'Find the missing evidence behind a confident AI claim.',
    questionId: 'MULTI-SOURCE-GEN-003',
    labKind: 'proof',
  },
  {
    title: 'Next action',
    domain: 'D2',
    format: 'Scenario sprint',
    detail: 'Choose the safest useful step in a real workflow.',
    questionId: 'PRACTICAL-GEN-D2-012',
    labKind: 'next',
  },
  {
    title: 'Prompt repair',
    domain: 'D2',
    format: 'Rewrite task',
    detail: 'Turn vague requests into reusable instructions with sources, constraints, and review checks.',
    questionId: 'D2-A-001',
    labKind: 'prompt',
  },
  {
    title: 'Media check',
    domain: 'D3',
    format: 'Visual inspection',
    detail: 'Inspect images, captions, dates, and provenance before sharing.',
    questionId: 'D3-A-001',
    labKind: 'media',
  },
  {
    title: 'Workflow lab',
    domain: 'D5',
    format: 'Drag-order',
    detail: 'Place human review where mistakes would affect customers, money, policy, or trust.',
    questionId: 'GEN-EXP-D2-001',
    labKind: 'workflow',
  },
  {
    title: 'Trust room',
    domain: 'D4',
    format: 'Control matching',
    detail: 'Design accountability, disclosure, escalation, and audit routines.',
    questionId: 'GEN-EXP-D4-001',
    labKind: 'trust',
  },
];

const fieldLabRooms = learnByDoingActivities.filter((activity) =>
  ['Prompt repair', 'Media check', 'Workflow lab', 'Trust room'].includes(activity.title),
);

const labConfigs: Record<LabKind, LabConfig> = {
  ownership: {
    kind: 'ownership',
    title: 'Task ownership lab',
    domain: 'D6',
    format: 'Decision card',
    brief: 'Classify who should own each part of a real AI-assisted task. The goal is not to avoid AI; it is to keep accountability in the right place.',
    artifact: {
      title: 'Team request: prepare a customer refund decision',
      rows: [
        'AI can summarize the complaint history and find matching policy excerpts.',
        'A human must decide whether the exception is fair, legal, and customer-safe.',
        'AI can draft the reply after the decision is made.',
      ],
      note: 'Assign ownership for the three work steps below.',
    },
    items: [
      { id: 'summarize', label: 'Summarize complaint history and policy snippets', correct: 'AI-assisted' },
      { id: 'decide', label: 'Approve or deny the refund exception', correct: 'Human-owned' },
      { id: 'draft', label: 'Draft the customer reply from the approved decision', correct: 'Shared' },
    ],
    matchChoices: ['Human-owned', 'Shared', 'AI-assisted'],
  },
  proof: {
    kind: 'proof',
    title: 'Proof check lab',
    domain: 'D3',
    format: 'Artifact review',
    brief: 'An AI answer sounds confident. Select the evidence checks you would run before trusting or sharing it.',
    artifact: {
      title: 'AI claim: New policy allows customer data to be exported to any approved analytics tool',
      rows: [
        'Source A says exports are allowed only for aggregated or anonymized data.',
        'Source B says named customer records require privacy review and a data owner approval.',
        'The AI summary cites both sources but omits the approval condition.',
      ],
      note: 'The problem is not that AI used sources. The problem is whether the answer stayed faithful to them.',
    },
    choices: [
      { id: 'compare', label: 'Compare the AI claim line by line against the source language.', correct: true },
      { id: 'approval', label: 'Check whether the named-record approval condition applies.', correct: true },
      { id: 'owner', label: 'Ask the data owner or policy owner before acting on named records.', correct: true },
      { id: 'confidence', label: 'Trust it because the answer included citations.' },
      { id: 'rewrite', label: 'Rewrite the claim with the missing condition before sharing.', correct: true },
    ],
  },
  next: {
    kind: 'next',
    title: 'Next action lab',
    domain: 'D2',
    format: 'Scenario sprint',
    brief: 'Choose the next action that is useful, safe, and testable in a workflow.',
    artifact: {
      title: 'Workflow idea: let an AI agent respond to refund emails automatically',
      rows: [
        'Current refund policy has exceptions for damaged goods, VIP customers, and fraud flags.',
        'Support team wants faster replies, but Finance reports duplicate-refund losses.',
        'No one has defined when the agent must escalate instead of send.',
      ],
      note: 'Pick the best first move.',
    },
    choices: [
      { id: 'pilot', label: 'Pilot the agent on low-risk drafts only, with refund approval kept human-owned.', correct: true },
      { id: 'auto', label: 'Let the agent send all refund replies and review mistakes weekly.' },
      { id: 'ban', label: 'Ban AI in support because refund cases can be sensitive.' },
      { id: 'prompt', label: 'Ask for a better prompt but skip measurement until later.' },
    ],
  },
  prompt: {
    kind: 'prompt',
    title: 'Prompt repair lab',
    domain: 'D2',
    format: 'Rewrite task',
    brief: 'Rewrite a weak prompt into a reusable work instruction. Include role, task, context, constraints, source rules, output format, and review checks.',
    artifact: {
      title: 'Weak prompt',
      rows: [
        '“Help me make this customer email better.”',
        'Missing: audience, facts, tone, privacy constraints, policy source, approval step, and output format.',
      ],
      note: 'Build a stronger prompt in the box below.',
    },
    prompt: 'Rewrite this prompt so an AI assistant can safely draft a customer refund reply without inventing facts.',
    checklist: ['role', 'task', 'context', 'source', 'constraints', 'format', 'review'],
  },
  media: {
    kind: 'media',
    title: 'Media check lab',
    domain: 'D3',
    format: 'Visual inspection',
    brief: 'Inspect the post and choose checks that help verify whether the image and caption are reliable.',
    artifact: {
      title: 'Viral post: “Bangkok mall flooded today, avoid the area”',
      rows: [
        'Image shows rain and a flooded street, but no visible mall sign.',
        'Caption says “today” but the repost chain has no original timestamp.',
        'One comment says the same image appeared during a 2024 storm in another district.',
      ],
      note: 'Select the verification actions before sharing.',
    },
    choices: [
      { id: 'source', label: 'Find the earliest/original post and timestamp.', correct: true },
      { id: 'location', label: 'Look for location clues or official local updates.', correct: true },
      { id: 'reverse', label: 'Run reverse image search or compare with older reposts.', correct: true },
      { id: 'share', label: 'Share immediately because flooding is urgent.' },
      { id: 'caption', label: 'Rewrite the caption as unverified until confirmed.', correct: true },
    ],
  },
  workflow: {
    kind: 'workflow',
    title: 'Workflow lab',
    domain: 'D5',
    format: 'Drag-order',
    brief: 'Put the workflow controls in the order you would use before scaling an AI process.',
    artifact: {
      title: 'AI workflow: support-ticket triage agent',
      rows: [
        'The agent can read tickets, draft replies, tag refund risk, and route escalations.',
        'Mistakes can affect customers, payments, policy compliance, and trust.',
        'The team wants a launch sequence that catches errors before full automation.',
      ],
      note: 'Use the move buttons to build the safest sequence.',
    },
    items: [
      { id: 'scope', label: 'Define allowed tasks, forbidden actions, and escalation triggers', correct: '1' },
      { id: 'sample', label: 'Test against real anonymized tickets and known edge cases', correct: '2' },
      { id: 'human', label: 'Require human approval for refunds, legal risk, or angry customers', correct: '3' },
      { id: 'measure', label: 'Track quality, customer impact, cost, and override reasons', correct: '4' },
      { id: 'scale', label: 'Expand only after review shows stable performance', correct: '5' },
    ],
    idealOrder: ['scope', 'sample', 'human', 'measure', 'scale'],
  },
  trust: {
    kind: 'trust',
    title: 'Trust room lab',
    domain: 'D4',
    format: 'Control matching',
    brief: 'Match each AI risk to the control that would make the workflow auditable and safer.',
    artifact: {
      title: 'AI assistant controls needed before launch',
      rows: [
        'The assistant can use customer records, draft recommendations, and trigger follow-up tasks.',
        'Managers need to know who approved sensitive actions and why.',
        'Users need a way to challenge or escalate questionable outputs.',
      ],
      note: 'Match each risk to the most useful control.',
    },
    items: [
      { id: 'privacy', label: 'Customer data may be copied into the wrong tool', correct: 'Data boundary and approved-source rule' },
      { id: 'authority', label: 'AI might take action beyond its mandate', correct: 'Permission scope with human approval gates' },
      { id: 'audit', label: 'No one can explain why a decision happened', correct: 'Decision log with source and approver trail' },
      { id: 'appeal', label: 'Users need to challenge a harmful or wrong output', correct: 'Escalation and correction path' },
    ],
    matchChoices: [
      'Data boundary and approved-source rule',
      'Permission scope with human approval gates',
      'Decision log with source and approver trail',
      'Escalation and correction path',
    ],
  },
};

const modelPromptRepairAnswer = `Act as a customer support assistant drafting a refund reply. Use only the facts in the customer ticket, order record, and approved refund policy. Do not invent purchase details, promises, compensation, timelines, or policy exceptions. If required facts are missing, ask for them instead of guessing.

Context:
- Customer issue: [paste complaint summary]
- Order/refund facts: [paste verified order facts]
- Relevant policy excerpt: [paste approved policy]

Task:
Draft a concise customer email that explains the decision, cites the relevant policy in plain language, keeps an empathetic tone, and flags any case that needs human approval.

Output format:
1. Subject line
2. Customer email draft
3. Evidence used
4. Missing facts or approval needed

Review before final:
Check that every claim is supported by the ticket, order record, or policy. Mark anything uncertain as "needs review".`;

const trendFeed = [
  {
    category: 'Agents',
    title: 'AI agents are becoming an operating-model question',
    source: 'Microsoft WorkLab',
    date: 'May 5, 2026',
    url: 'https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-every-organization',
    domain: 'D6',
    signal: 'Human agency, workflow redesign, manager support, and learning systems matter as much as tool access.',
  },
  {
    category: 'Safety',
    title: 'Cyber-capable AI raises the bar for safe agent use',
    source: 'OpenAI Security',
    date: 'August 10, 2026',
    url: 'https://openai.com/index/expanding-daybreak-as-the-cyber-defense-window-narrows/',
    domain: 'D4',
    signal: 'Defensive AI use needs identity, monitoring, approvals, and tighter defaults when agents can act in sensitive systems.',
  },
  {
    category: 'Benchmarks',
    title: 'Double-blind AI evaluations target benchmark contamination',
    source: 'Google DeepMind',
    date: 'August 27, 2026',
    url: 'https://deepmind.google/blog/piloting-the-worlds-first-double-blind-ai-evaluations/',
    domain: 'D3',
    signal: 'Evaluation quality is now a literacy topic: users need to understand leakage, test integrity, and benchmark trust.',
  },
  {
    category: 'Provenance',
    title: 'Text watermarking becomes part of AI transparency',
    source: 'Anthropic',
    date: 'August 14, 2026',
    url: 'https://www.anthropic.com/news/claude-text-watermark',
    domain: 'D3',
    signal: 'Provenance and disclosure are becoming practical skills for education, publishing, compliance, and workplace review.',
  },
  {
    category: 'Robotics',
    title: 'Robotics moves from demos toward multi-step real-world action',
    source: 'Google DeepMind',
    date: 'July 30, 2026',
    url: 'https://deepmind.google/blog/gemini-robotics-2-brings-whole-body-intelligence-to-robots/',
    domain: 'D2',
    signal: 'Multimodal AI, task orchestration, and real-world handoffs point to new assessment scenarios beyond chat.',
  },
  {
    category: 'LLM',
    title: 'GPT-5.6 updates raise the bar for model literacy',
    source: 'OpenAI Deployment Safety Hub',
    date: 'August 6, 2026',
    url: 'https://deploymentsafety.openai.com/gpt-5-6-august-update',
    domain: 'D1',
    signal: 'Users need to understand model capability reports, evaluation limits, hallucination results, vision behavior, and safety constraints instead of treating every new model as simply “better.”',
  },
  {
    category: 'New models',
    title: 'Claude Opus 5 focuses attention on long-running agentic work',
    source: 'Anthropic',
    date: 'July 24, 2026',
    url: 'https://www.anthropic.com/news',
    domain: 'D2',
    signal: 'More capable long-running models make prompt quality, task boundaries, monitoring, review checkpoints, and human ownership more important for everyday work.',
  },
  {
    category: 'Benchmarks',
    title: 'Epoch AI tracks frontier model capability by task type',
    source: 'Epoch AI',
    date: 'August 29, 2026',
    url: 'https://epoch.ai/benchmarks',
    domain: 'D3',
    signal: 'Benchmark literacy should cover task type, contamination risk, saturation, model-specific strengths, and whether a benchmark maps to real user work.',
  },
  {
    category: 'AI index',
    title: 'Stanford AI Index widens coverage across performance, science, medicine, education, policy, and public opinion',
    source: 'Stanford HAI',
    date: '2026 report',
    url: 'https://hai.stanford.edu/ai-index/2026-ai-index-report',
    domain: 'D5',
    signal: 'AI readiness is not just model use. Assessment content should include adoption, governance, education, workforce, public trust, technical performance, and scientific impact.',
  },
  {
    category: 'Autonomous vehicles',
    title: 'Waymo safety data shows autonomous systems need operational evidence, not hype',
    source: 'Waymo Safety Impact',
    date: 'June 24, 2026',
    url: 'https://waymo.com/safety/impact/',
    domain: 'D3',
    signal: 'Autonomous vehicle claims are good assessment material: users can compare performance data, benchmark methodology, geography, risk categories, and deployment limits.',
  },
  {
    category: 'Autonomous vehicles',
    title: 'Waymo argues there is no shortcut to safe self-driving',
    source: 'Axios',
    date: 'August 26, 2026',
    url: 'https://www.axios.com/2026/08/26/waymo-ai-shortcut-self-driving',
    domain: 'D4',
    signal: 'Autonomy stories help users separate model capability from safety case, sensor strategy, operating domain, regulation, and accountability.',
  },
  {
    category: 'Science',
    title: 'FrontierMath open problems test whether AI can contribute to research-frontier math',
    source: 'Epoch AI',
    date: 'July 2026',
    url: 'https://epoch.ai/frontiermath/open-problems/about/faq',
    domain: 'D1',
    signal: 'Breakthrough claims need careful framing: what was tested, what tools were allowed, how solutions were verified, and whether humans confirmed the result.',
  },
  {
    category: 'Agent evaluation',
    title: 'METR task standards push agent evaluation toward reproducible work tasks',
    source: 'METR / GitHub',
    date: '2026',
    url: 'https://github.com/METR/task-standard/blob/main/README.md',
    domain: 'D3',
    signal: 'Agent benchmarks can inspire practical assessment formats where users inspect goals, tool access, task environments, scoring, and failure modes.',
  },
  {
    category: 'Autonomy risk',
    title: 'Anthropic reports real-world cyber-evaluation incidents',
    source: 'Anthropic',
    date: 'July 30, 2026',
    url: 'https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals',
    domain: 'D4',
    signal: 'Evaluation environments, internet access, scope boundaries, and monitoring are now practical governance topics for anyone deploying agentic systems.',
  },
];

const newsFrequencyLabels: Record<NewsFrequency, { label: string; detail: string }> = {
  daily: { label: 'Daily', detail: 'Best for fast-moving AI capability, safety, regulation, and tool updates.' },
  weekly: { label: 'Weekly', detail: 'Best default for most users: fewer updates, better signal.' },
  monthly: { label: 'Monthly', detail: 'Best for executive summaries, board packs, and training refresh cycles.' },
};

const gamificationRules = [
  ['Readiness level', 'Overall score unlocks Awareness, Developing, Applied, and Proficient status.'],
  ['Domain badges', 'Strong evidence in D1-D6 awards badges such as Source Checker, Workflow Builder, or Governance Guard.'],
  ['Quest progress', 'Each answered artifact, written response, and multi-part item advances practical-skill quests.'],
  ['Challenge mode', 'Premium users can replay weak competencies with harder artifacts and track score improvement.'],
];

const domainBadges: Record<DomainId, { title: string; detail: string }> = {
  D1: { title: 'Concept Navigator', detail: 'Understands AI concepts, limits, and system patterns.' },
  D2: { title: 'Workflow Builder', detail: 'Turns tools, prompts, and agents into usable workflows.' },
  D3: { title: 'Evidence Checker', detail: 'Verifies claims, charts, sources, media, and confidence.' },
  D4: { title: 'Governance Guard', detail: 'Spots privacy, permission, fairness, and accountability risks.' },
  D5: { title: 'Value Strategist', detail: 'Chooses AI work by outcomes, baselines, and scale criteria.' },
  D6: { title: 'Human-AI Lead', detail: 'Keeps ownership, learning, trust, and review routines clear.' },
};

const relianceOptions = {
  me: { id: 'me', label: 'Human-owned: keep judgment with the person.', score: 20, feedback: 'This may be too cautious if the task is low-risk and easy to verify.' },
  together: { id: 'together', label: 'Shared with AI: use AI, then verify and decide.', score: 98, feedback: 'Correct. AI can help, but the human keeps judgment, context, and accountability.' },
  ai: { id: 'ai', label: 'AI-led: let AI handle it end to end.', score: 20, feedback: 'Full delegation is risky when the output affects trust, safety, money, policy, or another person.' },
};

const difficultyLabels: Record<Difficulty, string> = {
  awareness: 'Awareness',
  applied: 'Applied',
  proficient: 'Proficient',
  advanced: 'Advanced',
};

const difficultyReadinessBands: Record<Difficulty, { partial: number; max: number }> = {
  awareness: { partial: 40, max: 68 },
  applied: { partial: 58, max: 82 },
  proficient: { partial: 72, max: 92 },
  advanced: { partial: 82, max: 100 },
};

const difficultyDescriptions: Record<Difficulty, string> = {
  awareness: 'Recognize the concept, risk, or safe first step.',
  applied: 'Use the concept in a realistic task with evidence.',
  proficient: 'Handle ambiguity, tradeoffs, and operating consequences.',
  advanced: 'Design, govern, or improve AI systems across real constraints.',
};

const competencyDefinitions: Record<string, CompetencyDefinition> = {
  'D1-core-concepts': { id: 'D1-core-concepts', domain: 'D1', label: 'Core AI concepts', skills: ['AI vocabulary', 'LLM basics', 'models vs apps', 'capability patterns'] },
  'D1-genai-mechanics': { id: 'D1-genai-mechanics', domain: 'D1', label: 'Generative AI mechanics', skills: ['tokens', 'embeddings', 'RAG and grounding', 'fine-tuning'] },
  'D1-capability-limits': { id: 'D1-capability-limits', domain: 'D1', label: 'Capability boundaries', skills: ['hallucination', 'staleness', 'uncertainty', 'model limits'] },
  'D1-ai-systems': { id: 'D1-ai-systems', domain: 'D1', label: 'AI systems literacy', skills: ['context windows', 'memory', 'tool connectors', 'agent components'] },
  'D2-prompt-design': { id: 'D2-prompt-design', domain: 'D2', label: 'Prompt design', skills: ['prompt repair', 'role and task framing', 'constraints', 'examples'] },
  'D2-tool-selection': { id: 'D2-tool-selection', domain: 'D2', label: 'Tool selection and integration', skills: ['tool fit', 'MCP/connectors', 'repository use', 'product choice'] },
  'D2-agentic-workflows': { id: 'D2-agentic-workflows', domain: 'D2', label: 'Agentic workflows', skills: ['workflow mapping', 'agent setup', 'handoffs', 'approval gates'] },
  'D2-output-refinement': { id: 'D2-output-refinement', domain: 'D2', label: 'Output refinement', skills: ['iteration', 'rubric review', 'context setup', 'quality checks'] },
  'D3-source-verification': { id: 'D3-source-verification', domain: 'D3', label: 'Source and claim verification', skills: ['source checking', 'citation support', 'claim review', 'triangulation'] },
  'D3-data-chart-judgment': { id: 'D3-data-chart-judgment', domain: 'D3', label: 'Data and chart judgment', skills: ['chart forensics', 'baseline checks', 'causality', 'benchmark fit'] },
  'D3-media-provenance': { id: 'D3-media-provenance', domain: 'D3', label: 'Media provenance', skills: ['synthetic media signals', 'image context', 'caption checks', 'provenance'] },
  'D3-fraud-detection': { id: 'D3-fraud-detection', domain: 'D3', label: 'Fraud and manipulation detection', skills: ['phishing checks', 'suspicious artifacts', 'invoice fraud', 'impersonation'] },
  'D4-data-privacy': { id: 'D4-data-privacy', domain: 'D4', label: 'Data protection and privacy', skills: ['data minimization', 'sensitive data', 'retention', 'consent'] },
  'D4-regulatory-policy': { id: 'D4-regulatory-policy', domain: 'D4', label: 'Regulatory and policy fluency', skills: ['policy alignment', 'sector obligations', 'disclosure', 'documentation'] },
  'D4-fairness-ethics': { id: 'D4-fairness-ethics', domain: 'D4', label: 'Fairness, ethics, and rights', skills: ['bias testing', 'impact review', 'IP/content rights', 'human impact'] },
  'D4-security-governance': { id: 'D4-security-governance', domain: 'D4', label: 'Security and governance controls', skills: ['least privilege', 'audit logs', 'vendor controls', 'incident response'] },
  'D5-usecase-fit': { id: 'D5-usecase-fit', domain: 'D5', label: 'Use-case evaluation', skills: ['problem fit', 'feasibility', 'data readiness', 'user value'] },
  'D5-roi-metrics': { id: 'D5-roi-metrics', domain: 'D5', label: 'ROI and measurement', skills: ['baseline metrics', 'KPI design', 'ROI evidence', 'quality measures'] },
  'D5-portfolio-prioritization': { id: 'D5-portfolio-prioritization', domain: 'D5', label: 'Portfolio prioritization', skills: ['risk-adjusted value', 'pilot gates', 'resource allocation', 'stage gates'] },
  'D5-transformation-strategy': { id: 'D5-transformation-strategy', domain: 'D5', label: 'Strategy and transformation', skills: ['business-case design', 'scale criteria', 'trend judgment', 'operating model'] },
  'D6-role-clarity': { id: 'D6-role-clarity', domain: 'D6', label: 'Human-AI role clarity', skills: ['role boundaries', 'review routines', 'human accountability', 'handoffs'] },
  'D6-trust-culture': { id: 'D6-trust-culture', domain: 'D6', label: 'Trust and challenge culture', skills: ['challenge culture', 'psychological safety', 'transparency', 'manager modeling'] },
  'D6-change-enablement': { id: 'D6-change-enablement', domain: 'D6', label: 'Change enablement', skills: ['adoption support', 'communication', 'coaching loops', 'champion networks'] },
  'D6-learning-loops': { id: 'D6-learning-loops', domain: 'D6', label: 'Learning and improvement loops', skills: ['learning ownership', 'feedback loops', 'continuous improvement', 'reassessment'] },
};

const broadCompetencyMap: Record<string, string[]> = {
  'D1-concepts': ['D1-core-concepts', 'D1-genai-mechanics', 'D1-capability-limits'],
  'D1-systems': ['D1-core-concepts', 'D1-genai-mechanics', 'D1-ai-systems'],
  'D2-prompting': ['D2-prompt-design', 'D2-tool-selection', 'D2-output-refinement'],
  'D2-workflows': ['D2-tool-selection', 'D2-agentic-workflows', 'D2-output-refinement'],
  'D3-verification': ['D3-source-verification', 'D3-data-chart-judgment'],
  'D3-media': ['D3-media-provenance', 'D3-fraud-detection'],
  'D4-risk': ['D4-data-privacy', 'D4-fairness-ethics', 'D4-security-governance'],
  'D4-governance': ['D4-regulatory-policy', 'D4-fairness-ethics', 'D4-security-governance'],
  'D5-value': ['D5-usecase-fit', 'D5-roi-metrics', 'D5-portfolio-prioritization'],
  'D5-strategy': ['D5-usecase-fit', 'D5-portfolio-prioritization', 'D5-transformation-strategy'],
  'D6-collaboration': ['D6-role-clarity', 'D6-trust-culture', 'D6-learning-loops'],
  'D6-change': ['D6-trust-culture', 'D6-change-enablement', 'D6-learning-loops'],
};

const advancedQuestionFrames = [
  { id: 'scale-gate', context: 'A cross-functional team wants to scale an AI workflow from a controlled pilot to three departments.', prompt: 'Which decision best demonstrates advanced judgment for this competency?' },
  { id: 'incident-review', context: 'A recent AI-assisted workflow incident exposed unclear ownership, weak evidence, and a rushed approval path.', prompt: 'What should the review team do before restoring or expanding the workflow?' },
  { id: 'vendor-approval', context: 'A vendor claims its AI capability is enterprise-ready, but the evidence package is incomplete and business sponsors are eager to proceed.', prompt: 'Which approval condition is strongest?' },
  { id: 'board-brief', context: 'Leadership needs a short recommendation that balances value, user impact, data boundaries, and operational controls.', prompt: 'Which recommendation is most decision-ready?' },
  { id: 'workflow-redesign', context: 'A team is redesigning a high-volume process so AI can assist without hiding uncertainty or weakening accountability.', prompt: 'Which redesign choice is strongest?' },
  { id: 'measurement-plan', context: 'The pilot looks promising, but the team has not separated speed, quality, user trust, cost, and risk outcomes.', prompt: 'What measurement plan should govern the next phase?' },
  { id: 'policy-conflict', context: 'Two internal policies point in different directions, and the AI system gives a confident recommendation anyway.', prompt: 'What is the best advanced response?' },
  { id: 'data-boundary', context: 'The proposed workflow would combine customer, employee, vendor, and operational data across multiple tools.', prompt: 'Which control set best supports responsible use?' },
  { id: 'capability-claim', context: 'A product owner argues that the newest model removes the need for the old review process.', prompt: 'Which challenge is most appropriate?' },
  { id: 'continuous-improvement', context: 'The first deployment is live and teams are reporting mixed outcomes, edge cases, and workarounds.', prompt: 'What should the owner do next?' },
] as const;

function buildAdvancedCompetencyQuestion(competency: CompetencyDefinition, frame: (typeof advancedQuestionFrames)[number], index: number): Question {
  const skillFocus = competency.skills.slice(0, 3).join(', ');
  return {
    id: `ADV-${competency.id.toUpperCase()}-${String(index + 1).padStart(2, '0')}`,
    domain: competency.domain,
    difficulty: 'advanced',
    type: 'judgment',
    interaction: 'single',
    competencyIds: [competency.id],
    skillIds: competency.skills,
    evidenceMode: 'hybrid',
    context: `${frame.context} Focus competency: ${competency.label}. Relevant skills: ${skillFocus}.`,
    prompt: frame.prompt,
    options: [
      {
        id: 'advanced-control',
        label: `Define success criteria, evidence requirements, ownership, and review controls for ${competency.label.toLowerCase()} before scaling.`,
        score: 98,
        feedback: `Strong advanced evidence. The answer connects ${competency.label.toLowerCase()} to measurable outcomes, constraints, and accountable operation.`,
      },
      {
        id: 'speed-first',
        label: 'Scale the workflow now because early users reported speed improvements.',
        score: 38,
        feedback: 'Speed is useful, but advanced readiness requires quality, risk, ownership, and evidence checks before scale.',
      },
      {
        id: 'tool-only',
        label: 'Switch to a newer model or tool and assume the competency gap is resolved.',
        score: 28,
        feedback: 'Tool capability does not replace competency evidence, workflow design, or governance.',
      },
      {
        id: 'block-without-learning',
        label: 'Stop all AI use in this area without preserving evidence or defining a safer path.',
        score: 46,
        feedback: 'Caution may be appropriate, but advanced practice keeps evidence, learns from failure, and defines controlled next steps.',
      },
    ],
  };
}

const advancedCompetencyQuestionBank: Question[] = Object.values(competencyDefinitions).flatMap((competency) =>
  advancedQuestionFrames.map((frame, index) => buildAdvancedCompetencyQuestion(competency, frame, index)),
);

const marketTrendFrames: Record<Difficulty, Array<{ id: string; context: string; prompt: string; best: string; partial: string; weak: string; trap: string }>> = {
  awareness: [
    {
      id: 'agent-basics',
      context: 'A teammate says the company should adopt AI agents because every new model can now take actions across tools.',
      prompt: 'Which first question best checks whether the user understands this current AI trend?',
      best: 'Ask what task the agent will perform, what tools it can access, what approval gates exist, and where a human remains accountable.',
      partial: 'Ask which model is newest before deciding whether to try an agent.',
      weak: 'Assume any chatbot with tool access is safe to run autonomously.',
      trap: 'Adopt the agent because competitors are discussing agentic AI.',
    },
  ],
  applied: [
    {
      id: 'multimodal-workflow',
      context: 'A content team wants to use AI to generate campaign copy, short video drafts, and product images from a single brief.',
      prompt: 'What practical setup best tests this capability without over-trusting the output?',
      best: 'Create a source-backed brief, define brand/IP checks, review image and video claims separately, and measure revision rate before scaling.',
      partial: 'Generate several variants and choose the one that looks most polished.',
      weak: 'Use the same approval checklist for text, images, and video because they came from one model.',
      trap: 'Skip provenance review because synthetic media is now normal in marketing.',
    },
    {
      id: 'rag-context',
      context: 'A team is moving from prompt-only chat to a RAG assistant over policies, tickets, and product documents.',
      prompt: 'Which applied action best shows understanding of context engineering and retrieval quality?',
      best: 'Test whether retrieved sources are current, relevant, cited, and sufficient for the answer before trusting the assistant.',
      partial: 'Increase the context window and assume the answer will be grounded.',
      weak: 'Fine-tune immediately before checking source quality.',
      trap: 'Remove human review once the assistant includes citations.',
    },
  ],
  proficient: [
    {
      id: 'governed-agent',
      context: 'An operations group wants an AI agent to triage requests, update records, and trigger follow-up emails.',
      prompt: 'Which response best handles the tradeoffs in current agent deployment?',
      best: 'Start read-only, log every proposed action, require approval for customer-impacting writes, monitor failures, and expand authority only after evidence improves.',
      partial: 'Let the agent handle low-value tasks and review a weekly sample.',
      weak: 'Give the agent broad permissions so it can learn the workflow faster.',
      trap: 'Measure success only by tickets closed per hour.',
    },
    {
      id: 'benchmark-caveat',
      context: 'A vendor shows high benchmark scores for a domain-specific model and claims it will outperform general models in your workflow.',
      prompt: 'What is the strongest proficient evaluation response?',
      best: 'Run a task-specific eval with your data, failure cases, cost/latency constraints, safety checks, and reviewer agreement before selecting the model.',
      partial: 'Prefer the domain-specific model if its published benchmark is higher.',
      weak: 'Reject all vendor benchmarks because they are marketing.',
      trap: 'Choose the model with the largest context window.',
    },
  ],
  advanced: [
    {
      id: 'operating-model',
      context: 'Leadership wants to scale generative AI, agents, and multimodal workflows across functions while governance capacity is limited.',
      prompt: 'Which advanced decision best reflects the 2026 AI market shift from experimentation to operating model?',
      best: 'Create a tiered AI operating model with use-case intake, risk-based controls, eval evidence, incident review, role training, and measurable value gates.',
      partial: 'Create one central approval committee for every AI request.',
      weak: 'Let each team pick tools independently to move faster.',
      trap: 'Delay all adoption until regulation is fully settled.',
    },
    {
      id: 'sovereign-data',
      context: 'A regional business wants AI systems that respect local language, sector rules, data residency, and vendor dependence concerns.',
      prompt: 'What is the strongest advanced response?',
      best: 'Compare model capability with data residency, language performance, auditability, vendor exit paths, and local regulatory obligations before designing the rollout.',
      partial: 'Choose the strongest global model and translate outputs locally.',
      weak: 'Use only local models even if they fail critical tasks.',
      trap: 'Treat sovereignty as a hosting choice rather than an operating and governance requirement.',
    },
  ],
};

function buildMarketTrendQuestion(competency: CompetencyDefinition, difficulty: Difficulty, trend: (typeof marketTrendFrames)[Difficulty][number], index: number): Question {
  const focus = competency.skills.slice(0, 3).join(', ');
  const difficultyLead = {
    awareness: 'recognizes',
    applied: 'uses',
    proficient: 'handles tradeoffs in',
    advanced: 'designs scalable controls for',
  }[difficulty];
  return {
    id: `TREND-${competency.id.toUpperCase()}-${difficulty.toUpperCase()}-${String(index + 1).padStart(2, '0')}`,
    domain: competency.domain,
    difficulty,
    type: 'judgment',
    interaction: 'single',
    competencyIds: [competency.id],
    skillIds: [...new Set([...competency.skills, 'AI market trends', 'agentic AI', 'multimodal AI', 'evaluation'])],
    evidenceMode: difficulty === 'awareness' ? 'knowing' : 'hybrid',
    context: `${trend.context} Focus competency: ${competency.label}. The user should show they ${difficultyLead} ${competency.label.toLowerCase()} using practical signals such as ${focus}.`,
    prompt: trend.prompt,
    options: [
      { id: 'best', label: trend.best, score: 96, feedback: `Strong ${difficulty} evidence for ${competency.label.toLowerCase()}: it connects the trend to task fit, evidence, controls, and outcomes.` },
      { id: 'partial', label: trend.partial, score: difficulty === 'awareness' ? 60 : difficulty === 'applied' ? 58 : 62, feedback: 'Partial evidence. This notices part of the trend but does not fully test fit, risk, evidence, and operational use.' },
      { id: 'weak', label: trend.weak, score: 28, feedback: 'Weak evidence. This over-trusts the technology or misses the practical control problem.' },
      { id: 'trend-chasing', label: trend.trap, score: 18, feedback: 'Trend-chasing is not readiness. Strong AI users connect new capabilities to evidence, workflow design, and accountable use.' },
    ],
  };
}

const marketTrendQuestionBank: Question[] = Object.values(competencyDefinitions).flatMap((competency) =>
  (Object.keys(marketTrendFrames) as Difficulty[]).flatMap((difficulty) =>
    marketTrendFrames[difficulty].map((trend, index) => buildMarketTrendQuestion(competency, difficulty, trend, index)),
  ),
);

const freeAudiencePriorityCompetencies: Record<Audience, string[]> = {
  general: [
    'D1-core-concepts',
    'D1-capability-limits',
    'D2-prompt-design',
    'D2-output-refinement',
    'D3-source-verification',
    'D3-media-provenance',
    'D4-data-privacy',
    'D4-fairness-ethics',
    'D5-usecase-fit',
    'D6-role-clarity',
    'D6-learning-loops',
  ],
  student: [
    'D1-core-concepts',
    'D1-capability-limits',
    'D2-prompt-design',
    'D2-output-refinement',
    'D3-source-verification',
    'D3-media-provenance',
    'D4-data-privacy',
    'D4-fairness-ethics',
    'D6-role-clarity',
    'D6-learning-loops',
  ],
  educator: [
    'D1-core-concepts',
    'D1-capability-limits',
    'D2-prompt-design',
    'D2-output-refinement',
    'D3-source-verification',
    'D4-data-privacy',
    'D4-fairness-ethics',
    'D5-usecase-fit',
    'D6-role-clarity',
    'D6-change-enablement',
  ],
  professional: [
    'D1-ai-systems',
    'D2-prompt-design',
    'D2-tool-selection',
    'D2-agentic-workflows',
    'D3-source-verification',
    'D3-data-chart-judgment',
    'D4-data-privacy',
    'D4-security-governance',
    'D5-usecase-fit',
    'D5-roi-metrics',
    'D6-role-clarity',
  ],
  team: [
    'D1-ai-systems',
    'D2-agentic-workflows',
    'D2-output-refinement',
    'D3-source-verification',
    'D3-data-chart-judgment',
    'D4-security-governance',
    'D4-regulatory-policy',
    'D5-portfolio-prioritization',
    'D5-roi-metrics',
    'D6-trust-culture',
    'D6-change-enablement',
  ],
};

const functionPriorityCompetencies: Record<FunctionTrack, string[]> = {
  general: freeAudiencePriorityCompetencies.professional,
  people: [
    'D2-prompt-design',
    'D2-output-refinement',
    'D3-source-verification',
    'D4-data-privacy',
    'D4-fairness-ethics',
    'D4-regulatory-policy',
    'D5-usecase-fit',
    'D6-role-clarity',
    'D6-trust-culture',
    'D6-change-enablement',
  ],
  finance: [
    'D1-ai-systems',
    'D2-tool-selection',
    'D2-agentic-workflows',
    'D3-data-chart-judgment',
    'D3-fraud-detection',
    'D4-security-governance',
    'D4-regulatory-policy',
    'D5-roi-metrics',
    'D5-portfolio-prioritization',
    'D6-role-clarity',
  ],
  marketing: [
    'D1-genai-mechanics',
    'D2-prompt-design',
    'D2-output-refinement',
    'D3-source-verification',
    'D3-media-provenance',
    'D4-fairness-ethics',
    'D4-regulatory-policy',
    'D5-usecase-fit',
    'D5-roi-metrics',
    'D6-learning-loops',
  ],
  sales: [
    'D1-capability-limits',
    'D2-prompt-design',
    'D2-tool-selection',
    'D3-source-verification',
    'D3-fraud-detection',
    'D4-data-privacy',
    'D4-security-governance',
    'D5-usecase-fit',
    'D5-roi-metrics',
    'D6-role-clarity',
  ],
  customerService: [
    'D1-capability-limits',
    'D2-prompt-design',
    'D2-output-refinement',
    'D2-agentic-workflows',
    'D3-source-verification',
    'D3-fraud-detection',
    'D4-data-privacy',
    'D4-security-governance',
    'D6-role-clarity',
    'D6-trust-culture',
  ],
  technical: [
    'D1-genai-mechanics',
    'D1-ai-systems',
    'D2-tool-selection',
    'D2-agentic-workflows',
    'D3-source-verification',
    'D3-data-chart-judgment',
    'D4-security-governance',
    'D4-data-privacy',
    'D5-usecase-fit',
    'D6-learning-loops',
  ],
  operations: [
    'D1-ai-systems',
    'D2-tool-selection',
    'D2-agentic-workflows',
    'D3-data-chart-judgment',
    'D4-security-governance',
    'D5-usecase-fit',
    'D5-roi-metrics',
    'D5-portfolio-prioritization',
    'D6-role-clarity',
    'D6-change-enablement',
  ],
};

const industryPriorityCompetencies: Record<IndustryTrack, string[]> = {
  general: [],
  education: ['D4-data-privacy', 'D4-fairness-ethics', 'D6-change-enablement', 'D6-learning-loops'],
  financial: ['D3-fraud-detection', 'D4-security-governance', 'D4-regulatory-policy', 'D5-roi-metrics'],
  healthcare: ['D4-data-privacy', 'D4-regulatory-policy', 'D4-fairness-ethics', 'D6-role-clarity'],
  retail: ['D3-fraud-detection', 'D3-media-provenance', 'D5-usecase-fit', 'D5-roi-metrics'],
  public: ['D4-regulatory-policy', 'D4-fairness-ethics', 'D4-security-governance', 'D6-trust-culture'],
};

const executivePriorityCompetencies: Record<ExecutiveRole, string[]> = {
  ceo: ['D1-ai-systems', 'D3-source-verification', 'D4-security-governance', 'D5-usecase-fit', 'D5-roi-metrics', 'D5-portfolio-prioritization', 'D5-transformation-strategy', 'D6-trust-culture', 'D6-change-enablement', 'D6-learning-loops'],
  board: ['D1-capability-limits', 'D3-data-chart-judgment', 'D4-regulatory-policy', 'D4-fairness-ethics', 'D4-security-governance', 'D5-roi-metrics', 'D5-portfolio-prioritization', 'D5-transformation-strategy', 'D6-trust-culture'],
  people: ['D2-output-refinement', 'D3-source-verification', 'D4-data-privacy', 'D4-fairness-ethics', 'D4-regulatory-policy', 'D5-usecase-fit', 'D6-role-clarity', 'D6-trust-culture', 'D6-change-enablement', 'D6-learning-loops'],
  finance: ['D1-ai-systems', 'D3-data-chart-judgment', 'D3-fraud-detection', 'D4-regulatory-policy', 'D4-security-governance', 'D5-roi-metrics', 'D5-portfolio-prioritization', 'D5-transformation-strategy', 'D6-role-clarity'],
  technology: ['D1-genai-mechanics', 'D1-ai-systems', 'D2-tool-selection', 'D2-agentic-workflows', 'D3-source-verification', 'D4-data-privacy', 'D4-security-governance', 'D5-portfolio-prioritization', 'D5-transformation-strategy', 'D6-learning-loops'],
  transformation: ['D1-ai-systems', 'D2-agentic-workflows', 'D2-output-refinement', 'D3-source-verification', 'D4-security-governance', 'D5-usecase-fit', 'D5-roi-metrics', 'D5-portfolio-prioritization', 'D5-transformation-strategy', 'D6-change-enablement', 'D6-learning-loops'],
};

const learningRecommendations: LearningRecommendation[] = [
  {
    id: 'chula-ai-ml',
    title: 'ความรู้พื้นฐานเกี่ยวกับ AI และ ML',
    provider: 'CHULA MOOC',
    url: 'https://mooc.chula.ac.th/course-detail/251',
    domains: ['D1', 'D2', 'D3'],
    skills: ['AI/ML foundations', 'GenAI', 'RAG', 'prompting', 'context window', 'hallucination'],
    format: 'Online self-paced, 2h 5m',
    level: 'Starter',
    price: 'Free platform; course page access may depend on registration/quota',
    fit: 'Best first recommendation for users weak in AI foundations, RAG, prompting, and model limits.',
  },
  {
    id: 'chula-ai-governance',
    title: 'ธรรมาภิบาลและการกำกับดูแลปัญญาประดิษฐ์',
    provider: 'CHULA MOOC',
    url: 'https://mooc.chula.ac.th/course-detail/247',
    domains: ['D4', 'D5'],
    skills: ['AI governance', 'risk', 'bias', 'safety', 'regulation'],
    format: 'Online self-paced, 3h 42m',
    level: 'Applied',
    price: 'Free platform; course page price not shown',
    fit: 'Use when D4 risk/governance or executive oversight is below target.',
  },
  {
    id: 'chula-genai-prompt',
    title: 'ปัญญาประดิษฐ์เชิงสร้างสรรค์และกระบวนการสร้างคำสั่ง',
    provider: 'CHULA MOOC',
    url: 'https://mooc.chula.ac.th/course-detail/253',
    domains: ['D2', 'D6'],
    skills: ['prompt engineering', 'creative AI', 'ChatGPT', 'Gemini', 'DALL-E', 'quality review'],
    format: 'Online self-paced, 1h 16m',
    level: 'Starter',
    price: 'Free platform; course page price not shown',
    fit: 'Good for users who know concepts but need practical prompting routines.',
  },
  {
    id: 'aunjai-ai-literacy',
    title: 'Aunjai Cyber: AI Literacy',
    provider: 'Chula + MHESI + AIS',
    url: 'https://www.chula.ac.th/en/news/300241/',
    domains: ['D1', 'D2', 'D4', 'D6'],
    skills: ['everyday AI use', 'safe use', 'creative use', 'ethical use', 'digital resilience'],
    format: 'Free online via Thai MOOC, LearnDi, and Aunjai Cyber app',
    level: 'Starter',
    price: 'Free',
    fit: 'Best broad AI literacy path for general Thai users.',
  },
  {
    id: 'dsd-ai-zero-hero',
    title: '8 หลักสูตรพัฒนาทักษะ AI: From Zero to Hero',
    provider: 'Department of Skill Development + Microsoft',
    url: 'https://www.dsd.go.th/DSD/Activity/ShowDetails/126227?category_id=1',
    domains: ['D1', 'D2'],
    skills: ['AI basics', 'Microsoft AI', 'Copilot', 'developer pathway'],
    format: 'Self-paced online with certificate',
    level: 'Starter',
    price: 'Free',
    fit: 'Strong free workforce option after low D1/D2 results.',
  },
  {
    id: 'tdga-ai',
    title: 'TDGA Public Training and e-Learning',
    provider: 'Thailand Digital Government Academy',
    url: 'https://tdga.dga.or.th/?lang=th',
    domains: ['D1', 'D2', 'D4', 'D5'],
    skills: ['AI tools', 'digital government', 'data governance', 'public-sector adoption'],
    format: 'Online, public, onsite, and in-house training',
    level: 'Applied',
    price: 'Mixed; some public courses paid',
    fit: 'Useful for government, public-sector, and governance-focused users.',
  },
  {
    id: 'arit-genai',
    title: 'Generative AI Foundations',
    provider: 'ARIT',
    url: 'https://www.arit.co.th/courses/generative-ai-foundations',
    domains: ['D1', 'D2', 'D3', 'D4'],
    skills: ['GenAI foundations', 'output verification', 'ethics', 'law', 'bias', 'certification exam'],
    format: 'Onsite, online, or hybrid training with exam',
    level: 'Applied',
    price: 'Paid; schedule shown on provider page',
    fit: 'Good paid bridge from freemium report to cert-oriented learning.',
  },
  {
    id: 'bdi-lead',
    title: 'Big Data and Agentic AI for Strategic Leaders',
    provider: 'BDI LEAD',
    url: 'https://bdi.or.th/news/lead3-final-project-bigdata-agentic-ai/',
    domains: ['D4', 'D5', 'D6'],
    skills: ['agentic AI', 'strategy', 'governance', 'transformation leadership'],
    format: 'Executive cohort / onsite',
    level: 'Executive',
    price: 'Not clearly visible',
    fit: 'Executive recommendation for weak D5/D6 or agent governance gaps.',
  },
  {
    id: 'aitspin-exec-ai',
    title: 'Executive AI Certificate',
    provider: 'AITSPIN',
    url: 'https://aitspin.ait.ac.th/post/applications-open-for-the-aitspin-executive-ai-certificate',
    domains: ['D1', 'D3', 'D4', 'D5', 'D6'],
    skills: ['AI reasoning', 'GenAI and agents', 'governance', 'leadership', 'transformation'],
    format: '105-hour onsite or online executive certificate',
    level: 'Executive',
    price: 'USD 3,200 listed; corporate USD 3,000',
    fit: 'Premium executive path for leaders needing structured, high-touch development.',
  },
  {
    id: 'aiat-super-ai',
    title: 'Super AI Engineer',
    provider: 'AIAT',
    url: 'https://superai.aiat.or.th/en/home/',
    domains: ['D1', 'D2', 'D3', 'D6'],
    skills: ['ML engineering', 'AI projects', 'hackathons', 'internship', 'team practice'],
    format: 'Blended online, bootcamp, hackathon, internship',
    level: 'Advanced',
    price: 'Free application and MOOC courses visible',
    fit: 'Best technical-builder pathway after strong D1 but weak applied D2/D3.',
  },
  {
    id: 'botnoi-agentic-builder',
    title: 'Agentic Builder for Business',
    provider: 'BOTNOI',
    url: 'https://botnoicourse.com/courses/agentic-builder',
    domains: ['D2', 'D5', 'D6'],
    skills: ['AI agents', 'business use cases', 'SME problems', 'project work'],
    format: '4-day onsite regional training',
    level: 'Applied',
    price: 'Free visible on captured page',
    fit: 'Practical agent-building path for users weak in workflows, agents, and value realization.',
  },
  {
    id: 'skooldio-analytics',
    title: 'Data Analytics Bootcamp',
    provider: 'Skooldio',
    url: 'https://landing.skooldio.com/data-analytics-bootcamp',
    domains: ['D2', 'D3', 'D6'],
    skills: ['analytics projects', 'visualization', 'insight communication', 'portfolio'],
    format: 'Hybrid, 18 weeks',
    level: 'Applied',
    price: 'Price not clear on captured page',
    fit: 'Good for users whose practical evidence weakness is data/chart judgment.',
  },
  {
    id: 'skooldio-chatgpt-programming',
    title: 'Generative AI and ChatGPT: Programming Edition',
    provider: 'Skooldio',
    url: 'https://www.skooldio.com/workshops/chatgpt-prog',
    domains: ['D1', 'D2', 'D3'],
    skills: ['ChatGPT programming', 'AI-assisted coding', 'workflow productivity', 'prompting for builders'],
    format: 'Workshop / preorder cohort',
    level: 'Applied',
    price: 'Paid; page showed 1,490 THB promo / 2,490 THB regular',
    fit: 'Technical and developer users who use IDEs, CLI, GitHub, or AI coding tools and need more practical D2/D3 work.',
  },
  {
    id: 'skooldio-executive-mastery',
    title: 'Generative AI Mastery for Executives',
    provider: 'Skooldio',
    url: 'https://www.skooldio.com/workshops/generative-ai-mastery-for-executives',
    domains: ['D1', 'D4', 'D5', 'D6'],
    skills: ['AI fluency', 'AI transformation', 'executive use cases', 'governance', 'change leadership'],
    format: 'Onsite executive workshop',
    level: 'Executive',
    price: 'Paid; page showed 19,900 THB',
    fit: 'Executive users with D5/D6 gaps or low confidence in AI transformation and governance decisions.',
  },
  {
    id: 'skooldio-marketing-transformation',
    title: 'Generative AI for Marketing Transformation',
    provider: 'Skooldio',
    url: 'https://www.skooldio.com/workshops/Generative-ai-for-marketing',
    domains: ['D2', 'D3', 'D4', 'D5'],
    skills: ['campaign workflows', 'creative AI', 'marketing transformation', 'brand risk', 'measurement'],
    format: 'Onsite marketing workshop',
    level: 'Applied',
    price: 'Paid; page showed 39,900 THB for upcoming batch',
    fit: 'Marketing users whose profile signals include creative/campaign work or whose scores show weak media provenance, claims, or ROI judgment.',
  },
  {
    id: 'skooldio-unlock-ai-prompting',
    title: 'Unlock AI with Prompt Engineering',
    provider: 'Skooldio',
    url: 'https://www.skooldio.com/courses/bdi-unlock-ai-with-prompt-engineering',
    domains: ['D1', 'D2', 'D6'],
    skills: ['prompt engineering', 'ChatGPT', 'Claude', 'Gemini', 'daily AI use', 'practical examples'],
    format: 'Online course',
    level: 'Starter',
    price: 'Free course page visible',
    fit: 'General users who need practical prompting foundations before deeper adaptive assessment.',
  },
  {
    id: 'skilllane-ai-literacy',
    title: 'AI Literacy ปฏิวัติตัวเองด้วยทักษะความฉลาดทางเอไอ',
    provider: 'SkillLane',
    url: 'https://www.skilllane.com/courses/AI_Literacy',
    domains: ['D1', 'D2', 'D4', 'D6'],
    skills: ['AI literacy', 'mindset', 'prompt', 'workflow', 'safety', 'no-code AI use'],
    format: 'Online course',
    level: 'Starter',
    price: 'Paid/free status not clear on captured page',
    fit: 'General, student, creator, and non-technical professional users who need a broad practical AI-literacy path.',
  },
  {
    id: 'skilllane-chatgpt-digital-era',
    title: 'ChatGPT AI ผู้ช่วยงานอัจฉริยะในยุคดิจิทัล',
    provider: 'SkillLane',
    url: 'https://www.skilllane.com/courses/chatGPT-AI-in-digital-era',
    domains: ['D1', 'D2', 'D6'],
    skills: ['ChatGPT basics', 'prompting', 'work productivity', 'tool choice', 'personal and business use'],
    format: 'Online course',
    level: 'Starter',
    price: 'Paid/free status not clear on captured page',
    fit: 'Broad beginner recommendation for users with low D1/D2 confidence or little weekly AI usage.',
  },
  {
    id: 'skilllane-prompt-engineer',
    title: 'เรียนใช้งาน ChatGPT และเขียน Prompt จากเริ่มต้นสู่มืออาชีพ',
    provider: 'SkillLane',
    url: 'https://www.skilllane.com/courses/chatgpt-prompt-engineer-for-everyone',
    domains: ['D1', 'D2', 'D3'],
    skills: ['prompt engineering', 'analysis', 'productivity', 'ChatGPT workflow', 'quality checking'],
    format: 'Online course',
    level: 'Applied',
    price: 'Paid/free status not clear on captured page',
    fit: 'Users who know basic AI tools but need more reliable prompts, analysis routines, and output checking.',
  },
  {
    id: 'skilllane-vibecoding-codex',
    title: 'AI Productivity & Vibe Coding with ChatGPT + Codex',
    provider: 'SkillLane',
    url: 'https://www.skilllane.com/courses/VibeCoding-ChatGPT-Codex',
    domains: ['D1', 'D2', 'D5', 'D6'],
    skills: ['ChatGPT', 'Codex', 'automation', 'website building', 'natural-language development', 'productivity'],
    format: 'Online course',
    level: 'Applied',
    price: 'Paid/free status not clear on captured page',
    fit: 'Developer, technical, and ambitious power users who want practical AI-building and automation experience.',
  },
  {
    id: 'skilllane-chatgpt-business',
    title: 'ChatGPT กับการนำไปใช้ในธุรกิจ',
    provider: 'SkillLane',
    url: 'https://www.skilllane.com/courses/ChatGPT-for-Business',
    domains: ['D1', 'D2', 'D5', 'D6'],
    skills: ['business use cases', 'AI literacy', 'prompting', 'organizational application', 'Claude community'],
    format: 'Online course',
    level: 'Applied',
    price: 'Paid/free status not clear on captured page',
    fit: 'Managers and business users who need to translate AI readiness into practical business applications.',
  },
  {
    id: 'skilllane-ai-ml-chatgpt',
    title: 'AI & Machine Learning with ChatGPT',
    provider: 'SkillLane',
    url: 'https://www.skilllane.com/courses/AI-and-Machine-Learning-with-ChatGPT',
    domains: ['D1', 'D2', 'D3'],
    skills: ['AI algorithms', 'machine learning basics', 'ChatGPT for programming', 'AI project checking'],
    format: 'Online course',
    level: 'Advanced',
    price: 'Paid/free status not clear on captured page',
    fit: 'Technical learners who need stronger AI/ML foundations and practical project literacy.',
  },
  {
    id: 'coursera-genai-everyone',
    title: 'Generative AI for Everyone',
    provider: 'DeepLearning.AI / Coursera',
    url: 'https://www.coursera.org/learn/generative-ai-for-everyone/',
    domains: ['D1', 'D2', 'D4', 'D5'],
    skills: ['GenAI basics', 'prompting', 'RAG', 'fine-tuning', 'tool use and agents', 'business impact'],
    format: 'Online self-paced, about 6 hours',
    level: 'Starter',
    price: 'Free enrollment / paid certificate options may apply',
    fit: 'Strong global baseline for general users, leaders, and professionals who need a concise AI readiness foundation.',
  },
  {
    id: 'coursera-ibm-genai-fundamentals',
    title: 'Generative AI Fundamentals Specialization',
    provider: 'IBM Skills Network / Coursera',
    url: 'https://www.coursera.org/specializations/generative-ai-for-everyone',
    domains: ['D1', 'D2', 'D3', 'D4'],
    skills: ['foundation models', 'prompt engineering', 'OpenAI', 'Hugging Face', 'ethics', 'workplace adoption'],
    format: 'Online specialization, 5-course series',
    level: 'Applied',
    price: 'Free enrollment / paid certificate options may apply',
    fit: 'Users who want a longer hands-on pathway covering text, image, code, prompting, and responsible use.',
  },
  {
    id: 'coursera-advanced-prompting',
    title: 'Advanced Prompt Engineering for Everyone',
    provider: 'Vanderbilt University / Coursera',
    url: 'https://www.coursera.org/learn/advanced-prompt-engineering-for-everyone/',
    domains: ['D2', 'D3', 'D6'],
    skills: ['prompt patterns', 'context engineering', 'RAG', 'structured outputs', 'AI personalization'],
    format: 'Online self-paced, about 9 hours',
    level: 'Advanced',
    price: 'Free enrollment / paid certificate options may apply',
    fit: 'Applied users with weak D2 output refinement or D3 evidence-checking who need more structured prompt control.',
  },
  {
    id: 'deeplearning-ai-prompting-everyone',
    title: 'AI Prompting for Everyone',
    provider: 'DeepLearning.AI',
    url: 'https://www.deeplearning.ai/courses/ai-prompting-for-everyone',
    domains: ['D1', 'D2', 'D3', 'D6'],
    skills: ['web search with sources', 'multimodal prompting', 'code and media prompting', 'daily AI workflows'],
    format: 'Online course',
    level: 'Applied',
    price: 'Provider page; pricing may vary',
    fit: 'General and professional users who already tried AI tools and need more practical, source-aware prompting.',
  },
  {
    id: 'aieat-ai-executives',
    title: 'AI for Executives - ปัญญาประดิษฐ์สำหรับผู้บริหาร',
    provider: 'AIEAT',
    url: 'https://aieat.or.th/ai-for-executives/',
    domains: ['D1', 'D4', 'D5', 'D6'],
    skills: ['executive AI literacy', 'strategy', 'AI entrepreneurship', 'governance', 'business adoption'],
    format: 'Executive program / association training',
    level: 'Executive',
    price: 'Not clearly visible on captured page',
    fit: 'Thai executive users who need local ecosystem context and leadership-level AI readiness.',
  },
];

const generalRelianceQuestions: Question[] = [
  {
    id: 'REL-G-D2-001',
    domain: 'D2',
    difficulty: 'awareness',
    type: 'reliance-decision',
    interaction: 'single',
    visualStimulus: {
      kind: 'memo',
      eyebrow: 'Task ownership',
      title: 'Reply to a Simple Scheduling Email',
      caption: 'Low-risk drafting is a good AI assist, but you still check the details.',
      points: ['Email: Can Tuesday 2 PM work?', 'Calendar: open', 'Need: polite reply', 'Risk: low'],
    },
    stimulus: {
      src: '/stimuli/realistic-scheduling-email.png',
      alt: 'Realistic email and calendar screenshot with a client scheduling request, weak AI draft, and missing prompt details.',
      label: 'Email and calendar artifact',
      caption: 'Use the email and calendar evidence to decide how much of the reply can be delegated.',
    },
    context: 'You need to reply quickly to a simple meeting request.',
    prompt: 'Who should do the task?',
    options: [
      { ...relianceOptions.me, score: 65, feedback: 'Safe but slower. AI can draft this because the stakes are low and easy to check.' },
      { ...relianceOptions.together, score: 95, feedback: 'Best. Let AI draft, then verify time, tone, and link before sending.' },
      { ...relianceOptions.ai, score: 60, feedback: 'Almost fine for low stakes, but you should still confirm the calendar and recipient.' },
    ],
  },
  {
    id: 'REL-G-D3-002',
    domain: 'D3',
    difficulty: 'applied',
    type: 'reliance-decision',
    interaction: 'single',
    visualStimulus: {
      kind: 'post',
      eyebrow: 'Task ownership',
      title: 'Share a Viral Disaster Photo',
      caption: 'Fast sharing can spread false claims. Verification is part of the task.',
      points: ['Image: dramatic flooding', 'Caption: happened today', 'Source: unknown', 'Emotion: urgent'],
      metrics: [
        { label: 'Source', value: 'Unknown', status: 'bad' },
        { label: 'Date proof', value: 'Missing', status: 'bad' },
        { label: 'Emotion', value: 'Urgent', status: 'warn' },
      ],
      flags: ['Reverse image search needed', 'Check original source', 'Verify date and location'],
    },
    stimulus: {
      src: '/stimuli/flood-station-social-post.png',
      alt: 'Realistic social post screenshot showing flooding near a station with an uncertain same-day caption.',
      label: 'Station flood post',
      caption: 'Inspect the post for source, date, location, and emotional pressure before sharing.',
    },
    context: 'A group chat asks whether to repost a dramatic image.',
    prompt: 'Who should decide?',
    options: [
      { ...relianceOptions.me, score: 75, feedback: 'Human judgment matters, but AI can help list verification checks.' },
      { ...relianceOptions.together, score: 98, feedback: 'Correct. Use AI to plan checks, then verify source, date, location, and evidence yourself.' },
      { ...relianceOptions.ai, score: 15, feedback: 'Too risky. AI may miss context or invent confidence about the image.' },
    ],
  },
  {
    id: 'REL-G-D4-003',
    domain: 'D4',
    difficulty: 'applied',
    type: 'reliance-decision',
    interaction: 'single',
    visualStimulus: {
      kind: 'risk',
      eyebrow: 'Task ownership',
      title: 'Paste Medical Records Into Chat',
      caption: 'Private data and high-impact advice require tight boundaries.',
      points: ['File: lab report', 'Data: name and ID', 'Tool: public chatbot', 'Decision: what to do next'],
      metrics: [
        { label: 'Privacy', value: 'High', status: 'bad' },
        { label: 'Impact', value: 'High', status: 'bad' },
        { label: 'AI role', value: 'Limited', status: 'warn' },
      ],
      flags: ['Personal ID visible', 'Health decision', 'Public tool'],
    },
    stimulus: {
      src: '/stimuli/medical-record-redacted.svg',
      alt: 'Medical lab report with personal identifiers visible next to a public AI chat upload warning.',
      label: 'Medical record artifact',
      caption: 'The visual shows why private data and high-impact advice change the allowed AI role.',
    },
    context: 'A family member asks AI to interpret a medical report with personal details.',
    prompt: 'Who should do the task?',
    options: [
      { ...relianceOptions.me, score: 78, feedback: 'Keeping sensitive data out of a public tool is wise, but professional help may be needed too.' },
      { ...relianceOptions.together, score: 60, feedback: 'Only if data is protected, de-identified, and the output is treated as preparation for a clinician conversation.' },
      { ...relianceOptions.ai, score: 5, feedback: 'Unsafe. Do not fully delegate private, health-related interpretation to a public AI tool.' },
    ],
  },
  {
    id: 'REL-G-D1-004',
    domain: 'D1',
    difficulty: 'awareness',
    type: 'reliance-decision',
    interaction: 'single',
    visualStimulus: {
      kind: 'memo',
      eyebrow: 'Task ownership',
      title: 'Explain a Confusing Term',
      caption: 'AI is useful for first-pass explanation when the user checks meaning before acting.',
      points: ['Term: retrieval augmented generation', 'Need: plain language', 'Use: understand a meeting', 'Risk: low'],
      metrics: [
        { label: 'Risk', value: 'Low', status: 'good' },
        { label: 'Need', value: 'Learn', status: 'good' },
        { label: 'Check', value: 'Light', status: 'warn' },
      ],
      chartBars: [
        { label: 'Use AI for explanation', value: 82, note: 'Good fit' },
        { label: 'Need expert sign-off', value: 24, note: 'Low stakes' },
      ],
    },
    context: 'You heard an AI term in a meeting and want a simple explanation.',
    prompt: 'Who should handle it?',
    options: [
      { ...relianceOptions.me, score: 55, feedback: 'You can research manually, but AI is useful for a low-risk first explanation.' },
      { ...relianceOptions.together, score: 98, feedback: 'Correct. Ask AI for a plain explanation, then compare it with a reliable source if the term affects a decision.' },
      { ...relianceOptions.ai, score: 70, feedback: 'Mostly fine for learning, but do not treat one AI answer as the final authority.' },
    ],
  },
  {
    id: 'REL-G-D5-005',
    domain: 'D5',
    difficulty: 'applied',
    type: 'reliance-decision',
    interaction: 'single',
    visualStimulus: {
      kind: 'portfolio',
      eyebrow: 'Task ownership',
      title: 'Choose the First AI Pilot',
      caption: 'AI can structure options, but people own value, risk, and priority decisions.',
      points: ['Ideas: four', 'Budget: one pilot', 'Metrics: unclear', 'Owner: not named'],
      metrics: [
        { label: 'Value clarity', value: 'Mixed', status: 'warn' },
        { label: 'Risk review', value: 'Open', status: 'bad' },
        { label: 'Owner', value: 'Missing', status: 'bad' },
      ],
      chartBars: [
        { label: 'Customer FAQ bot', value: 74, note: 'Clear pain' },
        { label: 'Meeting summaries', value: 48, note: 'Easy, lower value' },
        { label: 'Pricing autopilot', value: 86, note: 'High risk' },
        { label: 'Policy search', value: 68, note: 'Good starter' },
      ],
      flags: ['No success metric', 'Risk varies by use case', 'Decision owner absent'],
    },
    stimulus: {
      src: '/stimuli/ai-pilot-workflow.svg',
      alt: 'AI pilot workflow map showing missing review loop and unclear approval step.',
      label: 'Workflow artifact',
      caption: 'Use the workflow map to decide who owns pilot prioritization and review.',
    },
    context: 'Your team has several AI ideas and only time for one experiment.',
    prompt: 'Who should choose?',
    options: [
      { ...relianceOptions.me, score: 70, feedback: 'Human ownership is right, but AI can help compare options against explicit criteria.' },
      { ...relianceOptions.together, score: 98, feedback: 'Correct. Use AI to organize evidence, then choose based on value, feasibility, risk, and learning.' },
      { ...relianceOptions.ai, score: 10, feedback: 'Too much delegation. AI cannot own strategy, risk appetite, or tradeoffs for the team.' },
    ],
  },
  {
    id: 'REL-G-D6-006',
    domain: 'D6',
    difficulty: 'awareness',
    type: 'reliance-decision',
    interaction: 'single',
    visualStimulus: {
      kind: 'memo',
      eyebrow: 'Task ownership',
      title: 'Give Feedback to a Coworker',
      caption: 'AI can help with wording, but relationship judgment stays human.',
      points: ['Issue: missed deadline', 'Need: respectful tone', 'Relationship: ongoing', 'Risk: trust'],
    },
    context: 'You need to write sensitive feedback to a coworker.',
    prompt: 'Who should do the task?',
    options: [
      { ...relianceOptions.me, score: 72, feedback: 'Human care matters, but AI can help make wording clearer and less reactive.' },
      { ...relianceOptions.together, score: 98, feedback: 'Correct. Use AI for a draft, then revise with your own context, empathy, and accountability.' },
      { ...relianceOptions.ai, score: 15, feedback: 'Too risky. AI should not fully own sensitive relationship communication.' },
    ],
  },
];

const executiveRelianceQuestions: Question[] = [
  {
    id: 'REL-E-D5-001',
    domain: 'D5',
    difficulty: 'applied',
    type: 'reliance-decision',
    interaction: 'single',
    visualStimulus: {
      kind: 'portfolio',
      eyebrow: 'Executive ownership',
      title: 'Prioritize the AI Portfolio',
      caption: 'AI can prepare evidence, but executives own value and risk tradeoffs.',
      points: ['12 use cases', 'Two high-risk automations', 'Budget cap', 'Board asks for priorities'],
      metrics: [
        { label: 'Budget', value: 'Capped', status: 'warn' },
        { label: 'Risk tier', value: 'Mixed', status: 'bad' },
        { label: 'Decision', value: 'Board', status: 'warn' },
      ],
      chartBars: [
        { label: 'Customer response', value: 72, note: 'Ready' },
        { label: 'Credit exceptions', value: 88, note: 'High risk' },
        { label: 'Internal summaries', value: 42, note: 'Low value' },
        { label: 'Forecast automation', value: 79, note: 'Needs controls' },
      ],
      flags: ['Two items need governance gate', 'Value and risk not normalized'],
    },
    context: 'The leadership team must choose which AI initiatives get funded next quarter.',
    prompt: 'Who should own the decision?',
    options: [
      { id: 'me', label: 'Executive: decide from judgment alone.', score: 55, feedback: 'Executives own the decision, but evidence structuring should not be skipped.' },
      { id: 'together', label: 'Together: AI structures evidence, executives decide.', score: 98, feedback: 'Correct. AI can organize value, readiness, and risk; leaders own the tradeoff.' },
      { id: 'ai', label: 'AI: rank and approve the portfolio automatically.', score: 5, feedback: 'Unsafe. Portfolio governance and risk appetite are executive responsibilities.' },
    ],
  },
  {
    id: 'REL-E-D4-002',
    domain: 'D4',
    difficulty: 'proficient',
    type: 'reliance-decision',
    interaction: 'single',
    visualStimulus: {
      kind: 'risk',
      eyebrow: 'Executive ownership',
      title: 'Respond to a Data Incident',
      caption: 'AI can accelerate triage, but accountability and communications require human authority.',
      points: ['Customer data exposed', 'Regulator clock started', 'Press inquiry pending', 'Root cause unclear'],
      metrics: [
        { label: 'Exposure', value: 'Live', status: 'bad' },
        { label: 'Clock', value: 'Started', status: 'bad' },
        { label: 'Root cause', value: 'Unknown', status: 'warn' },
      ],
      flags: ['Containment first', 'Do not auto-send messages', 'Preserve audit trail'],
    },
    context: 'An AI workflow exposed confidential customer data to the wrong audience.',
    prompt: 'Who should lead?',
    options: [
      { id: 'me', label: 'Executive/legal team only.', score: 70, feedback: 'Human leadership is essential, but AI can support timeline reconstruction and evidence gathering.' },
      { id: 'together', label: 'Together: AI supports triage, executives own response.', score: 98, feedback: 'Correct. Use AI for controlled analysis while humans own notification, remediation, and accountability.' },
      { id: 'ai', label: 'AI: draft and send all incident messages.', score: 5, feedback: 'Unsafe. High-stakes communication must not be delegated end to end.' },
    ],
  },
  {
    id: 'REL-E-D6-003',
    domain: 'D6',
    difficulty: 'applied',
    type: 'reliance-decision',
    interaction: 'single',
    visualStimulus: {
      kind: 'memo',
      eyebrow: 'Executive ownership',
      title: 'Announce Role Redesign',
      caption: 'AI can test clarity, but leaders must own the human message.',
      points: ['AI changes workflows', 'Employees fear replacement', 'Managers need guidance', 'Union asks for clarity'],
    },
    context: 'A new AI program will change how teams divide work.',
    prompt: 'Who should write the message?',
    options: [
      { id: 'me', label: 'Executive: write and own the message.', score: 78, feedback: 'Leadership ownership is required, though AI can help test clarity and possible misunderstandings.' },
      { id: 'together', label: 'Together: AI drafts scenarios, executives write final.', score: 98, feedback: 'Correct. AI can support preparation; leaders own trust, tone, and commitments.' },
      { id: 'ai', label: 'AI: generate and publish the announcement.', score: 5, feedback: 'Unsafe. This would make a sensitive people decision feel outsourced.' },
    ],
  },
  {
    id: 'REL-E-D3-004',
    domain: 'D3',
    difficulty: 'proficient',
    type: 'reliance-decision',
    interaction: 'single',
    visualStimulus: {
      kind: 'report',
      eyebrow: 'Executive ownership',
      title: 'Use an AI Forecast in Guidance',
      caption: 'Forecasts need challenge, uncertainty, and human accountability.',
      points: ['Revenue forecast: +18%', 'Confidence: high', 'Back-test: missing', 'Investor call: tomorrow'],
      metrics: [
        { label: 'Forecast', value: '+18%', status: 'warn' },
        { label: 'Back-test', value: 'Missing', status: 'bad' },
        { label: 'Deadline', value: 'Tomorrow', status: 'bad' },
      ],
      chartBars: [
        { label: 'Model confidence', value: 91, note: 'Unverified' },
        { label: 'Evidence readiness', value: 33, note: 'Weak' },
        { label: 'Disclosure risk', value: 84, note: 'High' },
      ],
      flags: ['Confidence is not proof', 'No uncertainty range', 'No validation trail'],
    },
    context: 'Leadership wants to use an AI revenue forecast in investor guidance.',
    prompt: 'Who should decide?',
    options: [
      { id: 'me', label: 'Executive/finance: decide after evidence review.', score: 82, feedback: 'Strong. AI may support analysis, but accountable leaders must challenge assumptions.' },
      { id: 'together', label: 'Together: AI analyzes scenarios, leaders decide disclosure.', score: 98, feedback: 'Correct. Use AI for scenario work while humans own investor-facing judgment.' },
      { id: 'ai', label: 'AI: publish the forecast if confidence is high.', score: 5, feedback: 'Unsafe. Model confidence is not disclosure-grade evidence.' },
    ],
  },
  {
    id: 'REL-E-D1-005',
    domain: 'D1',
    difficulty: 'awareness',
    type: 'reliance-decision',
    interaction: 'single',
    visualStimulus: {
      kind: 'memo',
      eyebrow: 'Executive ownership',
      title: 'Explain Agentic AI to the Board',
      caption: 'Executives should understand enough to ask the right control questions.',
      points: ['Agent can plan', 'Agent can use tools', 'Agent can act', 'Controls determine authority'],
    },
    context: 'The board asks what makes an AI agent different from a chatbot.',
    prompt: 'Who should explain it?',
    options: [
      { id: 'me', label: 'Executive: explain from current understanding.', score: 65, feedback: 'Helpful, but executives should verify technical claims before presenting.' },
      { id: 'together', label: 'Together: AI helps draft, executive validates and explains.', score: 98, feedback: 'Correct. Leaders can use AI to prepare, but must understand and own the explanation.' },
      { id: 'ai', label: 'AI: present directly to the board.', score: 20, feedback: 'Too much delegation. The board needs accountable leadership judgment.' },
    ],
  },
  {
    id: 'REL-E-D2-006',
    domain: 'D2',
    difficulty: 'applied',
    type: 'reliance-decision',
    interaction: 'single',
    visualStimulus: {
      kind: 'dashboard',
      eyebrow: 'Executive ownership',
      title: 'Approve Agent Tool Access',
      caption: 'Operational convenience must be matched with authority boundaries.',
      points: ['Reads files', 'Updates CRM', 'Sends emails', 'Requests finance approvals'],
    },
    stimulus: {
      src: '/stimuli/agent-tool-trace.svg',
      alt: 'AI agent trace with broad file access, email drafting, CRM update, and finance approval without clear gates.',
      label: 'Agent trace artifact',
      caption: 'Inspect the tool trace before deciding who can approve agent access.',
    },
    context: 'A business unit wants an AI agent to operate across multiple systems.',
    prompt: 'Who should approve access?',
    options: [
      { id: 'me', label: 'Executive/owners: approve manually without AI input.', score: 70, feedback: 'Accountability is right, but AI can help map risks and missing controls.' },
      { id: 'together', label: 'Together: AI maps risks, owners approve bounded access.', score: 98, feedback: 'Correct. Use AI to structure the review; humans set permissions and escalation rules.' },
      { id: 'ai', label: 'AI: grant itself tools as needed.', score: 0, feedback: 'Unsafe. Agents must not self-authorize high-impact tools.' },
    ],
  },
];

const functionalQuestionBank: Question[] = [
  {
    id: 'FUNC-PEOPLE-D4-001',
    domain: 'D4',
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'multi',
    functionTracks: ['people'],
    context: 'An AI screening summary recommends Candidate A as the best culture fit. The raw packet includes competency evidence and notes for two candidates.',
    stimulus: {
      src: '/stimuli/raw-hr-candidate-packet.svg',
      alt: 'Raw candidate screening packet comparing Candidate A and Candidate B with evidence notes and a culture fit risk flag.',
      label: 'Raw candidate packet',
      caption: 'Inspect the evidence and decide what an HR reviewer should challenge before advancing a candidate.',
    },
    prompt: 'Which issues should HR flag before using the AI recommendation?',
    correctOptionIds: ['a', 'b', 'c'],
    options: [
      { id: 'a', label: 'Culture fit is not tied to job-relevant evidence.', score: 33, feedback: 'Correct. Proxy language can hide bias or weak criteria.' },
      { id: 'b', label: 'Candidate B has stronger work-sample evidence.', score: 33, feedback: 'Correct. The raw evidence contradicts a simple recommendation.' },
      { id: 'c', label: 'Availability should be treated as a tradeoff, not the main skill signal.', score: 33, feedback: 'Correct. Start date matters, but it should not replace capability evidence.' },
      { id: 'd', label: 'The AI should choose the finalist to reduce interviewer workload.', score: 0, feedback: 'High-impact people decisions require human accountability.' },
    ],
  },
  {
    id: 'FUNC-FIN-D3-001',
    domain: 'D3',
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'single',
    functionTracks: ['finance'],
    context: 'An AI finance summary says marketing overspend is the main reason margin missed target.',
    stimulus: {
      src: '/stimuli/raw-finance-variance-report.svg',
      alt: 'Raw finance variance report showing marketing spend, cloud compute, support revenue, and non-recurring vendor credits.',
      label: 'Raw variance report',
      caption: 'Inspect all line items before accepting the AI conclusion.',
    },
    prompt: 'What is the strongest critique of the AI summary?',
    options: [
      { id: 'a', label: 'It isolates marketing while larger compute and revenue variances are visible.', score: 98, feedback: 'Correct. The evidence points to multiple material drivers.' },
      { id: 'b', label: 'It should focus only on the line with the clearest narrative.', score: 20, feedback: 'A clean narrative can still be materially incomplete.' },
      { id: 'c', label: 'It should count vendor credits as recurring savings.', score: 15, feedback: 'The report says the credit is one-time.' },
      { id: 'd', label: 'It should hide uncertainty until the next close cycle.', score: 25, feedback: 'Finance users should surface uncertainty and missing baselines.' },
    ],
  },
  {
    id: 'FUNC-MKT-D3-001',
    domain: 'D3',
    difficulty: 'applied',
    type: 'media',
    interaction: 'single',
    functionTracks: ['marketing'],
    context: 'An AI campaign assistant recommends scaling Ad Set C because it has the highest conversion rate.',
    stimulus: {
      src: '/stimuli/raw-marketing-campaign-dashboard.svg',
      alt: 'Raw marketing campaign dashboard with Ad Set C showing high conversion rate but tiny sample and coupon leak note.',
      label: 'Raw campaign dashboard',
      caption: 'Inspect sample size and quality notes before accepting the AI recommendation.',
    },
    prompt: 'What should the marketer check before scaling?',
    options: [
      { id: 'a', label: 'Sample size, traffic quality, coupon anomaly, and incrementality.', score: 98, feedback: 'Correct. A high rate on weak evidence can be misleading.' },
      { id: 'b', label: 'Only the headline conversion rate because it is highest.', score: 20, feedback: 'The highest rate is not enough when sample quality is weak.' },
      { id: 'c', label: 'Whether the chart colors make Ad Set C stand out.', score: 15, feedback: 'Visual emphasis is not decision-grade evidence.' },
      { id: 'd', label: 'Whether the AI can write a better ad headline.', score: 35, feedback: 'Creative quality may matter later, but the scaling decision needs evidence checks first.' },
    ],
  },
  {
    id: 'FUNC-OPS-D6-001',
    domain: 'D6',
    difficulty: 'applied',
    type: 'narrative',
    interaction: 'text',
    functionTracks: ['operations'],
    context: 'A support agent receives an AI draft that denies a refund. The raw ticket includes a payment retry, duplicate capture, and refund policy exception.',
    stimulus: {
      src: '/stimuli/raw-support-ticket-thread.svg',
      alt: 'Raw support ticket thread showing customer complaint, system payment log, policy note, and flawed AI draft.',
      label: 'Raw support ticket',
      caption: 'Inspect the ticket evidence and write the safer customer response.',
    },
    prompt: 'Write 2-4 sentences explaining what the support agent should do next.',
    rubricCriteria: [
      { id: 'log', label: 'Uses the system log as evidence', keywords: ['log', 'duplicate', 'capture', 'payment', 'retry'], points: 26 },
      { id: 'policy', label: 'Applies the refund policy exception', keywords: ['policy', 'refund', 'exception', 'duplicate'], points: 26 },
      { id: 'tone', label: 'Keeps customer communication clear and accountable', keywords: ['apologize', 'sorry', 'case', 'clear', 'explain'], points: 20 },
      { id: 'verify', label: 'Requires verification before final action', keywords: ['verify', 'confirm', 'check', 'payment'], points: 26 },
    ],
    exemplarAnswer: 'The agent should not send the denial. The system log shows a duplicate payment capture, and the policy says duplicate charges should be refunded after verification. Verify the payment, apologize, give a case ID, and explain the next step to the customer.',
    options: [],
  },
  {
    id: 'FUNC-TECH-D4-001',
    domain: 'D4',
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'multi',
    functionTracks: ['technical'],
    context: 'An incident assistant used several tool connectors during triage. The raw access log shows allowed, blocked, and out-of-scope attempts.',
    stimulus: {
      src: '/stimuli/raw-technical-access-log.svg',
      alt: 'Raw technical access log showing payment log access, attempted HR notes access, vendor email block, secrets access denial, and public status gate.',
      label: 'Raw connector log',
      caption: 'Inspect the tool calls and identify which controls are working or still need review.',
    },
    prompt: 'Which controls should the technical owner preserve or strengthen?',
    correctOptionIds: ['a', 'b', 'c', 'd'],
    options: [
      { id: 'a', label: 'Keep human gates for external emails and public updates.', score: 25, feedback: 'Correct. Outbound and public actions need approval.' },
      { id: 'b', label: 'Investigate attempted HR-note and secrets access.', score: 25, feedback: 'Correct. Out-of-scope attempts are important audit signals.' },
      { id: 'c', label: 'Scope incident tools to the minimum needed systems.', score: 25, feedback: 'Correct. Least privilege reduces blast radius.' },
      { id: 'd', label: 'Preserve the log for audit and post-incident tuning.', score: 25, feedback: 'Correct. Logs support both accountability and improvement.' },
      { id: 'e', label: 'Remove blocks so the agent can resolve incidents faster.', score: 0, feedback: 'Speed should not erase access boundaries.' },
    ],
  },
  {
    id: 'FUNC-GEN-D5-001',
    domain: 'D5',
    difficulty: 'proficient',
    type: 'drag-order',
    interaction: 'rank',
    functionTracks: ['general', 'people', 'finance', 'marketing', 'sales', 'customerService', 'technical', 'operations'],
    context: 'A function lead wants to choose one AI workflow pilot from several ideas with different value, risk, and readiness levels.',
    stimulus: {
      src: '/stimuli/ai-pilot-workflow.svg',
      alt: 'AI pilot workflow map with review loop and approval gaps.',
      label: 'Pilot workflow artifact',
      caption: 'Use the workflow evidence to sequence a practical pilot decision.',
    },
    prompt: 'Order the pilot decision steps.',
    rankItems: [
      { id: 'workflow', label: 'Define the workflow problem and users affected' },
      { id: 'baseline', label: 'Capture baseline time, quality, risk, and volume' },
      { id: 'controls', label: 'Set review gates, data boundaries, and owner' },
      { id: 'pilot', label: 'Run a time-boxed pilot with success and stop criteria' },
    ],
    idealOrder: ['workflow', 'baseline', 'controls', 'pilot'],
    options: [
      { id: 'rank', label: 'Order pilot steps from problem evidence to controlled test.', score: 98, feedback: 'Correct. Function-level pilots need workflow fit, baseline evidence, controls, and learning criteria.' },
    ],
  },
  {
    id: 'FUNC-EXP-PEOPLE-D3-001',
    domain: 'D3',
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'single',
    functionTracks: ['people'],
    context: 'An HR generalist asks AI to answer a manager question about PTO carryover. The AI cites an older draft comment even though a newer approved policy is visible.',
    stimulus: {
      src: '/stimuli/func-exp-people-policy-packet.svg',
      alt: 'Raw People Ops packet with approved PTO policy, older draft note, AI answer, candidate screening extract, and compliance note.',
      label: 'People Ops policy packet',
      caption: 'Inspect the approved policy, stale draft note, and AI answer before deciding whether to use it.',
    },
    prompt: 'What is the strongest critique of the AI answer?',
    options: [
      { id: 'a', label: 'It relies on a stale draft while the approved policy gives a different limit.', score: 98, feedback: 'Correct. The answer is grounded in the wrong source version.' },
      { id: 'b', label: 'It is concise but still needs manager-facing examples.', score: 45, feedback: 'Examples may help, but source freshness is the decisive failure.' },
      { id: 'c', label: 'It should avoid manager guidance until every edge case is known.', score: 35, feedback: 'Managers can receive guidance when it is current and bounded.' },
      { id: 'd', label: 'It should average the old and new carryover limits.', score: 15, feedback: 'Averaging conflicting policy versions invents a rule.' },
    ],
  },
  {
    id: 'FUNC-EXP-PEOPLE-D4-002',
    domain: 'D4',
    difficulty: 'proficient',
    type: 'multi-select',
    interaction: 'multi',
    functionTracks: ['people'],
    context: 'A hiring manager wants to accept the AI label that Candidate 18 is the top fit. The packet includes competency evidence and proxy language.',
    stimulus: {
      src: '/stimuli/func-exp-people-policy-packet.svg',
      alt: 'Raw People Ops packet showing candidate notes, work sample status, AI fit label, and compliance note about proxy language.',
      label: 'Candidate calibration extract',
      caption: 'Select the controls that keep AI-assisted hiring grounded in job-relevant evidence.',
    },
    prompt: 'Which actions should the People lead require before using the AI recommendation?',
    correctOptionIds: ['a', 'b', 'c'],
    options: [
      { id: 'a', label: 'Map each recommendation to scorecard and work-sample evidence.', score: 34, feedback: 'Correct. Hiring recommendations need job-relevant support.' },
      { id: 'b', label: 'Challenge proxy phrases such as culture fit or similarity.', score: 33, feedback: 'Correct. These can hide bias or irrelevant criteria.' },
      { id: 'c', label: 'Keep the manager accountable and document override rationale.', score: 33, feedback: 'Correct. Human accountability and traceability are required.' },
      { id: 'd', label: 'Prefer the candidate with the most confident AI label.', score: 0, feedback: 'Model confidence is not a substitute for validated evidence.' },
      { id: 'e', label: 'Remove work-sample comparisons to reduce friction.', score: 0, feedback: 'Work samples are relevant evidence, not something to suppress.' },
    ],
  },
  {
    id: 'FUNC-EXP-FIN-D3-001',
    domain: 'D3',
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'single',
    functionTracks: ['finance'],
    context: 'An AI close comment says paid media is the main cause of the margin miss and vendor savings offset the rest.',
    stimulus: {
      src: '/stimuli/func-exp-finance-workbook.svg',
      alt: 'Raw finance workbook showing budget, actuals, variances, AI notes, and controller flags for Q3 close.',
      label: 'Q3 close workbook',
      caption: 'Inspect recurring and non-recurring drivers before accepting the close narrative.',
    },
    prompt: 'Which revision would make the close comment most decision-grade?',
    options: [
      { id: 'a', label: 'Separate compute, expansion MRR, paid media, and one-time credit.', score: 98, feedback: 'Correct. The workbook shows multiple material drivers with different recurrence.' },
      { id: 'b', label: 'Keep paid media as the story because it is easiest to explain.', score: 24, feedback: 'A simple story that drops material drivers is misleading.' },
      { id: 'c', label: 'Treat vendor credit as recurring because it appears in the workbook.', score: 15, feedback: 'The controller flag says the credit is non-recurring.' },
      { id: 'd', label: 'Defer explanation until next quarter to avoid revising AI work.', score: 22, feedback: 'Close commentary should be corrected when evidence is already available.' },
    ],
  },
  {
    id: 'FUNC-EXP-FIN-D5-002',
    domain: 'D5',
    difficulty: 'applied',
    type: 'drag-order',
    interaction: 'rank',
    functionTracks: ['finance', 'general'],
    context: 'A finance lead wants to pilot AI-generated close commentary for monthly reporting without weakening review discipline.',
    stimulus: {
      src: '/stimuli/func-exp-finance-workbook.svg',
      alt: 'Raw Q3 close workbook with AI notes, controller flags, material variances, and one-time items.',
      label: 'Close commentary workbook',
      caption: 'Order the pilot design steps so AI helps reporting while preserving finance controls.',
    },
    prompt: 'Order the pilot steps from first to last.',
    rankItems: [
      { id: 'baseline', label: 'Baseline cycle time, error rate, and review rework' },
      { id: 'scope', label: 'Limit AI drafting to approved data and selected variances' },
      { id: 'review', label: 'Require controller review for materiality and recurrence' },
      { id: 'measure', label: 'Compare time saved and corrections before expanding' },
    ],
    idealOrder: ['baseline', 'scope', 'review', 'measure'],
    options: [
      { id: 'rank', label: 'Sequence the close-comment pilot.', score: 98, feedback: 'Correct. A useful pilot starts with a baseline, constrains scope, preserves review, and measures before scale.' },
    ],
  },
  {
    id: 'FUNC-EXP-MKT-D3-001',
    domain: 'D3',
    difficulty: 'applied',
    type: 'report-review',
    interaction: 'single',
    functionTracks: ['marketing'],
    context: 'A campaign assistant recommends scaling Segment C because it has the lowest CPA and highest lead count.',
    stimulus: {
      src: '/stimuli/func-exp-campaign-export.svg',
      alt: 'Raw campaign export showing spend, leads, MQLs, opportunities, AI actions, CRM validation sample, and quality warnings.',
      label: 'Campaign export',
      caption: 'Inspect lead quality, funnel progression, and attribution limits before accepting the AI action.',
    },
    prompt: 'What should the marketer do before scaling Segment C?',
    options: [
      { id: 'a', label: 'Validate email quality, duplicates, opportunities, and coupon leakage.', score: 98, feedback: 'Correct. Low CPA is not enough when quality and intent signals are weak.' },
      { id: 'b', label: 'Scale immediately because CPA and lead volume are strongest.', score: 20, feedback: 'They are useful signals, but not sufficient for revenue-quality decisions.' },
      { id: 'c', label: 'Pause Segment D because its CPA is the highest.', score: 28, feedback: 'High CPA may be acceptable when opportunity quality is stronger.' },
      { id: 'd', label: 'Rewrite creative before checking CRM quality and attribution.', score: 35, feedback: 'Creative work may help later, but the scaling decision needs evidence first.' },
    ],
  },
  {
    id: 'FUNC-EXP-TECH-D4-001',
    domain: 'D4',
    difficulty: 'proficient',
    type: 'matching',
    interaction: 'match',
    functionTracks: ['technical', 'operations'],
    context: 'A technical/data owner reviews an operations agent run that read billing and CRM records, attempted a refund, and tried to send a denial draft.',
    stimulus: {
      src: '/stimuli/func-exp-ops-data-workflow-log.svg',
      alt: 'Operations workflow and agent tool log showing support ticket evidence, workflow steps, blocked tool actions, and reviewer notes.',
      label: 'Agent tool log',
      caption: 'Match each event to the control that best addresses the risk.',
    },
    prompt: 'Match the workflow issue to the right control.',
    matchPairs: [
      { id: 'refund', left: 'Agent attempts a large refund', correct: 'Approval gate for monetary actions', choices: ['Approval gate for monetary actions', 'Creative prompt library', 'Weekly brand review', 'Model confidence badge'] },
      { id: 'denial', left: 'Agent drafts denial despite duplicate capture evidence', correct: 'Policy and evidence check before outbound reply', choices: ['Policy and evidence check before outbound reply', 'Unrestricted email send permission', 'Longer customer greeting', 'Lead source enrichment'] },
      { id: 'billing', left: 'Agent reads invoice events for the active ticket', correct: 'Ticket-scoped least-privilege access', choices: ['Ticket-scoped least-privilege access', 'Company-wide file crawl', 'Disable audit logging', 'Replace CRM notes'] },
    ],
    options: [
      { id: 'match', label: 'Match each tool-log signal to its control.', score: 98, feedback: 'Correct. Controls should map to money movement, outbound communication, and data access scope.' },
    ],
  },
  {
    id: 'FUNC-EXP-OPS-D6-001',
    domain: 'D6',
    difficulty: 'applied',
    type: 'narrative',
    interaction: 'text',
    functionTracks: ['operations'],
    context: 'A support agent receives an AI denial draft for a duplicate-charge ticket. The workflow log shows a likely second capture and blocks both refund and outbound email actions.',
    stimulus: {
      src: '/stimuli/func-exp-ops-data-workflow-log.svg',
      alt: 'Raw support ticket, workflow map, and agent tool log for a duplicate renewal invoice case.',
      label: 'Support workflow log',
      caption: 'Use the raw ticket and tool log to write the next operational response.',
    },
    prompt: 'Write 2-4 sentences explaining what the support agent should do next.',
    rubricCriteria: [
      { id: 'reject', label: 'Rejects the AI denial draft', keywords: ['not send', 'reject', 'do not send', 'revise', 'denial'], points: 24 },
      { id: 'evidence', label: 'Uses duplicate capture evidence', keywords: ['duplicate', 'second capture', 'billing', 'capture', 'charged twice'], points: 26 },
      { id: 'verify', label: 'Requires payment verification before refund', keywords: ['verify', 'confirm', 'payment', 'refund', 'approval'], points: 26 },
      { id: 'customer', label: 'Communicates accountability to the customer', keywords: ['apologize', 'sorry', 'case', 'timeline', 'next step'], points: 24 },
    ],
    exemplarAnswer: 'The agent should not send the denial because the billing log shows a likely duplicate capture. They should verify the payment record, use the refund approval path, and then send a revised reply that apologizes, gives a case reference, and explains the next step clearly.',
    options: [],
  },
  {
    id: 'FUNC-CS-D3-001',
    domain: 'D3',
    secondaryDomains: ['D6'],
    difficulty: 'applied',
    type: 'report-review',
    interaction: 'single',
    functionTracks: ['customerService', 'operations'],
    context: 'A customer-service AI drafts a standard delay reply for a duplicate-charge ticket.',
    stimulus: {
      src: '/stimuli/raw-customer-service-escalation.svg',
      alt: 'Customer service escalation queue showing duplicate payment evidence, SLA risk, frustrated customer messages, and a weak AI draft.',
      label: 'Customer escalation ticket',
      caption: 'Inspect the raw ticket evidence before accepting the AI draft.',
    },
    prompt: 'What is the strongest critique of the AI draft?',
    options: [
      { id: 'a', label: 'It ignores duplicate-capture evidence and dispute risk.', score: 98, feedback: 'Correct. The artifact shows payment evidence and escalation risk that the draft misses.' },
      { id: 'b', label: 'It uses a greeting that is too short.', score: 32, feedback: 'Tone matters, but the main failure is missing evidence and urgency.' },
      { id: 'c', label: 'It should mention every internal system field.', score: 38, feedback: 'Customers need a clear action, not raw internal data.' },
      { id: 'd', label: 'It should ask the customer to wait without review.', score: 18, feedback: 'That repeats the flawed response and increases harm.' },
    ],
  },
  {
    id: 'FUNC-CS-D6-002',
    domain: 'D6',
    secondaryDomains: ['D4'],
    difficulty: 'proficient',
    type: 'narrative',
    interaction: 'text',
    functionTracks: ['customerService', 'operations'],
    context: 'A support lead wants agents to use AI drafts, but customers are complaining that replies feel repetitive and miss account-specific evidence.',
    stimulus: {
      src: '/stimuli/raw-customer-service-escalation.svg',
      alt: 'Customer escalation artifact with chat thread, duplicate charge evidence, SLA breach warning, and AI draft response.',
      label: 'Support reply review',
      caption: 'Use the ticket, evidence, and SLA risk to write a better human-AI support routine.',
    },
    prompt: 'Write 2-4 sentences describing the review routine before AI replies can be sent.',
    rubricCriteria: [
      { id: 'evidence', label: 'Checks order/payment evidence before sending', keywords: ['evidence', 'payment', 'order', 'duplicate', 'verify'], points: 26 },
      { id: 'escalation', label: 'Escalates SLA, dispute, or high-frustration cases', keywords: ['escalate', 'sla', 'dispute', 'frustration', 'urgent'], points: 26 },
      { id: 'ownership', label: 'Keeps final accountability with the human agent', keywords: ['agent', 'human', 'owner', 'accountable', 'review'], points: 24 },
      { id: 'privacy', label: 'Avoids exposing unnecessary internal/customer data', keywords: ['privacy', 'sensitive', 'internal', 'data', 'only needed'], points: 22 },
    ],
    exemplarAnswer: 'AI replies should be checked against order and payment evidence before sending. Duplicate charges, SLA breach, dispute threats, or high-frustration language should route to a human owner, who revises the response and avoids exposing unnecessary internal data.',
    options: [],
  },
  {
    id: 'FUNC-CS-D5-003',
    domain: 'D5',
    secondaryDomains: ['D2', 'D6'],
    difficulty: 'applied',
    type: 'multi-select',
    interaction: 'multi',
    functionTracks: ['customerService', 'operations'],
    context: 'A customer-service manager wants to prove whether AI-assisted replies improve the support workflow.',
    stimulus: {
      src: '/stimuli/raw-customer-service-escalation.svg',
      alt: 'Support queue artifact showing SLA breach, duplicate payment evidence, and AI draft quality issues.',
      label: 'Support workflow metrics',
      caption: 'Select measures that show whether AI is improving service without hiding harm.',
    },
    prompt: 'Which metrics should be tracked before expanding AI reply assistance?',
    correctOptionIds: ['a', 'b', 'c', 'd'],
    options: [
      { id: 'a', label: 'First-contact resolution and reopened-ticket rate.', score: 25, feedback: 'Correct. Resolution quality matters more than reply volume.' },
      { id: 'b', label: 'SLA breach, escalation, and dispute rates.', score: 25, feedback: 'Correct. These reveal operational and customer harm.' },
      { id: 'c', label: 'Human edit rate and evidence-check completion.', score: 25, feedback: 'Correct. Review behavior shows whether AI is used responsibly.' },
      { id: 'd', label: 'Customer satisfaction after AI-assisted replies.', score: 25, feedback: 'Correct. Customers should experience better outcomes, not just faster text.' },
      { id: 'e', label: 'Number of AI replies sent per hour only.', score: 0, feedback: 'Speed alone can hide repeat contacts, wrong answers, and customer harm.' },
    ],
  },
  {
    id: 'FUNC-SALES-D3-001',
    domain: 'D3',
    secondaryDomains: ['D5'],
    difficulty: 'applied',
    type: 'report-review',
    interaction: 'single',
    functionTracks: ['sales'],
    context: 'An AI forecast assistant says Blue Harbor should be counted in this quarter because the CRM stage says verbal yes.',
    stimulus: {
      src: '/stimuli/raw-sales-crm-pipeline.svg',
      alt: 'Sales CRM artifact showing opportunity stage, value, last touch, risk notes, and an AI forecast draft.',
      label: 'Sales pipeline review',
      caption: 'Inspect stage, recency, value, and risk notes before accepting the forecast.',
    },
    prompt: 'What should the sales user challenge first?',
    options: [
      { id: 'a', label: 'The legal hold and 31-day gap make the close claim weak.', score: 98, feedback: 'Correct. Stage alone is not enough when recency and legal risk contradict it.' },
      { id: 'b', label: 'The account name is too formal for a sales report.', score: 18, feedback: 'Naming style is not the forecast risk.' },
      { id: 'c', label: 'All verbal-yes deals should be excluded forever.', score: 34, feedback: 'Too broad. The issue is evidence quality for this deal.' },
      { id: 'd', label: 'The forecast is strong because the deal value is high.', score: 20, feedback: 'High value increases materiality, not certainty.' },
    ],
  },
  {
    id: 'FUNC-SALES-D2-002',
    domain: 'D2',
    secondaryDomains: ['D6'],
    difficulty: 'applied',
    type: 'drag-order',
    interaction: 'rank',
    functionTracks: ['sales'],
    context: 'A sales rep wants AI to help with a next-best-action plan for open opportunities.',
    stimulus: {
      src: '/stimuli/raw-sales-crm-pipeline.svg',
      alt: 'Sales CRM pipeline artifact with stale touches, risk notes, deal values, and AI forecast draft.',
      label: 'Next-action pipeline',
      caption: 'Use the CRM evidence to order a practical AI-assisted sales workflow.',
    },
    prompt: 'Put the AI-assisted sales workflow in the strongest order.',
    rankItems: [
      { id: 'clean', label: 'Check CRM freshness, risk notes, and missing next steps' },
      { id: 'prompt', label: 'Ask AI for account-specific next actions with evidence citations' },
      { id: 'review', label: 'Review legal, privacy, and customer-context risks before outreach' },
      { id: 'act', label: 'Send a human-owned follow-up and update the CRM rationale' },
    ],
    idealOrder: ['clean', 'prompt', 'review', 'act'],
    options: [
      { id: 'rank', label: 'Order the AI-assisted sales workflow.', score: 98, feedback: 'Correct. Useful sales AI starts with evidence quality, then prompt, review, and accountable action.' },
    ],
  },
  {
    id: 'FUNC-SALES-D5-003',
    domain: 'D5',
    secondaryDomains: ['D3'],
    difficulty: 'proficient',
    type: 'multi-select',
    interaction: 'multi',
    functionTracks: ['sales'],
    context: 'A sales director is deciding whether to use AI forecast summaries in the weekly revenue meeting.',
    stimulus: {
      src: '/stimuli/raw-sales-crm-pipeline.svg',
      alt: 'Sales pipeline report with raw opportunity data, stale account contact, legal hold, and AI forecast claim.',
      label: 'Revenue meeting artifact',
      caption: 'Select the evidence that would make the AI forecast decision-grade.',
    },
    prompt: 'Which evidence should be added before leadership uses the AI forecast?',
    correctOptionIds: ['a', 'b', 'c', 'd'],
    options: [
      { id: 'a', label: 'Probability rationale using recency, stage, risk, and next step.', score: 25, feedback: 'Correct. Forecasts need explainable probability, not just stage labels.' },
      { id: 'b', label: 'Clear separation of committed, likely, and speculative revenue.', score: 25, feedback: 'Correct. Scenario separation prevents overpromising.' },
      { id: 'c', label: 'Customer risk notes such as legal hold or data review.', score: 25, feedback: 'Correct. Risk notes change forecast confidence.' },
      { id: 'd', label: 'Human owner for forecast override and CRM update.', score: 25, feedback: 'Correct. Revenue calls need accountability.' },
      { id: 'e', label: 'More confident wording in the AI summary.', score: 0, feedback: 'Confidence wording does not make forecast evidence stronger.' },
    ],
  },
  {
    id: 'FUNC-MKT-D5-002',
    domain: 'D5',
    secondaryDomains: ['D3'],
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'text',
    functionTracks: ['marketing'],
    context: 'An AI campaign assistant recommends scaling the cheapest segment, but the campaign export shows low-quality leads and attribution concerns.',
    stimulus: {
      src: '/stimuli/func-exp-campaign-export.svg',
      alt: 'Raw marketing campaign export showing CPA, lead quality, duplicate emails, coupon leakage, and opportunity conversion warnings.',
      label: 'Campaign quality artifact',
      caption: 'Use the raw campaign data to write a practical scaling recommendation.',
    },
    prompt: 'Write 2-4 sentences explaining whether to scale, pause, or investigate before increasing spend.',
    rubricCriteria: [
      { id: 'quality', label: 'Uses lead quality or opportunity conversion evidence', keywords: ['quality', 'opportunity', 'conversion', 'lead', 'crm'], points: 28 },
      { id: 'attribution', label: 'Mentions attribution, duplicates, or coupon leakage', keywords: ['attribution', 'duplicate', 'coupon', 'leak', 'incrementality'], points: 26 },
      { id: 'decision', label: 'Avoids scaling on CPA alone', keywords: ['cpa alone', 'not scale', 'pause', 'investigate', 'before scaling'], points: 24 },
      { id: 'test', label: 'Suggests a controlled test or validation step', keywords: ['test', 'validate', 'holdout', 'experiment', 'sample'], points: 20 },
    ],
    exemplarAnswer: 'I would not scale on CPA alone. The team should investigate lead quality, duplicate emails, coupon leakage, and attribution before adding spend, then run a controlled test that links campaign results to qualified opportunities or revenue.',
    options: [],
  },
  {
    id: 'FUNC-MKT-SALES-D6-003',
    domain: 'D6',
    secondaryDomains: ['D2', 'D5'],
    difficulty: 'applied',
    type: 'matching',
    interaction: 'match',
    functionTracks: ['marketing', 'sales'],
    context: 'Marketing and sales are using AI to summarize leads, draft outreach, and prioritize follow-up. The handoff is creating disagreement about lead quality.',
    stimulus: {
      src: '/stimuli/func-exp-campaign-export.svg',
      alt: 'Marketing campaign export with lead quality warnings and CRM opportunity signals.',
      label: 'Marketing-sales handoff',
      caption: 'Match each handoff risk to the best human-AI collaboration practice.',
    },
    prompt: 'Match each risk to the best practice.',
    matchPairs: [
      { id: 'lead-quality', left: 'AI labels weak leads as high priority', correct: 'Agree on quality criteria before scoring', choices: ['Agree on quality criteria before scoring', 'Send every lead immediately', 'Hide CRM feedback from marketing'] },
      { id: 'outreach', left: 'AI drafts outreach without account context', correct: 'Require rep review and customer-specific evidence', choices: ['Require rep review and customer-specific evidence', 'Use the same template for all accounts', 'Remove human edits'] },
      { id: 'feedback', left: 'Sales feedback never updates campaign rules', correct: 'Create a feedback loop from outcomes to targeting', choices: ['Create a feedback loop from outcomes to targeting', 'Stop measuring outcomes', 'Let AI set targets alone'] },
    ],
    options: [
      { id: 'match', label: 'Match handoff risks to practices.', score: 98, feedback: 'Correct. Marketing-sales AI work needs shared criteria, human context, and outcome feedback.' },
    ],
  },
  {
    id: 'FUNC-EXP-GEN-D5-001',
    domain: 'D5',
    difficulty: 'proficient',
    type: 'multi-select',
    interaction: 'multi',
    functionTracks: ['general', 'people', 'finance', 'marketing', 'sales', 'customerService', 'technical', 'operations'],
    context: 'A cross-functional leadership group is choosing between AI pilots in HR policy support, close commentary, campaign optimization, and support refunds.',
    stimulus: {
      src: '/stimuli/func-exp-ops-data-workflow-log.svg',
      alt: 'Operations support workflow log used as one example of a high-value workflow with measurable risk controls.',
      label: 'Workflow evidence example',
      caption: 'Select portfolio criteria that work across functions.',
    },
    prompt: 'Which criteria should function leads use to prioritize a premium AI pilot?',
    correctOptionIds: ['a', 'b', 'c', 'd'],
    options: [
      { id: 'a', label: 'Clear workflow pain with measurable baseline.', score: 25, feedback: 'Correct. Pilot value needs a measurable before state.' },
      { id: 'b', label: 'Approved, current, and specific data sources.', score: 25, feedback: 'Correct. Grounding quality determines whether outputs can be trusted.' },
      { id: 'c', label: 'Human review before money, policy, hiring, or customer actions.', score: 25, feedback: 'Correct. High-impact actions need clear gates.' },
      { id: 'd', label: 'Success, stop, and expansion criteria before launch.', score: 25, feedback: 'Correct. Pilots need learning discipline, not vague enthusiasm.' },
      { id: 'e', label: 'A demo that feels impressive despite unclear ownership.', score: 0, feedback: 'Demo appeal is not a reliable prioritization criterion.' },
    ],
  },
];

const competencyDepthQuestionBank: Question[] = [
  {
    id: 'DEPTH-D1-CONCEPTS-025',
    domain: 'D1',
    difficulty: 'awareness',
    type: 'report-review',
    competencyIds: ['D1-concepts'],
    skillIds: ['LLM basics', 'tokens', 'probability', 'model limits'],
    evidenceMode: 'knowing',
    stimulus: { src: '/stimuli/ai-concept-workbench.svg', alt: 'AI concept workbench with token, context, and hallucination notes', label: 'LLM basics card', caption: 'The artifact explains why fluent AI text can still be wrong.' },
    context: 'A new user says, “The AI sounds certain, so it must know the truth.”',
    prompt: 'Which explanation is most accurate?',
    options: [
      { id: 'a', label: 'LLMs generate likely text patterns and still need evidence checks.', score: 96, feedback: 'Correct. This is the core literacy point.' },
      { id: 'b', label: 'LLMs store only approved facts from the internet.', score: 15, feedback: 'No. They can generate unsupported claims.' },
      { id: 'c', label: 'LLMs cannot answer unless every fact is verified.', score: 25, feedback: 'They can answer without verification, which creates risk.' },
      { id: 'd', label: 'A confident tone is enough for low-risk decisions.', score: 20, feedback: 'Tone is not evidence.' },
    ],
  },
  {
    id: 'DEPTH-D1-CONCEPTS-026',
    domain: 'D1',
    difficulty: 'applied',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D1-concepts'],
    skillIds: ['embedding', 'RAG', 'fine-tuning', 'prompting'],
    evidenceMode: 'knowing',
    stimulus: { src: '/stimuli/raw-rag-source-comparison.svg', alt: 'RAG source packet with search, retrieved passages, and answer notes', label: 'Retrieval system notes', caption: 'Choose the right AI concept for each product behavior.' },
    context: 'A product team is comparing ways to improve a support assistant.',
    prompt: 'Match each need to the most relevant concept.',
    matchPairs: [
      { id: 'search', left: 'Answer using current policy documents', correct: 'RAG', choices: ['RAG', 'Fine-tuning', 'Temperature', 'Watermark'] },
      { id: 'style', left: 'Make the model follow a brand writing style', correct: 'Fine-tuning or examples', choices: ['Fine-tuning or examples', 'RAG only', 'Benchmark leakage', 'MFA'] },
      { id: 'similar', left: 'Find documents with similar meaning, not exact words', correct: 'Embeddings', choices: ['Embeddings', 'MCP', 'Context loss', 'Audit log'] },
      { id: 'instruction', left: 'Tell the assistant what role and format to use', correct: 'Prompting', choices: ['Prompting', 'Training data rights', 'Robot policy', 'SLA'] },
    ],
    options: [],
  },
  {
    id: 'DEPTH-D1-CONCEPTS-027',
    domain: 'D1',
    difficulty: 'proficient',
    type: 'narrative',
    interaction: 'text',
    competencyIds: ['D1-concepts'],
    skillIds: ['model limits', 'grounding', 'hallucination', 'user explanation'],
    evidenceMode: 'hybrid',
    stimulus: { src: '/stimuli/raw-study-helper-review.svg', alt: 'Study helper answer with unsupported citations and confident explanation', label: 'Study helper answer', caption: 'The user must explain limits without dismissing useful AI help.' },
    context: 'A student wants to rely on an AI answer with citations that may not support the claim.',
    prompt: 'Explain when the AI answer could be useful and what must be checked first.',
    rubricCriteria: [
      { id: 'useful', label: 'Names useful AI role', keywords: ['draft', 'explain', 'brainstorm', 'summarize', 'study'], points: 20 },
      { id: 'verify', label: 'Requires source verification', keywords: ['source', 'citation', 'verify', 'check', 'evidence'], points: 28 },
      { id: 'limit', label: 'Mentions hallucination or unsupported claims', keywords: ['hallucination', 'unsupported', 'false', 'invent', 'wrong'], points: 28 },
      { id: 'ownership', label: 'Keeps learning judgment with user', keywords: ['own', 'understand', 'human', 'student', 'review'], points: 24 },
    ],
    exemplarAnswer: 'The AI can help explain or organize the topic, but it should not be treated as proof. I would check whether the cited sources exist and support the exact claim, then rewrite the answer in my own words and mark anything uncertain for teacher or source review.',
    options: [],
  },
  {
    id: 'DEPTH-D1-SYSTEMS-028',
    domain: 'D1',
    difficulty: 'awareness',
    type: 'report-review',
    competencyIds: ['D1-systems'],
    skillIds: ['models vs apps', 'connectors', 'permissions'],
    evidenceMode: 'knowing',
    stimulus: { src: '/stimuli/agent-tool-trace.svg', alt: 'Tool trace showing model, app, connector, and action permissions', label: 'AI app diagram', caption: 'A model inside an app can behave differently depending on enabled tools.' },
    context: 'A user asks why the same model is safer in one app than another.',
    prompt: 'What is the best answer?',
    options: [
      { id: 'a', label: 'Apps can add tools, memory, policies, and permissions around the model.', score: 95, feedback: 'Correct. System context changes behavior and risk.' },
      { id: 'b', label: 'The model name always fully defines the product risk.', score: 20, feedback: 'Too narrow. Apps and connectors matter.' },
      { id: 'c', label: 'Safety depends only on the user interface color.', score: 0, feedback: 'Visual design is not the main system control.' },
      { id: 'd', label: 'A chatbot cannot connect to external systems.', score: 10, feedback: 'Many AI apps can use tools and connectors.' },
    ],
  },
  {
    id: 'DEPTH-D1-SYSTEMS-029',
    domain: 'D1',
    secondaryDomains: ['D4'],
    difficulty: 'applied',
    type: 'report-review',
    interaction: 'multi',
    competencyIds: ['D1-systems', 'D4-risk'],
    skillIds: ['Hugging Face', 'model card', 'dataset', 'license', 'intended use'],
    evidenceMode: 'hybrid',
    functionTracks: ['technical', 'operations'],
    stimulus: { src: '/stimuli/raw-vendor-security-questionnaire.svg', alt: 'Model card excerpt with license, dataset, intended use, and evaluation limitations', label: 'Model hub card', caption: 'A technical user reviews an open model before using it in a product.' },
    context: 'A developer wants to use a Hugging Face model in a customer-facing assistant.',
    prompt: 'Which model-card details should be checked?',
    correctOptionIds: ['license', 'data', 'eval', 'limits'],
    options: [
      { id: 'license', label: 'License and commercial-use permissions.', score: 25, feedback: 'Correct. License controls product use.' },
      { id: 'data', label: 'Training data summary and privacy caveats.', score: 25, feedback: 'Correct. Data provenance matters.' },
      { id: 'eval', label: 'Evaluation tasks, language coverage, and failure cases.', score: 25, feedback: 'Correct. Fit depends on evaluated behavior.' },
      { id: 'limits', label: 'Known limitations and intended-use boundaries.', score: 25, feedback: 'Correct. Limitations must map to controls.' },
      { id: 'likes', label: 'Only the number of likes and downloads.', score: 0, feedback: 'Popularity is not sufficient deployment evidence.' },
    ],
  },
  {
    id: 'DEPTH-D1-SYSTEMS-030',
    domain: 'D1',
    difficulty: 'proficient',
    type: 'drag-order',
    interaction: 'rank',
    competencyIds: ['D1-systems'],
    skillIds: ['repo literacy', 'GitHub', 'release notes', 'dependency risk'],
    evidenceMode: 'doing',
    functionTracks: ['technical'],
    stimulus: { src: '/stimuli/raw-technical-access-log.svg', alt: 'Repository activity showing stars, issues, releases, dependency notices, and security settings', label: 'GitHub repo review', caption: 'Technical users need to inspect repository health before adopting AI tooling.' },
    context: 'A team is considering an open-source AI package from GitHub.',
    prompt: 'Order the repo review steps before adoption.',
    rankItems: [
      { id: 'purpose', label: 'Confirm the package solves the actual workflow need.' },
      { id: 'license', label: 'Check license, maintenance, releases, issues, and security policy.' },
      { id: 'risk', label: 'Review dependencies, permissions, data handling, and known vulnerabilities.' },
      { id: 'test', label: 'Test in a sandbox with representative data.' },
      { id: 'approve', label: 'Approve with owner, monitoring, and rollback plan.' },
    ],
    idealOrder: ['purpose', 'license', 'risk', 'test', 'approve'],
    options: [],
  },
  {
    id: 'DEPTH-D2-PROMPT-031',
    domain: 'D2',
    difficulty: 'awareness',
    type: 'report-review',
    competencyIds: ['D2-prompting'],
    skillIds: ['prompt basics', 'role', 'format', 'constraints'],
    evidenceMode: 'knowing',
    stimulus: { src: '/stimuli/realistic-scheduling-email.png', alt: 'Realistic email client and calendar artifact showing a weak scheduling prompt with missing constraints.', label: 'Prompt checklist', caption: 'A weak prompt misses audience, constraints, timezone, and output format.' },
    context: 'A user writes: “Make this email better.”',
    prompt: 'Which missing detail would most improve the prompt?',
    options: [
      { id: 'a', label: 'Who the email is for and what outcome is needed.', score: 95, feedback: 'Correct. Audience and goal shape the answer.' },
      { id: 'b', label: 'A request for the longest possible answer.', score: 10, feedback: 'Length is not the main issue.' },
      { id: 'c', label: 'A command to sound confident no matter what.', score: 5, feedback: 'Confidence without constraints is risky.' },
      { id: 'd', label: 'No extra detail because AI should infer everything.', score: 15, feedback: 'Inference can create errors.' },
    ],
  },
  {
    id: 'DEPTH-D2-PROMPT-032',
    domain: 'D2',
    difficulty: 'applied',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D2-prompting'],
    skillIds: ['prompt components', 'source rules', 'review checks'],
    evidenceMode: 'hybrid',
    stimulus: { src: '/stimuli/raw-customer-notes.svg', alt: 'Customer notes with facts, unknowns, and tone requirements', label: 'Customer-note prompt', caption: 'Map prompt components to the work they support.' },
    context: 'A product manager is creating a prompt template for customer-note summaries.',
    prompt: 'Match each prompt component to its purpose.',
    matchPairs: [
      { id: 'role', left: 'Act as a product researcher', correct: 'Role', choices: ['Role', 'Source rule', 'Output format', 'Review check'] },
      { id: 'source', left: 'Use only the notes below; mark missing evidence', correct: 'Source rule', choices: ['Source rule', 'Role', 'Tone', 'Model size'] },
      { id: 'format', left: 'Return findings, caveats, and next interviews', correct: 'Output format', choices: ['Output format', 'Memory', 'RAG index', 'Watermark'] },
      { id: 'check', left: 'Flag any claim not grounded in a note', correct: 'Review check', choices: ['Review check', 'Temperature', 'Persona', 'Token'] },
    ],
    options: [],
  },
  {
    id: 'DEPTH-D2-PROMPT-033',
    domain: 'D2',
    difficulty: 'proficient',
    type: 'narrative',
    interaction: 'text',
    competencyIds: ['D2-prompting'],
    skillIds: ['loop engineering', 'iteration', 'evaluation criteria', 'prompt repair'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/raw-agent-workflow-plan.svg', alt: 'Agent workflow plan with task loop, eval criteria, reviewer notes, and failure cases', label: 'Prompt loop plan', caption: 'The user must design an iterative prompt loop, not a one-shot instruction.' },
    context: 'A team wants an assistant to improve sales follow-up emails over several review cycles.',
    prompt: 'Write a prompt-loop instruction that includes draft, critique, revise, and stop criteria.',
    rubricCriteria: [
      { id: 'draft', label: 'Includes draft step', keywords: ['draft', 'create', 'write'], points: 20 },
      { id: 'critique', label: 'Includes critique or evaluation', keywords: ['critique', 'evaluate', 'review', 'score'], points: 25 },
      { id: 'revise', label: 'Includes revision loop', keywords: ['revise', 'improve', 'iterate', 'second version'], points: 20 },
      { id: 'criteria', label: 'Defines quality criteria', keywords: ['criteria', 'tone', 'accuracy', 'evidence', 'customer'], points: 20 },
      { id: 'stop', label: 'Defines stop/escalation rule', keywords: ['stop', 'escalate', 'human', 'approval'], points: 15 },
    ],
    exemplarAnswer: 'Draft the follow-up using only CRM notes and approved offer language. Critique it against accuracy, customer fit, tone, and missing evidence. Revise once using the critique. Stop and escalate if account risk, legal terms, discount approval, or missing facts appear.',
    options: [],
  },
  {
    id: 'DEPTH-D2-WORKFLOW-034',
    domain: 'D2',
    difficulty: 'awareness',
    type: 'report-review',
    competencyIds: ['D2-workflows'],
    skillIds: ['workflow mapping', 'handoffs', 'review checkpoints'],
    evidenceMode: 'knowing',
    stimulus: { src: '/stimuli/ai-pilot-workflow.svg', alt: 'Simple workflow showing input, AI draft, human review, and final action', label: 'Workflow map', caption: 'A workflow is more than a prompt; it includes input, AI work, review, and action.' },
    context: 'A user wants AI to help with a monthly report.',
    prompt: 'Which workflow is safest?',
    options: [
      { id: 'a', label: 'Data source -> AI draft -> human verifies -> final report.', score: 95, feedback: 'Correct. This includes source and review.' },
      { id: 'b', label: 'AI invents data -> final report.', score: 0, feedback: 'Unsafe and unsupported.' },
      { id: 'c', label: 'Human skips review because AI is fast.', score: 15, feedback: 'Review is important for report accuracy.' },
      { id: 'd', label: 'Only ask for a prettier chart.', score: 25, feedback: 'Presentation is not the whole workflow.' },
    ],
  },
  {
    id: 'DEPTH-D2-WORKFLOW-035',
    domain: 'D2',
    difficulty: 'applied',
    type: 'report-review',
    interaction: 'multi',
    competencyIds: ['D2-workflows'],
    skillIds: ['agent setup', 'handoffs', 'review checkpoints', 'tool selection'],
    evidenceMode: 'doing',
    functionTracks: ['operations', 'customerService', 'sales'],
    stimulus: { src: '/stimuli/realistic-agent-workflow-builder.png', alt: 'Workflow builder screenshot showing a refund-response agent with broad permissions, missing approval gate, partial audit log, and no rollback owner.', label: 'Agent workflow setup', caption: 'The workflow needs tool boundaries, approval gates, audit logs, and rollback ownership before use.' },
    context: 'An AI agent will summarize support tickets, draft emails, update CRM records, and create refund requests.',
    prompt: 'Which setup details are required?',
    correctOptionIds: ['tools', 'handoff', 'review', 'measure'],
    options: [
      { id: 'tools', label: 'Allowed tools, actions, and data fields.', score: 25, feedback: 'Correct. Tool scope must be explicit.' },
      { id: 'handoff', label: 'When the agent hands off to a person.', score: 25, feedback: 'Correct. Escalation is part of workflow design.' },
      { id: 'review', label: 'Review gate for sensitive or customer-impacting work.', score: 25, feedback: 'Correct. Review protects users.' },
      { id: 'measure', label: 'Quality, time, override, and customer-impact measures.', score: 25, feedback: 'Correct. Workflow success must be measured.' },
      { id: 'name', label: 'A catchy assistant nickname.', score: 0, feedback: 'Naming does not define workflow safety.' },
    ],
  },
  {
    id: 'DEPTH-D2-WORKFLOW-036',
    domain: 'D2',
    difficulty: 'proficient',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D2-workflows'],
    skillIds: ['multi-agent handoff', 'A2A', 'orchestration', 'failure mode'],
    evidenceMode: 'hybrid',
    functionTracks: ['technical', 'operations'],
    stimulus: { src: '/stimuli/raw-agent-audit-log.svg', alt: 'Multi-agent audit trace showing planner, retriever, writer, and approver agents', label: 'Multi-agent trace', caption: 'Agent-to-agent handoffs need visible responsibility and failure handling.' },
    context: 'A workflow uses separate agents for planning, retrieval, writing, and approval.',
    prompt: 'Match each failure risk to the right workflow control.',
    matchPairs: [
      { id: 'handoff', left: 'Planner sends vague task to retriever', correct: 'Typed handoff with required fields', choices: ['Typed handoff with required fields', 'Higher temperature', 'Longer brand tone', 'No logging'] },
      { id: 'source', left: 'Writer uses source without provenance', correct: 'Source citation and evidence check', choices: ['Source citation and evidence check', 'Skip retrieval', 'Trust final answer', 'Disable reviewer'] },
      { id: 'loop', left: 'Agents repeat the same failed action', correct: 'Loop limit and escalation trigger', choices: ['Loop limit and escalation trigger', 'More agents', 'Hide errors', 'Make output longer'] },
      { id: 'approval', left: 'Approval agent approves its own action', correct: 'Independent human or policy gate', choices: ['Independent human or policy gate', 'Self-approval', 'No owner', 'Marketing review only'] },
    ],
    options: [],
  },
  {
    id: 'DEPTH-D3-VERIFY-037',
    domain: 'D3',
    difficulty: 'awareness',
    type: 'report-review',
    competencyIds: ['D3-verification'],
    skillIds: ['source checking', 'claim review'],
    evidenceMode: 'knowing',
    stimulus: { src: '/stimuli/raw-policy-excerpt.svg', alt: 'Policy excerpt beside an AI summary with one unsupported claim', label: 'Source check', caption: 'The AI summary sounds plausible but adds a condition not found in the policy.' },
    context: 'A chatbot summarizes a policy paragraph.',
    prompt: 'What should you check first?',
    options: [
      { id: 'a', label: 'Whether each claim appears in or follows from the source.', score: 96, feedback: 'Correct. Claim-source alignment is the first check.' },
      { id: 'b', label: 'Whether the answer uses formal language.', score: 10, feedback: 'Style is not proof.' },
      { id: 'c', label: 'Whether the chatbot says it is confident.', score: 5, feedback: 'Confidence is not verification.' },
      { id: 'd', label: 'Whether the answer is short enough.', score: 20, feedback: 'Concision does not prove accuracy.' },
    ],
  },
  {
    id: 'DEPTH-D3-VERIFY-038',
    domain: 'D3',
    difficulty: 'applied',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D3-verification'],
    skillIds: ['benchmark trust', 'eval methodology', 'task fit'],
    evidenceMode: 'hybrid',
    stimulus: { src: '/stimuli/raw-rag-source-comparison.svg', alt: 'Evaluation card with benchmark score, task definition, sample warning, and model version', label: 'Benchmark evidence card', caption: 'A model benchmark is useful only when you know what it measured.' },
    context: 'A buyer compares three AI products from public benchmark claims.',
    prompt: 'Match each benchmark concern to the review question.',
    matchPairs: [
      { id: 'task', left: 'Benchmark is coding-heavy but product is customer support', correct: 'Does the task match our use case?', choices: ['Does the task match our use case?', 'Is the logo familiar?', 'Is the answer long?', 'Can we skip testing?'] },
      { id: 'version', left: 'Vendor tested an older model version', correct: 'Which model/version was evaluated?', choices: ['Which model/version was evaluated?', 'Can we ignore date?', 'Who designed the website?', 'Was the font readable?'] },
      { id: 'contam', left: 'Public test may appear in training data', correct: 'Is there leakage or contamination risk?', choices: ['Is there leakage or contamination risk?', 'Should we use more colors?', 'Can we trust downloads?', 'Is the chart pretty?'] },
      { id: 'ops', left: 'Score omits latency, cost, and safety failures', correct: 'What operational constraints were tested?', choices: ['What operational constraints were tested?', 'Is it popular online?', 'Is it new enough?', 'Can it write jokes?'] },
    ],
    options: [],
  },
  {
    id: 'DEPTH-D3-VERIFY-039',
    domain: 'D3',
    difficulty: 'proficient',
    type: 'narrative',
    interaction: 'text',
    competencyIds: ['D3-verification'],
    skillIds: ['claim review', 'chart forensics', 'confidence calibration'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/raw-finance-variance-report.svg', alt: 'Finance variance report with AI explanation, missing baseline, and exception notes', label: 'Variance explanation review', caption: 'The AI explanation may be plausible but unsupported by the report.' },
    context: 'An AI assistant explains a finance variance and recommends action.',
    prompt: 'Write what evidence you would check before accepting the explanation.',
    rubricCriteria: [
      { id: 'source', label: 'Checks report/source rows', keywords: ['report', 'row', 'source', 'ledger', 'evidence'], points: 24 },
      { id: 'baseline', label: 'Checks baseline or comparison period', keywords: ['baseline', 'comparison', 'period', 'previous'], points: 22 },
      { id: 'exception', label: 'Checks exceptions/outliers', keywords: ['exception', 'outlier', 'one-time', 'anomaly'], points: 22 },
      { id: 'action', label: 'Avoids action until verified', keywords: ['verify', 'before', 'confirm', 'not accept', 'review'], points: 22 },
      { id: 'confidence', label: 'Calibrates confidence', keywords: ['confidence', 'uncertain', 'partial', 'may'], points: 10 },
    ],
    exemplarAnswer: 'I would compare the AI explanation against the variance rows, baseline period, one-time exceptions, and any missing ledger evidence. I would not accept the recommended action until the cause is confirmed and the uncertainty is documented.',
    options: [],
  },
  {
    id: 'DEPTH-D3-MEDIA-040',
    domain: 'D3',
    difficulty: 'awareness',
    type: 'media',
    competencyIds: ['D3-media'],
    skillIds: ['image-caption check', 'provenance'],
    evidenceMode: 'knowing',
    stimulus: { src: '/stimuli/flood-station-social-post.png', alt: 'Social media post screenshot showing an urban flood near a transit station with unclear provenance.', label: 'Station flood post', caption: 'The image may be real but the caption may be misleading.' },
    context: 'A friend wants to share a dramatic disaster image.',
    prompt: 'What is the safest first response?',
    options: [
      { id: 'a', label: 'Check original source, date, location, and caption before sharing.', score: 96, feedback: 'Correct. Provenance and context matter.' },
      { id: 'b', label: 'Share quickly because urgent posts are always helpful.', score: 5, feedback: 'Urgency can spread misinformation.' },
      { id: 'c', label: 'Assume every disaster image is AI-generated.', score: 20, feedback: 'That overstates the evidence.' },
      { id: 'd', label: 'Only check whether the image looks dramatic.', score: 10, feedback: 'Visual impact is not proof.' },
    ],
  },
  {
    id: 'DEPTH-D3-MEDIA-041',
    domain: 'D3',
    difficulty: 'applied',
    type: 'fraud-detection',
    interaction: 'multi',
    competencyIds: ['D3-media'],
    skillIds: ['fraud invoice', 'payment risk', 'suspicious artifacts'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/fraud-invoice.svg', alt: 'Invoice with changed bank account, urgent payment request, mismatched sender, and missing PO', label: 'Invoice fraud check', caption: 'Users inspect the invoice for payment-fraud signals.' },
    context: 'An invoice asks for urgent payment to a new bank account.',
    prompt: 'Which signals require verification?',
    correctOptionIds: ['bank', 'sender', 'po', 'urgency'],
    options: [
      { id: 'bank', label: 'Changed bank details.', score: 25, feedback: 'Correct. Bank changes need independent verification.' },
      { id: 'sender', label: 'Sender domain does not match the vendor.', score: 25, feedback: 'Correct. Domain mismatch is a strong signal.' },
      { id: 'po', label: 'Missing purchase order or approval reference.', score: 25, feedback: 'Correct. Payment evidence is missing.' },
      { id: 'urgency', label: 'Urgent pressure to bypass review.', score: 25, feedback: 'Correct. Pressure is a fraud pattern.' },
      { id: 'logo', label: 'The logo color is not your favorite.', score: 0, feedback: 'Design preference is not a fraud signal.' },
    ],
  },
  {
    id: 'DEPTH-D3-MEDIA-042',
    domain: 'D3',
    difficulty: 'proficient',
    type: 'narrative',
    interaction: 'text',
    competencyIds: ['D3-media'],
    skillIds: ['synthetic media signals', 'provenance', 'risk explanation'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/flood-forwarded-chat.png', alt: 'Forwarded chat screenshot with a flood photo, vague location, and same-day claim.', label: 'Forwarded flood chat', caption: 'The task is to explain uncertainty across source, date, place, and forwarding chain.' },
    context: 'A forwarded chat message is spreading with a claim about a current emergency.',
    prompt: 'Write a short verification note before your team shares or acts on the image.',
    rubricCriteria: [
      { id: 'source', label: 'Finds original source', keywords: ['original', 'source', 'first', 'creator'], points: 24 },
      { id: 'date', label: 'Checks date/time', keywords: ['date', 'time', 'timestamp', 'today'], points: 20 },
      { id: 'location', label: 'Checks location', keywords: ['location', 'place', 'map', 'landmark', 'area'], points: 20 },
      { id: 'image', label: 'Uses image/provenance tools', keywords: ['reverse', 'metadata', 'provenance', 'search'], points: 20 },
      { id: 'caution', label: 'Communicates uncertainty', keywords: ['unverified', 'uncertain', 'do not share', 'confirm'], points: 16 },
    ],
    exemplarAnswer: 'This image should be treated as unverified. I would find the earliest source, check timestamp and location clues, compare with official local updates, and run reverse image/provenance checks. Until confirmed, share only as unverified or do not share.',
    options: [],
  },
  {
    id: 'DEPTH-D4-RISK-043',
    domain: 'D4',
    difficulty: 'awareness',
    type: 'report-review',
    competencyIds: ['D4-risk'],
    skillIds: ['privacy', 'data minimization', 'confidential data'],
    evidenceMode: 'knowing',
    stimulus: { src: '/stimuli/medical-record-redacted.svg', alt: 'Medical record excerpt showing redacted and unredacted sensitive fields', label: 'Sensitive data check', caption: 'The user must recognize data minimization before using AI.' },
    context: 'A user wants to paste a medical-style record into a public AI chatbot.',
    prompt: 'What is the safest first step?',
    options: [
      { id: 'a', label: 'Remove unnecessary personal/sensitive data and use an approved tool.', score: 96, feedback: 'Correct. Minimize data and follow policy.' },
      { id: 'b', label: 'Paste everything because more context always improves accuracy.', score: 0, feedback: 'More context can create privacy risk.' },
      { id: 'c', label: 'Only change the patient name.', score: 35, feedback: 'Other details may still identify someone.' },
      { id: 'd', label: 'Ask the AI to promise confidentiality.', score: 10, feedback: 'A promise in the prompt is not a control.' },
    ],
  },
  {
    id: 'DEPTH-D4-RISK-044',
    domain: 'D4',
    difficulty: 'applied',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D4-risk'],
    skillIds: ['least privilege', 'approval gates', 'audit logs', 'data leakage'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/raw-technical-access-log.svg', alt: 'Access log with broad permissions, export action, and missing approver', label: 'Access log review', caption: 'Each risk needs a specific control.' },
    context: 'An AI assistant has broad access in a workspace.',
    prompt: 'Match each risk to the control.',
    matchPairs: [
      { id: 'broad', left: 'Assistant can read all folders', correct: 'Least-privilege access', choices: ['Least-privilege access', 'Brighter UI', 'Longer prompt', 'More outputs'] },
      { id: 'export', left: 'Assistant can export customer data', correct: 'Approval gate and data boundary', choices: ['Approval gate and data boundary', 'No logging', 'Public sharing', 'Disable help text'] },
      { id: 'missing', left: 'No record of who approved action', correct: 'Audit log with approver trail', choices: ['Audit log with approver trail', 'Faster model', 'Tone guide', 'More examples'] },
      { id: 'secret', left: 'Prompt contains API key', correct: 'Secret detection and blocking', choices: ['Secret detection and blocking', 'Share in email', 'Use bigger context', 'Ignore if internal'] },
    ],
    options: [],
  },
  {
    id: 'DEPTH-D4-RISK-045',
    domain: 'D4',
    difficulty: 'proficient',
    type: 'narrative',
    interaction: 'text',
    competencyIds: ['D4-risk'],
    skillIds: ['third-party risk', 'retention', 'data rights', 'risk assessment'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/raw-vendor-security-questionnaire.svg', alt: 'Vendor security questionnaire with retention, data-use, and subcontractor fields', label: 'Vendor risk questionnaire', caption: 'The vendor wants access to customer data for model improvement.' },
    context: 'Procurement asks whether an AI vendor can use company data to improve its service.',
    prompt: 'Write the key risk questions you would ask before approval.',
    rubricCriteria: [
      { id: 'data', label: 'Defines data use and retention', keywords: ['data', 'retention', 'use', 'delete'], points: 25 },
      { id: 'rights', label: 'Asks about training rights', keywords: ['train', 'model', 'rights', 'improve'], points: 20 },
      { id: 'sub', label: 'Checks subprocessors/subcontractors', keywords: ['subprocessor', 'subcontractor', 'third party'], points: 18 },
      { id: 'security', label: 'Covers security and access', keywords: ['security', 'access', 'encryption', 'audit'], points: 22 },
      { id: 'incident', label: 'Covers incident obligations', keywords: ['incident', 'breach', 'notify', 'response'], points: 15 },
    ],
    exemplarAnswer: 'I would ask what data is used, whether it trains or improves vendor models, retention/deletion terms, subprocessors, access controls, encryption, audit rights, breach notification, and whether we can opt out of model training before any customer data is shared.',
    options: [],
  },
  {
    id: 'DEPTH-D4-GOV-046',
    domain: 'D4',
    difficulty: 'awareness',
    type: 'report-review',
    competencyIds: ['D4-governance'],
    skillIds: ['accountability', 'human review', 'policy alignment'],
    evidenceMode: 'knowing',
    stimulus: { src: '/stimuli/gen-exp-privacy-workflow-board.svg', alt: 'Privacy workflow board with owner, review step, and escalation lane', label: 'Governance board', caption: 'Governance means deciding who owns what before things go wrong.' },
    context: 'A team asks what “human in the loop” should mean.',
    prompt: 'Which answer is best?',
    options: [
      { id: 'a', label: 'A named person reviews defined high-risk outputs before action.', score: 95, feedback: 'Correct. Review must be assigned and meaningful.' },
      { id: 'b', label: 'Everyone generally knows AI is involved.', score: 25, feedback: 'Too vague for accountability.' },
      { id: 'c', label: 'AI reviews itself before acting.', score: 5, feedback: 'Self-review is not enough for high-impact actions.' },
      { id: 'd', label: 'Human review only after harm is reported.', score: 20, feedback: 'Some review must happen before action.' },
    ],
  },
  {
    id: 'DEPTH-D4-GOV-047',
    domain: 'D4',
    difficulty: 'applied',
    type: 'report-review',
    interaction: 'multi',
    competencyIds: ['D4-governance'],
    skillIds: ['incident response', 'audit evidence', 'escalation', 'owner'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/raw-agent-audit-log.svg', alt: 'Agent audit log with missing owner, unsupported output, and escalation delay', label: 'Incident log', caption: 'An AI assistant made a harmful recommendation and the log is incomplete.' },
    context: 'An AI workflow produced a bad customer action.',
    prompt: 'Which incident-response evidence should be captured?',
    correctOptionIds: ['output', 'source', 'owner', 'fix'],
    options: [
      { id: 'output', label: 'Prompt, output, tool calls, and affected user/action.', score: 25, feedback: 'Correct. Incident facts must be preserved.' },
      { id: 'source', label: 'Source evidence used or missing.', score: 25, feedback: 'Correct. Evidence gaps explain failure.' },
      { id: 'owner', label: 'Decision owner, reviewer, and approver trail.', score: 25, feedback: 'Correct. Accountability matters.' },
      { id: 'fix', label: 'Containment, correction, and recurrence-prevention step.', score: 25, feedback: 'Correct. Response must improve the system.' },
      { id: 'hide', label: 'Remove logs so users do not worry.', score: 0, feedback: 'Deleting logs undermines governance.' },
    ],
  },
  {
    id: 'DEPTH-D4-GOV-048',
    domain: 'D4',
    difficulty: 'proficient',
    type: 'narrative',
    interaction: 'text',
    competencyIds: ['D4-governance'],
    skillIds: ['governance cadence', 'risk appetite', 'policy alignment'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/executive/exec-exp-risk-log-agent-authority.svg', alt: 'Risk log with agent authority, data access, owner, residual risk, and mitigation status', label: 'AI risk cadence', caption: 'A governance forum must decide what to review regularly.' },
    context: 'A company has several AI pilots with different risk levels.',
    prompt: 'Write a short governance cadence for reviewing these pilots.',
    rubricCriteria: [
      { id: 'tier', label: 'Uses risk tiers', keywords: ['tier', 'risk', 'impact', 'classify'], points: 22 },
      { id: 'owner', label: 'Names accountable owners', keywords: ['owner', 'accountable', 'committee', 'sponsor'], points: 20 },
      { id: 'evidence', label: 'Defines evidence reviewed', keywords: ['metric', 'incident', 'audit', 'quality', 'evidence'], points: 24 },
      { id: 'cadence', label: 'Defines cadence', keywords: ['weekly', 'monthly', 'quarterly', 'cadence'], points: 16 },
      { id: 'action', label: 'Includes stop/scale/remediate decisions', keywords: ['stop', 'scale', 'remediate', 'approve', 'pause'], points: 18 },
    ],
    exemplarAnswer: 'Review high-risk pilots monthly and low-risk pilots quarterly. Each pilot needs an owner, risk tier, usage and quality evidence, incidents, audit samples, user impact, and open mitigations. The forum should decide whether to continue, pause, remediate, or scale.',
    options: [],
  },
  {
    id: 'DEPTH-D5-VALUE-049',
    domain: 'D5',
    difficulty: 'awareness',
    type: 'report-review',
    competencyIds: ['D5-value'],
    skillIds: ['baseline metrics', 'value evidence'],
    evidenceMode: 'knowing',
    stimulus: { src: '/stimuli/ai-pilot-workflow.svg', alt: 'AI pilot canvas showing baseline, metric, owner, and scale criteria', label: 'Pilot evidence card', caption: 'A pilot needs a baseline before anyone can claim improvement.' },
    context: 'A team says their AI pilot is successful because people like the demo.',
    prompt: 'What is the most important missing evidence?',
    options: [
      { id: 'a', label: 'Baseline and outcome metric for the workflow.', score: 96, feedback: 'Correct. Value needs comparison.' },
      { id: 'b', label: 'A more futuristic demo video.', score: 5, feedback: 'Demo appeal is not value evidence.' },
      { id: 'c', label: 'A promise that AI will save time eventually.', score: 15, feedback: 'Promises need measurement.' },
      { id: 'd', label: 'A list of all possible AI tools.', score: 25, feedback: 'Tool inventory is not enough.' },
    ],
  },
  {
    id: 'DEPTH-D5-VALUE-050',
    domain: 'D5',
    difficulty: 'applied',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D5-value'],
    skillIds: ['use-case fit', 'ROI evidence', 'pilot gates'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/func-exp-ops-data-workflow-log.svg', alt: 'Operations workflow log showing bottlenecks, defects, automation candidate, and risk notes', label: 'Use-case fit log', caption: 'Each AI idea needs a measurement approach.' },
    context: 'Operations is selecting AI use cases.',
    prompt: 'Match each use-case signal to the right value question.',
    matchPairs: [
      { id: 'repeat', left: 'High-volume repetitive classification', correct: 'Can automation reduce time without quality loss?', choices: ['Can automation reduce time without quality loss?', 'Is it trendy?', 'Can we skip baseline?', 'Will everyone like it?'] },
      { id: 'risk', left: 'Mistake affects customer money', correct: 'What review gate and harm metric are needed?', choices: ['What review gate and harm metric are needed?', 'Can AI decide alone?', 'Can we hide errors?', 'Is the UI colorful?'] },
      { id: 'data', left: 'Inputs are inconsistent and incomplete', correct: 'Is data readiness enough for pilot?', choices: ['Is data readiness enough for pilot?', 'Can marketing announce it?', 'Is model new?', 'Do we need more meetings?'] },
      { id: 'scale', left: 'Pilot works in one team only', correct: 'What evidence supports scaling?', choices: ['What evidence supports scaling?', 'Can we assume transfer?', 'Should we stop measuring?', 'Can we remove controls?'] },
    ],
    options: [],
  },
  {
    id: 'DEPTH-D5-VALUE-051',
    domain: 'D5',
    difficulty: 'proficient',
    type: 'narrative',
    interaction: 'text',
    competencyIds: ['D5-value'],
    skillIds: ['benefit realization', 'ROI evidence', 'stage gate'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/func-exp-campaign-export.svg', alt: 'Campaign export with spend, leads, weak qualification, and AI recommendation', label: 'Marketing value review', caption: 'The assistant recommends scale-up, but lead quality and incrementality are unclear.' },
    context: 'Marketing wants to scale an AI-generated campaign because lead volume increased.',
    prompt: 'Write the evidence needed before increasing spend.',
    rubricCriteria: [
      { id: 'quality', label: 'Checks lead quality', keywords: ['quality', 'qualified', 'conversion', 'pipeline'], points: 25 },
      { id: 'baseline', label: 'Checks baseline/control', keywords: ['baseline', 'control', 'incremental', 'comparison'], points: 25 },
      { id: 'cost', label: 'Checks cost and ROI', keywords: ['cost', 'roi', 'cac', 'spend', 'return'], points: 20 },
      { id: 'risk', label: 'Checks brand/compliance risk', keywords: ['risk', 'brand', 'compliance', 'privacy'], points: 15 },
      { id: 'gate', label: 'Uses scale gate', keywords: ['gate', 'scale', 'test', 'pilot', 'criteria'], points: 15 },
    ],
    exemplarAnswer: 'Before increasing spend I would compare qualified conversion, cost per qualified lead, and pipeline value against a baseline or control. I would check brand/compliance issues and scale only if the campaign improves quality and ROI, not just volume.',
    options: [],
  },
  {
    id: 'DEPTH-D5-STRATEGY-052',
    domain: 'D5',
    difficulty: 'awareness',
    type: 'report-review',
    competencyIds: ['D5-strategy'],
    skillIds: ['trend judgment', 'strategic fit'],
    evidenceMode: 'knowing',
    stimulus: { src: '/stimuli/executive-market-report.svg', alt: 'Market report with model news, competitor claims, and adoption caveats', label: 'AI trend brief', caption: 'A new AI trend should be connected to a real business problem.' },
    context: 'An executive asks whether every new model release should trigger a project.',
    prompt: 'What is the best answer?',
    options: [
      { id: 'a', label: 'No. First map the capability to a business problem and evidence of value.', score: 96, feedback: 'Correct. Trend literacy needs business fit.' },
      { id: 'b', label: 'Yes. Newer models always create immediate ROI.', score: 5, feedback: 'New capability is not automatic value.' },
      { id: 'c', label: 'Only competitors should decide the roadmap.', score: 15, feedback: 'Competitor moves are signals, not strategy.' },
      { id: 'd', label: 'Ignore all trends until regulation is perfect.', score: 20, feedback: 'Too passive. Trends need calibrated review.' },
    ],
  },
  {
    id: 'DEPTH-D5-STRATEGY-053',
    domain: 'D5',
    difficulty: 'applied',
    type: 'report-review',
    interaction: 'multi',
    competencyIds: ['D5-strategy'],
    skillIds: ['portfolio decisions', 'strategic risk', 'build buy partner'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/executive/exec-exp-board-packet-scale-readiness.svg', alt: 'Board packet ranking AI projects by value, feasibility, risk, and data readiness', label: 'Portfolio review', caption: 'The board must choose which AI initiatives deserve funding.' },
    context: 'A portfolio committee reviews several AI initiatives.',
    prompt: 'Which criteria should influence funding?',
    correctOptionIds: ['value', 'fit', 'risk', 'readiness'],
    options: [
      { id: 'value', label: 'Measurable business value and owner.', score: 25, feedback: 'Correct. Value and accountability matter.' },
      { id: 'fit', label: 'Strategic fit and differentiation.', score: 25, feedback: 'Correct. Not every use case is strategic.' },
      { id: 'risk', label: 'Customer, legal, privacy, and operational risk.', score: 25, feedback: 'Correct. Risk changes funding path.' },
      { id: 'readiness', label: 'Data, workflow, and adoption readiness.', score: 25, feedback: 'Correct. Readiness affects feasibility.' },
      { id: 'hype', label: 'How exciting the demo feels.', score: 0, feedback: 'Excitement is not enough for portfolio funding.' },
    ],
  },
  {
    id: 'DEPTH-D5-STRATEGY-054',
    domain: 'D5',
    difficulty: 'proficient',
    type: 'narrative',
    interaction: 'text',
    competencyIds: ['D5-strategy'],
    skillIds: ['scale criteria', 'sunset criteria', 'operating model'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/executive/exec-exp-incident-timeline-support-ai.svg', alt: 'Incident timeline for support AI rollout with quality misses and unclear ownership', label: 'Scale-or-pause decision', caption: 'The pilot has benefits and incidents, so the decision requires tradeoff judgment.' },
    context: 'A support AI pilot saved time but produced several customer-impacting errors.',
    prompt: 'Write a scale, pause, or remediate recommendation with criteria.',
    rubricCriteria: [
      { id: 'balance', label: 'Balances value and harm', keywords: ['value', 'harm', 'risk', 'benefit'], points: 22 },
      { id: 'criteria', label: 'Defines scale/pause criteria', keywords: ['criteria', 'scale', 'pause', 'threshold', 'gate'], points: 24 },
      { id: 'fix', label: 'Includes remediation', keywords: ['fix', 'remediate', 'control', 'review', 'training'], points: 22 },
      { id: 'owner', label: 'Names ownership', keywords: ['owner', 'accountable', 'team', 'sponsor'], points: 16 },
      { id: 'measure', label: 'Uses metrics', keywords: ['metric', 'quality', 'customer', 'override', 'incident'], points: 16 },
    ],
    exemplarAnswer: 'I would pause expansion and remediate before scaling. Keep the pilot only where error risk is low, add human review for customer-impacting cases, assign a named owner, and scale only if quality, incident, override, and customer-impact metrics meet agreed thresholds.',
    options: [],
  },
  {
    id: 'DEPTH-D6-COLLAB-055',
    domain: 'D6',
    difficulty: 'awareness',
    type: 'report-review',
    competencyIds: ['D6-collaboration'],
    skillIds: ['role clarity', 'human ownership'],
    evidenceMode: 'knowing',
    stimulus: { src: '/stimuli/realistic-support-ticket-ai-draft.png', alt: 'Customer support console showing duplicate-charge evidence, SLA warning, policy notes, reviewer notes, and a weak AI draft response.', label: 'AI draft review', caption: 'The user must identify who owns the final customer message.' },
    context: 'AI drafts a reply for a sensitive customer complaint.',
    prompt: 'Who owns the final message?',
    options: [
      { id: 'a', label: 'The human reviewer who sends it.', score: 95, feedback: 'Correct. AI can assist, but the sender owns the action.' },
      { id: 'b', label: 'The AI model because it wrote the first draft.', score: 5, feedback: 'AI is not accountable for the customer action.' },
      { id: 'c', label: 'No one if the draft is automated.', score: 0, feedback: 'Automation still needs accountability.' },
      { id: 'd', label: 'The customer because they asked the question.', score: 10, feedback: 'The organization owns its response.' },
    ],
  },
  {
    id: 'DEPTH-D6-COLLAB-056',
    domain: 'D6',
    difficulty: 'applied',
    type: 'report-review',
    interaction: 'multi',
    competencyIds: ['D6-collaboration'],
    skillIds: ['review routines', 'challenge culture', 'override reasons'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/raw-hr-candidate-packet.svg', alt: 'Candidate packet with AI score, interview notes, and reviewer disagreement', label: 'Review disagreement', caption: 'The team must handle disagreement between AI and human evidence.' },
    context: 'An AI hiring screen ranks a candidate low, but interview notes show strong evidence.',
    prompt: 'Which collaboration behaviors are healthy?',
    correctOptionIds: ['challenge', 'evidence', 'document', 'rubric'],
    options: [
      { id: 'challenge', label: 'Challenge the AI ranking with evidence.', score: 25, feedback: 'Correct. Teams need challenge culture.' },
      { id: 'evidence', label: 'Compare AI summary against interview notes and criteria.', score: 25, feedback: 'Correct. Review evidence, not vibes.' },
      { id: 'document', label: 'Document override reason for learning and audit.', score: 25, feedback: 'Correct. Overrides improve the system.' },
      { id: 'rubric', label: 'Use the same hiring rubric for all candidates.', score: 25, feedback: 'Correct. Consistency protects fairness.' },
      { id: 'obey', label: 'Obey the AI ranking to avoid slowing down.', score: 0, feedback: 'Speed should not override evidence and fairness.' },
    ],
  },
  {
    id: 'DEPTH-D6-COLLAB-057',
    domain: 'D6',
    difficulty: 'proficient',
    type: 'drag-order',
    interaction: 'rank',
    competencyIds: ['D6-collaboration'],
    skillIds: ['review routine', 'feedback loop', 'learning ownership'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/raw-agent-audit-log.svg', alt: 'Review loop with AI output, human override, issue category, and learning backlog', label: 'Collaboration review loop', caption: 'Good teams turn AI mistakes into shared learning.' },
    context: 'A team wants to improve AI-assisted work every week.',
    prompt: 'Order the review loop.',
    rankItems: [
      { id: 'sample', label: 'Sample AI outputs and human overrides.' },
      { id: 'classify', label: 'Classify error patterns and risk level.' },
      { id: 'coach', label: 'Coach users and update prompt/workflow guidance.' },
      { id: 'control', label: 'Adjust controls for high-risk patterns.' },
      { id: 'measure', label: 'Measure whether errors and overrides improve.' },
    ],
    idealOrder: ['sample', 'classify', 'coach', 'control', 'measure'],
    options: [],
  },
  {
    id: 'DEPTH-D6-CHANGE-058',
    domain: 'D6',
    difficulty: 'awareness',
    type: 'report-review',
    competencyIds: ['D6-change'],
    skillIds: ['adoption support', 'communication'],
    evidenceMode: 'knowing',
    stimulus: { src: '/stimuli/raw-agent-workflow-plan.svg', alt: 'Rollout plan showing tool launch, training, support channel, and manager checklist', label: 'Rollout checklist', caption: 'Tool access alone does not create capability.' },
    context: 'A company gives everyone access to an AI tool.',
    prompt: 'What is missing if they want real adoption?',
    options: [
      { id: 'a', label: 'Role-specific examples, coaching, support, and feedback loops.', score: 95, feedback: 'Correct. Adoption needs enablement.' },
      { id: 'b', label: 'Only a launch email with the login link.', score: 20, feedback: 'Awareness alone is weak.' },
      { id: 'c', label: 'A rule that everyone must use AI daily.', score: 15, feedback: 'Mandates can increase usage without capability.' },
      { id: 'd', label: 'No guidance so users can discover everything alone.', score: 25, feedback: 'Discovery works better with examples and guardrails.' },
    ],
  },
  {
    id: 'DEPTH-D6-CHANGE-059',
    domain: 'D6',
    difficulty: 'applied',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D6-change'],
    skillIds: ['manager enablement', 'learning loops', 'adoption support'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/productivity-chart-forensics.png', alt: 'Adoption dashboard with usage, confidence, quality, and team variation', label: 'Adoption signal dashboard', caption: 'Different adoption problems need different interventions.' },
    context: 'Teams show different AI adoption patterns.',
    prompt: 'Match each signal to the best support action.',
    matchPairs: [
      { id: 'lowuse', left: 'Low use, high anxiety', correct: 'Manager coaching and safe starter tasks', choices: ['Manager coaching and safe starter tasks', 'Mandate automation', 'Remove support', 'Ignore quality'] },
      { id: 'higherror', left: 'High use, high error rate', correct: 'Review routines and targeted training', choices: ['Review routines and targeted training', 'Celebrate usage only', 'Reduce oversight', 'Scale immediately'] },
      { id: 'expert', left: 'One team has strong reusable workflows', correct: 'Share patterns and peer examples', choices: ['Share patterns and peer examples', 'Keep learning private', 'Stop measuring', 'Block experimentation'] },
      { id: 'trust', left: 'Users distrust outputs after one failure', correct: 'Show evidence checks and escalation paths', choices: ['Show evidence checks and escalation paths', 'Tell them to trust AI', 'Hide incidents', 'Use a bigger model only'] },
    ],
    options: [],
  },
  {
    id: 'DEPTH-D6-CHANGE-060',
    domain: 'D6',
    difficulty: 'proficient',
    type: 'narrative',
    interaction: 'text',
    competencyIds: ['D6-change'],
    skillIds: ['continuous improvement', 'communication', 'change leadership'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/executive/exec-exp-incident-timeline-support-ai.svg', alt: 'AI rollout timeline showing adoption, incidents, training gaps, and communication points', label: 'Change recovery plan', caption: 'The rollout needs a recovery plan after trust is damaged.' },
    context: 'After a visible AI mistake, adoption drops and teams become hesitant.',
    prompt: 'Write a short recovery plan for the next 30 days.',
    rubricCriteria: [
      { id: 'ack', label: 'Acknowledges issue transparently', keywords: ['acknowledge', 'transparent', 'explain', 'communicate'], points: 20 },
      { id: 'fix', label: 'Adds corrective controls', keywords: ['fix', 'control', 'review', 'guardrail', 'escalation'], points: 24 },
      { id: 'coach', label: 'Supports users/managers', keywords: ['coach', 'training', 'manager', 'support', 'examples'], points: 22 },
      { id: 'learn', label: 'Creates feedback loop', keywords: ['feedback', 'learn', 'loop', 'override', 'incident'], points: 20 },
      { id: 'measure', label: 'Defines recovery metrics', keywords: ['measure', 'metric', 'quality', 'trust', 'adoption'], points: 14 },
    ],
    exemplarAnswer: 'Acknowledge the mistake and explain what changed. Add review and escalation controls for similar cases, give managers examples and coaching for safe use, collect user feedback and override patterns weekly, and track quality, trust, incidents, and adoption recovery over 30 days.',
    options: [],
  },
  {
    id: 'MATCH-AI-COMPONENTS-061',
    domain: 'D1',
    secondaryDomains: ['D2'],
    difficulty: 'awareness',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D1-concepts', 'D2-prompting'],
    skillIds: ['LLM', 'RAG', 'prompt', 'context', 'memory'],
    evidenceMode: 'knowing',
    stimulus: { src: '/stimuli/ai-concept-workbench.svg', alt: 'AI component board showing LLM, RAG, prompt, context, memory, and tools', label: 'AI component board', caption: 'Match AI components to what they actually do in a product.' },
    context: 'A new team is learning how AI products are assembled.',
    prompt: 'Match each AI component to the plain-language description.',
    matchPairs: [
      { id: 'llm', left: 'LLM', correct: 'Generates language from learned patterns', choices: ['Generates language from learned patterns', 'Stores every company fact forever', 'Approves payments', 'Prevents all hallucinations'] },
      { id: 'rag', left: 'RAG', correct: 'Retrieves relevant sources before answering', choices: ['Retrieves relevant sources before answering', 'Makes the UI faster', 'Deletes audit logs', 'Guarantees legal approval'] },
      { id: 'prompt', left: 'Prompt', correct: 'Instruction and context given for the task', choices: ['Instruction and context given for the task', 'A license file', 'A server region', 'A peer benchmark'] },
      { id: 'memory', left: 'Memory', correct: 'Saved information reused across sessions', choices: ['Saved information reused across sessions', 'The current pasted text only', 'A model leaderboard', 'A safety incident'] },
    ],
    options: [],
  },
  {
    id: 'MATCH-AI-PRODUCTS-062',
    domain: 'D1',
    secondaryDomains: ['D4'],
    difficulty: 'applied',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D1-systems', 'D4-risk'],
    skillIds: ['AI products', 'GitHub Copilot', 'ChatGPT', 'Hugging Face', 'tool permissions'],
    evidenceMode: 'hybrid',
    functionTracks: ['technical', 'operations', 'general'],
    stimulus: { src: '/stimuli/agent-tool-trace.svg', alt: 'Product comparison artifact with chat assistant, coding assistant, model hub, and workflow agent', label: 'AI product map', caption: 'Different AI products expose different capabilities and risks.' },
    context: 'A manager asks whether all AI products should be governed the same way.',
    prompt: 'Match each product surface to the review focus.',
    matchPairs: [
      { id: 'chat', left: 'General chat assistant', correct: 'Data pasted by users and source-check behavior', choices: ['Data pasted by users and source-check behavior', 'Pull-request permissions only', 'Robot sensor fusion', 'Warehouse routing'] },
      { id: 'copilot', left: 'GitHub-style coding assistant', correct: 'Repository access, code review, tests, and license risk', choices: ['Repository access, code review, tests, and license risk', 'Patient bedside consent', 'Image caption source', 'Ad auction budget'] },
      { id: 'hub', left: 'Hugging Face-style model hub', correct: 'Model card, license, dataset, and intended-use limits', choices: ['Model card, license, dataset, and intended-use limits', 'Calendar tone only', 'Sales discount script', 'HR interview order'] },
      { id: 'agent', left: 'Tool-using workflow agent', correct: 'Read/write permissions, action gates, and audit logs', choices: ['Read/write permissions, action gates, and audit logs', 'Only logo quality', 'Only model popularity', 'Only prompt length'] },
    ],
    options: [],
  },
  {
    id: 'MATCH-MODEL-CARD-063',
    domain: 'D3',
    secondaryDomains: ['D4'],
    difficulty: 'applied',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D3-verification', 'D4-risk'],
    skillIds: ['Hugging Face model card', 'benchmark literacy', 'license', 'intended use'],
    evidenceMode: 'doing',
    functionTracks: ['technical', 'operations'],
    stimulus: { src: '/stimuli/raw-vendor-security-questionnaire.svg', alt: 'Model card artifact with benchmark, license, intended use, limitation, and training data sections', label: 'Model card inspection', caption: 'Technical users need to read model cards as evidence, not marketing.' },
    context: 'A technical user reviews a model card before using an open model.',
    prompt: 'Match the model-card section to the decision it informs.',
    matchPairs: [
      { id: 'bench', left: 'Evaluation / benchmark results', correct: 'Whether the model was tested on relevant tasks', choices: ['Whether the model was tested on relevant tasks', 'Who owns customer refunds', 'What color the UI should be', 'Whether staff like AI'] },
      { id: 'license', left: 'License', correct: 'Whether the model can be used commercially', choices: ['Whether the model can be used commercially', 'Whether the model is always accurate', 'Whether the prompt is short', 'Whether the app has memory'] },
      { id: 'intended', left: 'Intended use', correct: 'Whether the planned deployment matches the model scope', choices: ['Whether the planned deployment matches the model scope', 'Whether the image is dramatic', 'Whether adoption doubled', 'Whether reviewers are fast'] },
      { id: 'limits', left: 'Limitations', correct: 'What guardrails and human review are needed', choices: ['What guardrails and human review are needed', 'What font size to use', 'What sales region to target', 'What chatbot name to pick'] },
    ],
    options: [],
  },
  {
    id: 'MATCH-GITHUB-REPO-064',
    domain: 'D2',
    secondaryDomains: ['D4'],
    difficulty: 'proficient',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D2-workflows', 'D4-risk'],
    skillIds: ['GitHub', 'repo health', 'security policy', 'dependency review', 'CI'],
    evidenceMode: 'doing',
    functionTracks: ['technical'],
    stimulus: { src: '/stimuli/raw-technical-access-log.svg', alt: 'Repository artifact with releases, issues, dependency warnings, CI status, and security settings', label: 'Repository adoption review', caption: 'A popular repository can still be risky if maintenance, license, tests, or dependencies are weak.' },
    context: 'A developer wants to add an AI library from GitHub to a production service.',
    prompt: 'Match each repo signal to what it tells you.',
    matchPairs: [
      { id: 'release', left: 'No release in 18 months', correct: 'Maintenance risk', choices: ['Maintenance risk', 'Better accuracy', 'Guaranteed support', 'Lower privacy risk'] },
      { id: 'ci', left: 'Failing CI on recent commits', correct: 'Quality or integration risk', choices: ['Quality or integration risk', 'Clear legal approval', 'More adoption', 'Safe data handling'] },
      { id: 'security', left: 'No security policy or advisory process', correct: 'Vulnerability response risk', choices: ['Vulnerability response risk', 'Higher benchmark score', 'Better UI', 'More citations'] },
      { id: 'license', left: 'License missing or incompatible', correct: 'Legal adoption risk', choices: ['Legal adoption risk', 'Lower latency', 'More memory', 'Less need for tests'] },
    ],
    options: [],
  },
  {
    id: 'MATCH-AI-BENCHMARKS-065',
    domain: 'D3',
    secondaryDomains: ['D5'],
    difficulty: 'proficient',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D3-verification', 'D5-strategy'],
    skillIds: ['benchmark literacy', 'MMLU', 'SWE-bench', 'leaderboard', 'task fit'],
    evidenceMode: 'hybrid',
    functionTracks: ['technical', 'general'],
    stimulus: { src: '/stimuli/raw-rag-source-comparison.svg', alt: 'Benchmark brief comparing model scores across knowledge, coding, long-context, and agentic tasks', label: 'Benchmark matching brief', caption: 'Different benchmarks answer different questions. None is universal.' },
    context: 'A team sees several model benchmark names in vendor material.',
    prompt: 'Match each benchmark type to what it is most likely trying to measure.',
    matchPairs: [
      { id: 'knowledge', left: 'General knowledge exam benchmark', correct: 'Broad factual and reasoning performance', choices: ['Broad factual and reasoning performance', 'Repository issue resolution only', 'Robot motion control', 'Customer churn ROI'] },
      { id: 'swe', left: 'Software engineering benchmark', correct: 'Code change and issue-solving ability', choices: ['Code change and issue-solving ability', 'Image provenance', 'Policy approval', 'Medical consent'] },
      { id: 'long', left: 'Long-context benchmark', correct: 'Using information across large documents', choices: ['Using information across large documents', 'Physical driving safety', 'Vendor license rights', 'Ad campaign spend'] },
      { id: 'agent', left: 'Agentic task benchmark', correct: 'Planning and tool use across steps', choices: ['Planning and tool use across steps', 'Only text fluency', 'Logo recognition', 'Payroll accuracy'] },
    ],
    options: [],
  },
  {
    id: 'MATCH-AI-CONTROLS-066',
    domain: 'D4',
    secondaryDomains: ['D6'],
    difficulty: 'applied',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D4-governance', 'D6-collaboration'],
    skillIds: ['human review', 'audit log', 'approval gate', 'escalation path'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/gen-exp-privacy-workflow-board.svg', alt: 'Governance control board with approval gate, audit log, source rule, and escalation lane', label: 'Control matching board', caption: 'Controls should match the actual risk, not be generic policy theater.' },
    context: 'A team is designing controls for an AI assistant used in customer decisions.',
    prompt: 'Match each AI control to the problem it solves.',
    matchPairs: [
      { id: 'approval', left: 'Approval gate', correct: 'Stops high-impact action before human signoff', choices: ['Stops high-impact action before human signoff', 'Improves logo quality', 'Makes answers longer', 'Increases benchmark score'] },
      { id: 'audit', left: 'Audit log', correct: 'Shows prompt, source, action, reviewer, and reason trail', choices: ['Shows prompt, source, action, reviewer, and reason trail', 'Replaces all training', 'Proves model is unbiased', 'Removes need for policy'] },
      { id: 'source', left: 'Approved-source rule', correct: 'Prevents unsupported or unapproved evidence use', choices: ['Prevents unsupported or unapproved evidence use', 'Selects font color', 'Guarantees ROI', 'Avoids all incidents'] },
      { id: 'escalate', left: 'Escalation path', correct: 'Moves uncertain or harmful cases to accountable humans', choices: ['Moves uncertain or harmful cases to accountable humans', 'Lets AI self-approve', 'Deletes user complaints', 'Maximizes automation'] },
    ],
    options: [],
  },
  {
    id: 'DEPTH-EXP-D1-D2-067',
    domain: 'D1',
    secondaryDomains: ['D2'],
    difficulty: 'applied',
    type: 'concept-cluster',
    interaction: 'parts',
    competencyIds: ['D1-concepts', 'D2-prompting'],
    skillIds: ['context window', 'RAG', 'prompt constraints', 'grounding'],
    evidenceMode: 'hybrid',
    stimulus: { src: '/stimuli/ai-concept-workbench.svg', alt: 'Concept workbench showing context, retrieval, prompt rules, and hallucination risks', label: 'Concept-to-prompt cluster', caption: 'The item checks whether users can turn AI concepts into better prompting practice.' },
    context: 'A team is building a policy assistant and keeps treating longer prompts, retrieval, and memory as interchangeable fixes.',
    prompt: 'Answer each mini-part about choosing the right concept and prompt move.',
    parts: [
      {
        id: 'current-policy',
        domain: 'D1',
        prompt: 'What best supports answers about the current approved policy?',
        correctOptionId: 'b',
        options: [
          { id: 'a', label: 'Rely on model training data because it is broad.', score: 25, feedback: 'Training data may be stale or missing private policy.' },
          { id: 'b', label: 'Retrieve the approved source at answer time.', score: 98, feedback: 'Correct. RAG is the right concept for current source grounding.' },
          { id: 'c', label: 'Ask for a more confident tone.', score: 10, feedback: 'Tone does not improve source support.' },
        ],
      },
      {
        id: 'prompt-constraint',
        domain: 'D2',
        prompt: 'Which prompt instruction best reduces unsupported policy claims?',
        correctOptionId: 'a',
        options: [
          { id: 'a', label: 'Use only the supplied policy and mark missing evidence.', score: 98, feedback: 'Correct. This gives a source rule and uncertainty behavior.' },
          { id: 'b', label: 'Be concise and persuasive.', score: 35, feedback: 'Style does not control factual grounding.' },
          { id: 'c', label: 'Answer from general best practice if the file is unclear.', score: 20, feedback: 'That invites unsupported substitution.' },
        ],
      },
      {
        id: 'context-limit',
        domain: 'D1',
        prompt: 'What is a practical context-window risk?',
        correctOptionId: 'c',
        options: [
          { id: 'a', label: 'The model can remember infinite source text exactly.', score: 10, feedback: 'Context is limited and must be managed.' },
          { id: 'b', label: 'More pasted material always lowers risk.', score: 20, feedback: 'More context can add noise and private data.' },
          { id: 'c', label: 'Important details can be omitted, buried, or outweighed by irrelevant context.', score: 98, feedback: 'Correct. Users need scoped, relevant inputs.' },
        ],
      },
    ],
    options: [],
  },
  {
    id: 'DEPTH-EXP-D1-SYSTEMS-068',
    domain: 'D1',
    difficulty: 'proficient',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D1-systems'],
    skillIds: ['memory', 'tool connectors', 'app policy', 'audit trail'],
    evidenceMode: 'knowing',
    stimulus: { src: '/stimuli/agent-tool-trace.svg', alt: 'AI assistant system diagram with memory, connectors, permissions, and logs', label: 'System boundary map', caption: 'System literacy means separating model behavior from app, tool, and governance behavior.' },
    context: 'A buyer compares two AI assistants that use the same model but have different product configurations.',
    prompt: 'Match each system feature to the operational question it raises.',
    matchPairs: [
      { id: 'memory', left: 'Saved memory', correct: 'What is retained, editable, and visible to users?', choices: ['What is retained, editable, and visible to users?', 'Which font is used?', 'Whether the model can never hallucinate', 'Which competitor launched first'] },
      { id: 'connector', left: 'CRM connector', correct: 'Which records can be read or changed?', choices: ['Which records can be read or changed?', 'Whether the answer is shorter', 'Whether users like the logo', 'Which benchmark is most famous'] },
      { id: 'policy', left: 'Enterprise data policy', correct: 'Which data may enter the assistant and under what terms?', choices: ['Which data may enter the assistant and under what terms?', 'Whether all prompts become public posts', 'Whether every answer is approved', 'Which model has the longest name'] },
      { id: 'log', left: 'Action log', correct: 'Who can review prompts, sources, actions, and approvals?', choices: ['Who can review prompts, sources, actions, and approvals?', 'How colorful the dashboard is', 'Whether training is optional forever', 'Whether cost disappears'] },
    ],
    options: [],
  },
  {
    id: 'DEPTH-EXP-D1-D3-069',
    domain: 'D1',
    secondaryDomains: ['D3'],
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'multi',
    competencyIds: ['D1-concepts', 'D3-verification'],
    skillIds: ['model capability claims', 'evaluation limits', 'benchmark fit', 'hallucination'],
    evidenceMode: 'hybrid',
    stimulus: { src: '/stimuli/raw-rag-source-comparison.svg', alt: 'AI answer and source comparison with model capability notes and unsupported claims', label: 'Capability claim review', caption: 'A model capability claim still needs source, task, and evaluation context.' },
    context: 'A vendor says the newest model makes hallucination solved for policy work.',
    prompt: 'Which checks should a literate buyer require before accepting that claim?',
    correctOptionIds: ['task', 'sources', 'failures', 'local'],
    options: [
      { id: 'task', label: 'Check whether the evaluation task matches the policy workflow.', score: 25, feedback: 'Correct. Capability depends on task fit.' },
      { id: 'sources', label: 'Inspect whether answers were grounded in approved sources.', score: 25, feedback: 'Correct. Grounding changes reliability.' },
      { id: 'failures', label: 'Ask for failure cases, refusal behavior, and uncertainty handling.', score: 25, feedback: 'Correct. Limits matter as much as headline scores.' },
      { id: 'local', label: 'Run a local test on representative policies and edge cases.', score: 25, feedback: 'Correct. Local evidence is needed before deployment.' },
      { id: 'headline', label: 'Trust the claim because the model is newest.', score: 0, feedback: 'Newness is not proof of workflow reliability.' },
    ],
  },
  {
    id: 'DEPTH-EXP-D2-PROMPT-070',
    domain: 'D2',
    difficulty: 'proficient',
    type: 'narrative',
    interaction: 'text',
    competencyIds: ['D2-prompting'],
    skillIds: ['prompt repair', 'rubric', 'source rules', 'review criteria'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/raw-marketing-campaign-dashboard.svg', alt: 'Marketing dashboard with campaign segments, tiny samples, coupon anomaly, and AI recommendation', label: 'Campaign prompt repair', caption: 'The prompt should make AI separate creative advice from evidence review.' },
    context: 'A marketer asks AI, “Tell me which campaign to scale,” after uploading a dashboard with sample-size and tracking caveats.',
    prompt: 'Write a safer prompt that asks for decision support without hiding uncertainty.',
    rubricCriteria: [
      { id: 'role', label: 'Defines the role and task', keywords: ['act as', 'marketing', 'analyst', 'recommend', 'decision'], points: 18 },
      { id: 'evidence', label: 'Requires dashboard evidence and caveats', keywords: ['evidence', 'sample', 'caveat', 'dashboard', 'coupon', 'tracking'], points: 28 },
      { id: 'uncertainty', label: 'Asks to separate facts from assumptions', keywords: ['assumption', 'uncertain', 'confidence', 'unknown', 'flag'], points: 22 },
      { id: 'format', label: 'Specifies useful output format', keywords: ['format', 'table', 'options', 'pros', 'cons', 'criteria'], points: 16 },
      { id: 'review', label: 'Includes review or next test', keywords: ['test', 'review', 'validate', 'incrementality', 'pilot'], points: 16 },
    ],
    exemplarAnswer: 'Act as a marketing analyst. Use only the uploaded dashboard to compare campaigns by sample size, conversion quality, coupon anomaly, cost, and confidence. Separate observed facts from assumptions, return a table with scale/hold/test recommendations, and list the next validation needed before increasing spend.',
    options: [],
  },
  {
    id: 'DEPTH-EXP-D2-D6-071',
    domain: 'D2',
    secondaryDomains: ['D6'],
    difficulty: 'applied',
    type: 'drag-order',
    interaction: 'rank',
    competencyIds: ['D2-workflows', 'D6-collaboration'],
    skillIds: ['workflow mapping', 'handoffs', 'role clarity', 'review routine'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/realistic-support-ticket-ai-draft.png', alt: 'Customer support console showing duplicate-charge evidence, SLA warning, policy notes, reviewer notes, and a weak AI draft response.', label: 'Support workflow redesign', caption: 'The item asks users to sequence a human-AI workflow, not just choose a reply.' },
    context: 'A support team wants AI to help with duplicate-charge tickets while preserving reviewer learning.',
    prompt: 'Order the workflow steps.',
    rankItems: [
      { id: 'classify', label: 'Classify ticket risk and identify required evidence.' },
      { id: 'draft', label: 'Have AI draft from ticket, payment log, and policy only.' },
      { id: 'review', label: 'Human reviewer checks evidence, tone, and exception rules.' },
      { id: 'send', label: 'Send approved response and record override reason.' },
      { id: 'learn', label: 'Review patterns weekly and update coaching or prompts.' },
    ],
    idealOrder: ['classify', 'draft', 'review', 'send', 'learn'],
    options: [],
  },
  {
    id: 'DEPTH-EXP-D2-D5-072',
    domain: 'D2',
    secondaryDomains: ['D5'],
    difficulty: 'proficient',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D2-workflows', 'D5-value'],
    skillIds: ['tool selection', 'workflow fit', 'baseline metrics', 'pilot gates'],
    evidenceMode: 'hybrid',
    stimulus: { src: '/stimuli/func-exp-ops-data-workflow-log.svg', alt: 'Operations workflow log showing volume, error types, handoffs, and automation candidates', label: 'Workflow-value map', caption: 'Tool choices should follow workflow evidence and measurable value.' },
    context: 'An operations lead compares four AI tool ideas for the same overloaded process.',
    prompt: 'Match each workflow signal to the best tool or pilot choice.',
    matchPairs: [
      { id: 'search', left: 'Users cannot find approved procedure details', correct: 'RAG knowledge assistant with source citations', choices: ['RAG knowledge assistant with source citations', 'Autonomous payment approval', 'Synthetic video generator', 'Unmeasured chatbot launch'] },
      { id: 'draft', left: 'Staff spend time writing repetitive status notes', correct: 'Drafting copilot with reviewer checklist', choices: ['Drafting copilot with reviewer checklist', 'Delete the workflow owner', 'Ignore source quality', 'Use only a trend report'] },
      { id: 'handoff', left: 'Tickets stall between teams with unclear next step', correct: 'Workflow triage with explicit handoff states', choices: ['Workflow triage with explicit handoff states', 'A prettier dashboard only', 'One generic prompt', 'Full autonomy without logs'] },
      { id: 'measure', left: 'No baseline exists for time, quality, or rework', correct: 'Measurement-first pilot before scale', choices: ['Measurement-first pilot before scale', 'Scale immediately', 'Pick the newest model', 'Report prompt volume as ROI'] },
    ],
    options: [],
  },
  {
    id: 'DEPTH-EXP-D3-MEDIA-073',
    domain: 'D3',
    difficulty: 'applied',
    type: 'fraud-detection',
    interaction: 'multi',
    competencyIds: ['D3-media'],
    skillIds: ['phishing checks', 'payment fraud', 'domain inspection', 'provenance'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/gen-exp-fraud-sms-thread.svg', alt: 'Suspicious delivery SMS with short link, payment page, countdown, and card field', label: 'Delivery SMS review', caption: 'Users must inspect message, link, payment request, and verification path.' },
    context: 'A delivery message asks for a customs fee through a shortened link while the recipient is expecting a package.',
    prompt: 'Which red flags should be selected before taking action?',
    correctOptionIds: ['link', 'pressure', 'card', 'verify'],
    options: [
      { id: 'link', label: 'Shortened or mismatched tracking domain.', score: 25, feedback: 'Correct. Domain mismatch is a major fraud signal.' },
      { id: 'pressure', label: 'Urgent countdown or threat of failed delivery.', score: 25, feedback: 'Correct. Pressure is a common manipulation tactic.' },
      { id: 'card', label: 'Request for full card details for a tiny fee.', score: 25, feedback: 'Correct. Payment collection should be treated carefully.' },
      { id: 'verify', label: 'Need to verify through the carrier app or official site.', score: 25, feedback: 'Correct. Official-channel verification is the safer path.' },
      { id: 'expected', label: 'No risk because a package is expected.', score: 0, feedback: 'Attackers often exploit plausible timing.' },
    ],
  },
  {
    id: 'DEPTH-EXP-D3-MEDIA-074',
    domain: 'D3',
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'text',
    competencyIds: ['D3-media'],
    skillIds: ['synthetic media', 'executive impersonation', 'provenance', 'response triage'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/executive-synthetic-post.svg', alt: 'Executive impersonation post with synthetic image cues, urgent timing, and missing original source', label: 'Synthetic executive post', caption: 'The response should avoid both credulity and unsupported dismissal.' },
    context: 'A realistic post claims a company executive announced layoffs before market open, but the source is an anonymous repost.',
    prompt: 'Write 2-4 sentences naming verification steps and the communication posture.',
    rubricCriteria: [
      { id: 'source', label: 'Checks original source or official channel', keywords: ['original', 'official', 'company', 'source', 'channel'], points: 28 },
      { id: 'media', label: 'Mentions media/provenance review', keywords: ['image', 'video', 'synthetic', 'metadata', 'provenance'], points: 24 },
      { id: 'internal', label: 'Calls for internal confirmation', keywords: ['internal', 'confirm', 'legal', 'communications', 'executive'], points: 22 },
      { id: 'posture', label: 'Uses cautious communication', keywords: ['unverified', 'avoid amplifying', 'holding', 'statement', 'caution'], points: 24 },
    ],
    exemplarAnswer: 'Treat the post as unverified until the original source, company channels, and internal communications/legal contacts confirm it. Review the media for provenance and manipulation clues, avoid amplifying the claim, and prepare a cautious holding statement if employees or markets are affected.',
    options: [],
  },
  {
    id: 'DEPTH-EXP-D3-MEDIA-075',
    domain: 'D3',
    secondaryDomains: ['D4'],
    difficulty: 'applied',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D3-media', 'D4-governance'],
    skillIds: ['fraud artifact review', 'invoice fraud', 'approval control', 'audit trail'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/fraud-invoice.svg', alt: 'Suspicious invoice with altered bank details, urgency language, vendor mismatch, and approval gap', label: 'Invoice fraud artifact', caption: 'Fraud review connects artifact clues to payment controls.' },
    context: 'A finance team receives an urgent invoice that may have been altered using AI-assisted editing.',
    prompt: 'Match each artifact clue to the safest control.',
    matchPairs: [
      { id: 'bank', left: 'Bank details changed from prior invoices', correct: 'Verify through known vendor contact before payment', choices: ['Verify through known vendor contact before payment', 'Pay faster to keep discount', 'Use the new bank field silently', 'Ask AI to approve'] },
      { id: 'urgent', left: 'Urgent pressure from unfamiliar sender', correct: 'Slow down and follow exception approval path', choices: ['Slow down and follow exception approval path', 'Bypass review', 'Delete audit notes', 'Trust the confident wording'] },
      { id: 'logo', left: 'Logo and spacing differ from vendor template', correct: 'Compare against known-good invoice and contract record', choices: ['Compare against known-good invoice and contract record', 'Ignore visual anomalies', 'Change the payment amount', 'Use only the email subject'] },
      { id: 'approval', left: 'Approver name appears but no approval trail exists', correct: 'Require auditable approval in the finance system', choices: ['Require auditable approval in the finance system', 'Treat the PDF as approval', 'Let the vendor decide', 'Hide uncertainty'] },
    ],
    options: [],
  },
  {
    id: 'DEPTH-EXP-D3-D5-076',
    domain: 'D3',
    secondaryDomains: ['D5'],
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'multi',
    competencyIds: ['D3-verification', 'D5-strategy'],
    skillIds: ['chart forensics', 'business-case review', 'sample size', 'measurement design'],
    evidenceMode: 'hybrid',
    stimulus: { src: '/stimuli/productivity-chart-forensics.png', alt: 'Productivity dashboard with large AI lift claim, unclear baseline, small sample, and visual scale issues', label: 'Productivity evidence review', caption: 'The user must inspect evidence quality before treating the claim as strategy input.' },
    context: 'A board packet uses a productivity chart to justify expanding an AI program companywide.',
    prompt: 'Which evidence gaps should be challenged?',
    correctOptionIds: ['baseline', 'sample', 'period', 'quality'],
    options: [
      { id: 'baseline', label: 'Missing pre-pilot baseline and comparison group.', score: 25, feedback: 'Correct. Lift needs a comparison point.' },
      { id: 'sample', label: 'Unclear sample size and adoption rate.', score: 25, feedback: 'Correct. Weak samples can exaggerate results.' },
      { id: 'period', label: 'Measurement period and seasonality are not shown.', score: 25, feedback: 'Correct. Timing can distort outcomes.' },
      { id: 'quality', label: 'No quality, rework, or customer-impact metric.', score: 25, feedback: 'Correct. Productivity alone can hide harm.' },
      { id: 'color', label: 'The chart uses a muted color palette.', score: 0, feedback: 'Color is not the decision-grade evidence issue.' },
    ],
  },
  {
    id: 'DEPTH-EXP-D4-GOV-077',
    domain: 'D4',
    difficulty: 'proficient',
    type: 'drag-order',
    interaction: 'rank',
    competencyIds: ['D4-governance'],
    skillIds: ['incident response', 'containment', 'notification', 'postmortem'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/executive/exec-exp-incident-timeline-support-ai.svg', alt: 'AI support incident timeline with customer impact, delayed escalation, weak monitoring, and missing owner', label: 'AI incident timeline', caption: 'Incident response needs ordered actions, not a vague promise to improve.' },
    context: 'An AI support workflow sent incorrect refund guidance to customers.',
    prompt: 'Order the response actions.',
    rankItems: [
      { id: 'contain', label: 'Contain the workflow and stop repeat harm.' },
      { id: 'scope', label: 'Scope affected customers, outputs, and data.' },
      { id: 'notify', label: 'Notify stakeholders through approved legal/comms path.' },
      { id: 'fix', label: 'Fix controls, prompts, evidence checks, and rollback path.' },
      { id: 'learn', label: 'Run a post-incident review with owner and prevention metrics.' },
    ],
    idealOrder: ['contain', 'scope', 'notify', 'fix', 'learn'],
    options: [],
  },
  {
    id: 'DEPTH-EXP-D4-D1-078',
    domain: 'D4',
    secondaryDomains: ['D1'],
    difficulty: 'applied',
    type: 'concept-cluster',
    interaction: 'parts',
    competencyIds: ['D4-governance', 'D1-systems'],
    skillIds: ['vendor controls', 'model improvement rights', 'retention', 'subprocessors'],
    evidenceMode: 'hybrid',
    stimulus: { src: '/stimuli/executive/exec-exp-vendor-memo-data-rights.svg', alt: 'Vendor memo with unresolved model improvement, data retention, support access, audit, and subprocessor terms', label: 'Vendor data-rights cluster', caption: 'The item links system features to governance contract terms.' },
    context: 'A vendor wants to use customer data in its AI platform and offers a discount for quick signature.',
    prompt: 'Answer the mini-parts before approving the vendor.',
    parts: [
      {
        id: 'improvement',
        domain: 'D4',
        prompt: 'Which term needs explicit approval before customer data can improve vendor models?',
        correctOptionId: 'a',
        options: [
          { id: 'a', label: 'Training/model-improvement data rights and opt-out terms.', score: 98, feedback: 'Correct. Data reuse must be explicit.' },
          { id: 'b', label: 'The vendor logo placement.', score: 5, feedback: 'Branding does not settle data rights.' },
          { id: 'c', label: 'The longest possible contract appendix.', score: 20, feedback: 'Length is not the issue; enforceable terms are.' },
        ],
      },
      {
        id: 'support',
        domain: 'D1',
        prompt: 'Why does support access change system risk?',
        correctOptionId: 'b',
        options: [
          { id: 'a', label: 'It only changes the user interface.', score: 10, feedback: 'Support access can expose data and logs.' },
          { id: 'b', label: 'It can expand who sees prompts, files, outputs, or customer records.', score: 98, feedback: 'Correct. System access boundaries matter.' },
          { id: 'c', label: 'It proves the model is more accurate.', score: 15, feedback: 'Access and accuracy are different questions.' },
        ],
      },
      {
        id: 'audit',
        domain: 'D4',
        prompt: 'What evidence should the contract preserve?',
        correctOptionId: 'c',
        options: [
          { id: 'a', label: 'Only monthly seat counts.', score: 20, feedback: 'Seat counts do not support incident review.' },
          { id: 'b', label: 'Only vendor marketing claims.', score: 10, feedback: 'Claims are not audit evidence.' },
          { id: 'c', label: 'Retention, audit logs, access approvals, incident duties, and exit rights.', score: 98, feedback: 'Correct. These make governance enforceable.' },
        ],
      },
    ],
    options: [],
  },
  {
    id: 'DEPTH-EXP-D5-VALUE-079',
    domain: 'D5',
    secondaryDomains: ['D2'],
    difficulty: 'applied',
    type: 'report-review',
    interaction: 'text',
    competencyIds: ['D5-value', 'D2-workflows'],
    skillIds: ['use-case fit', 'baseline metrics', 'pilot design', 'workflow evidence'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/raw-sales-crm-pipeline.svg', alt: 'Sales CRM pipeline with stale deals, weak activity signals, AI forecast, and risk flags', label: 'Sales forecast value review', caption: 'The written response should connect workflow evidence to value measurement.' },
    context: 'A sales team wants to buy an AI forecasting assistant because one forecast predicts a larger quarter.',
    prompt: 'Write 2-4 sentences explaining what evidence would make this a fundable pilot.',
    rubricCriteria: [
      { id: 'baseline', label: 'Requires baseline comparison', keywords: ['baseline', 'before', 'after', 'compare', 'accuracy'], points: 26 },
      { id: 'workflow', label: 'Connects to seller workflow decisions', keywords: ['workflow', 'seller', 'follow-up', 'deal', 'action'], points: 22 },
      { id: 'quality', label: 'Includes quality or error segmentation', keywords: ['error', 'stale', 'stage', 'segment', 'quality'], points: 22 },
      { id: 'gate', label: 'Defines pilot and scale gate', keywords: ['pilot', 'gate', 'scale', 'criteria', 'stop'], points: 18 },
      { id: 'risk', label: 'Mentions risk or customer impact', keywords: ['risk', 'customer', 'harm', 'confidence', 'review'], points: 10 },
    ],
    exemplarAnswer: 'A fundable pilot needs a baseline forecast accuracy comparison on similar deals, segmented by stage and stale activity. It should show that seller actions improve, not just that predictions look optimistic, and it needs a scale gate based on accuracy, customer impact, override reasons, and workflow adoption.',
    options: [],
  },
  {
    id: 'DEPTH-EXP-D5-STRATEGY-080',
    domain: 'D5',
    difficulty: 'proficient',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D5-strategy'],
    skillIds: ['portfolio strategy', 'build buy partner', 'data advantage', 'risk appetite'],
    evidenceMode: 'hybrid',
    stimulus: { src: '/stimuli/executive/exec-exp-board-packet-scale-readiness.svg', alt: 'AI portfolio board packet with options by value, risk, data readiness, and strategic differentiation', label: 'Portfolio strategy board', caption: 'Strategic AI choices depend on differentiation, risk, and readiness.' },
    context: 'Leadership is deciding whether to build, buy, partner, pause, or pilot across multiple AI opportunities.',
    prompt: 'Match each strategic signal to the best portfolio move.',
    matchPairs: [
      { id: 'advantage', left: 'Unique proprietary data creates durable customer advantage', correct: 'Build or co-develop with strong controls', choices: ['Build or co-develop with strong controls', 'Buy the cheapest commodity tool', 'Ignore governance', 'Measure prompt volume only'] },
      { id: 'commodity', left: 'Common back-office task with mature vendors', correct: 'Buy/configure and measure adoption', choices: ['Buy/configure and measure adoption', 'Build from scratch for prestige', 'Treat as board-level innovation', 'Skip procurement'] },
      { id: 'unclear', left: 'High risk and unresolved data rights', correct: 'Pause until governance terms are resolved', choices: ['Pause until governance terms are resolved', 'Scale to learn from mistakes', 'Hide risk from sponsors', 'Use a longer prompt'] },
      { id: 'starter', left: 'Clear pain, measurable baseline, low risk', correct: 'Pilot with success and stop criteria', choices: ['Pilot with success and stop criteria', 'Delay until perfect certainty', 'Launch companywide', 'Outsource accountability'] },
    ],
    options: [],
  },
  {
    id: 'DEPTH-EXP-D5-D6-081',
    domain: 'D5',
    secondaryDomains: ['D6'],
    difficulty: 'proficient',
    type: 'multi-select',
    interaction: 'multi',
    competencyIds: ['D5-value', 'D6-change'],
    skillIds: ['benefit realization', 'adoption support', 'manager enablement', 'value dashboard'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/productivity-chart-forensics.png', alt: 'Adoption and productivity dashboard with usage, quality, confidence, and missing learning-loop indicators', label: 'Value adoption dashboard', caption: 'The best dashboard combines value, quality, adoption, and learning evidence.' },
    context: 'A COO wants a dashboard to decide whether AI drafting should expand beyond one department.',
    prompt: 'Which measures belong in the expansion dashboard?',
    correctOptionIds: ['outcome', 'quality', 'adoption', 'learning'],
    options: [
      { id: 'outcome', label: 'Workflow outcome vs baseline, such as cycle time or resolved tickets.', score: 25, feedback: 'Correct. Value needs a baseline outcome.' },
      { id: 'quality', label: 'Quality defects, rework, exceptions, and customer-impact incidents.', score: 25, feedback: 'Correct. Speed without quality is incomplete.' },
      { id: 'adoption', label: 'Sustained use by role and manager coaching coverage.', score: 25, feedback: 'Correct. Change evidence matters for scale.' },
      { id: 'learning', label: 'Override reasons, user feedback, and prompt/workflow updates.', score: 25, feedback: 'Correct. Learning loops show whether the system improves.' },
      { id: 'volume', label: 'Total prompts sent as the single success metric.', score: 0, feedback: 'Activity volume alone does not prove value.' },
    ],
  },
  {
    id: 'DEPTH-EXP-D6-CHANGE-082',
    domain: 'D6',
    difficulty: 'applied',
    type: 'narrative',
    interaction: 'text',
    competencyIds: ['D6-change'],
    skillIds: ['manager enablement', 'communication', 'training plan', 'support channel'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/raw-agent-workflow-plan.svg', alt: 'AI rollout plan with manager checklist, training sessions, support channel, and feedback loop gaps', label: 'Manager enablement plan', caption: 'Change leadership asks what managers will do after access is granted.' },
    context: 'A company launches an AI assistant, but managers are unsure how to coach safe and useful use.',
    prompt: 'Write a 30-day manager enablement plan in 2-4 sentences.',
    rubricCriteria: [
      { id: 'examples', label: 'Gives role-specific examples', keywords: ['example', 'workflow', 'role', 'scenario', 'task'], points: 22 },
      { id: 'review', label: 'Defines review routines', keywords: ['review', 'check', 'quality', 'override', 'sample'], points: 22 },
      { id: 'support', label: 'Creates support channel or office hours', keywords: ['support', 'office hours', 'channel', 'questions', 'help'], points: 18 },
      { id: 'feedback', label: 'Uses feedback loop', keywords: ['feedback', 'learn', 'loop', 'update', 'share'], points: 22 },
      { id: 'metric', label: 'Tracks adoption and quality', keywords: ['metric', 'adoption', 'quality', 'measure', 'trust'], points: 14 },
    ],
    exemplarAnswer: 'Give managers role-specific starter workflows and a checklist for evidence, data, and review. Hold weekly office hours, sample AI-assisted outputs with teams, collect override and question patterns, and update guidance while tracking adoption, quality, trust, and support needs over 30 days.',
    options: [],
  },
  {
    id: 'DEPTH-EXP-D6-CHANGE-083',
    domain: 'D6',
    secondaryDomains: ['D4'],
    difficulty: 'proficient',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D6-change', 'D4-governance'],
    skillIds: ['change resistance', 'trust repair', 'incident learning', 'accountability'],
    evidenceMode: 'hybrid',
    stimulus: { src: '/stimuli/executive/exec-exp-incident-timeline-support-ai.svg', alt: 'Incident timeline showing AI error, customer impact, manager confusion, and weak learning ownership', label: 'Trust repair map', caption: 'Trust repair requires governance fixes and human change routines.' },
    context: 'Teams lose trust after an AI incident and managers receive conflicting guidance.',
    prompt: 'Match each trust signal to the leadership action.',
    matchPairs: [
      { id: 'fear', left: 'Employees fear blame for AI mistakes', correct: 'Use blameless review focused on controls and learning', choices: ['Use blameless review focused on controls and learning', 'Name and shame reviewers', 'Hide incidents', 'Remove all questions'] },
      { id: 'conflict', left: 'Managers give different rules for the same workflow', correct: 'Publish one approved playbook and escalation path', choices: ['Publish one approved playbook and escalation path', 'Let each team guess', 'Ask the model to set policy', 'Track only logins'] },
      { id: 'repeat', left: 'Same error repeats after fixes', correct: 'Assign owner for root cause and prevention metrics', choices: ['Assign owner for root cause and prevention metrics', 'Ignore because speed improved', 'Disable audit logs', 'Reward prompt volume'] },
      { id: 'hesitant', left: 'Users avoid useful low-risk AI tasks', correct: 'Coach safe starter workflows with visible review support', choices: ['Coach safe starter workflows with visible review support', 'Mandate high-risk automation', 'Cancel all training', 'Hide examples'] },
    ],
    options: [],
  },
  {
    id: 'DEPTH-EXP-D6-COLLAB-084',
    domain: 'D6',
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'multi',
    competencyIds: ['D6-collaboration'],
    skillIds: ['challenge culture', 'peer review', 'shared criteria', 'learning ownership'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/gen-exp-school-policy-draft.svg', alt: 'Group project draft with AI summary, source mismatch, reviewer notes, and missing challenge step', label: 'Group AI review', caption: 'Healthy collaboration makes evidence, disagreement, and reviewer roles visible.' },
    context: 'A project team uses AI to summarize sources, but one member notices a source exception was removed from the final draft.',
    prompt: 'Which collaboration moves should the team use before submitting?',
    correctOptionIds: ['reviewer', 'source', 'challenge', 'learn'],
    options: [
      { id: 'reviewer', label: 'Assign a named reviewer for the final source-faithfulness check.', score: 25, feedback: 'Correct. Role clarity prevents invisible gaps.' },
      { id: 'source', label: 'Compare the final wording against the source exception.', score: 25, feedback: 'Correct. The source exception is material.' },
      { id: 'challenge', label: 'Invite and document the teammate challenge before final approval.', score: 25, feedback: 'Correct. Challenge culture improves quality.' },
      { id: 'learn', label: 'Update the team prompt or checklist so exceptions are preserved next time.', score: 25, feedback: 'Correct. Collaboration improves through learning loops.' },
      { id: 'speed', label: 'Submit quickly because the AI summary is shorter.', score: 0, feedback: 'Speed should not erase important source conditions.' },
    ],
  },
  {
    id: 'DEPTH-EXP-D6-CHANGE-085',
    domain: 'D6',
    secondaryDomains: ['D5'],
    difficulty: 'applied',
    type: 'drag-order',
    interaction: 'rank',
    competencyIds: ['D6-change', 'D5-value'],
    skillIds: ['change rollout', 'pilot learning', 'adoption metrics', 'scale criteria'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/raw-agent-workflow-plan.svg', alt: 'Rollout plan with pilot group, training gap, support channel, quality review, and scale decision', label: 'AI rollout sequence', caption: 'The order links human adoption work to value realization.' },
    context: 'A department wants to scale an AI assistant after a promising pilot, but adoption is uneven.',
    prompt: 'Order the scale-readiness steps.',
    rankItems: [
      { id: 'listen', label: 'Review user feedback, override reasons, and adoption barriers.' },
      { id: 'coach', label: 'Coach managers on safe role-specific workflows.' },
      { id: 'measure', label: 'Measure quality, value, trust, and support demand against baseline.' },
      { id: 'adjust', label: 'Update prompts, controls, and training for weak spots.' },
      { id: 'scale', label: 'Scale only where evidence and manager support are strong.' },
    ],
    idealOrder: ['listen', 'coach', 'measure', 'adjust', 'scale'],
    options: [],
  },
  {
    id: 'DEPTH-EXP-D1-D2-086',
    domain: 'D1',
    secondaryDomains: ['D2'],
    difficulty: 'applied',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D1-concepts', 'D1-systems', 'D2-prompting'],
    skillIds: ['model vs app', 'RAG', 'memory', 'prompt repair'],
    evidenceMode: 'hybrid',
    stimulus: { src: '/stimuli/ai-concept-workbench.svg', alt: 'AI concept workbench with model, app, retrieval, memory, and prompt components', label: 'AI assistant anatomy', caption: 'Match each assistant behavior to the concept a user should understand.' },
    context: 'A training cohort is reviewing why one AI assistant answered from stale memory while another used current policy sources.',
    prompt: 'Match each behavior to the best explanation.',
    matchPairs: [
      { id: 'training', left: 'The model gives a plausible answer without the new policy', correct: 'Training data or prior context may be stale', choices: ['Training data or prior context may be stale', 'The answer is automatically audited', 'The prompt is always perfect', 'The app has no settings'] },
      { id: 'retrieval', left: 'The assistant quotes the approved policy repository', correct: 'Retrieval is grounding the answer in a source', choices: ['Retrieval is grounding the answer in a source', 'Memory replaces governance', 'A benchmark approved the output', 'The UI color created accuracy'] },
      { id: 'memory', left: 'The app remembers a user preference next week', correct: 'Saved memory is part of the product system', choices: ['Saved memory is part of the product system', 'The base model changed every file', 'The prompt disappeared', 'No privacy review can apply'] },
      { id: 'instruction', left: 'The user tells AI to cite evidence and mark uncertainty', correct: 'Prompt constraints guide the task and review behavior', choices: ['Prompt constraints guide the task and review behavior', 'A license term', 'A fraud signal', 'An adoption metric'] },
    ],
    options: [],
  },
  {
    id: 'DEPTH-EXP-D2-D5-087',
    domain: 'D2',
    secondaryDomains: ['D5'],
    difficulty: 'proficient',
    type: 'drag-order',
    interaction: 'rank',
    competencyIds: ['D2-workflows', 'D5-strategy'],
    skillIds: ['agent workflow', 'portfolio gate', 'operating model', 'scale criteria'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/executive/exec-exp-board-packet-scale-readiness.svg', alt: 'Executive board packet showing AI portfolio options, workflow readiness, controls, and scale gates', label: 'Workflow-to-strategy gate', caption: 'Strategy becomes practical only when workflow design and scale evidence connect.' },
    context: 'A transformation sponsor wants to move from scattered AI experiments to a governed portfolio of repeatable workflows.',
    prompt: 'Order the operating steps.',
    rankItems: [
      { id: 'inventory', label: 'Inventory workflows by pain, volume, risk, and owner.' },
      { id: 'pattern', label: 'Choose reusable AI patterns such as retrieval, drafting, or triage.' },
      { id: 'controls', label: 'Define data, tool, review, and escalation controls.' },
      { id: 'pilot', label: 'Pilot with baseline, success, stop, and learning criteria.' },
      { id: 'portfolio', label: 'Fund scale only for patterns that meet evidence gates.' },
    ],
    idealOrder: ['inventory', 'pattern', 'controls', 'pilot', 'portfolio'],
    options: [],
  },
  {
    id: 'DEPTH-EXP-D3-MEDIA-088',
    domain: 'D3',
    difficulty: 'proficient',
    type: 'fraud-detection',
    interaction: 'multi',
    competencyIds: ['D3-media'],
    skillIds: ['login fraud', 'deepfake lure', 'account security', 'artifact review'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/fraud-login.svg', alt: 'Suspicious login alert with unfamiliar device, urgent link, mismatched domain, and support chat pressure', label: 'Login alert review', caption: 'The user must inspect link, domain, device, timing, and pressure cues.' },
    context: 'A login alert says an account will be locked unless the user verifies through a link in the message.',
    prompt: 'Which signals should stop the user from clicking the link?',
    correctOptionIds: ['domain', 'pressure', 'device', 'channel'],
    options: [
      { id: 'domain', label: 'The link domain does not match the service domain.', score: 25, feedback: 'Correct. Domain mismatch is a high-value signal.' },
      { id: 'pressure', label: 'The message uses urgent account-lock pressure.', score: 25, feedback: 'Correct. Pressure can push users past verification.' },
      { id: 'device', label: 'The device/location claim should be checked independently.', score: 25, feedback: 'Correct. Use the account app or known URL.' },
      { id: 'channel', label: 'The safest path is opening the service directly, not the message link.', score: 25, feedback: 'Correct. Official-channel verification reduces fraud risk.' },
      { id: 'logo', label: 'The logo looks familiar, so the link is safe.', score: 0, feedback: 'Brand visuals can be copied.' },
    ],
  },
  {
    id: 'DEPTH-EXP-D3-D6-089',
    domain: 'D3',
    secondaryDomains: ['D6'],
    difficulty: 'applied',
    type: 'report-review',
    interaction: 'text',
    competencyIds: ['D3-media', 'D6-change'],
    skillIds: ['media provenance', 'team response', 'communication', 'learning loop'],
    evidenceMode: 'hybrid',
    stimulus: { src: '/stimuli/flood-claim-review-dashboard.png', alt: 'Analyst dashboard comparing a viral flood claim against weather, traffic-camera, source-history, and alert evidence.', label: 'Viral claim review dashboard', caption: 'The written answer should combine verification evidence and team communication.' },
    context: 'A team chat is about to repost an urgent disaster image, while an analyst dashboard shows mixed evidence about timing, weather, traffic, and source history.',
    prompt: 'Write 2-4 sentences telling the group what to do next and how to improve future sharing.',
    rubricCriteria: [
      { id: 'provenance', label: 'Requires source/date/location verification', keywords: ['source', 'date', 'location', 'original', 'verify'], points: 32 },
      { id: 'avoid', label: 'Avoids amplifying unverified content', keywords: ['unverified', 'do not share', 'avoid', 'wait', 'caution'], points: 24 },
      { id: 'official', label: 'Uses official or trusted updates', keywords: ['official', 'trusted', 'authority', 'news', 'local'], points: 20 },
      { id: 'norm', label: 'Creates a team norm or learning loop', keywords: ['rule', 'norm', 'checklist', 'next time', 'team'], points: 22 },
    ],
    exemplarAnswer: 'Do not repost it yet. Check the original source, timestamp, location clues, and official local updates, and label it unverified until confirmed. For future urgent posts, use a team checklist: source, date, location, and trusted confirmation before sharing.',
    options: [],
  },
  {
    id: 'DEPTH-EXP-D1-CONCEPTS-090',
    domain: 'D1',
    difficulty: 'awareness',
    type: 'report-review',
    interaction: 'multi',
    competencyIds: ['D1-concepts'],
    skillIds: ['hallucination', 'grounding', 'temperature', 'model limits'],
    evidenceMode: 'knowing',
    stimulus: { src: '/stimuli/ai-concept-workbench.svg', alt: 'AI concept card contrasting fluent answers, grounded answers, temperature, and model limits', label: 'Model limits review', caption: 'The item checks whether users can explain common AI reliability misconceptions.' },
    context: 'A workshop participant says a lower temperature, longer prompt, and confident citation style guarantee that an AI answer is true.',
    prompt: 'Which corrections should the facilitator make?',
    correctOptionIds: ['grounding', 'temperature', 'citation', 'verify'],
    options: [
      { id: 'grounding', label: 'Truth requires support from reliable sources or validated evidence.', score: 25, feedback: 'Correct. Grounding and verification are separate from style.' },
      { id: 'temperature', label: 'Lower temperature may reduce variation but does not guarantee correctness.', score: 25, feedback: 'Correct. Sampling settings are not fact checks.' },
      { id: 'citation', label: 'Citation style must be checked against the actual source.', score: 25, feedback: 'Correct. A citation-looking answer can still mismatch evidence.' },
      { id: 'verify', label: 'Users should compare important claims with source material before acting.', score: 25, feedback: 'Correct. Verification is the practical behavior.' },
      { id: 'guarantee', label: 'A confident answer is enough when the prompt is detailed.', score: 0, feedback: 'Confidence is not evidence.' },
    ],
  },
  {
    id: 'DEPTH-EXP-D2-PROMPT-091',
    domain: 'D2',
    difficulty: 'applied',
    type: 'report-review',
    interaction: 'multi',
    competencyIds: ['D2-prompting'],
    skillIds: ['prompt repair', 'source constraints', 'output format', 'review checks'],
    evidenceMode: 'doing',
    stimulus: { src: '/stimuli/raw-customer-notes.svg', alt: 'Customer notes with verified facts, unknown account details, policy constraints, and a weak AI prompt', label: 'Customer notes prompt audit', caption: 'Select the missing prompt ingredients before asking AI for a customer-facing draft.' },
    context: 'A teammate prompts AI with “write a customer update” after pasting notes that include verified facts, unknowns, and policy limits.',
    prompt: 'Which prompt additions would make the AI draft more usable and safer?',
    correctOptionIds: ['facts', 'unknowns', 'format', 'review'],
    options: [
      { id: 'facts', label: 'Tell AI to use only verified notes and approved policy language.', score: 25, feedback: 'Correct. Source constraints reduce invented claims.' },
      { id: 'unknowns', label: 'Require missing facts to be listed instead of guessed.', score: 25, feedback: 'Correct. Unknowns should stay visible.' },
      { id: 'format', label: 'Specify output sections: draft, evidence used, and open questions.', score: 25, feedback: 'Correct. Format makes review easier.' },
      { id: 'review', label: 'Add a final checklist for factual accuracy, tone, and approval needs.', score: 25, feedback: 'Correct. Review checks turn drafting into a workflow.' },
      { id: 'flair', label: 'Ask for a persuasive answer even if facts are missing.', score: 0, feedback: 'Persuasion without evidence creates risk.' },
    ],
  },
];

const questionBank: Question[] = [
  ...generalRelianceQuestions,
  ...functionalQuestionBank,
  ...competencyDepthQuestionBank,
  ...marketTrendQuestionBank,
  ...advancedCompetencyQuestionBank,
  {
    id: 'COMP-D1-CONCEPTS-001',
    domain: 'D1',
    difficulty: 'awareness',
    type: 'concept-cluster',
    interaction: 'parts',
    competencyIds: ['D1-concepts'],
    skillIds: ['LLM basics', 'RAG and grounding', 'hallucination', 'model limits'],
    evidenceMode: 'knowing',
    stimulus: {
      src: '/stimuli/ai-concept-workbench.svg',
      alt: 'Concept workbench comparing LLM, RAG, context, memory, and hallucination concepts',
      label: 'AI concept workbench',
      caption: 'Match everyday AI terms to what they actually mean before using them in a workflow.',
    },
    context: 'A team keeps mixing up LLM, RAG, context, memory, and hallucination while planning a chatbot.',
    prompt: 'Answer the mini-parts to show basic AI concept literacy.',
    parts: [
      {
        id: 'llm',
        domain: 'D1',
        prompt: 'What is the most accurate plain-language description of an LLM?',
        correctOptionId: 'b',
        options: [
          { id: 'a', label: 'A database that stores only verified facts.', score: 20, feedback: 'LLMs can produce facts, but they are not verified fact databases.' },
          { id: 'b', label: 'A model that predicts and generates language from learned patterns.', score: 95, feedback: 'Correct. This is the core idea behind LLM behavior.' },
          { id: 'c', label: 'A workflow tool that always checks company policy.', score: 25, feedback: 'That requires additional tools or retrieval, not just the LLM.' },
        ],
      },
      {
        id: 'rag',
        domain: 'D1',
        prompt: 'What does RAG add to a chatbot?',
        correctOptionId: 'a',
        options: [
          { id: 'a', label: 'Relevant source retrieval that the model can use while answering.', score: 95, feedback: 'Correct. RAG can ground answers in retrieved material.' },
          { id: 'b', label: 'A guarantee that every answer is legally approved.', score: 20, feedback: 'RAG helps, but approval still needs governance and review.' },
          { id: 'c', label: 'A larger screen for writing prompts.', score: 5, feedback: 'No. RAG is about retrieving context, not interface size.' },
        ],
      },
      {
        id: 'hallucination',
        domain: 'D1',
        prompt: 'What is a hallucination risk?',
        correctOptionId: 'c',
        options: [
          { id: 'a', label: 'The model refuses to answer unsafe content.', score: 25, feedback: 'That is refusal behavior, not hallucination.' },
          { id: 'b', label: 'The model is slower than expected.', score: 5, feedback: 'Latency is not hallucination.' },
          { id: 'c', label: 'The model gives a fluent answer that is unsupported or false.', score: 95, feedback: 'Correct. Fluency can hide weak evidence.' },
        ],
      },
    ],
    options: [],
  },
  {
    id: 'COMP-D1-SYSTEMS-002',
    domain: 'D1',
    secondaryDomains: ['D4'],
    difficulty: 'applied',
    type: 'report-review',
    competencyIds: ['D1-systems', 'D4-risk'],
    skillIds: ['models vs apps', 'memory', 'context windows', 'tool connectors', 'data boundary'],
    evidenceMode: 'hybrid',
    stimulus: {
      src: '/stimuli/agent-tool-trace.svg',
      alt: 'Tool trace showing a chatbot connected to calendar, email, and customer records',
      label: 'Tool connector trace',
      caption: 'The model is not the whole system. Connectors, memory, and permissions change what can happen.',
    },
    context: 'A manager says, “It is just a chatbot, so there is no privacy issue.” The screenshot shows calendar, email, and CRM connectors enabled.',
    prompt: 'What is the best correction?',
    options: [
      { id: 'a', label: 'The app matters because tools and memory can expose or act on user data.', score: 96, feedback: 'Correct. System literacy includes tools, permissions, memory, and context.' },
      { id: 'b', label: 'The model name alone tells us all operational risk.', score: 15, feedback: 'The model matters, but the app configuration can change the risk substantially.' },
      { id: 'c', label: 'Privacy is only relevant if the chatbot writes code.', score: 5, feedback: 'Privacy risk depends on data access and use, not only coding.' },
      { id: 'd', label: 'The safest fix is to disable every AI tool permanently.', score: 35, feedback: 'Too blunt. Better to scope connectors, permissions, and review gates.' },
    ],
  },
  {
    id: 'COMP-D2-PROMPT-003',
    domain: 'D2',
    difficulty: 'applied',
    type: 'narrative',
    interaction: 'text',
    competencyIds: ['D2-prompting'],
    skillIds: ['prompt repair', 'context setup', 'source rules', 'output format'],
    evidenceMode: 'doing',
    stimulus: {
      src: '/stimuli/raw-customer-service-escalation.svg',
      alt: 'Customer service ticket with refund dispute, SLA risk, and weak AI draft reply',
      label: 'Support prompt repair',
      caption: 'The prompt must make the assistant use the ticket facts and avoid unsupported promises.',
    },
    context: 'A support lead wants AI to draft a reply for an angry customer with a duplicate charge and SLA breach.',
    prompt: 'Write a better prompt for the AI assistant. Include task, context, source limits, tone, output format, and review rule.',
    rubricCriteria: [
      { id: 'task', label: 'Defines the drafting task clearly', keywords: ['draft', 'reply', 'email', 'response'], points: 18 },
      { id: 'context', label: 'Includes customer/ticket context', keywords: ['customer', 'ticket', 'duplicate', 'sla', 'refund'], points: 18 },
      { id: 'source', label: 'Restricts answer to verified sources', keywords: ['only use', 'source', 'ticket', 'record', 'policy'], points: 22 },
      { id: 'tone', label: 'Specifies tone and format', keywords: ['tone', 'empathetic', 'format', 'subject', 'bullets'], points: 18 },
      { id: 'review', label: 'Requires human review for risky claims', keywords: ['review', 'approval', 'human', 'verify', 'escalate'], points: 24 },
    ],
    exemplarAnswer: 'Act as a customer support assistant. Draft a concise, empathetic reply using only the ticket notes, payment record, and approved refund policy. Do not invent refund approval, timelines, or compensation. Output a subject line, customer reply, evidence used, and any items needing human approval. Flag duplicate-charge, SLA, legal, or policy exceptions for review before sending.',
    options: [],
  },
  {
    id: 'COMP-D2-WORKFLOW-004',
    domain: 'D2',
    secondaryDomains: ['D4', 'D5'],
    difficulty: 'proficient',
    type: 'drag-order',
    interaction: 'rank',
    competencyIds: ['D2-workflows', 'D4-risk', 'D5-value'],
    skillIds: ['GitHub workflow', 'AI code review', 'CI checks', 'human review', 'release gates'],
    evidenceMode: 'doing',
    functionTracks: ['technical', 'operations'],
    stimulus: {
      src: '/stimuli/raw-technical-access-log.svg',
      alt: 'Technical artifact with repository access, CI checks, and deployment notes',
      label: 'GitHub-style AI coding workflow',
      caption: 'A team is using an AI coding assistant inside a GitHub pull-request workflow.',
    },
    context: 'A technical team wants to use an AI assistant to propose code changes in a repository before production deploy.',
    prompt: 'Put the safeguards in the best sequence.',
    rankItems: [
      { id: 'scope', label: 'Limit the assistant to a branch, issue, and allowed files.' },
      { id: 'generate', label: 'Generate the patch with tests and a short rationale.' },
      { id: 'ci', label: 'Run lint, unit tests, security checks, and dependency review.' },
      { id: 'review', label: 'Require human pull-request review for behavior and risk.' },
      { id: 'release', label: 'Merge and monitor production signals after approval.' },
    ],
    idealOrder: ['scope', 'generate', 'ci', 'review', 'release'],
    options: [],
  },
  {
    id: 'COMP-D3-VERIFY-005',
    domain: 'D3',
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'multi',
    competencyIds: ['D3-verification'],
    skillIds: ['benchmark literacy', 'leaderboard review', 'contamination risk', 'task fit'],
    evidenceMode: 'hybrid',
    functionTracks: ['technical', 'general'],
    stimulus: {
      src: '/stimuli/raw-rag-source-comparison.svg',
      alt: 'Benchmark comparison artifact with model leaderboard notes and caveats',
      label: 'Model benchmark brief',
      caption: 'A team is comparing model scores before choosing a model for customer support.',
    },
    context: 'A vendor says its model is “best” because it leads one public benchmark. The team needs to decide whether the benchmark is relevant.',
    prompt: 'Which checks should the team run before trusting the benchmark claim?',
    correctOptionIds: ['task', 'leakage', 'recency', 'cost'],
    options: [
      { id: 'task', label: 'Check whether the benchmark task matches the support workflow.', score: 25, feedback: 'Correct. Benchmark fit matters.' },
      { id: 'leakage', label: 'Look for contamination, leakage, or overfitting warnings.', score: 25, feedback: 'Correct. Public benchmarks can be gamed or saturated.' },
      { id: 'recency', label: 'Compare dates, model version, and evaluation setting.', score: 25, feedback: 'Correct. Stale or mismatched evaluations mislead.' },
      { id: 'cost', label: 'Test latency, cost, safety behavior, and failure cases in the real workflow.', score: 25, feedback: 'Correct. Operational fit matters beyond score.' },
      { id: 'brand', label: 'Choose the best-known vendor because it is probably safer.', score: 0, feedback: 'Brand reputation is not enough evidence.' },
    ],
  },
  {
    id: 'COMP-D3-MEDIA-006',
    domain: 'D3',
    difficulty: 'applied',
    type: 'fraud-detection',
    interaction: 'multi',
    competencyIds: ['D3-media'],
    skillIds: ['synthetic media signals', 'provenance', 'image-caption check', 'fraud detection'],
    evidenceMode: 'doing',
    stimulus: {
      src: '/stimuli/fake-product-listing.svg',
      alt: 'Marketplace product listing with suspicious image, reviews, seller history, and pricing',
      label: 'Marketplace listing',
      caption: 'Inspect the picture, seller evidence, reviews, and claims before buying or sharing.',
    },
    context: 'A friend asks whether this discounted AI-generated-looking product listing is safe to buy.',
    prompt: 'Which signals should raise concern?',
    correctOptionIds: ['image', 'seller', 'reviews', 'payment'],
    options: [
      { id: 'image', label: 'The image has inconsistent product details across views.', score: 25, feedback: 'Correct. Visual inconsistency is a useful signal.' },
      { id: 'seller', label: 'The seller is new and has little verifiable history.', score: 25, feedback: 'Correct. Provenance matters.' },
      { id: 'reviews', label: 'Reviews repeat similar wording and dates.', score: 25, feedback: 'Correct. Review patterns can be suspicious.' },
      { id: 'payment', label: 'Payment or warranty terms differ from the platform policy.', score: 25, feedback: 'Correct. Off-platform terms increase risk.' },
      { id: 'discount', label: 'Any discount means the item is fake.', score: 0, feedback: 'A discount alone is not enough evidence.' },
    ],
  },
  {
    id: 'COMP-D4-RISK-007',
    domain: 'D4',
    secondaryDomains: ['D1'],
    difficulty: 'proficient',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D4-risk', 'D1-systems'],
    skillIds: ['Hugging Face model card', 'license review', 'training data rights', 'deployment risk'],
    evidenceMode: 'hybrid',
    functionTracks: ['technical', 'operations'],
    stimulus: {
      src: '/stimuli/raw-vendor-security-questionnaire.svg',
      alt: 'Model card and vendor questionnaire excerpt with license, dataset, intended use, and safety notes',
      label: 'Hugging Face-style model card review',
      caption: 'The artifact resembles a model card plus vendor security questionnaire for an open model.',
    },
    context: 'A team wants to download an open model from a model hub and deploy it in a customer workflow.',
    prompt: 'Match each model-card signal to the review action.',
    matchPairs: [
      { id: 'license', left: 'License field is unclear for commercial use', correct: 'Legal/license review before deployment', choices: ['Legal/license review before deployment', 'Ignore because the model is public', 'Increase temperature', 'Skip monitoring'] },
      { id: 'data', left: 'Training data summary omits sensitive-data handling', correct: 'Data provenance and privacy check', choices: ['Data provenance and privacy check', 'Use in production immediately', 'Only change the UI', 'Ask marketing to approve'] },
      { id: 'eval', left: 'Safety evaluation covers English chat only', correct: 'Test in local language and workflow', choices: ['Test in local language and workflow', 'Assume scores transfer', 'Disable all logging', 'Remove user feedback'] },
      { id: 'limits', left: 'Known limitation: may generate unsafe advice', correct: 'Add guardrails and human escalation', choices: ['Add guardrails and human escalation', 'Promote as autonomous expert', 'Hide limitation from users', 'Use only longer prompts'] },
    ],
    options: [],
  },
  {
    id: 'COMP-D4-GOV-008',
    domain: 'D4',
    secondaryDomains: ['D6'],
    difficulty: 'applied',
    type: 'report-review',
    interaction: 'multi',
    competencyIds: ['D4-governance', 'D6-collaboration'],
    skillIds: ['policy alignment', 'human review', 'incident response', 'accountability'],
    evidenceMode: 'doing',
    stimulus: {
      src: '/stimuli/raw-agent-audit-log.svg',
      alt: 'Agent audit log showing tool calls, approver names, missing reason codes, and escalation failures',
      label: 'Agent audit log',
      caption: 'The assistant took several actions, but the log has missing reason codes and unclear approval ownership.',
    },
    context: 'An AI agent changed customer follow-up tasks after reading sensitive records.',
    prompt: 'What governance evidence is missing?',
    correctOptionIds: ['owner', 'reason', 'approval', 'incident'],
    options: [
      { id: 'owner', label: 'Named accountable owner for the workflow and exceptions.', score: 25, feedback: 'Correct. Ownership must be visible.' },
      { id: 'reason', label: 'Reason codes for the agent actions and recommendations.', score: 25, feedback: 'Correct. Decisions need traceability.' },
      { id: 'approval', label: 'Approval gate for sensitive or customer-impacting changes.', score: 25, feedback: 'Correct. High-impact actions need review gates.' },
      { id: 'incident', label: 'Escalation route when the agent makes a harmful change.', score: 25, feedback: 'Correct. Incident response is part of governance.' },
      { id: 'style', label: 'A friendlier assistant avatar.', score: 0, feedback: 'Style does not solve accountability gaps.' },
    ],
  },
  {
    id: 'COMP-D5-VALUE-009',
    domain: 'D5',
    difficulty: 'applied',
    type: 'report-review',
    competencyIds: ['D5-value'],
    skillIds: ['use-case fit', 'baseline metrics', 'ROI evidence', 'pilot gates'],
    evidenceMode: 'doing',
    stimulus: {
      src: '/stimuli/ai-pilot-workflow.svg',
      alt: 'AI pilot canvas with baseline, outcome metric, risk level, data readiness, and scale gate',
      label: 'Pilot canvas',
      caption: 'The team has three AI ideas but only one has a measurable baseline and safe pilot path.',
    },
    context: 'A team can fund one AI pilot this quarter.',
    prompt: 'Which pilot is most ready?',
    options: [
      { id: 'a', label: 'A flashy chatbot demo with no baseline or owner.', score: 20, feedback: 'A demo without a baseline is weak evidence.' },
      { id: 'b', label: 'A ticket-triage draft tool with baseline handle time, review gate, and stop criteria.', score: 96, feedback: 'Correct. This has value evidence and pilot discipline.' },
      { id: 'c', label: 'A full automation plan for refunds before testing edge cases.', score: 25, feedback: 'Too much risk before validation.' },
      { id: 'd', label: 'A company-wide rollout because competitors mention AI in earnings calls.', score: 10, feedback: 'Trend pressure is not a business case.' },
    ],
  },
  {
    id: 'COMP-D5-STRATEGY-010',
    domain: 'D5',
    secondaryDomains: ['D3'],
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'text',
    competencyIds: ['D5-strategy', 'D3-verification'],
    skillIds: ['trend judgment', 'business-case design', 'portfolio decisions', 'benchmark interpretation'],
    evidenceMode: 'hybrid',
    stimulus: {
      src: '/stimuli/executive-market-report.svg',
      alt: 'Executive market report with competitor AI claims, benchmark caveats, and customer adoption notes',
      label: 'AI trend-to-strategy brief',
      caption: 'The report includes model news, competitor claims, and weak adoption evidence.',
    },
    context: 'Leadership asks whether a new model release and competitor announcement justify a major AI investment.',
    prompt: 'Write a short recommendation: what evidence would you require before funding the initiative?',
    rubricCriteria: [
      { id: 'business', label: 'Connects AI trend to business problem', keywords: ['business', 'customer', 'workflow', 'problem', 'outcome'], points: 22 },
      { id: 'evidence', label: 'Requires evidence beyond public claims', keywords: ['evidence', 'benchmark', 'pilot', 'data', 'customer'], points: 24 },
      { id: 'risk', label: 'Mentions risk, governance, or operating limits', keywords: ['risk', 'governance', 'safe', 'privacy', 'approval'], points: 20 },
      { id: 'metric', label: 'Defines success metric and baseline', keywords: ['metric', 'baseline', 'measure', 'roi', 'cost'], points: 22 },
      { id: 'gate', label: 'Uses staged funding or scale criteria', keywords: ['stage', 'gate', 'pilot', 'scale', 'stop'], points: 12 },
    ],
    exemplarAnswer: 'I would not fund a major rollout from model news alone. I would require a specific business workflow, current baseline, pilot metric, customer or cost impact, benchmark fit to our task, privacy and governance review, and a stage gate that expands only if the pilot beats baseline without unacceptable risk.',
    options: [],
  },
  {
    id: 'COMP-D6-COLLAB-011',
    domain: 'D6',
    difficulty: 'applied',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D6-collaboration'],
    skillIds: ['role clarity', 'review routines', 'challenge culture', 'learning ownership'],
    evidenceMode: 'doing',
    stimulus: {
      src: '/stimuli/realistic-support-ticket-ai-draft.png',
      alt: 'Customer support console showing duplicate-charge evidence, SLA warning, policy notes, reviewer notes, and a weak AI draft response.',
      label: 'Human-AI support review',
      caption: 'The team needs clear collaboration rules for AI drafts and human review.',
    },
    context: 'A support team is deciding how humans and AI should work together on sensitive tickets.',
    prompt: 'Match each work moment to the right collaboration rule.',
    matchPairs: [
      { id: 'draft', left: 'AI writes first reply draft', correct: 'Human verifies facts before sending', choices: ['Human verifies facts before sending', 'AI approves refund', 'Remove review notes', 'Hide uncertainty'] },
      { id: 'override', left: 'Human changes the AI recommendation', correct: 'Capture override reason for learning', choices: ['Capture override reason for learning', 'Punish the reviewer', 'Delete the draft', 'Block all future AI use'] },
      { id: 'edge', left: 'Ticket includes legal or safety risk', correct: 'Escalate to specialist owner', choices: ['Escalate to specialist owner', 'Let AI decide faster', 'Use a more cheerful tone', 'Ignore until weekly review'] },
      { id: 'training', left: 'Repeated AI errors appear in one topic', correct: 'Update guidance and coaching loop', choices: ['Update guidance and coaching loop', 'Increase confidence score', 'Use fewer sources', 'Automate every case'] },
    ],
    options: [],
  },
  {
    id: 'COMP-D6-CHANGE-012',
    domain: 'D6',
    secondaryDomains: ['D5'],
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'multi',
    competencyIds: ['D6-change', 'D5-value'],
    skillIds: ['adoption support', 'communication', 'coaching loops', 'continuous improvement'],
    evidenceMode: 'doing',
    stimulus: {
      src: '/stimuli/productivity-chart-forensics.png',
      alt: 'Productivity chart with uneven adoption, missing baseline, and department-level differences',
      label: 'Adoption dashboard',
      caption: 'AI usage increased, but quality and confidence vary by team.',
    },
    context: 'An organization claims its AI rollout succeeded because usage doubled.',
    prompt: 'Which follow-up actions would make the change program more credible?',
    correctOptionIds: ['baseline', 'segments', 'coaching', 'quality'],
    options: [
      { id: 'baseline', label: 'Compare usage with baseline productivity and quality measures.', score: 25, feedback: 'Correct. Usage alone is not value.' },
      { id: 'segments', label: 'Segment adoption by role/team to find where support is needed.', score: 25, feedback: 'Correct. Averages hide adoption gaps.' },
      { id: 'coaching', label: 'Create coaching loops from common review/override patterns.', score: 25, feedback: 'Correct. Change requires learning loops.' },
      { id: 'quality', label: 'Track output quality, customer impact, and confidence together.', score: 25, feedback: 'Correct. Responsible adoption balances speed and quality.' },
      { id: 'mandate', label: 'Mandate daily usage because higher usage proves transformation.', score: 0, feedback: 'Mandated usage can increase activity without value or trust.' },
    ],
  },
  {
    id: 'CAL-D1-CONCEPTS-013',
    domain: 'D1',
    difficulty: 'applied',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D1-concepts'],
    skillIds: ['LLM basics', 'RAG and grounding', 'context', 'memory'],
    evidenceMode: 'knowing',
    stimulus: {
      src: '/stimuli/ai-concept-workbench.svg',
      alt: 'AI concept workbench showing model, retrieval, context, memory, and tools',
      label: 'Concept matching sheet',
      caption: 'A product team is deciding which AI concept explains each system behavior.',
    },
    context: 'A team is writing user help text for an AI assistant and needs to avoid misleading claims.',
    prompt: 'Match each behavior to the concept it depends on.',
    matchPairs: [
      { id: 'context', left: 'The answer improves when the user pastes the policy excerpt', correct: 'Context', choices: ['Context', 'Memory', 'RAG', 'Fine-tuning'] },
      { id: 'retrieval', left: 'The app searches a source library before answering', correct: 'RAG', choices: ['RAG', 'Temperature', 'Memory', 'Vision model'] },
      { id: 'memory', left: 'The assistant remembers a saved user preference next week', correct: 'Memory', choices: ['Memory', 'Context', 'Benchmark', 'Embedding only'] },
      { id: 'false', left: 'The assistant invents a citation that looks real', correct: 'Hallucination', choices: ['Hallucination', 'Grounding', 'Calibration', 'Latency'] },
    ],
    options: [],
  },
  {
    id: 'CAL-D1-SYSTEMS-014',
    domain: 'D1',
    secondaryDomains: ['D4'],
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'multi',
    competencyIds: ['D1-systems', 'D4-risk'],
    skillIds: ['tool connectors', 'MCP', 'data flow', 'permission scope'],
    evidenceMode: 'hybrid',
    stimulus: {
      src: '/stimuli/agent-tool-trace.svg',
      alt: 'Agent tool trace showing file read, CRM lookup, email draft, and external web request',
      label: 'MCP/tool-call trace',
      caption: 'The assistant can call tools. The user must inspect what data moved and what actions were allowed.',
    },
    context: 'A product manager reviews an AI assistant trace before approving a tool-enabled workflow.',
    prompt: 'Which system questions matter most before launch?',
    correctOptionIds: ['scope', 'data', 'log', 'fallback'],
    options: [
      { id: 'scope', label: 'Which tools can act, read, write, or send?', score: 25, feedback: 'Correct. Tool authority changes system risk.' },
      { id: 'data', label: 'What data crosses each connector boundary?', score: 25, feedback: 'Correct. Data movement must be visible.' },
      { id: 'log', label: 'Can reviewers inspect prompts, tool calls, outputs, and approvals?', score: 25, feedback: 'Correct. Auditability is required.' },
      { id: 'fallback', label: 'What happens when a tool fails or returns conflicting evidence?', score: 25, feedback: 'Correct. Failure modes are part of system design.' },
      { id: 'tone', label: 'Whether the assistant sounds enthusiastic enough.', score: 0, feedback: 'Tone is secondary to permissions, data flow, and auditability.' },
    ],
  },
  {
    id: 'CAL-D2-PROMPT-015',
    domain: 'D2',
    difficulty: 'proficient',
    type: 'narrative',
    interaction: 'text',
    competencyIds: ['D2-prompting'],
    skillIds: ['prompt repair', 'rubric prompting', 'constraints', 'evaluation'],
    evidenceMode: 'doing',
    stimulus: {
      src: '/stimuli/raw-marketing-campaign-dashboard.svg',
      alt: 'Marketing campaign dashboard with spend, conversion, sample-size, and channel notes',
      label: 'Campaign analysis prompt',
      caption: 'The prompt must prevent the assistant from overclaiming campaign performance.',
    },
    context: 'A marketing lead wants an AI assistant to summarize a campaign dashboard for executives.',
    prompt: 'Write a prompt that asks for useful analysis while preventing unsupported conclusions.',
    rubricCriteria: [
      { id: 'role', label: 'Defines role and audience', keywords: ['act as', 'marketing', 'executive', 'audience'], points: 18 },
      { id: 'evidence', label: 'Requires evidence from the dashboard', keywords: ['dashboard', 'data', 'evidence', 'source', 'metric'], points: 24 },
      { id: 'limits', label: 'Blocks causal overclaims', keywords: ['do not claim', 'causal', 'incremental', 'unsupported', 'correlation'], points: 24 },
      { id: 'format', label: 'Specifies concise output format', keywords: ['format', 'summary', 'risks', 'recommendation', 'bullets'], points: 16 },
      { id: 'review', label: 'Asks for caveats or checks', keywords: ['caveat', 'check', 'sample', 'baseline', 'review'], points: 18 },
    ],
    exemplarAnswer: 'Act as a marketing analyst writing for executives. Use only the campaign dashboard metrics and notes. Summarize what improved, what is uncertain, and what needs follow-up. Do not claim causality or incrementality unless the dashboard shows a controlled test. Output: three findings, two caveats, recommended next test, and data needed before scaling.',
    options: [],
  },
  {
    id: 'CAL-D2-WORKFLOW-016',
    domain: 'D2',
    secondaryDomains: ['D6'],
    difficulty: 'applied',
    type: 'drag-order',
    interaction: 'rank',
    competencyIds: ['D2-workflows', 'D6-collaboration'],
    skillIds: ['workflow mapping', 'handoffs', 'review checkpoints', 'customer service automation'],
    evidenceMode: 'doing',
    functionTracks: ['customerService', 'operations'],
    stimulus: {
      src: '/stimuli/raw-customer-service-escalation.svg',
      alt: 'Customer service escalation queue showing dispute status, SLA timer, AI draft, and notes',
      label: 'Support workflow board',
      caption: 'The team wants AI help without letting the assistant resolve risky cases alone.',
    },
    context: 'A support team is adding AI drafting to its escalation queue.',
    prompt: 'Order the workflow for a safe assisted-response process.',
    rankItems: [
      { id: 'triage', label: 'Classify ticket risk and missing evidence.' },
      { id: 'retrieve', label: 'Pull approved policy and account facts.' },
      { id: 'draft', label: 'Draft reply with evidence and uncertainty notes.' },
      { id: 'approve', label: 'Human reviews refunds, disputes, and legal-risk cases.' },
      { id: 'learn', label: 'Log overrides and update guidance.' },
    ],
    idealOrder: ['triage', 'retrieve', 'draft', 'approve', 'learn'],
    options: [],
  },
  {
    id: 'CAL-D3-VERIFY-017',
    domain: 'D3',
    secondaryDomains: ['D5'],
    difficulty: 'applied',
    type: 'report-review',
    competencyIds: ['D3-verification'],
    skillIds: ['chart forensics', 'baseline', 'sample quality', 'confidence calibration'],
    evidenceMode: 'doing',
    stimulus: {
      src: '/stimuli/productivity-chart-forensics.png',
      alt: 'Productivity chart with missing baseline, uneven teams, and overstated AI impact',
      label: 'Productivity chart',
      caption: 'The chart looks impressive, but the evidence does not yet prove AI caused the result.',
    },
    context: 'A manager says the chart proves the AI rollout increased productivity by 38%.',
    prompt: 'What is the best critique?',
    options: [
      { id: 'a', label: 'The chart needs baseline, comparison group, and quality checks before causal claims.', score: 96, feedback: 'Correct. Chart review needs causality and quality evidence.' },
      { id: 'b', label: 'The claim is true because the chart uses a large number.', score: 10, feedback: 'A large number does not prove causality.' },
      { id: 'c', label: 'The chart is useless because all AI dashboards are biased.', score: 25, feedback: 'Too broad. The right critique is specific evidence quality.' },
      { id: 'd', label: 'The only issue is the chart color choice.', score: 5, feedback: 'Visual polish is not the core evidence problem.' },
    ],
  },
  {
    id: 'CAL-D3-MEDIA-018',
    domain: 'D3',
    difficulty: 'proficient',
    type: 'fraud-detection',
    interaction: 'text',
    competencyIds: ['D3-media'],
    skillIds: ['phishing checks', 'suspicious artifacts', 'provenance', 'risk explanation'],
    evidenceMode: 'doing',
    stimulus: {
      src: '/stimuli/fraud-login.svg',
      alt: 'Suspicious login screen with urgency, lookalike domain, and credential request',
      label: 'Login screen inspection',
      caption: 'The user must explain why the page is suspicious and what to do next.',
    },
    context: 'A coworker lands on this login page after clicking a message about expired access.',
    prompt: 'Write 2-4 sentences explaining the suspicious signals and the safe next action.',
    rubricCriteria: [
      { id: 'domain', label: 'Mentions lookalike or unofficial domain', keywords: ['domain', 'url', 'link', 'lookalike', 'official'], points: 25 },
      { id: 'urgency', label: 'Mentions urgency or pressure tactic', keywords: ['urgent', 'expire', 'pressure', 'deadline', 'warning'], points: 18 },
      { id: 'credential', label: 'Mentions credential or MFA risk', keywords: ['password', 'credential', 'mfa', 'login', 'account'], points: 22 },
      { id: 'action', label: 'Gives safe action', keywords: ['close', 'report', 'official', 'it', 'security'], points: 25 },
      { id: 'evidence', label: 'Avoids overclaiming without inspection', keywords: ['suspicious', 'verify', 'confirm', 'do not enter'], points: 10 },
    ],
    exemplarAnswer: 'I would not enter credentials. The page came from a message, uses urgency, and should be checked against the official company login URL. Close it, report it to IT/security, and navigate to the login page independently.',
    options: [],
  },
  {
    id: 'CAL-D4-RISK-019',
    domain: 'D4',
    difficulty: 'applied',
    type: 'report-review',
    interaction: 'multi',
    competencyIds: ['D4-risk'],
    skillIds: ['data minimization', 'least privilege', 'approval gates', 'audit logs'],
    evidenceMode: 'doing',
    functionTracks: ['finance', 'technical', 'operations'],
    stimulus: {
      src: '/stimuli/func-exp-finance-workbook.svg',
      alt: 'Finance workbook with vendor names, bank details, variance notes, and AI export request',
      label: 'Finance data export',
      caption: 'The AI workflow wants more data than it needs for the task.',
    },
    context: 'A finance analyst wants to upload a workbook with vendor bank details to an AI tool for a variance summary.',
    prompt: 'Which controls should be applied before using AI?',
    correctOptionIds: ['minimize', 'mask', 'approved', 'log'],
    options: [
      { id: 'minimize', label: 'Use only fields needed for the variance task.', score: 25, feedback: 'Correct. Minimize data exposure.' },
      { id: 'mask', label: 'Remove or mask bank details and personal identifiers.', score: 25, feedback: 'Correct. Sensitive data should not be exposed unnecessarily.' },
      { id: 'approved', label: 'Use an approved tool and policy path for financial data.', score: 25, feedback: 'Correct. Tool approval matters.' },
      { id: 'log', label: 'Keep a record of data source, prompt, output, and review.', score: 25, feedback: 'Correct. Audit evidence supports accountability.' },
      { id: 'paste', label: 'Paste everything so the AI has maximum context.', score: 0, feedback: 'More context can create unnecessary privacy and security risk.' },
    ],
  },
  {
    id: 'CAL-D4-GOV-020',
    domain: 'D4',
    secondaryDomains: ['D5'],
    difficulty: 'proficient',
    type: 'drag-order',
    interaction: 'rank',
    competencyIds: ['D4-governance', 'D5-strategy'],
    skillIds: ['vendor controls', 'incident response', 'policy alignment', 'stage gate'],
    evidenceMode: 'doing',
    stimulus: {
      src: '/stimuli/executive/exec-exp-vendor-memo-data-rights.svg',
      alt: 'Vendor memo with data rights, retention, audit, subcontractor, and incident terms',
      label: 'Vendor governance memo',
      caption: 'The buyer must review governance terms before expanding vendor access.',
    },
    context: 'A vendor proposes using company data to improve its AI service.',
    prompt: 'Order the governance review steps.',
    rankItems: [
      { id: 'classify', label: 'Classify data sensitivity and permitted use.' },
      { id: 'contract', label: 'Review data rights, retention, subcontractors, and audit clauses.' },
      { id: 'controls', label: 'Define access controls, monitoring, and incident obligations.' },
      { id: 'pilot', label: 'Run a limited pilot with exit criteria.' },
      { id: 'approve', label: 'Approve expansion only after evidence and signoff.' },
    ],
    idealOrder: ['classify', 'contract', 'controls', 'pilot', 'approve'],
    options: [],
  },
  {
    id: 'CAL-D5-VALUE-021',
    domain: 'D5',
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'multi',
    competencyIds: ['D5-value'],
    skillIds: ['ROI evidence', 'baseline metrics', 'benefit realization', 'stop criteria'],
    evidenceMode: 'doing',
    stimulus: {
      src: '/stimuli/raw-sales-crm-pipeline.svg',
      alt: 'Sales CRM pipeline with stale deals, risk flags, AI forecast, and missing customer activity',
      label: 'Sales AI forecast',
      caption: 'The AI forecast may overstate value because the pipeline evidence is weak.',
    },
    context: 'Sales wants to fund an AI forecasting assistant because it predicts a larger quarter.',
    prompt: 'Which evidence should be required before scaling?',
    correctOptionIds: ['baseline', 'accuracy', 'segment', 'action'],
    options: [
      { id: 'baseline', label: 'Forecast accuracy before and after AI on comparable periods.', score: 25, feedback: 'Correct. Improvement needs a baseline.' },
      { id: 'accuracy', label: 'Error rates by deal stage, stale activity, and risk flags.', score: 25, feedback: 'Correct. Accuracy must be segmented.' },
      { id: 'segment', label: 'Evidence by team, market, and deal type.', score: 25, feedback: 'Correct. Averages can hide failure modes.' },
      { id: 'action', label: 'Whether recommendations change seller behavior and outcomes.', score: 25, feedback: 'Correct. Value depends on decisions, not predictions alone.' },
      { id: 'confidence', label: 'The model confidence number by itself.', score: 0, feedback: 'Confidence alone is not business evidence.' },
    ],
  },
  {
    id: 'CAL-D5-STRATEGY-022',
    domain: 'D5',
    difficulty: 'applied',
    type: 'matching',
    interaction: 'match',
    competencyIds: ['D5-strategy'],
    skillIds: ['portfolio decisions', 'build buy partner', 'trend judgment', 'scale criteria'],
    evidenceMode: 'hybrid',
    stimulus: {
      src: '/stimuli/executive/exec-exp-board-packet-scale-readiness.svg',
      alt: 'Board packet comparing AI portfolio initiatives by readiness, value, risk, and data quality',
      label: 'AI portfolio board packet',
      caption: 'Different AI opportunities need different strategic responses.',
    },
    context: 'A leadership team is reviewing four AI opportunities.',
    prompt: 'Match each portfolio signal to the best strategic move.',
    matchPairs: [
      { id: 'commodity', left: 'Common workflow, mature vendors, low differentiation', correct: 'Buy or configure', choices: ['Buy or configure', 'Build core IP', 'Pause for policy', 'Launch companywide'] },
      { id: 'core', left: 'Unique customer data and strategic differentiation', correct: 'Build or co-develop with controls', choices: ['Build or co-develop with controls', 'Ignore governance', 'Buy cheapest tool', 'Avoid AI entirely'] },
      { id: 'risk', left: 'High impact, unclear data rights, weak auditability', correct: 'Pause until controls are resolved', choices: ['Pause until controls are resolved', 'Scale immediately', 'Hide risk in pilot notes', 'Use only a better prompt'] },
      { id: 'ready', left: 'Clear baseline, low risk, strong owner, measurable gain', correct: 'Pilot with scale gate', choices: ['Pilot with scale gate', 'Wait for perfect certainty', 'Skip measurement', 'Treat as research only'] },
    ],
    options: [],
  },
  {
    id: 'CAL-D6-COLLAB-023',
    domain: 'D6',
    difficulty: 'proficient',
    type: 'narrative',
    interaction: 'text',
    competencyIds: ['D6-collaboration'],
    skillIds: ['challenge culture', 'review routines', 'role clarity', 'human ownership'],
    evidenceMode: 'doing',
    stimulus: {
      src: '/stimuli/raw-hr-candidate-packet.svg',
      alt: 'Hiring packet with AI screening summary, interviewer notes, missing evidence, and fairness flags',
      label: 'AI hiring review',
      caption: 'The team must decide how to use AI without hiding human accountability.',
    },
    context: 'A hiring team receives an AI shortlist that conflicts with interviewer notes and has missing evidence.',
    prompt: 'Write the collaboration rule you would give the team before using the AI shortlist.',
    rubricCriteria: [
      { id: 'assist', label: 'Defines AI as assistance not final authority', keywords: ['assist', 'support', 'not final', 'recommendation'], points: 22 },
      { id: 'evidence', label: 'Requires evidence review', keywords: ['evidence', 'notes', 'criteria', 'verify', 'rubric'], points: 24 },
      { id: 'fairness', label: 'Mentions fairness or bias check', keywords: ['fair', 'bias', 'consistent', 'criteria'], points: 20 },
      { id: 'owner', label: 'Names human decision ownership', keywords: ['human', 'owner', 'decision', 'accountable'], points: 22 },
      { id: 'challenge', label: 'Allows challenge or override', keywords: ['challenge', 'override', 'appeal', 'review'], points: 12 },
    ],
    exemplarAnswer: 'Use the AI shortlist only as an input. Review candidates against the same hiring rubric, compare the AI summary with interviewer notes and evidence, check for missing or biased criteria, and keep the hiring decision human-owned. Any conflict, missing evidence, or fairness concern should be challenged and documented before action.',
    options: [],
  },
  {
    id: 'CAL-D6-CHANGE-024',
    domain: 'D6',
    secondaryDomains: ['D5'],
    difficulty: 'applied',
    type: 'report-review',
    competencyIds: ['D6-change'],
    skillIds: ['communication', 'adoption support', 'learning loops', 'manager enablement'],
    evidenceMode: 'doing',
    stimulus: {
      src: '/stimuli/raw-agent-workflow-plan.svg',
      alt: 'AI rollout plan with training dates, manager actions, support channel, and feedback loops',
      label: 'AI rollout plan',
      caption: 'The rollout needs behavior change support, not just tool access.',
    },
    context: 'A company launches an AI assistant, but several teams are confused about when and how to use it.',
    prompt: 'Which action best supports adoption?',
    options: [
      { id: 'a', label: 'Give managers example workflows, review routines, and a feedback channel.', score: 95, feedback: 'Correct. Adoption needs practical support and learning loops.' },
      { id: 'b', label: 'Send one announcement saying the tool is now available.', score: 25, feedback: 'Awareness alone rarely changes behavior.' },
      { id: 'c', label: 'Measure only login count and call it transformation.', score: 10, feedback: 'Usage alone does not prove capability or value.' },
      { id: 'd', label: 'Tell teams to experiment without any guidance or guardrails.', score: 20, feedback: 'Experimentation still needs safety, support, and shared learning.' },
    ],
  },
  {
    id: 'D1-A-001',
    domain: 'D1',
    difficulty: 'awareness',
    type: 'report-review',
    visualStimulus: {
      kind: 'memo',
      eyebrow: 'Chat answer',
      title: 'Recipe Bot Reply',
      caption: 'The answer sounds confident, but the source support is still unclear.',
      points: ['Claim: safe for peanut allergy', 'Citations: two broken links', 'Tone: very confident', 'Use case: family dinner tonight'],
      metrics: [
        { label: 'Health risk', value: 'High', status: 'bad' },
        { label: 'Sources', value: 'Broken', status: 'bad' },
        { label: 'Confidence', value: 'High', status: 'warn' },
      ],
      flags: ['Allergy claim', 'Broken links', 'Urgent dinner decision'],
    },
    context: 'A friend wants to use this AI answer for an allergy-sensitive dinner.',
    prompt: 'What should they do first?',
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
    type: 'report-review',
    visualStimulus: {
      kind: 'report',
      eyebrow: 'Work policy question',
      title: 'Leave Policy Chatbot',
      caption: 'The answer needs current approved policy, not memory or vibes.',
      points: ['Employee asks: Can I carry leave?', 'Policy updated: last Friday', 'Bot answer: no source shown', 'Risk: wrong HR advice'],
      metrics: [
        { label: 'Policy age', value: '4 days', status: 'warn' },
        { label: 'Source shown', value: 'No', status: 'bad' },
        { label: 'Best setup', value: 'RAG', status: 'good' },
      ],
      flags: ['Recent policy update', 'No citation shown'],
    },
    context: 'Your team wants AI to answer questions about the latest HR policy.',
    prompt: 'What setup is safest?',
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
    type: 'report-review',
    visualStimulus: {
      kind: 'report',
      eyebrow: 'Source check',
      title: 'Refund Policy Answer',
      caption: 'The AI answered confidently, but the uploaded source does not contain that policy.',
      points: ['Uploaded files: return form only', 'AI answer: 30-day refund policy', 'Citation: none', 'User asks: can I trust it?'],
      metrics: [
        { label: 'Uploaded evidence', value: 'Thin', status: 'bad' },
        { label: 'Citation', value: 'None', status: 'bad' },
        { label: 'Claim specificity', value: 'High', status: 'warn' },
      ],
      flags: ['Claim not in file', 'Plausible hallucination'],
    },
    context: 'An AI assistant gives a refund policy that is not in the uploaded documents.',
    prompt: 'What most likely happened?',
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
    visualStimulus: {
      kind: 'memo',
      eyebrow: 'Rough notes',
      title: 'Customer Reply Draft',
      caption: 'A useful prompt gives the AI the job, tone, facts, and limits.',
      points: ['Customer: asks about late delivery', 'Tone: warm and honest', 'Limit: do not promise refund', 'Need: one clear next step'],
    },
    context: 'You want AI to turn these notes into a customer email.',
    prompt: 'Which prompt is best?',
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
    type: 'report-review',
    visualStimulus: {
      kind: 'dashboard',
      eyebrow: 'AI workflow',
      title: 'Call Notes to CRM',
      caption: 'Automation is useful, but customer-facing actions need a checkpoint.',
      points: ['Summarize call', 'Create CRM task', 'Draft customer email', 'Update contract field'],
    },
    stimulus: {
      src: '/stimuli/ai-pilot-workflow.svg',
      alt: 'Workflow map showing AI drafting, unclear approval, customer reply, and a missing review loop.',
      label: 'Workflow map artifact',
      caption: 'Inspect where AI enters the process and where review should happen before action.',
    },
    context: 'An AI workflow turns sales calls into CRM updates and customer follow-ups.',
    prompt: 'Where is review needed first?',
    options: [
      { id: 'a', label: 'Before customer messages or CRM commitments go live.', score: 95, feedback: 'Correct. Higher-impact outputs need review before action.' },
      { id: 'b', label: 'After customers report errors in the follow-up.', score: 10, feedback: 'Too late. Controls should prevent avoidable mistakes.' },
      { id: 'c', label: 'Only during the first week of the automation.', score: 35, feedback: 'Launch review helps, but ongoing risky actions still need gates.' },
      { id: 'd', label: 'When the AI marks its own answer uncertain.', score: 55, feedback: 'Useful signal, but uncertainty is not the only risk trigger.' },
    ],
  },
  {
    id: 'D2-H-003',
    domain: 'D2',
    difficulty: 'proficient',
    type: 'scenario',
    visualStimulus: {
      kind: 'report',
      eyebrow: 'Monthly routine',
      title: 'Board Summary Template',
      caption: 'Repeatable work needs a reusable pattern, not a fresh guess each month.',
      points: ['Inputs: project notes', 'Output: 1-page summary', 'Audience: board', 'Must include: sources and risks'],
    },
    context: 'You need the same quality board summary every month.',
    prompt: 'Which design works best?',
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
      src: '/stimuli/flood-forwarded-chat.png',
      alt: 'Forwarded chat screenshot showing a neighborhood flood photo and a vague today claim.',
      label: 'Forwarded flood claim',
      caption: 'Inspect the forwarding context before deciding whether the post is safe to share.',
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
    context: 'An executive-looking image and caption claim a company CEO endorsed a policy yesterday.',
    stimulus: {
      src: '/stimuli/executive-synthetic-post.svg',
      alt: 'Executive impersonation post with synthetic image cues, urgent timing, and missing original source.',
      label: 'Executive endorsement post',
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
    id: 'D3-A-007',
    domain: 'D3',
    difficulty: 'awareness',
    type: 'media',
    interaction: 'single',
    context: 'A marketplace listing offers an expensive device at a tiny price and asks buyers to pay outside the platform.',
    stimulus: {
      src: '/stimuli/fake-product-listing.svg',
      alt: 'Suspicious product listing with warped product image, unrealistic price, new seller, copied reviews, and outside-platform payment request.',
      label: 'Suspicious listing artifact',
      caption: 'Inspect the product image, price, seller age, review pattern, and payment instruction.',
    },
    prompt: 'Which signal is the strongest reason to stop before buying?',
    options: [
      { id: 'a', label: 'The listing asks for payment outside the trusted platform.', score: 98, feedback: 'Correct. Outside-platform payment is a major fraud and protection-loss signal.' },
      { id: 'b', label: 'The seller profile is new and reviews repeat phrases.', score: 65, feedback: 'This is suspicious, but the payment request creates the biggest immediate risk.' },
      { id: 'c', label: 'The product photo has warped branding and odd shadows.', score: 58, feedback: 'A useful clue, but payment outside the platform is more decisive.' },
      { id: 'd', label: 'The discount is unusually large for a premium device.', score: 55, feedback: 'A big discount is a warning sign, but it is not the strongest stop signal here.' },
    ],
  },
  {
    id: 'D3-H-003',
    domain: 'D3',
    difficulty: 'proficient',
    type: 'report-review',
    visualStimulus: {
      kind: 'report',
      eyebrow: 'Citation check',
      title: 'Productivity Claim',
      caption: 'The citation exists, but it does not prove the exact claim.',
      points: ['AI claim: productivity rose 37%', 'Study A: no percentage', 'Study B: different industry', 'Decision: use in report?'],
      metrics: [
        { label: 'Claim', value: '+37%', status: 'warn' },
        { label: 'Source match', value: 'Weak', status: 'bad' },
        { label: 'Decision-ready', value: 'No', status: 'bad' },
      ],
      chartBars: [
        { label: 'Claim strength', value: 82, note: 'Sounds high' },
        { label: 'Citation support', value: 26, note: 'Mismatch' },
      ],
      flags: ['Exact number unsupported', 'Different industry evidence'],
    },
    context: 'An AI report cites studies that do not support its exact number.',
    prompt: 'What is the problem?',
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
    type: 'report-review',
    visualStimulus: {
      kind: 'memo',
      eyebrow: 'Chat paste',
      title: 'Candidate CVs',
      caption: 'Useful AI drafting can still mishandle private data.',
      points: ['Names and phone numbers', 'Salary history', 'Public chatbot', 'No approval notice'],
      metrics: [
        { label: 'PII', value: 'Visible', status: 'bad' },
        { label: 'Consent', value: 'Unknown', status: 'bad' },
        { label: 'Tool', value: 'Public', status: 'warn' },
      ],
      flags: ['Phone numbers', 'Salary history', 'No approved workflow'],
    },
    context: 'A recruiter pastes candidate CVs into a public chatbot to summarize them.',
    prompt: 'What is the biggest issue?',
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
    type: 'report-review',
    visualStimulus: {
      kind: 'risk',
      eyebrow: 'Hiring workflow',
      title: 'AI Applicant Ranker',
      caption: 'High-impact decisions need more than a model score.',
      points: ['Ranks applicants 1-100', 'Uses CV text', 'No appeal route', 'Manager wants to launch Monday'],
    },
    context: 'A department wants AI to rank job applicants.',
    prompt: 'What must happen before launch?',
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
    type: 'report-review',
    visualStimulus: {
      kind: 'risk',
      eyebrow: 'Agent access',
      title: 'Customer Ops Agent',
      caption: 'The more actions an agent can take, the clearer its limits must be.',
      points: ['Reads shared drive', 'Sends customer emails', 'Updates records', 'Can run without review'],
    },
    context: 'An internal AI agent can read files, send emails, and update customer records.',
    prompt: 'What control is mandatory?',
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
    type: 'report-review',
    visualStimulus: {
      kind: 'portfolio',
      eyebrow: 'Team idea board',
      title: 'Should We Use AI Here?',
      caption: 'The useful starting point is the problem, not the trend.',
      points: ['Competitor launched AI', 'Our queue is slow', 'No success metric yet', 'No pilot owner yet'],
    },
    context: 'A manager says, "We need AI because competitors are using it."',
    prompt: 'What should you ask next?',
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
    visualStimulus: {
      kind: 'memo',
      eyebrow: 'Team chat',
      title: 'AI Rollout Worry',
      caption: 'Adoption improves when people know the rules, review points, and support path.',
      points: ['Will AI replace parts of my job?', 'Who checks mistakes?', 'Can we ask questions?', 'What training do we get?'],
      metrics: [
        { label: 'Trust', value: 'Fragile', status: 'warn' },
        { label: 'Training', value: 'Needed', status: 'warn' },
        { label: 'Review points', value: 'Missing', status: 'bad' },
      ],
      flags: ['Answer with process', 'Name human review', 'Invite questions'],
    },
    context: 'A team is worried about a new AI tool at work.',
    prompt: 'What response builds trust?',
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
    type: 'report-review',
    visualStimulus: {
      kind: 'dashboard',
      eyebrow: 'Support team health',
      title: 'AI Drafting Rollout',
      caption: 'Efficiency improved, but human learning is weakening.',
      points: ['Error rate: down', 'Edge-case skill: down', 'Review rituals: missing', 'New hires: copy AI answers'],
      metrics: [
        { label: 'Error rate', value: 'Down', status: 'good' },
        { label: 'Edge skill', value: 'Down', status: 'bad' },
        { label: 'Review ritual', value: 'Missing', status: 'bad' },
      ],
      chartBars: [
        { label: 'Speed', value: 78, note: 'Improved' },
        { label: 'Human skill', value: 34, note: 'Declining' },
        { label: 'Quality review', value: 42, note: 'Inconsistent' },
      ],
      flags: ['Efficiency hides skill decay', 'Add coaching loop'],
    },
    context: 'AI drafts support replies, but people are learning fewer edge cases.',
    prompt: 'What redesign works best?',
    options: [
      { id: 'a', label: 'Keep automation, add review rituals, edge-case coaching, and learning loops.', score: 98, feedback: 'Correct. This preserves value while strengthening human capability.' },
      { id: 'b', label: 'Remove all AI permanently.', score: 35, feedback: 'That may lose benefits without solving learning design.' },
      { id: 'c', label: 'Let AI send every answer automatically.', score: 20, feedback: 'This worsens skill decay and risk.' },
      { id: 'd', label: 'Ignore the learning issue if metrics improved.', score: 25, feedback: 'Short-term metrics can hide long-term capability loss.' },
    ],
  },
  {
    id: 'D1-P-004',
    domain: 'D1',
    difficulty: 'awareness',
    type: 'matching',
    interaction: 'match',
    visualStimulus: {
      kind: 'memo',
      eyebrow: 'Daily task list',
      title: 'AI, Human, or Both?',
      caption: 'Average users need this split for everyday work: draft, decide, check.',
      points: ['Brainstorm a message', 'Approve a refund', 'Rewrite tone', 'Check the final meaning'],
    },
    context: 'Your teammate wants to know what AI can safely help with.',
    prompt: 'Match each task to the owner.',
    matchPairs: [
      { id: 'brainstorm', left: 'Generate first-draft ideas', correct: 'AI can help; human sets direction', choices: ['AI can help; human sets direction', 'AI owns the final decision', 'No AI use is possible'] },
      { id: 'approve', left: 'Approve a sensitive customer refund', correct: 'Human owns the decision', choices: ['Human owns the decision', 'AI decides automatically', 'No review is needed'] },
      { id: 'rewrite', left: 'Rewrite a note for tone', correct: 'AI can draft; human checks meaning', choices: ['AI can draft; human checks meaning', 'AI changes facts freely', 'Human must type every word'] },
    ],
    options: [
      { id: 'match', label: 'Match task ownership.', score: 98, feedback: 'Good AI literacy includes knowing what to delegate and what to own.' },
    ],
  },
  {
    id: 'D2-P-004',
    domain: 'D2',
    difficulty: 'applied',
    type: 'drag-order',
    interaction: 'rank',
    visualStimulus: {
      kind: 'memo',
      eyebrow: 'Meeting transcript',
      title: 'Messy Notes to Action List',
      caption: 'Good AI use is a workflow: give context, set format, verify, then share.',
      points: ['12-page transcript', 'Manager wants actions', 'Names and dates matter', 'Send by 4 PM'],
    },
    context: 'You need AI to summarize a meeting for your manager.',
    prompt: 'Put the steps in order.',
    rankItems: [
      { id: 'source', label: 'Provide the transcript and meeting purpose' },
      { id: 'format', label: 'Specify the output format and decision audience' },
      { id: 'verify', label: 'Check names, owners, dates, and commitments' },
      { id: 'send', label: 'Share the final summary with caveats if needed' },
    ],
    idealOrder: ['source', 'format', 'verify', 'send'],
    options: [
      { id: 'rank', label: 'Order the summary workflow.', score: 98, feedback: 'Reliable AI work comes from clear inputs, constraints, and review.' },
    ],
  },
  {
    id: 'D2-P-005',
    domain: 'D2',
    difficulty: 'awareness',
    type: 'multi-select',
    interaction: 'multi',
    visualStimulus: {
      kind: 'memo',
      eyebrow: 'Prompt repair',
      title: 'Help With My Presentation',
      caption: 'The first prompt is too vague. Pick the missing details.',
      points: ['Audience: not stated', 'Length: not stated', 'Sources: not attached', 'Goal: unclear'],
    },
    context: 'A student gets a weak AI answer from a vague prompt.',
    prompt: 'What details should they add?',
    correctOptionIds: ['a', 'b', 'c'],
    options: [
      { id: 'a', label: 'Audience and purpose of the presentation.', score: 33, feedback: 'Audience changes content and tone.' },
      { id: 'b', label: 'Length, format, and deadline.', score: 33, feedback: 'Constraints make the output usable.' },
      { id: 'c', label: 'Source notes or facts that must be included.', score: 33, feedback: 'Grounding reduces generic answers.' },
      { id: 'd', label: 'A request to be impressive with no other detail.', score: 0, feedback: 'Impressive is not a clear success criterion.' },
    ],
  },
  {
    id: 'D3-P-004',
    domain: 'D3',
    difficulty: 'applied',
    type: 'report-review',
    interaction: 'multi',
    context: 'An AI summary of a school policy says phones are banned all day, but the quoted source says phones may be used with teacher permission.',
    stimulus: {
      src: '/stimuli/raw-policy-excerpt.svg',
      alt: 'Raw school phone policy excerpt with a teacher-permission exception that conflicts with the AI summary.',
      label: 'Raw policy excerpt',
      caption: 'Inspect the source policy, not just the AI summary, before choosing what to flag.',
    },
    visualStimulus: {
      kind: 'report',
      eyebrow: 'Policy summary check',
      title: 'AI Summary vs Source Note',
      caption: 'The source does not fully support the AI summary.',
      points: ['AI claim: phones banned all day', 'Source: teacher permission allowed', 'Missing: exception conditions', 'Risk: over-enforcement'],
    },
    prompt: 'Select the issues you should flag before using the summary.',
    correctOptionIds: ['a', 'b', 'c'],
    options: [
      { id: 'a', label: 'The summary overstates the rule.', score: 33, feedback: 'Correct. The exception matters.' },
      { id: 'b', label: 'The source should be checked before action.', score: 33, feedback: 'Correct. Policy use needs source support.' },
      { id: 'c', label: 'The output needs a caveat about teacher permission.', score: 33, feedback: 'Correct. The summary must preserve the condition.' },
      { id: 'd', label: 'The summary is fine because it is shorter.', score: 0, feedback: 'Shorter is not better if meaning changes.' },
    ],
  },
  {
    id: 'D3-P-005',
    domain: 'D3',
    difficulty: 'awareness',
    type: 'media',
    interaction: 'single',
    context: 'A realistic image of a celebrity endorsing a product appears in a group chat with no source link.',
    stimulus: {
      src: '/stimuli/fake-product-listing.svg',
      alt: 'Suspicious product listing with generated-looking product image, unverifiable endorsement, and weak seller signals.',
      label: 'Celebrity endorsement listing',
      caption: 'The practical skill is not guessing. It is deciding what evidence is needed before sharing or trusting the claim.',
    },
    prompt: 'What is the best next action?',
    options: [
      { id: 'a', label: 'Share it because the image looks realistic.', score: 10, feedback: 'Realistic appearance is not enough.' },
      { id: 'b', label: 'Look for the original post, trusted reporting, date, and manipulation clues.', score: 95, feedback: 'Correct. Provenance and context come first.' },
      { id: 'c', label: 'Assume it is fake without checking.', score: 45, feedback: 'Skepticism helps, but the best response is evidence-based verification.' },
      { id: 'd', label: 'Ask the AI to make the claim sound more certain.', score: 5, feedback: 'Confidence wording does not prove authenticity.' },
    ],
  },
  {
    id: 'D4-P-004',
    domain: 'D4',
    difficulty: 'applied',
    type: 'multi-select',
    interaction: 'multi',
    visualStimulus: {
      kind: 'risk',
      eyebrow: 'Agent permissions',
      title: 'Files + Messages + Spreadsheet',
      caption: 'When AI can take actions, permission design matters.',
      points: ['Read shared folder', 'Send Slack messages', 'Edit customer sheet', 'Run every morning'],
    },
    stimulus: {
      src: '/stimuli/agent-tool-trace.svg',
      alt: 'Agent trace showing file reads, drafted messages, record updates, finance approval, and missing control gates.',
      label: 'Agent tool trace',
      caption: 'Inspect the agent actions and decide which permissions, logs, approvals, and stop conditions are required.',
    },
    context: 'A team wants an AI agent to work across everyday apps.',
    prompt: 'What controls are needed?',
    correctOptionIds: ['a', 'b', 'c', 'd'],
    options: [
      { id: 'a', label: 'Limit file and tool permissions to the task.', score: 25, feedback: 'Least privilege reduces damage.' },
      { id: 'b', label: 'Require approval before sending external messages.', score: 25, feedback: 'Outbound actions need review.' },
      { id: 'c', label: 'Keep audit logs of actions and source files.', score: 25, feedback: 'Traceability matters.' },
      { id: 'd', label: 'Define a stop condition for unusual behavior.', score: 25, feedback: 'Agents need operational boundaries.' },
      { id: 'e', label: 'Give it full access so it can be helpful.', score: 0, feedback: 'Full access creates unnecessary risk.' },
    ],
  },
  {
    id: 'D5-P-003',
    domain: 'D5',
    difficulty: 'applied',
    type: 'drag-order',
    interaction: 'rank',
    visualStimulus: {
      kind: 'portfolio',
      eyebrow: 'Pilot shortlist',
      title: 'Pick One AI Idea',
      caption: 'The best first pilot should be useful, measurable, and safe enough to learn from.',
      points: ['Email triage', 'Report summary', 'Customer chatbot', 'Inventory forecast'],
    },
    context: 'Your team has four AI ideas but time for one pilot.',
    prompt: 'Order the decision criteria.',
    rankItems: [
      { id: 'problem', label: 'Clear user problem and workflow fit' },
      { id: 'measure', label: 'Measurable outcome and baseline' },
      { id: 'risk', label: 'Acceptable risk and review controls' },
      { id: 'learn', label: 'Fast learning path for scale or stop decision' },
    ],
    idealOrder: ['problem', 'measure', 'risk', 'learn'],
    options: [
      { id: 'rank', label: 'Order pilot selection criteria.', score: 98, feedback: 'Good pilots start with problem fit and measurable evidence.' },
    ],
  },
  {
    id: 'D6-P-003',
    domain: 'D6',
    difficulty: 'awareness',
    type: 'scenario',
    interaction: 'single',
    visualStimulus: {
      kind: 'memo',
      eyebrow: 'Team norm',
      title: 'Hidden AI Use',
      caption: 'The goal is safe disclosure and shared learning, not fear.',
      points: ['People use AI quietly', 'Manager considers a ban', 'No examples of safe use', 'No review points'],
    },
    context: 'A teammate uses AI in secret because the rules are unclear.',
    prompt: 'What response helps most?',
    options: [
      { id: 'a', label: 'Ban all AI use immediately.', score: 20, feedback: 'A ban may drive use further underground.' },
      { id: 'b', label: 'Create safe-use guidelines, examples, disclosure norms, and review points.', score: 95, feedback: 'Correct. Practical rules make learning and accountability possible.' },
      { id: 'c', label: 'Ignore the behavior if work is faster.', score: 20, feedback: 'Speed without transparency creates risk.' },
      { id: 'd', label: 'Let everyone choose any tool with no guidance.', score: 15, feedback: 'Unguided use does not build shared capability.' },
    ],
  },
  {
    id: 'D1-N-005',
    domain: 'D1',
    difficulty: 'applied',
    type: 'narrative',
    interaction: 'single',
    context: 'Mina uses an AI assistant to explain a legal clause. The answer is confident, but it does not quote the clause and may be mixing public legal concepts with her company policy.',
    prompt: 'Which reflection best shows AI fluency?',
    options: [
      { id: 'a', label: 'The answer is probably correct because it used legal vocabulary.', score: 20, feedback: 'Specialized language can sound convincing without being grounded.' },
      { id: 'b', label: 'The answer may be useful as a first explanation, but Mina should compare it to the actual clause and approved policy.', score: 98, feedback: 'Correct. This separates useful assistance from authority.' },
      { id: 'c', label: 'AI should never be used to understand documents.', score: 35, feedback: 'Too broad. The key is controlled use and verification.' },
      { id: 'd', label: 'The company policy is less important than the model answer.', score: 10, feedback: 'Internal policy and source text remain authoritative.' },
    ],
  },
  {
    id: 'D3-N-006',
    domain: 'D3',
    difficulty: 'proficient',
    type: 'narrative',
    interaction: 'single',
    context: 'An AI assistant summarizes customer interviews and says "users love the new checkout." The raw notes show five positive comments, nine complaints about payment failures, and no sample description.',
    stimulus: {
      src: '/stimuli/raw-customer-notes.svg',
      alt: 'Raw customer interview notes table showing five positive comments, nine payment complaints, and missing sample information.',
      label: 'Raw interview notes',
      caption: 'Inspect the raw notes and compare them with the AI summary.',
    },
    visualStimulus: {
      kind: 'memo',
      eyebrow: 'Interview synthesis',
      title: 'Checkout Feedback Summary',
      caption: 'The story sounds clean, but the source notes are mixed and underspecified.',
      points: ['Positive comments: 5', 'Payment complaints: 9', 'Sample frame: missing', 'AI summary: users love it'],
      metrics: [
        { label: 'Positive', value: '5', status: 'good' },
        { label: 'Complaints', value: '9', status: 'bad' },
        { label: 'Sample', value: 'Missing', status: 'warn' },
      ],
      chartBars: [
        { label: 'Praise', value: 36, note: '5 notes' },
        { label: 'Payment failures', value: 64, note: '9 notes' },
      ],
      flags: ['Summary hides complaints', 'Sample frame missing'],
    },
    prompt: 'What is the strongest critique?',
    options: [
      { id: 'a', label: 'It overstates praise and hides the payment complaints.', score: 98, feedback: 'Correct. Good judgment preserves uncertainty and conflicting signals.' },
      { id: 'b', label: 'It should mention praise but mark the evidence mixed.', score: 70, feedback: 'This is directionally better, but it still needs to call out the contradiction clearly.' },
      { id: 'c', label: 'It should remove complaints to keep the story simple.', score: 5, feedback: 'That would distort the evidence.' },
      { id: 'd', label: 'It can ignore sample details because the pattern is clear.', score: 20, feedback: 'Sample context affects how much confidence to place in the finding.' },
    ],
  },
  {
    id: 'D4-N-005',
    domain: 'D4',
    difficulty: 'applied',
    type: 'narrative',
    interaction: 'single',
    context: 'A school team wants to use an AI detector to accuse students of cheating. The detector gives a percentage score but no transparent evidence, appeal route, or error-rate discussion.',
    prompt: 'Which policy response is most responsible?',
    options: [
      { id: 'a', label: 'Treat any high score as proof of cheating.', score: 5, feedback: 'Detector scores are not proof and can create serious harm.' },
      { id: 'b', label: 'Use the score only as one signal, require human review, disclose limits, and provide an appeal process.', score: 98, feedback: 'Correct. High-impact decisions need due process and human judgment.' },
      { id: 'c', label: 'Hide the detector from students and parents.', score: 10, feedback: 'Opacity weakens trust and accountability.' },
      { id: 'd', label: 'Ignore all academic integrity issues.', score: 25, feedback: 'The concern is real, but the control must be proportionate.' },
    ],
  },
  {
    id: 'D6-N-004',
    domain: 'D6',
    difficulty: 'proficient',
    type: 'narrative',
    interaction: 'single',
    context: 'A team adopts AI meeting notes. People stop attending carefully because "the AI will capture it," and decisions become harder to challenge later.',
    prompt: 'What redesign best protects collaboration quality?',
    options: [
      { id: 'a', label: 'Keep AI notes, but add decision owners, review moments, dissent capture, and human sign-off.', score: 98, feedback: 'Correct. AI can support collaboration without replacing shared attention.' },
      { id: 'b', label: 'Let the AI decide what mattered in the meeting.', score: 15, feedback: 'Decision salience remains a human responsibility.' },
      { id: 'c', label: 'Stop documenting meetings entirely.', score: 20, feedback: 'That loses useful traceability.' },
      { id: 'd', label: 'Only invite people who agree with the AI summary.', score: 5, feedback: 'That damages psychological safety and decision quality.' },
    ],
  },
  {
    id: 'D3-F-007',
    domain: 'D3',
    difficulty: 'applied',
    type: 'fraud-detection',
    interaction: 'text',
    context: 'A finance assistant receives this invoice image and asks whether it is safe to approve today.',
    stimulus: {
      src: '/stimuli/fraud-invoice.svg',
      alt: 'A suspicious invoice with urgent payment language, changed bank details, inconsistent domain, and missing purchase order.',
      label: 'Fraud detection image',
      caption: 'Inspect the visual evidence and describe the strongest fraud signals before deciding what to do.',
    },
    prompt: 'Write 2-4 sentences naming the red flags and the safest next action.',
    rubricCriteria: [
      { id: 'urgent', label: 'Names urgency or pressure as a fraud signal', keywords: ['urgent', 'pressure', 'today', 'immediate', 'rush'], points: 22 },
      { id: 'bank', label: 'Flags changed bank/payment details', keywords: ['bank', 'payment', 'account', 'iban', 'wire'], points: 26 },
      { id: 'domain', label: 'Checks sender domain or vendor identity', keywords: ['domain', 'sender', 'email', 'vendor', 'identity'], points: 22 },
      { id: 'verify', label: 'Recommends out-of-band verification before payment', keywords: ['verify', 'confirm', 'call', 'approved', 'purchase order', 'po'], points: 28 },
    ],
    exemplarAnswer: 'This should not be approved yet. The invoice uses urgent pressure, shows changed bank details, lacks a purchase order, and the sender domain does not match the vendor. Verify through an approved vendor contact or procurement system before any payment.',
    options: [],
  },
  {
    id: 'D4-F-006',
    domain: 'D4',
    difficulty: 'awareness',
    type: 'fraud-detection',
    interaction: 'single',
    context: 'An employee receives a login warning that appears to come from IT and asks them to re-authenticate.',
    stimulus: {
      src: '/stimuli/fraud-login.svg',
      alt: 'A suspicious login prompt with a lookalike domain, countdown timer, and request for password and one-time code.',
      label: 'Phishing screen check',
      caption: 'The image contains common fraud signals: lookalike URL, urgency, and credential capture.',
    },
    prompt: 'What is the safest response?',
    options: [
      { id: 'a', label: 'Enter the password and one-time code before the timer ends.', score: 5, feedback: 'Urgency and code capture are strong phishing signals.' },
      { id: 'b', label: 'Close it, report it, and navigate to the official IT page independently.', score: 98, feedback: 'Correct. Do not authenticate through suspicious links.' },
      { id: 'c', label: 'Forward it to coworkers so they can check too.', score: 15, feedback: 'Forwarding can spread the phishing attempt.' },
      { id: 'd', label: 'Trust it because it uses the company logo.', score: 10, feedback: 'Logos are easy to copy.' },
    ],
  },
  {
    id: 'D2-T-006',
    domain: 'D2',
    difficulty: 'applied',
    type: 'narrative',
    interaction: 'text',
    context: 'You want an AI assistant to compare three suppliers for a school technology purchase. The first prompt was: "Which supplier is best?"',
    prompt: 'Rewrite the prompt so the AI produces a useful, checkable comparison.',
    rubricCriteria: [
      { id: 'sources', label: 'Specifies source documents or evidence to use', keywords: ['source', 'document', 'quote', 'proposal', 'evidence'], points: 24 },
      { id: 'criteria', label: 'Defines comparison criteria', keywords: ['criteria', 'cost', 'risk', 'support', 'privacy', 'implementation'], points: 28 },
      { id: 'format', label: 'Requests a structured output format', keywords: ['table', 'matrix', 'summary', 'compare', 'columns'], points: 22 },
      { id: 'limits', label: 'Asks for assumptions, gaps, or human review flags', keywords: ['assumption', 'gap', 'verify', 'unknown', 'review'], points: 24 },
    ],
    exemplarAnswer: 'Compare the three supplier proposals using only the attached documents. Create a table covering cost, privacy/security risk, implementation effort, support, and evidence for each claim. List assumptions, missing information, and points that need human review before a decision.',
    options: [],
  },
  {
    id: 'D2-L-007',
    domain: 'D2',
    difficulty: 'applied',
    type: 'drag-order',
    interaction: 'rank',
    context: 'A support team wants to improve an AI reply assistant after seeing repeated mistakes in refund cases.',
    stimulus: {
      src: '/stimuli/ai-pilot-workflow.svg',
      alt: 'Workflow map showing AI drafting, missing review loop, and monitoring needs.',
      label: 'Loop engineering artifact',
      caption: 'Use the workflow map to build a practical improvement loop.',
    },
    prompt: 'Order the loop-engineering steps.',
    rankItems: [
      { id: 'sample', label: 'Collect representative failed and successful cases' },
      { id: 'rubric', label: 'Define review criteria and error categories' },
      { id: 'revise', label: 'Revise prompt, sources, or workflow controls' },
      { id: 'monitor', label: 'Monitor new outputs against the same criteria' },
    ],
    idealOrder: ['sample', 'rubric', 'revise', 'monitor'],
    options: [
      { id: 'rank', label: 'Order loop steps from evidence to monitoring.', score: 98, feedback: 'Correct. Improvement loops start from evidence, then revise and monitor.' },
    ],
  },
  {
    id: 'D2-A2A-008',
    domain: 'D2',
    difficulty: 'proficient',
    type: 'matching',
    interaction: 'match',
    context: 'A travel agent, calendar agent, and expense agent need to pass tasks between systems for a business trip.',
    visualStimulus: {
      kind: 'dashboard',
      eyebrow: 'Agent handoff map',
      title: 'A2A Trip Planning Flow',
      caption: 'Agent-to-agent workflows need identity, authorization, task state, and audit evidence.',
      points: ['Travel agent: books flight', 'Calendar agent: checks availability', 'Expense agent: applies policy', 'Human: approves cost exception'],
      flags: ['Who is authorized?', 'What state is passed?', 'Where is approval logged?'],
    },
    prompt: 'Match each A2A concern to the right control.',
    matchPairs: [
      { id: 'identity', left: 'Which agent is making the request?', correct: 'Authenticated agent identity', choices: ['Authenticated agent identity', 'Longer prompt', 'Marketing page'] },
      { id: 'authority', left: 'Can it book above policy?', correct: 'Human approval threshold', choices: ['Human approval threshold', 'Unlimited delegation', 'Hide the event'] },
      { id: 'trace', left: 'What happened across agents?', correct: 'Shared audit trail', choices: ['Shared audit trail', 'No logging', 'Emoji status'] },
    ],
    options: [
      { id: 'match', label: 'Match A2A risks to controls.', score: 98, feedback: 'Correct. Interoperability needs trust, authorization, and traceability.' },
    ],
  },
  {
    id: 'D4-MCP-007',
    domain: 'D4',
    difficulty: 'applied',
    type: 'multi-select',
    interaction: 'multi',
    context: 'A chatbot can call connected tools for email, calendar, and files. A user asks it to summarize a private folder and send the result externally.',
    visualStimulus: {
      kind: 'risk',
      eyebrow: 'Tool connector review',
      title: 'MCP-Style Tool Call',
      caption: 'Connected tools expose data and authority beyond ordinary chat.',
      points: ['Tool: file search', 'Tool: email send', 'Data: private folder', 'Destination: external recipient'],
      flags: ['Data leaves workspace', 'External send', 'Approval needed'],
    },
    prompt: 'Select the controls needed before tool invocation.',
    correctOptionIds: ['a', 'b', 'c', 'd'],
    options: [
      { id: 'a', label: 'Confirm exactly what data will be accessed.', score: 25, feedback: 'Tool calls need clear data scope.' },
      { id: 'b', label: 'Require approval before external sending.', score: 25, feedback: 'Outbound transmission needs human confirmation.' },
      { id: 'c', label: 'Log tool inputs, outputs, and destination.', score: 25, feedback: 'Auditability is essential.' },
      { id: 'd', label: 'Apply least privilege to file access.', score: 25, feedback: 'The tool should not see more than needed.' },
      { id: 'e', label: 'Let the model decide silently because it is efficient.', score: 0, feedback: 'Silent tool use creates privacy and accountability risk.' },
    ],
  },
  {
    id: 'D5-TREND-007',
    domain: 'D5',
    difficulty: 'awareness',
    type: 'scenario',
    interaction: 'single',
    context: 'A colleague wants to buy a new AI agent platform because the vendor says agent-to-agent workflows are the next big trend.',
    prompt: 'What is the best first question?',
    options: [
      { id: 'a', label: 'Which workflow problem, measurable outcome, data access, and human approval boundary does it solve?', score: 98, feedback: 'Correct. Trends matter only when tied to a real workflow and control model.' },
      { id: 'b', label: 'Can we announce it before competitors?', score: 20, feedback: 'Announcement value is not operational value.' },
      { id: 'c', label: 'Can it replace all employees in the workflow?', score: 5, feedback: 'That skips task analysis, risk, and human accountability.' },
      { id: 'd', label: 'Does the demo look futuristic?', score: 10, feedback: 'A polished demo is not evidence of fit.' },
    ],
  },
  {
    id: 'D6-LOOP-008',
    domain: 'D6',
    difficulty: 'applied',
    type: 'narrative',
    interaction: 'single',
    context: 'A team uses AI for weekly planning. People accept the AI plan without challenging assumptions, and missed dependencies keep appearing late.',
    visualStimulus: {
      kind: 'memo',
      eyebrow: 'Team loop',
      title: 'Planning Review Breakdown',
      caption: 'A human-AI loop needs challenge, ownership, and learning.',
      points: ['AI plan: accepted quickly', 'Assumptions: not reviewed', 'Dependencies: missed twice', 'Owner: unclear'],
      flags: ['Add dissent capture', 'Assign owners', 'Review assumptions'],
    },
    prompt: 'What collaboration routine would help most?',
    options: [
      { id: 'a', label: 'Keep AI planning, but add assumption review, owner sign-off, and a retro on missed dependencies.', score: 98, feedback: 'Correct. The loop keeps AI useful while preserving human judgment.' },
      { id: 'b', label: 'Let AI own all dependencies.', score: 15, feedback: 'Ownership and accountability stay human.' },
      { id: 'c', label: 'Stop planning because the AI made mistakes.', score: 30, feedback: 'The better move is redesigning the review loop.' },
      { id: 'd', label: 'Hide missed dependencies from the team.', score: 5, feedback: 'That blocks learning.' },
    ],
  },
  {
    id: 'D1-AGENT-008',
    domain: 'D1',
    difficulty: 'awareness',
    type: 'matching',
    interaction: 'match',
    context: 'A friend says a chatbot, copilot, and agent are all the same thing.',
    prompt: 'Match each AI tool pattern to its most important difference.',
    matchPairs: [
      { id: 'chatbot', left: 'Chatbot', correct: 'Responds in conversation', choices: ['Responds in conversation', 'Acts across tools autonomously', 'Approves budgets'] },
      { id: 'copilot', left: 'Copilot', correct: 'Assists inside a human workflow', choices: ['Assists inside a human workflow', 'Owns all decisions', 'Needs no review'] },
      { id: 'agent', left: 'Agent', correct: 'Can plan and use tools toward a goal', choices: ['Can plan and use tools toward a goal', 'Only changes font size', 'Cannot affect systems'] },
    ],
    options: [
      { id: 'match', label: 'Match tool patterns to capabilities.', score: 98, feedback: 'Correct. Agentic behavior adds tool-use and authority questions.' },
    ],
  },
  {
    id: 'D5-PRO-009',
    domain: 'D5',
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'single',
    context: 'A team wants to scale an AI support pilot because average handling time improved, but the raw ticket review shows quality risks in refund cases.',
    stimulus: {
      src: '/stimuli/realistic-support-ticket-ai-draft.png',
      alt: 'Customer support console showing duplicate-charge evidence, SLA warning, policy notes, reviewer notes, and a weak AI draft response.',
      label: 'Raw support evidence',
      caption: 'Inspect the operational evidence before deciding whether the pilot is ready to scale.',
    },
    prompt: 'What is the best scale decision?',
    options: [
      { id: 'a', label: 'Scale only after refund-case quality improves and review gates are measured.', score: 98, feedback: 'Correct. Value must include quality and risk, not speed alone.' },
      { id: 'b', label: 'Scale now because faster handling time is enough evidence.', score: 25, feedback: 'Speed without quality can create customer and compliance risk.' },
      { id: 'c', label: 'Cancel all AI support work because one case failed.', score: 35, feedback: 'One failure should drive diagnosis and controls, not automatic cancellation.' },
      { id: 'd', label: 'Hide refund cases from the pilot metrics.', score: 5, feedback: 'That would distort the evidence base.' },
    ],
  },
  {
    id: 'D3-PRO-010',
    domain: 'D3',
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'multi',
    context: 'An AI dashboard summary highlights the best-looking campaign result and recommends immediate budget reallocation.',
    stimulus: {
      src: '/stimuli/raw-marketing-campaign-dashboard.svg',
      alt: 'Raw campaign dashboard showing high conversion rate for a tiny sample with a coupon leak note.',
      label: 'Raw dashboard evidence',
      caption: 'Use the raw campaign export to identify what makes the recommendation weak.',
    },
    prompt: 'Which evidence problems should be flagged?',
    correctOptionIds: ['a', 'b', 'c'],
    options: [
      { id: 'a', label: 'The winning ad set has a tiny sample.', score: 33, feedback: 'Correct. Small samples make rate comparisons unstable.' },
      { id: 'b', label: 'The coupon leak may distort conversion behavior.', score: 33, feedback: 'Correct. Traffic quality affects whether the result is scalable.' },
      { id: 'c', label: 'The recommendation lacks incrementality evidence.', score: 33, feedback: 'Correct. Scaling needs evidence beyond observed rate.' },
      { id: 'd', label: 'The table should be ignored because dashboards are never useful.', score: 0, feedback: 'Dashboards can help when interpreted with uncertainty and context.' },
    ],
  },
  {
    id: 'D4-PRO-011',
    domain: 'D4',
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'text',
    context: 'A tool-connected AI assistant tried to access files beyond the incident scope while helping with technical triage.',
    stimulus: {
      src: '/stimuli/raw-technical-access-log.svg',
      alt: 'Raw access log showing denied HR notes and secrets access plus blocked external and public actions.',
      label: 'Raw access log',
      caption: 'Inspect the connector log and write the governance response.',
    },
    prompt: 'Write 2-4 sentences naming the key access-control lessons.',
    rubricCriteria: [
      { id: 'scope', label: 'Mentions least privilege or scoped access', keywords: ['least privilege', 'scope', 'scoped', 'minimum', 'permissions'], points: 28 },
      { id: 'sensitive', label: 'Flags sensitive or out-of-scope access attempts', keywords: ['sensitive', 'secret', 'hr', 'outside', 'out-of-scope'], points: 26 },
      { id: 'approval', label: 'Preserves human approval gates', keywords: ['approval', 'human', 'gate', 'external', 'public'], points: 24 },
      { id: 'audit', label: 'Uses logs for audit and improvement', keywords: ['log', 'audit', 'trace', 'review', 'incident'], points: 20 },
    ],
    exemplarAnswer: 'The assistant should keep least-privilege access limited to the incident. Attempts to read HR notes or secrets are out of scope and should trigger review. Human approval gates for external email and public status updates should remain, and the logs should be preserved for audit and tuning.',
    options: [],
  },
  {
    id: 'GEN-EXP-D1-001',
    domain: 'D1',
    difficulty: 'proficient',
    type: 'matching',
    interaction: 'match',
    context: 'A parent asks an AI assistant to summarize a school phone policy before sending it to a class chat.',
    stimulus: {
      src: '/stimuli/gen-exp-school-policy-draft.svg',
      alt: 'Document review screen comparing a source school policy excerpt with an AI summary that omits important exceptions.',
      label: 'Policy summary artifact',
      caption: 'Inspect whether the AI preserved source meaning, exceptions, date, and approved owner.',
    },
    prompt: 'Match each AI behavior to the concept it demonstrates.',
    matchPairs: [
      { id: 'omission', left: 'The summary drops teacher-approved exceptions.', correct: 'Loss of source meaning', choices: ['Loss of source meaning', 'Fresh training data', 'Stronger privacy protection'] },
      { id: 'confidence', left: 'The answer sounds final despite a thin review.', correct: 'Fluent output is not proof', choices: ['Fluent output is not proof', 'Human approval is unnecessary', 'The source is automatically wrong'] },
      { id: 'grounding', left: 'The user checks the handbook before sending.', correct: 'Grounding against evidence', choices: ['Grounding against evidence', 'Delegating the decision fully', 'Ignoring context length'] },
    ],
    options: [
      { id: 'match', label: 'Match concepts to evidence.', score: 98, feedback: 'Correct. Strong AI literacy distinguishes fluency, grounding, and meaning preservation.' },
    ],
  },
  {
    id: 'MULTI-CONCEPT-GEN-001',
    domain: 'D1',
    secondaryDomains: ['D2', 'D4'],
    difficulty: 'applied',
    type: 'concept-cluster',
    interaction: 'parts',
    functionTracks: ['general', 'people', 'finance', 'marketing', 'sales', 'customerService', 'technical', 'operations'],
    context: 'A user wants to understand why an AI answer can be fluent, source-grounded, tool-connected, or personally customized depending on setup.',
    stimulus: {
      src: '/stimuli/ai-concept-workbench.svg',
      alt: 'Concept workbench defining LLM, RAG, MCP tools, prompt, context, and memory with risks to watch for.',
      label: 'Concept cluster artifact',
      caption: 'Use the workbench to answer each mini-part. Each part updates a domain signal.',
    },
    prompt: 'Answer the mini-parts to show whether you can distinguish core AI concepts in practice.',
    parts: [
      {
        id: 'llm',
        domain: 'D1',
        prompt: 'An answer sounds fluent but cites no current source. What concept explains the risk?',
        correctOptionId: 'a',
        options: [
          { id: 'a', label: 'An LLM can generate plausible language without proof.', score: 98, feedback: 'Correct. Fluency is not evidence.' },
          { id: 'b', label: 'RAG always guarantees the answer is current.', score: 20, feedback: 'RAG depends on retrieved source quality.' },
          { id: 'c', label: 'Memory means the model checked an approved file.', score: 25, feedback: 'Memory is not the same as source verification.' },
        ],
      },
      {
        id: 'rag',
        domain: 'D2',
        prompt: 'You need answers from the latest HR policy. What setup is most useful?',
        correctOptionId: 'b',
        options: [
          { id: 'a', label: 'Ask the model to rely on general training knowledge.', score: 25, feedback: 'Training knowledge may be stale or generic.' },
          { id: 'b', label: 'Retrieve approved policy sources and show citations.', score: 98, feedback: 'Correct. RAG grounds the answer in selected documents.' },
          { id: 'c', label: 'Store a preference that HR questions matter.', score: 35, feedback: 'That may personalize behavior but does not ground policy facts.' },
        ],
      },
      {
        id: 'mcp',
        domain: 'D4',
        prompt: 'An AI can read files and send emails through connectors. What changes most?',
        correctOptionId: 'c',
        options: [
          { id: 'a', label: 'The answer becomes automatically more accurate.', score: 35, feedback: 'Tool access does not guarantee correctness.' },
          { id: 'b', label: 'The prompt no longer needs human review.', score: 15, feedback: 'Review matters more when tools can act.' },
          { id: 'c', label: 'Permissions, logs, and approval gates become critical.', score: 98, feedback: 'Correct. Tool use adds data and action risk.' },
        ],
      },
    ],
    options: [],
  },
  {
    id: 'MULTI-CONCEPT-GEN-002',
    domain: 'D2',
    secondaryDomains: ['D1', 'D4', 'D6'],
    difficulty: 'proficient',
    type: 'concept-cluster',
    interaction: 'parts',
    functionTracks: ['general', 'people', 'finance', 'marketing', 'sales', 'customerService', 'technical', 'operations'],
    context: 'A team is designing a reusable AI assistant for weekly planning and wants to avoid vague prompts, accidental data sharing, and passive overreliance.',
    stimulus: {
      src: '/stimuli/ai-concept-workbench.svg',
      alt: 'Concept workbench defining prompt, context, memory, LLM, RAG, and MCP/tool connectors.',
      label: 'Concept cluster artifact',
      caption: 'Use the workbench to answer each mini-part. The item tests practical application across domains.',
    },
    prompt: 'Answer the mini-parts about prompt, context, and memory.',
    parts: [
      {
        id: 'prompt',
        domain: 'D2',
        prompt: 'Which prompt pattern best improves a recurring weekly planning task?',
        correctOptionId: 'a',
        options: [
          { id: 'a', label: 'Define task, audience, sources, format, limits, and review checks.', score: 98, feedback: 'Correct. Reusable prompts need inputs, constraints, and checks.' },
          { id: 'b', label: 'Ask for something impressive and let the model choose structure.', score: 30, feedback: 'This leaves success criteria unclear.' },
          { id: 'c', label: 'Use the shortest prompt so the model has more freedom.', score: 35, feedback: 'Freedom can increase inconsistency in recurring workflows.' },
        ],
      },
      {
        id: 'context',
        domain: 'D4',
        prompt: 'What should happen before adding calendar screenshots, bills, and work notes as context?',
        correctOptionId: 'b',
        options: [
          { id: 'a', label: 'Upload everything so the AI can decide relevance.', score: 15, feedback: 'Data minimization should happen before upload.' },
          { id: 'b', label: 'Remove unnecessary private details and separate work from personal data.', score: 98, feedback: 'Correct. Context should be useful and bounded.' },
          { id: 'c', label: 'Use memory so private details do not need review.', score: 25, feedback: 'Memory can increase retention risk if not governed.' },
        ],
      },
      {
        id: 'memory',
        domain: 'D6',
        prompt: 'What is the healthiest team norm for AI memory in shared work?',
        correctOptionId: 'c',
        options: [
          { id: 'a', label: 'Let memory silently decide priorities for the group.', score: 20, feedback: 'Silent personalization can hide assumptions.' },
          { id: 'b', label: 'Ban all saved preferences even for low-risk formatting.', score: 40, feedback: 'Some memory can be useful when transparent and low-risk.' },
          { id: 'c', label: 'Make remembered preferences visible, editable, and easy to challenge.', score: 98, feedback: 'Correct. Shared work needs transparency and control.' },
        ],
      },
    ],
    options: [],
  },
  {
    id: 'GEN-EXP-D2-001',
    domain: 'D2',
    difficulty: 'applied',
    type: 'drag-order',
    interaction: 'rank',
    context: 'You want AI to turn a messy mix of school notices, meeting notes, and calendar details into a useful weekly action plan.',
    stimulus: {
      src: '/stimuli/gen-exp-privacy-workflow-board.svg',
      alt: 'Workflow board showing inputs, AI drafting, risk checks, human review, and value metrics for a weekly planning task.',
      label: 'AI workflow board',
      caption: 'Use the board to decide the safest practical order for using AI in the task.',
    },
    prompt: 'Put the workflow steps in the strongest order.',
    rankItems: [
      { id: 'scope', label: 'Separate work, school, and personal material before upload' },
      { id: 'prompt', label: 'Give the AI the task, format, constraints, and priority rules' },
      { id: 'check', label: 'Verify names, dates, commitments, and sensitive details' },
      { id: 'use', label: 'Use the plan after making needed human corrections' },
    ],
    idealOrder: ['scope', 'prompt', 'check', 'use'],
    options: [
      { id: 'rank', label: 'Order the AI planning workflow.', score: 98, feedback: 'Correct. Practical AI use starts with scope, then prompting, checking, and careful use.' },
    ],
  },
  {
    id: 'GEN-EXP-D3-001',
    domain: 'D3',
    difficulty: 'proficient',
    type: 'fraud-detection',
    interaction: 'text',
    context: 'A delivery text arrives while you are expecting a package. It links to a page asking for a small customs fee and full card details.',
    stimulus: {
      src: '/stimuli/gen-exp-fraud-sms-thread.svg',
      alt: 'Suspicious delivery SMS thread and payment page with urgency, shortened link, mismatched domain, and card collection.',
      label: 'Suspicious delivery message',
      caption: 'Inspect the message and payment page before deciding whether to act.',
    },
    prompt: 'Write 2-4 sentences naming the strongest red flags and the safest next action.',
    rubricCriteria: [
      { id: 'domain', label: 'Flags the shortened or mismatched domain', keywords: ['domain', 'link', 'url', 'shortened', 'trk', 'mismatch'], points: 24 },
      { id: 'pressure', label: 'Names urgency or pressure as suspicious', keywords: ['urgent', 'pressure', '30 min', 'today', 'soon', 'rush'], points: 20 },
      { id: 'payment', label: 'Questions the fee and card collection', keywords: ['card', 'payment', 'fee', 'customs', 'billing', 'bank'], points: 26 },
      { id: 'verify', label: 'Recommends checking through an official channel', keywords: ['official', 'carrier', 'app', 'website', 'tracking', 'verify', 'confirm'], points: 28 },
    ],
    exemplarAnswer: 'I would not pay from this link. The shortened domain, urgent countdown, tiny fee, and request for full card details are strong fraud signals. I would check the shipment only through the carrier app or official website using the original tracking number.',
    options: [],
  },
  {
    id: 'GEN-EXP-D4-001',
    domain: 'D4',
    difficulty: 'applied',
    type: 'multi-select',
    interaction: 'multi',
    context: 'A friend wants to upload screenshots of a family calendar, work notes, and a bill so AI can organize the week.',
    stimulus: {
      src: '/stimuli/gen-exp-privacy-workflow-board.svg',
      alt: 'Workflow board showing private inputs, risk checks, and human review gates for AI-assisted planning.',
      label: 'Privacy workflow artifact',
      caption: 'Identify which privacy controls should happen before using AI on mixed personal and work material.',
    },
    prompt: 'Which actions reduce privacy risk before using AI?',
    correctOptionIds: ['a', 'b', 'c'],
    options: [
      { id: 'a', label: 'Remove account numbers, addresses, and client names not needed.', score: 34, feedback: 'Correct. Data minimization lowers exposure.' },
      { id: 'b', label: 'Use an approved work tool for work notes.', score: 33, feedback: 'Correct. Work data belongs in approved systems.' },
      { id: 'c', label: 'Separate personal, school, and work tasks into different prompts.', score: 33, feedback: 'Correct. Separation reduces accidental disclosure and context mixing.' },
      { id: 'd', label: 'Upload every screenshot because more context is safer.', score: 0, feedback: 'More context can increase privacy risk when the data is unnecessary.' },
      { id: 'e', label: 'Let the AI decide which private details matter after upload.', score: 0, feedback: 'Privacy decisions should happen before sharing the data.' },
    ],
  },
  {
    id: 'GEN-EXP-D5-001',
    domain: 'D5',
    difficulty: 'applied',
    type: 'judgment',
    interaction: 'single',
    context: 'A small team wants to adopt AI because everyone feels busy. They are choosing between a weekly planning assistant, a public advice bot, and fully automated invoice approval.',
    stimulus: {
      src: '/stimuli/gen-exp-privacy-workflow-board.svg',
      alt: 'AI decision board with task inputs, risk checks, human review, collaboration norms, and value metric.',
      label: 'AI value decision board',
      caption: 'Use the board to choose a useful, measurable, and appropriately bounded first AI use case.',
    },
    prompt: 'Which first pilot is strongest?',
    options: [
      { id: 'a', label: 'Weekly planning drafts with baseline, privacy limits, and human approval.', score: 98, feedback: 'Correct. It has a clear workflow, measurable value, and manageable risk.' },
      { id: 'b', label: 'Public advice bot launched broadly to learn from complaints.', score: 35, feedback: 'This creates customer-facing risk before controls and evidence are ready.' },
      { id: 'c', label: 'Automated invoice approval because finance work uses numbers.', score: 30, feedback: 'Payment approval is high-impact and needs stronger governance before automation.' },
      { id: 'd', label: 'Any pilot with the newest model, even without an owner.', score: 20, feedback: 'Model novelty does not replace problem fit, measurement, and ownership.' },
    ],
  },
  {
    id: 'GEN-EXP-D6-001',
    domain: 'D6',
    difficulty: 'proficient',
    type: 'matching',
    interaction: 'match',
    context: 'A group project uses AI to summarize sources and assign tasks. People are starting to copy AI wording without checking whether it reflects the source or their own responsibilities.',
    stimulus: {
      src: '/stimuli/gen-exp-school-policy-draft.svg',
      alt: 'Document review screen showing where an AI-generated summary diverges from source policy details.',
      label: 'Human-AI review artifact',
      caption: 'Use the source mismatch to decide what each human role should own when AI helps with shared work.',
    },
    prompt: 'Match each collaboration risk to the best human practice.',
    matchPairs: [
      { id: 'ownership', left: 'Nobody knows who checked the final summary.', correct: 'Assign a named reviewer before sharing', choices: ['Assign a named reviewer before sharing', 'Ask AI to pick the owner', 'Remove all source links'] },
      { id: 'learning', left: 'Team members accept AI wording without understanding it.', correct: 'Have people explain key changes in their own words', choices: ['Have people explain key changes in their own words', 'Use longer AI outputs', 'Hide uncertainty from the group'] },
      { id: 'dissent', left: 'A source exception disappears from the group decision.', correct: 'Preserve caveats and invite challenge before final approval', choices: ['Preserve caveats and invite challenge before final approval', 'Prefer the shorter version automatically', 'Let speed override disagreement'] },
    ],
    options: [
      { id: 'match', label: 'Match collaboration risks to practices.', score: 98, feedback: 'Correct. Healthy human-AI collaboration keeps ownership, learning, and challenge visible.' },
    ],
  },
  {
    id: 'MULTI-SOURCE-GEN-003',
    domain: 'D1',
    secondaryDomains: ['D2', 'D3', 'D4'],
    difficulty: 'applied',
    type: 'concept-cluster',
    interaction: 'parts',
    functionTracks: ['general', 'people', 'finance', 'marketing', 'sales', 'customerService', 'technical', 'operations'],
    context: 'A workplace AI assistant answers a policy question using retrieved sources, but the draft may mix source facts with unsupported interpretation.',
    stimulus: {
      src: '/stimuli/raw-rag-source-comparison.svg',
      alt: 'Raw source comparison packet showing approved AI policy text next to an assistant answer that overstates public AI tool use.',
      label: 'Raw source comparison',
      caption: 'Inspect the policy source and AI answer. Each mini-part tests whether the user can convert AI concepts into practical review behavior.',
    },
    prompt: 'Answer the mini-parts about grounding, verification, and privacy.',
    parts: [
      {
        id: 'grounding-gap',
        domain: 'D1',
        prompt: 'What is the main concept problem in the assistant answer?',
        correctOptionId: 'b',
        options: [
          { id: 'a', label: 'The answer is too short to be useful.', score: 35, feedback: 'Length is not the main issue. The answer conflicts with the source.' },
          { id: 'b', label: 'It treats fluent text as if it were grounded in the source.', score: 98, feedback: 'Correct. The answer sounds confident but is not source-faithful.' },
          { id: 'c', label: 'It refuses to help with a safe task.', score: 20, feedback: 'The issue is over-permission, not excessive refusal.' },
        ],
      },
      {
        id: 'review-action',
        domain: 'D3',
        prompt: 'What should the reviewer do before sharing the answer?',
        correctOptionId: 'c',
        options: [
          { id: 'a', label: 'Share it because the source name appears in the packet.', score: 20, feedback: 'Source presence does not prove the answer reflects it.' },
          { id: 'b', label: 'Ask AI to make the answer more confident.', score: 25, feedback: 'Confidence language can hide unsupported claims.' },
          { id: 'c', label: 'Mark each claim as supported, contradicted, or missing from the source.', score: 98, feedback: 'Correct. Claim-by-claim evidence checking is the practical skill.' },
        ],
      },
      {
        id: 'privacy-control',
        domain: 'D4',
        prompt: 'Which policy detail matters most for safe everyday use?',
        correctOptionId: 'a',
        options: [
          { id: 'a', label: 'Work records should use the approved enterprise assistant.', score: 98, feedback: 'Correct. Tool choice is part of privacy and governance.' },
          { id: 'b', label: 'Public tools are safe if the prompt is polite.', score: 18, feedback: 'Tone does not control data exposure.' },
          { id: 'c', label: 'A password is the only sensitive information to avoid.', score: 24, feedback: 'The policy names several sensitive data categories.' },
        ],
      },
    ],
    options: [],
  },
  {
    id: 'PRACTICAL-GEN-D2-012',
    domain: 'D2',
    secondaryDomains: ['D4', 'D5'],
    difficulty: 'proficient',
    type: 'drag-order',
    interaction: 'rank',
    functionTracks: ['general', 'operations', 'technical', 'people', 'finance'],
    context: 'A team wants an AI agent to handle low-value refund requests, draft customer messages, and update CRM records.',
    stimulus: {
      src: '/stimuli/realistic-agent-workflow-builder.png',
      alt: 'Workflow builder screenshot showing a refund-response agent with broad permissions, missing approval gate, partial audit log, and no rollback owner.',
      label: 'Agent workflow artifact',
      caption: 'Use the workflow plan to sequence a safe practical rollout.',
    },
    prompt: 'Put the rollout steps in the order that best tests usefulness while controlling agent risk.',
    rankItems: [
      { id: 'map', label: 'Map the refund workflow, impact thresholds, and human owners' },
      { id: 'scope', label: 'Limit tools, data, refund authority, and external sends' },
      { id: 'pilot', label: 'Run a monitored pilot with logs, quality review, and exceptions' },
      { id: 'scale', label: 'Expand only after value, harm, and adoption evidence meet gates' },
    ],
    idealOrder: ['map', 'scope', 'pilot', 'scale'],
    options: [
      { id: 'rank', label: 'Order the agent rollout gates.', score: 98, feedback: 'Correct. Practical agent adoption starts with workflow and authority design before scale.' },
    ],
  },
  {
    id: 'PRACTICAL-GEN-D3-013',
    domain: 'D3',
    secondaryDomains: ['D1', 'D4'],
    difficulty: 'applied',
    type: 'multi-select',
    interaction: 'multi',
    industryTracks: ['general', 'public', 'education', 'financial'],
    context: 'A manager asks whether the AI policy answer can be posted in a team channel as guidance for everyone.',
    stimulus: {
      src: '/stimuli/raw-rag-source-comparison.svg',
      alt: 'Policy source check artifact with source text and an AI answer that overstates public AI tool permissions.',
      label: 'Policy answer review',
      caption: 'Select the practical evidence checks a user should make before reposting the AI answer.',
    },
    prompt: 'Which checks would meaningfully improve the answer before sharing it?',
    correctOptionIds: ['a', 'c', 'd'],
    options: [
      { id: 'a', label: 'Rewrite the answer so every permission matches the source text.', score: 34, feedback: 'Correct. Source-faithful rewriting is the key repair.' },
      { id: 'b', label: 'Remove the source date because dates make answers look less polished.', score: 0, feedback: 'Dates help users judge currency.' },
      { id: 'c', label: 'Add the required approved-tool rule for work records.', score: 33, feedback: 'Correct. This is a missing governance constraint.' },
      { id: 'd', label: 'Flag customer, financial, health, and HR data as excluded from public tools.', score: 33, feedback: 'Correct. The answer omitted the main data-risk categories.' },
      { id: 'e', label: 'Ask AI for a longer answer and post the longest version.', score: 0, feedback: 'More words do not solve source contradiction.' },
    ],
  },
  {
    id: 'PRACTICAL-GEN-D6-014',
    domain: 'D6',
    secondaryDomains: ['D1', 'D2'],
    difficulty: 'applied',
    type: 'narrative',
    interaction: 'text',
    industryTracks: ['education', 'general'],
    context: 'A student wants to use AI for an assignment without losing learning ownership or submitting work they cannot explain.',
    stimulus: {
      src: '/stimuli/raw-study-helper-review.svg',
      alt: 'Study helper review artifact showing a student prompt, AI draft excerpt, class instruction, and reviewer notes.',
      label: 'Study helper artifact',
      caption: 'Inspect the prompt, class instruction, AI draft, and reviewer notes before writing your recommendation.',
    },
    prompt: 'Write 2-4 sentences explaining how the student should change the AI use so it builds skill instead of replacing learning.',
    rubricCriteria: [
      { id: 'ownership', label: 'Keeps student reasoning and final answer human-owned', keywords: ['own', 'reasoning', 'student', 'explain', 'human', 'draft'], points: 28 },
      { id: 'sources', label: 'Requires sources or evidence for claims', keywords: ['source', 'evidence', 'citation', 'verify', 'local example'], points: 24 },
      { id: 'prompt-change', label: 'Changes the prompt toward feedback, critique, quiz, or outline help', keywords: ['feedback', 'critique', 'quiz', 'outline', 'questions', 'coach'], points: 28 },
      { id: 'transparency', label: 'Mentions transparency about AI assistance where required', keywords: ['transparent', 'disclose', 'teacher', 'allowed', 'policy'], points: 18 },
    ],
    exemplarAnswer: 'The student should first write their own notes and ask AI to critique gaps, quiz them, or suggest an outline rather than write the final answer. They should add source links and a local example they can explain, and follow any class rule about disclosing AI help.',
    options: [],
  },
  {
    id: 'FUNC-EXP-OPS-D5-003',
    domain: 'D5',
    secondaryDomains: ['D2', 'D4', 'D6'],
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'text',
    functionTracks: ['operations', 'technical', 'finance'],
    context: 'Operations leaders are considering the refund agent shown in the workflow plan. Early demo results show faster handling but no verified customer-harm metric.',
    stimulus: {
      src: '/stimuli/realistic-agent-workflow-builder.png',
      alt: 'Workflow builder screenshot showing a refund-response agent with broad permissions, missing approval gate, partial audit log, and no rollback owner.',
      label: 'Agent value and risk review',
      caption: 'Use the raw workflow to recommend practical launch criteria.',
    },
    prompt: 'Write 2-4 sentences naming the launch criteria you would require before wider rollout.',
    rubricCriteria: [
      { id: 'value', label: 'Defines value beyond speed', keywords: ['quality', 'customer', 'harm', 'accuracy', 'baseline', 'outcome'], points: 26 },
      { id: 'authority', label: 'Sets tool and action authority limits', keywords: ['permission', 'scope', 'refund', 'email', 'approval', 'limit'], points: 26 },
      { id: 'monitoring', label: 'Requires monitoring and logs', keywords: ['log', 'monitor', 'audit', 'review', 'exception'], points: 24 },
      { id: 'owner', label: 'Names ownership and learning loop', keywords: ['owner', 'rollback', 'learn', 'update', 'coach'], points: 22 },
    ],
    exemplarAnswer: 'I would not scale on speed alone. The pilot should show refund quality, customer-harm, and exception metrics against a baseline, with scoped permissions, approval gates for customer-facing actions, audit logs, a rollback owner, and a process for updating prompts and training after incidents.',
    options: [],
  },
];

const executiveQuestionBank: Question[] = [
  ...executiveRelianceQuestions,
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
      metrics: [
        { label: 'Lift claim', value: '+42%', status: 'warn' },
        { label: 'Adoption', value: '38%', status: 'bad' },
        { label: 'Baseline', value: 'Missing', status: 'bad' },
      ],
      chartBars: [
        { label: 'Claimed gain', value: 92, note: 'Prominent' },
        { label: 'Adoption rate', value: 38, note: 'Low' },
        { label: 'Evidence quality', value: 28, note: 'Incomplete' },
      ],
      flags: ['No baseline', 'No sample size', 'Measurement period missing'],
    },
    stimulus: {
      src: '/stimuli/productivity-chart-forensics.png',
      alt: 'Dashboard image claiming large productivity gain with missing baseline and potentially misleading chart evidence.',
      label: 'Board dashboard artifact',
      caption: 'Inspect the dashboard claim before deciding whether the pilot is ready to scale.',
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
      metrics: [
        { label: 'Value', value: 'Mixed', status: 'warn' },
        { label: 'Readiness', value: 'Uneven', status: 'warn' },
        { label: 'Risk', value: 'Varies', status: 'bad' },
      ],
      chartBars: [
        { label: 'Response drafting', value: 68, note: 'Ready' },
        { label: 'Credit exceptions', value: 91, note: 'High risk' },
        { label: 'Meeting summaries', value: 35, note: 'Low value' },
        { label: 'Pricing optimization', value: 76, note: 'Data gaps' },
      ],
      flags: ['High value is not enough', 'Risk-adjusted priority needed'],
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
    stimulus: {
      src: '/stimuli/agent-tool-trace.svg',
      alt: 'Agent trace showing file access, email drafting, CRM updates, finance approval, and missing approval gates.',
      label: 'Agent authority artifact',
      caption: 'Inspect the agent trace before matching capabilities to executive controls.',
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
    stimulus: {
      src: '/stimuli/raw-vendor-security-questionnaire.svg',
      alt: 'Raw AI vendor security questionnaire with missing audit, retention, subprocessor, monitoring, and exit answers.',
      label: 'Raw vendor questionnaire',
      caption: 'Inspect the vendor responses directly before deciding what blocks procurement.',
    },
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
      metrics: [
        { label: 'Forecast', value: '+31%', status: 'warn' },
        { label: 'Source fit', value: 'Poor', status: 'bad' },
        { label: 'Sample', value: 'None', status: 'bad' },
      ],
      chartBars: [
        { label: 'Recommendation confidence', value: 86, note: 'AI output' },
        { label: 'Citation support', value: 22, note: 'Weak' },
      ],
      flags: ['Source A has no forecast', 'Vendor blog lacks sample', 'Board claim unsupported'],
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
      metrics: [
        { label: 'Access scope', value: '214', status: 'bad' },
        { label: 'Containment', value: 'Partial', status: 'warn' },
        { label: 'Owner', value: 'Missing', status: 'bad' },
      ],
      chartBars: [
        { label: 'Exposure breadth', value: 82, note: 'Too broad' },
        { label: 'Containment', value: 46, note: 'Incomplete' },
        { label: 'Prevention readiness', value: 24, note: 'No owner' },
      ],
      flags: ['Stop access first', 'Legal review needed', 'Prevention owner absent'],
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
  {
    id: 'EXEC-D5-013',
    domain: 'D5',
    difficulty: 'awareness',
    type: 'scenario',
    interaction: 'single',
    context: 'A pilot has low adoption after 90 days, but the sponsor wants to scale because the launch announcement was high profile.',
    prompt: 'What is the best executive decision?',
    options: [
      { id: 'a', label: 'Scale anyway to protect the announcement.', score: 15, feedback: 'Optics should not override adoption and outcome evidence.' },
      { id: 'b', label: 'Pause scale-up, diagnose adoption barriers, and decide whether to iterate or stop.', score: 95, feedback: 'Correct. Stage gates should use evidence, not momentum.' },
      { id: 'c', label: 'Declare the pilot a success because it launched.', score: 20, feedback: 'Launch is not value realization.' },
      { id: 'd', label: 'Move the pilot to another team without review.', score: 35, feedback: 'Transferring the problem does not create learning.' },
    ],
  },
  {
    id: 'EXEC-D5-009',
    domain: 'D5',
    difficulty: 'applied',
    type: 'multi-select',
    interaction: 'multi',
    context: 'The CFO asks why the AI platform budget is higher than the license quote.',
    prompt: 'Select the hidden cost categories that belong in the total cost view.',
    correctOptionIds: ['a', 'b', 'c', 'd'],
    options: [
      { id: 'a', label: 'Integration, data preparation, and security review.', score: 25, feedback: 'These often exceed simple license cost.' },
      { id: 'b', label: 'Human review, exception handling, and QA time.', score: 25, feedback: 'Human-in-the-loop work is part of operating cost.' },
      { id: 'c', label: 'Training, adoption support, and change management.', score: 25, feedback: 'Capability building is needed for value.' },
      { id: 'd', label: 'Monitoring, audit, incident response, and vendor management.', score: 25, feedback: 'Controls have recurring cost.' },
      { id: 'e', label: 'Only the first-year subscription line.', score: 0, feedback: 'That misses the full cost structure.' },
    ],
  },
  {
    id: 'EXEC-D4-014',
    domain: 'D4',
    difficulty: 'applied',
    type: 'multi-select',
    interaction: 'multi',
    context: 'A customer challenges an AI-assisted scoring decision and asks how the decision was made.',
    visualStimulus: {
      kind: 'report',
      eyebrow: 'Decision audit request',
      title: 'Customer Challenge Packet',
      caption: 'The organization needs enough evidence to explain and review the decision.',
      points: ['Model version: missing', 'Human reviewer: recorded', 'Input snapshot: available', 'Rationale: partial'],
    },
    prompt: 'Select the records that should be preserved for auditability.',
    correctOptionIds: ['a', 'b', 'c', 'd'],
    options: [
      { id: 'a', label: 'Input data snapshot and source timestamp.', score: 25, feedback: 'Inputs anchor the decision.' },
      { id: 'b', label: 'Model/version or system configuration used.', score: 25, feedback: 'Versioning matters for review.' },
      { id: 'c', label: 'Human review status and rationale.', score: 25, feedback: 'Human accountability must be visible.' },
      { id: 'd', label: 'Appeal outcome and remediation record.', score: 25, feedback: 'Appeals complete the evidence trail.' },
      { id: 'e', label: 'Only the final score.', score: 0, feedback: 'A score without context is not auditable.' },
    ],
  },
  {
    id: 'EXEC-D4-016',
    domain: 'D4',
    difficulty: 'proficient',
    type: 'narrative',
    interaction: 'single',
    context: 'The board asks management to define AI risk appetite before approving high-impact use cases.',
    prompt: 'Which risk appetite statement is strongest?',
    options: [
      { id: 'a', label: 'We will use AI wherever it improves speed.', score: 25, feedback: 'Speed alone is not a risk appetite.' },
      { id: 'b', label: 'We permit low-risk augmentation broadly, require enhanced controls for high-impact decisions, and prohibit unsupervised safety-critical actions.', score: 98, feedback: 'Correct. It defines tiers, controls, and boundaries.' },
      { id: 'c', label: 'We will wait for every regulation to be final.', score: 40, feedback: 'This is not an operating risk appetite.' },
      { id: 'd', label: 'We trust vendors to decide what is safe.', score: 15, feedback: 'Accountability remains with the organization.' },
    ],
  },
  {
    id: 'EXEC-D6-007',
    domain: 'D6',
    difficulty: 'applied',
    type: 'matching',
    interaction: 'match',
    context: 'An AI tool launched to 800 employees, but usage and confidence vary sharply by function.',
    prompt: 'Match each adoption signal to the leadership action it should trigger.',
    matchPairs: [
      { id: 'low-use', left: 'Low use in one function', correct: 'Diagnose workflow fit and manager enablement', choices: ['Diagnose workflow fit and manager enablement', 'Declare resistance', 'Remove all controls'] },
      { id: 'high-error', left: 'High correction rate', correct: 'Improve training and review checklist', choices: ['Improve training and review checklist', 'Scale immediately', 'Ignore quality'] },
      { id: 'hidden-use', left: 'Unreported tool usage', correct: 'Create safe disclosure and policy clarity', choices: ['Create safe disclosure and policy clarity', 'Punish every experiment', 'Stop measuring'] },
    ],
    options: [
      { id: 'match', label: 'Match adoption signals to leadership responses.', score: 98, feedback: 'Correct. Adoption metrics should trigger targeted support.' },
    ],
  },
  {
    id: 'EXEC-D6-010',
    domain: 'D6',
    difficulty: 'awareness',
    type: 'scenario',
    interaction: 'single',
    context: 'A function head asks to reduce headcount immediately because a demo showed an AI assistant drafting work quickly.',
    prompt: 'What is the best leadership response?',
    options: [
      { id: 'a', label: 'Approve the reduction based on the demo.', score: 10, feedback: 'A demo is not workforce evidence.' },
      { id: 'b', label: 'Require workflow evidence, quality measures, role redesign, and capability planning before workforce decisions.', score: 95, feedback: 'Correct. Workforce redesign needs evidence and care.' },
      { id: 'c', label: 'Ban the AI assistant to avoid difficult questions.', score: 30, feedback: 'Avoidance does not build capability.' },
      { id: 'd', label: 'Tell employees nothing until reductions are final.', score: 15, feedback: 'This damages trust and adoption.' },
    ],
  },
  {
    id: 'EXEC-D3-004',
    domain: 'D3',
    difficulty: 'awareness',
    type: 'multi-select',
    interaction: 'multi',
    context: 'A forecast model gives a confident revenue projection, and leadership wants to use it in investor guidance.',
    prompt: 'Select the uncertainty checks executives should request.',
    correctOptionIds: ['a', 'b', 'c'],
    options: [
      { id: 'a', label: 'Prediction interval or scenario range.', score: 33, feedback: 'Ranges communicate uncertainty.' },
      { id: 'b', label: 'Back-test against prior periods.', score: 33, feedback: 'Historical performance calibrates trust.' },
      { id: 'c', label: 'Assumptions, data freshness, and known limitations.', score: 33, feedback: 'Inputs and limits shape interpretation.' },
      { id: 'd', label: 'More confident wording in the slide title.', score: 0, feedback: 'Confidence wording is not evidence.' },
    ],
  },
  {
    id: 'EXEC-D3-006',
    domain: 'D3',
    difficulty: 'proficient',
    type: 'narrative',
    interaction: 'single',
    context: 'An AI recommendation conflicts with expert evidence from compliance, operations, and customer research.',
    prompt: 'What should the executive decision record show?',
    options: [
      { id: 'a', label: 'The AI recommendation won because it was quantitative.', score: 20, feedback: 'Quantitative output is not automatically stronger evidence.' },
      { id: 'b', label: 'The conflict was escalated, evidence was compared, uncertainty was documented, and a human decision owner was named.', score: 98, feedback: 'Correct. This is decision-quality governance.' },
      { id: 'c', label: 'The expert evidence was ignored to avoid delays.', score: 10, feedback: 'Ignoring contrary evidence creates risk.' },
      { id: 'd', label: 'No record is needed if the decision is urgent.', score: 15, feedback: 'Urgency increases the need for rationale.' },
    ],
  },
  {
    id: 'EXEC-D2-003',
    domain: 'D2',
    difficulty: 'awareness',
    type: 'scenario',
    interaction: 'single',
    context: 'An executive delegates an AI analysis request to an assistant but gives no context, source boundaries, or decision use.',
    prompt: 'Which instruction would improve the delegated AI task most?',
    options: [
      { id: 'a', label: 'Make the analysis impressive.', score: 20, feedback: 'Impressive is not a usable constraint.' },
      { id: 'b', label: 'Use these approved sources, compare three options, state assumptions, and flag where human judgment is required.', score: 95, feedback: 'Correct. Executives should define context, sources, output, and use.' },
      { id: 'c', label: 'Find whatever supports my preferred decision.', score: 10, feedback: 'That invites confirmation bias.' },
      { id: 'd', label: 'Skip source notes to save time.', score: 25, feedback: 'Decision support needs traceability.' },
    ],
  },
  {
    id: 'EXEC-D2-001',
    domain: 'D2',
    difficulty: 'awareness',
    type: 'matching',
    interaction: 'match',
    context: 'Executives ask what they personally need to understand about AI tooling versus what can be delegated.',
    prompt: 'Match the tooling topic to the right executive responsibility.',
    matchPairs: [
      { id: 'prompt', left: 'Prompt template design', correct: 'Set success criteria and review expectations', choices: ['Set success criteria and review expectations', 'Write every prompt personally', 'Ignore output quality'] },
      { id: 'access', left: 'Tool access level', correct: 'Approve risk tier and authority boundary', choices: ['Approve risk tier and authority boundary', 'Leave all access open', 'Treat as branding'] },
      { id: 'metrics', left: 'Workflow metrics', correct: 'Require outcome, quality, and adoption measures', choices: ['Require outcome, quality, and adoption measures', 'Count demos only', 'Measure nothing'] },
    ],
    options: [
      { id: 'match', label: 'Match tooling topics to executive oversight.', score: 98, feedback: 'Correct. Leaders do not need to do every task, but they own the oversight frame.' },
    ],
  },
  {
    id: 'EXEC-D1-002',
    domain: 'D1',
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'single',
    context: 'A team proposes using model memory to answer questions about current internal policy because the model sounds fluent.',
    prompt: 'Which architecture should the executive sponsor prefer?',
    options: [
      { id: 'a', label: 'Model memory only, because the output is fluent.', score: 15, feedback: 'Fluency does not ensure current policy accuracy.' },
      { id: 'b', label: 'Retrieval from approved policy sources with citations, access controls, and review for high-impact advice.', score: 98, feedback: 'Correct. Current internal knowledge needs grounding and controls.' },
      { id: 'c', label: 'Ask employees to paste policy text into public tools.', score: 20, feedback: 'This creates privacy and consistency risk.' },
      { id: 'd', label: 'Ban all policy questions from AI forever.', score: 35, feedback: 'A governed architecture can support safe use.' },
    ],
  },
  {
    id: 'EXEC-D4-018',
    domain: 'D4',
    difficulty: 'proficient',
    type: 'drag-order',
    interaction: 'rank',
    context: 'An AI tool recommends an operational safety action that could affect employees and customers.',
    prompt: 'Drag or reorder the safety-critical control sequence.',
    rankItems: [
      { id: 'classify', label: 'Classify the use case as safety-critical' },
      { id: 'authority', label: 'Assign human authority and fail-safe boundary' },
      { id: 'validate', label: 'Validate performance under edge cases' },
      { id: 'monitor', label: 'Monitor incidents and suspend when thresholds are crossed' },
    ],
    idealOrder: ['classify', 'authority', 'validate', 'monitor'],
    options: [
      { id: 'rank', label: 'Order safety controls from classification to monitoring.', score: 98, feedback: 'Correct. Safety-critical AI requires staged controls.' },
    ],
  },
  {
    id: 'EXEC-D2-A2A-019',
    domain: 'D2',
    difficulty: 'proficient',
    type: 'matching',
    interaction: 'match',
    context: 'A bank wants a customer-service agent, fraud agent, and compliance agent to exchange task status across vendor platforms.',
    visualStimulus: {
      kind: 'dashboard',
      eyebrow: 'A2A operating model',
      title: 'Cross-Vendor Agent Handoff',
      caption: 'Interoperability creates value only when identity, authority, and evidence travel with the task.',
      points: ['Customer agent: opens case', 'Fraud agent: flags transaction', 'Compliance agent: requires rationale', 'Human: approves account action'],
      flags: ['Authenticated agent identity', 'Policy-bound handoff', 'Shared audit trail'],
    },
    prompt: 'Match each cross-agent risk to the executive control.',
    matchPairs: [
      { id: 'spoof', left: 'Agent identity can be spoofed', correct: 'Authenticate agent and system identity', choices: ['Authenticate agent and system identity', 'Use a nicer dashboard', 'Remove human review'] },
      { id: 'scope', left: 'Agent exceeds allowed authority', correct: 'Policy-bound permissions and approval gates', choices: ['Policy-bound permissions and approval gates', 'Unlimited automation', 'No thresholds'] },
      { id: 'audit', left: 'No record of the handoff', correct: 'Cross-agent audit log and rationale', choices: ['Cross-agent audit log and rationale', 'Private verbal update', 'Delete traces'] },
    ],
    options: [
      { id: 'match', label: 'Match A2A risks to controls.', score: 98, feedback: 'Correct. A2A needs trust, authority boundaries, and auditable state.' },
    ],
  },
  {
    id: 'EXEC-D6-LOOP-019',
    domain: 'D6',
    difficulty: 'applied',
    type: 'drag-order',
    interaction: 'rank',
    context: 'A leadership team wants AI copilots to improve manager decision quality, but early pilots show inconsistent use and no learning loop.',
    stimulus: {
      src: '/stimuli/ai-pilot-workflow.svg',
      alt: 'Workflow artifact showing AI insertion points and a missing review loop.',
      label: 'Leadership loop artifact',
      caption: 'Use the workflow map to sequence a leadership learning loop.',
    },
    prompt: 'Order the executive loop-design steps.',
    rankItems: [
      { id: 'practice', label: 'Define the manager decision moments where AI will assist' },
      { id: 'review', label: 'Set review criteria for quality, fairness, and escalation' },
      { id: 'coach', label: 'Coach managers using examples from real use' },
      { id: 'refresh', label: 'Refresh prompts, policies, and training from observed failures' },
    ],
    idealOrder: ['practice', 'review', 'coach', 'refresh'],
    options: [
      { id: 'rank', label: 'Order leadership loop steps.', score: 98, feedback: 'Correct. Capability improves when real use feeds coaching and updates.' },
    ],
  },
  {
    id: 'EXEC-D4-AGENT-020',
    domain: 'D4',
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'multi',
    context: 'An internal agent sent a supplier email, changed a CRM field, and requested finance approval before a manager reviewed the case.',
    stimulus: {
      src: '/stimuli/raw-agent-audit-log.svg',
      alt: 'Raw AI agent audit log showing broad file access, external email draft, CRM write, finance payment request, warnings, and missing approval.',
      label: 'Raw agent audit log',
      caption: 'Inspect the raw tool log before selecting the post-incident fixes.',
    },
    prompt: 'Select the post-incident fixes leadership should require.',
    correctOptionIds: ['a', 'b', 'c', 'd'],
    options: [
      { id: 'a', label: 'Least-privilege tool access by task.', score: 25, feedback: 'Access should be scoped to the job.' },
      { id: 'b', label: 'Human approval before external messages and finance triggers.', score: 25, feedback: 'High-impact actions need gates.' },
      { id: 'c', label: 'Action logs and rollback for system writes.', score: 25, feedback: 'Traceability and recovery are required.' },
      { id: 'd', label: 'Stop conditions for unusual or high-risk chains.', score: 25, feedback: 'Agents need bounded autonomy.' },
      { id: 'e', label: 'A more confident system prompt.', score: 0, feedback: 'Confidence does not control tool authority.' },
    ],
  },
  {
    id: 'EXEC-D5-TREND-021',
    domain: 'D5',
    difficulty: 'applied',
    type: 'scenario',
    interaction: 'single',
    context: 'A board member asks whether to fund an A2A agent program because competitors announced similar partnerships.',
    prompt: 'What decision frame should leadership use?',
    options: [
      { id: 'a', label: 'Fund it if competitors announced it first.', score: 20, feedback: 'Competitive pressure is a signal, not a business case.' },
      { id: 'b', label: 'Identify target workflows, measurable value, interoperability need, risk controls, and pilot evidence before funding.', score: 98, feedback: 'Correct. Trend response should become a disciplined portfolio decision.' },
      { id: 'c', label: 'Reject all agent programs until standards stop changing.', score: 35, feedback: 'Waiting forever can miss learning; pilot with controls.' },
      { id: 'd', label: 'Let the vendor pick the first business process.', score: 15, feedback: 'Business ownership should set priorities.' },
    ],
  },
  {
    id: 'EXEC-D3-FIN-022',
    domain: 'D3',
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'single',
    context: 'The CFO receives an AI-written board note blaming the margin miss on marketing overspend.',
    stimulus: {
      src: '/stimuli/raw-finance-variance-report.svg',
      alt: 'Raw finance variance report with marketing, cloud compute, support revenue, and one-time vendor credit lines.',
      label: 'Raw board finance packet',
      caption: 'Inspect the raw finance evidence before deciding what goes to the board.',
    },
    prompt: 'What should the executive require before the board note is sent?',
    options: [
      { id: 'a', label: 'A revised explanation covering compute, revenue, one-time credits, and uncertainty.', score: 98, feedback: 'Correct. Board evidence should reflect material drivers and limits.' },
      { id: 'b', label: 'A shorter story focused only on the easiest line item.', score: 20, feedback: 'Shorter is not better if it hides material causes.' },
      { id: 'c', label: 'A more confident conclusion using the same evidence.', score: 15, feedback: 'Confidence does not fix weak analysis.' },
      { id: 'd', label: 'A delay until every variance has a perfect answer.', score: 35, feedback: 'The board needs a calibrated view, not false certainty or paralysis.' },
    ],
  },
  {
    id: 'EXEC-D4-PEOPLE-023',
    domain: 'D4',
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'multi',
    context: 'The CHRO asks whether an AI candidate-ranking pilot is ready for broader deployment.',
    stimulus: {
      src: '/stimuli/raw-hr-candidate-packet.svg',
      alt: 'Raw candidate packet showing AI culture-fit recommendation, missing work sample, and stronger evidence for another candidate.',
      label: 'Raw hiring evidence',
      caption: 'Inspect whether the AI recommendation uses job-relevant evidence and fair process.',
    },
    prompt: 'Which governance gates should leadership require before scaling?',
    correctOptionIds: ['a', 'b', 'c', 'd'],
    options: [
      { id: 'a', label: 'Define job-relevant criteria and remove proxy language.', score: 25, feedback: 'Correct. Screening criteria must be evidence-based.' },
      { id: 'b', label: 'Audit outcomes for bias and adverse impact.', score: 25, feedback: 'Correct. People decisions need fairness monitoring.' },
      { id: 'c', label: 'Require human review before candidate advancement.', score: 25, feedback: 'Correct. AI should not own high-impact employment decisions.' },
      { id: 'd', label: 'Keep appeal and documentation records.', score: 25, feedback: 'Correct. Process evidence supports accountability.' },
      { id: 'e', label: 'Scale quickly because culture fit is easy to automate.', score: 0, feedback: 'Culture-fit automation is a known risk area.' },
    ],
  },
  {
    id: 'EXEC-D6-OPS-024',
    domain: 'D6',
    difficulty: 'applied',
    type: 'narrative',
    interaction: 'text',
    context: 'Operations leaders want to deploy AI-written customer replies, but the raw ticket shows the AI draft denied a valid duplicate-charge refund.',
    stimulus: {
      src: '/stimuli/realistic-support-ticket-ai-draft.png',
      alt: 'Customer support console showing duplicate-charge evidence, SLA warning, policy notes, reviewer notes, and a weak AI draft response.',
      label: 'Raw service-quality artifact',
      caption: 'Inspect the customer case before writing the leadership response.',
    },
    prompt: 'Write 2-4 sentences on the leadership control needed before rollout.',
    rubricCriteria: [
      { id: 'quality', label: 'Requires quality review on exception cases', keywords: ['quality', 'review', 'exception', 'refund'], points: 26 },
      { id: 'evidence', label: 'Uses logs and policy evidence', keywords: ['log', 'policy', 'evidence', 'duplicate'], points: 24 },
      { id: 'human', label: 'Defines human escalation or approval', keywords: ['human', 'approval', 'escalation', 'agent'], points: 24 },
      { id: 'learning', label: 'Creates a learning loop before scale', keywords: ['pilot', 'monitor', 'learn', 'loop', 'measure'], points: 24 },
    ],
    exemplarAnswer: 'Leadership should not roll out autonomous denials yet. Exception cases need human review using the payment log and policy evidence. The pilot should monitor refund accuracy, escalation quality, and customer impact before scaling.',
    options: [],
  },
  {
    id: 'EXEC-EXP-D1-CAL-001',
    domain: 'D1',
    difficulty: 'awareness',
    type: 'matching',
    interaction: 'match',
    context: 'A board member uses chatbot, copilot, workflow automation, and agent interchangeably while discussing new AI spend.',
    prompt: 'Match each term to the capability boundary leadership should understand.',
    matchPairs: [
      { id: 'chatbot', left: 'Chatbot', correct: 'Responds conversationally without owning system actions', choices: ['Responds conversationally without owning system actions', 'Executes multi-system tasks with delegated authority', 'Runs fixed rules without language understanding'] },
      { id: 'copilot', left: 'Copilot', correct: 'Assists a human inside an existing work step', choices: ['Assists a human inside an existing work step', 'Approves exceptions without review', 'Sets strategy from market signals alone'] },
      { id: 'automation', left: 'Workflow automation', correct: 'Runs predefined steps when conditions are met', choices: ['Runs predefined steps when conditions are met', 'Negotiates policy tradeoffs independently', 'Creates training data from every prompt'] },
      { id: 'agent', left: 'AI agent', correct: 'Plans and uses tools toward a goal within authority limits', choices: ['Plans and uses tools toward a goal within authority limits', 'Only summarizes documents after upload', 'Cannot affect records or communications'] },
    ],
    options: [
      { id: 'match', label: 'Match AI patterns to capability boundaries.', score: 98, feedback: 'Correct. Executive risk and value depend on the difference between advice, assistance, automation, and delegated tool use.' },
    ],
  },
  {
    id: 'MULTI-CONCEPT-EXEC-001',
    domain: 'D1',
    secondaryDomains: ['D2', 'D4', 'D5'],
    difficulty: 'proficient',
    type: 'concept-cluster',
    interaction: 'parts',
    context: 'An executive committee is deciding whether the next AI platform should use RAG, memory, MCP-style connectors, and agents for policy, finance, and customer workflows.',
    stimulus: {
      src: '/stimuli/ai-concept-workbench.svg',
      alt: 'Concept workbench defining LLM, RAG, MCP tools, prompt, context, and memory with leadership risks to watch for.',
      label: 'Executive concept workbench',
      caption: 'Answer each mini-part. The item updates architecture, tooling, governance, and value signals.',
    },
    prompt: 'Answer the mini-parts to show executive fluency across AI architecture and operating risk.',
    parts: [
      {
        id: 'architecture',
        domain: 'D1',
        prompt: 'Which distinction should leaders understand before approving an AI knowledge assistant?',
        correctOptionId: 'a',
        options: [
          { id: 'a', label: 'LLM fluency, RAG grounding, and memory retention solve different problems.', score: 98, feedback: 'Correct. These are different capabilities with different risks.' },
          { id: 'b', label: 'A fluent answer means the system used approved company sources.', score: 20, feedback: 'Fluency alone does not prove source grounding.' },
          { id: 'c', label: 'Memory should replace document retrieval for current policy.', score: 25, feedback: 'Memory is not an authoritative policy source.' },
        ],
      },
      {
        id: 'tooling',
        domain: 'D2',
        prompt: 'What makes MCP/tool connectors strategically different from ordinary chat?',
        correctOptionId: 'b',
        options: [
          { id: 'a', label: 'They mainly improve tone and writing style.', score: 25, feedback: 'Connectors can affect data and actions, not only style.' },
          { id: 'b', label: 'They let AI reach systems, files, and workflows under defined authority.', score: 98, feedback: 'Correct. Tooling changes operating capability.' },
          { id: 'c', label: 'They remove the need to map business workflows.', score: 20, feedback: 'Workflow mapping becomes more important.' },
        ],
      },
      {
        id: 'governance',
        domain: 'D4',
        prompt: 'What must exist before agents can trigger external messages or financial actions?',
        correctOptionId: 'c',
        options: [
          { id: 'a', label: 'A polished demo and a confident executive sponsor.', score: 20, feedback: 'Sponsorship does not replace controls.' },
          { id: 'b', label: 'A longer system prompt describing good behavior.', score: 35, feedback: 'Prompting helps, but cannot carry authority control alone.' },
          { id: 'c', label: 'Scoped permissions, approvals, logs, rollback, and named owners.', score: 98, feedback: 'Correct. Agent authority requires operational governance.' },
        ],
      },
      {
        id: 'value',
        domain: 'D5',
        prompt: 'How should leadership decide whether these concepts justify investment?',
        correctOptionId: 'a',
        options: [
          { id: 'a', label: 'Tie capability choices to workflows, value metrics, risk, and adoption evidence.', score: 98, feedback: 'Correct. Technology choices need business evidence.' },
          { id: 'b', label: 'Fund every concept equally to show the company is AI-forward.', score: 25, feedback: 'Breadth without prioritization weakens learning and value.' },
          { id: 'c', label: 'Wait until the market picks one final architecture.', score: 40, feedback: 'A controlled pilot can learn before standards settle.' },
        ],
      },
    ],
    options: [],
  },
  {
    id: 'EXEC-EXP-D2-CAL-002',
    domain: 'D2',
    difficulty: 'applied',
    type: 'scenario',
    interaction: 'single',
    context: 'A division wants every manager to use a general chatbot for budget narratives, hiring justifications, and customer escalations next month.',
    prompt: 'Which rollout plan is most practical without overstating what the tool can do?',
    options: [
      { id: 'a', label: 'Start with documented workflows, data rules, example prompts, review, and feedback.', score: 96, feedback: 'Correct. This builds skill while respecting data, judgment, and workflow fit.' },
      { id: 'b', label: 'Give everyone access and compare output volume after thirty days.', score: 42, feedback: 'Usage alone does not show quality, risk, or business value.' },
      { id: 'c', label: 'Require the chatbot to make first-round management decisions.', score: 14, feedback: 'That assigns judgment and accountability to the wrong place.' },
      { id: 'd', label: 'Delay all adoption until every use case has a custom model.', score: 36, feedback: 'Some low-risk workflows can be learned from before custom investment.' },
    ],
  },
  {
    id: 'EXEC-EXP-D3-CAL-003',
    domain: 'D3',
    difficulty: 'applied',
    type: 'report-review',
    interaction: 'text',
    context: 'The strategy office circulates an AI-generated summary of a competitor announcement. It confidently infers pricing, margin impact, and customer churn risk, but the source memo only confirms a partnership launch.',
    prompt: 'Write 2-4 sentences explaining how an executive should treat the summary before using it in a decision.',
    rubricCriteria: [
      { id: 'distinguish', label: 'Separates sourced facts from AI inference', keywords: ['fact', 'source', 'evidence', 'inference', 'assumption'], points: 28 },
      { id: 'verify', label: 'Calls for verification of unsupported claims', keywords: ['verify', 'validate', 'confirm', 'check', 'corroborate'], points: 24 },
      { id: 'decision', label: 'Limits decision use until confidence improves', keywords: ['decision', 'board', 'investment', 'before using', 'not rely'], points: 24 },
      { id: 'followup', label: 'Asks for missing market or financial evidence', keywords: ['pricing', 'margin', 'churn', 'customer', 'financial'], points: 22 },
    ],
    exemplarAnswer: 'The summary should be split into confirmed facts and unsupported inference. The partnership launch may be real, but pricing, margin, and churn claims need corroborating market or financial evidence before they influence a board decision.',
    options: [],
  },
  {
    id: 'EXEC-EXP-D4-GOV-004',
    domain: 'D4',
    difficulty: 'proficient',
    type: 'report-review',
    interaction: 'multi',
    context: 'The enterprise service agent risk log shows tool permissions for supplier email, CRM updates, refund workflows, and finance folders.',
    stimulus: {
      src: '/stimuli/executive/exec-exp-risk-log-agent-authority.svg',
      alt: 'Risk log showing AI agent authority across supplier email, CRM updates, refund workflows, and finance folder access.',
      label: 'Agent authority risk log',
      caption: 'Inspect the raw risk log before selecting executive controls.',
    },
    prompt: 'Select the controls leadership should require before expanding the agent.',
    correctOptionIds: ['a', 'b', 'c', 'd'],
    options: [
      { id: 'a', label: 'Convert high-impact actions into explicit approval gates.', score: 25, feedback: 'Correct. Email sends, refunds, and finance triggers need enforceable gates.' },
      { id: 'b', label: 'Scope each tool permission to the task and data minimum.', score: 25, feedback: 'Correct. Least privilege lowers blast radius.' },
      { id: 'c', label: 'Log rationale, inputs, outputs, owner, and rollback path.', score: 25, feedback: 'Correct. Audit and recovery must be designed into the workflow.' },
      { id: 'd', label: 'Assign a business owner for residual risk and exceptions.', score: 25, feedback: 'Correct. Ownership cannot be left to the model or vendor.' },
      { id: 'e', label: 'Keep the prompt unchanged because the log documents issues.', score: 0, feedback: 'Documentation alone does not constrain authority.' },
    ],
  },
  {
    id: 'EXEC-EXP-D4-VEND-005',
    domain: 'D4',
    difficulty: 'proficient',
    type: 'media',
    interaction: 'single',
    context: 'A vendor offers a discount if the company signs its enterprise GenAI platform terms before security redlines are complete.',
    stimulus: {
      src: '/stimuli/executive/exec-exp-vendor-memo-data-rights.svg',
      alt: 'Vendor memo with unresolved terms for model improvement, audit retention, support access, and subprocessors.',
      label: 'Vendor data-rights memo',
      caption: 'Review the memo before deciding whether the contract is ready for signature.',
    },
    prompt: 'What is the strongest executive response?',
    options: [
      { id: 'a', label: 'Sign now because the discount is time-limited.', score: 24, feedback: 'The discount does not resolve data rights, access, retention, or subprocessor risk.' },
      { id: 'b', label: 'Require redlines on training use, retention, access approval, and subprocessors.', score: 98, feedback: 'Correct. These terms define the operating risk, not just legal cleanup.' },
      { id: 'c', label: 'Approve only if the vendor provides a detailed feature roadmap.', score: 38, feedback: 'Roadmap detail is useful, but it does not settle the data and governance terms.' },
      { id: 'd', label: 'Reject it solely because vendor support access is possible.', score: 46, feedback: 'Support access may be acceptable with approval, logging, and scope controls.' },
    ],
  },
  {
    id: 'EXEC-EXP-D5-PORT-006',
    domain: 'D5',
    difficulty: 'proficient',
    type: 'drag-order',
    interaction: 'rank',
    context: 'The board packet asks whether to approve broad funding for AI programs with uneven readiness, incomplete baselines, and mixed risk profiles.',
    stimulus: {
      src: '/stimuli/executive/exec-exp-board-packet-scale-readiness.svg',
      alt: 'Board packet page showing AI scale readiness claims, evidence gaps, portfolio options, and unresolved decision gates.',
      label: 'AI scale-readiness board packet',
      caption: 'Use the packet to sequence an executive investment decision.',
    },
    prompt: 'Order the decision steps before full portfolio funding.',
    rankItems: [
      { id: 'outcomes', label: 'Define outcomes, baseline, cohort, and decision owner' },
      { id: 'readiness', label: 'Validate data readiness, integration effort, adoption, and fit' },
      { id: 'risk', label: 'Set controls, review gates, and stop conditions' },
      { id: 'funding', label: 'Release staged funding tied to evidence milestones' },
    ],
    idealOrder: ['outcomes', 'readiness', 'risk', 'funding'],
    options: [
      { id: 'rank', label: 'Order the investment gate steps.', score: 98, feedback: 'Correct. Strategy becomes executable when value evidence, readiness, risk, and funding gates are sequenced.' },
    ],
  },
  {
    id: 'EXEC-EXP-D5-VALUE-007',
    domain: 'D5',
    difficulty: 'applied',
    type: 'multi-select',
    interaction: 'multi',
    context: 'A CEO wants one AI KPI for the next board meeting. Teams propose hours saved, prompts sent, model accuracy, customer satisfaction, and risk exceptions.',
    prompt: 'Select the measures that together make a better executive AI value dashboard.',
    correctOptionIds: ['a', 'b', 'c', 'd'],
    options: [
      { id: 'a', label: 'Business outcome movement tied to a workflow baseline.', score: 25, feedback: 'Correct. Value needs an operating baseline.' },
      { id: 'b', label: 'Sustained adoption by roles expected to change behavior.', score: 25, feedback: 'Correct. Benefits depend on actual workflow adoption.' },
      { id: 'c', label: 'Quality, exception, and customer-impact measures.', score: 25, feedback: 'Correct. Productivity without quality can hide loss.' },
      { id: 'd', label: 'Risk events, overrides, and control failures by owner.', score: 25, feedback: 'Correct. Executive value reporting should include downside evidence.' },
      { id: 'e', label: 'Total prompt count because it is simple to collect.', score: 0, feedback: 'Prompt volume is an activity metric, not a value dashboard.' },
    ],
  },
  {
    id: 'EXEC-EXP-D6-LOOP-008',
    domain: 'D6',
    difficulty: 'proficient',
    type: 'narrative',
    interaction: 'text',
    context: 'The support AI incident timeline shows faster handling time but a denied valid refund, delayed escalation, and no assigned learning owner.',
    stimulus: {
      src: '/stimuli/executive/exec-exp-incident-timeline-support-ai.svg',
      alt: 'Incident timeline showing AI support refund denial, batch approval, escalation, weak monitoring, and missing learning owner.',
      label: 'AI support incident timeline',
      caption: 'Review the timeline before writing the operating response.',
    },
    prompt: 'Write 2-4 sentences on how leadership should redesign the human-AI loop before rollout.',
    rubricCriteria: [
      { id: 'exception', label: 'Requires human review for high-impact exceptions', keywords: ['human', 'review', 'approval', 'exception', 'refund'], points: 28 },
      { id: 'evidence', label: 'Ties confidence to source evidence and policy checks', keywords: ['evidence', 'policy', 'confidence', 'source', 'ledger'], points: 24 },
      { id: 'monitoring', label: 'Adds monitoring for quality and customer harm', keywords: ['monitor', 'quality', 'harm', 'defect', 'customer'], points: 22 },
      { id: 'learning', label: 'Assigns an owner for coaching and workflow updates', keywords: ['owner', 'coaching', 'learning', 'update', 'retro'], points: 24 },
    ],
    exemplarAnswer: 'Leadership should keep the speed gains but require human review for refund exceptions and tie AI confidence to payment evidence and policy checks. The dashboard should segment quality defects and customer harm, and a named owner should use incidents to update prompts, coaching, and escalation rules before rollout.',
    options: [],
  },
  {
    id: 'EXEC-EXP-D2-AGENT-009',
    domain: 'D2',
    secondaryDomains: ['D4', 'D5'],
    difficulty: 'proficient',
    type: 'concept-cluster',
    interaction: 'parts',
    functionTracks: ['operations', 'technical', 'finance'],
    context: 'The executive team is reviewing an agent workflow that can read customer records, issue small refunds, send messages, and update CRM.',
    stimulus: {
      src: '/stimuli/realistic-agent-workflow-builder.png',
      alt: 'Workflow builder screenshot showing a refund-response agent with broad permissions, missing approval gate, partial audit log, and no rollback owner.',
      label: 'Executive agent workflow review',
      caption: 'Each mini-part tests a different executive readiness signal: tooling, governance, and value realization.',
    },
    prompt: 'Answer the mini-parts before approving the agent workflow for a live pilot.',
    parts: [
      {
        id: 'tool-authority',
        domain: 'D2',
        prompt: 'What makes this agent materially different from an ordinary chatbot?',
        correctOptionId: 'b',
        options: [
          { id: 'a', label: 'It writes in a friendlier customer-service tone.', score: 30, feedback: 'Tone is secondary. The artifact shows real tool authority.' },
          { id: 'b', label: 'It can act in systems: payments, CRM, email, and documents.', score: 98, feedback: 'Correct. System action changes operational risk and value.' },
          { id: 'c', label: 'It removes the need for customer-service policy.', score: 15, feedback: 'Policy becomes more important when actions are automated.' },
        ],
      },
      {
        id: 'control-gap',
        domain: 'D4',
        prompt: 'Which unresolved control should block expansion?',
        correctOptionId: 'a',
        options: [
          { id: 'a', label: 'Broad CRM write access and customer email sends lack strong approval and rollback ownership.', score: 98, feedback: 'Correct. Authority, logging, and ownership are not tight enough.' },
          { id: 'b', label: 'The workflow has too many human approval gates.', score: 25, feedback: 'The current gates are too narrow, not excessive.' },
          { id: 'c', label: 'The agent reads policy documents before answering.', score: 40, feedback: 'Policy retrieval is useful; the risk is weak control over actions.' },
        ],
      },
      {
        id: 'value-gate',
        domain: 'D5',
        prompt: 'Which evidence should leaders require before funding scale?',
        correctOptionId: 'c',
        options: [
          { id: 'a', label: 'Prompt volume and number of customer emails sent.', score: 24, feedback: 'Activity volume is not the same as value.' },
          { id: 'b', label: 'A vendor roadmap showing future agent features.', score: 34, feedback: 'Future features do not prove this workflow is ready.' },
          { id: 'c', label: 'Baseline comparison on speed, quality, harm, adoption, exceptions, and control failures.', score: 98, feedback: 'Correct. Scale decisions need benefit and downside evidence.' },
        ],
      },
    ],
    options: [],
  },
  {
    id: 'EXEC-EXP-D4-SOURCE-010',
    domain: 'D4',
    secondaryDomains: ['D1', 'D3'],
    difficulty: 'applied',
    type: 'multi-select',
    interaction: 'multi',
    functionTracks: ['people', 'technical', 'operations'],
    industryTracks: ['general', 'financial', 'healthcare', 'public', 'education'],
    context: 'A leadership team wants to publish internal guidance based on the policy source comparison packet.',
    stimulus: {
      src: '/stimuli/raw-rag-source-comparison.svg',
      alt: 'Source comparison packet showing policy source text and an assistant answer with unsupported public AI permissions.',
      label: 'Leadership policy guidance review',
      caption: 'Select the executive controls that turn a flawed AI answer into trustworthy guidance.',
    },
    prompt: 'Which controls should be required before publishing this as internal AI guidance?',
    correctOptionIds: ['a', 'b', 'd'],
    options: [
      { id: 'a', label: 'Require source-faithful language with citation, owner, and update date.', score: 34, feedback: 'Correct. Guidance needs traceable authority.' },
      { id: 'b', label: 'Separate low-risk drafting from work-record, customer, financial, health, and HR data use.', score: 33, feedback: 'Correct. The guidance must preserve data boundaries.' },
      { id: 'c', label: 'Approve it because the AI answer is concise and easy to understand.', score: 0, feedback: 'Clarity does not fix contradiction.' },
      { id: 'd', label: 'Route ambiguous cases to the approved enterprise assistant or policy owner.', score: 33, feedback: 'Correct. Escalation makes the guidance operational.' },
      { id: 'e', label: 'Remove the policy source so employees focus on the final answer.', score: 0, feedback: 'Removing source evidence weakens trust and auditability.' },
    ],
  },
];

const executiveAssessmentQuestionBank: Question[] = [
  ...executiveQuestionBank,
  ...advancedCompetencyQuestionBank,
];

const allAssessmentItems: Question[] = [
  ...questionBank,
  ...executiveQuestionBank,
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

const difficultyValue: Record<Difficulty, number> = { awareness: 0, applied: 1, proficient: 2, advanced: 3 };
const modeConfig: Record<AssessmentMode, { label: string; totalQuestions: number; confidenceBase: number; confidenceStep: number }> = {
  free: { label: 'Adaptive free assessment', totalQuestions: 12, confidenceBase: 38, confidenceStep: 4 },
  premium: { label: 'Premium diagnostic pilot', totalQuestions: 20, confidenceBase: 48, confidenceStep: 3 },
  executive: { label: 'Executive assessment pilot', totalQuestions: 20, confidenceBase: 54, confidenceStep: 3 },
  practice: { label: 'Practice activity', totalQuestions: 1, confidenceBase: 24, confidenceStep: 8 },
};
const executiveDomainTargets: Record<DomainId, number> = { D1: 1, D2: 1, D3: 2, D4: 4, D5: 4, D6: 4 };
const starterDomains: DomainId[] = ['D5', 'D4', 'D6', 'D3'];
const minimumExecutiveInteractions: Partial<Record<NonNullable<Question['interaction']>, number>> = { multi: 3, rank: 2, match: 2 };
const minimumGeneralInteractions: Partial<Record<NonNullable<Question['interaction']>, number>> = { multi: 2, rank: 1, match: 1, text: 1 };

function hasStrongEvidenceAtDifficulty(answers: Answer[], difficulty: Difficulty) {
  return answers.some((answer) => answer.question.difficulty === difficulty && answer.option.score >= 82);
}

function scoreToLevel(score: number, answers: Answer[]) {
  if (score >= 85 && hasStrongEvidenceAtDifficulty(answers, 'advanced')) return 'Advanced';
  if (score >= 70 && hasStrongEvidenceAtDifficulty(answers, 'proficient')) return 'Proficient';
  if (score >= 55) return 'Applied';
  if (score >= 40) return 'Developing';
  return 'Limited';
}

const audienceBenchmarks: Record<Audience, Record<DomainId, number>> = {
  general: { D1: 70, D2: 72, D3: 80, D4: 76, D5: 68, D6: 76 },
  student: { D1: 74, D2: 74, D3: 82, D4: 78, D5: 66, D6: 76 },
  educator: { D1: 76, D2: 74, D3: 84, D4: 84, D5: 70, D6: 84 },
  professional: { D1: 76, D2: 80, D3: 84, D4: 80, D5: 76, D6: 82 },
  team: { D1: 76, D2: 80, D3: 84, D4: 84, D5: 80, D6: 84 },
};

const functionBenchmarks: Record<FunctionTrack, Record<DomainId, number>> = {
  general: { D1: 74, D2: 78, D3: 82, D4: 80, D5: 76, D6: 80 },
  people: { D1: 74, D2: 74, D3: 82, D4: 88, D5: 76, D6: 88 },
  finance: { D1: 76, D2: 78, D3: 88, D4: 90, D5: 86, D6: 78 },
  marketing: { D1: 74, D2: 84, D3: 84, D4: 80, D5: 84, D6: 80 },
  sales: { D1: 74, D2: 84, D3: 86, D4: 80, D5: 86, D6: 84 },
  customerService: { D1: 72, D2: 82, D3: 84, D4: 84, D5: 78, D6: 88 },
  technical: { D1: 88, D2: 90, D3: 86, D4: 86, D5: 78, D6: 80 },
  operations: { D1: 74, D2: 84, D3: 82, D4: 84, D5: 84, D6: 82 },
};

const industryBenchmarks: Record<IndustryTrack, Record<DomainId, number>> = {
  general: { D1: 74, D2: 78, D3: 82, D4: 80, D5: 78, D6: 80 },
  education: { D1: 78, D2: 74, D3: 84, D4: 86, D5: 72, D6: 84 },
  financial: { D1: 78, D2: 80, D3: 90, D4: 92, D5: 86, D6: 80 },
  healthcare: { D1: 76, D2: 76, D3: 90, D4: 92, D5: 78, D6: 84 },
  retail: { D1: 74, D2: 84, D3: 82, D4: 82, D5: 84, D6: 80 },
  public: { D1: 76, D2: 74, D3: 86, D4: 92, D5: 80, D6: 86 },
};

const executiveBenchmarks: Record<ExecutiveRole, Record<DomainId, number>> = {
  ceo: { D1: 76, D2: 74, D3: 90, D4: 92, D5: 94, D6: 92 },
  board: { D1: 74, D2: 70, D3: 94, D4: 96, D5: 92, D6: 88 },
  people: { D1: 72, D2: 72, D3: 86, D4: 94, D5: 86, D6: 96 },
  finance: { D1: 74, D2: 76, D3: 94, D4: 96, D5: 92, D6: 82 },
  technology: { D1: 90, D2: 92, D3: 88, D4: 90, D5: 84, D6: 80 },
  transformation: { D1: 78, D2: 84, D3: 88, D4: 92, D5: 94, D6: 94 },
};

const targetEvidenceSources = [
  {
    label: 'UNESCO AI Competency Framework',
    url: 'https://www.unesco.org/en/articles/ai-competency-framework-students',
    detail: 'Supports D1, D3, D4, and D6 targets through human-centered mindset, ethics, AI techniques/applications, system design, and understand/apply/create progression.',
  },
  {
    label: 'NIST AI Risk Management Framework',
    url: 'https://airc.nist.gov/airmf-resources/airmf/5-sec-core/',
    detail: 'Supports higher D4 targets through Govern, Map, Measure, Manage, plus legal, accountability, human oversight, third-party risk, testing, and monitoring practices.',
  },
  {
    label: 'Microsoft Work Trend Index 2025',
    url: 'https://blogs.microsoft.com/blog/2025/04/23/the-2025-annual-work-trend-index-the-frontier-firm-is-born/',
    detail: 'Supports higher D2 and D6 targets for professionals and leaders through human-agent teams, agent management, workflow redesign, and reskilling expectations.',
  },
  {
    label: 'McKinsey State of AI 2025',
    url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai',
    detail: 'Supports higher D2, D5, and D6 targets for teams and executives because high performers redesign workflows, scale agents, and tie AI to growth and innovation.',
  },
  {
    label: 'WEF Future of Jobs 2025',
    url: 'https://www.weforum.org/publications/the-future-of-jobs-report-2025/in-full/3-skills-outlook/',
    detail: 'Supports targets for AI/big data, technological literacy, analytical thinking, leadership, resilience, curiosity, lifelong learning, and customer-service skills.',
  },
  {
    label: 'ETDA AI Readiness Measurement 2024',
    url: 'https://www.etda.or.th/th/pr-news/AI-Readiness-scan.aspx',
    detail: 'Anchors Thailand context: organizational AI readiness is improving but still at an AI-aware stage, so targets should be aspirational rather than described as Thai norms.',
  },
  {
    label: 'PwC Thailand Hopes and Fears 2025',
    url: 'https://www.pwc.com/th/en/research-and-insights/hopes-and-fears-2025-en.html',
    detail: 'Supports Thailand user context: AI use is broad but daily GenAI depth is still uneven, reinforcing the gap between current group averages and target readiness.',
  },
  {
    label: 'UNESCO Thailand AI Readiness Assessment 2025',
    url: 'https://www.unesco.org/en/articles/thailand-artificial-intelligence-readiness-assessment-report',
    detail: 'Supports D4 and D6 emphasis for public, executive, and organizational users through policy, coordination, governance, and capacity-development gaps.',
  },
];

function blendScores(scoreSets: Record<DomainId, number>[]) {
  const blended = {} as Record<DomainId, number>;
  (Object.keys(domains) as DomainId[]).forEach((domain) => {
    const weightedAverage = scoreSets.reduce((sum, scores) => sum + scores[domain], 0) / scoreSets.length;
    const strongestSignal = Math.max(...scoreSets.map((scores) => scores[domain]));
    blended[domain] = Math.round(weightedAverage + (strongestSignal - weightedAverage) * 0.65);
  });
  return blended;
}

function getBenchmarkProfiles(
  assessmentMode: AssessmentMode,
  audience: Audience,
  functionTrack: FunctionTrack,
  industryTrack: IndustryTrack,
  executiveRole: ExecutiveRole,
): BenchmarkProfile[] {
  if (assessmentMode === 'executive') {
    return [
      { label: `${executiveLabels[executiveRole]} target`, detail: 'Role-weighted executive target', tone: 'target', scores: executiveBenchmarks[executiveRole] },
    ];
  }
  if (assessmentMode === 'premium') {
    return [
      { label: 'Focused target', detail: `${functionLabels[functionTrack]} in ${industryLabels[industryTrack].toLowerCase()}`, tone: 'target', scores: blendScores([audienceBenchmarks.professional, functionBenchmarks[functionTrack], industryBenchmarks[industryTrack]]) },
    ];
  }
  return [
    { label: `${audienceLabels[audience]} target`, detail: 'Research-informed readiness target', tone: 'target', scores: audienceBenchmarks[audience] },
  ];
}

function getTargetScore(domain: DomainId, benchmarks: BenchmarkProfile[]) {
  return Math.max(...benchmarks.map((benchmark) => benchmark.scores[domain]));
}

function getImprovementBrief(scores: Record<DomainId, number>, benchmarks: BenchmarkProfile[], activeLearningCatalog: Record<DomainId, { title: string; detail: string; format: string }>) {
  const priorities = (Object.keys(domains) as DomainId[])
    .map((domain) => ({
      domain,
      score: scores[domain],
      target: getTargetScore(domain, benchmarks),
      gap: getTargetScore(domain, benchmarks) - scores[domain],
    }))
    .sort((left, right) => right.gap - left.gap)
    .slice(0, 3);

  return priorities.map(({ domain, score, target, gap }) => {
    const gapText = gap > 12 ? 'large gap' : gap > 5 ? 'moderate gap' : 'near target';
    return {
      domain,
      score,
      target,
      gapText,
      action: activeLearningCatalog[domain].detail,
    };
  });
}

function getGeneratedReport(
  assessmentMode: AssessmentMode,
  audience: Audience,
  functionTrack: FunctionTrack,
  industryTrack: IndustryTrack,
  executiveRole: ExecutiveRole,
  answers: Answer[],
  results: { domainScores: Record<DomainId, number>; overall: number; level: string; weakest: DomainId[]; strongest: DomainId[]; confidence: number },
  benchmarks: BenchmarkProfile[],
  coverage: CompetencyCoverage[],
  evidenceModeSummary: Array<{ mode: EvidenceMode; label: string; score: number; count: number }>,
  improvementBrief: Array<{ domain: DomainId; score: number; target: number; gapText: string; action: string }>,
  personalizedExploration: PersonalizedExplorationPlan,
  courseRecommendations: LearningRecommendation[],
): GeneratedReport {
  const contextLabel = assessmentMode === 'executive'
    ? executiveLabels[executiveRole]
    : assessmentMode === 'premium'
      ? `${functionLabels[functionTrack]} in ${industryLabels[industryTrack]}`
      : audienceLabels[audience];
  const strongest = results.strongest.map((domain) => `${domains[domain].short} (${results.domainScores[domain]})`).join(' and ');
  const weakest = results.weakest.map((domain) => `${domains[domain].short} (${results.domainScores[domain]})`).join(' and ');
  const targetProfile = benchmarks[0]?.label ?? 'research-informed target';
  const practicalEvidence = evidenceModeSummary.find((item) => item.mode === 'doing');
  const knowledgeEvidence = evidenceModeSummary.find((item) => item.mode === 'knowing');
  const priorityCompetencies = coverage
    .filter((competency) => competency.evidenceCount > 0)
    .sort((left, right) => left.score - right.score || left.evidenceCount - right.evidenceCount)
    .slice(0, 5);
  const unsampledPriority = coverage.filter((competency) => competency.priority && competency.evidenceCount === 0).slice(0, 3);
  const learningPath = [
    `Start with ${domains[results.weakest[0]].short}: ${improvementBrief[0]?.action ?? `build practical evidence in ${domains[results.weakest[0]].name}`}`,
    priorityCompetencies.length
      ? `Practice ${priorityCompetencies[0].label.toLowerCase()} using artifact review, written rationale, and feedback loops.`
      : 'Complete a longer diagnostic route to expose competency-level gaps before choosing advanced training.',
    `Use ${personalizedExploration.tools.slice(0, 2).join(' and ')} on one low-risk workflow, then compare the output against source evidence.`,
    courseRecommendations[0]
      ? `Take ${courseRecommendations[0].title} from ${courseRecommendations[0].provider} as the first structured course.`
      : 'Choose one starter course mapped to the weakest D1-D6 domains before retesting.',
    'Retake a targeted deep dive after 2-4 weeks and look for higher evidence counts, fewer overrides, and stronger practical scores.',
  ];

  return {
    headline: `${contextLabel} report: ${results.level} readiness with ${results.confidence}% pilot confidence`,
    summary: `This MVP-generated report reads ${answers.length} assessment response${answers.length === 1 ? '' : 's'} against the ${targetProfile} profile. Current strengths are ${strongest}; the highest-priority gaps are ${weakest}. The overall score is ${results.overall}/100, so the next step should be targeted practice rather than broad tool adoption.`,
    analysis: [
      `Domain pattern: ${strongest} are currently stronger signals, while ${weakest} need more evidence or remediation before the profile should be treated as stable.`,
      `Evidence mix: ${knowledgeEvidence?.count ?? 0} knowing signal${knowledgeEvidence?.count === 1 ? '' : 's'} at ${knowledgeEvidence?.count ? `${knowledgeEvidence.score}/100` : 'not sampled'} and ${practicalEvidence?.count ?? 0} doing signal${practicalEvidence?.count === 1 ? '' : 's'} at ${practicalEvidence?.count ? `${practicalEvidence.score}/100` : 'not sampled'}.`,
      priorityCompetencies.length
        ? `Competency risk: the lowest sampled competencies are ${priorityCompetencies.slice(0, 3).map((competency) => `${competency.label} (${competency.score})`).join(', ')}.`
        : 'Competency risk: the current run did not sample enough competency-specific evidence for stable sub-scores.',
      unsampledPriority.length
        ? `Coverage caution: ${unsampledPriority.map((competency) => competency.label).join(', ')} are role-priority areas with no direct evidence yet.`
        : 'Coverage note: role-priority competencies have at least some sampled evidence in this run.',
    ],
    priorityDomains: improvementBrief.map((item) => ({
      domain: item.domain,
      title: domains[item.domain].name,
      score: item.score,
      target: item.target,
      action: item.action,
    })),
    competencyFocus: priorityCompetencies.map((competency) => ({
      id: competency.id,
      label: competency.label,
      score: competency.score,
      evidenceCount: competency.evidenceCount,
      skills: competency.skills.slice(0, 4),
    })),
    learningPath,
    tools: personalizedExploration.tools,
    courses: courseRecommendations,
    productionNote: 'MVP mode does not call an external AI API or use a browser-side key. Production can replace this local report generator with a server-side AI report service and ask each app user to connect or enter their own provider API key.',
  };
}

const agentDefinitions: AgentDefinition[] = [
  {
    id: 'orchestrator',
    name: 'Orchestrator',
    role: 'Delegates work, monitors run state, checks approvals, and stops repeated loops.',
    cadence: 'Manual for MVP; scheduled daily or weekly in production.',
    guardrail: 'Max 8 workflow steps, max 3 repeated handoffs, every publish action stays in admin review.',
  },
  {
    id: 'concept-scout',
    name: 'AI Concepts Scout',
    role: 'Finds durable AI concepts, model capabilities, tooling patterns, and ontology updates.',
    cadence: 'Weekly concept refresh.',
    guardrail: 'Requires source freshness, duplicate check, and ontology mapping before drafting updates.',
  },
  {
    id: 'newsfeed',
    name: 'AI Newsfeed Agent',
    role: 'Builds short-lived AI Watch briefs from reputable current-news sources.',
    cadence: 'Daily or weekly based on admin setting.',
    guardrail: 'No publication without source, date, category, domain mapping, and review state.',
  },
  {
    id: 'course-scout',
    name: 'Training and Course Scout',
    role: 'Finds current AI courses, certificates, tutorials, tools, and learning resources for each domain and role.',
    cadence: 'Weekly catalog refresh, with manual runs before launches or major model releases.',
    guardrail: 'Requires provider/source, level, price, freshness, role fit, domain mapping, and admin approval before recommendation.',
  },
  {
    id: 'item-generator',
    name: 'Assessment Item Generator',
    role: 'Drafts new assessment questions and maps each draft to D1-D6 competencies and evidence modes.',
    cadence: 'Manual batch for MVP; scheduled after content review process is stable.',
    guardrail: 'No new ownership-choice cards; prioritize artifact review, matching, rank, multi-select, and written response formats.',
  },
  {
    id: 'feedback-analysis',
    name: 'Feedback Analysis Agent',
    role: 'Analyzes survey themes, free-text suggestions, abandonment, continuation choices, and confusing-item signals before recommending platform edits.',
    cadence: 'Runs after every feedback batch and before scored content or survey changes are proposed.',
    guardrail: 'Produces evidence-backed suggestions only; humans approve changes to questions, artifacts, profile fields, surveys, and scoring.',
  },
  {
    id: 'reviewer',
    name: 'Reviewer and QA Agent',
    role: 'Checks quality, duplicates, answerability, source notes, competency mapping, and publish readiness.',
    cadence: 'Runs after every draft batch.',
    guardrail: 'Rejects duplicates, weak distractors, ungrounded claims, and any stuck-loop output.',
  },
];

function getAgentWorkflowReport(itemCount: number, artifactItemCount: number, signalCount: number): AgentWorkflowReport {
  const runId = `agent-run-${new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '')}`;
  const activityLog: AgentActivity[] = [
    {
      step: 1,
      agent: 'Orchestrator',
      status: 'running',
      activity: 'Started manual MVP simulation with safety cut enabled.',
      output: 'Run budget set to 9 steps, duplicate threshold set to 2 repeated drafts, publish target set to admin review only.',
    },
    {
      step: 2,
      agent: 'AI Concepts Scout',
      status: 'complete',
      activity: 'Scanned simulated concept queue for durable AI literacy updates.',
      output: '3 concept candidates drafted: agent identity, RAG evaluation drift, and tool-permission boundaries.',
    },
    {
      step: 3,
      agent: 'AI Newsfeed Agent',
      status: 'review',
      activity: 'Prepared short-lived AI Watch brief candidates from the simulated news queue.',
      output: '4 news briefs routed to review with domain tags for D1, D2, D4, and D6.',
    },
    {
      step: 4,
      agent: 'Training and Course Scout',
      status: 'review',
      activity: 'Simulated a learning-catalog crawl for current AI training and online course options.',
      output: '7 course/tool candidates routed to review with D1-D6, role fit, level, price, and freshness notes.',
    },
    {
      step: 5,
      agent: 'Assessment Item Generator',
      status: 'running',
      activity: 'Generated competency-depth item drafts from concept, news, and training-gap outputs.',
      output: '6 draft items created across D1-D6 using matching, report-review, fraud review, rank/order, and written-response formats.',
    },
    {
      step: 6,
      agent: 'Assessment Item Generator',
      status: 'blocked',
      activity: 'Repeated a similar agent-boundary item twice while trying to fill the D2 queue.',
      output: 'Safety cut stopped the loop and moved the duplicate draft to rejected state.',
    },
    {
      step: 7,
      agent: 'Feedback Analysis Agent',
      status: 'review',
      activity: 'Grouped survey feedback and behavior signals into review themes before recommending edits.',
      output: 'Themes prepared for unclear wording, artifact realism, route length, continuation value, and missing profile signals.',
    },
    {
      step: 8,
      agent: 'Reviewer and QA Agent',
      status: 'complete',
      activity: 'Reviewed all draft outputs for novelty, competency fit, and MVP policy constraints.',
      output: '5 item drafts and 6 learning resources passed to admin review, 1 duplicate rejected, 0 ownership-choice cards added.',
    },
    {
      step: 9,
      agent: 'Orchestrator',
      status: 'complete',
      activity: 'Closed the run and produced an activity report.',
      output: 'Manual run completed with item, news, concept, and learning-resource review queues populated and no production publishing.',
    },
  ];
  return {
    generatedAt: new Date().toLocaleString(),
    runId,
    headline: 'Agent workflow simulation: completed with one safety cut',
    summary: `The MVP agent group completed a supervised dry run against the current prototype bank of ${itemCount} items, including ${artifactItemCount} artifact-backed items and ${signalCount} saved question signals. The run produced concept, news, training/course, and assessment-item drafts, then stopped one duplicate generation loop before it could pollute the question bank.`,
    agents: agentDefinitions.map((agent) => {
      const latest = [...activityLog].reverse().find((entry) => entry.agent === agent.name);
      const outputCount = activityLog.filter((entry) => entry.agent === agent.name).length;
      return { ...agent, status: latest?.status ?? 'idle', outputCount };
    }),
    activityLog,
    safetyEvents: [
      'Safety cut triggered when the item generator repeated a near-duplicate D2 agent-boundary draft twice.',
      'The duplicate output was rejected instead of published or recycled into another generation step.',
      'The run stopped below the 9-step workflow ceiling and did not call an external AI API.',
    ],
    outputs: [
      '3 durable AI concept drafts for ontology review.',
      '4 AI Watch news brief drafts for admin review.',
      '6 training and online-course recommendations ready for learning-catalog review.',
      '5 assessment item drafts ready for human QA across D1-D6.',
      '1 rejected duplicate draft with reason: repeated concept, low novelty, already covered by existing agent-permission artifact.',
    ],
    recommendations: [
      'Keep manual admin-triggered runs for MVP until persistent queues and database-backed draft states exist.',
      'Add production run storage for agent steps, artifacts, rejected drafts, costs, and reviewer decisions.',
      'Give the course scout an allow-list of trusted providers and require pricing, level, update date, and outcome mapping before recommendation.',
      'Require human approval before concept, news, or assessment-item drafts become visible to learners.',
      'Use server-side provider keys only in production; keep browser code free of AI API secrets.',
    ],
    productionNote: 'This is a local deterministic simulation that demonstrates orchestration behavior, reporting, and loop safety. Production should replace the simulator with scheduled cloud jobs, durable state, admin approvals, source connectors, and server-side AI provider adapters.',
  };
}

function getSupervisedAgentRun(
  itemCount: number,
  artifactItemCount: number,
  behaviorEvents: AssessmentBehaviorEvent[],
  feedback: AssessmentFeedbackSurvey[],
  profileSignals: ProfileSignalLogEntry[],
): SupervisedAgentRun {
  const quality = getQualityImprovementInsights(behaviorEvents, feedback);
  const runId = `agent-run-${new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '')}`;
  const poorArtifactCount = feedback.filter((entry) => entry.artifactQuality === 'poor' || entry.artifactQuality === 'mixed').length;
  const confusingQuestion = quality.questionRows[0];
  const recentProfileTags = [...new Set(profileSignals.flatMap((entry) => entry.profileTags ?? []))].slice(0, 8);
  const lowContinuation = quality.mandatory > 0 && Math.round((quality.continued / quality.mandatory) * 100) < 35;
  const drafts: AgentDraftProposal[] = [
    {
      id: `${runId}:question:${confusingQuestion?.questionId ?? 'coverage-gap'}`,
      kind: 'question',
      title: confusingQuestion ? `Rewrite or split ${confusingQuestion.questionId}` : 'Draft harder competency-depth questions for sparse signals',
      summary: confusingQuestion
        ? `Review the item because it shows ${confusingQuestion.confusionRate}% confusion, ${formatDuration(confusingQuestion.averageDurationMs)} average time, and ${confusingQuestion.averageScore}/100 average score.`
        : 'Generate new applied and advanced items where item-level evidence is still sparse.',
      rationale: 'Question drafts should improve discrimination by difficulty, evidence mode, domain, competency, and answerability before publication.',
      status: 'pending',
      sourceSignals: confusingQuestion
        ? [`${confusingQuestion.attempts} attempts`, `${confusingQuestion.confusionRate}% confusing`, `${formatDuration(confusingQuestion.averageDurationMs)} average duration`]
        : [`${itemCount} current items`, `${quality.questionRows.length} measured question rows`],
      ownerAgent: 'Assessment Item Generator',
    },
    {
      id: `${runId}:artifact:replacement`,
      kind: 'artifact',
      title: poorArtifactCount ? 'Replace weak or unrealistic artifacts' : 'Prepare realistic artifact refresh briefs',
      summary: poorArtifactCount
        ? `${poorArtifactCount} survey response${poorArtifactCount === 1 ? '' : 's'} rated artifacts mixed or poor. Prioritize realistic documents with consistent evidence.`
        : `Maintain replacement briefs for ${artifactItemCount} artifact-backed items before scaling the bank.`,
      rationale: 'Artifact quality directly affects whether users are being tested on real AI judgment or on interpreting artificial-looking screenshots.',
      status: 'pending',
      sourceSignals: [`${artifactItemCount} artifact-backed items`, `${poorArtifactCount} mixed/poor artifact ratings`],
      ownerAgent: 'Reviewer and QA Agent',
    },
    {
      id: `${runId}:profile:ontology`,
      kind: 'profile',
      title: 'Update profile ontology from user signals',
      summary: recentProfileTags.length
        ? `Candidate profile tags to normalize: ${recentProfileTags.join(', ')}.`
        : 'No strong profile-tag cluster yet; keep collecting optional survey and behavior-derived signals.',
      rationale: 'Profile ontology updates help route creators, operators, executives, students, and technical users toward the questions that best separate their skill levels.',
      status: 'pending',
      sourceSignals: [`${profileSignals.length} profile snapshots`, `${recentProfileTags.length} distinct recent tags`],
      ownerAgent: 'AI Concepts Scout',
    },
    {
      id: `${runId}:survey:friction`,
      kind: 'survey',
      title: lowContinuation ? 'Revise continuation prompt and quick survey timing' : 'Tune optional survey prompts',
      summary: lowContinuation
        ? `Only ${Math.round((quality.continued / quality.mandatory) * 100)}% continued after mandatory questions. Test a clearer reason and role-specific benefit.`
        : 'Keep profile and feedback surveys short while collecting enough signal to personalize did-you-know prompts and deeper routes.',
      rationale: 'Survey prompts should collect better profile evidence without interrupting assessment flow or hiding the value exchange.',
      status: 'pending',
      sourceSignals: [`${quality.mandatory} mandatory completions`, `${quality.continued} continuations`, `${feedback.length} feedback surveys`],
      ownerAgent: 'Feedback Analysis Agent',
    },
    {
      id: `${runId}:feedback:themes`,
      kind: 'feedback',
      title: feedback.length ? 'Review feedback themes before changing the platform' : 'Wait for more survey responses before editing',
      summary: feedback.length
        ? `Analyze ${feedback.length} survey response${feedback.length === 1 ? '' : 's'} for repeated comments about clarity, difficulty, artifacts, length, and missing topics before any edit is made.`
        : 'No completed feedback survey is available yet. Keep collecting response-level evidence and do not change survey or scored content based on anecdotes alone.',
      rationale: 'Feedback analysis should summarize trends, affected users, evidence strength, and suggested next actions before admins approve platform changes.',
      status: 'pending',
      sourceSignals: [
        `${feedback.length} feedback surveys`,
        `${quality.confusingEvents} slow/confusing answer events`,
        `${poorArtifactCount} mixed/poor artifact ratings`,
      ],
      ownerAgent: 'Feedback Analysis Agent',
    },
    {
      id: `${runId}:learning:next-best`,
      kind: 'learning',
      title: 'Refresh learning recommendations for weak competencies',
      summary: 'Map weak domains, did-you-know clicks, and report-interest clicks to the next practice lab, course, or premium route.',
      rationale: 'Learning content should respond to demonstrated gaps and user curiosity, not just static domain labels.',
      status: 'pending',
      sourceSignals: [`${behaviorEvents.filter((event) => event.type === 'report_interest').length} report-interest clicks`, `${quality.started} started sessions`],
      ownerAgent: 'Training and Course Scout',
    },
    {
      id: `${runId}:news:watch`,
      kind: 'news',
      title: 'Prepare AI Watch brief candidates',
      summary: 'Draft role-relevant briefs for agents, multimodal media, RAG, benchmarks, governance, ROI, and human-AI collaboration.',
      rationale: 'AI Watch should keep assessment content aligned with market shifts while preserving source review and publish approval.',
      status: 'pending',
      sourceSignals: [`${recentProfileTags.length} profile interests`, `${behaviorEvents.length} behavior events`],
      ownerAgent: 'AI Newsfeed Agent',
    },
  ];
  const activityLog: AgentActivity[] = [
    {
      step: 1,
      agent: 'Orchestrator',
      status: 'running',
      activity: 'Opened a supervised local run and loaded telemetry, profile snapshots, feedback, and artifact counts.',
      output: `${behaviorEvents.length} behavior events, ${feedback.length} feedback surveys, ${profileSignals.length} profile snapshots loaded.`,
    },
    {
      step: 2,
      agent: 'Feedback Analysis Agent',
      status: 'review',
      activity: 'Analyzed survey themes, free-text suggestions, abandonment, and continuation behavior before platform edits.',
      output: feedback.length
        ? `${feedback.length} survey response${feedback.length === 1 ? '' : 's'} grouped for clarity, difficulty fit, artifact quality, length, and suggestions.`
        : 'No survey responses yet; recommended continued collection before changing survey or scored content.',
    },
    {
      step: 3,
      agent: 'Reviewer and QA Agent',
      status: 'review',
      activity: 'Ranked question and artifact candidates by confusion, duration, feedback quality, and evidence risk.',
      output: confusingQuestion ? `${confusingQuestion.questionId} is the top review candidate.` : 'No high-volume question candidate yet; generated coverage-gap task.',
    },
    {
      step: 4,
      agent: 'Assessment Item Generator',
      status: 'review',
      activity: 'Created draft tasks for better item discrimination and practical formats.',
      output: 'Drafts stay pending until an admin approves or rejects them.',
    },
    {
      step: 5,
      agent: 'AI Concepts Scout',
      status: 'review',
      activity: 'Mapped profile tags and trend interests into ontology-review candidates.',
      output: recentProfileTags.length ? `${recentProfileTags.length} profile tags included.` : 'No strong profile cluster available yet.',
    },
    {
      step: 6,
      agent: 'Orchestrator',
      status: 'complete',
      activity: 'Closed the run in review state with publish protection enabled.',
      output: `${drafts.length} draft proposals created; 0 published automatically.`,
    },
  ];
  return {
    id: runId,
    createdAt: new Date().toISOString(),
    status: 'review',
    headline: 'Supervised agent run ready for admin review',
    summary: `Generated ${drafts.length} reviewable proposals from ${behaviorEvents.length} behavior events, ${feedback.length} surveys, ${profileSignals.length} profile snapshots, ${itemCount} items, and ${artifactItemCount} artifact-backed items.`,
    activityLog,
    drafts,
    safetyEvents: [
      'Publish protection enabled: no scored item, profile field, survey, artifact, course, or news brief changes without approval.',
      'Survey feedback and behavior trends are analyzed before draft proposals can become platform edits.',
      'Drafts preserve source signals so admins can see why each proposal exists.',
      'Rejected drafts remain in the run history to prevent repeated low-quality loops.',
    ],
  };
}

const fullStackDeveloperReport: DeveloperReportDemo = {
  profile: 'Full-stack developer',
  generatedAt: '2026-09-01',
  overall: 76,
  level: 'Applied',
  confidence: 88,
  scores: {
    D1: 78,
    D2: 86,
    D3: 72,
    D4: 63,
    D5: 70,
    D6: 80,
  },
  benchmarks: [
    {
      label: 'Technical peer average',
      detail: 'Example benchmark for full-stack developer pilots',
      tone: 'peer',
      scores: { D1: 72, D2: 74, D3: 66, D4: 58, D5: 61, D6: 69 },
    },
    {
      label: 'Production-ready developer target',
      detail: 'Research-informed target for AI-assisted product engineering',
      tone: 'target',
      scores: { D1: 82, D2: 88, D3: 84, D4: 82, D5: 78, D6: 84 },
    },
  ],
  interpretation: [
    'This developer is already productive with AI-assisted software work. D2 and D6 show strong practical use of AI tools, iterative collaboration, debugging support, implementation planning, and documentation support.',
    'The primary risk is that tool fluency is ahead of production governance. D4 trails the target because the simulated user under-weighted data exposure, agent permissions, audit logs, vendor terms, and escalation design.',
    'D3 is the next leverage point. Advanced AI engineering work increasingly depends on source evaluation, RAG quality checks, benchmark relevance, hallucinated API detection, and testable confidence rather than model enthusiasm.',
  ],
  strengths: [
    'Applies AI tools to coding and workflow acceleration.',
    'Structures prompts with context, constraints, and expected output.',
    'Collaborates iteratively with AI during debugging and implementation.',
    'Translates AI outputs into usable developer artifacts.',
  ],
  gaps: [
    'Evaluate RAG/source quality before trusting generated answers.',
    'Design agent permission boundaries and audit logs.',
    'Separate demo success from production reliability.',
    'Test AI-generated code for security, accessibility, maintainability, and hidden behavior changes.',
  ],
  learningPath: [
    {
      phase: 'Phase 1',
      title: 'Tighten AI-assisted engineering discipline',
      actions: [
        'Create a repeatable prompt pattern for code generation: context, repo conventions, acceptance tests, edge cases, and review criteria.',
        'Use AI to generate tests before implementation, then ask it to critique its own assumptions.',
        'Create an AI code-review checklist covering security, typing, accessibility, performance, dependency risk, and behavior changes.',
      ],
    },
    {
      phase: 'Phase 2',
      title: 'Build evaluation muscle',
      actions: [
        'Practice RAG/source comparison tasks with freshness, citation support, missing-source detection, and unsupported claims.',
        'Create a small eval set for one app feature: golden answers, failure cases, expected citations, and regression checks.',
        'Compare at least two model/tool setups on the same technical task and record where each fails.',
      ],
    },
    {
      phase: 'Phase 3',
      title: 'Design bounded agentic workflows',
      actions: [
        'Prototype issue triage, test generation, documentation refresh, or dependency review as a bounded agent workflow.',
        'Add read-only mode first, explicit approval before writes, action logs, retry ceilings, and rollback plans.',
        'Add loop safety: max steps, repeated-output detection, timeout, and human escalation.',
      ],
    },
    {
      phase: 'Phase 4',
      title: 'Move toward production readiness',
      actions: [
        'Keep provider keys server-side only with rotation, usage caps, and audit logs.',
        'Add observability for AI calls: cost, latency, failure rate, accepted suggestions, rejected suggestions, and quality outcomes.',
        'Document approved AI use patterns for the engineering team.',
      ],
    },
  ],
  courses: [
    {
      title: 'AI Code Review',
      provider: 'DeepLearning.AI',
      url: 'https://www.deeplearning.ai/courses/ai-code-review',
      fit: 'Immediate fit for AI-assisted pull requests and review-agent design.',
      domains: ['D2', 'D3', 'D4'],
    },
    {
      title: 'ChatGPT Prompt Engineering for Developers',
      provider: 'DeepLearning.AI',
      url: 'https://www.deeplearning.ai/courses/chatgpt-prompt-eng',
      fit: 'Good first course for structured prompting and developer task decomposition.',
      domains: ['D1', 'D2', 'D6'],
    },
    {
      title: 'Evaluating AI Agents',
      provider: 'DeepLearning.AI',
      url: 'https://www.deeplearning.ai/courses/evaluating-ai-agents',
      fit: 'Directly addresses agent testing, confidence, and repeated-failure risk.',
      domains: ['D3', 'D4', 'D5'],
    },
    {
      title: 'Agentic AI',
      provider: 'DeepLearning.AI',
      url: 'https://www.deeplearning.ai/courses/agentic-ai',
      fit: 'Useful for multi-step agent systems and workflow design.',
      domains: ['D2', 'D5', 'D6'],
    },
    {
      title: 'Advanced Retrieval for AI with Chroma',
      provider: 'DeepLearning.AI',
      url: 'https://www.deeplearning.ai/courses/advanced-retrieval-for-ai',
      fit: 'Best match for improving RAG evaluation and retrieval-aware development.',
      domains: ['D2', 'D3'],
    },
  ],
  tools: [
    { category: 'Coding assistants', items: ['ChatGPT', 'GitHub Copilot', 'Cursor', 'Windsurf', 'JetBrains AI'] },
    { category: 'Agent frameworks', items: ['OpenAI Agents SDK', 'LangGraph', 'CrewAI', 'Pydantic', 'Zod'] },
    { category: 'RAG and evals', items: ['Supabase pgvector', 'Chroma', 'RAGAS', 'promptfoo', 'custom golden-set tests'] },
    { category: 'Production guardrails', items: ['Sentry', 'PostHog', 'OpenTelemetry', 'GitHub Advanced Security', 'secrets manager'] },
  ],
  projects: [
    'Build an AI code-review assistant that summarizes diffs, suggests tests, and never approves its own changes.',
    'Build a RAG evaluator for internal docs with citation checks and hallucination examples.',
    'Build a bounded issue-triage agent with max steps, duplicate detection, audit logs, and human approval.',
    'Add an AI usage dashboard tracking cost, latency, failure rate, safety cuts, and quality outcomes.',
  ],
};

const scoreLogStorageKey = 'new-horizon-score-log-v1';
const profileIdStorageKey = 'new-horizon-local-profile-id-v1';
const profileSignalLogStorageKey = 'new-horizon-profile-signal-log-v1';
const behaviorLogStorageKey = 'new-horizon-behavior-log-v1';
const assessmentFeedbackStorageKey = 'new-horizon-assessment-feedback-v1';
const authProfileStorageKey = 'new-horizon-auth-profile-v1';
const profilePulseStorageKey = 'new-horizon-profile-pulse-v1';
const supervisedAgentRunsStorageKey = 'new-horizon-supervised-agent-runs-v1';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

function parseAuthProfile(value: string | null): AuthProfile | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as AuthProfile;
    return parsed?.id ? parsed : null;
  } catch {
    return null;
  }
}

function getAuthRedirectUrl() {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${window.location.pathname}`;
}

function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

async function fetchSupabaseUser(accessToken: string): Promise<AuthProfile | null> {
  if (!isSupabaseConfigured()) return null;
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) return null;
  const user = await response.json();
  const metadata = user.user_metadata ?? {};
  const identity = Array.isArray(user.identities) ? user.identities[0] : null;
  return {
    id: user.id,
    email: user.email,
    name: metadata.full_name ?? metadata.name ?? user.email,
    avatarUrl: metadata.avatar_url ?? metadata.picture,
    provider: identity?.provider ?? 'google',
    providerId: identity?.id,
    accessToken,
  };
}

async function syncUserProfileToSupabase(authProfile: AuthProfile | null, survey: UserProfileSurvey | null, localProfileId: string) {
  if (!authProfile?.accessToken || !isSupabaseConfigured()) return;
  try {
    await fetch(`${supabaseUrl}/rest/v1/user_profiles?on_conflict=id`, {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${authProfile.accessToken}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        id: authProfile.id,
        email: authProfile.email,
        name: authProfile.name,
        avatar_url: authProfile.avatarUrl,
        provider: authProfile.provider,
        provider_id: authProfile.providerId,
        local_profile_id: localProfileId,
        profile_context: survey?.context,
        profile_tags: survey?.tags ?? [],
        profile_survey: survey?.answers ?? {},
        updated_at: new Date().toISOString(),
      }),
    });
  } catch {
    // Keep the local MVP usable if backend tables or permissions are not ready yet.
  }
}

async function syncAssessmentSessionToSupabase(authProfile: AuthProfile | null, entry: ScoreLogEntry, signalEntry: ProfileSignalLogEntry) {
  if (!authProfile?.accessToken || !isSupabaseConfigured()) return;
  try {
    await fetch(`${supabaseUrl}/rest/v1/assessment_sessions?on_conflict=id`, {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${authProfile.accessToken}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        id: entry.id,
        user_id: authProfile.id,
        user_email: authProfile.email,
        group_key: entry.groupKey,
        group_label: entry.groupLabel,
        mode: entry.mode,
        audience: entry.audience,
        function_track: entry.functionTrack,
        industry_track: entry.industryTrack,
        executive_role: entry.executiveRole,
        domain_scores: entry.scores,
        competency_scores: entry.competencyScores,
        evidence_mode_scores: entry.evidenceModeScores,
        overall: entry.overall,
        profile_tags: signalEntry.profileTags,
        question_signals: signalEntry.questionSignals,
        created_at: entry.createdAt,
      }),
    });
  } catch {
    // Local logs remain the MVP source of truth until backend persistence is configured.
  }
}

async function syncBehaviorEventToSupabase(authProfile: AuthProfile | null, event: AssessmentBehaviorEvent) {
  if (!authProfile?.accessToken || !isSupabaseConfigured()) return;
  try {
    await fetch(`${supabaseUrl}/rest/v1/assessment_behavior_events`, {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${authProfile.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: event.id, user_id: authProfile.id, session_id: event.sessionId, profile_id: event.profileId, event_type: event.type, group_key: getScoreGroup(event.mode, event.audience ?? 'general', event.functionTrack ?? 'general', event.industryTrack ?? 'general', event.executiveRole ?? 'ceo').key, payload: event, created_at: event.createdAt }),
    });
  } catch {
    // Local event persistence remains available while production analytics is offline.
  }
}

async function syncAssessmentFeedbackToSupabase(authProfile: AuthProfile | null, entry: AssessmentFeedbackSurvey) {
  if (!authProfile?.accessToken || !isSupabaseConfigured()) return;
  try {
    await fetch(`${supabaseUrl}/rest/v1/assessment_feedback`, {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${authProfile.accessToken}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({ id: entry.id, user_id: authProfile.id, session_id: entry.sessionId, profile_id: entry.profileId, group_key: entry.groupKey, clarity: entry.clarity, difficulty_fit: entry.difficultyFit, artifact_quality: entry.artifactQuality, length_fit: entry.lengthFit, suggestions: entry.suggestions, created_at: entry.createdAt }),
    });
  } catch {
    // Keep feedback usable locally when the backend is unavailable.
  }
}

function startGoogleSignIn(setMessage: (message: string) => void) {
  if (!isSupabaseConfigured() || typeof window === 'undefined') {
    setMessage('Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable Google login.');
    return;
  }
  const redirectTo = encodeURIComponent(getAuthRedirectUrl());
  window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`;
}

async function sendEmailMagicLink(email: string, setMessage: (message: string) => void) {
  if (!isSupabaseConfigured()) {
    setMessage('Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable email login.');
    return;
  }
  if (!email.includes('@')) {
    setMessage('Enter a valid email address first.');
    return;
  }
  const response = await fetch(`${supabaseUrl}/auth/v1/otp`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      create_user: true,
      options: { email_redirect_to: getAuthRedirectUrl() },
    }),
  });
  setMessage(response.ok ? 'Check your email for the sign-in link.' : 'Email sign-in could not start. Check Supabase Auth settings.');
}

function getScoreGroup(
  assessmentMode: AssessmentMode,
  audience: Audience,
  functionTrack: FunctionTrack,
  industryTrack: IndustryTrack,
  executiveRole: ExecutiveRole,
) {
  if (assessmentMode === 'executive') {
    return {
      key: `executive:${executiveRole}`,
      label: `${executiveLabels[executiveRole]} group average`,
      detail: 'Average of saved executive runs on this device',
    };
  }
  if (assessmentMode === 'premium') {
    return {
      key: `premium:${functionTrack}:${industryTrack}`,
      label: `${functionLabels[functionTrack]} / ${industryLabels[industryTrack]} average`,
      detail: 'Average of saved premium runs on this device',
    };
  }
  if (assessmentMode === 'practice') {
    return {
      key: 'practice:activities',
      label: 'Practice activity average',
      detail: 'Average of saved practice activities on this device',
    };
  }
  return {
    key: `free:${audience}`,
    label: `${audienceLabels[audience]} average`,
    detail: 'Average of saved free runs on this device',
  };
}

function parseScoreLog(raw: string | null): ScoreLogEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is ScoreLogEntry => Boolean(entry?.id && entry?.groupKey && entry?.scores));
  } catch {
    return [];
  }
}

function parseSupervisedAgentRuns(raw: string | null): SupervisedAgentRun[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is SupervisedAgentRun => Boolean(entry?.id && entry?.drafts && entry?.activityLog));
  } catch {
    return [];
  }
}

function parseBehaviorLog(raw: string | null): AssessmentBehaviorEvent[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is AssessmentBehaviorEvent => Boolean(entry?.id && entry?.profileId && entry?.sessionId && entry?.type));
  } catch {
    return [];
  }
}

function parseAssessmentFeedback(raw: string | null): AssessmentFeedbackSurvey[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is AssessmentFeedbackSurvey => Boolean(entry?.id && entry?.sessionId && entry?.profileId));
  } catch {
    return [];
  }
}

function getPersonaLeaderboard(entries: ScoreLogEntry[], groupKey: string) {
  return entries
    .filter((entry) => entry.mode !== 'practice' && entry.groupKey === groupKey)
    .sort((left, right) => right.overall - left.overall || right.createdAt.localeCompare(left.createdAt))
    .slice(0, 10)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
      displayName: entry.userEmail?.split('@')[0] || `Assessment ${entry.id.slice(-5)}`,
    }));
}

const demoLandingLeaderboard: LandingLeaderboardRow[] = [
  { id: 'demo-creator-1', rank: 1, displayName: 'Creator profile', groupLabel: 'Marketing / Retail', overall: 94, strongestDomain: 'D3', createdAt: '2026-09-07T00:00:00.000Z', source: 'demo' },
  { id: 'demo-tech-1', rank: 2, displayName: 'Technical builder', groupLabel: 'Technical / General', overall: 91, strongestDomain: 'D2', createdAt: '2026-09-07T00:00:00.000Z', source: 'demo' },
  { id: 'demo-finance-1', rank: 3, displayName: 'Finance operator', groupLabel: 'Finance / Financial services', overall: 89, strongestDomain: 'D5', createdAt: '2026-09-07T00:00:00.000Z', source: 'demo' },
  { id: 'demo-board-1', rank: 4, displayName: 'Board readiness', groupLabel: 'Board member', overall: 87, strongestDomain: 'D4', createdAt: '2026-09-07T00:00:00.000Z', source: 'demo' },
  { id: 'demo-people-1', rank: 5, displayName: 'People leader', groupLabel: 'People / General', overall: 85, strongestDomain: 'D6', createdAt: '2026-09-07T00:00:00.000Z', source: 'demo' },
  { id: 'demo-sales-1', rank: 6, displayName: 'Sales workflow', groupLabel: 'Sales / Retail', overall: 83, strongestDomain: 'D5', createdAt: '2026-09-07T00:00:00.000Z', source: 'demo' },
  { id: 'demo-student-1', rank: 7, displayName: 'Student explorer', groupLabel: 'Student', overall: 81, strongestDomain: 'D1', createdAt: '2026-09-07T00:00:00.000Z', source: 'demo' },
  { id: 'demo-ops-1', rank: 8, displayName: 'Ops improver', groupLabel: 'Operations / General', overall: 79, strongestDomain: 'D2', createdAt: '2026-09-07T00:00:00.000Z', source: 'demo' },
  { id: 'demo-cs-1', rank: 9, displayName: 'Support pilot', groupLabel: 'Customer service / General', overall: 76, strongestDomain: 'D6', createdAt: '2026-09-07T00:00:00.000Z', source: 'demo' },
  { id: 'demo-general-1', rank: 10, displayName: 'General user', groupLabel: 'General user', overall: 73, strongestDomain: 'D3', createdAt: '2026-09-07T00:00:00.000Z', source: 'demo' },
];

function getLandingLeaderboard(entries: ScoreLogEntry[], period: LandingLeaderboardPeriod): LandingLeaderboardRow[] {
  const cutoffMs = new Date().getTime() - (period === 'day' ? 24 : 7 * 24) * 60 * 60 * 1000;
  const liveRows = entries
    .filter((entry) => entry.mode !== 'practice' && new Date(entry.createdAt).getTime() >= cutoffMs)
    .sort((left, right) => right.overall - left.overall || right.createdAt.localeCompare(left.createdAt))
    .slice(0, 10)
    .map((entry, index): LandingLeaderboardRow => {
      const strongestDomain = (Object.keys(entry.scores) as DomainId[])
        .sort((left, right) => entry.scores[right] - entry.scores[left])[0] ?? 'D1';
      return {
        id: entry.id,
        rank: index + 1,
        displayName: entry.userEmail?.split('@')[0] || `${entry.groupLabel.replace(/ average$/i, '')} run`,
        groupLabel: entry.groupLabel.replace(/ average$/i, ''),
        overall: entry.overall,
        strongestDomain,
        createdAt: entry.createdAt,
        source: 'local',
      };
    });
  const rows = liveRows.length >= 5 ? liveRows : [...liveRows, ...demoLandingLeaderboard].slice(0, 10);
  return rows.map((row, index) => ({ ...row, rank: index + 1 }));
}

function getLandingPeerInsights(entries: ScoreLogEntry[], rows: LandingLeaderboardRow[], period: LandingLeaderboardPeriod) {
  const liveCount = rows.filter((row) => row.source === 'local').length;
  const label = period === 'day' ? 'today' : 'this week';
  const average = rows.length ? Math.round(rows.reduce((sum, row) => sum + row.overall, 0) / rows.length) : 0;
  const topDomainCounts = rows.reduce((counts, row) => {
    counts[row.strongestDomain] = (counts[row.strongestDomain] ?? 0) + 1;
    return counts;
  }, {} as Record<DomainId, number>);
  const hottestDomain = (Object.keys(topDomainCounts) as DomainId[])
    .sort((left, right) => topDomainCounts[right] - topDomainCounts[left])[0] ?? 'D3';
  const groupCounts = rows.reduce((counts, row) => {
    counts[row.groupLabel] = (counts[row.groupLabel] ?? 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  const activeGroup = Object.keys(groupCounts).sort((left, right) => groupCounts[right] - groupCounts[left])[0] ?? 'No group yet';
  const localTop = entries.filter((entry) => entry.mode !== 'practice').sort((left, right) => right.overall - left.overall)[0];
  return [
    {
      label: liveCount ? 'Live peer signal' : 'Demo peer signal',
      value: liveCount ? `${liveCount}` : 'Pilot',
      detail: liveCount
        ? `${liveCount} local scored run${liveCount === 1 ? '' : 's'} in the ${label} leaderboard.`
        : 'Complete the test to replace demo rows with your peer cohort.',
    },
    {
      label: 'Score to chase',
      value: rows[0] ? `${rows[0].overall}` : '90+',
      detail: rows[0] ? `Current ${label} leader is strongest in ${rows[0].strongestDomain} ${domains[rows[0].strongestDomain].short}.` : 'Top scores require harder evidence, not only easy answers.',
    },
    {
      label: 'Hot skill trend',
      value: hottestDomain,
      detail: `${hottestDomain} ${domains[hottestDomain].short} is the most common strength among visible top runs.`,
    },
    {
      label: 'Active peer group',
      value: activeGroup,
      detail: localTop ? `Best local run so far: ${localTop.overall}/100.` : `Most visible ${label} cluster in the teaser board.`,
    },
    {
      label: 'Advanced gap',
      value: average >= 85 ? 'Narrow' : 'Open',
      detail: average >= 85
        ? 'The board is competitive; role-specific depth will matter.'
        : 'A strong targeted route can move a user into the visible top tier.',
    },
  ];
}

function getQuestionBenchmarks(events: AssessmentBehaviorEvent[]) {
  const groups = new Map<string, AssessmentBehaviorEvent[]>();
  events.filter((event) => event.type === 'question_answered' && event.questionId).forEach((event) => {
    groups.set(event.questionId!, [...(groups.get(event.questionId!) ?? []), event]);
  });
  return Object.fromEntries([...groups.entries()].map(([questionId, rows]) => [questionId, {
    attempts: rows.length,
    averageScore: getAverage(rows.map((row) => row.score ?? 0)),
    averageDurationMs: getAverage(rows.map((row) => row.durationMs ?? 0)),
    confusionRate: rows.length ? Math.round(rows.filter((row) => row.hesitation === 'confusing').length / rows.length * 100) : 0,
  }])) as Record<string, { attempts: number; averageScore: number; averageDurationMs: number; confusionRate: number }>;
}

function getQualityImprovementInsights(events: AssessmentBehaviorEvent[], feedback: AssessmentFeedbackSurvey[]) {
  const benchmarks = getQuestionBenchmarks(events);
  const questionRows = Object.entries(benchmarks)
    .map(([questionId, row]) => ({ questionId, ...row }))
    .sort((left, right) => right.confusionRate - left.confusionRate || right.averageDurationMs - left.averageDurationMs);
  const abandoned = events.filter((event) => event.type === 'assessment_abandoned').length;
  const started = events.filter((event) => event.type === 'assessment_started').length;
  const continued = events.filter((event) => event.type === 'continuation_accepted').length;
  const mandatory = events.filter((event) => event.type === 'mandatory_completed').length;
  const confusingEvents = events.filter((event) => event.type === 'question_answered' && event.hesitation === 'confusing').length;
  const poorArtifacts = feedback.filter((entry) => entry.artifactQuality === 'poor').length;
  const tooEasy = feedback.filter((entry) => entry.difficultyFit === 'too-easy').length;
  const recommendations = [
    questionRows[0] ? `Review ${questionRows[0].questionId}: ${questionRows[0].confusionRate}% confusing, ${Math.round(questionRows[0].averageDurationMs / 1000)}s average.` : 'Collect more item-level attempts before rewriting questions.',
    poorArtifacts ? `Replace artifact sets: ${poorArtifacts} survey response${poorArtifacts === 1 ? '' : 's'} rated them poor.` : 'Continue monitoring artifact relevance and realism.',
    tooEasy ? `Increase decision complexity: ${tooEasy} respondent${tooEasy === 1 ? '' : 's'} found the route too easy.` : 'Difficulty feedback does not yet show a route-wide easy-item problem.',
    started ? `Completion health: ${Math.max(0, Math.round((1 - abandoned / started) * 100))}% of locally started sessions avoided recorded abandonment.` : 'Completion health will appear after sessions are started.',
    mandatory ? `Optional-depth conversion: ${Math.round(continued / mandatory * 100)}% continued after mandatory questions.` : 'Optional-depth conversion needs a completed mandatory route.',
  ];
  return { questionRows: questionRows.slice(0, 10), recommendations, started, abandoned, mandatory, continued, confusingEvents };
}

function formatDuration(durationMs = 0) {
  const seconds = Math.max(0, Math.round(durationMs / 1000));
  return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

function averageScoreLog(entries: ScoreLogEntry[], groupKey: string): BenchmarkProfile | null {
  const groupEntries = entries.filter((entry) => entry.groupKey === groupKey);
  if (groupEntries.length === 0) return null;
  const scores = {} as Record<DomainId, number>;
  (Object.keys(domains) as DomainId[]).forEach((domain) => {
    scores[domain] = Math.round(groupEntries.reduce((sum, entry) => sum + entry.scores[domain], 0) / groupEntries.length);
  });
  return {
    label: groupEntries[0].groupLabel,
    detail: `${groupEntries.length} saved run${groupEntries.length === 1 ? '' : 's'} on this device`,
    tone: 'group',
    scores,
  };
}

function emptyDomainScores() {
  return Object.keys(domains).reduce(
    (acc, domain) => ({ ...acc, [domain]: { points: 0, count: 0 } }),
    {} as Record<DomainId, { points: number; count: number }>,
  );
}

function getEvidenceMode(question: Question): EvidenceMode {
  if (question.evidenceMode) return question.evidenceMode;
  if (question.interaction === 'text' || question.interaction === 'rank' || question.type === 'report-review' || question.type === 'fraud-detection') return 'doing';
  if (question.interaction === 'parts' || question.interaction === 'match' || question.type === 'concept-cluster') return 'hybrid';
  if (question.stimulus || question.visualStimulus || question.interaction === 'multi') return 'doing';
  return question.difficulty === 'awareness' ? 'knowing' : 'hybrid';
}

function getDefaultCompetencyId(domain: DomainId, question: Question) {
  const text = `${question.id} ${question.type} ${question.prompt} ${question.context}`.toLowerCase();
  if (domain === 'D1') {
    if (text.includes('memory') || text.includes('context') || text.includes('connector') || text.includes('agent')) return 'D1-ai-systems';
    if (text.includes('rag') || text.includes('embedding') || text.includes('fine-tun') || text.includes('retrieval')) return 'D1-genai-mechanics';
    if (text.includes('hallucination') || text.includes('limit') || text.includes('stale') || text.includes('uncertain')) return 'D1-capability-limits';
    return 'D1-core-concepts';
  }
  if (domain === 'D2') {
    if (text.includes('workflow') || text.includes('agent') || text.includes('handoff') || text.includes('approval')) return 'D2-agentic-workflows';
    if (text.includes('tool') || text.includes('mcp') || text.includes('github') || text.includes('product')) return 'D2-tool-selection';
    if (text.includes('repair') || text.includes('revise') || text.includes('iterate') || text.includes('rubric')) return 'D2-output-refinement';
    return 'D2-prompt-design';
  }
  if (domain === 'D3') {
    if (text.includes('image') || text.includes('video') || text.includes('media') || text.includes('provenance')) return 'D3-media-provenance';
    if (text.includes('fraud') || text.includes('phishing') || text.includes('fake') || text.includes('suspicious') || text.includes('invoice')) return 'D3-fraud-detection';
    if (text.includes('chart') || text.includes('dashboard') || text.includes('benchmark') || text.includes('metric')) return 'D3-data-chart-judgment';
    return 'D3-source-verification';
  }
  if (domain === 'D4') {
    if (text.includes('privacy') || text.includes('data') || text.includes('retention') || text.includes('consent')) return 'D4-data-privacy';
    if (text.includes('policy') || text.includes('regulatory') || text.includes('disclosure') || text.includes('documentation')) return 'D4-regulatory-policy';
    if (text.includes('fair') || text.includes('bias') || text.includes('ethic') || text.includes('rights') || text.includes('ip')) return 'D4-fairness-ethics';
    return 'D4-security-governance';
  }
  if (domain === 'D5') {
    if (text.includes('roi') || text.includes('metric') || text.includes('baseline') || text.includes('kpi')) return 'D5-roi-metrics';
    if (text.includes('portfolio') || text.includes('priorit') || text.includes('gate') || text.includes('budget')) return 'D5-portfolio-prioritization';
    if (text.includes('strategy') || text.includes('trend') || text.includes('scale') || text.includes('transformation')) return 'D5-transformation-strategy';
    return 'D5-usecase-fit';
  }
  if (text.includes('trust') || text.includes('challenge') || text.includes('culture') || text.includes('transparent')) return 'D6-trust-culture';
  if (text.includes('change') || text.includes('adoption') || text.includes('coaching') || text.includes('communication')) return 'D6-change-enablement';
  if (text.includes('loop') || text.includes('learn') || text.includes('feedback') || text.includes('improve')) return 'D6-learning-loops';
  return 'D6-role-clarity';
}

function expandCompetencyIds(ids: string[]) {
  return ids.flatMap((id) => broadCompetencyMap[id] ?? [id]);
}

function getQuestionMeasures(question: Question) {
  const measuredDomains = [...new Set([question.domain, ...(question.secondaryDomains ?? [])])] as DomainId[];
  const competencyIds = question.competencyIds?.length
    ? expandCompetencyIds(question.competencyIds)
    : measuredDomains.map((domain) => getDefaultCompetencyId(domain, question));
  return [...new Set(competencyIds)]
    .map((id) => competencyDefinitions[id])
    .filter((competency): competency is CompetencyDefinition => Boolean(competency));
}

function getQuestionSkillLabels(question: Question) {
  const explicitSkills = question.skillIds ?? [];
  const inferredSkills = getQuestionMeasures(question).flatMap((competency) => competency.skills.slice(0, 2));
  return [...new Set([...explicitSkills, ...inferredSkills])].slice(0, 6);
}

function getAnsweredDomainCounts(answers: Answer[]) {
  const counts = emptyDomainScores();
  answers.forEach(({ question, partScores }) => {
    if (partScores?.length) {
      partScores.forEach((partScore) => {
        counts[partScore.domain].count += 1;
      });
      return;
    }
    counts[question.domain].count += 1;
    (question.secondaryDomains ?? []).forEach((domain) => {
      counts[domain].count += 0.35;
    });
  });
  return counts;
}

function getDomainScores(answers: Answer[]) {
  const raw = emptyDomainScores();
  answers.forEach(({ question, option, partScores }) => {
    if (partScores?.length) {
      partScores.forEach((partScore) => {
        raw[partScore.domain].points += getReadinessScore(partScore.score, question.difficulty);
        raw[partScore.domain].count += 1;
      });
      return;
    }
    const readinessScore = getReadinessScore(option.score, question.difficulty);
    raw[question.domain].points += readinessScore;
    raw[question.domain].count += 1;
    (question.secondaryDomains ?? []).forEach((domain) => {
      raw[domain].points += readinessScore * 0.35;
      raw[domain].count += 0.35;
    });
  });
  return Object.fromEntries(
    Object.entries(raw).map(([domain, value]) => [domain, value.count ? Math.round(value.points / value.count) : 0]),
  ) as Record<DomainId, number>;
}

function getDomainEvidenceSummary(answers: Answer[]) {
  const counts = getAnsweredDomainCounts(answers);
  const scores = getDomainScores(answers);
  return (Object.keys(domains) as DomainId[]).map((domain) => {
    const evidenceCount = counts[domain].count;
    return {
      domain,
      score: scores[domain],
      evidenceCount,
      confidence: evidenceCount >= 4 ? 'stronger estimate' : evidenceCount >= 2 ? 'early estimate' : evidenceCount > 0 ? 'sampled once' : 'not sampled',
    };
  });
}

function getScoreBandDescription(score: number, level: string) {
  if (level === 'Advanced') return 'Advanced evidence: strong performance on advanced sampled tasks.';
  if (score >= 85) return 'High score on sampled tasks, capped below Advanced until advanced items are answered strongly.';
  if (level === 'Proficient') return 'Proficient evidence: mostly reliable practical judgment on harder sampled tasks.';
  if (score >= 55) return 'Applied evidence: usable skill with visible gaps.';
  if (score >= 40) return 'Developing evidence: inconsistent or incomplete performance.';
  return 'Limited evidence: answers show major gaps or unsafe choices in this sample.';
}

function getReadinessScore(rawScore: number, difficulty: Difficulty) {
  const score = clamp(rawScore, 0, 100);
  const band = difficultyReadinessBands[difficulty];
  if (score <= 55) return Math.round((score / 55) * band.partial);
  return Math.round(band.partial + ((score - 55) / 45) * (band.max - band.partial));
}

function getReadinessScoreSummary(rawScore: number, difficulty: Difficulty) {
  const adjusted = getReadinessScore(rawScore, difficulty);
  const band = difficultyReadinessBands[difficulty];
  return `Rubric score ${rawScore}/100 on a ${difficultyLabels[difficulty].toLowerCase()} item becomes ${adjusted}/100 readiness evidence. This level can contribute between 0 and ${band.max}; harder items can earn higher readiness evidence, while easy items are capped below advanced readiness.`;
}

function getEvidenceSignals(answers: Answer[]) {
  const signals: EvidenceSignal[] = [];
  answers.forEach((answer) => {
    const mode = getEvidenceMode(answer.question);
    if (answer.partScores?.length) {
      answer.partScores.forEach((partScore) => {
        const competencyId = getDefaultCompetencyId(partScore.domain, answer.question);
        signals.push({ domain: partScore.domain, competencyId, score: getReadinessScore(partScore.score, answer.question.difficulty), mode });
      });
      return;
    }
    const readinessScore = getReadinessScore(answer.option.score, answer.question.difficulty);
    getQuestionMeasures(answer.question).forEach((competency) => {
      signals.push({ domain: competency.domain, competencyId: competency.id, score: readinessScore, mode });
    });
  });
  return signals;
}

function getCompetencyScores(answers: Answer[]) {
  const raw = getEvidenceSignals(answers).reduce(
    (acc, signal) => {
      const current = acc[signal.competencyId] ?? { points: 0, count: 0 };
      acc[signal.competencyId] = { points: current.points + signal.score, count: current.count + 1 };
      return acc;
    },
    {} as Record<string, { points: number; count: number }>,
  );
  return Object.values(competencyDefinitions).map((competency) => {
    const value = raw[competency.id];
    return {
      ...competency,
      score: value ? Math.round(value.points / value.count) : 0,
      evidenceCount: value?.count ?? 0,
      confidence: !value ? 'low' : value.count >= 3 ? 'high' : value.count >= 2 ? 'medium' : 'low',
    };
  });
}

function getCompetenciesForDomain(domain: DomainId) {
  return Object.values(competencyDefinitions).filter((competency) => competency.domain === domain);
}

function getCoverageTargets(
  assessmentMode: AssessmentMode,
  audience: Audience,
  functionTrack: FunctionTrack,
  industryTrack: IndustryTrack,
  executiveRole: ExecutiveRole,
) {
  const domainAnchorIds = (Object.keys(domains) as DomainId[]).map((domain) => getCompetenciesForDomain(domain)[0]?.id).filter(Boolean);
  if (assessmentMode === 'executive') {
    const priorityIds = executivePriorityCompetencies[executiveRole];
    return {
      priorityIds,
      plannedIds: [...new Set([...domainAnchorIds, ...priorityIds])],
      contextLabel: executiveLabels[executiveRole],
      testFrame: 'Executive pilot prioritizes strategic, governance, value, and change-leadership competencies.',
    };
  }
  if (assessmentMode === 'premium') {
    const priorityIds = [...new Set([
      ...functionPriorityCompetencies[functionTrack],
      ...industryPriorityCompetencies[industryTrack],
    ])];
    return {
      priorityIds,
      plannedIds: [...new Set([...domainAnchorIds, ...priorityIds])],
      contextLabel: `${functionLabels[functionTrack]} / ${industryLabels[industryTrack]}`,
      testFrame: 'Premium diagnostic prioritizes competencies most relevant to the selected function and industry.',
    };
  }
  const priorityIds = freeAudiencePriorityCompetencies[audience];
  return {
    priorityIds,
    plannedIds: [...new Set([...domainAnchorIds, ...priorityIds])],
    contextLabel: audienceLabels[audience],
    testFrame: 'Free assessment samples broad AI-literacy essentials first, then leaves deeper competency checks for follow-up.',
  };
}

function getCompetencyCoverage(
  competencyScores: CompetencyScore[],
  assessmentMode: AssessmentMode,
  audience: Audience,
  functionTrack: FunctionTrack,
  industryTrack: IndustryTrack,
  executiveRole: ExecutiveRole,
) {
  const targets = getCoverageTargets(assessmentMode, audience, functionTrack, industryTrack, executiveRole);
  const planned = new Set(targets.plannedIds);
  const priority = new Set(targets.priorityIds);
  const coverage = competencyScores.map((competency) => {
    const isPriority = priority.has(competency.id);
    const isPlanned = planned.has(competency.id);
    if (competency.evidenceCount > 0) {
      return {
        ...competency,
        planned: isPlanned,
        priority: isPriority,
        status: 'sampled',
        statusLabel: isPriority ? 'Role priority sampled' : 'Sampled',
        rationale: competency.evidenceCount >= 2
          ? 'This run collected repeated evidence for this competency.'
          : 'This run collected an early signal; more items are needed for stable confidence.',
      } satisfies CompetencyCoverage;
    }
    if (isPriority) {
      return {
        ...competency,
        planned: true,
        priority: true,
        status: 'priority-gap',
        statusLabel: 'Role priority not sampled',
        rationale: 'This competency matters for the selected profile, but the short adaptive route used its limited questions elsewhere. Recommend a follow-up module.',
      } satisfies CompetencyCoverage;
    }
    if (isPlanned) {
      return {
        ...competency,
        planned: true,
        priority: false,
        status: 'planned-gap',
        statusLabel: 'Core coverage not sampled',
        rationale: 'This is part of broad baseline coverage, but the short assessment could not collect evidence for every planned competency.',
      } satisfies CompetencyCoverage;
    }
    return {
      ...competency,
      planned: false,
      priority: false,
      status: 'optional-gap',
      statusLabel: 'Outside this short route',
      rationale: 'Useful for a fuller profile, but not a priority target for this short assessment route.',
    } satisfies CompetencyCoverage;
  });
  const sampled = coverage.filter((competency) => competency.evidenceCount > 0).length;
  const priorityTotal = coverage.filter((competency) => competency.priority).length;
  const prioritySampled = coverage.filter((competency) => competency.priority && competency.evidenceCount > 0).length;
  const plannedTotal = coverage.filter((competency) => competency.planned).length;
  const plannedSampled = coverage.filter((competency) => competency.planned && competency.evidenceCount > 0).length;
  return { ...targets, coverage, sampled, priorityTotal, prioritySampled, plannedTotal, plannedSampled };
}

function getContinuationRecommendation({
  coverage,
  continuationTargets,
  selectedDomain,
  mode,
  audience,
  functionTrack,
  industryTrack,
  executiveRole,
  profileTags,
  confidence,
}: {
  coverage: CompetencyCoverage[];
  continuationTargets: { confidenceIds: string[]; priorityGapIds: string[]; domainIds: string[] };
  selectedDomain: DomainId;
  mode: AssessmentMode;
  audience: Audience;
  functionTrack: FunctionTrack;
  industryTrack: IndustryTrack;
  executiveRole: ExecutiveRole;
  profileTags: string[];
  confidence: number;
}): ContinuationRecommendation {
  const profileText = [
    mode,
    audience,
    functionTrack,
    industryTrack,
    executiveRole,
    ...profileTags,
  ].join(' ').toLowerCase();
  const profileDeepDiveIds = [
    ...(functionTrack === 'marketing' || /content|creator|creative|campaign|copy|seo|image|video|media|canva|adobe|firefly|midjourney|synthetic/.test(profileText)
      ? ['D2-prompt-design', 'D2-output-refinement', 'D3-source-verification', 'D3-media-provenance', 'D4-fairness-ethics', 'D5-roi-metrics']
      : []),
    ...(functionTrack === 'technical' || /developer|github|copilot|agent|rag|api|model|security/.test(profileText)
      ? ['D1-ai-systems', 'D2-tool-selection', 'D2-agentic-workflows', 'D3-source-verification', 'D4-security-governance']
      : []),
    ...(executiveRole === 'finance' || functionTrack === 'finance'
      ? ['D3-data-chart-judgment', 'D3-fraud-detection', 'D4-security-governance', 'D5-roi-metrics', 'D5-portfolio-prioritization']
      : []),
    ...(executiveRole === 'people' || functionTrack === 'people'
      ? ['D3-source-verification', 'D4-data-privacy', 'D4-fairness-ethics', 'D6-role-clarity', 'D6-trust-culture']
      : []),
  ];
  const uniqueProfileIds = [...new Set(profileDeepDiveIds)];
  const byId = new Map(coverage.map((competency) => [competency.id, competency]));
  const lowConfidenceIds = coverage
    .filter((competency) => competency.evidenceCount > 0 && (competency.confidence !== 'high' || competency.score < 70))
    .map((competency) => competency.id);
  const unsampledPriorityIds = continuationTargets.priorityGapIds;
  const profileGapIds = uniqueProfileIds.filter((id) => {
    const competency = byId.get(id);
    return competency && (competency.evidenceCount === 0 || competency.confidence !== 'high' || competency.score < 76);
  });
  const targetIds = [...new Set([
    ...profileGapIds,
    ...unsampledPriorityIds,
    ...continuationTargets.confidenceIds,
    ...continuationTargets.domainIds,
  ])].slice(0, 8);
  const targetLabels = targetIds
    .map((id) => byId.get(id)?.label)
    .filter((label): label is string => Boolean(label))
    .slice(0, 5);
  const hasProfileRoute = profileGapIds.length > 0;
  const hasPriorityGaps = unsampledPriorityIds.length > 0;
  const lowConfidenceCount = lowConfidenceIds.length;
  const unsampledPlannedCount = coverage.filter((competency) => competency.planned && competency.evidenceCount === 0).length;
  const unsure = confidence < 86 || lowConfidenceCount > 0 || unsampledPriorityIds.length > 0;
  const contextLabel = mode === 'executive'
    ? executiveLabels[executiveRole]
    : mode === 'premium'
      ? `${functionLabels[functionTrack]} in ${industryLabels[industryTrack].toLowerCase()}`
      : audienceLabels[audience];
  const profileReason = hasProfileRoute
    ? functionTrack === 'marketing' || /content|creator|creative|image|video|media/.test(profileText)
      ? 'Your profile points to creative, image/video, campaign, or content work, so media provenance, claim checking, IP/ethics, prompt refinement, and campaign measurement need deeper evidence.'
      : `Your ${contextLabel.toLowerCase()} profile has role-relevant competencies that still need stronger evidence.`
    : '';
  const reasons = [
    confidence < 86 ? `Result confidence is ${confidence}%, so the platform should not treat the level estimate as fully stable yet.` : '',
    lowConfidenceCount ? `${lowConfidenceCount} sampled competenc${lowConfidenceCount === 1 ? 'y is' : 'ies are'} still low or medium confidence.` : '',
    hasPriorityGaps ? `${unsampledPriorityIds.length} profile-priority competenc${unsampledPriorityIds.length === 1 ? 'y was' : 'ies were'} not sampled in the mandatory route.` : '',
    unsampledPlannedCount ? `${unsampledPlannedCount} planned baseline competenc${unsampledPlannedCount === 1 ? 'y has' : 'ies have'} no evidence yet.` : '',
    profileReason,
  ].filter(Boolean).slice(0, 4);
  const route: ContinuationFocus = hasProfileRoute || hasPriorityGaps
    ? { kind: 'priority', label: 'Profile-priority deep dive', targetCompetencyIds: targetIds.length ? targetIds : unsampledPriorityIds }
    : lowConfidenceCount
      ? { kind: 'confidence', label: 'Confidence calibration route', targetCompetencyIds: targetIds.length ? targetIds : continuationTargets.confidenceIds }
      : { kind: 'domain', label: `${selectedDomain} deep dive`, targetDomain: selectedDomain, targetCompetencyIds: targetIds.length ? targetIds : continuationTargets.domainIds };
  return {
    kicker: unsure ? 'Recommended next step' : 'Optional deeper check',
    headline: unsure ? 'Continue the test before finalizing this profile' : 'Continue for a sharper competency profile',
    summary: unsure
      ? `For ${contextLabel.toLowerCase()}, the next questions should focus on the evidence gaps that could change the level estimate.`
      : `The current score is usable as a snapshot, but extra questions can separate good general AI users from advanced users in ${contextLabel.toLowerCase()}.`,
    reasons: reasons.length ? reasons : ['The short route is a snapshot; deeper items improve score differentiation and competency-level confidence.'],
    route,
    questionCount: route.kind === 'priority' ? 8 : 6,
    targetLabels,
    confidenceLabel: confidence < 78 ? 'Low confidence' : confidence < 86 ? 'Medium confidence' : 'Pilot confidence',
    urgency: unsure ? 'recommended' : 'optional',
  };
}

function getEvidenceCompletionReadout(coverage: CompetencyCoverage[], answerCount: number, maxQuestions: number) {
  const targets = coverage
    .filter((competency) => (competency.planned || competency.priority) && (competency.evidenceCount < 3 || competency.confidence !== 'high'))
    .sort((left, right) => Number(right.priority) - Number(left.priority) || left.evidenceCount - right.evidenceCount || left.score - right.score)
    .slice(0, 10);
  const unsampled = targets.filter((competency) => competency.evidenceCount === 0).length;
  const lowConfidence = targets.filter((competency) => competency.evidenceCount > 0 && competency.confidence !== 'high').length;
  const remainingCapacity = Math.max(0, maxQuestions - answerCount);
  const questionCount = Math.min(remainingCapacity, Math.max(4, Math.min(10, targets.length + Math.ceil(lowConfidence / 2))));
  return {
    complete: targets.length === 0,
    targets,
    targetIds: targets.map((competency) => competency.id),
    unsampled,
    lowConfidence,
    questionCount,
    remainingCapacity,
    summary: targets.length
      ? `${targets.length} relevant competenc${targets.length === 1 ? 'y still needs' : 'ies still need'} stronger evidence before the profile should be treated as high-confidence.`
      : 'All planned and profile-priority competencies have high-confidence evidence for this route.',
  };
}

function getTelemetryAnalysis(
  behaviorEvents: AssessmentBehaviorEvent[],
  answers: Answer[],
  feedback: AssessmentFeedbackSurvey[],
  coverage: CompetencyCoverage[],
) {
  const answeredEvents = behaviorEvents.filter((event) => event.type === 'question_answered');
  const artifactEvents = behaviorEvents.filter((event) => event.type === 'artifact_opened' || event.type === 'artifact_zoomed' || event.type === 'artifact_external_opened');
  const reportEvents = behaviorEvents.filter((event) => event.type === 'report_interest');
  const confusingEvents = answeredEvents.filter((event) => event.hesitation === 'confusing' || event.hesitation === 'slow');
  const averageDuration = answeredEvents.length ? getAverage(answeredEvents.map((event) => event.durationMs ?? 0)) : getAverage(answers.map((answer) => answer.behavior?.durationMs ?? 0));
  const textAnswers = answers.filter((answer) => answer.textResponse?.trim()).length;
  const artifactQuestions = answers.filter((answer) => answer.question.stimulus || answer.question.visualStimulus).length;
  const highConfidenceRelevant = coverage.filter((competency) => (competency.planned || competency.priority) && competency.confidence === 'high').length;
  const relevantTotal = coverage.filter((competency) => competency.planned || competency.priority).length;
  const latestFeedback = feedback[0];
  return {
    trackedNow: [
      `${answeredEvents.length || answers.length} answered-question records with selected answer, expected answer/rubric, domain, competency, difficulty, and adjusted score.`,
      `${artifactEvents.length} artifact interaction events, including full-size opens, zoom use, and external file opens.`,
      `${formatDuration(averageDuration)} average answer time across tracked question responses.`,
      `${confusingEvents.length} slow/confusing answer events for item clarity and artifact-legibility review.`,
      `${reportEvents.length} report-interest clicks showing which domains, competencies, courses, tools, continuation prompts, or did-you-know topics drew attention.`,
      `${textAnswers} written responses and ${artifactQuestions} artifact-backed answered items in this run.`,
    ],
    resultUse: [
      'Differentiate ability by correctness, difficulty-adjusted evidence, competency coverage, and confidence rather than raw score alone.',
      'Find items where users are slow, revise repeatedly, open artifacts at high zoom, or answer incorrectly despite easy difficulty.',
      'Detect whether users abandon, stop after mandatory questions, continue into deeper routes, or engage with report recommendations.',
      `Estimate coverage strength: ${highConfidenceRelevant}/${relevantTotal || 1} relevant competencies currently have high-confidence evidence.`,
    ],
    improvements: [
      'Track whether users open the full-size reader before answering correctly or incorrectly.',
      'Track artifact zoom level by artifact path to identify screenshots, workflows, or diagrams that are too dense.',
      'Add server-side cohort benchmarks for item difficulty, discrimination, median time, and confusion rate.',
      'Ask a one-question post-item clarity pulse only after unusually long time or repeated answer changes.',
      'Keep agent proposals in review: survey and trend analysis should produce suggestions first, then a human approves platform edits.',
      latestFeedback ? `Latest survey signal: clarity ${latestFeedback.clarity}, difficulty ${latestFeedback.difficultyFit}, artifact quality ${latestFeedback.artifactQuality}.` : 'No feedback survey has been submitted in the current local log yet.',
    ],
  };
}

function getSurveyQuestionsForProfile(assessmentMode: AssessmentMode, audience: Audience, functionTrack: FunctionTrack, executiveRole: ExecutiveRole) {
  if (assessmentMode === 'executive') return executiveSurveyQuestions[executiveRole];
  if (assessmentMode === 'premium') return functionSurveyQuestions[functionTrack];
  if (audience === 'professional' || audience === 'team') return functionSurveyQuestions.general;
  return broadSurveyQuestions;
}

function getSurveyContextLabel(assessmentMode: AssessmentMode, audience: Audience, functionTrack: FunctionTrack, executiveRole: ExecutiveRole) {
  if (assessmentMode === 'executive') return executiveLabels[executiveRole];
  if (assessmentMode === 'premium') return functionLabels[functionTrack];
  return audienceLabels[audience];
}

function buildProfileTags(survey: Record<string, string[]>, questions: SurveyQuestion[], context: string) {
  const answerTags = questions.flatMap((question) =>
    (survey[question.id] ?? []).map((answer) => `${question.label}: ${answer}`),
  );
  return [`Context: ${context}`, ...answerTags].slice(0, 14);
}

function getProfileTargetCompetencyIds(profileTags: string[], functionTrack: FunctionTrack, executiveRole: ExecutiveRole) {
  const profileText = [functionTrack, executiveRole, ...profileTags].join(' ').toLowerCase();
  const targets = [
    ...(functionTrack === 'marketing' || /content|creator|creative|campaign|copy|seo|image|video|media|canva|adobe|firefly|midjourney|synthetic/.test(profileText)
      ? ['D2-prompt-design', 'D2-output-refinement', 'D3-source-verification', 'D3-media-provenance', 'D4-fairness-ethics', 'D5-roi-metrics']
      : []),
    ...(functionTrack === 'technical' || /developer|github|copilot|agent|rag|api|model|eval|security|context/.test(profileText)
      ? ['D1-ai-systems', 'D1-genai-mechanics', 'D2-tool-selection', 'D2-agentic-workflows', 'D3-source-verification', 'D4-security-governance']
      : []),
    ...(functionTrack === 'finance' || executiveRole === 'finance' || /finance|forecast|invoice|fraud|roi|budget|margin|audit/.test(profileText)
      ? ['D3-data-chart-judgment', 'D3-fraud-detection', 'D4-security-governance', 'D5-roi-metrics', 'D5-portfolio-prioritization']
      : []),
    ...(functionTrack === 'people' || executiveRole === 'people' || /hr|people|hiring|policy|employee|workforce|training|skills/.test(profileText)
      ? ['D3-source-verification', 'D4-data-privacy', 'D4-fairness-ethics', 'D6-role-clarity', 'D6-trust-culture', 'D6-change-enablement']
      : []),
    ...(/governance|risk|board|regulation|policy|responsible|compliance|audit/.test(profileText)
      ? ['D4-regulatory-policy', 'D4-security-governance', 'D5-portfolio-prioritization', 'D6-role-clarity']
      : []),
    ...(/agent|automation|workflow|tool|connector|mcp/.test(profileText)
      ? ['D2-tool-selection', 'D2-agentic-workflows', 'D4-security-governance', 'D6-role-clarity']
      : []),
  ];
  return [...new Set(targets)].slice(0, 10);
}

function getPersonalizedDidYouKnow(
  profileTags: string[],
  weakestDomains: DomainId[],
  functionTrack: FunctionTrack,
  executiveRole: ExecutiveRole,
  fallbackIndex = 0,
) {
  const profileText = [functionTrack, executiveRole, ...profileTags].join(' ').toLowerCase();
  const profileTargets = getProfileTargetCompetencyIds(profileTags, functionTrack, executiveRole);
  const scored = didYouKnowInsights.map((insight, index) => {
    let score = didYouKnowInsights.length - index + fallbackIndex;
    if (insight.competencyIds.some((id) => profileTargets.includes(id))) score += 40;
    if (weakestDomains.includes(insight.domain)) score += 24;
    if (/agent|automation|workflow|tool|connector|mcp/.test(profileText) && insight.id === 'dyk-agent-guardrails') score += 36;
    if (/content|creator|creative|campaign|copy|seo|image|video|media|canva|adobe|firefly|midjourney|synthetic/.test(profileText) && insight.id === 'dyk-media-provenance') score += 36;
    if (/rag|context|source|knowledge|document|file|citation/.test(profileText) && insight.id === 'dyk-rag-context') score += 36;
    if (/benchmark|model|eval|leaderboard|capability/.test(profileText) && insight.id === 'dyk-benchmark-literacy') score += 36;
    if (/governance|risk|privacy|policy|compliance|audit|board/.test(profileText) && insight.id === 'dyk-governance-gap') score += 36;
    if (/roi|value|finance|budget|strategy|portfolio/.test(profileText) && insight.id === 'dyk-roi-reimagination') score += 36;
    if (/people|hr|learning|training|change|manager|team/.test(profileText) && insight.id === 'dyk-human-agency') score += 36;
    return { insight, score };
  });
  return scored.sort((left, right) => right.score - left.score)[0].insight;
}

function toCompetencyScoreMap(competencies: ReturnType<typeof getCompetencyScores>) {
  return Object.fromEntries(
    competencies.map((competency) => [competency.id, { score: competency.score, evidenceCount: competency.evidenceCount }]),
  );
}

function getEvidenceModeSummary(answers: Answer[]) {
  const signals = getEvidenceSignals(answers);
  const summary = signals.reduce(
    (acc, signal) => {
      acc[signal.mode].points += signal.score;
      acc[signal.mode].count += 1;
      return acc;
    },
    {
      knowing: { points: 0, count: 0 },
      doing: { points: 0, count: 0 },
      hybrid: { points: 0, count: 0 },
    } as Record<EvidenceMode, { points: number; count: number }>,
  );
  return (Object.keys(summary) as EvidenceMode[]).map((mode) => ({
    mode,
    label: mode === 'knowing' ? 'Knowing' : mode === 'doing' ? 'Doing' : 'Hybrid',
    score: summary[mode].count ? Math.round(summary[mode].points / summary[mode].count) : 50,
    count: summary[mode].count,
  }));
}

function toEvidenceModeScoreMap(summary: ReturnType<typeof getEvidenceModeSummary>) {
  return Object.fromEntries(
    summary.map((item) => [item.mode, { score: item.score, count: item.count }]),
  ) as Record<EvidenceMode, { score: number; count: number }>;
}

function buildQuestionSignalSnapshots(answers: Answer[]): QuestionSignalSnapshot[] {
  return answers.map((answer) => ({
    questionId: answer.question.id,
    domain: answer.question.domain,
    secondaryDomains: answer.question.secondaryDomains,
    competencyIds: getQuestionMeasures(answer.question).map((competency) => competency.id),
    skillIds: getQuestionSkillLabels(answer.question),
    difficulty: answer.question.difficulty,
    type: answer.question.type,
    interaction: answer.question.interaction ?? 'single',
    evidenceMode: getEvidenceMode(answer.question),
    score: getReadinessScore(answer.option.score, answer.question.difficulty),
    optionId: answer.option.id,
    optionLabel: answer.textResponse?.trim() || answer.option.label,
    correctOptionIds: answer.question.correctOptionIds ?? answer.question.options
      .filter((option) => option.score === Math.max(...answer.question.options.map((item) => item.score)))
      .map((option) => option.id),
    rubricHitIds: answer.rubricHits?.map((criterion) => criterion.id),
    partScores: answer.partScores,
    textResponseLength: answer.textResponse?.trim().length,
    durationMs: answer.behavior?.durationMs,
    interactionCount: answer.behavior?.interactionCount,
    revisionCount: answer.behavior?.revisionCount,
    hesitation: answer.behavior?.hesitation,
  }));
}

function getScoreLogAnalytics(entries: ScoreLogEntry[], profileSignals: ProfileSignalLogEntry[] = []) {
  const completedEntries = entries.filter((entry) => entry.mode !== 'practice');
  const completedSignals = profileSignals.filter((entry) => entry.mode !== 'practice');
  const averageOverall = completedEntries.length
    ? Math.round(completedEntries.reduce((sum, entry) => sum + entry.overall, 0) / completedEntries.length)
    : 0;
  const byMode = ['free', 'premium', 'executive'].map((mode) => ({
    label: mode,
    count: completedEntries.filter((entry) => entry.mode === mode).length,
  }));
  const profileFields = [
    ...new Set(completedEntries.flatMap((entry) => [
      entry.audience ? `Audience: ${audienceLabels[entry.audience]}` : '',
      entry.functionTrack ? `Function: ${functionLabels[entry.functionTrack]}` : '',
      entry.industryTrack ? `Industry: ${industryLabels[entry.industryTrack]}` : '',
      entry.executiveRole ? `Role: ${executiveLabels[entry.executiveRole]}` : '',
    ]).filter(Boolean)),
  ];
  return {
    totalRuns: completedEntries.length,
    individualProfiles: new Set(completedSignals.map((entry) => entry.profileId)).size,
    signalSnapshots: completedSignals.reduce((sum, entry) => sum + entry.questionSignals.length, 0),
    averageOverall,
    byMode,
    profileFields: profileFields.slice(0, 6),
  };
}

function getAverage(values: number[]) {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

function getAdminAnalytics(entries: ScoreLogEntry[], profileSignals: ProfileSignalLogEntry[] = []) {
  const completedEntries = entries.filter((entry) => entry.mode !== 'practice');
  const completedSignals = profileSignals.filter((entry) => entry.mode !== 'practice');
  const groupMap = new Map<string, ScoreLogEntry[]>();
  completedEntries.forEach((entry) => {
    groupMap.set(entry.groupKey, [...(groupMap.get(entry.groupKey) ?? []), entry]);
  });
  const groupRows = [...groupMap.entries()]
    .map(([key, groupEntries]) => ({
      key,
      label: groupEntries[0].groupLabel,
      count: groupEntries.length,
      average: getAverage(groupEntries.map((entry) => entry.overall)),
      lastRun: groupEntries
        .map((entry) => entry.createdAt)
        .sort()
        .at(-1) ?? '',
    }))
    .sort((left, right) => right.count - left.count || right.average - left.average);

  const functionRows = (Object.keys(functionLabels) as FunctionTrack[])
    .map((track) => {
      const matches = completedEntries.filter((entry) => entry.functionTrack === track);
      return { key: track, label: functionLabels[track], count: matches.length, average: getAverage(matches.map((entry) => entry.overall)) };
    })
    .filter((row) => row.count > 0)
    .sort((left, right) => right.count - left.count || right.average - left.average);

  const executiveRows = (Object.keys(executiveLabels) as ExecutiveRole[])
    .map((role) => {
      const matches = completedEntries.filter((entry) => entry.executiveRole === role);
      return { key: role, label: executiveLabels[role], count: matches.length, average: getAverage(matches.map((entry) => entry.overall)) };
    })
    .filter((row) => row.count > 0)
    .sort((left, right) => right.count - left.count || right.average - left.average);

  const domainRows = (Object.keys(domains) as DomainId[])
    .map((domain) => ({
      domain,
      label: domains[domain].name,
      average: getAverage(completedEntries.map((entry) => entry.scores[domain] ?? 0)),
      evidence: completedSignals.reduce((sum, entry) => (
        sum + entry.questionSignals.filter((signal) => signal.domain === domain || signal.secondaryDomains?.includes(domain)).length
      ), 0),
    }))
    .sort((left, right) => left.average - right.average);

  const competencyMap = new Map<string, { scores: number[]; evidence: number; label: string; domain: DomainId }>();
  completedSignals.forEach((entry) => {
    Object.entries(entry.competencyScores).forEach(([id, score]) => {
      const definition = competencyDefinitions[id];
      if (!definition) return;
      const row = competencyMap.get(id) ?? { scores: [], evidence: 0, label: definition.label, domain: definition.domain };
      row.scores.push(score.score);
      row.evidence += score.evidenceCount;
      competencyMap.set(id, row);
    });
  });
  const competencyRows = [...competencyMap.entries()]
    .map(([id, row]) => ({ id, ...row, average: getAverage(row.scores) }))
    .sort((left, right) => left.average - right.average || right.evidence - left.evidence)
    .slice(0, 8);

  const difficultyRows = (['awareness', 'applied', 'proficient', 'advanced'] as Difficulty[])
    .map((difficulty) => {
      const signals = completedSignals.flatMap((entry) => entry.questionSignals).filter((signal) => signal.difficulty === difficulty);
      return { label: difficulty, count: signals.length, average: getAverage(signals.map((signal) => signal.score)) };
    });

  const interactionRows = [...new Set(completedSignals.flatMap((entry) => entry.questionSignals.map((signal) => signal.interaction ?? 'single')))]
    .map((interaction) => {
      const signals = completedSignals.flatMap((entry) => entry.questionSignals).filter((signal) => (signal.interaction ?? 'single') === interaction);
      return { label: interaction ?? 'single', count: signals.length, average: getAverage(signals.map((signal) => signal.score)) };
    })
    .sort((left, right) => right.count - left.count);

  const recentRuns = completedEntries
    .slice()
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, 6)
    .map((entry) => ({
      id: entry.id,
      label: entry.groupLabel,
      mode: entry.mode,
      score: entry.overall,
      date: new Date(entry.createdAt).toLocaleDateString(),
    }));

  return {
    totalRuns: completedEntries.length,
    totalProfiles: new Set(completedSignals.map((entry) => entry.profileId)).size,
    totalQuestionSignals: completedSignals.reduce((sum, entry) => sum + entry.questionSignals.length, 0),
    averageOverall: getAverage(completedEntries.map((entry) => entry.overall)),
    groupRows,
    functionRows,
    executiveRows,
    domainRows,
    competencyRows,
    difficultyRows,
    interactionRows,
    recentRuns,
  };
}

function getLearningRecommendations(priorityDomains: DomainId[], assessmentMode: AssessmentMode, weakCompetencyIds: string[], profileTags: string[] = []) {
  const normalizedTags = profileTags.join(' ').toLowerCase();
  return learningRecommendations
    .filter((course) => {
      if (assessmentMode === 'free' || assessmentMode === 'practice') return course.level === 'Starter' || course.level === 'Applied';
      if (assessmentMode === 'premium') return course.level !== 'Executive';
      return true;
    })
    .map((course) => {
      const domainFit = course.domains.filter((domain) => priorityDomains.includes(domain)).length;
      const competencyFit = weakCompetencyIds.filter((competencyId) => {
        const competency = competencyDefinitions[competencyId];
        return competency && course.domains.includes(competency.domain);
      }).length;
      const executiveFit = assessmentMode === 'executive' && course.level === 'Executive' ? 2 : 0;
      const starterFit = (assessmentMode === 'free' || assessmentMode === 'practice') && course.level === 'Starter' ? 1 : 0;
      const searchableCourse = `${course.provider} ${course.title} ${course.skills.join(' ')} ${course.fit}`.toLowerCase();
      const profileFit = profileTags.length
        ? course.skills.filter((skill) => normalizedTags.includes(skill.toLowerCase()) || searchableCourse.includes(skill.toLowerCase())).length
          + ['github', 'hugging face', 'copilot', 'cli', 'marketing', 'sales', 'crm', 'invoice', 'executive', 'governance', 'workflow', 'agent']
            .filter((keyword) => normalizedTags.includes(keyword) && searchableCourse.includes(keyword)).length
        : 0;
      return { course, rank: domainFit * 4 + competencyFit * 2 + profileFit * 3 + executiveFit + starterFit };
    })
    .filter(({ rank }) => rank > 0)
    .sort((left, right) => right.rank - left.rank)
    .slice(0, assessmentMode === 'free' || assessmentMode === 'practice' ? 3 : 5)
    .map(({ course }) => course);
}

function uniqueLimited(items: string[], limit: number) {
  return [...new Set(items.filter(Boolean))].slice(0, limit);
}

function getPersonalizedExplorationPlan(
  assessmentMode: AssessmentMode,
  functionTrack: FunctionTrack,
  executiveRole: ExecutiveRole,
  weakCompetencies: CompetencyScore[],
  profileTags: string[] = [],
): PersonalizedExplorationPlan {
  const profileText = profileTags.join(' ').toLowerCase();
  const roleDefaults: Record<FunctionTrack, PersonalizedExplorationPlan> = {
    general: {
      tools: ['ChatGPT projects/GPTs', 'Perplexity', 'NotebookLM', 'Canva AI'],
      concepts: ['prompt structure', 'source checking', 'AI with files', 'synthetic media signals'],
      practice: ['rewrite one everyday prompt', 'verify one AI answer against a source', 'inspect a suspicious post before sharing'],
    },
    people: {
      tools: ['policy Q&A assistant', 'interview-note summarizer', 'skills graph tools', 'bias audit checklist'],
      concepts: ['fairness review', 'sensitive employee data', 'candidate explanation', 'human accountability'],
      practice: ['review a candidate packet for proxy bias', 'write a policy-answer prompt with privacy limits', 'map HR decisions that need human review'],
    },
    finance: {
      tools: ['Excel Copilot', 'Power BI Copilot', 'invoice anomaly tools', 'RPA plus AI workflow'],
      concepts: ['audit trail', 'variance explanation', 'quality-adjusted ROI', 'fraud signal detection'],
      practice: ['inspect an invoice for payment-risk signals', 'challenge an AI variance explanation', 'define a finance AI approval gate'],
    },
    marketing: {
      tools: ['Canva AI', 'Adobe Firefly', 'HubSpot AI', 'Perplexity market scans'],
      concepts: ['brand voice control', 'synthetic media disclosure', 'claim verification', 'campaign measurement'],
      practice: ['compare AI campaign copy to source claims', 'review an AI image for brand/IP risk', 'spot a misleading A/B test summary'],
    },
    sales: {
      tools: ['HubSpot AI', 'Salesforce Einstein', 'Gong or call intelligence', 'proposal automation'],
      concepts: ['customer-fact grounding', 'confidential data boundaries', 'forecast evidence', 'human handoff'],
      practice: ['audit an AI account brief for invented facts', 'repair a proposal prompt with pricing limits', 'review pipeline-risk evidence before forecasting'],
    },
    customerService: {
      tools: ['Zendesk AI', 'Intercom Fin', 'Freshdesk Freddy AI', 'knowledge-base search/RAG'],
      concepts: ['policy grounding', 'escalation rules', 'refund authority', 'tone and harm review'],
      practice: ['inspect a ticket thread before accepting an AI reply', 'design a refund approval checkpoint', 'compare a support answer to policy evidence'],
    },
    technical: {
      tools: ['GitHub Copilot', 'Cursor or Windsurf agents', 'OpenAI Agents SDK', 'Hugging Face', 'LangChain or LlamaIndex', 'MCP connectors'],
      concepts: ['RAG', 'agent tool authority', 'eval harnesses', 'model card review', 'least privilege'],
      practice: ['review a repo/model card before adoption', 'build a small eval set', 'map an agent workflow with approval gates'],
    },
    operations: {
      tools: ['process mining tools', 'AI scheduling assistant', 'SOP copilot', 'workflow automation'],
      concepts: ['workflow insertion points', 'exception handling', 'process drift', 'quality inspection'],
      practice: ['map a workflow before adding AI', 'rank escalation steps for an incident', 'compare automation gains against defect rates'],
    },
  };
  const executiveDefaults: Record<ExecutiveRole, PersonalizedExplorationPlan> = {
    ceo: {
      tools: ['AI portfolio scorecard', 'board AI dashboard', 'agentic workflow map', 'vendor/model risk register'],
      concepts: ['AI operating model', 'risk-adjusted value', 'scale gates', 'workforce readiness'],
      practice: ['prioritize an AI use-case portfolio', 'define an AI value dashboard', 'review an agent rollout decision'],
    },
    board: {
      tools: ['AI risk register', 'model/vendor assurance checklist', 'incident reporting dashboard', 'AI investment thesis canvas'],
      concepts: ['AI risk appetite', 'oversight cadence', 'assurance evidence', 'regulatory readiness'],
      practice: ['challenge a board AI status report', 'review unresolved vendor risks', 'separate activity metrics from value evidence'],
    },
    people: roleDefaults.people,
    finance: roleDefaults.finance,
    technology: roleDefaults.technical,
    transformation: {
      tools: ['agent operating model canvas', 'skills heatmap', 'workflow lab', 'measurement dashboard'],
      concepts: ['change adoption', 'champion network', 'risk gates', 'learning loops'],
      practice: ['design a transformation pilot gate', 'map adoption blockers by team', 'turn an incident into a learning loop'],
    },
  };
  const base = assessmentMode === 'executive' ? executiveDefaults[executiveRole] : roleDefaults[functionTrack];
  const weakConcepts = weakCompetencies.flatMap((competency) => competency.skills);
  const interestTools = [
    profileText.includes('github') ? 'GitHub Copilot and repo review' : '',
    profileText.includes('hugging face') ? 'Hugging Face model cards and Spaces' : '',
    profileText.includes('mcp') ? 'MCP connectors and approval gates' : '',
    profileText.includes('agent') ? 'agent workflow tools' : '',
    profileText.includes('perplexity') ? 'Perplexity for sourced research' : '',
    profileText.includes('notebooklm') ? 'NotebookLM for document review' : '',
    profileText.includes('power bi') ? 'Power BI Copilot' : '',
    profileText.includes('zendesk') ? 'Zendesk AI' : '',
    profileText.includes('salesforce') ? 'Salesforce Einstein' : '',
    profileText.includes('hubspot') ? 'HubSpot AI' : '',
    profileText.includes('canva') ? 'Canva AI' : '',
  ];
  const interestConcepts = [
    profileText.includes('rag') ? 'retrieval and grounding' : '',
    profileText.includes('eval') ? 'AI evaluation design' : '',
    profileText.includes('workflow') ? 'workflow mapping' : '',
    profileText.includes('risk') ? 'risk controls' : '',
    profileText.includes('fake media') || profileText.includes('synthetic') ? 'media provenance' : '',
    profileText.includes('automation') ? 'automation boundaries' : '',
  ];
  return {
    tools: uniqueLimited([...interestTools, ...base.tools], 6),
    concepts: uniqueLimited([...weakConcepts, ...interestConcepts, ...base.concepts], 8),
    practice: uniqueLimited(base.practice, 4),
  };
}

function scoreParts(question: Question, selections: Record<string, string>) {
  const partScores = (question.parts ?? []).map((part) => {
    const selectedOption = part.options.find((option) => option.id === selections[part.id]);
    return {
      partId: part.id,
      domain: part.domain,
      score: selectedOption?.score ?? 15,
    };
  });
  const score = partScores.length
    ? Math.round(partScores.reduce((sum, partScore) => sum + partScore.score, 0) / partScores.length)
    : 15;
  return { score, partScores };
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

function scoreTextAnswer(question: Question, response: string) {
  const normalized = response.toLowerCase();
  const criteria = question.rubricCriteria ?? [];
  if (!normalized.trim()) return { score: 10, hits: [] as RubricCriterion[] };
  const hits = criteria.filter((criterion) => criterion.keywords.some((keyword) => normalized.includes(keyword)));
  const score = Math.min(98, Math.max(20, hits.reduce((sum, criterion) => sum + criterion.points, 0)));
  return { score, hits };
}

function getCorrectAnswerSummary(question: Question) {
  if (question.interaction === 'multi') {
    const correct = new Set(question.correctOptionIds ?? []);
    return question.options.filter((option) => correct.has(option.id)).map((option) => option.label).join(' | ');
  }
  if (question.interaction === 'rank') {
    return (question.idealOrder ?? [])
      .map((id, index) => {
        const item = question.rankItems?.find((rankItem) => rankItem.id === id);
        return `${index + 1}. ${item?.label ?? id}`;
      })
      .join(' | ');
  }
  if (question.interaction === 'match') {
    return (question.matchPairs ?? []).map((pair) => `${pair.left} -> ${pair.correct}`).join(' | ');
  }
  if (question.interaction === 'parts') {
    return (question.parts ?? [])
      .map((part) => {
        const correct = part.options.find((option) => option.id === part.correctOptionId);
        return `${domains[part.domain].short}: ${correct?.label ?? part.correctOptionId}`;
      })
      .join(' | ');
  }
  if (question.interaction === 'text') return question.exemplarAnswer ?? 'Rubric-scored written response.';
  const best = [...question.options].sort((a, b) => b.score - a.score)[0];
  return best ? best.label : 'Rubric-scored response.';
}

function getCalibrationSummary(question: Question, answer: Answer) {
  const readinessSummary = getReadinessScoreSummary(answer.option.score, question.difficulty);
  if (question.interaction === 'text') {
    const hitLabels = answer.rubricHits?.map((criterion) => criterion.label).join('; ') || 'No rubric criteria detected yet';
    return `MVP rubric scoring: ${hitLabels}. ${readinessSummary} Full calibration will use human review and pilot response data to tune difficulty, discrimination, and partial-credit thresholds.`;
  }
  if (question.interaction === 'multi') return `Multi-select calibration gives partial credit for correct criteria and subtracts for distractors. ${readinessSummary} Future IRT calibration will estimate which options best separate ability levels.`;
  if (question.interaction === 'rank') return `Rank-order calibration scores exact sequence positions. ${readinessSummary} Later versions can use partial-order scoring and calibrated step weights.`;
  if (question.interaction === 'match') return `Matching calibration scores the proportion of correct pairings. ${readinessSummary} Later versions can estimate item difficulty per pair.`;
  if (question.interaction === 'parts') return `Multi-part calibration scores each mini-question separately, then updates the relevant domain evidence. ${readinessSummary} This lets one concept cluster route users into more precise adaptive follow-ups.`;
  return `Selected option score ${answer.option.score}/100. ${readinessSummary} In the MVP this is expert-seeded; pilot data will later tune item difficulty b, discrimination a, and guessing c.`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatAbility(value: number) {
  return value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
}

function estimateTheta(answers: Answer[]) {
  if (!answers.length) return 0;
  const average = answers.reduce((sum, answer) => sum + answer.option.score, 0) / answers.length;
  return clamp((average - 58) / 20, -2.2, 2.2);
}

function itemDifficulty(question: Question) {
  return { awareness: -0.85, applied: 0.15, proficient: 0.95, advanced: 1.55 }[question.difficulty];
}

function getDifficultyFromLastAnswer(answers: Answer[]) {
  const latest = answers.at(-1);
  if (!latest) return 'applied' as Difficulty;
  if (latest.option.score >= 92 && latest.question.difficulty === 'proficient') return 'advanced' as Difficulty;
  if (latest.option.score >= 82) return latest.question.difficulty === 'advanced' ? 'advanced' as Difficulty : 'proficient' as Difficulty;
  if (latest.option.score < 55) return 'awareness' as Difficulty;
  return latest.question.difficulty;
}

function chooseByDifficulty(candidates: Question[], targetDifficulty: Difficulty, seed: number) {
  const ranked = [...candidates].sort((left, right) => {
    const leftDistance = Math.abs(difficultyValue[left.difficulty] - difficultyValue[targetDifficulty]);
    const rightDistance = Math.abs(difficultyValue[right.difficulty] - difficultyValue[targetDifficulty]);
    return leftDistance - rightDistance || seededValue(right.id, seed) - seededValue(left.id, seed);
  });
  const nearestDistance = Math.abs(difficultyValue[ranked[0].difficulty] - difficultyValue[targetDifficulty]);
  const nearest = ranked.filter((question) => Math.abs(difficultyValue[question.difficulty] - difficultyValue[targetDifficulty]) === nearestDistance);
  return nearest[seededValue(`${targetDifficulty}-${nearest.map((question) => question.id).join('-')}`, seed) % nearest.length];
}

function chooseFromAdaptiveTier(scoredCandidates: Array<{ question: Question; rank: number }>, seed: number, step: number) {
  const sorted = [...scoredCandidates].sort((a, b) => b.rank - a.rank);
  const topRank = sorted[0].rank;
  const adaptiveTier = sorted.filter((candidate) => topRank - candidate.rank <= 8).slice(0, 5);
  return adaptiveTier[seededValue(`tier-${step}-${adaptiveTier.map((candidate) => candidate.question.id).join('-')}`, seed) % adaptiveTier.length].question;
}

function getDifficultyMovement(answer: Answer | null, nextQuestion: Question | null) {
  if (!answer || !nextQuestion) return { label: 'Calibrating', detail: 'The first item establishes a starting estimate.', tone: 'steady' };
  const previous = difficultyValue[answer.question.difficulty];
  const next = difficultyValue[nextQuestion.difficulty];
  const domainText = answer.question.domain === nextQuestion.domain ? ` in ${answer.question.domain}` : `, then switched to ${nextQuestion.domain} for coverage`;
  if (answer.option.score >= 82 && next > previous) return { label: 'Harder next', detail: `Strong answer: the engine increased difficulty${domainText}.`, tone: 'up' };
  if (answer.option.score < 55 && next < previous) return { label: 'Easier next', detail: `Weak answer: the engine lowered difficulty${domainText}.`, tone: 'down' };
  if (answer.option.score >= 82) return { label: 'Strong answer', detail: `Difficulty pressure moved up${domainText}; no harder unused item was available at this exact step.`, tone: 'up' };
  if (answer.option.score < 55) return { label: 'Support mode', detail: `Difficulty pressure moved down${domainText}; no easier unused item was available at this exact step.`, tone: 'down' };
  return { label: 'Hold level', detail: `Partial answer: the engine keeps difficulty near the current level${domainText}.`, tone: 'steady' };
}

function itemDiscrimination(question: Question) {
  const interaction = question.interaction ?? 'single';
  const base = { single: 0.85, multi: 1.05, rank: 1.15, match: 1.1, text: 1.25, parts: 1.2 }[interaction];
  return question.stimulus || question.visualStimulus ? base + 0.1 : base;
}

function itemGuessing(question: Question) {
  const interaction = question.interaction ?? 'single';
  if (interaction === 'single') return 0.22;
  if (interaction === 'multi') return 0.12;
  if (interaction === 'text') return 0.02;
  if (interaction === 'parts') return 0.1;
  return 0.08;
}

function getTaskInstruction(question: Question) {
  const interaction = question.interaction ?? 'single';
  if (question.type === 'reliance-decision') return 'Choose the right ownership level for the task.';
  if (interaction === 'multi') return 'Select every response that belongs in a good real-world answer.';
  if (interaction === 'rank') return 'Arrange the steps in the order you would use in practice.';
  if (interaction === 'match') return 'Match each situation to the responsibility, control, or explanation that fits.';
  if (interaction === 'text') return 'Write a short answer. The MVP checks for rubric evidence, not perfect wording.';
  if (interaction === 'parts') return 'Answer each mini-part. This concept cluster updates multiple domain signals.';
  if (question.type === 'narrative') return 'Read the short story and choose the judgment that best preserves evidence, safety, and usefulness.';
  if (question.type === 'media' || question.type === 'report-review') return 'Inspect the evidence before you choose. The visible material is part of the item.';
  return 'Choose the next action you would actually take.';
}

function getAdaptiveReadout(answers: Answer[], question: Question, assessmentMode: AssessmentMode, config: { totalQuestions: number; confidenceBase: number; confidenceStep: number }) {
  const theta = estimateTheta(answers);
  const b = itemDifficulty(question);
  const a = itemDiscrimination(question);
  const c = itemGuessing(question);
  const probability = c + (1 - c) / (1 + Math.exp(-a * (theta - b)));
  const information = Math.max(0.08, a * a * probability * (1 - probability));
  const sem = 1 / Math.sqrt(information + answers.length * 0.24 + 0.6);
  const confidence = Math.min(assessmentMode === 'executive' ? 96 : assessmentMode === 'premium' ? 94 : 88, config.confidenceBase + answers.length * config.confidenceStep);
  const domainScores = getDomainScores(answers);
  const counts = getAnsweredDomainCounts(answers);
  const weakestDomain = (Object.keys(domains) as DomainId[]).sort(
    (left, right) => counts[left].count - counts[right].count || domainScores[left] - domainScores[right],
  )[0];
  const targetDomain = assessmentMode === 'executive' ? selectExecutiveDomain(answers) : weakestDomain;
  const targetDifficulty = getDifficultyFromLastAnswer(answers);
  const latestScore = answers.at(-1)?.option.score ?? 0;
  const difficultyReason =
    latestScore >= 82
      ? 'Previous answer was strong, so difficulty pressure moved up.'
      : latestScore < 55
        ? 'Previous answer was weak, so difficulty pressure moved down.'
        : 'Previous answer was partial, so difficulty stayed nearby.';
  const adaptationReason =
    answers.length === 0
      ? 'Starting with a broad calibration item.'
      : question.domain === answers.at(-1)?.question.domain
        ? `${difficultyReason} Staying in ${question.domain} to refine that domain estimate.`
        : question.domain === targetDomain
          ? `${difficultyReason} Targeting ${domains[targetDomain].short} because it needs more evidence.`
          : `Difficulty target is ${targetDifficulty} after the previous score; coverage rules selected ${domains[question.domain].short}.`;
  return {
    theta,
    b,
    a,
    c,
    probability: Math.round(probability * 100),
    information: information.toFixed(2),
    sem: sem.toFixed(2),
    confidence,
    targetDomain,
    targetDifficulty,
    adaptationReason,
    answeredCount: answers.length,
    remainingCount: Math.max(0, config.totalQuestions - answers.length),
  };
}

function getAssessmentBank(assessmentMode: AssessmentMode) {
  return assessmentMode === 'executive' ? executiveAssessmentQuestionBank : questionBank;
}

function seededValue(id: string, seed: number) {
  let hash = (seed || 1) ^ 0x811c9dc5;
  for (let index = 0; index < id.length; index += 1) {
    hash ^= id.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return Math.abs(hash) % 997;
}

function shuffledBySeed<T>(items: T[], seed: number, namespace: string, getKey: (item: T) => string) {
  return [...items].sort((left, right) => (
    seededValue(`${namespace}:${getKey(left)}`, seed) - seededValue(`${namespace}:${getKey(right)}`, seed)
  ));
}

function optionDisplayLetter(index: number) {
  return String.fromCharCode(65 + index);
}

function selectExecutiveDomain(answers: Answer[]) {
  if (answers.length < starterDomains.length) return starterDomains[answers.length];
  const scores = getDomainScores(answers);
  const counts = getAnsweredDomainCounts(answers);
  return (Object.keys(domains) as DomainId[]).sort((a, b) => {
    const aGap = executiveDomainTargets[a] - counts[a].count;
    const bGap = executiveDomainTargets[b] - counts[b].count;
    return bGap - aGap || scores[a] - scores[b] || executiveDomainTargets[b] - executiveDomainTargets[a];
  })[0];
}

function selectNextQuestion(
  answers: Answer[],
  assessmentMode: AssessmentMode = 'free',
  seed = 0,
  profile: { functionTrack?: FunctionTrack; industryTrack?: IndustryTrack; targetDomain?: DomainId; targetCompetencyIds?: string[]; totalQuestions?: number } = {},
) {
  const bank = getAssessmentBank(assessmentMode);
  const answered = new Set(answers.map((answer) => answer.question.id));
  const scores = getDomainScores(answers);
  const counts = getAnsweredDomainCounts(answers);
  const targetDomain = profile.targetDomain ?? (assessmentMode === 'executive' ? selectExecutiveDomain(answers) : undefined);
  const targetCompetencyIds = new Set(profile.targetCompetencyIds ?? []);
  const weakestDomain = (Object.keys(domains) as DomainId[]).sort(
    (a, b) => counts[a].count - counts[b].count || scores[a] - scores[b],
  )[0];
  const latestScore = answers.at(-1)?.option.score ?? 62;
  const targetDifficulty = getDifficultyFromLastAnswer(answers);
  const candidates = bank.filter((question) => !answered.has(question.id));
  const ownershipCount = answers.filter((answer) => answer.question.type === 'reliance-decision').length;
  const cappedCandidates = ownershipCount >= 1
    ? candidates.filter((question) => question.type !== 'reliance-decision')
    : candidates;
  const selectableCandidates = cappedCandidates.length ? cappedCandidates : candidates;
  if (!selectableCandidates.length) return bank[seededValue(`${assessmentMode}-fallback`, seed) % bank.length];
  if (answers.length === 0) {
    const premiumStarterIds: Record<FunctionTrack, string[]> = {
      general: ['MULTI-CONCEPT-GEN-001', 'FUNC-GEN-D5-001', 'D3-PRO-010', 'D4-PRO-011'],
      people: ['FUNC-PEOPLE-D4-001'],
      finance: ['FUNC-FIN-D3-001'],
      marketing: ['FUNC-MKT-D3-001'],
      sales: ['FUNC-SALES-D3-001'],
      customerService: ['FUNC-CS-D3-001'],
      technical: ['FUNC-TECH-D4-001'],
      operations: ['FUNC-OPS-D6-001'],
    };
    const starterIds = assessmentMode === 'executive'
      ? ['MULTI-CONCEPT-EXEC-001', 'EXEC-D5-003', 'EXEC-D6-004', 'EXEC-D2-A2A-019', 'EXEC-D4-AGENT-020']
      : assessmentMode === 'premium'
        ? premiumStarterIds[profile.functionTrack ?? 'general']
      : ['MULTI-CONCEPT-GEN-001', 'D3-A-007', 'D2-M-002', 'D3-A-001', 'D4-F-006'];
    const starterCandidates = starterIds
      .map((id) => bank.find((question) => question.id === id))
      .filter((question): question is Question => Boolean(question));
    return starterCandidates[seededValue(`${assessmentMode}-starter`, seed) % starterCandidates.length] ?? selectableCandidates[0];
  }
  const latestAnswer = answers.at(-1);
  const consecutiveSameDomain = latestAnswer
    ? [...answers].reverse().findIndex((answer) => answer.question.domain !== latestAnswer.question.domain)
    : 0;
  const sameDomainRun = consecutiveSameDomain === -1 ? answers.length : consecutiveSameDomain;
  const remainingSlots = (profile.totalQuestions ?? modeConfig[assessmentMode].totalQuestions) - answers.length;
  const unsampledDomainCount = (Object.keys(domains) as DomainId[]).filter((domain) => counts[domain].count === 0).length;
  const coverageAtRisk = unsampledDomainCount >= remainingSlots;
  const canRefineSameDomain = Boolean(latestAnswer) && sameDomainRun < 2 && !coverageAtRisk;
  const sameDomainCandidates = latestAnswer ? selectableCandidates.filter((question) => question.domain === latestAnswer.question.domain) : [];
  const sameDomainDifficultyCandidates = sameDomainCandidates.filter((question) => question.difficulty === targetDifficulty);
  if (canRefineSameDomain && sameDomainDifficultyCandidates.length) return chooseByDifficulty(sameDomainDifficultyCandidates, targetDifficulty, seed);
  const sameDomainFallback = canRefineSameDomain ? chooseByDifficulty(sameDomainCandidates, targetDifficulty, seed) : undefined;
  if (canRefineSameDomain && sameDomainFallback) return sameDomainFallback;
  if (assessmentMode === 'executive') {
    const interactionCounts = answers.reduce(
      (acc, answer) => {
        const interaction = answer.question.interaction ?? 'single';
        acc[interaction] = (acc[interaction] ?? 0) + 1;
        return acc;
      },
      {} as Record<NonNullable<Question['interaction']>, number>,
    );
    const visualCount = answers.filter((answer) => answer.question.stimulus || answer.question.visualStimulus).length;
    const scoredCandidates = selectableCandidates.map((question) => {
      const interaction = question.interaction ?? 'single';
      const difficultyDistance = Math.abs(difficultyValue[question.difficulty] - difficultyValue[targetDifficulty]);
      const targetMinimum = minimumExecutiveInteractions[interaction] ?? 0;
      const questionCompetencyIds = getQuestionMeasures(question).map((competency) => competency.id);
      let rank = seededValue(question.id, seed) / 1000;
      if (question.domain === targetDomain) rank += 56;
      if (questionCompetencyIds.some((id) => targetCompetencyIds.has(id))) rank += 52;
      rank += Math.max(0, executiveDomainTargets[question.domain] - counts[question.domain].count) * 10;
      rank += 34 - difficultyDistance * 12;
      if ((interactionCounts[interaction] ?? 0) < targetMinimum) rank += 24;
      if (visualCount < 5 && (question.stimulus || question.visualStimulus)) rank += 18;
      if (question.type === 'reliance-decision') rank -= 28;
      if (latestScore < 55 && question.difficulty === 'awareness') rank += 34;
      if (latestScore >= 82 && question.difficulty === 'proficient') rank += 34;
      return { question, rank };
    });
    return chooseFromAdaptiveTier(scoredCandidates, seed, answers.length);
  }
  const interactionCounts = answers.reduce(
    (acc, answer) => {
      const interaction = answer.question.interaction ?? 'single';
      acc[interaction] = (acc[interaction] ?? 0) + 1;
      return acc;
    },
    {} as Record<NonNullable<Question['interaction']>, number>,
  );
  const visualCount = answers.filter((answer) => answer.question.stimulus || answer.question.visualStimulus).length;
  const scoredCandidates = selectableCandidates.map((question) => {
    const interaction = question.interaction ?? 'single';
    const difficultyDistance = Math.abs(difficultyValue[question.difficulty] - difficultyValue[targetDifficulty]);
    const targetMinimum = minimumGeneralInteractions[interaction] ?? 0;
    const questionCompetencyIds = getQuestionMeasures(question).map((competency) => competency.id);
    let rank = seededValue(question.id, seed) / 1000;
    if (question.domain === targetDomain) rank += 44;
    if (questionCompetencyIds.some((id) => targetCompetencyIds.has(id))) rank += 52;
    if (question.domain === weakestDomain) rank += 42;
    if (assessmentMode === 'premium' && question.functionTracks?.includes(profile.functionTrack ?? 'general')) rank += 26;
    if (assessmentMode === 'premium' && question.industryTracks?.includes(profile.industryTrack ?? 'general')) rank += 16;
    rank += 30 - difficultyDistance * 10;
    if ((interactionCounts[interaction] ?? 0) < targetMinimum) rank += 24;
    if (visualCount < 4 && (question.stimulus || question.visualStimulus)) rank += 22;
    if (question.type === 'reliance-decision') rank -= 28;
    if (latestScore < 55 && question.difficulty === 'awareness') rank += 30;
    if (latestScore >= 82 && question.difficulty === 'proficient') rank += 30;
    return { question, rank };
  });
  return chooseFromAdaptiveTier(scoredCandidates, seed, answers.length);
}

function VisualStimulusCard({ stimulus }: { stimulus: VisualStimulus }) {
  return (
    <figure className={`visual-stimulus evidence-board ${stimulus.kind}`}>
      <div className="visual-header">
        <span>{stimulus.eyebrow}</span>
        <strong>{stimulus.title}</strong>
      </div>
      <div className="visual-body">
        {stimulus.callout && (
          <div className="visual-callout">
            <span>{stimulus.callout}</span>
            <small>headline signal</small>
          </div>
        )}
        {stimulus.metrics && (
          <div className="visual-metrics" aria-label="Key evidence metrics">
            {stimulus.metrics.map((metric) => (
              <div key={`${metric.label}-${metric.value}`} className={`metric-pill ${metric.status ?? 'warn'}`}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>
        )}
        {stimulus.chartBars && (
          <div className="visual-chart" aria-label="Evidence chart">
            {stimulus.chartBars.map((bar) => (
              <div className="chart-row" key={`${bar.label}-${bar.value}`}>
                <div className="chart-label">
                  <span>{bar.label}</span>
                  {bar.note && <small>{bar.note}</small>}
                </div>
                <div className="chart-track">
                  <span style={{ width: `${Math.max(8, Math.min(100, bar.value))}%` }} />
                </div>
                <strong>{bar.value}%</strong>
              </div>
            ))}
          </div>
        )}
        <div className="visual-lines">
          {stimulus.points.map((point, index) => (
            <p key={point}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{point}</strong>
            </p>
          ))}
        </div>
        {stimulus.flags && (
          <div className="visual-flags" aria-label="Items to inspect">
            {stimulus.flags.map((flag) => (
              <span key={flag}>{flag}</span>
            ))}
          </div>
        )}
      </div>
      <figcaption>{stimulus.caption}</figcaption>
    </figure>
  );
}

function StimulusFigure({
  stimulus,
  onArtifactAction,
}: {
  stimulus: NonNullable<Question['stimulus']>;
  onArtifactAction?: (action: 'reader' | 'zoom' | 'external', zoomLevel?: number) => void;
}) {
  const [readerOpen, setReaderOpen] = useState(false);
  const [zoom, setZoom] = useState<'fit' | 1 | 1.5 | 2>('fit');
  const zoomOptions: Array<'fit' | 1 | 1.5 | 2> = ['fit', 1, 1.5, 2];
  const getZoomTelemetryValue = (nextZoom: 'fit' | 1 | 1.5 | 2) => nextZoom === 'fit' ? 0 : nextZoom;
  function openReader() {
    setZoom('fit');
    onArtifactAction?.('reader', getZoomTelemetryValue('fit'));
    setReaderOpen(true);
  }
  function updateZoom(nextZoom: 'fit' | 1 | 1.5 | 2) {
    setZoom(nextZoom);
    onArtifactAction?.('zoom', getZoomTelemetryValue(nextZoom));
  }
  const readerImageStyle = zoom === 'fit'
    ? undefined
    : { width: `${zoom * 100}%` };

  return (
    <>
      <figure className="stimulus-card">
        <div className="stimulus-toolbar">
          <div className="stimulus-label">{stimulus.label}</div>
          <button type="button" className="secondary dark" onClick={openReader}>Read full size</button>
        </div>
        <button type="button" className="stimulus-media" onClick={openReader} aria-label={`Open ${stimulus.label} full size`}>
          {/* Preserve each SVG/PNG artifact's own aspect ratio instead of forcing a Next image size. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={stimulus.src} alt={stimulus.alt} loading="lazy" decoding="async" />
        </button>
        <figcaption>{stimulus.caption}</figcaption>
      </figure>
      {readerOpen && (
        <div className="artifact-reader-backdrop" role="presentation">
          <section className="artifact-reader" role="dialog" aria-modal="true" aria-label={`${stimulus.label} full-size artifact`}>
            <div className="artifact-reader-toolbar">
              <div>
                <span>Artifact reader</span>
                <strong>{stimulus.label}</strong>
              </div>
              <div className="artifact-reader-actions">
                {zoomOptions.map((nextZoom) => (
                  <button
                    key={nextZoom}
                    type="button"
                    className={zoom === nextZoom ? 'selected' : ''}
                    onClick={() => updateZoom(nextZoom)}
                  >
                    {nextZoom === 'fit' ? 'Fit' : `${nextZoom}x`}
                  </button>
                ))}
                <a className="secondary dark" href={stimulus.src} target="_blank" rel="noreferrer" onClick={() => onArtifactAction?.('external', getZoomTelemetryValue(zoom))}>Open file</a>
                <button type="button" className="primary" onClick={() => setReaderOpen(false)}>Close</button>
              </div>
            </div>
            <div className={`artifact-reader-canvas ${zoom === 'fit' ? 'fit-window' : ''}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={stimulus.src} alt={stimulus.alt} style={readerImageStyle} />
            </div>
            <p>{stimulus.caption}</p>
          </section>
        </div>
      )}
    </>
  );
}

function HelpBubble({ label, children }: { label: string; children: string }) {
  return (
    <span className="help-bubble">
      <button type="button" aria-label={label}>?</button>
      <span role="tooltip">{children}</span>
    </span>
  );
}

function getQuestionFocus(question: Question) {
  if (question.type === 'fraud-detection') return 'Spot the suspicious points';
  if (question.type === 'report-review') return 'Find the unsupported claim';
  if (question.type === 'media') return 'Check the image against the claim';
  if (question.type === 'reliance-decision') return 'Choose the right ownership level';
  if (question.type === 'multi-select') return 'Select every valid signal';
  if (question.type === 'drag-order') return 'Sequence the response';
  if (question.type === 'matching') return 'Match the risk to the control';
  if (question.type === 'narrative') return 'Read the situation, then judge';
  return 'Make the best practical call';
}

function getRelianceChoice(option: Option) {
  const [label, detail = option.label] = option.label.split(': ');
  return { label, detail };
}

function RadarChart({
  scores,
  benchmarks = [],
  selectedDomain,
  onSelectDomain,
}: {
  scores: Record<DomainId, number>;
  benchmarks?: BenchmarkProfile[];
  selectedDomain?: DomainId;
  onSelectDomain?: (domain: DomainId) => void;
}) {
  const axis = Object.keys(domains) as DomainId[];
  const center = 150;
  const radius = 86;
  const axisPoints = axis.map((domain, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / axis.length;
    const labelX = center + Math.cos(angle) * (radius + 18);
    const labelAnchor = Math.cos(angle) > 0.25 ? 'end' : Math.cos(angle) < -0.25 ? 'start' : 'middle';
    return {
      domain,
      angle,
      labelX,
      labelY: center + Math.sin(angle) * (radius + 22),
      labelAnchor,
      axisX: center + Math.cos(angle) * radius,
      axisY: center + Math.sin(angle) * radius,
    };
  });
  const getPolygon = (profileScores: Record<DomainId, number>) => axisPoints
    .map((point) => {
      const value = profileScores[point.domain] / 100;
      return `${center + Math.cos(point.angle) * radius * value},${center + Math.sin(point.angle) * radius * value}`;
    })
    .join(' ');
  const userPoints = axisPoints.map((point) => {
    const value = scores[point.domain] / 100;
    return {
      ...point,
      pointX: center + Math.cos(point.angle) * radius * value,
      pointY: center + Math.sin(point.angle) * radius * value,
    };
  });
  const polygon = getPolygon(scores);

  return (
    <div className="radar-panel">
      <svg viewBox="0 0 300 300" role="img" aria-label="Six-domain AI readiness radar graph" className="radar">
        {[0.25, 0.5, 0.75, 1].map((ring) => (
          <polygon
            key={ring}
            points={axisPoints
              .map((point) => {
                const angle = Math.atan2(point.axisY - center, point.axisX - center);
                return `${center + Math.cos(angle) * radius * ring},${center + Math.sin(angle) * radius * ring}`;
              })
              .join(' ')}
            className="radar-ring"
          />
        ))}
        {axisPoints.map((point) => (
          <line key={point.domain} x1={center} y1={center} x2={point.axisX} y2={point.axisY} className="radar-axis" />
        ))}
        {benchmarks.map((benchmark) => (
          <polygon key={benchmark.label} points={getPolygon(benchmark.scores)} className={`radar-benchmark ${benchmark.tone}`} />
        ))}
        <polygon points={polygon} className="radar-score" />
        {userPoints.map((point) => (
          <g key={point.domain}>
            <circle cx={point.pointX} cy={point.pointY} r={selectedDomain === point.domain ? '6' : '4'} fill={domains[point.domain].color} />
            {onSelectDomain && (
              <circle
                cx={point.pointX}
                cy={point.pointY}
                r="14"
                className="radar-hotspot"
                onClick={() => onSelectDomain(point.domain)}
              >
                <title>{`Drill into ${point.domain} ${domains[point.domain].name}`}</title>
              </circle>
            )}
          </g>
        ))}
        {axisPoints.map((point) => (
          <text
            key={point.domain}
            x={point.labelX}
            y={point.labelY}
            textAnchor={point.labelAnchor}
            dominantBaseline="middle"
            className={`radar-label ${selectedDomain === point.domain ? 'selected' : ''} ${onSelectDomain ? 'clickable' : ''}`}
            onClick={() => onSelectDomain?.(point.domain)}
          >
            <tspan className="radar-code">{point.domain}</tspan>
            <tspan x={point.labelX} dy="12" className="radar-short">{domains[point.domain].short}</tspan>
          </text>
        ))}
      </svg>
      <div className="radar-legend" aria-label="Radar domain key">
        {axis.map((domain) => (
          <button
            key={domain}
            type="button"
            className={selectedDomain === domain ? 'selected' : ''}
            onClick={() => onSelectDomain?.(domain)}
            disabled={!onSelectDomain}
          >
            <i style={{ background: domains[domain].color }} />
            <strong>{domain}</strong> {domains[domain].name}
          </button>
        ))}
      </div>
      {benchmarks.length > 0 && (
        <div className="benchmark-legend" aria-label="Target comparison key">
          <span><i className="user-line" />Your score</span>
          {benchmarks.map((benchmark) => (
            <span key={benchmark.label}>
              <i className={benchmark.tone} />
              {benchmark.label}
              <small>{benchmark.detail}</small>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function CompetencyRadar({
  domain,
  competencies,
}: {
  domain: DomainId;
  competencies: Array<CompetencyDefinition & { score?: number; evidenceCount?: number; confidence?: string }>;
}) {
  const center = 150;
  const radius = 78;
  const safeCompetencies = competencies.length > 0 ? competencies : getCompetenciesForDomain(domain);
  const axisPoints = safeCompetencies.map((competency, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / safeCompetencies.length;
    return {
      competency,
      angle,
      axisX: center + Math.cos(angle) * radius,
      axisY: center + Math.sin(angle) * radius,
      labelX: center + Math.cos(angle) * (radius + 20),
      labelY: center + Math.sin(angle) * (radius + 20),
      labelAnchor: Math.cos(angle) > 0.25 ? 'start' : Math.cos(angle) < -0.25 ? 'end' : 'middle',
    };
  });
  const polygon = axisPoints
    .map((point) => {
      const value = Math.max(0, Math.min(100, point.competency.score ?? 0)) / 100;
      return `${center + Math.cos(point.angle) * radius * value},${center + Math.sin(point.angle) * radius * value}`;
    })
    .join(' ');
  const scoredCount = safeCompetencies.filter((competency) => (competency.evidenceCount ?? 0) > 0).length;

  return (
    <div className="competency-radar-panel">
      <div>
        <span>{domain} competency radar</span>
        <strong>{domains[domain].short}</strong>
        <p>{scoredCount} of {safeCompetencies.length} competencies sampled in this run.</p>
      </div>
      <svg viewBox="0 0 300 300" role="img" aria-label={`${domains[domain].name} competency radar graph`} className="competency-radar">
        {[0.25, 0.5, 0.75, 1].map((ring) => (
          <polygon
            key={ring}
            points={axisPoints
              .map((point) => `${center + Math.cos(point.angle) * radius * ring},${center + Math.sin(point.angle) * radius * ring}`)
              .join(' ')}
            className="radar-ring"
          />
        ))}
        {axisPoints.map((point) => (
          <line key={point.competency.id} x1={center} y1={center} x2={point.axisX} y2={point.axisY} className="radar-axis" />
        ))}
        <polygon points={polygon} className="competency-radar-score" style={{ stroke: domains[domain].color }} />
        {axisPoints.map((point, index) => {
          const score = point.competency.score ?? 0;
          const value = Math.max(0, Math.min(100, score)) / 100;
          const pointX = center + Math.cos(point.angle) * radius * value;
          const pointY = center + Math.sin(point.angle) * radius * value;
          return (
            <g key={point.competency.id}>
              <circle cx={pointX} cy={pointY} r={(point.competency.evidenceCount ?? 0) > 0 ? '5' : '3'} fill={domains[domain].color}>
                <title>{`${point.competency.label}: ${(point.competency.evidenceCount ?? 0) > 0 ? `${score}/100` : 'not sampled'}`}</title>
              </circle>
              <text x={point.labelX} y={point.labelY} textAnchor={point.labelAnchor} dominantBaseline="middle" className="competency-radar-label">
                C{index + 1}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="competency-radar-key">
        {safeCompetencies.map((competency, index) => (
          <p key={competency.id}>
            <span>C{index + 1}</span>
            <strong>{competency.label}</strong>
            <b>{(competency.evidenceCount ?? 0) > 0 ? `${competency.score}/100` : 'Not sampled'}</b>
          </p>
        ))}
      </div>
    </div>
  );
}

function getLabKeywordHit(label: string, draft: string) {
  const normalized = draft.toLowerCase();
  const keywordMap: Record<string, string[]> = {
    role: ['role', 'act as', 'you are', 'assistant'],
    task: ['draft', 'rewrite', 'create', 'write', 'improve', 'task'],
    context: ['context', 'customer', 'refund', 'case', 'facts', 'background'],
    source: ['policy', 'source', 'record', 'evidence', 'ticket', 'approved'],
    constraints: ['do not invent', 'privacy', 'constraint', 'do not', 'only use', 'avoid'],
    format: ['format', 'bullet', 'email', 'subject', 'tone', 'structure'],
    review: ['review', 'verify', 'human', 'approval', 'check', 'flag'],
  };
  return (keywordMap[label] ?? [label]).some((keyword) => normalized.includes(keyword));
}

function evaluateLab(config: LabConfig, state: { draft: string; selections: string[]; order: string[]; matches: Record<string, string> }) {
  if (config.kind === 'prompt') {
    const checklist = config.checklist ?? [];
    const hits = checklist.filter((item) => getLabKeywordHit(item, state.draft));
    return {
      score: Math.round((hits.length / Math.max(1, checklist.length)) * 100),
      strengths: hits.map((item) => `Included ${item}`),
      misses: checklist.filter((item) => !hits.includes(item)).map((item) => `Add ${item}`),
      summary: 'A strong prompt gives the AI a clear job, usable context, source boundaries, output format, and review rules.',
    };
  }

  if (config.kind === 'workflow') {
    const ideal = config.idealOrder ?? [];
    const correctPositions = state.order.filter((item, index) => item === ideal[index]);
    return {
      score: Math.round((correctPositions.length / Math.max(1, ideal.length)) * 100),
      strengths: correctPositions.map((item) => config.items?.find((labItem) => labItem.id === item)?.label ?? item),
      misses: ideal
        .filter((item, index) => state.order[index] !== item)
        .map((item, index) => `${index + 1}. ${config.items?.find((labItem) => labItem.id === item)?.label ?? item}`),
      summary: 'A safe workflow defines scope first, tests on known cases, inserts human approval, measures outcomes, and only then scales.',
    };
  }

  if (config.kind === 'trust' || config.kind === 'ownership') {
    const items = config.items ?? [];
    const correct = items.filter((item) => state.matches[item.id] === item.correct);
    return {
      score: Math.round((correct.length / Math.max(1, items.length)) * 100),
      strengths: correct.map((item) => item.label),
      misses: items
        .filter((item) => state.matches[item.id] !== item.correct)
        .map((item) => `${item.label} -> ${item.correct}`),
      summary: config.kind === 'trust'
        ? 'Trust improves when risks map to specific controls: data boundaries, permission gates, logs, and escalation paths.'
        : 'Good human-AI collaboration separates assistance from accountability.',
    };
  }

  const correctIds = (config.choices ?? []).filter((choice) => choice.correct).map((choice) => choice.id);
  const selectedCorrect = state.selections.filter((id) => correctIds.includes(id));
  const selectedIncorrect = state.selections.filter((id) => !correctIds.includes(id));
  const rawScore = ((selectedCorrect.length - selectedIncorrect.length * 0.5) / Math.max(1, correctIds.length)) * 100;
  return {
    score: Math.max(0, Math.round(rawScore)),
    strengths: selectedCorrect.map((id) => config.choices?.find((choice) => choice.id === id)?.label ?? id),
    misses: correctIds
      .filter((id) => !state.selections.includes(id))
      .map((id) => config.choices?.find((choice) => choice.id === id)?.label ?? id),
    summary: config.kind === 'next'
      ? 'The best next action is usually a bounded pilot with explicit risk controls and measurable evidence.'
      : 'Reliable judgment comes from checking source, date, provenance, missing conditions, and whether the claim is safe to act on.',
  };
}

export default function Home() {
  const [step, setStep] = useState<'home' | 'dashboard' | 'admin' | 'news' | 'lab' | 'developerReport' | 'onboarding' | 'premiumOnboarding' | 'executiveOnboarding' | 'assessment' | 'feedback' | 'results'>('home');
  const [mode, setMode] = useState<AssessmentMode>('free');
  const [newsFrequency, setNewsFrequency] = useState<NewsFrequency>('weekly');
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [authProfile, setAuthProfile] = useState<AuthProfile | null>(() => parseAuthProfile(readLocalStorage(authProfileStorageKey)));
  const [authEmail, setAuthEmail] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [activeLabKind, setActiveLabKind] = useState<LabKind>('prompt');
  const [landingLeaderboardPeriod, setLandingLeaderboardPeriod] = useState<LandingLeaderboardPeriod>('week');
  const [profilePulseOpen, setProfilePulseOpen] = useState(() => readLocalStorage(profilePulseStorageKey) !== 'dismissed');
  const [profilePulseSelections, setProfilePulseSelections] = useState<string[]>([]);
  const [labDraft, setLabDraft] = useState('');
  const [labSelections, setLabSelections] = useState<string[]>([]);
  const [labOrder, setLabOrder] = useState<string[]>(labConfigs.workflow.idealOrder ?? []);
  const [labMatches, setLabMatches] = useState<Record<string, string>>({});
  const [labFeedbackVisible, setLabFeedbackVisible] = useState(false);
  const [assessmentSeed, setAssessmentSeed] = useState(0);
  const [assessmentTargetTotal, setAssessmentTargetTotal] = useState(modeConfig.free.totalQuestions);
  const [continuationFocus, setContinuationFocus] = useState<ContinuationFocus | null>(null);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [surveyMode, setSurveyMode] = useState<AssessmentMode>('free');
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, string[]>>({});
  const [localProfileId] = useState(() => getOrCreateLocalProfileId());
  const [userProfileSurvey, setUserProfileSurvey] = useState<UserProfileSurvey | null>(() => (
    parseUserProfileSurvey(readLocalStorage(userProfileStorageKey))
  ));
  const [audience, setAudience] = useState<Audience>('general');
  const [functionTrack, setFunctionTrack] = useState<FunctionTrack>('general');
  const [industryTrack, setIndustryTrack] = useState<IndustryTrack>('general');
  const [executiveRole, setExecutiveRole] = useState<ExecutiveRole>('ceo');
  const [selectedPreviewDomain, setSelectedPreviewDomain] = useState<DomainId>('D3');
  const [selectedRadarDomain, setSelectedRadarDomain] = useState<DomainId>('D1');
  const [selectedDemoDomain, setSelectedDemoDomain] = useState<DomainId>('D4');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [current, setCurrent] = useState<Question>(() => selectNextQuestion([], 'free'));
  const [multiSelected, setMultiSelected] = useState<string[]>([]);
  const [rankOrder, setRankOrder] = useState<string[]>([]);
  const [matchSelections, setMatchSelections] = useState<Record<string, string>>({});
  const [partSelections, setPartSelections] = useState<Record<string, string>>({});
  const [textResponse, setTextResponse] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [lastAnswer, setLastAnswer] = useState<Answer | null>(null);
  const [pendingQuestion, setPendingQuestion] = useState<Question | null>(null);
  const [scoreLog, setScoreLog] = useState<ScoreLogEntry[]>(() => (
    parseScoreLog(readLocalStorage(scoreLogStorageKey))
  ));
  const [profileSignalLog, setProfileSignalLog] = useState<ProfileSignalLogEntry[]>(() => (
    parseProfileSignalLog(readLocalStorage(profileSignalLogStorageKey))
  ));
  const [behaviorLog, setBehaviorLog] = useState<AssessmentBehaviorEvent[]>(() => (
    parseBehaviorLog(readLocalStorage(behaviorLogStorageKey))
  ));
  const [assessmentFeedback, setAssessmentFeedback] = useState<AssessmentFeedbackSurvey[]>(() => (
    parseAssessmentFeedback(readLocalStorage(assessmentFeedbackStorageKey))
  ));
  const [supervisedAgentRuns, setSupervisedAgentRuns] = useState<SupervisedAgentRun[]>(() => (
    parseSupervisedAgentRuns(readLocalStorage(supervisedAgentRunsStorageKey))
  ));
  const [feedbackDraft, setFeedbackDraft] = useState<Omit<AssessmentFeedbackSurvey, 'id' | 'sessionId' | 'profileId' | 'createdAt' | 'groupKey'>>({
    clarity: 'clear',
    difficultyFit: 'right',
    artifactQuality: 'realistic',
    lengthFit: 'right',
    suggestions: '',
  });
  const [behaviorSessionId, setBehaviorSessionId] = useState(() => `session-${createAssessmentSeed().toString(36)}`);
  const behaviorSessionIdRef = useRef(behaviorSessionId);
  const questionStartedAtRef = useRef(0);
  const questionStartedIsoRef = useRef('');
  const questionInteractionCountRef = useRef(0);
  const questionRevisionCountRef = useRef(0);
  const activeAssessmentRef = useRef({
    active: false,
    answeredCount: 0,
    targetCount: modeConfig.free.totalQuestions,
    questionId: '',
    mode: 'free' as AssessmentMode,
    audience: 'general' as Audience,
    functionTrack: 'general' as FunctionTrack,
    industryTrack: 'general' as IndustryTrack,
    executiveRole: 'ceo' as ExecutiveRole,
  });
  const [loggedResultId, setLoggedResultId] = useState<string | null>(null);
  const [agentWorkflowReport, setAgentWorkflowReport] = useState<AgentWorkflowReport>(() => (
    getAgentWorkflowReport(
      allAssessmentItems.length,
      allAssessmentItems.filter((question) => question.stimulus || question.visualStimulus).length,
      0,
    )
  ));

  const activeConfig = useMemo(
    () => ({ ...modeConfig[mode], totalQuestions: assessmentTargetTotal }),
    [assessmentTargetTotal, mode],
  );
  const liveItemCount = allAssessmentItems.length;
  const artifactItemCount = allAssessmentItems.filter((question) => question.stimulus || question.visualStimulus).length;
  const multiPartItemCount = allAssessmentItems.filter((question) => question.interaction === 'parts').length;
  const interactionCount = new Set(allAssessmentItems.map((question) => question.interaction ?? 'single')).size;
  const scoreGroup = useMemo(
    () => getScoreGroup(mode, audience, functionTrack, industryTrack, executiveRole),
    [audience, executiveRole, functionTrack, industryTrack, mode],
  );
  const progress = Math.min(answers.length + (step === 'assessment' ? 1 : 0), activeConfig.totalQuestions);
  const results = useMemo(() => {
    const domainScores = getDomainScores(answers);
    const overall = Math.round(Object.values(domainScores).reduce((sum, value) => sum + value, 0) / Object.values(domainScores).length);
    const sortedDomains = (Object.keys(domainScores) as DomainId[]).sort((a, b) => domainScores[a] - domainScores[b]);
    const confidence = Math.min(mode === 'executive' ? 96 : mode === 'premium' ? 94 : 88, activeConfig.confidenceBase + answers.length * activeConfig.confidenceStep);
    return { domainScores, overall, level: scoreToLevel(overall, answers), weakest: sortedDomains.slice(0, 2), strongest: sortedDomains.slice(-2).reverse(), confidence };
  }, [activeConfig.confidenceBase, activeConfig.confidenceStep, answers, mode]);
  const currentMeasures = useMemo(() => getQuestionMeasures(current), [current]);
  const currentSkills = useMemo(() => getQuestionSkillLabels(current), [current]);
  const competencyScores = useMemo(() => getCompetencyScores(answers), [answers]);
  const domainEvidenceSummary = useMemo(() => getDomainEvidenceSummary(answers), [answers]);
  const evidenceModeSummary = useMemo(() => getEvidenceModeSummary(answers), [answers]);
  const scoreLogAnalytics = useMemo(() => getScoreLogAnalytics(scoreLog, profileSignalLog), [profileSignalLog, scoreLog]);
  const adminAnalytics = useMemo(() => getAdminAnalytics(scoreLog, profileSignalLog), [profileSignalLog, scoreLog]);
  const personaLeaderboard = useMemo(() => getPersonaLeaderboard(scoreLog, scoreGroup.key), [scoreGroup.key, scoreLog]);
  const landingLeaderboard = useMemo(
    () => getLandingLeaderboard(scoreLog, landingLeaderboardPeriod),
    [landingLeaderboardPeriod, scoreLog],
  );
  const landingPeerInsights = useMemo(
    () => getLandingPeerInsights(scoreLog, landingLeaderboard, landingLeaderboardPeriod),
    [landingLeaderboard, landingLeaderboardPeriod, scoreLog],
  );
  const questionBenchmarks = useMemo(() => getQuestionBenchmarks(behaviorLog), [behaviorLog]);
  const qualityInsights = useMemo(() => getQualityImprovementInsights(behaviorLog, assessmentFeedback), [assessmentFeedback, behaviorLog]);
  const detailedAnalysisUnlocked = assessmentFeedback.some((entry) => entry.sessionId === behaviorSessionId);
  const artifactReplacementBriefs = useMemo(() => {
    const seen = new Set<string>();
    return allAssessmentItems.reduce<Array<{ src: string; label: string; description: string; questionId: string }>>((briefs, question) => {
      if (!question.stimulus || seen.has(question.stimulus.src)) return briefs;
      seen.add(question.stimulus.src);
      briefs.push({
          src: question.stimulus!.src,
          label: question.stimulus!.label,
          description: `${question.stimulus!.caption} Create a realistic, legible ${domains[question.domain].short.toLowerCase()} work document with internally consistent names, dates, figures, provenance, and the evidence needed to answer ${question.id}. Avoid decorative mockup styling.`,
          questionId: question.id,
      });
      return briefs;
    }, []);
  }, []);
  const simulatedSignalCount = adminAnalytics.totalQuestionSignals || profileSignalLog.reduce((sum, entry) => sum + entry.questionSignals.length, 0);
  const latestSupervisedAgentRun = supervisedAgentRuns[0] ?? null;
  const pendingAgentDraftCount = supervisedAgentRuns.reduce(
    (sum, run) => sum + run.drafts.filter((draft) => draft.status === 'pending').length,
    0,
  );
  const approvedAgentDraftCount = supervisedAgentRuns.reduce(
    (sum, run) => sum + run.drafts.filter((draft) => draft.status === 'approved').length,
    0,
  );
  const rejectedAgentDraftCount = supervisedAgentRuns.reduce(
    (sum, run) => sum + run.drafts.filter((draft) => draft.status === 'rejected').length,
    0,
  );
  const userProfileTags = useMemo(() => userProfileSurvey?.tags ?? [], [userProfileSurvey]);
  const coveragePlan = useMemo(
    () => getCompetencyCoverage(competencyScores, mode, audience, functionTrack, industryTrack, executiveRole),
    [audience, competencyScores, executiveRole, functionTrack, industryTrack, mode],
  );
  const selectedDomainCompetencies = useMemo(
    () => coveragePlan.coverage.filter((competency) => competency.domain === selectedRadarDomain),
    [coveragePlan.coverage, selectedRadarDomain],
  );
  const profileTargetCompetencyIds = useMemo(
    () => getProfileTargetCompetencyIds(userProfileTags, functionTrack, executiveRole),
    [executiveRole, functionTrack, userProfileTags],
  );
  const continuationTargets = useMemo(() => {
    const confidenceIds = coveragePlan.coverage
      .filter((competency) => competency.evidenceCount > 0 && (competency.confidence !== 'high' || competency.score < 70))
      .sort((left, right) => left.score - right.score || left.evidenceCount - right.evidenceCount)
      .slice(0, 8)
      .map((competency) => competency.id);
    const priorityGapIds = coveragePlan.coverage
      .filter((competency) => competency.priority && competency.evidenceCount === 0)
      .map((competency) => competency.id);
    const domainIds = selectedDomainCompetencies
      .filter((competency) => competency.evidenceCount === 0 || competency.confidence !== 'high' || competency.score < 70)
      .map((competency) => competency.id);
    return {
      confidenceIds: confidenceIds.length ? confidenceIds : coveragePlan.coverage.filter((competency) => competency.evidenceCount === 0).slice(0, 8).map((competency) => competency.id),
      priorityGapIds,
      domainIds,
    };
  }, [coveragePlan.coverage, selectedDomainCompetencies]);
  const continuationRecommendation = useMemo(() => getContinuationRecommendation({
    coverage: coveragePlan.coverage,
    continuationTargets,
    selectedDomain: selectedRadarDomain,
    mode,
    audience,
    functionTrack,
    industryTrack,
    executiveRole,
    profileTags: userProfileTags,
    confidence: results.confidence,
  }), [
    audience,
    continuationTargets,
    coveragePlan.coverage,
    executiveRole,
    functionTrack,
    industryTrack,
    mode,
    results.confidence,
    selectedRadarDomain,
    userProfileTags,
  ]);
  const evidenceCompletion = useMemo(
    () => getEvidenceCompletionReadout(coveragePlan.coverage, answers.length, Math.min(60, allAssessmentItems.length)),
    [answers.length, coveragePlan.coverage],
  );
  const showEvidenceCompletionPanel = mode !== 'practice'
    && answers.length >= modeConfig[mode].totalQuestions
    && !evidenceCompletion.complete
    && evidenceCompletion.questionCount > 0;
  const telemetryAnalysis = useMemo(
    () => getTelemetryAnalysis(behaviorLog, answers, assessmentFeedback, coveragePlan.coverage),
    [answers, assessmentFeedback, behaviorLog, coveragePlan.coverage],
  );
  const previewDomainCompetencies = useMemo(
    () => getCompetenciesForDomain(selectedPreviewDomain),
    [selectedPreviewDomain],
  );
  const weakestCompetencies = useMemo(
    () => competencyScores
      .filter((competency) => competency.evidenceCount > 0)
      .sort((left, right) => left.score - right.score)
      .slice(0, 4),
    [competencyScores],
  );
  const benchmarkProfiles = useMemo(
    () => getBenchmarkProfiles(mode, audience, functionTrack, industryTrack, executiveRole),
    [audience, executiveRole, functionTrack, industryTrack, mode],
  );
  const groupAverageProfile = useMemo(
    () => averageScoreLog(scoreLog, scoreGroup.key),
    [scoreGroup.key, scoreLog],
  );
  const radarProfiles = useMemo(
    () => (groupAverageProfile ? [groupAverageProfile, ...benchmarkProfiles] : benchmarkProfiles),
    [benchmarkProfiles, groupAverageProfile],
  );
  const adaptiveReadout = useMemo(
    () => getAdaptiveReadout(answers, current, mode, activeConfig),
    [activeConfig, answers, current, mode],
  );
  const difficultyMovement = useMemo(() => getDifficultyMovement(lastAnswer, pendingQuestion), [lastAnswer, pendingQuestion]);
  const courseRecommendations = useMemo(
    () => getLearningRecommendations(results.weakest, mode, weakestCompetencies.map((competency) => competency.id), userProfileTags),
    [mode, results.weakest, userProfileTags, weakestCompetencies],
  );
  const personalizedExploration = useMemo(
    () => getPersonalizedExplorationPlan(mode, functionTrack, executiveRole, weakestCompetencies, userProfileTags),
    [executiveRole, functionTrack, mode, userProfileTags, weakestCompetencies],
  );
  const dashboardNews = useMemo(() => {
    const focusDomains = new Set(results.weakest);
    return trendFeed
      .filter((item) => focusDomains.has(item.domain as DomainId) || userProfileTags.join(' ').toLowerCase().includes(item.category.toLowerCase()))
      .slice(0, 4);
  }, [results.weakest, userProfileTags]);
  const personalizedDidYouKnow = useMemo(
    () => getPersonalizedDidYouKnow(userProfileTags, results.weakest, functionTrack, executiveRole, answers.length),
    [answers.length, executiveRole, functionTrack, results.weakest, userProfileTags],
  );
  const secondaryDidYouKnow = useMemo(
    () => didYouKnowInsights
      .filter((insight) => insight.id !== personalizedDidYouKnow.id)
      .filter((insight) => results.weakest.includes(insight.domain) || insight.competencyIds.some((id) => profileTargetCompetencyIds.includes(id)))
      .slice(0, 2),
    [personalizedDidYouKnow.id, profileTargetCompetencyIds, results.weakest],
  );
  const showContinuationPanel = mode !== 'practice'
    && !continuationFocus
    && assessmentTargetTotal === modeConfig[mode].totalQuestions
    && answers.length >= modeConfig[mode].totalQuestions;
  const earnedBadges = useMemo(
    () => (Object.keys(domains) as DomainId[])
      .map((domain) => ({
        domain,
        ...domainBadges[domain],
        score: results.domainScores[domain],
        earned: results.domainScores[domain] >= 70,
      }))
      .sort((left, right) => Number(right.earned) - Number(left.earned) || right.score - left.score),
    [results.domainScores],
  );
  const displayedOptions = useMemo(
    () => shuffledBySeed(current.options, assessmentSeed, `${current.id}:options`, (option) => option.id),
    [assessmentSeed, current],
  );
  const displayedMatchPairs = useMemo(
    () => shuffledBySeed(current.matchPairs ?? [], assessmentSeed, `${current.id}:pairs`, (pair) => pair.id),
    [assessmentSeed, current],
  );
  const displayedMatchChoices = useMemo(
    () => Object.fromEntries(
      (current.matchPairs ?? []).map((pair) => [
        pair.id,
        shuffledBySeed(pair.choices, assessmentSeed, `${current.id}:${pair.id}:choices`, (choice) => choice),
      ]),
    ) as Record<string, string[]>,
    [assessmentSeed, current],
  );
  const displayedParts = useMemo(
    () => shuffledBySeed(current.parts ?? [], assessmentSeed, `${current.id}:parts`, (part) => part.id),
    [assessmentSeed, current],
  );
  const displayedPartOptions = useMemo(
    () => Object.fromEntries(
      (current.parts ?? []).map((part) => [
        part.id,
        shuffledBySeed(part.options, assessmentSeed, `${current.id}:${part.id}:options`, (option) => option.id),
      ]),
    ) as Record<string, Option[]>,
    [assessmentSeed, current],
  );
  const activeSurveyQuestions = useMemo(
    () => getSurveyQuestionsForProfile(surveyMode, audience, functionTrack, executiveRole),
    [audience, executiveRole, functionTrack, surveyMode],
  );
  const activeSurveyContext = useMemo(
    () => getSurveyContextLabel(surveyMode, audience, functionTrack, executiveRole),
    [audience, executiveRole, functionTrack, surveyMode],
  );
  const activeLab = labConfigs[activeLabKind];
  const labEvaluation = evaluateLab(activeLab, {
    draft: labDraft,
    selections: labSelections,
    order: labOrder,
    matches: labMatches,
  });
  const labCanSubmit = activeLab.kind === 'prompt'
    ? labDraft.trim().length >= 20
    : activeLab.kind === 'trust' || activeLab.kind === 'ownership'
      ? (activeLab.items ?? []).every((item) => labMatches[item.id])
      : activeLab.kind === 'workflow'
        ? labOrder.length > 0
        : labSelections.length > 0;

  function appendBehaviorEvent(event: Partial<AssessmentBehaviorEvent> & Pick<AssessmentBehaviorEvent, 'type'>) {
    const eventMode = event.mode ?? mode;
    const nextEvent: AssessmentBehaviorEvent = {
      id: `${behaviorSessionIdRef.current}:${new Date().getTime()}:${createAssessmentSeed().toString(36)}`,
      createdAt: new Date().toISOString(),
      profileId: localProfileId,
      sessionId: behaviorSessionIdRef.current,
      mode: eventMode,
      audience,
      functionTrack: eventMode === 'premium' ? functionTrack : undefined,
      industryTrack: eventMode === 'premium' ? industryTrack : undefined,
      executiveRole: eventMode === 'executive' ? executiveRole : undefined,
      ...event,
    };
    setBehaviorLog((existing) => {
      const next = [nextEvent, ...existing].slice(0, 2500);
      writeLocalStorage(behaviorLogStorageKey, JSON.stringify(next));
      return next;
    });
    syncBehaviorEventToSupabase(authProfile, nextEvent);
  }

  function registerQuestionInteraction(revision = false) {
    questionInteractionCountRef.current += 1;
    if (revision) questionRevisionCountRef.current += 1;
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const recordAbandonment = () => {
      const active = activeAssessmentRef.current;
      if (!active.active || active.answeredCount >= active.targetCount) return;
      const existing = parseBehaviorLog(readLocalStorage(behaviorLogStorageKey));
      const event: AssessmentBehaviorEvent = {
        id: `${behaviorSessionIdRef.current}:abandon:${new Date().getTime()}`,
        createdAt: new Date().toISOString(),
        profileId: localProfileId,
        sessionId: behaviorSessionIdRef.current,
        type: 'assessment_abandoned',
        mode: active.mode,
        audience: active.audience,
        functionTrack: active.mode === 'premium' ? active.functionTrack : undefined,
        industryTrack: active.mode === 'premium' ? active.industryTrack : undefined,
        executiveRole: active.mode === 'executive' ? active.executiveRole : undefined,
        questionId: active.questionId,
        answeredCount: active.answeredCount,
        targetCount: active.targetCount,
      };
      writeLocalStorage(behaviorLogStorageKey, JSON.stringify([event, ...existing].slice(0, 2500)));
      activeAssessmentRef.current.active = false;
    };
    window.addEventListener('pagehide', recordAbandonment);
    return () => window.removeEventListener('pagehide', recordAbandonment);
  }, [localProfileId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const accessToken = params.get('access_token');
    if (!accessToken) return;
    fetchSupabaseUser(accessToken)
      .then((profile) => {
        if (!profile) {
          setAuthMessage('Google sign-in returned, but the profile could not be loaded.');
          return;
        }
        setAuthProfile(profile);
        writeLocalStorage(authProfileStorageKey, JSON.stringify(profile));
        syncUserProfileToSupabase(profile, userProfileSurvey, localProfileId);
        setAuthMessage(`Signed in as ${profile.email ?? profile.name ?? 'Google user'}.`);
        window.history.replaceState(null, '', window.location.pathname);
        setStep('dashboard');
      })
      .catch(() => setAuthMessage('Sign-in could not be completed. Check Supabase Auth configuration.'));
  }, [localProfileId, userProfileSurvey]);

  function logCompletedResults() {
    if (answers.length < activeConfig.totalQuestions) return;
    const resultId = `${mode}:${assessmentSeed}:${answers.length}`;
    if (loggedResultId === resultId) return;
    const entry: ScoreLogEntry = {
      id: resultId,
      createdAt: new Date().toISOString(),
      userId: authProfile?.id,
      userEmail: authProfile?.email,
      groupKey: scoreGroup.key,
      groupLabel: scoreGroup.label,
      mode,
      audience,
      functionTrack: mode === 'premium' ? functionTrack : undefined,
      industryTrack: mode === 'premium' ? industryTrack : undefined,
      executiveRole: mode === 'executive' ? executiveRole : undefined,
      scores: results.domainScores,
      competencyScores: toCompetencyScoreMap(competencyScores),
      evidenceModeScores: toEvidenceModeScoreMap(evidenceModeSummary),
      overall: results.overall,
    };
    setScoreLog((existing) => {
      const nextLog = [entry, ...existing.filter((item) => item.id !== resultId)].slice(0, 120);
      writeLocalStorage(scoreLogStorageKey, JSON.stringify(nextLog));
      return nextLog;
    });
    const profileSignalEntry: ProfileSignalLogEntry = {
      id: resultId,
      profileId: localProfileId,
      userId: authProfile?.id,
      userEmail: authProfile?.email,
      createdAt: entry.createdAt,
      groupKey: scoreGroup.key,
      groupLabel: scoreGroup.label,
      mode,
      audience,
      functionTrack: mode === 'premium' ? functionTrack : undefined,
      industryTrack: mode === 'premium' ? industryTrack : undefined,
      executiveRole: mode === 'executive' ? executiveRole : undefined,
      surveyContext: userProfileSurvey?.context,
      profileTags: userProfileTags,
      surveyAnswers: userProfileSurvey?.answers,
      questionSignals: buildQuestionSignalSnapshots(answers),
      domainScores: results.domainScores,
      competencyScores: toCompetencyScoreMap(competencyScores),
      evidenceModeScores: toEvidenceModeScoreMap(evidenceModeSummary),
      overall: results.overall,
    };
    setProfileSignalLog((existing) => {
      const nextLog = [profileSignalEntry, ...existing.filter((item) => item.id !== resultId)].slice(0, 120);
      writeLocalStorage(profileSignalLogStorageKey, JSON.stringify(nextLog));
      return nextLog;
    });
    syncAssessmentSessionToSupabase(authProfile, entry, profileSignalEntry);
    activeAssessmentRef.current.active = false;
    appendBehaviorEvent({ type: 'results_viewed', answeredCount: answers.length, targetCount: activeConfig.totalQuestions, score: results.overall });
    setLoggedResultId(resultId);
  }

  function runAgentWorkflowSimulation() {
    setAgentWorkflowReport(getAgentWorkflowReport(liveItemCount, artifactItemCount, simulatedSignalCount));
  }

  function runSupervisedAgentJobs() {
    const nextRun = getSupervisedAgentRun(liveItemCount, artifactItemCount, behaviorLog, assessmentFeedback, profileSignalLog);
    setSupervisedAgentRuns((existing) => {
      const next = [nextRun, ...existing].slice(0, 25);
      writeLocalStorage(supervisedAgentRunsStorageKey, JSON.stringify(next));
      return next;
    });
    setAgentWorkflowReport(getAgentWorkflowReport(liveItemCount, artifactItemCount, simulatedSignalCount));
  }

  function updateAgentDraftStatus(runId: string, draftId: string, status: AgentDraftStatus) {
    setSupervisedAgentRuns((existing) => {
      const next = existing.map((run) => {
        if (run.id !== runId) return run;
        const drafts = run.drafts.map((draft) => (draft.id === draftId ? { ...draft, status } : draft));
        const hasPending = drafts.some((draft) => draft.status === 'pending');
        return {
          ...run,
          status: hasPending ? 'review' : 'complete',
          drafts,
          activityLog: [
            ...run.activityLog,
            {
              step: run.activityLog.length + 1,
              agent: 'Admin reviewer',
              status: status === 'approved' ? 'complete' : status === 'rejected' ? 'blocked' : 'review',
              activity: `${status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Reopened'} draft proposal.`,
              output: drafts.find((draft) => draft.id === draftId)?.title ?? draftId,
            },
          ],
        };
      });
      writeLocalStorage(supervisedAgentRunsStorageKey, JSON.stringify(next));
      return next;
    });
  }

  function startAssessment(nextMode: AssessmentMode, targetCompetencyIds = profileTargetCompetencyIds) {
    const nextSeed = createAssessmentSeed();
    const nextSessionId = `session-${nextSeed.toString(36)}-${new Date().getTime().toString(36)}`;
    behaviorSessionIdRef.current = nextSessionId;
    setBehaviorSessionId(nextSessionId);
    const firstQuestion = selectNextQuestion([], nextMode, nextSeed, {
      functionTrack,
      industryTrack,
      targetCompetencyIds,
    });
    setMode(nextMode);
    setAssessmentSeed(nextSeed);
    setAssessmentTargetTotal(modeConfig[nextMode].totalQuestions);
    setContinuationFocus(null);
    setAnswers([]);
    setLastAnswer(null);
    setPendingQuestion(null);
    setLoggedResultId(null);
    setCurrent(firstQuestion);
    activeAssessmentRef.current = {
      active: true,
      answeredCount: 0,
      targetCount: modeConfig[nextMode].totalQuestions,
      questionId: firstQuestion.id,
      mode: nextMode,
      audience,
      functionTrack,
      industryTrack,
      executiveRole,
    };
    appendBehaviorEvent({ type: 'assessment_started', mode: nextMode, answeredCount: 0, targetCount: modeConfig[nextMode].totalQuestions });
    resetInteractionState(firstQuestion, nextSeed, 0);
    setStep('assessment');
  }

  function openProfileSurvey(nextMode: AssessmentMode) {
    setSurveyMode(nextMode);
    setSurveyAnswers({});
    setSurveyOpen(true);
  }

  function toggleSurveyAnswer(question: SurveyQuestion, option: string) {
    setSurveyAnswers((currentAnswers) => {
      const current = currentAnswers[question.id] ?? [];
      const next = question.multi
        ? current.includes(option)
          ? current.filter((item) => item !== option)
          : [...current, option]
        : [option];
      return { ...currentAnswers, [question.id]: next };
    });
  }

  function toggleProfilePulse(optionId: string) {
    setProfilePulseSelections((selected) =>
      selected.includes(optionId) ? selected.filter((id) => id !== optionId) : [...selected, optionId].slice(0, 3),
    );
  }

  function dismissProfilePulse() {
    writeLocalStorage(profilePulseStorageKey, 'dismissed');
    setProfilePulseOpen(false);
  }

  function applyProfilePulse() {
    const selectedOptions = microProfilePulse.options.filter((option) => profilePulseSelections.includes(option.id));
    const pulseTags = selectedOptions.map((option) => option.tag);
    const existing = userProfileSurvey ?? {
      updatedAt: new Date().toISOString(),
      context: 'Light profile pulse',
      answers: {},
      tags: [],
    };
    const profile: UserProfileSurvey = {
      updatedAt: new Date().toISOString(),
      context: existing.context,
      answers: {
        ...existing.answers,
        [microProfilePulse.id]: selectedOptions.map((option) => option.label),
      },
      tags: [...new Set([...existing.tags, ...pulseTags])].slice(0, 18),
    };
    setUserProfileSurvey(profile);
    writeLocalStorage(userProfileStorageKey, JSON.stringify(profile));
    writeLocalStorage(profilePulseStorageKey, 'dismissed');
    syncUserProfileToSupabase(authProfile, profile, localProfileId);
    appendBehaviorEvent({
      type: 'report_interest',
      reportArea: 'coverage',
      label: `Profile pulse: ${selectedOptions.map((option) => option.label).join(', ') || 'no selection'}`,
    });
    setProfilePulseOpen(false);
  }

  function saveProfileSurvey() {
    const tags = buildProfileTags(surveyAnswers, activeSurveyQuestions, activeSurveyContext);
    const profile: UserProfileSurvey = {
      updatedAt: new Date().toISOString(),
      context: activeSurveyContext,
      answers: surveyAnswers,
      tags,
    };
    setUserProfileSurvey(profile);
    writeLocalStorage(userProfileStorageKey, JSON.stringify(profile));
    syncUserProfileToSupabase(authProfile, profile, localProfileId);
    setSurveyOpen(false);
    startAssessment(surveyMode, getProfileTargetCompetencyIds(tags, functionTrack, executiveRole));
  }

  function skipProfileSurvey() {
    setSurveyOpen(false);
    startAssessment(surveyMode);
  }

  function signOutUser() {
    setAuthProfile(null);
    setAuthMessage('Signed out of this browser.');
    writeLocalStorage(authProfileStorageKey, '');
  }

  function startLabActivity(activity: PracticeActivity) {
    const config = labConfigs[activity.labKind];
    setActiveLabKind(activity.labKind);
    setLabDraft('');
    setLabSelections([]);
    setLabMatches({});
    setLabOrder([...(config.idealOrder ?? config.items?.map((item) => item.id) ?? [])].reverse());
    setLabFeedbackVisible(false);
    setStep('lab');
  }

  function toggleLabSelection(choiceId: string, single = false) {
    setLabFeedbackVisible(false);
    setLabSelections((selected) => {
      if (single) return [choiceId];
      return selected.includes(choiceId) ? selected.filter((id) => id !== choiceId) : [...selected, choiceId];
    });
  }

  function moveLabOrder(index: number, direction: -1 | 1) {
    setLabFeedbackVisible(false);
    setLabOrder((currentOrder) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= currentOrder.length) return currentOrder;
      const nextOrder = [...currentOrder];
      [nextOrder[index], nextOrder[nextIndex]] = [nextOrder[nextIndex], nextOrder[index]];
      return nextOrder;
    });
  }

  function resetInteractionState(question: Question, seed = assessmentSeed, stepIndex = answers.length) {
    setMultiSelected([]);
    setRankOrder(
      question.rankItems
        ? shuffledBySeed(question.rankItems, seed, `${question.id}:rank:${stepIndex}`, (item) => item.id).map((item) => item.id)
        : [],
    );
    setMatchSelections({});
    setPartSelections({});
    setTextResponse('');
    setDraggedIndex(null);
    questionStartedAtRef.current = new Date().getTime();
    questionStartedIsoRef.current = new Date().toISOString();
    questionInteractionCountRef.current = 0;
    questionRevisionCountRef.current = 0;
    activeAssessmentRef.current.questionId = question.id;
    appendBehaviorEvent({
      type: 'question_shown',
      mode: activeAssessmentRef.current.mode,
      questionId: question.id,
      domain: question.domain,
      competencyIds: getQuestionMeasures(question).map((competency) => competency.id),
      difficulty: question.difficulty,
      interaction: question.interaction ?? 'single',
      answeredCount: stepIndex,
      targetCount: activeAssessmentRef.current.targetCount,
    });
  }

  function submitAnswer(option: Option, details?: { textResponse?: string; rubricHits?: RubricCriterion[]; partSelections?: Record<string, string>; partScores?: Array<{ partId: string; domain: DomainId; score: number }> }) {
    const durationMs = Math.max(0, new Date().getTime() - questionStartedAtRef.current);
    const readinessScore = getReadinessScore(option.score, current.difficulty);
    const hesitation: QuestionBehaviorSnapshot['hesitation'] = questionRevisionCountRef.current >= 5 || (durationMs >= 45000 && readinessScore < 58)
      ? 'confusing'
      : durationMs >= 45000 || questionInteractionCountRef.current >= 5
        ? 'slow'
        : durationMs <= 12000 && readinessScore >= 72
          ? 'fast-clear'
          : 'clear';
    const behavior: QuestionBehaviorSnapshot = {
      startedAt: questionStartedIsoRef.current,
      answeredAt: new Date().toISOString(),
      durationMs,
      interactionCount: Math.max(1, questionInteractionCountRef.current),
      revisionCount: questionRevisionCountRef.current,
      hesitation,
    };
    const completedAnswer: Answer = { question: current, option, ...details, behavior };
    const nextAnswers = [...answers, completedAnswer];
    const maxOptionScore = Math.max(...current.options.map((item) => item.score), option.score);
    const correctOptionIds = current.correctOptionIds ?? current.options.filter((item) => item.score === maxOptionScore).map((item) => item.id);
    appendBehaviorEvent({
      type: 'question_answered',
      questionId: current.id,
      domain: current.domain,
      competencyIds: getQuestionMeasures(current).map((competency) => competency.id),
      difficulty: current.difficulty,
      interaction: current.interaction ?? 'single',
      durationMs,
      interactionCount: behavior.interactionCount,
      revisionCount: behavior.revisionCount,
      hesitation,
      answeredCount: nextAnswers.length,
      targetCount: activeConfig.totalQuestions,
      score: readinessScore,
      selectedOptionId: option.id,
      selectedAnswer: details?.textResponse?.trim() || option.label,
      correctOptionIds,
    });
    setAnswers(nextAnswers);
    setLastAnswer(completedAnswer);
    activeAssessmentRef.current.answeredCount = nextAnswers.length;
    if (nextAnswers.length >= activeConfig.totalQuestions) {
      activeAssessmentRef.current.active = false;
      if (nextAnswers.length === modeConfig[mode].totalQuestions) {
        appendBehaviorEvent({ type: 'mandatory_completed', answeredCount: nextAnswers.length, requiredCount: modeConfig[mode].totalQuestions, targetCount: activeConfig.totalQuestions });
      }
      setPendingQuestion(null);
      setStep('feedback');
      return;
    }
    const nextQuestion = selectNextQuestion(nextAnswers, mode, assessmentSeed, {
      functionTrack,
      industryTrack,
      targetDomain: continuationFocus?.targetDomain,
      targetCompetencyIds: continuationFocus?.targetCompetencyIds ?? profileTargetCompetencyIds,
      totalQuestions: activeConfig.totalQuestions,
    });
    setPendingQuestion(nextQuestion);
    setStep('feedback');
  }

  function continueAfterFeedback() {
    if (!pendingQuestion) {
      if (answers.length === modeConfig[mode].totalQuestions && !continuationFocus) {
        appendBehaviorEvent({ type: 'continuation_declined', continuationKind: 'declined', answeredCount: answers.length, requiredCount: modeConfig[mode].totalQuestions });
      }
      logCompletedResults();
      setStep('results');
      return;
    }
    setCurrent(pendingQuestion);
    setPendingQuestion(null);
    resetInteractionState(pendingQuestion, assessmentSeed, answers.length);
    setStep('assessment');
  }

  function continueAssessment(focus: ContinuationFocus, addedQuestions = 6) {
    const nextTargetTotal = answers.length + addedQuestions;
    const nextSeed = assessmentSeed || createAssessmentSeed();
    const nextQuestion = selectNextQuestion(answers, mode, nextSeed, {
      functionTrack,
      industryTrack,
      targetDomain: focus.targetDomain,
      targetCompetencyIds: focus.targetCompetencyIds,
      totalQuestions: nextTargetTotal,
    });
    setAssessmentSeed(nextSeed);
    setAssessmentTargetTotal(nextTargetTotal);
    setContinuationFocus(focus);
    setPendingQuestion(null);
    setLastAnswer(null);
    setLoggedResultId(null);
    setCurrent(nextQuestion);
    activeAssessmentRef.current.active = true;
    activeAssessmentRef.current.targetCount = nextTargetTotal;
    appendBehaviorEvent({ type: 'continuation_accepted', continuationKind: focus.kind, label: focus.label, answeredCount: answers.length, requiredCount: modeConfig[mode].totalQuestions, targetCount: nextTargetTotal });
    resetInteractionState(nextQuestion, nextSeed, answers.length);
    setStep('assessment');
  }

  function continueEvidenceCompletion() {
    if (!showEvidenceCompletionPanel) return;
    continueAssessment({
      kind: 'confidence',
      label: 'Evidence completion route',
      targetCompetencyIds: evidenceCompletion.targetIds,
    }, evidenceCompletion.questionCount);
  }

  function chooseOption(option: Option) {
    registerQuestionInteraction();
    submitAnswer(option);
  }

  function toggleMultiOption(id: string) {
    registerQuestionInteraction(true);
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
    registerQuestionInteraction(true);
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

  function chooseMatch(pairId: string, value: string) {
    registerQuestionInteraction(true);
    setMatchSelections((selections) => ({ ...selections, [pairId]: value }));
  }

  function updateTextResponse(value: string) {
    registerQuestionInteraction(true);
    setTextResponse(value);
  }

  function submitTextAnswer() {
    const result = scoreTextAnswer(current, textResponse);
    submitAnswer(
      {
        id: 'written',
        label: textResponse.trim() || 'No written response',
        score: result.score,
        feedback: result.score >= 80 ? 'Strong written evidence against the rubric.' : 'Partial written evidence. Compare your response to the exemplar and rubric.',
      },
      { textResponse, rubricHits: result.hits },
    );
  }

  function choosePartOption(partId: string, optionId: string) {
    registerQuestionInteraction(true);
    setPartSelections((selections) => ({ ...selections, [partId]: optionId }));
  }

  function submitAssessmentFeedback() {
    const entry: AssessmentFeedbackSurvey = {
      id: `${behaviorSessionIdRef.current}:feedback`,
      sessionId: behaviorSessionIdRef.current,
      profileId: localProfileId,
      createdAt: new Date().toISOString(),
      groupKey: scoreGroup.key,
      ...feedbackDraft,
    };
    setAssessmentFeedback((existing) => {
      const next = [entry, ...existing.filter((item) => item.sessionId !== entry.sessionId)].slice(0, 500);
      writeLocalStorage(assessmentFeedbackStorageKey, JSON.stringify(next));
      return next;
    });
    syncAssessmentFeedbackToSupabase(authProfile, entry);
    appendBehaviorEvent({ type: 'assessment_feedback_submitted', answeredCount: answers.length, score: results.overall });
  }

  function selectReportDomain(domain: DomainId, area: AssessmentBehaviorEvent['reportArea'] = 'domain') {
    setSelectedRadarDomain(domain);
    appendBehaviorEvent({ type: 'report_interest', reportArea: area, label: `${domain}: ${domains[domain].name}`, domain });
  }

  function trackArtifactAction(question: Question, action: 'reader' | 'zoom' | 'external', zoomLevel?: number) {
    appendBehaviorEvent({
      type: action === 'reader' ? 'artifact_opened' : action === 'zoom' ? 'artifact_zoomed' : 'artifact_external_opened',
      questionId: question.id,
      domain: question.domain,
      competencyIds: getQuestionMeasures(question).map((competency) => competency.id),
      difficulty: question.difficulty,
      interaction: question.interaction ?? 'single',
      artifactSrc: question.stimulus?.src,
      artifactAction: action,
      zoomLevel,
      answeredCount: answers.length,
      targetCount: activeConfig.totalQuestions,
    });
  }

  function followDidYouKnow(insight: DidYouKnowInsight) {
    appendBehaviorEvent({
      type: 'report_interest',
      reportArea: 'coverage',
      label: `Did you know: ${insight.topic}`,
      domain: insight.domain,
      competencyIds: insight.competencyIds,
    });
    if (insight.learnAction === 'news') {
      setStep('news');
      return;
    }
    if (insight.learnAction === 'labs') {
      showHomeSection('labs');
      return;
    }
    if (insight.learnAction === 'premium') {
      setStep('premiumOnboarding');
      return;
    }
    setStep('onboarding');
  }

  function submitPartAnswers() {
    const result = scoreParts(current, partSelections);
    submitAnswer(
      {
        id: Object.entries(partSelections).map(([partId, optionId]) => `${partId}:${optionId}`).join('|') || 'unanswered-parts',
        label: `${result.partScores.filter((partScore) => partScore.score >= 82).length} of ${result.partScores.length} mini-parts strong`,
        score: result.score,
        feedback: result.score >= 82 ? 'Strong concept-cluster evidence.' : 'Partial concept-cluster evidence. Review the mini-part explanations and follow-up domains.',
      },
      { partSelections, partScores: result.partScores },
    );
  }

  function showHomeSection(sectionId: string) {
    setStep('home');
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }

  const activeLearningCatalog = mode === 'executive' ? executiveLearningCatalog : learningCatalog;
  const improvementBrief = getImprovementBrief(results.domainScores, benchmarkProfiles, activeLearningCatalog);
  const generatedReport = getGeneratedReport(
    mode,
    audience,
    functionTrack,
    industryTrack,
    executiveRole,
    answers,
    results,
    benchmarkProfiles,
    coveragePlan.coverage,
    evidenceModeSummary,
    improvementBrief,
    personalizedExploration,
    courseRecommendations,
  );
  const useRelianceStage = false;

  return (
    <main>
      {surveyOpen && (
        <div className="survey-backdrop" role="presentation">
          <section className="profile-survey" role="dialog" aria-modal="true" aria-labelledby="profile-survey-title">
            <div className="profile-survey-header">
              <div>
                <p className="eyebrow">Optional profile survey</p>
                <h1 id="profile-survey-title">Personalize your assessment.</h1>
                <p>
                  Tell us what you already use, what similar people in your role are exploring, and what you may want to learn next.
                  New Horizon uses these signals to tune examples, learning paths, and cohort analysis.
                </p>
              </div>
              <button type="button" className="icon-close" onClick={skipProfileSurvey} aria-label="Skip profile survey">X</button>
            </div>
            <div className="profile-context-card">
              <span>Current context</span>
              <strong>{activeSurveyContext}</strong>
              <p>These answers are stored locally in the MVP as profile and interest signals. Production should add consent, versioning, privacy controls, and backend profile graph storage.</p>
            </div>
            <div className="survey-question-list">
              {activeSurveyQuestions.map((question) => (
                <fieldset key={question.id}>
                  <legend>{question.label}</legend>
                  <div className="survey-option-grid">
                    {question.options.map((option) => {
                      const selected = (surveyAnswers[question.id] ?? []).includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          className={selected ? 'selected' : ''}
                          onClick={() => toggleSurveyAnswer(question, option)}
                          aria-pressed={selected}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
            <div className="profile-ontology-note">
              <span>Profile graph seed</span>
              <p>Tool choices, workflows, risk concerns, artifacts, role, function, and industry become tags that can later connect to competencies, courses, question routing, and cohort analytics.</p>
            </div>
            <div className="survey-actions">
              <button type="button" className="secondary dark" onClick={skipProfileSurvey}>Skip for now</button>
              <button type="button" className="primary" onClick={saveProfileSurvey}>Save profile and start</button>
            </div>
          </section>
        </div>
      )}
      {step === 'home' && profilePulseOpen && (
        <aside className="profile-pulse-card" aria-label="Optional profile pulse">
          <div>
            <p className="eyebrow">Optional profile pulse</p>
            <h2>{microProfilePulse.title}</h2>
            <p>{microProfilePulse.prompt}</p>
          </div>
          <div className="profile-pulse-options">
            {microProfilePulse.options.map((option) => {
              const selected = profilePulseSelections.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  className={selected ? 'selected' : ''}
                  onClick={() => toggleProfilePulse(option.id)}
                  aria-pressed={selected}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <div className="profile-pulse-actions">
            <button type="button" className="secondary dark" onClick={dismissProfilePulse}>Skip</button>
            <button type="button" className="primary" disabled={!profilePulseSelections.length} onClick={applyProfilePulse}>Tune my test</button>
          </div>
          <small>Used to route questions and recommendations in this browser.</small>
        </aside>
      )}
      <header className="topbar">
        <button className="brand nav-reset" onClick={() => setStep('home')} aria-label="New Horizon home">
          <span className="brand-mark">NH</span>
          <span>New Horizon</span>
        </button>
        <nav aria-label="Primary navigation">
          <button onClick={() => setStep('dashboard')}>User Login</button>
          <button onClick={() => setStep('dashboard')}>User Dashboard</button>
          <button onClick={() => setStep('admin')}>Admin Login</button>
          <button onClick={() => setStep('admin')}>Agent Ops</button>
          <button onClick={() => showHomeSection('platform')}>Platform</button>
          <button onClick={() => showHomeSection('labs')}>Learn by doing</button>
          <button onClick={() => setStep('developerReport')}>Demo Report</button>
          <button onClick={() => setStep('news')}>AI Watch</button>
          <button onClick={() => showHomeSection('results')}>Results</button>
        </nav>
        <button className="small-button" onClick={() => setStep('onboarding')}>Start</button>
      </header>

      {step === 'home' && (
        <>
          <section id="top" className="hero">
            <div className="hero-copy">
              <p className="eyebrow">AI-powered readiness assessment</p>
              <h1>Measure practical AI readiness.</h1>
              <p className="lede">
                New Horizon is an adaptive assessment platform for real AI capability: inspect artifacts,
                verify sources, choose safe workflows, govern agents, and turn scores into learning paths.
              </p>
              <div className="hero-actions">
                <button className="primary" onClick={() => setStep('onboarding')}>Start Free Assessment</button>
                <button className="secondary" onClick={() => setStep('premiumOnboarding')}>Start Premium Pilot</button>
                <button className="secondary" onClick={() => setStep('executiveOnboarding')}>Executive Assessment</button>
                <a className="secondary" href="#process">See How It Works</a>
              </div>
            </div>
            <div className="hero-panel" aria-label="Assessment preview">
              <div className="preview-card assessment-preview-card">
                <span className="status-dot" />
                <p>Adaptive assessment platform</p>
                <strong>Artifacts, scoring, radar, learning paths</strong>
              </div>
              <div className="assessment-snapshot" aria-label="Assessment platform snapshot">
                {[
                  ['Raw artifacts', 'Invoices, reports, policies, source packets, workflows'],
                  ['Question formats', 'Single, multi-select, matching, drag-order, written response, mini-parts'],
                  ['Adaptive engine', 'Domain coverage plus difficulty up/down after each answer'],
                  ['Decision output', 'D1-D6 radar, group average, research target, learning path'],
                ].map(([title, body]) => (
                  <div key={title}>
                    <span>{title}</span>
                    <p>{body}</p>
                  </div>
                ))}
              </div>
              <div className="preview-question">
                <p>Example task</p>
                <strong>Inspect a raw policy packet. What did the AI overstate, omit, or make unsafe?</strong>
              </div>
            </div>
          </section>

          <section className="stats" aria-label="MVP scope highlights">
            <div><strong>{liveItemCount}</strong><span>live seed items</span></div>
            <div><strong>{artifactItemCount}</strong><span>artifact-backed items</span></div>
            <div><strong>{multiPartItemCount}</strong><span>multi-part clusters</span></div>
            <div><strong>6</strong><span>AILF domains</span></div>
            <div><strong>{interactionCount}</strong><span>question formats</span></div>
          </section>

          <section className="section did-you-know-section" aria-labelledby="did-you-know-title">
            <article className="did-you-know-card featured">
              <div>
                <p className="eyebrow">Did you know?</p>
                <span>{personalizedDidYouKnow.domain} · {personalizedDidYouKnow.topic}</span>
                <h2 id="did-you-know-title">{personalizedDidYouKnow.fact}</h2>
                <p>{personalizedDidYouKnow.whyItMatters}</p>
              </div>
              <div className="did-you-know-actions">
                <button className="primary" type="button" onClick={() => followDidYouKnow(personalizedDidYouKnow)}>Learn more</button>
                <button className="secondary dark" type="button" onClick={() => openProfileSurvey('free')}>Tune topics</button>
              </div>
            </article>
            <div className="did-you-know-grid">
              {(secondaryDidYouKnow.length ? secondaryDidYouKnow : didYouKnowInsights.filter((insight) => insight.id !== personalizedDidYouKnow.id).slice(0, 2)).map((insight) => (
                <article key={insight.id} className="did-you-know-card compact">
                  <span>{insight.domain} · {insight.topic}</span>
                  <strong>{insight.fact}</strong>
                  <p>{insight.whyItMatters}</p>
                  <button className="text-button" type="button" onClick={() => followDidYouKnow(insight)}>Learn more</button>
                </article>
              ))}
            </div>
          </section>

          <section className="section peer-board-section" aria-labelledby="peer-board-title">
            <div className="section-heading-row">
              <div>
                <p className="eyebrow">Peer challenge</p>
                <h2 id="peer-board-title">Where would you land today?</h2>
                <p>
                  Compare against the visible top 10 for the day or week, then take the assessment to see
                  whether your strongest domain is enough to break into your peer group.
                </p>
              </div>
              <div className="period-toggle" aria-label="Leaderboard period">
                {(['day', 'week'] as LandingLeaderboardPeriod[]).map((period) => (
                  <button
                    key={period}
                    type="button"
                    className={landingLeaderboardPeriod === period ? 'selected' : ''}
                    onClick={() => setLandingLeaderboardPeriod(period)}
                  >
                    {period === 'day' ? 'Today' : 'This week'}
                  </button>
                ))}
              </div>
            </div>
            <div className="peer-board-grid">
              <article className="peer-leaderboard-card">
                <div className="peer-card-heading">
                  <div>
                    <span>Top 10</span>
                    <strong>{landingLeaderboardPeriod === 'day' ? 'Daily board' : 'Weekly board'}</strong>
                  </div>
                  <small>{landingLeaderboard.some((row) => row.source === 'local') ? 'Local pilot data' : 'Demo until your first runs'}</small>
                </div>
                <div className="landing-leaderboard-list">
                  {landingLeaderboard.map((row) => (
                    <div key={row.id} className={row.source}>
                      <b>#{row.rank}</b>
                      <span>
                        <strong>{row.displayName}</strong>
                        <small>{row.groupLabel}</small>
                      </span>
                      <i>{row.strongestDomain}</i>
                      <em>{row.overall}</em>
                    </div>
                  ))}
                </div>
              </article>
              <div className="peer-insight-grid">
                {landingPeerInsights.map((insight) => (
                  <article key={insight.label} className="peer-insight-card">
                    <span>{insight.label}</span>
                    <strong>{insight.value}</strong>
                    <p>{insight.detail}</p>
                  </article>
                ))}
                <article className="peer-cta-card">
                  <span>Find your rank</span>
                  <strong>Can you beat your peer average?</strong>
                  <p>Scores above 80 need stronger applied or advanced evidence, not just easy-item correctness.</p>
                  <div className="hero-actions">
                    <button className="primary" onClick={() => setStep('onboarding')}>Take the free test</button>
                    <button className="secondary dark" onClick={() => setStep('premiumOnboarding')}>Choose peer group</button>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section id="labs" className="section field-lab">
            <div>
              <p className="eyebrow">Learn by doing</p>
              <h2>Practice the activities the assessment is built from.</h2>
              <p>
                Each activity box maps to a practical assessment format. Users do not just read about AI;
                they inspect, repair, verify, sequence, match, and explain.
              </p>
            </div>
            <div className="activity-grid">
              {learnByDoingActivities.map((activity) => (
                <button className="activity-card" key={activity.title} onClick={() => startLabActivity(activity)} type="button">
                  <div>
                    <span>{activity.domain} · {domains[activity.domain].short}</span>
                    <strong>{activity.format}</strong>
                  </div>
                  <h3>{activity.title}</h3>
                  <p>{activity.detail}</p>
                  <small>Start activity</small>
                </button>
              ))}
            </div>
            <div className="room-grid">
              {fieldLabRooms.map((activity) => (
                <button className="room-card" key={activity.title} onClick={() => startLabActivity(activity)} type="button">
                  <span>{activity.domain} · {activity.format}</span>
                  <h3>{activity.title}</h3>
                  <p>{activity.detail}</p>
                </button>
              ))}
            </div>
          </section>

          <section id="platform" className="section two-column">
            <div>
              <p className="eyebrow">The platform</p>
              <h2>A field test for the way people actually use AI.</h2>
              <p>
                New Horizon turns AI readiness into observable behavior. Users inspect messy artifacts,
                make judgment calls, explain evidence, and see how their choices change the next task.
              </p>
            </div>
            <div className="card-grid">
              {[
                ['Evidence over opinion', 'The assessment asks users to prove what they trust, reject, revise, or escalate.'],
                ['Adaptive under the hood', 'Difficulty and domain focus move as the score estimate and coverage gaps change.'],
                ['Useful after the score', 'Results point to competencies, practical skills, benchmarks, and real learning options.'],
              ].map(([title, body]) => (
                <article className="info-card" key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section gamification-section">
            <div>
              <p className="eyebrow">Progress system</p>
              <h2>Make readiness feel earned.</h2>
              <p>
                Gamification should reward careful judgment, evidence review, and improvement over time.
                The goal is confidence through practice, not points for rushing.
              </p>
            </div>
            <div className="game-grid">
              {gamificationRules.map(([title, body]) => (
                <article className="game-card" key={title}>
                  <span>{title}</span>
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
                ['01', 'Build a light profile', 'Choose your audience, role, tools, interests, and peer-tool awareness.'],
                ['02', 'Answer adaptive scenarios', 'Questions create domain, competency, skill, difficulty, and behavior signals.'],
                ['03', 'Decide whether to keep going', 'If confidence or coverage is weak, add targeted questions before final results.'],
                ['04', 'Follow a learning path', 'See tools, concepts, labs, and courses matched to your profile and gaps.'],
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
              <RadarChart
                scores={{ D1: 72, D2: 68, D3: 46, D4: 58, D5: 64, D6: 76 }}
                selectedDomain={selectedPreviewDomain}
                onSelectDomain={setSelectedPreviewDomain}
              />
              <div className="preview-domain-drilldown">
                <span>{selectedPreviewDomain} · {domains[selectedPreviewDomain].name}</span>
                <strong>Competency map</strong>
                <div>
                  {previewDomainCompetencies.map((competency) => (
                    <p key={competency.id}>
                      <b>{competency.label}</b>
                      <small>{competency.skills.slice(0, 3).join(', ')}</small>
                    </p>
                  ))}
                </div>
              </div>
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

      {step === 'dashboard' && (
        <section className="dashboard-shell">
          <div className="dashboard-hero">
            <div>
              <p className="eyebrow">Registered user landing page</p>
              <h1>Your AI readiness dashboard.</h1>
              <p>
                This is the logged-in home experience for New Horizon. It brings together profile signals,
                assessment progress, recommended tools and concepts, learning actions, and a personalized AI Watch feed.
              </p>
            </div>
            <div className="dashboard-identity">
              <span>{authProfile ? 'Signed in' : isSupabaseConfigured() ? 'Sign in available' : 'Auth setup needed'}</span>
              <strong>{authProfile?.name ?? userProfileSurvey?.context ?? (mode === 'executive' ? executiveLabels[executiveRole] : mode === 'premium' ? functionLabels[functionTrack] : audienceLabels[audience])}</strong>
              <p>{authProfile?.email ?? localProfileId}</p>
              {authProfile ? (
                <>
                  <button className="primary" type="button" onClick={() => openProfileSurvey(mode === 'practice' ? 'free' : mode)}>Update profile signals</button>
                  <button className="secondary" type="button" onClick={signOutUser}>Sign out</button>
                </>
              ) : (
                <div className="auth-actions">
                  <button className="primary" type="button" onClick={() => startGoogleSignIn(setAuthMessage)}>Continue with Google</button>
                  <div className="email-auth-row">
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(event) => setAuthEmail(event.target.value)}
                      placeholder="you@example.com"
                      aria-label="Email for magic link"
                    />
                    <button className="secondary" type="button" onClick={() => sendEmailMagicLink(authEmail, setAuthMessage)}>Email link</button>
                  </div>
                  <button className="secondary" type="button" onClick={() => openProfileSurvey(mode === 'practice' ? 'free' : mode)}>Continue as guest</button>
                </div>
              )}
              <small>{authMessage || (isSupabaseConfigured() ? 'Google profile seeds email, name, avatar URL, and provider ID. Role/function signals still come from New Horizon.' : 'Set Supabase public env vars to activate Google and email login.')}</small>
            </div>
          </div>

          <div className="dashboard-grid">
            <article className="dashboard-card profile-overview">
              <span>Profile signals</span>
              <h2>{userProfileSurvey ? userProfileSurvey.tags.length : 0} saved tags</h2>
              {userProfileSurvey ? (
                <div className="profile-tag-grid">
                  {userProfileSurvey.tags.slice(0, 10).map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              ) : (
                <p>No profile survey saved yet. Registered users should be prompted to update tools, workflows, peer-tool awareness, and learning interests.</p>
              )}
            </article>

            <article className="dashboard-card progress-overview">
              <span>Progress</span>
              <h2>{scoreLogAnalytics.totalRuns} saved run{scoreLogAnalytics.totalRuns === 1 ? '' : 's'}</h2>
              <div className="dashboard-stats">
                <div><strong>{scoreLogAnalytics.totalRuns ? `${scoreLogAnalytics.averageOverall}/100` : 'New'}</strong><small>average readiness</small></div>
                <div><strong>{scoreLogAnalytics.signalSnapshots || 0}</strong><small>question signals</small></div>
                <div><strong>{coveragePlan.sampled}/24</strong><small>competencies sampled</small></div>
              </div>
              <button className="secondary dark" type="button" onClick={() => setStep('onboarding')}>Take assessment</button>
            </article>

            <article className="dashboard-card radar-overview">
              <span>Readiness profile</span>
              <RadarChart
                scores={results.domainScores}
                benchmarks={radarProfiles}
                selectedDomain={selectedRadarDomain}
                onSelectDomain={setSelectedRadarDomain}
              />
            </article>

            <article className="dashboard-card recommendation-overview">
              <span>Personalized recommendations</span>
              <h2>Explore next</h2>
              <div className="personalized-exploration dashboard-exploration">
                <div>
                  <span>Tools</span>
                  <div className="profile-tag-grid">
                    {personalizedExploration.tools.slice(0, 5).map((tool) => <span key={tool}>{tool}</span>)}
                  </div>
                </div>
                <div>
                  <span>Concepts</span>
                  <div className="profile-tag-grid">
                    {personalizedExploration.concepts.slice(0, 5).map((concept) => <span key={concept}>{concept}</span>)}
                  </div>
                </div>
                <div>
                  <span>Practice</span>
                  <div className="profile-tag-grid">
                    {personalizedExploration.practice.slice(0, 3).map((activity) => <span key={activity}>{activity}</span>)}
                  </div>
                </div>
              </div>
            </article>

            <article className="dashboard-card did-you-know-dashboard">
              <span>Did you know?</span>
              <h2>{personalizedDidYouKnow.topic}</h2>
              <p>{personalizedDidYouKnow.fact}</p>
              <small>{personalizedDidYouKnow.whyItMatters}</small>
              <div className="dashboard-card-actions">
                <button className="secondary dark" type="button" onClick={() => followDidYouKnow(personalizedDidYouKnow)}>Learn more</button>
                <button className="text-button" type="button" onClick={() => openProfileSurvey(mode === 'practice' ? 'free' : mode)}>Retune profile</button>
              </div>
            </article>

            <article className="dashboard-card learning-overview">
              <span>Learning path</span>
              <h2>Recommended courses</h2>
              <div className="dashboard-course-list">
                {courseRecommendations.slice(0, 3).map((course) => (
                  <a key={course.id} href={course.url} target="_blank" rel="noreferrer">
                    <strong>{course.title}</strong>
                    <small>{course.provider} · {course.level}</small>
                  </a>
                ))}
              </div>
            </article>

            <article className="dashboard-card news-overview">
              <span>Personalized AI Watch</span>
              <h2>Signals for your gaps</h2>
              <div className="dashboard-news-list">
                {(dashboardNews.length ? dashboardNews : trendFeed.slice(0, 4)).map((item) => (
                  <a key={item.title} href={item.url} target="_blank" rel="noreferrer">
                    <small>{item.category} · {item.source}</small>
                    <strong>{item.title}</strong>
                  </a>
                ))}
              </div>
              <button className="secondary dark" type="button" onClick={() => setStep('news')}>Open AI Watch</button>
            </article>
          </div>
        </section>
      )}

      {step === 'admin' && (
        <section className="admin-shell">
          {!adminAuthenticated ? (
            <div className="admin-login">
              <div>
                <p className="eyebrow">Admin login</p>
                <h1>Assessment intelligence console.</h1>
                <p>
                  Admin users should see aggregate assessment performance, group patterns, function gaps,
                  competency coverage, question-format behavior, and longitudinal trends. This MVP uses a preview gate;
                  production should require Supabase Auth role-based access control.
                </p>
              </div>
              <div className="admin-login-card">
                <span>{authProfile ? 'Admin identity detected' : 'Admin authentication'}</span>
                {authProfile && (
                  <div className="admin-auth-profile">
                    <strong>{authProfile.name ?? authProfile.email}</strong>
                    <small>{authProfile.email}</small>
                  </div>
                )}
                <button className="primary" type="button" onClick={() => startGoogleSignIn(setAuthMessage)}>Continue with Google</button>
                <div className="email-auth-row">
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(event) => setAuthEmail(event.target.value)}
                    placeholder="admin@newhorizon.ai"
                    aria-label="Admin email magic link"
                  />
                  <button className="secondary" type="button" onClick={() => sendEmailMagicLink(authEmail, setAuthMessage)}>Email link</button>
                </div>
                <label>
                  Preview email
                  <input type="email" placeholder="admin@newhorizon.ai" aria-label="Admin email" />
                </label>
                <label>
                  Preview password
                  <input type="password" placeholder="Preview only" aria-label="Admin password" />
                </label>
                <button className="secondary" type="button" onClick={() => setAdminAuthenticated(true)}>Open admin dashboard preview</button>
                <small>{authMessage || 'Google/email sign-in uses Supabase when env vars are configured. Admin dashboard access is preview-only until admin role claims are added.'}</small>
              </div>
            </div>
          ) : (
            <>
              <div className="admin-hero">
                <div>
                  <p className="eyebrow">Admin dashboard</p>
                  <h1>Assessment analytics across users and groups.</h1>
                  <p>
                    Track readiness by cohort, function, role, domain, competency, difficulty, question format, and trend over time.
                    The current view summarizes saved local MVP runs; production should query Supabase analytics views.
                  </p>
                </div>
                <button className="secondary dark" type="button" onClick={() => setAdminAuthenticated(false)}>Sign out preview</button>
              </div>

              <div className="admin-kpi-grid">
                <div><span>Completed runs</span><strong>{adminAnalytics.totalRuns}</strong><small>non-practice assessments</small></div>
                <div><span>Profiles</span><strong>{adminAnalytics.totalProfiles}</strong><small>local profile ids</small></div>
                <div><span>Question signals</span><strong>{adminAnalytics.totalQuestionSignals}</strong><small>item-level records</small></div>
                <div><span>Average readiness</span><strong>{adminAnalytics.totalRuns ? `${adminAnalytics.averageOverall}/100` : 'No data'}</strong><small>all saved runs</small></div>
              </div>

              <div className="admin-grid">
                <article className="admin-card admin-wide">
                  <div className="admin-card-heading">
                    <div>
                      <span>Agent operations</span>
                      <h2>Supervised agent jobs</h2>
                    </div>
                    <div className="admin-action-row">
                      <button className="primary" type="button" onClick={runSupervisedAgentJobs}>Run supervised jobs</button>
                      <button className="secondary dark" type="button" onClick={runAgentWorkflowSimulation}>Run simulation only</button>
                    </div>
                  </div>
                  <div className="admin-kpi-grid compact-kpis agent-review-kpis">
                    <div><span>Runs</span><strong>{supervisedAgentRuns.length}</strong><small>persisted local runs</small></div>
                    <div><span>Pending</span><strong>{pendingAgentDraftCount}</strong><small>drafts needing review</small></div>
                    <div><span>Approved</span><strong>{approvedAgentDraftCount}</strong><small>accepted proposals</small></div>
                    <div><span>Rejected</span><strong>{rejectedAgentDraftCount}</strong><small>blocked proposals</small></div>
                  </div>
                  {latestSupervisedAgentRun && (
                    <div className="supervised-run-panel">
                      <div className="report-heading">
                        <div>
                          <p className="eyebrow">Latest supervised run</p>
                          <h3>{latestSupervisedAgentRun.headline}</h3>
                          <p>{latestSupervisedAgentRun.summary}</p>
                          <small>{latestSupervisedAgentRun.id} · {new Date(latestSupervisedAgentRun.createdAt).toLocaleString()}</small>
                        </div>
                        <span>{latestSupervisedAgentRun.status}</span>
                      </div>
                      <div className="agent-draft-grid">
                        {latestSupervisedAgentRun.drafts.map((draft) => (
                          <article key={draft.id} className={`agent-draft-card ${draft.status}`}>
                            <div>
                              <span>{draft.kind} · {draft.ownerAgent}</span>
                              <h4>{draft.title}</h4>
                              <p>{draft.summary}</p>
                              <small>{draft.rationale}</small>
                            </div>
                            <div className="source-signal-list">
                              {draft.sourceSignals.map((signal) => <b key={signal}>{signal}</b>)}
                            </div>
                            <div className="draft-review-actions">
                              <button
                                className="secondary dark"
                                type="button"
                                disabled={draft.status === 'approved'}
                                onClick={() => updateAgentDraftStatus(latestSupervisedAgentRun.id, draft.id, 'approved')}
                              >
                                Approve
                              </button>
                              <button
                                className="secondary dark"
                                type="button"
                                disabled={draft.status === 'rejected'}
                                onClick={() => updateAgentDraftStatus(latestSupervisedAgentRun.id, draft.id, 'rejected')}
                              >
                                Reject
                              </button>
                            </div>
                          </article>
                        ))}
                      </div>
                      <div className="agent-list">
                        {latestSupervisedAgentRun.safetyEvents.map((event) => <p key={event}>{event}</p>)}
                      </div>
                    </div>
                  )}
                  {agentWorkflowReport ? (
                    <div className="agent-report">
                      <div className="agent-report-hero">
                        <div>
                          <strong>{agentWorkflowReport.headline}</strong>
                          <p>{agentWorkflowReport.summary}</p>
                          <small>{agentWorkflowReport.runId} · {agentWorkflowReport.generatedAt}</small>
                        </div>
                      </div>
                      <div className="agent-status-grid">
                        {agentWorkflowReport.agents.map((agent) => (
                          <div key={agent.id}>
                            <span className={`agent-status ${agent.status}`}>{agent.status}</span>
                            <strong>{agent.name}</strong>
                            <p>{agent.role}</p>
                            <small>{agent.cadence}</small>
                          </div>
                        ))}
                      </div>
                      <div className="agent-report-columns">
                        <div>
                          <h3>Activity Log</h3>
                          <ol className="agent-timeline">
                            {agentWorkflowReport.activityLog.map((entry) => (
                              <li key={`${entry.step}-${entry.agent}`}>
                                <span>{entry.step}</span>
                                <div>
                                  <strong>{entry.agent}</strong>
                                  <p>{entry.activity}</p>
                                  <small>{entry.output}</small>
                                </div>
                              </li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <h3>Safety Cut</h3>
                          <div className="agent-list">
                            {agentWorkflowReport.safetyEvents.map((event) => <p key={event}>{event}</p>)}
                          </div>
                          <h3>Outputs</h3>
                          <div className="agent-list">
                            {agentWorkflowReport.outputs.map((output) => <p key={output}>{output}</p>)}
                          </div>
                          <h3>Recommendations</h3>
                          <div className="agent-list">
                            {agentWorkflowReport.recommendations.map((recommendation) => <p key={recommendation}>{recommendation}</p>)}
                          </div>
                        </div>
                      </div>
                      <p className="context-line">{agentWorkflowReport.productionNote}</p>
                    </div>
                  ) : (
                    <p>No agent run has been generated yet.</p>
                  )}
                </article>

                <article className="admin-card admin-wide quality-engine-card">
                  <span>Continuous improvement</span>
                  <h2>Supervised assessment quality engine</h2>
                  <p>
                    Telemetry and end-of-assessment feedback automatically identify candidates for revision. Proposed changes remain in a review queue before they can alter a scored assessment.
                  </p>
                  <div className="admin-kpi-grid compact-kpis">
                    <div><span>Started</span><strong>{qualityInsights.started}</strong><small>tracked sessions</small></div>
                    <div><span>Abandoned</span><strong>{qualityInsights.abandoned}</strong><small>incomplete exits</small></div>
                    <div><span>Mandatory complete</span><strong>{qualityInsights.mandatory}</strong><small>base routes</small></div>
                    <div><span>Continued</span><strong>{qualityInsights.continued}</strong><small>optional depth</small></div>
                  </div>
                  <div className="agent-report-columns">
                    <div>
                      <h3>Improvement queue</h3>
                      <div className="agent-list">
                        {qualityInsights.recommendations.map((recommendation) => <p key={recommendation}>{recommendation}</p>)}
                      </div>
                    </div>
                    <div>
                      <h3>Question candidates</h3>
                      <div className="admin-list compact">
                        {qualityInsights.questionRows.length ? qualityInsights.questionRows.map((row) => (
                          <p key={row.questionId}>
                            <strong>{row.questionId}</strong>
                            <small>{row.attempts} attempts · {row.averageScore}/100 · {formatDuration(row.averageDurationMs)} · {row.confusionRate}% confusing</small>
                          </p>
                        )) : <p>No item behavior data yet.</p>}
                      </div>
                    </div>
                  </div>
                </article>

                <article className="admin-card admin-wide telemetry-analysis-card">
                  <div className="report-heading">
                    <div>
                      <p className="eyebrow">Human review gate</p>
                      <h2>Analyze surveys and behavior before platform edits</h2>
                    </div>
                    <span>{pendingAgentDraftCount} pending drafts</span>
                  </div>
                  <p>
                    Agents should use telemetry and survey trends to explain what should change, why it matters,
                    and which users are affected. A human reviewer approves the next platform edit after seeing the evidence.
                  </p>
                  <div className="telemetry-grid">
                    <div>
                      <h3>Current signals</h3>
                      {telemetryAnalysis.trackedNow.map((item) => <p key={item}>{item}</p>)}
                    </div>
                    <div>
                      <h3>Analysis questions</h3>
                      {[
                        'Which artifacts trigger zoom/open-file behavior and long answer time?',
                        'Which questions look confusing because users revise often or answer slowly?',
                        'Which competencies remain unsampled or low-confidence after 20 questions?',
                        'Which survey comments point to unrealistic artifacts, unclear wording, or missing topics?',
                      ].map((item) => <p key={item}>{item}</p>)}
                    </div>
                    <div>
                      <h3>Human decision</h3>
                      {[
                        'Approve, reject, or rewrite each agent proposal.',
                        'Version scored items so historical scores stay explainable.',
                        'Review new artifacts for readability and relevance before release.',
                        'Keep profile collection transparent and useful to the learner.',
                      ].map((item) => <p key={item}>{item}</p>)}
                    </div>
                  </div>
                </article>

                <article className="admin-card admin-wide artifact-backlog">
                  <span>Artifact production</span>
                  <h2>Real-document replacement briefs</h2>
                  <p>These briefs map every unique visual artifact to the first question that uses it, so realistic replacements can be generated externally and dropped into the same asset path.</p>
                  <div className="admin-list artifact-brief-list">
                    {artifactReplacementBriefs.map((artifact) => (
                      <details key={artifact.src}>
                        <summary><strong>{artifact.label}</strong><small>{artifact.questionId} · {artifact.src}</small></summary>
                        <p>{artifact.description}</p>
                      </details>
                    ))}
                  </div>
                </article>

                <article className="admin-card admin-wide">
                  <span>Domain trend</span>
                  <h2>Lowest average domains</h2>
                  <div className="admin-domain-bars">
                    {adminAnalytics.domainRows.map((row) => (
                      <div key={row.domain}>
                        <label>{row.domain} · {row.label}</label>
                        <meter min="0" max="100" value={row.average} />
                        <strong>{adminAnalytics.totalRuns ? `${row.average}/100` : 'No data'}</strong>
                        <small>{row.evidence} question signal{row.evidence === 1 ? '' : 's'}</small>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="admin-card">
                  <span>User groups</span>
                  <h2>Cohort averages</h2>
                  <div className="admin-list">
                    {adminAnalytics.groupRows.length ? adminAnalytics.groupRows.map((row) => (
                      <p key={row.key}><strong>{row.label}</strong><small>{row.count} runs · {row.average}/100 · latest {row.lastRun ? new Date(row.lastRun).toLocaleDateString() : 'n/a'}</small></p>
                    )) : <p>No saved cohort data yet.</p>}
                  </div>
                </article>

                <article className="admin-card">
                  <span>Functions</span>
                  <h2>Function analysis</h2>
                  <div className="admin-list">
                    {adminAnalytics.functionRows.length ? adminAnalytics.functionRows.map((row) => (
                      <p key={row.key}><strong>{row.label}</strong><small>{row.count} runs · {row.average}/100 average</small></p>
                    )) : <p>No function-specific premium runs yet.</p>}
                  </div>
                </article>

                <article className="admin-card">
                  <span>Executive roles</span>
                  <h2>Role analysis</h2>
                  <div className="admin-list">
                    {adminAnalytics.executiveRows.length ? adminAnalytics.executiveRows.map((row) => (
                      <p key={row.key}><strong>{row.label}</strong><small>{row.count} runs · {row.average}/100 average</small></p>
                    )) : <p>No executive-role runs yet.</p>}
                  </div>
                </article>

                <article className="admin-card">
                  <span>Competencies</span>
                  <h2>Priority gaps</h2>
                  <div className="admin-list">
                    {adminAnalytics.competencyRows.length ? adminAnalytics.competencyRows.map((row) => (
                      <p key={row.id}><strong>{row.domain} · {row.label}</strong><small>{row.average}/100 · {row.evidence} evidence signals</small></p>
                    )) : <p>No competency signal log yet.</p>}
                  </div>
                </article>

                <article className="admin-card">
                  <span>Difficulty calibration</span>
                  <h2>Item difficulty behavior</h2>
                  <div className="admin-list compact">
                    {adminAnalytics.difficultyRows.map((row) => (
                      <p key={row.label}><strong>{row.label}</strong><small>{row.count} signals · {row.count ? `${row.average}/100` : 'no data'}</small></p>
                    ))}
                  </div>
                </article>

                <article className="admin-card">
                  <span>Formats</span>
                  <h2>Question interaction mix</h2>
                  <div className="admin-list compact">
                    {adminAnalytics.interactionRows.length ? adminAnalytics.interactionRows.map((row) => (
                      <p key={row.label}><strong>{row.label}</strong><small>{row.count} signals · {row.average}/100</small></p>
                    )) : <p>No interaction data yet.</p>}
                  </div>
                </article>

                <article className="admin-card admin-wide">
                  <span>Recent trend</span>
                  <h2>Latest assessment runs</h2>
                  <div className="admin-run-grid">
                    {adminAnalytics.recentRuns.length ? adminAnalytics.recentRuns.map((run) => (
                      <div key={run.id}>
                        <strong>{run.score}/100</strong>
                        <span>{run.mode}</span>
                        <p>{run.label}</p>
                        <small>{run.date}</small>
                      </div>
                    )) : <p>No saved runs yet. Complete assessments to populate admin trends.</p>}
                  </div>
                </article>
              </div>
            </>
          )}
        </section>
      )}

      {step === 'lab' && (
        <section className="lab-shell">
          <div className="lab-top">
            <button className="secondary" onClick={() => showHomeSection('labs')} type="button">Back to Labs</button>
            <div>
              <p className="eyebrow">Learn by doing</p>
              <h1>{activeLab.title}</h1>
              <p>{activeLab.brief}</p>
            </div>
            <div className="lab-meta">
              <span>{activeLab.domain}</span>
              <strong>{domains[activeLab.domain].name}</strong>
              <small>{activeLab.format}</small>
            </div>
          </div>

          <div className="lab-workbench">
            <article className="lab-artifact">
              <span>Practice artifact</span>
              <h2>{activeLab.artifact.title}</h2>
              <div className="lab-artifact-rows">
                {activeLab.artifact.rows.map((row) => (
                  <p key={row}>{row}</p>
                ))}
              </div>
              {activeLab.artifact.note && <strong>{activeLab.artifact.note}</strong>}
            </article>

            <article className="lab-task">
              {activeLab.kind === 'prompt' && (
                <>
                  <span>Build the prompt</span>
                  <h2>{activeLab.prompt}</h2>
                  <textarea
                    value={labDraft}
                    onChange={(event) => {
                      setLabDraft(event.target.value);
                      setLabFeedbackVisible(false);
                    }}
                    placeholder="Example: Act as a customer support assistant. Use only the ticket facts and refund policy below..."
                  />
                  <button
                    className="secondary"
                    onClick={() => {
                      setLabDraft(modelPromptRepairAnswer);
                      setLabFeedbackVisible(false);
                    }}
                    type="button"
                  >
                    Generate Model Prompt
                  </button>
                  <div className="lab-checklist">
                    {(activeLab.checklist ?? []).map((item) => (
                      <span className={getLabKeywordHit(item, labDraft) ? 'hit' : ''} key={item}>{item}</span>
                    ))}
                  </div>
                </>
              )}

              {(activeLab.kind === 'proof' || activeLab.kind === 'media') && (
                <>
                  <span>Select checks</span>
                  <h2>Which actions belong in your verification routine?</h2>
                  <div className="lab-choice-list">
                    {(activeLab.choices ?? []).map((choice) => (
                      <button
                        className={labSelections.includes(choice.id) ? 'selected' : ''}
                        key={choice.id}
                        onClick={() => toggleLabSelection(choice.id)}
                        type="button"
                      >
                        {choice.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {activeLab.kind === 'next' && (
                <>
                  <span>Choose next action</span>
                  <h2>What would you do first?</h2>
                  <div className="lab-choice-list">
                    {(activeLab.choices ?? []).map((choice) => (
                      <button
                        className={labSelections.includes(choice.id) ? 'selected' : ''}
                        key={choice.id}
                        onClick={() => toggleLabSelection(choice.id, true)}
                        type="button"
                      >
                        {choice.label}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {activeLab.kind === 'workflow' && (
                <>
                  <span>Order the workflow</span>
                  <h2>Move the steps into the safest launch sequence.</h2>
                  <div className="lab-order-list">
                    {labOrder.map((itemId, index) => {
                      const item = activeLab.items?.find((labItem) => labItem.id === itemId);
                      return (
                        <div key={itemId}>
                          <strong>{index + 1}</strong>
                          <p>{item?.label}</p>
                          <button onClick={() => moveLabOrder(index, -1)} disabled={index === 0} type="button">Up</button>
                          <button onClick={() => moveLabOrder(index, 1)} disabled={index === labOrder.length - 1} type="button">Down</button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {(activeLab.kind === 'trust' || activeLab.kind === 'ownership') && (
                <>
                  <span>Match controls</span>
                  <h2>{activeLab.kind === 'trust' ? 'Which control fits each risk?' : 'Who should own each step?'}</h2>
                  <div className="lab-match-list">
                    {(activeLab.items ?? []).map((item) => (
                      <label key={item.id}>
                        <span>{item.label}</span>
                        <select
                          value={labMatches[item.id] ?? ''}
                          onChange={(event) => {
                            setLabMatches((matches) => ({ ...matches, [item.id]: event.target.value }));
                            setLabFeedbackVisible(false);
                          }}
                        >
                          <option value="">Choose</option>
                          {(activeLab.matchChoices ?? []).map((choice) => (
                            <option key={choice} value={choice}>{choice}</option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </div>
                </>
              )}

              <div className="lab-actions">
                <button className="primary" disabled={!labCanSubmit} onClick={() => setLabFeedbackVisible(true)} type="button">Check My Work</button>
                <button className="secondary" onClick={() => startAssessment('free')} type="button">Start Full Assessment</button>
              </div>
            </article>

            <aside className="lab-feedback">
              <span>Lab feedback</span>
              {labFeedbackVisible ? (
                <>
                  <strong>{labEvaluation.score}/100</strong>
                  <p>{labEvaluation.summary}</p>
                  <div>
                    <h3>What worked</h3>
                    {(labEvaluation.strengths.length ? labEvaluation.strengths : ['No strong evidence yet. Try adding one concrete check or control.']).map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                  <div>
                    <h3>Improve next</h3>
                    {(labEvaluation.misses.length ? labEvaluation.misses : ['You covered the key requirements for this lab.']).map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                </>
              ) : (
                <p>Complete the lab and check your work. Feedback will explain what you handled well and what to improve before the full assessment.</p>
              )}
            </aside>
          </div>
        </section>
      )}

      {step === 'news' && (
        <section className="news-shell">
          <div className="news-hero">
            <div>
              <p className="eyebrow">AI Watch</p>
              <h1>Signals that keep the assessment current.</h1>
              <p>
                A lightweight newsfeed for LLMs, benchmarks, new models, breakthroughs, robotics, autonomous systems, governance, safety, and workplace change.
                Each item links back to the source and maps to the skills New Horizon should test.
              </p>
            </div>
            <div className="frequency-panel">
              <span>Agent update frequency</span>
              <div className="frequency-options" role="radiogroup" aria-label="Newsfeed update frequency">
                {(Object.keys(newsFrequencyLabels) as NewsFrequency[]).map((frequency) => (
                  <button
                    key={frequency}
                    className={newsFrequency === frequency ? 'selected' : ''}
                    onClick={() => setNewsFrequency(frequency)}
                    role="radio"
                    aria-checked={newsFrequency === frequency}
                  >
                    {newsFrequencyLabels[frequency].label}
                  </button>
                ))}
              </div>
              <p>{newsFrequencyLabels[newsFrequency].detail}</p>
              <small>Current MVP: this controls feed preference in the UI. The Codex trend-watch agent can be scheduled to match this cadence.</small>
            </div>
          </div>
          <div className="news-layout">
            <section className="news-feed" aria-label="AI trends newsfeed">
              {trendFeed.map((item) => (
                <article className="news-card" key={item.title}>
                  <div>
                    <span>{item.category} · {item.source} · {item.date}</span>
                    <strong>{item.domain} · {domains[item.domain as DomainId].name}</strong>
                  </div>
                  <h2><a href={item.url} target="_blank" rel="noreferrer">{item.title}</a></h2>
                  <p>{item.signal}</p>
                </article>
              ))}
            </section>
            <aside className="news-sidebar">
              <div>
                <span>Agent brief</span>
                <p>Scan official AI labs, standards bodies, governance sources, workforce research, and reputable Thai learning/training sources.</p>
              </div>
              <div>
                <span>Question-bank use</span>
                <p>Turn strong signals into new artifacts, skill tags, benchmarks, and practical assessment scenarios.</p>
              </div>
              <div>
                <span>Review rule</span>
                <p>Do not publish trend items as facts without source link, date, domain mapping, and reviewer approval.</p>
              </div>
            </aside>
          </div>
        </section>
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
          <article className="profile-builder-card">
            <div>
              <p className="eyebrow">Profile builder and signals</p>
              <h2>Profile is built before, during, and after the assessment.</h2>
              <p>
                Before the test, New Horizon asks optional role-aware questions about tools, workflows, peer-tool awareness, risk concerns, and learning interests.
                During the test, every item adds evidence signals for domains, competencies, skills, difficulty, item type, and knowing-vs-doing behavior.
              </p>
            </div>
            <div className="profile-builder-steps">
              <span>Before: survey tags</span>
              <span>During: answer signals</span>
              <span>After: confidence gaps</span>
              <span>Next: learning personalization</span>
            </div>
          </article>
          <div className="workspace-actions">
            <button className="secondary dark" onClick={() => setStep('home')}>Back</button>
            <button className="primary" onClick={() => openProfileSurvey('free')}>Build Profile and Begin 12-Question Assessment</button>
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
            <span>20 adaptive questions, function/industry context, research-informed target comparison, evidence summary, domain radar, skill-gap signals, and a premium learning path.</span>
          </div>
          <article className="profile-builder-card compact">
            <div>
              <p className="eyebrow">Profile builder</p>
              <h2>Premium profile signals</h2>
              <p>
                Before the diagnostic starts, New Horizon asks about current tools, similar-role tools, workflows, risks, and learning interests.
                Those tags personalize item routing, artifacts, tool suggestions, and the learning path.
              </p>
            </div>
            <div className="profile-builder-steps">
              <span>{functionLabels[functionTrack]}</span>
              <span>{industryLabels[industryTrack]}</span>
              <span>Tool awareness</span>
              <span>Learning intent</span>
            </div>
          </article>
          <div className="workspace-actions">
            <button className="secondary dark" onClick={() => setStep('home')}>Back</button>
            <button className="primary" onClick={() => openProfileSurvey('premium')}>Build Profile and Begin Premium Diagnostic</button>
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
            <span>20 adaptive questions from {executiveAssessmentQuestionBank.length} executive and advanced competency items, chart/report visuals, multi-select, drag-order, matching, narrative judgment, target radar graph, and personalized executive learning path.</span>
          </div>
          <article className="profile-builder-card compact">
            <div>
              <p className="eyebrow">Profile builder</p>
              <h2>Executive profile signals</h2>
              <p>
                Before the assessment starts, New Horizon captures executive priorities, maturity, risk focus, peer topics, and learning interests.
                During the test, strategy, governance, and change-leadership evidence signals are added from artifact-backed questions.
              </p>
            </div>
            <div className="profile-builder-steps">
              <span>{executiveLabels[executiveRole]}</span>
              <span>AI priorities</span>
              <span>Risk agenda</span>
              <span>Board/value signals</span>
            </div>
          </article>
          <div className="workspace-actions">
            <button className="secondary dark" onClick={() => setStep('home')}>Back</button>
            <button className="primary" onClick={() => openProfileSurvey('executive')}>Build Profile and Begin Executive Assessment</button>
          </div>
        </section>
      )}

      {step === 'assessment' && current && (
        <section className="assessment-shell">
          <div className="assessment-workbench">
            <article className="question-card task-card" data-question-id={current.id}>
              <div className="task-toolbar">
                <div>
                  <p className="eyebrow">{activeConfig.label}</p>
                  <h1>{domains[current.domain].short}</h1>
                  {continuationFocus && <p className="context-line">Continuation: {continuationFocus.label}</p>}
                </div>
                <div className="progress-block">
                  <span>
                    Question {progress} of {activeConfig.totalQuestions}
                    <HelpBubble label="Telemetry help: progress">
                      Progress is logged so the system can tell whether users complete, abandon, or continue after required milestones.
                    </HelpBubble>
                  </span>
                  <div className="progress-track"><span style={{ width: `${(progress / activeConfig.totalQuestions) * 100}%` }} /></div>
                </div>
              </div>
              <div className="question-meta">
                <span>
                  {current.domain}
                  <HelpBubble label="Telemetry help: domain">
                    Domain identifies which D1-D6 capability area this question contributes evidence to.
                  </HelpBubble>
                </span>
                <span className={`difficulty-pill ${current.difficulty}`}>
                  Difficulty: {difficultyLabels[current.difficulty]}
                  <HelpBubble label="Telemetry help: difficulty">
                    Difficulty is stored with the answer so harder correct or partially correct work can count differently from easy work.
                  </HelpBubble>
                </span>
                <span>
                  {current.type}
                  <HelpBubble label="Telemetry help: item type">
                    Item type shows whether this is a report review, media check, fraud task, scenario, or similar evidence format.
                  </HelpBubble>
                </span>
                <span>
                  {current.interaction ?? 'single'}
                  <HelpBubble label="Telemetry help: interaction format">
                    Interaction format helps compare single choice, multi-select, matching, ranking, written, and multi-part questions fairly.
                  </HelpBubble>
                </span>
              </div>
              <div className="live-telemetry-strip" aria-label="Live telemetry help">
                <span>
                  Time on question
                  <HelpBubble label="Telemetry help: time on question">
                    Time is used to spot confusing wording, hard-to-read artifacts, and questions that need calibration review.
                  </HelpBubble>
                </span>
                <span>
                  Answer interactions
                  <HelpBubble label="Telemetry help: answer interactions">
                    Clicks, selections, revisions, and text edits help estimate hesitation and whether the question format is clear.
                  </HelpBubble>
                </span>
                <span>
                  Artifact use
                  <HelpBubble label="Telemetry help: artifact use">
                    Opening, zooming, or launching artifacts flags which screenshots, workflows, or documents may need larger or clearer versions.
                  </HelpBubble>
                </span>
              </div>
              <div className="question-focus-strip">
                <span>{difficultyLabels[current.difficulty]} task</span>
                <strong>{getQuestionFocus(current)}</strong>
                <small>{difficultyDescriptions[current.difficulty]}</small>
              </div>
              <details className="measure-details">
                <summary>
                  <span>Scored evidence</span>
                  <strong>
                    {getEvidenceMode(current)} · {currentMeasures.map((measure) => measure.domain).join(' / ')}
                    <HelpBubble label="Telemetry help: scored evidence">
                      Scored evidence records whether the item mostly tests knowing, doing, or a hybrid task, then maps it to competencies.
                    </HelpBubble>
                  </strong>
                </summary>
                <div className="measure-grid">
                  {currentMeasures.map((measure) => (
                    <div key={measure.id}>
                      <span>{measure.domain}</span>
                      <strong>{measure.label}</strong>
                      <p>{measure.skills.slice(0, 3).join(', ')}</p>
                    </div>
                  ))}
                </div>
                <div className="skill-chip-row" aria-label="Scored skill tags">
                  {currentSkills.map((skill) => <span key={skill}>{skill}</span>)}
                </div>
              </details>
              {useRelianceStage && current.type === 'reliance-decision' && (
                <div className="reliance-stage">
                  <div>
                    {current.stimulus && <StimulusFigure stimulus={current.stimulus} onArtifactAction={(action, zoomLevel) => trackArtifactAction(current, action, zoomLevel)} />}
                    {!current.stimulus && current.visualStimulus && <VisualStimulusCard stimulus={current.visualStimulus} />}
                  </div>
                  <div className="reliance-prompt">
                    <span>Make the call</span>
                    <h2>{current.prompt}</h2>
                    <div className="reliance-options" aria-label="Reliance decision">
                      {displayedOptions.map((option) => {
                        const choice = getRelianceChoice(option);
                        return (
                          <button key={option.id} className={`reliance-choice ${option.id}`} onClick={() => chooseOption(option)}>
                            <span>{choice.label}</span>
                            <strong>{choice.detail}</strong>
                          </button>
                        );
                      })}
                    </div>
                    <p>{current.context}</p>
                  </div>
                </div>
              )}
              {!useRelianceStage && (
                <>
                  {current.stimulus && <StimulusFigure stimulus={current.stimulus} onArtifactAction={(action, zoomLevel) => trackArtifactAction(current, action, zoomLevel)} />}
                  {!current.stimulus && current.visualStimulus && <VisualStimulusCard stimulus={current.visualStimulus} />}
                  <div className="task-brief">
                    <span>Task brief</span>
                    <p>{getTaskInstruction(current)}</p>
                  </div>
                  <div className="scenario-panel">
                    <span>Scenario</span>
                    <p className="context">{current.context}</p>
                    <h2>{current.prompt}</h2>
                  </div>
                </>
              )}
              {(current.interaction ?? 'single') === 'single' && !useRelianceStage && (
                <div className="options">
                  {displayedOptions.map((option, index) => (
                    <button key={option.id} onClick={() => chooseOption(option)}>
                      <span>{optionDisplayLetter(index)}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
              {current.interaction === 'multi' && (
                <div className="interaction-panel">
                  <div className="options multi-options">
                    {displayedOptions.map((option, index) => (
                      <button
                        key={option.id}
                        className={multiSelected.includes(option.id) ? 'selected' : ''}
                        onClick={() => toggleMultiOption(option.id)}
                        aria-pressed={multiSelected.includes(option.id)}
                      >
                        <span>{optionDisplayLetter(index)}</span>
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
                    {displayedMatchPairs.map((pair) => (
                      <label className="match-row" key={pair.id}>
                        <span>{pair.left}</span>
                        <select
                          value={matchSelections[pair.id] ?? ''}
                          onChange={(event) => chooseMatch(pair.id, event.target.value)}
                        >
                          <option value="">Choose match</option>
                          {(displayedMatchChoices[pair.id] ?? pair.choices).map((choice) => (
                            <option key={choice} value={choice}>{choice}</option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </div>
                  <button className="primary submit-answer" onClick={submitMatches}>Submit Matches</button>
                </div>
              )}
              {current.interaction === 'parts' && (
                <div className="interaction-panel">
                  <div className="part-list">
                    {displayedParts.map((part, partIndex) => (
                      <section className="part-card" key={part.id}>
                        <div className="part-header">
                          <span>Part {partIndex + 1}</span>
                          <strong>{part.domain} · {domains[part.domain].short}</strong>
                        </div>
                        <p>{part.prompt}</p>
                        <div className="options part-options">
                          {(displayedPartOptions[part.id] ?? part.options).map((option, optionIndex) => (
                            <button
                              key={option.id}
                              className={partSelections[part.id] === option.id ? 'selected' : ''}
                              onClick={() => choosePartOption(part.id, option.id)}
                              aria-pressed={partSelections[part.id] === option.id}
                            >
                              <span>{optionDisplayLetter(optionIndex)}</span>
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                  <button
                    className="primary submit-answer"
                    onClick={submitPartAnswers}
                    disabled={(current.parts ?? []).some((part) => !partSelections[part.id])}
                  >
                    Submit Mini-Parts
                  </button>
                </div>
              )}
              {current.interaction === 'text' && (
                <div className="interaction-panel">
                  <label className="written-response">
                    <span>Your written answer</span>
                    <textarea
                      value={textResponse}
                      onChange={(event) => updateTextResponse(event.target.value)}
                      placeholder="Write 2-4 sentences with the evidence you would use in the real situation."
                    />
                  </label>
                  <button className="primary submit-answer" onClick={submitTextAnswer}>Submit Written Answer</button>
                </div>
              )}
            </article>
            <aside className="adaptive-panel" aria-label="Adaptive psychometric indicators">
              <div className={`adaptive-card difficulty-card ${current.difficulty}`}>
                <span>
                  Current item difficulty
                  <HelpBubble label="Telemetry help: current item difficulty">
                    Current difficulty is the seeded challenge level for this item before large-scale pilot calibration.
                  </HelpBubble>
                </span>
                <strong>{difficultyLabels[current.difficulty]}</strong>
                <p>{difficultyDescriptions[current.difficulty]}</p>
              </div>
              <div className="adaptive-card highlight">
                <span>
                  Ability estimate theta
                  <HelpBubble label="Telemetry help: theta">
                    Theta is a pilot ability estimate from prior answers. It helps choose harder, easier, or coverage-focused next questions.
                  </HelpBubble>
                </span>
                <strong>{formatAbility(adaptiveReadout.theta)}</strong>
                <p>Pilot estimate from {adaptiveReadout.answeredCount} answered items.</p>
              </div>
              <div className="indicator-grid">
                <div>
                  <span>Target level<HelpBubble label="Telemetry help: target level">Target level is the next difficulty pressure after the previous answer and coverage needs.</HelpBubble></span>
                  <strong>{adaptiveReadout.targetDifficulty}</strong>
                </div>
                <div>
                  <span>Item b<HelpBubble label="Telemetry help: item difficulty b">Item b is the seeded psychometric difficulty value used to compare the item with the current ability estimate.</HelpBubble></span>
                  <strong>{formatAbility(adaptiveReadout.b)}</strong>
                </div>
                <div>
                  <span>Item a<HelpBubble label="Telemetry help: item discrimination a">Item a estimates how strongly this item should separate lower and higher readiness users.</HelpBubble></span>
                  <strong>{adaptiveReadout.a.toFixed(2)}</strong>
                </div>
                <div>
                  <span>Guess c<HelpBubble label="Telemetry help: guessing c">Guess c is the estimated chance someone could get credit without the underlying skill, lower for richer formats.</HelpBubble></span>
                  <strong>{adaptiveReadout.c.toFixed(2)}</strong>
                </div>
                <div>
                  <span>Info<HelpBubble label="Telemetry help: item information">Information estimates how useful this item is for reducing uncertainty at the current ability level.</HelpBubble></span>
                  <strong>{adaptiveReadout.information}</strong>
                </div>
                <div>
                  <span>SEM<HelpBubble label="Telemetry help: standard error">SEM is standard error of measurement. Lower means the current estimate is becoming more stable.</HelpBubble></span>
                  <strong>{adaptiveReadout.sem}</strong>
                </div>
              </div>
              <div className="adaptive-card">
                <span>
                  Why this question?
                  <HelpBubble label="Telemetry help: routing reason">
                    Routing combines prior score, difficulty movement, domain coverage, and profile-priority competencies.
                  </HelpBubble>
                </span>
                <p>{adaptiveReadout.adaptationReason}</p>
              </div>
              <div className="adaptive-card">
                <span>
                  Coverage pressure
                  <HelpBubble label="Telemetry help: coverage confidence">
                    Coverage confidence estimates whether enough relevant competencies have been tested to trust the result.
                  </HelpBubble>
                </span>
                <p>Next target: {adaptiveReadout.targetDomain} · {domains[adaptiveReadout.targetDomain].short}. Confidence {adaptiveReadout.confidence}%.</p>
              </div>
              <div className="domain-meter-list">
                {(Object.keys(domains) as DomainId[]).map((domain) => {
                  const answeredInDomain = getAnsweredDomainCounts(answers)[domain].count;
                  return (
                    <div key={domain}>
                      <span>{domain}</span>
                      <div><i style={{ width: `${Math.min(100, answeredInDomain * 34)}%`, background: domains[domain].color }} /></div>
                      <strong>{answeredInDomain}</strong>
                    </div>
                  );
                })}
              </div>
            </aside>
          </div>
        </section>
      )}

      {step === 'feedback' && lastAnswer && (
        <section className="assessment-shell">
          <div className="feedback-workbench">
            <article className="feedback-card">
              <p className="eyebrow">Answer review</p>
              <h1>{lastAnswer.option.score}/100</h1>
              <p className="result-level">{lastAnswer.option.score >= 82 ? 'Strong evidence' : lastAnswer.option.score >= 64 ? 'Partial evidence' : 'Needs review'}</p>
              <div className="feedback-grid">
                <div>
                  <span>Your answer</span>
                  <p>{lastAnswer.textResponse || lastAnswer.option.label}</p>
                </div>
                <div>
                  <span>Expected answer</span>
                  <p>{getCorrectAnswerSummary(lastAnswer.question)}</p>
                </div>
              </div>
              <div className="rubric-panel">
                <span>Rubric and calibration</span>
                <p>{getCalibrationSummary(lastAnswer.question, lastAnswer)}</p>
                <p>{lastAnswer.option.feedback}</p>
              </div>
              <div className="rubric-panel">
                <span>Measured competencies</span>
                <div className="measure-grid compact">
                  {getQuestionMeasures(lastAnswer.question).map((measure) => (
                    <div key={measure.id}>
                      <span>{measure.domain}</span>
                      <strong>{measure.label}</strong>
                      <p>{measure.skills.slice(0, 3).join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
              {lastAnswer.question.rubricCriteria && (
                <div className="criterion-list">
                  {lastAnswer.question.rubricCriteria.map((criterion) => {
                    const hit = lastAnswer.rubricHits?.some((rubricHit) => rubricHit.id === criterion.id);
                    return (
                      <div key={criterion.id} className={hit ? 'hit' : ''}>
                        <span>{hit ? 'Detected' : 'Missing'}</span>
                        <strong>{criterion.label}</strong>
                        <small>{criterion.points} pts</small>
                      </div>
                    );
                  })}
                </div>
              )}
              {!pendingQuestion && showContinuationPanel && (
                <div className={`continue-callout ${continuationRecommendation.urgency}`}>
                  <p className="eyebrow">{continuationRecommendation.kicker}</p>
                  <h2>{continuationRecommendation.headline}</h2>
                  <p>{continuationRecommendation.summary}</p>
                  <div className="continue-reasons">
                    {continuationRecommendation.reasons.map((reason) => <span key={reason}>{reason}</span>)}
                  </div>
                  {continuationRecommendation.targetLabels.length > 0 && (
                    <div className="continue-targets">
                      <strong>Next focus</strong>
                      {continuationRecommendation.targetLabels.map((label) => <span key={label}>{label}</span>)}
                    </div>
                  )}
                  <div className="continue-primary-actions">
                    <button
                      type="button"
                      className="primary"
                      onClick={() => continueAssessment(continuationRecommendation.route, continuationRecommendation.questionCount)}
                    >
                      Continue with {continuationRecommendation.questionCount} targeted questions
                    </button>
                    <button type="button" className="secondary" onClick={continueAfterFeedback}>View report now</button>
                  </div>
                </div>
              )}
              {!pendingQuestion && !showContinuationPanel && showEvidenceCompletionPanel && (
                <div className="continue-callout recommended">
                  <p className="eyebrow">Evidence completion route</p>
                  <h2>Keep going until relevant competencies are high-confidence</h2>
                  <p>{evidenceCompletion.summary}</p>
                  <div className="continue-reasons">
                    <span>{evidenceCompletion.unsampled} relevant competencies still unsampled</span>
                    <span>{evidenceCompletion.lowConfidence} sampled competencies below high confidence</span>
                    <span>Maximum cap: {Math.min(60, allAssessmentItems.length)} total questions</span>
                  </div>
                  <div className="continue-targets">
                    <strong>Next focus</strong>
                    {evidenceCompletion.targets.slice(0, 5).map((competency) => <span key={competency.id}>{competency.label}</span>)}
                  </div>
                  <div className="continue-primary-actions">
                    <button type="button" className="primary" onClick={continueEvidenceCompletion}>
                      Add {evidenceCompletion.questionCount} evidence questions
                    </button>
                    <button type="button" className="secondary" onClick={continueAfterFeedback}>View report now</button>
                  </div>
                </div>
              )}
            </article>
            <aside className="adaptive-panel" aria-label="Next adaptive step">
              <div className={`movement-card ${difficultyMovement.tone}`}>
                <span>{difficultyMovement.label}</span>
                <p>{difficultyMovement.detail}</p>
              </div>
              <div className="adaptive-card highlight">
                <span>Updated theta</span>
                <strong>{formatAbility(estimateTheta(answers))}</strong>
                <p>Updated after {answers.length} answered items.</p>
              </div>
              <div className="adaptive-card">
                <span>Next step</span>
                <p>
                  {pendingQuestion
                    ? `Next item: ${pendingQuestion.domain} · ${domains[pendingQuestion.domain].short} · ${pendingQuestion.difficulty} · ${pendingQuestion.type}.`
                    : 'Assessment complete. Results are ready.'}
                </p>
                {pendingQuestion && (
                  <div className="difficulty-compare">
                    <span>{lastAnswer.question.domain} · {lastAnswer.question.difficulty}</span>
                    <b aria-hidden="true">→</b>
                    <span>{pendingQuestion.domain} · {pendingQuestion.difficulty}</span>
                  </div>
                )}
              </div>
              {!pendingQuestion && showContinuationPanel && (
                <div className="adaptive-card continuation-inline">
                  <span>{continuationRecommendation.confidenceLabel}</span>
                  <strong>{continuationRecommendation.questionCount}</strong>
                  <p>{continuationRecommendation.reasons[0]}</p>
                  <div className="continuation-actions">
                    <button
                      type="button"
                      className="primary"
                      onClick={() => continueAssessment(continuationRecommendation.route, continuationRecommendation.questionCount)}
                    >
                      Continue recommended route
                    </button>
                    <button
                      type="button"
                      className="secondary dark"
                      disabled={!continuationTargets.priorityGapIds.length}
                      onClick={() => continueAssessment({
                        kind: 'priority',
                        label: 'Role-priority gap route',
                        targetCompetencyIds: continuationTargets.priorityGapIds,
                      }, 8)}
                    >
                      Keep going: role gaps
                    </button>
                    <button
                      type="button"
                      className="secondary dark"
                      onClick={() => continueAssessment({
                        kind: 'domain',
                        label: `${selectedRadarDomain} deep dive`,
                        targetDomain: selectedRadarDomain,
                        targetCompetencyIds: continuationTargets.domainIds,
                      })}
                    >
                      Keep going: {selectedRadarDomain} deep dive
                    </button>
                  </div>
                  <div className="continuation-summary">
                    <span>{continuationTargets.confidenceIds.length} confidence targets</span>
                    <span>{continuationTargets.priorityGapIds.length} role-priority gaps</span>
                    <span>{continuationTargets.domainIds.length} {selectedRadarDomain} follow-ups</span>
                  </div>
                </div>
              )}
              {!pendingQuestion && !showContinuationPanel && showEvidenceCompletionPanel && (
                <div className="adaptive-card continuation-inline">
                  <span>Evidence completion</span>
                  <strong>{evidenceCompletion.questionCount}</strong>
                  <p>{evidenceCompletion.summary}</p>
                  <div className="continuation-actions">
                    <button type="button" className="primary" onClick={continueEvidenceCompletion}>
                      Keep going
                    </button>
                  </div>
                </div>
              )}
              <button className="primary submit-answer" onClick={continueAfterFeedback}>
                {pendingQuestion ? 'Continue to Next Question' : 'View Results'}
              </button>
            </aside>
          </div>
        </section>
      )}

      {step === 'results' && (
        <section className="results-shell">
          <div className="results-hero">
            <div>
              <p className="eyebrow">{mode === 'executive' ? 'Executive assessment pilot' : mode === 'premium' ? 'Premium diagnostic pilot' : mode === 'practice' ? 'Practice activity result' : 'Indicative MVP result'}</p>
              <h1>{results.overall}</h1>
              <p className="result-level">{results.level} AI readiness</p>
              <p>
                Based on {answers.length} {mode === 'practice' ? 'practice activity' : 'adaptive responses'} for {mode === 'executive' ? executiveLabels[executiveRole].toLowerCase() : audienceLabels[audience].toLowerCase()}.
                Evidence confidence is pilot-grade: {results.confidence}%.
              </p>
              <p className="context-line">{getScoreBandDescription(results.overall, results.level)}</p>
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
            <RadarChart
              scores={results.domainScores}
              benchmarks={radarProfiles}
              selectedDomain={selectedRadarDomain}
              onSelectDomain={setSelectedRadarDomain}
            />
          </div>
          <div className="result-grid">
            <article className="result-card wide comparison-note">
              <h2>Score interpretation</h2>
              <div className="evidence-grid">
                <p><strong>Your score</strong> A sampled readiness estimate, not a validated psychometric score. Unsampled domains no longer add a midpoint floor.</p>
                <p><strong>Group average</strong> {groupAverageProfile ? `${groupAverageProfile.detail} for ${scoreGroup.label.toLowerCase()}.` : `No saved ${scoreGroup.label.toLowerCase()} yet; this run will start the group average.`}</p>
                <p><strong>Target profile</strong> Research-informed target for {mode === 'executive' ? executiveLabels[executiveRole].toLowerCase() : mode === 'premium' ? `${functionLabels[functionTrack].toLowerCase()} in ${industryLabels[industryTrack].toLowerCase()}` : audienceLabels[audience].toLowerCase()}. Built from cited competency, workforce, governance, and Thailand-readiness sources; not a validated norm yet.</p>
              </div>
            </article>
            <article className="result-card wide did-you-know-report">
              <div>
                <p className="eyebrow">Did you know?</p>
                <h2>{personalizedDidYouKnow.topic}</h2>
                <p>{personalizedDidYouKnow.fact}</p>
                <small>{personalizedDidYouKnow.whyItMatters}</small>
              </div>
              <div className="did-you-know-actions">
                <button className="primary" type="button" onClick={() => followDidYouKnow(personalizedDidYouKnow)}>Learn more</button>
                <button className="secondary dark" type="button" onClick={() => openProfileSurvey(mode === 'practice' ? 'free' : mode)}>Improve personalization</button>
              </div>
            </article>
            {showContinuationPanel && (
              <article className={`result-card wide continuation-panel prominent ${continuationRecommendation.urgency}`}>
                <div>
                  <p className="eyebrow">{continuationRecommendation.kicker}</p>
                  <h2>{continuationRecommendation.headline}</h2>
                  <p>{continuationRecommendation.summary}</p>
                  <div className="continue-reasons">
                    {continuationRecommendation.reasons.map((reason) => <span key={reason}>{reason}</span>)}
                  </div>
                </div>
                <div className="continuation-decision">
                  <strong>{continuationRecommendation.confidenceLabel}</strong>
                  <p>{continuationRecommendation.questionCount} targeted questions can improve the score estimate and competency evidence.</p>
                  {continuationRecommendation.targetLabels.length > 0 && (
                    <div className="continue-targets">
                      {continuationRecommendation.targetLabels.map((label) => <span key={label}>{label}</span>)}
                    </div>
                  )}
                  <div className="continuation-actions">
                    <button
                      type="button"
                      className="primary"
                      onClick={() => continueAssessment(continuationRecommendation.route, continuationRecommendation.questionCount)}
                    >
                      Continue recommended route
                    </button>
                    <button
                      type="button"
                      className="secondary dark"
                      onClick={() => continueAssessment({
                        kind: 'domain',
                        label: `${selectedRadarDomain} deep dive`,
                        targetDomain: selectedRadarDomain,
                        targetCompetencyIds: continuationTargets.domainIds,
                      })}
                    >
                      Choose {selectedRadarDomain} deep dive
                    </button>
                  </div>
                </div>
                <div className="continuation-summary">
                  <span>{continuationTargets.confidenceIds.length} confidence targets</span>
                  <span>{continuationTargets.priorityGapIds.length} profile-priority gaps</span>
                  <span>{continuationTargets.domainIds.length} {selectedRadarDomain} follow-ups</span>
                </div>
              </article>
            )}
            {showEvidenceCompletionPanel && (
              <article className="result-card wide continuation-panel prominent recommended">
                <div>
                  <p className="eyebrow">Evidence completion</p>
                  <h2>Continue beyond 20 until confidence is high</h2>
                  <p>{evidenceCompletion.summary}</p>
                  <div className="continue-reasons">
                    <span>{evidenceCompletion.unsampled} relevant competencies unsampled</span>
                    <span>{evidenceCompletion.lowConfidence} sampled competencies below high confidence</span>
                    <span>{evidenceCompletion.remainingCapacity} question slots left before the safety cap</span>
                  </div>
                </div>
                <div className="continuation-decision">
                  <strong>Recommended if you want a fuller profile</strong>
                  <p>The next batch targets planned and profile-priority competencies that still need repeated evidence.</p>
                  <div className="continue-targets">
                    {evidenceCompletion.targets.slice(0, 6).map((competency) => <span key={competency.id}>{competency.label}</span>)}
                  </div>
                  <div className="continuation-actions">
                    <button type="button" className="primary" onClick={continueEvidenceCompletion}>
                      Add {evidenceCompletion.questionCount} evidence questions
                    </button>
                  </div>
                </div>
                <div className="continuation-summary">
                  <span>{coveragePlan.prioritySampled}/{coveragePlan.priorityTotal} priority sampled</span>
                  <span>{coveragePlan.plannedSampled}/{coveragePlan.plannedTotal} planned sampled</span>
                  <span>{coveragePlan.sampled}/24 total competencies sampled</span>
                </div>
              </article>
            )}
            <article className="result-card wide leaderboard-card">
              <div className="report-heading">
                <div>
                  <p className="eyebrow">Persona leaderboard</p>
                  <h2>Top 10 · {scoreGroup.label.replace(/ average$/i, '')}</h2>
                </div>
                <span>{personaLeaderboard.length} ranked run{personaLeaderboard.length === 1 ? '' : 's'}</span>
              </div>
              <div className="leaderboard-list">
                {personaLeaderboard.length ? personaLeaderboard.map((entry) => (
                  <div key={entry.id} className={entry.id === loggedResultId ? 'current' : ''}>
                    <strong>#{entry.rank}</strong>
                    <span>{entry.displayName}</span>
                    <b>{entry.overall}/100</b>
                    <small>{new Date(entry.createdAt).toLocaleDateString()}</small>
                  </div>
                )) : <p>Your completed run will establish this persona leaderboard.</p>}
              </div>
              <p className="context-line">MVP ranks saved runs for the same persona on this device. Production should use consented server-side cohort records and privacy-safe display names.</p>
            </article>
            <article className="result-card wide telemetry-analysis-card">
              <div className="report-heading">
                <div>
                  <p className="eyebrow">Telemetry and result analysis</p>
                  <h2>What the assessment tracks and why</h2>
                </div>
                <span>Local MVP log</span>
              </div>
              <div className="telemetry-grid">
                <div>
                  <h3>Currently tracked</h3>
                  {telemetryAnalysis.trackedNow.map((item) => <p key={item}>{item}</p>)}
                </div>
                <div>
                  <h3>Used for analysis</h3>
                  {telemetryAnalysis.resultUse.map((item) => <p key={item}>{item}</p>)}
                </div>
                <div>
                  <h3>Improve next</h3>
                  {telemetryAnalysis.improvements.map((item) => <p key={item}>{item}</p>)}
                </div>
              </div>
              <p className="context-line">Agent suggestions should analyze survey feedback, item behavior, artifact zoom/open patterns, and cohort trends first. Human review remains required before changing scored content, artifacts, profile fields, or survey wording.</p>
            </article>
            <article className="result-card wide assessment-feedback-gate">
              <div className="report-heading">
                <div>
                  <p className="eyebrow">Question-level analysis</p>
                  <h2>{detailedAnalysisUnlocked ? 'Your detailed evidence is unlocked.' : 'Share quick feedback to unlock details.'}</h2>
                </div>
                <span>{detailedAnalysisUnlocked ? 'Unlocked' : 'About 30 seconds'}</span>
              </div>
              {!detailedAnalysisUnlocked ? (
                <>
                  <p>Your feedback improves question clarity, difficulty calibration, artifact realism, profile collection, and the follow-up survey.</p>
                  <div className="feedback-survey-grid">
                    <label>Question clarity
                      <select value={feedbackDraft.clarity} onChange={(event) => setFeedbackDraft((draft) => ({ ...draft, clarity: event.target.value as AssessmentFeedbackSurvey['clarity'] }))}>
                        <option value="clear">Clear</option><option value="mixed">Some were unclear</option><option value="confusing">Confusing</option>
                      </select>
                    </label>
                    <label>Difficulty
                      <select value={feedbackDraft.difficultyFit} onChange={(event) => setFeedbackDraft((draft) => ({ ...draft, difficultyFit: event.target.value as AssessmentFeedbackSurvey['difficultyFit'] }))}>
                        <option value="right">About right</option><option value="too-easy">Too easy</option><option value="too-hard">Too hard</option>
                      </select>
                    </label>
                    <label>Artifacts
                      <select value={feedbackDraft.artifactQuality} onChange={(event) => setFeedbackDraft((draft) => ({ ...draft, artifactQuality: event.target.value as AssessmentFeedbackSurvey['artifactQuality'] }))}>
                        <option value="realistic">Realistic and relevant</option><option value="mixed">Mixed quality</option><option value="poor">Poor or irrelevant</option>
                      </select>
                    </label>
                    <label>Assessment length
                      <select value={feedbackDraft.lengthFit} onChange={(event) => setFeedbackDraft((draft) => ({ ...draft, lengthFit: event.target.value as AssessmentFeedbackSurvey['lengthFit'] }))}>
                        <option value="right">About right</option><option value="short">Too short</option><option value="long">Too long</option>
                      </select>
                    </label>
                  </div>
                  <label className="written-response">Suggestions for improvement
                    <textarea value={feedbackDraft.suggestions} onChange={(event) => setFeedbackDraft((draft) => ({ ...draft, suggestions: event.target.value }))} placeholder="Optional: name a confusing question, unrealistic artifact, or missing topic." />
                  </label>
                  <button className="primary" type="button" onClick={submitAssessmentFeedback}>Submit feedback and unlock analysis</button>
                </>
              ) : (
                <div className="question-analysis-list">
                  {answers.map((answer, index) => {
                    const benchmark = questionBenchmarks[answer.question.id];
                    return (
                      <details key={`${answer.question.id}-${index}`}>
                        <summary>
                          <span>{index + 1}</span>
                          <strong>{answer.question.domain} · {difficultyLabels[answer.question.difficulty]} · {answer.question.interaction ?? 'single'}</strong>
                          <b>{getReadinessScore(answer.option.score, answer.question.difficulty)}/100</b>
                          <small>{formatDuration(answer.behavior?.durationMs)} · {answer.behavior?.hesitation ?? 'timing unavailable'}</small>
                        </summary>
                        <p><strong>Question:</strong> {answer.question.prompt}</p>
                        <p><strong>Your answer:</strong> {answer.textResponse?.trim() || answer.option.label}</p>
                        <p><strong>Expected evidence:</strong> {getCorrectAnswerSummary(answer.question)}</p>
                        <p><strong>Measured:</strong> {getQuestionMeasures(answer.question).map((competency) => competency.label).join(', ')}</p>
                        <p><strong>Behavior:</strong> {answer.behavior?.interactionCount ?? 0} interactions, {answer.behavior?.revisionCount ?? 0} revisions.</p>
                        <p><strong>Local comparison:</strong> {benchmark ? `${benchmark.averageScore}/100 average across ${benchmark.attempts} attempt${benchmark.attempts === 1 ? '' : 's'}; ${formatDuration(benchmark.averageDurationMs)} average time.` : 'No comparison data yet.'}</p>
                      </details>
                    );
                  })}
                </div>
              )}
            </article>
            <article className="result-card wide ai-generated-report">
              <div className="report-heading">
                <div>
                  <p className="eyebrow">MVP generated report</p>
                  <h2>{generatedReport.headline}</h2>
                </div>
                <span>No API key in MVP</span>
              </div>
              <p>{generatedReport.summary}</p>
              <div className="report-section">
                <h3>Detailed analysis</h3>
                <div className="evidence-grid">
                  {generatedReport.analysis.map((item) => <p key={item}>{item}</p>)}
                </div>
              </div>
              <div className="report-section">
                <h3>Priority domains</h3>
                <div className="improvement-brief">
                  {generatedReport.priorityDomains.map((item) => (
                    <div key={item.domain}>
                      <span>{item.domain} · {item.title}</span>
                      <strong>{item.score}/100 now · target {item.target}/100</strong>
                      <p>{item.action}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="report-section">
                <h3>Competency focus</h3>
                <div className="competency-table compact">
                  {generatedReport.competencyFocus.length ? generatedReport.competencyFocus.map((competency) => (
                    <details key={competency.id} open>
                      <summary onClick={() => appendBehaviorEvent({ type: 'report_interest', reportArea: 'competency', label: competency.label })}>
                        <span>{competency.id}</span>
                        <strong>{competency.label}</strong>
                        <b>{competency.score}/100</b>
                        <small>{competency.evidenceCount} evidence · {competency.skills.join(', ')}</small>
                      </summary>
                    </details>
                  )) : <p>Complete a longer route to unlock sampled competency focus.</p>}
                </div>
              </div>
              <div className="report-section">
                <h3>Learning path</h3>
                <div className="learning-list">
                  {generatedReport.learningPath.map((step, index) => (
                    <div key={step}>
                      <span>Step {index + 1}</span>
                      <strong>{step}</strong>
                    </div>
                  ))}
                </div>
              </div>
              <div className="personalized-exploration">
                <div>
                  <span>Recommended tools to explore</span>
                  <div className="profile-tag-grid">
                    {generatedReport.tools.map((tool) => <span key={tool}>{tool}</span>)}
                  </div>
                </div>
                <div>
                  <span>Recommended courses</span>
                  <div className="profile-tag-grid">
                    {generatedReport.courses.slice(0, 4).map((course) => (
                      <a key={course.id} href={course.url} target="_blank" rel="noreferrer">{course.provider}: {course.title}</a>
                    ))}
                  </div>
                </div>
              </div>
              <p className="context-line">{generatedReport.productionNote}</p>
            </article>
            <article className="result-card wide coverage-plan">
              <h2>Assessment coverage plan</h2>
              <p>{coveragePlan.testFrame}</p>
              <div className="coverage-stats">
                <div>
                  <span>Profile</span>
                  <strong>{coveragePlan.contextLabel}</strong>
                </div>
                <div>
                  <span>Sampled</span>
                  <strong>{coveragePlan.sampled}/24</strong>
                </div>
                <div>
                  <span>Role priority</span>
                  <strong>{coveragePlan.prioritySampled}/{coveragePlan.priorityTotal}</strong>
                </div>
                <div>
                  <span>Planned route</span>
                  <strong>{coveragePlan.plannedSampled}/{coveragePlan.plannedTotal}</strong>
                </div>
              </div>
              <div className="coverage-grid">
                {coveragePlan.coverage.map((competency) => (
                  <div key={competency.id} className={competency.status}>
                    <span>{competency.domain}</span>
                    <strong>{competency.label}</strong>
                    <small>{competency.statusLabel}</small>
                  </div>
                ))}
              </div>
            </article>
            <article className="result-card wide profile-insights">
              <h2>User profile signals</h2>
              {userProfileSurvey ? (
                <>
                  <p>
                    Latest profile context: <strong>{userProfileSurvey.context}</strong>. These tags can personalize question routing,
                    artifact selection, course recommendations, and cohort analytics.
                  </p>
                  <div className="profile-tag-grid">
                    {userProfileSurvey.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </>
              ) : (
                <p>No optional profile survey saved yet. The assessment can still run, but personalization will rely only on selected audience, function, industry, or role.</p>
              )}
            </article>
            <article className="result-card wide">
              <h2>Domain evidence quality</h2>
              <div className="domain-evidence-grid">
                {domainEvidenceSummary.map((item) => (
                  <button
                    key={item.domain}
                    type="button"
                    className={selectedRadarDomain === item.domain ? 'selected' : ''}
                    onClick={() => selectReportDomain(item.domain, 'domain')}
                  >
                    <span>{item.domain} · {domains[item.domain].short}</span>
                    <strong>{item.evidenceCount ? `${item.score}/100` : 'Not sampled'}</strong>
                    <p>{Number(item.evidenceCount.toFixed(2))} evidence signal{item.evidenceCount === 1 ? '' : 's'} · {item.confidence}</p>
                  </button>
                ))}
              </div>
            </article>
            <article className="result-card wide domain-drilldown">
              <h2>{domains[selectedRadarDomain].name} competency drilldown</h2>
              <p>{selectedRadarDomain} · {domains[selectedRadarDomain].name}</p>
              <div className="drilldown-domain-tabs" aria-label="Choose a domain for competency drilldown">
                {(Object.keys(domains) as DomainId[]).map((domain) => (
                  <button
                    key={domain}
                    type="button"
                    className={selectedRadarDomain === domain ? 'selected' : ''}
                    onClick={() => selectReportDomain(domain, 'radar')}
                  >
                    <span>{domain}</span>
                    <strong>{domains[domain].name}</strong>
                  </button>
                ))}
              </div>
              <CompetencyRadar domain={selectedRadarDomain} competencies={selectedDomainCompetencies} />
              <div className="competency-table compact">
                {selectedDomainCompetencies.map((competency) => (
                  <details key={competency.id} open={competency.evidenceCount > 0}>
                    <summary onClick={() => appendBehaviorEvent({ type: 'report_interest', reportArea: 'competency', label: competency.label, domain: competency.domain })}>
                      <span>{competency.id}</span>
                      <strong>{competency.label}</strong>
                      <b>{competency.evidenceCount ? `${competency.score}/100` : 'Not sampled'}</b>
                      <small>{competency.statusLabel} · {competency.evidenceCount} evidence · {competency.confidence} confidence</small>
                    </summary>
                    <p>{competency.rationale} Skills: {competency.skills.join(', ')}</p>
                  </details>
                ))}
              </div>
            </article>
            <article className="result-card wide score-analytics">
              <h2>Saved score analytics</h2>
              <div className="evidence-grid">
                <p><strong>Saved runs</strong> {scoreLogAnalytics.totalRuns} completed assessment run{scoreLogAnalytics.totalRuns === 1 ? '' : 's'} on this device.</p>
                <p><strong>Individual profiles</strong> {scoreLogAnalytics.individualProfiles || 'No'} local profile{scoreLogAnalytics.individualProfiles === 1 ? '' : 's'} with saved signals.</p>
                <p><strong>Question signals</strong> {scoreLogAnalytics.signalSnapshots || 'No'} item-level signal snapshot{scoreLogAnalytics.signalSnapshots === 1 ? '' : 's'} saved for trend analysis.</p>
                <p><strong>Average overall</strong> {scoreLogAnalytics.totalRuns ? `${scoreLogAnalytics.averageOverall}/100` : 'No saved score distribution yet.'}</p>
                <p><strong>Stored dimensions</strong> Anonymous profile ID, survey tags, audience, function, industry, executive role, domain scores, competency scores, evidence-mode scores, question difficulty, item type, assessment mode, date, and group key.</p>
              </div>
              <div className="analytics-chips">
                {scoreLogAnalytics.byMode.map((item) => (
                  <span key={item.label}>{item.label}: {item.count}</span>
                ))}
                {scoreLogAnalytics.profileFields.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
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
              <h2>Knowledge vs practical skill</h2>
              <div className="evidence-mode-grid">
                {evidenceModeSummary.map((item) => (
                  <div key={item.mode}>
                    <span>{item.label}</span>
                    <strong>{item.count ? `${item.score}/100` : 'Not sampled'}</strong>
                    <p>{item.count} scored signal{item.count === 1 ? '' : 's'}</p>
                  </div>
                ))}
              </div>
            </article>
            <article className="result-card wide">
              <h2>Readiness badges</h2>
              <div className="badge-grid">
                {earnedBadges.map((badge) => (
                  <div key={badge.domain} className={badge.earned ? 'earned' : ''}>
                    <span>{badge.earned ? 'Earned' : 'In progress'}</span>
                    <strong>{badge.title}</strong>
                    <p>{badge.domain} · {badge.score}/100 · {badge.detail}</p>
                  </div>
                ))}
              </div>
            </article>
            <article className="result-card wide">
              <h2>Competency and skill scores</h2>
              <div className="competency-table">
                {coveragePlan.coverage.map((competency) => (
                  <details key={competency.id} open={competency.evidenceCount > 0 && competency.score < 65}>
                    <summary>
                      <span>{competency.domain}</span>
                      <strong>{competency.label}</strong>
                      <b>{competency.evidenceCount ? `${competency.score}/100` : 'Not sampled'}</b>
                      <small>{competency.statusLabel} · {competency.evidenceCount} evidence · {competency.confidence} confidence</small>
                    </summary>
                    <p>{competency.rationale} Skills: {competency.skills.join(', ')}</p>
                  </details>
                ))}
              </div>
            </article>
            <article className="result-card wide">
              <h2>{mode === 'executive' ? 'Executive learning path' : mode === 'premium' ? 'Premium learning path' : 'Recommended learning path'}</h2>
              <div className="personalized-exploration">
                <div>
                  <span>Tools to explore</span>
                  <div className="profile-tag-grid">
                    {personalizedExploration.tools.map((tool) => <span key={tool}>{tool}</span>)}
                  </div>
                </div>
                <div>
                  <span>Concepts to strengthen</span>
                  <div className="profile-tag-grid">
                    {personalizedExploration.concepts.map((concept) => <span key={concept}>{concept}</span>)}
                  </div>
                </div>
                <div>
                  <span>Practice next</span>
                  <div className="profile-tag-grid">
                    {personalizedExploration.practice.map((activity) => <span key={activity}>{activity}</span>)}
                  </div>
                </div>
              </div>
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
            <article className="result-card wide">
              <h2>Thailand course recommendations</h2>
              <div className="course-list">
                {courseRecommendations.map((course) => (
                  <article key={course.id}>
                    <div>
                      <span>{course.provider} · {course.level}</span>
                      <h3><a href={course.url} target="_blank" rel="noreferrer">{course.title}</a></h3>
                      <p>{course.fit}</p>
                    </div>
                    <dl>
                      <div><dt>Format</dt><dd>{course.format}</dd></div>
                      <div><dt>Price</dt><dd>{course.price}</dd></div>
                      <div><dt>Maps to</dt><dd>{course.domains.join(', ')} · {course.skills.slice(0, 4).join(', ')}</dd></div>
                    </dl>
                  </article>
                ))}
              </div>
            </article>
            <article className="result-card wide">
              <h2>Where to improve next</h2>
              <div className="improvement-brief">
                {improvementBrief.map((item) => (
                  <div key={item.domain}>
                    <span>{item.domain} · {domains[item.domain].name}</span>
                    <strong>{item.score}/100 now · target {item.target}/100</strong>
                    <p>{item.gapText}: {item.action}</p>
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
                  <p><strong>Target status</strong> Research-informed targets are role/audience-weighted and source-backed. Group averages come from saved New Horizon runs on this device.</p>
                </div>
                <div className="source-list">
                  {targetEvidenceSources.map((source) => (
                    <p key={source.label}>
                      <strong><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></strong>
                      {' '}{source.detail}
                    </p>
                  ))}
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
              <button className="primary" onClick={() => mode === 'practice' ? showHomeSection('labs') : startAssessment(mode)}>
                {mode === 'practice' ? 'Back to Activities' : `Retake ${mode === 'executive' ? 'Executive' : mode === 'premium' ? 'Premium' : 'Free'} Assessment`}
              </button>
              {mode === 'practice' && <button className="secondary dark" onClick={() => setStep('onboarding')}>Start Full Free Assessment</button>}
              {mode === 'free' && <button className="secondary dark" onClick={() => setStep('premiumOnboarding')}>Start Premium Pilot</button>}
              {mode === 'premium' && <button className="secondary dark" onClick={() => setStep('onboarding')}>Try Free Version</button>}
              {mode !== 'executive' && <button className="secondary dark" onClick={() => setStep('executiveOnboarding')}>Try Executive Pilot</button>}
            </div>
          </div>
        </section>
      )}

      {step === 'developerReport' && (
        <section className="results-shell demo-report-shell">
          <div className="results-hero demo-report-hero">
            <div>
              <p className="eyebrow">Generated report preview</p>
              <h1>{fullStackDeveloperReport.overall}</h1>
              <p className="result-level">{fullStackDeveloperReport.level} AI readiness</p>
              <p>
                Simulated premium technical-track report for a {fullStackDeveloperReport.profile.toLowerCase()}.
                Evidence confidence is pilot-grade: {fullStackDeveloperReport.confidence}%.
              </p>
              <p className="context-line">
                Strongest signal: D2 practical tooling. Priority development area: D4 risk, governance, permissions, audit logs, and production controls.
              </p>
            </div>
            <RadarChart
              scores={fullStackDeveloperReport.scores}
              benchmarks={fullStackDeveloperReport.benchmarks}
              selectedDomain={selectedDemoDomain}
              onSelectDomain={setSelectedDemoDomain}
            />
          </div>

          <div className="result-grid">
            <article className="result-card wide demo-report-card">
              <div className="report-heading">
                <div>
                  <p className="eyebrow">Personalized AI report</p>
                  <h2>Full-stack developer: applied readiness, production governance gap.</h2>
                </div>
                <span>Demo user</span>
              </div>
              <div className="evidence-grid">
                {fullStackDeveloperReport.interpretation.map((item) => <p key={item}>{item}</p>)}
              </div>
            </article>

            <article className="result-card demo-report-card">
              <span>Strengths</span>
              <h2>What is working</h2>
              <div className="agent-list">
                {fullStackDeveloperReport.strengths.map((strength) => <p key={strength}>{strength}</p>)}
              </div>
            </article>

            <article className="result-card demo-report-card">
              <span>Priority gaps</span>
              <h2>What to improve</h2>
              <div className="agent-list">
                {fullStackDeveloperReport.gaps.map((gap) => <p key={gap}>{gap}</p>)}
              </div>
            </article>

            <article className="result-card wide demo-report-card">
              <h2>Domain scorecard</h2>
              <div className="demo-domain-grid">
                {(Object.keys(fullStackDeveloperReport.scores) as DomainId[]).map((domain) => {
                  const target = fullStackDeveloperReport.benchmarks[1].scores[domain];
                  const gap = target - fullStackDeveloperReport.scores[domain];
                  return (
                    <button
                      key={domain}
                      className={selectedDemoDomain === domain ? 'selected' : ''}
                      type="button"
                      onClick={() => setSelectedDemoDomain(domain)}
                    >
                      <span style={{ color: domains[domain].color }}>{domain} · {domains[domain].short}</span>
                      <strong>{fullStackDeveloperReport.scores[domain]}/100</strong>
                      <meter min="0" max="100" value={fullStackDeveloperReport.scores[domain]} />
                      <small>{gap > 0 ? `${gap} points below target` : 'At or above target'}</small>
                    </button>
                  );
                })}
              </div>
            </article>

            <article className="result-card wide demo-report-card">
              <h2>Personalized learning path</h2>
              <div className="demo-learning-path">
                {fullStackDeveloperReport.learningPath.map((phase) => (
                  <div key={phase.phase}>
                    <span>{phase.phase}</span>
                    <strong>{phase.title}</strong>
                    {phase.actions.map((action) => <p key={action}>{action}</p>)}
                  </div>
                ))}
              </div>
            </article>

            <article className="result-card wide demo-report-card">
              <h2>Courses from latest Training Scout crawl</h2>
              <div className="course-list">
                {fullStackDeveloperReport.courses.map((course) => (
                  <article key={course.url}>
                    <span>{course.provider} · {course.domains.join(', ')}</span>
                    <h3>{course.title}</h3>
                    <p>{course.fit}</p>
                    <a href={course.url} target="_blank" rel="noreferrer">Open course</a>
                  </article>
                ))}
              </div>
            </article>

            <article className="result-card wide demo-report-card">
              <h2>Tools and platforms to explore</h2>
              <div className="personalized-exploration">
                {fullStackDeveloperReport.tools.map((group) => (
                  <div key={group.category}>
                    <span>{group.category}</span>
                    <div className="profile-tag-grid">
                      {group.items.map((item) => <span key={item}>{item}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="result-card wide demo-report-card">
              <h2>Practice projects</h2>
              <div className="improvement-brief">
                {fullStackDeveloperReport.projects.map((project, index) => (
                  <div key={project}>
                    <span>Project {index + 1}</span>
                    <strong>{project}</strong>
                  </div>
                ))}
              </div>
              <p className="context-line">
                MVP preview: this report uses simulated assessment evidence plus the local Playwright course crawl. Production should generate reports server-side with consented user data, stored report versions, audit logs, and provider-key controls.
              </p>
            </article>
          </div>
        </section>
      )}
    </main>
  );
}
