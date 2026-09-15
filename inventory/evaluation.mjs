export const evaluation = {
  'D3-source-verification': {
    awareness: ['Which evidence issue is visible in the {{deliverable}}?', [
      ['A citation opens successfully, but its passage discusses a different claim.', 'The citation does not support the claim.', 'A working link is not evidence that the cited text entails the statement.'],
      ['Three articles repeat one original press release as their only evidence.', 'The sources are not independent confirmations.', 'Several repetitions of one origin do not create independent evidence.'],
      ['The cited clause is correct for a retired version of {{source}}.', 'The source is not current for this decision.', 'The relevant version must match the decision being made.'],
      ['A material statement has no source, and its author is not identified.', 'The claim has no traceable supporting evidence.', 'Neither source provenance nor factual support is supplied.'],
    ]],
    applied: ['Which check should resolve the specific evidence gap first?', [
      ['A quote removes an exception immediately after the cited sentence.', 'Read the surrounding passage and restore the exception.', 'The omitted context changes the meaning of the quoted rule.'],
      ['Two summaries disagree; both point to the same original record.', 'Inspect the original record against both interpretations.', 'The shared primary evidence can resolve the summary-level disagreement.'],
      ['A screenshot names a policy but omits its date and version.', 'Locate the approved policy and verify its effective version.', 'The screenshot alone cannot establish current applicability.'],
      ['A claim depends on a dataset unavailable to the reviewer.', 'Request accessible supporting evidence or mark the claim unverified.', 'Verification cannot be completed from an inaccessible source.'],
    ]],
    proficient: ['Which conclusion is strongest given this source comparison?', [
      ['One current primary record supports a narrow claim; five summaries assert a broader claim without more evidence.', 'Retain only the narrower claim supported by the primary record.', 'The additional summaries do not justify expanding the claim.'],
      ['Two current primary records conflict and their issuing owners have not resolved the difference.', 'Report the conflict and seek an authoritative resolution.', 'The evidence does not establish which record governs.'],
      ['An independent second record confirms the same value for the same period and population.', 'Treat the matching record as corroboration within that scope.', 'Agreement is useful when scope and independence are checked.'],
      ['The source supports an association, while the {{deliverable}} asserts causation.', 'Revise the causal claim to match the supported association.', 'The source does not establish the stronger causal interpretation.'],
    ]],
    advanced: ['Which evidence control would best prevent the observed recurring failure?', [
      ['Reviewers accept citations after checking that links open, without reading support.', 'Require a claim-to-passage support judgment for material statements.', 'Link validity and factual support are different checks.'],
      ['A synthesis combines different effective dates without recording them.', 'Record source versions and resolve time conflicts before synthesis.', 'Version-aware evidence is necessary for a coherent current answer.'],
      ['One press release spreads through many sources and is counted repeatedly.', 'Track source lineage and count independent evidence origins.', 'Provenance prevents duplicate reporting from inflating confidence.'],
      ['Approved claims become stale when upstream records are replaced.', 'Trigger re-review from source changes using claim-source links.', 'A linked dependency enables targeted freshness checks after updates.'],
    ]],
  },
  'D3-data-chart-judgment': {
    awareness: ['Which interpretation is numerically or logically supported?', [
      ['The success rate rises from 40% to 50% on comparable samples.', 'The increase is 10 percentage points.', 'Subtracting the rates gives 10 points; the relative increase is 25%.'],
      ['A report shows 12 errors but omits the number of records reviewed.', 'The error rate cannot be calculated from this information.', 'A rate requires both the error count and the total exposure.'],
      ['A dashboard compares this month’s completed cases with last month’s submitted cases.', 'The two bars use different definitions.', 'A comparison requires consistent quantities and denominators.'],
      ['A chart starts its vertical axis at 98 and shows values of 99 and 100.', 'The visual gap exaggerates a one-unit difference.', 'The displayed scale magnifies the apparent difference.'],
    ]],
    applied: ['Which calculation or comparison should be used?', [
      ['Processing time falls from 20 to 15 minutes for the same task.', 'Report a 25% reduction from the original time.', 'The reduction is 5 divided by the 20-minute baseline.'],
      ['Team A has 8 errors in 200 cases; Team B has 12 in 600 cases.', 'Compare 4% for A with 2% for B.', 'Comparable error rates account for different case volumes.'],
      ['A pilot handles only simple cases; the baseline contains simple and complex cases.', 'Compare matched complexity groups before claiming improvement.', 'A changed case mix can create an apparent performance gain.'],
      ['AI users improve, but everyone also receives a new process and training.', 'Separate the AI effect from the concurrent process changes.', 'The observed gain cannot be attributed to AI alone from this comparison.'],
    ]],
    proficient: ['Which interpretation best reflects this evaluation design?', [
      ['Overall accuracy is 95%, but a critical minority case type is correct only 55% of the time.', 'The aggregate hides a materially weak performance slice.', 'The mean does not describe performance on the critical case type.'],
      ['The test set includes examples used to tune the system.', 'The reported result is vulnerable to evaluation leakage.', 'Reusing development examples weakens evidence of generalization.'],
      ['A dashboard excludes abandoned attempts from both the numerator and denominator.', 'The displayed result applies only to completed attempts.', 'Excluded failures limit how broadly the metric can be interpreted.'],
      ['A sample of five cases beats the baseline by one case, with no uncertainty estimate.', 'The evidence is too limited to establish a stable improvement.', 'A small observed difference in a tiny sample is fragile.'],
    ]],
    advanced: ['Which evaluation redesign addresses the principal validity problem?', [
      ['Teams choose whether to use AI, and more experienced staff adopt it first.', 'Use random assignment where feasible or a justified matched comparison.', 'Selection differences can confound the observed performance effect.'],
      ['The benchmark population excludes the users who will receive the {{deliverable}}.', 'Construct a representative evaluation with relevant user slices.', 'Deployment claims need evidence for the actual target population.'],
      ['The team repeatedly checks results and stops the experiment as soon as a favorable number appears.', 'Predefine the stopping and analysis rules before the next run.', 'Outcome-dependent stopping can distort the apparent evidence.'],
      ['Success improves while costly near misses and review effort are unmeasured.', 'Add failure-severity and total-workflow measures to the evaluation.', 'A narrow success metric can hide important adverse outcomes.'],
    ]],
  },
  'D3-media-provenance': {
    awareness: ['What does the supplied media evidence actually establish?', [
      ['The same image appears in an archived post from two years before the claimed event.', 'The image does not establish that the claimed new event occurred.', 'An earlier appearance contradicts its use as proof of a new capture.'],
      ['A detector labels a clip “likely synthetic” but no provenance is available.', 'The detector result is a signal rather than a definitive verdict.', 'A probabilistic classification does not establish the full origin of the clip.'],
      ['The image has no visible manipulation, but its location is not verified.', 'Visual plausibility does not establish the claimed location.', 'A realistic image can still be paired with a false caption.'],
      ['An original file records an edit history, but the event in its caption remains unverified.', 'The history supports provenance, not every claim about the scene.', 'Origin and editing information do not prove the caption is true.'],
    ]],
    applied: ['Which verification step addresses the specific uncertainty?', [
      ['A photo is presented as today’s event; the capture date is unknown.', 'Search for earlier appearances and verify the event timeline.', 'The immediate question is whether the image predates the claim.'],
      ['A short clip omits the speech before and after an apparent endorsement.', 'Obtain the full recording and inspect the surrounding context.', 'The omitted context may change the meaning of the excerpt.'],
      ['A scene is attributed to a named location but has no source link.', 'Compare verifiable landmarks and contact a reliable local source.', 'Location verification needs evidence independent of the caption.'],
      ['A polished campaign image has no license or creator record.', 'Verify origin and usage permission before publication.', 'Visual quality does not establish the right to use the asset.'],
    ]],
    proficient: ['Which review decision is best supported?', [
      ['Reverse search finds an earlier original with a different caption; no editing is detected.', 'Classify the issue as misleading context rather than proven synthesis.', 'The verified problem is the changed claim attached to the image.'],
      ['Two detectors disagree and the original file is unavailable.', 'Keep the origin unresolved and seek additional evidence.', 'Conflicting detector outputs do not justify a definitive classification.'],
      ['The original clip is authentic but the circulated version removes a negation.', 'Treat the excerpt as a materially misleading edit.', 'Authentic source material can be edited to reverse its meaning.'],
      ['The origin is verified, but the proposed campaign use falls outside the documented license.', 'Resolve the usage-rights gap before using the asset.', 'Authenticity and permission are separate requirements.'],
    ]],
    advanced: ['Which media-review process best addresses the repeated failure?', [
      ['Teams approve assets on appearance while false dates and locations recur.', 'Require separate origin, date, location, and claim checks.', 'The repeated failures concern context that appearance cannot validate.'],
      ['Reviewers treat a detector score as a final fraud decision.', 'Use detector results within a documented multi-evidence review.', 'A single probabilistic signal needs corroboration and a review path.'],
      ['Approved assets lose source and license records during handoff.', 'Preserve source, edit, rights, and approval metadata with each asset.', 'A linked record keeps evidence available through publication.'],
      ['A viral false clip is removed, but copies and prior recipients remain unaddressed.', 'Track affected copies and publish a traceable correction plan.', 'Containment must account for downstream distribution and correction.'],
    ]],
  },
  'D3-fraud-detection': {
    awareness: ['Which observation most directly warrants independent verification?', [
      ['A familiar supplier requests a changed payment destination through a new email address.', 'The destination change from an unverified channel.', 'A familiar name does not authenticate a new financial instruction.'],
      ['A message uses a known logo but links to a differently spelled domain.', 'The mismatch between the claimed sender and link destination.', 'Branding can be copied while the destination belongs elsewhere.'],
      ['A voice message claims to be the owner and demands bypassing the usual review.', 'The request to bypass an established verification step.', 'A convincing voice does not justify removing independent checks.'],
      ['Two invoices use different filenames but the same invoice number and amount.', 'The possibility of a duplicate request.', 'File names do not establish that the underlying transactions differ.'],
    ]],
    applied: ['What is the appropriate next verification action?', [
      ['A payment destination changed in an email with an urgent deadline.', 'Contact the known supplier through an independently stored channel.', 'Verification must not rely on contact details supplied in the suspicious request.'],
      ['A login message points to an unfamiliar domain.', 'Open the known official service independently to inspect the request.', 'An independent route avoids trusting the supplied link.'],
      ['A caller claiming to be {{owner}} requests a sensitive exception.', 'Use the established identity and exception-approval process.', 'Identity and authority must be checked through the normal control.'],
      ['A new request appears to match a previously completed transaction.', 'Reconcile the request against the authoritative transaction record.', 'The record can establish whether the action already occurred.'],
    ]],
    proficient: ['Which conclusion best fits the combined evidence?', [
      ['The sender address is genuine, but the known contact denies making the request.', 'Treat possible account compromise as unresolved and stop the action.', 'A genuine address does not exclude unauthorized use of the account.'],
      ['The voice sounds familiar, but no independent identity check has succeeded.', 'The voice alone does not establish authorization.', 'Perceptual similarity is insufficient evidence for a sensitive action.'],
      ['The invoice is genuine, but its payment destination differs from the approved master record.', 'Resolve the destination mismatch before payment approval.', 'Document authenticity does not establish the correctness of every field.'],
      ['The transaction record confirms completion despite a client timeout message.', 'Do not repeat the action; reconcile the missing acknowledgment.', 'The action succeeded even though the response was lost.'],
    ]],
    advanced: ['Which control change addresses the demonstrated failure mode?', [
      ['An attacker changes supplier details and approves the first resulting payment using one account.', 'Separate master-data changes from transaction approval.', 'Independent duties reduce the power of one compromised identity.'],
      ['Staff verify suspicious requests using phone numbers included in those requests.', 'Use independently maintained contact records for verification.', 'An attacker-supplied channel cannot independently authenticate the attacker.'],
      ['Duplicate actions recur after uncertain tool responses.', 'Use idempotent action identifiers and authoritative reconciliation.', 'Execution uncertainty must not create a second logical transaction.'],
      ['A compromised account remains active after several suspicious requests are reported.', 'Contain the account and investigate affected actions through incident response.', 'The failure concerns ongoing access and potentially completed actions.'],
    ]],
  },
};
