---
id: ISSUE-0038
title: "Size the pixel study switch to fit site navigation"
status: done
priority: medium
created: 2026-11-10
updated: 2026-11-10
closed: 2026-11-10
related_adrs: []
depends_on: []
---

# ISSUE-0038: Size the pixel study switch to fit site navigation

## Problem

The owner reports the switch looks out of scale. The 58px desktop iframe nearly fills a 64px navbar beside a 40px search button. The mobile version grows to 89px.

## Desired outcome

Use one compact 76 by 46 CSS pixel footprint in desktop navigation and the mobile menu, leaving a 42px minimum hit target.

## Acceptance criteria

- [x] Desktop and mobile navigation use a 76 × 46 px embed with at least a 42 px hit target in both dimensions.
- [x] The switch stays centered in the desktop navbar and mobile menu, with no iframe overflow or loss of theme persistence.
- [x] Browser checks and the production build pass.

## Out of scope

Standalone presentation, rendering logic, theme behavior, and unrelated navigation controls.

## Decisions

Reuse the ISSUE-0040 theme layout and iframe contract. Site CSS owns the iframe footprint, which should be shared across both placements. The existing HTML retains its current responsive capsule geometry and minimum button height. In a 46 px viewport, the drawn capsule is about 64 × 35 px beside the 40 px desktop search button. Verify through the existing browser suite.

## Implementation notes

Set the shared embed size in the existing host CSS. The existing HTML button supplies the 42 px hit height.

## Verification

- Red: the browser suite measured 96 × 58 px before the CSS change. Green: both placements measured 76 × 46 px, had at least 42 px hit targets, and passed the native-scrollbar and theme persistence checks in `tests/quiet-study.browser.mjs`.
- Verified desktop vertical alignment and mobile horizontal centering in Chromium and inspected dark-mode captures at 2× device pixel ratio.
- `pnpm docs:build`, all 13 existing Node tests, and `git diff --check` passed. Scoped review found no actionable issues in the shared sizing rule or the assertions. The existing bundle-size warning remains.

## Activity log

### 2026-11-10 — Created

Issue created from the supplied project input.

### 2026-11-10 — Status changed from proposed to ready.

### 2026-11-10 — Status changed from ready to in-progress.

### 2026-11-10 — Status changed from in-progress to done.

## Completion summary

Sized the pixel study switch to fit desktop and mobile site navigation while preserving its 42px hit target.
