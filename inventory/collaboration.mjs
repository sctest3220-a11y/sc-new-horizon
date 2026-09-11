export const collaboration = {
  'D6-role-clarity': {
    awareness: ['Which responsibility is missing?', [
      ['An assistant drafts a {{deliverable}}, but nobody is named to verify its factual content.', 'A human owner for factual review.', 'Creating a draft does not assign responsibility for checking it.'],
      ['A reviewer checks the draft but has no authority to release the resulting action.', 'A designated action approver.', 'Review and authorization may belong to different roles.'],
      ['Two teams each assume the other will handle unresolved exceptions.', 'An explicit exception owner and handoff.', 'Shared assumptions leave the exceptional work unowned.'],
      ['A released output causes an error, but nobody owns correction or user notification.', 'A remediation owner.', 'Accountability includes the response after a failure.'],
    ]],
    applied: ['Which assignment resolves the stated ownership gap?', [
      ['The assistant can draft accurately, but a consequential decision remains with {{owner}}.', 'Keep drafting with the assistant and final judgment with the owner.', 'The task separates assistance from the accountable decision.'],
      ['A reviewer finds an exception outside their authority.', 'Send the evidence to the named exception authority.', 'The reviewer should escalate rather than invent permission.'],
      ['A task moves to another team without acknowledgment.', 'Require an accepted handoff with a named receiving owner.', 'Sending work does not establish that someone has accepted it.'],
      ['An error has already reached users, and the original drafter is unavailable.', 'Activate the assigned correction owner and communication process.', 'Remediation needs continuity beyond the person who produced the draft.'],
    ]],
    proficient: ['Which interpretation best fits the workflow evidence?', [
      ['Every role signs the form, but each believes another role checked the sources.', 'Multiple signatures conceal an unassigned verification responsibility.', 'More sign-offs do not help if the substantive check has no owner.'],
      ['The named approver receives too little time or evidence to assess the action.', 'The approval role lacks the conditions for meaningful review.', 'Formal accountability must be supported by usable information and capacity.'],
      ['The assistant is called the “decision owner” although it cannot accept institutional accountability.', 'The accountable human or organizational role remains undefined.', 'A tool label does not establish responsibility for consequences.'],
      ['Two owners can override each other with no precedence or dispute path.', 'The decision-rights model contains an unresolved conflict.', 'Overlapping authority needs an explicit resolution rule.'],
    ]],
    advanced: ['Which operating-model change best addresses the repeated failure?', [
      ['The same gap appears at boundaries between several functions.', 'Define accepted handoffs and end-to-end accountability across functions.', 'Local role descriptions alone do not resolve cross-functional ownership gaps.'],
      ['Automation expands to new actions while the original approval model stays fixed.', 'Reassess decision rights for each newly automated capability.', 'Changed capabilities can invalidate the original responsibility allocation.'],
      ['Review duties grow with volume, but reviewers cannot sustain the required checks.', 'Redesign capacity and risk-tiered review with tested escalation.', 'A nominal control is ineffective when the assigned role cannot perform it.'],
      ['Incidents are corrected locally but no owner can change the shared workflow.', 'Assign a system owner with authority for shared corrective changes.', 'Recurring systemic issues require responsibility beyond individual cases.'],
    ]],
  },
  'D6-trust-culture': {
    awareness: ['Which team behavior is most directly at issue?', [
      ['A staff member spots an error but stays silent after previous concerns were mocked.', 'The environment discourages speaking up.', 'Prior responses have made reporting a concern feel unsafe.'],
      ['Staff accept a {{deliverable}} because “the AI sounded certain.”', 'Confidence is being substituted for evidence.', 'Trust in wording does not establish the factual basis of the output.'],
      ['A manager hides their own AI mistake while asking others to report errors.', 'Leadership behavior conflicts with the reporting expectation.', 'Modeling secrecy weakens the credibility of the stated practice.'],
      ['Staff are told to trust a system but cannot learn what it does or where it fails.', 'The team lacks transparency needed for informed trust.', 'Trust should be supported by understandable capability and limitation evidence.'],
    ]],
    applied: ['Which response best supports constructive challenge?', [
      ['A reviewer reports that an AI answer conflicts with {{source}}.', 'Thank the reviewer and check the specific evidence before deciding.', 'A respectful evidence review reinforces useful challenge.'],
      ['A manager’s AI-assisted draft contains a material error.', 'Acknowledge the error and demonstrate the correction process.', 'Visible ownership makes the reporting expectation credible.'],
      ['Staff disagree about a model result but argue from seniority rather than evidence.', 'Use a shared source and rubric to resolve the disagreement.', 'A common evidence standard reduces reliance on status.'],
      ['Staff misunderstand which parts of the {{deliverable}} were generated and reviewed.', 'Explain the workflow and the actual review boundaries.', 'Accurate transparency helps staff calibrate reliance on the result.'],
    ]],
    proficient: ['Which conclusion best fits these team signals?', [
      ['Reported incidents fall after managers begin penalizing people who raise concerns.', 'Lower reporting does not establish fewer underlying incidents.', 'The incentive change may suppress observation rather than reduce failure.'],
      ['Staff praise the tool in meetings but privately describe repeated unaddressed errors.', 'Public feedback may be distorted by social pressure.', 'Different reporting settings reveal a possible barrier to candid feedback.'],
      ['Teams either accept all AI output or reject it all, regardless of task evidence.', 'Trust is poorly calibrated to specific capabilities and limits.', 'Appropriate reliance varies with evidence and task conditions.'],
      ['The same evidence-based challenge is accepted from managers but dismissed from junior staff.', 'The review process is privileging status over evidence.', 'Equivalent evidence should receive equivalent substantive consideration.'],
    ]],
    advanced: ['Which intervention best addresses the observed culture problem?', [
      ['Reporting channels exist, but employees fear retaliation from their immediate manager.', 'Provide protected escalation and monitor how concerns are handled.', 'The barrier concerns consequences of reporting, not simply channel availability.'],
      ['Trust surveys improve, but staff cannot identify situations requiring human review.', 'Evaluate calibrated reliance through concrete task scenarios.', 'Positive sentiment does not establish appropriate use of the system.'],
      ['Teams share only success stories, preventing others from learning about known limits.', 'Institutionalize evidence-based failure reviews with visible follow-through.', 'Learning requires circulation of limitations and corrective action.'],
      ['Leadership messages praise challenge while performance goals reward unquestioning speed.', 'Align incentives and manager evaluation with evidence-based review.', 'Contradictory rewards can override the stated cultural expectation.'],
    ]],
  },
  'D6-change-enablement': {
    awareness: ['Which adoption support is missing?', [
      ['Staff receive licenses but no examples of using the tool in their actual work.', 'Task-relevant practice and guidance.', 'Access alone does not teach a useful workflow.'],
      ['Staff know how to draft, but no one explains which uses are approved.', 'Clear permitted-use boundaries.', 'Adoption requires understanding where the capability may be used.'],
      ['A new process launches with no contact for problems or exceptions.', 'An accessible support and escalation route.', 'Users need help when real work does not match the demonstration.'],
      ['Training is available only during hours that one major user group cannot attend.', 'Equitable access to learning opportunities.', 'The delivery arrangement excludes part of the intended audience.'],
    ]],
    applied: ['Which intervention addresses the demonstrated adoption barrier?', [
      ['Users finish a general course but cannot produce a usable {{deliverable}}.', 'Practice the real task with feedback on representative examples.', 'Transfer to work needs task-specific application, not only general exposure.'],
      ['Users avoid the tool because they cannot tell which records may be used.', 'Publish clear examples of permitted inputs and escalation cases.', 'The barrier is uncertainty about the operating boundary.'],
      ['Early users succeed, but peers cannot obtain help when they encounter exceptions.', 'Create a supported champion and escalation network.', 'Adoption needs accessible help beyond the initial enthusiasts.'],
      ['A group misses live sessions because of shift patterns.', 'Offer equivalent practice and support through accessible schedules.', 'The intervention should remove the participation barrier.'],
    ]],
    proficient: ['Which interpretation best explains the adoption data?', [
      ['Training completion is high, but observed task performance remains weak.', 'Completion is not evidence of practical proficiency.', 'Participation and demonstrated capability measure different things.'],
      ['Usage drops after support is withdrawn even though the tool is unchanged.', 'The rollout depended on a support capability that was not sustained.', 'The change in operating support is relevant to the adoption decline.'],
      ['One team adopts quickly while another faces incompatible approval requirements.', 'The second team has a workflow-fit barrier, not necessarily resistance.', 'Different controls can explain different adoption patterns.'],
      ['Managers demand use but provide no time to practice or review outputs.', 'The adoption expectation conflicts with available work capacity.', 'Staff need time and conditions to perform the new workflow responsibly.'],
    ]],
    advanced: ['Which rollout design best addresses the organizational constraint?', [
      ['A single training package is planned for roles with materially different decisions and risks.', 'Use a shared foundation plus role-specific practice and controls.', 'Common concepts can coexist with different operational requirements.'],
      ['Success depends on a few champions who have no allocated time or succession plan.', 'Fund support capacity and transfer knowledge beyond the initial champions.', 'An unresourced informal network is a fragile scale assumption.'],
      ['A rollout plan measures attendance and logins but has no service outcome.', 'Link adoption measures to task quality and realized workflow outcomes.', 'The change program should show what improves beyond participation.'],
      ['The new process benefits one team while adding uncompensated work to another.', 'Redesign cross-team workload and incentives with affected users.', 'A local adoption win can fail through displaced effort elsewhere.'],
    ]],
  },
  'D6-learning-loops': {
    awareness: ['Which element of the learning loop is absent?', [
      ['Users report recurring errors, but no one groups or reviews the reports.', 'A process for analyzing feedback.', 'Collection alone does not turn observations into learning.'],
      ['A prompt changes after complaints, but no test checks whether the issue improves.', 'Evaluation of the proposed improvement.', 'A change is not evidence of a successful correction.'],
      ['The issue is fixed, but users who reported it never hear what happened.', 'Feedback to the people who supplied the evidence.', 'Closing the loop helps users understand and trust the improvement process.'],
      ['Skills are assessed once, and the result is reused after tasks and tools change.', 'Reassessment under changed conditions.', 'Earlier evidence may no longer describe present capability.'],
    ]],
    applied: ['Which next step completes the missing learning action?', [
      ['Several users flag the same unclear instruction in the {{deliverable}}.', 'Group the reports and inspect the shared instruction with examples.', 'Repeated item-level evidence can identify a specific improvement candidate.'],
      ['A revised prompt is ready, but its effect is unknown.', 'Compare it against the baseline on relevant held-out cases.', 'The proposed fix needs evidence before becoming the new standard.'],
      ['A fix passes evaluation and is released, but related guidance remains outdated.', 'Update the guidance and tell affected users what changed.', 'Learning must reach the people using the changed workflow.'],
      ['A user improves after practice, but the only score is from before the practice.', 'Collect fresh evidence on the targeted competency.', 'A reassessment can test whether the intended capability improved.'],
    ]],
    proficient: ['Which conclusion is supported by the improvement evidence?', [
      ['A question receives many complaints but is shown far more often than other questions.', 'Compare complaint rates and context, not raw counts alone.', 'Exposure differences can explain unequal complaint totals.'],
      ['Scores rise when the same questions are repeated immediately after showing answers.', 'The result may reflect recall rather than transferable learning.', 'Repeated exposure to known answers weakens the capability inference.'],
      ['A revision improves one user group while another group performs worse.', 'The change has a subgroup regression that needs review.', 'An overall gain can hide a harmful effect on part of the audience.'],
      ['The team changes the prompt and scoring rubric at the same time.', 'The observed score change cannot be attributed to the prompt alone.', 'The measurement changed alongside the intervention.'],
    ]],
    advanced: ['Which learning-system design addresses the repeated failure?', [
      ['Feedback-driven edits are published automatically without answer-key review.', 'Keep proposals separate and require evidence-based approval before scored use.', 'Scored content needs reviewed changes rather than unverified feedback mutations.'],
      ['Improvement tests reuse the same cases that generated the proposed fixes.', 'Maintain held-out and transfer evaluations separate from development examples.', 'Learning claims require evidence beyond the cases used to design the fix.'],
      ['The inventory expands rapidly with closely related variants.', 'Track item families and control exposure and calibration at family level.', 'Related items can share clues and should not be treated as independent evidence.'],
      ['A dashboard shows gains, but item versions and cohort composition are missing.', 'Retain version and cohort context for every comparison.', 'A trend needs comparable content and populations to support interpretation.'],
    ]],
  },
};
