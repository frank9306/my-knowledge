---
id: single-editorial-site-experience
title: "统一为单一 Codex Editorial 站点体验"
category: decision
status: active
tags: [architecture workflow]
created: "2026-08-17T09:53:41"
updated: "2026-08-26T16:36:11"
---

<!-- compiled_truth -->
## 决策

站点采用与 `webfrank.top` 个人站一致的 Webfrank 编辑式视觉语言：深炭黑默认画布、暖白文字、低饱和蓝色信号、发丝分隔线与克制留白；仅保留 VitePress 原生 light/dark 模式，dark 为默认品牌呈现。首页的可交互 3D CRT 档案管理员继续保留，作为知识库相对个人站的唯一标志性视觉例外；文章页保留 VitePress 文档阅读结构。

## 原因与替代方案

跨站统一颜色、排版与界面节奏能建立稳定的 Frank 品牌识别，同时知识库需要保留文档导航、搜索和长文阅读效率。用户明确要求不移除 3D CRT，因此不采用完全复制个人站、删除角色的方案，而是把角色保留为透明悬浮且不进入卡片或背景容器的受控例外。

## 影响范围

- 不重新引入 `data-site-style`、第二套 localStorage 状态或额外风格切换控件。
- dark 是默认品牌呈现，light 使用同一结构的可读适配。
- 首页交互集中于 `HomeLanding.vue`、3D 场景组件和 `custom.css`。
- 3D CRT 保持透明、完整、可拖动、键盘可交互和 reduced-motion 安全。
- 视觉变更同时考虑响应式、键盘可访问性、文章阅读结构和 light/dark。
- 具体 token 与组件规则由 [[design-system-build-gate]] 约束。


## Timeline

- time: 2026-08-17T09:53:41
  kind: decision
  summary: "Created this page: 统一为单一 Codex Editorial 站点体验"
  source: "DESIGN.md; theme implementation; git commit 547430f"
  affects: [single-editorial-site-experience]

- time: 2026-08-17T09:54:03
  kind: decision
  summary: "提炼 2.0 重构后的单一视觉体系与首页交互边界"
  source: "DESIGN.md; theme code; git log"
  affects: [single-editorial-site-experience]

- time: 2026-08-26T16:36:11
  kind: decision
  summary: "将知识库视觉语言与个人站统一，同时按用户要求保留 3D CRT"
  source: "User confirmation on 2026-08-26; ISSUE-0002; DESIGN.md"
  affects: [single-editorial-site-experience]
