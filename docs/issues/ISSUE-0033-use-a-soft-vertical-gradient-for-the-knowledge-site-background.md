---
id: ISSUE-0033
title: "Use a soft vertical gradient for the knowledge site background"
status: done
priority: medium
created: 2026-10-16
updated: 2026-10-16
closed: 2026-10-16
related_adrs: []
depends_on: []
---

# ISSUE-0033: Use a soft vertical gradient for the knowledge site background

## Problem

The flat site canvas feels monotonous; the owner requests a lighter top and deeper bottom.

## Desired outcome

Apply a restrained top-to-bottom gradient to the shared VitePress canvas in both themes while preserving readable text and solid interactive surfaces.

## Acceptance criteria

- [x] Shared site canvas uses a soft vertical gradient with a lighter top and deeper bottom in light and dark themes.
- [x] Homepage, collection, AI overview and article pages expose the same background without opaque homepage layers hiding it.
- [x] Desktop and 375px browser checks confirm readable text, continuous background while scrolling, no new horizontal overflow compared with the original stylesheet, and usable navigation surfaces.
- [x] Production build and scoped read-only review pass.

## Out of scope

Content, layout, interactions, standalone textbook reader, dependencies and publication.

## Decisions

Reuse the existing theme contract in DESIGN.md and docs/.vitepress/theme/custom.css. The stylesheet owns theme tokens and the shared body canvas; homepage containers become transparent so they consume that canvas. Use theme-specific top/bottom tokens and one viewport-fixed linear gradient, keeping solid surface tokens for menus, code and popovers. Align the navigation to the top color and let the footer expose the shared canvas. No module, interface, dependency or layout boundary changes. Verify the rendered homepage, favorites, AI and one article at 1440px and 375px in both themes, including scrolled states, and run pnpm docs:build. This low-impact CSS-only change has no new behavior logic; browser inspection and measured computed styles provide useful feedback instead of an implementation-mirroring unit test. No architecture checker is configured; the existing design and home checks remain the applicable static gates.

## Implementation notes

Added theme-specific gradient endpoints, a single fixed body gradient, transparent homepage/footer containers and navigation aligned with the top color. Slightly deepened the light-theme accent to preserve small-text contrast over the darker gradient endpoint. DESIGN.md records the canvas contract. Preserved all pre-existing changes. No dependencies or business logic changed; no new unit tests were added for this visual-only CSS change.

## Verification

pnpm docs:build passed; 12 Node tests passed; 16 Chromium theme/viewport/page checks plus production smoke checks passed; contrast and git diff --check passed.

## Activity log

### 2026-10-16 — Created

Issue created from the supplied project input.

### 2026-10-16 — Status changed from proposed to ready.

### 2026-10-16 — Status changed from ready to in-progress.

### 2026-10-16 — Status changed from in-progress to done.

## Completion summary

Applied a soft lighter-top/deeper-bottom gradient across the shared knowledge-site canvas in both themes, with readable text and preserved surface styling. Production build, 12 existing tests, 16 browser cases and production smoke checks pass. Existing mobile overflow is unchanged; publication was not requested.


### 2026-10-16 - Publication authorized

The owner approved the gradient and explicitly requested commit and publication. Publish only the background changes and their documentation through the existing main-branch GitHub Pages workflow; preserve unrelated notes, ISSUE-0026/0027 and September changelog changes. Deployment confirmation will be recorded after the workflow and live site have been checked.


### 2026-10-16 - Publication verified

Implementation commit fe114ea353b9d2255eacb19e99c2d9dc6a10deb2 was pushed to main and deployed successfully by https://github.com/frank9306/my-knowledge/actions/runs/38886561373. The first push hit a transient TLS error; the retry succeeded. All 155 published HTML routes return HTTP 200 and reference the appropriate shared stylesheet. This is two fewer than the 157 local preview pages because unrelated untracked ISSUE-0026/0027 records were intentionally excluded from publication. The live site-canvas.css and reader.css match their committed Git blobs. Twelve real-browser live cases passed for dark/light home, article and standalone book pages at desktop and 375px sizes. No publication of unrelated notes or September changelog changes occurred. CI emitted existing bundle-size and upstream Actions runtime/runner migration warnings; build and deploy completed successfully.
