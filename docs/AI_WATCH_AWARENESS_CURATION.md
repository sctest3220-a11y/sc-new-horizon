# AI Watch awareness stories and embedded source media

Updated: 29 September 2026. Status: implemented in the local app; manually curated editorial snapshot. Not deployed to the inventory-only Cloudflare Worker. No scheduled discovery or autonomous publishing service is connected.

## Standing product requirement

AI Watch should spark awareness of what AI can do, what is changing, and what users need to understand. Include surprising agent activity, emerging collective risks, real-world deployments, and new kinds of models alongside practical workplace stories. Pip on iLands, simulations of agent-driven bank runs, and Jev are examples of the editorial category, not an exhaustive watchlist. Avoid turning the feed into only model release announcements or sensational headlines.

Every story should explain what happened, why it matters to ordinary users, the evidence type and limits, and one useful question or practice action. Distinguish publisher-reported cases, observed events, demonstrations, research simulations, and model announcements. A simulation is not an observed real-world incident. Vendor claims remain attributed claims.

## One story, including its media

Original-source images and videos belong **inside the curated story**, adjacent to its title and independent summary. Do not put the artifacts in a separate media section. Keep the original publisher, source date, credits, canonical link, and supporting references visible. Use publisher-hosted images and approved official video players; preserve aspect ratio and do not download or rehost third-party media. Videos load on explicit user action and do not autoplay. A broken image/player must leave attribution and an original-source link available. If no suitable original media exists, retain the text story rather than inventing documentary evidence.

The local implementation uses `WatchMedia` for both Watch and awareness cards. YouTube embeds are HTTPS, provider-validated, click-to-load players. Direct publisher-video adapters beyond the existing YouTube integration remain future work. Public availability of an image alone is not a license to republish it; editorial media-rights review remains part of hosted release preparation.

## Did you know

The home-page awareness cards select from the same `trendFeed` records as AI Watch. A story opts in through its bilingual awareness hook, evidence kind, and source-check date. Ranking uses the existing Watch interests and excludes hidden topics. Users can select **Another story**, open the source, or explore AI Watch. There is no flashing animation, forced autoplay, or automatic timer. Generic skill-building insights remain available in the same home-page section.

The hooks and controls have English/Thai copy; current news summaries retain explicit English labels until Thai editorial review. Existing local preferences are not a shared account profile. Automatic discovery, freshness expiry, cross-device preferences, authenticated editorial approval, and analytics remain planned services, not claims about the current app.

## Source checks for the initial examples

- [iLands](https://www.ilands.ai/) describes Pip's paid writing commission; [platform documentation](https://ilands.ai/platform) states availability limits. Undated page, checked September 29, 2026. Label: platform-reported case. Pip's avatar is publisher-hosted and credited.
- [Financial Fragility in Societies of LLM Agents](https://arxiv.org/abs/2609.30940), submitted September 25, 2026. Label: research simulation / preprint. Do not present simulated failures as an actual AI-caused bank run.
- [TypeSafe's Jev announcement](https://typesafe.ai/blog/introducing-system-one-models-and-jev), September 15, 2026. Label: model announcement. Typed output does not establish decision correctness. The announcement illustration remains hosted by the publisher's media provider and credited.

## Workflow to build next

Discovery agent → duplicate/source-date checks → evidence classification → media provenance and embed checks → plain-language summary + awareness hook → human editorial review → versioned publication to Watch and Did you know together → correction, expiry, and broken-media monitoring.

Reuse the same story ID and content version across both surfaces. Record source publication/update dates separately from our check date; never relabel an old story as new because it was rediscovered. Optimize for relevance, learning value and verified novelty, with a mix of capabilities and limitations.

Related: [Watch/Labs roadmap](AI_WATCH_LABS_ENGAGEMENT_ROADMAP.md), [local release](AI_WATCH_LABS_LOCAL_RELEASE.md), [agent workflows](AGENT_WORKFLOWS_ORCHESTRATION.md).

## Executable discovery instructions — September 29 follow-up

The manual News Scout now reads `config/ai-watch-discovery.json`, which explicitly includes agent capabilities, collective risks, models/technologies, and everyday impact. Run `npm run crawl:news` or `python3 scripts/crawl-ai-watch.py`. It uses allowlisted feeds/indexes, bounded metadata fetches, robots checks, URL deduplication and metadata-change fingerprints. Original-source media URLs remain unverified leads, never downloaded assets.

Inspect `.agent-drafts/ai-watch/latest.json` for candidate lanes, publication dates (null when unknown), check dates, source references, media leads and failures. No article body, automatic summary or unreviewed teaser is published. The collector is deterministic, not an LLM agent. An editor must verify evidence and media, write an original summary/hook, and add the approved record to `trendFeed` through the normal code review process. Shared queue, scheduled runs and an admin publish action remain unimplemented.

Validation: five offline tests cover URL restrictions, feed/index parsing, deduplication, editorial lanes and metadata-only extraction. The first live run observed six candidates; three arXiv article fetches returned HTTP 406 and were recorded as failures. TypeSafe is monitored through its known announcement page because its blog index yielded no links. This source set is a starter allowlist, not complete web coverage.

Final live verification observed seven candidates, including the Jev announcement, with three arXiv HTTP 406 failures recorded. Repeated runs retained stable candidate IDs without duplicating the six previously seen records; the corrected TypeSafe adapter added one new candidate.

## Interest-first headlines and alternative coverage

Lead with the concrete surprising event and its consequence, then explain why it matters and what the evidence supports. Avoid abstract headlines such as “an agent reaches beyond the chat window.” Do not invent autonomy, motives, consciousness, earnings, or certainty for clicks. Alternative reporting and original publisher videos on the same event are useful editorial candidates, with primary-source references retained.

Pip's revised headline is “An AI agent asked a philosopher for work—and reportedly got paid.” The supplied [CNN video](https://www.youtube.com/watch?v=RTuybvHww7Y) is now the inline click-to-load player; its title and CNN authorship were checked through YouTube metadata, not a full transcript review. The iLands account remains a supporting reference. Pip's avatar has been removed because reuse permission was not established. Do not generate replacement news images. Attribution/hotlinking alone is not reuse permission; use authorized players or licensed/permitted original media, otherwise link only.
