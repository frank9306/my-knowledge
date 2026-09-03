---
id: ISSUE-0021
title: "Add explanatory illustrations to the You² product article"
status: done
priority: medium
created: 2026-09-03
updated: 2026-09-03
closed: 2026-09-03
related_adrs: []
depends_on: []
---

# ISSUE-0021: Add explanatory illustrations to the You² product article

## Problem

The You² product article currently has no visual explanation of its central product thesis, three-layer memory model, or staged evolution.

## Desired outcome

Add a coherent set of finished 16:9 blue engineering hand-drawn knowledge-card PNGs with deterministic Chinese labels, confirmed watermark, captions, alt text, and verified article integration.

## Acceptance criteria

- [x] Add three distinct 1600×900 PNG knowledge cards covering the article thesis, three-layer memory model, and five-stage evolution.
- [x] Use text-free generated foundations and add all Chinese titles, labels, takeaways, and the confirmed `Frank 的知识库` watermark deterministically.
- [x] Embed each image next to the paragraph it explains with a descriptive caption, alt text, and conceptual-illustration disclosure.
- [x] Pass the `write-articles` draft and image-spec checks, full-size and approximately 750 px visual inspection, `git diff --check`, and `pnpm docs:build`.

## Out of scope

- Changing the You² product concept or adding unsupported product claims.
- Adding documentary screenshots, charts with invented values, or model-generated Chinese text.
- Adding the article to recommended reading.

## Decisions

- Use three composition archetypes: convergence scene, layered cutaway, and left-to-right journey.
- Use the confirmed watermark `Frank 的知识库` consistently at the bottom right.
- Keep only final PNG assets in the repository; composition JSON and SVG files are temporary production artifacts.

## Implementation notes

- Added three finished knowledge-card PNGs under `docs/public/images/blog/you2/` and embedded them beside the claims they explain.
- Used the `write-articles` default warm-paper, colored-pencil, restrained-watercolor style with one recurring blue-white robot and three distinct compositions: workbench flow, layered cutaway, and gated journey.
- Used the user-supplied image only as a typography reference. All Chinese copy was typeset deterministically with heavy `Microsoft YaHei`, compact hierarchy, high-contrast label fills, and dark blue, green, or orange borders.
- Replaced the rejected thin handwritten typography and earlier monochrome foundations. Kept `Frank 的知识库` as the confirmed bottom-right watermark.
- Article review score: 46/50 (factual integrity 10, structural clarity 9, precision and density 9, narrative momentum 9, image-text fit 9). Each final image scored at least 46/50 with no hard failure under the image rubric.

## Verification

write-articles draft and image-spec checks passed; full-size and 750 px visual inspections passed; git diff --check passed; pnpm docs:build passed.

## Activity log

### 2026-09-03 — Created

Issue created from the supplied project input.

### 2026-09-03 — Status changed from proposed to ready.

### 2026-09-03 — Status changed from ready to in-progress.

### 2026-09-03 — Status changed from in-progress to done.

## Completion summary

Added three finished You² knowledge-card illustrations using the default blue engineering hand-drawn style, a consistent robot character, user-approved heavy typography, deterministic labels, captions, alt text, and the confirmed watermark.
