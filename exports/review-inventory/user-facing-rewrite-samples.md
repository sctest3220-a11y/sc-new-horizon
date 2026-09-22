# User-Facing Rewrite Samples

These are examples of the writing standard the draft review inventory needs before questions are promoted into the live assessment. The current 3,328-item inventory is useful as a coverage scaffold, but the text is still too abstract, repetitive, and generator-shaped for normal users.

## Rewrite Principles

- Start with a situation the user can picture.
- Ask one clear decision at a time.
- Use artifacts when the user needs to inspect evidence.
- Use multi-part questions when the decision has two different skills.
- Avoid internal phrases such as "profile cue", "bounded scenario", "synthesis", and "evidence mode".
- Make answer choices concrete actions, not abstract labels.
- When a scenario includes a policy or required source, show the full causal chain: what must be used, what the AI failed to use, and what error or harm could result.
- Keep the explanation short: why the best answer is safer or better.

## Sample 1: Basic Scenario Choice

Source item: `NH-CORE-GENERAL-D1-CORE-CONCEPTS-AWARENESS-01`

### Before

```text
Scenario: Project team needs a project update.
Use: approved project records.
Rule: Only the current approved version may be circulated.
Risk: A wrong update can send the team to the wrong milestone.
Evidence: The system creates new sentences from learned patterns; it has no connection to approved project records.

Which description best matches the system used for this project update?

A. A rules-based automation selecting text.
B. An application coordinating several components.
C. A generative model producing a draft.
D. A search system retrieving existing text.
```

### After

```text
Your project team asks an AI assistant to draft a project update.

The update must use the latest approved project record because older versions may contain outdated status or milestones. However, the AI generates its answer using a Large Language Model (LLM) without searching the approved documents in the team's library. As a result, the draft may sound convincing while containing outdated or incorrect project information.

Which description best matches how the AI produced this draft?

A. Following fixed rules and copying approved text
B. Searching the document library and retrieving approved project information
C. Generating a draft with an LLM without retrieving the project documents
D. Coordinating search, permissions, and review steps
```

Correct answer: `C`

Why: The AI can generate fluent text, but it did not retrieve the latest approved project record. The draft may therefore sound convincing while containing outdated or incorrect information.

Format: `scenario choice`

Artifact: Not needed.

## Sample 2: Select All Safe Actions

Source item: `NH-CORE-GENERAL-D2-PROMPT-DESIGN-APPLIED-02`

### Before

```text
Scenario: Community learning group needs a workshop guide.
Use: reviewed learning materials.
Rule: The guide must work for readers with no AI background.
Risk: An unsupported instruction can mislead new learners.
Evidence: The workshop guide contains invented details where the supplied records have blank fields.

Which prompt repair most directly fixes the observed failure?

A. Define the audience and request explanations of unfamiliar terms.
B. Specify the exact schema and validate every required field.
C. Require missing fields to be marked unknown and never inferred.
D. Ask for a version comparison with unchanged content omitted.
```

### After

```text
You are using AI to turn reviewed training notes into a beginner workshop guide.

Some source records have blank fields. The AI fills those blanks with made-up details.

Which changes would make the prompt safer? Select all that apply.

A. Tell the AI to mark missing information as "unknown"
B. Ask the AI to explain technical terms in simple language
C. Require the AI to invent likely missing details so the guide feels complete
D. Ask a reviewer to check any section where the source record is incomplete
```

Correct answers: `A`, `D`

Partial credit:

- `A`: strong credit because it stops invented facts.
- `D`: strong credit because incomplete source records need review.
- `B`: small credit only if the task is also testing beginner readability.
- `C`: wrong because it encourages hallucination.

Format: `select all safe actions`

Artifact: Helpful. A short source-record table with two blank fields would make this practical.

## Sample 3: Source Verification With Artifact

Source item: `NH-CORE-GENERAL-D3-SOURCE-VERIFICATION-APPLIED-01`

### Before

```text
Scenario: Project team needs a project update.
Use: approved project records.
Rule: Only the current approved version may be circulated.
Risk: A wrong update can send the team to the wrong milestone.
Evidence: A screenshot names a policy but omits its date and version.

Which check should resolve the specific evidence gap first?

A. Request accessible supporting evidence or mark the claim unverified.
B. Locate the approved policy and verify its effective version.
C. Read the surrounding passage and restore the exception.
D. Inspect the original record against both interpretations.
```

### After

```text
You are reviewing an AI-generated project update.

The update cites "Remote Work Policy", but the screenshot does not show the policy date or version.

What should you check first?

A. Find the approved policy and confirm the version currently in force
B. Trust the screenshot because it names a real policy
C. Ask the AI to rewrite the update in a more cautious tone
D. Remove all policy references from the update
```

Correct answer: `A`

Why: The problem is not writing style. The problem is that the cited policy may be old or incomplete.

Format: `scenario choice`

Artifact required:

- Screenshot of an AI update citing "Remote Work Policy"
- Policy excerpt list with `v2.1`, `v3.0`, effective dates, and one superseded version

## Sample 4: Ranking / Sequencing

Source item: `NH-CORE-GENERAL-D5-ROI-METRICS-ADVANCED-03`

### Before

```text
Scenario: Small business needs a service briefing.
Use: approved service records.
Rule: Customer identifiers must stay out of the briefing.
Risk: A wrong claim can create a service commitment.
Evidence: The value estimate is positive only when adoption reaches an untested optimistic level.

Which decision rule best addresses the business-case uncertainty?

A. Remove double counting and specify how capacity becomes value.
B. Compare risk-adjusted value and downside exposure alongside ROI.
C. Reestablish attributable benefit evidence before the next funding gate.
D. Test adoption sensitivity and define a break-even adoption threshold.
```

### After

```text
A team wants funding for an AI service assistant.

The business case looks positive only if 80% of staff adopt it. No pilot has tested that adoption level.

Put these funding checks in the best order.

1. Run a small adoption test with real users
2. Calculate the break-even adoption level
3. Compare the pilot result with the break-even level
4. Decide whether to fund the next stage
```

Correct order: `2 -> 1 -> 3 -> 4`

Why: First define what adoption level is needed, then test whether real users can reach it.

Format: `ranked decision`

Artifact required:

- Simple funding dashboard showing expected savings at 30%, 50%, and 80% adoption
- Cost line and break-even point

## Sample 5: Multi-Part Marketing Scenario

Source item: `NH-FUNCTION-MARKETING-D1-GENAI-MECHANICS-ADVANCED-01`

### Before

```text
Scenario: Marketing needs a campaign content recommendation.
Use: approved campaign evidence and licensed asset records.
Rule: Performance claims and asset rights must be checked before publication.
Risk: A misleading claim can be repeated across a campaign.
Evidence: Grounded answer accuracy is low; the team does not know whether search or synthesis fails.
Extra function cue: The proposed campaign asset is licensed for internal use only.

Which next evaluation best addresses the identified uncertainty? Also apply the profile cue.

A. Use held-out tasks and compare with the untuned baseline; publish it with creator credit as a substitute for permission.
B. Measure passage recall and answer faithfulness separately; publish it with creator credit as a substitute for permission.
C. Measure passage recall and answer faithfulness separately; replace it or obtain permission for the campaign use.
D. Use held-out tasks and compare with the untuned baseline; replace it or obtain permission for the campaign use.
```

### After

```text
A marketing team uses AI to suggest campaign content.

Two issues appear:

1. The AI often gives wrong answers. The team does not know whether it found the wrong source or misunderstood the right source.
2. The image it recommends is licensed for internal use only.

Part 1: How should the team investigate the AI accuracy problem?

A. Test whether the AI retrieved the right source and whether it used that source correctly
B. Only test a newer model on unrelated marketing examples
C. Ask the AI to explain why it is confident

Part 2: What should the team do with the image?

A. Publish it with creator credit
B. Replace it or get permission for public campaign use
C. Use it only if the AI says the image fits the campaign
```

Correct answers: Part 1 `A`, Part 2 `B`

Why: The first issue is an AI evaluation problem. The second issue is a licensing problem. They should not be collapsed into one long answer choice.

Format: `multi-part scenario`

Artifact required:

- Small campaign asset card with license scope: `Internal training only`
- AI answer-quality review table showing source found vs answer faithful

## Sample 6: Board / Governance Multi-Part Scenario

Source item: `NH-EXECUTIVE-BOARD-D4-REGULATORY-POLICY-ADVANCED-01`

### Before

```text
Scenario: Board needs an oversight recommendation.
Use: assurance reports and approved risk records.
Rule: Management executes controls; the board requires evidence of their effectiveness.
Risk: Assurance gaps can hide material operating risk.
Evidence: Teams interpret the same unresolved exception differently without recording decisions.
Extra leadership cue: Management provides a policy document but no evidence that its controls operate.

Which governance change addresses the documented policy failure? Also apply the profile cue.

A. Test control execution and retain evidence tied to policy requirements; treat policy approval as proof of effective operation.
B. Create an owned exception process with recorded rationale and expiry; request management’s evidence of control effectiveness.
C. Test control execution and retain evidence tied to policy requirements; request management’s evidence of control effectiveness.
D. Create an owned exception process with recorded rationale and expiry; treat policy approval as proof of effective operation.
```

### After

```text
The board is reviewing AI governance.

Management shows a policy document, but there is no evidence that the controls are actually working. Different teams also handle exceptions differently, and no one records who approved each exception or when it expires.

Part 1: What should the board ask management to provide?

A. Evidence that the controls are operating, not just the policy document
B. A longer policy document with more definitions
C. A statement that each team is responsible for itself

Part 2: What process should management fix?

A. Create an exception log with owner, reason, approval date, and expiry date
B. Let each team decide exceptions informally
C. Ask the AI system to approve exceptions automatically
```

Correct answers: Part 1 `A`, Part 2 `A`

Why: A policy is not proof that controls work. Exceptions also need ownership, rationale, and expiry.

Format: `multi-part scenario`

Artifact required:

- Board assurance packet with policy status
- Exception register showing missing owner/expiry fields

## Recommendation

Do not promote the generated draft inventory directly into the live test. Use it as a coverage map, then rewrite approved families into user-facing tasks like the examples above.

Recommended production workflow:

1. Select 200-300 highest-priority draft families.
2. Rewrite them manually or with a strict rewrite agent using this standard.
3. Add realistic artifacts only where they help answer the question.
4. Review each item for clarity, ambiguity, relevance, guessing risk, and scoring.
5. Pilot the rewritten items and retire the generator-style originals.
