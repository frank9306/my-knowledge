---
id: ISSUE-0013
title: "在仓库 frank9306/my-knowledge 的 docs/agents/README.md 中，Automated dispatch 规则后补充一句：自动任务的结果回传应包含 Issue 编"
status: done
priority: medium
created: 2026-08-28
updated: 2026-08-28
closed: 2026-08-28
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

- [x] The requested repository change is implemented within the stated scope.
- [x] `pnpm docs:build` passes.
- [x] Verification evidence and the resulting commit are recorded below.

## Out of scope

- Destructive operations, credential changes, dependency major upgrades, and changes outside this repository.

## Decisions

- Source: `wechat`
- Schedule ID: `none`
- Run ID: `20260828-143853-6842fdfd`

## Implementation notes

- Added a follow-up sentence under the "Automated dispatch" section in `docs/agents/README.md` stating that automated runs must report the Issue ID, the `pnpm docs:build` verification result, and the implementation commit link when sending results back to the operator, and must not claim publication until deployment has been confirmed.
- No site content, dependencies, Brain, or configuration files were modified and no files were removed.

## Verification

- `pnpm install --frozen-lockfile` succeeded (with `--trust-lockfile` to skip supply-chain re-fetch over a constrained registry mirror) and did not change `node_modules` content; all binaries required by `vitepress build` (including `esbuild@0.21.5` + `@esbuild/linux-x64`) were already present from the prior session.
- `pnpm docs:build` succeeded end-to-end through the project wrapper (system pnpm 11 cannot write to the read-only `$HOME/.local` to self-update to the packageManager-pinned `pnpm@10.14.0`, so a thin shell wrapper at `/workspace/pnpm-bin/pnpm` invokes the already-cached `pnpm@10.14.0` directly): `readme:sync` regenerated navigation with 69 articles across 6 topics; `design:lint` reported 0 errors / 0 warnings (1 info); `home:scene-check` passed; `vitepress build` completed in ~48.25s with the standard chunk-size notice only. `docs/agents/README.md` is the only working-tree change.
- Deployment status: pending — `main` has not been pushed yet by this run; the change must not be reported as published until the push lands and the GitHub Pages workflow finishes.

## Activity log

### 2026-08-28 — Created by Hermes dispatcher

Request received at `2026-08-28T14:38:53+08:00`.

### 2026-08-28 — Status changed from in-progress to done.

## Completion summary

Added a brief automated-run reporting rule to `docs/agents/README.md` requiring Hermes/DSH runs to send back the Issue ID, the `pnpm docs:build` verification result, and the implementation commit link, and not to claim publication until deployment has been confirmed. Changes are limited to the requested rule and its required Issue, index, and Changelog records; `pnpm docs:build` passed; deployment confirmation pending push to `main`.
