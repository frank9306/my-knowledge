---
id: ISSUE-0029
title: "Add RSS subscriptions to the knowledge site"
status: done
priority: medium
created: 2026-10-09
updated: 2026-10-09
closed: 2026-10-09
related_adrs: []
depends_on: []
---

# ISSUE-0029: Add RSS subscriptions to the knowledge site

## Problem

The site has no RSS feed or subscription discovery entry.

## Desired outcome

Generate an RSS 2.0 feed from published articles during the production build and expose navigation and autodiscovery links.

## Acceptance criteria

- [x] Production build generates RSS 2.0 at /rss.xml with dated articles from the six public content sections, newest first, absolute links and stable GUIDs.
- [x] Feed excludes landing pages, drafts, invalid dates, engineering records and private notes; XML special characters remain valid.
- [x] Navigation and HTML autodiscovery expose the subscription URL.
- [x] Focused tests, production build and parsed XML verification pass.

## Out of scope

Publishing, deployment, full-text syndication and unrelated site redesign.

## Decisions

Use VitePress buildEnd and its real content loader to emit RSS 2.0 with article metadata and summaries. No new dependencies. Sources: https://www.rssboard.org/rss-specification and https://vitepress.dev/guide/data-loading.

## Implementation notes

Added docs/.vitepress/rss.mjs, connected the production build hook and exposed RSS in navigation and page head. Retained all unrelated working-tree edits. Brain CLI was not installed in the available global skill directories; no brain files were read or edited manually.

## Verification

9 automated tests passed; production build passed; actual XML parsed and all 73 article routes plus subscription discovery verified.

## Activity log

### 2026-10-09 — Created

Issue created from the supplied project input.

### 2026-10-09 — Status changed from proposed to ready.

### 2026-10-09 — Status changed from ready to in-progress.

### 2026-10-09 — Status changed from in-progress to done.

## Completion summary

Added automatically generated RSS 2.0 subscriptions for 73 published articles, with navigation and autodiscovery. No new dependencies; not deployed.

### 2026-10-09 — Publication authorized

User explicitly requested committing and pushing the RSS changes. Publish through the existing main-branch GitHub Pages workflow; retain unrelated notes and ISSUE-0026/0027 changes.
