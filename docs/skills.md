---
title: 我的 Agent Skills
description: 我全局安装的 Agent Skills、用途、来源与安装方式。
---

# 我的 Agent Skills

这是我当前全局安装的公开 Agent Skills。清单来自本机 `~/.agents/.skill-lock.json`，最后同步于 2026-07-13。

## 如何安装

这些 Skills 使用 [Vercel Labs skills CLI](https://github.com/vercel-labs/skills) 管理。安装单个 Skill：

```bash
npx skills add <owner/repo> --skill <skill-name> -g
```

其中 `-g` 表示安装到用户级目录。可以用下面的命令查看或更新全局 Skills：

```bash
npx skills ls -g
npx skills update -g
```

## Waza

项目地址：[tw93/Waza](https://github.com/tw93/Waza)

安装示例：

```bash
npx skills add tw93/Waza --skill check --skill design --skill health --skill hunt --skill learn --skill read --skill think --skill write -g
```

| Skill | 用途 |
| --- | --- |
| `check` | 代码审查、提交、推送与发布前检查 |
| `design` | 页面、组件和视觉界面的设计与打磨 |
| `health` | Agent 配置、验证链路和代码库可维护性体检 |
| `hunt` | 从复现开始定位错误、回归和崩溃的根因 |
| `learn` | 多来源深度研究并整理为可发布内容 |
| `read` | 读取网页与 PDF，提取或转换内容 |
| `think` | 把粗略想法收敛为可执行、决策完整的方案 |
| `write` | 中英文改写、润色和去除模板化表达 |

## Skills for Real Engineers

项目地址：[mattpocock/skills](https://github.com/mattpocock/skills)

交互式安装：

```bash
npx skills add mattpocock/skills -g
```

当前使用的 Skills：

| 类别 | Skills |
| --- | --- |
| 工程 | `diagnose`、`grill-with-docs`、`improve-codebase-architecture`、`prototype`、`setup-matt-pocock-skills`、`tdd`、`to-issues`、`to-prd`、`triage`、`zoom-out` |
| 生产力 | `caveman`、`grill-me`、`handoff`、`write-a-skill` |
| Review 与建模 | `review`、`request-refactor-plan`、`ubiquitous-language`、`qa` |
| 写作与教学 | `edit-article`、`teach`、`writing-beats`、`writing-fragments`、`writing-shape` |
| 工具 | `design-an-interface`、`git-guardrails-claude-code`、`migrate-to-shoehorn`、`obsidian-vault`、`scaffold-exercises`、`setup-pre-commit` |

其中部分 Skill 位于项目的 `deprecated` 或 `in-progress` 目录，适合参考和试验，不代表稳定 API。

## 其他公开 Skills

| Skill | 用途 | 项目 | 安装命令 |
| --- | --- | --- | --- |
| `kill-ai-slop` | 扫描并清理网页中的模板化视觉与文案痕迹 | [yetone/kill-ai-slop](https://github.com/yetone/kill-ai-slop) | `npx skills add yetone/kill-ai-slop --skill kill-ai-slop -g` |
| `find-skills` | 搜索和安装 Agent Skills | [vercel-labs/skills](https://github.com/vercel-labs/skills) | `npx skills add vercel-labs/skills --skill find-skills -g` |
| `skill-creator` | 创建或更新 Agent Skills | [openclaw/openclaw](https://github.com/openclaw/openclaw) | `npx skills add openclaw/openclaw --skill skill-creator -g` |
| `clawra-selfie` | 生成并发送 Clawra 自拍图 | [sumelabs/clawra](https://github.com/sumelabs/clawra) | `npx skills add sumelabs/clawra --skill clawra-selfie -g` |
| `edge-tts` | 使用 Edge TTS 生成语音 | [aahl/skills](https://github.com/aahl/skills) | `npx skills add aahl/skills --skill edge-tts -g` |
| `ocr-document-processor` | 对图片和扫描 PDF 执行 OCR | [dkyazzentwatwa/chatgpt-skills](https://github.com/dkyazzentwatwa/chatgpt-skills) | `npx skills add dkyazzentwatwa/chatgpt-skills --skill ocr-document-processor -g` |
| `golang-pro` | Go 并发、微服务、性能优化与测试 | [jeffallan/claude-skills](https://github.com/jeffallan/claude-skills) | `npx skills add jeffallan/claude-skills --skill golang-pro -g` |
| `github-trending` | 获取 GitHub Trending 项目和开发者 | [hoodini/ai-agents-skills](https://github.com/hoodini/ai-agents-skills) | `npx skills add hoodini/ai-agents-skills --skill github-trending -g` |
| `hackernews` | 读取 Hacker News 文章与评论 | [vm0-ai/vm0-skills](https://github.com/vm0-ai/vm0-skills) | `npx skills add vm0-ai/vm0-skills --skill hackernews -g` |
| `product-hunt-launch` | 优化 Product Hunt 发布素材和节奏 | [inferen-sh/skills](https://github.com/inferen-sh/skills) | `npx skills add inferen-sh/skills --skill product-hunt-launch -g` |

## 我维护的 Skill

### learning-project-coach

把任意领域变成可持续推进的 30 天项目制学习仓库，覆盖学习路线、每日任务、作业检查、阶段测试、薄弱点诊断和最终 Demo。

- 项目地址：[frank9306/learning-project-coach-skill](https://github.com/frank9306/learning-project-coach-skill)
- 安装命令：`npx skills add frank9306/learning-project-coach-skill --skill learning-project-coach -g`

## 未公开项

本机还有少量业务专用或测试用 Skill。它们没有公开仓库，或包含不适合发布的业务上下文，因此不在这里展示内部说明和安装方式。
