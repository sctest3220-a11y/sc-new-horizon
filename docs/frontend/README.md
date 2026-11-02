# Web app engineering documentation

Reference material and reasoning for the web app in `app/`. These documents
hold what does not fit a rules file: conventions, a worked example, the
assessment engine, the frozen question bank, Watch/Labs, and how state is
managed.

## The documents

| # | Document | Answers | Read it when |
| --- | --- | --- | --- |
| 1 | [Conventions](01-conventions.md) | Where does a file go, and how is it written | Before adding a file |
| 2 | [The reference implementation](02-reference-implementation.md) | What does a complete feature look like, top to bottom | Before adding or migrating a feature |
| 3 | [The assessment engine](03-assessment-engine.md) | How scoring, confidence, continuation, routing and telemetry work | Before touching the quiz or the report |
| 4 | [The question bank and results report](04-question-bank.md) | Where questions come from and how the report reads them (frozen) | Before reading question data in feature code |
| 5 | [AI Watch and AI Labs](05-watch-and-labs.md) | What Watch/Labs is meant to be, what is built, where its data comes from | Before touching `app/watch-*` or `app/connected-labs.ts` |
| 6 | [State management](06-state-management.md) | Where state lives, how it is restored, persisted and moved to the Go API | Before adding state, storage or an API call |

## Which file wins

| File | Holds |
| --- | --- |
| [`../../app/CLAUDE.md`](../../app/CLAUDE.md) | The condensed, always-loaded rules: the non-negotiables, the route table, where code goes, the gate and the sharp edges |
| `docs/frontend/` (here) | The reference material and the reasoning behind those rules |
| [Root `CLAUDE.md`](../../CLAUDE.md) | Cross-cutting decisions shared with the Go API |
| [`docs/SCOPE.md`](../SCOPE.md) | What is and is not being built this phase |
| [Root `README.md`](../../README.md) | Setup, configuration, commands, troubleshooting |

When a rule and its reasoning disagree, the rule in `app/CLAUDE.md` is what
holds. The disagreement is a bug in these documents. A change that alters
structure or conventions updates the relevant file here **in the same change**.

The Go API has the same arrangement: [`server/docs/README.md`](../../server/docs/README.md).
