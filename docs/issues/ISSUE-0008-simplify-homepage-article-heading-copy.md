---
id: ISSUE-0008
title: "Simplify homepage article heading copy"
status: done
priority: low
created: 2026-08-26
updated: 2026-08-26
closed: 2026-08-26
related_adrs: []
depends_on: []
---

# ISSUE-0008: Simplify homepage article heading copy

## Problem

首页文章时间线标题和说明文案占用较多视觉空间，与用户希望的精简表达不符。

## Desired outcome

首页文章区使用更短的标题，并移除标题下方的解释性文案。

## Acceptance criteria

- [x] 首页主标题由“文章时间线”精简为“文章”。
- [x] 删除标题下方的“按最近发布或维护时间排列的全部原创文章。”说明。
- [x] 保留文章数量、搜索、列表、分类标签与加载更多行为。
- [x] 生产构建通过，开发页面无横向溢出或控制台错误。

## Out of scope

- 调整时间线数据、排序、搜索或分页行为。
- 修改全站导航、文章内容或其他页面文案。

## Decisions

- 保留 `FRANK'S ARCHIVE` eyebrow，让“文章”仍有明确的档案语境。
- 不修改 `DESIGN.md`；这是既有层级内的一次局部文案精简，不建立新的视觉规则。

## Implementation notes

- 将 `HomeTimeline.vue` 的 H1 从“文章时间线”改为“文章”。
- 删除 H1 下方的解释性文案，保留 eyebrow、搜索和文章列表结构。

## Verification

生产构建通过；Chrome 1440px/375px 验证标题、文案移除、首屏 12 篇、无溢出和无控制台错误。

## Activity log

### 2026-08-26 — Created

Issue created from the supplied project input.

### 2026-08-26 — Status changed from proposed to ready.

### 2026-08-26 — Status changed from ready to in-progress.

### 2026-08-26 — Status changed from in-progress to done.

## Completion summary

精简首页文章区标题并移除冗余说明，时间线内容与交互保持不变。
