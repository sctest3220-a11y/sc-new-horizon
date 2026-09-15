export const strategy = {
  'D5-usecase-fit': {
    awareness: ['Which use-case requirement is missing from the proposal?', [
      ['The team names a popular AI tool but cannot describe the problem it should solve.', 'A defined user problem and desired outcome.', 'A tool choice does not establish a useful task.'],
      ['The problem is clear, but the records needed for the {{deliverable}} are unavailable.', 'Access to usable task evidence.', 'The proposed workflow cannot operate on evidence it cannot obtain.'],
      ['A draft can be generated, but nobody owns checking or using it.', 'A workflow owner and downstream use.', 'Generation alone does not ensure the output changes a real process.'],
      ['The team expects better results but has no current performance measurement.', 'A baseline for judging improvement.', 'Without a baseline, the claimed gain cannot be assessed consistently.'],
    ]],
    applied: ['Which next step best addresses the principal feasibility gap?', [
      ['Users spend time reformatting approved text, and reviewed examples are available.', 'Pilot the bounded drafting task with explicit quality checks.', 'The task and evidence are sufficiently defined for a controlled trial.'],
      ['The proposed decision depends on records whose use has not been authorized.', 'Resolve the data-access and use requirements before piloting.', 'Technical feasibility does not establish permission to use the inputs.'],
      ['The task is exact arithmetic under fixed rules, with no language ambiguity.', 'Compare a deterministic calculation against the proposed AI approach.', 'A simpler directly verifiable method may fit the problem better.'],
      ['The output is useful, but no one can explain how it enters the existing process.', 'Map the handoff and accountable user before building further.', 'A usable workflow needs a defined recipient and action.'],
    ]],
    proficient: ['Which conclusion is supported by this pilot evidence?', [
      ['Drafts are faster, but reviewers spend more time correcting them than the time saved.', 'The pilot has not shown a net workflow improvement.', 'Drafting speed omits the additional correction cost.'],
      ['The pilot succeeds on curated examples but fails on typical incomplete records.', 'Feasibility remains unproven for the real input distribution.', 'Curated success does not establish performance on ordinary operating data.'],
      ['Users prefer the output, but the downstream system rejects its structure.', 'The integration gap prevents end-to-end usefulness.', 'Preference does not compensate for an unusable system handoff.'],
      ['A simpler rule-based baseline meets the same quality target at lower total cost.', 'The simpler baseline is the better-supported choice for this task.', 'AI use is not itself the success criterion.'],
    ]],
    advanced: ['Which scale decision is best justified by the evidence?', [
      ['A bounded pilot meets quality, cost, and review targets; its operating conditions will remain the same.', 'Expand gradually with monitoring and explicit stop conditions.', 'The evidence supports a controlled extension within the tested boundary.'],
      ['The next deployment adds a new record type and a materially different user group.', 'Evaluate the new conditions before extending the pilot claim.', 'A changed task distribution can invalidate prior feasibility evidence.'],
      ['The technical component works, but the process bottleneck occurs after its output.', 'Redesign the bottleneck before increasing AI capacity.', 'More output will not resolve the limiting downstream process.'],
      ['The only projected value depends on removing a review control that the exercise requires.', 'Rework the use case within the required control boundary.', 'The proposal’s value depends on an unavailable operating assumption.'],
    ]],
  },
  'D5-roi-metrics': {
    awareness: ['Which statement correctly interprets the supplied measurement?', [
      ['A {{deliverable}} used to take 20 minutes; AI drafting takes 5 and review takes 10.', 'The measured saving is 5 minutes per completed item.', 'The comparison is 20 minus the combined 15 minutes of drafting and review.'],
      ['A team counts logins but does not measure completed tasks or quality.', 'The metric shows activity rather than demonstrated value.', 'Use of the tool alone does not establish an improved outcome.'],
      ['A proposal counts saved staff hours as cash savings without reducing costs or redeploying capacity.', 'The estimate is released capacity, not yet realized cash savings.', 'Time made available does not automatically become a financial saving.'],
      ['A pilot reports fewer errors but never records the number of completed cases.', 'The error-rate change cannot be established.', 'Counts require exposure denominators to support a rate comparison.'],
    ]],
    applied: ['Which calculation or measurement is appropriate?', [
      ['Monthly measured benefit is 120 units; total monthly operating cost is 80 units.', 'Report 40 units net benefit and 50% ROI on operating cost.', 'Net benefit is 120 minus 80; 40 divided by 80 is 50%.'],
      ['A team saves 10 hours on drafting but adds 7 review hours and 5 correction hours.', 'Report a net increase of 2 work hours.', 'The added 12 hours exceed the 10 hours saved.'],
      ['A vendor quote excludes training, integration, review, and support effort.', 'Include those costs in the total workflow comparison.', 'The omitted costs are part of delivering the proposed outcome.'],
      ['Completion time improves while material errors rise.', 'Report speed and error changes together before judging value.', 'A faster workflow can still create a worse total outcome.'],
    ]],
    proficient: ['Which adjustment is necessary before accepting the value claim?', [
      ['Revenue rises during the pilot, but pricing and staffing change at the same time.', 'Account for concurrent changes before attributing the gain to AI.', 'The design does not isolate the AI contribution.'],
      ['Savings are estimated from the fastest users and extrapolated to every employee.', 'Estimate value from a representative user and task mix.', 'A selected best-performing group is not a reliable population estimate.'],
      ['Benefits are recurring monthly, while the report subtracts only a one-time setup cost.', 'Compare benefits and all costs over a consistent time horizon.', 'The proposal mixes periods and omits recurring operating costs.'],
      ['The pilot meets mean time targets but expensive exception handling is excluded.', 'Include exception frequency and cost in the expected value.', 'Excluded exceptions can materially change the economic result.'],
    ]],
    advanced: ['Which decision rule best addresses the business-case uncertainty?', [
      ['The value estimate is positive only when adoption reaches an untested optimistic level.', 'Test adoption sensitivity and define a break-even adoption threshold.', 'The decision depends on a variable whose assumed value is not established.'],
      ['A proposal monetizes the same saved hours as both labor savings and extra output.', 'Remove double counting and specify how capacity becomes value.', 'The same released capacity cannot be fully claimed twice.'],
      ['Two projects have similar expected ROI but very different downside losses.', 'Compare risk-adjusted value and downside exposure alongside ROI.', 'Expected ratios alone do not describe the potential loss distribution.'],
      ['Funding continues after the original benefit measure becomes unavailable.', 'Reestablish attributable benefit evidence before the next funding gate.', 'Continued investment needs a measurable basis for the claimed value.'],
    ]],
  },
  'D5-portfolio-prioritization': {
    awareness: ['Which prioritization input is absent?', [
      ['Projects are ranked only by expected benefit, without implementation cost.', 'The resource cost of delivering the benefit.', 'Value must be assessed alongside the investment required.'],
      ['Projects are ranked by ease, without any user outcome or business benefit.', 'The value of the problem being solved.', 'Ease alone does not establish that a project is worth doing.'],
      ['Each project is feasible alone, but all need the same unavailable integration team.', 'Shared capacity and dependency constraints.', 'Portfolio feasibility differs from individual project feasibility.'],
      ['A high-impact proposal has no owner for its known failure modes.', 'Risk ownership and control readiness.', 'A portfolio decision needs accountable treatment of material risks.'],
    ]],
    applied: ['Which portfolio action follows from the stated constraint?', [
      ['Only one project can use the integration team this month; one is ready and one lacks required data.', 'Sequence the ready project while resolving the other’s data dependency.', 'The immediate bottleneck favors work that can use the scarce capacity.'],
      ['A low-cost pilot can resolve the largest uncertainty in a promising proposal.', 'Fund the bounded learning step with explicit success criteria.', 'A small experiment can improve a larger future investment decision.'],
      ['A project misses a predeclared critical quality gate despite meeting its speed target.', 'Hold expansion until the failed quality gate is resolved.', 'A critical gate cannot be replaced by success on another metric.'],
      ['Two proposals duplicate the same shared capability and target the same users.', 'Compare consolidation before funding both independently.', 'Duplicated investment may waste capacity and fragment the operating model.'],
    ]],
    proficient: ['Which interpretation best fits the portfolio evidence?', [
      ['Every project promises high ROI, but all count the same pool of saved staff time.', 'The combined benefits are overstated through overlap.', 'Portfolio totals must account for shared or competing benefits.'],
      ['A foundational project has modest direct value but enables several validated use cases.', 'Its enabling value should be included without double counting.', 'Dependencies can create value beyond the project’s immediate output.'],
      ['A sunk investment is used as the main reason to continue a failing pilot.', 'The next decision should depend on future value and cost.', 'Past spending does not establish that further spending is worthwhile.'],
      ['A scoring model favors easy projects and repeatedly excludes high-value uncertain proposals.', 'The portfolio may be underfunding bounded learning opportunities.', 'Uncertainty can justify targeted experiments rather than automatic exclusion.'],
    ]],
    advanced: ['Which allocation rule best addresses the stated portfolio tradeoff?', [
      ['Several projects share one vendor and would fail together during an outage.', 'Evaluate correlated exposure and fund justified resilience measures.', 'Independent project scores can miss shared failure dependence.'],
      ['The portfolio contains only quick wins and no tests of strategic uncertainties.', 'Reserve a bounded learning allocation with explicit option-value criteria.', 'A portfolio can balance near-term delivery and evidence for future choices.'],
      ['Projects continue automatically even when assumptions change after each stage.', 'Use staged funding tied to updated evidence and stop decisions.', 'A gate needs a real choice based on current evidence.'],
      ['Resource limits make the individually highest-ranked projects infeasible together.', 'Optimize a feasible combination using capacity and dependency constraints.', 'Selecting by isolated rank does not solve the constrained portfolio problem.'],
    ]],
  },
  'D5-transformation-strategy': {
    awareness: ['Which strategic gap is evident?', [
      ['The plan lists AI licenses but no changed service outcome.', 'A connection between technology and organizational outcomes.', 'Buying tools does not define the transformation’s purpose.'],
      ['The plan changes drafting but leaves all handoffs and decision rights undefined.', 'An operating model for the changed workflow.', 'The process around the tool determines how work is completed.'],
      ['The plan assumes a pilot can be copied everywhere without examining local differences.', 'Conditions under which the pilot evidence transfers.', 'Scaling requires checking whether the operating assumptions remain valid.'],
      ['The plan has a launch date but no owner for reviewing results afterward.', 'Ongoing accountability for value and adaptation.', 'Transformation continues beyond the initial release.'],
    ]],
    applied: ['Which next action makes the strategy more executable?', [
      ['The objective is “use more AI,” while users face a documented service delay.', 'Translate the delay into measurable workflow and quality outcomes.', 'An outcome-oriented objective provides a basis for evaluating the intervention.'],
      ['A new {{deliverable}} is produced faster, but the approval queue remains unchanged.', 'Redesign the approval handoff and decision ownership.', 'The unchanged bottleneck limits the effect of faster drafting.'],
      ['The pilot succeeds in one team, but the next team uses different records and controls.', 'Assess transfer conditions before planning that rollout.', 'A new environment may require different evidence and implementation.'],
      ['Training is scheduled, but managers have no role in changing daily work.', 'Define manager responsibilities for practice, support, and feedback.', 'Adoption needs reinforcement in the operating environment.'],
    ]],
    proficient: ['Which conclusion best reflects the transformation evidence?', [
      ['License adoption is high, but cycle time, quality, and user outcomes are unchanged.', 'The rollout has not yet demonstrated the intended transformation value.', 'Activity and access do not establish improved outcomes.'],
      ['One team gains speed by shifting verification work to another team.', 'The local gain may be an end-to-end cost transfer.', 'Whole-process evaluation is needed when work moves across boundaries.'],
      ['The workflow is effective only because one expert manually resolves every exception.', 'The pilot depends on an unscaled support capability.', 'The operating model must account for the expert bottleneck.'],
      ['The technology remains stable, but policy and user needs change materially.', 'The strategy needs reassessment against the new operating assumptions.', 'A working tool does not guarantee continued strategic fit.'],
    ]],
    advanced: ['Which strategic response best fits the observed constraint?', [
      ['Several successful pilots depend on incompatible data and approval arrangements.', 'Define shared principles while preserving justified local control differences.', 'Scaling requires coherence without assuming identical local requirements.'],
      ['The organization cannot explain how saved time changes staffing, service, or output.', 'Specify the operating changes that convert capacity into value.', 'Efficiency becomes strategic value only through a realizable use of capacity.'],
      ['A long-term plan depends on one untested assumption about model autonomy.', 'Use staged options and test that assumption before irreversible commitments.', 'Strategic uncertainty favors learning before locking in dependence.'],
      ['The transformation adds new responsibilities but leaves old accountability unchanged.', 'Redesign decision rights and ownership with the affected functions.', 'The operating model must match the work and risks that actually changed.'],
    ]],
  },
};
