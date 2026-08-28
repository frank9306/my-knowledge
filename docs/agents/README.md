# Agent Documentation

This directory defines how agents use the project documentation:

- `workflow.md`: documentation lifecycle and source-of-truth rules.
- `domain.md`: rules for maintaining durable domain context.
- `issue-tracker.md`: local Issue and Changelog conventions.

Project facts belong in the artifact that owns them, not in this index.

## Automated dispatch

Work dispatched automatically through Hermes/DSH must still create and maintain a local `docs/issues/ISSUE-NNNN-*.md` record and follow the same acceptance criteria, verification, and Changelog flow described in `issue-tracker.md` and `workflow.md`.
