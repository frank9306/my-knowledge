---
id: ISSUE-0031
title: "Translate Agentic Large Language Models into Chinese and publish HTML"
status: done
priority: medium
created: 2026-10-15
updated: 2026-10-15
closed: 2026-10-15
related_adrs: []
depends_on: []
---

# ISSUE-0031: Translate Agentic Large Language Models into Chinese and publish HTML

## Problem

The owner wants a complete Chinese translation of arXiv 2610.13455v1 available in the knowledge site.

## Desired outcome

Publish a faithful chapter-organized Chinese HTML edition preserving equations, code, figures, citations, source provenance and CC0 license, with verified coverage and production deployment.

## Acceptance criteria

- [x] Translate all 23 chapters' prose, headings, captions and table text into Simplified Chinese, without abridging; retain original bibliography entries, code and mathematical notation.
- [x] Preserve chapter/section anchors, citations, equations, tables, code blocks and original figure links; attribute authors, source version and CC0, and label the edition as an AI translation.
- [x] Publish navigable Chinese HTML with chapter navigation, readable desktop/mobile layout and an entry in the site's article discovery.
- [x] Verify translation-unit coverage, placeholder integrity, internal links and non-ASCII encoding; run production build and inspect desktop/mobile in a real browser.
- [x] Publish through the existing GitHub Pages workflow and verify the deployed translation URL, preserving unrelated working-tree changes.

## Out of scope

Rewriting the book, inventing new illustrations, modifying the site's shared architecture, and changing unrelated notes or existing user work.

## Decisions

The user explicitly requested full translation, HTML creation and publication to my-knowledge, and authorized parallel translation agents on 2026-10-15. Publication includes the minimal commit/push required by the existing Pages workflow; only this task's files and exact generated index additions may be included.

Pre-generation module design: this is a static book edition, owned by `docs/public/books/agentic-llms-zh/` with a VitePress discovery article at `docs/ai-agent/agentic-llms-chinese.md`. The publication pipeline consumes the immutable v1 HTML and chapter translation dictionaries, rejects missing units or altered inline placeholders, and emits chapter HTML plus a complete reading edition. The reader's public interface is ordinary chapter/section hyperlinks and a native chapter table of contents. Document owns vertical scrolling; long tables/code/equations scroll locally; navigation reflows at 375px. Original MathML, code, citations, bibliography metadata and image URLs remain source-owned. HTML scripts/forms/event handlers from the source are removed. Temporary extraction/build/QA tools and translation batches live in the chat's `work/`; no runtime service or dependency is introduced. Existing DESIGN.md tokens define the reader colors and type. Failure walkthrough: a missing translation or unresolved anchor prevents publication; an unavailable original image still has alt/caption and a source link. Verification exercises the generated reader and the existing `pnpm docs:build`, with desktop/375px browser inspection and deployed HTTP checks.

## Implementation notes

Fetched the complete v1 HTML directly from arXiv (4,086,319 bytes). Confirmed arXiv links to CC0 1.0. Existing unrelated changes in September changelog, ISSUE-0026/0027, notes and Issue index were present before the task and must be preserved. Read relevant Project Brain decisions through its CLI.

## Verification

23/23 chapters, 2,490 main translation units and 290 SVG/callout units (2,780 total) are translated. Exact ID coverage, duplicate-key checks, per-unit protected-placeholder multisets, UTF-8 replacement-character checks and length screening pass. Generated HTML retains all 681 MathML elements and 91 original image elements; source code token text and mathematical notation are unchanged. Internal page/anchor validation passes for all 25 HTML pages. Original images remain linked to arXiv and require network access; one image loaded successfully in a real browser, with later intermittent image-loading timeouts observed.

`pnpm docs:build` passes, including README sync, design lint and homepage structure check; Vite's existing large-chunk warning remains. Real Chrome inspected all 23 chapters in dark/light at 1440px and 375px (92 passing cases), including document scrolling, pinned desktop chapter navigation, mobile chapter navigation, keyboard skip link and horizontal overflow. Screenshots also inspected figures, MathML, code and SVG diagrams. Listing presentation whitespace was normalized without changing code token text; long code/tables scroll locally. Independent semantic review sampled 44 longest paragraphs across 22 chapters, with the main agent reviewing the remaining chapter's two longest paragraphs. Two small omissions in ch13-0073 and ch14-0061 were repaired; this sampling does not claim sentence-by-sentence human review. Three malformed comparison glyphs in source HTML were retained with explicit translator notes.

Published source commit `e823625a7c72b530e15d4df400b5013503f8a15c`. GitHub Pages build/deploy run https://github.com/frank9306/my-knowledge/actions/runs/38668868098 completed successfully. All 25 HTML pages and the stylesheet return HTTP 200 and match committed content after accounting for the existing Cloudflare terminal JS-detection injection and its observed HTTPS rewrite of one DOI URL. Article https://knowledge.webfrank.top/ai-agent/agentic-llms-chinese and homepage entry are verified live. Reading URL: https://knowledge.webfrank.top/books/agentic-llms-zh/index.html . Local CRLF versus Git LF is the only local-source byte difference. Existing unrelated working-tree changes remain intact.

Read-only release review used `git diff --cached HEAD` for this task's 31 staged files against base `67f2d5fe14664082e0d8cd020b68baa5d2395924`. No remaining blocking findings; only this task's Issue-index row is staged, while existing ISSUE-0026/0027 rows and notes remain unstaged. `git diff --cached --check` passes. The repaired chapters 13/14 also pass eight focused browser cases after the 92-case matrix.

## Activity log

### 2026-10-15 — Created

Issue created from the supplied project input.

### 2026-10-15 — Status changed from proposed to ready.

### 2026-10-15 — Status changed from ready to in-progress.

### 2026-10-15 — Status changed from in-progress to done.

## Completion summary

Published and verified the complete 23-chapter Chinese HTML edition with 2780 translated units, source attribution, preserved mathematical notation/code/citations, mobile reading and a downloadable HTML archive.
