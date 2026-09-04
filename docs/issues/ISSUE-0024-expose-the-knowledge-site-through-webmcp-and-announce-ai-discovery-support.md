---
id: ISSUE-0024
title: "Expose the knowledge site through WebMCP and announce AI discovery support"
status: done
priority: medium
created: 2026-09-04
updated: 2026-09-04
closed: 2026-09-04
related_adrs: []
depends_on: []
---

# ISSUE-0024: Expose the knowledge site through WebMCP and announce AI discovery support

## Problem

The knowledge site publishes llms.txt but does not expose structured browser tools for AI agents, and visitors have no visible explanation of its AI-friendly discovery surfaces.

## Desired outcome

Expose read-only article discovery tools through WebMCP, add a concise homepage announcement covering WebMCP and llms.txt, and add a permanent AI access entry under My AI.

## Acceptance criteria

- [x] Register read-only `search_articles`, `read_article`, and `open_article` tools when `document.modelContext` is available.
- [x] Build the WebMCP article catalogue from published Markdown without exposing local engineering documentation or generated output.
- [x] Keep unsupported browsers and ordinary site navigation fully functional without errors.
- [x] Add a concise homepage announcement that mentions both WebMCP and `/llms.txt` without permanently pinning an article.
- [x] Add a permanent “AI 访问接口” entry to `/ai` linking to `/llms.txt` and explaining WebMCP availability.
- [x] Cover article search and lookup behavior with focused automated tests.
- [x] Pass `pnpm docs:build`, `git diff --check`, UTF-8 integrity checks, and desktop/mobile browser verification.

## Out of scope

- Adding an embedded AI chat interface or calling a model API.
- Adding write-capable or consequential WebMCP tools.
- Enrolling in or publishing a Chrome Origin Trial token.
- Committing, pushing, or deploying the change.

## Decisions

- Use a compact homepage announcement plus a permanent entry under “我的 AI”; do not disrupt the chronological article timeline with a pinned infrastructure post.
- Treat WebMCP as progressive enhancement and register tools only when the experimental browser API exists.
- Keep the initial WebMCP surface read-only and return structured JSON-compatible results.

## Implementation notes

- Added a pure WebMCP catalogue layer that ranks searches, normalizes clean URLs, rejects external or unpublished paths, and produces three read-only tool definitions.
- Registered the tools once from the persistent VitePress theme layout and used `AbortController` for cleanup; unsupported browsers return without changing site behavior.
- `read_article` fetches only catalogue-approved same-origin pages and extracts the rendered VitePress article body; `open_article` navigates only to a catalogue-approved route.
- Added a compact homepage announcement for WebMCP and `llms.txt`, plus a permanent third entry under “我的 AI”.
- TDD red states were observed for the missing core module and missing tool factory before each implementation slice passed.

## Verification

7 Node tests, production build, diff check, UTF-8 checks, desktop and 375px browser inspection, and read-only code review passed.

## Activity log

### 2026-09-04 — Created

Issue created from the supplied project input.

### 2026-09-04 — Status changed from proposed to ready.

### 2026-09-04 — Status changed from ready to in-progress.

### 2026-09-04 — Status changed from in-progress to done.

## Completion summary

Added progressive WebMCP article tools, a homepage AI-discovery announcement, and a permanent WebMCP/llms.txt entry under My AI.
