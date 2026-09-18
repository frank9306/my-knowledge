---
id: ISSUE-0025
title: "Unpublish the You2 personal work memory article"
status: done
priority: medium
created: 2026-09-17
updated: 2026-09-17
closed: 2026-09-17
related_adrs: []
depends_on: []
---

# ISSUE-0025: Unpublish the You2 personal work memory article

## Problem

用户要求下架《我想做一个“第二个你”：让 AI 真正记住你的工作》。

## Desired outcome

移除文章正文及生成的站内入口，保留历史记录，通过生产构建。

## Acceptance criteria

- [x] 文章正文已移除，README 和构建输出不再提供该文章入口。

## Out of scope

不删除插图或历史 Issue；不提交、推送或部署。

## Decisions

No decisions recorded.

## Implementation notes

已删除文章 Markdown，构建自动同步 README，文章数从 74 更新为 73；保留插图与历史记录。

## Verification

pnpm docs:build passed; article HTML absent; README entry removed; dist matches remain only as source-path text in historical ISSUE-0020; git diff --check passed; read-only review of git diff HEAD found no actionable issues.

## Activity log

### 2026-09-17 — Created

Issue created from the supplied project input.

### 2026-09-17 — Status changed from proposed to ready.

### 2026-09-17 — Status changed from ready to in-progress.

### 2026-09-17 — Status changed from in-progress to done.

## Completion summary

下架 You² 产品文章并同步生成导航，保留历史工作记录和插图。
