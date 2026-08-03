---
title: "Harness 实战（五）：把工程经验变成机械约束"
description: "从重复审查意见中提取项目不变量，并用类型、Lint、结构测试和 CI 建立可修正的 Agent 护栏。"
date: 2026-08-03
---

# Harness 实战（五）：把工程经验变成机械约束

> **系列目录（当前：5/9）** · [总目录](./harness-engineering-practical-series) · [诊断](./harness-series-01-project-diagnosis) · [目标契约](./harness-series-02-goal-contract) · [知识地图](./harness-series-03-project-knowledge-map) · [执行面](./harness-series-04-command-surface) · **机械约束** · [反馈闭环](./harness-series-06-feedback-loop) · [证据评估](./harness-series-07-evidence-evaluation) · [持续治理](./harness-series-08-continuous-governance) · [完整实战](./harness-series-09-minimum-harness-capstone)

写在文档里的规则只能帮助 Agent 理解意图；进入类型、Lint、测试或 CI 的规则，才能稳定裁决一次变更是否越界。

[![Harness Engineering 系列完整知识地图](/images/blog/harness-series/harness-knowledge-map.svg)](/images/blog/harness-series/harness-knowledge-map.svg)

*图 1：Harness Engineering 系列知识地图。概念示意图。*

![系列第五篇关注的安全边界、受约束执行和机械验证](/images/blog/harness-series/05-mechanical-constraints-focus.svg)

*图 2：机械约束连接执行边界与确定性验证。概念示意图。*

## 从重复纠正中寻找不变量

代码审查中反复出现“UI 不能直接访问数据库”“外部输入必须先验证”“日志不能包含访问令牌”，说明团队依赖人工记忆维持边界。把每条意见都追加到提示词，只会扩大上下文；真正稳定的做法是判断哪些规则可以被机械执行。

OpenAI 的 Harness Engineering 案例描述了通过自定义 Lint 和结构测试维护依赖方向与工程规则的实践，同时强调在边界内部保留实现自由。[OpenAI：Harness engineering](https://openai.com/index/harness-engineering/) 这是该项目的经验，具体约束必须来自你自己的架构和风险模型。

## 四类常见不变量

- **架构不变量**：模块依赖方向、公共入口、数据访问边界。
- **数据不变量**：边界输入校验、Schema 一致性、迁移兼容要求。
- **可靠性不变量**：超时、资源释放、幂等性和错误传播。
- **安全不变量**：权限检查、密钥保护、日志脱敏和高风险审批。

NIST 对最小权限的定义是只授予完成任务所必需的权限。[NIST Glossary：Least Privilege](https://csrc.nist.gov/glossary/term/least_privilege) 在 Harness 中，这意味着 Agent 的工具权限和命令范围也应按任务收窄，而不是默认获得所有能力。

## 选择正确的裁决工具

类型系统适合接口形状和状态约束；Lint 适合局部语法、导入和调用模式；结构测试适合跨目录依赖；单元测试验证具体行为；CI 负责组合并强制执行这些检查。不要让另一个模型判断可以由确定性工具回答的事实。

一条好规则应当满足：违规可以可靠检测，误报成本可接受，错误消息能指导修复，必要时存在经过审批的例外机制。无法满足这些条件的偏好先留在文档和审查中，不要仓促变成阻断式检查。

![道路护栏表示严格工程边界和边界内部的实现自由](/images/blog/harness-series/05-mechanical-constraints-knowledge-card.svg)

*图 3：护栏限制危险方向，但不规定边界内每一步如何实现。概念插画。*

## 可修正错误比“严格”更重要

```text
ARCH-003 src/ui/order.ts:8
实际：UI 模块直接导入数据库适配器
期望：UI 只能调用 application 层公开接口
修复：将查询移动到 src/application/orders
```

这类输出让 Agent 能够定位、修改和重验。只有“架构检查失败”会迫使执行者重新探索规则，增加修正轮数。

规则升级也应保持可审查：先在历史代码上运行，识别存量违规和误报；再决定修复、记录临时例外或缩小检查范围。机械化不等于突然让全部历史代码无法交付。

## 实战：为订单搜索落地四条不变量

从第一篇的返工记录里选择会造成真实损失、且能稳定检测的规则。订单搜索适合先落地四条：

1. 订单查询必须携带当前 `tenantId`；
2. 前端不得向日志和分析事件发送完整订单号；
3. `q` 或 `status` 变化时必须清空 `cursor`；
4. API 契约变化必须同步契约测试。

每条规则选择离错误最近的裁决层。租户隔离应在查询构造器和集成测试中验证，不能只靠代码评审；日志脱敏可用 Lint 或测试捕获；游标重置属于状态转换测试；API 变化交给 schema diff 或契约测试。

```ts
it('always scopes exact order lookup to the active tenant', async () => {
  await seedOrder({ tenantId: 'tenant-b', orderNo: 'ORD-1042' })

  const result = await searchOrders({
    tenantId: 'tenant-a',
    q: 'ORD-1042'
  })

  expect(result.items).toEqual([])
})
```

这个测试不证明整个系统安全，但它精确守住本次已知边界。对于必须覆盖所有查询入口的规则，可以再增加架构测试：禁止路由直接调用数据库，只允许通过自动附加租户条件的 repository。

### 先证明规则会失败

临时构造一个违反规则的最小样例，确认检查确实返回非零，然后撤销样例并确认恢复通过。没有经历这一步的“绿色检查”可能只是没有扫描正确目录。验证范围、忽略规则和测试夹具都应接受反向测试。

### 给失败提供修正路径

错误消息至少包含规则名称、触发文件、为什么危险和安全替代方式。例如：

```text
ORDER_QUERY_TENANT_SCOPE: src/orders/search.ts 绕过 TenantOrderRepository。
订单读取必须使用 TenantOrderRepository，以便自动附加 tenant_id 条件。
```

自动修复只适合语义明确的变换，例如补格式或替换废弃导入。权限、数据迁移和跨层架构调整不应由工具静默改写。

## 完成检查

- 只选择 3～5 条有失败记录支撑的不变量；
- 每条规则都有唯一标识、理由、覆盖范围和安全替代；
- 已用故意违规样例证明规则真的会失败；
- 检查接入统一命令和 CI，而不是仅存在于个人脚本；
- 例外有到期时间和负责人，不能永久静默忽略。

## 读者练习

收集最近十条代码审查意见，找出出现两次以上的模式。选择一条可可靠检测的规则，为它定义规则 ID、检测范围、错误示例、正确示例和例外条件，再决定使用类型、Lint、结构测试还是单元测试。

---

**上一篇：**[统一 Coding Agent 的项目执行面](./harness-series-04-command-surface) · [返回系列目录](./harness-engineering-practical-series) · **下一篇：**[让 Agent 看见并修正结果](./harness-series-06-feedback-loop)
