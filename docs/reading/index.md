---
title: 好文分享
description: 值得反复阅读的外部技术资源与核心观点索引。
---

# 好文分享

这里收录值得反复阅读的外部文章，并用简短说明记录推荐理由。

## Agent 工作流

- [Anthropic 免费 Claude AI 工程课程](https://x.com/huoshan007/status/2076944286231531664)
  一门约 4 小时的免费课程，集中讲解如何正确提示 Claude、哪些操作会削弱代码生成效果、Anthropic 内部如何使用 Claude，以及如何通过构建循环让 Agent 持续完成任务。原帖附有关键时间点，适合按主题快速观看。

- [Getting started with loops](https://x.com/ClaudeDevs/status/2074208949205881033)
  Claude Code 团队将 Agent 循环分为 turn-based、goal-based、time-based 和 proactive 四类，并从触发方式、停止条件、适用任务与 token 管理角度说明如何选择。核心是为循环设定可验证的完成标准和清晰边界，再用 skills、脚本与独立审查提升持续执行时的代码质量。

- [Everything Claude Code 中文指南](https://github.com/affaan-m/ECC/blob/main/README.zh-CN.md)
  一套经过实际项目迭代的 Agent 工程化配置合集，系统整理了 agents、skills、hooks、rules、MCP、验证循环、持续学习与安全审计等能力，并提供 Claude Code、Codex、Cursor、OpenCode 等工具的使用入口。适合作为搭建个人 Agent 工作流的参考目录，但应结合自身技术栈按需选用，避免重复安装或一次启用过多工具。

## Git 与代码阅读

- [The Git Commands I Run Before Reading Any Code](https://piechowski.io/post/git-commands-before-reading-code/)
  接手陌生代码库时，先通过代码 churn、维护者分布、Bug 修复、提交趋势和紧急回滚记录建立风险地图，再决定优先阅读哪些代码。Git 统计是定位线索，不是代码质量结论。
