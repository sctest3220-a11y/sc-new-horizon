# Review the question inventory locally

This guide is for collaborators who want to review the New Horizon question inventory on their own computer. The inventory reviewer is part of the main repository; it is not a separate repository or package.

The review page shows both banks:

- 3,328 draft review questions from `exports/review-inventory/questions.json`
- 634 current live assessment questions from `exports/review-inventory/live-questions.json`

Use the `main` branch. References to the older `Lufy-branch` inventory milestone are obsolete.

## Requirements

- Git
- Node.js 22.13 or later
- pnpm through Corepack, or an existing pnpm installation

No Supabase account, API key, or environment file is required to run the local question reviewer.

## Recommended: clone and run the repository

The repository is small, so a normal clone is the least error-prone option.

```bash
git clone https://github.com/sctest3220-a11y/sc-new-horizon.git
cd sc-new-horizon
git switch main
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open:

```text
http://localhost:3000/admin/question-inventory
```

For Thai review:

```text
http://localhost:3000/admin/question-inventory?lang=th
```

If port 3000 is already in use, choose another port:

```bash
pnpm dev -- --port 3002
```

Then open `http://localhost:3002/admin/question-inventory`.

For a production-style local check:

```bash
pnpm build
pnpm start -- --port 3002
```

## Smaller checkout: inventory reviewer only

Use Git sparse checkout when the collaborator does not need the assessment homepage, documentation library, source-generation scripts, or other application files.

```bash
git clone --filter=blob:none --no-checkout https://github.com/sctest3220-a11y/sc-new-horizon.git sc-new-horizon-inventory
cd sc-new-horizon-inventory
git sparse-checkout init --no-cone
git sparse-checkout set \
  /package.json \
  /pnpm-lock.yaml \
  /pnpm-workspace.yaml \
  /next.config.ts \
  /vite.config.ts \
  /tsconfig.json \
  /eslint.config.mjs \
  /app/layout.tsx \
  /app/globals.css \
  /app/admin/question-inventory/ \
  /scripts/build-review-inventory-assets.mjs \
  /scripts/lib/review-feedback-sync-plugin.mjs \
  /exports/review-feedback/ \
  /exports/review-inventory/questions.json \
  /exports/review-inventory/live-questions.json \
  /exports/review-inventory/artifact-needs.json
git checkout main
corepack enable
pnpm install --frozen-lockfile
pnpm dev -- --port 3002
```

Open `http://localhost:3002/admin/question-inventory`.

The **Back to assessment** link will not work in this reduced checkout because the assessment homepage is intentionally excluded. The question inventory itself, filters, language controls, ratings, and local comments still work.

To pull later inventory updates:

```bash
git pull --ff-only origin main
```

The sparse-checkout selection remains active after pulling.

## Data-only checkout

Collaborators who only need JSON, CSV, Markdown, or the review workbook do not need Node.js or a local server:

```bash
git clone --filter=blob:none --no-checkout https://github.com/sctest3220-a11y/sc-new-horizon.git sc-new-horizon-inventory-data
cd sc-new-horizon-inventory-data
git sparse-checkout init --cone
git sparse-checkout set exports/review-inventory
git checkout main
```

Important files include:

- `questions.json`: draft questions and machine-assisted Thai reviewer fields
- `live-questions.json`: current live assessment questions
- `artifact-needs.json`: question-level artifact recommendations
- `artifact-family-backlog.csv`: reusable artifact-production backlog
- `thai-translation-qa.json`: likely untranslated or mixed-language fragments
- `new-horizon-3328-review.xlsx`: offline review workbook

## How local feedback works

Ratings, decisions, comments, and suggested rewrites entered on the review page are stored in that browser's `localStorage`, under keys beginning with `new-horizon-review:`.

While the page is served by `pnpm dev`, the **Reviewer feedback file** panel above the review filter also writes that feedback into the repository, at `exports/review-feedback/<git user.name>.json` (for example `exports/review-feedback/kj-dee.json`). Every rating change and saved comment is written about a second later; **Sync now** forces a write. When the page loads it first pulls that file back into the browser, so a review continues on another machine or after browser data is cleared as long as the file was committed. Saved comments are merged by id and never dropped; the current draft comes from the browser.

The panel reads **Repo sync unavailable** under `pnpm start` or a deployed build, because there is no dev server to write the file. Feedback then stays in the browser only.

To share a review, commit and push the file on your own branch, for example:

```bash
git add exports/review-feedback/
git commit -m "Review feedback: <what was covered>"
git push origin <your-branch>
```

Clicking **Save comment** does not submit anything to GitHub or to the project owner by itself. Central review collection still requires the planned hosted reviewer with a shared database. Do not commit generated question changes directly unless the project owner has approved the revised source and regeneration workflow.

## Updating and troubleshooting

Confirm the current branch and revision:

```bash
git status --short --branch
git log -1 --oneline
```

If dependencies have changed after a pull:

```bash
pnpm install --frozen-lockfile
```

If the page does not open, check the terminal for the port printed by Vinext. A `404` at `/assessment` is expected because the assessment is served at `/`; the inventory route is `/admin/question-inventory`.

Thai content is currently machine-assisted and still requires human localization review. Reviewers should flag incomplete translation, mixed Thai/English phrasing, changed meaning, or answer choices that no longer match the English question.
