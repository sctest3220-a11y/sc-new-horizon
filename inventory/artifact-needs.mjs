export const artifactRules = [
  {
    id: 'source-comparison-pack',
    priority: 'high',
    label: 'Source comparison / version evidence',
    re: /conflict|contradict|exception|superseded|retired|obsolete|source updates|source-version|freshness|untraceable|unsupported|different account type|different service area|omits.*date|omits.*version|screenshot.*policy/i,
    artifactBrief: 'Side-by-side source excerpts with version/date stamps and highlighted conflict, exception, missing citation, or stale source.',
    generationPrompt: 'Create a realistic two-panel document comparison with version badges, date stamps, source IDs, highlighted conflict/exception text, and a short reviewer note area.',
  },
  {
    id: 'workflow-trace',
    priority: 'high',
    label: 'Workflow / agent trace',
    re: /handoff|approval before|gated tool|tool step|agent control loop|retry|loop|completed action|state update|permission boundary|read-only|write scope|production write|approval-bound|idempotent|recovery/i,
    artifactBrief: 'Workflow diagram or event trace showing model step, retrieval step, tool permission, approval gate, and failure point.',
    generationPrompt: 'Create a realistic workflow trace screen with timestamps, model/retrieval/tool steps, permission scope, approval gate, retry count, and a marked failure or handoff gap.',
  },
  {
    id: 'media-asset-review',
    priority: 'high',
    label: 'Media / asset provenance evidence',
    re: /image|asset|license|caption|recording|clip|photo|synthetic|endorsement|creator credit|internal use only|public campaigns|depicts an accessory|misleading product|provenance|asset rights/i,
    artifactBrief: 'Media review board showing image/asset, license terms, caption/source, and provenance checks.',
    generationPrompt: 'Create a realistic media provenance review board with thumbnail, caption, source/date fields, license scope, detector result, and a highlighted mismatch.',
  },
  {
    id: 'security-audit-log',
    priority: 'high',
    label: 'Security / access / audit evidence',
    re: /identity|credential|authorization|access denial|cross-user|unrestricted|vendor|security|audit|data rights|supplier payment|verified message|verified account|buyer|account action/i,
    artifactBrief: 'Realistic access log, vendor questionnaire, permission console, or audit trail with key fields highlighted.',
    generationPrompt: 'Create a realistic security review artifact with access scopes, actor identity, requested action, approval status, audit timestamps, and one visible control gap.',
  },
  {
    id: 'data-chart-dashboard',
    priority: 'high',
    label: 'Dashboard / chart / calculation evidence',
    re: /dashboard|chart|metric|baseline|ROI|cost|benefit|orders|cancellations|returned|false alerts|portfolio|funding|adoption|throughput|queue|sensitivity|break-even|double counting|gross|net/i,
    artifactBrief: 'Dashboard or spreadsheet-style table with enough numeric evidence to calculate or compare outcomes.',
    generationPrompt: 'Create a realistic business dashboard or spreadsheet panel with baseline, current result, cost, benefit, risk, confidence, and one misleading metric that users must catch.',
  },
  {
    id: 'communication-thread',
    priority: 'medium',
    label: 'Email / chat / ticket thread',
    re: /email|message|chat|ticket|customer reports|employee contests|customer disputes|support response|service response|buyer.*request|unverified message|contact information supplied|case record/i,
    artifactBrief: 'Realistic email/chat/ticket thread with sender, dates, attachments, and ambiguous or risky claim highlighted.',
    generationPrompt: 'Create a realistic business email, chat, or support-ticket thread with sender identity, timestamps, quoted prior message, attachment reference, and one risky ambiguity.',
  },
  {
    id: 'policy-excerpt',
    priority: 'medium',
    label: 'Policy / terms excerpt',
    re: /policy clause|procedure|approved terms|commercial terms|eligibility|criteria|returns terms|account terms|service criteria|approved current terms|review route|approval record/i,
    artifactBrief: 'Short policy or terms excerpt with version, scope, exception, owner, and approval/review route.',
    generationPrompt: 'Create a realistic one-page policy excerpt with title, owner, effective date, scope, exception clause, approval route, and one visible applicability limit.',
  },
];

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
