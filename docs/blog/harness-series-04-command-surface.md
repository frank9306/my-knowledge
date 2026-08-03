---
title: "Harness 实战（四）：统一 Coding Agent 的项目执行面"
description: "把安装、开发、测试、构建和预览整理成唯一、非交互、可重复且可诊断的标准命令。"
date: 2026-08-03
---

# Harness 实战（四）：统一 Coding Agent 的项目执行面

> **系列目录（当前：4/9）** · [总目录](./harness-engineering-practical-series) · [诊断](./harness-series-01-project-diagnosis) · [目标契约](./harness-series-02-goal-contract) · [知识地图](./harness-series-03-project-knowledge-map) · **执行面** · [机械约束](./harness-series-05-mechanical-constraints) · [反馈闭环](./harness-series-06-feedback-loop) · [证据评估](./harness-series-07-evidence-evaluation) · [持续治理](./harness-series-08-continuous-governance) · [完整实战](./harness-series-09-minimum-harness-capstone)

项目文档里出现一条命令，不代表 Agent 能稳定执行它。真正的执行面必须拥有唯一入口、明确环境、可靠退出码和可解释失败。

[![Harness Engineering 系列完整知识地图](/images/blog/harness-series/harness-knowledge-map.svg)](/images/blog/harness-series/harness-knowledge-map.svg)

*图 1：Harness Engineering 系列知识地图。概念示意图。*

![系列第四篇关注的标准命令与隔离环境](/images/blog/harness-series/04-command-surface-focus.svg)

*图 2：隔离环境和标准命令共同把 Agent 的动作转换成可观察结果。概念示意图。*

## 为什么 README 中的命令仍然不够

`npm test` 可能启动监听模式，等待用户按键；开发服务器可能默认占用固定端口；测试可能悄悄读取本机数据库；构建脚本失败后仍返回零退出码。工程师熟悉这些隐含条件，可以临时绕开，Agent 却会把它们当成项目事实。

The Twelve-Factor App 使用依赖显式声明、配置进入环境、开发与生产接近等做法提高应用可移植性。[The Twelve-Factor App](https://12factor.net/)

它不是 Coding Agent Harness 规范，但这些原则同样有助于构建可重复执行环境。

## 标准命令必须满足五个条件

1. **唯一入口**：同一种检查只有一个推荐命令，内部实现可以变化。
2. **非交互**：命令可以无人值守结束，不等待选择或确认。
3. **退出码可靠**：通过返回 0，失败返回非 0，配置错误与检查失败可以区分。
4. **输出可诊断**：说明失败的规则、位置和原因，必要时提供机器可读格式。
5. **环境一致**：本地、Agent 会话与 CI 调用同一个执行入口。

一份简单 Manifest 可以保存已经确认的项目事实：

```yaml
commands:
  install: pnpm install --frozen-lockfile
  lint: pnpm lint
  typecheck: pnpm typecheck
  test: pnpm test -- --run
  build: pnpm build
  preview: pnpm preview --host 127.0.0.1
```

Manifest 是团队内部接口，不是行业标准。初始化时可以检测 `package.json`、CI 和已有文档来提出候选值；确认以后，应读取显式配置，避免每次运行重新猜测。

## 隔离不只意味着 Git Worktree

Git 官方文档将 Worktree 定义为同一仓库关联的多个工作树，每个工作树可检出不同分支。[Git worktree](https://git-scm.com/docs/git-worktree) 它能隔离文件变更，但不会自动隔离端口、缓存、数据库和外部服务。

每个并行任务至少要明确：工作目录、端口分配、临时数据位置、服务实例、测试账号和清理策略。任何共享资源都可能让两个独立任务互相污染，制造无法复现的通过或失败。

![统一控制台为 Agent 提供安装、开发、检查、测试、构建和预览入口](/images/blog/harness-series/04-command-surface-knowledge-card.svg)

*图 3：统一执行面隐藏工具差异，但保留可靠的结果和诊断信息。概念插画。*

## 错误输出也是接口

“Command failed”只告诉 Agent 发生了失败。“ARCH-003：`src/ui` 不得导入 `src/db`，位置 `src/ui/order.ts:8`”则提供可修正反馈。错误消息应包含稳定规则 ID、位置、实际状态、期望状态和必要的修复方向。

不要把所有输出都改造成 JSON。人类需要易读摘要，Agent 和 CI 需要结构化结果；合理方式是提供 `--json` 或输出报告文件，同时在终端保留简洁诊断。

## 实战：给订单搜索建立唯一执行入口

先把团队口头传播的命令收敛为项目脚本。下面以 `package.json` 为例，其他语言也应提供同样稳定的语义：

```json
{
  "scripts": {
    "harness:setup": "node scripts/harness/setup.mjs",
    "harness:check": "node scripts/harness/check.mjs",
    "harness:test:order-search": "vitest run tests/order-search",
    "harness:e2e:order-search": "playwright test order-search.spec.ts"
  }
}
```

再创建 `harness/manifest.yaml`，把工具实际需要的接口写清楚：

```yaml
runtime:
  node: "20"
package_manager: "pnpm@10"
commands:
  setup: pnpm harness:setup
  static: pnpm lint
  focused_test: pnpm harness:test:order-search
  behavior_test: pnpm harness:e2e:order-search
  build: pnpm build
environment:
  required: [DATABASE_URL]
  optional: [ORDER_FIXTURE_SEED]
artifacts:
  junit: artifacts/test-results.xml
  screenshots: artifacts/order-search/
```

Manifest 不是另一份 README。它让 Agent 和 CI 读取同一组命令名、环境要求和产物位置，避免一个使用 `npm test`，另一个使用带隐藏参数的本地脚本。

### 让失败可以被机器理解

标准命令应满足三条最低要求：非交互运行；成功返回 `0`，失败返回非零；错误输出指出动作、对象和下一步。比如数据库不可用时，应输出缺少的服务和启动命令，而不是吞掉异常后返回成功。

在干净 Worktree 或临时目录中依次执行 setup、focused test、build。不要因为开发机已安装全局工具就判定可重复。记录 Node、包管理器、浏览器和数据库镜像版本；锁定的是会影响结果的依赖，不是把每个微小实现都冻结。

### 验证环境隔离

为订单测试使用固定租户和固定数据种子，测试结束后清理命名空间。并行执行两次同一场景，确认端口、数据库记录和截图目录不会互相覆盖。若无法并行，Manifest 必须声明互斥资源，而不是让失败表现为偶发不稳定。

## 完成检查

- 新环境只需 Manifest 中的入口即可完成安装和验证；
- 所有命令非交互且退出码可信；
- 环境变量区分必需、可选和禁止记录的秘密；
- 两个隔离任务不会共享可变数据或输出目录；
- 失败信息能直接指向缺失条件或修复动作。

## 读者练习

在一个现有项目中连续两次从干净环境运行安装、测试和构建。记录任何提示输入、全局依赖、端口冲突和隐含数据。选择其中一个不确定因素，将它改成显式参数或标准脚本接口。

---

**上一篇：**[让 Agent 找得到项目答案](./harness-series-03-project-knowledge-map) · [返回系列目录](./harness-engineering-practical-series) · **下一篇：**[把工程经验变成机械约束](./harness-series-05-mechanical-constraints)
