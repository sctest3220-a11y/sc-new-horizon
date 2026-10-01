import { neutralArtifactCopy, generationSuffix } from './wording-refinements.mjs';

export const artifactRules = [
  {
    id: 'source-comparison-pack',
    priority: 'high',
    label: 'Source comparison / version evidence',
    re: /conflict|contradict|exception|superseded|retired|obsolete|source updates|source-version|freshness|untraceable|unsupported|different account type|different service area|omits.*date|omits.*version|screenshot.*policy/i,
  },
  {
    id: 'workflow-trace',
    priority: 'high',
    label: 'Workflow / agent trace',
    re: /handoff|approval before|gated tool|tool step|agent control loop|retry|loop|completed action|state update|permission boundary|read-only|write scope|production write|approval-bound|idempotent|recovery/i,
  },
  {
    id: 'media-asset-review',
    priority: 'high',
    label: 'Media / asset provenance evidence',
    re: /image|asset|license|caption|recording|clip|photo|synthetic|endorsement|creator credit|internal use only|public campaigns|depicts an accessory|misleading product|provenance|asset rights/i,
  },
  {
    id: 'security-audit-log',
    priority: 'high',
    label: 'Security / access / audit evidence',
    re: /identity|credential|authorization|access denial|cross-user|unrestricted|vendor|security|audit|data rights|supplier payment|verified message|verified account|buyer|account action/i,
  },
  {
    id: 'data-chart-dashboard',
    priority: 'high',
    label: 'Dashboard / chart / calculation evidence',
    re: /dashboard|chart|metric|baseline|ROI|cost|benefit|orders|cancellations|returned|false alerts|portfolio|funding|adoption|throughput|queue|sensitivity|break-even|double counting|gross|net/i,
  },
  {
    id: 'communication-thread',
    priority: 'medium',
    label: 'Email / chat / ticket thread',
    re: /email|message|chat|ticket|customer reports|employee contests|customer disputes|support response|service response|buyer.*request|unverified message|contact information supplied|case record/i,
  },
  {
    id: 'policy-excerpt',
    priority: 'medium',
    label: 'Policy / terms excerpt',
    re: /policy clause|procedure|approved terms|commercial terms|eligibility|criteria|returns terms|account terms|service criteria|approved current terms|review route|approval record/i,
  },
].map(rule => ({
  ...rule,
  // Legacy keyword matching proposes a type; it cannot prove necessity.
  artifactBrief: neutralArtifactCopy[rule.id][0],
  generationPrompt: `${neutralArtifactCopy[rule.id][0]} ${generationSuffix[0]}`,
}));

export function getArtifactNeedFromText(text) {
  const matches = artifactRules.filter((rule) => rule.re.test(text));
  if (!matches.length) return null;
  const rule = matches.find((candidate) => candidate.priority === 'high') ?? matches[0];
  const requiresArtifact = /chart|calculate|ROI|ranking|order|compare|side-by-side|image|asset|license|log|workflow|trace|permission|version|conflict|recording|clip|photo|dashboard|portfolio|spreadsheet|audit|identity|access/i.test(text);
  return {
    need: requiresArtifact ? 'requires artifact' : 'artifact helpful',
    artifactType: rule.id,
    artifactLabel: rule.label,
    artifactBrief: rule.artifactBrief,
    generationPrompt: rule.generationPrompt,
  };
}
