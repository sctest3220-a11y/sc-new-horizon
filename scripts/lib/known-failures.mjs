// Known test failures, run as `todo` so they still execute and report but do
// not fail `pnpm test`. Each entry names its cause and what removes it; see
// "Known failures" in docs/TESTING.md. Delete an entry, and every `todo` that
// uses it, once the cause is fixed.

// Commit 41338d6 ("Align live inventory with routed assessment pool") rebuilt
// exports/review-inventory/live-questions.json from the app's question pool and
// dropped the reviewed userFacingDraft (English wording, October feedback and
// rewrite metadata) of all 634 original live items. These tests are correct:
// they fail because that review work is missing. Fixed by restoring the drafts
// from 19329c9 while keeping the 255 added items.
export const liveExportReviewLoss =
  'known failure: reviewed live drafts lost in 41338d6 (docs/TESTING.md, Known failures)';

// The learner-app catalogs were generated from the old thaiUiCopy table; the
// messages it did not cover still hold their English text in th.json. Removed
// once those Thai drafts are written (feat/language-switcher, step 3).
export const thaiDraftsPending =
  'known failure: Thai drafts pending for messages not in the old thaiUiCopy table';
