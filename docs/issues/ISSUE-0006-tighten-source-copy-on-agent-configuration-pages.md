---
id: ISSUE-0006
title: "Tighten source copy on Agent configuration pages"
status: done
priority: low
created: 2026-08-26
updated: 2026-08-26
closed: 2026-08-26
related_adrs: []
depends_on: []
---

# ISSUE-0006: Tighten source copy on Agent configuration pages

## Problem

The AGENTS.md and Agent Skills pages repeat source, synchronization, discovery, and implementation details across the page introduction and runtime component headers.

## Desired outcome

Both pages state only the source and relevant scope, while runtime components retain concise counts and necessary loading, error, and retry text.

## Acceptance criteria

- [x] The Agent Skills page states only the public source and exclusion of local/private/other-source Skills.
- [x] The AGENTS.md page states only its source before the fetched document.
- [x] Remove repeated live-sync, discovery-path, and manual-maintenance explanations from both runtime components.
- [x] Preserve concise loading, error, retry, count, and upstream-link states and pass the production build.

## Out of scope

- Rewriting article content that discusses automation or synchronization as part of its subject.
- Changing the GitHub data sources or fetch behavior.

## Decisions

- Treat source and scope as page-level content; keep runtime components focused on the fetched result and recovery states.

## Implementation notes

- Reduced both page introductions to a source line; the Skills page also keeps the user-requested scope exclusion.
- Removed the repeated English eyebrow, section headings, repository path explanation, and synchronization language.
- Kept only the loaded Skill count, source links, and short loading, empty, error, and retry states.

## Verification

pnpm docs:build, git diff --check, and focused copy search passed; rendered asynchronous success state remains unverified.

## Activity log

### 2026-08-26 — Created

Issue created from the supplied project input.

### 2026-08-26 — Status changed from proposed to ready.

### 2026-08-26 — Status changed from ready to in-progress.

### 2026-08-26 — Status changed from in-progress to done.

## Completion summary

Reduced the AGENTS.md and Agent Skills pages to concise source, scope, count, and recovery copy.
