---
id: ISSUE-0003
title: "Load AGENTS.md and Agent Skills from GitHub at runtime"
status: done
priority: medium
created: 2026-08-26
updated: 2026-08-26
closed: 2026-08-26
related_adrs: []
depends_on: []
---

# ISSUE-0003: Load AGENTS.md and Agent Skills from GitHub at runtime

## Problem

The public AGENTS.md and Agent Skills pages are manually copied snapshots, so they become stale whenever the source repositories change.

## Desired outcome

The two VitePress pages fetch and render the latest public content from the configured GitHub sources in the browser, with accessible loading, error, retry, and source-link states.

## Acceptance criteria

- [x] `/agents` fetches the latest `instructions/core.md` from `frank9306/ai-environment` in the browser and preserves the source text faithfully.
- [x] `/skills` discovers public `SKILL.md` files from `frank9306/agent-skills` and renders their current names, descriptions, categories, and source links.
- [x] Both pages expose accessible loading, failure, retry, and upstream-source states without requiring a new dependency.
- [x] The pages remain responsive at 375px and the production VitePress build succeeds.

## Out of scope

- Fetching private Skills or authenticated GitHub content.
- Rendering arbitrary remote Markdown as trusted HTML.
- Adding a server-side cache or proxy service.

## Decisions

- Fetch public GitHub data at browser runtime so the static GitHub Pages deployment does not need rebuilding when source content changes.
- Render `core.md` as source text and parse only the controlled YAML frontmatter fields needed for the Skills catalog; do not inject remote HTML.

## Implementation notes

- Added route-specific Vue components through the VitePress `doc-footer-before` slot while preserving `markdown.html: false`.
- Switched from `raw.githubusercontent.com` to the GitHub Contents API after runtime verification exposed repeated Raw host timeouts in the local network environment.
- The Skills page uses the repository tree as the discovery source and the repository README as an optional description source, reducing the request count and preserving a useful fallback.
- Remote content is rendered as text or parsed fields; no remote HTML is injected.

## Verification

pnpm docs:build passed; GitHub API verification discovered 18 Skills and decoded both source documents; 375px Edge loading-state inspection and git diff --check passed.

## Activity log

### 2026-08-26 — Created

Issue created from the supplied project input.

### 2026-08-26 — Status changed from proposed to ready.

### 2026-08-26 — Status changed from ready to in-progress.

### 2026-08-26 — Status changed from in-progress to done.

## Completion summary

Replaced manually maintained AGENTS.md and Agent Skills snapshots with safe runtime GitHub API views, including automatic Skill discovery and accessible recovery states.
