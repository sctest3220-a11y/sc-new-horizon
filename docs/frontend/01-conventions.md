# 1. Conventions

TypeScript and React conventions this codebase already follows. They are written
down here because the code is consistent about them and nothing else records
them.

The rules that must never be broken live in
[`../../app/CLAUDE.md`](../../app/CLAUDE.md). This document is the style
underneath them.

## Layout

**Each learner screen is a route; new code lives beside `app/learner-app.tsx`,
not inside it.** A screen is `app/(learner)/<route>/page.tsx` (a server
component that sets the title) plus its client `screen.tsx`, which reads
shared state through `useApp()` (`app/learner-app-context.tsx`). The URLs are
listed in one place, `app/learner-routes-model.ts`. The newer surfaces show the
split inside a screen:

- `app/watch-labs.tsx` is the component;
- `app/watch-model.ts` and `app/connected-labs.ts` hold the logic and data;
- `app/watch-labs.css` holds the styles;
- `scripts/test-watch-labs.mjs` holds the tests.

The screens were all one ~17k-line `app/page.tsx` until they moved to routes.
Their state, logic and question bank are still one module,
`app/learner-app.tsx`, because everything was added in place. Every addition
there makes the next change harder to review and to test.

**Logic modules have no runtime imports.** `app/watch-model.ts` imports nothing;
`app/connected-labs.ts` imports only types from it. The tests transpile each
file on its own, and the same isolation lets the logic be reused in a script or
moved behind the Go API later.

## Naming

**Storage keys are `new-horizon-<thing>-v<N>`, with `:` for a scope.** Examples:

- `new-horizon-language-v1`;
- `new-horizon-watch-labs-v1:<ownerId>`;
- `new-horizon-review-v2:<contentVersion>:<questionId>`.

The one exception, `nh-inventory-theme`, is a display preference in the
inventory tool. The version suffix is what lets a parser reject an old shape
instead of misreading it.

**Window events are `new-horizon-<noun>-<past-tense>`.** Examples are
`new-horizon-review-updated` and `new-horizon-review-synced`. They are how
sibling client components in the inventory tool tell each other to re-read.

**Versions are strings with a fixed format, never numbers.**

- Release IDs: `2026-10-07.1`.
- Inventory versions: `2026.10.05 V.0`.
- Content versions: a sha256 hex, or `legacy-unversioned`.
- Lab versions: the string on each Lab.

Comparing them as numbers or dates breaks the moment the format gains a suffix.

## TypeScript

**`strict` is on, and types sit next to the code that owns them.** Examples:
`WatchState` and `Bilingual` in `app/watch-model.ts`, and the question types at
the top of `app/learner-app.tsx`. There is no shared `types.ts`.

**Bilingual data is `{ en, th }` in new code, and `xxx` / `xxxTh` sibling
fields in question data.** New components take a `language` prop and pick a
side with a small `t(en, th)` helper (`app/watch-labs.tsx`). Don't add new
`*Th` siblings outside question data.

**Imports are relative.** `tsconfig.json` defines `@/*`, but no file uses it;
stay consistent.

## Components

**Client components say `'use client'` and touch the browser only after
mount.** See [6. State management](06-state-management.md) for the restore
pattern.

**Accessibility is part of the component.** The newer code uses real
`<button type="button">` elements, `aria-pressed` for toggles, `<label
htmlFor>`, `<fieldset>`/`<legend>` for choice groups, and `aria-live` for
feedback (`app/watch-labs.tsx`). The demo runs on phones, so a `div` with an
`onClick` cannot be reached by every user.

## Styles

**Hand-written semantic classes, prefixed per surface:** `wl-` for Watch/Labs,
`inventory-` for the reviewer, plain names in the legacy `globals.css`.
Tailwind 4 is loaded (`@import 'tailwindcss'`), but utility classes are rare.
Don't mix the two styles in one component.

**Breakpoints are `max-width` media queries in the surface's own CSS file.**
`app/watch-labs.css` uses 800px and 440px; `app/globals.css` uses 1100px,
900px, 640px and 600px. Make every screen work at 375px. Inputs get
`font-size: 16px` on small screens so iOS does not zoom into them
(`app/watch-labs.css`).

## Errors and unavailable storage

**Storage access is wrapped, and failure degrades to memory, visibly.**
`readLocalStorage` and `writeLocalStorage` in `app/learner-app.tsx` swallow errors.
`app/watch-labs.tsx` goes further: it records `storageStatus: 'memory'` and
tells the user that their progress will not be kept. Use the second pattern for
anything the user would miss.

## Tests

The rules (what must be tested, coverage floors, refactoring) are in
[`../TESTING.md`](../TESTING.md). This is how the tests are written.

**Logic: `node:test` scripts in `scripts/`, importing the `.ts` module
directly.** They assert behaviour ("assert the decision, not the framework"),
for example `"mutes and format filters are hard gates in recommendations"`.
Node strips the types at import time, so coverage lands on the real source
file.

**Components: Vitest + React Testing Library in `app/<feature>.test.tsx`.**
Query by role and accessible name (`getByRole('button', { name: … })`), the
way a user or screen reader finds things, not by class name. A test that
needs a CSS selector usually means the markup is missing a label. Browser state
is cleaned between tests by `vitest.setup.ts`. Simulate failures with
`vi.spyOn(Storage.prototype, …)`; don't hand-roll globals. See
`app/watch-labs.test.tsx`.

**The browser smoke test**, `scripts/smoke-inventory-cloudflare.mjs`, is a
Playwright script run only by `.github/workflows/question-inventory.yml`
against `wrangler dev`.

Test names are full sentences stating the guarantee, so a failure reads as the
broken promise. Every use case gets its edge cases in the same file:
- corrupt or missing data;
- the limit and one past it;
- the other language;
- the failure path.

## Documentation

**Comments explain why, not what**, and are rare. Examples are the hydration
and storage notes in `app/learner-app.tsx` and the deploy-adapter checks in
`scripts/build-inventory-cloudflare.mjs`. Generated files start with a
`GENERATED … do not hand-edit` header naming their source. No linter enforces
any of this.
