---
id: ISSUE-0018
title: "Embed an interactive Harness engineering mind map"
status: cancelled
priority: medium
created: 2026-09-01
updated: 2026-09-01
closed: 2026-09-01
related_adrs: []
depends_on: []
---

# ISSUE-0018: Embed an interactive Harness engineering mind map

## Problem

The Harness Engineering archive page only exposes a static knowledge-map image, so readers cannot freely collapse branches, zoom, pan, or inspect the problem-solution hierarchy on the page.

## Desired outcome

Replace the static map on the existing archive page with a reusable, dependency-free Vue and SVG mind map whose branches, styling, viewport, pointer interactions, and keyboard interactions are controlled by the site.

## Acceptance criteria

- [ ] Replace the static knowledge-map image on `docs/blog/harness-engineering-practical-series.md` with an in-page interactive Harness problem-solution mind map.
- [ ] Include all 44 researched problems and their paired solutions under the six established categories.
- [ ] Let readers toggle any non-leaf branch, expand all, collapse to categories, reset the viewport, drag to pan, and use the mouse wheel or toolbar to zoom.
- [ ] Keep node toggles and toolbar controls keyboard-operable, visibly focused, and labelled for assistive technology.
- [ ] Reuse VitePress design tokens, follow the site's light/dark theme, and provide responsive behavior without an iframe, remote runtime, or new dependency.
- [ ] Pass design lint, the home scene check, and the production VitePress build; inspect the rendered interaction at desktop and mobile widths.

## Out of scope

- Editing or embedding the generated `.xmind` file.
- Persisting a reader's collapsed state between visits.
- Turning the mind map into a general-purpose visual editor.

## Decisions

- Implement the visualization with Vue 3 and native SVG instead of adding D3 or embedding XMind's remote iframe viewer.
- Reuse the existing Harness Engineering archive route so the change improves an established surface and does not add another article entry.
- Treat the previously generated XMind topic tree as the content source for the 44 problem-solution pairs.

## Implementation notes

- The repository has no D3 or test framework. Keep layout and interaction logic local and dependency-free; verify through production build and rendered browser checks.

## Verification

- `pnpm exec vitepress build docs` passed; the generated archive page contains both `Harness 工程问题与解决办法` and `harness-map__canvas`.
- `pnpm docs:build` passed, including README sync, design lint, homepage scene check, and the production VitePress build.
- Rendered desktop and mobile interaction inspection remains pending.

## Activity log

### 2026-09-01 — Created

Issue created from the supplied project input.

### 2026-09-01 — Status changed from proposed to ready.

### 2026-09-01 — Status changed from ready to in-progress.

### 2026-09-01 — Fixed trusted component rendering

Kept raw Markdown HTML disabled globally and added an exact trusted directive for the Harness mind map. The production output now contains the interactive component instead of escaped component text.

### 2026-09-01 — Status changed from in-progress to cancelled.

## Completion summary

User requested removal of the interactive mind map from the website. The page was restored to the static knowledge-map image, and the six-category, 44-pair source dataset was archived under docs/research for later extraction.
