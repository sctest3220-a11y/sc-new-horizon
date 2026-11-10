/**
 * Profile-aware assessment routing.
 * Core concepts are shown to every learner; tool modules are suggested only
 * when the profile indicates relevant work. This is routing metadata, not a
 * scoring or publication authority.
 */
export const coreAssessmentLanes = [
  { id: 'core-ai-concepts', domain: 'D1', label: 'AI concepts', competencies: ['models and applications', 'data and context', 'generation and retrieval', 'limitations'] },
  { id: 'core-evaluation', domain: 'D3', label: 'Evaluation and verification', competencies: ['evidence quality', 'benchmark design', 'uncertainty', 'failure analysis'] },
  { id: 'core-risk-governance', domain: 'D4', label: 'Risk, ethics and governance', competencies: ['privacy', 'security', 'human oversight', 'auditability'] },
  { id: 'core-adoption', domain: 'D6', label: 'Adoption and change', competencies: ['role impact', 'workflow fit', 'responsibility', 'learning'] },
];

export const profileToolLanes = [
  { id: 'developer-tools', profiles: ['developer', 'engineer', 'technical'], domain: 'D2', tools: ['coding assistant', 'GitHub workflow', 'API', 'MCP', 'testing agent'], skills: ['verify generated code', 'scope tool permissions', 'test agent actions'] },
  { id: 'analyst-tools', profiles: ['analyst', 'finance', 'data'], domain: 'D3', tools: ['spreadsheet copilot', 'SQL assistant', 'dashboard analysis', 'model evaluation'], skills: ['check ranges and formulas', 'compare failure slices', 'separate correlation from causation'] },
  { id: 'marketing-tools', profiles: ['marketing', 'communications', 'content'], domain: 'D2', tools: ['content assistant', 'synthetic media', 'campaign analytics'], skills: ['check claims and provenance', 'protect brand and audience', 'review generated media'] },
  { id: 'operations-tools', profiles: ['operations', 'customer service', 'support'], domain: 'D2', tools: ['workflow agent', 'CRM assistant', 'automation'], skills: ['design approval boundaries', 'handle exceptions', 'verify external actions'] },
  { id: 'executive-tools', profiles: ['executive', 'leader', 'manager'], domain: 'D6', tools: ['AI portfolio dashboard', 'vendor assessment', 'decision support'], skills: ['evaluate value and risk', 'assign ownership', 'set scale gates'] },
  { id: 'security-tools', profiles: ['security', 'cyber', 'risk', 'compliance'], domain: 'D4', tools: ['SOC copilot', 'phishing detector', 'incident assistant'], skills: ['triage untrusted instructions', 'contain incidents', 'preserve evidence'] },
];

export function getAssessmentLanes(profile = {}) {
  const values = [profile.role, profile.function, profile.industry, ...(profile.tags ?? [])].filter(Boolean).map((value) => String(value).toLowerCase());
  const matches = profileToolLanes.filter((lane) => lane.profiles.some((term) => values.some((value) => value.includes(term))));
  return { core: coreAssessmentLanes, tools: matches, routingNote: 'Core lanes are universal. Tool lanes are profile-relevant suggestions and require user confirmation before inclusion.' };
}
