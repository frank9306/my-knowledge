export const resourceCategories = [
  { id: 'ai-agent', label: 'AI Agent 开源项目' },
  { id: 'network-tools', label: '网络与代理工具' },
  { id: 'open-systems', label: '开源系统与硬件' },
  { id: 'ai-prompts', label: 'AI 与提示词' },
  { id: 'information', label: '信息流' },
  { id: 'discovery', label: '创意与项目发现' },
  { id: 'personal', label: '个人项目' },
  { id: 'learning', label: '学习资料' },
  { id: 'proxy-services', label: '代理服务' }
] as const

export type ResourceCategoryId = (typeof resourceCategories)[number]['id']

export interface Resource {
  id: string
  title: string
  url: string
  category: ResourceCategoryId
  summary: string
  recommended?: boolean
  audience?: string
  reason?: string
  caution?: string
}

export const resources: readonly Resource[] = [
  {
    id: 'qiaomu-seo',
    title: 'qiaomu-seo',
    url: 'https://github.com/joeseesun/qiaomu-seo',
    category: 'ai-agent',
    summary: '面向 Codex、Claude Code、Cursor 等 Agent 客户端的专业 SEO Skill，覆盖技术审计、收录与流量诊断、关键词—页面规划、站点迁移、代码修复，以及 Google、Bing 和 AI Search 可见性验证；强调证据分级，不承诺排名或收录结果。'
  },
  {
    id: 'brain-md',
    title: 'brain.md',
    url: 'https://github.com/mindmuxai/brain.md',
    category: 'ai-agent',
    summary: '面向 Coding Agent 的持久化项目记忆标准，以仓库内纯 Markdown 保存长期决策、需求和约束，并通过零依赖 CLI 保证读写结构一致。',
    recommended: true,
    audience: '希望让 Claude Code、Codex 等 Coding Agent 跨会话保留项目决策，并在不同 Agent、机器与模型之间共享项目记忆的开发者与团队。',
    reason: '以仓库内纯 Markdown 作为持久化记忆层，通过零依赖 CLI 统一读写，并提供初始化、知识引导、页面维护和内容摄取 Skills。',
    caution: '只沉淀长期有效且难以从代码重建的知识；所有内容必须通过 CLI 写入，不能手工修改 brain 目录。'
  },
  {
    id: 'harness-engineering',
    title: 'Harness Engineering 学习指南',
    url: 'https://github.com/deusyu/harness-engineering',
    category: 'ai-agent',
    summary: '从核心概念、独立思考、中文翻译和实践案例等多个层次系统整理 Harness Engineering，并在仓库自身验证相关原则。',
    recommended: true,
    audience: '希望系统理解 Harness Engineering，并从概念、研究资料进一步走向项目实践的 AI 编程开发者。',
    reason: '围绕仓库即记录系统、渐进式披露、机械化约束、智能体可读性、反馈回路和熵管理，兼具学习深度与工程示范价值。',
    caution: '这是持续生长的个人学习档案；应用到团队前，应回看原始资料并结合项目规模、风险和验证能力取舍。'
  },
  {
    id: 'better-harness',
    title: 'Better Harness',
    url: 'https://github.com/QoderAI/better-harness',
    category: 'ai-agent',
    summary: '面向 AI 编程工作流的开源评审与持续改进工具，从任务理解、受控执行、变更验证、可靠交付和经验沉淀五个维度收集证据、生成报告。'
  },
  {
    id: 'ai-agent-book',
    title: '深入理解 AI Agent：设计原理与工程实践',
    url: 'https://github.com/bojieli/ai-agent-book',
    category: 'ai-agent',
    summary: '李博杰编写的开源 AI Agent 教材，用 10 章系统讲解设计原理与工程实践，提供全书正文、PDF / EPUB 和 92 个配套实验。'
  },
  {
    id: 'office-cli',
    title: 'OfficeCLI',
    url: 'https://github.com/iOfficeAI/OfficeCLI/blob/main/README_zh.md',
    category: 'ai-agent',
    summary: '面向 AI Agent 的开源 Office 命令行工具，可跨平台创建、读取、修改和验证 Word、Excel、PowerPoint 文档，并提供 MCP 集成。'
  },
  {
    id: 'deep-tutor',
    title: 'DeepTutor',
    url: 'https://deeptutor.info/zh-cn/',
    category: 'ai-agent',
    summary: 'Agent-native 的开源个性化学习伴侣，将对话、知识库、可审计记忆、协同写作、交互式书本与学习空间整合到本地工作区。'
  },
  {
    id: 'agent-reach',
    title: 'Agent-Reach',
    url: 'https://github.com/Panniantong/Agent-Reach',
    category: 'ai-agent',
    summary: '给 AI Agent 一键安装互联网能力，统一接入 Twitter、Reddit、YouTube、GitHub、B 站、小红书等平台。'
  },
  {
    id: 'ponytail',
    title: 'ponytail',
    url: 'https://github.com/DietrichGebert/ponytail',
    category: 'ai-agent',
    summary: '让 AI Agent 像资深工程师一样先看再写，减少冗余代码与 token 消耗。'
  },
  {
    id: 'headroom',
    title: 'headroom',
    url: 'https://github.com/headroomlabs-ai/headroom',
    category: 'ai-agent',
    summary: '在 LLM 之前压缩工具输出、日志和 RAG 片段，可作为库、代理或 MCP 服务运行。'
  },
  {
    id: 'open-montage',
    title: 'OpenMontage',
    url: 'https://github.com/calesthio/OpenMontage',
    category: 'ai-agent',
    summary: '开源 Agentic 视频生产系统，通过多条流水线和工具把 AI 编程助手扩展为视频制作工作室。'
  },
  {
    id: 'design-md',
    title: 'DESIGN.md',
    url: 'https://github.com/google-labs-code/design.md',
    category: 'ai-agent',
    summary: 'Google Labs 推出的视觉设计系统声明格式，用结构化 token 与 Markdown 说明为编程 Agent 提供持久的设计源。',
    recommended: true,
    audience: '希望让 AI 编程 Agent 稳定理解并遵守项目视觉规范的团队。',
    reason: '结构化设计 token 与 Markdown 说明共同保存视觉决策，并提供 lint、diff 和格式导出能力。',
    caution: '规范仍在持续演进，升级版本前应检查格式和 CLI 行为变化。'
  },
  {
    id: 'waza',
    title: 'Waza',
    url: 'https://github.com/tw93/Waza',
    category: 'ai-agent',
    summary: '把成熟工程习惯封装为 Claude、Codex 等编程 Agent 可执行的技能，覆盖调试、评审、规划和工程治理。',
    recommended: true,
    audience: '希望把成熟工程习惯沉淀为 Claude、Codex 等编程 Agent 可执行技能的开发者。',
    reason: '将调试、评审、规划和工程治理等经验封装成可复用技能，展示 Agent 工作流如何从提示词走向稳定流程。',
    caution: '不要一次启用全部技能；应按项目需要选择，并检查规则是否与现有工程约定冲突。'
  },
  {
    id: 'codebase-memory-mcp',
    title: 'codebase-memory-mcp',
    url: 'https://github.com/DeusData/codebase-memory-mcp',
    category: 'ai-agent',
    summary: '高性能代码智能 MCP 服务，把代码库索引成本地持久知识图谱，支持结构搜索、调用链追踪、架构概览与影响分析。'
  },
  {
    id: 'vidbee',
    title: 'VidBee',
    url: 'https://github.com/nexmoe/VidBee',
    category: 'ai-agent',
    summary: '基于 yt-dlp 的开源视频下载器，提供 Electron 桌面端、可自托管 Web/API 和 RSS 自动下载。'
  },
  {
    id: 'detect-radar',
    title: 'DetectRadar',
    url: 'https://github.com/harrisonwang/detect-radar',
    category: 'network-tools',
    summary: '开源的网络环境一致性检测工具，用于核对出口 IP、时区、语言、WebRTC、DNS、IPv6 泄露和浏览器指纹信号。'
  },
  {
    id: 'proxy-bridge',
    title: 'ProxyBridge',
    url: 'https://github.com/InterceptSuite/ProxyBridge',
    category: 'network-tools',
    summary: '跨 Windows、macOS 和 Linux 的轻量代理客户端，可按进程将 TCP、UDP 流量转发到 SOCKS5 或 HTTP 代理。',
    recommended: true,
    audience: '需要在 Windows、macOS 或 Linux 上按进程转发 TCP、UDP 流量的用户。',
    reason: '可以把应用流量转发到 HTTP 或 SOCKS5 代理，是 Proxifier 的开源替代方案。',
    caution: '网络转发涉及系统权限和路由规则，首次使用应先用非关键应用验证配置。'
  },
  {
    id: 'asteroid-os',
    title: 'AsteroidOS',
    url: 'https://asteroidos.org/',
    category: 'open-systems',
    summary: '面向智能手表的开源 Linux 发行版，强调用户对设备和数据的控制，并支持移植到多款 Android 和 Wear OS 手表。'
  },
  {
    id: 'prompt-engineering-guide',
    title: '提示工程指南',
    url: 'https://www.promptingguide.ai/zh',
    category: 'ai-prompts',
    summary: 'DAIR.AI 维护的系统化中文提示工程资料，覆盖提示技术、RAG、ReAct、安全、模型资料、Agent 与上下文工程。',
    recommended: true,
    audience: '希望系统学习提示工程、上下文工程和大语言模型应用方法的开发者与研究者。',
    reason: '中文内容覆盖从提示词基础到 Agent 的主要主题，并整理论文、工具、课程与示例，适合入门和专题查阅。',
    caution: '部分模型页面和案例可能随技术演进而过时，应结合目标模型的最新官方文档和实际评测验证。'
  },
  {
    id: 'phistory',
    title: 'Phistory',
    url: 'https://phistory.cc/?agent=claude-code&from=2.1.141&to=2.1.215',
    category: 'ai-prompts',
    summary: '自动归档 Claude Code、Codex 等 Agent CLI 的系统提示词版本，并用 diff 展示每次更新。'
  },
  {
    id: 'motion-sites',
    title: 'MotionSites',
    url: 'https://motionsites.ai/',
    category: 'ai-prompts',
    summary: '面向 Lovable、Bolt、Cursor 和 Claude 的网站提示词、应用与动画案例库。'
  },
  {
    id: 'hello-agents',
    title: 'Hello Agents',
    url: 'https://hello-agents.datawhale.cc/#/',
    category: 'ai-prompts',
    summary: 'Datawhale 出品的 AI Agent 入门教程，覆盖基础概念、经典范式和实践案例。'
  },
  {
    id: 'easy-vibe',
    title: 'Easy-Vibe',
    url: 'https://datawhalechina.github.io/easy-vibe/zh-cn/',
    category: 'ai-prompts',
    summary: 'Datawhale 的 AI 编程指南，从零基础入门到部署、AI 知识库和 Agent 团队协作。'
  },
  {
    id: 'kimi-prompt-expert',
    title: 'Kimi 提示词专家',
    url: 'https://www.kimi.com/kimiplus/conpg00t7lagbbsfqkq0',
    category: 'ai-prompts',
    summary: 'Kimi 官方提供的提示词参考与模板集合。'
  },
  {
    id: 'buzzing',
    title: 'Buzzing',
    url: 'https://www.buzzing.cc/',
    category: 'information',
    summary: '聚合多领域热门信息的资讯门户。'
  },
  {
    id: 'github-daily-rank',
    title: 'GitHub Daily Rank',
    url: 'https://github.com/OpenGithubs/github-daily-rank',
    category: 'information',
    summary: '每天整理 GitHub 开源项目飙升榜 Top 10，适合作为固定的信息入口。',
    recommended: true,
    audience: '想快速发现近期热门开源项目，又不想持续刷 GitHub Trending 的开发者。',
    reason: '每天整理开源项目飙升榜 Top 10，信息密度高，适合作为固定的信息入口。',
    caution: '热度不等于质量或长期维护能力，采用项目前仍需检查许可证、提交活跃度和 issue 状态。'
  },
  {
    id: 'duomoyu',
    title: '多摸鱼热榜',
    url: 'https://duomoyu.com/hot-list',
    category: 'information',
    summary: '整合多个平台热榜的一站式信息入口。'
  },
  {
    id: 'ruanyf-weekly',
    title: '科技爱好者周刊',
    url: 'https://github.com/ruanyf/weekly',
    category: 'information',
    summary: '阮一峰维护的科技内容周刊，长期跟踪技术、工具、产品与互联网趋势。',
    recommended: true,
    audience: '希望长期跟踪技术、工具、产品与互联网趋势的读者。',
    reason: '持续按周整理值得阅读的技术内容，选题范围广，适合定期浏览和回查。',
    caution: '内容覆盖面较广，建议把它作为发现入口，再阅读原始资料形成判断。'
  },
  {
    id: 'figma-community',
    title: 'Figma Community',
    url: 'https://www.figma.com/community',
    category: 'discovery',
    summary: '浏览和获取社区共享的设计文件、组件、插件与模板。'
  },
  {
    id: 'hugging-face-spaces',
    title: 'Hugging Face Spaces',
    url: 'https://huggingface.co/spaces',
    category: 'discovery',
    summary: '发现和体验社区发布的机器学习与 AI 应用演示。'
  },
  {
    id: 'product-hunt',
    title: 'Product Hunt',
    url: 'https://www.producthunt.com/?bc=1',
    category: 'discovery',
    summary: '发现新发布的科技产品、应用和开发者工具。'
  },
  {
    id: 'github-trending',
    title: 'GitHub Trending',
    url: 'https://github.com/trending',
    category: 'discovery',
    summary: '查看 GitHub 当前热门的开源仓库与开发者项目。'
  },
  {
    id: 'codex-switch-helper',
    title: 'Codex Switch Helper',
    url: 'https://github.com/frank9306/codex-switch-helper',
    category: 'personal',
    summary: '面向 Windows 的 Codex App 多 Profile 管理工具，用于隔离账号、API Key、Home 和桌面应用数据。',
    recommended: true,
    audience: '需要在 Windows 上管理多个 Codex App 账号、API Key、Provider 和并行实例的用户。',
    reason: '每个 Profile 隔离 Home、登录状态和桌面应用数据，同时共享 AGENTS.md、Skills 与第三方 Plugins。',
    caution: '配置中可能包含敏感凭据，导入、备份或分享前应检查并妥善保护。'
  },
  {
    id: 'quick-nav',
    title: 'QuickNav',
    url: 'https://github.com/frank9306/quick-nav-extension',
    category: 'personal',
    summary: '将浏览器新标签页替换为个人导航站，支持卡片管理、智能搜索、批量编辑、每日备忘和快捷添加网站。',
    recommended: true,
    audience: '希望用个人导航站替换浏览器默认新标签页的用户。',
    reason: '把常用网站、搜索和每日备忘集中到新标签页，并支持导航项管理与快捷添加。',
    caution: '浏览器扩展升级前应关注权限变化，并定期备份个人导航数据。'
  },
  {
    id: 'css-flexbox-playground',
    title: 'CSS Flexbox Playground',
    url: 'https://yoavsbg.github.io/css-flexbox-playground/',
    category: 'learning',
    summary: '交互式 Flexbox 学习工具，可实时调整布局属性、观察元素排列变化并复制生成的 CSS。'
  },
  {
    id: 'ship-that-code',
    title: 'Ship That Code',
    url: 'https://shipthatcode.com/',
    category: 'learning',
    summary: '项目制编程学习平台，通过实现 Redis、Git、数据库、编程语言、容器运行时和操作系统内核等系统学习底层原理。'
  },
  {
    id: 'ebook-treasure-chest',
    title: 'Ebook Treasure Chest',
    url: 'https://jbiaojerry.github.io/ebook-treasure-chest/',
    category: 'learning',
    summary: '支持搜索的电子书资源索引，覆盖中文 EPUB、MOBI、AZW3 等格式。'
  },
  {
    id: 'xiaolin-note',
    title: '小林面试笔记',
    url: 'https://xiaolinnote.com/',
    category: 'learning',
    summary: '图解 Agent、RAG、LLM 和 Claude Code 的大模型面试题与学习笔记。'
  },
  {
    id: 'flower-cloud',
    title: 'FlowerCloud',
    url: 'https://api-flowercloud.com/aff.php?aff=22108',
    category: 'proxy-services',
    summary: '代理机场服务，提供跨境网络节点。'
  },
  {
    id: 'ciyuan-vip',
    title: '次元.vip',
    url: 'https://次元.vip/auth/register?code=mE1o',
    category: 'proxy-services',
    summary: '代理机场服务，支持多协议、多节点。',
    recommended: true,
    audience: '需要多协议、多节点代理服务的用户。',
    reason: '提供跨境网络节点，可作为日常网络工具的备选服务。',
    caution: '这是带邀请码的注册链接；线路质量可能随地区和时间变化，建议先短期测试。'
  },
  {
    id: 'web3aa',
    title: 'Web3AA',
    url: 'https://web3aa.com/f/A25qRdl2',
    category: 'proxy-services',
    summary: '面向 Web3 场景的代理机场服务。'
  }
]

function validateResources(items: readonly Resource[]) {
  const categoryIds = new Set(resourceCategories.map(({ id }) => id))
  const ids = new Set<string>()

  for (const item of items) {
    if (ids.has(item.id)) throw new Error(`Duplicate resource id: ${item.id}`)
    ids.add(item.id)
    if (!categoryIds.has(item.category)) throw new Error(`Unknown resource category: ${item.category}`)
    if (!item.title.trim() || !item.url.trim() || !item.summary.trim()) {
      throw new Error(`Resource ${item.id} is missing required content`)
    }
    if (item.recommended && (!item.audience?.trim() || !item.reason?.trim() || !item.caution?.trim())) {
      throw new Error(`Recommended resource ${item.id} is missing recommendation details`)
    }
  }
}

validateResources(resources)
