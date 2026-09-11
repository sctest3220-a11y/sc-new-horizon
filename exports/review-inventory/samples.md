# New Horizon draft question samples

48 examples from the 3,328-item review inventory. All items are unreviewed, English-only drafts with provisional difficulty. The full workbook and JSON contain every item.

## NH-CORE-GENERAL-D1-CORE-CONCEPTS-APPLIED-01

Core AI concepts · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: The system must inspect a record, draft a response, and request approval before a write.

Which implementation fits the stated requirement for the project update?

- **A.** Use a lookup table with explicit category rules.
- **B.** Use a generative drafting assistant with review.
- **C.** Use search that returns the original source passage.
- **D.** Use an application with retrieval and gated tool steps.

**Answer: D.** The task combines evidence, generation, and controlled actions.

## NH-CORE-GENERAL-D1-GENAI-MECHANICS-APPLIED-01

Generative AI mechanics · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: A stable output style fails despite tested prompts; many reviewed examples are available.

Which mechanism best addresses the stated need?

- **A.** Measure tokens and reduce or split the input.
- **B.** Retrieve the current procedure when answering.
- **C.** Evaluate fine-tuning against the prompt baseline.
- **D.** Use semantic retrieval with tested embeddings.

**Answer: C.** Stable behavior and reviewed examples make a controlled fine-tuning trial reasonable.

## NH-FUNCTION-MARKETING-D1-GENAI-MECHANICS-ADVANCED-01

Generative AI mechanics · advanced · Marketing

Setting: Marketing. Task: prepare a campaign content recommendation using approved campaign evidence and licensed asset records. Accountable role: campaign owner. Exercise constraint: Performance claims and asset rights must be checked before publication. Consequence to consider: A misleading claim can be repeated across a campaign.

Evidence: Grounded answer accuracy is low; the team does not know whether search or synthesis fails. Additional function evidence: The proposed campaign asset is licensed for internal use only.

Which next evaluation best addresses the identified uncertainty? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Use held-out tasks and compare with the untuned baseline; publish it with creator credit as a substitute for permission.
- **B.** Measure passage recall and answer faithfulness separately; publish it with creator credit as a substitute for permission.
- **C.** Measure passage recall and answer faithfulness separately; replace it or obtain permission for the campaign use.
- **D.** Use held-out tasks and compare with the untuned baseline; replace it or obtain permission for the campaign use.

**Answer: C.** Separating stages identifies which mechanism needs intervention. Attribution does not expand the documented license scope.

## NH-CORE-GENERAL-D1-CAPABILITY-LIMITS-APPLIED-01

Capability boundaries · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: The source explicitly leaves a material condition undecided.

What should happen next before the project update is used?

- **A.** Present the uncertainty and request the missing decision.
- **B.** Obtain the current approved procedure and answer again.
- **C.** Check the source and remove the claim if unsupported.
- **D.** Provide an approved extract or state that it cannot be checked.

**Answer: A.** A decisive answer would invent a condition the source does not establish.

## NH-FUNCTION-SALES-D1-CAPABILITY-LIMITS-ADVANCED-01

Capability boundaries · advanced · Sales

Setting: Sales. Task: prepare a account proposal using approved CRM extracts and current commercial terms. Accountable role: account owner. Exercise constraint: Only the account owner may approve pricing and delivery promises. Consequence to consider: An unsupported promise can become a customer dispute.

Evidence: Failures cluster immediately after source updates; older cases remain accurate. Additional function evidence: The account proposal offers a discount outside the approved pricing range.

Which operating rule is best supported by this failure pattern? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Test abstention and block decisions with missing critical inputs; seek the account owner’s authorized pricing decision.
- **B.** Add source-version checks and update-triggered evaluations; send the proposal because the customer has requested a quick reply.
- **C.** Test abstention and block decisions with missing critical inputs; send the proposal because the customer has requested a quick reply.
- **D.** Add source-version checks and update-triggered evaluations; seek the account owner’s authorized pricing decision.

**Answer: D.** The failure pattern points to freshness rather than general language quality. Customer urgency does not expand pricing authority.

## NH-CORE-GENERAL-D1-AI-SYSTEMS-APPLIED-01

AI systems literacy · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: Critical constraints disappear in long drafting sessions.

Which configuration change addresses the specific requirement?

- **A.** Grant the connector read-only access to the needed records.
- **B.** Store versioned preferences with explicit read and update rules.
- **C.** Supply the constraints in the bounded context for each task.
- **D.** Add retry, cost, and stop limits with an escalation path.

**Answer: C.** Task-critical instructions should not depend on unlimited conversation history.

## NH-FUNCTION-GENERAL-D1-AI-SYSTEMS-ADVANCED-01

AI systems literacy · advanced · Cross-functional professional

Setting: Cross-functional professional. Task: prepare a operating brief using approved project and service records. Accountable role: process owner. Exercise constraint: Recommendations must distinguish facts from assumptions. Consequence to consider: A false dependency can delay several teams.

Evidence: One user’s saved context sometimes appears in another user’s task. Additional function evidence: Two departments disagree about a dependency and neither has accepted the handoff.

Which architecture decision best addresses the stated systemic risk? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Isolate memory by identity and test cross-user access denial; resolve the dependency with a named receiving owner.
- **B.** Isolate memory by identity and test cross-user access denial; send the draft to both teams and treat delivery as acceptance.
- **C.** Centralize versioned task-context assembly and test its output; resolve the dependency with a named receiving owner.
- **D.** Centralize versioned task-context assembly and test its output; send the draft to both teams and treat delivery as acceptance.

**Answer: A.** The failure requires a storage and access boundary, not a longer prompt. Distributing a document does not resolve responsibility for the handoff.

## NH-CORE-GENERAL-D2-PROMPT-DESIGN-APPLIED-01

Prompt design · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: The text uses expert vocabulary for an audience new to the topic.

Which prompt repair most directly fixes the observed failure?

- **A.** Ask for a version comparison with unchanged content omitted.
- **B.** Define the audience and request explanations of unfamiliar terms.
- **C.** Require missing fields to be marked unknown and never inferred.
- **D.** Specify the exact schema and validate every required field.

**Answer: B.** The audience requirement changes how the same facts should be communicated.

## NH-FUNCTION-GENERAL-D2-PROMPT-DESIGN-ADVANCED-01

Prompt design · advanced · Cross-functional professional

Setting: Cross-functional professional. Task: prepare a operating brief using approved project and service records. Accountable role: process owner. Exercise constraint: Recommendations must distinguish facts from assumptions. Consequence to consider: A false dependency can delay several teams.

Evidence: Teams edit the production prompt directly; failures cannot be traced to a version. Additional function evidence: Two departments disagree about a dependency and neither has accepted the handoff.

Which prompt-management decision best fits the evidence? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Version prompts and link each release to evaluated examples; send the draft to both teams and treat delivery as acceptance.
- **B.** Make the exception a release-blocking regression case; resolve the dependency with a named receiving owner.
- **C.** Make the exception a release-blocking regression case; send the draft to both teams and treat delivery as acceptance.
- **D.** Version prompts and link each release to evaluated examples; resolve the dependency with a named receiving owner.

**Answer: D.** Traceable releases make prompt effects auditable and reversible. Distributing a document does not resolve responsibility for the handoff.

## NH-CORE-GENERAL-D2-TOOL-SELECTION-APPLIED-01

Tool selection and integration · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: The task combines record lookup, drafting, and a gated system action.

Which candidate best fits the stated task?

- **A.** The approved drafting tool with controlled input and review.
- **B.** The workflow tool with scoped connectors and approval stages.
- **C.** The approved search tool that returns source passages.
- **D.** The deterministic calculation tool with traceable formulas.

**Answer: B.** The complete task needs orchestrated capabilities and an action boundary.

## NH-FUNCTION-GENERAL-D2-TOOL-SELECTION-ADVANCED-01

Tool selection and integration · advanced · Cross-functional professional

Setting: Cross-functional professional. Task: prepare a operating brief using approved project and service records. Accountable role: process owner. Exercise constraint: Recommendations must distinguish facts from assumptions. Consequence to consider: A false dependency can delay several teams.

Evidence: Vendor demonstrations use easy cases unlike the exception-heavy approved project and service records. Additional function evidence: Two departments disagree about a dependency and neither has accepted the handoff.

Which procurement experiment best resolves the stated uncertainty? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Run a representative held-out workload with predeclared criteria; resolve the dependency with a named receiving owner.
- **B.** Run a representative held-out workload with predeclared criteria; send the draft to both teams and treat delivery as acceptance.
- **C.** Compare failure severity and worst-slice performance; send the draft to both teams and treat delivery as acceptance.
- **D.** Compare failure severity and worst-slice performance; resolve the dependency with a named receiving owner.

**Answer: A.** Selection needs task-relevant evidence beyond a curated demonstration. Distributing a document does not resolve responsibility for the handoff.

## NH-CORE-GENERAL-D2-AGENTIC-WORKFLOWS-APPLIED-01

Agentic workflows · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: A timeout causes the same approved action to run twice.

Which change addresses the failure without changing unrelated steps?

- **A.** Bind approval to the exact version being executed.
- **B.** Use an idempotency key and reconcile the action result.
- **C.** Reject incomplete handoffs and request a named owner.
- **D.** Route the uncertain result to review before execution.

**Answer: B.** Retries must identify the same logical action to avoid duplication.

## NH-FUNCTION-GENERAL-D2-AGENTIC-WORKFLOWS-ADVANCED-01

Agentic workflows · advanced · Cross-functional professional

Setting: Cross-functional professional. Task: prepare a operating brief using approved project and service records. Accountable role: process owner. Exercise constraint: Recommendations must distinguish facts from assumptions. Consequence to consider: A false dependency can delay several teams.

Evidence: Approvers cannot see which source version and payload they are authorizing. Additional function evidence: Two departments disagree about a dependency and neither has accepted the handoff.

Which control design best addresses the documented risk? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Separate retrieved content from authority and enforce tool policies; send the draft to both teams and treat delivery as acceptance.
- **B.** Present a versioned evidence-to-action diff at approval; send the draft to both teams and treat delivery as acceptance.
- **C.** Present a versioned evidence-to-action diff at approval; resolve the dependency with a named receiving owner.
- **D.** Separate retrieved content from authority and enforce tool policies; resolve the dependency with a named receiving owner.

**Answer: C.** Meaningful approval requires a reviewable, exact proposed action. Distributing a document does not resolve responsibility for the handoff.

## NH-CORE-GENERAL-D2-OUTPUT-REFINEMENT-APPLIED-01

Output refinement · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: The required exception is absent from an otherwise accurate project update.

Which revision request is most targeted?

- **A.** Explain that term using a concrete audience-relevant example.
- **B.** Correct the approval claim and cite the supporting clause.
- **C.** Return the exact field schema and validate the identifier.
- **D.** Add the exception and explain when it applies.

**Answer: D.** The defect is missing decision-relevant coverage.

## NH-FUNCTION-PEOPLE-D2-OUTPUT-REFINEMENT-ADVANCED-01

Output refinement · advanced · People / HR

Setting: People / HR. Task: prepare a employee service response using approved HR procedures and anonymized case records. Accountable role: HR service lead. Exercise constraint: Employment decisions require a named human decision maker. Consequence to consider: A mistaken claim can affect an employee opportunity.

Evidence: Reviewers repeatedly rewrite outputs but never label recurring defect types. Additional function evidence: The employee response includes a recommendation that could affect an employment decision.

Which quality process should be introduced first? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Record defect categories and connect them to prompt or source fixes; let the assistant finalize it after checking the wording.
- **B.** Record defect categories and connect them to prompt or source fixes; reserve that decision for the authorized HR decision maker.
- **C.** Stop on explicit acceptance criteria with a bounded revision budget; reserve that decision for the authorized HR decision maker.
- **D.** Stop on explicit acceptance criteria with a bounded revision budget; let the assistant finalize it after checking the wording.

**Answer: B.** Structured feedback enables prevention rather than repeated manual repair. A wording review does not authorize an employment decision.

## NH-CORE-GENERAL-D3-SOURCE-VERIFICATION-APPLIED-01

Source and claim verification · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: A screenshot names a policy but omits its date and version.

Which check should resolve the specific evidence gap first?

- **A.** Request accessible supporting evidence or mark the claim unverified.
- **B.** Locate the approved policy and verify its effective version.
- **C.** Read the surrounding passage and restore the exception.
- **D.** Inspect the original record against both interpretations.

**Answer: B.** The screenshot alone cannot establish current applicability.

## NH-FUNCTION-GENERAL-D3-SOURCE-VERIFICATION-ADVANCED-01

Source and claim verification · advanced · Cross-functional professional

Setting: Cross-functional professional. Task: prepare a operating brief using approved project and service records. Accountable role: process owner. Exercise constraint: Recommendations must distinguish facts from assumptions. Consequence to consider: A false dependency can delay several teams.

Evidence: Approved claims become stale when upstream records are replaced. Additional function evidence: Two departments disagree about a dependency and neither has accepted the handoff.

Which evidence control would best prevent the observed recurring failure? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Trigger re-review from source changes using claim-source links; send the draft to both teams and treat delivery as acceptance.
- **B.** Record source versions and resolve time conflicts before synthesis; resolve the dependency with a named receiving owner.
- **C.** Trigger re-review from source changes using claim-source links; resolve the dependency with a named receiving owner.
- **D.** Record source versions and resolve time conflicts before synthesis; send the draft to both teams and treat delivery as acceptance.

**Answer: C.** A linked dependency enables targeted freshness checks after updates. Distributing a document does not resolve responsibility for the handoff.

## NH-CORE-GENERAL-D3-DATA-CHART-JUDGMENT-APPLIED-01

Data and chart judgment · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: A pilot handles only simple cases; the baseline contains simple and complex cases.

Which calculation or comparison should be used?

- **A.** Assume the pilot gain transfers to complex cases at the same rate.
- **B.** Compare matched complexity groups before claiming improvement.
- **C.** Remove complex cases from the future workload to preserve the pilot score.
- **D.** Compare the total average without adjusting for case complexity.

**Answer: B.** A changed case mix can create an apparent performance gain.

## NH-FUNCTION-GENERAL-D3-DATA-CHART-JUDGMENT-ADVANCED-01

Data and chart judgment · advanced · Cross-functional professional

Setting: Cross-functional professional. Task: prepare a operating brief using approved project and service records. Accountable role: process owner. Exercise constraint: Recommendations must distinguish facts from assumptions. Consequence to consider: A false dependency can delay several teams.

Evidence: The team repeatedly checks results and stops the experiment as soon as a favorable number appears. Additional function evidence: Two departments disagree about a dependency and neither has accepted the handoff.

Which evaluation redesign addresses the principal validity problem? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Add failure-severity and total-workflow measures to the evaluation; send the draft to both teams and treat delivery as acceptance.
- **B.** Predefine the stopping and analysis rules before the next run; send the draft to both teams and treat delivery as acceptance.
- **C.** Predefine the stopping and analysis rules before the next run; resolve the dependency with a named receiving owner.
- **D.** Add failure-severity and total-workflow measures to the evaluation; resolve the dependency with a named receiving owner.

**Answer: C.** Outcome-dependent stopping can distort the apparent evidence. Distributing a document does not resolve responsibility for the handoff.

## NH-CORE-GENERAL-D3-MEDIA-PROVENANCE-APPLIED-01

Media provenance · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: A polished campaign image has no license or creator record.

Which verification step addresses the specific uncertainty?

- **A.** Compare verifiable landmarks and contact a reliable local source.
- **B.** Verify origin and usage permission before publication.
- **C.** Search for earlier appearances and verify the event timeline.
- **D.** Obtain the full recording and inspect the surrounding context.

**Answer: B.** Visual quality does not establish the right to use the asset.

## NH-FUNCTION-MARKETING-D3-MEDIA-PROVENANCE-ADVANCED-01

Media provenance · advanced · Marketing

Setting: Marketing. Task: prepare a campaign content recommendation using approved campaign evidence and licensed asset records. Accountable role: campaign owner. Exercise constraint: Performance claims and asset rights must be checked before publication. Consequence to consider: A misleading claim can be repeated across a campaign.

Evidence: Approved assets lose source and license records during handoff. Additional function evidence: The proposed campaign asset is licensed for internal use only.

Which media-review process best addresses the repeated failure? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Use detector results within a documented multi-evidence review; publish it with creator credit as a substitute for permission.
- **B.** Preserve source, edit, rights, and approval metadata with each asset; publish it with creator credit as a substitute for permission.
- **C.** Preserve source, edit, rights, and approval metadata with each asset; replace it or obtain permission for the campaign use.
- **D.** Use detector results within a documented multi-evidence review; replace it or obtain permission for the campaign use.

**Answer: C.** A linked record keeps evidence available through publication. Attribution does not expand the documented license scope.

## NH-CORE-GENERAL-D3-FRAUD-DETECTION-APPLIED-01

Fraud and manipulation detection · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: A payment destination changed in an email with an urgent deadline.

What is the appropriate next verification action?

- **A.** Contact the known supplier through an independently stored channel.
- **B.** Use the established identity and exception-approval process.
- **C.** Reconcile the request against the authoritative transaction record.
- **D.** Open the known official service independently to inspect the request.

**Answer: A.** Verification must not rely on contact details supplied in the suspicious request.

## NH-FUNCTION-FINANCE-D3-FRAUD-DETECTION-ADVANCED-01

Fraud and manipulation detection · advanced · Finance

Setting: Finance. Task: prepare a reconciliation recommendation using approved ledger extracts and reconciled invoice records. Accountable role: finance controller. Exercise constraint: No payment or journal entry may be released by the assistant. Consequence to consider: A wrong recommendation can create an incorrect financial entry.

Evidence: Staff verify suspicious requests using phone numbers included in those requests. Additional function evidence: A reconciliation suggestion would create a journal entry, but the assistant is authorized only to advise.

Which control change addresses the demonstrated failure mode? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Contain the account and investigate affected actions through incident response; post the entry automatically once the totals balance.
- **B.** Contain the account and investigate affected actions through incident response; send the proposed entry to the authorized controller.
- **C.** Use independently maintained contact records for verification; send the proposed entry to the authorized controller.
- **D.** Use independently maintained contact records for verification; post the entry automatically once the totals balance.

**Answer: C.** An attacker-supplied channel cannot independently authenticate the attacker. Balanced totals do not grant authority to change the ledger.

## NH-CORE-GENERAL-D4-DATA-PRIVACY-APPLIED-01

Data protection and privacy · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: The task needs monthly totals, but the proposed upload contains individual-level records.

Which change best meets the task while addressing the stated privacy gap?

- **A.** Apply the approved deletion rule to the draft and its retained copies.
- **B.** Use the approved workspace or withhold the restricted input.
- **C.** Generalize or remove the identifying combination before sharing.
- **D.** Calculate or provide only the required aggregates.

**Answer: D.** The aggregate task does not require sharing each person’s record.

## NH-FUNCTION-GENERAL-D4-DATA-PRIVACY-ADVANCED-01

Data protection and privacy · advanced · Cross-functional professional

Setting: Cross-functional professional. Task: prepare a operating brief using approved project and service records. Accountable role: process owner. Exercise constraint: Recommendations must distinguish facts from assumptions. Consequence to consider: A false dependency can delay several teams.

Evidence: Privacy checks occur only at initial launch while data purposes keep changing. Additional function evidence: Two departments disagree about a dependency and neither has accepted the handoff.

Which system-level control addresses the observed lifecycle weakness? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Require change-triggered privacy review with an accountable owner; send the draft to both teams and treat delivery as acceptance.
- **B.** Evaluate utility with minimized fields before expanding collection; send the draft to both teams and treat delivery as acceptance.
- **C.** Evaluate utility with minimized fields before expanding collection; resolve the dependency with a named receiving owner.
- **D.** Require change-triggered privacy review with an accountable owner; resolve the dependency with a named receiving owner.

**Answer: D.** A changing use can invalidate the assumptions of the original review. Distributing a document does not resolve responsibility for the handoff.

## NH-CORE-GENERAL-D4-REGULATORY-POLICY-APPLIED-01

Regulatory and policy fluency · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: The rule requires an approval record, but the team has only an undocumented conversation.

What should the reviewer do under the supplied exercise rule?

- **A.** Create the required recorded approval through the designated process.
- **B.** Document the conflict and ask the authorized policy owner to resolve it.
- **C.** Remove the excluded records or seek an authorized exception.
- **D.** Obtain the required external-use authorization before publication.

**Answer: A.** The supplied control requires evidence of authorization.

## NH-FUNCTION-PEOPLE-D4-REGULATORY-POLICY-ADVANCED-01

Regulatory and policy fluency · advanced · People / HR

Setting: People / HR. Task: prepare a employee service response using approved HR procedures and anonymized case records. Accountable role: HR service lead. Exercise constraint: Employment decisions require a named human decision maker. Consequence to consider: A mistaken claim can affect an employee opportunity.

Evidence: A multinational workflow assumes one regional policy covers every deployment. Additional function evidence: The employee response includes a recommendation that could affect an employment decision.

Which governance change addresses the documented policy failure? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Review applicable requirements and authorized scope for each deployment; let the assistant finalize it after checking the wording.
- **B.** Create an owned exception process with recorded rationale and expiry; reserve that decision for the authorized HR decision maker.
- **C.** Review applicable requirements and authorized scope for each deployment; reserve that decision for the authorized HR decision maker.
- **D.** Create an owned exception process with recorded rationale and expiry; let the assistant finalize it after checking the wording.

**Answer: C.** The exercise does not establish one rule set as universally applicable. A wording review does not authorize an employment decision.

## NH-CORE-GENERAL-D4-FAIRNESS-ETHICS-APPLIED-01

Fairness, ethics, and rights · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: Users cannot correct inaccurate inputs behind an AI recommendation.

Which response addresses the specific human-impact concern?

- **A.** Test that language slice and provide a reliable alternative path.
- **B.** Provide a correction and human-review route.
- **C.** Evaluate necessity and group impact before retaining the field.
- **D.** Obtain suitable permission or replace the asset.

**Answer: B.** The process needs a way to contest the factual basis of its output.

## NH-FUNCTION-PEOPLE-D4-FAIRNESS-ETHICS-ADVANCED-01

Fairness, ethics, and rights · advanced · People / HR

Setting: People / HR. Task: prepare a employee service response using approved HR procedures and anonymized case records. Accountable role: HR service lead. Exercise constraint: Employment decisions require a named human decision maker. Consequence to consider: A mistaken claim can affect an employee opportunity.

Evidence: Two interventions reduce different error types for different affected groups. Additional function evidence: The employee response includes a recommendation that could affect an employment decision.

Which evaluation or control design best addresses the stated tradeoff? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Evaluate representative cases and access alternatives before expansion; reserve that decision for the authorized HR decision maker.
- **B.** Compare group-specific harms with stakeholders and document the tradeoff; let the assistant finalize it after checking the wording.
- **C.** Evaluate representative cases and access alternatives before expansion; let the assistant finalize it after checking the wording.
- **D.** Compare group-specific harms with stakeholders and document the tradeoff; reserve that decision for the authorized HR decision maker.

**Answer: D.** No aggregate score alone resolves competing distributions of harm. A wording review does not authorize an employment decision.

## NH-CORE-GENERAL-D4-SECURITY-GOVERNANCE-APPLIED-01

Security and governance controls · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: A retrieved record contains a request to export unrelated data.

Which action addresses the immediate security issue?

- **A.** Reduce the connector to the required read scope.
- **B.** Treat the request as untrusted content and enforce the approved task scope.
- **C.** Reconcile the authoritative state before any retry.
- **D.** Revoke or rotate the exposed credential and investigate its use.

**Answer: B.** The external record cannot authorize a new data-transfer action.

## NH-FUNCTION-GENERAL-D4-SECURITY-GOVERNANCE-ADVANCED-01

Security and governance controls · advanced · Cross-functional professional

Setting: Cross-functional professional. Task: prepare a operating brief using approved project and service records. Accountable role: process owner. Exercise constraint: Recommendations must distinguish facts from assumptions. Consequence to consider: A false dependency can delay several teams.

Evidence: The model can grant itself broader tool scopes during a task. Additional function evidence: Two departments disagree about a dependency and neither has accepted the handoff.

Which control architecture best addresses this systemic weakness? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Move permission decisions outside the model into an enforced policy layer; resolve the dependency with a named receiving owner.
- **B.** Use scoped service identities and attributable action records; resolve the dependency with a named receiving owner.
- **C.** Use scoped service identities and attributable action records; send the draft to both teams and treat delivery as acceptance.
- **D.** Move permission decisions outside the model into an enforced policy layer; send the draft to both teams and treat delivery as acceptance.

**Answer: A.** The component requesting power should not independently authorize its expansion. Distributing a document does not resolve responsibility for the handoff.

## NH-CORE-GENERAL-D5-USECASE-FIT-APPLIED-01

Use-case evaluation · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: The task is exact arithmetic under fixed rules, with no language ambiguity.

Which next step best addresses the principal feasibility gap?

- **A.** Compare a deterministic calculation against the proposed AI approach.
- **B.** Map the handoff and accountable user before building further.
- **C.** Resolve the data-access and use requirements before piloting.
- **D.** Pilot the bounded drafting task with explicit quality checks.

**Answer: A.** A simpler directly verifiable method may fit the problem better.

## NH-FUNCTION-GENERAL-D5-USECASE-FIT-ADVANCED-01

Use-case evaluation · advanced · Cross-functional professional

Setting: Cross-functional professional. Task: prepare a operating brief using approved project and service records. Accountable role: process owner. Exercise constraint: Recommendations must distinguish facts from assumptions. Consequence to consider: A false dependency can delay several teams.

Evidence: A bounded pilot meets quality, cost, and review targets; its operating conditions will remain the same. Additional function evidence: Two departments disagree about a dependency and neither has accepted the handoff.

Which scale decision is best justified by the evidence? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Expand gradually with monitoring and explicit stop conditions; send the draft to both teams and treat delivery as acceptance.
- **B.** Evaluate the new conditions before extending the pilot claim; resolve the dependency with a named receiving owner.
- **C.** Expand gradually with monitoring and explicit stop conditions; resolve the dependency with a named receiving owner.
- **D.** Evaluate the new conditions before extending the pilot claim; send the draft to both teams and treat delivery as acceptance.

**Answer: C.** The evidence supports a controlled extension within the tested boundary. Distributing a document does not resolve responsibility for the handoff.

## NH-CORE-GENERAL-D5-ROI-METRICS-APPLIED-01

ROI and measurement · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: Completion time improves while material errors rise.

Which calculation or measurement is appropriate?

- **A.** Declare the pilot successful using speed as the only outcome.
- **B.** Average time and error percentages into a single unweighted number.
- **C.** Convert every minute saved to cash without accounting for error remediation.
- **D.** Report speed and error changes together before judging value.

**Answer: D.** A faster workflow can still create a worse total outcome.

## NH-FUNCTION-GENERAL-D5-ROI-METRICS-ADVANCED-01

ROI and measurement · advanced · Cross-functional professional

Setting: Cross-functional professional. Task: prepare a operating brief using approved project and service records. Accountable role: process owner. Exercise constraint: Recommendations must distinguish facts from assumptions. Consequence to consider: A false dependency can delay several teams.

Evidence: Two projects have similar expected ROI but very different downside losses. Additional function evidence: Two departments disagree about a dependency and neither has accepted the handoff.

Which decision rule best addresses the business-case uncertainty? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Reestablish attributable benefit evidence before the next funding gate; send the draft to both teams and treat delivery as acceptance.
- **B.** Compare risk-adjusted value and downside exposure alongside ROI; resolve the dependency with a named receiving owner.
- **C.** Reestablish attributable benefit evidence before the next funding gate; resolve the dependency with a named receiving owner.
- **D.** Compare risk-adjusted value and downside exposure alongside ROI; send the draft to both teams and treat delivery as acceptance.

**Answer: B.** Expected ratios alone do not describe the potential loss distribution. Distributing a document does not resolve responsibility for the handoff.

## NH-CORE-GENERAL-D5-PORTFOLIO-PRIORITIZATION-APPLIED-01

Portfolio prioritization · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: Two proposals duplicate the same shared capability and target the same users.

Which portfolio action follows from the stated constraint?

- **A.** Hold expansion until the failed quality gate is resolved.
- **B.** Sequence the ready project while resolving the other’s data dependency.
- **C.** Compare consolidation before funding both independently.
- **D.** Fund the bounded learning step with explicit success criteria.

**Answer: C.** Duplicated investment may waste capacity and fragment the operating model.

## NH-FUNCTION-FINANCE-D5-PORTFOLIO-PRIORITIZATION-ADVANCED-01

Portfolio prioritization · advanced · Finance

Setting: Finance. Task: prepare a reconciliation recommendation using approved ledger extracts and reconciled invoice records. Accountable role: finance controller. Exercise constraint: No payment or journal entry may be released by the assistant. Consequence to consider: A wrong recommendation can create an incorrect financial entry.

Evidence: Several projects share one vendor and would fail together during an outage. Additional function evidence: A reconciliation suggestion would create a journal entry, but the assistant is authorized only to advise.

Which allocation rule best addresses the stated portfolio tradeoff? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Evaluate correlated exposure and fund justified resilience measures; post the entry automatically once the totals balance.
- **B.** Reserve a bounded learning allocation with explicit option-value criteria; send the proposed entry to the authorized controller.
- **C.** Reserve a bounded learning allocation with explicit option-value criteria; post the entry automatically once the totals balance.
- **D.** Evaluate correlated exposure and fund justified resilience measures; send the proposed entry to the authorized controller.

**Answer: D.** Independent project scores can miss shared failure dependence. Balanced totals do not grant authority to change the ledger.

## NH-CORE-GENERAL-D5-TRANSFORMATION-STRATEGY-APPLIED-01

Strategy and transformation · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: The pilot succeeds in one team, but the next team uses different records and controls.

Which next action makes the strategy more executable?

- **A.** Redesign the approval handoff and decision ownership.
- **B.** Define manager responsibilities for practice, support, and feedback.
- **C.** Assess transfer conditions before planning that rollout.
- **D.** Translate the delay into measurable workflow and quality outcomes.

**Answer: C.** A new environment may require different evidence and implementation.

## NH-EXECUTIVE-CEO-D5-TRANSFORMATION-STRATEGY-ADVANCED-01

Strategy and transformation · advanced · CEO

Setting: CEO. Task: prepare a enterprise investment recommendation using portfolio results and approved operating plans. Accountable role: executive sponsor. Exercise constraint: Scaling decisions need explicit accountable owners and measurable outcomes. Consequence to consider: A weak scale decision can spread failure across the enterprise.

Evidence: A long-term plan depends on one untested assumption about model autonomy. Additional leadership evidence: Three departments propose scaling, but each assumes another will own the shared exceptions.

Which strategic response best fits the observed constraint? Choose the combined decision and leadership action that both fit the evidence.

- **A.** Define shared principles while preserving justified local control differences; ask each department to launch and resolve ownership afterward.
- **B.** Define shared principles while preserving justified local control differences; assign cross-functional ownership before authorizing scale.
- **C.** Use staged options and test that assumption before irreversible commitments; ask each department to launch and resolve ownership afterward.
- **D.** Use staged options and test that assumption before irreversible commitments; assign cross-functional ownership before authorizing scale.

**Answer: D.** Strategic uncertainty favors learning before locking in dependence. Scaling first would spread an already identified accountability gap.

## NH-CORE-GENERAL-D6-ROLE-CLARITY-APPLIED-01

Human-AI role clarity · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: The assistant can draft accurately, but a consequential decision remains with project lead.

Which assignment resolves the stated ownership gap?

- **A.** Send the evidence to the named exception authority.
- **B.** Activate the assigned correction owner and communication process.
- **C.** Keep drafting with the assistant and final judgment with the owner.
- **D.** Require an accepted handoff with a named receiving owner.

**Answer: C.** The task separates assistance from the accountable decision.

## NH-FUNCTION-GENERAL-D6-ROLE-CLARITY-ADVANCED-01

Human-AI role clarity · advanced · Cross-functional professional

Setting: Cross-functional professional. Task: prepare a operating brief using approved project and service records. Accountable role: process owner. Exercise constraint: Recommendations must distinguish facts from assumptions. Consequence to consider: A false dependency can delay several teams.

Evidence: Incidents are corrected locally but no owner can change the shared workflow. Additional function evidence: Two departments disagree about a dependency and neither has accepted the handoff.

Which operating-model change best addresses the repeated failure? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Assign a system owner with authority for shared corrective changes; resolve the dependency with a named receiving owner.
- **B.** Reassess decision rights for each newly automated capability; resolve the dependency with a named receiving owner.
- **C.** Reassess decision rights for each newly automated capability; send the draft to both teams and treat delivery as acceptance.
- **D.** Assign a system owner with authority for shared corrective changes; send the draft to both teams and treat delivery as acceptance.

**Answer: A.** Recurring systemic issues require responsibility beyond individual cases. Distributing a document does not resolve responsibility for the handoff.

## NH-CORE-GENERAL-D6-TRUST-CULTURE-APPLIED-01

Trust and challenge culture · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: Staff misunderstand which parts of the project update were generated and reviewed.

Which response best supports constructive challenge?

- **A.** Acknowledge the error and demonstrate the correction process.
- **B.** Thank the reviewer and check the specific evidence before deciding.
- **C.** Use a shared source and rubric to resolve the disagreement.
- **D.** Explain the workflow and the actual review boundaries.

**Answer: D.** Accurate transparency helps staff calibrate reliance on the result.

## NH-FUNCTION-PEOPLE-D6-TRUST-CULTURE-ADVANCED-01

Trust and challenge culture · advanced · People / HR

Setting: People / HR. Task: prepare a employee service response using approved HR procedures and anonymized case records. Accountable role: HR service lead. Exercise constraint: Employment decisions require a named human decision maker. Consequence to consider: A mistaken claim can affect an employee opportunity.

Evidence: Teams share only success stories, preventing others from learning about known limits. Additional function evidence: The employee response includes a recommendation that could affect an employment decision.

Which intervention best addresses the observed culture problem? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Evaluate calibrated reliance through concrete task scenarios; reserve that decision for the authorized HR decision maker.
- **B.** Institutionalize evidence-based failure reviews with visible follow-through; reserve that decision for the authorized HR decision maker.
- **C.** Institutionalize evidence-based failure reviews with visible follow-through; let the assistant finalize it after checking the wording.
- **D.** Evaluate calibrated reliance through concrete task scenarios; let the assistant finalize it after checking the wording.

**Answer: B.** Learning requires circulation of limitations and corrective action. A wording review does not authorize an employment decision.

## NH-CORE-GENERAL-D6-CHANGE-ENABLEMENT-APPLIED-01

Change enablement · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: Users avoid the tool because they cannot tell which records may be used.

Which intervention addresses the demonstrated adoption barrier?

- **A.** Practice the real task with feedback on representative examples.
- **B.** Publish clear examples of permitted inputs and escalation cases.
- **C.** Create a supported champion and escalation network.
- **D.** Offer equivalent practice and support through accessible schedules.

**Answer: B.** The barrier is uncertainty about the operating boundary.

## NH-FUNCTION-PEOPLE-D6-CHANGE-ENABLEMENT-ADVANCED-01

Change enablement · advanced · People / HR

Setting: People / HR. Task: prepare a employee service response using approved HR procedures and anonymized case records. Accountable role: HR service lead. Exercise constraint: Employment decisions require a named human decision maker. Consequence to consider: A mistaken claim can affect an employee opportunity.

Evidence: A single training package is planned for roles with materially different decisions and risks. Additional function evidence: The employee response includes a recommendation that could affect an employment decision.

Which rollout design best addresses the organizational constraint? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Use a shared foundation plus role-specific practice and controls; reserve that decision for the authorized HR decision maker.
- **B.** Fund support capacity and transfer knowledge beyond the initial champions; reserve that decision for the authorized HR decision maker.
- **C.** Use a shared foundation plus role-specific practice and controls; let the assistant finalize it after checking the wording.
- **D.** Fund support capacity and transfer knowledge beyond the initial champions; let the assistant finalize it after checking the wording.

**Answer: A.** Common concepts can coexist with different operational requirements. A wording review does not authorize an employment decision.

## NH-CORE-GENERAL-D6-LEARNING-LOOPS-APPLIED-01

Learning and improvement loops · applied · Core / general

Setting: Project team. Task: prepare a project update using approved project records. Accountable role: project lead. Exercise constraint: Only the current approved version may be circulated. Consequence to consider: A wrong update can send the team to the wrong milestone.

Evidence: A fix passes evaluation and is released, but related guidance remains outdated.

Which next step completes the missing learning action?

- **A.** Collect fresh evidence on the targeted competency.
- **B.** Update the guidance and tell affected users what changed.
- **C.** Group the reports and inspect the shared instruction with examples.
- **D.** Compare it against the baseline on relevant held-out cases.

**Answer: B.** Learning must reach the people using the changed workflow.

## NH-FUNCTION-MARKETING-D6-LEARNING-LOOPS-ADVANCED-01

Learning and improvement loops · advanced · Marketing

Setting: Marketing. Task: prepare a campaign content recommendation using approved campaign evidence and licensed asset records. Accountable role: campaign owner. Exercise constraint: Performance claims and asset rights must be checked before publication. Consequence to consider: A misleading claim can be repeated across a campaign.

Evidence: The inventory expands rapidly with closely related variants. Additional function evidence: The proposed campaign asset is licensed for internal use only.

Which learning-system design addresses the repeated failure? Choose the combined decision and specialized action that both fit the evidence.

- **A.** Keep proposals separate and require evidence-based approval before scored use; publish it with creator credit as a substitute for permission.
- **B.** Track item families and control exposure and calibration at family level; publish it with creator credit as a substitute for permission.
- **C.** Keep proposals separate and require evidence-based approval before scored use; replace it or obtain permission for the campaign use.
- **D.** Track item families and control exposure and calibration at family level; replace it or obtain permission for the campaign use.

**Answer: D.** Related items can share clues and should not be treated as independent evidence. Attribution does not expand the documented license scope.
