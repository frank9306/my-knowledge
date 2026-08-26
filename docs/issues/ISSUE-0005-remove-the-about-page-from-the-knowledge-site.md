---
id: ISSUE-0005
title: "Remove the About page from the knowledge site"
status: done
priority: low
created: 2026-08-26
updated: 2026-08-26
closed: 2026-08-26
related_adrs: []
depends_on: []
---

# ISSUE-0005: Remove the About page from the knowledge site

## Problem

The site still publishes a standalone About page and links it from the main navigation and generated README.

## Desired outcome

The About page and its navigation entries are removed while the AGENTS.md and Agent Skills pages remain available.

## Acceptance criteria

- [x] Delete `docs/about.md`.
- [x] Remove `/about` from the VitePress navigation and generated README source list.
- [x] Preserve the `/agents` and `/skills` pages and their navigation entries.
- [x] Regenerate README navigation and pass the production build.

## Out of scope

- Removing the broader `关于` navigation group that contains the retained Agent pages.
- Moving the deleted page's personal-project or contact content elsewhere.

## Decisions

- Keep the `关于` navigation group as the location for the retained AGENTS.md and Agent Skills pages.

## Implementation notes

- Deleted `docs/about.md` and removed its VitePress navigation item.
- Removed the top-level `/about` entry from `scripts/sync-readme.mjs`; the generated README no longer links to it.
- Kept the `关于` navigation group with the live AGENTS.md and Agent Skills pages.

## Verification

README sync and pnpm docs:build passed; focused navigation search and git diff --check passed.

## Activity log

### 2026-08-26 — Created

Issue created from the supplied project input.

### 2026-08-26 — Status changed from proposed to ready.

### 2026-08-26 — Status changed from ready to in-progress.

### 2026-08-26 — Status changed from in-progress to done.

## Completion summary

Removed the standalone About page and its navigation entries while preserving the AGENTS.md and Agent Skills pages.
