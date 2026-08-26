---
id: single-editorial-site-experience
title: "统一为单一 Codex Editorial 站点体验"
category: decision
status: active
tags: [architecture workflow]
created: "2026-08-17T09:53:41"
updated: "2026-08-26T18:18:07"
---

<!-- compiled_truth -->
## 决策

站点采用与 `webfrank.top` 个人站一致的 Webfrank 编辑式视觉语言：深炭黑默认画布、暖白文字、低饱和蓝色信号、发丝分隔线与克制留白；仅保留 VitePress 原生 light/dark 模式，dark 为默认品牌呈现。一级信息架构固定为首页、我的收藏、我的 AI：

- 首页是“时间轴档案”，汇总全部原创文章，按 `updated ?? date` 倒序；分类只作为标签，页面内搜索和每次 12 篇的加载更多负责浏览。
- 我的收藏合并资源与外部好文，使用资源/好文类型和六类统一用途组合筛选。
- 我的 AI 是 `/agents` 与 `/skills` 的总览入口，两个详情页继续从公开 GitHub 源运行时加载。

首页的可交互 3D CRT 档案管理员继续保留，作为知识库相对个人站的唯一标志性视觉例外；文章正文保留原 URL 和 VitePress 阅读结构，但不再提供主题索引与主题侧边栏。

## 原因与替代方案

用户主要按最近发布或维护时间查找文章，原先专题、文章、好文和资源入口存在重叠。经用户确认采用“A：时间轴档案”预览方向，以单一时间线降低入口选择成本，同时用收藏和 AI 两个目的明确的目录承接非原创内容与个人 AI 配置。

## 影响范围

- 顶部导航只有首页、我的收藏、我的 AI，并保留全站搜索和主题切换。
- 文章正文 URL、`/agents`、`/skills` 保持兼容；旧索引页删除且不添加重定向。
- 不重新引入第二套主题状态，不新增依赖。
- 3D CRT 保持透明、完整、可拖动、键盘可交互和 reduced-motion 安全。
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

- time: 2026-08-26T18:18:07
  kind: decision
  summary: "按用户确认的 A 时间轴档案预览收敛一级信息架构"
  source: "User confirmation on 2026-08-26; ISSUE-0007; DESIGN.md"
  affects: [single-editorial-site-experience]
