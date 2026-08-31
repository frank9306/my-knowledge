---
id: ISSUE-0014
title: "Publish an article on deep modules for AI coding"
status: done
priority: medium
created: 2026-08-31
updated: 2026-08-31
closed: 2026-08-31
related_adrs: []
depends_on: []
---

# ISSUE-0014: Publish an article on deep modules for AI coding

## Problem

The knowledge site does not yet explain why deep-module architecture is easier for memoryless AI coding agents to navigate and verify, or how this differs from code organization optimized mainly for experienced human maintainers.

## Desired outcome

Publish a Chinese first-person article grounded in the supplied AIHero source, with an explicit human-versus-agent comparison, practical migration guidance, coherent illustrations, refreshed navigation, and verified production output.

## Acceptance criteria

- [x] Publish a Chinese first-person article under `docs/ai-coding/` explaining deep modules in the context of an ongoing AI-coding experiment.
- [x] Use the concise title `什么是对 AI 友好的代码结构` and keep the main narrative consistently in the author's first-person perspective.
- [x] Explain the causal chain from explicit module boundaries and narrow public interfaces to improved Agent navigation, smaller context requirements, safer implementation changes, and faster feedback.
- [x] Compare AI-oriented code organization with traditional human-maintained codebases without claiming that deep modules are exclusive to AI or that all small modules are harmful.
- [x] Include a concrete before-and-after TypeScript example and a practical, incremental adoption checklist.
- [x] Attribute source-dependent claims, distinguish the author's interpretation from cited material, and document important limits and counterarguments.
- [x] Add a coherent set of verified article illustrations after the user confirms the exact watermark string.
- [x] Refresh generated navigation and pass the article quality check, image checks, README sync, design lint, homepage scene check, and production documentation build.

## Out of scope

- Refactoring an existing application into deep modules.
- Claiming experimental performance improvements without benchmark data.
- Adding the article to a manually curated recommended-reading section.

## Decisions

- Use an argument-led explanation grounded in the supplied AIHero article and the project's own AI-coding perspective.
- Treat deep modules as a long-standing software-design principle whose value becomes more visible under Agent context and feedback constraints.
- Use TypeScript examples because the source article discusses TypeScript and the site's audience is familiar with web engineering.
- Use the user-confirmed concise question title and frame the explanation as the author's own ongoing experiment rather than an impersonal architecture tutorial.

## Implementation notes

- Published article: `docs/ai-coding/deep-modules-for-ai-coding.md`.
- Published five 1600×900 PNG illustrations under `docs/public/images/ai-coding/deep-modules/`.
- Used the confirmed watermark `knowledge.webfrank.top · Frank的知识库` consistently across the image set.
- Added the generated navigation entry to `README.md`; no recommended-reading section was changed.

## Verification

Manual article review scored 46/50; configured draft findings were limited to frontmatter, code blocks, the comparison table, lists, and source URLs. All five illustrations passed full-size and 750px visual inspection with no hard failure, and check_image_specs.py validated 1600x900 exact 16:9 PNG output. pnpm docs:build passed README sync, design lint, homepage scene check, and VitePress production build; the existing Rollup chunk-size warning remains non-blocking. Read-only completion review found no remaining P0-P3 issues.

## Activity log

### 2026-08-31 — Created

Issue created from the supplied project input.

### 2026-08-31 — Status changed from proposed to ready.

### 2026-08-31 — Status changed from ready to in-progress.

### 2026-08-31 — Status changed from in-progress to done.

## Completion summary

Published the first-person deep-modules article with a concise title, TypeScript before-and-after example, incremental migration checklist, five explanatory illustrations, and refreshed generated navigation.
