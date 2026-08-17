---
id: resource-catalog-single-source
title: "资源目录使用单一数据源派生推荐与分类视图"
category: decision
status: active
tags: [architecture, content, workflow]
created: "2026-08-17T10:33:05"
updated: "2026-08-17T10:33:05"
---

<!-- compiled_truth -->
## 决策

资源目录以 `docs/.vitepress/theme/resources.ts` 作为唯一数据源。每个资源只录入一个对象；`recommended: true` 自动进入“精选推荐”，`category` 自动决定它在“全部资源”中的分类。

## 原因与替代方案

此前 `docs/resources/index.md` 同时手工维护推荐详卡和分类列表，同一资源需要写两次，容易产生遗漏和文案漂移。相比继续复制 Markdown 或增加同步脚本，类型化数据加共用 Vue 视图能在不增加依赖的前提下统一内容与交互。

## 影响范围

- 新增或修改资源只编辑 `docs/.vitepress/theme/resources.ts`。
- 推荐资源必须同时提供 `audience`、`reason` 和 `caution`，模块加载时会校验重复 ID、未知分类和字段缺失。
- `/resources/recommended` 自动筛选推荐资源，并提供分类按钮；`/resources/` 自动按分类生成完整目录。
- 两个页面通过 `ThemeLayout.vue` 的 `page-top` 插槽渲染，保留全站 `markdown.html: false` 安全边界。
- 导航中的“资源”下拉项同时指向“精选推荐”和“全部资源”。

## 相关决策

页面视觉继续遵循 [[design-system-build-gate]] 和 [[single-editorial-site-experience]]。


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
