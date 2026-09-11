// Synthetic work settings. These are exercise assumptions, never real policies or legal advice.
const setting = (label, deliverable, source, owner, constraint, consequence) => ({
  label, deliverable, source, owner, constraint, consequence,
});

export const coreContexts = [
  setting('Project team', 'project update', 'approved project records', 'project lead', 'Only the current approved version may be circulated.', 'A wrong update can send the team to the wrong milestone.'),
  setting('Community learning group', 'workshop guide', 'reviewed learning materials', 'workshop coordinator', 'The guide must work for readers with no AI background.', 'An unsupported instruction can mislead new learners.'),
  setting('Small business', 'service briefing', 'approved service records', 'service owner', 'Customer identifiers must stay out of the briefing.', 'A wrong claim can create a service commitment.'),
  setting('Internal support team', 'support response', 'maintained knowledge articles', 'support lead', 'Staff must approve the response before it is sent.', 'An incorrect answer can cause repeated support work.'),
  setting('Research group', 'evidence summary', 'documented source extracts', 'research lead', 'Every material factual claim needs traceable evidence.', 'An unsupported result can distort the recommendation.'),
  setting('Volunteer organization', 'coordination plan', 'approved volunteer schedules', 'coordinator', 'Named people must confirm changes to their assignments.', 'A missed handoff can leave a service uncovered.'),
  setting('Training team', 'practice exercise', 'reviewed training examples', 'training lead', 'Examples must be suitable for mixed levels of experience.', 'A misleading exercise can reinforce an incorrect habit.'),
  setting('Product team', 'release note', 'approved release records', 'release owner', 'Unreleased capabilities must not be described as available.', 'A false capability claim can change a purchase decision.'),
];

export const functionContexts = {
  general: setting('Cross-functional professional', 'operating brief', 'approved project and service records', 'process owner', 'Recommendations must distinguish facts from assumptions.', 'A false dependency can delay several teams.'),
  people: setting('People / HR', 'employee service response', 'approved HR procedures and anonymized case records', 'HR service lead', 'Employment decisions require a named human decision maker.', 'A mistaken claim can affect an employee opportunity.'),
  finance: setting('Finance', 'reconciliation recommendation', 'approved ledger extracts and reconciled invoice records', 'finance controller', 'No payment or journal entry may be released by the assistant.', 'A wrong recommendation can create an incorrect financial entry.'),
  marketing: setting('Marketing', 'campaign content recommendation', 'approved campaign evidence and licensed asset records', 'campaign owner', 'Performance claims and asset rights must be checked before publication.', 'A misleading claim can be repeated across a campaign.'),
  sales: setting('Sales', 'account proposal', 'approved CRM extracts and current commercial terms', 'account owner', 'Only the account owner may approve pricing and delivery promises.', 'An unsupported promise can become a customer dispute.'),
  customerService: setting('Customer service', 'case resolution response', 'approved service policies and case history', 'service supervisor', 'Refunds and exceptions need the designated approver.', 'An incorrect resolution can duplicate compensation or deny support.'),
  technical: setting('Technical / engineering', 'change recommendation', 'approved repository records and test results', 'engineering owner', 'Production changes need review and a tested recovery path.', 'A wrong change can interrupt the service.'),
  operations: setting('Operations', 'handoff plan', 'approved work orders and current service schedules', 'operations lead', 'Each operational exception needs an owner and escalation route.', 'A lost handoff can stop an active process.'),
};

export const industryContexts = {
  education: setting('Education', 'learner support plan', 'approved course guidance and anonymized learner records', 'education lead', 'Staff review learner-impacting recommendations; no student identifiers may leave the approved workspace.', 'A flawed recommendation can restrict access to learning.'),
  financial: setting('Financial services', 'customer case recommendation', 'approved product terms and anonymized transaction evidence', 'case control owner', 'Account actions require independent verification and an authorized approver.', 'A false action can affect access to funds.'),
  healthcare: setting('Healthcare administration', 'appointment service response', 'approved scheduling guidance and anonymized service records', 'service manager', 'The assistant supports administration only; clinical questions go to a qualified clinician.', 'A wrong administrative response can delay appropriate care.'),
  retail: setting('Retail', 'returns campaign recommendation', 'approved product, returns, and licensed media records', 'retail service owner', 'Returns promises must match the current approved terms.', 'A wrong claim can affect many purchase or return decisions.'),
  public: setting('Public services', 'service access explanation', 'approved service criteria and anonymized case records', 'service authority', 'Eligibility decisions require authorized staff and a usable review route.', 'An incorrect explanation can prevent access to a public service.'),
};

export const executiveContexts = {
  ceo: setting('CEO', 'enterprise investment recommendation', 'portfolio results and approved operating plans', 'executive sponsor', 'Scaling decisions need explicit accountable owners and measurable outcomes.', 'A weak scale decision can spread failure across the enterprise.'),
  board: setting('Board', 'oversight recommendation', 'assurance reports and approved risk records', 'board committee chair', 'Management executes controls; the board requires evidence of their effectiveness.', 'Assurance gaps can hide material operating risk.'),
  people: setting('People executive', 'workforce adoption recommendation', 'anonymized workforce feedback and approved people policies', 'people executive', 'Workforce-impacting decisions need employee input and named human accountability.', 'Adoption targets can conceal unequal workload or opportunity.'),
  finance: setting('Finance executive', 'funding recommendation', 'validated business cases and approved financial records', 'finance executive', 'Benefits must be attributable and funding gates independently checkable.', 'A weak business case can lock capital into ineffective projects.'),
  technology: setting('Technology executive', 'platform architecture recommendation', 'architecture assessments and approved security findings', 'technology executive', 'Production expansion requires testable boundaries and a recovery owner.', 'A shared platform defect can affect many services at once.'),
  transformation: setting('Transformation executive', 'operating model recommendation', 'pilot outcomes and approved change plans', 'transformation executive', 'Scale decisions must account for workflow ownership and adoption evidence.', 'A tool rollout can fail when the surrounding process stays unchanged.'),
};
