---
id: ISSUE-0009
title: "Remove the nine-part Harness Engineering practical series"
status: done
priority: medium
created: 2026-08-27
updated: 2026-08-27
closed: 2026-08-27
related_adrs: []
depends_on: []
---

# ISSUE-0009: Remove the nine-part Harness Engineering practical series

## Problem

The nine Harness Engineering practical-series articles are no longer wanted and remain published in the site navigation.

## Desired outcome

Remove all nine practical-series article pages and eliminate their generated navigation entries without affecting other Harness Engineering content.

## Acceptance criteria

- [x] Delete `docs/blog/harness-series-01-project-diagnosis.md` through `harness-series-09-minimum-harness-capstone.md`.
- [x] Remove links to the deleted articles from the retained series landing page.
- [x] Regenerate `README.md` so the deleted articles disappear from site navigation.
- [x] Keep unrelated Harness Engineering articles and shared artwork unchanged.
- [x] Production build succeeds without broken links to the deleted series pages.

## Out of scope

- Removing the Harness Engineering overview or other related articles.
- Deleting shared series artwork or generation scripts.

## Decisions

- Retain the series landing page as a concise historical pointer, but remove its links to the deleted tutorial pages.

## Implementation notes

- Delete only the nine numbered tutorial source files.
- Replace the landing page tutorial table and start link with a removal notice and a link to the retained overview.

## Verification

pnpm readme:sync and pnpm docs:build passed; focused slug scan found no remaining site links to the deleted articles.

## Activity log

### 2026-08-27 — Created

Issue created from the supplied project input.

### 2026-08-27 — Status changed from proposed to ready.

### 2026-08-27 — Status changed from ready to in-progress.

### 2026-08-27 — Status changed from in-progress to done.

## Completion summary

Removed the nine numbered Harness Engineering practical-series articles, cleaned generated navigation, and retained a concise archive landing page.
