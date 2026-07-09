import { defineConfig } from 'vitepress'

const base = '/'
const styleInitScript = `;(() => {
  try {
    const style = localStorage.getItem('my-knowledge-site-style') || 'warm-bronze'
    document.documentElement.dataset.siteStyle = style === 'codex-helper' ? 'codex-helper' : 'warm-bronze'
  } catch {
    document.documentElement.dataset.siteStyle = 'warm-bronze'
  }
})()`

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
            { text: 'AI Agent', link: '/ai-agent/' },
            { text: 'Python 自动化', link: '/python-automation/' },
            { text: 'Web / React', link: '/web-react/' },
            { text: 'RPA / Playwright', link: '/rpa-playwright/' }
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
    ['script', {}, styleInitScript],
    ['meta', { name: 'theme-color', content: '#8a5a2b' }]
  ]
})
