---
id: ISSUE-0030
title: "Add an RSS copy button and intent analytics"
status: done
priority: medium
created: 2026-10-09
updated: 2026-10-09
closed: 2026-10-09
related_adrs: []
depends_on: []
---

# ISSUE-0030: Add an RSS copy button and intent analytics

## Problem

Readers need to copy the feed address easily; the owner needs an honest metric for subscription intent.

## Desired outcome

Provide an accessible responsive RSS copy control with feedback and a best-effort rss-copy event in the existing analytics service; explain that identities and confirmed subscribers are not available.

## Acceptance criteria

- [x] Desktop and mobile navigation provide an RSS address copy button, feed link and visible selectable address.
- [x] Copy has pending, success and failure feedback, with manual recovery when Clipboard API is denied or unavailable.
- [x] Existing Umami receives rss-copy only after a successful copy; analytics absence or failure never blocks copying. No identity data is collected.
- [x] Controls are keyboard accessible, close on Escape/outside interaction, fit at 375px, and preserve current navigation and RSS discovery.
- [x] Production build and focused behavior checks pass; browser checks are attempted and limitations documented.

## Out of scope

Subscriber registration, identity collection, authenticated feeds, new backend/services, deployment and unrelated redesign.

## Decisions

Reuse the existing Atlas navigation tokens and Umami service. rss-copy means a successful address copy, not confirmed subscription or subscriber identity. No registration or new identity collection. RSS address comes from explicit themeConfig because VitePress strips head metadata from runtime site data.
Sources: https://docs.umami.is/docs/tracker-functions, https://docs.umami.is/docs/track-events, https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText and https://www.rssboard.org/rss-specification.

## Implementation notes

Added RssSubscribe.vue with a desktop/mobile trigger, readonly address, copy action, pending/success/manual states and original feed link. Escape restores trigger focus, outside click/focus and route changes dismiss the panel. Added copyRssAddress as the interaction entry for Clipboard/Umami ports; telemetry is best-effort and never blocks copying. Adjusted mobile header padding/title and narrowed the existing broad container selector so it cannot affect the hamburger icon. No dependencies added. Brain CLI remains unavailable; no brain files edited.

## Verification

12 tests and production build passed; real Chrome copy, denied-permission recovery, keyboard handling and desktop/375px navigation checks passed; analytics ingestion simulated.

## Activity log

### 2026-10-09 — Created

Issue created from the supplied project input.

### 2026-10-09 — Status changed from proposed to ready.

### 2026-10-09 — Status changed from ready to in-progress.

### 2026-10-09 — Status changed from in-progress to done.

## Completion summary

Added responsive RSS address copying with success/manual recovery and best-effort rss-copy intent analytics; subscriber identity is not collected.

### 2026-10-09 — Publication authorized

User explicitly requested committing and pushing this change through the existing main-branch GitHub Pages workflow. Preserve unrelated notes and ISSUE-0026/0027 edits.

Verification details: `node --test tests/*.test.mjs` passed all 12 tests; `pnpm docs:build` passed; `node tests/rss-subscription.browser.mjs <playwright-module> <chrome-executable>` passed real clipboard, keyboard/focus, permission-denial recovery and desktop/375px navigation checks. Analytics was simulated to avoid production test events. The configured statistics script returned Cloudflare 1033 during the previous check; live ingestion remains unverified and requires the existing service to recover. The copy button works independently. Existing homepage featured-image overflow is outside this change.
