---
id: ISSUE-0011
title: "Shorten the proxy debugging article title"
status: done
priority: low
created: 2026-08-27
updated: 2026-08-27
closed: 2026-08-27
related_adrs: []
depends_on: []
---

# ISSUE-0011: Shorten the proxy debugging article title

## Problem

The newly added proxy-chain debugging article title is longer than desired in the article header and generated navigation.

## Desired outcome

Use a shorter title consistently in frontmatter, the article heading, and generated navigation, then verify the production build before publishing.

## Acceptance criteria

- [x] Shorten the article frontmatter title and H1 to “代理能连，浏览器却打不开：一次代理链路排障实录”.
- [x] Regenerate README navigation so the shorter title is used consistently.
- [x] Pass the design lint and production documentation build.

## Out of scope

- Rewriting the article body or changing its diagrams.
- Changing other article titles or navigation behavior.

## Decisions

- Keep both the symptom and the proxy-chain context while removing the longer implementation-specific wording.

## Implementation notes

- Update only the article frontmatter title and H1; generated navigation follows from `pnpm readme:sync`.

## Verification

README sync and the full production documentation build passed.

## Activity log

### 2026-08-27 — Created

Issue created from the supplied project input.

### 2026-08-27 — Status changed from proposed to ready.

### 2026-08-27 — Status changed from ready to in-progress.

### 2026-08-27 — Status changed from in-progress to done.

## Completion summary

Shortened the proxy debugging article title consistently across the article and generated navigation.
