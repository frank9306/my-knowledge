---
id: ISSUE-0034
title: "Strengthen the gradient and cover every site page"
status: done
priority: medium
created: 2026-10-16
updated: 2026-10-16
closed: 2026-10-16
related_adrs: []
depends_on: []
---

# ISSUE-0034: Strengthen the gradient and cover every site page

## Problem

The owner requests a slightly stronger background gradient across every website page, including independent static reader pages.

## Desired outcome

Use shared gradient colors across all VitePress and static-book pages while preserving reading contrast and print readability.

## Acceptance criteria

- [x] Slightly strengthen the lighter-top/deeper-bottom gradient in both themes.
- [x] Every generated VitePress HTML page and all standalone book pages load the shared gradient; desktop and mobile checks verify representative layouts.
- [x] Main, secondary and link text remain readable; standalone book print mode keeps a plain white background.
- [x] Production build, relevant tests and scoped read-only review pass.

## Out of scope

Content, interaction, layout changes, existing mobile overflow, dependencies and publication.

## Decisions

Reuse the existing theme and standalone-reader contracts in DESIGN.md, docs/.vitepress/theme/custom.css and docs/public/books/agentic-llms-zh/reader.css. Shared gradient primitives and the gradient definition belong to docs/public/site-canvas.css. VitePress loads this public asset through its existing head configuration; reader.css imports the same asset relative to its public directory. Each existing theme owner maps its chosen theme to the shared tokens, preserving manual VitePress theme selection and reader OS theme preference. No business module or public API changes. Verify all built HTML routes in both themes, plus representative 375px pages, contrast, scrolling and reader print. This CSS-only refinement uses actual browser measurements and build checks instead of unit tests that mirror declarations. Existing design/home checks remain the static gates; no architecture checker is configured.

## Implementation notes

Created one public canvas stylesheet with slightly stronger dark/light endpoints and the shared gradient. VitePress loads it globally; the standalone book imports it for its index, 23 chapters and continuous edition. Existing theme owners map their selected theme to these colors; manual main-site selection remains independent of OS preference. Navigation aligns with the brighter top. Updated main-site link and muted colors to retain contrast. Reader print rules retain white paper. Updated the existing homepage check to verify the new source of the unchanged ink-navy midpoint and both stylesheet consumers, rather than requiring the old literal in custom.css. Preserved existing unrelated changes and previous gradient work.

## Verification

- pnpm docs:build passed: README sync, design lint (zero errors/warnings), updated homepage contract check, client/server build and static rendering. The existing non-fatal bundle-size warning remains.
- node --test tests/archive-state.test.mjs tests/webmcp.test.mjs tests/rss.test.mjs tests/rss-subscription.test.mjs tests/static-book-images.test.mjs: 13 passed, zero failed.
- node .tmp/gradient-review/all-pages.mjs: 342 Chromium cases passed against the production preview, covering all 157 generated HTML pages (132 VitePress and 25 independent book pages) in both themes, plus 28 representative desktop/mobile cases at 1440x1000 and 375x812. All expose the shared fixed gradient without an opaque page layer at the measured canvas edge. Scrolling and book white-print checks pass. Exhaustive coverage blocks external requests and images; real local image decoding and navigation are independently verified below.
- Main, secondary, link and strong-link endpoint contrast minima are respectively 13.00, 6.10, 4.77 and 5.32 in dark; 13.41, 4.66, 4.66 and 4.68 in light. Manual VitePress light/dark selection also passes with the opposite OS theme preference.
- node tests/static-book-navigation.browser.mjs C:/Users/frank/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs passed: site-to-reader link, direct book directory, chapter navigation, local SVG decoding and recovered figure.
- Desktop/mobile dark/light screenshots and measurements are retained under .tmp/gradient-review/all-pages/. Inspected homepage and reader screenshots show the stronger vertical transition and readable content. Existing mobile overflow remains outside this background-only scope; no native-device or full visual-regression claim is made.
- Read-only review against 62eb28f3edd270cf045f2cf3352c6aa29b78fcac covers the task-owned DESIGN.md, VitePress config/theme, reader stylesheet, shared public canvas asset, updated existing check and Issue documentation. No actionable findings remain. The existing check still enforces the ink-navy midpoint at its new authority and additionally enforces both consumers; no exclusions or baseline rules were weakened. git diff --check passed. No project architecture checker or approved screenshot baseline is configured.
- The first build exposed the old literal-based theme check; its source mapping was updated for the intentional visual contract. The first browser crawl encountered stale preview asset inventory after a rebuild; restarting this task's preview resolved it, and the full rerun passed. No publication was requested.

## Activity log

### 2026-10-16 — Created

Issue created from the supplied project input.

### 2026-10-16 — Status changed from proposed to ready.

### 2026-10-16 — Status changed from ready to in-progress.

### 2026-10-16 — Status changed from in-progress to done.

## Completion summary

Strengthened the top-light/bottom-deep gradient and extended it to all 157 HTML pages, including the independent book reader, using one shared stylesheet. Production build, 13 tests, 342 browser cases, theme overrides and book navigation/print checks pass. Changes remain local.


### 2026-10-16 - Publication authorized

The owner approved the gradient and explicitly requested commit and publication. Publish only the background changes and their documentation through the existing main-branch GitHub Pages workflow; preserve unrelated notes, ISSUE-0026/0027 and September changelog changes. Deployment confirmation will be recorded after the workflow and live site have been checked.
