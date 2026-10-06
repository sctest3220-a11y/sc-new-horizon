# Rewrite and Translation Sandbox Workflow

Status: operating process for the draft review sandbox  
Owner: Content and Localization Review  
Version: `1.0`  
Last updated: 3 October 2026

This process keeps a new question rewrite or translation reviewable without changing the scored live assessment. The sandbox is generated from versioned JSON exports, while reviewer decisions and the live bank remain separate.

## Source-of-truth boundaries

- `inventory/build-bank.mjs` defines generated draft-question structure and the rewrite metadata.
- `exports/review-inventory/questions.json` is the versioned draft inventory export. It contains the current English rewrite candidate and its `inventoryVersion`.
- `exports/review-inventory/live-questions.json` is the separately exported 634-item live bank. Do not overwrite it with draft rewrites.
- `exports/review-inventory/question-version-history.json` is the append-only comparison record for material question changes.
- `app/questionTranslations.th.ts` is generated translation output for the assessment bank; do not hand-edit it.
- `public/review-inventory/` is generated sandbox data. Rebuild it; do not edit individual detail files.
- `exports/review-feedback/` and the feedback API store reviewer decisions separately from question content.

The sandbox may show `draft`, `reviewed`, and `approved` content, but only explicitly promoted and versioned content may enter the scored assessment.

## Version identifiers

Use `YYYY-MM-DD.N` for each material rewrite or translation release, for example `2026-10-03.1`. Increment `N` for another release on the same date. A material change includes a changed scenario, prompt, answer choice, key, rationale, format, evidence, or translation meaning. Punctuation-only corrections may retain the content version if meaning is unchanged.

Record the same version in:

1. `exports/review-inventory/questions.json` as `inventoryVersion`.
2. Each rewritten question's `userFacingDraft.rewriteVersion`.
3. `question-version-history.json`, with source commit, parent version, reviewer decision, and rationale.
4. The release manifest generated for a hosted preview, which also records source commit and content hashes.

Translation-only changes must still identify the affected source rewrite version. If the English construct, evidence, key, or difficulty changes, create a new question content version rather than silently updating Thai.

## A. Export a new rewrite batch

Start from a clean, intentional branch and confirm the current state:

```sh
git status --short
git log -1 --oneline
```

Generate the draft inventory from the platform model:

```sh
node scripts/generate-review-inventory.mjs
node scripts/test-review-inventory.mjs
```

Export the review workbook when spreadsheet review is needed:

```sh
node scripts/export-review-inventory.mjs
```

The generated workbook is written under `outputs/new-horizon-review-inventory/`. Treat it as a review surface, not as the canonical source. Before distributing it, record the inventory version and the source commit in the review notes.

Export the unchanged live bank for comparison when required:

```sh
node scripts/export-live-question-inventory.mjs
```

Do not combine the live export into the draft JSON. The sandbox builder combines them only for display and labels the source explicitly.

## B. Rewrite and review English

Rewrite only the selected question IDs. Preserve the question ID when the item remains the same construct; create a new ID only when it is a genuinely new item. Add or update:

- `userFacingDraft.rewriteVersion`
- `userFacingDraft.rewriteReviewStatus` (`pending-human-audit`, `reviewed`, `approved`, `rejected`)
- the scenario, prompt, options, key, explanation, and rewrite notes

Use the rules in [Question Rewrite Rules and Versioning](QUESTION_REWRITE_RULES.md). A human reviewer must check the key, construct, difficulty, realism, answerability, artifacts, and strongest case for every distractor. Do not set `approved` merely because the text is fluent.

Append a comparison entry to `exports/review-inventory/question-version-history.json` containing:

- question ID, new version, and parent version;
- changed fields and the reason for change;
- English and Thai review status;
- reviewer, date, and source commit;
- decision: `prefer`, `revise`, `hold`, or `reject`.

Rejected and superseded versions remain in the history. They are never deleted to make the current version look cleaner.

## C. Retranslate or translate the new rewrite

Translate the complete item, not just the prompt:

- context and prompt;
- every option, part, pair, rank label, and feedback field;
- explanation and rewrite notes shown to reviewers;
- artifact labels, captions, and visible text when the item uses an artifact.

Keep option IDs, scoring keys, evidence, competency, and difficulty language-independent. A translation must not change the answer or make the Thai version easier.

For the assessment bank, use the bilingual workbook and apply reviewed output with the repository's translation workflow. For the draft inventory, the translation fields are carried on `userFacingDraft.th` and are surfaced in the sandbox. Use the completeness QA output at `exports/review-inventory/thai-translation-qa.json`; an item with missing or mixed-language required fields remains unavailable for approved Thai release.

Recommended status sequence:

1. `draft`: machine-assisted or non-native translation.
2. `reviewed`: native reviewer confirms meaning, naturalness, terminology, and an unambiguous key.
3. `approved`: second reviewer or the documented spot-check gate passes.

The default Thai assessment must not expose partial or unapproved content. The sandbox may expose it only when clearly labelled for review.

## D. Rebuild and review the sandbox

Build the static review assets after changing the source exports:

```sh
node scripts/build-review-inventory-assets.mjs
```

This creates `public/review-inventory/summary.json`, `index.json`, and one detail JSON per question. The index includes filters for:

- inventory/content version and source (`draft` or `live`);
- rewrite version and rewrite review status;
- Thai translation availability/status;
- domain, difficulty, layer, format, role, industry, executive role, and search text.

Run the local sandbox:

```sh
pnpm dev
```

Open `/admin/question-inventory` and verify the new version with:

1. `Source = draft` and the target `Rewrite version`.
2. `Rewrite review = pending-human-audit` or the intended status.
3. `Translation = Thai translation available` when applicable.
4. `Version` set to the target inventory version.
5. `Source = live` in a separate pass to confirm the live bank is still unchanged.

Review both language panes on representative items, including multi-part, ranking, matching, select-all, written-response, and artifact items. Save reviewer feedback through the page; do not edit generated JSON to record a decision.

## E. Validate before sharing or hosting

Run the focused checks:

```sh
node scripts/test-review-inventory.mjs
node scripts/test-inventory-release.mjs
pnpm typecheck
pnpm build
```

If the hosted inventory preview is required:

```sh
node scripts/build-inventory-cloudflare.mjs
node scripts/test-inventory-cloudflare.mjs
```

The hosted preview release manifest must show the source commit, inventory version, content hash, and a non-clean/dirty marker when the build was not made from a clean commit. Never describe a dirty preview as a release candidate.

Before opening a PR, inspect the change set:

```sh
git diff --stat
git diff -- exports/review-inventory/questions.json exports/review-inventory/question-version-history.json
git status --short
```

The PR must include regenerated exports and assets, version-history changes, translation QA output when applicable, and any changed Thai artifact assets. It must state the exact sandbox URL or local route and the filters reviewers should use.

## F. Promotion and rollback

Promotion requires human approval of the exact version and translation status. The approval must reference the commit and version, not only a question ID. The live assessment is updated in a separate change after sandbox review; sandbox approval does not automatically publish content.

To roll back a candidate, select the prior preferred version in the version history and rebuild from that committed source. Do not delete the candidate or rewrite history. A rollback should leave the rejected candidate, review feedback, release manifest, and reason auditable.

## Release checklist

- [ ] Draft export has a new `inventoryVersion`.
- [ ] Each material rewrite has `rewriteVersion` and a parent in version history.
- [ ] English key, construct, difficulty, and artifact evidence were reviewed.
- [ ] Thai fields are complete and status is recorded.
- [ ] Sandbox assets were rebuilt from the exported JSON.
- [ ] New rewrite-version and translation filters return the expected set.
- [ ] Live-source comparison shows no unintended changes.
- [ ] Focused tests, typecheck, and build pass.
- [ ] Reviewer feedback is stored separately from content exports.
- [ ] PR/release notes identify commit, version, filters, and approval decision.
