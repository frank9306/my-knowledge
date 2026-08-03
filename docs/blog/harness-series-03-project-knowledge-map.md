---
title: "Harness 实战（三）：让 Agent 找得到项目答案"
description: "以分层 AGENTS.md、渐进式披露和单一事实来源构建 Agent 可发现、可维护的项目知识地图。"
date: 2026-08-03
---

# Harness 实战（三）：让 Agent 找得到项目答案

Agent 不需要一次读完整个项目，它需要先找到正确入口，再沿着稳定链接取得与当前任务有关的事实。

[![Harness Engineering 系列完整知识地图](/images/blog/harness-series/harness-knowledge-map.svg)](/images/blog/harness-series/harness-knowledge-map.svg)

*图 1：Harness Engineering 系列知识地图。概念示意图。*

![系列第三篇关注的项目知识地图区域](/images/blog/harness-series/03-knowledge-map-focus.svg)

*图 2：知识地图连接任务意图与受约束执行，减少 Agent 在仓库中猜测。概念示意图。*

## 仓库外的知识无法稳定参与执行

架构决定藏在聊天记录里、部署步骤只存在于某位工程师的终端历史中、领域规则依靠口头提醒——这些知识对新成员不可靠，对 Coding Agent 更不可发现。OpenAI 的 Harness Engineering 案例因此把仓库视为记录系统，并使用短 `AGENTS.md` 指向更深的结构化文档。[OpenAI：Harness engineering](https://openai.com/index/harness-engineering/)

AGENTS.md 项目允许仓库在不同目录放置说明文件，Agent 可以按目录层级获得更具体的指导。[AGENTS.md](https://agents.md/) 这提供了分层入口，但仍需项目决定哪些文件是权威来源、谁负责更新，以及规则冲突时如何处理。

## `AGENTS.md` 应该回答导航问题

根目录入口保持短而稳定，通常只包含：

- 项目是什么，主要目录分别负责什么；
- 安装、开发、检查和构建的标准入口；
- 全局禁止事项和需要审批的操作；
- 架构、产品、可靠性和安全文档的位置；
- 更深目录是否存在局部说明。

具体领域规则不要全部复制进根文件。例如订单金额舍入规则应放在领域文档或对应模块说明中，根入口只负责告诉 Agent 去哪里找。重复复制会制造两个事实来源，最终无法判断哪一份已经过期。

```text
AGENTS.md
docs/
  architecture.md
  domain/order-rules.md
  operations/local-development.md
  security/change-boundaries.md
src/orders/AGENTS.md
```

## 渐进式披露不是少给信息

渐进式披露的目标是按任务加载信息。修改订单计算时，Agent 需要订单领域规则和相关测试，不需要同时读取发布手册、前端视觉规范和所有历史决策。入口地图让它先识别任务位置，再获取局部事实。

一条规则若会被机械检查，就应在文档中链接到对应规则 ID 或测试，而不是复制实现细节。文档解释意图，工具负责裁决，两者通过稳定标识关联。

![巨型说明书迷宫与分层知识入口之间的对照](/images/blog/harness-series/03-knowledge-map-knowledge-card.svg)

*图 3：分层知识地图让 Agent 按任务寻找信息，而不是一次吞下巨型说明书。概念插画。*

## 把新鲜度变成可检查事实

项目可以机械检查相对链接是否有效、文档中的命令是否存在、所有权字段是否缺失。内容是否仍与业务一致通常需要维护者判断。不要因为链接检查通过，就宣称文档已经验证为正确。

每次人工向 Agent 重复解释同一事实时，记录它应该进入哪一层：全局项目入口、领域文档、局部 `AGENTS.md`，还是可执行规则。这样知识地图由真实任务推动，而不是预先写成一套无人维护的百科全书。

## 读者练习

从最近一次 Agent 提问中选三个事实，为每个事实指定唯一权威位置，并在根 `AGENTS.md` 中只保留必要导航。最后模拟一个不相关任务，检查入口是否会诱导 Agent 加载过多内容。

## 文章制作说明

- 备选标题：《AGENTS.md 应该是地图，不是百科全书》《渐进式披露：给 Coding Agent 正确的项目上下文》《项目知识如何真正进入 Agent 工作流》
- 图片生产：图 2 展示知识在控制环中的位置；图 3 比较巨型说明书与分层地图。均为概念图。
- 事实核查：分层 AGENTS.md 能力来自 AGENTS.md 官方说明；具体目录结构和治理方法是本文建议。
