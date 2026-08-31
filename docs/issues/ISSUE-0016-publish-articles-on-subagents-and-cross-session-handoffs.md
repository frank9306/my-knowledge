---
id: ISSUE-0016
title: "Publish articles on subagents and cross-session handoffs"
status: done
priority: medium
created: 2026-08-31
updated: 2026-08-31
closed: 2026-08-31
related_adrs: []
depends_on: []
---

# ISSUE-0016: Publish articles on subagents and cross-session handoffs

## Problem

The knowledge site does not yet explain when to delegate work to subagents or how to continue one task reliably across sessions using handoff artifacts.

## Desired outcome

Publish two concise Chinese articles that connect AI Hero concepts with the local Codex skill and project workflow.

## Acceptance criteria

- [x] Publish `docs/ai-coding/how-to-use-subagents.md` with the exact title `怎么合理使用子 Agent`.
- [x] Publish `docs/ai-coding/cross-session-agent-handoff.md` with the exact title `跨会话继续同一任务：如何做好 Agent Handoff`.
- [x] Explain decision criteria, unsuitable cases, local Skill applicability, handoff contents, recovery flow, and failure modes without treating Subagent and Handoff as interchangeable.
- [x] Cite the supplied AI Hero pages and connect the guidance to the repository's local Issue and handoff conventions.
- [x] Ensure both articles appear through the generated latest-articles feed and refresh generated README navigation.
- [x] Pass `pnpm docs:build` and complete a read-only review of the resulting Git diff.

## Out of scope

- Installing Matt Pocock's Skills or adding a new handoff Skill.
- Adding either article to the manually curated recommended-reading section.
- Generating article illustrations in this task.

## Decisions

- Use `跨会话继续同一任务：如何做好 Agent Handoff` as the second article title.
- Treat Subagent as a bounded return-path delegation mechanism and Handoff as a forward-only continuation mechanism.
- Explain both AI Hero's model and the local Codex/project workflow, clearly marking platform-specific differences.

## Implementation notes

- Added `docs/ai-coding/how-to-use-subagents.md` covering delegation criteria, local Skill applicability, assignment contracts, and failure modes.
- Added `docs/ai-coding/cross-session-agent-handoff.md` covering portable handoff artifacts, durable project records, receiver startup, and Codex-native task migration.
- Used AI Hero's Subagent, Handoff, `research`, `wayfinder`, `ask-matt`, and `/handoff` pages as external sources while checking behavior claims against local `SKILL.md` files.

## Verification

pnpm docs:build passed; git diff --check found no whitespace errors; UTF-8 checks found no BOM or replacement characters; read-only review found no P0 or P1 issues.

## Activity log

### 2026-08-31 — Created

Issue created from the supplied project input.

### 2026-08-31 — Status changed from proposed to ready.

### 2026-08-31 — Status changed from ready to in-progress.

### 2026-08-31 — Status changed from in-progress to done.

## Completion summary

Published two Chinese articles on bounded subagent delegation and reliable cross-session Agent handoffs, with AI Hero sources, local Skill mappings, generated navigation, and verified production output.
