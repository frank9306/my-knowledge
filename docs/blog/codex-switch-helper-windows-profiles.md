---
title: "Codex Switch Helper：在 Windows 上切换多套 Codex Profile"
date: 2026-07-13
---

# Codex Switch Helper：在 Windows 上切换多套 Codex Profile

在同一台 Windows 电脑上使用多个 Codex 账号或 API Provider，麻烦往往不在登录本身，而在登录状态、模型配置和本地数据都挤在同一个 `~/.codex` 目录里。手动切换时，需要反复替换 `auth.json`、修改 `config.toml`、设置 `OPENAI_API_KEY`，还要防止上一次的认证信息残留。

[Codex Switch Helper](https://github.com/frank9306/codex-switch-helper) 把这套操作做成了 Windows 桌面应用。每套账号和配置保存为一个 Profile，点击启动时，应用写入对应的环境变量和配置，再通过 Windows 的 `shell:AppsFolder` 启动 Codex App。项目使用 React、TypeScript 和 Tauri 2 开发，当前公开版本为 `v0.1.5`。

![Codex Switch Helper 界面](https://raw.githubusercontent.com/frank9306/codex-switch-helper/main/docs/screenshot.png)

## 它解决了哪些切换问题

Codex 的身份和运行状态分散在几个位置：

- `auth.json` 保存账号登录信息；
- `config.toml` 保存模型、Provider 和 `base_url` 等配置；
- `OPENAI_API_KEY` 决定 API Key 登录使用的密钥；
- `CODEX_HOME` 决定 Codex 从哪个目录读取 sessions、缓存、工具和配置。

Codex Switch Helper 为这些数据增加了一层 Profile 管理。账号登录 Profile 会保存并写回 `auth.json`，启动前清除用户级 `OPENAI_API_KEY`；API Key Profile 会写入自己的 `OPENAI_API_KEY`，同时删除目标 Home 中可能残留的 `auth.json`，避免界面继续显示上一个账号。

对于兼容 OpenAI API 的第三方服务，应用还可以按 `base_url` 和模型名生成对应的 `config.toml`。当前界面内置 OpenAI、MiniMax、DeepSeek 和自定义 Provider 入口，生成的配置使用 Codex Responses 协议。这里的前提是上游服务确实兼容对应接口，工具本身不会完成协议转换。

## 共享环境和沙盒模式怎么选

项目从 `v0.1.3` 开始提供两种环境模式。两者都会设置用户级 `CODEX_HOME`，区别在于多个 Profile 是否共用其余本地状态。

| 模式 | Home 数据 | 切换内容 | 适合场景 |
| --- | --- | --- | --- |
| 共享环境 | 多个 Profile 共用一个 Home | `auth.json`、`config.toml` 和 `OPENAI_API_KEY` | 希望账号分开，但 sessions、缓存和工具继续共用 |
| 沙盒模式 | 每个 Profile 有独立的托管 Home | 整套 Home 与登录环境 | 账号、会话、缓存、工具和配置都需要隔离 |

共享环境的切换速度更直接，也不会复制整套 Codex Home。应用在启动时把 Profile 保存的认证和配置写回共享目录，因此同一份 sessions、缓存和工具仍然可用。它适合个人账号、工作账号或不同 API Provider 共用本地工作资料的情况。

沙盒模式会在创建 Profile 时，把选中的源 Codex Home 复制到应用数据目录下的 `profiles/<profileId>/home`。以后启动该 Profile，`CODEX_HOME` 会指向这份副本。删除 Profile 时，应用只删除自己管理的副本，不会动原始导入目录。隔离更完整，代价是每个 Profile 都保存一套 Home 数据，占用空间也会更多。

## 从安装到启动

项目目前只面向 Windows，安装包发布在 [GitHub Releases](https://github.com/frank9306/codex-switch-helper/releases)。`v0.1.5` 提供 EXE 和 MSI 两种 x64 安装包，并通过 Tauri updater 发布签名文件与 `latest.json`。应用启动时会检查更新，也可以在“关于”页面手动检查。

安装后的基本流程不长：

1. 新建 Profile，填写名称并选择共享环境或沙盒模式。
2. 账号登录模式导入 `auth.json`；API Key 模式填写 Key，并按需设置 Provider、`base_url` 和模型。
3. 在保存前运行连通测试。账号模式会检查 `auth.json` 能否读取并解析，API Key 模式会请求对应的 `/models` 接口。
4. 点击启动并确认环境变量变更。应用写入 Profile 数据，然后启动 Windows Codex App。

应用默认使用 `OpenAI.Codex_2p2nqsd0c76g0!App`，同时会优先自动检测 `OpenAI.Codex_*`。如果安装渠道或应用标识不同，可以在高级设置里手动修改 AppID。

## 代理和默认环境恢复

设置页支持 HTTP 和 SOCKS5 代理。启用后，应用会立即让自身网络请求使用该代理；启动 Codex 时，还会把 `HTTP_PROXY`、`HTTPS_PROXY` 和 `ALL_PROXY` 写入当前用户的环境变量。关闭代理后再启动 Codex，应用会清理由它管理的这三个变量。

这里需要留意作用范围：这些都是用户级环境变量，不只属于某一个 Codex 进程。应用对启动 Profile、修改代理和恢复默认 Home 都设置了确认弹窗，删除 Profile 还要求输入 Profile 名称，但确认前仍应看清将被修改的变量。

如果不想切换 Profile，可以使用“默认启动 Codex”。这个入口不会修改 `CODEX_HOME` 或 `OPENAI_API_KEY`，只会同步当前代理设置并启动应用。“恢复默认 Home”则会删除用户级 `CODEX_HOME`，之后手动启动 Codex 会回到默认目录，通常是当前用户下的 `.codex`。该操作不会删除任何 Profile 文件。

## 使用前要知道的边界

Codex Switch Helper 的实现很直接，也意味着边界比较清楚。

- 目前只支持 Windows Codex App，不是跨平台的 Codex CLI 账号管理器。
- API Key、`auth.json` 和保存的配置会写入本地 `data.json`，当前没有加密。不要在多人共用或不受信任的 Windows 账户中保存敏感凭据。
- 切换会修改用户级环境变量。已经运行的程序通常不会自动继承新值，Profile 切换应以工具随后启动的 Codex App 为准。
- 第三方 Provider 需要兼容 Codex 使用的 Responses 协议。仅支持 Chat Completions 的接口不能直接接入。
- 沙盒模式复制完整目录，Profile 较多或 Home 较大时，需要留意磁盘占用。

如果使用场景只是偶尔切换一次 API Key，手动改环境变量可能已经够用。需要长期维护多个账号、模型配置和代理环境时，Profile 把容易遗漏的几步收拢到了一个可检查的启动流程里，共享与隔离也不必依靠手工复制目录完成。

## 参考资料

- [项目仓库与中文 README](https://github.com/frank9306/codex-switch-helper/blob/main/README.zh-CN.md)
- [版本记录](https://github.com/frank9306/codex-switch-helper/blob/main/CHANGELOG.md)
- [Windows 安装包与更新文件](https://github.com/frank9306/codex-switch-helper/releases)
- [Tauri 配置](https://github.com/frank9306/codex-switch-helper/blob/main/src-tauri/tauri.conf.json)
- [Windows 后端实现](https://github.com/frank9306/codex-switch-helper/blob/main/src-tauri/src/main.rs)
