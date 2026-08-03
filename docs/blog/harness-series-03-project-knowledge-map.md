---
title: "Harness 实战（三）：让 Agent 找得到项目答案"
description: "以分层 AGENTS.md、渐进式披露和单一事实来源构建 Agent 可发现、可维护的项目知识地图。"
date: 2026-08-03
---

# Harness 实战（三）：让 Agent 找得到项目答案

> **系列目录（当前：3/9）** · [总目录](./harness-engineering-practical-series) · [诊断](./harness-series-01-project-diagnosis) · [目标契约](./harness-series-02-goal-contract) · **知识地图** · [执行面](./harness-series-04-command-surface) · [机械约束](./harness-series-05-mechanical-constraints) · [反馈闭环](./harness-series-06-feedback-loop) · [证据评估](./harness-series-07-evidence-evaluation) · [持续治理](./harness-series-08-continuous-governance) · [完整实战](./harness-series-09-minimum-harness-capstone)

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

## 实战：为订单搜索建立渐进式知识入口

目标不是把所有文档塞进根目录 `AGENTS.md`，而是让 Agent 在进入相关目录时逐步得到必要事实。可以从下面的结构开始：

```text
AGENTS.md
docs/
  architecture/
    request-flow.md
  domain/
    orders.md
  runbooks/
    local-api.md
apps/
  web/
    AGENTS.md
services/
  orders/
    AGENTS.md
```

根文件只维护导航、全局禁令和标准命令：

```md
# Project map

- Web 约束：`apps/web/AGENTS.md`
- 订单领域：`docs/domain/orders.md`
- 请求链路：`docs/architecture/request-flow.md`
- 本地 API：`docs/runbooks/local-api.md`

## Global boundaries
- 不执行生产数据库操作。
- 涉及迁移、权限扩大或不可逆操作时停止并升级。
```

`services/orders/AGENTS.md` 再说明局部事实：所有查询必须显式接收 `tenantId`；订单号不是全局唯一；分页游标绑定过滤条件；相关测试和固定夹具位于哪里。它不复制根文件，也不写容易过期的长篇架构史。

### 写出单一事实来源

同一个事实只选择一个权威位置。订单号唯一性属于领域规则，应写入 `docs/domain/orders.md`；局部 `AGENTS.md` 只链接它并说明何时阅读。若接口注释、Wiki 和测试夹具出现三个版本，Agent 仍然只能猜。

给重要页面增加最少的维护信息：责任目录、最后验证日期和验证方式。例如“通过 `tests/api/order-number-scope.test.ts` 验证”，比“最后更新于本月”更有意义，因为工具可以检查链接是否存在，测试可以证明事实仍然接线。

### 做一次可发现性演练

开启一个没有聊天历史的新任务，只提供 Goal Contract 和仓库入口，记录执行者为了回答下面四个问题打开了哪些文件：

1. 订单号在哪个范围内唯一？
2. 本地如何启动订单 API？
3. 修改过滤条件后游标如何处理？
4. 哪些变更必须人工批准？

如果答案需要全文搜索实现细节、询问人类或读取互相矛盾的文档，就把缺口写回知识目录。演练的验收不是“文件已经创建”，而是新会话能沿稳定路径得到同一答案。

## 完成检查

- 根入口不承载整本手册，只提供导航和全局边界；
- 领域、架构、运行和安全事实各有明确归属；
- 同一事实只有一个权威来源，其他位置使用链接；
- 新会话能够独立回答四个订单搜索关键问题；
- 过期或冲突文档有负责人和可检查的更新机制。

## 读者练习

从最近一次 Agent 提问中选三个事实，为每个事实指定唯一权威位置，并在根 `AGENTS.md` 中只保留必要导航。最后模拟一个不相关任务，检查入口是否会诱导 Agent 加载过多内容。

---

**上一篇：**[把自然语言需求变成 Goal Contract](./harness-series-02-goal-contract) · [返回系列目录](./harness-engineering-practical-series) · **下一篇：**[统一 Coding Agent 的项目执行面](./harness-series-04-command-surface)
