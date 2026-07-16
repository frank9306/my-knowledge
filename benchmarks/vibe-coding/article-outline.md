# 权威文章大纲

## 结论先行

- 不设跨类别总冠军。
- 分别给出工程 Skills、端到端流程、专项能力、安装管理四张结论表。
- 来源：全部动态结果、`matrix.json`、各项目固定版本。

## 到底在测什么

- 区分 `AGENTS.md`、Skill、Plugin、Hook、MCP 与完整研发方法论。
- 解释为什么“安装数量”不等于“有效能力”。
- 来源：Codex Manual 的 Customization、Build skills、Build plugins；<https://agentskills.io>。

## 候选对象与分组

- Waza、Matt Skills、Superpowers。
- ECC、GSD、Spec Kit、BMAD。
- Vercel Agent Skills、Anthropic Skills。
- Easy-ECC、Skills CLI。
- 来源：每个项目 README、manifest、安装器生成物。

## 测评方法

- 固定 Codex、模型、全局提示词与任务快照。
- 解释全局 Skill 污染、隐式与显式触发、重复次数和隐藏验证器。
- 解释评分维度和评级门槛。
- 来源：Codex Manual 的 Skills progressive disclosure；Microsoft Waza 的 baseline、skill invocation、adversarial 与 token 设计；本目录 `README.md`。

## 安装、上下文与触发成本

- 各项目安装路径、Skill 数、初始 token、触发成功率与卸载能力。
- 对比 GSD profiles、ECC Full 与 Easy-ECC 分级安装。
- 来源：实际安装日志、Codex JSONL usage、各安装器源码。

## 工程 Skills 实测

- 诊断、TDD、代码审查、计划、研究写作。
- 每项展示任务结果、流程轨迹、token、耗时和重复波动。
- 来源：动态运行结果与隐藏验证器。

## 端到端流程实测

- 同一棕地功能从规格到交付。
- 对比控制权、工件质量、流程负担和中途恢复能力。
- 来源：动态运行结果与生成工件。

## 专项能力实测

- React/UI、Web 测试、文档工件等独立旁榜。
- 说明专项榜不能换算为通用工程总分。
- 来源：Vercel、Anthropic 固定版本 Skills 与动态结果。

## 每个工具的优点、缺点与适用场景

- 每项包含：一句定位、最好场景、避免场景、关键优点、关键缺点、评级和证据。
- 明确保留冲突：Matt 强调组合与控制，GSD/BMAD/Spec Kit 强调流程接管，Superpowers 强调强制方法论，ECC 强调广覆盖。

## 按场景选择

- 小修复、复杂 Bug、棕地功能、从零项目、团队治理、React/UI、研究写作。
- 输出最小可用组合，不建议一次安装全部工具。

## 常见误区

- 用 Star 数代替能力。
- 把 Skill 数量当作上下文免费。
- 在污染的全局环境里做 A/B。
- 只测显式调用，不测自然触发。
- 只看最终答案，不看工作树、命令轨迹与隐藏测试。
- 一次运行就给正式评级。

## 如何复现

- 版本矩阵、命令、任务、验证器和结果目录。
- 说明 Windows、代理、模型可用性和随机性的限制。

## 局限与后续更新

- 结论只覆盖指定 Codex 版本和模型。
- 工具升级后保留旧结果，新版本单独跑，不覆盖历史。

## Further Reading

- 最佳起点：Codex Manual 的 Customization 与 Skills。
- <https://agentskills.io>
- <https://github.com/microsoft/waza>
- <https://github.com/tw93/Waza>
- <https://github.com/mattpocock/skills>
