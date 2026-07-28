---
title: "团队如何建设统一的 AI 编程 Harness"
date: 2026-07-28
---

# 团队如何建设统一的 AI 编程 Harness

当团队开始让 AI 编程 Agent 参与真实项目，一个很自然的动作是写一段初始化提示词：

> 检查技术栈，创建 `AGENTS.md`，补充测试、构建和 CI，并运行验证。

这能帮助一个项目，却不能形成团队标准。同一句提示词在不同时间、不同模型和不同代码库中，可能生成不同目录、不同规则，甚至不同的“完成”定义。团队真正需要的不是一段更长的提示词，而是一套版本化、可执行、可检查、可升级的工程支撑体系。

这套体系就是项目的 Harness。Plugin 可以用来分发它，Skill 可以承载初始化流程，MCP 可以提供外部工具，但三者都不等于 Harness 本身。

## Harness 首先是一种工程概念

Harness 原意是挽具或控制装置。在 AI Agent 语境里，它通常指模型之外、负责约束和支撑 Agent 行为的系统。

Birgitta Böckeler 在 [《Harness engineering for coding agent users》](https://martinfowler.com/articles/harness-engineering.html) 中进一步限定了编码场景：用户可以在 Coding Agent 外围建立一层 Harness。前置引导提高首次正确的概率，反馈机制则帮助 Agent 在结果进入人工审查之前自我纠正。

因此，Harness 首先是一个工程概念，也可以发展成一种工程范式，但它不是跨平台统一的插件规范。

对于一个软件项目，Harness 可能包括：

- `AGENTS.md`、架构说明、需求和验收标准；
- 安装、启动、测试、构建和发布命令；
- Skills、脚本、MCP 工具和受控的外部服务；
- lint、类型检查、测试、日志和诊断工具；
- Hooks、沙箱、审批与权限边界；
- CI/CD、代码评审、回滚和恢复路径；
- 将重复经验沉淀为规则、测试或 Skill 的机制。

可以把它理解为：

```text
Coding Agent + 项目 Harness → 可复现、可验证、可交付的工程结果
```

这里的关键词不是“自动化”，而是“可验证”。Agent 能执行命令，不代表它选择了正确命令；能生成测试，不代表测试覆盖了真实需求；能解释自己完成了任务，也不构成交付证据。

## Harness 同时需要前置引导和结果反馈

一个实用的 Harness 包含两类控制。

第一类是前置引导，也就是在 Agent 行动之前减少错误空间：

- `AGENTS.md` 说明项目规则和禁止事项；
- 需求文档说明目标、范围和验收条件；
- 架构文档指出模块边界和依赖方向；
- Skill 固化发布、调试或迁移流程；
- 脚本提供唯一、稳定的操作入口。

第二类是结果反馈，也就是 Agent 行动后能够观察到的证据：

- lint 和类型检查发现静态问题；
- 单元测试、组件测试和端到端测试验证行为；
- 结构测试检查模块边界；
- 日志、截图、Trace 和健康检查支持故障诊断；
- CI、人工评审和发布检查构成交付边界。

只有前置规则而没有反馈，团队无法知道规则是否真正奏效；只有反馈而没有前置规则，Agent 会反复制造同类问题，再依赖测试兜底。Harness Engineering 的核心是把两者连接成纠偏闭环。

这些控制还可以分成确定性与推断性两类：

| 类型 | 示例 | 特点 |
| --- | --- | --- |
| 确定性控制 | lint、类型检查、测试、结构分析、固定脚本 | 快、便宜、结果稳定，适合高频执行 |
| 推断性控制 | AI Code Review、语义重复检查、架构评审 Agent | 能处理语义问题，但成本更高，结果具有概率性 |

成熟的 Harness 不会把所有判断交给另一个模型。能够由脚本和测试确定的事实，应优先使用确定性工具；只有无法机械判断的取舍，才交给推断性评审和人工决策。

## Plugin、Skill、MCP 与 Harness 的边界

几个概念经常被混在一起，但它们解决的是不同问题：

| 概念 | 主要问题 | 典型形态 |
| --- | --- | --- |
| Harness | 如何让 Agent 在项目中可靠工作和交付 | 规则、工具、测试、权限、反馈与恢复机制的组合 |
| Plugin | 如何安装和分发一组能力 | Manifest、Skills、Hooks、MCP 配置和资源 |
| Skill | 如何稳定执行一种重复任务 | 工作流说明、参考资料、模板和辅助脚本 |
| MCP | 如何连接外部数据和操作 | MCP Server 暴露的工具与资源 |
| `AGENTS.md` | Agent 在当前仓库中应遵守什么 | 项目级持久指令 |

OpenAI 的 [Plugin 文档](https://developers.openai.com/plugins/build/plugins)要求每个 Plugin 包含 `.codex-plugin/plugin.json`。Plugin 还可以打包 Skills、MCP Server、Hooks 和资源。这个规范定义了能力如何交付，却没有规定业务项目必须怎样测试、如何发布或何时需要人工审批。

一个项目即使没有安装任何 Plugin，也可以拥有良好的 Harness。清晰的 `AGENTS.md`、统一命令、可靠测试、CI、日志和回滚方案已经能够形成完整支撑。反过来，安装很多 Plugin 也不代表 Harness 完整；工具数量无法证明目标明确、权限合理或结果经过验证。

## 单个项目的最小 Harness

Harness 没有统一目录标准，也不要求一次创建所有文件。对于一个普通项目，最小结构通常只需要：

```text
my-project/
├── AGENTS.md
├── README.md
├── package.json / pyproject.toml / go.mod
├── src/
└── test/
```

其中四个能力不可缺少：

1. **项目入口明确**：人和 Agent 都能找到安装、启动和调试方式。
2. **工作边界明确**：`AGENTS.md` 说明规则、禁止事项和完成条件。
3. **操作路径统一**：常用动作有稳定命令，而不是每次临时拼接参数。
4. **结果可以验证**：至少存在与风险相称的测试、检查或人工验收路径。

`docs/architecture.md`、`.github/workflows/ci.yml`、`.codex/config.toml`、Hooks 和项目内 Skills 都是按需增加的。小型代码库不需要为了“看起来完整”创建空目录。复杂系统也不能用一份泛化的 `AGENTS.md` 代替真实的架构约束、集成测试和恢复方案。

OpenAI 的 [`AGENTS.md` 指南](https://learn.chatgpt.com/docs/agent-configuration/agents-md)说明，Codex 会从项目根目录向当前工作目录加载指令，并让更接近当前目录的规则覆盖上层规则。这适合表达“团队基线 + 项目规则 + 子模块例外”。

但这些规则必须经过治理。应由 CI 强制执行的检查，也不能全部退化成自然语言提醒。

## 为什么自由生成不能形成团队标准

让每个项目执行“请初始化适合 AI Agent 的 Harness”，只能得到项目级建议，无法保证团队一致性，原因有四个：

1. **输入不稳定**：不同项目暴露出的文件和命令不同。
2. **推断不稳定**：模型可能对同一结构作出不同判断。
3. **模板会漂移**：复制出去的规则无法自动获得上游更新。
4. **缺少合规判断**：团队无法区分合法定制与意外偏离。

因此，团队 Harness 的权威来源不应该是一段提示词，而应该是一套版本化标准。初始化过程也不应完全由模型自由撰写；Skill 可以负责理解意图和解释冲突，真正的文件生成、字段校验和版本比较应由确定性脚本完成。

## 团队标准需要三层结构

一个可维护的团队 Harness 可以分为三层：

![团队 Harness Plugin 通过统一基线和技术栈 Profile 为不同项目生成并检查 Harness](/images/blog/harness-engineering/team-harness-plugin-architecture.svg)

*图 1：Plugin 是分发与执行入口；团队基线和 Profile 才是标准内容；业务项目只接收与自己相关的 Harness 文件。概念示意图。*

### 第一层：团队基线

团队基线只保存跨项目长期成立的规则，例如：

- 需求必须说明目标、范围和验收边界；
- 高风险写操作需要审批；
- 密钥不得进入仓库和日志；
- 项目必须提供统一验证入口；
- 修改行为必须有相应验证证据；
- 发布必须经过 CI 或明确的人工验收；
- 例外需要记录原因、负责人和失效条件。

这些规则不应该包含某个项目的路径、命令或部署地址。

### 第二层：项目 Profile

Profile 描述一种稳定的项目拓扑，而不只是编程语言。React、Python、Go 都过于宽泛，更合适的划分是：

```text
react-vite-app
react-component-library
python-fastapi-service
python-cli
go-service
go-client-library
```

同为 Python 项目，FastAPI 服务需要健康检查、API 合约和数据库迁移验证，CLI 工具则更关注参数解析、退出码和跨平台行为。Profile 必须表达这些真实差异。

### 第三层：项目覆盖

具体项目只保存自己的差异：

- 项目用途和源码目录；
- 真实存在的安装、启动、测试和构建命令；
- 部署方式和外部依赖；
- 特殊风险；
- 经过批准的标准例外。

覆盖层不能静默删除团队强制规则。项目需要偏离标准时，应在机器可读的清单中记录例外，而不是直接修改模板后失去来源。

## 一个 Plugin 管理多个 Profile

对于同时拥有 React 前端、Python 后端和 Go 客户端的团队，第一选择通常是一个团队级 Plugin，而不是每种语言一个 Plugin：

```text
team-harness/
├── .codex-plugin/
│   └── plugin.json
├── skills/
│   ├── harness-init/
│   ├── harness-check/
│   └── harness-upgrade/
├── standards/
│   ├── base/
│   └── profiles/
├── profiles/
│   ├── react-vite-app/
│   ├── python-fastapi-service/
│   └── go-client-library/
├── scripts/
│   ├── detect
│   ├── init
│   ├── check
│   └── upgrade
├── schemas/
└── test/
```

一个 Plugin 有三个直接收益：

- 团队基线只有一个权威版本；
- 成员只需安装一个能力包；
- 初始化、检查和升级使用同一套契约。

初始化器可以根据 `package.json`、`pyproject.toml`、`go.mod`、依赖和目录结构推荐 Profile，但检测结果只能作为建议。遇到 monorepo、混合技术栈或证据冲突时，应要求显式选择。初始化器不能按文件出现顺序静默决定。

每个业务项目还应记录自己采用的版本和 Profile，例如：

```json
{
  "schemaVersion": 1,
  "standard": "team-harness",
  "standardVersion": "1.0.0",
  "profiles": ["base", "react-vite-app"],
  "exceptions": []
}
```

这份清单可以放在 `.harness/manifest.json`。它不是行业标准，而是团队内部为了版本比较、合规检查和升级而定义的契约。

## React 团队应该统一什么

“统一使用 React”仍然不足以生成完全一致的 Harness。团队至少需要确定：

- 使用 Vite、Next.js 还是其他构建方式；
- 是否强制 TypeScript；
- 使用 pnpm、npm 还是 Yarn；
- 单元测试、组件测试和 E2E 分别采用什么工具；
- 样式和组件系统如何组织；
- 状态管理和数据请求是否有约定；
- 浏览器兼容和可访问性要求；
- CI 与部署平台。

以 `react-vite-app` 为例，对 Agent 暴露的命令契约可以保持稳定：

```text
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm check
```

底层工具可以随项目演进，但 `pnpm check` 应始终代表当前项目的最终本地验证入口。它可以依次执行 lint、类型检查、测试和构建。CI 再调用同一个入口，减少“本地一种规则、流水线另一种规则”的分叉。

React Profile 还应要求 `AGENTS.md` 说明组件边界、状态与数据请求、样式系统、测试策略、可访问性和完成条件。但能由 ESLint、TypeScript、测试或 CI 检查的规则，不应只停留在文字里。

## 初始化、检查和升级缺一不可

团队 Harness Plugin 至少需要两个工作流，成熟后需要三个：

### `harness-init`

- 识别项目结构并推荐 Profile；
- 读取现有文件，避免覆盖用户内容；
- 预览将创建和修改的内容；
- 生成缺失文件；
- 写入标准版本；
- 最后运行合规检查。

### `harness-check`

- 验证必需文件和章节；
- 检查文档声明的命令是否真实存在；
- 检查 lint、typecheck、test、build 和 CI 路径；
- 验证 Profile 与项目技术栈是否一致；
- 检查例外是否符合格式和有效期；
- 返回 `PASS`、`WARNING`、`FAIL` 或 `NOT_APPLICABLE`，而不是一段含糊评价。

### `harness-upgrade`

- 比较项目采用版本与当前标准；
- 区分团队模板、项目定制和人工修改；
- 输出升级差异；
- 保留合法覆盖；
- 升级后重新执行检查。

只有初始化而没有检查，标准会在项目创建后立即开始漂移；只有检查而没有升级，团队只能发现旧版本，却无法安全迁移。

## 什么时候应该拆成多个 Plugin

按语言拆 Plugin 不是默认选择。只有满足下列条件之一，拆分才可能更合理：

- 各技术栈由完全独立的团队维护；
- 发布节奏和兼容策略明显不同；
- 安全、权限或数据边界不同；
- 某个技术栈需要独立 MCP、Hooks 或外部服务；
- Plugin 已大到明显影响发现、安装或维护；
- 组织权限要求不同团队只能看到各自标准。

即使拆分，也应保留一个独立的核心契约：

```text
team-harness-core
├── 通用标准
└── 合规结果契约

team-harness-react
team-harness-python
team-harness-go
```

否则三个 Plugin 会逐渐复制并改写相同规则，最终失去“团队统一标准”的意义。

## 哪些东西是必须的

从 Plugin 格式看，最小可安装包只需要 Manifest 和至少一个 Skill。但从团队 Harness 的功能目标看，最低要求更高：

| 内容 | 是否必需 | 原因 |
| --- | --- | --- |
| `.codex-plugin/plugin.json` | 必需 | 提供稳定身份和安装入口 |
| 团队基线标准 | 必需 | 建立唯一权威来源 |
| 至少一个真实 Profile | 必需 | 把通用原则映射到项目形态 |
| 初始化 Skill | 必需 | 提供受控的使用入口 |
| 合规检查 Skill | 必需 | 防止标准变成一次性模板 |
| 确定性生成与检查脚本 | 必需 | 保证相同输入得到一致结果 |
| 标准版本和项目清单 | 必需 | 支持比较、例外和升级 |
| Fixtures 与自动测试 | 必需 | 防止初始化器破坏现有项目 |
| 升级 Skill | 推荐 | 标准稳定后补充 |
| CI 模板 | 按团队环境决定 | 使用统一 CI 时应提供 |
| MCP Server、UI | 通常不需要 | 初始化本地文件不需要外部服务 |

第一版不应追求覆盖所有语言和框架。更稳妥的范围是选择团队真实存在的三种项目形态，例如 `react-vite-app`、`python-fastapi-service` 和 `go-client-library`。先完成初始化、检查、冲突保护和测试，再增加新的 Profile。

## Better Harness 位于哪个位置

[Better Harness](https://github.com/QoderAI/better-harness) 用来评审和改进项目 Harness，而不是充当团队 Harness 标准。它从任务理解、受控执行、变更验证、可靠交付和经验沉淀等维度收集证据，帮助团队发现规则、工具和反馈机制之间的缺口。

二者可以配合：

```text
团队 Harness Plugin
    负责定义、初始化、检查和升级标准

Better Harness
    负责从真实项目与任务证据中发现系统性缺口
```

Better Harness 的发现可以推动团队标准演进，但不应未经评审就自动改写标准。一次检查通过只能证明当前机制被执行；要证明改进长期有效，还需要后续相似任务的可比较结果。

## 从模板走向持续治理

Harness 不是创建项目时生成一批文件就结束。真正的工程价值来自持续闭环：

```text
团队发布标准
    ↓
项目选择 Profile 并初始化
    ↓
本地与 CI 持续检查
    ↓
真实任务暴露重复问题
    ↓
团队更新规则、脚本或测试
    ↓
项目升级并验证效果
```

Plugin 解决分发，Profile 解决差异，脚本保证确定性，检查器防止漂移，版本机制支持升级。把这几部分连接起来，团队才拥有统一的 Harness；否则得到的只是许多看起来相似、实际上无法治理的 `AGENTS.md`。

## 资料与事实边界

- [Harness engineering for coding agent users](https://martinfowler.com/articles/harness-engineering.html)：本文关于前置引导、反馈机制、确定性与推断性控制以及 Harness Template 的主要概念来源。
- [OpenAI：Package your plugin](https://developers.openai.com/plugins/build/plugins)：Plugin Manifest、Skills、MCP 与 Hooks 等交付结构的来源。
- [OpenAI：Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)：Codex 加载项目指令及目录覆盖关系的来源。
- [AGENTS.md](https://agents.md/)：跨 Agent 项目指令文件的开放约定。
- [QoderAI/Better Harness](https://github.com/QoderAI/better-harness)：五维评审模型与证据边界的项目来源。

本文提出的 `team-harness`、Profile 命名和 `.harness/manifest.json` 是团队内部设计建议，不是 OpenAI、AGENTS.md 或 Better Harness 发布的统一行业规范。具体命令、CI、测试框架和安全门禁，仍应根据团队真实技术栈确定。
