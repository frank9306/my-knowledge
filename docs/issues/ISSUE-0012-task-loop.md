---
id: ISSUE-0012
title: "在 docs/agents/README.md 中增加一条简短规则：通过 Hermes/DSH 自动执行的工作也必须创建并维护 docs/issues 本地 Issue，并遵循同一验收和 Change"
status: ready
priority: medium
created: 2026-08-28
updated: 2026-08-28
closed:
sources: ["wechat"]
related_adrs: []
depends_on: []
---

# ISSUE-0012: 在 docs/agents/README.md 中增加一条简短规则：通过 Hermes/DSH 自动执行的工作也必须创建并维护 docs/issues 本地 Issue，并遵循同一验收和 Change

## Problem

Hermes received the following owner request and dispatched it as run `20260828-105957-dec2b1f3`:

> 在 docs/agents/README.md 中增加一条简短规则：通过 Hermes/DSH 自动执行的工作也必须创建并维护 docs/issues 本地 Issue，并遵循同一验收和 Changelog 流程。仅修改与此规则直接相关的项目文档，不修改站点内容、依赖、Brain 或配置，不要删除任何文件。

## Desired outcome

Implement the owner's request in this repository while preserving project instructions and existing behavior outside the requested scope.

## Acceptance criteria

- [ ] The requested repository change is implemented within the stated scope.
- [ ] `pnpm docs:build` passes.
- [ ] Verification evidence and the resulting commit are recorded below.

## Out of scope

- Destructive operations, credential changes, dependency major upgrades, and changes outside this repository.

## Decisions

- Source: `wechat`
- Schedule ID: `none`
- Run ID: `20260828-105957-dec2b1f3`

## Implementation notes

No implementation has started.

## Verification

Not verified.

## Activity log

### 2026-08-28 — Created by Hermes dispatcher

Request received at `2026-08-28T11:05:00+08:00`.

## Completion summary

Not completed.
