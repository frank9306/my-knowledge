---
id: generated-readme-navigation
title: "README 作为由内容树生成的站点导航"
category: decision
status: active
tags: [architecture workflow]
created: "2026-08-17T09:53:41"
updated: "2026-08-17T09:54:03"
---

<!-- compiled_truth -->
## 决策

`README.md` 定位为公开站点导航，而不是部署说明；专题文章清单由 `scripts/sync-readme.mjs` 扫描 `docs/`、读取 frontmatter 并生成。

## 原因与替代方案

手工维护导航容易在新增、删除、重命名文章后漂移。项目选择构建前自动同步，而不是维护第二份手工目录。

## 影响范围

- 新增、删除、重命名文章或修改 `title` 后需运行 `pnpm readme:sync`。
- `pnpm docs:build` 会先执行同步，因此构建可能更新 `README.md`。
- 自动生成区不应手改；维护规则保留在项目契约中。


## Timeline

- time: 2026-08-17T09:53:41
  kind: decision
  summary: "Created this page: README 作为由内容树生成的站点导航"
  source: "scripts/sync-readme.mjs; git commits 3dc7ac5, fb91f38"
  affects: [generated-readme-navigation]

- time: 2026-08-17T09:54:03
  kind: decision
  summary: "从同步脚本和历史提交提炼 README 导航生成策略"
  source: "scripts/sync-readme.mjs; git log"
  affects: [generated-readme-navigation]
