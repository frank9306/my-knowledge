---
title: "Harness 实战（二）：把自然语言需求变成 Goal Contract"
description: "用目标、范围、验收、风险和升级条件约束 Coding Agent，避免它正确实现错误的需求。"
date: 2026-08-03
---

# Harness 实战（二）：把自然语言需求变成 Goal Contract

> **系列目录（当前：2/9）** · [总目录](./harness-engineering-practical-series) · [诊断](./harness-series-01-project-diagnosis) · **目标契约** · [知识地图](./harness-series-03-project-knowledge-map) · [执行面](./harness-series-04-command-surface) · [机械约束](./harness-series-05-mechanical-constraints) · [反馈闭环](./harness-series-06-feedback-loop) · [证据评估](./harness-series-07-evidence-evaluation) · [持续治理](./harness-series-08-continuous-governance) · [完整实战](./harness-series-09-minimum-harness-capstone)

Goal Contract 的作用不是把需求写得更长，而是保存执行期间不能被悄悄改变的目标、边界和完成条件。

[![Harness Engineering 系列完整知识地图](/images/blog/harness-series/harness-knowledge-map.svg)](/images/blog/harness-series/harness-knowledge-map.svg)

*图 1：Harness Engineering 系列知识地图。概念示意图。*

![系列第二篇关注的 Goal Contract 区域](/images/blog/harness-series/02-goal-contract-focus.svg)

*图 2：Goal Contract 位于目标与执行之间，负责把自然语言意图转换成可验收任务。概念示意图。*

## Prompt 会消失，契约必须留下

“给订单页增加搜索”看似清楚，实际没有说明按什么字段搜索、是否允许模糊匹配、空查询如何处理、接口是否需要变更。Agent 可以实现出一套自洽方案，却仍然与产品意图不一致。

普通 Prompt 适合发起对话；Goal Contract 适合在执行过程中保存共同约束。它不是 OpenAI、AGENTS.md 或任何框架规定的统一格式，而是本文用于项目 Harness 的任务接口。关键不在 YAML，而在执行者、验证器和人类是否引用同一组条件。

## 一份最小契约包含什么

```yaml
id: order-search
objective: 用户可以按订单号查找当前列表中的订单

scope:
  include:
    - 订单号精确匹配
    - 无结果空状态
  exclude:
    - 客户名搜索
    - 搜索历史

acceptance:
  - 输入完整订单号后只显示对应订单
  - 清空输入后恢复原列表
  - 无匹配项时显示明确空状态

constraints:
  - 不修改数据库结构
  - 保持现有分页协议

risk: low
escalate_when:
  - 需求要求跨页服务端搜索
  - 现有接口不返回订单号
```

`objective` 解释用户最终得到什么；`scope` 防止顺手扩张；`acceptance` 描述可观察行为；`constraints` 保存不能破坏的项目条件；`escalate_when` 则告诉 Agent 何时停止猜测。

## 把形容词改成可观察行为

“搜索要快速”“界面要友好”“错误要优雅”不能直接验收。契约应写成在具体输入和状态下可以观察的结果。例如，将“无结果时友好提示”改成“接口成功但结果为空时，页面显示空状态，不显示错误通知”。

机械检查和语义验收也要分开：`pnpm test` 可以证明已有测试通过，却不能自动证明搜索结果符合产品意图。后者需要对应的行为场景；如果验收仍包含审美或业务取舍，则保留人工判断，不强迫脚本给出伪确定结论。

![模糊需求经过契约加工后形成目标、范围、验收和风险任务卡](/images/blog/harness-series/02-goal-contract-knowledge-card.svg)

*图 3：Goal Contract 把模糊需求加工为稳定任务边界。概念插画。*

## 执行中发现新范围怎么办

Agent 发现“当前列表没有订单号字段”时，不应自行扩大到后端改造。正确动作是记录发现、引用 `escalate_when`，说明原目标为何无法在现有边界内完成。人类可以修改契约，也可以缩小目标；无论选择哪一种，都留下版本化记录。

契约一旦改变，之前的验证证据可能失效。最终评估必须引用执行结束时的契约版本，而不是最初 Prompt 的记忆。

## 实战：把订单搜索写成可执行契约

在仓库中创建 `harness/goals/order-search.yaml`。下面的示例重点不是 YAML 格式，而是让不同执行者能够对“完成”得出同一个结论：

```yaml
id: order-search
goal: 在订单列表中按完整订单号查找当前租户的订单
scope:
  include:
    - GET /api/orders 的 q 参数
    - 订单列表搜索框和空状态
    - 查询变化时重置分页游标
  exclude:
    - 模糊搜索
    - 订单内容全文检索
    - 数据库迁移
acceptance:
  - 输入两端空白会被移除
  - 空字符串等同于未提供 q
  - 完整订单号只返回当前租户中的匹配记录
  - 修改 q 或 status 后从第一页重新查询
  - 无匹配结果时页面显示明确空状态
risk:
  - 不得移除服务端 tenant_id 过滤
  - 不得记录完整订单号和访问令牌
escalate_when:
  - 现有订单号在租户内并不唯一
  - 实现需要修改数据库结构
verify:
  - pnpm lint
  - pnpm test -- order-search
  - pnpm test:e2e -- order-search
```

### 逐字段审查契约

先检查 `goal` 是否描述用户可观察结果，而不是“修改 OrderList 组件”这类实现动作。再检查 `scope.exclude`：它防止 Agent 在发现数据库索引问题后自行扩大任务。`acceptance` 中每一项都要能映射到测试或人工判断；“体验良好”无法直接裁决，应改成输入、响应、页面状态或延迟预算。

风险与升级条件承担不同职责。风险说明执行时始终不能破坏什么；升级条件说明遇到什么事实后必须暂停并请求判断。示例中租户过滤是硬边界，而订单号唯一性未知会改变产品语义，所以应升级。

### 用反例检验验收条件

为每条条件至少构造一个反例：`" ORD-1042 "` 检查 trim；租户 B 的同号数据检查隔离；先翻到第二页再输入查询检查游标重置；输入全空格检查是否错误发送 `q=`。如果团队无法就反例的正确结果达成一致，契约仍不完整，不应进入编码。

### 执行中如何变更契约

实现时若发现订单号只在门店内唯一，不要静默添加 `store_id`。在契约中记录发现、影响和候选方案，将状态改为 `needs_decision`。人类确认后更新目标与验收，再继续执行。这样保存的是决策链，而不是在聊天记录中留下无法追踪的一句同意。

## 完成检查

- `goal` 只描述一个可观察结果；
- 范围明确列出包含项和非目标；
- 每条验收条件都有对应反例和验证方式；
- 风险边界与升级条件分开表达；
- 执行者无权静默扩大范围；
- 契约文件已进入版本控制并能被后续工具引用。

## 读者练习

找一条包含“优化、支持、完善、友好、智能”等词的真实需求，把它改写成 Objective、Include、Exclude、Acceptance、Constraints 和 Escalate When。

随后逐条检查：是否存在两个工程师会给出不同解释的句子？若有，继续改写或明确保留人工判断。

---

**上一篇：**[先诊断项目真正缺少什么](./harness-series-01-project-diagnosis) · [返回系列目录](./harness-engineering-practical-series) · **下一篇：**[让 Agent 找得到项目答案](./harness-series-03-project-knowledge-map)
