# 2. The reference implementation

AI Watch and Labs is the feature to copy. It is the newest surface and the only
one already split the way new code should be:

- a component;
- a pure model with a validating parser;
- its own CSS;
- versioned persisted state;
- tests that pin its behaviour.

This phase moves features like it onto the Go API, so this document also shows
where that change goes.

Reviewer feedback (`/admin/question-inventory` → `POST /api/results` → D1) is
the only existing browser → API → database path. It belongs to the frozen
inventory tool, so read it as an example, not as a feature to extend.

## Watch/Labs, layer by layer

| Step | File | What happens |
| --- | --- | --- |
| 1 | `app/(learner)/watch/page.tsx`, `labs/page.tsx` | Each route renders `LearningScreen`, which picks the view from `step`, derived from the URL (`stepForPath` in `app/learner-routes-model.ts`). `WatchLabs` renders only once `browserStateReady` is true. |
| 2 | `app/(learner)/learning-screen.tsx` | It mounts `<WatchLabs key={authProfile?.id ?? localProfileId} ownerId={…} />`. The `key` remounts the component when the identity changes. |
| 3 | `app/watch-labs.tsx` | State starts as `newWatchState()`, a deterministic default. Then an effect reads `new-horizon-watch-labs-v1:<ownerId>` on the next animation frame. |
| 4 | `app/watch-model.ts` | `parseWatchState` validates the stored JSON. It accepts only `version: 1`, filters IDs by pattern, and caps lengths. Anything else becomes the default. |
| 5 | `app/watch-labs.tsx` | A second effect writes the state back. It only runs once `ready` is true, and it falls back to `'memory'` if storage throws. |
| 6 | `app/watch-model.ts` | `selectWatchStories` ranks stories from that state, with interests, mutes and media filters as hard gates. |
| 7 | `app/connected-labs.ts` | `evaluateConnectedLab` grades the Lab decisions. It never grades the notes. |
| 8 | `scripts/test-watch-labs.mjs` | Transpiles steps 4, 6 and 7 in isolation and pins their guarantees. |

Four details in that sequence are load-bearing.

**The default is deterministic, and the restore happens after mount.** Server
HTML and the first client render must agree. Reading storage in a `useState`
initializer brings back the hydration bug fixed in `8666ead`. No test pins
this.

**The save effect waits for `ready`.** Without that guard, the first effect run
writes the default state over the user's saved state before the load has
happened, and every visit looks like a first visit. No test pins this.

**The parser is the trust boundary.** Stored data is user-editable, so
`parseWatchState` treats it like request input: it checks the version,
allowlists IDs and caps lengths. (`"corrupt, missing, and unknown-version
storage recovers without throwing"`, `"stale versions and forged completion
cannot retain a takeaway"`)

**The `key` scopes state to one person.** When someone signs in or out,
`ownerId` changes, the component remounts and it loads that person's state. A
missing `key` shows the previous person's saved stories to the next one. No
test pins this.

## Adding a feature of your own

1. Write the logic in `app/<feature>-model.ts`: types, a `new<Feature>State()`
   default and a `parse<Feature>State(raw)` parser that never throws. Keep it
   free of runtime imports.
2. Pin the parser and the decisions in `scripts/test-<feature>.mjs`, importing
   `../app/<feature>-model.ts` directly as `scripts/test-watch-labs.mjs` does.
   Cover every use case and its edge cases, and reach at least 90% of lines,
   branches and functions (`docs/TESTING.md`).
3. Write the component in `app/<feature>.tsx` with `'use client'` and its
   text in the message catalogs (`i18n/messages/*.json`). Start from the default and restore
   after mount behind `ready`. Test it in `app/<feature>.test.tsx`, modelled on
   `app/watch-labs.test.tsx`: each state, each control, what is saved, and
   both languages.
4. Style it in `app/<feature>.css` with a surface prefix. Check it at 375px.
5. Render it from the screen of the route it belongs to (`app/(learner)/<route>/screen.tsx`), with a `key` for the identity it belongs to. A new screen also needs its URL in `app/learner-routes-model.ts`.
6. Run the Definition of done in `app/CLAUDE.md`.

## Moving a feature's data to the Go API

This is the main work of the Event Demo phase. Steps 4 and 5 of the table above
change; the rest stays.

1. On the server: add a migration, the store method and the handler, as
   described in `server/docs/02-reference-implementation.md`. Agree the JSON
   shape first.
2. In the web app: add one function per call to `app/api-client.ts` (create it
   with the first endpoint). The function owns the URL, the `fetch`, the error
   handling, and running the response through the same `parse…` function. A
   server response gets the same distrust as `localStorage`.
3. In the component: replace the storage read and write with the client
   functions. Keep the `ready` guard and the deterministic default. Turn
   `'memory'` into an error state the user can see.
4. Remove the feature's `localStorage` read and write. Existing browser data is
   **dropped, not imported** (`docs/SCOPE.md`, Decided), so don't write a
   migration or a one-off import. Leaving the old key in the browser is
   harmless. Nothing reads it once the code path is gone.

The details of loading and saving state from the API are in
[6. State management](06-state-management.md).
