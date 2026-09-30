# AI Watch and Connected Labs: Local Release

Release reference: `watch-labs-local-v1`, 28 September 2026. Workspace implementation; not deployed.

## Available experience

- Open AI Watch from primary navigation or `/?view=watch`.
- Choose up to three interests, available time, and a goal. The deterministic ranker uses only these explicit preferences, offers a three-story edition with room for exploration and media variety, and explains recommendations. It does not infer weaknesses from unassessed domains.
- Switch between For you, Explore, and Saved. Topic mutes are hard filters for For you and Explore. Saved items remain visible regardless of topic/format filters; unavailable bookmarks have an explicit removal control.
- Read the existing English editorial brief, inspect a bilingual evidence-checking cue, and open the original source. The UI labels the content as a manually curated snapshot, not fresh automated discovery.
- Load supported YouTube players explicitly; loading is optional, autoplay is off, and the publisher link remains available. Source preview images keep their existing attribution and disappear cleanly on load failure.
- Open AI Labs from primary navigation or `/?view=labs`. Two connected starter Labs provide complete English/Thai scenarios, two decisions, criterion-specific feedback, revision, optional notes, and saved takeaways.
- Primary navigation remains available on narrow screens. Watch/Labs URLs follow navigation so refresh restores the current destination.
- Follow a story to a Lab and return to the same story with filters retained and source detail expanded.
- Resume Lab work after leaving the page or reloading. The Lab home shows saved takeaways and links to older practice samples.

The two new Labs are fictional practice scenarios: agent approval boundaries and checking a broad AI claim against a bounded evaluation sample. They do not modify the scored question inventory. Their rules evaluate explicit decisions, not the wording of a free-text reflection.

## Persistence and identity

Storage key: `new-horizon-watch-labs-v1:<ownerId>`, where owner ID is the signed-in preview profile ID or existing local profile ID. The component remounts when that identity changes, avoiding accidental reuse of one identity's in-memory learning state for another.

The record contains versioned preferences, saved story IDs, the current feed/filter, active Lab/origin story, and versioned Lab drafts with answer IDs, notes, feedback state, and saved-takeaway state. Parsing limits lengths, accepts known enum values, and recovers from corrupt/unknown-version data. Unknown saved IDs are retained as unavailable bookmarks.

This is browser-local storage, not secure server authorization. Browser users can inspect it. The UI explains the scope, offers a confirmed clear action, and warns when storage is unavailable. There is no account sync, server analytics, AI-provider call, notification delivery, or shared review store in this release.

## Content and workflow boundaries

Every existing Watch item now has an explicit stable ID, content version, topic, and an optional related Lab ID. These fields prepare for versioned editorial records; they are not proof of a new editorial approval or a successful source scan. Existing source titles, dates, URLs, summaries, and media are preserved.

The shared workflow remains the next roadmap phase: source registry, discovery records, human reviews tied to exact versions, publication/withdrawal records, and freshness monitoring. The existing Admin Agent Ops remains a simulation. New Labs are local starter practice pending human pilot review before hosted release.

The misleading preferred-cadence control has been removed from Watch. Actual notification preferences should be introduced when delivery exists; scanning frequency is an admin concern.

The older prompt sample now describes English keyword matches as checklist cues, rather than displaying them as a writing-quality score. Its model-answer button is labeled as an example, not as live generation.

## Language and accessibility

The new component owns its EN/TH interface and Lab text through React. `data-no-translate` prevents the legacy DOM translation pass from rewriting its text or accessibility attributes. English editorial source text remains explicitly marked as English, with a Thai availability notice instead of an unreviewed translation.

Native fieldsets/radios/selects, pressed-state buttons, focus handoff, visible keyboard outlines, optional video loading, source fallback links, and responsive layouts are included. A full assistive-technology and human Thai-language audit remains a hosted-pilot requirement.

## Verification

- `pnpm test:watch-labs` (12 tests): storage recovery, stable content IDs, hard preference filters, saved-item access, ranking reasons/diversity, time-fit claims, criterion evaluation, version invalidation, bilingual completeness, and video URL restrictions.
- Local browser checks: reload persistence, topic mute/restore, story-to-Lab return, draft recovery, both rubrics, saved takeaways, EN/TH switching, click-to-load media, empty states, corrupt/disabled storage, and responsive widths.
- Production build and lint; compare TypeScript diagnostics against the pre-change baseline rather than hiding existing errors.
- Question-bank export/integrity check to ensure the separate assessment inventory remains unaffected.

Verified for this local release: all 12 focused tests passed; full lint and the production build passed; browser flows passed at 1280, 768, 390, and 320 pixels with no application runtime or hydration errors. All 660 questions in the combined export match the prior commit, IDs are unique, and translation IDs resolve. TypeScript still reports the same 28 pre-existing diagnostics; no new diagnostics were introduced. Third-party video playback itself was not tested against live publisher services; the checks cover optional player loading, URL restrictions, and the fallback path.

## Files

- `app/watch-model.ts`: content/preferences contracts, parser, deterministic selection, video URL validation.
- `app/connected-labs.ts`: bilingual versioned practice content and criterion evaluation.
- `app/watch-labs.tsx` and `app/watch-labs.css`: connected experience.
- `app/page.tsx`: navigation, existing editorial items, identity/language handoff, legacy prompt-feedback labeling.

See the [roadmap](AI_WATCH_LABS_ENGAGEMENT_ROADMAP.md) for subsequent workflow, shared persistence, retention, and multimodal phases.
