---
id: ISSUE-0001
title: "Migrate changelog to repository-owned monthly records"
status: done
priority: normal
created: 2026-08-26
updated: 2026-08-26
closed: 2026-08-26
related_adrs: []
depends_on: []
---

# ISSUE-0001: Migrate changelog to repository-owned monthly records

## Problem

The repository still keeps published history in the root CHANGELOG.md and project rules require updating that root file, which conflicts with the initialized docs/changelog monthly workflow.

## Desired outcome

Published history is preserved in monthly files under docs/changelog, project instructions reference the new source of truth, and the root CHANGELOG.md is removed.

## Acceptance criteria

- [x] Remove the root `CHANGELOG.md` without losing published history.
- [x] Split historical entries into `docs/changelog/YYYY-MM.md` files and organize them under standard categories.
- [x] Link the current migration outcome to this Issue.
- [x] Update project and published agent instructions so `docs/changelog/` is the only Changelog source of truth.
- [x] Update durable Project Brain guidance that still points to the root file.
- [x] Verify documentation initialization remains idempotent and the production site builds successfully.

## Out of scope

- Rewriting the wording of historical release entries.
- Creating retrospective Issues for releases that predate local Issue tracking.

## Decisions

- Preserve legacy release text verbatim where practical, grouped by the month in which it was originally published.
- Mark migrated legacy entries as historical records rather than inventing Issue links.

## Implementation notes

- Migrated legacy entries into `docs/changelog/2026-06.md`, `2026-07.md`, and `2026-08.md`.
- Updated `AGENTS.md`, the published `docs/agents.md`, and `[[github-pages-custom-domain]]` to use monthly records.
- Reserved the final `Documentation` entry in `docs/changelog/2026-08.md` for the terminal Issue transition.

## Verification

init-docs idempotency checks passed twice; required paths verified; brain lint-links passed; pnpm docs:build passed.

## Activity log

### 2026-08-26 — Created

Issue created from the supplied project input.

### 2026-08-26 — Status changed from proposed to ready.

### 2026-08-26 — Status changed from ready to in-progress.

### 2026-08-26 — Status changed from in-progress to done.

## Completion summary

Removed the root Changelog, migrated release history into monthly repository-owned records, updated agent and Brain guidance, and established Issue-linked monthly updates as the single source of truth.
