---
id: design-system-build-gate
title: "以 DESIGN.md 约束视觉系统并纳入构建门禁"
category: decision
status: active
tags: [architecture workflow]
created: "2026-08-17T09:53:41"
updated: "2026-08-26T16:36:11"
---

<!-- compiled_truth -->
## 决策

用根目录 `DESIGN.md` 同时承载机器可读 token 和人类可读设计意图，并通过 `designmd lint DESIGN.md` 将其纳入生产构建。知识库的共享视觉基线来自 `webfrank.top` 个人站：深炭黑、暖白、克制蓝色、细线分区和编辑式留白；3D CRT 是明确记录的知识库专属例外。

## 原因与替代方案

视觉约束需要同时服务人工维护与 AI 编码 Agent。仅依赖散落 CSS 难以解释设计意图，仅写 prose 又无法机械检查；双层规范兼顾两者。跨站共享基线减少品牌漂移，而记录例外可避免后续一致性改造误删 CRT。

## 影响范围

- 前端变更先遵循 `DESIGN.md`，再匹配现有组件实现。
- `pnpm docs:build` 在 VitePress 构建前执行 `pnpm design:lint` 与 3D 首页回归检查。
- 全局 token、导航、文章页与首页优先复用个人站的视觉语言。
- 文章插图仍默认采用蓝色工程手绘知识卡，并要求确定性 SVG 文字层和视觉检查。
- 3D CRT 的透明悬浮、完整角色和默认定位由 `home:scene-check` 保护。


## Timeline

- time: 2026-08-17T09:53:41
  kind: decision
  summary: "Created this page: 以 DESIGN.md 约束视觉系统并纳入构建门禁"
  source: "DESIGN.md; package.json; git commit cd1faf9"
  affects: [design-system-build-gate]

- time: 2026-08-17T09:54:03
  kind: decision
  summary: "从设计规范、构建脚本和引入提交提炼设计门禁"
  source: "DESIGN.md; package.json; git commit cd1faf9"
  affects: [design-system-build-gate]

- time: 2026-08-26T16:36:11
  kind: decision
  summary: "记录跨站共享视觉基线和保留 CRT 的设计门禁"
  source: "User confirmation on 2026-08-26; ISSUE-0002; DESIGN.md"
  affects: [design-system-build-gate]
