---
id: ISSUE-0032
title: "Localize textbook illustrations and fix static-book navigation"
status: done
priority: medium
created: 2026-10-15
updated: 2026-10-15
closed: 2026-10-15
related_adrs: []
depends_on: []
---

# ISSUE-0032: Localize textbook illustrations and fix static-book navigation

## Problem

Textbook bitmap figures retain English labels; VitePress intercepts same-origin static-book links and normalizes index.html to a missing SPA route.

## Desired outcome

Provide Chinese in-image labels while preserving technical data and make navigation to the book directory load the real static HTML document, then verify and publish.

## Acceptance criteria

- [x] Translate human-language text inside every textbook illustration; preserve mathematical notation, measured values, code, model names and linguistic tokens where they are the scientific object, with Chinese explanations where needed.
- [x] Publish local Chinese figure assets with a complete image/region audit, retain source attribution, recover any broken original illustration where source evidence exists, and inspect translated figures for missing labels or changed geometry.
- [x] Clicking book links from a VitePress page loads the real standalone book instead of a missing SPA route; direct directory URL and chapter links work.
- [x] Production build, image/HTML integrity checks, actual navigation regression and desktop/mobile visual inspection pass; deployment and live URLs are verified.

## Out of scope

Redrawing experimental curves, changing numeric data or formulas, altering unrelated site navigation, and touching existing unrelated notes or Issue edits.

## Decisions

The owner explicitly authorized Python/SVG text replacement on 2026-10-15 to preserve figure data and geometry, and requested publication. Prior authorization for parallel book translation remains applicable. Stage/push only this task's files and precise Issue-index row changes; preserve pre-existing ISSUE-0026/0027, notes and September changelog edits.

Design before generation: local figure localization is owned by the book's static asset directory, `docs/public/books/agentic-llms-zh/images/`; original raster pixels remain an embedded immutable base layer, with reviewed Chinese label overlays rendered as SVG. Translation maps identify source URLs/hashes and original-coordinate text rectangles; the asset builder rejects missing image/region decisions and records retained scientific identifiers. Region masks must not cover curves, arrows, formulae or values. Narrow/mobile layout reuses existing reader constraints; full-size figures remain accessible. The existing book build pipeline consumes the asset manifest and emits local figure URLs in all chapter and continuous-reading pages. The source HTML had one empty image URL, to be investigated separately rather than replaced speculatively.

Route root cause: VitePress 1.6.4's client router intercepts same-origin HTML anchors and normalizes `/index.html` into a directory route, for which this standalone public book has no VitePress page chunk. The existing Markdown renderer in `docs/.vitepress/config.ts` will mark this book's links for native browser document navigation, avoiding the SPA router and its static-page prefetch. Its public contract is the rendered anchor and successful browser navigation to the static book. A real-browser regression will first reproduce the current 404, then exercise the same link after the fix, direct directory loading and chapter navigation. No runtime service, dependency, broad routing override or generated-dist edit is introduced.

## Implementation notes

Inventoried 90 unique image URLs across 91 image references. Downloaded 89 originals, and identified one empty source URL in Figure 3.1. Windows OCR is available locally and supplies original-coordinate text boxes; all OCR content will be visually checked and translated, including manual additions where OCR misses labels. The owner selected deterministic Python/SVG editing instead of generative image editing. Figure 3.1 was recovered from original PDF page 65 at 4 pixels/point with a figure-only crop. All 90 source assets have local OCR region maps and manually reviewed translations; 1,589 translated overlays were initially generated. An immutable original raster is embedded in each SVG, all masks precede new text, and scientific stimulus text has Chinese comparison footers. Each chapter and the continuous edition use local SVG URLs with full-size links. Readable exceptions in low-resolution original artwork/game screenshots are recorded explicitly. Windows SVG newline normalization was fixed to keep audit hashes consistent with committed/deployed bytes. Source image width/height/aspect ratios are replaced by localized output dimensions so Chinese comparison footers retain their intended geometry. Final visual QA narrowed mixed numeric/formula labels to natural-language-only masks and introduced optional polygon erasers for slanted labels to preserve chart boundaries. Reader-facing notes distinguish source omissions or probable original typos from translation inference.

## Verification

The production build and actual-browser navigation regression pass. The regression covers the VitePress entry link, direct directory URL, chapter navigation, local SVG decoding and recovered Figure 3.1. All 23 chapters pass source comparison, including 681 MathML elements and executable code. Read-only review against baseline e0b51f566413eb798863f4e6d90c2e4f3f52acfd found no P0–P3 findings. It covered the tracked config/article diff, untracked static-book tests, current book/image builders, source/hash validation, escaped SVG text, output aspect ratios and polygon erasers. All 90 originals and their Chinese renderings were visually reviewed. Final verification passes: pnpm docs:build (README sync, DESIGN lint, homepage scene check, VitePress); 13 Node tests; native browser entry/directory/chapter/SVG decoding regression; 92 chapter/theme/desktop/mobile cases; six figure layout, natural aspect ratio and full-size zoom cases; source comparison for 2,780 translation units, 681 MathML elements and code; 90 embedded original hashes, 1,589 complete Chinese overlays, 91 image references and 117 build files byte-equal to their public sources. Final color sampling honors original ICC profiles and expresses overlay colors in sRGB; exact wedge colors and equation-adjacent boundaries were rechecked after correction. Publication commit 069856f9c992d79efff99970066f2cb2cefd9f80 deployed successfully in https://github.com/frank9306/my-knowledge/actions/runs/38673527121. All 117 reader files/assets return HTTP 200 and equal Git blobs after only the previously observed Cloudflare JS-detection suffix and DOI HTTPS rewrite. Homepage/article return 200. The live hydrated VitePress entry click opens the standalone book; direct directory access, chapter navigation, local Chinese SVG decoding and recovered Figure 3.1 pass. Initial direct headless-browser navigation timed out because Chrome did not honor the configured HTTP proxy; the harness now uses that existing proxy for live checks and waits for Vue hydration, and the rerun passes. Audited SVG files use scoped LF checkout attributes for reproducible hashes on Windows and Linux.

## Activity log

### 2026-10-15 — Created

Issue created from the supplied project input.

### 2026-10-15 — Status changed from proposed to ready.

### 2026-10-15 — Status changed from ready to in-progress.

### 2026-10-15 — Status changed from in-progress to done.

## Completion summary

Published Chinese text versions of 90 local textbook illustrations with preserved scientific data, full-size zoom, source audit and recovered Figure 3.1; fixed VitePress static-book navigation. Production build, 13 tests, 92 responsive/theme cases, six figure/zoom cases, all 117 live files and actual live navigation pass. Publication commit 069856f9c992d79efff99970066f2cb2cefd9f80.
