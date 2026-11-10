---
id: ISSUE-0040
title: "Replace theme toggle with the pixel study switch"
status: done
priority: medium
created: 2026-11-10
updated: 2026-11-10
closed: 2026-11-10
related_adrs: []
depends_on: []
---

# ISSUE-0040: Replace theme toggle with the pixel study switch

## Problem

The site uses the stock appearance button. The owner requested a pixel study with a liquid glass slider and a reversible focus story.

## Desired outcome

Deliver one self-contained HTML switch and embed it in desktop navigation and the mobile menu. Light and dark remain persistent VitePress appearance settings.

## Acceptance criteria

- [x] Standalone HTML runs without dependencies and follows the specified stage, palette, room composition and reversible story.
- [x] The switch supports click, drag, keyboard, accessible stage announcements and a committed change event.
- [x] Rendering uses crisp integer-scaled pixel art, a WebGL2 lens and light field, 2D fallback, reduced motion and off-screen suspension.
- [x] Desktop navigation and the mobile menu replace the default controls and preserve the VitePress appearance setting through reload.
- [x] Browser checks cover both entry points and the production build passes.

## Out of scope

Deployment, unrelated site styling, and article changes.

## Decisions

The standalone file uses the owner-specified full stage. The navigation displays the same component in compact, transparent embed mode. Left maps to VitePress light and right to dark. The site's paper colors remain owned by its theme.

Pre-generation design:

- `docs/public/focus-switch.html` owns the entire switch, including animation, input, timeline, indexed world drawing, both compositors and lifecycle. Its button exposes a native `change` event when its Boolean state changes. Standalone defaults to light and needs no host.
- A same-origin iframe in `ThemeLayout.vue` uses `?embed` and synchronizes state through a scoped ready/state/change message exchange. The host validates the sender, origin and Boolean payload. Host updates do not emit a change. Vue uses the existing VitePress `isDark` setting for persistence, including first paint and cross-tab changes. No renderer details or story state cross the boundary.
- Desktop navigation and the mobile navigation screen use the same URL and contract. Only the visible switch animates. Native buttons remain available until the iframe handshake; GPU initialization failure activates Canvas 2D within the same file.
- The existing browser suite exercises the actual site and persisted appearance. Focused browser coverage also checks standalone click, keyboard, drag, direction, stage names, native events, rendering paths and reduced motion. Run `pnpm docs:build` and relevant existing tests. The repository has no separate architecture checker.

## Implementation notes

The host retains the default theme control until the iframe is ready. The embed forwards Ctrl/Cmd+K and slash to the site's existing search handlers when it has focus. The 768–920px navigation uses compact search and RSS icons to fit the new control. The requested glass and palette apply to the switch as a local visual exception.

## Verification

- Red: the extended `tests/quiet-study.browser.mjs` timed out waiting for the replacement switch on the original layout. The first integrated run exposed lost Ctrl+K focus and tablet overflow. Both were reproduced, corrected and rechecked.
- `pnpm docs:build` passed with the existing non-fatal chunk-size warning. The copied HTML is byte-identical to the source. `node --test tests/*.test.mjs` passed all 13 tests. `git diff --check` passed.
- The existing browser suite passed in Chromium against the development site and production preview. It exercises desktop and mobile theme switching, persisted dark mode, keyboard and search, and navigation bounds at 320, 375, 414, 768, 960, 1024 and 1440px on representative routes.
- A focused Chromium run opened the single HTML by `file://`, checked WebGL2, drag, click, keyboard, phase transitions and native change events, forced the 2D fallback, and checked reduced-motion idle and off-screen frame suspension. Inspected day, night, mobile and fallback screenshots. A built-site mobile touch run verified the hidden native button, WebGL2 and dark theme persistence after reload.
- Read-only review scoped to the HTML addition and `git diff 00804a2 -- docs/.vitepress/theme/ThemeLayout.vue docs/.vitepress/theme/custom.css tests/quiet-study.browser.mjs`. No outstanding actionable findings. The design detector flagged the intentionally scoped capsule radius and palette as advisories. No separate structure checker, native screen reader, or physical-device verification was run.

## Activity log

### 2026-11-10 — Created

Issue created from the supplied project input.

### 2026-11-10 — Status changed from proposed to ready.

### 2026-11-10 — Status changed from ready to in-progress.

### 2026-11-10 — Status changed from in-progress to done.

## Completion summary

Replaced desktop and mobile theme controls with the self-contained pixel study switch and retained persistent light/dark preferences.
