# 5. AI Watch and AI Labs


AI news and practice exercises, separate from the scored assessment. Both are a local release (`watch-labs-local-v1`, 28 September 2026): they run with `pnpm dev`, but no workflow deploys them. The plan is in `docs/AI_WATCH_LABS_ENGAGEMENT_ROADMAP.md`, the built slice in `docs/AI_WATCH_LABS_LOCAL_RELEASE.md`, story rules in `docs/AI_WATCH_AWARENESS_CURATION.md`, and planned LLM costs in `docs/AI_WATCH_API_COSTS.md`.

## Intended product

The journey is **discover → understand → practise → save a useful result → return**. Watch is the entrance, Labs the practice, and the assessment an optional baseline; neither needs an assessment first.

- **Watch**: a small personalised edition of AI stories across agent capabilities, collective risks, new models and everyday impact. Each story gives what happened, why it matters, the evidence type and its limits (reported case, observed incident, demonstration, simulation, preprint or vendor claim), and one practice action. Planned pipeline: discovery agent → duplicate and source-date checks → evidence classification → media provenance checks → summary and "Did you know" hook → human editorial review → versioned publication → correction, expiry and broken-media monitoring. Later formats: original visuals and an audio brief.
- **Labs**: 3–15 minute exercises linked to stories, in the order brief → inspect → attempt → feedback → revise → takeaway, with resume, skill series and opt-in reminders. Free-text answers would be checked by a bounded LLM evaluator with a versioned rubric. Lab progress never counts as assessment readiness.

## What is built

| | Built | Not built |
|---|---|---|
| Watch (`app/watch-labs.tsx`, `app/watch-model.ts`, `app/watch-labs.css`) | For you / Explore / Saved tabs. Optional setup: up to 3 interests, time budget, goal. A deterministic ranker (no AI) picks a 3-story edition with one exploratory pick and media variety, and shows the reason. Topic mutes are hard filters. Saved items ignore filters; unknown saved IDs show as unavailable with a remove button. Click-to-load YouTube players, no autoplay, publisher link kept (`app/watch-media.tsx`). Stories link to a related Lab and back, keeping filters. | Automatic discovery feeding the app, editorial queue, publish/withdraw, freshness expiry, Thai story summaries (marked English with a Thai notice), digest or notification delivery (the misleading cadence control was removed). |
| Did you know (`app/watch-awareness.tsx`, imported as `AwarenessFlash`) | Home-page cards drawn from the same `trendFeed` stories that have a bilingual `awareness` hook, ranked by the Watch interests, excluding muted topics. "Another story" button, no timer or animation. | Shared publication with Watch through a real pipeline. |
| Labs (`app/connected-labs.ts`) | Two bilingual EN/TH fictional Labs, `agent-boundaries` and `evidence-check` (4 minutes each). Each has two multiple-choice decisions, per-answer feedback, revision, optional notes and a saved takeaway; rules grade the decisions, never the notes. The 7 older Labs (`labConfigs`, kinds `ownership`, `proof`, `next`, `prompt`, `media`, `workflow`, `trust`; graded by `evaluateLab`, opened by `startLabActivity`) still exist. | LLM grading of written answers. The old `prompt` Lab only matches English keywords, so the UI calls them "checklist cues" and the model answer "an example". Human pilot review before hosting. |

Navigation: primary nav links to `/watch` and `/labs` (internally `step` `'news'` and `'learningLabs'`); an older Lab opens at `/labs/<kind>`. Old `/?view=watch` and `/?view=labs` links redirect. The dashboard also shows `dashboardNews`, filtered by weak domains and profile tags, falling back to the first 4 `trendFeed` items.

## Where the data comes from

- **Stories**: about 34 entries hand-written into `trendFeed` in `app/learner-app.tsx` (search `const trendFeed`). Each has `id`, `contentVersion`, `topic`, optional `relatedLab` and `awareness` hook, title, summary (`signal`), source, date, URL, domain, media type and references. Publishers include Anthropic, Google DeepMind, OpenAI, Epoch AI, Axios, Stanford HAI, METR, NHTSA, Waymo, RoboCup, Microsoft WorkLab, an arXiv preprint, CNN, South China Morning Post and Google Korea (YouTube). Dates run from May to 25 September 2026; a few say only "2026", and the Pip story says its publication date is unverified. Source checks were manual, on 29 September. The stories are real but a frozen snapshot: changing them means editing code and going through review.
- **Media**: images and videos are hotlinked from publishers, never downloaded. Pip's avatar was removed because reuse permission was not established. Never generate news images.
- **Labs**: hand-written in `app/connected-labs.ts` and `labConfigs`, separate from the question bank.
- **User state**: browser `localStorage` key `new-horizon-watch-labs-v1:<ownerId>` (signed-in profile ID or local profile ID): preferences, saved story IDs, current feed and filter, active Lab and origin story, Lab drafts and takeaways. Parsing limits lengths and recovers from corrupt or unknown-version data. The component remounts when the identity changes. No account sync, server analytics or AI calls.
- **Discovery crawler (does not feed the app)**: `scripts/crawl-ai-watch.py` (`pnpm crawl:news`) reads `config/ai-watch-discovery.json`. Sources: Hugging Face blog RSS, arXiv cs.AI RSS, two iLands pages, and the TypeSafe Jev announcement page. It sorts candidates into four lanes (agent-capabilities, collective-risks, models-and-technologies, everyday-impact) by keyword, with robots checks, URL dedupe and metadata fingerprints. It keeps metadata only, no article text or summary, and uses no LLM. Output: `.agent-drafts/ai-watch/latest.json`. `.github/workflows/ai-watch-discovery.yml` runs it daily at 02:23 UTC and uploads the JSON as an artifact kept 30 days, reporting "Published: 0". arXiv article fetches returned HTTP 406 on the first live runs. An editor must still write a summary and add it to `trendFeed` by hand.
- **Planned LLM**: DeepSeek Flash for classification, summaries and first-pass translation, Qwen for Thai if better; estimated $7–30 a month for about 12,000 articles (200 per scan, 2 scans a day). Not set up. Keys must stay server-side.
- `scripts/crawl-ai-training.mjs` (`pnpm crawl:training`) is a separate Playwright crawler of AI course pages (Microsoft Learn, DeepLearning.AI, Google Cloud, AWS), unrelated to Watch.

## Tests

- **`scripts/test-watch-labs.mjs`**, run by `pnpm test:watch-labs`: 18 tests
  covering
  - storage recovery and field-by-field fallback;
  - stable IDs;
  - filters, the explore feed and ranking;
  - Lab evaluation;
  - bilingual completeness;
  - video URL rules;
  - awareness teasers.
- **`app/watch-labs.test.tsx`**, run by `pnpm test:components`: 10 component
  tests covering
  - loading, then restore;
  - per-owner isolation;
  - saving;
  - the three-interest limit;
  - corrupt and unavailable storage;
  - Thai copy;
  - switching to Labs;
  - `data-no-translate`.
- **`scripts/test-crawl-ai-watch.py`**: offline crawler tests.

All three run in `pnpm test` and in CI (`.github/workflows/test.yml`). Both
model files are above the 90% floor on lines, branches and functions.

`app/watch-model.ts` and `app/connected-labs.ts` have no runtime imports except
type imports of each other, and only TypeScript that Node can strip. The test
imports them directly, so importing React, `app/learner-app.tsx` or any other module
from them, or using an enum, breaks the suite.

