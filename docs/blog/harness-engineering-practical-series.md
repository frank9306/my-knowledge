---
title: "Harness Engineering 实战系列：从项目诊断到可持续闭环"
description: "九篇连续教程，用同一个订单搜索任务搭建目标契约、知识入口、执行面、机械约束、反馈、证据与持续治理。"
date: 2026-08-03
---

# Harness Engineering 实战系列：从项目诊断到可持续闭环

这不是九篇彼此独立的概念介绍，而是一条可以照着执行的建设路线。我们使用同一个“订单搜索”任务贯穿全系列：先从一次失败交付中找到控制环断点，再逐步补齐契约、知识、命令、约束、观察、证据和治理机制，最后把这些零件连接成最小可运行 Harness。

[![Harness Engineering 系列完整知识地图](/images/blog/harness-series/harness-knowledge-map.svg)](/images/blog/harness-series/harness-knowledge-map.svg)

*Harness Engineering 系列知识地图，概念示意图。点击可查看原始尺寸。*

## 阅读顺序与实际产物

| 篇目 | 要解决的问题 | 完成后留下的产物 |
|---|---|---|
| [一、诊断项目真正缺少什么](./harness-series-01-project-diagnosis) | Agent 为什么反复等人、返工或误判完成 | 基线报告、人工介入清单 |
| [二、把需求变成 Goal Contract](./harness-series-02-goal-contract) | 如何让目标、范围和验收可判定 | `goal-contract.yaml` |
| [三、构建项目知识地图](./harness-series-03-project-knowledge-map) | 如何让 Agent 按需找到可信事实 | 分层知识目录、`AGENTS.md` |
| [四、统一项目执行面](./harness-series-04-command-surface) | 如何让安装、测试和构建稳定可调用 | Harness Manifest、标准命令 |
| [五、把经验变成机械约束](./harness-series-05-mechanical-constraints) | 如何自动阻止已知坏模式 | 3～5 条项目不变量 |
| [六、建立反馈闭环](./harness-series-06-feedback-loop) | 如何观察真实行为并自动修正 | 端到端验证场景 |
| [七、证据与独立评估](./harness-series-07-evidence-evaluation) | 谁来判断任务真的完成 | Evidence Bundle、评估报告 |
| [八、持续治理 Harness](./harness-series-08-continuous-governance) | 如何把人工纠正升级为系统能力 | 记分卡、改进积压清单 |
| [九、完整最小 Harness 实战](./harness-series-09-minimum-harness-capstone) | 如何把前八篇连接并跑通 | 可复用目录与完整变更集 |

## 示例项目

示例是一套常见的订单列表：前端调用 `GET /api/orders?q=&status=&cursor=`，后端查询数据库并返回分页结果。目标功能是增加“精确订单号搜索”，同时保持状态筛选、游标分页和租户隔离不变。

教程中的路径和命令是可迁移示例，不假设你的仓库一定使用同一种语言或框架。迁移时应保留接口语义——目标、输入、输出、退出码和证据——再替换具体工具。

## 建议实践方式

准备一个真实项目和一项最近发生过返工的小任务。每读一篇，只落地该篇产物，然后用下一篇继续完善。不要一次性复制所有模板；没有真实失败记录支撑的规则，很快会变成无人维护的仪式。

**从这里开始：**[第一篇：先诊断项目真正缺少什么](./harness-series-01-project-diagnosis)
