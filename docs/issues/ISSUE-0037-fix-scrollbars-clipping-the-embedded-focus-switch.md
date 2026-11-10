---
id: ISSUE-0037
title: "Fix scrollbars clipping the embedded focus switch"
status: done
priority: medium
created: 2026-11-10
updated: 2026-11-10
closed: 2026-11-10
related_adrs: []
depends_on: []
---

# ISSUE-0037: Fix scrollbars clipping the embedded focus switch

## Problem

The owner screenshot shows native Windows scrollbars obscuring the navigation switch. Chromium with visible scrollbars reproduces intrinsic canvas sizing expanding a 96 by 58 iframe to 103 by 64 scrollable pixels.

## Desired outcome

Keep the entire embedded component within its iframe viewport with native scrollbars enabled, including desktop and mobile navigation.

## Acceptance criteria

- [x] With Chromium's native scrollbars enabled, the canvas and component fill the embedded viewport without overflow on desktop and in the mobile menu.
- [x] The desktop and mobile theme controls still switch and persist theme, and the production build passes.

## Out of scope

The standalone stage, shader, animation, and appearance bridge.

## Decisions

Reuse the module design in ISSUE-0040. The existing HTML owns embed layout. In embed mode, fit the stage to the iframe viewport and remove the canvas from grid sizing so the backing buffer cannot expand the layout. The host iframe and its message contract stay the same. Verify through the existing browser suite with native scrollbars and real iframe measurements.

## Implementation notes

Constrained the embed to the iframe viewport, left the standalone aspect ratios in place, and positioned the embedded canvas outside normal grid flow. The browser suite now enables native scrollbars and measures the viewport, scroll extents, component and active canvas for both navigation placements.

## Verification

- Red: the Windows Chromium browser suite reproduced an 81 × 43 client area inside the 96 × 58 desktop iframe when native scrollbars were enabled. A second measurement caught a fractional-height overflow after the scrollbar disappeared.
- Green: the same suite passed on the local dev server, including theme switching and persistence. Chromium viewport checks also passed at 1×, 1.25×, 1.5×, 1.75× and 2× device pixel ratios with nominal and fractional host sizes. Inspected desktop and mobile dark-theme captures.
- `pnpm docs:build`, all 13 tests via `node --test tests/*.test.mjs`, and `git diff --check` passed. The build asset hash matches the source. The build retained its pre-existing chunk-size warning.
- Scoped read-only review against the pre-fix HTML and existing browser test found no actionable issues. The changes affect only embed styling and its browser checks.

## Activity log

### 2026-11-10 — Created

Issue created from the supplied project input.

### 2026-11-10 — Status changed from proposed to ready.

### 2026-11-10 — Status changed from ready to in-progress.

### 2026-11-10 — Status changed from in-progress to done.

## Completion summary

Fixed native scrollbar clipping in the embedded focus switch on desktop and mobile navigation.
