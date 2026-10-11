# Question inventory Cloudflare test

Published September 28, 2026:

https://new-horizon-question-inventory-test.new-horizon-sc.workers.dev

Worker: `new-horizon-question-inventory-test`. Cloudflare version at first publication: `319950fe-2413-451a-b541-34b90dd586c9`.

This is a public, inventory-only technical preview of draft content, not the external feedback pilot described in QUESTION_INVENTORY_REVIEW_TO_HOSTING_PROCESS.md. It contains 3,328 draft and 634 existing inventory questions. Rewrite, translation, rubric, and artifact readiness gates still apply before a formal pilot. Robots indexing is discouraged; there is no authentication or access restriction.

Submitted feedback is stored in the hosted D1 database, keyed by content fingerprint and question ID. Browsers also retain a local export copy. Download feedback JSON combines current hosted reviews with saved browser archives, includes release metadata and source hashes, and excludes unsubmitted drafts. The preview remains public; reviewer aliases are not authenticated identities. No repository feedback files, credentials, or main assessment/admin routes are shipped. The existing managed New Horizon site is separate.

## Build and deploy

From the app directory, with Node >=22.13 and installed dependencies:

```sh
npm run inventory:cloudflare:build
npx wrangler login
npx wrangler deploy --config work/inventory-cloudflare/dist/server/wrangler.json
```

The builder recreates the disposable `work/inventory-cloudflare` directory from an allowlist, type-checks that isolated application, and builds the Worker and static assets. Do not deploy the main app's `dist/server/wrangler.json` for inventory-only updates. Select the intended Cloudflare account when publishing. Apply `app/api/results/schema.sql` to the bound D1 database before publishing; the workflow does this with idempotent `CREATE TABLE/INDEX IF NOT EXISTS` statements.

## Verify

```sh
npx wrangler dev --config work/inventory-cloudflare/dist/server/wrangler.json --port 4174
npm run inventory:cloudflare:test
TEST_URL=https://new-horizon-question-inventory-test.new-horizon-sc.workers.dev npm run inventory:cloudflare:test
```

The smoke test uses an isolated browser context and local D1 database. It checks question rendering, saved-feedback persistence, JSON export without drafts, Thai navigation, search, visible media, and the absence of `/admin`. Run it locally rather than against the shared preview because it writes test feedback. The isolated inventory application must pass TypeScript before bundling.

Live HTTPS browser verification passed after the new domain finished provisioning: question rendering, saved feedback after reload, JSON export, Thai navigation, question search, `/admin` returning 404, and no browser runtime errors.

The current release metadata is available at `/review-release.json`. Centralized feedback uses D1; authenticated reviewer access remains future work.

## Updates from collaborators

The source repository is `sctest3220-a11y/sc-new-horizon`. `.github/workflows/question-inventory.yml` checks relevant pull requests and deploys relevant changes merged to `main`. It does not publish from a pull request. Contributors must commit the updated inventory exports consumed by the page (`exports/review-inventory/questions.json`, `live-questions.json`, and `artifact-needs.json`) and any referenced `public/stimuli` files. Editing rewrite planning documents alone will not update the served questions.

Before automatic deployment can operate, merge the workflow and its scripts, then configure the GitHub environment **inventory-testing**:

- Secret `CLOUDFLARE_API_TOKEN`: a Cloudflare API token scoped to the intended account with **Account / Workers Scripts / Edit** and **Account / Account Settings / Read**. Do not commit or paste the token into chat. The local Wrangler OAuth login is not a CI credential.
- Variable `CLOUDFLARE_ACCOUNT_ID`: `523a5c58c95fda20827f0f044eb069ce`.
- Restrict environment deployments to `main`. Enable a reviewer requirement only if you want a manual approval before each deployment.
- In repository rules, require the workflow's `verify` job before merging inventory PRs. These settings are account configuration, not activated merely by adding this file.

GitHub environment settings: https://github.com/sctest3220-a11y/sc-new-horizon/settings/environments

Actions: https://github.com/sctest3220-a11y/sc-new-horizon/actions

Use **Run workflow** on `main` for an explicit redeploy. Concurrent production workflows are serialized, and a queued commit is skipped if it is no longer the current main commit. A failed build/test never reaches the deployment job; a failed post-deploy version check requires inspecting the active Cloudflare deployment. Feedback-only commits do not trigger deployment.

## Release and rollback controls

Each build regenerates assets instead of trusting cached filesystem timestamps. It fingerprints rendered question data and media, embeds the Git commit, marks local uncommitted builds as dirty, and shows the release in the feedback panel. `/review-release.json` contains the complete manifest. Feedback storage is separated by the content fingerprint, so rewritten questions never silently inherit reviews from an earlier version. Old-version saved reviews remain downloadable. An old open tab exports its embedded release identity and checks for updates when focused.

The Actions run retains the tested bundle and release manifest for 90 days. Cloudflare records Worker versions in **Workers & Pages → new-horizon-question-inventory-test → Deployments**. For a rollback, choose the previous known-good version there or use:

```sh
pnpm exec wrangler rollback <CLOUDFLARE_VERSION_ID> --name new-horizon-question-inventory-test
```

Verify `/review-release.json` afterward. A later merge to `main` will deploy again; revert/fix the source commit as well if the rollback must persist. A Worker version ID is different from our content fingerprint/release ID. See Cloudflare's [rollback documentation](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/).

## Bringing reviewer feedback into the repository

There is **no automatic cloud-to-repository sync** in this deployment. The reviewer enters a name/alias, selects **Download feedback JSON**, and sends you the file. Run from the app repository:

```sh
node scripts/import-inventory-feedback.mjs /path/to/inventory-feedback-2026-09-28.json tester-alias
```

This produces `exports/review-feedback/cloudflare/tester-alias.json`. Inspect its diff and submit it in a feedback PR. Use the same alias for repeat imports from the same reviewer. The importer validates the export, deduplicates entry IDs per question version, refuses conflicting edits to an existing entry, omits drafts, and never changes question content. It does not inject old reviews into the local dev sync store. Pre-versioning downloads and browser entries are retained as **legacy-unversioned**, because their exact reviewed version cannot be proven. The browser's declared reviewer name is informational, not authenticated identity; the import alias is assigned by the maintainer.

This repository is public: inspect review text and remove private information before committing. Review decisions remain feedback until a collaborator explicitly updates the question source and merges a rewrite PR.

Hosted collection now uses the Cloudflare database. A maintainer-only automatic export/import job and authenticated reviewer submissions remain future work. Keep GitHub write credentials out of the browser and public Worker.

## Main-branch CI repair — 2026-10-11

The merge left `previousVersionById` referenced but undeclared, causing an HTTP 500 whenever a question rendered. Restore the previous-version assets and lookup, use the selected snapshot's detail directory, and keep 20 questions per page. The earlier one-question workaround did not address the cause.

The review form also posted `question_feedback` to an API that only stored assessment results. The API now stores and reads version-scoped feedback separately, and the form reports success only after persistence succeeds. Exports read the hosted entries and preserve legacy browser archives.

The release builder now runs TypeScript before bundling. The browser smoke test covers a full page, save/reload, feedback access from a fresh browser, version isolation, exports without drafts, Thai navigation, search, saved snapshots, media, and the absent `/admin` route. Run it against a local Worker/database; it writes test feedback. Wrangler uses polling in CI to avoid exhausting file watchers.
