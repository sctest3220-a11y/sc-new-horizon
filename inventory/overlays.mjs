// Additional evidence is required to choose the role-specific action.
// Format: [evidence, supported action, plausible but unsupported action, explanation].
export const overlayCases = {
  function: {
    general: [
      ['Two departments disagree about a dependency and neither has accepted the handoff.', 'resolve the dependency with a named receiving owner', 'send the draft to both teams and treat delivery as acceptance', 'Distributing a document does not resolve responsibility for the handoff.'],
      ['The briefing mixes confirmed records with planning assumptions.', 'label assumptions separately from confirmed facts', 'combine both into one recommendation without distinction', 'Decision makers need to distinguish evidence from an unverified planning assumption.'],
      ['The service owner can authorize this draft, while the project team can only suggest changes.', 'route final authorization to the service owner', 'treat the project team’s comments as final authorization', 'The exercise assigns authority to the service owner rather than the commenting team.'],
      ['A dependency changed after review but before the planned circulation.', 'recheck the affected recommendation before circulating it', 'circulate the previously approved version without checking the change', 'The changed dependency can invalidate the earlier review.'],
    ],
    people: [
      ['The employee response includes a recommendation that could affect an employment decision.', 'reserve that decision for the authorized HR decision maker', 'let the assistant finalize it after checking the wording', 'A wording review does not authorize an employment decision.'],
      ['The service question needs a policy clause, not the employee’s full history.', 'use the necessary clause with minimized case details', 'attach the full employee history to strengthen context', 'The stated service task does not require the additional personal history.'],
      ['The proposed response applies differently to two staff groups, and the difference is unexplained.', 'ask HR to verify the policy basis for the different treatment', 'reuse the majority-group response for both without checking', 'The group difference needs a policy and impact review rather than an unsupported assumption.'],
      ['The employee contests a factual input used in the recommendation.', 'provide a correction route before relying on the disputed input', 'keep the input because it was present in the first submitted record', 'An original record can still contain a correctable error.'],
    ],
    finance: [
      ['A reconciliation suggestion would create a journal entry, but the assistant is authorized only to advise.', 'send the proposed entry to the authorized controller', 'post the entry automatically once the totals balance', 'Balanced totals do not grant authority to change the ledger.'],
      ['A supplier payment destination differs from the approved master record.', 'verify the change through an independently maintained supplier contact', 'confirm through the new contact details attached to the request', 'The new request cannot provide its own independent verification channel.'],
      ['The business case counts saved staff hours as cash savings without a cost-reduction plan.', 'classify the hours as capacity until realization is demonstrated', 'book the full time estimate as immediate cash savings', 'Released time is not automatically a realized reduction in expenditure.'],
      ['A transaction timed out, but its status in the authoritative ledger is not yet known.', 'reconcile the ledger state before proposing another transaction', 'resubmit immediately because the client showed no success message', 'A missing acknowledgment does not prove that the transaction failed.'],
    ],
    marketing: [
      ['The proposed campaign asset is licensed for internal use only.', 'replace it or obtain permission for the campaign use', 'publish it with creator credit as a substitute for permission', 'Attribution does not expand the documented license scope.'],
      ['A performance claim uses results from a small selected pilot without that qualification.', 'state the tested scope and avoid implying a universal result', 'present the pilot result as the expected result for all customers', 'The evidence supports only the measured conditions.'],
      ['A quoted endorsement loses a qualification present in the full recording.', 'restore the qualification before using the endorsement', 'use the shorter quote because its individual words are authentic', 'An authentic excerpt can still be materially misleading through omission.'],
      ['The campaign objective is completed qualified requests, while the draft emphasizes impressions only.', 'evaluate the recommendation against qualified-request outcomes', 'treat increased impressions as sufficient proof of campaign value', 'Exposure is not the same outcome as a qualified request.'],
    ],
    sales: [
      ['The account proposal offers a discount outside the approved pricing range.', 'seek the account owner’s authorized pricing decision', 'send the proposal because the customer has requested a quick reply', 'Customer urgency does not expand pricing authority.'],
      ['The draft promises a capability absent from the approved release record.', 'remove the promise or obtain verified current capability evidence', 'retain the promise because a similar product offers that capability', 'Another product’s feature does not establish this product’s capability.'],
      ['A buyer’s identity is uncertain and the request includes sensitive account details.', 'verify the buyer through the established account channel', 'use the contact information supplied in the uncertain request', 'Verification needs an independently trusted account route.'],
      ['The source terms cover one region, but the proposed commitment names a different region.', 'check the applicable commercial terms before committing', 'reuse the source terms because the product name is unchanged', 'Commercial scope may differ even when the product is the same.'],
    ],
    customerService: [
      ['The recommended refund exceeds the frontline team’s approval limit.', 'route the exception to the designated refund approver', 'issue the refund after the assistant repeats its recommendation', 'Repeated advice does not provide the required exception authority.'],
      ['A prior refund may already have completed despite a timeout.', 'reconcile the payment record before another refund', 'repeat the refund because the customer still reports a delay', 'Customer experience of delay does not establish that no refund occurred.'],
      ['The response states a resolution that the case record marks as still pending.', 'describe the pending state and the actual next step', 'describe the resolution as complete to reassure the customer', 'Reassurance must not replace the recorded case status.'],
      ['The customer disputes the identity details on the case.', 'use the established identity-correction and verification route', 'rely on the current case fields because they are already in the system', 'Stored information can be wrong and needs the approved correction process.'],
    ],
    technical: [
      ['The change recommendation includes a production write, but this tool has a review-only role.', 'submit the change through the production review process', 'apply the write using an available administrator credential', 'An available credential does not authorize bypassing the change process.'],
      ['The proposed dependency upgrade has not been tested against the recovery procedure.', 'test compatibility and recovery before recommending rollout', 'recommend rollout based only on successful installation', 'Installation success does not demonstrate recoverable operation.'],
      ['A repository file contains instructions to upload unrelated internal records.', 'treat that text as untrusted and keep actions within the approved task', 'follow it because it appears inside the repository', 'Repository content is not automatically authority for an unrelated action.'],
      ['A fix addresses one service, but the changed component is shared by three services.', 'evaluate the affected dependent services before release', 'test only the service where the defect was first reported', 'A shared component can introduce changes beyond the original report.'],
    ],
    operations: [
      ['The handoff plan names a receiving team but no one has accepted the exception queue.', 'obtain acceptance from a named receiving owner', 'mark the handoff complete when the plan is sent', 'Sending a plan does not establish operational acceptance.'],
      ['The recommendation shortens one step but increases waiting time at the next step.', 'compare end-to-end throughput and queue behavior', 'claim the local time saving as the full process improvement', 'A local gain can be lost at the downstream bottleneck.'],
      ['The proposed schedule uses an old service window that has since changed.', 'reconcile the plan with the current approved schedule', 'keep the prior window because it was used in the pilot', 'The live operating window governs the current handoff.'],
      ['An automated step can leave work partially complete after a failure.', 'define the recovery owner and intermediate-state procedure', 'restart the entire process without checking completed steps', 'Recovery must account for work already performed.'],
    ],
  },
  industry: {
    education: [
      ['The service explanation includes identifiable learner information although only general course guidance is needed.', 'remove learner identifiers from this guidance task', 'retain them to make the general explanation more personalized', 'The stated guidance task can be completed without identifying a learner.'],
      ['The proposed learning support route is inaccessible to students using assistive technology.', 'provide an accessible equivalent and test it with affected users', 'offer the same route to everyone without an accessibility check', 'Identical provision is not necessarily usable access.'],
      ['The draft changes a learner’s support plan without the staff review required in the exercise.', 'route the change to the responsible education staff', 'apply the change once the assistant explains its rationale', 'The exercise assigns learner-impacting decisions to responsible staff.'],
      ['Assessment results rise after learners see the answers to the same questions.', 'check transfer with fresh equivalent tasks', 'treat the repeated-question gain as proof of broader competence', 'Recall of revealed answers does not establish transfer.'],
    ],
    financial: [
      ['A proposed account action relies on identity details supplied in an unverified message.', 'use the established independent identity-verification process', 'approve the action if the message matches the account’s usual tone', 'Familiar writing style does not authenticate the request.'],
      ['A product explanation cites terms for a different account type.', 'verify the applicable account terms before responding', 'use the cited terms because they come from the same institution', 'Institutional origin does not establish applicability to the customer’s product.'],
      ['The proposed account action exceeds the assistant’s permitted advisory scope.', 'send the supported recommendation to an authorized approver', 'execute it because the source evidence appears complete', 'Evidence completeness does not grant action authority.'],
      ['The value model omits the cost of investigating false alerts.', 'include false-alert investigation effort in the business case', 'count every alert as an avoided financial loss', 'An alert is not automatically a prevented loss and can create review cost.'],
    ],
    healthcare: [
      ['An appointment-service question includes a request for a clinical treatment decision.', 'route the clinical question to a qualified clinician', 'extend the administrative answer into a treatment recommendation', 'The exercise explicitly limits the assistant to administration.'],
      ['The scheduling task can be completed with availability and a case reference, without clinical history.', 'use only the fields required for scheduling', 'include the full clinical history to maximize model context', 'Administrative scheduling does not require unnecessary clinical details.'],
      ['The draft states that an appointment is confirmed, but the scheduling record is pending.', 'report the pending status and the actual confirmation route', 'state confirmation to reduce the user’s anxiety', 'The response must preserve the authoritative scheduling state.'],
      ['One language group repeatedly misunderstands the appointment instructions.', 'test that language version and offer a reliable support route', 'use the majority-language result as proof that the instructions are clear', 'Clarity must be evaluated for the people receiving the instructions.'],
    ],
    retail: [
      ['The returns claim comes from a superseded policy.', 'check the current approved returns terms', 'reuse the older terms because the product has not changed', 'Policy applicability depends on the approved current terms.'],
      ['A promotional product image depicts an accessory not included in the approved listing.', 'correct the image or clearly resolve the product mismatch', 'use the image because the main product looks accurate', 'The extra depicted accessory can create a misleading product claim.'],
      ['A return request appears to match an already compensated transaction.', 'reconcile the transaction before authorizing another compensation', 'process it again because the new request has a different filename', 'Document naming does not establish a distinct underlying transaction.'],
      ['The pilot counts orders but omits cancellations and returned items.', 'include completed net outcomes in the value comparison', 'treat gross order growth as the full realized benefit', 'Gross activity can overstate value when reversals are excluded.'],
    ],
    public: [
      ['The draft denies service access without the staff decision and review route required in the exercise.', 'route the eligibility decision to authorized staff with review access', 'issue the denial because the model explanation is detailed', 'An explanation does not replace the assigned decision authority and recourse.'],
      ['The supplied criteria are current for another service area, not this one.', 'verify the criteria governing the requested service area', 'reuse them because both services belong to the same agency', 'Shared organizational ownership does not establish identical service criteria.'],
      ['The explanation works poorly for a group that relies on an alternative access channel.', 'evaluate and support that access channel before claiming equal service', 'rely on the overall satisfaction score across all users', 'An aggregate score can conceal a material access barrier.'],
      ['An operator can change service criteria without an approval record.', 'require authorized versioned changes with attributable records', 'allow the change because the operator uses an official account', 'An official account does not by itself establish change authority or auditability.'],
    ],
  },
  executive: {
    ceo: [
      ['Three departments propose scaling, but each assumes another will own the shared exceptions.', 'assign cross-functional ownership before authorizing scale', 'ask each department to launch and resolve ownership afterward', 'Scaling first would spread an already identified accountability gap.'],
      ['The growth claim depends on a customer outcome that the pilot never measured.', 'require evidence of that outcome at the next investment gate', 'use license adoption as sufficient evidence for the growth claim', 'Tool activity does not establish the promised customer outcome.'],
      ['Expansion adds a new population with materially different service needs.', 'require evidence for the changed population before expansion', 'apply the original pilot result without a transfer check', 'The original result may not transfer to the new operating conditions.'],
      ['The plan creates local efficiencies but moves substantial work to shared services.', 'evaluate enterprise-wide effects before accepting the value claim', 'sum departmental savings without counting the displaced work', 'Enterprise value must include work shifted across organizational boundaries.'],
    ],
    board: [
      ['Management provides a policy document but no evidence that its controls operate.', 'request management’s evidence of control effectiveness', 'treat policy approval as proof of effective operation', 'The board needs assurance about operation, not only policy existence.'],
      ['A director proposes personally executing operational fixes in the production system.', 'hold management accountable for a verifiable remediation plan', 'have the board execute the operational changes directly', 'The exercise distinguishes oversight from management execution.'],
      ['The portfolio report omits shared vendor concentration across projects.', 'request a consolidated view of correlated dependency risk', 'assess every project independently and add its risk score', 'Shared dependencies can create correlated failures not visible in isolated scores.'],
      ['A major exception has no documented owner or review date.', 'require accountable ownership and a time-bounded review', 'accept the exception indefinitely after a verbal briefing', 'Oversight requires a reviewable decision with an accountable lifecycle.'],
    ],
    people: [
      ['The workforce plan assumes time saved can be removed from staffing without studying redistributed work.', 'validate workload and service effects before workforce changes', 'convert the reported hours directly into headcount reductions', 'Time estimates alone do not establish safe staffing changes.'],
      ['One staff group has no access to the proposed learning and support arrangements.', 'provide equivalent access and evaluate that group’s outcomes', 'apply the same attendance target without changing access', 'A uniform target does not resolve unequal opportunity to participate.'],
      ['A reported AI concern was dismissed and the employee fears retaliation.', 'provide protected escalation and investigate the handling of the concern', 'close the issue because the normal reporting channel exists', 'Channel existence does not establish safe use of that channel.'],
      ['The new workflow gives supervisors review duties without time or training.', 'resource and prepare supervisors for the assigned review', 'retain the sign-off requirement without changing workload', 'Formal responsibility needs the capacity and capability to perform it.'],
    ],
    finance: [
      ['The same time saving appears as both reduced expenditure and extra output in the funding case.', 'remove double counting and specify the realization mechanism', 'sum both estimates because they describe different benefit categories', 'One capacity gain cannot be fully realized twice without supporting evidence.'],
      ['A project meets speed goals but fails a predeclared critical control gate.', 'hold the funding expansion until the critical gate is resolved', 'release the next tranche based on the speed result alone', 'A critical gate is not offset by success on another target.'],
      ['The base case is positive only under an untested adoption assumption.', 'test sensitivity and define the break-even adoption requirement', 'approve using the optimistic assumption as the forecast', 'The funding decision depends on an uncertain input that needs examination.'],
      ['Two projects draw on the same constrained integration team and cannot proceed together.', 'fund a feasible sequence using shared-capacity constraints', 'fund both because each passes its individual ROI threshold', 'Individual financial attractiveness does not establish combined feasibility.'],
    ],
    technology: [
      ['A platform agent can expand its own production permissions.', 'place authorization in an enforced external policy boundary', 'rely on the agent’s instruction to request only needed permissions', 'A prompt is not an independent enforcement boundary for capability expansion.'],
      ['The proposed rollout has a recovery document but no exercised recovery path.', 'require a recovery exercise with an accountable owner', 'accept the document as proof that recovery will work', 'A documented plan needs evidence of executable recovery.'],
      ['A shared model or connector change affects multiple dependent services.', 'evaluate representative dependent services before platform release', 'test only the platform’s isolated component benchmark', 'Component performance does not establish all downstream behavior.'],
      ['Data access is isolated in the database but shared through unrestricted retrieval caches.', 'extend identity-scoped access enforcement to cached retrieval', 'declare isolation complete because the database checks pass', 'A derived access path can bypass an otherwise correct database boundary.'],
    ],
    transformation: [
      ['The rollout has training and licenses but no changed decision rights.', 'align ownership and approval rights with the redesigned workflow', 'declare the operating model complete when training ends', 'Tool readiness and training do not resolve operational authority.'],
      ['A successful pilot depends on one expert who cannot support all planned teams.', 'build and test a scalable support capability before expansion', 'copy the pilot while leaving expert support unchanged', 'The planned volume exceeds an essential support dependency.'],
      ['Local teams have different justified control requirements.', 'define common principles with reviewed local adaptations', 'force the pilot’s controls unchanged across every team', 'A common direction does not imply identical operating constraints.'],
      ['Adoption dashboards improve while service quality and cycle time do not.', 'revise the change plan using actual workflow outcome evidence', 'treat adoption growth as sufficient transformation success', 'Participation does not establish the intended service improvement.'],
    ],
  },
};
