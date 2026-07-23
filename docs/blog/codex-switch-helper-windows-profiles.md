---
title: "Codex Switch Helper：在 Windows 上隔离并同时运行多个 Codex Profile"
date: 2026-07-23
---

# Codex Switch Helper：在 Windows 上隔离并同时运行多个 Codex Profile

在同一台 Windows 电脑上使用多个 Codex 账号或 API Provider，真正容易出问题的不是“换一个 Key”，而是几类状态会互相影响：`auth.json` 保存登录凭据，`config.toml` 保存模型与 Provider 配置，`CODEX_HOME` 决定 Codex 从哪里读取会话、Skills 和配置，而 Codex 桌面应用自身还维护一套 Chromium 应用数据。

[Codex Switch Helper](https://github.com/frank9306/codex-switch-helper) 把这些状态组织成独立 Profile。到 `v0.2.7`，它已经不只是切换环境变量：每个 Profile 都有独立的托管 Codex Home 和应用数据目录，可以同时启动多个互不占用登录状态的 Codex 桌面实例；全局 `AGENTS.md` 和 Skills 则可以跨 Profile 共享。

![Codex Switch Helper 界面](https://raw.githubusercontent.com/frank9306/codex-switch-helper/main/docs/screenshot.png)

## 从“切换配置”变成“隔离实例”

早期版本提供共享环境和沙盒模式，需要在“复用本地数据”与“完整隔离”之间选择。`v0.2.0` 之后，所有 Profile 都迁移到工具管理的独立目录，旧共享 Profile 会复制到新的托管 Home，原目录不会被删除。

现在，一个 Profile 主要隔离四类状态：

| 状态 | 隔离方式 | 作用 |
| --- | --- | --- |
| Codex Home | `app_data/profiles/<profileId>/home` | 分开保存认证、配置、会话和缓存 |
| 桌面应用数据 | 每个 Profile 独立的 `--user-data-dir` | 分开保存 Codex App 的 Chromium 状态 |
| 登录凭据 | 只写入 Profile Home 或传给对应进程 | 避免账号登录与 API Key 相互污染 |
| 代理变量 | 通过进程环境传给新实例 | 不再依赖用户级代理变量完成 Profile 启动 |

启动 Profile 时，工具会找到 Codex 安装包声明的桌面入口，为新进程设置独立的 `CODEX_HOME` 和 `--user-data-dir`，再传入该 Profile 的认证与代理环境。不同 Profile 因此可以并行运行，界面也会记录已启动实例，并提供停止实例的操作。

这和单纯修改用户级 `CODEX_HOME` 有本质区别：后者只影响之后启动的进程，而且桌面应用数据仍可能共用；独立 Home 与独立 `--user-data-dir` 同时存在，才把 Codex 配置和桌面登录状态分开。

## 两种登录方式

### 账号登录 Profile

创建账号 Profile 时，导入已有 `auth.json` 已经变成可选操作。留空后直接启动该 Profile，就可以在对应的 Codex 窗口内完成登录。工具会让托管 Home 使用文件凭据存储，登录结果只留在这个 Profile 中。

如果默认 `~/.codex` 已经登录，新建 Profile 也不会自动继承其凭据，除非用户明确选择一个 `auth.json`。这样可以避免复制默认 Home 时把个人账号意外带进工作 Profile。

### API Key Profile

API Key Profile 会把 `OPENAI_API_KEY` 只传给对应 Codex 进程，并删除托管 Home 中可能残留的 `auth.json`。工具仍提供 OpenAI、MiniMax、DeepSeek 和自定义 Provider 入口；对第三方服务，它会生成使用 `wire_api = "responses"` 的 Codex Provider 配置。

第三方接口必须兼容 Codex 使用的 Responses API。工具负责生成配置和传递密钥，不负责把 Chat Completions 协议转换成 Responses 协议。连通测试会请求相应的 `/models` 地址，因此“测试通过”只能证明密钥与该端点可访问，不能保证上游完整支持 Codex 的所有请求和工具调用。

## 共享规则和 Skills，但不共享登录状态

完全隔离解决了账号冲突，也带来一个新问题：如果每个 Profile 都复制一份通用规则和 Skills，后续维护会迅速失去同步。

当前版本把全局规则放在 `~/.agents/AGENTS.md`，再通过文件链接接入每个托管 Profile Home。应用可以直接查看、编辑和刷新这份文件，并会在 Profile 创建、迁移和启动时检查链接、尝试修复。这样，各 Profile 使用同一份全局指令，但认证、会话和 `config.toml` 仍然独立。

Skills 页面会同时发现两个位置：

- `~/.agents/skills`：全局共享 Skills；
- `~/.codex/skills`：默认 Home 中已有的 Skills。

界面支持按名称搜索、按来源分组，并把 `~/.codex/skills` 中缺失的项目导入共享目录。导入采用非覆盖策略：共享目录里已有同名 Skill 时不会被替换。

`v0.2.7` 同时移除了早前加入的用量统计、SQLite 用量库和 Profile 皮肤功能。当前产品重新聚焦于 Profile 隔离、共享规则与 Skills，以及 Codex 实例管理。

## 代理、托盘和更新

设置页支持 HTTP 与 SOCKS5 代理。Profile 启动时，代理通过 `HTTP_PROXY`、`HTTPS_PROXY` 和 `ALL_PROXY` 传给对应进程；`127.0.0.1`、`localhost` 和 `::1` 会加入 `NO_PROXY`，已有的绕过项会保留。新版本还会清理由旧版本写入用户环境的代理变量，减少升级后遗留状态。

需要区分两个启动入口：

- **用 Profile 启动**：使用独立 Home、独立应用数据、Profile 凭据和当前代理；
- **默认启动 Codex**：不修改 `CODEX_HOME` 或 `OPENAI_API_KEY`，按普通 Codex 环境启动，但会同步工具当前的代理设置。

“恢复默认 Home”会删除用户级 `CODEX_HOME`，让以后手动启动的 Codex 回到默认目录，通常是当前用户的 `.codex`；它不会删除任何 Profile 文件。

应用还提供 Windows 系统托盘、登录 Windows 后自动启动、Light/Dark 主题和耗时操作进度提示。关闭主窗口后，程序会继续驻留托盘，可从托盘重新打开或退出。更新由 Tauri updater 从 GitHub Releases 获取签名产物；发现新版本时，界面会显示当前版本、目标版本、发布日期和版本说明。

## 从安装到第一次并行启动

安装包发布在 [GitHub Releases](https://github.com/frank9306/codex-switch-helper/releases)。截至 2026 年 7 月 23 日，最新公开版本为 `v0.2.7`。

基本使用流程如下：

1. 新建 Profile，选择账号登录或 API Key 登录。
2. 账号登录可选择导入 `auth.json`，也可以留空后在独立 Codex 窗口中登录；API Key 登录则填写 Key、Provider、Base URL 和模型。
3. 保存后运行 Profile 检查或连通测试，确认 Home、认证文件或 API 端点状态。
4. 点击启动。工具会准备独立 Home 和应用数据目录，再启动 Codex。
5. 创建第二个 Profile 并启动，两个 Codex 实例可以同时运行；需要结束时从实例列表停止对应进程。

工具默认识别 `OpenAI.Codex_2p2nqsd0c76g0!App`，也会从 Windows 已安装应用中优先检测 `OpenAI.Codex_*`。如果安装渠道导致 AppID 不同，可以在高级设置中手动修改。

## 使用前要知道的边界

- 项目目前面向 Windows Codex App，不是跨平台的 Codex CLI Profile 管理器。
- API Key 以及保存的 auth/config 数据仍以明文保存在本地 JSON 中，暂未加密。不要在不可信或多人共用的 Windows 账户中保存敏感凭据。
- 每个 Profile 会保存一套 Codex Home 和桌面应用数据。Profile 越多，占用的磁盘空间越大。
- 删除 Profile 会删除工具管理的 Profile 记录和 Home 目录，界面要求输入 Profile 名称确认；原始导入目录和默认 `~/.codex` 不在删除范围内。
- `config.toml` 允许用户在 Profile Home 中继续修改。当前版本会保留这些改动，包括手动添加的 MCP Server，不再在每次启动时用旧快照覆盖。
- 代理和凭据只影响之后由工具启动的实例，已经运行的 Codex 进程不会自动切换到另一个 Profile。

如果只是临时换一次 API Key，手动设置环境变量仍然更轻量。需要长期维护多个账号、第三方 Provider 和并行 Codex 窗口时，Codex Switch Helper 的价值在于把登录状态、Home 和桌面应用数据一起隔离，同时让通用的 `AGENTS.md` 与 Skills 保持共享。

## 资料与核对范围

本文按 `v0.2.7` 的 README、CHANGELOG、Tauri 配置和 Windows 后端实现核对，版本与功能状态截至 2026 年 7 月 23 日。上游 Codex App 的行为和第三方 Provider 兼容性可能随版本变化，实际接入时仍应以当前 Codex 与服务商文档为准。

- [项目仓库与中文 README](https://github.com/frank9306/codex-switch-helper/blob/main/README.zh-CN.md)
- [版本记录](https://github.com/frank9306/codex-switch-helper/blob/main/CHANGELOG.md)
- [Windows 安装包与更新文件](https://github.com/frank9306/codex-switch-helper/releases)
- [Tauri 配置](https://github.com/frank9306/codex-switch-helper/blob/main/src-tauri/tauri.conf.json)
- [Windows 后端实现](https://github.com/frank9306/codex-switch-helper/blob/main/src-tauri/src/main.rs)
