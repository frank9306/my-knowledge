---
id: ISSUE-0012
title: "在 docs/agents/README.md 中增加一条简短规则：通过 Hermes/DSH 自动执行的工作也必须创建并维护 docs/issues 本地 Issue，并遵循同一验收和 Change"
status: done
priority: medium
created: 2026-08-28
updated: 2026-08-28
closed: 2026-08-28
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

- [x] The requested repository change is implemented within the stated scope.
- [x] `pnpm docs:build` passes.
- [x] Verification evidence and the resulting commit are recorded below.

## Out of scope

- Destructive operations, credential changes, dependency major upgrades, and changes outside this repository.

## Decisions

- Source: `wechat`
- Schedule ID: `none`
- Run ID: `20260828-105957-dec2b1f3`

## Implementation notes

- Added a short "Automated dispatch" rule under `docs/agents/README.md` stating that work dispatched automatically through Hermes/DSH must still create and maintain a local `docs/issues/ISSUE-NNNN-*.md` record and follow the same acceptance criteria, verification, and Changelog flow described in `issue-tracker.md` and `workflow.md`.
- No site content, dependencies, Brain, or configuration files were modified and no files were removed.

## Verification

- `pnpm install --frozen-lockfile` succeeded after dependencies were absent.
- `pnpm docs:build` succeeded: `readme:sync` regenerated navigation with 69 articles across 6 topics; `design:lint` reported 0 errors / 0 warnings (1 info); `home:scene-check` passed; `vitepress build` completed in ~52s with the standard chunk-size notice only.
- The implementation commit changes only the requested rule and the required local Issue, index, and Changelog records (four documentation files).
- Implementation commit: `f56413452be3210086821a270ad1db2931602879` (`docs: require Hermes/DSH runs to maintain local Issues [ISSUE-0012]`).

## Activity log

### 2026-08-28 — Created by Hermes dispatcher

Request received at `2026-08-28T11:05:00+08:00`.

### 2026-08-28 — Status changed from in-progress to done.

## Completion summary

Added a brief automated-dispatch rule to `docs/agents/README.md` requiring Hermes/DSH runs to create and maintain a local Issue under the same acceptance and Changelog flow, with changes limited to that rule and its required Issue, index, and Changelog records.
