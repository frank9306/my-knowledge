---
title: "PolyHarness：把 Coding Agent 的“完成了”变成可验证的工程结论"
date: 2026-07-30
description: "PolyHarness 如何通过 Goal Contract、Capability、Profile、最终状态证据和独立评估，把自然语言开发请求变成边界明确、可检查、可升级的 Agent 工程流程。"
---

# PolyHarness：把 Coding Agent 的“完成了”变成可验证的工程结论

Coding Agent 最容易制造的错觉，不是代码完全不能运行，而是它在完成了部分实现、执行了一条测试命令后，就给出一句听起来很完整的结论：任务已经完成。

这句话可能是真的，也可能只是“实现看起来合理”“仓库里存在测试”或“某条命令刚刚返回了 0”。如果需求没有固定的验收边界、测试结果与最终代码状态没有绑定、开发者同时负责给自己的工作下结论，那么项目仍然缺少一条从需求到交付的可信证据链。

[PolyHarness](https://frank9306.github.io/PolyHarness/) 就是为这条证据链设计的。它是一套面向 Coding Agent 的项目工程 Harness：通过项目规则、Goal Contract、最终状态证据和严格评估，约束 Agent 从理解需求到交付验证的完整过程。

它的目标不是让模型“更聪明”，而是让项目更难被含糊地完成。

## 为什么不能只写一份更长的提示词

提示词可以告诉 Agent 应该谨慎、应该测试、应该遵守项目规范，但自然语言提醒有三个天然边界。

第一，提醒不能自动固定需求。Agent 可能在实现过程中重新解释目标，把难以完成的验收条件缩小成当前代码已经满足的版本。

第二，配置存在不等于机制生效。仓库里有 `AGENTS.md`、测试目录或 CI 文件，只能证明这些静态资产存在，不能证明本次任务读取了正确规则、执行了相关测试，更不能证明测试覆盖了用户的验收条件。

第三，执行者的叙述不是独立证据。Agent 可以描述自己改了什么，却不应仅凭这段描述判定任务已经达成。测试通过也只是证据的一部分；交付物、约束、未验证区域和最终工作区状态同样需要检查。

PolyHarness 因此把容易混在一起的四件事拆开：

- 用稳定工作循环定义所有项目都应遵守的工程过程；
- 用 Capability 表达不同产品形态真正不同的风险和验证边界；
- 用 Goal Contract 固定一次任务的目标与验收条件；
- 用 Evidence Bundle 和严格评估决定证据是否足以支持“完成”。

## 一套稳定循环，多个可组合能力

PolyHarness 的核心架构刻意不以语言或框架为中心。Python、Go、React 和 Vue 会变化，具体依赖版本也会变化，但可靠开发仍然需要理解任务、控制执行、验证改动、可靠交付和沉淀经验。

因此，PolyHarness 把通用工程纪律放进稳定的工作循环，再把场景差异交给 Capability。当前 v0.2.0 提供五类产品表面能力：

- `api-service`：后台 API 服务；
- `web-ui`：浏览器 Web 界面；
- `cli`：命令行工具；
- `tui`：终端界面；
- `gui`：桌面图形应用。

Capability 关心的不是“用了什么流行框架”，而是项目暴露了什么边界。API 服务需要接口、可观测性和运行状态方面的证据；浏览器界面需要构建、交互和浏览器级验证；桌面应用还要处理原生进程、权限与前端渲染之间的边界。这些差异不能由一份通用 `AGENTS.md` 可靠覆盖。

![PolyHarness 将稳定工作循环、Capability 和 Profile 汇入项目 Manifest，再形成项目 Harness](/images/blog/polyharness/polyharness-architecture.svg)

*图 1：PolyHarness 的分层结构。Profile 只负责初始化组合，项目运行时以 Manifest 中明确记录的 Capability 为准。概念示意图。*

Profile 则是常见技术组合的初始化配方。例如，`python-fastapi` 将 API 场景与 Python/FastAPI 的实现参数组合起来。`tauri-react` 则组合 `gui` 与 `web-ui` 两种 Capability，并提供 Rust、Tauri 和 React 的实现参数。

这个区分解决了模板系统常见的漂移问题：如果 Profile 同时拥有规则，那么 `python-fastapi`、`go-gin` 等模板会重复保存大量相同内容，之后很难判断一条规则应该统一修改，还是只适用于某个框架。PolyHarness 让 Capability 管规则，让 Profile 只负责组合和建议；初始化完成后，Manifest 记录显式 Capability，检查器不再依赖一个容易被误解的模板名称。

截至 v0.2.0，项目提供 11 个 Profile，覆盖 API、Web UI、CLI、TUI 和 GUI。用户也可以绕过 Profile，直接组合 Capability。检测结果只负责推荐，不会在多个候选都合理时静默替用户做决定。

## Goal Contract：先冻结“什么算完成”

当用户说“帮我开发登录功能”，PolyHarness 的开发 Skill 会先把自然语言请求整理成 Goal Contract。它至少保存：

- Objective：本次任务要改变什么；
- Acceptance Criteria：哪些可观察结果必须成立；
- Constraints：不能破坏或越过什么边界；
- Non-goals：哪些内容不在本次范围内；
- Deliverables：最终必须出现哪些交付物。

Goal Contract 的价值不在于多生成一份文档，而在于让验收边界先于实现结果存在。Agent 不能因为当前方案只完成了一部分，就删除、降低或重新解释验收条件。用户后续提出的修正也必须被保留下来，而不是被新的实现叙述覆盖。

这一步把“看起来做完了”改写成一组可以逐项判断的问题。例如，“登录功能完成”可以拆成有效凭据成功登录、无效凭据返回稳定错误契约、公共 API 保持兼容、回归测试存在且在最终状态通过。每一项需要的证据不同，也可能得到不同结论。

## Evidence Bundle：证据必须属于最终状态

测试结果会过期。Agent 可能先运行测试，随后继续修改源码；也可能执行了一个宽泛但与本次风险无关的命令。仅记录“测试曾经通过”无法证明最终工作区仍满足要求。

PolyHarness 的 Evidence Bundle 会把项目检查、代码变更、交付物和最终工作区指纹绑定在一起。开发 Agent 负责实现并收集证据，确定性检查负责拒绝缺失、失败或过期的结果，独立的只读评估器再逐项判断验收条件。评估器不能修改实现来迎合结论，也不能引用 Evidence Bundle 之外的未知证据。

![从自然语言需求到 Goal Contract、实现、最终状态证据和独立评估的闭环](/images/blog/polyharness/polyharness-goal-evidence-loop.svg)

*图 2：任务完成不是开发 Agent 的一句总结，而是 Goal Contract、最终状态 Evidence Bundle 与独立评估共同形成的结论。概念示意图。*

评估结果不是一个可以互相抵消的百分制分数，而是六种有边界的状态：

- `ACHIEVED`：所有必要条件、约束和交付物都由当前最终状态证据证明；
- `PARTIAL`：证据只证明了某个必要条件的一部分；
- `NOT_ACHIEVED`：证据表明必要条件或交付物失败；
- `UNPROVEN`：实现可能合理，但缺少可采信证据或证据已经过期；
- `BLOCKED`：明确的外部边界阻止任务完成；
- `NOT_APPLICABLE`：检查后的证据证明某个条件不适用。

这种设计故意保留“不知道”。在工程交付中，`UNPROVEN` 比一个猜测出来的“基本完成”更有价值，因为它直接指出下一步需要补什么证据。

## PRESENT、WIRED、EXERCISED 不是同一个事实

PolyHarness 对项目机制也使用分层证据状态：

- `MISSING`：没有找到要求或建议的证据；
- `PRESENT`：项目拥有静态配置，但没有证明运行行为；
- `WIRED`：项目配置了真实命令；
- `EXERCISED`：PolyHarness 在本次检查中实际执行了该命令；
- `UNOBSERVED`：这条规则需要人工或项目特定证据。

如果存在有效且未过期的例外，对应规则可以变为 `NOT_APPLICABLE`，但例外不会把被豁免的行为伪装成通过。

![PolyHarness 对静态存在、命令接线和本次实际执行保留不同证据边界](/images/blog/polyharness/polyharness-evidence-states.svg)

*图 3：证据强度逐级增加，但每一级只证明自己的事实。`PRESENT` 不能被描述成执行成功，`WIRED` 也不能替代本次运行结果。概念示意图。*

这套状态模型带来的直接好处是报告更诚实。检查器不会因为仓库存在 `test/` 目录就宣布验证完成，也不会因为 `package.json` 里出现 `check` 命令就声称该命令已经执行。它只报告实际观察到的状态，并为失败项提供稳定规则 ID、严重级别和最小修复方向。

## 六类 Skill 如何组成日常工作流

PolyHarness v0.2.0 通过 Codex Plugin 提供六类自然语言工作流：

| Skill | 解决的问题 | 关键边界 |
| --- | --- | --- |
| `harness-init` | 为现有项目初始化 Harness | 先检测和预览，不覆盖项目已有内容 |
| `harness-develop` | 按 Goal Contract 开发或修复 | 不得弱化目标，完成后收集最终状态证据 |
| `harness-check` | 检查 Manifest、规则、命令和例外 | 不把静态存在描述成已经执行 |
| `harness-evaluate` | 严格判断一次目标是否达成 | 只读评估，逐项引用 Evidence Bundle |
| `harness-upgrade` | 升级 Harness 标准 | 保留项目版本、覆盖和用户内容 |
| `harness-versions` | 查询稳定、LTS 或 GA 版本 | 只使用已配置的官方在线来源 |

用户不需要先学习一套复杂命令，可以直接说：

```text
帮我初始化这个项目的 Harness
帮我开发登录功能
帮我检查这个项目是否符合 Harness 规范
帮我评估登录功能是否真的完成
```

Skill 负责理解意图、读取项目和解释冲突，插件自带的运行器则负责确定性的检测、生成、检查和评估门禁。所有托管文件修改默认只预览，只有明确应用后才写入。这让自然语言保留了交互效率，又没有把关键状态变更完全交给模型自由发挥。

## 这样做能得到什么

### 需求不会被实现结果反向改写

Goal Contract 将目标、验收条件和约束固定下来。开发过程中可以补充事实、修正理解，但不能为了让当前实现“通过”而降低标准。团队评审时也能直接看到是实现不足、证据不足，还是外部条件阻塞。

### 项目差异可以组合，不必复制整套模板

稳定工作循环负责跨项目原则，Capability 负责产品边界，Profile 负责常用组合。增加一个框架通常只需要调整实现参数或 Profile；只有出现新的工程风险和证据需求时，才需要增加 Capability。规则的权威来源因此更清楚。

### “通过测试”不再等于“目标完成”

测试只能证明它覆盖到的行为。PolyHarness 还会检查交付物、约束、当前工作区指纹和语义验收条件。确定性检查先处理可以机械判断的事实，独立评估只处理自动化无法直接决定的部分，减少模型主观判断的范围。

### 检查结果可以被修复和复跑

结构化规则 ID、证据状态、严重级别和修复建议让检查结果不再是一段泛泛的代码评审。团队可以针对失败项修改项目，再运行同一条验证路径，确认状态是否真的变化。

### Harness 可以升级，而不是一次性生成

项目 Manifest 记录采用的标准、Capability 和参数。升级工作流只更新受管内容，保留项目覆盖与用户文件，并在应用前展示差异。这样，Harness 才可能成为长期治理机制，而不是项目初始化当天生成后就开始漂移的一批文件。

## PolyHarness 不替代什么

PolyHarness 建立和检查项目机制，但不会替代业务设计、领域判断、人工审批、真实用户验收或生产环境观测。

一次 `EXERCISED` 只能证明某条命令在本次检查中执行过，不能证明团队的长期工程效率已经提升；一次 `ACHIEVED` 也只针对当前 Goal Contract 和最终工作区状态，不应被扩大成对整个项目质量的保证。

它与 [Better Harness](https://github.com/QoderAI/better-harness) 的边界也不同。PolyHarness 负责定义、初始化、检查和升级项目机制，并严格评估一次具体目标。Better Harness 更适合从真实任务片段和长期证据中观察 Harness 是否有效，寻找任务理解、受控执行、变更验证、可靠交付和经验沉淀方面的系统性缺口。

前者回答“项目有没有一套可执行、可检查的机制，以及这次目标是否被当前证据证明”，后者回答“这套机制在真实工作中是否持续产生更好的结果”。

## 安装与开始使用

PolyHarness v0.2.0 已提供自包含的 Codex Plugin 发布包。通过 GitHub 仓库安装时，正式项目建议固定 Release tag：

```text
codex plugin marketplace add 'https://github.com/frank9306/PolyHarness.git' --ref v0.2.0
codex plugin add polyharness@polyharness
```

安装或升级后需要新建一个 Codex 任务，让宿主重新加载 Plugin 中的 Skill。随后在项目目录中直接用自然语言描述目标即可。

PolyHarness 最重要的改变不是多了一条命令，而是重新规定了“完成”的证据责任：需求由 Goal Contract 保存，执行由项目边界约束，验证结果绑定最终状态，语义结论由独立评估给出。Coding Agent 仍然可以快速实现，但项目不必再仅凭它的一句“已经完成”决定是否交付。

## 资料与事实边界

- [PolyHarness 官方文档](https://frank9306.github.io/PolyHarness/)：安装方式、能力范围、Profile 与设计原则。
- [PolyHarness GitHub 仓库](https://github.com/frank9306/PolyHarness)：README、Plugin Manifest、Skills、标准和实现代码。
- [PolyHarness v0.2.0 Release](https://github.com/frank9306/PolyHarness/releases/tag/v0.2.0)：本文版本号、发布日期与发布内容的依据。
- [Goal evaluation](https://github.com/frank9306/PolyHarness/blob/v0.2.0/docs/goal-evaluation.md)：Goal Contract、Evidence Bundle、评估状态与持久化边界。
- [Core philosophy](https://github.com/frank9306/PolyHarness/blob/v0.2.0/docs/core-philosophy.md)：稳定工作循环、Capability、Profile 和 Manifest 的职责划分。

本文对收益的描述是基于 PolyHarness 机制做出的工程分析，不代表已经通过跨团队对照实验验证的效率结论。文中的三张图均为依据 v0.2.0 文档绘制的概念示意图，不是运行数据或产品界面截图。
