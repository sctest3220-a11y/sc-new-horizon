# Question Inventory: Internal Review to Hosted Feedback Pilot

## Purpose

This document defines the controlled process for reviewing, rewriting, translating, publishing, and collecting feedback on the New Horizon question inventory.

The agreed sequence is:

```text
Internal review -> rewrite -> translation -> artifact and rubric QA
-> rebuild inventory -> freeze a review release -> hosted feedback pilot
-> export feedback -> analyze locally -> approve revisions -> publish a new release
```

The team should not deploy the inventory merely because hosting is available. The first hosted release begins only after the internal content gate is complete.

## Scope of the First Hosted Pilot

The first public-facing deployment contains only the Question Inventory review workspace and its required assets. It does not expose the assessment, score reports, leaderboards, Pilot Operations, Agent Operations, or other unfinished admin surfaces.

The hosted reviewer should support:

- English and Thai review at page and question level
- question, domain, competency, difficulty, format, role, industry, rating, review-count, and decision filters
- 1-5 rating, decision, clarity, artifact, format, comment, and suggested-rewrite fields
- central feedback storage shared across approved reviewers
- feedback history tied to question id, content version, language reviewed, and reviewer/session
- export for local analysis and human-approved rewriting

## Roles

| Role | Responsibility |
| --- | --- |
| Content lead | Selects review scope, resolves conflicting reviews, and approves English question content. |
| Subject-matter reviewer | Checks competency fit, factual accuracy, realism, answerability, distractors, and difficulty. |
| Assessment reviewer | Checks format, rubric, partial credit, scoring purpose, and cognitive demand. |
| Thai language reviewer | Checks natural Thai, meaning equivalence, retained technical terms, and option/rubric alignment. |
| Artifact reviewer | Confirms necessity, relevance, realism, neutrality, readability, accessibility, and answer-key alignment. |
| Release owner | Runs validation, freezes the release manifest, deploys the reviewer, and can roll it back. |
| Feedback analyst | Aggregates trends and proposes changes without directly publishing them. |

One person may hold more than one role in an early pilot, but no generated rewrite or agent recommendation approves itself.

## Phase 1: Prepare the Internal Review Batch

1. Work from `main` and record the starting commit.
2. Select a bounded batch by question family, competency, difficulty, role, or industry.
3. Record every question id and current content hash in the batch manifest.
4. Review sibling variants together so superficial wording changes and repeated evidence patterns are visible.
5. Prioritize live questions, high-exposure families, low-rated questions, incomplete Thai, and questions with required artifacts.

Do not attempt to rewrite all 3,328 variants at once. Use review waves that can be completed, validated, and compared.

## Phase 2: Rewrite and Review English Content

Apply [Question Rewrite Rules](QUESTION_REWRITE_RULES.md). Each candidate must pass:

- natural scenario flow: context before the decision question
- concise wording appropriate to the target role
- enough factual information to answer without guessing the author's intent
- an AI-specific capability, failure, control, or decision rather than generic business judgment
- culturally accessible context for Thai and international users
- answer choices that are distinct and serve the intended format
- a clear best answer for single-choice items
- explicit, purposeful rubric criteria for partial-credit or multi-part items
- difficulty supported by cognitive demand, not vocabulary or sentence length

Preserve the original, latest, and proposed version in question version history. A rewrite does not replace the approved source until a human approves it.

## Phase 3: Format, Rubric, and Artifact QA

1. Confirm that the interaction matches the skill: single choice, multi-select, ranking, matching, multi-part, written response, or artifact inspection.
2. Verify the answer key and calculate every scored path independently.
3. Explain why each option earns its score; do not assign arbitrary partial credit to plausible distractors.
4. Apply [Artifact Design and QA Standard](ARTIFACT_DESIGN_AND_QA_STANDARD.md).
5. Remove an artifact if it does not contain decision-relevant evidence or make the scenario materially clearer.
6. For required artifacts, check fitted view, enlarged view, mobile readability, realism, provenance, and consistency with the question and answer key.

## Phase 4: Translate and Check Equivalence

Translation begins after the English candidate is stable enough to review. It is not a word-for-word cleanup step.

1. Translate the full scenario, prompt, choices, option feedback, rubric, explanation, and artifact text.
2. Retain only approved market-recognizable technical terms such as `AI`, `LLM`, `RAG`, `Prompt`, `Workflow`, `Agent`, and `API` where that improves comprehension.
3. Use natural, simple Thailand Thai and preserve the same evidence, decision, difficulty, and scoring meaning.
4. Run automated mixed-language and missing-field checks.
5. Conduct whole-item human review in both languages.
6. Mark translation status as `draft`, `reviewed`, or `approved`; only reviewed/approved content enters the hosted review release according to pilot policy.

## Phase 5: Rebuild and Validate the Inventory

Regenerate the review assets from approved source rather than manually editing generated public files:

```bash
node scripts/generate-review-inventory.mjs
node scripts/export-live-question-inventory.mjs
node scripts/scan-review-artifact-needs.mjs
node scripts/apply-thai-review-translations.mjs
node --test scripts/test-review-inventory.mjs
node scripts/build-review-inventory-assets.mjs
pnpm lint
pnpm build
```

Before release, verify:

- unique and stable question ids
- expected domain, competency, difficulty, role, and industry counts
- valid answer keys and rubric references
- no orphan translations or artifacts
- no incomplete Thai in the selected release batch
- no stale reviewer draft shown as submitted feedback
- filters, language switches, pagination, feedback reset, and artifact enlargement
- desktop and mobile layout

## Phase 6: Freeze a Hosted Review Release

Create an immutable release manifest containing:

- release id and date
- Git commit SHA
- question-bank and review-inventory versions
- included question ids and content hashes
- English and Thai translation versions/statuses
- rubric and artifact versions
- known limitations
- release owner and approvers

Do not change question text in place after reviewers begin. Material changes create a new version so earlier feedback remains interpretable.

Recommended initial release states:

```text
draft -> internal-review -> review-approved -> hosted-review
-> feedback-analyzed -> revision-approved -> superseded
```

## Phase 7: Add Shared Feedback Storage

The existing deployed build stores feedback only in each browser. Before inviting external reviewers, connect the hosted reviewer to a central database such as Supabase.

Minimum feedback record:

```text
review_id
release_id
question_id
question_content_hash
language_reviewed
reviewer_id or pseudonymous_session_id
rating
decision
clarity_status
artifact_status
format_status
comment
suggested_change
created_at
updated_at
```

Required controls:

- reviewer sign-in or controlled invitation/access code
- row-level access rules and server-side validation
- rate limiting and abuse protection
- privacy notice and consent appropriate to the pilot
- export, retention, deletion, backup, and audit procedures
- no browser-exposed database service-role key
- idempotent submission to prevent duplicate reviews

Local `localStorage` may retain unsaved drafts for convenience, but the shared database is the source of truth for submitted reviews.

## Phase 8: Deploy the Reviewer to Cloudflare

Use Cloudflare Workers because Vinext provides a native deployment path. Deploy a staging environment first, then production after acceptance testing.

Recommended environments:

| Environment | Purpose |
| --- | --- |
| Local | Authoring, rewriting, regeneration, and detailed QA. |
| Staging | Team acceptance test using the frozen release and test feedback records. |
| Hosted review | Approved external reviewers and centrally stored feedback. |

Deployment gate:

- the frozen release passes Phase 5 validation
- central feedback writes and reads work across two separate test accounts/devices
- secrets are server-side
- access control and privacy copy are enabled
- export and rollback have been tested
- only the intended inventory route is discoverable
- assessment/admin prototype routes are blocked or excluded

Cloudflare Free is expected to be sufficient for the initial small review pilot. Cost and usage should still be monitored.

## Phase 9: Collect and Monitor Feedback

Monitor:

- review coverage by question, family, competency, difficulty, role, industry, and language
- rating and decision distribution
- recurring clarity, translation, artifact, rubric, and format issues
- review completion and abandonment
- unusually long review time or repeated artifact enlargement
- reviewer disagreement
- question versions receiving feedback

Feedback is a signal for investigation, not an automatic rewrite instruction. The Feedback Analysis Agent may group themes and draft recommendations, but a human reviews the evidence before any source change.

## Phase 10: Export, Analyze, and Rewrite Locally

1. Freeze the feedback export with export id, date, release id, and row count.
2. Import the JSON or CSV snapshot into the local analysis workflow.
3. Separate content defects from reviewer preference and isolated comments.
4. Compare low-rated items with sibling variants, timing, language, artifact, and decision data.
5. Draft proposed English, Thai, rubric, format, or artifact changes.
6. Review before/after versions side by side.
7. Approve, revise, reject, or defer each proposal.
8. Update canonical source and append version history.
9. Rebuild and validate a new release; never alter the historical feedback snapshot.

## Minimum Gate Before Hosting

The team is ready to begin the hosted feedback pilot when:

- the initial review batch is intentionally scoped
- English questions and answers pass human content review
- Thai translations pass whole-item equivalence review
- rubrics and artifacts pass their respective standards
- inventory generation and automated checks pass
- the release manifest is frozen
- shared feedback storage, identity/access, export, and rollback work
- privacy, retention, and reviewer instructions are published
- a named owner is available during the pilot

## Related Documents

- [Review the question inventory locally](QUESTION_INVENTORY_LOCAL_REVIEW.md)
- [Question Inventory Milestone](QUESTION_INVENTORY_MILESTONE.md)
- [Question Rewrite Rules](QUESTION_REWRITE_RULES.md)
- [Artifact Design and QA Standard](ARTIFACT_DESIGN_AND_QA_STANDARD.md)
- [Localization](LOCALISATION.md)
- [Deployment Notes](DEPLOYMENT.md)
- [Legal, Privacy, PDPA, and Terms Requirements](LEGAL_PRIVACY_PDPA_TERMS.md)
- [Agent Workflows and Orchestration](AGENT_WORKFLOWS_ORCHESTRATION.md)
