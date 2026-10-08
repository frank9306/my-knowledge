---
id: ISSUE-0028
title: "Redesign the knowledge site as an interactive knowledge atlas"
status: in-progress
priority: high
created: 2026-09-30
updated: 2026-10-08
closed:
sources: ["User-approved Knowledge Atlas direction, 2026-09-30"]
related_adrs: []
depends_on: []
---

# ISSUE-0028: Redesign the knowledge site as an interactive knowledge atlas

## Problem

The current archive-oriented visual system and CRT mascot no longer match the desired identity. The site needs a complete visual and copy redesign while preserving its published content, routes, search, filtering, remote AI sources, and discovery interfaces.

## Desired outcome

Adopt the approved Knowledge Atlas direction across the homepage, collections, AI overview, navigation, and article reading surfaces, with production-ready Chinese copy, responsive behavior, accessibility, and verified build output.

## Acceptance criteria

- [ ] The homepage matches the approved Knowledge Atlas direction with a two-column hero, meaningful topic map, prominent search entry, and asymmetric article discovery section.
- [ ] Navigation, homepage, favorites, AI overview, remote-source surfaces, and article reading styles share the new ink-navy, ice-white, and cobalt design system in light and dark modes.
- [x] Chinese interface copy consistently presents the site as a reusable engineering knowledge system rather than an archive.
- [ ] Existing routes, article data, local search, favorites filters, recent-update state, WebMCP registration, `llms.txt`, and remote GitHub loading behavior remain intact.
- [ ] Desktop and 375px layouts have no material overflow, preserve readable hierarchy, and expose visible keyboard focus.
- [x] Reduced-motion users receive a static but complete experience.
- [x] The production build and the homepage design regression check pass.
- [ ] Rendered desktop and mobile views are inspected in a real browser against the approved concept image.

## Out of scope

- Rewriting article bodies or changing published article slugs.
- Adding a new CMS, search backend, analytics provider, or frontend framework.
- Publishing or deploying the redesign.

## Decisions

- Use the user-approved A direction, "Knowledge Atlas", as a complete visual overhaul.
- Preserve information architecture and production-facing routes while rewriting labels and supporting copy.
- Retire CRT-404 from the rendered homepage. The knowledge map becomes the single signature element.
- Keep VitePress and the existing Vue components; implement the new visual system with project-owned CSS and SVG-like HTML structure rather than a new component dependency.
- Use one cobalt accent, restrained 4-6px radii, structural borders, and no shadows or decorative gradients.

## Implementation notes

Implemented the root design contract, shared light/dark theme tokens, homepage topic map, article search and discovery, collection surfaces, AI overview, navigation copy, article presentation, and homepage static regression check. Retained existing routes and source loaders. Homepage search keeps the slash shortcut and provides an actionable submit button. Featured content follows actual update order rather than fabricated recommendations or dates.

## Verification

- `pnpm docs:build`: passed, including README sync, design lint (zero errors/warnings), homepage check, client/server compilation and static page rendering. Build emits a non-fatal chunk-size warning.
- `node --test tests/archive-state.test.mjs tests/webmcp.test.mjs`: 7 passed, 0 failed. Covers existing search/filter/pagination helpers and read-only WebMCP contracts, not browser interaction.
- `git diff --check`: passed.
- Read-only completion review of the task-owned working-tree diff against HEAD identified search-arrow and ordering regressions, repaired before final build. No outstanding P0/P1 source-review findings; runtime visual verification remains required.
- Browser verification attempted via in-app browser on both `127.0.0.1:5173` and `localhost:5173`; both returned `net::ERR_BLOCKED_BY_CLIENT`. Chrome provider unavailable. No desktop/mobile screenshot, contrast measurement, or pixel-fidelity result is claimed.
- Dev preview is running at `http://localhost:5173/`; opening in Codex was requested and returned queued.
- Brain CLI is unavailable; no brain files were hand-edited.

## Activity log

### 2026-09-30 — Created

Issue created from the supplied project input.

### 2026-09-30 — Status changed from proposed to ready.

### 2026-09-30 — Status changed from ready to in-progress.

## Completion summary

Implementation and automated checks are complete. Issue remains in-progress because real-browser desktop/mobile and visual acceptance checks could not be completed in this environment. On 2026-10-08 the user explicitly requested publication through the existing GitHub Pages pipeline. Deployment outcome is verified separately from the pending visual acceptance criteria.

### 2026-10-08 — Publication authorized

User requested publication. Stage only the redesign and its documentation; preserve unrelated notes and ISSUE-0026/0027 changes. Verify the GitHub Pages workflow and public homepage after pushing.
