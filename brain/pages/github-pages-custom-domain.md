---
id: github-pages-custom-domain
title: "通过 GitHub Pages 与自定义域名发布"
category: decision
status: active
tags: [architecture workflow]
created: "2026-08-17T09:53:41"
updated: "2026-08-26T11:12:54"
---

<!-- compiled_truth -->
## 决策

生产站点通过 GitHub Actions 构建 VitePress，并发布到 GitHub Pages；公开地址使用 `knowledge.webfrank.top` 自定义域名。

## 原因与替代方案

仓库选择静态站点发布链路：内容与主题进入同一可复现构建，推送 `main` 后自动部署，无需运行时服务。

## 影响范围

- CI 使用 Node 20、pnpm 10、冻结锁文件安装并运行 `pnpm docs:build`。
- 发布产物来自 `docs/.vitepress/dist`，该目录不可手工编辑。
- `docs/public/CNAME` 与 VitePress 站点配置共同维护公开域名和链接。
- 发布或取消的成果通过本地 Issue 跟踪，并写入当前月份的 `docs/changelog/YYYY-MM.md`；根目录不再维护 Changelog。


## Timeline

- time: 2026-08-17T09:53:41
  kind: decision
  summary: "Created this page: 通过 GitHub Pages 与自定义域名发布"
  source: ".github/workflows/deploy.yml; docs/public/CNAME; git commits 72390b1, 8138545"
  affects: [github-pages-custom-domain]

- time: 2026-08-17T09:54:03
  kind: decision
  summary: "从部署工作流、CNAME 与历史提交提炼发布架构"
  source: ".github/workflows/deploy.yml; docs/public/CNAME; git log"
  affects: [github-pages-custom-domain]

- time: 2026-08-26T11:12:54
  kind: decision
  summary: "将发布记录迁移到 docs/changelog 月度文件"
  source: "用户要求 2026-08-26；docs/agents/issue-tracker.md；ISSUE-0001"
  affects: [github-pages-custom-domain]
