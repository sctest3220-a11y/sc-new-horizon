export const application = {
  'D2-prompt-design': {
    awareness: ['Which missing prompt element is most directly causing this problem?', [
      ['The request says “help with this” and supplies {{source}}, but never names the expected output.', 'A specific task and deliverable.', 'The assistant has source material without a defined objective.'],
      ['The requested {{deliverable}} is clear, but a crucial eligibility rule is absent from the prompt.', 'The decision-relevant constraint.', 'The model was not given the rule needed to bound its answer.'],
      ['The prompt requests a fixed record format but never supplies field names or an example.', 'An explicit output structure.', 'The expected format needs to be stated or demonstrated.'],
      ['The prompt gives a task and format but no facts needed to complete the answer.', 'The necessary evidence and context.', 'Clear instructions cannot replace missing factual inputs.'],
    ]],
    applied: ['Which prompt repair most directly fixes the observed failure?', [
      ['The {{deliverable}} contains invented details where the supplied records have blank fields.', 'Require missing fields to be marked unknown and never inferred.', 'The repair addresses fabrication at the missing-data boundary.'],
      ['The content is accurate, but a downstream form rejects inconsistent field names.', 'Specify the exact schema and validate every required field.', 'A machine-consumed output needs a stable, checkable structure.'],
      ['The response summarizes the whole source although only differences between versions are needed.', 'Ask for a version comparison with unchanged content omitted.', 'The task needs a narrower operation rather than more source material.'],
      ['The text uses expert vocabulary for an audience new to the topic.', 'Define the audience and request explanations of unfamiliar terms.', 'The audience requirement changes how the same facts should be communicated.'],
    ]],
    proficient: ['Which prompt experiment best isolates the recurring defect?', [
      ['Two examples imply conflicting output formats; other instructions are consistent.', 'Test one consistent set of examples against the current prompt.', 'Conflicting demonstrations create an avoidable format ambiguity.'],
      ['A long prompt repeats a rule in three incompatible forms.', 'Replace the conflicting rules with one explicit precedence rule.', 'Length is not the central problem; instruction conflict is.'],
      ['The prompt performs well on ordinary records but guesses when required facts are absent.', 'Add missing-evidence cases to the evaluation and test abstention.', 'The weakness is conditional behavior under absent inputs.'],
      ['A rewrite changes task wording, examples, model, and output format together.', 'Hold the model and task fixed while testing one prompt change.', 'Several simultaneous changes prevent attribution of the result.'],
    ]],
    advanced: ['Which prompt-management decision best fits the evidence?', [
      ['Teams edit the production prompt directly; failures cannot be traced to a version.', 'Version prompts and link each release to evaluated examples.', 'Traceable releases make prompt effects auditable and reversible.'],
      ['A prompt passes frequent cases but mishandles a high-impact exception in {{source}}.', 'Make the exception a release-blocking regression case.', 'Average quality cannot compensate for a known critical failure.'],
      ['A prompt works on one model, but the replacement interprets its schema instructions differently.', 'Requalify the prompt-model pair before switching the model.', 'Prompt behavior is conditional on the model used to execute it.'],
      ['A growing prompt attempts to perform source retrieval, decisions, formatting, and approval in one step.', 'Separate evidence, drafting, validation, and approval stages.', 'Distinct stages make failures and controls independently testable.'],
    ]],
  },
  'D2-tool-selection': {
    awareness: ['Which tool property is most relevant to the stated requirement?', [
      ['Staff need to inspect {{source}} without exposing records outside the approved workspace.', 'Supported data access and workspace boundaries.', 'The task depends on permitted access to the required information.'],
      ['The {{deliverable}} must enter an existing system in a fixed machine-readable structure.', 'Validated structured output and integration support.', 'The output must be usable by the receiving system.'],
      ['The assistant must only read records, even if a user asks it to edit them.', 'Enforceable read-only permissions.', 'A promise in a prompt is weaker than an enforced capability boundary.'],
      ['The same workflow must be recoverable after a vendor outage.', 'Exportability and a tested fallback path.', 'Recovery depends on portable state and an executable alternative.'],
    ]],
    applied: ['Which candidate best fits the stated task?', [
      ['The task is to find and quote a current approved clause; no new wording is needed.', 'The approved search tool that returns source passages.', 'Direct retrieval meets the need without unnecessary generation.'],
      ['The task is to rewrite supplied non-sensitive notes into a reviewed {{deliverable}}.', 'The approved drafting tool with controlled input and review.', 'The main need is language transformation with human approval.'],
      ['The task is to reconcile exact totals from structured records using fixed rules.', 'The deterministic calculation tool with traceable formulas.', 'Exact arithmetic under explicit rules is directly checkable.'],
      ['The task combines record lookup, drafting, and a gated system action.', 'The workflow tool with scoped connectors and approval stages.', 'The complete task needs orchestrated capabilities and an action boundary.'],
    ]],
    proficient: ['Which selection evidence should determine the next step?', [
      ['The top benchmark tool cannot connect to the approved record system.', 'Verify integration feasibility before selecting the tool.', 'A general score does not remove a required access dependency.'],
      ['A tool meets quality targets but its export loses essential review history.', 'Test audit-history portability before committing to it.', 'The proposed tool fails a required continuity property.'],
      ['A tool has many connectors, but the required connector grants excessive write access.', 'Require a connector with enforceable narrower scopes.', 'Connector count does not establish permission suitability.'],
      ['A cheaper tool produces twice as much review work at the same output quality.', 'Compare total workflow cost, including review effort.', 'Subscription price alone omits a material operating cost.'],
    ]],
    advanced: ['Which procurement experiment best resolves the stated uncertainty?', [
      ['Vendor demonstrations use easy cases unlike the exception-heavy {{source}}.', 'Run a representative held-out workload with predeclared criteria.', 'Selection needs task-relevant evidence beyond a curated demonstration.'],
      ['The business case assumes uninterrupted vendor service and no migration cost.', 'Exercise outage recovery and export-import migration.', 'Operational dependence needs direct recovery and portability evidence.'],
      ['A shared tool will serve teams with conflicting access and retention requirements.', 'Evaluate tenant isolation and per-team policy enforcement.', 'Shared deployment must support different enforceable boundaries.'],
      ['Two tools have similar averages but different failures on critical records.', 'Compare failure severity and worst-slice performance.', 'Equivalent means can conceal materially different operational risk.'],
    ]],
  },
  'D2-agentic-workflows': {
    awareness: ['Which workflow element is missing?', [
      ['An assistant prepares a {{deliverable}} and executes its action without a person authorizing release.', 'An approval gate before the consequential action.', 'Drafting and authorization are distinct responsibilities.'],
      ['The assistant sends work to a second tool without a record identifier or expected result.', 'A defined handoff contract.', 'The receiving step needs identity, inputs, and a completion expectation.'],
      ['A failed step retries indefinitely without contacting an owner.', 'A bounded retry and escalation rule.', 'Repeated failure needs an explicit stop and human resolution path.'],
      ['A successful write cannot be associated with an input record or reviewer.', 'A traceable action record.', 'Accountable execution requires links between evidence, approval, and action.'],
    ]],
    applied: ['Which change addresses the failure without changing unrelated steps?', [
      ['A timeout causes the same approved action to run twice.', 'Use an idempotency key and reconcile the action result.', 'Retries must identify the same logical action to avoid duplication.'],
      ['A draft changes after approval, but the old approval still permits sending.', 'Bind approval to the exact version being executed.', 'Approval of one version should not authorize a changed payload.'],
      ['The receiving agent interprets an empty owner field as permission to proceed.', 'Reject incomplete handoffs and request a named owner.', 'Missing ownership must not become implicit authorization.'],
      ['A low-confidence result goes directly into an irreversible action.', 'Route the uncertain result to review before execution.', 'The action boundary must account for unresolved evidence.'],
    ]],
    proficient: ['Which diagnosis best fits the run history?', [
      ['The external write succeeds, the acknowledgment is lost, and a retry repeats the write.', 'The workflow confuses missing acknowledgment with failed execution.', 'An uncertain response requires reconciliation before another action.'],
      ['Each local agent stays within its retry limit, but agents reassign the task in a cycle.', 'The workflow lacks a shared cross-agent attempt budget.', 'Local limits do not bound repeated handoffs between agents.'],
      ['Approval identifies the draft, while execution reads a newly refreshed record.', 'The approved and executed states are not bound together.', 'A state change can invalidate the basis of the earlier approval.'],
      ['One failed branch is hidden while a parallel branch marks the entire task complete.', 'The completion rule ignores required branch outcomes.', 'Task success must incorporate every required dependency.'],
    ]],
    advanced: ['Which control design best addresses the documented risk?', [
      ['Consequential actions can partially succeed across two systems.', 'Model explicit partial states with reconciliation and compensating actions.', 'A distributed action needs recovery from intermediate outcomes.'],
      ['Untrusted record text can instruct the agent to call an unrelated tool.', 'Separate retrieved content from authority and enforce tool policies.', 'External content is evidence, not permission to expand the workflow.'],
      ['Approvers cannot see which source version and payload they are authorizing.', 'Present a versioned evidence-to-action diff at approval.', 'Meaningful approval requires a reviewable, exact proposed action.'],
      ['Run costs grow unpredictably through delegated retries and expanding subtasks.', 'Enforce a shared budget, bounded delegation, and terminal states.', 'A run-wide control must contain all participating agents.'],
    ]],
  },
  'D2-output-refinement': {
    awareness: ['Which quality dimension is directly failing?', [
      ['The {{deliverable}} contradicts an explicit fact in {{source}}.', 'Factual faithfulness.', 'The output changes a fact established by the supplied evidence.'],
      ['All stated facts are correct, but a required exception is omitted.', 'Completeness against the task requirements.', 'Accuracy of included statements does not guarantee required coverage.'],
      ['The content is correct and complete, but the required fields cannot be parsed.', 'Output format validity.', 'The receiving process cannot use the structure provided.'],
      ['The text meets the schema but is too technical for its intended readers.', 'Audience suitability.', 'Usability depends on the readers’ ability to understand the answer.'],
    ]],
    applied: ['Which revision request is most targeted?', [
      ['The source says approval is required; the draft says approval is optional.', 'Correct the approval claim and cite the supporting clause.', 'The revision must repair a specific contradiction.'],
      ['The required exception is absent from an otherwise accurate {{deliverable}}.', 'Add the exception and explain when it applies.', 'The defect is missing decision-relevant coverage.'],
      ['A required identifier is expressed as free text instead of the specified field.', 'Return the exact field schema and validate the identifier.', 'The repair addresses the output contract rather than rewriting all content.'],
      ['Readers misunderstand an unexplained technical term in an accurate explanation.', 'Explain that term using a concrete audience-relevant example.', 'Targeted explanation fixes comprehension without altering established facts.'],
    ]],
    proficient: ['Which review decision best fits these evaluation results?', [
      ['The revision improves readability but removes a material condition.', 'Reject the regression and restore the condition before release.', 'A readability gain does not offset losing a decision-critical boundary.'],
      ['The revision passes the schema but creates a new unsupported factual claim.', 'Require evidence for the new claim or remove it.', 'Format compliance does not establish factual support.'],
      ['Reviewers disagree because one scores style and another scores factual accuracy.', 'Use a shared rubric with separate quality dimensions.', 'A common rubric makes different concerns visible and comparable.'],
      ['The same repair fixes one case but breaks several previously passing examples.', 'Evaluate the revision against the full relevant regression set.', 'A local improvement must be tested for broader regressions.'],
    ]],
    advanced: ['Which quality process should be introduced first?', [
      ['Average ratings rise while critical factual defects continue to pass.', 'Define critical-defect release gates separate from average ratings.', 'Averages can conceal failures that should block release.'],
      ['Reviewers repeatedly rewrite outputs but never label recurring defect types.', 'Record defect categories and connect them to prompt or source fixes.', 'Structured feedback enables prevention rather than repeated manual repair.'],
      ['A new rubric changes the apparent trend, with no overlap evaluation.', 'Rescore a shared sample under both rubric versions.', 'A bridge sample separates measurement changes from performance changes.'],
      ['A refinement loop keeps rewriting after all requirements already pass.', 'Stop on explicit acceptance criteria with a bounded revision budget.', 'More iterations need not improve a result that already meets the contract.'],
    ]],
  },
};
