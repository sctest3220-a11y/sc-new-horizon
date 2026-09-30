# AI Watch, AI Labs, and Agent Workflows

See [awareness curation and embedded source media](AI_WATCH_AWARENESS_CURATION.md) for the September 29 requirement and local implementation: shared Watch/Did you know stories, evidence labels, and media embedded within each story.

Status: First local slice implemented as `watch-labs-local-v1`; later phases remain proposed. Not approved for hosted release.
Prepared: 28 September 2026.
Scope: Give users recurring value while the assessment question refresh proceeds separately.

## Product direction

Make New Horizon a place to understand a useful AI development, try the related skill, and return to build on it. AI Watch is the discovery entrance; AI Labs is the practice destination; assessment provides an optional diagnostic baseline. Visitors should not have to complete an assessment to use Watch or begin a starter Lab.

The intended journey is:

**Discover → understand → practise → save a useful result → return for the next step.**

A small, relevant edition with one achievable practice action is the first design hypothesis. Success means people return and do something useful, not merely spend longer scrolling. This is a hypothesis to validate with a pilot, not a predicted retention lift.

## Baseline before implementation, checked against source

The following table records the starting point. See [the local release notes](AI_WATCH_LABS_LOCAL_RELEASE.md) for the first implemented slice: personalized Watch, saved stories, two bilingual connected Labs, and local recovery. Shared agents and publishing remain future work.

| Area | Present today | Gap to address |
| --- | --- | --- |
| Watch | Static `trendFeed` in `app/page.tsx`; articles, videos, shorts, publisher images, some YouTube embeds, media filters, source links, relevance notes | Main feed does not rank by the individual's interests; no durable editorial queue or discovery service |
| Personalization | Dashboard filters stories using weak domains and profile tags | Main feed lacks preference controls, reasons, saved items, and explicit negative feedback; evidence eligibility needs checks |
| Cadence | Daily/weekly/monthly React state and copy describing a preferred cadence | No scheduled job or delivery; the current setter does not persist the preference despite the copy saying it saves |
| Labs | Seven static kinds: prompt, proof, media, workflow, trust, ownership, next action | Buried under home-page Explore more; no Watch-to-Lab association, saved attempt history, or sequential practice plan |
| Lab feedback | Deterministic matching/ordering/selection checks; prompt feedback uses English keyword presence | Keyword presence does not establish semantic quality and is especially unsuitable as a Thai writing evaluator |
| Agent Ops | Local supervised proposals, approval states, and workflow map | Simulated runs cannot fetch current sources, publish real versions, or establish service health |

Relevant source anchors: `NewsFeedItem`, `trendFeed`, `dashboardNews`, `newsFrequencyLabels`, `labConfigs`, `evaluateLab`, `startLabActivity`, and the `news`/`lab` screen branches in `app/page.tsx`.

## AI Watch experience

### Navigation and first visit

Promote **AI Watch** and **AI Labs** to persistent primary navigation alongside Assessment and My learning. Use a narrow mobile header with wrapping navigation and accessible controls. Admin workflow language belongs in Agent Ops.

Watch starts with For you, Explore, and Saved. Offer an optional setup: choose up to three interests, preferred language, and a session time budget. Skip opens a balanced editorial edition. Topics should use everyday labels such as Work with agents, Create with AI, Spot scams, AI at home, and Robots in the real world; D1–D6 stays in expandable learning context.

Replace “Signals that keep the assessment current” with user-facing copy such as **“What's worth knowing. What you can try.”** Replace “Agent update frequency” with a separate, honest preference for digest delivery only when a delivery service exists. Scanning cadence remains an admin setting.

### Story structure

Every approved story has a stable identity across available formats:

1. A plain-language headline and a short original summary.
2. Why this matters to the user; separate editorial relevance from personalized recommendation reason.
3. The claim, available evidence, and important limitation.
4. Source, published date, last checked date, and correction status.
5. Actual available formats, estimated consumption time, and language availability.
6. A related approved Lab when there is a defensible skill connection.
7. Save, useful/not useful, show less of this topic, and a way to undo or edit preferences.

Group multiple reports about the same event into one story cluster with supporting source links. Distinguish event date from publication date and review date. Never relabel older content as new because it was imported today. Older evergreen explainers belong in Explore, not a misleading “today” section.

### Multimodal release order

| Format | User value | First release rule |
| --- | --- | --- |
| Read: short original brief | Fast, low-bandwidth understanding | Core format with source and limitation; EN/TH availability explicit |
| Watch: publisher video or short | See a capability, demonstration, or failure | Official player or canonical link; duration/captions only if verified; click to load |
| Inspect: original annotated evidence view | Compare a claim with a chart, output, or workflow | Original/licensed material; accessible text equivalent; use only where it teaches something |
| Try: linked interactive Lab | Turn interest into practice | Publish independently reviewed Lab version; no automatic story-to-assessment promotion |
| Listen: original New Horizon audio brief | Hands-free access and language choice | Later pilot; narrate approved original script, provide transcript, label synthetic narration if used |

Do not produce all formats for every story. Start with text plus relevant publisher media, then add one original visual or Lab for selected high-value stories. Audio is a separate editorial asset with its own script, language, review, and correction lifecycle. No imitation of a source creator's voice or rewriting full third-party transcripts into audio.

Plan captions, transcripts, and visual descriptions at creation time, following [W3C's media planning guidance](https://www.w3.org/WAI/media/av/planning/). Preserve official player controls and disable autoplay; Google's [embedded-player documentation](https://developers.google.com/youtube/player_parameters) explains both controls and autoplay-related data collection. Check current source permissions at implementation; this roadmap does not grant media rights.

### Personalization without a new agent per user

First implementation is a transparent, deterministic ranker over approved content:

1. **Eligibility:** published, available, valid language/media state, not expired/withdrawn, access allowed, topic not explicitly muted.
2. **Relevance:** explicit interests and current goal first; optional role/function context next; assessed evidence only with user control and valid coverage.
3. **Utility:** session time and format fit, freshness for news, usefulness feedback, and a relevant next action.
4. **Diversity:** cap repeated publishers/story clusters and reserve some space for discovery outside followed topics. Proposed starting mix: roughly two relevant picks and one exploratory pick when sufficient eligible content exists; tune in pilot.
5. **Explanation:** store reason codes and show “Because you follow agents” or “Fits your 5-minute session.” Never say “You are weak at…” based on unsampled evidence.

Hard filters always win. When no content fits, explain the empty state and offer to broaden the user's choices. Do not silently ignore a topic mute to fill an edition. Saved items remain user-controlled; withdrawn items show an unavailable/correction notice rather than disappearing without explanation.

Assessment linkage is opt-in. Strengths and interests can drive practice as well as gaps. Clicks, completion, and dwell time are engagement signals, not proof of competence. Keep behavioral inference subordinate to explicit preferences. Let users reset personalization and use a balanced feed.

## AI Labs experience

### Lab home and return visit

Show **Continue**, **For your goals**, and **Explore skills**. Use 3–5 minute starter practice, 10–15 minute applied tasks, and longer projects only when demand is established. These are design targets; actual time estimates should come from pilot attempts.

Each Lab states the skill, prerequisite, estimated effort, evidence/artifact to inspect, task, expected output, evaluation criteria, and what is saved. The sequence is brief → inspect → attempt → feedback → revise → takeaway. A “Back to story” route preserves the Watch filters and scroll position.

Example editorial connections (design scenarios, not current news claims):

| Watch theme | Related Lab | Useful output |
| --- | --- | --- |
| Agent sends the wrong customer response | Set the permission and approval boundary | A reusable handoff checklist |
| Impressive benchmark headline | Inspect sample, baseline, and exclusions | A short evidence-check note |
| Voice or image scam | Verify provenance through a second channel | A verification plan |
| New creative tool | Repair a prompt and compare outputs against constraints | A prompt plus a review checklist |
| Robot demonstration | Separate observed capability from claimed autonomy | A capability/limitation comparison |

### Improve evaluation before claiming mastery

Treat current keyword-based prompt feedback as a checklist hint. It can reward a list of keywords while missing contradictions, unsupported claims, or unsafe instructions. Replace numerical mastery-like claims with criterion-specific practice feedback until evaluation is validated.

Use code for objectively testable rules and an optional bounded evaluator for semantic written feedback. Any evaluator needs a versioned rubric, examples of acceptable alternatives, contradiction handling, EN/TH evaluation cases, and an abstention route. Show the evidence behind a suggestion. In a service failure, preserve the draft and provide a reference checklist rather than fabricating feedback.

Keep Lab progress separate from scored assessment readiness. “Completed” means submitted and reviewed; it does not certify competence. If later measuring learning transfer, use a distinct held-out task with appropriate versions and comparable conditions.

### Return mechanics

- Save a reusable takeaway and resume unfinished work.
- Follow a topic or short skill series; surface genuinely new approved material on return.
- Offer an optional weekly mission connecting a few stories to one practice task.
- Revisit a previous Lab with a different approved scenario after an appropriate interval.
- Make reminders opt-in, capped, timezone-aware, quiet when nothing relevant is new, and easy to pause.
- Avoid punitive streaks, watch-time rewards, invented progress, and mandatory assessment gates.

## Agent and workflow design

Organize agents by accountable output. Reuse existing scout, QA, localization, feedback, and stimulus roles instead of adding a new named agent for every small operation. Ordinary code owns state changes, validation, access rules, scheduling, and publication authorization.

| Workflow | Trigger | Agent contribution | Code / human responsibility |
| --- | --- | --- | --- |
| Discover and cluster | Approved daily schedule or editor request | Suggest relevance and event clusters where rules are insufficient | Allowlisted fetchers, canonicalization, dedupe, per-source failure tracking |
| Prepare story | New eligible candidate | Original source-grounded brief; claim/evidence/limitation; topic/skill proposals | Validate required fields and source references; editor checks source support |
| Prepare media and language | Editor-selected candidate | Original visual/script brief and EN/TH draft | Rights/availability records, equivalence QA, human approval of each variant |
| Connect or draft Lab | Strong educational opportunity | Reuse approved Lab where appropriate; otherwise draft task and rubric | Independent checks for answerability, artifacts, feasible actions, accessibility |
| Editorial publication | Reviewer decision | QA report is advisory | Human approves exact version; publisher verifies gates and writes immutable release |
| Assemble personal edition | User visit or opted-in digest | No LLM needed initially | Deterministic ranking, availability checks, reasons, dedupe, preference enforcement |
| Improve and maintain | Weekly aggregate review; source correction | Summarize themes and suggest changes | Sample-size checks, human decisions, withdrawal and dependency invalidation |

### State machines

Watch: `discovered → drafted → QA → human review → approved → published → monitored`, with `needs changes`, `rejected`, `expired`, and `withdrawn` branches. Technical QA can pass without granting publication approval. Changes after approval invalidate that approval for the changed version.

Labs: `draft → rubric/artifact QA → human review → pilot-ready → pilot-tested → approved → published → monitored`. Do not force timely Watch news through psychometric pilot states; do not let a news approval bypass Lab validation. Scored assessment content retains its separate, stricter workflow.

Each original audio/visual/language variant references its parent story version. A material correction invalidates dependent variants and queued digests; an editor decides whether a linked Lab also needs correction. Keep a visible correction trail. Previously saved links resolve to the corrected item or a withdrawal notice.

### Agent Desk interaction design

Default to an actionable queue: **Needs review**, **Blocked**, **Scheduled**, and **Published**. The workflow map is a drilldown into real run records. Each row shows owner, age, next action, source coverage, cost where available, and affected content. Distinguish “job succeeded” from “editor approved” and from “published.”

A review drawer contains source links, claim/evidence mapping, draft diff, media rights/availability, EN/TH status, Lab association, QA findings, and prior decisions. Provide approve exact version, request changes with reason, and reject. A writer cannot approve its own proposal. Batch approval should wait until per-item evidence remains inspectable and equivalent controls are proven.

Source health displays last successful scan per source, partial failures, and retry state. Preserve the existing proposed daily discovery target and 48-hour stale-run alert; do not claim freshness from a successful run that skipped every important source. Also track age of the last publication and editorial queue age: a healthy crawler can coexist with a stale feed.

### Minimal operational contracts

Use the existing Supabase/PostgreSQL direction and a lightweight job runner when implementation begins. This proposal does not require new orchestration vendors, model selection, fine-tuning, or a multi-agent runtime.

- Persist run and step IDs, source/item/variant versions, state, input/output references, attempt number, timestamps, model/prompt version when used, estimated/actual usage where available, and reviewer decision.
- Use idempotency keys for discovery and publication; retries must not create duplicate stories or send duplicate digests.
- Bound retries, time, source count, concurrency, and spend. Quarantine malformed or unsupported source results with a visible reason.
- Treat fetched pages as untrusted evidence. Source text cannot issue tool instructions, approve content, or change source policies.
- Keep source fetching, drafting, reviewing, and publishing permissions separate; provider credentials stay server-side.
- Cancel safely, resume from durable checkpoints, and expose retry/withdraw controls. Publication requires the current approved version and a final dependency/availability check.
- Attach repeat failures and expensive rejected drafts to an operator queue. Stop repeated self-revision loops after a configured attempt limit.

Minimum data groups: source registry and fetch runs; story clusters and source references; story/variant versions; Lab/rubric versions; workflow runs/steps/proposals/reviews/publications; user preferences/saves; versioned Lab attempts and takeaways; consent-aware product events and digest delivery records.

## Delivery roadmap

Phases are ordered work packages, not calendar commitments. Size is relative: S is a bounded UI/content task; M crosses data and UI; L includes shared backend or multiple services. No phase depends on replacing assessment questions.

| Phase | Deliverables | Dependencies | Exit evidence |
| --- | --- | --- | --- |
| 0 — Design, now (S) | Explorable Watch/Lab/Agent Desk concept; schema and interaction specification; editorial sample pack | Existing prototype and approved standards | Team can review cold start, preferences, practice transition, review decisions, and empty/failure states |
| 1 — Connected local experience (M) | Visible Labs navigation; For you/Explore/Saved; explicit interests; recommendation reasons; story-to-existing-Lab links; saved draft/return route; honest cadence copy | Stable IDs and small manually reviewed sample set | Reload preserves same-browser choices; no incorrect gap claims; mobile/keyboard flows work; prototype storage limits visible |
| 2 — Real editorial workflow (L) | Shared editorial records and roles; allowlisted discovery; durable retries; human review; versioned publish/withdraw; freshness monitoring | Auth, database policies, approved sources, operator ownership | Duplicate run is safe; writer cannot publish; approval invalidated on edits; partial-source failure visible; correction propagates |
| 3 — Repeat learning pilot (M/L) | Shared saved items and Lab attempts; one short skill series; original evidence views; opt-in digest; baseline retention measurement | Published content supply, consent controls, validated Lab feedback | Resume works across devices; digest dedupes and honors opt-out; meaningful returns measured with denominators |
| 4 — Selective multimodal expansion (M/L) | Original EN/TH audio briefs; reviewed transcripts; deeper projects; optional semantic feedback | Rights, localization capacity, evaluator checks, observed demand | Accessibility and equivalence verified; acceptable cost and editorial burden; improvement over simpler experience demonstrated |

Recommended first implementation slice after design review: **personalized Watch + saved items + links into two improved Labs**, with stable IDs and local persistence. Build durable editorial records next, before describing discovery as live. Keep content creation bounded to editor capacity; a discovery ceiling is not a publication quota.

## Measurement and evaluation

Define a meaningful return as an identifiable, consented user returning on a later day and saving a relevant story, explicitly marking a brief useful, or completing/revising a Lab. Report these actions separately as well as the composite. Passive page loads and video watch time do not qualify by themselves.

Primary pilot measure: seven-day meaningful return rate among first-time activated users whose full seven-day window has elapsed. Define activation as reading a brief detail or starting a Lab. Show numerator, denominator, observation window, exclusions, and identity limitations; anonymous cross-device visits cannot be reliably joined.

Supporting measures:

- Watch-to-Lab start rate: unique readers of a detail with an eligible Lab link who start that Lab.
- Lab completion and revision rates, completion time distribution, and explicit usefulness feedback.
- Saved-to-revisited rate; negative feedback, mute, and opt-out rates.
- Source freshness, duplicates, correction frequency, unsupported-claim findings, queue age, and accessibility defects.
- Cost per approved story/variant/Lab and human review time, including rejected/retried drafts.
- Language and experience-group differences with sample sizes; avoid unsupported fairness conclusions at low volume.

Event contract should include event ID, anonymous/account identity as permitted, session, timestamp, story/Lab version, origin story, ranker version/reason, language, and experiment allocation if any. Keep answer drafts out of routine analytics. Deduplicate events and honor deletion/retention requirements.

First comparisons: connected Watch-to-Lab journey versus current separate entry points; explicit-interest ranking versus balanced editorial ordering; short brief versus brief plus relevant visual. Establish baseline and predefine sample/duration/decision criteria before experimentation. Do not promise uplift or run underpowered tests just to declare a winner.

## Reviewable design boundaries

The accompanying interactive concept uses fictional sample content and in-memory/host-saved demonstration choices. Media views represent layouts, not delivered video/audio. Reviewer actions demonstrate states and do not publish anything. It is not connected to accounts, agents, notifications, or the live question bank.

Product decisions proposed for review: make Watch and Labs primary navigation; keep starter access open; lead with user-controlled interest/time choices; connect selected stories to quality Labs; build the human editorial queue before autonomous discovery claims; defer original audio until demand and review capacity are demonstrated.

## Related documents

- [Feature catalog](FEATURE_CATALOG_BY_USER_AND_RELEASE.md)
- [Agent workflows](AGENT_WORKFLOWS_ORCHESTRATION.md)
- [Agent tooling strategy](AGENT_PLATFORM_TOOLING_STRATEGY.md)
- [Artifact and Lab quality standard](ARTIFACT_DESIGN_AND_QA_STANDARD.md)
- [Telemetry purposes](TELEMETRY_TRACKING_PURPOSE.md)

Feature implementation status is tracked in the feature catalog. The first local slice does not change approved source lists, production schedules, or existing human approval requirements.
