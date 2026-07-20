import { defineConfig } from 'vitepress'

const base = '/'

function tokenizeSearchText(text: string) {
  const tokens = text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)

  for (const match of text.matchAll(/[\p{Script=Han}]+/gu)) {
    const value = match[0]

    for (const char of value) {
      tokens.push(char)
    }

    for (let index = 0; index < value.length - 1; index += 1) {
      tokens.push(value.slice(index, index + 2))
    }
  }

  return tokens
}

export default defineConfig({
  title: 'Frank 的知识库',
  description: '技术笔记、自动化实践、AI Agent 学习与个人知识沉淀。',
  lang: 'zh-CN',
  base,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: [/^https?:\/\/localhost(:\d+)?/, /^https?:\/\/127\.0\.0\.1(:\d+)?/],
  markdown: {
    html: false
  },
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: '首页', link: '/' },
      { text: '专题', link: '/topics/' },
      { text: '文章', link: '/blog/' },
      { text: '好文分享', link: '/reading/' },
      { text: '资源', link: '/resources/' },
      {
        text: '关于',
        items: [
          { text: '关于我', link: '/about' },
          { text: 'AGENTS.md', link: '/agents' },
          { text: 'Agent Skills', link: '/skills' }
        ]
      }
    ],
    sidebar: {
      '/topics/': [
        {
          text: '知识专题',
          items: [
            { text: '专题总览', link: '/topics/' },
            { text: 'AI 编程工程', link: '/ai-coding/' },
            { text: 'AI Agent', link: '/ai-agent/' },
            { text: 'Python 自动化', link: '/python-automation/' },
            { text: 'Web / React', link: '/web-react/' },
            { text: 'RPA / Playwright', link: '/rpa-playwright/' }
          ]
        }
      ],
      '/ai-coding/': [
        {
          text: 'AI 编程工程',
          items: [
            { text: '专题首页', link: '/ai-coding/' },
            { text: 'Vibe Coding 治理', link: '/ai-coding/vibe-coding-governance' },
            { text: 'AGENTS.md 项目契约', link: '/ai-coding/agents-md-project-contract' },
            { text: 'AI 编程任务闭环', link: '/ai-coding/agent-development-loop' },
            { text: 'Agent Skill 生命周期', link: '/ai-coding/agent-skill-lifecycle' },
            { text: 'MCP、Plugin 与 Connector', link: '/ai-coding/mcp-plugin-connector-decision' },
            { text: '权限边界与供应链安全', link: '/ai-coding/ai-coding-security-boundaries' }
          ]
        }
      ],
      '/blog/': [
        {
          text: '文章',
          items: [{ text: '文章索引', link: '/blog/' }]
        }
      ],
      '/resources/': [
        {
          text: '资源',
          items: [{ text: '资源导航', link: '/resources/' }]
        }
      ],
      '/reading/': [
        {
          text: '好文分享',
          items: [{ text: '文章索引', link: '/reading/' }]
        }
      ]
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/frank9306' }],
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            tokenize: tokenizeSearchText,
            processTerm: (term) => term.toLowerCase()
          },
          searchOptions: {
            prefix: true,
            fuzzy: 0.2
          }
        }
      }
    },
    footer: {
      message: 'Built with VitePress and GitHub Pages.',
      copyright: 'Copyright © 2025-present Frank'
    }
  },
  head: [
    ['link', { rel: 'icon', href: `${base}logo.svg` }],
    ['meta', { name: 'theme-color', content: '#0b0c0c' }],
    [
      'script',
      {
        defer: '',
        src: 'https://state.webfrank.top/script.js',
        'data-website-id': 'e68adff9-c909-4ae8-936a-ab2dcc85f09a'
      }
    ]
  ]
})
