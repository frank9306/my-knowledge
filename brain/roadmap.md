---
slug: roadmap
title: Roadmap
role: milestones
updated: "2026-08-17T09:54:04"
---

# Roadmap

## 已验证的演进轨迹

```mermaid
gantt
    title 项目已发生的主要里程碑
    dateFormat  YYYY-MM-DD
    axisFormat  %Y-%m
    section 建站
    建立 VitePress 知识站           :done, 2026-06-15, 1d
    配置 GitHub Pages 自定义域名    :done, 2026-06-16, 2d
    section 内容与规范
    迁移旧博客并整理主题            :done, 2026-06-18, 10d
    引入 DESIGN.md 与构建 lint       :done, 2026-07-03, 1d
    2.0 站点体验重构                :done, 2026-07-10, 1d
    section AI 工程
    增加 Vibe Coding 基准           :done, 2026-07-16, 1d
    扩展 AI 编码与 Harness 内容     :done, 2026-07-21, 17d
```

## 当前状态

- 知识站已具备内容分类、统一主题、本地搜索、自动导航、构建门禁和 GitHub Pages 发布链路。
- 内容持续扩展，近期重点明显集中在 AI 编码、Harness Engineering 与 Agent 工程。
- 首页交互已经过响应式与键盘可访问性增强。

## 待用户确认的未来路线

仓库没有可信的未来版本计划或发布日期，因此不把历史趋势当作承诺。以下问题保留待确认：

- 下一阶段优先扩充哪些主题，是否继续以 AI 编码 / Harness 为主？
- `benchmarks/vibe-coding/` 是否需要形成常态化复跑与版本化比较？
- 是否要为内容质量、搜索表现或读者反馈建立明确指标？
- 是否计划安装 Brain 的 pre-commit 与 Claude Code SessionStart hooks？
