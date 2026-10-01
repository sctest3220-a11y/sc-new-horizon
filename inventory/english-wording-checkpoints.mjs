// User-selected English wording. Thai stays at its prior revision until synced.
export const englishWordingCheckpoints = {
  'NH-FUNCTION-CUSTOMERSERVICE-D1-CAPABILITY-LIMITS-AWARENESS-03': {
    context: 'The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.\n\nThe AI uses an old version of the procedure to draft the customer response. It quotes that version correctly, even though a new version is already in effect.',
    prompt: 'Answer both questions. Choose one answer for each.',
    parts: [
      { prompt: 'What limitation does the AI’s use of this procedure show?', labels: ['The AI may use information that is out of date.', 'The AI cannot access the evidence it refers to.'] },
      { prompt: 'The AI’s draft says the case is resolved, but the case history shows it is still pending.\nWhat should the team do next?', labels: ['State that the case is still pending and explain the actual next step.', 'State that the case is resolved to reassure the customer.'] },
    ],
    explanation: 'The AI quotes the old procedure correctly, but that version is no longer current. This shows the risk of using outdated information, rather than an inability to access evidence. The customer response should state the recorded case status and explain the actual next step.',
    keys: ['a', 'a'], artifactRequired: false,
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D1-CAPABILITY-LIMITS-AWARENESS-04': {
    context: 'The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.\n\nIn its draft, the AI describes the contents of a file that was never attached or made available to it.',
    prompt: 'Answer both questions. Choose one answer for each.',
    parts: [
      { prompt: 'What limitation does the AI’s response show?', labels: ['The AI cannot access the evidence it refers to.', 'The available information does not support a consistent estimate.'] },
      { prompt: 'The customer says the identity details in the case history are incorrect.\nWhat should the team do next?', labels: ['Use the existing identity details because they are already in the system.', 'Follow the established process for verifying and correcting identity details.'] },
    ],
    explanation: 'The AI cannot verify a file’s contents without access to it. Describing those contents does not establish that the AI has seen the file. The team should also follow the established verification and correction process when the customer disputes their identity details; information is not necessarily correct simply because it is stored in the system.',
    keys: ['a', 'b'], artifactRequired: false,
    issues: ['Part 1B does not specify what is estimated, and the scenario contains no estimate. Preserve the accepted wording pending a separate distractor revision.'],
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-AWARENESS-01': {
    context: 'The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.\n\nThe prompt asks the AI to follow a specific record format, but it does not provide the field names or an example.\n\nRefunds and exceptions require approval from the person authorized to approve them.',
    prompt: 'Answer both questions. Choose one answer for each.',
    parts: [
      { prompt: 'Which missing prompt element does this example show?', labels: ['A clear description of the task and expected result.', 'A clear structure for the AI’s response.'] },
      { prompt: 'The AI recommends a refund over the frontline team’s approval limit.\nWhat should the team do next?', labels: ['Issue the refund after the AI repeats its recommendation.', 'Send the exception to the person authorized to approve the refund.'] },
    ],
    explanation: 'Asking for a specific format does not tell the AI what that format looks like. The prompt should provide the field names or an example. The refund also requires approval from someone with the necessary authority; repeating an AI recommendation does not give the frontline team permission to issue it.',
    keys: ['b', 'b'], artifactRequired: false,
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-AWARENESS-02': {
    context: 'The customer service team uses AI to draft a case resolution response. The response must follow approved service policies and reflect the customer’s case history.\n\nThe prompt provides the task instructions and response format, but it does not include the background information needed to generate an answer.',
    prompt: 'Answer both questions. Choose one answer for each.',
    parts: [
      { prompt: 'Which missing prompt element does this example show?', labels: ['The evidence and case details needed for the response.', 'The rule or limit that applies to the decision.'] },
      { prompt: 'The system timed out during an earlier refund attempt, but the refund may already be complete.\nWhat should the team do next?', labels: ['Issue another refund because the customer still reports a delay.', 'Check the payment record to confirm the earlier refund’s status before issuing another refund.'] },
    ],
    explanation: 'Task instructions and a response format do not replace the background information the AI needs to answer. A timeout does not prove that a refund failed. The team should confirm the earlier refund’s status before issuing another, rather than treating the customer’s reported delay as proof that no refund occurred.',
    keys: ['a', 'b'], artifactRequired: false,
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-AWARENESS-03': {
    context: 'The customer service team wants to use AI to draft a case resolution response.\n\nThe team provides approved service policies and the customer’s case history, but the prompt only says, “Help with this.” It does not specify what the AI should generate.',
    prompt: 'Answer both questions. Choose one answer for each.',
    parts: [
      { prompt: 'Which missing prompt element is most directly shown here?', labels: ['The rule or limit that applies to the decision.', 'A clear description of the task and expected result.'] },
      { prompt: 'The AI’s draft says the case is resolved, but the case history shows it is still pending.\nWhat should the team do next?', labels: ['State that the case is resolved to reassure the customer.', 'State that the case is still pending and explain the actual next step.'] },
    ],
    explanation: 'Providing policies and case history gives the AI source information, but “Help with this” does not explain what to do with it or what to generate. The team should specify the task and expected result. The customer response should also reflect the recorded case status and actual next step.',
    keys: ['b', 'b'], artifactRequired: false,
    issues: ['Part 1A is broad: the quoted prompt also does not explicitly state constraints. B is the intended most direct answer; wording acceptance does not resolve this overlap.'],
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D3-SOURCE-VERIFICATION-AWARENESS-01': {
    context: 'The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.\n\nThe AI’s draft response includes an important statement, but it does not specify the source or identify the author.\n\nRefunds and exceptions require approval from the person authorized to approve them.',
    prompt: 'Answer both questions. Choose one answer for each.',
    parts: [
      { prompt: 'What evidence issue does the AI’s draft show?', labels: ['The cited source does not support the statement.', 'The statement has no supporting evidence that can be traced to a source.'] },
      { prompt: 'The AI recommends a refund over the frontline team’s approval limit.\nWhat should the team do next?', labels: ['Send the exception to the person authorized to approve the refund.', 'Issue the refund after the AI repeats its recommendation.'] },
    ],
    explanation: 'The draft provides no source or author that the team can check. This differs from citing a source that does not support the statement, and it does not prove the statement is false. The refund requires approval from someone with the necessary authority; repeating an AI recommendation does not give the frontline team permission to issue it.',
    keys: ['b', 'a'], artifactRequired: false,
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D3-SOURCE-VERIFICATION-AWARENESS-02': {
    context: 'The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.\n\nThe AI’s draft provides a source link for a statement. The link opens successfully, but the text on the linked page is about something else.',
    prompt: 'Answer both questions. Choose one answer for each.',
    parts: [
      { prompt: 'What evidence issue does the AI’s draft show?', labels: ['The source does not provide evidence that supports the statement.', 'The sources do not provide independent evidence that confirms the statement.'] },
      { prompt: 'The system timed out during an earlier refund attempt, but the refund may already be complete.\nWhat should the team do next?', labels: ['Check the payment record to confirm the earlier refund’s status before issuing another refund.', 'Issue another refund because the customer still reports a delay.'] },
    ],
    explanation: 'A working link only shows that the source can be opened. The team must also check whether its content supports the statement in the AI’s draft. A timeout does not prove that a refund failed, so the team should confirm the earlier refund’s status before issuing another.',
    keys: ['a', 'a'], artifactRequired: false,
    issues: ['Part 1B refers to multiple sources, while the scenario describes one citation. Its original meaning is retained, but it remains a weak distractor.'],
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D3-SOURCE-VERIFICATION-AWARENESS-03': {
    context: 'The customer service team uses AI to draft a case resolution response. The response must follow approved service policies and reflect the customer’s case history.\n\nThe AI’s draft uses three articles that repeat information from the same press release, with no other supporting evidence.',
    prompt: 'Answer both questions. Choose one answer for each.',
    parts: [
      { prompt: 'What evidence issue does the AI’s draft show?', labels: ['The sources do not provide evidence that supports the statement.', 'The sources do not provide independent evidence that confirms the statement.'] },
      { prompt: 'The AI’s draft says the case is resolved, but the case history shows it is still pending.\nWhat should the team do next?', labels: ['State that the case is resolved to reassure the customer.', 'State that the case is still pending and explain the actual next step.'] },
    ],
    explanation: 'The three articles rely on one original source. Repeating the same press release does not provide separate confirmation of the statement. This does not necessarily mean the statement is false or unsupported by the cited material. The customer response should also reflect the recorded case status and actual next step.',
    keys: ['b', 'b'], artifactRequired: false,
    issues: ['The accepted scenario does not specify the statement referenced by the choices. Preserve the accepted text; adding a concrete statement would need separate content review.'],
  },
};

export function applyEnglishWordingCheckpoint(q) {
  const c = englishWordingCheckpoints[q.id];
  if (!c) return [];
  const d = q.userFacingDraft, changes = [];
  const set = (obj, key, value) => { if (obj[key] !== value) changes.push(key); obj[key] = value; };
  if (d.interaction !== 'parts' || d.parts.length !== c.parts.length || d.parts.some(p => p.options.length !== 2)) throw new Error(`${q.id}: unexpected selected template`);
  if (d.parts.some((p, i) => p.correctOptionIds.length !== 1 || p.correctOptionIds[0] !== c.keys[i] || p.options.map(o => o.id).join(',') !== 'a,b')) throw new Error(`${q.id}: selected key or option order differs from reviewed wording`);
  for (const key of ['context', 'prompt', 'explanation']) set(d, key, c[key]);
  d.parts.forEach((p, i) => {
    set(p, 'prompt', c.parts[i].prompt);
    p.options.forEach((o, j) => set(o, 'label', c.parts[i].labels[j]));
  });
  d.englishWordingReview = { status: 'user-accepted', revision: '2026-10-01.customer-service-review', source: 'docs/QUESTION_REWRITE_RULE_REVIEW_LOG.md#customer-service-review-recap-and-local-implementation---1-october-2026', thaiStatus: 'previous-revision-pending-sync' };
  return changes;
}
