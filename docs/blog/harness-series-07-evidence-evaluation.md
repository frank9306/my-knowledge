---
title: "Harness 实战（七）：谁来判断 Coding Agent 真正完成了"
description: "用确定性检查、最终状态证据、独立评估和人工判断分离执行者与裁判。"
date: 2026-08-03
---

# Harness 实战（七）：谁来判断 Coding Agent 真正完成了

执行任务的 Agent 可以收集证据，却不应只凭自己的总结决定任务已经完成。结论必须能追溯到最终状态和逐项验收。

[![Harness Engineering 系列完整知识地图](/images/blog/harness-series/harness-knowledge-map.svg)](/images/blog/harness-series/harness-knowledge-map.svg)

*图 1：Harness Engineering 系列知识地图。概念示意图。*

![系列第七篇关注的观察、验证、证据与裁决](/images/blog/harness-series/07-evidence-evaluation-focus.svg)

*图 2：运行结果经过机械验证形成证据，再由独立角色裁决语义验收。概念示意图。*

## “测试通过”缺少哪些信息

一句“所有测试已通过”没有说明执行了哪个命令、针对哪个工作区状态、是否跳过测试、退出码是什么，也没有覆盖无法自动化的验收条件。若 Agent 修改代码后没有重跑检查，之前的成功记录已经过期。

PolyHarness 的 Goal Evaluation 设计将 Goal Contract、Evidence Bundle 和只读评估分开。评估只能引用证据包中的最终状态材料。[PolyHarness：Goal evaluation](https://github.com/frank9306/PolyHarness/blob/v0.2.0/docs/goal-evaluation.md)

这是一种具体实现，不是 Harness 的唯一协议，但它清楚展示了执行与裁决分离的价值。

## 四种经常被混淆的证据状态

1. **存在**：仓库里能找到测试脚本或配置。
2. **接线**：标准命令确实指向该机制。
3. **执行**：本次任务实际运行了命令。
4. **通过**：该次执行以预期退出码结束。

发现 `test` 脚本，只能证明机制存在；读取 CI 配置也不能证明本次本地变更已经通过。报告必须使用与证据强度相符的词。

## 三层裁决模型

### 确定性工具检查事实

文件是否存在、命令退出码、测试数量、Schema 是否有效、最终工作区指纹是否匹配，都应优先由脚本决定。

### 独立评估处理语义验收

“空状态是否符合 Goal Contract”“变更是否越出范围”需要结合上下文判断。评估器保持只读，逐项引用证据，不能为了让结果通过而修改实现。

### 人类承担高风险和业务判断

支付、权限、数据迁移、不可逆操作以及产品取舍不应伪装成自动化确定结论。评估器输出 `needs_judgment`，同时说明缺少哪项决定。

![脚本、独立评估器和人类分别裁决不同类型的问题](/images/blog/harness-series/07-evidence-evaluation-knowledge-card.svg)

*图 3：三层质量法庭避免执行者仅凭自我报告完成任务。概念插画。*

## Evidence Bundle 的最小内容

```json
{
  "goalId": "order-search",
  "finalState": "git-tree-or-workspace-fingerprint",
  "checks": [
    { "name": "test", "command": "pnpm test", "exitCode": 0 }
  ],
  "behavioralEvidence": [
    { "acceptance": "empty-state", "artifact": "empty-state.png" }
  ],
  "unverifiedAreas": ["screen-reader announcement"]
}
```

证据包不是越大越好。每一项应能回答具体验收问题，并绑定最终状态。日志中可能包含令牌、用户数据或私有路径，收集前需要脱敏策略。

## 读者练习

拿一份最近的 Agent 完成报告，把每个结论标记为“存在、接线、执行、通过或语义判断”。删除没有证据支持的句子，为剩余结论补上命令、最终状态或行为产物。

## 文章制作说明

- 备选标题：《不要让执行 Agent 同时当裁判》《从“完成了”到可追溯工程结论》《Evidence Bundle：Coding Agent 的证据责任》
- 图片生产：局部图呈现从观察到裁决；手绘图用三层法庭区分职责。
- 事实核查：PolyHarness 状态与评估边界来自 v0.2.0 文档；示例 Evidence Bundle 是简化展示。
