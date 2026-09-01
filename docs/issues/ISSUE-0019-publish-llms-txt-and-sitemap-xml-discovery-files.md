---
id: ISSUE-0019
title: "Publish llms.txt and sitemap.xml discovery files"
status: done
priority: medium
created: 2026-09-01
updated: 2026-09-01
closed: 2026-09-01
related_adrs: []
depends_on: []
---

# ISSUE-0019: Publish llms.txt and sitemap.xml discovery files

## Problem

The knowledge site does not currently expose an llms.txt discovery document, and the existing sitemap.xml generation needs explicit verification as part of the same public discovery surface.

## Desired outcome

Publish a concise llms.txt at the site root and verify that the production build emits a valid sitemap.xml for https://knowledge.webfrank.top.

## Acceptance criteria

- [x] Publish `https://knowledge.webfrank.top/llms.txt` from `docs/public/llms.txt` with the site summary and useful Markdown links to the main public sections.
- [x] Keep the file concise, UTF-8 encoded, and free of private or generated-only paths.
- [x] Preserve the existing VitePress-native sitemap configuration and confirm that a production build emits `sitemap.xml` with the canonical hostname.
- [x] Confirm `robots.txt` continues to advertise the canonical sitemap URL.
- [x] Pass the full `pnpm docs:build` production verification.

## Out of scope

- Adding crawler access-control rules beyond the existing `robots.txt` policy.
- Publishing or deploying the changes to GitHub Pages.
- Adding an `llms-full.txt` content dump.

## Decisions

- Use VitePress's existing native sitemap generator instead of adding a dependency or maintaining a hand-written XML file.
- Serve `llms.txt` as a repository-owned static asset from `docs/public/`.

## Implementation notes

- Added `docs/public/llms.txt` as a concise Markdown discovery document with links to existing public pages and the generated sitemap.
- Kept the existing VitePress `sitemap.hostname` configuration unchanged; the working-tree content of `docs/.vitepress/config.ts` hashes identically to `HEAD`.
- Removed proposed topic-directory links after confirming those directories do not contain landing `index.md` pages.
- No unit test was added because this is a copied static asset with no runtime behavior; production build output and focused file assertions provide the stable verification seam.

## Verification

pnpm docs:build passed; focused output, hostname, robots, link-target, UTF-8, and sensitive-data assertions passed; read-only review against 0ac8e611e02b449e9bbdc17cb46e0c4f5c00aeac found no issues.

## Activity log

### 2026-09-01 — Created

Issue created from the supplied project input.

### 2026-09-01 — Status changed from proposed to ready.

### 2026-09-01 — Status changed from ready to in-progress.

### 2026-09-01 — Status changed from in-progress to done.

## Completion summary

Added a concise root-level llms.txt discovery document and verified the existing VitePress-generated sitemap.xml and robots declaration.
