---
id: ISSUE-0022
title: "升级首页 CRT-404 馆长互动"
status: done
priority: medium
created: 2026-09-03
updated: 2026-09-03
closed: 2026-09-03
related_adrs: []
depends_on: []
---

# ISSUE-0022: 升级首页 CRT-404 馆长互动

## Problem

首页 3D CRT 档案管理员目前只有动作反馈，缺少明确角色设定、文字表达、每日欢迎与连续点击后的幽默吐槽，角色存在感和互动叙事不足。

## Desired outcome

将现有角色升级为 CRT-404 毒舌馆长：通过无障碍消息气泡完成每日欢迎、普通回应、分级警告和连续点击吐槽，并让欢迎与吐槽分别配套 3D 肢体动作。

## Acceptance criteria

- [x] The character is identified as CRT-404, a dry, humorous and sharp-tongued archive curator.
- [x] A non-interactive, viewport-safe speech bubble exposes welcome, normal, warning and roast dialogue through an accessible live region.
- [x] A welcome line and matching welcome animation play about 600 ms after the first homepage visit of each local calendar day.
- [x] Normal activation responds once; four activations within two seconds warn, seven roast, and every three further activations replace the roast until the streak resets after three seconds.
- [x] Dragging does not count toward the activation streak, and Enter or Space produces exactly one response per activation.
- [x] Welcome, warning and roast reactions have distinct 3D body language, while reduced-motion users retain dialogue without large movement.
- [x] The existing draggable position storage, transparent rendering and 65-degree horizontal tracking contract remain compatible.
- [x] `pnpm home:scene-check`, `pnpm design:lint` and `pnpm docs:build` pass, with desktop and 375 px browser behavior inspected.

## Out of scope

Audio speech, network or backend services, proactive idle chatter, a redesigned character model, publishing and deployment.

## Decisions

- Welcome frequency is once per visitor-local calendar day.
- Dialogue is text-only and appears only for welcome or direct interaction.
- Roast copy may use profanity and strong sarcasm, but targets repeated clicking rather than protected traits or real-world threats.
- The existing `CrtHead.react(reaction, intensity?)` boundary remains the animation interface; dialogue state stays in `HomeLanding.vue`.

## Implementation notes

Implemented a local dialogue controller and line banks in `HomeLanding.vue`, viewport-aware bubble styling in `custom.css`, and welcome/warn/roast animation reactions in `CrtHead.vue`. Extended the project-owned scene check, updated `DESIGN.md`, and recorded the durable role decision in Project Brain. No dependency was added.

## Verification

pnpm home:scene-check; pnpm design:lint; pnpm docs:build; Chrome desktop and 375px interaction checks; brain lint-links.

## Activity log

### 2026-09-03 — Created

Issue created from the supplied project input.

### 2026-09-03 — Status changed from proposed to ready.

### 2026-09-03 — Status changed from ready to in-progress.

### 2026-09-03 — Status changed from in-progress to done.

## Completion summary

Added the CRT-404 curator personality, accessible speech bubble, daily welcome, rapid-click warning/roast escalation, and matching reduced-motion-aware 3D reactions.
