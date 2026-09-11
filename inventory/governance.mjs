export const governance = {
  'D4-data-privacy': {
    awareness: ['Which privacy issue is directly described?', [
      ['Only an aggregate is needed, but the prompt contains names and full individual records.', 'More personal data is supplied than the task needs.', 'The stated purpose can be met without the extra identifying details.'],
      ['A temporary copy of {{source}} remains accessible after its approved deletion date.', 'The retained copy exceeds its stated lifecycle.', 'The exercise specifies a deletion boundary that the copy has crossed.'],
      ['An assistant retrieves another team’s restricted records for the {{deliverable}}.', 'The retrieval crosses an access boundary.', 'Availability to the system does not imply permission for this user.'],
      ['Names are removed, but a rare job title and exact event date identify the person.', 'The remaining details can still enable re-identification.', 'Removing direct names does not necessarily remove identifying combinations.'],
    ]],
    applied: ['Which change best meets the task while addressing the stated privacy gap?', [
      ['The task needs monthly totals, but the proposed upload contains individual-level records.', 'Calculate or provide only the required aggregates.', 'The aggregate task does not require sharing each person’s record.'],
      ['The exercise policy permits use only in an approved workspace; the chosen tool is outside it.', 'Use the approved workspace or withhold the restricted input.', 'The supplied policy defines the permitted processing boundary.'],
      ['A saved draft contains identifiers no longer needed after the review is complete.', 'Apply the approved deletion rule to the draft and its retained copies.', 'The data lifecycle includes intermediate copies, not only the original.'],
      ['A supposedly anonymous example combines a unique role, date, and location.', 'Generalize or remove the identifying combination before sharing.', 'The combination, rather than the name alone, creates the identification risk.'],
    ]],
    proficient: ['Which assessment best reflects the supplied data flow?', [
      ['The prompt is minimized, but verbose logs retain the original full records.', 'The logging path defeats the input-minimization control.', 'Privacy review must cover retained operational data as well as prompts.'],
      ['The main database deletes a record, but the search index still returns it.', 'Deletion is incomplete across derived stores.', 'The accessible index is part of the same data lifecycle.'],
      ['Access is checked when indexing, but different users share unrestricted retrieval results.', 'Authorization must also be enforced for the requesting user.', 'A one-time ingestion check does not establish every later user’s access.'],
      ['The task has a legitimate purpose, but a secondary use is proposed without an approved basis.', 'The new purpose needs a separate use review.', 'Permission for one purpose does not automatically cover another.'],
    ]],
    advanced: ['Which system-level control addresses the observed lifecycle weakness?', [
      ['The same sensitive record spreads through prompts, logs, indexes, and cached outputs.', 'Map copies and enforce access, retention, and deletion across the flow.', 'A control on only one store cannot govern all retained copies.'],
      ['Teams cannot explain which personal fields materially improve the {{deliverable}}.', 'Evaluate utility with minimized fields before expanding collection.', 'Collection should be justified by task value rather than convenience.'],
      ['Cross-team retrieval leakage recurs after role changes.', 'Test authorization changes and invalidate stale cached access results.', 'Access updates must reach derived and cached retrieval paths.'],
      ['Privacy checks occur only at initial launch while data purposes keep changing.', 'Require change-triggered privacy review with an accountable owner.', 'A changing use can invalidate the assumptions of the original review.'],
    ]],
  },
  'D4-regulatory-policy': {
    awareness: ['Which statement follows from the exercise policy?', [
      ['Exercise rule: the assistant may draft, but {{owner}} must approve release.', 'Drafting permission does not include release permission.', 'The supplied rule separates assistance from authorization.'],
      ['Exercise rule: only policy version 4 is current; the answer cites version 2.', 'The cited version is not the governing exercise source.', 'The exercise explicitly identifies which version applies.'],
      ['Exercise rule: unresolved exceptions go to the policy owner; this case is unresolved.', 'The exception requires the specified escalation.', 'The rule defines an escalation route rather than an invented answer.'],
      ['Exercise rule: AI-assisted public text must carry a stated disclosure; this draft omits it.', 'The draft does not satisfy the exercise disclosure rule.', 'The answer follows the stated scenario rule, not an assumed universal law.'],
    ]],
    applied: ['What should the reviewer do under the supplied exercise rule?', [
      ['The rule permits internal drafts only; a team proposes publishing the {{deliverable}} externally.', 'Obtain the required external-use authorization before publication.', 'Permission for internal use does not cover the proposed external use.'],
      ['The rule requires an approval record, but the team has only an undocumented conversation.', 'Create the required recorded approval through the designated process.', 'The supplied control requires evidence of authorization.'],
      ['The rule explicitly excludes a class of records that the prompt now includes.', 'Remove the excluded records or seek an authorized exception.', 'The current input crosses the boundary stated in the exercise.'],
      ['Two supplied rules conflict, and neither defines precedence.', 'Document the conflict and ask the authorized policy owner to resolve it.', 'The reviewer cannot invent a precedence rule that was not supplied.'],
    ]],
    proficient: ['Which policy interpretation is justified by the evidence?', [
      ['A vendor assurance says a feature is supported; the internal rule still prohibits this use.', 'Vendor capability does not override the internal use restriction.', 'A technical claim is not authorization under the supplied policy.'],
      ['A policy authorizes one department’s pilot; another department assumes automatic coverage.', 'The second department’s scope must be checked separately.', 'The original authorization names a narrower operating scope.'],
      ['A summary omits an exception that remains present in the governing source.', 'The governing exception still applies.', 'A shortened explanation does not amend the source rule.'],
      ['An approved rule changes after a draft was reviewed but before it is released.', 'Recheck the draft against the rule effective at release.', 'The decision must reflect the applicable version at the relevant time.'],
    ]],
    advanced: ['Which governance change addresses the documented policy failure?', [
      ['Rules change, but affected prompts and review checklists are not identifiable.', 'Maintain links from policy versions to dependent controls and content.', 'Dependency records enable targeted updates when a rule changes.'],
      ['Teams interpret the same unresolved exception differently without recording decisions.', 'Create an owned exception process with recorded rationale and expiry.', 'Consistent, reviewable exceptions need explicit authority and lifecycle.'],
      ['A multinational workflow assumes one regional policy covers every deployment.', 'Review applicable requirements and authorized scope for each deployment.', 'The exercise does not establish one rule set as universally applicable.'],
      ['The organization has policy documents but no evidence that controls operate.', 'Test control execution and retain evidence tied to policy requirements.', 'Document existence does not demonstrate operational compliance.'],
    ]],
  },
  'D4-fairness-ethics': {
    awareness: ['Which concern is directly supported by the scenario?', [
      ['Two relevant user groups have similar needs, but the system fails much more often for one group.', 'Unequal performance may create unequal access or outcomes.', 'The measured performance gap warrants investigation of its impact.'],
      ['The {{deliverable}} uses an image with no documented permission for the proposed use.', 'Usage rights have not been established.', 'Finding or generating an asset does not by itself establish all needed permissions.'],
      ['A person affected by a recommendation has no way to question or correct it.', 'The decision process lacks a usable challenge route.', 'Affected people need a way to surface errors in the process.'],
      ['Staff are told the system is neutral because it uses numerical scores.', 'Numerical output does not establish fairness.', 'A number can still reflect biased data, design, or use.'],
    ]],
    applied: ['Which response addresses the specific human-impact concern?', [
      ['Error rates are higher for one language group in a service explanation.', 'Test that language slice and provide a reliable alternative path.', 'The response targets the observed access gap while improvement is evaluated.'],
      ['The license permits internal training, but the proposed asset use is external marketing.', 'Obtain suitable permission or replace the asset.', 'The documented permission does not cover the proposed use.'],
      ['Users cannot correct inaccurate inputs behind an AI recommendation.', 'Provide a correction and human-review route.', 'The process needs a way to contest the factual basis of its output.'],
      ['A proxy field closely tracks a sensitive characteristic but its task value is unproven.', 'Evaluate necessity and group impact before retaining the field.', 'Removing only explicit sensitive labels does not resolve proxy effects.'],
    ]],
    proficient: ['Which conclusion best fits the impact evidence?', [
      ['Average accuracy improves while a smaller user group’s false-denial rate rises.', 'The overall gain does not resolve the subgroup harm.', 'An aggregate improvement can coexist with a harmful distribution of errors.'],
      ['Removing one proxy field leaves the same gap through correlated remaining fields.', 'The mitigation needs evaluation beyond removal of that field.', 'Other inputs may reproduce the same unequal effect.'],
      ['An asset’s origin is verified, but permission for its intended use remains unknown.', 'Authenticity and usage permission remain separate questions.', 'Knowing the creator or origin does not establish the permitted use.'],
      ['An appeal route exists, but affected users cannot find or use it.', 'The process has formal review without effective access.', 'A nominal route does not provide meaningful recourse if it is unusable.'],
    ]],
    advanced: ['Which evaluation or control design best addresses the stated tradeoff?', [
      ['Two interventions reduce different error types for different affected groups.', 'Compare group-specific harms with stakeholders and document the tradeoff.', 'No aggregate score alone resolves competing distributions of harm.'],
      ['Training data lacks the people who will use the new service.', 'Evaluate representative cases and access alternatives before expansion.', 'Deployment needs evidence for users absent from the existing sample.'],
      ['A rights review happens at asset creation but assets are later reused in new contexts.', 'Attach permission scope and re-review triggers to asset reuse.', 'A changed use can exceed the permission checked at creation.'],
      ['A high-impact system cannot identify who owns appeals or remediation.', 'Assign accountable review and remedy responsibilities before release.', 'Human impact requires an operational path for correcting consequential errors.'],
    ]],
  },
  'D4-security-governance': {
    awareness: ['Which security boundary is directly at issue?', [
      ['An assistant that only needs to read {{source}} receives permission to delete records.', 'The granted privileges exceed the task.', 'The delete capability is unnecessary for the stated read-only need.'],
      ['Retrieved text tells the assistant to ignore its task and send records elsewhere.', 'External content is attempting to become an instruction.', 'Source text is untrusted task data, not authority to change the workflow.'],
      ['A consequential action has no record of who approved it.', 'The action lacks accountable audit evidence.', 'The system cannot trace authorization for the completed action.'],
      ['A shared credential is copied into a publicly visible {{deliverable}}.', 'A secret has crossed its permitted boundary.', 'The exposed credential should not be present in shared output.'],
    ]],
    applied: ['Which action addresses the immediate security issue?', [
      ['A connector has broad write scope although the task is only source review.', 'Reduce the connector to the required read scope.', 'Enforced permissions should match the smallest necessary capability.'],
      ['A retrieved record contains a request to export unrelated data.', 'Treat the request as untrusted content and enforce the approved task scope.', 'The external record cannot authorize a new data-transfer action.'],
      ['A credential appears in a circulated draft.', 'Revoke or rotate the exposed credential and investigate its use.', 'Removing the text alone does not invalidate a credential already exposed.'],
      ['A tool action’s outcome is uncertain after an interruption.', 'Reconcile the authoritative state before any retry.', 'An uncertain response does not establish that the action failed.'],
    ]],
    proficient: ['Which conclusion follows from the test results?', [
      ['The model refuses a prohibited action in normal tests, but the connector still permits it.', 'The boundary depends on model behavior instead of enforced permission.', 'Refusal in examples is not equivalent to removing the capability.'],
      ['Input filtering blocks one injection phrase, but a reworded instruction succeeds.', 'The filter does not establish a robust authority boundary.', 'An attacker can vary wording while preserving the attempt to redirect behavior.'],
      ['Logs exist, but they omit the action payload and approval version.', 'The logs are insufficient to reconstruct what was authorized.', 'An event timestamp alone does not establish the exact approved action.'],
      ['One team’s access is revoked, but its cached results remain readable.', 'The revocation has not reached every data-access path.', 'Cached and derived access must follow the updated authorization.'],
    ]],
    advanced: ['Which control architecture best addresses this systemic weakness?', [
      ['The model can grant itself broader tool scopes during a task.', 'Move permission decisions outside the model into an enforced policy layer.', 'The component requesting power should not independently authorize its expansion.'],
      ['Tool results mix task evidence with executable follow-up instructions.', 'Separate data from control and validate actions against trusted policy.', 'External evidence must not silently become execution authority.'],
      ['Several services share a powerful credential, preventing attribution and targeted containment.', 'Use scoped service identities and attributable action records.', 'Separate identities reduce shared privilege and improve incident containment.'],
      ['A failed control is fixed in one workflow, but the same component serves many others.', 'Trace the shared dependency and retest every affected workflow.', 'A reused component can spread the same failure beyond the reported case.'],
    ]],
  },
};
