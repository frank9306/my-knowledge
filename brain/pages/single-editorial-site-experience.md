---
id: single-editorial-site-experience
title: "统一为单一 Codex Editorial 站点体验"
category: decision
status: active
tags: [architecture workflow]
created: "2026-08-17T09:53:41"
updated: "2026-08-17T09:54:03"
---

<!-- compiled_truth -->
## 决策

站点采用一套 Codex Editorial 视觉语言，仅保留 VitePress 原生 light/dark 模式；首页使用定制内容落地页和可交互 3D CRT 档案管理员，文章页保留 VitePress 文档阅读结构。

## 原因与替代方案

历史上曾有可切换站点风格，2.0 重构后选择统一视觉身份，减少并行主题状态和维护分叉，同时保留首页辨识度与正文可读性。

## 影响范围

- 不重新引入 `data-site-style`、第二套 localStorage 状态或额外风格切换控件。
- 首页交互集中于 `HomeLanding.vue`、3D 场景组件和 `custom.css`。
- 视觉变更同时考虑响应式、键盘可访问性、reduced motion 和 light/dark。
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
