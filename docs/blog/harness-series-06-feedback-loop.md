---
title: "Harness 实战（六）：让 Agent 看见并修正结果"
description: "连接日志、API、DOM、截图、测试和行为场景，构建 Coding Agent 可以读取的观察—验证—修正闭环。"
date: 2026-08-03
---

# Harness 实战（六）：让 Agent 看见并修正结果

> **系列目录（当前：6/9）** · [总目录](./harness-engineering-practical-series) · [诊断](./harness-series-01-project-diagnosis) · [目标契约](./harness-series-02-goal-contract) · [知识地图](./harness-series-03-project-knowledge-map) · [执行面](./harness-series-04-command-surface) · [机械约束](./harness-series-05-mechanical-constraints) · **反馈闭环** · [证据评估](./harness-series-07-evidence-evaluation) · [持续治理](./harness-series-08-continuous-governance) · [完整实战](./harness-series-09-minimum-harness-capstone)

Agent 能修改代码只是执行能力；它能观察软件、识别失败并重新验证，才形成可持续的任务闭环。

[![Harness Engineering 系列完整知识地图](/images/blog/harness-series/harness-knowledge-map.svg)](/images/blog/harness-series/harness-knowledge-map.svg)

*图 1：Harness Engineering 系列知识地图。概念示意图。*

![系列第六篇关注的观察验证反馈回路](/images/blog/harness-series/06-feedback-loop-focus.svg)

*图 2：执行、观察、验证、修正和重验构成 Agent 可以重复运行的反馈闭环。概念示意图。*

## 测试通过为什么仍可能交付失败

单元测试只证明被覆盖的输入和断言成立。页面可能没有显示接口返回的数据，日志可能泄露敏感字段，服务可能在真实配置下无法启动。若 Agent 只能读取测试结果，它看不到这些运行行为。

OpenTelemetry 将 Trace、Metric 和 Log 作为遥测信号，用于理解软件运行状态。[OpenTelemetry Docs](https://opentelemetry.io/docs/concepts/signals/) Harness 不要求项目必须采用 OpenTelemetry，但需要让 Agent 通过稳定接口获得与任务相关的状态，而不是依靠人类转述。

## 建立三层验证

### 静态验证

格式、类型、Lint 和架构规则运行快，适合尽早发现确定性问题。它们不需要启动完整应用。

### 动态验证

单元、集成和端到端测试执行代码，验证预先编码的行为。测试失败必须保留命令、退出码和错误位置。

### 行为验证

启动应用并执行用户场景：调用真实接口、检查页面状态、读取可访问性树、截图或比较关键日志。行为验证直接对应 Goal Contract 的验收条件。

![观察、验证、修正和重验形成可重复控制循环](/images/blog/harness-series/06-feedback-loop-knowledge-card.svg)

*图 3：Agent 必须能够读取每一步产生的反馈，才能自主纠偏。概念插画。*

## 从验收条件生成观察点

验收条件“无匹配订单时显示空状态”至少需要三个观察点：接口成功并返回空数组、页面出现指定空状态、控制台没有未处理错误。如果只能验证其中两项，应把第三项记录为未验证区域，而不是推断它也正确。

观察工具本身也需要隔离。浏览器实例、端口、测试账号和数据夹具必须与并行任务分开，否则 Agent 可能观察到另一个任务留下的状态。

## 失败回路必须有停止条件

一次失败进入“读取反馈—定位原因—修改—重验”。但循环不能无限运行。达到重试上限、需要扩大范围、出现不可逆操作、证据互相矛盾或缺少权限时，Agent 应保存当前状态并升级给人类。

升级消息应说明：原目标、已经尝试的步骤、稳定复现方式、当前证据、无法继续的具体原因，以及需要人类作出的决定。这样人工接管是控制环的一部分，而不是失败后的临时聊天。

## 实战：跑通订单搜索的观察—验证—修正循环

从 Goal Contract 反推观察点，而不是先决定“写几个测试”。本例至少需要观察请求参数、API 返回、页面状态和租户隔离结果。

```ts
test('searches an exact order number and resets pagination', async ({ page }) => {
  await page.goto('/orders?status=paid&cursor=page-2')
  await page.getByRole('searchbox', { name: '订单号' }).fill(' ORD-1042 ')
  await page.getByRole('button', { name: '搜索' }).click()

  await expect(page).toHaveURL(/status=paid/)
  await expect(page).not.toHaveURL(/cursor=/)
  await expect(page.getByTestId('order-row')).toHaveCount(1)
  await expect(page.getByText('ORD-1042')).toBeVisible()
})
```

浏览器断言证明用户路径，API 集成测试证明租户过滤，结构化日志则帮助定位失败。三者不能互相替代：截图看见一行订单，不代表服务端没有返回额外敏感字段；接口响应正确，也不代表页面清除了旧游标。

### 为一次运行保存关联信息

每次验证生成 `run_id`，把它加入应用日志、测试报告和截图目录。日志至少记录路由、结果数量、耗时和错误类型，但订单号与令牌需要脱敏。失败后，Agent 应能从测试用例跳到对应请求，再定位到服务端日志，而不是人工翻找多个终端。

建议保留下面的产物结构：

```text
artifacts/order-search/<run-id>/
  request.json
  response-summary.json
  app.log
  test-results.xml
  final-state.png
```

### 限制自动修正循环

将失败分类为 `implementation`、`environment`、`requirement` 和 `risk`。只有明确的实现失败允许自动修改后重试；环境失败先恢复环境；需求歧义和风险边界直接升级。设置最多三轮修正，并要求连续两轮出现同类失败时停止，防止 Agent 在错误目标上持续改动。

一次合法循环是：执行场景 → 收集带 `run_id` 的结果 → 由断言裁决 → 定位最小原因 → 修改 → 重跑所有受影响检查。只重跑刚失败的断言可能掩盖回归，因此最终一轮必须执行契约规定的完整验证集合。

## 完成检查

- 每条验收条件都对应可读取的观察点；
- API、页面和安全边界分别由合适层级验证；
- 日志、报告和截图能通过 `run_id` 关联；
- 自动修正有次数、重复失败和风险停止条件；
- 最终验证覆盖完整验收集合，而非只有最后一个失败项。

## 读者练习

选择一个现有验收条件，分别写出静态、动态和行为验证能回答的问题。启动应用完成一次场景，保存命令、退出码、关键日志和可视结果。最后删除其中一项证据，判断你还能否诚实地宣称验收通过。

---

**上一篇：**[把工程经验变成机械约束](./harness-series-05-mechanical-constraints) · [返回系列目录](./harness-engineering-practical-series) · **下一篇：**[谁来判断 Coding Agent 真正完成了](./harness-series-07-evidence-evaluation)
