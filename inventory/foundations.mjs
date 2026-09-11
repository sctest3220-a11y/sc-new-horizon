// Each family contains four evidence-dependent decisions. Case order is not display order.
// All evidence describes synthetic exercises, with provisional difficulty labels.
export const foundations = {
  'D1-core-concepts': {
    awareness: ['Which description best matches the system used for this {{deliverable}}?', [
      ['The system creates new sentences from learned patterns; it has no connection to {{source}}.', 'A generative model producing a draft.', 'Creating plausible text does not establish access to current records.'],
      ['The system returns unchanged passages with record identifiers from {{source}}.', 'A search system retrieving existing text.', 'The observed operation retrieves records without composing new content.'],
      ['The system follows an explicit if-then rule and copies an approved sentence.', 'A rules-based automation selecting text.', 'The output is chosen by a defined rule rather than learned generation.'],
      ['A workspace combines a model, a search index, permissions, and a review screen.', 'An application coordinating several components.', 'The workspace includes the model and surrounding operational components.'],
    ]],
    applied: ['Which implementation fits the stated requirement for the {{deliverable}}?', [
      ['Every output must reproduce the same approved sentence when the same category is selected.', 'Use a lookup table with explicit category rules.', 'A deterministic requirement is met directly by controlled rules.'],
      ['Staff need varied wording from non-sensitive notes, and will approve every final draft.', 'Use a generative drafting assistant with review.', 'Language variation is useful here and a reviewer owns the final text.'],
      ['Staff need the exact current clause and its record identifier, without paraphrasing.', 'Use search that returns the original source passage.', 'Verbatim current evidence is a retrieval task.'],
      ['The system must inspect a record, draft a response, and request approval before a write.', 'Use an application with retrieval and gated tool steps.', 'The task combines evidence, generation, and controlled actions.'],
    ]],
    proficient: ['Which conclusion is justified by this comparison?', [
      ['Two apps use the same model. Only one can access the current {{source}} and only that app answers the version question correctly.', 'The retrieval configuration explains a relevant difference.', 'A shared model does not imply shared source access.'],
      ['The same app and source passages are held fixed. Model B misses a required distinction that Model A makes on repeated tests.', 'The model choice warrants a controlled capability comparison.', 'The observed difference remains after the source and application are held fixed.'],
      ['A correct draft is visible, but the send action fails with a permission denial.', 'Investigate the action permission boundary.', 'The failure occurs during execution rather than text generation.'],
      ['A template rule selects the wrong category before any model is called.', 'Correct the deterministic routing rule.', 'The wrong input path precedes the generative component.'],
    ]],
    advanced: ['Which experiment would best isolate the disputed source of performance?', [
      ['A sponsor attributes improvement to a new model, but the team also changed the retrieval index.', 'Compare models with identical retrieved passages and tasks.', 'Holding retrieval fixed separates the model effect from source changes.'],
      ['A sponsor credits a new index, but the model and review checklist also changed.', 'Compare indexes while fixing model and review criteria.', 'The experiment must isolate the index rather than several changes together.'],
      ['Draft quality is stable, but completed actions vary across staff roles.', 'Test role permissions with identical approved actions.', 'Role-dependent execution suggests the authorization layer needs isolation.'],
      ['All component tests pass, but records are lost between drafting and approval.', 'Trace one record through every application handoff.', 'Component success does not verify the end-to-end transfer of state.'],
    ]],
  },
  'D1-genai-mechanics': {
    awareness: ['Which mechanism explains the observation?', [
      ['A document is broken into short encoded units before the model processes it.', 'Tokenization of the input.', 'Tokens are processing units and need not correspond to whole words.'],
      ['Texts about similar ideas are placed near one another in a numerical representation.', 'An embedding used for similarity.', 'The representation supports semantic comparison rather than a truth guarantee.'],
      ['The assistant searches {{source}} and places matching passages beside the user request.', 'Retrieval used to ground generation.', 'External passages are supplied at answer time.'],
      ['Training updates change model parameters using a curated set of task examples.', 'Fine-tuning on additional examples.', 'The described update changes parameters rather than only the current prompt.'],
    ]],
    applied: ['Which mechanism best addresses the stated need?', [
      ['The {{deliverable}} must cite a procedure that changes each week.', 'Retrieve the current procedure when answering.', 'Frequently changing facts should be supplied from an updated source.'],
      ['Search must find related cases even when users choose different words.', 'Use semantic retrieval with tested embeddings.', 'Semantic similarity helps match differently worded requests.'],
      ['A stable output style fails despite tested prompts; many reviewed examples are available.', 'Evaluate fine-tuning against the prompt baseline.', 'Stable behavior and reviewed examples make a controlled fine-tuning trial reasonable.'],
      ['A long request fails before generation because it exceeds the input allowance.', 'Measure tokens and reduce or split the input.', 'The immediate issue is the processing limit, not missing training.'],
    ]],
    proficient: ['Which diagnosis is most consistent with the evidence?', [
      ['Search returns the correct current passage, but the answer contradicts its explicit exception.', 'The answer failed to use available grounding evidence.', 'Retrieval succeeded; faithful synthesis still needs evaluation.'],
      ['The answer accurately summarizes a retrieved passage whose version was retired last month.', 'The retrieval corpus has a freshness failure.', 'Faithful use of an obsolete source still produces a stale answer.'],
      ['Semantically related cases appear, but exact account-code matches disappear.', 'Semantic retrieval needs an exact-match path.', 'Similarity alone is insufficient for identifiers that must match exactly.'],
      ['A tuned model improves style but continues to invent this week’s policy changes.', 'Behavior tuning did not supply current factual evidence.', 'Style adaptation does not create reliable access to changing facts.'],
    ]],
    advanced: ['Which next evaluation best addresses the identified uncertainty?', [
      ['Grounded answer accuracy is low; the team does not know whether search or synthesis fails.', 'Measure passage recall and answer faithfulness separately.', 'Separating stages identifies which mechanism needs intervention.'],
      ['An embedding upgrade improves global recall but reduces exact-code retrieval.', 'Evaluate hybrid retrieval on identifier and semantic slices.', 'The deployment decision must preserve both retrieval needs.'],
      ['Fine-tuning improves training examples but no unseen cases have been evaluated.', 'Use held-out tasks and compare with the untuned baseline.', 'Generalization requires evidence beyond examples used for training.'],
      ['Long inputs cost more, but aggressive summarization removes important exceptions.', 'Compare compression strategies on exception retention and cost.', 'Cost reduction must be evaluated against lost decision-critical evidence.'],
    ]],
  },
  'D1-capability-limits': {
    awareness: ['What limitation is demonstrated by this {{deliverable}}?', [
      ['A confident answer names a record that cannot be found in {{source}}.', 'A plausible statement may be fabricated.', 'Fluent confidence does not prove the record exists.'],
      ['The answer quotes a procedure accurately, but that version has been replaced.', 'The information may be out of date.', 'Accuracy about an old version is not current accuracy.'],
      ['The assistant describes a file that was never attached or made accessible.', 'The answer lacks access to the claimed evidence.', 'A model cannot establish the contents of unavailable material.'],
      ['Two runs give different uncertain estimates from the same incomplete evidence.', 'The available evidence does not support a stable estimate.', 'Variation and missing evidence limit how firmly the result can be stated.'],
    ]],
    applied: ['What should happen next before the {{deliverable}} is used?', [
      ['A material claim includes an untraceable record identifier.', 'Check the source and remove the claim if unsupported.', 'The identifier must resolve to evidence before it supports the claim.'],
      ['The only cited procedure is marked superseded.', 'Obtain the current approved procedure and answer again.', 'The task needs current evidence rather than a better paraphrase.'],
      ['The assistant has no access to the necessary attachment.', 'Provide an approved extract or state that it cannot be checked.', 'The evidence gap must be resolved or disclosed.'],
      ['The source explicitly leaves a material condition undecided.', 'Present the uncertainty and request the missing decision.', 'A decisive answer would invent a condition the source does not establish.'],
    ]],
    proficient: ['Which interpretation avoids exceeding the evidence?', [
      ['Five identical prompts repeat the same uncited claim; no original record supports it.', 'Repeated agreement is not independent verification.', 'The same system can repeat the same unsupported statement.'],
      ['A benchmark reports high average accuracy, but excludes the exception needed here.', 'The benchmark does not establish performance on this exception.', 'The task-specific boundary is absent from the measured sample.'],
      ['A correct result comes from a cached record, but the current record has changed.', 'Past correctness does not establish present correctness.', 'The supporting state changed after the successful result.'],
      ['Two independent current records conflict on a material value.', 'The conflict remains unresolved and should be surfaced.', 'Choosing the more fluent summary would conceal unresolved evidence.'],
    ]],
    advanced: ['Which operating rule is best supported by this failure pattern?', [
      ['Unsupported record identifiers recur in a material subset of {{deliverable}} drafts.', 'Require resolvable evidence for material claims before release.', 'The control directly tests the repeated unsupported-reference failure.'],
      ['Failures cluster immediately after source updates; older cases remain accurate.', 'Add source-version checks and update-triggered evaluations.', 'The failure pattern points to freshness rather than general language quality.'],
      ['Performance is reliable on ordinary tasks but unstable on a defined exception class.', 'Route that exception class to a reviewer and evaluate it separately.', 'A targeted boundary preserves useful capability while containing the weak slice.'],
      ['The assistant produces confident answers even when required fields are absent.', 'Test abstention and block decisions with missing critical inputs.', 'The system needs a measurable missing-evidence boundary.'],
    ]],
  },
  'D1-ai-systems': {
    awareness: ['Which component is directly responsible for the observed behavior?', [
      ['An earlier instruction disappears after the conversation becomes too long.', 'The available context window.', 'The system cannot necessarily retain every earlier message in its active input.'],
      ['A preference is restored in a new session from a saved profile record.', 'Persistent application memory.', 'Cross-session restoration requires stored state, not only the current conversation.'],
      ['The assistant reads {{source}} through an authorized external integration.', 'A tool connector.', 'The integration provides access to a system outside the model.'],
      ['The assistant plans steps, calls tools, checks outcomes, and repeats until a stop rule.', 'An agent control loop.', 'The loop coordinates actions and outcome checks over multiple steps.'],
    ]],
    applied: ['Which configuration change addresses the specific requirement?', [
      ['Critical constraints disappear in long drafting sessions.', 'Supply the constraints in the bounded context for each task.', 'Task-critical instructions should not depend on unlimited conversation history.'],
      ['Users must see the same approved preferences next session.', 'Store versioned preferences with explicit read and update rules.', 'Durable preferences require managed storage and lifecycle behavior.'],
      ['The assistant must inspect records but must never change them.', 'Grant the connector read-only access to the needed records.', 'The required capability is reading, so write permission is unnecessary.'],
      ['A tool-using task repeats retries without reaching a decision.', 'Add retry, cost, and stop limits with an escalation path.', 'The control loop needs explicit bounds and an unresolved-state exit.'],
    ]],
    proficient: ['Where should the team investigate first?', [
      ['The instruction is absent from the final model input but present in the original conversation.', 'The context assembly and truncation step.', 'The evidence locates the loss before model processing.'],
      ['The prompt is current, but a saved user preference overrides the new approved setting.', 'The memory precedence and version rules.', 'Stale persistent state is winning over a newer instruction.'],
      ['The retrieved record is correct, but the tool reports a denied write scope.', 'The connector authorization configuration.', 'The action fails at the permission boundary.'],
      ['Every tool call succeeds, yet the agent repeats the same completed action.', 'The loop’s state update and completion detection.', 'Successful calls are not being recognized as progress toward completion.'],
    ]],
    advanced: ['Which architecture decision best addresses the stated systemic risk?', [
      ['Different teams build prompts independently and omit critical constraints inconsistently.', 'Centralize versioned task-context assembly and test its output.', 'The control targets inconsistent construction of the model input.'],
      ['One user’s saved context sometimes appears in another user’s task.', 'Isolate memory by identity and test cross-user access denial.', 'The failure requires a storage and access boundary, not a longer prompt.'],
      ['The same connector identity reads records and performs unrestricted production writes.', 'Separate read and action identities with approval-bound scopes.', 'Distinct capabilities allow enforcement of narrower action permissions.'],
      ['Multiple agents retry one another’s failed tasks indefinitely.', 'Use shared run state, idempotent handoffs, and a global stop budget.', 'Local retry limits alone do not bound a multi-agent cycle.'],
    ]],
  },
};
