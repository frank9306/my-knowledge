# Vibe Coding 工具 Codex 测评

本目录保存 Vibe Coding 插件、Agent Skills 与研发工作流的可复现实验协议。公开文章只能引用这里已经生成并通过校验的结果，不能根据 README、Star 数或一次主观体验直接评级。

## 测试目标

回答四个问题：

1. 工具是否让 Codex 更容易完成任务，而不是只增加流程。
2. 它在哪些任务上稳定增益，在哪些任务上会造成额外成本或干扰。
3. 它的安装、触发、上下文与维护成本有多高。
4. 哪类用户和项目适合使用它。

## 公平性约束

- 执行器固定为 Codex CLI `0.144.2`。
- 模型固定为 `gpt-5.4`，`model_reasoning_effort = "high"`。
- 所有实验组加载同一份全局提示词：<https://knowledge.webfrank.top/agents>。
- 基线组为“Codex + 全局提示词”，不加载任何第三方 Skill。
- 每次运行使用全新 Git 工作副本、临时 Codex Home 和 `--ephemeral --json`。
- Codex 使用 `danger-full-access` 运行，但工作目录只指向一次性样例；这样既允许真实执行测试，也能通过工作树审计工具是否遵守只读约束。
- 通过 `[[skills.config]]` 禁用本机已有的全局 Skills，防止实验组互相污染。
- 自然语言触发与显式 `$skill-name` 调用分开计分。
- 修改类任务使用隐藏测试验证；诊断与审查任务验证工作树没有被修改。
- 每个计分任务至少重复 3 次。单次结果只用于校准，不进入最终评级。
- 版本、提交、Prompt、命令轨迹、耗时、token 与最终输出必须保存。

## 被测对象分类

不同类别解决的问题不同，不生成一个误导性的总榜。

### 可组合工程 Skills

- Waza
- Skills for Real Engineers
- Superpowers

### 端到端研发流程

- Everything Claude Code
- Get Shit Done
- GitHub Spec Kit
- BMAD Method

### 专项能力

- Vercel Agent Skills
- Anthropic Skills

### 安装与管理

- Easy-ECC
- Vercel Skills CLI

Microsoft Waza 只作为评测方法参考。当前版本的真实执行引擎是 Copilot SDK，尚未提供可用的 Codex engine，因此不参与本次 Codex 执行。

## 两套主测试

### 工程闭环测试

用于比较基线、Waza、Matt Skills、Superpowers 与 ECC：

1. 只诊断、不修复一个稳定复现的金额分摊错误。
2. 以 TDD 方式实现带边界条件的新功能。
3. 审查一个包含租户越权、缓存隔离和输入边界问题的 diff。
4. 根据决策完整的需求包生成可执行计划，不修改代码。
5. 从本地来源包生成带证据的技术决策说明。

### 端到端流程测试

用于比较基线、Superpowers、ECC、GSD Standard、Spec Kit 与 BMAD：

1. 为同一个棕地功能生成规格、计划与任务拆分。
2. 在全新工作副本中实现功能、运行验证并交付证据。

专项 Skills 使用独立任务，不把 React、文档或 UI 专项能力混入通用工程得分。

## 评分

每项动态任务使用独立的 100 分验证器。诊断题检查真实复现、根因、修复原则和只读约束；实现题检查隐藏测试、可见测试、Red-Green 轨迹、测试变更和修改范围；审查题检查预置 finding、行号和只读约束；规格与计划题检查必需工件、需求覆盖、验证方式和范围。

套件分是所有重复运行的任务分算术平均值。“质量达标”表示任务分不低于 80；“按时通过”还要求没有触发硬超时。输入 token、耗时、Skill 激活证据、安装兼容性和维护证据单独展示，不偷偷揉进任务分。

评级门槛：

| 评级 | 分数 | 附加条件 |
| --- | ---: | --- |
| S | 90-100 | 核心任务至少 3 次重复中无失败，且无安全扣分 |
| A | 80-89.9 | 有稳定净增益，失败不影响核心结果 |
| B | 70-79.9 | 有明确适用场景，但成本或波动明显 |
| C | 60-69.9 | 只在窄场景有价值，或需要较多人工兜底 |
| D | 0-59.9 | 当前 Codex 环境下收益不足、不可稳定运行或风险过高 |

安装失败不会自动把能力内容判为 D，但会降低单独列出的 Codex 兼容性评级，并阻止“开箱即用”结论。

## 本次结果

- 工程组：48 次运行，见 [`results/engineering-2026-07-16/aggregate.md`](results/engineering-2026-07-16/aggregate.md)。
- ECC Full smoke：3 次运行，见 [`results/ecc-smoke-2026-07-16/aggregate.md`](results/ecc-smoke-2026-07-16/aggregate.md)。
- 端到端规格组：12 次运行，见 [`results/workflow-spec-2026-07-16/aggregate.md`](results/workflow-spec-2026-07-16/aggregate.md)。
- 合计 63 次计分运行。校准阶段发现并修复的评分器问题没有计入正式结果。

## 已确认的校准事实

- 单独设置 `CODEX_HOME` 与 `USERPROFILE` 不能阻止 Codex 发现 `C:\Users\frank\.agents\skills`。基线必须显式禁用所有已安装 Skill。
- Windows 的 `workspace-write` 沙箱会拦截样例中的 `npm test`，造成“没有验证”的假阴性，因此动态任务改在一次性工作副本中使用 `danger-full-access`，并以 diff 和进程轨迹检查安全性。
- Codex 官方为初始 Skill 元数据清单设置上下文预算。大型 Skill 集可能被缩短描述或省略条目，因此必须实测发现与触发。
- GSD `1.42.3` 稳定版在 Codex 本地安装中生成 18 个 Standard Skills、67 个 Full Skills。
- Spec Kit `0.12.16` 为 Codex 生成 10 个 `.agents/skills` 工作流。
- BMAD `6.10.0` 的 BMM Codex 安装生成 46 个 `.agents/skills` 工作流。
- Easy-ECC `0.1.0` Standard 会规划 9 项 ECC `v2.0.0` 能力，但在当前依赖代理的 Windows 网络中，裸 Node `fetch` 直连 GitHub 会触发 `UND_ERR_CONNECT_TIMEOUT`。dry-run 正常，实际安装不稳定。

## 结果发布规则

- 不用 Star、下载量或作者自述替代实测。
- 不把不同类别的工具强行排成一个总榜。
- 如果来源观点冲突，文章同时保留双方主张和实测证据。
- 结果必须注明版本、日期、Codex 版本、模型、运行次数和已知限制。
- 未完成 3 次重复的项目标记为“校准中”，不提供正式评级。
