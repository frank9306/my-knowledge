---
id: resource-catalog-single-source
title: "资源目录使用单一数据源派生推荐与分类视图"
category: decision
status: active
tags: [architecture, content, workflow]
created: "2026-08-17T10:33:05"
updated: "2026-08-26T18:18:19"
---

<!-- compiled_truth -->
## 决策

资源条目继续以 `docs/.vitepress/theme/resources.ts` 作为单一数据源，每个资源只录入一个对象。站点不再发布独立的“全部资源”和“精选推荐”索引；`docs/.vitepress/theme/favorites.ts` 只负责把资源分类映射到六类统一用途，并与外部好文合并派生“我的收藏”视图。

六类用途固定为：AI 与 Agent、开发工具、自动化、学习资料、信息发现、网络与服务。资源/好文是独立类型维度，可与用途和关键词组合筛选。

## 原因与替代方案

原有资源、精选推荐与好文入口造成内容组织重叠。保持资源条目的类型化单一来源，能够在不复制资源内容的前提下把它们并入统一收藏目录；用途映射与原始资源数据分离，避免为界面重构破坏资源维护约束。

## 影响范围

- 新增或修改资源仍只编辑 `docs/.vitepress/theme/resources.ts`。
- 外部好文在收藏数据层维护，资源数据不复制。
- `/favorites` 自动派生统一目录，并提供关键词、类型和六类用途筛选。
- 旧 `/resources/`、`/resources/recommended` 与 `/reading/` 索引删除，不添加重定向。
- 页面视觉继续遵循 [[design-system-build-gate]] 和 [[single-editorial-site-experience]]。


## Timeline

- time: 2026-08-17T10:33:05
  kind: decision
  summary: "Created this page: 资源目录使用单一数据源派生推荐与分类视图"
  source: "docs/.vitepress/theme/resources.ts; ResourceCatalog.vue"
  affects: [resource-catalog-single-source]

- time: 2026-08-17T10:33:05
  kind: decision
  summary: "资源目录改为单一数据源并自动派生两个页面"
  source: implemented resource catalog
  affects: [resource-catalog-single-source]

- time: 2026-08-26T18:18:19
  kind: decision
  summary: "将资源单一来源接入统一的我的收藏目录"
  source: "User confirmation on 2026-08-26; ISSUE-0007; favorites.ts"
  affects: [resource-catalog-single-source]
