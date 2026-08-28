---
id: ISSUE-0013
title: "在仓库 frank9306/my-knowledge 的 docs/agents/README.md 中，Automated dispatch 规则后补充一句：自动任务的结果回传应包含 Issue 编"
status: in-progress
priority: medium
created: 2026-08-28
updated: 2026-08-28
closed:
sources: ["wechat"]
related_adrs: []
depends_on: []
---

# ISSUE-0013: 在仓库 frank9306/my-knowledge 的 docs/agents/README.md 中，Automated dispatch 规则后补充一句：自动任务的结果回传应包含 Issue 编

## Problem

Hermes received the following owner request and dispatched it as run `20260828-143853-6842fdfd`:

> 在仓库 frank9306/my-knowledge 的 docs/agents/README.md 中，Automated dispatch 规则后补充一句：自动任务的结果回传应包含 Issue 编号、验证结果和提交链接；只有确认部署成功后，才能报告已发布。
> 
> 约束：
> - 仅修改 docs/agents/README.md 这一个工程文档；不修改站点正文、package.json 依赖、Brain 模块或任何配置文件。
> - 不删除任何文件，不重命名文件，不改换路径。
> - 创建并维护本地 Issue，按仓库既有的验收与 Changelog 流程记录本次变更。
> - 运行 pnpm docs:build，必须通过；通过后再提交并推送到 main。
> - 完成后在当前微信会话回传：Issue 编号、pnpm docs:build 验证结果、提交链接、部署状态。
> - 失败时回传运行编号与原因，不自动重试。

## Desired outcome

Implement the owner's request in this repository while preserving project instructions and existing behavior outside the requested scope.

## Acceptance criteria

- [ ] The requested repository change is implemented within the stated scope.
- [ ] `pnpm docs:build` passes.
- [ ] Verification evidence and the resulting commit are recorded below.

## Out of scope

- Destructive operations, credential changes, dependency major upgrades, and changes outside this repository.

## Decisions

- Source: `wechat`
- Schedule ID: `none`
- Run ID: `20260828-143853-6842fdfd`

## Implementation notes

No implementation has started.

## Verification

Not verified.

## Activity log

### 2026-08-28 — Created by Hermes dispatcher

Request received at `2026-08-28T14:38:53+08:00`.

## Completion summary

Not completed.
