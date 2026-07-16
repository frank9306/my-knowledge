---
title: "Codex 实测：12 套 Vibe Coding Plugins 与 Skills 怎么选"
date: 2026-07-16
---

# Codex 实测：12 套 Vibe Coding Plugins 与 Skills 怎么选

装更多 Skills，不一定会让 Codex 更能干。这次固定 Codex CLI、模型、全局提示词和任务，在隔离环境里跑了 63 次计分实验。结果里最稳定的增益出现在 Matt Pocock 的 TDD skill，最明显的代价则是上下文、耗时和流程启动成本。原生 Codex 加一份清晰的 `AGENTS.md`，在小型诊断、审查和一次性规划上已经很强。

本次纳入 [Waza](https://github.com/tw93/Waza)、[Skills for Real Engineers](https://github.com/mattpocock/skills)、[Superpowers](https://github.com/obra/superpowers)、[Everything Claude Code](https://github.com/affaan-m/ECC)、[Easy-ECC](https://github.com/frank9306/Easy-ECC)、[Get Shit Done](https://github.com/gsd-build/get-shit-done)、[GitHub Spec Kit](https://github.com/github/spec-kit)、[BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD)、[Vercel Agent Skills](https://github.com/vercel-labs/agent-skills)、[Anthropic Skills](https://github.com/anthropics/skills) 和 [Vercel Skills CLI](https://github.com/vercel-labs/skills)。[Microsoft Waza](https://github.com/microsoft/waza) 用来设计评测方法，不作为 Codex 执行器参赛。

## 结论和评级

不同工具解决的问题不一样，本文不设跨类别总冠军。等级只对表内场景有效。

### 可组合工程 Skills

| 工具 | 本轮等级 | 最适合 | 主要问题 |
| --- | --- | --- | --- |
| Matt Pocock Skills `1.1.0` | B | TDD、代码审查、诊断，按需安装少量 skills | 全量安装 40 个，Codex 初始只展示 17 个；耗时和 token 高于基线 |
| Waza `3.31.2` | C | 复杂 Bug 诊断、健康检查、研究与写作 | 实现题隐式触发 0/3，隐藏测试只通过 1/3；平均最慢 |
| Superpowers `6.1.1` | C | 有人参与的严格 TDD、调试和交付流程 | 12/12 都触发了方法论，但小任务容易流程过重；实现题出现一次超时 |
| Codex + 全局 `AGENTS.md` | A，参考组 | 小修复、一次性诊断、审查和有明确需求的规划 | 缺少团队专用流程，需要自己维护提示词和验证规则 |

这里的 A/B/C 按固定分数门槛换算。工程组总分分别是：参考组 `86.3`、Matt `73.3`、Waza `67.5`、Superpowers `67.1`。这个总分包含一项 140 秒限时规划题，四组都超时，因此不能把它读成通用能力排行榜。

### 端到端研发流程

| 工具 | 本轮等级 | 最适合 | 主要问题 |
| --- | --- | --- | --- |
| GitHub Spec Kit `0.12.16` | A | 需求重、验收标准明确、希望把 spec 纳入仓库的团队 | 三次规格质量都是 100，只有 1/3 在 240 秒内完整结束 |
| BMAD `6.10.0` | A | 规格需要持续演化、要保留决策日志和 companion 文档的大项目 | 规格均分 `93.3`，但输入 token 中位数约 `34.7` 万，2/3 超时 |
| GSD Standard `1.42.3` | D，仅限本题 | 长期项目、按阶段讨论和执行、允许多轮交互 | `$gsd-new-project --auto` 三次都在 240 秒内走到“准备写入”但没有落盘，不适合这类无人值守一次性规格任务 |
| ECC Full `2.0.0` | C，暂定 | 想从一个大集合里挑选少量能力做二次封装 | 261 个 skills 触发上下文压缩，hook 配置不兼容，5 个 MCP 每轮握手失败 |

GSD 的 D 只描述本次“棕地小仓库、无人回复、240 秒硬上限”任务。它的设计本来就是先初始化、讨论、建 roadmap，再逐阶段推进。这个结果能证明它不适合一次性自动出规格，不能证明完整交互式生命周期没有价值。

### 专项 Skills 与安装器

这组只完成固定版本安装和 Codex 发现校准，没有进入 63 次能力计分，因此等级是兼容性与适用性评级。

| 工具 | 评级 | 结论 |
| --- | --- | --- |
| Vercel Agent Skills | A，兼容性 | 9/9 都被 Codex 发现，适合 React、Vercel、Web 性能和设计规范；不应拿来替代通用 TDD 或调试流程 |
| Anthropic Skills | B，兼容性 | 18/18 都被发现，适合文档、PDF、表格、Web 测试等辅助工作；部分内容带 Claude API 假设，`claude-api` 描述已出现截断 |
| Vercel Skills CLI `1.5.17` | B，管理器 | 能把 GitHub 或本地 Skills 安装到 Codex，并生成 lock 文件；`add <source> --help` 会直接进入安装，CLI 帮助语义容易误操作 |
| Easy-ECC `0.1.0` | D，当前 Windows 网络 | dry-run 能正确规划 9 项 ECC `2.0.0` 组件，实际安装因裸 Node `fetch` 不使用当前代理而反复 `UND_ERR_CONNECT_TIMEOUT` |
| Microsoft Waza | A，评测方法 | baseline A/B、三次重复、负触发、对抗任务和 token 统计很实用；当前真实 executor 是 Copilot SDK，不能直接跑本次 Codex 基准 |

## Skill、Plugin 和全局提示词不是一回事

[OpenAI 的 Codex 文档](https://learn.chatgpt.com/docs/build-skills)把 Skill 定义为带 `SKILL.md` 的工作流目录，里面可以放脚本、参考资料和资产。Codex 启动时只读名称、描述和路径，决定使用后才加载完整说明。它支持显式 `$skill` 调用，也会根据 `description` 隐式选择。仓库级 Skills 放在 `.agents/skills`，用户级 Skills 放在 `$HOME/.agents/skills`。

Plugin 是分发容器，可以同时带 Skills、MCP、Apps、hooks 和展示资源。[OpenAI 的 Plugin 文档](https://learn.chatgpt.com/docs/build-plugins)要求 `.codex-plugin/plugin.json`，适合跨项目或团队安装。本地只用一套流程时，直接放 repo Skill 更简单。

`AGENTS.md` 是常驻指令。本次所有组都加载同一份[全局提示词](https://knowledge.webfrank.top/agents)，里面规定称呼、编码、Git 安全、测试、文章风格和仓库工作方式。基线已经包含 Codex 和这份全局工程约束，并非“裸模型”。第三方工具只有超过这个基线，才算净增益。

[Agent Skills 规范](https://agentskills.io/specification)要求 `SKILL.md` 至少包含 `name` 和 `description`，并建议通过 references 和 scripts 做渐进加载。Codex 又给初始 skills 清单加了一层硬预算，最多占上下文窗口的 2%，窗口未知时最多 8,000 个字符。Skills 太多时，Codex 先缩短描述，仍然放不下才省略条目。[官方文档](https://learn.chatgpt.com/docs/build-skills)也建议每个 Skill 只做一件事，并实测描述能否正确触发。

## 怎么测

环境固定为 Windows、Codex CLI `0.144.2`、`gpt-5.4`、`model_reasoning_effort = "high"`。每个计分任务使用新的 Git 工作副本和临时 `CODEX_HOME`，通过 `[[skills.config]]` 禁用本机原有的 42 个全局 Skills。仅设置 `CODEX_HOME` 和 `USERPROFILE` 不够，Codex 仍会扫描真实用户目录下的 `.agents/skills`。

动态任务在一次性目录里使用 `danger-full-access`，这样 Codex 能真的跑 `npm test`。诊断和评审任务再用 Git diff 检查它有没有违反只读约束。最初试过 Windows `workspace-write`，它会拦截 `npm test`，制造“Agent 没有验证”的假阴性，因此没有沿用。

工程组有四项任务，每项重复三次：只诊断金额分摊少 1 分的问题；以 TDD 实现 `Retry-After` 解析并接受隐藏测试；审查租户越权、缓存隔离和输入边界；在 140 秒内生成棕地实施计划。端到端组用同一份审计导出需求，显式调用各自推荐入口，在 240 秒内生成规格工件。所有结果都保留 JSONL 轨迹、工作树、耗时、token 和自动评分。

评分器本身也做了校准。第一版在 Windows 下用 Node 直接执行 `npm`，没有解析到 `npm.cmd`，导致可见测试被误判。修正后只重新计算已有轨迹和工作树，没有重跑模型。完整协议、固定版本和结果在仓库的 [`benchmarks/vibe-coding`](https://github.com/frank9306/my-knowledge/tree/main/benchmarks/vibe-coding)。

## 上下文和发现成本

下面是同一发现提示的输入 token。它不是价格估算，只用于观察初始上下文相对变化。

| 组别 | 安装/暴露数量 | Codex 实际可见 | 输入 token |
| --- | ---: | ---: | ---: |
| 基线 | 0 | 0 | 13,202 |
| Waza | 8 | 8 | 13,468 |
| Superpowers | 14 | 14 | 14,661 |
| Matt Skills | 40 | 17 | 14,758 |
| GSD Standard | 18 | 18 | 14,740 |
| Spec Kit | 10 | 10 | 14,225 |
| BMAD | 46 | 46 | 17,391 |
| Vercel Agent Skills | 9 | 9 | 14,215 |
| Anthropic Skills | 18 | 18 | 15,556 |
| ECC Full | 261 | 261，描述被压缩 | 19,696 |

Matt 的安装器复制了 40 个 Skills，但 Codex 初始列表只显示 17 个，没有给出省略警告。ECC 261 个条目仍可见，不过每次都明确报告描述被压缩。数量大不等于上下文免费，描述一旦被缩短，隐式触发需要的边界词也可能消失。

## 工程组数据

| 组别 | 诊断 | TDD 实现 | 代码审查 | 140 秒规划 | 总均分 | 按时通过 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Codex 基线 | 93.3 | 85 | 100 | 66.7 | 86.3 | 8/12 |
| Matt Skills | 93.3 | 100 | 100 | 0 | 73.3 | 9/12 |
| Waza | 100 | 70 | 100 | 0 | 67.5 | 7/12 |
| Superpowers | 93.3 | 75 | 100 | 0 | 67.1 | 8/12 |

诊断题里 Waza 是唯一三次都拿 100 的组，不过平均耗时 `105.4` 秒，基线是 `62.1` 秒。Matt 和 Superpowers 的结果与基线同为 `93.3`，输入 token 中位数约是基线的 1.9 倍和 2.0 倍。

TDD 实现题给出了最清楚的净增益。Matt 三次都通过隐藏测试，均分 100；基线有一次没有处理 `null` 输入，均分 85。Superpowers 两次完整通过，一次只写了测试便超时。Waza 前两次也漏掉 `null`，第三次通过，但写出了 125 行的手工 HTTP-date 解析器，明显超过这道小题需要的复杂度。轨迹里 Waza 的实现题没有出现 Skill 激活证据，说明它的 8 个 Skills 没有覆盖或没有触发这个场景。

代码审查四组都是 100，说明样例偏简单，只能证明它们能发现三个预置问题，不能拿来区分高级审查能力。

140 秒规划题反映的是限时自主交付。四组 12 次全部超时，基线有两次在超时前写出 100 分 `PLAN.md`，第三次尚未写入；三套 Skills 组都停在“准备写计划”。它们花时间读取工作流、模板和仓库约束，最终没有赶上落盘。这是流程开销的证据，不足以判断规划内容上限。

## 端到端规格组数据

| 组别 | 规格质量均分 | 质量达标 | 240 秒内结束 | 平均耗时 | 输入 token 中位数 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Codex 基线 | 100 | 3/3 | 3/3 | 182.8 秒 | 156,905 |
| Spec Kit | 100 | 3/3 | 1/3 | 234.9 秒 | 143,136 |
| BMAD | 93.3 | 3/3 | 1/3 | 240.8 秒 | 346,928 |
| GSD Standard | 5 | 0/3 | 0/3 | 241.1 秒 | 未完成，无完整 usage |

Spec Kit 三次都生成了 `spec.md`、需求质量清单和 feature 指针，结构直接，需求覆盖完整。两次虽然在 240 秒时仍没返回最终消息，但工件已经落盘并拿到 100 分。它适合把需求和验收条件变成仓库里可审查的文件。

BMAD 同样三次都有合格工件。它额外维护 append-only `.memlog.md`，再派生 `SPEC.md` 和 companion 文档，还做 coherence 与 preservation 两轮自检。这套结构适合规格会长期变化的项目，代价是 token 和时间。本题输入 token 中位数约为基线的 2.2 倍。

GSD 三次都完成了仓库和模板分析，也都明确说接下来写 `.planning/`，但 240 秒到期时工作树仍没有新工件。GSD Standard 暴露的 18 个 Skills 都能被 Codex 发现，安装兼容性没有问题。失败发生在流程长度，不是 Skill 路径失效。

## 每套工具适合什么场景

### Waza：小而聚焦，诊断最稳

Waza `3.31.2` 的 Codex Plugin 能直接从本地 marketplace 安装，实际暴露 `hunt`、`check`、`health`、`think`、`learn`、`read`、`write`、`ui` 八个 Skills。固定提交里有 30 个测试文件，工程维护证据比只放一批 Markdown 更完整。

复杂 Bug、项目健康检查和带来源的研究写作适合用 Waza。小型实现题未必触发对应 Skill，诊断和审查也会多花时间。建议显式调用目标 Skill，不要指望安装后每个开发任务都会自动变强。

### Matt Pocock Skills：挑着装，TDD 收益最明确

Matt 的工程 Skills 拆得细，`diagnosing-bugs`、`tdd`、`code-review`、`research`、`prototype` 各自边界清楚。本次 TDD 是所有工程组里唯一 3/3 隐藏测试通过的第三方方案。

仓库全量有 40 个 Skills，其中包含 deprecated、in-progress、个人效率和 Claude Code 专项内容。全装后 Codex 只在初始列表展示 17 个，固定提交也没有发现自动化测试文件。更合适的用法是只装当前会用的三到六个工程 Skills，并把版本锁进项目。

### Superpowers：方法论执行最积极，也最容易过重

Superpowers 的 14 个 Skills 覆盖 brainstorming、系统调试、TDD、计划、worktree、代码审查和交付。它在 12/12 工程任务里都有激活证据，触发可靠性最好。

强制流程会增加工具调用和上下文。小型规划三次都没在 140 秒内写出文件，TDD 有一次卡在 Red 阶段超时。它适合有人参与、愿意按阶段确认的中型功能，不适合几十秒内应完成的小修复。此次本地安装还遇到部分克隆快照缺对象，改用同版本无 `.git` 快照后成功。这是本次环境问题，不外推成上游仓库普遍故障。

### ECC 与 Easy-ECC：覆盖广，但 Full 不适合直接常驻

ECC `2.0.0` 的规模远大于其他候选。固定版本仓库有 3,149 个跟踪文件、261 个根 Skills 和 169 个测试文件，Codex Plugin 实际也暴露 261 个条目。Full 组做最小诊断三次均分 `86.7`，都按时完成，说明大量启动错误没有阻断基本任务。

兼容性问题每次都能复现：`hooks/hooks.json` 含 Codex 当前解析器不接受的 `$schema`；Skill 描述触发 2% 上下文预算压缩；退出时 5 个 MCP 握手失败。Full 适合当能力仓库，不适合整包常驻。先挑少量组件，能减少触发冲突和无效启动。

Easy-ECC 是 ECC 的安装器，不是能力包。Standard dry-run 会固定到 ECC `2.0.0` 并规划 9 个组件，设计方向合理。本机通过代理访问 GitHub，`curl` 同一 raw URL 约一秒返回 200，Easy-ECC 的裸 Node/undici `fetch` 却连续触发 10 秒连接超时。源码没有代理适配、重试和具体网络错误提示，当前版本不能评为可靠安装器。

### Spec Kit、BMAD 和 GSD：三种不同的流程取舍

Spec Kit 生成 10 个 Codex Skills，最适合把自然语言需求变成可审查的 spec、checklist、plan 和 tasks。它的工件质量稳定，结构比 BMAD 轻，缺点是完成报告偏慢。

BMAD 的 BMM 安装生成 46 个 Skills。`bmad-spec` 适合规格持续变化、需要稳定 capability ID、决策日志和 companion 文档的项目。小功能用它会显得重，团队没有打算消费这些工件时，额外结构只会增加成本。

GSD 提供 Core、Standard、Full 安装档位，稳定版实测分别可控制初始能力规模，Standard 生成 18 个 Skills，Full 生成 67 个。它更像长期项目操作系统，适合从 project、roadmap、phase 一路推进并支持暂停、恢复和验证。临时棕地需求只想快速出一份规格时，Spec Kit 更合适。

### Vercel 与 Anthropic Skills：作为专项补充

Vercel 的 9 个 Skills 全部被 Codex 发现，仓库固定提交有 115 个测试文件。React 组件设计、Vercel 优化、Web 设计规范和 React Native 是它的优势。通用后端项目无需安装整套。

Anthropic 的 18 个 Skills 也全部被发现，覆盖 docx、PDF、PPT、表格、前端设计、Web 测试和 MCP builder。它更像工件生产工具箱，其中 `claude-api` 等内容带明显产品假设。用于 Codex 时应逐个检查依赖和命令，避免把“能发现”误当成“完全兼容”。

## 推荐组合

日常 Codex 工程工作从全局 `AGENTS.md` 开始，再按任务补少量 Skills。Bug 多的项目可加 Waza `hunt` 或 Matt `diagnosing-bugs`；强调测试的项目加 Matt `tdd`；React 和 Next.js 项目再加 Vercel Agent Skills。这个组合比同时装四十到两百多个 Skills 更容易预测。

需求和验收工件是团队协作中心时选 Spec Kit。规格需要长期演化、多人和多个 Agent 都要消费同一份机器契约时选 BMAD。GSD 更适合把一个长期项目完整交给阶段化流程，不适合当作一次性命令。

ECC 可以作为能力来源，暂时不建议 Full 常驻。Easy-ECC 当前版本要先解决代理、重试和错误处理，再谈开箱安装。

## 局限

结论只覆盖 2026-07-16 的固定版本、Codex CLI `0.144.2`、`gpt-5.4 high` 和 Windows。模型有随机性，所以每项至少重复三次，但三次仍不是大样本。代码审查题区分度不足，限时规划题又偏重速度，文章已经分别标注。

端到端工具只测了一个决策完整的棕地规格任务，没有跑完数天或数周的真实项目生命周期。Vercel 和 Anthropic Skills 只做了安装发现校准，没有能力分。后续版本应保留历史结果，用新快照另跑，不能覆盖旧数据。

## 延伸阅读

- [OpenAI：Build skills](https://learn.chatgpt.com/docs/build-skills)
- [OpenAI：Build plugins](https://learn.chatgpt.com/docs/build-plugins)
- [Agent Skills Specification](https://agentskills.io/specification)
- [Microsoft Waza](https://github.com/microsoft/waza)
- [本次可复现实验目录](https://github.com/frank9306/my-knowledge/tree/main/benchmarks/vibe-coding)
