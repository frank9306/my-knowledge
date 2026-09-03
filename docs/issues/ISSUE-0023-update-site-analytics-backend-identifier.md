---
id: ISSUE-0023
title: "Update site analytics backend identifier"
status: done
priority: medium
created: 2026-09-03
updated: 2026-09-03
closed: 2026-09-03
related_adrs: []
depends_on: []
---

# ISSUE-0023: Update site analytics backend identifier

## Problem

The previous analytics backend is no longer available, so the site still reports to an obsolete website identifier.

## Desired outcome

The production site loads the replacement analytics script at https://state.webfrank.top/script.js with website ID dfe19437-097d-46dd-82d4-9a3cab647b38.

## Acceptance criteria

- [x] The global VitePress head loads `https://state.webfrank.top/script.js` with `defer`.
- [x] The analytics script uses website ID `dfe19437-097d-46dd-82d4-9a3cab647b38`.
- [x] The production documentation build succeeds.

## Out of scope

- Reconfiguring or migrating historical analytics data.
- Publishing the site or validating events in the hosted analytics dashboard.

## Decisions

No decisions recorded.

## Implementation notes

The current script endpoint is still correct; only the obsolete website ID needs replacement.

## Verification

pnpm docs:build passed; generated HTML contains the new website ID and neither source nor generated output contains the obsolete ID.

## Activity log

### 2026-09-03 — Created

Issue created from the supplied project input.

### 2026-09-03 — Status changed from proposed to ready.

### 2026-09-03 — Status changed from ready to in-progress.

### 2026-09-03 — Status changed from in-progress to done.

## Completion summary

Replaced the obsolete analytics website ID in the global VitePress head while retaining the replacement script endpoint.
