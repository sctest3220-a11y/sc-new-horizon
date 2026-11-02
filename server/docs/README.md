# Go API engineering documentation

Reference material and reasoning for the Go API in `server/`. These documents
hold what does not fit a rules file: the conventions under the rules, and a
worked example to copy when adding the first real endpoints.

## The documents

| # | Document | Answers | Read it when |
| --- | --- | --- | --- |
| 1 | [Conventions](01-conventions.md) | Where does a file go, and how is it written | Before adding a file |
| 2 | [The reference implementation](02-reference-implementation.md) | What does a complete request look like, top to bottom, and how to add an endpoint | Before adding an endpoint or a migration |

## Which file wins

| File | Holds |
| --- | --- |
| [`../CLAUDE.md`](../CLAUDE.md) | The condensed, always-loaded rules: the non-negotiables, middleware order, where code goes, the gate and the sharp edges |
| `server/docs/` (here) | The reference material and the reasoning behind those rules |
| [Root `CLAUDE.md`](../../CLAUDE.md) | Cross-cutting decisions shared with the web app |
| [`../README.md`](../README.md) | Setup, environment variables, running |

When a rule and its reasoning disagree, the rule in `server/CLAUDE.md` is what
holds. The disagreement is a bug in these documents. A change that alters
structure or conventions updates the relevant file here **in the same change**.

The web app has the same arrangement: [`docs/frontend/README.md`](../../docs/frontend/README.md).
