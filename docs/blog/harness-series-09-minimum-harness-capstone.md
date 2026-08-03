---
title: "Harness 实战（九）：为现有项目搭建最小可运行 Harness"
description: "用一个订单搜索任务连接 Goal Contract、知识地图、标准命令、机械约束、行为证据和持续治理。"
date: 2026-08-03
---

# Harness 实战（九）：为现有项目搭建最小可运行 Harness

> **系列目录（当前：9/9）** · [总目录](./harness-engineering-practical-series) · [诊断](./harness-series-01-project-diagnosis) · [目标契约](./harness-series-02-goal-contract) · [知识地图](./harness-series-03-project-knowledge-map) · [执行面](./harness-series-04-command-surface) · [机械约束](./harness-series-05-mechanical-constraints) · [反馈闭环](./harness-series-06-feedback-loop) · [证据评估](./harness-series-07-evidence-evaluation) · [持续治理](./harness-series-08-continuous-governance) · **完整实战**

最小 Harness 不是目录模板，而是一项真实任务可以从目标进入执行、经过验证、留下证据，并把失败经验写回项目的完整控制环。

[![Harness Engineering 系列完整知识地图](/images/blog/harness-series/harness-knowledge-map.svg)](/images/blog/harness-series/harness-knowledge-map.svg)

*图 1：Harness Engineering 系列知识地图。本篇连接此前八篇的全部区域。概念示意图。*

![系列第九篇连接完整最小 Harness](/images/blog/harness-series/09-capstone-focus.svg)

*图 2：最小可运行 Harness 需要契约、知识、命令、约束、证据和治理共同参与。概念示意图。*

## 实战目标：给订单列表增加精确搜索

示例选择一个边界较小但可以验证 UI 行为的功能：用户输入完整订单号后，列表只保留对应订单；清空输入恢复原列表；没有结果时显示空状态。示例不包含服务端跨页搜索和数据库变更。

项目可以使用任意框架。本文关注接口和证据，不把 React、Vue 或某个测试工具当作 Harness 的必需组成。

## 第一步：保存 Goal Contract

将目标、范围、非目标、验收、风险和升级条件写入版本化任务文件。明确当现有接口不返回订单号，或需求变成跨页搜索时停止执行并请求人类判断。

完成标准至少对应三条行为：精确匹配、清空恢复、无结果空状态。`lint`、`test` 和 `build` 是工程检查，不替代这三条产品验收。

## 第二步：建立最小知识入口

根 `AGENTS.md` 只提供项目地图、标准命令、全局边界和领域文档链接。订单模块文档保存分页协议、订单号格式及列表数据来源。确认每条关键事实只有一个权威位置。

## 第三步：统一命令与隔离环境

Manifest 保存安装、Lint、测试、构建和启动命令。任务在独立 Worktree 或等价隔离目录执行，并分配独立端口和测试数据。所有命令必须非交互结束并返回可靠退出码。

## 第四步：机械化最关键的边界

第一版不需要建立几十条规则。选择最容易在任务中被破坏的三条：UI 不直接访问数据库、搜索输入不改变分页游标协议、日志不得记录完整用户查询。分别使用结构测试、集成测试或日志检查裁决。

## 第五步：执行并观察用户场景

Agent 修改实现后运行静态和动态检查，再启动应用执行三条验收场景。观察接口数据、页面状态、控制台错误和必要截图。任何无法验证的区域明确写入 Evidence Bundle。

## 第六步：独立评估最终状态

确定性脚本先检查命令退出码、证据完整性和最终工作区指纹。只读评估器逐条引用 Goal Contract 与行为证据，输出 `passed`、`failed` 或 `needs_judgment`。执行 Agent 不能修改代码来迎合评估结论。

![契约、知识、命令、约束、证据和治理组成 Harness 全景控制台](/images/blog/harness-series/09-capstone-knowledge-card.svg)

*图 3：完整控制台展示最小 Harness 的组件关系。概念插画，不代表特定工具界面。*

## 第七步：把人工介入写回 Harness

如果人类必须解释“清空输入时应保留当前页”，先判断这是产品规则还是临时决定。稳定规则进入订单领域文档，并增加相应行为测试。下一次列表筛选任务应能直接发现并验证该规则。

最终目录可以很小：

```text
AGENTS.md
.harness/
  manifest.yaml
  goals/order-search.yaml
  evidence/order-search/
docs/domain/orders.md
scripts/verify.*
```

目录本身不是完成标准。只有整条链真实运行并留下最终状态证据，项目才拥有最小可运行 Harness。

## 把九篇产物连接成一次真实运行

最终目录不需要复杂平台，先让仓库自身拥有闭环：

```text
harness/
  manifest.yaml
  goals/order-search.yaml
  audits/order-search-baseline.md
  interventions.yaml
  scorecard.md
docs/domain/orders.md
scripts/harness/
  setup.mjs
  check.mjs
tests/
  api/order-search.test.ts
  e2e/order-search.spec.ts
artifacts/                  # 不提交运行产物
```

一次完整运行遵循同一协议：读取契约；沿知识入口确认领域事实；在隔离环境安装；修改并运行静态、API 和行为检查；用 `run_id` 关联结果；失败时在有限轮次内修正；最终生成证据包并交给独立评估；最后把人工介入写回 Harness。

可以用一个很小的编排脚本串联命令，但不能吞掉退出码：

```js
const checks = [
  ['static', 'pnpm', ['lint']],
  ['api', 'pnpm', ['test', '--', 'order-search']],
  ['e2e', 'pnpm', ['test:e2e', '--', 'order-search']],
  ['build', 'pnpm', ['build']]
]

for (const [name, command, args] of checks) {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: true })
  evidence.checks.push({ name, command: [command, ...args].join(' '), exitCode: result.status })
  if (result.status !== 0) process.exit(result.status ?? 1)
}
```

示例省略了产物哈希、超时和秘密脱敏，生产脚本应补齐这些边界。Harness 的价值不在脚本长度，而在目标、命令、状态和证据使用同一套可追踪标识。

### 做一次反向演练

完成正常路径后，故意制造三类失败：删除租户过滤、让浏览器测试保留旧 cursor、使某条失败命令错误返回 `0`。系统应分别在安全约束、行为验证和命令协议层阻止交付。如果错误直到人工看页面才暴露，说明闭环仍有断点。

## 验收清单

- Agent 能从稳定入口找到任务相关事实。
- 标准命令在干净、隔离环境中可重复运行。
- 高价值边界由确定性机制裁决。
- 三项行为验收均有对应观察证据。
- 证据绑定最终状态，未验证区域没有被隐藏。
- 需要业务或高风险判断时能够停止并升级。
- 至少一项任务经验已经回写到项目 Harness。
- 故意注入的租户、游标和退出码错误都能被对应保障面发现。
- 新会话只读取仓库内容即可复现同一运行协议。

## 读者练习

选择一个一天内能完成功能和验证的小任务，按七步流程运行。不要预先搭建复杂平台；每遇到一次人工介入，就记录它属于目标、知识、执行、观察、验证还是判断，再决定是否值得沉淀。

---

**上一篇：**[让 Harness 在真实任务中持续进化](./harness-series-08-continuous-governance) · **[返回系列目录](./harness-engineering-practical-series)**
