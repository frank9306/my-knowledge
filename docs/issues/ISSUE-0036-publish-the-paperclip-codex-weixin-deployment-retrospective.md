---
id: ISSUE-0036
title: "Publish the Paperclip Codex Weixin deployment retrospective"
status: done
priority: medium
created: 2026-10-29
updated: 2026-10-29
closed: 2026-10-29
related_adrs: []
depends_on: []
---

# ISSUE-0036: Publish the Paperclip Codex Weixin deployment retrospective

## Problem

Today's seven-agent deployment and verified Weixin integration are not yet documented on the knowledge site.

## Desired outcome

Publish a source-checked Chinese retrospective using the supplied original organizational screenshot, with accurate verification boundaries and no secrets.

## Acceptance criteria

- [x] Write a Chinese retrospective covering seven-role organization, local deployment and remote inference, credential boundaries, sandbox constraints, repository/path/browser troubleshooting, limits, session resumption, and Weixin text/voice integration.
- [x] Separate verified results, team-reported business checks, implementation choices, and unfinished isolation/browser work; publish no credentials or private endpoints.
- [x] Use the owner-supplied original screenshot as the cover with descriptive alt text, provenance, and social-image metadata.
- [x] Refresh generated navigation and pass the production documentation build and article-output checks.
- [x] Publish through the existing main/GitHub Pages workflow and verify the live article, cover, homepage discovery, and RSS entry.

## Out of scope

- Changing Paperclip, the Weixin bridge, Codex configuration, team permissions, or the knowledge site's theme.
- Publishing private deployment state, authentication material, pending personal notes, or unrelated repository changes.
- Adding a curated recommendation or generating replacement illustrations.

## Decisions

- Use a case-led first-person retrospective and inline official sources, rather than infer untested capabilities from the organization screenshot.
- Preserve the supplied documentary screenshot without cropping, watermarking, or generating additional artwork. Its original 1920×945 format is an intentional exception to default illustration specifications.
- The homepage already discovers dated articles and sorts them newest-first; reuse that data loader instead of changing docs/index.md or the theme.
- Publish from an isolated detached worktree because the primary checkout contains unrelated private notes and local tracking changes.

## Implementation notes

- Article: docs/blog/paperclip-codex-weixin-agent-company.md.
- Cover: docs/public/images/paperclip-agent-company/organization.png.
- Evidence: current deployment chat, local seven-role acceptance record, actual matching-session restart record, and Weixin integration evidence (one real transcribed voice message and successful reply; eight behavior tests).
- Official references: Paperclip repository; OpenAI Codex authentication documentation; Tencent openclaw-weixin protocol and voice_item.text type definition, checked 2026-10-29.

## Verification

- Editorial review: factual integrity 9/10, structure 9/10, precision 9/10, narrative 9/10, image-text fit 10/10 (46/50).
- check_draft.py reports three long-sentence prompts caused by YAML frontmatter and Markdown tables; manually reviewed as structured content, with no unresolved placeholders or canned-phrase findings.
- Browser bridge doctor reports no connected extensions. Interactive browser/viewport acceptance is unavailable; build and live HTTP/HTML/image checks remain required and will not be described as browser acceptance.
- pnpm docs:build passes README sync (75 articles), design lint (zero errors/warnings), homepage contract check, VitePress rendering, and sitemap/RSS generation. The existing large-chunk advisory remains informational.
- Publication commit: 46881e7ecd40c9c3ef48bc7985e65a77181e2ed7. GitHub Pages build and deployment succeeded: https://github.com/frank9306/my-knowledge/actions/runs/40851566255 .
- Live HTTPS checks pass for the article title, descriptive original cover, social cover metadata, first homepage article position, RSS, sitemap, valid Unicode, and private-material scan. Downloaded cover SHA-256 matches the supplied source exactly.
- Public article: https://knowledge.webfrank.top/blog/paperclip-codex-weixin-agent-company .

## Activity log

### 2026-10-29 — Created

Issue created from the supplied project input.

### 2026-10-29 — Status changed from proposed to ready.

### 2026-10-29 — Status changed from ready to in-progress.

### 2026-10-29 — Status changed from in-progress to done.

## Completion summary

Published the source-checked seven-agent Paperclip/Codex/Weixin deployment retrospective with the original supplied cover; production build, GitHub Pages deployment, and live article/image/discovery checks pass.
