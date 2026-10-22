---
id: ISSUE-0035
title: "Implement and publish the quiet study redesign"
status: done
priority: high
created: 2026-10-22
updated: 2026-10-22
closed: 2026-10-22
sources: ["Owner-approved C mockup: knowledge-style-c-learn-and-note.png; implementation and direct publication authorized 2026-10-22"]
related_adrs: []
depends_on: []
---

# ISSUE-0035: Implement and publish the quiet study redesign

## Problem

The owner selected the C quiet-study mockup and approved the shorter headline 边学，边记。 The published Knowledge Atlas design no longer matches that approved direction.

## Desired outcome

Implement the approved quiet-study UI, retain content and discovery behavior, verify desktop/mobile and publish to the existing production domain.

## Acceptance criteria

- [x] The homepage follows the approved C mockup: ivory paper, Song-style headings, sage links, asymmetric desk-photo hero, “边学，边记。” and compact real article entries.
- [x] Reading, topic selection, article search, empty/reset states and progressive article loading work; existing routes, favorites, recent updates, RSS, WebMCP and remote sources remain available.
- [x] Navigation, article and collection surfaces share the quiet-study visual system; a fresh visit defaults to light while the dark option remains readable.
- [x] Desktop and 320/375/414/768px layouts are browser-verified, without horizontal overflow; focus, reduced motion and image loading are verified.
- [x] The production build, existing relevant tests, scoped browser checks and read-only review pass.
- [x] Task-owned changes are committed and deployed through the existing GitHub Pages workflow; the production domain serves the new design and key discovery endpoints.

## Out of scope

Article body rewrites, slug changes, recommendation additions, new frameworks/dependencies and unrelated working-tree changes. The standalone textbook retains its own reader presentation.

## Decisions

The owner selected C and its short copy, then explicitly requested implementation and direct publication. This supersedes the unfinished Knowledge Atlas visual direction in ISSUE-0028. Reuse the existing VitePress/Vue boundaries; do not rebuild routes.

Pre-generation design / existing-contract reuse:

- Responsibility: HomeLanding owns the homepage shell; HomeTimeline owns article discovery and its private query/page state; ThemeLayout owns shared layout, update/RSS controls and WebMCP lifecycle. Existing archive-state.mjs remains authoritative for search, ordering and slash-key behavior. No new business module or exports.
- Public interface: homepage at `/`; existing article data input and real route links; title/category/description search, topic buttons, reset and load-more actions. Empty input returns update-ordered articles, unmatched input exposes recovery, navigation unmount removes keyboard listeners. Existing `/favorites`, `/ai`, `/agents`, `/skills`, RSS and llms.txt remain supported.
- Hidden implementation: hero and article arrangement, private query/page refs and rendering limits stay inside HomeTimeline. Callers do not coordinate search/pagination or know metadata formatting. No new persistence or network API.
- Dependencies: ThemeLayout → HomeLanding → HomeTimeline → existing article loader/archive-state. CSS consumes shared semantic tokens. The public desk-photo asset is decorative, locally served and has a color fallback. No third-party runtime dependency or external font request.
- Files: edit HomeLanding.vue, HomeTimeline.vue, custom.css, config.ts, DESIGN.md, check-home-scene.mjs and tracking records; add public/images/quiet-study/desk.webp and a homepage browser check. Retain existing component files and reader CSS. ThemeLayout is edited only if required to keep the shared layout coherent.
- Verification: build and existing source check; browser checks at 1440px and 320/375/414/768px for the selected visual structure, all-article access, search/empty/reset, topics, keyboard, pagination, local search, favorites, RSS and theme; existing Node tests for search/WebMCP/RSS/book. No architecture checker is configured; this is a documented verification gap, not authority to install one.
- Caller walkthrough: normal reader follows a real article route; search/filter updates results and reset restores the archive; zero results offers reset; load-more retains the active query; navigation and unmount preserve established update/WebMCP cleanup. No new abstraction is needed.

Visual contract: custom quiet-study editorial theme from the owner's approved generated mockup; warm ivory `#faf9f6`, ink `#242923`, sage `#445d46`, muted dates `#6c7066`, Song display and local system sans body. Keep copy brief; use approved compact homepage labels while preserving real article titles in the expanded archive and accessible names, and actual frontmatter dates. First four articles form the compact initial view; all articles remain reachable through the visible “全部文章” action. Topic links are real filters, with search disclosed in the archive view so the approved first screen stays quiet. The light default replaces the previous dark-first choice; manual theme remains available.

## Implementation notes

Implemented the approved paper/sage/Song homepage, locally generated and WebP-encoded desk photography (141,560 bytes), compact approved article labels with full accessible titles, real archive search/topic filters/reset/loading, shared theme tokens, short navigation and collection/AI headings. Default new visits to light while retaining persistent theme selection. Moved homepage RSS/update controls to its footer and kept them in the navigation on other pages. Fixed the discovered slash shortcut conflict and 320/375px navigation crowding. No dependency, article body, slug or standalone reader changes.

Additional affected existing files: FavoritesCatalog.vue and AiOverview.vue (shorter headings and shared Song typography). Existing global stylesheet rules are preserved with a scoped new theme override block. The approved design replaces the old visual contract; check-home-scene.mjs now enforces that new contract and retains the standalone reader/shared-canvas checks.

## Verification

- Red: the new public-page browser check failed on the old positioning headline before implementation. Later browser checks exposed the double search shortcut and narrow navigation overflow; both were corrected and rechecked.
- `pnpm docs:build`: passed, including README sync, design lint (zero errors/warnings), homepage contract, client/server compilation, rendering and sitemap. The existing non-fatal chunk-size warning remains. A local preview resource-index cache returned 404 for the new CSS after rebuilding; restarting that preview process resolved it, and production-artifact browser checks then passed.
- `node --test tests/archive-state.test.mjs tests/rss-subscription.test.mjs tests/rss.test.mjs tests/static-book-images.test.mjs tests/webmcp.test.mjs`: 13 passed, zero failed.
- `node tests/quiet-study.browser.mjs <installed-playwright> http://127.0.0.1:4174 <review-folder>` with installed Chromium: passed against built output. Covers 1440/768/414/375/320px homepage/article/favorites/AI layouts, actual navigation bounds, image decoding, all-article access, search/empty/reset/pagination, topic selection, slash focus, Ctrl+K local search, mobile menu, favorites filtering, persistent manual theme, focus and reduced motion. No runtime errors. Inspected desktop/mobile light/dark screenshots.
- Measured body/date/link contrast: light 14.08/4.81/6.88, dark 13.50/7.92/9.48. These are measured role colors, not a claim of full accessibility certification.
- `node tests/rss-subscription.browser.mjs <installed-playwright> <installed-chromium> <review-folder>`: passed real clipboard copy, intent hook, denied-copy recovery, keyboard/Escape/outside dismissal and desktop/375px layout. Analytics ingestion is simulated.
- `node tests/static-book-navigation.browser.mjs <installed-playwright> <installed-chromium>`: passed entry, direct directory, local illustrations and chapter navigation.
- Read-only review base: c72e9a7, `git diff c72e9a7 --` scoped to the listed implementation and tracking files, plus new browser check and image. The new visual contract intentionally replaces prior Knowledge Atlas checks; reader contracts and existing behavior helpers are preserved. Review found the retained page count on reopening the archive; reset on collapse before final verification. No remaining P0/P1 or actionable P2/P3 source findings. No project architecture checker or native-device coverage is claimed. Brain CLI is unavailable; no brain files were hand-edited.
- Publication: implementation commit `31f12f262be8a534ee62b2d65112a26743b11c93` is on origin/main. [GitHub Pages run 39746495534](https://github.com/frank9306/my-knowledge/actions/runs/39746495534) completed successfully (build and deploy). The public-page browser suite passed against https://knowledge.webfrank.top at all five widths, including live search, mobile navigation, persistent theme and filters. Twelve live route/asset checks passed for home, collections, AI and remote-source entry pages, textbook, RSS, llms.txt, sitemap, hero and compiled CSS; the live WebP bytes match the source. Live desktop/mobile screenshots are saved in the originating task outputs. Only task-owned files were staged; original notes, ISSUE-0026/0027, September Changelog and their index rows remain local.

## Activity log

### 2026-10-22 — Created

Issue created from the supplied project input.

### 2026-10-22 — Status changed from proposed to ready.

### 2026-10-22 — Status changed from ready to in-progress.

### 2026-10-22 — Status changed from in-progress to done.

## Completion summary

Implemented and published the approved quiet-study redesign with concise copy, responsive reading/index surfaces and preserved discovery tools. Local and production browser checks, 13 tests, build and read-only review passed; GitHub Pages run 39746495534 and production endpoints are verified.
