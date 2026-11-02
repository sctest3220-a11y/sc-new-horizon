# 6. State management

How state is held, restored, persisted and fetched in this app. Most of the
rules apply to any React 19 app rendered on a server. What is specific here:

- the app is server-rendered by Vinext, so hydration matters;
- most state lives in one 17k-line component;
- state is moving from `localStorage` to the Go API this phase.

The rules that pin the most important of these are non-negotiables 1–3 in
[`../../app/CLAUDE.md`](../../app/CLAUDE.md).

## Where a piece of state belongs

Ask in this order, and stop at the first yes.

| Question | If yes, it lives… | Example |
| --- | --- | --- |
| Can it be computed from other state or props? | Nowhere: compute it during render, with `useMemo` if it is expensive | `dashboardNews`, `selectWatchStories(...)` |
| Is it part of the address a user could share or reload? | In the URL (`?view=`, `?question=`), read after mount | `step` ↔ `?view=watch` |
| Is it Event Demo data that must survive a device change? | In Postgres, behind the Go API | Assessment runs, profiles, saved stories (once migrated) |
| Has a developer agreed it stays on this device? | In `localStorage`, versioned and parsed | Language choice, theme, dismissed hints |
| Otherwise | In component state, in the lowest component that needs it | An open panel, a draft in a form |

**Derived state is never stored.** Copying `filteredStories` into its own
`useState` creates two sources of truth. The effect that keeps them in sync runs
a render late, so the screen shows the stale list for a frame, or forever if the
dependency array is wrong.

**State lives in the lowest component that needs it.** `app/page.tsx` holds
dozens of `useState` calls (66 at the time of writing). Each one re-renders the
whole page on change, which is why typing in a small form can feel slow there.
New state in a new component keeps re-renders local.

## Initial render and restore

The server and the first client render must produce the same HTML. Therefore:

- **Start from a deterministic default.** `useState(newWatchState)` is right.
  `useState(() => readLocalStorage(...))` is wrong. So are `Date.now()`,
  `Math.random()` or `window.location` in an initializer.
- **Restore in an effect, then mark ready.** Follow `app/watch-labs.tsx`: read
  inside `requestAnimationFrame` (or `useEffect`), run the result through the
  parser, set `ready`. The `browserStateReady` effect in `app/page.tsx` does the
  same for the whole page.
- **Render loading honestly.** Until `ready`, show a loading state or the
  default. Never show "no saved stories" before you have looked.
- **Remount on identity change with `key`.** Don't write an effect that clears
  state when `ownerId` changes; it misses fields. A new `key` gives a clean
  mount and runs the restore again.

## Persisting to `localStorage` (only where agreed)

- One key per feature: `new-horizon-<feature>-v<N>`, scoped with
  `:<ownerId>` if it belongs to a person.
- Store a `version` field inside the value as well, and reject unknown versions
  in the parser. Bump both on an incompatible change. Don't write a migration
  that guesses at old shapes.
- Save in an effect guarded by `ready`, wrap `setItem` in `try`, and surface the
  "not saved" state to the user.
- Cap sizes and allowlist IDs in the parser. `localStorage` is a few megabytes,
  shared by every feature on the origin.

## Fetching from and saving to the Go API

Nothing does this yet, so these rules set the pattern for the first feature to
migrate.

- **One client module.** `app/api-client.ts` exports one function per endpoint.
  Components never build Go API URLs or call `fetch` on the API themselves. The
  base URL, credentials and error handling then change in one place when hosting
  and auth are decided.
- **Parse responses.** Pass every response through the same `parse…` function
  the feature uses for storage. A deploy that changes a field on one side then
  degrades to a default instead of crashing the page.
- **Fetch in an effect after mount, and keep the `ready` pattern.** Track
  `loading`, `ready` and `error` explicitly. A missing server must show an error
  the user can act on (retry), not a blank screen.
- **Cancel stale requests.** Give each fetch an `AbortController` and abort it
  in the effect's cleanup. Otherwise a slow response for the previous user or
  view lands after the new one, and its data overwrites the current screen.
- **Saves are explicit and acknowledged.** Write on a user action or a debounced
  change, show "saving…/saved/failed", and keep the unsaved value in state until
  the server confirms. Don't clear a form before the request succeeds.
- **Optimistic updates only where a rollback is easy.** A toggled bookmark can
  update immediately and revert on failure. A submitted assessment cannot:
  wait for the server.
- **No caching layer yet.** Don't add React Query, SWR or a global store for the
  first endpoints. Add one deliberately when several screens share the same
  server data. Until then, a dependency nobody needed is only more to debug
  before the demo.

## Shared state across components

- Pass props down first. Siblings that need the same state get it from their
  common parent.
- Use React context only for values most of the tree reads and that rarely
  change: language, the signed-in identity. Context re-renders every consumer
  on each change, so a frequently changing value in context slows every
  screen.
- Reach for `useReducer` when one action changes several fields together, as
  in the Lab draft updates in `app/watch-labs.tsx`. One action that updates
  three fields can't leave them half-updated.
- Window events (`new-horizon-review-updated`) are how the inventory tool's
  separate client islands coordinate. Don't copy that into the main app, where
  components share a parent.
