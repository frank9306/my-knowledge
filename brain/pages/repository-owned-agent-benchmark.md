---
id: repository-owned-agent-benchmark
title: "将 AI 编码基准、结果与文章放在同一仓库"
category: decision
status: active
tags: [architecture workflow]
created: "2026-08-17T09:53:41"
updated: "2026-08-17T09:54:03"
---

<!-- compiled_truth -->
## 决策

AI 编码工具评测不只发布结论文章，还把任务定义、fixtures、运行脚本、评分逻辑、校准数据和结果快照保存在 `benchmarks/vibe-coding/`，与知识站内容同仓演进。

## 原因与替代方案

只保留文章会丢失可复核证据；同仓保存实验材料可追踪方法、复算结果并让文章结论对应具体数据。

## 影响范围

- `benchmarks/vibe-coding/` 是独立实验子系统，不参与普通 VitePress 内容渲染。
- 运行、评分、汇总由目录内 Node 脚本承担，结果目录保存证据快照。
- 对外结论通过 `docs/blog/` 文章发布；实验变更应区分方法变化与纯内容更新。


## Timeline

- time: 2026-08-17T09:53:41
  kind: decision
  summary: "Created this page: 将 AI 编码基准、结果与文章放在同一仓库"
  source: "benchmarks/vibe-coding; git commit 3c441eb"
  affects: [repository-owned-agent-benchmark]

- time: 2026-08-17T09:54:03
  kind: decision
  summary: "从基准目录结构和引入提交提炼证据同仓策略"
  source: "benchmarks/vibe-coding; git commit 3c441eb"
  affects: [repository-owned-agent-benchmark]
