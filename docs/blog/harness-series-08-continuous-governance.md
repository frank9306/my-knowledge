---
title: "Harness 实战（八）：让 Harness 在真实任务中持续进化"
description: "把人工介入和重复失败升级为文档、规则、测试与工具，并用证据观察 Harness 是否真正改善。"
date: 2026-08-03
---

# Harness 实战（八）：让 Harness 在真实任务中持续进化

> **系列目录（当前：8/9）** · [总目录](./harness-engineering-practical-series) · [诊断](./harness-series-01-project-diagnosis) · [目标契约](./harness-series-02-goal-contract) · [知识地图](./harness-series-03-project-knowledge-map) · [执行面](./harness-series-04-command-surface) · [机械约束](./harness-series-05-mechanical-constraints) · [反馈闭环](./harness-series-06-feedback-loop) · [证据评估](./harness-series-07-evidence-evaluation) · **持续治理** · [完整实战](./harness-series-09-minimum-harness-capstone)

Harness 不是初始化时生成的一批文件。它的长期价值来自同类任务再次发生时，Agent 是否少走弯路、少等人，并保留同等或更强的验证证据。

[![Harness Engineering 系列完整知识地图](/images/blog/harness-series/harness-knowledge-map.svg)](/images/blog/harness-series/harness-knowledge-map.svg)

*图 1：Harness Engineering 系列知识地图。概念示意图。*

![系列第八篇关注的证据、沉淀和治理区域](/images/blog/harness-series/08-continuous-governance-focus.svg)

*图 2：交付证据和人工介入记录共同驱动下一轮 Harness 改进。概念示意图。*

## Agent 会复制仓库中的一切模式

清晰模块、可靠测试和准确文档会被复用；重复辅助函数、过期命令和临时绕过也会被复制。OpenAI 的 Harness Engineering 案例描述了团队将反复出现的工程偏好编码为检查，并通过后台任务持续清理偏差。[OpenAI：Harness engineering](https://openai.com/index/harness-engineering/)

这不意味着每个项目都需要自动创建重构 PR。更普遍的原则是：把重复失败转化为可审查、可验证、作用范围明确的 Harness 改进。

## 经验升级有一条成本阶梯

```text
一次性提示
→ 项目文档
→ 机械规则
→ 回归测试
→ 确定性工具
```

偶发且高度依赖语境的提醒留在任务记录中；稳定项目事实进入文档；能够可靠检测的边界进入规则；已经造成缺陷的行为增加回归测试；跨任务反复需要的机械操作才值得做成工具。

升级并非越靠后越好。脚本和规则都有维护成本。只有当重复频率、影响和可检测性足够高时，自动化才比文档或人工判断更合适。

## 用人工介入记录寻找改进机会

每次介入保存五项：任务类型、发生阶段、缺少的事实或能力、临时处理、最终去向。连续几周后，可以按原因聚合：缺命令、缺领域知识、验证不足、权限边界不清、环境冲突或业务判断。

优先处理高频且能稳定复现的问题。一次检查发现的偏差只是候选改进；规则真正有效，需要在后续相似任务中观察人工介入和修正轮数是否下降。

![项目花园通过文档、规则、测试和工具持续清理坏模式](/images/blog/harness-series/08-continuous-governance-knowledge-card.svg)

*图 3：持续治理不是一次大扫除，而是把重复问题转化为更可靠的生长条件。概念插画。*

## 指标必须对应工程结果

- 自主完成率：无需人工补充事实即可达到验收的任务比例。
- 人工介入次数：按原因和阶段分类，而不是只看总量。
- 首次验证通过率：发现问题前是否运行了正确检查。
- 修正轮数：失败到重新达标经历多少次循环。
- 缺陷逃逸：已有验证未能阻止的问题。
- 漂移趋势：架构违规、重复模式和过期文档是否增加。

代码行数、提交数和任务数量反映吞吐量，不直接证明正确性或用户价值。指标应帮助团队选择下一个 Harness 改进，而不是成为推动 Agent 制造更多变更的目标。

## 实战：把订单搜索返工转成 Harness 改进

交付结束后，不复盘“Agent 表现好不好”，而是复盘人工在哪些时刻提供了系统本可提供的信息。为每次介入记录类别、耗时、风险、重复次数和目标去向：

```yaml
- task: order-search
  intervention: 明确订单号只在租户内唯一
  category: missing_domain_fact
  minutes: 18
  risk: high
  repeated: 2
  promote_to:
    - docs/domain/orders.md
    - tests/api/order-number-scope.test.ts
```

这条纠正已经出现两次且涉及越权风险，因此不应只加一段提示。领域事实解释原因，集成测试负责裁决，两者共同升级 Harness。

### 建立每月记分卡

选择少量能对应工程结果的指标：自主完成率、每任务人工介入次数、因缺失上下文导致的失败比例、验证覆盖率、同类纠正复发率、平均恢复轮数。每个指标都要保留分母和观察窗口。

```md
| 指标 | 本月 | 上月 | 目标 | 解释 |
|---|---:|---:|---:|---|
| 有效任务数 | 24 | 21 | - | 排除取消任务 |
| 无人工介入完成 | 15/24 | 10/21 | ≥70% | 只计证据完整任务 |
| 同类纠正复发 | 2 | 5 | ≤1 | 按根因归类 |
| 验收条件有证据 | 91% | 76% | ≥95% | 由验收矩阵计算 |
```

不要把 token 数、生成代码行数或“Agent 使用次数”直接当质量指标。它们可以解释成本，却不能证明交付更可靠。

### 维护一份有退出条件的改进积压

每项改进必须包含触发证据、预期降低的介入、实现成本、负责人和完成定义。优先处理高风险复发项，其次处理高频低成本项。三个月没有触发且维护成本高的规则，应评估删除或降级；持续治理也包括清除过时约束。

## 完成检查

- 所有改进都来自真实任务证据，而不是模板偏好；
- 指标包含分母、观察窗口和明确口径；
- 高风险纠正同时进入知识与机械验证；
- 改进积压有负责人、优先级和退出条件；
- 定期检查过时文档、失效规则和无价值指标。

## 读者练习

汇总最近五次人工介入，按知识、工具、环境、验证、权限和判断分类。选出最常见的一类，提出一个最小改进，并定义后续三次相似任务中要观察的证据。

---

**上一篇：**[谁来判断 Coding Agent 真正完成了](./harness-series-07-evidence-evaluation) · [返回系列目录](./harness-engineering-practical-series) · **下一篇：**[为现有项目搭建最小可运行 Harness](./harness-series-09-minimum-harness-capstone)
