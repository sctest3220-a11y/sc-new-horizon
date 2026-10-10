// Conversation candidates selected for local implementation on 5 October 2026.
// Original audit content and production scoring remain unchanged.
const singular = 'The customer service team uses AI to draft a case resolution response based on approved service policies and the customer’s case history.';
const plural = 'The customer service team uses AI to draft case resolution responses based on approved service policies and customer case histories.';
const approval = 'Refunds and exceptions require approval from the person authorized to approve them.';
const context = (evidence, many = false) => `${many ? plural : singular}\n\n${evidence}\n\n${approval}`;
const part = (prompt, labels) => ({ prompt, labels });
const refund = (reverse = false) => part('The AI recommends a refund over the frontline team’s approval limit.\nWhat should the team do next?', reverse ? ['Issue the refund after the AI repeats its recommendation.', 'Send the exception to the person authorized to approve the refund.'] : ['Send the exception to the person authorized to approve the refund.', 'Issue the refund after the AI repeats its recommendation.']);
const pending = part('The AI’s draft says the case is resolved, but the case history shows it is still pending.\nWhat should the team do next?', ['State that the case is still pending and explain the actual next step.', 'State that the case is resolved to reassure the customer.']);
const timeout = (reverse = false, earlier = false) => {
  const labels = [earlier ? 'Check the payment record to confirm the earlier refund’s status before issuing another refund.' : 'Check the payment record to confirm the refund status before issuing another refund.', 'Issue another refund because the customer still reports a delay.'];
  return part(`${earlier ? 'The system timed out during an earlier refund attempt, but the refund may already be complete.' : 'A previous refund may already be complete, even though the system timed out.'}\nWhat should the team do next?`, reverse ? labels.reverse() : labels);
};
const identity = (reverse = false, earlier = false) => {
  const labels = [earlier ? 'Use the existing identity details because they are already in the system.' : 'Rely on the current identity details because they are already in the system.', 'Follow the established process for verifying and correcting identity details.'];
  return part('The customer says the identity details in the case history are incorrect.\nWhat should the team do next?', reverse ? labels.reverse() : labels);
};
const refundReason = 'The refund requires approval from someone with the necessary authority. Repeating the AI’s recommendation does not give the frontline team permission to issue it.';
const pendingReason = 'The response should reflect the status in the case history. State that the case is still pending and explain the actual next step.';
const timeoutReason = 'A timeout or a customer reporting a delay does not prove that the refund failed. Checking the payment record helps prevent a duplicate refund.';
const identityReason = 'Stored identity details can be incorrect. Follow the established verification and correction process rather than assume information is accurate because it is already in the system.';
const modelTest = 'Test and confirm that the prompt works with the replacement AI model before switching to it.';
const blockErrors = 'Set rules that block responses with serious errors from being released, regardless of the average ratings.';
const dates = 'Record source versions and resolve conflicts about when the information applies before combining it.';
const logs = 'The logs do not contain enough information to determine exactly what was approved.';
const logging = 'The way data is logged makes the controls for limiting input data ineffective.';
const masterData = 'Keep changes to master data separate from transaction approval.';
const single = { interaction: 'single', optionIds: ['best', 'partial', 'weak', 'trend-chasing'], keys: ['best'] };
const raw = {
  'NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-ADVANCED-01': {
    context: context('Teams edit the prompt directly in the live system, but they cannot trace failures to a specific prompt version.', true),
    parts: [part('Which approach to managing prompts best addresses this problem?', [modelTest, 'Keep a version history of prompts and link each released version to the examples used in its evaluation.']), refund()], keys: ['b', 'a'],
    explanation: `Keeping prompt versions and their evaluation examples supports investigating failures and returning to an earlier version when needed. Testing a prompt with a replacement model addresses a model change, which is not the problem described here. ${refundReason}`,
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D2-PROMPT-DESIGN-ADVANCED-03': {
    context: context('The prompt works with one AI model, but the replacement model interprets its instructions for the required data structure differently.', true),
    parts: [part('Which approach to managing prompts best addresses this problem?', ['Make the exception a test case that must still pass after changes before a new version can be released.', modelTest]), pending], keys: ['b', 'a'],
    explanation: `A prompt that works with one model may behave differently with another. Test the prompt with the replacement model and confirm that the combination meets requirements before switching. ${pendingReason}`,
    issues: ['The exception in choice A is undefined. A regression test could be part of the broader evaluation in B; wording acceptance does not resolve this overlap.'],
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D2-OUTPUT-REFINEMENT-ADVANCED-01': {
    context: context('The average ratings for the AI’s responses are improving, but responses with serious factual errors still pass the quality checks.', true),
    parts: [part('Which quality process should the team introduce first?', ['Score the same sample of responses again using both versions of the scoring criteria.', blockErrors]), refund()], keys: ['b', 'a'],
    explanation: `Improving average ratings can hide serious errors. Separate rules should prevent responses with those errors from being released, even when the average ratings are high. ${refundReason}`,
    issues: ['Two versions of the scoring criteria are not established in the scenario. Preserve factual errors in the scenario and broader serious errors in the control.'],
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D2-OUTPUT-REFINEMENT-ADVANCED-02': {
    context: context('Staff repeatedly rewrite the AI’s responses but do not categorize the problems that keep occurring.', true),
    parts: [part('Which quality process should the team introduce first?', ['Record problems by type and link each type to fixes in the prompt or source information.', blockErrors]), timeout(true, true)], keys: ['a', 'b'],
    explanation: `Recording recurring problems by type helps identify changes needed in prompts or source information and supports prevention instead of repeated manual rewriting. Blocking serious errors is useful but does not address the missing categorization and feedback process. ${timeoutReason}`,
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D2-OUTPUT-REFINEMENT-ADVANCED-04': {
    context: context('The response keeps going through revisions even after it meets all requirements.'),
    parts: [part('Which quality process should the team introduce first?', ['Stop revising once clear acceptance criteria are met, and set a limit on revision effort.', blockErrors]), identity(false, true)], keys: ['a', 'b'],
    explanation: `Further revisions do not necessarily improve a response that already meets requirements. Clear acceptance criteria and a revision-effort limit prevent unnecessary rewriting. Blocking serious errors addresses a different quality problem. ${identityReason}`,
    issues: ['The revision limit has no specified units. Reaching a limit does not authorize release of an unacceptable response.'],
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D3-SOURCE-VERIFICATION-ADVANCED-01': {
    context: context('The AI combines information from sources with different effective dates in its response but does not record those dates.'),
    parts: [part('Which rule for checking evidence would best prevent this problem from recurring?', ['Check whether the source passage supports each important statement.', dates]), refund(true)], keys: ['b', 'b'],
    explanation: `Track source versions and establish which information applies to the relevant period before combining it. Checking passage support is useful but does not by itself resolve conflicting effective dates. ${refundReason}`,
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D4-DATA-PRIVACY-PROFICIENT-01': {
    context: context('A record has been deleted from the main database, but the search index still returns that record.'),
    parts: [part('Which assessment best describes this situation?', ['Deletion is incomplete in data stores built from the original records.', 'The system must also enforce the access permissions of the user requesting the data.']), refund()], keys: ['a', 'a'],
    explanation: `Deleting a record from the main database does not complete deletion if the search index still returns it. The scenario does not establish a requesting-user access failure. ${refundReason}`,
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D4-DATA-PRIVACY-PROFICIENT-03': {
    context: context('The task has a valid purpose. A proposal would use the data for another purpose, but there is no approved basis for that use.'),
    parts: [part('Which assessment best describes this situation?', [logging, 'The proposed new use of the data needs a separate review.']), pending], keys: ['b', 'a'],
    explanation: `A valid purpose for the current task does not establish an approved basis for using the data for another purpose. The proposed use needs a separate review. The scenario does not describe a logging problem. ${pendingReason}`,
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D4-SECURITY-GOVERNANCE-PROFICIENT-01': {
    context: context('Logs are available, but they are missing the action payload and approval version.'),
    parts: [part('Which conclusion is supported by these log details?', [logs, 'Some ways of accessing the data still allow access after permission has been withdrawn.']), refund(true)], keys: ['a', 'b'],
    explanation: `Without the action payload and approval version, the logs do not show exactly what was approved. The scenario does not describe continued access after permission was withdrawn. ${refundReason}`,
    issues: ['Approval version is not defined in the original. Do not silently redefine it as a policy version. Earlier accepted withdrawn wording is retained for this item; the newer removed decision is applied to the reviewed PROFICIENT-02 candidate.'],
  },
  'DEPTH-D4-RISK-045': {
    interaction: 'text', optionIds: [], keys: [], labels: [],
    context: 'The procurement team asks whether an AI vendor can use company data to improve its service.',
    prompt: 'Write the key questions about risk you would ask before approving this use of company data.',
    explanation: 'What company data would the vendor use, and for what purposes?\nWould the data be used to train or improve the vendor’s AI models? Can the company opt out of model training?\nHow long would the vendor keep the data, and what are the terms for deleting it?\nWhich subcontractors would process the data on the vendor’s behalf?\nHow would access to the data be controlled, would it be encrypted, and what rights would the company have to audit the vendor?\nHow and when would the vendor notify the company of a data breach?\n\nThese questions should be addressed before any customer data is shared.',
    issues: ['Written response and original rubric retained; service improvement is not automatically model training. No jurisdiction-specific legal requirements added.'],
  },
  'DEPTH-EXP-D4-GOV-077': {
    interaction: 'rank', optionIds: ['contain', 'scope', 'notify', 'fix', 'learn'], keys: ['contain', 'scope', 'notify', 'fix', 'learn'],
    context: 'An AI customer support workflow has sent incorrect refund guidance to customers.', prompt: 'Arrange the response actions from first to last.',
    labels: ['Restrict the affected workflow to prevent further harm.', 'Identify which customers, outputs and data are affected.', 'Notify the relevant people through the approved legal and communications process.', 'Fix the controls, prompts, evidence checks and process for reversing changes.', 'Review the incident, identify who is responsible for follow-up and set measures for preventing similar incidents.'],
    explanation: 'First restrict the affected workflow to prevent further harm. Identify the scope of the incident, notify the relevant people through the approved process, fix the controls and then review the incident with responsibility and prevention measures defined.',
    issues: ['The source does not establish detailed dependencies between the middle response actions. Preserve the ranking key without claiming this is a universal strictly sequential incident-response process.'],
  },
  'TREND-D4-SECURITY-GOVERNANCE-PROFICIENT-01': {
    ...single,
    context: 'An operations team wants an AI agent to assess and prioritize requests, update records and trigger follow-up emails. The team needs to decide what permissions and oversight the agent should have.',
    prompt: 'Which approach best balances useful automation with control over the agent’s access and actions? Choose one answer.',
    labels: ['Start with read-only access and log every proposed action. Require approval for data changes that affect customers, monitor failures and expand permissions only as the evidence improves.', 'Let the agent handle low-value tasks and review a sample of its work each week.', 'Give the agent broad permissions so it can learn the workflow faster.', 'Measure success only by the number of tickets closed per hour.'],
    explanation: 'The first approach connects access limits, approval for changes affecting customers, logs, failure monitoring and evidence before expanding permissions. Low-value tasks are not necessarily low risk. Broad permissions do not establish readiness, and ticket volume alone does not show whether actions are safe or correct.',
    issues: ['Decision scope was clarified after user feedback without inventing an incident. Evidence improves remains undefined, and the keyed choice is much longer and more comprehensive.'],
  },
  'DEPTH-EXP-D5-D6-081': {
    interaction: 'multi', optionIds: ['outcome', 'quality', 'adoption', 'learning', 'volume'], keys: ['outcome', 'quality', 'adoption', 'learning'],
    context: 'A Chief Operating Officer (COO) wants a dashboard to help decide whether to expand AI-assisted drafting from one department to others.',
    prompt: 'Which measures should the dashboard include to support this decision? Select four answers.',
    labels: ['Workflow results compared with the baseline, such as time to complete work or the number of resolved tickets.', 'Quality problems, work that needs to be redone, exceptions and incidents affecting customers.', 'Continued AI use by role and which staff receive coaching from managers.', 'Reasons staff override AI outputs, user feedback and updates to prompts or workflows.', 'The total number of prompts sent as the only measure of success.'],
    explanation: 'The dashboard should show whether results improve, whether quality problems occur, whether staff continue using AI and receive coaching, and whether feedback leads to changes. Prompt volume alone shows activity, not whether expanding AI use is worthwhile.',
    issues: ['Four correct choices and a single distractor containing only make the answer easier to guess. The existing productivity chart is unnecessary for selecting measures.'],
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D3-SOURCE-VERIFICATION-ADVANCED-02': {
    context: context('Several sources repeat information from the same press release, and that information is counted more than once as supporting evidence.'),
    parts: [part('Which rule for checking evidence would best prevent this problem from recurring?', [dates, 'Trace each source back to its origin and count independent sources of evidence.']), timeout()], keys: ['b', 'a'],
    explanation: `Several sources repeating the same press release do not provide independent confirmation. Tracing their origins prevents repeated information from increasing confidence without additional evidence. ${timeoutReason}`,
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D3-SOURCE-VERIFICATION-ADVANCED-04': {
    context: context('Staff reviewing the AI’s draft accept its sources after checking that the links open, without reading whether the source text supports the statements.'),
    parts: [part('Which rule for checking evidence would best prevent this problem from recurring?', ['When a source changes, use the links between statements and their sources to identify which statements need another review.', 'Require reviewers to read the relevant source text and check whether it supports each important statement.']), identity()], keys: ['b', 'b'],
    explanation: `A link opening successfully does not establish that its content supports a statement. Reviewers must check the relevant text. Reviewing statements when sources change is useful, but it does not address the missing support check during the initial review. ${identityReason}`,
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D3-FRAUD-DETECTION-ADVANCED-02': {
    context: context('When staff receive suspicious requests, they verify them using the phone numbers provided in those same requests.'),
    parts: [part('Which change would best address the problem with how staff verify suspicious requests?', ['Verify requests using contact records maintained independently of those requests.', masterData]), timeout()], keys: ['a', 'a'],
    explanation: `Someone sending a fraudulent request could provide a phone number they control. Using independently maintained contact records avoids relying on the suspicious request to verify itself. Separating master-data changes from transaction approval does not directly address this verification problem. ${timeoutReason}`,
    issues: ['The original tests general fraud-prevention controls within an AI-assisted workflow; it does not describe an AI-specific failure. Master data is not defined in the scenario.'],
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D3-FRAUD-DETECTION-ADVANCED-04': {
    context: context('Someone has gained unauthorized access to an account, but the account remains active even after several suspicious requests are reported.'),
    parts: [part('Which change would best address the account security problem?', [masterData, 'Restrict the account’s access and investigate related actions through the incident response process.']), identity(true)], keys: ['b', 'a'],
    explanation: `The account remains active after unauthorized access, so further actions may still be possible. Restricting access helps prevent further harm, while investigating related actions establishes what may already have happened. Separating master-data changes from transaction approval does not directly address this ongoing access. ${identityReason}`,
    issues: ['The source does not establish that AI caused the unauthorized access or that the compromise caused the disputed identity details. Master data remains undefined.'],
  },
  'TREND-D3-FRAUD-DETECTION-ADVANCED-01': {
    ...single,
    context: 'Leadership wants to expand generative AI, AI agents and workflows that use different types of content across departments. However, the organization has limited capacity to oversee their use.\n\nThe organization needs fraud and manipulation controls that can support this expansion, including checks for phishing, suspicious materials and invoice fraud.',
    prompt: 'Which approach best supports the move from AI experiments to routine operations across the organization? Choose one answer.',
    labels: ['Establish a tiered approach to running AI: review proposed uses, apply controls based on risk, use evaluation results, review incidents, train staff for their roles and use measurable business value to decide whether to proceed.', 'Create one central committee to approve every AI request.', 'Let each team choose its own tools independently to move faster.', 'Delay all AI adoption until regulations are fully settled.'],
    explanation: 'A combines oversight, evaluation, incident review, staff training and measurable value. Applying controls according to risk helps the organization manage different uses of AI as adoption expands. A central committee alone does not provide this complete approach. Independent tool selection does not establish shared controls, while delaying all adoption does not provide a way to manage current opportunities and risks.',
    issues: ['The choices primarily assess general AI governance rather than fraud detection. Choice A is much longer and more comprehensive. Authoring guidance was reframed as task scope and year-based market framing removed in the accepted candidate; no current market claim was verified. Original per-option feedback still reflects the original competency mapping and awaits content revision.'],
  },
  'TREND-D3-FRAUD-DETECTION-ADVANCED-02': {
    ...single,
    context: 'A regional business wants AI systems that work well in the local language and meet industry rules and requirements for where data is stored. It also wants to address the risks of depending on a vendor.',
    prompt: 'Which approach best addresses these requirements before the business introduces the AI systems? Choose one answer.',
    labels: ['Assess model capabilities, local-language performance, data storage locations, auditability, options for leaving the vendor and local regulatory requirements before planning the rollout.', 'Choose the strongest global model and translate its outputs into the local language.', 'Use only local models, even if they cannot perform critical tasks.', 'Treat local control over AI systems and data as only a hosting decision, without considering operations and governance.'],
    explanation: 'A considers whether the AI can perform the required work alongside language, data location, audit, vendor dependence and regulatory needs. Translating outputs addresses only part of the requirements. Choosing local models does not establish that they can perform critical tasks, and hosting alone does not address how the systems are operated and governed.',
    issues: ['The original scenario and choices assess AI selection and governance more directly than fraud detection. Authoring instructions were removed without inventing a fraud incident. Choice A remains substantially more comprehensive. Original per-option feedback still reflects the original competency mapping and awaits content revision.'],
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D4-DATA-PRIVACY-PROFICIENT-02': {
    context: context('The system checks access permissions when it adds information to the search index. However, different users receive search results without restrictions based on their individual permissions.'),
    parts: [part('Which assessment best describes this situation?', ['The system must also enforce the access permissions of the user requesting the information.', logging]), timeout(true)], keys: ['a', 'b'],
    explanation: `Checking permissions when information enters the search index does not establish what each later user is allowed to access. The system must enforce the requesting user’s permissions when returning results. The scenario does not describe a logging problem. ${timeoutReason}`,
  },
  'NH-FUNCTION-CUSTOMERSERVICE-D4-SECURITY-GOVERNANCE-PROFICIENT-02': {
    context: context('One team’s access permission has been removed, but the team can still read results saved in the system’s cache.'),
    parts: [part('Which conclusion is supported by this situation?', [logs, 'Some ways of accessing the data still allow access after permission has been removed.']), timeout()], keys: ['b', 'a'],
    explanation: `The team can still read cached results after losing permission. This shows that the permission change has not taken effect across every way of accessing the data. The scenario does not establish that logs are incomplete. ${timeoutReason}`,
    issues: ['User explicitly selected removed in place of withdrawn. This describes removing access permission, not deleting the data or the cache. The original prompt mentions test results without supplying a test report; the reviewed prompt refers to the described situation.'],
  },
};
export const octoberControlsCheckpoints = Object.fromEntries(Object.entries(raw).map(([id, c]) => [id, {
  prompt: 'Answer both questions. Choose one answer for each.', ...c,
  artifactRequired: false, revision: '2026-10-05.controls-review',
  reviewSource: 'docs/QUESTION_REWRITE_RULE_REVIEW_LOG.md#controls-review-local-implementation---5-october-2026',
}]));
