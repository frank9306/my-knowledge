---
title: "Harness 实战（二）：把自然语言需求变成 Goal Contract"
description: "用目标、范围、验收、风险和升级条件约束 Coding Agent，避免它正确实现错误的需求。"
date: 2026-08-03
---

# Harness 实战（二）：把自然语言需求变成 Goal Contract

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

## 读者练习

找一条包含“优化、支持、完善、友好、智能”等词的真实需求，把它改写成 Objective、Include、Exclude、Acceptance、Constraints 和 Escalate When。

随后逐条检查：是否存在两个工程师会给出不同解释的句子？若有，继续改写或明确保留人工判断。

## 文章制作说明

- 备选标题：《Agent 为什么会正确实现错误需求》《从 Prompt 到任务契约：给 Coding Agent 一条稳定边界》《Goal Contract：Harness 的任务接口》
- 图片生产：图 2 聚焦目标与验收；图 3 用加工台隐喻展示结构化过程。均为概念图。
- 事实核查：Goal Contract 字段与示例是本文设计建议；不得表述为 OpenAI 或 AGENTS.md 的官方规范。
