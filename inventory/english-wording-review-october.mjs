// Latest conversation versions selected for local inventory implementation on 5 October.
// This does not promote scored items or approve new Thai translations.
const singular = 'The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.';
const plural = 'The customer service team uses AI to draft case resolution responses based on approved service policies and customer case histories.';
const approval = 'Refunds and exceptions require approval from the person authorized to approve them.';
const pending = { prompt: 'The AI’s draft says the case is resolved, but the case history shows it is still pending.\nWhat should the team do next?', labels: ['State that the case is still pending and explain the actual next step.', 'State that the case is resolved to reassure the customer.'] };
const refund = { prompt: 'The AI recommends a refund over the frontline team’s approval limit.\nWhat should the team do next?', labels: ['Send the exception to the person authorized to approve the refund.', 'Issue the refund after the AI repeats its recommendation.'] };
const timeout = { prompt: 'The system timed out during an earlier refund attempt, but the refund may already be complete.\nWhat should the team do next?', labels: ['Check the payment record to confirm the earlier refund’s status before issuing another refund.', 'Issue another refund because the customer still reports a delay.'] };
const evidence = 'Require supporting evidence that staff can check for important statements before sending a response.';
const raw = {
  'NH-FUNCTION-CUSTOMERSERVICE-D4-DATA-PRIVACY-AWARENESS-04': {
    context: `${singular}\n\nThe response only needs a group summary, but the prompt includes names and full individual records.`,
    parts: [
      { prompt: 'What privacy issue does this situation show?', labels: ['The AI retrieved records outside the team’s access permissions.', 'More personal information was provided than the task needed.'] },
      { prompt: 'The customer says the identity details in the case history are incorrect.\nWhat should the team do next?', labels: ['Use the existing identity details because they are already in the system.', 'Follow the established process for verifying and correcting identity details.'] },
    ], keys: ['b', 'b'],
    explanation: 'A group summary is sufficient for the task, so names and full individual records are unnecessary. The scenario does not establish an access-permission violation. When the customer disputes their identity details, the team should follow the established verification and correction process.',
    issues: ['The original does not specify the group summary or explain why the case needs it. AI-specific relevance remains a content-review issue.'],
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D6-ROLE-CLARITY-AWARENESS-01': {
    context: `${singular}\n\nThe team sends an AI-drafted response containing a mistake to the customer. No one is responsible for correcting the mistake or notifying the customer.\n\n${approval}`,
    parts: [{ prompt: 'Which responsibility is missing?', labels: ['A person responsible for correcting errors and notifying affected customers.', 'A person responsible for checking the facts in the response.'] }, refund], keys: ['a', 'a'],
    explanation: 'Someone must take responsibility for correcting the mistake and notifying the customer after the response has been sent. Checking facts is also important, but it does not address the missing responsibility described here. The refund exceeds the frontline team’s authority and needs approval. Repeating an AI recommendation does not give the team permission to issue it.',
    issues: ['User explicitly clarified that the sent response contains a mistake. The audit says the released output causes an error; retain this distinction in review history.'],
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D6-ROLE-CLARITY-AWARENESS-02': {
    context: `${singular}\n\nThe AI prepares the draft, but no one has been assigned to check whether the information is correct.\n\n${approval}`,
    parts: [{ prompt: 'Which responsibility is missing?', labels: ['A person responsible for approving actions.', 'A person responsible for checking the facts in the response.'] }, timeout], keys: ['b', 'a'],
    explanation: 'The AI prepares the draft, but a person must be assigned to check its factual accuracy. Responsibility for checking information is different from authority to approve an action. A timeout does not prove that the refund failed. Checking the payment record helps the team avoid refunding the customer twice.',
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D6-ROLE-CLARITY-AWARENESS-03': {
    context: `${singular}\n\nA staff member checks the AI’s draft but does not have authority to approve the action it recommends. ${approval}`,
    parts: [{ prompt: 'Which responsibility is still needed before the action can go ahead?', labels: ['A person responsible for correcting errors.', 'A person authorized to approve the action.'] }, pending], keys: ['b', 'a'],
    explanation: 'Checking the AI’s draft does not give the staff member authority to approve the recommended action. Approval must come from someone with the required authority. The response should reflect the status in the case history. The team should explain what happens next without telling the customer that a pending case is resolved.',
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D1-CAPABILITY-LIMITS-ADVANCED-01': {
    context: `${plural}\n\nThe team noticed that the AI makes mistakes more often right after the source data is updated, while remaining accurate on older cases.\n\n${approval}`,
    parts: [{ prompt: 'Which rule best addresses this pattern of mistakes?', labels: ['Check which source version the AI uses and test its responses whenever the sources are updated.', 'Send that type of exception to a staff member for review and evaluate it separately.'] }, refund], keys: ['a', 'a'],
    explanation: 'The mistakes occur around source updates, so the team should check source versions and test the AI’s responses after updates. This pattern suggests a problem with handling updated information; it does not establish the exact cause. The refund requires approval from someone with the necessary authority. Repeating the AI’s recommendation does not give the frontline team permission to issue it.',
    issues: ['Part 1B refers to an exception type that the scenario does not define. Preserve the original meaning pending a separate content revision.'],
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D1-CAPABILITY-LIMITS-ADVANCED-02': {
    context: `${plural}\n\nThe AI gives reliable responses for routine cases, but its responses are inconsistent for one specific type of exception.\n\n${approval}`,
    parts: [{ prompt: 'Which rule best addresses this pattern?', labels: [evidence, 'Send that type of exception to a staff member for review and test the AI’s performance on those cases separately.'] }, timeout], keys: ['b', 'a'],
    explanation: 'Human review and separate testing address the specific type of exception where the AI performs inconsistently. Checking supporting evidence is useful, but it does not directly address this difference in performance. A timeout does not prove that the refund failed. Confirming the earlier refund’s status helps prevent refunding the customer twice.',
    issues: ['The original does not identify the specific exception type; no example has been invented. Evidence checks and targeted review can work together.'],
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D1-CAPABILITY-LIMITS-ADVANCED-03': {
    context: `${plural}\n\nThe AI generates responses that sound confident even when required data fields are missing.\n\n${approval}`,
    parts: [{ prompt: 'Which rule best addresses this problem?', labels: [evidence, 'Test whether the AI avoids answering when critical inputs are missing, and block decisions that depend on those inputs.'] }, pending], keys: ['b', 'a'],
    explanation: 'The AI gives confident answers despite missing required data fields. The team should test whether it refrains from answering without critical inputs and block decisions that depend on those inputs. The response should reflect the status in the case history. The team should explain the actual next step without presenting a pending case as resolved.',
    issues: ['Preserve required data fields in the scenario and the broader critical inputs in Part 1B. Missing fields are not the same as blank fields. Part 1A is also a useful safeguard; B directly addresses missing critical inputs.'],
  },
  'FUNC-GEN-D5-001': {
    interaction: 'rank', optionIds: ['workflow', 'baseline', 'controls', 'pilot'], keys: ['workflow', 'baseline', 'controls', 'pilot'],
    context: 'A team leader wants to choose one AI workflow for a pilot. The proposed ideas differ in expected benefits, risks and readiness.',
    prompt: 'Arrange the pilot steps from first to last.',
    labels: ['Define the workflow problem and identify the users affected.', 'Record the current time spent, quality, risks and work volume.', 'Decide who is responsible, when reviews are required and what data can be used.', 'Run the pilot for a fixed period, with clear criteria for success and when to stop.'],
    explanation: 'Define the problem and who is affected, then record current performance so improvement can be measured. Set responsibilities, reviews and data boundaries before running a limited pilot with clear success and stop criteria.',
    issues: ['The original context concerns choosing between pilot ideas, while the steps concern preparing and running a pilot. Production ranking interaction and scoring are unchanged.'],
  },
  'FUNC-CS-D5-003': {
    interaction: 'multi', optionIds: ['a', 'b', 'c', 'd', 'e'], keys: ['a', 'b', 'c', 'd'],
    context: 'A customer service manager wants to evaluate whether AI-assisted replies improve the team’s work before expanding their use.',
    prompt: 'Which measures should the manager track? Select four answers.',
    labels: ['First-contact resolution rate and reopened-ticket rate.', 'Service Level Agreement (SLA) breach rate, the number of escalated cases, and the number of customer complaints.', 'How often staff edit AI drafts and complete the evidence check.', 'Customer satisfaction after receiving AI-assisted replies.', 'Only the number of AI-assisted replies sent per hour.'],
    explanation: 'These measures cover resolution quality, service problems, staff review and customer experience. Reply volume alone cannot show whether answers are accurate, cases stay resolved or customers receive better support. When comparing escalation and complaint counts, account for differences in total case volume.',
    issues: ['User-requested choice B changes escalation/dispute rates to counts and broader customer complaints. This is a recorded content change, not synonym substitution.', 'The original four-correct, one-distractor structure and the guessing clue in only remain unchanged.'],
  },
  'FUNC-EXP-GEN-D5-001': {
    interaction: 'multi', optionIds: ['a', 'b', 'c', 'd', 'e'], keys: ['a', 'b', 'c', 'd'],
    context: 'Leaders from several departments are choosing between AI pilots in HR policy support, summaries for month-end financial reports, campaign optimization and customer refunds.',
    prompt: 'Which criteria should the leaders use to prioritize an AI pilot? Select four answers.',
    labels: ['A clear problem in the workflow, with measures of current performance to compare against.', 'Approved, up-to-date data sources that are specific to the task.', 'Human review before taking financial, policy, hiring or customer-related actions.', 'Clear criteria for success, stopping the pilot and expanding its use, agreed before launch.', 'An impressive demo, even though responsibility for the pilot is unclear.'],
    explanation: 'A clear problem and current performance measures help the team evaluate improvement. Suitable data sources support the AI’s responses, while human review provides oversight before consequential actions. Criteria agreed before launch help the team decide whether to continue, stop or expand the pilot. An impressive demo does not compensate for unclear responsibility.',
    issues: ['The user specified summaries for month-end financial reports; original close commentary could include explanations beyond monthly summaries.', 'Undefined premium was removed in the reviewed candidate. Original option E remains an obvious distractor.'],
  },
  'DEPTH-EXP-D5-VALUE-079': {
    interaction: 'text', optionIds: [], keys: [], labels: [],
    context: 'A sales team is considering buying an AI forecasting assistant. The team is impressed because the assistant predicts higher quarterly sales, but it has not checked the forecast’s accuracy.',
    prompt: 'Write 2–4 sentences explaining what evidence would justify funding a pilot of this AI forecasting assistant.',
    explanation: 'Compare the AI’s forecast accuracy with the team’s current forecasting method on similar deals, checking results by sales stage and time since the last customer contact. Look for evidence that the AI helps sales staff make better follow-up decisions, rather than simply predicting higher sales. During the pilot, track customer impact, whether staff use the assistant in their daily work, and why they change its forecasts. Agree on criteria for success, stopping the pilot and expanding its use before the pilot starts.',
    issues: ['User passed the explicit clarification that forecast accuracy has not been checked; this was not stated in the audit.', 'Initial funding evidence and results needed before expansion are distinct. Written-response rubric and production scoring remain unchanged.'],
  },
};
export const octoberReviewCheckpoints = Object.fromEntries(Object.entries(raw).map(([id, c]) => [id, {
  prompt: 'Answer both questions. Choose one answer for each.', ...c,
  artifactRequired: false, revision: '2026-10-05.review-follow-up',
  reviewSource: 'docs/QUESTION_REWRITE_RULE_REVIEW_LOG.md#english-review-implementation---5-october-2026',
}]));
