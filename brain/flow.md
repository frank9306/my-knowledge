---
slug: flow
title: Key flows
role: key flows
updated: "2026-08-17T09:54:04"
---

# Key flows

## 内容到发布的主流程

```mermaid
sequenceDiagram
    actor Author as 作者或 Agent
    participant Docs as docs/ 内容与静态资产
    participant Sync as readme:sync
    participant Design as design:lint
    participant Scene as home:scene-check
    participant VP as VitePress
    participant CI as GitHub Actions
    participant Pages as GitHub Pages

    Author->>Docs: 新增或修改 Markdown、Vue、CSS、图片
    Author->>Sync: pnpm readme:sync
    Sync->>Docs: 扫描 frontmatter 和目录
    Sync-->>Author: 更新 README.md 导航
    Author->>VP: pnpm docs:build
    VP->>Sync: 再次同步 README
    VP->>Design: 校验 DESIGN.md
    VP->>Scene: 检查首页场景契约
    VP->>VP: 构建 docs/.vitepress/dist
    Author->>CI: 推送 main
    CI->>VP: 冻结依赖安装并执行生产构建
    CI->>Pages: 发布静态产物
```

## 文章维护分支

1. 文章放入对应专题目录；长文默认进入 `docs/blog/`。
2. frontmatter 的 `title` 是导航生成和页面显示的共同输入。
3. 新文章默认加入首页“最新文章”；进入“推荐阅读”必须先由用户确认。
4. 插图遵守 [[design-system-build-gate]] 定义的生产与视觉验证要求。

## 基准研究分支

`benchmarks/vibe-coding/` 通过任务准备、运行、评分、复评与汇总脚本形成证据，再将结论写入公开博客；该策略见 [[repository-owned-agent-benchmark]]。
