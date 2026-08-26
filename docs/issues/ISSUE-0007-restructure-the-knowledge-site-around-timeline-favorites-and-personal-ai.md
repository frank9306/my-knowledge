---
id: ISSUE-0007
title: "Restructure the knowledge site around timeline, favorites, and personal AI"
status: ready
priority: medium
created: 2026-08-26
updated: 2026-08-26
closed:
sources: []
related_adrs: []
depends_on: []
---

# ISSUE-0007: Restructure the knowledge site around timeline, favorites, and personal AI

## Problem

当前网站同时提供专题、文章、好文分享、资源和 AI 配置等入口，内容组织方式重叠。用户主要关注最近发布或维护的文章，但首页仅展示少量最新文章，完整文章索引仍按分类组织。

## Desired outcome

将网站收敛为三个一级入口：首页按 updated ?? date 倒序展示文章时间线；我的收藏统一管理资源与好文分享；我的 AI 提供 AGENTS.md 和 Skills 入口。

## Acceptance criteria

- [ ] 实施前提供首页、我的收藏和我的 AI 的设计预览，并获得用户确认。
- [ ] 顶部导航收敛为首页、我的收藏、我的 AI，同时保留全站搜索。
- [ ] 首页汇总全部原创文章，显示分类标签，按最近变更时间倒序。
- [ ] 首页支持当前页面搜索，首屏显示 12 篇，通过“加载更多”每次追加 12 篇。
- [ ] 我的收藏合并资源与好文，支持搜索、资源/好文类型筛选及六类统一用途筛选。
- [ ] 收藏分类固定为：AI 与 Agent、开发工具、自动化、学习资料、信息发现、网络与服务。
- [ ] 我的 AI 总览页进入现有 AGENTS.md 和 Skills 页面，并保留远程加载及失败恢复状态。
- [ ] 删除专题、文章、资源、好文及各文章主题的旧索引页，但保留文章正文、`/agents` 和 `/skills` URL。
- [ ] 清理旧导航、侧边栏和站内索引引用，重新生成 README。
- [ ] 更新 `DESIGN.md`，并通过设计检查、生产构建和桌面/375px 浏览器验证。
- [ ] 搜索、筛选、空状态、加载更多、键盘操作、深浅主题及 reduced-motion 均可用。

## Out of scope

- 修改文章正文或正文 URL。
- 新增依赖。
- 重写 AGENTS.md 或 Skills 的远程数据源。
- 发布、部署、提交或推送 Git 变更。
- 为删除的旧索引页添加重定向。

## Decisions

- 首页文章按 `updated ?? date` 倒序排列；分类仅作为标签展示，不作为首页筛选条件。
- 首页和我的收藏提供页面内搜索，同时保留 VitePress 全站搜索。
- 首页首屏显示 12 篇文章，并通过“加载更多”每次追加 12 篇。
- 我的收藏统一重做用途分类，不沿用资源与好文原有的两套分类。
- 我的 AI 使用独立总览页，并保留 `/agents` 和 `/skills` 两个详情入口。
- 实施采用设计预览优先流程，用户确认设计方向后再修改代码。

## Implementation notes

No implementation has started.

## Verification

Not verified.

## Activity log

### 2026-08-26 — Created

Issue created from the supplied project input.

### 2026-08-26 — Status changed from proposed to ready.

## Completion summary

Not completed.
