import { resources } from './resources'
import { classifyFavoriteResource } from './archive-state.mjs'

export const favoriteCategories = [
  { id: 'ai-agent', label: 'AI 与 Agent' },
  { id: 'developer-tools', label: '开发工具' },
  { id: 'automation', label: '自动化' },
  { id: 'learning', label: '学习资料' },
  { id: 'discovery', label: '信息发现' },
  { id: 'network', label: '网络与服务' }
] as const

export type FavoriteCategory = (typeof favoriteCategories)[number]['id']
export type FavoriteType = 'resource' | 'article'

export interface FavoriteItem {
  id: string
  title: string
  url: string
  summary: string
  type: FavoriteType
  category: FavoriteCategory
}

const readingItems: FavoriteItem[] = [
  { id: 'yao-ai-next-level', title: '姚期智万字长文演讲！解析“AI 研究的下一个层次”', url: 'https://www.myzaker.com/article/6a60252f8e9f094b4d106689', summary: '从理论计算机科学出发，讨论 AI 能力边界、AI for Science 与可靠大模型。', type: 'article', category: 'ai-agent' },
  { id: 'openai-harness-engineering', title: '工程技术：在智能体优先的世界中利用 Codex', url: 'https://openai.com/zh-Hans-CN/index/harness-engineering/', summary: '以仓库、可执行约束、可观测性和反馈回路支撑智能体可靠工作。', type: 'article', category: 'ai-agent' },
  { id: 'better-harness-article', title: 'Better Harness 开源了：立即把 Harness 专家带进你的 AI Coding 工具', url: 'https://mp.weixin.qq.com/s/PuMpxU1ruXlTgT_JWKoHfQ', summary: '围绕任务证据评估并持续改善 Coding Agent 工作流。', type: 'article', category: 'ai-agent' },
  { id: 'aiewf-trends', title: '5 Trends That Defined AI Engineering at World’s Fair 2026', url: 'https://www.latent.space/p/aiewf26trends', summary: '观察 Harness、Loop、FDE、Coding Agent 与 Skills 的工程趋势。', type: 'article', category: 'ai-agent' },
  { id: 'claude-ai-course', title: 'Anthropic 免费 Claude AI 工程课程', url: 'https://x.com/huoshan007/status/2076944286231531664', summary: '约四小时课程，覆盖提示、内部实践与 Agent 构建循环。', type: 'article', category: 'learning' },
  { id: 'getting-started-loops', title: 'Getting started with loops', url: 'https://x.com/ClaudeDevs/status/2074208949205881033', summary: '从触发方式、停止条件与边界说明四类 Agent 循环。', type: 'article', category: 'ai-agent' },
  { id: 'everything-claude-code', title: 'Everything Claude Code 中文指南', url: 'https://github.com/affaan-m/ECC/blob/main/README.zh-CN.md', summary: '整理 agents、skills、hooks、rules、MCP、验证循环与安全审计。', type: 'article', category: 'learning' },
  { id: 'git-exclude', title: 'Git exclude, a handy feature you might not know about', url: 'https://marijkeluttekes.dev/blog/articles/2025/09/03/git-exclude-a-handy-feature-you-might-not-know-about/', summary: '说明项目、仓库副本与全局三类 Git 忽略规则的边界。', type: 'article', category: 'developer-tools' },
  { id: 'git-before-code', title: 'The Git Commands I Run Before Reading Any Code', url: 'https://piechowski.io/post/git-commands-before-reading-code/', summary: '用 Git 统计建立陌生代码库的风险地图。', type: 'article', category: 'developer-tools' }
]

export const favorites: FavoriteItem[] = [
  ...resources.map((resource) => ({
    id: `resource-${resource.id}`,
    title: resource.title,
    url: resource.url,
    summary: resource.summary,
    type: 'resource' as const,
    category: classifyFavoriteResource(resource) as FavoriteCategory
  })),
  ...readingItems
]
