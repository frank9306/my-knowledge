# 资源导航

收录长期会反复使用的工具、资料和服务。

## 长期使用推荐

下面这些资源经过长期关注或实际使用，适合优先了解。推荐不代表没有缺点，使用前仍应结合自己的平台、网络环境和工作方式判断。

### [DESIGN.md](https://github.com/google-labs-code/design.md)

- **适合：** 希望让 AI 编程 Agent 稳定理解并遵守项目视觉规范的团队。
- **推荐理由：** 用结构化设计 token 和 Markdown 说明保存视觉决策，并提供 lint、diff 与格式导出能力，比只靠提示词描述设计风格更容易长期维护。
- **使用提醒：** 规范仍在持续演进，升级版本前应检查格式和 CLI 行为变化。

### [ProxyBridge](https://github.com/InterceptSuite/ProxyBridge)

- **适合：** 需要在 Windows、macOS 或 Linux 上按进程转发 TCP、UDP 流量的用户。
- **推荐理由：** 可以把应用流量转发到 HTTP 或 SOCKS5 代理，是 Proxifier 的开源替代方案。
- **使用提醒：** 网络转发涉及系统权限和路由规则，首次使用应先用非关键应用验证配置。

### [GitHub Daily Rank](https://github.com/OpenGithubs/github-daily-rank)

- **适合：** 想快速发现近期热门开源项目，又不想持续刷 GitHub Trending 的开发者。
- **推荐理由：** 每天整理 GitHub 开源项目飙升榜 Top 10，信息密度高，适合作为固定的信息入口。
- **使用提醒：** 热度不等于质量或长期维护能力，采用项目前仍需检查许可证、提交活跃度和 issue 状态。

### [科技爱好者周刊](https://github.com/ruanyf/weekly)

- **适合：** 希望长期跟踪技术、工具、产品与互联网趋势的读者。
- **推荐理由：** 持续按周整理值得阅读的技术内容，选题范围广，适合定期浏览和回查。
- **使用提醒：** 内容覆盖面较广，建议把它作为发现入口，再阅读原始资料形成判断。

### [次元.vip](https://次元.vip/auth/register?code=mE1o)

- **适合：** 需要多协议、多节点代理服务的用户。
- **推荐理由：** 提供跨境网络节点，可作为日常网络工具的备选服务。
- **使用提醒：** 这是带邀请码的注册链接；线路质量可能随地区和时间变化，建议先短期测试，不要一次购买过长周期。

### [Waza](https://github.com/tw93/Waza)

- **适合：** 希望把成熟工程习惯沉淀为 Claude、Codex 等编程 Agent 可执行技能的开发者。
- **推荐理由：** 将调试、评审、规划和工程治理等经验封装成可复用技能，适合参考 Agent 工作流如何从提示词走向稳定流程。
- **使用提醒：** 不要一次启用全部技能，应按项目需要选择，并检查其中的规则是否与现有工程约定冲突。

### [Codex Switch Helper](https://github.com/frank9306/codex-switch-helper)

- **适合：** 需要在 Windows 上管理多个 Codex App 账号、API Key、Provider 和并行实例的用户。
- **推荐理由：** 每个 Profile 隔离 Home、登录状态和桌面应用数据，同时共享 `AGENTS.md`、Skills 与第三方 Plugins，减少手工替换配置文件带来的操作成本。
- **使用提醒：** 配置中可能包含敏感凭据，导入、备份或分享前应检查并妥善保护。

### [QuickNav](https://github.com/frank9306/quick-nav-extension)

- **适合：** 希望用个人导航站替换浏览器默认新标签页的用户。
- **推荐理由：** 把常用网站、搜索和每日备忘集中到新标签页，并支持导航项管理与快捷添加，适合高频使用。
- **使用提醒：** 浏览器扩展升级前应关注权限变化，并定期备份个人导航数据。

## AI Agent 开源项目

- [OfficeCLI](https://github.com/iOfficeAI/OfficeCLI/blob/main/README_zh.md): 面向 AI Agent 的开源 Office 命令行工具，可跨平台创建、读取、修改和验证 Word、Excel、PowerPoint 文档，提供结构化 JSON、无头 HTML/PNG 渲染、实时预览与 MCP 集成，无需安装 Microsoft Office。
- [DeepTutor](https://deeptutor.info/zh-cn/): Agent-native 的开源个性化学习伴侣，将对话、知识库、可审计记忆、协同写作、交互式书本与学习空间整合到本地工作区，并可连接 Claude Code、Codex 等编程 Agent。
- [Agent-Reach](https://github.com/Panniantong/Agent-Reach): 给 AI Agent 一键装上互联网能力，统一接入 Twitter、Reddit、YouTube、GitHub、B 站、小红书等平台，免 API 费。
- [ponytail](https://github.com/DietrichGebert/ponytail): 让 AI Agent 像资深工程师一样“先看再写”，显著减少冗余代码与 token 消耗。
- [headroom](https://github.com/headroomlabs-ai/headroom): 在 LLM 之前压缩工具输出、日志、RAG 片段，token 用量减少 60–95%，可作库、代理或 MCP 服务运行。
- [OpenMontage](https://github.com/calesthio/OpenMontage): 首个开源 Agentic 视频生产系统，12 条流水线、52 个工具，让 AI 编程助手变成完整视频制作工作室。
- [DESIGN.md](https://github.com/google-labs-code/design.md) ⭐ 长期推荐：Google Labs 推出的视觉设计系统声明格式（YAML token + Markdown 说明），给编程 Agent 一份持久可读的设计源；自带 lint / diff / 导出 Tailwind 与 W3C DTCG 的 CLI。
- [Waza](https://github.com/tw93/Waza) ⭐ 长期推荐：把成熟工程习惯封装为 Claude、Codex 等编程 Agent 可执行的技能，覆盖调试、评审、规划和工程治理等工作流。
- [codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp): 高性能代码智能 MCP 服务，把代码库索引成本地持久知识图谱（毫秒级索引，亚毫秒查询），支持结构搜索、调用链追踪、架构概览与影响分析，单文件静态二进制、零依赖。
- [VidBee](https://github.com/nexmoe/VidBee): 基于 yt-dlp 的开源视频下载器，支持 1000+ 站点；提供 Electron 桌面端、可自托管的 Web/API（Fastify + oRPC + TanStack Start），并内置 RSS 自动下载。

## 网络与代理工具

- [DetectRadar](https://github.com/harrisonwang/detect-radar): 开源的网络环境一致性检测工具，用于核对出口 IP 与浏览器时区、语言和环境特征，并检查 WebRTC、DNS、IPv6 泄露以及 Canvas、Audio、WebGL 等浏览器指纹信号。
- [ProxyBridge](https://github.com/InterceptSuite/ProxyBridge) ⭐ 长期推荐：跨 Windows / macOS / Linux 的轻量代理客户端，可按进程将 TCP 与 UDP 流量转发到 SOCKS5 或 HTTP 代理，Proxifier 的开源替代品。

## 开源系统与硬件

- [AsteroidOS](https://asteroidos.org/): 面向智能手表的开源 Linux 发行版，强调用户对设备和数据的控制，提供日程、闹钟、音乐控制、天气等常用应用，并支持移植到多款 Android 和 Wear OS 手表。

## AI 与提示词

- [Phistory](https://phistory.cc/?agent=claude-code&from=2.1.141&to=2.1.215): 自动归档 Claude Code、Codex 等 Agent CLI 的系统提示词版本，并用 diff 清楚展示每次更新的具体变化，适合研究 AI Coding 工具的迭代方向。
- [MotionSites](https://motionsites.ai/): 面向 Lovable、Bolt、Cursor 和 Claude 的高质量网站提示词、应用与动画案例库，适合查找界面动效灵感和可复用的 AI 建站提示词。
- [Hello Agents](https://hello-agents.datawhale.cc/#/): Datawhale 出品的 AI Agent 入门教程，覆盖基础概念、经典范式和实践案例。
- [Easy-Vibe](https://datawhalechina.github.io/easy-vibe/zh-cn/): Datawhale 的 AI 编程指南，从零基础入门到部署、AI 知识库和 Agent 团队协作。
- [Kimi 提示词专家](https://www.kimi.com/kimiplus/conpg00t7lagbbsfqkq0): Kimi 官方提供的提示词参考与模板集合。

## 信息流

- [Buzzing](https://www.buzzing.cc/): 聚合多领域热门信息的资讯门户。
- [GitHub Daily Rank](https://github.com/OpenGithubs/github-daily-rank) ⭐ 长期推荐：每天更新 GitHub 开源项目飙升榜 Top 10，适合发现近期热门项目。
- [多摸鱼热榜](https://duomoyu.com/hot-list): 整合多个平台热榜的摸鱼一站式入口。
- [科技爱好者周刊](https://github.com/ruanyf/weekly) ⭐ 长期推荐：阮一峰维护的科技内容周刊，每周五发布，长期跟踪技术、工具和趋势。

## 个人项目

- [Codex Switch Helper](https://github.com/frank9306/codex-switch-helper) ⭐ 长期推荐：面向 Windows 的 Codex App 多 Profile 管理工具，用于隔离账号、API Key、Home 和桌面应用数据，并共享 AGENTS.md、Skills 与第三方 Plugins。
- [QuickNav](https://github.com/frank9306/quick-nav-extension) ⭐ 长期推荐：将浏览器新标签页替换为个人导航站，支持卡片管理、智能搜索、批量编辑、每日备忘和快捷添加网站。

## 学习资料

- [CSS Flexbox Playground](https://yoavsbg.github.io/css-flexbox-playground/): 交互式 Flexbox 学习工具，可实时调整布局属性、观察元素排列变化并复制生成的 CSS，适合通过实验理解主轴、交叉轴、对齐和换行规则。
- [Ship That Code](https://shipthatcode.com/): 项目制编程学习平台，通过从零实现 Redis、Git、数据库、编程语言、容器运行时和操作系统内核等系统来学习底层原理，练习代码需要在真实执行器中通过测试。
- [Ebook Treasure Chest](https://jbiaojerry.github.io/ebook-treasure-chest/): 支持搜索的电子书资源索引，覆盖中文 EPUB、MOBI、AZW3 等格式。
- [小林面试笔记](https://xiaolinnote.com/): 图解 Agent、RAG、LLM 和 Claude Code 的大模型面试题与学习笔记。

## 代理服务

- [FlowerCloud](https://api-flowercloud.com/aff.php?aff=22108): 代理机场服务，提供稳定的跨境网络节点。
- [次元.vip](https://次元.vip/auth/register?code=mE1o) ⭐ 长期推荐：代理机场服务，支持多协议多节点。此链接含邀请码，建议先短期测试线路质量。
- [Web3AA](https://web3aa.com/f/A25qRdl2): 面向 Web3 场景的代理机场服务。
