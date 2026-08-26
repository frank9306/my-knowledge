---
id: ISSUE-0002
title: "Align knowledge site styling with personal site"
status: done
priority: normal
created: 2026-08-26
updated: 2026-08-26
closed: 2026-08-26
related_adrs: []
depends_on: []
---

# ISSUE-0002: Align knowledge site styling with personal site

## Problem

The knowledge site and personal site use visibly different color, typography, spacing, navigation, and content-list treatments, weakening cross-site brand consistency.

## Desired outcome

The VitePress knowledge site adopts the personal site visual language while preserving its documentation information architecture, light/dark support, and draggable 3D CRT archivist.

## Acceptance criteria

- [x] Align global color, typography, spacing, borders, controls, and navigation with the `personal-site` design language.
- [x] Restyle the knowledge homepage as a dark editorial surface while preserving its existing content destinations.
- [x] Preserve the draggable, keyboard-interactive 3D CRT archivist as the knowledge site's signature exception.
- [x] Preserve VitePress sidebar, local search, article navigation, light/dark switching, routes, and content behavior.
- [x] Verify desktop and 375px layouts in a real browser with no material overflow or console errors.
- [x] Pass the project design lint, home scene check, and production build.

## Out of scope

- Rebuilding the site with the React implementation from `personal-site`.
- Changing article content, routes, search behavior, or deployment configuration.
- Adding dependencies or removing the 3D CRT implementation.

## Decisions

- Reuse the personal site's charcoal canvas, warm-white type, restrained blue signal, hairline rules, and editorial layout rhythm.
- Keep VitePress light/dark support, with dark as the default brand presentation.
- Keep the 3D CRT archivist as an intentional, documented exception to the otherwise restrained visual system.

## Implementation notes

- Reference implementation: `E:\private-store\myproject\webfrank\personal-site`.
- Updated the design contract to the shared Webfrank charcoal, warm-white, muted-blue, hairline-rule, editorial-spacing language.
- Made dark the default VitePress appearance while preserving the native appearance toggle.
- Restyled the VitePress navigation, documentation content, homepage sections, lists, controls, and responsive layout.
- Preserved the transparent draggable CRT and its existing interaction implementation; no dependency or route changes were made.

## Verification

pnpm docs:build passed; 1440px and 375px Playwright checks showed no overflow; representative mobile article rendered without page errors; brain lint-links and git diff --check passed.

## Activity log

### 2026-08-26 — Created

Issue created from the supplied project input.

### 2026-08-26 — Status changed from proposed to ready.

### 2026-08-26 — Status changed from ready to in-progress.

### 2026-08-26 — Status changed from in-progress to done.

## Completion summary

Aligned the VitePress knowledge site with the Webfrank personal-site visual language while preserving the draggable 3D CRT archivist and documentation behavior.
