---
id: ISSUE-0017
title: "Tighten the subagent and handoff articles"
status: done
priority: medium
created: 2026-08-31
updated: 2026-08-31
closed: 2026-08-31
related_adrs: []
depends_on: []
---

# ISSUE-0017: Tighten the subagent and handoff articles

## Problem

The two new Agent workflow articles are broader and more detailed than the intended reader need.

## Desired outcome

Reduce both articles to concise explanations of what each concept is, when to use it, and how to use it.

## Acceptance criteria

- [x] Reduce both articles to the concept, suitable scenarios, practical usage, and common mistakes.
- [x] Remove local Skill inventories and secondary workflow detail that is not needed to apply the concepts.
- [x] Preserve useful source links and pass `pnpm docs:build`.

## Out of scope

- Changing either title, adding illustrations, or changing recommended-reading curation.

## Decisions

- Keep each article independently readable and action-oriented rather than turning them into local workflow reference manuals.

## Implementation notes

- Rewrote both article bodies around four reader questions: what it is, when to use it, how to use it, and what commonly goes wrong.
- Removed local Skill matrices, extended governance discussion, and secondary platform detail.
- Preserved short, reusable delegation and handoff templates plus the primary AI Hero source links.

## Verification

pnpm docs:build passed, including generated navigation, design lint, homepage check, VitePress rendering, and sitemap generation.

## Activity log

### 2026-08-31 — Created

Issue created from the supplied project input.

### 2026-08-31 — Status changed from proposed to ready.

### 2026-08-31 — Status changed from ready to in-progress.

### 2026-08-31 — Status changed from in-progress to done.

## Completion summary

Reduced both Agent workflow articles to concise explanations focused on suitable scenarios, direct usage, and common mistakes.
