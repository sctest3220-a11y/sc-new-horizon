# Question inventory Cloudflare test

Published September 28, 2026:

https://new-horizon-question-inventory-test.new-horizon-sc.workers.dev

Worker: `new-horizon-question-inventory-test`. Cloudflare version at first publication: `319950fe-2413-451a-b541-34b90dd586c9`.

This is a public, inventory-only technical preview of draft content, not the external feedback pilot described in QUESTION_INVENTORY_REVIEW_TO_HOSTING_PROCESS.md. It contains 3,328 draft and 634 existing inventory questions. Rewrite, translation, rubric, and artifact readiness gates still apply before a formal pilot. Robots indexing is discouraged; there is no authentication or access restriction.

Feedback is stored in browser localStorage on the hosted origin. It is not shared between reviewers, devices, or the localhost site. Download feedback JSON to retain submitted reviews; downloads include release metadata and source hashes, and exclude unsubmitted drafts. No repository feedback files, credentials, or main assessment/admin routes are shipped. The existing managed New Horizon site is separate.

## Build and deploy

From the app directory, with Node >=22.13 and installed dependencies:

```sh
npm run inventory:cloudflare:build
npx wrangler login
npx wrangler deploy --config work/inventory-cloudflare/dist/server/wrangler.json
```

The builder recreates the disposable `work/inventory-cloudflare` directory from an allowlist. It uses Cloudflare's ASSETS binding to load question JSON and standard page navigation for the isolated preview. Do not deploy the main app's `dist/server/wrangler.json` for inventory-only updates. Select the intended Cloudflare account when publishing.

## Verify

```sh
npx wrangler dev --config work/inventory-cloudflare/dist/server/wrangler.json --port 4174
npm run inventory:cloudflare:test
TEST_URL=https://new-horizon-question-inventory-test.new-horizon-sc.workers.dev npm run inventory:cloudflare:test
```

The smoke test uses an isolated browser context, checks question rendering, saved-feedback persistence, JSON export without drafts, Thai navigation, search, visible media, and the absence of `/admin`. Its test feedback is never uploaded to a shared store. Production build and targeted ESLint checks also pass. Baseline inventory TypeScript issues remain outside this hosting task.

Live HTTPS browser verification passed after the new domain finished provisioning: question rendering, saved feedback after reload, JSON export, Thai navigation, question search, `/admin` returning 404, and no browser runtime errors.

The current release metadata is available at `/review-release.json`. Future centralized feedback requires a storage service and reviewer/access model; it is not implemented in this testing deployment.

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

For automatic collection later, use authenticated reviewer submissions to a Cloudflare database, followed by a maintainer-only export/import job or feedback PR. Keep GitHub write credentials out of the browser and public Worker. That database and synchronization job are not part of the current implementation.
